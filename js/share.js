/*
 * MyShishapedia - kartica za dijeljenje (Instagram story i kvadrat).
 *
 * Dugme [data-share] na stranici okusa, recepta, u mikseru i na rezultatu kviza.
 * Slika se crta u browseru (canvas), bez servera: paleta okusa, iste SVG ilustracije,
 * statičan dim, profil (trake), logo i adresa stranice. Story 1080x1920 poštuje sigurne
 * zone (ništa važno u gornjih i donjih ~250 px); kvadrat 1080x1080 je dodatni izbor.
 * Na mobitelu: Web Share API sa fajlom (ako postoji), inače preuzimanje + "Kopiraj link".
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var V = MSP.V;
  var t = MSP.t;
  var L = MSP.L;
  var C = MSP.color;
  var FX = MSP.Effects;

  var SIZES = { story: [1080, 1920], square: [1080, 1080] };

  /* ------------------------------------------------------------------ */
  /* Podaci za karticu                                                   */
  /* ------------------------------------------------------------------ */

  function canonical() {
    var l = document.querySelector('link[rel=canonical]');
    return l ? l.href : location.origin + location.pathname;
  }

  function prettyUrl(u) {
    return String(u).replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/\/\?/, '?');
  }

  function flavorCard(f, kicker, pct) {
    var th = V.themeFor(f);
    return {
      name: f.name,
      brand: f.brand,
      kicker: kicker || '',
      line: pct != null ? t('share.match', { n: pct }) : (f.ingredients || []).map(function (i) { return L(i.name); }).join(' · '),
      theme: th,
      ingredients: V.byIntensity(f).slice(0, 3),
      profile: f.profile,
      url: V.flavorUrl(f),
      file: f.id
    };
  }

  function mixCard(a, b, pctA, name, url, file) {
    var r = pctA / 100;
    var th = V.computeTheme(V.blendPalette(a, b, r), false);
    var pseudo = { id: 'share-' + a.id + '-' + b.id, parts: [{ flavor: a.id, pct: pctA }, { flavor: b.id, pct: 100 - pctA }] };
    return {
      name: name || (a.name + ' × ' + b.name),
      brand: '',
      kicker: '',
      line: a.name + ' ' + pctA + '% + ' + b.name + ' ' + (100 - pctA) + '%',
      theme: th,
      bowl: V.bowlTop(pseudo),
      sectors: V.sectorColors(pseudo),
      parts: [[a, pctA], [b, 100 - pctA]],
      profile: V.blendedProfile(a, b, r),
      url: url,
      file: file
    };
  }

  function dataFor(btn) {
    var kind = btn.getAttribute('data-share');
    var id = btn.getAttribute('data-id');
    if (kind === 'flavor') {
      var f = V.flavorById(id);
      return f && Object.assign(flavorCard(f), { url: canonical() });
    }
    if (kind === 'quiz') {
      var q = V.flavorById(id);
      // puna adresa sa pravim domenom (iz canonical linka), i kad se testira lokalno
      var origin = canonical().replace(/^(https?:\/\/[^/]+).*$/, '$1');
      return q && Object.assign(flavorCard(q, t('share.myFlavor'), +btn.getAttribute('data-pct')), { url: origin + V.flavorUrl(q) });
    }
    if (kind === 'recipe') {
      var m = V.recipeById(id);
      if (!m) return null;
      var fl = V.recipeFlavors(m);
      var d = mixCard(fl[0], fl[1], m.parts[0].pct, L(m.name), canonical(), m.id);
      d.kicker = t('mixes.eyebrow');
      return d;
    }
    if (kind === 'mixer') {
      var p = new URLSearchParams(location.search);
      var def = V.defaultMix();
      var a = V.flavorById(p.get('a') || '') || def.a;
      var b = V.flavorById(p.get('b') || '') || def.b;
      var r = parseInt(p.get('r'), 10);
      if (!(r >= 20 && r <= 80)) r = def.ratio;
      var url = canonical() + '?a=' + a.id + '&b=' + b.id + '&r=' + r;
      var dm = mixCard(a, b, r, null, url, 'mix-' + a.id + '-' + b.id);
      dm.kicker = t('share.mix');
      return dm;
    }
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* Crtanje                                                             */
  /* ------------------------------------------------------------------ */

  function svgImage(svg, size) {
    var s = svg.replace('<svg ', '<svg width="' + size + '" height="' + size + '" ');
    if (s.indexOf('xmlns=') === -1) s = s.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
    });
  }

  function fontsReady() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    return Promise.all([
      document.fonts.load('800 120px Syne'),
      document.fonts.load('700 40px Manrope'),
      document.fonts.load('400 34px Manrope')
    ]).then(function () { return document.fonts.ready; }, function () {});
  }

  function rgba(hex, a) { return C.rgba(hex, a); }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function fitFont(ctx, text, maxW, size, weight, family, min) {
    var s = size;
    do {
      ctx.font = weight + ' ' + s + 'px ' + family;
      if (ctx.measureText(text).width <= maxW) break;
      s -= 4;
    } while (s > (min || 40));
    return s;
  }

  /** Statičan dim: meki, zamućeni pramenovi koji se dižu iz sredine. */
  function drawSmoke(ctx, W, H, colors, fromY, toY) {
    ctx.save();
    ctx.filter = 'blur(38px)';
    var n = 26;
    for (var i = 0; i < n; i++) {
      var k = i / n;
      var y = fromY - (fromY - toY) * k;
      var x = W / 2 + Math.sin(k * 7 + i * 0.6) * W * (0.08 + k * 0.22);
      var r = 60 + k * 170;
      var g = ctx.createRadialGradient(x, y, 0, x, y, r);
      var c = colors[i % colors.length];
      g.addColorStop(0, rgba(c, 0.2 * (1 - k * 0.6)));
      g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawLogo(ctx, cx, y, size, th) {
    ctx.textBaseline = 'alphabetic';
    var parts = [['my', '400', th.text], ['shisha', '800', th.accentInk], ['pedia', '400', th.text]];
    var widths = parts.map(function (p) { ctx.font = p[1] + ' ' + size + 'px Syne'; return ctx.measureText(p[0]).width; });
    var total = widths.reduce(function (s, w) { return s + w; }, 0);
    var x = cx - total / 2;
    parts.forEach(function (p, i) {
      ctx.font = p[1] + ' ' + size + 'px Syne';
      ctx.fillStyle = p[2];
      ctx.textAlign = 'left';
      ctx.fillText(p[0], x, y);
      x += widths[i];
    });
  }

  function drawBars(ctx, x, y, w, profile, th, rowH) {
    var keys = V.PROFILE_KEYS;
    ctx.textBaseline = 'middle';
    keys.forEach(function (k, i) {
      var cy = y + i * rowH;
      var v = Math.max(0, Math.min(10, profile[k] || 0));
      ctx.font = '700 ' + Math.round(rowH * 0.42) + 'px Manrope';
      ctx.fillStyle = th.muted;
      ctx.textAlign = 'left';
      ctx.fillText(t('profile.' + k), x, cy);
      ctx.textAlign = 'right';
      ctx.fillStyle = th.text;
      ctx.fillText(String(Math.round(v * 10) / 10).replace('.', MSP.lang === 'bs' ? ',' : '.'), x + w, cy);
      var bx = x + w * 0.42;
      var bw = w * 0.5;
      var bh = Math.round(rowH * 0.26);
      roundRect(ctx, bx, cy - bh / 2, bw, bh, bh / 2);
      ctx.fillStyle = rgba(th.text, 0.14);
      ctx.fill();
      if (v > 0) {
        roundRect(ctx, bx, cy - bh / 2, Math.max(bh, bw * v / 10), bh, bh / 2);
        ctx.fillStyle = th.barA;
        ctx.fill();
      }
    });
  }

  function drawPill(ctx, cx, y, text, th, size) {
    ctx.font = '700 ' + size + 'px Manrope';
    var w = ctx.measureText(text).width + size * 1.6;
    var h = size * 2;
    roundRect(ctx, cx - w / 2, y - h / 2, w, h, h / 2);
    ctx.fillStyle = rgba(th.text, 0.12);
    ctx.fill();
    ctx.fillStyle = th.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, y + 1);
  }

  function drawArt(ctx, d, images, box) {
    // box = [x, y, size]
    var x = box[0], y = box[1], s = box[2];
    if (d.bowl) {
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 50;
      ctx.shadowOffsetY = 24;
      ctx.drawImage(images[0], x, y, s, s);
      ctx.restore();
      return;
    }
    var layouts = {
      1: [[0.5, 0.5, 0.78, -8]],
      2: [[0.36, 0.56, 0.6, -12], [0.66, 0.4, 0.52, 14]],
      3: [[0.33, 0.58, 0.54, -12], [0.66, 0.36, 0.46, 14], [0.7, 0.72, 0.36, -18]]
    };
    var lay = layouts[images.length] || layouts[3];
    images.forEach(function (img, i) {
      var p = lay[i];
      var sz = s * p[2];
      ctx.save();
      ctx.translate(x + s * p[0], y + s * p[1]);
      ctx.rotate(p[3] * Math.PI / 180);
      ctx.shadowColor = 'rgba(0,0,0,0.28)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;
      ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz);
      ctx.restore();
    });
  }

  function draw(d, format) {
    var W = SIZES[format][0];
    var H = SIZES[format][1];
    var th = d.theme;
    var canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');
    var svgs = d.bowl ? [d.bowl] : d.ingredients.map(function (i) { return MSP.illustrate(i.illustration, { color: i.color }); });

    return fontsReady().then(function () {
      return Promise.all(svgs.map(function (s) { return svgImage(s, 600); }));
    }).then(function (images) {
      // pozadina
      ctx.fillStyle = th.bg;
      ctx.fillRect(0, 0, W, H);
      var g = ctx.createRadialGradient(W * 0.75, H * 0.2, 0, W * 0.75, H * 0.2, W * 0.9);
      g.addColorStop(0, rgba(th.surface2, 0.95));
      g.addColorStop(1, rgba(th.surface2, 0));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
      var g2 = ctx.createRadialGradient(W * 0.2, H * 0.95, 0, W * 0.2, H * 0.95, W);
      g2.addColorStop(0, rgba(th.primary, 0.35));
      g2.addColorStop(1, rgba(th.primary, 0));
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);
      // topli sjaj žara iza ilustracije
      var story = format === 'story';
      var artY = story ? 450 : 150;
      var artS = story ? 520 : 380;
      var glow = ctx.createRadialGradient(W / 2, artY + artS / 2, 0, W / 2, artY + artS / 2, artS * 0.7);
      glow.addColorStop(0, 'rgba(255,150,60,0.28)');
      glow.addColorStop(1, 'rgba(255,150,60,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
      drawSmoke(ctx, W, H, th.smoke, artY + artS * 0.55, story ? 160 : 40);

      var pad = story ? 110 : 80;
      var cx = W / 2;
      drawLogo(ctx, cx, story ? 330 : 96, story ? 48 : 38, th);
      if (d.kicker) {
        ctx.font = '800 ' + (story ? 30 : 24) + 'px Manrope';
        ctx.fillStyle = th.accentInk;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(d.kicker.toUpperCase().split('').join(String.fromCharCode(8202)), cx, story ? 420 : 138);
      }
      drawArt(ctx, d, images, [cx - artS / 2, artY, artS]);

      var y = artY + artS + (story ? 70 : 50);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      if (d.brand) {
        ctx.font = '700 ' + (story ? 30 : 24) + 'px Manrope';
        ctx.fillStyle = th.muted;
        ctx.fillText(d.brand.toUpperCase().split('').join(String.fromCharCode(8202)), cx, y);
      } else {
        y -= story ? 30 : 20;
      }
      var titleSize = fitFont(ctx, d.name, W - pad * 2, story ? 150 : 104, '800', 'Syne', 56);
      y += titleSize * (story ? 0.95 : 0.9);
      ctx.fillStyle = th.text;
      ctx.fillText(d.name, cx, y);
      y += story ? 66 : 48;
      var lineSize = fitFont(ctx, d.line, W - pad * 2, story ? 38 : 30, '600', 'Manrope', 22);
      ctx.fillStyle = d.kicker === t('share.myFlavor') ? th.accentInk : th.muted;
      ctx.font = (d.kicker === t('share.myFlavor') ? '800 ' : '600 ') + lineSize + 'px Manrope';
      ctx.fillText(d.line, cx, y);

      if (d.profile) {
        // story: trake uvijek u istom pojasu (1320-1560), iznad donje sigurne zone
        var rowH = story ? 58 : 40;
        var bw = story ? W - pad * 2 : W - pad * 2 - 120;
        var barsY = story ? Math.max(y + 70, 1320) : y + 50;
        drawBars(ctx, cx - bw / 2, barsY, bw, d.profile, th, rowH);
      }
      drawPill(ctx, cx, story ? 1640 : H - 64, prettyUrl(d.url), th, story ? 28 : 22);
      return canvas;
    });
  }

  /* ------------------------------------------------------------------ */
  /* Modal                                                               */
  /* ------------------------------------------------------------------ */

  var modal = null;
  var current = null;
  var opener = null;
  var format = 'story';
  var blobUrl = '';
  var lastBlob = null;

  function build() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'smodal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'smodal-title');
    modal.hidden = true;
    modal.innerHTML =
      '<div class="smodal__panel">' +
        '<div class="smodal__head"><h2 class="smodal__title" id="smodal-title">' + V.esc(t('share.title')) + '</h2>' +
          '<button type="button" class="smodal__close" aria-label="' + V.esc(t('share.close')) + '">' + V.icon('close') + '</button></div>' +
        '<div class="segctl smodal__formats" role="group" aria-label="' + V.esc(t('share.formatLabel')) + '">' +
          '<button type="button" class="seg-btn" data-format="story" aria-pressed="true">' + V.esc(t('share.story')) + '</button>' +
          '<button type="button" class="seg-btn" data-format="square" aria-pressed="false">' + V.esc(t('share.square')) + '</button>' +
        '</div>' +
        '<div class="smodal__stage"><img class="smodal__img" alt="" hidden><p class="smodal__making">' + V.esc(t('share.making')) + '</p></div>' +
        '<div class="smodal__actions">' +
          '<button type="button" class="btn btn--primary" data-act="share" hidden>' + V.esc(t('share.shareFile')) + '</button>' +
          '<a class="btn btn--primary" data-act="download" download>' + V.esc(t('share.download')) + '</a>' +
          '<button type="button" class="btn btn--ghost" data-act="copy">' + V.icon('link') + '<span>' + V.esc(t('share.copyLink')) + '</span></button>' +
        '</div>' +
        '<p class="smodal__status" role="status" aria-live="polite"></p>' +
      '</div>';
    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('.smodal__close')) { close(); return; }
      var f = e.target.closest('[data-format]');
      if (f) {
        format = f.getAttribute('data-format');
        modal.querySelectorAll('[data-format]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === f)); });
        render();
        return;
      }
      var act = e.target.closest('[data-act]');
      if (!act) return;
      var a = act.getAttribute('data-act');
      if (a === 'share') shareFile();
      else if (a === 'copy') copyLink();
    });
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab') return;
      var items = Array.prototype.filter.call(modal.querySelectorAll('button, a[href]'), function (x) { return !x.hidden && x.offsetParent; });
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function statusText(s) {
    var el = modal.querySelector('.smodal__status');
    el.textContent = s;
    if (s) setTimeout(function () { if (el.textContent === s) el.textContent = ''; }, 3500);
  }

  function render() {
    var img = modal.querySelector('.smodal__img');
    var making = modal.querySelector('.smodal__making');
    var dl = modal.querySelector('[data-act=download]');
    var shareBtn = modal.querySelector('[data-act=share]');
    img.hidden = true;
    making.hidden = false;
    making.textContent = t('share.making');
    modal.querySelector('.smodal__stage').setAttribute('data-format', format);
    draw(current, format).then(function (canvas) {
      canvas.toBlob(function (blob) {
        if (!blob) { making.textContent = t('share.failed'); return; }
        lastBlob = blob;
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        blobUrl = URL.createObjectURL(blob);
        img.src = blobUrl;
        img.alt = t('share.preview', { name: current.name });
        img.hidden = false;
        making.hidden = true;
        dl.href = blobUrl;
        dl.setAttribute('download', fileName());
        var file = new File([blob], fileName(), { type: 'image/png' });
        shareBtn.hidden = !(navigator.canShare && navigator.canShare({ files: [file] }));
      }, 'image/png');
    }).catch(function () {
      making.textContent = t('share.failed');
    });
  }

  function fileName() { return 'myshishapedia-' + (current.file || 'card') + '-' + format + '.png'; }

  function shareFile() {
    if (!lastBlob) return;
    var file = new File([lastBlob], fileName(), { type: 'image/png' });
    navigator.share({ files: [file], title: current.name, text: current.url }).catch(function () {});
  }

  function copyLink() {
    var url = current.url;
    function ok() { statusText(t('share.copied')); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(ok, function () { statusText(url); });
    else statusText(url);
  }

  function open(btn) {
    var d = dataFor(btn);
    if (!d) return;
    build();
    current = d;
    opener = btn;
    format = 'story';
    modal.querySelectorAll('[data-format]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-format') === 'story')); });
    modal.hidden = false;
    requestAnimationFrame(function () { modal.classList.add('is-open'); });
    document.body.classList.add('is-locked');
    var app = document.getElementById('app');
    if (app) app.inert = true;
    modal.querySelector('.smodal__close').focus();
    render();
    var Field = FX && FX.Field;
    if (Field && Field.ready && !FX.reducedMotion()) {
      var r = btn.getBoundingClientRect();
      Field.puff(r.left + r.width / 2, r.top, { count: 10, colors: d.theme.smoke, alpha: 0.25, r1: [80, 180], life: [1.4, 2.4], speed: [30, 90], force: true });
    }
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.classList.remove('is-open');
    modal.hidden = true;
    var app = document.getElementById('app');
    if (app) app.inert = false;
    document.body.classList.remove('is-locked');
    if (opener) opener.focus();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-share]');
    if (!b) return;
    e.preventDefault();
    open(b);
  });

  MSP.Share = { draw: draw, dataFor: dataFor };
})();
