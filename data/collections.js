/*
 * MyShishapedia - kolekcije okusa (oba jezika).
 *
 * Okusi ulaze u kolekciju AUTOMATSKI prema pravilu (rule), pa novi okusi sami
 * dođu na pravo mjesto. Pravilo gleda profile (0-10) i tags okusa:
 *
 *   rule: {
 *     min:     { cooling: 8 }            svaka vrijednost profila mora biti >= ovoga
 *     max:     { cooling: 6 }            svaka vrijednost profila mora biti <= ovoga
 *     anyTags: ['ledeni']                okus mora imati bar jedan od ovih tagova
 *     allTags: ['vocni']                 okus mora imati sve ove tagove
 *     anyOf:   [ {pravilo}, {pravilo} ]  dovoljno je da vrijedi bilo koje od ovih pod-pravila
 *   }
 *
 * Ručne izmjene (imaju prednost nad pravilom):
 *   include: ['adalya-dubai']            uvijek u kolekciji
 *   exclude: ['adalya-love-66']          nikad u kolekciji
 *
 * mood određuje atmosferu stranice: 'ice', 'night', 'tropical' ili 'calm'.
 * Vidi docs/UPUTSTVO.md, "Kako dodati kolekciju".
 */
window.COLLECTIONS = [
  {
    id: 'icy',
    slug: { bs: 'ledeni-okusi', en: 'icy-flavors' },
    mood: 'ice',
    title: { bs: 'Ledeni okusi', en: 'Icy flavors' },
    short: {
      bs: 'Mentol, led i hladan, bistar izdah.',
      en: 'Menthol, ice and a crisp, cold exhale.'
    },
    intro: {
      bs: [
        'Okusi kod kojih hlađenje nije dodatak nego glavna uloga. Svaki udah je svjež, a izdah hladan kao zimski zrak.',
        'Dobri su za tople dane i kao "led" u miksu sa voćnim okusima.'
      ],
      en: [
        'Flavors where the chill is the main act, not a side note. Every pull feels fresh and every exhale lands cold, like winter air.',
        'Great on hot days, and a handy way to add some ice to a fruity mix.'
      ]
    },
    rule: { anyOf: [{ min: { cooling: 8 } }, { anyTags: ['ledeni'] }] },
    include: [],
    exclude: [],
    palette: { primary: '#9fe3ff', secondary: '#e6f7ff', accent: '#2f8fd6', background: '#0b2c4a', text: '#eef9ff', smoke: ['#ffffff', '#e3f6ff', '#c8ecff'] }
  },
  {
    id: 'night',
    slug: { bs: 'nocni-okusi', en: 'night-flavors' },
    mood: 'night',
    title: { bs: 'Noćni okusi', en: 'Night flavors' },
    short: {
      bs: 'Topli, bogati okusi za duge večeri.',
      en: 'Warm, rich flavors for long evenings.'
    },
    intro: {
      bs: [
        'Okusi za kasne sate: zreliji, topliji i malo slađi, sa voćem koje podsjeća na ljetne noći.',
        'Najbolje idu uz sporiju sesiju i dobro društvo.'
      ],
      en: [
        'Flavors for the late hours: deeper, warmer and a little sweeter, with fruit that feels like a summer night.',
        'Best enjoyed in a slow session with good company.'
      ]
    },
    rule: { anyTags: ['nocni'] },
    include: [],
    exclude: [],
    palette: { primary: '#ffb45a', secondary: '#b89bff', accent: '#ffcf7a', background: '#120d26', text: '#f5f0ff', smoke: ['#ffd9a8', '#f3c9ff', '#ffe9cf'] }
  },
  {
    id: 'tropical',
    slug: { bs: 'tropski-okusi', en: 'tropical-flavors' },
    mood: 'tropical',
    title: { bs: 'Tropski okusi', en: 'Tropical flavors' },
    short: {
      bs: 'Sunce, zrelo voće i ljetni koktel.',
      en: 'Sunshine, ripe fruit and a summer cocktail.'
    },
    intro: {
      bs: [
        'Ananas, mango, marakuja i ostalo sočno voće iz toplijih krajeva. Slatko, sunčano i puno boja.',
        'Ako voliš okuse koji podsjećaju na odmor, kreni odavde.'
      ],
      en: [
        'Pineapple, mango, passion fruit and other juicy fruit from warmer places. Sweet, sunny and full of color.',
        'If you like flavors that taste like a holiday, start here.'
      ]
    },
    rule: { anyTags: ['tropski'] },
    include: [],
    exclude: [],
    palette: { primary: '#ffb020', secondary: '#ff7a3d', accent: '#1f9d6b', background: '#ffcf5c', text: '#2b1600', smoke: ['#fff3d6', '#ffe0b0', '#ffd0a0'] }
  },
  {
    id: 'beginners',
    slug: { bs: 'za-pocetnike', en: 'for-beginners' },
    mood: 'calm',
    title: { bs: 'Za početnike', en: 'For beginners' },
    short: {
      bs: 'Umjereni, voćni i slatki okusi za prve sesije.',
      en: 'Easygoing, fruity and sweet picks for your first sessions.'
    },
    intro: {
      bs: [
        'Ako tek počinješ, ovi okusi su dobar start: umjerene jačine, voćni ili slatki, sa tek malo mente.',
        'Lako se prepoznaju i opraštaju sitne greške u pripremi, pa se više fokusiraš na sam okus.'
      ],
      en: [
        'If you are just getting started, these are a good place to begin: medium strength, fruity or sweet, with only a touch of mint.',
        'They are easy to recognize and forgiving of small setup mistakes, so you can focus on the flavor itself.'
      ]
    },
    note: {
      bs: 'Jako hlađenje i vrlo jaki okusi znaju "prekriti" sve ostalo i brže umoriti. Umjeren, voćan okus pokazuje kako dobro spremljena nargila treba da izgleda. Prije prve sesije pogledaj vodič korak po korak.',
      en: 'Heavy cooling and very bold flavors can drown out everything else and wear you out faster. A balanced, fruity flavor shows you what a well-packed bowl should taste like. Before your first session, check out the step-by-step guide.'
    },
    guideLink: true,
    rule: {
      max: { cooling: 6, strength: 6 },
      anyOf: [{ min: { fruitiness: 7 } }, { min: { sweetness: 7 } }]
    },
    include: [],
    exclude: [],
    palette: { primary: '#f2a33c', secondary: '#f6c89a', accent: '#e07a3f', background: '#2a1c14', text: '#fbf1e4', smoke: ['#f7eadb', '#f1dcc4', '#fff6ec'] }
  }
];
