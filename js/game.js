/*
 * MyShishapedia - Shisha Drop: igra (fizika, crtanje, zvuk, ekrani, rang lista).
 *
 *   - fizika: Verlet sa fiksnim korakom 1/120 s, krugovi, vaza u obliku slova U sa
 *     zaobljenim donjim uglovima; spajanje dvije iste voćke, menta (džoker), led
 *   - crtanje: dva canvasa (statična pozadina i vaza, pa voće i efekti iznad);
 *     svaka voćka je unaprijed nacrtan sprite (js/game-art.js), u igri se samo kopira
 *   - dnevni izazov: isti redoslijed za sve (sjeme iz datuma), jedna partija dnevno;
 *     vježba sa nasumičnim redoslijedom; partija se čuva u localStorage svake 2 s
 *   - rang lista i nadimak preko /api/game/* (lib/game-api.mjs)
 * Ovisi o: game-core.js (MSP.GameCore), game-art.js (MSP.GameArt), strings-game.js (MSP.gt),
 * effects.js (MSP.Effects.Field, da dim stoji dok traje igra).
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var host = document.getElementById('sd');
  if (!host || !MSP || !MSP.GameCore || !MSP.GameArt) return;

  var C = MSP.GameCore;
  var Art = MSP.GameArt;
  var FRUITS = C.FRUITS;
  var TOP = C.TOP;
  var W = C.WORLD.w;
  var H = C.WORLD.h;
  var LINE = C.WORLD.line;
  var doc = document.documentElement;
  var Field = MSP.Effects && MSP.Effects.Field;
  var mqReduce = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  function reduced() { return mqReduce.matches; }
  function g(k, v) { return MSP.gt(k, v); }
  function $(id) { return document.getElementById(id); }
  var LOCALE = { bs: 'bs-BA', en: 'en-GB', de: 'de-DE' }[MSP.lang] || 'en-GB';
  var nf = new Intl.NumberFormat(LOCALE);
  function num(n) { return nf.format(n); }

  /* ------------------------------------------------------------------ */
  /* Spremanje                                                           */
  /* ------------------------------------------------------------------ */

  var K = {
    device: 'msp-sd-device', nick: 'msp-sd-nick', daily: 'msp-sd-daily', stats: 'msp-sd-stats',
    pending: 'msp-sd-pending', sound: 'msp-sd-sound', game: 'msp-sd-game', practice: 'msp-sd-game-p', a2hs: 'msp-sd-a2hs'
  };
  function lsGet(k) {
    try { var v = localStorage.getItem(k); return v == null ? null : JSON.parse(v); } catch (e) { return null; }
  }
  function lsSet(k, v) {
    try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* pun ili zabranjen */ }
  }

  function deviceId() {
    var d = lsGet(K.device);
    if (typeof d === 'string' && /^[a-f0-9]{32}$/.test(d)) return d;
    var a = new Uint8Array(16);
    if (window.crypto && crypto.getRandomValues) crypto.getRandomValues(a);
    else for (var i = 0; i < 16; i++) a[i] = Math.floor(Math.random() * 256);
    d = Array.prototype.map.call(a, function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
    lsSet(K.device, d);
    return d;
  }
  var DEVICE = deviceId();

  /* ------------------------------------------------------------------ */
  /* Server                                                              */
  /* ------------------------------------------------------------------ */

  var online = { api: true };

  function api(action, opts) {
    opts = opts || {};
    var url = '/api/game/' + action + (opts.query ? '?' + new URLSearchParams(opts.query).toString() : '');
    var ctl = window.AbortController ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 9000) : 0;
    return fetch(url, {
      method: opts.body ? 'POST' : 'GET',
      headers: opts.body ? { 'Content-Type': 'application/json' } : {},
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      cache: 'no-store',
      credentials: 'same-origin',
      signal: ctl ? ctl.signal : undefined
    }).then(function (r) {
      clearTimeout(timer);
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (r.status === 503 || r.status === 404) online.api = false;
        else online.api = true;
        return { status: r.status, ok: r.ok, data: data || {} };
      });
    }, function () {
      clearTimeout(timer);
      return { status: 0, ok: false, data: { error: 'network' } };
    });
  }

  // dan po serveru (ako se sat na telefonu razlikuje); bez servera po satu telefona
  var clock = { day: C.dayKey(new Date()), nextAt: Date.now() + C.msToNextDay(new Date()) };
  function today() {
    if (Date.now() >= clock.nextAt) {
      clock.day = C.addDays(clock.day, 1);
      clock.nextAt += 86400000;
    }
    return clock.day;
  }
  function syncDay() {
    return api('today').then(function (r) {
      if (r.ok && C.isDay(r.data.day) && typeof r.data.msToNext === 'number') {
        clock.day = r.data.day;
        clock.nextAt = Date.now() + r.data.msToNext;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Stanje igrača                                                       */
  /* ------------------------------------------------------------------ */

  var player = { nick: lsGet(K.nick) || null };
  function stats() { return lsGet(K.stats) || { best: 0, games: 0 }; }
  function daily() {
    var d = lsGet(K.daily);
    return d && d.day === today() ? d : { day: today(), status: 'new' };
  }

  /* ------------------------------------------------------------------ */
  /* Zvuk: klokotanje vode, napravljeno u browseru (WebAudio)            */
  /* ------------------------------------------------------------------ */

  var Snd = {
    ctx: null, out: null, noise: null, last: 0,
    on: lsGet(K.sound) !== 0,
    unlock: function () {
      if (!Snd.on) return;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        if (!Snd.ctx) {
          Snd.ctx = new AC();
          Snd.out = Snd.ctx.createGain();
          Snd.out.gain.value = 0.55;
          Snd.out.connect(Snd.ctx.destination);
          var len = Math.floor(Snd.ctx.sampleRate * 0.6);
          Snd.noise = Snd.ctx.createBuffer(1, len, Snd.ctx.sampleRate);
          var ch = Snd.noise.getChannelData(0);
          for (var i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
        }
        if (Snd.ctx.state === 'suspended') Snd.ctx.resume();
      } catch (e) { Snd.ctx = null; }
    },
    ready: function () { return Snd.on && Snd.ctx && Snd.ctx.state === 'running'; },
    // jedan mjehurić: kratki ton čija visina brzo raste (tako zvuči mjehur koji izlazi iz vode)
    blip: function (t, f, len, vol) {
      var c = Snd.ctx;
      var o = c.createOscillator();
      var gn = c.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(f, t);
      o.frequency.exponentialRampToValueAtTime(f * 2.1, t + len);
      gn.gain.setValueAtTime(0.0001, t);
      gn.gain.exponentialRampToValueAtTime(vol, t + 0.006);
      gn.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(gn);
      gn.connect(Snd.out);
      o.start(t);
      o.stop(t + len + 0.02);
    },
    // tiho "šuštanje" vode ispod mjehurića
    wash: function (t, freq, len, vol) {
      var c = Snd.ctx;
      var s = c.createBufferSource();
      s.buffer = Snd.noise;
      var f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = freq;
      f.Q.value = 1.4;
      var gn = c.createGain();
      gn.gain.setValueAtTime(vol, t);
      gn.gain.exponentialRampToValueAtTime(0.0001, t + len);
      s.connect(f);
      f.connect(gn);
      gn.connect(Snd.out);
      s.start(t, Math.random() * 0.3, len + 0.05);
    },
    glug: function (level) {
      if (!Snd.ready()) return;
      var t = Snd.ctx.currentTime;
      if (t - Snd.last < 0.045) return;
      Snd.last = t;
      var base = 430 - Math.min(level, 10) * 26;
      var n = level >= 6 ? 4 : 3;
      for (var i = 0; i < n; i++) {
        Snd.blip(t + i * (0.045 + Math.random() * 0.035), base * (0.75 + Math.random() * 0.5), 0.06 + Math.random() * 0.03, 0.22);
      }
      Snd.wash(t, 380 - level * 14, 0.22, 0.09);
    },
    drop: function () {
      if (!Snd.ready()) return;
      var t = Snd.ctx.currentTime;
      Snd.blip(t, 210, 0.08, 0.12);
    },
    golden: function () {
      if (!Snd.ready()) return;
      var t = Snd.ctx.currentTime;
      var c = Snd.ctx;
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        var o = c.createOscillator();
        var gn = c.createGain();
        o.type = 'triangle';
        o.frequency.value = f;
        gn.gain.setValueAtTime(0.0001, t + i * 0.08);
        gn.gain.exponentialRampToValueAtTime(0.16, t + i * 0.08 + 0.02);
        gn.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 0.6);
        o.connect(gn);
        gn.connect(Snd.out);
        o.start(t + i * 0.08);
        o.stop(t + i * 0.08 + 0.65);
      });
      for (var k = 0; k < 7; k++) Snd.blip(t + 0.05 + k * 0.05, 260 + Math.random() * 300, 0.07, 0.15);
    },
    ice: function () {
      if (!Snd.ready()) return;
      var t = Snd.ctx.currentTime;
      for (var i = 0; i < 4; i++) Snd.wash(t + i * 0.04, 3200 + Math.random() * 2000, 0.05, 0.12);
      Snd.blip(t, 900, 0.12, 0.08);
    },
    over: function () {
      if (!Snd.ready()) return;
      var t = Snd.ctx.currentTime;
      for (var i = 0; i < 5; i++) Snd.blip(t + i * 0.11, 320 - i * 40, 0.12, 0.18);
    }
  };

  function buzz(p) {
    if (navigator.vibrate && !reduced()) { try { navigator.vibrate(p); } catch (e) { /* ignore */ } }
  }

  /* ------------------------------------------------------------------ */
  /* DOM                                                                 */
  /* ------------------------------------------------------------------ */

  var sdx = $('sdx');
  var sdm = $('sdm');
  // sloj igre i prozor za nadimak idu na kraj <body>, iznad svega na stranici
  document.body.appendChild(sdx);
  document.body.appendChild(sdm);

  var el = {
    date: $('sd-date'), status: $('sd-status'), best: $('sd-best'), rank: $('sd-rank'), nick: $('sd-nick'), nickBtn: $('sd-nick-btn'),
    play: $('sd-play'), practice: $('sd-practice'), next: $('sd-next'), offline: $('sd-offline'),
    boardList: $('sd-board-list'), boardNote: $('sd-board-note'),
    score: $('sdx-score'), nextCv: $('sdx-next'), rankPill: $('sdx-rankpill'), rankLabel: $('sdx-ranklabel'), rankV: $('sdx-rank'),
    sound: $('sdx-sound'), pauseBtn: $('sdx-pause'), stage: $('sdx-stage'), bg: $('sdx-bg'), fg: $('sdx-fg'), hint: $('sdx-hint'),
    pausePanel: $('sdx-pausepanel'), resume: $('sdx-resume'), quit: $('sdx-quit'), quitNote: $('sdx-quitnote'),
    end: $('sdx-end'), endTitle: $('sdx-endtitle'), endArt: $('sdx-endart'), biggest: $('sdx-biggest'), final: $('sdx-final'),
    record: $('sdx-record'), rankLine: $('sdx-rankline'), miniBoard: $('sdx-board'), a2hs: $('sdx-a2hs'), a2hsLater: $('sdx-a2hs-later'),
    again: $('sdx-again'), againLabel: $('sdx-again-label'), share: $('sdx-share'), close: $('sdx-close'), shareMsg: $('sdx-sharemsg'),
    restart: $('sdx-restart'),
    info: $('sdx-info'), infoPanel: $('sdx-infopanel'), infoClose: $('sdx-info-close'),
    mForm: $('sdm-form'), mInput: $('sdm-input'), mErr: $('sdm-err'), mCancel: $('sdm-cancel'), mSave: $('sdm-save')
  };

  // male slike voća u HTML-u (lanac, vaza na početku, posebni predmeti)
  var iconCache = {};
  function iconCanvas(id, px) {
    var key = id + '|' + px;
    if (!iconCache[key]) iconCache[key] = Art.icon(id, px);
    return iconCache[key];
  }
  function paintArt(scope) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    Array.prototype.forEach.call(scope.querySelectorAll('.sd-art[data-art]'), function (span) {
      if (span.firstChild) return;
      var size = span.getBoundingClientRect().width || 40;
      var px = Math.max(16, Math.round(size * dpr));
      var src = iconCanvas(span.getAttribute('data-art'), px);
      var c = document.createElement('canvas');
      c.width = c.height = px;
      c.getContext('2d').drawImage(src, 0, 0);
      span.appendChild(c);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Fizika                                                              */
  /* ------------------------------------------------------------------ */

  var STEP = 1 / 120;
  var STEP_MS = 1000 / 120;
  var GRAV = 2100;              // jedinica/s²
  var AIR = 0.998;
  var ITER = 4;
  var CORNER = 54;              // poluprečnik zaobljenog dna vaze
  var DROP_Y = -26;             // visina na kojoj voćka visi prije pada
  var VIEW_TOP = -84;
  var PADX = 20;
  var PADB = 22;
  var ICE_REACH = 92;
  var ICE_MAX = 3;
  var MAX_UP = 7;               // najveća brzina prema gore po koraku (odskok poslije spajanja ostaje nizak)
  var MAX_V = 26;               // najveća brzina po koraku (jedinica), da ništa ne "proleti"

  function radiusOf(kind) { return kind <= TOP ? FRUITS[kind].r : C.SPECIAL_R[kind]; }
  function idOf(kind) { return kind <= TOP ? FRUITS[kind].id : kind === C.MINT ? 'mint' : kind === C.ICE ? 'ice' : 'golden'; }
  function colorOf(kind) { return kind <= TOP ? FRUITS[kind].color : kind === C.MINT ? '#5fd38a' : '#bfe8ff'; }

  var game = null;   // trenutna partija
  var bodies = [];   // voće u vazi
  var merges = [];   // parovi za spajanje u ovom koraku

  function newBody(kind, x, y, born, r0) {
    var rt = radiusOf(kind);
    return {
      kind: kind, x: x, y: y, px: x, py: y, a: 0, pa: 0,
      r: r0 || rt, rt: rt, m: rt * rt, born: born,
      dead: false, trig: -1, touched: false, floor: false, contact: false
    };
  }

  function wall(b) {
    var r = b.r;
    b.floor = false;
    if (r < CORNER) {
      var cy = H - CORNER;
      if (b.y > cy) {
        var cx = b.x < CORNER ? CORNER : b.x > W - CORNER ? W - CORNER : -1;
        if (cx >= 0) {
          var dx = b.x - cx, dy = b.y - cy;
          var d = Math.sqrt(dx * dx + dy * dy);
          var lim = CORNER - r;
          if (d > lim) {
            b.x = cx + dx / d * lim;
            b.y = cy + dy / d * lim;
            b.floor = true;
          }
          return;
        }
      }
    }
    if (b.x < r) b.x = r;
    else if (b.x > W - r) b.x = W - r;
    if (b.y > H - r) { b.y = H - r; b.floor = true; }
  }

  function sortBodies() {
    // skoro sortirano iz prošlog koraka, pa je insertion sort najbrži
    for (var i = 1; i < bodies.length; i++) {
      var b = bodies[i];
      var key = b.x - b.r;
      var j = i - 1;
      while (j >= 0 && bodies[j].x - bodies[j].r > key) { bodies[j + 1] = bodies[j]; j--; }
      bodies[j + 1] = b;
    }
  }

  function collide(last) {
    var n = bodies.length;
    for (var i = 0; i < n; i++) {
      var a = bodies[i];
      if (a.dead) continue;
      var right = a.x + a.r;
      for (var j = i + 1; j < n; j++) {
        var b = bodies[j];
        if (b.x - b.r > right) break;
        if (b.dead) continue;
        var dx = b.x - a.x, dy = b.y - a.y;
        var rr = a.r + b.r;
        var d2 = dx * dx + dy * dy;
        if (d2 >= rr * rr) continue;
        a.touched = b.touched = true;
        a.contact = b.contact = true;
        // spajanje: dvije iste voćke, ili menta sa voćkom; led reaguje na prvi dodir
        if (a.kind === b.kind && a.kind <= TOP) { merges.push(a, b); a.dead = b.dead = true; continue; }
        if (a.kind === C.MINT && b.kind <= TOP) { merges.push(a, b); a.dead = b.dead = true; continue; }
        if (b.kind === C.MINT && a.kind <= TOP) { merges.push(b, a); a.dead = b.dead = true; continue; }
        if (a.kind === C.ICE && a.trig < 0) a.trig = game.sim;
        if (b.kind === C.ICE && b.trig < 0) b.trig = game.sim;
        var d = Math.sqrt(d2) || 0.0001;
        var nx = dx / d, ny = dy / d;
        var over = (rr - d) * 0.9;
        var im = 1 / (a.m + b.m);
        var ka = over * b.m * im, kb = over * a.m * im;
        a.x -= nx * ka; a.y -= ny * ka;
        b.x += nx * kb; b.y += ny * kb;
        if (last) {
          // trenje u dodiru: smanji klizanje jedne voćke po drugoj (stabilnije gomile)
          var rvx = (b.x - b.px) - (a.x - a.px), rvy = (b.y - b.py) - (a.y - a.py);
          var vn = rvx * nx + rvy * ny;
          var tx = rvx - vn * nx, ty = rvy - vn * ny;
          var f = 0.12;
          a.px -= tx * f * b.m * im; a.py -= ty * f * b.m * im;
          b.px += tx * f * a.m * im; b.py += ty * f * a.m * im;
        }
      }
    }
  }

  function step() {
    var gg = GRAV * STEP * STEP;
    var i, b;
    for (i = 0; i < bodies.length; i++) {
      b = bodies[i];
      if (b.r < b.rt) b.r = Math.min(b.rt, b.r + b.rt * STEP * 5);
      var vx = (b.x - b.px) * AIR, vy = (b.y - b.py) * AIR + gg;
      if (vy > MAX_V) vy = MAX_V;
      if (vx > MAX_V) vx = MAX_V; else if (vx < -MAX_V) vx = -MAX_V;
      b.px = b.x; b.py = b.y; b.pa = b.a;
      b.x += vx; b.y += vy;
      b.contact = false;
    }
    sortBodies();
    for (var it = 0; it < ITER; it++) {
      collide(it === ITER - 1);
      for (i = 0; i < bodies.length; i++) wall(bodies[i]);
    }
    for (i = 0; i < bodies.length; i++) {
      b = bodies[i];
      if (b.y - b.py < -MAX_UP) b.py = b.y + MAX_UP;    // najveća brzina prema gore
      if (b.floor) b.px = b.x - (b.x - b.px) * 0.86;   // trenje o dno
      b.a += (b.x - b.px) / b.r * 0.9;                  // kotrljanje
      if (b.kind === C.ICE && b.trig < 0 && (b.floor || b.touched)) b.trig = game.sim;
    }
    game.sim += STEP_MS;
    if (merges.length) resolveMerges();
    resolveIce();
    // ukloni nestale
    for (i = bodies.length - 1; i >= 0; i--) if (bodies[i].dead) bodies.splice(i, 1);
    danger();
  }

  function addPoints(pts, x, y, big) {
    game.score += pts;
    popup('+' + pts, x, y, big ? 1.5 : 1, big ? '#ffd36b' : '#fff4e2');
  }

  function comboHit() {
    if (game.sim - game.lastMerge <= C.COMBO_WINDOW_MS) game.combo++;
    else game.combo = 1;
    game.lastMerge = game.sim;
    if (game.combo >= 2) comboText(game.combo);
    return game.combo;
  }

  function resolveMerges() {
    for (var i = 0; i < merges.length; i += 2) {
      var a = merges[i], b = merges[i + 1];
      var x, y, lvl, combo, pts;
      if (a.kind === C.MINT) {
        // menta: voćka b postaje sljedeća u lancu
        x = b.x; y = b.y; lvl = b.kind + 1;
        burst(a.x, a.y, colorOf(C.MINT), 10);
        popup(g('fx.mint'), a.x, a.y - 26, 0.9, '#9ff0bd');
      } else {
        x = (a.x + b.x) / 2; y = (a.y + b.y) / 2; lvl = a.kind + 1;
      }
      game.merges++;
      combo = comboHit();
      if (lvl > TOP) {
        // dvije lubenice (ili menta i lubenica): Zlatna nargila, obje nestaju
        game.golden++;
        pts = C.mergePoints('golden', combo);
        addPoints(pts, x, y - 30, true);
        golden(x, y);
        continue;
      }
      pts = C.mergePoints(lvl, combo);
      addPoints(pts, x, y - radiusOf(lvl) * 0.6, lvl >= 7);
      if (lvl > game.maxLevel) game.maxLevel = lvl;
      var nb = newBody(lvl, x, y, game.sim, Math.max(a.r, b.r));
      nb.px = x - ((a.x - a.px) + (b.x - b.px)) / 2;
      nb.py = y - ((a.y - a.py) + (b.y - b.py)) / 2;
      nb.a = nb.pa = a.a;
      bodies.push(nb);
      juice(x, y, lvl);
      Snd.glug(lvl);
      buzz(lvl >= 6 ? 22 : 12);
    }
    merges.length = 0;
  }

  function resolveIce() {
    for (var i = 0; i < bodies.length; i++) {
      var ice = bodies[i];
      if (ice.kind !== C.ICE || ice.dead || ice.trig < 0 || game.sim - ice.trig < 180) continue;
      ice.dead = true;
      var near = [];
      for (var j = 0; j < bodies.length; j++) {
        var b = bodies[j];
        if (b.dead || b.kind > TOP) continue;
        var dx = b.x - ice.x, dy = b.y - ice.y;
        var d = Math.sqrt(dx * dx + dy * dy) - b.r;
        if (d < ICE_REACH) near.push({ b: b, d: d });
      }
      near.sort(function (p, q) { return p.b.kind - q.b.kind || p.d - q.d; });
      var n = Math.min(ICE_MAX, near.length);
      for (var k = 0; k < n; k++) {
        var f = near[k].b;
        f.dead = true;
        game.iced++;
        frost(f.x, f.y, f.r);
        addPoints(C.ICE_POINTS, f.x, f.y - 10, false);
      }
      frost(ice.x, ice.y, ICE_REACH * 0.7);
      popup(g('fx.ice'), ice.x, ice.y - 30, 1, '#cdeeff');
      Snd.ice();
      buzz(14);
    }
  }

  function danger() {
    var over = false;
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (b.dead || b.y - b.r >= LINE || game.sim - b.born <= 1000) continue;
      var sp = Math.abs(b.x - b.px) + Math.abs(b.y - b.py);
      if ((b.contact || b.floor) && sp < 0.8) { over = true; break; }
    }
    if (over) {
      game.danger += STEP_MS;
      if (game.danger >= C.DANGER_MS) gameOver();
    } else {
      game.danger = 0;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Efekti (sok, mjehurići, natpisi), iz bazena da nema smeća u memoriji */
  /* ------------------------------------------------------------------ */

  var PMAX = 220;
  var parts = [];
  for (var pi = 0; pi < PMAX; pi++) parts.push({ on: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, r: 1, c: '#fff', kind: 0 });
  var pops = [];
  for (var qi = 0; qi < 12; qi++) pops.push({ on: false, x: 0, y: 0, t: 0, s: 1, text: '', c: '#fff' });
  var quality = 1; // 1 puno efekata, 0.5 manje (slabiji telefoni)

  function spawn(x, y, vx, vy, life, r, c, kind) {
    for (var i = 0; i < PMAX; i++) {
      var p = parts[i];
      if (p.on) continue;
      p.on = true; p.x = x; p.y = y; p.vx = vx; p.vy = vy; p.life = 0; p.max = life; p.r = r; p.c = c; p.kind = kind;
      return;
    }
  }

  function juice(x, y, lvl) {
    if (reduced()) return;
    var n = Math.round((10 + lvl * 2) * quality);
    var c = colorOf(lvl);
    var R = radiusOf(lvl);
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2;
      var s = 120 + Math.random() * 260;
      spawn(x + Math.cos(a) * R * 0.5, y + Math.sin(a) * R * 0.5, Math.cos(a) * s, Math.sin(a) * s - 120, 0.45 + Math.random() * 0.35, 2.5 + Math.random() * 3.5, c, 0);
    }
    var nb = Math.round(5 * quality);
    for (var k = 0; k < nb; k++) spawn(x + (Math.random() - 0.5) * R, y, (Math.random() - 0.5) * 30, -60 - Math.random() * 80, 0.9 + Math.random() * 0.6, 3 + Math.random() * 4, 'rgba(255,255,255,0.7)', 1);
  }
  function burst(x, y, c, n) {
    if (reduced()) return;
    n = Math.round(n * quality);
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, s = 80 + Math.random() * 160;
      spawn(x, y, Math.cos(a) * s, Math.sin(a) * s - 60, 0.5 + Math.random() * 0.3, 2 + Math.random() * 2.5, c, 0);
    }
  }
  function frost(x, y, r) {
    if (reduced()) return;
    var n = Math.round(12 * quality);
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, s = 40 + Math.random() * 120;
      spawn(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, Math.cos(a) * s, Math.sin(a) * s - 40, 0.6 + Math.random() * 0.4, 2 + Math.random() * 2.5, i % 2 ? '#e8f7ff' : '#9fd8ff', 2);
    }
  }
  var flash = { t: 0, x: 0, y: 0 };
  function golden(x, y) {
    flash.t = 1; flash.x = x; flash.y = y;
    popup(g('fx.golden'), x, y - 80, 1.6, '#ffd36b');
    Snd.golden();
    buzz([30, 40, 60]);
    shake(9);
    if (reduced()) return;
    var n = Math.round(46 * quality);
    for (var i = 0; i < n; i++) {
      var a = Math.random() * Math.PI * 2, s = 140 + Math.random() * 340;
      spawn(x, y, Math.cos(a) * s, Math.sin(a) * s - 160, 0.8 + Math.random() * 0.6, 2.5 + Math.random() * 4, i % 3 ? '#ffcc4d' : '#fff1b8', 0);
    }
  }

  var lastPop = null;
  function popup(text, x, y, s, c) {
    var best = pops[0];
    for (var i = 0; i < pops.length; i++) {
      if (!pops[i].on) { best = pops[i]; break; }
      if (pops[i].t > best.t) best = pops[i];
    }
    best.combo = false;
    lastPop = best;
    best.on = true; best.text = text; best.x = Math.max(40, Math.min(W - 40, x)); best.y = y; best.t = 0; best.s = s; best.c = c;
  }
  // combo ima jedan natpis koji se samo osvježi (da se ×2, ×3... ne preklapaju)
  var comboPop = null;
  function comboText(n) {
    var text = g('fx.combo', { n: n });
    var s = 1.25 + Math.min(n, 6) * 0.06;
    if (comboPop && comboPop.on && comboPop.combo) { comboPop.text = text; comboPop.t = 0.12; comboPop.s = s; return; }
    popup(text, W / 2, LINE + 40, s, '#ffb347');
    comboPop = lastPop;
    comboPop.combo = true;
  }

  var shakeAmt = 0;
  function shake(n) { if (!reduced()) shakeAmt = Math.max(shakeAmt, n); }

  // mjehurići u vodi (samo ukras)
  var bubbles = [];
  for (var bi = 0; bi < 16; bi++) bubbles.push({ x: Math.random() * W, y: H * (0.3 + Math.random() * 0.7), r: 1.5 + Math.random() * 3.5, v: 18 + Math.random() * 40, w: Math.random() * 6 });
  var WATER_TOP = 150;

  /* ------------------------------------------------------------------ */
  /* Crtanje                                                             */
  /* ------------------------------------------------------------------ */

  var bgx = el.bg.getContext('2d');
  var fgx = el.fg.getContext('2d');
  var view = { cssW: 0, cssH: 0, dpr: 1, s: 1, ox: 0, oy: 0, S: 1, dx: 0, dy: 0 };
  // oštrina: najviše 2x (2.5x na velikim ekranima); slabiji telefoni (malo jezgri ili memorije) počinju sa 1.5x
  var weak = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 3);
  var dprCap = Math.min(window.devicePixelRatio || 1, weak ? 1.5 : (window.devicePixelRatio || 1) > 2.5 && Math.min(screen.width, screen.height) >= 400 ? 2.5 : 2);
  var sprites = {};
  var lights = {};
  var font = (getComputedStyle(doc).getPropertyValue('--font-display') || 'system-ui').trim();
  var gradLine = null;

  function resize(onlyDpr) {
    var r = el.stage.getBoundingClientRect();
    var cssW = Math.max(1, Math.round(r.width));
    var cssH = Math.max(1, Math.round(r.height));
    var dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    if (cssW === view.cssW && cssH === view.cssH && dpr === view.dpr) return;
    if (cssW !== view.cssW || cssH !== view.cssH) onlyDpr = false;
    view.cssW = cssW; view.cssH = cssH; view.dpr = dpr;
    var vw = W + PADX * 2, vh = H - VIEW_TOP + PADB;
    view.s = Math.min(cssW / vw, cssH / vh);
    view.ox = (cssW - vw * view.s) / 2 + PADX * view.s;      // css px gdje je x=0 svijeta
    view.oy = (cssH - vh * view.s) / 2 - VIEW_TOP * view.s;  // css px gdje je y=0 svijeta
    view.S = view.s * dpr;
    view.dx = view.ox * dpr;
    view.dy = view.oy * dpr;
    el.fg.width = Math.round(cssW * dpr);
    el.fg.height = Math.round(cssH * dpr);
    if (!onlyDpr) {
      // pozadina se crta samo kad se promijeni veličina ekrana; pri smanjenju oštrine ostaje ista
      el.bg.width = el.fg.width;
      el.bg.height = el.fg.height;
      view.bgS = view.S; view.bgDx = view.dx; view.bgDy = view.dy; view.bgDpr = dpr;
      drawBackground();
    }
    var nc = el.nextCv;
    var npx = Math.round(nc.getBoundingClientRect().width * dpr) || 40;
    if (nc.width !== npx) { nc.width = nc.height = npx; }
    nextShown = -1;
  }

  // Sprite se pravi jednom za veličinu na ekranu. Ako je postojeći malo veći (npr. poslije smanjenja
  // oštrine), koristi se umanjen, bez ponovnog crtanja; novi se pravi samo kad bi slika bila mutna.
  function fits(s, rpx) { return s && s.rpx >= rpx && s.rpx <= rpx * 1.6; }
  function spriteFor(kind) {
    var rpx = Math.max(2, Math.round(radiusOf(kind) * view.S));
    var s = sprites[kind];
    if (!fits(s, rpx)) {
      s = Art.sprite(idOf(kind), rpx);
      s.rpx = rpx;
      sprites[kind] = s;
    }
    s.k = rpx / s.rpx;
    return s;
  }
  function lightFor(kind) {
    var rpx = Math.max(2, Math.round(radiusOf(kind) * view.S));
    var s = lights[kind];
    if (!fits(s, rpx)) {
      s = Art.light(rpx);
      s.rpx = rpx;
      lights[kind] = s;
    }
    s.k = rpx / s.rpx;
    return s;
  }
  function warmSprites() {
    for (var k = 0; k <= TOP; k++) { spriteFor(k); lightFor(k); }
    spriteFor(C.MINT); spriteFor(C.ICE);
  }

  function vasePath(ctx, inset) {
    var t = -inset;
    var R = CORNER + inset;
    ctx.beginPath();
    ctx.moveTo(t, -6);
    ctx.lineTo(t, H - CORNER);
    ctx.arc(CORNER, H - CORNER, Math.max(1, R), Math.PI, Math.PI / 2, true);
    ctx.lineTo(W - CORNER, H - t);
    ctx.arc(W - CORNER, H - CORNER, Math.max(1, R), Math.PI / 2, 0, true);
    ctx.lineTo(W - t, -6);
  }

  function drawBackground() {
    var c = bgx, w = el.bg.width, h = el.bg.height, S = view.bgS;
    c.setTransform(1, 0, 0, 1, 0, 0);
    // tamni bar: topla svjetlost iza vaze
    var bg = c.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#120c09');
    bg.addColorStop(0.55, '#1b120c');
    bg.addColorStop(1, '#0d0907');
    c.fillStyle = bg;
    c.fillRect(0, 0, w, h);
    var glow = c.createRadialGradient(w / 2, view.bgDy + H * 0.55 * S, 10, w / 2, view.bgDy + H * 0.55 * S, Math.max(w, h) * 0.75);
    glow.addColorStop(0, 'rgba(242,163,60,0.30)');
    glow.addColorStop(0.45, 'rgba(217,100,63,0.10)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = glow;
    c.fillRect(0, 0, w, h);
    // mutna svjetla bara u daljini
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (var i = 0; i < 14; i++) {
      var bx = rnd() * w, by = rnd() * h * 0.7, br = (12 + rnd() * 46) * view.bgDpr;
      var bgr = c.createRadialGradient(bx, by, 0, bx, by, br);
      var warm = rnd() > 0.35;
      bgr.addColorStop(0, warm ? 'rgba(255,170,80,0.16)' : 'rgba(255,120,90,0.10)');
      bgr.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = bgr;
      c.fillRect(bx - br, by - br, br * 2, br * 2);
    }

    c.setTransform(S, 0, 0, S, view.bgDx, view.bgDy);
    // sjena ispod vaze
    var sh = c.createRadialGradient(W / 2, H + 18, 10, W / 2, H + 18, W * 0.62);
    sh.addColorStop(0, 'rgba(0,0,0,0.55)');
    sh.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = sh;
    c.fillRect(-60, H - 30, W + 120, 80);
    // unutrašnjost vaze: tamno staklo, voda od WATER_TOP naniže
    vasePath(c, 0);
    c.closePath();
    var inner = c.createLinearGradient(0, 0, 0, H);
    inner.addColorStop(0, 'rgba(255,236,210,0.035)');
    inner.addColorStop(1, 'rgba(255,236,210,0.07)');
    c.fillStyle = inner;
    c.fill();
    c.save();
    vasePath(c, 0);
    c.closePath();
    c.clip();
    var water = c.createLinearGradient(0, WATER_TOP, 0, H);
    water.addColorStop(0, 'rgba(140,190,200,0.10)');
    water.addColorStop(0.5, 'rgba(242,163,60,0.10)');
    water.addColorStop(1, 'rgba(217,100,63,0.16)');
    c.fillStyle = water;
    c.fillRect(-10, WATER_TOP, W + 20, H - WATER_TOP + 10);
    c.fillStyle = 'rgba(255,230,190,0.22)';
    c.fillRect(-10, WATER_TOP - 1.5, W + 20, 2);
    c.restore();
    // staklo: debeli zid sa svjetlom na rubovima
    c.lineJoin = 'round';
    vasePath(c, 5);
    c.strokeStyle = 'rgba(255,240,220,0.18)';
    c.lineWidth = 10;
    c.stroke();
    vasePath(c, 9.5);
    c.strokeStyle = 'rgba(255,240,220,0.35)';
    c.lineWidth = 1.4;
    c.stroke();
    vasePath(c, 0.6);
    c.strokeStyle = 'rgba(255,214,150,0.45)';
    c.lineWidth = 1.2;
    c.stroke();
    // rub vaze gore
    var lip = c.createLinearGradient(-14, 0, W + 14, 0);
    lip.addColorStop(0, 'rgba(242,163,60,0.9)');
    lip.addColorStop(0.5, 'rgba(255,224,160,0.95)');
    lip.addColorStop(1, 'rgba(242,163,60,0.9)');
    c.fillStyle = lip;
    roundRect(c, -14, -10, 18, 8, 4); c.fill();
    roundRect(c, W - 4, -10, 18, 8, 4); c.fill();
    // zlatni prsten pri dnu (kao baza nargile)
    c.fillStyle = 'rgba(242,163,60,0.55)';
    roundRect(c, W * 0.22, H + 8, W * 0.56, 5, 2.5); c.fill();
    gradLine = null;
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r);
    c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r);
    c.arcTo(x, y, x + w, y, r);
    c.closePath();
  }

  function drawFruit(c, kind, x, y, a, scale, alpha) {
    var S = view.S;
    var dx = view.dx + x * S, dy = view.dy + y * S;
    var sp = spriteFor(kind);
    if (alpha !== 1) c.globalAlpha = alpha;
    var k = scale * sp.k;
    var cs = Math.cos(a) * k, sn = Math.sin(a) * k;
    c.setTransform(cs, sn, -sn, cs, dx, dy);
    c.drawImage(sp.canvas, -sp.half, -sp.half);
    if (kind <= TOP) {
      var l = lightFor(kind);
      var kl = scale * l.k;
      c.setTransform(kl, 0, 0, kl, dx, dy);
      c.drawImage(l.canvas, -l.half, -l.half);
    }
    if (alpha !== 1) c.globalAlpha = 1;
  }

  function aimTarget(x, r) {
    // gdje bi voćka udarila: najviša voćka ispod nišana, inače dno
    var best = H - r;
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      var dx = Math.abs(b.x - x), rr = b.r + r;
      if (dx >= rr) continue;
      var y = b.y - Math.sqrt(rr * rr - dx * dx);
      if (y < best) best = y;
    }
    return best;
  }

  var nextShown = -1;
  function drawNext() {
    var k = game ? game.queue[game.drops + 1] : -1;
    if (k === nextShown) return;
    nextShown = k;
    var c = el.nextCv.getContext('2d');
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, el.nextCv.width, el.nextCv.height);
    if (k == null || k < 0) return;
    c.drawImage(iconCanvas(idOf(k), el.nextCv.width), 0, 0);
  }

  function render(alpha, dt) {
    var c = fgx, S = view.S, i, b;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, el.fg.width, el.fg.height);
    var rm = reduced();

    // mjehurići u vodi (iza voća)
    if (!rm) {
      c.setTransform(S, 0, 0, S, view.dx, view.dy);
      c.beginPath();
      for (i = 0; i < bubbles.length; i++) {
        var u = bubbles[i];
        if (running()) {
          u.y -= u.v * dt;
          u.w += dt * 2;
          if (u.y < WATER_TOP + 6) { u.y = H - 6; u.x = 12 + Math.random() * (W - 24); }
        }
        var ux = u.x + Math.sin(u.w) * 3;
        c.moveTo(ux + u.r, u.y);
        c.arc(ux, u.y, u.r, 0, Math.PI * 2);
      }
      c.strokeStyle = 'rgba(255,240,220,0.32)';
      c.lineWidth = 1;
      c.stroke();
    }

    // linija kraja: pulsira dok je voće iznad nje
    c.setTransform(S, 0, 0, S, view.dx, view.dy);
    var dang = game ? game.danger : 0;
    var lineA = 0.35, lineW = 1.6;
    if (dang > 0) {
      var warn = dang < C.WARN_MS;
      var speed = warn ? 0.006 : 0.02;
      var pulse = rm ? 1 : (0.5 + 0.5 * Math.sin(performance.now() * speed));
      lineA = warn ? 0.5 + 0.5 * pulse : 0.75 + 0.25 * pulse;
      lineW = warn ? 2.2 : 3.2;
      c.fillStyle = 'rgba(255,60,50,' + (0.06 + 0.1 * pulse).toFixed(3) + ')';
      c.fillRect(0, 0, W, LINE);
    }
    c.setLineDash([10, 8]);
    c.strokeStyle = 'rgba(255,72,60,' + lineA.toFixed(3) + ')';
    c.lineWidth = lineW;
    c.beginPath();
    c.moveTo(4, LINE);
    c.lineTo(W - 4, LINE);
    c.stroke();

    // nišan: isprekidana linija pada i voćka koja visi
    if (game && (game.state === 'play' || game.state === 'pause')) {
      var k = game.queue[game.drops];
      var r = radiusOf(k);
      var ready = game.sim >= game.nextDrop;
      var ax = clampAim(game.aim, r);
      if (ready) {
        var ty = aimTarget(ax, r);
        c.setLineDash([4, 7]);
        c.strokeStyle = 'rgba(255,236,210,0.5)';
        c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(ax, DROP_Y + r);
        c.lineTo(ax, ty + r);
        c.stroke();
      }
      c.setLineDash([]);
      var grow = ready ? Math.min(1, (game.sim - game.nextDrop) / 120 + 0.6) : 0;
      if (grow > 0) drawFruit(c, k, ax, DROP_Y, 0, grow, 1);
    }
    c.setLineDash([]);

    // voće
    for (i = 0; i < bodies.length; i++) {
      b = bodies[i];
      var x = b.px + (b.x - b.px) * alpha;
      var y = b.py + (b.y - b.py) * alpha;
      var ang = b.pa + (b.a - b.pa) * alpha;
      var sc = b.r / b.rt;
      if (b.kind === C.ICE && b.trig >= 0) sc *= 1 + Math.min(1, (game.sim - b.trig) / 180) * 0.25;
      drawFruit(c, b.kind, x, y, ang, sc, 1);
    }

    // prednje staklo: dva odsjaja preko voća
    c.setTransform(S, 0, 0, S, view.dx, view.dy);
    if (!gradLine) {
      gradLine = c.createLinearGradient(0, 0, 0, H);
      gradLine.addColorStop(0, 'rgba(255,255,255,0)');
      gradLine.addColorStop(0.25, 'rgba(255,255,255,0.10)');
      gradLine.addColorStop(0.8, 'rgba(255,255,255,0.05)');
      gradLine.addColorStop(1, 'rgba(255,255,255,0)');
    }
    c.fillStyle = gradLine;
    c.fillRect(8, 30, 7, H - 90);
    c.fillRect(W - 22, 60, 4, H - 160);

    // čestice
    var any = false;
    for (i = 0; i < PMAX; i++) {
      var p = parts[i];
      if (!p.on) continue;
      any = true;
      p.life += dt;
      if (p.life >= p.max) { p.on = false; continue; }
      if (p.kind === 1) { p.vy -= 30 * dt; p.vx *= 0.98; } else { p.vy += 900 * dt; p.vx *= 0.985; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      var fa = 1 - p.life / p.max;
      c.globalAlpha = fa;
      c.fillStyle = p.c;
      c.beginPath();
      if (p.kind === 1) {
        c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        c.strokeStyle = p.c;
        c.lineWidth = 1;
        c.stroke();
      } else {
        c.arc(p.x, p.y, p.r * (0.6 + fa * 0.4), 0, Math.PI * 2);
        c.fill();
      }
    }
    c.globalAlpha = 1;

    // bljesak Zlatne nargile
    if (flash.t > 0) {
      var fr = (1 - flash.t) * 260 + 40;
      c.globalAlpha = flash.t * 0.8;
      c.strokeStyle = '#ffd36b';
      c.lineWidth = 6 * flash.t + 1;
      c.beginPath();
      c.arc(flash.x, flash.y, fr, 0, Math.PI * 2);
      c.stroke();
      c.globalAlpha = 1;
      flash.t = Math.max(0, flash.t - dt * 1.6);
    }

    // natpisi (bodovi, combo)
    for (i = 0; i < pops.length; i++) {
      var q = pops[i];
      if (!q.on) continue;
      q.t += dt;
      var life = 1.1;
      if (q.t >= life) { q.on = false; continue; }
      var pr = q.t / life;
      var yy = q.y - (rm ? 0 : pr * 46);
      var size = 22 * q.s * (rm ? 1 : (pr < 0.12 ? 0.6 + pr / 0.12 * 0.4 : 1));
      c.globalAlpha = pr > 0.65 ? 1 - (pr - 0.65) / 0.35 : 1;
      c.font = '800 ' + size.toFixed(1) + 'px ' + font;
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      c.fillStyle = 'rgba(20,10,4,0.75)';
      c.fillText(q.text, q.x + 1.5, yy + 2);
      c.fillStyle = q.c;
      c.fillText(q.text, q.x, yy);
    }
    c.globalAlpha = 1;

    if (shakeAmt > 0.2) {
      var sx = (Math.random() - 0.5) * shakeAmt, sy = (Math.random() - 0.5) * shakeAmt;
      el.stage.style.transform = 'translate(' + sx.toFixed(1) + 'px,' + sy.toFixed(1) + 'px)';
      shakeAmt *= 0.86;
      if (shakeAmt <= 0.2) el.stage.style.transform = '';
    }
    return any;
  }

  /* ------------------------------------------------------------------ */
  /* Petlja                                                              */
  /* ------------------------------------------------------------------ */

  var jsTime = { sum: 0, n: 0, max: 0 }; // koliko JavaScript igre troši po kadru (za mjerenje)
  var loop = { raf: 0, last: 0, acc: 0, on: false, ema: 16.7, slow: 0, frames: 0 };
  function running() { return game && game.state === 'play'; }

  function frame(now) {
    if (!loop.on) return;
    loop.raf = requestAnimationFrame(frame);
    var t0 = performance.now();
    var dtms = now - loop.last;
    loop.last = now;
    if (dtms > 250) dtms = STEP_MS; // poslije pauze ili zastoja ne "sustiži" vrijeme
    var steps = 0;
    if (running()) {
      loop.acc += dtms;
      while (loop.acc >= STEP_MS && steps < 6) {
        step();
        loop.acc -= STEP_MS;
        steps++;
        if (!running()) break;
      }
      if (steps === 6) loop.acc = 0;
      if (game && game.pendingDrop && game.state === 'play' && game.sim >= game.nextDrop) drop();
    }
    var alpha = running() ? loop.acc / STEP_MS : 1;
    render(alpha, Math.min(dtms, 50) / 1000);
    hud();
    quality_(dtms);
    if (game && game.state === 'play' && now - game.savedAt > 2000) save();
    // na pauzi i nakon kraja (kad se efekti smire) petlja staje, da ne troši bateriju
    if (!game || game.state === 'pause' || (game.state === 'over' && now - game.overAt > 2500)) stopLoop();
    var js = performance.now() - t0;
    jsTime.sum += js; jsTime.n++; if (js > jsTime.max) jsTime.max = js;
  }

  // ako telefon ne stiže 60 fps, smanji oštrinu i efekte (bez da igra zastajkuje)
  function quality_(dtms) {
    if (!running()) return;
    loop.ema = loop.ema * 0.95 + dtms * 0.05;
    loop.frames++;
    if (loop.frames < 90) return;
    if (loop.ema > 22) loop.slow++; else loop.slow = Math.max(0, loop.slow - 1);
    if (loop.slow > 60) {
      loop.slow = 0;
      loop.frames = 0;
      if (quality > 0.5) quality = 0.5;
      else if (view.dpr > 1.25) { dprCap = Math.max(1, view.dpr - 0.5); resize(true); }
    }
  }

  function startLoop() {
    if (loop.on) return;
    loop.on = true;
    loop.last = performance.now();
    loop.acc = 0;
    loop.raf = requestAnimationFrame(frame);
  }
  function stopLoop() {
    loop.on = false;
    cancelAnimationFrame(loop.raf);
  }

  /* ------------------------------------------------------------------ */
  /* HUD                                                                 */
  /* ------------------------------------------------------------------ */

  var hudLast = { score: -1, rank: '' };
  var boardScores = null; // današnji top rezultati (za "uživo" mjesto na listi)
  function liveRank(score) {
    if (!boardScores) return '-';
    var n = 0;
    for (var i = 0; i < boardScores.length; i++) if (boardScores[i] > score) n++;
    if (n >= 50) return '50+';
    return '#' + (n + 1);
  }
  function hud() {
    if (!game) return;
    if (game.score !== hudLast.score) {
      hudLast.score = game.score;
      el.score.textContent = num(game.score);
      if (game.mode === 'daily') {
        var rk = liveRank(game.score);
        if (rk !== hudLast.rank) { hudLast.rank = rk; el.rankV.textContent = rk; }
      }
    }
    drawNext();
  }

  /* ------------------------------------------------------------------ */
  /* Partija                                                             */
  /* ------------------------------------------------------------------ */

  function clampAim(x, r) { return Math.max(r + 1, Math.min(W - r - 1, x)); }

  function newGame(mode) {
    var day = today();
    var seed = mode === 'daily' ? C.dailySeed(day) : (Math.random() * 4294967296) >>> 0;
    return {
      v: 1, mode: mode, day: day, seed: seed, queue: C.makeQueue(seed),
      drops: 0, score: 0, merges: 0, golden: 0, maxLevel: 0, iced: 0,
      sim: 0, combo: 0, lastMerge: -99999, danger: 0, nextDrop: 0, aim: W / 2,
      state: 'play', pendingDrop: false, savedAt: 0, open: true
    };
  }

  function save() {
    if (!game) return;
    game.savedAt = performance.now();
    var key = game.mode === 'daily' ? K.game : K.practice;
    if (game.state === 'over') { lsSet(key, null); return; }
    var list = [];
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      if (b.dead) continue;
      list.push([b.kind, Math.round(b.x * 10) / 10, Math.round(b.y * 10) / 10, Math.round(b.a * 100) / 100]);
    }
    lsSet(key, {
      v: 1, mode: game.mode, day: game.day, seed: game.seed, drops: game.drops, score: game.score, merges: game.merges,
      golden: game.golden, maxLevel: game.maxLevel, iced: game.iced, sim: Math.round(game.sim), aim: Math.round(game.aim),
      bodies: list, open: !!game.open
    });
  }

  function load(mode) {
    var s = lsGet(mode === 'daily' ? K.game : K.practice);
    if (!s || s.v !== 1 || !Array.isArray(s.bodies) || typeof s.seed !== 'number') return null;
    if (mode === 'daily' && s.day !== today()) return null;
    var gm = newGame(mode);
    ['day', 'seed', 'drops', 'score', 'merges', 'golden', 'maxLevel', 'iced', 'sim', 'aim'].forEach(function (k) { if (typeof s[k] === typeof gm[k]) gm[k] = s[k]; });
    gm.queue = C.makeQueue(gm.seed);
    gm.nextDrop = gm.sim;
    gm.open = !!s.open;
    gm.bodies = s.bodies.filter(function (b) {
      return Array.isArray(b) && (b[0] <= TOP && b[0] >= 0 || b[0] === C.MINT || b[0] === C.ICE) && isFinite(b[1]) && isFinite(b[2]);
    });
    return gm;
  }

  function begin(gm) {
    game = gm;
    bodies.length = 0;
    merges.length = 0;
    (gm.bodies || []).forEach(function (b) {
      var nb = newBody(b[0], clampAim(b[1], radiusOf(b[0])), Math.min(H - radiusOf(b[0]), b[2]), gm.sim - 5000);
      nb.a = nb.pa = b[3] || 0;
      bodies.push(nb);
    });
    delete gm.bodies;
    for (var i = 0; i < PMAX; i++) parts[i].on = false;
    for (var k = 0; k < pops.length; k++) pops[k].on = false;
    flash.t = 0;
    hudLast.score = -1;
    hudLast.rank = '';
    nextShown = -1;
    el.rankLabel.textContent = gm.mode === 'daily' ? g('hud.today') : g('hud.practice');
    el.rankV.textContent = gm.mode === 'daily' ? '-' : '';
    el.rankPill.classList.toggle('is-practice', gm.mode !== 'daily');
    el.hint.hidden = gm.drops > 0;
    if (gm.mode === 'daily') {
      var d = daily();
      if (d.status !== 'done') lsSet(K.daily, { day: gm.day, status: 'playing' });
      loadBoardScores();
    }
  }

  function drop() {
    if (!game || game.state !== 'play') return;
    if (game.sim < game.nextDrop) { game.pendingDrop = true; return; }
    game.pendingDrop = false;
    var k = game.queue[game.drops];
    var r = radiusOf(k);
    var x = clampAim(game.aim, r);
    // malo nasumičnog pomaka (±0.01) da se iste voćke ne slože savršeno jedna na drugu
    var b = newBody(k, x + (Math.random() - 0.5) * 0.02, DROP_Y, game.sim);
    bodies.push(b);
    game.drops++;
    game.nextDrop = game.sim + C.DROP_COOLDOWN_MS;
    if (game.queue.length - game.drops < 50) game.queue = game.queue.concat(C.makeQueue(game.seed + game.queue.length, 2000));
    el.hint.hidden = true;
    Snd.drop();
  }

  function gameOver() {
    if (!game || game.state !== 'play') return;
    game.state = 'over';
    game.overAt = performance.now();
    game.open = false;
    Snd.over();
    buzz([40, 60, 40]);
    shake(6);
    var key = game.mode === 'daily' ? K.game : K.practice;
    lsSet(key, null);
    var st = stats();
    var record = game.score > st.best;
    st.best = Math.max(st.best, game.score);
    st.games = (st.games || 0) + 1;
    lsSet(K.stats, st);
    var result = {
      device: DEVICE, day: game.day, score: game.score, drops: game.drops, merges: game.merges,
      golden: game.golden, maxLevel: game.maxLevel, ms: Math.round(game.sim), iced: game.iced
    };
    if (game.mode === 'daily') {
      lsSet(K.daily, { day: game.day, status: 'done', score: game.score });
      lsSet(K.pending, result);
    }
    var gm = game;
    setTimeout(function () { showEnd(gm, record); }, reduced() ? 300 : 1100);
  }

  /* ------------------------------------------------------------------ */
  /* Otvaranje i zatvaranje igre                                         */
  /* ------------------------------------------------------------------ */

  var isOpen = false;
  var scrollY = 0;
  var lastFocus = null;

  function open(gm, paused) {
    if (!paused) Snd.unlock(); // zvuk se smije pokrenuti samo na dodir (nastavak sa pauze ga uključi)
    lastFocus = document.activeElement;
    if (!isOpen) {
      isOpen = true;
      scrollY = window.scrollY || 0;
      if (Field) { Field.hold = true; Field.stop(); }
      doc.classList.add('sd-open');
      sdx.hidden = false;
      try { history.pushState({ sd: 1 }, ''); } catch (e) { /* ignore */ }
    }
    el.end.hidden = true;
    el.pausePanel.hidden = true;
    el.infoPanel.hidden = true;
    view.cssW = 0;
    resize();
    warmSprites();
    begin(gm);
    syncSound();
    startLoop();
    if (paused) pause();
    else el.fg.focus({ preventScroll: true });
  }

  function close(fromHistory) {
    if (!isOpen) return;
    if (game && game.state === 'play') { game.open = false; save(); }
    if (!fromHistory && history.state && history.state.sd) {
      // nazad u historiji zatvara igru (popstate); ovo je rezerva ako popstate ne stigne
      closing = setTimeout(function () { close(true); }, 400);
      history.back();
      return;
    }
    clearTimeout(closing);
    isOpen = false;
    stopLoop();
    game = null;
    bodies.length = 0;
    sdx.hidden = true;
    el.end.hidden = true;
    el.pausePanel.hidden = true;
    el.stage.style.transform = '';
    doc.classList.remove('sd-open');
    window.scrollTo(0, scrollY);
    if (Field) { Field.hold = false; Field.wake(); }
    refreshStart();
    if (lastFocus && lastFocus.focus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  var closing = 0;
  window.addEventListener('popstate', function () { if (isOpen) close(true); });

  function pause() {
    if (!game || game.state !== 'play') return;
    game.state = 'pause';
    save();
    el.quitNote.textContent = g('pause.quitSaved');
    el.restart.hidden = game.mode !== 'practice';
    el.pausePanel.hidden = false;
    el.resume.focus({ preventScroll: true });
  }
  function resume() {
    if (!game || game.state !== 'pause') return;
    Snd.unlock();
    game.state = 'play';
    game.open = true;
    el.pausePanel.hidden = true;
    startLoop();
    loop.last = performance.now();
    loop.acc = 0;
    el.fg.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------ */
  /* Upravljanje                                                         */
  /* ------------------------------------------------------------------ */

  var pointer = { id: -1 };
  function worldX(clientX) {
    var r = el.fg.getBoundingClientRect();
    return (clientX - r.left - view.ox) / view.s;
  }
  el.fg.addEventListener('pointerdown', function (e) {
    if (!game || game.state !== 'play' || (e.button && e.button !== 0)) return;
    e.preventDefault();
    pointer.id = e.pointerId;
    try { el.fg.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    game.aim = worldX(e.clientX);
    el.hint.hidden = true;
  });
  el.fg.addEventListener('pointermove', function (e) {
    if (!game || game.state !== 'play') return;
    if (pointer.id === e.pointerId || e.pointerType === 'mouse') game.aim = worldX(e.clientX);
  });
  function release(e, doDrop) {
    if (pointer.id !== e.pointerId) return;
    pointer.id = -1;
    if (doDrop && game && game.state === 'play') { game.aim = worldX(e.clientX); drop(); }
  }
  el.fg.addEventListener('pointerup', function (e) { release(e, true); });
  el.fg.addEventListener('pointercancel', function (e) { release(e, false); });
  sdx.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  // iOS: spriječi zumiranje dvostrukim dodirom i povlačenje stranice
  sdx.addEventListener('touchmove', function (e) { if (e.target === el.fg) e.preventDefault(); }, { passive: false });
  sdx.addEventListener('dblclick', function (e) { e.preventDefault(); });

  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (!sdm.hidden) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      if (!el.infoPanel.hidden) closeInfo();
      else if (game && game.state === 'play') pause();
      else if (game && game.state === 'pause') resume();
      return;
    }
    if (!game || game.state !== 'play') return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      game.aim = clampAim(game.aim, radiusOf(game.queue[game.drops])) + (e.key === 'ArrowLeft' ? -14 : 14);
    } else if ((e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowDown') && e.target === el.fg) {
      e.preventDefault();
      drop();
    }
  });

  el.pauseBtn.addEventListener('click', pause);

  // posebni predmeti: objašnjenje preko igre, igra stoji dok je otvoreno
  var infoResume = false;
  function openInfo() {
    infoResume = !!(game && game.state === 'play');
    if (infoResume) { game.state = 'pause'; save(); }
    el.infoPanel.hidden = false;
    el.infoClose.focus({ preventScroll: true });
  }
  function closeInfo() {
    el.infoPanel.hidden = true;
    if (infoResume && game && game.state === 'pause' && el.pausePanel.hidden) resume();
    else if (!el.pausePanel.hidden) el.resume.focus({ preventScroll: true });
    infoResume = false;
  }
  el.info.addEventListener('click', openInfo);
  el.infoClose.addEventListener('click', closeInfo);
  el.infoPanel.addEventListener('click', function (e) { if (e.target === el.infoPanel) closeInfo(); });
  el.resume.addEventListener('click', resume);
  // vježba ispočetka (dnevni izazov se ne može ponoviti)
  el.restart.addEventListener('click', function () {
    if (!game || game.mode !== 'practice') return;
    Snd.unlock();
    lsSet(K.practice, null);
    el.pausePanel.hidden = true;
    begin(newGame('practice'));
    startLoop();
    loop.last = performance.now();
    loop.acc = 0;
    el.fg.focus({ preventScroll: true });
  });
  el.quit.addEventListener('click', function () { close(false); });
  el.close.addEventListener('click', function () { close(false); });

  function syncSound() {
    el.sound.setAttribute('aria-pressed', Snd.on ? 'true' : 'false');
    el.sound.setAttribute('aria-label', Snd.on ? g('hud.soundOff') : g('hud.soundOn'));
    el.sound.classList.toggle('is-muted', !Snd.on);
  }
  el.sound.addEventListener('click', function () {
    Snd.on = !Snd.on;
    lsSet(K.sound, Snd.on ? 1 : 0);
    if (Snd.on) Snd.unlock();
    syncSound();
  });

  // pauza kad se ode sa ekrana (druga aplikacija, zaključan telefon)
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (game && game.state === 'play') pause();
      else if (game) save();
      stopLoop();
      if (Snd.ctx && Snd.ctx.state === 'running') Snd.ctx.suspend();
    } else if (isOpen) {
      startLoop();
    } else {
      refreshStart();
    }
  });
  window.addEventListener('pagehide', function () { if (game && game.state !== 'over') save(); });

  var rsz = 0;
  function onResize() {
    if (!isOpen) return;
    cancelAnimationFrame(rsz);
    rsz = requestAnimationFrame(function () { resize(); });
  }
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(el.stage);

  /* ------------------------------------------------------------------ */
  /* Kraj partije                                                        */
  /* ------------------------------------------------------------------ */

  var lastEnd = null;

  function showEnd(gm, record) {
    if (!isOpen || game !== gm) return;
    lastEnd = { mode: gm.mode, score: gm.score, maxLevel: gm.maxLevel, golden: gm.golden, day: gm.day, rank: null, total: null };
    el.endTitle.textContent = gm.mode === 'daily' ? g('end.over') : g('end.practiceOver');
    var bigId = gm.golden > 0 ? 'golden' : FRUITS[gm.maxLevel].id;
    var ec = el.endArt;
    var epx = Math.round((ec.getBoundingClientRect().width || 120) * Math.min(window.devicePixelRatio || 1, 2));
    ec.width = ec.height = epx;
    var ex = ec.getContext('2d');
    ex.clearRect(0, 0, epx, epx);
    ex.drawImage(iconCanvas(bigId, epx), 0, 0);
    el.biggest.textContent = g('end.biggest', { name: g('fruits.' + bigId) });
    el.final.textContent = num(gm.score);
    el.record.hidden = !record || gm.score === 0;
    el.shareMsg.textContent = '';
    el.miniBoard.innerHTML = '';
    el.againLabel.textContent = gm.mode === 'daily' ? g('end.practice') : g('end.again');
    el.rankLine.textContent = '';
    if (gm.mode === 'daily') {
      if (!player.nick) {
        el.rankLine.innerHTML = '';
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'sd-link';
        b.textContent = g('end.noNick');
        b.addEventListener('click', function () { openNick(); });
        el.rankLine.appendChild(b);
      } else {
        el.rankLine.textContent = g('end.sending');
        submitPending().then(function () { if (lastEnd && lastEnd.mode === 'daily') miniBoard(); });
      }
    }
    // "Dodaj na početni ekran" poslije partije, ako to telefon podržava i nije odbijeno
    var btn = el.a2hs.querySelector('[data-install-btn]');
    var later = lsGet(K.a2hs);
    el.a2hs.hidden = !(btn && !btn.hidden && !doc.classList.contains('is-app') && !(later && Date.now() - later < 14 * 86400000));
    el.end.hidden = false;
    el.again.focus({ preventScroll: true });
  }

  el.again.addEventListener('click', function () {
    el.end.hidden = true;
    var saved = load('practice');
    begin(saved || newGame('practice'));
    startLoop();
    loop.last = performance.now();
    loop.acc = 0;
    el.fg.focus({ preventScroll: true });
  });
  el.a2hsLater.addEventListener('click', function () { lsSet(K.a2hs, Date.now()); el.a2hs.hidden = true; });

  function rankText(rank, total) { return g('end.rank', { rank: rank, total: total || rank }); }

  function submitPending() {
    var body = lsGet(K.pending);
    if (!body) return Promise.resolve(null);
    if (!player.nick) return Promise.resolve(null);
    return api('score', { body: body }).then(function (r) {
      var d = r.data;
      var show = lastEnd && lastEnd.mode === 'daily' && lastEnd.day === body.day && isOpen;
      if (r.ok) {
        lsSet(K.pending, null);
        var dd = lsGet(K.daily) || {};
        if (dd.day === body.day) { dd.rank = d.rank; dd.total = d.total; dd.sent = true; lsSet(K.daily, dd); }
        if (show) { lastEnd.rank = d.rank; lastEnd.total = d.total; el.rankLine.textContent = rankText(d.rank, d.total); }
      } else if (r.status === 409 && d.error === 'already') {
        lsSet(K.pending, null);
        var da = lsGet(K.daily) || {};
        if (da.day === body.day) { da.rank = d.rank; da.total = d.total; da.sent = true; da.score = d.score; lsSet(K.daily, da); }
        if (show) el.rankLine.textContent = g('end.already', { score: num(d.score || 0) }) + (d.rank ? ' ' + rankText(d.rank, d.total) : '');
      } else if (r.status === 400 || r.status === 403) {
        // rezultat koji server ne prima (stari dan, uklonjen nadimak): ne šalji ponovo
        lsSet(K.pending, null);
        if (d.error === 'nick-removed') { player.nick = null; lsSet(K.nick, null); }
        if (show) el.rankLine.textContent = d.error === 'nick-removed' ? g('nick.removed') : g('end.rejected');
      } else if (show) {
        el.rankLine.textContent = g('end.failed');
      }
      return r;
    });
  }

  function miniBoard() {
    api('board', { query: { scope: 'day', device: DEVICE, day: today() } }).then(function (r) {
      if (!r.ok || !isOpen) return;
      boardScores = r.data.top.map(function (x) { return x.score; });
      renderBoard(el.miniBoard, r.data, 5);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Slika za dijeljenje                                                 */
  /* ------------------------------------------------------------------ */

  function shareImage(end) {
    var c = document.createElement('canvas');
    c.width = 1080; c.height = 1350;
    var x = c.getContext('2d');
    var bg = x.createLinearGradient(0, 0, 0, 1350);
    bg.addColorStop(0, '#1b120c'); bg.addColorStop(1, '#0d0907');
    x.fillStyle = bg; x.fillRect(0, 0, 1080, 1350);
    var gl = x.createRadialGradient(540, 620, 20, 540, 620, 760);
    gl.addColorStop(0, 'rgba(242,163,60,0.38)'); gl.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gl; x.fillRect(0, 0, 1080, 1350);
    x.textAlign = 'center';
    x.textBaseline = 'alphabetic';
    x.fillStyle = '#f2a33c';
    x.font = '700 40px ' + font;
    x.fillText((end.mode === 'daily' ? g('share.daily') + ' · ' + fmtDay(end.day) : g('share.practice')).toUpperCase(), 540, 150);
    x.fillStyle = '#f4ebdf';
    x.font = '800 104px ' + font;
    x.fillText('Shisha Drop', 540, 270);
    var id = end.golden > 0 ? 'golden' : FRUITS[end.maxLevel].id;
    x.drawImage(iconCanvas(id, 480), 300, 330);
    x.fillStyle = '#ffd36b';
    x.font = '800 190px ' + font;
    x.fillText(num(end.score), 540, 1000);
    x.fillStyle = '#f4ebdf';
    x.font = '600 46px ' + font;
    x.fillText(g('share.points') + (end.rank ? '  ·  #' + end.rank : ''), 540, 1070);
    x.fillStyle = '#b4aa9e';
    x.font = '600 40px ' + font;
    x.fillText(g('end.biggest', { name: g('fruits.' + id) }), 540, 1140);
    x.fillStyle = '#f2a33c';
    x.font = '700 42px ' + font;
    x.fillText(location.host.replace(/^www\./, ''), 540, 1270);
    return c;
  }

  el.share.addEventListener('click', function () {
    if (!lastEnd) return;
    var end = lastEnd;
    var text = end.mode === 'daily' && end.rank ? g('share.textDaily', { score: num(end.score), rank: end.rank }) : g('share.text', { score: num(end.score) });
    var url = location.origin + location.pathname;
    var c = shareImage(end);
    c.toBlob(function (blob) {
      var file = blob && window.File ? new File([blob], 'shisha-drop.png', { type: 'image/png' }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: g('share.title'), text: text + ' ' + url }).catch(function () { /* odustao */ });
      } else if (navigator.share) {
        navigator.share({ title: g('share.title'), text: text, url: url }).catch(function () { /* odustao */ });
      } else if (blob) {
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'shisha-drop.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
        el.shareMsg.textContent = g('share.saved');
      }
    }, 'image/png');
  });

  /* ------------------------------------------------------------------ */
  /* Nadimak                                                             */
  /* ------------------------------------------------------------------ */

  var nickFrom = null;
  function openNick() {
    nickFrom = document.activeElement;
    el.mInput.value = player.nick || '';
    el.mErr.textContent = '';
    el.mSave.disabled = false;
    el.mSave.textContent = g('nick.save');
    sdm.hidden = false;
    doc.classList.add('sdm-open');
    setTimeout(function () { el.mInput.focus(); }, 30);
  }
  function closeNick() {
    sdm.hidden = true;
    doc.classList.remove('sdm-open');
    if (nickFrom && nickFrom.focus && document.contains(nickFrom)) nickFrom.focus({ preventScroll: true });
  }
  el.mCancel.addEventListener('click', closeNick);
  sdm.addEventListener('click', function (e) { if (e.target === sdm) closeNick(); });
  sdm.addEventListener('keydown', function (e) { if (e.key === 'Escape') { e.preventDefault(); closeNick(); } });
  el.mForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = C.validateNick(el.mInput.value);
    if (!v.ok) { el.mErr.textContent = g('nick.' + v.error); return; }
    el.mSave.disabled = true;
    el.mSave.textContent = g('nick.saving');
    api('player', { body: { device: DEVICE, nick: v.nick } }).then(function (r) {
      el.mSave.disabled = false;
      el.mSave.textContent = g('nick.save');
      if (r.ok) {
        player.nick = r.data.nick || v.nick;
        lsSet(K.nick, player.nick);
        closeNick();
        refreshStart();
        loadBoard();
        if (lastEnd && lastEnd.mode === 'daily' && isOpen && !el.end.hidden) {
          el.rankLine.textContent = g('end.sending');
          submitPending().then(function () { miniBoard(); });
        } else {
          submitPending();
        }
        return;
      }
      var err = r.data.error;
      var map = { taken: 'taken', blocked: 'blocked', short: 'short', long: 'long', chars: 'chars', 'rate-limited': 'rate' };
      el.mErr.textContent = g('nick.' + (map[err] || 'network'));
    });
  });
  el.nickBtn.addEventListener('click', openNick);

  /* ------------------------------------------------------------------ */
  /* Početni ekran i rang lista na stranici                              */
  /* ------------------------------------------------------------------ */

  function fmtDay(day) {
    try {
      return new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(day + 'T12:00:00Z'));
    } catch (e) { return day; }
  }
  function fmtLeft(ms) {
    var s = Math.max(0, Math.floor(ms / 1000));
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return h + ':' + (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  var shownDay = '';
  function refreshStart() {
    var day = today();
    var d = daily();
    var st = stats();
    el.date.textContent = fmtDay(day);
    el.best.textContent = st.best ? num(st.best) : '-';
    el.rank.textContent = d.rank ? '#' + d.rank : '-';
    el.nick.textContent = player.nick || g('start.nickNone');
    el.nick.classList.toggle('is-empty', !player.nick);
    el.nickBtn.textContent = player.nick ? g('start.nickChange') : g('start.nickPick');
    el.nickBtn.disabled = false;
    var saved = load('daily');
    var label = el.play.querySelector('span');
    if (d.status === 'done') {
      el.status.textContent = g('start.doneScore', { score: num(d.score || 0) });
      label.textContent = g('start.played');
      el.play.disabled = true;
    } else if (saved) {
      el.status.textContent = g('start.playing');
      label.textContent = g('start.resume');
      el.play.disabled = false;
    } else {
      el.status.textContent = g('start.ready');
      label.textContent = g('start.play');
      el.play.disabled = false;
    }
    el.practice.disabled = false;
    el.offline.hidden = online.api;
    host.setAttribute('data-ready', '1');
    host.setAttribute('data-state', d.status === 'done' ? 'done' : saved ? 'playing' : 'ready');
    if (shownDay && shownDay !== day) loadBoard();
    shownDay = day;
    tickNext();
  }

  var nextTimer = 0;
  function tickNext() {
    clearTimeout(nextTimer);
    if (document.hidden || isOpen) return;
    var left = clock.nextAt - Date.now();
    el.next.textContent = g('start.nextIn', { time: fmtLeft(left) });
    if (left <= 0) { refreshStart(); return; }
    nextTimer = setTimeout(tickNext, 1000 - (Date.now() % 1000) + 5);
  }

  el.play.addEventListener('click', function () {
    var d = daily();
    if (d.status === 'done') return;
    open(load('daily') || newGame('daily'));
  });
  el.practice.addEventListener('click', function () {
    var saved = load('practice');
    if (saved && saved.drops > 0) open(saved, true);
    else open(newGame('practice'));
  });

  var scope = 'day';
  function renderBoard(list, data, limit) {
    list.innerHTML = '';
    var top = (data.top || []).slice(0, limit || 50);
    if (!top.length) {
      var li = document.createElement('li');
      li.className = 'sd-board__msg';
      li.textContent = g('board.empty');
      list.appendChild(li);
      return;
    }
    var mineShown = false;
    top.forEach(function (row) {
      if (row.mine) mineShown = true;
      list.appendChild(boardRow(row.rank, row.nick, row.score, row.mine));
    });
    if (data.me && !mineShown && player.nick) {
      var gap = document.createElement('li');
      gap.className = 'sd-board__gap';
      gap.setAttribute('aria-hidden', 'true');
      gap.textContent = '…';
      list.appendChild(gap);
      list.appendChild(boardRow(data.me.rank, player.nick, data.me.score, true));
    }
  }
  function boardRow(rank, nick, score, mine) {
    var li = document.createElement('li');
    li.className = 'sd-board__row' + (mine ? ' is-me' : '') + (rank <= 3 ? ' is-top is-top' + rank : '');
    var a = document.createElement('span'); a.className = 'sd-board__rank'; a.textContent = rank;
    var b = document.createElement('span'); b.className = 'sd-board__nick'; b.textContent = nick;
    if (mine) { var you = document.createElement('small'); you.textContent = g('board.you'); b.appendChild(you); }
    var c = document.createElement('span'); c.className = 'sd-board__score'; c.textContent = num(score);
    li.appendChild(a); li.appendChild(b); li.appendChild(c);
    return li;
  }

  function loadBoard() {
    var sc = scope;
    api('board', { query: { scope: sc, device: DEVICE, day: today() } }).then(function (r) {
      if (sc !== scope) return;
      el.offline.hidden = online.api;
      if (!r.ok) {
        el.boardList.innerHTML = '<li class="sd-board__msg">' + MSP.V.esc(g('board.error')) + '</li>';
        el.boardNote.textContent = '';
        return;
      }
      if (sc === 'day') boardScores = r.data.top.map(function (x) { return x.score; });
      el.boardNote.textContent = sc === 'week' ? g('board.weekNote') : (r.data.total ? g('board.players', { n: num(r.data.total) }) : '');
      renderBoard(el.boardList, r.data, 50);
      if (sc === 'day' && r.data.me) {
        var d = lsGet(K.daily);
        if (d && d.day === today() && !d.rank) { d.rank = r.data.me.rank; lsSet(K.daily, d); refreshStart(); }
      }
    });
  }
  function loadBoardScores() {
    if (boardScores) return;
    api('board', { query: { scope: 'day', device: DEVICE, day: today() } }).then(function (r) {
      if (r.ok) boardScores = r.data.top.map(function (x) { return x.score; });
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('.sd-tabs .seg-btn'), function (b) {
    b.addEventListener('click', function () {
      scope = b.getAttribute('data-scope');
      Array.prototype.forEach.call(document.querySelectorAll('.sd-tabs .seg-btn'), function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      el.boardList.innerHTML = '<li class="sd-board__msg">' + MSP.V.esc(g('board.loading')) + '</li>';
      loadBoard();
    });
  });

  /* ------------------------------------------------------------------ */
  /* Pokretanje                                                          */
  /* ------------------------------------------------------------------ */

  function init() {
    paintArt(document);
    refreshStart();
    syncDay().then(function () {
      refreshStart();
      loadBoard();
      // nadimak sa servera (ako je uklonjen ili promijenjen na drugom mjestu)
      api('player', { query: { device: DEVICE } }).then(function (r) {
        if (!r.ok) return;
        var n = r.data.nick || null;
        if (n !== player.nick) { player.nick = n; lsSet(K.nick, n); refreshStart(); }
        submitPending();
      });
    });
    window.addEventListener('online', function () { submitPending(); loadBoard(); });
    // partija koja je bila otvorena kad se stranica osvježila: vrati je, na pauzi
    var again = load('daily');
    var mode = 'daily';
    if (!again || !again.open) { again = load('practice'); mode = 'practice'; }
    if (again && again.open && !(mode === 'daily' && daily().status === 'done')) open(again, true);
    // dugme "Dodaj na početni ekran" je i na kartici u igri; pwa.js ga prikaže kad može
  }

  init();

  // za testove i mjerenje (bez uticaja na igru)
  MSP.ShishaDrop = {
    state: function () { return game ? { mode: game.mode, state: game.state, score: game.score, drops: game.drops, bodies: bodies.length, danger: game.danger, dpr: view.dpr, quality: quality } : null; },
    drop: function (x) { if (game) { game.aim = x; drop(); } },
    js: function (reset) { var r = { avg: jsTime.n ? +(jsTime.sum / jsTime.n).toFixed(2) : 0, max: +jsTime.max.toFixed(2), n: jsTime.n }; if (reset) { jsTime.sum = jsTime.n = jsTime.max = 0; } return r; },
    end: function () { gameOver(); }
  };
})();
