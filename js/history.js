/*
 * MyShishapedia - "Evolucija nargile": kretanje na stranici (globus, let kamere, rastavljena nargila).
 *
 * HTML je već gotov (js/views-history.js + build.mjs). Ovdje se samo:
 *   - nargila na vrhu rastavi na dijelove i ponovo sastavi dok se lista (CSS 3D transform, bez canvasa);
 *   - na <canvas> crta globus u ortografskoj projekciji (vlastita matematika, bez biblioteke) i kamera
 *     leti od stanice do stanice; napredak je vezan za listanje, uz mekano praćenje;
 *   - stil karte se pretapa sa godinom: stara karta (papir, mastilo), štampana karta, moderna noć (neon);
 *   - iznad grada izroni silueta (SVG iz oblika u data/history.js);
 *   - dodaju se sitnice: okretanje kartica "Mit ili istina", prevlačenje koraka, mala mapa naziva.
 *
 * Brzina: jedan requestAnimationFrame koji stoji kad pozornica nije na ekranu ili je tab skriven;
 * mapa (skuplji sloj) se crta samo kad se kamera pomjeri, a pribadače i dim na drugom, lakom sloju.
 * Mapa (static/geo/world.json, Natural Earth) se učitava tek kad se korisnik približi globusu.
 * "Manje pokreta": nema leta ni rastavljanja; jedna statična mapa sa svim tragovima.
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var FX = MSP.Effects;
  var Pages = (MSP.Pages = MSP.Pages || {});

  var PI = Math.PI, RAD = PI / 180;
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(e0, e1, x) { var t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  /* ------------------------------------------------------------------ */
  /* Vektori na jediničnoj sferi                                         */
  /* ------------------------------------------------------------------ */

  function vec(lon, lat) {
    var l = lon * RAD, p = lat * RAD, c = Math.cos(p);
    return [c * Math.cos(l), c * Math.sin(l), Math.sin(p)];
  }
  function lonLat(v) { return [Math.atan2(v[1], v[0]) / RAD, Math.asin(clamp(v[2], -1, 1)) / RAD]; }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function angleOf(a, b) { return Math.acos(clamp(dot(a, b), -1, 1)); }
  function slerp(a, b, t) {
    var w = angleOf(a, b);
    if (w < 1e-6) return a.slice();
    var s = Math.sin(w), ka = Math.sin((1 - t) * w) / s, kb = Math.sin(t * w) / s;
    return [a[0] * ka + b[0] * kb, a[1] * ka + b[1] * kb, a[2] * ka + b[2] * kb];
  }

  /* ------------------------------------------------------------------ */
  /* Palete epoha: stara karta, štampana karta, moderna noć               */
  /* ------------------------------------------------------------------ */

  function hex(h, a) {
    var n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a == null ? 1 : a];
  }
  var ERA = {
    old: {
      bg: hex('#e6d5b2'), bg2: hex('#b99566'), sea: hex('#e8d9b8'), sea2: hex('#d4bd92'), land: hex('#d8bf8c'), coast: hex('#4a2a12'),
      grid: hex('#7a5532', 0.32), border: hex('#7a5532', 0.55), trail: hex('#7a2a12'), pin: hex('#9a1f12'), label: hex('#3b2412'), rim: hex('#5a3a1c', 0.8),
      paper: 1, glow: 0, ink: 1, stars: 0
    },
    print: {
      bg: hex('#ece3cf'), bg2: hex('#c9b996'), sea: hex('#cfe0da'), sea2: hex('#b5ccc6'), land: hex('#f0e2bf'), coast: hex('#3e3226'),
      grid: hex('#5d6f6a', 0.28), border: hex('#8a6b52', 0.6), trail: hex('#a0371f'), pin: hex('#b0301c'), label: hex('#2a221b'), rim: hex('#3e3226', 0.7),
      paper: 0.45, glow: 0, ink: 0.3, stars: 0
    },
    modern: {
      bg: hex('#0b0809'), bg2: hex('#1d0d11'), sea: hex('#120c0e'), sea2: hex('#1b1013'), land: hex('#26171a'), coast: hex('#ff6a3d'),
      grid: hex('#ff6b4a', 0.07), border: hex('#ff8a5c', 0.28), trail: hex('#ff7a3d'), pin: hex('#ff3b55'), label: hex('#f4ebdf'), rim: hex('#ff5a3c', 0.55),
      paper: 0, glow: 1, ink: 0, stars: 1
    }
  };
  var KEYS = Object.keys(ERA.old);
  function mix(a, b, t) {
    var o = {};
    KEYS.forEach(function (k) {
      var x = a[k], y = b[k];
      o[k] = typeof x === 'number' ? lerp(x, y, t) : [lerp(x[0], y[0], t), lerp(x[1], y[1], t), lerp(x[2], y[2], t), lerp(x[3], y[3], t)];
    });
    return o;
  }
  /** Paleta za godinu: prelazi su postepeni (1850-1900 i 1975-1995). */
  function paletteFor(year) {
    if (year <= 1850) return ERA.old;
    if (year < 1900) return mix(ERA.old, ERA.print, smooth(1850, 1900, year));
    if (year <= 1975) return ERA.print;
    if (year < 1995) return mix(ERA.print, ERA.modern, smooth(1975, 1995, year));
    return ERA.modern;
  }
  function css(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a == null ? c[3] : c[3] * a).toFixed(3) + ')'; }

  /* ------------------------------------------------------------------ */
  /* Mapa: učitavanje i priprema (vektori + "kapa" za brzo odbacivanje)   */
  /* ------------------------------------------------------------------ */

  var GEO = null, geoWaiters = [], geoLoading = false;

  function decodeRings(list, q) {
    return list.map(function (r) {
      var n = r.length / 2, xyz = new Float32Array(n * 3), x = 0, y = 0, cx = 0, cy = 0, cz = 0;
      for (var i = 0; i < n; i++) {
        x += r[i * 2]; y += r[i * 2 + 1];
        var v = vec(x / q, y / q);
        xyz[i * 3] = v[0]; xyz[i * 3 + 1] = v[1]; xyz[i * 3 + 2] = v[2];
        cx += v[0]; cy += v[1]; cz += v[2];
      }
      var len = Math.hypot(cx, cy, cz) || 1, c = [cx / len, cy / len, cz / len], rad = 0;
      for (var j = 0; j < n; j++) {
        var d = Math.acos(clamp(c[0] * xyz[j * 3] + c[1] * xyz[j * 3 + 1] + c[2] * xyz[j * 3 + 2], -1, 1));
        if (d > rad) rad = d;
      }
      return { p: xyz, n: n, c: c, r: rad };
    });
  }

  function loadGeo(cb) {
    if (GEO) { cb(); return; }
    geoWaiters.push(cb);
    if (geoLoading) return;
    geoLoading = true;
    fetch('/geo/world.json').then(function (r) { return r.json(); }).then(function (j) {
      GEO = { lo: decodeRings(j.lo, j.q), hi: decodeRings(j.hi, j.q), b: decodeRings(j.b, j.q) };
      geoWaiters.splice(0).forEach(function (fn) { fn(); });
    }).catch(function () { geoLoading = false; });
  }

  // mreža meridijana i paralela (svakih 15°)
  var GRID = (function () {
    var lines = [], lon, lat, pts;
    for (lon = -180; lon < 180; lon += 15) {
      pts = [];
      for (lat = -80; lat <= 80; lat += 4) pts.push(vec(lon, lat));
      lines.push(pts);
    }
    for (lat = -75; lat <= 75; lat += 15) {
      pts = [];
      for (lon = -180; lon <= 180; lon += 4) pts.push(vec(lon, lat));
      lines.push(pts);
    }
    return lines;
  })();

  var STARS = (function () {
    var s = [], seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 140; i++) s.push([rnd(), rnd(), 0.3 + rnd() * 1.1, rnd()]);
    return s;
  })();

  /* ------------------------------------------------------------------ */
  /* Kamera i projekcija                                                  */
  /* ------------------------------------------------------------------ */

  /**
   * cam: { c: vektor centra, k: poluprečnik globusa u px, x, y: gdje je centar na ekranu }
   * Vraća funkciju koja projektuje vektor u [sx, sy, z] (z > 0 = vidljiva strana).
   */
  function projector(cam) {
    var ll = lonLat(cam.c), l0 = ll[0] * RAD, p0 = ll[1] * RAD;
    var cl = Math.cos(l0), sl = Math.sin(l0), cp = Math.cos(p0), sp = Math.sin(p0);
    var k = cam.k, ox = cam.x, oy = cam.y;
    return function (X, Y, Z, out) {
      var A = X * cl + Y * sl;
      var x = Y * cl - X * sl;
      var y = cp * Z - sp * A;
      var z = sp * Z + cp * A;
      if (z < 0) { var len = Math.hypot(x, y) || 1; x /= len; y /= len; }
      out[0] = ox + x * k; out[1] = oy - y * k; out[2] = z;
      return out;
    };
  }

  /* ------------------------------------------------------------------ */
  /* Papir (tekstura se napravi jednom)                                   */
  /* ------------------------------------------------------------------ */

  function paperTexture() {
    var c = document.createElement('canvas');
    c.width = c.height = 256;
    var g = c.getContext('2d');
    var img = g.createImageData(256, 256), d = img.data, seed = 11;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < d.length; i += 4) {
      var v = 236 + rnd() * 19;
      d[i] = v; d[i + 1] = v - 4; d[i + 2] = v - 14; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    g.lineCap = 'round';
    for (var f = 0; f < 140; f++) {
      g.strokeStyle = 'rgba(120,80,40,' + (0.04 + rnd() * 0.06).toFixed(3) + ')';
      g.lineWidth = 0.6 + rnd();
      var x = rnd() * 256, y = rnd() * 256, a = rnd() * PI, l = 4 + rnd() * 14;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    for (var b = 0; b < 10; b++) {
      var bx = rnd() * 256, by = rnd() * 256, br = 20 + rnd() * 50;
      var gr = g.createRadialGradient(bx, by, 0, bx, by, br);
      gr.addColorStop(0, 'rgba(150,100,45,.10)');
      gr.addColorStop(1, 'rgba(150,100,45,0)');
      g.fillStyle = gr;
      g.fillRect(bx - br, by - br, br * 2, br * 2);
    }
    return c;
  }

  /* ------------------------------------------------------------------ */
  /* Siluete gradova (SVG 1000x300, tlo na y=300)                         */
  /* ------------------------------------------------------------------ */

  var SH = 300;
  function n(v) { return Math.round(v * 10) / 10; }
  function rect(x0, x1, y0, y1) { return 'M' + n(x0) + ' ' + n(y1) + 'V' + n(y0) + 'H' + n(x1) + 'V' + n(y1) + 'Z'; }
  function domeTop(x0, x1, y, h) { return 'M' + n(x0) + ' ' + n(y) + 'C' + n(x0) + ' ' + n(y - h * 1.33) + ' ' + n(x1) + ' ' + n(y - h * 1.33) + ' ' + n(x1) + ' ' + n(y) + 'Z'; }
  function arch(cx, w, yb, yt) {
    var r = w / 2;
    return 'M' + n(cx - r) + ' ' + n(yb) + 'V' + n(yt + r) + 'A' + n(r) + ' ' + n(r) + ' 0 0 1 ' + n(cx + r) + ' ' + n(yt + r) + 'V' + n(yb) + 'Z';
  }
  function windows(x0, x1, y0, y1, cols, rows) {
    var out = '', w = (x1 - x0) / (cols * 2 + 1), hh = (y1 - y0) / (rows * 2 + 1);
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var wx = x0 + w * (1 + c * 2), wy = y0 + hh * (1 + r * 2);
      out += rect(wx, wx + w, wy, wy + hh * 0.8);
    }
    return out;
  }

  var SKY = {
    dome: function (a) {
      var x = a[0] * 1000, w = a[1] * 1000, H = a[2] * SH, x0 = x - w / 2, x1 = x + w / 2, yd = SH - H * 0.48, dh = H * 0.42;
      return { b: rect(x0 + w * 0.06, x1 - w * 0.06, yd, SH) + domeTop(x0, x1, yd, dh) + rect(x - 2, x + 2, SH - H, yd - dh * 0.95) + 'M' + n(x) + ' ' + n(SH - H - 8) + 'a5 5 0 1 0 .1 0Z', w: arch(x, w * 0.16, SH, yd + 16) };
    },
    halfdome: function (a) {
      var x = a[0] * 1000, w = a[1] * 1000, H = a[2] * SH;
      return { b: domeTop(x - w / 2, x + w / 2, SH, H * 0.75) };
    },
    minaret: function (a) {
      var x = a[0] * 1000, H = a[1] * SH, w = 9, yb = SH - H * 0.72;
      return { b: rect(x - w, x + w, SH - H * 0.86, SH) + rect(x - w - 6, x + w + 6, yb - 5, yb + 3) + rect(x - w + 2, x + w - 2, SH - H * 0.93, SH - H * 0.86) +
        'M' + n(x - w) + ' ' + n(SH - H * 0.92) + 'L' + n(x) + ' ' + n(SH - H) + 'L' + n(x + w) + ' ' + n(SH - H * 0.92) + 'Z' };
    },
    arcade: function (a) {
      var x0 = a[0] * 1000, x1 = a[1] * 1000, H = a[2] * SH, w = '', cnt = Math.max(2, Math.round((x1 - x0) / 48));
      for (var i = 0; i < cnt; i++) w += arch(x0 + (x1 - x0) * (i + 0.5) / cnt, (x1 - x0) / cnt * 0.55, SH, SH - H * 0.78);
      return { b: rect(x0, x1, SH - H, SH), w: w };
    },
    wall: function (a) {
      var x0 = a[0] * 1000, x1 = a[1] * 1000, H = a[2] * SH, top = SH - H, s = 'M' + n(x0) + ' ' + SH + 'V' + n(top), x = x0, up = false;
      while (x < x1) { x = Math.min(x1, x + 14); s += 'H' + n(x) + 'V' + n(up ? top : top - 10); up = !up; }
      return { b: s + 'V' + SH + 'Z' };
    },
    gate: function (a) {
      var x = a[0] * 1000, w = a[1] * 1000, H = a[2] * SH, x0 = x - w / 2, x1 = x + w / 2, top = SH - H;
      var b = rect(x0, x1, top, SH) + rect(x0 - 6, x1 + 6, top - 6, top + 8);
      for (var i = 0; i < 4; i++) { var cx = x0 + w * (0.12 + i * 0.25); b += domeTop(cx - 10, cx + 10, top - 6, 12) + rect(cx - 9, cx + 9, top - 6, top); }
      return { b: b, w: arch(x, w * 0.42, SH, top + H * 0.22) };
    },
    chhatri: function (a) {
      var x = a[0] * 1000, H = a[1] * SH, top = SH - H;
      return { b: rect(x - 26, x + 26, top + H * 0.3, SH) + rect(x - 30, x + 30, top + H * 0.26, top + H * 0.32) + domeTop(x - 22, x + 22, top + H * 0.26, H * 0.2) + rect(x - 1.5, x + 1.5, top, top + 8), w: arch(x, 22, SH, top + H * 0.45) };
    },
    tower: function (a) {
      var x = a[0] * 1000, w = a[1] * 1000, H = a[2] * SH, x0 = x - w / 2, x1 = x + w / 2;
      return { b: rect(x0, x1, SH - H, SH) + rect(x0 + w * 0.3, x1 - w * 0.3, SH - H - 10, SH - H), w: windows(x0, x1, SH - H + 10, SH - 6, 2, Math.max(2, Math.round(H / 26))) };
    },
    block: function (a) {
      var x0 = a[0] * 1000, x1 = a[1] * 1000, H = a[2] * SH;
      return { b: rect(x0, x1, SH - H, SH), w: windows(x0, x1, SH - H + 8, SH - 6, Math.max(2, Math.round((x1 - x0) / 22)), Math.max(1, Math.round(H / 30))) };
    },
    house: function (a) {
      var x = a[0] * 1000, w = a[1] * 1000, H = a[2] * SH, x0 = x - w / 2, x1 = x + w / 2, top = SH - H, s = 'M' + n(x0) + ' ' + SH + 'V' + n(top), xx = x0, up = false;
      while (xx < x1) { xx = Math.min(x1, xx + 10); s += 'H' + n(xx) + 'V' + n(up ? top : top - 7); up = !up; }
      var wv = '';
      for (var r = 0; r < Math.round(H / 36); r++) for (var c = 0; c < 2; c++) wv += arch(x0 + w * (0.3 + c * 0.4), w * 0.16, top + 24 + r * 36 + 18, top + 24 + r * 36);
      return { b: s + 'V' + SH + 'Z', w: wv };
    },
    mountain: function (a) {
      var x0 = a[0] * 1000, x1 = a[1] * 1000, H = a[2] * SH, s = 'M' + n(x0) + ' ' + SH, seed = 3;
      for (var x = x0; x <= x1; x += 40) { seed = (seed * 9301 + 49297) % 233280; s += 'L' + n(x) + ' ' + n(SH - H * (0.45 + 0.55 * seed / 233280)); }
      return { f: s + 'L' + n(x1) + ' ' + SH + 'Z' };
    },
    hill: function (a) {
      var x = a[0] * 1000, w = a[1] * 1000, H = a[2] * SH;
      return { f: domeTop(x - w / 2, x + w / 2, SH, H * 0.75) };
    },
    clock: function (a) {
      var x = a[0] * 1000, H = a[1] * SH, top = SH - H;
      return { b: rect(x - 18, x + 18, top + H * 0.2, SH) + 'M' + n(x - 22) + ' ' + n(top + H * 0.2) + 'L' + n(x) + ' ' + n(top) + 'L' + n(x + 22) + ' ' + n(top + H * 0.2) + 'Z', w: 'M' + n(x) + ' ' + n(top + H * 0.3 - 10) + 'a10 10 0 1 0 .1 0Z' };
    },
    palm: function (a) {
      var x = a[0] * 1000, H = a[1] * SH, top = SH - H;
      var b = 'M' + n(x - 4) + ' ' + SH + 'Q' + n(x - 10) + ' ' + n(top + H * 0.5) + ' ' + n(x) + ' ' + n(top) + 'Q' + n(x - 2) + ' ' + n(top + H * 0.5) + ' ' + n(x + 4) + ' ' + SH + 'Z';
      [[-46, 14], [-30, -10], [0, -18], [30, -10], [46, 14]].forEach(function (f) {
        b += 'M' + n(x) + ' ' + n(top) + 'Q' + n(x + f[0] * 0.5) + ' ' + n(top + f[1] - 14) + ' ' + n(x + f[0]) + ' ' + n(top + f[1] + 10) + 'Q' + n(x + f[0] * 0.5) + ' ' + n(top + f[1] - 4) + ' ' + n(x) + ' ' + n(top + 4) + 'Z';
      });
      return { b: b };
    },
    needle: function (a) {
      var x = a[0] * 1000, H = a[1] * SH, top = SH - H;
      return { b: 'M' + n(x - 12) + ' ' + SH + 'L' + n(x - 6) + ' ' + n(top + H * 0.2) + 'L' + n(x - 14) + ' ' + n(top + H * 0.1) + 'L' + n(x - 8) + ' ' + n(top + 8) + 'H' + n(x + 8) + 'L' + n(x + 14) + ' ' + n(top + H * 0.1) + 'L' + n(x + 6) + ' ' + n(top + H * 0.2) + 'L' + n(x + 12) + ' ' + SH + 'Z' + rect(x - 1.5, x + 1.5, top, top + 8) };
    },
    pyramid: function (a) {
      var x = a[0] * 1000, w = a[1] * 1000, H = a[2] * SH;
      return { f: 'M' + n(x - w / 2) + ' ' + SH + 'L' + n(x) + ' ' + n(SH - H) + 'L' + n(x + w / 2) + ' ' + SH + 'Z' };
    },
    sail: function (a) {
      var x = a[0] * 1000, H = a[1] * SH, top = SH - H;
      return { b: 'M' + n(x - 30) + ' ' + SH + 'L' + n(x - 26) + ' ' + n(top + 6) + 'L' + n(x - 20) + ' ' + n(top) + 'Q' + n(x + 52) + ' ' + n(top + H * 0.42) + ' ' + n(x + 24) + ' ' + SH + 'Z', w: 'M' + n(x - 18) + ' ' + n(top + H * 0.2) + 'Q' + n(x + 24) + ' ' + n(top + H * 0.46) + ' ' + n(x + 8) + ' ' + n(SH - 10) + 'H' + n(x - 18) + 'Z' };
    },
    roof: function (a) {
      var x = a[0] * 1000, w = a[1] * 1000, H = a[2] * SH, x0 = x - w / 2, x1 = x + w / 2, eave = SH - H * 0.55;
      return { b: rect(x0 + 6, x1 - 6, eave, SH) + 'M' + n(x0 - 8) + ' ' + n(eave + 2) + 'L' + n(x) + ' ' + n(SH - H) + 'L' + n(x1 + 8) + ' ' + n(eave + 2) + 'Z', w: rect(x - w * 0.18, x + w * 0.18, eave + 10, SH - 4) };
    },
    sebilj: function (a) {
      var x = a[0] * 1000, H = a[1] * SH, top = SH - H;
      return { b: rect(x - 34, x + 34, SH - 10, SH) + rect(x - 28, x + 28, top + H * 0.45, SH - 10) + 'M' + n(x - 40) + ' ' + n(top + H * 0.47) + 'L' + n(x + 40) + ' ' + n(top + H * 0.47) + 'L' + n(x + 30) + ' ' + n(top + H * 0.4) + 'H' + n(x - 30) + 'Z' + domeTop(x - 26, x + 26, top + H * 0.4, H * 0.24) + rect(x - 1.5, x + 1.5, top, top + 10),
        w: rect(x - 22, x - 8, top + H * 0.55, SH - 16) + rect(x - 5, x + 5, top + H * 0.55, SH - 16) + rect(x + 8, x + 22, top + H * 0.55, SH - 16) };
    },
    onion: function (a) {
      var x = a[0] * 1000, H = a[1] * SH, top = SH - H, yb = top + H * 0.4;
      return { b: rect(x - 16, x + 16, yb, SH) + 'M' + n(x - 16) + ' ' + n(yb) + 'C' + n(x - 34) + ' ' + n(yb - 26) + ' ' + n(x - 6) + ' ' + n(top + 18) + ' ' + n(x) + ' ' + n(top + 6) + 'C' + n(x + 6) + ' ' + n(top + 18) + ' ' + n(x + 34) + ' ' + n(yb - 26) + ' ' + n(x + 16) + ' ' + n(yb) + 'Z' + rect(x - 1.5, x + 1.5, top - 6, top + 8), w: arch(x, 10, SH - 10, yb + 14) };
    },
    tv: function (a) {
      var x = a[0] * 1000, H = a[1] * SH, top = SH - H, ys = top + H * 0.3;
      return { b: 'M' + n(x - 9) + ' ' + SH + 'L' + n(x - 4) + ' ' + n(ys) + 'H' + n(x + 4) + 'L' + n(x + 9) + ' ' + SH + 'Z' + 'M' + n(x) + ' ' + n(ys - 22) + 'a22 22 0 1 0 .1 0Z' + rect(x - 1.5, x + 1.5, top, ys - 20) + rect(x - 5, x + 5, ys + 18, ys + 30), w: rect(x - 16, x + 16, ys - 3, ys + 2) };
    }
  };

  function skySvg(spec) {
    var b = '', w = '', f = '';
    (spec || []).forEach(function (s) {
      var parts = s.split(':'), fn = SKY[parts[0]];
      if (!fn) return;
      var o = fn(parts.slice(1).map(Number));
      b += o.b || ''; w += o.w || ''; f += o.f || '';
    });
    return '<svg viewBox="0 0 1000 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="hx-haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sky-haze)" stop-opacity="0"/><stop offset="1" stop-color="var(--sky-haze)" stop-opacity=".9"/></linearGradient></defs>' +
      '<rect y="120" width="1000" height="180" fill="url(#hx-haze)"/>' +
      '<path class="hx-sky-f" d="' + f + '"/>' +
      '<path class="hx-sky-b" fill-rule="evenodd" d="' + b + '"/>' +
      '<path class="hx-sky-w" d="' + w + '"/>' +
      '</svg>';
  }

  // mekan oblačić dima (radijalni gradijent), napravi se jednom po boji
  var SPRITES = {};
  var PAPER = null;
  function sprite(rgb) {
    if (SPRITES[rgb]) return SPRITES[rgb];
    var c = document.createElement('canvas');
    c.width = c.height = 64;
    var g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(' + rgb + ',1)');
    gr.addColorStop(0.45, 'rgba(' + rgb + ',.45)');
    gr.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    return (SPRITES[rgb] = c);
  }

  /* ------------------------------------------------------------------ */
  /* Crtanje globusa                                                      */
  /* ------------------------------------------------------------------ */

  function Renderer(canvas, fx, stations, opts) {
    this.c = canvas; this.g = canvas.getContext('2d');
    this.fx = fx; this.gf = fx ? fx.getContext('2d') : null;
    this.st = stations;
    this.sv = stations.map(function (s) { return vec(s.lon, s.lat); });
    // tragovi: luk po velikom krugu između susjednih stanica
    var sv = this.sv;
    this.arcs = sv.slice(1).map(function (b, i) {
      var a = sv[i], pts = [], steps = 56;
      for (var k = 0; k <= steps; k++) pts.push(slerp(a, b, k / steps));
      return pts;
    });
    this.opts = opts || {};
    this.parts = [];
    this.tmp = [0, 0, 0];
    this.key = '';
  }

  Renderer.prototype.size = function (w, h, dpr) {
    this.w = w; this.h = h; this.dpr = dpr;
    this.fxKey = '';
    [this.c, this.fx].forEach(function (c) {
      if (!c) return;
      c.width = Math.max(1, Math.round(w * dpr));
      c.height = Math.max(1, Math.round(h * dpr));
    });
    this.key = '';
  };

  /** Put svih prstenova (kopno) kroz projekciju; vraća broj nacrtanih. */
  Renderer.prototype.ringPath = function (g, rings, P, cam, maxAng, close) {
    var out = this.tmp, c = cam.c, drawn = 0;
    for (var i = 0; i < rings.length; i++) {
      var R = rings[i];
      var d = Math.acos(clamp(c[0] * R.c[0] + c[1] * R.c[1] + c[2] * R.c[2], -1, 1));
      if (d - R.r > maxAng) continue;
      var p = R.p, nn = R.n;
      P(p[0], p[1], p[2], out);
      g.moveTo(out[0], out[1]);
      for (var j = 1; j < nn; j++) {
        P(p[j * 3], p[j * 3 + 1], p[j * 3 + 2], out);
        g.lineTo(out[0], out[1]);
      }
      if (close) g.closePath();
      drawn++;
    }
    return drawn;
  };

  /** Linije (mreža, granice): crtaju se samo dijelovi na vidljivoj strani. */
  Renderer.prototype.linePath = function (g, lines, P, minZ) {
    var out = this.tmp;
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i], pen = false;
      if (L.p) {
        for (var j = 0; j < L.n; j++) {
          P(L.p[j * 3], L.p[j * 3 + 1], L.p[j * 3 + 2], out);
          if (out[2] > minZ) { if (pen) g.lineTo(out[0], out[1]); else g.moveTo(out[0], out[1]); pen = true; } else pen = false;
        }
      } else {
        for (var k = 0; k < L.length; k++) {
          P(L[k][0], L[k][1], L[k][2], out);
          if (out[2] > minZ) { if (pen) g.lineTo(out[0], out[1]); else g.moveTo(out[0], out[1]); pen = true; } else pen = false;
        }
      }
    }
  };

  /** Osnovni sloj: pozadina, more, mreža, kopno, obale, granice. Crta se samo kad se kamera pomjeri. */
  Renderer.prototype.drawMap = function (cam, pal) {
    var key = cam.c[0].toFixed(5) + cam.c[1].toFixed(5) + cam.c[2].toFixed(5) + '|' + cam.k.toFixed(1) + '|' + cam.x.toFixed(1) + '|' + cam.y.toFixed(1) + '|' + pal.ink.toFixed(3) + pal.glow.toFixed(3) + (GEO ? 1 : 0);
    if (key === this.key) return false;
    this.key = key;
    var g = this.g, w = this.w, h = this.h, dpr = this.dpr, k = cam.k;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    // pozadina: papir ili noć, sa vinjetom
    g.fillStyle = css(pal.bg);
    g.fillRect(0, 0, w, h);
    var vg = g.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.25, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
    vg.addColorStop(0, css(pal.bg, 0));
    vg.addColorStop(1, css(pal.bg2, 0.9));
    g.fillStyle = vg;
    g.fillRect(0, 0, w, h);

    // zvijezde (samo moderna noć, kad se vidi svemir)
    if (pal.stars > 0.01 && k < Math.max(w, h)) {
      g.fillStyle = css([255, 236, 214, 1], pal.stars * clamp(1.4 - k / Math.min(w, h), 0, 1) * 0.8);
      for (var s = 0; s < STARS.length; s++) {
        var st = STARS[s];
        g.globalAlpha = 0.35 + 0.65 * st[3];
        g.fillRect(st[0] * w, st[1] * h, st[2], st[2]);
      }
      g.globalAlpha = 1;
    }

    // atmosfera (moderna) / sjena (stara)
    if (pal.glow > 0.01) {
      var at = g.createRadialGradient(cam.x, cam.y, k * 0.96, cam.x, cam.y, k * 1.12);
      at.addColorStop(0, css(pal.coast, 0.32 * pal.glow));
      at.addColorStop(1, css(pal.coast, 0));
      g.fillStyle = at;
      g.beginPath(); g.arc(cam.x, cam.y, k * 1.12, 0, PI * 2); g.fill();
    } else {
      g.fillStyle = css([60, 35, 15, 1], 0.16 * (1 - pal.glow));
      g.beginPath(); g.arc(cam.x + k * 0.02, cam.y + k * 0.03, k * 1.01, 0, PI * 2); g.fill();
    }

    // more
    var sea = g.createRadialGradient(cam.x - k * 0.3, cam.y - k * 0.35, k * 0.1, cam.x, cam.y, k);
    sea.addColorStop(0, css(pal.sea));
    sea.addColorStop(1, css(pal.sea2));
    g.fillStyle = sea;
    g.beginPath(); g.arc(cam.x, cam.y, k, 0, PI * 2); g.fill();

    var P = projector(cam);
    // vidljivi ugao: najdalji ugao ekrana od centra globusa
    var far = Math.max(Math.hypot(cam.x, cam.y), Math.hypot(w - cam.x, cam.y), Math.hypot(cam.x, h - cam.y), Math.hypot(w - cam.x, h - cam.y));
    var maxAng = far >= k ? PI / 2 + 0.02 : Math.asin(far / k) + 0.04;

    g.save();
    g.beginPath(); g.arc(cam.x, cam.y, k, 0, PI * 2); g.clip();

    // mreža
    g.beginPath();
    this.linePath(g, GRID, P, 0);
    g.strokeStyle = css(pal.grid);
    g.lineWidth = 0.7;
    g.stroke();

    if (GEO) {
      var zoom = k / this.base;
      var rings = zoom > 1.9 ? GEO.hi : GEO.lo;
      g.beginPath();
      this.ringPath(g, rings, P, cam, maxAng, true);
      g.fillStyle = css(pal.land);
      g.fill();
      if (pal.glow > 0.01) {
        g.strokeStyle = css(pal.coast, 0.16 * pal.glow);
        g.lineWidth = 5;
        g.stroke();
      }
      g.strokeStyle = css(pal.coast, pal.glow > 0.5 ? 0.85 : 0.9);
      g.lineWidth = pal.glow > 0.5 ? 1.1 : 1.15;
      g.lineJoin = 'round';
      g.stroke();
      // mastilo: drugi, malo pomjeren potez (ručno nacrtan izgled)
      if (pal.ink > 0.05) {
        g.save();
        g.translate(0.9, 0.7);
        g.strokeStyle = css(pal.coast, 0.35 * pal.ink);
        g.lineWidth = 0.6;
        g.stroke();
        g.restore();
      }
      if (zoom > 1.9) {
        g.beginPath();
        this.linePath(g, GEO.b, P, 0.02);
        g.strokeStyle = css(pal.border);
        g.lineWidth = 0.9;
        g.setLineDash(pal.glow > 0.5 ? [] : [3, 3]);
        g.stroke();
        g.setLineDash([]);
      }
    }
    // svjetlo i sjena na lopti
    var sh = g.createRadialGradient(cam.x - k * 0.35, cam.y - k * 0.4, k * 0.05, cam.x, cam.y, k * 1.02);
    sh.addColorStop(0, 'rgba(255,255,255,' + (0.1 * (1 - pal.glow)).toFixed(3) + ')');
    sh.addColorStop(0.65, 'rgba(0,0,0,0)');
    sh.addColorStop(1, 'rgba(0,0,0,' + (0.18 + 0.25 * pal.glow).toFixed(3) + ')');
    g.fillStyle = sh;
    g.fillRect(cam.x - k, cam.y - k, k * 2, k * 2);
    g.restore();

    // papir (stara i štampana karta): tekstura se utisne u canvas samo kad se mapa crta,
    // a ne kao poseban sloj sa mix-blend-mode (to bi browser miješao u svakom frameu)
    if (pal.paper > 0.01) {
      if (!PAPER) PAPER = g.createPattern(paperTexture(), 'repeat');
      g.save();
      g.globalCompositeOperation = 'multiply';
      g.globalAlpha = pal.paper * 0.6;
      g.fillStyle = PAPER;
      g.fillRect(0, 0, w, h);
      g.restore();
    }

    g.beginPath(); g.arc(cam.x, cam.y, k, 0, PI * 2);
    g.strokeStyle = css(pal.rim);
    g.lineWidth = pal.glow > 0.5 ? 1.2 : 1.6;
    g.stroke();
    if (pal.ink > 0.5) {
      g.beginPath(); g.arc(cam.x, cam.y, k + 5, 0, PI * 2);
      g.strokeStyle = css(pal.rim, 0.5 * pal.ink);
      g.lineWidth = 0.7;
      g.stroke();
    }
    return true;
  };

  /**
   * Lagani sloj (svaki frame): tragovi dima, pribadače, imena gradova, čestice dima na vrhu traga.
   * pos: napredak (stanica i, dio puta t), time u sekundama.
   */
  Renderer.prototype.drawFx = function (cam, pal, pos, time, dt, all) {
    var g = this.gf, w = this.w, h = this.h, dpr = this.dpr;
    if (!g) return;
    // crta se samo kad se nešto promijenilo (kamera, trag ili dim koji se još razilazi)
    var key = this.key + '|' + pos.i + '|' + pos.t.toFixed(4) + '|' + pos.now + '|' + (all ? 1 : 0);
    if (key === this.fxKey && !this.parts.length) return;
    this.fxKey = key;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, w, h);
    var P = projector(cam), out = this.tmp, self = this;
    var glow = pal.glow, nArcs = this.arcs.length;
    var head = null;

    function stroke(pts, upto, alpha, width) {
      var pen = false, last = Math.floor(upto * (pts.length - 1)), frac = upto * (pts.length - 1) - last;
      g.beginPath();
      for (var i = 0; i <= last && i < pts.length; i++) {
        P(pts[i][0], pts[i][1], pts[i][2], out);
        if (out[2] > 0.01) { if (pen) g.lineTo(out[0], out[1]); else g.moveTo(out[0], out[1]); pen = true; } else pen = false;
      }
      if (last < pts.length - 1 && frac > 0) {
        var v = slerp(pts[last], pts[last + 1], frac);
        P(v[0], v[1], v[2], out);
        if (out[2] > 0.01 && pen) g.lineTo(out[0], out[1]);
        head = out[2] > 0.01 ? [out[0], out[1]] : null;
      } else if (pen) head = [out[0], out[1]];
      if (glow > 0.05) {
        g.strokeStyle = css(pal.trail, 0.22 * glow * alpha);
        g.lineWidth = width * 4;
        g.stroke();
      }
      g.strokeStyle = css(pal.trail, alpha);
      g.lineWidth = width;
      g.setLineDash(glow > 0.5 ? [] : [6, 4]);
      g.stroke();
      g.setLineDash([]);
    }

    g.lineCap = 'round';
    g.lineJoin = 'round';
    var cur = pos.i, t = pos.t;
    for (var a = 0; a < nArcs; a++) {
      if (all || a < cur) stroke(this.arcs[a], 1, all ? 0.9 : 0.55, 1.6);
      else if (a === cur && t > 0) { head = null; stroke(this.arcs[a], t, 0.95, 2.2); }
    }

    // čestice dima na vrhu traga dok se leti
    if (head && t > 0.02 && t < 0.98 && dt > 0) {
      for (var s = 0; s < 2; s++) {
        this.parts.push({ x: head[0], y: head[1], vx: (Math.random() - 0.5) * 14, vy: -8 - Math.random() * 14, r: 1.5 + Math.random() * 2, life: 1.2 + Math.random(), age: 0 });
      }
    }
    if (this.parts.length > 90) this.parts.splice(0, this.parts.length - 90);
    var puff = sprite(glow > 0.5 ? '255,214,190' : '110,70,40');
    for (var q = this.parts.length - 1; q >= 0; q--) {
      var pt = this.parts[q];
      pt.age += dt;
      if (pt.age > pt.life) { this.parts.splice(q, 1); continue; }
      pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.r += dt * 10;
      var life = pt.age / pt.life;
      g.globalAlpha = Math.sin(PI * life) * 0.22;
      g.drawImage(puff, pt.x - pt.r * 2, pt.y - pt.r * 2, pt.r * 4, pt.r * 4);
    }
    g.globalAlpha = 1;

    // pribadače (sve, da se može kliknuti; posjećene pune) i ime trenutnog grada
    var serif = glow < 0.5, nowI = pos.now == null ? -1 : pos.now;
    this.now = null;
    this.pins = [];
    this.sv.forEach(function (v, i) {
      P(v[0], v[1], v[2], out);
      if (out[2] < 0.05) return;
      var x = out[0], y = out[1], isNow = i === nowI, seen = all || i <= cur;
      var fade = clamp(out[2] * 3, 0, 1);
      self.pins.push([x, y, i]);
      if (isNow) self.now = [x, y, fade];
      if (!seen) {
        g.strokeStyle = css(pal.pin, 0.55 * fade);
        g.lineWidth = 1.2;
        g.beginPath(); g.arc(x, y, 3.2, 0, PI * 2); g.stroke();
        return;
      }
      if (glow > 0.05) {
        g.fillStyle = css(pal.pin, 0.25 * glow * fade);
        g.beginPath(); g.arc(x, y, isNow ? 11 : 7, 0, PI * 2); g.fill();
      }
      g.fillStyle = css(pal.pin, fade);
      g.beginPath(); g.arc(x, y, isNow ? 5 : 3.2, 0, PI * 2); g.fill();
      if (serif) {
        g.strokeStyle = css(pal.label, 0.7 * fade);
        g.lineWidth = 1;
        g.beginPath(); g.arc(x, y, isNow ? 8 : 5.5, 0, PI * 2); g.stroke();
      }
      if (isNow && !all) {
        var st = self.st[i];
        var label = serif ? st.old : MSP.L(st.city).toUpperCase();
        g.font = serif ? 'italic 500 22px "Cormorant Garamond", Georgia, serif' : '700 12px Manrope, system-ui, sans-serif';
        g.textBaseline = 'middle';
        var tx = x + 16, ty = y - 16;
        if (!serif) {
          var tw = g.measureText(label).width;
          g.fillStyle = 'rgba(10,6,7,' + (0.7 * fade).toFixed(3) + ')';
          g.fillRect(tx - 6, ty - 10, tw + 12, 20);
        }
        g.fillStyle = css(pal.label, fade);
        g.fillText(label, tx, ty);
      }
    });
  };

  /* ------------------------------------------------------------------ */
  /* Uvod: nargila se rastavlja i sastavlja CSS prelazom (dugme)          */
  /* ------------------------------------------------------------------ */

  function mountHero(ctx, root) {
    var btn = root.querySelector('.hx-explode-btn');
    var hook = document.getElementById('hx-hookah');
    if (!btn || !hook) return;
    btn.hidden = false;
    var tags = [].slice.call(hook.querySelectorAll('.hx-tag'));
    function closeTags(except) { tags.forEach(function (b) { if (b !== except) b.setAttribute('aria-expanded', 'false'); }); }
    function set(on) {
      root.classList.toggle('is-exploded', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (!on) {
        closeTags();
        // kad se nargila sastavi, iz glave izađe malo dima
        window.setTimeout(function () {
          var r = hook.querySelector('[data-part="glava"]').getBoundingClientRect();
          if (FX.Field && FX.Field.puff && r.bottom > 0 && r.top < window.innerHeight) FX.Field.puff(r.left + r.width / 2, r.top + r.height * 0.07, { count: 7 });
        }, FX.reducedMotion() ? 0 : 1300);
      }
    }
    btn.addEventListener('click', function () { set(!root.classList.contains('is-exploded')); });
    tags.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = b.getAttribute('aria-expanded') !== 'true';
        closeTags(b);
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
    function onDoc(e) { if (!e.target.closest('.hx-tag')) closeTags(); }
    document.addEventListener('click', onDoc);
    // sama se rastavi malo poslije otvaranja (samo ako se uvod vidi)
    var timer = 0;
    if (!FX.reducedMotion()) {
      timer = window.setTimeout(function () {
        var r = hook.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) set(true);
      }, 1100);
    }
    ctx.cleanup(function () { window.clearTimeout(timer); document.removeEventListener('click', onDoc); });
  }

  /* ------------------------------------------------------------------ */
  /* Putovanje: plejer. Kamera leti po vremenu (ne po listanju).           */
  /* ------------------------------------------------------------------ */

  var DWELL = 7000;

  function mountPlayer(ctx, root) {
    var D = window.HISTORY;
    var ST = D.stations, N = ST.length;
    var player = document.getElementById('hx-player');
    var canvas = document.getElementById('hx-globe');
    var fxc = document.getElementById('hx-fx');
    var rose = player.querySelector('.hx-rose');
    var pulse = player.querySelector('.hx-pulse');
    var sky = document.getElementById('hx-sky');
    var hudEl = document.getElementById('hx-hud');
    var yearEl = document.getElementById('hx-year');
    var placeEl = document.getElementById('hx-place');
    var live = document.getElementById('hx-live');
    var fill = hudEl.querySelector('.hx-line__fill');
    var dots = [].slice.call(hudEl.querySelectorAll('.hx-dot'));
    var cards = [].slice.call(player.querySelectorAll('.hx-st'));
    var playBtn = player.querySelector('[data-play]');
    var prevBtn = player.querySelector('[data-step="-1"]');
    var nextBtn = player.querySelector('[data-step="1"]');
    var cardBtn = player.querySelector('[data-card]');
    var countEl = document.getElementById('hx-count');
    var skipBtn = hudEl.querySelector('.hx-skip__btn');
    var skipList = document.getElementById('hx-skip-list');

    var R = new Renderer(canvas, fxc, ST);
    var dprMax = (navigator.hardwareConcurrency || 8) <= 4 ? 1.5 : 2;
    var W = 0, Hh = 0, mobile = false, fullDpr = 1, lowDpr = 1, sharp = true, landedAt = 0;
    var FINAL = vec(25, 30);
    var idx = -1;            // -1 početak, 0..N-1 stanica, N kraj
    var mode = 'start';
    var revealed = 0;        // koliko je dijelova traga nacrtano do kraja
    var flight = null, cam = null, state = null;
    var playing = false, dwellT = 0, inView = false, raf = 0, last = 0, time = 0;
    var lastEra = '', lastYear = null, lastPulse = '';

    function anchor(kind) {
      if (kind === 'station') return mobile ? [0.5, 0.3] : [0.34, 0.55];
      return mobile ? [0.5, 0.34] : [0.64, 0.52];
    }
    function startState() {
      return { c: vec(ST[0].lon - 70 + time * 5, 16), z: mobile ? 0.62 : 0.56, a: anchor('wide'), year: 2026 };
    }
    function stationState(i) { return { c: R.sv[i], z: ST[i].zoom, a: anchor('station'), year: ST[i].year }; }
    function endState() { return { c: FINAL, z: mobile ? 0.78 : 0.68, a: anchor('wide'), year: 2026 }; }
    function targetState(i) { return i < 0 ? startState() : i >= N ? endState() : stationState(i); }

    function toCam(s) {
      return { c: s.c, k: R.base * s.z, x: W * s.a[0], y: Hh * s.a[1] };
    }

    function interp(a, b, e, d) {
      var zFar = Math.log(clamp(1.25 / Math.max(d, 0.05), 0.7, 3.2));
      var za = Math.log(a.z), zb = Math.log(b.z);
      var dip = Math.max(0, (za + zb) / 2 - zFar);
      return {
        c: slerp(a.c, b.c, e),
        z: Math.exp(lerp(za, zb, e) - dip * Math.sin(PI * e)),
        a: [lerp(a.a[0], b.a[0], e), lerp(a.a[1], b.a[1], e)],
        year: lerp(a.year, b.year, e)
      };
    }

    function measure() {
      W = player.clientWidth; Hh = player.clientHeight;
      mobile = W < 900;
      fullDpr = Math.min(window.devicePixelRatio || 1, dprMax);
      lowDpr = W * Hh * fullDpr * fullDpr > 1.1e6 ? fullDpr * 0.62 : fullDpr * 0.8;
      R.size(W, Hh, flight ? lowDpr : fullDpr);
      sharp = !flight;
      R.base = mobile ? Math.min(W * 0.44, Hh * 0.34) : Math.min(W, Hh) * 0.4;
      if (!flight) state = targetState(idx);
      wake();
    }

    /* ---------- prelazak na stanicu ---------- */

    function setCard(i) {
      cards.forEach(function (li, k) { li.classList.toggle('is-active', k === i); });
      if (i >= 0) { var c = cards[i].querySelector('.hx-card'); if (c) c.scrollTop = 0; }
    }

    function go(j) {
      j = clamp(j, 0, N);
      if (j === idx && !flight) return;
      var from = state || targetState(idx);
      var to = targetState(j);
      var d = angleOf(from.c, to.c);
      var dur = (mode === 'start' ? 3.2 : clamp(1.5 + d * 0.95, 1.7, 3.4)) * 1000;
      var segFrom = flight ? flight.segNow : revealed, segTo = j >= N ? N - 1 : j;
      if (segTo < segFrom) { segFrom = segTo; }
      flight = { from: from, to: to, j: j, t0: performance.now(), dur: dur, d: d, segFrom: segFrom, segTo: segTo, segNow: segFrom };
      mode = 'fly';
      clearTimeout(dwellT);
      playBtn.classList.remove('is-timing');
      player.classList.remove('is-landed', 'is-start', 'is-end');
      setCard(-1);
      if (j < N) sky.innerHTML = skySvg(ST[j].sky);
      if (sharp) { sharp = false; R.size(W, Hh, lowDpr); }
      updateHud(j);
      wake();
    }

    function land() {
      var j = flight.j;
      flight = null;
      idx = j;
      revealed = j >= N ? N - 1 : j;
      state = targetState(j);
      landedAt = performance.now();
      if (j >= N) {
        mode = 'end';
        player.classList.add('is-end');
        setPlaying(false);
        live.textContent = MSP.t('history.finaleTitle');
      } else {
        mode = 'station';
        player.classList.add('is-landed');
        setCard(j);
        live.textContent = MSP.t('history.station', { n: j + 1, total: N }) + ': ' + MSP.L(ST[j].place) + ', ' + MSP.L(ST[j].when);
        // dim se digne iz grada kad kamera sleti
        window.setTimeout(function () {
          if (R.now && FX.Field && FX.Field.puff && inView) {
            var r = player.getBoundingClientRect();
            FX.Field.puff(r.left + R.now[0], r.top + R.now[1], { count: 6 });
          }
        }, 60);
        if (playing) startDwell();
      }
      wake();
    }

    function startDwell() {
      clearTimeout(dwellT);
      playBtn.style.setProperty('--dwell', DWELL + 'ms');
      playBtn.classList.remove('is-timing');
      void playBtn.offsetWidth;
      playBtn.classList.add('is-timing');
      dwellT = window.setTimeout(function () { if (playing) go(idx + 1); }, DWELL);
    }

    function setPlaying(on) {
      playing = on;
      playBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (!on) { clearTimeout(dwellT); playBtn.classList.remove('is-timing'); }
    }

    function step(dir) {
      if (flight) { go(flight.j + dir); return; }
      if (idx < 0) { if (dir > 0) go(0); return; }
      go(idx + dir);
    }

    /* ---------- HUD ---------- */

    function updateHud(j) {
      var n = clamp(j, 0, N - 1);
      dots.forEach(function (d, i) { d.classList.toggle('is-now', j < N && i === j); d.classList.toggle('is-past', i < j); });
      fill.style.transform = 'scaleX(' + clamp(j / (N - 1), 0, 1).toFixed(4) + ')';
      placeEl.textContent = j >= N ? MSP.t('history.finaleEyebrow') : MSP.L(ST[n].place);
      countEl.textContent = (j >= N ? N : j + 1) + ' / ' + N;
      prevBtn.disabled = j <= 0;
      nextBtn.disabled = j >= N;
    }

    function setEra(era) {
      if (era === lastEra) return;
      lastEra = era;
      player.classList.toggle('is-old', era === 'old');
      player.classList.toggle('is-print', era === 'print');
      player.classList.toggle('is-modern', era === 'modern');
    }

    /* ---------- petlja (radi samo dok se nešto kreće) ---------- */

    function frame(now) {
      raf = 0;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      time += dt;
      var segI = revealed, segT = 0;
      if (flight) {
        var e = clamp((now - flight.t0) / flight.dur, 0, 1), ee = easeInOut(e);
        state = interp(flight.from, flight.to, ee, flight.d);
        var tot = flight.segFrom + (flight.segTo - flight.segFrom) * clamp((ee - 0.08) / 0.84, 0, 1);
        flight.segNow = tot;
        segI = Math.floor(tot); segT = tot - segI;
        if (flight.segTo <= flight.segFrom) { segI = flight.segTo; segT = 0; }
        if (e >= 1) { land(); segI = revealed; segT = 0; }
      } else if (mode === 'start') {
        state = startState();
      }
      if (!state) state = targetState(idx);

      var year = state.year;
      var pal = paletteFor(year);
      setEra(year < 1850 ? 'old' : year < 1985 ? 'print' : 'modern');
      var y = Math.round(year);
      if (y !== lastYear) { lastYear = y; yearEl.textContent = y; }

      cam = toCam(state);
      R.drawMap(cam, pal);
      var nowI = mode === 'station' ? idx : -1;
      R.drawFx(cam, pal, { i: mode === 'start' ? -1 : segI, t: segT, now: nowI }, time, dt, mode === 'end');
      var pn = mode === 'station' ? R.now : null;
      var pk = pn ? pn[0].toFixed(1) + ',' + pn[1].toFixed(1) : '';
      if (pk !== lastPulse) {
        lastPulse = pk;
        pulse.style.opacity = pn ? '1' : '0';
        if (pn) pulse.style.transform = 'translate3d(' + pn[0].toFixed(1) + 'px,' + pn[1].toFixed(1) + 'px,0)';
      }
      rose.style.opacity = (pal.ink * 0.7).toFixed(3);

      // poslije slijetanja još jednom oštro
      var moving = !!flight || mode === 'start';
      if (!moving && !sharp && now - landedAt > 140) { sharp = true; R.size(W, Hh, fullDpr); moving = true; }
      if (inView && !document.hidden && (moving || R.parts.length)) raf = requestAnimationFrame(frame);
      else last = 0;
    }

    function wake() {
      if (!raf && inView && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); }
    }

    /* ---------- unos: dugmad, tastatura, prevlačenje, klik na pribadaču ---------- */

    function onClick(e) {
      var t = e.target;
      var g = t.closest('[data-go]');
      if (g && player.contains(g)) { e.preventDefault(); setSkip(false); go(+g.getAttribute('data-go')); return; }
      if (t.closest('[data-autoplay]')) { setPlaying(true); go(0); return; }
      if (t.closest('[data-play]')) {
        if (playing) setPlaying(false);
        else { setPlaying(true); if (mode === 'start' || mode === 'end') go(0); else if (!flight) go(idx + 1); }
        return;
      }
      var s = t.closest('[data-step]');
      if (s) { step(+s.getAttribute('data-step')); return; }
      if (t.closest('[data-card]')) {
        var min = !player.classList.contains('is-min');
        player.classList.toggle('is-min', min);
        cardBtn.setAttribute('aria-pressed', min ? 'true' : 'false');
        cardBtn.setAttribute('aria-label', MSP.t(min ? 'history.cardShow' : 'history.cardHide'));
        return;
      }
      if (t.closest('.hx-skip__btn')) { setSkip(skipList.hidden); return; }
      if (!skipList.hidden && !t.closest('.hx-skip')) setSkip(false);
      if (t.closest('a,button,.hx-card,.hx-start__card,.hx-finale__card')) return;
      var hit = pinAt(e.clientX, e.clientY);
      if (hit >= 0) go(hit);
    }
    function setSkip(open) {
      skipBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      skipList.hidden = !open;
    }

    function pinAt(cx, cy) {
      if (!R.pins) return -1;
      var r = player.getBoundingClientRect(), x = cx - r.left, y = cy - r.top, best = -1, bd = 22 * 22;
      R.pins.forEach(function (p) { var d = (p[0] - x) * (p[0] - x) + (p[1] - y) * (p[1] - y); if (d < bd) { bd = d; best = p[2]; } });
      return best;
    }

    var down = null;
    function onDown(e) {
      if (e.target.closest('a,button,.hx-card,.hx-skip__list')) { down = null; return; }
      down = { x: e.clientX, y: e.clientY, t: performance.now() };
    }
    function onUp(e) {
      if (!down) return;
      var dx = e.clientX - down.x, dy = e.clientY - down.y;
      down = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        if (mode === 'start') { if (dx < 0) go(0); return; }
        step(dx < 0 ? 1 : -1);
      }
    }
    function onMove(e) {
      if (e.pointerType !== 'mouse' || flight) return;
      player.classList.toggle('is-pin', !e.target.closest('a,button,.hx-card') && pinAt(e.clientX, e.clientY) >= 0);
    }
    function onKey(e) {
      if (!inView || e.altKey || e.ctrlKey || e.metaKey) return;
      if (/input|textarea|select/i.test((document.activeElement || {}).tagName || '')) return;
      if (e.key === 'Escape' && !skipList.hidden) { setSkip(false); skipBtn.focus(); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        var r = player.getBoundingClientRect();
        if (r.top > window.innerHeight * 0.5 || r.bottom < window.innerHeight * 0.5) return;
        e.preventDefault();
        step(e.key === 'ArrowRight' ? 1 : -1);
      }
    }

    player.addEventListener('click', onClick);
    player.addEventListener('pointerdown', onDown, { passive: true });
    player.addEventListener('pointerup', onUp, { passive: true });
    player.addEventListener('pointercancel', function () { down = null; });
    player.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('keydown', onKey);

    // dugme "Kreni na putovanje" u uvodu: dođe do plejera i krene
    var startLink = root.querySelector('.hx-hero [data-start]');
    function onStart(e) {
      e.preventDefault();
      document.getElementById('put').scrollIntoView({ behavior: FX.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(function () { if (mode === 'start') go(0); }, 650);
    }
    if (startLink) startLink.addEventListener('click', onStart);

    /* ---------- vidljivost, veličina ---------- */

    var io = new IntersectionObserver(function (en) {
      inView = en[0].isIntersecting;
      if (inView) { loadGeo(function () { R.key = ''; wake(); }); wake(); }
      else if (playing) setPlaying(false);
    }, { threshold: 0.15 });
    io.observe(player);
    var resizeT = 0;
    function onResize() { clearTimeout(resizeT); resizeT = setTimeout(measure, 120); }
    window.addEventListener('resize', onResize);
    function onVis() { if (document.hidden) setPlaying(false); else wake(); }
    document.addEventListener('visibilitychange', onVis);
    if (document.fonts && document.fonts.load) document.fonts.load('italic 500 20px "Cormorant Garamond"').then(function () { R.key = ''; wake(); });

    player.classList.add('is-start');
    updateHud(-1);
    countEl.textContent = '0 / ' + N;
    measure();

    // link sa sidrom na stanicu (#istanbul): plejer odmah leti tamo
    var hashI = ST.findIndex(function (s) { return '#' + s.id === location.hash; });
    if (hashI >= 0) {
      document.getElementById('put').scrollIntoView({ block: 'start' });
      window.setTimeout(function () { go(hashI); }, 300);
    }

    ctx.cleanup(function () {
      inView = false;
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(dwellT);
      io.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('visibilitychange', onVis);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Manje pokreta: jedna statična mapa sa svim tragovima                 */
  /* ------------------------------------------------------------------ */

  function mountStatic() {
    var c = document.getElementById('hx-static');
    if (!c) return;
    c.hidden = false;
    var R = new Renderer(c, null, window.HISTORY.stations);
    function draw() {
      var w = c.clientWidth || 800, h = Math.round(w * 0.62), dpr = Math.min(window.devicePixelRatio || 1, 2);
      R.size(w, h, dpr);
      R.base = Math.min(w, h) * 0.45;
      var cam = { c: vec(28, 34), k: R.base * 1.15, x: w / 2, y: h * 0.56 };
      var pal = ERA.print;
      R.drawMap(cam, pal);
      // tragovi i pribadače na istom canvasu
      R.gf = R.g;
      var g = R.g, P = projector(cam), out = [0, 0, 0];
      g.lineCap = 'round';
      R.arcs.forEach(function (pts) {
        g.beginPath();
        var pen = false;
        pts.forEach(function (v) { P(v[0], v[1], v[2], out); if (out[2] > 0) { if (pen) g.lineTo(out[0], out[1]); else g.moveTo(out[0], out[1]); pen = true; } else pen = false; });
        g.strokeStyle = css(pal.trail, 0.85); g.lineWidth = 1.8; g.setLineDash([6, 4]); g.stroke(); g.setLineDash([]);
      });
      R.sv.forEach(function (v, i) {
        P(v[0], v[1], v[2], out);
        if (out[2] <= 0) return;
        g.fillStyle = css(pal.pin); g.beginPath(); g.arc(out[0], out[1], 4, 0, PI * 2); g.fill();
        g.font = '700 11px Manrope, system-ui, sans-serif'; g.fillStyle = css(pal.label);
        g.fillText(String(i + 1), out[0] + 7, out[1] - 7);
      });
    }
    loadGeo(draw);
    draw();
  }

  /* ------------------------------------------------------------------ */
  /* Sekcije ispod filma                                                  */
  /* ------------------------------------------------------------------ */

  function mountExtras(ctx) {
    // mit ili istina: okretanje kartice
    [].forEach.call(document.querySelectorAll('.hx-myth'), function (m) {
      var b = m.querySelector('.hx-myth__flip');
      var back = m.querySelector('.hx-myth__back');
      back.setAttribute('aria-hidden', 'true');
      b.addEventListener('click', function () {
        var on = !m.classList.contains('is-flipped');
        m.classList.toggle('is-flipped', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        back.setAttribute('aria-hidden', on ? 'false' : 'true');
      });
      // klik na poleđinu vraća karticu
      back.addEventListener('click', function () { if (m.classList.contains('is-flipped')) b.click(); });
    });

    // evolucija dijelova: prevlačenje prstom mijenja korak
    [].forEach.call(document.querySelectorAll('.hx-evo__stage'), function (st) {
      var radios = [].slice.call(st.querySelectorAll('.hx-evo__radio'));
      var x0 = null;
      st.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') x0 = e.clientX; }, { passive: true });
      st.addEventListener('pointerup', function (e) {
        if (x0 === null) return;
        var dx = e.clientX - x0;
        x0 = null;
        if (Math.abs(dx) < 40) return;
        var i = radios.findIndex(function (r) { return r.checked; });
        var j = clamp(i + (dx < 0 ? 1 : -1), 0, radios.length - 1);
        if (j !== i) { radios[j].checked = true; radios[j].dispatchEvent(new Event('change', { bubbles: true })); }
      }, { passive: true });
      st.addEventListener('pointercancel', function () { x0 = null; });
    });

    // muzej: dodir/klik osvijetli nargilu (na mobitelu nema hover)
    var exhibits = [].slice.call(document.querySelectorAll('.hx-exhibit__btn'));
    exhibits.forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') !== 'true';
        exhibits.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    });

    // nazivi: lista i tačke na mapi se pale zajedno
    var dotsByN = {};
    [].forEach.call(document.querySelectorAll('.hx-mdot'), function (d) { dotsByN[d.getAttribute('data-n')] = d; });
    [].forEach.call(document.querySelectorAll('.hx-name'), function (li) {
      var d = dotsByN[li.getAttribute('data-n')];
      if (!d) return;
      function on() { li.classList.add('is-hot'); d.classList.add('is-hot'); }
      function off() { li.classList.remove('is-hot'); d.classList.remove('is-hot'); }
      li.addEventListener('pointerenter', on);
      li.addEventListener('pointerleave', off);
      li.addEventListener('focusin', on);
      li.addEventListener('focusout', off);
    });
  }

  Pages.history = {
    mount: function (ctx) {
      var root = document.getElementById('hx');
      if (!root || !window.HISTORY) return;
      ctx.cleanup(FX.reveal(ctx.els.main));
      mountExtras(ctx);
      mountHero(ctx, root);
      if (FX.reducedMotion()) mountStatic();
      else mountPlayer(ctx, root);
    }
  };
})();
