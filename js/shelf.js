/*
 * MyShishapedia - Moja polica (lična kolekcija okusa, bez prijave).
 *
 * Sve se čuva samo u browseru i nikad se ne šalje (localStorage: "msp-shelf" i "msp-recent",
 * nizovi id-jeva okusa, najnoviji prvi). Učitava se na svim stranicama:
 *   - dugmad [data-shelf] (kartice okusa i stranica okusa): dodaj / ukloni sa police
 *   - kratko obavještenje (toast) sa linkom na policu
 *   - "Nedavno gledano": pamti zadnjih 8 otvorenih okusa i puni traku na početnoj i
 *     na stranici svih okusa
 *   - stranica "Moja polica": ormarić sa teglama (desktop, tablet) i ladice (mobitel),
 *     pregled tegle u dijalogu
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var V = MSP.V;
  var t = MSP.t;
  var L = MSP.L;
  var FX = MSP.Effects;
  var esc = V.esc;
  var icon = V.icon;
  var doc = document.documentElement;

  function reduced() { return FX ? FX.reducedMotion() : false; }

  /* ------------------------------------------------------------------ */
  /* Čuvanje (localStorage, sa rezervom u memoriji)                       */
  /* ------------------------------------------------------------------ */

  var mem = {};
  function readList(key) {
    var raw = null;
    try { raw = window.localStorage.getItem(key); } catch (e) { raw = mem[key] || null; }
    var list;
    try { list = JSON.parse(raw || '[]'); } catch (e) { list = []; }
    if (!Array.isArray(list)) return [];
    var seen = {};
    return list.filter(function (id) {
      if (typeof id !== 'string' || seen[id] || !V.flavorById(id)) return false;
      seen[id] = 1;
      return true;
    });
  }
  function writeList(key, list) {
    var v = JSON.stringify(list);
    try { window.localStorage.setItem(key, v); } catch (e) { mem[key] = v; }
  }

  /* ------------------------------------------------------------------ */
  /* Polica                                                              */
  /* ------------------------------------------------------------------ */

  var KEY = 'msp-shelf';
  var listeners = [];

  var Shelf = {
    list: function () { return readList(KEY); },
    has: function (id) { return Shelf.list().indexOf(id) !== -1; },
    add: function (id) {
      var l = Shelf.list().filter(function (x) { return x !== id; });
      l.unshift(id);
      save(l);
    },
    remove: function (id) { save(Shelf.list().filter(function (x) { return x !== id; })); },
    toggle: function (id) {
      var on = !Shelf.has(id);
      if (on) Shelf.add(id); else Shelf.remove(id);
      return on;
    },
    on: function (fn) {
      listeners.push(fn);
      return function () { listeners = listeners.filter(function (x) { return x !== fn; }); };
    }
  };
  MSP.Shelf = Shelf;

  function save(list) {
    writeList(KEY, list);
    changed();
  }

  function changed() {
    doc.classList.toggle('has-shelf', Shelf.list().length > 0);
    syncButtons(document);
    listeners.slice().forEach(function (fn) { try { fn(); } catch (e) { console.error(e); } });
  }

  /* ---------- dugmad ---------- */

  function syncButton(b) {
    var id = b.getAttribute('data-shelf');
    var on = Shelf.has(id);
    b.setAttribute('aria-pressed', String(on));
    if (b.classList.contains('shelf-tog--card')) {
      var label = t(on ? 'shelf.removeAria' : 'shelf.addAria', { name: b.getAttribute('data-name') || '' });
      b.setAttribute('aria-label', label);
      b.setAttribute('title', label);
    }
  }

  function syncButtons(scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll('[data-shelf]'), syncButton);
  }

  function puffAt(el, count, colors) {
    var Field = FX && FX.Field;
    if (!Field || !Field.ready || reduced() || !el) return;
    var r = el.getBoundingClientRect();
    Field.puff(r.left + r.width / 2, r.top + r.height / 2, { count: count || 7, alpha: 0.22, r0: 5, r1: [22, 56], life: [0.9, 1.6], speed: [25, 70], spread: 1.1, colors: colors });
  }

  function onShelfClick(e) {
    var b = e.target.closest && e.target.closest('[data-shelf]');
    if (!b) return;
    e.preventDefault();
    var id = b.getAttribute('data-shelf');
    var on = Shelf.toggle(id);
    b.classList.remove('is-pop');
    void b.offsetWidth;
    b.classList.add('is-pop');
    if (on) puffAt(b, 8);
    var f = V.flavorById(id);
    toast(t(on ? 'shelf.added' : 'shelf.removed', { name: f ? f.brand + ' ' + f.name : '' }));
  }

  /* ---------- obavještenje ---------- */

  var toastEl = null;
  var toastTimer = 0;

  function toast(msg, opts) {
    opts = opts || {};
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      toastEl.setAttribute('role', 'status');
      toastEl.setAttribute('aria-live', 'polite');
      toastEl.innerHTML = '<span class="toast__icon" aria-hidden="true">' + icon('jar') + '</span><span class="toast__msg"></span>' +
        (document.body.getAttribute('data-page') === 'shelf' ? '' : '<a class="toast__link" href="' + V.url('shelf') + '">' + esc(t('shelf.openShelf')) + '</a>');
      document.body.appendChild(toastEl);
    }
    toastEl.querySelector('.toast__msg').textContent = msg;
    var link = toastEl.querySelector('.toast__link');
    if (link) link.hidden = opts.link === false;
    toastEl.classList.remove('is-on');
    void toastEl.offsetWidth;
    toastEl.classList.add('is-on');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toastEl.classList.remove('is-on'); }, 4200);
  }
  MSP.toast = toast;

  /* ------------------------------------------------------------------ */
  /* Stranica "Moja polica"                                              */
  /* ------------------------------------------------------------------ */

  function jarArt(f) {
    var ing = V.byIntensity(f)[0];
    return (
      '<span class="jar__art">' +
        '<span class="jar__lid"></span>' +
        '<span class="jar__glass"><span class="jar__fill"></span>' +
          (ing ? '<span class="jar__label">' + MSP.illustrate(ing.illustration, { color: ing.color }) + '</span>' : '') +
          '<span class="jar__shine"></span></span>' +
      '</span>'
    );
  }

  function jarStyle(f) {
    var th = V.themeFor(f);
    return '--j-a:' + th.primary + ';--j-b:' + th.secondary + ';--j-bg:' + th.bg + ';--j-glow:' + th.accentInk;
  }

  function jarHTML(f, i) {
    return (
      '<li class="jar-li" style="--k:' + i + '"><button type="button" class="jar" data-jar="' + esc(f.id) + '" aria-haspopup="dialog" ' +
        'aria-label="' + esc(t('shelf.jarAria', { name: f.brand + ' ' + f.name })) + '" style="' + jarStyle(f) + '">' +
        jarArt(f) + '<span class="jar__name" aria-hidden="true">' + esc(f.name) + '</span>' +
      '</button></li>'
    );
  }

  function mountShelf(ctx) {
    var wrap = document.getElementById('shelf');
    if (!wrap) return;
    var data = {};
    try { data = JSON.parse(wrap.getAttribute('data-shelf-data') || '{}'); } catch (e) { data = {}; }
    var cab = document.getElementById('cab');
    var inside = document.getElementById('cab-inside');
    var shelvesEl = document.getElementById('cab-shelves');
    var doors = document.getElementById('cab-open');
    var closeBtn = document.getElementById('cab-close');
    var drawersEl = document.getElementById('drawers');
    var countEl = document.getElementById('shelf-count');
    var empty = document.getElementById('shelf-empty');
    var openDrawers = {};

    /** Okusi sa police po policama (kolekcijama), redom kao u data/collections.js, "Ostalo" na kraju. */
    function groups() {
      var list = Shelf.list().map(V.flavorById);
      return (data.shelves || []).map(function (s) {
        return { id: s.id, title: s.title, items: list.filter(function (f) { return (data.col[f.id] || 'other') === s.id; }) };
      }).filter(function (g) { return g.items.length; });
    }

    function render() {
      var gs = groups();
      var n = Shelf.list().length;
      countEl.textContent = n ? MSP.plural('shelf.count', n) : '';
      empty.hidden = n > 0;
      shelvesEl.innerHTML = gs.map(function (g, k) {
        return (
          '<section class="cab__shelf" style="--k:' + k + '" aria-labelledby="cab-l-' + g.id + '">' +
            '<h2 class="cab__label" id="cab-l-' + g.id + '"><span>' + esc(g.title) + '</span></h2>' +
            '<ul class="cab__row" role="list">' + g.items.map(jarHTML).join('') + '</ul>' +
          '</section>'
        );
      }).join('');
      drawersEl.innerHTML = gs.map(function (g, k) {
        var open = !!openDrawers[g.id];
        var count = MSP.plural('shelf.jars', g.items.length);
        return (
          '<section class="drawer' + (open ? ' is-open' : '') + '" style="--k:' + k + '">' +
            '<h2 class="drawer__h"><button type="button" class="drawer__front" id="dr-btn-' + g.id + '" data-drawer="' + g.id + '" aria-expanded="' + open + '" aria-controls="dr-' + g.id + '">' +
              '<span class="drawer__title">' + esc(g.title) + '</span>' +
              '<span class="drawer__count">' + esc(count) + '</span>' +
              '<span class="drawer__pull" aria-hidden="true"></span>' +
            '</button></h2>' +
            '<div class="drawer__box" id="dr-' + g.id + '" role="region" aria-labelledby="dr-btn-' + g.id + '"' + (open ? '' : ' hidden') + '>' +
              '<ul class="drawer__jars" role="list">' + g.items.map(jarHTML).join('') + '</ul>' +
            '</div>' +
          '</section>'
        );
      }).join('');
      if (!n && cab.classList.contains('is-open')) closeCab(false);
    }

    /* ---------- ormarić ---------- */

    function smoke() {
      var Field = FX && FX.Field;
      if (!Field || !Field.ready || reduced()) return;
      var r = inside.getBoundingClientRect();
      Field.puff(r.left + r.width / 2, r.top + 40, { count: 16, alpha: 0.24, r0: 8, r1: [50, 120], life: [1.8, 3], speed: [18, 46], spread: 0.7, colors: ['#ffe8c4', '#f6d3a1', '#fff4e2'] });
    }

    function openCab() {
      if (cab.classList.contains('is-open')) return;
      cab.classList.add('is-open');
      doors.setAttribute('aria-expanded', 'true');
      doors.tabIndex = -1;
      inside.inert = false;
      inside.removeAttribute('inert');
      closeBtn.hidden = false;
      window.setTimeout(smoke, reduced() ? 0 : 420);
      var first = inside.querySelector('.jar');
      if (first) first.focus({ preventScroll: true });
    }

    function closeCab(focus) {
      if (!cab.classList.contains('is-open')) return;
      cab.classList.remove('is-open');
      doors.setAttribute('aria-expanded', 'false');
      doors.tabIndex = 0;
      inside.inert = true;
      inside.setAttribute('inert', '');
      closeBtn.hidden = true;
      if (focus !== false) doors.focus({ preventScroll: true });
    }

    doors.addEventListener('click', openCab);
    closeBtn.addEventListener('click', function () { closeCab(true); });
    inside.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); closeCab(true); }
    });

    /* ---------- ladice ---------- */

    drawersEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-drawer]');
      if (!b) return;
      var id = b.getAttribute('data-drawer');
      var box = document.getElementById('dr-' + id);
      var sec = b.closest('.drawer');
      var open = b.getAttribute('aria-expanded') !== 'true';
      openDrawers[id] = open;
      b.setAttribute('aria-expanded', String(open));
      sec.classList.toggle('is-open', open);
      if (open) {
        box.hidden = false;
        puffAt(b, 6, ['#ffe8c4', '#f6d3a1']);
      } else if (reduced()) {
        box.hidden = true;
      } else {
        sec.classList.add('is-closing');
        window.setTimeout(function () {
          sec.classList.remove('is-closing');
          if (b.getAttribute('aria-expanded') !== 'true') box.hidden = true;
        }, 260);
      }
    });

    /* ---------- pregled tegle (dijalog) ---------- */

    var jv = document.getElementById('jarview');
    var jvCard = jv.querySelector('.jarview__card');
    var jvJar = document.getElementById('jv-jar');
    var jvSrc = null;
    var jvId = '';
    var closing = 0;

    function center(r) { return [r.left + r.width / 2, r.top + r.height / 2]; }

    /** "Tegla izađe naprijed": velika tegla krene sa mjesta male (FLIP, samo transform). */
    function flipFrom(src) {
      var art = src && src.querySelector('.jar__art');
      if (!art || reduced()) return;
      var a = art.getBoundingClientRect();
      var b = jvJar.getBoundingClientRect();
      if (!b.width) return;
      var ca = center(a), cb = center(b);
      jvJar.style.transition = 'none';
      jvJar.style.transform = 'translate(' + (ca[0] - cb[0]) + 'px,' + (ca[1] - cb[1]) + 'px) scale(' + (a.width / b.width) + ')';
      void jvJar.offsetWidth;
      jvJar.style.transition = '';
      jvJar.style.transform = '';
    }

    function openJar(btn) {
      var f = V.flavorById(btn.getAttribute('data-jar'));
      if (!f) return;
      window.clearTimeout(closing);
      var th = V.themeFor(f);
      jvSrc = btn;
      jvId = f.id;
      jvCard.setAttribute('style', '--jv-bg:' + th.bg + ';--jv-surface:' + th.surface + ';--jv-text:' + th.text + ';--jv-muted:' + th.muted + ';--jv-accent:' + th.accentInk + ';--jv-glow:' + th.surface2);
      document.getElementById('jv-brand').textContent = f.brand;
      document.getElementById('jv-title').textContent = f.name;
      document.getElementById('jv-desc').textContent = L(f.shortDescription) || '';
      document.getElementById('jv-ings').innerHTML = V.byIntensity(f).map(function (i) {
        return '<li style="--dot:' + esc(i.color) + '">' + esc(L(i.name)) + '</li>';
      }).join('');
      document.getElementById('jv-rate').innerHTML = V.rateSlot ? V.rateSlot('flavor', f.id, 'rpill--jv') : '';
      document.getElementById('jv-link').setAttribute('href', V.flavorUrl(f));
      jvJar.setAttribute('style', jarStyle(f));
      jvJar.innerHTML = jarArt(f);
      jv.hidden = false;
      document.body.classList.add('is-locked');
      flipFrom(btn);
      btn.classList.add('is-out');
      void jv.offsetWidth;
      jv.classList.add('is-open');
      jvCard.focus({ preventScroll: true });
      document.addEventListener('keydown', onJvKey);
    }

    function closeJar(opts) {
      opts = opts || {};
      if (jv.hidden) return;
      document.removeEventListener('keydown', onJvKey);
      jv.classList.remove('is-open');
      var src = jvSrc && document.body.contains(jvSrc) ? jvSrc : null;
      var done = function () {
        jv.hidden = true;
        jvJar.style.transform = '';
        jvJar.style.transition = '';
        document.body.classList.remove('is-locked');
        if (src) src.classList.remove('is-out');
        if (opts.focus !== false && src) src.focus({ preventScroll: true });
      };
      if (src && !reduced()) {
        // nazad na policu
        var art = src.querySelector('.jar__art');
        var a = art.getBoundingClientRect();
        jvJar.style.transform = '';
        var b = jvJar.getBoundingClientRect();
        var ca = center(a), cb = center(b);
        jvJar.style.transform = 'translate(' + (ca[0] - cb[0]) + 'px,' + (ca[1] - cb[1]) + 'px) scale(' + (a.width / b.width) + ')';
        closing = window.setTimeout(done, 420);
      } else {
        done();
      }
    }

    function onJvKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); closeJar(); return; }
      if (e.key !== 'Tab') return;
      var f = Array.prototype.filter.call(jvCard.querySelectorAll('a[href], button:not([disabled])'), function (x) { return x.offsetParent !== null; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === jvCard)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    jv.addEventListener('click', function (e) {
      if (e.target.closest('[data-jv-close]')) closeJar();
    });
    document.getElementById('jv-remove').addEventListener('click', function () {
      var id = jvId;
      var all = Array.prototype.slice.call(document.querySelectorAll('.jar'));
      var visible = all.filter(function (x) { return x.offsetParent !== null; });
      var i = visible.indexOf(jvSrc);
      closeJar({ focus: false });
      Shelf.remove(id);
      var f = V.flavorById(id);
      toast(t('shelf.removed', { name: f ? f.brand + ' ' + f.name : '' }));
      // fokus na susjednu teglu, ili na poruku o praznoj polici
      window.setTimeout(function () {
        var now = Array.prototype.filter.call(document.querySelectorAll('.jar'), function (x) { return x.offsetParent !== null; });
        var next = now[Math.min(Math.max(i, 0), now.length - 1)];
        if (next) next.focus({ preventScroll: true });
        else {
          var h = empty.querySelector('.shelf-empty__title');
          h.setAttribute('tabindex', '-1');
          h.focus({ preventScroll: true });
        }
      }, 30);
    });

    wrap.addEventListener('click', function (e) {
      var j = e.target.closest('.jar');
      if (j) openJar(j);
    });

    render();
    ctx.cleanup(Shelf.on(render));
    ctx.heroSmoke();
  }


  /* ------------------------------------------------------------------ */
  /* Nedavno gledano                                                     */
  /* ------------------------------------------------------------------ */

  var RECENT_KEY = 'msp-recent';
  var RECENT_MAX = 8;

  var Recent = {
    list: function () { return readList(RECENT_KEY); },
    push: function (id) {
      if (!V.flavorById(id)) return;
      var l = Recent.list().filter(function (x) { return x !== id; });
      l.unshift(id);
      writeList(RECENT_KEY, l.slice(0, RECENT_MAX));
    },
    clear: function () {
      try { window.localStorage.removeItem(RECENT_KEY); } catch (e) { delete mem[RECENT_KEY]; }
    }
  };
  MSP.Recent = Recent;

  function recentItem(f, i) {
    var th = V.themeFor(f);
    var ing = V.byIntensity(f)[0];
    return (
      '<li class="recent__item" style="--k:' + i + '">' +
        '<a class="recent__link" href="' + V.flavorUrl(f) + '" data-veil="' + th.veil + '" style="--rc-bg:' + th.bg + ';--rc-text:' + th.text + ';--rc-muted:' + th.muted + ';--rc-glow:' + th.surface2 + '">' +
          '<span class="recent__art" aria-hidden="true">' + (ing ? MSP.illustrate(ing.illustration, { color: ing.color }) : '') + '</span>' +
          '<span class="recent__txt"><span class="recent__brand">' + esc(f.brand) + '</span><span class="recent__name">' + esc(f.name) + '</span></span>' +
        '</a>' +
      '</li>'
    );
  }

  function renderRecent() {
    var strip = document.getElementById('recent');
    if (!strip) return;
    var list = Recent.list().map(V.flavorById);
    doc.classList.toggle('has-recent', list.length > 0);
    document.getElementById('recent-list').innerHTML = list.map(recentItem).join('');
  }

  function bindRecent() {
    var btn = document.getElementById('recent-clear');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var strip = document.getElementById('recent');
      Recent.clear();
      var finish = function () {
        strip.classList.remove('is-leaving');
        renderRecent();
        var main = document.getElementById('main');
        if (main) main.focus({ preventScroll: true });
      };
      toast(t('recent.cleared'), { link: false });
      if (reduced()) finish();
      else {
        strip.classList.add('is-leaving');
        window.setTimeout(finish, 320);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Start                                                               */
  /* ------------------------------------------------------------------ */

  if (MSP.Pages) MSP.Pages.shelf = { mount: mountShelf };

  document.addEventListener('click', onShelfClick);
  // promjena u drugom tabu
  window.addEventListener('storage', function (e) {
    if (e.key === KEY) changed();
    if (e.key === RECENT_KEY) renderRecent();
  });

  function start() {
    doc.classList.toggle('has-shelf', Shelf.list().length > 0);
    syncButtons(document);
    // otvoren okus ide na vrh liste "Nedavno gledano"
    if (document.body.getAttribute('data-page') === 'flavor') Recent.push(document.body.getAttribute('data-id') || '');
    renderRecent();
    bindRecent();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
