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
  },
  {
    id: 'pink-supernova',
    slug: { bs: 'ruzicasta-supernova', en: 'pink-supernova' },
    name: { bs: 'Ružičasta supernova', en: 'Pink Supernova' },
    parts: [{ flavor: 'musthave-pinkman', pct: 80 }, { flavor: 'darkside-supernova', pct: 20 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['vocni', 'bobicasti', 'ledeni'],
    featured: false,
    description: {
      bs: [
        'Slatko-kiseli roze grejpfrut i bobice iz Pinkmana, a preko njih mala doza Supernove koja sve zaledi.',
        'Supernova je samo petina posude: dovoljno da izdah postane leden, a da voće ostane glavno.'
      ],
      en: [
        'Sweet and tart pink grapefruit and berries from Pinkman, with a small dose of Supernova that freezes it all.',
        'Supernova is only a fifth of the bowl: enough to turn the exhale icy while the fruit stays in charge.'
      ]
    },
    tips: {
      bs: [
        'Dobro izmiješaj okuse, da se Supernova rasporedi ravnomjerno i ne dođe u jednom naletu.',
        'Oba okusa su na tamnom listu, pa je miks jak: kreni sa manje toplote i dodaj po potrebi.'
      ],
      en: [
        'Mix the two well so the Supernova spreads evenly instead of hitting all at once.',
        'Both flavors sit on dark leaf, so this mix is strong: start with less heat and add more if needed.'
      ]
    }
  },
  {
    id: 'gummy-glacier',
    slug: { bs: 'ledeni-medo', en: 'gummy-glacier' },
    name: { bs: 'Ledeni medo', en: 'Gummy Glacier' },
    parts: [{ flavor: 'fumari-white-gummi-bear', pct: 70 }, { flavor: 'tangiers-cane-mint', pct: 30 }],
    layout: 'sectors',
    strength: 'medium',
    tags: ['bombon', 'slatki', 'ledeni'],
    featured: false,
    description: {
      bs: [
        'Slatki gumeni bomboni sa ananasom i citrusom, a uz njih hladan pepermint iz Cane Minta.',
        'Bomboni su na udahu, a pepermint stiže na izdahu, kao kad pojedeš bombon pa popiješ ledenu vodu.'
      ],
      en: [
        'Sweet gummy candy with pineapple and citrus, joined by cold peppermint from Cane Mint.',
        'The candy comes through on the inhale and the peppermint on the exhale, like eating a sweet and then sipping ice water.'
      ]
    },
    tips: {
      bs: [
        'Stavi okuse u sektore: veći za White Gummi Bear, manji za Cane Mint.',
        'Cane Mint je na tamnom listu i jak je, pa ga ne povećavaj preko trećine posude.'
      ],
      en: [
        'Pack them in sectors: a larger one for White Gummi Bear and a smaller one for Cane Mint.',
        'Cane Mint is strong dark leaf, so keep it under a third of the bowl.'
      ]
    }
  },
  {
    id: 'raspberry-blush',
    slug: { bs: 'malinovo-rumenilo', en: 'raspberry-blush' },
    name: { bs: 'Malinovo rumenilo', en: 'Raspberry Blush' },
    parts: [{ flavor: 'musthave-pinkman', pct: 60 }, { flavor: 'adalya-raspberry', pct: 40 }],
    layout: 'mixed',
    strength: 'medium',
    tags: ['vocni', 'bobicasti', 'slatki'],
    featured: false,
    description: {
      bs: [
        'Pinkmanov roze grejpfrut i jagoda, pojačani slatkom malinom iz Adalya Raspberryja.',
        'Malina je zajednička nota oba okusa, pa se spajaju glatko, a grejpfrut drži miks svježim.'
      ],
      en: [
        'Pinkman’s pink grapefruit and strawberry, boosted with sweet raspberry from Adalya Raspberry.',
        'Raspberry is the note both flavors share, so they blend smoothly while the grapefruit keeps it fresh.'
      ]
    },
    tips: {
      bs: [
        'Izmiješaj okuse prije punjenja, da malina i grejpfrut budu u svakom dimu.',
        'Ako želiš malo hlađenja, dodaj prstohvat mente ili Supernove.'
      ],
      en: [
        'Mix the flavors before you pack, so raspberry and grapefruit show up in every pull.',
        'If you want a bit of chill, add a pinch of mint or Supernova.'
      ]
    }
  },
  {
    id: 'old-bazaar',
    slug: { bs: 'stari-bazar', en: 'old-bazaar' },
    name: { bs: 'Stari bazar', en: 'Old Bazaar' },
    parts: [{ flavor: 'al-fakher-double-apple', pct: 70 }, { flavor: 'adalya-mint', pct: 30 }],
    layout: 'mixed',
    strength: 'light',
    tags: ['klasicni', 'vocni', 'mint'],
    featured: false,
    description: {
      bs: [
        'Klasična dvostruka jabuka sa anisom, osvježena čistom mentom.',
        'Spoj koji podsjeća na stare čajdžinice: topla, blago začinska jabuka i lagan, svjež izdah.'
      ],
      en: [
        'Classic double apple with anise, freshened up with clean mint.',
        'A pairing that recalls old tea houses: warm, gently spiced apple and a light, fresh exhale.'
      ]
    },
    tips: {
      bs: [
        'Dobro izmiješaj okuse, pa rastresito napuni posudu.',
        'Ako želiš više mente, idi do pola-pola, ali ne preko toga, da anis ne nestane.'
      ],
      en: [
        'Mix the flavors well, then pack the bowl loosely.',
        'If you want more mint, go up to half and half, but not past that, or the anise disappears.'
      ]
    }
  },
  {
    id: 'blue-shake',
    slug: { bs: 'plavi-sejk', en: 'blue-shake' },
    name: { bs: 'Plavi šejk', en: 'Blue Shake' },
    parts: [{ flavor: 'trifecta-peppermint-shake', pct: 50 }, { flavor: 'starbuzz-blue-mist', pct: 50 }],
    layout: 'mixed',
    strength: 'light',
    tags: ['desertni', 'slatki', 'bobicasti'],
    featured: false,
    description: {
      bs: [
        'Kremast vanila šejk sa pepermintom, pomiješan sa slatkom borovnicom iz Blue Mista.',
        'Rezultat liči na borovnica milkshake sa daškom mente: sladak, mekan i lagano hladan.'
      ],
      en: [
        'A creamy vanilla and peppermint shake mixed with sweet blueberry from Blue Mist.',
        'It ends up tasting like a blueberry milkshake with a hint of mint: sweet, soft and lightly cool.'
      ]
    },
    tips: {
      bs: [
        'Izmiješaj okuse pola-pola, da vanila i borovnica budu u ravnoteži.',
        'Desertni okusi lako zagore, pa drži umjerenu toplotu.'
      ],
      en: [
        'Mix them half and half so the vanilla and blueberry stay balanced.',
        'Dessert flavors scorch easily, so keep the heat moderate.'
      ]
    }
  },
  {
    id: 'garden-margarita',
    slug: { bs: 'vrtna-margarita', en: 'garden-margarita' },
    name: { bs: 'Vrtna margarita', en: 'Garden Margarita' },
    parts: [{ flavor: 'haze-cucumberita', pct: 70 }, { flavor: 'adalya-mint', pct: 30 }],
    layout: 'mixed',
    strength: 'light',
    tags: ['osvjezavajuci', 'ljetni', 'mint'],
    featured: false,
    description: {
      bs: [
        'Krastavac i limeta iz Cucumberite, sa svježom mentom kao u ljetnom koktelu.',
        'Zelen, lagan i nimalo težak miks za vruće popodne.'
      ],
      en: [
        'Cucumber and lime from Cucumberita with fresh mint, like a summer cocktail.',
        'A green, light and easygoing mix for a hot afternoon.'
      ]
    },
    tips: {
      bs: [
        'Izmiješaj okuse i napuni posudu rastresito, da krastavac ostane nježan.',
        'Za još više svježine dodaj malo Supernove umjesto dijela mente.'
      ],
      en: [
        'Mix the flavors and pack loosely so the cucumber stays delicate.',
        'For even more freshness, swap part of the mint for a little Supernova.'
      ]
    }
  },
  {
    id: 'cherry-cola',
    slug: { bs: 'visnjeva-kola', en: 'cherry-cola-mint' },
    name: { bs: 'Višnjeva kola', en: 'Cherry Cola Mint' },
    parts: [{ flavor: 'darkside-cola', pct: 70 }, { flavor: 'adalya-cherry-mint', pct: 30 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['slatki', 'mint', 'pice'],
    featured: false,
    description: {
      bs: [
        'Karamel kola iz Darksidea sa slatkom višnjom i svježim krajem iz Cherry Minta, kao kola sa sirupom od višnje i kockom leda.',
        'Kola ostaje glavna, a višnja i menta je osvježe, pa ni duža sesija nije teška.'
      ],
      en: [
        'Darkside\'s caramel cola with sweet cherry and a fresh finish from Cherry Mint, like a cola with cherry syrup and an ice cube.',
        'The cola stays in charge while the cherry and mint keep it fresh, so even a long session never gets heavy.'
      ]
    },
    tips: {
      bs: [
        'Darkside je tamni list: izmiješaj okuse, napuni posudu rastresito i kreni sa manje toplote.',
        'Ako voliš jaču kolu, idi na 80/20; za više višnje, 60/40.'
      ],
      en: [
        'Darkside is dark leaf: mix the flavors, pack loosely and start with less heat.',
        'For a stronger cola go 80/20; for more cherry, 60/40.'
      ]
    }
  },
  {
    id: 'kashmir-garden',
    slug: { bs: 'kasmirski-vrt', en: 'kashmir-garden' },
    name: { bs: 'Kašmirski vrt', en: 'Kashmir Garden' },
    parts: [{ flavor: 'tangiers-kashmir-peach', pct: 50 }, { flavor: 'fumari-ambrosia', pct: 50 }],
    layout: 'sectors',
    strength: 'medium',
    tags: ['vocni', 'slatki', 'zacinski'],
    featured: false,
    description: {
      bs: [
        'Začinska breskva iz Tangiersa i slatka, kremasta dinja iz Ambrosije: voćni miks sa toplim, večernjim karakterom.',
        'Ambrosia ublaži jačinu tamnog lista, a Kashmir Peach daje dubinu koju sama dinja nema.'
      ],
      en: [
        'Spiced peach from Tangiers and sweet, creamy melon from Ambrosia: a fruit mix with a warm, evening feel.',
        'Ambrosia softens the dark leaf, while Kashmir Peach adds a depth melon alone does not have.'
      ]
    },
    tips: {
      bs: [
        'Puni u sektorima: Kashmir Peach na jednu, Ambrosiju na drugu polovinu posude, pa se okusi smjenjuju dok se toplota pomjera.',
        'Tangiers traži strpljenje: daj posudi nekoliko minuta predgrijavanja.'
      ],
      en: [
        'Pack in sectors: Kashmir Peach on one half of the bowl and Ambrosia on the other, so the flavors trade places as the heat moves.',
        'Tangiers needs patience: give the bowl a few minutes to heat up.'
      ]
    }
  },
  {
    id: 'purple-lemonade',
    slug: { bs: 'ljubicasta-limunada', en: 'purple-lemonade' },
    name: { bs: 'Ljubičasta limunada', en: 'Purple Lemonade' },
    parts: [{ flavor: 'starbuzz-pirates-cave', pct: 70 }, { flavor: 'haze-purple-krush', pct: 30 }],
    layout: 'mixed',
    strength: 'light',
    tags: ['citrusni', 'ljetni', 'osvjezavajuci'],
    featured: false,
    description: {
      bs: [
        'Limun i limeta iz Pirate\'s Cave sa slatkom sodom od grožđa iz Purple Krusha: ljubičasta limunada za vruće dane.',
        'Citrus je glavni, a grožđe ga zasladi i zaokruži.'
      ],
      en: [
        'Lemon and lime from Pirate\'s Cave with the sweet grape soda of Purple Krush: a purple lemonade for hot days.',
        'Citrus leads, and the grape sweetens and rounds it off.'
      ]
    },
    tips: {
      bs: [
        'Oba okusa su svijetli list, pa je miks lagan i dobar za početnike.',
        'Za ledeniju verziju dodaj malo Twice the Ice umjesto dijela Pirate\'s Cave.'
      ],
      en: [
        'Both flavors are blonde leaf, so the mix is light and beginner-friendly.',
        'For an icier take, swap a little Pirate\'s Cave for Twice the Ice.'
      ]
    }
  },
  // ---- MUSTHAVE recepti ----
  {
    id: 'island-colada',
    slug: { bs: 'ostrvska-kolada', en: 'island-colada' },
    name: { bs: 'Ostrvska kolada', en: 'Island Colada' },
    parts: [{ flavor: 'musthave-tropic-juice', pct: 60 }, { flavor: 'musthave-coconut-shake', pct: 40 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['tropski', 'desertni', 'ljetni'],
    featured: false,
    description: {
      bs: [
        'Ananas i marakuja iz Tropic Juice, umotani u kremasti kokos iz Coconut Shake.',
        'Okus pina colade bez alkohola: sočno tropsko voće sprijeda, mliječni kokos na izdahu.'
      ],
      en: [
        'Pineapple and passion fruit from Tropic Juice, wrapped in the creamy coconut of Coconut Shake.',
        'A virgin pina colada: juicy tropical fruit up front, milky coconut on the exhale.'
      ]
    },
    tips: {
      bs: [
        'Izmiješaj dobro, da se kokos rasporedi kroz cijelu posudu.',
        'Ako želiš ljetniju verziju, dodaj malo Frostyja (do 15%).'
      ],
      en: [
        'Mix well so the coconut is spread through the whole bowl.',
        'For a more summery version, add a little Frosty (up to 15%).'
      ]
    }
  },
  {
    id: 'peach-iced-tea',
    slug: { bs: 'ledeni-caj-od-breskve', en: 'peach-iced-tea' },
    name: { bs: 'Ledeni čaj od breskve', en: 'Peach Iced Tea' },
    parts: [{ flavor: 'musthave-sweet-peach', pct: 60 }, { flavor: 'musthave-earl-grey', pct: 40 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['vocni', 'caj', 'osvjezavajuci'],
    featured: false,
    description: {
      bs: [
        'Zrela breskva i crni čaj sa bergamotom: okus ledenog čaja od breskve.',
        'Breskva daje slatkoću, a Earl Grey drži miks suhim i elegantnim.'
      ],
      en: [
        'Ripe peach and black tea with bergamot: the taste of a peach iced tea.',
        'Peach brings the sweetness and Earl Grey keeps the mix dry and elegant.'
      ]
    },
    tips: {
      bs: [
        'Blaga toplota je ključna: čajne note brzo izgore.',
        'Za ledeniju verziju zamijeni 10% breskve sa Frostyjem.'
      ],
      en: [
        'Gentle heat is key: tea notes burn quickly.',
        'For an icier version, swap 10% of the peach for Frosty.'
      ]
    }
  },
  {
    id: 'banana-toffee',
    slug: { bs: 'banana-u-karameli', en: 'banana-toffee' },
    name: { bs: 'Banana u karameli', en: 'Banana Toffee' },
    parts: [{ flavor: 'musthave-banana-mama', pct: 60 }, { flavor: 'musthave-candy-cow', pct: 40 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['desertni', 'slatki', 'tropski'],
    featured: false,
    description: {
      bs: [
        'Zrela banana iz Banana Mama i mliječna karamela iz Candy Cow.',
        'Gust, slatki desert, kao banana preliven karamelom.'
      ],
      en: [
        'Ripe banana from Banana Mama and milky caramel from Candy Cow.',
        'A thick, sweet dessert, like banana drizzled with toffee.'
      ]
    },
    tips: {
      bs: [
        'Pakuj rastresito: oba okusa su gusta i slatka.',
        'Uz kafu je savršen kraj večeri.'
      ],
      en: [
        'Pack it loose: both flavors are thick and sweet.',
        'With coffee it is a perfect end to the evening.'
      ]
    }
  },
  {
    id: 'arctic-watermelon',
    slug: { bs: 'arkticka-lubenica', en: 'arctic-watermelon' },
    name: { bs: 'Arktička lubenica', en: 'Arctic Watermelon' },
    parts: [{ flavor: 'musthave-watermelon', pct: 80 }, { flavor: 'musthave-frosty', pct: 20 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['vocni', 'ledeni', 'ljetni'],
    featured: false,
    description: {
      bs: [
        'Sočna lubenica i čisto hlađenje bez mente.',
        'Lubenica ostaje glavna, a Frosty je samo ohladi, kao da je izvađena iz frižidera.'
      ],
      en: [
        'Juicy watermelon and pure cooling with no mint.',
        'Watermelon stays the star and Frosty simply chills it, like it just came out of the fridge.'
      ]
    },
    tips: {
      bs: [
        'Frosty je jak, pa 20% sasvim dovoljno hladi.',
        'Izmiješaj dobro da hlađenje bude ravnomjerno od početka do kraja.'
      ],
      en: [
        'Frosty is strong, so 20% is plenty of chill.',
        'Mix well so the cooling is even from start to finish.'
      ]
    }
  },
  {
    id: 'raspberry-cheesecake',
    slug: { bs: 'cheesecake-sa-malinom', en: 'raspberry-cheesecake' },
    name: { bs: 'Cheesecake sa malinom', en: 'Raspberry Cheesecake' },
    parts: [{ flavor: 'musthave-cheesecake', pct: 60 }, { flavor: 'musthave-raspberry', pct: 40 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['desertni', 'bobicasti', 'slatki'],
    featured: false,
    description: {
      bs: [
        'Kremasti cheesecake sa vanilom i limunom, preliven džemom od malina.',
        'Malina daje kiselkast kontrast koji kolač čini lakšim.'
      ],
      en: [
        'Creamy cheesecake with vanilla and lemon, topped with raspberry jam.',
        'Raspberry adds a tangy contrast that makes the cake feel lighter.'
      ]
    },
    tips: {
      bs: [
        'Za više maline idi na 50:50.',
        'Dobro ide uz čaj ili kafu.'
      ],
      en: [
        'For more raspberry, go 50:50.',
        'Goes well with tea or coffee.'
      ]
    }
  },
  {
    id: 'cola-float',
    slug: { bs: 'kola-sa-sladoledom', en: 'cola-float' },
    name: { bs: 'Kola sa sladoledom', en: 'Cola Float' },
    parts: [{ flavor: 'musthave-cola', pct: 60 }, { flavor: 'musthave-ice-cream', pct: 40 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['pice', 'desertni', 'slatki'],
    featured: false,
    description: {
      bs: [
        'Gazirana kola i kugla mliječnog sladoleda u istoj čaši.',
        'Kola je svježa i pjenušava, a sladoled joj daje kremast, mekan kraj.'
      ],
      en: [
        'Fizzy cola and a scoop of milk ice cream in the same glass.',
        'The cola is fresh and sparkling, and the ice cream gives it a creamy, soft finish.'
      ]
    },
    tips: {
      bs: [
        'Ne pregrijavaj: kremaste note brzo postanu teške.',
        'Probaj i sa Cherry-Cola umjesto Cole.'
      ],
      en: [
        'Do not overheat it: creamy notes turn heavy fast.',
        'Also try it with Cherry-Cola instead of Cola.'
      ]
    }
  },
  {
    id: 'winter-spell',
    slug: { bs: 'zimska-carolija', en: 'winter-spell' },
    name: { bs: 'Zimska čarolija', en: 'Winter Spell' },
    parts: [{ flavor: 'musthave-mulled-wine', pct: 60 }, { flavor: 'musthave-mandarin', pct: 40 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['zacinski', 'citrusni', 'nocni'],
    featured: false,
    description: {
      bs: [
        'Kuhano vino sa začinima i slatke kriške mandarine.',
        'Topao, mirisan miks za hladne večeri i praznike.'
      ],
      en: [
        'Mulled wine with spices and sweet mandarin slices.',
        'A warm, fragrant mix for cold evenings and the holidays.'
      ]
    },
    tips: {
      bs: [
        'Blaga toplota, da cimet ne postane gorak.',
        'Uz Yolku (10%) dobiješ još prazničniji miris.'
      ],
      en: [
        'Keep the heat gentle so the cinnamon does not turn bitter.',
        'Add Yolka (10%) for an even more festive aroma.'
      ]
    }
  },
  {
    id: 'mango-mojito',
    slug: { bs: 'mango-mohito', en: 'mango-mojito' },
    name: { bs: 'Mango mohito', en: 'Mango Mojito' },
    parts: [{ flavor: 'musthave-mango-sling', pct: 70 }, { flavor: 'musthave-ice-mint', pct: 30 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['tropski', 'mint', 'osvjezavajuci'],
    featured: false,
    description: {
      bs: [
        'Mango limunada iz Mango Sling i ledena menta iz Ice Mint.',
        'Tropsko i svježe, kao mohito sa mangom.'
      ],
      en: [
        'Mango lemonade from Mango Sling and icy mint from Ice Mint.',
        'Tropical and fresh, like a mango mojito.'
      ]
    },
    tips: {
      bs: [
        'Za manje hlađenja idi na 80:20.',
        'Dodaj malo Lemon-Lime ako želiš kiseliji mohito.'
      ],
      en: [
        'For less cooling, go 80:20.',
        'Add a little Lemon-Lime for a sharper mojito.'
      ]
    }
  },
  {
    id: 'pink-spritz',
    slug: { bs: 'roze-pjenusac', en: 'pink-spritz' },
    name: { bs: 'Roze pjenušac', en: 'Pink Spritz' },
    parts: [{ flavor: 'musthave-pinkman', pct: 70 }, { flavor: 'musthave-prosecco', pct: 30 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['vocni', 'pice', 'bobicasti'],
    featured: false,
    description: {
      bs: [
        'Pinkman (grejpfrut, jagoda, malina) i lagani pjenušac.',
        'Voćno i pjenušavo, kao roze koktel na ljetnoj terasi.'
      ],
      en: [
        'Pinkman (grapefruit, strawberry, raspberry) with a light sparkling wine.',
        'Fruity and fizzy, like a pink cocktail on a summer terrace.'
      ]
    },
    tips: {
      bs: [
        'Izmiješaj dobro da se prosecco osjeti kroz cijelu sesiju.',
        'Ljeti dodaj 10% Frostyja.'
      ],
      en: [
        'Mix well so the prosecco comes through the whole session.',
        'In summer, add 10% Frosty.'
      ]
    }
  },
  {
    id: 'grandmas-apple-pie',
    slug: { bs: 'bakina-pita-od-jabuka', en: 'grandmas-apple-pie' },
    name: { bs: 'Bakina pita od jabuka', en: 'Grandma\'s Apple Pie' },
    parts: [{ flavor: 'musthave-charlotte-pie', pct: 70 }, { flavor: 'musthave-cinnamon', pct: 30 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['desertni', 'zacinski', 'slatki'],
    featured: false,
    description: {
      bs: [
        'Topao kolač sa karamelizovanom jabukom i cejlonski cimet.',
        'Miris pite od jabuka koja se upravo peče.'
      ],
      en: [
        'A warm cake with caramelised apple and Ceylon cinnamon.',
        'The smell of an apple pie fresh out of the oven.'
      ]
    },
    tips: {
      bs: [
        'Cimet je jak, pa ne idi preko 30%.',
        'Uz Ice Cream (dio Charlotte Pie) dobiješ pitu sa sladoledom.'
      ],
      en: [
        'Cinnamon is strong, so do not go over 30%.',
        'Swap part of the Charlotte Pie for Ice Cream for pie à la mode.'
      ]
    }
  },
  {
    id: 'forest-frost',
    slug: { bs: 'sumski-led', en: 'forest-frost' },
    name: { bs: 'Šumski led', en: 'Forest Frost' },
    parts: [{ flavor: 'musthave-forest-berries', pct: 70 }, { flavor: 'musthave-ice-mint', pct: 30 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['bobicasti', 'ledeni', 'mint'],
    featured: false,
    description: {
      bs: [
        'Šumske bobice sa kupinom i ledena menta.',
        'Sočno i hladno, kao bobice ubrane u jutarnjoj rosi.'
      ],
      en: [
        'Forest berries with blackberry and icy mint.',
        'Juicy and cold, like berries picked in the morning dew.'
      ]
    },
    tips: {
      bs: [
        'Za čisto hlađenje bez mente zamijeni Ice Mint sa Frostyjem (20%).',
        'Pakuj rastresito i drži umjerenu toplotu.'
      ],
      en: [
        'For pure cooling without mint, swap Ice Mint for Frosty (20%).',
        'Pack it loose and keep the heat moderate.'
      ]
    }
  },
  {
    id: 'cookies-and-cream',
    slug: { bs: 'keks-i-krema', en: 'cookies-and-cream' },
    name: { bs: 'Keks i krema', en: 'Cookies & Cream' },
    parts: [{ flavor: 'musthave-cookie', pct: 60 }, { flavor: 'musthave-ice-cream', pct: 40 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['desertni', 'slatki'],
    featured: false,
    description: {
      bs: [
        'Čokoladni keks sa filom i mliječni sladoled.',
        'Okus poznatog sladoleda sa komadićima keksa.'
      ],
      en: [
        'Chocolate cookie with filling and milk ice cream.',
        'The taste of the famous cookies and cream ice cream.'
      ]
    },
    tips: {
      bs: [
        'Najbolje uz kafu ili mlijeko.',
        'Za mint verziju dodaj 20% Choco Mint.'
      ],
      en: [
        'Best with coffee or milk.',
        'For a mint version, add 20% Choco Mint.'
      ]
    }
  },
  {
    id: 'green-garden',
    slug: { bs: 'zelena-basta', en: 'green-garden' },
    name: { bs: 'Zelena bašta', en: 'Green Garden' },
    parts: [{ flavor: 'musthave-kiwi-smoothie', pct: 60 }, { flavor: 'musthave-cucunade', pct: 40 }],
    layout: 'mixed',
    strength: 'strong',
    tags: ['vocni', 'osvjezavajuci', 'ljetni'],
    featured: false,
    description: {
      bs: [
        'Kivi, jabuka i pepermint iz Kiwi Smoothie, uz limunadu od krastavca.',
        'Zeleno, kiselkasto i jako osvježavajuće.'
      ],
      en: [
        'Kiwi, apple and peppermint from Kiwi Smoothie, with cucumber lemonade.',
        'Green, tangy and very refreshing.'
      ]
    },
    tips: {
      bs: [
        'Savršen za vruće ljetne dane.',
        'Dodaj malo Ice Mint ako želiš još svježije.'
      ],
      en: [
        'Perfect for hot summer days.',
        'Add a little Ice Mint for even more freshness.'
      ]
    }
  }
];
