/*
 * MyShishapedia - pakovanje mape svijeta za stranicu "Evolucija nargile".
 *
 *   node scripts/geo-pack.mjs <folder paketa world-atlas>
 *
 * Ulaz: TopoJSON fajlovi iz npm paketa world-atlas@2 (podaci Natural Earth, javno vlasništvo):
 *   land-110m.json       kopno, grubo (cijeli globus izdaleka)
 *   land-50m.json        kopno, detaljnije (samo oko stanica, za spuštanje)
 *   countries-50m.json   granice država (samo oko stanica)
 * Paket se jednom preuzme (npm pack world-atlas@2.0.2) i NE ide u repo; u repo ide samo rezultat.
 *
 * Izlaz: static/geo/world.json
 *   { v, q, lo: [prsten...], hi: [prsten...], b: [linija...] }
 *   Svaki prsten/linija je niz cijelih brojeva [lon0, lat0, dlon1, dlat1, ...]:
 *   koordinate su u stotinkama stepena (q = 100), a poslije prve tačke samo razlika do prethodne.
 *   Tako je fajl mali (gzip ~60 KB) i brzo se čita.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = process.argv[2];
if (!SRC) {
  console.error('Upotreba: node scripts/geo-pack.mjs <folder paketa world-atlas>');
  process.exit(1);
}
const readTopo = (f) => JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));

/** Lukovi TopoJSON-a u stvarne koordinate [[lon, lat], ...]. */
function decodeArcs(topo) {
  const t = topo.transform;
  return topo.arcs.map((arc) => {
    let x = 0, y = 0;
    return arc.map((p) => {
      if (t) { x += p[0]; y += p[1]; return [x * t.scale[0] + t.translate[0], y * t.scale[1] + t.translate[1]]; }
      return [p[0], p[1]];
    });
  });
}

function ringFrom(arcs, ids) {
  const out = [];
  for (const id of ids) {
    const a = id < 0 ? arcs[~id].slice().reverse() : arcs[id];
    for (let i = out.length ? 1 : 0; i < a.length; i++) out.push(a[i]);
  }
  return out;
}

function polygonsOf(topo, objName) {
  const arcs = decodeArcs(topo);
  const rings = [];
  const walk = (g) => {
    if (g.type === 'GeometryCollection') g.geometries.forEach(walk);
    else if (g.type === 'Polygon') g.arcs.forEach((r) => rings.push(ringFrom(arcs, r)));
    else if (g.type === 'MultiPolygon') g.arcs.forEach((p) => p.forEach((r) => rings.push(ringFrom(arcs, r))));
  };
  walk(topo.objects[objName]);
  return rings;
}

/** Unutrašnje granice: lukovi koje dijele dvije različite države (kao topojson.mesh(a !== b)). */
function bordersOf(topo) {
  const arcs = decodeArcs(topo);
  const owners = new Map();
  topo.objects.countries.geometries.forEach((g, gi) => {
    const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
    for (const p of polys) for (const r of p) for (const id of r) {
      const k = id < 0 ? ~id : id;
      if (!owners.has(k)) owners.set(k, new Set());
      owners.get(k).add(gi);
    }
  });
  const lines = [];
  for (const [k, set] of owners) if (set.size > 1) lines.push(arcs[k]);
  return lines;
}

/** Douglas-Peucker u stepenima (geografska dužina skalirana sa cos širine). */
function simplify(pts, tol) {
  if (pts.length < 4) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const k = Math.cos(((pts[a][1] + pts[b][1]) / 2) * Math.PI / 180);
    const ax = pts[a][0] * k, ay = pts[a][1], bx = pts[b][0] * k, by = pts[b][1];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
    let best = -1, bi = -1;
    for (let i = a + 1; i < b; i++) {
      const px = pts[i][0] * k, py = pts[i][1];
      // zatvoren prsten (početak = kraj): udaljenost do tačke umjesto do duži
      const d = len < 1e-9 ? Math.hypot(px - ax, py - ay) : Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
      if (d > best) { best = d; bi = i; }
    }
    if (best > tol) { keep[bi] = 1; stack.push([a, bi], [bi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}

// Oblasti u koje se kamera spušta (stanice ±28°): samo tu treba detaljna mapa.
const FOCUS = [
  [51.7, 32.7], [77.7, 27.1], [29.0, 41.0], [77.5, 17.9], [31.2, 30.0], [44.2, 15.4], [51.4, 35.7],
  [35.8, 34.4], [55.5, 25.4], [-118.2, 34.0], [18.4, 43.9], [37.6, 55.8], [13.4, 52.5]
];
function nearFocus(ring) {
  let x0 = 180, x1 = -180, y0 = 90, y1 = -90;
  for (const [x, y] of ring) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return FOCUS.some(([fx, fy]) => x1 > fx - 28 && x0 < fx + 28 && y1 > fy - 22 && y0 < fy + 22);
}

const Q = 100;
function encode(pts) {
  const out = [];
  let px = 0, py = 0;
  pts.forEach(([x, y], i) => {
    const qx = Math.round(x * Q), qy = Math.round(y * Q);
    if (i === 0) out.push(qx, qy); else out.push(qx - px, qy - py);
    px = qx; py = qy;
  });
  // uzastopne iste tačke (poslije zaokruživanja) se izbace
  const clean = [out[0], out[1]];
  for (let i = 2; i < out.length; i += 2) if (out[i] || out[i + 1]) clean.push(out[i], out[i + 1]);
  return clean;
}

const lo = polygonsOf(readTopo('land-110m.json'), 'land')
  .map((r) => simplify(r, 0.12)).filter((r) => r.length >= 4).map(encode);
const hi = polygonsOf(readTopo('land-50m.json'), 'land')
  .filter(nearFocus).map((r) => simplify(r, 0.035)).filter((r) => r.length >= 4).map(encode);
const b = bordersOf(readTopo('countries-50m.json'))
  .filter(nearFocus).map((l) => simplify(l, 0.05)).filter((l) => l.length >= 2).map(encode);

const json = JSON.stringify({ v: 1, q: Q, lo, hi, b });
const out = path.join(ROOT, 'static/geo/world.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, json);
const pts = (a) => a.reduce((s, r) => s + r.length / 2, 0);
console.log(`world.json: ${(json.length / 1024).toFixed(0)} KB, tačaka lo ${pts(lo)}, hi ${pts(hi)}, granice ${pts(b)}`);

// Mala mapa za sekciju "Kako se zove gdje" (statični SVG u HTML-u): ekvidistantna projekcija,
// isječak lon -15..95, lat 5..65, 10 px po stepenu, jako pojednostavljeno.
const MINI = { x0: -15, x1: 95, y0: 5, y1: 65 };
const mini = polygonsOf(readTopo('land-110m.json'), 'land')
  .filter((r) => r.some(([x, y]) => x > MINI.x0 - 10 && x < MINI.x1 + 10 && y > MINI.y0 - 10 && y < MINI.y1 + 10))
  .map((r) => simplify(r, 0.45))
  .filter((r) => r.length >= 4)
  .map((r) => 'M' + r.map(([x, y]) => Math.round((x - MINI.x0) * 10) + ' ' + Math.round((MINI.y1 - y) * 10)).join('L') + 'Z')
  .join('');
const miniFile = path.join(ROOT, 'data/history-map.js');
fs.writeFileSync(miniFile, '/* Generiše scripts/geo-pack.mjs (ne mijenjaj ručno). Natural Earth 110m, javno vlasništvo. */\n' +
  'window.HISTORY_MAP = ' + JSON.stringify({ box: MINI, d: mini }) + ';\n');
console.log(`history-map.js: ${(mini.length / 1024).toFixed(1)} KB`);
