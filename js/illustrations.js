/*
 * MyShishapedia - SVG ilustracije sastojaka i pomoćne funkcije za boje.
 *
 * Sve ilustracije su nacrtane u istom stilu (flat sa blagim sjenčenjem),
 * na platnu 200x200, i boje se iz podataka: glavna boja dolazi iz
 * `ingredient.color`, a svjetlije/tamnije nijanse se izvode automatski.
 *
 * Nova ilustracija: dodaj funkciju u ILLUSTRATIONS (ključ = vrijednost
 * `illustration` u data/flavors.js). Funkcija prima (color, opts) i vraća
 * unutrašnjost <svg> elementa (bez samog <svg> taga). Vidi docs/UPUTSTVO.md.
 */
(function () {
  'use strict';

  var MSP = (window.MSP = window.MSP || {});

  /* ------------------------------------------------------------------ */
  /* Boje                                                                */
  /* ------------------------------------------------------------------ */

  function clamp(v, a, b) {
    return Math.min(b, Math.max(a, v));
  }

  function hexToRgb(hex) {
    var h = String(hex || '').replace('#', '').trim();
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    if (h.length !== 6 || Number.isNaN(n)) return { r: 128, g: 128, b: 128 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgbToHex(c) {
    return '#' + [c.r, c.g, c.b].map(function (v) {
      return Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0');
    }).join('');
  }

  /** Miješa dvije boje; t=0 daje `a`, t=1 daje `b`. */
  function mix(a, b, t) {
    var x = hexToRgb(a);
    var y = hexToRgb(b);
    return rgbToHex({
      r: x.r + (y.r - x.r) * t,
      g: x.g + (y.g - x.g) * t,
      b: x.b + (y.b - x.b) * t
    });
  }

  function lighten(c, t) { return mix(c, '#ffffff', t); }
  function darken(c, t) { return mix(c, '#000000', t); }

  /** Relativna luminancija po WCAG 2.x. */
  function luminance(hex) {
    var c = hexToRgb(hex);
    function f(v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }

  function contrast(a, b) {
    var la = luminance(a);
    var lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  /**
   * Vraća boju što bližu `fg` koja ima kontrast najmanje `min` prema svakoj
   * pozadini iz `bgs`. Po potrebi je potamni ili posvijetli.
   */
  function ensureContrast(fg, bgs, min) {
    var list = Array.isArray(bgs) ? bgs : [bgs];
    function worst(c) {
      return Math.min.apply(null, list.map(function (b) { return contrast(c, b); }));
    }
    if (worst(fg) >= min) return fg;
    var target = worst('#000000') >= worst('#ffffff') ? '#000000' : '#ffffff';
    for (var t = 0.04; t <= 1.0001; t += 0.04) {
      var c = mix(fg, target, t);
      if (worst(c) >= min) return c;
    }
    return target;
  }

  function rgba(hex, a) {
    var c = hexToRgb(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')';
  }

  MSP.color = {
    hexToRgb: hexToRgb,
    rgbToHex: rgbToHex,
    mix: mix,
    lighten: lighten,
    darken: darken,
    luminance: luminance,
    contrast: contrast,
    ensureContrast: ensureContrast,
    rgba: rgba
  };

  /* ------------------------------------------------------------------ */
  /* Pomoćne za crtanje                                                  */
  /* ------------------------------------------------------------------ */

  var uidCounter = 0;
  function uid(prefix) {
    uidCounter += 1;
    return 'msp-' + prefix + '-' + uidCounter;
  }

  function n(v) {
    return Math.round(v * 10) / 10;
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  /*
   * Više malih oblika (sjemenke, tačkice) crta se kao JEDAN <path> umjesto
   * desetina zasebnih elemenata: isti izgled, znatno manji DOM i brže iscrtavanje.
   */

  /** Elipsa (rx, ry) rotirana za `rot` stepeni, kao dio path-a. */
  function ellipseD(cx, cy, rx, ry, rot) {
    var a = ((rot || 0) * Math.PI) / 180;
    var dx = Math.cos(a) * rx;
    var dy = Math.sin(a) * rx;
    var r = n(rot || 0);
    return 'M' + n(cx + dx) + ' ' + n(cy + dy) +
      'A' + rx + ' ' + ry + ' ' + r + ' 1 1 ' + n(cx - dx) + ' ' + n(cy - dy) +
      'A' + rx + ' ' + ry + ' ' + r + ' 1 1 ' + n(cx + dx) + ' ' + n(cy + dy) + 'Z';
  }

  function circleD(cx, cy, r) {
    return ellipseD(cx, cy, r, r, 0);
  }

  /** Jabuka (crvena ili zelena): tijelo sa udubljenjem, peteljka, list i odsjaj. */
  function apple(name, c, speckled) {
    var id = uid(name);
    var body = 'M100 58C118 44 156 42 168 78C180 116 158 168 128 176C116 180 108 174 100 174C92 174 84 180 72 176C42 168 20 116 32 78C44 42 82 44 100 58Z';
    var specks = '';
    if (speckled) {
      for (var i = 0; i < 16; i++) specks += circleD(56 + ((i * 37) % 96), 84 + ((i * 53) % 78), 1.6);
    }
    return (
      '<defs>' +
        '<radialGradient id="' + id + '-g" cx="0.36" cy="0.34" r="0.78">' +
          '<stop offset="0" stop-color="' + lighten(c, 0.42) + '"/>' +
          '<stop offset="0.6" stop-color="' + c + '"/>' +
          '<stop offset="1" stop-color="' + darken(c, 0.35) + '"/>' +
        '</radialGradient>' +
      '</defs>' +
      '<path d="' + body + '" fill="url(#' + id + '-g)"/>' +
      (specks ? '<path d="' + specks + '" fill="' + lighten(c, 0.55) + '" opacity="0.7"/>' : '') +
      '<path d="M88 62C94 66 106 66 112 62" fill="none" stroke="' + darken(c, 0.4) + '" stroke-width="3" stroke-linecap="round" opacity="0.5"/>' +
      '<path d="M100 62C99 48 102 36 110 26" fill="none" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M106 40C116 22 146 20 156 30C142 46 118 50 106 40Z" fill="#4f9a5a"/>' +
      '<path d="M110 39C126 34 140 31 150 30" fill="none" stroke="#2f6b3a" stroke-width="1.6" opacity="0.6"/>' +
      '<ellipse cx="62" cy="96" rx="12" ry="24" fill="#fff" opacity="0.3" transform="rotate(18 62 96)"/>'
    );
  }

  /** Presjek citrusa (grejpfrut, limeta): kora, bijeli sloj, kriške sa sokom. c = boja mesa. */
  function citrusSlice(name, c, peel, count) {
    var id = uid(name);
    var pith = mix(c, '#fffbee', 0.85);
    var segs = '';
    var sacs = '';
    for (var i = 0; i < count; i++) {
      var a0 = (i / count) * Math.PI * 2 + 0.05;
      var a1 = ((i + 1) / count) * Math.PI * 2 - 0.05;
      var r0 = 9;
      var r1 = 66;
      segs += 'M' + n(100 + Math.cos(a0) * r0) + ' ' + n(100 + Math.sin(a0) * r0) +
        'L' + n(100 + Math.cos(a0) * r1) + ' ' + n(100 + Math.sin(a0) * r1) +
        'A' + r1 + ' ' + r1 + ' 0 0 1 ' + n(100 + Math.cos(a1) * r1) + ' ' + n(100 + Math.sin(a1) * r1) +
        'L' + n(100 + Math.cos(a1) * r0) + ' ' + n(100 + Math.sin(a1) * r0) + 'Z';
      var am = (a0 + a1) / 2;
      for (var k = 0; k < 3; k++) {
        var rr = 22 + k * 14;
        sacs += 'M' + n(100 + Math.cos(am) * rr) + ' ' + n(100 + Math.sin(am) * rr) +
          'L' + n(100 + Math.cos(am) * (rr + 8)) + ' ' + n(100 + Math.sin(am) * (rr + 8));
      }
    }
    return (
      '<defs>' +
        '<radialGradient id="' + id + '-f" cx="0.5" cy="0.5" r="0.5">' +
          '<stop offset="0" stop-color="' + lighten(c, 0.4) + '"/>' +
          '<stop offset="0.75" stop-color="' + c + '"/>' +
          '<stop offset="1" stop-color="' + darken(c, 0.1) + '"/>' +
        '</radialGradient>' +
      '</defs>' +
      '<circle cx="100" cy="100" r="88" fill="' + peel + '"/>' +
      '<circle cx="100" cy="100" r="88" fill="none" stroke="' + darken(peel, 0.2) + '" stroke-width="3" stroke-dasharray="1.5 5" opacity="0.5"/>' +
      '<circle cx="100" cy="100" r="79" fill="' + pith + '"/>' +
      '<path d="' + segs + '" fill="url(#' + id + '-f)"/>' +
      '<path d="' + sacs + '" stroke="' + lighten(c, 0.55) + '" stroke-width="2.4" stroke-linecap="round" opacity="0.7"/>' +
      '<circle cx="100" cy="100" r="7" fill="' + pith + '"/>' +
      '<path d="M38 78A66 66 0 0 1 78 36" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.32"/>'
    );
  }

  /** Pomjera i rotira listu tačaka [[x,y],...] (za oblike poput sjemenke lubenice). */
  function place(points, x, y, rot) {
    var a = (rot * Math.PI) / 180;
    var c = Math.cos(a);
    var s = Math.sin(a);
    return points.map(function (p) {
      return [n(x + p[0] * c - p[1] * s), n(y + p[0] * s + p[1] * c)];
    });
  }

  /** Nazubljen list (menta): vraća [pathD, leftHalfD, veinsD]. */
  function mintLeaf(len, width, teeth) {
    var steps = teeth * 2;
    var right = [];
    var left = [];
    function halfWidth(t) {
      return width * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 0.9);
    }
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var w = halfWidth(t);
      if (i % 2 === 1 && i < steps - 1) w += width * 0.1 * (1 - t * 0.5);
      var y = -len * t;
      right.push([w, y]);
      left.push([-w, y]);
    }
    var d = 'M0 0';
    right.forEach(function (p) { d += 'L' + n(p[0]) + ' ' + n(p[1]); });
    for (var j = left.length - 1; j >= 0; j--) d += 'L' + n(left[j][0]) + ' ' + n(left[j][1]);
    d += 'Z';

    var half = 'M0 0';
    left.forEach(function (p) { half += 'L' + n(p[0]) + ' ' + n(p[1]); });
    half += 'Z';

    var veins = 'M0 -3L0 ' + n(-len * 0.93);
    for (var k = 1; k <= 4; k++) {
      var t0 = k * 0.16;
      var t1 = t0 + 0.15;
      var w1 = halfWidth(t1) * 0.78;
      veins += 'M0 ' + n(-len * t0) + 'Q' + n(w1 * 0.45) + ' ' + n(-len * (t0 + 0.1)) + ' ' + n(w1) + ' ' + n(-len * t1);
      veins += 'M0 ' + n(-len * t0) + 'Q' + n(-w1 * 0.45) + ' ' + n(-len * (t0 + 0.1)) + ' ' + n(-w1) + ' ' + n(-len * t1);
    }
    return [d, half, veins];
  }

  /* ------------------------------------------------------------------ */
  /* Ilustracije                                                         */
  /* ------------------------------------------------------------------ */

  var ILLUSTRATIONS = {
    /* Kriška ananasa: kora, sočno meso sa vlaknima i svijetla sredina. */
    ananas: function (c) {
      var id = uid('ananas');
      var rind = mix(darken(c, 0.22), '#9a6320', 0.5);
      var rindDark = darken(rind, 0.32);
      var fleshLight = lighten(c, 0.5);
      var fibers = '';
      for (var i = 0; i < 32; i++) {
        var a = (i / 32) * Math.PI * 2;
        var r2 = 70 - (i % 2) * 9;
        fibers += 'M' + n(100 + Math.cos(a) * 25) + ' ' + n(100 + Math.sin(a) * 25) +
          'L' + n(100 + Math.cos(a) * r2) + ' ' + n(100 + Math.sin(a) * r2);
      }
      var eyes = '';
      for (var e = 0; e < 22; e++) {
        var b = (e / 22) * Math.PI * 2 + 0.14;
        eyes += ellipseD(100 + Math.cos(b) * 66, 100 + Math.sin(b) * 66, 3.4, 2, (b * 180) / Math.PI);
      }
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-r" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="' + lighten(rind, 0.2) + '"/>' +
            '<stop offset="1" stop-color="' + rindDark + '"/>' +
          '</linearGradient>' +
          '<radialGradient id="' + id + '-f" cx="0.42" cy="0.38" r="0.72">' +
            '<stop offset="0" stop-color="' + fleshLight + '"/>' +
            '<stop offset="0.6" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.1) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<circle cx="100" cy="100" r="90" fill="url(#' + id + '-r)"/>' +
        '<circle cx="100" cy="100" r="82.5" fill="none" stroke="' + rindDark + '" stroke-width="5" stroke-dasharray="2.6 6.4" opacity="0.5"/>' +
        '<circle cx="100" cy="100" r="76" fill="url(#' + id + '-f)"/>' +
        '<path d="' + fibers + '" stroke="' + fleshLight + '" stroke-width="2.4" stroke-linecap="round" opacity="0.6"/>' +
        '<path d="' + eyes + '" fill="' + darken(c, 0.24) + '" opacity="0.4"/>' +
        '<circle cx="100" cy="100" r="21" fill="' + lighten(c, 0.62) + '"/>' +
        '<circle cx="100" cy="100" r="21" fill="none" stroke="' + darken(c, 0.12) + '" stroke-width="2" opacity="0.3"/>' +
        '<path d="M44 68A64 64 0 0 1 84 38" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.38"/>'
      );
    },

    /* Banana: zakrivljeno tijelo, greben sa odsjajem, peteljka i vrh. */
    banana: function (c) {
      var id = uid('banana');
      var shade = mix(darken(c, 0.18), '#c7892a', 0.4);
      var light = lighten(c, 0.5);
      var stem = mix('#6f7a2c', darken(c, 0.45), 0.3);
      var body = 'M22 86C28 152 118 182 170 106L178 92C152 126 80 132 42 78Q30 73 22 86Z';
      return (
        '<defs>' +
          '<clipPath id="' + id + '-c"><path d="' + body + '"/></clipPath>' +
          '<linearGradient id="' + id + '-g" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="' + light + '"/>' +
            '<stop offset="0.45" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + shade + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<g transform="translate(-2 -24)">' +
          '<path d="' + body + '" fill="url(#' + id + '-g)"/>' +
          '<g clip-path="url(#' + id + '-c)">' +
            '<path d="M22 112C44 178 132 192 178 116" fill="none" stroke="' + darken(shade, 0.12) + '" stroke-width="18" opacity="0.3"/>' +
            '<path d="M40 92C66 134 124 144 164 108" fill="none" stroke="' + light + '" stroke-width="6" stroke-linecap="round" opacity="0.75"/>' +
            '<path d="M50 118C78 150 124 156 160 124" fill="none" stroke="' + darken(shade, 0.1) + '" stroke-width="1.8" stroke-linecap="round" opacity="0.35"/>' +
          '</g>' +
          '<path d="' + body + '" fill="none" stroke="' + darken(shade, 0.3) + '" stroke-width="1.6" opacity="0.35"/>' +
          '<path d="M172 100L185 74" stroke="' + stem + '" stroke-width="11" stroke-linecap="round"/>' +
          '<path d="M173 97L178 88" stroke="' + lighten(stem, 0.25) + '" stroke-width="3" stroke-linecap="round" opacity="0.6"/>' +
          '<circle cx="185.5" cy="73.5" r="5.6" fill="' + darken(stem, 0.35) + '"/>' +
          '<ellipse cx="25" cy="84" rx="6" ry="4.6" fill="#4a3318" transform="rotate(-30 25 84)"/>' +
        '</g>'
      );
    },

    /* Grančica mente: tri nazubljena lista sa nervima. */
    menta: function (c) {
      var id = uid('menta');
      var vein = darken(c, 0.38);
      var leaves = [
        { rot: -60, len: 92, w: 30, teeth: 7 },
        { rot: 56, len: 96, w: 31, teeth: 7 },
        { rot: -4, len: 132, w: 38, teeth: 8 }
      ];
      var out =
        '<defs>' +
          '<linearGradient id="' + id + '-g" x1="0" y1="1" x2="0" y2="0">' +
            '<stop offset="0" stop-color="' + darken(c, 0.2) + '"/>' +
            '<stop offset="0.55" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + lighten(c, 0.28) + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path d="M100 198C99 190 99.5 184 100 176" stroke="' + darken(c, 0.32) + '" stroke-width="5" stroke-linecap="round" fill="none"/>';
      leaves.forEach(function (l, i) {
        var p = mintLeaf(l.len, l.w, l.teeth);
        var shade = i < 2 ? 0.1 : 0;
        out +=
          '<g transform="translate(100 178) rotate(' + l.rot + ')">' +
            '<path d="' + p[0] + '" fill="url(#' + id + '-g)"' + (shade ? ' opacity="0.94"' : '') + '/>' +
            '<path d="' + p[1] + '" fill="' + darken(c, 0.3) + '" opacity="0.28"/>' +
            '<path d="' + p[2] + '" fill="none" stroke="' + vein + '" stroke-width="1.7" stroke-linecap="round" opacity="0.55"/>' +
          '</g>';
      });
      return out;
    },

    /* Kriška lubenice: kora, bijeli dio, crveno meso i sjemenke. */
    lubenica: function (c, opts) {
      var id = uid('lubenica');
      var rind = (opts && opts.rindColor) || '#2f8a4b';
      var pith = mix(lighten(c, 0.85), '#e4f1c4', 0.7);
      var shape = 'M100 24L14 140A118 118 0 0 0 186 140Z';
      var seeds = [
        [100, 70], [84, 100], [116, 100], [66, 126], [100, 124], [134, 126], [82, 148], [118, 148]
      ];
      var seedD = '';
      var shineD = '';
      seeds.forEach(function (s) {
        var rot = (s[0] - 100) * 0.42;
        var p = place([[0, -6.5], [3.2, -2.4], [3.6, 2.2], [0, 5.4], [-3.6, 2.2], [-3.2, -2.4]], s[0], s[1], rot);
        seedD += 'M' + p[0] + 'C' + p[1] + ' ' + p[2] + ' ' + p[3] + 'C' + p[4] + ' ' + p[5] + ' ' + p[0] + 'Z';
        var h = place([[-1, -1.5]], s[0], s[1], rot)[0];
        shineD += ellipseD(h[0], h[1], 0.9, 1.8, rot);
      });
      var seedsSvg = '<path d="' + seedD + '" fill="#2b1714"/><path d="' + shineD + '" fill="#fff" opacity="0.35"/>';
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-r" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0.6" stop-color="' + lighten(rind, 0.15) + '"/>' +
            '<stop offset="1" stop-color="' + darken(rind, 0.3) + '"/>' +
          '</linearGradient>' +
          '<radialGradient id="' + id + '-f" gradientUnits="userSpaceOnUse" cx="100" cy="24" r="150">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.14) + '"/>' +
            '<stop offset="0.82" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + lighten(c, 0.32) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<g transform="rotate(-8 100 100) translate(0 6)">' +
          '<path d="' + shape + '" fill="url(#' + id + '-r)"/>' +
          '<path d="' + shape + '" fill="' + pith + '" transform="translate(100 24) scale(0.955) translate(-100 -24)"/>' +
          '<path d="' + shape + '" fill="url(#' + id + '-f)" transform="translate(100 24) scale(0.91) translate(-100 -24)"/>' +
          '<path d="M92 42L40 112" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.25"/>' +
          seedsSvg +
        '</g>'
      );
    },

    /* Presječena marakuja: ljubičasta kora, bijeli sloj, pulpa sa sjemenkama. */
    marakuja: function (c, opts) {
      var id = uid('marakuja');
      var skin = (opts && opts.skinColor) || '#5b2345';
      var pith = mix(c, '#fff4d8', 0.78);
      var jellyD = '';
      var seedD = '';
      var total = 30;
      for (var i = 0; i < total; i++) {
        var a = i * 2.39996;
        var r = 9 + Math.sqrt((i + 0.5) / total) * 52;
        var x = 100 + Math.cos(a) * r;
        var y = 100 + Math.sin(a) * r;
        jellyD += circleD(x, y, 7.6);
        seedD += ellipseD(x, y, 3.8, 2.6, ((i * 53) % 180) + 90);
      }
      var specks = '';
      for (var s = 0; s < 18; s++) {
        var b = (s / 18) * Math.PI * 2 + 0.3;
        specks += circleD(100 + Math.cos(b) * 84.5, 100 + Math.sin(b) * 84.5, 1.3);
      }
      var seeds =
        '<path d="' + jellyD + '" fill="' + lighten(c, 0.3) + '" stroke="' + darken(c, 0.12) + '" stroke-width="0.8" opacity="0.8"/>' +
        '<path d="' + seedD + '" fill="#2a1a10"/>';
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-s" cx="0.36" cy="0.3" r="0.78">' +
            '<stop offset="0" stop-color="' + lighten(skin, 0.28) + '"/>' +
            '<stop offset="0.6" stop-color="' + skin + '"/>' +
            '<stop offset="1" stop-color="' + darken(skin, 0.38) + '"/>' +
          '</radialGradient>' +
          '<radialGradient id="' + id + '-p" cx="0.45" cy="0.4" r="0.62">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.36) + '"/>' +
            '<stop offset="0.7" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.16) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<circle cx="100" cy="100" r="90" fill="url(#' + id + '-s)"/>' +
        '<path d="' + specks + '" fill="' + lighten(skin, 0.35) + '" opacity="0.45"/>' +
        '<circle cx="100" cy="100" r="78" fill="' + pith + '"/>' +
        '<circle cx="100" cy="100" r="70" fill="url(#' + id + '-p)"/>' +
        seeds +
        '<path d="M34 72A70 70 0 0 1 70 30" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.3"/>'
      );
    },

    /* Kriška medene dinje: polumjesec sa tankom korom i sjemenkama uz rub. */
    dinja: function (c) {
      var id = uid('dinja');
      var rind = mix(darken(c, 0.28), '#b3ae62', 0.45);
      // Vanjski luk: r=86 (dno na y~152). Unutrašnji luk: r=140, centar (100,-28), dno na y=112.
      var shape = 'M16 84A86 86 0 0 0 184 84A140 140 0 0 1 16 84Z';
      var fibers = '';
      for (var a = -32; a <= 32; a += 6.4) {
        var rad = (a * Math.PI) / 180;
        fibers += 'M' + n(100 + Math.sin(rad) * 150) + ' ' + n(-28 + Math.cos(rad) * 150) +
          'L' + n(100 + Math.sin(rad) * 182) + ' ' + n(-28 + Math.cos(rad) * 182);
      }
      var seedD = '';
      for (var s = -28; s <= 28; s += 7) {
        var r2 = (s * Math.PI) / 180;
        seedD += ellipseD(100 + Math.sin(r2) * 145, -28 + Math.cos(r2) * 145, 4.4, 2, -s);
      }
      var seeds = '<path d="' + seedD + '" fill="#f6efd2" stroke="' + darken(c, 0.2) + '" stroke-width="0.7"/>';
      return (
        '<defs>' +
          '<clipPath id="' + id + '-c"><path d="' + shape + '"/></clipPath>' +
          '<linearGradient id="' + id + '-g" gradientUnits="userSpaceOnUse" x1="0" y1="100" x2="0" y2="152">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.42) + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.04) + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<g transform="translate(100 100) rotate(-10) scale(1.12) translate(-100 -112)">' +
          '<path d="' + shape + '" fill="url(#' + id + '-g)"/>' +
          '<g clip-path="url(#' + id + '-c)">' +
            '<path d="' + fibers + '" stroke="' + lighten(c, 0.5) + '" stroke-width="1.4" stroke-linecap="round" opacity="0.55"/>' +
            '<path d="M16 84A86 86 0 0 0 184 84" fill="none" stroke="' + rind + '" stroke-width="12"/>' +
            '<path d="M16 84A86 86 0 0 0 184 84" fill="none" stroke="' + lighten(rind, 0.35) + '" stroke-width="2" opacity="0.6" transform="translate(100 84) scale(0.955) translate(-100 -84)"/>' +
            '<path d="M184 84A140 140 0 0 1 16 84" fill="none" stroke="' + lighten(c, 0.62) + '" stroke-width="7" opacity="0.8"/>' +
          '</g>' +
          seeds +
          '<path d="M44 118Q70 136 100 138" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.3"/>' +
        '</g>'
      );
    },

    /* Breskva: okrugla, sa brazdom, rumenilom i listom. */
    breskva: function (c) {
      var id = uid('breskva');
      var blush = mix(c, '#e2455a', 0.55);
      var body = 'M100 46C150 40 178 84 171 124C164 164 132 182 100 180C68 182 36 164 29 124C22 84 50 40 100 46Z';
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-b" cx="0.36" cy="0.34" r="0.8">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.45) + '"/>' +
            '<stop offset="0.55" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(blush, 0.1) + '"/>' +
          '</radialGradient>' +
          '<radialGradient id="' + id + '-r" cx="0.7" cy="0.7" r="0.5">' +
            '<stop offset="0" stop-color="' + blush + '" stop-opacity="0.85"/>' +
            '<stop offset="1" stop-color="' + blush + '" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="' + body + '" fill="url(#' + id + '-b)"/>' +
        '<path d="' + body + '" fill="url(#' + id + '-r)"/>' +
        '<path d="M100 52C90 92 92 140 106 176" fill="none" stroke="' + darken(blush, 0.25) + '" stroke-width="3.5" stroke-linecap="round" opacity="0.35"/>' +
        '<ellipse cx="66" cy="88" rx="16" ry="24" fill="#fff" opacity="0.28" transform="rotate(24 66 88)"/>' +
        '<path d="M101 48C100 36 104 28 110 22" fill="none" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M106 34C118 16 150 14 162 26C146 44 120 46 106 34Z" fill="#4f9a5a"/>' +
        '<path d="M110 34C126 30 142 28 156 27" fill="none" stroke="#2f6b3a" stroke-width="1.6" opacity="0.6"/>'
      );
    },

    /* Kriška narandže: kora, bijeli sloj, režnjevi sa sokom. */
    narandza: function (c) {
      var id = uid('narandza');
      var peel = darken(mix(c, '#ff7a00', 0.3), 0.08);
      var pith = mix(c, '#fff6e6', 0.82);
      var segs = '';
      var sacs = '';
      var count = 10;
      for (var i = 0; i < count; i++) {
        var a0 = (i / count) * Math.PI * 2 + 0.05;
        var a1 = ((i + 1) / count) * Math.PI * 2 - 0.05;
        var r0 = 10;
        var r1 = 64;
        segs += 'M' + n(100 + Math.cos(a0) * r0) + ' ' + n(100 + Math.sin(a0) * r0) +
          'L' + n(100 + Math.cos(a0) * r1) + ' ' + n(100 + Math.sin(a0) * r1) +
          'A' + r1 + ' ' + r1 + ' 0 0 1 ' + n(100 + Math.cos(a1) * r1) + ' ' + n(100 + Math.sin(a1) * r1) +
          'L' + n(100 + Math.cos(a1) * r0) + ' ' + n(100 + Math.sin(a1) * r0) + 'Z';
        var am = (a0 + a1) / 2;
        for (var k = 0; k < 3; k++) {
          var rr = 24 + k * 13;
          sacs += 'M' + n(100 + Math.cos(am) * rr) + ' ' + n(100 + Math.sin(am) * rr) +
            'L' + n(100 + Math.cos(am) * (rr + 8)) + ' ' + n(100 + Math.sin(am) * (rr + 8));
        }
      }
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-f" cx="0.5" cy="0.5" r="0.5">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.35) + '"/>' +
            '<stop offset="0.75" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.08) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<circle cx="100" cy="100" r="88" fill="' + peel + '"/>' +
        '<circle cx="100" cy="100" r="88" fill="none" stroke="' + darken(peel, 0.2) + '" stroke-width="3" stroke-dasharray="1.5 5" opacity="0.5"/>' +
        '<circle cx="100" cy="100" r="78" fill="' + pith + '"/>' +
        '<path d="' + segs + '" fill="url(#' + id + '-f)"/>' +
        '<path d="' + sacs + '" stroke="' + lighten(c, 0.55) + '" stroke-width="2.4" stroke-linecap="round" opacity="0.7"/>' +
        '<circle cx="100" cy="100" r="8" fill="' + pith + '"/>' +
        '<path d="M38 78A66 66 0 0 1 78 36" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.32"/>'
      );
    },

    /* Pepermint: dva izdužena, fino nazubljena lista na ljubičastoj stabljici. */
    pepermint: function (c) {
      var id = uid('pepermint');
      var stem = mix('#6b3a5a', darken(c, 0.4), 0.35);
      var leaves = [
        { rot: -30, len: 138, w: 27, teeth: 12 },
        { rot: 26, len: 124, w: 25, teeth: 11 }
      ];
      var out =
        '<defs>' +
          '<linearGradient id="' + id + '-g" x1="0" y1="1" x2="0" y2="0">' +
            '<stop offset="0" stop-color="' + darken(c, 0.28) + '"/>' +
            '<stop offset="0.6" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + lighten(c, 0.22) + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path d="M100 196C98 186 99 178 100 170" stroke="' + stem + '" stroke-width="5.5" stroke-linecap="round" fill="none"/>';
      leaves.forEach(function (l) {
        var p = mintLeaf(l.len, l.w, l.teeth);
        out +=
          '<g transform="translate(100 172) rotate(' + l.rot + ')">' +
            '<path d="' + p[0] + '" fill="url(#' + id + '-g)"/>' +
            '<path d="' + p[1] + '" fill="' + darken(c, 0.35) + '" opacity="0.3"/>' +
            '<path d="' + p[2] + '" fill="none" stroke="' + lighten(c, 0.35) + '" stroke-width="1.3" stroke-linecap="round" opacity="0.55"/>' +
            '<path d="M0 -2L0 ' + n(-l.len * 0.93) + '" stroke="' + stem + '" stroke-width="2" opacity="0.6"/>' +
          '</g>';
      });
      return out;
    },

    /* Voćni bombon u prozirnom omotu sa uvijenim krajevima. */
    bombon: function (c) {
      var id = uid('bombon');
      var wrap = mix(c, '#ffffff', 0.55);
      var stripes = '';
      for (var i = -3; i <= 3; i++) {
        stripes += 'M' + (92 + i * 18) + ' 60L' + (122 + i * 18) + ' 140';
      }
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-c" cx="0.38" cy="0.32" r="0.8">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.5) + '"/>' +
            '<stop offset="0.6" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.25) + '"/>' +
          '</radialGradient>' +
          '<clipPath id="' + id + '-k"><ellipse cx="100" cy="100" rx="46" ry="33"/></clipPath>' +
        '</defs>' +
        '<g transform="rotate(-16 100 100)">' +
          '<path d="M56 100L22 76C18 90 18 110 22 124Z" fill="' + wrap + '" opacity="0.9"/>' +
          '<path d="M56 100L22 76M56 100L20 92M56 100L20 108M56 100L22 124" stroke="' + darken(wrap, 0.18) + '" stroke-width="1.6" opacity="0.7"/>' +
          '<path d="M144 100L178 76C182 90 182 110 178 124Z" fill="' + wrap + '" opacity="0.9"/>' +
          '<path d="M144 100L178 76M144 100L180 92M144 100L180 108M144 100L178 124" stroke="' + darken(wrap, 0.18) + '" stroke-width="1.6" opacity="0.7"/>' +
          '<rect x="50" y="93" width="12" height="14" rx="4" fill="' + darken(wrap, 0.12) + '"/>' +
          '<rect x="138" y="93" width="12" height="14" rx="4" fill="' + darken(wrap, 0.12) + '"/>' +
          '<ellipse cx="100" cy="100" rx="46" ry="33" fill="url(#' + id + '-c)"/>' +
          '<path d="' + stripes + '" stroke="#fff" stroke-width="7" opacity="0.35" clip-path="url(#' + id + '-k)"/>' +
          '<ellipse cx="100" cy="100" rx="50" ry="37" fill="none" stroke="#fff" stroke-width="2" opacity="0.45"/>' +
          '<ellipse cx="84" cy="84" rx="14" ry="6" fill="#fff" opacity="0.55" transform="rotate(-18 84 84)"/>' +
        '</g>'
      );
    },

    /* Mentol: grozd ledenih, prizmatičnih kristala. */
    kristal: function (c) {
      var id = uid('kristal');
      var deep = mix(c, '#3f8fc4', 0.55);
      function prism(tx, ty, rot, s) {
        var pts = function (arr) {
          return place(arr.map(function (p) { return [p[0] * s, p[1] * s]; }), tx, ty, rot).map(function (p) { return p.join(' '); }).join('L');
        };
        return (
          '<path d="M' + pts([[-15, -54], [0, -76], [0, 50], [-15, 38]]) + 'Z" fill="' + lighten(c, 0.55) + '"/>' +
          '<path d="M' + pts([[0, -76], [15, -54], [15, 38], [0, 50]]) + 'Z" fill="url(#' + id + '-g)"/>' +
          '<path d="M' + pts([[-15, -54], [0, -76], [15, -54]]) + '" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" opacity="0.9"/>' +
          '<path d="M' + pts([[0, -70], [0, 44]]) + '" stroke="#fff" stroke-width="1.4" opacity="0.7"/>' +
          '<path d="M' + pts([[-15, -54], [-15, 38], [0, 50], [15, 38], [15, -54], [0, -76]]) + 'Z" fill="none" stroke="' + deep + '" stroke-width="1.4" stroke-linejoin="round" opacity="0.55"/>'
        );
      }
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-g" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + deep + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<ellipse cx="100" cy="172" rx="58" ry="8" fill="' + deep + '" opacity="0.18"/>' +
        prism(64, 138, -28, 0.78) +
        prism(140, 140, 30, 0.72) +
        prism(100, 128, 0, 1) +
        '<path d="M150 50l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#fff" opacity="0.85"/>' +
        '<path d="M46 70l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="#fff" opacity="0.7"/>'
      );
    },

    /* Grančica bilja (npr. žalfija): stabljika sa mekim ovalnim listićima. */
    bilje: function (c) {
      var id = uid('bilje');
      var stem = darken(c, 0.42);
      var leavesD = '';
      var veinsD = '';
      var spots = [[0.18, -1], [0.3, 1], [0.44, -1], [0.56, 1], [0.7, -1], [0.82, 1], [0.95, 0]];
      function onStem(t) {
        var x = 60 + 70 * t + Math.sin(t * 3) * 10;
        var y = 184 - 160 * t;
        return [x, y];
      }
      spots.forEach(function (s) {
        var p = onStem(s[0]);
        var ang = s[1] === 0 ? -70 : s[1] < 0 ? -140 : -20;
        var size = 1 - s[0] * 0.35;
        var a = (ang * Math.PI) / 180;
        var cx = p[0] + Math.cos(a) * 18 * size;
        var cy = p[1] + Math.sin(a) * 18 * size;
        leavesD += ellipseD(cx, cy, 20 * size, 9 * size, ang);
        veinsD += 'M' + n(p[0]) + ' ' + n(p[1]) + 'L' + n(p[0] + Math.cos(a) * 34 * size) + ' ' + n(p[1] + Math.sin(a) * 34 * size);
      });
      var stemD = 'M' + onStem(0).map(n).join(' ');
      for (var t = 0.1; t <= 1.001; t += 0.1) stemD += 'L' + onStem(t).map(n).join(' ');
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-g" x1="0" y1="1" x2="1" y2="0">' +
            '<stop offset="0" stop-color="' + darken(c, 0.15) + '"/>' +
            '<stop offset="1" stop-color="' + lighten(c, 0.3) + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path d="' + stemD + '" fill="none" stroke="' + stem + '" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="' + leavesD + '" fill="url(#' + id + '-g)"/>' +
        '<path d="' + veinsD + '" stroke="' + lighten(c, 0.45) + '" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>'
      );
    },

    /* Mješavina šarenih bombona u omotu (tri boje izvedene iz glavne). */
    bomboni: function (c) {
      var colors = [c, mix(c, '#ffd23f', 0.75), mix(c, '#35c8ff', 0.8)];
      var spots = [[70, 118, -24, 0.78], [132, 124, 18, 0.72], [100, 82, -6, 0.86]];
      var out = '';
      spots.forEach(function (s, i) {
        var id = uid('bmb');
        var col = colors[i];
        var wrap = mix(col, '#ffffff', 0.5);
        var stripes = '';
        for (var k = -3; k <= 3; k++) stripes += 'M' + (k * 14 - 10) + ' -30L' + (k * 14 + 14) + ' 30';
        out +=
          '<g transform="translate(' + s[0] + ' ' + s[1] + ') rotate(' + s[2] + ') scale(' + s[3] + ')">' +
            '<defs>' +
              '<radialGradient id="' + id + '" cx="0.36" cy="0.3" r="0.8">' +
                '<stop offset="0" stop-color="' + lighten(col, 0.55) + '"/>' +
                '<stop offset="0.6" stop-color="' + col + '"/>' +
                '<stop offset="1" stop-color="' + darken(col, 0.28) + '"/>' +
              '</radialGradient>' +
              '<clipPath id="' + id + 'k"><ellipse cx="0" cy="0" rx="34" ry="25"/></clipPath>' +
            '</defs>' +
            '<path d="M-32 0L-62 -20C-66 -8 -66 8 -62 20Z" fill="' + wrap + '" opacity="0.92"/>' +
            '<path d="M32 0L62 -20C66 -8 66 8 62 20Z" fill="' + wrap + '" opacity="0.92"/>' +
            '<path d="M-32 0L-62 -20M-32 0L-64 -6M-32 0L-64 6M-32 0L-62 20M32 0L62 -20M32 0L64 -6M32 0L64 6M32 0L62 20" stroke="' + darken(wrap, 0.2) + '" stroke-width="1.4" opacity="0.7"/>' +
            '<ellipse cx="0" cy="0" rx="34" ry="25" fill="url(#' + id + ')"/>' +
            '<path d="' + stripes + '" stroke="#fff" stroke-width="5" opacity="0.4" clip-path="url(#' + id + 'k)"/>' +
            '<ellipse cx="-12" cy="-10" rx="10" ry="4.5" fill="#fff" opacity="0.6" transform="rotate(-16 -12 -10)"/>' +
          '</g>';
      });
      return out;
    },

    /* Ledena kocka: prozirna, sa ivicama koje hvataju svjetlo. */
    kocka: function (c) {
      var id = uid('kocka');
      var deep = mix(c, '#2f86c8', 0.55);
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-t" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>' +
            '<stop offset="1" stop-color="' + c + '" stop-opacity="0.8"/>' +
          '</linearGradient>' +
          '<linearGradient id="' + id + '-s" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="' + c + '" stop-opacity="0.9"/>' +
            '<stop offset="1" stop-color="' + deep + '" stop-opacity="0.85"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path d="M100 30L166 64L100 98L34 64Z" fill="url(#' + id + '-t)"/>' +
        '<path d="M34 64L100 98L100 172L34 138Z" fill="url(#' + id + '-s)"/>' +
        '<path d="M166 64L100 98L100 172L166 138Z" fill="' + mix(c, deep, 0.35) + '" opacity="0.9"/>' +
        '<path d="M34 64L100 30L166 64L166 138L100 172L34 138Z M34 64L100 98L166 64 M100 98V172" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" opacity="0.85"/>' +
        '<path d="M48 80L48 124M120 116L150 100" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.55"/>' +
        '<path d="M84 50l4 9 9 4-9 4-4 9-4-9-9-4 9-4z" fill="#fff" opacity="0.9"/>'
      );
    },

    /* Mango: zreo, izdužen plod sa crvenim rumenilom i listom. */
    mango: function (c) {
      var id = uid('mango');
      var blush = mix(c, '#e2452c', 0.6);
      var body = 'M58 156C26 128 34 62 88 44C142 28 178 62 172 108C166 152 118 180 58 156Z';
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-b" x1="0" y1="1" x2="1" y2="0">' +
            '<stop offset="0" stop-color="' + mix(c, '#ffd84d', 0.5) + '"/>' +
            '<stop offset="0.55" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(blush, 0.05) + '"/>' +
          '</linearGradient>' +
          '<radialGradient id="' + id + '-r" cx="0.72" cy="0.28" r="0.55">' +
            '<stop offset="0" stop-color="' + blush + '" stop-opacity="0.85"/>' +
            '<stop offset="1" stop-color="' + blush + '" stop-opacity="0"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="' + body + '" fill="url(#' + id + '-b)"/>' +
        '<path d="' + body + '" fill="url(#' + id + '-r)"/>' +
        '<path d="M66 146C48 124 50 86 76 64" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.3"/>' +
        '<path d="M150 58C154 48 160 42 168 38" fill="none" stroke="#6b4a2a" stroke-width="4.5" stroke-linecap="round"/>' +
        '<path d="M160 44C170 22 196 20 200 30C188 46 170 50 160 44Z" fill="#3f9d5a" transform="translate(-14 2)"/>' +
        '<path d="M150 44C164 38 176 34 184 31" fill="none" stroke="#2f6b3a" stroke-width="1.4" opacity="0.6"/>'
      );
    },

    /* Jagoda: crvena, sa sjemenkama i zelenom krunicom. */
    jagoda: function (c) {
      var id = uid('jagoda');
      var body = 'M100 180C62 160 34 118 38 84C42 58 66 46 100 50C134 46 158 58 162 84C166 118 138 160 100 180Z';
      var seeds = '';
      for (var r = 0; r < 5; r++) {
        for (var k = 0; k < 5 - (r > 2 ? r - 2 : 0); k++) {
          var x = 62 + k * 19 + (r % 2) * 9 + (r > 2 ? (r - 2) * 9 : 0);
          var y = 76 + r * 20;
          if (x > 146 - r * 6 || x < 52 + r * 6) continue;
          seeds += ellipseD(x, y, 2.2, 3.4, 10);
        }
      }
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.4" cy="0.35" r="0.75">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.35) + '"/>' +
            '<stop offset="0.6" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.3) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="' + body + '" fill="url(#' + id + '-g)"/>' +
        '<path d="' + seeds + '" fill="#ffe28a" opacity="0.9"/>' +
        '<path d="M60 92C58 78 66 68 78 64" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.35"/>' +
        '<path d="M100 56L78 36L92 58L66 54L90 64L100 50L110 64L134 54L108 58L122 36Z" fill="#3f9d5a"/>' +
        '<path d="M100 56C100 44 102 34 108 26" fill="none" stroke="#2f6b3a" stroke-width="4" stroke-linecap="round"/>'
      );
    },

    /* Kupina: grozd tamnih, sjajnih zrnaca. */
    kupina: function (c) {
      var id = uid('kupina');
      var cells = '';
      var shine = '';
      var rows = [[100, 62, 3], [100, 77, 4], [100, 92, 5], [100, 107, 5], [100, 122, 4], [100, 137, 3], [100, 151, 2]];
      rows.forEach(function (row, ri) {
        var n = row[2];
        for (var i = 0; i < n; i++) {
          var x = row[0] + (i - (n - 1) / 2) * 16;
          var y = row[1];
          cells += circleD(x, y, 9);
          shine += circleD(x - 3, y - 3.5, 2.3);
        }
      });
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.4" cy="0.3" r="0.8">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.35) + '"/>' +
            '<stop offset="0.6" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.45) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="' + cells + '" fill="url(#' + id + '-g)" stroke="' + darken(c, 0.5) + '" stroke-width="1.2"/>' +
        '<path d="' + shine + '" fill="#fff" opacity="0.45"/>' +
        '<path d="M100 46L84 32L94 46L78 44L96 50L100 40L104 50L122 44L106 46L116 32Z" fill="#4f9a5a"/>' +
        '<path d="M100 44C100 34 102 26 108 20" fill="none" stroke="#2f6b3a" stroke-width="4" stroke-linecap="round"/>'
      );
    },

    /* Borovnica: tri okrugle bobice sa zvjezdastom krunicom i blagim "inje" sjajem. */
    borovnica: function (c) {
      var id = uid('borovnica');
      var berries = [[74, 118, 42], [128, 110, 38], [102, 72, 34]];
      var out = '<defs>' +
        '<radialGradient id="' + id + '-g" cx="0.38" cy="0.32" r="0.8">' +
          '<stop offset="0" stop-color="' + lighten(c, 0.45) + '"/>' +
          '<stop offset="0.55" stop-color="' + c + '"/>' +
          '<stop offset="1" stop-color="' + darken(c, 0.45) + '"/>' +
        '</radialGradient>' +
      '</defs>';
      berries.forEach(function (b) {
        var x = b[0], y = b[1], r = b[2];
        var star = '';
        for (var i = 0; i < 5; i++) {
          var a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
          var a2 = a + Math.PI / 5;
          star += (i ? 'L' : 'M') + n(x + Math.cos(a) * r * 0.26) + ' ' + n(y - r * 0.55 + Math.sin(a) * r * 0.26) +
            'L' + n(x + Math.cos(a2) * r * 0.1) + ' ' + n(y - r * 0.55 + Math.sin(a2) * r * 0.1);
        }
        out +=
          '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="url(#' + id + '-g)"/>' +
          '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" stroke="#fff" stroke-width="2" opacity="0.12"/>' +
          '<path d="' + star + 'Z" fill="' + darken(c, 0.55) + '"/>' +
          '<path d="M' + n(x - r * 0.62) + ' ' + n(y + r * 0.05) + 'A' + n(r * 0.66) + ' ' + n(r * 0.66) + ' 0 0 1 ' + n(x - r * 0.12) + ' ' + n(y - r * 0.62) + '" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.32"/>';
      });
      return out;
    },

    /* Višnja: dvije tamnocrvene višnje na peteljkama sa listom. */
    visnja: function (c) {
      var id = uid('visnja');
      function cherry(x, y) {
        return '<circle cx="' + x + '" cy="' + y + '" r="36" fill="url(#' + id + '-g)"/>' +
          '<path d="M' + (x - 4) + ' ' + (y - 34) + 'C' + (x - 2) + ' ' + (y - 28) + ' ' + (x + 2) + ' ' + (y - 28) + ' ' + (x + 4) + ' ' + (y - 34) + '" fill="none" stroke="' + darken(c, 0.5) + '" stroke-width="3" stroke-linecap="round"/>' +
          '<ellipse cx="' + (x - 13) + '" cy="' + (y - 12) + '" rx="8" ry="12" fill="#fff" opacity="0.35" transform="rotate(30 ' + (x - 13) + ' ' + (y - 12) + ')"/>';
      }
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.4" cy="0.35" r="0.75">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.3) + '"/>' +
            '<stop offset="0.55" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.5) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="M66 118C74 76 96 44 122 26M136 124C132 86 128 54 122 26" fill="none" stroke="#5b7d2e" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M122 26C142 10 172 14 180 30C160 42 136 40 122 26Z" fill="#4f9a5a"/>' +
        '<path d="M124 27C142 26 160 27 176 30" fill="none" stroke="#2f6b3a" stroke-width="1.6" opacity="0.6"/>' +
        cherry(62, 146) + cherry(138, 150)
      );
    },

    /* Malina: kupasta bobica od sitnih zrnaca, sa krunicom. */
    malina: function (c) {
      var id = uid('malina');
      var cells = '';
      var shine = '';
      var rows = [[100, 60, 4], [100, 79, 5], [100, 98, 5], [100, 117, 5], [100, 136, 4], [100, 153, 3], [100, 168, 2]];
      rows.forEach(function (row) {
        var k = row[2];
        for (var i = 0; i < k; i++) {
          var x = row[0] + (i - (k - 1) / 2) * 21;
          var y = row[1];
          cells += circleD(x, y, 12.5);
          shine += circleD(x - 4, y - 4.5, 3);
        }
      });
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.4" cy="0.3" r="0.85">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.35) + '"/>' +
            '<stop offset="0.6" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.35) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="' + cells + '" fill="url(#' + id + '-g)" stroke="' + darken(c, 0.35) + '" stroke-width="1.2"/>' +
        '<path d="' + shine + '" fill="#fff" opacity="0.5"/>' +
        '<path d="M100 50L78 32L92 48L68 46L94 54L100 40L106 54L132 46L108 48L122 32Z" fill="#4f9a5a"/>' +
        '<path d="M100 44C100 34 102 26 108 20" fill="none" stroke="#2f6b3a" stroke-width="4" stroke-linecap="round"/>'
      );
    },

    /* Grejpfrut: presjek sa ružičastim mesom i žuto-narandžastom korom. */
    grejpfrut: function (c) {
      return citrusSlice('grejpfrut', c, '#f6b44a', 12);
    },

    /* Limeta: presjek zelene limete. */
    limeta: function (c) {
      return citrusSlice('limeta', c, darken(c, 0.25), 9);
    },

    /* Med: komad saća sa zlatnim ćelijama i kapljica koja curi. */
    med: function (c) {
      var id = uid('med');
      function hex(cx, cy, r) {
        var d = '';
        for (var i = 0; i < 6; i++) {
          var a = (Math.PI / 3) * i + Math.PI / 6;
          d += (i ? 'L' : 'M') + n(cx + Math.cos(a) * r) + ' ' + n(cy + Math.sin(a) * r);
        }
        return d + 'Z';
      }
      var cellsFull = '';
      var cellsEmpty = '';
      var R = 22;
      var w = R * Math.sqrt(3);
      var layout = [[0, 0, 1], [1, 0, 1], [2, 0, 0], [-0.5, 1, 1], [0.5, 1, 1], [1.5, 1, 1], [0, 2, 0], [1, 2, 1]];
      layout.forEach(function (l) {
        var cx = 64 + l[0] * w;
        var cy = 62 + l[1] * R * 1.5;
        if (l[2]) cellsFull += hex(cx, cy, R - 3); else cellsEmpty += hex(cx, cy, R - 3);
      });
      var frame = '';
      layout.forEach(function (l) { frame += hex(64 + l[0] * w, 62 + l[1] * R * 1.5, R); });
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.4" cy="0.35" r="0.8">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.45) + '"/>' +
            '<stop offset="0.6" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.25) + '"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + id + '-d" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.2) + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.15) + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path d="' + frame + '" fill="' + mix(c, '#fff3cf', 0.55) + '" stroke="' + darken(c, 0.3) + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="' + cellsFull + '" fill="url(#' + id + '-g)"/>' +
        '<path d="' + cellsEmpty + '" fill="' + darken(mix(c, '#fff3cf', 0.5), 0.12) + '"/>' +
        '<path d="M120 138C120 150 116 158 116 166A9 9 0 0 0 134 166C134 158 128 150 128 138Z" fill="url(#' + id + '-d)"/>' +
        '<ellipse cx="121" cy="164" rx="2.5" ry="4" fill="#fff" opacity="0.55"/>' +
        '<path d="M52 56l8-10M100 56l8-10" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity="0.45"/>'
      );
    },

    /* Crvena jabuka: okrugla, sa udubljenjem, peteljkom, listom i odsjajem. */
    jabuka: function (c) {
      return apple('jabuka', c, false);
    },

    /* Zelena jabuka: ista forma, svjetlija i sa sitnim tačkicama na kori. */
    'zelena-jabuka': function (c) {
      return apple('zjabuka', c, true);
    },

    /* Zvjezdasti anis: osam drvenastih mahuna u zvijezdi, sa sjemenkama. */
    anis: function (c) {
      var id = uid('anis');
      var pods = '';
      var seeds = '';
      var seams = '';
      for (var i = 0; i < 8; i++) {
        var a = (i / 8) * 360 - 90;
        var r = (a * Math.PI) / 180;
        pods += '<path d="M0 -10C14 -22 18 -52 0 -78C-18 -52 -14 -22 0 -10Z" transform="translate(100 104) rotate(' + (a + 90) + ')"/>';
        seams += 'M' + n(100 + Math.cos(r) * 14) + ' ' + n(104 + Math.sin(r) * 14) + 'L' + n(100 + Math.cos(r) * 70) + ' ' + n(104 + Math.sin(r) * 70);
        seeds += ellipseD(100 + Math.cos(r) * 40, 104 + Math.sin(r) * 40, 7, 4.6, a);
      }
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" gradientUnits="userSpaceOnUse" cx="100" cy="104" r="80">' +
            '<stop offset="0" stop-color="' + darken(c, 0.35) + '"/>' +
            '<stop offset="0.55" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + lighten(c, 0.2) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<ellipse cx="100" cy="182" rx="56" ry="7" fill="#000" opacity="0.12"/>' +
        '<g fill="url(#' + id + '-g)" stroke="' + darken(c, 0.45) + '" stroke-width="2" stroke-linejoin="round">' + pods + '</g>' +
        '<path d="' + seams + '" stroke="' + darken(c, 0.5) + '" stroke-width="2" stroke-linecap="round" opacity="0.6"/>' +
        '<path d="' + seeds + '" fill="' + mix(c, '#e8b26a', 0.55) + '" stroke="' + darken(c, 0.4) + '" stroke-width="1"/>' +
        '<circle cx="100" cy="104" r="11" fill="' + darken(c, 0.3) + '"/>' +
        '<path d="M58 70C66 58 76 52 86 50" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.25"/>'
      );
    },

    /* Limun: presjek limuna sa žutom korom. */
    limun: function (c) {
      return citrusSlice('limun', c, mix(c, '#f2c200', 0.4), 10);
    },

    /* Gumeni medo: proziran, sjajan bombon u obliku medvjedića (generičan, bez marke). */
    medo: function (c) {
      var id = uid('medo');
      var body =
        'M100 34C116 34 126 44 126 58C126 62 125 66 123 69C133 72 140 80 142 90C150 88 158 92 160 100C162 110 154 116 146 114' +
        'C147 122 146 130 142 137C152 140 158 148 156 158C154 170 142 174 132 168C124 174 112 178 100 178' +
        'C88 178 76 174 68 168C58 174 46 170 44 158C42 148 48 140 58 137C54 130 53 122 54 114C46 116 38 110 40 100' +
        'C42 92 50 88 58 90C60 80 67 72 77 69C75 66 74 62 74 58C74 44 84 34 100 34Z';
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.4" cy="0.32" r="0.8">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.6) + '" stop-opacity="0.98"/>' +
            '<stop offset="0.55" stop-color="' + c + '" stop-opacity="0.9"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.22) + '" stop-opacity="0.95"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<g transform="rotate(-8 100 106)">' +
          '<circle cx="80" cy="40" r="13" fill="url(#' + id + '-g)"/>' +
          '<circle cx="120" cy="40" r="13" fill="url(#' + id + '-g)"/>' +
          '<path d="' + body + '" fill="url(#' + id + '-g)"/>' +
          '<path d="' + body + '" fill="none" stroke="' + darken(c, 0.3) + '" stroke-width="2" opacity="0.35"/>' +
          '<ellipse cx="100" cy="132" rx="24" ry="28" fill="#fff" opacity="0.2"/>' +
          '<circle cx="91" cy="56" r="3.2" fill="' + darken(c, 0.45) + '" opacity="0.55"/>' +
          '<circle cx="109" cy="56" r="3.2" fill="' + darken(c, 0.45) + '" opacity="0.55"/>' +
          '<ellipse cx="100" cy="64" rx="6" ry="4" fill="' + darken(c, 0.3) + '" opacity="0.35"/>' +
          '<path d="M84 46C88 40 94 38 100 38" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.7"/>' +
          '<path d="M68 112C66 126 70 140 78 150" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.5"/>' +
          '<circle cx="124" cy="100" r="3" fill="#fff" opacity="0.8"/>' +
        '</g>'
      );
    },

    /* Žvakaća guma: ružičasti balon sa odsjajem i komadić gume ispod. */
    zvaka: function (c) {
      var id = uid('zvaka');
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.36" cy="0.3" r="0.8">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.6) + '"/>' +
            '<stop offset="0.6" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.2) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<rect x="54" y="150" width="92" height="30" rx="8" fill="' + darken(c, 0.08) + '" transform="rotate(-6 100 165)"/>' +
        '<path d="M60 160h80" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.35" transform="rotate(-6 100 165)"/>' +
        '<circle cx="100" cy="88" r="70" fill="url(#' + id + '-g)"/>' +
        '<circle cx="100" cy="88" r="70" fill="none" stroke="' + darken(c, 0.25) + '" stroke-width="1.5" opacity="0.4"/>' +
        '<ellipse cx="72" cy="58" rx="20" ry="11" fill="#fff" opacity="0.55" transform="rotate(-34 72 58)"/>' +
        '<circle cx="126" cy="54" r="5" fill="#fff" opacity="0.6"/>'
      );
    },

    /* Krastavac: okrugla kriška sa tamnom korom i sjemenkama u zvijezdi. */
    krastavac: function (c) {
      var id = uid('krastavac');
      var skin = mix(darken(c, 0.5), '#1f5a2a', 0.5);
      var seeds = '';
      for (var i = 0; i < 9; i++) {
        var a = (i / 9) * Math.PI * 2;
        seeds += ellipseD(100 + Math.cos(a) * 24, 100 + Math.sin(a) * 24, 6.5, 3, (a * 180) / Math.PI);
      }
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-f" cx="0.5" cy="0.5" r="0.5">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.55) + '"/>' +
            '<stop offset="0.7" stop-color="' + lighten(c, 0.3) + '"/>' +
            '<stop offset="1" stop-color="' + c + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<ellipse cx="100" cy="104" rx="86" ry="86" fill="' + darken(skin, 0.2) + '"/>' +
        '<circle cx="100" cy="100" r="86" fill="' + skin + '"/>' +
        '<circle cx="100" cy="100" r="79" fill="url(#' + id + '-f)"/>' +
        '<circle cx="100" cy="100" r="40" fill="' + mix(c, '#ffffff', 0.6) + '" opacity="0.75"/>' +
        '<path d="' + seeds + '" fill="' + mix(c, '#fffbe6', 0.8) + '" stroke="' + darken(c, 0.15) + '" stroke-width="1"/>' +
        '<path d="M40 76A64 64 0 0 1 76 40" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.35"/>'
      );
    },

    /* Vanila: dvije tamne mahune i cvijet vanile. */
    vanila: function (c) {
      var id = uid('vanila');
      var pod = mix('#3a2414', darken(c, 0.6), 0.4);
      var petals = '';
      for (var i = 0; i < 5; i++) {
        petals += '<ellipse cx="0" cy="-24" rx="11" ry="24" transform="rotate(' + (i * 72) + ')"/>';
      }
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-p" x1="0" y1="0" x2="1" y2="0">' +
            '<stop offset="0" stop-color="' + lighten(pod, 0.25) + '"/>' +
            '<stop offset="1" stop-color="' + darken(pod, 0.3) + '"/>' +
          '</linearGradient>' +
          '<radialGradient id="' + id + '-f" cx="0.5" cy="0.5" r="0.6">' +
            '<stop offset="0" stop-color="#fffdf4"/>' +
            '<stop offset="1" stop-color="' + c + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="M40 176C70 130 112 70 160 26" fill="none" stroke="url(#' + id + '-p)" stroke-width="13" stroke-linecap="round"/>' +
        '<path d="M58 182C82 136 120 84 170 46" fill="none" stroke="url(#' + id + '-p)" stroke-width="11" stroke-linecap="round"/>' +
        '<path d="M48 168C74 128 110 78 152 38" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.25"/>' +
        '<g transform="translate(78 78)" fill="url(#' + id + '-f)" stroke="' + darken(c, 0.2) + '" stroke-width="1.4">' + petals + '</g>' +
        '<circle cx="78" cy="78" r="10" fill="' + mix(c, '#f0c040', 0.6) + '"/>' +
        '<circle cx="78" cy="78" r="4" fill="' + darken(mix(c, '#f0c040', 0.6), 0.25) + '"/>'
      );
    },

    /* Šejk: čaša sa kremastim mliječnim šejkom, šlagom i slamkom. */
    sejk: function (c) {
      var id = uid('sejk');
      var cream = mix(c, '#ffffff', 0.55);
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-m" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.3) + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.1) + '"/>' +
          '</linearGradient>' +
          '<clipPath id="' + id + '-c"><path d="M58 70L142 70L130 182L70 182Z"/></clipPath>' +
        '</defs>' +
        '<path d="M120 60L150 6" stroke="#e8455a" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M126 50L132 39M138 28L144 17" stroke="#fff" stroke-width="9" opacity="0.9"/>' +
        '<path d="M58 70L142 70L130 182L70 182Z" fill="url(#' + id + '-m)"/>' +
        '<g clip-path="url(#' + id + '-c)"><path d="M58 96C80 90 120 104 142 96V70H58Z" fill="' + cream + '" opacity="0.6"/></g>' +
        '<path d="M58 70L142 70L130 182L70 182Z" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" opacity="0.7"/>' +
        '<path d="M70 82L78 172" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.4"/>' +
        '<path d="M50 72C46 58 60 50 70 54C72 40 92 36 100 46C108 36 128 40 130 54C140 50 154 58 150 72Z" fill="' + lighten(cream, 0.6) + '" stroke="' + darken(cream, 0.12) + '" stroke-width="2"/>' +
        '<circle cx="100" cy="40" r="10" fill="#d8323c"/>' +
        '<circle cx="96" cy="36" r="3" fill="#fff" opacity="0.6"/>'
      );
    },

    /* Pepermint bombon: okrugla crveno-bijela spirala u prozirnom omotu. */
    'pepermint-bombon': function (c) {
      var id = uid('ppb');
      var swirl = '';
      for (var i = 0; i < 6; i++) {
        swirl += '<path d="M0 0C10 -14 30 -22 46 -14C34 -30 12 -34 0 0Z" transform="rotate(' + (i * 60) + ')"/>';
      }
      var wrap = 'rgba(255,255,255,0.75)';
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.4" cy="0.35" r="0.7">' +
            '<stop offset="0" stop-color="#ffffff"/>' +
            '<stop offset="1" stop-color="' + mix(c, '#ffffff', 0.85) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="M52 100L18 74C12 90 12 110 18 126Z" fill="' + wrap + '" stroke="' + darken(c, 0.1) + '" stroke-width="1.2" stroke-opacity="0.4"/>' +
        '<path d="M148 100L182 74C188 90 188 110 182 126Z" fill="' + wrap + '" stroke="' + darken(c, 0.1) + '" stroke-width="1.2" stroke-opacity="0.4"/>' +
        '<circle cx="100" cy="100" r="50" fill="url(#' + id + '-g)"/>' +
        '<g transform="translate(100 100)" fill="' + c + '">' + swirl + '</g>' +
        '<circle cx="100" cy="100" r="50" fill="none" stroke="' + darken(c, 0.2) + '" stroke-width="2" opacity="0.35"/>' +
        '<circle cx="100" cy="100" r="55" fill="none" stroke="#fff" stroke-width="2" opacity="0.5"/>' +
        '<ellipse cx="82" cy="76" rx="14" ry="6" fill="#fff" opacity="0.7" transform="rotate(-30 82 76)"/>'
      );
    },

    /* Kola: čaša tamne kole sa pjenom, kockama leda, mjehurićima i slamkom. */
    kola: function (c) {
      var id = uid('kola');
      var glass = 'M54 56L146 56L135 176Q134 186 124 186L76 186Q66 186 65 176Z';
      var bubbles = [[84, 120, 3], [112, 140, 2.5], [96, 160, 3.5], [122, 108, 2], [78, 150, 2], [106, 98, 2.5], [90, 92, 2]].map(function (b) {
        return '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="' + b[2] + '"/>';
      }).join('');
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-c" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.18) + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.45) + '"/>' +
          '</linearGradient>' +
          '<clipPath id="' + id + '-g"><path d="' + glass + '"/></clipPath>' +
        '</defs>' +
        '<path d="M116 74L150 12" stroke="#e8455a" stroke-width="9" stroke-linecap="round"/>' +
        '<path d="M122 63L128 52M134 41L140 30" stroke="#fff" stroke-width="9" opacity="0.85"/>' +
        '<path d="' + glass + '" fill="#ffffff" opacity="0.14"/>' +
        '<g clip-path="url(#' + id + '-g)">' +
          '<rect x="40" y="76" width="120" height="120" fill="url(#' + id + '-c)"/>' +
          '<path d="M40 80C60 70 72 86 92 76S126 70 160 78V68H40Z" fill="' + mix(c, '#f3dcc0', 0.75) + '"/>' +
          '<rect x="66" y="82" width="34" height="30" rx="6" fill="#ffffff" opacity="0.4" transform="rotate(-12 83 97)"/>' +
          '<rect x="100" y="90" width="30" height="28" rx="6" fill="#ffffff" opacity="0.32" transform="rotate(14 115 104)"/>' +
          '<g fill="#ffffff" opacity="0.55">' + bubbles + '</g>' +
        '</g>' +
        '<path d="' + glass + '" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" opacity="0.75"/>' +
        '<path d="M66 70L76 172" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.35"/>'
      );
    },

    /* Karamel: sjajne kocke karamele, gornja sa kapljicom koja se cijedi. */
    karamel: function (c) {
      var id = uid('karamel');
      function cube(x, y, s, rot) {
        return (
          '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')">' +
            '<rect x="' + (-s / 2) + '" y="' + (-s / 2) + '" width="' + s + '" height="' + s + '" rx="' + (s * 0.18) + '" fill="url(#' + id + '-g)" stroke="' + darken(c, 0.35) + '" stroke-width="1.5"/>' +
            '<rect x="' + (-s / 2 + 6) + '" y="' + (-s / 2 + 5) + '" width="' + (s * 0.45) + '" height="' + (s * 0.16) + '" rx="' + (s * 0.08) + '" fill="#fff" opacity="0.45"/>' +
          '</g>'
        );
      }
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-g" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.35) + '"/>' +
            '<stop offset="0.55" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.3) + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        cube(72, 132, 64, -8) +
        cube(130, 140, 54, 10) +
        cube(104, 78, 60, 4) +
        '<path d="M86 104C88 118 84 126 90 134C96 126 92 118 96 106Z" fill="' + darken(c, 0.08) + '"/>' +
        '<circle cx="90" cy="138" r="5" fill="' + darken(c, 0.08) + '"/>' +
        '<circle cx="88" cy="136" r="1.6" fill="#fff" opacity="0.6"/>'
      );
    },

    /* Marshmallow: dva mekana, puhasta valjčića (jedan polegnut). */
    marshmallow: function (c) {
      var id = uid('marsh');
      var pink = mix(c, '#ff9cc4', 0.35);
      function puff(x, y, w, h, rot, col) {
        return (
          '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')">' +
            '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="' + (w * 0.32) + '" fill="url(#' + id + '-' + col + ')" stroke="' + darken(c, 0.18) + '" stroke-width="1.3"/>' +
            '<ellipse cx="0" cy="' + (-h / 2 + 7) + '" rx="' + (w / 2 - 5) + '" ry="7" fill="#fff" opacity="0.6"/>' +
            '<path d="M' + (-w / 2 + 8) + ' ' + (-h / 2 + 18) + 'V' + (h / 2 - 12) + '" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.5"/>' +
          '</g>'
        );
      }
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-a" x1="0" y1="0" x2="1" y2="0">' +
            '<stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="' + c + '"/>' +
          '</linearGradient>' +
          '<linearGradient id="' + id + '-b" x1="0" y1="0" x2="1" y2="0">' +
            '<stop offset="0" stop-color="' + lighten(pink, 0.5) + '"/><stop offset="1" stop-color="' + pink + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        puff(78, 104, 66, 82, -10, 'a') +
        puff(132, 134, 58, 70, 62, 'b')
      );
    },

    /* Kardamom: tri zelene mahune sa rebrima i par tamnih sjemenki. */
    kardamom: function (c) {
      var id = uid('kard');
      function pod(x, y, rot, s) {
        return (
          '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ') scale(' + s + ')">' +
            '<path d="M0 -44C24 -32 26 26 0 44C-26 26 -24 -32 0 -44Z" fill="url(#' + id + '-g)" stroke="' + darken(c, 0.35) + '" stroke-width="1.6"/>' +
            '<path d="M0 -40V40M-10 -30C-14 0 -14 10 -10 32M10 -30C14 0 14 10 10 32" fill="none" stroke="' + darken(c, 0.25) + '" stroke-width="1.4" opacity="0.6"/>' +
            '<path d="M-2 -46L0 -54L2 -46" fill="' + darken(c, 0.4) + '"/>' +
            '<ellipse cx="-8" cy="-14" rx="3" ry="9" fill="#fff" opacity="0.35"/>' +
          '</g>'
        );
      }
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-g" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.35) + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.2) + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        pod(72, 98, -28, 1) +
        pod(126, 92, 22, 1.05) +
        pod(100, 140, 84, 0.85) +
        '<g fill="#3a2a1a"><circle cx="60" cy="160" r="5"/><circle cx="72" cy="168" r="4"/><circle cx="148" cy="158" r="4.5"/></g>'
      );
    },

    /* Grožđe: grozd okruglih bobica sa peteljkom i listom. */
    grozdje: function (c) {
      var id = uid('grozdje');
      var rows = [[100, 64, 4], [100, 86, 4], [100, 108, 3], [100, 130, 3], [100, 152, 2], [100, 172, 1]];
      var berries = '';
      var shine = '';
      rows.forEach(function (row, ri) {
        var n = row[2];
        for (var i = 0; i < n; i++) {
          var x = row[0] + (i - (n - 1) / 2) * 22 + (ri % 2 ? 4 : -4);
          berries += circleD(x, row[1], 12);
          shine += circleD(x - 4, row[1] - 4.5, 3);
        }
      });
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.4" cy="0.3" r="0.8">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.35) + '"/>' +
            '<stop offset="0.6" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.4) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="M100 52C100 38 106 28 116 22" fill="none" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/>' +
        '<path d="M106 40C120 22 146 22 158 34C146 38 140 50 124 52C116 54 108 48 106 40Z" fill="#5aa84a" stroke="#2f6b2a" stroke-width="1.5"/>' +
        '<path d="M108 42C122 38 136 36 150 34" fill="none" stroke="#2f6b2a" stroke-width="1.2" opacity="0.7"/>' +
        '<path d="' + berries + '" fill="url(#' + id + '-g)" stroke="' + darken(c, 0.5) + '" stroke-width="1.2"/>' +
        '<path d="' + shine + '" fill="#fff" opacity="0.45"/>'
      );
    },

    /* Kaktusova smokva: dva ovalna ploda sa sitnim tačkicama i zeleni list kaktusa. */
    kaktus: function (c) {
      var id = uid('kaktus');
      var dots = '';
      [[78, 104], [92, 132], [70, 140], [96, 98], [84, 160], [140, 118], [154, 140], [132, 150], [148, 100]].forEach(function (d) {
        dots += '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="2.4"/>';
      });
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-f" cx="0.38" cy="0.32" r="0.8">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.35) + '"/>' +
            '<stop offset="0.6" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.35) + '"/>' +
          '</radialGradient>' +
          '<linearGradient id="' + id + '-p" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="#7cc46a"/><stop offset="1" stop-color="#3f8a46"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<ellipse cx="60" cy="70" rx="34" ry="46" transform="rotate(-24 60 70)" fill="url(#' + id + '-p)" stroke="#2f6b35" stroke-width="2"/>' +
        '<g fill="#e9f5d0" opacity="0.8"><circle cx="52" cy="54" r="2"/><circle cx="66" cy="72" r="2"/><circle cx="48" cy="84" r="2"/><circle cx="70" cy="44" r="2"/></g>' +
        '<ellipse cx="86" cy="128" rx="34" ry="44" fill="url(#' + id + '-f)" stroke="' + darken(c, 0.45) + '" stroke-width="1.6"/>' +
        '<ellipse cx="142" cy="126" rx="30" ry="40" transform="rotate(14 142 126)" fill="url(#' + id + '-f)" stroke="' + darken(c, 0.45) + '" stroke-width="1.6"/>' +
        '<g fill="' + darken(c, 0.5) + '" opacity="0.55">' + dots + '</g>' +
        '<path d="M78 86l8-6 8 6M134 88l8-6 8 6" stroke="' + darken(c, 0.4) + '" stroke-width="3" stroke-linecap="round" fill="none"/>' +
        '<ellipse cx="74" cy="110" rx="7" ry="13" fill="#fff" opacity="0.3"/>'
      );
    },

    /* Guava: cijela zelena guava i prepolovljena, ružičasta iznutra sa sjemenkama. */
    guava: function (c) {
      var id = uid('guava');
      var seeds = '';
      for (var i = 0; i < 10; i++) {
        var a = (i / 10) * Math.PI * 2;
        seeds += '<ellipse cx="' + (128 + Math.cos(a) * 18).toFixed(1) + '" cy="' + (124 + Math.sin(a) * 18).toFixed(1) + '" rx="3" ry="2" fill="#f6e2b8"/>';
      }
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-s" cx="0.4" cy="0.35" r="0.8">' +
            '<stop offset="0" stop-color="#cfe98a"/><stop offset="1" stop-color="#6f9e34"/>' +
          '</radialGradient>' +
          '<radialGradient id="' + id + '-i" cx="0.5" cy="0.5" r="0.6">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.3) + '"/><stop offset="1" stop-color="' + c + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<ellipse cx="70" cy="86" rx="40" ry="46" fill="url(#' + id + '-s)" stroke="#4f7a26" stroke-width="2"/>' +
        '<path d="M70 40l-4-12" stroke="#5a3a1a" stroke-width="5" stroke-linecap="round"/>' +
        '<ellipse cx="56" cy="70" rx="9" ry="15" fill="#fff" opacity="0.3"/>' +
        '<circle cx="128" cy="124" r="46" fill="url(#' + id + '-s)" stroke="#4f7a26" stroke-width="2"/>' +
        '<circle cx="128" cy="124" r="39" fill="url(#' + id + '-i)"/>' +
        '<circle cx="128" cy="124" r="14" fill="' + darken(c, 0.12) + '"/>' +
        seeds
      );
    },

    /* Kruška: zelena kruška sa peteljkom i listom. */
    kruska: function (c) {
      var id = uid('kruska');
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.38" cy="0.55" r="0.75">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.4) + '"/>' +
            '<stop offset="0.6" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.3) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="M100 40C84 40 80 62 78 80C76 98 50 110 50 142C50 170 74 186 100 186C126 186 150 170 150 142C150 110 124 98 122 80C120 62 116 40 100 40Z" fill="url(#' + id + '-g)" stroke="' + darken(c, 0.4) + '" stroke-width="1.8"/>' +
        '<path d="M100 42C100 30 103 22 110 16" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round" fill="none"/>' +
        '<path d="M106 30C118 16 140 16 148 26C136 30 130 40 116 40C110 40 106 36 106 30Z" fill="#5aa84a" stroke="#2f6b2a" stroke-width="1.5"/>' +
        '<ellipse cx="76" cy="130" rx="10" ry="22" fill="#fff" opacity="0.28"/>' +
        '<circle cx="118" cy="150" r="2.4" fill="' + darken(c, 0.4) + '" opacity="0.5"/><circle cx="90" cy="162" r="2" fill="' + darken(c, 0.4) + '" opacity="0.5"/>'
      );
    },

    /* Čaj: šolja čaja na tanjiriću, sa kriškom limuna i parom. */
    caj: function (c) {
      var id = uid('caj');
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-t" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.2) + '"/><stop offset="1" stop-color="' + darken(c, 0.25) + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path d="M78 50C70 40 86 34 78 22M100 46C92 36 108 30 100 18M122 50C114 40 130 34 122 22" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.7"/>' +
        '<ellipse cx="100" cy="176" rx="74" ry="14" fill="#f3ece2" stroke="#c9b9a2" stroke-width="2"/>' +
        '<path d="M48 76H152L142 156Q138 170 124 170H76Q62 170 58 156Z" fill="#fbf7f0" stroke="#c9b9a2" stroke-width="2.5"/>' +
        '<path d="M152 92C178 92 178 136 146 136" fill="none" stroke="#c9b9a2" stroke-width="7"/>' +
        '<ellipse cx="100" cy="80" rx="50" ry="10" fill="url(#' + id + '-t)"/>' +
        '<circle cx="120" cy="80" r="11" fill="#f5d63d" stroke="#d8b21c" stroke-width="2"/>' +
        '<path d="M120 70V90M110 80H130M113 73l14 14M127 73l-14 14" stroke="#d8b21c" stroke-width="1.2" opacity="0.7"/>' +
        '<path d="M64 96L72 152" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.6"/>'
      );
    },

    /* Čokolada: odlomljena tabla čokolade sa kockicama. */
    cokolada: function (c) {
      var id = uid('cok');
      var cells = '';
      for (var r = 0; r < 3; r++) {
        for (var k = 0; k < 3; k++) {
          var x = 46 + k * 36, y = 50 + r * 36;
          cells += '<rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="30" height="30" rx="4" fill="url(#' + id + '-g)" stroke="' + darken(c, 0.35) + '" stroke-width="1.2"/>' +
            '<path d="M' + (x + 7) + ' ' + (y + 8) + 'H' + (x + 26) + '" stroke="#fff" stroke-width="2" opacity="0.25" stroke-linecap="round"/>';
        }
      }
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-g" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.2) + '"/><stop offset="1" stop-color="' + darken(c, 0.25) + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<g transform="rotate(-10 100 100)">' +
          '<path d="M40 44H158V152L146 160L132 150L118 162L102 152L88 162L72 150L58 160L40 152Z" fill="' + darken(c, 0.3) + '"/>' +
          cells +
        '</g>' +
        '<path d="M150 150l14 8-6 10-12-6z" fill="' + darken(c, 0.15) + '"/>'
      );
    },

    /* Cimet: svezane rolnice cimeta. */
    cimet: function (c) {
      var id = uid('cimet');
      function stick(x, y, rot) {
        return (
          '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')">' +
            '<rect x="-60" y="-11" width="120" height="22" rx="10" fill="url(#' + id + '-g)" stroke="' + darken(c, 0.4) + '" stroke-width="1.5"/>' +
            '<path d="M-56 -3H52M-50 4H46" stroke="' + darken(c, 0.35) + '" stroke-width="1.3" opacity="0.6"/>' +
            '<ellipse cx="60" cy="0" rx="6" ry="11" fill="' + lighten(c, 0.15) + '" stroke="' + darken(c, 0.4) + '" stroke-width="1.5"/>' +
            '<path d="M60 -5a4 4 0 1 1 -2 6" fill="none" stroke="' + darken(c, 0.45) + '" stroke-width="1.4"/>' +
          '</g>'
        );
      }
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-g" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.25) + '"/><stop offset="1" stop-color="' + darken(c, 0.2) + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        stick(100, 80, -20) + stick(100, 104, -14) + stick(100, 128, -8) +
        '<path d="M94 64C88 96 92 124 98 150" stroke="#c84a3a" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<path d="M98 150c-10 6-14 14-10 20M98 150c10 6 16 12 14 20" stroke="#c84a3a" stroke-width="4" fill="none" stroke-linecap="round"/>'
      );
    },

    /* Betel: list u obliku srca sa izraženim žilama (indijski "paan"). */
    betel: function (c) {
      var id = uid('betel');
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-g" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.3) + '"/><stop offset="1" stop-color="' + darken(c, 0.25) + '"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path d="M100 184C60 150 30 120 30 84C30 56 52 38 74 40C88 41 96 50 100 58C104 50 112 41 126 40C148 38 170 56 170 84C170 120 140 150 100 184Z" fill="url(#' + id + '-g)" stroke="' + darken(c, 0.4) + '" stroke-width="2"/>' +
        '<path d="M100 60V178M100 90C84 80 64 76 46 80M100 90C116 80 136 76 154 80M100 120C84 110 66 108 52 114M100 120C116 110 134 108 148 114M100 148C88 140 78 140 70 144M100 148C112 140 122 140 130 144" stroke="' + darken(c, 0.35) + '" stroke-width="2" fill="none" opacity="0.6"/>' +
        '<path d="M100 184C100 192 96 196 90 198" stroke="' + darken(c, 0.4) + '" stroke-width="4" stroke-linecap="round" fill="none"/>' +
        '<ellipse cx="66" cy="76" rx="8" ry="16" transform="rotate(-30 66 76)" fill="#fff" opacity="0.25"/>'
      );
    },

    /* Ruža: cvijet ruže sa spiralnim laticama i dva lista. */
    ruza: function (c) {
      var id = uid('ruza');
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.45" cy="0.4" r="0.7">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.35) + '"/><stop offset="1" stop-color="' + darken(c, 0.25) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="M100 150C100 170 98 184 94 196" stroke="#3f7a3a" stroke-width="6" stroke-linecap="round" fill="none"/>' +
        '<path d="M98 166C80 150 58 156 52 168C68 174 86 174 98 166Z" fill="#5aa84a" stroke="#2f6b2a" stroke-width="1.5"/>' +
        '<path d="M100 178C118 164 140 168 146 180C130 186 112 186 100 178Z" fill="#5aa84a" stroke="#2f6b2a" stroke-width="1.5"/>' +
        '<circle cx="100" cy="92" r="58" fill="url(#' + id + '-g)" stroke="' + darken(c, 0.4) + '" stroke-width="2"/>' +
        '<path d="M100 92m-10 0a10 10 0 1 1 20 0c0 16 -26 18 -32 0c-4 -22 32 -32 46 -8c14 26 -16 50 -40 40c-30 -12 -26 -56 4 -66c34 -10 62 18 52 48" fill="none" stroke="' + darken(c, 0.38) + '" stroke-width="3" stroke-linecap="round" opacity="0.7"/>' +
        '<ellipse cx="78" cy="66" rx="10" ry="6" transform="rotate(-30 78 66)" fill="#fff" opacity="0.3"/>'
      );
    },

    /* Rabarbara: tri crveno-zelene stabljike sa listom. */
    rabarbara: function (c) {
      var id = uid('rab');
      function stalk(x, rot) {
        return '<g transform="translate(' + x + ' 186) rotate(' + rot + ')"><path d="M-9 0L-7 -140Q0 -150 7 -140L9 0Z" fill="url(#' + id + '-g)" stroke="' + darken(c, 0.35) + '" stroke-width="1.5"/>' +
          '<path d="M-3 -10V-130" stroke="#fff" stroke-width="2.5" opacity="0.35" stroke-linecap="round"/></g>';
      }
      return (
        '<defs>' +
          '<linearGradient id="' + id + '-g" x1="0" y1="1" x2="0" y2="0">' +
            '<stop offset="0" stop-color="' + c + '"/><stop offset="0.75" stop-color="' + lighten(c, 0.15) + '"/><stop offset="1" stop-color="#9ccc5a"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<path d="M70 52C40 20 70 0 100 20C130 0 160 20 132 52C120 66 82 66 70 52Z" fill="#5aa84a" stroke="#2f6b2a" stroke-width="2"/>' +
        '<path d="M100 22V58M100 40L80 30M100 40L120 30" stroke="#2f6b2a" stroke-width="1.5" opacity="0.6"/>' +
        stalk(82, -8) + stalk(104, 2) + stalk(126, 10)
      );
    },

    /* Rezerva za sastojak koji još nema svoju ilustraciju. */
    fallback: function (c) {
      var id = uid('voce');
      return (
        '<defs>' +
          '<radialGradient id="' + id + '-g" cx="0.38" cy="0.34" r="0.75">' +
            '<stop offset="0" stop-color="' + lighten(c, 0.45) + '"/>' +
            '<stop offset="0.65" stop-color="' + c + '"/>' +
            '<stop offset="1" stop-color="' + darken(c, 0.25) + '"/>' +
          '</radialGradient>' +
        '</defs>' +
        '<path d="M100 52C104 38 112 30 124 26" stroke="' + darken(c, 0.5) + '" stroke-width="5" stroke-linecap="round" fill="none"/>' +
        '<path d="M108 42C120 26 146 24 156 34C142 48 122 50 108 42Z" fill="#3f9d5a"/>' +
        '<circle cx="100" cy="116" r="66" fill="url(#' + id + '-g)"/>' +
        '<path d="M58 98A46 46 0 0 1 84 68" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.35"/>'
      );
    }
  };

  MSP.ILLUSTRATIONS = ILLUSTRATIONS;

  /**
   * Vraća kompletan <svg> za sastojak.
   * opts: { color, label, className }
   *  - label: ako je zadan, SVG je role="img" sa aria-label (informativna slika),
   *           inače je aria-hidden (dekoracija).
   */
  MSP.illustrate = function (key, opts) {
    opts = opts || {};
    var fn = ILLUSTRATIONS[key] || ILLUSTRATIONS.fallback;
    var color = opts.color || '#cccccc';
    var a11y = opts.label
      ? 'role="img" aria-label="' + esc(opts.label) + '"'
      : 'aria-hidden="true" focusable="false"';
    return (
      '<svg class="' + (opts.className || 'ill') + '" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" ' + a11y + '>' +
      fn(color, opts) +
      '</svg>'
    );
  };

  MSP.hasIllustration = function (key) {
    return Object.prototype.hasOwnProperty.call(ILLUSTRATIONS, key) && key !== 'fallback';
  };

  /* ------------------------------------------------------------------ */
  /* Nargila                                                             */
  /* ------------------------------------------------------------------ */

  /*
   * Boje nargile dolaze iz CSS varijabli (postavlja ih app.js po temi):
   *   --hk-line   obrisi          --hk-metal-hi / --hk-metal-lo  metal
   *   --hk-glass  staklo vaze     --hk-water   voda
   *   --hk-hose   crijevo         --hk-smoke   dim u crijevu i mjehurići
   * Klase (hk-line, hk-fill, hk-coal-hot ...) koristi effects.js za animacije.
   * Koordinate (viewBox 360 x 580): osa nargile je x=130, vrh posude y=22,
   * usnik je na (340, 456). Te tačke koristi i effects.js (HOOKAH_POINTS).
   */
  MSP.HOOKAH_POINTS = { width: 360, height: 580, bowl: [130, 22], mouth: [340, 456], water: 472, bubbleOrigin: [130, 532] };

  function coalShape(x, y, w, h, rot, id) {
    var t = 'transform="rotate(' + rot + ' ' + (x + w / 2) + ' ' + (y + h / 2) + ')"';
    return (
      '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" ' + t + ' fill="url(#' + id + '-cold)"/>' +
      '<rect class="hk-coal-hot" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="4" ' + t + ' fill="url(#' + id + '-hot)"/>' +
      '<path d="M' + (x + 4) + ' ' + (y + h * 0.45) + 'h' + (w * 0.4) + 'M' + (x + w * 0.5) + ' ' + (y + h * 0.7) + 'h' + (w * 0.3) + '" ' + t + ' stroke="#1a1411" stroke-width="1.2" opacity="0.5"/>'
    );
  }

  function coalDefs(id) {
    return (
      '<linearGradient id="' + id + '-cold" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#77706a"/><stop offset="1" stop-color="#3a3431"/>' +
      '</linearGradient>' +
      '<radialGradient id="' + id + '-hot" cx="0.5" cy="0.35" r="0.75">' +
        '<stop offset="0" stop-color="#fff1b8"/>' +
        '<stop offset="0.35" stop-color="#ffb13b"/>' +
        '<stop offset="0.75" stop-color="#e2541b"/>' +
        '<stop offset="1" stop-color="#7a1d0a"/>' +
      '</radialGradient>' +
      '<radialGradient id="' + id + '-glow" cx="0.5" cy="0.5" r="0.5">' +
        '<stop offset="0" stop-color="#ff8a2a" stop-opacity="0.75"/>' +
        '<stop offset="0.45" stop-color="#ff5a1a" stop-opacity="0.25"/>' +
        '<stop offset="1" stop-color="#ff5a1a" stop-opacity="0"/>' +
      '</radialGradient>'
    );
  }

  /** Kompletna nargila. opts.label: tekst za čitače ekrana. */
  MSP.hookah = function (opts) {
    opts = opts || {};
    var id = uid('hk');
    var P = MSP.HOOKAH_POINTS;
    var vase = 'M114 370L146 370L146 398C204 422 226 474 218 510C212 544 180 560 130 560C80 560 48 544 42 510C34 474 56 422 114 398Z';
    var hose = 'M160 299C222 294 262 340 270 410C278 480 300 530 326 506';
    // Voda je HTML sloj ispod SVG-a (odsječen oblikom vaze), da bi talasi išli preko GPU-a.
    // Okvir vode u koordinatama nargile: x 34..226, y 370..560.
    var WB = { x: 34, y: 370, w: 192, h: 190 };
    var vaseObb = vase.replace(/(-?[\d.]+) (-?[\d.]+)/g, function (m, x, y) {
      return ((x - WB.x) / WB.w).toFixed(4) + ' ' + ((y - WB.y) / WB.h).toFixed(4);
    });
    var level = ((P.water - WB.y) / WB.h * 100).toFixed(2);
    var a11y = opts.label ? 'role="img" aria-label="' + esc(opts.label) + '"' : 'aria-hidden="true" focusable="false"';
    return (
      '<div class="hk-waterbox" aria-hidden="true" style="clip-path:url(#' + id + '-vobb);--level:' + level + '%">' +
        '<div class="hk-water-body"></div>' +
        '<div class="hk-wave hk-wave--back"></div>' +
        '<div class="hk-wave hk-wave--front"></div>' +
      '</div>' +
      '<svg class="hk" viewBox="0 0 ' + P.width + ' ' + P.height + '" xmlns="http://www.w3.org/2000/svg" ' + a11y + '>' +
        '<defs>' +
          '<linearGradient id="' + id + '-metal" x1="0" y1="0" x2="1" y2="0">' +
            '<stop offset="0" style="stop-color:var(--hk-metal-lo)"/>' +
            '<stop offset="0.35" style="stop-color:var(--hk-metal-hi)"/>' +
            '<stop offset="0.6" style="stop-color:var(--hk-metal-lo)"/>' +
            '<stop offset="1" style="stop-color:var(--hk-metal-lo)"/>' +
          '</linearGradient>' +
          '<linearGradient id="' + id + '-glass" x1="0" y1="0" x2="1" y2="0">' +
            '<stop offset="0" style="stop-color:var(--hk-glass)" stop-opacity="0.34"/>' +
            '<stop offset="0.5" style="stop-color:var(--hk-glass)" stop-opacity="0.08"/>' +
            '<stop offset="1" style="stop-color:var(--hk-glass)" stop-opacity="0.26"/>' +
          '</linearGradient>' +
          coalDefs(id) +
          '<clipPath id="' + id + '-vase"><path d="' + vase + '"/></clipPath>' +
          '<clipPath id="' + id + '-vobb" clipPathUnits="objectBoundingBox"><path d="' + vaseObb + '"/></clipPath>' +
        '</defs>' +

        /* sjaj žara iza posude */
        '<ellipse class="hk-glow" cx="130" cy="34" rx="92" ry="70" fill="url(#' + id + '-glow)"/>' +

        /* crijevo */
        '<g class="hk-hose">' +
          '<path class="hk-fill" d="' + hose + '" fill="none" style="stroke:var(--hk-hose)" stroke-width="11" stroke-linecap="round"/>' +
          '<path class="hk-fill" d="' + hose + '" fill="none" style="stroke:var(--hk-metal-hi)" stroke-width="2" stroke-linecap="round" opacity="0.35" transform="translate(-2 -2)"/>' +
          '<path class="hk-hose-smoke" d="' + hose + '" pathLength="1" fill="none" style="stroke:var(--hk-smoke)" stroke-width="5" stroke-linecap="round" stroke-dasharray="0.08 0.12"/>' +
          '<path class="hk-line" pathLength="1" d="' + hose + '" fill="none" style="stroke:var(--hk-line)" stroke-width="1.4" stroke-linecap="round"/>' +
        '</g>' +
        '<g class="hk-mouth" transform="translate(328 508) rotate(14)">' +
          '<path class="hk-fill" d="M-6 0L-4 -46Q0 -54 4 -46L6 0Z" style="fill:url(#' + id + '-metal)"/>' +
          '<path class="hk-line" pathLength="1" d="M-6 0L-4 -46Q0 -54 4 -46L6 0Z" fill="none" style="stroke:var(--hk-line)" stroke-width="1.3"/>' +
          '<rect class="hk-fill" x="-8" y="-4" width="16" height="8" rx="3" style="fill:var(--hk-metal-hi)" opacity="0.8"/>' +
        '</g>' +

        /* vaza: staklo, voda, mjehurići, donja cijev */
        '<g class="hk-vase">' +
          '<path class="hk-fill" d="' + vase + '" fill="url(#' + id + '-glass)"/>' +
          '<g clip-path="url(#' + id + '-vase)">' +
            '<rect class="hk-fill" x="127" y="370" width="6" height="164" rx="3" style="fill:var(--hk-metal-lo)" opacity="0.7"/>' +
            '<g class="hk-bubbles"></g>' +
          '</g>' +
          '<path class="hk-line" pathLength="1" d="' + vase + '" fill="none" style="stroke:var(--hk-line)" stroke-width="1.6"/>' +
          '<path class="hk-fill" d="M64 452C54 478 56 510 70 532" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.22"/>' +
          '<path class="hk-fill" d="M190 440C198 452 204 466 206 480" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="0.18"/>' +
        '</g>' +

        /* stub */
        '<g class="hk-stem">' +
          '<rect class="hk-fill" x="124" y="116" width="12" height="256" rx="4" style="fill:url(#' + id + '-metal)"/>' +
          '<circle class="hk-fill" cx="130" cy="176" r="14" style="fill:url(#' + id + '-metal)"/>' +
          '<ellipse class="hk-fill" cx="130" cy="256" rx="12" ry="19" style="fill:url(#' + id + '-metal)"/>' +
          '<rect class="hk-fill" x="118" y="211" width="24" height="7" rx="3.5" style="fill:var(--hk-metal-hi)"/>' +
          '<rect class="hk-fill" x="136" y="294" width="26" height="10" rx="3" style="fill:url(#' + id + '-metal)"/>' +
          '<rect class="hk-fill" x="115" y="354" width="30" height="12" rx="4" style="fill:var(--hk-metal-hi)"/>' +
          '<path class="hk-line" pathLength="1" d="M124 118V162M136 118V162M124 190V237M136 190V237M124 275V354M136 275V294M136 304V354" fill="none" style="stroke:var(--hk-line)" stroke-width="1.3"/>' +
          '<circle class="hk-line" pathLength="1" cx="130" cy="176" r="14" fill="none" style="stroke:var(--hk-line)" stroke-width="1.3"/>' +
          '<ellipse class="hk-line" pathLength="1" cx="130" cy="256" rx="12" ry="19" fill="none" style="stroke:var(--hk-line)" stroke-width="1.3"/>' +
          '<rect class="hk-line" pathLength="1" x="115" y="354" width="30" height="12" rx="4" fill="none" style="stroke:var(--hk-line)" stroke-width="1.3"/>' +
        '</g>' +

        /* tacna */
        '<g class="hk-tray">' +
          '<ellipse class="hk-fill" cx="130" cy="130" rx="72" ry="11" style="fill:url(#' + id + '-metal)"/>' +
          '<ellipse class="hk-fill" cx="130" cy="127" rx="62" ry="6.5" style="fill:var(--hk-metal-hi)" opacity="0.45"/>' +
          '<ellipse class="hk-line" pathLength="1" cx="130" cy="130" rx="72" ry="11" fill="none" style="stroke:var(--hk-line)" stroke-width="1.3"/>' +
        '</g>' +

        /* posuda sa žarom */
        '<g class="hk-bowl">' +
          '<path class="hk-fill" d="M92 44L168 44L162 58C158 78 140 90 136 106L124 106C120 90 102 78 98 58Z" fill="#9a5a3a"/>' +
          '<path class="hk-fill" d="M92 44L168 44L162 58C158 78 140 90 136 106L130 106C134 88 150 76 154 58Z" fill="#6e3a24" opacity="0.6"/>' +
          '<rect class="hk-fill" x="122" y="104" width="16" height="14" rx="3" style="fill:var(--hk-metal-hi)"/>' +
          '<path class="hk-line" pathLength="1" d="M92 44L168 44L162 58C158 78 140 90 136 106L124 106C120 90 102 78 98 58Z" fill="none" style="stroke:var(--hk-line)" stroke-width="1.3"/>' +
          '<ellipse class="hk-fill" cx="130" cy="44" rx="42" ry="6" fill="#c9c3bd"/>' +
          '<ellipse class="hk-fill" cx="130" cy="43" rx="36" ry="4" fill="#ece8e3" opacity="0.8"/>' +
          '<g class="hk-coals hk-fill">' +
            coalShape(98, 24, 22, 16, -7, id) +
            coalShape(119, 18, 23, 18, 2, id) +
            coalShape(141, 25, 21, 15, 9, id) +
          '</g>' +
        '</g>' +
      '</svg>'
    );
  };

  /** Mala posuda nargile (za kartice): posuda + tacna, sastojci se slažu iznad. */
  MSP.hookahBowl = function () {
    var id = uid('bw');
    return (
      '<svg class="bowl-svg" viewBox="0 0 200 120" aria-hidden="true" focusable="false">' +
        '<defs>' + coalDefs(id) + '</defs>' +
        '<ellipse cx="100" cy="104" rx="92" ry="12" fill="#000" opacity="0.12"/>' +
        '<ellipse cx="100" cy="96" rx="84" ry="12" fill="#b9b2aa"/>' +
        '<ellipse cx="100" cy="93" rx="72" ry="7" fill="#e6e1db" opacity="0.8"/>' +
        '<path d="M44 20L156 20L148 38C142 60 118 70 112 88L88 88C82 70 58 60 52 38Z" fill="#9a5a3a"/>' +
        '<path d="M44 20L156 20L148 38C142 60 118 70 112 88L100 88C106 70 132 58 140 38Z" fill="#6e3a24" opacity="0.55"/>' +
        '<ellipse cx="100" cy="20" rx="58" ry="8" fill="#c9c3bd"/>' +
        '<ellipse cx="100" cy="19" rx="50" ry="5" fill="#ece8e3" opacity="0.8"/>' +
      '</svg>'
    );
  };

  /* ------------------------------------------------------------------ */
  /* Vodič: jedna scena nargile čiji se dijelovi mijenjaju po koraku      */
  /* ------------------------------------------------------------------ */

  /*
   * Stanja se mijenjaju iz CSS-a (style.css, sekcija "Vodič"):
   *   klase has-water, has-parts, has-tobacco, has-foil, has-coals, show-burner
   *   i atribut data-step (1-9) za animaciju koja pripada samo tom koraku.
   * Osa nargile je x=210 (ista geometrija kao MSP.hookah, pomjerena +80).
   */
  MSP.guideScene = function () {
    var id = uid('gs');
    var vase = 'M114 370L146 370L146 398C204 422 226 474 218 510C212 544 180 560 130 560C80 560 48 544 42 510C34 474 56 422 114 398Z';
    var hose = 'M160 299C222 294 262 340 270 410C278 480 300 530 326 506';
    var bowl = 'M92 44L168 44L162 58C158 78 140 90 136 106L124 106C120 90 102 78 98 58Z';
    function coal(x, y, cls) {
      return (
        '<g class="' + cls + '">' +
          '<rect x="' + x + '" y="' + y + '" width="20" height="15" rx="3.5" fill="#2b2522"/>' +
          '<rect class="c-hot" x="' + x + '" y="' + y + '" width="20" height="15" rx="3.5" fill="url(#' + id + '-hot)"/>' +
          '<rect class="c-ash" x="' + x + '" y="' + y + '" width="20" height="15" rx="3.5" fill="#cfc8c0"/>' +
        '</g>'
      );
    }
    var shreds = '';
    for (var i = 0; i < 14; i++) {
      var sx = 102 + (i * 37) % 56;
      var sy = 50 + (i * 13) % 12;
      shreds += 'M' + sx + ' ' + sy + 'c3 -3 6 3 9 0';
    }
    var falling = '';
    for (var k = 0; k < 10; k++) {
      falling += '<path class="gs-shred" style="--d:' + (k * 0.12).toFixed(2) + 's;--x:' + ((k % 5) * 9 - 18) + 'px" d="M126 -10c3 -3 6 3 9 0"/>';
    }
    var holes = '';
    for (var h = 0; h < 11; h++) {
      var hx = 104 + (h % 6) * 10 + (h > 5 ? 5 : 0);
      var hy = h > 5 ? 45 : 42;
      holes += '<circle class="gs-hole" style="--d:' + (h * 0.07).toFixed(2) + 's" cx="' + hx + '" cy="' + hy + '" r="1.6"/>';
    }
    return (
      '<svg class="gs" viewBox="0 0 420 580" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">' +
        '<defs>' +
          '<clipPath id="' + id + '-v"><path d="' + vase + '"/></clipPath>' +
          '<radialGradient id="' + id + '-hot" cx="0.5" cy="0.35" r="0.75"><stop offset="0" stop-color="#fff1b8"/><stop offset="0.35" stop-color="#ffb13b"/><stop offset="0.75" stop-color="#e2541b"/><stop offset="1" stop-color="#7a1d0a"/></radialGradient>' +
          '<radialGradient id="' + id + '-glow"><stop offset="0" stop-color="#ff8a2a" stop-opacity="0.7"/><stop offset="1" stop-color="#ff5a1a" stop-opacity="0"/></radialGradient>' +
          '<linearGradient id="' + id + '-m" x1="0" x2="1"><stop offset="0" style="stop-color:var(--hk-metal-lo)"/><stop offset="0.4" style="stop-color:var(--hk-metal-hi)"/><stop offset="1" style="stop-color:var(--hk-metal-lo)"/></linearGradient>' +
        '</defs>' +
        '<g transform="translate(80 0)">' +
          /* vaza i voda */
          '<path d="' + vase + '" style="fill:var(--hk-glass)" fill-opacity="0.12"/>' +
          '<g clip-path="url(#' + id + '-v)">' +
            '<g class="gs-water"><rect x="30" y="470" width="200" height="100" style="fill:var(--hk-water)" opacity="0.85"/><path d="M30 470q12 -5 24 0t24 0t24 0t24 0t24 0t24 0t24 0t24 0" style="fill:var(--hk-water)" opacity="0.85"/></g>' +
            '<rect class="gs-part gs-downstem" x="127" y="370" width="6" height="164" rx="3" style="fill:var(--hk-metal-lo)" opacity="0.8"/>' +
          '</g>' +
          '<path d="' + vase + '" fill="none" style="stroke:var(--hk-line)" stroke-width="1.6"/>' +
          '<path d="M64 452C54 478 56 510 70 532" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.22"/>' +

          /* sipanje vode (korak 1) */
          '<g class="gs-pour">' +
            '<path class="gs-stream" d="M204 300C190 320 150 330 134 372" fill="none" style="stroke:var(--hk-water)" stroke-width="7" stroke-linecap="round" pathLength="1"/>' +
            '<g transform="translate(236 270) rotate(-35)"><path d="M-30 -40h50v60a10 10 0 0 1-10 10h-30a10 10 0 0 1-10-10z" style="fill:var(--hk-glass)" fill-opacity="0.18" stroke="currentColor" stroke-width="2"/><path d="M-30 -40l-12 8" stroke="currentColor" stroke-width="2"/><path d="M-28 -6h46v24a8 8 0 0 1-8 8h-30a8 8 0 0 1-8-8z" style="fill:var(--hk-water)" opacity="0.8"/></g>' +
          '</g>' +

          /* crijevo i usnik */
          '<g class="gs-part gs-hose" style="--d:0.45s">' +
            '<path d="' + hose + '" fill="none" style="stroke:var(--hk-hose)" stroke-width="11" stroke-linecap="round"/>' +
            '<path d="' + hose + '" fill="none" style="stroke:var(--hk-line)" stroke-width="1.4" stroke-linecap="round"/>' +
            '<g transform="translate(328 508) rotate(14)"><path d="M-6 0L-4 -46Q0 -54 4 -46L6 0Z" style="fill:url(#' + id + '-m)"/></g>' +
          '</g>' +

          /* stub i tacna */
          '<g class="gs-part gs-stem" style="--d:0s">' +
            '<rect x="124" y="116" width="12" height="256" rx="4" style="fill:url(#' + id + '-m)"/>' +
            '<circle cx="130" cy="176" r="14" style="fill:url(#' + id + '-m)"/>' +
            '<ellipse cx="130" cy="256" rx="12" ry="19" style="fill:url(#' + id + '-m)"/>' +
            '<rect x="136" y="294" width="26" height="10" rx="3" style="fill:url(#' + id + '-m)"/>' +
            '<rect x="115" y="354" width="30" height="12" rx="4" style="fill:var(--hk-metal-hi)"/>' +
          '</g>' +
          '<g class="gs-part gs-tray" style="--d:0.2s">' +
            '<ellipse cx="130" cy="130" rx="72" ry="11" style="fill:url(#' + id + '-m)"/>' +
            '<ellipse cx="130" cy="127" rx="62" ry="6.5" style="fill:var(--hk-metal-hi)" opacity="0.45"/>' +
          '</g>' +

          /* posuda, duhan, folija, ugljevi */
          '<g class="gs-part gs-bowl" style="--d:0.3s">' +
            '<path d="' + bowl + '" fill="#9a5a3a"/>' +
            '<path d="M92 44L168 44L162 58C158 78 140 90 136 106L130 106C134 88 150 76 154 58Z" fill="#6e3a24" opacity="0.6"/>' +
            '<rect x="122" y="104" width="16" height="14" rx="3" style="fill:var(--hk-metal-hi)"/>' +
            '<g class="gs-tobacco-in"><ellipse cx="130" cy="47" rx="36" ry="6" fill="#5a2f1a"/><path d="' + shreds + '" stroke="#8a4a26" stroke-width="2" fill="none" stroke-linecap="round"/></g>' +
            '<g class="gs-foil"><ellipse cx="130" cy="43" rx="40" ry="6" fill="#d6d2cc"/><ellipse cx="130" cy="42" rx="34" ry="3.5" fill="#f2efeb" opacity="0.8"/><g fill="#6b6560">' + holes + '</g></g>' +
            '<ellipse class="gs-glow" cx="130" cy="34" rx="80" ry="56" fill="url(#' + id + '-glow)"/>' +
            coal(102, 24, 'gs-coal gs-coal--1') + coal(120, 20, 'gs-coal gs-coal--2') + coal(138, 25, 'gs-coal gs-coal--3') +
          '</g>' +
          '<g class="gs-fall" fill="none" stroke="#8a4a26" stroke-width="2.4" stroke-linecap="round">' + falling + '</g>' +
        '</g>' +

        /* pakovanje duhana (korak 3) */
        '<g class="gs-pack" transform="translate(352 190)">' +
          '<path d="M-44 -10h88l-8 60h-72z" fill="#2f2622" stroke="currentColor" stroke-width="2"/>' +
          '<ellipse cx="0" cy="-10" rx="44" ry="9" fill="#5a2f1a"/>' +
          '<path d="M-30 -12c3-3 6 3 9 0M-10 -8c3-3 6 3 9 0M8 -13c3-3 6 3 9 0M22 -7c3-3 6 3 9 0" stroke="#a0582c" stroke-width="2" fill="none" stroke-linecap="round"/>' +
          '<circle cx="-14" cy="-14" r="4" fill="#f8cf4a"/><circle cx="16" cy="-12" r="3.5" fill="#f45e7c"/><circle cx="4" cy="-6" r="3" fill="#3fc08a"/>' +
          '<g class="gs-spoon"><path d="M10 -60L-4 -12" stroke="currentColor" stroke-width="4" stroke-linecap="round"/><ellipse cx="-6" cy="-10" rx="6" ry="4" fill="currentColor"/></g>' +
          '<g class="gs-drip"><circle cx="-36" cy="54" r="3" fill="#7a3d18"/></g>' +
        '</g>' +

        /* rešo sa ugljevima (koraci 6 i 7) */
        '<g class="gs-burner">' +
          '<rect x="20" y="520" width="120" height="30" rx="6" fill="#2a2522" stroke="currentColor" stroke-width="2"/>' +
          '<path d="M30 520v-10h100v10" fill="none" stroke="currentColor" stroke-width="2"/>' +
          '<circle cx="124" cy="535" r="5" fill="#8a8580"/>' +
          '<ellipse class="gs-burner-glow" cx="80" cy="500" rx="70" ry="30" fill="url(#' + id + '-glow)"/>' +
          coal(46, 494, 'gs-bcoal gs-bcoal--1') + coal(70, 492, 'gs-bcoal gs-bcoal--2') + coal(94, 494, 'gs-bcoal gs-bcoal--3') +
        '</g>' +
      '</svg>'
    );
  };

  /* ------------------------------------------------------------------ */
  /* Oprema: presjeci posuda, ugljevi, folija/HMD                         */
  /* ------------------------------------------------------------------ */

  function heatParticles(xs, yFrom, yTo) {
    return xs.map(function (x, i) {
      return '<circle class="hp" style="--d:' + (i * 0.35).toFixed(2) + 's;--dy:' + (yTo - yFrom) + 'px" cx="' + x + '" cy="' + yFrom + '" r="3"/>';
    }).join('');
  }

  var TOBACCO = '#6b3a1f';
  var CLAY = '#9a5a3a';
  var CLAY_D = '#6e3a24';

  /** Crtež za stavku opreme (ključ `visual` iz data/gear.js). */
  MSP.gearVisual = function (key) {
    var id = uid('gv');
    var defs = '<defs><radialGradient id="' + id + 'h" cx="0.5" cy="0.35" r="0.75"><stop offset="0" stop-color="#fff1b8"/><stop offset="0.4" stop-color="#ffb13b"/><stop offset="1" stop-color="#c2410c"/></radialGradient></defs>';
    var coalsTop = '<g class="gv-coals"><rect x="78" y="22" width="24" height="16" rx="3" fill="url(#' + id + 'h)"/><rect x="108" y="18" width="24" height="17" rx="3" fill="url(#' + id + 'h)"/><rect x="138" y="22" width="24" height="16" rx="3" fill="url(#' + id + 'h)"/></g>';
    var foil = '<path d="M50 42h140" stroke="#d6d2cc" stroke-width="4"/>';
    var wrap = function (inner) {
      return '<svg class="gv" viewBox="0 0 240 200" aria-hidden="true" focusable="false">' + defs + inner + '</svg>';
    };
    var tobaccoTex = '<path d="M64 60c4-4 8 4 12 0M92 72c4-4 8 4 12 0M136 62c4-4 8 4 12 0M160 76c4-4 8 4 12 0M80 88c4-4 8 4 12 0M150 92c4-4 8 4 12 0" stroke="#a0582c" stroke-width="2" fill="none" stroke-linecap="round"/>';

    if (key === 'classic') {
      return wrap(
        /* zidovi posude u presjeku */
        '<path d="M40 44h14l20 76h-12z" fill="' + CLAY + '"/><path d="M200 44h-14l-20 76h12z" fill="' + CLAY_D + '"/>' +
        '<path d="M54 44h132l-20 76H74z" fill="' + TOBACCO + '"/>' + tobaccoTex +
        '<path d="M62 120h116v10H62z" fill="' + CLAY + '"/>' +
        '<path d="M92 120v10M120 120v10M148 120v10" stroke="#1a1411" stroke-width="5"/>' +
        '<path d="M108 130h24v60h-24z" fill="#8a8580" opacity="0.6"/>' +
        foil + coalsTop +
        heatParticles([84, 104, 124, 144, 160], 48, 116) +
        '<g class="jd-wrap"><circle class="jd" style="--d:0s" cx="92" cy="128" r="3.5"/><circle class="jd" style="--d:0.9s" cx="148" cy="128" r="3.5"/><circle class="jd" style="--d:1.7s" cx="120" cy="128" r="3.5"/></g>'
      );
    }
    if (key === 'phunnel') {
      return wrap(
        '<path d="M40 44h14l20 76h-12z" fill="' + CLAY + '"/><path d="M200 44h-14l-20 76h12z" fill="' + CLAY_D + '"/>' +
        '<path d="M54 44h132l-20 76H74z" fill="' + TOBACCO + '"/>' + tobaccoTex +
        '<path d="M62 120h116v10H62z" fill="' + CLAY + '"/>' +
        '<path d="M108 130V74l12-14 12 14v56z" fill="' + CLAY + '"/>' +
        '<path d="M116 130V70h8v60z" fill="#1a1411"/>' +
        '<path d="M108 130h24v60h-24z" fill="#8a8580" opacity="0.6"/>' +
        '<path class="jd-pool" d="M76 116h32M132 116h32" stroke="#c4671f" stroke-width="5" stroke-linecap="round" opacity="0.85"/>' +
        foil + coalsTop +
        heatParticles([84, 100, 140, 156], 48, 106) +
        '<circle class="hp hp--in" style="--d:0.4s;--dy:120px" cx="120" cy="56" r="3"/>' +
        '<g class="jd-wrap"><circle class="jd jd--short" style="--d:0s" cx="90" cy="100" r="3"/><circle class="jd jd--short" style="--d:1s" cx="150" cy="100" r="3"/></g>'
      );
    }
    if (key === 'vortex') {
      return wrap(
        '<path d="M40 44h14l20 76h-12z" fill="' + CLAY + '"/><path d="M200 44h-14l-20 76h12z" fill="' + CLAY_D + '"/>' +
        '<path d="M54 44h132l-20 76H74z" fill="' + TOBACCO + '"/>' + tobaccoTex +
        '<path d="M62 120h116v10H62z" fill="' + CLAY + '"/>' +
        '<path d="M106 130V64h28v66z" fill="' + CLAY + '"/>' +
        '<path d="M114 130V64h12v66z" fill="#1a1411"/>' +
        '<path d="M106 92h8M126 92h8" stroke="#1a1411" stroke-width="6"/>' +
        '<path d="M108 130h24v60h-24z" fill="#8a8580" opacity="0.6"/>' +
        '<path class="jd-pool" d="M76 116h30M134 116h30" stroke="#c4671f" stroke-width="5" stroke-linecap="round" opacity="0.85"/>' +
        foil + coalsTop +
        heatParticles([84, 98, 142, 156], 48, 88) +
        '<circle class="hp hp--side" style="--d:0.3s;--dx:14px;--dy:44px" cx="96" cy="50" r="3"/><circle class="hp hp--side" style="--d:1.1s;--dx:-14px;--dy:44px" cx="144" cy="50" r="3"/>' +
        '<g class="jd-wrap"><circle class="jd jd--short" style="--d:0.2s" cx="88" cy="100" r="3"/><circle class="jd jd--short" style="--d:1.2s" cx="152" cy="100" r="3"/></g>'
      );
    }
    if (key === 'cube' || key === 'flat' || key === 'quick') {
      var shape = key === 'cube'
        ? '<path d="M80 80l40-20 40 20v50l-40 20-40-20z" fill="#3a3431"/><path d="M80 80l40 20 40-20M120 100v50" stroke="#1a1411" stroke-width="2" fill="none"/><path class="gv-hot" d="M80 80l40-20 40 20-40 20z" fill="url(#' + id + 'h)"/>'
        : key === 'flat'
          ? '<path d="M60 110l60-22 60 22-60 22z" fill="#3a3431"/><path d="M60 110v12l60 22 60-22v-12" fill="#2b2522"/><path class="gv-hot" d="M60 110l60-22 60 22-60 22z" fill="url(#' + id + 'h)"/>'
          : '<ellipse cx="120" cy="112" rx="56" ry="18" fill="#2b2522"/><path d="M64 112v14c0 10 25 18 56 18s56-8 56-18v-14" fill="#1f1a18"/><ellipse class="gv-hot" cx="120" cy="112" rx="46" ry="13" fill="url(#' + id + 'h)"/>' +
            '<g class="gv-sparks" fill="#ffd27a"><circle cx="96" cy="84" r="2.5"/><circle cx="130" cy="76" r="2"/><circle cx="150" cy="88" r="2.5"/></g>';
      return wrap('<ellipse cx="120" cy="170" rx="80" ry="8" fill="#000" opacity="0.2"/>' + shape + '<g class="gv-smoke"><path d="M110 60c-6-8 6-14 0-24M132 58c-6-8 6-14 0-24" stroke="currentColor" stroke-width="2" fill="none" opacity="0.5" stroke-linecap="round"/></g>');
    }
    if (key === 'foil' || key === 'hmd') {
      var top = key === 'foil'
        ? '<path d="M44 60c30-8 122-8 152 0" stroke="#d6d2cc" stroke-width="5" fill="none"/><g fill="#6b6560"><circle cx="80" cy="56" r="2"/><circle cx="100" cy="54" r="2"/><circle cx="120" cy="54" r="2"/><circle cx="140" cy="54" r="2"/><circle cx="160" cy="56" r="2"/></g>' +
          '<g class="gv-coals"><rect x="80" y="36" width="22" height="15" rx="3" fill="url(#' + id + 'h)"/><rect x="138" y="36" width="22" height="15" rx="3" fill="url(#' + id + 'h)"/></g>'
        : '<path d="M64 60h112v-26h-112z" fill="#9aa3ab"/><path d="M64 34h112" stroke="#c9d1d8" stroke-width="4"/><path d="M84 60v-10M100 60v-10M140 60v-10M156 60v-10" stroke="#5c646b" stroke-width="3"/>' +
          '<g class="gv-coals"><rect x="92" y="14" width="24" height="16" rx="3" fill="url(#' + id + 'h)"/><rect x="124" y="14" width="24" height="16" rx="3" fill="url(#' + id + 'h)"/></g>';
      return wrap(
        '<path d="M44 62h152l-26 70H70z" fill="' + CLAY + '"/><path d="M54 62h132l-18 56H72z" fill="' + TOBACCO + '"/>' +
        top + heatParticles([90, 120, 150], 66, 108)
      );
    }
    return wrap('');
  };

  /* ------------------------------------------------------------------ */
  /* Kartice "Istraži" na početnoj                                        */
  /* ------------------------------------------------------------------ */

  MSP.exploreArt = function (kind) {
    var id = uid('xa');
    if (kind === 'mixer') {
      return (
        '<svg viewBox="0 0 240 160" class="xart">' +
          '<defs>' +
            '<radialGradient id="' + id + 'a"><stop offset="0" stop-color="#f8cf4a" stop-opacity="0.9"/><stop offset="1" stop-color="#f8cf4a" stop-opacity="0"/></radialGradient>' +
            '<radialGradient id="' + id + 'b"><stop offset="0" stop-color="#f45e7c" stop-opacity="0.9"/><stop offset="1" stop-color="#f45e7c" stop-opacity="0"/></radialGradient>' +
          '</defs>' +
          '<circle class="xart__blob xart__blob--a" cx="92" cy="84" r="56" fill="url(#' + id + 'a)"/>' +
          '<circle class="xart__blob xart__blob--b" cx="148" cy="84" r="56" fill="url(#' + id + 'b)"/>' +
          '<path class="xart__line" d="M20 120C60 120 70 70 120 76" stroke="#f8cf4a"/>' +
          '<path class="xart__line" d="M220 120C180 120 170 70 120 76" stroke="#f45e7c"/>' +
          '<path class="xart__line xart__line--up" d="M120 76C112 56 130 44 122 24" stroke="#f4ebdf"/>' +
        '</svg>'
      );
    }
    if (kind === 'quiz') {
      return (
        '<svg viewBox="0 0 240 160" class="xart">' +
          '<path class="xart__line xart__q" d="M96 56C96 36 112 26 124 26C140 26 152 38 150 54C148 70 126 72 124 92V104" stroke="#f2a33c" stroke-width="10"/>' +
          '<circle class="xart__dot" cx="124" cy="128" r="8" fill="#ff8a2a"/>' +
          '<path class="xart__line xart__line--up" d="M60 120C54 100 70 92 62 72" stroke="#f4ebdf"/>' +
          '<path class="xart__line xart__line--up" d="M184 118C178 98 194 90 186 70" stroke="#f4ebdf" style="animation-delay:-1.2s"/>' +
        '</svg>'
      );
    }
    // vodič: mala nargila sa numerisanim tačkama koraka
    return (
      '<svg viewBox="0 0 240 160" class="xart">' +
        '<path class="xart__line" d="M110 20h20l-4 10c-2 6-6 8-6 14h-0c0-6-4-8-6-14z" stroke="#f4ebdf"/>' +
        '<path class="xart__line" d="M96 52h48M120 44v70" stroke="#d9b98a"/>' +
        '<path class="xart__line" d="M114 114h12v6c18 6 26 16 24 26c-2 8-14 12-26 12c-12 0-24-4-26-12c-2-10 6-20 24-26z" stroke="#f4ebdf"/>' +
        '<path class="xart__line" d="M126 88c24 0 30 20 34 40" stroke="#d9b98a"/>' +
        '<circle class="xart__step" cx="60" cy="40" r="11"/><text x="60" y="45" text-anchor="middle" class="xart__num">1</text>' +
        '<circle class="xart__step" cx="44" cy="84" r="11" style="animation-delay:.4s"/><text x="44" y="89" text-anchor="middle" class="xart__num">2</text>' +
        '<circle class="xart__step" cx="60" cy="128" r="11" style="animation-delay:.8s"/><text x="60" y="133" text-anchor="middle" class="xart__num">3</text>' +
        '<path class="xart__line xart__line--up" d="M120 16C114 4 126 -2 120 -12" stroke="#f4ebdf"/>' +
      '</svg>'
    );
  };

  /* ------------------------------------------------------------------ */
  /* Ikone rječnika (48 x 48, linijski stil; klasa ga-* se animira)       */
  /* ------------------------------------------------------------------ */

  var HOT = '#ff8a2a';
  var GI = {
    hmd: '<path d="M10 30h28l-3 8H13z"/><path d="M14 30v-6h20v6"/><path d="M18 24v-4M24 24v-4M30 24v-4"/><g class="ga-glow"><rect x="16" y="15" width="7" height="5" rx="1.5" fill="' + HOT + '" stroke="none"/><rect x="25" y="15" width="7" height="5" rx="1.5" fill="' + HOT + '" stroke="none"/></g>',
    foil: '<path d="M8 26c8-4 24-4 32 0l-4 14H12z"/><path d="M8 26c8 4 24 4 32 0"/><g class="ga-glow" fill="currentColor" stroke="none"><circle cx="16" cy="27" r="1.2"/><circle cx="22" cy="28" r="1.2"/><circle cx="28" cy="28" r="1.2"/><circle cx="34" cy="27" r="1.2"/><circle cx="19" cy="25" r="1.2"/><circle cx="25" cy="25.5" r="1.2"/><circle cx="31" cy="25" r="1.2"/></g>',
    phunnel: '<path d="M8 16h32l-6 22H14z"/><path d="M20 38V26l4-6 4 6v12"/><g class="ga-drip"><circle cx="13" cy="30" r="1.6" fill="currentColor" stroke="none"/></g>',
    classic: '<path d="M8 16h32l-6 22H14z"/><path d="M19 38v4M24 38v4M29 38v4"/><g class="ga-drip"><circle cx="24" cy="42" r="1.6" fill="currentColor" stroke="none"/></g>',
    vortex: '<path d="M8 16h32l-6 22H14z"/><path d="M20 38V24h8v14"/><path d="M20 30h-2M28 30h2"/><g class="ga-spin"><path d="M24 26a2.5 2.5 0 1 1-2.5 2.5"/></g>',
    'coal-cube': '<rect x="12" y="18" width="24" height="18" rx="3"/><path d="M12 24h24M20 18v18"/><g class="ga-glow"><rect x="12" y="18" width="24" height="18" rx="3" fill="' + HOT + '" stroke="none" opacity="0.8"/></g>',
    'coal-quick': '<ellipse cx="24" cy="30" rx="14" ry="6"/><path d="M10 30v4c0 3 6 6 14 6s14-3 14-6v-4"/><g class="ga-glow" stroke="' + HOT + '"><path d="M18 20l2 4M24 16v6M30 20l-2 4"/></g>',
    stem: '<path d="M21 6h6v36h-6z"/><circle cx="24" cy="16" r="5"/><ellipse cx="24" cy="28" rx="4" ry="6"/><path d="M27 34h8" class="ga-sway"/>',
    vase: '<path d="M20 8h8v8c10 4 14 12 12 20c-2 6-8 8-16 8s-14-2-16-8c-2-8 2-16 12-20z"/><path d="M9 32h30" opacity="0.5"/><g class="ga-bob" fill="currentColor" stroke="none"><circle cx="22" cy="38" r="1.4"/><circle cx="26" cy="35" r="1.1"/></g>',
    tray: '<ellipse cx="24" cy="30" rx="18" ry="5"/><path d="M6 30v2c0 3 8 5 18 5s18-2 18-5v-2"/><path d="M22 18h4v10h-4z"/><g class="ga-drip" fill="currentColor" stroke="none"><circle cx="30" cy="22" r="1.2"/></g>',
    hose: '<path class="ga-dash" d="M8 12c16 0 12 22 24 22c6 0 8-6 8-12"/><path d="M40 22l-2-8h4z"/>',
    mouthpiece: '<path d="M18 40l4-30h4l4 30z"/><path d="M16 40h16"/><g class="ga-rise"><path d="M24 8c-3-3 3-5 0-8" opacity="0.8"/></g>',
    diffuser: '<path d="M22 6h4v26h-4z"/><path d="M18 32h12v6H18z"/><g class="ga-bob" fill="currentColor" stroke="none"><circle cx="16" cy="30" r="1.3"/><circle cx="32" cy="28" r="1.3"/><circle cx="20" cy="24" r="1"/><circle cx="29" cy="22" r="1"/></g>',
    valve: '<path d="M21 6h6v36h-6z"/><path d="M27 20h8v6h-8"/><circle cx="37" cy="23" r="2"/><g class="ga-rise"><path d="M40 20c3-3-2-5 1-8"/></g>',
    grommet: '<circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="7"/><g class="ga-spin"><path d="M24 10a14 14 0 0 1 12 7"/></g>',
    loose: '<path d="M8 18h32l-6 20H14z"/><g class="ga-bob" fill="none"><path d="M15 26c2-2 4 2 6 0M23 30c2-2 4 2 6 0M27 24c2-2 4 2 6 0M17 33c2-2 4 2 6 0"/></g>',
    dense: '<path d="M8 18h32l-6 20H14z"/><path d="M12 24h24M13 28h22M14 32h20M15 35h18"/><g class="ga-sway"><path d="M20 12v6M28 12v6M18 16l2 2 2-2M26 16l2 2 2-2"/></g>',
    burnt: '<path d="M8 20h32l-6 18H14z"/><g class="ga-rise"><path d="M18 14c-3-3 3-6 0-10M26 14c-3-3 3-6 0-10M34 14c-3-3 3-6 0-10"/></g><path d="M16 26l4 4 4-4 4 4 4-4" stroke="' + HOT + '"/>',
    molasses: '<path d="M14 10h20l-2 8H16z"/><path d="M16 18h16v20a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4z"/><g class="ga-drip"><path d="M24 18v6" /><circle cx="24" cy="27" r="1.8" fill="currentColor" stroke="none"/></g>',
    glycerin: '<path d="M20 8h8M22 8v8l-8 18a4 4 0 0 0 4 6h12a4 4 0 0 0 4-6l-8-18V8"/><path d="M16 30h16" opacity="0.5"/><g class="ga-rise"><path d="M24 6c-3-2 3-4 0-6"/></g>',
    strength: '<path d="M10 38h28"/><g class="ga-glow" fill="' + HOT + '" stroke="none"><rect x="12" y="28" width="6" height="8" rx="1"/><rect x="21" y="22" width="6" height="14" rx="1"/><rect x="30" y="14" width="6" height="22" rx="1"/></g>',
    'leaf-light': '<g class="ga-sway"><path d="M12 38C12 20 22 10 38 10c0 16-10 28-26 28z" fill="#e7c98a" fill-opacity="0.35"/><path d="M12 38L30 18"/></g>',
    'leaf-dark': '<g class="ga-sway"><path d="M12 38C12 20 22 10 38 10c0 16-10 28-26 28z" fill="#6b4323" fill-opacity="0.7"/><path d="M12 38L30 18"/></g>',
    preheat: '<path d="M10 34h28l-4 8H14z"/><g class="ga-glow"><rect x="14" y="26" width="8" height="6" rx="1.5" fill="' + HOT + '" stroke="none"/><rect x="26" y="26" width="8" height="6" rx="1.5" fill="' + HOT + '" stroke="none"/></g><g class="ga-rise"><path d="M18 20c-2-3 2-5 0-8M30 20c-2-3 2-5 0-8"/></g>',
    burner: '<rect x="8" y="28" width="32" height="12" rx="3"/><path d="M12 28v-4h24v4"/><g class="ga-glow"><rect x="14" y="18" width="8" height="6" rx="1.5" fill="' + HOT + '" stroke="none"/><rect x="26" y="18" width="8" height="6" rx="1.5" fill="' + HOT + '" stroke="none"/></g><circle cx="34" cy="34" r="2"/>',
    session: '<circle cx="24" cy="26" r="14"/><path d="M24 26V16M24 26l7 5"/><path d="M20 8h8"/><g class="ga-spin"><path d="M24 12a14 14 0 0 1 14 14"/></g>'
  };

  /** Mala ikona pojma iz rječnika. */
  MSP.glossaryIcon = function (key) {
    return (
      '<svg class="gicon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' +
        (GI[key] || GI.session) +
      '</svg>'
    );
  };

  /**
   * Inje u uglu ekrana: razgranati ledeni kristali koji rastu iz tačke (0,0).
   * Crta se jednom (deterministički), a CSS ga rotira za svaki ugao.
   */
  var frostCache = null;
  MSP.frostCorner = function () {
    if (!frostCache) {
    var seed = 7;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    var thick = '';
    var thin = '';
    function branch(x, y, ang, len, depth) {
      var x2 = x + Math.cos(ang) * len;
      var y2 = y + Math.sin(ang) * len;
      var seg = 'M' + n(x) + ' ' + n(y) + 'L' + n(x2) + ' ' + n(y2);
      if (depth === 0) thick += seg; else thin += seg;
      if (depth > 1 || len < 14) return;
      var steps = 3 + Math.floor(rnd() * 2);
      for (var i = 1; i <= steps; i++) {
        var t = i / (steps + 1);
        var bx = x + (x2 - x) * t;
        var by = y + (y2 - y) * t;
        var bl = len * (0.28 + rnd() * 0.22) * (1 - t * 0.4);
        branch(bx, by, ang + 1.05, bl, depth + 1);
        branch(bx, by, ang - 1.05, bl, depth + 1);
      }
    }
    for (var k = 0; k < 6; k++) {
      var a = (0.12 + k * 0.26) + (rnd() - 0.5) * 0.12;
      branch(0, 0, a, 120 + rnd() * 80, 0);
    }
    frostCache = { thick: thick, thin: thin };
    }
    var fid = uid('frost');
    return (
      '<svg class="frost-svg" viewBox="0 0 220 220" aria-hidden="true" focusable="false">' +
        '<defs><radialGradient id="' + fid + '" cx="0" cy="0" r="1"><stop offset="0" stop-color="#fff" stop-opacity="0.85"/><stop offset="0.45" stop-color="#e6f8ff" stop-opacity="0.35"/><stop offset="1" stop-color="#e6f8ff" stop-opacity="0"/></radialGradient></defs>' +
        '<rect width="220" height="220" fill="url(#' + fid + ')"/>' +
        '<path d="' + frostCache.thick + '" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/>' +
        '<path d="' + frostCache.thin + '" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity="0.75"/>' +
      '</svg>'
    );
  };

  /** Jedan ugalj (loader, profil "jačina"). Klasa .coal-hot se animira. */
  MSP.coal = function () {
    var id = uid('coal');
    return (
      '<svg class="coal-svg" viewBox="0 0 60 44" aria-hidden="true" focusable="false">' +
        '<defs>' + coalDefs(id) + '</defs>' +
        '<ellipse class="coal-glow" cx="30" cy="24" rx="30" ry="22" fill="url(#' + id + '-glow)"/>' +
        '<rect x="10" y="10" width="40" height="26" rx="6" fill="url(#' + id + '-cold)"/>' +
        '<rect class="coal-hot" x="10" y="10" width="40" height="26" rx="6" fill="url(#' + id + '-hot)"/>' +
        '<path d="M16 22h14M32 29h10" stroke="#1a1411" stroke-width="1.6" opacity="0.45"/>' +
      '</svg>'
    );
  };
})();
