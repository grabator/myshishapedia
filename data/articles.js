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
 *                'brandCompare'   Adalya i Al Fakher jedan pored drugog (brojke iz data/flavors.js);
 *                                 { type: 'brandCompare', a, b } za druga dva brenda
 *                { type: 'picks', ids: [...] }  kartice ručno izabranih okusa
 *              links: [{ page, label }] dugmad na kraju sekcije (page iz V.SEG, npr. 'guide', 'tips')
 *   faq        [{ q, a }] česta pitanja na kraju članka
 *
 * Brojke i tvrdnje u tekstu su opšte poznate ili izračunate iz podataka sajta; trajanje sesije je okvirno.
 */
window.ARTICLES = [
  {
    id: 'najbolji-duhan',
    slug: { bs: 'najbolji-duhan-za-nargilu', en: 'best-hookah-tobacco-brands', de: 'bester-shisha-tabak' },
    published: '2026-11-07',
    eyebrow: { bs: 'Brendovi', en: 'Brands' },
    title: { bs: 'Najbolji duhan za nargilu: brendovi po stilu', en: 'The best hookah tobacco brands by style', de: 'Bester Shisha-Tabak: die beliebtesten Marken nach Stil' },
    metaTitle: {
      bs: 'Najbolji duhan za nargilu: koji brend izabrati',
      en: 'Best hookah tobacco brands: which shisha brand to pick',
      de: 'Bester Shisha-Tabak: welche Marke passt zu dir?'
    },
    metaDescription: {
      bs: 'Koji je najbolji duhan za nargilu? Blagi brendovi za početnike, njemački brendovi i jaki duhani na tamnom listu, sa okusima koje vrijedi probati.',
      en: 'Which hookah tobacco is best? Mild brands for beginners, German brands and strong dark leaf tobaccos, with the flavors worth trying from each.',
      de: 'Welcher Shisha-Tabak ist der beste? Milde Marken für Einsteiger, deutsche Marken und starker Tabak auf dunklem Blatt, mit Sorten zum Probieren.'
    },
    lead: {
      bs: 'Najbolji duhan za nargilu ne postoji, ali postoji najbolji za tebe. Najviše zavisi od toga da li voliš blag ili jak duhan, i kakve okuse voliš.',
      en: 'There is no single best hookah tobacco, but there is a best one for you. It mostly depends on whether you like mild or strong tobacco, and which flavors you enjoy.'
    },
    sections: [
      {
        h: { bs: 'Prvo pitanje: svijetli ili tamni list', en: 'The first question: blonde or dark leaf' },
        p: {
          bs: [
            'Duhan za nargilu se pravi na dvije vrste lista. [[svijetli-list|Svijetli list]] je blag, sladak i daje puno dima, pa je dobar za početnike i duge sesije.',
            '[[tamni-list|Tamni list]] je jači, okus mu je intenzivniji i duže traje, ali više udara. Njega biraju iskusniji pušači.',
            'Kad znaš šta ti odgovara, izbor brenda je mnogo lakši.'
          ],
          en: [
            'Hookah tobacco is made on two kinds of leaf. [[svijetli-list|Blonde leaf]] is mild, sweet and gives plenty of smoke, so it suits beginners and long sessions.',
            '[[tamni-list|Dark leaf]] is stronger, its flavor is more intense and lasts longer, but it hits harder. Experienced smokers tend to pick it.',
            'Once you know what suits you, choosing a brand gets much easier.'
          ]
        }
      },
      {
        h: { bs: 'Blagi brendovi za početnike', en: 'Mild brands for beginners' },
        p: {
          bs: [
            'Al Fakher iz Emirata je skoro sinonim za klasične okuse: dvostruka jabuka, menta i voće sa mentom. Adalya iz Turske ima ogroman izbor voćnih, slatkih i ledenih okusa.',
            'Američki Starbuzz i Fumari su poznati po sočnim, slatkim okusima. Svi su na svijetlom listu, pa su blagi i laki za početak.'
          ],
          en: [
            'Al Fakher from the Emirates is close to a byword for classic flavors: double apple, mint and fruit with mint. Adalya from Turkey has a huge range of fruity, sweet and icy flavors.',
            'The American Starbuzz and Fumari are known for juicy, sweet flavors. They are all on blonde leaf, so they are mild and easy to start with.'
          ]
        },
        block: { type: 'picks', ids: ['al-fakher-double-apple', 'al-fakher-grape-mint', 'adalya-love-66', 'adalya-ice-bonbon', 'starbuzz-blue-mist', 'fumari-white-gummi-bear'] }
      },
      {
        h: { bs: 'Njemački brendovi', en: 'German brands' },
        p: {
          bs: [
            'Njemačka ima svoje brendove sa voćnim miksevima, često sa ledom: 187 Strassenbande, Holster, True Passion i Nameless. Revoshi je njemački brend čiji se duhan pravi u Turskoj.',
            'Većina ih je na svijetlom listu, pa su dobri i za one koji ne vole prejak duhan.'
          ],
          en: [
            'Germany has its own brands with fruit blends, often on ice: 187 Strassenbande, Holster, True Passion and Nameless. Revoshi is a German brand whose tobacco is made in Turkey.',
            'Most of them are on blonde leaf, so they also suit people who do not like tobacco that is too strong.'
          ]
        },
        block: { type: 'picks', ids: ['187-i-love-hamburg', 'holster-ice-kaktuz', 'true-passion-cinderella', 'nameless-black-nana', 'revoshi-d-app-strong', 'holster-grpe-mnt'] }
      },
      {
        h: { bs: 'Jaki duhani na tamnom listu', en: 'Strong dark leaf tobaccos' },
        p: {
          bs: [
            'Ruski Darkside i MUSTHAVE su poznati po jakim, modernim okusima i po tome da su odlični za mikseve. Sebero ima razigrane voćne i ledene kombinacije.',
            'Američki Tangiers je jak duhan za iskusne, a egipatska Nakhla je stari, tradicionalni moassel poznat po dvostrukoj jabuci.',
            'Ovi duhani traže rastresito pakovanje i pažljivu toplotu. Ako tek počinješ, kreni sa svijetlim listom.'
          ],
          en: [
            'The Russian Darkside and MUSTHAVE are known for strong, modern flavors and for being great in mixes. Sebero has playful fruit and icy blends.',
            'The American Tangiers is a strong tobacco for experienced smokers, and the Egyptian Nakhla is an old, traditional moassel known for its double apple.',
            'These tobaccos need a loose pack and careful heat. If you are just starting out, begin with blonde leaf.'
          ]
        },
        block: { type: 'picks', ids: ['musthave-pinkman', 'darkside-cola', 'darkside-supernova', 'tangiers-cane-mint', 'sebero-black-cola', 'nakhla-double-apple'] }
      },
      {
        h: { bs: 'Blago ili jako: dva brenda jedan pored drugog', en: 'Mild or strong: two brands side by side' },
        p: {
          bs: ['Adalya i MUSTHAVE su dobar primjer razlike između svijetlog i tamnog lista. Brojke su izračunate iz okusa na našem sajtu.'],
          en: ['Adalya and MUSTHAVE are a good example of the difference between blonde and dark leaf. The numbers are calculated from the flavors on our site.']
        },
        block: { type: 'brandCompare', a: 'adalya', b: 'musthave' },
        links: [{ page: 'brands' }, { page: 'compare' }]
      }
    ],
    faq: [
      {
        q: { bs: 'Koji je najbolji duhan za nargilu?', en: 'What is the best hookah tobacco?' },
        a: { bs: 'Zavisi od toga šta voliš. Za blag i sladak dim izaberi brend na svijetlom listu, npr. Al Fakher ili Adalya. Za jak i intenzivan okus izaberi tamni list, npr. MUSTHAVE ili Darkside.', en: 'It depends on what you like. For mild, sweet smoke pick a blonde leaf brand such as Al Fakher or Adalya. For a strong, intense flavor pick dark leaf, such as MUSTHAVE or Darkside.' }
      },
      {
        q: { bs: 'Koji duhan za nargilu je najblaži?', en: 'Which hookah tobacco is the mildest?' },
        a: { bs: 'Najblaži su duhani na svijetlom listu, kao Al Fakher, Adalya, Starbuzz i Fumari. Zato su dobar izbor za početnike.', en: 'The mildest are blonde leaf tobaccos such as Al Fakher, Adalya, Starbuzz and Fumari. That makes them a good choice for beginners.' }
      },
      {
        q: { bs: 'Koji brendovi duhana za nargilu su iz Njemačke?', en: 'Which hookah tobacco brands are from Germany?' },
        a: { bs: 'Na našem sajtu su 187 Strassenbande, Holster, True Passion, Nameless i Revoshi, čiji se duhan pravi u Turskoj.', en: 'On our site they are 187 Strassenbande, Holster, True Passion, Nameless and Revoshi, whose tobacco is made in Turkey.' }
      },
      {
        q: { bs: 'Da li je tamni list bolji od svijetlog?', en: 'Is dark leaf better than blonde leaf?' },
        a: { bs: 'Nije bolji, nego drugačiji. Tamni list je jači i okus mu duže traje, a svijetli je blaži i daje više dima.', en: 'It is not better, just different. Dark leaf is stronger and its flavor lasts longer, while blonde leaf is milder and gives more smoke.' }
      }
    ]
  },
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
  },
  {
    id: 'najbolji-okusi',
    slug: { bs: 'najbolji-okusi-za-nargilu', en: 'best-hookah-flavors' },
    published: '2026-11-05',
    eyebrow: { bs: 'Okusi', en: 'Flavors' },
    title: { bs: 'Najbolji okusi za nargilu po vrsti', en: 'The best hookah flavors by type' },
    metaTitle: { bs: 'Najbolji okusi za nargilu: ledeni, voćni, desertni i citrusni', en: 'Best hookah flavors: icy, fruity, dessert and citrus picks' },
    metaDescription: {
      bs: 'Najbolji okusi za nargilu po vrsti: ledeni, voćni, citrusni, desertni, bomboni i pića, plus klasici koje ćeš naći u skoro svakom lounge baru.',
      en: 'The best hookah flavors by type: icy, fruity, citrus, dessert, candy and drinks, plus the classics you will find in almost every lounge.'
    },
    lead: {
      bs: 'Najbolji okus je onaj koji tebi prija, ali neki okusi se vole više od drugih. Evo izbora po vrsti, da lakše nađeš svoj.',
      en: 'The best flavor is the one you enjoy, but some flavors are loved more than others. Here are picks by type, so you can find yours faster.'
    },
    sections: [
      {
        h: { bs: 'Klasici', en: 'The classics' },
        p: {
          bs: [
            'Neki okusi su tu decenijama i nađeš ih u skoro svakom lounge baru: dvostruka jabuka (Double Apple), menta, grožđe sa mentom, limun sa mentom, lubenica sa mentom i borovnica.',
            'Ako ne znaš šta uzeti, klasik je uvijek siguran izbor.'
          ],
          en: [
            'Some flavors have been around for decades and you will find them in almost every lounge: double apple, mint, grape mint, lemon mint, watermelon mint and blueberry.',
            'If you are not sure what to get, a classic is always a safe pick.'
          ]
        }
      },
      {
        h: { bs: 'Izbor po vrsti', en: 'Picks by type' },
        p: {
          bs: ['Za svaku vrstu izdvojili smo okuse koji su u njoj najizraženiji po našim procjenama: najhladniji ledeni, najvoćniji voćni, najslađi desertni i tako dalje.'],
          en: ['For each type we picked the flavors that stand out most by our estimates: the coldest icy ones, the fruitiest fruit ones, the sweetest desserts and so on.']
        },
        block: 'groupPicks',
        links: [{ page: 'flavors' }, { page: 'top' }]
      },
      {
        h: { bs: 'Kako naći svoj okus', en: 'How to find your flavor' },
        p: {
          bs: [
            'Ako ti se svidio neki okus, na njegovoj stranici su slični okusi i ideje za mikseve. U poređenju možeš staviti dva okusa jedan pored drugog, a kviz ti predloži okus po tvom ukusu.',
            'Ocjene posjetilaca pokazuju šta se drugima najviše svidjelo.'
          ],
          en: [
            'If you liked a flavor, its page shows similar flavors and mix ideas. In the comparison you can put two flavors side by side, and the quiz suggests a flavor based on your taste.',
            'Visitor ratings show what other people liked most.'
          ]
        },
        links: [{ page: 'quiz' }, { page: 'compare' }]
      }
    ],
    faq: [
      {
        q: { bs: 'Koji je najpopularniji okus za nargilu?', en: 'What is the most popular hookah flavor?' },
        a: { bs: 'Klasici kao dvostruka jabuka, menta i grožđe sa mentom su tu decenijama. Od novijih su jako popularni ledeni voćni i bombon okusi.', en: 'Classics like double apple, mint and grape mint have been around for decades. Among newer ones, icy fruit and candy flavors are very popular.' }
      },
      {
        q: { bs: 'Koji okus za nargilu je najsvježiji?', en: 'Which hookah flavor is the most refreshing?' },
        a: { bs: 'Najsvježiji su okusi sa mentom, pepermintom i mentolom, sami ili uz citruse. Na listi ledenih okusa su oni sa najjačim hlađenjem.', en: 'The most refreshing are flavors with mint, peppermint and menthol, on their own or with citrus. The icy list shows the ones with the strongest cooling.' }
      }
    ]
  },
  {
    id: 'ledeni-okusi',
    slug: { bs: 'najbolji-ledeni-okusi', en: 'best-icy-hookah-flavors' },
    published: '2026-11-05',
    eyebrow: { bs: 'Ledeni okusi', en: 'Icy flavors' },
    title: { bs: 'Najbolji ledeni okusi za nargilu', en: 'The best icy hookah flavors' },
    metaTitle: { bs: 'Najbolji ledeni okusi za nargilu: mentol, menta i led', en: 'Best icy hookah flavors: menthol, mint and ice' },
    metaDescription: {
      bs: 'Najhladniji okusi za nargilu po našim procjenama hlađenja, razlika između mente, pepermenta i mentola i kako dobiti ledeniji dim.',
      en: 'The coldest hookah flavors by our cooling estimates, the difference between mint, peppermint and menthol, and how to get icier smoke.'
    },
    lead: {
      bs: 'Za vruće dane ili kad želiš osjećaj leda u grlu. Ovo su okusi sa najjačim hlađenjem.',
      en: 'For hot days, or when you want that icy feeling in your throat. These are the flavors with the strongest cooling.'
    },
    sections: [
      {
        h: { bs: 'Menta, pepermint ili mentol?', en: 'Mint, peppermint or menthol?' },
        p: {
          bs: [
            'Menta daje svjež, zelen okus. Pepermint je oštriji i hladniji. Mentol nema skoro nikakav okus, ali daje jak osjećaj hladnoće, pa ga brendovi dodaju voću i bombonima da budu "ledeni".',
            'Zato okus može biti voćni i jako leden u isto vrijeme, kao što su mnogi Adalya okusi.'
          ],
          en: [
            'Mint gives a fresh, green taste. Peppermint is sharper and colder. Menthol has almost no taste but a strong cooling feel, so brands add it to fruit and candy flavors to make them icy.',
            'That is why a flavor can be fruity and very icy at the same time, like many Adalya flavors.'
          ]
        }
      },
      {
        h: { bs: 'Najhladniji okusi', en: 'The coldest flavors' },
        p: {
          bs: ['Ovo su okusi sa hlađenjem 8/10 ili više po našim procjenama, najviše dva od svakog brenda.'],
          en: ['These are flavors with cooling of 8/10 or more by our estimates, at most two from each brand.']
        },
        block: 'icyPicks',
        links: [{ page: 'collections' }]
      },
      {
        h: { bs: 'Kako dobiti ledeniji dim', en: 'How to get icier smoke' },
        p: {
          bs: [
            'Hladna voda i par kockica leda u vazi čine dim hladnijim. Ledeni okus se može dodati i u miks: već 15 do 30% mentola ili mente rashladi skoro svaki voćni okus.',
            'Previše toplote "spali" osjećaj hladnoće, pa kod ledenih okusa drži ugljeve uz ivicu.'
          ],
          en: [
            'Cold water and a few ice cubes in the base make the smoke cooler. You can also add ice to a mix: just 15 to 30% of a menthol or mint flavor cools down almost any fruit flavor.',
            'Too much heat burns off the cooling feel, so with icy flavors keep the coals on the edge.'
          ]
        },
        links: [{ page: 'tips' }, { page: 'mixer' }]
      }
    ],
    faq: [
      {
        q: { bs: 'Koji je najledeniji okus za nargilu?', en: 'What is the iciest hookah flavor?' },
        a: { bs: 'Najhladniji su okusi sa jakim mentolom ili pepermintom. Na listi u ovom članku su oni sa najvišom ocjenom hlađenja po našim procjenama.', en: 'The coldest are flavors with strong menthol or peppermint. The list in this article shows the ones with the highest cooling rating by our estimates.' }
      },
      {
        q: { bs: 'Šta je razlika između mente i mentola?', en: 'What is the difference between mint and menthol?' },
        a: { bs: 'Menta daje okus, a mentol uglavnom hladnoću. Zato se mentol dodaje voću da bude leden, a da ne miriše na mentu.', en: 'Mint gives taste, while menthol mostly gives cold. That is why menthol is added to fruit to make it icy without tasting of mint.' }
      },
      {
        q: { bs: 'Da li led u vazi pomaže?', en: 'Does ice in the base help?' },
        a: { bs: 'Pomaže. Hladna voda i par kockica leda čine dim hladnijim i mekšim.', en: 'Yes. Cold water and a few ice cubes make the smoke cooler and smoother.' }
      }
    ]
  },
  {
    id: 'darkside-musthave',
    slug: { bs: 'darkside-ili-musthave', en: 'darkside-vs-musthave' },
    published: '2026-11-05',
    eyebrow: { bs: 'Poređenje brendova', en: 'Brand comparison' },
    title: { bs: 'Darkside ili Musthave: koja je razlika?', en: 'Darkside vs Musthave: what is the difference?' },
    metaTitle: { bs: 'Darkside ili Musthave: razlika između dva brenda tamnog lista', en: 'Darkside vs Musthave: two dark leaf shisha brands compared' },
    metaDescription: {
      bs: 'Darkside i Musthave jedan pored drugog: oba su ruski brendovi tamnog lista, ali sa različitim karakterom okusa. Brojke iz naše enciklopedije.',
      en: 'Darkside and Musthave side by side: both are Russian dark leaf brands, but with a different flavor style. Numbers from our flavor encyclopedia.'
    },
    lead: {
      bs: 'Dva brenda tamnog lista za one koji žele jači i izraženiji okus. Slični su po jačini, a razlikuju se po stilu.',
      en: 'Two dark leaf brands for people who want a stronger, bolder flavor. They are similar in strength but differ in style.'
    },
    sections: [
      {
        h: { bs: 'Ukratko', en: 'In short' },
        p: {
          bs: [
            'Oba brenda su iz Rusije i rade na [[tamni-list|tamnom listu]], pa su jača od brendova na svijetlom listu, kao što su Adalya i Al Fakher.',
            'Darkside je poznat po jakim, izraženim okusima i po tome da se često koristi u miksevima, posebno kad treba dodati hlađenje.',
            'Musthave ima sočne, jasne i često slatko-kisele voćne okuse, i jako veliki izbor.'
          ],
          en: [
            'Both brands come from Russia and use [[tamni-list|dark leaf]], so they are stronger than blonde leaf brands like Adalya and Al Fakher.',
            'Darkside is known for strong, pronounced flavors and is often used in mixes, especially to add some chill.',
            'Musthave has juicy, clear and often sweet and tart fruit flavors, and a very large range.'
          ]
        }
      },
      {
        h: { bs: 'Jedan pored drugog', en: 'Side by side' },
        p: {
          bs: ['Brojke su prosjeci okusa ovih brendova u našoj enciklopediji, na skali od 0 do 10. To su procjene, ali dobro pokazuju razliku.'],
          en: ['The numbers are averages across these brands\' flavors in our encyclopedia, on a 0 to 10 scale. They are estimates, but they show the difference well.']
        },
        block: { type: 'brandCompare', a: 'darkside', b: 'musthave' }
      },
      {
        h: { bs: 'Koji izabrati?', en: 'Which one should you pick?' },
        p: {
          bs: [
            'Oba su za ljude koji već imaju malo iskustva. Ako tek počinješ, bolje je krenuti sa svijetlim listom.',
            'Ako voliš čist, sočan voćni okus i želiš mnogo izbora, probaj Musthave. Ako voliš jake okuse i praviš mikseve, Darkside je dobar izbor.'
          ],
          en: [
            'Both suit people who already have some experience. If you are just starting, blonde leaf is a better place to begin.',
            'If you like clean, juicy fruit flavors and want lots of choice, try Musthave. If you like strong flavors and make your own mixes, Darkside is a good pick.'
          ]
        },
        links: [{ page: 'compare' }, { page: 'brands' }]
      }
    ],
    faq: [
      {
        q: { bs: 'Da li je Darkside jači od Musthavea?', en: 'Is Darkside stronger than Musthave?' },
        a: { bs: 'Oba su na tamnom listu i spadaju u jače duhane. Prosječna jačina po našim procjenama je u tabeli iznad.', en: 'Both are on dark leaf and count as stronger tobaccos. The average strength by our estimates is in the table above.' }
      },
      {
        q: { bs: 'Odakle su Darkside i Musthave?', en: 'Where are Darkside and Musthave from?' },
        a: { bs: 'Oba brenda su iz Rusije.', en: 'Both brands are from Russia.' }
      },
      {
        q: { bs: 'Da li su Darkside i Musthave za početnike?', en: 'Are Darkside and Musthave good for beginners?' },
        a: { bs: 'Bolje za one sa malo iskustva. Tamni list je jači i ima više nikotina, pa je za početak bolji svijetli list.', en: 'They are better for people with some experience. Dark leaf is stronger and has more nicotine, so blonde leaf is better to start with.' }
      }
    ]
  },
  {
    id: 'legalnost',
    slug: { bs: 'da-li-je-nargila-legalna', en: 'is-hookah-legal' },
    published: '2026-11-05',
    eyebrow: { bs: 'Zakon', en: 'Law' },
    title: { bs: 'Da li je nargila legalna?', en: 'Is hookah legal?' },
    metaTitle: { bs: 'Da li je nargila legalna: godine, pušenje u lokalima i pravila', en: 'Is hookah legal? Age limits, indoor smoking and the rules' },
    metaDescription: {
      bs: 'Da li je nargila legalna, od koliko godina se smije kupiti duhan za nargilu i šta važi za pušenje u lokalima. Opšti pregled, provjeri lokalne propise.',
      en: 'Is hookah legal, how old you have to be to buy shisha tobacco, and what applies to smoking indoors. A general overview, check your local rules.'
    },
    lead: {
      bs: 'Ukratko: u većini zemalja nargila je legalna za punoljetne, ali pravila o godinama i pušenju u zatvorenim prostorima se razlikuju od zemlje do zemlje.',
      en: 'In short: in most countries hookah is legal for adults, but the rules on age and indoor smoking differ from country to country.'
    },
    sections: [
      {
        h: { bs: 'Da li je nargila legalna?', en: 'Is hookah legal?' },
        p: {
          bs: [
            'U većini zemalja posjedovanje nargile i duhana za nargilu je legalno za odrasle. Duhan za nargilu je duhanski proizvod, pa za njega važe ista osnovna pravila kao za cigarete: ograničenje godina, zabrana prodaje maloljetnima i upozorenja na pakovanju.',
            'Ovo je opšti pregled, a ne pravni savjet. Zakoni se mijenjaju i razlikuju se i unutar iste zemlje, pa uvijek provjeri propise tamo gdje živiš.'
          ],
          en: [
            'In most countries owning a hookah and shisha tobacco is legal for adults. Shisha tobacco is a tobacco product, so the same basic rules apply as for cigarettes: an age limit, no sales to minors and health warnings on the pack.',
            'This is a general overview, not legal advice. Laws change and can differ even within one country, so always check the rules where you live.'
          ]
        }
      },
      {
        h: { bs: 'Od koliko godina?', en: 'How old do you have to be?' },
        p: {
          bs: [
            'U većini evropskih zemalja duhan se smije kupiti od 18 godina. U nekim zemljama granica je viša, npr. u SAD-u je od 2019. godine 21 godina za sve duhanske proizvode.'
          ],
          en: [
            'In most European countries you can buy tobacco from age 18. Some countries set the limit higher; in the United States, for example, it has been 21 for all tobacco products since 2019.'
          ]
        }
      },
      {
        h: { bs: 'Pušenje u lokalima', en: 'Smoking indoors' },
        p: {
          bs: [
            'Mnoge zemlje zabranjuju pušenje u zatvorenim javnim prostorima, a to često uključuje i nargilu. Negdje lounge barovi imaju posebna pravila ili dozvole, a negdje je nargila dozvoljena samo napolju.',
            'Prije nego što otvoriš lounge ili organizuješ sesiju u lokalu, provjeri lokalne propise.'
          ],
          en: [
            'Many countries ban smoking in enclosed public places, and that often includes hookah. In some places hookah lounges have special rules or licences, and in others hookah is only allowed outdoors.',
            'Before you open a lounge or plan a session in a venue, check the local rules.'
          ]
        }
      },
      {
        h: { bs: 'A zdravlje?', en: 'What about health?' },
        p: {
          bs: [
            'Legalno ne znači bezopasno. Dim nargile sadrži nikotin, ugljen-monoksid i katran, a voda ih ne filtrira. Sesija traje dugo, pa se udahne mnogo dima.'
          ],
          en: [
            'Legal does not mean harmless. Hookah smoke contains nicotine, carbon monoxide and tar, and the water does not filter them out. A session lasts a long time, so you inhale a lot of smoke.'
          ]
        },
        links: [{ page: 'guide' }]
      }
    ],
    faq: [
      {
        q: { bs: 'Da li je nargila legalna?', en: 'Is hookah legal?' },
        a: { bs: 'U većini zemalja jeste, za punoljetne. Pravila o godinama i pušenju u zatvorenom se razlikuju, pa provjeri lokalne propise.', en: 'In most countries it is, for adults. Rules on age and indoor smoking differ, so check your local rules.' }
      },
      {
        q: { bs: 'Od koliko godina se smije kupiti duhan za nargilu?', en: 'How old do you have to be to buy shisha tobacco?' },
        a: { bs: 'U većini evropskih zemalja od 18 godina, a u nekim zemljama, kao u SAD-u, od 21.', en: 'In most European countries from 18, and in some countries, like the United States, from 21.' }
      },
      {
        q: { bs: 'Da li je nargila bez duhana legalna?', en: 'Is tobacco-free hookah legal?' },
        a: { bs: 'Postoje mješavine bez duhana (npr. od biljaka ili kamenčića), ali pravila za njih se razlikuju po zemljama, a dim i dalje nije zdrav.', en: 'There are tobacco-free blends (made from herbs or stones, for example), but the rules for them differ by country, and the smoke is still not healthy.' }
      }
    ]
  },
  {
    id: 'adalya-187',
    slug: { bs: 'adalya-ili-187', en: 'adalya-vs-187' },
    published: '2026-11-04',
    eyebrow: { bs: 'Poređenje brendova', en: 'Brand comparison' },
    title: { bs: 'Adalya ili 187 Strassenbande: koja je razlika?', en: 'Adalya vs 187 Strassenbande: what is the difference?' },
    metaTitle: { bs: 'Adalya ili 187: razlika između turskog i njemačkog brenda', en: 'Adalya vs 187: a Turkish and a German shisha brand compared' },
    metaDescription: {
      bs: 'Adalya i 187 Strassenbande jedan pored drugog: porijeklo, list, karakter okusa i koji izabrati, uz brojke iz naše enciklopedije okusa.',
      en: 'Adalya and 187 Strassenbande side by side: origin, leaf, flavor style and which to pick, with numbers from our flavor encyclopedia.'
    },
    lead: {
      bs: 'Dva brenda koja su posebno popularna u Njemačkoj i kod nas. Oba su blaga i voćna, ali imaju različit stil.',
      en: 'Two brands that are especially popular in Germany and in our region. Both are mild and fruity, but their style is different.'
    },
    sections: [
      {
        h: { bs: 'Ukratko', en: 'In short' },
        p: {
          bs: [
            'Adalya dolazi iz Turske i poznata je po razigranim kombinacijama voća, bombona i leda, kao što su Love 66, Lady Killer ili Mi Amor.',
            '187 Strassenbande je njemački brend sa voćnim miksevima neobičnih imena, kao što su I Love Hamburg, Beach Vibez ili Siwlez.',
            'Oba brenda koriste [[svijetli-list|svijetli list]], pa su blagi i dobri i za početnike.'
          ],
          en: [
            'Adalya comes from Turkey and is known for playful blends of fruit, candy and ice, like Love 66, Lady Killer or Mi Amor.',
            '187 Strassenbande is a German brand with fruit blends that have unusual names, like I Love Hamburg, Beach Vibez or Siwlez.',
            'Both brands use [[svijetli-list|blonde leaf]], so both are mild and fine for beginners.'
          ]
        }
      },
      {
        h: { bs: 'Jedan pored drugog', en: 'Side by side' },
        p: {
          bs: [
            'Brojke su prosjeci okusa ovih brendova u našoj enciklopediji, na skali od 0 do 10. To su procjene, ali dobro pokazuju razliku u karakteru.'
          ],
          en: [
            'The numbers are averages across these brands\' flavors in our encyclopedia, on a 0 to 10 scale. They are estimates, but they show the difference in character well.'
          ]
        },
        block: { type: 'brandCompare', a: 'adalya', b: '187-strassenbande' }
      },
      {
        h: { bs: 'Koji izabrati?', en: 'Which one should you pick?' },
        p: {
          bs: [
            'Ako voliš slatke, tropske okuse sa ledom, Adalya ima veliki izbor i lako ćeš naći nešto za sebe.',
            'Ako voliš voćne mikseve sa više citrusa i kiseline, ili klasike kao što je jabuka sa anisom, probaj 187.',
            'Najbolje je probati oba: u poređenju možeš staviti bilo koja dva okusa jedan pored drugog.'
          ],
          en: [
            'If you like sweet, tropical flavors with ice, Adalya has a huge range and you will easily find something.',
            'If you like fruit blends with more citrus and tang, or classics like apple with anise, try 187.',
            'The best way is to try both: in the comparison you can put any two flavors side by side.'
          ]
        },
        links: [{ page: 'compare' }, { page: 'brands' }]
      }
    ],
    faq: [
      {
        q: { bs: 'Da li je 187 jači od Adalye?', en: 'Is 187 stronger than Adalya?' },
        a: { bs: 'Ne bitno. Oba brenda su na svijetlom listu i spadaju u blage duhane. Razlika je u stilu okusa.', en: 'Not really. Both brands are on blonde leaf and count as mild tobaccos. The difference is in flavor style.' }
      },
      {
        q: { bs: 'Odakle su Adalya i 187 Strassenbande?', en: 'Where are Adalya and 187 Strassenbande from?' },
        a: { bs: 'Adalya je iz Turske, a 187 Strassenbande iz Njemačke.', en: 'Adalya is from Turkey, and 187 Strassenbande is from Germany.' }
      },
      {
        q: { bs: 'Mogu li miješati Adalyu i 187?', en: 'Can I mix Adalya and 187?' },
        a: { bs: 'Možeš. Oba su na svijetlom listu, pa se dobro slažu. Npr. 187 Glacier uz Adalya voćni okus doda led.', en: 'Yes. Both are on blonde leaf, so they blend well. For example, 187 Glacier adds ice to any Adalya fruit flavor.' }
      }
    ]
  },
  {
    id: 'najbolji-al-fakher',
    slug: { bs: 'najbolji-al-fakher-okusi', en: 'best-al-fakher-flavors' },
    published: '2026-11-04',
    eyebrow: { bs: 'Okusi', en: 'Flavors' },
    title: { bs: 'Najbolji Al Fakher okusi', en: 'The best Al Fakher flavors' },
    metaTitle: { bs: 'Najbolji Al Fakher okusi: klasici, voće i neobični okusi', en: 'The best Al Fakher flavors: classics, fruit and unusual picks' },
    metaDescription: {
      bs: 'Najbolji Al Fakher okusi po vrsti: klasici sa mentom, voćni okusi i neobični izbori, uz savjete za mikseve i za početnike.',
      en: 'The best Al Fakher flavors by type: classics with mint, fruit flavors and unusual picks, with tips for mixes and for beginners.'
    },
    lead: {
      bs: 'Al Fakher je jedan od najpoznatijih brendova za nargilu. Evo okusa koje vrijedi probati, po vrsti.',
      en: 'Al Fakher is one of the best-known hookah brands. Here are the flavors worth trying, by type.'
    },
    sections: [
      {
        h: { bs: 'Klasici', en: 'The classics' },
        p: {
          bs: [
            'Ovo su okusi koje ćeš naći u skoro svakom lounge-u i po kojima je Al Fakher postao poznat: dvostruka jabuka, menta i voće sa mentom.',
            'Ako ne znaš šta da uzmeš, s njima ne možeš pogriješiti.'
          ],
          en: [
            'These are the flavors you will find in almost every lounge and that made Al Fakher famous: double apple, mint and fruit with mint.',
            'If you do not know what to pick, you cannot go wrong with these.'
          ]
        },
        block: { type: 'picks', ids: ['al-fakher-double-apple', 'al-fakher-mint', 'al-fakher-grape-mint', 'al-fakher-lemon-mint', 'al-fakher-watermelon-mint', 'al-fakher-blueberry-mint'] }
      },
      {
        h: { bs: 'Voćni okusi', en: 'Fruit flavors' },
        p: {
          bs: [
            'Al Fakher ima i veliki izbor čistih voćnih okusa, bez mente. Dobri su sami, a još bolji kao baza za tvoje mikseve.'
          ],
          en: [
            'Al Fakher also has a big range of pure fruit flavors, without mint. They are good on their own and even better as a base for your own mixes.'
          ]
        },
        block: { type: 'picks', ids: ['al-fakher-watermelon', 'al-fakher-mango', 'al-fakher-peach', 'al-fakher-blueberry', 'al-fakher-strawberry', 'al-fakher-guava'] }
      },
      {
        h: { bs: 'Neobični izbori', en: 'Unusual picks' },
        p: {
          bs: [
            'Ako su ti klasici dosadili, probaj nešto drugačije: tropski Magic Love, žvaku sa cimetom ili kremastu vanilu i kokos.'
          ],
          en: [
            'If you are bored of the classics, try something different: tropical Magic Love, gum with cinnamon, or creamy vanilla and coconut.'
          ]
        },
        block: { type: 'picks', ids: ['al-fakher-magic-love', 'al-fakher-gum-cinnamon', 'al-fakher-vanilla', 'al-fakher-coconut', 'al-fakher-plum', 'al-fakher-gum-mint'] },
        links: [{ page: 'brands' }, { page: 'mixer' }]
      }
    ],
    faq: [
      {
        q: { bs: 'Koji je najpopularniji Al Fakher okus?', en: 'What is the most popular Al Fakher flavor?' },
        a: { bs: 'Najpoznatiji su klasici: dvostruka jabuka, menta, grožđe sa mentom i limun sa mentom.', en: 'The best known are the classics: double apple, mint, grape mint and lemon mint.' }
      },
      {
        q: { bs: 'Koji Al Fakher okus je najbolji za početnike?', en: 'Which Al Fakher flavor is best for beginners?' },
        a: { bs: 'Svi Al Fakher okusi su na svijetlom listu i blagi su. Za početak su dobri jednostavni voćni okusi sa mentom, kao što su lubenica ili grožđe sa mentom.', en: 'All Al Fakher flavors are on blonde leaf and mild. Simple fruit flavors with mint, like watermelon mint or grape mint, are good to start with.' }
      },
      {
        q: { bs: 'Šta miješati sa Al Fakherom?', en: 'What should I mix with Al Fakher?' },
        a: { bs: 'Al Fakher Mint se slaže sa skoro svakim voćem. Za ideje otvori stranicu okusa: svaki okus ima prijedloge za mikseve.', en: 'Al Fakher Mint goes with almost any fruit. For ideas, open a flavor page: every flavor has mix suggestions.' }
      }
    ]
  }
];
