/*
 * MyShishapedia - pogledi za: Moja polica (ormarić i ladice).
 *
 * Nastavak js/views.js (isti MSP.V objekat). Koristi ga samo build: polica je lična
 * (localStorage), pa ovdje nastaje samo okvir stranice, a tegle crta js/shelf.js u browseru.
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
})(typeof window !== 'undefined' ? window : globalThis);
