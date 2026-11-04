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
  }
];
