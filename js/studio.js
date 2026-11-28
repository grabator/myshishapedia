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
    prep: 'mix', shares: [100], shareSel: 0, pick: 0, mixP: 0, fill: { A: 0, d: 0, uneven: 0, touch: 0, spire: false }, holes: false,
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
      cap: '<b>' + esc(it.name) + '.</b> ' + esc(it.info),
      panel: tb('<div class="bs-choices" role="radiogroup" aria-label="' + esc(a.title) + '">' + BOWLS.map(function (id) {
          var x = a.items[id], on = id === state.bowl;
          return '<button type="button" class="bs-choice' + (on ? ' is-on' : '') + '" role="radio" aria-checked="' + on + '" data-act="bowl" data-id="' + id + '">' +
            ic(id, 'bs-choice__ic') + '<span class="bs-choice__name">' + esc(x.name) + '</span></button>';
        }).join('') + '</div>', a.cta)
    };
  }

  function flavorChip(f, i) {
    var a = A.flavor, n = state.flavors.length;
    return '<div class="bs-fchip">' +
      '<button type="button" class="bs-fchip__b" data-act="pick" data-slot="' + i + '" aria-label="' + esc(a.change + ': ' + f.name) + '">' + swatch(f) +
        '<span class="bs-fchip__t"><b>' + esc(f.name) + '</b><small>' + esc(f.brand) + ' · ' + esc(a.leaf[f.leaf]) + '</small></span></button>' +
      (n > 1 ? '<button type="button" class="bs-fchip__x" data-act="remove" data-slot="' + i + '" aria-label="' + esc(a.remove) + '">' + ic('x') + '</button>' : '') +
    '</div>';
  }

  function viewFlavor() {
    var a = A.flavor, fl = state.flavors, n = fl.length;
    var leaves = fl.map(function (f) { return f.leaf; }), mixedLeaf = leaves.indexOf('dark') !== -1 && leaves.indexOf('light') !== -1;
    return {
      title: n > 1 ? a.titleMix : a.title,
      cap: n > 1 ? (mixedLeaf ? '<span class="bs-warn">' + esc(a.mixedLeaf) + '</span>' : esc(a.sameLeaf)) : esc(a.max),
      panel: '<div class="bs-fchips">' + fl.map(flavorChip).join('') +
        (n < 4 ? '<button type="button" class="bs-fadd" data-act="pick" data-slot="' + n + '" aria-label="' + esc(a.add) + '">' + ic('plus') + '<span>' + esc(a.addShort) + '</span></button>' : '') + '</div>' +
        tb('', a.cta)
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
    var I = INNER[state.bowl], F = state.fill, A2 = F.A, d = F.d;
    var top = I.floor + A2 * (I.rim - I.floor) * (1 - 0.36 * d);
    var mm = Math.round((top - I.rim) * 10);
    var over = mm > 1 || F.touch > 0.15;
    var type = over ? 'over' : d < 0.25 ? 'fluff' : d < 0.6 ? 'semi' : 'dense';
    return { top: top, mm: mm, type: type, grams: Math.round(A2 * I.g * (1 + d * 0.55)), spire: F.spire || (!!I.spire && top > I.spire + 0.05), uneven: F.uneven > 0.22 && A2 > 0.25 };
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
  function hold(act, label, icon, cls, prog) {
    return '<button type="button" class="bs-btn bs-hold' + (cls ? ' ' + cls : '') + '" data-hold="' + act + '">' + ic(icon) + '<span>' + esc(label) + '</span>' +
      (prog != null ? '<small class="bs-hold__pct">' + Math.round(prog * 100) + '%</small>' : '') +
      '<i class="bs-hold__fill" aria-hidden="true"' + (prog != null ? ' style="transform:scaleX(' + prog + ');transition:none"' : '') + '></i></button>';
  }
  // donja traka: kontrole lijevo, dugme dalje desno
  function tb(controls, label, enabled) {
    return '<div class="bs-tb"><div class="bs-tb__c">' + controls + '</div>' +
      '<button type="button" class="bs-next" data-act="next"' + (enabled === false ? ' disabled' : '') + ' aria-label="' + esc(label) + '"><span>' + esc(A.next) + '</span>' + ic('next') + '</button></div>';
  }
  function setCap(html) {
    var c = $('bs-cap');
    if (c && c.innerHTML !== html) c.innerHTML = html;
  }
  function primary(label, enabled, act) {
    return '<button type="button" class="bs-btn bs-btn--primary" data-act="' + (act || 'next') + '"' + (enabled === false ? ' disabled' : '') + '><span>' + esc(label) + '</span>' + ic('next') + '</button>';
  }

  /* ------------------------------------------------------------------ */
  /* Korak 3: miješanje                                                  */
  /* ------------------------------------------------------------------ */

  function sharesBar() {
    var fl = state.flavors, a = A.mix;
    return '<div class="bs-shares" role="group" aria-label="' + esc(a.ratio) + '">' +
      '<div class="bs-shares__bar">' + fl.map(function (f, i) {
        return '<button type="button" class="bs-shares__seg' + (i === state.shareSel ? ' is-on' : '') + '" data-act="sharesel" data-i="' + i + '" style="flex:' + state.shares[i] + ';--c:' + esc(f.accent) + '" aria-label="' + esc(f.name + ' ' + state.shares[i] + '%') + '"><span>' + state.shares[i] + '%</span></button>';
      }).join('') + '</div>' +
      '<div class="bs-shares__ctl"><span class="bs-shares__name"><i style="background:' + esc(fl[state.shareSel].accent) + '"></i>' + esc(fl[state.shareSel].name) + '</span>' +
        '<button type="button" class="bs-ibtn bs-ibtn--sm bs-ibtn--line2" data-act="shareminus" aria-label="-5%">' + ic('minus') + '</button>' +
        '<button type="button" class="bs-ibtn bs-ibtn--sm bs-ibtn--line2" data-act="shareplus" aria-label="+5%">' + ic('plus') + '</button></div>' +
    '</div>';
  }
  function setShare(i, delta) {
    var sh = state.shares.slice(), n = sh.length;
    if (delta > 0) {
      var j = -1; sh.forEach(function (v, k) { if (k !== i && v > 10 && (j === -1 || v > sh[j])) j = k; });
      if (j === -1) return; sh[i] += 5; sh[j] -= 5;
    } else {
      if (sh[i] <= 10) return;
      var m = -1; sh.forEach(function (v, k) { if (k !== i && (m === -1 || v < sh[m])) m = k; });
      sh[i] -= 5; sh[m] += 5;
    }
    if (n) state.shares = sh;
  }
  function viewMix() {
    var a = A.mix, prep = prepOf();
    var stir = hold('stir', a.stir, 'fork', 'bs-btn--ghost bs-btn--sm', state.mixP);
    if (prep === 'single') {
      return { title: a.titleSingle, hint: state.mixP < 1 ? a.hintTin : '', cap: esc(a.single), panel: tb(stir, a.cta) };
    }
    var it = prep === 'mix' ? a.mixInfo : a.noneInfo;
    return {
      title: a.titleTwo, hint: prep === 'mix' && state.mixP < 1 ? a.hint : '',
      cap: esc(it),
      panel: seg('prep', [['mix', a.modeMix, 'fork'], ['none', a.modeNone, 'layers']], prep) + sharesBar() +
        tb(prep === 'mix' ? stir : '', a.cta)
    };
  }
  function mixMeter() { return ''; }
  function setMix(p) {
    state.mixP = Math.min(1, Math.max(0, p));
    var b = el.panelIn.querySelector('[data-hold=stir] .bs-hold__fill'); if (b) b.style.transform = 'scaleX(' + state.mixP + ')';
    var t = el.panelIn.querySelector('[data-hold=stir] .bs-hold__pct'); if (t) t.textContent = Math.round(state.mixP * 100) + '%';
    if (state.mixP >= 1) setHint('');
  }

  /* ------------------------------------------------------------------ */
  /* Korak 4: punjenje                                                   */
  /* ------------------------------------------------------------------ */

  function currentFlavor() { return state.flavors[Math.min(state.pick, state.flavors.length - 1)]; }
  function viewFill() {
    var a = A.fill, fl = state.flavors, mixing = prepOf() === 'mix';
    var chipsRow = fl.length > 1 ? '<div class="bs-pick" role="radiogroup" aria-label="' + esc(a.pickLabel) + '">' + (mixing
      ? '<span class="bs-pick__c is-on is-mix">' + fl.map(function (f) { return '<i style="background:' + esc(f.accent) + '"></i>'; }).join('') + '<b>' + esc(a.mixChip) + '</b></span>'
      : fl.map(function (f, i) { var on = i === state.pick; return '<button type="button" class="bs-pick__c' + (on ? ' is-on' : '') + '" role="radio" aria-checked="' + on + '" data-act="pickfl" data-i="' + i + '"><i style="background:' + esc(f.accent) + '"></i><b>' + esc(f.name) + '</b></button>'; }).join('')) + '</div>' : '';
    var tools = '<div class="bs-tools">' + hold('pour', a.add, 'plus', 'bs-tool') + hold('press', a.press, 'tap', 'bs-tool') +
      '<button type="button" class="bs-btn bs-tool" data-act="level">' + ic('level') + '<span>' + esc(a.levelBtn) + '</span></button>' +
      '<button type="button" class="bs-ibtn bs-tool-i' + (state.holes ? ' is-on' : '') + '" role="switch" aria-checked="' + state.holes + '" data-act="holes" aria-label="' + esc(a.holes) + '">' + ic('pick') + '</button>' +
      '<button type="button" class="bs-ibtn bs-tool-i" data-act="empty" aria-label="' + esc(a.reset) + '">' + ic('redo') + '</button></div>';
    return {
      title: a.title, hint: state.fill.A < 0.08 ? a.tapHint : '',
      cap: fillCap(),
      panel: chipsRow + tools + tb('<p class="bs-stat1" id="bs-fst">' + fillStatText() + '</p>', a.cta, state.fill.A >= 0.45)
    };
  }
  function heightText(pk) {
    var a = A.fill;
    return pk.mm < 0 ? fmt(a.below, { n: -pk.mm }) : pk.mm > 0 ? fmt(a.above, { n: pk.mm }) : a.level;
  }
  function fillStatText() { var pk = packInfo(); return '<b>' + pk.grams + ' ' + esc(A.fill.g) + '</b> · ' + esc(heightText(pk)) + ' · ' + esc(A.fill.types[pk.type]); }
  function fillCap() {
    var a = A.fill, pk = packInfo(), leaf = leafOf();
    if (state.fill.A < 0.05) return esc(leaf === 'dark' ? a.tipDark : a.tipLight);
    if (pk.spire) return '<span class="bs-warn">' + esc(a.spire) + '</span>';
    if (pk.type === 'over') return '<span class="bs-warn">' + esc(a.over) + '</span>';
    if (pk.uneven) return '<span class="bs-warn">' + esc(a.uneven) + '</span>';
    return esc(leaf === 'dark' ? a.tipDark : a.tipLight);
  }
  var fillRaf = 0;
  function fillChanged(st) {
    if (st) state.fill = { A: st.A, d: st.d, uneven: st.uneven, touch: st.touch, spire: st.spire };
    if (fillRaf) return;
    fillRaf = requestAnimationFrame(function () {
      fillRaf = 0;
      if (state.step !== 4) return;
      var e = $('bs-fst'), html = fillStatText(); if (e && e.innerHTML !== html) e.innerHTML = html;
      setCap(fillCap());
      var next = el.panelIn.querySelector('[data-act=next]'); if (next) next.disabled = state.fill.A < 0.45;
      if (state.fill.A >= 0.08) setHint('');
    });
  }
  function pour(dt) {
    if (api && api.fillEven) { fillChanged(api.fillEven(dt)); return; }
    // bez 3D-a: ravnomjerno punjenje
    var F = state.fill; F.A = Math.min(1.25, F.A + dt * 0.3); fillChanged();
  }
  function press(dt) {
    if (state.fill.A < 0.15) return;
    if (api && api.fillPress) { fillChanged(api.fillPress(dt)); return; }
    state.fill.d = Math.min(1, state.fill.d + dt * 0.42); fillChanged();
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
    var a = A.cover, c = state.cover || 'foil', body;
    if (c === 'foil') {
      body = '<div class="bs-row bs-row--chips">' + [['rings', a.patterns.rings], ['spiral', a.patterns.spiral]].map(function (x) {
          return '<button type="button" class="bs-chip' + (state.pattern === x[0] ? ' is-on' : '') + '" data-act="pattern" data-id="' + x[0] + '">' + esc(x[1]) + '</button>';
        }).join('') + '<button type="button" class="bs-chip" data-act="clearholes">' + esc(a.clear) + '</button></div>';
    } else {
      var v = Math.round(state.vents * 100);
      body = '<div class="bs-vents"><span>' + esc(a.vents) + '</span><input type="range" class="bs-range bs-range--heat" id="bs-vents" min="0" max="100" step="5" value="' + v + '" aria-label="' + esc(a.vents) + '" style="--p:' + v + '%"><b id="bs-vv">' + v + '%</b></div>';
    }
    return {
      title: a.title, hint: c === 'foil' && state.pattern === 'own' && !state.foilHoles.length ? a.hint : '',
      cap: coverCap(),
      panel: seg('cover', [['foil', a.foil, 'foil'], ['hmd', a.hmd, 'flame']], c) + body + tb(c === 'foil' ? '<p class="bs-stat1"><b id="bs-hn">' + state.foilHoles.length + '</b> / 48 · ' + esc(a.holes) + '</p>' : '', a.cta, c === 'hmd' || state.foilHoles.length > 0)
    };
  }
  function coverCap() {
    var a = A.cover, k = state.foilHoles.length;
    if (state.cover === 'hmd') return esc(a.hmdInfo);
    if (k && k < 15) return '<span class="bs-warn">' + esc(a.fewHoles) + '</span>';
    if (k > 70) return '<span class="bs-warn">' + esc(a.manyHoles) + '</span>';
    return esc(a.foilTap);
  }
  function holesChanged() {
    if (api) api.foilHoles(state.foilHoles);
    var n = $('bs-hn'); if (n) n.textContent = state.foilHoles.length;
    setCap(coverCap());
    var next = el.panelIn.querySelector('[data-act=next]'); if (next) next.disabled = !state.foilHoles.length;
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
    var counts = hmdC ? [2, 3] : [2, 3, 4];
    var left = state.coalN - state.coals.length;
    return {
      title: a.title, hint: left > 0 ? (hmdC ? a.hintHmd : a.hint) : '',
      cap: coalsCap(),
      panel: '<div class="bs-row bs-row--chips">' + counts.map(function (n) {
          return '<button type="button" class="bs-chip bs-chip--num' + (n === state.coalN ? ' is-on' : '') + '" data-act="coaln" data-id="' + n + '" aria-label="' + esc(a.count + ': ' + n) + '">' + n + '</button>';
        }).join('') +
        '<button type="button" class="bs-chip" data-act="autocoals">' + ic('flame') + esc(a.place) + '</button>' +
        '<button type="button" class="bs-ibtn bs-tool-i" data-act="clearcoals" aria-label="' + esc(a.clear) + '">' + ic('redo') + '</button></div>' +
        tb('<p class="bs-stat1"><b id="bs-kn">' + state.coals.length + '</b> / ' + state.coalN + ' · ' + esc(a.count) + '</p>', a.cta, state.coals.length === state.coalN)
    };
  }
  function coalsCap() {
    var a = A.coals, left = state.coalN - state.coals.length;
    if (centerCoal()) return '<span class="bs-warn">' + esc(a.center) + '</span>';
    return esc(left > 0 ? fmt(a.left, { n: left }) : a.ready);
  }
  function coalsChanged() {
    if (api) api.coals(snapshotState());
    if (state.step !== 6) return;
    var left = state.coalN - state.coals.length, k = $('bs-kn');
    if (k) k.textContent = state.coals.length;
    setCap(coalsCap());
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
    var minutes = Math.round((pk.grams / 14) * 46 * (1 + state.fill.d * 0.25));
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
    var smoke = Math.max(0, Math.min(1.25, (rel - 0.45) / 0.55 * (0.85 + state.fill.d * 0.25) * air));
    var burnRate = Math.max(0, rel - 1.12) * 0.07 + (s.pk.type === 'over' ? 0.006 : 0) + (centerCoal() ? 0.004 : 0);
    s.burn = Math.min(1, s.burn + burnRate * dm);
    if (rel > 1.12) s.hot += dm; if (rel < 0.8 && s.t > 6) s.cold += dm;
    s.sumHeat += rel * dm; s.sumSmoke += Math.min(1, smoke) * dm; s.n += dm;
    if (api) api.session({ on: true, heat: rel, smoke: Math.min(1, smoke), burn: s.burn });
    if (!s.prompt && s.t - s.lastRot > 15) s.prompt = true;
    if (s.t >= s.end) { s.done = true; stopSim(); if (api) api.session({ on: false }); }
    updateSim(rel, smoke);
  }
  function updateSim(rel, smoke) {
    if (state.step !== 7) return;
    var s2 = sim, a = A.smoke;
    var line = $('bs-sline');
    if (line) {
      var html = '<b>' + Math.round(s2.t) + ' / ' + s2.end + ' min</b> · ' + esc(a.heat) + ': ' + esc(rel < 0.8 ? a.levels.low : rel > 1.12 ? a.levels.high : a.levels.ok) + ' · ' + esc(a.smoke) + ': ' + esc(smoke < 0.35 ? a.smokeL.thin : smoke < 0.75 ? a.smokeL.ok : a.smokeL.thick);
      if (line.innerHTML !== html) line.innerHTML = html;
    }
    var g = $('bs-heat'); if (g) g.style.left = Math.max(2, Math.min(98, rel / 1.6 * 100)) + '%';
    setCap(s2.done ? esc(a.end) : s2.burn > 0.35 ? '<span class="bs-warn">' + esc(a.burning) + '</span>' : rel > 1.12 ? '<span class="bs-warn">' + esc(a.hot) + '</span>' : rel < 0.8 && s2.t > 6 ? esc(a.cold) : s2.prompt ? '<b>' + esc(a.rotateNow) + '.</b> ' + esc(a.rotateText) : esc(s2.t < 6 ? a.warming : a.good));
    var rot = el.panelIn.querySelector('[data-act=rotate]'); if (rot) { rot.classList.toggle('is-pulse', s2.prompt && !s2.done); rot.disabled = s2.done; }
    var rem = el.panelIn.querySelector('[data-act=removecoal]'); if (rem) rem.disabled = s2.done || state.coals.length - s2.removed <= 1;
    var nx = el.panelIn.querySelector('[data-act=next]'); if (nx) nx.hidden = !s2.done;
    var row = rot && rot.parentNode; if (row) row.hidden = s2.done;
  }
  function viewSmoke() {
    var a = A.smoke;
    return {
      title: a.title, cap: esc(a.warming),
      panel: '<p class="bs-stat1 bs-stat1--sm" id="bs-sline"></p>' +
        '<div class="bs-meter bs-meter--heat bs-meter--thin"><div class="bs-meter__bar"><span id="bs-heat" style="left:2%"></span></div></div>' +
        '<div class="bs-tools"><button type="button" class="bs-btn bs-tool" data-act="rotate">' + ic('redo') + '<span>' + esc(a.rotate) + '</span></button>' +
        '<button type="button" class="bs-btn bs-tool" data-act="removecoal">' + ic('x') + '<span>' + esc(a.remove) + '</span></button>' +
        '<button type="button" class="bs-ibtn bs-tool-i" data-act="finish" aria-label="' + esc(a.finish) + '">' + ic('skip') + '</button></div>' +
        '<button type="button" class="bs-btn bs-btn--primary" data-act="next" hidden><span>' + esc(a.result) + '</span>' + ic('next') + '</button>'
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
    var unmixed = prepOf() === 'mix' && state.mixP < 0.8;
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
    if (pk.uneven) tips.push('uneven');
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
      bowl: state.bowl, flavors: state.flavors, prep: prepOf(), shares: state.shares, pick: state.pick, mixP: state.mixP,
      holes: state.holes, cover: state.cover, foilHoles: state.foilHoles, vents: state.vents, coals: state.coals
    };
  }
  function resetFrom(n) {
    if (n <= 3) state.mixP = 0;
    if (n <= 4) { state.fill = { A: 0, d: 0, uneven: 0, touch: 0, spire: false }; state.holes = false; state.pick = 0; if (api && api.fillReset) api.fillReset(); }
    if (n <= 5) { state.cover = 'foil'; state.pattern = 'rings'; state.foilHoles = pattern('rings'); state.vents = 0.5; }
    if (n <= 6) { state.coals = []; state.coalN = 3; }
    sim = null; shot = '';
  }
  function equalShares(n) {
    var base = Math.floor(100 / n / 5) * 5, out = [];
    for (var i = 0; i < n; i++) out.push(base);
    out[0] += 100 - base * n;
    state.shares = out; state.shareSel = 0;
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
      el.panelIn.innerHTML = (v.cap != null ? '<p class="bs-cap" id="bs-cap" aria-live="polite">' + v.cap + '</p>' : '') + v.panel;
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
    else if (act === 'remove') { var ri = +b.getAttribute('data-slot'); state.flavors = state.flavors.filter(function (x, k) { return k !== ri; }); equalShares(state.flavors.length); resetFrom(3); render(true); sync(); }
    else if (act === 'prep') { if (state.prep !== b.getAttribute('data-id')) { state.prep = b.getAttribute('data-id'); resetFrom(3); refresh(); } }
    else if (act === 'sharesel') { state.shareSel = +b.getAttribute('data-i'); refresh(true); }
    else if (act === 'shareplus' || act === 'shareminus') { setShare(state.shareSel, act === 'shareplus' ? 5 : -5); resetFrom(3); refresh(true); }
    else if (act === 'pickfl') { state.pick = +b.getAttribute('data-i'); if (api && api.fillPick) api.fillPick(state.pick); refresh(true); }
    else if (act === 'level') { if (api && api.fillLevel) { api.fillLevel(); setTimeout(function () { if (api) fillChanged(api.fillStats()); }, 460); } else { state.fill.uneven = 0; fillChanged(); } }
    else if (act === 'empty') { state.fill = { A: 0, d: 0, uneven: 0, touch: 0, spire: false }; if (api && api.fillReset) api.fillReset(); fillChanged(); refresh(true); }
    else if (act === 'holes') { state.holes = !state.holes; b.setAttribute('aria-checked', String(state.holes)); b.classList.toggle('is-on', state.holes); if (api && api.fillHoles) api.fillHoles(state.holes); }
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
    if (t.id === 'bs-vents') {
      state.vents = +t.value / 100; t.style.setProperty('--p', t.value + '%');
      var vv = $('bs-vv'); if (vv) vv.textContent = t.value + '%';
      if (api) api.vents(state.vents);
    }
  });
  // osvježi panel istog koraka (bez prelaza)
  function refresh(keepScroll) {
    var y = el.panelIn.scrollTop, v = VIEWS[state.step]();
    el.panelIn.innerHTML = (v.cap != null ? '<p class="bs-cap" id="bs-cap" aria-live="polite">' + v.cap + '</p>' : '') + v.panel;
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
    else if (holdAct === 'stir') setMix(api && api.mixAuto ? api.mixAuto(dt) : state.mixP + dt * 0.45);
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
    if (holdAct === 'stir' && api && api.mixRelease) api.mixRelease();
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
  var drag = null, pourRaf = 0, pourLast = 0;
  function pourLoop(t) {
    pourRaf = 0;
    if (!drag || !drag.fill || !api) return;
    var dt = pourLast ? Math.min(0.1, (t - pourLast) / 1000) : 0.016; pourLast = t;
    var fx = drag.px == null ? drag.x : drag.px, fy = drag.py == null ? drag.y : drag.py;
    var dist = Math.hypot(drag.x - fx, drag.y - fy), steps = Math.max(1, Math.min(12, Math.ceil(dist / 9))), st = null;
    for (var i = 1; i <= steps; i++) {
      var k = i / steps, r2 = api.fillAt(fx + (drag.x - fx) * k, fy + (drag.y - fy) * k, dt / steps);
      if (r2) st = r2;
    }
    drag.px = drag.x; drag.py = drag.y;
    if (st) fillChanged(st);
    pourRaf = requestAnimationFrame(pourLoop);
  }
  el.stage.addEventListener('pointerdown', function (e) {
    drag = { x: e.clientX, y: e.clientY, moved: 0, id: e.pointerId };
    try { el.stage.setPointerCapture(e.pointerId); } catch (err) { /* stari preglednici */ }
    if (!api) return;
    if (state.step === 3 && prepOf() !== 'none' && api.mixDrag) { drag.mix = true; setMix(api.mixDrag(e.clientX, e.clientY, 'start')); }
    if (state.step === 4 && api.fillAt) { drag.fill = true; pourLast = 0; if (!pourRaf) pourRaf = requestAnimationFrame(pourLoop); }
  });
  el.stage.addEventListener('pointermove', function (e) {
    if (!drag || drag.id !== e.pointerId) return;
    var d = Math.hypot(e.clientX - drag.x, e.clientY - drag.y);
    drag.moved += d; drag.x = e.clientX; drag.y = e.clientY;
    if (drag.mix && d > 0) setMix(api.mixDrag(e.clientX, e.clientY, 'move'));
  });
  function stageUp(e) {
    if (!drag) return;
    var tap = drag.moved < 10, dr = drag;
    drag = null;
    if (dr.mix && api) api.mixDrag(0, 0, 'end');
    if (dr.fill && api) { api.dropping(false); fillChanged(api.fillStats()); }
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
    el.panelIn.innerHTML = '<p class="bs-cap" id="bs-cap">' + v.cap + '</p>' + v.panel;
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
    var before = state.flavors.length;
    state.flavors = next.filter(Boolean).slice(0, 4);
    if (state.flavors.length !== before) equalShares(state.flavors.length);
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
        hookahUrl: doc.body.getAttribute('data-bs-hookah'),
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
