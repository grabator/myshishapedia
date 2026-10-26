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

  /** Kratka napomena: polica, nedavno gledano i preporuke žive samo u ovom browseru. */
  V.localNote = function (cls) {
    return '<p class="localnote' + (cls ? ' ' + cls : '') + '">' + icon('info') + '<span>' + esc(t('shelf.localNote')) + '</span></p>';
  };

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
          V.localNote() +
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
          V.localNote() +
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

  /**
   * "Šta možeš napraviti od svoje police": recepti za koje korisnik ima oba okusa, recepti kojima fali jedan
   * i ideje za miks od sličnih okusa sa police. Recepti su ugrađeni u stranicu, računa se u browseru (js/shelf.js).
   */
  function shelfMixSection() {
    var recipes = (V.mixes ? V.mixes() : []).map(function (m) {
      return { n: L(m.name), u: V.recipeUrl(m), p: m.parts.map(function (x) { return [x.flavor, x.pct]; }) };
    });
    return (
      '<section class="fsec shelfmix" id="shelfmix" hidden aria-labelledby="shelfmix-h" data-recipes="' + esc(JSON.stringify(recipes)) + '"><div class="container">' +
        '<header class="shelfmix__head">' +
          '<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('shelfMix.eyebrow')) + '</p>' +
          '<h2 class="shelfmix__title" id="shelfmix-h">' + esc(t('shelfMix.title')) + '</h2>' +
          '<p class="shelfmix__lead">' + esc(t('shelfMix.lead')) + '</p>' +
        '</header>' +
        '<div class="shelfmix__groups" id="shelfmix-groups"></div>' +
      '</div></section>'
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
        V.localNote('localnote--shelf') +
      '</div></section>' +
      shelfMixSection() +
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

  /* ================================================================== */
  /* Slika sesije (editor i crtanje su u js/session.js)                  */
  /* ================================================================== */

  /**
   * Okvir stranice: lijevo pregled slike (canvas), desno tri koraka (fotografija, miks, izgled).
   * Okuse za pretragu js/session.js uzima iz data/flavors.js koji je učitan na svakoj stranici.
   */
  V.pageSession = function (crumbs) {
    function field(label, inner, cls) { return '<div class="sfield' + (cls ? ' ' + cls : '') + '"><span class="sfield__label">' + esc(label) + '</span>' + inner + '</div>'; }
    function seg(name, opts) {
      return '<div class="segctl ses-seg" role="group" data-seg="' + name + '">' + opts.map(function (o, i) {
        return '<button type="button" class="seg-btn" data-v="' + o[0] + '" aria-pressed="' + (i === 0) + '">' + esc(t('session.' + o[1])) + '</button>';
      }).join('') + '</div>';
    }
    function check(id, key, on) {
      return '<label class="ses-check"><input type="checkbox" id="' + id + '"' + (on ? ' checked' : '') + '><span>' + esc(t('session.' + key)) + '</span></label>';
    }
    return (
      V.pageHero({ id: 'session-title', eyebrow: t('session.eyebrow'), title: t('session.title'), lead: t('session.lead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container ses" id="ses">' +
        '<p class="ses__shared" id="ses-shared" hidden>' + icon('info') + '<span>' + esc(t('session.shared')) + '</span></p>' +
        '<div class="ses__grid">' +
          // pregled
          '<div class="ses__preview">' +
            '<div class="ses__sticky" id="ses-sticky">' +
              '<div class="ses__stage" id="ses-stage" data-format="post">' +
                '<canvas class="ses__canvas" id="ses-canvas" role="img" aria-label="' + esc(t('session.preview')) + '"></canvas>' +
                '<button type="button" class="ses__expand" id="ses-expand" aria-label="' + esc(t('session.view')) + '">' + icon('expand') + '</button>' +
                '<p class="ses__empty" id="ses-empty" hidden>' + esc(t('session.empty')) + '</p>' +
                // velika dugmad za fotografiju, dok je nema
                '<div class="ses__drop" id="ses-drop">' +
                  '<b>' + esc(t('session.addPhoto')) + '</b>' +
                  '<span class="ses__drop-btns">' +
                    '<label class="btn btn--primary" for="ses-file">' + icon('image') + '<span>' + esc(t('session.gallery')) + '</span></label>' +
                    '<label class="btn btn--ghost ses-photo__cam" for="ses-cam">' + icon('camera') + '<span>' + esc(t('session.takePhoto')) + '</span></label>' +
                  '</span>' +
                  '<small>' + esc(t('session.addPhotoSub')) + '</small>' +
                '</div>' +
              '</div>' +
              '<div class="ses__tools">' +
                '<label class="ses-tool" for="ses-file">' + icon('image') + '<span>' + esc(t('session.photoBtn')) + '</span></label>' +
                '<button type="button" class="ses-tool ses-tool--move" id="ses-move" aria-pressed="false">' + icon('move') + '<span>' + esc(t('session.move')) + '</span></button>' +
                '<button type="button" class="ses-tool" id="ses-reset" aria-label="' + esc(t('session.reset')) + '">' + icon('refresh') + '<span class="ses-tool__long">' + esc(t('session.reset')) + '</span><span class="ses-tool__short" aria-hidden="true">' + esc(t('session.resetShort')) + '</span></button>' +
              '</div>' +
              '<div class="ses-tabs" role="tablist" aria-label="' + esc(t('session.tabs')) + '">' +
                ['stepPhoto', 'stepMix', 'stepLook'].map(function (k, i) {
                  return '<button type="button" role="tab" class="ses-tab" id="ses-tab-' + i + '" data-tab="' + i + '" aria-controls="ses-step-' + i + '" aria-selected="' + (i === 0) + '"><span>' + (i + 1) + '</span>' + esc(t('session.' + k)) + '</button>';
                }).join('') +
              '</div>' +
            '</div>' +
            '<p class="ses__hint">' + icon('move') + '<span class="ses__hint-fine">' + esc(t('session.dragHint')) + '</span><span class="ses__hint-touch">' + esc(t('session.moveHint')) + '</span></p>' +
            '<div class="ses__actions">' +
              '<button type="button" class="btn btn--primary" id="ses-share" hidden>' + icon('arrowUpRight') + '<span>' + esc(t('session.share')) + '</span></button>' +
              '<button type="button" class="btn btn--primary" id="ses-save">' + icon('image') + '<span>' + esc(t('session.save')) + '</span></button>' +
              '<button type="button" class="btn btn--ghost" id="ses-copy">' + icon('link') + '<span>' + esc(t('session.copyLink')) + '</span></button>' +
              '<button type="button" class="btn btn--ghost ses__tojr" id="ses-tojr">' + icon('book') + '<span>' + esc(t('session.toJournal')) + '</span></button>' +
            '</div>' +
            '<p class="ses__jrlink"><a href="' + V.url('journal') + '">' + icon('book') + '<span>' + esc(t('nav.journal')) + '</span><b id="ses-jrcount" hidden></b></a></p>' +
            '<p class="ses__status" id="ses-status" role="status" aria-live="polite"></p>' +
          '</div>' +
          // koraci
          '<div class="ses__panel">' +
            '<div class="ses-step" id="ses-step-0" role="tabpanel" aria-labelledby="ses-tab-0"><h2 class="ses-step__h"><span>1</span>' + esc(t('session.stepPhoto')) + '</h2>' +
              '<div class="ses-photo">' +
                '<label class="btn btn--ghost ses-photo__pick">' + icon('image') + '<span id="ses-pick-txt">' + esc(t('session.pickPhoto')) + '</span><input type="file" id="ses-file" accept="image/*" class="sr-only"></label>' +
                '<label class="btn btn--ghost ses-photo__cam">' + icon('camera') + '<span>' + esc(t('session.takePhoto')) + '</span><input type="file" id="ses-cam" accept="image/*" capture="environment" class="sr-only"></label>' +
                '<button type="button" class="ses__link" id="ses-photo-x" hidden>' + esc(t('session.removePhoto')) + '</button>' +
              '</div>' +
              '<label class="ses-zoom" id="ses-zoomwrap" hidden><span>' + esc(t('session.zoom')) + '</span><input type="range" class="range" id="ses-zoom" min="100" max="250" step="1" value="100"></label>' +
              '<p class="ses-note">' + esc(t('session.photoHint')) + '</p>' +
              '<p class="ses-note ses-note--lock">' + icon('info') + '<span>' + esc(t('session.privacy')) + '</span></p>' +
            '</div>' +
            '<div class="ses-step" id="ses-step-1" role="tabpanel" aria-labelledby="ses-tab-1"><h2 class="ses-step__h"><span>2</span>' + esc(t('session.stepMix')) + '</h2>' +
              '<div class="ses-total"><label for="ses-total">' + esc(t('session.total')) + '</label>' +
                '<span class="ses-num"><input type="number" id="ses-total" inputmode="decimal" min="1" max="60" step="1" value="20"><em>' + esc(t('session.grams')) + '</em></span>' +
                '<button type="button" class="ses__link" id="ses-equal">' + esc(t('session.equal')) + '</button></div>' +
              '<ul class="ses-rows" id="ses-rows" role="list"></ul>' +
              '<div class="ses-add" id="ses-add">' +
                '<div class="search search--small ses-add__search"><span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
                  '<label class="sr-only" for="ses-q">' + esc(t('session.addFlavor')) + '</label>' +
                  '<input class="search__input" id="ses-q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('session.searchPh')) + '" role="combobox" aria-expanded="false" aria-controls="ses-results" aria-autocomplete="list">' +
                '</div>' +
                '<ul class="ses-results" id="ses-results" role="listbox" hidden></ul>' +
                '<details class="ses-custom"><summary>' + esc(t('session.addCustom')) + '</summary>' +
                  '<div class="ses-custom__row"><input type="text" id="ses-cb" maxlength="24" placeholder="' + esc(t('session.customBrand')) + '" aria-label="' + esc(t('session.customBrand')) + '">' +
                  '<input type="text" id="ses-cn" maxlength="32" placeholder="' + esc(t('session.customName')) + '" aria-label="' + esc(t('session.customName')) + '">' +
                  '<button type="button" class="btn btn--ghost" id="ses-cadd">' + icon('plus') + '<span>' + esc(t('session.customAdd')) + '</span></button></div>' +
                '</details>' +
              '</div>' +
              '<p class="ses-note" id="ses-max" hidden>' + esc(t('session.max')) + '</p>' +
            '</div>' +
            '<div class="ses-step" id="ses-step-2" role="tabpanel" aria-labelledby="ses-tab-2"><h2 class="ses-step__h"><span>3</span>' + esc(t('session.stepLook')) + '</h2>' +
              field(t('session.format'), seg('format', [['post', 'fPost'], ['story', 'fStory'], ['square', 'fSquare']])) +
              field(t('session.style'), seg('style', [['neon', 'sNeon'], ['glass', 'sGlass'], ['minimal', 'sMinimal']])) +
              field(t('session.heading'), '<input type="text" class="ses-in" id="ses-head" maxlength="40" placeholder="' + esc(t('session.headingPh')) + '">') +
              '<div class="ses-two">' +
                field(t('session.coals'), '<span class="ses-num"><input type="number" id="ses-coals" inputmode="numeric" min="0" max="9" step="1" value="" placeholder="0"></span>') +
                field(t('session.bowl'), '<input type="text" class="ses-in" id="ses-bowl" maxlength="28" placeholder="' + esc(t('session.bowlPh')) + '">') +
              '</div>' +
              field(t('session.extras'), check('ses-brand', 'showBrand', true) + check('ses-qr', 'showQr', true), 'sfield--checks') +
            '</div>' +
          '</div>' +
        '</div>' +
        // upis u dnevnik sesija
        '<div class="ses-lb ses-jr" id="ses-jr" role="dialog" aria-modal="true" aria-labelledby="ses-jr-h" hidden>' +
          '<form class="ses-jr__box" id="ses-jr-form">' +
            '<button type="button" class="ses-lb__x" id="ses-jr-x" aria-label="' + esc(t('session.close')) + '">' + icon('close') + '</button>' +
            '<h2 class="ses-jr__h" id="ses-jr-h">' + esc(t('session.jrTitle')) + '</h2>' +
            '<div class="ses-jr__top"><img class="ses-jr__thumb" id="ses-jr-thumb" alt=""><div class="ses-jr__mix" id="ses-jr-mix"></div></div>' +
            '<p class="ses-jr__label" id="ses-jr-rl">' + esc(t('session.jrRate')) + '</p>' +
            '<div class="jr-rate jr-rate--big" id="ses-jr-rate" role="radiogroup" aria-labelledby="ses-jr-rl"></div>' +
            '<label class="ses-jr__label" for="ses-jr-note">' + esc(t('journal.note')) + '</label>' +
            '<textarea class="jr-note-in" id="ses-jr-note" maxlength="400" rows="3" placeholder="' + esc(t('journal.notePh')) + '"></textarea>' +
            '<label class="ses-jr__label" for="ses-jr-when">' + esc(t('session.jrWhen')) + '</label>' +
            '<input class="ses-in" type="datetime-local" id="ses-jr-when">' +
            '<div class="ses-jr__btns"><button type="submit" class="btn btn--primary">' + icon('book') + '<span>' + esc(t('session.jrSave')) + '</span></button>' +
            '<button type="button" class="btn btn--ghost" id="ses-jr-cancel">' + esc(t('journal.cancel')) + '</button></div>' +
          '</form>' +
        '</div>' +
        // pregled preko cijelog ekrana
        '<div class="ses-lb" id="ses-lb" role="dialog" aria-modal="true" aria-label="' + esc(t('session.preview')) + '" hidden>' +
          '<button type="button" class="ses-lb__x" id="ses-lb-x" aria-label="' + esc(t('session.close')) + '">' + icon('close') + '</button>' +
          '<img class="ses-lb__img" id="ses-lb-img" alt="' + esc(t('session.preview')) + '">' +
          '<div class="ses-lb__bar">' +
            '<button type="button" class="btn btn--primary" id="ses-lb-share" hidden>' + icon('arrowUpRight') + '<span>' + esc(t('session.share')) + '</span></button>' +
            '<button type="button" class="btn btn--primary" id="ses-lb-save">' + icon('image') + '<span>' + esc(t('session.save')) + '</span></button>' +
            '<button type="button" class="btn btn--ghost" id="ses-lb-jr">' + icon('book') + '<span>' + esc(t('session.toJournal')) + '</span></button>' +
            '<button type="button" class="btn btn--ghost" id="ses-lb-close">' + esc(t('session.close')) + '</button>' +
          '</div>' +
        '</div>' +
        '<noscript><p class="shelf__nojs">' + esc(t('shelf.noJs')) + '</p></noscript>' +
      '</div></section>'
    );
  };
  /**
   * Dnevnik sesija. Sadržaj puni js/journal.js iz localStorage; ovdje je samo okvir.
   */
  V.pageJournal = function (crumbs) {
    function opt(v, k) { return '<option value="' + v + '">' + esc(t('journal.' + k)) + '</option>'; }
    return (
      V.pageHero({ id: 'journal-title', eyebrow: t('journal.eyebrow'), title: t('journal.title'), lead: t('journal.lead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container jr" id="jr">' +
        '<ul class="jr-stats" id="jr-stats" role="list" hidden></ul>' +
        '<div class="jr-best" id="jr-best" hidden></div>' +
        '<div class="jr-tools" id="jr-tools" hidden>' +
          '<div class="search search--small jr-tools__q"><span class="search__icon" aria-hidden="true">' + icon('search') + '</span>' +
            '<label class="sr-only" for="jr-q">' + esc(t('journal.search')) + '</label>' +
            '<input class="search__input" id="jr-q" type="search" autocomplete="off" spellcheck="false" placeholder="' + esc(t('journal.searchPh')) + '">' +
          '</div>' +
          '<label class="jr-sort"><span class="sr-only">' + esc(t('journal.sort')) + '</span><select id="jr-sort">' + opt('new', 'sortNew') + opt('best', 'sortBest') + opt('old', 'sortOld') + '</select></label>' +
          '<a class="btn btn--primary jr-tools__new" href="' + V.url('session') + '">' + icon('plus') + '<span>' + esc(t('journal.newSession')) + '</span></a>' +
        '</div>' +
        '<p class="jr-count" id="jr-count" aria-live="polite"></p>' +
        '<div class="jr-empty" id="jr-empty">' +
          '<span class="jr-empty__art" aria-hidden="true"><i></i></span>' +
          '<h2>' + esc(t('journal.emptyTitle')) + '</h2>' +
          '<p>' + esc(t('journal.emptyText')) + '</p>' +
          '<a class="btn btn--primary" href="' + V.url('session') + '">' + icon('camera') + '<span>' + esc(t('journal.emptyCta')) + '</span></a>' +
        '</div>' +
        '<p class="jr-none" id="jr-none" hidden>' + esc(t('journal.none')) + '</p>' +
        '<ul class="jr-list" id="jr-list" role="list"></ul>' +
        '<p class="jr-status" id="jr-status" role="status" aria-live="polite"></p>' +
        '<details class="jr-backup">' +
          '<summary>' + icon('download') + '<span>' + esc(t('journal.backup')) + '</span></summary>' +
          '<p>' + esc(t('journal.backupText')) + '</p>' +
          '<div class="jr-backup__btns">' +
            '<button type="button" class="btn btn--ghost" id="jr-export">' + icon('download') + '<span>' + esc(t('journal.export')) + '</span></button>' +
            '<label class="btn btn--ghost jr-import">' + icon('upload') + '<span>' + esc(t('journal.import')) + '</span><input type="file" id="jr-import" accept="application/json,.json" class="sr-only"></label>' +
          '</div>' +
        '</details>' +
        '<p class="jr-privacy">' + icon('info') + '<span>' + esc(t('journal.privacy')) + '</span></p>' +
        '<noscript><p class="shelf__nojs">' + esc(t('shelf.noJs')) + '</p></noscript>' +
      '</div></section>'
    );
  };
})(typeof window !== 'undefined' ? window : globalThis);
