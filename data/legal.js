/*
 * MyShishapedia - politika privatnosti i uslovi korištenja (oba jezika).
 *
 * VAŽNO: ovo nije pravni savjet. Tekst opisuje šta stranica stvarno radi, ali ga
 * Graba treba pročitati i po potrebi prilagoditi (vidi README.md).
 * Datum zadnje izmjene je u site.config.js (LEGAL_UPDATED).
 *
 * Svaka sekcija: { title: {bs,en}, body: {bs:[...], en:[...]} }.
 * Red koji počinje sa "- " prikazuje se kao stavka liste.
 * {email} se zamijeni zaštićenim email linkom (kao u footeru).
 */
window.LEGAL = {
  privacy: {
    lead: {
      bs: 'Kratko i jasno: MyShishapedia ne koristi kolačiće za praćenje, ne pravi profile posjetilaca i ne prodaje podatke.',
      en: 'Short and simple: MyShishapedia does not use tracking cookies, does not build visitor profiles and does not sell data.'
    },
    sections: [
      {
        title: { bs: 'Statistika posjeta', en: 'Visit statistics' },
        body: {
          bs: [
            'Za osnovnu statistiku koristimo Cloudflare Web Analytics. Ta usluga ne koristi kolačiće (cookies) i ne prati pojedince od stranice do stranice ili između različitih web stranica.',
            'Vidimo samo zbirne podatke, na primjer koliko je puta neka stranica otvorena, sa koje stranice su posjetioci došli, iz koje su zemlje i sa kakvog uređaja. Iz toga se ne može saznati ko si.'
          ],
          en: [
            'For basic statistics we use Cloudflare Web Analytics. It does not use cookies and does not follow individuals from page to page or across other websites.',
            'We only see totals, such as how often a page was opened, which site visitors came from, which country and what kind of device. None of it tells us who you are.'
          ]
        }
      },
      {
        title: { bs: 'Šta se čuva u tvom browseru', en: 'What is stored in your browser' },
        body: {
          bs: [
            'Stranica u tvom browseru (localStorage) pamti samo ovo:',
            '- da si potvrdio/la da imaš 18 ili više godina, da te ne pitamo pri svakoj posjeti,',
            '- izabrani jezik (bosanski ili engleski).',
            'Tokom jedne posjete (sessionStorage) pamti se i da li je uvodna animacija već prikazana i boja prelaza između stranica. To se briše kad zatvoriš tab.',
            'Ovi podaci ostaju samo na tvom uređaju i nikad nam se ne šalju. Možeš ih obrisati u postavkama browsera (brisanje podataka za ovu stranicu).'
          ],
          en: [
            'In your browser (localStorage) the site only remembers:',
            '- that you confirmed you are 18 or older, so we do not ask on every visit,',
            '- your chosen language (Bosnian or English).',
            'During a single visit (sessionStorage) it also remembers whether the intro animation has already played and the color of the page transition. That is cleared when you close the tab.',
            'This data stays on your device and is never sent to us. You can remove it in your browser settings by clearing the data for this site.'
          ]
        }
      },
      {
        title: { bs: 'Forme: predloži okus i prijavi grešku', en: 'Forms: suggest a flavor and report an issue' },
        body: {
          bs: [
            'Kad pošalješ formu, šalje se samo ono što upišeš: podaci o okusu, tvoj komentar i, ako želiš, tvoj email. Email nije obavezan i koristi se samo da ti odgovorimo.',
            'Poruke se šalju preko vanjskog servisa za forme, koji ih prosljeđuje na naš email. Taj servis poruku obrađuje samo da bi je dostavio, prema svojim pravilima privatnosti.',
            'Ako servis za forme nije uključen, forma otvara tvoj email program sa već sastavljenom porukom, a ti sam/a odlučuješ da li ćeš je poslati.',
            'Poruke čuvamo samo koliko je potrebno da ih pročitamo i odgovorimo.'
          ],
          en: [
            'When you send a form, only what you type is sent: the flavor details, your comment and, if you want, your email. Email is optional and only used to reply to you.',
            'Messages go through an external form service that forwards them to our inbox. That service only handles the message to deliver it, under its own privacy policy.',
            'If the form service is not switched on, the form opens your email app with the message already written, and you decide whether to send it.',
            'We only keep messages as long as we need to read and answer them.'
          ]
        }
      },
      {
        title: { bs: 'Fontovi i hosting', en: 'Fonts and hosting' },
        body: {
          bs: [
            'Fontovi (Syne i Manrope) učitavaju se sa Google Fonts servera (fonts.gstatic.com). Pri tome tvoj browser Googleu šalje uobičajene tehničke podatke, kao što je IP adresa, jer bez toga ne može preuzeti fajl.',
            'Stranica je smještena na Cloudflare Pages. Cloudflare, kao i svaki hosting, obrađuje tehničke podatke o zahtjevima (npr. IP adresu) da bi isporučio stranicu i zaštitio je od napada.'
          ],
          en: [
            'The fonts (Syne and Manrope) are loaded from Google Fonts (fonts.gstatic.com). To download them, your browser sends Google the usual technical details, such as your IP address.',
            'The site is hosted on Cloudflare Pages. Like any host, Cloudflare processes technical request data (such as IP addresses) to deliver the site and protect it from attacks.'
          ]
        }
      },
      {
        title: { bs: 'Dijeljenje podataka', en: 'Sharing data' },
        body: {
          bs: [
            'Ne prodajemo podatke i ne dijelimo ih nikome u marketinške svrhe. Na stranici nema reklama ni reklamnih mreža.'
          ],
          en: [
            'We do not sell data and do not share it with anyone for marketing. The site has no ads and no ad networks.'
          ]
        }
      },
      {
        title: { bs: 'Kontakt', en: 'Contact' },
        body: {
          bs: [
            'Za sva pitanja o privatnosti, ili ako želiš da obrišemo poruku koju si poslao/la, piši Grabi: {email}.'
          ],
          en: [
            'For any privacy questions, or if you want us to delete a message you sent, write to Graba: {email}.'
          ]
        }
      }
    ]
  },

  terms: {
    lead: {
      bs: 'Ovo su jednostavna pravila korištenja stranice MyShishapedia.',
      en: 'These are the simple rules for using MyShishapedia.'
    },
    sections: [
      {
        title: { bs: 'Samo za punoljetne', en: 'Adults only' },
        body: {
          bs: ['MyShishapedia je informativna stranica o okusima duhana za nargilu, namijenjena isključivo osobama starijim od 18 godina.'],
          en: ['MyShishapedia is an informational site about hookah tobacco flavors, intended only for people over 18.']
        }
      },
      {
        title: { bs: 'Nepovezanost sa brendovima', en: 'No affiliation with brands' },
        body: {
          bs: ['Stranica nije povezana sa brendovima čiji se okusi opisuju, niti je od njih sponzorisana. Nazivi brendova i okusa pripadaju njihovim vlasnicima i koriste se samo da bi se okus opisao.'],
          en: ['The site is not affiliated with, endorsed or sponsored by the brands whose flavors are described. Brand and flavor names belong to their owners and are only used to describe the flavors.']
        }
      },
      {
        title: { bs: 'Tačnost podataka', en: 'Accuracy' },
        body: {
          bs: [
            'Sastav, profil i opisi okusa su naša najbolja procjena, na osnovu dostupnih opisa i iskustva. Mogu se razlikovati od stvarnog proizvoda, a proizvođači ponekad mijenjaju recepture.',
            'Recepti miksova i savjeti za pripremu su opšti prijedlozi, ne precizna uputstva. Ako primijetiš grešku, prijavi je i biće ispravljena.'
          ],
          en: [
            'Flavor compositions, profiles and descriptions are our best estimate, based on available descriptions and experience. They may differ from the actual product, and manufacturers sometimes change their recipes.',
            'Mix recipes and setup tips are general suggestions, not precise instructions. If you spot a mistake, report it and it will be fixed.'
          ]
        }
      },
      {
        title: { bs: 'Bez prodaje i reklame', en: 'No sales or advertising' },
        body: {
          bs: ['Stranica ne prodaje duhanske proizvode, ne reklamira ih i ne poziva na pušenje. Nema linkova za kupovinu ni plaćenih preporuka.'],
          en: ['The site does not sell or advertise tobacco products and does not encourage smoking. There are no shopping links and no paid recommendations.']
        }
      },
      {
        title: { bs: 'Upozorenje o zdravlju', en: 'Health warning' },
        body: {
          bs: ['Duhan za nargilu sadrži nikotin, koji izaziva ovisnost. Pušenje nargile nije bezopasno i šteti zdravlju.'],
          en: ['Hookah tobacco contains nicotine, which is addictive. Smoking hookah is not harmless and damages your health.']
        }
      },
      {
        title: { bs: 'Sadržaj stranice', en: 'Site content' },
        body: {
          bs: ['Tekstovi, ilustracije i dizajn stranice su originalni. Slobodno dijeli linkove i kartice za dijeljenje, ali nemoj kopirati sadržaj na drugu stranicu bez dozvole.'],
          en: ['The site texts, illustrations and design are original. Feel free to share links and share cards, but please do not copy the content to another site without permission.']
        }
      },
      {
        title: { bs: 'Izmjene i kontakt', en: 'Changes and contact' },
        body: {
          bs: ['Ova pravila se mogu povremeno mijenjati; datum zadnje izmjene je na vrhu stranice. Pitanja: {email}.'],
          en: ['These rules may change from time to time; the date of the last change is at the top of the page. Questions: {email}.']
        }
      }
    ]
  }
};
