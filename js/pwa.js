/*
 * MyShishapedia - aplikacija na početnom ekranu (PWA).
 *
 *   - registruje service worker (/sw.js, generiše ga build.mjs): pamti stranice i skripte,
 *     pa polica, dnevnik, slika sesije i mikser rade i bez interneta
 *   - dugmad [data-install-btn]: Android i desktop Chrome dobiju pravi prozor za instalaciju,
 *     iPhone i iPad kratko uputstvo (Safari nema takav prozor)
 *   - kartica [data-install-card] se može skloniti na 30 dana ("Ne sada")
 *   - mala oznaka "Bez interneta" dok nema veze
 *   - stranica "Bez interneta": lista stranica koje su već sačuvane na telefonu
 * Ovisi o: strings.js (t), views.js (V).
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var t = MSP.t;
  var V = MSP.V;
  var doc = document.documentElement;
  var NO_KEY = 'msp-pwa-later';

  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
  var ua = navigator.userAgent || '';
  var ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (standalone) doc.classList.add('is-app');

  /* ------------------------------------------------------------------ */
  /* Service worker                                                      */
  /* ------------------------------------------------------------------ */

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    var reg = function () {
      navigator.serviceWorker.register('/sw.js').then(function () {
        // glavne stranice na ovom jeziku da rade bez interneta
        return navigator.serviceWorker.ready;
      }).then(function (r) {
        if (r.active) r.active.postMessage({ type: 'warm', lang: MSP.lang });
      }).catch(function () { /* bez offline načina */ });
    };
    if (document.readyState === 'complete') reg(); else window.addEventListener('load', reg);
  }

  /* ------------------------------------------------------------------ */
  /* Instalacija                                                         */
  /* ------------------------------------------------------------------ */

  var deferred = null;

  function later() {
    try { return Date.now() - (+localStorage.getItem(NO_KEY) || 0) < 30 * 86400000; } catch (e) { return false; }
  }
  function show(on) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-install]'), function (el) {
      el.hidden = !on || (el.hasAttribute('data-install-card') && later());
    });
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    if (!standalone) show(true);
  });
  window.addEventListener('appinstalled', function () {
    deferred = null;
    show(false);
    toast(t('pwa.installed'));
  });
  // iPhone i iPad: nema prozora za instalaciju, pa dugme otvara uputstvo
  if (ios && !standalone) show(true);

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-install-btn]');
    if (b) {
      if (deferred) {
        var p = deferred;
        deferred = null;
        p.prompt();
        (p.userChoice || Promise.resolve({})).then(function (r) { if (r.outcome === 'accepted') show(false); });
      } else if (ios) {
        iosHelp(b);
      }
      return;
    }
    var no = e.target.closest('[data-install-no]');
    if (no) {
      try { localStorage.setItem(NO_KEY, String(Date.now())); } catch (err) { /* ignore */ }
      var card = no.closest('[data-install-card]');
      if (card) card.hidden = true;
    }
  });

  var sheet = null, lastBtn = null;
  function iosHelp(from) {
    lastBtn = from;
    if (!sheet) {
      sheet = document.createElement('div');
      sheet.className = 'pwa-ios';
      sheet.setAttribute('role', 'dialog');
      sheet.setAttribute('aria-modal', 'true');
      sheet.setAttribute('aria-labelledby', 'pwa-ios-h');
      sheet.innerHTML =
        '<div class="pwa-ios__box">' +
          '<img class="pwa-ios__icon" src="/icons/icon-192.png" alt="" width="64" height="64">' +
          '<h2 class="pwa-ios__h" id="pwa-ios-h">' + V.esc(t('pwa.iosTitle')) + '</h2>' +
          '<ol class="pwa-ios__steps">' +
            '<li><span class="pwa-ios__share" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M8 7l4-4 4 4"/><path d="M8 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2"/></svg></span>' + V.esc(t('pwa.ios1')) + '</li>' +
            '<li><span class="pwa-ios__plus" aria-hidden="true">+</span>' + V.esc(t('pwa.ios2')) + '</li>' +
            '<li><span class="pwa-ios__ok" aria-hidden="true">✓</span>' + V.esc(t('pwa.ios3')) + '</li>' +
          '</ol>' +
          '<button type="button" class="btn btn--primary pwa-ios__close">' + V.esc(t('pwa.close')) + '</button>' +
        '</div>';
      document.body.appendChild(sheet);
      sheet.addEventListener('click', function (e) { if (e.target === sheet || e.target.closest('.pwa-ios__close')) closeIos(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sheet.classList.contains('is-open')) closeIos(); });
    }
    sheet.classList.add('is-open');
    sheet.querySelector('.pwa-ios__close').focus();
  }
  function closeIos() {
    sheet.classList.remove('is-open');
    if (lastBtn) lastBtn.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------ */
  /* Bez interneta                                                       */
  /* ------------------------------------------------------------------ */

  var tt = 0, tEl = null;
  function toast(text) {
    if (!tEl) {
      tEl = document.createElement('p');
      tEl.className = 'pwa-toast';
      tEl.setAttribute('role', 'status');
      document.body.appendChild(tEl);
    }
    tEl.textContent = text;
    tEl.classList.add('is-on');
    clearTimeout(tt);
    tt = setTimeout(function () { tEl.classList.remove('is-on'); }, 2600);
  }

  var badge = null;
  function net() {
    var off = navigator.onLine === false;
    doc.classList.toggle('is-offline', off);
    if (off && !badge) {
      badge = document.createElement('p');
      badge.className = 'pwa-offline';
      badge.setAttribute('role', 'status');
      badge.innerHTML = '<i aria-hidden="true"></i>' + V.esc(t('pwa.offline'));
      document.body.appendChild(badge);
    }
    if (badge) badge.hidden = !off;
  }
  window.addEventListener('offline', net);
  window.addEventListener('online', function () { var was = doc.classList.contains('is-offline'); net(); if (was) toast(t('pwa.offlineBack')); });
  net();

  // stranica "Bez interneta"
  var retry = document.querySelector('[data-retry]');
  if (retry) retry.addEventListener('click', function () { location.reload(); });
  var list = document.getElementById('offl-list');
  if (list && window.caches) {
    var prefix = '/' + MSP.lang + '/';
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf('msp-pages') === 0 || k.indexOf('msp-pre-') === 0; }).map(function (k) {
        return caches.open(k).then(function (c) { return c.keys(); });
      }));
    }).then(function (groups) {
      var seen = {}, reqs = [];
      groups.forEach(function (g) {
        g.forEach(function (r) {
          var u = new URL(r.url);
          if (u.origin !== location.origin || u.pathname === V.url('offline') || u.pathname.indexOf(prefix) !== 0 || !/\/$/.test(u.pathname) || seen[u.pathname] || u.pathname === location.pathname) return;
          seen[u.pathname] = 1;
          reqs.push(r);
        });
      });
      return Promise.all(reqs.slice(-40).reverse().map(function (r) {
        return caches.match(r).then(function (res) { return res ? res.text() : ''; }).then(function (html) {
          var m = /<title>([^<]*)<\/title>/i.exec(html);
          return { url: new URL(r.url).pathname, title: m ? m[1].split(' | ')[0] : '' };
        });
      }));
    }).then(function (pages) {
      pages = pages.filter(function (p) { return p.title; });
      if (!pages.length) return;
      var tmp = document.createElement('textarea');
      list.innerHTML = pages.map(function (p) {
        tmp.innerHTML = p.title; // HTML entiteti iz naslova
        return '<li><a href="' + V.esc(p.url) + '">' + V.esc(tmp.value) + '</a></li>';
      }).join('');
      document.getElementById('offl-recent').hidden = false;
    }).catch(function () { /* nema keša */ });
  }
})();
