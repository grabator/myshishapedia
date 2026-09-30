/*
 * MyShishapedia - efekti.
 *
 *  - Noise:      vlastiti 3D simplex noise (za kovitlanje dima)
 *  - Field:      jedan globalni canvas sa dimom (ambijent iz posude, izdah,
 *                kolutići, trag kursora, pramenovi na karticama, "mahanje" rukom)
 *  - hookah:     animacija nargile i interakcija "Povuci dim"
 *  - veil:       prelaz između stranica kroz oblak dima
 *  - hoseGuide:  crijevo koje se iscrtava dok skrolaš stranicu okusa
 *  - parallax, tilt, reveal, fitText, cardWisps, microPuffs
 *
 * Pravila: animira se transform/opacity (i stroke-dashoffset za linije),
 * sve kroz requestAnimationFrame, canvas se gasi kad nema šta da crta ili kad
 * tab nije vidljiv, a uz prefers-reduced-motion ništa se ne pokreće.
 *
 * Podešavanje dima: vidi SMOKE_CONFIG ispod i README ("Kako podesiti dim").
 */
(function () {
  'use strict';

  var MSP = (window.MSP = window.MSP || {});

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mqFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  var mqMobile = window.matchMedia('(max-width: 767px)');

  function noop() {}
  function rand(a, b) { return a + Math.random() * (b - a); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  var Effects = {
    reducedMotion: function () { return mqReduce.matches; },
    isMobile: function () { return mqMobile.matches; },
    canTilt: function () { return mqFinePointer.matches && !mqReduce.matches; },
    finePointer: function () { return mqFinePointer.matches; }
  };

  /* ------------------------------------------------------------------ */
  /* Podešavanja dima                                                    */
  /* ------------------------------------------------------------------ */

  var SMOKE_CONFIG = {
    scale: 0.5,              // rezolucija canvasa (0.5 = pola, dim je ionako mekan)
    areaPerParticle: 4200,   // 1 čestica na ovoliko px² ekrana (manje = više čestica)
    minParticles: 60,
    maxParticles: 320,
    mobileFactor: 0.6,       // na touch uređajima
    lowEndFactor: 0.75,      // uređaji sa <= 4 jezgre
    handRadius: 130,         // koliko daleko od kursora/prsta dim reaguje
    handForce: 1.1,
    trailEvery: 22           // trag kursora: jedna čestica na ovoliko px pomjeraja
  };
  Effects.SMOKE_CONFIG = SMOKE_CONFIG;

  /* ------------------------------------------------------------------ */
  /* Simplex noise (3D)                                                  */
  /* ------------------------------------------------------------------ */

  var Noise = (function () {
    var grad3 = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1];
    var perm = new Uint8Array(512);
    var permMod12 = new Uint8Array(512);
    var p = new Uint8Array(256);
    var seed = 1337;
    function lcg() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
    for (var i = 0; i < 256; i++) p[i] = i;
    for (var j = 255; j > 0; j--) {
      var r = Math.floor(lcg() * (j + 1));
      var tmp = p[j]; p[j] = p[r]; p[r] = tmp;
    }
    for (var k = 0; k < 512; k++) { perm[k] = p[k & 255]; permMod12[k] = perm[k] % 12; }
    var F3 = 1 / 3;
    var G3 = 1 / 6;

    function dot(g, x, y, z) { return grad3[g] * x + grad3[g + 1] * y + grad3[g + 2] * z; }

    function noise3(xin, yin, zin) {
      var s = (xin + yin + zin) * F3;
      var i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
      var t = (i + j + k) * G3;
      var x0 = xin - (i - t), y0 = yin - (j - t), z0 = zin - (k - t);
      var i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
        else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
        else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
      } else {
        if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
        else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
        else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      }
      var x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
      var x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
      var x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
      var ii = i & 255, jj = j & 255, kk = k & 255;
      var n = 0, tt;
      tt = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
      if (tt > 0) { tt *= tt; n += tt * tt * dot(permMod12[ii + perm[jj + perm[kk]]] * 3, x0, y0, z0); }
      tt = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
      if (tt > 0) { tt *= tt; n += tt * tt * dot(permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3, x1, y1, z1); }
      tt = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
      if (tt > 0) { tt *= tt; n += tt * tt * dot(permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3, x2, y2, z2); }
      tt = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
      if (tt > 0) { tt *= tt; n += tt * tt * dot(permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3, x3, y3, z3); }
      return 32 * n; // približno -1..1
    }
    return { noise3: noise3 };
  })();
  Effects.Noise = Noise;

  /* ------------------------------------------------------------------ */
  /* Teksture dima (generišu se jednom, po boji)                          */
  /* ------------------------------------------------------------------ */

  var texCache = {};

  function smokeTextures(color) {
    if (texCache[color]) return texCache[color];
    var list = [];
    for (var v = 0; v < 5; v++) {
      var size = 128;
      var raw = document.createElement('canvas');
      raw.width = raw.height = size;
      var g = raw.getContext('2d');
      // mnogo sitnih, providnih mrlja duž nasumične krive daje mekan, pramenast oblik
      var ax = rand(-1, 1), ay = rand(-1, 1);
      for (var i = 0; i < 30; i++) {
        var tt = rand(-1, 1);
        var a = rand(0, Math.PI * 2);
        var d = rand(0, 18);
        var x = 64 + ax * tt * 24 + Math.cos(a) * d;
        var y = 64 + ay * tt * 24 + Math.sin(a) * d;
        var r = rand(12, 34) * (1 - Math.abs(tt) * 0.35);
        var grad = g.createRadialGradient(x, y, 0, x, y, r);
        var al = rand(0.05, 0.12);
        grad.addColorStop(0, MSP.color.rgba(color, al));
        grad.addColorStop(0.55, MSP.color.rgba(color, al * 0.45));
        grad.addColorStop(1, MSP.color.rgba(color, 0));
        g.fillStyle = grad;
        g.fillRect(0, 0, size, size);
      }
      // dodatno omekšavanje gdje browser podržava canvas filter
      var c = document.createElement('canvas');
      c.width = c.height = size;
      var g2 = c.getContext('2d');
      if ('filter' in g2) g2.filter = 'blur(3px)';
      g2.drawImage(raw, 0, 0);
      // radijalna maska: ivice teksture uvijek potpuno prozirne
      g2.filter = 'none';
      g2.globalCompositeOperation = 'destination-in';
      var mask = g2.createRadialGradient(64, 64, 20, 64, 64, 64);
      mask.addColorStop(0, 'rgba(0,0,0,1)');
      mask.addColorStop(1, 'rgba(0,0,0,0)');
      g2.fillStyle = mask;
      g2.fillRect(0, 0, size, size);
      list.push(c);
    }
    texCache[color] = list;
    return list;
  }

  function ringTexture(color) {
    var key = 'ring:' + color;
    if (texCache[key]) return texCache[key];
    var size = 128;
    var c = document.createElement('canvas');
    c.width = c.height = size;
    var g = c.getContext('2d');
    var grad = g.createRadialGradient(64, 64, 26, 64, 64, 62);
    grad.addColorStop(0, MSP.color.rgba(color, 0));
    grad.addColorStop(0.45, MSP.color.rgba(color, 0.7));
    grad.addColorStop(0.62, MSP.color.rgba(color, 0.35));
    grad.addColorStop(1, MSP.color.rgba(color, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, size, size);
    texCache[key] = c;
    return c;
  }

  /* ------------------------------------------------------------------ */
  /* Field: globalni canvas sa dimom                                     */
  /* ------------------------------------------------------------------ */

  var Field = {
    ready: false,
    canvas: null,
    ctx: null,
    w: 0,
    h: 0,
    parts: [],
    emitters: [],
    max: 200,
    raf: 0,
    last: 0,
    time: 0,
    running: false,
    lastScroll: 0,
    colors: ['#f4ebdf'],
    trail: false,
    hand: { x: -9999, y: -9999, vx: 0, vy: 0, t: 0 },
    trailDist: 0,
    slowFrames: 0,
    lastBurst: 0,
    nextId: 1
  };

  Field.init = function () {
    if (Field.ready || Effects.reducedMotion()) return;
    var c = document.createElement('canvas');
    c.className = 'smoke-field';
    c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    Field.canvas = c;
    Field.ctx = c.getContext('2d');
    Field.ready = !!Field.ctx;
    if (!Field.ready) return;
    Field.resize();
    Field.lastScroll = window.scrollY || 0;
    window.addEventListener('resize', Field.resize);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) Field.stop(); else Field.wake();
    });
    window.addEventListener('pointermove', Field.onPointer, { passive: true });
    window.addEventListener('pointerdown', Field.onPointer, { passive: true });
    Field.tick = Field.tick.bind(Field);
  };

  Field.resize = function () {
    var S = SMOKE_CONFIG.scale;
    Field.w = window.innerWidth;
    Field.h = window.innerHeight;
    Field.canvas.width = Math.max(1, Math.round(Field.w * S));
    Field.canvas.height = Math.max(1, Math.round(Field.h * S));
    var max = (Field.w * Field.h) / SMOKE_CONFIG.areaPerParticle;
    if (!mqFinePointer.matches) max *= SMOKE_CONFIG.mobileFactor;
    if ((navigator.hardwareConcurrency || 8) <= 4) max *= SMOKE_CONFIG.lowEndFactor;
    Field.max = Math.round(clamp(max, SMOKE_CONFIG.minParticles, SMOKE_CONFIG.maxParticles));
  };

  Field.onPointer = function (e) {
    var h = Field.hand;
    var now = performance.now();
    var dt = Math.max(8, now - h.t);
    if (h.t && now - h.t < 120) {
      h.vx = ((e.clientX - h.x) / dt) * 1000;
      h.vy = ((e.clientY - h.y) / dt) * 1000;
    } else {
      h.vx = h.vy = 0;
    }
    var moved = Math.hypot(e.clientX - h.x, e.clientY - h.y);
    h.x = e.clientX;
    h.y = e.clientY;
    h.t = now;
    if (Field.trail && e.pointerType === 'mouse' && moved < 400) {
      Field.trailDist += moved;
      if (Field.trailDist > SMOKE_CONFIG.trailEvery) {
        Field.trailDist = 0;
        Field.spawn({
          x: e.clientX, y: e.clientY, vx: -h.vx * 0.05, vy: -h.vy * 0.05 - 10,
          r0: 6, r1: rand(26, 44), life: rand(0.9, 1.4), alpha: 0.07, turb: 40, buoy: 14, drag: 0.4
        }, true);
      }
    }
    if (Field.parts.length) Field.wake();
  };

  Field.setColors = function (colors) {
    Field.colors = colors && colors.length ? colors : ['#f4ebdf'];
    Field.warm(Field.colors);
  };

  /** Teksture se pripremaju unaprijed, kad je browser slobodan (da prvi dim ne zakoči). */
  Field.warm = function (colors) {
    if (!Field.ready) return;
    var list = colors.filter(function (c) { return !texCache[c]; });
    function next(deadline) {
      while (list.length && (!deadline || deadline.timeRemaining() > 6)) smokeTextures(list.shift());
      if (list.length) schedule();
    }
    function schedule() {
      if ('requestIdleCallback' in window) window.requestIdleCallback(next, { timeout: 2000 });
      else window.setTimeout(next, 200);
    }
    if (list.length) schedule();
  };

  Field.setTrail = function (on) {
    Field.trail = !!on && mqFinePointer.matches && Field.ready;
  };

  /**
   * Dodaje česticu. o: x, y (px ekrana), vx, vy, r0, r1 (veličina na početku/kraju),
   * life (s), alpha, colors, turb (kovitlanje), buoy (uzgon), drag, world (prati skrol), ring.
   * force=false znači da se čestica preskače ako je dostignut maksimum.
   */
  Field.spawn = function (o, force) {
    if (!Field.ready) return;
    if (Field.parts.length >= Field.max) {
      if (!force) return;
      Field.parts.shift();
    }
    var color = pick(o.colors || Field.colors);
    Field.parts.push({
      x: o.x, y: o.y,
      vx: o.vx || 0, vy: o.vy || 0,
      age: 0, life: o.life || 3,
      r0: o.r0 || 20, r1: o.r1 || 80,
      a: o.alpha == null ? 0.25 : o.alpha,
      tex: o.ring ? ringTexture(color) : pick(smokeTextures(color)),
      ring: !!o.ring,
      rot: rand(0, Math.PI * 2),
      vr: rand(-0.5, 0.5),
      sx: o.ring ? 1 : rand(1, 1.6),
      turb: o.turb == null ? 60 : o.turb,
      buoy: o.buoy == null ? 18 : o.buoy,
      drag: o.drag == null ? 0.55 : o.drag,
      world: !!o.world,
      seed: rand(0, 100)
    });
    Field.wake();
  };

  /** Kratak oblačić (klik, pramen sa kartice, pojava sekcije). */
  Field.puff = function (x, y, o) {
    if (!Field.ready) return;
    Field.lastBurst = performance.now();
    o = o || {};
    var count = o.count || 6;
    for (var i = 0; i < count; i++) {
      var ang = (o.angle == null ? -Math.PI / 2 : o.angle) + rand(-1, 1) * (o.spread == null ? 0.9 : o.spread);
      var sp = rand(o.speed ? o.speed[0] : 20, o.speed ? o.speed[1] : 60);
      Field.spawn({
        x: x + rand(-6, 6), y: y + rand(-4, 4),
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        r0: o.r0 || rand(6, 12), r1: rand(o.r1 ? o.r1[0] : 30, o.r1 ? o.r1[1] : 70),
        life: rand(o.life ? o.life[0] : 1.2, o.life ? o.life[1] : 2.2),
        alpha: o.alpha == null ? 0.18 : o.alpha,
        colors: o.colors, turb: o.turb, buoy: o.buoy, drag: o.drag, world: o.world
      }, o.force);
    }
  };

  /** Veliki izdah: oblak iz usnika preko ekrana; strength 0..1. */
  Field.exhale = function (x, y, strength, colors) {
    if (!Field.ready) return;
    Field.lastBurst = performance.now();
    var s = clamp(strength, 0.1, 1);
    var count = Math.round(14 + 46 * s);
    var tx = Field.w * 0.45 - x;
    var ty = Field.h * 0.35 - y;
    var base = Math.atan2(ty, tx);
    var reach = Math.min(Field.w, Field.h) * (0.35 + 0.65 * s);
    for (var i = 0; i < count; i++) {
      var ang = base + rand(-0.55, 0.55);
      var sp = rand(0.5, 1.25) * reach * 1.4;
      Field.spawn({
        x: x + rand(-8, 8), y: y + rand(-8, 8),
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        r0: rand(14, 30), r1: rand(120, 260) * (0.55 + s),
        life: rand(2.8, 5.2) * (0.7 + 0.5 * s),
        alpha: rand(0.28, 0.42),
        colors: colors, turb: 90, buoy: 12, drag: 0.18
      }, true);
    }
  };

  /** Kolutići dima. */
  Field.rings = function (x, y, n, colors) {
    if (!Field.ready) return;
    Field.lastBurst = performance.now() + n * 320;
    for (var i = 0; i < n; i++) {
      (function (k) {
        window.setTimeout(function () {
          var ang = -Math.PI / 2 - 0.5 + rand(-0.2, 0.2);
          Field.spawn({
            x: x, y: y, vx: Math.cos(ang) * rand(70, 110), vy: Math.sin(ang) * rand(70, 110),
            r0: 10, r1: rand(90, 130), life: rand(3.6, 4.6), alpha: 0.55,
            colors: colors, ring: true, turb: 12, buoy: 6, drag: 0.35
          }, true);
        }, k * 320);
      })(i);
    }
  };

  /**
   * Stalni izvor dima vezan za element (npr. posuda nargile).
   * o: anchor (element), point [fx, fy] (dio širine/visine elementa), rate (čestica/s),
   *    colors, r0, r1 [a,b], life [a,b], speed [a,b], alpha, turb, buoy
   */
  Field.addEmitter = function (o) {
    if (!Field.ready) return 0;
    var e = { id: Field.nextId++, acc: 0, rateMul: 1, o: o };
    Field.emitters.push(e);
    Field.wake();
    return e.id;
  };

  Field.getEmitter = function (id) {
    for (var i = 0; i < Field.emitters.length; i++) if (Field.emitters[i].id === id) return Field.emitters[i];
    return null;
  };

  Field.removeEmitter = function (id) {
    Field.emitters = Field.emitters.filter(function (e) { return e.id !== id; });
  };

  Field.wake = function () {
    if (!Field.ready || Field.running || document.hidden) return;
    Field.running = true;
    Field.last = performance.now();
    Field.raf = requestAnimationFrame(Field.tick);
  };

  Field.stop = function () {
    Field.running = false;
    cancelAnimationFrame(Field.raf);
  };

  Field.clear = function () {
    Field.parts.length = 0;
  };

  Field.tick = function (now) {
    if (!Field.running) return;
    // Tihi ambijent (samo dim iz posude) ide na ~30 fps; čim ima izdaha,
    // klika ili pokreta ruke, vraća se na punu brzinu.
    var calm = now - Field.lastBurst > 2500 && now - Field.hand.t > 400;
    if (calm && now - Field.last < 30) {
      Field.raf = requestAnimationFrame(Field.tick);
      return;
    }
    var dt = Math.min(0.05, (now - Field.last) / 1000);
    Field.last = now;
    Field.time += dt;
    var t = Field.time;
    var ctx = Field.ctx;
    var S = SMOKE_CONFIG.scale;
    var W = Field.w, H = Field.h;

    // adaptivni kvalitet: ako frejmovi traju predugo, smanji broj čestica
    if (dt > 0.03) Field.slowFrames++; else Field.slowFrames = Math.max(0, Field.slowFrames - 1);
    if (Field.slowFrames > 45) { Field.max = Math.max(50, Math.round(Field.max * 0.8)); Field.slowFrames = 0; }

    // skrol: čestice "vezane za stranicu" se pomjeraju zajedno sa njom
    var sy = window.scrollY || 0;
    var dScroll = sy - Field.lastScroll;
    Field.lastScroll = sy;

    // izvori
    var activeEmitters = 0;
    for (var e = 0; e < Field.emitters.length; e++) {
      var em = Field.emitters[e];
      var o = em.o;
      if (!o.anchor || !o.anchor.isConnected) continue;
      // pozicija izvora se čita najviše svakih 150 ms (između toga je dovoljno pomjeriti je za skrol)
      if (!em.rect || now - em.rectAt > 150) {
        var br = o.anchor.getBoundingClientRect();
        em.rect = { left: br.left, top: br.top, width: br.width, height: br.height, bottom: br.bottom };
        em.rectAt = now;
      } else {
        em.rect.top -= dScroll;
        em.rect.bottom -= dScroll;
      }
      var r = em.rect;
      if (r.bottom < -200 || r.top > H + 100 || r.width === 0) continue;
      activeEmitters++;
      var ex = r.left + r.width * o.point[0];
      var ey = r.top + r.height * o.point[1];
      em.acc += (o.rate || 5) * em.rateMul * dt;
      while (em.acc >= 1) {
        em.acc -= 1;
        var sp = rand(o.speed ? o.speed[0] : 30, o.speed ? o.speed[1] : 60);
        // o.angle: smjer mlaza (radijani); bez njega dim ide gore
        var ang = o.angle == null ? null : o.angle + rand(-1, 1) * (o.spread || 0.15);
        Field.spawn({
          x: ex + rand(-6, 6), y: ey + (ang == null ? 0 : rand(-8, 8)),
          vx: ang == null ? rand(-10, 10) : Math.cos(ang) * sp,
          vy: ang == null ? -sp : Math.sin(ang) * sp,
          r0: o.r0 || 8, r1: rand(o.r1 ? o.r1[0] : 60, o.r1 ? o.r1[1] : 140),
          life: rand(o.life ? o.life[0] : 3, o.life ? o.life[1] : 5),
          alpha: o.alpha == null ? 0.2 : o.alpha,
          colors: o.colors, turb: o.turb, buoy: o.buoy, world: true, drag: o.drag == null ? 0.6 : o.drag
        });
      }
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, Field.canvas.width, Field.canvas.height);

    var hand = Field.hand;
    var handFresh = now - hand.t < 90;
    var handSpeed = Math.hypot(hand.vx, hand.vy);
    var R = SMOKE_CONFIG.handRadius;
    var R2 = R * R;
    var parts = Field.parts;
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.age += dt;
      if (p.age >= p.life) { parts[i] = parts[parts.length - 1]; parts.pop(); continue; }
      if (p.world) p.y -= dScroll;
      var k = p.age / p.life;

      // kovitlanje po noise polju
      var nv = Noise.noise3(p.x * 0.0028, p.y * 0.0028, t * 0.15 + p.seed);
      var ang = nv * Math.PI * 2.2;
      p.vx += Math.cos(ang) * p.turb * dt;
      p.vy += Math.sin(ang) * p.turb * dt - p.buoy * dt;

      // ruka: prolazak kursora/prsta razmiče dim
      if (handFresh && handSpeed > 60) {
        var dx = p.x - hand.x, dy = p.y - hand.y;
        var d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          var d = Math.sqrt(d2) || 1;
          var f = (1 - d / R) * SMOKE_CONFIG.handForce;
          p.vx += (hand.vx * 0.9 + (dx / d) * 220) * f * dt * 3;
          p.vy += (hand.vy * 0.9 + (dy / d) * 220) * f * dt * 3;
        }
      }

      var drag = Math.pow(p.drag, dt);
      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;

      var size = p.r0 + (p.r1 - p.r0) * (1 - (1 - k) * (1 - k));
      var alpha = p.a * Math.min(1, k / 0.12) * Math.pow(1 - k, 1.3);
      if (alpha < 0.004) continue;
      var x = p.x * S, y = p.y * S, s = size * S;
      if (x + s < 0 || x - s > W * S || y + s < 0 || y - s > H * S) continue;
      ctx.globalAlpha = alpha;
      if (p.ring) {
        ctx.setTransform(1, 0, 0, 0.62, x, y);
      } else {
        // rotacija + blago izduženje (pramen, a ne krug)
        var cs = Math.cos(p.rot), sn = Math.sin(p.rot);
        ctx.setTransform(cs * p.sx, sn * p.sx, -sn, cs, x, y);
      }
      ctx.drawImage(p.tex, -s, -s, s * 2, s * 2);
    }

    if (!parts.length && !activeEmitters) {
      Field.running = false;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, Field.canvas.width, Field.canvas.height);
      return;
    }
    Field.raf = requestAnimationFrame(Field.tick);
  };

  Effects.Field = Field;

  /* ------------------------------------------------------------------ */
  /* Nargila: intro animacija i "Povuci dim"                             */
  /* ------------------------------------------------------------------ */

  /**
   * stage: element .hookah (sadrži SVG iz MSP.hookah)
   * opts: { button, meter, colors (dim), waterColors, bowlSmoke: {rate, alpha},
   *         introDelay (s, kad se žar upali), onIgnite }
   */
  Effects.hookah = function (stage, opts) {
    if (!stage) return noop;
    opts = opts || {};
    var P = MSP.HOOKAH_POINTS;
    var svg = stage.querySelector('.hk');
    var bubbles = stage.querySelector('.hk-bubbles');
    var hoseSmoke = stage.querySelector('.hk-hose-smoke');
    var button = opts.button;
    var meter = opts.meter;
    var reduced = Effects.reducedMotion();
    var alive = true;
    var timers = [];
    var emitterId = 0;
    var idleHeat = 0.72;
    var heat = reduced ? idleHeat : 0;
    var holding = false;
    var holdStart = 0;
    var strength = 0;
    var raf = 0;
    var last = 0;
    var bubbleAcc = 0;
    var hoseOffset = 0;
    var hoseAlpha = 0;
    var liveBubbles = 0;
    var waveAnims = [];

    function later(fn, ms) { timers.push(window.setTimeout(function () { if (alive) fn(); }, ms)); }

    function setHeat(v) {
      heat = v;
      stage.style.setProperty('--heat', v.toFixed(3));
    }

    function pointAt(fx, fy) {
      var r = svg.getBoundingClientRect();
      return [r.left + r.width * (fx / P.width), r.top + r.height * (fy / P.height)];
    }

    function ignite() {
      stage.classList.add('is-lit');
      setHeat(idleHeat);
      if (!reduced && Field.ready) {
        emitterId = Field.addEmitter({
          anchor: svg,
          point: [P.bowl[0] / P.width, P.bowl[1] / P.height],
          rate: (opts.bowlSmoke && opts.bowlSmoke.rate) || 6,
          colors: opts.colors,
          r1: [50, 120], life: [3, 5.2], speed: [28, 55],
          alpha: (opts.bowlSmoke && opts.bowlSmoke.alpha) || 0.2,
          turb: 55, buoy: 16
        });
      }
      if (opts.onIgnite) opts.onIgnite();
    }

    var introMs = (opts.introDelay == null ? 1.7 : opts.introDelay) * 1000;
    if (reduced) {
      stage.classList.add('is-ready', 'is-lit');
      setHeat(idleHeat);
    } else {
      stage.classList.add('is-drawing');
      setHeat(0);
      later(ignite, introMs);
      later(function () { stage.classList.add('is-ready'); }, introMs + 900);
    }

    function spawnBubble(s) {
      if (liveBubbles > 36 || !bubbles.animate) return;
      liveBubbles++;
      var ns = 'http://www.w3.org/2000/svg';
      var c = document.createElementNS(ns, 'circle');
      var r = rand(1.6, 3.4 + s * 2.2);
      c.setAttribute('cx', P.bubbleOrigin[0] + rand(-3, 3));
      c.setAttribute('cy', P.bubbleOrigin[1]);
      c.setAttribute('r', r.toFixed(1));
      c.setAttribute('class', 'hk-bubble');
      bubbles.appendChild(c);
      var rise = P.bubbleOrigin[1] - P.water + rand(-4, 6);
      var dx = rand(-18, 18);
      var anim = c.animate([
        { transform: 'translate(0px, 0px) scale(0.5)', opacity: 0 },
        { opacity: 0.95, offset: 0.12 },
        { transform: 'translate(' + (dx * 0.5).toFixed(1) + 'px, ' + (-rise * 0.55).toFixed(1) + 'px) scale(0.9)', opacity: 0.9, offset: 0.6 },
        { transform: 'translate(' + dx.toFixed(1) + 'px, ' + (-rise).toFixed(1) + 'px) scale(1.15)', opacity: 0 }
      ], { duration: rand(650, 1000) / (0.7 + s * 0.8), easing: 'cubic-bezier(.3,.1,.6,1)' });
      anim.onfinish = anim.oncancel = function () { liveBubbles--; c.remove(); };
    }

    function frame(now) {
      raf = 0;
      if (!alive) return;
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (holding) {
        strength = Math.min(1, (now - holdStart) / 2500);
        setHeat(idleHeat + (1 - idleHeat) * Math.min(1, strength * 1.6));
        bubbleAcc += (5 + 30 * strength) * dt;
        while (bubbleAcc >= 1) { bubbleAcc--; spawnBubble(strength); }
        hoseAlpha = Math.min(1, hoseAlpha + dt * 3);
        waveAnims.forEach(function (a) { a.playbackRate = 1 + strength * 3.5; });
      } else {
        setHeat(heat + (idleHeat - heat) * Math.min(1, dt * 2.5));
        hoseAlpha = Math.max(0, hoseAlpha - dt * 1.8);
        waveAnims.forEach(function (a) { a.playbackRate = Math.max(1, a.playbackRate - dt * 3); });
      }
      if (hoseSmoke) {
        hoseOffset -= (0.35 + strength * 1.4) * dt * (holding ? 1 : 0.4);
        hoseSmoke.style.strokeDashoffset = hoseOffset.toFixed(3);
        hoseSmoke.style.opacity = (hoseAlpha * 0.85).toFixed(3);
      }
      if (meter) meter.style.transform = 'scaleX(' + (holding ? strength : 0).toFixed(3) + ')';
      var settling = Math.abs(heat - idleHeat) > 0.004 || hoseAlpha > 0;
      if (holding || settling) raf = requestAnimationFrame(frame);
    }

    function start(e) {
      if (holding || !alive) return;
      if (e && e.type === 'pointerdown') {
        if (e.button !== 0) return;
        e.preventDefault();
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* nije kritično */ }
      }
      if (!stage.classList.contains('is-lit')) ignite();
      holding = true;
      holdStart = performance.now();
      strength = 0;
      stage.classList.add('is-pulling');
      if (button) button.setAttribute('aria-pressed', 'true');
      if (reduced) { setHeat(1); return; }
      waveAnims = [];
      stage.querySelectorAll('.hk-wave').forEach(function (w) {
        if (w.getAnimations) waveAnims = waveAnims.concat(w.getAnimations());
      });
      last = performance.now();
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function release() {
      if (!holding) return;
      holding = false;
      var held = (performance.now() - holdStart) / 1000;
      stage.classList.remove('is-pulling');
      if (button) button.setAttribute('aria-pressed', 'false');
      if (reduced) {
        later(function () { setHeat(idleHeat); }, 450);
        return;
      }
      var m = pointAt(P.mouth[0], P.mouth[1]);
      if (Field.ready) {
        if (held < 0.18) {
          Field.puff(m[0], m[1], { count: 5, colors: opts.colors, alpha: 0.2 });
        } else {
          Field.exhale(m[0], m[1], Math.min(1, held / 2.5), opts.colors);
          if (held >= 1 && held <= 2) Field.rings(m[0], m[1] - 10, held > 1.5 ? 3 : 2, opts.colors);
        }
      }
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }

    function onKeyDown(e) {
      if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(e); }
    }
    function onKeyUp(e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); release(); }
    }
    function block(e) { e.preventDefault(); }

    var targets = [svg, button].filter(Boolean);
    targets.forEach(function (t) {
      t.addEventListener('pointerdown', start);
      t.addEventListener('pointerup', release);
      t.addEventListener('pointercancel', release);
      t.addEventListener('lostpointercapture', release);
      t.addEventListener('contextmenu', block);
    });
    if (button) {
      button.addEventListener('keydown', onKeyDown);
      button.addEventListener('keyup', onKeyUp);
      button.addEventListener('blur', release);
      button.addEventListener('click', block);
    }

    return function () {
      alive = false;
      holding = false;
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      if (emitterId) Field.removeEmitter(emitterId);
      targets.forEach(function (t) {
        t.removeEventListener('pointerdown', start);
        t.removeEventListener('pointerup', release);
        t.removeEventListener('pointercancel', release);
        t.removeEventListener('lostpointercapture', release);
        t.removeEventListener('contextmenu', block);
      });
      if (button) {
        button.removeEventListener('keydown', onKeyDown);
        button.removeEventListener('keyup', onKeyUp);
        button.removeEventListener('blur', release);
        button.removeEventListener('click', block);
      }
    };
  };

  /**
   * Sastojci padaju u posudu nargile (stranica okusa). Elementi .drop su već
   * u DOM-u (CSS animacija), a ovdje se na kraju iz posude digne obojeni dim.
   */
  Effects.bowlDrop = function (stage, colors, whenMs) {
    if (!stage || Effects.reducedMotion() || !Field.ready) return noop;
    var svg = stage.querySelector('.hk');
    var P = MSP.HOOKAH_POINTS;
    var t = window.setTimeout(function () {
      var r = svg.getBoundingClientRect();
      var x = r.left + r.width * (P.bowl[0] / P.width);
      var y = r.top + r.height * (P.bowl[1] / P.height);
      Field.puff(x, y, { count: 16, colors: colors, alpha: 0.32, r1: [60, 150], life: [2.2, 3.6], speed: [40, 110], spread: 0.8, world: true, force: true });
    }, whenMs);
    return function () { clearTimeout(t); };
  };

  /* ------------------------------------------------------------------ */
  /* Prelaz između stranica: oblak dima                                  */
  /* ------------------------------------------------------------------ */

  var veilEl = null;

  function ensureVeil() {
    if (veilEl) return veilEl;
    veilEl = document.createElement('div');
    veilEl.className = 'veil';
    veilEl.setAttribute('aria-hidden', 'true');
    var html = '<div class="veil__base"></div>';
    var spots = [[12, 20], [50, 10], [88, 22], [25, 60], [70, 55], [10, 92], [50, 85], [92, 88]];
    spots.forEach(function (s, i) {
      html += '<div class="veil__blob" style="--x:' + s[0] + '%;--y:' + s[1] + '%;--i:' + i + '"></div>';
    });
    veilEl.innerHTML = html;
    document.body.appendChild(veilEl);
    return veilEl;
  }

  /**
   * Oblak prekrije ekran (≈300 ms), pozove swap(), pa se raziđe (≈400 ms).
   * color: boja oblaka (miješa se sa pozadinom nove stranice).
   */
  Effects.veil = function (color, swap) {
    if (Effects.reducedMotion()) { swap(); return; }
    var v = ensureVeil();
    v.style.setProperty('--veil', color);
    v.classList.remove('is-clearing');
    void v.offsetWidth; // restart animacija
    v.classList.add('is-covering');
    window.setTimeout(function () {
      swap();
      v.classList.remove('is-covering');
      v.classList.add('is-clearing');
      if (Field.ready) {
        for (var i = 0; i < 6; i++) {
          Field.puff(rand(0.1, 0.9) * window.innerWidth, rand(0.3, 1) * window.innerHeight, {
            count: 3, colors: [color], alpha: 0.35, r1: [140, 260], life: [1.4, 2.2], speed: [40, 120], force: true
          });
        }
      }
      window.setTimeout(function () { v.classList.remove('is-clearing'); }, 420);
    }, 300);
  };

  /**
   * Samo prekrivanje (odlazak na drugu stranicu): oblak prekrije ekran, pa go().
   * Nova stranica sama "raziđe" oblak (CSS klasa html.arrive, vidi build.mjs).
   */
  Effects.veilCover = function (color, go) {
    if (Effects.reducedMotion()) { go(); return; }
    var v = ensureVeil();
    v.style.setProperty('--veil', color);
    v.classList.remove('is-clearing');
    void v.offsetWidth;
    v.classList.add('is-covering');
    window.setTimeout(go, 280);
  };

  /** Skloni oblak (npr. povratak "nazad" iz keša browsera). */
  Effects.veilReset = function () {
    if (veilEl) veilEl.classList.remove('is-covering', 'is-clearing');
  };

  /* ------------------------------------------------------------------ */
  /* Crijevo-vodilja kroz sekcije (stranica okusa)                        */
  /* ------------------------------------------------------------------ */

  Effects.hoseGuide = function (article) {
    if (!article) return noop;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'hose-guide');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.innerHTML =
      '<path class="hose-guide__shadow" pathLength="1"/>' +
      '<path class="hose-guide__line" pathLength="1"/>' +
      '<path class="hose-guide__shine" pathLength="1"/>' +
      '<g class="hose-guide__nodes"></g>';
    article.appendChild(svg);
    var paths = svg.querySelectorAll('path');
    var nodesG = svg.querySelector('.hose-guide__nodes');
    var top = 0;
    var height = 1;
    var raf = 0;
    var reduced = Effects.reducedMotion();
    var nodeYs = [];

    function build() {
      var heads = article.querySelectorAll('.fsec__head');
      var container = article.querySelector('.fsec .container');
      if (!heads.length || !container) return;
      var aRect = article.getBoundingClientRect();
      var cs = window.getComputedStyle(container);
      var textLeft = container.getBoundingClientRect().left - aRect.left + parseFloat(cs.paddingLeft);
      var cx = Math.max(6, textLeft / 2);
      var amp = Math.min(56, textLeft * 0.28);
      var hero = article.querySelector('.fhero');
      var startY = hero ? hero.offsetHeight - 40 : 0;
      var pts = [[cx, startY]];
      nodeYs = [];
      Array.prototype.forEach.call(heads, function (h, i) {
        var y = h.getBoundingClientRect().top - aRect.top + 18;
        pts.push([cx + (i % 2 ? amp : -amp), y]);
        nodeYs.push([cx + (i % 2 ? amp : -amp), y]);
      });
      var last = article.querySelector('.pager');
      if (last) pts.push([cx, last.getBoundingClientRect().top - aRect.top + 60]);
      var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
      for (var i = 1; i < pts.length; i++) {
        var a = pts[i - 1], b = pts[i];
        var my = (a[1] + b[1]) / 2;
        d += 'C' + a[0].toFixed(1) + ' ' + my.toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + my.toFixed(1) + ' ' + b[0].toFixed(1) + ' ' + b[1].toFixed(1);
      }
      Array.prototype.forEach.call(paths, function (p) { p.setAttribute('d', d); });
      nodesG.innerHTML = nodeYs.map(function (n) {
        return '<circle class="hose-guide__node" cx="' + n[0].toFixed(1) + '" cy="' + n[1].toFixed(1) + '" r="5"/>';
      }).join('');
      top = startY;
      height = Math.max(1, pts[pts.length - 1][1] - startY);
      svg.setAttribute('width', aRect.width);
      svg.setAttribute('height', article.offsetHeight);
      svg.setAttribute('viewBox', '0 0 ' + aRect.width.toFixed(0) + ' ' + article.offsetHeight);
      update();
    }

    function update() {
      raf = 0;
      var aTop = article.getBoundingClientRect().top;
      var reach = -aTop + window.innerHeight * 0.72;
      var prog = reduced ? 1 : clamp((reach - top) / height, 0, 1);
      var off = (1 - prog).toFixed(4);
      Array.prototype.forEach.call(paths, function (p) { p.style.strokeDashoffset = off; });
      Array.prototype.forEach.call(nodesG.children, function (n, i) {
        n.classList.toggle('is-on', nodeYs[i] && reach >= nodeYs[i][1]);
      });
    }

    function onScroll() { if (!raf) raf = requestAnimationFrame(update); }

    var ro = null;
    var buildTimer = 0;
    function scheduleBuild() {
      clearTimeout(buildTimer);
      buildTimer = setTimeout(build, 250);
    }
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(scheduleBuild);
      ro.observe(article);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', scheduleBuild);
    scheduleBuild();

    return function () {
      cancelAnimationFrame(raf);
      clearTimeout(buildTimer);
      if (ro) ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', scheduleBuild);
      svg.remove();
    };
  };

  /* ------------------------------------------------------------------ */
  /* Pramenovi dima iz posude na karticama, dim na klik                   */
  /* ------------------------------------------------------------------ */

  function wispFrom(card) {
    if (!Field.ready) return;
    var now = performance.now();
    if (card._wispAt && now - card._wispAt < 1400) return;
    card._wispAt = now;
    var bowl = card.querySelector('.card__bowl');
    if (!bowl) return;
    var r = bowl.getBoundingClientRect();
    var colors = (card.getAttribute('data-smoke') || '#ffffff').split(',');
    Field.puff(r.left + r.width / 2, r.top + r.height * 0.18, {
      count: 7, colors: colors, alpha: 0.26, r0: 6, r1: [34, 80], life: [1.6, 2.6], speed: [30, 70], spread: 0.35, world: true, turb: 70
    });
  }

  Effects.cardWisps = function (container) {
    if (!container || Effects.reducedMotion() || !Field.ready) return noop;
    if (mqFinePointer.matches) {
      var onOver = function (e) {
        var card = e.target.closest && e.target.closest('.card');
        if (!card || !container.contains(card)) return;
        if (e.relatedTarget && card.contains(e.relatedTarget)) return;
        wispFrom(card);
      };
      container.addEventListener('pointerover', onOver);
      return function () { container.removeEventListener('pointerover', onOver); };
    }
    if (!('IntersectionObserver' in window)) return noop;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { wispFrom(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    container.querySelectorAll('.card').forEach(function (c) { io.observe(c); });
    return function () { io.disconnect(); };
  };

  /**
   * Opšti pramen dima iz elementa (anchor) unutar kartice: na hover (desktop)
   * ili kad kartica uđe u ekran (touch). Koriste ga nove kartice (Istraži, oprema...).
   */
  Effects.hoverWisps = function (container, selector, anchorSel, colors) {
    if (!container || Effects.reducedMotion() || !Field.ready) return noop;
    function wisp(card) {
      var now = performance.now();
      if (card._wispAt && now - card._wispAt < 1400) return;
      card._wispAt = now;
      var a = card.querySelector(anchorSel) || card;
      var r = a.getBoundingClientRect();
      Field.puff(r.left + r.width / 2, r.top + r.height * 0.35, {
        count: 7, colors: colors, alpha: 0.24, r0: 6, r1: [40, 90], life: [1.6, 2.6], speed: [30, 70], spread: 0.5, world: true, turb: 70
      });
    }
    if (mqFinePointer.matches) {
      var onOver = function (e) {
        var card = e.target.closest && e.target.closest(selector);
        if (!card || !container.contains(card)) return;
        if (e.relatedTarget && card.contains(e.relatedTarget)) return;
        wisp(card);
      };
      container.addEventListener('pointerover', onOver);
      return function () { container.removeEventListener('pointerover', onOver); };
    }
    if (!('IntersectionObserver' in window)) return noop;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { wisp(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    container.querySelectorAll(selector).forEach(function (c) { io.observe(c); });
    return function () { io.disconnect(); };
  };

  /**
   * Swipe lijevo/desno na elementu (vodič). Vertikalni skrol ostaje normalan
   * (touch-action: pan-y u CSS-u); reaguje samo na jasan horizontalni potez.
   */
  Effects.swipe = function (el, onLeft, onRight) {
    if (!el) return noop;
    var x0 = 0, y0 = 0, t0 = 0, active = false;
    function down(e) {
      if (e.pointerType === 'mouse') return;
      active = true; x0 = e.clientX; y0 = e.clientY; t0 = performance.now();
    }
    function up(e) {
      if (!active) return;
      active = false;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      if (performance.now() - t0 > 800) return;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
        if (dx < 0) onLeft(); else onRight();
      }
    }
    function cancel() { active = false; }
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', cancel);
    return function () {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', cancel);
    };
  };

  /** Mali pramen dima na klik dugmadi i filtera. */
  Effects.microPuffs = function (root, selector) {
    if (!root || Effects.reducedMotion()) return noop;
    selector = selector || '.btn, .chip, .pill, .pull, .search__clear, .seg-btn, .gdot, .qopt, .pick-item';
    function onClick(e) {
      if (!Field.ready) return;
      var el = e.target.closest && e.target.closest(selector);
      if (!el) return;
      var x = e.clientX, y = e.clientY;
      if (!x && !y) { var r = el.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
      Field.puff(x, y, { count: 5, alpha: 0.2, r0: 4, r1: [18, 40], life: [0.8, 1.3], speed: [20, 60], spread: 1.4 });
    }
    root.addEventListener('click', onClick);
    return function () { root.removeEventListener('click', onClick); };
  };

  /* ------------------------------------------------------------------ */
  /* Parallax (skrol + miš), u više slojeva                               */
  /* ------------------------------------------------------------------ */

  /**
   * Elementi sa data-depth se pomjeraju pri skrolu (brže što je depth veći)
   * i blago prate miš. Elementi sa data-scroll-only reaguju samo na skrol.
   */
  Effects.parallax = function (root) {
    if (!root || Effects.reducedMotion()) return noop;
    var items = Array.prototype.map.call(root.querySelectorAll('[data-depth]'), function (el) {
      return {
        el: el,
        depth: parseFloat(el.getAttribute('data-depth')) || 0,
        scrollOnly: el.hasAttribute('data-scroll-only')
      };
    });
    if (!items.length) return noop;

    var usePointer = mqFinePointer.matches;
    var tx = 0, ty = 0, mx = 0, my = 0;
    var raf = 0;
    var inView = true;
    var mobileFactor = Effects.isMobile() ? 0.6 : 1;

    function frame() {
      raf = 0;
      if (!inView) return;
      mx += (tx - mx) * 0.07;
      my += (ty - my) * 0.07;
      var sy = window.scrollY || window.pageYOffset || 0;
      for (var i = 0; i < items.length; i++) {
        var it = items[i];
        var x = 0, y;
        if (it.scrollOnly) {
          y = sy * it.depth;
        } else {
          x = mx * it.depth * 34;
          y = my * it.depth * 26 - sy * it.depth * 0.55 * mobileFactor;
        }
        it.el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
      }
      if (Math.abs(tx - mx) > 0.001 || Math.abs(ty - my) > 0.001) schedule();
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    function onPointer(e) {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      schedule();
    }

    window.addEventListener('scroll', schedule, { passive: true });
    if (usePointer) window.addEventListener('pointermove', onPointer, { passive: true });

    var io;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) schedule();
      });
      io.observe(root);
    }
    schedule();

    return function () {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('pointermove', onPointer);
      if (io) io.disconnect();
    };
  };

  /* ------------------------------------------------------------------ */
  /* 3D tilt kartica (samo desktop sa mišem)                              */
  /* ------------------------------------------------------------------ */

  Effects.tilt = function (container, selector) {
    if (!container || !Effects.canTilt()) return noop;
    selector = selector || '.card';
    var active = null;
    var rect = null;
    var raf = 0;
    var px = 0, py = 0;

    function apply() {
      raf = 0;
      if (!active) return;
      active.style.setProperty('--px', px.toFixed(3));
      active.style.setProperty('--py', py.toFixed(3));
    }

    function release(card) {
      if (!card) return;
      card.classList.remove('is-tilting');
      card.style.setProperty('--px', '0');
      card.style.setProperty('--py', '0');
    }

    function onMove(e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      var card = e.target.closest ? e.target.closest(selector) : null;
      if (!card || !container.contains(card)) return;
      if (card !== active) {
        release(active);
        active = card;
        rect = null;
        card.classList.add('is-tilting');
      }
      if (!rect) rect = card.getBoundingClientRect();
      px = Math.max(-1, Math.min(1, ((e.clientX - rect.left) / rect.width) * 2 - 1));
      py = Math.max(-1, Math.min(1, ((e.clientY - rect.top) / rect.height) * 2 - 1));
      if (!raf) raf = requestAnimationFrame(apply);
    }

    function onOut(e) {
      if (!active) return;
      if (e.relatedTarget && active.contains(e.relatedTarget)) return;
      var card = e.target.closest ? e.target.closest(selector) : null;
      if (card === active) {
        release(active);
        active = null;
        rect = null;
      }
    }

    function onScroll() { rect = null; }

    container.addEventListener('pointermove', onMove);
    container.addEventListener('pointerout', onOut);
    window.addEventListener('scroll', onScroll, { passive: true });

    return function () {
      cancelAnimationFrame(raf);
      container.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerout', onOut);
      window.removeEventListener('scroll', onScroll);
      release(active);
    };
  };

  /* ------------------------------------------------------------------ */
  /* Pojavljivanje pri ulasku u ekran (pomak + zamućenje + dim)           */
  /* ------------------------------------------------------------------ */

  Effects.reveal = function (root, smokeColors) {
    if (!root) return noop;
    var els = root.querySelectorAll('[data-reveal]');
    if (Effects.reducedMotion() || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('is-in'); });
      return noop;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add('is-in');
        io.unobserve(el);
        if (el.classList.contains('fsec__head') && Field.ready) {
          var r = el.getBoundingClientRect();
          Field.puff(r.left + 30, r.top + 40, {
            count: 6, colors: smokeColors, alpha: 0.16, r1: [60, 120], life: [1.6, 2.6], speed: [10, 40], spread: 1.2, world: true
          });
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
    return function () { io.disconnect(); };
  };

  /* ------------------------------------------------------------------ */
  /* Naslov koji staje u širinu                                          */
  /* ------------------------------------------------------------------ */

  /**
   * Smanjuje font naslova tako da najduža riječ stane u širinu kontejnera.
   * Riječi moraju biti umotane u <span class="w">. CSS već grubo procjenjuje
   * veličinu (--chars), a ovo je samo fino podešavanje: radi jednom, kad su
   * fontovi učitani, u requestAnimationFrame, i ponovo pri promjeni širine.
   */
  Effects.fitText = function (el) {
    if (!el) return noop;
    var raf = 0;
    var timer = 0;
    var alive = true;
    var lastWidth = window.innerWidth;

    function fit() {
      raf = 0;
      if (!alive) return;
      var words = el.querySelectorAll('.w');
      var avail = el.clientWidth;
      var widest = 0;
      Array.prototype.forEach.call(words, function (w) {
        widest = Math.max(widest, w.offsetWidth);
      });
      if (widest > avail && avail > 0) {
        var current = parseFloat(window.getComputedStyle(el).fontSize);
        el.style.fontSize = Math.floor((current * avail) / widest * 0.98) + 'px';
      }
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(fit);
    }

    function onResize() {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(timer);
      timer = setTimeout(function () {
        el.style.fontSize = '';
        schedule();
      }, 150);
    }

    if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(schedule);
    else schedule();
    window.addEventListener('resize', onResize);

    return function () {
      alive = false;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  };

  MSP.Effects = Effects;
})();
