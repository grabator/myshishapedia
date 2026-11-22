/*
 * MyShishapedia - članci (lista i pojedinačni članak).
 *
 * Podaci su u data/articles.js. Stranice se prave u buildu (statični HTML);
 * u browseru ih ne treba ponovo crtati, pa ovaj fajl ne ide na stranicu.
 *
 * Ovisi o: views.js (V), views-more.js (V.collections, V.collectionMembers), strings.js (t, L).
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  var esc = V.esc;
  var icon = V.icon;

  function t(k, v) { return MSP.t(k, v); }
  function L(v, lang) { return MSP.L(v, lang); }

  V.articles = function () { return root.ARTICLES || []; };
  V.articleUrl = function (a, lang) { return V.urlFor(lang || MSP.lang, 'article', V.slugOf(a, lang)); };

  /* ---------- dijelovi sastavljeni iz podataka sajta ---------- */

  function beginnerPicks() {
    var col = V.collections().filter(function (c) { return c.id === 'beginners'; })[0];
    var list = col ? V.collectionMembers(col) : [];
    list = list.slice().sort(function (a, b) { return (a.profile.strength - b.profile.strength) || (a.brand + a.name).localeCompare(b.brand + b.name); }).slice(0, 9);
    if (!list.length) return '';
    return '<ul class="grid art-grid" role="list">' + list.map(function (f, i) {
      return '<li class="grid__item" style="--i:' + (i % 3) + '">' + V.card(f, 'h3') + '</li>';
    }).join('') + '</ul>' +
      (col ? '<p class="art-more"><a class="btn btn--ghost" href="' + V.url('collection', V.slugOf(col)) + '">' + esc(t('articles.allInCollection', { name: L(col.title) })) + icon('arrowRight') + '</a></p>' : '');
  }

  function brandStats(slug) {
    var b = V.brands().filter(function (x) { return x.slug === slug; })[0];
    if (!b) return null;
    var fl = V.brandFlavors(b);
    var avg = function (k) { return fl.length ? Math.round(fl.reduce(function (s, f) { return s + (f.profile[k] || 0); }, 0) / fl.length * 10) / 10 : 0; };
    return { brand: b, flavors: fl, sweetness: avg('sweetness'), cooling: avg('cooling'), fruitiness: avg('fruitiness'), strength: avg('strength') };
  }

  function num(n) { return MSP.decComma() ? String(n).replace('.', ',') : String(n); }

  function brandCompare(opts) {
    var A = brandStats((opts && opts.a) || 'adalya');
    var B = brandStats((opts && opts.b) || 'al-fakher');
    if (!A || !B) return '';
    var rows = [
      ['country', function (s) { return esc(L(s.brand.country)); }],
      ['leaf', function (s) { return esc(t('leaf.' + s.brand.leaf)); }],
      ['count', function (s) { return esc(String(s.flavors.length)); }],
      ['sweetness', function (s) { return esc(num(s.sweetness)) + '/10'; }],
      ['fruitiness', function (s) { return esc(num(s.fruitiness)) + '/10'; }],
      ['cooling', function (s) { return esc(num(s.cooling)) + '/10'; }],
      ['strength', function (s) { return esc(num(s.strength)) + '/10'; }]
    ];
    var known = function (s) {
      return s.flavors.slice(0, 5).map(function (f) { return '<a href="' + V.flavorUrl(f) + '">' + esc(f.name) + '</a>'; }).join(', ');
    };
    return '<div class="art-table-wrap"><table class="art-table">' +
      '<thead><tr><th scope="col"><span class="sr-only">' + esc(t('articles.property')) + '</span></th>' +
        '<th scope="col"><a href="' + V.brandUrl(A.brand) + '">' + esc(A.brand.name) + '</a></th>' +
        '<th scope="col"><a href="' + V.brandUrl(B.brand) + '">' + esc(B.brand.name) + '</a></th></tr></thead>' +
      '<tbody>' + rows.map(function (r) {
        return '<tr><th scope="row">' + esc(t('articles.row.' + r[0])) + '</th><td>' + r[1](A) + '</td><td>' + r[1](B) + '</td></tr>';
      }).join('') +
        '<tr><th scope="row">' + esc(t('articles.row.flavors')) + '</th><td>' + known(A) + '</td><td>' + known(B) + '</td></tr>' +
      '</tbody></table></div>';
  }

  /** Najledeniji okusi (po procjeni hlađenja), po 2 od svakog brenda da lista ne bude samo jedan brend. */
  function icyPicks() {
    var perBrand = {};
    var list = V.flavors().filter(function (f) { return (f.profile.cooling || 0) >= 8; })
      .sort(function (a, b) { return (b.profile.cooling - a.profile.cooling) || (b.profile.freshness - a.profile.freshness) || (a.brand + a.name).localeCompare(b.brand + b.name); })
      .filter(function (f) { perBrand[f.brand] = (perBrand[f.brand] || 0) + 1; return perBrand[f.brand] <= 2; })
      .slice(0, 9);
    return cardGrid(list);
  }

  /** Po jedan do dva okusa iz svake grupe sa liste okusa (V.FLAVOR_GROUPS). */
  function groupPicks() {
    var groups = V.FLAVOR_GROUPS || [];
    var used = {};
    return groups.map(function (g) {
      var list = V.flavors().filter(function (f) { return !used[f.id] && (f.tags || []).some(function (x) { return g.tags.indexOf(x) !== -1; }); })
        .sort(function (a, b) { return (b.profile[g.sort] || 0) - (a.profile[g.sort] || 0) || (a.brand + a.name).localeCompare(b.brand + b.name); })
        .slice(0, 3);
      list.forEach(function (f) { used[f.id] = 1; });
      if (!list.length) return '';
      return '<div class="art-group"><h3 class="art-group__h">' + esc(L(g.title)) + '</h3>' + cardGrid(list) + '</div>';
    }).join('');
  }

  function cardGrid(list) {
    if (!list.length) return '';
    return '<ul class="grid art-grid" role="list">' + list.map(function (f, i) {
      return '<li class="grid__item" style="--i:' + (i % 3) + '">' + V.card(f, 'h3') + '</li>';
    }).join('') + '</ul>';
  }

  /** Ručno izabrani okusi: { type: 'picks', ids: [...] } (build javi grešku za nepostojeći id). */
  function picks(opts) {
    return cardGrid(((opts && opts.ids) || []).map(V.flavorById).filter(Boolean));
  }

  /* ---------- stemless nargila (PurjFam POD): Studio izgled, presjek, veličina, podaci ---------- */
  // Presjek je pojednostavljen bočni prikaz prema opisu i fotografijama PurjFama (nije tehnički nacrt).
  // Čestice dima idu SVG animacijom (animateMotion), pa ih js/stemless.js pauzira kad presjek nije na ekranu.
  // Stil je u css/stemless.css (učitava se samo uz ovaj članak).

  var POD = {
    hot: 'M135 96V150',
    chA: 'M135 150C96 190 88 262 106 316L246 326',
    chB: 'M135 150C176 190 190 256 186 312L246 326',
    air: 'M372 262C412 246 440 214 470 206C486 202 494 212 500 226L540 236',
    hose: 'M572 237C604 237 622 262 626 330',
    back: 'M626 330C622 262 604 237 572 237L500 230',
    jets: ['M150 364C126 370 98 374 62 376', 'M168 364C192 370 220 374 256 376', 'M424 364C400 370 372 374 336 376', 'M442 364C466 370 494 374 530 376']
  };

  /** Čestice koje putuju po putanji (n komada, ravnomjerno raspoređene u vremenu). */
  function podDots(path, n, dur, cls, r) {
    var out = '';
    for (var i = 0; i < n; i++) {
      out += '<circle class="' + cls + '" r="' + r + '"><animateMotion dur="' + dur + 's" begin="' + (-dur * i / n).toFixed(2) + 's" repeatCount="indefinite" path="' + path + '"/>' +
        '<animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.85;1" dur="' + dur + 's" begin="' + (-dur * i / n).toFixed(2) + 's" repeatCount="indefinite"/></circle>';
    }
    return out;
  }

  function podMarker(n, x, y, mode) {
    return '<g class="pl-mk pl-mk--' + mode + '" style="--n:' + n + '"><circle cx="' + x + '" cy="' + y + '" r="11"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle">' + (n + 1) + '</text></g>';
  }

  function podBody() {
    // tijelo: aluminij (lijevo), staklo sa vodom (desno), vrat i posuda na vrhu
    return '<rect x="70" y="150" width="470" height="210" rx="42" fill="url(#pd-al)"/>' +
      '<rect x="70" y="150" width="470" height="210" rx="42" fill="url(#pd-sheen)"/>' +
      '<path d="M206 156V354" stroke="#0a0a0b" stroke-width="2" opacity=".7"/><path d="M209 156V354" stroke="#ffffff" stroke-width="1" opacity=".06"/>' +
      '<rect x="222" y="166" width="302" height="178" rx="30" fill="#0b0b0c"/>' +
      '<rect x="232" y="176" width="282" height="158" rx="22" fill="url(#pd-in)"/>';
  }

  function podSvg() {
    var bq = '', bl = '', holes = '', i;
    for (i = 0; i < 17; i++) holes += '<circle cx="' + (262 + i * 9.4).toFixed(1) + '" cy="325" r="1.4"/>';
    for (i = 0; i < 26; i++) {
      var x = 262 + ((i * 41) % 152), d = ((i * 7) % 24) / 10, s = 1.5 + ((i * 5) % 9) / 10;
      bq += '<circle class="pl-b" cx="' + x + '" cy="318" r="' + (1.4 + (i % 3) * 0.6) + '" style="--d:' + d.toFixed(1) + 's;--s:' + s.toFixed(1) + 's"/>';
    }
    [[254, 0], [424, 0.6], [256, 1.2], [422, 1.7], [258, 2.2], [426, 2.6]].forEach(function (b, k) {
      bl += '<circle class="pl-b pl-b--big" cx="' + b[0] + '" cy="316" r="' + (7 + (k % 2) * 3) + '" style="--d:' + b[1] + 's;--s:2s"/>';
    });
    return '<svg class="pl-svg" viewBox="30 16 616 396" role="img" aria-hidden="true" focusable="false">' +
      '<defs>' +
        '<linearGradient id="pd-al" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#3a3a3e"/><stop offset=".18" stop-color="#26262a"/><stop offset="1" stop-color="#121214"/></linearGradient>' +
        '<linearGradient id="pd-sheen" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#fff" stop-opacity=".07"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity=".05"/></linearGradient>' +
        '<linearGradient id="pd-in" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#55555b"/><stop offset=".45" stop-color="#2e2e33"/><stop offset="1" stop-color="#1b1b1e"/></linearGradient>' +
        '<linearGradient id="pd-water" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#bfe9f7" stop-opacity=".42"/><stop offset="1" stop-color="#3f9ec4" stop-opacity=".5"/></linearGradient>' +
        '<linearGradient id="pd-steel" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e9e9ec"/><stop offset="1" stop-color="#8e8e93"/></linearGradient>' +
        '<linearGradient id="pd-neck" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#1a1a1c"/><stop offset=".4" stop-color="#3c3c40"/><stop offset="1" stop-color="#151517"/></linearGradient>' +
        '<linearGradient id="pd-clay" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#7b5843"/><stop offset=".45" stop-color="#a8806a"/><stop offset="1" stop-color="#6a4a37"/></linearGradient>' +
        '<linearGradient id="pd-glass" x1="0" y1="0" x2="1" y2="1"><stop offset=".1" stop-color="#fff" stop-opacity="0"/><stop offset=".22" stop-color="#fff" stop-opacity=".09"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        '<linearGradient id="pd-refl" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".1"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
        '<radialGradient id="pd-coal"><stop stop-color="#fff3d1"/><stop offset=".35" stop-color="#ff9a3c"/><stop offset="1" stop-color="#ff4d2a" stop-opacity="0"/></radialGradient>' +
        '<filter id="pd-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
        '<filter id="pd-blur" x="-40%" y="-80%" width="180%" height="260%"><feGaussianBlur stdDeviation="7"/></filter>' +
        '<clipPath id="pd-win"><rect x="232" y="176" width="282" height="158" rx="22"/></clipPath>' +
        '<mask id="pd-fade"><rect x="0" y="360" width="660" height="70" fill="url(#pd-refl)"/></mask>' +
      '</defs>' +
      // odraz na stolu
      '<g class="pl-refl" mask="url(#pd-fade)"><g transform="translate(0 724) scale(1 -1)">' + podBody() + '</g></g>' +
      '<path class="pl-table" d="M20 362H640"/>' +
      // posuda, ugljevi i vrat
      '<ellipse class="pl-glow" cx="135" cy="40" rx="52" ry="20" fill="url(#pd-coal)"/>' +
      '<g class="pl-bowl"><rect x="98" y="34" width="74" height="12" rx="4" fill="#2a2a2c"/>' +
        '<rect class="pl-ember" x="106" y="31" width="22" height="7" rx="3"/><rect class="pl-ember" x="132" y="31" width="22" height="7" rx="3" style="animation-delay:-1.2s"/>' +
        '<path d="M96 46H174L162 92H108Z" fill="url(#pd-clay)"/><path d="M100 56H170" stroke="#5e412f" stroke-width="2" opacity=".6"/></g>' +
      '<path d="M112 92H158L162 152H108Z" fill="url(#pd-neck)"/>' +
      // tijelo
      podBody() +
      // unutra iza stakla: dim, voda, mjehurići, difuzor
      '<g clip-path="url(#pd-win)">' +
        '<g class="pl-haze" filter="url(#pd-blur)"><ellipse cx="300" cy="248" rx="48" ry="12"/><ellipse cx="388" cy="232" rx="56" ry="14"/><ellipse cx="350" cy="208" rx="40" ry="10"/></g>' +
        '<path class="pl-water" d="M232 270C262 263 292 275 330 268S400 260 440 268S494 264 514 266V340H232Z" fill="url(#pd-water)"/>' +
        '<path class="pl-water pl-surf" d="M232 270C262 263 292 275 330 268S400 260 440 268S494 264 514 266" fill="none" stroke="#e8f8ff" stroke-opacity=".55" stroke-width="1.5"/>' +
        '<g class="pl-bq">' + bq + '</g><g class="pl-bl">' + bl + '</g>' +
        '<rect x="248" y="318" width="186" height="15" rx="4" fill="url(#pd-steel)"/><g fill="#55555b">' + holes + '</g>' +
        '<text x="341" y="344" text-anchor="middle" class="pl-brand">PurjFam</text>' +
        '<path d="M478 186V238H506" fill="none" stroke="url(#pd-steel)" stroke-width="3.5" stroke-linecap="round"/>' +
        '<rect x="232" y="176" width="282" height="158" rx="22" fill="url(#pd-glass)"/>' +
      '</g>' +
      '<rect x="232" y="176" width="282" height="158" rx="22" fill="none" stroke="#8e8e93" stroke-opacity=".55" stroke-width="1.5"/>' +
      // kanali (rendgen kroz aluminij)
      '<path class="pl-ch" d="' + POD.chA + '"/><path class="pl-ch" d="' + POD.chB + '"/>' +
      '<path class="pl-ch pl-ch--neck" d="' + POD.hot + '"/>' +
      // priključak i crijevo
      '<rect x="540" y="227" width="34" height="20" rx="5" fill="url(#pd-steel)"/><path d="M548 227V247M556 227V247" stroke="#6e6e73" stroke-width="1.2"/>' +
      '<path class="pl-hose" d="' + POD.hose + '"/>' +
      // ventili na dnu i vrata difuzora
      '<rect class="pl-valve" x="146" y="358" width="26" height="6" rx="2"/><rect class="pl-valve" x="420" y="358" width="26" height="6" rx="2"/>' +
      '<rect class="pl-door" x="240" y="312" width="6" height="18" rx="2"/>' +
      '<g class="pl-stop"><circle cx="214" cy="296" r="13"/><path d="M207 289L221 303M221 289L207 303"/></g>' +
      // čestice: vruć dim (put), ohlađen dim, ispuhivanje
      '<g class="pl-dots pl-dots--path" filter="url(#pd-glow)">' +
        podDots(POD.hot, 3, 1.1, 'pl-d pl-d--hot', 3.4) + podDots(POD.chA, 7, 2.4, 'pl-d pl-d--hot', 3.2) + podDots(POD.chB, 7, 2.4, 'pl-d pl-d--hot', 3.2) +
        podDots(POD.air, 7, 2.6, 'pl-d pl-d--cool', 3) + podDots(POD.hose, 5, 1.6, 'pl-d pl-d--cool', 3) +
      '</g>' +
      '<g class="pl-dots pl-dots--purge" filter="url(#pd-glow)">' +
        podDots(POD.back, 7, 1.6, 'pl-d pl-d--air', 3.2) +
        POD.jets.map(function (j) { return podDots(j, 4, 0.9, 'pl-d pl-d--air', 2.6); }).join('') +
      '</g>' +
      // brojevi
      podMarker(0, 196, 40, 'path') + podMarker(1, 64, 236, 'path') + podMarker(2, 341, 372, 'path') + podMarker(3, 478, 168, 'path') + podMarker(4, 606, 214, 'path') +
      podMarker(0, 606, 214, 'purge') + podMarker(1, 296, 396, 'purge') + podMarker(2, 214, 266, 'purge') +
    '</svg>';
  }

  function podLab(o) {
    var modes = ['path', 'purge', 'bubbles'];
    var steps = function (m) {
      return '<ol class="pl-steps pl-steps--' + m + '">' + (o.steps[m] || []).map(function (s, i) {
        return '<li style="--n:' + i + '"><span class="pl-num">' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</span><span>' + esc(L(s)) + '</span></li>';
      }).join('') + '</ol>';
    };
    return '<div class="pl" data-pl data-mode="path" data-bub="quiet">' +
      '<div class="pl-tabs" role="tablist">' + modes.map(function (m, i) {
        return '<button type="button" class="pl-tab" role="tab" data-mode="' + m + '" aria-selected="' + (i === 0) + '">' + esc(L(o.tabs[m])) + '</button>';
      }).join('') + '</div>' +
      '<div class="pl-grid">' +
        '<div class="pl-stage">' + podSvg() +
          '<div class="pl-bubsw" role="group"><button type="button" data-bub="quiet" aria-pressed="true">' + esc(L(o.quiet)) + '</button><button type="button" data-bub="loud" aria-pressed="false">' + esc(L(o.loud)) + '</button></div>' +
        '</div>' +
        '<div class="pl-side">' + modes.map(steps).join('') + '</div>' +
      '</div>' +
      '<p class="pl-note">' + esc(L(o.note)) + '</p>' +
    '</div>';
  }

  function podSize(o) {
    // 3 px po cm: klasična oko 70 cm, POD 12,7 cm (bez posude)
    var base = 236;
    var podH = esc(L(o.podH).split(' ')[0]);
    return '<figure class="ps" data-ps>' +
      '<svg class="ps-svg" viewBox="0 0 320 250" aria-hidden="true" focusable="false">' +
        '<defs><linearGradient id="ps-al" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#3a3a3e"/><stop offset="1" stop-color="#121214"/></linearGradient></defs>' +
        '<path d="M10 ' + base + 'H310" stroke="#3a3a3c" stroke-width="1.5"/>' +
        '<g class="ps-classic" fill="none" stroke="#8e8e93" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' +
          '<path d="M80 ' + (base - 70) + 'C80 ' + (base - 56) + ' 56 ' + (base - 48) + ' 56 ' + (base - 24) + 'C56 ' + (base - 8) + ' 70 ' + base + ' 90 ' + base + 'C110 ' + base + ' 124 ' + (base - 8) + ' 124 ' + (base - 24) + 'C124 ' + (base - 48) + ' 100 ' + (base - 56) + ' 100 ' + (base - 70) + 'Z"/>' +
          '<path d="M86 ' + (base - 70) + 'V' + (base - 176) + 'M94 ' + (base - 70) + 'V' + (base - 176) + '"/>' +
          '<path d="M94 ' + (base - 120) + 'H106V' + (base - 112) + 'H94"/>' +
          '<path d="M106 ' + (base - 116) + 'C130 ' + (base - 116) + ' 140 ' + (base - 90) + ' 136 ' + (base - 50) + '" stroke-opacity=".6"/>' +
          '<path d="M66 ' + (base - 164) + 'C70 ' + (base - 158) + ' 110 ' + (base - 158) + ' 114 ' + (base - 164) + '"/>' +
          '<path d="M80 ' + (base - 196) + 'H100L96 ' + (base - 178) + 'H84Z"/>' +
          '<path d="M78 ' + (base - 204) + 'H102V' + (base - 196) + 'H78Z"/>' +
        '</g>' +
        '<path class="ps-dim" d="M150 ' + base + 'V' + (base - 210) + '"/>' +
        '<text class="ps-t" x="157" y="' + (base - 196) + '">' + esc(L(o.classicH)) + '</text>' +
        '<g class="ps-pod"><rect x="206" y="' + (base - 30) + '" width="44" height="30" rx="7" fill="url(#ps-al)"/>' +
          '<rect x="222" y="' + (base - 26) + '" width="24" height="20" rx="4" fill="#2e2e33" stroke="#8e8e93" stroke-width=".8"/>' +
          '<rect x="222" y="' + (base - 14) + '" width="24" height="8" rx="2" fill="rgba(95,196,232,.45)"/>' +
          '<rect x="211" y="' + (base - 38) + '" width="10" height="9" rx="2" fill="#2a2a2c"/></g>' +
        '<path class="ps-dim ps-dim--pod" d="M262 ' + base + 'V' + (base - 38) + '"/>' +
        '<text class="ps-t ps-t--pod" x="268" y="' + (base - 22) + '">' + podH + '</text>' +
      '</svg>' +
      '<figcaption class="ps-cap"><span><b>' + esc(L(o.classic)) + '</b> ' + esc(L(o.classicH)) + '</span><span><b>' + esc(L(o.pod)) + '</b> ' + esc(L(o.podH)) + '</span><small>' + esc(L(o.note)) + '</small></figcaption>' +
    '</figure>';
  }

  var FEAT_IC = {
    clean: '<path d="M12 3.5c3.2 4.1 6 7.3 6 10.8a6 6 0 0 1-12 0c0-3.5 2.8-6.7 6-10.8z"/><path d="M9.3 14.6a2.8 2.8 0 0 0 2.7 2.6"/>',
    leaf: '<path d="M5 19c8.5 0 14-5.5 14-14C10.5 5 5 10.5 5 19z"/><path d="M5 19l7.5-7.5"/>',
    shield: '<path d="M12 3l7 3v5.5c0 4.6-3 7.9-7 9.5-4-1.6-7-4.9-7-9.5V6z"/><path d="M9 12.2l2.2 2.2L15.2 10"/>',
    dial: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
    wave: '<path d="M4 10.5v3M8 7.5v9M12 4.5v15M16 8.5v7M20 11v2"/>',
    bag: '<rect x="5" y="7.5" width="14" height="12.5" rx="4"/><path d="M9 7.5V6a3 3 0 0 1 6 0v1.5M9 13.5h6"/>'
  };

  function podFeatures(o) {
    return '<ul class="pf" role="list">' + o.items.map(function (f) {
      return '<li class="pf-i"><span class="pf-ic" aria-hidden="true"><svg viewBox="0 0 24 24">' + (FEAT_IC[f.icon] || '') + '</svg></span><div class="pf-tx"><b class="pf-t">' + esc(L(f.t)) + '</b><p class="pf-d">' + esc(L(f.d)) + '</p></div></li>';
    }).join('') + '</ul>';
  }

  function podSpecs(o) {
    return '<div class="pspec">' +
      '<div class="pspec-grid">' +
        '<dl class="pspec-t">' + o.rows.map(function (r) {
          return '<div><dt>' + esc(L(r[0])) + '</dt><dd>' + esc(L(r[1])) + '</dd></div>';
        }).join('') + '</dl>' +
        '<div class="pprice">' + o.prices.map(function (p, i) {
          return '<div class="pprice-c' + (i === 1 ? ' is-hl' : '') + '"><div><b>' + esc(L(p.n)) + '</b><small>' + esc(L(p.s)) + '</small></div><span>' + esc(L(p.p)) + '</span></div>';
        }).join('') +
          '<a class="pprice-btn" href="' + esc(o.shopUrl) + '" target="_blank" rel="noopener">' + esc(L(o.shop)) + icon('arrowRight') + '</a>' +
          '<p class="pprice-note">' + esc(L(o.credit)) + '</p>' +
        '</div>' +
      '</div>' +
      '<div class="pgal">' + o.gallery.map(function (g, i) {
        return '<figure class="pgal-f' + (i === 0 ? ' pgal-f--wide' : '') + '"><img src="/gear/purjfam/' + esc(g.img) + '.webp" alt="' + esc(L(g.cap)) + '" loading="lazy" decoding="async" width="1000" height="' + (i === 0 ? 667 : 1000) + '"><figcaption>' + esc(L(g.cap)) + '</figcaption></figure>';
      }).join('') + '</div>' +
    '</div>';
  }

  /** Vrh stranice u Studio izgledu: veliki naslov, fotografija proizvoda i traka sa brojevima. */
  function studioHero(a, crumbs) {
    var s = a.studio;
    return '<section class="sh" aria-labelledby="article-title">' + (crumbs || '') +
      '<div class="container sh-in">' +
        '<div class="sh-copy">' +
          '<p class="sh-eye">' + esc(L(s.eyebrow)) + '</p>' +
          '<h1 class="sh-title" id="article-title" tabindex="-1">' + esc(L(s.title)) + ' <span>' + esc(L(s.title2)) + '</span></h1>' +
          '<p class="sh-lead">' + esc(L(a.lead)) + '</p>' +
        '</div>' +
        '<div class="sh-media"><img src="/gear/purjfam/' + esc(s.image) + '.webp" alt="' + esc(L(s.imageAlt)) + '" width="1000" height="1000" fetchpriority="high"></div>' +
      '</div>' +
      '<div class="container"><ul class="sh-stats" role="list">' + s.stats.map(function (x) {
        return '<li><b>' + esc(L(x.v)) + '</b><span>' + esc(L(x.l)) + '</span></li>';
      }).join('') + '</ul></div>' +
    '</section>';
  }

  /* ---------- članak o čišćenju (ciscenje): crtež "šta smije u vodu", koraci, okvir THE HOOKAH ---------- */

  var TH_LOGO = '/gear/thehookah/logo.webp';

  /** Kapi vode iznad dijela (vide se kad dio smije u vodu). */
  function clDrops(x, y) {
    return '<g class="cl-drops" transform="translate(' + x + ' ' + y + ')">' +
      [0, 1, 2].map(function (i) { return '<g transform="translate(' + (i * 12 - 12) + ' ' + (i === 1 ? -6 : 0) + ')"><path class="cl-drop" style="--d:' + (i * 0.45) + 's" d="M0 -7C2.6 -3.4 4 -1.4 4 0.8A4 4 0 0 1 -4 0.8C-4 -1.4 -2.6 -3.4 0 -7Z"/></g>'; }).join('') +
    '</g>';
  }
  /** Znak "bez vode" (precrtana kap) za dijelove koji moraju ostati suhi. */
  function clNo(x, y) {
    return '<g class="cl-no" transform="translate(' + x + ' ' + y + ')"><circle r="11"/><path d="M0 -6C2.4 -2.8 3.6 -1 3.6 1A3.6 3.6 0 0 1 -3.6 1C-3.6 -1 -2.4 -2.8 0 -6Z"/><path class="cl-no__x" d="M-7 7L7 -7"/></g>';
  }
  function clPart(id, label, inner, dx, dy, nx, ny) {
    return '<g class="cl-part" data-part="' + id + '" tabindex="0" role="button" aria-label="' + esc(label) + '">' +
      '<g class="cl-part__in">' + inner + '</g>' + clDrops(dx, dy) + clNo(nx, ny) + '</g>';
  }
  function cleanSvg(parts) {
    var nm = {};
    parts.forEach(function (p) { nm[p.id] = L(p.name); });
    return '<svg class="cl-svg" viewBox="0 0 380 600" aria-hidden="false" role="group">' +
      '<defs>' +
        '<linearGradient id="cl-steel" x1="0" x2="1"><stop offset="0" stop-color="#5d5650"/><stop offset=".45" stop-color="#d9d2c8"/><stop offset=".6" stop-color="#f4efe8"/><stop offset="1" stop-color="#6b635c"/></linearGradient>' +
        '<linearGradient id="cl-clay" x1="0" x2="1"><stop offset="0" stop-color="#6e3a20"/><stop offset=".5" stop-color="#b8693a"/><stop offset="1" stop-color="#5a2e18"/></linearGradient>' +
        '<linearGradient id="cl-glass" x1="0" x2="1"><stop offset="0" stop-color="rgba(255,255,255,.16)"/><stop offset=".5" stop-color="rgba(255,255,255,.03)"/><stop offset="1" stop-color="rgba(255,255,255,.14)"/></linearGradient>' +
        '<linearGradient id="cl-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(120,200,255,.42)"/><stop offset="1" stop-color="rgba(60,130,210,.55)"/></linearGradient>' +
        '<linearGradient id="cl-wood" x1="0" x2="1"><stop offset="0" stop-color="#7a4a26"/><stop offset=".5" stop-color="#c0874f"/><stop offset="1" stop-color="#6d3f1f"/></linearGradient>' +
        '<linearGradient id="cl-hose" x1="0" x2="1"><stop offset="0" stop-color="#2c2420"/><stop offset="1" stop-color="#4a3c33"/></linearGradient>' +
      '</defs>' +
      // glava
      clPart('bowl', nm.bowl,
        '<path class="cl-shape" d="M142 40H238L222 92H158Z" fill="url(#cl-clay)"/><ellipse class="cl-shape" cx="190" cy="40" rx="48" ry="9" fill="#8b4a27"/>' +
        '<ellipse cx="190" cy="40" rx="40" ry="6" fill="#3a1d0e"/><path d="M168 38q6-3 12 0t12 0 12 0" stroke="#7a3f1c" stroke-width="2" fill="none"/>' +
        '<rect x="181" y="92" width="18" height="12" rx="3" fill="#5a2e18"/>', 190, 18, 252, 50) +
      // tacna
      clPart('tray', nm.tray,
        '<ellipse class="cl-shape" cx="190" cy="128" rx="70" ry="11" fill="url(#cl-steel)"/><ellipse cx="190" cy="125" rx="58" ry="6" fill="rgba(0,0,0,.25)"/>', 110, 118, 272, 122) +
      // stub
      clPart('stem', nm.stem,
        '<rect class="cl-shape" x="176" y="150" width="28" height="200" rx="7" fill="url(#cl-steel)"/>' +
        '<rect x="170" y="196" width="40" height="10" rx="4" fill="url(#cl-steel)"/><rect x="170" y="262" width="40" height="10" rx="4" fill="url(#cl-steel)"/>' +
        '<g class="cl-led"><rect x="183" y="212" width="3" height="44" rx="1.5"/><rect x="194" y="212" width="3" height="44" rx="1.5"/></g>' +
        '<rect class="cl-port" x="183" y="320" width="14" height="7" rx="2"/>' +
        '<path d="M204 300h22" stroke="url(#cl-steel)" stroke-width="9" stroke-linecap="round"/>', 150, 230, 230, 330) +
      // cijev u vodi i difuzor
      clPart('down', nm.down,
        '<rect class="cl-shape" x="183" y="372" width="14" height="120" rx="5" fill="url(#cl-steel)"/>' +
        '<rect class="cl-shape" x="176" y="490" width="28" height="22" rx="5" fill="url(#cl-steel)"/>' +
        '<g fill="#3a332e"><circle cx="184" cy="501" r="1.8"/><circle cx="190" cy="501" r="1.8"/><circle cx="196" cy="501" r="1.8"/><circle cx="187" cy="507" r="1.8"/><circle cx="193" cy="507" r="1.8"/></g>', 150, 430, 222, 400) +
      // vaza
      clPart('base', nm.base,
        '<path class="cl-shape cl-glassline" d="M160 400H220V430C220 446 270 470 278 518C284 552 262 578 190 578C118 578 96 552 102 518C110 470 160 446 160 430Z" fill="url(#cl-glass)"/>' +
        '<path class="cl-water" d="M106 500C130 492 150 506 190 500S250 492 274 500C282 540 266 572 190 572C114 572 98 540 106 500Z" fill="url(#cl-water)"/>' +
        '<g class="cl-bub"><circle cx="186" cy="540" r="3"/><circle cx="196" cy="548" r="2.2"/><circle cx="182" cy="552" r="1.8"/></g>' +
        '<path d="M120 520q-4 24 14 40" stroke="rgba(255,255,255,.35)" stroke-width="3" fill="none" stroke-linecap="round"/>', 70, 470, 300, 470) +
      // crijevo
      clPart('hose', nm.hose,
        '<path class="cl-hoseline" d="M228 300C286 300 300 380 290 430S300 520 330 520" fill="none" stroke-width="17" stroke-linecap="round"/>' +
        '<path class="cl-hosepath" d="M228 300C286 300 300 380 290 430S300 520 330 520" fill="none" stroke="url(#cl-hose)" stroke-width="12" stroke-linecap="round"/>' +
        '<path class="cl-leather" d="M228 300C286 300 300 380 290 430S300 520 330 520" fill="none" stroke-width="12" stroke-linecap="round" stroke-dasharray="1 7"/>', 300, 360, 336, 400) +
      // usnik
      clPart('mouth', nm.mouth,
        '<g transform="rotate(-62 340 470)"><rect class="cl-shape cl-mouthbody" x="314" y="462" width="62" height="16" rx="8"/>' +
        '<rect class="cl-mouthcore" x="300" y="467" width="80" height="6" rx="3" fill="url(#cl-steel)"/>' +
        '<rect class="cl-port cl-port--m" x="352" y="466" width="9" height="8" rx="2"/></g>', 352, 400, 368, 452) +
    '</svg>';
  }
  function cleanLab(o) {
    var parts = o.parts.map(function (p) {
      return { id: p.id, name: L(p.name), classic: { s: p.classic.s, t: L(p.classic.t) }, modular: { s: p.modular.s, t: L(p.modular.t) } };
    });
    var leg = ['water', 'care', 'dry'].map(function (s) { return '<li class="cl-leg cl-leg--' + s + '"><i aria-hidden="true"></i>' + esc(L(o.legend[s])) + '</li>'; }).join('');
    var data = { parts: parts, legend: { water: L(o.legend.water), care: L(o.legend.care), dry: L(o.legend.dry) } };
    return '<div class="cl" data-cl data-mode="classic">' +
      '<script type="application/json" class="cl-data">' + JSON.stringify(data).replace(/</g, '\\u003c') + '</script>' +
      '<div class="cl-partner"><span>' + esc(L(o.partner)) + '</span><img src="' + TH_LOGO + '" alt="THE HOOKAH" width="64" height="64" loading="lazy" decoding="async"></div>' +
      '<div class="cl-grid">' +
        '<div class="cl-stage">' + cleanSvg(o.parts) + '<p class="cl-hint" aria-hidden="true">' + esc(L(o.hint)) + '</p></div>' +
        '<div class="cl-side">' +
          '<div class="cl-tabs" role="tablist">' +
            '<button type="button" class="cl-tab is-on" role="tab" aria-selected="true" data-mode="classic">' + esc(L(o.modes.classic)) + '</button>' +
            '<button type="button" class="cl-tab" role="tab" aria-selected="false" data-mode="modular">' + esc(L(o.modes.modular)) + '</button>' +
          '</div>' +
          '<ul class="cl-legend" role="list">' + leg + '</ul>' +
          '<div class="cl-card" aria-live="polite"><p class="cl-card__pill" data-s="water"></p><h3 class="cl-card__name"></h3><p class="cl-card__text"></p></div>' +
          '<ul class="cl-list" role="list">' + parts.map(function (p) {
            return '<li><button type="button" class="cl-li" data-part="' + p.id + '" data-s="' + p.classic.s + '"><i aria-hidden="true"></i>' + esc(p.name) + '</button></li>';
          }).join('') + '</ul>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function cleanSteps(o) {
    return '<ol class="cls" role="list">' + o.steps.map(function (s, i) {
      return '<li class="cls-i" style="--i:' + i + '"><span class="cls-n" aria-hidden="true">' + (i + 1) + '</span><div><b class="cls-t">' + esc(L(s.t)) + '</b><p class="cls-d">' + esc(L(s.d)) + '</p></div></li>';
    }).join('') + '</ol>';
  }

  /** Šematski crteži za okvir THE HOOKAH (nacrtani u stilu sajta, prema crtežu THE HOOKAH). */
  function thLedSvg() {
    return '<svg class="thb-svg" viewBox="0 0 240 180" aria-hidden="true">' +
      '<rect x="40" y="18" width="44" height="140" rx="12" class="thb-body"/><rect x="50" y="8" width="24" height="14" rx="3" class="thb-cap"/><rect x="50" y="156" width="24" height="14" rx="3" class="thb-cap"/>' +
      '<g class="thb-led"><rect x="52" y="36" width="4" height="78" rx="2"/><rect x="60" y="36" width="4" height="78" rx="2"/><rect x="68" y="36" width="4" height="78" rx="2"/></g>' +
      '<rect x="53" y="128" width="18" height="9" rx="2" class="thb-port"/>' +
      '<path d="M130 40h28l10 18v92h-44V58z" class="thb-body"/><rect x="134" y="26" width="20" height="16" rx="3" class="thb-cap"/>' +
      '<g class="thb-led"><rect x="140" y="64" width="4" height="56" rx="2"/><rect x="148" y="64" width="4" height="56" rx="2"/></g>' +
      '<rect x="137" y="128" width="16" height="9" rx="2" class="thb-port"/>' +
      '<g class="thb-nodrop" transform="translate(196 96)"><circle r="18"/><path d="M0 -10C4 -4.5 6 -1.6 6 1.6A6 6 0 0 1 -6 1.6C-6 -1.6 -4 -4.5 0 -10Z"/><path class="thb-x" d="M-12 12L12 -12"/></g>' +
      '<g class="thb-bolt" transform="translate(196 40)"><path d="M3 -12L-7 3H0L-3 13L8 -2H1Z"/></g>' +
    '</svg>';
  }
  function thWoodSvg() {
    return '<svg class="thb-svg" viewBox="0 0 240 180" aria-hidden="true">' +
      '<g transform="translate(14 30)"><rect x="0" y="10" width="120" height="34" rx="17" class="thb-wood"/>' +
      '<path d="M14 22q20-5 40 0t40 0" class="thb-grain"/><path d="M14 34q24 4 46 0t40 0" class="thb-grain"/>' +
      '<rect x="6" y="23" width="108" height="8" rx="4" class="thb-steel"/>' +
      '<rect x="44" y="52" width="32" height="0" /></g>' +
      '<path d="M168 70h28M171 70l-3 10q-24 34-20 58 4 14 34 14h10q30 0 34-14 4-24-20-58l-3-10" class="thb-glass"/>' +
      '<path d="M154 126q14-6 28 0t28 0q4 10 0 18-6 8-28 8t-28-8q-4-8 0-18z" class="thb-cold"/>' +
      '<g class="thb-snow" transform="translate(182 30)"><path d="M0 -11V11M-9.5 -5.5L9.5 5.5M-9.5 5.5L9.5 -5.5"/></g>' +
      '<g class="thb-cdrops">' + [0, 1, 2].map(function (i) { return '<g transform="translate(' + (172 + i * 10) + ' 52)"><path style="--d:' + (i * 0.5) + 's" d="M0 -6C2.2 -2.9 3.4 -1.2 3.4 0.7A3.4 3.4 0 0 1 -3.4 0.7C-3.4 -1.2 -2.2 -2.9 0 -6Z"/></g>'; }).join('') + '</g>' +
    '</svg>';
  }
  function cleanBrand(o) {
    var models = o.models.map(function (m) {
      return '<article class="thb-m thb-m--' + m.kind + '">' +
        '<div class="thb-art">' + (m.kind === 'led' ? thLedSvg() : thWoodSvg()) + '</div>' +
        '<h3 class="thb-name">' + esc(m.name) + '</h3><p class="thb-sub">' + esc(L(m.sub)) + '</p>' +
        '<ul class="thb-pts" role="list">' + m.points.map(function (p) { return '<li>' + esc(L(p)) + '</li>'; }).join('') + '</ul>' +
      '</article>';
    }).join('');
    return '<div class="thb">' +
      '<header class="thb-head"><img class="thb-logo" src="' + esc(o.logo) + '" alt="THE HOOKAH" width="88" height="88" loading="lazy" decoding="async">' +
        '<div><p class="thb-eyebrow">THE HOOKAH · Eschenburg</p><a class="thb-visit" href="' + esc(o.url) + '" target="_blank" rel="nofollow noopener">' + esc(L(o.visit)) + icon('arrowUpRight') + '</a></div></header>' +
      '<div class="thb-models">' + models + '</div>' +
      '<p class="thb-cap">' + esc(L(o.caption)) + '</p>' +
      '<div class="thb-check"><h3 class="thb-check__h">' + esc(L(o.checkTitle)) + '</h3><ul role="list">' + o.check.map(function (c) { return '<li>' + esc(L(c)) + '</li>'; }).join('') + '</ul></div>' +
      '<p class="thb-credit">' + esc(L(o.credit)) + ' <a href="' + esc(o.url) + '" target="_blank" rel="nofollow noopener">thehookah.de</a></p>' +
    '</div>';
  }

  var BLOCKS = { beginnerPicks: beginnerPicks, brandCompare: brandCompare, icyPicks: icyPicks, groupPicks: groupPicks, picks: picks, podLab: podLab, podSize: podSize, podSpecs: podSpecs, podFeatures: podFeatures, cleanLab: cleanLab, cleanSteps: cleanSteps, cleanBrand: cleanBrand };
  function block(b) {
    var name = typeof b === 'string' ? b : b && b.type;
    return name && BLOCKS[name] ? BLOCKS[name](typeof b === 'object' ? b : null) : '';
  }

  /* ---------- stranice ---------- */

  function articleCard(a, i) {
    return '<li class="acard" style="--i:' + (i % 3) + '"><a class="acard__link" href="' + V.articleUrl(a) + '">' +
      '<span class="acard__eyebrow">' + esc(L(a.eyebrow)) + '</span>' +
      '<h2 class="acard__title">' + esc(L(a.title)) + '</h2>' +
      '<p class="acard__lead">' + esc(L(a.lead)) + '</p>' +
      '<span class="acard__more">' + esc(t('articles.read')) + icon('arrowRight') + '</span>' +
    '</a></li>';
  }

  V.pageArticles = function (crumbs) {
    return (
      V.pageHero({ id: 'articles-title', eyebrow: t('articles.eyebrow'), title: t('articles.title'), lead: t('articles.lead'), crumbs: crumbs }) +
      '<section class="fsec fsec--flush"><div class="container">' +
        '<ul class="acards" role="list">' + V.articles().map(articleCard).join('') + '</ul>' +
      '</div></section>'
    );
  };

  V.pageArticle = function (a, crumbs) {
    var secs = a.sections.map(function (s, i) {
      var hid = 'art-' + a.id + '-' + (i + 1);
      var links = (s.links || []).map(function (l) {
        return '<a class="btn btn--ghost" href="' + V.url(l.page) + '">' + esc(t('nav.' + l.page)) + icon('arrowRight') + '</a>';
      }).join('');
      return '<section class="fsec art-sec' + (i % 2 ? ' fsec--alt' : '') + '" aria-labelledby="' + hid + '"><div class="container">' +
        '<div class="art-body">' +
          '<h2 class="art-h" id="' + hid + '">' + esc(L(s.h)) + '</h2>' +
          '<div class="prose">' + (L(s.p) || []).map(function (p) { return '<p>' + V.linkTerms(p) + '</p>'; }).join('') + '</div>' +
        '</div>' +
        block(s.block) +
        (links ? '<p class="art-links">' + links + '</p>' : '') +
      '</div></section>';
    }).join('');
    var others = V.articles().filter(function (x) { return x !== a; });
    return (
      '<article class="art' + (a.studio ? ' art--studio' : '') + '">' +
        (a.studio ? studioHero(a, crumbs) : V.pageHero({ id: 'article-title', eyebrow: L(a.eyebrow), title: L(a.title), lead: L(a.lead), crumbs: crumbs })) +
        secs +
        V.faqSection(a.faq, 'art-faq') +
        (others.length
          ? '<section class="fsec fsec--alt" aria-labelledby="art-more-h"><div class="container">' +
              '<h2 class="art-h" id="art-more-h">' + esc(t('articles.more')) + '</h2>' +
              '<ul class="acards" role="list">' + others.map(function (x, i) { return articleCard(x, i).replace('<h2 class="acard__title">', '<h3 class="acard__title">').replace('</h2><p class="acard__lead">', '</h3><p class="acard__lead">'); }).join('') + '</ul>' +
            '</div></section>'
          : '') +
      '</article>'
    );
  };
})(typeof window !== 'undefined' ? window : globalThis);
