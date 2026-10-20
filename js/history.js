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
    return c.toDataURL('image/png');
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
    var key = this.key + '|' + pos.i + '|' + pos.t.toFixed(4) + '|' + (all ? 1 : 0);
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

    // pribadače i imena
    var serif = glow < 0.5;
    var near = cur + (t > 0.5 ? 1 : 0);
    this.now = null;
    this.sv.forEach(function (v, i) {
      if (!all && i > near && !(i === cur + 1 && t > 0.75)) return;
      P(v[0], v[1], v[2], out);
      if (out[2] < 0.05) return;
      var x = out[0], y = out[1], isNow = !all && i === near;
      var fade = clamp(out[2] * 3, 0, 1);
      if (isNow) self.now = [x, y, fade];
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
      if (!all && (isNow || i === cur)) {
        var st = self.st[i];
        var label = serif ? st.old : MSP.L(st.city).toUpperCase();
        g.font = serif ? 'italic 500 ' + (isNow ? 22 : 16) + 'px "Cormorant Garamond", Georgia, serif' : '700 ' + (isNow ? 12 : 10) + 'px Manrope, system-ui, sans-serif';
        g.textBaseline = 'middle';
        var tx = x + (isNow ? 16 : 10), ty = y - (isNow ? 16 : 10);
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
  /* Film: listanje -> kamera, nargila, HUD                               */
  /* ------------------------------------------------------------------ */

  function mountFilm(ctx, root) {
    var D = window.HISTORY;
    var ST = D.stations, N = ST.length;
    var film = document.getElementById('hx-film');
    var stage = document.getElementById('hx-stage');
    var canvas = document.getElementById('hx-globe');
    var fxc = document.getElementById('hx-fx');
    var paper = stage.querySelector('.hx-paper');
    var rose = stage.querySelector('.hx-rose');
    var sky = document.getElementById('hx-sky');
    var hook = document.getElementById('hx-hookah');
    var rig = hook.querySelector('.hx-rig');
    var wisp = hook.querySelector('.hx-wisp');
    var wispPaths = [].slice.call(wisp.querySelectorAll('path'));
    var anat = stage.querySelector('.hx-anat');
    var pulse = stage.querySelector('.hx-pulse');
    var lastPulse = '';
    var hudEl = document.getElementById('hx-hud');
    var yearEl = document.getElementById('hx-year');
    var placeEl = document.getElementById('hx-place');
    var live = document.getElementById('hx-live');
    var fill = hudEl.querySelector('.hx-line__fill');
    var dots = [].slice.call(hudEl.querySelectorAll('.hx-dot'));
    var cards = [].slice.call(document.querySelectorAll('.hx-st'));
    var jintro = document.getElementById('hx-jintro');
    var finale = document.getElementById('hx-finale');
    var journey = film.querySelector('.hx-journey');
    var partEls = {};
    [].forEach.call(hook.querySelectorAll('.hx-part'), function (el) { partEls[el.getAttribute('data-part')] = el; });

    // pomak dijela kad je nargila rastavljena (jedinice viewBoxa 400x800) i dubina (px)
    var EXPLODE = {
      glava: [0, -235, 120], gumica: [0, -168, 90], tacna: [0, -104, 60], stub: [0, 0, 0],
      crijevo: [62, 50, 40], usnik: [96, 150, 70], difuzor: [0, 52, -40], vaza: [0, 292, -80]
    };

    var R = new Renderer(canvas, fxc, ST);
    var dprMax = (navigator.hardwareConcurrency || 8) <= 4 ? 1.5 : 2;
    var W = 0, Hh = 0, mobile = false, unit = 1;
    var A = [], heroStart = 0, heroEnd = 1;
    var target = { h: 0, p: -2 }, cur = { h: 0, p: -2 };
    var running = false, raf = 0, last = 0, time = 0, visible = true;
    var lastStation = -1, lastEra = '', lastYear = null, lastSky = -2, lastDots = -2, exploded = false, puffed = false;
    var pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    var heroOn = true, globeShown = false;
    var fullDpr = 1, lowDpr = 1, sharp = true, stillSince = 0;

    paper.style.backgroundImage = 'url(' + paperTexture() + ')';

    function absTop(el) { return el.getBoundingClientRect().top + window.scrollY; }

    function measure() {
      W = stage.clientWidth; Hh = stage.clientHeight;
      mobile = W < 900;
      fullDpr = Math.min(window.devicePixelRatio || 1, dprMax);
      // dok kamera leti, mapa se crta u manjoj rezoluciji (ne vidi se u pokretu), a kad stane, oštro
      lowDpr = W * Hh * fullDpr * fullDpr > 1.1e6 ? fullDpr * 0.62 : fullDpr * 0.8;
      R.size(W, Hh, sharp ? fullDpr : lowDpr);
      R.base = mobile ? Math.min(W * 0.46, Hh * 0.36) : Math.min(W, Hh) * 0.4;
      unit = hook.clientHeight / 800;
      var vh = window.innerHeight;
      heroStart = absTop(film);
      heroEnd = Math.max(heroStart + 10, absTop(journey) - vh * 0.55);
      A = [absTop(jintro) + jintro.offsetHeight * 0.5 - vh * 0.5];
      cards.forEach(function (li) {
        var card = li.firstElementChild, top = absTop(card), hgt = card.offsetHeight;
        A.push(mobile ? top - vh * 0.5 : top + hgt * 0.5 - vh * 0.5);
      });
      A.push(absTop(finale) + finale.offsetHeight - vh * 1.05);
      R.key = '';
      readScroll();
      wake();
    }

    function readScroll() {
      var y = window.scrollY;
      target.h = clamp((y - heroStart) / (heroEnd - heroStart), 0, 1);
      // p: -2 (svemir) .. -1 (uvod) .. 0..N-1 (stanice) .. N (kraj)
      var p;
      if (y <= A[0]) p = -1 - clamp((A[0] - y) / (window.innerHeight * 1.2), 0, 1);
      else if (y >= A[A.length - 1]) p = N;
      else {
        for (var i = 0; i < A.length - 1; i++) {
          if (y < A[i + 1]) { p = i - 1 + (y - A[i]) / Math.max(1, A[i + 1] - A[i]); break; }
        }
      }
      target.p = p;
    }

    /* ---------- kamera za napredak p ---------- */

    var SPACE = vec(ST[0].lon - 40, 22);
    var FINAL = vec(25, 30);
    function camFor(p) {
      var c, z, hold = 1;
      if (p <= -1) {
        var sp = clamp(p + 2, 0, 1);
        c = slerp(vec(ST[0].lon - 70, 18), SPACE, sp);
        z = 0.5 + 0.06 * sp; hold = 0;
      } else if (p < 0) {
        var t0 = easeInOut(p + 1);
        c = slerp(SPACE, R.sv[0], t0);
        z = Math.exp(lerp(Math.log(0.56), Math.log(ST[0].zoom), t0 * t0));
        hold = smooth(0.4, 1, p + 1);
      } else if (p >= N - 1) {
        var tf = easeInOut(clamp(p - (N - 1), 0, 1));
        c = slerp(R.sv[N - 1], FINAL, tf);
        z = Math.exp(lerp(Math.log(ST[N - 1].zoom), Math.log(0.68), tf));
        hold = 1 - smooth(0, 0.6, tf);
      } else {
        var i = Math.floor(p), f = p - i, tt = easeInOut(smooth(0.18, 0.82, f));
        var a = R.sv[i], b = R.sv[i + 1], d = angleOf(a, b);
        c = slerp(a, b, tt);
        var za = Math.log(ST[i].zoom), zb = Math.log(ST[i + 1].zoom);
        var zFar = Math.log(clamp(1.25 / Math.max(d, 0.05), 0.72, 3.2));
        var dip = Math.max(0, (za + zb) / 2 - zFar);
        z = Math.exp(lerp(za, zb, tt) - dip * Math.sin(PI * tt));
        hold = 1 - Math.sin(PI * tt) * 0.9;
      }
      var k = R.base * z;
      // gdje na ekranu stoji tačka koju gledamo: blizu grada pomjereno (lijevo od kartice, ili gore na mobitelu)
      var hx = mobile ? W * 0.5 : W * 0.36, hy = mobile ? Hh * 0.34 : Hh * 0.55;
      var w = clamp((z - 1) / 2.5, 0, 1) * hold;
      return { c: c, k: k, x: lerp(W * (mobile ? 0.5 : 0.5), hx, w), y: lerp(Hh * (mobile ? 0.48 : 0.54), hy, w) };
    }

    function yearFor(p) {
      if (p <= 0) return ST[0].year;
      if (p >= N - 1) return ST[N - 1].year;
      var i = Math.floor(p), f = p - i, tt = smooth(0.18, 0.82, f);
      return lerp(ST[i].year, ST[i + 1].year, tt);
    }

    /* ---------- nargila (uvod) ---------- */

    function renderHero(h) {
      var e = smooth(0.05, 0.38, h) - smooth(0.56, 0.78, h);
      var out = smooth(0.84, 1, h);
      var on = h < 0.999;
      if (on !== heroOn) { heroOn = on; hook.style.visibility = on ? '' : 'hidden'; }
      if (!on) return;
      var ex = e > 0.82;
      if (ex !== exploded) { exploded = ex; root.classList.toggle('is-exploded', ex); if (!ex) closeTags(); }
      // na mobitelu je nargila na početku niže (ispod naslova), pa se popne
      var intro = mobile ? 1 - smooth(0, 0.14, h) : 0;
      var lift = intro * Hh * 0.17 - e * 40 * unit;
      var sc = (1 - (mobile ? 0.4 : 0.36) * e - 0.25 * out) * (1 - 0.2 * intro);
      hook.style.transform = 'translate(-50%,-50%) translate3d(0,' + (lift - out * Hh * 0.22).toFixed(1) + 'px,0) scale(' + sc.toFixed(4) + ')';
      hook.style.opacity = (1 - smooth(0.8, 0.92, h)).toFixed(3);
      anat.style.opacity = smooth(0.25, 0.4, h) * (1 - smooth(0.56, 0.66, h)) + '';
      var rx = 9 * e + pointer.y * 4, ry = -16 * e + pointer.x * 8;
      rig.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
      Object.keys(EXPLODE).forEach(function (id) {
        var o = EXPLODE[id], el = partEls[id];
        if (el) el.style.transform = 'translate3d(' + (o[0] * unit * e).toFixed(1) + 'px,' + (o[1] * unit * e).toFixed(1) + 'px,' + (o[2] * e).toFixed(1) + 'px)';
      });
      var wv = smooth(0.74, 0.8, h) * (1 - smooth(0.95, 1, h));
      wisp.style.opacity = wv.toFixed(3);
      var off = (1 - smooth(0.76, 0.94, h)).toFixed(3);
      wispPaths.forEach(function (pth) { pth.style.strokeDashoffset = off; });
      if (h > 0.8 && !puffed) {
        puffed = true;
        var r = partEls.glava.getBoundingClientRect();
        if (FX.Field && FX.Field.puff) FX.Field.puff(r.left + r.width / 2, r.top + r.height * 0.06, { count: 8 });
      } else if (h < 0.7) puffed = false;
    }

    /* ---------- HUD ---------- */

    function setEra(era) {
      if (era === lastEra) return;
      lastEra = era;
      stage.classList.toggle('is-old', era === 'old');
      stage.classList.toggle('is-print', era === 'print');
      stage.classList.toggle('is-modern', era === 'modern');
    }

    function renderHud(p, year) {
      var y = Math.round(year);
      if (y !== lastYear) { lastYear = y; yearEl.textContent = y; }
      var hudA = smooth(-1.1, -0.6, p) * (1 - smooth(N - 0.7, N - 0.2, p));
      hudEl.style.opacity = hudA.toFixed(3);
      hudEl.classList.toggle('is-on', hudA > 0.5);
      fill.style.transform = 'scaleX(' + clamp(p / (N - 1), 0, 1).toFixed(4) + ')';
      var near = clamp(Math.round(p), 0, N - 1);
      if (near !== lastDots) {
        lastDots = near;
        dots.forEach(function (d, i) { d.classList.toggle('is-now', i === near); d.classList.toggle('is-past', i < near); });
        placeEl.textContent = MSP.L(ST[near].place);
      }
      var atStation = p > -0.25 && p < N - 0.75 && Math.abs(p - Math.round(p)) < 0.22 ? Math.round(p) : -1;
      if (atStation !== -1 && atStation !== lastStation) {
        lastStation = atStation;
        live.textContent = MSP.t('history.station', { n: atStation + 1, total: N }) + ': ' + MSP.L(ST[atStation].place) + ', ' + MSP.L(ST[atStation].when);
      }
    }

    function renderSky(p, era) {
      var j = clamp(Math.round(p), 0, N - 1);
      var prox = p < -0.5 || p > N - 0.5 ? 0 : 1 - smooth(0.1, 0.4, Math.abs(p - j));
      if (prox > 0.01 && j !== lastSky) {
        lastSky = j;
        sky.innerHTML = skySvg(ST[j].sky);
      }
      sky.style.opacity = prox.toFixed(3);
      sky.style.transform = 'translate3d(0,' + ((1 - prox) * 42).toFixed(1) + '%,0)';
    }

    /* ---------- petlja ---------- */

    function frame(now) {
      raf = 0;
      var dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      time += dt;
      readScroll();
      var a = 1 - Math.pow(1 - 0.14, dt * 60);
      cur.h += (target.h - cur.h) * a;
      cur.p += (target.p - cur.p) * a;
      if (Math.abs(target.h - cur.h) < 0.0004) cur.h = target.h;
      if (Math.abs(target.p - cur.p) < 0.0004) cur.p = target.p;
      pointer.x += (pointer.tx - pointer.x) * a;
      pointer.y += (pointer.ty - pointer.y) * a;

      renderHero(cur.h);

      var gA = smooth(0.84, 1, cur.h);
      var show = gA > 0.001;
      if (show !== globeShown) { globeShown = show; if (show) loadGeo(function () { R.key = ''; wake(); }); }
      canvas.style.opacity = gA.toFixed(3);
      fxc.style.opacity = gA.toFixed(3);

      var year = yearFor(cur.p);
      var pal = paletteFor(year);
      var era = year < 1850 ? 'old' : year < 1985 ? 'print' : 'modern';
      setEra(era);
      if (show) {
        var cam = camFor(cur.p);
        R.drawMap(cam, pal);
        var i = clamp(Math.floor(cur.p), 0, N - 1), f = cur.p - i;
        var pos = cur.p < 0 ? { i: 0, t: 0 } : cur.p >= N - 1 ? { i: N - 1, t: 0 } : { i: i, t: smooth(0.18, 0.82, f) };
        R.drawFx(cam, pal, pos, time, dt, cur.p > N - 0.6);
        var pn = R.now, pk = pn ? pn[0].toFixed(1) + ',' + pn[1].toFixed(1) + ',' + (pn[2] * gA).toFixed(2) : '';
        if (pk !== lastPulse) {
          lastPulse = pk;
          pulse.style.opacity = pn ? (pn[2] * gA).toFixed(2) : '0';
          if (pn) pulse.style.transform = 'translate3d(' + pn[0].toFixed(1) + 'px,' + pn[1].toFixed(1) + 'px,0)';
        }
      }
      paper.style.opacity = (pal.paper * 0.6 * gA).toFixed(3);
      rose.style.opacity = (pal.ink * 0.7 * gA * smooth(-1.2, -0.6, cur.p)).toFixed(3);
      renderHud(cur.p, year);
      renderSky(cur.p, era);

      var settled = cur.h === target.h && cur.p === target.p && Math.abs(pointer.tx - pointer.x) < 0.001 && Math.abs(pointer.ty - pointer.y) < 0.001;
      var camStill = Math.abs(target.p - cur.p) < 0.002;
      if (!camStill) {
        stillSince = 0;
        if (sharp && show) { sharp = false; R.size(W, Hh, lowDpr); }
      } else if (!sharp) {
        if (!stillSince) stillSince = now;
        if (now - stillSince > 160) { sharp = true; R.size(W, Hh, fullDpr); settled = false; }
        else settled = false;
      }
      // dok se dim sa traga još razilazi, petlja radi i kad se ne lista; pribadača pulsira u CSS-u
      if (running && visible && !document.hidden && (!settled || R.parts.length)) raf = requestAnimationFrame(frame);
      else last = 0;
    }

    function wake() {
      if (!raf && running && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); }
    }

    function onScroll() { wake(); }

    /* ---------- natpisi dijelova ---------- */

    var tags = [].slice.call(hook.querySelectorAll('.hx-tag'));
    function closeTags(except) { tags.forEach(function (b) { if (b !== except) b.setAttribute('aria-expanded', 'false'); }); }
    tags.forEach(function (b) {
      b.addEventListener('click', function () {
        var open = b.getAttribute('aria-expanded') !== 'true';
        closeTags(b);
        b.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });

    /* ---------- skok na stanicu ---------- */

    function go(i) {
      var y = A[clamp(i, 0, N - 1) + 1];
      window.scrollTo({ top: y, behavior: 'smooth' });
      var h = cards[i] && cards[i].querySelector('h3');
      if (h) {
        h.setAttribute('tabindex', '-1');
        window.setTimeout(function () { h.focus({ preventScroll: true }); }, 900);
      }
    }
    var skipBtn = hudEl.querySelector('.hx-skip__btn');
    var skipList = document.getElementById('hx-skip-list');
    function setSkip(open) {
      skipBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      skipList.hidden = !open;
    }
    skipBtn.addEventListener('click', function () { setSkip(skipList.hidden); });
    hudEl.addEventListener('click', function (e) {
      var a = e.target.closest('[data-go]');
      if (!a) return;
      e.preventDefault();
      setSkip(false);
      go(+a.getAttribute('data-go'));
    });
    function onKey(e) {
      if (e.key === 'Escape' && !skipList.hidden) { setSkip(false); skipBtn.focus(); return; }
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.altKey || e.ctrlKey || e.metaKey || /input|textarea|select/i.test((document.activeElement || {}).tagName || '')) return;
      if (cur.p < -0.5 || cur.p > N - 0.5) return;
      e.preventDefault();
      go(clamp(Math.round(cur.p) + (e.key === 'ArrowRight' ? 1 : -1), 0, N - 1));
    }
    document.addEventListener('click', function (e) {
      if (!skipList.hidden && !e.target.closest('.hx-skip')) setSkip(false);
      if (!e.target.closest('.hx-tag')) closeTags();
    });

    function onPointer(e) {
      if (e.pointerType !== 'mouse' || !heroOn) return;
      pointer.tx = e.clientX / window.innerWidth - 0.5;
      pointer.ty = e.clientY / window.innerHeight - 0.5;
      wake();
    }

    /* ---------- start / stop ---------- */

    var io = new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible) wake();
    }, { rootMargin: '200px 0px' });
    io.observe(film);

    // mapa se učitava unaprijed, čim se korisnik približi kraju uvoda
    var pre = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { loadGeo(function () { R.key = ''; wake(); }); pre.disconnect(); }
    }, { rootMargin: '100% 0px' });
    pre.observe(journey);

    var resizeT = 0;
    function onResize() { window.clearTimeout(resizeT); resizeT = window.setTimeout(measure, 120); }
    var ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(film);
    function onVis() { if (!document.hidden) wake(); }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('keydown', onKey);
    document.addEventListener('visibilitychange', onVis);
    if (document.fonts && document.fonts.load) document.fonts.load('italic 500 20px "Cormorant Garamond"').then(function () { wake(); });

    running = true;
    measure();
    // fontovi i slike mogu promijeniti visine kartica
    window.addEventListener('load', measure, { once: true });

    ctx.cleanup(function () {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect(); pre.disconnect(); if (ro) ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointer);
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
      if (FX.reducedMotion()) mountStatic();
      else mountFilm(ctx, root);
    }
  };
})();
