/*
 * MyShishapedia - aplikacija u browseru.
 *
 * Svaka stranica je gotov HTML (pravi ga build.mjs), pa ovaj fajl NE crta sadržaj,
 * nego ga samo "oživi": dim, nargila, animacije, pretraga i filteri, meni,
 * prekidač jezika, provjera godina, prelazi između stranica i email u footeru.
 *
 * Koja je stranica otvorena piše na <body data-page="..." data-id="...">,
 * a jezik na <html lang="...">.
 *
 * Ovisi o: strings.js, data/*.js, illustrations.js, effects.js, views.js, pages.js.
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var root = document.documentElement;
  MSP.lang = root.lang === 'en' ? 'en' : 'bs';

  var V = MSP.V;
  var t = MSP.t;
  var FX = MSP.Effects;
  var Field = FX.Field;

  var AGE_KEY = 'msp-age-ok';
  var LANG_KEY = 'msp-lang';
  var VEIL_KEY = 'msp-veil';

  var page = document.body.getAttribute('data-page') || 'notfound';
  var pageId = document.body.getAttribute('data-id') || '';

  var els = {
    root: root,
    app: document.getElementById('app'),
    header: document.getElementById('site-header'),
    main: document.getElementById('main'),
    footer: document.getElementById('site-footer'),
    gate: document.getElementById('age-gate'),
    skip: document.getElementById('skip-link'),
    loader: document.getElementById('loader')
  };

  var cleanups = [];
  function cleanup(fn) { if (typeof fn === 'function') cleanups.push(fn); }

  function storageGet(store, key) {
    try { return window[store].getItem(key); } catch (e) { return null; }
  }
  function storageSet(store, key, value) {
    try { window[store].setItem(key, value); } catch (e) { /* storage nije dostupan */ }
  }

  function smooth() { return FX.reducedMotion() ? 'auto' : 'smooth'; }

  /* ------------------------------------------------------------------ */
  /* Provjera godina i nargila                                           */
  /* ------------------------------------------------------------------ */

  function isAgeOk() { return root.classList.contains('age-ok'); }

  /** Pokreće fn odmah ako je provjera godina prošla, inače kad prođe. */
  function whenAgeOk(fn) {
    if (isAgeOk()) {
      var result = fn();
      return typeof result === 'function' ? result : function () {};
    }
    var cancelled = false;
    var inner = null;
    function onOk() { if (!cancelled) inner = fn(); }
    document.addEventListener('msp:age-ok', onOk, { once: true });
    return function () {
      cancelled = true;
      document.removeEventListener('msp:age-ok', onOk);
      if (typeof inner === 'function') inner();
    };
  }

  function startHookah(scope, th, opts) {
    var stage = scope && scope.querySelector('[data-hookah]');
    if (!stage) return;
    opts = opts || {};
    var stopAll = whenAgeOk(function () {
      stage.classList.add('is-started');
      var stop = FX.hookah(stage, {
        button: scope.querySelector('.pull'),
        meter: scope.querySelector('.pull__meter'),
        colors: th.smoke,
        introDelay: opts.introDelay,
        bowlSmoke: opts.bowlSmoke
      });
      var stopDrop = opts.dropAt ? FX.bowlDrop(stage, th.smoke, opts.dropAt) : function () {};
      return function () { stop(); stopDrop(); };
    });
    cleanup(stopAll);
    return stopAll;
  }

  /** Dim iz uglja u zaglavlju podstranice. */
  function heroSmoke() {
    var coal = els.main.querySelector('.phero__coal, .contact__coal');
    if (!coal || FX.reducedMotion()) return;
    cleanup(whenAgeOk(function () {
      if (!Field.ready) return null;
      var id = Field.addEmitter({
        anchor: coal, point: [0.5, 0.25], rate: 5, r1: [50, 120], life: [2.6, 4.4], speed: [26, 50], alpha: 0.2, turb: 50, buoy: 16
      });
      return function () { Field.removeEmitter(id); };
    }));
  }

  /** Mijenja boje stranice uživo (koristi mikser). */
  function applyTheme(theme) {
    var style = root.style;
    Object.keys(V.THEME_VARS).forEach(function (v) { style.setProperty(v, theme[V.THEME_VARS[v]]); });
    root.setAttribute('data-scheme', theme.scheme);
    style.colorScheme = theme.scheme;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme.bg);
    if (Field.ready) Field.setColors(theme.smoke);
  }

  /** Zamijeni adresu (npr. ?korak=3 ili ?a=..&b=..) bez ponovnog učitavanja. */
  function replaceUrl(search) {
    try { history.replaceState(history.state, '', location.pathname + (search || '') + location.hash); } catch (e) { /* ignore */ }
  }

  function currentTheme() {
    if (page === 'flavor') return V.themeFor(V.flavorById(pageId));
    return V.themeFor(null);
  }

  /** Boje dima stranice (build ih upiše na <body data-smoke>, npr. za kolekcije i recepte). */
  function pageSmoke() {
    var s = document.body.getAttribute('data-smoke');
    return s ? s.split(',') : currentTheme().smoke;
  }

  /* ------------------------------------------------------------------ */
  /* Kontekst za pages.js                                                */
  /* ------------------------------------------------------------------ */

  var ctx = {
    els: els,
    page: page,
    id: pageId,
    cleanup: cleanup,
    whenAgeOk: whenAgeOk,
    startHookah: startHookah,
    heroSmoke: heroSmoke,
    applyTheme: applyTheme,
    replaceUrl: replaceUrl,
    params: function () { return new URLSearchParams(location.search); }
  };
  MSP.App = ctx;

  /* ------------------------------------------------------------------ */
  /* Početna i 404: pretraga i filteri                                   */
  /* ------------------------------------------------------------------ */

  var catalog = { query: '', tag: null };

  function filteredFlavors() {
    return V.flavors().filter(function (f) {
      if (catalog.tag && (f.tags || []).indexOf(catalog.tag) === -1) return false;
      return V.matchesQuery(f, catalog.query);
    });
  }

  function updateGrid() {
    var grid = document.getElementById('flavor-grid');
    if (!grid) return;
    var list = filteredFlavors();
    var filtering = !!(V.normalize(catalog.query) || catalog.tag);
    grid.innerHTML = V.gridItems(list, { soon: !filtering });
    document.getElementById('catalog-count').textContent = MSP.plural('home.count', list.length);
    document.getElementById('catalog-empty').hidden = list.length > 0;
  }

  function scrollToCatalog() {
    var target = document.getElementById('svi-okusi');
    if (target) target.scrollIntoView({ behavior: smooth(), block: 'start' });
  }

  function bindCatalog() {
    var form = document.getElementById('search-input-form');
    var input = document.getElementById('search-input');
    var clear = document.getElementById('search-input-clear');
    var filters = document.getElementById('filters');
    if (!input || !filters) return;

    function setQuery(q) {
      catalog.query = q;
      clear.hidden = !q;
      updateGrid();
    }

    input.addEventListener('input', function () { setQuery(input.value); });
    clear.addEventListener('click', function () {
      input.value = '';
      setQuery('');
      input.focus();
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (FX.isMobile()) input.blur();
      scrollToCatalog();
    });
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      var tag = btn.getAttribute('data-tag') || null;
      catalog.tag = catalog.tag === tag ? null : tag;
      filters.querySelectorAll('.chip').forEach(function (b) {
        var active = (b.getAttribute('data-tag') || null) === catalog.tag;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      updateGrid();
    });
    document.getElementById('empty-reset').addEventListener('click', function () {
      catalog.tag = null;
      input.value = '';
      filters.innerHTML = V.filters(null);
      setQuery('');
      input.focus();
    });

    // pretraga poslana sa 404 stranice (bez JavaScripta): /bs/?q=menta
    var q = ctx.params().get('q');
    if (q) {
      input.value = q;
      setQuery(q);
      window.setTimeout(scrollToCatalog, 80);
    }
  }

  function mountHome() {
    var th = V.themeFor(null);
    var hero = els.main.querySelector('.hero');
    bindCatalog();
    mountFotd();
    startHookah(hero, th, { introDelay: 1.7, bowlSmoke: { rate: 8, alpha: 0.26 } });
    cleanup(FX.parallax(hero));
    var grid = document.getElementById('flavor-grid');
    cleanup(FX.tilt(grid));
    cleanup(FX.cardWisps(grid));
    var xgrid = els.main.querySelector('.explore__grid');
    if (xgrid) cleanup(FX.hoverWisps(xgrid, '.xcard', '.xcard__art', th.smoke));
    cleanup(FX.reveal(els.main, th.smoke));
  }

  /* ------------------------------------------------------------------ */
  /* Okus dana (početna)                                                 */
  /* ------------------------------------------------------------------ */

  /**
   * HTML ima podrazumijevani okus (iz dana builda); ovdje se izračuna okus za
   * LOKALNI datum posjetioca i, ako je drugi, zamijeni. Kartica ima fiksnu visinu
   * u CSS-u, pa zamjena ne pomjera ostatak stranice.
   */
  function mountFotd() {
    var card = document.getElementById('fotd-card');
    if (!card) return;
    var emitter = 0;
    var timer = 0;

    function smokeFor(f) { return V.themeFor(f).smoke; }

    function startSmoke(f) {
      if (emitter) Field.removeEmitter(emitter);
      emitter = 0;
      var anchor = card.querySelector('.fotd__bowl');
      if (!Field.ready || FX.reducedMotion() || !anchor) return;
      emitter = Field.addEmitter({
        anchor: anchor, point: [0.5, 0.1], rate: 6, colors: smokeFor(f),
        r1: [70, 160], life: [2.6, 4.2], speed: [30, 60], alpha: 0.22, turb: 50, buoy: 18
      });
    }

    function show(f, animate) {
      if (card.getAttribute('data-id') !== f.id) {
        card.setAttribute('data-id', f.id);
        card.setAttribute('style', V.fotdStyle(f));
        card.innerHTML = V.fotdCard(f);
        if (animate) {
          card.classList.remove('is-swapping');
          void card.offsetWidth;
          card.classList.add('is-swapping');
        }
      }
      startSmoke(f);
      tick();
    }

    function tick() {
      var el = document.getElementById('fotd-timer');
      var now = new Date();
      var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      var mins = Math.max(0, Math.ceil((next - now) / 60000));
      var h = Math.floor(mins / 60);
      var m = mins % 60;
      if (el) el.textContent = h > 0 ? t('fotd.next', { h: h, m: m }) : t('fotd.nextMin', { m: Math.max(1, m) });
      // novi dan: novi okus
      var f = V.fotdPick(now);
      if (f && f.id !== card.getAttribute('data-id')) show(f, true);
    }

    var today = V.fotdPick(new Date());
    if (today) show(today, false);
    timer = window.setInterval(tick, 30000);
    cleanup(function () {
      clearInterval(timer);
      if (emitter) Field.removeEmitter(emitter);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Padajući meni (desktop)                                             */
  /* ------------------------------------------------------------------ */

  function bindNavGroups() {
    var groups = els.header.querySelectorAll('.nav-group');
    function setOpen(g, open) {
      g.classList.toggle('is-open', open);
      g.querySelector('.nav-group__btn').setAttribute('aria-expanded', String(open));
    }
    Array.prototype.forEach.call(groups, function (g) {
      var btn = g.querySelector('.nav-group__btn');
      btn.addEventListener('click', function () {
        var open = !g.classList.contains('is-open');
        Array.prototype.forEach.call(groups, function (x) { if (x !== g) setOpen(x, false); });
        g.classList.remove('is-closed');
        setOpen(g, open);
        if (!open) g.classList.add('is-closed');
      });
      g.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        setOpen(g, false);
        g.classList.add('is-closed');
        btn.focus();
      });
      g.addEventListener('mouseleave', function () { g.classList.remove('is-closed'); });
      g.addEventListener('focusout', function (e) {
        if (!g.contains(e.relatedTarget)) { setOpen(g, false); g.classList.remove('is-closed'); }
      });
    });
    document.addEventListener('click', function (e) {
      Array.prototype.forEach.call(groups, function (g) {
        if (!g.contains(e.target) && g.classList.contains('is-open')) setOpen(g, false);
      });
    });
  }

  function mountNotFound() {
    var th = V.themeFor(null);
    bindCatalog();
    startHookah(els.main.querySelector('.nf'), th, { introDelay: 1.5 });
    var grid = document.getElementById('flavor-grid');
    cleanup(FX.tilt(grid));
    cleanup(FX.cardWisps(grid));
    cleanup(FX.reveal(els.main, th.smoke));
  }

  /* ------------------------------------------------------------------ */
  /* Stranica okusa                                                      */
  /* ------------------------------------------------------------------ */

  function mountFlavor() {
    var f = V.flavorById(pageId);
    if (!f) return;
    var th = V.themeFor(f);
    var article = els.main.querySelector('.flavor');
    var hero = els.main.querySelector('.fhero');
    startHookah(hero, th, {
      introDelay: 2.5,
      dropAt: 2450,
      bowlSmoke: f.mood === 'ice' || f.mood === 'supernova' ? { rate: 9, alpha: 0.3 } : f.mood === 'frost' || f.mood === 'mist' ? { rate: 7, alpha: 0.26 } : null
    });
    if (f.mood === 'supernova') supernovaSmoke(hero, th);
    cleanup(FX.parallax(hero));
    cleanup(FX.fitText(document.getElementById('flavor-name')));
    cleanup(FX.reveal(els.main, th.smoke));
    cleanup(FX.hoseGuide(article));
    var sim = document.getElementById('similar-grid');
    if (sim) {
      cleanup(FX.tilt(sim));
      cleanup(FX.cardWisps(sim));
    }
  }

  /**
   * Supernova: kad CSS eksplozija dostigne vrhunac, iz središta zvijezde krene ledeni dim
   * (krhotine se "pretvore" u dim). Bez animacija (prefers-reduced-motion) ostaje samo mirna slika.
   */
  function supernovaSmoke(hero, th) {
    var core = hero && hero.querySelector('.sn__core');
    if (!core || !Field.ready || FX.reducedMotion()) return;
    var timers = [];
    function burst(count, speed, alpha) {
      var r = core.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      Field.puff(r.left + r.width / 2, r.top + r.height / 2, {
        count: count, angle: 0, spread: Math.PI, speed: speed, r0: 14, r1: [70, 170],
        life: [2.6, 4.4], alpha: alpha, colors: th.smoke, turb: 70, buoy: 14, drag: 0.4, force: true
      });
    }
    timers.push(window.setTimeout(function () { burst(30, [120, 260], 0.34); }, 1000));
    timers.push(window.setTimeout(function () { burst(18, [60, 140], 0.26); }, 1500));
    cleanup(function () { timers.forEach(clearTimeout); });
  }

  /* ------------------------------------------------------------------ */
  /* O nama                                                              */
  /* ------------------------------------------------------------------ */

  function mountAbout() {
    var th = V.themeFor(null);
    startHookah(els.main.querySelector('.about-hero'), th, { introDelay: 1.4, bowlSmoke: { rate: 5, alpha: 0.2 } });
    heroSmoke();
    cleanup(FX.reveal(els.main, th.smoke));
  }

  /* ------------------------------------------------------------------ */
  /* Email (nije u HTML-u kao tekst; slaže se ovdje)                     */
  /* ------------------------------------------------------------------ */

  function reverse(s) { return s.split('').reverse().join(''); }

  function bindMail() {
    document.querySelectorAll('a[data-m]').forEach(function (a) {
      var parts = (a.getAttribute('data-m') || '').split('|');
      if (parts.length !== 2 || !parts[0]) return;
      var email = reverse(parts[0]) + '@' + reverse(parts[1]);
      a.setAttribute('href', 'mailto:' + email);
      a.setAttribute('title', email);
      if (a.classList.contains('sig__name')) a.setAttribute('aria-label', t('about.contactCta') + ': ' + email);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Mobilni meni                                                        */
  /* ------------------------------------------------------------------ */

  var menuOpen = false;

  function openMenu() {
    var overlay = document.getElementById('menu-overlay');
    var btn = els.header.querySelector('.menu-btn');
    if (!overlay || menuOpen) return;
    menuOpen = true;
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('is-open'); });
    btn.setAttribute('aria-expanded', 'true');
    els.main.inert = true;
    els.footer.inert = true;
    els.header.inert = true;
    document.body.classList.add('is-locked');
    if (Field.ready) {
      for (var i = 0; i < 7; i++) {
        Field.puff(Math.random() * window.innerWidth, window.innerHeight * (0.35 + Math.random() * 0.7), {
          count: 4, alpha: 0.22, r1: [120, 240], life: [1.8, 3], speed: [20, 70], force: true
        });
      }
    }
    var first = overlay.querySelector('.menu-link[aria-current]') || overlay.querySelector('.menu-link');
    window.setTimeout(function () { if (menuOpen && first) first.focus(); }, 60);
  }

  function closeMenu(returnFocus) {
    if (!menuOpen) return;
    menuOpen = false;
    var overlay = document.getElementById('menu-overlay');
    var btn = els.header.querySelector('.menu-btn');
    els.main.inert = false;
    els.footer.inert = false;
    els.header.inert = false;
    if (isAgeOk()) document.body.classList.remove('is-locked');
    if (btn) btn.setAttribute('aria-expanded', 'false');
    if (overlay) {
      overlay.classList.remove('is-open');
      window.setTimeout(function () { if (!menuOpen) overlay.hidden = true; }, FX.reducedMotion() ? 0 : 320);
    }
    if (returnFocus && btn) btn.focus();
  }

  function onMenuKey(e) {
    if (!menuOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); return; }
    if (e.key !== 'Tab') return;
    var overlay = document.getElementById('menu-overlay');
    var items = overlay.querySelectorAll('a[href], button');
    if (!items.length) return;
    var first = items[0], last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* ------------------------------------------------------------------ */
  /* Jezik                                                               */
  /* ------------------------------------------------------------------ */

  /** Adresa iste stranice na drugom jeziku, sa istim stanjem (korak vodiča, miks). */
  function langHref(a) {
    var href = a.getAttribute('href');
    var lang = a.getAttribute('data-lang');
    var p = ctx.params();
    if (page === 'guide') {
      var n = p.get('korak') || p.get('step');
      if (n) href += '?' + (lang === 'bs' ? 'korak' : 'step') + '=' + encodeURIComponent(n);
    } else if (page === 'mixer' && p.get('a')) {
      href += location.search;
    }
    return href;
  }

  function onLangClick(e) {
    var a = e.target.closest('.lang__opt');
    if (!a) return false;
    var lang = a.getAttribute('data-lang');
    storageSet('localStorage', LANG_KEY, lang);
    if (lang === MSP.lang) { e.preventDefault(); return true; }
    a.setAttribute('href', langHref(a));
    return false; // nastavlja kao običan link (sa prelazom)
  }

  /* ------------------------------------------------------------------ */
  /* Prelazi između stranica (oblak dima)                                */
  /* ------------------------------------------------------------------ */

  function isInternalNav(a, e) {
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download')) return false;
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return false;
    var url;
    try { url = new URL(a.href, location.href); } catch (err) { return false; }
    if (url.origin !== location.origin) return false;
    // ista stranica, samo drugo sidro: normalno skrolanje
    if (url.pathname === location.pathname && url.search === location.search && url.hash) return false;
    return url;
  }

  function veilColorFor(a, url) {
    var c = a.getAttribute('data-veil');
    if (c) return c;
    var m = url.pathname.match(/^\/(bs|en)\/(okus|flavor)\/([^/]+)\/?$/);
    if (m) {
      var f = V.flavorById(decodeURIComponent(m[3]));
      if (f) return V.themeFor(f).veil;
    }
    return V.themeFor(null).veil;
  }

  function onDocClick(e) {
    if (onLangClick(e)) return;
    var a = e.target.closest('a[href]');
    var url = isInternalNav(a, e);
    if (!url) return;
    if (FX.reducedMotion()) return;
    e.preventDefault();
    var color = veilColorFor(a, url);
    storageSet('sessionStorage', VEIL_KEY, color);
    closeMenu(false);
    FX.veilCover(color, function () { location.href = url.href; });
  }

  /* ------------------------------------------------------------------ */
  /* Stari linkovi sa # (prije buildanja): #/okus/x, #/mikser/a+b/60 ...  */
  /* ------------------------------------------------------------------ */

  function legacyHashTarget(hash, lang) {
    var m;
    if (!hash || hash.indexOf('#/') !== 0) return null;
    var h = hash.slice(2);
    try { h = decodeURIComponent(h); } catch (e) { /* ignore */ }
    if (h === '') return V.urlFor(lang, 'home');
    if ((m = h.match(/^okus\/([^/?#]+)/))) return V.flavorById(m[1]) ? V.urlFor(lang, 'flavor', m[1]) : V.urlFor(lang, 'notfound');
    if ((m = h.match(/^mikser(?:\/([^/]+)\+([^/]+)(?:\/(\d+))?)?/))) {
      return V.urlFor(lang, 'mixer') + (m[1] ? '?a=' + encodeURIComponent(m[1]) + '&b=' + encodeURIComponent(m[2]) + (m[3] ? '&r=' + m[3] : '') : '');
    }
    if (/^kviz/.test(h)) return V.urlFor(lang, 'quiz');
    if ((m = h.match(/^vodic(?:\/(\d+))?/))) return m[1] ? V.guideStepUrl(+m[1], lang) : V.urlFor(lang, 'guide');
    if ((m = h.match(/^rjecnik(?:\/([^/]+))?/))) return m[1] ? V.termUrl(m[1], lang) : V.urlFor(lang, 'glossary');
    if (/^oprema/.test(h)) return V.urlFor(lang, 'gear');
    return V.urlFor(lang, 'home');
  }
  MSP.legacyHashTarget = legacyHashTarget;

  /* ------------------------------------------------------------------ */
  /* Globalno                                                            */
  /* ------------------------------------------------------------------ */

  var headerRaf = 0;
  function updateHeaderState() {
    headerRaf = 0;
    els.header.classList.toggle('is-scrolled', (window.scrollY || 0) > 24);
  }

  function bindGlobal() {
    window.addEventListener('scroll', function () {
      if (!headerRaf) headerRaf = requestAnimationFrame(updateHeaderState);
    }, { passive: true });
    headerRaf = requestAnimationFrame(updateHeaderState);

    els.skip.addEventListener('click', function (e) {
      e.preventDefault();
      els.main.focus();
    });

    var menuRoot = document.getElementById('menu-root');
    if (menuRoot) {
      menuRoot.addEventListener('click', function (e) {
        if (e.target.closest('.menu-close')) { closeMenu(true); return; }
        if (e.target.closest('.menu-link')) closeMenu(false);
      });
    }
    bindNavGroups();
    els.header.addEventListener('click', function (e) {
      if (e.target.closest('.menu-btn')) openMenu();
    });
    document.addEventListener('keydown', onMenuKey);
    window.addEventListener('resize', function () {
      if (menuOpen && window.innerWidth >= 1024) closeMenu(false);
    });

    document.addEventListener('click', onDocClick);

    // Povratak "nazad" iz bfcache-a: skloni oblak koji je ostao preko ekrana.
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) FX.veilReset();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      var tag = (e.target && e.target.tagName) || '';
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (e.target && e.target.isContentEditable)) return;
      var input = document.getElementById('search-input');
      if (!input || els.app.inert) return;
      e.preventDefault();
      input.focus();
      input.select();
    });

    bindMail();
    loadAnalytics();
    bindLazySearch();
  }

  /* ---------- Globalna pretraga: js/search.js se učita tek kad zatreba ---------- */

  var searchLoading = null;
  function loadSearch() {
    if (MSP.Search) return Promise.resolve();
    if (!searchLoading) {
      searchLoading = new Promise(function (res) {
        var src = document.body.getAttribute('data-search');
        if (!src) { res(); return; }
        var s = document.createElement('script');
        s.src = src;
        s.onload = s.onerror = function () { res(); };
        document.head.appendChild(s);
      });
    }
    return searchLoading;
  }

  function openSearchFrom(el) {
    loadSearch().then(function () { if (MSP.Search) MSP.Search.open(el); });
  }

  function bindLazySearch() {
    // prije učitavanja: klik na lupu i prečice učitaju pretragu i odmah je otvore
    document.addEventListener('click', function (e) {
      if (MSP.Search) return;
      var a = e.target.closest('[data-gsearch]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      openSearchFrom(a);
    }, true);
    document.addEventListener('keydown', function (e) {
      if (MSP.Search || !isAgeOk()) return;
      var tag = (e.target && e.target.tagName) || '';
      var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (e.target && e.target.isContentEditable);
      var ctrlK = (e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K');
      var slash = e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey &&
        !document.getElementById('search-input') && !document.getElementById('fl-q');
      if (!ctrlK && !slash) return;
      e.preventDefault();
      openSearchFrom(document.activeElement);
    });
    // u mirovanju se učita unaprijed, da prvo otvaranje bude trenutno
    var later = function () {
      if ('requestIdleCallback' in window) window.requestIdleCallback(loadSearch, { timeout: 5000 });
      else window.setTimeout(loadSearch, 3000);
    };
    if (document.readyState === 'complete') later();
    else window.addEventListener('load', later, { once: true });
  }

  /**
   * Cloudflare Web Analytics: build upiše token u <meta name="msp-analytics"> samo ako je
   * ANALYTICS_TOKEN postavljen. Na lokalnom serveru se skripta nikad ne učitava.
   */
  function loadAnalytics() {
    var meta = document.querySelector('meta[name="msp-analytics"]');
    if (!meta || !meta.content) return;
    if (/^(localhost|127\.0\.0\.1|\[::1\]|.*\.localhost|.*\.test)$/.test(location.hostname)) return;
    var s = document.createElement('script');
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: meta.content }));
    document.head.appendChild(s);
  }

  /* ------------------------------------------------------------------ */
  /* Loader (samo pri prvoj posjeti u sesiji)                            */
  /* ------------------------------------------------------------------ */

  var LOADER_MIN_MS = 600;

  function hideLoader() {
    var l = els.loader;
    if (!l) return;
    if (!root.classList.contains('first-visit')) { l.remove(); return; }
    var wait = FX.reducedMotion() ? 0 : Math.max(0, LOADER_MIN_MS - performance.now());
    window.setTimeout(function () {
      l.classList.add('is-done');
      window.setTimeout(function () { l.remove(); }, 500);
    }, wait);
  }

  /* ------------------------------------------------------------------ */
  /* Provjera godina                                                     */
  /* ------------------------------------------------------------------ */

  function focusHeading() {
    var h1 = els.main.querySelector('h1');
    if (h1) {
      try { h1.focus({ preventScroll: true }); } catch (e) { h1.focus(); }
    }
  }

  function initAgeGate() {
    var gate = els.gate;
    if (!gate) return;
    if (isAgeOk()) { gate.remove(); return; }

    els.app.inert = true;
    els.skip.hidden = true;
    document.body.classList.add('is-locked');

    var emitter = 0;
    whenFieldReady(function () {
      if (isAgeOk()) return;
      emitter = Field.addEmitter({
        anchor: gate.querySelector('.age-gate__coal'), point: [0.5, 0.2], rate: 4, colors: ['#f4ebdf', '#ebcda4', '#d9c3a8'],
        r1: [60, 150], life: [3, 5], speed: [25, 50], alpha: 0.16, turb: 50, buoy: 16
      });
    });

    var ask = document.getElementById('age-ask');
    var denied = document.getElementById('age-denied');

    gate.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-age]');
      if (!btn) return;
      var answer = btn.getAttribute('data-age');
      if (answer === 'yes') {
        storageSet('localStorage', AGE_KEY, '1');
        gate.classList.add('is-leaving');
        root.classList.add('age-ok');
        els.app.inert = false;
        els.skip.hidden = false;
        document.body.classList.remove('is-locked');
        if (emitter) Field.removeEmitter(emitter);
        document.dispatchEvent(new Event('msp:age-ok'));
        window.setTimeout(function () { gate.remove(); }, FX.reducedMotion() ? 0 : 600);
        focusHeading();
      } else if (answer === 'no') {
        ask.hidden = true;
        denied.hidden = false;
        document.getElementById('age-denied-title').focus();
      } else if (answer === 'back') {
        denied.hidden = true;
        ask.hidden = false;
        gate.querySelector('[data-age="yes"]').focus();
      }
    });

    requestAnimationFrame(function () {
      var yes = gate.querySelector('[data-age="yes"]');
      if (yes && !ask.hidden) yes.focus();
    });
  }

  /* ------------------------------------------------------------------ */
  /* Dim (globalni canvas) kreće tek kad se sadržaj iscrta               */
  /* ------------------------------------------------------------------ */

  var fieldWaiters = [];
  function whenFieldReady(fn) {
    if (Field.ready) fn(); else fieldWaiters.push(fn);
  }

  var fieldStarted = false;
  function startField() {
    if (fieldStarted) return;
    fieldStarted = true;
    Field.init();
    Field.setTrail(true);
    Field.setColors(pageSmoke());
    fieldWaiters.splice(0).forEach(function (fn) { fn(); });
    document.dispatchEvent(new Event('msp:field-ready'));
  }

  /* ------------------------------------------------------------------ */
  /* Provjera podataka (pomaže pri dodavanju novih okusa)                */
  /* ------------------------------------------------------------------ */

  function validateData() {
    var seen = {};
    V.flavors().forEach(function (f) {
      if (!f.id) console.warn('[flavors] Okus bez id-a:', f);
      if (seen[f.id]) console.warn('[flavors] Dupli id: ' + f.id);
      seen[f.id] = 1;
      (f.ingredients || []).forEach(function (i) {
        if (!MSP.hasIllustration(i.illustration)) console.warn('[flavors] Nema ilustracije "' + i.illustration + '" (okus ' + f.id + ').');
      });
      (f.similar || []).forEach(function (id) {
        if (!V.flavorById(id)) console.warn('[flavors] Nepostojeći sličan okus "' + id + '" u ' + f.id);
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Start                                                               */
  /* ------------------------------------------------------------------ */

  var MOUNT = {
    home: mountHome,
    flavor: mountFlavor,
    about: mountAbout,
    notfound: mountNotFound
  };

  function init() {
    // stari link sa # (npr. podijeljen prije prelaska na prave adrese)
    var legacy = legacyHashTarget(location.hash, MSP.lang);
    if (legacy) { location.replace(legacy); return; }

    validateData();
    bindGlobal();
    initAgeGate();
    hideLoader();

    // Dim i animacije kreću tek nakon što je sadržaj iscrtan (brže prvo iscrtavanje).
    // requestAnimationFrame ne okida u skrivenom tabu, pa i tajmer kao rezerva.
    var done = false;
    function afterPaint() {
      if (done) return;
      done = true;
      // Sadržaj je sakriven iza provjere godina, pa efekti stranice čekaju potvrdu
      // (manje posla pri učitavanju; stranica se ionako ne vidi prije toga).
      whenAgeOk(function () {
        startField();
        var mount = MOUNT[page] || (MSP.Pages[page] && MSP.Pages[page].mount);
        if (mount) {
          try { mount(ctx); } catch (e) { console.error(e); }
        }
        FX.microPuffs(document);
      });
    }
    requestAnimationFrame(afterPaint);
    window.setTimeout(afterPaint, 120);

    // Prozor za provjeru godina: dim iz uglja kreće tek kad se sve učita.
    if (!isAgeOk()) {
      var later = function () { window.setTimeout(startField, 1800); };
      if (document.readyState === 'complete') later();
      else window.addEventListener('load', later, { once: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
