/*
 * MyShishapedia - pogledi za: Moja polica (ormarić i ladice), traku Nedavno gledano
 * i stranicu Savjeti za bolji okus.
 *
 * Nastavak js/views.js (isti MSP.V objekat). Koristi ga samo build: polica i nedavno gledano
 * su lični (localStorage), pa ovdje nastaje samo okvir, a tegle i trake crta js/shelf.js u browseru.
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  var esc = V.esc;
  var icon = V.icon;

  function t(k, v) { return MSP.t(k, v); }
  function L(v, lang) { return MSP.L(v, lang); }

  /* ================================================================== */
  /* Nedavno gledano (traku popunjava js/shelf.js)                       */
  /* ================================================================== */

  /**
   * Traka "Nedavno gledano" na početnoj i na stranici svih okusa. Vidi se samo kad lista nije
   * prazna: <head> skripta unaprijed doda klasu "has-recent", pa se ništa ne pomjera.
   */
  V.recentStrip = function (cls) {
    return (
      '<section class="recent' + (cls ? ' ' + cls : '') + '" id="recent" aria-labelledby="recent-title">' +
        '<div class="container">' +
          '<div class="recent__head">' +
            '<h2 class="recent__title" id="recent-title">' + icon('clock') + '<span>' + esc(t('recent.title')) + '</span></h2>' +
            '<button type="button" class="recent__clear" id="recent-clear" aria-label="' + esc(t('recent.clearAria')) + '">' + icon('close') + '<span>' + esc(t('recent.clear')) + '</span></button>' +
          '</div>' +
          '<ul class="recent__list" id="recent-list" role="list"></ul>' +
        '</div>' +
      '</section>'
    );
  };


  /* ================================================================== */
  /* Preporučeno za tebe (kartice bira i crta js/shelf.js)               */
  /* ================================================================== */

  /**
   * Sekcija "Preporučeno za tebe". Okusi se biraju u browseru (polica, nedavno gledano, ocjene),
   * a ovdje je samo okvir sa praznim mjestima (iste veličine kao kartice) i kolekcije okusa,
   * jer data/collections.js nije učitan u browseru. Vidi se samo uz klasu "has-reco" (<head> skripta).
   */
  V.recoSection = function (cls) {
    var cols = {};
    V.flavors().forEach(function (f) { cols[f.id] = V.collectionsOf(f).map(function (c) { return c.id; }); });
    var ghosts = '';
    for (var i = 0; i < 6; i++) ghosts += '<li class="grid__item reco__ghost" aria-hidden="true"><span></span></li>';
    return (
      '<section class="reco' + (cls ? ' ' + cls : '') + '" id="reco" aria-labelledby="reco-title" data-cols="' + esc(JSON.stringify(cols)) + '">' +
        '<div class="container">' +
          '<div class="reco__head">' +
            '<h2 class="reco__title" id="reco-title">' + icon('spark') + '<span>' + esc(t('reco.title')) + '</span></h2>' +
            '<p class="reco__lead">' + esc(t('reco.lead')) + '</p>' +
          '</div>' +
          '<ul class="grid reco__grid" id="reco-grid" role="list">' + ghosts + '</ul>' +
        '</div>' +
      '</section>'
    );
  };

  /* ================================================================== */
  /* Moja polica                                                         */
  /* ================================================================== */

  /**
   * Podaci za js/shelf.js: kojoj (prvoj) kolekciji okus pripada i nazivi polica na jeziku
   * stranice. Okusi bez kolekcije idu na policu "Ostalo".
   */
  function shelfData() {
    var map = {};
    V.flavors().forEach(function (f) {
      var c = V.collectionsOf(f)[0];
      map[f.id] = c ? c.id : 'other';
    });
    var shelves = V.collections().map(function (c) { return { id: c.id, title: L(c.title), mood: c.mood }; });
    shelves.push({ id: 'other', title: t('shelf.other'), mood: '' });
    return { col: map, shelves: shelves };
  }

  function door(side) {
    return (
      '<span class="cab__door cab__door--' + side + '" aria-hidden="true">' +
        '<span class="cab__face">' +
          '<span class="cab__panel"></span><span class="cab__panel cab__panel--low"></span>' +
          '<span class="cab__handle"></span>' +
        '</span>' +
        '<span class="cab__back"></span>' +
      '</span>'
    );
  }

  V.pageShelf = function (crumbs) {
    var data = esc(JSON.stringify(shelfData()));
    return (
      V.pageHero({ id: 'shelf-title', eyebrow: t('shelf.eyebrow'), title: t('shelf.title'), lead: t('shelf.lead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container shelf" id="shelf" data-shelf-data="' + data + '">' +
        '<p class="shelf__count" id="shelf-count" aria-live="polite"></p>' +

        // ormarić (desktop i tablet)
        '<div class="cab" id="cab">' +
          '<div class="cab__crown" aria-hidden="true"></div>' +
          '<div class="cab__body">' +
            '<div class="cab__inside" id="cab-inside" role="region" aria-label="' + esc(t('shelf.inside')) + '" inert>' +
              '<span class="cab__glow" aria-hidden="true"></span>' +
              '<span class="cab__lamp" aria-hidden="true"></span>' +
              '<div class="cab__shelves" id="cab-shelves"></div>' +
            '</div>' +
            '<button type="button" class="cab__doors" id="cab-open" aria-expanded="false" aria-controls="cab-inside" aria-label="' + esc(t('shelf.cabinetOpen')) + '">' +
              door('l') + door('r') +
              '<span class="cab__plate"><span class="cab__plate-title">' + esc(t('shelf.title')) + '</span>' +
                '<span class="cab__plate-hint">' + esc(t('shelf.cabinetHint')) + '</span></span>' +
            '</button>' +
          '</div>' +
          '<div class="cab__base" aria-hidden="true"><span class="cab__foot"></span><span class="cab__foot"></span></div>' +
        '</div>' +
        '<p class="cab__bar"><button type="button" class="btn btn--ghost cab__close" id="cab-close" hidden>' + icon('close') + '<span>' + esc(t('shelf.cabinetClose')) + '</span></button></p>' +

        // ladice (mobitel)
        '<div class="drawers" id="drawers"></div>' +

        // prazna polica
        '<div class="shelf-empty" id="shelf-empty">' +
          '<span class="shelf-empty__jar" aria-hidden="true"><span class="shelf-empty__wisp"></span><span class="shelf-empty__wisp shelf-empty__wisp--b"></span>' + icon('jar') + '</span>' +
          '<h2 class="shelf-empty__title">' + esc(t('shelf.emptyTitle')) + '</h2>' +
          '<p class="shelf-empty__text">' + esc(t('shelf.emptyText')) + '</p>' +
          '<p class="shelf-empty__actions"><a class="btn btn--primary" href="' + V.url('flavors') + '">' + esc(t('shelf.emptyCta')) + icon('arrowRight') + '</a>' +
            '<a class="btn btn--ghost" href="' + V.url('quiz') + '">' + esc(t('shelf.emptyQuiz')) + '</a></p>' +
        '</div>' +
        '<noscript><p class="shelf__nojs">' + esc(t('shelf.noJs')) + '</p></noscript>' +
      '</div></section>' +
      V.recoSection('reco--shelf') +

      // pregled tegle (dijalog)
      '<div class="jarview" id="jarview" hidden>' +
        '<div class="jarview__backdrop" data-jv-close></div>' +
        '<div class="jarview__card" role="dialog" aria-modal="true" aria-labelledby="jv-title" tabindex="-1">' +
          '<button type="button" class="jarview__x" data-jv-close aria-label="' + esc(t('shelf.close')) + '">' + icon('close') + '</button>' +
          '<div class="jarview__stage" aria-hidden="true"><span class="jarview__halo"></span><span class="jarview__jar" id="jv-jar"></span></div>' +
          '<div class="jarview__info">' +
            '<p class="jarview__brand" id="jv-brand"></p>' +
            '<h2 class="jarview__name" id="jv-title"></h2>' +
            '<div class="jarview__rate" id="jv-rate"></div>' +
            '<p class="jarview__desc" id="jv-desc"></p>' +
            '<p class="jarview__label">' + esc(t('shelf.ings')) + '</p>' +
            '<ul class="jarview__ings" id="jv-ings" role="list"></ul>' +
            '<p class="jarview__actions"><a class="btn btn--primary" id="jv-link" href="' + V.url('flavors') + '">' + esc(t('shelf.openFlavor')) + icon('arrowRight') + '</a>' +
              '<button type="button" class="btn btn--ghost" id="jv-remove">' + icon('close') + '<span>' + esc(t('shelf.remove')) + '</span></button></p>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  };

  /* ================================================================== */
  /* Savjeti za bolji okus (sadržaj je u data/tips.js)                   */
  /* ================================================================== */

  var TIP_ICONS = {
    bowl: '<path d="M4 9h16l-2.5 6.5a3 3 0 0 1-2.8 1.9H9.3a3 3 0 0 1-2.8-1.9z"/><path d="M9 17.4 8 21h8l-1-3.6"/><path d="M9 6c0-1.5 1.5-1.5 1.5-3M13.5 6c0-1.5 1.5-1.5 1.5-3"/>',
    heat: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.6 3-5.6 3.6-9.3 2.4 1.5 3.4 3.6 3.4 5.5 1-.6 1.6-1.6 1.8-2.9 2.2 1.6 4.2 4 4.2 6.7 0 3.6-2.6 6.2-6.5 6.2z"/><path d="M12 21c-1.6 0-2.7-1.1-2.7-2.6 0-1.6 1.4-2.6 2.7-4.4 1.3 1.8 2.7 2.8 2.7 4.4 0 1.5-1.1 2.6-2.7 2.6z"/>',
    cloud: '<path d="M7 18a4 4 0 0 1-.6-8A5.5 5.5 0 0 1 17 8.6 4.7 4.7 0 0 1 17.3 18z"/><path d="M8 21.5c1.5-.8 3-.8 4.5 0s3 .8 4.5 0"/>',
    ice: '<path d="M12 2.8 20 7.4v9.2l-8 4.6-8-4.6V7.4z"/><path d="M4 7.4l8 4.6 8-4.6M12 12v9.2"/><path d="m7.5 13.2 1.5.9M15 14.1l1.5-.9"/>',
    clean: '<path d="M12 3.5c3 4 6 7 6 10.5a6 6 0 0 1-12 0c0-3.5 3-6.5 6-10.5z"/><path d="M9.2 14.6a3 3 0 0 0 2.6 2.7"/>'
  };

  function tipIcon(name) {
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (TIP_ICONS[name] || TIP_ICONS.bowl) + '</svg>';
  }

  V.tipSections = function () { return (root.TIPS && root.TIPS.sections) || []; };

  function gearItem(id) {
    var G = (root.GEAR || {}).categories || {};
    for (var k in G) {
      var it = (G[k].items || []).filter(function (x) { return x.id === id; })[0];
      if (it) return it;
    }
    return null;
  }

  /** Link "Više o tome": korak vodiča, stavka opreme ili pojam iz rječnika. Vraća null ako cilj ne postoji. */
  V.tipMore = function (m) {
    if (m.guide) {
      var s = V.guideSteps()[m.guide - 1];
      return s ? { url: V.guideStepUrl(m.guide), label: t('tips.moreGuide', { n: m.guide, title: L(s.title) }), kind: 'guide' } : null;
    }
    if (m.gear) {
      var it = gearItem(m.gear);
      return it ? { url: V.url('gear') + '#oprema-' + m.gear, label: t('tips.moreGear', { name: L(it.name) }), kind: 'gear' } : null;
    }
    if (m.term) {
      var g = V.glossaryById(m.term);
      return g ? { url: V.termUrl(g), label: t('tips.moreTerm', { term: L(g.term) }), kind: 'term' } : null;
    }
    return null;
  };

  V.pageTips = function (crumbs) {
    var secs = V.tipSections();
    var total = secs.length;
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var nav = secs.map(function (s, i) {
      return '<li style="--i:' + i + '"><a class="tipnav__link" href="#savjet-' + s.id + '">' + tipIcon(s.icon) + '<span>' + esc(L(s.title)) + '</span></a></li>';
    }).join('');
    var body = secs.map(function (s, i) {
      var hid = 'savjet-' + s.id + '-h';
      var nums = (s.numbers || []).map(function (n) {
        return '<div><dt>' + esc(L(n.label)) + '</dt><dd>' + esc(L(n.value)) + '</dd></div>';
      }).join('');
      var more = (s.more || []).map(V.tipMore).filter(Boolean).map(function (m) {
        return '<li><a class="tipmore__link tipmore__link--' + m.kind + '" href="' + esc(m.url) + '">' + esc(m.label) + icon('arrowRight') + '</a></li>';
      }).join('');
      return (
        '<section class="fsec tipsec' + (i % 2 ? ' fsec--alt' : '') + '" id="savjet-' + s.id + '" aria-labelledby="' + hid + '"><div class="container tipsec__grid">' +
          '<div class="tipsec__side">' +
            '<header class="tipsec__head" data-reveal>' +
              '<span class="tipsec__icon" aria-hidden="true">' + tipIcon(s.icon) + '</span>' +
              '<p class="tipsec__num">' + esc(t('tips.of', { n: pad(i + 1), total: pad(total) })) + '</p>' +
              '<h2 class="tipsec__title" id="' + hid + '" tabindex="-1">' + esc(L(s.title)) + '</h2>' +
              '<p class="tipsec__lead">' + V.linkTerms(L(s.lead)) + '</p>' +
            '</header>' +
            (nums ? '<aside class="tipnums" data-reveal aria-label="' + esc(t('tips.numbersTitle')) + '"><p class="tipnums__title">' + esc(t('tips.numbersTitle')) + '</p><dl>' + nums + '</dl></aside>' : '') +
            (more ? '<div class="tipmore" data-reveal><p class="tipmore__title">' + esc(t('tips.moreTitle')) + '</p><ul role="list">' + more + '</ul></div>' : '') +
          '</div>' +
          '<ol class="tiplist" role="list">' + s.tips.map(function (tp, k) {
            return (
              '<li class="tip" data-reveal style="--i:' + (k % 2) + '">' +
                '<span class="tip__n" aria-hidden="true">' + (k + 1) + '</span>' +
                '<h3 class="tip__title">' + esc(L(tp.title)) + '</h3>' +
                '<p class="tip__text">' + V.linkTerms(L(tp.text)) + '</p>' +
              '</li>'
            );
          }).join('') + '</ol>' +
        '</div></section>'
      );
    }).join('');
    return (
      V.pageHero({ id: 'tips-title', eyebrow: t('tips.eyebrow'), title: t('tips.title'), lead: t('tips.lead'), crumbs: crumbs }) +
      '<nav class="container tipnav" aria-label="' + esc(t('tips.navLabel')) + '"><ol class="tipnav__list" role="list">' + nav + '</ol></nav>' +
      body +
      '<section class="fsec" aria-labelledby="tips-cta"><div class="container">' +
        '<div class="tipcta" data-reveal>' +
          '<h2 class="tipcta__title" id="tips-cta">' + esc(t('tips.ctaTitle')) + '</h2>' +
          '<p class="tipcta__text">' + esc(t('tips.ctaText')) + '</p>' +
          '<p class="tipcta__actions"><a class="btn btn--primary" href="' + V.url('guide') + '">' + esc(t('tips.ctaGuide')) + icon('arrowRight') + '</a>' +
            '<a class="btn btn--ghost" href="' + V.url('glossary') + '">' + esc(t('tips.ctaGlossary')) + '</a>' +
            '<a class="btn btn--ghost" href="' + V.url('gear') + '">' + esc(t('tips.ctaGear')) + '</a></p>' +
          '<p class="mix__note" role="note">' + icon('alert') + '<span>' + esc(t('tips.note')) + '</span></p>' +
        '</div>' +
      '</div></section>'
    );
  };
})(typeof window !== 'undefined' ? window : globalThis);
