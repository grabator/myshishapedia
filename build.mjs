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
  'data/tips.js',
  'data/history.js',
  'data/history-map.js',
  'data/history-chapters.js',
  'js/illustrations.js',
  'js/views.js',
  'js/views-more.js',
  'js/views-extra.js',
  'js/views-shelf.js',
  'data/lounges.js',
  'js/views-lounge.js',
  'js/views-history.js'
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
for (const key of ['ANALYTICS_TOKEN', 'FORM_ENDPOINT', 'TURNSTILE_SITE_KEY']) {
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
  'js/search.js', 'js/forms.js', 'js/share.js', 'js/ratings.js', 'js/shelf.js', 'js/qr.js', 'js/journal.js', 'js/session.js', 'js/pwa.js', 'data/lounges.js', 'js/lounge.js', 'data/history.js', 'js/history.js', 'favicon.svg'];
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
  recipe: ['data/mixes.js'],
  history: ['data/history.js'],
  lounge: ['data/lounges.js']
};

// Dodatne skripte samo gdje trebaju.
const VIEWS_MORE_PAGES = ['home', 'compare', 'comparePair', 'mixer', 'recipe'];
const VIEWS_EXTRA_PAGES = ['flavors', 'quiz', 'brand'];

const PAGE_SCRIPTS = {
  search: ['js/search.js'],
  suggest: ['js/forms.js'],
  report: ['js/forms.js'],
  flavor: ['js/share.js'],
  recipe: ['js/share.js'],
  mixer: ['js/share.js'],
  quiz: ['js/share.js'],
  history: ['js/history.js'],
  session: ['js/qr.js', 'js/journal.js', 'js/session.js'],
  journal: ['js/journal.js'],
  lounge: ['js/lounge.js']
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
// Fontovi samo za pojedine stranice (serif za staru kartu na "Evoluciji nargile").
const PAGE_FONTS = { history: ['/fonts/cormorant-garamond-latin-600-normal.woff2'], chapter: ['/fonts/cormorant-garamond-latin-600-normal.woff2'] };


// Izvršava se u <head> prije iscrtavanja: jezik, provjera godina, loader samo pri
// prvoj posjeti u sesiji, i "raziđi oblak" ako se stiglo prelazom sa druge stranice.
const HEAD_SCRIPT = `(function(){var d=document.documentElement,c=' js';function g(s,k){try{return window[s].getItem(k)}catch(e){return null}}function s(t,k,v){try{window[t].setItem(k,v)}catch(e){}}
if(g('localStorage','msp-age-ok')==='1')c+=' age-ok';
if((g('localStorage','msp-shelf')||'[]').length>2)c+=' has-shelf';
if((g('localStorage','msp-recent')||'[]').length>2)c+=' has-recent';
if(c.indexOf('has-')>0||/"flavor:[^"]+":[45]/.test(g('localStorage','msp-ratings')||''))c+=' has-reco';
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
  if (desc.page === 'history') return historyLd(desc, lang, info) + breadcrumbLd(info);
  if (desc.page === 'chapter') return chapterLd(desc, lang, info) + breadcrumbLd(info);
  return breadcrumbLd(info);
}

function breadcrumbLd(info) {
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: info.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.url.replace(/#.*$/, '')) }))
  });
}

/** Članak "Evolucija nargile": Article sa izvorima (citation). */
function historyLd(desc, lang, info) {
  const H = sandbox.HISTORY;
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: MSP.t('history.title'),
    description: info.description,
    inLanguage: lang,
    url: abs(desc.url),
    image: abs(info.ogImage || '/og-image.png'),
    datePublished: HISTORY_PUBLISHED,
    dateModified: HISTORY_PUBLISHED,
    author: { '@type': 'Person', name: CFG.AUTHOR_NAME },
    publisher: { '@type': 'Organization', name: CFG.SITE_NAME, url: abs('/') },
    about: ['hookah', 'shisha', 'narghile', 'qalyan', 'huqqa'],
    citation: H.sources.filter(Boolean).map((s) => s.u)
  });
}

/** Poglavlje "Evolucije nargile": Article, dio glavnog članka, sa izvorima. */
function chapterLd(desc, lang, info) {
  const ch = desc.chapter;
  return jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: MSP.L(ch.title),
    description: info.description,
    inLanguage: lang,
    url: abs(desc.url),
    image: abs(info.ogImage || '/og-image.png'),
    datePublished: CHAPTERS_PUBLISHED,
    dateModified: CHAPTERS_PUBLISHED,
    author: { '@type': 'Person', name: CFG.AUTHOR_NAME },
    publisher: { '@type': 'Organization', name: CFG.SITE_NAME, url: abs('/') },
    isPartOf: { '@type': 'Article', headline: MSP.t('history.title'), url: abs(V.urlFor(lang, 'history')) },
    wordCount: V.chapterPlain(ch).split(/\s+/).length,
    citation: ch.sources.map((s) => V.chapterSource(s).u)
  });
}

/**
 * Smije li Google prikazivati stranicu. Stranice poređenja su sve na sajtu, ali u Googleu su samo
 * parovi iz SITE_CONFIG.INDEX_COMPARE_PAIRS (ostale imaju noindex i nisu u sitemapu).
 */
const INDEX_PAIRS = new Set(CFG.INDEX_COMPARE_PAIRS || []);
function isIndexable(desc) {
  if (desc.page === 'notfound' || V.NOINDEX_PAGES.indexOf(desc.page) !== -1) return false;
  if (desc.page === 'comparePair') return INDEX_PAIRS.has(desc.pair.slug);
  // izmišljeni (demo) lounge ne smije u Google kao pravi kafić
  if (desc.page === 'lounge') return !desc.lounge.demo;
  return true;
}

// Datum objave poglavlja.
const CHAPTERS_PUBLISHED = '2026-10-21';

// Datum objave stranice "Evolucija nargile" (mijenja se kad se sadržaj bitno promijeni).
const HISTORY_PUBLISHED = '2026-10-21';

function head(desc, lang, info) {
  const t = MSP.t;
  const alt = desc.alternates;
  const indexable = isIndexable(desc);
  const canonical = abs(desc.url);
  const title = info.title;
  const d = info.description;
  const ogImage = abs(info.ogImage || '/og-image.png');
  const data = (PAGE_DATA[desc.page] || []).concat(desc.page === 'term' ? [] : []);
  // views-more/views-extra samo gdje ih JavaScript stvarno koristi (ostalo je već u HTML-u);
  // search.js se učitava kasnije (app.js), tek u mirovanju ili na prvo otvaranje pretrage.
  const views = ['js/views.js']
    .concat(VIEWS_MORE_PAGES.includes(desc.page) ? ['js/views-more.js'] : [])
    .concat(VIEWS_EXTRA_PAGES.includes(desc.page) ? ['js/views-extra.js'] : []);
  const scripts = ['js/strings.js', 'data/brands.js', 'data/flavors.js'].concat(data, ['js/illustrations.js', 'js/effects.js'], views, ['js/pages.js', 'js/shelf.js', 'js/app.js', 'js/ratings.js', 'js/pwa.js'], PAGE_SCRIPTS[desc.page] || []);
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
    CFG.TURNSTILE_SITE_KEY ? `<meta name="msp-turnstile" content="${esc(CFG.TURNSTILE_SITE_KEY)}">` : '',
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
    `<link rel="manifest" href="/manifest-${lang}.webmanifest">`,
    '<meta name="apple-mobile-web-app-title" content="MyShishapedia">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    FONT_PRELOADS.concat(lang === 'bs' ? FONT_PRELOADS_BS : [], PAGE_FONTS[desc.page] || []).map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${f}">`).join(''),
    `<link rel="stylesheet" href="${asset('css/style.css')}">`,
    `<script>${HEAD_SCRIPT}</script>`,
    // skripte se preuzimaju odmah, a pokreću tek kad se stranica prvi put iscrta (brži LCP na slabim telefonima)
    scripts.map((s) => `<link rel="preload" as="script" fetchpriority="low" href="${asset(s)}">`).join(''),
    `<script>${scriptLoader(scripts.map(asset))}</script>`,
    structuredData(desc, lang, info)
  ].filter(Boolean).join('\n');
}

/** Pokreće skripte redom, ali tek poslije DOMContentLoaded i prvog iscrtavanja (vidi renderHead). */
function scriptLoader(list) {
  return "(function(l){function go(){l.forEach(function(s){var e=document.createElement('script');e.src=s;e.async=false;document.head.appendChild(e)})}" +
    "function paint(){requestAnimationFrame(function(){setTimeout(go,0)})}" +
    "if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',paint);else paint()})(" + JSON.stringify(list) + ')';
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
<header class="site-header" id="site-header">${desc.page === 'lounge' ? V.loungeHeader(desc) : V.header(desc)}</header>
<main class="site-main" id="main" tabindex="-1">
${info.main}
</main>
<footer class="site-footer" id="site-footer">${desc.page === 'lounge' ? V.loungeFooter(desc) : V.footer(desc, CFG)}</footer>
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
<link rel="manifest" href="/manifest-${DEFAULT_LANG}.webmanifest">
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
    const simple = ['home', 'mixer', 'quiz', 'guide', 'glossary', 'gear', 'about', 'history'];
    for (const p of simple) list.push({ lang, page: p, url: V.urlFor(lang, p) });
    for (const ch of V.historyChapters()) list.push({ lang, page: 'chapter', id: ch.id, chapter: ch, url: V.chapterUrl(ch, lang) });
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
    list.push({ lang, page: 'loungeInfo', url: V.urlFor(lang, 'loungeInfo') });
    for (const lg of V.lounges()) list.push({ lang, page: 'lounge', id: lg.id, lounge: lg, url: V.urlFor(lang, 'lounge', lg.id) });
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
    if (!isIndexable(desc)) continue;
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
    for (const s of V.tipSections()) {
      add('tips', MSP.L(s.title), stripTerms(MSP.L(s.lead)), V.url('tips') + '#savjet-' + s.id, '', both(s.title).concat(s.tips.flatMap((x) => both(x.title))));
    }
    const G = (sandbox.GEAR || {}).categories || {};
    for (const key of Object.keys(G)) {
      for (const it of G[key].items) add('gear', MSP.L(it.name), MSP.L(it.short), V.url('gear') + '#oprema-' + it.id, '', both(it.name));
    }
    for (const p of V.comparePairs()) {
      add('compare', V.uniqueName(p.a) + ' vs ' + V.uniqueName(p.b), V.compareText(p.a, p.b), V.pairUrl(p), '', ['vs', 'compare', 'poredjenje']);
    }
    const pages = [['flavors', 'allFlavors', 'flavorsDescription'], ['brands', 'brands', 'brandsDescription'], ['collections', 'collections', 'collectionsDescription'], ['mixes', 'mixes', 'mixesDescription'],
      ['compare', 'compare', 'compareDescription'], ['mixer', 'mixer', 'mixerDescription'], ['quiz', 'quiz', 'quizDescription'], ['guide', 'guide', 'guideDescription'],
      ['glossary', 'glossary', 'glossaryDescription'], ['gear', 'gear', 'gearDescription'], ['about', 'about', 'aboutDescription'], ['top', 'top', 'topDescription'], ['tips', 'tips', 'tipsDescription'], ['session', 'session', 'sessionDescription'], ['loungeInfo', 'loungeInfo', 'loungeInfoDescription'], ['history', 'history', 'historyDescription'],
      ['suggest', 'suggest', 'suggestDescription'], ['privacy', 'privacy', 'privacyDescription'], ['terms', 'terms', 'termsDescription']];
    V.historyChapters().forEach((ch, i) => {
      add('page', (i + 1) + '. ' + MSP.L(ch.title), MSP.L(ch.lead), V.chapterUrl(ch), '', both(ch.title).concat(ch.sections.flatMap((x) => both(x.h)), [MSP.strings.bs.nav.history, MSP.strings.en.nav.history]));
    });
    for (const [page, navKey, metaKey] of pages) {
      add('page', MSP.t('nav.' + navKey), MSP.t('meta.' + metaKey), V.url(page), '', LANGS.map((l) => MSP.strings[l].nav[navKey]));
    }
    writeFile('search/' + lang + '.json', JSON.stringify({ v: 1, items }));
  }
}

/* ------------------------------------------------------------------ */
/* Aplikacija na početnom ekranu: manifest (po jeziku) i service worker */
/* ------------------------------------------------------------------ */

function writePwaFiles() {
  const theme = '#140f0c';
  const icons = [
    { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    // ikona ima dovoljno praznog prostora oko znaka, pa je Android smije odrezati u krug
    { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
  ];
  for (const lang of LANGS) {
    const tl = (k) => k.split('.').reduce((o, x) => o[x], MSP.strings[lang]);
    const u = (page) => V.urlFor(lang, page);
    const m = {
      id: '/' + lang + '/',
      name: 'MyShishapedia',
      short_name: 'MyShishapedia',
      description: tl('meta.homeDescription'),
      lang,
      start_url: '/' + lang + '/',
      scope: '/',
      display: 'standalone',
      orientation: 'portrait',
      background_color: theme,
      theme_color: theme,
      categories: ['lifestyle', 'food'],
      icons,
      shortcuts: [['session', 'camera'], ['journal', 'book'], ['mixer', 'mix'], ['shelf', 'jar']].map(([p]) => ({
        name: tl('nav.' + p), url: u(p), icons: [{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }]
      }))
    };
    writeFile('manifest-' + lang + '.webmanifest', JSON.stringify(m, null, 2));
    if (lang === DEFAULT_LANG) writeFile('manifest.webmanifest', JSON.stringify(m, null, 2));
  }

  // Unaprijed sačuvano: skripte i stilovi, stranice "Bez interneta" i ikone. Početna, polica,
  // dnevnik, slika sesije i mikser se sačuvaju samo na jeziku koji posjetilac koristi
  // (js/pwa.js javi jezik), da telefon ne skida obje verzije.
  const WARM = ['home', 'shelf', 'journal', 'session', 'mixer'];
  const byLang = Object.fromEntries(LANGS.map((l) => [l, WARM.map((p) => V.urlFor(l, p))]));
  const files = new Set(['/'].concat(LANGS.map((l) => V.urlFor(l, 'offline'))));
  for (const pg of [...files].concat(...Object.values(byLang))) {
    const file = path.join(DIST, pg, 'index.html');
    if (!fs.existsSync(file)) { errors.push('PWA: nema stranice ' + pg); continue; }
    const html = fs.readFileSync(file, 'utf8');
    for (const m of html.matchAll(/(?:src|href)="(\/[^"]+\?v=[0-9a-f]+)"/g)) files.add(m[1]);
  }
  ['/icons/icon-192.png', '/icons/apple-touch-icon.png', ...LANGS.map((l) => '/manifest-' + l + '.webmanifest')].forEach((f) => files.add(f));
  const list = [...files];
  const version = crypto.createHash('sha1').update(list.join('\n') + JSON.stringify(byLang) + fs.readFileSync(path.join(ROOT, 'build.mjs'))).digest('hex').slice(0, 10);
  const offline = Object.fromEntries(LANGS.map((l) => [l, V.urlFor(l, 'offline')]));

  const sw = `/* MyShishapedia service worker. Generiše build.mjs (ne mijenjaj ručno). Verzija ${version}.
 * HTML: prvo mreža (uvijek svježe), bez mreže sačuvana kopija ili stranica "Bez interneta".
 * Skripte i stilovi sa ?v=hash: iz keša (adresa se mijenja sa svakom izmjenom).
 * Ostalo sa ove stranice (ikone, pretraga, mapa): iz keša, pa osvježi u pozadini.
 * Ocjene (/api/) i forme idu uvijek na mrežu. Google fontove ne dira: browser ih ionako
 * čuva godinu dana (i bez interneta), a CSP (connect-src) ne dozvoljava fetch prema njima. */
'use strict';
const VERSION = ${JSON.stringify(version)};
const PRE = 'msp-pre-' + VERSION;
const ASSETS = 'msp-assets';
const PAGES = 'msp-pages';
const RUNTIME = 'msp-runtime';
const PRECACHE = ${JSON.stringify(list)};
const WARM = ${JSON.stringify(byLang)};
const OFFLINE = ${JSON.stringify(offline)};
const LIMITS = { [PAGES]: 80, [ASSETS]: 120, [RUNTIME]: 60 };

// odgovor koji je došao preko preusmjerenja Safari ne prihvata iz keša, pa se prepiše
async function plain(res) {
  if (!res.redirected) return res;
  return new Response(await res.blob(), { status: res.status, statusText: res.statusText, headers: res.headers });
}
async function trim(name) {
  const c = await caches.open(name);
  const keys = await c.keys();
  for (let i = 0; i < keys.length - LIMITS[name]; i++) await c.delete(keys[i]);
}

// skripte sa ?v= su nepromjenjive, pa smiju iz HTTP keša; HTML se provjeri na serveru
async function save(cacheName, urls, skipHave) {
  const c = await caches.open(cacheName);
  await Promise.all(urls.map(async (u) => {
    try {
      if (skipHave && (await caches.match(u))) return;
      const r = await fetch(u, { cache: /[?&]v=/.test(u) ? 'default' : 'no-cache' });
      if (r.ok) await c.put(u, await plain(r));
    } catch (err) { /* sljedeći put */ }
  }));
}

// js/pwa.js javi jezik: sačuvaj glavne stranice na tom jeziku
self.addEventListener('message', (e) => {
  const d = e.data || {};
  if (d.type === 'warm' && WARM[d.lang]) e.waitUntil(save(PAGES, WARM[d.lang], true));
});

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    await save(PRE, PRECACHE, false);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('msp-pre-') && k !== PRE).map((k) => caches.delete(k)));
    if (self.registration.navigationPreload) { try { await self.registration.navigationPreload.enable(); } catch (err) { /* ignore */ } }
    await self.clients.claim();
  })());
});

async function page(e) {
  const req = e.request;
  const url = new URL(req.url);
  const key = url.origin + url.pathname;
  try {
    const res = (await e.preloadResponse) || (await fetch(req));
    if (res.ok && res.type === 'basic') {
      const copy = await plain(res.clone());
      e.waitUntil(caches.open(PAGES).then((c) => c.put(key, copy)).then(() => trim(PAGES)));
    }
    return res;
  } catch (err) {
    const hit = (await caches.match(key)) || (await caches.match(req, { ignoreSearch: true }));
    if (hit) return hit;
    const lang = url.pathname.split('/')[1] === 'bs' ? 'bs' : 'en';
    return (await caches.match(OFFLINE[lang])) || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
}

async function cacheFirst(e, name) {
  const hit = await caches.match(e.request);
  if (hit) return hit;
  const res = await fetch(e.request);
  if (res.ok || res.type === 'opaque') {
    const copy = res.clone();
    e.waitUntil(caches.open(name).then((c) => c.put(e.request, copy)).then(() => LIMITS[name] && trim(name)));
  }
  return res;
}

async function fresh(e) {
  const hit = await caches.match(e.request);
  const net = fetch(e.request).then((res) => {
    if (res.ok && res.type === 'basic') { const copy = res.clone(); caches.open(RUNTIME).then((c) => c.put(e.request, copy)).then(() => trim(RUNTIME)); }
    return res;
  });
  if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
  return net;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/cdn-cgi/') || url.pathname === '/sw.js') return;
  if (req.mode === 'navigate') { e.respondWith(page(e)); return; }
  if (/[?&]v=[0-9a-f]+/.test(url.search)) { e.respondWith(cacheFirst(e, ASSETS)); return; }
  e.respondWith(fresh(e));
});
`;
  writeFile('sw.js', sw);
}

/* ------------------------------------------------------------------ */

const TURNSTILE = 'https://challenges.cloudflare.com';

function hostOf(url) {
  try { return new URL(url).origin; } catch { return ''; }
}

/*
 * Adrese koje su nekad bile objavljene, a više ih nema (npr. par za poređenje koji se promijenio
 * kad su dodani novi okusi), ne smiju vraćati 404: Google ih pamti. seo/published.json čuva svaku
 * adresu koju je build ikad napravio; za nestale se pravi trajno preusmjerenje (301):
 *   - poređenje "a-vs-b" -> alat za poređenje sa ista dva okusa (?a=&b=)
 *   - ostalo -> najbliža nadređena stranica koja postoji (npr. /bs/okus/x/ -> /bs/okusi/), inače početna
 */
const PUBLISHED_FILE = path.join(ROOT, 'seo/published.json');
// adrese koje je Search Console prijavio kao 404 prije nego što je ovaj spisak postojao
const KNOWN_GONE = [
  '/bs/poredjenje/adalya-blue-ice-vs-adalya-raspberry/',
  '/bs/poredjenje/adalya-angel-lips-vs-adalya-double-melon/',
  '/en/compare/adalya-angel-lips-vs-adalya-double-melon/',
  '/en/compare/adalya-tynky-wynky-vs-fumari-white-gummi-bear/',
  '/bs/poredjenje/adalya-angel-lips-vs-adalya-blue-ice/',
  // parovi iz ranijih verzija podataka (izračunato iz git historije data/flavors.js)
  '/bs/poredjenje/adalya-baku-nights-vs-al-fakher-double-apple/',
  '/en/compare/adalya-baku-nights-vs-al-fakher-double-apple/',
  '/bs/poredjenje/al-fakher-mint-vs-trifecta-twice-the-ice/',
  '/en/compare/al-fakher-mint-vs-trifecta-twice-the-ice/',
  '/bs/poredjenje/adalya-tynky-wynky-vs-fumari-white-gummi-bear/',
  '/en/compare/adalya-tynky-wynky-vs-fumari-white-gummi-bear/',
  '/bs/poredjenje/adalya-dubai-vs-adalya-mint/',
  '/en/compare/adalya-dubai-vs-adalya-mint/'
];

function goneRedirects(rendered) {
  const now = new Set(rendered.filter((r) => r.desc.page !== 'notfound').map((r) => r.desc.url));
  let prev = [];
  try { prev = JSON.parse(fs.readFileSync(PUBLISHED_FILE, 'utf8')); } catch (e) { prev = []; }
  const all = [...new Set(prev.concat(KNOWN_GONE, [...now]))].sort();
  fs.writeFileSync(PUBLISHED_FILE, JSON.stringify(all, null, 0).replace(/","/g, '",\n"') + '\n');
  const lines = [];
  for (const url of all) {
    if (now.has(url)) continue;
    const m = /^\/(bs|en)\/([^/]+)\/([a-z0-9-]+)-vs-([a-z0-9-]+)\/$/.exec(url);
    let to = null;
    if (m && V.flavorById(m[3]) && V.flavorById(m[4]) && V.urlFor(m[1], 'compare') === '/' + m[1] + '/' + m[2] + '/') {
      to = V.urlFor(m[1], 'compare') + '?a=' + m[3] + '&b=' + m[4];
    } else {
      const lang = url.split('/')[1];
      let up = url;
      while (up.split('/').length > 3 && !now.has(up)) up = up.replace(/[^/]+\/$/, '');
      to = now.has(up) ? up : (LANGS.includes(lang) ? '/' + lang + '/' : '/');
      // /bs/okus/x/ nema roditelja /bs/okus/: tada lista svih okusa
      if (/^\/(bs|en)\/$/.test(to) && /\/(okus|flavor)\//.test(url)) to = V.urlFor(lang, 'flavors');
    }
    lines.push(url + '  ' + to + '  301');
  }
  if (lines.length > 1800) warnings.push('_redirects: ' + lines.length + ' preusmjerenja nestalih adresa (Cloudflare dozvoljava 2000)');
  return lines.length ? ['', '# Nekad objavljene adrese kojih više nema (seo/published.json)'].concat(lines) : [];
}

/* ------------------------------------------------------------------ */
/* Cloudflare Pages: _headers i _redirects                             */
/* ------------------------------------------------------------------ */

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

function writeCloudflareFiles(rendered) {
  const form = hostOf(CFG.FORM_ENDPOINT);
  const analytics = !!CFG.ANALYTICS_TOKEN;
  const csp = [
    "default-src 'self'",
    // Turnstile (zaštita ocjena od robota): skripta i iframe sa challenges.cloudflare.com
    ["script-src 'self'", ...inlineScriptHashes(), analytics ? 'https://static.cloudflareinsights.com' : '', TURNSTILE].filter(Boolean).join(' '),
    // inline style atributi nose boje okusa (style="--c-bg:..."), pa su potrebni
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    'frame-src ' + TURNSTILE,
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
    ...['/css/*', '/js/*', '/data/*', '/fonts/*'].flatMap((p) => [p, '  Cache-Control: ' + long, '']),
    '/geo/*',
    '  Cache-Control: public, max-age=2592000',
    '',
    '/search/*',
    '  Cache-Control: public, max-age=3600',
    '',
    '/ratings-ids.json',
    '  Cache-Control: public, max-age=300',
    '',
    '# HTML uvijek svjež',
    ...['/', '/index.html', '/404.html', '/bs/*', '/en/*'].flatMap((p) => [p, '  Cache-Control: ' + html, '']),
    '# service worker se mora uvijek provjeriti, inače aplikacija ostane na staroj verziji',
    '/sw.js',
    '  Cache-Control: no-cache',
    '',
    '/manifest*.webmanifest',
    '  Cache-Control: public, max-age=3600',
    '',
    '/icons/*',
    '  Cache-Control: public, max-age=604800',
    '',
    '/og-image.png',
    '  Cache-Control: public, max-age=86400',
    '',
    '/og-history.jpg',
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
  writeFile('_redirects', r.concat(goneRedirects(rendered)).join('\n') + '\n');

  // Pages Functions rade samo za /api/* (ostalo je statično i ne troši zahtjeve Functionsa).
  writeFile('_routes.json', JSON.stringify({ version: 1, include: ['/api/*'], exclude: [] }, null, 2) + '\n');
}

/** Dozvoljeni id-jevi za ocjene (čita ih API u functions/ i lokalni lažni API u serve.mjs). */
function writeRatingsIds() {
  writeFile('ratings-ids.json', JSON.stringify({ flavor: V.flavors().map((f) => f.id), recipe: V.mixes().map((m) => m.id) }) + '\n');
}

/**
 * Provjera podataka: svaki okus ima postojeći brend i vrstu lista, svaki brend ima bar jedan okus,
 * kolekcije nisu prazne (a "Za početnike" nema tamni list), recepti imaju ispravne okuse i omjer.
 */
function checkData() {
  // id ide u adresu i u API za ocjene: samo mala slova, brojevi i crtica
  const ID_OK = /^[a-z0-9-]{1,80}$/;
  for (const fl of V.flavors()) if (!ID_OK.test(fl.id)) errors.push(`okus ${fl.id}: id smije imati samo mala slova, brojeve i crticu`);
  for (const m of V.mixes()) if (!ID_OK.test(m.id)) errors.push(`recept ${m.id}: id smije imati samo mala slova, brojeve i crticu`);
  for (const fl of V.flavors()) {
    if (!V.brandOf(fl)) errors.push(`okus ${fl.id}: nepoznat brend ${fl.brandId}`);
    if (!['light', 'dark'].includes(fl.leaf)) errors.push(`okus ${fl.id}: leaf mora biti 'light' ili 'dark'`);
    for (const id of fl.similar || []) if (!V.flavorById(id)) errors.push(`okus ${fl.id}: nepostojeći sličan okus ${id}`);
    // verified: datum kad je brend potvrdio sastav (YYYY-MM-DD), pravi datum i ne u budućnosti
    if (fl.verified !== undefined) {
      const d = /^\d{4}-\d{2}-\d{2}$/.test(fl.verified) ? new Date(fl.verified + 'T00:00:00Z') : null;
      if (!d || isNaN(d) || d.toISOString().slice(0, 10) !== fl.verified) errors.push(`okus ${fl.id}: verified mora biti datum YYYY-MM-DD`);
      else if (d.getTime() > Date.now()) errors.push(`okus ${fl.id}: verified je u budućnosti`);
    }
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
  // savjeti: tekst na oba jezika, linkovi "Više o tome" i pojmovi [[id|tekst]] moraju postojati
  const tipIds = new Set();
  for (const s of V.tipSections()) {
    if (tipIds.has(s.id)) errors.push(`savjeti: dupli id ${s.id}`);
    tipIds.add(s.id);
    for (const l of LANGS) {
      if (!MSP.L(s.title, l) || !MSP.L(s.lead, l)) errors.push(`savjeti ${s.id}: fali naslov ili uvod (${l})`);
      for (const tp of s.tips) if (!MSP.L(tp.title, l) || !MSP.L(tp.text, l)) errors.push(`savjeti ${s.id}: fali tekst savjeta (${l})`);
    }
    for (const m of s.more || []) if (!V.tipMore(m)) errors.push(`savjeti ${s.id}: nepostojeći link ${JSON.stringify(m)}`);
    const texts = LANGS.flatMap((l) => [MSP.L(s.lead, l)].concat(s.tips.map((tp) => MSP.L(tp.text, l))));
    for (const txt of texts) for (const m of String(txt).matchAll(/\[\[([a-z0-9-]+)\|/g)) if (!V.glossaryById(m[1])) errors.push(`savjeti ${s.id}: nepostojeći pojam ${m[1]}`);
  }

  // "Evolucija nargile": svaka stanica ima tekst na oba jezika, izvor, ispravne koordinate i godinu
  const H = sandbox.HISTORY;
  const srcOk = (src) => Array.isArray(src) && src.length && src.every((n) => H.sources[n]);
  const stIds = new Set();
  H.stations.forEach((st, i) => {
    const tag = `historija ${st.id || i}`;
    if (stIds.has(st.id)) errors.push(`${tag}: dupli id`);
    stIds.add(st.id);
    if (!(st.lon >= -180 && st.lon <= 180 && st.lat >= -90 && st.lat <= 90)) errors.push(`${tag}: neispravne koordinate`);
    if (!Number.isInteger(st.year) || st.year < 1400 || st.year > new Date().getFullYear()) errors.push(`${tag}: neispravna godina`);
    if (i && st.year < H.stations[i - 1].year) errors.push(`${tag}: stanice nisu po redu godina`);
    for (const l of LANGS) {
      if (!MSP.L(st.title, l) || !MSP.L(st.place, l) || !MSP.L(st.when, l) || !MSP.L(st.city, l)) errors.push(`${tag}: fali tekst (${l})`);
      for (const f of st.facts.concat(st.fun ? [st.fun] : [])) if (!MSP.L(f.t, l)) errors.push(`${tag}: fali tekst činjenice (${l})`);
    }
    for (const f of st.facts.concat(st.fun ? [st.fun] : [])) if (!srcOk(f.src)) errors.push(`${tag}: činjenica bez ispravnog izvora`);
  });
  for (const list of ['names', 'myths', 'health', 'art', 'people', 'quiz']) {
    for (const it of H[list] || []) if (!srcOk(it.src)) errors.push(`historija ${list}: stavka bez ispravnog izvora`);
  }
  for (const pt of H.parts) for (const stp of pt.steps) if (!srcOk(stp.src)) errors.push(`historija dijelovi ${pt.id}: korak bez izvora`);
  for (const q of H.quiz || []) if (!(q.o[q.a])) errors.push('historija kviz: tačan odgovor ne postoji');
  // Poglavlja: tekst na oba jezika, svaki pasus sa izvorom koji postoji, izvori se koriste, linkovi postoje
  const CHS = V.historyChapters();
  const chSlugs = new Set();
  CHS.forEach((ch) => {
    const tag = `poglavlje ${ch.id}`;
    const n = ch.sources.length;
    const okSrc = (src) => Array.isArray(src) && src.length && src.every((k) => Number.isInteger(k) && k >= 1 && k <= n);
    const used = new Set();
    const use = (src) => (src || []).forEach((k) => used.add(k));
    for (const l of LANGS) {
      if (chSlugs.has(l + ':' + ch.slug[l])) errors.push(`${tag}: dupli slug (${l})`);
      chSlugs.add(l + ':' + ch.slug[l]);
      if (!MSP.L(ch.title, l) || !MSP.L(ch.lead, l) || !MSP.L(ch.span, l)) errors.push(`${tag}: fali naslov, uvod ili period (${l})`);
      for (const s of ch.sections) {
        if (!MSP.L(s.h, l)) errors.push(`${tag}: fali naslov dijela (${l})`);
        for (const p of s.p) if (!MSP.L(p.t, l)) errors.push(`${tag}: fali tekst pasusa (${l})`);
        if (s.note && !MSP.L(s.note, l)) errors.push(`${tag}: fali napomena (${l})`);
      }
      for (const y of ch.years || []) if (!MSP.L(y.t, l)) errors.push(`${tag}: fali tekst godine (${l})`);
    }
    for (const s of ch.sections) {
      for (const p of s.p) { if (!okSrc(p.src)) errors.push(`${tag}: pasus bez ispravnog izvora`); use(p.src); }
      if (s.note) { if (!okSrc(s.noteSrc)) errors.push(`${tag}: napomena bez izvora`); use(s.noteSrc); }
      if (s.more && !V.chapterById(s.more)) errors.push(`${tag}: nepostojeće poglavlje ${s.more}`);
      if (s.fig) {
        if (!fs.existsSync(path.join(ROOT, 'static/history/slike', s.fig.img + '.webp'))) errors.push(`${tag}: nema slike ${s.fig.img}`);
        for (const l of LANGS) if (!MSP.L(s.fig.cap, l) || !MSP.L(s.fig.by, l)) errors.push(`${tag}: slici ${s.fig.img} fali opis ili autor (${l})`);
      }
    }
    for (const y of ch.years || []) { if (!okSrc(y.src)) errors.push(`${tag}: godina bez izvora`); use(y.src); }
    ch.sources.forEach((s, k) => {
      const src = V.chapterSource(s);
      if (!src || !src.t || !/^https:\/\//.test(src.u || '')) errors.push(`${tag}: izvor ${k + 1} ne postoji ili nema https adresu`);
      if (!used.has(k + 1)) errors.push(`${tag}: izvor ${k + 1} se nigdje ne koristi`);
    });
    for (const id of ch.stations || []) if (!H.stations.some((st) => st.id === id)) errors.push(`${tag}: nepostojeća stanica ${id}`);
    if (!V.historyArtKinds.includes(ch.art)) errors.push(`${tag}: nepoznata ilustracija ${ch.art}`);
  });
  for (const p of (H.people || []).concat((H.art || []).filter((a) => a.station))) if (!H.stations.some((s) => s.id === p.station)) errors.push(`historija: nepostojeća stanica ${p.station}`);
  for (const q of (H.eras && H.eras.questions) || []) for (const o of q.o) if (!H.eras.results[o.e]) errors.push(`historija era: nepoznat rezultat ${o.e}`);

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

/**
 * Pravi datum zadnje izmjene za sitemap: svaka stranica ima otisak (hash) svog sadržaja u
 * seo/lastmod.json. Datum se pomjeri na danas samo kad se sadržaj stranice stvarno promijeni,
 * a ne pri svakom buildu (Google ignoriše lastmod kome ne može vjerovati).
 * Fajl se mijenja pri buildu; commituj ga zajedno sa izmjenom sadržaja.
 */
const LASTMOD_FILE = path.join(ROOT, 'seo/lastmod.json');
function lastModDates(rendered) {
  const today = new Date().toISOString().slice(0, 10);
  let old = {};
  try { old = JSON.parse(fs.readFileSync(LASTMOD_FILE, 'utf8')); } catch { old = {}; }
  const next = {}, out = {};
  let changed = 0;
  for (const r of rendered) {
    if (!isIndexable(r.desc)) continue;
    const h = crypto.createHash('sha1').update([r.info.title, r.info.description, r.info.main].join('\n')).digest('hex').slice(0, 12);
    const prev = old[r.desc.url];
    const date = prev && prev[0] === h ? prev[1] : today;
    if (!prev || prev[0] !== h) changed++;
    next[r.desc.url] = [h, date];
    out[r.desc.url] = date;
  }
  const json = JSON.stringify(next, Object.keys(next).sort(), 0).replace(/\],"/g, '],\n"').replace(/^\{/, '{\n').replace(/\}$/, '\n}') + '\n';
  const before = fs.existsSync(LASTMOD_FILE) ? fs.readFileSync(LASTMOD_FILE, 'utf8') : '';
  if (json !== before) {
    fs.mkdirSync(path.dirname(LASTMOD_FILE), { recursive: true });
    fs.writeFileSync(LASTMOD_FILE, json);
  }
  if (changed) console.log(`sitemap: ${changed} stranica sa novim datumom izmjene (seo/lastmod.json)`);
  return out;
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
  const lastmod = lastModDates(rendered);
  const urls = rendered.filter((r) => isIndexable(r.desc)).map((r) => {
    const alt = r.desc.alternates;
    return '  <url>\n' +
      `    <loc>${abs(r.desc.url)}</loc>\n` +
      `    <lastmod>${lastmod[r.desc.url]}</lastmod>\n` +
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
  writeRatingsIds();
  writeCloudflareFiles(rendered);
  writePwaFiles();

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
