/*
 * MyShishapedia - Shisha Drop: HTML stranice igre.
 *
 * Statični dio (uvod, dnevni izazov, rang lista, pravila, pitanja) je u HTML-u, da ga
 * vidi i pretraživač, a igra preko cijelog ekrana (sloj #sdx) i prozor za nadimak su
 * skriveni dok ih js/game.js ne otvori. Na stranici nema h1 osim naslova uvoda.
 * Ovisi o: views.js (V), strings.js (t), strings-game.js (MSP.gt).
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  function t(k, v) { return MSP.t(k, v); }
  function g(k, v) { return MSP.gt(k, v); }
  var esc = V.esc;

  var CHAIN = ['blueberry', 'raspberry', 'strawberry', 'lime', 'lemon', 'peach', 'orange', 'mango', 'pineapple', 'melon', 'watermelon'];

  function ico(name) {
    var P = {
      pause: '<path d="M8 5v14M16 5v14"/>',
      sound: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
      mute: '<path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 9l5 6M21 9l-5 6"/>',
      close: '<path d="M6 6l12 12M18 6L6 18"/>',
      share: '<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>',
      play: '<path d="M8 5l11 7-11 7z"/>',
      trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8.5 20h7M10 17h4"/>'
    };
    return '<svg class="sd-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + P[name] + '</svg>';
  }

  function chainList() {
    return '<ol class="sd-chain" role="list">' + CHAIN.map(function (id, i) {
      return '<li class="sd-chain__item" style="--i:' + i + '"><span class="sd-art" data-art="' + id + '" aria-hidden="true"></span><span class="sd-chain__name">' + esc(g('fruits.' + id)) + '</span></li>';
    }).join('') + '</ol>';
  }

  function startCard() {
    return (
      '<div class="sd-start" id="sd" data-ready="0">' +
        '<div class="sd-start__art" aria-hidden="true">' +
          '<div class="sd-vase"><span class="sd-vase__glass"></span><span class="sd-vase__water"></span>' +
            ['watermelon', 'pineapple', 'orange', 'lemon', 'peach', 'strawberry', 'lime', 'raspberry', 'blueberry'].map(function (id, i) {
              return '<span class="sd-art sd-vase__f sd-vase__f--' + i + '" data-art="' + id + '"></span>';
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="sd-card">' +
          '<p class="sd-card__label"><span class="sd-dot" aria-hidden="true"></span>' + esc(g('start.daily')) + ' <span class="sd-card__date" id="sd-date"></span></p>' +
          '<p class="sd-card__status" id="sd-status" aria-live="polite">' + esc(g('start.ready')) + '</p>' +
          '<dl class="sd-stats">' +
            '<div class="sd-stat"><dt>' + esc(g('start.best')) + '</dt><dd id="sd-best">-</dd></div>' +
            '<div class="sd-stat"><dt>' + esc(g('start.today')) + '</dt><dd id="sd-rank">-</dd></div>' +
            '<div class="sd-stat sd-stat--nick"><dt>' + esc(g('start.nick')) + '</dt><dd><span id="sd-nick">' + esc(g('start.nickNone')) + '</span> ' +
              '<button type="button" class="sd-link" id="sd-nick-btn" disabled>' + esc(g('start.nickPick')) + '</button></dd></div>' +
          '</dl>' +
          '<div class="sd-actions">' +
            '<button type="button" class="btn btn--primary sd-btn-play" id="sd-play" disabled>' + ico('play') + '<span>' + esc(g('start.play')) + '</span></button>' +
            '<button type="button" class="btn btn--ghost sd-btn-practice" id="sd-practice" disabled><span>' + esc(g('start.practice')) + '</span><small>' + esc(g('start.practiceSub')) + '</small></button>' +
          '</div>' +
          '<p class="sd-card__next" id="sd-next"></p>' +
          '<p class="sd-card__offline" id="sd-offline" hidden>' + esc(g('start.offline')) + '</p>' +
          '<p class="sd-card__links"><a href="#sd-board">' + esc(g('start.board')) + '</a><a href="#sd-how">' + esc(g('start.how')) + '</a></p>' +
          '<noscript><p class="sd-card__noscript">' + esc(g('page.noscript')) + '</p></noscript>' +
        '</div>' +
      '</div>'
    );
  }

  function board() {
    return (
      '<section class="fsec sd-boardsec" id="sd-board" aria-labelledby="sd-board-title"><div class="container sd-wrap">' +
        '<h2 class="fsec__title" id="sd-board-title">' + ico('trophy') + esc(g('board.title')) + '</h2>' +
        '<div class="segctl sd-tabs" role="group" aria-label="' + esc(g('board.title')) + '">' +
          '<button type="button" class="seg-btn" data-scope="day" aria-pressed="true">' + esc(g('board.day')) + '</button>' +
          '<button type="button" class="seg-btn" data-scope="week" aria-pressed="false">' + esc(g('board.week')) + '</button>' +
        '</div>' +
        '<p class="sd-board__note" id="sd-board-note"></p>' +
        '<ol class="sd-board" id="sd-board-list" aria-live="polite"><li class="sd-board__msg">' + esc(g('board.loading')) + '</li></ol>' +
      '</div></section>'
    );
  }

  function how() {
    return (
      '<section class="fsec sd-howsec" id="sd-how" aria-labelledby="sd-how-title"><div class="container sd-wrap">' +
        '<h2 class="fsec__title" id="sd-how-title">' + esc(g('how.title')) + '</h2>' +
        '<ol class="sd-steps">' + g('how.steps').map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>' +
        '<h3 class="sd-h3">' + esc(g('how.chain')) + '</h3>' +
        chainList() +
        '<h3 class="sd-h3">' + esc(g('how.specials')) + '</h3>' +
        '<ul class="sd-specials" role="list">' +
          [['mint', 'how.mint'], ['ice', 'how.ice'], ['golden', 'how.golden']].map(function (s) {
            return '<li class="sd-special"><span class="sd-art" data-art="' + s[0] + '" aria-hidden="true"></span><p><strong>' + esc(g('fruits.' + s[0])) + '.</strong> ' + esc(g(s[1])) + '</p></li>';
          }).join('') +
        '</ul>' +
        '<h3 class="sd-h3">' + esc(g('how.daily')) + '</h3>' +
        '<p class="sd-p">' + esc(g('how.dailyText')) + '</p>' +
      '</div></section>'
    );
  }

  /** Igra preko cijelog ekrana: skrivena dok je game.js ne otvori (premješta se na kraj <body>). */
  function overlay() {
    return (
      '<div class="sdx" id="sdx" role="dialog" aria-modal="true" aria-label="Shisha Drop" hidden>' +
        '<div class="sdx__hud">' +
          '<div class="sdx__pill sdx__pill--score"><span class="sdx__k">' + esc(g('hud.score')) + '</span><b class="sdx__v" id="sdx-score">0</b></div>' +
          '<div class="sdx__pill sdx__pill--next"><span class="sdx__k">' + esc(g('hud.next')) + '</span><canvas class="sdx__next" id="sdx-next" width="40" height="40" aria-hidden="true"></canvas></div>' +
          '<div class="sdx__pill sdx__pill--rank" id="sdx-rankpill"><span class="sdx__k" id="sdx-ranklabel">' + esc(g('hud.today')) + '</span><b class="sdx__v" id="sdx-rank">-</b></div>' +
          '<div class="sdx__btns">' +
            '<button type="button" class="sdx__btn" id="sdx-sound" aria-pressed="true" aria-label="' + esc(g('hud.soundOff')) + '">' + ico('sound') + ico('mute') + '</button>' +
            '<button type="button" class="sdx__btn" id="sdx-pause" aria-label="' + esc(g('hud.pause')) + '">' + ico('pause') + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="sdx__stage" id="sdx-stage">' +
          '<canvas class="sdx__bg" id="sdx-bg" aria-hidden="true"></canvas>' +
          '<canvas class="sdx__fg" id="sdx-fg" tabindex="0" role="img" aria-label="' + esc(g('hud.aim')) + '"></canvas>' +
          '<p class="sdx__aimhint" id="sdx-hint">' + esc(g('hud.aim')) + '</p>' +
        '</div>' +
        '<div class="sdx__chain" aria-hidden="true">' + CHAIN.map(function (id) { return '<span class="sd-art" data-art="' + id + '"></span>'; }).join('') + '</div>' +
        '<p class="sdx__rotate">' + esc(g('rotate')) + '</p>' +
        // pauza
        '<div class="sdx__panel sdx__pause" id="sdx-pausepanel" hidden>' +
          '<div class="sdx__sheet">' +
            '<h2 class="sdx__title">' + esc(g('pause.title')) + '</h2>' +
            '<button type="button" class="btn btn--primary sdx__wide" id="sdx-resume">' + ico('play') + '<span>' + esc(g('pause.resume')) + '</span></button>' +
            '<button type="button" class="btn btn--ghost sdx__wide" id="sdx-quit">' + esc(g('pause.quit')) + '</button>' +
            '<p class="sdx__small" id="sdx-quitnote"></p>' +
          '</div>' +
        '</div>' +
        // kraj partije
        '<div class="sdx__panel sdx__end" id="sdx-end" hidden>' +
          '<div class="sdx__sheet sdx__sheet--end">' +
            '<p class="sdx__over" id="sdx-endtitle">' + esc(g('end.over')) + '</p>' +
            '<canvas class="sdx__big" id="sdx-endart" width="120" height="120" aria-hidden="true"></canvas>' +
            '<p class="sdx__biggest" id="sdx-biggest"></p>' +
            '<p class="sdx__final" id="sdx-final">0</p>' +
            '<p class="sdx__record" id="sdx-record" hidden>' + esc(g('end.record')) + '</p>' +
            '<p class="sdx__rankline" id="sdx-rankline" aria-live="polite"></p>' +
            '<div class="sdx__endbtns">' +
              '<button type="button" class="btn btn--primary sdx__wide" id="sdx-again">' + ico('play') + '<span id="sdx-again-label">' + esc(g('end.again')) + '</span></button>' +
              '<div class="sdx__row">' +
                '<button type="button" class="btn btn--ghost" id="sdx-share">' + ico('share') + '<span>' + esc(g('end.share')) + '</span></button>' +
                '<button type="button" class="btn btn--ghost" id="sdx-close">' + ico('close') + '<span>' + esc(g('end.close')) + '</span></button>' +
              '</div>' +
              '<p class="sdx__small" id="sdx-sharemsg" aria-live="polite"></p>' +
            '</div>' +
            '<ol class="sd-board sd-board--mini" id="sdx-board"></ol>' +
            '<div class="sdx__a2hs" id="sdx-a2hs" hidden>' +
              '<p><strong>' + esc(g('end.a2hsTitle')) + '</strong><span>' + esc(g('end.a2hsText')) + '</span></p>' +
              '<div class="sdx__a2hs-btns">' +
                '<button type="button" class="btn btn--primary btn--sm" data-install data-install-btn hidden>' + esc(g('end.a2hsBtn')) + '</button>' +
                '<button type="button" class="btn btn--ghost btn--sm" id="sdx-a2hs-later">' + esc(g('end.a2hsLater')) + '</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      // nadimak (otvara se sa stranice i iz igre)
      '<div class="sdm" id="sdm" role="dialog" aria-modal="true" aria-labelledby="sdm-title" hidden>' +
        '<form class="sdm__box" id="sdm-form" novalidate>' +
          '<h2 class="sdm__title" id="sdm-title">' + esc(g('nick.title')) + '</h2>' +
          '<p class="sdm__text" id="sdm-text">' + esc(g('nick.text')) + '</p>' +
          '<label class="sdm__label" for="sdm-input">' + esc(g('nick.label')) + '</label>' +
          '<input class="sdm__input" id="sdm-input" name="nick" type="text" autocomplete="nickname" autocapitalize="off" spellcheck="false" maxlength="16" placeholder="' + esc(g('nick.placeholder')) + '" required>' +
          '<p class="sdm__hint" id="sdm-hint">' + esc(g('nick.hint')) + '</p>' +
          '<p class="sdm__err" id="sdm-err" role="alert"></p>' +
          '<div class="sdm__btns">' +
            '<button type="button" class="btn btn--ghost" id="sdm-cancel">' + esc(g('nick.cancel')) + '</button>' +
            '<button type="submit" class="btn btn--primary" id="sdm-save">' + esc(g('nick.save')) + '</button>' +
          '</div>' +
        '</form>' +
      '</div>'
    );
  }

  V.pageGame = function (crumbs) {
    var faq = g('faq').map(function (f) { return { q: f.q, a: f.a }; });
    return (
      V.pageHero({ id: 'game-title', eyebrow: g('page.eyebrow'), title: 'Shisha Drop', lead: g('page.lead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush sd-startsec" aria-label="' + esc(g('start.daily')) + '"><div class="container sd-wrap">' + startCard() + '</div></section>' +
      board() +
      how() +
      V.faqSection(faq, 'game-faq') +
      overlay()
    );
  };

  V.GAME_CHAIN = CHAIN;
})(typeof window !== 'undefined' ? window : globalThis);
