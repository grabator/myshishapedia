/*
 * MyShishapedia - brendovi (oba jezika).
 *
 * Okus se veže za brend preko slug-a: u data/flavors.js polje `brand: 'al-fakher'`.
 * Stranica nije povezana ni sa jednim brendom; opisi su naše kratke, opšte crte,
 * bez godina osnivanja, brojki i drugih podataka koje ne možemo provjeriti.
 *
 * Polja:
 *   slug     dio adrese: /bs/brendovi/<slug>/ i /en/brands/<slug>/ (isti na oba jezika)
 *   name     ime brenda kako se piše
 *   country  { bs, en } zemlja porijekla
 *   leaf     tipična vrsta lista: 'light' (svijetli), 'dark' (tamni) ili 'both' (oba)
 *   short    { bs, en } jedna rečenica za kartice i meta opis
 *   about    { bs: [...], en: [...] } 2-3 rečenice o brendu
 *   palette  boje stranice brenda (izmišljene, NE boje pakovanja), kao kod okusa
 * Vidi docs/UPUTSTVO.md, "Kako dodati brend".
 */
window.BRANDS = [
  {
    slug: 'adalya',
    name: 'Adalya',
    country: { bs: 'Turska', en: 'Turkey' },
    leaf: 'light',
    short: {
      bs: 'Turski brend sa velikim izborom voćnih, slatkih i ledenih okusa.',
      en: 'A Turkish brand with a huge range of fruity, sweet and icy flavors.'
    },
    about: {
      bs: [
        'Adalya dolazi iz Turske i poznata je po razigranim, često neobičnim kombinacijama voća, bombona i mente.',
        'Okusi su na svijetlom listu, mekani i slatki, pa su česta prva nargila mnogih pušača.'
      ],
      en: [
        'Adalya comes from Turkey and is known for playful, often unusual blends of fruit, candy and mint.',
        'Its flavors sit on blonde leaf and lean soft and sweet, which makes them a common first bowl for a lot of smokers.'
      ]
    },
    palette: { primary: '#ff7a59', secondary: '#ffc857', accent: '#2fbf8f', background: '#2a1418', text: '#fff1ea' }
  },
  {
    slug: 'al-fakher',
    name: 'Al Fakher',
    country: { bs: 'Ujedinjeni Arapski Emirati', en: 'United Arab Emirates' },
    leaf: 'light',
    short: {
      bs: 'Brend iz Emirata, sinonim za klasične, tradicionalne okuse nargile.',
      en: 'An Emirati brand that is close to a byword for classic, traditional hookah flavors.'
    },
    about: {
      bs: [
        'Al Fakher je brend iz Ujedinjenih Arapskih Emirata koji se veže za tradicionalnu nargilu i stare orijentalne kafiće.',
        'Okusi su jednostavni i prepoznatljivi, na svijetlom listu, a njihova dvostruka jabuka je za mnoge sam okus nargile.'
      ],
      en: [
        'Al Fakher is a brand from the United Arab Emirates tied to traditional hookah and old-school Middle Eastern cafés.',
        'Its flavors are simple and easy to recognize, on blonde leaf, and for many people their double apple simply is what hookah tastes like.'
      ]
    },
    palette: { primary: '#c8323c', secondary: '#8cc63f', accent: '#e0a43a', background: '#2b130f', text: '#fff3e2' }
  },
  {
    slug: 'starbuzz',
    name: 'Starbuzz',
    country: { bs: 'SAD', en: 'United States' },
    leaf: 'light',
    short: {
      bs: 'Američki brend poznat po sočnim, slatkim okusima na svijetlom listu.',
      en: 'An American brand known for juicy, sweet flavors on blonde leaf.'
    },
    about: {
      bs: [
        'Starbuzz je brend iz Sjedinjenih Američkih Država sa širokim izborom voćnih i desertnih okusa.',
        'Okusi su obično bogati i slatki, a duhan je svijetli list, pa su pristupačni i manje iskusnim pušačima.'
      ],
      en: [
        'Starbuzz is a brand from the United States with a wide range of fruity and dessert flavors.',
        'The flavors tend to be rich and sweet on blonde leaf, which keeps them approachable for newer smokers.'
      ]
    },
    palette: { primary: '#4a6fe0', secondary: '#bcd0ff', accent: '#8fd8ff', background: '#151c44', text: '#eef3ff' }
  },
  {
    slug: 'tangiers',
    name: 'Tangiers',
    country: { bs: 'SAD', en: 'United States' },
    leaf: 'dark',
    short: {
      bs: 'Američki brend jakih okusa na tamnom listu, za iskusnije pušače.',
      en: 'An American brand of bold flavors on dark leaf, made for experienced smokers.'
    },
    about: {
      bs: [
        'Tangiers je brend iz Sjedinjenih Američkih Država koji je poznat po jakom, tamnom listu i intenzivnim okusima.',
        'Traži više pažnje pri pripremi i nije dobar izbor za prve sesije, ali ga iskusni pušači cijene zbog punog okusa.'
      ],
      en: [
        'Tangiers is a brand from the United States known for strong dark leaf and intense flavors.',
        'It asks for more care when you pack and heat it and is not the place to start, but experienced smokers love it for its full flavor.'
      ]
    },
    palette: { primary: '#1f7a55', secondary: '#9fdcc0', accent: '#e8f7f0', background: '#0c1f18', text: '#eefaf4' }
  },
  {
    slug: 'fumari',
    name: 'Fumari',
    country: { bs: 'SAD', en: 'United States' },
    leaf: 'light',
    short: {
      bs: 'Američki brend mekih, slatkih okusa na svijetlom listu.',
      en: 'An American brand of soft, sweet flavors on blonde leaf.'
    },
    about: {
      bs: [
        'Fumari je brend iz Sjedinjenih Američkih Država sa okusima koji su obično nježni, slatki i lagani.',
        'Svijetli list i umjeren karakter ga čine prijatnim za duge, opuštene sesije.'
      ],
      en: [
        'Fumari is a brand from the United States whose flavors tend to be gentle, sweet and light.',
        'Blonde leaf and an easygoing character make it pleasant for long, relaxed sessions.'
      ]
    },
    palette: { primary: '#ffd23f', secondary: '#fff4c2', accent: '#ff9f1c', background: '#3a2a0c', text: '#fffbea' }
  },
  {
    slug: 'darkside',
    name: 'Darkside',
    country: { bs: 'Rusija', en: 'Russia' },
    leaf: 'dark',
    short: {
      bs: 'Ruski brend tamnog lista, poznat po jakim okusima i miksevima.',
      en: 'A Russian dark-leaf brand known for strong flavors and mixing.'
    },
    about: {
      bs: [
        'Darkside dolazi iz Rusije i radi na tamnom listu, sa okusima koji su jaki i izraženi.',
        'Mnogi ga koriste kao osnovu ili "začin" za mikseve, posebno kad treba dodati hlađenje.'
      ],
      en: [
        'Darkside comes from Russia and works with dark leaf, with flavors that are strong and pronounced.',
        'A lot of people use it as a base or a seasoning for mixes, especially when a bowl needs more chill.'
      ]
    },
    palette: { primary: '#6d5cff', secondary: '#2f6bff', accent: '#dff4ff', background: '#0b0a24', text: '#f1f0ff' }
  },
  {
    slug: 'musthave',
    name: 'MustHave',
    country: { bs: 'Rusija', en: 'Russia' },
    leaf: 'dark',
    short: {
      bs: 'Ruski brend tamnog lista sa živim, modernim voćnim okusima.',
      en: 'A Russian dark-leaf brand with lively, modern fruit flavors.'
    },
    about: {
      bs: [
        'MustHave je brend iz Rusije na tamnom listu, sa okusima koji su sočni, jasni i često slatko-kiseli.',
        'Jači je od tipičnog svijetlog lista, pa je bolji za one koji već imaju malo iskustva.'
      ],
      en: [
        'MustHave is a Russian brand on dark leaf, with flavors that are juicy, clear and often sweet and tart.',
        'It hits harder than typical blonde leaf, so it suits people who already have some experience.'
      ]
    },
    palette: { primary: '#ff4f8b', secondary: '#ff9db8', accent: '#ffd0de', background: '#3a0c1f', text: '#fff1f6' }
  },
  {
    slug: 'sebero',
    name: 'Sebero',
    country: { bs: 'Rusija', en: 'Russia' },
    leaf: 'dark',
    short: {
      bs: 'Ruski brend tamnog lista sa razigranim voćnim i ledenim miksevima.',
      en: 'A Russian dark-leaf brand with playful fruit and icy blends.'
    },
    about: {
      bs: [
        'Sebero dolazi iz Rusije i radi na tamnom listu, sa okusima koji su često šareni spojevi voća, bombona i hlađenja.',
        'Zbog jačeg lista je namijenjen iskusnijim pušačima.'
      ],
      en: [
        'Sebero comes from Russia and works with dark leaf, often in colorful blends of fruit, candy and chill.',
        'The stronger leaf makes it a better fit for more experienced smokers.'
      ]
    },
    palette: { primary: '#ff8a3d', secondary: '#ff5d8f', accent: '#bdf0ff', background: '#2b1030', text: '#fff2ec' }
  },
  {
    slug: 'haze',
    name: 'Haze',
    country: { bs: 'SAD', en: 'United States' },
    leaf: 'light',
    short: {
      bs: 'Američki brend svježih, koktel okusa na svijetlom listu.',
      en: 'An American brand of fresh, cocktail-style flavors on blonde leaf.'
    },
    about: {
      bs: [
        'Haze je brend iz Sjedinjenih Američkih Država sa okusima koji često podsjećaju na koktele i ljetna pića.',
        'Svijetli list ga drži laganim i pitkim.'
      ],
      en: [
        'Haze is a brand from the United States with flavors that often play on cocktails and summer drinks.',
        'Blonde leaf keeps it light and easy to smoke.'
      ]
    },
    palette: { primary: '#7bd36a', secondary: '#c8f2a8', accent: '#1f8a4c', background: '#e7f7dc', text: '#13280e' }
  },
  {
    slug: 'trifecta',
    name: 'Trifecta',
    country: { bs: 'SAD', en: 'United States' },
    leaf: 'both',
    short: {
      bs: 'Američki brend sa okusima i na svijetlom i na tamnom listu.',
      en: 'An American brand with flavors on both blonde and dark leaf.'
    },
    about: {
      bs: [
        'Trifecta je brend iz Sjedinjenih Američkih Država koji isti okus često nudi i na svijetlom i na tamnom listu.',
        'Tako možeš izabrati blažu ili jaču verziju, zavisno od iskustva i raspoloženja.'
      ],
      en: [
        'Trifecta is a brand from the United States that often offers the same flavor on both blonde and dark leaf.',
        'That lets you pick a milder or a stronger version, depending on your experience and mood.'
      ]
    },
    palette: { primary: '#e8455a', secondary: '#f6e7c8', accent: '#ffffff', background: '#2a1a1e', text: '#fff6ef' }
  },
  {
    slug: 'nakhla',
    name: 'Nakhla',
    country: { bs: 'Egipat', en: 'Egypt' },
    leaf: 'dark',
    short: {
      bs: 'Egipatski brend tradicionalnog moassela, poznat po jakoj dvostrukoj jabuci.',
      en: 'An Egyptian brand of traditional moassel, known for its strong double apple.'
    },
    about: {
      bs: [
        'Nakhla dolazi iz Egipta i jedan je od brendova koji se vežu za tradicionalnu, staru nargilu.',
        'Duhan je grublji i jači od modernih svijetlih listova, a okusi su jednostavni i klasični.'
      ],
      en: [
        'Nakhla comes from Egypt and is one of the brands tied to traditional, old-school hookah.',
        'The tobacco is coarser and stronger than modern blonde leaf, and the flavors are simple and classic.'
      ]
    },
    palette: { primary: '#c8323c', secondary: '#e8c27a', accent: '#6fae3a', background: '#1e0f0a', text: '#fff2e0' }
  },
  {
    slug: 'mazaya',
    name: 'Mazaya',
    country: { bs: 'Jordan', en: 'Jordan' },
    leaf: 'light',
    short: {
      bs: 'Jordanski brend sa mekanim, pristupačnim voćnim i mint okusima.',
      en: 'A Jordanian brand with soft, approachable fruit and mint flavors.'
    },
    about: {
      bs: [
        'Mazaya je brend iz Jordana, čest u kafićima Bliskog istoka i Evrope.',
        'Okusi su na svijetlom listu, mekani i jednostavni, sa puno kombinacija voća i mente.'
      ],
      en: [
        'Mazaya is a brand from Jordan, common in cafés across the Middle East and Europe.',
        'Its flavors sit on blonde leaf and are soft and simple, with lots of fruit and mint combinations.'
      ]
    },
    palette: { primary: '#3fae6a', secondary: '#f2d24a', accent: '#e8574a', background: '#0f1f14', text: '#effff2' }
  },
  {
    slug: 'al-waha',
    name: 'Al Waha',
    country: { bs: 'Jordan', en: 'Jordan' },
    leaf: 'light',
    short: {
      bs: 'Jordanski brend poznat po voćnim miksevima i okusu Big Boy.',
      en: 'A Jordanian brand known for fruit blends and its Big Boy flavor.'
    },
    about: {
      bs: [
        'Al Waha dolazi iz Jordana i nudi klasične okuse na svijetlom listu.',
        'Najpoznatiji je po voćnim miksevima sa ledom, ali ima i tradicionalne kombinacije voća i mente.'
      ],
      en: [
        'Al Waha comes from Jordan and offers classic flavors on blonde leaf.',
        'It is best known for icy fruit blends, but it also has traditional fruit and mint pairings.'
      ]
    },
    palette: { primary: '#e8434f', secondary: '#7fd3f0', accent: '#f2c230', background: '#1a0d12', text: '#fff0f2' }
  },
  {
    slug: 'afzal',
    name: 'Afzal',
    country: { bs: 'Indija', en: 'India' },
    leaf: 'light',
    short: {
      bs: 'Indijski brend sa neobičnim, začinskim i cvjetnim okusima.',
      en: 'An Indian brand with unusual, spiced and floral flavors.'
    },
    about: {
      bs: [
        'Afzal dolazi iz Indije i poznat je po okusima inspirisanim indijskom kuhinjom i tradicijom.',
        'Najpoznatiji je Pan Raas, okus inspirisan indijskim "paan" zalogajem od betel lista, začina i ruže.'
      ],
      en: [
        'Afzal comes from India and is known for flavors inspired by Indian cuisine and tradition.',
        'Its best known flavor is Pan Raas, inspired by the Indian "paan" made with betel leaf, spices and rose.'
      ]
    },
    palette: { primary: '#3f9a4a', secondary: '#e86a8a', accent: '#f2c230', background: '#0f1a0e', text: '#f4ffe9' }
  },
  {
    slug: 'serbetli',
    name: 'Serbetli',
    country: { bs: 'Turska', en: 'Turkey' },
    leaf: 'light',
    short: {
      bs: 'Turski brend sa puno voćnih okusa sa ledom.',
      en: 'A Turkish brand with lots of fruit flavors on ice.'
    },
    about: {
      bs: [
        'Serbetli je brend iz Turske, sa okusima na svijetlom listu.',
        'Posebno su popularni okusi sa oznakom "Ice", gdje je voće spojeno sa mentolom.'
      ],
      en: [
        'Serbetli is a brand from Turkey with flavors on blonde leaf.',
        'Its "Ice" flavors, where fruit is paired with menthol, are especially popular.'
      ]
    },
    palette: { primary: '#4fb8e8', secondary: '#e8434f', accent: '#ffffff', background: '#0b1a26', text: '#eefaff' }
  },
  {
    slug: 'revoshi',
    name: 'Revoshi',
    country: { bs: 'Njemačka (proizvodnja u Turskoj)', en: 'Germany (made in Turkey)' },
    leaf: 'light',
    short: {
      bs: 'Njemački brend sa voćnim okusima i miksevima, proizveden u Turskoj.',
      en: 'A German brand of fruit flavors and blends, made in Turkey.'
    },
    about: {
      bs: [
        'Revoshi je njemački brend čiji se duhan proizvodi u Turskoj, na svijetlom Virginia listu.',
        'Poznat je po voćnim miksevima i jačim verzijama klasičnih okusa.'
      ],
      en: [
        'Revoshi is a German brand whose tobacco is made in Turkey on blonde Virginia leaf.',
        'It is known for fruit blends and stronger takes on classic flavors.'
      ]
    },
    palette: { primary: '#ff8a3d', secondary: '#ffd36b', accent: '#3fbf8f', background: '#22120a', text: '#fff4e8' }
  },
  {
    slug: '187-strassenbande',
    name: '187 Strassenbande',
    country: { bs: 'Njemačka', en: 'Germany' },
    leaf: 'light',
    short: {
      bs: 'Njemački brend vezan za istoimenu hip-hop grupu, sa voćnim miksevima.',
      en: 'A German brand tied to the hip-hop crew of the same name, with fruit blends.'
    },
    about: {
      bs: [
        '187 Strassenbande je njemački brend koji nosi ime poznate hamburške hip-hop grupe.',
        'Okusi su na svijetlom listu, uglavnom voćni miksevi sa neobičnim imenima.'
      ],
      en: [
        '187 Strassenbande is a German brand named after the well known Hamburg hip-hop crew.',
        'Its flavors sit on blonde leaf and are mostly fruit blends with unusual names.'
      ]
    },
    palette: { primary: '#e8304a', secondary: '#1e1e1e', accent: '#ffd23f', background: '#141414', text: '#f5f5f5' }
  },
  {
    slug: 'holster',
    name: 'Holster',
    country: { bs: 'Njemačka', en: 'Germany' },
    leaf: 'light',
    short: {
      bs: 'Njemački brend sa voćnim okusima, često sa ledom.',
      en: 'A German brand with fruit flavors, often on ice.'
    },
    about: {
      bs: [
        'Holster je njemački brend sa okusima na svijetlom listu.',
        'Mnogi okusi imaju hlađenje i neobično voće, kao što je kaktus.'
      ],
      en: [
        'Holster is a German brand with flavors on blonde leaf.',
        'Many of its flavors come with cooling and unusual fruit, such as cactus.'
      ]
    },
    palette: { primary: '#5ab85a', secondary: '#e85a9a', accent: '#cdefff', background: '#0e1a10', text: '#effff0' }
  },
  {
    slug: 'true-passion',
    name: 'True Passion',
    country: { bs: 'Njemačka', en: 'Germany' },
    leaf: 'light',
    short: {
      bs: 'Njemački brend sa bogatim voćnim miksevima.',
      en: 'A German brand with rich fruit blends.'
    },
    about: {
      bs: [
        'True Passion je njemački brend sa okusima na svijetlom listu.',
        'Okusi su najčešće slojeviti voćni miksevi sa puno sastojaka.'
      ],
      en: [
        'True Passion is a German brand with flavors on blonde leaf.',
        'Its flavors are usually layered fruit blends with many ingredients.'
      ]
    },
    palette: { primary: '#e85a9a', secondary: '#9b6cf0', accent: '#ffd23f', background: '#1a0c1e', text: '#fff0fa' }
  },
  {
    slug: 'nameless',
    name: 'Nameless',
    country: { bs: 'Njemačka', en: 'Germany' },
    leaf: 'light',
    short: {
      bs: 'Njemački brend sa voćnim okusima i mentom.',
      en: 'A German brand with fruit and mint flavors.'
    },
    about: {
      bs: [
        'Nameless je njemački brend sa okusima na svijetlom listu.',
        'Najpoznatiji je Black Nana, kombinacija tamnog grožđa i mente.'
      ],
      en: [
        'Nameless is a German brand with flavors on blonde leaf.',
        'Its best known flavor is Black Nana, a blend of dark grape and mint.'
      ]
    },
    palette: { primary: '#5a2a7a', secondary: '#2fae78', accent: '#c9a0ff', background: '#100a16', text: '#f4eeff' }
  }
];
