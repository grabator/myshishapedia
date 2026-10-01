/*
 * MyShishapedia - pogledi (HTML).
 *
 * Ovaj fajl pravi HTML svih stranica kao obične stringove i ne dira DOM.
 * Koristi ga build.mjs (u Node-u, za gotove statične stranice) i browser
 * (za dijelove koji se mijenjaju uživo: pretraga, mikser, kviz, poređenje).
 *
 * Ovisi o: strings.js (MSP.t, MSP.L), data/*.js, illustrations.js (MSP.illustrate...).
 */
(function (root) {
  'use strict';

  var MSP = (root.MSP = root.MSP || {});
  var V = (MSP.V = {});

  function t(k, v) { return MSP.t(k, v); }
  function L(v) { return MSP.L(v); }
  function C() { return MSP.color; }

  /* ------------------------------------------------------------------ */
  /* Adrese                                                              */
  /* ------------------------------------------------------------------ */

  // Dio adrese po jeziku. Slug okusa je isti u oba jezika; slug pojma je po jeziku.
  var SEG = {
    bs: { home: '', flavor: 'okus', mixer: 'mikser', quiz: 'kviz', guide: 'vodic', glossary: 'rjecnik', term: 'rjecnik', gear: 'oprema', about: 'o-nama', notfound: '404',
      collections: 'kolekcije', collection: 'kolekcije', compare: 'poredjenje', comparePair: 'poredjenje', mixes: 'recepti', recipe: 'recepti',
      privacy: 'privatnost', terms: 'uslovi', suggest: 'predlozi-okus', report: 'prijavi-gresku', flavors: 'okusi', search: 'pretraga',
      brands: 'brendovi', brand: 'brendovi', top: 'najbolje-ocijenjeno', shelf: 'moja-polica', tips: 'savjeti' },
    en: { home: '', flavor: 'flavor', mixer: 'mixer', quiz: 'quiz', guide: 'guide', glossary: 'glossary', term: 'glossary', gear: 'gear', about: 'about', notfound: '404',
      collections: 'collections', collection: 'collections', compare: 'compare', comparePair: 'compare', mixes: 'mixes', recipe: 'mixes',
      privacy: 'privacy', terms: 'terms', suggest: 'suggest-flavor', report: 'report-issue', flavors: 'flavors', search: 'search',
      brands: 'brands', brand: 'brands', top: 'top-rated', shelf: 'my-shelf', tips: 'tips' }
  };
  V.SEG = SEG;

  /** Adresa stranice na jeziku `lang`. param: id okusa ili slug pojma. */
  V.urlFor = function (lang, page, param) {
    var s = SEG[lang][page];
    var p = '/' + lang + '/' + (s ? s + '/' : '');
    if (param) p += encodeURIComponent(param) + '/';
    return p;
  };

  V.url = function (page, param) { return V.urlFor(MSP.lang, page, param); };

  V.termSlug = function (g, lang) {
    return (g.slug && (g.slug[lang || MSP.lang] || g.slug.bs)) || g.id;
  };

  V.termUrl = function (idOrTerm, lang) {
    var g = typeof idOrTerm === 'string' ? V.glossaryById(idOrTerm) : idOrTerm;
    if (!g) return V.urlFor(lang || MSP.lang, 'glossary');
    return V.urlFor(lang || MSP.lang, 'term', V.termSlug(g, lang));
  };

  V.flavorUrl = function (f, lang) { return V.urlFor(lang || MSP.lang, 'flavor', f.id); };

  V.guideStepUrl = function (n, lang) {
    lang = lang || MSP.lang;
    return V.urlFor(lang, 'guide') + '?' + (lang === 'bs' ? 'korak' : 'step') + '=' + n;
  };

  /**
   * Okus koji služi samo za hlađenje (mixRole: 'cooler', npr. Supernova) ide u miks u malom omjeru:
   * vraća udio okusa a (20 ako je a "hladnjak", 80 ako je b), inače null.
   */
  V.coolerRatio = function (a, b) {
    var ca = a && a.mixRole === 'cooler';
    var cb = b && b.mixRole === 'cooler';
    if (ca && !cb) return 20;
    if (cb && !ca) return 80;
    return null;
  };

  V.mixUrl = function (a, b, r, lang) {
    r = V.coolerRatio(a, b) || r;
    return V.urlFor(lang || MSP.lang, 'mixer') + '?a=' + encodeURIComponent(a.id) + '&b=' + encodeURIComponent(b.id) + '&r=' + r;
  };

  /* ------------------------------------------------------------------ */
  /* Pomoćne                                                             */
  /* ------------------------------------------------------------------ */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  V.esc = esc;

  function clamp(v, a, b) {
    v = Number(v);
    if (Number.isNaN(v)) v = 0;
    return Math.min(b, Math.max(a, v));
  }
  V.clamp = clamp;

  /** Mala slova, bez dijakritika (č ć š ž -> c c s z, đ -> dj), bez interpunkcije. */
  function normalize(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/đ/g, 'dj')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }
  V.normalize = normalize;

  V.formatNum = function (v) {
    var s = (Math.round(v * 10) / 10).toString();
    return MSP.lang === 'bs' ? s.replace('.', ',') : s;
  };

  var ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowUpRight: '<path d="M7 17 17 7M8.5 7H17v8.5"/>',
    alert: '<path d="M10.3 4.2 2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z"/><path d="M12 9.5v4M12 17h.01"/>',
    leaf: '<path d="M5 19c0-8.3 5.6-14 14-14 0 8.4-5.7 14-14 14z"/><path d="M5 19l8-8"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
    mix: '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
    spark: '<path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z"/>',
    flake: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/><path d="m9.5 3.5 2.5 2 2.5-2M9.5 20.5l2.5-2 2.5 2M3 10.2l3.2.4 1-2.9M17.8 15.9l-1 2.9 3.2.4M3 13.8l3.2-.4 1 2.9M17.8 8.1l-1-2.9 3.2-.4"/>',
    wisp: '<path d="M8 20c-3-4 3-6 0-10s2-7 2-7"/><path d="M14 21c-3-4.5 3.5-6.5 0-11s2.5-7 2.5-7"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
    jar: '<rect x="7.5" y="2.5" width="9" height="3.5" rx="1"/><path d="M7 6h10v1.2c1.2.9 2 2.3 2 3.8V19a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 19v-8c0-1.5.8-2.9 2-3.8z"/><path class="icon__fill" d="M7.5 12.5h9V19a.8.8 0 0 1-.8.8H8.3a.8.8 0 0 1-.8-.8z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    star: '<path d="m12 3.2 2.7 5.5 6 .9-4.35 4.25 1.03 6L12 17l-5.38 2.85 1.03-6L3.3 9.6l6-.9z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'
  };

  function icon(name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>';
  }
  V.icon = icon;

  /* ------------------------------------------------------------------ */
  /* Podaci                                                              */
  /* ------------------------------------------------------------------ */

  V.PROFILE_KEYS = ['sweetness', 'freshness', 'fruitiness', 'cooling', 'strength'];
  var VASE_KEYS = ['sweetness', 'freshness', 'fruitiness'];

  V.brands = function () { return root.BRANDS || []; };
  V.brandBySlug = function (slug) {
    return V.brands().filter(function (b) { return b.slug === slug; })[0] || null;
  };

  /**
   * U data/flavors.js okus ima brand: '<slug brenda>'. Pri prvom čitanju se slug premjesti
   * u brandId, a u brand se upiše ime brenda za prikaz (pa ostatak koda samo ispisuje f.brand).
   */
  function linkBrands(list) {
    if (list._brandsLinked || !root.BRANDS) return list;
    list.forEach(function (f) {
      if (f.brandId) return;
      f.brandId = f.brand;
      var b = V.brandBySlug(f.brand);
      f.brand = b ? b.name : f.brand;
    });
    list._brandsLinked = true;
    return list;
  }

  V.flavors = function () { return linkBrands(root.FLAVORS || []); };
  V.brandOf = function (f) { return V.brandBySlug(f.brandId || f.brand); };
  V.brandFlavors = function (b) { return V.flavors().filter(function (f) { return f.brandId === b.slug; }); };
  V.brandUrl = function (b, lang) { return V.urlFor(lang || MSP.lang, 'brand', b.slug); };

  /** Vrsta lista: 'light' (svijetli) ili 'dark' (tamni); pojmovi u rječniku. */
  V.LEAF_TERM = { light: 'svijetli-list', dark: 'tamni-list' };
  V.leafOf = function (f) { return f.leaf === 'dark' ? 'dark' : 'light'; };
  V.flavorById = function (id) {
    return V.flavors().filter(function (f) { return f.id === id; })[0] || null;
  };
  V.glossary = function () { return root.GLOSSARY || []; };
  V.glossaryById = function (id) {
    return V.glossary().filter(function (g) { return g.id === id; })[0] || null;
  };
  V.glossaryBySlug = function (slug, lang) {
    return V.glossary().filter(function (g) { return V.termSlug(g, lang) === slug; })[0] || null;
  };

  V.byIntensity = function (f) {
    return (f.ingredients || []).slice().sort(function (a, b) { return (b.intensity || 0) - (a.intensity || 0); });
  };

  /** Tekst za pretragu okusa na OBA jezika ("mint" i "menta" nalaze isto). */
  V.searchText = function (f) {
    var parts = [f.brand, f.name, f.id];
    (f.ingredients || []).forEach(function (i) { parts.push(MSP.L(i.name, 'bs'), MSP.L(i.name, 'en')); });
    (f.tags || []).forEach(function (tag) {
      parts.push(MSP.strings.bs.tags[tag] || tag, MSP.strings.en.tags[tag] || tag);
    });
    parts.push(MSP.L(f.shortDescription, 'bs'), MSP.L(f.shortDescription, 'en'));
    var text = normalize(parts.join(' '));
    return text + ' ' + text.replace(/dj/g, 'd');
  };

  V.matchesQuery = function (f, query) {
    var q = normalize(query);
    if (!q) return true;
    if (!f._search) f._search = V.searchText(f);
    if (!f._compact) f._compact = normalize(f.brand + ' ' + f.name).replace(/ /g, '');
    var all = q.split(' ').every(function (tok) { return f._search.indexOf(tok) !== -1; });
    return all || f._compact.indexOf(q.replace(/ /g, '')) !== -1;
  };

  function allIngredients() {
    var seen = {};
    var out = [];
    V.flavors().forEach(function (f) {
      V.byIntensity(f).forEach(function (ing) {
        if (!seen[ing.illustration]) { seen[ing.illustration] = 1; out.push(ing); }
      });
    });
    return out;
  }

  /* ------------------------------------------------------------------ */
  /* Teme (boje po okusu) i kontrast                                     */
  /* ------------------------------------------------------------------ */

  V.HOME_PALETTE = { primary: '#f2a33c', secondary: '#d9643f', accent: '#f2a33c', background: '#140f0c', text: '#f4ebdf' };

  /**
   * Iz palete pravi kompletnu temu. Svaka boja teksta se provjerava i po potrebi
   * potamni/posvijetli dok ne dobije kontrast od najmanje 4.5:1.
   */
  V.computeTheme = function (p, isHome) {
    var c = C();
    var bg = p.background;
    var isLight = c.contrast(bg, '#000000') >= c.contrast(bg, '#ffffff');
    // Tamna shema: svijetli tekst ne može biti svjetliji od bijelog, pa po potrebi malo potamni
    // pozadinu, da i najsvjetlija površina (surface2) ima kontrast od najmanje 4.6:1 prema bijelom.
    for (var guard = 0; !isLight && guard < 24 && c.contrast('#ffffff', c.mix(bg, '#ffffff', 0.09)) < 4.6; guard++) {
      bg = c.darken(bg, 0.04);
    }
    var surface = isLight ? c.mix(bg, '#ffffff', 0.38) : c.mix(bg, '#ffffff', 0.05);
    var surface2 = isLight ? c.mix(bg, '#ffffff', 0.6) : c.mix(bg, '#ffffff', 0.09);
    var text = c.ensureContrast(p.text, [bg, surface, surface2], 4.6);
    var muted = c.ensureContrast(c.mix(text, bg, 0.3), [bg, surface, surface2], 4.6);
    var accentInk = c.ensureContrast(p.accent, [bg, surface], 4.6);
    var onAccent = c.contrast(p.accent, '#ffffff') >= c.contrast(p.accent, '#16100a') ? '#ffffff' : '#16100a';
    var accentFill = c.ensureContrast(p.accent, onAccent, 4.5);
    var barA = [p.accent, p.primary, p.secondary].sort(function (a, b) {
      return c.contrast(b, surface2) - c.contrast(a, surface2);
    })[0];
    barA = c.ensureContrast(barA, [surface, surface2], 3);

    var hk;
    if (isHome) {
      hk = { line: '#e9dccb', hi: '#d9b98a', lo: '#3a2c22', glass: '#f4ebdf', water: '#f2a33c', hose: '#2b201a', smoke: '#f4ebdf' };
    } else if (isLight) {
      hk = { line: c.mix(text, bg, 0.15), hi: c.mix(bg, '#ffffff', 0.72), lo: c.mix(text, bg, 0.45), glass: '#ffffff', water: p.water || p.accent, hose: c.mix(text, bg, 0.3), smoke: '#ffffff' };
    } else {
      hk = { line: c.mix(text, bg, 0.2), hi: c.mix(p.secondary, '#ffffff', 0.35), lo: c.mix(bg, '#000000', 0.2), glass: text, water: p.water || p.accent, hose: c.mix(bg, '#000000', 0.35), smoke: c.lighten(p.secondary, 0.5) };
    }
    var smoke = p.smoke && p.smoke.length ? p.smoke : isHome
      ? ['#f4ebdf', '#ebcda4', '#d9c3a8']
      : isLight
        ? ['#ffffff', c.mix(bg, '#ffffff', 0.55), c.mix(bg, text, 0.16), c.mix(p.primary, text, 0.12)]
        : [c.lighten(p.primary, 0.45), c.lighten(p.secondary, 0.4), c.lighten(p.accent, 0.55), '#e9e4ff'];

    return {
      scheme: isLight ? 'light' : 'dark',
      bg: bg, surface: surface, surface2: surface2, text: text, muted: muted,
      primary: p.primary, secondary: p.secondary, accent: p.accent,
      accentInk: accentInk, accentFill: accentFill, onAccent: onAccent,
      barA: barA, barB: c.mix(barA, text, 0.35),
      hk: hk, smoke: smoke,
      veil: isLight ? c.mix(bg, '#ffffff', 0.45) : c.mix(bg, '#d9cfc4', 0.22)
    };
  };

  var themeCache = {};
  V.themeFor = function (f) {
    var key = f ? f.id : '__home';
    if (!themeCache[key]) themeCache[key] = V.computeTheme(f ? f.palette : V.HOME_PALETTE, !f);
    return themeCache[key];
  };

  V.THEME_VARS = {
    '--c-bg': 'bg', '--c-surface': 'surface', '--c-surface-2': 'surface2', '--c-text': 'text', '--c-muted': 'muted',
    '--c-primary': 'primary', '--c-secondary': 'secondary', '--c-accent': 'accent', '--c-accent-ink': 'accentInk',
    '--c-accent-fill': 'accentFill', '--c-on-accent': 'onAccent', '--c-bar-a': 'barA', '--c-bar-b': 'barB'
  };

  /** Inline style za <html>, da stranica od prvog iscrtavanja ima boje svog okusa. */
  V.themeStyle = function (th) {
    return Object.keys(V.THEME_VARS).map(function (k) { return k + ':' + th[V.THEME_VARS[k]]; }).join(';') + ';color-scheme:' + th.scheme;
  };

  V.hookahVars = function (th) {
    return '--hk-line:' + th.hk.line + ';--hk-metal-hi:' + th.hk.hi + ';--hk-metal-lo:' + th.hk.lo +
      ';--hk-glass:' + th.hk.glass + ';--hk-water:' + th.hk.water + ';--hk-hose:' + th.hk.hose + ';--hk-smoke:' + th.hk.smoke;
  };

  /* ------------------------------------------------------------------ */
  /* Lebdeći sastojci (desktop i mobilni raspored; CSS prikaže pravi)     */
  /* ------------------------------------------------------------------ */

  var FLAVOR_SLOTS = {
    desktop: [
      { x: -1.5, y: 21, s: 10, d: 0.55, r: -16 },
      { x: 38, y: 94, s: 8, d: 0.8, r: 22 },
      { x: 3, y: 82, s: 12, d: 0.4, r: 14 },
      { x: 56, y: 10, s: 5.5, d: 0.16, r: 36, far: true },
      { x: 28, y: 7, s: 5, d: 0.12, r: -12, far: true },
      { x: 99, y: 46, s: 6, d: 0.22, r: 10, far: true }
    ],
    mobile: [
      { x: 9, y: 58, s: 17, d: 0.5, r: -16 },
      { x: 90, y: 42, s: 11, d: 0.4, r: 20, far: true },
      { x: 10, y: 90, s: 12, d: 0.3, r: 22, far: true },
      { x: 92, y: 3, s: 10, d: 0.2, r: -8, far: true }
    ]
  };
  var HOME_SLOTS = {
    desktop: [
      { x: 56, y: 12, s: 6, d: 0.2, r: 30, far: true },
      { x: 97, y: 9, s: 7, d: 0.3, r: 14, far: true },
      { x: 3, y: 12, s: 6, d: 0.15, r: 18, far: true }
    ],
    mobile: [
      { x: 90, y: 7, s: 16, d: 0.4, r: -14, far: true },
      { x: 6, y: 52, s: 12, d: 0.3, r: 20, far: true }
    ]
  };

  function floatersSet(ingredients, slots, cls) {
    if (!ingredients.length) return '';
    return slots.map(function (slot, i) {
      var ing = ingredients[i % ingredients.length];
      var dur = (7 + ((i * 1.7) % 4)).toFixed(1);
      var delay = (-(i * 1.3) % 5).toFixed(1);
      return (
        '<div class="floater ' + cls + (slot.far ? ' floater--far' : '') + '" data-depth="' + slot.d + '" style="' +
          '--x:' + slot.x + '%;--y:' + slot.y + '%;--s:' + slot.s + ';--r:' + slot.r + 'deg;' +
          '--dur:' + dur + 's;--delay:' + delay + 's;--i:' + i + '">' +
          '<div class="floater__bob"><div class="floater__pop">' + MSP.illustrate(ing.illustration, { color: ing.color }) + '</div></div>' +
        '</div>'
      );
    }).join('');
  }

  function floaters(ingredients, slotSet) {
    return '<div class="floaters" aria-hidden="true">' +
      floatersSet(ingredients, slotSet.desktop, 'floater--d') +
      floatersSet(ingredients, slotSet.mobile, 'floater--m') +
      '</div>';
  }

  /* ------------------------------------------------------------------ */
  /* Nargila                                                             */
  /* ------------------------------------------------------------------ */

  var hookahCount = 0;

  V.hookahStage = function (th, drops) {
    hookahCount += 1;
    var hintId = 'pull-hint-' + hookahCount;
    var dropsHTML = '';
    if (drops && drops.length) {
      dropsHTML = '<div class="drops" aria-hidden="true">' + drops.map(function (ing, i) {
        var dx = (i % 2 ? 1 : -1) * (20 + i * 14);
        return '<span class="drop" style="--d:' + (1.15 + i * 0.22).toFixed(2) + ';--dx:' + dx + 'px;--r:' + (i * 57 % 90 - 45) + 'deg">' +
          MSP.illustrate(ing.illustration, { color: ing.color }) + '</span>';
      }).join('') + '</div>';
    }
    return (
      '<div class="hookah-wrap" style="' + V.hookahVars(th) + '">' +
        '<div class="hookah" data-hookah>' + MSP.hookah({ label: t('hookah.label') }) + dropsHTML + '</div>' +
        '<div class="pull-ui">' +
          '<button type="button" class="pull" aria-pressed="false" aria-describedby="' + hintId + '">' +
            '<span class="pull__coal" aria-hidden="true">' + MSP.coal() + '</span>' +
            '<span class="pull__text">' + esc(t('hookah.pull')) + '</span>' +
          '</button>' +
          '<div class="pull__meter-wrap" aria-hidden="true"><span class="pull__meter-label">' + esc(t('hookah.strength')) + '</span><span class="pull__track"><span class="pull__meter"></span></span></div>' +
          '<p class="pull__hint" id="' + hintId + '">' + esc(t('hookah.hint')) + '</p>' +
        '</div>' +
      '</div>'
    );
  };

  /* ------------------------------------------------------------------ */
  /* Ocjene (zvjezdice; brojke popunjava js/ratings.js u browseru)       */
  /* ------------------------------------------------------------------ */

  /**
   * Prazno mjesto za prosjek ocjena na kartici (apsolutno pozicionirano, pa ne pomjera
   * ništa kad se popuni ili ostane prazno). js/ratings.js ga popuni kad stignu ocjene.
   */
  V.rateSlot = function (kind, id, cls) {
    return '<span class="rpill' + (cls ? ' ' + cls : '') + '" data-rate-slot="' + kind + ':' + esc(id) + '"></span>';
  };

  // Najmanji broj ocjena da bi okus ili recept ušao na rang listu (i bio među prvima pri sortiranju po ocjeni).
  V.TOP_MIN = 3;

  /**
   * Poredak po ocjeni: prvo stavke sa bar TOP_MIN ocjena (veći prosjek, pa više ocjena),
   * zatim one sa manje ocjena, a neocijenjene na kraju. get(x) vraća { avg, count } ili null.
   */
  V.compareRated = function (a, b, get) {
    var ra = get(a), rb = get(b);
    var ta = !ra || !ra.count ? 2 : ra.count >= V.TOP_MIN ? 0 : 1;
    var tb = !rb || !rb.count ? 2 : rb.count >= V.TOP_MIN ? 0 : 1;
    if (ta !== tb) return ta - tb;
    if (ta === 2) return 0;
    return (rb.avg - ra.avg) || (rb.count - ra.count);
  };

  /** Zvjezdice na stranici okusa i recepta: prosjek, broj ocjena i ocjenjivanje (bez JS-a se ne prikazuje). */
  V.rateWidget = function (kind, id, name, i) {
    var lid = 'rate-label';
    var stars = '';
    for (var n = 1; n <= 5; n++) {
      stars += '<button type="button" class="rate__star" data-v="' + n + '" aria-pressed="false" aria-label="' + esc(t('ratings.starLabel', { n: n })) + '" style="--n:' + n + '">' + icon('star') + '</button>';
    }
    return (
      '<div class="rate anim-in is-loading" style="--i:' + (i || 0) + '" data-rate-widget="' + kind + ':' + esc(id) + '" data-rate-name="' + esc(name) + '">' +
        '<div class="rate__sum">' +
          '<span class="rate__avg" aria-hidden="true">0,0</span>' +
          '<span class="rate__meter" aria-hidden="true"><span class="rate__meter-fill"></span></span>' +
          '<span class="rate__count"></span>' +
        '</div>' +
        '<div class="rate__me">' +
          '<p class="rate__label" id="' + lid + '">' + esc(t(kind === 'recipe' ? 'ratings.rateRecipe' : 'ratings.rateFlavor')) + '</p>' +
          '<div class="rate__stars" role="group" aria-labelledby="' + lid + '">' + stars + '</div>' +
        '</div>' +
        '<p class="rate__msg" role="status" aria-live="polite"></p>' +
        '<div class="rate__ts"></div>' +
      '</div>'
    );
  };

  /* ------------------------------------------------------------------ */
  /* Kartica okusa                                                       */
  /* ------------------------------------------------------------------ */

  var CARD_LAYOUTS = {
    1: [{ x: 50, y: 42, s: 44, r: -8, d: 1 }],
    2: [{ x: 40, y: 46, s: 40, r: -14, d: 0.7 }, { x: 63, y: 38, s: 36, r: 16, d: 1.3 }],
    3: [{ x: 36, y: 48, s: 38, r: -12, d: 0.7 }, { x: 62, y: 34, s: 34, r: 14, d: 1.2 }, { x: 70, y: 58, s: 28, r: -20, d: 1.6 }],
    4: [{ x: 34, y: 50, s: 35, r: -12, d: 0.7 }, { x: 60, y: 33, s: 31, r: 14, d: 1.2 }, { x: 71, y: 58, s: 27, r: -20, d: 1.5 }, { x: 42, y: 24, s: 22, r: 24, d: 1.8 }]
  };

  V.card = function (f, headingTag) {
    var h = headingTag || 'h3';
    var th = V.themeFor(f);
    var ings = V.byIntensity(f).slice(0, 4);
    var layout = CARD_LAYOUTS[ings.length] || CARD_LAYOUTS[4];
    var art = ings.map(function (ing, i) {
      var p = layout[i];
      return '<span class="card__ing" style="--x:' + p.x + '%;--y:' + p.y + '%;--s:' + p.s + '%;--r:' + p.r + 'deg;--d:' + p.d + ';--i:' + i + '">' +
        MSP.illustrate(ing.illustration, { color: ing.color }) + '</span>';
    }).join('');
    var names = (f.ingredients || []).map(function (i) { return esc(L(i.name)); }).join('<span class="dot" aria-hidden="true"> · </span>');
    return (
      // boje kartice su na omotaču, da ih ima i dugme za policu (ono je van linka)
      '<div class="cardbox" style="' +
        '--card-bg:' + th.bg + ';--card-surface:' + th.surface + ';--card-text:' + th.text + ';--card-muted:' + th.muted + ';' +
        '--card-accent:' + th.accentInk + ';--card-primary:' + th.primary + ';--card-secondary:' + th.secondary + ';--card-glow:' + th.surface2 + '">' +
      '<a class="card" href="' + V.flavorUrl(f) + '" data-fid="' + esc(f.id) + '" data-veil="' + th.veil + '" data-smoke="' + th.smoke.join(',') + '"' + (f.mood ? ' data-mood="' + esc(f.mood) + '"' : '') + '>' +
        '<span class="card__tilt">' +
          '<span class="card__glow" aria-hidden="true"></span>' +
          '<span class="card__art" aria-hidden="true"><span class="card__bowl">' + MSP.hookahBowl() + '</span>' + art + '</span>' +
          '<span class="card__body">' +
            '<span class="card__top"><span class="card__brand">' + esc(f.brand) + '</span>' + V.leafChip(f) + '</span>' +
            '<' + h + ' class="card__name" style="--len:' + String(f.name).length + '">' + esc(f.name) + '</' + h + '>' +
            '<span class="card__ings">' + names + '</span>' +
          '</span>' +
          '<span class="card__arrow" aria-hidden="true">' + icon('arrowUpRight') + '</span>' +
          V.rateSlot('flavor', f.id, 'rpill--card') +
          '<span class="card__glare" aria-hidden="true"></span>' +
        '</span>' +
      '</a>' +
      V.shelfButton(f, 'card') +
      '</div>'
    );
  };

  /**
   * Dugme "Dodaj na policu" / "Ukloni sa police" (js/shelf.js ga oživi; bez JS-a se ne prikazuje).
   * variant 'card': okruglo dugme na kartici; 'btn': dugme sa tekstom na stranici okusa.
   * U browseru (MSP.Shelf postoji) odmah dobije tačno stanje, pa nema treptanja.
   */
  V.shelfButton = function (f, variant) {
    var on = !!(MSP.Shelf && MSP.Shelf.has(f.id));
    var name = f.brand + ' ' + f.name;
    var aria = esc(t(on ? 'shelf.removeAria' : 'shelf.addAria', { name: name }));
    if (variant === 'card') {
      return '<button type="button" class="shelf-tog shelf-tog--card" data-shelf="' + esc(f.id) + '" data-name="' + esc(name) + '" aria-pressed="' + on + '" aria-label="' + aria + '" title="' + aria + '">' +
        icon('jar') + '<span class="shelf-tog__badge" aria-hidden="true">' + icon('check') + '</span></button>';
    }
    return '<button type="button" class="btn shelf-tog shelf-tog--btn" data-shelf="' + esc(f.id) + '" data-name="' + esc(name) + '" aria-pressed="' + on + '">' +
      icon('jar') + '<span class="shelf-tog__txt"><span class="shelf-tog__off">' + esc(t('shelf.add')) + '</span><span class="shelf-tog__on">' + esc(t('shelf.remove')) + '</span></span></button>';
  };

  /** Mala oznaka vrste lista (kartice, liste). */
  V.leafChip = function (f, cls) {
    var leaf = V.leafOf(f);
    return '<span class="leaf-chip leaf-chip--' + leaf + (cls ? ' ' + cls : '') + '"><span class="leaf-chip__dot" aria-hidden="true"></span>' + esc(t('leaf.' + leaf)) + '</span>';
  };

  /** Oznaka vrste lista na stranici okusa: šta znači i link na pojam u rječniku. */
  V.leafNote = function (f) {
    var leaf = V.leafOf(f);
    return (
      '<p class="leafnote leafnote--' + leaf + ' anim-in" style="--i:7">' +
        '<span class="leafnote__icon" aria-hidden="true">' + icon('leaf') + '</span>' +
        '<span class="leafnote__txt"><strong>' + esc(t('leaf.' + leaf)) + '</strong> ' + esc(t('leaf.' + leaf + 'Note')) + ' ' +
          '<a href="' + V.termUrl(V.LEAF_TERM[leaf]) + '">' + esc(t('leaf.more')) + '</a></span>' +
      '</p>'
    );
  };

  /** Stavke mreže okusa (i kartica "uskoro" kad se ne filtrira). */
  V.gridItems = function (list, opts) {
    opts = opts || {};
    var html = list.map(function (f, i) {
      return '<li class="grid__item"' + (opts.reveal ? ' data-reveal' : '') + ' style="--i:' + (i % 3) + '">' + V.card(f, 'h3') + '</li>';
    }).join('');
    if (opts.soon && list.length) {
      html +=
        '<li class="grid__item grid__item--soon"' + (opts.reveal ? ' data-reveal' : '') + ' style="--i:' + (list.length % 3) + '">' +
          '<div class="soon">' +
            '<span class="soon__icon" aria-hidden="true">' + icon('wisp') + '</span>' +
            '<p class="soon__title">' + esc(t('home.comingSoonTitle')) + '</p>' +
            '<p class="soon__text">' + esc(t('home.comingSoonText')) + '</p>' +
          '</div>' +
        '</li>';
    }
    return html;
  };

  /* ------------------------------------------------------------------ */
  /* Header, meni, footer, breadcrumbs, provjera godina                  */
  /* ------------------------------------------------------------------ */

  function logo(extraClass, href) {
    return (
      '<a class="logo' + (extraClass ? ' ' + extraClass : '') + '" href="' + (href || V.url('home')) + '" aria-label="' + esc(t('a11y.homeLink')) + '">' +
        '<span class="logo__my" aria-hidden="true">my</span>' +
        '<span class="logo__shisha" aria-hidden="true">shisha</span>' +
        '<span class="logo__pedia" aria-hidden="true">pedia</span>' +
      '</a>'
    );
  }
  V.logo = logo;

  // Meni: dvije grupe (padajući meniji na desktopu) i pojedinačne stavke.
  var NAV = [
    { group: 'flavors', key: 'groupFlavors', items: [
      { key: 'allFlavors', page: 'flavors', match: ['flavors', 'flavor'] },
      { key: 'brands', page: 'brands', match: ['brands', 'brand'] },
      { key: 'collections', page: 'collections', match: ['collections', 'collection'] },
      { key: 'compare', page: 'compare', match: ['compare', 'comparePair'] },
      { key: 'mixes', page: 'mixes', match: ['mixes', 'recipe'] },
      { key: 'top', page: 'top', match: ['top'] },
      { key: 'shelf', page: 'shelf', match: ['shelf'] }
    ] },
    { key: 'mixer', page: 'mixer', match: ['mixer'] },
    { key: 'quiz', page: 'quiz', match: ['quiz'] },
    { group: 'hookah', key: 'groupHookah', items: [
      { key: 'guide', page: 'guide', match: ['guide'] },
      { key: 'glossary', page: 'glossary', match: ['glossary', 'term'] },
      { key: 'gear', page: 'gear', match: ['gear'] },
      { key: 'tips', page: 'tips', match: ['tips'] }
    ] },
    { key: 'about', page: 'about', match: ['about'] }
  ];
  V.NAV = NAV;

  function navHref(n, desc) {
    return V.url(n.page) + (n.hash ? n.hash : '');
  }

  function navLink(n, desc, cls, i) {
    var current = n.match.indexOf(desc.page) !== -1;
    return '<li style="--i:' + (i || 0) + '"><a class="' + cls + '" href="' + navHref(n, desc) + '"' + (current ? ' aria-current="page"' : '') + '>' + esc(t('nav.' + n.key)) + '</a></li>';
  }

  function navLinks(desc, cls) {
    return NAV.map(function (n, i) {
      if (!n.group) return navLink(n, desc, cls, i);
      var current = n.items.some(function (it) { return it.match.indexOf(desc.page) !== -1; });
      var id = 'nav-drop-' + n.group;
      return (
        '<li class="nav-group' + (current ? ' is-current' : '') + '" style="--i:' + i + '">' +
          '<button type="button" class="' + cls + ' nav-group__btn" aria-expanded="false" aria-controls="' + id + '">' +
            esc(t('nav.' + n.key)) + '<span class="nav-group__chev" aria-hidden="true"></span>' +
          '</button>' +
          '<div class="nav-drop" id="' + id + '"><ul class="nav-drop__list" role="list">' +
            n.items.map(function (it, k) { return navLink(it, desc, 'nav-drop__link', k); }).join('') +
          '</ul></div>' +
        '</li>'
      );
    }).join('');
  }

  /** Mobilni meni: iste grupe, kao sekcije jedna ispod druge. */
  function menuGroups(desc) {
    var groups = [
      { key: 'groupFlavors', items: NAV[0].items.concat([NAV[1], NAV[2]]) },
      { key: 'groupHookah', items: NAV[3].items },
      { key: 'groupOther', items: [NAV[4]] }
    ];
    var k = 0;
    return groups.map(function (g, gi) {
      var id = 'mgroup-' + gi;
      return (
        '<div class="mgroup">' +
          '<p class="mgroup__title" id="' + id + '">' + esc(t('nav.' + g.key)) + '</p>' +
          '<ul class="menu-list" role="list" aria-labelledby="' + id + '">' +
            g.items.map(function (it) { return navLink(it, desc, 'menu-link', k++); }).join('') +
          '</ul>' +
        '</div>'
      );
    }).join('');
  }

  function langSwitch(desc, cls) {
    var other = MSP.lang === 'bs' ? 'en' : 'bs';
    var alt = desc.alternates || {};
    return (
      '<div class="lang ' + (cls || '') + '" role="group" aria-label="' + esc(t('a11y.langSwitch')) + '">' +
        MSP.LANGS.map(function (l) {
          var cur = l === MSP.lang;
          return '<a class="lang__opt" href="' + esc(alt[l] || V.urlFor(l, 'home')) + '" hreflang="' + l + '" lang="' + l + '" data-lang="' + l + '"' +
            (cur ? ' aria-current="true"' : ' aria-label="' + esc(t('a11y.langOther')) + '"') + '>' + l.toUpperCase() + '</a>';
        }).join('') +
        '<span class="lang__thumb" aria-hidden="true" data-other="' + other + '"></span>' +
      '</div>'
    );
  }

  V.header = function (desc) {
    return (
      '<div class="container site-header__inner">' +
        logo() +
        '<nav class="site-nav" aria-label="' + esc(t('a11y.mainNav')) + '">' +
          '<ul class="site-nav__list" role="list">' + navLinks(desc, 'site-nav__link') + '</ul>' +
        '</nav>' +
        '<a class="search-btn" href="' + V.url('search') + '" data-gsearch aria-label="' + esc(t('search.open')) + '" title="' + esc(t('search.open')) + ' (Ctrl+K)">' + icon('search') + '</a>' +
        langSwitch(desc, 'lang--header') +
        '<button type="button" class="menu-btn" aria-expanded="false" aria-controls="menu-overlay" aria-label="' + esc(t('a11y.openMenu')) + '">' +
          '<span class="menu-btn__bars" aria-hidden="true"><span></span><span></span><span></span></span>' +
          '<span class="menu-btn__text" aria-hidden="true">' + esc(t('a11y.menu')) + '</span>' +
        '</button>' +
      '</div>'
    );
  };

  /** Mobilni meni preko cijelog ekrana (van headera, vidi app.js). */
  V.menu = function (desc) {
    return (
      '<div class="menu-overlay" id="menu-overlay" role="dialog" aria-modal="true" aria-label="' + esc(t('a11y.mainNav')) + '" hidden>' +
        '<div class="menu-overlay__smoke" aria-hidden="true"><span></span><span></span><span></span></div>' +
        '<div class="container menu-overlay__top">' +
          logo('logo--menu') +
          '<a class="search-btn search-btn--menu" href="' + V.url('search') + '" data-gsearch>' + icon('search') + '<span>' + esc(t('nav.search')) + '</span></a>' +
          '<button type="button" class="menu-close" aria-label="' + esc(t('a11y.closeMenu')) + '">' + icon('close') + '</button>' +
        '</div>' +
        '<nav class="container menu-overlay__nav" aria-label="' + esc(t('a11y.mainNav')) + '">' +
          '<div class="menu-groups">' + menuGroups(desc) + '</div>' +
        '</nav>' +
        '<div class="container menu-overlay__foot">' + langSwitch(desc, 'lang--menu') + '<p>' + esc(t('nav.menuFooter')) + '</p></div>' +
      '</div>'
    );
  };

  /** Email razbijen na dijelove (zaštita od spam robota); app.js ga složi u mailto. */
  V.mailParts = function (email) {
    var at = email.split('@');
    return esc(at[0].split('').reverse().join('')) + '|' + esc(at[1].split('').reverse().join(''));
  };
  V.mailPlain = function (email) {
    var at = email.split('@');
    return at[0] + ' [at] ' + at[1].replace(/\./g, ' [dot] ');
  };

  V.footer = function (desc, cfg) {
    var year = desc.year || new Date().getFullYear();
    var email = (cfg && cfg.AUTHOR_EMAIL) || '';
    var name = (cfg && cfg.AUTHOR_NAME) || 'Graba';
    var links = ['flavors', 'brands', 'collections', 'compare', 'mixes', 'top', 'shelf', 'mixer', 'quiz', 'guide', 'tips', 'glossary', 'gear', 'about'].map(function (p) {
      return '<li><a href="' + V.url(p) + '">' + esc(t('nav.' + (p === 'flavors' ? 'allFlavors' : p))) + '</a></li>';
    }).join('');
    return (
      '<div class="container site-footer__inner">' +
        '<div class="site-footer__brand">' +
          logo('logo--footer') +
          '<p class="site-footer__tagline">' + esc(t('footer.tagline')) + '</p>' +
          '<nav aria-label="' + esc(t('footer.navLabel')) + '"><ul class="site-footer__nav" role="list">' + links + '</ul></nav>' +
        '</div>' +
        '<div class="site-footer__warning" role="note">' +
          icon('alert', 'site-footer__warning-icon') +
          '<p><strong>' + esc(t('footer.warningLabel')) + ':</strong> ' + esc(t('footer.warning')) + '</p>' +
        '</div>' +
        '<p class="site-footer__legal">' + esc(t('footer.disclaimer')) + '</p>' +
        '<nav class="site-footer__legalnav" aria-label="' + esc(t('nav.legalNav')) + '"><ul role="list">' +
          ['privacy', 'terms', 'suggest'].map(function (p) { return '<li><a href="' + V.url(p) + '">' + esc(t('nav.' + p)) + '</a></li>'; }).join('') +
        '</ul></nav>' +
        '<p class="site-footer__meta">' +
          '<span>' + esc(t('footer.copyright', { year: year })) + '</span>' +
          '<span class="sig">' + esc(t('footer.madeBy')) + ' ' +
            '<a class="sig__name" href="' + V.url('about') + '#kontakt" data-m="' + (email ? V.mailParts(email) : '') + '">' +
              '<span class="sig__ember" aria-hidden="true"></span>' + esc(name) +
            '</a>' +
            (email ? '<noscript><span class="sig__plain"> (' + esc(V.mailPlain(email)) + ')</span></noscript>' : '') +
          '</span>' +
          '<span>' + esc(t('footer.adults')) + '</span>' +
        '</p>' +
      '</div>'
    );
  };

  V.breadcrumbs = function (items) {
    if (!items || items.length < 2) return '';
    return (
      '<nav class="crumbs container" aria-label="' + esc(t('a11y.breadcrumbs')) + '"><ol role="list">' +
        items.map(function (it, i) {
          var last = i === items.length - 1;
          return '<li>' + (last
            ? '<span aria-current="page">' + esc(it.name) + '</span>'
            : '<a href="' + esc(it.url) + '">' + esc(it.name) + '</a><span class="crumbs__sep" aria-hidden="true">›</span>') + '</li>';
        }).join('') +
      '</ol></nav>'
    );
  };

  V.ageGate = function () {
    return (
      '<div class="age-gate__panel" role="dialog" aria-modal="true" aria-labelledby="age-title" aria-describedby="age-text">' +
        '<span class="age-gate__coal" aria-hidden="true">' + MSP.coal() + '</span>' +
        '<span class="logo logo--gate" role="img" aria-label="MyShishapedia">' +
          '<span class="logo__my" aria-hidden="true">my</span><span class="logo__shisha" aria-hidden="true">shisha</span><span class="logo__pedia" aria-hidden="true">pedia</span>' +
        '</span>' +
        '<div class="age-gate__ask" id="age-ask">' +
          '<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('ageGate.eyebrow')) + '</p>' +
          '<h2 class="age-gate__title" id="age-title">' + esc(t('ageGate.question')) + '</h2>' +
          '<p class="age-gate__text" id="age-text">' + esc(t('ageGate.text')) + '</p>' +
          '<div class="age-gate__actions">' +
            '<button type="button" class="btn btn--primary" data-age="yes">' + esc(t('ageGate.yes')) + '</button>' +
            '<button type="button" class="btn btn--ghost" data-age="no">' + esc(t('ageGate.no')) + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="age-gate__denied" id="age-denied" hidden>' +
          '<h2 class="age-gate__title" id="age-denied-title" tabindex="-1">' + esc(t('ageGate.deniedTitle')) + '</h2>' +
          '<p class="age-gate__text">' + esc(t('ageGate.deniedText')) + '</p>' +
          '<div class="age-gate__actions"><button type="button" class="btn btn--ghost" data-age="back">' + esc(t('ageGate.back')) + '</button></div>' +
        '</div>' +
      '</div>'
    );
  };

  /* ------------------------------------------------------------------ */
  /* Zajednički dijelovi stranica                                        */
  /* ------------------------------------------------------------------ */

  function sectionHead(num, title, intro, id, tag) {
    var h = tag || 'h2';
    return (
      '<header class="fsec__head" data-reveal>' +
        '<span class="fsec__num" aria-hidden="true">' + num + '</span>' +
        '<' + h + ' class="fsec__title" id="' + id + '">' + esc(title) + '</' + h + '>' +
        (intro ? '<p class="fsec__intro">' + esc(intro) + '</p>' : '') +
      '</header>'
    );
  }
  V.sectionHead = sectionHead;

  function pageHero(o) {
    return (
      '<section class="phero" aria-labelledby="' + o.id + '">' +
        (o.crumbs || '') +
        '<div class="container phero__inner">' +
          '<div class="phero__copy">' +
            '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(o.eyebrow) + '</p>' +
            '<h1 class="phero__title anim-in" style="--i:1" id="' + o.id + '" tabindex="-1">' + esc(o.title) + '</h1>' +
            (o.lead ? '<p class="phero__lead anim-in" style="--i:2">' + esc(o.lead) + '</p>' : '') +
          '</div>' +
          '<span class="phero__coal" aria-hidden="true">' + MSP.coal() + '</span>' +
        '</div>' +
      '</section>'
    );
  }

  function coalRating(value, label) {
    var html = '';
    for (var i = 0; i < 5; i++) html += '<span class="rc' + (i < value ? ' is-on' : '') + '" style="--k:' + i + '">' + MSP.coal() + '</span>';
    return (
      '<div class="rating">' +
        '<span class="rating__label">' + esc(label) + '</span>' +
        '<span class="rating__coals" aria-hidden="true">' + html + '</span>' +
        '<span class="sr-only">' + esc(t('a11y.outOf', { value: value, max: 5 })) + '</span>' +
      '</div>'
    );
  }

  /** Tekst sa [[id|oznaka]] linkovima na rječnik (ostatak se escapuje). */
  function linkTerms(text) {
    var out = '';
    var re = /\[\[([a-z0-9-]+)\|([^\]]+)\]\]/g;
    var last = 0;
    var m;
    while ((m = re.exec(text))) {
      out += esc(text.slice(last, m.index));
      out += '<a class="term-link" href="' + V.termUrl(m[1]) + '">' + esc(m[2]) + '</a>';
      last = re.lastIndex;
    }
    return out + esc(text.slice(last));
  }
  V.linkTerms = linkTerms;

  function exploreArt(kind) { return MSP.exploreArt(kind); }

  // za js/views-more.js
  V.pageHero = pageHero;
  V.coalRating = coalRating;
  V.moodLayer = moodLayer;
  V.frostEdges = frostEdges;
  V.allIngredients = allIngredients;
  V.floaters = function (ings, slots) { return floaters(ings, slots || FLAVOR_SLOTS); };
  V.searchForm = function (id, labelKey, placeholderKey) { return searchForm(id, labelKey, placeholderKey); };

  /* ------------------------------------------------------------------ */
  /* Početna                                                             */
  /* ------------------------------------------------------------------ */

  function tagCounts() {
    var counts = {};
    V.flavors().forEach(function (f) { (f.tags || []).forEach(function (tag) { counts[tag] = (counts[tag] || 0) + 1; }); });
    return Object.keys(counts).sort(function (a, b) {
      return counts[b] - counts[a] || MSP.tagLabel(a).localeCompare(MSP.tagLabel(b), MSP.lang);
    });
  }

  V.filters = function (active) {
    var btn = function (tag, label) {
      var on = (active || null) === tag;
      return '<button type="button" class="chip' + (on ? ' is-active' : '') + '" data-tag="' + esc(tag || '') + '" aria-pressed="' + on + '">' + esc(label) + '</button>';
    };
    return btn(null, t('home.filterAll')) + tagCounts().map(function (tag) { return btn(tag, MSP.tagLabel(tag)); }).join('');
  };

  function marquee() {
    var names = allIngredients().map(function (i) { return L(i.name); });
    var chunk = names.map(function (name, i) {
      return '<span class="marquee__item' + (i % 2 ? ' marquee__item--outline' : '') + '">' + esc(name) + '</span>' + icon('spark', 'marquee__sep');
    }).join('');
    return '<div class="marquee__group">' + chunk + '</div><div class="marquee__group">' + chunk + '</div>';
  }

  function explore() {
    var items = [
      { page: 'mixer', kind: 'mixer', title: 'explore.mixerTitle', text: 'explore.mixerText' },
      { page: 'quiz', kind: 'quiz', title: 'explore.quizTitle', text: 'explore.quizText' },
      { page: 'guide', kind: 'guide', title: 'explore.guideTitle', text: 'explore.guideText' }
    ];
    return (
      '<section class="explore" aria-labelledby="explore-title">' +
        '<div class="container">' +
          '<header class="explore__head" data-reveal>' +
            '<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('explore.eyebrow')) + '</p>' +
            '<h2 class="catalog__title" id="explore-title">' + esc(t('explore.title')) + '</h2>' +
          '</header>' +
          '<ul class="explore__grid" role="list">' +
            items.map(function (it, i) {
              return (
                '<li data-reveal style="--i:' + i + '">' +
                  '<a class="xcard xcard--' + it.kind + '" href="' + V.url(it.page) + '">' +
                    '<span class="xcard__art" aria-hidden="true">' + exploreArt(it.kind) + '</span>' +
                    '<span class="xcard__body"><span class="xcard__title">' + esc(t(it.title)) + '</span><span class="xcard__text">' + esc(t(it.text)) + '</span></span>' +
                    '<span class="xcard__cta" aria-hidden="true">' + esc(t('explore.cta')) + icon('arrowRight') + '</span>' +
                  '</a>' +
                '</li>'
              );
            }).join('') +
          '</ul>' +
        '</div>' +
      '</section>'
    );
  }

  function searchForm(id, labelKey, placeholderKey) {
    return (
      '<form class="search anim-in" style="--i:5" role="search" id="' + id + '-form" action="' + V.url('home') + '">' +
        '<label class="sr-only" for="' + id + '">' + esc(t(labelKey)) + '</label>' +
        '<span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
        '<input class="search__input" id="' + id + '" name="q" type="search" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" placeholder="' + esc(t(placeholderKey)) + '">' +
        '<button type="button" class="search__clear" id="' + id + '-clear" aria-label="' + esc(t('home.searchClear')) + '" hidden>' + icon('close') + '</button>' +
        '<kbd class="search__kbd" title="' + esc(t('home.searchHint', { key: '/' })) + '" aria-hidden="true">/</kbd>' +
      '</form>'
    );
  }

  function catalog(headingId) {
    var list = V.flavors();
    return (
      '<section class="catalog" aria-labelledby="' + headingId + '" id="svi-okusi">' +
        '<div class="container">' +
          '<div class="catalog__head">' +
            '<h2 class="catalog__title" id="' + headingId + '">' + esc(t('home.catalogTitle')) + '</h2>' +
            '<p class="catalog__count" id="catalog-count" aria-live="polite">' + esc(MSP.plural('home.count', list.length)) + '</p>' +
          '</div>' +
          '<div class="filters" role="group" aria-label="' + esc(t('home.filtersLabel')) + '" id="filters">' + V.filters(null) + '</div>' +
          '<ul class="grid" id="flavor-grid" role="list">' + V.gridItems(list, { reveal: true, soon: true }) + '</ul>' +
          '<div class="empty" id="catalog-empty" hidden>' +
            '<p class="empty__title">' + esc(t('home.emptyTitle')) + '</p>' +
            '<p class="empty__text">' + esc(t('home.emptyText')) + '</p>' +
            '<button type="button" class="btn btn--ghost" id="empty-reset">' + esc(t('home.emptyReset')) + '</button>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function pageHome() {
    var th = V.themeFor(null);
    return (
      '<section class="hero hero--home" aria-labelledby="home-title">' +
        floaters(allIngredients(), HOME_SLOTS) +
        '<div class="container hero__inner">' +
          '<div class="hero__copy">' +
            '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('home.eyebrow')) + '</p>' +
            '<h1 class="hero__title" id="home-title" tabindex="-1">' +
              '<span class="line"><span class="line__in" style="--i:1">' + esc(t('home.titleA')) + '</span></span> ' +
              '<span class="line"><span class="line__in" style="--i:2"><em>' + esc(t('home.titleEm')) + '</em></span></span> ' +
              '<span class="line"><span class="line__in" style="--i:3">' + esc(t('home.titleB')) + '</span></span>' +
            '</h1>' +
            '<p class="hero__lead anim-in" style="--i:4">' + esc(t('home.lead')) + '</p>' +
            searchForm('search-input', 'home.searchLabel', 'home.searchPlaceholder') +
          '</div>' +
          '<div class="hero__stage">' + V.hookahStage(th) + '</div>' +
        '</div>' +
      '</section>' +
      V.recentStrip() +
      V.fotdSection(V.fotdPick(new Date())) +
      V.homeCollections() +
      '<div class="marquee" aria-hidden="true"><div class="marquee__track">' + marquee() + '</div></div>' +
      catalog('catalog-title') +
      V.homeMixes() +
      explore()
    );
  }

  /* ------------------------------------------------------------------ */
  /* Stranica okusa                                                      */
  /* ------------------------------------------------------------------ */

  function ingredientsList(f, th) {
    var c = C();
    return (f.ingredients || []).map(function (ing, i) {
      var v = clamp(ing.intensity, 0, 10);
      var segColor = c.contrast(ing.color, th.surface) >= 2.4 ? ing.color : c.mix(th.text, ing.color, 0.22);
      var segs = '';
      for (var k = 0; k < 10; k++) segs += '<span class="seg' + (k < v ? ' is-on' : '') + '" style="--k:' + k + '"></span>';
      var name = L(ing.name);
      return (
        '<li class="ing" data-reveal style="--i:' + i + ';--ing:' + ing.color + ';--ing-ink:' + segColor + '">' +
          '<div class="ing__art"><div class="ing__bob">' + MSP.illustrate(ing.illustration, { color: ing.color, label: t('a11y.ingredientIllustration', { name: name }) }) + '</div></div>' +
          '<div class="ing__body">' +
            '<h3 class="ing__name">' + esc(name) + '</h3>' +
            '<p class="ing__meter">' +
              '<span class="ing__label">' + esc(t('flavor.intensity')) + '</span>' +
              '<span class="ing__value" aria-hidden="true"><b>' + v + '</b>/10</span>' +
              '<span class="sr-only">' + esc(t('a11y.outOf', { value: v, max: 10 })) + '</span>' +
            '</p>' +
            '<div class="segs" aria-hidden="true">' + segs + '</div>' +
          '</div>' +
        '</li>'
      );
    }).join('');
  }

  function radar(f) {
    var cx = 200, cy = 150, R = 100, keys = V.PROFILE_KEYS, n = keys.length;
    function pt(i, r) { var a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; }
    function fmt(p) { return p.map(function (v) { return v.toFixed(1); }).join(','); }
    var rings = [0.25, 0.5, 0.75, 1].map(function (k) {
      return '<polygon points="' + keys.map(function (_, i) { return fmt(pt(i, R * k)); }).join(' ') + '" class="radar__ring"/>';
    }).join('');
    var axes = keys.map(function (_, i) { var p = pt(i, R); return '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" class="radar__axis"/>'; }).join('');
    var shape = keys.map(function (k, i) { return fmt(pt(i, (R * clamp(f.profile[k], 0, 10)) / 10)); }).join(' ');
    var dots = keys.map(function (k, i) { var p = pt(i, (R * clamp(f.profile[k], 0, 10)) / 10); return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="4.5" class="radar__dot"/>'; }).join('');
    var labels = keys.map(function (k, i) {
      var p = pt(i, R + 18);
      var anchor = Math.abs(p[0] - cx) < 4 ? 'middle' : p[0] < cx ? 'end' : 'start';
      return '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 5).toFixed(1) + '" text-anchor="' + anchor + '" class="radar__label">' + esc(t('profile.' + k)) + '</text>';
    }).join('');
    return '<svg class="radar" viewBox="-20 0 440 300" aria-hidden="true" focusable="false">' + rings + axes + '<g class="radar__shape"><polygon points="' + shape + '" class="radar__area"/>' + dots + '</g>' + labels + '</svg>';
  }

  function valueHTML(v) {
    return '<span class="gauge__value" aria-hidden="true"><b>' + v + '</b>/10</span><span class="sr-only">' + esc(t('a11y.outOf', { value: v, max: 10 })) + '</span>';
  }

  var vaseN = 0;
  function vaseSVG() {
    vaseN += 1;
    var shape = 'M30 6H50V22C68 30 76 48 74 66C72 90 58 104 40 104C22 104 8 90 6 66C4 48 12 30 30 22Z';
    var wave = 'M-40 36Q-30 32 -20 36T0 36T20 36T40 36T60 36T80 36T100 36T120 36V120H-40Z';
    var id = 'vc' + vaseN;
    return (
      '<svg class="vase-svg" viewBox="0 0 80 110" aria-hidden="true" focusable="false">' +
        '<defs><clipPath id="' + id + '"><path d="' + shape + '"/></clipPath></defs>' +
        '<path d="' + shape + '" class="vase-svg__glass"/>' +
        '<g clip-path="url(#' + id + ')"><g class="vase-svg__level"><path class="vase-svg__water" d="' + wave + '"/></g></g>' +
        '<path d="M40 8V96" class="vase-svg__stem"/><path d="' + shape + '" class="vase-svg__line"/>' +
        '<path d="M16 60C14 72 18 86 26 94" class="vase-svg__shine"/>' +
      '</svg>'
    );
  }

  function gauges(f) {
    var p = f.profile || {};
    var vases = VASE_KEYS.map(function (k, i) {
      var v = clamp(p[k], 0, 10);
      return '<li class="vase" style="--v:' + v / 10 + ';--i:' + i + '">' + vaseSVG() + '<span class="gauge__label">' + esc(t('profile.' + k)) + '</span>' + valueHTML(v) + '</li>';
    }).join('');
    var cool = clamp(p.cooling, 0, 10);
    var strength = clamp(p.strength, 0, 10);
    var lit = Math.round(strength / 2);
    var coals = '';
    for (var i = 0; i < 5; i++) coals += '<span class="cm-coal' + (i < lit ? ' is-on' : '') + '" style="--k:' + i + '">' + MSP.coal() + '</span>';
    return (
      '<div class="gauges" data-reveal>' +
        '<ul class="vases" role="list">' + vases + '</ul>' +
        '<div class="gauge gauge--frost" style="--v:' + cool / 10 + '">' +
          '<div class="gauge__row"><span class="gauge__label">' + icon('flake') + esc(t('profile.cooling')) + '</span>' + valueHTML(cool) + '</div>' +
          '<div class="frost" aria-hidden="true"><span class="frost__fill"><span class="frost__crystals">' + icon('flake') + icon('flake') + icon('flake') + '</span></span></div>' +
        '</div>' +
        '<div class="gauge gauge--coals">' +
          '<div class="gauge__row"><span class="gauge__label">' + esc(t('profile.strength')) + '</span>' + valueHTML(strength) + '</div>' +
          '<div class="coals" aria-hidden="true">' + coals + '</div>' +
          '<p class="gauge__note">' + esc(MSP.plural('flavor.coalsNote', lit)) + '</p>' +
        '</div>' +
      '</div>'
    );
  }

  function moodLayer(f) {
    var i, out = '';
    if (f.mood === 'night' || f.mood === 'honey') {
      var count = f.mood === 'honey' ? 16 : 28;
      for (i = 0; i < count; i++) {
        out += '<span class="star" style="--x:' + ((i * 37.7) % 100).toFixed(1) + '%;--y:' + ((i * 53.3) % 70).toFixed(1) + '%;--s:' + (1 + ((i * 7) % 3)) + 'px;--tw:' + (2.5 + (i % 5) * 0.7).toFixed(1) + 's;--dl:' + (-(i % 7) * 0.6).toFixed(1) + 's"></span>';
      }
      if (f.mood === 'honey') {
        // tople "gradske" svjetiljke u daljini (bokeh)
        for (i = 0; i < 12; i++) {
          out += '<span class="bokeh" style="--x:' + ((i * 29.3 + 7) % 100).toFixed(1) + '%;--y:' + (55 + (i * 17.7) % 40).toFixed(1) + '%;--s:' + (18 + (i * 11) % 34) + 'px;--dur:' + (5 + (i % 4)).toFixed(1) + 's;--dl:' + (-(i % 5) * 0.9).toFixed(1) + 's"></span>';
        }
        return '<div class="mood mood--honey" aria-hidden="true">' + out + '</div>';
      }
      return '<div class="mood mood--night" aria-hidden="true"><span class="mood__moon"></span>' + out + '</div>';
    }
    if (f.mood === 'ice') {
      for (i = 0; i < 34; i++) {
        out += '<span class="flake flake--ice" style="--x:' + ((i * 37.9) % 100).toFixed(1) + '%;--y:' + ((i * 23.3) % 100).toFixed(1) + '%;--s:' + (7 + (i % 5) * 4) + 'px;--dur:' + (7 + (i % 5) * 1.6).toFixed(1) + 's;--dl:' + (-(i % 9) * 1.1).toFixed(1) + 's">' + icon('flake') + '</span>';
      }
      return '<div class="mood mood--ice" aria-hidden="true">' + out + '</div>';
    }
    if (f.mood === 'frost') {
      for (i = 0; i < 22; i++) {
        out += '<span class="flake" style="--x:' + ((i * 41.3) % 100).toFixed(1) + '%;--y:' + ((i * 29.7) % 100).toFixed(1) + '%;--s:' + (6 + (i % 4) * 4) + 'px;--dur:' + (9 + (i % 5) * 2) + 's;--dl:' + (-(i % 9) * 1.3).toFixed(1) + 's">' + icon('flake') + '</span>';
      }
      return '<div class="mood mood--frost" aria-hidden="true">' + out + '</div>';
    }
    if (f.mood === 'mist') {
      // Blue Mist: meki slojevi izmaglice koji polako plove preko stranice
      for (i = 0; i < 5; i++) {
        out += '<span class="mist" style="--k:' + i + ';--y:' + (12 + i * 17) + '%;--dur:' + (26 + i * 7) + 's;--dl:' + (-i * 6) + 's"></span>';
      }
      return '<div class="mood mood--mist" aria-hidden="true">' + out + '</div>';
    }
    if (f.mood === 'supernova') {
      // Supernova: zvijezda bljesne i eksplodira, talas se raširi, a krhotine se pretvore u ledeni dim
      for (i = 0; i < 30; i++) {
        out += '<span class="star" style="--x:' + ((i * 37.7) % 100).toFixed(1) + '%;--y:' + ((i * 53.3) % 92).toFixed(1) + '%;--s:' + (1 + ((i * 7) % 3)) + 'px;--tw:' + (2.5 + (i % 5) * 0.7).toFixed(1) + 's;--dl:' + (-(i % 7) * 0.6).toFixed(1) + 's"></span>';
      }
      var rays = '';
      for (i = 0; i < 12; i++) rays += '<span class="sn__ray" style="--a:' + (i * 30 + (i % 2) * 9) + 'deg;--l:' + (i % 3 ? 0.7 : 1) + '"></span>';
      var shards = '';
      for (i = 0; i < 16; i++) {
        var a = (i / 16) * Math.PI * 2 + (i % 3) * 0.2;
        var d = 120 + (i * 47) % 160;
        shards += '<span class="sn__shard" style="--dx:' + (Math.cos(a) * d).toFixed(0) + 'px;--dy:' + (Math.sin(a) * d).toFixed(0) + 'px;--s:' + (8 + (i % 4) * 5) + 'px;--dl:' + (0.55 + (i % 5) * 0.05).toFixed(2) + 's">' + icon('flake') + '</span>';
      }
      return (
        '<div class="mood mood--supernova" aria-hidden="true">' + out +
          '<div class="sn" data-supernova>' +
            '<span class="sn__nebula"></span>' +
            '<span class="sn__ring"></span><span class="sn__ring sn__ring--2"></span>' +
            '<span class="sn__rays">' + rays + '</span>' +
            '<span class="sn__core"></span>' +
            shards +
          '</div>' +
        '</div>'
      );
    }
    if (f.mood === 'soda') {
      // limunada: sitni mjehurići koji se dižu kao u gaziranom piću
      for (i = 0; i < 30; i++) {
        out += '<span class="fizz" style="--x:' + ((i * 37.3 + 3) % 100).toFixed(1) + '%;--s:' + (5 + (i * 7) % 12) + 'px;--dur:' + (4 + (i % 6) * 0.9).toFixed(1) + 's;--dl:' + (-(i % 11) * 0.7).toFixed(1) + 's;--sway:' + ((i % 5) - 2) * 6 + 'px"></span>';
      }
      return '<div class="mood mood--soda" aria-hidden="true">' + out + '</div>';
    }
    return '';
  }

  function frostEdges() {
    return '<div class="frost-edges" aria-hidden="true">' + ['tl', 'tr', 'bl', 'br'].map(function (c) {
      return '<span class="frost-corner frost-corner--' + c + '">' + MSP.frostCorner() + '</span>';
    }).join('') + '</div>';
  }

  function pagerLink(f, dir) {
    var th = V.themeFor(f);
    var art = V.byIntensity(f).slice(0, 3).map(function (ing, i) {
      return '<span class="pager__ing" style="--i:' + i + '">' + MSP.illustrate(ing.illustration, { color: ing.color }) + '</span>';
    }).join('');
    return (
      '<a class="pager__link pager__link--' + dir + '" href="' + V.flavorUrl(f) + '" data-veil="' + th.veil + '" rel="' + dir + '" style="' +
        '--pl-bg:' + th.bg + ';--pl-text:' + th.text + ';--pl-muted:' + th.muted + ';--pl-glow:' + th.surface2 + '">' +
        '<span class="pager__art" aria-hidden="true">' + art + '</span>' +
        '<span class="pager__text">' +
          '<span class="pager__dir">' + (dir === 'prev' ? icon('arrowLeft') : '') + esc(t(dir === 'prev' ? 'flavor.prev' : 'flavor.next')) + (dir === 'next' ? icon('arrowRight') : '') + '</span>' +
          '<span class="pager__brand">' + esc(f.brand) + '</span>' +
          '<span class="pager__name">' + esc(f.name) + '</span>' +
        '</span>' +
      '</a>'
    );
  }

  /** "ananas, banana i menta" / "pineapple, banana & mint" */
  V.ingredientList = function (f) {
    var names = (f.ingredients || []).map(function (i) { return L(i.name).toLowerCase(); });
    if (names.length < 2) return names.join('');
    return names.slice(0, -1).join(t('flavor.listJoin')) + t('flavor.listLast') + names[names.length - 1];
  };

  function pageFlavor(f, crumbs) {
    var th = V.themeFor(f);
    var ings = V.byIntensity(f);
    var all = V.flavors();
    var idx = all.indexOf(f);
    var count = all.length;
    var prev = count > 1 ? all[(idx - 1 + count) % count] : null;
    var next = count > 1 ? all[(idx + 1) % count] : null;
    if (prev && prev === next) prev = null;
    var similar = (f.similar || []).map(V.flavorById).filter(Boolean);
    var brand = V.brandOf(f);
    var num = 0;
    function nextNum() { num += 1; return (num < 10 ? '0' : '') + num; }

    var words = String(f.name).split(/\s+/);
    var ci = 0;
    var nameWords = words.map(function (w) {
      return '<span class="w">' + Array.from(w).map(function (ch) { return '<span class="ch" style="--c:' + (ci++) + '">' + esc(ch) + '</span>'; }).join('') + '</span>';
    }).join(' ');
    var longest = words.reduce(function (m, w) { return Math.max(m, w.length); }, 1);
    var tags = (f.tags || []).map(function (tag) { return '<li class="tag">' + esc(MSP.tagLabel(tag)) + '</li>'; }).join('');
    var floaterIngs = f.mood === 'frost'
      ? ings.concat([{ illustration: 'kristal', color: '#dff4ff' }])
      : f.mood === 'ice'
        ? [{ illustration: 'bomboni', color: '#ff4fa3' }, { illustration: 'bomboni', color: '#7a5cff' }, { illustration: 'kocka', color: '#bfeeff' }].concat(ings)
        : ings;
    var desc = L(f.description) || [];
    var mixIdeas = L(f.mixIdeas) || [];

    return (
      '<article class="flavor">' +
        (f.mood === 'ice' ? frostEdges() : '') +
        '<section class="hero fhero" aria-labelledby="flavor-title">' +
          moodLayer(f) +
          floaters(floaterIngs, FLAVOR_SLOTS) +
          crumbs +
          '<div class="container fhero__inner">' +
            '<div class="fhero__copy" data-depth="-0.1" data-scroll-only>' +
              '<h1 class="fhero__name" id="flavor-title" tabindex="-1">' +
                (brand
                  ? '<a class="fhero__brand anim-in" style="--i:0" href="' + V.brandUrl(brand) + '">' + esc(f.brand) + '</a> '
                  : '<span class="fhero__brand anim-in" style="--i:0">' + esc(f.brand) + '</span> ') +
                '<span class="sr-only">' + esc(f.name) + '</span>' +
                '<span class="fhero__title" id="flavor-name" aria-hidden="true" style="--chars:' + longest + '">' + nameWords + '</span>' +
              '</h1>' +
              '<p class="fhero__lead anim-in" style="--i:5">' + esc(L(f.shortDescription)) + '</p>' +
              (tags ? '<ul class="tags anim-in" style="--i:6" role="list">' + tags + '</ul>' : '') +
              V.collectionBadges(f) +
              V.leafNote(f) +
              '<p class="fhero__actions anim-in" style="--i:8">' + V.shelfButton(f, 'btn') + V.shareButton('flavor', f.id) + '</p>' +
              V.rateWidget('flavor', f.id, f.brand + ' ' + f.name, 9) +
            '</div>' +
            '<div class="fhero__stage">' + V.hookahStage(th, ings.slice(0, 4)) + '</div>' +
          '</div>' +
          '<div class="scroll-cue anim-in" style="--i:8" aria-hidden="true"><span>' + esc(t('flavor.scrollCue')) + '</span><span class="scroll-cue__line"></span></div>' +
        '</section>' +

        '<section class="fsec" aria-labelledby="sec-ingredients"><div class="container">' +
          sectionHead(nextNum(), t('flavor.ingredientsTitle'), t('flavor.ingredientsIntro'), 'sec-ingredients') +
          '<ul class="ings" role="list">' + ingredientsList(f, th) + '</ul>' +
        '</div></section>' +

        '<section class="fsec fsec--alt" aria-labelledby="sec-profile"><div class="container profile">' +
          '<div class="profile__intro">' +
            sectionHead(nextNum(), t('flavor.profileTitle'), t('flavor.profileIntro'), 'sec-profile') +
            '<div class="radar-wrap" data-reveal>' + radar(f) + '</div>' +
          '</div>' +
          gauges(f) +
        '</div></section>' +

        '<section class="fsec" aria-labelledby="sec-about"><div class="container about">' +
          '<div class="about__text">' +
            sectionHead(nextNum(), t('flavor.aboutTitle'), '', 'sec-about') +
            '<div class="prose" data-reveal>' + desc.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
          '</div>' +
          '<aside class="facts" data-reveal aria-labelledby="facts-title">' +
            '<h3 class="facts__title" id="facts-title">' + esc(t('flavor.factsTitle')) + '</h3>' +
            '<dl class="facts__list">' +
              '<div><dt>' + esc(t('flavor.factBrand')) + '</dt><dd>' + (brand ? '<a href="' + V.brandUrl(brand) + '">' + esc(f.brand) + '</a>' : esc(f.brand)) + '</dd></div>' +
              '<div><dt>' + esc(t('flavor.factFlavor')) + '</dt><dd>' + esc(f.name) + '</dd></div>' +
              '<div><dt>' + icon('leaf') + esc(t('flavor.factTobacco')) + '</dt><dd>' + esc(L(f.tobaccoType) || t('leaf.' + V.leafOf(f))) + '</dd></div>' +
              '<div><dt>' + esc(t('flavor.factIngredients')) + '</dt><dd>' + esc(MSP.plural('flavor.ingredientsCount', (f.ingredients || []).length)) + '</dd></div>' +
              '<div><dt>' + esc(t('flavor.factTags')) + '</dt><dd>' + esc((f.tags || []).map(MSP.tagLabel).join(', ')) + '</dd></div>' +
            '</dl>' +
            '<p class="facts__report"><a class="btn btn--ghost" href="' + V.reportUrl(f) + '">' + icon('alert') + '<span>' + esc(t('forms.reportButton')) + '</span></a></p>' +
          '</aside>' +
        '</div></section>' +

        (mixIdeas.length
          ? '<section class="fsec fsec--alt" aria-labelledby="sec-mixes"><div class="container">' +
              sectionHead(nextNum(), t('flavor.mixesTitle'), t('flavor.mixesIntro'), 'sec-mixes') +
              '<ol class="mixes" role="list">' + mixIdeas.map(function (m, i) {
                return '<li class="mix" data-reveal style="--i:' + i + '"><span class="mix__num" aria-hidden="true">0' + (i + 1) + '</span>' + icon('mix', 'mix__icon') + '<p>' + esc(m) + '</p></li>';
              }).join('') + '</ol>' +
            '</div></section>'
          : '') +

        (similar.length
          ? '<section class="fsec" aria-labelledby="sec-similar"><div class="container">' +
              sectionHead(nextNum(), t('flavor.similarTitle'), '', 'sec-similar') +
              '<ul class="grid grid--similar" id="similar-grid" role="list">' +
                similar.map(function (s, i) { return '<li class="grid__item" data-reveal style="--i:' + i + '">' + V.card(s, 'h3') + '</li>'; }).join('') +
              '</ul>' +
            '</div></section>'
          : '') +

        V.flavorRecipesSection(f, nextNum) +
        V.flavorCompareSection(f, nextNum) +
        '<nav class="pager container' + (prev && next ? '' : ' pager--single') + '" aria-label="' + esc(t('flavor.pagerLabel')) + '">' +
          (prev ? pagerLink(prev, 'prev') : '') + (next ? pagerLink(next, 'next') : '') +
          '<a class="btn btn--ghost pager__back" href="' + V.url('home') + '#svi-okusi">' + icon('arrowLeft') + '<span>' + esc(t('nav.backToAll')) + '</span></a>' +
        '</nav>' +
      '</article>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Rječnik                                                             */
  /* ------------------------------------------------------------------ */

  var ALPHABET = {
    bs: 'A B C Č Ć D Dž Đ E F G H I J K L Lj M N Nj O P R S Š T U V Z Ž'.split(' '),
    en: 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ')
  };

  function letterOf(term) {
    var two = term.slice(0, 2);
    if (MSP.lang === 'bs' && /^(Dž|Lj|Nj)$/i.test(two)) return two.charAt(0).toUpperCase() + two.charAt(1).toLowerCase();
    var ch = term.charAt(0).toUpperCase();
    if (MSP.lang === 'en') ch = ch.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return ch;
  }

  function sortedTerms() {
    return V.glossary().slice().sort(function (a, b) { return L(a.term).localeCompare(L(b.term), MSP.lang); });
  }

  function termLinks(g) {
    var links = [];
    if (g.guide) links.push('<a class="gl-link" href="' + V.guideStepUrl(g.guide) + '">' + icon('arrowRight') + esc(t('glossary.seeGuide')) + '</a>');
    if (g.gear) links.push('<a class="gl-link" href="' + V.url('gear') + '#oprema-' + g.gear + '">' + icon('arrowRight') + esc(t('glossary.seeGear')) + '</a>');
    return links.join('');
  }

  function termRelated(g) {
    return (g.related || []).map(V.glossaryById).filter(Boolean).map(function (r) {
      return '<a class="gl-rel" href="' + V.termUrl(r) + '">' + esc(L(r.term)) + '</a>';
    }).join('');
  }

  function termCard(g) {
    var aka = L(g.aka) || [];
    var rel = termRelated(g);
    var links = termLinks(g);
    return (
      '<li class="gl-card" id="pojam-' + g.id + '" data-id="' + g.id + '">' +
        '<h3 class="gl-card__h">' +
          '<button type="button" class="gl-card__btn" aria-expanded="false" aria-controls="gl-panel-' + g.id + '">' +
            '<span class="gl-card__icon">' + MSP.glossaryIcon(g.icon) + '</span>' +
            '<span class="gl-card__txt"><span class="gl-card__term">' + esc(L(g.term)) + '</span><span class="gl-card__short">' + esc(L(g.short)) + '</span></span>' +
            '<span class="gl-card__chev" aria-hidden="true"></span>' +
          '</button>' +
        '</h3>' +
        '<div class="gl-card__panel" id="gl-panel-' + g.id + '" role="region" aria-label="' + esc(L(g.term)) + '">' +
          '<div class="gl-card__inner">' +
            (aka.length ? '<p class="gl-card__aka">' + esc(t('glossary.also')) + ': ' + esc(aka.join(', ')) + '</p>' : '') +
            (L(g.text) || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
            (links ? '<p class="gl-card__links">' + links + '</p>' : '') +
            (rel ? '<p class="gl-card__related"><span>' + esc(t('glossary.related')) + ':</span> ' + rel + '</p>' : '') +
            '<p class="gl-card__perma"><a href="' + V.termUrl(g) + '">' + icon('link') + esc(t('glossary.openTerm')) + '</a></p>' +
          '</div>' +
        '</div>' +
      '</li>'
    );
  }

  function pageGlossary(crumbs) {
    var terms = sortedTerms();
    var groups = {};
    terms.forEach(function (g) { var l = letterOf(L(g.term)); (groups[l] = groups[l] || []).push(g); });
    var alpha = ALPHABET[MSP.lang];
    var letters = alpha.map(function (l) {
      return '<li><button type="button" class="gl-letter" data-letter="' + l + '"' + (groups[l] ? '' : ' disabled') + '>' + l + '</button></li>';
    }).join('');
    var list = alpha.filter(function (l) { return groups[l]; }).map(function (l) {
      return (
        '<section class="gl-group" data-letter="' + l + '" aria-labelledby="gl-l-' + l + '">' +
          '<h2 class="gl-group__letter" id="gl-l-' + l + '" tabindex="-1">' + l + '</h2>' +
          '<ul class="gl-group__list" role="list">' + groups[l].map(termCard).join('') + '</ul>' +
        '</section>'
      );
    }).join('');
    return (
      pageHero({ id: 'gl-title', eyebrow: t('glossary.eyebrow'), title: t('glossary.title'), lead: t('glossary.lead'), crumbs: crumbs }) +
      '<section class="gl"><div class="container">' +
        '<div class="gl__tools">' +
          '<form class="search search--small" role="search" id="gl-form">' +
            '<label class="sr-only" for="gl-search">' + esc(t('glossary.searchLabel')) + '</label>' +
            '<span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
            '<input class="search__input" id="gl-search" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('glossary.searchPlaceholder')) + '">' +
          '</form>' +
          '<p class="gl__count" id="gl-count" aria-live="polite">' + esc(MSP.plural('glossary.count', terms.length)) + '</p>' +
        '</div>' +
        '<nav class="gl__letters" aria-label="' + esc(t('glossary.lettersLabel')) + '"><ul role="list">' + letters + '</ul></nav>' +
        '<div class="gl__list" id="gl-list">' + list + '</div>' +
        '<p class="gl__empty" id="gl-empty" hidden>' + esc(t('glossary.empty')) + '</p>' +
      '</div></section>'
    );
  }

  function pageTerm(g, crumbs) {
    var aka = L(g.aka) || [];
    var rel = termRelated(g);
    var links = termLinks(g);
    var others = sortedTerms().filter(function (x) { return x !== g; }).map(function (x) {
      return '<li><a class="term-chip" href="' + V.termUrl(x) + '">' + esc(L(x.term)) + '</a></li>';
    }).join('');
    return (
      '<section class="phero term-hero" aria-labelledby="term-title">' +
        crumbs +
        '<div class="container phero__inner">' +
          '<div class="phero__copy">' +
            '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('glossary.eyebrow')) + '</p>' +
            '<h1 class="phero__title anim-in" style="--i:1" id="term-title" tabindex="-1">' + esc(L(g.term)) + '</h1>' +
            '<p class="phero__lead anim-in" style="--i:2">' + esc(L(g.short)) + '</p>' +
          '</div>' +
          '<span class="term-hero__icon anim-in" style="--i:2" aria-hidden="true">' + MSP.glossaryIcon(g.icon) + '</span>' +
        '</div>' +
      '</section>' +
      '<section class="fsec term-body"><div class="container term-body__inner">' +
        '<div class="prose" data-reveal>' +
          (aka.length ? '<p class="gl-card__aka">' + esc(t('glossary.also')) + ': ' + esc(aka.join(', ')) + '</p>' : '') +
          (L(g.text) || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
          (links ? '<p class="gl-card__links">' + links + '</p>' : '') +
          (rel ? '<p class="gl-card__related"><span>' + esc(t('glossary.related')) + ':</span> ' + rel + '</p>' : '') +
        '</div>' +
      '</div></section>' +
      '<section class="fsec fsec--alt" aria-labelledby="term-others"><div class="container">' +
        '<h2 class="mix__h" id="term-others">' + esc(t('glossary.otherTerms')) + '</h2>' +
        '<ul class="term-chips" role="list">' + others + '</ul>' +
        '<p><a class="btn btn--ghost" href="' + V.url('glossary') + '">' + icon('arrowLeft') + '<span>' + esc(t('glossary.allTerms')) + '</span></a></p>' +
      '</div></section>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Oprema                                                              */
  /* ------------------------------------------------------------------ */

  function gearCard(cat, item, i) {
    var ratings = Object.keys(cat.ratings).map(function (k) { return coalRating(item.ratings[k] || 0, L(cat.ratings[k])); }).join('');
    var name = L(item.name);
    var label = item.juice ? t('gear.cutawayLabel', { name: name, juice: L(item.juice) }) : name;
    return (
      '<li class="gcard" data-reveal style="--i:' + i + '" id="oprema-' + item.id + '">' +
        '<div class="gcard__visual" role="img" aria-label="' + esc(label) + '">' + MSP.gearVisual(item.visual) +
          (item.juice ? '<p class="gcard__legend" aria-hidden="true"><span class="lg lg--heat"></span>' + esc(t('gear.legendHeat')) + '<span class="lg lg--juice"></span>' + esc(t('gear.legendJuice')) + '</p>' : '') +
        '</div>' +
        '<h3 class="gcard__name">' + esc(name) + '</h3>' +
        '<p class="gcard__short">' + esc(L(item.short)) + '</p>' +
        (L(item.text) || []).map(function (p) { return '<p class="gcard__text">' + esc(p) + '</p>'; }).join('') +
        '<div class="gcard__ratings">' + ratings + '</div>' +
        '<p class="gcard__suits"><strong>' + esc(t('gear.suits')) + ':</strong> ' + esc(L(item.suits)) + '</p>' +
        '<div class="gcard__pc">' +
          '<div><h4>' + esc(t('gear.pros')) + '</h4><ul>' + L(item.pros).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>' +
          '<div><h4>' + esc(t('gear.cons')) + '</h4><ul>' + L(item.cons).map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>' +
        '</div>' +
        (item.warning ? '<p class="gcard__warn" role="note">' + icon('alert') + '<span><strong>' + esc(t('gear.warning')) + ':</strong> ' + esc(L(item.warning)) + '</span></p>' : '') +
      '</li>'
    );
  }

  function compareColumn(cat, item) {
    return (
      '<div class="cmp__col">' +
        '<div class="cmp__visual" aria-hidden="true">' + MSP.gearVisual(item.visual) + '</div>' +
        '<h3 class="cmp__name">' + esc(L(item.name)) + '</h3>' +
        '<div class="gcard__ratings">' + Object.keys(cat.ratings).map(function (k) { return coalRating(item.ratings[k] || 0, L(cat.ratings[k])); }).join('') + '</div>' +
        '<p class="gcard__suits"><strong>' + esc(t('gear.suits')) + ':</strong> ' + esc(L(item.suits)) + '</p>' +
      '</div>'
    );
  }

  /** Dijelovi poređenja (koristi i browser pri promjeni izbora). */
  V.compare = function (catKey, a, b) {
    var cat = (root.GEAR || {}).categories[catKey];
    var picker = function (which, sel) {
      return '<span class="segctl__label">' + esc(t(which === 'a' ? 'gear.compareLeft' : 'gear.compareRight')) + '</span>' +
        cat.items.map(function (it, i) {
          return '<button type="button" class="seg-btn" data-which="' + which + '" data-i="' + i + '" aria-pressed="' + (sel === i) + '">' + esc(L(it.name).replace(/ \(.*\)/, '')) + '</button>';
        }).join('');
    };
    return {
      a: picker('a', a),
      b: picker('b', b),
      cols: compareColumn(cat, cat.items[a]) + '<span class="cmp__vs" aria-hidden="true">vs</span>' + compareColumn(cat, cat.items[b])
    };
  };

  function pageGear(crumbs) {
    var G = root.GEAR || { categories: {} };
    var sec = function (num, key, titleKey, introKey) {
      var cat = G.categories[key];
      if (!cat) return '';
      return (
        '<section class="fsec' + (num % 2 ? '' : ' fsec--alt') + '" aria-labelledby="gear-' + key + '" id="oprema-' + key + '"><div class="container">' +
          sectionHead('0' + num, t(titleKey), t(introKey), 'gear-' + key) +
          '<ul class="gcards gcards--' + cat.items.length + '" role="list">' + cat.items.map(function (it, i) { return gearCard(cat, it, i); }).join('') + '</ul>' +
        '</div></section>'
      );
    };
    var tabs = [['bowls', 'gear.compareBowls'], ['coals', 'gear.compareCoals'], ['heat', 'gear.compareHeat']];
    var cmp = V.compare('bowls', 0, 1);
    return (
      pageHero({ id: 'gear-title', eyebrow: t('gear.eyebrow'), title: t('gear.title'), lead: t('gear.lead'), crumbs: crumbs }) +
      sec(1, 'bowls', 'gear.bowlsTitle', 'gear.bowlsIntro') +
      sec(2, 'coals', 'gear.coalsTitle', 'gear.coalsIntro') +
      sec(3, 'heat', 'gear.heatTitle', 'gear.heatIntro') +
      '<section class="fsec fsec--alt" aria-labelledby="gear-compare"><div class="container">' +
        sectionHead('04', t('gear.compareTitle'), t('gear.compareIntro'), 'gear-compare') +
        '<div class="cmp" data-reveal>' +
          '<div class="segctl" role="group" aria-label="' + esc(t('gear.compareTitle')) + '" id="cmp-cat">' +
            tabs.map(function (tb, i) { return '<button type="button" class="seg-btn" data-cat="' + tb[0] + '" aria-pressed="' + (i === 0) + '">' + esc(t(tb[1])) + '</button>'; }).join('') +
          '</div>' +
          '<div class="cmp__pickers">' +
            '<div class="segctl segctl--sm" role="group" aria-label="' + esc(t('gear.compareLeft')) + '" id="cmp-a">' + cmp.a + '</div>' +
            '<div class="segctl segctl--sm" role="group" aria-label="' + esc(t('gear.compareRight')) + '" id="cmp-b">' + cmp.b + '</div>' +
          '</div>' +
          '<div class="cmp__cols" id="cmp-cols" aria-live="polite">' + cmp.cols + '</div>' +
          '<p class="cmp__note">' + esc(t('gear.ratingNote')) + '</p>' +
        '</div>' +
      '</div></section>' +
      '<section class="fsec" aria-labelledby="gear-rec"><div class="container">' +
        '<div class="recommend" data-reveal>' +
          '<span class="recommend__coal" aria-hidden="true">' + MSP.coal() + '</span>' +
          '<div><h2 class="recommend__title" id="gear-rec">' + esc(t('gear.recommendTitle')) + '</h2>' +
          (L(G.recommendation) || []).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
        '</div>' +
      '</div></section>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Vodič                                                               */
  /* ------------------------------------------------------------------ */

  V.guideSteps = function () { return (root.GUIDE && root.GUIDE.steps) || []; };

  function stepArticle(s, n, total) {
    var cmp = s.compare ? '<div class="gstep__compare">' + s.compare.map(function (c) {
      return '<div class="gstep__cmp"><h3>' + esc(L(c.title)) + '</h3><p>' + esc(L(c.text)) + '</p></div>';
    }).join('') + '</div>' : '';
    return (
      '<article class="gstep' + (n === 1 ? ' is-current' : '') + '" data-step="' + n + '" id="korak-' + n + '" aria-labelledby="gstep-title-' + n + '">' +
        '<p class="gstep__num">' + esc(t('guide.stepOf', { n: n, total: total })) + '</p>' +
        '<h2 class="gstep__title" id="gstep-title-' + n + '" tabindex="-1">' + esc(L(s.title)) + '</h2>' +
        (L(s.text) || []).map(function (p) { return '<p class="gstep__text">' + linkTerms(p) + '</p>'; }).join('') +
        cmp +
        (s.tip ? '<p class="gstep__tip"><strong>' + esc(t('guide.tipLabel')) + ':</strong> ' + linkTerms(L(s.tip)) + '</p>' : '') +
      '</article>'
    );
  }

  function pageGuide(crumbs) {
    var G = root.GUIDE || { steps: [], safety: { items: [] } };
    var steps = G.steps;
    var total = steps.length;
    var th = V.themeFor(null);
    var dots = steps.map(function (s, i) {
      return '<li><a class="gdot" href="' + V.guideStepUrl(i + 1) + '" data-step="' + (i + 1) + '"' + (i === 0 ? ' aria-current="step"' : '') + ' aria-label="' + esc(t('guide.goToStep', { n: i + 1, title: L(s.title) })) + '"><span aria-hidden="true">' + (i + 1) + '</span></a></li>';
    }).join('');
    var safetyIcons = {
      air: '<path d="M4 10h11a3 3 0 1 0-3-3M4 14h15a3 3 0 1 1-3 3M4 18h7"/>',
      eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
      child: '<circle cx="12" cy="6" r="3"/><path d="M12 9v7M8 12h8M9 21l3-5 3 5"/>'
    };
    var hose = 'M10 20C120 4 200 36 320 20S520 4 640 20S860 36 990 20';
    return (
      pageHero({ id: 'guide-title', eyebrow: t('guide.eyebrow'), title: t('guide.title'), lead: t('guide.lead'), crumbs: crumbs }) +
      '<section class="guide" style="--progress:0"><div class="container">' +
        '<div class="guide__progress">' +
          '<svg class="hose-bar" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path class="hose-bar__track" d="' + hose + '" pathLength="1"/><path class="hose-bar__fill" d="' + hose + '" pathLength="1"/></svg>' +
          '<ol class="gdots" role="list" aria-label="' + esc(t('guide.stepsLabel')) + '">' + dots + '</ol>' +
        '</div>' +
        '<div class="guide__grid">' +
          '<div class="guide__stage">' +
            '<div class="guide__scene" role="img" aria-label="' + esc(t('guide.sceneLabel', { title: L(steps[0].title) })) + '">' + MSP.guideScene().replace('class="gs"', 'class="gs has-water" data-step="1"') + '</div>' +
            '<div class="guide__live" hidden>' + V.hookahStage(th) + '</div>' +
          '</div>' +
          '<div class="guide__panel">' +
            '<div class="gsteps" aria-live="polite">' + steps.map(function (s, i) { return stepArticle(s, i + 1, total); }).join('') + '</div>' +
            '<div class="guide__nav">' +
              '<button type="button" class="btn btn--ghost" data-guide="prev" disabled>' + icon('arrowLeft') + '<span>' + esc(t('guide.prev')) + '</span></button>' +
              '<button type="button" class="btn btn--primary" data-guide="next"><span>' + esc(t('guide.next')) + '</span>' + icon('arrowRight') + '</button>' +
            '</div>' +
            '<p class="guide__hint">' + esc(t('guide.keysHint')) + '</p>' +
          '</div>' +
        '</div>' +
      '</div></section>' +
      '<section class="fsec" aria-labelledby="safety-title"><div class="container">' +
        '<div class="safety" data-reveal role="note">' +
          '<div class="safety__head"><span class="safety__icon" aria-hidden="true">' + icon('alert') + '</span>' +
            '<div><p class="safety__eyebrow">' + esc(t('guide.safetyEyebrow')) + '</p><h2 class="safety__title" id="safety-title">' + esc(L(G.safety.title)) + '</h2></div></div>' +
          '<ul class="safety__list" role="list">' + G.safety.items.map(function (it) {
            return '<li class="safety__item"><svg class="safety__ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (safetyIcons[it.icon] || safetyIcons.eye) + '</svg><div><h3>' + esc(L(it.title)) + '</h3><p>' + esc(L(it.text)) + '</p></div></li>';
          }).join('') + '</ul>' +
        '</div>' +
      '</div></section>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Mikser                                                              */
  /* ------------------------------------------------------------------ */

  V.blendPalette = function (a, b, r) {
    var c = C();
    var p = {};
    ['primary', 'secondary', 'accent', 'background', 'text'].forEach(function (k) { p[k] = c.mix(b.palette[k], a.palette[k], r); });
    p.water = c.mix(b.palette.water || b.palette.accent, a.palette.water || a.palette.accent, r);
    return p;
  };

  V.mergedIngredients = function (a, b, r) {
    var map = {};
    function add(f, w, side) {
      (f.ingredients || []).forEach(function (ing) {
        var key = ing.illustration;
        var e = map[key] || (map[key] = { key: key, name: L(ing.name), color: ing.color, value: 0, sides: {}, best: 0 });
        var v = (ing.intensity || 0) * w;
        e.value += v;
        e.sides[side] = true;
        if (v > e.best) { e.best = v; e.name = L(ing.name); e.color = ing.color; }
      });
    }
    add(a, r, 'a');
    add(b, 1 - r, 'b');
    return Object.keys(map).map(function (k) { var e = map[k]; e.shared = !!(e.sides.a && e.sides.b); return e; })
      .sort(function (x, y) { return y.value - x.value; });
  };

  V.blendedProfile = function (a, b, r) {
    var out = {};
    V.PROFILE_KEYS.forEach(function (k) { out[k] = (a.profile[k] || 0) * r + (b.profile[k] || 0) * (1 - r); });
    return out;
  };

  V.mixDescription = function (a, b, r, ings, prof) {
    var andW = ' ' + t('mixer.and') + ' ';
    var name = a.name + ' × ' + b.name;
    var lower = function (s) { return MSP.lang === 'bs' ? s.toLowerCase() : s.toLowerCase(); };
    var main = ings.slice(0, 2).map(function (i) { return lower(i.name); }).join(andW);
    var parts = [t('mixer.descStart', { name: name, main: main })];
    var shared = ings.filter(function (i) { return i.shared; }).map(function (i) { return lower(i.name); });
    if (shared.length === 1) parts.push(t('mixer.descSharedOne', { item: shared[0] }));
    else if (shared.length > 1) parts.push(t('mixer.descShared', { items: shared.join(andW) }));
    if (prof.cooling >= 7) parts.push(t('mixer.descCool'));
    else if (prof.freshness >= 8) parts.push(t('mixer.descFresh'));
    if (prof.sweetness >= 7.5) parts.push(t('mixer.descSweet'));
    if (Math.abs(r - 0.5) < 0.01) parts.push(t('mixer.descBalance'));
    else parts.push(t('mixer.descLean', { name: r > 0.5 ? a.name : b.name }));
    var cooler = a.mixRole === 'cooler' ? a : b.mixRole === 'cooler' ? b : null;
    if (cooler) parts.push(t('mixer.descCooler', { name: cooler.name }));
    return parts.join(' ');
  };

  V.mixSlot = function (which, f) {
    var th = V.themeFor(f);
    var art = V.byIntensity(f).slice(0, 3).map(function (ing) { return '<span class="slot__ing">' + MSP.illustrate(ing.illustration, { color: ing.color }) + '</span>'; }).join('');
    return (
      '<button type="button" class="slot slot--' + which + '" data-slot="' + which + '" aria-haspopup="dialog" aria-expanded="false" aria-controls="picker" style="--sl-bg:' + th.bg + ';--sl-text:' + th.text + ';--sl-muted:' + th.muted + '">' +
        '<span class="slot__label">' + esc(t(which === 'a' ? 'mixer.pickA' : 'mixer.pickB')) + '</span>' +
        '<span class="slot__art" aria-hidden="true">' + art + '</span>' +
        '<span class="slot__brand">' + esc(f.brand) + '</span>' +
        '<span class="slot__name">' + esc(f.name) + '</span>' +
        '<span class="slot__change">' + icon('layers') + esc(t('mixer.change')) + '</span>' +
      '</button>'
    );
  };

  V.mixIngredients = function (ings) {
    return ings.map(function (e) {
      var v = Math.min(10, e.value);
      return (
        '<li class="mix-ing' + (e.shared ? ' is-shared' : '') + '" style="--v:' + (v / 10).toFixed(3) + ';--ing:' + e.color + '">' +
          '<span class="mix-ing__art" aria-hidden="true">' + MSP.illustrate(e.key, { color: e.color }) + '</span>' +
          '<span class="mix-ing__name">' + esc(e.name) + (e.shared ? ' <span class="mix-ing__badge">' + esc(t('mixer.shared')) + '</span>' : '') + '</span>' +
          '<span class="mix-ing__val" aria-hidden="true"><b>' + V.formatNum(v) + '</b>/10</span>' +
          '<span class="sr-only">' + esc(t('a11y.outOf', { value: V.formatNum(v), max: 10 })) + '</span>' +
          '<span class="mix-ing__bar" aria-hidden="true"><span></span></span>' +
        '</li>'
      );
    }).join('');
  };

  V.mixProfile = function (prof) {
    return V.PROFILE_KEYS.map(function (k) {
      var v = prof[k];
      return (
        '<li class="mix-bar" style="--v:' + (v / 10).toFixed(3) + '">' +
          '<span class="mix-bar__label">' + esc(t('profile.' + k)) + '</span>' +
          '<span class="mix-bar__val" aria-hidden="true"><b>' + V.formatNum(v) + '</b>/10</span>' +
          '<span class="sr-only">' + esc(t('a11y.outOf', { value: V.formatNum(v), max: 10 })) + '</span>' +
          '<span class="mix-bar__track" aria-hidden="true"><span></span></span>' +
        '</li>'
      );
    }).join('');
  };

  V.mixIdeas = function (a, b) {
    var out = '';
    [a, b].forEach(function (f) {
      var ideas = L(f.mixIdeas) || [];
      if (!ideas.length) return;
      out += '<div class="ideas__group"><h3 class="ideas__from">' + esc(t('mixer.ideasFrom', { name: f.name })) + '</h3><ul role="list">';
      ideas.forEach(function (idea) {
        var norm = normalize(idea);
        var other = V.flavors().filter(function (o) { return o !== f && norm.indexOf(normalize(o.name)) !== -1; })[0];
        if (other && (other === a || other === b) && (f === a || f === b)) other = null;
        out += '<li class="idea"><p>' + esc(idea) + '</p>' +
          (other ? '<a class="idea__try" href="' + esc(V.mixUrl(f, other, 50)) + '" data-a="' + f.id + '" data-b="' + other.id + '">' + icon('arrowRight') + esc(t('mixer.tryIdea')) + '</a>' : '') + '</li>';
      });
      out += '</ul></div>';
    });
    return out ? '<h2 class="mix__h">' + esc(t('mixer.ideasTitle')) + '</h2>' + out : '';
  };

  V.defaultMix = function () {
    var F = V.flavors();
    return { a: F[0], b: F[1] || F[0], ratio: 50 };
  };

  function pageMixer(crumbs) {
    var m = V.defaultMix();
    var a = m.a, b = m.b, r = m.ratio / 100;
    var ings = V.mergedIngredients(a, b, r);
    var prof = V.blendedProfile(a, b, r);
    var th = V.computeTheme(V.blendPalette(a, b, r), false);
    var picker =
      '<div class="picker" id="picker" role="dialog" aria-modal="false" aria-labelledby="picker-title" hidden>' +
        '<div class="picker__head"><h2 class="picker__title" id="picker-title">' + esc(t('mixer.pickerTitle')) + '</h2>' +
          '<button type="button" class="picker__close" aria-label="' + esc(t('mixer.pickerClose')) + '">' + icon('close') + '</button></div>' +
        '<div class="search search--small"><label class="sr-only" for="picker-search">' + esc(t('mixer.pickerSearch')) + '</label>' +
          '<span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
          '<input class="search__input" id="picker-search" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('mixer.pickerSearch')) + '"></div>' +
        '<ul class="picker__list" role="list">' + V.flavors().map(function (f) {
          var ft = V.themeFor(f);
          var top = V.byIntensity(f)[0];
          return '<li><button type="button" class="pick-item" data-id="' + f.id + '" style="--pk-bg:' + ft.bg + ';--pk-text:' + ft.text + '">' +
            '<span class="pick-item__art" aria-hidden="true">' + MSP.illustrate(top.illustration, { color: top.color }) + '</span>' +
            '<span class="pick-item__txt"><span class="pick-item__brand">' + esc(f.brand) + '</span><span class="pick-item__name">' + esc(f.name) + '</span></span>' +
          '</button></li>';
        }).join('') + '</ul>' +
      '</div>';
    return {
      theme: th,
      html:
        '<section class="mixer" aria-labelledby="mixer-title" style="--ratio:' + r + '">' +
          crumbs +
          '<div class="container">' +
            '<header class="mixer__head">' +
              '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('mixer.eyebrow')) + '</p>' +
              '<h1 class="phero__title anim-in" style="--i:1" id="mixer-title" tabindex="-1">' + esc(t('mixer.title')) + '</h1>' +
              '<p class="phero__lead anim-in" style="--i:2">' + esc(t('mixer.lead')) + '</p>' +
            '</header>' +
            '<div class="mixer__top">' +
              '<div class="mixer__slot" id="slot-a">' + V.mixSlot('a', a) + '</div>' +
              '<div class="mixer__stage" role="img" aria-label="' + esc(t('mixer.stageLabel', { a: a.name, b: b.name })) + '">' + V.hookahStage(th) + '</div>' +
              '<div class="mixer__slot" id="slot-b">' + V.mixSlot('b', b) + '</div>' +
            '</div>' +
            picker +
            '<div class="mixer__ratio">' +
              '<label class="mix__label" for="mix-ratio">' + esc(t('mixer.ratio')) + '</label>' +
              '<div class="mix__range">' +
                '<span class="mix__pct mix__pct--a"><b>' + m.ratio + '%</b> ' + esc(a.name) + '</span>' +
                '<input type="range" id="mix-ratio" class="range" min="20" max="80" step="5" value="' + m.ratio + '" aria-valuetext="' + esc(t('mixer.ratioText', { a: m.ratio, nameA: a.name, b: 100 - m.ratio, nameB: b.name })) + '">' +
                '<span class="mix__pct mix__pct--b"><b>' + (100 - m.ratio) + '%</b> ' + esc(b.name) + '</span>' +
              '</div>' +
            '</div>' +
            '<div class="mixer__result">' +
              '<h2 class="mix__name" aria-live="polite">' + esc(a.name + ' × ' + b.name) + '</h2>' +
              '<p class="mix__desc">' + esc(V.mixDescription(a, b, r, ings, prof)) + '</p>' +
              '<div class="mix__actions">' +
                '<button type="button" class="btn btn--primary" id="mix-surprise">' + icon('spark') + '<span>' + esc(t('mixer.surprise')) + '</span></button>' +
                '<button type="button" class="btn btn--ghost" id="mix-share">' + icon('link') + '<span>' + esc(t('share.copyLink')) + '</span></button>' +
                V.shareButton('mixer', '', 'btn--ghost') +
                '<span class="mix__copied" id="mix-copied" aria-live="polite"></span>' +
              '</div>' +
            '</div>' +
            '<div class="mixer__grid">' +
              '<div class="mix__panel"><h2 class="mix__h">' + esc(t('mixer.ingredientsTitle')) + '</h2><ul class="mix__ings" role="list">' + V.mixIngredients(ings) + '</ul></div>' +
              '<div class="mix__panel"><h2 class="mix__h">' + esc(t('mixer.profileTitle')) + '</h2><ul class="mix__prof" role="list">' + V.mixProfile(prof) + '</ul></div>' +
            '</div>' +
            '<div class="ideas" id="mix-ideas">' + V.mixIdeas(a, b) + '</div>' +
            '<p class="mix__note" role="note">' + icon('alert') + '<span>' + esc(t('mixer.disclaimer')) + '</span></p>' +
          '</div>' +
        '</section>'
    };
  }

  /* ------------------------------------------------------------------ */
  /* Kviz                                                                */
  /* ------------------------------------------------------------------ */

  var QICONS = {
    'no-mint': '<path d="M14 36C14 20 22 12 36 12c0 14-8 24-22 24z"/><path d="M8 8l32 32"/>',
    leaf: '<path d="M14 36C14 20 22 12 36 12c0 14-8 24-22 24z"/><path d="M14 36l14-14"/>',
    leaves: '<path d="M10 38C10 24 16 16 28 16c0 12-6 20-18 22z"/><path d="M20 30C20 16 28 8 40 8c0 12-8 20-20 22z"/>',
    snow: '<path d="M24 6v36M8.4 15l31.2 18M8.4 33l31.2-18"/><path d="M19 9l5 4 5-4M19 39l5-4 5 4"/>',
    drop: '<path d="M24 6c8 10 12 17 12 23a12 12 0 0 1-24 0c0-6 4-13 12-23z"/>',
    wave: '<path d="M6 18c6-6 12 6 18 0s12 6 18 0M6 28c6-6 12 6 18 0s12 6 18 0M6 38c6-6 12 6 18 0s12 6 18 0"/>',
    balance: '<path d="M24 8v32M12 40h24M8 16h32"/><path d="M8 16l-4 10a6 6 0 0 0 8 0zM40 16l-4 10a6 6 0 0 0 8 0z"/>',
    fruit: '<circle cx="24" cy="28" r="13"/><path d="M24 15c0-5 3-8 7-9M24 15c-4-4-9-4-11-2 3 3 7 4 11 2z"/>',
    candy: '<ellipse cx="24" cy="24" rx="10" ry="8"/><path d="M14 24L5 17v14zM34 24l9-7v14z"/><path d="M20 18l4 12M25 17l4 12"/>',
    both: '<circle cx="18" cy="26" r="10"/><ellipse cx="32" cy="22" rx="8" ry="6"/>',
    'flame-1': '<path d="M24 40c-7 0-11-5-11-10 0-7 6-10 11-18 3 6 11 10 11 18 0 5-4 10-11 10z"/>',
    'flame-2': '<path d="M24 42c-8 0-13-5-13-12 0-8 7-12 12-22 4 8 13 12 13 22 0 7-5 12-12 12z"/><path d="M24 36c-3 0-5-2-5-5s3-5 5-9c2 4 5 6 5 9s-2 5-5 5z"/>',
    'flame-3': '<path d="M24 44c-9 0-15-6-15-14 0-10 9-14 14-26 5 10 16 14 16 26 0 8-6 14-15 14z"/><path d="M24 38c-4 0-6-3-6-6 0-4 4-6 6-11 3 5 7 7 7 11 0 3-3 6-7 6z"/>',
    sun: '<circle cx="24" cy="24" r="8"/><path d="M24 6v5M24 37v5M6 24h5M37 24h5M11 11l4 4M33 33l4 4M11 37l4-4M33 15l4-4"/>',
    moon: '<path d="M32 8a16 16 0 1 0 8 26 13 13 0 0 1-8-26z"/><path d="M12 10l1 3 3 1-3 1-1 3-1-3-3-1 3-1z"/>',
    sofa: '<path d="M8 22v-6a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v6"/><path d="M6 22h36v10H6zM10 32v6M38 32v6"/><path d="M14 22v-4h20v4"/>',
    sprout: '<path d="M24 42V22"/><path d="M24 26c0-8-6-13-15-13 0 9 6 13 15 13z"/><path d="M24 22c0-7 5-12 14-12 0 8-5 12-14 12z"/><path d="M14 42h20"/>',
    cup: '<path d="M10 16h24v10a12 12 0 0 1-24 0z"/><path d="M34 19h3a5 5 0 0 1 0 10h-4"/><path d="M16 4c-2 3 2 5 0 8M23 4c-2 3 2 5 0 8"/><path d="M8 42h28"/>',
    crown: '<path d="M8 36l-2-20 10 8 8-14 8 14 10-8-2 20z"/><path d="M8 42h32"/>'
  };

  V.qicon = function (key) {
    return '<svg class="qicon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (QICONS[key] || QICONS.drop) + '</svg>';
  };

  /**
   * Rezultat kviza: ponderisana udaljenost između željenih vrijednosti (iz odgovora)
   * i profila okusa, plus bonus za tagove. Ne zna ništa o pojedinačnim okusima.
   */
  V.scoreFlavors = function (answers) {
    var questions = root.QUIZ || [];
    // npr. početnik: preporučuju se samo okusi na svijetlom listu
    var onlyLeaf = '';
    answers.forEach(function (a) { if (a && a.onlyLeaf) onlyLeaf = a.onlyLeaf; });
    return V.flavors().filter(function (f) {
      return !onlyLeaf || V.leafOf(f) === onlyLeaf;
    }).map(function (f) {
      var sum = 0, wsum = 0, tagScore = 0, fits = [];
      questions.forEach(function (q, qi) {
        var a = answers[qi];
        if (!a) return;
        var w = q.weight || 1;
        var keys = Object.keys(a.target || {});
        var local = 0;
        keys.forEach(function (k) {
          var d = (a.target[k] - (f.profile[k] || 0)) / 10;
          sum += w * d * d;
          wsum += w;
          local += Math.abs(d);
        });
        var tagHit = 0;
        if (a.leafBonus && a.leafBonus[V.leafOf(f)]) { tagScore += a.leafBonus[V.leafOf(f)] * 0.04; tagHit += 1; }
        Object.keys(a.tags || {}).forEach(function (tag) {
          var tw = a.tags[tag];
          if ((f.tags || []).indexOf(tag) !== -1) { tagScore += tw * 0.035; tagHit += 1; }
          else tagScore -= tw * 0.012;
        });
        var fit = keys.length ? 1 - local / keys.length : (tagHit ? 1 : 0);
        var reason = L(a.reason);
        if (reason && (fit >= 0.78 || tagHit)) fits.push({ reason: reason, fit: fit + tagHit * 0.1, w: w });
      });
      var sim = wsum ? 1 - Math.sqrt(sum / wsum) : 0.5;
      var score = Math.max(0, Math.min(1, sim + tagScore));
      fits.sort(function (x, y) { return (y.fit * y.w) - (x.fit * x.w); });
      return { flavor: f, score: score, pct: Math.max(5, Math.min(99, Math.round(score * 100))), reasons: fits.slice(0, 2).map(function (x) { return x.reason; }) };
    }).sort(function (x, y) { return y.score - x.score; });
  };

  V.quizIntro = function () {
    return (
      '<div class="qintro">' +
        '<div class="qintro__icons" aria-hidden="true">' + V.qicon('leaves') + V.qicon('candy') + V.qicon('moon') + '</div>' +
        '<p class="qintro__text">' + esc(t('quiz.lead')) + '</p>' +
        '<button type="button" class="btn btn--primary" id="q-start">' + esc(t('quiz.start')) + icon('arrowRight') + '</button>' +
        '<noscript><p class="qintro__nojs">' + esc(t('quiz.noJs')) + ' <a href="' + V.url('home') + '#svi-okusi">' + esc(t('nav.allFlavors')) + '</a></p></noscript>' +
      '</div>'
    );
  };

  V.quizQuestion = function (qi, chosenId) {
    var Q = root.QUIZ || [];
    var q = Q[qi];
    return (
      '<form class="qform" id="qform" novalidate>' +
        '<fieldset class="qfield">' +
          '<legend class="qfield__legend"><span class="qfield__q" id="q-title" tabindex="-1">' + esc(L(q.question)) + '</span></legend>' +
          '<div class="qopts qopts--' + q.answers.length + '">' +
            q.answers.map(function (a, i) {
              var id = 'q' + qi + '-' + a.id;
              return '<div class="qopt-wrap" style="--i:' + i + '">' +
                '<input class="qopt__input sr-only" type="radio" name="q' + qi + '" id="' + id + '" value="' + a.id + '"' + (chosenId === a.id ? ' checked' : '') + '>' +
                '<label class="qopt" for="' + id + '">' + V.qicon(a.icon) + '<span class="qopt__label">' + esc(L(a.label)) + '</span></label></div>';
            }).join('') +
          '</div>' +
        '</fieldset>' +
        '<div class="qform__nav">' +
          '<button type="button" class="btn btn--ghost" id="q-back"' + (qi === 0 ? ' disabled' : '') + '>' + icon('arrowLeft') + '<span>' + esc(t('quiz.back')) + '</span></button>' +
          '<button type="submit" class="btn btn--primary" id="q-next"' + (chosenId ? '' : ' disabled') + '><span>' + esc(qi === Q.length - 1 ? t('quiz.seeResult') : t('quiz.next')) + '</span>' + icon('arrowRight') + '</button>' +
        '</div>' +
      '</form>'
    );
  };

  V.quizResult = function (answers) {
    var res = V.scoreFlavors(answers);
    var top = res[0];
    var alts = res.slice(1, 3);
    var f = top.flavor;
    var th = V.themeFor(f);
    var why = top.reasons.length ? t('quiz.reasonPrefix') + top.reasons.join(t('quiz.reasonJoin')) + '.' : '';
    var mixWith = alts[0] ? alts[0].flavor : null;
    var art = V.byIntensity(f).slice(0, 3).map(function (ing, i) {
      return '<span class="qres__ing" style="--i:' + i + '">' + MSP.illustrate(ing.illustration, { color: ing.color }) + '</span>';
    }).join('');
    return {
      top: f,
      html:
        '<div class="qres" style="--r-bg:' + th.bg + ';--r-text:' + th.text + ';--r-muted:' + th.muted + ';--r-accent:' + th.accentInk + ';--r-glow:' + th.surface2 + '">' +
          '<div class="qres__veil" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
          '<div class="qres__art" aria-hidden="true">' + art + '</div>' +
          '<p class="qres__eyebrow">' + esc(t('quiz.resultEyebrow')) + '</p>' +
          '<h2 class="qres__name" id="q-title" tabindex="-1"><span class="qres__brand">' + esc(f.brand) + '</span> ' + esc(f.name) + '</h2>' +
          '<p class="qres__match">' + esc(t('quiz.match', { n: top.pct })) + '</p>' +
          (why ? '<p class="qres__why"><strong>' + esc(t('quiz.why')) + ':</strong> ' + esc(why) + '</p>' : '') +
          '<p class="qres__desc">' + esc(L(f.shortDescription)) + '</p>' +
          '<div class="qres__actions">' +
            '<a class="btn qres__btn qres__btn--main" href="' + V.flavorUrl(f) + '" data-veil="' + th.veil + '">' + esc(t('quiz.openFlavor')) + icon('arrowRight') + '</a>' +
            (mixWith ? '<a class="btn qres__btn" href="' + esc(V.mixUrl(f, mixWith, 60)) + '">' + esc(t('quiz.tryMixer')) + '</a>' : '') +
            '<button type="button" class="btn qres__btn" id="q-restart">' + esc(t('quiz.restart')) + '</button>' +
            V.shareButton('quiz', f.id, 'qres__btn').replace('data-share="quiz"', 'data-share="quiz" data-pct="' + top.pct + '"') +
          '</div>' +
        '</div>' +
        (alts.length ? '<div class="qalts"><h3 class="qalts__title">' + esc(t('quiz.alternatives')) + '</h3><ul role="list">' + alts.map(function (a) {
          var at = V.themeFor(a.flavor);
          return '<li><a class="qalt" href="' + V.flavorUrl(a.flavor) + '" data-veil="' + at.veil + '" style="--a-bg:' + at.bg + ';--a-text:' + at.text + ';--a-muted:' + at.muted + '">' +
            '<span class="qalt__name">' + esc(a.flavor.name) + '</span><span class="qalt__pct">' + esc(t('quiz.match', { n: a.pct })) + '</span></a></li>';
        }).join('') + '</ul></div>' : '')
    };
  };

  function pageQuiz(crumbs) {
    var hose = 'M10 20C120 4 200 36 320 20S520 4 640 20S860 36 990 20';
    return (
      pageHero({ id: 'quiz-title', eyebrow: t('quiz.eyebrow'), title: t('quiz.title'), lead: '', crumbs: crumbs }) +
      '<section class="quiz" style="--progress:0"><div class="container">' +
        '<div class="quiz__progress" aria-hidden="true"><svg class="hose-bar" viewBox="0 0 1000 40" preserveAspectRatio="none" focusable="false"><path class="hose-bar__track" d="' + hose + '" pathLength="1"/><path class="hose-bar__fill" d="' + hose + '" pathLength="1"/></svg></div>' +
        '<p class="quiz__count" aria-live="polite"></p>' +
        '<div class="quiz__box is-in" data-stage="intro">' + V.quizIntro() + '</div>' +
      '</div></section>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* O nama                                                              */
  /* ------------------------------------------------------------------ */

  function pageAbout(crumbs, cfg) {
    var email = (cfg && cfg.AUTHOR_EMAIL) || '';
    var th = V.themeFor(null);
    var paras = L((root.ABOUT || {}).paragraphs) || [];
    return (
      '<section class="phero about-hero" aria-labelledby="about-title">' +
        crumbs +
        '<div class="container about-hero__inner">' +
          '<div class="about-hero__copy">' +
            '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('about.eyebrow')) + '</p>' +
            '<h1 class="phero__title anim-in" style="--i:1" id="about-title" tabindex="-1">' + esc(t('about.title')) + '</h1>' +
            '<div class="prose about-prose">' + paras.map(function (p, i) { return '<p class="anim-in" style="--i:' + (i + 2) + '">' + esc(p) + '</p>'; }).join('') + '</div>' +
          '</div>' +
          '<div class="about-hero__stage">' + V.hookahStage(th) + '</div>' +
        '</div>' +
      '</section>' +
      '<section class="fsec" aria-labelledby="kontakt-title" id="kontakt"><div class="container">' +
        '<div class="contact" data-reveal>' +
          '<span class="contact__coal" aria-hidden="true">' + MSP.coal() + '</span>' +
          '<div class="contact__copy">' +
            '<h2 class="recommend__title" id="kontakt-title">' + esc(t('about.contactTitle')) + '</h2>' +
            '<p>' + esc(t('about.contactText')) + '</p>' +
            '<a class="btn btn--primary contact__btn" href="' + V.url('about') + '#kontakt" data-m="' + (email ? V.mailParts(email) : '') + '">' + icon('mail') + '<span>' + esc(t('about.contactCta')) + '</span></a>' +
            (email ? '<noscript><p class="contact__plain">' + esc(t('about.contactPlain', { email: V.mailPlain(email) })) + '</p></noscript>' : '') +
          '</div>' +
        '</div>' +
      '</div></section>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* 404                                                                 */
  /* ------------------------------------------------------------------ */

  function pageNotFound() {
    var th = V.themeFor(null);
    return (
      '<section class="hero nf" aria-labelledby="nf-title">' +
        '<div class="container nf__inner">' +
          '<div class="nf__copy">' +
            '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('notFound.eyebrow')) + '</p>' +
            '<h1 class="nf__title anim-in" style="--i:1" id="nf-title" tabindex="-1">' + esc(t('notFound.title')) + '</h1>' +
            '<p class="nf__text anim-in" style="--i:2">' + esc(t('notFound.text')) + '</p>' +
            searchForm('search-input', 'notFound.searchLabel', 'home.searchPlaceholder') +
            '<p class="nf__back anim-in" style="--i:6"><a class="btn btn--ghost" href="' + V.url('home') + '">' + icon('arrowLeft') + '<span>' + esc(t('notFound.cta')) + '</span></a></p>' +
          '</div>' +
          '<div class="nf__stage">' + V.hookahStage(th) + '</div>' +
        '</div>' +
      '</section>' +
      catalog('nf-catalog-title')
    );
  }

  /* ------------------------------------------------------------------ */
  /* Opis stranica (za build i za browser)                               */
  /* ------------------------------------------------------------------ */

  /** Putanja (breadcrumbs) za stranicu. */
  V.crumbItems = function (desc) {
    var home = { name: t('nav.home'), url: V.url('home') };
    switch (desc.page) {
      case 'flavor':
        var fb = V.brandOf(desc.flavor);
        return [home, { name: t('nav.flavors'), url: V.url('flavors') }]
          .concat(fb ? [{ name: fb.name, url: V.brandUrl(fb) }] : [])
          .concat([{ name: fb ? desc.flavor.name : desc.flavor.brand + ' ' + desc.flavor.name, url: V.flavorUrl(desc.flavor) }]);
      case 'term': return [home, { name: t('nav.glossary'), url: V.url('glossary') }, { name: L(desc.term.term), url: V.termUrl(desc.term) }];
      case 'home': case 'notfound': return [home];
      case 'report': return [home, { name: t('forms.reportEyebrow'), url: V.url('report') }];
      case 'flavors': return [home, { name: t('nav.allFlavors'), url: V.url('flavors') }];
      case 'collection': case 'comparePair': case 'recipe': return V.crumbsMore(desc, home);
      case 'brand': return [home, { name: t('nav.brands'), url: V.url('brands') }, { name: desc.brand.name, url: V.brandUrl(desc.brand) }];
      default: return [home, { name: t('nav.' + desc.page), url: V.url(desc.page) }];
    }
  };

  /**
   * Kompletan sadržaj stranice za zadani opis.
   * desc: { page, lang, id?, flavor?, term? }
   * Vraća: { main, title, description, theme, mood, veil, crumbs }
   */
  V.page = function (desc, cfg) {
    var crumbItems = V.crumbItems(desc);
    var crumbs = V.breadcrumbs(crumbItems);
    var th = V.themeFor(null);
    var out = { crumbs: crumbItems, mood: '' };
    switch (desc.page) {
      case 'home':
        out.main = pageHome();
        out.title = t('meta.homeTitle');
        out.description = t('meta.homeDescription');
        break;
      case 'flavor':
        th = V.themeFor(desc.flavor);
        out.main = pageFlavor(desc.flavor, crumbs);
        out.title = t('meta.flavorTitle', { brand: desc.flavor.brand, name: desc.flavor.name, ingredients: V.ingredientList(desc.flavor) });
        out.description = L(desc.flavor.shortDescription);
        out.mood = desc.flavor.mood || '';
        break;
      case 'mixer':
        var mx = pageMixer(crumbs);
        th = mx.theme;
        out.main = mx.html;
        out.title = t('meta.mixerTitle');
        out.description = t('meta.mixerDescription');
        break;
      case 'quiz':
        out.main = pageQuiz(crumbs);
        out.title = t('meta.quizTitle');
        out.description = t('meta.quizDescription');
        break;
      case 'guide':
        out.main = pageGuide(crumbs);
        out.title = t('meta.guideTitle');
        out.description = t('meta.guideDescription');
        break;
      case 'glossary':
        out.main = pageGlossary(crumbs);
        out.title = t('meta.glossaryTitle');
        out.description = t('meta.glossaryDescription');
        break;
      case 'term':
        out.main = pageTerm(desc.term, crumbs);
        out.title = t('meta.glossaryTermTitle', { term: L(desc.term.term) });
        out.description = L(desc.term.short);
        break;
      case 'gear':
        out.main = pageGear(crumbs);
        out.title = t('meta.gearTitle');
        out.description = t('meta.gearDescription');
        break;
      case 'about':
        out.main = pageAbout(crumbs, cfg);
        out.title = t('meta.aboutTitle');
        out.description = t('meta.aboutDescription');
        break;
      case 'privacy': case 'terms': case 'suggest': case 'report': case 'flavors': case 'search': case 'brands': case 'brand': case 'top':
      case 'shelf': case 'tips':
        var extra = V.pageExtra(desc, crumbs, cfg);
        out.main = extra.main;
        out.title = extra.title;
        out.description = extra.description;
        if (extra.theme) th = extra.theme;
        break;
      case 'collections': case 'collection': case 'compare': case 'comparePair': case 'mixes': case 'recipe':
        var more = V.pageMore(desc, crumbs, cfg);
        th = more.theme || th;
        out.main = more.main;
        out.title = more.title;
        out.description = more.description;
        out.mood = more.mood || '';
        break;
      default:
        out.main = pageNotFound();
        out.title = t('meta.notFoundTitle');
        out.description = t('meta.notFoundDescription');
    }
    out.theme = th;
    out.veil = th.veil;
    return out;
  };

  /** Adrese iste stranice na oba jezika (za prekidač i hreflang). */
  V.alternates = function (desc) {
    var o = {};
    MSP.LANGS.forEach(function (l) {
      if (desc.page === 'flavor') o[l] = V.urlFor(l, 'flavor', desc.flavor.id);
      else if (desc.page === 'term') o[l] = V.urlFor(l, 'term', V.termSlug(desc.term, l));
      else if (desc.page === 'notfound') o[l] = V.urlFor(l, 'home');
      else if (desc.page === 'collection') o[l] = V.urlFor(l, 'collection', desc.collection.slug[l]);
      else if (desc.page === 'comparePair') o[l] = V.urlFor(l, 'comparePair', desc.pair.slug);
      else if (desc.page === 'recipe') o[l] = V.urlFor(l, 'recipe', desc.recipe.slug[l]);
      else if (desc.page === 'brand') o[l] = V.urlFor(l, 'brand', desc.brand.slug);
      else o[l] = V.urlFor(l, desc.page);
    });
    return o;
  };
})(typeof window !== 'undefined' ? window : globalThis);
