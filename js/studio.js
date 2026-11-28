/*
 * MyShishapedia - Bowl Studio: aplikacija preko cijelog ekrana (koraci, panel, pretraga okusa).
 *
 * Tok: uvod (sto) -> glava -> okus -> (miješanje, punjenje, folija ili HMD, ugljevi, dim, rezultat: u izradi).
 * Svaki korak je jedan unos u historiji preglednika, pa dugme "nazad" na telefonu vraća korak, a ne zatvara stranicu.
 * 3D sto (js/studio3d.js) se preuzima tek kad se studio otvori i gasi se kad se zatvori (oslobodi memoriju).
 * Ako 3D ne radi (stari preglednik, nema WebGL-a), svi koraci rade i dalje, preko slike stola.
 *
 * Ovisi o: views.js (V), views-studio.js (tekstovi, ikone), data/flavors.js, data/brands.js.
 */
(function () {
  'use strict';

  var doc = document;
  var MSP = window.MSP;
  var V = MSP && MSP.V;
  var root = doc.getElementById('bs');
  if (!root || !V || !V.studioTx) return;

  var T = V.studioTx();
  var A = T.app;
  var ic = V.studioIcon;
  var esc = V.esc;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var TOTAL = 8;
  var LAST_READY = 8;

  function $(id) { return doc.getElementById(id); }
  function fmt(s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }

  var el = {
    stage: $('bs-stage'), poster: $('bs-poster'), loading: $('bs-loading'), top: $('bs-top'), steps: $('bs-steps'),
    eyebrow: $('bs-eyebrow'), title: $('bs-title'), lead: $('bs-lead'), head: $('bs-head'), back: $('bs-back'), close: $('bs-close'),
    hint: $('bs-hint'), panel: $('bs-panel'), panelIn: $('bs-panel-in'),
    sheet: $('bs-sheet'), sheetH: $('bs-sheet-h'), sheetX: $('bs-sheet-x'), q: $('bs-q'), res: $('bs-res'), sheetLabel: $('bs-sheet-label')
  };

  /* ------------------------------------------------------------------ */
  /* Okusi                                                               */
  /* ------------------------------------------------------------------ */

  var ALL = V.flavors();
  var BY_ID = {};
  ALL.forEach(function (f) { BY_ID[f.id] = f; });
  var POPULAR = ['adalya-love-66', 'al-fakher-double-apple', 'adalya-lady-killer', 'musthave-pinkman', 'al-fakher-grape-mint', 'adalya-ice-bonbon', 'al-fakher-lemon-mint', 'adalya-mi-amor', 'al-fakher-gum-mint', 'musthave-blueberry']
    .filter(function (id) { return BY_ID[id]; });

  function flavorInfo(f) {
    var b = V.brandOf(f), p = f.palette || {};
    return {
      id: f.id, name: f.name, brand: b ? b.name : f.brand, leaf: f.leaf === 'dark' ? 'dark' : 'light',
      accent: p.primary || '#f2a33c', accent2: p.accent || p.secondary || '#9a6a2e', url: V.flavorUrl(f)
    };
  }
  var SEARCH = ALL.map(function (f) {
    var fi = flavorInfo(f);
    return { f: fi, n: V.normalize(fi.name), b: V.normalize(fi.brand), all: V.normalize(fi.brand + ' ' + fi.name) };
  });
  function find(q) {
    var nq = V.normalize(q);
    if (!nq) return null;
    var words = nq.split(' ');
    return SEARCH.map(function (s) {
      if (!words.every(function (w) { return s.all.indexOf(w) !== -1; })) return null;
      var score = s.n.indexOf(nq) === 0 ? 0 : s.n.indexOf(nq) !== -1 ? 1 : s.b.indexOf(words[0]) === 0 ? 2 : 3;
      return { s: score, f: s.f };
    }).filter(Boolean).sort(function (a, b) { return a.s - b.s || a.f.name.localeCompare(b.f.name); }).slice(0, 40).map(function (x) { return x.f; });
  }

  /* ------------------------------------------------------------------ */
  /* Stanje                                                              */
  /* ------------------------------------------------------------------ */

  var BOWLS = ['egypt', 'phunnel', 'silicone'];
  var state = {
    step: 0,
    bowl: 'egypt',
    flavors: [flavorInfo(BY_ID[POPULAR[0]] || ALL[0])],
    prep: 'classic', ratio: 0.5, mixP: 0, amount: 0, density: 0, holes: false,
    cover: 'foil', pattern: 'rings', foilHoles: [], vents: 0.5, coals: [], coalN: 3
  };

  var isOpen = false, depth = 0, api = null, loadingApi = false, opener = null, firstIntro = true, hintSeen = false;

  /* ------------------------------------------------------------------ */
  /* Pogledi (sadržaj panela po koraku)                                  */
  /* ------------------------------------------------------------------ */

  function btn(label, act, icon, cls) {
    return '<button type="button" class="bs-btn' + (cls ? ' ' + cls : '') + '" data-act="' + act + '"><span>' + esc(label) + '</span>' + (icon ? ic(icon) : '') + '</button>';
  }
  function swatch(f) { return '<span class="bs-swatch" style="--a:' + esc(f.accent) + ';--b:' + esc(f.accent2) + '" aria-hidden="true">' + ic('tin') + '</span>'; }

  function viewIntro() {
    var a = A.intro;
    return {
      cls: 'is-intro', title: a.title, lead: a.lead,
      panel: '<ul class="bs-tags" role="list">' + a.tags.map(function (t) { return '<li>' + ic('check') + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul>' +
        btn(a.start, 'next', 'next', 'bs-btn--primary')
    };
  }

  function viewBowl() {
    var a = A.bowl, it = a.items[state.bowl];
    return {
      title: a.title, hint: hintSeen ? '' : a.hint,
      panel:
        '<div class="bs-note" aria-live="polite">' + ic('info') + '<p><b>' + esc(it.name) + '.</b> ' + esc(it.info) + '</p></div>' +
        '<div class="bs-choices" role="radiogroup" aria-label="' + esc(a.title) + '">' + BOWLS.map(function (id) {
          var x = a.items[id], on = id === state.bowl;
          return '<button type="button" class="bs-choice' + (on ? ' is-on' : '') + '" role="radio" aria-checked="' + on + '" data-act="bowl" data-id="' + id + '">' +
            ic(id, 'bs-choice__ic') + '<span class="bs-choice__name">' + esc(x.name) + '</span><span class="bs-choice__sub">' + esc(x.short) + '</span></button>';
        }).join('') + '</div>' +
        btn(a.cta, 'next', 'next', 'bs-btn--primary')
    };
  }

  function flavorRow(f, i) {
    var a = A.flavor;
    return '<div class="bs-flav">' + swatch(f) +
      '<div class="bs-flav__txt"><b class="bs-flav__name">' + esc(f.name) + '</b>' +
        '<span class="bs-flav__meta">' + esc(f.brand) + '<span class="bs-dot" aria-hidden="true"></span><span class="bs-leaf bs-leaf--' + f.leaf + '">' + ic('leaf') + esc(a.leaf[f.leaf]) + '</span></span></div>' +
      '<button type="button" class="bs-link" data-act="pick" data-slot="' + i + '" aria-label="' + esc(a.change + ': ' + f.name) + '">' + ic('swap') + '<span>' + esc(a.change) + '</span></button>' +
      (i > 0 ? '<button type="button" class="bs-ibtn bs-ibtn--sm" data-act="remove" data-slot="' + i + '" aria-label="' + esc(a.remove) + '">' + ic('x') + '</button>' : '') +
    '</div>';
  }

  function viewFlavor() {
    var a = A.flavor, fl = state.flavors, two = fl.length > 1;
    var note = '';
    if (two) {
      var same = fl[0].leaf === fl[1].leaf;
      note = '<div class="bs-note' + (same ? '' : ' bs-note--warn') + '">' + ic(same ? 'tip' : 'warn') + '<p>' + esc(same ? a.sameLeaf : a.mixedLeaf) + ' ' + esc(a.mixNote) + '</p></div>';
    }
    return {
      title: two ? a.titleMix : a.title,
      panel: '<div class="bs-flavs' + (two ? ' bs-flavs--two' : '') + '">' + fl.map(flavorRow).join('') + '</div>' + note +
        (two ? '' : '<button type="button" class="bs-add" data-act="pick" data-slot="1">' + ic('plus') + '<span>' + esc(a.add) + '</span></button>') +
        btn(a.cta, 'next', 'next', 'bs-btn--primary')
    };
  }

  /* ------------------------------------------------------------------ */
  /* Model: punjenje, toplota, sesija, ocjena                            */
  /* ------------------------------------------------------------------ */

  // unutrašnjost glava (iste mjere kao 3D; 1 jedinica = 10 mm)
  var INNER = { egypt: { floor: 6.68, rim: 8.7, spire: 0, g: 14 }, phunnel: { floor: 6.08, rim: 8.7, spire: 8.05, g: 16 }, silicone: { floor: 6.47, rim: 8.7, spire: 0, g: 13 } };
  function prepOf() { return state.flavors.length > 1 ? state.prep : 'single'; }
  function leafOf() {
    // tamni list u miksu traži više toplote
    var dark = state.flavors.filter(function (f) { return f.leaf === 'dark'; }).length;
    return dark === 0 ? 'light' : dark === state.flavors.length ? 'dark' : 'mixed';
  }
  function packInfo() {
    var I = INNER[state.bowl], A = state.amount, d = state.density;
    var top = I.floor + A * (I.rim - I.floor) * (1 - 0.36 * d);
    var mm = Math.round((top - I.rim) * 10);
    var type = mm > 1 ? 'over' : d < 0.25 ? 'fluff' : d < 0.6 ? 'semi' : 'dense';
    return { top: top, mm: mm, type: type, grams: Math.round(A * I.g * (1 + d * 0.55)), spire: !!I.spire && top > I.spire + 0.05 };
  }
  function holeFactor() {
    var n = state.foilHoles.length;
    return n < 15 ? 0.72 : n < 30 ? 0.9 : n <= 70 ? 1 : 1.12;
  }
  function coalHeat(n) {
    if (state.cover === 'hmd') return n * 0.33 * (0.75 + 0.6 * state.vents);
    return n * 0.33 * holeFactor();
  }
  function heatTarget() { var l = leafOf(); return l === 'dark' ? 1.3 : l === 'mixed' ? 1.15 : 1; }
  function centerCoal() { return state.coals.some(function (c) { return Math.hypot(c[0], c[1]) < 0.35; }); }

  /* ------------------------------------------------------------------ */
  /* Pomoćne za panel                                                    */
  /* ------------------------------------------------------------------ */

  function stat(label, value, id) { return '<div class="bs-stat"><small>' + esc(label) + '</small><b' + (id ? ' id="' + id + '"' : '') + '>' + esc(value) + '</b></div>'; }
  function seg(name, items, cur) {
    return '<div class="bs-seg" role="radiogroup">' + items.map(function (it) {
      var on = it[0] === cur;
      return '<button type="button" class="bs-seg__b' + (on ? ' is-on' : '') + '" role="radio" aria-checked="' + on + '" data-act="' + name + '" data-id="' + it[0] + '">' + (it[2] ? ic(it[2]) : '') + '<span>' + esc(it[1]) + '</span></button>';
    }).join('') + '</div>';
  }
  function chips(name, items, cur) {
    return '<div class="bs-choices bs-choices--' + items.length + '" role="radiogroup">' + items.map(function (it) {
      var on = String(it[0]) === String(cur);
      return '<button type="button" class="bs-choice bs-choice--sm' + (on ? ' is-on' : '') + '" role="radio" aria-checked="' + on + '" data-act="' + name + '" data-id="' + it[0] + '">' +
        '<span class="bs-choice__name">' + esc(it[1]) + '</span>' + (it[2] ? '<span class="bs-choice__sub">' + esc(it[2]) + '</span>' : '') + '</button>';
    }).join('') + '</div>';
  }
  function note(icon, html, warn) { return '<div class="bs-note' + (warn ? ' bs-note--warn' : '') + '">' + ic(icon) + '<p>' + html + '</p></div>'; }
  function hold(act, label, icon, cls) {
    return '<button type="button" class="bs-btn bs-hold' + (cls ? ' ' + cls : '') + '" data-hold="' + act + '">' + ic(icon) + '<span>' + esc(label) + '</span><i class="bs-hold__fill" aria-hidden="true"></i></button>';
  }
  function primary(label, enabled, act) {
    return '<button type="button" class="bs-btn bs-btn--primary" data-act="' + (act || 'next') + '"' + (enabled === false ? ' disabled' : '') + '><span>' + esc(label) + '</span>' + ic('next') + '</button>';
  }

  /* ------------------------------------------------------------------ */
  /* Korak 3: miješanje                                                  */
  /* ------------------------------------------------------------------ */

  function layerDiagram() {
    var a = state.flavors[0], b = state.flavors[1], r = state.ratio;
    var h = 46, y0 = 70, hb = Math.round(h * r), ht = h - hb;
    return '<svg class="bs-layers" viewBox="0 0 120 92" aria-hidden="true">' +
      '<defs><clipPath id="bs-clip"><path d="M22 ' + (y0 - h) + 'h76l-10 ' + h + 'H32z"/></clipPath></defs>' +
      '<g clip-path="url(#bs-clip)"><rect x="0" y="' + (y0 - hb) + '" width="120" height="' + hb + '" fill="' + esc(a.accent) + '" opacity=".85"/>' +
      '<rect x="0" y="' + (y0 - h) + '" width="120" height="' + ht + '" fill="' + esc(b.accent) + '" opacity=".85"/></g>' +
      '<path d="M14 ' + (y0 - h - 2) + 'h92M22 ' + (y0 - h) + 'l10 ' + h + 'h56l10-' + h + 'M50 ' + y0 + 'v8h20v-8M44 86h32" fill="none" stroke="#e9dccb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
  function viewMix() {
    var a = A.mix, prep = prepOf();
    if (prep === 'single') {
      return {
        title: a.titleSingle, hint: state.mixP < 1 ? a.hintTin : '',
        panel: note('info', esc(a.single)) + mixMeter() +
          '<div class="bs-row">' + hold('stir', a.stir, 'redo', 'bs-btn--ghost') + '</div>' +
          primary(a.cta) + (state.mixP < 1 ? '<button type="button" class="bs-skip" data-act="next">' + esc(a.skip) + '</button>' : '')
      };
    }
    var fl = state.flavors, pct = Math.round(state.ratio * 100);
    var ratio = '<div class="bs-ratio"><div class="bs-ratio__top"><span><i style="background:' + esc(fl[0].accent) + '"></i>' + esc(fl[0].name) + ' <b id="bs-ra">' + pct + '%</b></span><span><b id="bs-rb">' + (100 - pct) + '%</b> ' + esc(fl[1].name) + '<i style="background:' + esc(fl[1].accent) + '"></i></span></div>' +
      '<input type="range" class="bs-range" id="bs-ratio" min="30" max="70" step="10" value="' + pct + '" aria-label="' + esc(a.ratio) + '" style="--p:' + ((pct - 30) / 40 * 100) + '%;--a:' + esc(fl[0].accent) + ';--b:' + esc(fl[1].accent) + '"></div>';
    var it = a[prep];
    var body = prep === 'classic'
      ? mixMeter() + '<div class="bs-row">' + hold('stir', a.stir, 'redo', 'bs-btn--ghost') + '</div>'
      : '<div class="bs-layer">' + layerDiagram() + '<p>' + esc(a.layerNote) + '<br><span class="bs-layer__k"><i style="background:' + esc(fl[1].accent) + '"></i>' + esc(a.top) + ': ' + esc(fl[1].name) + '</span><span class="bs-layer__k"><i style="background:' + esc(fl[0].accent) + '"></i>' + esc(a.bottom) + ': ' + esc(fl[0].name) + '</span></p></div>';
    return {
      title: a.titleTwo, hint: prep === 'classic' && state.mixP < 1 ? a.hint : '',
      panel: seg('prep', [['classic', a.classic.name, 'blend'], ['layer', a.layer.name, 'layers']], prep) +
        note('info', '<b>' + esc(it.name) + '.</b> ' + esc(it.info)) + ratio + body + primary(a.cta)
    };
  }
  function mixMeter() {
    var p = Math.round(Math.min(1, state.mixP) * 100);
    return '<div class="bs-prog"><div class="bs-prog__top"><span>' + esc(A.mix.mixed) + '</span><b id="bs-mixp">' + (p >= 100 ? esc(A.mix.done) : p + '%') + '</b></div><div class="bs-prog__bar"><span id="bs-mixbar" style="transform:scaleX(' + (p / 100) + ')"></span></div></div>';
  }
  function setMix(p) {
    state.mixP = Math.min(1, Math.max(0, p));
    if (api) api.mixProgress(state.mixP, prepOf() === 'single');
    var t = $('bs-mixp'), b = $('bs-mixbar'), pc = Math.round(state.mixP * 100);
    if (t) t.textContent = pc >= 100 ? A.mix.done : pc + '%';
    if (b) b.style.transform = 'scaleX(' + state.mixP + ')';
    if (state.mixP >= 1) setHint('');
  }

  /* ------------------------------------------------------------------ */
  /* Korak 4: punjenje                                                   */
  /* ------------------------------------------------------------------ */

  function currentFlavor() {
    var fl = state.flavors;
    if (fl.length < 2) return fl[0];
    if (state.prep === 'layer') return state.amount < state.ratio ? fl[0] : fl[1];
    return fl[Math.random() < state.ratio ? 0 : 1];
  }
  function viewFill() {
    var a = A.fill, pk = packInfo(), leaf = leafOf();
    var marks = ['fluff', 'semi', 'dense', 'over'];
    var pos = pk.type === 'over' ? 92 : Math.min(72, state.density * 75);
    return {
      title: a.title, hint: state.amount < 0.3 ? a.hint : '',
      panel:
        '<div class="bs-stats">' + stat(a.type, a.types[pk.type], 'bs-ft') + stat(a.height, heightText(pk), 'bs-fh') + stat(a.grams, pk.grams + ' ' + A.fill.g, 'bs-fg') + '</div>' +
        '<div class="bs-meter"><div class="bs-meter__bar"><span id="bs-fm" style="left:' + pos + '%"></span></div><div class="bs-meter__lab">' + marks.map(function (m) { return '<span' + (m === pk.type ? ' class="is-on"' : '') + ' data-m="' + m + '">' + esc(a.types[m]) + '</span>'; }).join('') + '</div></div>' +
        '<div id="bs-fnote">' + fillNote(pk, leaf) + '</div>' +
        '<div class="bs-row">' + hold('pour', a.add, 'plus', 'bs-btn--ghost') + hold('press', a.press, 'tap', 'bs-btn--ghost') +
          '<button type="button" class="bs-ibtn bs-ibtn--line" data-act="empty" aria-label="' + esc(a.reset) + '">' + ic('redo') + '</button></div>' +
        '<button type="button" class="bs-switch" role="switch" aria-checked="' + state.holes + '" data-act="holes"><span class="bs-switch__t" aria-hidden="true"></span><span>' + esc(a.holes) + '</span><small>' + esc(a.holesSub) + '</small></button>' +
        primary(a.cta, state.amount >= 0.5)
    };
  }
  function heightText(pk) {
    var a = A.fill;
    return pk.mm < 0 ? fmt(a.below, { n: -pk.mm }) : pk.mm > 0 ? fmt(a.above, { n: pk.mm }) : a.level;
  }
  function fillNote(pk, leaf) {
    var a = A.fill;
    if (state.amount < 0.05) return note('tip', esc(leaf === 'dark' ? a.tipDark : a.tipLight));
    if (pk.spire) return note('warn', esc(a.spire), true);
    if (pk.type === 'over') return note('warn', esc(a.over), true);
    if (state.flavors.length > 1 && state.prep === 'layer') return note('layers', esc(fmt(a.layerNow, { name: currentFlavor().name })));
    return note('tip', esc(leaf === 'dark' ? a.tipDark : a.tipLight));
  }
  var fillRaf = 0;
  function fillChanged() {
    if (api) api.fill(state.amount, state.density, state.holes);
    if (fillRaf) return;
    fillRaf = requestAnimationFrame(function () {
      fillRaf = 0;
      if (state.step !== 4) return;
      var pk = packInfo(), a = A.fill;
      var set = function (id, v) { var e = $(id); if (e && e.textContent !== v) e.textContent = v; };
      set('bs-ft', a.types[pk.type]); set('bs-fh', heightText(pk)); set('bs-fg', pk.grams + ' ' + A.fill.g);
      var m = $('bs-fm'); if (m) m.style.left = (pk.type === 'over' ? 92 : Math.min(72, state.density * 75)) + '%';
      Array.prototype.forEach.call(el.panelIn.querySelectorAll('.bs-meter__lab span'), function (s) { s.classList.toggle('is-on', s.getAttribute('data-m') === pk.type); });
      var n = $('bs-fnote'), html = fillNote(pk, leafOf());
      if (n && n.innerHTML !== html) n.innerHTML = html;
      var next = el.panelIn.querySelector('[data-act=next]'); if (next) next.disabled = state.amount < 0.5;
      if (state.amount >= 0.3) setHint('');
    });
  }
  function pour(dt) {
    if (state.amount >= 1.25) { if (api) api.dropping(false); return; }
    state.amount = Math.min(1.25, state.amount + dt * 0.3);
    if (api) api.dropping(true, currentFlavor());
    fillChanged();
  }
  function press(dt) {
    if (state.amount < 0.15) return;
    state.density = Math.min(1, state.density + dt * 0.42);
    fillChanged();
  }

  /* ------------------------------------------------------------------ */
  /* Korak 5: folija ili HMD                                             */
  /* ------------------------------------------------------------------ */

  function pattern(id) {
    var out = [];
    if (id === 'rings') [[0.2, 8], [0.42, 16], [0.64, 24]].forEach(function (r) { for (var k = 0; k < r[1]; k++) { var a = k / r[1] * Math.PI * 2 + r[0] * 3; out.push([Math.cos(a) * r[0], Math.sin(a) * r[0]]); } });
    if (id === 'spiral') for (var i = 0; i < 40; i++) { var t = i / 39, a2 = t * Math.PI * 7, rr = 0.1 + t * 0.56; out.push([Math.cos(a2) * rr, Math.sin(a2) * rr]); }
    return out;
  }
  function viewCover() {
    var a = A.cover, c = state.cover || 'foil';
    var body;
    if (c === 'foil') {
      var n = state.foilHoles.length, warn = n && n < 15 ? note('warn', esc(a.fewHoles), true) : n > 70 ? note('warn', esc(a.manyHoles), true) : note('info', esc(a.foilInfo));
      body = chips('pattern', [['rings', a.patterns.rings, '48'], ['spiral', a.patterns.spiral, '40'], ['own', a.patterns.own, a.tap]], state.pattern) +
        '<div class="bs-holes"><span>' + esc(a.holes) + ': <b id="bs-hn">' + n + '</b></span><button type="button" class="bs-link" data-act="clearholes"><span>' + esc(a.clear) + '</span></button></div>' + '<div id="bs-cnote">' + warn + '</div>';
    } else {
      var v = Math.round(state.vents * 100);
      body = note('info', esc(a.hmdInfo)) +
        '<div class="bs-ratio"><div class="bs-ratio__top"><span>' + esc(a.vents) + '</span><b id="bs-vv">' + v + '%</b></div>' +
        '<input type="range" class="bs-range bs-range--heat" id="bs-vents" min="0" max="100" step="5" value="' + v + '" aria-label="' + esc(a.vents) + '" style="--p:' + v + '%">' +
        '<div class="bs-ratio__ends"><span>' + esc(a.less) + '</span><span>' + esc(a.more) + '</span></div></div>';
    }
    return {
      title: a.title, hint: c === 'foil' ? a.hint : '',
      panel: seg('cover', [['foil', a.foil, 'foil'], ['hmd', a.hmd, 'flame']], c) + body + primary(a.cta, c === 'hmd' || state.foilHoles.length > 0)
    };
  }
  function holesChanged() {
    if (api) api.foilHoles(state.foilHoles);
    var n = $('bs-hn'); if (n) n.textContent = state.foilHoles.length;
    var c = $('bs-cnote'), a = A.cover, k = state.foilHoles.length;
    if (c) c.innerHTML = k && k < 15 ? note('warn', esc(a.fewHoles), true) : k > 70 ? note('warn', esc(a.manyHoles), true) : note('info', esc(a.foilInfo));
    var next = el.panelIn.querySelector('[data-act=next]'); if (next) next.disabled = !k;
  }

  /* ------------------------------------------------------------------ */
  /* Korak 6: ugljevi                                                    */
  /* ------------------------------------------------------------------ */

  function maxCoals() { return state.cover === 'hmd' ? 3 : 4; }
  function autoCoals() {
    var n = state.coalN, r = state.cover === 'hmd' ? 0.42 : 0.6, out = [];
    for (var i = 0; i < n; i++) { var a = -Math.PI / 2 + i / n * Math.PI * 2 + (n === 2 ? Math.PI / 2 : 0); out.push([Math.cos(a) * r, Math.sin(a) * r]); }
    return out;
  }
  function viewCoals() {
    var a = A.coals, hmdC = state.cover === 'hmd';
    var counts = hmdC ? [[2, '2', a.soft], [3, '3', a.normal]] : [[2, '2', a.soft], [3, '3', a.normal], [4, '4', a.strong]];
    var left = state.coalN - state.coals.length;
    var msg = centerCoal() ? note('warn', esc(a.center), true) : left > 0 ? note('info', esc(fmt(a.left, { n: left }))) : note('check', esc(a.ready));
    return {
      title: a.title, hint: left > 0 ? (hmdC ? a.hintHmd : a.hint) : '',
      panel: '<p class="bs-label">' + esc(a.count) + '</p>' + chips('coaln', counts, state.coalN) + '<div id="bs-knote">' + msg + '</div>' +
        '<div class="bs-row"><button type="button" class="bs-btn bs-btn--ghost" data-act="autocoals">' + ic('flame') + '<span>' + esc(a.place) + '</span></button>' +
        '<button type="button" class="bs-ibtn bs-ibtn--line" data-act="clearcoals" aria-label="' + esc(a.clear) + '">' + ic('redo') + '</button></div>' +
        primary(a.cta, state.coals.length === state.coalN)
    };
  }
  function coalsChanged() {
    if (api) api.coals(snapshotState());
    if (state.step !== 6) return;
    var a = A.coals, left = state.coalN - state.coals.length, k = $('bs-knote');
    if (k) k.innerHTML = centerCoal() ? note('warn', esc(a.center), true) : left > 0 ? note('info', esc(fmt(a.left, { n: left }))) : note('check', esc(a.ready));
    var next = el.panelIn.querySelector('[data-act=next]'); if (next) next.disabled = state.coals.length !== state.coalN;
    if (!left) setHint('');
  }
  function placeCoal(x, z) {
    var r = Math.hypot(x, z), lim = state.cover === 'hmd' ? 0.62 : 0.74;
    if (r > lim) { x *= lim / r; z *= lim / r; }
    if (state.coals.length < state.coalN) state.coals = state.coals.concat([[x, z]]);
    else {
      // sve su na stolu: pomjeri najbliži ugalj na novo mjesto
      var best = 0, bd = 9;
      state.coals.forEach(function (c, i) { var d = Math.hypot(c[0] - x, c[1] - z); if (d < bd) { bd = d; best = i; } });
      state.coals = state.coals.map(function (c, i) { return i === best ? [x, z] : c; });
    }
    coalsChanged();
  }

  /* ------------------------------------------------------------------ */
  /* Korak 7: sesija                                                     */
  /* ------------------------------------------------------------------ */

  var sim = null, simTimer = 0;
  var SIM_SPEED = 2.6; // simuliranih minuta u jednoj sekundi
  function startSim() {
    stopSim();
    var pk = packInfo(), T = heatTarget();
    var minutes = Math.round((pk.grams / 14) * 46 * (1 + state.density * 0.25));
    sim = { t: 0, end: Math.max(25, Math.min(95, minutes)), lastRot: 0, rotates: 0, removed: 0, burn: 0, sumHeat: 0, sumSmoke: 0, n: 0, prompt: false, done: false, T: T, hot: 0, cold: 0, pk: pk };
    var last = performance.now();
    simTimer = setInterval(function () {
      var now = performance.now(), dt = Math.min(0.5, (now - last) / 1000); last = now;
      if (document.hidden) return;
      tickSim(dt * SIM_SPEED);
    }, 100);
  }
  function stopSim() { if (simTimer) clearInterval(simTimer); simTimer = 0; }
  function simHeat() {
    var s = sim, n = state.coals.length - s.removed;
    var h = coalHeat(Math.max(0, n));
    h *= Math.min(1, 0.35 + s.t / 6 * 0.65); // zagrijavanje prvih minuta
    h *= 1 + Math.min(0.25, 0.012 * (s.t - s.lastRot)); // ugljevi stoje na istom mjestu: vrela tačka raste
    if (s.pk.type === 'over') h += 0.12;
    return h;
  }
  function tickSim(dm) {
    var s = sim;
    if (!s || s.done) return;
    s.t = Math.min(s.end, s.t + dm);
    var h = simHeat(), rel = h / s.T;
    var air = state.cover === 'foil' ? (state.foilHoles.length < 15 ? 0.75 : 1) : 0.85 + state.vents * 0.25;
    var smoke = Math.max(0, Math.min(1.25, (rel - 0.45) / 0.55 * (0.85 + state.density * 0.25) * air));
    var burnRate = Math.max(0, rel - 1.12) * 0.07 + (s.pk.type === 'over' ? 0.006 : 0) + (centerCoal() ? 0.004 : 0);
    s.burn = Math.min(1, s.burn + burnRate * dm);
    if (rel > 1.12) s.hot += dm; if (rel < 0.8 && s.t > 6) s.cold += dm;
    s.sumHeat += rel * dm; s.sumSmoke += Math.min(1, smoke) * dm; s.n += dm;
    if (api) api.session({ on: true, heat: rel, smoke: Math.min(1, smoke), burn: s.burn });
    if (!s.prompt && s.t - s.lastRot > 15) { s.prompt = true; toast(A.smoke.rotateNow + ' ' + A.smoke.rotateText); }
    if (s.t >= s.end) { s.done = true; stopSim(); if (api) api.session({ on: false }); }
    updateSim(rel, smoke);
  }
  function updateSim(rel, smoke) {
    if (state.step !== 7) return;
    var s = sim, a = A.smoke;
    var set = function (id, v) { var e = $(id); if (e && e.textContent !== v) e.textContent = v; };
    set('bs-st', Math.round(s.t) + ' / ' + s.end + ' min');
    set('bs-sh', rel < 0.8 ? a.levels.low : rel > 1.12 ? a.levels.high : a.levels.ok);
    set('bs-ss', smoke < 0.35 ? a.smokeL.thin : smoke < 0.75 ? a.smokeL.ok : a.smokeL.thick);
    var g = $('bs-heat'); if (g) g.style.left = Math.max(2, Math.min(98, rel / 1.6 * 100)) + '%';
    var p = $('bs-sp'); if (p) p.style.transform = 'scaleX(' + (s.t / s.end) + ')';
    var st = $('bs-snote');
    if (st) {
      var html = s.done ? note('check', esc(a.end)) : s.burn > 0.35 ? note('warn', esc(a.burning), true) : rel > 1.12 ? note('warn', esc(a.hot), true) : rel < 0.8 && s.t > 6 ? note('info', esc(a.cold)) : s.prompt ? note('redo', '<b>' + esc(a.rotateNow) + '.</b> ' + esc(a.rotateText)) : note('smoke', esc(s.t < 6 ? a.warming : a.good));
      if (st.innerHTML !== html) st.innerHTML = html;
    }
    var rot = el.panelIn.querySelector('[data-act=rotate]'); if (rot) { rot.classList.toggle('is-pulse', s.prompt && !s.done); rot.disabled = s.done; }
    var rem = el.panelIn.querySelector('[data-act=removecoal]'); if (rem) rem.disabled = s.done || state.coals.length - s.removed <= 1;
    var nx = el.panelIn.querySelector('[data-act=next]'); if (nx) nx.hidden = !s.done;
    var fin = el.panelIn.querySelector('[data-act=finish]'); if (fin) fin.hidden = s.done;
  }
  function viewSmoke() {
    var a = A.smoke;
    return {
      title: a.title,
      panel: '<div class="bs-stats">' + stat(a.time, '0 min', 'bs-st') + stat(a.heat, '-', 'bs-sh') + stat(a.smoke, '-', 'bs-ss') + '</div>' +
        '<div class="bs-prog__bar bs-prog__bar--time"><span id="bs-sp"></span></div>' +
        '<div class="bs-meter bs-meter--heat"><div class="bs-meter__bar"><span id="bs-heat" style="left:2%"></span></div><div class="bs-meter__lab"><span>' + esc(a.levels.low) + '</span><span>' + esc(a.levels.ok) + '</span><span>' + esc(a.levels.high) + '</span></div></div>' +
        '<div id="bs-snote">' + note('smoke', esc(a.warming)) + '</div>' +
        '<div class="bs-row"><button type="button" class="bs-btn bs-btn--ghost" data-act="rotate">' + ic('redo') + '<span>' + esc(a.rotate) + '</span></button>' +
        '<button type="button" class="bs-btn bs-btn--ghost" data-act="removecoal">' + ic('x') + '<span>' + esc(a.remove) + '</span></button></div>' +
        '<button type="button" class="bs-btn bs-btn--primary" data-act="next" hidden><span>' + esc(a.result) + '</span>' + ic('next') + '</button>' +
        '<button type="button" class="bs-skip" data-act="finish">' + esc(a.finish) + '</button>'
    };
  }

  /* ------------------------------------------------------------------ */
  /* Korak 8: rezultat                                                   */
  /* ------------------------------------------------------------------ */

  function clamp10(v) { return Math.max(0, Math.min(10, v)); }
  function score() {
    var s = sim || { sumHeat: 0, sumSmoke: 0, n: 1, burn: 0, end: 0, hot: 0, cold: 0, rotates: 0, t: 0 }, pk = packInfo(), leaf = leafOf();
    var n = Math.max(1, s.n), avgHeat = s.sumHeat / n, avgSmoke = s.sumSmoke / n;
    var mismatch = (leaf === 'light' && pk.type === 'dense') || (leaf === 'dark' && pk.type === 'fluff');
    var unmixed = prepOf() !== 'layer' && state.mixP < 0.8 && prepOf() === 'classic';
    var r = {
      smoke: clamp10(avgSmoke * 10.5 - s.burn * 2),
      flavor: clamp10(10 - s.burn * 7 - (avgHeat < 0.8 ? 2.5 : 0) - (unmixed ? 1.5 : 0) - (pk.spire ? 1.5 : 0) - (mismatch ? 1 : 0)),
      time: clamp10((s.end - 20) / 50 * 10),
      burn: clamp10(10 - s.burn * 10)
    };
    var total = Math.round((r.smoke * 0.3 + r.flavor * 0.35 + r.time * 0.15 + r.burn * 0.2) * 10) / 10;
    // savjeti: najveći problemi prvi
    var tips = [];
    if (pk.spire) tips.push('spire');
    if (pk.type === 'over') tips.push('over');
    if (centerCoal()) tips.push('center');
    if (s.hot > 15 || s.burn > 0.25) tips.push('hot');
    if (s.cold > 10 || avgHeat < 0.8) tips.push('cold');
    if (!s.rotates && s.end > 30) tips.push('rotate');
    if (mismatch) tips.push(leaf === 'dark' ? 'darkFluff' : 'lightDense');
    if (state.cover === 'foil' && state.foilHoles.length < 15) tips.push('holes');
    if (unmixed) tips.push('unmixed');
    if (s.end < 35) tips.push('short');
    if (!tips.length) tips.push('great');
    return { r: r, total: total, tips: tips.slice(0, 2), minutes: Math.round(s.t || s.end), pk: pk };
  }
  var shot = '';
  function viewResult() {
    var a = A.result, sc = score(), fl = state.flavors;
    var name = fl.map(function (f) { return f.name; }).join(' + ');
    var cover = state.cover === 'hmd' ? A.cover.hmd : A.cover.foil + ' · ' + fmt(a.holesN, { n: state.foilHoles.length });
    var sub = [A.bowl.items[state.bowl].name, A.fill.types[sc.pk.type], cover, fmt(a.coalsN, { n: state.coals.length }), fmt(a.minutes, { n: sc.minutes })].join(' · ');
    var bars = ['smoke', 'flavor', 'time', 'burn'].map(function (k) {
      return '<div class="bs-bar"><span>' + esc(a.ratings[k]) + '</span><b>' + sc.r[k].toFixed(1) + '</b><i><em style="transform:scaleX(' + (sc.r[k] / 10) + ')"></em></i></div>';
    }).join('');
    var guide = V.url('guide');
    return {
      title: a.title, cls: 'is-result',
      panel:
        '<article class="bs-card" id="bs-card">' +
          '<div class="bs-card__ph"><img id="bs-shot" alt="" src="' + (shot || '/studio/poster-tall.webp') + '"><div class="bs-score"><b>' + sc.total.toFixed(1) + '</b><small>' + esc(a.score) + '</small></div></div>' +
          '<div class="bs-card__in"><p class="bs-card__eb">' + esc(a.eyebrow) + '</p><h3 class="bs-card__h">' + esc(name) + '</h3><p class="bs-card__sub">' + esc(sub) + '</p>' +
            '<div class="bs-bars">' + bars + '</div>' +
            sc.tips.map(function (t) { return note(t === 'great' ? 'check' : 'tip', esc(a.tips[t])); }).join('') +
            '<a class="bs-card__link" href="' + esc(guide) + '">' + esc(a.guide) + ic('next') + '</a>' +
          '</div>' +
          '<div class="bs-card__ft">' + V.studioMark() + '<span>my<b>shisha</b>pedia</span><small>myshishapedia.com</small></div>' +
        '</article>' +
        '<button type="button" class="bs-btn bs-btn--primary" data-act="share">' + ic('video') + '<span>' + esc(a.save) + '</span></button>' +
        '<div class="bs-row"><button type="button" class="bs-btn bs-btn--ghost" data-act="again">' + ic('redo') + '<span>' + esc(a.again) + '</span></button>' +
        '<a class="bs-btn bs-btn--ghost" href="' + esc(fl[0].url) + '"><span>' + esc(a.open) + '</span>' + ic('next') + '</a></div>'
    };
  }
  // kartica za dijeljenje (PNG 1080x1350)
  function cardImage() {
    var sc = score(), a = A.result, fl = state.flavors;
    var c = doc.createElement('canvas'); c.width = 1080; c.height = 1350;
    var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, 1350); g.addColorStop(0, '#22170f'); g.addColorStop(1, '#0d0907');
    x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
    return new Promise(function (res) {
      var img = new Image();
      img.onload = img.onerror = function () {
        if (img.naturalWidth) { x.save(); x.beginPath(); x.roundRect(90, 90, 900, 700, 44); x.clip(); var s = Math.max(900 / img.naturalWidth, 700 / img.naturalHeight); x.drawImage(img, 540 - img.naturalWidth * s / 2, 440 - img.naturalHeight * s / 2, img.naturalWidth * s, img.naturalHeight * s); x.restore(); }
        x.fillStyle = '#16100c'; x.beginPath(); x.arc(880, 760, 96, 0, 7); x.fill(); x.strokeStyle = '#f2a33c'; x.lineWidth = 8; x.stroke();
        x.textAlign = 'center'; x.fillStyle = '#f4ebdf'; x.font = '800 68px Syne, sans-serif'; x.fillText(sc.total.toFixed(1), 880, 782);
        x.textAlign = 'left'; x.fillStyle = '#f2a33c'; x.font = '800 30px Manrope, sans-serif'; x.fillText(a.eyebrow.toUpperCase(), 90, 900);
        x.fillStyle = '#f4ebdf'; x.font = '800 66px Syne, sans-serif'; x.fillText(fl.map(function (f) { return f.name; }).join(' + ').slice(0, 30), 90, 980);
        ['smoke', 'flavor', 'time', 'burn'].forEach(function (k, i) {
          var cx = 90 + (i % 2) * 460, cy = 1050 + Math.floor(i / 2) * 90;
          x.fillStyle = '#b4aa9e'; x.font = '700 28px Manrope, sans-serif'; x.fillText(a.ratings[k].toUpperCase(), cx, cy);
          x.fillStyle = 'rgba(255,255,255,.12)'; x.fillRect(cx, cy + 18, 400, 12); x.fillStyle = '#f2a33c'; x.fillRect(cx, cy + 18, 400 * sc.r[k] / 10, 12);
        });
        x.fillStyle = '#f4ebdf'; x.font = '400 40px Syne, sans-serif'; x.fillText('my', 90, 1290); var w = x.measureText('my').width;
        x.font = '800 40px Syne, sans-serif'; x.fillStyle = '#f2a33c'; x.fillText('shisha', 90 + w, 1290); w += x.measureText('shisha').width;
        x.font = '400 40px Syne, sans-serif'; x.fillStyle = '#f4ebdf'; x.fillText('pedia', 90 + w, 1290);
        x.textAlign = 'right'; x.fillStyle = '#b4aa9e'; x.font = '700 30px Manrope, sans-serif'; x.fillText('Bowl Studio', 990, 1290);
        c.toBlob(function (b) { res(b); }, 'image/png');
      };
      img.src = shot || '/studio/poster-tall.webp';
    });
  }
  function shareCard() {
    cardImage().then(function (blob) {
      if (!blob) return;
      var file;
      try { file = new File([blob], 'bowl-studio.png', { type: 'image/png' }); } catch (e) { file = null; }
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'Bowl Studio' }).catch(function () {});
        return;
      }
      var url = URL.createObjectURL(blob), link = doc.createElement('a');
      link.href = url; link.download = 'bowl-studio.png'; doc.body.appendChild(link); link.click(); link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      toast(A.result.saved);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Stanje za 3D i reset kasnijih koraka                                */
  /* ------------------------------------------------------------------ */

  function snapshotState() {
    return {
      bowl: state.bowl, flavors: state.flavors, prep: prepOf(), ratio: state.flavors.length > 1 ? state.ratio : 1, mixP: state.mixP,
      amount: state.amount, density: state.density, holes: state.holes, cover: state.cover, foilHoles: state.foilHoles, vents: state.vents, coals: state.coals
    };
  }
  function resetFrom(n) {
    if (n <= 3) state.mixP = 0;
    if (n <= 4) { state.amount = 0; state.density = 0; state.holes = false; }
    if (n <= 5) { state.cover = 'foil'; state.pattern = 'rings'; state.foilHoles = pattern('rings'); state.vents = 0.5; }
    if (n <= 6) { state.coals = []; state.coalN = 3; }
    sim = null; shot = '';
  }

  resetFrom(3);

  var VIEWS = [viewIntro, viewBowl, viewFlavor, viewMix, viewFill, viewCover, viewCoals, viewSmoke, viewResult];
  var NAMES3D = ['intro', 'bowl', 'flavor', 'mix', 'fill', 'cover', 'coals', 'smoke', 'result'];

  /* ------------------------------------------------------------------ */
  /* Iscrtavanje koraka                                                  */
  /* ------------------------------------------------------------------ */

  var swapTimer = 0, hintTimer = 0;
  function render(instant) {
    var s = state.step, v = VIEWS[Math.min(s, VIEWS.length - 1)]();
    root.setAttribute('data-step', String(s));
    root.classList.toggle('is-intro', s === 0);
    root.classList.toggle('is-result', s === 8);
    enter(s);
    // traka koraka
    Array.prototype.forEach.call(el.steps.children, function (li) {
      var i = +li.getAttribute('data-i');
      li.className = 'bs__seg' + (i < s ? ' is-done' : i === s ? ' is-on' : '');
      if (i === s) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    el.back.hidden = s === 0;
    var eyebrow = s > 0 ? fmt(A.stepOf, { n: s, t: TOTAL }) + ' · ' + A.names[s - 1] : '';
    var apply = function () {
      el.eyebrow.textContent = eyebrow;
      el.title.textContent = v.title;
      el.lead.textContent = v.lead || '';
      el.lead.hidden = !v.lead;
      el.panelIn.innerHTML = v.panel;
      setHint(v.hint);
      root.classList.remove('is-swapping');
      measure();
    };
    clearTimeout(swapTimer);
    if (instant || reduce) { apply(); return; }
    root.classList.add('is-swapping');
    swapTimer = setTimeout(apply, 150);
  }

  function setHint(text) {
    clearTimeout(hintTimer);
    if (!text) { el.hint.classList.remove('is-on'); hintTimer = setTimeout(function () { el.hint.hidden = true; }, 200); return; }
    el.hint.innerHTML = ic('tap') + '<span>' + esc(text) + '</span>';
    el.hint.hidden = false;
    hintTimer = setTimeout(function () { el.hint.classList.add('is-on'); }, 30);
  }

  function sync(first) {
    if (!api) return;
    var s = state.step, S = snapshotState();
    S.first = first;
    api.step(NAMES3D[s], S);
    if (s === 8) takeShot();
  }
  // ulaz u korak: sesija radi samo u koraku 7, rezultat dobije snimak glave odozgo
  function enter(s) {
    if (s !== 7) stopSim();
    if (s === 7 && state.step === 7) setTimeout(function () { if (state.step === 7 && isOpen) { startSim(); } }, reduce ? 0 : 900);
    if (s === 8 && sim && !sim.done) { while (!sim.done) tickSim(1); }
    if (s === 8 && !sim) { startSim(); stopSim(); while (!sim.done) tickSim(1); }
  }
  function takeShot() {
    setTimeout(function () {
      if (!api || state.step !== 8) return;
      shot = api.snapshot(720) || shot;
      var im = $('bs-shot'); if (im && shot) im.src = shot;
    }, reduce ? 50 : 1200);
  }

  /* dio ekrana koji pokrivaju natpisi i panel, da 3D kamera centrira predmet u slobodnom dijelu */
  var measureRaf = 0;
  function measure() {
    if (measureRaf) return;
    measureRaf = requestAnimationFrame(function () {
      measureRaf = 0;
      if (!isOpen) return;
      var W = root.clientWidth, H = root.clientHeight;
      var top = el.top.getBoundingClientRect(), p = el.panel.getBoundingClientRect();
      var side = p.width < W * 0.6 && p.left > W * 0.4;
      var hintH = el.hint.hidden ? 0 : el.hint.offsetHeight + 12;
      var o = side ? { top: top.bottom, bottom: 0, left: 0, right: W - p.left + 8 } : { top: top.bottom, bottom: Math.max(0, H - p.top) + hintH, left: 0, right: 0 };
      root.style.setProperty('--bs-panel-h', Math.round(side ? 0 : H - p.top) + 'px');
      root.style.setProperty('--bs-top-h', Math.round(top.bottom) + 'px');
      if (api) api.insets(o);
    });
  }
  var ro = 'ResizeObserver' in window ? new ResizeObserver(measure) : null;

  /* ------------------------------------------------------------------ */
  /* Koraci i historija                                                  */
  /* ------------------------------------------------------------------ */

  function go(n) {
    n = Math.max(0, Math.min(LAST_READY, n));
    if (n === state.step) return;
    state.step = n;
    depth++;
    try { history.pushState({ bs: n, d: depth }, '', location.href); } catch (e) { /* bez historije */ }
    render();
    sync();
  }
  function back() {
    if (state.step === 0) return requestClose();
    history.back();
  }
  function requestClose() {
    if (depth > 0) history.go(-depth); else closeNow();
  }
  window.addEventListener('popstate', function (e) {
    if (!isOpen) return;
    var s = e.state;
    if (s && typeof s.bs === 'number') {
      depth = s.d || 0;
      if (s.sheet) return; // naprijed na sloj pretrage: ne otvaramo ga ponovo
      var sheetWasOpen = !el.sheet.hidden;
      closeSheet();
      if (s.bs === state.step && sheetWasOpen) return;
      state.step = s.bs;
      render();
      sync();
    } else {
      depth = 0;
      closeNow();
    }
  });

  /* ------------------------------------------------------------------ */
  /* Panel: klikovi                                                      */
  /* ------------------------------------------------------------------ */

  el.panelIn.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b || !el.panelIn.contains(b)) return;
    var act = b.getAttribute('data-act');
    if (act === 'next') go(state.step + 1);
    else if (act === 'back') back();
    else if (act === 'bowl') pickBowl(b.getAttribute('data-id'));
    else if (act === 'pick') openSheet(+b.getAttribute('data-slot'));
    else if (act === 'remove') { state.flavors = state.flavors.slice(0, 1); resetFrom(3); render(true); sync(); }
    else if (act === 'prep') { if (state.prep !== b.getAttribute('data-id')) { state.prep = b.getAttribute('data-id'); resetFrom(3); refresh(); } }
    else if (act === 'empty') { state.amount = 0; state.density = 0; fillChanged(); refresh(); }
    else if (act === 'holes') { state.holes = !state.holes; b.setAttribute('aria-checked', String(state.holes)); fillChanged(); }
    else if (act === 'cover') { state.cover = b.getAttribute('data-id'); state.coals = []; state.coalN = Math.min(state.coalN, maxCoals()); refresh(); }
    else if (act === 'pattern') { state.pattern = b.getAttribute('data-id'); state.foilHoles = pattern(state.pattern); holesChanged(); refresh(true); }
    else if (act === 'clearholes') { state.pattern = 'own'; state.foilHoles = []; holesChanged(); refresh(true); }
    else if (act === 'coaln') { state.coalN = +b.getAttribute('data-id'); state.coals = state.coals.slice(0, state.coalN); coalsChanged(); refresh(true); }
    else if (act === 'autocoals') { state.coals = autoCoals(); coalsChanged(); }
    else if (act === 'clearcoals') { state.coals = []; coalsChanged(); }
    else if (act === 'rotate') { if (sim && !sim.done) { sim.lastRot = sim.t; sim.rotates++; sim.prompt = false; if (api) api.rotateCoals(); } }
    else if (act === 'removecoal') { if (sim && !sim.done && state.coals.length - sim.removed > 1) sim.removed++; }
    else if (act === 'finish') { if (sim) { while (!sim.done) tickSim(1); } }
    else if (act === 'share') shareCard();
    else if (act === 'again') again();
  });
  // klizači (omjer, otvori na HMD-u)
  el.panelIn.addEventListener('input', function (e) {
    var t = e.target;
    if (t.id === 'bs-ratio') {
      state.ratio = +t.value / 100; resetFrom(3);
      t.style.setProperty('--p', ((+t.value - 30) / 40 * 100) + '%');
      var ra = $('bs-ra'), rb = $('bs-rb'); if (ra) ra.textContent = t.value + '%'; if (rb) rb.textContent = (100 - t.value) + '%';
      var lay = el.panelIn.querySelector('.bs-layers'); if (lay) lay.outerHTML = layerDiagram();
      setMix(0);
      if (api) api.step('mix', snapshotState());
    } else if (t.id === 'bs-vents') {
      state.vents = +t.value / 100; t.style.setProperty('--p', t.value + '%');
      var vv = $('bs-vv'); if (vv) vv.textContent = t.value + '%';
      if (api) api.vents(state.vents);
    }
  });
  // osvježi panel istog koraka (bez prelaza)
  function refresh(keepScroll) {
    var y = el.panelIn.scrollTop, v = VIEWS[state.step]();
    el.panelIn.innerHTML = v.panel;
    if (keepScroll) el.panelIn.scrollTop = y;
    setHint(v.hint);
    measure();
    if (api && (state.step === 3 || state.step === 5 || state.step === 6)) api.step(NAMES3D[state.step], snapshotState());
  }
  function again() {
    resetFrom(3);
    var back = state.step - 1;
    if (back > 0 && depth > back) history.go(-back); else { state.step = 1; render(); sync(); }
  }

  /* dugmad koja rade dok ih držiš (sipaj, sabij, promiješaj) */
  var holdAct = null, holdRaf = 0, holdLast = 0, holdBtn = null;
  function holdStep(t) {
    if (!holdAct) return;
    var dt = holdLast ? Math.min(2, (t - holdLast) / 1000) : 0.016; holdLast = t;
    if (holdAct === 'pour') pour(dt);
    else if (holdAct === 'press') press(dt);
    else if (holdAct === 'stir') setMix(state.mixP + dt * 0.45);
    holdRaf = requestAnimationFrame(holdStep);
  }
  function holdStart(act, b) {
    holdEnd();
    holdAct = act; holdBtn = b; holdLast = 0;
    if (b) b.classList.add('is-held');
    holdRaf = requestAnimationFrame(holdStep);
  }
  function holdEnd() {
    if (!holdAct) return;
    if (holdAct === 'pour' && api) api.dropping(false);
    holdAct = null;
    cancelAnimationFrame(holdRaf);
    if (holdBtn) holdBtn.classList.remove('is-held');
    holdBtn = null;
  }
  el.panelIn.addEventListener('pointerdown', function (e) {
    var b = e.target.closest('[data-hold]');
    if (!b) return;
    e.preventDefault();
    try { b.setPointerCapture(e.pointerId); } catch (err) { /* stariji preglednici */ }
    holdStart(b.getAttribute('data-hold'), b);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(function (ev) { el.panelIn.addEventListener(ev, holdEnd); });
  el.panelIn.addEventListener('contextmenu', function (e) { if (e.target.closest('[data-hold]')) e.preventDefault(); });
  el.panelIn.addEventListener('keydown', function (e) {
    var b = e.target.closest('[data-hold]');
    if (b && (e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); holdStart(b.getAttribute('data-hold'), b); }
  });
  el.panelIn.addEventListener('keyup', function (e) { if (e.target.closest('[data-hold]') && (e.key === ' ' || e.key === 'Enter')) holdEnd(); });

  /* dodir na 3D stolu: miješanje (kruženje), sipanje preko glave, rupice u foliji, ugljevi */
  var drag = null;
  el.stage.addEventListener('pointerdown', function (e) {
    drag = { x: e.clientX, y: e.clientY, moved: 0, id: e.pointerId };
    if (state.step === 4 && api) { var h = api.hit(e.clientX, e.clientY); if (h && h.kind === 'bowl') { drag.pour = true; holdStart('pour', null); } }
  });
  el.stage.addEventListener('pointermove', function (e) {
    if (!drag || drag.id !== e.pointerId) return;
    var d = Math.hypot(e.clientX - drag.x, e.clientY - drag.y);
    drag.moved += d; drag.x = e.clientX; drag.y = e.clientY;
    if (state.step === 3 && prepOf() !== 'layer' && d > 0) setMix(state.mixP + d / (Math.min(root.clientWidth, root.clientHeight) * 3.2));
    if (state.step === 4 && api && drag.moved > 4) {
      var h = api.hit(e.clientX, e.clientY), on = !!(h && h.kind === 'bowl');
      if (on && !drag.pour) { drag.pour = true; holdStart('pour', null); } else if (!on && drag.pour) { drag.pour = false; holdEnd(); }
    }
  });
  function stageUp(e) {
    if (!drag) return;
    var tap = drag.moved < 10, dr = drag;
    drag = null;
    if (dr.pour) holdEnd();
    if (!tap || !api || e.type !== 'pointerup') return;
    var h = api.hit(e.clientX, e.clientY);
    if (!h) return;
    if (state.step === 5 && state.cover === 'foil' && h.kind === 'foil') {
      var r = Math.hypot(h.x, h.z);
      if (r > 0.8 || state.foilHoles.some(function (p) { return Math.hypot(p[0] - h.x, p[1] - h.z) < 0.035; })) return;
      if (state.pattern !== 'own') { state.pattern = 'own'; refresh(true); }
      state.foilHoles = state.foilHoles.concat([[h.x, h.z]]);
      holesChanged();
      setHint('');
    } else if (state.step === 6 && (h.kind === 'foil' || h.kind === 'hmd')) placeCoal(h.x, h.z);
  }
  el.stage.addEventListener('pointerup', stageUp);
  el.stage.addEventListener('pointercancel', stageUp);
  // strelice u izboru glave (radio grupa)
  el.panelIn.addEventListener('keydown', function (e) {
    var b = e.target.closest('.bs-choice');
    if (!b || ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(e.key) === -1) return;
    e.preventDefault();
    var i = BOWLS.indexOf(state.bowl) + (e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 1);
    pickBowl(BOWLS[(i + BOWLS.length) % BOWLS.length], true);
  });

  function pickBowl(id, focus) {
    if (BOWLS.indexOf(id) === -1) return;
    hintSeen = true;
    if (id !== state.bowl) {
      state.bowl = id;
      resetFrom(3);
      if (api) api.step('bowl', { bowl: id });
    }
    // samo osvježi panel, bez prelaza (dugmad ostaju pod prstom)
    var v = viewBowl();
    el.panelIn.innerHTML = v.panel;
    setHint('');
    if (focus) { var on = el.panelIn.querySelector('.bs-choice.is-on'); if (on) on.focus(); }
    measure();
  }

  /* ------------------------------------------------------------------ */
  /* Izbor okusa (sloj sa pretragom)                                     */
  /* ------------------------------------------------------------------ */

  var sheetSlot = 0, sheetFocusBack = null, qTimer = 0;
  function openSheet(slot) {
    sheetSlot = slot;
    sheetFocusBack = doc.activeElement;
    el.sheetH.textContent = slot > 0 ? A.flavor.pickSecond : A.flavor.pick;
    el.q.value = '';
    listResults('');
    el.sheet.hidden = false;
    depth++;
    try { history.pushState({ bs: state.step, d: depth, sheet: true }, '', location.href); } catch (e) { depth--; }
    fitSheet();
    requestAnimationFrame(function () { el.sheet.classList.add('is-on'); });
    // na telefonu tastatura iskoči odmah samo ako je fokus u istom dodiru
    try { el.q.focus({ preventScroll: true }); } catch (e) { el.q.focus(); }
  }
  // zatvori sloj kroz historiju (isti put kao dugme nazad na telefonu)
  function dismissSheet() {
    if (el.sheet.hidden) return;
    if (history.state && history.state.sheet) history.back(); else closeSheet();
  }
  function closeSheet(instant) {
    if (el.sheet.hidden) return;
    el.sheet.classList.remove('is-on');
    var done = function () { el.sheet.hidden = true; };
    if (instant || reduce) done(); else setTimeout(done, 220);
    if (sheetFocusBack && sheetFocusBack.focus && doc.contains(sheetFocusBack)) sheetFocusBack.focus({ preventScroll: true });
  }
  function listResults(q) {
    var found = find(q), list = found || POPULAR.map(function (id) { return flavorInfo(BY_ID[id]); });
    var taken = state.flavors.map(function (f, i) { return i === sheetSlot ? '' : f.id; });
    list = list.filter(function (f) { return taken.indexOf(f.id) === -1; });
    el.sheetLabel.textContent = found ? A.flavor.results + ' · ' + list.length : A.flavor.popular;
    if (!list.length) { el.res.innerHTML = '<li class="bs-res__none">' + esc(A.flavor.none) + '</li>'; return; }
    var cur = state.flavors[sheetSlot] && state.flavors[sheetSlot].id;
    el.res.innerHTML = list.map(function (f) {
      return '<li role="presentation"><button type="button" class="bs-res__it' + (f.id === cur ? ' is-on' : '') + '" role="option" aria-selected="' + (f.id === cur) + '" data-id="' + esc(f.id) + '">' +
        swatch(f) + '<span class="bs-res__txt"><b>' + esc(f.name) + '</b><span>' + esc(f.brand) + ' · ' + esc(A.flavor.leaf[f.leaf]) + '</span></span>' + (f.id === cur ? ic('check', 'bs-res__ok') : '') + '</button></li>';
    }).join('');
  }
  el.q.addEventListener('input', function () {
    clearTimeout(qTimer);
    qTimer = setTimeout(function () { listResults(el.q.value); el.res.scrollTop = 0; }, 90);
  });
  el.q.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); var first = el.res.querySelector('.bs-res__it'); if (first) first.click(); }
    if (e.key === 'ArrowDown') { e.preventDefault(); var f = el.res.querySelector('.bs-res__it'); if (f) f.focus(); }
  });
  el.res.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    var items = Array.prototype.slice.call(el.res.querySelectorAll('.bs-res__it')), i = items.indexOf(doc.activeElement);
    if (i === -1) return;
    e.preventDefault();
    if (e.key === 'ArrowUp' && i === 0) { el.q.focus(); return; }
    var n = items[Math.max(0, Math.min(items.length - 1, i + (e.key === 'ArrowDown' ? 1 : -1)))];
    if (n) n.focus();
  });
  el.res.addEventListener('click', function (e) {
    var b = e.target.closest('.bs-res__it');
    if (!b) return;
    var f = BY_ID[b.getAttribute('data-id')];
    if (!f) return;
    var next = state.flavors.slice();
    next[sheetSlot] = flavorInfo(f);
    state.flavors = next.filter(Boolean).slice(0, 2);
    resetFrom(3);
    dismissSheet();
    render(true);
    sync();
  });
  el.sheetX.addEventListener('click', dismissSheet);
  el.sheet.addEventListener('click', function (e) { if (e.target === el.sheet) dismissSheet(); });
  // tastatura na telefonu smanji vidljivi dio ekrana: sloj prati vidljivi dio
  function fitSheet() {
    var vv = window.visualViewport;
    if (!vv) return;
    el.sheet.style.setProperty('--vv-h', Math.round(vv.height) + 'px');
    el.sheet.style.setProperty('--vv-top', Math.round(vv.offsetTop) + 'px');
  }
  if (window.visualViewport) { window.visualViewport.addEventListener('resize', function () { if (!el.sheet.hidden) fitSheet(); }); window.visualViewport.addEventListener('scroll', function () { if (!el.sheet.hidden) fitSheet(); }); }

  /* ------------------------------------------------------------------ */
  /* 3D                                                                  */
  /* ------------------------------------------------------------------ */

  function load3d() {
    var src = doc.body.getAttribute('data-bs3d');
    if (api || loadingApi || !src) { if (!src) failed('webgl'); return; }
    if (!hasWebGL()) { failed('webgl'); return; }
    loadingApi = true;
    root.classList.add('is-loading');
    import(src).then(function (m) {
      loadingApi = false;
      if (!isOpen) return;
      api = m.mount(el.stage, {
        modelUrl: doc.body.getAttribute('data-bs-model'),
        reduced: reduce,
        onReady: function () { root.classList.remove('is-loading'); root.classList.add('is-3d'); measure(); sync(firstIntro); firstIntro = false; },
        onPick: function (id) { if (state.step === 1) pickBowl(id); },
        onError: failed
      });
      measure();
    }).catch(function () { loadingApi = false; failed('webgl'); });
  }
  function hasWebGL() {
    try { var c = doc.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
  }
  function failed(kind) {
    root.classList.remove('is-loading', 'is-3d');
    root.classList.add('is-flat');
    if (api) { try { api.destroy(); } catch (e) { /* već ugašeno */ } api = null; }
    toast(kind === 'lost' ? A.errLost : A.err);
  }
  var toastEl = null, toastTimer = 0;
  function toast(msg) {
    if (!toastEl) { toastEl = doc.createElement('p'); toastEl.className = 'bs-toast'; toastEl.setAttribute('role', 'status'); root.appendChild(toastEl); }
    toastEl.innerHTML = ic('info') + '<span>' + esc(msg) + '</span>';
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-on'); }, 5200);
  }

  /* ------------------------------------------------------------------ */
  /* Otvaranje i zatvaranje                                              */
  /* ------------------------------------------------------------------ */

  function open(e) {
    if (isOpen) return;
    isOpen = true;
    opener = e && e.currentTarget;
    state.step = 0;
    depth = 1;
    try { history.pushState({ bs: 0, d: 1 }, '', location.href); } catch (err) { depth = 0; }
    doc.documentElement.classList.add('bs-open');
    root.hidden = false;
    root.classList.remove('is-closing', 'is-flat');
    render(true);
    requestAnimationFrame(function () { root.classList.add('is-on'); });
    if (ro) { ro.observe(el.panel); ro.observe(el.top); ro.observe(root); }
    load3d();
    el.title.focus({ preventScroll: true });
  }
  function closeNow() {
    if (!isOpen) return;
    isOpen = false;
    closeSheet(true);
    stopSim();
    holdEnd();
    root.classList.remove('is-on');
    root.classList.add('is-closing');
    if (ro) ro.disconnect();
    var done = function () {
      root.hidden = true;
      root.classList.remove('is-closing', 'is-loading', 'is-3d');
      doc.documentElement.classList.remove('bs-open');
      if (api) { api.destroy(); api = null; }
      firstIntro = true;
      if (opener && opener.focus) opener.focus({ preventScroll: true });
    };
    if (reduce) done(); else setTimeout(done, 240);
  }

  el.back.addEventListener('click', back);
  el.close.addEventListener('click', requestClose);

  // tastatura: Esc zatvara (prvo sloj sa pretragom), Tab ostaje unutar studija
  root.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { e.preventDefault(); if (!el.sheet.hidden) dismissSheet(); else requestClose(); return; }
    if (e.key !== 'Tab') return;
    var scope = el.sheet.hidden ? root : el.sheet;
    var items = Array.prototype.filter.call(scope.querySelectorAll('button, input, [tabindex="0"]'), function (x) { return !x.disabled && x.offsetParent !== null && !x.closest('[hidden]'); });
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // slika stola dok se 3D učitava (ili umjesto 3D-a)
  el.poster.style.backgroundImage = 'url(/studio/poster-tall.webp)';

  Array.prototype.forEach.call(doc.querySelectorAll('[data-bs-open]'), function (b) {
    b.disabled = false;
    b.addEventListener('click', open);
  });
  // unaprijed preuzmi 3D kad prst/miš krene ka dugmetu (brže otvaranje)
  var warmed = false;
  function warm() {
    if (warmed) return;
    warmed = true;
    var src = doc.body.getAttribute('data-bs3d');
    if (!src || !hasWebGL()) return;
    var l = doc.createElement('link'); l.rel = 'modulepreload'; l.href = src; doc.head.appendChild(l);
    var m = doc.createElement('link'); m.rel = 'preload'; m.as = 'fetch'; m.crossOrigin = 'anonymous'; m.href = doc.body.getAttribute('data-bs-model'); doc.head.appendChild(m);
  }
  Array.prototype.forEach.call(doc.querySelectorAll('[data-bs-open]'), function (b) {
    b.addEventListener('pointerenter', warm, { once: true });
    b.addEventListener('touchstart', warm, { once: true, passive: true });
    b.addEventListener('focus', warm, { once: true });
  });
})();
