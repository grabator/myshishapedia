/*
 * MyShishapedia - lounge meni (HTML koji pravi build.mjs).
 *
 *   - V.pageLounge: okvir stranice jednog lounge-a; sadržaj (lista, filteri, "Šta pušiti
 *     večeras?", okus, miks, "Ovaj želim") crta js/lounge.js iz data/lounges.js
 *   - V.loungeHeader / V.loungeFooter: zaglavlje i podnožje lounge-a umjesto menija sajta
 *     (gost iz kafića vidi samo lounge)
 *   - V.pageLoungeInfo: stranica "Za lounge-ove" za vlasnike kafića
 * Ovisi o: views.js (V), data/lounges.js (window.LOUNGES).
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  var t = MSP.t;
  var L = MSP.L;
  var esc = V.esc;
  var icon = V.icon;

  V.lounges = function () { return root.LOUNGES || []; };
  V.loungeById = function (id) { return V.lounges().filter(function (l) { return l.id === id; })[0] || null; };

  /** Ime za tekstove: {name}, {loc} ("u Babylonu"), {gen} ("ponuda Babylona"); na engleskom isto ime. */
  V.loungeNames = function (lg) {
    var n = lg.nameIn || {};
    var bs = MSP.lang === 'bs';
    return { name: lg.name, loc: bs && n.loc || lg.name, gen: bs && n.gen || lg.name };
  };

  function mark(lg) { return esc(lg.mark || lg.name.charAt(0)); }
  function vars(lg) { return '--lm-a:' + lg.colors[0] + ';--lm-b:' + lg.colors[1]; }

  V.loungeHeader = function (desc) {
    var lg = desc.lounge;
    var other = MSP.lang === 'bs' ? 'en' : 'bs';
    return (
      '<div class="container lm-head" style="' + vars(lg) + '">' +
        '<span class="lm-logo" aria-hidden="true">' + mark(lg) + '</span>' +
        '<span class="lm-head__txt"><b>' + esc(lg.name) + '</b><span>' + esc(L(lg.tagline)) + ' · ' + esc(L(lg.hours)) + '</span></span>' +
        '<span class="lm-price">' + esc(L(lg.price)) + '</span>' +
        '<a class="lm-lang" href="' + esc(desc.alternates[other]) + '" hreflang="' + other + '" lang="' + other + '">' + other.toUpperCase() + '</a>' +
      '</div>'
    );
  };

  V.loungeFooter = function (desc) {
    return (
      '<div class="container lm-foot">' +
        '<p>' + esc(t('lounge.poweredBy')) + ' <a href="' + V.url('home') + '">my<b>shisha</b>pedia</a></p>' +
        '<p><a href="' + V.url('loungeInfo') + '">' + esc(t('lounge.forLounges')) + '</a></p>' +
      '</div>'
    );
  };

  V.pageLounge = function (desc) {
    var lg = desc.lounge;
    var names = lg.flavors.map(function (x) { var f = V.flavorById(x.id); return f ? esc(f.name) : ''; }).filter(Boolean);
    return (
      '<div class="container lm" id="lm" data-lounge="' + esc(lg.id) + '" style="' + vars(lg) + '">' +
        (lg.demo ? '<p class="lm-demo">' + icon('info') + '<span>' + esc(t('lounge.demo')) + '</span></p>' : '') +
        '<h1 class="sr-only">' + esc(lg.name) + '</h1>' +
        '<button type="button" class="lm-ask" data-go="pitanje"><b>' + esc(t('lounge.ask')) + '</b><span>' + esc(t('lounge.askSub')) + '</span><i aria-hidden="true">' + icon('arrowRight') + '</i></button>' +
        '<div class="lm-tools">' +
          '<div class="search search--small lm-search"><span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
            '<label class="sr-only" for="lm-q">' + esc(t('lounge.search')) + '</label>' +
            '<input class="search__input" id="lm-q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('lounge.searchPh')) + '">' +
          '</div>' +
          '<div class="lm-chips" id="lm-chips" role="group" aria-label="' + esc(t('lounge.kind')) + '"></div>' +
        '</div>' +
        '<section class="lm-sec" id="lm-topsec"><h2 class="lm-h">' + esc(t('lounge.top')) + ' <small>' + esc(t('lounge.topSub', V.loungeNames(lg))) + '</small></h2><ul class="lm-list" id="lm-top" role="list"></ul></section>' +
        '<section class="lm-sec" id="lm-mixsec"><h2 class="lm-h">' + esc(t('lounge.mixes')) + ' <small>' + esc(t('lounge.mixesSub')) + '</small></h2><div class="lm-mixes" id="lm-mixes"></div></section>' +
        '<section class="lm-sec" id="lm-allsec">' +
          '<div class="lm-allhead"><h2 class="lm-h">' + esc(t('lounge.allFlavors')) + ' <small id="lm-count"></small></h2>' +
            '<label class="lm-sort"><span class="sr-only">' + esc(t('lounge.sort')) + '</span><select id="lm-sort">' +
              ['top', 'az', 'brand', 'sweet', 'cold'].map(function (k) { return '<option value="' + k + '">' + esc(t('lounge.sort' + k.charAt(0).toUpperCase() + k.slice(1))) + '</option>'; }).join('') +
            '</select></label></div>' +
          '<ul class="lm-list" id="lm-list" role="list"></ul>' +
          '<div class="lm-empty" id="lm-empty" hidden></div>' +
          '<nav class="lm-pages" id="lm-pages" aria-label="' + esc(t('lounge.allFlavors')) + '"></nav>' +
        '</section>' +
        '<noscript><p class="lm-nojs">' + esc(t('lounge.noJs')) + ' ' + names.join(', ') + '</p></noscript>' +
        '<div class="lm-ov" id="lm-ov" role="dialog" aria-modal="true" hidden><div class="lm-ov__box" id="lm-ovbox"></div></div>' +
      '</div>'
    );
  };

  V.pageLoungeInfo = function (crumbs) {
    var demo = V.lounges().filter(function (l) { return l.demo; })[0];
    var demoUrl = demo ? V.urlFor(MSP.lang, 'lounge', demo.id) : '';
    function card(n, ic) {
      return '<li class="li-card"><span class="li-card__ic" aria-hidden="true">' + icon(ic) + '</span><b>' + esc(t('loungeInfo.g' + n + 't')) + '</b><span>' + esc(t('loungeInfo.g' + n)) + '</span></li>';
    }
    function step(n) {
      return '<li class="li-step"><span class="li-step__n">' + n + '</span><b>' + esc(t('loungeInfo.h' + n + 't')) + '</b><span>' + esc(t('loungeInfo.h' + n)) + '</span></li>';
    }
    var cta = demo ? '<a class="btn btn--primary" href="' + demoUrl + '">' + esc(t('loungeInfo.demo')) + icon('arrowRight') + '</a>' : '';
    return (
      V.pageHero({ id: 'lounge-info-title', eyebrow: t('loungeInfo.eyebrow'), title: t('loungeInfo.title'), lead: t('loungeInfo.lead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container li">' +
        '<p class="li-cta">' + cta + '<small>' + esc(t('loungeInfo.demoNote')) + '</small></p>' +
        '<h2 class="li-h">' + esc(t('loungeInfo.pathsTitle')) + '</h2>' +
        '<div class="li-paths">' +
          '<div class="li-path"><span class="li-path__ic" aria-hidden="true">' + icon('link') + '</span><h3>' + esc(t('loungeInfo.haveTitle')) + '</h3><p>' + esc(t('loungeInfo.haveText')) + '</p></div>' +
          '<div class="li-path li-path--new"><span class="li-path__ic" aria-hidden="true">' + icon('plus') + '</span><h3>' + esc(t('loungeInfo.noneTitle')) + '</h3><p>' + esc(t('loungeInfo.noneText')) + '</p></div>' +
        '</div>' +
        '<h2 class="li-h">' + esc(t('loungeInfo.guestTitle')) + '</h2>' +
        '<ul class="li-cards" role="list">' + card(1, 'leaf') + card(2, 'spark') + card(3, 'mix') + card(4, 'search') + card(5, 'star') + card(6, 'flake') + '</ul>' +
        '<h2 class="li-h">' + esc(t('loungeInfo.howTitle')) + '</h2>' +
        '<ol class="li-steps">' + step(1) + step(2) + step(3) + '</ol>' +
        '<div class="li-contact"><h2>' + esc(t('loungeInfo.contactTitle')) + '</h2><p>' + esc(t('loungeInfo.contactText')) + '</p>' +
          '<p class="li-contact__btns">' + cta + '<a class="btn btn--ghost" href="' + V.url('about') + '#kontakt">' + icon('mail') + '<span>' + esc(t('nav.about')) + '</span></a></p></div>' +
      '</div></section>'
    );
  };
})(typeof window !== 'undefined' ? window : globalThis);
