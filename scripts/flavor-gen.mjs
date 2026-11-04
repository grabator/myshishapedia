#!/usr/bin/env node
/*
 * Generator okusa: iz kratkog seed fajla (JSON) pravi pune unose u data/flavors.js
 * i njemački prijevod u data/de.js.
 *
 *   node scripts/flavor-gen.mjs seeds/okusi.json            provjera i pregled (ništa ne piše)
 *   node scripts/flavor-gen.mjs seeds/okusi.json --write    upiše okuse i prijevode
 *
 * Seed je niz objekata. Obavezno: id, brand, name, ing, short, desc, mix (tekstovi kao { bs, en, de }).
 *   ing: ["mango:9", "menta:4", "breskva:6:Bijela breskva|White peach|Weißer Pfirsich", "bilje:8:Duhan|Tobacco|Tabak:#8a5a3a"]
 *        ključ ilustracije : intenzitet 1-10 [: bs|en|de naziv ako nije uobičajeni [: boja]]
 * Opcionalno: leaf, profile, tags, mood, mixRole, similar, palette, tobaccoType.
 * Sve što fali, generator izračuna: naziv i boju sastojka (iz postojećih okusa), paletu,
 * profil (procjena), tagove, vrstu duhana, slične okuse (i vezu nazad kod postojećih okusa).
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const P = (f) => path.join(ROOT, f);
const args = process.argv.slice(2);
const seedFile = args.find((a) => !a.startsWith('--'));
const WRITE = args.includes('--write');
if (!seedFile) {
  console.error('Upotreba: node scripts/flavor-gen.mjs <seed.json> [--write]');
  process.exit(2);
}

/* ---------- učitavanje postojećih podataka ---------- */
const sandbox = { console };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const f of ['js/strings.js', 'js/illustrations.js', 'data/brands.js', 'data/flavors.js', 'data/de.js']) {
  vm.runInContext(fs.readFileSync(P(f), 'utf8'), sandbox, { filename: f });
}
const MSP = sandbox.MSP;
const FLAVORS = sandbox.FLAVORS;
const BRANDS = sandbox.BRANDS;
const DICT = MSP.dict.de;
const TAGS = Object.keys(MSP.strings.bs.tags);
const hasIll = (k) => (MSP.hasIllustration ? MSP.hasIllustration(k) : true);

/* Katalog sastojaka: za svaku ilustraciju najčešći naziv i boja u postojećim okusima. */
const catalog = {};
for (const f of FLAVORS) {
  for (const i of f.ingredients) {
    const c = (catalog[i.illustration] = catalog[i.illustration] || { names: {}, colors: {} });
    const nk = i.name.bs + '|' + i.name.en;
    c.names[nk] = (c.names[nk] || 0) + 1;
    c.colors[i.color] = (c.colors[i.color] || 0) + 1;
  }
}
const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1])[0][0];

/* Grupe sastojaka za procjenu profila i tagova. */
const G = {
  fruit: 'ananas banana lubenica marakuja dinja breskva narandza mango jagoda kupina borovnica visnja malina grejpfrut limeta jabuka zelena-jabuka limun grozdje kivi guava kruska lici nar sljiva kokos papaja guanabana plod kaktus grozdic ogrozd bobice dzem rabarbara',
  tropical: 'ananas banana marakuja mango guava lici kokos papaja guanabana kaktus plod',
  citrus: 'narandza grejpfrut limeta limun',
  berry: 'jagoda kupina borovnica malina grozdic ogrozd bobice',
  mint: 'menta pepermint',
  ice: 'kristal',
  dessert: 'vanila karamel cokolada kolac keks sladoled sejk kondenzovano marshmallow kroasan rolat riza puslica pistacija orah stapici',
  spice: 'cimet kardamom anis djumbir',
  candy: 'bombon bomboni zvaka medo pepermint-bombon',
  summer: 'lubenica dinja',
  herb: 'bilje caj jelka aloja ruza betel krastavac'
};
for (const k in G) G[k] = new Set(G[k].split(' '));
const maxIn = (ings, grp) => Math.max(0, ...ings.filter((i) => G[grp].has(i.illustration)).map((i) => i.intensity));

/* ---------- pomoćne funkcije ---------- */
const errors = [];
const warns = [];
const err = (id, m) => errors.push(`${id}: ${m}`);
const warn = (id, m) => warns.push(`${id}: ${m}`);
const clamp = (n) => Math.max(0, Math.min(10, Math.round(n)));
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (rgb) => '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * t));
const LANGS3 = ['bs', 'en', 'de'];
const DASH = /[\u2013\u2014]/;

function checkText(id, field, v, arr) {
  for (const l of LANGS3) {
    const x = v && v[l];
    if (arr ? !Array.isArray(x) || !x.length : typeof x !== 'string' || !x.trim()) { err(id, `${field}.${l} fali`); continue; }
    for (const s of [].concat(x)) if (DASH.test(s)) err(id, `${field}.${l}: crtica (en/em dash) nije dozvoljena`);
  }
  if (arr && v && Array.isArray(v.bs) && LANGS3.some((l) => (v[l] || []).length !== v.bs.length)) err(id, `${field}: različit broj rečenica po jezicima`);
}

/* ---------- generisanje ---------- */
const seed = JSON.parse(fs.readFileSync(path.resolve(seedFile), 'utf8'));
const ids = new Set(FLAVORS.map((f) => f.id));
const brandIds = new Set(BRANDS.map((b) => b.slug));
const out = [];
const deNew = {};
const addDe = (en, de, id) => {
  if (DICT[en] !== undefined) { if (DICT[en] !== de && de) warn(id, `prijevod za "${en}" već postoji ("${DICT[en]}"), ostaje stari`); return; }
  if (deNew[en] !== undefined && deNew[en] !== de) warn(id, `dva različita prijevoda za "${en}"`);
  deNew[en] = de;
};

for (const s of seed) {
  const id = s.id || '(bez id-a)';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) err(id, 'id mora biti malim slovima, brojevima i crticama');
  if (ids.has(id)) err(id, 'id već postoji');
  ids.add(id);
  if (!brandIds.has(s.brand)) err(id, `brend "${s.brand}" ne postoji u data/brands.js`);
  if (!s.name) err(id, 'name fali');
  checkText(id, 'short', s.short, false);
  checkText(id, 'desc', s.desc, true);
  checkText(id, 'mix', s.mix, true);
  for (const l of LANGS3) if (s.short && s.short[l] && s.short[l].length > 155) err(id, `short.${l} ima ${s.short[l].length} znakova (najviše 155)`);

  const brandFl = FLAVORS.filter((f) => f.brand === s.brand);
  const leaf = s.leaf || (brandFl.length ? top(brandFl.reduce((o, f) => ((o[f.leaf] = (o[f.leaf] || 0) + 1), o), {})) : 'light');

  /* sastojci */
  const ings = (s.ing || []).map((str) => {
    const [key, inten, names, ownColor] = String(str).split(':');
    if (ownColor && !/^#[0-9a-f]{6}$/i.test(ownColor)) err(id, `boja "${ownColor}" nije #rrggbb`);
    const c = catalog[key];
    if (!hasIll(key)) err(id, `nema ilustracije "${key}"`);
    let bs, en, de;
    if (names) [bs, en, de] = names.split('|');
    else if (c) [bs, en] = top(c.names).split('|');
    else err(id, `sastojak "${key}" nema naziv (dodaj :bs|en|de)`);
    if (!de && en) de = DICT[en];
    if (!de) err(id, `sastojak "${en}" nema njemački naziv (dodaj :bs|en|de)`);
    else addDe(en, de, id);
    const n = Number(inten);
    if (!(n >= 1 && n <= 10)) err(id, `intenzitet za "${key}" mora biti 1-10`);
    return { name: { bs, en }, illustration: key, color: ownColor || (c ? top(c.colors) : '#c8a27a'), intensity: n };
  });
  if (!ings.length) err(id, 'nema sastojaka (ing)');

  /* profil: ručni ima prednost, ostalo procjena iz sastojaka */
  const est = {
    fruitiness: clamp(Math.max(maxIn(ings, 'fruit'), 1)),
    cooling: clamp(Math.max(maxIn(ings, 'ice'), maxIn(ings, 'mint') * 0.8)),
    sweetness: clamp(6 + (maxIn(ings, 'dessert') + maxIn(ings, 'candy')) / 5 - maxIn(ings, 'citrus') / 8),
    strength: leaf === 'dark' ? 8 : 5
  };
  est.freshness = clamp(Math.max(est.cooling, maxIn(ings, 'citrus') * 0.9, maxIn(ings, 'mint'), 4));
  const profile = {};
  for (const k of ['sweetness', 'freshness', 'fruitiness', 'cooling', 'strength']) {
    profile[k] = s.profile && s.profile[k] !== undefined ? s.profile[k] : est[k];
    if (!s.profile || s.profile[k] === undefined) warn(id, `profile.${k} = ${est[k]} (procjena)`);
  }

  /* tagovi */
  let tags = s.tags;
  if (!tags) {
    const t = [];
    const has = (g) => ings.some((i) => G[g].has(i.illustration));
    if (has('fruit')) t.push('vocni');
    if (has('tropical')) t.push('tropski');
    if (has('citrus')) t.push('citrusni');
    if (has('berry')) t.push('bobicasti');
    if (has('mint')) t.push('mint');
    if (profile.cooling >= 7) t.push('ledeni');
    if (has('dessert')) t.push('desertni');
    if (has('candy')) t.push('bombon');
    if (has('spice')) t.push('zacinski');
    if (has('summer')) t.push('ljetni');
    if (profile.sweetness >= 7) t.push('slatki');
    if (profile.freshness >= 7 && !t.includes('ledeni')) t.push('osvjezavajuci');
    tags = t.slice(0, 5);
  }
  for (const t of tags) if (!TAGS.includes(t)) err(id, `tag "${t}" ne postoji u js/strings.js`);

  /* paleta iz boja sastojaka */
  const c1 = ings[0] ? ings[0].color : '#c8a27a';
  const c2 = ings[1] ? ings[1].color : mix(c1, '#ffffff', 0.45);
  const c3 = ings[2] ? ings[2].color : ings[1] ? mix(c2, '#ffffff', 0.3) : mix(c1, '#000000', 0.25);
  const palette = s.palette || { primary: c1, secondary: c2, accent: c3, background: mix(c1, '#0b0705', 0.86), text: mix(c1, '#ffffff', 0.93) };

  /* vrsta duhana: najčešća kod brenda */
  const tobaccoType = s.tobaccoType || (brandFl.length
    ? JSON.parse(top(brandFl.reduce((o, f) => { const k = JSON.stringify(f.tobaccoType); o[k] = (o[k] || 0) + 1; return o; }, {})))
    : leaf === 'dark' ? { bs: 'Tamni list', en: 'Dark leaf' } : { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' });

  const f = { id, brand: s.brand, leaf, name: s.name };
  if (s.mood || profile.cooling >= 8) f.mood = s.mood || 'frost';
  if (s.mixRole) f.mixRole = s.mixRole;
  Object.assign(f, {
    shortDescription: { bs: s.short.bs, en: s.short.en },
    description: { bs: s.desc.bs, en: s.desc.en },
    ingredients: ings,
    profile,
    tags,
    tobaccoType,
    palette,
    mixIdeas: { bs: s.mix.bs, en: s.mix.en },
    similar: s.similar || null
  });
  out.push(f);

  if (s.short && s.desc && s.mix) {
    addDe(s.short.en, s.short.de, id);
    (s.desc.en || []).forEach((t, i) => addDe(t, (s.desc.de || [])[i], id));
    (s.mix.en || []).forEach((t, i) => addDe(t, (s.mix.de || [])[i], id));
  }
  if (DICT[tobaccoType.en] === undefined && !deNew[tobaccoType.en]) err(id, `vrsta duhana "${tobaccoType.en}" nema njemački prijevod`);
}

/* slični okusi: zajednički sastojci, tagovi i blizina profila; najviše 2 istog brenda */
const all = FLAVORS.concat(out);
const PK = ['sweetness', 'freshness', 'fruitiness', 'cooling', 'strength'];
function score(a, b) {
  let s = 0;
  for (const i of a.ingredients) {
    const j = b.ingredients.find((x) => x.illustration === i.illustration);
    if (j) s += (Math.min(i.intensity, j.intensity) / 10) * 3 + (i === a.ingredients[0] && j === b.ingredients[0] ? 2 : 0);
  }
  s += a.tags.filter((t) => b.tags.includes(t)).length * 0.4;
  s -= Math.sqrt(PK.reduce((d, k) => d + (a.profile[k] - b.profile[k]) ** 2, 0)) * 0.25;
  if (a.leaf !== b.leaf) s -= 1;
  return s;
}
const backlinks = {};
for (const f of out) {
  if (f.similar) { for (const sid of f.similar) if (!all.some((x) => x.id === sid)) err(f.id, `sličan okus "${sid}" ne postoji`); continue; }
  const ranked = all.filter((x) => x.id !== f.id).map((x) => [x, score(f, x)]).sort((a, b) => b[1] - a[1]);
  const pick = [];
  let same = 0;
  for (const [x] of ranked) {
    if (x.brand === f.brand) { if (same >= 2) continue; same++; }
    pick.push(x.id);
    if (pick.length === 3) break;
  }
  f.similar = pick;
}
/* veza nazad: postojeći okus dobije novi id ako ima manje od 4 slična */
for (const f of out) {
  for (const sid of f.similar) {
    const ex = FLAVORS.find((x) => x.id === sid);
    if (!ex) continue;
    const cur = (ex.similar || []).concat(backlinks[sid] || []);
    if (cur.length < 4 && !cur.includes(f.id)) (backlinks[sid] = backlinks[sid] || []).push(f.id);
  }
}

/* ---------- izvještaj ---------- */
for (const f of out) {
  console.log(`${f.id.padEnd(30)} ${f.ingredients.map((i) => i.name.en + ' ' + i.intensity).join(', ')}`);
  console.log(`${''.padEnd(30)} profil ${PK.map((k) => k[0] + f.profile[k]).join(' ')}  tagovi ${f.tags.join(',')}${f.mood ? '  mood ' + f.mood : ''}  slični ${f.similar.join(', ')}`);
}
if (warns.length && args.includes('--verbose')) console.log('\nNapomene:\n  ' + warns.join('\n  '));
else if (warns.length) console.log(`\n${warns.length} napomena (procjene profila i slično), prikaz: --verbose`);
console.log(`Novi njemački prijevodi: ${Object.keys(deNew).length}, veze nazad: ${Object.values(backlinks).flat().length}`);
if (errors.length) {
  console.error('\nGREŠKE:\n  ' + errors.join('\n  '));
  process.exit(1);
}

/* ---------- upis ---------- */
if (!WRITE) { console.log('\nSve ispravno. Za upis dodaj --write.'); process.exit(0); }

const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
const txt = (o, ind) => `{\n${ind}  bs: ${q(o.bs)},\n${ind}  en: ${q(o.en)}\n${ind}}`;
const arr = (o, ind) => `{\n${ind}  bs: [\n${o.bs.map((x) => ind + '    ' + q(x)).join(',\n')}\n${ind}  ],\n${ind}  en: [\n${o.en.map((x) => ind + '    ' + q(x)).join(',\n')}\n${ind}  ]\n${ind}}`;
function serialize(f) {
  const I = '    ';
  const L = [
    `  {`,
    `${I}id: ${q(f.id)},`,
    `${I}brand: ${q(f.brand)},`,
    `${I}leaf: ${q(f.leaf)},`,
    `${I}name: ${q(f.name)},`
  ];
  if (f.mood) L.push(`${I}mood: ${q(f.mood)},`);
  if (f.mixRole) L.push(`${I}mixRole: ${q(f.mixRole)},`);
  L.push(
    `${I}shortDescription: ${txt(f.shortDescription, I)},`,
    `${I}description: ${arr(f.description, I)},`,
    `${I}ingredients: [\n${f.ingredients.map((i) => `${I}  { name: { bs: ${q(i.name.bs)}, en: ${q(i.name.en)} }, illustration: ${q(i.illustration)}, color: ${q(i.color)}, intensity: ${i.intensity} }`).join(',\n')}\n${I}],`,
    `${I}profile: { ${PK.map((k) => `${k}: ${f.profile[k]}`).join(', ')} },`,
    `${I}tags: [${f.tags.map(q).join(', ')}],`,
    `${I}tobaccoType: { bs: ${q(f.tobaccoType.bs)}, en: ${q(f.tobaccoType.en)} },`,
    `${I}palette: { ${Object.entries(f.palette).map(([k, v]) => `${k}: ${q(v)}`).join(', ')} },`,
    `${I}mixIdeas: ${arr(f.mixIdeas, I)},`,
    `${I}similar: [${f.similar.map(q).join(', ')}]`,
    `  }`
  );
  return L.join('\n');
}

let src = fs.readFileSync(P('data/flavors.js'), 'utf8');
/* veze nazad u postojećim okusima */
for (const [sid, add] of Object.entries(backlinks)) {
  const start = src.indexOf(`id: '${sid}',`);
  const at = src.indexOf('similar: [', start);
  const end = src.indexOf(']', at);
  if (start < 0 || at < 0) { console.warn(`veza nazad preskočena: ${sid}`); continue; }
  const inner = src.slice(at + 10, end).trim();
  src = src.slice(0, at + 10) + (inner ? inner + ', ' : '') + add.map(q).join(', ') + src.slice(end);
}
/* novi okusi idu iza zadnjeg okusa istog brenda (ili na kraj) */
for (const f of out) {
  const blocks = [...src.matchAll(/\n  \{\n    id: '([^']+)',\n    brand: '([^']+)'/g)];
  const lastSame = blocks.filter((m) => m[2] === f.brand).pop();
  let pos;
  if (lastSame) {
    const next = blocks.find((m) => m.index > lastSame.index);
    pos = next ? next.index : src.lastIndexOf('\n];');
  } else pos = src.lastIndexOf('\n];');
  const before = src.slice(0, pos).replace(/\s*$/, '');
  const sep = before.endsWith(',') ? '' : ',';
  src = before + sep + '\n' + serialize(f) + (next(src, pos) ? ',' : '') + src.slice(pos);
}
function next(s, pos) { return /^\n  \{/.test(s.slice(pos)); }
fs.writeFileSync(P('data/flavors.js'), src);

let de = fs.readFileSync(P('data/de.js'), 'utf8');
const endAt = de.lastIndexOf('\n};');
const lines = Object.entries(deNew).map(([en, d]) => ` ${JSON.stringify(en)}: ${JSON.stringify(d)}`).join(',\n');
if (lines) de = de.slice(0, endAt).replace(/\s*$/, '') + ',\n' + lines + de.slice(endAt);
fs.writeFileSync(P('data/de.js'), de);

/* kontrola: upisani fajlovi se moraju učitati i sadržati nove okuse */
const chk = { console };
chk.window = chk;
vm.createContext(chk);
for (const f of ['js/strings.js', 'data/flavors.js', 'data/de.js']) vm.runInContext(fs.readFileSync(P(f), 'utf8'), chk);
const missing = out.filter((f) => !chk.FLAVORS.some((x) => x.id === f.id));
if (missing.length || chk.FLAVORS.length !== FLAVORS.length + out.length) { console.error('Upis nije uspio kako treba.'); process.exit(1); }
console.log(`\nUpisano: ${out.length} okusa (ukupno ${chk.FLAVORS.length}), ${Object.keys(deNew).length} njemačkih prijevoda.`);
console.log('Sljedeće: node build.mjs');
