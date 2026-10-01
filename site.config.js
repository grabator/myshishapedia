/*
 * MyShishapedia - konfiguracija stranice (jedino mjesto za ove vrijednosti).
 *
 * SITE_URL: puna adresa stranice BEZ kose crte na kraju. Kad se kupi domen
 * ili promijeni adresa, promijeni je samo ovdje i ponovo pokreni `node build.mjs`.
 * Koristi se za canonical, hreflang, Open Graph, sitemap.xml i robots.txt.
 */
var SITE_CONFIG = {
  SITE_URL: 'https://myshishapedia.com',
  SITE_NAME: 'MyShishapedia',
  DEFAULT_LANG: 'en',          // x-default i jezik za posjetioce koji nisu sa ex-YU govornog područja
  LANGS: ['bs', 'en'],
  // Browser jezici koji idu na bosansku verziju kad posjetilac otvori "/"
  BS_BROWSER_LANGS: ['bs', 'hr', 'sr', 'sh'],
  AUTHOR_NAME: 'Graba',
  // Email se u HTML-u nikad ne ispisuje u čistom obliku (zaštita od spam robota).
  AUTHOR_EMAIL: 'grabafaceit@gmail.com',

  // Cloudflare Web Analytics token (Cloudflare → Analytics & Logs → Web Analytics → site → "JS snippet",
  // vrijednost "token"). Prazno = na stranicama nema nikakve analitike. Vidi README.
  ANALYTICS_TOKEN: '',

  // Adresa servisa za forme (npr. https://formspree.io/f/abcdwxyz). Prazno = forme otvaraju
  // email program (mailto) sa već sastavljenom porukom. Vidi README.
  FORM_ENDPOINT: '',


  // Datum zadnje izmjene politike privatnosti i uslova korištenja (GGGG-MM-DD).
  LEGAL_UPDATED: '2026-10-01'
};

if (typeof module !== 'undefined' && module.exports) module.exports = SITE_CONFIG;
else if (typeof window !== 'undefined') window.SITE_CONFIG = SITE_CONFIG;
