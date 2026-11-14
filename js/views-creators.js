/*
 * MyShishapedia - stranice kreatora: spisak (/en/creators/), kreator (/en/creators/<id>/) i njegov miks
 * (/en/creators/<id>/<miks>/). Tekst kreatora je na engleskom; natpisi stranice su na jeziku stranice.
 *
 * Ovisi o: views.js, strings.js, data/creators.js (i data/brands.js, data/flavors.js za linkove).
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  var esc = V.esc;
  var icon = V.icon;

  var TX = {
    bs: {
      nav: 'Kreatori', eyebrow: 'Kreatori', listTitle: 'Miksovi kreatora',
      listLead: 'Stvarni miksovi ljudi koji pune posude svaki dan: okusi, procenti, posuda i način punjenja, uz njihov video.',
      listMetaTitle: 'Miksovi za nargilu od kreatora · recepti sa procentima | MyShishapedia',
      listMetaDesc: 'Miksovi za nargilu od pravih kreatora: okusi i procenti, posuda, savjeti za punjenje i video. Isprobaj i prati kreatore na Instagramu.',
      mixes: function (n) { return n === 1 ? '1 miks' : n + ' miksova'; },
      by: 'Miks od', follow: 'Prati na Instagramu', flavorsTitle: 'Okusi i procenti', bowl: 'Posuda', packTitle: 'Savjet za punjenje',
      aboutTitle: 'O miksu', words: 'Riječi kreatora', videoTitle: 'Pogledaj kako puni', play: 'Pogledaj video na Instagramu', playEmbed: 'Pusti video sa Instagrama',
      videoNote: 'Video se otvara na Instagramu kreatora.', videoNoteEmbed: 'Video se pušta sa Instagrama kreatora.', moreBy: 'Još miksova od', allCreators: 'Svi kreatori', card: 'Kartica miksa',
      cardNote: 'Slika miksa za story ili kraj videa.', download: 'Preuzmi karticu', inDb: 'u bazi', creatorMetaTitle: '{name} · miksovi za nargilu i savjeti za punjenje | MyShishapedia',
      creatorMetaDesc: 'Miksovi za nargilu od {name} ({country}): okusi sa procentima, posuda, savjeti za punjenje i video sa Instagrama.',
      mixMetaTitle: '{mix}: miks za nargilu od {name} | MyShishapedia', mixMetaDesc: '{mix} od {name}: {parts}. Okusi, savjet za punjenje i video.',
      join: 'Praviš miksove i snimaš ih? Javi nam se i dobij svoju stranicu na MyShishapediji.', joinCta: 'Javi se'
    },
    en: {
      nav: 'Creators', eyebrow: 'Creators', listTitle: 'Creator mixes',
      listLead: 'Real mixes from people who pack bowls every day: flavors, percentages, bowl and packing, with their video.',
      listMetaTitle: 'Hookah mixes by creators · recipes with percentages | MyShishapedia',
      listMetaDesc: 'Hookah mixes from real creators: flavors and percentages, the bowl, packing tips and a video. Try them and follow the creators on Instagram.',
      mixes: function (n) { return n === 1 ? '1 mix' : n + ' mixes'; },
      by: 'Mix by', follow: 'Follow on Instagram', flavorsTitle: 'Flavors and percentages', bowl: 'Bowl', packTitle: 'Packing tip',
      aboutTitle: 'About the mix', words: 'In the creator’s words', videoTitle: 'Watch how it’s packed', play: 'Watch the video on Instagram', playEmbed: 'Play the video from Instagram',
      videoNote: 'The video opens on the creator’s Instagram.', videoNoteEmbed: 'The video plays from the creator’s Instagram.', moreBy: 'More mixes by', allCreators: 'All creators', card: 'Mix card',
      cardNote: 'The mix as an image for a story or the end of a video.', download: 'Download the card', inDb: 'in our database', creatorMetaTitle: '{name} · hookah mixes and packing tips | MyShishapedia',
      creatorMetaDesc: 'Hookah mixes by {name} ({country}): flavors with percentages, the bowl, packing tips and the video from Instagram.',
      mixMetaTitle: '{mix}: hookah mix by {name} | MyShishapedia', mixMetaDesc: '{mix} by {name}: {parts}. Flavors, packing tip and video.',
      join: 'Do you make mixes and film them? Get in touch and get your own page on MyShishapedia.', joinCta: 'Get in touch'
    },
    de: {
      nav: 'Creator', eyebrow: 'Creator', listTitle: 'Mixe von Creatorn',
      listLead: 'Echte Mixe von Leuten, die jeden Tag Köpfe bauen: Sorten, Prozente, Kopf und Bautechnik, mit ihrem Video.',
      listMetaTitle: 'Shisha-Mixe von Creatorn · Rezepte mit Prozenten | MyShishapedia',
      listMetaDesc: 'Shisha-Mixe von echten Creatorn: Sorten und Prozente, Kopf, Tipps zum Bauen und ein Video. Ausprobieren und den Creatorn auf Instagram folgen.',
      mixes: function (n) { return n === 1 ? '1 Mix' : n + ' Mixe'; },
      by: 'Mix von', follow: 'Auf Instagram folgen', flavorsTitle: 'Sorten und Prozente', bowl: 'Kopf', packTitle: 'Tipp zum Bauen',
      aboutTitle: 'Über den Mix', words: 'In den Worten des Creators', videoTitle: 'So wird er gebaut', play: 'Video auf Instagram ansehen', playEmbed: 'Video von Instagram abspielen',
      videoNote: 'Das Video öffnet sich auf dem Instagram des Creators.', videoNoteEmbed: 'Das Video läuft über das Instagram des Creators.', moreBy: 'Mehr Mixe von', allCreators: 'Alle Creator', card: 'Mix-Karte',
      cardNote: 'Der Mix als Bild für eine Story oder das Ende eines Videos.', download: 'Karte herunterladen', inDb: 'in unserer Datenbank', creatorMetaTitle: '{name} · Shisha-Mixe und Tipps zum Bauen | MyShishapedia',
      creatorMetaDesc: 'Shisha-Mixe von {name} ({country}): Sorten mit Prozenten, Kopf, Tipps zum Bauen und das Video von Instagram.',
      mixMetaTitle: '{mix}: Shisha-Mix von {name} | MyShishapedia', mixMetaDesc: '{mix} von {name}: {parts}. Sorten, Tipp zum Bauen und Video.',
      join: 'Du baust Mixe und filmst sie? Melde dich und bekomme deine eigene Seite auf MyShishapedia.', joinCta: 'Melden'
    }
  };
  function tx(k) { var d = TX[MSP.lang] || TX.en; return d[k] != null ? d[k] : TX.en[k]; }
  function fill(s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : ''; }); }
  function L(v) { return v ? (v[MSP.lang] || v.en || v.bs || '') : ''; }

  V.creators = function () { return root.CREATORS || []; };
  V.creatorMixes = function () { return root.CREATOR_MIXES || []; };
  V.creatorById = function (id) { return V.creators().filter(function (c) { return c.id === id; })[0] || null; };
  V.mixesOfCreator = function (c) { return V.creatorMixes().filter(function (m) { return m.creator === c.id; }); };
  V.creatorUrl = function (c, lang) { return V.urlFor(lang || MSP.lang, 'creator', c.id); };
  V.creatorMixUrl = function (m, lang) { return V.urlFor(lang || MSP.lang, 'creator', m.creator) + encodeURIComponent(m.slug) + '/'; };
  V.creatorAsset = function (c, file) { return file ? '/creators/' + c.id + '/' + file : ''; };
  V.creatorNav = function () { return tx('nav'); };
  /** Brend iz baze po imenu (za link). */
  function brandByName(n) { var s = String(n).toLowerCase(); return (V.brands ? V.brands() : []).filter(function (b) { return b.name.toLowerCase() === s; })[0] || null; }
  function partFlavor(p) { return p.ref && V.flavorById ? V.flavorById(p.ref) : null; }
  V.creatorMixParts = function (m) { return m.parts.map(function (p) { return p.pct + '% ' + p.brand + ' ' + p.flavor; }).join(', '); };
  function igUrl(c) { return 'https://www.instagram.com/' + encodeURIComponent(c.instagram) + '/'; }
  function reelUrl(code) { return 'https://www.instagram.com/reel/' + code + '/'; }
  function reelCode(u) { var x = /instagram\.com\/(?:[^/]+\/)?(?:reel|p)\/([A-Za-z0-9_-]+)/.exec(u || ''); return x ? x[1] : ''; }

  /** Pogled odozgo na posudu sa sektorima u bojama okusa. */
  function bowlArt(m, cls) {
    var cx = 120, cy = 120, r = 92, a0 = -Math.PI / 2, out = '';
    m.parts.forEach(function (p) {
      var a1 = a0 + (p.pct / 100) * Math.PI * 2, large = a1 - a0 > Math.PI ? 1 : 0;
      var x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0), x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
      out += '<path d="M' + cx + ' ' + cy + 'L' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'A' + r + ' ' + r + ' 0 ' + large + ' 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'Z" fill="' + esc(p.color) + '"/>';
      a0 = a1;
    });
    return '<svg class="' + (cls || '') + '" viewBox="0 0 240 240" role="img" aria-label="' + esc(V.creatorMixParts(m)) + '">' +
      '<circle cx="120" cy="120" r="114" fill="#2a2523"/><circle cx="120" cy="120" r="104" fill="#1b1716"/>' + out +
      '<circle cx="120" cy="120" r="92" fill="url(#cmShade)"/><circle cx="120" cy="120" r="17" fill="#1b1716"/><circle cx="120" cy="120" r="9" fill="#000"/>' +
      '<defs><radialGradient id="cmShade"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient></defs></svg>';
  }

  function creatorHead(c, small) {
    return '<a class="crt-head' + (small ? ' crt-head--sm' : '') + '" href="' + V.creatorUrl(c) + '">' +
      (c.logo ? '<img class="crt-head__logo" src="' + esc(V.creatorAsset(c, c.logo)) + '" alt="' + esc(c.name) + '" width="1200" height="666" loading="lazy">' : '') +
      '<span class="crt-head__txt"><b>' + esc(c.name) + '</b><span>@' + esc(c.instagram) + ' · ' + esc(L(c.country)) + '</span></span></a>';
  }
  function followBtn(c) {
    return '<a class="btn btn--primary crt-follow" href="' + igUrl(c) + '" target="_blank" rel="noopener">' + igIcon() + '<span>' + esc(tx('follow')) + '</span></a>';
  }
  function igIcon() { return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/></svg>'; }

  function mixCard(m, i) {
    var c = V.creatorById(m.creator);
    return '<a class="crt-mix" href="' + V.creatorMixUrl(m) + '" style="--i:' + (i || 0) + '">' +
      '<span class="crt-mix__img">' + (m.photo ? '<img src="' + esc(V.creatorAsset(c, m.photo)) + '" alt="' + esc(m.name + ' · ' + c.name) + '" loading="lazy" width="1080" height="1428">' : bowlArt(m)) + '</span>' +
      '<span class="crt-mix__body"><b>' + esc(m.name) + '</b><span class="crt-mix__by">' + esc(tx('by')) + ' ' + esc(c.name) + '</span>' +
      '<span class="crt-split" aria-hidden="true">' + m.parts.map(function (p) { return '<i style="flex:' + p.pct + ';background:' + esc(p.color) + '"></i>'; }).join('') + '</span>' +
      '<span class="crt-mix__parts">' + esc(V.creatorMixParts(m)) + '</span></span></a>';
  }

  function pageList(crumbs) {
    var cards = V.creatorMixes().slice().sort(function (a, b) { return String(b.added).localeCompare(String(a.added)); }).map(mixCard).join('');
    return '<section class="phero crt-hero" aria-labelledby="crt-title">' + crumbs +
      '<div class="container"><p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(tx('eyebrow')) + '</p>' +
      '<h1 class="phero__title anim-in" style="--i:1" id="crt-title" tabindex="-1">' + esc(tx('listTitle')) + '</h1>' +
      '<p class="phero__lead anim-in" style="--i:2">' + esc(tx('listLead')) + '</p></div></section>' +
      '<section class="fsec"><div class="container"><div class="crt-people">' + V.creators().map(function (c) { return '<div class="crt-person">' + creatorHead(c) + '<p class="crt-person__n">' + esc(tx('mixes')(V.mixesOfCreator(c).length)) + '</p></div>'; }).join('') + '</div>' +
      '<div class="crt-grid">' + cards + '</div>' + joinBox() + '</div></section>';
  }
  function joinBox() {
    return '<p class="crt-join">' + esc(tx('join')) + ' <a href="' + V.url('suggest') + '">' + esc(tx('joinCta')) + '</a></p>';
  }

  function pageCreator(c, crumbs) {
    var list = V.mixesOfCreator(c);
    return '<section class="phero crt-hero" aria-labelledby="crt-title">' + crumbs +
      '<div class="container crt-profile">' +
        (c.logo ? '<img class="crt-profile__logo anim-in" style="--i:0" src="' + esc(V.creatorAsset(c, c.logo)) + '" alt="' + esc(c.name) + ' logo" width="1200" height="666">' : '') +
        '<div><p class="eyebrow anim-in" style="--i:1"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(tx('eyebrow')) + ' · ' + esc(L(c.country)) + '</p>' +
        '<h1 class="phero__title anim-in" style="--i:2;--len:' + Math.max.apply(null, c.name.split(/\s+/).map(function (w) { return w.length; })) + '" id="crt-title" tabindex="-1">' + esc(c.name) + '</h1>' +
        '<p class="phero__lead anim-in" style="--i:3">' + esc(L(c.bio)) + '</p>' +
        '<p class="anim-in crt-actions" style="--i:4">' + followBtn(c) + '<span class="crt-count">' + esc(tx('mixes')(list.length)) + '</span></p></div>' +
      '</div></section>' +
      '<section class="fsec"><div class="container"><div class="crt-grid">' + list.map(mixCard).join('') + '</div>' +
      '<p class="crt-back"><a href="' + V.url('creators') + '">' + icon('arrowLeft') + '<span>' + esc(tx('allCreators')) + '</span></a></p></div></section>';
  }

  function pageMix(m, crumbs) {
    var c = V.creatorById(m.creator), code = reelCode(m.video);
    var smoke = m.parts.map(function (p) { return p.color; }).join(',');
    var parts = m.parts.map(function (p) {
      var f = partFlavor(p), b = brandByName(p.brand);
      var name = '<span class="crt-part__brand">' + (b ? '<a href="' + V.brandUrl(b) + '">' + esc(p.brand) + '</a>' : esc(p.brand)) + '</span><span class="crt-part__name">' + (f ? '<a href="' + V.flavorUrl(f) + '">' + esc(p.flavor) + '</a>' : esc(p.flavor)) + '</span>';
      return '<li class="crt-part" style="--sw:' + esc(p.color) + '"><span class="crt-part__pct">' + p.pct + '%</span><span class="crt-part__bar"><i style="width:' + p.pct + '%"></i></span>' + name + (p.note ? '<span class="crt-part__note">' + esc(L(p.note)) + '</span>' : '') + '</li>';
    }).join('');
    var more = V.mixesOfCreator(c).filter(function (x) { return x !== m; });
    return '<article class="recipe crt-recipe" data-smoke="' + esc(smoke) + '">' +
      '<section class="rhero" aria-labelledby="crt-title">' + crumbs +
        '<div class="container rhero__inner">' +
          '<div class="rhero__copy">' +
            '<p class="eyebrow anim-in" style="--i:0"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(tx('by')) + ' ' + esc(c.name) + '</p>' +
            '<h1 class="phero__title rhero__title anim-in" style="--i:1;--len:' + Math.max.apply(null, m.name.split(/\s+/).map(function (w) { return w.length; })) + '" id="crt-title" tabindex="-1">' + esc(m.name) + '</h1>' +
            '<p class="rhero__parts anim-in" style="--i:2">' + esc(V.creatorMixParts(m)) + '</p>' +
            '<p class="phero__lead anim-in" style="--i:3">' + esc(L(m.description)) + '</p>' +
            '<ul class="rhero__meta anim-in" style="--i:4" role="list"><li><span class="rbadge">' + esc(tx('bowl')) + ': ' + esc(m.bowl) + '</span></li></ul>' +
            '<p class="rhero__actions anim-in" style="--i:5">' + followBtn(c) + (code ? '<a class="btn btn--ghost" href="#crt-video">' + icon('chevronDown') + '<span>' + esc(tx('videoTitle')) + '</span></a>' : '') + '</p>' +
            '<div class="anim-in" style="--i:6">' + creatorHead(c, true) + '</div>' +
          '</div>' +
          '<div class="rhero__stage crt-stage">' +
            (m.photo ? '<figure class="crt-photo"><img src="' + esc(V.creatorAsset(c, m.photo)) + '" alt="' + esc(m.name + ' packed in a ' + m.bowl + ', by ' + c.name) + '" width="1080" height="1428"></figure>' : '') +
            '<div class="rbowl crt-bowl" data-bowl>' + bowlArt(m, 'crt-bowl__svg') + '</div>' +
          '</div>' +
        '</div>' +
      '</section>' +
      '<section class="fsec" aria-labelledby="crt-flavors"><div class="container rgrid">' +
        '<div>' + V.sectionHead('01', tx('flavorsTitle'), '', 'crt-flavors') + '<ul class="crt-parts" role="list">' + parts + '</ul></div>' +
        '<div>' + V.sectionHead('02', tx('packTitle'), '', 'crt-pack') +
          '<div class="prose"><p>' + esc(L(m.packing)) + '</p></div>' +
          '<h3 class="rtips__title">' + esc(tx('words')) + '</h3><blockquote class="crt-quote"><p>“' + esc(L(m.description)) + '”</p><footer>' + esc(c.name) + '</footer></blockquote>' +
        '</div>' +
      '</div></section>' +
      (code ? '<section class="fsec fsec--alt" id="crt-video" aria-labelledby="crt-video-t"><div class="container crt-videowrap">' +
        V.sectionHead('03', tx('videoTitle'), '', 'crt-video-t') +
        '<div class="crt-video"' + (m.embed ? ' data-reel="' + esc(code) + '"' : '') + '>' +
          (m.embed ? '<button type="button" class="crt-video__play" data-play aria-label="' + esc(tx('playEmbed')) + '">' : '<a class="crt-video__play" href="' + esc(reelUrl(code)) + '" target="_blank" rel="noopener">') +
            (m.photo ? '<img src="' + esc(V.creatorAsset(c, m.photo)) + '" alt="" loading="lazy" width="1080" height="1428">' : '') +
            '<span class="crt-video__btn" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg></span><span class="crt-video__lbl">' + (m.embed ? esc(tx('playEmbed')) + '</span></button>' : igIcon() + esc(tx('play')) + '</span></a>') +
        '</div>' +
        '<p class="crt-video__note">' + igIcon() + '<span>' + esc(tx(m.embed ? 'videoNoteEmbed' : 'videoNote')) + ' <a href="' + esc(igUrl(c)) + '" target="_blank" rel="noopener">@' + esc(c.instagram) + '</a></span></p>' +
      '</div></section>' : '') +
      (m.card ? '<section class="fsec" aria-labelledby="crt-card-t"><div class="container crt-cardrow">' +
        '<div>' + V.sectionHead(code ? '04' : '03', tx('card'), '', 'crt-card-t') + '<p class="crt-card__note">' + esc(tx('cardNote')) + '</p><a class="btn btn--ghost" href="' + esc(V.creatorAsset(c, m.card)) + '" download>' + icon('download') + '<span>' + esc(tx('download')) + '</span></a></div>' +
        '<img class="crt-card__img" src="' + esc(V.creatorAsset(c, m.card)) + '" alt="' + esc(m.name + ' mix card') + '" width="1080" height="1920" loading="lazy">' +
      '</div></section>' : '') +
      '<section class="fsec fsec--alt" aria-labelledby="crt-more"><div class="container">' +
        (more.length ? '<h2 class="mix__h" id="crt-more">' + esc(tx('moreBy')) + ' ' + esc(c.name) + '</h2><div class="crt-grid">' + more.map(mixCard).join('') + '</div>' : '<h2 class="mix__h" id="crt-more">' + esc(tx('allCreators')) + '</h2>') +
        '<p class="crt-back"><a href="' + V.creatorUrl(c) + '">' + esc(c.name) + '</a> · <a href="' + V.url('creators') + '">' + esc(tx('allCreators')) + '</a></p>' + joinBox() +
      '</div></section>' +
    '</article>';
  }

  /** Za views.js: sadržaj, naslov i opis stranica kreatora. */
  V.pageCreators = function (desc, crumbs) {
    if (desc.page === 'creators') return { main: pageList(crumbs), title: tx('listMetaTitle'), description: tx('listMetaDesc') };
    if (desc.page === 'creator') {
      var c = desc.creator;
      return { main: pageCreator(c, crumbs), title: fill(tx('creatorMetaTitle'), { name: c.name }), description: V.clipText(fill(tx('creatorMetaDesc'), { name: c.name, country: L(c.country) })), ogImage: c.logo ? V.creatorAsset(c, c.logo) : '' };
    }
    var m = desc.mix, cr = V.creatorById(m.creator);
    return {
      main: pageMix(m, crumbs),
      title: fill(tx('mixMetaTitle'), { mix: m.name, name: cr.name }),
      description: V.clipText(fill(tx('mixMetaDesc'), { mix: m.name, name: cr.name, parts: m.parts.map(function (p) { return p.pct + '% ' + p.flavor; }).join(', ') })),
      ogImage: m.card ? V.creatorAsset(cr, m.card) : (m.photo ? V.creatorAsset(cr, m.photo) : '')
    };
  };
  V.crumbsCreators = function (desc, home) {
    var list = { name: tx('nav'), url: V.url('creators') };
    if (desc.page === 'creators') return [home, list];
    if (desc.page === 'creator') return [home, list, { name: desc.creator.name, url: V.creatorUrl(desc.creator) }];
    var c = V.creatorById(desc.mix.creator);
    return [home, list, { name: c.name, url: V.creatorUrl(c) }, { name: desc.mix.name, url: V.creatorMixUrl(desc.mix) }];
  };
})(typeof window !== 'undefined' ? window : globalThis);
