/*
 * MyShishapedia - lokalni server za provjeru builda.
 *
 *   node build.mjs && node serve.mjs          (http://localhost:5173)
 *   node serve.mjs 8080                       (drugi port)
 *
 * Služi folder dist/ na isti način kao Cloudflare Pages, da se greške vide prije objave:
 *   - čiste adrese: /bs/okus/x/ -> dist/bs/okus/x/index.html, /bs/okus/x -> 308 na /bs/okus/x/
 *   - _redirects (od, do, status; * i :splat)
 *   - _headers (sigurnosna zaglavlja, Content-Security-Policy, keširanje)
 *   - nepostojeća adresa dobije najbliži 404.html (npr. /bs/nesto -> dist/bs/404.html)
 *   - lažni API za ocjene (/api/ratings), umjesto Cloudflare Pages Functions i D1 baze:
 *     ocjene su u memoriji (sa par primjera), Turnstile se ne provjerava, a ponovno
 *     pokretanje servera vraća početne primjere.
 *       node serve.mjs --no-api      API ne radi (da se vidi kako stranica izgleda bez ocjena)
 * Samo ugrađeni Node moduli.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import {
  validateRating, validItem, payloadFromTotals, summary, deviceKey, rateKey, rateWindow,
  IDS_PATH, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW
} from './lib/ratings-core.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const ARGS = process.argv.slice(2);
const NO_API = ARGS.includes('--no-api');
const PORT = Number(ARGS.find((a) => /^\d+$/.test(a)) || process.env.PORT || 5173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff2': 'font/woff2'
};

if (!fs.existsSync(ROOT)) {
  console.error('Folder dist/ ne postoji. Prvo pokreni: node build.mjs');
  process.exit(1);
}

/* ---------- _redirects i _headers (čitaju se pri svakom zahtjevu, pa rebuild odmah važi) ---------- */

function patternToRegex(p) {
  return new RegExp('^' + p.split('*').map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('(.*)') + '$');
}

function readRedirects() {
  const f = path.join(ROOT, '_redirects');
  if (!fs.existsSync(f)) return [];
  return fs.readFileSync(f, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).map((l) => {
    const [from, to, status] = l.split(/\s+/);
    return { re: patternToRegex(from), to, status: Number(status) || 302 };
  });
}

function readHeaders() {
  const f = path.join(ROOT, '_headers');
  if (!fs.existsSync(f)) return [];
  const rules = [];
  let cur = null;
  for (const line of fs.readFileSync(f, 'utf8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) { cur = { re: patternToRegex(line.trim()), headers: {} }; rules.push(cur); continue; }
    const i = line.indexOf(':');
    if (cur && i > 0) cur.headers[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return rules;
}

function headersFor(urlPath) {
  const out = {};
  for (const r of readHeaders()) if (r.re.test(urlPath)) Object.assign(out, r.headers);
  return out;
}

/* ---------- fajlovi ---------- */

function resolve(urlPath) {
  let p;
  try { p = decodeURIComponent(urlPath); } catch { return null; }
  const file = path.normalize(path.join(ROOT, p));
  if (!file.startsWith(ROOT)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!p.endsWith('/')) return { redirect: p + '/' };
    const index = path.join(file, 'index.html');
    return fs.existsSync(index) ? { file: index } : null;
  }
  if (fs.existsSync(file)) return { file };
  // Cloudflare Pages: /o-nama -> /o-nama/ ako postoji folder, /stranica -> stranica.html
  if (fs.existsSync(file + '.html')) return { file: file + '.html' };
  return null;
}

/** Najbliži 404.html idući prema korijenu (kao Cloudflare Pages). */
function notFoundFile(urlPath) {
  let dir = path.dirname(path.join(ROOT, urlPath.endsWith('/') ? urlPath + 'x' : urlPath));
  while (dir.startsWith(ROOT)) {
    const f = path.join(dir, '404.html');
    if (fs.existsSync(f)) return f;
    if (dir === ROOT) break;
    dir = path.dirname(dir);
  }
  return path.join(ROOT, '404.html');
}

function send(req, res, status, file, urlPath) {
  const type = TYPES[path.extname(file)] || 'application/octet-stream';
  const data = fs.readFileSync(file);
  const headers = Object.assign({ 'Content-Type': type }, headersFor(urlPath));
  if (/\bgzip\b/.test(req.headers['accept-encoding'] || '') && /text|javascript|xml|svg|json/.test(type)) {
    headers['Content-Encoding'] = 'gzip';
    res.writeHead(status, headers);
    return res.end(zlib.gzipSync(data));
  }
  res.writeHead(status, headers);
  res.end(data);
}


/* ---------- lažni API za ocjene (isto ponašanje kao functions/api/ratings) ---------- */

const ratings = new Map(); // 'kind:id' -> Map(hash uređaja -> zvjezdice)
const limits = new Map();  // hash IP adrese -> { win, hits }
let seeded = false;

function readIds() {
  const f = path.join(ROOT, IDS_PATH);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : { flavor: [], recipe: [] };
}

/** Primjeri ocjena: uvijek isti (zavise samo od id-a), da se rang liste i kartice odmah vide. */
function seed() {
  if (seeded) return;
  seeded = true;
  const ids = readIds();
  for (const kind of ['flavor', 'recipe']) {
    ids[kind].forEach((id) => {
      let h = 2166136261;
      for (const ch of kind + id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
      const rnd = () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0), (h % 1000) / 1000);
      if (rnd() < 0.2) return; // nekoliko stavki bez ocjena
      const count = 1 + Math.floor(rnd() * 14);
      const base = 3 + rnd() * 2;
      const m = new Map();
      for (let i = 0; i < count; i++) m.set('primjer-' + i, Math.max(1, Math.min(5, Math.round(base + (rnd() - 0.5) * 2))));
      ratings.set(kind + ':' + id, m);
    });
  }
}

function totals() {
  return [...ratings].map(([k, m]) => {
    const [kind, item_id] = k.split(':');
    return { kind, item_id, count: m.size, sum: [...m.values()].reduce((a, b) => a + b, 0) };
  });
}

function sendJson(res, status, data, extra) {
  res.writeHead(status, Object.assign({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, extra));
  res.end(JSON.stringify(data));
}

function readBody(req, max) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > max) { reject(new Error('too-big')); req.destroy(); } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

async function api(req, res, urlPath) {
  // mala pauza, da se vide stanja učitavanja i slanja kao na pravom serveru
  await new Promise((r) => setTimeout(r, 250));
  if (NO_API) return sendJson(res, 503, { error: 'not-configured' });
  seed();
  const ids = readIds();
  const single = urlPath.match(/^\/api\/ratings\/([^/]+)\/([^/]+)\/?$/);
  if (single && req.method === 'GET') {
    const [, kind, id] = single;
    if (!validItem(kind, id, ids)) return sendJson(res, 404, { error: 'unknown-id' });
    const m = ratings.get(kind + ':' + id);
    const [avg, count] = summary(m ? [...m.values()].reduce((a, b) => a + b, 0) : 0, m ? m.size : 0);
    return sendJson(res, 200, { kind, id, avg, count });
  }
  if (!/^\/api\/ratings\/?$/.test(urlPath)) return sendJson(res, 404, { error: 'not-found' });
  if (req.method === 'GET') return sendJson(res, 200, payloadFromTotals(totals()));
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'method' }, { Allow: 'GET, POST' });

  if (!String(req.headers['content-type'] || '').includes('application/json')) return sendJson(res, 415, { error: 'bad-body' });
  let body;
  try { body = JSON.parse(await readBody(req, 8192)); } catch { return sendJson(res, 400, { error: 'bad-body' }); }
  const check = validateRating(body, ids);
  if (!check.ok) return sendJson(res, 400, { error: check.error });
  const { kind, id, stars, device } = check.value;

  const now = Math.floor(Date.now() / 1000);
  const win = rateWindow(now);
  const rk = await rateKey(req.socket.remoteAddress, 'lokalno');
  const l = limits.get(rk);
  const hits = l && l.win === win ? l.hits + 1 : 1;
  limits.set(rk, { win, hits });
  if (hits > RATE_LIMIT_MAX) return sendJson(res, 429, { error: 'rate-limited' }, { 'Retry-After': String(RATE_LIMIT_WINDOW) });

  // Turnstile se lokalno ne provjerava (testni ključ uvijek prolazi).
  const key = kind + ':' + id;
  if (!ratings.has(key)) ratings.set(key, new Map());
  const m = ratings.get(key);
  m.set(await deviceKey(device), stars);
  const [avg, count] = summary([...m.values()].reduce((a, b) => a + b, 0), m.size);
  sendJson(res, 200, { ok: true, kind, id, stars, avg, count });
}

http.createServer((req, res) => {
  const [urlPath, query] = req.url.split('?');
  const qs = query ? '?' + query : '';

  if (urlPath === '/api' || urlPath.startsWith('/api/')) {
    api(req, res, urlPath).catch((e) => { console.error(e); sendJson(res, 500, { error: 'server' }); });
    return;
  }

  for (const r of readRedirects()) {
    const m = urlPath.match(r.re);
    if (m) {
      res.writeHead(r.status, { Location: r.to.replace(':splat', m[1] || '') + qs });
      return res.end();
    }
  }

  const found = resolve(urlPath);
  if (found && found.redirect) {
    res.writeHead(308, { Location: found.redirect + qs });
    return res.end();
  }
  if (found) return send(req, res, 200, found.file, urlPath);
  send(req, res, 404, notFoundFile(urlPath), urlPath);
}).listen(PORT, () => console.log(`MyShishapedia: http://localhost:${PORT}  (dist/, kao Cloudflare Pages)` +
  (NO_API ? '  [API za ocjene isključen]' : '  [lažni API za ocjene: /api/ratings]')));
