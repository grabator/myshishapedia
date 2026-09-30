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
 * Samo ugrađeni Node moduli.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
const PORT = Number(process.argv[2] || process.env.PORT || 5173);

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

http.createServer((req, res) => {
  const [urlPath, query] = req.url.split('?');
  const qs = query ? '?' + query : '';

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
}).listen(PORT, () => console.log(`MyShishapedia: http://localhost:${PORT}  (dist/, kao Cloudflare Pages)`));
