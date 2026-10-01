/*
 * MyShishapedia - recepti miksova (oba jezika).
 *
 * SVI RECEPTI SU PRIJEDLOZI: Graba treba svaki isprobati i potvrditi (vidi docs/UPUTSTVO.md).
 *
 * Polja:
 *   id        jedinstven, koristi se interno
 *   slug      { bs, en } dio adrese: /bs/recepti/<slug>/ i /en/mixes/<slug>/
 *   name      { bs, en } originalno ime miksa
 *   parts     tačno DVA okusa iz data/flavors.js sa procentima; zbir mora biti 100,
 *             a svaki dio 20-80 i djeljiv sa 5 (tako se tačno otvara u mikseru)
 *   layout    'mixed' (izmiješano) ili 'sectors' (u sektorima posude)
 *   strength  'light', 'medium' ili 'strong' (lagan / srednji / jak)
 *   tags      ključevi tagova iz js/strings.js (tags)
 *   featured  true = prikazuje se na početnoj (najbolje 3)
 *   description, tips  { bs: [...], en: [...] }
 * Build provjerava pravila i javi grešku ako nešto ne štima.
 */
window.MIXES = [
  {
    id: 'frozen-lagoon',
    slug: { bs: 'ledena-laguna', en: 'frozen-lagoon' },
    name: { bs: 'Ledena laguna', en: 'Frozen Lagoon' },
    parts: [{ flavor: 'adalya-dubai', pct: 70 }, { flavor: 'adalya-ice-bonbon', pct: 30 }],
    layout: 'sectors',
    strength: 'medium',
    tags: ['vocni', 'tropski', 'ledeni'],
    featured: true,
    description: {
      bs: [
        'Tropski ananas i banana iz Dubaija, a preko njih talas leda iz Ice Bonbona.',
        'Voće ostaje u prvom planu, dok hlađenje stiže tek na izdahu, kao kocka leda u koktelu.'
      ],
      en: [
        'Tropical pineapple and banana from Dubai, topped with a wave of ice from Ice Bonbon.',
        'The fruit stays up front while the chill arrives on the exhale, like an ice cube in a cocktail.'
      ]
    },
    tips: {
      bs: [
        'Stavi okuse u dva sektora: veći za Dubai, manji za Ice Bonbon, pa se hlađenje pojačava kako se sesija razvija.',
        'Mentol je jak, pa ne pretjeruj sa toplotom na početku; kreni sa manje ugljeva i dodaj po potrebi.'
      ],
      en: [
        'Pack them in two sectors: a larger one for Dubai and a smaller one for Ice Bonbon, so the chill builds as the session goes on.',
        'Menthol hits hard, so go easy on the heat at first; start with fewer coals and add more if needed.'
      ]
    }
  },
  {
    id: 'midnight-honey',
    slug: { bs: 'ponocni-med', en: 'midnight-honey' },
    name: { bs: 'Ponoćni med', en: 'Midnight Honey' },
    parts: [{ flavor: 'adalya-berlin-nights', pct: 50 }, { flavor: 'adalya-baku-nights', pct: 50 }],
    layout: 'mixed',
    strength: 'light',
    tags: ['nocni', 'medeni', 'vocni'],
    featured: true,
    description: {
      bs: [
        'Dva noćna okusa u jednoj posudi: breskva se pojavljuje u oba, a med i dinja joj daju toplinu.',
        'Mekan, slatkast miks za sporu večernju sesiju, sa tek blagim svježim završetkom.'
      ],
      en: [
        'Two night flavors in one bowl: peach runs through both, while honey and melon warm it up.',
        'A soft, sweet blend for a slow evening session, with just a gentle fresh finish.'
      ]
    },
    tips: {
      bs: [
        'Okuse dobro izmiješaj prije punjenja, jer dijele breskvu pa se lijepo stapaju.',
        'Slatki okusi lakše zagore; drži toplotu umjerenom i povremeno skloni jedan ugalj.'
      ],
      en: [
        'Mix them well before packing; they share peach, so they blend smoothly.',
        'Sweet flavors burn more easily, so keep the heat moderate and pull a coal off now and then.'
      ]
    }
  },
  {
    id: 'berries-on-ice',
    slug: { bs: 'bobice-na-ledu', en: 'berries-on-ice' },
    name: { bs: 'Bobice na ledu', en: 'Berries on Ice' },
    parts: [{ flavor: 'adalya-angel-lips', pct: 70 }, { flavor: 'adalya-ice-bonbon', pct: 30 }],
    layout: 'mixed',
    strength: 'medium',
    tags: ['bobicasti', 'ledeni', 'ljetni'],
    featured: true,
    description: {
      bs: [
        'Lubenica i kupina iz Angel Lips, ohlađene bombonskim ledom iz Ice Bonbona.',
        'Tamno bobičasto voće dobija bistar, hladan izdah, a da ne izgubi slatkoću.'
      ],
      en: [
        'Watermelon and blackberry from Angel Lips, chilled with candy ice from Ice Bonbon.',
        'The dark berry fruit gets a clear, cold exhale without losing its sweetness.'
      ]
    },
    tips: {
      bs: [
        'Izmiješaj okuse ravnomjerno da hlađenje bude isto od početka do kraja.',
        'Ako hlađenje postane previše, sljedeći put smanji udio Ice Bonbona.'
      ],
      en: [
        'Mix them evenly so the chill stays the same from start to finish.',
        'If it gets too icy, use less Ice Bonbon next time.'
      ]
    }
  },
  {
    id: 'tropical-sunset',
    slug: { bs: 'tropski-zalazak', en: 'tropical-sunset' },
    name: { bs: 'Tropski zalazak', en: 'Tropical Sunset' },
    parts: [{ flavor: 'adalya-lady-killer', pct: 50 }, { flavor: 'adalya-dubai', pct: 50 }],
    layout: 'mixed',
    strength: 'medium',
    tags: ['tropski', 'vocni', 'slatki'],
    featured: false,
    description: {
      bs: [
        'Mango, jagoda i dinja iz Lady Killer, zajedno sa ananasom i bananom iz Dubaija.',
        'Puna korpa tropskog voća, slatka i sočna, sa hladnim krajem od mentola i mente.'
      ],
      en: [
        'Mango, strawberry and melon from Lady Killer, together with pineapple and banana from Dubai.',
        'A full basket of tropical fruit, sweet and juicy, with a cool finish from the menthol and mint.'
      ]
    },
    tips: {
      bs: [
        'Pomiješaj okuse, jer se voće dobro slaže i nijedno ne smeta drugom.',
        'Voćni okusi vole ravnomjernu, srednju toplotu; ako dim postane oštar, pomjeri ugljeve prema ivici.'
      ],
      en: [
        'Mix them together; the fruits get along and neither one takes over.',
        'Fruity flavors like steady, medium heat; if the smoke turns harsh, move the coals toward the edge.'
      ]
    }
  },
  {
    id: 'polar-candy',
    slug: { bs: 'polarni-bombon', en: 'polar-candy' },
    name: { bs: 'Polarni bombon', en: 'Polar Candy' },
    parts: [{ flavor: 'adalya-ice-bonbon', pct: 50 }, { flavor: 'adalya-swiss-bonbon', pct: 50 }],
    layout: 'sectors',
    strength: 'strong',
    tags: ['ledeni', 'bombon', 'mint'],
    featured: false,
    description: {
      bs: [
        'Dva ledena bombona zajedno: slatkoća iz Ice Bonbona i blaga biljna nota iz Swiss Bonbona.',
        'Za one kojima hladnije nikad nije dovoljno hladno. Vrlo jak mentol, od prvog do posljednjeg udaha.'
      ],
      en: [
        'Two icy candies together: sweetness from Ice Bonbon and a gentle herbal note from Swiss Bonbon.',
        'For people who can never get it cold enough. Very strong menthol from the first pull to the last.'
      ]
    },
    tips: {
      bs: [
        'Podijeli posudu na dvije polovine; tako povremeno osjetiš malo više bombona, pa malo više bilja.',
        'Ovo nije miks za početnike. Pravi pauze i ne forsiraj toplotu.'
      ],
      en: [
        'Split the bowl into two halves; you will catch a bit more candy, then a bit more herbs.',
        'Not a beginner mix. Take breaks and do not push the heat.'
      ]
    }
  },
  {
    id: 'summer-neon',
    slug: { bs: 'ljetni-neon', en: 'summer-neon' },
    name: { bs: 'Ljetni neon', en: 'Summer Neon' },
    parts: [{ flavor: 'adalya-love-66', pct: 60 }, { flavor: 'adalya-swiss-bonbon', pct: 40 }],
    layout: 'mixed',
    strength: 'medium',
    tags: ['ljetni', 'vocni', 'ledeni'],
    featured: false,
    description: {
      bs: [
        'Lubenica, marakuja i dinja iz Love 66, osvježene ledenim bombonom iz Swiss Bonbona.',
        'Sjajan, hladan ljetni miks: voće je jarko, a izdah ekstra svjež.'
      ],
      en: [
        'Watermelon, passion fruit and melon from Love 66, cooled down with icy candy from Swiss Bonbon.',
        'A bright, cold summer mix: vivid fruit and an extra fresh exhale.'
      ]
    },
    tips: {
      bs: [
        'Izmiješaj okuse da led bude ravnomjerno raspoređen kroz voće.',
        'Kreni sa umjerenom toplotom; mentol se jače osjeti kad se posuda previše zagrije.'
      ],
      en: [
        'Mix them so the ice spreads evenly through the fruit.',
        'Start with moderate heat; menthol gets louder when the bowl runs too hot.'
      ]
    }
  },
  {
    id: 'red-cocktail',
    slug: { bs: 'crveni-koktel', en: 'crimson-cocktail' },
    name: { bs: 'Crveni koktel', en: 'Crimson Cocktail' },
    parts: [{ flavor: 'adalya-love-66', pct: 60 }, { flavor: 'adalya-angel-lips', pct: 40 }],
    layout: 'mixed',
    strength: 'light',
    tags: ['vocni', 'bobicasti', 'ljetni'],
    featured: false,
    description: {
      bs: [
        'Oba okusa imaju lubenicu i mentu, pa se spajaju gotovo bez šava.',
        'Love 66 donosi tropski dodatak, a Angel Lips tamnu kupinu. Voćno, sočno i lagano.'
      ],
      en: [
        'Both flavors share watermelon and mint, so they come together almost seamlessly.',
        'Love 66 adds a tropical twist and Angel Lips brings dark blackberry. Fruity, juicy and easygoing.'
      ]
    },
    tips: {
      bs: [
        'Izmiješaj okuse; zajednički sastojci čine prelaz mekim.',
        'Dobar izbor za opuštenu sesiju sa srednjom, stabilnom toplotom.'
      ],
      en: [
        'Mix them together; the shared ingredients keep the blend smooth.',
        'A good pick for a relaxed session with steady, medium heat.'
      ]
    }
  },
  {
    id: 'starlit-orchard',
    slug: { bs: 'zvjezdani-vocnjak', en: 'starlit-orchard' },
    name: { bs: 'Zvjezdani voćnjak', en: 'Starlit Orchard' },
    parts: [{ flavor: 'adalya-baku-nights', pct: 60 }, { flavor: 'adalya-love-66', pct: 40 }],
    layout: 'sectors',
    strength: 'medium',
    tags: ['nocni', 'vocni', 'slatki'],
    featured: false,
    description: {
      bs: [
        'Breskva i narandža iz Baku Nights, zajedno sa lubenicom i marakujom iz Love 66.',
        'Dinja je u oba okusa, pa miks djeluje punije i bogatije voćem, uz noćnu, slatku notu.'
      ],
      en: [
        'Peach and orange from Baku Nights, joined by watermelon and passion fruit from Love 66.',
        'Melon runs through both, so the blend feels fuller and fruitier, with a sweet night-time vibe.'
      ]
    },
    tips: {
      bs: [
        'Probaj sektore: veći za Baku Nights, manji za Love 66.',
        'Ako je okus tup, malo pojačaj toplotu; ako je oštar, skloni jedan ugalj.'
      ],
      en: [
        'Try sectors: a larger one for Baku Nights and a smaller one for Love 66.',
        'If the flavor feels muted, add a little heat; if it turns harsh, take a coal off.'
      ]
    }
  },
  {
    id: 'morning-dew',
    slug: { bs: 'jutarnja-rosa', en: 'morning-dew' },
    name: { bs: 'Jutarnja rosa', en: 'Morning Dew' },
    parts: [{ flavor: 'adalya-raspberry', pct: 70 }, { flavor: 'adalya-mint', pct: 30 }],
    layout: 'mixed',
    strength: 'light',
    tags: ['vocni', 'bobicasti', 'mint'],
    featured: false,
    description: {
      bs: [
        'Slatka, sočna malina iz Raspberryja, osvježena čistom mentom iz Minta.',
        'Menta ne prekriva voće nego mu daje hladan kraj, pa je miks lagan i lako se puši.'
      ],
      en: [
        'Sweet, juicy raspberry from Raspberry, freshened up with clean mint from Mint.',
        'The mint does not cover the fruit, it just gives it a cool finish, so the blend stays light and easy.'
      ]
    },
    tips: {
      bs: [
        'Dobro izmiješaj okuse, da menta bude ravnomjerno raspoređena kroz malinu.',
        'Malina voli umjerenu toplotu; ako okus postane oštar, pomjeri ugljeve prema ivici.'
      ],
      en: [
        'Mix them well so the mint spreads evenly through the raspberry.',
        'Raspberry likes moderate heat; if it turns sharp, move the coals toward the edge.'
      ]
    }
  },
  {
    id: 'fruit-lemonade',
    slug: { bs: 'vocna-limunada', en: 'fruit-lemonade' },
    name: { bs: 'Voćna limunada', en: 'Fruit Lemonade' },
    parts: [{ flavor: 'adalya-tynky-wynky', pct: 60 }, { flavor: 'adalya-double-melon', pct: 40 }],
    layout: 'mixed',
    strength: 'light',
    tags: ['ljetni', 'citrusni', 'vocni'],
    featured: false,
    description: {
      bs: [
        'Citrusi i marakuja iz Tynky Wynkyja, smekšani medenom dinjom i lubenicom iz Double Melona.',
        'Kiselkast početak prelazi u sočnu, slatku sredinu, kao limunada sa komadićima voća.'
      ],
      en: [
        'Citrus and passion fruit from Tynky Wynky, softened by honeydew and watermelon from Double Melon.',
        'A zesty start turns into a juicy, sweet middle, like lemonade with bits of fruit in it.'
      ]
    },
    tips: {
      bs: [
        'Izmiješaj okuse; dinja smiruje kiselinu citrusa kad su ravnomjerno spojeni.',
        'Kreni sa srednjom toplotom i pusti posudu da se zagrije prije jačeg povlačenja.'
      ],
      en: [
        'Mix them together; the melon calms the citrus when they are evenly blended.',
        'Start with medium heat and let the bowl warm up before pulling harder.'
      ]
    }
  },
  {
    id: 'cherry-frost',
    slug: { bs: 'visnjin-led', en: 'cherry-frost' },
    name: { bs: 'Višnjin led', en: 'Cherry Frost' },
    parts: [{ flavor: 'adalya-cherry-mint', pct: 70 }, { flavor: 'adalya-blue-ice', pct: 30 }],
    layout: 'sectors',
    strength: 'medium',
    tags: ['vocni', 'ledeni', 'bobicasti'],
    featured: false,
    description: {
      bs: [
        'Slatko-kisela višnja iz Cherry Minta, sa borovnicom i ledom iz Blue Icea.',
        'Tamno crveno voće ostaje u prvom planu, a hlađenje raste kako se sesija razvija.'
      ],
      en: [
        'Sweet and tart cherry from Cherry Mint, joined by blueberry and ice from Blue Ice.',
        'The dark red fruit stays up front while the chill builds as the session goes on.'
      ]
    },
    tips: {
      bs: [
        'Stavi okuse u sektore: veći za Cherry Mint, manji za Blue Ice.',
        'Mentol se jače osjeti na većoj toploti, pa ne pretjeruj sa ugljevima na početku.'
      ],
      en: [
        'Pack them in sectors: a larger one for Cherry Mint and a smaller one for Blue Ice.',
        'Menthol gets louder with more heat, so go easy on the coals at the start.'
      ]
    }
  }
];
