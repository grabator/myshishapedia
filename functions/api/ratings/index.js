/*
 * MyShishapedia - API za ocjene (Cloudflare Pages Functions + D1).
 *
 *   GET  /api/ratings   -> { v: 1, flavor: { <id>: [prosjek, broj] }, recipe: { ... } }
 *   POST /api/ratings   <- { kind, id, stars, device, token }
 *                       -> { ok: true, kind, id, stars, avg, count }
 *
 * Potrebno (vidi docs/UPUTSTVO.md, "Ocjene"):
 *   - D1 baza povezana kao binding "DB" (tabele iz migrations/0001_ratings.sql)
 *   - TURNSTILE_SECRET_KEY kao secret (Turnstile zaštita od robota)
 *   - opcionalno RATE_SALT (secret) za hash IP adrese; bez njega se koristi TURNSTILE_SECRET_KEY
 */
import {
  validateRating, payloadFromTotals, summary, deviceKey, rateKey, rateWindow, json,
  RATE_LIMIT_MAX, RATE_LIMIT_WINDOW, TURNSTILE_ACTION
} from '../../../lib/ratings-core.mjs';
import { loadIds, notConfigured, allCacheKey } from '../../../lib/ratings-pages.mjs';

const EDGE_TTL = 30; // sekundi: koliko dugo Cloudflare rub čuva odgovor sa svim ocjenama
const BROWSER_TTL = 15;

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!env.DB) return notConfigured();
  const cache = caches.default;
  const key = allCacheKey(request);
  const hit = await cache.match(key);
  if (hit) return hit;

  try {
    const { results } = await env.DB.prepare('SELECT kind, item_id, count, sum FROM rating_totals WHERE count > 0').all();
    const res = json(payloadFromTotals(results), 200, { 'Cache-Control': 'public, max-age=' + BROWSER_TTL });
    const edge = res.clone();
    const stored = new Response(edge.body, edge);
    stored.headers.set('Cache-Control', 'public, max-age=' + EDGE_TTL);
    context.waitUntil(cache.put(key, stored));
    return res;
  } catch (e) {
    return json({ error: 'db-error' }, 503);
  }
}

async function verifyTurnstile(env, token, ip) {
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET_KEY);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const out = await r.json();
    return !!out.success && (!out.action || out.action === TURNSTILE_ACTION);
  } catch (e) {
    return false;
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!env.DB || !env.TURNSTILE_SECRET_KEY) return notConfigured();

  const type = request.headers.get('Content-Type') || '';
  if (!type.includes('application/json')) return json({ error: 'bad-body' }, 415);
  const len = Number(request.headers.get('Content-Length') || 0);
  if (len > 8192) return json({ error: 'bad-body' }, 413);

  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad-body' }, 400); }

  let ids;
  try { ids = await loadIds(context); } catch (e) { return json({ error: 'not-ready' }, 503); }
  const check = validateRating(body, ids);
  if (!check.ok) return json({ error: check.error }, 400);
  const { kind, id, stars, device, token } = check.value;

  // ograničenje broja slanja po hashu IP adrese
  const ip = request.headers.get('CF-Connecting-IP') || '';
  const now = Math.floor(Date.now() / 1000);
  const win = rateWindow(now);
  const rk = await rateKey(ip, env.RATE_SALT || env.TURNSTILE_SECRET_KEY);
  try {
    const row = await env.DB.prepare(
      'INSERT INTO rate_limits (key, window_start, hits) VALUES (?1, ?2, 1) ' +
      'ON CONFLICT(key) DO UPDATE SET hits = CASE WHEN window_start = ?2 THEN hits + 1 ELSE 1 END, window_start = ?2 ' +
      'RETURNING hits'
    ).bind(rk, win).first();
    if (row && row.hits > RATE_LIMIT_MAX) {
      return json({ error: 'rate-limited' }, 429, { 'Retry-After': String(RATE_LIMIT_WINDOW) });
    }
  } catch (e) {
    return json({ error: 'db-error' }, 503);
  }
  // povremeno počisti stare zapise o ograničenju
  if (Math.random() < 0.02) {
    context.waitUntil(env.DB.prepare('DELETE FROM rate_limits WHERE window_start < ?1').bind(win - 6).run().catch(() => {}));
  }

  if (!(await verifyTurnstile(env, token, ip))) return json({ error: 'turnstile' }, 403);

  const dev = await deviceKey(device);
  try {
    const [, , totals] = await env.DB.batch([
      env.DB.prepare(
        'INSERT INTO ratings (kind, item_id, device, stars, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?5) ' +
        'ON CONFLICT(kind, item_id, device) DO UPDATE SET stars = excluded.stars, updated_at = excluded.updated_at'
      ).bind(kind, id, dev, stars, now),
      env.DB.prepare(
        'INSERT INTO rating_totals (kind, item_id, count, sum) ' +
        'SELECT ?1, ?2, COUNT(*), COALESCE(SUM(stars), 0) FROM ratings WHERE kind = ?1 AND item_id = ?2 ' +
        'ON CONFLICT(kind, item_id) DO UPDATE SET count = excluded.count, sum = excluded.sum'
      ).bind(kind, id),
      env.DB.prepare('SELECT count, sum FROM rating_totals WHERE kind = ?1 AND item_id = ?2').bind(kind, id)
    ]);
    const t = (totals.results && totals.results[0]) || { count: 0, sum: 0 };
    const [avg, count] = summary(Number(t.sum), Number(t.count));
    context.waitUntil(caches.default.delete(allCacheKey(request)).catch(() => {}));
    return json({ ok: true, kind, id, stars, avg, count });
  } catch (e) {
    return json({ error: 'db-error' }, 503);
  }
}
