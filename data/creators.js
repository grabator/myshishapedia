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
 *   video           link na Instagram reel (ugrađuje se, pregledi idu kreatoru)
 *   photo           slika gotovog bowla u static/creators/<creator>/
 *   card            kartica miksa (JPG 1080x1920, pravi je scripts/creator-cards.mjs)
 *   added           datum objave (YYYY-MM-DD)
 */
window.CREATORS = [
  {
    id: 'shishalicious',
    name: 'Shishalicious Denmark',
    instagram: 'shishaliciousdenmark',
    country: { bs: 'Danska', en: 'Denmark', de: 'Dänemark' },
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
      { brand: 'Al Waha', flavor: 'Traube Minze', ref: 'al-waha-grape-mint', pct: 40, color: '#7b4fa8', note: { bs: 'grožđe i menta', en: 'grape and mint', de: 'Traube und Minze' } },
      { brand: 'Blackburn', flavor: 'Etalon MLN', pct: 30, color: '#e3b23c', note: { bs: 'dinja', en: 'melon', de: 'Melone' } },
      { brand: 'Darkside', flavor: 'Virgin Peach 2.0', pct: 20, color: '#f08a4b', note: { bs: 'breskva', en: 'peach', de: 'Pfirsich' } },
      { brand: 'Darkside', flavor: 'Forest Shake', pct: 10, color: '#b8344f', note: { bs: 'šumsko voće', en: 'forest berries', de: 'Waldbeeren' } }
    ],
    bowl: 'Kaloud Samsaris Vitria II',
    packing: { en: 'Wave mix packing tip: pack your blonde leaf slightly lower than your dark leaf. Dark leaf handles more heat, and the different heights create a wave look from the side.' },
    description: { en: 'Sweet and nice fruit mix.' },
    video: 'https://www.instagram.com/shishaliciousdenmark/reel/DfX1TWhx0LZ/',
    photo: 'wavey-fruity-mix.jpg',
    card: 'wavey-fruity-mix-card.jpg',
    added: '2026-11-13'
  }
];
