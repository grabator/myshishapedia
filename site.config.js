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
  // vrijednost "token"). Prazno = na stranicama nema nikakve analitike. Vidi docs/UPUTSTVO.md.
  ANALYTICS_TOKEN: '2b3d031ad68d4922bbdc6bdd63777390',

  // Adresa servisa za forme (npr. https://formspree.io/f/abcdwxyz). Prazno = forme otvaraju
  // email program (mailto) sa već sastavljenom porukom. Vidi docs/UPUTSTVO.md.
  FORM_ENDPOINT: 'https://formspree.io/f/mzezwlrd',

  // Turnstile "Site Key" (javni ključ, Cloudflare → Turnstile → widget), za ocjene okusa i recepata.
  // Prazno = ocjenjivanje je na objavljenoj stranici isključeno. Na lokalnom serveru (localhost)
  // se uvijek koristi Cloudflareov testni ključ. Tajni ključ NIKAD ne ide ovdje. Vidi docs/UPUTSTVO.md, "Ocjene".
  TURNSTILE_SITE_KEY: '',


  // Datum zadnje izmjene politike privatnosti i uslova korištenja (GGGG-MM-DD).
  LEGAL_UPDATED: '2026-10-01',

  // Stranice poređenja ("X vs Y") koje Google smije prikazivati. Sve ostale rade normalno na sajtu,
  // ali imaju "noindex" i nisu u sitemap.xml (ima ih ~400 po jeziku, a skoro niko ih ne traži).
  // Ovdje su parovi koji su se već pojavljivali u Google pretrazi (Search Console, 10. 2026.).
  // Slug je isti u oba jezika: /bs/poredjenje/<slug>/ i /en/compare/<slug>/.
  INDEX_COMPARE_PAIRS: [
    'adalya-dubai-vs-adalya-lady-killer',
    'adalya-baku-nights-vs-adalya-swiss-bonbon',
    'adalya-swiss-bonbon-vs-adalya-ice-bonbon',
    'adalya-swiss-bonbon-vs-adalya-mint',
    'adalya-swiss-bonbon-vs-mazaya-gum-mint',
    'adalya-swiss-bonbon-vs-darkside-supernova',
    'adalya-ice-bonbon-vs-adalya-blue-ice',
    'adalya-lemon-cocktail-vs-al-fakher-lemon-mint',
    'adalya-mint-vs-al-fakher-double-apple',
    'al-fakher-mint-vs-mazaya-gum-mint',
    'al-fakher-mint-vs-al-fakher-lemon-mint',
    'al-fakher-lemon-mint-vs-mazaya-lemon-mint',
    'haze-double-bubble-vs-mazaya-gum-mint',
    'darkside-cola-vs-musthave-cola',
    'darkside-cola-vs-sebero-black-cola',
    'nakhla-double-apple-vs-revoshi-d-app-strong',
    'tangiers-cane-mint-vs-trifecta-peppermint-shake'
  ]
};

if (typeof module !== 'undefined' && module.exports) module.exports = SITE_CONFIG;
else if (typeof window !== 'undefined') window.SITE_CONFIG = SITE_CONFIG;
