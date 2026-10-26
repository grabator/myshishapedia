/*
 * MyShishapedia - Slika sesije.
 *
 * Posjetilac izabere fotografiju svoje nargile, doda 1-4 okusa (iz baze ili ručno), ukupnu
 * količinu i omjer, a preko fotografije se nacrta krug u bojama okusa i lista sa gramima.
 * Sve se crta u browseru (canvas): fotografija se nigdje ne šalje. Na slici su još naslov,
 * ugalj i posuda (ako ih upiše), adresa stranice i QR kod koji otvara isti miks (?m=...).
 *
 * Krug i lista se mogu povući prstom, a fotografija namjestiti povlačenjem i uvećanjem.
 * Miks (bez fotografije) se pamti u localStorage, da sljedeći put bude spreman.
 * Ovisi o: views.js (V), strings.js (t), illustrations.js (MSP.color), qr.js (qrcode).
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var V = MSP.V;
  var t = MSP.t;
  var C = MSP.color;
  var root = document.getElementById('ses');
  if (!root) return;

  var SIZES = { post: [1080, 1350], story: [1080, 1920], square: [1080, 1080] };
  var MAX = 4;
  var STORE = 'msp-session';
  var FALLBACK = ['#ff8a3d', '#8f7bff', '#3fc1c9', '#f2c230', '#ff6fae', '#2fae78'];
  var bs = MSP.lang === 'bs';

  var $ = function (id) { return document.getElementById(id); };
  var els = {
    canvas: $('ses-canvas'), stage: $('ses-stage'), empty: $('ses-empty'), rows: $('ses-rows'), q: $('ses-q'), results: $('ses-results'),
    total: $('ses-total'), max: $('ses-max'), add: $('ses-add'), file: $('ses-file'), cam: $('ses-cam'), photoX: $('ses-photo-x'), pickTxt: $('ses-pick-txt'),
    zoomWrap: $('ses-zoomwrap'), zoom: $('ses-zoom'), head: $('ses-head'), coals: $('ses-coals'), bowl: $('ses-bowl'), showBrand: $('ses-brand'), showQr: $('ses-qr'),
    save: $('ses-save'), share: $('ses-share'), copy: $('ses-copy'), status: $('ses-status'), shared: $('ses-shared')
  };

  var S = {
    photo: null, fx: 0.5, fy: 0.5, zoom: 1,
    items: [], total: 20,
    format: 'post', style: 'neon',
    heading: '', coals: '', bowl: '', showBrand: true, showQr: true,
    pos: null // {x, y} gornji lijevi ugao kruga i liste (0-1), null = podrazumijevano
  };

  /* ------------------------------------------------------------------ */
  /* Pomoćne                                                             */
  /* ------------------------------------------------------------------ */

  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd'); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function num(v, d) { return (Math.round(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', bs ? ',' : '.'); }

  /** Boja okusa koja se jasno vidi preko tamne fotografije. */
  function glowColor(hex) {
    var c = hex || '#f2a33c';
    for (var i = 0; i < 6 && C.contrast(c, '#0d0b0a') < 5.2; i++) c = C.lighten(c, 0.22);
    return c;
  }

  function dist(a, b) {
    var x = C.hexToRgb(a), y = C.hexToRgb(b);
    return Math.sqrt(Math.pow(x.r - y.r, 2) + Math.pow(x.g - y.g, 2) + Math.pow(x.b - y.b, 2));
  }

  /** Boja okusa iz njegove palete; ako je preblizu boji drugog okusa u miksu, uzima sljedeću. */
  function flavorColor(f, used) {
    var p = f.palette || {};
    var cands = [p.primary, p.secondary, p.accent].filter(Boolean).map(glowColor);
    if (!cands.length) cands = [FALLBACK[0]];
    used = used || [];
    for (var i = 0; i < cands.length; i++) {
      if (used.every(function (u) { return dist(u, cands[i]) > 90; })) return cands[i];
    }
    for (var k = 0; k < FALLBACK.length; k++) {
      if (used.every(function (u) { return dist(u, FALLBACK[k]) > 90; })) return FALLBACK[k];
    }
    return cands[0];
  }

  function usedColors(skip) { return S.items.filter(function (x) { return x !== skip; }).map(function (x) { return x.color; }); }

  /** Kad se miks promijeni, boje se ponovo rasporede da se okusi razlikuju. */
  function recolor() {
    var used = [];
    S.items.forEach(function (x, k) {
      var f = x.id && V.flavorById(x.id);
      x.color = f ? flavorColor(f, used) : (used.every(function (u) { return dist(u, x.color) > 90; }) ? x.color : flavorColor({ palette: {} }, used));
      used.push(x.color);
    });
  }

  function itemFromFlavor(f, pct) {
    return { id: f.id, brand: f.brand, name: f.name, color: flavorColor(f), pct: pct || 0 };
  }

  function itemCustom(brand, name, pct, k) {
    return { id: null, brand: brand, name: name, color: FALLBACK[k % FALLBACK.length], pct: pct || 0 };
  }

  /** Cijeli brojevi proporcionalni vals koji daju tačno total (najveći ostatak). */
  function round100(vals, total) {
    total = total == null ? 100 : total;
    var sum = vals.reduce(function (s, v) { return s + v; }, 0) || 1;
    var raw = vals.map(function (v) { return v * total / sum; });
    var out = raw.map(Math.floor);
    var left = total - out.reduce(function (s, v) { return s + v; }, 0);
    raw.map(function (v, i) { return [v - Math.floor(v), i]; }).sort(function (a, b) { return b[0] - a[0]; }).slice(0, left).forEach(function (x) { out[x[1]]++; });
    return out;
  }

  /** Jedan okus dobija v %, ostali dijele ostatak u istom međusobnom omjeru (svaki bar 1 %). */
  function setPct(i, v) {
    var it = S.items, n = it.length;
    if (n < 2) { if (n) it[0].pct = 100; return; }
    v = clamp(Math.round(v), 1, 100 - (n - 1));
    var others = [];
    it.forEach(function (x, k) { if (k !== i) others.push(Math.max(x.pct, 0.5)); });
    var ints = round100(others, 100 - v);
    // nijedan ne smije pasti na 0: uzmi od najvećeg
    ints.forEach(function (x, k) {
      if (x < 1) { var big = ints.indexOf(Math.max.apply(null, ints)); ints[big] -= 1 - x; ints[k] = 1; }
    });
    var j = 0;
    it.forEach(function (x, k) { x.pct = k === i ? v : ints[j++]; });
  }

  function fixSum() {
    var it = S.items;
    if (!it.length) return;
    var ints = round100(it.map(function (x) { return Math.max(x.pct, 0.0001); }));
    it.forEach(function (x, k) { x.pct = ints[k]; });
  }

  function grams(it) { return S.total * it.pct / 100; }

  function coalsText(n) {
    if (bs) {
      if (n === 1) return t('session.coalsOne');
      var d = n % 10, h = n % 100;
      return t(d >= 2 && d <= 4 && (h < 12 || h > 14) ? 'session.coalsLine' : 'session.coalsMany', { n: n });
    }
    return n === 1 ? t('session.coalsOne') : t('session.coalsLine', { n: n });
  }

  function origin() {
    var l = document.querySelector('link[rel=canonical]');
    return (l ? l.href : location.href).replace(/^(https?:\/\/[^/]+).*$/, '$1');
  }

  /** Link koji otvara isti miks na ovoj stranici (za QR i "Kopiraj link"). */
  function mixUrl(shared) {
    var m = S.items.map(function (it) {
      return (it.id ? it.id : '~' + encodeURIComponent(it.brand || '') + '~' + encodeURIComponent(it.name)) + ':' + it.pct;
    }).join(',');
    return origin() + V.url('session') + '?m=' + encodeURIComponent(m).replace(/%2C/g, ',').replace(/%3A/g, ':').replace(/%7E/gi, '~') + '&g=' + S.total + (shared ? '&s=1' : '');
  }

  function prettyUrl() { return origin().replace(/^https?:\/\//, '') + V.url('session').replace(/\/$/, ''); }

  /* ------------------------------------------------------------------ */
  /* Stanje: URL, localStorage                                           */
  /* ------------------------------------------------------------------ */

  function parseItems(m) {
    var out = [];
    String(m || '').split(',').forEach(function (tok, k) {
      if (out.length >= MAX) return;
      var i = tok.lastIndexOf(':');
      var key = i > 0 ? tok.slice(0, i) : tok;
      var pct = i > 0 ? parseFloat(tok.slice(i + 1)) : 0;
      if (key.charAt(0) === '~') {
        var parts = key.split('~');
        var name = decodeURIComponent(parts[2] || '').slice(0, 32);
        if (name) out.push(itemCustom(decodeURIComponent(parts[1] || '').slice(0, 24), name, pct, k));
      } else {
        var f = V.flavorById(key);
        if (f) out.push(itemFromFlavor(f, pct));
      }
    });
    return out;
  }

  function load() {
    var p = new URLSearchParams(location.search);
    if (p.get('m')) {
      S.items = parseItems(decodeURIComponent(p.get('m')));
      var g = parseFloat(p.get('g'));
      if (g > 0 && g <= 60) S.total = g;
      if (p.get('s') === '1') els.shared.hidden = false;
    } else {
      try {
        var st = JSON.parse(localStorage.getItem(STORE) || 'null');
        if (st && st.items) {
          S.items = st.items.map(function (x, k) {
            var f = x.id && V.flavorById(x.id);
            return f ? itemFromFlavor(f, x.pct) : itemCustom(x.brand, x.name, x.pct, k);
          }).filter(function (x) { return x.name; }).slice(0, MAX);
          ['total', 'format', 'style', 'heading', 'coals', 'bowl', 'showBrand', 'showQr'].forEach(function (k) { if (st[k] != null) S[k] = st[k]; });
        }
      } catch (e) { /* localStorage nije dostupan */ }
    }
    if (!S.items.length) {
      var d = V.defaultMix();
      S.items = [itemFromFlavor(d.a, 60), itemFromFlavor(d.b, 40)];
    }
    if (!S.items.some(function (x) { return x.pct > 0; })) S.items.forEach(function (x) { x.pct = 1; });
    fixSum();
  }

  var saveT = 0;
  function persist() {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      try {
        localStorage.setItem(STORE, JSON.stringify({
          items: S.items.map(function (x) { return { id: x.id, brand: x.brand, name: x.name, pct: x.pct }; }),
          total: S.total, format: S.format, style: S.style, heading: S.heading, coals: S.coals, bowl: S.bowl, showBrand: S.showBrand, showQr: S.showQr
        }));
      } catch (e) { /* ignore */ }
    }, 300);
  }

  /* ------------------------------------------------------------------ */
  /* Crtanje                                                             */
  /* ------------------------------------------------------------------ */

  var fontsP = null;
  function fontsReady() {
    if (fontsP) return fontsP;
    if (!document.fonts || !document.fonts.load) return (fontsP = Promise.resolve());
    fontsP = Promise.all([
      document.fonts.load('800 100px Syne'), document.fonts.load('700 40px Manrope'), document.fonts.load('600 40px Manrope'), document.fonts.load('800 40px Manrope')
    ]).then(function () { return document.fonts.ready; }, function () {});
    return fontsP;
  }

  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function fit(ctx, text, maxW, size, weight, family, min) {
    var s = size;
    for (;;) {
      ctx.font = weight + ' ' + s + 'px ' + family;
      if (ctx.measureText(text).width <= maxW || s <= min) return s;
      s -= 1;
    }
  }

  function ellipsize(ctx, text, maxW) {
    if (ctx.measureText(text).width <= maxW) return text;
    var s = text;
    while (s.length > 1 && ctx.measureText(s + '…').width > maxW) s = s.slice(0, -1);
    return s + '…';
  }

  function spaced(s) { return s.toUpperCase().split('').join(String.fromCharCode(8202)); }

  function drawBackground(ctx, W, H) {
    if (S.photo) {
      var img = S.photo, iw = img.width, ih = img.height;
      var sc = Math.max(W / iw, H / ih) * S.zoom;
      var dw = iw * sc, dh = ih * sc;
      var x = (W - dw) * S.fx, y = (H - dh) * S.fy;
      ctx.drawImage(img, x, y, dw, dh);
      return;
    }
    // bez fotografije: tamna pozadina sa mekim mrljama u bojama okusa i dimom
    ctx.fillStyle = '#120e0c';
    ctx.fillRect(0, 0, W, H);
    var cols = S.items.map(function (x) { return x.color; });
    if (!cols.length) cols = ['#f2a33c'];
    var spots = [[0.18, 0.2, 0.75], [0.85, 0.35, 0.7], [0.3, 0.85, 0.8], [0.8, 0.95, 0.6]];
    spots.forEach(function (sp, i) {
      var g = ctx.createRadialGradient(W * sp[0], H * sp[1], 0, W * sp[0], H * sp[1], W * sp[2]);
      g.addColorStop(0, C.rgba(cols[i % cols.length], 0.42));
      g.addColorStop(1, C.rgba(cols[i % cols.length], 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
    ctx.save();
    for (var i = 0; i < 22; i++) {
      var k = i / 22;
      var sx = W * 0.5 + Math.sin(k * 8 + i) * W * (0.06 + k * 0.25);
      var sy = H * (0.92 - k * 0.75);
      var r = W * (0.05 + k * 0.16);
      var g2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
      g2.addColorStop(0, 'rgba(255,255,255,' + (0.12 * (1 - k * 0.6)).toFixed(3) + ')');
      g2.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g2;
      ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  /** Raspored: krug i lista jedno do drugog; vraća sve mjere u pikselima slike. */
  function layout(W, H, ctx) {
    var u = W / 1080;
    var story = S.format === 'story';
    var D = Math.round(250 * u);
    var gap = Math.round(36 * u);
    var listW = Math.round(560 * u);
    var rowH = Math.round((S.showBrand ? 92 : 70) * u);
    var listH = rowH * S.items.length;
    var gw = D + gap + listW, gh = Math.max(D, listH);
    var safeTop = story ? 250 * u : 60 * u;
    var x, y;
    if (S.pos) { x = S.pos.x * W; y = S.pos.y * H; }
    else { x = 60 * u; y = safeTop; }
    x = clamp(x, 0, W - gw); y = clamp(y, 0, H - gh);
    // stvarna širina liste (za stakleni panel koji prati sadržaj)
    var used = listW;
    if (ctx) {
      used = 0;
      S.items.forEach(function (it) {
        ctx.font = '800 ' + Math.round(34 * u) + 'px Manrope';
        var w = ctx.measureText(it.name).width + 18 * u;
        ctx.font = '600 ' + Math.round(26 * u) + 'px Manrope';
        w += ctx.measureText(it.pct + '% · ' + num(grams(it), 1) + 'g').width;
        if (S.showBrand && it.brand) { ctx.font = '800 ' + Math.round(17 * u) + 'px Manrope'; w = Math.max(w, ctx.measureText(spaced(it.brand)).width); }
        used = Math.max(used, w + 44 * u);
      });
      used = Math.min(listW, used);
    }
    return { u: u, D: D, gap: gap, listW: listW, used: used, rowH: rowH, x: x, y: y, w: gw, h: gh, story: story };
  }

  function drawGroup(ctx, W, H, L) {
    var u = L.u, st = S.style;
    var cx = L.x + L.D / 2, cy = L.y + L.h / 2;
    var listX = L.x + L.D + L.gap, listY = L.y + (L.h - L.rowH * S.items.length) / 2;
    var white = '#ffffff';

    if (st === 'glass') {
      var px = L.x - 34 * u, py = L.y - 30 * u, pw = L.D + L.gap + L.used + 68 * u, ph = L.h + 60 * u;
      ctx.save();
      rr(ctx, px, py, pw, ph, 40 * u);
      ctx.clip();
      ctx.filter = 'blur(' + Math.round(22 * u) + 'px)';
      drawBackground(ctx, W, H);
      ctx.filter = 'none';
      ctx.fillStyle = 'rgba(14,11,10,0.42)';
      ctx.fillRect(px, py, pw, ph);
      ctx.restore();
      rr(ctx, px, py, pw, ph, 40 * u);
      ctx.strokeStyle = 'rgba(255,255,255,0.22)';
      ctx.lineWidth = 2 * u;
      ctx.stroke();
    } else if (st === 'neon') {
      // tamni oblak iza teksta da se čita na svijetloj fotografiji
      var g = ctx.createRadialGradient(L.x + L.w * 0.45, cy, 0, L.x + L.w * 0.45, cy, L.w * 0.75);
      g.addColorStop(0, 'rgba(8,6,5,0.5)');
      g.addColorStop(1, 'rgba(8,6,5,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    } else {
      var gm = ctx.createLinearGradient(0, L.y - 80 * u, 0, L.y + L.h + 80 * u);
      gm.addColorStop(0, 'rgba(0,0,0,0)'); gm.addColorStop(0.5, 'rgba(0,0,0,0.38)'); gm.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gm;
      ctx.fillRect(0, L.y - 80 * u, W, L.h + 160 * u);
    }

    // krug
    var R = L.D / 2, ring = R * (st === 'minimal' ? 0.16 : 0.27);
    var a0 = -Math.PI / 2, gapA = S.items.length > 1 ? 0.035 : 0;
    ctx.save();
    if (st !== 'minimal') { ctx.beginPath(); ctx.arc(cx, cy, R - ring / 2, 0, Math.PI * 2); ctx.lineWidth = ring; ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.stroke(); }
    S.items.forEach(function (it) {
      var sweep = Math.PI * 2 * it.pct / 100;
      ctx.beginPath();
      ctx.arc(cx, cy, R - ring / 2, a0 + gapA / 2, a0 + sweep - gapA / 2);
      ctx.lineWidth = ring;
      ctx.lineCap = 'butt';
      ctx.strokeStyle = it.color;
      if (st === 'neon') { ctx.shadowColor = it.color; ctx.shadowBlur = 34 * u; }
      ctx.stroke();
      a0 += sweep;
    });
    ctx.restore();
    // sredina kruga
    if (st !== 'minimal') {
      ctx.beginPath(); ctx.arc(cx, cy, R - ring - 4 * u, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(14,11,10,0.55)'; ctx.fill();
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '800 ' + Math.round(15 * u) + 'px Manrope';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(spaced(t('session.total0')), cx, cy - 30 * u);
    var tot = num(S.total, S.total % 1 ? 1 : 0) + 'g';
    ctx.fillStyle = white;
    fit(ctx, tot, R * 1.15, Math.round(64 * u), '800', 'Syne', 20);
    ctx.textBaseline = 'middle';
    ctx.fillText(tot, cx, cy + 6 * u);
    ctx.textBaseline = 'alphabetic';
    ctx.font = '700 ' + Math.round(13 * u) + 'px Manrope';
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText('MYSHISHAPEDIA', cx, cy + 46 * u);

    // lista
    ctx.textAlign = 'left';
    S.items.forEach(function (it, i) {
      var ry = listY + i * L.rowH;
      var mid = ry + L.rowH / 2;
      var dot = 13 * u;
      var nameY = S.showBrand ? mid + 22 * u : mid + 12 * u;
      ctx.save();
      if (st === 'neon') { ctx.shadowColor = it.color; ctx.shadowBlur = 16 * u; }
      ctx.beginPath(); ctx.arc(listX + dot, nameY - 11 * u, dot, 0, Math.PI * 2); ctx.fillStyle = it.color; ctx.fill();
      ctx.restore();
      var tx = listX + dot * 2 + 18 * u;
      var avail = L.listW - (tx - listX);
      if (S.showBrand && it.brand) {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 8 * u;
        ctx.font = '800 ' + Math.round(17 * u) + 'px Manrope';
        ctx.fillStyle = it.color;
        ctx.fillText(ellipsize(ctx, spaced(it.brand), avail), tx, mid - 14 * u);
        ctx.restore();
      }
      var right = it.pct + '% · ' + num(grams(it), 1) + 'g';
      ctx.font = '600 ' + Math.round(26 * u) + 'px Manrope';
      var rw = ctx.measureText(right).width;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 10 * u;
      ctx.font = '800 ' + Math.round(34 * u) + 'px Manrope';
      var nm = ellipsize(ctx, it.name, avail - rw - 22 * u);
      ctx.fillStyle = white;
      ctx.fillText(nm, tx, nameY);
      var nw = ctx.measureText(nm).width;
      ctx.font = '600 ' + Math.round(26 * u) + 'px Manrope';
      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.fillText(right, tx + nw + 18 * u, nameY);
      ctx.restore();
    });
  }

  function drawQR(ctx, text, x, y, size) {
    if (typeof window.qrcode !== 'function') return false;
    var qr = window.qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    var n = qr.getModuleCount();
    // tihi rub od 2,5 polja da ga kamera lakše uhvati
    var cell = size / (n + 5), pad = cell * 2.5;
    ctx.fillStyle = '#ffffff';
    rr(ctx, x, y, size, size, size * 0.1);
    ctx.fill();
    ctx.fillStyle = '#120e0c';
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (qr.isDark(r, c)) ctx.fillRect(Math.floor(x + pad + c * cell), Math.floor(y + pad + r * cell), Math.ceil(cell), Math.ceil(cell));
      }
    }
    return true;
  }

  function drawFooter(ctx, W, H, L) {
    var u = L.u;
    var bottom = L.story ? H - 250 * u : H - 46 * u;
    var bh = (S.showQr ? 184 : 150) * u, bx = 46 * u, bw = W - 92 * u, by = bottom - bh;
    var ty = by + (bh - 150 * u) / 2;
    // tamni prelaz pri dnu
    var g = ctx.createLinearGradient(0, by - 160 * u, 0, H);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = g;
    ctx.fillRect(0, by - 160 * u, W, H - by + 160 * u);
    ctx.save();
    rr(ctx, bx, by, bw, bh, 34 * u);
    ctx.fillStyle = 'rgba(14,11,10,0.62)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.lineWidth = 2 * u;
    ctx.stroke();
    ctx.restore();

    var qs = S.showQr ? bh - 20 * u : 0;
    var qx = bx + bw - qs - 10 * u, qy = by + 10 * u;
    if (S.showQr) drawQR(ctx, mixUrl(true), qx, qy, qs);
    var tx = bx + 34 * u, avail = (S.showQr ? qx - 24 * u : bx + bw - 30 * u) - tx;
    var head = (S.heading || '').trim() || t('session.defaultHeading');
    var meta = [];
    var nc = parseInt(S.coals, 10);
    if (nc > 0) meta.push(coalsText(nc));
    if ((S.bowl || '').trim()) meta.push(S.bowl.trim());
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ffffff';
    fit(ctx, head, avail, Math.round(40 * u), '800', 'Syne', Math.round(24 * u));
    ctx.fillText(ellipsize(ctx, head, avail), tx, ty + (meta.length ? 62 : 74) * u);
    if (meta.length) {
      ctx.font = '600 ' + Math.round(22 * u) + 'px Manrope';
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.fillText(ellipsize(ctx, meta.join(' · '), avail), tx, ty + 98 * u);
    }
    // logo i adresa
    var ly = ty + 126 * u;
    var parts = [['my', '400', '#ffffff'], ['shisha', '800', '#f2a33c'], ['pedia', '400', '#ffffff']];
    var x = tx, sz = Math.round(22 * u);
    parts.forEach(function (p) { ctx.font = p[1] + ' ' + sz + 'px Syne'; ctx.fillStyle = p[2]; ctx.fillText(p[0], x, ly); x += ctx.measureText(p[0]).width; });
    if (!meta.length || avail > 520 * u) {
      ctx.font = '600 ' + Math.round(17 * u) + 'px Manrope';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      var url = '  ' + prettyUrl();
      ctx.fillText(ellipsize(ctx, url, tx + avail - x), x, ly);
    }
  }

  var lastL = null;
  function paint(canvas, W, H, scale) {
    var ctx = canvas.getContext('2d');
    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    drawBackground(ctx, W, H);
    var L = layout(W, H, ctx);
    lastL = L;
    if (S.items.length) drawGroup(ctx, W, H, L);
    drawFooter(ctx, W, H, L);
    return canvas;
  }

  var raf = 0;
  function render() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = 0;
      var sz = SIZES[S.format];
      els.stage.setAttribute('data-format', S.format);
      var cssW = els.canvas.getBoundingClientRect().width || 400;
      var scale = Math.min(1, cssW * (window.devicePixelRatio || 1) / sz[0]);
      fontsReady().then(function () { paint(els.canvas, sz[0], sz[1], scale); });
      els.empty.hidden = !!S.items.length;
      $('ses-drop').hidden = !!S.photo;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Editor: redovi okusa                                                */
  /* ------------------------------------------------------------------ */

  function rowsHtml() {
    return S.items.map(function (it, i) {
      var label = (it.brand ? it.brand + ' ' : '') + it.name;
      var link = it.id ? '<a class="ses-row__open" href="' + V.esc(V.flavorUrl(V.flavorById(it.id))) + '">' + V.esc(t('session.openFlavor')) + '</a>' : '';
      return (
        '<li class="ses-row" style="--fc:' + it.color + '" data-i="' + i + '">' +
          '<span class="ses-row__dot" aria-hidden="true"></span>' +
          '<span class="ses-row__txt"><small>' + V.esc(it.brand || '') + '</small><b>' + V.esc(it.name) + '</b>' + link + '</span>' +
          '<span class="ses-num ses-row__g"><input type="number" inputmode="decimal" min="0.1" max="60" step="0.1" value="' + (Math.round(grams(it) * 10) / 10) + '" aria-label="' + V.esc(t('session.gramLabel', { name: label })) + '" data-g><em>' + V.esc(t('session.grams')) + '</em></span>' +
          '<button type="button" class="ses-row__x" data-x aria-label="' + V.esc(t('session.remove', { name: label })) + '">' + V.icon('trash') + '</button>' +
          '<span class="ses-row__range"><input type="range" class="range" min="1" max="100" step="1" value="' + it.pct + '" aria-label="' + V.esc(t('session.pctLabel', { name: label })) + '" data-p><output>' + it.pct + '%</output></span>' +
        '</li>'
      );
    }).join('');
  }

  function drawRows() {
    recolor();
    els.rows.innerHTML = rowsHtml();
    syncRows();
  }

  /** Osvježi brojke u redovima bez ponovnog crtanja (da klizač ne izgubi fokus). */
  function syncRows(skip) {
    Array.prototype.forEach.call(els.rows.children, function (li, i) {
      var it = S.items[i];
      if (!it) return;
      var r = li.querySelector('[data-p]'), g = li.querySelector('[data-g]');
      if (r !== skip) r.value = it.pct;
      r.max = String(100 - (S.items.length - 1));
      r.disabled = S.items.length === 1;
      li.querySelector('output').textContent = it.pct + '%';
      if (g !== skip) g.value = Math.round(grams(it) * 10) / 10;
      li.style.setProperty('--pct', it.pct + '%');
    });
    var full = S.items.length >= MAX;
    els.add.hidden = full;
    els.max.hidden = !full;
  }

  function changed(skip) { syncRows(skip); render(); persist(); }

  els.rows.addEventListener('input', function (e) {
    var li = e.target.closest('.ses-row');
    if (!li) return;
    var i = +li.getAttribute('data-i');
    if (e.target.hasAttribute('data-p')) {
      setPct(i, +e.target.value);
      changed(e.target);
    } else if (e.target.hasAttribute('data-g')) {
      var v = parseFloat(String(e.target.value).replace(',', '.'));
      if (!(v > 0)) return;
      // grami jednog okusa: ukupno postaje zbir, postoci se preračunaju
      var gs = S.items.map(function (x, k) { return k === i ? v : grams(x); });
      var sum = gs.reduce(function (s, x) { return s + x; }, 0);
      S.total = Math.round(sum * 10) / 10;
      els.total.value = S.total;
      var ints = round100(gs);
      S.items.forEach(function (x, k) { x.pct = Math.max(1, ints[k]); });
      fixSum();
      changed(e.target);
    }
  });
  els.rows.addEventListener('click', function (e) {
    var x = e.target.closest('[data-x]');
    if (!x) return;
    var i = +x.closest('.ses-row').getAttribute('data-i');
    S.items.splice(i, 1);
    fixSum();
    drawRows();
    render(); persist();
  });

  els.total.addEventListener('input', function () {
    var v = parseFloat(String(els.total.value).replace(',', '.'));
    if (!(v > 0 && v <= 60)) return;
    S.total = v;
    changed(els.total);
  });
  $('ses-equal').addEventListener('click', function () {
    S.items.forEach(function (x) { x.pct = 1; });
    fixSum();
    changed();
  });

  function addItem(it) {
    if (S.items.length >= MAX) return;
    var share = Math.round(100 / (S.items.length + 1));
    S.items.forEach(function (x) { x.pct = x.pct * (100 - share) / 100; });
    it.pct = share;
    S.items.push(it);
    fixSum();
    drawRows();
    render(); persist();
  }

  /* ------------------------------------------------------------------ */
  /* Pretraga okusa                                                      */
  /* ------------------------------------------------------------------ */

  var hits = [], active = -1;
  var index = V.flavors().map(function (f) { return { f: f, k: norm(f.brand + ' ' + f.name) }; });

  function search(q) {
    var n = norm(q).trim();
    if (!n) return [];
    var words = n.split(/\s+/);
    var taken = S.items.map(function (x) { return x.id; });
    return index.filter(function (x) { return taken.indexOf(x.f.id) === -1 && words.every(function (w) { return x.k.indexOf(w) !== -1; }); })
      .sort(function (a, b) { return (b.k.indexOf(norm(a.f.name)) === -1) - (a.k.indexOf(norm(b.f.name)) === -1) || a.f.name.localeCompare(b.f.name); })
      .slice(0, 8).map(function (x) { return x.f; });
  }

  function showResults() {
    var q = els.q.value;
    hits = search(q);
    active = hits.length ? 0 : -1;
    if (!q.trim()) { els.results.hidden = true; els.q.setAttribute('aria-expanded', 'false'); return; }
    els.results.innerHTML = hits.length ? hits.map(function (f, i) {
      return '<li role="option" id="ses-opt-' + i + '" aria-selected="' + (i === active) + '" data-id="' + V.esc(f.id) + '" style="--fc:' + flavorColor(f, usedColors()) + '"><span class="ses-results__dot"></span><small>' + V.esc(f.brand) + '</small><b>' + V.esc(f.name) + '</b></li>';
    }).join('') : '<li class="ses-results__none">' + V.esc(t('session.noResults')) + '</li>';
    els.results.hidden = false;
    els.q.setAttribute('aria-expanded', 'true');
    if (active >= 0) els.q.setAttribute('aria-activedescendant', 'ses-opt-' + active); else els.q.removeAttribute('aria-activedescendant');
  }

  function pick(id) {
    var f = V.flavorById(id);
    if (!f) return;
    addItem(itemFromFlavor(f));
    els.q.value = '';
    showResults();
    if (S.items.length < MAX) els.q.focus();
  }

  els.q.addEventListener('input', showResults);
  els.q.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!hits.length) return;
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length;
      Array.prototype.forEach.call(els.results.children, function (li, i) { li.setAttribute('aria-selected', String(i === active)); });
      els.q.setAttribute('aria-activedescendant', 'ses-opt-' + active);
    } else if (e.key === 'Enter') {
      if (active >= 0 && hits[active]) { e.preventDefault(); pick(hits[active].id); }
    } else if (e.key === 'Escape') {
      els.q.value = ''; showResults();
    }
  });
  els.results.addEventListener('mousedown', function (e) { e.preventDefault(); });
  els.results.addEventListener('click', function (e) {
    var li = e.target.closest('[data-id]');
    if (li) pick(li.getAttribute('data-id'));
  });
  els.q.addEventListener('blur', function () { setTimeout(function () { els.results.hidden = true; els.q.setAttribute('aria-expanded', 'false'); }, 150); });

  $('ses-cadd').addEventListener('click', function () {
    var b = $('ses-cb'), n = $('ses-cn');
    var name = n.value.trim();
    if (!name) { n.focus(); return; }
    addItem(itemCustom(b.value.trim(), name, 0, S.items.length));
    b.value = ''; n.value = '';
  });
  $('ses-cn').addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); $('ses-cadd').click(); } });

  /* ------------------------------------------------------------------ */
  /* Fotografija                                                         */
  /* ------------------------------------------------------------------ */

  function loadPhoto(file) {
    if (!file || !/^image\//.test(file.type)) return;
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      // velike fotografije smanji (do 2400 px), da crtanje bude brzo i na slabijem telefonu
      var max = 2400, k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      var c = document.createElement('canvas');
      c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      S.photo = c; S.fx = 0.5; S.fy = 0.5; S.zoom = 1; els.zoom.value = 100;
      els.photoX.hidden = false; els.zoomWrap.hidden = false;
      els.pickTxt.textContent = t('session.changePhoto');
      render();
    };
    img.onerror = function () { URL.revokeObjectURL(url); status(t('session.failed')); };
    img.src = url;
  }
  els.file.addEventListener('change', function () { loadPhoto(els.file.files[0]); els.file.value = ''; });
  els.cam.addEventListener('change', function () { loadPhoto(els.cam.files[0]); els.cam.value = ''; });
  els.photoX.addEventListener('click', function () {
    S.photo = null; els.photoX.hidden = true; els.zoomWrap.hidden = true;
    els.pickTxt.textContent = t('session.pickPhoto');
    render();
  });
  els.zoom.addEventListener('input', function () { S.zoom = +els.zoom.value / 100; render(); });
  // fotografija se može i "baciti" na pregled
  els.stage.addEventListener('dragover', function (e) { e.preventDefault(); });
  els.stage.addEventListener('drop', function (e) { e.preventDefault(); if (e.dataTransfer && e.dataTransfer.files[0]) loadPhoto(e.dataTransfer.files[0]); });

  /* ------------------------------------------------------------------ */
  /* Povlačenje po pregledu                                              */
  /* ------------------------------------------------------------------ */

  var drag = null, dragged = false;
  function toImg(e) {
    var r = els.canvas.getBoundingClientRect();
    var sz = SIZES[S.format];
    return { x: (e.clientX - r.left) / r.width * sz[0], y: (e.clientY - r.top) / r.height * sz[1], kx: sz[0] / r.width, ky: sz[1] / r.height };
  }
  // na dodir se po slici povlači samo u načinu "Pomjeri", inače prst skrola stranicu
  var moveMode = false, moveBtn = $('ses-move');
  function setMove(on) {
    moveMode = on;
    els.stage.classList.toggle('is-move', on);
    moveBtn.setAttribute('aria-pressed', String(on));
    moveBtn.querySelector('span').textContent = t(on ? 'session.moveDone' : 'session.move');
  }
  moveBtn.addEventListener('click', function () { setMove(!moveMode); });
  els.canvas.addEventListener('pointerdown', function (e) {
    if (!lastL) return;
    if (e.pointerType !== 'mouse' && !moveMode) return;
    var p = toImg(e), L = lastL, pad = 30 * L.u;
    var onGroup = S.items.length && p.x >= L.x - pad && p.x <= L.x + L.w + pad && p.y >= L.y - pad && p.y <= L.y + L.h + pad;
    if (!onGroup && !S.photo) return;
    dragged = false;
    drag = { mode: onGroup ? 'group' : 'photo', sx: p.x, sy: p.y, gx: L.x, gy: L.y, fx: S.fx, fy: S.fy };
    els.canvas.setPointerCapture(e.pointerId);
    els.stage.classList.add('is-drag');
    e.preventDefault();
  });
  els.canvas.addEventListener('pointermove', function (e) {
    if (!drag) {
      if (lastL && e.pointerType === 'mouse') {
        var q = toImg(e), L0 = lastL;
        var over = S.items.length && q.x >= L0.x && q.x <= L0.x + L0.w && q.y >= L0.y && q.y <= L0.y + L0.h;
        els.canvas.style.cursor = over ? 'move' : (S.photo ? 'grab' : 'default');
      }
      return;
    }
    var p = toImg(e), sz = SIZES[S.format];
    var dx = p.x - drag.sx, dy = p.y - drag.sy;
    if (Math.abs(dx) + Math.abs(dy) > 6) dragged = true;
    if (drag.mode === 'group') {
      S.pos = { x: clamp(drag.gx + dx, 0, sz[0] - lastL.w) / sz[0], y: clamp(drag.gy + dy, 0, sz[1] - lastL.h) / sz[1] };
    } else {
      var img = S.photo, sc = Math.max(sz[0] / img.width, sz[1] / img.height) * S.zoom;
      var ex = img.width * sc - sz[0], ey = img.height * sc - sz[1];
      if (ex > 1) S.fx = clamp(drag.fx - dx / ex, 0, 1);
      if (ey > 1) S.fy = clamp(drag.fy - dy / ey, 0, 1);
    }
    render();
  });
  function endDrag() { drag = null; els.stage.classList.remove('is-drag'); }
  els.canvas.addEventListener('pointerup', endDrag);
  els.canvas.addEventListener('pointercancel', endDrag);
  /* Pregled preko cijelog ekrana: dodir na sliku */
  var lb = $('ses-lb'), lbImg = $('ses-lb-img'), lbUrl = null, lbOpen = false;
  document.body.appendChild(lb); // iznad zaglavlja i svega ostalog
  function openView() {
    if (lbOpen) return;
    lbOpen = true;
    lb.hidden = false;
    document.documentElement.classList.add('ses-lock');
    lbImg.removeAttribute('src');
    makeBlob().then(function (b) { if (!lbOpen) return; if (lbUrl) URL.revokeObjectURL(lbUrl); lbUrl = URL.createObjectURL(b); lbImg.src = lbUrl; });
    try { history.pushState({ sesView: 1 }, ''); } catch (e) {}
    $('ses-lb-x').focus();
  }
  function closeView(fromPop) {
    if (!lbOpen) return;
    lbOpen = false;
    lb.hidden = true;
    document.documentElement.classList.remove('ses-lock');
    if (!fromPop && history.state && history.state.sesView) history.back();
    $('ses-expand').focus({ preventScroll: true });
  }
  window.addEventListener('popstate', function () { closeView(true); });
  els.canvas.addEventListener('click', function () { if (moveMode || dragged) { dragged = false; return; } openView(); });
  $('ses-expand').addEventListener('click', openView);
  $('ses-lb-x').addEventListener('click', function () { closeView(); });
  $('ses-lb-close').addEventListener('click', function () { closeView(); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeView(); });
  document.addEventListener('keydown', function (e) { if (lbOpen && e.key === 'Escape') closeView(); });
  $('ses-lb-save').addEventListener('click', function () { els.save.click(); });
  $('ses-lb-share').addEventListener('click', function () { els.share.click(); });

  /* Kartice na mobitelu: Fotografija, Miks, Izgled */
  var tabs = root.querySelectorAll('.ses-tab'), steps = root.querySelectorAll('.ses-step');
  function setTab(i, scroll) {
    Array.prototype.forEach.call(tabs, function (b, k) { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; });
    Array.prototype.forEach.call(steps, function (st, k) { st.classList.toggle('is-active', k === i); });
    if (!scroll) return;
    // panel odmah ispod slike koja stoji gore
    var sticky = $('ses-sticky'), top = sticky.getBoundingClientRect().bottom, pt = steps[i].getBoundingClientRect().top;
    if (getComputedStyle(sticky).position === 'sticky' && Math.abs(pt - top - 12) > 4) window.scrollBy({ top: pt - top - 12, behavior: 'smooth' });
  }
  Array.prototype.forEach.call(tabs, function (b, k) {
    b.addEventListener('click', function () { setTab(k, true); });
    b.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = (k + d + tabs.length) % tabs.length; setTab(n, true); tabs[n].focus();
    });
  });
  setTab(0, false);

  $('ses-reset').addEventListener('click', function () { S.pos = null; S.fx = 0.5; S.fy = 0.5; S.zoom = 1; els.zoom.value = 100; render(); });

  /* ------------------------------------------------------------------ */
  /* Izgled                                                              */
  /* ------------------------------------------------------------------ */

  Array.prototype.forEach.call(root.querySelectorAll('[data-seg]'), function (g) {
    var key = g.getAttribute('data-seg');
    function mark() { Array.prototype.forEach.call(g.querySelectorAll('[data-v]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === S[key])); }); }
    g.addEventListener('click', function (e) {
      var b = e.target.closest('[data-v]');
      if (!b) return;
      S[key] = b.getAttribute('data-v');
      if (key === 'format') S.pos = null;
      mark(); render(); persist();
    });
    mark();
  });
  [['head', 'heading'], ['coals', 'coals'], ['bowl', 'bowl']].forEach(function (p) {
    els[p[0]].value = S[p[1]] || '';
    els[p[0]].addEventListener('input', function () { S[p[1]] = els[p[0]].value; render(); persist(); });
  });
  [['showBrand', 'showBrand'], ['showQr', 'showQr']].forEach(function (p) {
    els[p[0]].addEventListener('change', function () { S[p[1]] = els[p[0]].checked; render(); persist(); });
  });

  /* ------------------------------------------------------------------ */
  /* Čuvanje i dijeljenje                                                */
  /* ------------------------------------------------------------------ */

  function status(s) {
    els.status.textContent = s;
    if (s) setTimeout(function () { if (els.status.textContent === s) els.status.textContent = ''; }, 3500);
  }

  function fileName() { return 'myshishapedia-session-' + S.format + (S.photo ? '.jpg' : '.png'); }

  function makeBlob() {
    var sz = SIZES[S.format];
    return fontsReady().then(function () {
      var c = paint(document.createElement('canvas'), sz[0], sz[1], 1);
      return new Promise(function (res, rej) {
        c.toBlob(function (b) { if (b) res(b); else rej(new Error('blob')); }, S.photo ? 'image/jpeg' : 'image/png', 0.92);
      });
    }).then(function (b) { render(); return b; });
  }

  els.save.addEventListener('click', function () {
    if (!S.items.length) { status(t('session.empty')); return; }
    status(t('session.making'));
    makeBlob().then(function (blob) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName();
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000);
      status('');
    }).catch(function () { status(t('session.failed')); });
  });

  var canFiles = false;
  try { canFiles = !!(navigator.canShare && navigator.canShare({ files: [new File(['x'], 'x.png', { type: 'image/png' })] })); } catch (e) { canFiles = false; }
  els.share.hidden = !canFiles;
  $('ses-lb-share').hidden = !canFiles;
  els.share.addEventListener('click', function () {
    if (!S.items.length) { status(t('session.empty')); return; }
    status(t('session.making'));
    makeBlob().then(function (blob) {
      status('');
      var file = new File([blob], fileName(), { type: blob.type });
      return navigator.share({ files: [file], title: t('session.title'), text: mixUrl(true) });
    }).catch(function (err) { if (!err || err.name !== 'AbortError') status(t('session.failed')); });
  });

  els.copy.addEventListener('click', function () {
    var url = mixUrl(true);
    function ok() { status(t('session.copied')); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, function () { status(url); });
    else status(url);
  });

  /* ------------------------------------------------------------------ */
  /* Start                                                               */
  /* ------------------------------------------------------------------ */

  load();
  els.total.value = S.total;
  els.showBrand.checked = S.showBrand;
  els.showQr.checked = S.showQr;
  Array.prototype.forEach.call(root.querySelectorAll('[data-seg]'), function (g) {
    var key = g.getAttribute('data-seg');
    Array.prototype.forEach.call(g.querySelectorAll('[data-v]'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-v') === S[key])); });
  });
  drawRows();
  render();
  window.addEventListener('resize', render);
  MSP.Session = { state: S, paint: paint, mixUrl: mixUrl };
})();
