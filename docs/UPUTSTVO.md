# MyShishapedia - uputstvo za rad sa projektom

Enciklopedija okusa za nargilu, na bosanskom i engleskom. Otkrij od čega je napravljen okus koji upravo pušiš.

Stranica ima:
- okuse (sastojci, profil, ideje za mikseve) i stranicu svih okusa sa pretragom, filterima i sortiranjem;
- kolekcije, poređenje okusa, recepte miksova, okus dana, mikser i kviz;
- vodič za pripremu nargile, rječnik pojmova, opremu i stranicu "O nama";
- globalnu pretragu, kartice za dijeljenje (Instagram story), forme "Predloži okus" i "Prijavi grešku";
- politiku privatnosti i uslove korištenja.

Nema ocjena, mape barova ni korisničkih računa.

Sve je čist HTML, CSS i JavaScript, bez frameworka i bez npm paketa. Build korak (`node build.mjs`) iz istih
skripti napravi gotove HTML stranice za oba jezika. Tako je sav tekst odmah u HTML-u (dobro za Google i za rad
bez JavaScripta), a JavaScript u browseru samo dodaje dim, nargilu, animacije i interakcije.

---

## Koraci za objavu

Redom, od projekta na računaru do javne stranice na myshishapedia.com.

### 1. Postaviti projekat na GitHub

```bash
git push -u origin main
```

(ili grana koju koristiš; folder `dist/` se ne šalje, u `.gitignore` je). Prije prvog commita instaliraj git hook,
vidi "Git: autor commitova" niže.

### 2. Kupiti domen myshishapedia.com na Cloudflareu

[dash.cloudflare.com](https://dash.cloudflare.com) → **Domain Registration → Register Domains** → `myshishapedia.com`.
Domen kupljen na Cloudflareu je odmah u tvom Cloudflare nalogu, sa Cloudflare DNS-om.

### 3. Napraviti Cloudflare Pages projekat povezan sa GitHubom

1. **Workers & Pages → Create → Pages → Connect to Git** → izaberi repozitorij `grabator/myshishapedia`.
2. Postavke builda:
   - **Framework preset:** None
   - **Build command:** `node build.mjs`
   - **Build output directory:** `dist`
   - **Node verzija:** čita se iz fajla `.node-version` (20). Ako treba, dodaj i varijablu `NODE_VERSION = 20`.
3. **Save and Deploy.** Svaki novi push na glavnu granu automatski napravi novi build i objavu, a druge grane
   dobiju svoju probnu adresu (preview).

Build sam kopira u `dist/`:
- `_headers`: sigurnosna zaglavlja i Content-Security-Policy (dozvoljava samo Google Fonts, Cloudflare Web
  Analytics i servis za forme), dugo keširanje CSS/JS/podataka (imaju verziju `?v=hash` u adresi) i kratko za HTML;
- `_redirects`: adrese bez jezika (npr. `/okus/adalya-dubai/`) vode na jezičku verziju;
- `404.html`: u korijenu, u `/bs/` i u `/en/` (Cloudflare prikaže najbliži, pa je 404 na pravom jeziku).

Čiste adrese (`/bs/okus/adalya-dubai/` → `index.html` u tom folderu) Cloudflare Pages radi sam.

### 4. Povezati domen sa Pages projektom

1. U Pages projektu: **Custom domains → Set up a custom domain** → `myshishapedia.com` → Cloudflare sam doda DNS zapis.
2. Ponovi za `www.myshishapedia.com`.
3. Da `www` vodi na glavni domen: **Rules → Redirect Rules → Create rule** (šablon "Redirect from WWW to root"):
   ako je host `www.myshishapedia.com`, preusmjeri (301) na `https://myshishapedia.com${uri.path}` sa zadržanim upitom.
4. HTTPS certifikat Cloudflare izda sam. Provjeri da `SITE_URL` u `site.config.js` ostane `https://myshishapedia.com`.

### 5. Uključiti Web Analytics i upisati ANALYTICS_TOKEN

1. Cloudflare → **Analytics & Logs → Web Analytics → Add a site** → upiši `myshishapedia.com`.
2. Izaberi ručno dodavanje ("JS snippet"). U kodu koji Cloudflare prikaže nađi vrijednost `"token": "..."`.
3. Upiši je u `site.config.js`:
   ```js
   ANALYTICS_TOKEN: 'tvoj-token',
   ```
   ili, bez izmjene fajla, u Pages projektu: **Settings → Variables and Secrets** → `ANALYTICS_TOKEN`.
4. Novi build ubaci skriptu (sa `defer`, ne usporava stranicu) i dozvoli je u CSP-u. Dok je token prazan, nema
   nikakve analitike. Na lokalnom serveru (`localhost`) skripta se nikad ne učitava.

Napomena: ako u Pages projektu uključiš Web Analytics jednim klikom (automatsko ubacivanje), ne treba ti token.
Tada samo provjeri da Cloudflare ubacuje skriptu sa `static.cloudflareinsights.com`; ako CSP to blokira, upiši token
kao gore da bi build dodao dozvolu.

### 6. Napraviti račun na servisu za forme i upisati FORM_ENDPOINT

Preporuka: [Formspree](https://formspree.io) (besplatni plan je dovoljan za početak).

1. Napravi račun, potvrdi email (`grabafaceit@gmail.com`, na njega stižu poruke).
2. **New form** → ime npr. "MyShishapedia". Dobiješ adresu tipa `https://formspree.io/f/abcdwxyz`.
3. Upiši je u `site.config.js` (`FORM_ENDPOINT: 'https://formspree.io/f/abcdwxyz'`) ili kao varijablu `FORM_ENDPOINT` u Pages projektu.
4. U Formspree postavkama forme uključi zaštitu od spama; skriveno polje `_gotcha` stranica već šalje.

Dok je `FORM_ENDPOINT` prazan, forme otvaraju email program sa već sastavljenom porukom na Grabin email.
Build sam doda adresu servisa u CSP (`connect-src`, `form-action`).

### 7. Prijaviti stranicu u Google Search Console i poslati sitemap

1. [search.google.com/search-console](https://search.google.com/search-console) → **Add property → Domain** → `myshishapedia.com`.
2. Google da TXT zapis: Cloudflare → domen → **DNS → Records → Add record → TXT** (ime `@`, vrijednost od Googlea). Klikni **Verify**.
3. **Sitemaps** → upiši `sitemap.xml` → **Submit** (puna adresa `https://myshishapedia.com/sitemap.xml`).
   Sitemap već sadrži obje jezičke verzije svake stranice (hreflang). Stranice pretrage i prijave greške su
   `noindex` i nisu u sitemapu.
4. Za brzu provjeru jedne stranice: **URL inspection → Request indexing**.

### 8. Šta Graba treba provjeriti

Lista je na kraju ovog fajla: "Šta treba provjeriti prije objave" (sastavi okusa, recepti, tekstovi O nama,
privatnost i uslovi).

---

## Struktura

```
/build.mjs              build: pravi dist/ (stranice, sitemap, robots, 404, _headers, _redirects, indeks pretrage)
                        i provjerava linkove, meta tagove i podatke
/serve.mjs              lokalni server za dist/, radi kao Cloudflare Pages (_headers, _redirects, 404 po jeziku)
/site.config.js         SITE_URL, email, ANALYTICS_TOKEN, FORM_ENDPOINT, LEGAL_UPDATED
/.node-version          verzija Nodea za Cloudflare Pages (20)
/favicon.svg
/static/                kopira se u dist/: og-image.png, manifest.webmanifest, icons/ (PNG ikone)
/scripts/git-hooks/     kopija git hooka commit-msg (vidi "Git: autor commitova")
/css/style.css          svi stilovi
/js/strings.js          SVI tekstovi interfejsa, bs i en
/js/views.js            HTML svih stranica (koristi ga i build i browser)
/js/views-more.js       HTML: kolekcije, poređenje, recepti, okus dana
/js/views-extra.js      HTML: svi okusi, privatnost, uslovi, forme, stranica pretrage
/js/illustrations.js    SVG ilustracije sastojaka, nargila, ugalj, boje i kontrast
/js/effects.js          dim (canvas), "Povuci dim", prelazi, parallax, animacije
/js/pages.js            ponašanje podstranica
/js/app.js              pokretanje u browseru: meni, jezik, provjera godina, prelazi, analitika
/js/search.js           globalna pretraga (Ctrl+K)
/js/forms.js            forme (predloži okus, prijavi grešku)
/js/share.js            kartica za dijeljenje (canvas)
/data/*.js              okusi, rječnik, vodič, oprema, kviz, O nama, kolekcije, recepti, pravni tekstovi
/dist/                  REZULTAT builda (ne mijenjaj ručno, ne ide na GitHub)
```

### Adrese

| Bosanski | Engleski |
| --- | --- |
| `/bs/` | `/en/` |
| `/bs/okusi/` (svi okusi) | `/en/flavors/` |
| `/bs/okus/adalya-dubai/` | `/en/flavor/adalya-dubai/` |
| `/bs/kolekcije/` i `/bs/kolekcije/ledeni-okusi/` | `/en/collections/` i `/en/collections/icy-flavors/` |
| `/bs/poredjenje/` i `/bs/poredjenje/<a>-vs-<b>/` | `/en/compare/` i `/en/compare/<a>-vs-<b>/` |
| `/bs/recepti/` i `/bs/recepti/ledena-laguna/` | `/en/mixes/` i `/en/mixes/frozen-lagoon/` |
| `/bs/mikser/` | `/en/mixer/` |
| `/bs/kviz/` | `/en/quiz/` |
| `/bs/vodic/` | `/en/guide/` |
| `/bs/rjecnik/` i `/bs/rjecnik/hmd/` | `/en/glossary/` i `/en/glossary/hmd/` |
| `/bs/oprema/` | `/en/gear/` |
| `/bs/o-nama/` | `/en/about/` |
| `/bs/predlozi-okus/` | `/en/suggest-flavor/` |
| `/bs/prijavi-gresku/?okus=...` (noindex) | `/en/report-issue/?flavor=...` (noindex) |
| `/bs/pretraga/?q=...` (noindex) | `/en/search/?q=...` (noindex) |
| `/bs/privatnost/` | `/en/privacy/` |
| `/bs/uslovi/` | `/en/terms/` |

- `/` samo bira jezik: prvo zapamćeni izbor, inače jezik browsera (bs, hr, sr, sh idu na `/bs/`, sve ostalo na `/en/`).
  Bez JavaScripta prikaže dva obična linka.
- Stanje u adresi (za dijeljenje; canonical je uvijek adresa bez parametara):
  - mikser: `/en/mixer/?a=adalya-dubai&b=adalya-love-66&r=60`;
  - poređenje: `/en/compare/?a=...&b=...`;
  - vodič: `/bs/vodic/?korak=3` (engleski `?step=3`);
  - svi okusi: `/en/flavors/?q=mint&tag=vocni&col=icy&sort=cooling`.
- Stari linkovi sa `#` (npr. `/#/okus/adalya-dubai`) automatski se preusmjere na nove adrese.

---

## Build i lokalno pokretanje

Treba samo [Node.js](https://nodejs.org) 18 ili noviji.

```bash
node build.mjs
```

```bash
node serve.mjs
```

pa otvori `http://localhost:5173`. `serve.mjs` radi kao Cloudflare Pages (šalje `_headers` sa CSP-om, poštuje
`_redirects` i 404 po jeziku), pa se greške vide prije objave. Nakon izmjene ponovo pokreni `node build.mjs`.

`ANALYTICS_TOKEN` i `FORM_ENDPOINT` se mogu zadati i kao varijable okruženja; one imaju prednost nad
`site.config.js` (isto važi za `SITE_URL`, npr. za probnu `*.pages.dev` adresu).

Build na kraju sam provjeri:

- da svaki interni link i sidro (`#...`) vodi na nešto što postoji (uključujući meni, footer, forme i ikone),
- da svaka stranica ima tačno jedan `h1`, canonical i hreflang (osim noindex stranica),
- da su naslovi i opisi jedinstveni i da opis nema više od 155 znakova,
- da nijedan tekst ne nedostaje u `strings.js` (za oba jezika),
- da email nije upisan u HTML kao običan tekst,
- da kolekcije nisu prazne i da recepti imaju ispravne okuse i omjer (zbir 100%).

Ako nešto ne valja, ispiše listu grešaka i završi neuspješno (Cloudflare tada ne objavi pokvarenu verziju).

> Prvi put se pojavljuje pitanje "Da li imaš 18 ili više godina?". Odgovor se pamti u `localStorage`
> (ključ `msp-age-ok`). Da ponovo vidiš pitanje, obriši taj ključ u DevTools (Application → Local Storage).
> Izabrani jezik je u ključu `msp-lang`.

---

## Git: autor commitova

Svi commitovi imaju samo tebe kao autora (git `user.name` / `user.email`). Dvije zaštite:

1. `.claude/settings.json` u projektu isključuje dodavanje potpisa alata u commitove i PR-ove:
   ```json
   { "attribution": { "commit": "", "pr": "" } }
   ```
2. Git hook `commit-msg` iz poruke briše redove `Co-Authored-By: Claude...`, `Generated with [Claude Code]...`
   i `Claude-Session:...`. Hookovi se ne šalju na GitHub, pa je kopija u `scripts/git-hooks/`. Instalacija
   (jednom, na svakom računaru gdje radiš sa projektom; radi u Git Bashu, macOS-u i Linuxu):
   ```bash
   cp scripts/git-hooks/commit-msg .git/hooks/commit-msg && chmod +x .git/hooks/commit-msg
   ```
   Ili, da git uvijek koristi hookove iz projekta:
   ```bash
   git config core.hooksPath scripts/git-hooks
   ```

---

## Kako dodati novi okus (oba jezika)

Otvori `data/flavors.js` i dodaj objekat u niz `window.FLAVORS`. Redoslijed u nizu je redoslijed na
početnoj i za "Prethodni / Sljedeći okus". Sve što se čita na stranici ima verziju za oba jezika
(`{ bs: ..., en: ... }`); ako engleski nedostaje, prikazuje se bosanski.

```js
{
  id: 'adalya-hawaii',                 // jedinstven; isti u obje adrese: /bs/okus/<id>/ i /en/flavor/<id>/
  brand: 'Adalya',
  name: 'Hawaii',
  shortDescription: {                  // jedna rečenica; koristi se i kao meta opis (do 155 znakova)
    bs: 'Ananas i mango sa laganom mentom.',
    en: 'Pineapple and mango with a light touch of mint.'
  },
  description: {                       // 2-3 kratka pasusa, svojim riječima
    bs: ['Prvi pasus.', 'Drugi pasus.'],
    en: ['First paragraph.', 'Second paragraph.']
  },
  ingredients: [
    // illustration = ključ iz js/illustrations.js; color = glavna boja; intensity = 1-10
    { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f5c542', intensity: 8 },
    { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb020', intensity: 7 },
    { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#3fc08a', intensity: 4 }
  ],
  profile: { sweetness: 7, freshness: 7, fruitiness: 9, cooling: 4, strength: 6 },   // 0-10
  tags: ['vocni', 'tropski', 'mint'],  // ključevi; nazivi na oba jezika su u js/strings.js → tags
  tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
  mood: 'honey',                       // opcionalno: 'night', 'honey', 'frost' ili 'ice' (atmosfera stranice)
  palette: {                           // boje stranice okusa
    primary: '#f5c542', secondary: '#ffb020', accent: '#3fc08a',
    background: '#ffd66b', text: '#2a1a00',
    water: '#9ee6ff'                   // opcionalno: boja vode u nargili
  },
  mixIdeas: {
    bs: ['Sa Love 66 za ljetniji miks.'],
    en: ['With Love 66 for a more summery bowl.']
  },
  similar: ['adalya-dubai', 'adalya-lady-killer']   // id-jevi drugih okusa (dodaj i obrnuto!)
}
```

Zatim `node build.mjs`. Novi okus se sam pojavi na početnoj, u pretrazi (na oba jezika), filterima,
mikseru, kvizu, sitemap-u i u "Slični okusi" tamo gdje si ga dodao.

Napomene:

- **Slični okusi:** dodaj novi id i u `similar` postojećih okusa kojima je sličan, da veza ide u oba smjera.
- **Kontrast je automatski.** Ako `palette.text` nema dovoljan kontrast (4.5:1), sam se potamni ili posvijetli.
- **Novi tag:** dodaj ključ u `tags` okusa i naziv na oba jezika u `js/strings.js` (`tags` pod `bs` i pod `en`).
- **Kviz** ne zna ništa o pojedinačnim okusima: uspoređuje odgovore sa `profile` i `tags`, pa novi okus
  automatski ulazi u rezultate. Provjera u konzoli: `MSP.Pages.quiz.score(['puno','slatko','voce','srednji','ljeto'])`.
- **Provjera podataka:** nepostojeća ilustracija, pogrešan id u `similar` ili dupli id daju upozorenje u
  konzoli browsera koje počinje sa `[flavors]`.
- **Nova ilustracija sastojka:** u `js/illustrations.js`, objekat `ILLUSTRATIONS`: funkcija koja prima boju i
  vraća SVG na platnu 200x200. Za gradijente uvijek `uid('...')`; sitne oblike crtaj kao jedan `<path>`.

---

## Kolekcije okusa

Kolekcije su u `data/collections.js`. Okusi ulaze u kolekciju **automatski**, prema pravilu
(`rule`) koje gleda `profile` i `tags` okusa, pa novi okus sam dođe na pravo mjesto:

```js
{
  id: 'icy',
  slug: { bs: 'ledeni-okusi', en: 'icy-flavors' },   // adresa na oba jezika
  mood: 'ice',                                        // atmosfera: 'ice', 'night', 'tropical' ili 'calm'
  title: { bs: 'Ledeni okusi', en: 'Icy flavors' },
  short: { bs: 'Kratak opis za karticu.', en: 'Short card text.' },
  intro: { bs: ['2-3 rečenice uvoda.'], en: ['2-3 intro sentences.'] },
  rule: { anyOf: [{ min: { cooling: 8 } }, { anyTags: ['ledeni'] }] },
  include: [],                  // okusi koji su UVIJEK u kolekciji (id-jevi)
  exclude: [],                  // okusi koji NIKAD nisu u kolekciji
  palette: { primary: '#9fe3ff', secondary: '#e6f7ff', accent: '#2f8fd6', background: '#0b2c4a', text: '#eef9ff', smoke: ['#ffffff', '#e3f6ff'] }
}
```

Pravila (sva navedena moraju važiti):

| Polje | Značenje |
| --- | --- |
| `min: { cooling: 8 }` | vrijednost profila mora biti najmanje ovoliko |
| `max: { cooling: 6, strength: 6 }` | vrijednost profila smije biti najviše ovoliko |
| `anyTags: ['nocni']` | okus mora imati bar jedan od tagova |
| `allTags: ['vocni', 'slatki']` | okus mora imati sve tagove |
| `anyOf: [{...}, {...}]` | dovoljno je da vrijedi jedno od pod-pravila |

Trenutna pravila:
- **Ledeni:** menta/hlađenje od 8 naviše ili tag `ledeni`.
- **Noćni:** tag `nocni`.
- **Tropski:** tag `tropski`.
- **Za početnike:** menta/hlađenje i jačina najviše 6, a voćnost ili slatkoća bar 7.
  Ova kolekcija ima i dodatni tekst (`note`) i link na vodič (`guideLink: true`).

Nova kolekcija dobije svoju stranicu na oba jezika, karticu na početnoj i na pregledu kolekcija, i oznaku
na stranicama svojih okusa. Build javi grešku ako je kolekcija prazna ili joj fali tekst na nekom jeziku.
Nova atmosfera (`mood`) traži malo CSS-a u `css/style.css` (vidi `.cmood--ice`, `.cmood--night` ...).

---

## Recepti miksova

Recepti su u `data/mixes.js`. Svaki recept ima **tačno dva okusa** iz baze i omjer čiji je zbir 100
(svaki dio 20-80%, korak 5), da bi se "Otvori u mikseru" otvorio tačno sa tim omjerom. Build to provjerava.

```js
{
  id: 'frozen-lagoon',
  slug: { bs: 'ledena-laguna', en: 'frozen-lagoon' },
  name: { bs: 'Ledena laguna', en: 'Frozen Lagoon' },   // originalno ime, bez zaštićenih naziva
  parts: [{ flavor: 'adalya-dubai', pct: 70 }, { flavor: 'adalya-ice-bonbon', pct: 30 }],
  layout: 'sectors',          // 'mixed' (izmiješano) ili 'sectors' (u sektorima)
  strength: 'medium',         // 'light', 'medium' ili 'strong'
  tags: ['vocni', 'ledeni'],  // ključevi iz js/strings.js → tags
  featured: true,             // prikaži na početnoj (najbolje tačno 3 recepta)
  description: { bs: ['...', '...'], en: ['...', '...'] },
  tips: { bs: ['...'], en: ['...'] }   // opšti savjeti, bez izmišljenih preciznih brojki
}
```

Stranica recepta sama napravi:
- posudu odozgo sa sektorima tačno po omjeru;
- stopljenu paletu (nagnutu prema dominantnom okusu);
- dim koji mijenja boje, spojene sastojke i kombinovani profil.

Recept se pojavljuje i na stranicama svojih okusa ("Recepti sa ovim okusom") i, ako je `featured`, na početnoj.

---

## Okus dana

Okus dana se računa u browseru iz **lokalnog datuma** posjetioca, bez servera, pa svi koji otvore
stranicu istog dana vide isti okus:

1. Dan u kalendaru se pretvori u broj dana (`V.dayNumber`).
2. Dani su podijeljeni u cikluse dužine N (N = broj okusa). Svaki ciklus je jedna izmiješana
   permutacija svih okusa (Fisher-Yates sa seedom = broj ciklusa), pa se **nijedan okus ne ponavlja dok
   se ne prođu svi**. Ako bi prvi okus novog ciklusa bio isti kao posljednji prethodnog, zamijene se.
3. Kad se doda novi okus, N se promijeni i redoslijed se sam preračuna; sve i dalje radi.

Build u HTML upiše okus za dan builda, a JavaScript ga zamijeni okusom dana. Kartica ima fiksnu visinu,
pa zamjena ne pomjera ostatak stranice. Odbrojavač pokazuje vrijeme do ponoći, a u ponoć se okus sam
promijeni. Uz okus se preporuči recept u kojem je taj okus (prvo `featured`).
Kod je u `js/views-more.js` (`V.fotdPick`) i `js/app.js` (`mountFotd`).

---

## Poređenje okusa

- `/bs/poredjenje/` i `/en/compare/` su interaktivni: biraš bilo koja dva okusa, a link se dijeli preko
  `?a=...&b=...`; canonical je bez parametara.
- Build pravi i **zasebne SEO stranice samo za parove "sličnih okusa"** (polje `similar` u
  `data/flavors.js`). Svaki par samo jednom, u redoslijedu kao u `flavors.js`
  (npr. `adalya-swiss-bonbon-vs-adalya-ice-bonbon`, nikad obrnuto). Novi par nastaje čim dodaš okus u `similar`.
- Tekst razlike ("Ukratko") se generiše iz podataka (`V.compareText`): razlike u profilu od 2 ili više,
  zajednički sastojci i sastojci koje ima samo jedan okus. Radi za bilo koji par.

---

### Tekstovi interfejsa

Svi tekstovi (meni, dugmad, naslovi, meta naslovi i opisi stranica) su u `js/strings.js`, pod `bs` i `en`,
sa istim ključevima. Build prijavi grešku ako neki ključ fali.


---

## Globalna pretraga

- Ikona lupe u headeru i u mobilnom meniju, prečice **Ctrl+K / Cmd+K** i **/** (na početnoj i na stranici svih
  okusa "/" fokusira njihovu pretragu).
- Traži okuse, kolekcije, recepte, pojmove iz rječnika, korake vodiča, opremu, stranice poređenja i ostale stranice.
- Ignoriše velika/mala slova i dijakritike, podnosi manje greške ("dubaj", "lav 66") i radi na oba jezika
  ("mint" i "menta").
- Indeks pravi build (`dist/search/bs.json` i `en.json`); učitava se tek kad se pretraga prvi put otvori.
- Rezerva bez prozora: `/bs/pretraga/?q=` i `/en/search/?q=` (noindex).

## Kartica za dijeljenje

Dugme "Podijeli" je na stranici okusa, recepta, u mikseru i na rezultatu kviza.
- Slika se crta u browseru (canvas), u formatu Story 1080×1920 ili kvadrat 1080×1080.
- Na mobitelu ide direktno u Instagram ili WhatsApp preko Web Share API-ja (ako ga browser podržava), a inače
  "Preuzmi sliku" i "Kopiraj link".
- Adresa na kartici je uvijek sa pravim domenom (iz canonical linka).
- Crtanje je u `js/share.js` (`draw`).

## Forme i pravne stranice

- "Predloži okus" (`/bs/predlozi-okus/`) i "Prijavi grešku" (dugme na svakoj stranici okusa, sa već izabranim okusom).
- Podešavanje slanja: vidi korak 6 u "Koraci za objavu".
- Tekstovi politike privatnosti i uslova su u `data/legal.js`, a datum zadnje izmjene u `site.config.js`
  (`LEGAL_UPDATED`). Tekst opisuje šta stranica stvarno radi:
  - statistika bez kolačića;
  - localStorage samo za potvrdu godina i jezik;
  - forme sa neobaveznim emailom;
  - Google Fonts i Cloudflare hosting.

  **Ovo nije pravni savjet:** Graba treba pročitati i po potrebi prilagoditi.

---

## SEO, sigurnost i performanse (šta je urađeno)

- **Svaka javna stranica:**
  - pravi HTML sa svim tekstom;
  - jedinstven naslov i opis (do 155 znakova);
  - canonical, hreflang (bs, en, x-default = en), Open Graph i Twitter kartice;
  - jedan `h1`.
- **Strukturirani podaci:** JSON-LD `WebSite` na početnoj, `BreadcrumbList` na podstranicama; vidljivi breadcrumbs.
- **Sitemap i robots:** `sitemap.xml` sa hreflang parovima (bez noindex stranica), `robots.txt` koji pokazuje na
  sitemap, 404 na oba jezika.
- **Ikone:** favicon (SVG i PNG 32), apple-touch-icon 180, ikone 192 i 512 i `manifest.webmanifest`.
- **Sigurnosna zaglavlja (`_headers`):**
  - Content-Security-Policy, bez `unsafe-inline` za skripte (inline skripte su dozvoljene hashom koji računa build);
  - X-Frame-Options, Referrer-Policy, Permissions-Policy, nosniff.
- **Fontovi i skripte:** `font-display: swap` i `preload`; sve skripte sa `defer`.
- **Učitavanje efekata:** dim i efekti kreću nakon prvog iscrtavanja, a iza prozora za godine tek nakon potvrde.
  Sekcije ispod prvog ekrana koriste `content-visibility: auto`.
- **Bez JavaScripta:** sav sadržaj se vidi; email ima rezervni zapis i nigdje nije u HTML-u kao običan tekst.
- **Pristupačnost:**
  - kontrast najmanje 4.5:1;
  - rad tastaturom;
  - ARIA za pretragu, forme i modale;
  - `prefers-reduced-motion` gasi dim i animacije.

### Rezultati Lighthousea (lokalno, 1. 10. 2026.)

- **Accessibility, Best Practices, SEO:** 100 na svim testiranim stranicama, mobilni i desktop.
- **Performance, desktop:** 99-100.
- **Performance, mobilni (simulirani spori telefon):**
  - u mirnom mjerenju 86-93 (O nama 92, privatnost 93, recepti 93, okusi 91, početna 87-89, svi okusi 86);
  - dok je računar bio opterećen drugim programima, rezultati su varirali naniže (i referentna stranica je tada
    pala sa 92 na 87-91).
- **Šta realno utiče na mobilni rezultat:** veličina početnog HTML-a (inline SVG ilustracije) i fontovi.
- **Na Cloudflareu** (HTTP/2, Brotli) rezultat bi trebao biti malo bolji nego lokalno (lokalni server: HTTP/1.1 i
  gzip). Provjeri nakon objave na [pagespeed.web.dev](https://pagespeed.web.dev).

---

## Kako podesiti dim

Podešavanja su na vrhu `js/effects.js`, u `SMOKE_CONFIG` (`scale`, `areaPerParticle`, `minParticles` /
`maxParticles`, `mobileFactor`, `lowEndFactor`, `handRadius` / `handForce`, `trailEvery`).
Dim iz posude po stranici: `startHookah(..., { bowlSmoke: { rate, alpha } })` u `js/app.js`.
Boje dima se računaju iz palete okusa (`computeTheme` u `js/views.js`, polje `smoke`).

---

## Šta treba provjeriti prije objave

### Sastav i profil okusa (procjene)

Profil = slatkoća / svježina / voćnost / menta-hlađenje / jačina.

Novi okusi (sve PROVJERITI):

- [ ] **Adalya Mint: sastav (PROVJERITI).** Uneseno: menta 9. Profil 2 / 10 / 0 / 8 / 6.
- [ ] **Adalya Blue Ice: sastav (PROVJERITI).** Uneseno: borovnica 8, mentol 9. Profil 6 / 9 / 7 / 9 / 7.
- [ ] **Adalya Cherry Mint: sastav (PROVJERITI).** Uneseno: višnja 8, menta 6. Profil 6 / 7 / 8 / 5 / 6.
- [ ] **Adalya Raspberry: sastav (PROVJERITI).** Uneseno: malina 9. Profil 7 / 5 / 9 / 1 / 5.
- [ ] **Adalya Double Melon: sastav (PROVJERITI, izvori nisu jasni).** Uneseno: medena dinja 8, lubenica 7. Profil 8 / 7 / 9 / 1 / 5.
- [ ] **Adalya Tynky Wynky: sastav (PROVJERITI).** Uneseno: grejpfrut 7, limeta 6, marakuja 6, menta 5. Profil 6 / 9 / 8 / 5 / 6.

Ranije dodani:

- [ ] **Adalya Lady Killer: sastav (PROVJERITI).** Uneseno: mango 8, dinja 6, jagoda 6, mentol 7. Profil 7 / 8 / 9 / 7 / 7.
- [ ] **Adalya Berlin Nights: sastav (PROVJERITI).** Uneseno: breskva 8, med 6, menta 5. Profil 8 / 6 / 7 / 5 / 6.
- [ ] **Adalya Angel Lips: sastav (PROVJERITI).** Uneseno: lubenica 8, kupina 7, menta 5. Profil 7 / 7 / 9 / 5 / 6.
- [ ] Adalya Dubai: ananas 8, banana 6, menta 5. Profil 7 / 7 / 8 / 5 / 6.
- [ ] Adalya Love 66: lubenica 8, marakuja 7, medena dinja 6, menta 6. Profil 7 / 8 / 9 / 6 / 7.
- [ ] Adalya Baku Nights: breskva 7, dinja 6, narandža 6, slatki pepermint 6. Profil 8 / 7 / 7 / 6 / 6.
  Izvori se razlikuju oko tačnog voća.
- [ ] Adalya Swiss Bonbon: mentol 9, menta 8, voćni bombon 5, bilje 3. Profil 5 / 10 / 4 / 10 / 7.
- [ ] Adalya Ice Bonbon: mješavina bombona 7, ledeni pepermint 9, mentol 10. Profil 8 / 10 / 4 / 10 / 7.
- [ ] Tip duhana ("Virginia (svijetli list)") za sve okuse, tagovi, opisi i ideje za mikseve na oba jezika.

### Recepti miksova (PRIJEDLOZI: Graba treba isprobati i potvrditi)

Svih 11 recepata su prijedlozi napravljeni na osnovu sastojaka i profila. Treba ih isprobati, pa
potvrditi ili promijeniti omjer, opis, savjete i jačinu u `data/mixes.js`:

- [ ] Ledena laguna / Frozen Lagoon: Dubai 70% + Ice Bonbon 30% (srednji, sektori)
- [ ] Ponoćni med / Midnight Honey: Berlin Nights 50% + Baku Nights 50% (lagan, izmiješano)
- [ ] Bobice na ledu / Berries on Ice: Angel Lips 70% + Ice Bonbon 30% (srednji, izmiješano)
- [ ] Tropski zalazak / Tropical Sunset: Lady Killer 50% + Dubai 50% (srednji, izmiješano)
- [ ] Polarni bombon / Polar Candy: Ice Bonbon 50% + Swiss Bonbon 50% (jak, sektori)
- [ ] Ljetni neon / Summer Neon: Love 66 60% + Swiss Bonbon 40% (srednji, izmiješano)
- [ ] Crveni koktel / Crimson Cocktail: Love 66 60% + Angel Lips 40% (lagan, izmiješano)
- [ ] Zvjezdani voćnjak / Starlit Orchard: Baku Nights 60% + Love 66 40% (srednji, sektori)
- [ ] **Novo:** Jutarnja rosa / Morning Dew: Raspberry 70% + Mint 30% (lagan, izmiješano)
- [ ] **Novo:** Voćna limunada / Fruit Lemonade: Tynky Wynky 60% + Double Melon 40% (lagan, izmiješano)
- [ ] **Novo:** Višnjin led / Cherry Frost: Cherry Mint 70% + Blue Ice 30% (srednji, sektori)

### Kolekcije

- [ ] Da li raspodjela okusa po kolekcijama odgovara tvom iskustvu. Primjeri:
  - Lady Killer je i u ledenim i u tropskim;
  - "Za početnike" sada ima 8 okusa;
  - Mint je u ledenim zbog hlađenja 8.

  Ako treba, koristi `include` / `exclude` u `data/collections.js`.

### Stranica "O nama" (rečenice za prilagoditi)

Tekst je u `data/about.js`. Namjerno nema izmišljenih činjenica o autoru. Pročitaj i prepravi svojim riječima:

- [ ] "Stranicu je napravio Graba. Ideja je jednostavna: kad pušiš neki okus, trebalo bi da lako vidiš šta je u njemu..."
  (možeš dodati kako je nastala ideja, od kada pušiš nargilu i slično, ako želiš).
- [ ] "Ako nešto ne štima, javi i biće ispravljeno." (da li želiš primati prijedloge emailom).
- [ ] Engleska verzija istih rečenica.
- [ ] Email za kontakt je u `site.config.js` (`AUTHOR_EMAIL`).

### Politika privatnosti i uslovi korištenja (NIJE pravni savjet)

- [ ] Pročitaj `data/legal.js` (oba jezika) i provjeri da opis odgovara stvarnom stanju:
  - servis za forme;
  - Web Analytics;
  - Google Fonts.
- [ ] Ako stranicu posjećuju ljudi iz EU, razmisli da tekst pogleda neko ko poznaje GDPR.
- [ ] Datum `LEGAL_UPDATED` u `site.config.js` promijeni kad god promijeniš tekst.

### Brojke u vodiču i opremi (opšte preporuke, provjeriti)

- [ ] Vodič, korak 1 "Sipaj vodu u vazu": donji kraj stuba 2 do 3 cm ispod površine vode.
- [ ] Vodič, korak 6 "Upali ugljeve": kokosovi ugljevi se pale oko 8 do 10 minuta.
- [ ] Vodič, korak 7 "Postavi ugljeve i zagrij posudu": za početak obično tri uglja uz ivicu.
- [ ] Oprema, ocjene od 1 do 5 (ugljevi na slici):
  - Posude (intenzitet / trajanje / lakoća za početnike): klasična 3 / 2 / 3, phunnel 4 / 5 / 5, vortex 5 / 4 / 3.
  - Ugljevi (čistoća okusa / trajanje / lakoća paljenja): kokosove kocke 5 / 5 / 2, kokosovi ravni 5 / 3 / 3, brzopaleći 1 / 2 / 5.
  - Toplota (kontrola / jednostavnost / čistoća): folija 2 / 3 / 2, HMD 5 / 5 / 4.

### Ostalo

- [ ] `SITE_URL` u `site.config.js` je `https://myshishapedia.com`.
- [ ] `ANALYTICS_TOKEN` i `FORM_ENDPOINT` upisani (koraci 5 i 6).
- [ ] Nakon objave: probna poruka kroz obje forme, provjera da stiže na email.
- [ ] Nakon objave: sitemap poslan u Google Search Console.
