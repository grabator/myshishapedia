/*
 * MyShishapedia - build.
 *
 *   node build.mjs
 *
 * Pravi folder dist/ sa gotovim HTML stranicama na oba jezika (bs, en):
 * sav tekst je već u HTML-u (dobro za Google i za rad bez JavaScripta),
 * a JavaScript u browseru samo dodaje dim, animacije i interakcije.
 *
 * Koristi samo ugrađene Node module (bez npm paketa). Stranice se crtaju istim
 * kodom kao u browseru (js/views.js), učitanim kroz node:vm.
 *
 * Na kraju build provjerava: da svi interni linkovi vode na postojeće fajlove,
 * da svaka stranica ima tačno jedan h1, jedinstven naslov i opis (do 155 znakova).
 * Ako nešto ne valja, build javi grešku i završi sa kodom 1.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(ROOT, 'dist');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

/* ------------------------------------------------------------------ */
/* Učitavanje istih skripti koje koristi browser                       */
/* ------------------------------------------------------------------ */

const SOURCES = [
  'site.config.js',
  'js/strings.js',
  'data/brands.js',
  'data/flavors.js',
  'data/glossary.js',
  'data/guide.js',
  'data/gear.js',
  'data/quiz.js',
  'data/about.js',
  'data/collections.js',
  'data/mixes.js',
  'data/legal.js',
  'js/illustrations.js',
  'js/views.js',
  'js/views-more.js',
  'js/views-extra.js'
];

const warnings = [];
const sandbox = {
  console: {
    log: (...a) => console.log(...a),
    warn: (...a) => warnings.push(a.join(' ')),
    error: (...a) => console.error(...a)
  }
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const file of SOURCES) vm.runInContext(read(file), sandbox, { filename: file });

const CFG = sandbox.SITE_CONFIG;
// Vrijednosti se mogu zadati i kao varijable okruženja (npr. u Cloudflare Pages postavkama),
// tada imaju prednost nad site.config.js.
for (const key of ['ANALYTICS_TOKEN', 'FORM_ENDPOINT']) {
  if (process.env[key] !== undefined) CFG[key] = process.env[key];
}
const MSP = sandbox.MSP;
const V = MSP.V;
const SITE = String(process.env.SITE_URL || CFG.SITE_URL).replace(/\/+$/, '');
const LANGS = CFG.LANGS;
const DEFAULT_LANG = CFG.DEFAULT_LANG;
const OG_LOCALE = { bs: 'bs_BA', en: 'en_US' };

/* ------------------------------------------------------------------ */
/* Statični fajlovi (sa verzijom u adresi, da browser ne drži staru)   */
/* ------------------------------------------------------------------ */

function hashOf(file) {
  return crypto.createHash('sha1').update(fs.readFileSync(path.join(ROOT, file))).digest('hex').slice(0, 8);
}

const ASSETS = ['css/style.css', 'js/strings.js', 'data/brands.js', 'data/flavors.js', 'data/glossary.js', 'data/guide.js', 'data/gear.js', 'data/quiz.js',
  'data/mixes.js', 'js/illustrations.js', 'js/effects.js', 'js/views.js', 'js/views-more.js', 'js/views-extra.js', 'js/pages.js', 'js/app.js',
  'js/search.js', 'js/forms.js', 'js/share.js', 'favicon.svg'];
const VERSION = {};
for (const a of ASSETS) VERSION[a] = hashOf(a);
const asset = (p) => '/' + p + '?v=' + VERSION[p];

// Podaci koje stranica treba u browseru (ostalo je već ispisano u HTML-u).
const PAGE_DATA = {
  guide: ['data/guide.js'],
  gear: ['data/gear.js'],
  quiz: ['data/quiz.js'],
  glossary: ['data/glossary.js'],
  home: ['data/mixes.js'],
  recipe: ['data/mixes.js']
};

// Dodatne skripte samo gdje trebaju.
const VIEWS_MORE_PAGES = ['home', 'compare', 'comparePair', 'mixer', 'recipe'];
const VIEWS_EXTRA_PAGES = ['flavors', 'quiz'];

const PAGE_SCRIPTS = {
  search: ['js/search.js'],
  suggest: ['js/forms.js'],
  report: ['js/forms.js'],
  flavor: ['js/share.js'],
  recipe: ['js/share.js'],
  mixer: ['js/share.js'],
  quiz: ['js/share.js']
};

/* ------------------------------------------------------------------ */
/* Pomoćne                                                             */
/* ------------------------------------------------------------------ */

const esc = V.esc;
const abs = (p) => SITE + p;

function setLang(lang) { MSP.lang = lang; }

function writeFile(rel, content) {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

/** Relativna adresa stranice -> fajl u dist/ (folderi sa index.html). */
function fileFor(urlPath) {
  if (urlPath.endsWith('/')) return urlPath.slice(1) + 'index.html';
  return urlPath.slice(1);
}

function copyDir(src, dest, filter) {
  for (const entry of fs.readdirSync(path.join(ROOT, src), { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d, filter);
    else if (!filter || filter(s)) {
      fs.mkdirSync(path.join(DIST, dest), { recursive: true });
      fs.copyFileSync(path.join(ROOT, s), path.join(DIST, d));
    }
  }
}

/* ------------------------------------------------------------------ */
/* Dijelovi šablona                                                    */
/* ------------------------------------------------------------------ */

// Unaprijed se preuzimaju samo osnovni (latin) fontovi; latin-ext (č ć š ž đ) browser preuzme sam
// čim zatreba (unicode-range u style.css), da fontovi ne otimaju propusni opseg pri učitavanju.
// Bosanski naslovi često imaju č ć š ž đ, pa bs stranice unaprijed preuzimaju i latin-ext za Syne.
const FONT_PRELOADS = [
  'https://fonts.gstatic.com/s/syne/v24/8vIH7w4qzmVxm2BL9A.woff2',
  'https://fonts.gstatic.com/s/manrope/v20/xn7gYHE41ni1AdIRggexSg.woff2'
];
const FONT_PRELOADS_BS = ['https://fonts.gstatic.com/s/syne/v24/8vIH7w4qzmVxm25L9Hz_.woff2'];


// Izvršava se u <head> prije iscrtavanja: jezik, provjera godina, loader samo pri
// prvoj posjeti u sesiji, i "raziđi oblak" ako se stiglo prelazom sa druge stranice.
const HEAD_SCRIPT = `(function(){var d=document.documentElement,c=' js';function g(s,k){try{return window[s].getItem(k)}catch(e){return null}}function s(t,k,v){try{window[t].setItem(k,v)}catch(e){}}
if(g('localStorage','msp-age-ok')==='1')c+=' age-ok';
if(!g('sessionStorage','msp-seen')){c+=' first-visit';s('sessionStorage','msp-seen','1')}
var v=g('sessionStorage','msp-veil');if(v){c+=' arrive';d.style.setProperty('--arrive-veil',v);try{sessionStorage.removeItem('msp-veil')}catch(e){}}
d.className+=c;s('localStorage','msp-lang',d.lang)})();`;

const LOADER = `<div class="loader" id="loader" aria-hidden="true"><svg class="loader__coal" viewBox="0 0 120 90"><defs><radialGradient id="ld-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ff8a2a" stop-opacity="0.7"/><stop offset="0.5" stop-color="#ff5a1a" stop-opacity="0.2"/><stop offset="1" stop-color="#ff5a1a" stop-opacity="0"/></radialGradient><linearGradient id="ld-cold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#77706a"/><stop offset="1" stop-color="#3a3431"/></linearGradient><radialGradient id="ld-hot" cx="0.5" cy="0.35" r="0.75"><stop offset="0" stop-color="#fff1b8"/><stop offset="0.35" stop-color="#ffb13b"/><stop offset="0.75" stop-color="#e2541b"/><stop offset="1" stop-color="#7a1d0a"/></radialGradient></defs><ellipse class="loader__glow" cx="60" cy="48" rx="60" ry="42" fill="url(#ld-glow)"/><rect x="22" y="24" width="76" height="46" rx="10" fill="url(#ld-cold)"/><rect class="loader__hot" x="22" y="24" width="76" height="46" rx="10" fill="url(#ld-hot)"/><path d="M34 44h28M64 56h22" stroke="#1a1411" stroke-width="2.4" stroke-linecap="round" opacity="0.45"/></svg></div>`;

function jsonLd(obj) {
  return '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, '\\u003c') + '</script>';
}

function structuredData(desc, lang, info) {
  if (desc.page === 'home') {
    return jsonLd({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: CFG.SITE_NAME,
      url: abs(V.urlFor(lang, 'home')),
      inLanguage: lang,
      description: info.description,
      author: { '@type': 'Person', name: CFG.AUTHOR_NAME },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: abs(V.urlFor(lang, 'home')) + '?q={search_term_string}' },
        'query-input': 'required name=search_term_string'
      }
    });
  }
  if (desc.page === 'notfound' || info.crumbs.length < 2) return '';
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: info.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.url.replace(/#.*$/, '')) }))
  });
}

function head(desc, lang, info) {
  const t = MSP.t;
  const alt = desc.alternates;
  const indexable = desc.page !== 'notfound' && V.NOINDEX_PAGES.indexOf(desc.page) === -1;
  const canonical = abs(desc.url);
  const title = info.title;
  const d = info.description;
  const ogImage = abs('/og-image.png');
  const data = (PAGE_DATA[desc.page] || []).concat(desc.page === 'term' ? [] : []);
  // views-more/views-extra samo gdje ih JavaScript stvarno koristi (ostalo je već u HTML-u);
  // search.js se učitava kasnije (app.js), tek u mirovanju ili na prvo otvaranje pretrage.
  const views = ['js/views.js']
    .concat(VIEWS_MORE_PAGES.includes(desc.page) ? ['js/views-more.js'] : [])
    .concat(VIEWS_EXTRA_PAGES.includes(desc.page) ? ['js/views-extra.js'] : []);
  const scripts = ['js/strings.js', 'data/brands.js', 'data/flavors.js'].concat(data, ['js/illustrations.js', 'js/effects.js'], views, ['js/pages.js', 'js/app.js'], PAGE_SCRIPTS[desc.page] || []);
  const other = LANGS.filter((l) => l !== lang);

  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(d)}">`,
    indexable ? `<link rel="canonical" href="${canonical}">` : '<meta name="robots" content="noindex">',
    indexable ? LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs(alt[l])}">`).join('') + `<link rel="alternate" hreflang="x-default" href="${abs(alt[DEFAULT_LANG])}">` : '',
    `<meta name="theme-color" content="${info.theme.bg}">`,
    CFG.ANALYTICS_TOKEN ? `<meta name="msp-analytics" content="${esc(CFG.ANALYTICS_TOKEN)}">` : '',
    '<meta name="color-scheme" content="dark light">',
    `<meta property="og:type" content="${desc.page === 'home' ? 'website' : 'article'}">`,
    `<meta property="og:site_name" content="${esc(CFG.SITE_NAME)}">`,
    `<meta property="og:locale" content="${OG_LOCALE[lang]}">`,
    other.map((l) => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`).join(''),
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(d)}">`,
    indexable ? `<meta property="og:url" content="${canonical}">` : '',
    `<meta property="og:image" content="${ogImage}">`,
    '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${esc(t('meta.ogImageAlt'))}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(d)}">`,
    `<meta name="twitter:image" content="${ogImage}">`,
    `<link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml">`,
    '<link rel="icon" href="/icons/icon-32.png" sizes="32x32" type="image/png">',
    '<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">',
    '<link rel="manifest" href="/manifest.webmanifest">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    FONT_PRELOADS.concat(lang === 'bs' ? FONT_PRELOADS_BS : []).map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${f}">`).join(''),
    `<link rel="stylesheet" href="${asset('css/style.css')}">`,
    `<script>${HEAD_SCRIPT}</script>`,
    scripts.map((s) => `<script defer src="${asset(s)}"></script>`).join(''),
    structuredData(desc, lang, info)
  ].filter(Boolean).join('\n');
}

function renderPage(desc) {
  const lang = desc.lang;
  setLang(lang);
  desc.alternates = V.alternates(desc);
  const info = V.page(desc, CFG);
  const t = MSP.t;
  const htmlAttrs = [
    `lang="${lang}"`,
    `data-scheme="${info.theme.scheme}"`,
    info.mood ? `data-mood="${info.mood}"` : '',
    `style="${V.themeStyle(info.theme)}"`
  ].filter(Boolean).join(' ');
  const bodyAttrs = `data-page="${desc.page}"` + (desc.id ? ` data-id="${esc(desc.id)}"` : '') +
    ` data-smoke="${esc(info.theme.smoke.join(','))}" data-search="${asset('js/search.js')}"`;

  const html = `<!doctype html>
<html ${htmlAttrs}>
<head>
${head(desc, lang, info)}
</head>
<body ${bodyAttrs}>
<a class="skip-link" id="skip-link" href="#main">${esc(t('a11y.skipToContent'))}</a>
${LOADER}
<div class="veil-arrive" aria-hidden="true"></div>
<div class="lounge" aria-hidden="true"><span class="lounge__glow lounge__glow--a"></span><span class="lounge__glow lounge__glow--b"></span></div>
<div class="app" id="app">
<header class="site-header" id="site-header">${V.header(desc)}</header>
<main class="site-main" id="main" tabindex="-1">
${info.main}
</main>
<footer class="site-footer" id="site-footer">${V.footer(desc, CFG)}</footer>
</div>
<div id="menu-root">${V.menu(desc)}</div>
<div class="age-gate" id="age-gate">${V.ageGate()}</div>
<noscript><p class="noscript">${esc(t('noscript'))}</p></noscript>
</body>
</html>
`;
  return { html, info };
}

/* ------------------------------------------------------------------ */
/* Početna "/" (bira jezik)                                            */
/* ------------------------------------------------------------------ */

function rootPage() {
  const home = V.themeFor(null);
  // Mapa starih # adresa (npr. #/okus/adalya-dubai) na nove, bez učitavanja podataka.
  const terms = {};
  V.glossary().forEach((g) => { terms[g.id] = { bs: V.termSlug(g, 'bs'), en: V.termSlug(g, 'en') }; });
  const seg = { bs: V.SEG.bs, en: V.SEG.en };
  const cfg = { langs: LANGS, def: DEFAULT_LANG, bsLangs: CFG.BS_BROWSER_LANGS, seg, terms };
  setLang('en');
  const tEn = MSP.t;
  const titleEn = tEn('root.title');
  const chooseEn = tEn('root.choose');
  const labelEn = tEn('root.en');
  setLang('bs');
  const chooseBs = MSP.t('root.choose');
  const labelBs = MSP.t('root.bs');
  setLang('en');
  const script = `(function(){var C=${JSON.stringify(cfg)};var lang=null;try{lang=localStorage.getItem('msp-lang')}catch(e){}
if(C.langs.indexOf(lang)<0){lang=C.def;var l=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']);for(var i=0;i<l.length;i++){var p=String(l[i]).toLowerCase().split('-')[0];if(C.bsLangs.indexOf(p)>-1){lang='bs';break}if(p==='en')break}}
var s=C.seg[lang],h=location.hash||'',m,u='/'+lang+'/',q='';
function d(x){try{return decodeURIComponent(x)}catch(e){return x}}
if(h.indexOf('#/')===0){h=d(h.slice(2));
if(m=h.match(/^okus\\/([^/?#]+)/))u+=s.flavor+'/'+encodeURIComponent(m[1])+'/';
else if(m=h.match(/^mikser(?:\\/([^/]+)\\+([^/]+)(?:\\/(\\d+))?)?/)){u+=s.mixer+'/';if(m[1])q='?a='+encodeURIComponent(m[1])+'&b='+encodeURIComponent(m[2])+(m[3]?'&r='+m[3]:'')}
else if(/^kviz/.test(h))u+=s.quiz+'/';
else if(m=h.match(/^vodic(?:\\/(\\d+))?/)){u+=s.guide+'/';if(m[1])q='?'+(lang==='bs'?'korak':'step')+'='+m[1]}
else if(m=h.match(/^rjecnik(?:\\/([^/]+))?/)){u+=s.glossary+'/';if(m[1]&&C.terms[m[1]])u+=C.terms[m[1]][lang]+'/'}
else if(/^oprema/.test(h))u+=s.gear+'/';}
location.replace(u+q)})();`;
  return `<!doctype html>
<html lang="en" style="${V.themeStyle(home)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titleEn)}</title>
<meta name="description" content="${esc(tEn('meta.homeDescription'))}">
<link rel="canonical" href="${abs('/' + DEFAULT_LANG + '/')}">
${LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${abs('/' + l + '/')}">`).join('')}<link rel="alternate" hreflang="x-default" href="${abs('/' + DEFAULT_LANG + '/')}">
<meta name="theme-color" content="${home.bg}">
<link rel="icon" href="${asset('favicon.svg')}" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<script>${script}</script>
<style>
body{margin:0;min-height:100vh;display:grid;place-items:center;background:${home.bg};color:${home.text};font:16px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;text-align:center;padding:24px}
h1{font-size:1.75rem;margin:0 0 8px}p{margin:0 0 20px;color:${home.muted}}
nav{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
a{display:inline-block;min-width:160px;padding:14px 22px;border-radius:999px;border:1px solid rgba(244,235,223,.3);color:${home.text};text-decoration:none;font-weight:600}
a:hover,a:focus-visible{border-color:${home.accentInk};outline:none;color:${home.accentInk}}
</style>
</head>
<body>
<main>
<h1>MyShishapedia</h1>
<p lang="bs">${esc(chooseBs)}</p>
<p>${esc(chooseEn)}</p>
<nav aria-label="Language / Jezik">
<a href="/bs/" hreflang="bs" lang="bs">${esc(labelBs)}</a>
<a href="/en/" hreflang="en" lang="en">${esc(labelEn)}</a>
</nav>
</main>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ */
/* Spisak stranica                                                     */
/* ------------------------------------------------------------------ */

function pageList() {
  const list = [];
  for (const lang of LANGS) {
    const simple = ['home', 'mixer', 'quiz', 'guide', 'glossary', 'gear', 'about'];
    for (const p of simple) list.push({ lang, page: p, url: V.urlFor(lang, p) });
    for (const f of V.flavors()) list.push({ lang, page: 'flavor', id: f.id, flavor: f, url: V.urlFor(lang, 'flavor', f.id) });
    for (const g of V.glossary()) list.push({ lang, page: 'term', id: g.id, term: g, url: V.urlFor(lang, 'term', V.termSlug(g, lang)) });
    list.push({ lang, page: 'collections', url: V.urlFor(lang, 'collections') });
    for (const col of V.collections()) list.push({ lang, page: 'collection', id: col.id, collection: col, url: V.urlFor(lang, 'collection', col.slug[lang]) });
    list.push({ lang, page: 'compare', url: V.urlFor(lang, 'compare') });
    for (const pair of V.comparePairs()) list.push({ lang, page: 'comparePair', id: pair.slug, pair, url: V.urlFor(lang, 'comparePair', pair.slug) });
    list.push({ lang, page: 'mixes', url: V.urlFor(lang, 'mixes') });
    for (const m of V.mixes()) list.push({ lang, page: 'recipe', id: m.id, recipe: m, url: V.urlFor(lang, 'recipe', m.slug[lang]) });
    for (const p of V.EXTRA_PAGES) list.push({ lang, page: p, url: V.urlFor(lang, p) });
    for (const b of V.brands()) list.push({ lang, page: 'brand', id: b.slug, brand: b, url: V.urlFor(lang, 'brand', b.slug) });
    list.push({ lang, page: 'notfound', url: '/' + lang + '/404.html', year: null });
  }
  return list;
}

/* ------------------------------------------------------------------ */
/* Provjere                                                            */
/* ------------------------------------------------------------------ */

const errors = [];

function checkMeta(pages) {
  const titles = new Map();
  const descs = new Map();
  for (const p of pages) {
    const { html, desc, info } = p;
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    if (h1 !== 1) errors.push(`${desc.url}: ${h1} h1 naslova (treba tačno 1)`);
    if (!info.title) errors.push(`${desc.url}: nema naslova`);
    if (!info.description) errors.push(`${desc.url}: nema opisa`);
    if (info.description && info.description.length > 155) errors.push(`${desc.url}: opis ima ${info.description.length} znakova (najviše 155)`);
    if (desc.page === 'notfound' || V.NOINDEX_PAGES.indexOf(desc.page) !== -1) continue;
    if (titles.has(info.title)) errors.push(`${desc.url}: isti naslov kao ${titles.get(info.title)}`);
    titles.set(info.title, desc.url);
    if (descs.has(info.description)) errors.push(`${desc.url}: isti opis kao ${descs.get(info.description)}`);
    descs.set(info.description, desc.url);
    if (!/<link rel="canonical"/.test(html)) errors.push(`${desc.url}: nema canonical`);
    if ((html.match(/hreflang="/g) || []).length < 3) errors.push(`${desc.url}: nedostaju hreflang linkovi`);
    if (/grabafaceit@|mailto:/.test(html)) errors.push(`${desc.url}: email je u HTML-u kao običan tekst`);
  }
}

/** Provjera internih linkova: svaki href/src koji počinje sa "/" mora postojati u dist/. */
function checkLinks() {
  const htmlFiles = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) htmlFiles.push(p);
    }
  })(DIST);

  const idCache = new Map();
  function idsOf(file) {
    if (!idCache.has(file)) {
      const html = fs.readFileSync(file, 'utf8');
      idCache.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
    }
    return idCache.get(file);
  }

  let count = 0;
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    const rel = '/' + path.relative(DIST, file).split(path.sep).join('/');
    for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
      const raw = m[1].replace(/&amp;/g, '&');
      if (!raw || /^(https?:|mailto:|tel:|data:|javascript:)/.test(raw)) continue;
      count++;
      if (raw.startsWith('#')) {
        if (raw.length > 1 && !idsOf(file).has(raw.slice(1))) errors.push(`${rel}: sidro ${raw} ne postoji na stranici`);
        continue;
      }
      if (!raw.startsWith('/')) { errors.push(`${rel}: relativan link ${raw} (koristi apsolutne /...)`); continue; }
      const [pathPart, hash] = raw.split('#');
      const clean = decodeURIComponent(pathPart.split('?')[0]);
      let target = path.join(DIST, clean);
      if (clean.endsWith('/')) target = path.join(target, 'index.html');
      if (!fs.existsSync(target)) { errors.push(`${rel}: link ${raw} ne vodi nigdje`); continue; }
      if (hash && target.endsWith('.html') && !idsOf(target).has(hash)) errors.push(`${rel}: sidro #${hash} ne postoji na ${clean}`);
    }
  }
  return { files: htmlFiles.length, links: count };
}

/* ------------------------------------------------------------------ */
/* Build                                                               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Indeks za globalnu pretragu (učitava se tek kad se pretraga otvori)  */
/* ------------------------------------------------------------------ */

function stripTerms(s) { return String(s || '').replace(/\[\[[a-z0-9-]+\|([^\]]+)\]\]/g, '$1'); }

function writeSearchIndex() {
  const both = (v) => LANGS.map((l) => MSP.L(v, l)).flat().filter(Boolean);
  for (const lang of LANGS) {
    setLang(lang);
    const items = [];
    const add = (g, title, desc, url, color, keys) => items.push({
      g, t: title, d: V.clip(desc || '', 110), u: url, c: color || '',
      k: V.normalize([title].concat(keys || []).join(' '))
    });
    for (const f of V.flavors()) {
      add('flavor', f.brand + ' ' + f.name, MSP.L(f.shortDescription), V.flavorUrl(f), V.themeFor(f).bg,
        [f.id, f.brandId].concat((f.ingredients || []).flatMap((i) => both(i.name)), (f.tags || []).flatMap((x) => [MSP.strings.bs.tags[x], MSP.strings.en.tags[x]]),
          V.collectionsOf(f).flatMap((c) => both(c.title))));
    }
    for (const b of V.brands()) {
      add('brand', b.name, MSP.L(b.short), V.brandUrl(b), V.brandTheme(b).bg,
        [b.slug].concat(both(b.country), V.brandFlavors(b).map((f) => f.name), [MSP.strings.bs.leaf[b.leaf === 'dark' ? 'dark' : 'light'], MSP.strings.en.leaf[b.leaf === 'dark' ? 'dark' : 'light']]));
    }
    for (const c of V.collections()) {
      add('collection', MSP.L(c.title), MSP.L(c.short), V.collectionUrl(c), V.collectionTheme(c).bg, both(c.title).concat(V.collectionMembers(c).map((f) => f.name)));
    }
    for (const m of V.mixes()) {
      add('recipe', MSP.L(m.name), V.recipePartsText(m), V.recipeUrl(m), V.recipeTheme(m).bg,
        both(m.name).concat(V.recipeFlavors(m).map((f) => f.name), m.tags.flatMap((x) => [MSP.strings.bs.tags[x], MSP.strings.en.tags[x]])));
    }
    for (const g of V.glossary()) {
      add('term', MSP.L(g.term), MSP.L(g.short), V.termUrl(g), '', both(g.term).concat(both(g.aka).flat()));
    }
    V.guideSteps().forEach((s, i) => {
      add('guide', (i + 1) + '. ' + MSP.L(s.title), stripTerms((MSP.L(s.text) || [])[0]), V.guideStepUrl(i + 1), '', both(s.title));
    });
    const G = (sandbox.GEAR || {}).categories || {};
    for (const key of Object.keys(G)) {
      for (const it of G[key].items) add('gear', MSP.L(it.name), MSP.L(it.short), V.url('gear') + '#oprema-' + it.id, '', both(it.name));
    }
    for (const p of V.comparePairs()) {
      add('compare', p.a.name + ' vs ' + p.b.name, V.compareText(p.a, p.b), V.pairUrl(p), '', ['vs', 'compare', 'poredjenje']);
    }
    const pages = [['flavors', 'allFlavors', 'flavorsDescription'], ['brands', 'brands', 'brandsDescription'], ['collections', 'collections', 'collectionsDescription'], ['mixes', 'mixes', 'mixesDescription'],
      ['compare', 'compare', 'compareDescription'], ['mixer', 'mixer', 'mixerDescription'], ['quiz', 'quiz', 'quizDescription'], ['guide', 'guide', 'guideDescription'],
      ['glossary', 'glossary', 'glossaryDescription'], ['gear', 'gear', 'gearDescription'], ['about', 'about', 'aboutDescription'],
      ['suggest', 'suggest', 'suggestDescription'], ['privacy', 'privacy', 'privacyDescription'], ['terms', 'terms', 'termsDescription']];
    for (const [page, navKey, metaKey] of pages) {
      add('page', MSP.t('nav.' + navKey), MSP.t('meta.' + metaKey), V.url(page), '', LANGS.map((l) => MSP.strings[l].nav[navKey]));
    }
    writeFile('search/' + lang + '.json', JSON.stringify({ v: 1, items }));
  }
}

/* ------------------------------------------------------------------ */
/* Cloudflare Pages: _headers i _redirects                             */
/* ------------------------------------------------------------------ */

function hostOf(url) {
  try { return new URL(url).origin; } catch { return ''; }
}

/** Sve inline <script> (bez src i bez JSON-LD) iz gotovih stranica, kao CSP hashevi. */
function inlineScriptHashes() {
  const hashes = new Set();
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) {
        const html = fs.readFileSync(p, 'utf8');
        for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
          hashes.add("'sha256-" + crypto.createHash('sha256').update(m[1], 'utf8').digest('base64') + "'");
        }
      }
    }
  })(DIST);
  return [...hashes];
}

function writeCloudflareFiles() {
  const form = hostOf(CFG.FORM_ENDPOINT);
  const analytics = !!CFG.ANALYTICS_TOKEN;
  const csp = [
    "default-src 'self'",
    ["script-src 'self'", ...inlineScriptHashes(), analytics ? 'https://static.cloudflareinsights.com' : ''].filter(Boolean).join(' '),
    // inline style atributi nose boje okusa (style="--c-bg:..."), pa su potrebni
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    ["connect-src 'self'", analytics ? 'https://cloudflareinsights.com' : '', form].filter(Boolean).join(' '),
    ["form-action 'self'", form].filter(Boolean).join(' '),
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "object-src 'none'",
    "manifest-src 'self'",
    "worker-src 'self' blob:"
  ].join('; ');

  const long = 'public, max-age=31536000, immutable';
  const html = 'public, max-age=0, must-revalidate';
  const headers = [
    '# Generiše build.mjs (ne mijenjaj ručno). Cloudflare Pages čita ovaj fajl iz dist/.',
    '/*',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    '  X-Frame-Options: DENY',
    '  Content-Security-Policy: ' + csp,
    '',
    '# CSS, JS i podaci imaju verziju u adresi (?v=hash), pa ih browser smije dugo čuvati.',
    ...['/css/*', '/js/*', '/data/*'].flatMap((p) => [p, '  Cache-Control: ' + long, '']),
    '/search/*',
    '  Cache-Control: public, max-age=3600',
    '',
    '# HTML uvijek svjež',
    ...['/', '/index.html', '/404.html', '/bs/*', '/en/*'].flatMap((p) => [p, '  Cache-Control: ' + html, '']),
    '/icons/*',
    '  Cache-Control: public, max-age=604800',
    '',
    '/og-image.png',
    '  Cache-Control: public, max-age=86400',
    ''
  ];
  writeFile('_headers', headers.join('\n'));

  // Adrese bez jezika (npr. stari ili ručno upisani linkovi) vode na engleski ili bosanski.
  const r = [
    '# Generiše build.mjs. Format: <od> <do> <status>',
    '/okus/*  /bs/okus/:splat  301',
    '/flavor/*  /en/flavor/:splat  301',
    '/mikser  /bs/mikser/  301',
    '/mixer  /en/mixer/  301',
    '/kviz  /bs/kviz/  301',
    '/quiz  /en/quiz/  301',
    '/rjecnik/*  /bs/rjecnik/:splat  301',
    '/glossary/*  /en/glossary/:splat  301',
    '/recepti/*  /bs/recepti/:splat  301',
    '/mixes/*  /en/mixes/:splat  301',
    '/kolekcije/*  /bs/kolekcije/:splat  301',
    '/collections/*  /en/collections/:splat  301',
    '/brendovi/*  /bs/brendovi/:splat  301',
    '/brands/*  /en/brands/:splat  301'
  ];
  writeFile('_redirects', r.join('\n') + '\n');
}

/**
 * Provjera podataka: svaki okus ima postojeći brend i vrstu lista, svaki brend ima bar jedan okus,
 * kolekcije nisu prazne (a "Za početnike" nema tamni list), recepti imaju ispravne okuse i omjer.
 */
function checkData() {
  for (const fl of V.flavors()) {
    if (!V.brandOf(fl)) errors.push(`okus ${fl.id}: nepoznat brend ${fl.brandId}`);
    if (!['light', 'dark'].includes(fl.leaf)) errors.push(`okus ${fl.id}: leaf mora biti 'light' ili 'dark'`);
    for (const id of fl.similar || []) if (!V.flavorById(id)) errors.push(`okus ${fl.id}: nepostojeći sličan okus ${id}`);
  }
  for (const b of V.brands()) {
    if (!V.brandFlavors(b).length) errors.push(`brend ${b.slug}: nema nijednog okusa`);
    if (!['light', 'dark', 'both'].includes(b.leaf)) errors.push(`brend ${b.slug}: leaf mora biti light, dark ili both`);
    for (const l of LANGS) if (!MSP.L(b.country, l) || !MSP.L(b.short, l) || !(MSP.L(b.about, l) || []).length) errors.push(`brend ${b.slug}: fali tekst (${l})`);
  }
  const beginners = V.collections().filter((c) => c.id === 'beginners')[0];
  if (beginners) for (const fl of V.collectionMembers(beginners)) if (fl.leaf === 'dark') errors.push(`kolekcija beginners: tamni list ${fl.id} ne smije biti za početnike`);
  for (const col of V.collections()) {
    if (!V.collectionMembers(col).length) errors.push(`kolekcija ${col.id}: nema nijednog okusa`);
    for (const l of LANGS) {
      if (!col.slug[l] || !MSP.L(col.title, l) || !(MSP.L(col.intro, l) || []).length) errors.push(`kolekcija ${col.id}: fali slug, naslov ili uvod (${l})`);
    }
    for (const id of (col.include || []).concat(col.exclude || [])) {
      if (!V.flavorById(id)) errors.push(`kolekcija ${col.id}: nepostojeći okus ${id}`);
    }
  }
  const slugs = new Set();
  for (const m of V.mixes()) {
    if (m.parts.length !== 2) errors.push(`recept ${m.id}: treba tačno 2 okusa`);
    const sum = m.parts.reduce((s, p) => s + p.pct, 0);
    if (sum !== 100) errors.push(`recept ${m.id}: zbir procenata je ${sum}, treba 100`);
    for (const p of m.parts) {
      if (!V.flavorById(p.flavor)) errors.push(`recept ${m.id}: nepostojeći okus ${p.flavor}`);
      if (p.pct < 20 || p.pct > 80 || p.pct % 5) errors.push(`recept ${m.id}: udio ${p.pct}% (dozvoljeno 20-80, korak 5)`);
    }
    if (!['light', 'medium', 'strong'].includes(m.strength)) errors.push(`recept ${m.id}: nepoznata jačina ${m.strength}`);
    for (const l of LANGS) {
      const key = l + ':' + m.slug[l];
      if (slugs.has(key)) errors.push(`recept ${m.id}: dupli slug ${key}`);
      slugs.add(key);
      if (!MSP.L(m.name, l) || !(MSP.L(m.description, l) || []).length || !(MSP.L(m.tips, l) || []).length) errors.push(`recept ${m.id}: fali tekst (${l})`);
    }
  }
}

function build() {
  const started = Date.now();
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  const year = new Date().getFullYear();
  const rendered = [];
  for (const desc of pageList()) {
    desc.year = year;
    const { html, info } = renderPage(desc);
    writeFile(fileFor(desc.url), html);
    rendered.push({ desc, info, html });
  }

  // Globalni 404 (npr. /nesto) = engleska 404 stranica.
  fs.copyFileSync(path.join(DIST, 'en/404.html'), path.join(DIST, '404.html'));
  writeFile('index.html', rootPage());

  // sitemap.xml sa hreflang parovima
  const today = new Date().toISOString().slice(0, 10);
  const urls = rendered.filter((r) => r.desc.page !== 'notfound' && V.NOINDEX_PAGES.indexOf(r.desc.page) === -1).map((r) => {
    const alt = r.desc.alternates;
    return '  <url>\n' +
      `    <loc>${abs(r.desc.url)}</loc>\n` +
      `    <lastmod>${today}</lastmod>\n` +
      LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(alt[l])}"/>\n`).join('') +
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(alt[DEFAULT_LANG])}"/>\n` +
      '  </url>';
  });
  writeFile('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + urls.join('\n') + '\n</urlset>\n');
  writeFile('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);

  // statični fajlovi
  copyDir('css', 'css');
  copyDir('js', 'js');
  copyDir('data', 'data', (f) => !f.endsWith('about.js') && !f.endsWith('legal.js'));
  fs.copyFileSync(path.join(ROOT, 'favicon.svg'), path.join(DIST, 'favicon.svg'));
  if (fs.existsSync(path.join(ROOT, 'static'))) copyDir('static', '.');

  writeSearchIndex();
  writeCloudflareFiles();

  checkData();
  checkMeta(rendered);
  const stats = checkLinks();

  const missing = warnings.filter((w) => /Nedostaje tekst/.test(w));
  missing.forEach((w) => errors.push(w));
  warnings.filter((w) => !/Nedostaje tekst/.test(w)).forEach((w) => console.warn('upozorenje: ' + w));

  if (errors.length) {
    console.error('\nBuild NIJE uspio (' + errors.length + ' grešaka):');
    [...new Set(errors)].forEach((e) => console.error('  - ' + e));
    process.exit(1);
  }
  console.log(`Build gotov za ${Date.now() - started} ms: ${rendered.length} stranica + početna i 404, ` +
    `${stats.links} internih linkova provjereno u ${stats.files} HTML fajlova. SITE_URL = ${SITE}`);
}

build();
