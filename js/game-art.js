/*
 * MyShishapedia - Shisha Drop: crteži voća i predmeta (canvas).
 *
 * Svaka voćka se nacrta jednom, u tačnoj veličini u pikselima, u mali canvas (sprite),
 * a igra ga poslije samo kopira (drawImage) i rotira dok se kotrlja. Svjetlo i sjena
 * (sjaj gore lijevo, tamniji rub dolje desno) su poseban sloj koji se ne rotira,
 * pa voće izgleda okruglo i "pravo" i dok se okreće.
 * Crteži su u jedinicama gdje je poluprečnik voćke 50 (kao u SVG-u), pa se samo skaliraju.
 * Ovisi o: game-core.js (MSP.GameCore.FRUITS).
 */
(function () {
  'use strict';

  var MSP = (window.MSP = window.MSP || {});

  function rand(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), a | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function rg(ctx, cx, cy, r, stops, fx, fy) {
    var g = ctx.createRadialGradient(fx == null ? cx : fx, fy == null ? cy : fy, 0, cx, cy, r);
    for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
    return g;
  }
  function lg(ctx, x1, y1, x2, y2, stops) {
    var g = ctx.createLinearGradient(x1, y1, x2, y2);
    for (var i = 0; i < stops.length; i++) g.addColorStop(stops[i][0], stops[i][1]);
    return g;
  }
  function circle(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
  function ellipse(ctx, x, y, rx, ry, rot) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, Math.PI * 2); }

  /** Sitne tačkice (sjemenke, pore) unutar elipse. */
  function dots(ctx, seed, n, rx, ry, cy, r, color, stretch) {
    var R = rand(seed);
    ctx.fillStyle = color;
    for (var i = 0; i < n; i++) {
      var a = R() * Math.PI * 2;
      var k = Math.sqrt(R());
      var x = Math.cos(a) * rx * k;
      var y = cy + Math.sin(a) * ry * k;
      ellipse(ctx, x, y, r, r * (stretch || 1), a);
      ctx.fill();
    }
  }

  function leaf(ctx, x, y, len, w, rot, c1, c2) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.5, -w, len, 0);
    ctx.quadraticCurveTo(len * 0.5, w, 0, 0);
    ctx.fillStyle = lg(ctx, 0, -w, 0, w, [[0, c1], [1, c2]]);
    ctx.fill();
    ctx.strokeStyle = 'rgba(20,70,30,0.55)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(len * 0.92, 0);
    ctx.stroke();
    ctx.restore();
  }

  function stem(ctx, x1, y1, x2, y2, w) {
    ctx.strokeStyle = '#5b3a1a';
    ctx.lineWidth = w || 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo((x1 + x2) / 2 + 3, (y1 + y2) / 2, x2, y2);
    ctx.stroke();
  }

  /* ------------------------------------------------------------------ */
  /* Voće (poluprečnik 50, centar 0,0)                                   */
  /* ------------------------------------------------------------------ */

  var DRAW = {
    blueberry: function (ctx) {
      circle(ctx, 0, 0, 50);
      ctx.fillStyle = rg(ctx, -12, -16, 72, [[0, '#8b97ff'], [0.45, '#3b3f9e'], [1, '#141640']]);
      ctx.fill();
      circle(ctx, 0, 0, 50);
      ctx.fillStyle = rg(ctx, -10, -14, 60, [[0, 'rgba(225,232,255,0.42)'], [0.6, 'rgba(200,210,255,0.14)'], [1, 'rgba(255,255,255,0)']]);
      ctx.fill();
      // "kruna" borovnice
      ctx.save();
      ctx.translate(2, -38);
      ctx.fillStyle = '#1d1a4a';
      ctx.beginPath();
      for (var i = 0; i < 10; i++) {
        var r = i % 2 ? 4 : 11;
        var a = -Math.PI / 2 + (i * Math.PI) / 5;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.75);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    },
    raspberry: function (ctx) {
      ellipse(ctx, 0, 4, 48, 48);
      ctx.fillStyle = '#8f0f3a';
      ctx.fill();
      var g = rg(ctx, -3, -4, 13, [[0, '#ff86ab'], [0.5, '#e01e5a'], [1, '#7a0a2e']]);
      var pts = [];
      [[0, 1], [15, 6], [29, 11], [41, 15]].forEach(function (ring, ri) {
        for (var k = 0; k < ring[1]; k++) {
          var a = (k / ring[1]) * Math.PI * 2 + ri * 0.4;
          pts.push([Math.cos(a) * ring[0], Math.sin(a) * ring[0] * 1.02 + 4]);
        }
      });
      pts.sort(function (p, q) { return p[1] - q[1]; });
      pts.forEach(function (p) {
        ctx.save();
        ctx.translate(p[0], p[1]);
        circle(ctx, 0, 0, 10.5);
        ctx.fillStyle = g;
        ctx.fill();
        circle(ctx, -3, -4, 2.8);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fill();
        ctx.restore();
      });
      ctx.fillStyle = '#4c9a3a';
      ctx.beginPath();
      ctx.moveTo(-14, -44); ctx.lineTo(0, -37); ctx.lineTo(14, -44); ctx.lineTo(8, -34); ctx.lineTo(0, -36); ctx.lineTo(-8, -34);
      ctx.closePath();
      ctx.fill();
    },
    strawberry: function (ctx) {
      ctx.beginPath();
      ctx.moveTo(0, 50);
      ctx.bezierCurveTo(-38, 34, -50, 0, -44, -22);
      ctx.bezierCurveTo(-38, -42, -14, -44, 0, -36);
      ctx.bezierCurveTo(14, -44, 38, -42, 44, -22);
      ctx.bezierCurveTo(50, 0, 38, 34, 0, 50);
      ctx.closePath();
      ctx.fillStyle = rg(ctx, -8, -10, 70, [[0, '#ff7a7a'], [0.5, '#e3253b'], [1, '#8e0d1f']]);
      ctx.fill();
      dots(ctx, 3, 30, 33, 33, 6, 1.7, '#ffe08a', 1.5);
      for (var i = 0; i < 5; i++) {
        var a = -Math.PI + (i + 0.5) * (Math.PI / 5);
        leaf(ctx, 0, -36, 26, 7, a, '#5cb84c', '#2e7a2a');
      }
      stem(ctx, 0, -38, 2, -52, 4);
    },
    lime: function (ctx) {
      ctx.beginPath();
      ctx.ellipse(0, 0, 50, 45, 0, 0, Math.PI * 2);
      ctx.fillStyle = rg(ctx, -12, -14, 66, [[0, '#ecffa8'], [0.45, '#8fd332'], [1, '#3d7a12']]);
      ctx.fill();
      ellipse(ctx, 50, 0, 6, 8);
      ctx.fillStyle = '#5aa02a';
      ctx.fill();
      dots(ctx, 11, 46, 38, 33, 0, 1.1, 'rgba(50,110,20,0.5)');
    },
    lemon: function (ctx) {
      ctx.beginPath();
      ctx.ellipse(0, 0, 49, 43, 0, 0, Math.PI * 2);
      ctx.fillStyle = rg(ctx, -12, -14, 66, [[0, '#fff9b8'], [0.45, '#ffe23a'], [1, '#c79a00']]);
      ctx.fill();
      ellipse(ctx, -51, 0, 7, 9);
      ctx.fillStyle = '#e8c200';
      ctx.fill();
      ellipse(ctx, 51, 0, 7, 9);
      ctx.fillStyle = '#d4ac00';
      ctx.fill();
      dots(ctx, 5, 46, 38, 32, 0, 1.1, 'rgba(200,150,0,0.5)');
    },
    peach: function (ctx) {
      circle(ctx, 0, 0, 50);
      ctx.fillStyle = rg(ctx, -8, -10, 70, [[0, '#ffe4c8'], [0.35, '#ffab7a'], [0.75, '#f0605a'], [1, '#a8343a']]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(194,74,72,0.55)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(6, -48);
      ctx.bezierCurveTo(-14, -20, -14, 22, 4, 50);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,214,187,0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(9, -48);
      ctx.bezierCurveTo(-10, -20, -10, 22, 7, 50);
      ctx.stroke();
      leaf(ctx, 6, -47, 36, 9, -0.35, '#6cc04f', '#2f7a2a');
    },
    orange: function (ctx) {
      circle(ctx, 0, 0, 50);
      ctx.fillStyle = rg(ctx, -12, -14, 70, [[0, '#ffd28e'], [0.45, '#ff8f1f'], [1, '#b84f00']]);
      ctx.fill();
      dots(ctx, 9, 80, 43, 43, 0, 1.2, 'rgba(200,90,10,0.55)');
      circle(ctx, 3, -46, 4);
      ctx.fillStyle = '#7a5a1a';
      ctx.fill();
      leaf(ctx, 4, -46, 26, 7, -0.4, '#5cb84c', '#2e7a2a');
    },
    mango: function (ctx) {
      ctx.save();
      ctx.rotate(-0.3);
      ctx.beginPath();
      ctx.moveTo(-6, -50);
      ctx.bezierCurveTo(30, -52, 52, -22, 48, 10);
      ctx.bezierCurveTo(44, 40, 18, 52, -8, 48);
      ctx.bezierCurveTo(-38, 44, -50, 18, -46, -10);
      ctx.bezierCurveTo(-42, -36, -30, -48, -6, -50);
      ctx.closePath();
      ctx.fillStyle = rg(ctx, -8, -14, 70, [[0, '#fff2a8'], [0.4, '#ffc23a'], [0.75, '#ff7b2a'], [1, '#a63d12']]);
      ctx.fill();
      ctx.fillStyle = 'rgba(120,180,60,0.35)';
      ellipse(ctx, -20, -26, 22, 14, -0.6);
      ctx.fill();
      stem(ctx, -6, -50, 8, -58, 4);
      leaf(ctx, 8, -57, 38, 9, -0.2, '#7ed957', '#2f7a2a');
      ctx.restore();
    },
    pineapple: function (ctx) {
      for (var i = 0; i < 5; i++) {
        var a = -26 + i * 13;
        ctx.beginPath();
        ctx.moveTo(-6, -22);
        ctx.quadraticCurveTo(a * 0.5, -44, a * 1.1, -66 + Math.abs(a) * 0.3);
        ctx.quadraticCurveTo(a * 0.5 + 6, -40, 6, -22);
        ctx.closePath();
        ctx.fillStyle = lg(ctx, 0, -66, 0, -22, [[0, '#a6ec74'], [1, '#2c7a34']]);
        ctx.fill();
      }
      ctx.save();
      ellipse(ctx, 0, 12, 40, 40);
      ctx.fillStyle = rg(ctx, -8, 0, 58, [[0, '#ffe58e'], [0.5, '#e8a52a'], [1, '#8a5410']]);
      ctx.fill();
      ellipse(ctx, 0, 12, 40, 40);
      ctx.clip();
      ctx.strokeStyle = 'rgba(140,85,18,0.6)';
      ctx.lineWidth = 2;
      for (var k = -6; k <= 6; k++) {
        ctx.beginPath(); ctx.moveTo(k * 13 - 40, -30); ctx.lineTo(k * 13 + 40, 54); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(k * 13 + 40, -30); ctx.lineTo(k * 13 - 40, 54); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(90,52,8,0.55)';
      for (var x = -36; x <= 36; x += 13) for (var y = -24; y <= 50; y += 13) {
        circle(ctx, x + ((y / 13) % 2 ? 6.5 : 0), y, 1.8);
        ctx.fill();
      }
      ctx.restore();
    },
    melon: function (ctx) {
      ctx.save();
      ellipse(ctx, 0, 0, 50, 46);
      ctx.fillStyle = rg(ctx, -10, -12, 68, [[0, '#fff5cc'], [0.5, '#f2c96a'], [1, '#a8742a']]);
      ctx.fill();
      ellipse(ctx, 0, 0, 50, 46);
      ctx.clip();
      var R = rand(2);
      ctx.strokeStyle = 'rgba(240,226,180,0.8)';
      ctx.lineWidth = 2.2;
      for (var k = -5; k <= 5; k++) {
        var j = (R() - 0.5) * 16;
        ctx.beginPath(); ctx.moveTo(k * 12 - 52, -52); ctx.quadraticCurveTo(k * 12 + j, 0, k * 12 + 52, 52); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(k * 12 + 52, -52); ctx.quadraticCurveTo(k * 12 - j, 0, k * 12 - 52, 52); ctx.stroke();
      }
      ctx.restore();
      circle(ctx, -48, 0, 3);
      ctx.fillStyle = '#8a6a2a';
      ctx.fill();
    },
    watermelon: function (ctx) {
      ctx.save();
      circle(ctx, 0, 0, 50);
      ctx.fillStyle = rg(ctx, -10, -14, 72, [[0, '#a6e47e'], [0.5, '#3c9a3c'], [1, '#123f1a']]);
      ctx.fill();
      circle(ctx, 0, 0, 50);
      ctx.clip();
      ctx.fillStyle = 'rgba(22,77,31,0.88)';
      [-40, -20, 0, 20, 40].forEach(function (x) {
        ctx.beginPath();
        var pts = [];
        for (var i = 0; i <= 20; i++) {
          var t = i / 20;
          var y = -52 + 104 * t;
          var w = 6 + 3 * Math.sin(t * Math.PI * 5 + x);
          var xx = x * (1 + 0.35 * Math.sin(t * Math.PI));
          pts.push([xx - w / 2, y, xx + w / 2]);
        }
        ctx.moveTo(pts[0][0], pts[0][1]);
        pts.forEach(function (p) { ctx.lineTo(p[0], p[1]); });
        for (var q = pts.length - 1; q >= 0; q--) ctx.lineTo(pts[q][2], pts[q][1]);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
      circle(ctx, 0, -49, 3);
      ctx.fillStyle = '#6b4a22';
      ctx.fill();
    },

    /* posebni predmeti */
    mint: function (ctx) {
      function mleaf(rot, s) {
        ctx.save();
        ctx.rotate(rot);
        ctx.scale(s, s);
        ctx.beginPath();
        ctx.moveTo(0, 6);
        ctx.bezierCurveTo(-28, -4, -32, -40, 0, -56);
        ctx.bezierCurveTo(32, -40, 28, -4, 0, 6);
        ctx.closePath();
        ctx.fillStyle = rg(ctx, -6, -30, 50, [[0, '#c4f8bd'], [0.6, '#3fb560'], [1, '#1c6b3a']]);
        ctx.fill();
        ctx.strokeStyle = 'rgba(29,107,58,0.9)';
        ctx.lineWidth = 1.6;
        ctx.stroke();
        ctx.strokeStyle = 'rgba(220,255,214,0.75)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(0, 2); ctx.lineTo(0, -50);
        ctx.moveTo(0, -14); ctx.lineTo(-12, -24);
        ctx.moveTo(0, -26); ctx.lineTo(12, -36);
        ctx.moveTo(0, -38); ctx.lineTo(-9, -45);
        ctx.stroke();
        ctx.restore();
      }
      ctx.save();
      ctx.translate(0, 22);
      mleaf(-0.66, 0.85);
      mleaf(0.66, 0.85);
      mleaf(0, 1);
      ctx.restore();
    },
    ice: function (ctx) {
      ctx.save();
      ctx.rotate(-0.17);
      var r = 16;
      ctx.beginPath();
      ctx.moveTo(-44 + r, -44);
      ctx.arcTo(44, -44, 44, 44, r);
      ctx.arcTo(44, 44, -44, 44, r);
      ctx.arcTo(-44, 44, -44, -44, r);
      ctx.arcTo(-44, -44, 44, -44, r);
      ctx.closePath();
      ctx.fillStyle = rg(ctx, -14, -16, 80, [[0, 'rgba(255,255,255,0.95)'], [0.5, 'rgba(189,239,255,0.72)'], [1, 'rgba(90,200,240,0.7)']]);
      ctx.fill();
      ctx.strokeStyle = 'rgba(232,251,255,0.9)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineCap = 'round';
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(-30, -30); ctx.lineTo(4, -30); ctx.stroke();
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-30, -17); ctx.lineTo(-16, -17); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(18, 32); ctx.lineTo(30, 20); ctx.stroke();
      ctx.restore();
    },
    golden: function (ctx) {
      var gold = function () { return lg(ctx, -34, 0, 34, 0, [[0, '#8a5a12'], [0.45, '#ffe28a'], [0.7, '#ffcc4d'], [1, '#8a5a12']]); };
      ctx.save();
      ctx.scale(0.95, 0.95);
      ellipse(ctx, 0, 24, 34, 26);
      ctx.fillStyle = gold();
      ctx.fill();
      ctx.fillStyle = gold();
      ctx.fillRect(-7, -32, 14, 34);
      ellipse(ctx, 0, -32, 28, 6);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-11, -40); ctx.lineTo(11, -40); ctx.lineTo(7, -58); ctx.lineTo(-7, -58);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#d18b10';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(26, 12);
      ctx.bezierCurveTo(48, 6, 56, 28, 44, 42);
      ctx.stroke();
      ctx.restore();
    }
  };

  // Koliko crtež izlazi van kruga (listovi, kruna ananasa...), da sprite ima mjesta.
  var PAD = { pineapple: 1.45, mango: 1.3, peach: 1.2, orange: 1.15, strawberry: 1.15, mint: 1.2, golden: 1.25 };

  /**
   * Sprite za predmet `id` sa poluprečnikom `rPx` piksela.
   * Vraća { canvas, half } gdje je half pola širine canvasa u pikselima (centar crteža je u sredini).
   */
  function sprite(id, rPx) {
    var pad = PAD[id] || 1.08;
    var half = Math.ceil(rPx * pad) + 2;
    var c = document.createElement('canvas');
    c.width = c.height = half * 2;
    var ctx = c.getContext('2d');
    ctx.translate(half, half);
    ctx.scale(rPx / 50, rPx / 50);
    (DRAW[id] || DRAW.blueberry)(ctx);
    return { canvas: c, half: half };
  }

  /** Sloj svjetla (sjaj gore lijevo, tamniji rub) za krug poluprečnika rPx; ne rotira se. */
  function light(rPx) {
    var half = Math.ceil(rPx) + 1;
    var c = document.createElement('canvas');
    c.width = c.height = half * 2;
    var ctx = c.getContext('2d');
    ctx.translate(half, half);
    var s = rPx / 50;
    ctx.scale(s, s);
    circle(ctx, 0, 0, 50);
    ctx.fillStyle = rg(ctx, 6, 8, 54, [[0.62, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.32)']]);
    ctx.fill();
    circle(ctx, 0, 0, 50);
    ctx.fillStyle = rg(ctx, -17, -22, 46, [[0, 'rgba(255,255,255,0.62)'], [0.28, 'rgba(255,255,255,0.2)'], [0.7, 'rgba(255,255,255,0)']]);
    ctx.fill();
    return { canvas: c, half: half };
  }

  /** Mala slika predmeta za HTML (naziv u lancu, sljedeća voćka): data URL. */
  function icon(id, px) {
    var s = sprite(id, px * 0.42);
    var c = document.createElement('canvas');
    c.width = c.height = px;
    var ctx = c.getContext('2d');
    ctx.drawImage(s.canvas, px / 2 - s.half, px / 2 - s.half);
    if (id !== 'mint' && id !== 'ice' && id !== 'golden') {
      var l = light(px * 0.42);
      ctx.drawImage(l.canvas, px / 2 - l.half, px / 2 - l.half);
    }
    return c;
  }

  MSP.GameArt = { sprite: sprite, light: light, icon: icon, ids: Object.keys(DRAW) };
})();
