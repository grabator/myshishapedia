/*
 * MyShishapedia - članci (oba jezika).
 *
 * Svaki članak:
 *   id         kratko ime (isto na oba jezika)
 *   slug       dio adrese po jeziku: /bs/clanci/<slug.bs>/ i /en/articles/<slug.en>/
 *   published  datum objave (GGGG-MM-DD), ide u sitemap i u podatke za Google
 *   eyebrow    mala oznaka iznad naslova
 *   title      naslov (h1)
 *   metaTitle  naslov u Google rezultatima (bez " | MyShishapedia", to se doda samo)
 *   metaDescription  opis u Google rezultatima (najviše 155 znakova)
 *   lead       uvod ispod naslova
 *   sections   [{ h, p: { bs: [...], en: [...] }, block? }]
 *              u tekstu [[id|tekst]] postaje link na pojam u rječniku;
 *              block je dio koji se sastavlja iz podataka sajta:
 *                'beginnerPicks'  okusi iz kolekcije "Za početnike"
 *                'brandCompare'   Adalya i Al Fakher jedan pored drugog (brojke iz data/flavors.js)
 *              links: [{ page, label }] dugmad na kraju sekcije (page iz V.SEG, npr. 'guide', 'tips')
 *   faq        [{ q, a }] česta pitanja na kraju članka
 *
 * Brojke i tvrdnje u tekstu su opšte poznate ili izračunate iz podataka sajta; trajanje sesije je okvirno.
 */
window.ARTICLES = [
  {
    id: 'pocetnici',
    slug: { bs: 'okusi-za-pocetnike', en: 'best-hookah-flavors-for-beginners' },
    published: '2026-11-04',
    eyebrow: { bs: 'Za početnike', en: 'For beginners' },
    title: { bs: 'Najbolji okusi za nargilu za početnike', en: 'The best hookah flavors for beginners' },
    metaTitle: { bs: 'Najbolji okusi za nargilu za početnike', en: 'Best hookah flavors for beginners: mild shisha to start with' },
    metaDescription: {
      bs: 'Koji okus za nargilu izabrati ako tek počinješ: blagi voćni okusi na svijetlom listu, malo mente i savjeti da prva nargila ne bude gorka.',
      en: 'Which hookah flavor to pick if you are just starting: mild fruit flavors on blonde leaf, a little mint, and tips so your first bowl is not harsh.'
    },
    lead: {
      bs: 'Prva nargila treba biti blaga, ukusna i bez grebanja u grlu. Evo kako izabrati okus i šta probati prvo.',
      en: 'Your first hookah should be mild, tasty and easy on the throat. Here is how to choose a flavor and what to try first.'
    },
    sections: [
      {
        h: { bs: 'Šta okus čini dobrim za početnike', en: 'What makes a flavor good for beginners' },
        p: {
          bs: [
            'Najvažnije je da duhan bude na [[svijetli-list|svijetlom listu]] (Virginia). Blaži je i ima manje nikotina od [[tamni-list|tamnog lista]], pa ne udari u glavu i ne grebe grlo.',
            'Drugo je okus: voće koje svi znaju, kao lubenica, grožđe, jagoda ili jabuka, uvijek je sigurniji izbor od neobičnih kombinacija. Malo mente je dobrodošlo, jer čini dim lakšim, ali jako ledeni okusi znaju biti previše za prvi put.'
          ],
          en: [
            'Most important is that the tobacco is on [[svijetli-list|blonde leaf]] (Virginia). It is milder and has less nicotine than [[tamni-list|dark leaf]], so it does not hit your head or scratch your throat.',
            'Second is the flavor itself: fruit everyone knows, like watermelon, grape, strawberry or apple, is always a safer pick than unusual blends. A little mint is welcome because it makes the smoke feel lighter, but very icy flavors can be too much the first time.'
          ]
        }
      },
      {
        h: { bs: 'Okusi koje vrijedi probati prvo', en: 'Flavors worth trying first' },
        p: {
          bs: ['Ovo su okusi iz naše kolekcije Za početnike: blagi, na svijetlom listu i lako se puše. Klikni na bilo koji da vidiš sastojke, profil i ideje za mikseve.'],
          en: ['These come from our For beginners collection: mild, on blonde leaf and easy to smoke. Tap any of them to see the ingredients, profile and mix ideas.']
        },
        block: 'beginnerPicks'
      },
      {
        h: { bs: 'Kako da prva nargila ne bude gorka', en: 'How to keep your first bowl from tasting harsh' },
        p: {
          bs: [
            'Većina loših prvih iskustava nije do okusa, nego do toplote. Duhan stavi rastresito, ne nabijaj ga, i ostavi malo prostora ispod folije ili HMD-a.',
            'Kreni sa tri uglja uz ivicu, sačekaj nekoliko minuta da se duhan zagrije i povlači lagano. Ako dim postane oštar ili gorak, skini jedan ugalj.'
          ],
          en: [
            'Most bad first experiences are not about the flavor but about the heat. Pack the tobacco loosely, do not press it down, and leave a little space under the foil or HMD.',
            'Start with three coals around the edge, give the tobacco a few minutes to warm up and pull gently. If the smoke turns sharp or bitter, take one coal off.'
          ]
        },
        links: [{ page: 'guide' }, { page: 'tips' }]
      }
    ],
    faq: [
      {
        q: { bs: 'Koji je najblaži okus za nargilu?', en: 'What is the mildest hookah flavor?' },
        a: { bs: 'Najblaži su voćni okusi na svijetlom listu, bez jakog mentola, npr. lubenica, grožđe ili jagoda. Okusi na tamnom listu su redovno jači.', en: 'The mildest are fruit flavors on blonde leaf without strong menthol, such as watermelon, grape or strawberry. Dark leaf flavors are usually stronger.' }
      },
      {
        q: { bs: 'Da li je mentol dobar za početnike?', en: 'Is menthol good for beginners?' },
        a: { bs: 'Malo mente čini dim lakšim, ali jako ledeni okusi mogu biti previše za prvi put. Bolje je krenuti od voća sa malo mente.', en: 'A little mint makes the smoke feel lighter, but very icy flavors can be too much at first. It is better to start with fruit and a little mint.' }
      },
      {
        q: { bs: 'Svijetli ili tamni list za početak?', en: 'Blonde or dark leaf to start with?' },
        a: { bs: 'Svijetli list. Blaži je i ima manje nikotina, pa je prva sesija ugodnija.', en: 'Blonde leaf. It is milder and has less nicotine, so your first session is more pleasant.' }
      }
    ]
  },
  {
    id: 'adalya-al-fakher',
    slug: { bs: 'adalya-ili-al-fakher', en: 'adalya-vs-al-fakher' },
    published: '2026-11-04',
    eyebrow: { bs: 'Poređenje brendova', en: 'Brand comparison' },
    title: { bs: 'Adalya ili Al Fakher: koja je razlika?', en: 'Adalya vs Al Fakher: what is the difference?' },
    metaTitle: { bs: 'Adalya ili Al Fakher: razlika između dva brenda za nargilu', en: 'Adalya vs Al Fakher: the difference between two shisha brands' },
    metaDescription: {
      bs: 'Adalya i Al Fakher jedan pored drugog: porijeklo, list, karakter okusa i koji brend izabrati, uz brojke iz naše enciklopedije okusa.',
      en: 'Adalya and Al Fakher side by side: origin, leaf, flavor style and which brand to pick, with numbers from our flavor encyclopedia.'
    },
    lead: {
      bs: 'Dva brenda koja ćeš naći u skoro svakom lounge baru, a potpuno su različita. Evo po čemu.',
      en: 'Two brands you will find in almost every lounge, and they could hardly be more different. Here is how.'
    },
    sections: [
      {
        h: { bs: 'Ukratko', en: 'In short' },
        p: {
          bs: [
            'Al Fakher je brend iz Ujedinjenih Arapskih Emirata i za mnoge je sinonim za klasičnu nargilu: dvostruka jabuka, menta, grožđe sa mentom, limun sa mentom.',
            'Adalya dolazi iz Turske i poznata je po razigranim kombinacijama voća, bombona i leda, kao što su Love 66, Lady Killer ili Ice Bonbon.',
            'Oba brenda koriste [[svijetli-list|svijetli list]], pa su blagi i dobri i za početnike.'
          ],
          en: [
            'Al Fakher is a brand from the United Arab Emirates and, for many people, a byword for classic hookah: double apple, mint, grape mint, lemon mint.',
            'Adalya comes from Turkey and is known for playful blends of fruit, candy and ice, like Love 66, Lady Killer or Ice Bonbon.',
            'Both brands use [[svijetli-list|blonde leaf]], so both are mild and fine for beginners.'
          ]
        }
      },
      {
        h: { bs: 'Jedan pored drugog', en: 'Side by side' },
        p: {
          bs: ['Brojke su prosjeci okusa ovih brendova u našoj enciklopediji, na skali od 0 do 10. To su procjene, ali dobro pokazuju razliku u karakteru.'],
          en: ['The numbers are averages across these brands\' flavors in our encyclopedia, on a 0 to 10 scale. They are estimates, but they show the difference in character well.']
        },
        block: 'brandCompare'
      },
      {
        h: { bs: 'Koji izabrati?', en: 'Which one should you pick?' },
        p: {
          bs: [
            'Ako voliš tradicionalan okus nargile, jednostavne i prepoznatljive okuse, uzmi Al Fakher. Dvostruka jabuka i limun sa mentom su dobro mjesto za početak.',
            'Ako voliš slatko, voćno i ledeno, i želiš nešto zanimljivije, uzmi Adalyu. Love 66 i Lady Killer su među najpoznatijim njenim okusima.',
            'Najbolje je probati oba: zato i postoji poređenje, gdje možeš staviti bilo koja dva okusa jedan pored drugog.'
          ],
          en: [
            'If you like a traditional hookah taste and simple, familiar flavors, go for Al Fakher. Double apple and lemon mint are a good place to start.',
            'If you like sweet, fruity and icy, and want something more playful, go for Adalya. Love 66 and Lady Killer are among its best-known flavors.',
            'The best way is to try both: that is what the comparison is for, where you can put any two flavors side by side.'
          ]
        },
        links: [{ page: 'compare' }, { page: 'brands' }]
      }
    ],
    faq: [
      {
        q: { bs: 'Da li je Adalya jača od Al Fakhera?', en: 'Is Adalya stronger than Al Fakher?' },
        a: { bs: 'Ne bitno. Oba brenda su na svijetlom listu i spadaju u blage duhane. Razlika je u okusu, ne u jačini.', en: 'Not really. Both brands are on blonde leaf and count as mild tobaccos. The difference is in flavor, not strength.' }
      },
      {
        q: { bs: 'Odakle su Adalya i Al Fakher?', en: 'Where are Adalya and Al Fakher from?' },
        a: { bs: 'Adalya je iz Turske, a Al Fakher iz Ujedinjenih Arapskih Emirata.', en: 'Adalya is from Turkey, and Al Fakher is from the United Arab Emirates.' }
      },
      {
        q: { bs: 'Mogu li miješati Adalyu i Al Fakher?', en: 'Can I mix Adalya and Al Fakher?' },
        a: { bs: 'Možeš. Oba su na svijetlom listu, pa se dobro slažu. Npr. Al Fakher Mint uz bilo koji Adalya voćni okus doda svježinu.', en: 'Yes. Both are on blonde leaf, so they blend well. For example, Al Fakher Mint adds freshness to any Adalya fruit flavor.' }
      }
    ]
  },
  {
    id: 'trajanje',
    slug: { bs: 'koliko-traje-nargila', en: 'how-long-does-a-hookah-last' },
    published: '2026-11-04',
    eyebrow: { bs: 'Sesija', en: 'Session' },
    title: { bs: 'Koliko traje nargila?', en: 'How long does a hookah last?' },
    metaTitle: { bs: 'Koliko traje nargila i kako da traje duže', en: 'How long does a hookah last, and how to make it last longer' },
    metaDescription: {
      bs: 'Koliko obično traje jedna glava nargile, od čega to zavisi i kako produžiti sesiju: pakovanje, ugljevi, HMD i kontrola toplote.',
      en: 'How long one hookah bowl usually lasts, what it depends on, and how to make a session last longer: packing, coals, HMD and heat control.'
    },
    lead: {
      bs: 'Jedna glava obično traje oko sat vremena, ali to jako zavisi od toga kako je pripremiš. Evo od čega.',
      en: 'One bowl usually lasts around an hour, but that depends a lot on how you set it up. Here is what matters.'
    },
    sections: [
      {
        h: { bs: 'Koliko obično traje', en: 'How long it usually lasts' },
        p: {
          bs: [
            'Dobro pripremljena glava obično traje oko 45 do 60 minuta. Sa većom posudom, više duhana i pažljivom kontrolom toplote može trajati i duže.',
            'Na to dodaj i pripremu: ugljevi se pale oko 8 do 10 minuta, a duhanu treba još 3 do 5 minuta [[predgrijavanje|predgrijavanja]] prije prvog pravog povlačenja.'
          ],
          en: [
            'A well set up bowl usually lasts around 45 to 60 minutes. With a bigger bowl, more tobacco and careful heat control it can last longer.',
            'Add the setup on top: coals take about 8 to 10 minutes to light, and the tobacco needs another 3 to 5 minutes of [[predgrijavanje|heat-up]] before the first real pull.'
          ]
        }
      },
      {
        h: { bs: 'Od čega zavisi', en: 'What it depends on' },
        p: {
          bs: [
            'Količina duhana i veličina posude: više duhana, duža sesija. Način punjenja: [[rastresito-punjenje|rastresito]] punjenje gori ravnomjerno, a nabijen duhan brzo zagori.',
            'Toplota: previše ugljeva ili ugljevi u sredini posude prže duhan, pa sesija kraće traje i okus se brzo izgubi. Koliko i kako često povlačiš također mijenja trajanje.'
          ],
          en: [
            'How much tobacco and how big the bowl: more tobacco, longer session. How you pack it: a [[rastresito-punjenje|loose pack]] burns evenly, while a pressed pack scorches quickly.',
            'Heat: too many coals, or coals in the middle of the bowl, cook the tobacco, so the session is shorter and the flavor fades fast. How much and how often you pull also changes how long it lasts.'
          ]
        }
      },
      {
        h: { bs: 'Kako da traje duže', en: 'How to make it last longer' },
        p: {
          bs: [
            'Kreni sa manje toplote i dodaj je tek kad dim oslabi. Ugljeve drži uz ivicu i svakih 10 do 15 minuta ih okreni ili pomjeri i otresi pepeo.',
            'HMD daje ravnomjerniju toplotu od folije i lakše se kontroliše, pa sesija često traje duže. Kad okus počne slabiti, ugalj pomjeri bliže sredini, da se zagrije i duhan koji još nije iskorišten.'
          ],
          en: [
            'Start with less heat and add more only when the smoke gets thin. Keep the coals on the edge and every 10 to 15 minutes turn or shift them and knock off the ash.',
            'An HMD gives more even heat than foil and is easier to control, so sessions often last longer. When the flavor starts to fade, move a coal closer to the center so the unused tobacco gets heat too.'
          ]
        },
        links: [{ page: 'tips' }, { page: 'guide' }]
      }
    ],
    faq: [
      {
        q: { bs: 'Koliko traje jedna glava nargile?', en: 'How long does one hookah bowl last?' },
        a: { bs: 'Obično oko 45 do 60 minuta, a uz veću posudu i dobru kontrolu toplote i duže.', en: 'Usually around 45 to 60 minutes, and longer with a bigger bowl and good heat control.' }
      },
      {
        q: { bs: 'Koliko dugo se pale ugljevi za nargilu?', en: 'How long do hookah coals take to light?' },
        a: { bs: 'Kokosovi ugljevi na rešou trebaju oko 8 do 10 minuta, dok ne budu užareni i sivi sa svih strana.', en: 'Coconut coals on a burner need about 8 to 10 minutes, until they glow and are grey on every side.' }
      },
      {
        q: { bs: 'Zašto nargila brzo zagori?', en: 'Why does my hookah burn out so fast?' },
        a: { bs: 'Najčešće zbog previše toplote ili nabijenog duhana. Skini jedan ugalj, drži ugljeve uz ivicu i duhan stavljaj rastresito.', en: 'Most often because of too much heat or tobacco that is packed too tight. Take a coal off, keep the coals on the edge and pack the tobacco loosely.' }
      }
    ]
  }
];
