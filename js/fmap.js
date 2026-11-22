/*
 * MyShishapedia - Mapa okusa: crtanje i interakcija (canvas, bez biblioteka).
 *
 * Svijet nargile: noćni lounge kroz dim. Svaki okus je užareni ugalj (boja okusa, veličina = jačina,
 * prsten = tamni list) koji lagano pulsira i lebdi kao mjehurić u vazi. Krajevi mape su obojeni oblaci
 * dima. Ulaz: pogled odozgo u glavu nargile, kamera se povuče, dim se raziđe, a ugljevi odlete na mjesta.
 *
 *   Klik na okus: ugalj se zapali, kamera doleti, dimne niti (sa česticama) vode do 5 najsličnijih okusa
 *   (po svih 5 osobina profila), kartica sa profilom. Klik na susjeda: let do njega niz nit.
 *   Miks: dva okusa, klizač omjera pomjera tačku miksa, istaknu se okusi najbliži miksu, link u mikser.
 *   Moja polica: zlatno sazviježđe od okusa sa police i kraj mape u kojem je tvoj ukus.
 *   Pretraga, filteri (brend, vrsta; ostali se ugase u pepeo), Iznenadi me, zoom/pomjeranje (prsti,
 *   točkić, dvoklik, tastatura), ?f=<id> u adresi, "Spremi sliku" (PNG za story).
 *
 * Brzina: položaji se računaju jednom (i na promjenu veličine ekrana), sprite-ovi se crtaju unaprijed,
 * kvalitet (broj slojeva dima, iskri, gustina piksela) se sam smanji ako kadrovi kasne, u mirovanju se
 * crta 30 puta u sekundi, a van ekrana ili u skrivenom tabu ništa. prefers-reduced-motion: bez ulaza,
 * lebdenja i leta kamere.
 *
 * Ovisi o: views.js (V), views-fmap.js (tekstovi, krajevi), data/flavors.js, illustrations.js, shelf.js.
 */
(function () {
  'use strict';

  var doc = document;
  var MSP = window.MSP;
  var V = MSP && MSP.V;
  var host = doc.getElementById('fm');
  var dataEl = doc.getElementById('fm-data');
  if (!host || !V || !dataEl) return;

  var D;
  try { D = JSON.parse(dataEl.textContent); } catch (e) { return; }
  var T = D.tx;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var L = MSP.L || function (o) { return o && typeof o === 'object' ? (o[MSP.lang] || o.en || o.bs) : o; };
  function $(id) { return doc.getElementById(id); }
  function fmt(s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : m; }); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function eio(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function eo(x) { return 1 - Math.pow(1 - x, 3); }
  function back(x) { var c1 = 1.6, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6d2b79f5) >>> 0; var t = Math.imul(a ^ (a >>> 15), a | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  /* ------------------------------------------------------------------ */
  /* Boje                                                                */
  /* ------------------------------------------------------------------ */

  function hex2rgb(h) { h = String(h || '#f2a33c').replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgb2hsl(c) {
    var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2;
    if (mx !== mn) { var d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
    return [h, s, l];
  }
  function hsl2rgb(h, s, l) {
    function f(p, q, t) { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; }
    if (!s) return [l * 255, l * 255, l * 255];
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    return [f(p, q, h + 1 / 3) * 255, f(p, q, h) * 255, f(p, q, h - 1 / 3) * 255];
  }
  /** Boja okusa koja svijetli na tamnoj pozadini (tamna ljubičasta grožđa postaje svjetlija). */
  function glowColor(hex) {
    var hsl = rgb2hsl(hex2rgb(hex));
    return hsl2rgb(hsl[0], Math.max(hsl[1], 0.55), clamp(hsl[2], 0.56, 0.7)).map(Math.round);
  }
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function mixRgb(a, b, t) { return [Math.round(lerp(a[0], b[0], t)), Math.round(lerp(a[1], b[1], t)), Math.round(lerp(a[2], b[2], t))]; }

  /* ------------------------------------------------------------------ */
  /* Podaci                                                              */
  /* ------------------------------------------------------------------ */

  var FL = V.flavors();
  var N = FL.length;
  var P = FL.map(function (f, i) {
    var p = f.profile || {};
    var v = [p.sweetness || 0, p.freshness || 0, p.fruitiness || 0, p.cooling || 0, p.strength || 0];
    var h = hash(f.id);
    var ing = (f.ingredients || []).slice().sort(function (a, b) { return (b.intensity || 0) - (a.intensity || 0); })[0] || null;
    return {
      i: i, f: f, id: f.id, name: f.name, brand: f.brand, label: f.brand + ' ' + f.name,
      rgb: glowColor((f.palette && f.palette.primary) || (ing && ing.color) || '#f2a33c'),
      dark: f.leaf === 'dark', v: v, h: h,
      sz: 0.82 + v[4] * 0.045,                       // relativna veličina po jačini
      jx: ((h % 1000) / 1000 - 0.5), jy: (((h >>> 10) % 1000) / 1000 - 0.5),
      ph: ((h >>> 3) % 628) / 100, sp: 0.5 + ((h >>> 7) % 50) / 100,
      ing: ing, tags: f.tags || [],
      x: 0, y: 0, bx: 0, by: 0, r: 6, nb: [], img: null
    };
  });
  var byId = {};
  P.forEach(function (p) { byId[p.id] = p; });

  // 5 najsličnijih po svih 5 osobina profila
  function dist5(a, b) { var s = 0; for (var k = 0; k < 5; k++) { var d = a[k] - b[k]; s += d * d; } return s; }
  function nearestTo(vec, n, skip) {
    var out = [];
    for (var j = 0; j < N; j++) {
      if (skip && skip.indexOf(j) !== -1) continue;
      var d = dist5(vec, P[j].v) + (P[j].h % 97) * 1e-6;  // stabilan red kod istih vrijednosti
      if (out.length < n) { out.push([d, j]); out.sort(function (a, b) { return a[0] - b[0]; }); }
      else if (d < out[n - 1][0]) { out[n - 1] = [d, j]; out.sort(function (a, b) { return a[0] - b[0]; }); }
    }
    return out.map(function (o) { return o[1]; });
  }
  P.forEach(function (p) { p.nb = nearestTo(p.v, 5, [p.i]); });

  // krajevi mape
  var REG = V.fmapRegions().map(function (r, ri) {
    var meta = D.regions[ri] || { name: r.id };
    return { id: r.id, name: meta.name, rgb: hex2rgb(r.color), members: r.members.map(function (f) { return byId[f.id] ? byId[f.id].i : -1; }).filter(function (i) { return i >= 0; }), x: 0, y: 0 };
  }).filter(function (r) { return r.members.length >= 3; });
  P.forEach(function (p) { p.reg = REG.filter(function (r) { return r.members.indexOf(p.i) !== -1; }).map(function (r) { return r.name; }); });

  /* ------------------------------------------------------------------ */
  /* Canvas i raspored                                                   */
  /* ------------------------------------------------------------------ */

  var cv = $('fm-cv');
  var ctx = cv.getContext('2d');
  var bgc = $('fm-bg');
  var bgx = bgc.getContext('2d');
  var BGR = 0.6;
  var W = 0, H = 0, DPR = 1, Q = 2;                   // Q: kvalitet 2/1/0
  var cam = { x: 0, y: 0, k: 1 };
  var cloud = null, cloudScale = 0.5;
  var area = { l: 0, t: 0, r: 0, b: 0 };
  var isWide = false;

  function measureArea() {
    var hb = host.getBoundingClientRect();
    var head = doc.querySelector('.fm__head').getBoundingClientRect();
    var tools = doc.querySelector('.fm__tools').getBoundingClientRect();
    isWide = W >= 900;
    var top = Math.max(head.bottom, tools.bottom) - hb.top + (isWide ? 26 : 18);
    area = { l: isWide ? 70 : 26, r: W - (isWide ? 70 : 26), t: top + 10, b: H - (isWide ? 60 : 64) };
    var axT = doc.querySelector('.fm-ax--t');
    if (axT) axT.style.top = Math.round(top - 4) + 'px';
    area.t += 16;
  }

  /** Redoslijed vrijednosti od 0 do 1 (iste vrijednosti dobiju isti prosječni red). */
  function rankOf(arr, tie) {
    // iste vrijednosti se raspodijele po svom rasponu redova (po drugoj osi), da ne naprave kolonu
    var idx = arr.map(function (v, i) { return i; }).sort(function (a, b) { return arr[a] - arr[b] || tie[a] - tie[b]; });
    var out = new Array(arr.length);
    idx.forEach(function (j, k) { out[j] = k / Math.max(1, idx.length - 1); });
    return out;
  }

  /** Raspored: osnovni položaj iz profila, pa razmicanje dok se ugljevi ne preklapaju (uvijek isti rezultat). */
  function layout() {
    measureArea();
    var aw = area.r - area.l, ah = area.b - area.t;
    var cell = Math.sqrt(aw * ah / N);
    // osnovne vrijednosti osa, pa pola linearno a pola po redoslijedu (ravnomjernije popuni ekran, red ostaje isti)
    var rawX = P.map(function (p) { return ((p.v[1] - p.v[0]) + 9) / 18; });
    var rawY = P.map(function (p) { return (0.62 * p.v[3] + 0.38 * p.v[2]) / 10; });
    var rkX = rankOf(rawX, rawY.map(function (v, i) { return v * 10 + P[i].jx; })), rkY = rankOf(rawY, rawX.map(function (v, i) { return v * 10 + P[i].jy; }));
    var base = clamp(cell * 0.17, 3.6, 11);
    P.forEach(function (p) {
      var nx = 0.45 * rawX[p.i] + 0.55 * rkX[p.i];              // slatko -> svježe
      var ny = 0.45 * rawY[p.i] + 0.55 * rkY[p.i];              // toplo/kremasto -> ledeno
      p.bx = area.l + nx * aw + p.jx * cell * 0.5;
      p.by = area.b - ny * ah + p.jy * cell * 0.5;
      p.x = p.bx; p.y = p.by;
      p.r = base * p.sz;
    });
    var gs = Math.max(8, base * 4.5);
    for (var it = 0; it < 160; it++) {
      var grid = {};
      for (var a = 0; a < N; a++) {
        var key = Math.floor(P[a].x / gs) + ',' + Math.floor(P[a].y / gs);
        (grid[key] || (grid[key] = [])).push(a);
      }
      for (var i = 0; i < N; i++) {
        var p = P[i], cx = Math.floor(p.x / gs), cy = Math.floor(p.y / gs);
        for (var ox = -1; ox <= 1; ox++) for (var oy = -1; oy <= 1; oy++) {
          var list = grid[(cx + ox) + ',' + (cy + oy)];
          if (!list) continue;
          for (var q = 0; q < list.length; q++) {
            var j = list[q];
            if (j <= i) continue;
            var o = P[j], dx = o.x - p.x, dy = o.y - p.y, d = Math.sqrt(dx * dx + dy * dy);
            var min = (p.r + o.r) * 1.45 + 2;
            if (d < min) {
              if (d < 0.001) { dx = Math.cos(i * 2.4 + j); dy = Math.sin(i * 2.4 + j); d = 1; }
              var push = (min - d) / 2 / d;
              p.x -= dx * push; p.y -= dy * push; o.x += dx * push; o.y += dy * push;
            }
          }
        }
      }
      var pull = it < 120 ? 0.035 : 0.01;
      for (var k = 0; k < N; k++) {
        var pk = P[k];
        pk.x += (pk.bx - pk.x) * pull; pk.y += (pk.by - pk.y) * pull;
        pk.x = clamp(pk.x, area.l, area.r); pk.y = clamp(pk.y, area.t, area.b);
      }
    }
    // natpisi krajeva: težište članova, razmaknuti da se ne preklapaju
    REG.forEach(function (r) {
      var sx = 0, sy = 0;
      r.members.forEach(function (i) { sx += P[i].x; sy += P[i].y; });
      r.x = sx / r.members.length; r.y = sy / r.members.length;
    });
    for (var pass = 0; pass < 30; pass++) {
      for (var u = 0; u < REG.length; u++) for (var w = u + 1; w < REG.length; w++) {
        var A = REG[u], B = REG[w], ddx = B.x - A.x, ddy = B.y - A.y, dd = Math.sqrt(ddx * ddx + ddy * ddy) || 1;
        var mn = isWide ? 150 : 90;
        if (dd < mn) { var s = (mn - dd) / 2 / dd; A.x -= ddx * s * 0.6; A.y -= ddy * s; B.x += ddx * s * 0.6; B.y += ddy * s; }
      }
    }
    REG.forEach(function (r) { r.x = clamp(r.x, area.l + 40, area.r - 40); r.y = clamp(r.y, area.t + 10, area.b - 10); });
    buildCloud();
  }

  /** Oblaci krajeva: meke mrlje u boji kraja oko svakog člana (organski oblik), crtano jednom. */
  function buildCloud() {
    cloud = doc.createElement('canvas');
    cloudScale = Q >= 2 ? 0.5 : 0.35;
    cloud.width = Math.max(1, Math.round(W * cloudScale));
    cloud.height = Math.max(1, Math.round(H * cloudScale));
    var c = cloud.getContext('2d');
    c.globalCompositeOperation = 'lighter';
    var R = Math.max(40, Math.min(W, H) * 0.075) * cloudScale;
    REG.forEach(function (r) {
      var col = r.rgb;
      r.members.forEach(function (i) {
        var p = P[i], x = p.x * cloudScale, y = p.y * cloudScale;
        var g = c.createRadialGradient(x, y, 0, x, y, R);
        g.addColorStop(0, rgba(col, 0.06)); g.addColorStop(1, rgba(col, 0));
        c.fillStyle = g; c.beginPath(); c.arc(x, y, R, 0, 6.2832); c.fill();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Sprite-ovi (crtaju se jednom)                                       */
  /* ------------------------------------------------------------------ */

  var HALO = 64, CORE = 72, CF = 1.45;
  function makeSprites() {
    P.forEach(function (p) {
      var c = p.rgb;
      var h = doc.createElement('canvas'); h.width = h.height = HALO;
      var hc = h.getContext('2d'), g = hc.createRadialGradient(HALO / 2, HALO / 2, 0, HALO / 2, HALO / 2, HALO / 2);
      g.addColorStop(0, rgba(c, 0.5)); g.addColorStop(0.3, rgba(c, 0.16)); g.addColorStop(1, rgba(c, 0));
      hc.fillStyle = g; hc.fillRect(0, 0, HALO, HALO);
      p.halo = h;
      var k = doc.createElement('canvas'); k.width = k.height = CORE;
      var kc = k.getContext('2d'), m = CORE / 2 / CF;   // poluprečnik uglja (sprite ima mjesta i za prsten)
      kc.translate(CORE / 2 - m, CORE / 2 - m);
      var hi = mixRgb(c, [255, 246, 228], 0.7), lo = mixRgb(c, [40, 14, 6], 0.45);
      var g2 = kc.createRadialGradient(m - m * 0.25, m - m * 0.3, 0, m, m, m * 0.92);
      g2.addColorStop(0, rgba(hi, 1)); g2.addColorStop(0.45, rgba(c, 1)); g2.addColorStop(1, rgba(lo, 1));
      kc.fillStyle = g2; kc.beginPath(); kc.arc(m, m, m * 0.92, 0, 6.2832); kc.fill();
      // sitne pukotine žara (iskrice)
      var r = rng(p.h);
      kc.fillStyle = 'rgba(255,240,210,0.55)';
      for (var s = 0; s < 4; s++) { var a = r() * 6.28, d = r() * m * 0.6; kc.beginPath(); kc.arc(m + Math.cos(a) * d, m + Math.sin(a) * d, 0.8 + r() * 1.4, 0, 6.2832); kc.fill(); }
      if (p.dark) { kc.strokeStyle = 'rgba(255,122,42,0.85)'; kc.lineWidth = m * 0.16; kc.beginPath(); kc.arc(m, m, m * 1.32, 0, 6.2832); kc.stroke(); }
      p.core = k;
    });
    ASH = doc.createElement('canvas'); ASH.width = ASH.height = CORE;
    var ac = ASH.getContext('2d'), am = CORE / 2, ag = ac.createRadialGradient(am - 5, am - 6, 0, am, am, am / CF * 0.92);
    ag.addColorStop(0, '#77706a'); ag.addColorStop(1, '#2c2724');
    ac.fillStyle = ag; ac.beginPath(); ac.arc(am, am, am / CF * 0.92, 0, 6.2832); ac.fill();
    PUFF = doc.createElement('canvas'); PUFF.width = PUFF.height = 64;
    var pc = PUFF.getContext('2d'), pg = pc.createRadialGradient(32, 32, 0, 32, 32, 32);
    pg.addColorStop(0, 'rgba(255,236,210,0.9)'); pg.addColorStop(0.4, 'rgba(255,220,180,0.35)'); pg.addColorStop(1, 'rgba(255,210,170,0)');
    pc.fillStyle = pg; pc.fillRect(0, 0, 64, 64);
    // tri sloja dima: mrlje koje se ponavljaju bez šava (kopija preko ruba)
    SMOKE = [0, 1, 2].map(function (n) {
      var S = 320, c = doc.createElement('canvas'); c.width = c.height = S;
      var x = c.getContext('2d'), r = rng(77 + n * 31);
      for (var b = 0; b < 26; b++) {
        var bx = r() * S, by = r() * S, br = 30 + r() * 90, al = 0.018 + r() * 0.024;
        for (var ox = -1; ox <= 1; ox++) for (var oy = -1; oy <= 1; oy++) {
          var gx = bx + ox * S, gy = by + oy * S;
          if (gx + br < 0 || gx - br > S || gy + br < 0 || gy - br > S) continue;
          var g = x.createRadialGradient(gx, gy, 0, gx, gy, br);
          g.addColorStop(0, 'rgba(255,226,190,' + al + ')'); g.addColorStop(1, 'rgba(255,226,190,0)');
          x.fillStyle = g; x.beginPath(); x.arc(gx, gy, br, 0, 6.2832); x.fill();
        }
      }
      return { c: c, pat: null, sc: [3.2, 2.2, 1.5][n], vx: [6, -9, 13][n], vy: [-4, -7, -11][n], par: [0.15, 0.3, 0.5][n], a: [1, 0.9, 0.75][n] };
    });
    BOWL = makeBowlTexture();
  }
  var ASH, PUFF, SMOKE, BOWL;

  /** Duhan u glavi nargile (za ulaz): tamna vlakna u smeđim i narandžastim tonovima. */
  function makeBowlTexture() {
    var S = 360, c = doc.createElement('canvas'); c.width = c.height = S;
    var x = c.getContext('2d'), r = rng(9);
    x.fillStyle = '#2a140a'; x.beginPath(); x.arc(S / 2, S / 2, S / 2, 0, 6.2832); x.fill();
    x.save(); x.beginPath(); x.arc(S / 2, S / 2, S / 2, 0, 6.2832); x.clip();
    for (var i = 0; i < 900; i++) {
      var px = r() * S, py = r() * S, a = r() * 6.28, l = 6 + r() * 16;
      x.strokeStyle = ['#5a2c14', '#7a3d1a', '#3d1d0d', '#8f4a1e', '#a35a24'][Math.floor(r() * 5)];
      x.globalAlpha = 0.5 + r() * 0.5; x.lineWidth = 1 + r() * 1.6;
      x.beginPath(); x.moveTo(px, py); x.quadraticCurveTo(px + Math.cos(a + 1) * l * 0.6, py + Math.sin(a + 1) * l * 0.6, px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
    }
    x.restore();
    return c;
  }

  /* ------------------------------------------------------------------ */
  /* Kamera                                                              */
  /* ------------------------------------------------------------------ */

  function sx(x, view) { view = view || VIEW; return (x - view.cam.x) * view.cam.k + view.W / 2; }
  function sy(y, view) { view = view || VIEW; return (y - view.cam.y) * view.cam.k + view.H / 2; }
  function wx(px) { return (px - W / 2) / cam.k + cam.x; }
  function wy(py) { return (py - H / 2) / cam.k + cam.y; }
  var KMIN = 0.85, KMAX = 7;
  function clampCam() {
    cam.k = clamp(cam.k, KMIN, KMAX);
    var mx = W * 0.5, my = H * 0.5;
    cam.x = clamp(cam.x, mx - W * 0.45 / Math.min(1, cam.k), mx + W * 0.45 / Math.min(1, cam.k));
    cam.y = clamp(cam.y, my - H * 0.45 / Math.min(1, cam.k), my + H * 0.45 / Math.min(1, cam.k));
    if (cam.k > 1) {
      cam.x = clamp(cam.x, W / 2 / cam.k - 40, W - W / 2 / cam.k + 40);
      cam.y = clamp(cam.y, H / 2 / cam.k - 40, H - H / 2 / cam.k + 40);
    }
  }
  function fitCam() { cam.x = W / 2; cam.y = H / 2; cam.k = 1; }
  var fly = null;
  function flyTo(x, y, k, dur) {
    if (reduce) dur = 1;
    fly = { x0: cam.x, y0: cam.y, k0: cam.k, x1: x, y1: y, k1: clamp(k, KMIN, KMAX), t0: now, d: dur || 900 };
    vel.x = vel.y = 0;
    wake();
  }
  function zoomAt(px, py, f) {
    var bx = wx(px), by = wy(py);
    cam.k = clamp(cam.k * f, KMIN, KMAX);
    cam.x = bx - (px - W / 2) / cam.k;
    cam.y = by - (py - H / 2) / cam.k;
    clampCam(); wake();
  }
  /** Gdje na ekranu treba stajati izabrani okus (lijevo od panela na računaru, iznad kartice na telefonu). */
  function focusPoint() {
    if (isWide) return { x: (W - 400) / 2 + 10, y: H / 2 + 20 };
    var ch = Math.min(H * 0.46, (card && !card.hidden && card.offsetHeight) || H * 0.46);
    return { x: W / 2, y: (area.t + (H - ch)) / 2 + 6 };
  }
  function flyToPoint(p, k, dur) {
    k = k || Math.max(cam.k, isWide ? 2.2 : 2.6);
    var fp = focusPoint();
    flyTo(p.x - (fp.x - W / 2) / k, p.y - (fp.y - H / 2) / k, k, dur);
  }

  /* ------------------------------------------------------------------ */
  /* Stanje                                                              */
  /* ------------------------------------------------------------------ */

  var state = {
    sel: -1, selT: 0, prevSel: -1, hover: -1,
    mode: 'idle',              // idle | pick (bira drugi okus za miks) | mix | shelf
    mix: { a: -1, b: -1, r: 50, like: [] },
    shelf: [], shelfOn: false,
    brands: {}, tags: {}, match: null, matchN: N,
    intro: null, ready: false, dimT: 0
  };
  var now = 0, t0 = 0, last = 0, running = false, visible = true, raf = 0;
  var lastInteract = 0, frameSkip = false;
  var vel = { x: 0, y: 0 };
  var embers = [], puffs = [];
  var VIEW = { ctx: ctx, W: 0, H: 0, cam: cam };
  var BGVIEW = { ctx: bgx, W: 0, H: 0, cam: cam };

  /* ------------------------------------------------------------------ */
  /* Veličina ekrana i kvalitet                                          */
  /* ------------------------------------------------------------------ */

  function resize(qualityOnly) {
    var r = cv.getBoundingClientRect();
    var nw = Math.max(1, Math.round(r.width)), nh = Math.max(1, Math.round(r.height));
    var sizeChanged = nw !== W || nh !== H;
    W = nw; H = nh;
    var max = Q >= 2 ? 2 : Q === 1 ? 1.5 : 1;
    DPR = Math.min(window.devicePixelRatio || 1, max);
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    VIEW.W = W; VIEW.H = H; BGVIEW.W = W; BGVIEW.H = H;
    BGR = Q >= 2 ? 0.6 : Q === 1 ? 0.5 : 0.4;
    bgc.width = Math.round(W * BGR); bgc.height = Math.round(H * BGR);
    bgDirty = true;
    SMOKE.forEach(function (s) { s.pat = bgx.createPattern(s.c, 'repeat'); });
    // promjena kvaliteta mijenja samo oštrinu, raspored ostaje (ugljevi ne skaču)
    if (qualityOnly && !sizeChanged) { if (Q < 2) buildCloud(); wake(); return; }
    layout();
    if (state.sel < 0 && state.mode !== 'mix') fitCam(); else clampCam();
    wake();
  }
  var frames = [], qCheckAt = 0, fStart = 0;
  function trackFrame(dt) {
    if (!frames.length) fStart = now;
    frames.push(dt);
    if (frames.length < 20 || now - fStart < 1000) return;
    var sum = 0; for (var i = 0; i < frames.length; i++) sum += frames[i];
    var avg = sum / frames.length; frames.length = 0;
    if (avg > 22 && Q > 0 && now > qCheckAt) { Q--; qCheckAt = now + 1200; resize(true); }
  }

  /* ------------------------------------------------------------------ */
  /* Crtanje                                                             */
  /* ------------------------------------------------------------------ */

  function inView(x, y, m, view) { var X = sx(x, view), Y = sy(y, view); return X > -m && X < view.W + m && Y > -m && Y < view.H + m; }
  function related(i) {
    if (state.mode === 'mix' || state.mode === 'pick') {
      var m = state.mix;
      return i === m.a || i === m.b || m.like.indexOf(i) !== -1 || (state.mode === 'pick' && true);
    }
    if (state.shelfOn && state.shelf.length) return state.shelf.indexOf(i) !== -1;
    if (state.sel < 0) return true;
    return i === state.sel || P[state.sel].nb.indexOf(i) !== -1;
  }
  function passes(i) { return !state.match || state.match[i]; }

  function drawSmoke(c, view, t) {
    var n = Q >= 2 ? 3 : Q === 1 ? 2 : 1;
    for (var i = 0; i < n; i++) {
      var s = SMOKE[i];
      if (!s.pat) continue;
      var tt = reduce ? 0 : t;
      var ox = tt * s.vx - view.cam.x * s.par * view.cam.k, oy = tt * s.vy - view.cam.y * s.par * view.cam.k;
      c.save();
      c.globalAlpha = s.a;
      c.translate(ox % (320 * s.sc), oy % (320 * s.sc));
      c.scale(s.sc, s.sc);
      c.fillStyle = s.pat;
      c.fillRect(-640, -640, view.W / s.sc + 1280, view.H / s.sc + 1280);
      c.restore();
    }
  }

  function drawClouds(c, view, t) {
    if (!cloud) return;
    var br = reduce ? 1 : 0.85 + 0.15 * Math.sin(t * 0.5);
    c.save();
    c.globalAlpha = br * (1 - state.dimT * 0.55);
    c.globalCompositeOperation = 'screen';
    var k = view.cam.k;
    c.drawImage(cloud, sx(0, view), sy(0, view), W * k, H * k);
    c.restore();
  }

  function drawRegionLabels(c, view, t) {
    var a0 = (1 - state.dimT * 0.8) * (state.ready ? 1 : 0) * clamp(1.9 - view.cam.k * 0.6, 0.25, 1);
    if (a0 <= 0.02) return;
    var fs = isWide ? 14 : 11.5;
    c.save();
    c.font = '700 ' + fs + 'px Manrope, system-ui, sans-serif';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    REG.forEach(function (r, i) {
      var X = sx(r.x, view), Y = sy(r.y, view);
      if (X < -100 || X > view.W + 100 || Y < -40 || Y > view.H + 40) return;
      var breath = reduce ? 0.8 : 0.62 + 0.28 * Math.sin(t * 0.6 + i * 1.3);
      var txt = r.name.toUpperCase();
      var w = c.measureText(txt).width;
      c.globalAlpha = a0 * breath;
      c.fillStyle = 'rgba(12,8,6,0.62)';
      roundRect(c, X - w / 2 - 14, Y - fs, w + 28, fs * 2, fs);
      c.fill();
      c.fillStyle = rgba(mixRgb(r.rgb, [255, 244, 228], 0.45), 1);
      c.fillText(txt.split('').join(String.fromCharCode(8202)), X, Y + 0.5);
    });
    c.restore();
  }
  function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

  function pos(p, t, view) {
    var bob = (reduce || Q === 0) ? 0 : Math.sin(t * p.sp + p.ph) * 1.6;
    var x = p.x, y = p.y + bob;
    var I = state.intro;
    if (I) {
      var e = I.burst(p, t);
      x = lerp(I.cx, x, e); y = lerp(I.cy, y, e);
    }
    return [x, y];
  }

  /** Dimna nit između dva okusa: zakrivljena linija i čestice dima koje teku po njoj. */
  function thread(c, view, a, b, t, k, strong) {
    var x1 = sx(a[0], view), y1 = sy(a[1], view), x2 = sx(b[0], view), y2 = sy(b[1], view);
    var dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var bend = (k % 2 ? 1 : -1) * Math.min(80, len * 0.22);
    var mx = (x1 + x2) / 2 - dy / len * bend, my = (y1 + y2) / 2 + dx / len * bend;
    var ca = a[2], cb = b[2];
    var g = c.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0, rgba(ca, 0.55 * strong)); g.addColorStop(1, rgba(cb, 0.45 * strong));
    c.strokeStyle = g;
    c.lineCap = 'round';
    c.lineWidth = 6; c.globalAlpha = 0.18;
    c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(mx, my, x2, y2); c.stroke();
    c.lineWidth = 1.4; c.globalAlpha = 0.9;
    c.beginPath(); c.moveTo(x1, y1); c.quadraticCurveTo(mx, my, x2, y2); c.stroke();
    if (reduce) { c.globalAlpha = 1; return; }
    var n = Q >= 1 ? 7 : 4, speed = strong > 1 ? 0.75 : 0.32;
    c.globalCompositeOperation = 'lighter';
    for (var i = 0; i < n; i++) {
      var u = (t * speed + i / n + k * 0.13) % 1;
      var iu = 1 - u;
      var px = iu * iu * x1 + 2 * iu * u * mx + u * u * x2, py = iu * iu * y1 + 2 * iu * u * my + u * u * y2;
      var s = 7 + 6 * Math.sin(u * Math.PI);
      c.globalAlpha = 0.55 * Math.sin(u * Math.PI);
      c.drawImage(PUFF, px - s, py - s, s * 2, s * 2);
    }
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;
  }

  function drawPoints(c, view, t, mode) {
    mode = mode || 'all';
    var k = view.cam.k;
    var sel = state.sel, dim = state.dimT;
    var showIll = true;
    var order = [];
    for (var i = 0; i < N; i++) order.push(i);
    // izabrani i susjedi na kraju (iznad ostalih)
    if (sel >= 0) order.sort(function (a, b) { return (related(a) ? 1 : 0) - (related(b) ? 1 : 0); });
    var pts = [];
    c.globalCompositeOperation = 'screen';
    for (var o = 0; o < N; o++) {
      var i2 = order[o], p = P[i2];
      var q = pos(p, t, view);
      if (!inView(q[0], q[1], 60, view)) continue;
      var X = sx(q[0], view), Y = sy(q[1], view), R = p.r * k;
      var rel = related(i2), ok = passes(i2);
      var a = ok ? (rel ? 1 : 1 - dim * 0.78) : 0.35;
      pts.push([i2, X, Y, R, a, ok, rel]);
      if (!ok || mode === 'core') continue;
      var pulse = reduce ? 1 : 0.78 + 0.22 * Math.sin(t * (1.1 + p.sp) + p.ph * 2);
      var hs = R * (state.match ? 3.4 : 2.9) * (i2 === sel ? 1.5 : 1) * (0.92 + 0.12 * pulse);
      var flash = 0;
      if (i2 === sel) { var e = (now - state.selT) / 700; if (e < 1) flash = 1 - e; }
      if (state.intro) { var ia = state.intro.arrive(p, t); if (ia > 0 && ia < 1) flash = Math.max(flash, 1 - ia); }
      c.globalAlpha = a * (0.55 + 0.45 * pulse) * (dim && !rel ? 0.6 : 1);
      var hz = hs * (1 + flash * 1.4);
      c.drawImage(p.halo, X - hz, Y - hz, hz * 2, hz * 2);
    }
    c.globalCompositeOperation = 'source-over';
    if (mode === 'halo') { c.globalAlpha = 1; return pts; }
    for (var n = 0; n < pts.length; n++) {
      var it = pts[n], pp = P[it[0]], X2 = it[1], Y2 = it[2], R2 = it[3], RS = R2 * CF;
      c.globalAlpha = it[4];
      if (!it[5]) { c.drawImage(ASH, X2 - RS, Y2 - RS, RS * 2, RS * 2); continue; }
      var illA = showIll ? clamp((R2 - 14) / 7, 0, 1) : 0;
      if (illA < 1) {
        c.globalAlpha = it[4] * (1 - illA * 0.85);
        c.drawImage(pp.core, X2 - RS, Y2 - RS, RS * 2, RS * 2);
      }
      if (illA > 0) {
        var im = illustration(pp);
        if (im) { c.globalAlpha = it[4] * illA; var S = R2 * 2.5; c.drawImage(S <= 64 ? pp.illS : im, X2 - S / 2, Y2 - S / 2, S, S); }
        else if (illA >= 1) { c.globalAlpha = it[4]; c.drawImage(pp.core, X2 - RS, Y2 - RS, RS * 2, RS * 2); }
      }
    }
    c.globalAlpha = 1;
    return pts;
  }

  var labelBoxes = [];
  function drawNames(c, view, pts, t) {
    var k = view.cam.k, sel = state.sel;
    labelBoxes.length = 0;
    c.save();
    c.textAlign = 'center'; c.textBaseline = 'top';
    var list = pts.slice().sort(function (a, b) { return (b[6] ? 1 : 0) - (a[6] ? 1 : 0) || b[3] - a[3]; });
    for (var i = 0; i < list.length; i++) {
      var it = list[i], idx = it[0], p = P[idx];
      var force = idx === sel || idx === state.hover || (sel >= 0 && P[sel].nb.indexOf(idx) !== -1) ||
        ((state.mode === 'mix') && (idx === state.mix.a || idx === state.mix.b || state.mix.like.indexOf(idx) !== -1)) ||
        (state.shelfOn && state.shelf.indexOf(idx) !== -1);
      if (!force && (it[3] < 15 || !it[5])) continue;
      if (!force && state.dimT > 0.3 && !it[6]) continue;
      var big = idx === sel;
      var fs = big ? (isWide ? 15 : 14) : clamp(it[3] * 0.62, 10, 13);
      c.font = (big ? '800 ' : '700 ') + fs + 'px Manrope, system-ui, sans-serif';
      var txt = big ? p.label : p.name;
      var w = c.measureText(txt).width, x = it[1], y = it[2] + it[3] * (big ? 1.6 : 1.35) + 3;
      var box = [x - w / 2 - 4, y - 2, w + 8, fs + 6];
      var hit = false;
      for (var b = 0; b < labelBoxes.length; b++) { var o = labelBoxes[b]; if (box[0] < o[0] + o[2] && box[0] + box[2] > o[0] && box[1] < o[1] + o[3] && box[1] + box[3] > o[1]) { hit = true; break; } }
      if (hit && !force) continue;
      labelBoxes.push(box);
      c.globalAlpha = it[4];
      c.fillStyle = 'rgba(10,7,5,0.62)';
      roundRect(c, box[0] - 2, box[1], box[2] + 4, box[3], (fs + 6) / 2); c.fill();
      c.fillStyle = big ? '#fff3e2' : '#ead9c6';
      c.fillText(txt, x, y + 1);
    }
    c.restore();
  }

  function drawSelection(c, view, t) {
    var sel = state.sel;
    if (sel < 0 || state.mode === 'mix' || state.mode === 'pick' || state.shelfOn) return;
    var p = P[sel], q = pos(p, t, view);
    var travelling = fly && (now - fly.t0) < fly.d;
    p.nb.forEach(function (j, k) {
      var o = P[j], r = pos(o, t, view);
      thread(c, view, [q[0], q[1], p.rgb], [r[0], r[1], o.rgb], t, k, (travelling && j === state.prevSel) ? 1.6 : 1);
    });
    var X = sx(q[0], view), Y = sy(q[1], view), R = p.r * view.cam.k;
    // prsten paljenja
    var e = (now - state.selT) / 900;
    if (e < 1 && !reduce) {
      c.strokeStyle = rgba(mixRgb(p.rgb, [255, 240, 220], 0.4), (1 - e) * 0.9);
      c.lineWidth = 3 * (1 - e) + 0.5;
      c.beginPath(); c.arc(X, Y, R * 1.6 + eo(e) * 70, 0, 6.2832); c.stroke();
    }
    // tanki prsten i tačkica koja kruži oko izabranog
    c.strokeStyle = 'rgba(255,236,206,0.55)'; c.lineWidth = 1.2;
    c.beginPath(); c.arc(X, Y, R * 1.9 + 6, 0, 6.2832); c.stroke();
    var ang = reduce ? -0.8 : t * 1.4;
    c.fillStyle = '#ff5a3c';
    c.beginPath(); c.arc(X + Math.cos(ang) * (R * 1.9 + 6), Y + Math.sin(ang) * (R * 1.9 + 6), 3, 0, 6.2832); c.fill();
  }

  function drawMix(c, view, t) {
    if (state.mode !== 'mix') return;
    var m = state.mix, A = P[m.a], B = P[m.b];
    var qa = pos(A, t, view), qb = pos(B, t, view);
    var r = m.r / 100;
    var mx = lerp(qb[0], qa[0], r), my = lerp(qb[1], qa[1], r);
    var x1 = sx(qa[0], view), y1 = sy(qa[1], view), x2 = sx(qb[0], view), y2 = sy(qb[1], view);
    var g = c.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0, rgba(A.rgb, 0.5)); g.addColorStop(1, rgba(B.rgb, 0.5));
    c.strokeStyle = g; c.lineCap = 'round';
    c.globalAlpha = 0.25; c.lineWidth = 14; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.globalAlpha = 0.9; c.lineWidth = 2; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.globalAlpha = 1;
    if (!reduce) {
      c.globalCompositeOperation = 'lighter';
      for (var i = 0; i < 10; i++) {
        var u = (t * 0.3 + i / 10) % 1, dir = i % 2 ? u : 1 - u;
        var px = lerp(x1, x2, dir), py = lerp(y1, y2, dir), s = 8 * Math.sin(u * Math.PI) + 3;
        c.globalAlpha = 0.5 * Math.sin(u * Math.PI);
        c.drawImage(PUFF, px - s, py - s, s * 2, s * 2);
      }
      c.globalCompositeOperation = 'source-over';
    }
    var col = mixRgb(B.rgb, A.rgb, r);
    var X = sx(mx, view), Y = sy(my, view);
    // niti od miksa do sličnih okusa
    m.like.forEach(function (j, k) {
      var o = P[j], q = pos(o, t, view);
      thread(c, view, [mx, my, col], [q[0], q[1], o.rgb], t, k, 0.8);
      var OX = sx(q[0], view), OY = sy(q[1], view), OR = o.r * view.cam.k;
      var pl = reduce ? 0.5 : 0.5 + 0.5 * Math.sin(t * 3 + k);
      c.strokeStyle = rgba(o.rgb, 0.5 + 0.4 * pl); c.lineWidth = 1.5;
      c.beginPath(); c.arc(OX, OY, OR * 1.8 + 3 + pl * 3, 0, 6.2832); c.stroke();
    });
    var R = 13 + (reduce ? 0 : 2 * Math.sin(t * 2.4));
    var hg = c.createRadialGradient(X, Y, 0, X, Y, R * 4);
    hg.addColorStop(0, rgba(col, 0.6)); hg.addColorStop(1, rgba(col, 0));
    c.fillStyle = hg; c.beginPath(); c.arc(X, Y, R * 4, 0, 6.2832); c.fill();
    var cg = c.createRadialGradient(X - 4, Y - 5, 0, X, Y, R);
    cg.addColorStop(0, '#fff6e4'); cg.addColorStop(0.5, rgba(col, 1)); cg.addColorStop(1, rgba(mixRgb(col, [30, 10, 4], 0.4), 1));
    c.fillStyle = cg; c.beginPath(); c.arc(X, Y, R, 0, 6.2832); c.fill();
    c.font = '800 12px Manrope, system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'bottom';
    c.fillStyle = '#fff3e2'; c.fillText(m.r + ' / ' + (100 - m.r), X, Y - R - 8);
  }

  function drawShelf(c, view, t) {
    if (!state.shelfOn || state.shelf.length < 1) return;
    var pts = state.shelf.map(function (i) { var q = pos(P[i], t, view); return [sx(q[0], view), sy(q[1], view), P[i]]; });
    if (pts.length > 1) {
      c.save();
      c.strokeStyle = 'rgba(255,214,140,0.85)'; c.lineWidth = 1.4; c.lineJoin = 'round';
      c.shadowColor = 'rgba(255,190,90,0.8)'; c.shadowBlur = Q >= 2 ? 10 : 0;
      c.beginPath();
      pts.forEach(function (q, i) { if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); });
      c.stroke();
      c.restore();
    }
    pts.forEach(function (q, i) {
      var tw = reduce ? 1 : 0.6 + 0.4 * Math.sin(t * 2.2 + i);
      var s = (q[2].r * view.cam.k + 6) * (0.9 + 0.3 * tw);
      c.strokeStyle = 'rgba(255,222,150,' + (0.5 + 0.5 * tw) + ')'; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(q[0] - s, q[1]); c.lineTo(q[0] + s, q[1]); c.moveTo(q[0], q[1] - s); c.lineTo(q[0], q[1] + s); c.stroke();
    });
  }

  function drawEmbers(c, view, dt) {
    var want = reduce ? 0 : Q >= 2 ? 26 : Q === 1 ? 12 : 0;
    while (embers.length < want) embers.push(newEmber(true));
    if (embers.length > want) embers.length = want;
    c.globalCompositeOperation = 'lighter';
    for (var i = 0; i < embers.length; i++) {
      var e = embers[i];
      e.life += dt; e.y -= e.vy * dt; e.x += Math.sin(e.life * e.w) * 8 * dt;
      if (e.life > e.max || e.y < -10) { embers[i] = newEmber(false); continue; }
      var a = Math.sin(e.life / e.max * Math.PI) * (0.5 + 0.5 * Math.sin(e.life * 9 + e.w));
      c.globalAlpha = a * 0.8;
      c.fillStyle = e.c;
      c.beginPath(); c.arc(e.x, e.y, e.s, 0, 6.2832); c.fill();
    }
    for (var j = puffs.length - 1; j >= 0; j--) {
      var p = puffs[j];
      p.life += dt;
      if (p.life > p.max) { puffs.splice(j, 1); continue; }
      var u = p.life / p.max, s = p.s * (1 + u * 2.2);
      c.globalAlpha = (1 - u) * p.a;
      c.drawImage(PUFF, p.x - s, p.y - s - u * 20, s * 2, s * 2);
    }
    c.globalCompositeOperation = 'source-over';
    c.globalAlpha = 1;
  }
  function newEmber(any) {
    return { x: Math.random() * W, y: any ? Math.random() * H : H + 5, vy: 12 + Math.random() * 26, w: 1 + Math.random() * 2, s: 0.8 + Math.random() * 1.4,
      life: 0, max: 5 + Math.random() * 6, c: Math.random() < 0.7 ? '#ff9a3c' : '#ffd27a' };
  }

  /** Glava nargile za ulaz: glina, duhan, tri užarena uglja. */
  function drawBowl(c, X, Y, R, a, glow) {
    if (a <= 0 || R < 2) return;
    c.save();
    c.globalAlpha = a;
    var g = c.createRadialGradient(X, Y, R * 0.78, X, Y, R * 1.12);
    g.addColorStop(0, '#5a2f1a'); g.addColorStop(0.5, '#8a4a28'); g.addColorStop(1, 'rgba(40,20,10,0)');
    c.fillStyle = g; c.beginPath(); c.arc(X, Y, R * 1.12, 0, 6.2832); c.fill();
    c.drawImage(BOWL, X - R * 0.8, Y - R * 0.8, R * 1.6, R * 1.6);
    var hg = c.createRadialGradient(X, Y, 0, X, Y, R * 0.9);
    hg.addColorStop(0, 'rgba(255,120,40,' + (0.35 * glow) + ')'); hg.addColorStop(1, 'rgba(255,120,40,0)');
    c.fillStyle = hg; c.beginPath(); c.arc(X, Y, R * 0.9, 0, 6.2832); c.fill();
    for (var i = 0; i < 3; i++) {
      var an = -Math.PI / 2 + i * 2.094, cx = X + Math.cos(an) * R * 0.36, cy = Y + Math.sin(an) * R * 0.36, s = R * 0.27;
      c.save(); c.translate(cx, cy); c.rotate(an + 0.4);
      var cg = c.createLinearGradient(-s / 2, -s / 2, s / 2, s / 2);
      cg.addColorStop(0, '#3a3532'); cg.addColorStop(1, '#1a1716');
      c.fillStyle = cg; roundRect(c, -s / 2, -s / 2, s, s, s * 0.14); c.fill();
      c.globalCompositeOperation = 'lighter';
      var eg = c.createRadialGradient(0, 0, 0, 0, 0, s * 0.75);
      eg.addColorStop(0, 'rgba(255,150,60,' + (0.85 * glow) + ')'); eg.addColorStop(0.6, 'rgba(255,80,20,' + (0.45 * glow) + ')'); eg.addColorStop(1, 'rgba(255,60,10,0)');
      c.fillStyle = eg; c.fillRect(-s, -s, s * 2, s * 2);
      c.restore();
    }
    c.restore();
  }

  /** layers: 'bg' (dim, oblaci, sjaj ugljeva: poseban canvas manje rezolucije, rjeđe), 'fg' (ostalo), 'all' (slika za story). */
  function drawScene(view, t, layers) {
    var c = view.ctx;
    if (layers !== 'fg') {
      drawSmoke(c, view, t);
      drawClouds(c, view, t);
      drawPoints(c, view, t, 'halo');
      if (layers === 'bg') return null;
    }
    drawShelf(c, view, t);
    drawSelection(c, view, t);
    drawMix(c, view, t);
    var pts = drawPoints(c, view, t, 'core');
    drawRegionLabels(c, view, t);
    if (!state.intro) drawNames(c, view, pts, t);
    return pts;
  }
  var lastBg = 0, bgCam = { x: 0, y: 0, k: 0 }, bgDirty = true, bgShift = false;
  /**
   * Pozadina (dim, oblaci, sjaj) se crta rjeđe. Dok se kamera pomjera, stara slika se samo pomjeri i
   * uveća CSS transformacijom (radi grafička kartica), a nova se nacrta najviše svakih 120 ms.
   */
  function drawBg(t) {
    var moved = cam.x !== bgCam.x || cam.y !== bgCam.y || cam.k !== bgCam.k;
    var animating = state.intro || (now - state.selT) < 900 || Math.abs(state.dimT - (state.sel >= 0 || state.mode === 'mix' || (state.shelfOn && state.shelf.length) ? 1 : 0)) > 0.01;
    var gap = reduce ? 1e9 : (Q >= 2 ? 66 : Q === 1 ? 100 : 160);
    if (moved && !bgDirty && !state.intro && now - lastBg < 120) {
      var sc = cam.k / bgCam.k;
      // tačka svijeta X je bila na (X - bgCam.x) * bgCam.k + W/2, a sada je na (X - cam.x) * cam.k + W/2
      var tx = (bgCam.x - cam.x) * cam.k + (W / 2) * (1 - sc), ty = (bgCam.y - cam.y) * cam.k + (H / 2) * (1 - sc);
      bgc.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + sc.toFixed(4) + ')';
      bgShift = true;
      return;
    }
    if (!bgDirty && now - lastBg < (animating ? 50 : gap)) return;
    lastBg = now; bgDirty = false; bgCam.x = cam.x; bgCam.y = cam.y; bgCam.k = cam.k;
    if (bgShift) { bgc.style.transform = ''; bgShift = false; }
    bgx.setTransform(BGR, 0, 0, BGR, 0, 0);
    bgx.clearRect(0, 0, W, H);
    drawScene(BGVIEW, t, 'bg');
  }

  function frame(ts) {
    raf = 0;
    if (!running) return;
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
    var idle = !fly && !state.intro && !drag.active && Math.abs(vel.x) + Math.abs(vel.y) < 0.02 && now - lastInteract > 4000 && now - state.selT > 1200;
    if (idle && (frameSkip = !frameSkip)) { raf = requestAnimationFrame(frame); return; }
    if (last) trackFrame(ts - last);
    last = ts; now = ts;
    var t = (ts - t0) / 1000;
    // let kamere
    if (fly) {
      var e = clamp((now - fly.t0) / fly.d, 0, 1), ee = eio(e);
      // let "lukom": malo se udalji na pola puta kad je put dug
      var span = Math.hypot(fly.x1 - fly.x0, fly.y1 - fly.y0) * fly.k0 / Math.max(W, H);
      var dip = span > 0.35 ? Math.sin(e * Math.PI) * Math.min(0.45, span * 0.5) : 0;
      cam.x = lerp(fly.x0, fly.x1, ee); cam.y = lerp(fly.y0, fly.y1, ee);
      cam.k = lerp(fly.k0, fly.k1, ee) * (1 - dip);
      if (e >= 1) { fly = null; clampCam(); }
    } else if (!drag.active && (Math.abs(vel.x) > 0.01 || Math.abs(vel.y) > 0.01)) {
      cam.x -= vel.x * dt * 60 / cam.k; cam.y -= vel.y * dt * 60 / cam.k;
      vel.x *= 0.92; vel.y *= 0.92;
      clampCam();
    }
    // zatamnjenje ostatka mape kad je nešto izabrano
    var dimTarget = (state.sel >= 0 || state.mode === 'mix' || (state.shelfOn && state.shelf.length)) ? 1 : 0;
    state.dimT += (dimTarget - state.dimT) * Math.min(1, dt * 6);
    if (state.intro && t > state.intro.end) endIntro();

    illBudget = fly ? 1 : 2;
    drawBg(t);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    drawScene(VIEW, t, 'fg');
    if (state.intro) drawIntro(t);
    drawEmbers(ctx, VIEW, dt);
    raf = requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------------ */
  /* Ulaz                                                                */
  /* ------------------------------------------------------------------ */

  function startIntro(full) {
    var cx = W / 2, cy = (area.t + area.b) / 2;
    var maxD = 0;
    P.forEach(function (p) { p.dd = Math.hypot(p.x - cx, p.y - cy); if (p.dd > maxD) maxD = p.dd; });
    var s0 = full ? 0.75 : 0.0, sp = full ? 1.35 : 0.85, each = full ? 0.75 : 0.55;
    state.intro = {
      full: full, cx: cx, cy: cy, end: s0 + sp * 0.6 + each + 0.15,
      start: function (p) { return s0 + (p.dd / maxD) * sp * 0.6 + ((p.h % 100) / 100) * 0.12; },
      burst: function (p, t) { var u = (t - this.start(p)) / each; return u <= 0 ? 0 : u >= 1 ? 1 : back(u); },
      arrive: function (p, t) { return (t - this.start(p) - each * 0.7) / 0.5; }
    };
    $('fm-skip').hidden = false;
    t0 = performance.now();
  }
  function drawIntro(t) {
    var I = state.intro;
    if (!I.full) return;
    var R0 = Math.max(W, H) * 0.62;
    var u = clamp(t / 1.25, 0, 1);
    var R = R0 * (u < 0.35 ? lerp(1.12, 1, u / 0.35) : lerp(1, 0.04, eio((u - 0.35) / 0.65)));
    var a = u < 0.55 ? 1 : 1 - (u - 0.55) / 0.45;
    var glow = 0.6 + 0.4 * Math.sin(t * 7) * (u < 0.4 ? 1 : 0.3);
    // tamna pozadina iza glave na početku
    ctx.fillStyle = 'rgba(10,6,4,' + clamp(1 - u * 1.4, 0, 1) + ')';
    ctx.fillRect(0, 0, W, H);
    drawBowl(ctx, I.cx, I.cy, R, a, glow);
    // oblak dima koji se raziđe
    var sm = clamp((t - 0.45) / 1.1, 0, 1);
    if (sm > 0 && sm < 1) {
      ctx.globalCompositeOperation = 'lighter';
      var r = rng(5);
      for (var i = 0; i < 14; i++) {
        var an = r() * 6.28, d = eo(sm) * Math.max(W, H) * (0.25 + r() * 0.45), s = (90 + r() * 140) * (0.6 + sm);
        ctx.globalAlpha = (1 - sm) * 0.5;
        ctx.drawImage(PUFF, I.cx + Math.cos(an) * d - s, I.cy + Math.sin(an) * d - s, s * 2, s * 2);
      }
      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    }
  }
  function endIntro() {
    state.intro = null;
    $('fm-skip').hidden = true;
    ready();
  }
  function ready() {
    if (state.ready) return;
    state.ready = true;
    host.classList.add('is-ready');
    setTimeout(preloadIll, 600);
    var f = null;
    try { f = new URLSearchParams(location.search).get('f'); } catch (e) { /* stari browser */ }
    if (f && byId[f]) select(byId[f].i, { fly: true, keepUrl: true });
    else setTimeout(function () { if (!state.touched) $('fm-hint').classList.add('is-on'); }, 400);
  }

  /* ------------------------------------------------------------------ */
  /* Ilustracije voća (na većem uvećanju)                                */
  /* ------------------------------------------------------------------ */

  var illBudget = 0, preIdx = 0;
  /** Ilustracije se pripremaju jedna po jedna dok browser miruje, pa su spremne prije uvećanja. */
  function preloadIll() {
    var ric = window.requestIdleCallback || function (fn) { return setTimeout(function () { fn({ timeRemaining: function () { return 8; } }); }, 60); };
    ric(function (dl) {
      while (preIdx < N && (P[preIdx].ill || P[preIdx].img === false)) preIdx++;
      if (preIdx >= N) return;
      if (fly || drag.active) { preloadIll(); return; }
      var p = P[preIdx];
      if (!p.img) { illBudget = 1; illustration(p); }
      var wait = function () { if (p.ill || p.img === false) preloadIll(); else setTimeout(wait, 30); };
      wait();
    }, { timeout: 800 });
  }
  /** SVG ilustracija se pretvori u malu sliku (canvas) jednom; crtanje SVG-a u svakom kadru bi bilo sporo. */
  function illustration(p) {
    if (p.img === false) return null;
    if (p.ill) return p.ill;
    if (p.img || illBudget <= 0) return null;
    if (!p.ing || !MSP.illustrate) { p.img = false; return null; }
    illBudget--;
    var svg = MSP.illustrate(p.ing.illustration, { color: p.ing.color });
    var im = new Image();
    im.onload = function () {
      // dvije veličine: mala za uobičajeno uvećanje (brže crtanje), velika za izbliza
      try {
        var c = doc.createElement('canvas'); c.width = c.height = 128; c.getContext('2d').drawImage(im, 0, 0, 128, 128);
        var m = doc.createElement('canvas'); m.width = m.height = 56; m.getContext('2d').drawImage(c, 0, 0, 56, 56);
        p.illS = m; p.ill = c;
      } catch (e) { p.img = false; }
      wake();
    };
    im.onerror = function () { p.img = false; };
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    p.img = im;
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* Kartica                                                             */
  /* ------------------------------------------------------------------ */

  var card = $('fm-card');
  function illHtml(p, cls) {
    return p.ing && MSP.illustrate ? MSP.illustrate(p.ing.illustration, { color: p.ing.color, className: cls }) : '';
  }
  function dotStyle(p) { return 'background:' + rgba(p.rgb, 1) + ';box-shadow:0 0 10px ' + rgba(p.rgb, 0.8); }
  function nbList(list) {
    return '<ul class="fm-nb" role="list">' + list.map(function (j) {
      var o = P[j];
      return '<li><button type="button" class="fm-nb__b" data-go="' + j + '"><span class="fm-nb__d" style="' + dotStyle(o) + '"></span>' +
        '<span class="fm-nb__t"><b>' + esc(o.name) + '</b><span>' + esc(o.brand) + '</span></span>' +
        '<svg class="fm-nb__a" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></button></li>';
    }).join('') + '</ul>';
  }
  function cardShell(inner, cls) {
    card.className = 'fm-card ' + (cls || '');
    card.innerHTML = '<span class="fm-card__grab" aria-hidden="true"></span>' +
      '<button type="button" class="fm-card__x" data-act="close" aria-label="' + esc(T.close) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
      '<div class="fm-card__in">' + inner + '</div>';
    card.hidden = false;
    card.scrollTop = 0;
    host.classList.add('has-card');
    requestAnimationFrame(function () { card.classList.add('is-open'); });
  }
  function closeCard() {
    card.classList.remove('is-open');
    host.classList.remove('has-card');
    setTimeout(function () { if (!card.classList.contains('is-open')) card.hidden = true; }, 320);
  }

  function flavorCard(p) {
    var f = p.f;
    var bars = D.profile.map(function (lab, k) {
      return '<li><span>' + esc(lab) + '</span><i><b style="--w:' + (p.v[k] * 10) + '%;background:' + rgba(p.rgb, 1) + '"></b></i><em>' + p.v[k] + '</em></li>';
    }).join('');
    var ings = (f.ingredients || []).map(function (g) { return L(g.name); }).filter(Boolean).join(' · ');
    cardShell(
      '<div class="fm-card__top"><span class="fm-card__ill" style="--c:' + rgba(p.rgb, 0.35) + '">' + illHtml(p, 'fm-card__svg') + '</span>' +
        '<div><p class="fm-card__brand">' + esc(p.brand) + '</p><h2 class="fm-card__name">' + esc(p.name) + '</h2>' +
        '<p class="fm-card__meta">' + (p.reg[0] ? '<span class="fm-dot" style="' + dotStyle(p) + '"></span>' + esc(p.reg[0]) + ' · ' : '') + esc(p.dark ? T.dark : T.light) + '</p></div></div>' +
      '<p class="fm-card__desc">' + esc(L(f.shortDescription) || '') + '</p>' +
      '<ul class="fm-bars" role="list">' + bars + '</ul>' +
      (ings ? '<p class="fm-card__ings">' + esc(ings) + '</p>' : '') +
      '<div class="fm-card__acts"><a class="btn btn--primary" href="' + esc(V.flavorUrl(f)) + '">' + esc(T.openFlavor) + '</a>' +
        '<button type="button" class="btn btn--ghost" data-act="mix">' + esc(T.mixWith) + '</button></div>' +
      '<p class="fm-card__h">' + esc(T.neighbors) + '</p>' + nbList(p.nb),
      'fm-card--flavor'
    );
  }

  function mixCard() {
    var m = state.mix, A = P[m.a], B = P[m.b];
    cardShell(
      '<p class="fm-card__brand">' + esc(T.mixTitle) + '</p>' +
      '<div class="fm-mix__pair"><span><i class="fm-nb__d" style="' + dotStyle(A) + '"></i>' + esc(A.label) + '</span><span><i class="fm-nb__d" style="' + dotStyle(B) + '"></i>' + esc(B.label) + '</span></div>' +
      '<label class="fm-mix__lab" for="fm-ratio">' + esc(T.ratio) + ' <output id="fm-ratio-out">' + m.r + ' / ' + (100 - m.r) + '</output></label>' +
      '<input type="range" id="fm-ratio" class="fm-mix__range" min="10" max="90" step="5" value="' + m.r + '" style="--a:' + rgba(A.rgb, 1) + ';--b:' + rgba(B.rgb, 1) + '">' +
      '<p class="fm-card__h">' + esc(T.mixLike) + '</p><div id="fm-like">' + nbList(m.like) + '</div>' +
      '<div class="fm-card__acts"><a class="btn btn--primary" id="fm-mixer" href="' + esc(V.mixUrl(A.f, B.f, m.r)) + '">' + esc(T.openMixer) + '</a>' +
        '<button type="button" class="btn btn--ghost" data-act="cancel">' + esc(T.cancel) + '</button></div>',
      'fm-card--mix'
    );
    var range = $('fm-ratio');
    range.addEventListener('input', function () {
      m.r = +range.value;
      $('fm-ratio-out').textContent = m.r + ' / ' + (100 - m.r);
      updateLike();
      $('fm-like').innerHTML = nbList(m.like);
      $('fm-mixer').setAttribute('href', V.mixUrl(A.f, B.f, m.r));
      wake(); lastInteract = now;
    });
  }
  function updateLike() {
    var m = state.mix, r = m.r / 100, a = P[m.a].v, b = P[m.b].v, v = [];
    for (var k = 0; k < 5; k++) v.push(a[k] * r + b[k] * (1 - r));
    m.like = nearestTo(v, 3, [m.a, m.b]);
  }

  function pickCard() {
    cardShell('<p class="fm-card__brand">' + esc(T.mixTitle) + '</p><h2 class="fm-card__name fm-card__name--sm">' + esc(P[state.mix.a].label) + ' + …</h2>' +
      '<p class="fm-card__desc">' + esc(T.pickSecond) + '</p>' +
      '<div class="fm-card__acts"><button type="button" class="btn btn--ghost" data-act="cancel">' + esc(T.cancel) + '</button></div>', 'fm-card--pick');
  }

  function shelfCard() {
    var list = state.shelf;
    if (!list.length) {
      cardShell('<p class="fm-card__brand">' + esc(T.shelfTitle) + '</p><p class="fm-card__desc">' + esc(T.shelfEmpty) + '</p>' +
        '<div class="fm-card__acts"><a class="btn btn--primary" href="' + esc(D.shelfUrl) + '">' + esc(T.browse) + '</a></div>', 'fm-card--shelf');
      return;
    }
    var count = {};
    list.forEach(function (i) { P[i].reg.forEach(function (r) { count[r] = (count[r] || 0) + 1; }); });
    var top = Object.keys(count).sort(function (a, b) { return count[b] - count[a]; })[0];
    cardShell('<p class="fm-card__brand">' + esc(T.shelfTitle) + '</p>' +
      '<h2 class="fm-card__name fm-card__name--sm">' + esc(fmt(T.shelfN, { n: list.length })) + '</h2>' +
      (top ? '<p class="fm-card__desc">' + esc(fmt(T.shelfIn, { r: top })) + '</p>' : '') + nbList(list.slice(0, 12)), 'fm-card--shelf');
  }

  card.addEventListener('click', function (e) {
    var go = e.target.closest('[data-go]');
    if (go) { var j = +go.getAttribute('data-go'); if (state.mode === 'mix' || state.shelfOn) { state.mode = 'idle'; setShelf(false, true); } select(j, { fly: true }); return; }
    var act = e.target.closest('[data-act]');
    if (!act) return;
    var a = act.getAttribute('data-act');
    if (a === 'close') { deselect(); }
    else if (a === 'mix') { state.mode = 'pick'; state.mix.a = state.sel; pickCard(); toast(T.pickSecond); wake(); }
    else if (a === 'cancel') { var s = state.mix.a; state.mode = 'idle'; if (s >= 0) select(s, { fly: false }); else deselect(); }
  });

  // povlačenje kartice na telefonu (dolje zatvara, gore proširuje)
  (function () {
    var sy0 = 0, dy = 0, on = false;
    card.addEventListener('pointerdown', function (e) {
      if (isWide || !e.target.closest('.fm-card__grab, .fm-card__top, .fm-card__brand')) return;
      on = true; sy0 = e.clientY; dy = 0; card.style.transition = 'none';
    });
    window.addEventListener('pointermove', function (e) {
      if (!on) return;
      dy = e.clientY - sy0;
      card.style.transform = 'translateY(' + Math.max(-60, dy) + 'px)';
    });
    window.addEventListener('pointerup', function () {
      if (!on) return;
      on = false; card.style.transition = ''; card.style.transform = '';
      if (dy > 90) deselect();
      else if (dy < -40) card.classList.add('is-tall');
    });
  })();

  /* ------------------------------------------------------------------ */
  /* Radnje                                                              */
  /* ------------------------------------------------------------------ */

  function select(i, opts) {
    opts = opts || {};
    touched();
    if (state.mode === 'pick' && i !== state.mix.a) {
      state.mix.b = i; state.mode = 'mix'; state.mix.r = 50;
      var cr = V.coolerRatio ? V.coolerRatio(P[state.mix.a].f, P[i].f) : null;
      if (cr) state.mix.r = cr;
      updateLike(); mixCard();
      var A = P[state.mix.a], B = P[i];
      var k = clamp(Math.min(W, H) * 0.55 / (Math.hypot(A.x - B.x, A.y - B.y) + 1), 1, 3);
      var fp = focusPoint();
      flyTo((A.x + B.x) / 2 - (fp.x - W / 2) / k, (A.y + B.y) / 2 - (fp.y - H / 2) / k, k, 1000);
      announce(A.label + ' + ' + B.label);
      return;
    }
    if (state.shelfOn && !opts.keepShelf) setShelf(false, true);
    state.prevSel = state.sel;
    state.sel = i; state.selT = now || performance.now();
    var p = P[i];
    flavorCard(p);
    if (opts.fly !== false) flyToPoint(p, null, state.prevSel >= 0 ? 1100 : 950);
    announce(fmt(T.selected, { name: p.label, list: p.nb.map(function (j) { return P[j].label; }).join(', ') }));
    if (!opts.keepUrl) setUrl(p.id);
    if (!reduce) for (var s = 0; s < 6; s++) puffs.push({ x: sx(p.x), y: sy(p.y), s: 10 + Math.random() * 14, a: 0.5, life: 0, max: 0.9 + Math.random() * 0.5 });
    wake();
  }
  function deselect() {
    state.sel = -1; state.mode = 'idle'; state.mix.a = state.mix.b = -1;
    if (state.shelfOn) setShelf(false, true);
    closeCard();
    setUrl(null);
    wake();
  }
  function setUrl(id) {
    try {
      var u = new URL(location.href);
      if (id) u.searchParams.set('f', id); else u.searchParams.delete('f');
      history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    } catch (e) { /* ignore */ }
  }
  var live = $('fm-live');
  function announce(s) { live.textContent = s; }
  var toastT = 0;
  function toast(s) {
    var el = $('fm-toast');
    el.textContent = s; el.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(function () { el.classList.remove('is-on'); }, 2600);
  }
  function touched() {
    state.touched = true; lastInteract = now || performance.now();
    $('fm-hint').classList.remove('is-on');
  }

  function setShelf(on, quiet) {
    state.shelfOn = on;
    var btn = $('fm-shelf');
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (!on) { if (!quiet) closeCard(); wake(); return; }
    var ids = MSP.Shelf ? MSP.Shelf.list() : [];
    var idx = ids.map(function (id) { return byId[id] ? byId[id].i : -1; }).filter(function (i) { return i >= 0; });
    // redoslijed sazviježđa: uvijek najbliži sljedeći (od najljevijeg)
    var path = [];
    if (idx.length) {
      var rest = idx.slice().sort(function (a, b) { return P[a].x - P[b].x; });
      path.push(rest.shift());
      while (rest.length) {
        var lastP = P[path[path.length - 1]], bi = 0, bd = Infinity;
        rest.forEach(function (j, k) { var d = Math.hypot(P[j].x - lastP.x, P[j].y - lastP.y); if (d < bd) { bd = d; bi = k; } });
        path.push(rest.splice(bi, 1)[0]);
      }
    }
    state.shelf = path;
    state.sel = -1; state.mode = 'idle';
    shelfCard();
    if (path.length) {
      var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      path.forEach(function (i) { minX = Math.min(minX, P[i].x); maxX = Math.max(maxX, P[i].x); minY = Math.min(minY, P[i].y); maxY = Math.max(maxY, P[i].y); });
      var k = clamp(Math.min((isWide ? W - 420 : W) * 0.7 / (maxX - minX + 40), H * 0.45 / (maxY - minY + 40)), 1, 3);
      var fp = focusPoint();
      flyTo((minX + maxX) / 2 - (fp.x - W / 2) / k, (minY + maxY) / 2 - (fp.y - H / 2) / k, k, 1000);
    }
    wake();
  }

  function surprise() {
    var pool = [];
    for (var i = 0; i < N; i++) if (passes(i) && i !== state.sel) pool.push(i);
    if (!pool.length) return;
    if (state.mode === 'mix' || state.mode === 'pick') state.mode = 'idle';
    select(pool[Math.floor(Math.random() * pool.length)], { fly: true });
  }

  /* ------------------------------------------------------------------ */
  /* Filteri i pretraga                                                  */
  /* ------------------------------------------------------------------ */

  var filtersEl = $('fm-filters'), fBtn = $('fm-filters-btn');
  function applyFilters() {
    var bs = Object.keys(state.brands), ts = Object.keys(state.tags);
    if (!bs.length && !ts.length) { state.match = null; state.matchN = N; }
    else {
      state.match = P.map(function (p) {
        return (!bs.length || state.brands[p.brand]) && (!ts.length || ts.some(function (g) { return p.tags.indexOf(g) !== -1; }));
      });
      state.matchN = state.match.filter(Boolean).length;
    }
    var nF = bs.length + ts.length;
    var badge = $('fm-fcount');
    badge.hidden = !nF; badge.textContent = nF;
    $('fm-shown').textContent = fmt(T.shown, { n: state.matchN, t: N });
    $('fm-count').textContent = state.match ? fmt(T.shown, { n: state.matchN, t: N }) : fmt(T.count, { n: N });
    wake();
  }
  fBtn.addEventListener('click', function () {
    var open = filtersEl.hidden;
    filtersEl.hidden = !open;
    fBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    host.classList.toggle('has-filters', open);
    touched();
  });
  filtersEl.addEventListener('click', function (e) {
    var b = e.target.closest('.fm-chip');
    if (b) {
      var kind = b.hasAttribute('data-brand') ? 'brands' : 'tags', id = b.getAttribute(kind === 'brands' ? 'data-brand' : 'data-tag');
      var on = !state[kind][id];
      if (on) state[kind][id] = 1; else delete state[kind][id];
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      applyFilters(); touched();
      return;
    }
    if (e.target.closest('#fm-reset')) {
      state.brands = {}; state.tags = {};
      Array.prototype.forEach.call(filtersEl.querySelectorAll('.fm-chip'), function (c) { c.setAttribute('aria-pressed', 'false'); });
      applyFilters();
    }
  });

  var qIn = $('fm-q'), sug = $('fm-sug'), sugIdx = -1, sugList = [];
  function norm(s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  P.forEach(function (p) { p.key = norm(p.label); p.nkey = norm(p.name); });
  function runSearch() {
    var q = norm(qIn.value.trim());
    if (!q) { sug.hidden = true; qIn.setAttribute('aria-expanded', 'false'); return; }
    var res = [];
    P.forEach(function (p) {
      var s = p.nkey.indexOf(q) === 0 ? 3 : p.key.indexOf(q) === 0 ? 2 : p.key.indexOf(q) !== -1 ? 1 : 0;
      if (s) res.push([s, p.i]);
    });
    res.sort(function (a, b) { return b[0] - a[0] || P[a[1]].label.localeCompare(P[b[1]].label); });
    sugList = res.slice(0, 7).map(function (r) { return r[1]; });
    sugIdx = sugList.length ? 0 : -1;
    sug.innerHTML = sugList.length ? sugList.map(function (j, k) {
      var o = P[j];
      return '<li role="option" id="fm-s' + k + '" aria-selected="' + (k === 0) + '"><button type="button" tabindex="-1" data-go="' + j + '"><span class="fm-nb__d" style="' + dotStyle(o) + '"></span><b>' + esc(o.name) + '</b> <span>' + esc(o.brand) + '</span></button></li>';
    }).join('') : '<li class="fm-search__none">' + esc(T.noResults) + '</li>';
    sug.hidden = false; qIn.setAttribute('aria-expanded', 'true');
  }
  function pickSug(j) {
    qIn.value = ''; sug.hidden = true; qIn.setAttribute('aria-expanded', 'false');
    qIn.blur();
    select(j, { fly: true });
  }
  qIn.addEventListener('input', runSearch);
  qIn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!sugList.length) return;
      e.preventDefault();
      sugIdx = (sugIdx + (e.key === 'ArrowDown' ? 1 : -1) + sugList.length) % sugList.length;
      Array.prototype.forEach.call(sug.children, function (li, k) { li.setAttribute('aria-selected', k === sugIdx ? 'true' : 'false'); });
      qIn.setAttribute('aria-activedescendant', 'fm-s' + sugIdx);
    } else if (e.key === 'Enter') {
      if (sugIdx >= 0) { e.preventDefault(); pickSug(sugList[sugIdx]); }
    } else if (e.key === 'Escape') { qIn.value = ''; runSearch(); }
  });
  sug.addEventListener('mousedown', function (e) { e.preventDefault(); });
  sug.addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) pickSug(+b.getAttribute('data-go')); });
  qIn.addEventListener('blur', function () { setTimeout(function () { sug.hidden = true; }, 150); });

  $('fm-shelf').addEventListener('click', function () { touched(); setShelf(!state.shelfOn); });
  $('fm-surprise').addEventListener('click', surprise);
  $('fm-zin').addEventListener('click', function () { touched(); var fp = focusPoint(); zoomAt(state.sel >= 0 ? sx(P[state.sel].x) : W / 2, state.sel >= 0 ? sy(P[state.sel].y) : H / 2, 1.5); });
  $('fm-zout').addEventListener('click', function () { touched(); zoomAt(W / 2, H / 2, 1 / 1.5); });
  $('fm-fit').addEventListener('click', function () { touched(); flyTo(W / 2, H / 2, 1, 800); });
  $('fm-skip').addEventListener('click', function () { if (state.intro) { state.intro = null; t0 = performance.now(); $('fm-skip').hidden = true; ready(); } });
  $('fm-save').addEventListener('click', saveImage);

  /* ------------------------------------------------------------------ */
  /* Prsti, miš, točkić, tastatura                                       */
  /* ------------------------------------------------------------------ */

  var ptrs = {}, drag = { active: false, moved: 0, sx: 0, sy: 0, lx: 0, ly: 0, lt: 0, pinch: 0, pk: 1, px: 0, py: 0 };
  function hit(px, py) {
    var best = -1, bd = Infinity;
    for (var i = 0; i < N; i++) {
      var p = P[i];
      if (state.match && !state.match[i]) continue;
      var X = sx(p.x), Y = sy(p.y), d = Math.hypot(X - px, Y - py);
      var lim = Math.max(isWide ? 16 : 22, p.r * cam.k * 1.6);
      if (d < lim && d < bd) { bd = d; best = i; }
    }
    return best;
  }
  function local(e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  cv.addEventListener('pointerdown', function (e) {
    if (state.intro) { $('fm-skip').click(); return; }
    var l = local(e);
    ptrs[e.pointerId] = l;
    try { cv.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    var ids = Object.keys(ptrs);
    fly = null; vel.x = vel.y = 0;
    if (ids.length === 1) { drag.active = true; drag.moved = 0; drag.sx = drag.lx = l[0]; drag.sy = drag.ly = l[1]; drag.lt = performance.now(); }
    else if (ids.length === 2) {
      var a = ptrs[ids[0]], b = ptrs[ids[1]];
      drag.pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); drag.pk = cam.k; drag.moved = 99;
      drag.px = (a[0] + b[0]) / 2; drag.py = (a[1] + b[1]) / 2;
      drag.wx = wx(drag.px); drag.wy = wy(drag.py);
    }
    touched(); wake();
  });
  cv.addEventListener('pointermove', function (e) {
    var l = local(e);
    if (!ptrs[e.pointerId]) {
      if (e.pointerType === 'mouse') {
        var hv = hit(l[0], l[1]);
        if (hv !== state.hover) { state.hover = hv; cv.style.cursor = hv >= 0 ? 'pointer' : 'grab'; wake(); }
        if (!reduce && Q >= 1 && Math.random() < 0.35) { puffs.push({ x: l[0], y: l[1], s: 6 + Math.random() * 6, a: 0.16, life: 0, max: 1 + Math.random() * 0.6 }); if (puffs.length > 50) puffs.shift(); wake(); }
      }
      return;
    }
    ptrs[e.pointerId] = l;
    var ids = Object.keys(ptrs);
    if (ids.length === 2) {
      var a = ptrs[ids[0]], b = ptrs[ids[1]];
      var d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      cam.k = clamp(drag.pk * d / (drag.pinch || 1), KMIN, KMAX);
      cam.x = drag.wx - (mx - W / 2) / cam.k; cam.y = drag.wy - (my - H / 2) / cam.k;
      clampCam(); wake();
      return;
    }
    if (!drag.active) return;
    var dx = l[0] - drag.lx, dy = l[1] - drag.ly;
    drag.moved += Math.abs(dx) + Math.abs(dy);
    if (drag.moved > 6) {
      cam.x -= dx / cam.k; cam.y -= dy / cam.k; clampCam();
      var tnow = performance.now(), dtm = Math.max(1, tnow - drag.lt);
      vel.x = dx / dtm * 16; vel.y = dy / dtm * 16;
      drag.lt = tnow;
      cv.style.cursor = 'grabbing';
    }
    drag.lx = l[0]; drag.ly = l[1];
    wake();
  });
  function up(e) {
    if (!ptrs[e.pointerId]) return;
    var l = ptrs[e.pointerId];
    delete ptrs[e.pointerId];
    var left = Object.keys(ptrs).length;
    if (left === 1) { var k = Object.keys(ptrs)[0]; drag.lx = ptrs[k][0]; drag.ly = ptrs[k][1]; drag.lt = performance.now(); return; }
    if (left) return;
    drag.active = false;
    cv.style.cursor = state.hover >= 0 ? 'pointer' : 'grab';
    if (performance.now() - drag.lt > 80) { vel.x = vel.y = 0; }
    if (drag.moved <= 6 && e.type === 'pointerup') {
      vel.x = vel.y = 0;
      var i = hit(l[0], l[1]);
      if (i >= 0) select(i, { fly: true });
      else if (state.mode !== 'pick' && state.mode !== 'mix' && (state.sel >= 0 || state.shelfOn)) deselect();
    }
    wake();
  }
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
  cv.addEventListener('pointerleave', function () { if (state.hover >= 0) { state.hover = -1; wake(); } });
  cv.addEventListener('wheel', function (e) {
    e.preventDefault();
    var l = local(e);
    fly = null;
    zoomAt(l[0], l[1], Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0016)));
    touched();
  }, { passive: false });
  cv.addEventListener('dblclick', function (e) { var l = local(e); fly = null; zoomAt(l[0], l[1], 1.8); });

  cv.addEventListener('keydown', function (e) {
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') {
      e.preventDefault();
      var from = state.sel >= 0 ? P[state.sel] : { x: wx(W / 2), y: wy(H / 2), i: -1 };
      var dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[k];
      var best = -1, bs = Infinity;
      for (var i = 0; i < N; i++) {
        if (i === from.i || !passes(i)) continue;
        var dx = P[i].x - from.x, dy = P[i].y - from.y, d = Math.hypot(dx, dy) || 1;
        var dot = (dx * dir[0] + dy * dir[1]) / d;
        if (dot < 0.5) continue;
        var score = d * (2 - dot);
        if (score < bs) { bs = score; best = i; }
      }
      if (best >= 0) select(best, { fly: true });
    } else if (k === 'Enter' && state.sel >= 0) {
      location.href = V.flavorUrl(P[state.sel].f);
    } else if (k === 'Escape') {
      deselect();
    } else if (k === '+' || k === '=') { zoomAt(W / 2, H / 2, 1.4); }
    else if (k === '-') { zoomAt(W / 2, H / 2, 1 / 1.4); }
  });
  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !filtersEl.hidden) { fBtn.click(); }
  });

  /* ------------------------------------------------------------------ */
  /* Spremi sliku (story 1080x1920)                                      */
  /* ------------------------------------------------------------------ */

  function saveImage() {
    touched();
    var S = doc.createElement('canvas'); S.width = 1080; S.height = 1920;
    var c = S.getContext('2d');
    var bg = c.createRadialGradient(540, 900, 0, 540, 900, 1300);
    bg.addColorStop(0, '#2c1a0f'); bg.addColorStop(0.5, '#140c08'); bg.addColorStop(1, '#070403');
    c.fillStyle = bg; c.fillRect(0, 0, 1080, 1920);
    // kadar za story: visina mape popuni sliku (strane se odrežu), izabrani okus ili polica u sredini
    var mapH = 1380, scale = mapH / H;
    var cx0 = cam.x, cy0 = cam.y, kk = cam.k * scale;
    if (state.sel >= 0 && state.mode !== 'mix') { cx0 = P[state.sel].x; cy0 = P[state.sel].y; kk = Math.max(kk, 2.4 * scale); }
    var view = { ctx: c, W: 1080, H: mapH, cam: { x: cx0, y: cy0, k: kk } };
    c.save(); c.translate(0, 300);
    c.beginPath(); c.rect(0, 0, 1080, mapH); c.clip();
    var keepIntro = state.intro; state.intro = null;
    var tt = (performance.now() - t0) / 1000;
    drawScene(view, tt, 'all');
    state.intro = keepIntro;
    var fade = c.createLinearGradient(0, 0, 0, mapH);
    fade.addColorStop(0, 'rgba(8,5,4,0.9)'); fade.addColorStop(0.08, 'rgba(8,5,4,0)'); fade.addColorStop(0.9, 'rgba(8,5,4,0)'); fade.addColorStop(1, 'rgba(8,5,4,0.95)');
    c.fillStyle = fade; c.fillRect(0, 0, 1080, mapH);
    c.restore();
    c.textAlign = 'center';
    c.fillStyle = '#f2a33c'; c.font = '800 30px Manrope, system-ui, sans-serif';
    c.fillText('MYSHISHAPEDIA', 540, 170);
    c.fillStyle = '#f6eee4'; c.font = '800 84px Manrope, system-ui, sans-serif';
    var title = state.mode === 'mix' ? P[state.mix.a].name + ' + ' + P[state.mix.b].name : state.sel >= 0 ? P[state.sel].name : state.shelfOn && state.shelf.length ? T.shelfTitle : (T.h1 || T.eyebrow);
    fitText(c, title, 960, 84);
    c.fillText(title, 540, 262);
    c.fillStyle = '#ff5a3c'; c.beginPath(); c.arc(540, 1745, 7, 0, 6.2832); c.fill();
    c.fillStyle = '#e9dccd'; c.font = '700 40px Manrope, system-ui, sans-serif';
    c.fillText(state.sel >= 0 ? P[state.sel].brand + ' · ' + T.eyebrow : T.eyebrow, 540, 1720);
    c.fillStyle = '#f2a33c';
    roundRect(c, 330, 1780, 420, 76, 38); c.fill();
    c.fillStyle = '#1a110c'; c.font = '800 34px Manrope, system-ui, sans-serif';
    c.fillText('myshishapedia.com', 540, 1830);
    S.toBlob(function (blob) {
      if (!blob) return;
      var name = 'myshishapedia-' + (state.sel >= 0 ? P[state.sel].id : 'mapa-okusa') + '.png';
      var file = window.File ? new File([blob], name, { type: 'image/png' }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && /Mobi|Android|iPhone|iPad/.test(navigator.userAgent)) {
        navigator.share({ files: [file], title: T.eyebrow }).catch(function () { /* odustao */ });
        return;
      }
      var a = doc.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name;
      doc.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      toast(T.saved);
    }, 'image/png');
  }
  function fitText(c, s, max, size) {
    while (c.measureText(s).width > max && size > 36) { size -= 4; c.font = '800 ' + size + 'px Manrope, system-ui, sans-serif'; }
  }

  /* ------------------------------------------------------------------ */
  /* Pokretanje i pauza                                                  */
  /* ------------------------------------------------------------------ */

  function wake() {
    lastInteract = Math.max(lastInteract, (now || performance.now()) - 3000);
    if (running && !raf) raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running || !visible || doc.hidden) return;
    running = true; last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  makeSprites();
  resize();
  t0 = performance.now(); now = t0;
  var seen = false;
  try { seen = sessionStorage.getItem('msp-fmap-seen') === '1'; sessionStorage.setItem('msp-fmap-seen', '1'); } catch (e) { /* privatni prozor */ }
  if (reduce) ready();
  else startIntro(!seen);

  var ro = window.ResizeObserver ? new ResizeObserver(function () { var r = cv.getBoundingClientRect(); if (Math.round(r.width) !== W || Math.round(r.height) !== H) resize(); }) : null;
  if (ro) ro.observe(cv); else window.addEventListener('resize', resize);
  if (window.IntersectionObserver) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); else stop(); }, { threshold: 0.02 }).observe(host);
  }
  doc.addEventListener('visibilitychange', function () { if (doc.hidden) stop(); else start(); });
  if (MSP.Shelf && MSP.Shelf.on) MSP.Shelf.on(function () { if (state.shelfOn) setShelf(true); });
  applyFilters();
  start();
})();
