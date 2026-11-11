/*
 * MyShishapedia - Shisha Drop: API za nadimke, dnevne rezultate i rang liste.
 *
 * Koriste ga Cloudflare Pages Functions (functions/api/game/[action].js) i lokalni
 * server (serve.mjs, sa SQLite bazom koja se ponaša kao D1), pa je ponašanje isto.
 *
 *   GET  /api/game/today                         -> { day, week, msToNext }
 *   GET  /api/game/player?device=...             -> { nick | null, removed }
 *   POST /api/game/player   { device, nick }     -> { ok, nick }
 *   POST /api/game/score    { device, day, ... } -> { ok, rank, total, score }
 *   GET  /api/game/board?scope=day|week|lastweek&device=&venue=  -> { scope, day, week, top[], me, total }
 *   GET  /api/game/venue?venue=babylon           -> { venue, inside, wifiSet }   (liga kafića)
 *   POST /api/game/venue-wifi { venue, pin, reset? } -> zapamti WiFi kafića (sa tog WiFi-ja)
 * Za ligu kafića POST /score dobije i "venue"; prima se samo sa WiFi-ja tog kafića (lib/game-venues.mjs).
 *
 * Tabele se prave same pri prvom pozivu (CREATE TABLE IF NOT EXISTS), pa poslije
 * objave ne treba ništa ručno pokretati. Iste naredbe su u migrations/0002_game.sql.
 * "device" iz browsera se nikad ne čuva: u bazi je samo njegov hash.
 */
import core from '../js/game-core.js';
import { VENUES } from './game-venues.mjs';

export const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS game_players (
    device     TEXT    PRIMARY KEY,
    nick       TEXT    NOT NULL,
    nick_key   TEXT    NOT NULL UNIQUE,
    removed    INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS game_scores (
    day        TEXT    NOT NULL,
    device     TEXT    NOT NULL,
    week       TEXT    NOT NULL,
    score      INTEGER NOT NULL,
    drops      INTEGER NOT NULL,
    merges     INTEGER NOT NULL,
    golden     INTEGER NOT NULL,
    max_level  INTEGER NOT NULL,
    ms         INTEGER NOT NULL,
    iced       INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (day, device)
  )`,
  'CREATE INDEX IF NOT EXISTS game_scores_day ON game_scores (day, score DESC)',
  'CREATE INDEX IF NOT EXISTS game_scores_week ON game_scores (week, device)',
  `CREATE TABLE IF NOT EXISTS game_venue_scores (
    venue      TEXT    NOT NULL,
    day        TEXT    NOT NULL,
    device     TEXT    NOT NULL,
    week       TEXT    NOT NULL,
    score      INTEGER NOT NULL,
    drops      INTEGER NOT NULL,
    merges     INTEGER NOT NULL,
    golden     INTEGER NOT NULL,
    max_level  INTEGER NOT NULL,
    ms         INTEGER NOT NULL,
    iced       INTEGER NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (venue, day, device)
  )`,
  'CREATE INDEX IF NOT EXISTS game_venue_scores_day ON game_venue_scores (venue, day, score DESC)',
  'CREATE INDEX IF NOT EXISTS game_venue_scores_week ON game_venue_scores (venue, week, device)',
  `CREATE TABLE IF NOT EXISTS game_venue_nets (
    venue      TEXT    NOT NULL,
    net        TEXT    NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (venue, net)
  )`,
  `CREATE TABLE IF NOT EXISTS game_limits (
    key          TEXT    PRIMARY KEY,
    window_start INTEGER NOT NULL,
    hits         INTEGER NOT NULL
  )`
];

export const LIMIT_WINDOW = 600; // sekundi
export const LIMITS = { player: 20, score: 30, admin: 10 };
const MAX_NETS = 6;
export const BOARD_SIZE = 50;
// Partija dnevnog izazova započeta prije ponoći smije se predati još 20 minuta poslije.
export const LATE_GRACE_MS = 20 * 60 * 1000;

const DEVICE_RE = /^[a-f0-9]{32}$/;

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

async function sha256(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function salt(env) { return String(env.GAME_SALT || env.RATE_SALT || env.TURNSTILE_SECRET_KEY || 'msp-shisha-drop'); }

/** Hash uređaja (u bazu nikad ne ide sam ključ iz browsera). */
export async function deviceHash(env, device) { return (await sha256('msp-game-device|' + salt(env) + '|' + device)).slice(0, 40); }

let schemaReady = null;
let schemaDb = null;
/** Napravi tabele ako ih nema (jednom po pokretanju servera, i ponovo ako prvi pokušaj ne uspije). */
export function ensureSchema(db) {
  if (!schemaReady || schemaDb !== db) {
    schemaDb = db;
    schemaReady = db.batch(SCHEMA.map((s) => db.prepare(s))).catch((e) => { schemaReady = null; throw e; });
  }
  return schemaReady;
}

/** Ograničenje broja upisa sa iste (hashirane) IP adrese u LIMIT_WINDOW sekundi. */
async function limited(env, request, bucket, max) {
  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'lokalno';
  const key = (await sha256('msp-game-ip|' + salt(env) + '|' + bucket + '|' + ip)).slice(0, 40);
  const now = Math.floor(Date.now() / 1000);
  const win = Math.floor(now / LIMIT_WINDOW) * LIMIT_WINDOW;
  const row = await env.DB.prepare(
    `INSERT INTO game_limits (key, window_start, hits) VALUES (?1, ?2, 1)
     ON CONFLICT(key) DO UPDATE SET
       hits = CASE WHEN window_start = ?2 THEN hits + 1 ELSE 1 END,
       window_start = ?2
     RETURNING hits`
  ).bind(key, win).first();
  // povremeno obriši stare zapise (stariji od jednog dana), da se hash IP adrese ne čuva dugo
  if (Math.random() < 0.02) await env.DB.prepare('DELETE FROM game_limits WHERE window_start < ?1').bind(now - 86400).run();
  return Number(row ? row.hits : 1) > max;
}

async function readJson(request) {
  if (!String(request.headers.get('Content-Type') || '').includes('application/json')) return null;
  const text = await request.text();
  if (text.length > 4096) return null;
  try { return JSON.parse(text); } catch (e) { return null; }
}

function today(now) {
  const day = core.dayKey(now);
  return { day, week: core.weekKey(day), msToNext: core.msToNextDay(now) };
}

async function getPlayer(env, url) {
  const device = url.searchParams.get('device') || '';
  if (!DEVICE_RE.test(device)) return json({ error: 'bad-device' }, 400);
  const row = await env.DB.prepare('SELECT nick, removed FROM game_players WHERE device = ?1').bind(await deviceHash(env, device)).first();
  if (!row) return json({ nick: null, removed: false });
  return json({ nick: row.removed ? null : row.nick, removed: !!row.removed });
}

async function postPlayer(env, request) {
  const body = await readJson(request);
  if (!body) return json({ error: 'bad-body' }, 400);
  if (typeof body.device !== 'string' || !DEVICE_RE.test(body.device)) return json({ error: 'bad-device' }, 400);
  const check = core.validateNick(body.nick);
  if (!check.ok) return json({ error: check.error }, 400);
  if (await limited(env, request, 'player', LIMITS.player)) return json({ error: 'rate-limited' }, 429, { 'Retry-After': String(LIMIT_WINDOW) });
  const dev = await deviceHash(env, body.device);
  const now = Date.now();
  const taken = await env.DB.prepare('SELECT device FROM game_players WHERE nick_key = ?1').bind(check.key).first();
  if (taken && taken.device !== dev) return json({ error: 'taken' }, 409);
  try {
    await env.DB.prepare(
      `INSERT INTO game_players (device, nick, nick_key, removed, created_at, updated_at) VALUES (?1, ?2, ?3, 0, ?4, ?4)
       ON CONFLICT(device) DO UPDATE SET nick = ?2, nick_key = ?3, removed = 0, updated_at = ?4`
    ).bind(dev, check.nick, check.key, now).run();
  } catch (e) {
    // dva igrača su istovremeno uzela isti nadimak (UNIQUE na nick_key)
    if (/UNIQUE/i.test(String(e && e.message))) return json({ error: 'taken' }, 409);
    throw e;
  }
  return json({ ok: true, nick: check.nick });
}

/*
 * Izvor rezultata: opšta lista (game_scores) ili lista jednog kafića (game_venue_scores).
 * Upiti koriste anonimne parametre (?), a za kafić je prvi parametar id kafića.
 */
function src(venue) {
  return venue
    ? { t: 'game_venue_scores', w: 's.venue = ? AND ', pre: [venue] }
    : { t: 'game_scores', w: '', pre: [] };
}
function q(env, sql, S, args) { return env.DB.prepare(sql).bind(...S.pre, ...args); }

async function dayRank(env, day, dev, S) {
  const join = `FROM ${S.t} s JOIN game_players p ON p.device = s.device WHERE ${S.w}`;
  const mine = await q(env, `SELECT s.score, s.created_at ${join}s.day = ? AND s.device = ? AND p.removed = 0`, S, [day, dev]).first();
  const total = await q(env, `SELECT COUNT(*) AS n ${join}s.day = ? AND p.removed = 0`, S, [day]).first();
  if (!mine) return { me: null, total: Number(total ? total.n : 0) };
  const better = await q(env, `SELECT COUNT(*) AS n ${join}s.day = ? AND p.removed = 0 AND (s.score > ? OR (s.score = ? AND s.created_at < ?))`,
    S, [day, mine.score, mine.score, mine.created_at]).first();
  return { me: { rank: Number(better.n) + 1, score: Number(mine.score) }, total: Number(total ? total.n : 0) };
}

async function weekRank(env, week, dev, S) {
  const join = `FROM ${S.t} s JOIN game_players p ON p.device = s.device WHERE ${S.w}`;
  const mine = await q(env, `SELECT SUM(s.score) AS total, MIN(s.created_at) AS first ${join}s.week = ? AND s.device = ? AND p.removed = 0`, S, [week, dev]).first();
  const count = await q(env, `SELECT COUNT(DISTINCT s.device) AS n ${join}s.week = ? AND p.removed = 0`, S, [week]).first();
  const total = Number(count ? count.n : 0);
  if (!mine || mine.total == null) return { me: null, total };
  const better = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM (SELECT SUM(s.score) AS t, MIN(s.created_at) AS f ${join}s.week = ? AND p.removed = 0 GROUP BY s.device)
     WHERE t > ? OR (t = ? AND f < ?)`
  ).bind(...S.pre, week, mine.total, mine.total, mine.first).first();
  return { me: { rank: Number(better.n) + 1, score: Number(mine.total) }, total };
}

async function postScore(env, request, now) {
  const body = await readJson(request);
  if (!body) return json({ error: 'bad-body' }, 400);
  const check = core.validateScore(body);
  if (!check.ok) return json({ error: check.error }, 400);
  const v = check.value;
  const t = today(now);
  const late = v.day === core.addDays(t.day, -1) && 86400000 - t.msToNext < LATE_GRACE_MS;
  if (v.day !== t.day && !late) return json({ error: 'wrong-day', day: t.day }, 400);
  // liga kafića: partija se prima samo sa WiFi-ja tog kafića
  let venue = null;
  if (body.venue != null) {
    venue = VENUES[body.venue] ? body.venue : null;
    if (!venue) return json({ error: 'bad-venue' }, 400);
    if (!(await insideVenue(env, request, venue))) return json({ error: 'not-inside' }, 403);
  }
  if (await limited(env, request, 'score', LIMITS.score)) return json({ error: 'rate-limited' }, 429, { 'Retry-After': String(LIMIT_WINDOW) });
  const dev = await deviceHash(env, v.device);
  const player = await env.DB.prepare('SELECT removed FROM game_players WHERE device = ?1').bind(dev).first();
  if (!player) return json({ error: 'no-player' }, 400);
  if (player.removed) return json({ error: 'nick-removed' }, 403);
  const S = src(venue);
  const cols = 'day, device, week, score, drops, merges, golden, max_level, ms, iced, created_at';
  const vals = [v.day, dev, core.weekKey(v.day), v.score, v.drops, v.merges, v.golden, v.maxLevel, v.ms, v.iced, Date.now()];
  const res = venue
    ? await env.DB.prepare(`INSERT INTO game_venue_scores (venue, ${cols}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(venue, day, device) DO NOTHING`).bind(venue, ...vals).run()
    : await env.DB.prepare(`INSERT INTO game_scores (${cols}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(day, device) DO NOTHING`).bind(...vals).run();
  const inserted = !!(res && res.meta && res.meta.changes);
  const r = await dayRank(env, v.day, dev, S);
  if (!inserted) return json({ error: 'already', day: v.day, rank: r.me && r.me.rank, score: r.me && r.me.score, total: r.total }, 409);
  return json({ ok: true, day: v.day, rank: r.me ? r.me.rank : null, score: v.score, total: r.total, venue });
}

async function getBoard(env, url, now) {
  const qs = url.searchParams.get('scope');
  // lastweek: konačan poredak prošle sedmice (pobjednik ostaje vidljiv cijelu sljedeću sedmicu)
  const last = qs === 'lastweek';
  const scope = qs === 'week' || last ? 'week' : 'day';
  const t = today(now);
  const qDay = url.searchParams.get('day');
  const day = last ? core.addDays(core.weekKey(t.day), -7) : qDay && core.isDay(qDay) ? qDay : t.day;
  const week = core.weekKey(day);
  const vq = url.searchParams.get('venue');
  if (vq && !VENUES[vq]) return json({ error: 'bad-venue' }, 400);
  const S = src(vq || null);
  const device = url.searchParams.get('device') || '';
  const dev = DEVICE_RE.test(device) ? await deviceHash(env, device) : null;
  const join = `FROM ${S.t} s JOIN game_players p ON p.device = s.device WHERE ${S.w}`;
  const rows = scope === 'day'
    ? await env.DB.prepare(`SELECT p.nick AS nick, s.score AS score, s.device = ? AS mine ${join}s.day = ? AND p.removed = 0 ORDER BY s.score DESC, s.created_at ASC LIMIT ?`)
      .bind(dev || '', ...S.pre, day, BOARD_SIZE).all()
    : await env.DB.prepare(`SELECT p.nick AS nick, SUM(s.score) AS score, s.device = ? AS mine ${join}s.week = ? AND p.removed = 0 GROUP BY s.device ORDER BY score DESC, MIN(s.created_at) ASC LIMIT ?`)
      .bind(dev || '', ...S.pre, week, BOARD_SIZE).all();
  const top = (rows.results || []).map((r, i) => ({ rank: i + 1, nick: r.nick, score: Number(r.score), mine: !!r.mine }));
  const r = dev ? await (scope === 'day' ? dayRank(env, day, dev, S) : weekRank(env, week, dev, S)) : { me: null, total: null };
  let total = r.total;
  if (total == null) {
    const c = scope === 'day'
      ? await q(env, `SELECT COUNT(*) AS n ${join}s.day = ? AND p.removed = 0`, S, [day]).first()
      : await q(env, `SELECT COUNT(DISTINCT s.device) AS n ${join}s.week = ? AND p.removed = 0`, S, [week]).first();
    total = Number(c ? c.n : 0);
  }
  return json({ scope: last ? 'lastweek' : scope, day, week, top, me: r.me, total, venue: vq || null });
}

/* ------------------------------------------------------------------ */
/* Lige kafića: igra se broji samo sa WiFi-ja kafića                   */
/* ------------------------------------------------------------------ */

/** Mreža iz koje dolazi zahtjev: IPv4 adresa, ili prve 4 grupe IPv6 adrese (svi uređaji na istom WiFi-ju). */
export function networkOf(ip) {
  const a = String(ip || '').trim().toLowerCase();
  if (!a) return '';
  if (a.indexOf(':') === -1) return a;
  const v4 = a.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (v4) return v4[1];
  const [head, tail] = a.split('::');
  const hp = head ? head.split(':') : [];
  const tp = tail != null && tail !== '' ? tail.split(':') : [];
  const full = tail != null ? hp.concat(Array(Math.max(0, 8 - hp.length - tp.length)).fill('0'), tp) : hp;
  return full.slice(0, 4).map((g) => (parseInt(g, 16) || 0).toString(16)).join(':') + '::/64';
}
function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || String(request.headers.get('X-Forwarded-For') || '').split(',')[0].trim() || 'lokalno';
}
async function netHash(env, venue, request) {
  return (await sha256('msp-venue-net|' + salt(env) + '|' + venue + '|' + networkOf(clientIp(request)))).slice(0, 40);
}
async function insideVenue(env, request, venue) {
  const row = await env.DB.prepare('SELECT 1 AS ok FROM game_venue_nets WHERE venue = ?1 AND net = ?2').bind(venue, await netHash(env, venue, request)).first();
  return !!row;
}
function publicVenue(id) {
  const v = VENUES[id];
  return { id, name: v.name, colors: v.colors, demo: !!v.demo };
}

async function getVenue(env, request, url) {
  const id = url.searchParams.get('venue') || '';
  if (!VENUES[id]) return json({ error: 'bad-venue' }, 404);
  const n = await env.DB.prepare('SELECT COUNT(*) AS n FROM game_venue_nets WHERE venue = ?1').bind(id).first();
  return json({ venue: publicVenue(id), inside: await insideVenue(env, request, id), wifiSet: Number(n ? n.n : 0) > 0 });
}

/**
 * Vlasnik (ili Graba) sa WiFi-ja kafića unese PIN kafića: ta mreža se zapamti kao "WiFi kafića".
 * Može više mreža (npr. IPv4 i IPv6, ili dva rutera); reset: true briše sve i zapamti samo trenutnu.
 */
async function postVenueWifi(env, request) {
  const body = await readJson(request);
  if (!body || !VENUES[body.venue]) return json({ error: 'bad-venue' }, 400);
  if (await limited(env, request, 'venue-admin', LIMITS.admin)) return json({ error: 'rate-limited' }, 429, { 'Retry-After': String(LIMIT_WINDOW) });
  const pinHash = await sha256('msp-venue-pin|' + body.venue + '|' + String(body.pin || '').trim().toUpperCase());
  if (pinHash !== VENUES[body.venue].pinHash) return json({ error: 'bad-pin' }, 403);
  const venue = body.venue;
  const net = await netHash(env, venue, request);
  if (body.reset) await env.DB.prepare('DELETE FROM game_venue_nets WHERE venue = ?1').bind(venue).run();
  await env.DB.prepare('INSERT INTO game_venue_nets (venue, net, created_at) VALUES (?1, ?2, ?3) ON CONFLICT(venue, net) DO UPDATE SET created_at = ?3')
    .bind(venue, net, Date.now()).run();
  // najviše MAX_NETS mreža po kafiću (najstarije se brišu)
  await env.DB.prepare(
    `DELETE FROM game_venue_nets WHERE venue = ?1 AND net NOT IN (SELECT net FROM game_venue_nets WHERE venue = ?1 ORDER BY created_at DESC LIMIT ${MAX_NETS})`
  ).bind(venue).run();
  const n = await env.DB.prepare('SELECT COUNT(*) AS n FROM game_venue_nets WHERE venue = ?1').bind(venue).first();
  return json({ ok: true, inside: true, nets: Number(n.n) });
}

/** Ulaz za sve akcije. now: Date (za testove), inače trenutno vrijeme. */
export async function handleGame(request, env, action, now) {
  const when = now || new Date();
  const url = new URL(request.url);
  const method = request.method;
  if (action === 'today' && method === 'GET') return json(today(when));
  if (!env || !env.DB) return json({ error: 'not-configured' }, 503);
  try {
    await ensureSchema(env.DB);
    if (action === 'player' && method === 'GET') return await getPlayer(env, url);
    if (action === 'player' && method === 'POST') return await postPlayer(env, request);
    if (action === 'score' && method === 'POST') return await postScore(env, request, when);
    if (action === 'board' && method === 'GET') return await getBoard(env, url, when);
    if (action === 'venue' && method === 'GET') return await getVenue(env, request, url);
    if (action === 'venue-wifi' && method === 'POST') return await postVenueWifi(env, request);
  } catch (e) {
    return json({ error: 'db-error' }, 503);
  }
  if (['today', 'player', 'score', 'board', 'venue', 'venue-wifi'].includes(action)) return json({ error: 'method' }, 405);
  return json({ error: 'not-found' }, 404);
}
