/*
 * MyShishapedia - uvodna animacija na početnoj (canvas).
 *
 *   1. glava punjena duhanom (prava fotografija) padne iz gornjeg lijevog ugla i prevrne se
 *   2. komadići duhana se razlete i slože u natpis MYSHISHAPEDIA
 *   3. natpis se raspadne, duhan uleti u glavu nargile na fotografiji, ugalj zasija
 *   4. dim ispuni ekran, a iz dima izađe nargila i naslov stranice
 * Poslije uvoda iz glave nargile stalno lagano ide dim koji prati miš.
 *
 * Naslov i pretraga su u HTML-u od početka (Google, LCP); uvod ih samo otkrije.
 * Prvi put ide cijela priča (oko 6 s), poslije samo kratki dim (oko 1,5 s). Dugme "Preskoči",
 * Escape ili klik završe uvod odmah. Uz "smanji kretanje" nema uvoda ni dima.
 * Ovisi o: strings.js (MSP.t). Slike: /hero/bowl.webp, /hero/tobacco.webp, fotografija u .hero__photo.
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var doc = document.documentElement;
  var photo = document.querySelector('.hero__photo');
  if (!photo) return;
  var img = photo.querySelector('img');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var KEY = 'msp-intro';

  function seen() { try { return !!localStorage.getItem(KEY); } catch (e) { return true; } }
  function markSeen() { try { localStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ } }
  function load(src) { return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = rej; i.src = src; }); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeIn(t) { return t * t * t; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /** Tačka glave nargile na fotografiji (data-bowl = "x,y" kao dio slike), u pikselima ekrana. */
  function bowlPoint() {
    var r = img.getBoundingClientRect();
    var p = (photo.getAttribute('data-bowl') || '0.5,0.4').split(',');
    // slika je object-fit: cover, pa se računa koliko je odsječeno
    var iw = img.naturalWidth || 960, ih = img.naturalHeight || 1200;
    var s = Math.max(r.width / iw, r.height / ih);
    var ox = (r.width - iw * s) / 2, oy = (r.height - ih * s) / 2;
    return { x: r.left + ox + iw * s * +p[0], y: r.top + oy + ih * s * +p[1] };
  }

  /* ------------------------------------------------------------------ */
  /* Dim (dijele ga uvod i stalni dim nad nargilom)                      */
  /* ------------------------------------------------------------------ */

  var puffSprite = null;
  function makePuff() {
    var c = document.createElement('canvas'), n = 128;
    c.width = c.height = n;
    var x = c.getContext('2d');
    var g = x.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
    g.addColorStop(0, 'rgba(244,235,223,0.55)');
    g.addColorStop(0.35, 'rgba(236,226,214,0.28)');
    g.addColorStop(0.7, 'rgba(230,220,208,0.08)');
    g.addColorStop(1, 'rgba(230,220,208,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, n, n);
    // malo "pamuka" da dim ne bude savršen krug
    for (var i = 0; i < 26; i++) {
      var a = Math.random() * Math.PI * 2, d = rnd(8, 34), r = rnd(10, 28);
      var gx = n / 2 + Math.cos(a) * d, gy = n / 2 + Math.sin(a) * d;
      var g2 = x.createRadialGradient(gx, gy, 0, gx, gy, r);
      g2.addColorStop(0, 'rgba(244,235,223,0.1)');
      g2.addColorStop(1, 'rgba(244,235,223,0)');
      x.fillStyle = g2;
      x.beginPath(); x.arc(gx, gy, r, 0, Math.PI * 2); x.fill();
    }
    return c;
  }
  function drawPuffs(ctx, list, dt) {
    for (var i = list.length - 1; i >= 0; i--) {
      var p = list[i];
      p.age += dt;
      if (p.age >= p.life) { list.splice(i, 1); continue; }
      var k = p.age / p.life;
      p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.985; p.vy *= 0.985; p.vy -= p.rise * dt;
      p.rot += p.spin * dt;
      var size = p.r0 + (p.r1 - p.r0) * easeOut(k);
      var a = p.alpha * (k < 0.15 ? k / 0.15 : 1 - (k - 0.15) / 0.85);
      ctx.save();
      ctx.globalAlpha = Math.max(0, a);
      ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.drawImage(puffSprite, -size / 2, -size / 2, size, size);
      ctx.restore();
    }
  }
  function puff(list, x, y, o) {
    o = o || {};
    list.push({
      x: x, y: y, vx: o.vx != null ? o.vx : rnd(-30, 30), vy: o.vy != null ? o.vy : rnd(-60, -20), rise: o.rise || 18,
      r0: o.r0 || rnd(30, 60), r1: o.r1 || rnd(160, 320), rot: rnd(0, 6.3), spin: rnd(-0.4, 0.4),
      age: 0, life: o.life || rnd(1.6, 2.8), alpha: o.alpha || rnd(0.35, 0.6)
    });
  }

  /* ------------------------------------------------------------------ */
  /* Stalni dim nad nargilom (prati miš)                                 */
  /* ------------------------------------------------------------------ */

  function idleSmoke() {
    if (reduce) return;
    var cv = document.createElement('canvas');
    cv.className = 'hero__smoke';
    cv.setAttribute('aria-hidden', 'true');
    photo.appendChild(cv);
    var ctx = cv.getContext('2d'), list = [], last = 0, acc = 0, visible = true, wind = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
    function size() { var r = photo.getBoundingClientRect(); cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size();
    window.addEventListener('resize', size);
    window.addEventListener('pointermove', function (e) { wind = clamp((e.clientX / window.innerWidth - 0.5) * 120, -60, 60); }, { passive: true });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) requestAnimationFrame(tick); }).observe(photo);
    function tick(ts) {
      if (!visible) { last = 0; return; }
      var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts;
      var r = photo.getBoundingClientRect(), b = bowlPoint();
      acc += dt;
      while (acc > 0.16) { acc -= 0.16; puff(list, b.x - r.left + rnd(-4, 4), b.y - r.top - 6, { vx: wind * 0.4 + rnd(-8, 8), vy: rnd(-55, -35), r0: rnd(10, 18), r1: rnd(90, 170), life: rnd(2.4, 3.6), alpha: rnd(0.16, 0.26), rise: 10 }); }
      list.forEach(function (p) { p.vx += wind * 0.12 * dt; });
      ctx.clearRect(0, 0, cv.width, cv.height);
      drawPuffs(ctx, list, dt);
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ------------------------------------------------------------------ */
  /* Uvod                                                                */
  /* ------------------------------------------------------------------ */

  function finish(ov) {
    doc.classList.remove('intro-on');
    doc.classList.add('intro-done');
    if (ov) { ov.classList.add('is-out'); setTimeout(function () { ov.remove(); }, 900); }
    idleSmoke();
  }

  function run(full) {
    var ov = document.createElement('div');
    ov.className = 'intro';
    ov.setAttribute('aria-hidden', 'true');
    var cv = document.createElement('canvas');
    var skip = document.createElement('button');
    skip.type = 'button';
    skip.className = 'intro__skip';
    skip.textContent = MSP.t('intro.skip');
    skip.removeAttribute('aria-hidden');
    ov.appendChild(cv);
    document.body.appendChild(ov);
    document.body.appendChild(skip);
    var W = window.innerWidth, H = window.innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    var ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var mobile = W < 700;
    var done = false, raf = 0;
    function end() {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      skip.remove();
      markSeen();
      finish(ov);
    }
    skip.addEventListener('click', end);
    ov.addEventListener('click', end);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') end(); }, { once: true });

    Promise.all([full ? load('/hero/bowl.webp') : null, full ? load('/hero/tobacco.webp') : null,
      full && document.fonts ? document.fonts.load('800 100px Syne') : null]).then(function (res) {
      if (done) return;
      var bowl = res[0], tob = res[1];
      var B = bowlPoint();
      var puffs = [];

      /* ---- tačke natpisa ---- */
      var parts = [];
      if (full) {
        var off = document.createElement('canvas'), ow = Math.round(W), oh = Math.round(H);
        off.width = ow; off.height = oh;
        var ox = off.getContext('2d');
        var lines = mobile ? ['MYSHISHA', 'PEDIA'] : ['MYSHISHAPEDIA'];
        var fs = 200;
        ox.font = '800 ' + fs + 'px Syne, sans-serif';
        // natpis staje u 88% širine ekrana (Syne je širok font)
        var widest = Math.max.apply(null, lines.map(function (l) { return ox.measureText(l).width; }));
        fs = Math.min(fs * W * 0.88 / widest, mobile ? 150 : 190);
        ox.font = '800 ' + fs + 'px Syne, sans-serif';
        ox.textAlign = 'center'; ox.textBaseline = 'middle';
        ox.fillStyle = '#fff';
        var cy = H * (mobile ? 0.4 : 0.45);
        lines.forEach(function (l, i) { ox.fillText(l, W / 2, cy + (i - (lines.length - 1) / 2) * fs * 0.95); });
        var data = ox.getImageData(0, 0, ow, oh).data;
        var step = mobile ? 4 : 5, pts = [];
        for (var y = 0; y < oh; y += step) for (var x = 0; x < ow; x += step) if (data[(y * ow + x) * 4 + 3] > 128) pts.push([x + rnd(-1.5, 1.5), y + rnd(-1.5, 1.5)]);
        var max = mobile ? 1700 : 3800;
        while (pts.length > max) pts.splice(Math.floor(Math.random() * pts.length), 1);
        // mjesto gdje glava padne: lijevo dolje od natpisa
        var land = { x: mobile ? W * 0.3 : W * 0.24, y: mobile ? H * 0.72 : H * 0.74 };
        pts.forEach(function (pt) {
          var len = rnd(5, 11) * (mobile ? 0.85 : 1);
          parts.push({
            tx: pt[0], ty: pt[1], x: land.x + rnd(-20, 20), y: land.y + rnd(-20, 20),
            sx: land.x + rnd(-40, 40), sy: land.y + rnd(-30, 10),
            // izlet iz glave: luk prema gore
            mx: land.x + rnd(-260, 420) * (mobile ? 0.6 : 1), my: land.y - rnd(120, 420) * (mobile ? 0.7 : 1),
            w: len, h: len * rnd(0.26, 0.42), rot: rnd(0, 6.3), spin: rnd(-6, 6),
            u: rnd(0, 1), v: rnd(0, 1), delay: rnd(0, 0.35), fall: rnd(0, 0.5), wob: rnd(0, 6.3)
          });
        });
      }

      var T = full ? { drop: 1.0, form: 2.5, hold: 3.2, suck: 4.3, smoke: 4.2, reveal: 4.9, end: 6.3 } : { drop: 0, form: 0, hold: 0, suck: 0, smoke: 0.05, reveal: 0.5, end: 1.6 };
      var start = 0, last = 0, smokeAcc = 0, revealed = false;

      function drawShred(p, x, y, a) {
        var tw = tob.width, th = tob.height;
        // samo unutrašnjost glave (bez tirkiznog ruba)
        var su = p.u < 0.5 ? 15 + p.u * 2 * 80 : 130 + (p.u - 0.5) * 2 * 90;
        var sv = 10 + p.v * (th - 30);
        ctx.save();
        ctx.globalAlpha = a;
        ctx.translate(x, y); ctx.rotate(p.rot);
        ctx.drawImage(tob, su, sv, 14, 5, -p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      function frame(ts) {
        if (done) return;
        if (!start) start = ts;
        var t = (ts - start) / 1000, dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016;
        last = ts;
        ctx.clearRect(0, 0, W, H);

        // tamna podloga: nestaje kad krene dim
        var dark = t < T.suck ? 1 : 1 - clamp((t - T.suck) / (T.reveal - T.suck + 0.4), 0, 1);
        if (!full) dark = 1 - clamp(t / 0.6, 0, 1);
        if (dark > 0) {
          ctx.fillStyle = 'rgba(14,10,8,' + dark + ')';
          ctx.fillRect(0, 0, W, H);
          // topli sjaj iza natpisa
          var gl = ctx.createRadialGradient(W / 2, H * 0.45, 0, W / 2, H * 0.45, Math.max(W, H) * 0.6);
          gl.addColorStop(0, 'rgba(160,30,50,' + 0.22 * dark + ')');
          gl.addColorStop(1, 'rgba(160,30,50,0)');
          ctx.fillStyle = gl; ctx.fillRect(0, 0, W, H);
        }

        if (full) {
          // ---- 1. glava pada ----
          var bw = mobile ? W * 0.42 : Math.min(W * 0.2, 300), bh = bw * bowl.height / bowl.width;
          var land2 = { x: mobile ? W * 0.3 : W * 0.24, y: mobile ? H * 0.72 : H * 0.74 };
          if (t < T.hold + 0.6) {
            var k = clamp(t / T.drop, 0, 1);
            var bx, by, br;
            if (k < 1) { bx = -bw + (land2.x + bw) * easeOut(k); by = -bh + (land2.y + bh) * easeIn(k); br = -1.6 + 1.9 * k; }
            else { var kk = clamp((t - T.drop) / 0.35, 0, 1); bx = land2.x; by = land2.y - Math.sin(kk * Math.PI) * 26 * (1 - kk); br = 0.3 - 0.25 * easeOut(kk); }
            var fade = t > T.hold ? 1 - clamp((t - T.hold) / 0.6, 0, 1) : 1;
            ctx.save();
            ctx.globalAlpha = fade;
            ctx.translate(bx, by); ctx.rotate(br);
            ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 20;
            ctx.drawImage(bowl, -bw / 2, -bh / 2, bw, bh);
            ctx.restore();
            if (k >= 1 && t < T.drop + 0.05) for (var q = 0; q < 6; q++) puff(puffs, land2.x + rnd(-40, 60), land2.y + bh * 0.3, { alpha: 0.18, r1: rnd(120, 200), life: 1.2, vy: rnd(-40, -10) });
          }

          // ---- 2./3. duhan ----
          if (t >= T.drop) {
            for (var i = 0; i < parts.length; i++) {
              var p = parts[i], x, y, a = 1;
              var tf = clamp((t - T.drop - p.delay) / (T.form - T.drop - 0.35), 0, 1);
              if (t < T.hold) {
                if (tf <= 0) continue;
                // luk: glava -> visoko -> slovo
                var e = ease(tf), u = 1 - e;
                x = u * u * p.sx + 2 * u * e * p.mx + e * e * p.tx;
                y = u * u * p.sy + 2 * u * e * p.my + e * e * p.ty;
                p.rot += p.spin * dt * (1 - e * 0.9);
                if (tf >= 1) { x += Math.sin(t * 2 + p.wob) * 0.6; y += Math.cos(t * 1.7 + p.wob) * 0.6; }
              } else {
                var ts2 = clamp((t - T.hold - p.fall) / (T.suck - T.hold - 0.5), 0, 1);
                if (ts2 >= 1) continue;
                var e2 = easeIn(ts2), u2 = 1 - e2;
                // kovitlac pa u glavu nargile
                var cx = (p.tx + B.x) / 2 + Math.sin(p.wob) * 120, cy2 = Math.min(p.ty, B.y) - 140;
                x = u2 * u2 * p.tx + 2 * u2 * e2 * cx + e2 * e2 * B.x;
                y = u2 * u2 * p.ty + 2 * u2 * e2 * cy2 + e2 * e2 * B.y;
                p.rot += p.spin * dt * 2;
                a = 1 - Math.max(0, (ts2 - 0.85) / 0.15);
              }
              drawShred(p, x, y, a);
            }
          }
        }

        // ---- 4. ugalj i dim ----
        if (t >= T.smoke - (full ? 0.5 : 0)) {
          var heat = clamp((t - (T.smoke - 0.5)) / 0.6, 0, 1) * (1 - clamp((t - T.end + 1) / 1, 0, 1));
          var gg = ctx.createRadialGradient(B.x, B.y, 0, B.x, B.y, 120);
          gg.addColorStop(0, 'rgba(255,140,50,' + 0.75 * heat + ')');
          gg.addColorStop(0.4, 'rgba(255,90,30,' + 0.25 * heat + ')');
          gg.addColorStop(1, 'rgba(255,90,30,0)');
          ctx.fillStyle = gg; ctx.fillRect(B.x - 130, B.y - 130, 260, 260);
        }
        // dim izlazi iz glave postepeno (0,7 s), pa se raširi preko ekrana
        if (t >= T.smoke && t < T.smoke + 0.7) {
          var n = (mobile ? 90 : 160) * dt / 0.7;
          smokeAcc += n;
          while (smokeAcc >= 1) {
            smokeAcc -= 1;
            var ang = -Math.PI / 2 + rnd(-1.9, 1.9), sp = rnd(80, 700) * (mobile ? 0.55 : 1) * Math.random();
            puff(puffs, B.x + rnd(-14, 14), B.y - rnd(0, 30), { vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - rnd(60, 180), r0: rnd(24, 60), r1: rnd(200, 520) * (mobile ? 0.7 : 1), life: rnd(1.5, 2.6), alpha: rnd(0.07, 0.17), rise: rnd(20, 60) });
          }
        }
        if (t >= T.reveal && !revealed) { revealed = true; doc.classList.remove('intro-on'); doc.classList.add('intro-done'); }
        drawPuffs(ctx, puffs, dt);

        if (t >= T.end && !puffs.length) { end(); return; }
        if (t > T.end + 1.5) { end(); return; }
        raf = requestAnimationFrame(frame);
      }
      raf = requestAnimationFrame(frame);
    }).catch(end);
  }

  function go() {
    if (reduce) { finish(null); return; }
    puffSprite = makePuff();
    var full = !seen() || /[?&]intro=1/.test(location.search);
    doc.classList.add('intro-on');
    // fotografija mora biti učitana da se zna gdje je glava nargile
    if (img.complete) run(full); else { img.addEventListener('load', function () { run(full); }, { once: true }); img.addEventListener('error', function () { finish(null); }, { once: true }); }
  }

  // uvod ide tek kad prođe provjera godina (prozor 18+ bi ga prekrio)
  if (doc.classList.contains('age-ok')) go();
  else document.addEventListener('msp:age-ok', go, { once: true });
})();
