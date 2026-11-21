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

  /* ---------- stemless nargila (PurjFam POD): presjek, veličina, podaci ---------- */
  // Pojednostavljen bočni presjek prema opisu PurjFama (nije tehnički nacrt).
  // Ponašanje (dugmad, pokretanje kad se vidi) je u js/stemless.js, animacije u css/stemless.css.

  function podMarker(n, x, y, mode) {
    return '<g class="pl-mk pl-mk--' + mode + '" style="--n:' + n + '"><circle cx="' + x + '" cy="' + y + '" r="9"/><text x="' + x + '" y="' + (y + 3.6) + '" text-anchor="middle">' + (n + 1) + '</text></g>';
  }

  function podSvg() {
    var holes = '', bq = '', bl = '', i;
    for (i = 0; i < 15; i++) holes += '<circle cx="' + (180 + i * 9.3).toFixed(1) + '" cy="253" r="1.3"/>';
    // sitni mjehurići (77 rupa) i veliki (puna ploča, kroz bočne rupe)
    for (i = 0; i < 22; i++) {
      var x = 180 + ((i * 37) % 130), d = ((i * 7) % 22) / 10, s = 1.4 + ((i * 5) % 9) / 10;
      bq += '<circle class="pl-b" cx="' + x + '" cy="248" r="' + (1.3 + (i % 3) * 0.5) + '" style="--d:' + d.toFixed(1) + 's;--s:' + s.toFixed(1) + 's"/>';
    }
    [[176, 0], [314, 0.5], [178, 1.1], [312, 1.6], [180, 2.1]].forEach(function (b, k) {
      bl += '<circle class="pl-b pl-b--big" cx="' + b[0] + '" cy="246" r="' + (6 + (k % 2) * 2) + '" style="--d:' + b[1] + 's;--s:1.9s"/>';
    });
    var chA = 'M95 112C68 142 58 196 72 238L172 252', chB = 'M95 112C122 142 134 192 128 236L172 252';
    var out = 'M246 204C286 186 296 150 322 148C334 147 340 152 344 158L398 158';
    return '<svg class="pl-svg" viewBox="0 0 430 310" role="img" aria-hidden="true" focusable="false">' +
      '<defs>' +
        '<linearGradient id="pl-al" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#4a4038"/><stop offset="1" stop-color="#241d19"/></linearGradient>' +
        '<filter id="pl-blur" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="5"/></filter>' +
        '<linearGradient id="pl-w" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#5fc4e8" stop-opacity=".42"/><stop offset="1" stop-color="#2a7ea6" stop-opacity=".32"/></linearGradient>' +
        '<radialGradient id="pl-coal"><stop stop-color="#fff1c4"/><stop offset=".45" stop-color="#ff9a3c"/><stop offset="1" stop-color="#ff6a1a" stop-opacity="0"/></radialGradient>' +
        '<clipPath id="pl-win"><rect x="150" y="124" width="205" height="142" rx="16"/></clipPath>' +
      '</defs>' +
      '<path class="pl-table" d="M10 292H420"/>' +
      // posuda i žar
      '<g class="pl-bowl"><ellipse class="pl-glow" cx="95" cy="26" rx="34" ry="14" fill="url(#pl-coal)"/>' +
        '<rect x="74" y="18" width="42" height="10" rx="3" fill="#2b2b2b"/><rect class="pl-ember" x="80" y="20" width="30" height="6" rx="2"/>' +
        '<path d="M66 30H124L114 70H76Z" fill="#8a6a52"/><path d="M70 38H120" stroke="#6d5241" stroke-width="2"/></g>' +
      '<rect x="80" y="68" width="30" height="46" rx="4" fill="url(#pl-al)" stroke="#4a3d33"/>' +
      // tijelo
      '<rect x="40" y="110" width="330" height="170" rx="26" fill="url(#pl-al)" stroke="#4a3d33" stroke-width="1.5"/>' +
      '<rect x="150" y="124" width="205" height="142" rx="16" fill="rgba(255,255,255,.035)"/>' +
      '<g clip-path="url(#pl-win)"><path class="pl-water" d="M150 210C180 204 205 214 235 208S300 202 330 209S350 206 360 208V270H150Z" fill="url(#pl-w)"/>' +
        '<g class="pl-haze" filter="url(#pl-blur)"><ellipse cx="215" cy="190" rx="40" ry="11"/><ellipse cx="285" cy="178" rx="46" ry="12"/><ellipse cx="250" cy="160" rx="34" ry="9"/></g>' +
        '<g class="pl-bq">' + bq + '</g><g class="pl-bl">' + bl + '</g>' +
        '<path class="pl-up" d="M245 246V214"/></g>' +
      '<rect x="150" y="124" width="205" height="142" rx="16" fill="none" stroke="#7d6c5e" stroke-width="2"/>' +
      // kanali u aluminiju
      '<path class="pl-ch2" d="' + chA + '"/><path class="pl-ch2" d="' + chB + '"/><path class="pl-ch" d="' + chA + '"/><path class="pl-ch" d="' + chB + '"/>' +
      '<path class="pl-flow pl-flow--in" d="M95 34V112"/>' +
      '<path class="pl-flow pl-flow--in" d="' + chA + '"/><path class="pl-flow pl-flow--in" d="' + chB + '"/>' +
      // difuzor sa rupama i vratima
      '<rect x="170" y="249" width="152" height="9" rx="3" fill="#b9b1a6"/><g class="pl-holes" fill="#4a3f36">' + holes + '</g>' +
      '<path class="pl-door" d="M172 244V256"/>' +
      // pregrada i izlaz
      '<path d="M330 128V166H350" fill="none" stroke="#9c8f82" stroke-width="3" stroke-linecap="round"/>' +
      '<path class="pl-flow pl-flow--out" d="' + out + '"/>' +
      '<rect x="370" y="150" width="24" height="16" rx="3" fill="#a59c92"/>' +
      '<path class="pl-hose" d="M394 158C410 158 418 170 420 196"/>' +
      '<path class="pl-flow pl-flow--back" d="M420 196C418 170 410 158 394 158L352 158"/>' +
      // ventili na dnu i mlazovi pri ispuhivanju
      '<rect class="pl-valve" x="104" y="279" width="26" height="7" rx="2"/><rect class="pl-valve" x="282" y="279" width="26" height="7" rx="2"/>' +
      '<g class="pl-purge"><path d="M108 288C92 292 74 294 52 294"/><path d="M126 288C142 292 160 294 182 294"/><path d="M286 288C270 292 252 294 230 294"/><path d="M304 288C320 292 338 294 360 294"/></g>' +
      '<g class="pl-stop"><circle cx="150" cy="232" r="11"/><path d="M144 226L156 238M156 226L144 238"/></g>' +
      // brojevi koraka
      podMarker(0, 132, 24, 'path') + podMarker(1, 46, 186, 'path') + podMarker(2, 246, 272, 'path') + podMarker(3, 342, 118, 'path') + podMarker(4, 404, 140, 'path') +
      podMarker(0, 404, 140, 'purge') + podMarker(1, 206, 300, 'purge') + podMarker(2, 150, 210, 'purge') +
    '</svg>';
  }

  function podLab(o) {
    var modes = ['path', 'purge', 'bubbles'];
    var steps = function (m) {
      return '<ol class="pl-steps pl-steps--' + m + '">' + (o.steps[m] || []).map(function (s, i) {
        return '<li style="--n:' + i + '"><span class="pl-num">' + (i + 1) + '</span><span>' + esc(L(s)) + '</span></li>';
      }).join('') + '</ol>';
    };
    return '<div class="pl" data-pl data-mode="path" data-bub="quiet">' +
      '<div class="pl-tabs" role="tablist">' + modes.map(function (m, i) {
        return '<button type="button" class="pl-tab" role="tab" data-mode="' + m + '" aria-selected="' + (i === 0) + '">' + esc(L(o.tabs[m])) + '</button>';
      }).join('') + '</div>' +
      '<div class="pl-stage">' + podSvg() +
        '<div class="pl-bubsw" role="group"><button type="button" data-bub="quiet" aria-pressed="true">' + esc(L(o.quiet)) + '</button><button type="button" data-bub="loud" aria-pressed="false">' + esc(L(o.loud)) + '</button></div>' +
      '</div>' +
      modes.map(steps).join('') +
      '<p class="pl-note">' + esc(L(o.note)) + '</p>' +
    '</div>';
  }

  function podSize(o) {
    // 3 px po cm: klasična oko 70 cm, POD 12,7 cm (bez posude)
    var base = 236;
    return '<figure class="ps" data-ps>' +
      '<svg class="ps-svg" viewBox="0 0 320 250" aria-hidden="true" focusable="false">' +
        '<path d="M10 ' + base + 'H310" stroke="var(--c-line-strong)" stroke-width="1.5"/>' +
        '<g class="ps-classic" fill="none" stroke="var(--c-muted)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' +
          // vaza
          '<path d="M80 ' + (base - 70) + 'C80 ' + (base - 56) + ' 56 ' + (base - 48) + ' 56 ' + (base - 24) + 'C56 ' + (base - 8) + ' 70 ' + base + ' 90 ' + base + 'C110 ' + base + ' 124 ' + (base - 8) + ' 124 ' + (base - 24) + 'C124 ' + (base - 48) + ' 100 ' + (base - 56) + ' 100 ' + (base - 70) + 'Z"/>' +
          '<path d="M60 ' + (base - 26) + 'H120" stroke-opacity=".35"/>' +
          // stub, priključak za crijevo i tacna
          '<path d="M86 ' + (base - 70) + 'V' + (base - 176) + 'M94 ' + (base - 70) + 'V' + (base - 176) + '"/>' +
          '<path d="M94 ' + (base - 120) + 'H106V' + (base - 112) + 'H94"/>' +
          '<path d="M106 ' + (base - 116) + 'C130 ' + (base - 116) + ' 140 ' + (base - 90) + ' 136 ' + (base - 50) + '" stroke-opacity=".6"/>' +
          '<path d="M66 ' + (base - 164) + 'C70 ' + (base - 158) + ' 110 ' + (base - 158) + ' 114 ' + (base - 164) + '"/>' +
          // posuda i ugljevi
          '<path d="M80 ' + (base - 196) + 'H100L96 ' + (base - 178) + 'H84Z"/>' +
          '<path d="M78 ' + (base - 204) + 'H102V' + (base - 196) + 'H78Z"/>' +
          '<path d="M82 ' + (base - 210) + 'H98" stroke="#ff9a3c"/>' +
        '</g>' +
        '<path class="ps-dim" d="M140 ' + base + 'V' + (base - 210) + '"/>' +
        '<text class="ps-t" x="146" y="' + (base - 196) + '">' + esc(L(o.classicH)) + '</text>' +
        '<g class="ps-pod"><rect x="214" y="' + (base - 32) + '" width="37" height="32" rx="6" fill="url(#ps-al)" stroke="#4a3d33"/>' +
          '<rect x="226" y="' + (base - 28) + '" width="22" height="22" rx="3" fill="rgba(95,196,232,.25)" stroke="#7d6c5e"/>' +
          '<rect x="218" y="' + (base - 38) + '" width="8" height="7" rx="1.5" fill="#3a312b"/></g>' +
        '<defs><linearGradient id="ps-al" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#3a312b"/><stop offset="1" stop-color="#1a1411"/></linearGradient></defs>' +
        '<path class="ps-dim ps-dim--pod" d="M262 ' + base + 'V' + (base - 38) + '"/>' +
        '<text class="ps-t ps-t--pod" x="268" y="' + (base - 22) + '">' + esc(L(o.podH).split(' ')[0]) + '</text>' +
      '</svg>' +
      '<figcaption class="ps-cap"><span><b>' + esc(L(o.classic)) + '</b> ' + esc(L(o.classicH)) + '</span><span><b>' + esc(L(o.pod)) + '</b> ' + esc(L(o.podH)) + '</span><small>' + esc(L(o.note)) + '</small></figcaption>' +
    '</figure>';
  }

  function podSpecs(o) {
    return '<div class="pspec">' +
      '<table class="pspec-t"><tbody>' + o.rows.map(function (r) {
        return '<tr><th scope="row">' + esc(L(r[0])) + '</th><td>' + esc(L(r[1])) + '</td></tr>';
      }).join('') + '</tbody></table>' +
      '<p class="pspec-shop"><a class="btn btn--primary" href="' + esc(o.shopUrl) + '" target="_blank" rel="noopener">' + esc(L(o.shop)) + icon('arrowRight') + '</a></p>' +
      '<div class="pgal">' + o.gallery.map(function (g, i) {
        return '<figure class="pgal-f' + (i === 0 ? ' pgal-f--wide' : '') + '"><img src="/gear/purjfam/' + esc(g.img) + '.webp" alt="' + esc(L(g.cap)) + '" loading="lazy" decoding="async" width="1000" height="' + (i === 0 ? 667 : 1000) + '"><figcaption>' + esc(L(g.cap)) + '</figcaption></figure>';
      }).join('') + '</div>' +
      '<p class="pgal-credit">' + esc(L(o.credit)) + '</p>' +
    '</div>';
  }

  var BLOCKS = { beginnerPicks: beginnerPicks, brandCompare: brandCompare, icyPicks: icyPicks, groupPicks: groupPicks, picks: picks, podLab: podLab, podSize: podSize, podSpecs: podSpecs };
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
      '<article class="art">' +
        V.pageHero({ id: 'article-title', eyebrow: L(a.eyebrow), title: L(a.title), lead: L(a.lead), crumbs: crumbs }) +
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
