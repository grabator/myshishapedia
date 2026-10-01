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
  }
];
