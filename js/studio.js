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
  var LAST_READY = 3; // koraci do ovog broja postoje (3 = "uskoro")

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
    flavors: [flavorInfo(BY_ID[POPULAR[0]] || ALL[0])]
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

  function viewSoon() {
    var a = A.soon;
    return {
      title: a.title,
      panel: '<div class="bs-note">' + ic('timer') + '<p>' + esc(a.text) + '</p></div>' + btn(a.back, 'back', 'back', 'bs-btn--ghost bs-btn--rev')
    };
  }

  var VIEWS = [viewIntro, viewBowl, viewFlavor, viewSoon];

  /* ------------------------------------------------------------------ */
  /* Iscrtavanje koraka                                                  */
  /* ------------------------------------------------------------------ */

  var swapTimer = 0, hintTimer = 0;
  function render(instant) {
    var s = state.step, v = VIEWS[Math.min(s, VIEWS.length - 1)]();
    root.setAttribute('data-step', String(s));
    root.classList.toggle('is-intro', s === 0);
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
    var s = state.step;
    if (s === 0) api.step('intro', { bowl: state.bowl, first: first, flavors: state.flavors });
    else if (s === 1) api.step('bowl', { bowl: state.bowl, flavors: state.flavors });
    else api.step('flavor', { flavors: state.flavors });
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
    else if (act === 'remove') { state.flavors = state.flavors.slice(0, 1); render(true); sync(); }
  });
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
    if (!src) return;
    var l = doc.createElement('link'); l.rel = 'modulepreload'; l.href = src; doc.head.appendChild(l);
    var m = doc.createElement('link'); m.rel = 'preload'; m.as = 'fetch'; m.crossOrigin = 'anonymous'; m.href = doc.body.getAttribute('data-bs-model'); doc.head.appendChild(m);
  }
  Array.prototype.forEach.call(doc.querySelectorAll('[data-bs-open]'), function (b) {
    b.addEventListener('pointerenter', warm, { once: true });
    b.addEventListener('touchstart', warm, { once: true, passive: true });
    b.addEventListener('focus', warm, { once: true });
  });
})();
