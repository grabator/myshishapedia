/*
 * MyShishapedia - stranica "Evolucija nargile" (HTML).
 *
 * Pravi kompletan statični HTML stranice (koristi ga build.mjs): uvod sa nargilom rastavljenom na dijelove,
 * "put dima" (kartice 14 stanica preko globusa), nazive, evoluciju dijelova, mit ili istinu, zdravlje i izvore.
 * Sav tekst je u HTML-u; js/history.js samo dodaje kretanje (globus, let kamere, rastavljanje nargile).
 *
 * Ovisi o: strings.js, data/history.js (window.HISTORY), data/history-map.js (window.HISTORY_MAP), views.js.
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  var esc = V.esc;
  function t(k, v) { return MSP.t(k, v); }
  function L(v) { return MSP.L(v); }
  function H() { return root.HISTORY || { stations: [], names: [], parts: [], myths: [], hookahParts: [], sources: [] }; }

  V.historyData = H;

  /** Stil karte i kartice po godini: stara karta, štampana karta ili moderna noć. */
  V.historyEra = function (year) { return year < 1850 ? 'old' : year < 1985 ? 'print' : 'modern'; };

  /* ------------------------------------------------------------------ */
  /* Ilustracije nargila (simboli, crtaju se jednom pa <use>)             */
  /* ------------------------------------------------------------------ */

  var ART = {
    qalyan:
      '<path class="hx-a-glass" d="M60 108C30 110 22 140 26 160C30 182 46 192 60 192C74 192 90 182 94 160C98 140 90 110 60 108Z"/>' +
      '<path class="hx-a-water" d="M29 162C31 180 46 188 60 188C74 188 89 180 91 162Z"/>' +
      '<rect class="hx-a-metal" x="52" y="86" width="16" height="24" rx="3"/>' +
      '<rect class="hx-a-metal" x="56" y="40" width="8" height="48"/><ellipse class="hx-a-metal" cx="60" cy="64" rx="10" ry="5"/>' +
      '<path class="hx-a-clay" d="M42 22H78L68 42H52Z"/><path class="hx-a-ember" d="M46 20Q60 10 74 20Z"/>' +
      '<path class="hx-a-pipe" d="M66 96L112 52"/><circle class="hx-a-metal" cx="112" cy="52" r="3.5"/>',
    huqqa:
      '<circle class="hx-a-metal" cx="56" cy="158" r="32"/><path class="hx-a-line" d="M30 150Q56 138 82 150M28 166Q56 178 84 166"/>' +
      '<ellipse class="hx-a-metal" cx="56" cy="190" rx="20" ry="5"/>' +
      '<rect class="hx-a-metal" x="51" y="74" width="10" height="56"/><ellipse class="hx-a-metal" cx="56" cy="96" rx="11" ry="4"/><ellipse class="hx-a-metal" cx="56" cy="126" rx="14" ry="5"/>' +
      '<path class="hx-a-clay" d="M42 42H70L62 74H50Z"/><path class="hx-a-ember" d="M44 40Q56 30 68 40Z"/>' +
      '<path class="hx-a-hose" d="M84 146C108 140 116 116 104 104C92 92 80 110 94 118C110 126 118 96 112 62C108 40 98 30 104 18"/>' +
      '<path class="hx-a-metal" d="M101 20L109 22L107 8L103 8Z"/>',
    bidri:
      '<circle class="hx-a-dark" cx="60" cy="146" r="40"/>' +
      '<path class="hx-a-inlay" d="M30 132Q60 118 90 132M28 152Q60 168 92 152"/>' +
      '<g class="hx-a-inlayf"><circle cx="44" cy="142" r="4"/><circle cx="60" cy="138" r="4.6"/><circle cx="76" cy="142" r="4"/><path d="M52 150Q60 160 68 150Q60 154 52 150Z"/><path d="M36 160Q44 166 50 160Q44 162 36 160Z"/><path d="M70 160Q76 166 84 160Q76 162 70 160Z"/></g>' +
      '<ellipse class="hx-a-dark" cx="60" cy="188" rx="22" ry="5"/><rect class="hx-a-dark" x="50" y="96" width="20" height="14" rx="3"/>' +
      '<path class="hx-a-inlay" d="M50 103H70"/>' +
      '<rect class="hx-a-metal" x="56" y="56" width="8" height="40"/><path class="hx-a-clay" d="M46 30H74L66 56H54Z"/><path class="hx-a-ember" d="M48 28Q60 18 72 28Z"/>',
    nargile:
      '<path class="hx-a-glass" d="M60 112C36 116 28 146 32 166C36 186 48 194 60 194C72 194 84 186 88 166C92 146 84 116 60 112Z"/>' +
      '<path class="hx-a-water" d="M34 160C36 182 48 190 60 190C72 190 84 182 86 160Z"/>' +
      '<rect class="hx-a-metal" x="56" y="34" width="8" height="80"/><circle class="hx-a-metal" cx="60" cy="72" r="7"/><circle class="hx-a-metal" cx="60" cy="96" r="5"/><ellipse class="hx-a-metal" cx="60" cy="112" rx="12" ry="4"/>' +
      '<ellipse class="hx-a-metal" cx="60" cy="40" rx="24" ry="5"/><path class="hx-a-clay" d="M46 16H74L66 36H54Z"/><path class="hx-a-ember" d="M48 14Q60 4 72 14Z"/>' +
      '<path class="hx-a-hose" d="M66 84C40 88 14 100 12 126C10 150 24 160 18 178"/><path class="hx-a-metal" d="M14 176L22 176L20 196L16 196Z"/>',
    coconut:
      '<ellipse class="hx-a-wood" cx="60" cy="152" rx="38" ry="34"/><path class="hx-a-line" d="M30 140Q60 124 90 140M28 158Q60 146 92 158M32 174Q60 166 88 174"/>' +
      '<g class="hx-a-dot"><circle cx="50" cy="132" r="2.4"/><circle cx="60" cy="128" r="2.4"/><circle cx="56" cy="138" r="2.4"/></g>' +
      '<rect class="hx-a-wood" x="55" y="56" width="10" height="64"/><ellipse class="hx-a-metal" cx="60" cy="76" rx="9" ry="4"/><ellipse class="hx-a-metal" cx="60" cy="118" rx="12" ry="4"/>' +
      '<path class="hx-a-clay" d="M44 30H76L68 56H52Z"/><path class="hx-a-ember" d="M46 28Q60 18 74 28Z"/>' +
      '<path class="hx-a-pipe" d="M90 140L114 92"/>',
    glass:
      '<path class="hx-a-glass" d="M42 118H78L84 136C92 150 92 186 76 194H44C28 186 28 150 36 136Z"/>' +
      '<path class="hx-a-water" d="M33 162C33 178 36 188 44 192H76C84 188 87 178 87 162Z"/><path class="hx-a-line" d="M48 124V188M60 122V190M72 124V188"/>' +
      '<rect class="hx-a-metal" x="56" y="40" width="8" height="78"/><circle class="hx-a-metal" cx="60" cy="66" r="6"/><circle class="hx-a-metal" cx="60" cy="90" r="8"/>' +
      '<ellipse class="hx-a-metal" cx="60" cy="44" rx="26" ry="5"/><path class="hx-a-clay" d="M46 20H74L66 40H54Z"/><path class="hx-a-ember" d="M48 18Q60 8 72 18Z"/>' +
      '<path class="hx-a-hose" d="M66 104C92 110 108 128 104 152C100 172 110 182 108 194"/>',
    egypt:
      '<path class="hx-a-glass" d="M60 140C42 142 36 160 38 172C40 186 50 194 60 194C70 194 80 186 82 172C84 160 78 142 60 140Z"/>' +
      '<path class="hx-a-water" d="M40 170C42 186 50 190 60 190C70 190 78 186 80 170Z"/>' +
      '<rect class="hx-a-metal" x="57" y="40" width="6" height="102"/><circle class="hx-a-metal" cx="60" cy="58" r="5"/><circle class="hx-a-metal" cx="60" cy="76" r="7"/><circle class="hx-a-metal" cx="60" cy="98" r="9"/><circle class="hx-a-metal" cx="60" cy="122" r="6"/>' +
      '<ellipse class="hx-a-metal" cx="60" cy="44" rx="30" ry="5"/><path class="hx-a-clay" d="M47 20H73L66 40H54Z"/><path class="hx-a-ember" d="M49 18Q60 8 71 18Z"/>' +
      '<path class="hx-a-hose" d="M66 110C40 112 18 124 18 146C18 166 30 176 24 192"/>',
    modern:
      '<path class="hx-a-glass" d="M24 150H96V182Q96 194 84 194H36Q24 194 24 182Z"/><path class="hx-a-water" d="M25 168H95V182Q95 192 84 192H36Q25 192 25 182Z"/>' +
      '<rect class="hx-a-steel" x="56" y="44" width="8" height="106"/><rect class="hx-a-steel" x="48" y="140" width="24" height="10" rx="3"/><rect class="hx-a-steel" x="52" y="96" width="16" height="5" rx="2"/>' +
      '<ellipse class="hx-a-steel" cx="60" cy="50" rx="24" ry="4"/><path class="hx-a-clay" d="M44 24H76L68 44H52Z"/><path class="hx-a-steel" d="M42 14H78L74 24H46Z"/><rect class="hx-a-steel" x="56" y="8" width="8" height="6" rx="2"/>' +
      '<path class="hx-a-ember" d="M46 25H74"/>' +
      '<path class="hx-a-hose" d="M64 118C92 118 108 136 104 158C100 176 108 184 106 192"/><path class="hx-a-steel" d="M102 170L110 170L108 196L104 196Z"/>'
  };

  function artDefs() {
    return (
      '<svg class="hx-defs" width="0" height="0" aria-hidden="true" focusable="false"><defs>' +
        Object.keys(ART).map(function (k) { return '<symbol id="hx-art-' + k + '" viewBox="0 0 120 200">' + ART[k] + '</symbol>'; }).join('') +
        '<linearGradient id="hx-g-metal" x1="0" x2="1"><stop offset="0" stop-color="#7a5328"/><stop offset=".45" stop-color="#f1c27a"/><stop offset=".7" stop-color="#c58a3c"/><stop offset="1" stop-color="#6a4520"/></linearGradient>' +
        '<linearGradient id="hx-g-steel" x1="0" x2="1"><stop offset="0" stop-color="#4b4f57"/><stop offset=".45" stop-color="#e8ecf2"/><stop offset=".7" stop-color="#9aa1ab"/><stop offset="1" stop-color="#3c4048"/></linearGradient>' +
        '<linearGradient id="hx-g-clay" x1="0" x2="1"><stop offset="0" stop-color="#6b2d18"/><stop offset=".5" stop-color="#c0643a"/><stop offset="1" stop-color="#5a2412"/></linearGradient>' +
        '<linearGradient id="hx-g-glass" x1="0" x2="1"><stop offset="0" stop-color="#9fd3e0" stop-opacity=".18"/><stop offset=".35" stop-color="#e9fbff" stop-opacity=".42"/><stop offset=".6" stop-color="#9fd3e0" stop-opacity=".16"/><stop offset="1" stop-color="#2f6d7c" stop-opacity=".34"/></linearGradient>' +
        '<linearGradient id="hx-g-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5fb6c9" stop-opacity=".55"/><stop offset="1" stop-color="#1d5664" stop-opacity=".75"/></linearGradient>' +
        '<radialGradient id="hx-g-ember" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#fff1b8"/><stop offset=".4" stop-color="#ffb13b"/><stop offset=".8" stop-color="#e2541b"/><stop offset="1" stop-color="#7a1d0a"/></radialGradient>' +
        '<linearGradient id="hx-g-hose" x1="0" x2="1"><stop offset="0" stop-color="#2b1712"/><stop offset=".5" stop-color="#7b2b22"/><stop offset="1" stop-color="#2b1712"/></linearGradient>' +
      '</defs></svg>'
    );
  }

  function art(kind, cls) {
    return '<svg class="hx-art' + (cls ? ' ' + cls : '') + '" viewBox="0 0 120 200" aria-hidden="true" focusable="false"><use href="#hx-art-' + kind + '"/></svg>';
  }
  V.historyArt = art;
  V.historyArtKinds = Object.keys(ART);

  /* ------------------------------------------------------------------ */
  /* Nargila za uvod: svaki dio je svoj sloj (rastavlja se u 3D)          */
  /* ------------------------------------------------------------------ */

  // x, y: tačka natpisa (viewBox 400x800); side: na koju stranu ide natpis
  var PARTS = {
    stub: { ex: [0, -40, 0, 0], x: 186, y: 300, side: 'l', svg:
      '<rect x="194" y="548" width="12" height="150" rx="4" fill="url(#hx-g-steel)" opacity=".85"/>' +
      '<rect x="188" y="166" width="24" height="384" rx="6" fill="url(#hx-g-metal)"/>' +
      '<ellipse cx="200" cy="236" rx="24" ry="9" fill="url(#hx-g-metal)"/><ellipse cx="200" cy="298" rx="18" ry="7" fill="url(#hx-g-metal)"/>' +
      '<circle cx="200" cy="420" r="20" fill="url(#hx-g-metal)"/><circle cx="194" cy="414" r="6" fill="#fff6dc" opacity=".55"/>' +
      '<rect x="210" y="344" width="50" height="15" rx="5" fill="url(#hx-g-metal)"/><circle cx="262" cy="351" r="7" fill="url(#hx-g-metal)"/>' +
      '<path d="M156 520H244L232 552H168Z" fill="url(#hx-g-metal)"/><rect x="164" y="514" width="72" height="8" rx="4" fill="#3a2a1c"/>' },
    difuzor: { ex: [-140, -250, 0, 140], x: 200, y: 728, side: 'b', svg:
      '<rect x="184" y="692" width="32" height="30" rx="8" fill="url(#hx-g-steel)"/>' +
      '<g fill="#1d2228"><circle cx="193" cy="704" r="2.6"/><circle cx="200" cy="710" r="2.6"/><circle cx="207" cy="704" r="2.6"/><circle cx="193" cy="714" r="2.6"/><circle cx="207" cy="714" r="2.6"/></g>' },
    vaza: { ex: [0, 100, 0, 60], x: 200, y: 792, side: 'b', svg:
      '<path d="M168 548H232L236 582C300 602 318 660 312 704C306 752 262 784 200 784C138 784 94 752 88 704C82 660 100 602 164 582Z" fill="url(#hx-g-glass)" stroke="#bfe9f2" stroke-opacity=".5" stroke-width="2"/>' +
      '<path d="M94 662H306C314 700 304 770 200 778C96 770 86 700 94 662Z" fill="url(#hx-g-water)"/>' +
      '<path d="M118 640C112 690 126 740 160 762" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="7" stroke-linecap="round"/>' +
      '<g class="hx-bubbles" fill="#e9fbff" fill-opacity=".55"><circle cx="196" cy="690" r="5"/><circle cx="206" cy="676" r="3.6"/><circle cx="199" cy="668" r="2.6"/><circle cx="210" cy="700" r="2.2"/></g>' +
      '<rect x="166" y="546" width="68" height="6" rx="3" fill="#bfe9f2" opacity=".55"/>' },
    tacna: { ex: [0, -150, 0, 90], x: 200, y: 218, side: 'b', svg:
      '<ellipse cx="200" cy="194" rx="100" ry="18" fill="url(#hx-g-metal)"/><ellipse cx="200" cy="189" rx="88" ry="12" fill="#5b3a1b"/><ellipse cx="200" cy="187" rx="84" ry="9" fill="url(#hx-g-metal)" opacity=".7"/>' +
      '<rect x="130" y="180" width="18" height="10" rx="3" fill="#1a1412"/><rect x="246" y="182" width="16" height="9" rx="3" fill="#1a1412"/>' },
    gumica: { ex: [-140, 150, 0, 160], x: 200, y: 178, side: 'b', svg:
      '<rect x="178" y="154" width="44" height="16" rx="5" fill="#2b2523"/><rect x="180" y="157" width="40" height="3" rx="1.5" fill="#57504c"/>' },
    glava: { ex: [-140, 40, 0, 200], x: 200, y: 160, side: 'b', svg:
      '<ellipse class="hx-glow" cx="200" cy="88" rx="70" ry="22" fill="url(#hx-g-ember)" opacity=".35"/>' +
      '<path d="M140 88H260C258 108 236 126 222 134L218 156H182L178 134C164 126 142 108 140 88Z" fill="url(#hx-g-clay)"/>' +
      '<path d="M150 92H250" stroke="#2a120a" stroke-width="3" opacity=".5"/>' +
      '<path d="M146 58H254L246 86H154Z" fill="url(#hx-g-steel)"/><rect x="188" y="44" width="24" height="15" rx="5" fill="url(#hx-g-steel)"/>' +
      '<g stroke="#262a30" stroke-width="3" stroke-linecap="round"><path d="M168 66V78"/><path d="M184 66V78"/><path d="M216 66V78"/><path d="M232 66V78"/></g>' +
      '<rect x="160" y="84" width="80" height="5" rx="2.5" fill="url(#hx-g-ember)"/>' },
    crijevo: { ex: [70, -150, 0, 110], x: 290, y: 706, side: 'b', svg:
      '<path d="M258 351C300 350 330 380 334 430C340 500 300 540 316 600C326 640 352 660 346 700" fill="none" stroke="url(#hx-g-hose)" stroke-width="13" stroke-linecap="round"/>' +
      '<path d="M262 347C300 348 326 378 330 426" fill="none" stroke="#e9a291" stroke-opacity=".35" stroke-width="3" stroke-linecap="round"/>' },
    usnik: { ex: [40, -110, 0, 180], x: 340, y: 794, side: 'b', svg:
      '<path d="M339 694L355 698L341 778L326 774Z" fill="url(#hx-g-metal)"/><rect x="336" y="690" width="22" height="10" rx="4" transform="rotate(12 347 695)" fill="#2b2523"/>' +
      '<path d="M328 772L340 775L338 790L330 788Z" fill="#c9a26b"/>' }
  };
  // redoslijed slojeva (od pozadi prema naprijed)
  var LAYERS = ['stub', 'difuzor', 'vaza', 'tacna', 'gumica', 'glava', 'crijevo', 'usnik'];

  // Evolucija na početku: jedna nargila se pretapa u sljedeću, od starog oblika do moderne (prave slike iz muzeja)
  function morph() {
    var list = (H().museum || []).filter(function (m) { return !m.wide; });
    if (!list.length) return '';
    var m0 = list[0];
    var img = function (m, cls, first) {
      return '<img class="hx-morph__img' + cls + '" src="/history/' + m.id + '.webp" srcset="/history/' + m.id + '-s.webp 420w, /history/' + m.id + '.webp 720w" sizes="(min-width: 900px) 40vw, 80vw"' +
        ' width="' + m.w + '" height="' + m.h + '" decoding="async"' + (first ? ' fetchpriority="high" alt="' + esc(L(m.name)) + '"' : ' alt="" aria-hidden="true"') + '>';
    };
    return (
      '<figure class="hx-morph" id="hx-morph">' +
        '<span class="hx-morph__beam" aria-hidden="true"></span>' +
        '<span class="hx-morph__obj">' + img(m0, ' is-on', true) + img(list[1] || m0, '', false) + '</span>' +
        '<span class="hx-morph__plinth" aria-hidden="true"></span>' +
        '<figcaption class="hx-morph__cap"><span class="hx-morph__k" id="hx-morph-k">' + esc(L(m0.k)) + '</span><span class="hx-morph__n" id="hx-morph-n">' + esc(L(m0.name)) + '</span></figcaption>' +
      '</figure>' +
      '<div class="hx-rail" role="group" aria-label="' + esc(t('history.morphLabel')) + '">' +
        '<span class="hx-rail__end">' + esc(t('history.morphThen')) + '</span>' +
        '<ol class="hx-rail__list" role="list">' + list.map(function (m, i) {
          return '<li><button type="button" class="hx-rail__btn' + (i === 0 ? ' is-on' : '') + '" data-m="' + i + '" aria-pressed="' + (i === 0) + '" aria-label="' + esc(L(m.name)) + '">' +
            '<img src="/history/' + m.id + '-s.webp" width="' + Math.round(m.w * 420 / m.h) + '" height="420" alt="" loading="lazy" decoding="async"></button></li>';
        }).join('') + '</ol>' +
        '<span class="hx-rail__end">' + esc(t('history.morphNow')) + '</span>' +
      '</div>'
    );
  }

  function heroHookah() {
    var info = {};
    H().hookahParts.forEach(function (p) { info[p.id] = p; });
    return (
      '<div class="hx-hookah" id="hx-hookah"><div class="hx-rig">' +
        LAYERS.map(function (id) {
          var p = PARTS[id];
          var hp = info[id];
          return (
            '<div class="hx-part" data-part="' + id + '" style="--x:' + (p.ex[0] / 4) + '%;--y:' + (p.ex[1] / 8) + '%;--z:' + p.ex[2] + 'px;--d:' + p.ex[3] + 'ms">' +
              '<svg viewBox="0 0 400 800" aria-hidden="true" focusable="false">' + p.svg + '</svg>' +
              (hp ? '<button type="button" class="hx-tag hx-tag--' + p.side + '" style="left:' + (p.x / 4) + '%;top:' + (p.y / 8) + '%" aria-expanded="false" aria-describedby="hx-tag-' + id + '">' +
                '<span class="hx-tag__line" aria-hidden="true"></span><span class="hx-tag__name">' + esc(L(hp.name)) + '</span>' +
                '<span class="hx-tag__text" id="hx-tag-' + id + '">' + esc(L(hp.t)) + '</span></button>' : '') +
            '</div>'
          );
        }).join('') +
      '</div></div>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Dijelovi stranice                                                   */
  /* ------------------------------------------------------------------ */

  function sup(src) {
    return '<sup class="hx-src">' + (src || []).map(function (n) {
      return '<a href="#izvor-' + n + '" aria-label="' + esc(t('history.source', { n: n })) + '">' + n + '</a>';
    }).join('') + '</sup>';
  }

  function stationCard(s, i, total) {
    var era = V.historyEra(s.year);
    var hid = 'st-' + s.id + '-h';
    return (
      '<li class="hx-st hx-era-' + era + '" id="' + s.id + '" data-i="' + i + '">' +
        '<article class="hx-card" aria-labelledby="' + hid + '">' +
          '<p class="hx-card__meta"><span class="hx-card__n">' + esc(t('history.station', { n: i + 1, total: total })) + '</span>' +
            '<time class="hx-card__when" datetime="' + s.year + '">' + esc(L(s.when)) + '</time></p>' +
          '<p class="hx-card__place">' + esc(L(s.place)) + '</p>' +
          '<h3 class="hx-card__title" id="' + hid + '">' + esc(L(s.title)) + '</h3>' +
          '<div class="hx-card__body">' +
            '<figure class="hx-card__art">' + art(s.art) +
              '<figcaption>' + esc(t('history.illustration', { name: t('history.art.' + s.art) })) + '</figcaption></figure>' +
            '<div class="hx-card__text">' +
              (s.name ? '<p class="hx-card__name"><span>' + esc(t('history.localName')) + '</span> <b>' + esc(s.name) + '</b></p>' : '') +
              '<ul class="hx-facts" role="list">' + s.facts.map(function (f) { return '<li>' + esc(L(f.t)) + sup(f.src) + '</li>'; }).join('') + '</ul>' +
            '</div>' +
          '</div>' +
          (s.fun ? '<aside class="hx-fun"><p class="hx-fun__label">' + esc(t('history.fun')) + '</p><p>' + esc(L(s.fun.t)) + sup(s.fun.src) + '</p></aside>' : '') +
          '<button type="button" class="hx-postcard" data-postcard="' + i + '" hidden>' + V.icon('mail') + '<span>' + esc(t('history.postcard')) + '</span></button>' +
        '</article>' +
      '</li>'
    );
  }

  function hud(stations) {
    var dots = stations.map(function (s, i) {
      return '<li><a class="hx-dot" href="#' + s.id + '" data-go="' + i + '" title="' + esc(L(s.city)) + ', ' + esc(L(s.when)) + '">' +
        '<span class="sr-only">' + esc(L(s.place)) + ', ' + esc(L(s.when)) + '</span></a></li>';
    }).join('');
    var list = stations.map(function (s, i) {
      return '<li><a href="#' + s.id + '" data-go="' + i + '"><span class="hx-skip__y">' + esc(L(s.when)) + '</span><span>' + esc(L(s.place)) + '</span></a></li>';
    }).join('');
    return (
      '<div class="hx-hud" id="hx-hud">' +
        '<p class="hx-year" aria-hidden="true"><span class="hx-year__num" id="hx-year">2026</span><span class="hx-year__place" id="hx-place"></span></p>' +
        '<nav class="hx-line" aria-label="' + esc(t('history.timeline')) + '"><span class="hx-line__fill" aria-hidden="true"></span><ol role="list">' + dots + '</ol></nav>' +
        '<div class="hx-skip">' +
          '<button type="button" class="hx-skip__btn" aria-expanded="false" aria-controls="hx-skip-list">' + esc(t('history.skip')) + V.icon('chevronDown') + '</button>' +
          '<ol class="hx-skip__list" id="hx-skip-list" role="list" hidden>' + list + '</ol>' +
        '</div>' +
      '</div>'
    );
  }

  var IC_PLAY = '<svg class="icon hx-i-play" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>' +
    '<svg class="icon hx-i-pause" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>';

  function controls(total) {
    return (
      '<div class="hx-ctrl" id="hx-ctrl">' +
        '<button type="button" class="hx-ctrl__btn" data-step="-1" aria-label="' + esc(t('history.prev')) + '">' + V.icon('arrowLeft') + '</button>' +
        '<button type="button" class="hx-ctrl__btn hx-ctrl__play" data-play aria-pressed="false"><span class="hx-ctrl__ring" aria-hidden="true"></span>' + IC_PLAY +
          '<span class="hx-ctrl__lbl hx-ctrl__lbl--play">' + esc(t('history.play')) + '</span><span class="hx-ctrl__lbl hx-ctrl__lbl--pause">' + esc(t('history.pause')) + '</span></button>' +
        '<span class="hx-ctrl__n" id="hx-count" aria-hidden="true">0 / ' + total + '</span>' +
        '<button type="button" class="hx-ctrl__btn" data-step="1" aria-label="' + esc(t('history.next')) + '">' + V.icon('arrowRight') + '</button>' +
        '<button type="button" class="hx-ctrl__btn hx-ctrl__sound" data-sound aria-pressed="false" aria-label="' + esc(t('history.soundOn')) + '" hidden>' +
          '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"/><path class="hx-snd-on" d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/><path class="hx-snd-off" d="M16 9.5l5 5M21 9.5l-5 5"/></svg></button>' +
        '<button type="button" class="hx-ctrl__btn hx-ctrl__card" data-card aria-pressed="false" aria-label="' + esc(t('history.cardHide')) + '">' + V.icon('chevronDown') + '</button>' +
      '</div>'
    );
  }

  // ukupna dužina puta dima (veliki krug između susjednih stanica), u km, zaokruženo na 100
  function trailKm(st) {
    var R = 6371, km = 0, rad = Math.PI / 180;
    for (var i = 1; i < st.length; i++) {
      var a = st[i - 1], b = st[i];
      var d = Math.sin((b.lat - a.lat) * rad / 2) * Math.sin((b.lat - a.lat) * rad / 2) +
        Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin((b.lon - a.lon) * rad / 2) * Math.sin((b.lon - a.lon) * rad / 2);
      km += 2 * R * Math.asin(Math.sqrt(d));
    }
    return Math.round(km / 100) * 100;
  }
  V.historyKm = trailKm;

  // Muzej nargila: prave nargile (izrezane fotografije), od starijih oblika prema modernim.
  // w, h: veličina velike slike (/history/<id>.webp); mala (-s) je visoka 420 px. wide: eksponat preko cijele širine.
  var MUSEUM = H().museum || [];

  function museumSection() {
    var pad = function (n) { return (n < 9 ? '0' : '') + (n + 1); };
    return (
      '<section class="hx-museum" aria-labelledby="hx-museum-h">' +
        '<div class="container">' +
          '<div class="hx-museum__top">' +
            '<header class="hx-head" data-reveal>' +
              '<p class="hx-museum__sign"><span>' + esc(t('history.museumSign')) + '</span><span>' + esc(t('history.museumCount', { n: MUSEUM.length })) + '</span></p>' +
              '<h2 class="hx-h2" id="hx-museum-h">' + esc(t('history.museumTitle')) + '</h2><p class="hx-intro-p">' + esc(t('history.museumIntro')) + '</p></header>' +
            '<figure class="hx-people" data-reveal>' +
              '<img src="/history/pusac.webp" width="678" height="452" loading="lazy" decoding="async" alt="' + esc(t('history.peopleAlt')) + '">' +
              '<figcaption><span class="hx-people__q">' + esc(t('history.peopleQuote')) + '</span><span class="hx-people__c">' + esc(t('history.peopleCredit')) + '</span></figcaption>' +
            '</figure>' +
          '</div>' +
          '<ul class="hx-hall" role="list">' + MUSEUM.map(function (m, i) {
            var sw = Math.round(m.w * 420 / m.h);
            return (
              '<li class="hx-niche' + (m.wide ? ' hx-niche--wide' : '') + '" data-reveal style="--i:' + (i % 4) + '">' +
                '<button type="button" class="hx-niche__btn" data-exhibit="' + i + '" aria-haspopup="dialog">' +
                  '<span class="hx-niche__light" aria-hidden="true"></span>' +
                  '<span class="hx-niche__obj"><img src="/history/' + m.id + '-s.webp" width="' + sw + '" height="420" loading="lazy" decoding="async" alt="' + esc(L(m.name)) + '"></span>' +
                  '<span class="hx-niche__plinth" aria-hidden="true"></span>' +
                  '<span class="hx-plaque"><span class="hx-plaque__no">' + esc(t('history.exhibitNo', { n: pad(i) })) + '</span><span class="hx-plaque__n">' + esc(L(m.name)) + '</span><span class="hx-plaque__k">' + esc(L(m.k)) + '</span></span>' +
                '</button>' +
              '</li>'
            );
          }).join('') + '</ul>' +
          '<p class="hx-museum__note">' + esc(t('history.museumNote')) + '</p>' +
        '</div>' +
        '<div class="hx-vitrine" id="hx-vitrine" role="dialog" aria-modal="true" aria-labelledby="hx-vitrine-h" hidden>' +
          '<div class="hx-vitrine__in">' +
            '<button type="button" class="hx-vitrine__close" data-v="close" aria-label="' + esc(t('history.close')) + '">' + V.icon('close') + '</button>' +
            '<div class="hx-vitrine__stage"><span class="hx-vitrine__beam" aria-hidden="true"></span><img class="hx-vitrine__img" alt=""></div>' +
            '<div class="hx-vitrine__info"><p class="hx-plaque__no" id="hx-vitrine-no"></p><h3 class="hx-vitrine__h" id="hx-vitrine-h"></h3><p class="hx-vitrine__k" id="hx-vitrine-k"></p><p class="hx-vitrine__d" id="hx-vitrine-d"></p>' +
              '<p class="hx-vitrine__nav"><button type="button" class="hx-ctrl__btn" data-v="-1" aria-label="' + esc(t('history.prevExhibit')) + '">' + V.icon('arrowLeft') + '</button>' +
              '<span id="hx-vitrine-n" aria-hidden="true"></span>' +
              '<button type="button" class="hx-ctrl__btn" data-v="1" aria-label="' + esc(t('history.nextExhibit')) + '">' + V.icon('arrowRight') + '</button></p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</section>'
    );
  }

  function namesSection() {
    var map = root.HISTORY_MAP || { box: { x0: -15, x1: 95, y0: 5, y1: 65 }, d: '' };
    var b = map.box;
    var names = H().names;
    var dots = names.map(function (n, i) {
      var x = Math.round((n.lon - b.x0) * 10), y = Math.round((b.y1 - n.lat) * 10);
      return '<g class="hx-mdot" data-n="' + i + '" transform="translate(' + x + ' ' + y + ')"><circle r="16"/><text y="6">' + (i + 1) + '</text></g>';
    }).join('');
    return (
      '<section class="fsec hx-names" aria-labelledby="hx-names-h"><div class="container">' +
        '<header class="hx-head" data-reveal><p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.namesEyebrow')) + '</p>' +
          '<h2 class="hx-h2" id="hx-names-h">' + esc(t('history.namesTitle')) + '</h2><p class="hx-intro-p">' + esc(t('history.namesIntro')) + '</p></header>' +
        '<div class="hx-names__grid">' +
          '<svg class="hx-mini" viewBox="0 0 ' + ((b.x1 - b.x0) * 10) + ' ' + ((b.y1 - b.y0) * 10) + '" aria-hidden="true" focusable="false"><path d="' + map.d + '"/>' + dots + '</svg>' +
          '<ol class="hx-names__list" role="list">' + names.map(function (n, i) {
            return '<li class="hx-name" data-n="' + i + '" data-reveal style="--i:' + (i % 4) + '"><span class="hx-name__n" aria-hidden="true">' + (i + 1) + '</span>' +
              '<p class="hx-name__w">' + esc(n.w) + '</p><p class="hx-name__where">' + esc(L(n.where)) + '</p><p class="hx-name__t">' + esc(L(n.t)) + sup(n.src) + '</p></li>';
          }).join('') + '</ol>' +
        '</div>' +
      '</div></section>'
    );
  }

  // male slike za korake "Evolucije dijelova" (viewBox 120x120)
  var STEP_ART = {
    coconut: '<ellipse class="hx-a-wood" cx="60" cy="70" rx="40" ry="34"/><path class="hx-a-line" d="M26 62Q60 46 94 62M24 78Q60 66 96 78"/><g class="hx-a-dot"><circle cx="50" cy="50" r="3"/><circle cx="62" cy="46" r="3"/><circle cx="58" cy="57" r="3"/></g>',
    bidri: '<circle class="hx-a-dark" cx="60" cy="66" r="40"/><path class="hx-a-inlay" d="M26 56Q60 40 94 56M24 76Q60 94 96 76"/><g class="hx-a-inlayf"><circle cx="44" cy="66" r="5"/><circle cx="60" cy="62" r="6"/><circle cx="76" cy="66" r="5"/></g>',
    glass: '<path class="hx-a-glass" d="M44 14H76V30C98 40 104 66 98 86C92 104 78 110 60 110C42 110 28 104 22 86C16 66 22 40 44 30Z"/><path class="hx-a-water" d="M20 76H100C98 96 86 108 60 108C34 108 22 96 20 76Z"/>',
    ajami: '<path class="hx-a-clay" d="M18 66H102L90 104H30Z"/><path class="hx-a-leaf" d="M24 66Q60 50 96 66Z"/><g class="hx-a-coal"><rect x="34" y="40" width="22" height="18" rx="4"/><rect x="62" y="38" width="24" height="20" rx="4"/></g>',
    muassel: '<path class="hx-a-clay" d="M18 66H102L90 104H30Z"/><path class="hx-a-juice" d="M22 66Q40 56 60 62Q80 56 98 66Z"/><g class="hx-a-fruit"><circle cx="44" cy="40" r="10"/><circle cx="72" cy="36" r="12"/></g>',
    hmd: '<path class="hx-a-clay" d="M22 74H98L88 106H32Z"/><path class="hx-a-steel" d="M16 50H104L96 74H24Z"/><rect class="hx-a-steel" x="50" y="34" width="20" height="16" rx="5"/><path class="hx-a-ember" d="M30 75H90"/>',
    leaf: '<path class="hx-a-leaf" d="M20 96C20 50 50 20 100 20C100 70 70 100 20 96Z"/><path class="hx-a-line" d="M20 96L84 34"/>',
    tombak: '<path class="hx-a-water" d="M14 78Q60 64 106 78V100Q60 112 14 100Z"/><path class="hx-a-leaf" d="M26 82C30 52 52 34 92 34C88 64 66 82 26 82Z"/>',
    flavor: '<path class="hx-a-juice" d="M24 98Q60 82 96 98V104Q60 114 24 104Z"/><g class="hx-a-fruit"><circle cx="40" cy="62" r="16"/><circle cx="72" cy="54" r="20"/><circle cx="58" cy="82" r="10"/></g>'
  };

  function partsSection() {
    return (
      '<section class="fsec fsec--alt hx-parts" aria-labelledby="hx-parts-h"><div class="container">' +
        '<header class="hx-head" data-reveal><p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.partsEyebrow')) + '</p>' +
          '<h2 class="hx-h2" id="hx-parts-h">' + esc(t('history.partsTitle')) + '</h2><p class="hx-intro-p">' + esc(t('history.partsIntro')) + '</p></header>' +
        '<div class="hx-parts__grid">' + H().parts.map(function (p) {
          var name = 'hx-p-' + p.id;
          return (
            '<fieldset class="hx-evo" data-reveal>' +
              '<legend class="hx-evo__title">' + esc(L(p.title)) + '</legend>' +
              '<div class="hx-evo__stage">' + p.steps.map(function (s, k) {
                var k2 = s.k === 'muassel' && p.id === 'duhan' ? 'flavor' : s.k;
                return (
                  '<input class="hx-evo__radio" type="radio" name="' + name + '" id="' + name + '-' + k + '" value="' + k + '"' + (k === 0 ? ' checked' : '') + '>' +
                  '<div class="hx-evo__panel">' +
                    '<svg class="hx-evo__art" viewBox="0 0 120 120" aria-hidden="true" focusable="false">' + (STEP_ART[k2] || '') + '</svg>' +
                    '<p class="hx-evo__text">' + esc(L(s.t)) + sup(s.src) + '</p>' +
                  '</div>'
                );
              }).join('') +
              '<div class="hx-evo__steps">' + p.steps.map(function (s, k) {
                return '<label for="' + name + '-' + k + '"><span class="hx-evo__n" aria-hidden="true">' + (k + 1) + '</span>' + esc(L(s.label)) + '</label>';
              }).join('') + '</div></div>' +
            '</fieldset>'
          );
        }).join('') + '</div>' +
      '</div></section>'
    );
  }

  function mythsSection() {
    return (
      '<section class="fsec hx-myths" aria-labelledby="hx-myths-h"><div class="container">' +
        '<header class="hx-head" data-reveal><p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.mythsEyebrow')) + '</p>' +
          '<h2 class="hx-h2" id="hx-myths-h">' + esc(t('history.mythsTitle')) + '</h2><p class="hx-intro-p">' + esc(t('history.mythsIntro')) + '</p></header>' +
        '<ul class="hx-myths__grid" role="list">' + H().myths.map(function (m, i) {
          return (
            '<li class="hx-myth hx-myth--' + m.v + '" data-reveal style="--i:' + (i % 4) + '">' +
              '<div class="hx-myth__inner">' +
                '<div class="hx-myth__front"><span class="hx-myth__q" aria-hidden="true">?</span><p class="hx-myth__claim">' + esc(L(m.q)) + '</p>' +
                  '<button type="button" class="hx-myth__flip" aria-pressed="false">' + esc(t('history.flip')) + '</button></div>' +
                '<div class="hx-myth__back"><p class="hx-myth__verdict">' + esc(t('history.verdict.' + m.v)) + '</p><p class="hx-myth__a">' + esc(L(m.a)) + sup(m.src) + '</p></div>' +
              '</div>' +
            '</li>'
          );
        }).join('') + '</ul>' +
      '</div></section>'
    );
  }

  function healthSection() {
    var items = H().health || [];
    return (
      '<section class="fsec hx-health" aria-labelledby="hx-health-h"><div class="container">' +
        '<div class="hx-health__card" data-reveal>' +
          '<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.healthEyebrow')) + '</p>' +
          '<h2 class="hx-h2" id="hx-health-h">' + esc(t('history.healthTitle')) + '</h2>' +
          '<ul class="hx-health__list" role="list">' + items.map(function (h) { return '<li>' + esc(L(h.t)) + sup(h.src) + '</li>'; }).join('') + '</ul>' +
        '</div>' +
      '</div></section>'
    );
  }

  function sourcesSection() {
    var S = H().sources;
    return (
      '<section class="fsec fsec--alt hx-sources" aria-labelledby="hx-sources-h"><div class="container">' +
        '<header class="hx-head" data-reveal><p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.sourcesEyebrow')) + '</p>' +
          '<h2 class="hx-h2" id="hx-sources-h">' + esc(t('history.sourcesTitle')) + '</h2><p class="hx-intro-p">' + esc(t('history.sourcesIntro')) + '</p></header>' +
        '<ol class="hx-sources__list" role="list">' + S.map(function (s, n) {
          if (!s) return '';
          return '<li id="izvor-' + n + '"><span class="hx-sources__n">' + n + '</span><a href="' + esc(s.u) + '" target="_blank" rel="noopener">' + esc(s.t) + '</a></li>';
        }).join('') + '</ol>' +
        '<nav class="pager" id="hx-src-pager" aria-label="' + esc(t('pager.label')) + '" hidden></nav>' +
      '</div></section>'
    );
  }

  function ctaSection() {
    return (
      '<section class="fsec" aria-labelledby="hx-cta-h"><div class="container">' +
        '<div class="tipcta hx-cta" data-reveal>' +
          '<h2 class="tipcta__title" id="hx-cta-h">' + esc(t('history.ctaTitle')) + '</h2>' +
          '<p class="tipcta__text">' + esc(t('history.ctaText')) + '</p>' +
          '<p class="tipcta__actions"><a class="btn btn--primary" href="' + V.url('quiz') + '">' + esc(t('history.ctaQuiz')) + V.icon('arrowRight') + '</a>' +
            '<a class="btn btn--ghost" href="' + V.url('flavors') + '">' + esc(t('history.ctaFlavors')) + '</a></p>' +
        '</div>' +
      '</div></section>'
    );
  }

  /* ---------- Poglavlja: cijela priča za čitanje (posebne stranice) ---------- */

  function CH() { return root.HISTORY_CHAPTERS || []; }
  V.historyChapters = CH;
  V.chapterUrl = function (ch, lang) { return V.urlFor(lang || MSP.lang, 'chapter', ch.slug[lang || MSP.lang]); };
  V.chapterById = function (id) { return CH().filter(function (c) { return c.id === id; })[0] || null; };

  /** Izvor poglavlja: { g: n } je izvor iz data/history.js, inače { t, u }. */
  V.chapterSource = function (s) { return s && s.g ? H().sources[s.g] : s; };

  function chapterText(ch, lang) {
    return ch.sections.map(function (s) {
      return MSP.L(s.h, lang) + ' ' + s.p.map(function (p) { return MSP.L(p.t, lang); }).join(' ') + (s.note ? ' ' + MSP.L(s.note, lang) : '');
    }).join(' ');
  }
  /** Minute čitanja (oko 200 riječi u minuti). */
  V.chapterMinutes = function (ch) { return Math.max(2, Math.ceil(chapterText(ch).split(/\s+/).length / 200)); };
  V.chapterPlain = chapterText;

  function chaptersSection() {
    var list = CH();
    if (!list.length) return '';
    return (
      '<section class="fsec hx-chapters" aria-labelledby="hx-chapters-h"><div class="container">' +
        '<header class="hx-head" data-reveal><p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.chaptersEyebrow')) + '</p>' +
          '<h2 class="hx-h2" id="hx-chapters-h">' + esc(t('history.chaptersTitle', { n: list.length })) + '</h2>' +
          '<p class="hx-intro-p">' + esc(t('history.chaptersIntro')) + '</p></header>' +
        '<ol class="hx-chapters__grid" role="list">' + list.map(function (ch, i) {
          return '<li class="hx-chap" data-reveal style="--i:' + (i % 4) + '"><a class="hx-chap__a" href="' + esc(V.chapterUrl(ch)) + '">' +
            '<span class="hx-chap__n" aria-hidden="true">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span>' +
            art(ch.art, 'hx-chap__art') +
            '<span class="hx-chap__span">' + esc(L(ch.span)) + '</span>' +
            '<span class="hx-chap__t">' + esc(L(ch.title)) + '</span>' +
            '<span class="hx-chap__lead">' + esc(L(ch.lead)) + '</span>' +
            '<span class="hx-chap__meta">' + esc(t('history.readMin', { n: V.chapterMinutes(ch) })) + ' · ' + esc(t('history.nSources', { n: ch.sources.length })) + V.icon('arrowRight') + '</span>' +
          '</a></li>';
        }).join('') + '</ol>' +
      '</div></section>'
    );
  }

  function chapterNav(list, i) {
    var prev = list[i - 1], next = list[i + 1];
    function card(ch, dir) {
      if (!ch) return '<span></span>';
      var n = list.indexOf(ch) + 1;
      return '<a class="hxc-pn hxc-pn--' + dir + '" href="' + esc(V.chapterUrl(ch)) + '" rel="' + (dir === 'prev' ? 'prev' : 'next') + '">' +
        '<span class="hxc-pn__k">' + esc(t(dir === 'prev' ? 'history.prevChapter' : 'history.nextChapter')) + ' · ' + n + '</span>' +
        '<span class="hxc-pn__t">' + esc(L(ch.title)) + '</span></a>';
    }
    return '<nav class="hxc-pnav" aria-label="' + esc(t('history.chapterNav')) + '">' + card(prev, 'prev') + card(next, 'next') + '</nav>';
  }

  /** Slika u poglavlju: stara slika ili fotografija sa potpisom i linkom na izvor. */
  function chapterFig(f) {
    return '<figure class="hxc-fig' + (f.w < f.h ? ' hxc-fig--tall' : '') + '"><img src="/history/slike/' + f.img + '.webp" width="' + f.w + '" height="' + f.h + '" alt="' + esc(L(f.alt || f.cap)) + '" loading="lazy" decoding="async">' +
      '<figcaption>' + esc(L(f.cap)) + ' <span class="hxc-fig__by">' + (f.u ? '<a href="' + esc(f.u) + '" target="_blank" rel="noopener">' + esc(L(f.by)) + '</a>' : esc(L(f.by))) + '</span></figcaption></figure>';
  }

  V.pageChapter = function (ch, crumbs) {
    var list = CH();
    var i = list.indexOf(ch);
    var stations = H().stations;
    var histUrl = V.url('history');
    var sec = ch.sections;
    var stLinks = (ch.stations || []).map(function (id) { return stations.filter(function (s) { return s.id === id; })[0]; }).filter(Boolean);
    return (
      artDefs() +
      '<div class="hx hxc">' +
        '<header class="hxc-hero">' + (crumbs || '') +
          '<div class="container hxc-hero__grid">' +
            '<div class="hxc-hero__copy">' +
              '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.chapterOf', { n: i + 1, total: list.length })) + ' · ' + esc(L(ch.span)) + '</p>' +
              '<h1 class="hxc-title anim-in" style="--i:1">' + esc(L(ch.title)) + '</h1>' +
              '<p class="hxc-lead anim-in" style="--i:2">' + esc(L(ch.lead)) + '</p>' +
              '<p class="hxc-meta anim-in" style="--i:3"><span>' + esc(t('history.readMin', { n: V.chapterMinutes(ch) })) + '</span><span>' + esc(t('history.nSources', { n: ch.sources.length })) + '</span></p>' +
            '</div>' +
            '<div class="hxc-hero__art anim-in" style="--i:2">' + art(ch.art) + '<p class="hxc-hero__num" aria-hidden="true">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</p></div>' +
          '</div>' +
          (ch.years && ch.years.length ? '<div class="container"><ol class="hxc-years" role="list" aria-label="' + esc(t('history.keyYears')) + '">' + ch.years.map(function (y) {
            return '<li><b>' + esc(MSP.lang === 'en' && y.yEn ? y.yEn : y.y) + '</b><span>' + esc(L(y.t)) + sup(y.src) + '</span></li>';
          }).join('') + '</ol></div>' : '') +
        '</header>' +
        '<div class="container hxc-layout">' +
          '<aside class="hxc-side">' +
            '<nav class="hxc-toc" aria-labelledby="hxc-toc-h"><p class="hxc-side__h" id="hxc-toc-h">' + esc(t('history.inChapter')) + '</p><ol role="list">' +
              sec.map(function (s, k) { return '<li><a href="#dio-' + (k + 1) + '">' + esc(L(s.h)) + '</a></li>'; }).join('') +
              '<li><a href="#izvori">' + esc(t('history.sourcesTitle')) + '</a></li>' +
            '</ol></nav>' +
            '<nav class="hxc-all" aria-labelledby="hxc-all-h"><p class="hxc-side__h" id="hxc-all-h">' + esc(t('history.allChapters')) + '</p><ol role="list">' +
              list.map(function (c, k) {
                return '<li><a href="' + esc(V.chapterUrl(c)) + '"' + (c === ch ? ' aria-current="page"' : '') + '><span>' + (k + 1) + '</span>' + esc(L(c.title)) + '</a></li>';
              }).join('') +
            '</ol></nav>' +
          '</aside>' +
          '<article class="hxc-body">' +
            sec.map(function (s, k) {
              var more = s.more && V.chapterById(s.more);
              return '<section class="hxc-sec" id="dio-' + (k + 1) + '" aria-labelledby="dio-' + (k + 1) + '-h" data-reveal>' +
                '<h2 class="hxc-h2" id="dio-' + (k + 1) + '-h"><span aria-hidden="true">' + (k + 1) + '</span>' + esc(L(s.h)) + '</h2>' +
                s.p.map(function (p) { return '<p>' + esc(L(p.t)) + sup(p.src) + '</p>'; }).join('') +
                (s.fig ? chapterFig(s.fig) : '') +
                (s.note ? '<aside class="hxc-note"><p class="hxc-note__k">' + esc(t('history.careful')) + '</p><p>' + esc(L(s.note)) + sup(s.noteSrc) + '</p></aside>' : '') +
                (more ? '<p class="hxc-more"><a href="' + esc(V.chapterUrl(more)) + '">' + esc(t('history.moreIn', { title: L(more.title) })) + V.icon('arrowRight') + '</a></p>' : '') +
              '</section>';
            }).join('') +
            (stLinks.length ? '<section class="hxc-onmap" aria-labelledby="hxc-onmap-h" data-reveal><h2 class="hxc-h3" id="hxc-onmap-h">' + esc(t('history.onJourney')) + '</h2><ul role="list">' +
              stLinks.map(function (s) {
                return '<li><a href="' + esc(histUrl + '#' + s.id) + '"><b>' + esc(L(s.when)) + '</b><span>' + esc(L(s.city)) + '</span><span>' + esc(L(s.title)) + '</span></a></li>';
              }).join('') + '</ul></section>' : '') +
            '<section class="hxc-sources" id="izvori" aria-labelledby="hxc-src-h"><h2 class="hxc-h3" id="hxc-src-h">' + esc(t('history.sourcesTitle')) + '</h2>' +
              '<ol role="list">' + ch.sources.map(function (s, k) {
                var src = V.chapterSource(s);
                return '<li id="izvor-' + (k + 1) + '"><span class="hx-sources__n">' + (k + 1) + '</span><a href="' + esc(src.u) + '" target="_blank" rel="noopener">' + esc(src.t) + '</a></li>';
              }).join('') + '</ol>' +
            '</section>' +
            chapterNav(list, i) +
            '<p class="hxc-back"><a class="btn btn--ghost" href="' + esc(histUrl) + '">' + esc(t('history.backToHistory')) + '</a>' +
              '<a class="btn btn--primary" href="' + esc(histUrl + '#put') + '">' + esc(t('history.start')) + V.icon('arrowRight') + '</a></p>' +
          '</article>' +
        '</div>' +
      '</div>'
    );
  };

  /* ---------- U knjigama i umjetnosti + Ljudi iz priče ---------- */

  // Gusjenica iz "Alise u zemlji čuda": vlastiti crtež (klik pušta kolutove dima)
  var CATERPILLAR =
    '<svg class="hx-cat__svg" viewBox="0 0 240 220" aria-hidden="true" focusable="false">' +
      '<path d="M104 150Q100 190 98 214H142Q140 190 136 150Z" fill="#efe2c4" stroke="#6b4a2a" stroke-width="2"/>' +
      '<path d="M22 140Q30 96 120 92Q210 96 218 140Q170 158 120 156Q70 158 22 140Z" fill="#c2412d" stroke="#6b2414" stroke-width="2"/>' +
      '<g fill="#f6ead2"><ellipse cx="62" cy="126" rx="9" ry="5"/><ellipse cx="102" cy="112" rx="11" ry="6"/><ellipse cx="150" cy="114" rx="8" ry="5"/><ellipse cx="186" cy="130" rx="9" ry="5"/></g>' +
      '<g class="hx-cat__body" fill="#4f7bd8" stroke="#2c4b95" stroke-width="2">' +
        '<circle cx="58" cy="98" r="11"/><circle cx="76" cy="92" r="12"/><circle cx="95" cy="88" r="13"/><circle cx="114" cy="86" r="13"/>' +
        '<circle cx="128" cy="72" r="13"/><circle cx="136" cy="55" r="12"/><circle cx="140" cy="38" r="11"/>' +
        '<circle class="hx-cat__head" cx="142" cy="20" r="13"/>' +
      '</g>' +
      '<g fill="#1d2c55"><circle cx="146" cy="17" r="2"/><circle cx="138" cy="17" r="2"/></g>' +
      '<path d="M132 52Q118 52 122 62M144 54Q158 56 150 64" fill="none" stroke="#2c4b95" stroke-width="3" stroke-linecap="round"/>' +
      '<path class="hx-cat__hose" d="M184 92C176 60 170 34 152 26" fill="none" stroke="#6d2a20" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M176 92H196L194 76C204 70 204 56 186 54C168 56 168 70 178 76Z" fill="#c58a3c" stroke="#5a3a17" stroke-width="1.6"/>' +
      '<rect x="183" y="38" width="6" height="16" fill="#c58a3c" stroke="#5a3a17" stroke-width="1.2"/>' +
      '<path d="M178 30H194L190 40H182Z" fill="#a54b2a" stroke="#4a1a08" stroke-width="1.2"/>' +
      '<g class="hx-cat__smoke" fill="none" stroke="#f4ebdf" stroke-linecap="round" opacity=".55"><path d="M186 26C180 16 192 10 186 0"/><path d="M152 12C148 4 156 -2 152 -10"/></g>' +
    '</svg>';

  function artSection() {
    var D = H(), A = D.art || [], P = D.people || [], S = D.sources;
    var alice = A[0];
    var stIdx = {};
    D.stations.forEach(function (s, i) { stIdx[s.id] = i; });
    var cards = A.slice(1).map(function (a, i) {
      var who = typeof a.who === 'string' ? a.who : L(a.who);
      var link = a.link ? S[a.link] : null;
      return (
        '<li class="hx-work' + (a.img ? ' hx-work--img' : '') + '" data-reveal style="--i:' + (i % 3) + '">' +
          (a.img ? '<img class="hx-work__img" src="/history/slike/' + a.img.f + '.webp" width="' + a.img.w + '" height="' + a.img.h + '" alt="' + esc(L(a.title) + ', ' + who) + '" loading="lazy" decoding="async">' : '') +
          '<p class="hx-work__meta"><span>' + esc(L(a.kind)) + '</span>' + (a.noYear ? '' : '<time datetime="' + a.year + '">' + (a.id === 'plemic' ? (MSP.lang === 'bs' ? 'oko ' : 'c. ') : '') + a.year + '</time>') + '</p>' +
          '<h3 class="hx-work__t">' + esc(L(a.title)) + '</h3>' +
          '<p class="hx-work__who">' + esc(who) + '</p>' +
          '<p class="hx-work__d">' + esc(L(a.t)) + sup(a.src) + '</p>' +
          (link ? '<a class="hx-work__link" href="' + esc(link.u) + '" target="_blank" rel="noopener">' + esc(t('history.seeWork')) + V.icon('arrowUpRight') + '</a>' : '') +
          (a.station ? '<a class="hx-work__link" href="#' + a.station + '" data-station="' + stIdx[a.station] + '">' + esc(t('history.toStation')) + V.icon('arrowRight') + '</a>' : '') +
        '</li>'
      );
    }).join('');
    var people = P.map(function (p, i) {
      var nm = MSP.lang === 'en' && p.en ? p.en : p.name;
      return (
        '<li class="hx-person" data-reveal style="--i:' + (i % 3) + '">' +
          '<span class="hx-person__ini" aria-hidden="true">' + esc(nm.replace(/^(Šah|Shah|Mirza) /, '').charAt(0)) + '</span>' +
          '<p class="hx-person__n">' + esc(nm) + '</p><p class="hx-person__r">' + esc(L(p.role)) + '</p>' +
          '<p class="hx-person__t">' + esc(L(p.t)) + sup(p.src) + '</p>' +
          '<a class="hx-person__go" href="#' + p.station + '" data-station="' + stIdx[p.station] + '">' + esc(t('history.toStation')) + V.icon('arrowRight') + '</a>' +
        '</li>'
      );
    }).join('');
    return (
      '<section class="fsec hx-art-sec" aria-labelledby="hx-art-h"><div class="container">' +
        '<header class="hx-head" data-reveal><p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.artEyebrow')) + '</p>' +
          '<h2 class="hx-h2" id="hx-art-h">' + esc(t('history.artTitle')) + '</h2><p class="hx-intro-p">' + esc(t('history.artIntro')) + '</p></header>' +
        '<div class="hx-art-grid">' +
          (alice ? '<article class="hx-alice" data-reveal>' +
            '<div class="hx-alice__stage">' +
              (alice.img ? '<figure class="hx-alice__fig"><img src="/history/slike/' + alice.img.f + '.webp" width="' + alice.img.w + '" height="' + alice.img.h + '" alt="' + esc(L(alice.img.cap)) + '" loading="lazy" decoding="async">' +
                '<figcaption><a href="' + esc(alice.img.u) + '" target="_blank" rel="noopener">' + esc(L(alice.img.cap)) + '</a></figcaption></figure>' : '') +
              '<button type="button" class="hx-cat" aria-label="' + esc(t('history.catHint')) + '">' + CATERPILLAR + '<span class="hx-cat__say" aria-hidden="true">' + esc(t('history.catSay')) + '</span></button>' +
            '</div>' +
            '<div class="hx-alice__txt">' +
              '<p class="hx-work__meta"><span>' + esc(L(alice.kind)) + '</span><time datetime="' + alice.year + '">' + alice.year + '</time></p>' +
              '<h3 class="hx-alice__t">' + esc(L(alice.title)) + '</h3><p class="hx-work__who">' + esc(alice.who) + '</p>' +
              '<p class="hx-work__d">' + esc(L(alice.t)) + sup(alice.src) + '</p>' +
              '<p class="hx-alice__hint">' + esc(t('history.catHint')) + '</p></div>' +
          '</article>' : '') +
          '<ul class="hx-works" role="list">' + cards + '</ul>' +
        '</div>' +
        '<h3 class="hx-people-h" data-reveal>' + esc(t('history.peopleTitle')) + '</h3>' +
        '<ul class="hx-persons" role="list">' + people + '</ul>' +
      '</div></section>'
    );
  }

  /* ---------- Igraj: kviz i "Koja si ti era?" ---------- */

  function playSection() {
    var D = H(), Q = D.quiz || [], E = D.eras || { questions: [], results: {} };
    var letters = ['A', 'B', 'C', 'D'];
    var statik = Q.map(function (q, i) {
      return '<li><p class="hx-q__q">' + (i + 1) + '. ' + esc(L(q.q)) + '</p><ol class="hx-q__opts" role="list">' +
        q.o.map(function (o, k) { return '<li>' + letters[k] + ') ' + esc(L(o)) + '</li>'; }).join('') + '</ol>' +
        '<details class="hx-q__ans"><summary>' + esc(t('history.answer')) + '</summary><p>' + letters[q.a] + ') ' + esc(L(q.o[q.a])) + sup(q.src) + '</p></details></li>';
    }).join('');
    return (
      '<section class="fsec fsec--alt hx-play" aria-labelledby="hx-play-h"><div class="container">' +
        '<header class="hx-head" data-reveal><p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.playEyebrow')) + '</p>' +
          '<h2 class="hx-h2" id="hx-play-h">' + esc(t('history.playTitle')) + '</h2></header>' +
        '<div class="hx-play__grid">' +
          '<div class="hx-game hx-game--quiz" id="hx-quiz" data-reveal>' +
            '<p class="hx-game__k">' + esc(t('history.quizKicker', { n: Q.length })) + '</p>' +
            '<h3 class="hx-game__t">' + esc(t('history.quizTitle')) + '</h3>' +
            '<p class="hx-game__d">' + esc(t('history.quizIntro')) + '</p>' +
            '<ol class="hx-q__static" role="list">' + statik + '</ol>' +
            '<div class="hx-game__app" aria-live="polite" hidden></div>' +
          '</div>' +
          '<div class="hx-game hx-game--era" id="hx-era" data-reveal>' +
            '<p class="hx-game__k">' + esc(t('history.eraKicker', { n: E.questions.length })) + '</p>' +
            '<h3 class="hx-game__t">' + esc(t('history.eraTitle')) + '</h3>' +
            '<p class="hx-game__d">' + esc(t('history.eraIntro')) + '</p>' +
            '<p class="hx-game__nojs">' + esc(t('history.needJs')) + '</p>' +
            '<div class="hx-game__app" aria-live="polite" hidden></div>' +
          '</div>' +
        '</div>' +
      '</div></section>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Stranica                                                            */
  /* ------------------------------------------------------------------ */

  V.pageHistory = function (crumbs) {
    var D = H();
    var st = D.stations;
    var parts = D.hookahParts;
    var years = st.length ? st[st.length - 1].year - st[0].year : 0;
    return (
      artDefs() +
      '<div class="hx" id="hx">' +
        '<section class="hx-hero" aria-labelledby="hx-title">' + (crumbs || '') +
          '<div class="container hx-hero__grid">' +
            '<div class="hx-hero__copy">' +
              '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.eyebrow')) + '</p>' +
              '<h1 class="hx-title anim-in" style="--i:1" id="hx-title" tabindex="-1">' + esc(t('history.title')) + '</h1>' +
              '<p class="hx-lead anim-in" style="--i:2">' + esc(t('history.lead')) + '</p>' +
              '<p class="hx-hero__btns anim-in" style="--i:3"><a class="btn btn--primary" href="#put" data-start>' + esc(t('history.start')) + V.icon('arrowRight') + '</a>' +
                '<button type="button" class="btn btn--ghost hx-explode-btn" aria-pressed="false" hidden><span class="hx-explode-btn__a">' + esc(t('history.explode')) + '</span><span class="hx-explode-btn__b">' + esc(t('history.assemble')) + '</span></button></p>' +
            '</div>' +
            '<div class="hx-hero__stage" id="hx-stage">' + morph() +
              '<div class="hx-anatomy">' + heroHookah() + '<p class="hx-hint" aria-hidden="true">' + esc(t('history.partsHint')) + '</p></div>' +
            '</div>' +
          '</div>' +
          '<div class="container hx-partlist"><h2 class="hx-h3">' + esc(t('history.partsListTitle')) + '</h2>' +
            '<dl>' + parts.map(function (p) { return '<div><dt>' + esc(L(p.name)) + '</dt><dd>' + esc(L(p.t)) + '</dd></div>'; }).join('') + '</dl>' +
          '</div>' +
        '</section>' +
        '<section class="hx-journey" id="put" aria-labelledby="hx-journey-h">' +
          '<div class="hx-player" id="hx-player">' +
            '<div class="hx-bg" aria-hidden="true"></div>' +
            '<canvas class="hx-globe" id="hx-globe" aria-hidden="true"></canvas>' +
            '<canvas class="hx-fx" id="hx-fx" aria-hidden="true"></canvas>' +
            '<svg class="hx-rose" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width=".8"/><circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" stroke-width=".5" stroke-dasharray="1.5 2"/>' +
              '<path d="M50 4L56 44L96 50L56 56L50 96L44 56L4 50L44 44Z" fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width=".8"/><path d="M50 4L56 44L50 50ZM96 50L56 56L50 50ZM50 96L44 56L50 50ZM4 50L44 44L50 50Z" fill="currentColor" fill-opacity=".7"/><text x="50" y="2.5" font-size="7" text-anchor="middle" fill="currentColor">N</text></svg>' +
            '<span class="hx-pulse" aria-hidden="true"></span>' +
            '<div class="hx-sky" id="hx-sky" aria-hidden="true"></div>' +
            hud(st) +
            '<div class="hx-start" id="hx-start"><div class="hx-start__card">' +
              '<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.journeyEyebrow')) + '</p>' +
              '<h2 class="hx-h2" id="hx-journey-h">' + esc(t('history.journeyTitle')) + '</h2>' +
              '<p>' + esc(t('history.journeyIntro')) + '</p>' +
              '<p class="hx-start__btns"><button type="button" class="btn btn--primary" data-go="0">' + esc(t('history.start')) + V.icon('arrowRight') + '</button>' +
                '<button type="button" class="btn btn--ghost" data-autoplay>' + esc(t('history.playAll')) + '</button></p>' +
              '<p class="hx-start__hint">' + esc(t('history.keysHint')) + '</p>' +
            '</div></div>' +
            '<canvas class="hx-static" id="hx-static" aria-hidden="true" hidden></canvas>' +
            '<ol class="hx-stations" id="hx-stations" role="list">' + st.map(function (s, i) { return stationCard(s, i, st.length); }).join('') + '</ol>' +
            '<div class="hx-finale" id="hx-finale"><div class="hx-finale__card">' +
              '<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(t('history.finaleEyebrow')) + '</p>' +
              '<h2 class="hx-h2">' + esc(t('history.finaleTitle')) + '</h2>' +
              '<p class="hx-finale__km"><b>' + esc(V.formatNum(trailKm(st)).replace(/\B(?=(\d{3})+(?!\d))/g, MSP.lang === 'bs' ? '.' : ',')) + ' km</b><span>' + esc(t('history.kmText', { years: years, n: st.length })) + '</span></p>' +
              '<p>' + esc(t('history.finaleText')) + '</p>' +
              '<p class="hx-finale__btns"><button type="button" class="btn btn--ghost" data-go="0">' + esc(t('history.again')) + '</button>' +
                '<a class="btn btn--primary" href="#hx-museum-h" data-next-sec>' + esc(t('history.onward')) + V.icon('arrowRight') + '</a></p>' +
            '</div></div>' +
            controls(st.length) +
            '<p class="sr-only" id="hx-live" aria-live="polite"></p>' +
          '</div>' +
        '</section>' +
        chaptersSection() +
        museumSection() +
        artSection() +
        playSection() +
        namesSection() +
        partsSection() +
        mythsSection() +
        healthSection() +
        sourcesSection() +
        ctaSection() +
      '</div>'
    );
  };
})(typeof window !== 'undefined' ? window : globalThis);
