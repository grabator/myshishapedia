/*
 * MyShishapedia - pogledi za kolekcije, poređenje, recepte miksova i okus dana.
 *
 * Nastavak js/views.js (isti MSP.V objekat). Kao i views.js, samo pravi HTML
 * stringove: koristi ga build.mjs za gotove stranice i browser za dijelove
 * koji se mijenjaju uživo (poređenje, okus dana).
 *
 * Ovisi o: views.js, strings.js, data/flavors.js, data/collections.js, data/mixes.js.
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  var esc = V.esc;
  var icon = V.icon;

  function t(k, v) { return MSP.t(k, v); }
  function L(v, lang) { return MSP.L(v, lang); }
  function C() { return MSP.color; }

  /** Skrati tekst na najviše max znakova (za meta opise), na granici riječi. */
  V.clip = function (s, max) {
    s = String(s || '').replace(/\s+/g, ' ').trim();
    max = max || 155;
    if (s.length <= max) return s;
    var cut = s.slice(0, max - 3);
    var sp = cut.lastIndexOf(' ');
    return cut.slice(0, sp > 60 ? sp : cut.length).replace(/[\s,.;:-]+$/, '') + '...';
  };

  function joinList(items) {
    if (items.length < 2) return items.join('');
    return items.slice(0, -1).join(t('flavor.listJoin')) + t('flavor.listLast') + items[items.length - 1];
  }

  /** Broj slova najduže riječi (da naslov stane u kolonu). */
  function longestWord(s) { return String(s).split(/\s+/).reduce(function (m, w) { return Math.max(m, w.length); }, 1); }

  function topIng(f) { return V.byIntensity(f)[0] || { illustration: 'fallback', color: '#ccc' }; }

  var uidN = 0;
  function uid(p) { uidN += 1; return p + uidN; }

  /* ================================================================== */
  /* Kolekcije                                                           */
  /* ================================================================== */

  V.collections = function () { return root.COLLECTIONS || []; };

  function ruleMatch(f, r) {
    if (!r) return false;
    var p = f.profile || {};
    var tags = f.tags || [];
    var k;
    if (r.min) for (k in r.min) if ((p[k] || 0) < r.min[k]) return false;
    if (r.max) for (k in r.max) if ((p[k] || 0) > r.max[k]) return false;
    if (r.anyTags && !r.anyTags.some(function (x) { return tags.indexOf(x) !== -1; })) return false;
    if (r.allTags && !r.allTags.every(function (x) { return tags.indexOf(x) !== -1; })) return false;
    if (r.leaf && (f.leaf || 'light') !== r.leaf) return false;
    if (r.anyOf && !r.anyOf.some(function (sub) { return ruleMatch(f, sub); })) return false;
    return true;
  }
  V.ruleMatch = ruleMatch;

  /** Okusi u kolekciji: pravilo + ručno uključeni, minus ručno izbačeni. Redoslijed kao u flavors.js. */
  V.collectionMembers = function (c) {
    var inc = c.include || [];
    var exc = c.exclude || [];
    return V.flavors().filter(function (f) {
      if (exc.indexOf(f.id) !== -1) return false;
      return inc.indexOf(f.id) !== -1 || ruleMatch(f, c.rule);
    });
  };

  V.collectionsOf = function (f) {
    return V.collections().filter(function (c) { return V.collectionMembers(c).indexOf(f) !== -1; });
  };

  V.collectionBySlug = function (slug, lang) {
    return V.collections().filter(function (c) { return c.slug[lang] === slug; })[0] || null;
  };

  V.collectionUrl = function (c, lang) { return V.urlFor(lang || MSP.lang, 'collection', c.slug[lang || MSP.lang]); };

  var colTheme = {};
  V.collectionTheme = function (c) {
    if (!colTheme[c.id]) colTheme[c.id] = V.computeTheme(c.palette, false);
    return colTheme[c.id];
  };

  var MOOD_ICON = {
    ice: '<path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/><path d="m9.5 3.5 2.5 2 2.5-2M9.5 20.5l2.5-2 2.5 2"/>',
    night: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    tropical: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
    calm: '<path d="M12 21c-4.4-2.6-8-6-8-10.2A4.6 4.6 0 0 1 12 8a4.6 4.6 0 0 1 8 2.8C20 15 16.4 18.4 12 21z"/>'
  };
  function moodIcon(mood) {
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (MOOD_ICON[mood] || MOOD_ICON.calm) + '</svg>';
  }
  V.moodIcon = moodIcon;

  /** Tropski list (palmin list) za atmosferu tropske kolekcije. */
  function palmLeaf(color) {
    var id = uid('pl');
    var leaflets = '';
    for (var i = 0; i < 11; i++) {
      var k = i / 10;
      var x = 20 + k * 150;
      var y = 150 - Math.sin(k * 2.6) * 70;
      var len = 70 - Math.abs(k - 0.45) * 60;
      var ang = -60 + k * 30;
      leaflets += '<ellipse cx="' + x.toFixed(1) + '" cy="' + (y - len / 2).toFixed(1) + '" rx="7" ry="' + (len / 2).toFixed(1) + '" transform="rotate(' + ang.toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
      leaflets += '<ellipse cx="' + x.toFixed(1) + '" cy="' + (y + len / 2).toFixed(1) + '" rx="7" ry="' + (len / 2).toFixed(1) + '" transform="rotate(' + (ang + 70).toFixed(1) + ' ' + x.toFixed(1) + ' ' + y.toFixed(1) + ')"/>';
    }
    return (
      '<svg viewBox="0 0 200 240" aria-hidden="true" focusable="false">' +
        '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + C().lighten(color, 0.25) + '"/><stop offset="1" stop-color="' + C().darken(color, 0.25) + '"/></linearGradient></defs>' +
        '<g fill="url(#' + id + ')">' + leaflets + '</g>' +
        '<path d="M8 160C60 150 130 110 185 20" fill="none" stroke="' + C().darken(color, 0.4) + '" stroke-width="4" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  /**
   * Atmosfera kolekcije. size 'hero' (cijela stranica) ili 'card' (pregled na kartici).
   * Sve animacije su CSS (gase se uz prefers-reduced-motion).
   */
  V.collectionMood = function (c, size) {
    var card = size === 'card';
    var i, out = '';
    if (c.mood === 'ice') {
      var n = card ? 10 : 26;
      for (i = 0; i < n; i++) {
        out += '<span class="flake flake--ice cm-anim" style="--x:' + ((i * 37.9 + 5) % 100).toFixed(1) + '%;--y:' + ((i * 23.3) % 100).toFixed(1) + '%;--s:' + ((card ? 6 : 8) + (i % 5) * 4) + 'px;--dur:' + (7 + (i % 5) * 1.6).toFixed(1) + 's;--dl:' + (-(i % 9) * 1.1).toFixed(1) + 's">' + icon('flake') + '</span>';
      }
      out += '<span class="cm-crystal cm-crystal--a cm-anim">' + MSP.illustrate('kristal', { color: '#dff4ff' }) + '</span>';
      out += '<span class="cm-crystal cm-crystal--b cm-anim">' + MSP.illustrate('kristal', { color: '#bfe6ff' }) + '</span>';
      return '<div class="cmood cmood--ice cmood--' + (card ? 'card' : 'hero') + '" aria-hidden="true"><span class="cmood__frost"></span>' + out + '</div>';
    }
    if (c.mood === 'night') {
      var stars = card ? 14 : 34;
      for (i = 0; i < stars; i++) {
        out += '<span class="star cm-anim" style="--x:' + ((i * 37.7) % 100).toFixed(1) + '%;--y:' + ((i * 53.3) % 80).toFixed(1) + '%;--s:' + (1 + ((i * 7) % 3)) + 'px;--tw:' + (2.5 + (i % 5) * 0.7).toFixed(1) + 's;--dl:' + (-(i % 7) * 0.6).toFixed(1) + 's"></span>';
      }
      return '<div class="cmood cmood--night cmood--' + (card ? 'card' : 'hero') + '" aria-hidden="true"><span class="cmood__moon"></span><span class="cmood__lamp cm-anim"></span>' + out + '</div>';
    }
    if (c.mood === 'tropical') {
      out += '<span class="cmood__sun cm-anim"></span>';
      var leaves = card
        ? [['#1f9d6b', 'tl'], ['#2fbf7f', 'br']]
        : [['#1f9d6b', 'tr'], ['#2fbf7f', 'mr'], ['#168a5c', 'br']];
      leaves.forEach(function (l, k) {
        out += '<span class="cm-leaf cm-leaf--' + l[1] + ' cm-anim" style="--dl:' + (-k * 1.3).toFixed(1) + 's">' + palmLeaf(l[0]) + '</span>';
      });
      return '<div class="cmood cmood--tropical cmood--' + (card ? 'card' : 'hero') + '" aria-hidden="true">' + out + '</div>';
    }
    for (i = 0; i < (card ? 4 : 7); i++) {
      out += '<span class="cm-mote cm-anim" style="--x:' + (10 + (i * 29.7) % 80).toFixed(1) + '%;--y:' + (20 + (i * 41.3) % 60).toFixed(1) + '%;--s:' + (card ? 80 : 160) * (0.6 + (i % 3) * 0.3) + 'px;--dur:' + (9 + i % 4 * 2) + 's;--dl:' + (-i * 1.7).toFixed(1) + 's"></span>';
    }
    return '<div class="cmood cmood--calm cmood--' + (card ? 'card' : 'hero') + '" aria-hidden="true">' + out + '</div>';
  };

  /** Velika kartica kolekcije (pregled kolekcija i početna). */
  V.collectionCard = function (c, headingTag, i) {
    var h = headingTag || 'h3';
    var th = V.collectionTheme(c);
    var members = V.collectionMembers(c);
    var chips = members.slice(0, 5).map(function (f, k) {
      var ft = V.themeFor(f);
      var ing = topIng(f);
      return '<span class="ccard__chip" style="--k:' + k + ';--chip:' + ft.bg + '">' + MSP.illustrate(ing.illustration, { color: ing.color }) + '</span>';
    }).join('');
    return (
      '<a class="ccard ccard--' + c.mood + '" href="' + V.collectionUrl(c) + '" data-veil="' + th.veil + '" data-reveal style="--i:' + (i || 0) + ';' +
        '--cc-bg:' + th.bg + ';--cc-text:' + th.text + ';--cc-muted:' + th.muted + ';--cc-accent:' + th.accentInk + ';--cc-glow:' + th.surface2 + '">' +
        V.collectionMood(c, 'card') +
        '<span class="ccard__body">' +
          '<span class="ccard__icon" aria-hidden="true">' + moodIcon(c.mood) + '</span>' +
          '<' + h + ' class="ccard__title">' + esc(L(c.title)) + '</' + h + '>' +
          '<span class="ccard__short">' + esc(L(c.short)) + '</span>' +
          '<span class="ccard__foot">' +
            '<span class="ccard__chips" aria-hidden="true">' + chips + '</span>' +
            '<span class="ccard__count">' + esc(MSP.plural('collections.count', members.length)) + '</span>' +
          '</span>' +
        '</span>' +
        '<span class="ccard__arrow" aria-hidden="true">' + icon('arrowUpRight') + '</span>' +
      '</a>'
    );
  };

  V.collectionBadges = function (f) {
    var cols = V.collectionsOf(f);
    if (!cols.length) return '';
    return (
      '<ul class="cbadges anim-in" style="--i:7" role="list" aria-label="' + esc(t('collections.badgesLabel')) + '">' +
        cols.map(function (c) {
          return '<li><a class="cbadge cbadge--' + c.mood + '" href="' + V.collectionUrl(c) + '">' + moodIcon(c.mood) + '<span>' + esc(L(c.title)) + '</span></a></li>';
        }).join('') +
      '</ul>'
    );
  };

  V.homeCollections = function () {
    return (
      '<section class="hcols" aria-labelledby="hcols-title">' +
        '<div class="container">' +
          '<header class="explore__head" data-reveal>' +
            '<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('collections.eyebrow')) + '</p>' +
            '<h2 class="catalog__title" id="hcols-title">' + esc(t('collections.homeTitle')) + '</h2>' +
            '<p class="hsec__lead">' + esc(t('collections.homeLead')) + '</p>' +
          '</header>' +
          '<ul class="ccards" role="list">' + V.collections().map(function (c, i) { return '<li>' + V.collectionCard(c, 'h3', i) + '</li>'; }).join('') + '</ul>' +
        '</div>' +
      '</section>'
    );
  };

  function pageCollections(crumbs) {
    return (
      V.pageHero({ id: 'cols-title', eyebrow: t('collections.eyebrow'), title: t('collections.title'), lead: t('collections.lead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container">' +
        '<ul class="ccards ccards--page" role="list">' + V.collections().map(function (c, i) { return '<li>' + V.collectionCard(c, 'h2', i) + '</li>'; }).join('') + '</ul>' +
      '</div></section>'
    );
  }

  function pageCollection(c, crumbs) {
    var members = V.collectionMembers(c);
    var intro = L(c.intro) || [];
    var others = V.collections().filter(function (x) { return x !== c; });
    return (
      '<section class="chero chero--' + c.mood + '" aria-labelledby="col-title">' +
        V.collectionMood(c, 'hero') +
        crumbs +
        '<div class="container chero__inner">' +
          '<p class="eyebrow anim-in" style="--i:0"><span class="chero__icon" aria-hidden="true">' + moodIcon(c.mood) + '</span>' + esc(t('collections.eyebrow')) + '</p>' +
          '<h1 class="phero__title chero__title anim-in" style="--i:1" id="col-title" tabindex="-1">' + esc(L(c.title)) + '</h1>' +
          '<div class="chero__intro">' + intro.map(function (p, i) { return '<p class="anim-in" style="--i:' + (i + 2) + '">' + esc(p) + '</p>'; }).join('') + '</div>' +
          '<p class="chero__count anim-in" style="--i:4">' + esc(MSP.plural('collections.count', members.length)) + '</p>' +
        '</div>' +
      '</section>' +
      (c.note
        ? '<section class="fsec fsec--tight" aria-labelledby="col-note-title"><div class="container">' +
            '<div class="cnote" data-reveal>' +
              '<span class="cnote__coal" aria-hidden="true">' + MSP.coal() + '</span>' +
              '<div><h2 class="cnote__title" id="col-note-title">' + esc(t('collections.whyTitle')) + '</h2><p>' + esc(L(c.note)) + '</p>' +
              (c.guideLink ? '<a class="btn btn--primary" href="' + V.url('guide') + '">' + esc(t('collections.guideCta')) + icon('arrowRight') + '</a>' : '') +
              '</div>' +
            '</div>' +
          '</div></section>'
        : '') +
      '<section class="fsec fsec--tight" aria-labelledby="col-flavors"><div class="container">' +
        '<h2 class="mix__h" id="col-flavors">' + esc(t('collections.flavorsTitle')) + '</h2>' +
        (members.length
          ? '<ul class="grid grid--big" id="collection-grid" role="list">' + members.map(function (f, i) { return '<li class="grid__item" data-reveal style="--i:' + (i % 2) + '">' + V.card(f, 'h3') + '</li>'; }).join('') + '</ul>'
          : '<p>' + esc(t('collections.empty')) + '</p>') +
      '</div></section>' +
      '<section class="fsec fsec--alt" aria-labelledby="col-others"><div class="container">' +
        '<h2 class="mix__h" id="col-others">' + esc(t('collections.otherTitle')) + '</h2>' +
        '<ul class="ccards ccards--small" role="list">' + others.map(function (x, i) { return '<li>' + V.collectionCard(x, 'h3', i) + '</li>'; }).join('') + '</ul>' +
        '<p><a class="btn btn--ghost" href="' + V.url('collections') + '">' + icon('arrowLeft') + '<span>' + esc(t('collections.allCollections')) + '</span></a></p>' +
      '</div></section>'
    );
  }

  /* ================================================================== */
  /* Recepti miksova                                                     */
  /* ================================================================== */

  V.mixes = function () { return root.MIXES || []; };
  V.recipeById = function (id) { return V.mixes().filter(function (m) { return m.id === id; })[0] || null; };
  V.recipeBySlug = function (slug, lang) { return V.mixes().filter(function (m) { return m.slug[lang] === slug; })[0] || null; };
  V.recipeUrl = function (m, lang) { return V.urlFor(lang || MSP.lang, 'recipe', m.slug[lang || MSP.lang]); };
  V.recipeFlavors = function (m) { return m.parts.map(function (p) { return V.flavorById(p.flavor); }); };
  V.mixesWith = function (f) {
    return V.mixes().filter(function (m) { return m.parts.some(function (p) { return p.flavor === f.id; }); });
  };
  V.recipeMixerUrl = function (m, lang) {
    var fl = V.recipeFlavors(m);
    return V.mixUrl(fl[0], fl[1], m.parts[0].pct, lang);
  };
  V.recipePartsText = function (m) {
    return m.parts.map(function (p) { var f = V.flavorById(p.flavor); return (f ? V.uniqueName(f) : p.flavor) + ' ' + p.pct + '%'; }).join(' + ');
  };

  var recTheme = {};
  V.recipeTheme = function (m) {
    if (!recTheme[m.id]) {
      var fl = V.recipeFlavors(m);
      // stopljena paleta, ali nagnuta prema dominantnom okusu (jednak omjer ostaje 50/50),
      // da spoj vrlo različitih boja (npr. žuta i plava) ne ispadne mutan
      var r = m.parts[0].pct / 100;
      var lean = r === 0.5 ? 0.5 : r > 0.5 ? Math.min(0.9, 0.5 + (r - 0.5) * 1.6) : Math.max(0.1, 0.5 - (0.5 - r) * 1.6);
      recTheme[m.id] = V.computeTheme(V.blendPalette(fl[0], fl[1], lean), false);
    }
    return recTheme[m.id];
  };

  function dist(x, y) {
    var a = C().hexToRgb(x), b = C().hexToRgb(y);
    return Math.sqrt(Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2));
  }

  /** Boje sektora: glavna boja svakog okusa; ako su dvije preslične, drugi uzima najrazličitiju iz svoje palete. */
  function sectorColors(fl) {
    var cols = fl.map(function (f) { return f.palette.primary; });
    if (cols.length > 1 && dist(cols[0], cols[1]) < 90) {
      var p = fl[1].palette;
      cols[1] = [p.secondary, p.accent, p.primary].sort(function (x, y) { return dist(y, cols[0]) - dist(x, cols[0]); })[0];
    }
    return cols;
  }
  V.sectorColors = function (m) { return sectorColors(V.recipeFlavors(m)); };

  /**
   * Posuda nargile odozgo, duhan podijeljen u sektore tačno po omjeru.
   * Sektori su debeli luk kruga (stroke) sa pathLength=100, pa je dužina luka = procenat.
   */
  V.bowlTop = function (m, opts) {
    opts = opts || {};
    var id = uid('bw');
    var fl = V.recipeFlavors(m);
    var R = 44;
    var circ = 2 * Math.PI * R;
    var cols = sectorColors(fl);
    var start = 0;
    var sectors = '';
    var dividers = '';
    m.parts.forEach(function (p, i) {
      var col = cols[i];
      var rot = -90 + start * 3.6;
      // stvarna dužina luka (+ mali preklop da nema šava između sektora)
      var len = (p.pct / 100) * circ + 0.8;
      sectors +=
        '<circle class="bw-sec" cx="120" cy="120" r="' + R + '" fill="none" stroke="' + col + '" stroke-width="' + (R * 2) + '" ' +
          'stroke-dasharray="' + len.toFixed(2) + ' ' + circ.toFixed(2) + '" transform="rotate(' + rot.toFixed(2) + ' 120 120)" style="--circ:' + circ.toFixed(2) + ';--k:' + i + '"/>';
      var a = (rot * Math.PI) / 180;
      dividers += '<line x1="120" y1="120" x2="' + (120 + Math.cos(a) * 88).toFixed(2) + '" y2="' + (120 + Math.sin(a) * 88).toFixed(2) + '" class="bw-div"/>';
      start += p.pct;
    });
    // sitna tekstura duhana: kratki potezi preko sektora
    var shreds = '';
    for (var k = 0; k < 70; k++) {
      var ang = k * 2.39996;
      var rr = 8 + ((k * 37) % 76);
      var x = 120 + Math.cos(ang) * rr;
      var y = 120 + Math.sin(ang) * rr;
      var dx = Math.cos(ang * 3) * 5;
      var dy = Math.sin(ang * 3) * 5;
      shreds += 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'q' + (dx / 2 + 2).toFixed(1) + ' ' + (dy / 2 - 2).toFixed(1) + ' ' + dx.toFixed(1) + ' ' + dy.toFixed(1);
    }
    var label = opts.label ? ' role="img" aria-label="' + esc(t('mixes.bowlLabel', { parts: V.recipePartsText(m) })) + '"' : ' aria-hidden="true"';
    return (
      '<svg class="bowl-top' + (opts.cls ? ' ' + opts.cls : '') + '" viewBox="0 0 240 240"' + label + ' focusable="false">' +
        '<defs>' +
          '<radialGradient id="' + id + '-rim" cx="0.45" cy="0.4" r="0.65"><stop offset="0.7" stop-color="#a0522d"/><stop offset="0.86" stop-color="#7a3b1e"/><stop offset="1" stop-color="#4a220f"/></radialGradient>' +
          '<radialGradient id="' + id + '-shade" cx="0.5" cy="0.5" r="0.5"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.35"/></radialGradient>' +
          '<clipPath id="' + id + '-clip"><circle cx="120" cy="120" r="88"/></clipPath>' +
        '</defs>' +
        '<circle cx="120" cy="124" r="112" fill="#000" opacity="0.22"/>' +
        '<circle cx="120" cy="120" r="110" fill="url(#' + id + '-rim)"/>' +
        '<circle cx="120" cy="120" r="94" fill="#3a1d0e"/>' +
        '<g clip-path="url(#' + id + '-clip)">' +
          sectors +
          '<path d="' + shreds + '" fill="none" stroke="#2a1408" stroke-opacity="0.28" stroke-width="1.6" stroke-linecap="round"/>' +
          (m.parts.length > 1 ? dividers : '') +
          '<circle cx="120" cy="120" r="88" fill="url(#' + id + '-shade)"/>' +
        '</g>' +
        '<circle cx="120" cy="120" r="102" fill="none" stroke="#c77a45" stroke-opacity="0.55" stroke-width="2"/>' +
        '<ellipse cx="92" cy="62" rx="26" ry="8" fill="#fff" opacity="0.14" transform="rotate(-28 92 62)"/>' +
      '</svg>'
    );
  };

  function strengthBadge(m) {
    return '<span class="rbadge rbadge--' + m.strength + '"><span class="rbadge__dots" aria-hidden="true">' +
      ['light', 'medium', 'strong'].map(function (s, i) { return '<i' + (i <= ['light', 'medium', 'strong'].indexOf(m.strength) ? ' class="on"' : '') + '></i>'; }).join('') +
      '</span>' + esc(t('mixes.strengthLabel')) + ': ' + esc(t('mixes.strength.' + m.strength)) + '</span>';
  }

  V.recipeCard = function (m, headingTag, i) {
    var h = headingTag || 'h3';
    var th = V.recipeTheme(m);
    return (
      '<a class="rcard" href="' + V.recipeUrl(m) + '" data-rid="' + esc(m.id) + '" data-veil="' + th.veil + '" data-tags="' + esc(m.tags.join(' ')) + '" data-strength="' + m.strength + '" style="--i:' + (i || 0) + ';' +
        '--rc-bg:' + th.bg + ';--rc-text:' + th.text + ';--rc-muted:' + th.muted + ';--rc-accent:' + th.accentInk + ';--rc-glow:' + th.surface2 + '">' +
        '<span class="rcard__bowl">' + V.bowlTop(m, { cls: 'bowl-top--card' }) + '</span>' +
        '<span class="rcard__body">' +
          '<' + h + ' class="rcard__name">' + esc(L(m.name)) + '</' + h + '>' +
          '<span class="rcard__parts">' + esc(V.recipePartsText(m)) + '</span>' +
          '<span class="rcard__meta">' + strengthBadge(m) + '</span>' +
        '</span>' +
        '<span class="card__arrow" aria-hidden="true">' + icon('arrowUpRight') + '</span>' +
        V.rateSlot('recipe', m.id, 'rpill--card') +
      '</a>'
    );
  };

  function recipeGrid(list, id, h) {
    return '<ul class="rcards"' + (id ? ' id="' + id + '"' : '') + ' role="list">' + list.map(function (m, i) {
      return '<li class="rcards__item" data-reveal style="--i:' + (i % 3) + '">' + V.recipeCard(m, h || 'h3', i % 3) + '</li>';
    }).join('') + '</ul>';
  }

  V.homeMixes = function () {
    var list = V.mixes().filter(function (m) { return m.featured; }).slice(0, 3);
    if (!list.length) return '';
    return (
      '<section class="hmixes" aria-labelledby="hmixes-title">' +
        '<div class="container">' +
          '<header class="explore__head hmixes__head" data-reveal>' +
            '<div><p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('mixes.eyebrow')) + '</p>' +
            '<h2 class="catalog__title" id="hmixes-title">' + esc(t('mixes.featuredTitle')) + '</h2>' +
            '<p class="hsec__lead">' + esc(t('mixes.featuredLead')) + '</p></div>' +
            '<a class="btn btn--ghost" href="' + V.url('mixes') + '"><span>' + esc(t('mixes.allMixes')) + '</span>' + icon('arrowRight') + '</a>' +
          '</header>' +
          recipeGrid(list) +
        '</div>' +
      '</section>'
    );
  };

  V.flavorRecipesSection = function (f, nextNum) {
    var list = V.mixesWith(f);
    if (!list.length) return '';
    return (
      '<section class="fsec fsec--alt" aria-labelledby="sec-recipes"><div class="container">' +
        V.sectionHead(nextNum(), t('mixes.withFlavorTitle'), t('mixes.withFlavorIntro'), 'sec-recipes') +
        recipeGrid(list) +
      '</div></section>'
    );
  };

  var TAG_ORDER = ['vocni', 'tropski', 'ledeni', 'nocni', 'bobicasti', 'medeni', 'bombon', 'ljetni', 'slatki', 'mint'];

  function pageMixes(crumbs) {
    var used = {};
    V.mixes().forEach(function (m) { m.tags.forEach(function (x) { used[x] = 1; }); });
    var tags = TAG_ORDER.filter(function (x) { return used[x]; }).concat(Object.keys(used).filter(function (x) { return TAG_ORDER.indexOf(x) === -1; }));
    var chip = function (attr, val, label, on) {
      return '<button type="button" class="chip' + (on ? ' is-active' : '') + '" ' + attr + '="' + esc(val) + '" aria-pressed="' + on + '">' + esc(label) + '</button>';
    };
    return (
      V.pageHero({ id: 'mixes-title', eyebrow: t('mixes.eyebrow'), title: t('mixes.title'), lead: t('mixes.lead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container">' +
        '<div class="rfilters">' +
          '<div class="filters" role="group" aria-label="' + esc(t('mixes.filtersTag')) + '" id="mix-tags">' +
            chip('data-tag', '', t('mixes.all'), true) + tags.map(function (x) { return chip('data-tag', x, MSP.tagLabel(x), false); }).join('') +
          '</div>' +
          '<div class="filters filters--strength" role="group" aria-label="' + esc(t('mixes.filtersStrength')) + '" id="mix-strength">' +
            chip('data-strength', '', t('mixes.all'), true) + ['light', 'medium', 'strong'].map(function (s) { return chip('data-strength', s, t('mixes.strength.' + s), false); }).join('') +
          '</div>' +
        '</div>' +
        '<p class="catalog__count" id="mix-count" aria-live="polite">' + esc(MSP.plural('mixes.count', V.mixes().length)) + '</p>' +
        recipeGrid(V.mixes(), 'mix-grid', 'h2') +
        '<div class="empty" id="mix-empty" hidden><p class="empty__title">' + esc(t('mixes.empty')) + '</p>' +
          '<button type="button" class="btn btn--ghost" id="mix-reset">' + esc(t('mixes.reset')) + '</button></div>' +
        '<p class="mix__note" role="note">' + icon('alert') + '<span>' + esc(t('mixes.note')) + '</span></p>' +
      '</div></section>'
    );
  }

  function pageRecipe(m, crumbs) {
    var fl = V.recipeFlavors(m);
    var a = fl[0], b = fl[1], r = m.parts[0].pct / 100;
    var ings = V.mergedIngredients(a, b, r);
    var prof = V.blendedProfile(a, b, r);
    var desc = L(m.description) || [];
    var tips = L(m.tips) || [];
    var others = V.mixes().filter(function (x) { return x !== m; });
    // prvo recepti koji dijele okus
    others.sort(function (x, y) {
      var sx = x.parts.some(function (p) { return p.flavor === a.id || p.flavor === b.id; }) ? 0 : 1;
      var sy = y.parts.some(function (p) { return p.flavor === a.id || p.flavor === b.id; }) ? 0 : 1;
      return sx - sy;
    });
    var smoke = fl.map(function (f) { return V.themeFor(f).smoke.join(','); }).join('|');
    var scols = sectorColors(fl);
    var legend = m.parts.map(function (p, i) {
      var f = fl[i];
      return '<li style="--sw:' + scols[i] + '"><span class="rlegend__sw" aria-hidden="true"></span><b>' + p.pct + '%</b> ' + esc(f.name) + '</li>';
    }).join('');
    var flavorLinks = m.parts.map(function (p, i) {
      var f = fl[i];
      var ft = V.themeFor(f);
      var ing = topIng(f);
      return (
        '<li><a class="rflavor" href="' + V.flavorUrl(f) + '" data-veil="' + ft.veil + '" style="--rf-bg:' + ft.bg + ';--rf-text:' + ft.text + ';--rf-muted:' + ft.muted + '">' +
          '<span class="rflavor__art" aria-hidden="true">' + MSP.illustrate(ing.illustration, { color: ing.color }) + '</span>' +
          '<span class="rflavor__txt"><span class="rflavor__pct">' + p.pct + '%</span><span class="rflavor__brand">' + esc(f.brand) + '</span><span class="rflavor__name">' + esc(f.name) + '</span></span>' +
          icon('arrowUpRight', 'rflavor__go') +
        '</a></li>'
      );
    }).join('');
    return (
      '<article class="recipe" data-smoke="' + esc(smoke) + '">' +
        '<section class="rhero" aria-labelledby="recipe-title">' +
          crumbs +
          '<div class="container rhero__inner">' +
            '<div class="rhero__copy">' +
              '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('mixes.eyebrow')) + '</p>' +
              '<h1 class="phero__title rhero__title anim-in" style="--i:1;--len:' + longestWord(L(m.name)) + '" id="recipe-title" tabindex="-1">' + esc(L(m.name)) + '</h1>' +
              '<p class="rhero__parts anim-in" style="--i:2">' + esc(V.recipePartsText(m)) + '</p>' +
              '<p class="phero__lead anim-in" style="--i:3">' + esc(desc[0] || '') + '</p>' +
              '<ul class="rhero__meta anim-in" style="--i:4" role="list">' +
                '<li>' + strengthBadge(m) + '</li>' +
                '<li><span class="rbadge">' + esc(t('mixes.layoutLabel')) + ': ' + esc(t('mixes.layout.' + m.layout)) + '</span></li>' +
                m.tags.map(function (x) { return '<li class="tag">' + esc(MSP.tagLabel(x)) + '</li>'; }).join('') +
              '</ul>' +
              '<p class="rhero__actions anim-in" style="--i:5"><a class="btn btn--primary" href="' + esc(V.recipeMixerUrl(m)) + '">' + icon('mix') + '<span>' + esc(t('mixes.openMixer')) + '</span></a>' + V.shareButton('recipe', m.id) + '</p>' +
              V.rateWidget('recipe', m.id, L(m.name), 6) +
            '</div>' +
            '<div class="rhero__stage">' +
              '<div class="rbowl" data-bowl>' + V.bowlTop(m, { label: true, cls: 'bowl-top--hero' }) + '</div>' +
              '<ul class="rlegend" role="list">' + legend + '</ul>' +
            '</div>' +
          '</div>' +
        '</section>' +

        '<section class="fsec" aria-labelledby="recipe-flavors"><div class="container rgrid">' +
          '<div>' +
            V.sectionHead('01', t('mixes.flavorsTitle'), '', 'recipe-flavors') +
            '<ul class="rflavors" role="list">' + flavorLinks + '</ul>' +
          '</div>' +
          '<div>' +
            V.sectionHead('02', t('mixes.aboutTitle'), '', 'recipe-about') +
            '<div class="prose" data-reveal>' + desc.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
            '<h3 class="rtips__title">' + esc(t('mixes.tipsTitle')) + '</h3>' +
            '<ul class="rtips" role="list">' + tips.map(function (p) { return '<li>' + icon('spark') + '<span>' + esc(p) + '</span></li>'; }).join('') + '</ul>' +
          '</div>' +
        '</div></section>' +

        '<section class="fsec fsec--alt" aria-labelledby="recipe-profile"><div class="container">' +
          V.sectionHead('03', t('mixes.profileTitle'), '', 'recipe-profile') +
          '<div class="mixer__grid">' +
            '<div class="mix__panel"><h3 class="mix__h">' + esc(t('mixes.ingredientsTitle')) + '</h3><ul class="mix__ings" role="list">' + V.mixIngredients(ings) + '</ul></div>' +
            '<div class="mix__panel"><h3 class="mix__h">' + esc(t('mixes.profileTitle')) + '</h3><ul class="mix__prof" role="list">' + V.mixProfile(prof) + '</ul></div>' +
          '</div>' +
          '<p class="mix__note" role="note">' + icon('alert') + '<span>' + esc(t('mixes.note')) + '</span></p>' +
        '</div></section>' +

        '<section class="fsec" aria-labelledby="recipe-more"><div class="container">' +
          '<h2 class="mix__h" id="recipe-more">' + esc(t('mixes.otherTitle')) + '</h2>' +
          recipeGrid(others.slice(0, 3)) +
          '<p><a class="btn btn--ghost" href="' + V.url('mixes') + '">' + icon('arrowLeft') + '<span>' + esc(t('mixes.allMixes')) + '</span></a></p>' +
        '</div></section>' +
      '</article>'
    );
  }

  /* ================================================================== */
  /* Poređenje                                                           */
  /* ================================================================== */

  /** Parovi "sličnih okusa" (svaki par jednom, redoslijed kao u flavors.js). */
  V.comparePairs = function () {
    var F = V.flavors();
    var seen = {};
    var out = [];
    F.forEach(function (f, i) {
      (f.similar || []).forEach(function (id) {
        var g = V.flavorById(id);
        if (!g) return;
        var j = F.indexOf(g);
        var a = i < j ? f : g;
        var b = i < j ? g : f;
        var key = a.id + '-vs-' + b.id;
        if (seen[key] || a === b) return;
        seen[key] = 1;
        out.push({ a: a, b: b, slug: key });
      });
    });
    return out;
  };

  V.pairBySlug = function (slug) { return V.comparePairs().filter(function (p) { return p.slug === slug; })[0] || null; };
  V.pairFor = function (a, b) {
    return V.comparePairs().filter(function (p) { return (p.a === a && p.b === b) || (p.a === b && p.b === a); })[0] || null;
  };
  V.pairUrl = function (p, lang) { return V.urlFor(lang || MSP.lang, 'comparePair', p.slug); };

  /** Adresa poređenja: SEO stranica ako par postoji u tom redoslijedu, inače interaktivna sa parametrima. */
  V.compareUrl = function (a, b, lang) {
    var p = V.pairFor(a, b);
    if (p && p.a === a) return V.pairUrl(p, lang);
    return V.urlFor(lang || MSP.lang, 'compare') + '?a=' + encodeURIComponent(a.id) + '&b=' + encodeURIComponent(b.id);
  };

  function rgbDist(x, y) {
    var a = C().hexToRgb ? C().hexToRgb(x) : null, b = C().hexToRgb ? C().hexToRgb(y) : null;
    if (!a || !b) return 999;
    return Math.sqrt(Math.pow(a.r - b.r, 2) + Math.pow(a.g - b.g, 2) + Math.pow(a.b - b.b, 2));
  }

  /** Podrazumijevani par: par sličnih okusa sa najrazličitijim bojama (da se podjela ekrana jasno vidi). */
  V.defaultPair = function () {
    var best = null, bestD = -1;
    V.comparePairs().forEach(function (q) {
      var d = rgbDist(q.a.palette.background, q.b.palette.background);
      if (d > bestD) { bestD = d; best = q; }
    });
    var p = best;
    if (p) return p;
    var F = V.flavors();
    return { a: F[0], b: F[1] || F[0] };
  };

  function ingKeyMap(f) {
    var m = {};
    (f.ingredients || []).forEach(function (i) { m[i.illustration] = i; });
    return m;
  }

  V.compareIngredients = function (a, b) {
    var ma = ingKeyMap(a);
    var mb = ingKeyMap(b);
    var shared = [], onlyA = [], onlyB = [];
    V.byIntensity(a).forEach(function (i) { (mb[i.illustration] ? shared : onlyA).push(i); });
    V.byIntensity(b).forEach(function (i) { if (!ma[i.illustration]) onlyB.push(i); });
    return { shared: shared, onlyA: onlyA, onlyB: onlyB };
  };

  /** Kratak tekst razlike, iz podataka; radi za bilo koji par. */
  V.compareText = function (a, b) {
    var keys = V.PROFILE_KEYS;
    var pa = a.profile || {}, pb = b.profile || {};
    var aWins = [], bWins = [];
    keys.forEach(function (k) {
      var d = (pa[k] || 0) - (pb[k] || 0);
      if (d >= 2) aWins.push({ k: k, d: d });
      else if (d <= -2) bWins.push({ k: k, d: -d });
    });
    var byD = function (x, y) { return y.d - x.d; };
    aWins.sort(byD);
    bWins.sort(byD);
    var adj = function (list) {
      return list.slice(0, 2).map(function (x) { return t('compare.adj.' + x.k); }).join(t('compare.and'));
    };
    var parts = [];
    if (aWins.length && bWins.length) parts.push(t('compare.both', { a: a.name, x: adj(aWins), b: b.name, y: adj(bWins) }));
    else if (aWins.length) parts.push(t('compare.one', { a: a.name, x: adj(aWins), b: b.name }));
    else if (bWins.length) parts.push(t('compare.one', { a: b.name, x: adj(bWins), b: a.name }));
    else {
      var total = keys.reduce(function (s, k) { return s + Math.abs((pa[k] || 0) - (pb[k] || 0)); }, 0);
      parts.push(t(total === 0 ? 'compare.same' : 'compare.close', { a: a.name, b: b.name }));
    }
    var ci = V.compareIngredients(a, b);
    var low = function (list) { return joinList(list.slice(0, 2).map(function (i) { return L(i.name).toLowerCase(); })); };
    if (ci.shared.length) parts.push(t('compare.sharedNote', { list: low(ci.shared) }));
    if (ci.onlyA.length) parts.push(t('compare.onlyNote', { name: a.name, list: low(ci.onlyA) }));
    if (ci.onlyB.length) parts.push(t('compare.onlyNote', { name: b.name, list: low(ci.onlyB) }));
    return parts.join(' ');
  };

  function cmpSide(f, which) {
    var th = V.themeFor(f);
    var ings = V.byIntensity(f).slice(0, 3);
    var art = ings.map(function (ing, i) {
      return '<span class="cside__ing" style="--i:' + i + '">' + MSP.illustrate(ing.illustration, { color: ing.color }) + '</span>';
    }).join('');
    return (
      '<div class="cside cside--' + which + '" style="--cs-bg:' + th.bg + ';--cs-text:' + th.text + ';--cs-muted:' + th.muted + ';--cs-accent:' + th.accentInk + ';--cs-glow:' + th.surface2 + ';--cs-on:' + th.onAccent + ';--cs-fill:' + th.accentFill + '" data-smoke="' + th.smoke.join(',') + '">' +
        '<div class="cside__inner">' +
          '<button type="button" class="cside__pick" data-slot="' + which + '" aria-haspopup="dialog" aria-expanded="false" aria-controls="cpicker">' +
            '<span class="cside__label">' + esc(t(which === 'a' ? 'compare.pickA' : 'compare.pickB')) + '</span>' +
            '<span class="cside__change">' + icon('layers') + esc(t('compare.change')) + '</span>' +
          '</button>' +
          '<div class="cside__art" aria-hidden="true">' + art + '</div>' +
          '<p class="cside__brand">' + esc(f.brand) + '</p>' +
          '<h2 class="cside__name">' + esc(f.name) + '</h2>' +
          '<p class="cside__desc">' + esc(L(f.shortDescription)) + '</p>' +
          '<a class="cside__open" href="' + V.flavorUrl(f) + '" data-veil="' + th.veil + '">' + esc(t('compare.openFlavor', { name: f.name })) + icon('arrowRight') + '</a>' +
        '</div>' +
      '</div>'
    );
  }

  function barColor(f, bg) {
    var th = V.themeFor(f);
    var c = C();
    var pick = [th.primary, th.secondary, th.accent].sort(function (x, y) { return c.contrast(y, bg) - c.contrast(x, bg); })[0];
    return c.ensureContrast(pick, [bg], 3);
  }

  function cmpBars(a, b) {
    var surface = V.themeFor(null).surface;
    var ca = barColor(a, surface);
    var cb = barColor(b, surface);
    // slične boje: druga strana uzima najrazličitiju boju iz svoje palete
    if (rgbDist(ca, cb) < 110) {
      var tb = V.themeFor(b);
      cb = [tb.accent, tb.secondary, tb.primary, tb.text].map(function (x) { return C().ensureContrast(x, [surface], 3); })
        .sort(function (x, y) { return rgbDist(y, ca) - rgbDist(x, ca); })[0];
    }
    return (
      '<div class="dlegend" aria-hidden="true" style="--ca:' + ca + ';--cb:' + cb + '"><span class="dlegend__a">' + esc(a.name) + '</span><span class="dlegend__b">' + esc(b.name) + '</span></div>' +
      '<ul class="dbars" role="list" data-reveal style="--ca:' + ca + ';--cb:' + cb + '">' +
        V.PROFILE_KEYS.map(function (k, i) {
          var va = V.clamp(a.profile[k], 0, 10), vb = V.clamp(b.profile[k], 0, 10);
          return (
            '<li class="dbar" style="--a:' + va / 10 + ';--b:' + vb / 10 + ';--i:' + i + '">' +
              '<span class="dbar__v dbar__v--a' + (va > vb ? ' is-more' : '') + '" aria-hidden="true">' + va + '</span>' +
              '<span class="dbar__track dbar__track--a" aria-hidden="true"><span></span></span>' +
              '<span class="dbar__label">' + esc(t('profile.' + k)) + '<span class="sr-only">: ' + esc(a.name) + ' ' + esc(t('a11y.outOf', { value: va, max: 10 })) + ', ' + esc(b.name) + ' ' + esc(t('a11y.outOf', { value: vb, max: 10 })) + '</span></span>' +
              '<span class="dbar__track dbar__track--b" aria-hidden="true"><span></span></span>' +
              '<span class="dbar__v dbar__v--b' + (vb > va ? ' is-more' : '') + '" aria-hidden="true">' + vb + '</span>' +
            '</li>'
          );
        }).join('') +
      '</ul>'
    );
  }

  function ingList(list, empty) {
    if (!list.length) return '<p class="cings__none">' + esc(empty) + '</p>';
    return '<ul class="cings__list" role="list">' + list.map(function (i) {
      return '<li><span class="cings__art" aria-hidden="true">' + MSP.illustrate(i.illustration, { color: i.color }) + '</span><span>' + esc(L(i.name)) + '</span></li>';
    }).join('') + '</ul>';
  }

  function cmpIngs(a, b) {
    var ci = V.compareIngredients(a, b);
    return (
      '<div class="cings" data-reveal>' +
        '<div class="cings__col cings__col--a"><h3 class="cings__h">' + esc(t('compare.onlyIn', { name: a.name })) + '</h3>' + ingList(ci.onlyA, t('compare.noneOnly')) + '</div>' +
        '<div class="cings__col cings__col--shared"><h3 class="cings__h">' + esc(t('compare.shared')) + '</h3>' + ingList(ci.shared, t('compare.noneShared')) + '</div>' +
        '<div class="cings__col cings__col--b"><h3 class="cings__h">' + esc(t('compare.onlyIn', { name: b.name })) + '</h3>' + ingList(ci.onlyB, t('compare.noneOnly')) + '</div>' +
      '</div>'
    );
  }

  /** Dijelovi koji se mijenjaju kad se izabere drugi par (koristi i browser). */
  V.compareParts = function (a, b) {
    return {
      stage: cmpSide(a, 'a') + '<div class="cseam" aria-hidden="true"><span></span><span></span><span></span></div>' + cmpSide(b, 'b'),
      verdict: V.compareText(a, b),
      bars: cmpBars(a, b),
      ings: cmpIngs(a, b),
      mixer: V.mixUrl(a, b, 50),
      seam: '--seam-a:' + V.themeFor(a).primary + ';--seam-b:' + V.themeFor(b).primary,
      label: a.name + ' ' + t('compare.vs') + ' ' + b.name
    };
  };

  function comparePicker() {
    return (
      '<div class="picker cpicker" id="cpicker" role="dialog" aria-modal="false" aria-labelledby="cpicker-title" hidden>' +
        '<div class="picker__head"><h2 class="picker__title" id="cpicker-title">' + esc(t('compare.pickerTitle')) + '</h2>' +
          '<button type="button" class="picker__close" aria-label="' + esc(t('compare.pickerClose')) + '">' + icon('close') + '</button></div>' +
        '<div class="search search--small"><label class="sr-only" for="cpicker-search">' + esc(t('compare.pickerSearch')) + '</label>' +
          '<span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
          '<input class="search__input" id="cpicker-search" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('compare.pickerSearch')) + '"></div>' +
        '<ul class="picker__list" role="list">' + V.flavors().map(function (f) {
          var ft = V.themeFor(f);
          var top = topIng(f);
          return '<li><button type="button" class="pick-item" data-id="' + f.id + '" style="--pk-bg:' + ft.bg + ';--pk-text:' + ft.text + '">' +
            '<span class="pick-item__art" aria-hidden="true">' + MSP.illustrate(top.illustration, { color: top.color }) + '</span>' +
            '<span class="pick-item__txt"><span class="pick-item__brand">' + esc(f.brand) + '</span><span class="pick-item__name">' + esc(f.name) + '</span></span>' +
          '</button></li>';
        }).join('') + '</ul>' +
      '</div>'
    );
  }

  function pairLinks(pairs, current) {
    return '<ul class="cpairs" role="list">' + pairs.filter(function (p) { return p !== current; }).map(function (p) {
      var ta = V.themeFor(p.a), tb = V.themeFor(p.b);
      return '<li><a class="cpair" href="' + V.pairUrl(p) + '" style="--pa:' + ta.bg + ';--pb:' + tb.bg + ';--pta:' + ta.text + ';--ptb:' + tb.text + '">' +
        '<span class="cpair__a">' + esc(V.uniqueName(p.a)) + '</span><span class="cpair__vs">' + esc(t('compare.vs')) + '</span><span class="cpair__b">' + esc(V.uniqueName(p.b)) + '</span></a></li>';
    }).join('') + '</ul>';
  }

  /** Za stranicu jednog para: prvo parovi sa istim okusom, pa ostali, najviše max. */
  function relatedPairs(pair, max) {
    var all = V.comparePairs().filter(function (p) { return p !== pair; });
    var near = all.filter(function (p) { return p.a === pair.a || p.b === pair.a || p.a === pair.b || p.b === pair.b; });
    return near.concat(all.filter(function (p) { return near.indexOf(p) === -1; })).slice(0, max);
  }

  function pageCompare(a, b, crumbs, pair) {
    var parts = V.compareParts(a, b);
    var title = pair ? a.name + ' ' + t('compare.vs') + ' ' + b.name : t('compare.title');
    var lead = pair ? t('meta.comparePairLead', { a: a.name, b: b.name }) + ' ' + t('compare.lead') : t('compare.lead');
    return (
      '<section class="cmpx" data-pair="' + (pair ? pair.slug : '') + '" aria-labelledby="cmp-title">' +
        crumbs +
        '<div class="container cmpx__head">' +
          '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('compare.eyebrow')) + '</p>' +
          '<h1 class="phero__title cmpx__title anim-in" style="--i:1" id="cmp-title" tabindex="-1">' + esc(title) + '</h1>' +
          '<p class="phero__lead anim-in" style="--i:2">' + esc(lead) + '</p>' +
        '</div>' +
        '<div class="cstage" id="cmp-stage" role="group" aria-label="' + esc(parts.label) + '" style="' + parts.seam + '">' + parts.stage + '</div>' +
        '<div class="container">' +
          comparePicker() +
          '<div class="cactions">' +
            '<button type="button" class="btn btn--ghost" id="cmp-swap">' + icon('layers') + '<span>' + esc(t('compare.swap')) + '</span></button>' +
            '<a class="btn btn--primary" id="cmp-mixer" href="' + esc(parts.mixer) + '">' + icon('mix') + '<span>' + esc(t('compare.tryMixer')) + '</span></a>' +
            '<button type="button" class="btn btn--ghost" id="cmp-share">' + icon('link') + '<span>' + esc(t('compare.share')) + '</span></button>' +
            '<span class="mix__copied" id="cmp-copied" aria-live="polite"></span>' +
          '</div>' +
          '<div class="cverdict" data-reveal><h2 class="cverdict__h">' + esc(t('compare.verdictTitle')) + '</h2><p id="cmp-verdict" aria-live="polite">' + esc(parts.verdict) + '</p></div>' +
          '<div class="cblock"><h2 class="mix__h">' + esc(t('compare.profileTitle')) + '</h2><div id="cmp-bars">' + parts.bars + '</div></div>' +
          '<div class="cblock"><h2 class="mix__h">' + esc(t('compare.ingredientsTitle')) + '</h2><div id="cmp-ings">' + parts.ings + '</div></div>' +
          '<div class="cblock cblock--pairs"><h2 class="mix__h">' + esc(t('compare.popularTitle')) + '</h2>' + pairLinks(pair ? relatedPairs(pair, 12) : V.comparePairs(), pair) + '</div>' +
        '</div>' +
      '</section>'
    );
  }

  V.flavorCompareSection = function (f, nextNum) {
    var pairs = V.comparePairs().filter(function (p) { return p.a === f || p.b === f; });
    var alt = !V.mixesWith(f).length;
    return (
      '<section class="fsec' + (alt ? ' fsec--alt' : '') + '" aria-labelledby="sec-compare"><div class="container">' +
        V.sectionHead(nextNum(), t('compare.flavorSectionTitle'), t('compare.flavorSectionIntro'), 'sec-compare') +
        (pairs.length ? pairLinks(pairs, null) : '') +
        '<p class="fcompare__cta"><a class="btn btn--ghost" href="' + V.urlFor(MSP.lang, 'compare') + '?a=' + encodeURIComponent(f.id) + '">' + icon('layers') + '<span>' + esc(t('compare.compareWith')) + '</span></a></p>' +
      '</div></section>'
    );
  };

  /* ================================================================== */
  /* Okus dana                                                           */
  /* ================================================================== */

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var x = Math.imul(a ^ (a >>> 15), 1 | a);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffled(ids, cycle) {
    var rnd = mulberry32((cycle + 1) * 2654435761);
    var out = ids.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var tmp = out[i]; out[i] = out[j]; out[j] = tmp;
    }
    return out;
  }

  /** Redoslijed za ciklus; prvi okus nikad nije isti kao posljednji iz prethodnog ciklusa. */
  function cycleOrder(ids, cycle) {
    var ord = shuffled(ids, cycle);
    if (ord.length > 2) {
      var prevLast = shuffled(ids, cycle - 1)[ids.length - 1];
      if (ord[0] === prevLast) { var tmp = ord[0]; ord[0] = ord[1]; ord[1] = tmp; }
    }
    return ord;
  }

  /** Broj dana po LOKALNOM kalendaru (isti za sve posjetioce istog datuma). */
  V.dayNumber = function (d) { return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000); };

  /**
   * Okus dana: svaki "ciklus" od N dana (N = broj okusa) je jedna izmiješana permutacija,
   * pa se nijedan okus ne ponavlja dok se ne prođu svi. Seed je broj ciklusa.
   */
  V.fotdPick = function (date) {
    var ids = V.flavors().map(function (f) { return f.id; }).sort();
    if (!ids.length) return null;
    var day = V.dayNumber(date);
    var n = ids.length;
    var cycle = Math.floor(day / n);
    var pos = ((day % n) + n) % n;
    return V.flavorById(cycleOrder(ids, cycle)[pos]);
  };

  /** Recept u kojem je okus (za "Probaj ga u miksu"). */
  V.fotdMix = function (f) {
    var list = V.mixesWith(f);
    if (!list.length) return null;
    return list.filter(function (m) { return m.featured; })[0] || list[0];
  };

  /** Unutrašnjost kartice okusa dana (JavaScript je zamijeni kad se promijeni dan). */
  V.fotdCard = function (f) {
    var th = V.themeFor(f);
    var ings = V.byIntensity(f).slice(0, 3);
    var art = ings.map(function (ing, i) {
      return '<span class="fotd__ing fotd__ing--' + i + '"><span class="fotd__bob">' + MSP.illustrate(ing.illustration, { color: ing.color }) + '</span></span>';
    }).join('');
    var m = V.fotdMix(f);
    var chips = (f.ingredients || []).map(function (i) { return '<li>' + esc(L(i.name)) + '</li>'; }).join('');
    return (
      '<div class="fotd__art" aria-hidden="true"><span class="fotd__halo"></span>' + art + '<span class="fotd__bowl">' + MSP.hookahBowl() + '</span></div>' +
      V.rateSlot('flavor', f.id, 'rpill--fotd') +
      '<div class="fotd__copy">' +
        '<p class="fotd__top"><span class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('fotd.eyebrow')) + '</span>' +
          '<span class="fotd__timer" id="fotd-timer" aria-live="off"></span></p>' +
        '<h2 class="fotd__name" id="fotd-title"><span class="fotd__brand">' + esc(f.brand) + '</span> <span class="fotd__flavor">' + esc(f.name) + '</span></h2>' +
        '<p class="fotd__desc">' + esc(L(f.shortDescription)) + '</p>' +
        '<ul class="fotd__ings" role="list">' + chips + '</ul>' +
        '<p class="fotd__actions"><a class="btn fotd__btn" href="' + V.flavorUrl(f) + '" data-veil="' + th.veil + '">' + esc(t('fotd.open')) + icon('arrowRight') + '</a></p>' +
        '<p class="fotd__mix">' + (m
          ? '<span>' + esc(t('fotd.tryMix')) + ':</span> <a href="' + V.recipeUrl(m) + '">' + esc(L(m.name)) + '</a> <span class="fotd__mixparts">(' + esc(V.recipePartsText(m)) + ')</span>'
          : '&nbsp;') + '</p>' +
      '</div>'
    );
  };

  V.fotdStyle = function (f) {
    var th = V.themeFor(f);
    return '--fd-bg:' + th.bg + ';--fd-surface:' + th.surface + ';--fd-glow:' + th.surface2 + ';--fd-text:' + th.text + ';--fd-muted:' + th.muted +
      ';--fd-accent:' + th.accentInk + ';--fd-fill:' + th.accentFill + ';--fd-on:' + th.onAccent + ';--fd-primary:' + th.primary + ';--fd-secondary:' + th.secondary;
  };

  V.fotdSection = function (f) {
    if (!f) return '';
    return (
      '<section class="fotd" aria-labelledby="fotd-title">' +
        '<div class="container">' +
          '<div class="fotd__card" id="fotd-card" data-id="' + f.id + '" data-smoke="' + V.themeFor(f).smoke.join(',') + '" style="' + V.fotdStyle(f) + '">' + V.fotdCard(f) + '</div>' +
        '</div>' +
      '</section>'
    );
  };

  /* ================================================================== */
  /* Stranice (poziva ih V.page iz views.js)                             */
  /* ================================================================== */

  V.crumbsMore = function (desc, home) {
    if (desc.page === 'collection') return [home, { name: t('nav.collections'), url: V.url('collections') }, { name: L(desc.collection.title), url: V.collectionUrl(desc.collection) }];
    if (desc.page === 'comparePair') return [home, { name: t('nav.compare'), url: V.url('compare') }, { name: V.uniqueName(desc.pair.a) + ' vs ' + V.uniqueName(desc.pair.b), url: V.pairUrl(desc.pair) }];
    if (desc.page === 'recipe') return [home, { name: t('nav.mixes'), url: V.url('mixes') }, { name: L(desc.recipe.name), url: V.recipeUrl(desc.recipe) }];
    return [home];
  };

  V.pageMore = function (desc, crumbs) {
    var c, m, p, d;
    switch (desc.page) {
      case 'collections':
        return { main: pageCollections(crumbs), title: t('meta.collectionsTitle'), description: t('meta.collectionsDescription') };
      case 'collection':
        c = desc.collection;
        var names = V.collectionMembers(c).map(function (f) { return f.name; });
        return {
          main: pageCollection(c, crumbs),
          title: t('meta.collectionTitle', { name: L(c.title) }),
          description: V.clip(L(c.short) + ' ' + t('collections.metaIn', { list: joinList(names) })),
          theme: V.collectionTheme(c),
          mood: { ice: 'ice', night: 'night', tropical: 'tropical', calm: 'calm' }[c.mood]
        };
      case 'compare':
        d = V.defaultPair();
        return { main: pageCompare(d.a, d.b, crumbs, null), title: t('meta.compareTitle'), description: t('meta.compareDescription') };
      case 'comparePair':
        p = desc.pair;
        return {
          main: pageCompare(p.a, p.b, crumbs, p),
          title: t('meta.comparePairTitle', { a: V.uniqueName(p.a), b: V.uniqueName(p.b) }),
          description: V.clip(t('meta.comparePairLead', { a: V.uniqueName(p.a), b: V.uniqueName(p.b) }) + ' ' + V.compareText(p.a, p.b))
        };
      case 'mixes':
        return { main: pageMixes(crumbs), title: t('meta.mixesTitle'), description: t('meta.mixesDescription') };
      case 'recipe':
        m = desc.recipe;
        return {
          main: pageRecipe(m, crumbs),
          title: t('meta.mixRecipeTitle', { name: L(m.name), parts: m.parts.map(function (x) { return x.pct; }).join('/') }),
          description: V.clip((L(m.description) || [])[0]),
          theme: V.recipeTheme(m)
        };
    }
    return { main: '', title: '', description: '' };
  };
})(typeof window !== 'undefined' ? window : globalThis);
