/*
 * MyShishapedia - nargila barovi: kretanje i interakcija (HTML je već napravio build).
 *
 *   Karta BiH: ploča izroni, stubovi svjetla rastu (CSS, klasa is-play), iskre se dižu dok je karta na
 *   ekranu, brojevi se odbroje, dodir na grad u listi osvijetli njegov stub, karta se lagano nagne za prstom.
 *   "Najbliži lokal": lokacija ostaje u browseru; vodi na stranicu najbližeg grada (sortirano po blizini).
 *   Stranica grada: "Najbliže" (minute pješke, sortiranje), "Sa menijem", Lista/Mapa. Mapa (Leaflet +
 *   OpenStreetMap) se preuzima tek na prvo otvaranje, pa stranica ostaje brza.
 */
(function () {
  'use strict';

  var doc = document;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lang = doc.documentElement.lang || 'en';
  function $(s, r) { return (r || doc).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function data(id) { var el = doc.getElementById(id); try { return el ? JSON.parse(el.textContent) : null; } catch (e) { return null; } }

  /** Udaljenost u metrima (haversine). */
  function dist(a, b, c, d) {
    var R = 6371000, r = Math.PI / 180;
    var x = Math.sin((c - a) * r / 2), y = Math.sin((d - b) * r / 2);
    return 2 * R * Math.asin(Math.sqrt(x * x + Math.cos(a * r) * Math.cos(c * r) * y * y));
  }
  function fmtDist(m) {
    if (m < 1000) return Math.round(m / 10) * 10 + ' m';
    var km = (m / 1000).toFixed(m < 10000 ? 1 : 0);
    return (lang === 'en' ? km : km.replace('.', ',')) + ' km';
  }
  /** Minute pješke: zračna linija + 30% za ulice, 80 m u minuti. */
  function walkMin(m) { return Math.max(1, Math.round(m * 1.3 / 80)); }

  var pos = null;
  function locate(ok, fail) {
    if (pos) { ok(pos); return; }
    if (!navigator.geolocation) { fail(); return; }
    navigator.geolocation.getCurrentPosition(function (p) {
      pos = { la: p.coords.latitude, lo: p.coords.longitude };
      ok(pos);
    }, fail, { enableHighAccuracy: true, timeout: 12000, maximumAge: 120000 });
  }

  /* ------------------------------------------------------------------ */
  /* Karta BiH                                                           */
  /* ------------------------------------------------------------------ */

  function initBih() {
    var map = $('#bh-map');
    if (!map) return;
    var D = data('bx-data') || { near: [], t: {} };

    // pokretanje animacije kad je karta na ekranu; iskre samo dok se vidi
    function play() {
      if (map.classList.contains('is-play')) return;
      map.classList.add('is-play');
      if (!reduce) setTimeout(function () { map.classList.add('is-live'); }, 1600);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) play();
          map.classList.toggle('is-paused', !e.isIntersecting);
        });
      }, { threshold: 0.15 }).observe(map);
    } else play();

    // brojevi se odbroje od nule
    $$('.bx-stats [data-count]').forEach(function (el) {
      var n = +el.getAttribute('data-count');
      if (reduce || !n) return;
      var t0 = null;
      el.textContent = '0';
      function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / 1100);
        el.textContent = Math.round(n * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      }
      setTimeout(function () { requestAnimationFrame(step); }, 900);
    });

    // grad u listi ili oznaka na karti: osvijetli njegov stub
    function hl(id) {
      map.classList.toggle('is-dim', !!id);
      $$('.bh-beam, .bh-pill, .bc-row').forEach(function (el) { el.classList.toggle('is-hl', !!id && el.getAttribute('data-city') === id); });
    }
    $$('.bc-row, .bh-pill').forEach(function (el) {
      var id = el.getAttribute('data-city');
      el.addEventListener('mouseenter', function () { hl(id); });
      el.addEventListener('mouseleave', function () { hl(null); });
      el.addEventListener('focus', function () { hl(id); });
      el.addEventListener('blur', function () { hl(null); });
    });

    // lagani nagib karte za prstom ili mišem (samo transform, bez ponovnog crtanja)
    if (!reduce) {
      var svg = $('.bh-svg', map), raf = 0, tx = 0, ty = 0;
      function apply() { raf = 0; svg.style.transform = 'perspective(900px) rotateY(' + tx.toFixed(2) + 'deg) rotateX(' + ty.toFixed(2) + 'deg)'; }
      map.addEventListener('pointermove', function (e) {
        var r = map.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 10;
        ty = -((e.clientY - r.top) / r.height - 0.5) * 6;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      map.addEventListener('pointerleave', function () { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); });
      svg.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
    }

    // "Najbliži lokal"
    var btn = $('#bx-near'), sub = $('#bx-near-sub'), res = $('#bx-near-res');
    if (btn) btn.addEventListener('click', function () {
      if (!D.near.length) return;
      btn.classList.add('is-busy');
      var old = sub.textContent;
      sub.textContent = D.t.busy;
      locate(function (p) {
        btn.classList.remove('is-busy');
        sub.textContent = old;
        var best = null, bd = Infinity;
        D.near.forEach(function (b) { var d = dist(p.la, p.lo, b.la, b.lo); if (d < bd) { bd = d; best = b; } });
        if (best && best.u) { location.href = best.u + '?near=1'; return; }
        res.hidden = false;
        res.innerHTML = esc(D.t.res.replace('{name}', best.n).replace('{city}', best.c).replace('{dist}', fmtDist(bd))) +
          ' · <a href="' + esc(best.d) + '" target="_blank" rel="noopener">' + esc(D.t.dir) + '</a>';
      }, function () {
        btn.classList.remove('is-busy');
        sub.textContent = old;
        res.hidden = false;
        res.textContent = D.t.fail;
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Stranica grada                                                      */
  /* ------------------------------------------------------------------ */

  function initCity() {
    var root = $('#ct');
    if (!root) return;
    var D = data('ct-data') || { bars: [], t: {} };
    var T = D.t;
    var list = $('#ct-list'), mapView = $('#ct-map'), listEl = $('#bl-list');
    var status = doc.createElement('p');
    status.className = 'bx-near-res';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.hidden = true;
    var ctl = $('#ct-ctl');
    if (ctl) ctl.insertAdjacentElement('afterend', status);

    /* --- "Najbliže": minute pješke i redoslijed po blizini --- */
    var nearBtn = $('#ct-near');
    function applyNear(p) {
      var rows = $$('.bl', listEl);
      rows.forEach(function (row) {
        var la = parseFloat(row.getAttribute('data-lat')), lo = parseFloat(row.getAttribute('data-lon'));
        if (isNaN(la)) { row._d = Infinity; return; }
        var d = dist(p.la, p.lo, la, lo);
        row._d = d;
        row.classList.add('has-dist');
        $('.bl-n', row).innerHTML = '<b>' + walkMin(d) + '</b><small>' + esc(T.min) + '</small>';
        var dd = $('[data-dist]', row);
        if (dd) dd.textContent = ' · ' + fmtDist(d);
      });
      rows.sort(function (a, b) { return a._d - b._d; }).forEach(function (r) { listEl.appendChild(r); });
      $$('.bf[data-lat]').forEach(function (card) {
        var d = dist(p.la, p.lo, +card.getAttribute('data-lat'), +card.getAttribute('data-lon'));
        var dd = $('[data-dist]', card);
        if (dd) dd.textContent = ' · ' + walkMin(d) + ' ' + T.min;
      });
      if (leaf) showYou();
    }
    function doNear() {
      if (!nearBtn) return;
      nearBtn.classList.add('is-busy');
      locate(function (p) {
        nearBtn.classList.remove('is-busy');
        nearBtn.setAttribute('aria-pressed', 'true');
        status.hidden = true;
        applyNear(p);
      }, function () {
        nearBtn.classList.remove('is-busy');
        status.hidden = false;
        status.textContent = T.fail;
      });
    }
    if (nearBtn) nearBtn.addEventListener('click', doNear);
    if (/[?&]near=1/.test(location.search)) doNear();

    /* --- "Sa menijem": samo lokali koji gore --- */
    var litBtn = $('#ct-lit');
    if (litBtn) litBtn.addEventListener('click', function () {
      var on = litBtn.getAttribute('aria-pressed') !== 'true';
      litBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      $$('#ct-list > .bx-h, #bl-list').forEach(function (el) { el.hidden = on; });
      if (leaf) markers.forEach(function (m) { if (!m.b.lit) { if (on) m.mk.remove(); else m.mk.addTo(leaf); } });
    });

    /* --- Lista / Mapa --- */
    var seg = $$('.ct-seg button');
    function setView(v, focusId) {
      seg.forEach(function (b) { var on = b.getAttribute('data-view') === v; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
      list.hidden = v !== 'list';
      mapView.hidden = v !== 'map';
      var shown = v === 'list' ? list : mapView;
      shown.classList.remove('is-in');
      void shown.offsetWidth;
      if (!reduce) shown.classList.add('is-in');
      if (v === 'map') openMap(focusId);
    }
    seg.forEach(function (b) { b.addEventListener('click', function () { setView(b.getAttribute('data-view')); }); });
    $$('[data-onmap]').forEach(function (b) {
      b.hidden = false;
      b.addEventListener('click', function () { setView('map', b.getAttribute('data-onmap')); window.scrollTo({ top: $('#ct-ctl').getBoundingClientRect().top + window.scrollY - 90, behavior: reduce ? 'auto' : 'smooth' }); });
    });

    /* --- Mapa (Leaflet se preuzima tek sada) --- */
    var leaf = null, markers = [], youMk = null, loading = false, pendingFocus = null;
    function loadLeaflet(cb) {
      if (window.L && window.L.map) { cb(); return; }
      if (loading) return;
      loading = true;
      var body = doc.body;
      var css = doc.createElement('link');
      css.rel = 'stylesheet';
      css.href = body.getAttribute('data-leaflet-css');
      doc.head.appendChild(css);
      var s = doc.createElement('script');
      s.src = body.getAttribute('data-leaflet');
      s.onload = function () { loading = false; cb(); };
      s.onerror = function () { loading = false; };
      doc.head.appendChild(s);
    }
    function openMap(focusId) {
      pendingFocus = focusId || null;
      if (leaf) { leaf.invalidateSize(); if (pendingFocus) select(pendingFocus, true); return; }
      var box = $('#ct-mapbox');
      if (!box.firstChild) box.innerHTML = '<div class="ct-map__loading">…</div>';
      loadLeaflet(function () { buildMap(box); });
    }
    function buildMap(box) {
      var L = window.L;
      box.innerHTML = '';
      leaf = L.map(box, { zoomControl: false, scrollWheelZoom: false, tap: true, zoomSnap: 0.5, minZoom: 11, maxZoom: 19 });
      L.control.zoom({ position: 'topright', zoomInTitle: T.zin, zoomOutTitle: T.zout }).addTo(leaf);
      leaf.attributionControl.setPrefix(false);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19, detectRetina: true,
        attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
      }).addTo(leaf);
      // točkić miša zumira tek kad se klikne na mapu (stranica se normalno skrola)
      leaf.on('click', function () { leaf.scrollWheelZoom.enable(); });
      leaf.on('mouseout', function () { leaf.scrollWheelZoom.disable(); });
      var pts = [];
      // lokali sa dogovorom se upale zadnji (najjači sjaj)
      D.bars.slice().sort(function (a, b) { return a.lit - b.lit; }).forEach(function (b, i) {
        var delay = reduce ? 0 : (0.25 + i * 0.06).toFixed(2);
        var html = b.lit ? '<span class="bm-coal" style="--d:' + delay + 's">' + esc(b.m) + '</span>' : '<span class="bm-dot" style="--d:' + delay + 's"></span>';
        var size = b.lit ? 40 : 28;
        var mk = L.marker([b.la, b.lo], {
          icon: L.divIcon({ className: 'bm-pin' + (b.lit ? ' bm-pin--lit' : ''), html: html, iconSize: [size, size] }),
          keyboard: true, title: b.n, riseOnHover: true, zIndexOffset: b.lit ? 500 : 0
        }).addTo(leaf);
        mk.on('click', function () { select(b.id, false); });
        markers.push({ b: b, mk: mk });
        pts.push([b.la, b.lo]);
      });
      if (pts.length > 1) leaf.fitBounds(pts, { padding: [36, 36], maxZoom: 16 });
      else leaf.setView(pts[0] || [D.city.lat, D.city.lon], pts.length ? 16 : D.city.zoom);
      if (pos) showYou();
      if (pendingFocus) setTimeout(function () { select(pendingFocus, true); }, 350);
    }
    function showYou() {
      var L = window.L;
      if (!leaf || !pos) return;
      if (!youMk) youMk = L.marker([pos.la, pos.lo], { icon: L.divIcon({ className: 'bm-pin', html: '<span class="bm-you"></span>', iconSize: [20, 20] }), interactive: false, zIndexOffset: 1000 }).addTo(leaf);
      // ako je posjetilac u gradu: pokaži njega i 3 najbliža lokala
      var near = D.bars.map(function (b) { return [dist(pos.la, pos.lo, b.la, b.lo), b]; }).sort(function (a, b) { return a[0] - b[0]; });
      if (near.length && near[0][0] < 15000) {
        var pts = [[pos.la, pos.lo]].concat(near.slice(0, 3).map(function (x) { return [x[1].la, x[1].lo]; }));
        leaf.flyToBounds(pts, { padding: [40, 40], maxZoom: 17, duration: reduce ? 0 : 1.1 });
      }
    }
    var card = $('#ct-card');
    function select(id, fly) {
      var m = markers.filter(function (x) { return x.b.id === id; })[0];
      if (!m) return;
      markers.forEach(function (x) { var el = x.mk.getElement(); if (el) el.classList.toggle('is-sel', x === m); });
      $('#ct-mapbox').classList.add('bm-map-dim');
      var b = m.b;
      var extra = pos ? ' · ' + fmtDist(dist(pos.la, pos.lo, b.la, b.lo)) : '';
      card.className = 'ct-card' + (b.lit ? ' is-lit' : '');
      card.innerHTML =
        (b.lit ? '<span class="bc-coal" aria-hidden="true">' + esc(b.m) + '</span>' : '') +
        '<div class="ct-card__t"><b>' + esc(b.n) + '</b><small>' + esc(b.a) + esc(extra) + '</small></div>' +
        (b.ig ? '<a class="bl-ext" href="https://www.instagram.com/' + esc(b.ig) + '/" target="_blank" rel="noopener" aria-label="Instagram"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/></svg></a>' : '') +
        (b.lit && b.u ? '<a class="bl-go" href="' + esc(b.u) + '">' + esc(T.menu) + '</a>' : '<a class="bl-go" href="' + esc(b.d) + '" target="_blank" rel="noopener">' + esc(T.dir) + '</a>') +
        '<button type="button" class="ct-card__x" aria-label="' + esc(T.close) + '"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button>';
      card.hidden = false;
      $('.ct-card__x', card).addEventListener('click', function () {
        card.hidden = true;
        $('#ct-mapbox').classList.remove('bm-map-dim');
        markers.forEach(function (x) { var el = x.mk.getElement(); if (el) el.classList.remove('is-sel'); });
      });
      var z = Math.max(leaf.getZoom(), 16);
      if (fly) leaf.flyTo([b.la, b.lo], z, { duration: reduce ? 0 : 0.9 });
      else leaf.panTo([b.la, b.lo], { animate: !reduce });
    }
  }

  function init() { initBih(); initCity(); }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();
})();
