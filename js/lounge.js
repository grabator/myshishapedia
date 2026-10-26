/*
 * MyShishapedia - lounge meni u browseru.
 *
 * Ponuda lounge-a je u data/lounges.js (samo id-jevi okusa, oznake i kućni miksevi); sve ostalo
 * dolazi iz data/flavors.js:
 *   - lista okusa: pretraga, vrste (chips), filteri, poredak, 16 po stranici, "nema danas" na kraju
 *   - okus: sastojci (ilustracije), profil, opis i "ide najbolje sa" (samo iz ponude lounge-a)
 *   - miks: "zašto ide" iz zajedničkih sastojaka, vrsta okusa, hlađenja i slatkoće
 *   - "Šta pušiti večeras?": jedna osoba ili društvo; svako izabere šta voli, preporuka iz ponude
 *   - "Ovaj želim": veliki ekran za konobara (broj stola iz ?sto= ili ?table=)
 * Prozori (okus, miks, pitanje, filteri) idu u adresu (#okus=..), pa ih "nazad" na telefonu zatvori.
 * Ovisi o: views.js (V), strings.js (t), illustrations.js (MSP.illustrate, MSP.color).
 */
(function () {
  'use strict';

  var MSP = window.MSP;
  var V = MSP.V;
  var t = MSP.t;
  var L = MSP.L;
  var esc = V.esc;
  var icon = V.icon;
  var root = document.getElementById('lm');
  if (!root) return;

  var LG = (window.LOUNGES || []).filter(function (l) { return l.id === root.getAttribute('data-lounge'); })[0];
  if (!LG) return;

  var PER = 16;
  var $ = function (id) { return document.getElementById(id); };
  var params = new URLSearchParams(location.search);
  var table = (params.get('sto') || params.get('table') || '').replace(/[^0-9a-zA-Z]/g, '').slice(0, 4);

  /* ------------------------------------------------------------------ */
  /* Ponuda                                                              */
  /* ------------------------------------------------------------------ */

  var stock = [];
  var TAG = {};
  LG.flavors.forEach(function (x, i) {
    var f = V.flavorById(x.id);
    if (!f) return;
    stock.push(f);
    TAG[f.id] = x.tag || '';
    f._order = i;
  });
  function nm() { var n = LG.nameIn || {}, bs = MSP.lang === 'bs'; return { name: LG.name, loc: bs && n.loc || LG.name, gen: bs && n.gen || LG.name }; }
  function isOut(f) { return TAG[f.id] === 'out'; }
  function inStock() { return stock.filter(function (f) { return !isOut(f); }); }
  function brandName(f) { var b = V.brandOf(f); return b ? b.name : f.brand; }
  function P(f, k) { return (f.profile && f.profile[k]) || 0; }
  function hasTag(f, tg) { return f.tags.indexOf(tg) !== -1; }
  function ingNames(f, n) { return f.ingredients.slice(0, n || 9).map(function (i) { return L(i.name).toLowerCase(); }); }

  // vrste okusa: chips, filteri i "Šta pušiti večeras?" koriste iste provjere
  var KINDS = {
    fruit: { ic: '🍉', test: function (f) { return hasTag(f, 'vocni'); } },
    berry: { ic: '🫐', test: function (f) { return hasTag(f, 'bobicasti'); } },
    tropic: { ic: '🌴', test: function (f) { return hasTag(f, 'tropski'); } },
    citrus: { ic: '🍋', test: function (f) { return hasTag(f, 'citrusni'); } },
    sweet: { ic: '🍬', test: function (f) { return P(f, 'sweetness') >= 7; } },
    ice: { ic: '❄️', test: function (f) { return P(f, 'cooling') >= 6; } },
    mint: { ic: '🌿', test: function (f) { return hasTag(f, 'mint'); } },
    fresh: { ic: '🍃', test: function (f) { return P(f, 'freshness') >= 7; } },
    dessert: { ic: '🍫', test: function (f) { return hasTag(f, 'desertni'); } },
    drink: { ic: '☕', test: function (f) { return hasTag(f, 'caj') || hasTag(f, 'pice'); } }
  };
  var CHIP_KINDS = ['fruit', 'ice', 'berry', 'tropic', 'sweet', 'mint', 'dessert'];
  var FILTER_KINDS = ['fruit', 'berry', 'tropic', 'citrus', 'sweet', 'ice', 'mint', 'dessert', 'drink'];
  var ASK_KINDS = ['fruit', 'sweet', 'fresh', 'dessert', 'tropic', 'berry'];
  function kindLabel(k) { return t('lounge.k_' + k); }

  /* ------------------------------------------------------------------ */
  /* Avatari i ilustracije                                               */
  /* ------------------------------------------------------------------ */

  function illus(i, cls) { return '<span class="' + cls + '">' + MSP.illustrate(i.illustration, { color: i.color }) + '</span>'; }
  function avatar(f) {
    var g = f.ingredients, c0 = g[0].color, c1 = (g[1] || g[0]).color;
    return '<span class="lm-av" aria-hidden="true" style="background:radial-gradient(circle at 30% 25%,' + MSP.color.lighten(c0, 0.25) + '55,transparent 60%),radial-gradient(circle at 75% 80%,' + c1 + '44,transparent 60%),#1d1612">' +
      illus(g[0], 'lm-av__a') + (g[1] ? illus(g[1], 'lm-av__b') : '') + (g[2] ? illus(g[2], 'lm-av__c') : '') +
      (P(f, 'cooling') >= 6 ? '<i class="lm-snow">❄</i><i class="lm-snow lm-snow--b">❄</i>' : '') + '</span>';
  }
  function mixAvatar(a, b) {
    var x = a.ingredients[0], y = b.ingredients[0];
    return '<span class="lm-av lm-av--mix" aria-hidden="true" style="background:radial-gradient(circle at 25% 40%,' + x.color + '55,transparent 60%),radial-gradient(circle at 75% 60%,' + y.color + '55,transparent 60%),#1d1612">' +
      illus(x, 'lm-av__m1') + illus(y, 'lm-av__m2') + '</span>';
  }
  function heroIllus(list) {
    return '<div class="lm-hero__ill">' + list.map(function (i, k) {
      return '<span class="lm-hi" style="--k:' + k + '">' + MSP.illustrate(i.illustration, { color: i.color }) + '</span>';
    }).join('') + '</div>';
  }

  function tagPill(f) {
    var tg = TAG[f.id];
    if (!tg) return '';
    var key = { top: 'tagTop', 'new': 'tagNew', out: 'tagOut' }[tg];
    return '<span class="lm-tag lm-tag--' + tg + '">' + esc(t('lounge.' + key)) + '</span>';
  }

  function row(f, rank) {
    return (
      '<li><a class="lm-row' + (isOut(f) ? ' is-out' : '') + '" href="#okus=' + esc(f.id) + '">' +
        (rank ? '<span class="lm-rank">' + rank + '</span>' : '') + avatar(f) +
        '<span class="lm-row__txt"><small>' + esc(brandName(f)) + '</small><b>' + esc(f.name) + '</b><span>' + esc(ingNames(f, 4).join(' · ')) + '</span></span>' +
        tagPill(f) +
      '</a></li>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Miksevi i "zašto ide"                                               */
  /* ------------------------------------------------------------------ */

  var FAMILIES = ['bobicasti', 'tropski', 'citrusni', 'desertni'];

  /** Koliko b ide uz a i zašto (iz sastojaka, vrste okusa, hlađenja i slatkoće). */
  function pairInfo(a, b) {
    var score = 0, why = [], short = [];
    var ia = a.ingredients.map(function (i) { return i.illustration; });
    var common = b.ingredients.filter(function (i) { return ia.indexOf(i.illustration) !== -1 && i.illustration !== 'kristal'; }).map(function (i) { return L(i.name).toLowerCase(); });
    if (common.length) { score += 3; why.push(t('lounge.whyCommon', { x: common.slice(0, 2).join(' i ') })); short.push(t('lounge.r_common', { x: common[0] })); }
    var fam = FAMILIES.filter(function (x) { return hasTag(a, x) && hasTag(b, x); })[0];
    if (fam) { score += 2; why.push(t('lounge.whyFamily', { x: t('lounge.fam_' + fam) })); short.push(t('lounge.r_family', { x: t('lounge.fam_' + fam) })); }
    else if (hasTag(a, 'vocni') && hasTag(b, 'vocni')) { score += 1; if (!common.length) why.push(t('lounge.whyFamily', { x: t('lounge.fam_vocni') })); }
    var pct = 60;
    if (P(a, 'cooling') <= 2 && P(b, 'cooling') >= 6) {
      score += 3; pct = b.mixRole === 'cooler' ? 80 : 70;
      why.push(t('lounge.whyAddIce', { a: a.name, b: b.name })); short.unshift(t('lounge.r_addIce', { a: a.name }));
    } else if (P(a, 'cooling') >= 8 && P(b, 'cooling') <= 2) {
      score += 2; pct = 50; why.push(t('lounge.whySoftIce', { a: a.name, b: b.name })); short.push(t('lounge.r_softIce'));
    }
    if (P(a, 'sweetness') <= 5 && P(b, 'sweetness') >= 7) { score += 2; why.push(t('lounge.whyAddSweet', { b: b.name })); short.push(t('lounge.r_sweet')); }
    if ((a.similar || []).indexOf(b.id) !== -1) { score += 1; if (why.length < 2) why.push(t('lounge.whySimilar')); short.push(t('lounge.r_similar')); }
    if ((hasTag(a, 'desertni') && hasTag(b, 'citrusni')) || (hasTag(b, 'desertni') && hasTag(a, 'citrusni'))) score -= 3;
    if (hasTag(a, 'desertni') !== hasTag(b, 'desertni') && (hasTag(a, 'vocni') || hasTag(b, 'vocni'))) score -= 1;
    if (!why.length && P(a, 'fruitiness') >= 6 && P(b, 'freshness') >= 8) { score += 1; why.push(t('lounge.whyContrast', { a: a.name, b: b.name })); }
    return { score: score, why: why.slice(0, 3), short: short[0] || '', pct: pct };
  }

  function bestWith(f, n) {
    return inStock().filter(function (g) { return g !== f && !(g.mixRole === 'cooler' && P(f, 'cooling') >= 6); })
      .map(function (g) { var p = pairInfo(f, g); return { f: g, p: p }; })
      .filter(function (x) { return x.p.score >= 2 && x.p.why.length; })
      .sort(function (x, y) { return y.p.score - x.p.score || x.f._order - y.f._order; })
      .slice(0, n || 3);
  }

  function mixProfile(parts) {
    var o = {};
    ['sweetness', 'fruitiness', 'cooling', 'strength', 'freshness'].forEach(function (k) {
      o[k] = Math.round(parts.reduce(function (s, p) { return s + P(p.f, k) * p.pct; }, 0) / 10) / 10;
    });
    return o;
  }

  function houseMixes() {
    return (LG.mixes || []).map(function (m) {
      var parts = m.parts.map(function (p) { return { f: V.flavorById(p[0]), pct: p[1] }; }).filter(function (p) { return p.f; });
      return { id: m.id, name: m.name, parts: parts, house: true };
    }).filter(function (m) { return m.parts.length === 2 && !m.parts.some(function (p) { return isOut(p.f); }); });
  }
  function mixWhy(m) {
    var a = m.parts[0].f, b = m.parts[1].f;
    // "zašto" iz oba smjera, ali bez dvije rečenice o istom (npr. led dodaje i led ublažava)
    var w = pairInfo(a, b).why.concat(pairInfo(b, a).why), seen = {}, out = [];
    w.forEach(function (x) {
      var key = /led|hlađ|ice|cool/i.test(x) ? 'ice' : x;
      if (!seen[key]) { seen[key] = 1; out.push(x); }
    });
    return out.slice(0, 3);
  }
  function pairMix(a, b, pct) {
    return { id: '', name: a.name + ' + ' + b.name, parts: [{ f: a, pct: pct }, { f: b, pct: 100 - pct }], house: false };
  }

  /* ------------------------------------------------------------------ */
  /* Lista: pretraga, chips, filteri, poredak, stranice                  */
  /* ------------------------------------------------------------------ */

  var S = { q: '', kinds: [], cool: '', sweet: '', str: '', brand: '', sort: 'top', page: 1 };

  function matches(f, st) {
    st = st || S;
    if (st.kinds.some(function (k) { return !KINDS[k].test(f); })) return false;
    var c = P(f, 'cooling'), sw = P(f, 'sweetness'), sr = P(f, 'strength');
    if (st.cool === 'none' && c > 1) return false;
    if (st.cool === 'low' && (c < 2 || c > 6)) return false;
    if (st.cool === 'high' && c < 7) return false;
    if (st.sweet === 'low' && sw > 5) return false;
    if (st.sweet === 'mid' && (sw < 6 || sw > 7)) return false;
    if (st.sweet === 'high' && sw < 8) return false;
    if (st.str === 'light' && sr > 5) return false;
    if (st.str === 'mid' && (sr < 6 || sr > 7)) return false;
    if (st.str === 'strong' && sr < 8) return false;
    if (st.brand && (f.brandId || f.brand) !== st.brand) return false;
    if (st.q) {
      var hay = V.normalize([f.name, brandName(f)].concat(f.ingredients.map(function (i) { return i.name.bs + ' ' + i.name.en; })).join(' '));
      if (st.q.split(' ').some(function (w) { return hay.indexOf(w) === -1; })) return false;
    }
    return true;
  }

  var SORTS = {
    top: function (a, b) { var r = { top: 0, 'new': 1 }; return (r[TAG[a.id]] != null ? r[TAG[a.id]] : 2) - (r[TAG[b.id]] != null ? r[TAG[b.id]] : 2) || a._order - b._order; },
    az: function (a, b) { return a.name.localeCompare(b.name); },
    brand: function (a, b) { return brandName(a).localeCompare(brandName(b)) || a.name.localeCompare(b.name); },
    sweet: function (a, b) { return P(b, 'sweetness') - P(a, 'sweetness') || a.name.localeCompare(b.name); },
    cold: function (a, b) { return P(b, 'cooling') - P(a, 'cooling') || a.name.localeCompare(b.name); }
  };

  function filtered(st) {
    st = st || S;
    var list = stock.filter(function (f) { return matches(f, st); }).sort(SORTS[st.sort] || SORTS.top);
    return list.filter(function (f) { return !isOut(f); }).concat(list.filter(isOut));
  }
  function activeFilters() { return S.kinds.length + (S.cool ? 1 : 0) + (S.sweet ? 1 : 0) + (S.str ? 1 : 0) + (S.brand ? 1 : 0); }
  function narrowed() { return !!(S.q || activeFilters()); }

  function renderChips() {
    var n = activeFilters();
    $('lm-chips').innerHTML =
      '<button type="button" class="lm-chip lm-chip--f' + (n ? ' is-on' : '') + '" data-go="filteri">' + icon('layers') + '<span>' + esc(t('lounge.filters')) + '</span>' + (n ? '<em>' + n + '</em>' : '') + '</button>' +
      '<button type="button" class="lm-chip' + (!S.kinds.length ? ' is-on' : '') + '" data-kind="" aria-pressed="' + !S.kinds.length + '">' + esc(t('lounge.all')) + '</button>' +
      CHIP_KINDS.map(function (k) {
        var on = S.kinds.indexOf(k) !== -1;
        return '<button type="button" class="lm-chip' + (on ? ' is-on' : '') + '" data-kind="' + k + '" aria-pressed="' + on + '"><span aria-hidden="true">' + KINDS[k].ic + '</span>' + esc(kindLabel(k)) + '</button>';
      }).join('');
  }

  function pageButtons(total, cur) {
    if (total < 2) return '';
    var nums = [];
    for (var i = 1; i <= total; i++) if (i === 1 || i === total || Math.abs(i - cur) <= 1) nums.push(i);
    var out = '<button type="button" class="lm-pg lm-pg--nav" data-page="' + (cur - 1) + '"' + (cur === 1 ? ' disabled' : '') + ' aria-label="' + esc(t('lounge.prev')) + '">' + icon('arrowLeft') + '</button>';
    var last = 0;
    nums.forEach(function (n) {
      if (n - last > 1) out += '<span class="lm-pg__gap" aria-hidden="true">…</span>';
      out += '<button type="button" class="lm-pg' + (n === cur ? ' is-on' : '') + '" data-page="' + n + '"' + (n === cur ? ' aria-current="page"' : '') + ' aria-label="' + esc(t('lounge.page', { n: n })) + '">' + n + '</button>';
      last = n;
    });
    return out + '<button type="button" class="lm-pg lm-pg--nav" data-page="' + (cur + 1) + '"' + (cur === total ? ' disabled' : '') + ' aria-label="' + esc(t('lounge.next')) + '">' + icon('arrowRight') + '</button>';
  }

  /** Najbliži okusi kad filteri ne daju ništa: oni koji ispunjavaju najviše izabranih uslova. */
  function closest() {
    var conds = S.kinds.map(function (k) { return function (f) { return KINDS[k].test(f); }; });
    ['cool', 'sweet', 'str', 'brand'].forEach(function (key) {
      if (!S[key]) return;
      conds.push(function (f) { var st = { q: '', kinds: [], cool: '', sweet: '', str: '', brand: '' }; st[key] = S[key]; return matches(f, st); });
    });
    return inStock().map(function (f) { return { f: f, n: conds.filter(function (c) { return c(f); }).length }; })
      .sort(function (a, b) { return b.n - a.n || SORTS.top(a.f, b.f); }).slice(0, 4).map(function (x) { return x.f; });
  }

  function renderList(scroll) {
    var list = filtered();
    var pages = Math.max(1, Math.ceil(list.length / PER));
    if (S.page > pages) S.page = pages;
    var slice = list.slice((S.page - 1) * PER, S.page * PER);
    $('lm-count').textContent = list.length === 1 ? t('lounge.countOne') : t('lounge.count', { n: list.length });
    $('lm-list').innerHTML = slice.map(function (f) { return row(f); }).join('');
    $('lm-pages').innerHTML = pageButtons(pages, S.page);
    var empty = $('lm-empty');
    empty.hidden = !!list.length;
    if (!list.length) {
      empty.innerHTML =
        '<span class="lm-empty__art" aria-hidden="true">' + MSP.illustrate('fallback', { color: LG.colors[0] }) + '</span>' +
        '<b>' + esc(t('lounge.emptyTitle')) + '</b><p>' + esc(t('lounge.emptyText')) + '</p>' +
        '<ul class="lm-list lm-list--mini" role="list">' + closest().map(function (f) { return row(f); }).join('') + '</ul>' +
        '<button type="button" class="btn btn--ghost" data-reset>' + esc(t('lounge.emptyReset')) + '</button>';
    }
    // dok se traži ili filtrira, top i miksevi se sklone da rezultat bude odmah ispod
    $('lm-topsec').hidden = narrowed();
    $('lm-mixsec').hidden = narrowed();
    if (scroll) {
      var top = $('lm-allsec').getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 70) - 12;
      window.scrollTo({ top: top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    }
  }

  function renderTop() {
    var top = (LG.top || []).map(V.flavorById).filter(function (f) { return f && stock.indexOf(f) !== -1; });
    $('lm-top').innerHTML = top.map(function (f, i) { return row(f, i + 1); }).join('');
    $('lm-topsec').hidden = !top.length;
    var mixes = houseMixes();
    $('lm-mixes').innerHTML = mixes.map(function (m) {
      var a = m.parts[0], b = m.parts[1];
      return '<a class="lm-mix" href="#miks=' + esc(m.id) + '" style="--a:' + a.f.ingredients[0].color + ';--b:' + b.f.ingredients[0].color + '">' +
        mixAvatar(a.f, b.f) + '<b>' + esc(m.name) + '</b><span>' + esc(a.f.name + ' ' + a.pct + '% · ' + b.f.name + ' ' + b.pct + '%') + '</span></a>';
    }).join('');
    $('lm-mixsec').hidden = !mixes.length;
  }

  function refresh(resetPage, scroll) {
    if (resetPage) S.page = 1;
    renderChips();
    renderList(scroll);
  }

  var qT = 0;
  $('lm-q').addEventListener('input', function () {
    clearTimeout(qT);
    var v = this.value;
    qT = setTimeout(function () { S.q = V.normalize(v); refresh(true); }, 120);
  });
  $('lm-sort').addEventListener('change', function () { S.sort = this.value; refresh(true); });
  $('lm-chips').addEventListener('click', function (e) {
    var b = e.target.closest('[data-kind]');
    if (!b) return;
    var k = b.getAttribute('data-kind');
    if (!k) S.kinds = [];
    else if (S.kinds.indexOf(k) === -1) S.kinds.push(k);
    else S.kinds = S.kinds.filter(function (x) { return x !== k; });
    refresh(true);
  });
  $('lm-pages').addEventListener('click', function (e) {
    var b = e.target.closest('[data-page]');
    if (!b || b.disabled) return;
    S.page = +b.getAttribute('data-page');
    renderList(true);
  });
  root.addEventListener('click', function (e) {
    if (e.target.closest('[data-reset]')) { S.kinds = []; S.cool = S.sweet = S.str = S.brand = ''; S.q = ''; $('lm-q').value = ''; refresh(true, true); }
  });

  /* ------------------------------------------------------------------ */
  /* Prozori (okus, miks, pitanje, filteri, "Ovaj želim")                */
  /* ------------------------------------------------------------------ */

  var ov = $('lm-ov'), box = $('lm-ovbox');
  var opened = 0;

  function go(hash) { opened++; location.hash = hash; }
  function closeOv() {
    if (opened > 0) { opened--; history.back(); return; }
    history.replaceState(null, '', location.pathname + location.search);
    route();
  }
  root.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(g.getAttribute('data-go')); return; }
    var a = e.target.closest('a[href^="#"]');
    if (a && a.getAttribute('href').length > 1) { e.preventDefault(); go(a.getAttribute('href').slice(1)); }
  });
  ov.addEventListener('click', function (e) {
    if (e.target === ov || e.target.closest('[data-close]')) closeOv();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !ov.hidden) closeOv(); });

  function bar(label, v, color) {
    return '<div class="lm-meter"><span>' + esc(label) + '</span><i style="--v:' + Math.max(0, Math.min(10, v)) * 10 + '%;--c:' + color + '"></i><b>' + (Math.round(v * 10) / 10).toString().replace('.', MSP.lang === 'bs' ? ',' : '.') + '</b></div>';
  }
  function meters(p) {
    return '<div class="lm-meters">' + bar(t('lounge.m_sweet'), p.sweetness, '#ff8fa0') + bar(t('lounge.m_fruit'), p.fruitiness, '#f2a33c') + bar(t('lounge.m_cool'), p.cooling, '#7fd3ff') + bar(t('lounge.m_strength'), p.strength, '#c9bfb3') + '</div>';
  }
  function wantBtn(hash, out) {
    if (out) return '<button type="button" class="lm-cta" disabled>' + esc(t('lounge.wantOut')) + '</button>';
    return '<a class="lm-cta" href="#' + hash + '">' + esc(table ? t('lounge.wantTable', { n: table }) : t('lounge.want')) + '</a>';
  }
  function closeBtn(back) {
    return '<button type="button" class="lm-x" data-close aria-label="' + esc(t(back ? 'lounge.back' : 'lounge.close')) + '">' + icon(back ? 'arrowLeft' : 'close') + '</button>';
  }

  function viewFlavor(f) {
    var tg = TAG[f.id];
    var badge = tg === 'new' ? t('lounge.badgeNew', nm()) : tg === 'top' ? t('lounge.badgeTop', nm()) : tg === 'out' ? t('lounge.badgeOut') : '';
    var best = bestWith(f, 3);
    return (
      '<div class="lm-hero" style="--c:' + f.ingredients[0].color + '">' + closeBtn(true) + (badge ? '<span class="lm-badge lm-badge--' + tg + '">' + esc(badge) + '</span>' : '') +
        heroIllus(f.ingredients) + '<div class="lm-hero__t"><small>' + esc(brandName(f)) + '</small><h2>' + esc(f.name) + '</h2></div></div>' +
      '<div class="lm-body">' +
        '<p class="lm-ings">' + f.ingredients.map(function (i) { return '<span style="--c:' + i.color + '">' + esc(L(i.name)) + '</span>'; }).join('') + '</p>' +
        meters(f.profile) +
        '<p class="lm-desc">' + esc(L(f.shortDescription)) + '</p>' +
        (best.length ? '<h3 class="lm-h3">' + esc(t('lounge.bestWith', nm())) + '</h3><ul class="lm-best" role="list">' + best.map(function (x) {
          return '<li><a class="lm-bm" href="#par=' + esc(f.id + ',' + x.f.id + ',' + x.p.pct) + '">' + mixAvatar(f, x.f) +
            '<span><b>+ ' + esc(x.f.name) + '</b><small>' + esc(x.p.short) + '</small></span><em>' + x.p.pct + ' / ' + (100 - x.p.pct) + '</em></a></li>';
        }).join('') + '</ul>' : '') +
        '<p class="lm-more"><a href="' + V.flavorUrl(f) + '">' + esc(t('lounge.more')) + icon('arrowUpRight') + '</a></p>' +
      '</div>' +
      '<div class="lm-foot-cta">' + wantBtn('zelim=' + f.id, isOut(f)) + '</div>'
    );
  }

  function viewMix(m) {
    var a = m.parts[0], b = m.parts[1];
    var why = m.house ? mixWhy(m) : pairInfo(a.f, b.f).why;
    return (
      '<div class="lm-hero lm-hero--mix" style="--c:' + a.f.ingredients[0].color + ';--c2:' + b.f.ingredients[0].color + '">' + closeBtn(true) +
        heroIllus([a.f.ingredients[0], b.f.ingredients[0]]) +
        '<div class="lm-hero__t"><small>' + esc(m.house ? t('lounge.houseMix', nm()) : t('lounge.pairMix')) + '</small><h2>' + esc(m.name) + '</h2></div></div>' +
      '<div class="lm-body">' +
        '<div class="lm-two">' + m.parts.map(function (p) {
          return '<a class="lm-part" href="#okus=' + esc(p.f.id) + '" style="--c:' + p.f.ingredients[0].color + '">' + avatar(p.f) + '<small>' + esc(brandName(p.f)) + '</small><b>' + esc(p.f.name) + '</b><span>' + esc(ingNames(p.f, 3).join(' · ')) + '</span><em>' + p.pct + '%</em></a>';
        }).join('') + '</div>' +
        (why.length ? '<div class="lm-why"><small>' + esc(t('lounge.why')) + '</small><ul>' + why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>' : '') +
        meters(mixProfile(m.parts)) +
      '</div>' +
      '<div class="lm-foot-cta">' + wantBtn('zelim=' + (m.house ? 'm:' + m.id : 'p:' + a.f.id + ',' + b.f.id + ',' + a.pct), false) + '</div>'
    );
  }

  function viewWant(spec) {
    var parts = [], name = '';
    if (spec.indexOf('m:') === 0) { var hm = houseMixes().filter(function (x) { return x.id === spec.slice(2); })[0]; if (hm) { parts = hm.parts; name = hm.name; } }
    else if (spec.indexOf('p:') === 0) { var q = spec.slice(2).split(','); var fa = V.flavorById(q[0]), fb = V.flavorById(q[1]); if (fa && fb) { var pm = pairMix(fa, fb, +q[2] || 60); parts = pm.parts; name = pm.name; } }
    else { var f = V.flavorById(spec); if (f) { parts = [{ f: f, pct: 100 }]; name = f.name; } }
    if (!parts.length) return null;
    return (
      '<div class="lm-want">' + closeBtn(false) +
        '<p class="lm-want__k">' + esc(t('lounge.wantTitle')) + '</p>' +
        '<div class="lm-want__av">' + (parts.length === 2 ? mixAvatar(parts[0].f, parts[1].f) : avatar(parts[0].f)) + '</div>' +
        '<h2>' + esc(name) + '</h2>' +
        '<ul class="lm-want__parts" role="list">' + parts.map(function (p) {
          return '<li><small>' + esc(brandName(p.f)) + '</small><b>' + esc(p.f.name) + '</b>' + (parts.length > 1 ? '<em>' + p.pct + '%</em>' : '') + '</li>';
        }).join('') + '</ul>' +
        (table ? '<p class="lm-want__table">' + esc(t('lounge.wantTableBig', { n: table })) + '</p>' : '') +
        '<p class="lm-want__lg"><span class="lm-logo" aria-hidden="true">' + esc(LG.mark || LG.name.charAt(0)) + '</span>' + esc(LG.name) + '</p>' +
      '</div>'
    );
  }

  /* --------------------------- filteri ------------------------------- */

  var draft = null;
  function seg(key, opts) {
    return '<div class="lm-seg" role="group">' + opts.map(function (o) {
      var on = draft[key] === o[0];
      return '<button type="button" class="' + (on ? 'is-on' : '') + '" data-seg="' + key + '" data-v="' + o[0] + '" aria-pressed="' + on + '">' + esc(o[1]) + '</button>';
    }).join('') + '</div>';
  }
  function viewFilters() {
    if (!draft) draft = JSON.parse(JSON.stringify(S));
    var n = filtered(draft).length;
    var brands = [];
    stock.forEach(function (f) { var b = f.brandId || f.brand; if (brands.indexOf(b) === -1) brands.push(b); });
    return (
      '<div class="lm-sheet">' + closeBtn(false) +
        '<h2 class="lm-sheet__h">' + esc(t('lounge.filters')) + ' <button type="button" class="lm-link" data-fclear>' + esc(t('lounge.clear')) + '</button></h2>' +
        '<p class="lm-lbl">' + esc(t('lounge.kind')) + '</p><div class="lm-opts">' + FILTER_KINDS.map(function (k) {
          var on = draft.kinds.indexOf(k) !== -1;
          return '<button type="button" class="lm-chip' + (on ? ' is-on' : '') + '" data-fkind="' + k + '" aria-pressed="' + on + '"><span aria-hidden="true">' + KINDS[k].ic + '</span>' + esc(kindLabel(k)) + '</button>';
        }).join('') + '</div>' +
        '<p class="lm-lbl">' + esc(t('lounge.cooling')) + '</p>' + seg('cool', [['', t('lounge.any')], ['none', t('lounge.coolNone')], ['low', t('lounge.coolLow')], ['high', t('lounge.coolHigh')]]) +
        '<p class="lm-lbl">' + esc(t('lounge.sweetness')) + '</p>' + seg('sweet', [['', t('lounge.any')], ['low', t('lounge.sweetLow')], ['mid', t('lounge.sweetMid')], ['high', t('lounge.sweetHigh')]]) +
        '<p class="lm-lbl">' + esc(t('lounge.strength')) + '</p>' + seg('str', [['', t('lounge.any')], ['light', t('lounge.strLight')], ['mid', t('lounge.strMid')], ['strong', t('lounge.strStrong')]]) +
        '<p class="lm-lbl">' + esc(t('lounge.brand')) + '</p><div class="lm-opts">' +
          '<button type="button" class="lm-chip' + (!draft.brand ? ' is-on' : '') + '" data-fbrand="">' + esc(t('lounge.all')) + '</button>' +
          brands.map(function (b) { var br = V.brandBySlug(b); return '<button type="button" class="lm-chip' + (draft.brand === b ? ' is-on' : '') + '" data-fbrand="' + esc(b) + '">' + esc(br ? br.name : b) + '</button>'; }).join('') +
        '</div>' +
      '</div>' +
      '<div class="lm-foot-cta"><button type="button" class="lm-cta" data-fapply' + (n ? '' : ' disabled') + '>' + esc(n ? t('lounge.show', { n: n === 1 ? t('lounge.countOne') : t('lounge.count', { n: n }) }) : t('lounge.showNone')) + '</button></div>'
    );
  }
  box.addEventListener('click', function (e) {
    if (!draft || box.getAttribute('data-view') !== 'filteri') return;
    var k = e.target.closest('[data-fkind]'), s = e.target.closest('[data-seg]'), b = e.target.closest('[data-fbrand]');
    if (k) { var kk = k.getAttribute('data-fkind'); draft.kinds = draft.kinds.indexOf(kk) === -1 ? draft.kinds.concat(kk) : draft.kinds.filter(function (x) { return x !== kk; }); }
    else if (s) draft[s.getAttribute('data-seg')] = s.getAttribute('data-v');
    else if (b) draft.brand = b.getAttribute('data-fbrand');
    else if (e.target.closest('[data-fclear]')) { draft.kinds = []; draft.cool = draft.sweet = draft.str = draft.brand = ''; }
    else if (e.target.closest('[data-fapply]')) { ['kinds', 'cool', 'sweet', 'str', 'brand'].forEach(function (x) { S[x] = draft[x]; }); draft = null; refresh(true, true); closeOv(); return; }
    else return;
    var y = box.scrollTop;
    box.innerHTML = viewFilters();
    box.scrollTop = y;
  });

  /* ------------------- "Šta pušiti večeras?" ------------------------- */

  var ask = { mode: 'solo', people: [{ name: '', kinds: [], ice: '' }], result: null, warn: false };

  function personCard(p, i) {
    var group = ask.mode === 'group';
    var label = p.name || (group ? t('lounge.person', { n: i + 1 }) : t('lounge.you'));
    return (
      '<div class="lm-person" data-p="' + i + '">' +
        (group ? '<div class="lm-person__h"><span class="lm-dot" style="--c:' + PCOL[i % PCOL.length] + '">' + esc(label.charAt(0).toUpperCase()) + '</span>' +
          '<input class="lm-in" type="text" maxlength="16" value="' + esc(p.name) + '" placeholder="' + esc(t('lounge.person', { n: i + 1 })) + '" aria-label="' + esc(t('lounge.personName')) + '" data-pname>' +
          (ask.people.length > 2 ? '<button type="button" class="lm-icon" data-prem aria-label="' + esc(t('lounge.removePerson', { name: label })) + '">' + icon('close') + '</button>' : '') + '</div>' : '') +
        (group ? '' : '<p class="lm-lbl">' + esc(t('lounge.likes')) + ' <span>' + esc(t('lounge.likesHint')) + '</span></p>') +
        '<div class="lm-likes">' + ASK_KINDS.map(function (k) {
          var on = p.kinds.indexOf(k) !== -1;
          return '<button type="button" class="lm-like' + (on ? ' is-on' : '') + '" data-pk="' + k + '" aria-pressed="' + on + '"><span aria-hidden="true">' + KINDS[k].ic + '</span>' + esc(kindLabel(k)) + '</button>';
        }).join('') + '</div>' +
        (group ? '' : '<p class="lm-lbl">' + esc(t('lounge.ice')) + '</p>') +
        '<div class="lm-seg lm-seg--ice" role="group" aria-label="' + esc(t('lounge.ice')) + '">' + [['none', t('lounge.iceNone')], ['low', t('lounge.iceLow')], ['high', t('lounge.iceHigh') + ' ❄️']].map(function (o) {
          var on = p.ice === o[0];
          return '<button type="button" class="' + (on ? 'is-on' : '') + '" data-pice="' + o[0] + '" aria-pressed="' + on + '">' + esc(o[1]) + '</button>';
        }).join('') + '</div>' +
      '</div>'
    );
  }
  var PCOL = ['#e0b25e', '#ff6fae', '#7fc0ff', '#7bd389', '#b6a4ff', '#ff9f68'];

  function viewAsk() {
    return (
      '<div class="lm-sheet">' + closeBtn(false) +
        '<p class="lm-kicker">' + esc(t('lounge.askTitle')) + '</p><h2 class="lm-sheet__h">' + esc(t('lounge.who')) + '</h2>' +
        '<div class="lm-mode" role="group"><button type="button" class="' + (ask.mode === 'solo' ? 'is-on' : '') + '" data-mode="solo" aria-pressed="' + (ask.mode === 'solo') + '">🙋 ' + esc(t('lounge.solo')) + '</button>' +
          '<button type="button" class="' + (ask.mode === 'group' ? 'is-on' : '') + '" data-mode="group" aria-pressed="' + (ask.mode === 'group') + '">👥 ' + esc(t('lounge.group')) + '</button></div>' +
        (ask.mode === 'group' ? '<p class="lm-lbl">' + esc(t('lounge.likes')) + ' <span>' + esc(t('lounge.likesHint')) + '</span></p>' : '') +
        ask.people.map(personCard).join('') +
        (ask.mode === 'group' && ask.people.length < 6 ? '<button type="button" class="lm-add" data-padd>' + esc(t('lounge.addPerson')) + '</button>' : '') +
        (ask.mode === 'solo' ? '<p class="lm-hint">' + esc(t('lounge.groupHint')) + '</p>' : '') +
        (ask.warn ? '<p class="lm-warn" role="alert">' + esc(t('lounge.pickSome')) + '</p>' : '') +
      '</div>' +
      '<div class="lm-foot-cta"><button type="button" class="lm-cta" data-ask>' + esc(t('lounge.showRec')) + '</button></div>'
    );
  }

  /** Koliko kandidat (okus ili miks) odgovara jednoj osobi. */
  function fit(c, p) {
    var s = 0, ok = [];
    p.kinds.forEach(function (k) {
      if (c.test(k)) { s += 3; ok.push(k); } else s -= 1;
    });
    var cool = c.prof.cooling;
    if (p.ice === 'none') { s += cool <= 2 ? 3 : cool <= 4 ? 0 : -3; if (cool <= 2) ok.push('ice:none'); }
    if (p.ice === 'low') { s += cool >= 3 && cool <= 6.5 ? 3 : cool < 3 ? 1 : -1; if (cool >= 3 && cool <= 6.5) ok.push('ice:low'); }
    if (p.ice === 'high') { s += cool >= 7 ? 3 : cool >= 5 ? 1 : -2; if (cool >= 7) ok.push('ice:high'); }
    return { s: s, ok: ok };
  }

  function candidates() {
    var list = inStock().filter(function (f) { return f.mixRole !== 'cooler'; }).map(function (f) {
      return { single: f, name: f.name, prof: f.profile, test: function (k) { return KINDS[k].test(f); }, fl: [f] };
    });
    houseMixes().forEach(function (m) {
      var fl = m.parts.map(function (p) { return p.f; });
      var prof = mixProfile(m.parts);
      list.push({ mix: m, name: m.name, prof: prof, house: true, fl: fl, test: function (k) {
        if (k === 'sweet') return prof.sweetness >= 7;
        if (k === 'fresh') return prof.freshness >= 7;
        return fl.some(function (f) { return KINDS[k].test(f) && (k !== 'ice'); });
      } });
    });
    return list;
  }

  function recommend() {
    var people = ask.mode === 'solo' ? ask.people.slice(0, 1) : ask.people;
    var ranked = candidates().map(function (c) {
      var fits = people.map(function (p) { return fit(c, p); });
      var sum = fits.reduce(function (a, x) { return a + x.s; }, 0);
      var min = Math.min.apply(null, fits.map(function (x) { return x.s; }));
      return { c: c, fits: fits, total: sum + (people.length > 1 ? 2 * min : 0) + (c.house ? 1.5 : 0) + (TAG[(c.single || {}).id] === 'top' ? 0.5 : 0) };
    }).sort(function (a, b) { return b.total - a.total; });
    return { people: people, best: ranked[0], second: ranked.filter(function (r) { return r !== ranked[0]; })[0] };
  }

  /** Dokaz za "zašto odgovara": sastojci ili brojka iz profila. */
  function evidence(c, k, used) {
    if (k === 'ice:none' || k === 'ice:low' || k === 'ice:high') return t('lounge.coolValue', { n: String(c.prof.cooling).replace('.', MSP.lang === 'bs' ? ',' : '.') });
    if (k === 'sweet') return t('lounge.sweetValue', { n: String(c.prof.sweetness).replace('.', MSP.lang === 'bs' ? ',' : '.') });
    if (k === 'fresh') return t('lounge.freshValue', { n: String(c.prof.freshness).replace('.', MSP.lang === 'bs' ? ',' : '.') });
    // sastojci koji pripadaju toj vrsti (npr. "tropsko": ananas, marakuja, banana; ne lubenica)
    var KIND_ILL = { tropic: ['ananas', 'banana', 'mango', 'marakuja', 'kokos', 'papaja', 'guava', 'lici', 'guanabana', 'kivi'],
      berry: ['malina', 'jagoda', 'borovnica', 'kupina', 'bobice', 'ribizla', 'ogrozd', 'visnja', 'brusnica'],
      citrus: ['limun', 'limeta', 'narandza', 'grejpfrut', 'mandarina', 'bergamot'] };
    var ings = [];
    used = used || [];
    c.fl.forEach(function (f) {
      if (!KINDS[k].test(f)) return;
      f.ingredients.forEach(function (i) {
        var n = L(i.name).toLowerCase();
        if (/ment|mint|hlađ|cool|led/.test(n) || ings.indexOf(n) !== -1) return;
        if (KIND_ILL[k] && KIND_ILL[k].indexOf(i.illustration) === -1) return;
        ings.push(n);
      });
    });
    // isti sastojci kao u prethodnom redu ne ponavljaju se
    var fresh = ings.filter(function (n) { return used.indexOf(n) === -1; });
    var out = (fresh.length ? fresh : ings).slice(0, 3);
    out.forEach(function (n) { used.push(n); });
    return out.join(', ');
  }
  function okLabel(k) {
    if (k === 'ice:none') return t('lounge.coolNone');
    if (k === 'ice:low') return t('lounge.iceLow') + ' ❄️';
    if (k === 'ice:high') return t('lounge.iceHigh') + ' ❄️';
    return kindLabel(k);
  }

  function candHash(c) { return c.mix ? 'miks=' + c.mix.id : 'okus=' + c.single.id; }
  function candWant(c) { return c.mix ? 'zelim=m:' + c.mix.id : 'zelim=' + c.single.id; }
  function candAvatar(c) { return c.mix ? mixAvatar(c.fl[0], c.fl[1]) : avatar(c.single); }
  function candWhy(c) { return c.mix ? mixWhy(c.mix) : [L(c.single.shortDescription)]; }

  function viewResult() {
    var r = ask.result;
    if (!r || !r.best) return null;
    var b = r.best, c = b.c, group = r.people.length > 1;
    var usedIngs = [];
    var fitLines = group
      ? r.people.map(function (p, i) {
        var nm = p.name || t('lounge.person', { n: i + 1 });
        var ok = b.fits[i].ok.map(okLabel);
        return '<li><span class="lm-dot" style="--c:' + PCOL[i % PCOL.length] + '">' + esc(nm.charAt(0).toUpperCase()) + '</span><b>' + esc(nm) + '</b><span>' + esc(ok.length ? ok.join(', ').toLowerCase() + ' ✓' : '~') + '</span></li>';
      }).join('')
      : b.fits[0].ok.map(function (k) {
        var ev = evidence(c, k, usedIngs);
        return '<li><span class="lm-dot lm-dot--ok">✓</span><b>' + esc(okLabel(k)) + '</b><span>' + esc(ev) + '</span></li>';
      }).join('');
    var s = r.second && r.second.c;
    return (
      '<div class="lm-sheet">' + closeBtn(false) +
        '<p class="lm-kicker">' + esc(group ? t('lounge.recForGroup', { n: r.people.length }) : t('lounge.recFor')) + '</p>' +
        '<a class="lm-win" href="#' + candHash(c) + '">' +
          '<span class="lm-win__top">' + candAvatar(c) + '<span><small>' + esc(c.mix ? t('lounge.houseMix', nm()) : brandName(c.single)) + '</small><b>' + esc(c.name) + '</b></span></span>' +
          (c.mix ? '<span class="lm-split"><i style="flex:' + c.mix.parts[0].pct + ';background:' + c.fl[0].ingredients[0].color + '"></i><i style="flex:' + c.mix.parts[1].pct + ';background:' + c.fl[1].ingredients[0].color + '"></i></span>' +
            '<span class="lm-split__l"><span>' + esc(c.fl[0].name + ' · ' + c.mix.parts[0].pct + '%') + '</span><span>' + esc(c.fl[1].name + ' · ' + c.mix.parts[1].pct + '%') + '</span></span>' : '') +
          '<span class="lm-win__why"><b>' + esc(t('lounge.why')) + ':</b> ' + esc(candWhy(c).join(' ')) + '</span>' +
        '</a>' +
        (fitLines ? '<ul class="lm-fit" role="list">' + fitLines + '</ul>' : '') +
        (s ? '<a class="lm-alt" href="#' + candHash(s) + '">' + candAvatar(s) + '<span><small>' + esc(t('lounge.second')) + '</small><b>' + esc(s.name) + '</b><span>' + esc(s.mix ? s.fl.map(function (f) { return f.name; }).join(' + ') : brandName(s.single) + ' · ' + ingNames(s.single, 3).join(', ')) + '</span></span></a>' : '') +
        '<button type="button" class="lm-link lm-again" data-again>' + esc(t('lounge.again')) + '</button>' +
      '</div>' +
      '<div class="lm-foot-cta">' + wantBtn(candWant(c), false) + '</div>'
    );
  }

  box.addEventListener('click', function (e) {
    var v = box.getAttribute('data-view');
    if (v === 'preporuka' && e.target.closest('[data-again]')) { history.replaceState(null, '', '#pitanje'); route(); return; }
    if (v !== 'pitanje') return;
    var pEl = e.target.closest('[data-p]'), p = pEl ? ask.people[+pEl.getAttribute('data-p')] : null;
    var m = e.target.closest('[data-mode]'), pk = e.target.closest('[data-pk]'), pi = e.target.closest('[data-pice]');
    if (m) {
      ask.mode = m.getAttribute('data-mode');
      if (ask.mode === 'group' && ask.people.length < 2) ask.people.push({ name: '', kinds: [], ice: '' });
    } else if (pk && p) { var k = pk.getAttribute('data-pk'); p.kinds = p.kinds.indexOf(k) === -1 ? p.kinds.concat(k) : p.kinds.filter(function (x) { return x !== k; }); ask.warn = false; }
    else if (pi && p) { var iv = pi.getAttribute('data-pice'); p.ice = p.ice === iv ? '' : iv; ask.warn = false; }
    else if (e.target.closest('[data-padd]')) ask.people.push({ name: '', kinds: [], ice: '' });
    else if (e.target.closest('[data-prem]') && pEl) ask.people.splice(+pEl.getAttribute('data-p'), 1);
    else if (e.target.closest('[data-ask]')) {
      var people = ask.mode === 'solo' ? ask.people.slice(0, 1) : ask.people;
      if (!people.some(function (x) { return x.kinds.length || x.ice; })) { ask.warn = true; }
      else { ask.warn = false; ask.result = recommend(); history.replaceState(null, '', '#preporuka'); route(); return; }
    } else return;
    var y = box.scrollTop;
    box.innerHTML = viewAsk();
    box.scrollTop = y;
  });
  box.addEventListener('input', function (e) {
    var el = e.target.closest('[data-pname]');
    if (!el) return;
    ask.people[+el.closest('[data-p]').getAttribute('data-p')].name = el.value.trim();
  });

  /* ------------------------------ ruter ------------------------------- */

  var lastFocus = null;
  function route() {
    var h = decodeURIComponent(location.hash.slice(1));
    var key = h.split('=')[0], val = h.slice(key.length + 1);
    var html = null;
    if (key === 'okus') { var f = V.flavorById(val); if (f && stock.indexOf(f) !== -1) html = viewFlavor(f); }
    else if (key === 'miks') { var hm = houseMixes().filter(function (x) { return x.id === val; })[0]; if (hm) html = viewMix(hm); }
    else if (key === 'par') { var q = val.split(','); var a = V.flavorById(q[0]), b = V.flavorById(q[1]); if (a && b) html = viewMix(pairMix(a, b, +q[2] || 60)); }
    else if (key === 'zelim') html = viewWant(val);
    else if (key === 'filteri') { draft = draft || null; html = viewFilters(); }
    else if (key === 'pitanje') html = viewAsk();
    else if (key === 'preporuka') html = viewResult() || viewAsk();
    if (key !== 'filteri') draft = null;
    if (!html) {
      if (!ov.hidden) {
        ov.hidden = true;
        document.documentElement.classList.remove('lm-lock');
        if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
      }
      if (!h) opened = 0;
      return;
    }
    if (ov.hidden) lastFocus = document.activeElement;
    box.setAttribute('data-view', key);
    box.innerHTML = html;
    box.scrollTop = 0;
    ov.hidden = false;
    ov.setAttribute('aria-label', (box.querySelector('h2') || {}).textContent || LG.name);
    document.documentElement.classList.add('lm-lock');
    var first = box.querySelector('.lm-x');
    if (first) first.focus({ preventScroll: true });
  }
  window.addEventListener('hashchange', route);

  /* ------------------------------ start ------------------------------- */

  renderTop();
  refresh(false);
  if (location.hash.length > 1) route();
})();
