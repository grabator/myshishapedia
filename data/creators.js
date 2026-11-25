/*
 * MyShishapedia - kreatori i njihovi miksovi (stranice /en/creators/...).
 *
 * Kreator šalje miks (okusi + procenti, posuda, savjet za punjenje, kratak opis, link na Instagram video
 * i sliku gotovog bowla), a mi ga dodamo ovdje. Tekst kreatora je na engleskom i prikazuje se tako na
 * svim jezicima; naslovi i dugmad se prevode.
 *
 * CREATORS:
 *   id         dio adrese: /en/creators/<id>/
 *   name       ime koje se prikazuje
 *   instagram  korisničko ime bez @
 *   country    { bs, en, de }
 *   bio        { en } kratko o kreatoru (njegove riječi)
 *   logo       logo ili slika kreatora u static/creators/<id>/
 *
 * CREATOR_MIXES:
 *   id, creator     jedinstveni id miksa i id kreatora
 *   slug            dio adrese: /en/creators/<creator>/<slug>/  (na svim jezicima isti)
 *   name            ime miksa (kreator ga bira)
 *   parts           [{ brand, flavor, pct, color, ref? }] zbir 100; ref = id okusa iz data/flavors.js ako postoji
 *   bowl            posuda (tekst)
 *   packing         { en } savjet za punjenje
 *   description     { en } kreatorove riječi o miksu
 *   video           link na Instagram reel; dugme otvara reel na Instagramu (pregledi idu kreatoru)
 *   embed           true = video se pušta na stranici (samo ako kreator dozvoli ugrađivanje na Instagramu)
 *   photo           slika gotovog bowla u static/creators/<creator>/
 *   card            kartica miksa (JPG 1080x1920, pravi je scripts/creator-cards.mjs)
 *   added           datum objave (YYYY-MM-DD)
 */
window.CREATORS = [
  {
    id: 'shishalicious',
    name: 'Shishalicious Denmark',
    instagram: 'shishaliciousdenmark',
    country: { bs: 'Danska', en: 'Denmark', de: 'Dänemark', ru: 'Дания' },
    bio: { en: 'Hookah reviews, bowl packing, tobacco and mixes from Denmark. Tips, tricks and techniques for a better session.' },
    logo: 'logo.jpg'
  }
];

window.CREATOR_MIXES = [
  {
    id: 'shishalicious-wavey-fruity',
    creator: 'shishalicious',
    slug: 'wavey-fruity-mix',
    name: 'Wavey Fruity Mix',
    parts: [
      { brand: 'Al Waha', flavor: 'Traube Minze', ref: 'al-waha-grape-mint', pct: 40, color: '#7b4fa8', note: { bs: 'grožđe i menta', en: 'grape and mint', de: 'Traube und Minze', ru: 'виноград и мята' } },
      { brand: 'Blackburn', flavor: 'Etalon MLN', pct: 30, color: '#e3b23c', note: { bs: 'dinja', en: 'melon', de: 'Melone', ru: 'дыня' } },
      { brand: 'Darkside', flavor: 'Virgin Peach 2.0', pct: 20, color: '#f08a4b', note: { bs: 'breskva', en: 'peach', de: 'Pfirsich', ru: 'персик' } },
      { brand: 'Darkside', flavor: 'Forest Shake', pct: 10, color: '#b8344f', note: { bs: 'šumsko voće', en: 'forest berries', de: 'Waldbeeren', ru: 'лесные ягоды' } }
    ],
    bowl: 'Kaloud Samsaris Vitria II',
    packing: { en: 'Wave mix packing tip: pack your blonde leaf slightly lower than your dark leaf. Dark leaf handles more heat, and the different heights create a wave look from the side.' },
    description: { en: 'Sweet and nice fruit mix.' },
    video: 'https://www.instagram.com/reel/DfX1TWhx0LZ/',
    photo: 'wavey-fruity-mix.jpg',
    card: 'wavey-fruity-mix-card.jpg',
    added: '2026-11-13'
  },
  {
    id: 'shishalicious-perfekt',
    creator: 'shishalicious',
    slug: 'perfekt-mix',
    name: 'Perfekt Mix',
    parts: [
      { brand: 'Al Waha', flavor: 'Traube Minze', ref: 'al-waha-grape-mint', pct: 60, color: '#7b4fa8', note: { bs: 'grožđe i menta', en: 'grape and mint', de: 'Traube und Minze', ru: 'виноград и мята' } },
      { brand: 'Darkside', flavor: 'Beach Shake', pct: 20, color: '#3fb6c9' },
      { brand: 'Blackburn', flavor: 'Etalon MLN', pct: 20, color: '#e3b23c', note: { bs: 'dinja', en: 'melon', de: 'Melone', ru: 'дыня' } }
    ],
    bowl: 'Kaloud Samsaris Vitria II',
    packing: { en: 'Layer pack: I pack the blonde leaf in the bottom and the dark leaf on top, because dark leaf is more heat resistant than blonde. I let the coals sit for 8-10 minutes before I start smoking, so a crisp forms on top. That protects the tobacco underneath, and you get a much better session.' },
    description: { en: 'Perfekt mix.' },
    video: 'https://www.instagram.com/reel/DfNnZfixRMs/',
    photo: 'perfekt-mix.jpg',
    card: 'perfekt-mix-card.jpg',
    added: '2026-11-16'
  },
  {
    id: 'shishalicious-four-flavour',
    creator: 'shishalicious',
    slug: 'four-flavour-mix',
    name: 'Four Flavour Mix',
    parts: [
      { brand: 'Adalya Aqua Menta', flavor: 'Golden Anna', pct: 50, color: '#4fb39b' },
      { brand: 'Blackburn', flavor: 'Red Kiwi', pct: 25, color: '#c23b4a', note: { bs: 'kivi', en: 'kiwi', de: 'Kiwi', ru: 'киви' } },
      { brand: 'Darkside', flavor: 'Virgin Peach 2.0', pct: 12.5, color: '#f08a4b', note: { bs: 'breskva', en: 'peach', de: 'Pfirsich', ru: 'персик' } },
      { brand: 'Blackburn', flavor: 'Etalon MLN', pct: 12.5, color: '#e3b23c', note: { bs: 'dinja', en: 'melon', de: 'Melone', ru: 'дыня' } }
    ],
    bowl: 'Kaloud Samsaris Vitria II',
    packing: { en: 'I take all flavours and mix them together in a bowl before packing. It gives a more consistent flavour. I pack it with a Kaloud Sitra to get more use out of the tobacco, and I save around 30-40% tobacco using it.' },
    description: { en: 'Four flavour mix.' },
    video: 'https://www.instagram.com/reel/DgLZV97xY1U/',
    photo: 'four-flavour-mix.jpg',
    card: 'four-flavour-mix-card.jpg',
    added: '2026-11-25'
  }
];
