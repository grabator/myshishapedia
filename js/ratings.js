/*
 * MyShishapedia - ocjene okusa i recepata (zvjezdice 1-5, bez prijave).
 *
 * Učitava se na svim stranicama. Jednim zahtjevom (GET /api/ratings) dohvati prosjeke i
 * broj ocjena, pa popuni:
 *   - [data-rate-slot="flavor:<id>"]   mali prosjek na karticama (prazno dok nema ocjena)
 *   - [data-rate-widget="recipe:<id>"] zvjezdice na stranici okusa i recepta (ocjenjivanje)
 * Rang liste ("Najbolje ocijenjeno") i sortiranje po ocjeni koriste MSP.Ratings (vidi pages.js).
 *
 * Ako API ne radi (npr. baza još nije podešena), ocjene se jednostavno ne prikazuju, a
 * mjesto za njih ostaje rezervisano, pa se ništa na stranici ne pomjera.
 *
 * Ocjena se šalje uz Turnstile token (zaštita od robota) i anonimni ID uređaja iz localStorage
 * (jedna ocjena po uređaju; nova ocjena zamijeni staru). Na localhostu se koristi
 * Cloudflareov testni Turnstile ključ i lažni API iz serve.mjs.
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var V = MSP.V;
  var t = MSP.t;
  var FX = MSP.Effects;
  var doc = document.documentElement;

  var API = '/api/ratings';
  var TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  var TURNSTILE_TEST_KEY = '1x00000000000000000000AA';
  var LOCAL = /^(localhost|127\.0\.0\.1|\[::1\]|.*\.localhost)$/.test(location.hostname);
  var metaKey = document.querySelector('meta[name="msp-turnstile"]');
  var SITEKEY = LOCAL ? TURNSTILE_TEST_KEY : (metaKey && metaKey.content) || '';
  var FRESH_MS = 2 * 60 * 1000;

  function sget(store, key) { try { return window[store].getItem(key); } catch (e) { return null; } }
  function sset(store, key, v) { try { window[store].setItem(key, v); } catch (e) { /* nema storagea */ } }
  function readJSON(store, key) { try { return JSON.parse(sget(store, key) || '{}') || {}; } catch (e) { return {}; } }

  /* ------------------------------------------------------------------ */
  /* Stanje                                                              */
  /* ------------------------------------------------------------------ */

  var data = null; // { flavor: { id: [prosjek, broj] }, recipe: { ... } }
  var listeners = [];
  var memDevice = '';

  var R = {
    state: 'loading', // 'loading' | 'ready' | 'off'
    get: function (kind, id) {
      var v = data && data[kind] && data[kind][id];
      return v && v[1] ? { avg: v[0], count: v[1] } : null;
    },
    mine: function (kind, id) {
      var n = readJSON('localStorage', 'msp-ratings')[kind + ':' + id];
      return n >= 1 && n <= 5 ? n : 0;
    },
    /** fn(state) se pozove kad ocjene stignu (ili ne stignu) i nakon svake nove ocjene. */
    on: function (fn) {
      listeners.push(fn);
      if (R.state !== 'loading') fn(R.state);
      return function () { listeners = listeners.filter(function (x) { return x !== fn; }); };
    },
    format: function (avg) { return V.formatNum(avg).replace(/^(\d)$/, MSP.lang === 'bs' ? '$1,0' : '$1.0'); }
  };
  MSP.Ratings = R;

  function notify() { listeners.slice().forEach(function (fn) { try { fn(R.state); } catch (e) { console.error(e); } }); }

  function deviceId() {
    var id = sget('localStorage', 'msp-device');
    if (id && /^[a-f0-9]{32}$/.test(id)) return id;
    if (memDevice) return memDevice;
    var b = new Uint8Array(16);
    (window.crypto || window.msCrypto).getRandomValues(b);
    id = Array.prototype.map.call(b, function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
    sset('localStorage', 'msp-device', id);
    memDevice = id;
    return id;
  }

  function setMine(kind, id, n) {
    var all = readJSON('localStorage', 'msp-ratings');
    all[kind + ':' + id] = n;
    sset('localStorage', 'msp-ratings', JSON.stringify(all));
  }

  // Svježa ocjena (poslije slanja) ima prednost nad keširanim odgovorom servera par minuta.
  function rememberFresh(kind, id, avg, count) {
    var f = readJSON('sessionStorage', 'msp-ratings-fresh');
    f[kind + ':' + id] = [avg, count, Date.now()];
    sset('sessionStorage', 'msp-ratings-fresh', JSON.stringify(f));
  }
  function applyFresh() {
    var f = readJSON('sessionStorage', 'msp-ratings-fresh');
    Object.keys(f).forEach(function (k) {
      var v = f[k], p = k.split(':');
      if (!v || Date.now() - v[2] > FRESH_MS || !data[p[0]]) return;
      data[p[0]][p[1]] = [v[0], v[1]];
    });
  }

  /* ------------------------------------------------------------------ */
  /* Kartice: mali prosjek                                               */
  /* ------------------------------------------------------------------ */

  function srText(r) {
    return t('ratings.avgSr', { avg: R.format(r.avg), count: MSP.plural('ratings.count', r.count) });
  }

  function fillSlot(el) {
    var p = el.getAttribute('data-rate-slot').split(':');
    var r = R.state === 'ready' ? R.get(p[0], p[1]) : null;
    var sig = r ? r.avg + '/' + r.count : '';
    if (el.getAttribute('data-sig') === sig) return;
    el.setAttribute('data-sig', sig);
    if (!r) { el.innerHTML = ''; el.classList.remove('is-on'); return; }
    el.innerHTML =
      '<span class="rpill__in" aria-hidden="true">' + V.icon('star', 'rpill__star') + '<b>' + R.format(r.avg) + '</b><span class="rpill__n">' + r.count + '</span></span>' +
      '<span class="sr-only">' + V.esc(srText(r)) + '</span>';
    el.classList.add('is-on');
  }

  function fillSlots(scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll('[data-rate-slot]'), fillSlot);
  }

  /* ------------------------------------------------------------------ */
  /* Zvjezdice na stranici okusa i recepta                               */
  /* ------------------------------------------------------------------ */

  function keyOf(el) { return el.getAttribute('data-rate-widget').split(':'); }

  function showStars(el, n) {
    el.style.setProperty('--sel', String(n || 0));
    Array.prototype.forEach.call(el.querySelectorAll('.rate__star'), function (b) {
      var v = Number(b.getAttribute('data-v'));
      b.classList.toggle('is-on', v <= n);
    });
  }

  function setMsg(el, text, kind) {
    var m = el.querySelector('.rate__msg');
    m.textContent = text || '';
    m.classList.toggle('is-error', kind === 'error');
  }

  function renderWidget(el, opts) {
    opts = opts || {};
    var k = keyOf(el);
    if (R.state === 'off') { el.classList.remove('is-loading'); el.classList.add('is-off'); return; }
    if (R.state !== 'ready') return;
    var r = R.get(k[0], k[1]);
    var mine = R.mine(k[0], k[1]);
    el.classList.remove('is-loading');
    el.classList.add('is-ready');
    el.classList.toggle('has-ratings', !!r);
    el.querySelector('.rate__avg').textContent = r ? R.format(r.avg) : '–';
    el.style.setProperty('--avg', String(r ? r.avg : 0));
    var count = el.querySelector('.rate__count');
    count.textContent = r ? MSP.plural('ratings.count', r.count) : t('ratings.none');
    var sr = el.querySelector('.rate__sr');
    if (!sr) {
      sr = document.createElement('span');
      sr.className = 'sr-only rate__sr';
      el.querySelector('.rate__sum').appendChild(sr);
    }
    sr.textContent = r ? srText(r) : '';
    Array.prototype.forEach.call(el.querySelectorAll('.rate__star'), function (b) {
      b.setAttribute('aria-pressed', String(Number(b.getAttribute('data-v')) === mine));
    });
    if (!el.classList.contains('is-sending')) showStars(el, mine);
    if (!opts.keepMsg) setMsg(el, mine ? t('ratings.yours', { n: mine }) : t('ratings.hint'));
  }

  /* ---------- Turnstile (učitava se tek kad zatreba) ---------- */

  var tsLoading = null;
  var tsWidgets = {};

  function loadTurnstile() {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (!tsLoading) {
      tsLoading = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = TURNSTILE_SRC;
        s.async = true;
        s.onload = function () { if (window.turnstile) resolve(window.turnstile); else { tsLoading = null; reject(new Error('turnstile')); } };
        s.onerror = function () { tsLoading = null; s.remove(); reject(new Error('turnstile')); };
        document.head.appendChild(s);
      });
    }
    return tsLoading;
  }

  function getToken(el) {
    var key = el.getAttribute('data-rate-widget');
    return loadTurnstile().then(function (T) {
      return new Promise(function (resolve, reject) {
        var box = el.querySelector('.rate__ts');
        var timer = window.setTimeout(function () { reject(new Error('turnstile')); }, 60000);
        var w = tsWidgets[key];
        var ok = function (tok) { window.clearTimeout(timer); resolve(tok); };
        var bad = function () { window.clearTimeout(timer); reject(new Error('turnstile')); };
        if (w) {
          w.ok = ok; w.bad = bad;
          T.reset(w.id);
          T.execute(box);
          return;
        }
        w = tsWidgets[key] = { ok: ok, bad: bad };
        w.id = T.render(box, {
          sitekey: SITEKEY,
          action: 'rate',
          theme: 'dark',
          size: 'flexible',
          appearance: 'interaction-only',
          execution: 'execute',
          callback: function (tok) { w.ok(tok); },
          'error-callback': function () { w.bad(); return true; },
          'timeout-callback': function () { w.bad(); }
        });
        T.execute(box);
      });
    });
  }

  /* ---------- slanje ---------- */

  function celebrate(el, n) {
    el.classList.remove('is-celebrate');
    void el.offsetWidth;
    el.classList.add('is-celebrate');
    window.setTimeout(function () { el.classList.remove('is-celebrate'); }, 1400);
    var Field = FX && FX.Field;
    if (!Field || !Field.ready || FX.reducedMotion()) return;
    var star = el.querySelector('.rate__star[data-v="' + n + '"]');
    if (!star) return;
    var r = star.getBoundingClientRect();
    Field.puff(r.left + r.width / 2, r.top + r.height / 2, { count: 9, alpha: 0.24, r0: 5, r1: [24, 60], life: [1, 1.8], speed: [30, 80], spread: 1.2 });
  }

  function errorText(err) {
    if (err && err.status === 429) return t('ratings.errLimit');
    if (err && (err.status === 403 || err.message === 'turnstile')) return t('ratings.errCheck');
    return t('ratings.errSend');
  }

  function submit(el, n) {
    if (el.classList.contains('is-sending')) return;
    var k = keyOf(el);
    var prev = R.mine(k[0], k[1]);
    if (prev === n) { setMsg(el, t('ratings.same')); return; }
    el.classList.add('is-sending');
    showStars(el, n);
    setMsg(el, t('ratings.sending'));
    getToken(el).then(function (token) {
      return fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ kind: k[0], id: k[1], stars: n, device: deviceId(), token: token })
      });
    }).then(function (res) {
      if (!res.ok) { var e = new Error('http'); e.status = res.status; throw e; }
      return res.json();
    }).then(function (out) {
      data[k[0]] = data[k[0]] || {};
      data[k[0]][k[1]] = [out.avg, out.count];
      setMine(k[0], k[1], out.stars);
      rememberFresh(k[0], k[1], out.avg, out.count);
      el.classList.remove('is-sending');
      renderWidget(el, { keepMsg: true });
      setMsg(el, t(prev ? 'ratings.changed' : 'ratings.thanks', { n: out.stars }));
      celebrate(el, out.stars);
      fillSlots();
      notify();
    }).catch(function (err) {
      el.classList.remove('is-sending');
      showStars(el, prev);
      setMsg(el, errorText(err), 'error');
    });
  }

  function bindWidget(el) {
    if (el.hasAttribute('data-rate-bound')) return;
    el.setAttribute('data-rate-bound', '');
    var group = el.querySelector('.rate__stars');
    var warm = function () { if (R.state === 'ready' && SITEKEY) loadTurnstile().catch(function () {}); };
    group.addEventListener('pointerenter', warm, { once: true });
    group.addEventListener('focusin', warm, { once: true });
    // pregled pri prelasku mišem / fokusu: zvjezdice se upale do te
    group.addEventListener('pointerover', function (e) {
      var b = e.target.closest('.rate__star');
      if (b && !el.classList.contains('is-sending')) { el.classList.add('is-preview'); showStars(el, Number(b.getAttribute('data-v'))); }
    });
    group.addEventListener('pointerleave', function () {
      if (el.classList.contains('is-sending')) return;
      el.classList.remove('is-preview');
      var k = keyOf(el);
      showStars(el, R.mine(k[0], k[1]));
    });
    group.addEventListener('click', function (e) {
      var b = e.target.closest('.rate__star');
      if (!b || R.state !== 'ready') return;
      el.classList.remove('is-preview');
      submit(el, Number(b.getAttribute('data-v')));
    });
    // strelice lijevo/desno između zvjezdica
    group.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight' && e.key !== 'Home' && e.key !== 'End') return;
      var stars = Array.prototype.slice.call(group.querySelectorAll('.rate__star'));
      var i = stars.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var j = e.key === 'Home' ? 0 : e.key === 'End' ? stars.length - 1 : Math.max(0, Math.min(stars.length - 1, i + (e.key === 'ArrowRight' ? 1 : -1)));
      stars[j].focus();
    });
  }

  function widgets() { return Array.prototype.slice.call(document.querySelectorAll('[data-rate-widget]')); }

  /* ------------------------------------------------------------------ */
  /* Učitavanje                                                          */
  /* ------------------------------------------------------------------ */

  function done(state) {
    R.state = state;
    doc.classList.add(state === 'ready' ? 'ratings-on' : 'ratings-off');
    widgets().forEach(function (el) { renderWidget(el); });
    if (state === 'ready') fillSlots();
    notify();
  }

  function load() {
    widgets().forEach(bindWidget);
    // Bez Turnstile ključa na objavljenoj stranici ocjene su isključene.
    if (!SITEKEY || !window.fetch || !window.Promise) { done('off'); return; }
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = window.setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
    fetch(API, { headers: { Accept: 'application/json' }, signal: ctrl ? ctrl.signal : undefined })
      .then(function (res) { if (!res.ok) throw new Error('http ' + res.status); return res.json(); })
      .then(function (json) {
        window.clearTimeout(timer);
        if (!json || json.v !== 1) throw new Error('format');
        data = { flavor: json.flavor || {}, recipe: json.recipe || {} };
        applyFresh();
        done('ready');
      })
      .catch(function () {
        window.clearTimeout(timer);
        done('off');
      });

    // Kartice koje JavaScript doda kasnije (pretraga na početnoj, okus dana...).
    if ('MutationObserver' in window) {
      var pending = false;
      new MutationObserver(function () {
        if (pending || R.state !== 'ready') return;
        pending = true;
        window.requestAnimationFrame(function () { pending = false; fillSlots(); });
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
