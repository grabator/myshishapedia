/*
 * MyShishapedia - ocjene: zajednička pravila za server.
 *
 * Koriste ga Cloudflare Pages Functions (functions/api/ratings/...) i lokalni
 * lažni API u serve.mjs, pa obje strane provjeravaju ocjene na isti način.
 * Samo čist JavaScript (radi i u Cloudflare Workers okruženju i u Node-u).
 */

export const KINDS = ['flavor', 'recipe'];
export const MIN_STARS = 1;
export const MAX_STARS = 5;

// Najviše RATE_LIMIT_MAX slanja ocjena sa iste (hashirane) IP adrese u RATE_LIMIT_WINDOW sekundi.
export const RATE_LIMIT_WINDOW = 600;
export const RATE_LIMIT_MAX = 30;

// Fajl sa dozvoljenim id-jevima okusa i recepata (pravi ga build.mjs u dist/).
export const IDS_PATH = '/ratings-ids.json';

// Turnstile "action": klijent ga šalje pri provjeri, server ga provjerava.
export const TURNSTILE_ACTION = 'rate';

const DEVICE_RE = /^[a-f0-9]{32}$/;
const ID_RE = /^[a-z0-9-]{1,80}$/;

/**
 * Provjera tijela zahtjeva za slanje ocjene.
 * ids: { flavor: [...], recipe: [...] } iz ratings-ids.json.
 * Vraća { ok: true, value } ili { ok: false, error }.
 */
export function validateRating(body, ids) {
  if (!body || typeof body !== 'object') return { ok: false, error: 'bad-body' };
  const { kind, id, stars, device, token } = body;
  if (!KINDS.includes(kind)) return { ok: false, error: 'bad-kind' };
  if (typeof id !== 'string' || !ID_RE.test(id)) return { ok: false, error: 'bad-id' };
  if (!ids || !Array.isArray(ids[kind]) || !ids[kind].includes(id)) return { ok: false, error: 'unknown-id' };
  if (!Number.isInteger(stars) || stars < MIN_STARS || stars > MAX_STARS) return { ok: false, error: 'bad-stars' };
  if (typeof device !== 'string' || !DEVICE_RE.test(device)) return { ok: false, error: 'bad-device' };
  if (typeof token !== 'string' || !token || token.length > 4096) return { ok: false, error: 'bad-token' };
  return { ok: true, value: { kind, id, stars, device, token } };
}

/** Provjera para kind/id iz adrese (/api/ratings/<kind>/<id>). */
export function validItem(kind, id, ids) {
  return KINDS.includes(kind) && typeof id === 'string' && ID_RE.test(id) && !!ids && Array.isArray(ids[kind]) && ids[kind].includes(id);
}

export function round2(n) { return Math.round(n * 100) / 100; }

/** Zbir i broj ocjena -> [prosjek, broj]. */
export function summary(sum, count) {
  return count > 0 ? [round2(sum / count), count] : [0, 0];
}

/**
 * Redovi { kind, item_id, count, sum } -> odgovor za sve ocjene:
 * { v: 1, flavor: { <id>: [prosjek, broj] }, recipe: { ... } }
 */
export function payloadFromTotals(rows) {
  const out = { v: 1 };
  for (const k of KINDS) out[k] = {};
  for (const r of rows || []) {
    const count = Number(r.count) || 0;
    if (!count || !out[r.kind]) continue;
    out[r.kind][r.item_id] = summary(Number(r.sum) || 0, count);
  }
  return out;
}

const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

/** SHA-256 kao hex (Web Crypto; postoji i u Workers okruženju i u Node-u 18+). */
export async function sha256(text) {
  return hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
}

/** U bazi se čuva samo hash ID-a uređaja, nikad sam ID. */
export function deviceKey(device) { return sha256('msp-device|' + device); }

/** Ključ za ograničenje broja zahtjeva: hash IP adrese (sama IP adresa se ne čuva). */
export async function rateKey(ip, salt) { return (await sha256('msp-ip|' + (salt || '') + '|' + (ip || ''))).slice(0, 40); }

export function rateWindow(nowSec) { return Math.floor(nowSec / RATE_LIMIT_WINDOW); }

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: Object.assign({
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store'
    }, headers)
  });
}
