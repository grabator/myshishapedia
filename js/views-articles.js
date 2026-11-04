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
  V.articleUrl = function (a, lang) { return V.urlFor(lang || MSP.lang, 'article', a.slug[lang || MSP.lang]); };

  /* ---------- dijelovi sastavljeni iz podataka sajta ---------- */

  function beginnerPicks() {
    var col = V.collections().filter(function (c) { return c.id === 'beginners'; })[0];
    var list = col ? V.collectionMembers(col) : [];
    list = list.slice().sort(function (a, b) { return (a.profile.strength - b.profile.strength) || (a.brand + a.name).localeCompare(b.brand + b.name); }).slice(0, 9);
    if (!list.length) return '';
    return '<ul class="grid art-grid" role="list">' + list.map(function (f, i) {
      return '<li class="grid__item" style="--i:' + (i % 3) + '">' + V.card(f, 'h3') + '</li>';
    }).join('') + '</ul>' +
      (col ? '<p class="art-more"><a class="btn btn--ghost" href="' + V.url('collection', col.slug[MSP.lang]) + '">' + esc(t('articles.allInCollection', { name: L(col.title) })) + icon('arrowRight') + '</a></p>' : '');
  }

  function brandStats(slug) {
    var b = V.brands().filter(function (x) { return x.slug === slug; })[0];
    if (!b) return null;
    var fl = V.brandFlavors(b);
    var avg = function (k) { return fl.length ? Math.round(fl.reduce(function (s, f) { return s + (f.profile[k] || 0); }, 0) / fl.length * 10) / 10 : 0; };
    return { brand: b, flavors: fl, sweetness: avg('sweetness'), cooling: avg('cooling'), fruitiness: avg('fruitiness'), strength: avg('strength') };
  }

  function num(n) { return MSP.lang === 'bs' ? String(n).replace('.', ',') : String(n); }

  function brandCompare() {
    var A = brandStats('adalya');
    var B = brandStats('al-fakher');
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

  var BLOCKS = { beginnerPicks: beginnerPicks, brandCompare: brandCompare };

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
        (s.block && BLOCKS[s.block] ? BLOCKS[s.block]() : '') +
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
