/*
 * MyShishapedia - podaci o okusima (oba jezika).
 *
 * Tekstualna polja su { bs: ..., en: ... }. Šema je opisana u docs/UPUTSTVO.md
 * ("Kako dodati novi okus"). Vrijednosti u `profile` i `intensity` su procjene
 * i treba ih provjeriti; sastav okusa Lady Killer, Berlin Nights i Angel Lips
 * je u docs/UPUTSTVO.md označen kao "provjeriti", kao i sastav svih okusa drugih brendova.
 * Polje mood (opcionalno) bira atmosferu stranice: night, honey, ice, frost, mist, supernova, soda ili fizz.
 * Polje brand je slug iz data/brands.js, a leaf vrsta lista: 'light' (svijetli) ili 'dark' (tamni).
 */
window.FLAVORS = [
  {
    id: 'adalya-dubai',
    brand: 'adalya',
    leaf: 'light',
    name: 'Dubai',
    shortDescription: {
      bs: 'Tropska kombinacija zrelog ananasa i kremaste banane, zaokružena hladnim dahom mente.',
      en: 'Ripe pineapple and creamy banana, rounded off with a cool breath of mint.'
    },
    description: {
      bs: [
        'Dubai spaja dva tropska voća koja se rijetko nađu zajedno u istoj glavi: sočan, blago kiselkast ananas i mekanu, kremastu bananu. Ananas daje okusu živost i svjetlinu, a banana ga zaokružuje i čini punijim.',
        'Menta je tu kao završni potez. Ne preuzima glavnu ulogu, nego hladi izdah i čini da i duža sesija ostane lagana.',
        'Dobar izbor za one koji vole slatke, voćne okuse, a ne žele da budu teški ni previše ledeni.'
      ],
      en: [
        'Dubai pairs two tropical fruits you rarely find in the same bowl: juicy, slightly tangy pineapple and soft, creamy banana. The pineapple keeps it bright and lively, while the banana fills it out and makes it rounder.',
        'Mint is the finishing touch. It never takes over; it just cools the exhale and keeps even a long session feeling light.',
        'A great pick if you like sweet, fruity flavors that are neither heavy nor overly icy.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f8cf4a', intensity: 8 },
      { name: { bs: 'Banana', en: 'Banana' }, illustration: 'banana', color: '#fbe48c', intensity: 6 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 5 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 8, cooling: 5, strength: 6 },
    tags: ['vocni', 'tropski', 'mint', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f8cf4a', secondary: '#fbe48c', accent: '#23a672', background: '#f2b736', text: '#2b1a04' },
    mixIdeas: {
      bs: [
        'Dubai i čista menta, otprilike 70/30, ako želiš izraženije hlađenje.',
        'Dubai i kokos, za kremastiji karakter koji podsjeća na tropski koktel.',
        'Dubai i limun, za kiselkastiji i osvježavajući završetak.'
      ],
      en: [
        'Dubai with plain mint, roughly 70/30, if you want a stronger chill.',
        'Dubai with coconut for a creamier, piña-colada-style bowl.',
        'Dubai with lemon for a tangier, more refreshing finish.'
      ]
    },
    similar: ['fumari-white-gummi-bear', 'adalya-lady-killer', 'adalya-love-66', 'adalya-mi-amor']
  },
  {
    id: 'adalya-love-66',
    brand: 'adalya',
    leaf: 'light',
    name: 'Love 66',
    shortDescription: {
      bs: 'Ljetni voćni miks lubenice, medene dinje i marakuje, sa mentom koja sve drži svježim.',
      en: 'A summery mix of watermelon, honeydew and passion fruit, kept fresh by a hit of mint.'
    },
    description: {
      bs: [
        'Love 66 je slojevit voćni okus u kojem se isprepliću lubenica, medena dinja i marakuja. Lubenica i dinja nose sočnu, blagu slatkoću, a marakuja unosi egzotičnu, blago kiselkastu notu koja okus drži živim.',
        'Menta se osjeti na izdahu i daje cijeloj kombinaciji hladan, čist završetak, bez da prekrije voće.',
        'Zbog balansa slatkog, kiselkastog i svježeg, ovo je okus koji se lako puši i u dužim sesijama, posebno ljeti.'
      ],
      en: [
        'Love 66 is a layered fruit blend where watermelon, honeydew and passion fruit weave together. The watermelon and melon bring juicy, gentle sweetness, while the passion fruit adds an exotic, slightly tart edge that keeps things lively.',
        'Mint shows up on the exhale and gives the whole mix a clean, cool finish without burying the fruit.',
        'With its balance of sweet, tart and fresh, it is an easy smoke even in long sessions, especially in summer.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e9364f', intensity: 8 },
      { name: { bs: 'Marakuja', en: 'Passion fruit' }, illustration: 'marakuja', color: '#ffa630', intensity: 7 },
      { name: { bs: 'Medena dinja', en: 'Honeydew melon' }, illustration: 'dinja', color: '#cfe79c', intensity: 6 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#3fc08a', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 9, cooling: 6, strength: 7 },
    tags: ['vocni', 'tropski', 'mint', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e9364f', secondary: '#ffa630', accent: '#52cc96', background: '#f45e7c', text: '#2b0610' },
    mixIdeas: {
      bs: [
        'Love 66 i Dubai, za bogat tropski voćni koktel.',
        'Love 66 i grejp, za gorko-kiselkast kontrast slatkom voću.',
        'Love 66 i čista lubenica, kad želiš da lubenica bude u prvom planu.'
      ],
      en: [
        'Love 66 with Dubai for a rich tropical fruit cocktail.',
        'Love 66 with grapefruit for a bitter-tart contrast to the sweet fruit.',
        'Love 66 with plain watermelon when you want the watermelon up front.'
      ]
    },
    similar: ['adalya-angel-lips', 'adalya-dubai', 'adalya-double-melon', 'al-fakher-magic-love']
  },
  {
    id: 'adalya-baku-nights',
    brand: 'adalya',
    leaf: 'light',
    name: 'Baku Nights',
    shortDescription: {
      bs: 'Noćni voćni miks dinje, breskve i narandže, sa slatkim pepermintom koji ostavlja svjež trag.',
      en: 'A late-night blend of melon, peach and orange with a sweet peppermint finish.'
    },
    description: {
      bs: [
        'Baku Nights je voćan i sladak okus u kojem se miješaju sočna dinja, mekana breskva i sunčana narandža. Voće je zaobljeno i toplo, više kao desert nego kao kiselkast sok.',
        'Na izdahu dolazi pepermint: sladak, čist i hladan, ali ne oštar. On razbija slatkoću voća i daje okusu osvježavajući završetak.',
        'Okus za duže, opuštene večeri, kad želiš nešto slatko, a da ne bude teško.'
      ],
      en: [
        'Baku Nights is sweet and fruity, mixing juicy melon, soft peach and sunny orange. The fruit feels round and warm, more like a dessert than a tart juice.',
        'Peppermint arrives on the exhale: sweet, clean and cool without being sharp. It cuts through the sweetness and leaves a refreshing finish.',
        'A flavor for long, laid-back evenings when you want something sweet that still feels light.'
      ]
    },
    ingredients: [
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ffb07a', intensity: 7 },
      { name: { bs: 'Dinja', en: 'Melon' }, illustration: 'dinja', color: '#d6e89e', intensity: 6 },
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 6 },
      { name: { bs: 'Slatki pepermint', en: 'Sweet peppermint' }, illustration: 'pepermint', color: '#2e9e6e', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 7, fruitiness: 7, cooling: 6, strength: 6 },
    tags: ['vocni', 'slatki', 'mint', 'nocni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    mood: 'night',
    palette: { primary: '#ff9a5a', secondary: '#ffc27a', accent: '#5fe0b0', background: '#1a1436', text: '#f3eefe', water: '#8a6bff' },
    mixIdeas: {
      bs: [
        'Baku Nights i Love 66, za bogatiji voćni miks sa više dinje.',
        'Baku Nights i vanila, za mekan, desertni karakter.',
        'Baku Nights i dodatak mente, ako želiš jači hladni završetak.'
      ],
      en: [
        'Baku Nights with Love 66 for a fuller fruit mix with more melon.',
        'Baku Nights with vanilla for a soft, dessert-like bowl.',
        'Baku Nights with a bit of extra mint if you want a colder finish.'
      ]
    },
    similar: ['adalya-berlin-nights', 'adalya-love-66', 'adalya-swiss-bonbon']
  },
  {
    id: 'adalya-swiss-bonbon',
    brand: 'adalya',
    leaf: 'light',
    name: 'Swiss Bonbon',
    shortDescription: {
      bs: 'Ledeni mentol i menta, sa slatkim voćnim bombonom u pozadini i blagim biljnim tonom.',
      en: 'Icy menthol and mint over a sweet fruit candy base with a soft herbal note.'
    },
    description: {
      bs: [
        'Swiss Bonbon je okus za ljubitelje hladnoće. Mentol i menta su u prvom planu i daju snažan, bistar, skoro leden osjećaj već od prvog povlačenja.',
        'Ispod hladnoće se krije slatki voćni bombon, koji zaokružuje okus i čini ga prijatnim, a ne samo oštrim. Blaga biljna nota daje dubinu, slično bombonima sa biljem.',
        'Dobar izbor kad želiš maksimalno osvježenje ili kao dodatak drugim okusima kojima fali hladnoće.'
      ],
      en: [
        'Swiss Bonbon is made for people who love the cold. Menthol and mint lead the way with a strong, clear, almost frosty hit from the very first pull.',
        'Underneath sits a sweet fruit candy that rounds things out, so it tastes pleasant rather than just sharp. A soft herbal note adds depth, a lot like herbal throat candies.',
        'Grab it when you want maximum freshness, or add a little to any flavor that needs more chill.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cfeefc', intensity: 9 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#3fc08a', intensity: 8 },
      { name: { bs: 'Voćni bombon', en: 'Fruit candy' }, illustration: 'bombon', color: '#ff8fb8', intensity: 5 },
      { name: { bs: 'Bilje', en: 'Herbs' }, illustration: 'bilje', color: '#8fae6a', intensity: 3 }
    ],
    profile: { sweetness: 5, freshness: 10, fruitiness: 4, cooling: 10, strength: 7 },
    tags: ['mint', 'ledeni', 'slatki', 'biljni', 'bombon'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    mood: 'frost',
    palette: { primary: '#9fd8f0', secondary: '#ffc2d9', accent: '#2fbf8f', background: '#e6f4fb', text: '#0d2a3a', water: '#7fd3f2' },
    mixIdeas: {
      bs: [
        'Swiss Bonbon i Dubai, za tropsko voće sa ledenim završetkom.',
        'Swiss Bonbon i lubenica, za ljetni, ekstra hladan miks.',
        'Malo Swiss Bonbona u bilo kojem voćnom okusu, kao "led" u čaši.'
      ],
      en: [
        'Swiss Bonbon with Dubai for tropical fruit with an icy finish.',
        'Swiss Bonbon with watermelon for an extra-cold summer mix.',
        'A pinch of Swiss Bonbon in any fruit flavor works like ice in a glass.'
      ]
    },
    similar: ['adalya-ice-bonbon', 'adalya-baku-nights', 'adalya-mint', 'adalya-ice-lime-on-the-rocks']
  },
  {
    id: 'adalya-ice-bonbon',
    brand: 'adalya',
    leaf: 'light',
    name: 'Ice Bonbon',
    shortDescription: {
      bs: 'Šareni slatki bomboni na udahu i snažan ledeni pepermint sa mentolom na izdahu.',
      en: 'Colorful sweet candies on the inhale and a blast of icy peppermint and menthol on the exhale.'
    },
    description: {
      bs: [
        'Ice Bonbon je okus za one kojima nikad nije dovoljno hladno. Na udahu se osjeti mješavina slatkih bombona, vesela i šećerna, kao kad otvoriš punu vrećicu šarenih bombona.',
        'Odmah zatim dolazi ledeni pepermint sa mentolom. Hlađenje je jako i bistro, osjeti se i u grlu i na izdahu, i ostaje dugo nakon povlačenja.',
        'Sličan je Swiss Bonbonu, ali je ledeniji, bomboni su izraženiji, a nema biljne note. Dobar izbor za vruće dane ili kao ledeni dodatak voćnim okusima.'
      ],
      en: [
        'Ice Bonbon is for people who can never get it cold enough. The inhale is a mix of sweet candies, playful and sugary, like tearing open a full bag of colorful sweets.',
        'Right after that comes icy peppermint and menthol. The chill is strong and crisp, you feel it in your throat and on the exhale, and it lingers long after the pull.',
        'It is close to Swiss Bonbon, but icier, heavier on the candy and without the herbal note. Great on hot days or as an ice boost for fruit flavors.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mješavina bombona', en: 'Candy mix' }, illustration: 'bomboni', color: '#ff4fa3', intensity: 7 },
      { name: { bs: 'Ledeni pepermint', en: 'Icy peppermint' }, illustration: 'pepermint', color: '#35b98c', intensity: 9 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#d6f3ff', intensity: 10 }
    ],
    profile: { sweetness: 8, freshness: 10, fruitiness: 4, cooling: 10, strength: 7 },
    tags: ['mint', 'ledeni', 'slatki', 'bombon'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    mood: 'ice',
    palette: {
      primary: '#8fe3ff', secondary: '#ff4fa3', accent: '#ffd23f', background: '#0e63b8', text: '#ffffff',
      water: '#c9f3ff', smoke: ['#ffffff', '#e3f7ff', '#c4ecff']
    },
    mixIdeas: {
      bs: [
        'Ice Bonbon i Love 66, za ledeni ljetni voćni koktel.',
        'Ice Bonbon i Dubai, kad tropskom voću želiš dodati puno leda.',
        'Pola Ice Bonbona i pola Swiss Bonbona, za bombon sa blagom biljnom notom.'
      ],
      en: [
        'Ice Bonbon with Love 66 for an ice-cold summer fruit cocktail.',
        'Ice Bonbon with Dubai when your tropical fruit needs a lot of ice.',
        'Half Ice Bonbon, half Swiss Bonbon for candy with a soft herbal twist.'
      ]
    },
    similar: ['adalya-swiss-bonbon', 'adalya-lady-killer', 'adalya-blue-ice']
  },
  {
    id: 'adalya-lady-killer',
    brand: 'adalya',
    leaf: 'light',
    name: 'Lady Killer',
    shortDescription: {
      bs: 'Sočni mango, dinja i bobičasto voće, sa hladnim mentol završetkom.',
      en: 'Juicy mango, melon and mixed berries with a cool menthol finish.'
    },
    description: {
      bs: [
        'Lady Killer je sočan tropski miks u kojem mango vodi glavnu riječ: zreo, gust i sladak. Dinja ga čini svježijim i lakšim, a bobičasto voće dodaje tamniju, blago kiselkastu notu.',
        'Na kraju dolazi mentol. Nije sladak kao menta, nego čist i hladan, pa voće ostaje u prvom planu, a izdah je osvježavajući.',
        'Dobar izbor za ljubitelje voćnih okusa koji vole kad se na kraju osjeti malo leda.'
      ],
      en: [
        'Lady Killer is a juicy tropical blend led by mango: ripe, thick and sweet. Melon lightens it up and makes it fresher, while mixed berries add a darker, slightly tart note.',
        'Menthol closes it out. It is not sweet like mint, just clean and cold, so the fruit stays up front and the exhale feels refreshing.',
        'A solid pick for fruit lovers who like a touch of ice at the end.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 8 },
      { name: { bs: 'Dinja', en: 'Melon' }, illustration: 'dinja', color: '#d9ec9f', intensity: 6 },
      { name: { bs: 'Bobičasto voće', en: 'Mixed berries' }, illustration: 'kupina', color: '#7a2f6b', intensity: 6 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 9, cooling: 7, strength: 7 },
    tags: ['vocni', 'tropski', 'ledeni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffc34d', secondary: '#9b3a7e', accent: '#39b8e6', background: '#f7a531', text: '#2a1300', water: '#b9ecff' },
    mixIdeas: {
      bs: [
        'Lady Killer i Dubai, za još više tropskog voća.',
        'Lady Killer i Love 66, za šareni voćni miks sa lubenicom.',
        'Lady Killer i Ice Bonbon, kad želiš da mentol bude još jači.'
      ],
      en: [
        'Lady Killer with Dubai for even more tropical fruit.',
        'Lady Killer with Love 66 for a colorful fruit mix with watermelon.',
        'Lady Killer with Ice Bonbon when you want the menthol cranked up.'
      ]
    },
    similar: ['adalya-dubai', 'adalya-love-66', 'adalya-ice-bonbon', 'adalya-mango-tango-ice']
  },
  {
    id: 'adalya-berlin-nights',
    brand: 'adalya',
    leaf: 'light',
    name: 'Berlin Nights',
    shortDescription: {
      bs: 'Slatka breskva sa zlatnim medom i svježom mentom na izdahu.',
      en: 'Sweet peach with golden honey and fresh mint on the exhale.'
    },
    description: {
      bs: [
        'Berlin Nights je topao, sladak okus. Zrela breskva je u centru, a med je čini mekšom i punijom, skoro kao desert od pečene breskve.',
        'Menta dolazi na izdahu i razbija slatkoću, pa okus ne postaje težak ni kad sesija potraje.',
        'Ako voliš Baku Nights, ovo je njegov topliji, medeni rođak: manje voćne šarolikosti, više mekoće.'
      ],
      en: [
        'Berlin Nights is warm and sweet. Ripe peach sits at the center, and honey makes it softer and fuller, almost like a baked-peach dessert.',
        'Mint arrives on the exhale and breaks up the sweetness, so it never gets heavy, even in a long session.',
        'If you like Baku Nights, this is its warmer, honeyed cousin: less fruit variety, more smoothness.'
      ]
    },
    ingredients: [
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ffa55e', intensity: 8 },
      { name: { bs: 'Med', en: 'Honey' }, illustration: 'med', color: '#f0b429', intensity: 6 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#3fc08a', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 7, cooling: 5, strength: 6 },
    tags: ['vocni', 'slatki', 'mint', 'nocni', 'medeni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    mood: 'honey',
    palette: { primary: '#f0b429', secondary: '#ff9f5a', accent: '#6fe0b8', background: '#221419', text: '#fff4e6', water: '#f0b429' },
    mixIdeas: {
      bs: [
        'Berlin Nights i Baku Nights, za noćni voćni miks sa medom.',
        'Berlin Nights i vanila, za mekan desertni okus.',
        'Berlin Nights i malo mente, kad želiš svježiji izdah.'
      ],
      en: [
        'Berlin Nights with Baku Nights for a late-night fruit blend with honey.',
        'Berlin Nights with vanilla for a soft dessert bowl.',
        'Berlin Nights with a little extra mint for a fresher exhale.'
      ]
    },
    similar: ['adalya-baku-nights', 'adalya-dubai', 'adalya-angel-lips']
  },
  {
    id: 'adalya-angel-lips',
    brand: 'adalya',
    leaf: 'light',
    name: 'Angel Lips',
    shortDescription: {
      bs: 'Sočna lubenica i tamna kupina, osvježene mentom.',
      en: 'Juicy watermelon and dark blackberry, freshened up with mint.'
    },
    description: {
      bs: [
        'Angel Lips spaja sočnu, laganu lubenicu sa tamnom, blago kiselkastom kupinom. Lubenica daje osvježenje, a kupina dubinu i bobičastu slatkoću.',
        'Menta hladi izdah i povezuje ta dva voća u jedan čist, ljetni okus.',
        'Za razliku od Love 66, ovdje nema tropskog voća: okus je tamniji i više bobičast.'
      ],
      en: [
        'Angel Lips pairs light, juicy watermelon with dark, slightly tart blackberry. The watermelon brings the refreshment, the blackberry brings depth and berry sweetness.',
        'Mint cools the exhale and ties the two fruits into one clean, summery flavor.',
        'Unlike Love 66, there is no tropical fruit here: it is darker and berrier.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#ff4d7d', intensity: 8 },
      { name: { bs: 'Kupina', en: 'Blackberry' }, illustration: 'kupina', color: '#5a2472', intensity: 7 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#4cc493', intensity: 5 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 9, cooling: 5, strength: 6 },
    tags: ['vocni', 'bobicasti', 'mint', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff4d7d', secondary: '#8a3bb0', accent: '#5fe0a8', background: '#3b1238', text: '#fff0f6', water: '#ff6f95' },
    mixIdeas: {
      bs: [
        'Angel Lips i Love 66, za lubenicu sa tropskim dodatkom.',
        'Angel Lips i Berlin Nights, za bobice sa medenom notom.',
        'Angel Lips i malo Ice Bonbona, za ledeni bobičasti miks.'
      ],
      en: [
        'Angel Lips with Love 66 for watermelon with a tropical twist.',
        'Angel Lips with Berlin Nights for berries with a honeyed note.',
        'Angel Lips with a little Ice Bonbon for an icy berry mix.'
      ]
    },
    similar: ['adalya-love-66', 'adalya-berlin-nights', 'adalya-raspberry', 'al-fakher-watermelon']
  },
  {
    id: 'adalya-mint',
    brand: 'adalya',
    leaf: 'light',
    name: 'Mint',
    shortDescription: {
      bs: 'Čista, klasična menta: svjež udah i hladan, bistar izdah.',
      en: 'Clean, classic mint: a fresh pull and a cool, crisp exhale.'
    },
    description: {
      bs: [
        'Mint je menta bez ikakvih dodataka. Svjež, zelen i jednostavan okus koji hladi od prvog udaha.',
        'Zbog te jednostavnosti je jedna od najčešćih osnova za mikseve: malo mente osvježi gotovo svaki voćni okus.',
        'Sam za sebe je dobar izbor kad želiš nešto lagano i čisto, bez slatkoće.'
      ],
      en: [
        'Mint is mint and nothing else. A fresh, green, straightforward flavor that cools from the very first pull.',
        'That simplicity makes it one of the most common mix bases: a little mint livens up almost any fruit flavor.',
        'On its own it is a good pick when you want something light and clean, without the sweetness.'
      ]
    },
    ingredients: [
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#3fc08a', intensity: 9 }
    ],
    profile: { sweetness: 2, freshness: 10, fruitiness: 0, cooling: 8, strength: 6 },
    tags: ['mint', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#2fbf7f', secondary: '#a8ecc9', accent: '#127a4f', background: '#dff5ea', text: '#0b2a1d', water: '#9ff0cf' },
    mixIdeas: {
      bs: [
        'Malo Minta uz bilo koji voćni okus, kad želiš svježiji izdah.',
        'Mint i Raspberry, za slatku malinu sa hladnim krajem.',
        'Mint i Double Melon, za lagan ljetni miks.'
      ],
      en: [
        'A little Mint with any fruit flavor when you want a fresher exhale.',
        'Mint with Raspberry for sweet raspberry with a cool finish.',
        'Mint with Double Melon for an easy summer mix.'
      ]
    },
    similar: ['al-fakher-mint', 'tangiers-cane-mint', 'adalya-cherry-mint', 'haze-cucumberita']
  },
  {
    id: 'adalya-blue-ice',
    brand: 'adalya',
    leaf: 'light',
    name: 'Blue Ice',
    mood: 'frost',
    shortDescription: {
      bs: 'Zrela borovnica pod debelim slojem leda i mentola.',
      en: 'Ripe blueberry under a thick layer of ice and menthol.'
    },
    description: {
      bs: [
        'Blue Ice je borovnica sa jakim hlađenjem. Voće je tamno i slatko, a mentol ga odmah zaledi.',
        'Za razliku od Ice Bonbona, ovdje nema bombona: okus je voćniji i "plaviji", sa jasnom notom borovnice.',
        'Dobar je za one koji vole led, ali ne žele da on potpuno prekrije voće.'
      ],
      en: [
        'Blue Ice is blueberry with a serious chill. The fruit is dark and sweet, and the menthol freezes it right away.',
        'Unlike Ice Bonbon, there is no candy here: it is fruitier and bluer, with a clear blueberry note.',
        'A good fit if you love ice but do not want it to bury the fruit completely.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4a5fc1', intensity: 8 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cfefff', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 9, fruitiness: 7, cooling: 9, strength: 7 },
    tags: ['vocni', 'bobicasti', 'ledeni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#6f86ff', secondary: '#a9b8ff', accent: '#b9f1ff', background: '#1b1f5e', text: '#eef2ff', water: '#8fd8ff', smoke: ['#ffffff', '#dbe6ff', '#c9f0ff'] },
    mixIdeas: {
      bs: [
        'Blue Ice i Angel Lips, za bobice na ledu.',
        'Blue Ice i Cherry Mint, za tamno voće sa puno svježine.',
        'Malo Blue Icea u Raspberryju, kad želiš hladnu malinu.'
      ],
      en: [
        'Blue Ice with Angel Lips for berries on ice.',
        'Blue Ice with Cherry Mint for dark fruit and plenty of freshness.',
        'A little Blue Ice in Raspberry when you want chilled raspberry.'
      ]
    },
    similar: ['serbetli-ice-blueberry', 'al-fakher-blueberry', 'starbuzz-blue-mist', 'adalya-ice-bonbon']
  },
  {
    id: 'adalya-cherry-mint',
    brand: 'adalya',
    leaf: 'light',
    name: 'Cherry Mint',
    shortDescription: {
      bs: 'Slatko-kisela višnja sa svježom mentom na izdahu.',
      en: 'Sweet and tart cherry with fresh mint on the exhale.'
    },
    description: {
      bs: [
        'Cherry Mint spaja tamnu višnju i mentu. Višnja je slatka, sa onom poznatom blago kiselom notom, a menta je osvježi.',
        'Okus je zreo i pun, ali ne pretežak, pa se lako puši i duže.',
        'Ako voliš Mint, a želiš malo voća, ovo je prirodan sljedeći korak.'
      ],
      en: [
        'Cherry Mint brings together dark cherry and mint. The cherry is sweet with that familiar tart edge, and the mint freshens it up.',
        'It tastes ripe and full without feeling heavy, so it works for longer sessions too.',
        'If you like Mint but want some fruit, this is the natural next step.'
      ]
    },
    ingredients: [
      { name: { bs: 'Višnja', en: 'Cherry' }, illustration: 'visnja', color: '#9b1b30', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#4cc493', intensity: 6 }
    ],
    profile: { sweetness: 6, freshness: 7, fruitiness: 8, cooling: 5, strength: 6 },
    tags: ['vocni', 'mint'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#c8243f', secondary: '#ff6f86', accent: '#5fe0a8', background: '#4a0f1c', text: '#fff1f3', water: '#ff5f7a' },
    mixIdeas: {
      bs: [
        'Cherry Mint i Raspberry, za crveno voće sa svježinom.',
        'Cherry Mint i malo Blue Icea, za ledenu višnju.',
        'Cherry Mint i Berlin Nights, za topliju, medenu notu.'
      ],
      en: [
        'Cherry Mint with Raspberry for red fruit with a fresh edge.',
        'Cherry Mint with a little Blue Ice for icy cherry.',
        'Cherry Mint with Berlin Nights for a warmer, honeyed note.'
      ]
    },
    similar: ['adalya-mint', 'adalya-raspberry', 'adalya-angel-lips']
  },
  {
    id: 'adalya-raspberry',
    brand: 'adalya',
    leaf: 'light',
    name: 'Raspberry',
    shortDescription: {
      bs: 'Slatka, blago kisela malina, sočna i bez mente.',
      en: 'Sweet, slightly tart raspberry, juicy and mint-free.'
    },
    description: {
      bs: [
        'Raspberry je čista malina: slatka, sočna i sa blagom kiselinom koja okus drži živim.',
        'Bez mente je, pa se voće osjeti jasno od početka do kraja sesije.',
        'Odlična je osnova za mikseve: sa mentom postaje svježija, a sa ledenim okusima pravi desert na ledu.'
      ],
      en: [
        'Raspberry is pure raspberry: sweet, juicy and with a light tartness that keeps it lively.',
        'There is no mint, so the fruit comes through clearly from start to finish.',
        'It makes a great mix base: add mint for freshness, or an icy flavor for a dessert on ice.'
      ]
    },
    ingredients: [
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#e23d6a', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 9, cooling: 1, strength: 5 },
    tags: ['vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff5c8d', secondary: '#ffb3c9', accent: '#ffd6e2', background: '#b3174e', text: '#fff5f8', water: '#ff8fb1' },
    mixIdeas: {
      bs: [
        'Raspberry i Mint, za slatku malinu sa hladnim krajem.',
        'Raspberry i Angel Lips, za mješavinu bobičastog voća.',
        'Raspberry i malo Blue Icea, za ledenu malinu.'
      ],
      en: [
        'Raspberry with Mint for sweet raspberry with a cool finish.',
        'Raspberry with Angel Lips for a mixed-berry bowl.',
        'Raspberry with a little Blue Ice for icy raspberry.'
      ]
    },
    similar: ['darkside-generis-raspberry', 'starbuzz-pink', 'musthave-pinkman', 'adalya-angel-lips']
  },
  {
    id: 'adalya-double-melon',
    brand: 'adalya',
    leaf: 'light',
    name: 'Double Melon',
    shortDescription: {
      bs: 'Medena dinja i lubenica: sočno, slatko i ljetno.',
      en: 'Honeydew and watermelon: juicy, sweet and summery.'
    },
    description: {
      bs: [
        'Double Melon spaja dvije vrste dinje: blagu, medenu dinju i sočnu lubenicu.',
        'Okus je sladak i mekan, bez kiseline i bez mente, kao hladna kriška na ljetnoj terasi.',
        'Lagan je i prijatan, pa je dobar izbor i za početnike.'
      ],
      en: [
        'Double Melon brings together two melons: mellow honeydew and juicy watermelon.',
        'It is sweet and soft, with no tartness and no mint, like a cold slice on a summer terrace.',
        'Light and easy to enjoy, which also makes it a good beginner pick.'
      ]
    },
    ingredients: [
      { name: { bs: 'Medena dinja', en: 'Honeydew melon' }, illustration: 'dinja', color: '#cfe79c', intensity: 8 },
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#ff4d6d', intensity: 7 }
    ],
    profile: { sweetness: 8, freshness: 7, fruitiness: 9, cooling: 1, strength: 5 },
    tags: ['vocni', 'ljetni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff6f7d', secondary: '#b8e08a', accent: '#e8455a', background: '#d8f1c4', text: '#1d2a10', water: '#ffb3bd' },
    mixIdeas: {
      bs: [
        'Double Melon i Mint, za lagan ljetni miks.',
        'Double Melon i Love 66, za još više dinje i tropskog voća.',
        'Double Melon i Tynky Wynky, za voćnu limunadu.'
      ],
      en: [
        'Double Melon with Mint for an easy summer mix.',
        'Double Melon with Love 66 for extra melon and tropical fruit.',
        'Double Melon with Tynky Wynky for a fruity lemonade.'
      ]
    },
    similar: ['adalya-blue-melon', 'starbuzz-safari-melon-dew', 'adalya-love-66', 'adalya-lady-killer']
  },
  {
    id: 'adalya-tynky-wynky',
    brand: 'adalya',
    leaf: 'light',
    name: 'Tynky Wynky',
    mood: 'soda',
    shortDescription: {
      bs: 'Kiselo-slatki citrusi i marakuja sa mentom, kao hladna limunada.',
      en: 'Sweet and sour citrus with passion fruit and mint, like a cold lemonade.'
    },
    description: {
      bs: [
        'Tynky Wynky je citrusni miks grejpfruta, limete i marakuje, osvježen mentom.',
        'Grejpfrut i limeta daju kiselkast, živ početak, marakuja ga zaokruži slatkoćom, a menta ohladi izdah.',
        'Rezultat podsjeća na hladnu, gaziranu limunadu u ljetni dan.'
      ],
      en: [
        'Tynky Wynky is a citrus blend of grapefruit, lime and passion fruit, freshened with mint.',
        'Grapefruit and lime bring a zesty, lively start, passion fruit rounds it off with sweetness, and mint cools the exhale.',
        'The result tastes like an ice-cold, fizzy lemonade on a summer day.'
      ]
    },
    ingredients: [
      { name: { bs: 'Grejpfrut', en: 'Grapefruit' }, illustration: 'grejpfrut', color: '#f25f6b', intensity: 7 },
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#8cc63f', intensity: 6 },
      { name: { bs: 'Marakuja', en: 'Passion fruit' }, illustration: 'marakuja', color: '#ffc233', intensity: 6 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#4cc493', intensity: 5 }
    ],
    profile: { sweetness: 6, freshness: 9, fruitiness: 8, cooling: 5, strength: 6 },
    tags: ['vocni', 'citrusni', 'mint', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffd23f', secondary: '#8cc63f', accent: '#1b8a4c', background: '#ff8fa3', text: '#2b0b12', water: '#fff3a8' },
    mixIdeas: {
      bs: [
        'Tynky Wynky i Dubai, za tropsku limunadu.',
        'Tynky Wynky i Double Melon, za voćnu limunadu.',
        'Tynky Wynky i malo Minta, kad želiš još hladnije.'
      ],
      en: [
        'Tynky Wynky with Dubai for a tropical lemonade.',
        'Tynky Wynky with Double Melon for a fruity lemonade.',
        'Tynky Wynky with a little Mint when you want it even colder.'
      ]
    },
    similar: ['adalya-dubai', 'adalya-love-66', 'adalya-double-melon', 'adalya-ice-lime-on-the-rocks']
  },
  {
    id: 'adalya-hawaii',
    brand: 'adalya',
    leaf: 'light',
    name: 'Hawaii',
    shortDescription: {
      bs: 'Zreli mango i sočni ananas sa svježim mentolom: ljeto u jednoj glavi.',
      en: 'Ripe mango and juicy pineapple with fresh menthol: summer in a single bowl.'
    },
    description: {
      bs: [
        'Hawaii je jedan od najpoznatijih Adalya okusa. Mango daje gustu, medenu slatkoću, a ananas ga razbija svojom svijetlom, blago kiselkastom sočnošću.',
        'Mentol je umjeren: hladi izdah, ali ne pokriva voće, pa okus ostaje tropski i lagan.',
        'Siguran izbor za početnike i za sve koji vole voćne okuse sa malo leda.'
      ],
      en: [
        'Hawaii is one of the best known Adalya flavors. Mango brings a thick, honeyed sweetness, and pineapple cuts through it with bright, slightly tangy juiciness.',
        'The menthol is moderate: it cools the exhale without covering the fruit, so the flavor stays tropical and light.',
        'A safe pick for beginners and for anyone who likes fruit flavors with a little ice.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 8 },
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f8cf4a', intensity: 7 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 7, fruitiness: 9, cooling: 5, strength: 5 },
    tags: ['vocni', 'tropski', 'ljetni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffb52e', secondary: '#f8cf4a', accent: '#2fbfa0', background: '#2b1a08', text: '#fff4e0' },
    mixIdeas: {
      bs: [
        'Hawaii i Dubai, za još više tropskog voća sa bananom.',
        'Hawaii i Love 66, za šareni ljetni miks sa lubenicom.',
        'Hawaii i Ice Bonbon, 70/30, kad želiš više leda.'
      ],
      en: [
        'Hawaii with Dubai for even more tropical fruit plus banana.',
        'Hawaii with Love 66 for a colorful summer mix with watermelon.',
        'Hawaii with Ice Bonbon, 70/30, when you want more ice.'
      ]
    },
    similar: ['adalya-dubai', 'adalya-lady-killer', 'darkside-falling-star', 'revoshi-lady-mystique']
  },
  {
    id: 'adalya-blue-melon',
    brand: 'adalya',
    leaf: 'light',
    name: 'Blue Melon',
    mood: 'ice',
    shortDescription: {
      bs: 'Medena dinja na ledu: slatka, sočna i jako osvježavajuća.',
      en: 'Honeyed melon on ice: sweet, juicy and very refreshing.'
    },
    description: {
      bs: [
        'Blue Melon je zrela, medena dinja sa izraženim mentolom. Dinja je sočna i mekana, bez kiselosti, a hladnoća joj daje "plavi", ledeni karakter.',
        'Hlađenje je jače nego kod Hawaii, ali okus ne postaje oštar: dinja ostaje u prvom planu do kraja glave.',
        'Odličan za vruće ljetne dane i za one koji vole jednostavne, čiste okuse.'
      ],
      en: [
        'Blue Melon is ripe, honeyed melon with pronounced menthol. The melon is juicy and soft with no tartness, and the cold gives it a "blue", icy character.',
        'The cooling is stronger than in Hawaii, but the flavor never turns sharp: the melon stays up front until the bowl is done.',
        'Great for hot summer days and for anyone who likes simple, clean flavors.'
      ]
    },
    ingredients: [
      { name: { bs: 'Dinja', en: 'Melon' }, illustration: 'dinja', color: '#d9ec9f', intensity: 8 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 8 }
    ],
    profile: { sweetness: 7, freshness: 9, fruitiness: 8, cooling: 8, strength: 5 },
    tags: ['vocni', 'ledeni', 'ljetni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#bfe58a', secondary: '#7fd3f0', accent: '#2a8fc8', background: '#0d2230', text: '#eefbff', water: '#bfeeff' },
    mixIdeas: {
      bs: [
        'Blue Melon i Double Melon, za dinju na dva načina.',
        'Blue Melon i Blue Ice, za plavi ledeni voćni miks.',
        'Blue Melon i Mint, 70/30, za klasičnu dinju sa mentom.'
      ],
      en: [
        'Blue Melon with Double Melon for melon two ways.',
        'Blue Melon with Blue Ice for a blue, icy fruit mix.',
        'Blue Melon with Mint, 70/30, for a classic melon and mint.'
      ]
    },
    similar: ['adalya-double-melon', 'starbuzz-safari-melon-dew', 'serbetli-ice-watermelon', 'fumari-ambrosia']
  },
  {
    id: 'adalya-lemon-cocktail',
    brand: 'adalya',
    leaf: 'light',
    name: 'Lemon Cocktail',
    shortDescription: {
      bs: 'Slatki limun u stilu limončela: kiselkast, sunčan i lagan.',
      en: 'Sweet limoncello-style lemon: tangy, sunny and light.'
    },
    description: {
      bs: [
        'Lemon Cocktail podsjeća na limončelo, talijanski liker od limuna. Limun je zreo i sladak, sa koricom koja daje blagu, ugodnu gorčinu.',
        'Nema mentola, pa je okus topliji i "koktelskiji" od klasičnih limun-menta kombinacija.',
        'Lijep samostalno, a još bolji kao kiselkasta nota u voćnim miksevima.'
      ],
      en: [
        'Lemon Cocktail is reminiscent of limoncello, the Italian lemon liqueur. The lemon is ripe and sweet, with a zesty peel that adds a gentle, pleasant bitterness.',
        'There is no menthol, so it feels warmer and more like a cocktail than the classic lemon and mint blends.',
        'Nice on its own, and even better as the tangy note in fruit mixes.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 9 },
      { name: { bs: 'Šećerni sirup', en: 'Sugar syrup' }, illustration: 'med', color: '#f3c96b', intensity: 4 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['citrusni', 'vocni', 'pice', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f7e04b', secondary: '#fff3a8', accent: '#e8a21b', background: '#fff9d9', text: '#2e2600' },
    mixIdeas: {
      bs: [
        'Lemon Cocktail i Raspberry, za malinovu limunadu.',
        'Lemon Cocktail i Mint, 70/30, za limun-mentu.',
        'Lemon Cocktail i Double Melon, za ljetni koktel od dinje.'
      ],
      en: [
        'Lemon Cocktail with Raspberry for a raspberry lemonade.',
        'Lemon Cocktail with Mint, 70/30, for lemon and mint.',
        'Lemon Cocktail with Double Melon for a summer melon cocktail.'
      ]
    },
    similar: ['revoshi-eskimo-lemon', 'al-fakher-lemon-mint', 'adalya-tynky-wynky', 'al-fakher-lemon']
  },
  {
    id: 'adalya-lemon-mint',
    brand: 'adalya',
    leaf: 'light',
    name: 'Lemon Mint',
    shortDescription: {
      bs: 'Kiselkast limun i hladna menta: oštar, čist i jako osvježavajući.',
      en: 'Tangy lemon and cool mint: sharp, clean and very refreshing.'
    },
    description: {
      bs: [
        'Adalya Lemon Mint je klasičan par limuna i mente. Limun je kiselkast i svjež, a menta daje hladan, čist izdah.',
        'Dobar je za vruće dane i kao osvježenje u miksevima sa voćem.'
      ],
      en: [
        'Adalya Lemon Mint is the classic pairing of lemon and mint. The lemon is tangy and fresh, and the mint gives a cool, clean exhale.',
        'Great for hot days and as a fresh lift in fruit mixes.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 8 }
    ],
    profile: { sweetness: 4, freshness: 10, fruitiness: 6, cooling: 7, strength: 5 },
    tags: ['citrusni', 'mint', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f2d93a', secondary: '#9fe0b8', accent: '#1f9a66', background: '#17240f', text: '#fbffe8' },
    mixIdeas: {
      bs: [
        'Lemon Mint i Love 66, za svježiji Love 66.',
        'Lemon Mint i Raspberry, za malinovu limunadu.',
        'Lemon Mint i Double Melon, za dinju sa limunom.'
      ],
      en: [
        'Lemon Mint with Love 66 for a fresher Love 66.',
        'Lemon Mint with Raspberry for a raspberry lemonade.',
        'Lemon Mint with Double Melon for melon with lemon.'
      ]
    },
    similar: ['al-fakher-lemon-mint', 'fumari-lemon-mint', 'mazaya-lemon-mint', 'adalya-lemon-cocktail']
  },
  {
    id: 'adalya-delons',
    brand: 'adalya',
    leaf: 'light',
    name: 'Delons',
    shortDescription: {
      bs: 'Lubenica i dinja sa svježim mentolom: sočno, slatko i hladno.',
      en: 'Watermelon and melon with fresh menthol: juicy, sweet and cool.'
    },
    description: {
      bs: [
        'Delons spaja dvije dinje: sočnu lubenicu i slatku žutu dinju. Mentol ih hladi i čini okus svježim od prvog povlačenja.',
        'Sladak je, ali ne pretjerano, a led ga drži laganim i za duže sesije.',
        'Ako voliš Double Melon, a želiš ga hladnijeg, ovo je pravi izbor.'
      ],
      en: [
        'Delons pairs two melons: juicy watermelon and sweet honeydew. Menthol cools them down and keeps the flavor fresh from the first pull.',
        'It is sweet but not too sweet, and the ice keeps it light even in long sessions.',
        'If you like Double Melon but want it colder, this is the one.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#ff4d6d', intensity: 8 },
      { name: { bs: 'Dinja', en: 'Melon' }, illustration: 'dinja', color: '#cfe79c', intensity: 7 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cfefff', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 9, cooling: 7, strength: 5 },
    tags: ['vocni', 'ledeni', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff6f7d', secondary: '#b8e08a', accent: '#bfeeff', background: '#2a0f16', text: '#fff0f2' },
    mixIdeas: {
      bs: [
        'Delons i Lemon Mint, za ledenu limunadu od dinje.',
        'Delons i Lady Killer, za voćni ljetni miks.',
        'Delons i Mint, 70/30, za još hladniji izdah.'
      ],
      en: [
        'Delons with Lemon Mint for an icy melon lemonade.',
        'Delons with Lady Killer for a fruity summer mix.',
        'Delons with Mint, 70/30, for an even colder exhale.'
      ]
    },
    similar: ['adalya-double-melon', 'adalya-blue-melon', 'serbetli-ice-watermelon', 'adalya-love-66']
  },
  {
    id: 'adalya-skyfall',
    brand: 'adalya',
    leaf: 'light',
    name: 'SkyFall',
    shortDescription: {
      bs: 'Dinja, breskva i lubenica: slatki ljetni voćni miks.',
      en: 'Honeydew, peach and watermelon: a sweet summer fruit mix.'
    },
    description: {
      bs: [
        'SkyFall je voćni miks žute dinje, breskve i lubenice. Dinja i lubenica daju sočnost, a breskva mekanu, zrelu slatkoću.',
        'Okus je sladak i ljetni, bez jakog leda, pa je pitak i lagan.',
        'Dobar je za one koji vole Love 66, ali žele nešto mekše.'
      ],
      en: [
        'SkyFall is a fruit mix of honeydew, peach and watermelon. The melons bring the juiciness and the peach adds a soft, ripe sweetness.',
        'It is sweet and summery without heavy ice, so it is smooth and easy to smoke.',
        'A good pick if you like Love 66 but want something softer.'
      ]
    },
    ingredients: [
      { name: { bs: 'Dinja', en: 'Honeydew' }, illustration: 'dinja', color: '#cfe79c', intensity: 8 },
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ffb07a', intensity: 7 },
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#ff4d6d', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 9, cooling: 2, strength: 5 },
    tags: ['vocni', 'ljetni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffa36b', secondary: '#cfe79c', accent: '#ff4d6d', background: '#2a1a0c', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'SkyFall i Mint, 70/30, za svježiji voćni miks.',
        'SkyFall i Lemon Mint, za voćnu limunadu.',
        'SkyFall i Love 66, za još više tropskog voća.'
      ],
      en: [
        'SkyFall with Mint, 70/30, for a fresher fruit mix.',
        'SkyFall with Lemon Mint for a fruit lemonade.',
        'SkyFall with Love 66 for even more tropical fruit.'
      ]
    },
    similar: ['adalya-love-66', 'adalya-double-melon', 'adalya-berlin-nights', 'al-fakher-peach']
  },
  {
    id: 'adalya-mi-amor',
    brand: 'adalya',
    leaf: 'light',
    name: 'Mi Amor',
    shortDescription: {
      bs: 'Sočni ananas i zrela banana, zaokruženi hladnim završetkom.',
      en: 'Juicy pineapple and ripe banana, rounded off with a cool finish.'
    },
    description: {
      bs: [
        'Mi Amor spaja sočni ananas i zrelu bananu, pa je okus tropski, sladak i gotovo kremast.',
        'Na kraju dolazi hladan završetak koji ga osvježi i ne da mu da bude težak.',
        'Ko voli Dubai, ovdje će naći sličan tropski stil sa više banane.'
      ],
      en: [
        'Mi Amor combines juicy pineapple and ripe banana, so the flavor is tropical, sweet and almost creamy.',
        'A cool finish at the end freshens it up and keeps it from feeling heavy.',
        'If you like Dubai, you will find a similar tropical style here with more banana.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f8cf4a', intensity: 8 },
      { name: { bs: 'Banana', en: 'Banana' }, illustration: 'banana', color: '#fbe48c', intensity: 7 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 9, cooling: 5, strength: 5 },
    tags: ['vocni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f8cf4a', secondary: '#fbe48c', accent: '#cdefff', background: '#2c230f', text: '#fffcf2' },
    mixIdeas: {
      bs: [
        'Mi Amor i Mango Tango Ice, za tropski koktel.',
        'Mi Amor i Strawberry Splash, za voćni milkshake.',
        'Mi Amor i Lemon Mint, za svježiji, kiselkastiji kotlić.'
      ],
      en: [
        'Mi Amor with Mango Tango Ice for a tropical cocktail.',
        'Mi Amor with Strawberry Splash for a fruity milkshake.',
        'Mi Amor with Lemon Mint for a fresher, tangier bowl.'
      ]
    },
    similar: ['adalya-dubai', 'adalya-sheik-money', 'haze-pineapple-krush']
  },
  {
    id: 'adalya-english-lord',
    brand: 'adalya',
    leaf: 'light',
    name: 'English Lord',
    shortDescription: {
      bs: 'Mango, sočna breskva i slatka malina sa daškom mente.',
      en: 'Mango, juicy peach and sweet raspberry with a hint of mint.'
    },
    description: {
      bs: [
        'English Lord spaja mango, sočnu breskvu i slatku malinu u mekan, voćni okus.',
        'Menta je tu samo kao dašak na kraju, pa okus ostaje sladak i pun.',
        'Dobar je izbor kad želiš voćni mix koji je već složen za tebe.'
      ],
      en: [
        'English Lord combines mango, juicy peach and sweet raspberry into a soft, fruity flavor.',
        'The mint is only a hint at the end, so the flavor stays sweet and full.',
        'A good pick when you want a fruity mix that is already put together for you.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 8 },
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ffb07a', intensity: 7 },
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#d61f5b', intensity: 6 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 3 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 9, cooling: 3, strength: 5 },
    tags: ['vocni', 'tropski', 'bobicasti', 'mint', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffb52e', secondary: '#ffb07a', accent: '#d61f5b', background: '#2d1f0b', text: '#fffaf0' },
    mixIdeas: {
      bs: [
        'English Lord i Berlin Nights, za više breskve.',
        'English Lord i Mint, 70/30, za svježiji kotlić.',
        'English Lord i Lady Killer, za voćni mix sa mangom.'
      ],
      en: [
        'English Lord with Berlin Nights for more peach.',
        'English Lord with Mint, 70/30, for a fresher bowl.',
        'English Lord with Lady Killer for a fruity mango mix.'
      ]
    },
    similar: ['revoshi-lady-mystique', 'adalya-hawaii', 'adalya-mango-tango-ice', 'holster-p-rex']
  },
  {
    id: 'adalya-mango-tango-ice',
    brand: 'adalya',
    leaf: 'light',
    name: 'Mango Tango Ice',
    shortDescription: {
      bs: 'Slatki mango i aromatična marakuja sa osvježavajućim mentolom.',
      en: 'Sweet mango and aromatic passion fruit with a refreshing touch of menthol.'
    },
    description: {
      bs: [
        'Mango Tango Ice je slatki mango sa aromatičnom marakujom, koja mu daje mirisnu, tropsku notu.',
        'Mentol je tu da osvježi izdah, pa okus nije težak ni kad je vani vruće.',
        'Ko voli Lady Killer ili Hawaii, ovdje će naći mango u prvom planu.'
      ],
      en: [
        'Mango Tango Ice is sweet mango with aromatic passion fruit, which gives it a fragrant, tropical note.',
        'The menthol is there to freshen the exhale, so the flavor never feels heavy, even on a hot day.',
        'If you like Lady Killer or Hawaii, you will find mango front and center here.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 9 },
      { name: { bs: 'Marakuja', en: 'Passion fruit' }, illustration: 'marakuja', color: '#f2a03a', intensity: 6 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 7, fruitiness: 9, cooling: 6, strength: 5 },
    tags: ['vocni', 'tropski', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffb52e', secondary: '#f2a03a', accent: '#cdefff', background: '#2d1f0b', text: '#fffaf0' },
    mixIdeas: {
      bs: [
        'Mango Tango Ice i Mi Amor, za tropski koktel.',
        'Mango Tango Ice i Love 66, za voćni ljetni mix.',
        'Mango Tango Ice i Ice Lime on the Rocks, za kiselkast, leden mango.'
      ],
      en: [
        'Mango Tango Ice with Mi Amor for a tropical cocktail.',
        'Mango Tango Ice with Love 66 for a fruity summer mix.',
        'Mango Tango Ice with Ice Lime on the Rocks for a tangy, icy mango.'
      ]
    },
    similar: ['revoshi-lady-mystique', 'adalya-hawaii', 'adalya-lady-killer']
  },
  {
    id: 'adalya-ice-lime-on-the-rocks',
    brand: 'adalya',
    leaf: 'light',
    name: 'Ice Lime on the Rocks',
    mood: 'frost',
    shortDescription: {
      bs: 'Kisela limeta sa čistom mentom i hladnim mentolom.',
      en: 'Zesty lime with clean mint and cold menthol.'
    },
    description: {
      bs: [
        'Ice Lime on the Rocks je kisela, živa limeta sa mentom i jakim hlađenjem.',
        'Okus podsjeća na ledeni mojito bez alkohola: svjež, oštar i nimalo težak.',
        'Sam je odličan za vruće dane, a u miksevima doda kiselinu i led bilo kojem voću.'
      ],
      en: [
        'Ice Lime on the Rocks is a zesty, lively lime with mint and strong cooling.',
        'It recalls an alcohol-free iced mojito: fresh, sharp and not heavy at all.',
        'On its own it is great for hot days, and in mixes it adds sourness and ice to any fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#7cc242', intensity: 9 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 7 }
    ],
    profile: { sweetness: 5, freshness: 9, fruitiness: 7, cooling: 8, strength: 5 },
    tags: ['vocni', 'citrusni', 'mint', 'ledeni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#7cc242', secondary: '#2fae78', accent: '#cdefff', background: '#1b210e', text: '#f6fbf2' },
    mixIdeas: {
      bs: [
        'Ice Lime on the Rocks i Watermelon, za ledenu lubenicu sa limetom.',
        'Ice Lime on the Rocks i Mango Tango Ice, za kiselkast tropski kotlić.',
        'Ice Lime on the Rocks i Berrymix, za ledene bobice.'
      ],
      en: [
        'Ice Lime on the Rocks with Watermelon for icy watermelon with lime.',
        'Ice Lime on the Rocks with Mango Tango Ice for a tangy tropical bowl.',
        'Ice Lime on the Rocks with Berrymix for icy berries.'
      ]
    },
    similar: ['serbetli-ice-blueberry', 'adalya-swiss-bonbon', 'adalya-tynky-wynky']
  },
  {
    id: 'adalya-watermelon',
    brand: 'adalya',
    leaf: 'light',
    name: 'Watermelon',
    shortDescription: {
      bs: 'Slatka lubenica, puna i sočna, bez hlađenja.',
      en: 'Sweet watermelon, full and juicy, with no cooling.'
    },
    description: {
      bs: [
        'Adalya Watermelon je slatka, sočna lubenica bez mente i bez leda.',
        'Okus je pun i voćni, pa je dobar kad želiš čisto voće umjesto ledenog okusa.',
        'Odlična je baza za ljetne mikseve, jer se slaže sa skoro svime.'
      ],
      en: [
        'Adalya Watermelon is sweet, juicy watermelon with no mint and no ice.',
        'The flavor is full and fruity, so it is good when you want pure fruit instead of an icy flavor.',
        'A great base for summer mixes, since it goes with almost anything.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8434f', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'ljetni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8434f', secondary: '#f2989e', accent: '#ae323b', background: '#2a0f0f', text: '#fdf2f3' },
    mixIdeas: {
      bs: [
        'Watermelon i Ice Lime on the Rocks, za ledenu lubenicu.',
        'Watermelon i Double Melon, za još više dinje.',
        'Watermelon i Berrymix, za ljetne bobice.'
      ],
      en: [
        'Watermelon with Ice Lime on the Rocks for an icy watermelon.',
        'Watermelon with Double Melon for even more melon.',
        'Watermelon with Berrymix for summer berries.'
      ]
    },
    similar: ['al-fakher-watermelon', 'adalya-watermelon-mint', 'adalya-angel-lips', '187-pink-mellow']
  },
  {
    id: 'adalya-watermelon-mint',
    brand: 'adalya',
    leaf: 'light',
    name: 'Watermelon Mint',
    shortDescription: {
      bs: 'Sočna lubenica sa čistim, hladnim završetkom mente.',
      en: 'Juicy watermelon with a clean, cool mint finish.'
    },
    description: {
      bs: [
        'Watermelon Mint je sočna lubenica sa mentom koja se javlja na izdahu.',
        'Menta daje čist, hladan završetak, ali lubenica ostaje glavna.',
        'Klasična ljetna kombinacija, dobra i za početnike.'
      ],
      en: [
        'Watermelon Mint is juicy watermelon with mint that shows up on the exhale.',
        'The mint gives a clean, cool finish, but the watermelon stays in the lead.',
        'A classic summer pairing, good for beginners too.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8434f', intensity: 9 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 9, cooling: 5, strength: 5 },
    tags: ['vocni', 'mint', 'ljetni', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8434f', secondary: '#2fae78', accent: '#6dc6a1', background: '#2a0f0f', text: '#fdf2f3' },
    mixIdeas: {
      bs: [
        'Watermelon Mint i Lemon Mint, za ljetnu limunadu.',
        'Watermelon Mint i Love 66, za tropsku lubenicu.',
        'Watermelon Mint i Berlin Nights, za lubenicu sa breskvom.'
      ],
      en: [
        'Watermelon Mint with Lemon Mint for a summer lemonade.',
        'Watermelon Mint with Love 66 for a tropical watermelon.',
        'Watermelon Mint with Berlin Nights for watermelon with peach.'
      ]
    },
    similar: ['al-fakher-watermelon-mint', 'adalya-love-66', 'adalya-angel-lips']
  },
  {
    id: 'adalya-grape-mint',
    brand: 'adalya',
    leaf: 'light',
    name: 'Grape Mint',
    shortDescription: {
      bs: 'Slatko, sočno grožđe sa svježim završetkom mente.',
      en: 'Sweet, juicy grape with a fresh mint finish.'
    },
    description: {
      bs: [
        'Grape Mint je klasična kombinacija: slatko, sočno grožđe i menta.',
        'Grožđe je naprijed, a menta dolazi na izdahu i osvježava ga.',
        'Ko voli klasične okuse iz lounge-a, ovo je siguran izbor.'
      ],
      en: [
        'Grape Mint is a classic pairing: sweet, juicy grape and mint.',
        'The grape leads, and the mint comes on the exhale and freshens it up.',
        'If you like classic lounge flavors, this is a safe pick.'
      ]
    },
    ingredients: [
      { name: { bs: 'Grožđe', en: 'Grape' }, illustration: 'grozdje', color: '#6b2c7a', intensity: 9 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 8, cooling: 5, strength: 5 },
    tags: ['vocni', 'mint', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#6b2c7a', secondary: '#2fae78', accent: '#6dc6a1', background: '#180c15', text: '#f5f0f6' },
    mixIdeas: {
      bs: [
        'Grape Mint i Blueberry Mint, za tamno voće sa mentom.',
        'Grape Mint i Lemon Mint, za kiselkastije grožđe.',
        'Grape Mint i Bağdadi, za voćniji mix.'
      ],
      en: [
        'Grape Mint with Blueberry Mint for dark fruit with mint.',
        'Grape Mint with Lemon Mint for a tangier grape.',
        'Grape Mint with Bağdadi for a fruitier mix.'
      ]
    },
    similar: ['al-waha-grape-mint', 'al-fakher-grape-mint', 'nameless-black-nana', '187-quelle']
  },
  {
    id: 'adalya-blueberry-mint',
    brand: 'adalya',
    leaf: 'light',
    name: 'Blueberry Mint',
    shortDescription: {
      bs: 'Borovnica i menta u jednostavnom, čistom spoju.',
      en: 'Blueberry and mint in a simple, clean pairing.'
    },
    description: {
      bs: [
        'Blueberry Mint je jednostavan spoj slatke borovnice i mente.',
        'Nema mnogo slojeva: borovnica je naprijed, a menta osvježava kraj.',
        'Dobar je sam, a još bolji kao dodatak voćnim miksevima.'
      ],
      en: [
        'Blueberry Mint is a simple pairing of sweet blueberry and mint.',
        'There are not many layers: the blueberry leads and the mint freshens the finish.',
        'Good on its own and even better as an addition to fruity mixes.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4a5fc1', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 8, cooling: 5, strength: 5 },
    tags: ['vocni', 'bobicasti', 'mint', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#4a5fc1', secondary: '#2fae78', accent: '#6dc6a1', background: '#14131f', text: '#f2f4fb' },
    mixIdeas: {
      bs: [
        'Blueberry Mint i Blue Melon, za više borovnice.',
        'Blueberry Mint i Grape Mint, za tamno voće.',
        'Blueberry Mint i Lemon Mint, za limunadu od borovnice.'
      ],
      en: [
        'Blueberry Mint with Blue Melon for more blueberry.',
        'Blueberry Mint with Grape Mint for dark fruit.',
        'Blueberry Mint with Lemon Mint for a blueberry lemonade.'
      ]
    },
    similar: ['al-fakher-blueberry-mint', 'adalya-berrymix', 'serbetli-ice-blueberry']
  },
  {
    id: 'adalya-orange-mint',
    brand: 'adalya',
    leaf: 'light',
    name: 'Orange Mint',
    shortDescription: {
      bs: 'Svijetla, sočna narandža sa hladnom notom mentola.',
      en: 'Bright, zesty orange with a cool menthol undertone.'
    },
    description: {
      bs: [
        'Orange Mint je sočna, živa narandža sa hladnom notom u pozadini.',
        'Hlađenje je umjereno, pa citrus ostaje u prvom planu.',
        'Odličan je i za mikseve: npr. Love 66 dobije citrusnu svježinu.'
      ],
      en: [
        'Orange Mint is a juicy, lively orange with a cool note in the background.',
        'The cooling is moderate, so the citrus stays front and center.',
        'Great for mixes too: Love 66, for example, gets a citrus lift.'
      ]
    },
    ingredients: [
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 9 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 5 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 8, cooling: 5, strength: 5 },
    tags: ['vocni', 'citrusni', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff9a2e', secondary: '#cdefff', accent: '#dcf4ff', background: '#2d1c0b', text: '#fff8f0' },
    mixIdeas: {
      bs: [
        'Orange Mint i Love 66, za citrusni tropski kotlić.',
        'Orange Mint i Mango Tango Ice, za tropski sok.',
        'Orange Mint i Strawberry Splash, za voćni punč.'
      ],
      en: [
        'Orange Mint with Love 66 for a citrusy tropical bowl.',
        'Orange Mint with Mango Tango Ice for a tropical juice.',
        'Orange Mint with Strawberry Splash for a fruit punch.'
      ]
    },
    similar: ['al-fakher-orange', 'al-fakher-orange-mint', '187-beach-vibez']
  },
  {
    id: 'adalya-berrymix',
    brand: 'adalya',
    leaf: 'light',
    name: 'Berrymix',
    shortDescription: {
      bs: 'Borovnica, kupina i malina sa laganom mentom.',
      en: 'Blueberry, blackberry and raspberry with a light touch of mint.'
    },
    description: {
      bs: [
        'Berrymix spaja tri bobice: borovnicu, kupinu i malinu.',
        'Rezultat je slatko-kiselkast, tamni voćni okus, a lagana menta ga osvježi na kraju.',
        'Dobar je za one koji vole bobičasto voće, a ne žele jak led.'
      ],
      en: [
        'Berrymix brings together three berries: blueberry, blackberry and raspberry.',
        'The result is a sweet and slightly tart dark fruit flavor, and a light touch of mint freshens it at the end.',
        'Good for berry lovers who do not want heavy ice.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4a5fc1', intensity: 7 },
      { name: { bs: 'Kupina', en: 'Blackberry' }, illustration: 'kupina', color: '#5a2a5e', intensity: 7 },
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#d61f5b', intensity: 7 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 4 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 3, strength: 5 },
    tags: ['vocni', 'bobicasti', 'mint', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#4a5fc1', secondary: '#5a2a5e', accent: '#d61f5b', background: '#14131f', text: '#f2f4fb' },
    mixIdeas: {
      bs: [
        'Berrymix i Lemon Mint, za limunadu od bobica.',
        'Berrymix i Raspberry, za više maline.',
        'Berrymix i Ice Lime on the Rocks, za ledene bobice.'
      ],
      en: [
        'Berrymix with Lemon Mint for a berry lemonade.',
        'Berrymix with Raspberry for more raspberry.',
        'Berrymix with Ice Lime on the Rocks for icy berries.'
      ]
    },
    similar: ['al-fakher-blueberry-mint', 'adalya-blueberry-mint', 'serbetli-ice-blueberry']
  },
  {
    id: 'adalya-strawberry-splash',
    brand: 'adalya',
    leaf: 'light',
    name: 'Strawberry Splash',
    shortDescription: {
      bs: 'Slatka jagoda i mekana, kremasta banana.',
      en: 'Sweet strawberry and soft, creamy banana.'
    },
    description: {
      bs: [
        'Strawberry Splash je slatka jagoda koju zaokružuje mekana, kremasta banana.',
        'Okus je gladak i sladak, pa podsjeća na smoothie od jagode i banane.',
        'Dobar je izbor za početnike i za one koji vole blage, voćne okuse.'
      ],
      en: [
        'Strawberry Splash is sweet strawberry rounded off by soft, creamy banana.',
        'The flavor is smooth and sweet, so it recalls a strawberry banana smoothie.',
        'A good pick for beginners and for anyone who likes mild, fruity flavors.'
      ]
    },
    ingredients: [
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e8354a', intensity: 9 },
      { name: { bs: 'Banana', en: 'Banana' }, illustration: 'banana', color: '#fbe48c', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 4, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8354a', secondary: '#fbe48c', accent: '#fcecaf', background: '#2a0d0f', text: '#fdf1f2' },
    mixIdeas: {
      bs: [
        'Strawberry Splash i Mint, 70/30, za svježiji smoothie.',
        'Strawberry Splash i Mi Amor, za tropski milkshake.',
        'Strawberry Splash i Lemon Mint, za limunadu od jagode.'
      ],
      en: [
        'Strawberry Splash with Mint, 70/30, for a fresher smoothie.',
        'Strawberry Splash with Mi Amor for a tropical milkshake.',
        'Strawberry Splash with Lemon Mint for a strawberry lemonade.'
      ]
    },
    similar: ['al-fakher-strawberry', 'musthave-strawberry', 'musthave-strawberry-lychee', 'holster-miss-joosy']
  },
  {
    id: 'adalya-sheik-money',
    brand: 'adalya',
    leaf: 'light',
    name: 'Sheik Money',
    shortDescription: {
      bs: 'Ananas i banana, tropski i slatki, bez mente.',
      en: 'Pineapple and banana, tropical and sweet, with no mint.'
    },
    description: {
      bs: [
        'Sheik Money je tropski spoj ananasa i banane.',
        'Za razliku od Mi Amora, ovdje nema hlađenja, pa su voće i slatkoća potpuno u prvom planu.',
        'Dobar je za one koji vole tropsko voće, a ne vole mentu.'
      ],
      en: [
        'Sheik Money is a tropical pairing of pineapple and banana.',
        'Unlike Mi Amor, there is no cooling here, so the fruit and sweetness are fully in front.',
        'Good for people who love tropical fruit but do not like mint.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f8cf4a', intensity: 8 },
      { name: { bs: 'Banana', en: 'Banana' }, illustration: 'banana', color: '#fbe48c', intensity: 8 }
    ],
    profile: { sweetness: 8, freshness: 5, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f8cf4a', secondary: '#fbe48c', accent: '#fcecaf', background: '#2c230f', text: '#fffcf2' },
    mixIdeas: {
      bs: [
        'Sheik Money i Mint, 70/30, ako želiš malo svježine.',
        'Sheik Money i Mango Tango Ice, za tropski koktel.',
        'Sheik Money i Strawberry Splash, za voćni smoothie.'
      ],
      en: [
        'Sheik Money with Mint, 70/30, if you want some freshness.',
        'Sheik Money with Mango Tango Ice for a tropical cocktail.',
        'Sheik Money with Strawberry Splash for a fruit smoothie.'
      ]
    },
    similar: ['adalya-mi-amor', 'adalya-dubai', 'al-fakher-pineapple', 'element-maui']
  },
  {
    id: 'adalya-bagdadi',
    brand: 'adalya',
    leaf: 'light',
    name: 'Bağdadi',
    shortDescription: {
      bs: 'Grožđe, breskva i bobičasto voće sa daškom mente.',
      en: 'Grape, peach and mixed berries with a hint of mint.'
    },
    description: {
      bs: [
        'Bağdadi je voćni mix u kojem je grožđe glavno, a breskva i bobičasto voće ga zaokružuju.',
        'Menta je blaga, pa okus ostaje sladak i svjež u isto vrijeme.',
        'Dobar je kad želiš složen voćni okus, a ne jedno voće.'
      ],
      en: [
        'Bağdadi is a fruity mix led by grape, with peach and mixed berries rounding it off.',
        'The mint is gentle, so the flavor stays sweet and fresh at the same time.',
        'Good when you want a layered fruit flavor rather than a single fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Grožđe', en: 'Grape' }, illustration: 'grozdje', color: '#6b2c7a', intensity: 8 },
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ffb07a', intensity: 6 },
      { name: { bs: 'Bobičasto voće', en: 'Mixed berries' }, illustration: 'kupina', color: '#5a2a5e', intensity: 6 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 4 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 3, strength: 5 },
    tags: ['vocni', 'bobicasti', 'mint', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#6b2c7a', secondary: '#ffb07a', accent: '#5a2a5e', background: '#180c15', text: '#f5f0f6' },
    mixIdeas: {
      bs: [
        'Bağdadi i Grape Mint, za više grožđa.',
        'Bağdadi i Berlin Nights, za više breskve.',
        'Bağdadi i Lemon Mint, za kiselkastiji kotlić.'
      ],
      en: [
        'Bağdadi with Grape Mint for more grape.',
        'Bağdadi with Berlin Nights for more peach.',
        'Bağdadi with Lemon Mint for a tangier bowl.'
      ]
    },
    similar: ['adalya-grape-mint', 'haze-purple-krush', 'al-waha-grape-mint']
  },
  {
    id: 'adalya-cactus',
    brand: 'adalya',
    leaf: 'light',
    name: 'Cactus',
    shortDescription: {
      bs: 'Slatki, voćni kaktus sa zelenom, sočnom notom.',
      en: 'Sweet, fruity cactus with a green, juicy note.'
    },
    description: {
      bs: [
        'Cactus je slatki, voćni okus sa zelenom, sočnom notom kaktusa.',
        'Nije tako poznat kao klasično voće, pa je dobar izbor kad želiš probati nešto novo.',
        'U miksevima se lijepo slaže sa citrusima i lubenicom.'
      ],
      en: [
        'Cactus is a sweet, fruity flavor with a green, juicy cactus note.',
        'It is not as familiar as classic fruit, so it is a good pick when you want to try something new.',
        'In mixes it goes nicely with citrus and watermelon.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kaktus', en: 'Cactus' }, illustration: 'kaktus', color: '#6cbf5a', intensity: 8 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 7, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#6cbf5a', secondary: '#aedca4', accent: '#518f44', background: '#192111', text: '#f5fbf3' },
    mixIdeas: {
      bs: [
        'Cactus i Ice Lime on the Rocks, za ledeni kaktus sa limetom.',
        'Cactus i Watermelon, za ljetni zeleni mix.',
        'Cactus i Lemon Mint, za svjež citrusni kotlić.'
      ],
      en: [
        'Cactus with Ice Lime on the Rocks for icy cactus with lime.',
        'Cactus with Watermelon for a summery green mix.',
        'Cactus with Lemon Mint for a fresh citrus bowl.'
      ]
    },
    similar: ['holster-ice-kaktuz', 'musthave-green-fizz', '187-i-love-hamburg']
  },
  {
    id: 'adalya-wind-of-cuba',
    brand: 'adalya',
    leaf: 'light',
    name: 'Wind of Cuba',
    mood: 'night',
    shortDescription: {
      bs: 'Aroma duhana za cigare sa mekom, slatkom vanilom.',
      en: 'Cigar tobacco aroma with soft, sweet vanilla.'
    },
    description: {
      bs: [
        'Wind of Cuba nije voćni okus: spaja aromu duhana za cigare sa mekom, slatkom vanilom.',
        'Vanila omekša duhansku notu, pa okus nije gorak, nego topao i zaobljen.',
        'Najviše odgovara mirnim večernjim sesijama i onima koji su se zasitili voća.'
      ],
      en: [
        'Wind of Cuba is not a fruity flavor: it combines cigar tobacco aroma with soft, sweet vanilla.',
        'The vanilla softens the tobacco note, so the flavor is not bitter but warm and rounded.',
        'It suits calm evening sessions best, and anyone who has had enough of fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Duhan cigare', en: 'Cigar tobacco' }, illustration: 'bilje', color: '#8a5a3a', intensity: 8 },
      { name: { bs: 'Vanila', en: 'Vanilla' }, illustration: 'vanila', color: '#f3e2b3', intensity: 7 }
    ],
    profile: { sweetness: 6, freshness: 3, fruitiness: 1, cooling: 0, strength: 6 },
    tags: ['desertni', 'nocni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#8a5a3a', secondary: '#f3e2b3', accent: '#f7ebca', background: '#1d130c', text: '#f7f3f1' },
    mixIdeas: {
      bs: [
        'Wind of Cuba i karamel ili kafa, za desertni večernji kotlić.',
        'Wind of Cuba i malo mente, 80/20, za svježiji kraj.',
        'Wind of Cuba i Swiss Bonbon, 80/20, za neobičan, hladniji kontrast.'
      ],
      en: [
        'Wind of Cuba with caramel or coffee for a dessert-style evening bowl.',
        'Wind of Cuba with a little mint, 80/20, for a fresher finish.',
        'Wind of Cuba with Swiss Bonbon, 80/20, for an unusual, cooler contrast.'
      ]
    },
    similar: ['al-fakher-vanilla', 'musthave-vanilla-cream', 'fumari-spiced-chai']
  },
  {
    id: 'al-fakher-double-apple',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Double Apple',
    mood: 'honey',
    shortDescription: {
      bs: 'Klasična dvostruka jabuka: slatka crvena, kiselkasta zelena i topla nota anisa.',
      en: 'The classic double apple: sweet red, tart green and a warm touch of anise.'
    },
    description: {
      bs: [
        'Double Apple je okus koji mnogi zamisle kad čuju riječ nargila. Spaja slatku crvenu i kiselkastu zelenu jabuku, pa je okus istovremeno sočan i svjež.',
        'Ono što ga izdvaja je anis. Daje toplu, blago začinsku notu koja podsjeća na stare orijentalne kafiće i čini okus punijim i ozbiljnijim od obične jabuke.',
        'Nema mente ni hlađenja, pa je dobar izbor za mirne, duže sesije i za one koji vole tradicionalan karakter.'
      ],
      en: [
        'Double Apple is the flavor a lot of people picture when they hear the word hookah. It brings together sweet red apple and tart green apple, so it tastes juicy and fresh at the same time.',
        'What sets it apart is the anise. It adds a warm, gently spiced note that recalls old-school Middle Eastern cafés and makes the flavor fuller and more grown-up than plain apple.',
        'There is no mint or chill, which makes it a good pick for slow, longer sessions and for anyone who likes a traditional style.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crvena jabuka', en: 'Red apple' }, illustration: 'jabuka', color: '#d8323c', intensity: 8 },
      { name: { bs: 'Zelena jabuka', en: 'Green apple' }, illustration: 'zelena-jabuka', color: '#8cc63f', intensity: 6 },
      { name: { bs: 'Anis', en: 'Anise' }, illustration: 'anis', color: '#8a4a22', intensity: 6 }
    ],
    profile: { sweetness: 6, freshness: 4, fruitiness: 7, cooling: 0, strength: 6 },
    tags: ['vocni', 'klasicni', 'zacinski'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#d8323c', secondary: '#8cc63f', accent: '#e8b04a', background: '#2e120d', text: '#fff3e2', water: '#e8b04a', smoke: ['#fff1dc', '#ffd9b0', '#f3e6c8'] },
    mixIdeas: {
      bs: [
        'Double Apple i Mint, otprilike 70/30, za klasičan spoj jabuke i mente.',
        'Double Apple sa malo Cane Minta, ako želiš jači i hladniji izdah.',
        'Double Apple i Berlin Nights, za topliju, medenu varijantu.'
      ],
      en: [
        'Double Apple with Mint, roughly 70/30, for the classic apple and mint pairing.',
        'Double Apple with a little Cane Mint if you want a stronger, colder exhale.',
        'Double Apple with Berlin Nights for a warmer, honeyed take.'
      ]
    },
    similar: ['nakhla-double-apple', 'revoshi-d-app-strong', 'adalya-berlin-nights', 'adalya-mint']
  },
  {
    id: 'al-fakher-mint',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Mint',
    shortDescription: {
      bs: 'Klasična Al Fakher menta: jaka, čista i hladna, bez slatkih dodataka.',
      en: 'The classic Al Fakher mint: bold, clean and cool, with no sweet extras.'
    },
    description: {
      bs: [
        'Al Fakher Mint je jedna od najprodavanijih menti na svijetu i okus koji se nalazi u gotovo svakom lounge baru. Svjež je i zelen od prvog povlačenja, sa jasnim hladnim izdahom.',
        'U poređenju sa Adalya Mint ima malo više "zrelog" duhana u pozadini i nešto izraženiji, oštriji mentol, ali je i dalje mekši od Tangiers Cane Mint.',
        'Odličan je sam, a još bolji kao dodatak: par grama osvježi gotovo svaki voćni okus.'
      ],
      en: [
        'Al Fakher Mint is one of the best-selling mints in the world and a flavor you will find in almost every lounge. It is fresh and green from the first pull, with a clear, cool exhale.',
        'Compared to Adalya Mint it has a little more tobacco character in the background and a slightly sharper menthol, yet it is still softer than Tangiers Cane Mint.',
        'Great on its own and even better as an add-on: a few grams freshen up almost any fruit flavor.'
      ]
    },
    ingredients: [
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 9 },
      { name: { bs: 'Hlađenje', en: 'Cooling' }, illustration: 'kristal', color: '#dcf5ec', intensity: 5 }
    ],
    profile: { sweetness: 2, freshness: 10, fruitiness: 0, cooling: 8, strength: 6 },
    tags: ['mint', 'osvjezavajuci', 'klasicni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#22a36d', secondary: '#bdeed6', accent: '#0f6e47', background: '#e3f6ec', text: '#0a2a1c', water: '#a9efd0' },
    mixIdeas: {
      bs: [
        'Mint i Two Apples, 30/70, klasičan bliskoistočni miks sa svježim krajem.',
        'Mint uz bilo koji voćni okus, oko 20-30%, za hladniji izdah.',
        'Mint i Cola, za "kolu sa ledom i mentom".'
      ],
      en: [
        'Mint with Two Apples, 30/70, a classic Middle Eastern mix with a fresh finish.',
        'Mint with any fruit flavor at around 20-30% for a cooler exhale.',
        'Mint with Cola for a "cola on ice with mint" bowl.'
      ]
    },
    similar: ['adalya-mint', 'haze-mint-supreme', 'tangiers-cane-mint', 'al-fakher-lemon-mint']
  },
  {
    id: 'al-fakher-grape',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Grape',
    shortDescription: {
      bs: 'Slatko, sočno grožđe, kao sok od bijelog grožđa, bez mente.',
      en: 'Sweet, juicy grape like white grape juice, with no mint.'
    },
    description: {
      bs: [
        'Grape je čisto grožđe: slatko i sočno, bliže soku od bijelog grožđa, sa blagom kiselinom na kraju.',
        'Za razliku od Grape Minta, nema mente, pa je okus topliji, slađi i više voćni nego osvježavajući.',
        'Dobar je sam, a i kao baza: par grama mente ili limuna od njega napravi sasvim drugi okus.'
      ],
      en: [
        'Grape is pure grape: sweet and juicy, closer to white grape juice, with a light tang at the end.',
        'Unlike Grape Mint, it has no mint, so the flavor is warmer, sweeter and more fruity than refreshing.',
        'Good on its own and as a base: a few grams of mint or lemon turn it into a completely different bowl.'
      ]
    },
    ingredients: [
      { name: { bs: 'Grožđe', en: 'Grape' }, illustration: 'grozdje', color: '#9b59b6', intensity: 9 }
    ],
    profile: { sweetness: 8, freshness: 4, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'slatki', 'klasicni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#9b59b6', secondary: '#d7b8e6', accent: '#7fbf4a', background: '#1e1028', text: '#f8efff' },
    mixIdeas: {
      bs: [
        'Grape i Mint, 70/30, za klasično grožđe sa mentom.',
        'Grape i Double Apple, za stari orijentalni miks.',
        'Grape i Blueberry, za tamni bobičasti miks.'
      ],
      en: [
        'Grape with Mint, 70/30, for the classic grape and mint.',
        'Grape with Double Apple for an old-school café mix.',
        'Grape with Blueberry for a dark berry mix.'
      ]
    },
    similar: ['al-fakher-grape-mint', 'al-waha-grape-mint', 'musthave-ruby-grape', 'musthave-garnet-grape']
  },
  {
    id: 'al-fakher-grape-mint',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Grape Mint',
    shortDescription: {
      bs: 'Slatko bijelo grožđe i hladna menta: jedan od najprodavanijih klasika.',
      en: 'Sweet white grape and cool mint: one of the best selling classics.'
    },
    description: {
      bs: [
        'Grape Mint je klasik orijentalnih kafića. Grožđe je slatko i sočno, bliže bijelom nego tamnom, a menta ga hladi i čini laganim.',
        'Menta je izražena, ali ne ledena, pa je okus osvježavajući bez peckanja u grlu.',
        'Dobar okus za duže sesije sa društvom i jedan od najlakših načina da probaš Al Fakher.'
      ],
      en: [
        'Grape Mint is a classic of hookah cafés. The grape is sweet and juicy, closer to white than dark, and the mint cools it down and keeps it light.',
        'The mint is pronounced but not icy, so it is refreshing without biting the throat.',
        'A good flavor for long sessions with friends and one of the easiest ways to try Al Fakher.'
      ]
    },
    ingredients: [
      { name: { bs: 'Bijelo grožđe', en: 'White grape' }, illustration: 'grozdje', color: '#c9d77a', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 7, cooling: 6, strength: 5 },
    tags: ['vocni', 'mint', 'klasicni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#9fbf4a', secondary: '#d8e89a', accent: '#2fae78', background: '#1a2410', text: '#f3fbe4' },
    mixIdeas: {
      bs: [
        'Grape Mint i Double Apple, za stari orijentalni miks.',
        'Grape Mint i Blueberry, za tamnije bobičasto grožđe.',
        'Grape Mint i Watermelon Mint, za ljetni miks sa mentom.'
      ],
      en: [
        'Grape Mint with Double Apple for an old-school café mix.',
        'Grape Mint with Blueberry for a darker, berry-like grape.',
        'Grape Mint with Watermelon Mint for a summer mix with mint.'
      ]
    },
    similar: ['al-waha-grape-mint', 'nameless-black-nana', 'al-fakher-mint', 'al-fakher-watermelon-mint']
  },
  {
    id: 'al-fakher-lemon-mint',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Lemon Mint',
    seo: {
      title: {
        bs: 'Al Fakher Lemon Mint (Lemon with Mint) okus za nargilu | MyShishapedia',
        en: 'Al Fakher Lemon Mint (Lemon with Mint) shisha flavor | MyShishapedia'
      },
      description: {
        bs: 'Al Fakher Lemon with Mint: kiselkast limun i hladna menta. Profil okusa, jačina, najbolji miksevi i slični lemon mint okusi za nargilu.',
        en: 'Al Fakher Lemon with Mint: tangy lemon and cool mint. Flavor profile, strength, best mixes and similar lemon mint hookah flavors.'
      }
    },
    shortDescription: {
      bs: 'Kiselkast limun i hladna menta: jednostavan, čist i osvježavajući klasik.',
      en: 'Tangy lemon and cool mint: a simple, clean and refreshing classic.'
    },
    description: {
      bs: [
        'Lemon Mint je kao limunada sa listićima mente. Limun je kiselkast i svjež, sa malo slatkoće, a menta daje hladan, čist izdah.',
        'Na pakovanju Al Fakhera ovaj okus se zove Lemon with Mint (limun sa mentom), pa ga u prodavnicama i lounge barovima naći ćeš pod oba naziva.',
        'Okus je lagan i ne zamara, pa je dobar za vruće dane i duže sesije.',
        'Za poređenje probaj i Fumari i Mazaya Lemon Mint: isti par, tri različita karaktera.'
      ],
      en: [
        'Lemon Mint is like lemonade with mint leaves. The lemon is tangy and fresh with a bit of sweetness, and the mint gives a cool, clean exhale.',
        'On the Al Fakher pack this flavor is called Lemon with Mint, so you will find it under both names in shops and lounges.',
        'It is light and never tiring, so it works well on hot days and in long sessions.',
        'For comparison, try the Fumari and Mazaya Lemon Mint too: the same pair, three different characters.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 7 }
    ],
    profile: { sweetness: 5, freshness: 9, fruitiness: 6, cooling: 6, strength: 5 },
    tags: ['citrusni', 'mint', 'klasicni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f2d93a', secondary: '#9fe0b8', accent: '#1f9a66', background: '#17240f', text: '#fbffe8' },
    mixIdeas: {
      bs: [
        'Lemon Mint i Double Apple, za svježiju dvostruku jabuku.',
        'Lemon Mint i Grape Mint, za voćnu limunadu.',
        'Lemon Mint i Raspberry, za malinovu limunadu sa mentom.'
      ],
      en: [
        'Lemon Mint with Double Apple for a fresher double apple.',
        'Lemon Mint with Grape Mint for a fruity lemonade.',
        'Lemon Mint with Raspberry for a raspberry lemonade with mint.'
      ]
    },
    faq: [
      {
        q: { bs: 'Da li je Al Fakher Lemon Mint isto što i Lemon with Mint?', en: 'Is Al Fakher Lemon Mint the same as Lemon with Mint?' },
        a: { bs: 'Da. Na pakovanju Al Fakhera okus se zove Lemon with Mint, a mnogi ga kraće zovu Lemon Mint.', en: 'Yes. On the Al Fakher pack the flavor is called Lemon with Mint, and many people simply call it Lemon Mint.' }
      },
      {
        q: { bs: 'Kakvog je okusa Lemon Mint?', en: 'What does Lemon Mint taste like?' },
        a: { bs: 'Kao limunada sa mentom: kiselkast, svjež limun sa malo slatkoće i hladan, čist izdah.', en: 'Like lemonade with mint: tangy, fresh lemon with a little sweetness and a cool, clean exhale.' }
      },
      {
        q: { bs: 'Da li je Lemon Mint jak?', en: 'Is Lemon Mint strong?' },
        a: { bs: 'Nije. Rađen je na svijetlom listu (Virginia), pa je blag i dobar i za početnike.', en: 'No. It is made on blonde leaf (Virginia), so it is mild and a good choice for beginners too.' }
      },
      {
        q: { bs: 'Sa čim se miješa Lemon Mint?', en: 'What can I mix Lemon Mint with?' },
        a: { bs: 'Dobro ide uz Double Apple, Grape Mint ili Raspberry. Uz malinu dobiješ malinovu limunadu sa mentom.', en: 'It goes well with Double Apple, Grape Mint or Raspberry. With raspberry you get a raspberry lemonade with mint.' }
      },
      {
        q: { bs: 'Koji su okusi slični Al Fakher Lemon Mintu?', en: 'Which flavors are similar to Al Fakher Lemon Mint?' },
        a: { bs: 'Fumari Lemon Mint i Mazaya Lemon Mint su isti par limuna i mente, svaki sa svojim karakterom. Za ledeniji limun probaj Revoshi Eskimo Lemon.', en: 'Fumari Lemon Mint and Mazaya Lemon Mint are the same lemon and mint pair, each with its own character. For an icier lemon, try Revoshi Eskimo Lemon.' }
      }
    ],
    similar: ['fumari-lemon-mint', 'mazaya-lemon-mint', 'al-fakher-mint', 'adalya-lemon-cocktail']
  },
  {
    id: 'al-fakher-watermelon-mint',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Watermelon Mint',
    shortDescription: {
      bs: 'Sočna, slatka lubenica sa hladnom mentom: ljetni klasik.',
      en: 'Juicy, sweet watermelon with cool mint: a summer classic.'
    },
    description: {
      bs: [
        'Watermelon Mint je lubenica onakva kakvu je pamtiš sa ljeta: slatka, vodenasta i sočna. Menta joj dodaje hladnoću i čini je još osvježavajućom.',
        'Okus je mekan i jednostavan, bez kiselosti, pa ga je lako pušiti i ako tek počinješ.',
        'Odličan i kao baza za mikseve sa drugim voćem.'
      ],
      en: [
        'Watermelon Mint is watermelon the way you remember it from summer: sweet, watery and juicy. The mint adds coolness and makes it even more refreshing.',
        'It is soft and simple with no tartness, so it is easy to smoke even if you are just starting out.',
        'Great as a base for mixes with other fruit, too.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8434f', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 8, cooling: 5, strength: 5 },
    tags: ['vocni', 'mint', 'ljetni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8434f', secondary: '#7fd18b', accent: '#1f8a4c', background: '#2a0f14', text: '#fff0f0' },
    mixIdeas: {
      bs: [
        'Watermelon Mint i Grape Mint, za voćni miks sa mentom.',
        'Watermelon Mint i Lemon Mint, za lubenicu-limunadu.',
        'Watermelon Mint i Blueberry, za lubenicu sa bobicama.'
      ],
      en: [
        'Watermelon Mint with Grape Mint for a fruity mix with mint.',
        'Watermelon Mint with Lemon Mint for a watermelon lemonade.',
        'Watermelon Mint with Blueberry for watermelon with berries.'
      ]
    },
    similar: ['serbetli-ice-watermelon', 'al-waha-big-boy', 'adalya-love-66', 'al-fakher-grape-mint']
  },
  {
    id: 'al-fakher-blueberry',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Blueberry',
    shortDescription: {
      bs: 'Slatka, džemasta borovnica, mekana i bez hlađenja.',
      en: 'Sweet, jammy blueberry, soft and without any cooling.'
    },
    description: {
      bs: [
        'Blueberry je čista borovnica: slatka, malo džemasta i tamna. Nema mente ni mentola, pa je okus topao i mekan.',
        'Slatkoća je izražena, ali ne bombonska, a blaga kiselost bobice drži okus živim.',
        'Dobar samostalno, a još češće se koristi kao bobičasta nota u miksevima sa mentom ili limunom.'
      ],
      en: [
        'Blueberry is pure blueberry: sweet, a little jammy and dark. There is no mint or menthol, so the flavor is warm and soft.',
        'The sweetness is pronounced but not candy-like, and a slight berry tartness keeps it lively.',
        'Good on its own, and even more often used as the berry note in mixes with mint or lemon.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4b5bb5', intensity: 9 }
    ],
    profile: { sweetness: 8, freshness: 5, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#5b6fd6', secondary: '#a9b6ff', accent: '#e86ba8', background: '#12142e', text: '#eef0ff' },
    mixIdeas: {
      bs: [
        'Blueberry i Mint, 70/30, za borovnicu sa mentom.',
        'Blueberry i Lemon Mint, za borovnicu-limunadu.',
        'Blueberry i Grape Mint, za tamni voćni miks.'
      ],
      en: [
        'Blueberry with Mint, 70/30, for blueberry and mint.',
        'Blueberry with Lemon Mint for a blueberry lemonade.',
        'Blueberry with Grape Mint for a dark fruit mix.'
      ]
    },
    similar: ['serbetli-ice-blueberry', 'adalya-blue-ice', 'trifecta-blue-strawberry', 'starbuzz-blue-mist']
  },
  {
    id: 'al-fakher-gum-mint',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Gum Mint',
    seo: {
      title: {
        bs: 'Al Fakher Gum Mint (Gum with Mint) okus za nargilu | MyShishapedia',
        en: 'Al Fakher Gum Mint (Gum with Mint) shisha flavor | MyShishapedia'
      },
      description: {
        bs: 'Al Fakher Gum with Mint: slatka žvakaća guma i hladna menta. Profil okusa, jačina, ideje za mikseve i slični okusi za nargilu.',
        en: 'Al Fakher Gum with Mint: sweet chewing gum and cool mint. Flavor profile, strength, mix ideas and similar gum mint hookah flavors.'
      }
    },
    shortDescription: {
      bs: 'Slatka žvakaća guma i hladna menta, kao svježa žvaka sa mentolom.',
      en: 'Sweet chewing gum and cool mint, like a fresh stick of mint gum.'
    },
    description: {
      bs: [
        'Gum Mint ima okus slatke žvakaće gume, a menta mu daje hladan, svjež izdah. Podsjeća na žvaku sa mentom koju tek otvoriš.',
        'Na pakovanju Al Fakhera zove se Gum with Mint, pa ga u prodavnicama i lounge barovima naći ćeš pod oba naziva.',
        'Sladak je, ali ga menta drži laganim, pa je dobar i za duže sesije. Kao i ostali Al Fakher okusi, rađen je na svijetlom listu, pa nije jak.'
      ],
      en: [
        'Gum Mint tastes like sweet chewing gum, and the mint gives it a cool, fresh exhale. Think of a stick of mint gum you have just unwrapped.',
        'On the Al Fakher pack it is called Gum with Mint, so you will find it under both names in shops and lounges.',
        'It is sweet, but the mint keeps it light, so it works for longer sessions too. Like other Al Fakher flavors, it is made on blonde leaf, so it is not harsh.'
      ]
    },
    ingredients: [
      { name: { bs: 'Žvakaća guma', en: 'Chewing gum' }, illustration: 'zvaka', color: '#ff8fb8', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 1, cooling: 6, strength: 5 },
    tags: ['bombon', 'mint', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff8fb8', secondary: '#9fe0c4', accent: '#2fae78', background: '#2a1020', text: '#fff0f6' },
    mixIdeas: {
      bs: [
        'Gum Mint i Watermelon Mint, za lubenicu sa žvakom.',
        'Gum Mint i Strawberry, za jagodu i žvaku.',
        'Gum Mint i Mint, 50/50, za još hladniji izdah.'
      ],
      en: [
        'Gum Mint with Watermelon Mint for watermelon bubble gum.',
        'Gum Mint with Strawberry for strawberry gum.',
        'Gum Mint with Mint, 50/50, for an even cooler exhale.'
      ]
    },
    faq: [
      {
        q: { bs: 'Da li je Al Fakher Gum Mint isto što i Gum with Mint?', en: 'Is Al Fakher Gum Mint the same as Gum with Mint?' },
        a: { bs: 'Da. Na pakovanju Al Fakhera okus se zove Gum with Mint, a mnogi ga kraće zovu Gum Mint.', en: 'Yes. On the Al Fakher pack the flavor is called Gum with Mint, and many people simply call it Gum Mint.' }
      },
      {
        q: { bs: 'Kakvog je okusa Gum Mint?', en: 'What does Gum Mint taste like?' },
        a: { bs: 'Kao slatka žvakaća guma sa mentom: sladak udah i hladan, svjež izdah.', en: 'Like sweet mint chewing gum: a sweet inhale and a cool, fresh exhale.' }
      },
      {
        q: { bs: 'Sa čim se miješa Gum Mint?', en: 'What can I mix Gum Mint with?' },
        a: { bs: 'Dobro ide uz Watermelon Mint, Strawberry ili čistu Mint, kad želiš hladniji izdah.', en: 'It goes well with Watermelon Mint, Strawberry or plain Mint when you want a cooler exhale.' }
      }
    ],
    similar: ['mazaya-gum-mint', 'haze-double-bubble', 'al-fakher-mint', 'musthave-ice-mint']
  },
  {
    id: 'al-fakher-peach',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Peach',
    shortDescription: {
      bs: 'Zrela, sočna breskva, slatka sa blagom kiselinom i bez mente.',
      en: 'Ripe, juicy peach, sweet with a light tang and no mint.'
    },
    description: {
      bs: [
        'Peach je čista breskva: slatka, sočna i mekana, sa blagom kiselinom koja je drži svježom.',
        'Nema mente ni mentola, pa je okus topao i voćan od prvog do zadnjeg povlačenja.',
        'Dobar je sam, a još više kao voćna baza za mikseve sa mentom ili citrusima.'
      ],
      en: [
        'Peach is pure peach: sweet, juicy and soft, with a light tang that keeps it fresh.',
        'There is no mint or menthol, so the flavor stays warm and fruity from the first pull to the last.',
        'Good on its own and even better as a fruity base for mixes with mint or citrus.'
      ]
    },
    ingredients: [
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ffb07a', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'slatki', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffa36b', secondary: '#ffd2b0', accent: '#e8667a', background: '#2b140c', text: '#fff3ea' },
    mixIdeas: {
      bs: [
        'Peach i Mint, 70/30, za breskvu sa mentom.',
        'Peach i Lemon Mint, za ledeni čaj od breskve.',
        'Peach i Strawberry, za ljetni voćni miks.'
      ],
      en: [
        'Peach with Mint, 70/30, for peach and mint.',
        'Peach with Lemon Mint for a peach iced tea.',
        'Peach with Strawberry for a summer fruit mix.'
      ]
    },
    similar: ['musthave-sweet-peach', 'tangiers-kashmir-peach', 'revoshi-domingo', 'adalya-berlin-nights']
  },
  {
    id: 'al-fakher-kiwi',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Kiwi',
    shortDescription: {
      bs: 'Zeleni kivi, sočan i kiselkast, sa tropskim slatkim krajem.',
      en: 'Green kiwi, juicy and tangy, with a sweet tropical finish.'
    },
    description: {
      bs: [
        'Kiwi je zelen i sočan: na udahu kiselkast i svjež, a na izdahu sladi, sa tropskim tonom.',
        'Nema mente, pa svježina dolazi od same kiseline voća.',
        'Dobar je za one koji vole voćne okuse koji nisu preslatki, a odličan i za mikseve sa jagodom ili mentom.'
      ],
      en: [
        'Kiwi is green and juicy: tangy and fresh on the inhale, sweeter on the exhale, with a tropical touch.',
        'There is no mint, so the freshness comes from the fruit\'s own tartness.',
        'A good pick if you like fruit flavors that are not too sweet, and great in mixes with strawberry or mint.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kivi', en: 'Kiwi' }, illustration: 'kivi', color: '#8cc63f', intensity: 9 }
    ],
    profile: { sweetness: 5, freshness: 7, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#8cc63f', secondary: '#d4ec9a', accent: '#5a3a1e', background: '#142208', text: '#f4ffe6' },
    mixIdeas: {
      bs: [
        'Kiwi i Strawberry, 50/50, klasičan miks jagode i kivija.',
        'Kiwi i Mint, 70/30, za svježiji kivi.',
        'Kiwi i Lemon Mint, za kiselkastu zelenu limunadu.'
      ],
      en: [
        'Kiwi with Strawberry, 50/50, the classic strawberry kiwi.',
        'Kiwi with Mint, 70/30, for a fresher kiwi.',
        'Kiwi with Lemon Mint for a tangy green lemonade.'
      ]
    },
    similar: ['musthave-kiwi-smoothie', 'musthave-green-fizz', 'musthave-kiwi-apple-lime', 'al-fakher-lemon-mint']
  },
  {
    id: 'al-fakher-strawberry',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Strawberry',
    shortDescription: {
      bs: 'Slatka, zrela jagoda, jednostavna i mekana, bez mente.',
      en: 'Sweet, ripe strawberry, simple and soft, with no mint.'
    },
    description: {
      bs: [
        'Strawberry je jagoda onakva kakvu je znaš: slatka, zrela i mirisna, sa malo kiseline.',
        'Okus je jednostavan i mekan, pa je dobar izbor ako tek počinješ sa nargilom.',
        'Najčešće se koristi i kao baza za mikseve: jagoda ide uz gotovo sve, od kivija do mente.'
      ],
      en: [
        'Strawberry is strawberry the way you know it: sweet, ripe and fragrant, with a little tartness.',
        'The flavor is simple and soft, which makes it a good choice if you are new to hookah.',
        'It is also a popular base for mixes: strawberry goes with almost anything, from kiwi to mint.'
      ]
    },
    ingredients: [
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e8344a', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8344a', secondary: '#ffb3bd', accent: '#3f9a4a', background: '#2a0a10', text: '#fff0f2' },
    mixIdeas: {
      bs: [
        'Strawberry i Kiwi, 50/50, za jagodu i kivi.',
        'Strawberry i Mint, 70/30, za jagodu sa mentom.',
        'Strawberry i Watermelon Mint, za ljetni miks.'
      ],
      en: [
        'Strawberry with Kiwi, 50/50, for strawberry kiwi.',
        'Strawberry with Mint, 70/30, for strawberry and mint.',
        'Strawberry with Watermelon Mint for a summer mix.'
      ]
    },
    similar: ['musthave-strawberry', 'trifecta-blue-strawberry', 'adalya-raspberry', 'al-fakher-watermelon-mint']
  },
  {
    id: 'al-fakher-orange-mint',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Orange Mint',
    seo: {
      title: {
        bs: 'Al Fakher Orange Mint (Orange with Mint) okus za nargilu | MyShishapedia',
        en: 'Al Fakher Orange Mint (Orange with Mint) shisha flavor | MyShishapedia'
      },
      description: {
        bs: 'Al Fakher Orange with Mint: sočna narandža i hladna menta. Profil okusa, jačina, ideje za mikseve i slični okusi za nargilu.',
        en: 'Al Fakher Orange with Mint: juicy orange and cool mint. Flavor profile, strength, mix ideas and similar orange mint hookah flavors.'
      }
    },
    shortDescription: {
      bs: 'Sočna, slatka narandža i hladna menta: kao hladan sok od narandže.',
      en: 'Juicy, sweet orange and cool mint, like a cold glass of orange juice.'
    },
    description: {
      bs: [
        'Orange Mint spaja slatku, sočnu narandžu i mentu. Narandža je zrela i blago kiselkasta, a menta joj daje hladan izdah.',
        'Na pakovanju Al Fakhera zove se Orange with Mint.',
        'Lagan je i osvježavajući, sličan Lemon Mintu, ali sladi i manje kiseo.'
      ],
      en: [
        'Orange Mint pairs sweet, juicy orange with mint. The orange is ripe and slightly tangy, and the mint gives it a cool exhale.',
        'On the Al Fakher pack it is called Orange with Mint.',
        'It is light and refreshing, close to Lemon Mint but sweeter and less sour.'
      ]
    },
    ingredients: [
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 }
    ],
    profile: { sweetness: 6, freshness: 8, fruitiness: 7, cooling: 5, strength: 5 },
    tags: ['citrusni', 'mint', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff9a2e', secondary: '#9fe0b8', accent: '#1f9a66', background: '#2a1606', text: '#fff5e6' },
    mixIdeas: {
      bs: [
        'Orange Mint i Lemon Mint, za citrusnu limunadu.',
        'Orange Mint i Peach, za breskvu i narandžu.',
        'Orange Mint i Strawberry, za voćni punč sa mentom.'
      ],
      en: [
        'Orange Mint with Lemon Mint for a citrus lemonade.',
        'Orange Mint with Peach for peach and orange.',
        'Orange Mint with Strawberry for a fruit punch with mint.'
      ]
    },
    similar: ['al-fakher-lemon-mint', 'starbuzz-pirates-cave', 'musthave-mandarin', 'starbuzz-sex-on-the-beach']
  },
  {
    id: 'al-fakher-cherry-mint',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Cherry Mint',
    shortDescription: {
      bs: 'Slatka višnja i hladna menta: voćni klasik sa svježim krajem.',
      en: 'Sweet cherry and cool mint: a fruity classic with a fresh finish.'
    },
    description: {
      bs: [
        'Cherry Mint je slatka, sočna višnja sa hladnom mentom. Višnja je tu glavna, a menta daje dugotrajno osvježenje na izdahu.',
        'Na pakovanju Al Fakhera zove se Cherry with Mint.',
        'Blag je, na svijetlom listu, pa je dobar i za početnike.'
      ],
      en: [
        'Cherry Mint is sweet, juicy cherry with cool mint. The cherry leads, and the mint adds a lasting freshness on the exhale.',
        'On the Al Fakher pack it is called Cherry with Mint.',
        'It is mild and made on blonde leaf, so it suits beginners too.'
      ]
    },
    ingredients: [
      { name: { bs: 'Višnja', en: 'Cherry' }, illustration: 'visnja', color: '#c8203c', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 8, cooling: 5, strength: 5 },
    tags: ['vocni', 'mint', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#c8203c', secondary: '#9fe0b8', accent: '#2fae78', background: '#24080e', text: '#fff0f2' },
    mixIdeas: {
      bs: [
        'Cherry Mint i Grape, za tamni voćni miks sa mentom.',
        'Cherry Mint i Lemon Mint, za višnja-limunadu.',
        'Cherry Mint i Watermelon Mint, za ljetni voćni miks.'
      ],
      en: [
        'Cherry Mint with Grape for a dark fruit mix with mint.',
        'Cherry Mint with Lemon Mint for a cherry lemonade.',
        'Cherry Mint with Watermelon Mint for a summer fruit mix.'
      ]
    },
    similar: ['adalya-cherry-mint', 'tangiers-maraschino-cherry', 'al-fakher-grape-mint']
  },
  {
    id: 'al-fakher-grapefruit',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Grapefruit',
    shortDescription: {
      bs: 'Slatki grejpfrut sa blagom gorčinom i kiselinom u pozadini.',
      en: 'Sweet grapefruit with a light bitterness and sourness behind it.'
    },
    description: {
      bs: [
        'Grapefruit je citrus u kojem je naprijed slatkoća, a u pozadini blaga gorčina i kiselina, kao kod pravog grejpfruta.',
        'Nema mente, pa je okus čist i voćni, a svježina dolazi od samog citrusa.',
        'Dobar je sam i kao citrusna nota u miksevima sa mentom ili bobicama.'
      ],
      en: [
        'Grapefruit is a citrus flavor with sweetness up front and a light bitterness and sourness behind it, like real grapefruit.',
        'There is no mint, so the flavor is clean and fruity, and the freshness comes from the citrus itself.',
        'Good on its own and as a citrus note in mixes with mint or berries.'
      ]
    },
    ingredients: [
      { name: { bs: 'Grejpfrut', en: 'Grapefruit' }, illustration: 'grejpfrut', color: '#f26b6b', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 8, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['citrusni', 'vocni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f26b6b', secondary: '#ffc2a8', accent: '#ff9a3c', background: '#2a1210', text: '#fff2ec' },
    mixIdeas: {
      bs: [
        'Grapefruit i Mint, 70/30, za svjež citrus.',
        'Grapefruit i Strawberry, za ružičastu limunadu.',
        'Grapefruit i Orange Mint, za citrusni miks.'
      ],
      en: [
        'Grapefruit with Mint, 70/30, for fresh citrus.',
        'Grapefruit with Strawberry for a pink lemonade.',
        'Grapefruit with Orange Mint for a citrus mix.'
      ]
    },
    similar: ['darkside-kalee-grap', 'musthave-grapefruit', 'al-fakher-lemon-mint']
  },
  {
    id: 'al-fakher-watermelon',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Watermelon',
    shortDescription: {
      bs: 'Sočna, slatka lubenica, čista i bez mente.',
      en: 'Juicy, sweet watermelon, clean and without mint.'
    },
    description: {
      bs: [
        'Watermelon je lubenica u najjednostavnijem obliku: slatka, sočna i lagana, kao kriška iz frižidera.',
        'Za razliku od Watermelon Minta, ovdje nema mente, pa okus ostaje čisto voćni i mekan.',
        'Dobar je za ljetne sesije i kao baza za mikseve kojima treba malo slatkoće.'
      ],
      en: [
        'Watermelon is watermelon in its simplest form: sweet, juicy and light, like a slice straight from the fridge.',
        'Unlike Watermelon Mint, there is no mint here, so the flavor stays purely fruity and soft.',
        'Good for summer sessions and as a base for mixes that need a little sweetness.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8434f', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'ljetni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8434f', secondary: '#f2989e', accent: '#ae323b', background: '#2a0f0f', text: '#fdf2f3' },
    mixIdeas: {
      bs: [
        'Watermelon i Mint, 70/30, za klasičnu ljetnu kombinaciju.',
        'Watermelon i Melon, za još slađi i sočniji kotlić.',
        'Watermelon i Lemon, za ljetnu limunadu od lubenice.'
      ],
      en: [
        'Watermelon with Mint, 70/30, for the classic summer pairing.',
        'Watermelon with Melon for an even sweeter, juicier bowl.',
        'Watermelon with Lemon for a watermelon lemonade.'
      ]
    },
    similar: ['adalya-watermelon', 'adalya-watermelon-mint', 'adalya-angel-lips', '187-pink-mellow']
  },
  {
    id: 'al-fakher-mango',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Mango',
    shortDescription: {
      bs: 'Zreli mango sa mekim, kremastim završetkom.',
      en: 'Ripe mango with a soft, creamy finish.'
    },
    description: {
      bs: [
        'Mango je zreo i sladak, sa onom gustom, skoro kremastom notom koju ima pravi zreli mango.',
        'Nema mente ni kiseline koja bi ga presjekla, pa je okus pun i topao.',
        'Sam je dobar za ljubitelje slatkog voća, a u miksevima donosi tropski karakter.'
      ],
      en: [
        'Mango is ripe and sweet, with the thick, almost creamy note that real ripe mango has.',
        'There is no mint or acidity to cut through it, so the flavor is full and warm.',
        'On its own it suits fans of sweet fruit, and in mixes it brings a tropical character.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 9 }
    ],
    profile: { sweetness: 8, freshness: 4, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffb52e', secondary: '#ffd68c', accent: '#bf8823', background: '#2d1f0b', text: '#fffaf0' },
    mixIdeas: {
      bs: [
        'Mango i Mint, 70/30, za svjež tropski kotlić.',
        'Mango i Pineapple, za tropski koktel.',
        'Mango i Lemon, ako želiš malo kiseline.'
      ],
      en: [
        'Mango with Mint, 70/30, for a fresh tropical bowl.',
        'Mango with Pineapple for a tropical cocktail.',
        'Mango with Lemon if you want a little acidity.'
      ]
    },
    similar: ['adalya-english-lord', 'adalya-mango-tango-ice', 'adalya-hawaii']
  },
  {
    id: 'al-fakher-banana',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Banana',
    shortDescription: {
      bs: 'Slatka banana, glatka i kremasta.',
      en: 'Sweet banana, smooth and creamy.'
    },
    description: {
      bs: [
        'Banana je mekan, sladak okus sa glatkim, kremastim završetkom.',
        'Nije kiseo ni oštar, pa je ugodan i za duže sesije i za one koji tek počinju.',
        'Najbolje se pokazuje u miksevima, gdje drugim okusima daje punoću.'
      ],
      en: [
        'Banana is a soft, sweet flavor with a smooth, creamy finish.',
        'It is neither sour nor sharp, so it is pleasant for longer sessions and for beginners.',
        'It shines most in mixes, where it gives other flavors more body.'
      ]
    },
    ingredients: [
      { name: { bs: 'Banana', en: 'Banana' }, illustration: 'banana', color: '#fbe48c', intensity: 9 }
    ],
    profile: { sweetness: 8, freshness: 3, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#fbe48c', secondary: '#fdf0c0', accent: '#bcab69', background: '#2d2618', text: '#fffdf7' },
    mixIdeas: {
      bs: [
        'Banana i Strawberry, za klasični milkshake okus.',
        'Banana i Coconut, za tropski desert.',
        'Banana i Mint, 70/30, ako ti je sama banana preteška.'
      ],
      en: [
        'Banana with Strawberry for a classic milkshake flavor.',
        'Banana with Coconut for a tropical dessert.',
        'Banana with Mint, 70/30, if banana alone feels too heavy.'
      ]
    },
    similar: ['haze-bananarama', 'musthave-banana-mama', 'darkside-bananapapa']
  },
  {
    id: 'al-fakher-lemon',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Lemon',
    shortDescription: {
      bs: 'Slatki limun sa blagom kiselinom u pozadini.',
      en: 'Sweet lemon with a light tartness behind it.'
    },
    description: {
      bs: [
        'Lemon je više sladak nego kiseo: naprijed je slatkoća limuna, a kiselina se javlja tek blago u pozadini.',
        'Bez mente je, pa je to čist citrus, a ne ledeni okus kao Lemon Mint.',
        'Odličan je za mikseve, jer gotovo svakom voću doda svježinu.'
      ],
      en: [
        'Lemon is more sweet than sour: lemon sweetness comes first and the tartness only shows lightly in the background.',
        'It has no mint, so it is a clean citrus, not an icy flavor like Lemon Mint.',
        'Great for mixes, since it adds freshness to almost any fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 8, fruitiness: 7, cooling: 0, strength: 5 },
    tags: ['vocni', 'citrusni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f7e04b', secondary: '#fbee9c', accent: '#b9a838', background: '#2c250f', text: '#fefdf2' },
    mixIdeas: {
      bs: [
        'Lemon i Mint, 60/40, za domaću limunadu sa mentom.',
        'Lemon i Watermelon, za ljetni kotlić.',
        'Lemon i Blueberry, za limunadu od borovnice.'
      ],
      en: [
        'Lemon with Mint, 60/40, for homemade mint lemonade.',
        'Lemon with Watermelon for a summer bowl.',
        'Lemon with Blueberry for a blueberry lemonade.'
      ]
    },
    similar: ['adalya-lemon-cocktail', 'starbuzz-pirates-cave', 'musthave-lemon-tonic']
  },
  {
    id: 'al-fakher-melon',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Melon',
    shortDescription: {
      bs: 'Zrela medena dinja, slatka i sočna.',
      en: 'Ripe honeydew melon, sweet and juicy.'
    },
    description: {
      bs: [
        'Melon je zrela medena dinja: slatka, sočna i mekana, sa blagom notom koja je čini punijom od lubenice.',
        'Bez mente je, pa je okus čist i voćni.',
        'Lijepo se slaže sa lubenicom, mentom i citrusima.'
      ],
      en: [
        'Melon is ripe honeydew: sweet, juicy and soft, with a light note that makes it fuller than watermelon.',
        'It has no mint, so the flavor is clean and fruity.',
        'It pairs nicely with watermelon, mint and citrus.'
      ]
    },
    ingredients: [
      { name: { bs: 'Medena dinja', en: 'Honeydew melon' }, illustration: 'dinja', color: '#cfe79c', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['vocni', 'ljetni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#cfe79c', secondary: '#e5f2c9', accent: '#9bad75', background: '#26261a', text: '#fcfdf8' },
    mixIdeas: {
      bs: [
        'Melon i Watermelon, za duplu dinju.',
        'Melon i Mint, 70/30, za svjež ljetni kotlić.',
        'Melon i Magic Love, za voćniji, tropski mix.'
      ],
      en: [
        'Melon with Watermelon for a double melon.',
        'Melon with Mint, 70/30, for a fresh summer bowl.',
        'Melon with Magic Love for a fruitier, tropical mix.'
      ]
    },
    similar: ['fumari-ambrosia', 'starbuzz-safari-melon-dew', 'adalya-double-melon']
  },
  {
    id: 'al-fakher-guava',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Guava',
    shortDescription: {
      bs: 'Slatka, nježna guava sa blagom kiselkastom notom.',
      en: 'Sweet, delicate guava with a light sour twist.'
    },
    description: {
      bs: [
        'Guava je tropsko voće koje se rijetko nađe samo: slatko i nježno, sa blagom kiselkastom notom na kraju.',
        'Okus je mekan i mirisan, pa je dobar izbor kad želiš nešto drugačije od klasične jabuke ili grožđa.',
        'Dobro se slaže sa citrusima i mentom.'
      ],
      en: [
        'Guava is a tropical fruit you rarely find on its own: sweet and delicate, with a light sour twist at the end.',
        'The flavor is soft and fragrant, so it is a good pick when you want something different from classic apple or grape.',
        'It goes well with citrus and mint.'
      ]
    },
    ingredients: [
      { name: { bs: 'Guava', en: 'Guava' }, illustration: 'guava', color: '#f08a9a', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f08a9a', secondary: '#f7bfc7', accent: '#b46874', background: '#2b191a', text: '#fef7f8' },
    mixIdeas: {
      bs: [
        'Guava i Mint, 70/30, za svjež tropski okus.',
        'Guava i Orange, za tropski sok.',
        'Guava i Plum, za slatko-kiseli mix.'
      ],
      en: [
        'Guava with Mint, 70/30, for a fresh tropical flavor.',
        'Guava with Orange for a tropical juice.',
        'Guava with Plum for a sweet and sour mix.'
      ]
    },
    similar: ['musthave-alova', 'trifecta-pineapple-guava', '187-i-love-hamburg']
  },
  {
    id: 'al-fakher-pineapple',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Pineapple',
    shortDescription: {
      bs: 'Tropski ananas, sladak i kiselkast u isto vrijeme.',
      en: 'Tropical pineapple, sweet and tart at the same time.'
    },
    description: {
      bs: [
        'Pineapple je ananas kakav i treba biti: sladak, ali sa onom živom kiselinom koja ga čini svježim.',
        'Bez mente je, pa se tropsko voće osjeti čisto, od prvog do zadnjeg dima.',
        'Odličan je u tropskim miksevima sa mangom, kokosom ili bananom.'
      ],
      en: [
        'Pineapple is pineapple the way it should be: sweet, but with that lively tartness that keeps it fresh.',
        'It has no mint, so the tropical fruit comes through cleanly from the first puff to the last.',
        'Great in tropical mixes with mango, coconut or banana.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f8cf4a', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f8cf4a', secondary: '#fbe59b', accent: '#ba9b38', background: '#2c230f', text: '#fffcf2' },
    mixIdeas: {
      bs: [
        'Pineapple i Coconut, za piña coladu.',
        'Pineapple i Mango, za tropski koktel.',
        'Pineapple i Mint, 70/30, za svjež ljetni kotlić.'
      ],
      en: [
        'Pineapple with Coconut for a piña colada.',
        'Pineapple with Mango for a tropical cocktail.',
        'Pineapple with Mint, 70/30, for a fresh summer bowl.'
      ]
    },
    similar: ['adalya-sheik-money', 'trifecta-pineapple-guava', 'musthave-pineapple-rings', 'element-maui']
  },
  {
    id: 'al-fakher-cherry',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Cherry',
    shortDescription: {
      bs: 'Puna, zaobljena višnja, slatka i glatka.',
      en: 'Rich, rounded cherry, sweet and smooth.'
    },
    description: {
      bs: [
        'Cherry je puna, zaobljena višnja: slatka, glatka i bez oštre kiseline.',
        'Za razliku od Cherry Minta, nema mente, pa je okus topliji i bliži slatkom voću.',
        'Dobar je sam, a u miksevima daje tamnu, voćnu dubinu.'
      ],
      en: [
        'Cherry is a rich, rounded cherry: sweet, smooth and without a sharp sourness.',
        'Unlike Cherry Mint, there is no mint, so the flavor is warmer and closer to sweet fruit.',
        'Good on its own, and in mixes it adds a dark, fruity depth.'
      ]
    },
    ingredients: [
      { name: { bs: 'Višnja', en: 'Cherry' }, illustration: 'visnja', color: '#a3122a', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 4, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['vocni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#a3122a', secondary: '#cc7d8a', accent: '#7a0e20', background: '#20090a', text: '#f9eef0' },
    mixIdeas: {
      bs: [
        'Cherry i Mint, 70/30, za svježiju višnju.',
        'Cherry i Vanilla, za višnju sa kremom.',
        'Cherry i Lemon, za kiselkastu višnju.'
      ],
      en: [
        'Cherry with Mint, 70/30, for a fresher cherry.',
        'Cherry with Vanilla for cherries and cream.',
        'Cherry with Lemon for a tangier cherry.'
      ]
    },
    similar: ['fumari-red-gummi-bear', 'tangiers-maraschino-cherry', 'musthave-cherry-juice', 'holster-lamoretto']
  },
  {
    id: 'al-fakher-coconut',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Coconut',
    shortDescription: {
      bs: 'Kremasti kokos, mekan i blago slatkast.',
      en: 'Creamy coconut, soft and lightly sweet.'
    },
    description: {
      bs: [
        'Coconut je kremast, mekan kokos, više desertan nego voćni.',
        'Slatkoća je umjerena, pa ne zasiti brzo, a dim je gladak.',
        'Najviše se koristi u miksevima, gdje drugim okusima daje kremastu, tropsku notu.'
      ],
      en: [
        'Coconut is a creamy, soft coconut, more dessert than fruit.',
        'The sweetness is moderate, so it does not get cloying fast, and the smoke is smooth.',
        'It is used most in mixes, where it gives other flavors a creamy, tropical note.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kokos', en: 'Coconut' }, illustration: 'kokos', color: '#f7f4ec', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 3, fruitiness: 5, cooling: 0, strength: 5 },
    tags: ['tropski', 'slatki', 'desertni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f7f4ec', secondary: '#fbf9f5', accent: '#b9b7b1', background: '#2c2825', text: '#fefefe' },
    mixIdeas: {
      bs: [
        'Coconut i Pineapple, za piña coladu.',
        'Coconut i Banana, za tropski desert.',
        'Coconut i Mango, za kremasti tropski kotlić.'
      ],
      en: [
        'Coconut with Pineapple for a piña colada.',
        'Coconut with Banana for a tropical dessert.',
        'Coconut with Mango for a creamy tropical bowl.'
      ]
    },
    similar: ['musthave-coconut-shake', 'musthave-paradise', 'haze-bananarama']
  },
  {
    id: 'al-fakher-plum',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Plum',
    shortDescription: {
      bs: 'Šljiva sa ravnotežom slatkog i kiselog.',
      en: 'Plum with a balance of sweet and sour.'
    },
    description: {
      bs: [
        'Plum je šljiva koja balansira između slatkog i kiselog, sa tamnom, zrelom notom.',
        'Umjereno je slatka, pa je dobra za one kojima su desertni okusi previše.',
        'Lijepo se slaže sa narandžom i guavom.'
      ],
      en: [
        'Plum is a plum that balances between sweet and sour, with a dark, ripe note.',
        'It is moderately sweet, so it suits people who find dessert flavors too much.',
        'It goes nicely with orange and guava.'
      ]
    },
    ingredients: [
      { name: { bs: 'Šljiva', en: 'Plum' }, illustration: 'sljiva', color: '#5b2a6e', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 4, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['vocni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#5b2a6e', secondary: '#a58aaf', accent: '#442053', background: '#160c14', text: '#f4f0f5' },
    mixIdeas: {
      bs: [
        'Plum i Orange, za voćni zimski kotlić.',
        'Plum i Guava, za slatko-kiseli tropski mix.',
        'Plum i Mint, 70/30, za svježiju šljivu.'
      ],
      en: [
        'Plum with Orange for a fruity winter bowl.',
        'Plum with Guava for a sweet and sour tropical mix.',
        'Plum with Mint, 70/30, for a fresher plum.'
      ]
    },
    similar: ['musthave-passion-plum', '187-wild-beast', 'al-fakher-cherry']
  },
  {
    id: 'al-fakher-magic-love',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Magic Love',
    shortDescription: {
      bs: 'Marakuja i slatka dinja sa svježim, hladnim završetkom.',
      en: 'Passion fruit and sweet melon with a cool, fresh finish.'
    },
    description: {
      bs: [
        'Magic Love spaja tropsku marakuju i slatku dinju u voćni, mirisni okus.',
        'Na izdahu se osjeti svježina koja ga hladi, ali ne preuzima glavnu ulogu.',
        'Ko voli Adalya Love 66, ovdje će prepoznati sličan stil, samo blaži i bez jakog leda.'
      ],
      en: [
        'Magic Love combines tropical passion fruit and sweet melon into a fruity, fragrant flavor.',
        'On the exhale there is a freshness that cools it down without taking over.',
        'If you like Adalya Love 66, you will recognize a similar style here, just milder and without strong ice.'
      ]
    },
    ingredients: [
      { name: { bs: 'Marakuja', en: 'Passion fruit' }, illustration: 'marakuja', color: '#f2a03a', intensity: 8 },
      { name: { bs: 'Dinja', en: 'Melon' }, illustration: 'dinja', color: '#cfe79c', intensity: 7 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 3 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 3, strength: 5 },
    tags: ['vocni', 'tropski', 'mint', 'ljetni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f2a03a', secondary: '#cfe79c', accent: '#2fae78', background: '#2b1c0c', text: '#fef8f1' },
    mixIdeas: {
      bs: [
        'Magic Love i Watermelon, za ljetni tropski kotlić.',
        'Magic Love i Mint, 70/30, ako želiš više hlađenja.',
        'Magic Love i Lemon, za kiselkastiji završetak.'
      ],
      en: [
        'Magic Love with Watermelon for a summery tropical bowl.',
        'Magic Love with Mint, 70/30, if you want more chill.',
        'Magic Love with Lemon for a tangier finish.'
      ]
    },
    similar: ['adalya-love-66', '187-i-love-hamburg', 'true-passion-cinderella']
  },
  {
    id: 'al-fakher-vanilla',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Vanilla',
    shortDescription: {
      bs: 'Mekana, slatka vanila kremastog, desertnog karaktera.',
      en: 'Soft, sweet vanilla with a creamy, dessert-like feel.'
    },
    description: {
      bs: [
        'Vanilla je mekana i slatka, sa kremastim karakterom koji podsjeća na desert.',
        'Sama je prilično nježna, pa se najčešće koristi da zaobli i omekša druge okuse.',
        'U miksevima sa voćem daje utisak voća sa kremom.'
      ],
      en: [
        'Vanilla is soft and sweet, with a creamy character that recalls a dessert.',
        'On its own it is quite gentle, so it is mostly used to round off and soften other flavors.',
        'In mixes with fruit it gives the feel of fruit with cream.'
      ]
    },
    ingredients: [
      { name: { bs: 'Vanila', en: 'Vanilla' }, illustration: 'vanila', color: '#f3e2b3', intensity: 9 }
    ],
    profile: { sweetness: 8, freshness: 2, fruitiness: 1, cooling: 0, strength: 5 },
    tags: ['desertni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f3e2b3', secondary: '#f8efd5', accent: '#b6aa86', background: '#2b261d', text: '#fefdfa' },
    mixIdeas: {
      bs: [
        'Vanilla i Strawberry, za jagode sa šlagom.',
        'Vanilla i Cherry, za višnju sa kremom.',
        'Vanilla i Banana, za puding od banane.'
      ],
      en: [
        'Vanilla with Strawberry for strawberries and cream.',
        'Vanilla with Cherry for cherry and cream.',
        'Vanilla with Banana for a banana pudding.'
      ]
    },
    similar: ['musthave-vanilla-cream', 'fumari-spiced-chai', 'trifecta-peppermint-shake']
  },
  {
    id: 'al-fakher-orange',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Orange',
    shortDescription: {
      bs: 'Sočna, slatka narandža, svježa i voćna.',
      en: 'Juicy, sweet orange, fresh and fruity.'
    },
    description: {
      bs: [
        'Orange je sočna, slatka narandža, više kao svježe cijeđeni sok nego kao kora.',
        'Nema mente, pa se citrus osjeti čisto, a svježina dolazi od samog voća.',
        'Dobro se slaže sa mentom, šljivom i tropskim voćem.'
      ],
      en: [
        'Orange is a juicy, sweet orange, more like fresh-squeezed juice than peel.',
        'There is no mint, so the citrus comes through cleanly and the freshness comes from the fruit itself.',
        'It pairs well with mint, plum and tropical fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['vocni', 'citrusni', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff9a2e', secondary: '#ffc78c', accent: '#bf7423', background: '#2d1c0b', text: '#fff8f0' },
    mixIdeas: {
      bs: [
        'Orange i Mint, 70/30, za svjež sok od narandže.',
        'Orange i Guava, za tropski sok.',
        'Orange i Vanilla, za kremu od narandže.'
      ],
      en: [
        'Orange with Mint, 70/30, for a fresh orange juice.',
        'Orange with Guava for a tropical juice.',
        'Orange with Vanilla for an orange cream.'
      ]
    },
    similar: ['starbuzz-sex-on-the-beach', 'adalya-orange-mint', '187-beach-vibez']
  },
  {
    id: 'al-fakher-blueberry-mint',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Blueberry Mint',
    shortDescription: {
      bs: 'Slatka borovnica sa svježom mentom.',
      en: 'Sweet blueberry with fresh mint.'
    },
    description: {
      bs: [
        'Blueberry Mint je Al Fakherova borovnica sa dodatkom mente: slatko bobičasto voće naprijed, a menta na izdahu.',
        'Menta je umjerena, pa okus osvježava bez jakog leda.',
        'Ko voli Blueberry, a želi nešto svježije za ljeto, ovo je logičan izbor.'
      ],
      en: [
        'Blueberry Mint is Al Fakher\'s blueberry with added mint: sweet berry up front and mint on the exhale.',
        'The mint is moderate, so it refreshes without heavy ice.',
        'If you like Blueberry but want something fresher for summer, this is the obvious pick.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4a5fc1', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 8, cooling: 5, strength: 5 },
    tags: ['vocni', 'bobicasti', 'mint', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#4a5fc1', secondary: '#2fae78', accent: '#6dc6a1', background: '#14131f', text: '#f2f4fb' },
    mixIdeas: {
      bs: [
        'Blueberry Mint i Lemon, za limunadu od borovnice.',
        'Blueberry Mint i Grape, za tamno voće sa mentom.',
        'Blueberry Mint i Watermelon, za ljetni mix.'
      ],
      en: [
        'Blueberry Mint with Lemon for a blueberry lemonade.',
        'Blueberry Mint with Grape for dark fruit with mint.',
        'Blueberry Mint with Watermelon for a summer mix.'
      ]
    },
    similar: ['adalya-blueberry-mint', 'adalya-berrymix', 'serbetli-ice-blueberry']
  },
  {
    id: 'al-fakher-gum-cinnamon',
    brand: 'al-fakher',
    leaf: 'light',
    name: 'Gum Cinnamon',
    shortDescription: {
      bs: 'Žvakaća guma sa slatko-ljutkastim cimetom i daškom svježine.',
      en: 'Chewing gum with sweet, spicy cinnamon and a touch of freshness.'
    },
    description: {
      bs: [
        'Gum Cinnamon spaja slatku žvakaću gumu i cimet, koji daje toplu, ljutkastu notu.',
        'U pozadini je i malo svježine, pa okus nije težak kao klasični začinski okusi.',
        'Nije za svakoga, ali ko voli cimet žvake, ovdje će ga lako prepoznati.'
      ],
      en: [
        'Gum Cinnamon combines sweet chewing gum with cinnamon, which adds a warm, spicy note.',
        'There is also a little freshness in the background, so the flavor is not as heavy as classic spice flavors.',
        'Not for everyone, but if you like cinnamon gum, you will recognize it right away.'
      ]
    },
    ingredients: [
      { name: { bs: 'Žvakaća guma', en: 'Chewing gum' }, illustration: 'zvaka', color: '#ff8fc0', intensity: 7 },
      { name: { bs: 'Cimet', en: 'Cinnamon' }, illustration: 'cimet', color: '#a0522d', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 1, cooling: 3, strength: 5 },
    tags: ['bombon', 'zacinski', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff8fc0', secondary: '#a0522d', accent: '#bd866c', background: '#2d1a1f', text: '#fff7fb' },
    mixIdeas: {
      bs: [
        'Gum Cinnamon i Double Apple, za jabuku sa cimetom.',
        'Gum Cinnamon i Mint, 70/30, za svježiju žvaku.',
        'Gum Cinnamon i Orange, za zimski začinski kotlić.'
      ],
      en: [
        'Gum Cinnamon with Double Apple for apple and cinnamon.',
        'Gum Cinnamon with Mint, 70/30, for a fresher gum.',
        'Gum Cinnamon with Orange for a spiced winter bowl.'
      ]
    },
    similar: ['mazaya-gum-mint', 'al-fakher-gum-mint', 'haze-double-bubble']
  },
  {
    id: 'starbuzz-blue-mist',
    brand: 'starbuzz',
    leaf: 'light',
    name: 'Blue Mist',
    mood: 'mist',
    shortDescription: {
      bs: 'Slatka borovnica sa nježnim hlađenjem, kao čaša hladne vode, i daškom šećerne vune.',
      en: 'Sweet blueberry with a soft chill like a glass of cold water and a wisp of cotton candy.'
    },
    description: {
      bs: [
        'Blue Mist je slatka, sočna borovnica sa blagim hlađenjem. Hladnoća ne grize kao oštra menta, nego više podsjeća na gutljaj hladne vode.',
        'U pozadini se osjeti mekana, šećerna nota koja podsjeća na šećernu vunu, pa je okus zaobljen i prijatan.',
        'Za razliku od Adalya Blue Icea, ovdje je led tek izmaglica: voće i slatkoća su u prvom planu, a hlađenje samo osvježi izdah.'
      ],
      en: [
        'Blue Mist is sweet, juicy blueberry with a gentle chill. The cold does not bite like sharp mint; it feels more like a sip of cold water.',
        'In the background there is a soft, sugary note that recalls cotton candy, so the flavor feels round and easygoing.',
        'Unlike Adalya Blue Ice, the ice here is just a haze: fruit and sweetness lead, and the chill only freshens up the exhale.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#5a72e6', intensity: 8 },
      { name: { bs: 'Hlađenje', en: 'Cooling' }, illustration: 'kristal', color: '#dbeeff', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 7, fruitiness: 7, cooling: 5, strength: 5 },
    tags: ['vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#4f6fe0', secondary: '#b8c6ff', accent: '#3d55c4', background: '#dfe6ff', text: '#141b4a', water: '#a9bfff', smoke: ['#ffffff', '#eef2ff', '#dde6ff'] },
    mixIdeas: {
      bs: [
        'Blue Mist i Raspberry, za slatke bobice sa blagim hlađenjem.',
        'Blue Mist i Peppermint Shake, za kremast, desertni plavi miks.',
        'Blue Mist sa malo Blue Icea, kad želiš više leda.'
      ],
      en: [
        'Blue Mist with Raspberry for sweet berries with a soft chill.',
        'Blue Mist with Peppermint Shake for a creamy, dessert-style blue mix.',
        'Blue Mist with a little Blue Ice when you want more ice.'
      ]
    },
    similar: ['adalya-blue-ice', 'adalya-raspberry', 'trifecta-peppermint-shake']
  },
  {
    id: 'starbuzz-pirates-cave',
    brand: 'starbuzz',
    leaf: 'light',
    name: "Pirate's Cave",
    shortDescription: {
      bs: 'Limun i limeta sa daškom narandže i lagane mente: sočan, kiselkast citrus.',
      en: 'Lemon and lime with a hint of orange and a light touch of mint: juicy, tangy citrus.'
    },
    description: {
      bs: [
        "Pirate's Cave je jedan od najpoznatijih Starbuzz okusa, odmah iza Blue Mista. U prvom planu su limun i limeta, svježi i blago kiseli, kao domaća limunada.",
        'Ispod njih se osjeti malo narandže koja zaobli kiselinu i lagana menta koja osvježi izdah, bez jakog hlađenja.',
        'Dobar izbor za ljeto i za one koji vole citruse, ali ne žele previše leda.'
      ],
      en: [
        "Pirate's Cave is one of Starbuzz's best-known flavors, right after Blue Mist. Lemon and lime lead the way, fresh and slightly sour, like homemade lemonade.",
        'Underneath there is a little orange that rounds off the tartness and a light mint that freshens the exhale without heavy cooling.',
        'A good pick for summer and for anyone who loves citrus but does not want too much ice.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f5d63d', intensity: 8 },
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#8fd14f', intensity: 7 },
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 4 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#3fbf86', intensity: 3 }
    ],
    profile: { sweetness: 5, freshness: 9, fruitiness: 7, cooling: 3, strength: 5 },
    tags: ['citrusni', 'vocni', 'osvjezavajuci', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#c6e04a', secondary: '#f5e06a', accent: '#2f8f3e', background: '#e9f4c2', text: '#1f2a06', water: '#d9f08a' },
    mixIdeas: {
      bs: [
        "Pirate's Cave i Blue Mist, pola-pola, za plavu limunadu.",
        "Pirate's Cave i Purple Krush, 70/30, za ljubičastu limunadu od grožđa.",
        "Pirate's Cave i Cucumberita, za vrlo svjež, ljetni miks."
      ],
      en: [
        "Pirate's Cave with Blue Mist, half and half, for a blue lemonade.",
        "Pirate's Cave with Purple Krush, 70/30, for a purple grape lemonade.",
        "Pirate's Cave with Cucumberita for a very fresh summer mix."
      ]
    },
    similar: ['haze-cucumberita', 'fumari-white-gummi-bear', 'haze-purple-krush', 'al-fakher-lemon']
  },
  {
    id: 'starbuzz-code-69',
    brand: 'starbuzz',
    leaf: 'light',
    name: 'Code 69',
    shortDescription: {
      bs: 'Voćni punč sa tropskim voćem i citrusima: sladak, sočan i šaren.',
      en: 'A fruit punch of tropical fruit and citrus: sweet, juicy and colorful.'
    },
    description: {
      bs: [
        'Code 69 je Starbuzz voćni punč. Nema jednog glavnog voća: tropska slatkoća i citrusi se miješaju u sočan, šaren okus koji podsjeća na čašu punča na zabavi.',
        'Citrusi daju svježinu i drže slatkoću pod kontrolom, pa okus ne postaje težak ni kad glava dugo traje.',
        'Bez mentola, topao i voćni. Dobar za društvo i za one koji vole "sve voće odjednom".'
      ],
      en: [
        'Code 69 is the Starbuzz fruit punch. There is no single lead fruit: tropical sweetness and citrus blend into a juicy, colorful flavor that recalls a glass of party punch.',
        'The citrus brings freshness and keeps the sweetness in check, so it never gets heavy, even in a long bowl.',
        'No menthol, warm and fruity. Good for a group and for anyone who likes "all the fruit at once".'
      ]
    },
    ingredients: [
      { name: { bs: 'Voćni punč', en: 'Fruit punch' }, illustration: 'bomboni', color: '#e8457a', intensity: 8 },
      { name: { bs: 'Tropsko voće', en: 'Tropical fruit' }, illustration: 'marakuja', color: '#f2a03a', intensity: 7 },
      { name: { bs: 'Citrusi', en: 'Citrus' }, illustration: 'narandza', color: '#ff9a2e', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'citrusni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8457a', secondary: '#ffb547', accent: '#3fc1c9', background: '#2a0f1f', text: '#fff0f6' },
    mixIdeas: {
      bs: [
        'Code 69 i Blue Mist, za plavi voćni punč.',
        'Code 69 i Pirate\'s Cave, za punč sa bananom i limetom.',
        'Code 69 i Mint, 80/20, za osvježen punč.'
      ],
      en: [
        'Code 69 with Blue Mist for a blue fruit punch.',
        'Code 69 with Pirate\'s Cave for punch with banana and lime.',
        'Code 69 with Mint, 80/20, for a refreshed punch.'
      ]
    },
    similar: ['starbuzz-sex-on-the-beach', 'true-passion-cinderella', '187-i-love-hamburg', 'adalya-love-66']
  },
  {
    id: 'starbuzz-sex-on-the-beach',
    brand: 'starbuzz',
    leaf: 'light',
    name: 'Sex on the Beach',
    shortDescription: {
      bs: 'Okus inspirisan koktelom: slatka narandža i limun, sunčan i lagan.',
      en: 'A cocktail-inspired flavor: sweet orange and lemon, sunny and light.'
    },
    description: {
      bs: [
        'Sex on the Beach je dobio ime po poznatom ljetnom koktelu. U glavi su slatka, sočna narandža i kiselkast limun, spojeni u okus koji podsjeća na voćni koktel na plaži.',
        'Narandža vodi, a limun dodaje svježinu i malo oštrine na kraju. Nema mentola, pa je okus topao i sunčan.',
        'Lagan i voćni, dobar za ljeto i za mikseve sa tropskim voćem.'
      ],
      en: [
        'Sex on the Beach is named after the well known summer cocktail. The bowl holds sweet, juicy orange and tangy lemon, blended into something like a fruity beach cocktail.',
        'Orange leads and lemon adds freshness and a little edge at the end. There is no menthol, so it feels warm and sunny.',
        'Light and fruity, great for summer and for mixes with tropical fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 8 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['citrusni', 'vocni', 'pice', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff8a3d', secondary: '#ffd36b', accent: '#e8457a', background: '#2b1408', text: '#fff3e6' },
    mixIdeas: {
      bs: [
        'Sex on the Beach i Code 69, za veliki voćni punč.',
        'Sex on the Beach i Hawaii, za tropski koktel.',
        'Sex on the Beach i Blue Mist, 70/30, za koktel sa borovnicom.'
      ],
      en: [
        'Sex on the Beach with Code 69 for a big fruit punch.',
        'Sex on the Beach with Hawaii for a tropical cocktail.',
        'Sex on the Beach with Blue Mist, 70/30, for a cocktail with blueberry.'
      ]
    },
    similar: ['starbuzz-code-69', 'tangiers-orange-soda', '187-beach-vibez', 'al-fakher-orange']
  },
  {
    id: 'starbuzz-safari-melon-dew',
    brand: 'starbuzz',
    leaf: 'light',
    name: 'Safari Melon Dew',
    shortDescription: {
      bs: 'Dvije dinje, medena i narandžasta: sočne, slatke i mekane.',
      en: 'Two melons, honeydew and cantaloupe: juicy, sweet and soft.'
    },
    description: {
      bs: [
        'Safari Melon Dew spaja dvije dinje: zelenkastu medenu dinju i narandžastu kantalupu. Prva daje svježinu, druga gustu, skoro mošusnu slatkoću.',
        'Okus je mekan i zreo, bez kiselosti i bez hlađenja, pa je ugodan od prve do zadnje dimne.',
        'Jedan od Starbuzz okusa koje ljudi često preporučuju kao lagan i siguran izbor.'
      ],
      en: [
        'Safari Melon Dew combines two melons: greenish honeydew and orange cantaloupe. The first brings freshness, the second a thick, almost musky sweetness.',
        'It is soft and ripe with no tartness and no cooling, so it stays pleasant from the first pull to the last.',
        'One of the Starbuzz flavors people often recommend as a light, safe pick.'
      ]
    },
    ingredients: [
      { name: { bs: 'Medena dinja', en: 'Honeydew' }, illustration: 'dinja', color: '#d9ec9f', intensity: 8 },
      { name: { bs: 'Kantalupa', en: 'Cantaloupe' }, illustration: 'dinja', color: '#f6a65a', intensity: 7 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'slatki', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#b9dd7a', secondary: '#f6a65a', accent: '#3a9a5a', background: '#f3f9e3', text: '#1c2a0c' },
    mixIdeas: {
      bs: [
        'Safari Melon Dew i Blue Mist, za plavu dinju.',
        'Safari Melon Dew i Mint, 70/30, za dinju sa mentom.',
        'Safari Melon Dew i Pirate\'s Cave, za tropsku dinju.'
      ],
      en: [
        'Safari Melon Dew with Blue Mist for a blue melon.',
        'Safari Melon Dew with Mint, 70/30, for melon and mint.',
        'Safari Melon Dew with Pirate\'s Cave for a tropical melon.'
      ]
    },
    similar: ['adalya-double-melon', 'adalya-blue-melon', 'fumari-ambrosia', 'al-fakher-melon']
  },
  {
    id: 'starbuzz-pink',
    brand: 'starbuzz',
    leaf: 'light',
    name: 'Pink',
    shortDescription: {
      bs: 'Roze limunada sa malinom: kiselkasta, slatka i osvježavajuća.',
      en: 'Pink lemonade with raspberry: tangy, sweet and refreshing.'
    },
    description: {
      bs: [
        'Pink je Starbuzz roze limunada. Malina daje slatku, crvenu voćnost, a limunada kiselkast, svjež karakter koji podsjeća na hladno piće sa ledom.',
        'Okus je živ i lagan. Kiselost je jasna, ali ne oštra, a slatkoća je tu taman koliko treba.',
        'Dobar izbor za ljeto, samostalno ili kao svježa nota u voćnim miksevima.'
      ],
      en: [
        'Pink is the Starbuzz pink lemonade. Raspberry brings sweet, red fruitiness and the lemonade a tangy, fresh character that recalls a cold drink over ice.',
        'It is lively and light. The tartness is clear but not sharp, and the sweetness is just right.',
        'A good summer pick, on its own or as the fresh note in fruit mixes.'
      ]
    },
    ingredients: [
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#e0336b', intensity: 8 },
      { name: { bs: 'Limunada', en: 'Lemonade' }, illustration: 'limun', color: '#f7e04b', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['vocni', 'bobicasti', 'citrusni', 'pice'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff6fa3', secondary: '#ffd0e0', accent: '#f2c230', background: '#ffeef4', text: '#3a0a1c' },
    mixIdeas: {
      bs: [
        'Pink i Blue Mist, za plavo-roze limunadu.',
        'Pink i Mint, 70/30, za limunadu sa mentom.',
        'Pink i Safari Melon Dew, za ljetnu limunadu od dinje.'
      ],
      en: [
        'Pink with Blue Mist for a blue and pink lemonade.',
        'Pink with Mint, 70/30, for lemonade with mint.',
        'Pink with Safari Melon Dew for a summer melon lemonade.'
      ]
    },
    similar: ['adalya-raspberry', 'darkside-generis-raspberry', 'musthave-pinkman']
  },
  {
    id: 'tangiers-cane-mint',
    brand: 'tangiers',
    leaf: 'dark',
    name: 'Cane Mint',
    mood: 'frost',
    shortDescription: {
      bs: 'Vrlo jak, hladan pepermint sa blagom slatkoćom, na tamnom listu. Nije za početnike.',
      en: 'A very strong, cold peppermint with a light sweetness, on dark leaf. Not for beginners.'
    },
    description: {
      bs: [
        'Cane Mint je čist pepermint, ali u jakoj verziji. Hladi snažno i dugo, a blaga slatkoća ga drži prijatnim, slično pepermint bombonu.',
        'Duhan je tamni list, sa više nikotina i jačim udarom od tipičnog svijetlog lista. Zato ovo nije okus za početnike: ako tek počinješ, kreni sa blažim okusima.',
        'Iskusni pušači ga vole samog ili kao jaku, hladnu osnovu za mikseve sa voćem.'
      ],
      en: [
        'Cane Mint is pure peppermint in a strong form. It cools hard and long, and a light sweetness keeps it pleasant, a bit like a peppermint candy.',
        'The tobacco is dark leaf, with more nicotine and a bigger hit than typical blonde leaf. That is why this is not a flavor for beginners: if you are just starting out, begin with something milder.',
        'Experienced smokers enjoy it on its own or as a strong, cold base for fruit mixes.'
      ]
    },
    ingredients: [
      { name: { bs: 'Pepermint', en: 'Peppermint' }, illustration: 'pepermint', color: '#1f9d6b', intensity: 10 }
    ],
    profile: { sweetness: 3, freshness: 10, fruitiness: 0, cooling: 9, strength: 9 },
    tags: ['mint', 'ledeni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#1f9d6b', secondary: '#e8f7f0', accent: '#8ff0c8', background: '#0b2a1f', text: '#effaf5', water: '#7fe3bd', smoke: ['#ffffff', '#e6fff4', '#c8f5e2'] },
    mixIdeas: {
      bs: [
        'Cane Mint sa White Gummi Bearom, za slatke bombone sa jakim hlađenjem.',
        'Malo Cane Minta uz Double Apple, za klasičnu jabuku sa mentom, ali jaču.',
        'Cane Mint i Peppermint Shake, za desertni mint sa više snage.'
      ],
      en: [
        'Cane Mint with White Gummi Bear for sweet candy with a strong chill.',
        'A little Cane Mint with Double Apple for classic apple and mint, only stronger.',
        'Cane Mint with Peppermint Shake for a dessert mint with more punch.'
      ]
    },
    similar: ['trifecta-twice-the-ice', 'trifecta-durty-mint', 'al-fakher-mint', 'haze-mint-supreme']
  },
  {
    id: 'tangiers-kashmir-peach',
    brand: 'tangiers',
    leaf: 'dark',
    name: 'Kashmir Peach',
    mood: 'honey',
    shortDescription: {
      bs: 'Zrela breskva umotana u tople kašmir začine i kardamom: složen, topao i elegantan okus.',
      en: 'Ripe peach wrapped in warm Kashmir spice and cardamom: complex, cozy and elegant.'
    },
    description: {
      bs: [
        'Kashmir Peach je jedan od najprodavanijih Tangiers okusa. Osnova je sočna, zrela breskva, slatka i blago cvjetna.',
        'Ono što ga izdvaja je kašmir mješavina začina: kardamom i topli, pomalo parfemski tonovi koji breskvi daju dubinu i "večernji" karakter.',
        'Kao i ostali Tangiers okusi, ovo je tamni list: jak, gust i traži malo strpljenja sa toplotom. Nije za prvu sesiju, ali je odličan kad želiš nešto drugačije od običnog voća.'
      ],
      en: [
        "Kashmir Peach is one of Tangiers' best-selling flavors. The base is a juicy, ripe peach, sweet and slightly floral.",
        'What sets it apart is the Kashmir spice blend: cardamom and warm, almost perfume-like notes that give the peach depth and an evening feel.',
        'Like the rest of Tangiers, this is dark leaf: strong, dense and in need of a little patience with heat. Not a first-session flavor, but great when you want something different from plain fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#f6a36a', intensity: 9 },
      { name: { bs: 'Kardamom', en: 'Cardamom' }, illustration: 'kardamom', color: '#8fa64a', intensity: 6 },
      { name: { bs: 'Topli začini', en: 'Warm spice' }, illustration: 'anis', color: '#9a5a2a', intensity: 5 }
    ],
    profile: { sweetness: 6, freshness: 4, fruitiness: 8, cooling: 0, strength: 9 },
    tags: ['vocni', 'zacinski', 'nocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f08a4b', secondary: '#f6c27a', accent: '#d9a441', background: '#2a1610', text: '#fbeee2', smoke: ['#fff1e4', '#f7caa0', '#e3a979'] },
    mixIdeas: {
      bs: [
        'Kashmir Peach i Ambrosia, pola-pola, za breskvu i dinju sa začinom.',
        'Kashmir Peach i Cane Mint, 80/20, za začinsku breskvu sa hladnim krajem.',
        'Kashmir Peach i Two Apples, za istočnjački, začinski voćni miks.'
      ],
      en: [
        'Kashmir Peach with Ambrosia, half and half, for spiced peach and melon.',
        'Kashmir Peach with Cane Mint, 80/20, for spiced peach with a cool finish.',
        'Kashmir Peach with Two Apples for a spiced, Middle Eastern fruit mix.'
      ]
    },
    similar: ['adalya-baku-nights', 'fumari-ambrosia', 'al-fakher-double-apple', 'tangiers-juicy-peach']
  },
  {
    id: 'tangiers-horchata',
    brand: 'tangiers',
    leaf: 'dark',
    name: 'Horchata',
    mood: 'honey',
    shortDescription: {
      bs: 'Cimet, slatko mlijeko i vanila, kao meksičko piće horchata.',
      en: 'Cinnamon, sweet milk and vanilla, like the Mexican drink horchata.'
    },
    description: {
      bs: [
        'Horchata je dobila ime po meksičkom napitku od riže, mlijeka i cimeta. Okus je kremast i topao: slatko mlijeko i vanila u osnovi, a cimet preko njih.',
        'Cimet je jasan, ali mekan, bez ljutine. Zajedno sa vanilom daje okus koji podsjeća na desert ili praznično piće.',
        'Tangiers je jak tamni list: pakuj rastresito, zagrijavaj polako i daj glavi vremena. Nije za prvu sesiju.'
      ],
      en: [
        'Horchata is named after the Mexican drink made with rice, milk and cinnamon. It is creamy and warm: sweet milk and vanilla at the base, with cinnamon on top.',
        'The cinnamon is clear but soft, with no heat. Together with the vanilla it tastes like a dessert or a holiday drink.',
        'Tangiers is strong dark leaf: pack it loose, heat it slowly and give the bowl time. Not for a first session.'
      ]
    },
    ingredients: [
      { name: { bs: 'Cimet', en: 'Cinnamon' }, illustration: 'cimet', color: '#a0522d', intensity: 8 },
      { name: { bs: 'Slatko mlijeko', en: 'Sweet milk' }, illustration: 'sejk', color: '#f3ead8', intensity: 7 },
      { name: { bs: 'Vanila', en: 'Vanilla' }, illustration: 'vanila', color: '#f1dca7', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 3, fruitiness: 0, cooling: 0, strength: 9 },
    tags: ['desertni', 'zacinski', 'pice', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#c58a52', secondary: '#f3ead8', accent: '#8a4a22', background: '#1f140c', text: '#fbf1e4', smoke: ['#fff8ee', '#ead7bd', '#c9a57d'] },
    mixIdeas: {
      bs: [
        'Horchata i Kashmir Peach, za začinjenu breskvu sa kremom.',
        'Horchata i Cane Mint, 80/20, za hladni cimet.',
        'Horchata i Double Apple, za pitu od jabuka.'
      ],
      en: [
        'Horchata with Kashmir Peach for spiced peach and cream.',
        'Horchata with Cane Mint, 80/20, for a cool cinnamon.',
        'Horchata with Double Apple for apple pie.'
      ]
    },
    similar: ['fumari-spiced-chai', 'tangiers-kashmir-peach', 'trifecta-peppermint-shake']
  },
  {
    id: 'tangiers-maraschino-cherry',
    brand: 'tangiers',
    leaf: 'dark',
    name: 'Maraschino Cherry',
    shortDescription: {
      bs: 'Slatka koktel višnja sa blagom notom badema.',
      en: 'Sweet cocktail cherry with a gentle hint of almond.'
    },
    description: {
      bs: [
        'Maraschino Cherry je slatka, sirupasta višnja kakvu stavljaju u koktele i na kolače. Ispod nje se osjeti blaga nota badema, kao kod pravih maraskino višanja.',
        'Okus je bogat i bombonski, ali ne vještački, a badem mu daje dubinu.',
        'Tamni list: rastresito pakovanje i strpljenje sa toplotom. Odličan za mikseve sa kolom ili vanilom.'
      ],
      en: [
        'Maraschino Cherry is the sweet, syrupy cherry you find in cocktails and on cakes. Underneath it you get a gentle hint of almond, as in real maraschino cherries.',
        'It is rich and candy-like without feeling artificial, and the almond gives it depth.',
        'Dark leaf: pack it loose and be patient with the heat. Excellent in mixes with cola or vanilla.'
      ]
    },
    ingredients: [
      { name: { bs: 'Višnja', en: 'Cherry' }, illustration: 'visnja', color: '#a3122a', intensity: 9 },
      { name: { bs: 'Badem', en: 'Almond' }, illustration: 'karamel', color: '#d6b48a', intensity: 4 }
    ],
    profile: { sweetness: 8, freshness: 4, fruitiness: 8, cooling: 0, strength: 9 },
    tags: ['vocni', 'slatki', 'bombon'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#c8102e', secondary: '#ff8fa3', accent: '#f2d2a9', background: '#1e0609', text: '#fff0f2' },
    mixIdeas: {
      bs: [
        'Maraschino Cherry i Darkside Cola, za višnja-kolu.',
        'Maraschino Cherry i Horchata, za višnju sa kremom.',
        'Maraschino Cherry i Cane Mint, 80/20, za ledenu višnju.'
      ],
      en: [
        'Maraschino Cherry with Darkside Cola for cherry cola.',
        'Maraschino Cherry with Horchata for cherries and cream.',
        'Maraschino Cherry with Cane Mint, 80/20, for an icy cherry.'
      ]
    },
    similar: ['sebero-black-amarena-cherry', 'adalya-cherry-mint', 'musthave-cherry-cola', 'al-fakher-cherry']
  },
  {
    id: 'tangiers-orange-soda',
    brand: 'tangiers',
    leaf: 'dark',
    name: 'Orange Soda',
    mood: 'fizz',
    shortDescription: {
      bs: 'Gazirani sok od narandže: sladak, mjehurast i jako vjeran originalu.',
      en: 'Fizzy orange soda: sweet, bubbly and very true to the real thing.'
    },
    description: {
      bs: [
        'Orange Soda je narandža iz limenke: slatka, gazirana i prepoznatljiva već na prvom povlačenju. Nije svježa narandža, nego baš onaj sok koji pamtiš iz djetinjstva.',
        'Slatkoća je izražena, a blaga "gaziranost" daje okusu živost. Nema mentola.',
        'Jak tamni list, pa je okus gust i dugotrajan. Pakuj rastresito i ne žuri sa toplotom.'
      ],
      en: [
        'Orange Soda is orange from a can: sweet, fizzy and recognizable from the first pull. Not fresh orange, but exactly the soda you remember from childhood.',
        'The sweetness is pronounced and a gentle "fizz" keeps it lively. There is no menthol.',
        'Strong dark leaf, so the flavor is dense and long lasting. Pack it loose and do not rush the heat.'
      ]
    },
    ingredients: [
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 9 },
      { name: { bs: 'Gazirani sok', en: 'Soda' }, illustration: 'kola', color: '#f08a24', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 7, cooling: 0, strength: 9 },
    tags: ['citrusni', 'pice', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ff8a1f', secondary: '#ffd08a', accent: '#ffffff', background: '#2a1204', text: '#fff4e6', smoke: ['#fff6ea', '#ffd9a8', '#f4a95a'] },
    mixIdeas: {
      bs: [
        'Orange Soda i Horchata, za kremastu narandžu.',
        'Orange Soda i Cane Mint, 80/20, za ledeni sok.',
        'Orange Soda i Maraschino Cherry, za voćni sok.'
      ],
      en: [
        'Orange Soda with Horchata for a creamsicle.',
        'Orange Soda with Cane Mint, 80/20, for an icy soda.',
        'Orange Soda with Maraschino Cherry for a fruit soda.'
      ]
    },
    similar: ['starbuzz-sex-on-the-beach', 'darkside-cola', 'haze-purple-krush']
  },
  {
    id: 'tangiers-cocoa',
    brand: 'tangiers',
    leaf: 'dark',
    name: 'Cocoa',
    shortDescription: {
      bs: 'Kakao koji podsjeća na čokoladno mlijeko u prahu.',
      en: 'Cocoa that recalls chocolate milk powder.'
    },
    description: {
      bs: [
        'Cocoa je Tangiersov okus kakaa, koji podsjeća na čokoladno mlijeko u prahu.',
        'Nije voćni okus, nego topao i desertni, a na tamnom listu je jači od većine okusa.',
        'Odličan je u miksevima: sa Horchatom, na primjer, daje okus keksa sa kremom.'
      ],
      en: [
        'Cocoa is Tangiers\' cocoa flavor, which recalls chocolate milk powder.',
        'It is not a fruit flavor but a warm, dessert-like one, and on dark leaf it is stronger than most flavors.',
        'Great in mixes: with Horchata, for example, it gives a cookies and cream taste.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kakao', en: 'Cocoa' }, illustration: 'cokolada', color: '#6b3f26', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 2, fruitiness: 1, cooling: 0, strength: 8 },
    tags: ['desertni', 'nocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#6b3f26', secondary: '#ae9588', accent: '#502f1d', background: '#180f0a', text: '#f5f2f0' },
    mixIdeas: {
      bs: [
        'Cocoa i Horchata, za keks sa kremom.',
        'Cocoa i Cane Mint, 70/30, za čokoladu sa mentom.',
        'Cocoa i Maraschino Cherry, za čokoladu sa višnjom.'
      ],
      en: [
        'Cocoa with Horchata for cookies and cream.',
        'Cocoa with Cane Mint, 70/30, for mint chocolate.',
        'Cocoa with Maraschino Cherry for chocolate cherry.'
      ]
    },
    similar: ['musthave-cacao', 'musthave-choco-mint', 'fumari-mint-chocolate-chill']
  },
  {
    id: 'tangiers-juicy-peach',
    brand: 'tangiers',
    leaf: 'dark',
    name: 'Juicy Peach',
    shortDescription: {
      bs: 'Slatka, sočna breskva na jakom tamnom listu.',
      en: 'Sweet, juicy peach on strong dark leaf.'
    },
    description: {
      bs: [
        'Juicy Peach je slatka, sočna breskva.',
        'Za razliku od Kashmir Peacha, ovdje nema začina, pa je to čisto voće.',
        'Tangiers je tamni list, pa je jači od Adalye ili Al Fakhera i više odgovara iskusnijima.'
      ],
      en: [
        'Juicy Peach is a sweet, juicy peach.',
        'Unlike Kashmir Peach, there is no spice here, so it is pure fruit.',
        'Tangiers is dark leaf, so it is stronger than Adalya or Al Fakher and suits more experienced smokers.'
      ]
    },
    ingredients: [
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ffb07a', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 8, cooling: 0, strength: 8 },
    tags: ['vocni', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ffb07a', secondary: '#ffd4b6', accent: '#bf845c', background: '#2d1f15', text: '#fff9f6' },
    mixIdeas: {
      bs: [
        'Juicy Peach i Cane Mint, 70/30, za breskvu sa mentom.',
        'Juicy Peach i Kashmir Peach, za breskvu sa začinima.',
        'Juicy Peach i Orange Soda, za voćni sok.'
      ],
      en: [
        'Juicy Peach with Cane Mint, 70/30, for peach with mint.',
        'Juicy Peach with Kashmir Peach for spiced peach.',
        'Juicy Peach with Orange Soda for a fruit soda.'
      ]
    },
    similar: ['musthave-sweet-peach', 'tangiers-kashmir-peach', 'al-fakher-peach']
  },
  {
    id: 'fumari-white-gummi-bear',
    brand: 'fumari',
    leaf: 'light',
    name: 'White Gummi Bear',
    shortDescription: {
      bs: 'Slatki i kiselkasti gumeni bomboni sa ananasom, limunom i narandžom.',
      en: 'Sweet and tangy gummy candy with pineapple, lemon and orange.'
    },
    description: {
      bs: [
        'White Gummi Bear podsjeća na vrećicu providnih gumenih bombona. Slatko je, malo kiselkasto i razigrano.',
        'Ananas daje sočnu, tropsku osnovu, a limun i narandža dodaju citrusnu svježinu koja razbija slatkoću.',
        'Bez mente je i na svijetlom listu, pa je lagan i dobar za početnike i za sve koji vole slatke okuse.'
      ],
      en: [
        'White Gummi Bear tastes like a bag of clear gummy candy. It is sweet, a little tangy and playful.',
        'Pineapple gives it a juicy, tropical base, while lemon and orange add a citrus brightness that cuts through the sugar.',
        'There is no mint and it sits on blonde leaf, so it is light and works well for beginners and anyone with a sweet tooth.'
      ]
    },
    ingredients: [
      { name: { bs: 'Gumeni bombon', en: 'Gummy candy' }, illustration: 'medo', color: '#fff0a0', intensity: 8 },
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#ffd84d', intensity: 7 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#ffe14d', intensity: 6 },
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 5 }
    ],
    profile: { sweetness: 9, freshness: 6, fruitiness: 8, cooling: 0, strength: 4 },
    tags: ['vocni', 'slatki', 'bombon', 'citrusni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffc83d', secondary: '#fff2a8', accent: '#ff8a1c', background: '#fff4d1', text: '#3a2a05', water: '#ffe58a', smoke: ['#ffffff', '#fff8dc', '#fff0b8'] },
    mixIdeas: {
      bs: [
        'White Gummi Bear i Cane Mint, za bombone sa jakim hlađenjem.',
        'White Gummi Bear i Dubai, za još više tropskog voća.',
        'White Gummi Bear i Tynky Wynky, za citrusnu, ljetnu limunadu.'
      ],
      en: [
        'White Gummi Bear with Cane Mint for candy with a strong chill.',
        'White Gummi Bear with Dubai for even more tropical fruit.',
        'White Gummi Bear with Tynky Wynky for a citrusy summer lemonade.'
      ]
    },
    similar: ['fumari-red-gummi-bear', 'haze-double-bubble', 'adalya-dubai', 'adalya-ice-bonbon']
  },
  {
    id: 'fumari-ambrosia',
    brand: 'fumari',
    leaf: 'light',
    name: 'Ambrosia',
    shortDescription: {
      bs: 'Slatka dinja i sočna narandža na mekoj, kremastoj podlozi od marshmallowa.',
      en: 'Sweet cantaloupe and juicy orange on a soft, creamy marshmallow base.'
    },
    description: {
      bs: [
        'Ambrosia je jedan od zaštitnih znakova Fumarija i okus koji se godinama drži među najprodavanijima. Glavna je zrela, slatka dinja (kantalupa).',
        'Uz nju je sočna, kremasta narandža, a sve zajedno leži na mekoj podlozi koja podsjeća na marshmallow, pa okus djeluje skoro kao desert.',
        'Daje gust, sladak dim i lagan je za pripremu, pa je dobar i za početnike.'
      ],
      en: [
        'Ambrosia is one of Fumari\'s signature flavors and has been among its best sellers for years. The star is ripe, sweet cantaloupe.',
        'Alongside it comes juicy, creamy orange, all resting on a soft, marshmallow-like base that makes it feel almost like a dessert.',
        'It gives thick, sweet clouds and is easy to set up, so it also works well for beginners.'
      ]
    },
    ingredients: [
      { name: { bs: 'Dinja', en: 'Cantaloupe' }, illustration: 'dinja', color: '#f6b26b', intensity: 9 },
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 6 },
      { name: { bs: 'Marshmallow', en: 'Marshmallow' }, illustration: 'marshmallow', color: '#fde6ef', intensity: 5 }
    ],
    profile: { sweetness: 9, freshness: 5, fruitiness: 8, cooling: 0, strength: 4 },
    tags: ['vocni', 'slatki', 'desertni', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f6a55a', secondary: '#fde3c4', accent: '#c8611e', background: '#fdebd6', text: '#2e1806', water: '#fbd3a6' },
    mixIdeas: {
      bs: [
        'Ambrosia i White Gummi Bear, za vrlo slatku, bombon voćnu posudu.',
        'Ambrosia i Kashmir Peach, za breskvu i dinju sa začinom.',
        'Ambrosia i malo mente, 80/20, za svježiji ljetni miks.'
      ],
      en: [
        'Ambrosia with White Gummi Bear for a very sweet, candy-fruit bowl.',
        'Ambrosia with Kashmir Peach for spiced peach and melon.',
        'Ambrosia with a little mint, 80/20, for a fresher summer mix.'
      ]
    },
    similar: ['adalya-double-melon', 'fumari-white-gummi-bear', 'tangiers-kashmir-peach', 'al-fakher-melon']
  },
  {
    id: 'fumari-red-gummi-bear',
    brand: 'fumari',
    leaf: 'light',
    name: 'Red Gummi Bear',
    shortDescription: {
      bs: 'Crveni gumeni medo: divlja višnja i malina, slatko kao bombon.',
      en: 'A red gummy bear: wild cherry and raspberry, sweet as candy.'
    },
    description: {
      bs: [
        'Red Gummi Bear je crveni brat poznatog White Gummi Bear. Ovdje su divlja višnja i malina, spojene u slatki, bombonski okus gumenih medvjedića.',
        'Okus je sočan i živ, sa blagom kiselošću bobica, bez hlađenja.',
        'Fumari je svijetli list, mekan i lagan, pa je ovo dobar izbor i za početnike.'
      ],
      en: [
        'Red Gummi Bear is the red sibling of the famous White Gummi Bear. Here you get wild cherry and raspberry, blended into the sweet, candy flavor of gummy bears.',
        'It is juicy and lively, with a slight berry tartness and no cooling.',
        'Fumari is blonde leaf, soft and light, so this is a good pick for beginners too.'
      ]
    },
    ingredients: [
      { name: { bs: 'Divlja višnja', en: 'Wild cherry' }, illustration: 'visnja', color: '#a3122a', intensity: 8 },
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#e0336b', intensity: 7 },
      { name: { bs: 'Gumeni bombon', en: 'Gummy candy' }, illustration: 'medo', color: '#ff5a6e', intensity: 6 }
    ],
    profile: { sweetness: 9, freshness: 5, fruitiness: 8, cooling: 0, strength: 4 },
    tags: ['bombon', 'vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8304a', secondary: '#ff9aa8', accent: '#ffd23f', background: '#2a080e', text: '#fff0f2' },
    mixIdeas: {
      bs: [
        'Red Gummi Bear i White Gummi Bear, za cijelu kesicu medvjedića.',
        'Red Gummi Bear i Mint, 80/20, za osvježene bombone.',
        'Red Gummi Bear i Ambrosia, za voćni bombon sa dinjom.'
      ],
      en: [
        'Red Gummi Bear with White Gummi Bear for the whole bag of gummies.',
        'Red Gummi Bear with Mint, 80/20, for refreshed candy.',
        'Red Gummi Bear with Ambrosia for fruit candy with melon.'
      ]
    },
    similar: ['fumari-white-gummi-bear', 'adalya-raspberry', 'tangiers-maraschino-cherry', 'al-fakher-cherry']
  },
  {
    id: 'fumari-lemon-mint',
    brand: 'fumari',
    leaf: 'light',
    name: 'Lemon Mint',
    shortDescription: {
      bs: 'Svjež limun i paprena metvica: čist, kiselkast i jako osvježavajući.',
      en: 'Fresh lemon and peppermint: clean, tangy and very refreshing.'
    },
    description: {
      bs: [
        'Fumari Lemon Mint spaja svjež, kiselkast limun sa paprenom metvicom. Metvica je oštrija od obične mente, pa je izdah hladniji i čišći.',
        'Limun je prirodan i svijetao, više kao korica i sok nego kao bombon.',
        'Uporedi ga sa Al Fakher i Mazaya Lemon Mint: Fumari je najsvježiji i najmanje sladak od tri.'
      ],
      en: [
        'Fumari Lemon Mint pairs fresh, tangy lemon with peppermint. Peppermint is sharper than regular mint, so the exhale is colder and cleaner.',
        'The lemon is natural and bright, more like peel and juice than candy.',
        'Compare it with the Al Fakher and Mazaya Lemon Mint: Fumari is the freshest and the least sweet of the three.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 8 },
      { name: { bs: 'Paprena metvica', en: 'Peppermint' }, illustration: 'pepermint', color: '#1fa874', intensity: 7 }
    ],
    profile: { sweetness: 4, freshness: 9, fruitiness: 6, cooling: 6, strength: 4 },
    tags: ['citrusni', 'mint', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f5e04a', secondary: '#bff0d0', accent: '#1fa874', background: '#f4fde8', text: '#18280c' },
    mixIdeas: {
      bs: [
        'Lemon Mint i Red Gummi Bear, za bombon-limunadu.',
        'Lemon Mint i Ambrosia, za ljetni miks od dinje.',
        'Lemon Mint i White Gummi Bear, za kiselkaste bombone.'
      ],
      en: [
        'Lemon Mint with Red Gummi Bear for a candy lemonade.',
        'Lemon Mint with Ambrosia for a summer melon mix.',
        'Lemon Mint with White Gummi Bear for tangy candy.'
      ]
    },
    similar: ['al-fakher-lemon-mint', 'mazaya-lemon-mint', 'revoshi-eskimo-lemon']
  },
  {
    id: 'fumari-spiced-chai',
    brand: 'fumari',
    leaf: 'light',
    name: 'Spiced Chai',
    mood: 'honey',
    shortDescription: {
      bs: 'Začinjeni čaj sa vanilom, cimetom, muškatnim oraščićem i kardamomom.',
      en: 'Spiced tea with vanilla, cinnamon, nutmeg and cardamom.'
    },
    description: {
      bs: [
        'Spiced Chai je okus indijskog začinjenog čaja sa mlijekom. Vanila daje mekanu, slatku osnovu, a cimet, muškatni oraščić i kardamom grijući, mirisni završetak.',
        'Začini su skladni i nijedan ne iskače. Okus je topao i umirujuć, idealan za zimske večeri.',
        'Svijetli list, pa je lagan uprkos bogatom okusu. Odličan i u miksevima sa voćem.'
      ],
      en: [
        'Spiced Chai is the flavor of Indian spiced milk tea. Vanilla gives a soft, sweet base, while cinnamon, nutmeg and cardamom add a warming, fragrant finish.',
        'The spices are balanced and none of them jumps out. It is warm and calming, perfect for winter evenings.',
        'Blonde leaf, so it stays light despite the rich flavor. Great in fruit mixes, too.'
      ]
    },
    ingredients: [
      { name: { bs: 'Vanila', en: 'Vanilla' }, illustration: 'vanila', color: '#f1dca7', intensity: 7 },
      { name: { bs: 'Cimet', en: 'Cinnamon' }, illustration: 'cimet', color: '#a0522d', intensity: 6 },
      { name: { bs: 'Kardamom', en: 'Cardamom' }, illustration: 'kardamom', color: '#8fae5a', intensity: 5 },
      { name: { bs: 'Muškatni oraščić', en: 'Nutmeg' }, illustration: 'bilje', color: '#8a5a3a', intensity: 4 },
      { name: { bs: 'Čaj', en: 'Tea' }, illustration: 'caj', color: '#b5651d', intensity: 5 }
    ],
    profile: { sweetness: 6, freshness: 3, fruitiness: 0, cooling: 0, strength: 4 },
    tags: ['zacinski', 'desertni', 'pice'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#c47a3a', secondary: '#f1dca7', accent: '#8fae5a', background: '#1d120a', text: '#fbf0e2', smoke: ['#fff7ea', '#ead2b0', '#c79a68'] },
    mixIdeas: {
      bs: [
        'Spiced Chai i Double Apple, za jabuku sa cimetom.',
        'Spiced Chai i Kashmir Peach, za začinjenu breskvu.',
        'Spiced Chai i Peppermint Shake, za zimski desert.'
      ],
      en: [
        'Spiced Chai with Double Apple for apple and cinnamon.',
        'Spiced Chai with Kashmir Peach for a spiced peach.',
        'Spiced Chai with Peppermint Shake for a winter dessert.'
      ]
    },
    similar: ['tangiers-horchata', 'tangiers-kashmir-peach', '187-wild-beast', 'al-fakher-vanilla']
  },
  {
    id: 'fumari-mint-chocolate-chill',
    brand: 'fumari',
    leaf: 'light',
    name: 'Mint Chocolate Chill',
    mood: 'frost',
    shortDescription: {
      bs: 'Slatka tamna čokolada i hladna menta: desert koji osvježava.',
      en: 'Sweet dark chocolate and cool mint: a dessert that refreshes.'
    },
    description: {
      bs: [
        'Mint Chocolate Chill je desertni okus: tamna, slatka čokolada i hladna menta, kao sladoled od mente sa komadićima čokolade.',
        'Čokolada daje toplu, kremastu osnovu, a menta hladi izdah. Spoj je skladan i nije previše sladak.',
        'Svijetli list, mekan i lagan. Dobar izbor kad želiš nešto drugačije od voća.'
      ],
      en: [
        'Mint Chocolate Chill is a dessert flavor: dark, sweet chocolate and cool mint, like mint chocolate chip ice cream.',
        'The chocolate gives a warm, creamy base and the mint cools the exhale. The pairing is balanced and not too sweet.',
        'Blonde leaf, soft and light. A good pick when you want something other than fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Čokolada', en: 'Chocolate' }, illustration: 'cokolada', color: '#5a3220', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 0, cooling: 6, strength: 4 },
    tags: ['desertni', 'mint', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#6fd3a8', secondary: '#5a3220', accent: '#e9fff4', background: '#170d08', text: '#effff7' },
    mixIdeas: {
      bs: [
        'Mint Chocolate Chill i Peppermint Shake, za mliječni šejk sa čokoladom.',
        'Mint Chocolate Chill i Raspberry, za čokoladu sa malinom.',
        'Mint Chocolate Chill i Bananarama, za čokoladnu bananu.'
      ],
      en: [
        'Mint Chocolate Chill with Peppermint Shake for a chocolate milkshake.',
        'Mint Chocolate Chill with Raspberry for chocolate and raspberry.',
        'Mint Chocolate Chill with Bananarama for a chocolate banana.'
      ]
    },
    similar: ['trifecta-peppermint-shake', 'haze-mint-supreme', 'tangiers-horchata', 'tangiers-cocoa']
  },
  {
    id: 'darkside-supernova',
    brand: 'darkside',
    leaf: 'dark',
    name: 'Supernova',
    mood: 'supernova',
    mixRole: 'cooler',
    shortDescription: {
      bs: 'Ekstremno ledeni mentol sa vrlo malo okusa. Koristi se u malim količinama, da doda hlađenje miksu.',
      en: 'Extremely icy menthol with very little flavor. Used in small amounts to add chill to a mix.'
    },
    description: {
      bs: [
        'Supernova je skoro čisto hlađenje: ledeni mentol i malo mente, bez voća i gotovo bez slatkoće. Hladnoća je toliko jaka da se osjeti i u grlu i u nosu.',
        'Zato se rijetko puši sama. Najčešće se dodaje u malim količinama, otprilike 10 do 20 posto posude, da voćnom okusu da ledeni izdah.',
        'Duhan je tamni list, jak i sa više nikotina, pa je za iskusnije pušače. Ako je dodaješ u miks, kreni od manje količine: lako je pretjerati.'
      ],
      en: [
        'Supernova is almost pure chill: icy menthol with a little mint, no fruit and hardly any sweetness. The cold is so strong you feel it in your throat and nose.',
        'That is why it is rarely smoked on its own. Most people add a small amount, roughly 10 to 20 percent of the bowl, to give a fruit flavor an icy exhale.',
        'The tobacco is dark leaf, strong and higher in nicotine, so it is for experienced smokers. When you add it to a mix, start small: it is easy to overdo.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ledeni mentol', en: 'Icy menthol' }, illustration: 'kristal', color: '#e6f7ff', intensity: 10 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fbf8f', intensity: 4 }
    ],
    profile: { sweetness: 1, freshness: 10, fruitiness: 0, cooling: 10, strength: 8 },
    tags: ['mint', 'ledeni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#7a6bff', secondary: '#3d7bff', accent: '#dff4ff', background: '#0b0a24', text: '#f1f0ff', water: '#9fd8ff', smoke: ['#ffffff', '#e3ecff', '#d8d2ff'] },
    mixIdeas: {
      bs: [
        'Pinkman sa 20 posto Supernove, za ledeni slatko-kiseli miks.',
        'Malo Supernove uz Dubai ili Love 66, kao kocka leda u koktelu.',
        'Supernova u 10 do 20 posto uz bilo koji voćni okus kojem fali hladnoće.'
      ],
      en: [
        'Pinkman with 20 percent Supernova for an icy sweet and tart mix.',
        'A little Supernova with Dubai or Love 66, like an ice cube in a cocktail.',
        'Supernova at 10 to 20 percent with any fruit flavor that needs more chill.'
      ]
    },
    similar: ['tangiers-cane-mint', 'adalya-ice-bonbon', 'adalya-swiss-bonbon']
  },
  {
    id: 'darkside-cola',
    brand: 'darkside',
    leaf: 'dark',
    name: 'Cola',
    mood: 'fizz',
    shortDescription: {
      bs: 'Klasična kola sa karamel slatkoćom i laganim začinom: kao čaša sipana iz boce.',
      en: 'Classic cola with caramel sweetness and a light spice: like a glass poured from the bottle.'
    },
    description: {
      bs: [
        'Darkside Cola ima okus prave, sipane kole, a ne bombona sa okusom kole. Na početku je topla karamel slatkoća poznata iz pića.',
        'U sredini se pojavi lagan začin, nalik na cimet i vaniliju iz recepta za kolu, koji okusu daje dubinu, a završetak je čist i ostavlja jasan okus kole.',
        'Tamni list, pa traži umjerenu, stabilnu toplotu. Zato je zanimljivo uporediti ga sa MUSTHAVE Colom i Sebero Black Colom: isti okus, tri različita karaktera.'
      ],
      en: [
        'Darkside Cola tastes like real poured cola, not cola-flavored candy. It opens with the warm caramel sweetness you know from the drink.',
        'Mid-pull a light spice comes through, like the cinnamon and vanilla in a cola recipe, giving it depth, and the finish is clean with a clear cola aftertaste.',
        'It is dark leaf, so it wants steady, moderate heat. That makes it fun to compare with MUSTHAVE Cola and Sebero Black Cola: the same flavor, three different characters.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kola', en: 'Cola' }, illustration: 'kola', color: '#5a2614', intensity: 9 },
      { name: { bs: 'Karamel', en: 'Caramel' }, illustration: 'karamel', color: '#c8843a', intensity: 6 },
      { name: { bs: 'Lagani začin', en: 'Light spice' }, illustration: 'anis', color: '#8a4a22', intensity: 3 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 1, cooling: 0, strength: 8 },
    tags: ['pice', 'slatki', 'klasicni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#8a3a1c', secondary: '#d9954a', accent: '#e8a85a', background: '#1c0f0a', text: '#f8eadc', smoke: ['#fff3e6', '#e8c49a', '#c98a52'] },
    mixIdeas: {
      bs: [
        'Cola i Cherry Mint, 70/30, za kolu sa višnjom i svježim krajem.',
        'Cola i limun ili Pirate\'s Cave, za "kolu sa kriškom limuna".',
        'Cola i Peppermint Shake, za kremastu kolu sa vanilom.'
      ],
      en: [
        'Cola with Cherry Mint, 70/30, for cherry cola with a fresh finish.',
        'Cola with lemon or Pirate\'s Cave for "cola with a slice of lemon".',
        'Cola with Peppermint Shake for a creamy vanilla cola.'
      ]
    },
    similar: ['musthave-cola', 'sebero-black-cola', 'adalya-cherry-mint']
  },
  {
    id: 'darkside-falling-star',
    brand: 'darkside',
    leaf: 'dark',
    name: 'Falling Star',
    shortDescription: {
      bs: 'Mango i marakuja: tropski, sočan i blago kiselkast.',
      en: 'Mango and passion fruit: tropical, juicy and slightly tart.'
    },
    description: {
      bs: [
        'Falling Star je jedan od najpoznatijih Darkside okusa. Zreo mango daje gustu slatkoću, a marakuja kiselkast, mirisni tropski ton.',
        'Okus je sočan i jasan, bez hlađenja, a marakuja sprečava da mango postane težak.',
        'Darkside je jak tamni list: pakuj rastresito, ne pretjeruj sa toplotom i nemoj ga davati nekome ko tek počinje.'
      ],
      en: [
        'Falling Star is one of the best known Darkside flavors. Ripe mango brings a thick sweetness and passion fruit a tangy, fragrant tropical tone.',
        'It is juicy and clear with no cooling, and the passion fruit keeps the mango from getting heavy.',
        'Darkside is strong dark leaf: pack it loose, go easy on the heat and do not hand it to someone who is just starting out.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 8 },
      { name: { bs: 'Marakuja', en: 'Passion fruit' }, illustration: 'marakuja', color: '#f2a03a', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 0, strength: 8 },
    tags: ['vocni', 'tropski', 'ljetni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ffb52e', secondary: '#9b4dca', accent: '#ffe08a', background: '#140b1f', text: '#fff4e2' },
    mixIdeas: {
      bs: [
        'Falling Star i Supernova, 80/20, za ledeni mango.',
        'Falling Star i Bananapapa, za tropski smoothie.',
        'Falling Star i Generis Raspberry, za mango sa malinom.'
      ],
      en: [
        'Falling Star with Supernova, 80/20, for an icy mango.',
        'Falling Star with Bananapapa for a tropical smoothie.',
        'Falling Star with Generis Raspberry for mango and raspberry.'
      ]
    },
    similar: ['adalya-hawaii', 'revoshi-lady-mystique', 'sebero-mango-yogurt']
  },
  {
    id: 'darkside-bananapapa',
    brand: 'darkside',
    leaf: 'dark',
    name: 'Bananapapa',
    shortDescription: {
      bs: 'Zrela, kremasta banana: slatka, mekana i jako prirodna.',
      en: 'Ripe, creamy banana: sweet, soft and very natural.'
    },
    description: {
      bs: [
        'Bananapapa je čista banana, zrela i kremasta, onakva kakva je kad se tek ogulji. Nije bombonska, nego prirodna i mekana.',
        'Nema kiselosti ni hlađenja, pa je okus topao i pun, skoro kao desert.',
        'Odlična baza za mikseve sa bobicama, čokoladom ili kolom. Tamni list, pa ga pakuj rastresito.'
      ],
      en: [
        'Bananapapa is pure banana, ripe and creamy, the way it is right after peeling. Not candy-like, but natural and soft.',
        'There is no tartness and no cooling, so it is warm and full, almost like a dessert.',
        'A great base for mixes with berries, chocolate or cola. Dark leaf, so pack it loose.'
      ]
    },
    ingredients: [
      { name: { bs: 'Zrela banana', en: 'Ripe banana' }, illustration: 'banana', color: '#fbe48c', intensity: 9 }
    ],
    profile: { sweetness: 8, freshness: 3, fruitiness: 8, cooling: 0, strength: 8 },
    tags: ['vocni', 'tropski', 'desertni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f7d84a', secondary: '#fff1b0', accent: '#6b4a1f', background: '#1c1606', text: '#fffbe6' },
    mixIdeas: {
      bs: [
        'Bananapapa i Generis Raspberry, za bananu sa malinom.',
        'Bananapapa i Darkside Cola, za bananu u koli.',
        'Bananapapa i Falling Star, za tropski smoothie.'
      ],
      en: [
        'Bananapapa with Generis Raspberry for banana and raspberry.',
        'Bananapapa with Darkside Cola for banana cola.',
        'Bananapapa with Falling Star for a tropical smoothie.'
      ]
    },
    similar: ['haze-bananarama', 'adalya-dubai', 'starbuzz-pirates-cave', 'al-fakher-banana']
  },
  {
    id: 'darkside-generis-raspberry',
    brand: 'darkside',
    leaf: 'dark',
    name: 'Generis Raspberry',
    shortDescription: {
      bs: 'Prava malina: slatka, kiselkasta i prirodna, bez bombonskog ukusa.',
      en: 'Real raspberry: sweet, tart and natural, with no candy taste.'
    },
    description: {
      bs: [
        'Generis Raspberry je iz Darkside Generis linije, gdje je cilj što prirodniji okus. Malina je slatka i kiselkasta, sa onom blagom "zelenom" notom svježih bobica.',
        'Nema mentola ni dodatne slatkoće. Okus je čist i lako se kombinuje.',
        'Tamni list: rastresito pakovanje i umjerena toplota. Odličan za mikseve sa mentom ili limunom.'
      ],
      en: [
        'Generis Raspberry comes from the Darkside Generis line, which aims for flavors as natural as possible. The raspberry is sweet and tart, with that slight "green" note of fresh berries.',
        'No menthol and no added sweetness. It is clean and easy to mix.',
        'Dark leaf: pack it loose and keep the heat moderate. Excellent in mixes with mint or lemon.'
      ]
    },
    ingredients: [
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#e0336b', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 6, fruitiness: 9, cooling: 0, strength: 8 },
    tags: ['vocni', 'bobicasti'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#d62f63', secondary: '#ff9cbc', accent: '#5fbf7a', background: '#1f070f', text: '#fff0f5' },
    mixIdeas: {
      bs: [
        'Generis Raspberry i Supernova, 80/20, za ledenu malinu.',
        'Generis Raspberry i Bananapapa, za smoothie od maline i banane.',
        'Generis Raspberry i Wild Forest, za šumske bobice.'
      ],
      en: [
        'Generis Raspberry with Supernova, 80/20, for an icy raspberry.',
        'Generis Raspberry with Bananapapa for a raspberry banana smoothie.',
        'Generis Raspberry with Wild Forest for forest berries.'
      ]
    },
    similar: ['adalya-raspberry', 'starbuzz-pink', 'darkside-wild-forest', 'musthave-pinkman']
  },
  {
    id: 'darkside-wild-forest',
    brand: 'darkside',
    leaf: 'dark',
    name: 'Wild Forest',
    shortDescription: {
      bs: 'Šumska jagoda i bobice: slatko, mirisno i malo divlje.',
      en: 'Wild strawberry and forest berries: sweet, fragrant and a little wild.'
    },
    description: {
      bs: [
        'Wild Forest je šumska jagoda sa miješanim šumskim bobicama. Jagoda je sitna i mirisna, kao ona ubrana u šumi, a bobice dodaju tamniju, kiselkastu dubinu.',
        'Okus je prirodan i nije previše sladak. Nema hlađenja.',
        'Darkside je jak tamni list: pakuj rastresito i daj glavi par minuta da se zagrije.'
      ],
      en: [
        'Wild Forest is wild strawberry with mixed forest berries. The strawberry is small and fragrant, like one picked in the woods, and the berries add a darker, tart depth.',
        'It is natural and not too sweet. No cooling.',
        'Darkside is strong dark leaf: pack it loose and give the bowl a few minutes to heat up.'
      ]
    },
    ingredients: [
      { name: { bs: 'Šumska jagoda', en: 'Wild strawberry' }, illustration: 'jagoda', color: '#e8354a', intensity: 8 },
      { name: { bs: 'Šumske bobice', en: 'Forest berries' }, illustration: 'kupina', color: '#5a2a5e', intensity: 6 }
    ],
    profile: { sweetness: 6, freshness: 6, fruitiness: 9, cooling: 0, strength: 8 },
    tags: ['vocni', 'bobicasti'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#d8344c', secondary: '#7a3a7e', accent: '#7cc46a', background: '#140a10', text: '#fff0f2' },
    mixIdeas: {
      bs: [
        'Wild Forest i Generis Raspberry, za korpu šumskog voća.',
        'Wild Forest i Supernova, 80/20, za ledene bobice.',
        'Wild Forest i Bananapapa, za jagodu sa bananom.'
      ],
      en: [
        'Wild Forest with Generis Raspberry for a basket of forest fruit.',
        'Wild Forest with Supernova, 80/20, for icy berries.',
        'Wild Forest with Bananapapa for strawberry and banana.'
      ]
    },
    similar: ['darkside-generis-raspberry', '187-wild-beast', 'trifecta-blue-strawberry']
  },
  {
    id: 'darkside-torpedo',
    brand: 'darkside',
    leaf: 'dark',
    name: 'Torpedo',
    shortDescription: {
      bs: 'Lubenica i dinja na tamnom listu: sočno, slatko i puno.',
      en: 'Watermelon and melon on dark leaf: juicy, sweet and full.'
    },
    description: {
      bs: [
        'Torpedo spaja lubenicu i dinju u jedan sočan, slatki ljetni okus.',
        'Rađen je na tamnom listu, pa je jači od voćnih okusa na svijetlom listu i ima puniji dim.',
        'Nema mente, pa se lako miješa sa nečim hladnim, npr. Supernovom.'
      ],
      en: [
        'Torpedo blends watermelon and melon into one juicy, sweet summer flavor.',
        'It is made on dark leaf, so it is stronger than fruit flavors on blonde leaf and gives a fuller smoke.',
        'There is no mint, so it is easy to mix with something cold, like Supernova.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#ff4d6d', intensity: 8 },
      { name: { bs: 'Dinja', en: 'Melon' }, illustration: 'dinja', color: '#cfe79c', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 0, strength: 8 },
    tags: ['vocni', 'ljetni', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ff4d6d', secondary: '#cfe79c', accent: '#2b9a5a', background: '#1e0b10', text: '#fff0f2' },
    mixIdeas: {
      bs: [
        'Torpedo i Supernova, 80/20, za ledenu lubenicu.',
        'Torpedo i Falling Star, za tropski voćni miks.',
        'Torpedo i Generis Raspberry, za lubenicu sa malinom.'
      ],
      en: [
        'Torpedo with Supernova, 80/20, for icy watermelon.',
        'Torpedo with Falling Star for a tropical fruit mix.',
        'Torpedo with Generis Raspberry for watermelon and raspberry.'
      ]
    },
    similar: ['musthave-watermelon', 'musthave-sweet-melon', 'adalya-double-melon', 'adalya-delons']
  },
  {
    id: 'darkside-kalee-grap',
    brand: 'darkside',
    leaf: 'dark',
    name: 'Kalee Grap',
    shortDescription: {
      bs: 'Slatko-kiseli grejpfrut: jasan, svjež citrus na tamnom listu.',
      en: 'Sweet and sour grapefruit: clear, fresh citrus on dark leaf.'
    },
    description: {
      bs: [
        'Kalee Grap je grejpfrut: svijetao citrusni miris i slatko-kiseo, sočan okus.',
        'Jednostavan je i jasan, bez dodataka, pa ga je lako kombinovati.',
        'Rađen je na tamnom listu, pa je jači od citrusa na svijetlom listu.'
      ],
      en: [
        'Kalee Grap is grapefruit: a bright citrus aroma and a juicy sweet and sour taste.',
        'It is simple and clear, with nothing added, so it is easy to mix.',
        'It is made on dark leaf, so it is stronger than citrus flavors on blonde leaf.'
      ]
    },
    ingredients: [
      { name: { bs: 'Grejpfrut', en: 'Grapefruit' }, illustration: 'grejpfrut', color: '#f26b6b', intensity: 9 }
    ],
    profile: { sweetness: 5, freshness: 8, fruitiness: 8, cooling: 0, strength: 8 },
    tags: ['citrusni', 'vocni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f26b6b', secondary: '#ffc2a8', accent: '#ff9a3c', background: '#2a1210', text: '#fff2ec' },
    mixIdeas: {
      bs: [
        'Kalee Grap i Supernova, 80/20, za ledeni grejpfrut.',
        'Kalee Grap i Generis Raspberry, za ružičastu limunadu.',
        'Kalee Grap i Falling Star, za tropski citrus.'
      ],
      en: [
        'Kalee Grap with Supernova, 80/20, for icy grapefruit.',
        'Kalee Grap with Generis Raspberry for a pink lemonade.',
        'Kalee Grap with Falling Star for tropical citrus.'
      ]
    },
    similar: ['musthave-grapefruit', 'haze-cucumberita', 'musthave-citrus-spritz']
  },
  {
    id: 'darkside-ice-granny',
    brand: 'darkside',
    leaf: 'dark',
    name: 'Ice Granny',
    shortDescription: {
      bs: 'Zelena jabuka Granny Smith sa hladnim, svježim krajem.',
      en: 'Granny Smith green apple with a cool, fresh finish.'
    },
    description: {
      bs: [
        'Ice Granny je zelena jabuka sorte Granny Smith: sočna, blago kisela i svježa, sa hladnim krajem.',
        'Hlađenje je tu da osvježi, ali ne preuzima okus, pa jabuka ostaje glavna.',
        'Na tamnom listu je, pa je jači i puniji od jabuka na svijetlom listu.'
      ],
      en: [
        'Ice Granny is Granny Smith green apple: juicy, slightly sour and fresh, with a cool finish.',
        'The cooling is there to freshen it up without taking over, so the apple stays in front.',
        'It is on dark leaf, so it is stronger and fuller than apple flavors on blonde leaf.'
      ]
    },
    ingredients: [
      { name: { bs: 'Zelena jabuka', en: 'Green apple' }, illustration: 'jabuka', color: '#8cc63f', intensity: 9 },
      { name: { bs: 'Hlađenje', en: 'Cooling' }, illustration: 'kristal', color: '#dff4ff', intensity: 5 }
    ],
    profile: { sweetness: 5, freshness: 8, fruitiness: 8, cooling: 5, strength: 8 },
    tags: ['vocni', 'osvjezavajuci', 'kiseli'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#8cc63f', secondary: '#dff4ff', accent: '#5aa02a', background: '#14200c', text: '#f4ffe6' },
    mixIdeas: {
      bs: [
        'Ice Granny i Kalee Grap, za jabuku sa citrusom.',
        'Ice Granny i Generis Raspberry, za jabuku i malinu.',
        'Ice Granny i Supernova, 80/20, za ledenu zelenu jabuku.'
      ],
      en: [
        'Ice Granny with Kalee Grap for apple and citrus.',
        'Ice Granny with Generis Raspberry for apple and raspberry.',
        'Ice Granny with Supernova, 80/20, for icy green apple.'
      ]
    },
    similar: ['musthave-sour-apple', 'musthave-apple-drops', 'musthave-kiwi-apple-lime']
  },
  {
    id: 'darkside-mango-lassi',
    brand: 'darkside',
    leaf: 'dark',
    name: 'Mango Lassi',
    shortDescription: {
      bs: 'Zreli mango i kremasti jogurt, kao indijski napitak lassi.',
      en: 'Ripe mango and creamy yogurt, like the Indian lassi drink.'
    },
    description: {
      bs: [
        'Mango Lassi je inspirisan indijskim napitkom od manga i jogurta. Mango je zreo i sladak, a jogurt ga čini kremastim i mekanim.',
        'Nema leda ni mente, pa je okus topao, pun i desertni.',
        'Na tamnom listu je, pa je jači od voćnih okusa na svijetlom listu.'
      ],
      en: [
        'Mango Lassi is inspired by the Indian mango and yogurt drink. The mango is ripe and sweet, and the yogurt makes it creamy and soft.',
        'There is no ice or mint, so the flavor is warm, full and dessert-like.',
        'It is on dark leaf, so it is stronger than fruit flavors on blonde leaf.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 8 },
      { name: { bs: 'Jogurt', en: 'Yogurt' }, illustration: 'sejk', color: '#f6f1e6', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 4, fruitiness: 7, cooling: 0, strength: 8 },
    tags: ['desertni', 'tropski', 'vocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ffb52e', secondary: '#fff6e6', accent: '#e07a2a', background: '#24160a', text: '#fff4e0' },
    mixIdeas: {
      bs: [
        'Mango Lassi i Falling Star, za još više tropskog voća.',
        'Mango Lassi i Bananapapa, za voćni smoothie.',
        'Mango Lassi i Supernova, 85/15, za hladni lassi.'
      ],
      en: [
        'Mango Lassi with Falling Star for even more tropical fruit.',
        'Mango Lassi with Bananapapa for a fruit smoothie.',
        'Mango Lassi with Supernova, 85/15, for a cold lassi.'
      ]
    },
    similar: ['sebero-mango-yogurt', 'darkside-falling-star', 'musthave-jumango']
  },
  {
    id: 'musthave-pinkman',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Pinkman',
    shortDescription: {
      bs: 'Slatko-kiseli roze grejpfrut sa jagodom i sirupom od maline.',
      en: 'Sweet and tart pink grapefruit with strawberry and raspberry syrup.'
    },
    description: {
      bs: [
        'Pinkman je živ, roze okus u kojem grejpfrut daje svježinu i blagu gorčinu, a jagoda i sirup od maline slatkoću.',
        'Rezultat je slatko-kiseo spoj koji podsjeća na hladnu ružičastu limunadu: sočan, jasan i lako se puši.',
        'Duhan je tamni list, jači od svijetlog, pa je bolji izbor za one koji već imaju malo iskustva.'
      ],
      en: [
        'Pinkman is a bright pink flavor where grapefruit brings freshness and a hint of bitterness, while strawberry and raspberry syrup bring the sweetness.',
        'The result is a sweet and tart blend that recalls cold pink lemonade: juicy, clear and easy to smoke.',
        'It sits on dark leaf, which is stronger than blonde leaf, so it suits people who already have some experience.'
      ]
    },
    ingredients: [
      { name: { bs: 'Roze grejpfrut', en: 'Pink grapefruit' }, illustration: 'grejpfrut', color: '#ff6f8a', intensity: 8 },
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#d81b60', intensity: 7 },
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e8354a', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'bobicasti', 'citrusni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#c2185b', secondary: '#ffb3c6', accent: '#7a0c35', background: '#ff5c93', text: '#2a0512', water: '#ff9db8', smoke: ['#ffffff', '#ffe3ea', '#ffd0dc'] },
    mixIdeas: {
      bs: [
        'Pinkman i Raspberry, za još više slatke maline.',
        'Pinkman sa malo Supernove, za ledenu ružičastu limunadu.',
        'Pinkman i Tynky Wynky, za citrusni ljetni miks.'
      ],
      en: [
        'Pinkman with Raspberry for even more sweet raspberry.',
        'Pinkman with a little Supernova for an icy pink lemonade.',
        'Pinkman with Tynky Wynky for a citrusy summer mix.'
      ]
    },
    similar: ['adalya-raspberry', 'sebero-arctic-mix-jelly-fruit', 'adalya-angel-lips', 'musthave-grapefruit']
  },
  {
    id: 'musthave-cola',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Cola',
    mood: 'fizz',
    shortDescription: {
      bs: 'Klasična gazirana kola: slatka i pjenušava, bez leda i bez hlađenja.',
      en: 'Classic fizzy cola: sweet and sparkling, with no ice and no cooling.'
    },
    description: {
      bs: [
        'MUSTHAVE Cola je čista kola: gazirana, slatka i pjenušava. Slatkoća je tu, ali je lakša i "pjenušavija" nego kod Darkside Cole.',
        'Nema leda ni hlađenja, to je sama kola. Ako želiš ledenu kolu, dodaj malo mente ili ledenog okusa u miks.',
        'Tamni list i dosta jak, kao i ostali MUSTHAVE okusi. Ako voliš kolu, uporedi je sa Darkside Colom i Sebero Black Colom.'
      ],
      en: [
        'MUSTHAVE Cola is pure cola: fizzy, sweet and sparkling. The sweetness is there, but lighter and more "sparkling" than in Darkside Cola.',
        'There is no ice and no cooling, just cola. If you want an iced cola, add a little mint or an ice flavor to the mix.',
        'Dark leaf and fairly strong, like the rest of MUSTHAVE. If you love cola, compare it with Darkside Cola and Sebero Black Cola.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kola', en: 'Cola' }, illustration: 'kola', color: '#6a2a16', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 5, fruitiness: 1, cooling: 0, strength: 8 },
    tags: ['pice', 'slatki', 'ljetni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#b0281f', secondary: '#f3ece6', accent: '#ef4b3f', background: '#220c0c', text: '#fbeeee', smoke: ['#ffffff', '#ffe6e3', '#e9c3bd'] },
    mixIdeas: {
      bs: [
        'Cola i Pirate\'s Cave, za kolu sa limetom.',
        'Cola i Mint, 80/20, za kolu sa ledom i mentom.',
        'Cola i Pinkman, za voćnu, ljetnu kolu.'
      ],
      en: [
        'Cola with Pirate\'s Cave for cola with lime.',
        'Cola with Mint, 80/20, for cola on ice with mint.',
        'Cola with Pinkman for a fruity summer cola.'
      ]
    },
    similar: ['darkside-cola', 'sebero-black-cola', 'musthave-cherry-cola', 'starbuzz-pirates-cave']
  },
  {
    id: 'musthave-pineapple-rings',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Pineapple Rings',
    shortDescription: {
      bs: 'Kolutovi ananasa iz konzerve: slatki, sirupasti i jako sočni.',
      en: 'Canned pineapple rings: sweet, syrupy and very juicy.'
    },
    description: {
      bs: [
        'Pineapple Rings je ananas iz konzerve, sa sve slatkim sirupom. Nije oštar i kiseo kao svjež ananas, nego mekan, sladak i sočan.',
        'Okus je jednostavan i jako prepoznatljiv, a blaga kiselost ga drži živim do kraja glave.',
        'Tamni list: pakuj rastresito. Odličan je i u tropskim miksevima.'
      ],
      en: [
        'Pineapple Rings is canned pineapple, syrup and all. Not sharp and sour like fresh pineapple, but soft, sweet and juicy.',
        'It is simple and very recognizable, and a slight tartness keeps it lively to the end of the bowl.',
        'Dark leaf: pack it loose. It also shines in tropical mixes.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f8cf4a', intensity: 9 },
      { name: { bs: 'Šećerni sirup', en: 'Sugar syrup' }, illustration: 'med', color: '#f3c96b', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f8cf4a', secondary: '#fff0a0', accent: '#4caf50', background: '#1f1805', text: '#fffbe2' },
    mixIdeas: {
      bs: [
        'Pineapple Rings i Pinkman, za ananas sa grejpfrutom.',
        'Pineapple Rings i Candy Cow, za karamelizovani ananas.',
        'Pineapple Rings i MUSTHAVE Cola, za tropsku kolu.'
      ],
      en: [
        'Pineapple Rings with Pinkman for pineapple and grapefruit.',
        'Pineapple Rings with Candy Cow for caramelized pineapple.',
        'Pineapple Rings with MUSTHAVE Cola for a tropical cola.'
      ]
    },
    similar: ['haze-pineapple-krush', 'trifecta-pineapple-guava', 'adalya-dubai', 'musthave-tropic-juice']
  },
  {
    id: 'musthave-candy-cow',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Candy Cow',
    shortDescription: {
      bs: 'Karamela, mlijeko i kondenzovano mlijeko, kao poznati bombon "kravica".',
      en: 'Caramel, milk and condensed milk, like the classic "little cow" toffee candy.'
    },
    description: {
      bs: [
        'Candy Cow je okus mliječne karamele, onih mekanih bombona sa kravicom na omotu. Karamela, mlijeko i kondenzovano mlijeko: slatko, kremasto i gusto.',
        'Nema voća ni hlađenja. Okus je gust i desertni, pa ga mnogi koriste u miksevima da "zaobli" voće.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Candy Cow is the flavor of milky caramel, those soft toffees with a cow on the wrapper. Caramel, milk and condensed milk: sweet, creamy and thick.',
        'No fruit and no cooling. It is dense and dessert-like, which is why many people use it in mixes to round off fruit.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Karamel', en: 'Caramel' }, illustration: 'karamel', color: '#b7742f', intensity: 9 },
      { name: { bs: 'Mlijeko', en: 'Milk' }, illustration: 'sejk', color: '#f3ead8', intensity: 6 },
      { name: { bs: 'Kondenzovano mlijeko', en: 'Condensed milk' }, illustration: 'kondenzovano', color: '#3d6fb6', intensity: 6 }
    ],
    profile: { sweetness: 9, freshness: 2, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['desertni', 'slatki', 'bombon'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#c9873e', secondary: '#f3ead8', accent: '#6b3a1a', background: '#1c120a', text: '#fff5e8' },
    mixIdeas: {
      bs: [
        'Candy Cow i Pineapple Rings, za karamelizovani ananas.',
        'Candy Cow i MUSTHAVE Cola, za karamel-kolu.',
        'Candy Cow i Bananapapa, za bananu sa karamelom.'
      ],
      en: [
        'Candy Cow with Pineapple Rings for caramelized pineapple.',
        'Candy Cow with MUSTHAVE Cola for caramel cola.',
        'Candy Cow with Bananapapa for banana and caramel.'
      ]
    },
    similar: ['tangiers-horchata', 'trifecta-peppermint-shake', 'haze-bananarama', 'musthave-paradise']
  },
  {
    id: 'musthave-cherry-cola',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Cherry-Cola',
    mood: 'fizz',
    shortDescription: {
      bs: 'Kola sa višnjom: slatka, gazirana i malo voćna.',
      en: 'Cola with cherry: sweet, fizzy and a little fruity.'
    },
    description: {
      bs: [
        'Cherry-Cola je klasična kola sa jasnom notom višnje, kao poznata višnja-kola iz limenke. Kola daje začinsku, karamelnu osnovu, a višnja voćnu slatkoću.',
        'Okus je gust i dobro izbalansiran: višnja ne pokriva kolu, nego je obogaćuje.',
        'Tamni list: rastresito pakovanje. Uporedi sa običnom MUSTHAVE Colom da osjetiš razliku.'
      ],
      en: [
        'Cherry-Cola is classic cola with a clear cherry note, like the familiar cherry cola in a can. The cola gives a spiced, caramel base and the cherry a fruity sweetness.',
        'It is dense and well balanced: the cherry does not cover the cola, it enriches it.',
        'Dark leaf: pack it loose. Compare it with the plain MUSTHAVE Cola to taste the difference.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kola', en: 'Cola' }, illustration: 'kola', color: '#3e1a0e', intensity: 8 },
      { name: { bs: 'Višnja', en: 'Cherry' }, illustration: 'visnja', color: '#a3122a', intensity: 7 }
    ],
    profile: { sweetness: 8, freshness: 5, fruitiness: 5, cooling: 0, strength: 7 },
    tags: ['pice', 'slatki', 'vocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#8a1a2a', secondary: '#c28a54', accent: '#ff6a7a', background: '#140608', text: '#fbeaea', smoke: ['#fff0f0', '#e0b0a8', '#a86a60'] },
    mixIdeas: {
      bs: [
        'Cherry-Cola i Candy Cow, za kolu sa karamelom.',
        'Cherry-Cola i Supernova, 85/15, za ledenu višnja-kolu.',
        'Cherry-Cola i Pineapple Rings, za tropsku kolu.'
      ],
      en: [
        'Cherry-Cola with Candy Cow for cola with caramel.',
        'Cherry-Cola with Supernova, 85/15, for an icy cherry cola.',
        'Cherry-Cola with Pineapple Rings for a tropical cola.'
      ]
    },
    similar: ['musthave-cola', 'darkside-cola', 'tangiers-maraschino-cherry', 'sebero-black-amarena-cherry']
  },
  // ---- MUSTHAVE linija (okusi i službene note sa musthave.ru) ----
  {
    id: 'musthave-watermelon',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Watermelon',
    shortDescription: {
      bs: 'Zrela, sočna lubenica, umjereno slatka, kao vruć ljetni dan.',
      en: 'Ripe, juicy watermelon, moderately sweet, like a hot summer day.'
    },
    description: {
      bs: [
        'Watermelon je čista lubenica sa bostana: zrela, sočna i slatka taman koliko treba, bez šećerne napadnosti.',
        'Nema mente ni leda, pa je okus prirodan i mekan. Dobra je baza za ljetne mikseve.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Watermelon is pure field-grown watermelon: ripe, juicy and just sweet enough, never sugary.',
        'There is no mint or ice, so it tastes natural and soft. A good base for summer mixes.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8455a', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 7, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'ljetni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#e8455a', secondary: '#f08694', accent: '#f5abb5', background: '#2e1113', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Watermelon i Sweet Melon, za dinju i lubenicu zajedno.',
        'Watermelon i Ice Mint, za ljetni miks sa hlađenjem.'
      ],
      en: [
        'Watermelon and Sweet Melon, for melon and watermelon together.',
        'Watermelon and Ice Mint, for a cool summer bowl.'
      ]
    },
    similar: ['musthave-sweet-melon', 'musthave-melonade', 'al-fakher-watermelon-mint', 'serbetli-ice-watermelon']
  },
  {
    id: 'musthave-sweet-melon',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Sweet Melon',
    shortDescription: {
      bs: 'Sočna, mirisna ljetna dinja, zrela i nježno slatka.',
      en: 'Juicy, fragrant summer melon, ripe and gently sweet.'
    },
    description: {
      bs: [
        'Sweet Melon je zrela mošusna dinja: mirisna, sočna i nježna, sa onom medenom slatkoćom koju dinja ima tek kad je baš zrela.',
        'Okus je profinjen i ne umara, pa se lako puši sam ili kao baza za voćne mikseve.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Sweet Melon is ripe musk melon: fragrant, juicy and delicate, with the honeyed sweetness melon only has when it is perfectly ripe.',
        'It is refined and easy going, so it works well on its own or as a base for fruit mixes.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Dinja', en: 'Melon' }, illustration: 'dinja', color: '#f5b04a', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'ljetni', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f5b04a', secondary: '#f9cc89', accent: '#fbdbae', background: '#302210', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Sweet Melon i Watermelon, za ljetni bostan.',
        'Sweet Melon i Sweet Peach, za mekan i sočan miks.'
      ],
      en: [
        'Sweet Melon and Watermelon, for a summer melon patch.',
        'Sweet Melon and Sweet Peach, for a soft, juicy bowl.'
      ]
    },
    similar: ['musthave-watermelon', 'musthave-melonade', 'adalya-double-melon', 'starbuzz-safari-melon-dew']
  },
  {
    id: 'musthave-sweet-peach',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Sweet Peach',
    shortDescription: {
      bs: 'Intenzivna, sočna i slatka zrela breskva.',
      en: 'Intense, juicy and sweet ripe peach.'
    },
    description: {
      bs: [
        'Sweet Peach je breskva u punoj zrelosti: sočna, slatka i jaka, kao kad zagrizeš plod koji tek što je pao sa grane.',
        'Okus je jednostavan i jasan, bez začina i hlađenja, pa se odlično slaže sa čajem i citrusima.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Sweet Peach is peach at full ripeness: juicy, sweet and bold, like biting into fruit that just fell from the tree.',
        'It is simple and clear, with no spice and no cooling, and pairs very well with tea and citrus.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ff9a5a', intensity: 9 }
    ],
    profile: { sweetness: 8, freshness: 5, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'slatki', 'ljetni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ff9a5a', secondary: '#ffbd94', accent: '#ffd2b5', background: '#321f13', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Sweet Peach i Earl Grey, za ledeni čaj od breskve.',
        'Sweet Peach i Mandarin, za sunčan voćni miks.'
      ],
      en: [
        'Sweet Peach and Earl Grey, for a peach iced tea.',
        'Sweet Peach and Mandarin, for a sunny fruit bowl.'
      ]
    },
    similar: ['musthave-sweet-melon', 'tangiers-kashmir-peach', 'musthave-mandarin', 'tangiers-juicy-peach']
  },
  {
    id: 'musthave-strawberry',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Strawberry',
    shortDescription: {
      bs: 'Zrela vrtna jagoda, slatka sa blagom kiselinom na kraju.',
      en: 'Ripe garden strawberry, sweet with a light tang at the end.'
    },
    description: {
      bs: [
        'Strawberry je zrela vrtna jagoda bogatog mirisa. Na početku je slatka, a na kraju ostavi blagu kiselinu, kao prava jagoda.',
        'Klasičan voćni okus koji se lako kombinuje: sa mentom, citrusima, kremom ili drugim bobicama.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Strawberry is a ripe garden strawberry with a rich aroma. It starts sweet and leaves a light tang at the end, just like the real fruit.',
        'A classic fruit flavor that mixes easily: with mint, citrus, cream or other berries.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e63946', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#e63946', secondary: '#ef7e87', accent: '#f4a6ac', background: '#2e0f0f', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Strawberry i Ice Cream, za jagode sa sladoledom.',
        'Strawberry i Lemon-Lime, za kiselkastu limunadu od jagode.'
      ],
      en: [
        'Strawberry and Ice Cream, for strawberries and ice cream.',
        'Strawberry and Lemon-Lime, for a tangy strawberry lemonade.'
      ]
    },
    similar: ['musthave-strawberry-lychee', 'musthave-raspberry', 'trifecta-blue-strawberry', 'musthave-rocketman']
  },
  {
    id: 'musthave-strawberry-lychee',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Strawberry Lychee',
    shortDescription: {
      bs: 'Zrela šumska jagoda i egzotični liči, baršunasto slatki.',
      en: 'Ripe wild strawberry and exotic lychee, velvety and sweet.'
    },
    description: {
      bs: [
        'Strawberry Lychee spaja zrelu šumsku jagodu koja se topi u ustima i egzotični liči. Kombinacija je baršunasta i slatka.',
        'Liči daje cvjetnu, sočnu notu, a jagoda drži okus poznatim. Mekan, ženstven voćni okus.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Strawberry Lychee brings together ripe wild strawberry that melts in your mouth and exotic lychee. The combination is velvety and sweet.',
        'Lychee adds a floral, juicy note while the strawberry keeps it familiar. A soft, elegant fruit flavor.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Šumska jagoda', en: 'Wild strawberry' }, illustration: 'jagoda', color: '#e0384f', intensity: 8 },
      { name: { bs: 'Liči', en: 'Lychee' }, illustration: 'lici', color: '#d8344a', intensity: 7 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'tropski', 'bobicasti'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#e0384f', secondary: '#d8344a', accent: '#f1a5b0', background: '#2d0f11', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Strawberry Lychee i Prosecco, za voćni pjenušac.',
        'Strawberry Lychee i Space Flavour, za još egzotičniji miks.'
      ],
      en: [
        'Strawberry Lychee and Prosecco, for a fruity sparkling bowl.',
        'Strawberry Lychee and Space Flavour, for an even more exotic mix.'
      ]
    },
    similar: ['musthave-strawberry', 'musthave-space-flavour', 'musthave-pinkman', 'musthave-strawberry-sorbet']
  },
  {
    id: 'musthave-raspberry',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Raspberry',
    shortDescription: {
      bs: 'Bogat, prirodno sladak okus domaćeg džema od malina.',
      en: 'The rich, naturally sweet taste of homemade raspberry jam.'
    },
    description: {
      bs: [
        'Raspberry je malina, ali ne svježa sa grma, nego kuhana: kao domaći džem od malina, gust, sladak i bogat.',
        'Ima i blagu kiselinu maline, pa nije pretežak. Odličan je uz kremaste i desertne okuse.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Raspberry is raspberry, not fresh off the bush but cooked: like homemade raspberry jam, thick, sweet and rich.',
        'It keeps a little of the raspberry tartness, so it never feels heavy. Excellent with creamy and dessert flavors.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#d61f5b', intensity: 9 },
      { name: { bs: 'Džem', en: 'Jam' }, illustration: 'dzem', color: '#b0103a', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 4, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#d61f5b', secondary: '#b0103a', accent: '#ed9ab5', background: '#2b0b13', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Raspberry i Vanilla Cream, za malinu sa kremom.',
        'Raspberry i Cheesecake, za kolač sa preljevom od maline.'
      ],
      en: [
        'Raspberry and Vanilla Cream, for raspberries and cream.',
        'Raspberry and Cheesecake, for cheesecake with raspberry topping.'
      ]
    },
    similar: ['musthave-forest-berries', 'musthave-strawberry', 'adalya-raspberry', 'darkside-generis-raspberry']
  },
  {
    id: 'musthave-blackberry',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Blackberry',
    shortDescription: {
      bs: 'Pun, opojan miris zrele kupine sa južnog sunca.',
      en: 'The full, heady aroma of ripe blackberries from the southern sun.'
    },
    description: {
      bs: [
        'Blackberry je zrela kupina koja je dugo stajala na suncu: puna, tamna, slatka i pomalo opojna.',
        'Ima dubinu koju svježe bobice nemaju. Lijepo se slaže sa mentom, limunom i kremom.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Blackberry is a ripe blackberry left to bask in the sun: full, dark, sweet and a little heady.',
        'It has a depth that fresh berries lack. Works nicely with mint, lemon and cream.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kupina', en: 'Blackberry' }, illustration: 'kupina', color: '#3b1a3f', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 4, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'bobicasti'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#3b1a3f', secondary: '#806a82', accent: '#a798a9', background: '#130a0e', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Blackberry i Lemon-Lime, za kupinu sa citrusom.',
        'Blackberry i Ice Mint, za tamne bobice sa hlađenjem.'
      ],
      en: [
        'Blackberry and Lemon-Lime, for blackberry with citrus.',
        'Blackberry and Ice Mint, for dark berries with a chill.'
      ]
    },
    similar: ['musthave-forest-berries', 'musthave-blueberry', 'darkside-wild-forest', 'musthave-black-currant']
  },
  {
    id: 'musthave-blueberry',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Blueberry',
    shortDescription: {
      bs: 'Sočna borovnica sa bobičastim ukusom i notom jogurta na kraju.',
      en: 'Juicy blueberry with a berry finish and a hint of yogurt.'
    },
    description: {
      bs: [
        'Blueberry je sočna borovnica koja na kraju ostavlja prijatan bobičast ukus i blagu notu jogurta.',
        'Ta kremasta nota ga čini mekšim od obične borovnice, pa podsjeća na voćni jogurt.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Blueberry is a juicy blueberry that leaves a pleasant berry aftertaste with a light hint of yogurt.',
        'That creamy note makes it softer than a plain blueberry, a bit like a fruit yogurt.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4a5fc1', intensity: 9 },
      { name: { bs: 'Jogurt', en: 'Yogurt' }, illustration: 'sejk', color: '#f6f1e6', intensity: 3 }
    ],
    profile: { sweetness: 7, freshness: 4, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#4a5fc1', secondary: '#f6f1e6', accent: '#aeb7e3', background: '#151523', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Blueberry i Vanilla Cream, za borovnicu sa kremom.',
        'Blueberry i Lemon-Lime, za kiselkastu borovnicu.'
      ],
      en: [
        'Blueberry and Vanilla Cream, for blueberries and cream.',
        'Blueberry and Lemon-Lime, for a tangy blueberry.'
      ]
    },
    similar: ['musthave-forest-berries', 'musthave-blackberry', 'al-fakher-blueberry', 'serbetli-ice-blueberry']
  },
  {
    id: 'musthave-black-currant',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Black Currant',
    shortDescription: {
      bs: 'Jarka, sočna crna ribizla, kao tek ubrana sa grma.',
      en: 'Bright, juicy black currant, as if just picked from the bush.'
    },
    description: {
      bs: [
        'Black Currant je crna ribizla iz bašte, tek ubrana: sočna, jarka i pomalo opora.',
        'Okus je dubok i bobičast, sa onom specifičnom ribizlom koju je teško zamijeniti. Dobra je uz citruse i mentu.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Black Currant is garden black currant, freshly picked: juicy, bright and slightly tart.',
        'It is deep and berry-like, with that distinctive currant character. Pairs well with citrus and mint.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crna ribizla', en: 'Black currant' }, illustration: 'grozdic', color: '#2a1630', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 5, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'bobicasti'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#2a1630', secondary: '#756878', accent: '#9f96a2', background: '#10090c', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Black Currant i Mandarin, za ribizlu i citrus.',
        'Black Currant i Ice Mint, za bobice sa hlađenjem.'
      ],
      en: [
        'Black Currant and Mandarin, for currant and citrus.',
        'Black Currant and Ice Mint, for berries with a chill.'
      ]
    },
    similar: ['musthave-forest-berries', 'musthave-elderberry', 'musthave-blackberry', 'musthave-gooseberry']
  },
  {
    id: 'musthave-forest-berries',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Forest Berries',
    shortDescription: {
      bs: 'Baršunasta mješavina šumskih bobica, sa naglašenom kupinom.',
      en: 'A velvety blend of forest berries with a clear blackberry note.'
    },
    description: {
      bs: [
        'Forest Berries je mješavina svježeg šumskog voća: kupine, maline i borovnice. U okusu se najjače osjeti kupina.',
        'Baršunast, bobičast okus, ni previše sladak ni kiseo. Siguran izbor za ljubitelje bobica.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Forest Berries is a blend of fresh forest fruit: blackberry, raspberry and blueberry. Blackberry comes through the most.',
        'Velvety and berry-forward, neither too sweet nor too sour. A safe pick for berry lovers.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kupina', en: 'Blackberry' }, illustration: 'kupina', color: '#3b1a3f', intensity: 8 },
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#d61f5b', intensity: 6 },
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4a5fc1', intensity: 5 }
    ],
    profile: { sweetness: 6, freshness: 5, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'bobicasti'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#3b1a3f', secondary: '#d61f5b', accent: '#4a5fc1', background: '#130a0e', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Forest Berries i Vanilla Cream, za šumsko voće sa kremom.',
        'Forest Berries i Frosty, za bobice sa hladnim dahom.'
      ],
      en: [
        'Forest Berries and Vanilla Cream, for forest fruit with cream.',
        'Forest Berries and Frosty, for berries with a cold breath.'
      ]
    },
    similar: ['musthave-blackberry', 'musthave-blueberry', 'musthave-raspberry', 'darkside-wild-forest']
  },
  {
    id: 'musthave-gooseberry',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Gooseberry',
    shortDescription: {
      bs: 'Zreli ogrozd, pomalo opor i kiselkast, kao pravi.',
      en: 'Ripe gooseberry, a little astringent and tart, just like the real thing.'
    },
    description: {
      bs: [
        'Gooseberry je zreo ogrozd sa svim što ga čini posebnim: blago oporim, gustim osjećajem i kiselinom.',
        'Nije običan slatki voćni okus. Za one koji vole kiselkasto i drugačije.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Gooseberry is ripe gooseberry with everything that makes it special: a slightly astringent, thick feel and a clear sourness.',
        'This is not a typical sweet fruit flavor. For people who like tart and different.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ogrozd', en: 'Gooseberry' }, illustration: 'ogrozd', color: '#9cc94a', intensity: 9 }
    ],
    profile: { sweetness: 4, freshness: 7, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'bobicasti', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#9cc94a', secondary: '#bfdc89', accent: '#d2e7ae', background: '#222610', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Gooseberry i Feijoa, za kiselkasto zeleno voće.',
        'Gooseberry i Strawberry, da jagoda ublaži kiselinu.'
      ],
      en: [
        'Gooseberry and Feijoa, for tart green fruit.',
        'Gooseberry and Strawberry, to soften the sourness.'
      ]
    },
    similar: ['musthave-feijoa', 'musthave-cranberry', 'musthave-black-currant']
  },
  {
    id: 'musthave-cranberry',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Cranberry',
    shortDescription: {
      bs: 'Opora, profinjena sjeverna brusnica iz divljih šuma.',
      en: 'Tart, refined northern cranberry from wild forests.'
    },
    description: {
      bs: [
        'Cranberry je divlja sjeverna brusnica: opora, kiselkasta i profinjena, sa malo slatkoće.',
        'Okus je suh i osvježavajući, pa dobro razbija slatke i kremaste okuse u miksu.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Cranberry is wild northern cranberry: tart, sour and refined, with just a little sweetness.',
        'It is dry and refreshing, so it cuts nicely through sweet and creamy flavors in a mix.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Brusnica', en: 'Cranberry' }, illustration: 'bobice', color: '#c8102e', intensity: 9 }
    ],
    profile: { sweetness: 4, freshness: 7, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'bobicasti', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#c8102e', secondary: '#db6477', accent: '#e693a1', background: '#29080c', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Cranberry i Vanilla Cream, za brusnicu sa kremom.',
        'Cranberry i Orange Team, za zimski voćni miks.'
      ],
      en: [
        'Cranberry and Vanilla Cream, for cranberry with cream.',
        'Cranberry and Orange Team, for a winter fruit bowl.'
      ]
    },
    similar: ['musthave-gooseberry', 'musthave-berry-mors', 'musthave-elderberry', 'musthave-red-bomb']
  },
  {
    id: 'musthave-elderberry',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Elderberry',
    shortDescription: {
      bs: 'Slatkasta, opora bazga sa laganom kiselinom.',
      en: 'Sweet and tart elderberry with a light sourness.'
    },
    description: {
      bs: [
        'Elderberry je bazga: tamne bobice slatkastog, opornog okusa sa laganom kiselinom.',
        'Okus je pomalo cvjetan i drugačiji od uobičajenih bobica. Lijepo se slaže sa citrusima i pjenušavim okusima.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Elderberry is elder: dark berries with a sweet, tart taste and a light sourness.',
        'It is a little floral and different from the usual berries. Lovely with citrus and sparkling flavors.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Bazga', en: 'Elderberry' }, illustration: 'grozdic', color: '#3a1f4a', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 6, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'bobicasti'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#3a1f4a', secondary: '#7f6d89', accent: '#a69aae', background: '#130b10', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Elderberry i Prosecco, za pjenušac sa bazgom.',
        'Elderberry i Lemon-Lime, za limunadu od bazge.'
      ],
      en: [
        'Elderberry and Prosecco, for an elderflower-style spritz.',
        'Elderberry and Lemon-Lime, for an elderberry lemonade.'
      ]
    },
    similar: ['musthave-black-currant', 'musthave-cranberry', 'musthave-forest-berries']
  },
  {
    id: 'musthave-banana-mama',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Banana Mama',
    shortDescription: {
      bs: 'Sladak, bogat miris zrele južnoameričke banane.',
      en: 'The sweet, rich aroma of ripe South American banana.'
    },
    description: {
      bs: [
        'Banana Mama je zrela južnoamerička banana: slatka, bogata i mekana, bez zelene opore note.',
        'Okus je pun i desertni, pa se lako spaja sa karamelom, čokoladom i mlijekom.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Banana Mama is ripe South American banana: sweet, rich and soft, without any green bitterness.',
        'It is full and dessert-like, so it pairs easily with caramel, chocolate and milk.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Zrela banana', en: 'Ripe banana' }, illustration: 'banana', color: '#f5d33c', intensity: 9 }
    ],
    profile: { sweetness: 8, freshness: 3, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f5d33c', secondary: '#f9e280', accent: '#fbeba7', background: '#30280e', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Banana Mama i Candy Cow, za bananu sa karamelom.',
        'Banana Mama i Cacao, za čokoladnu bananu.'
      ],
      en: [
        'Banana Mama and Candy Cow, for banana with caramel.',
        'Banana Mama and Cacao, for chocolate banana.'
      ]
    },
    similar: ['musthave-paradise', 'darkside-bananapapa', 'haze-bananarama', 'al-fakher-banana']
  },
  {
    id: 'musthave-mandarin',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Mandarin',
    shortDescription: {
      bs: 'Slatke, tople kriške mandarine.',
      en: 'Sweet, warming slices of mandarin.'
    },
    description: {
      bs: [
        'Mandarin je kriška zrele mandarine: slatka, sočna i mirisna, sa toplim citrusnim tonom.',
        'Mekša je od narandže i manje kisela od limuna, pa je lagana za pušenje i dobra za mikseve.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Mandarin is a slice of ripe mandarin: sweet, juicy and fragrant, with a warm citrus tone.',
        'It is softer than orange and less sour than lemon, so it smokes easily and mixes well.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mandarina', en: 'Mandarin' }, illustration: 'narandza', color: '#ff8c1a', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'citrusni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ff8c1a', secondary: '#ffb46a', accent: '#ffcb98', background: '#321c08', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Mandarin i Earl Grey, za čaj sa mandarinom.',
        'Mandarin i Cinnamon, za zimski citrus.'
      ],
      en: [
        'Mandarin and Earl Grey, for tea with mandarin.',
        'Mandarin and Cinnamon, for a winter citrus bowl.'
      ]
    },
    similar: ['musthave-orange-team', 'musthave-grapefruit', 'musthave-sweet-peach']
  },
  {
    id: 'musthave-orange-team',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Orange Team',
    shortDescription: {
      bs: 'Prirodna slatko-kisela kombinacija narandže i mandarine.',
      en: 'A natural sweet and sour combination of orange and mandarin.'
    },
    description: {
      bs: [
        'Orange Team je tim od dva citrusa: narandža daje sok i kiselinu, a mandarina slatkoću i miris.',
        'Rezultat je jasan, prirodan narandžast okus, kao svježe ceđeni sok.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Orange Team is a team of two citrus fruits: orange brings juice and tang, mandarin brings sweetness and aroma.',
        'The result is a clear, natural orange flavor, like freshly squeezed juice.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff7a00', intensity: 8 },
      { name: { bs: 'Mandarina', en: 'Mandarin' }, illustration: 'narandza', color: '#ffa53a', intensity: 7 }
    ],
    profile: { sweetness: 6, freshness: 7, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'citrusni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ff7a00', secondary: '#ffa53a', accent: '#ffc38c', background: '#321904', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Orange Team i Cola, za kolu sa narandžom.',
        'Orange Team i Vanilla Cream, za narandžasti krem.'
      ],
      en: [
        'Orange Team and Cola, for cola with orange.',
        'Orange Team and Vanilla Cream, for an orange creamsicle.'
      ]
    },
    similar: ['musthave-mandarin', 'musthave-grapefruit', 'tangiers-orange-soda', 'musthave-citrus-spritz']
  },
  {
    id: 'musthave-grapefruit',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Grapefruit',
    shortDescription: {
      bs: 'Slatko-kisela mješavina narandžastog i roze grejpfruta.',
      en: 'A sweet and sour mix of orange and pink grapefruit.'
    },
    description: {
      bs: [
        'Grapefruit spaja dvije vrste grejpfruta, narandžasti i roze. Slatko-kiseo je, sa onom laganom gorčinom kore.',
        'Osvježava i čisti nepce, pa je dobar i sam i kao kiselkasti dodatak slatkim okusima.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Grapefruit combines two kinds of grapefruit, orange and pink. It is sweet and sour, with that light bitterness of the peel.',
        'It refreshes and cleans the palate, great on its own or as a tangy addition to sweet flavors.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Roze grejpfrut', en: 'Pink grapefruit' }, illustration: 'grejpfrut', color: '#f26b6b', intensity: 8 },
      { name: { bs: 'Grejpfrut', en: 'Grapefruit' }, illustration: 'grejpfrut', color: '#ff9a3c', intensity: 7 }
    ],
    profile: { sweetness: 5, freshness: 8, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'citrusni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f26b6b', secondary: '#ff9a3c', accent: '#f9bcbc', background: '#301715', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Grapefruit i Raspberry, za roze limunadu.',
        'Grapefruit i Lemon Tonic, za gorko-kiseli koktel.'
      ],
      en: [
        'Grapefruit and Raspberry, for a pink lemonade.',
        'Grapefruit and Lemon Tonic, for a bitter-sour cocktail.'
      ]
    },
    similar: ['musthave-pinkman', 'musthave-orange-team', 'musthave-lemon-lime', 'musthave-mandarin']
  },
  {
    id: 'musthave-lemon-lime',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Lemon-Lime',
    shortDescription: {
      bs: 'Kiselo-slatki citrus: zrela limeta i sočne kriške sicilijanskog limuna.',
      en: 'Sweet and sour citrus: ripe lime and juicy wedges of Sicilian lemon.'
    },
    description: {
      bs: [
        'Lemon-Lime je citrusni miks od zrele limete i sočnih kriški sicilijanskog limuna. Kiselo-sladak je i vrlo svjež.',
        'Limeta daje oštrinu, a limun sok i miris. Čest dodatak voćnim miksevima.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Lemon-Lime is a citrus mix of ripe lime and juicy wedges of Sicilian lemon. Sweet and sour, and very fresh.',
        'Lime brings the sharpness, lemon the juice and aroma. A common addition to fruit mixes.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#7cc242', intensity: 8 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7d84a', intensity: 8 }
    ],
    profile: { sweetness: 5, freshness: 9, fruitiness: 7, cooling: 0, strength: 7 },
    tags: ['citrusni', 'osvjezavajuci', 'ljetni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#7cc242', secondary: '#f7d84a', accent: '#c4e4aa', background: '#1d250f', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Lemon-Lime i Strawberry, za limunadu od jagode.',
        'Lemon-Lime i Ice Mint, za mohito bez alkohola.'
      ],
      en: [
        'Lemon-Lime and Strawberry, for a strawberry lemonade.',
        'Lemon-Lime and Ice Mint, for a virgin mojito.'
      ]
    },
    similar: ['musthave-grapefruit', 'adalya-lemon-cocktail', 'fumari-lemon-mint', 'musthave-lemon-tonic']
  },
  {
    id: 'musthave-mad-pear',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Mad Pear',
    shortDescription: {
      bs: 'Intenzivan, sladak nektar od mirisne kruške.',
      en: 'Intense, sweet nectar of fragrant pear.'
    },
    description: {
      bs: [
        'Mad Pear je sok od kruške, gust i sladak kao nektar. Miris je jak, a okus mekan i sočan.',
        'Kruška je nježnija od jabuke i lijepo se spaja sa čajem, karamelom i biljem.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Mad Pear is pear juice, thick and sweet like nectar. The aroma is strong and the taste soft and juicy.',
        'Pear is gentler than apple and pairs beautifully with tea, caramel and herbs.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kruška', en: 'Pear' }, illustration: 'kruska', color: '#d4c64a', intensity: 9 }
    ],
    profile: { sweetness: 8, freshness: 5, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#d4c64a', secondary: '#e3da89', accent: '#ece5ae', background: '#2b2610', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Mad Pear i Estragon, za krušku sa tarhunom.',
        'Mad Pear i Candy Cow, za karamelizovanu krušku.'
      ],
      en: [
        'Mad Pear and Estragon, for pear with tarragon.',
        'Mad Pear and Candy Cow, for caramelised pear.'
      ]
    },
    similar: ['sebero-green-pear', 'musthave-quince', 'musthave-pear-lemon-tarragon']
  },
  {
    id: 'musthave-tropic-juice',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Tropic Juice',
    shortDescription: {
      bs: 'Bogata mješavina ananasa i zrele egzotične marakuje.',
      en: 'A rich blend of pineapple and ripe exotic passion fruit.'
    },
    description: {
      bs: [
        'Tropic Juice je tropski sok od ananasa i zrele marakuje. Neobično bogat, sladak i sočan.',
        'Marakuja daje kiselkast, mirisni vrh, a ananas punoću. Okus ljeta i plaže.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Tropic Juice is a tropical juice of pineapple and ripe passion fruit. Unusually rich, sweet and juicy.',
        'Passion fruit adds a tangy, fragrant top note and pineapple the body. Summer and beach in a bowl.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f5c542', intensity: 8 },
      { name: { bs: 'Marakuja', en: 'Passion fruit' }, illustration: 'marakuja', color: '#8a3f8f', intensity: 8 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 10, cooling: 0, strength: 7 },
    tags: ['vocni', 'tropski', 'ljetni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f5c542', secondary: '#8a3f8f', accent: '#fbe5aa', background: '#30250f', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Tropic Juice i Coconut Shake, za pina coladu bez alkohola.',
        'Tropic Juice i Frosty, za ledeni tropski sok.'
      ],
      en: [
        'Tropic Juice and Coconut Shake, for a virgin pina colada.',
        'Tropic Juice and Frosty, for an iced tropical juice.'
      ]
    },
    similar: ['musthave-pineapple-rings', 'trifecta-pineapple-guava', 'musthave-space-flavour', 'musthave-mango-sling']
  },
  {
    id: 'musthave-cream-soda',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Cream Soda',
    shortDescription: {
      bs: 'Kremasti gazirani sok sa nježnom notom vanile.',
      en: 'A creamy soda with a delicate hint of vanilla.'
    },
    description: {
      bs: [
        'Cream Soda je omiljeni gazirani sok u kremastoj verziji: pjenušav, sladak i mekan, sa nježnom vanilom.',
        'Podsjeća na sok sa kuglom sladoleda. Lagan i desertni u isto vrijeme.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Cream Soda is a favorite fizzy drink in its creamy version: sparkling, sweet and smooth, with delicate vanilla.',
        'It is like soda with a scoop of ice cream. Light and dessert-like at the same time.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Gazirani sok', en: 'Soda' }, illustration: 'kola', color: '#e9c27a', intensity: 8 },
      { name: { bs: 'Vanila', en: 'Vanilla' }, illustration: 'vanila', color: '#f3e2b3', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 5, fruitiness: 1, cooling: 0, strength: 7 },
    tags: ['pice', 'slatki', 'desertni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#e9c27a', secondary: '#f3e2b3', accent: '#f5e4c3', background: '#2f2518', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Cream Soda i Cherry Juice, za višnja sodu sa kremom.',
        'Cream Soda i Raspberry, za malina sodu.'
      ],
      en: [
        'Cream Soda and Cherry Juice, for a creamy cherry soda.',
        'Cream Soda and Raspberry, for a raspberry soda.'
      ]
    },
    similar: ['musthave-cola', 'musthave-vanilla-cream', 'musthave-fizzy-dizzy']
  },
  {
    id: 'musthave-lemon-tonic',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Lemon Tonic',
    shortDescription: {
      bs: 'Gazirano piće od kiselog limuna sa notom gorkog bitera.',
      en: 'A fizzy drink of sour lemon with a hint of bitter tonic.'
    },
    description: {
      bs: [
        'Lemon Tonic je gazirani limun sa tonikom: kiseo, pjenušav i sa laganom gorčinom bitera na kraju.',
        'Kiselina i gorčina su dobro izbalansirani, pa okus osvježava, a ne grize.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Lemon Tonic is fizzy lemon with tonic: sour, sparkling and with a light bitter edge at the end.',
        'The sourness and bitterness are well balanced, so it refreshes rather than bites.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7d84a', intensity: 9 },
      { name: { bs: 'Tonik', en: 'Tonic' }, illustration: 'kola', color: '#dff0e6', intensity: 6 }
    ],
    profile: { sweetness: 4, freshness: 9, fruitiness: 6, cooling: 0, strength: 7 },
    tags: ['pice', 'citrusni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#f7d84a', secondary: '#dff0e6', accent: '#fbedae', background: '#312810', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Lemon Tonic i Grapefruit, za gorko-kiseli koktel.',
        'Lemon Tonic i Yolka, za džin i tonik sa četinama.'
      ],
      en: [
        'Lemon Tonic and Grapefruit, for a bitter-sour cocktail.',
        'Lemon Tonic and Yolka, for a piney gin and tonic.'
      ]
    },
    similar: ['musthave-lemon-lime', 'musthave-lemongrass', 'musthave-grapefruit', 'musthave-citrus-spritz']
  },
  {
    id: 'musthave-fizzy-dizzy',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Fizzy Dizzy',
    shortDescription: {
      bs: 'Pjenušavo piće sa slatko-kiselom notom žutike.',
      en: 'A sparkling drink with sweet and sour barberry notes.'
    },
    description: {
      bs: [
        'Fizzy Dizzy je gazirano piće sa sirupom od žutike (barberry): pjenušavo, slatko-kiselo i pomalo bombonasto.',
        'Žutika je kisela crvena bobica koja daje živ, osvježavajući ukus. Okus podsjeća na limunadu iz djetinjstva.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Fizzy Dizzy is a sparkling drink with barberry syrup: fizzy, sweet and sour, a little candy-like.',
        'Barberry is a sour red berry that gives a lively, refreshing taste. It recalls a childhood lemonade.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Gazirani sok', en: 'Soda' }, illustration: 'kola', color: '#f2a0b4', intensity: 7 },
      { name: { bs: 'Žutika', en: 'Barberry' }, illustration: 'grozdic', color: '#d1213b', intensity: 8 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 6, cooling: 0, strength: 7 },
    tags: ['pice', 'bombon', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#f2a0b4', secondary: '#d1213b', accent: '#f9d4dd', background: '#301f21', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Fizzy Dizzy i Lemon-Lime, za kiseliju limunadu.',
        'Fizzy Dizzy i Frosty, za ledeno piće.'
      ],
      en: [
        'Fizzy Dizzy and Lemon-Lime, for a sharper lemonade.',
        'Fizzy Dizzy and Frosty, for an iced drink.'
      ]
    },
    similar: ['musthave-barberry-candy', 'musthave-melonade', 'musthave-cream-soda', 'musthave-rocketman']
  },
  {
    id: 'musthave-rocketman',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Rocketman',
    shortDescription: {
      bs: 'Jarka soda od jagode sa kriškama kivija i grejpfruta.',
      en: 'Bright strawberry soda with kiwi and grapefruit slices.'
    },
    description: {
      bs: [
        'Rocketman je soda od jagode u koju su ubačene kriške kivija i grejpfruta. Jarka, osvježavajuća i pjenušava.',
        'Jagoda daje slatkoću, kivi kiselinu, a grejpfrut onu laganu gorčinu koja okus drži svježim.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Rocketman is a strawberry soda with slices of kiwi and grapefruit dropped in. Bright, refreshing and fizzy.',
        'Strawberry brings sweetness, kiwi the tang and grapefruit a slight bitterness that keeps it fresh.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Soda od jagode', en: 'Strawberry soda' }, illustration: 'kola', color: '#ff5a7a', intensity: 8 },
      { name: { bs: 'Kivi', en: 'Kiwi' }, illustration: 'kivi', color: '#7cbf3a', intensity: 6 },
      { name: { bs: 'Grejpfrut', en: 'Grapefruit' }, illustration: 'grejpfrut', color: '#f26b6b', intensity: 5 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['pice', 'vocni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#ff5a7a', secondary: '#7cbf3a', accent: '#f26b6b', background: '#321418', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Rocketman i Ice Mint, za ledenu sodu.',
        'Rocketman i Watermelon, za ljetni koktel.'
      ],
      en: [
        'Rocketman and Ice Mint, for an icy soda.',
        'Rocketman and Watermelon, for a summer cocktail.'
      ]
    },
    similar: ['musthave-strawberry', 'musthave-kiwi-smoothie', 'musthave-fizzy-dizzy']
  },
  {
    id: 'musthave-melonade',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Melonade',
    shortDescription: {
      bs: 'Limunada od soka lubenice, kriški dinje i sirupa od žutike.',
      en: 'Lemonade made with watermelon juice, melon slices and barberry syrup.'
    },
    description: {
      bs: [
        'Melonade je jarka limunada na bazi soka od lubenice, sa kriškama zrele dinje i sirupom od žutike.',
        'Bostan daje sočnu slatkoću, a žutika kiselkastu notu. Savršen ljetni okus.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Melonade is a bright lemonade based on watermelon juice, with slices of ripe melon and barberry syrup.',
        'The melons bring juicy sweetness and barberry a tangy note. A perfect summer flavor.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8455a', intensity: 8 },
      { name: { bs: 'Dinja', en: 'Melon' }, illustration: 'dinja', color: '#f5b04a', intensity: 6 },
      { name: { bs: 'Žutika', en: 'Barberry' }, illustration: 'grozdic', color: '#d1213b', intensity: 5 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['pice', 'vocni', 'ljetni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#e8455a', secondary: '#f5b04a', accent: '#d1213b', background: '#2e1113', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Melonade i Ice Mint, za ledenu limunadu.',
        'Melonade i Strawberry, za bostan sa jagodom.'
      ],
      en: [
        'Melonade and Ice Mint, for an icy lemonade.',
        'Melonade and Strawberry, for melons with strawberry.'
      ]
    },
    similar: ['musthave-watermelon', 'musthave-sweet-melon', 'musthave-fizzy-dizzy', 'musthave-strawberry-lemon-watermelon']
  },
  {
    id: 'musthave-cucunade',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Cucunade',
    shortDescription: {
      bs: 'Limunada od sirupa krastavca, svježeg limuna i listića peperminta.',
      en: 'Lemonade with cucumber syrup, fresh lemon wedges and peppermint leaves.'
    },
    description: {
      bs: [
        'Cucunade je svježa, jarka limunada od sirupa krastavca, sa kriškama limuna i listićima peperminta.',
        'Krastavac daje zelenu, vodenastu svježinu, a limun i pepermint je pojačaju. Jedan od najosvježavajućih okusa.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Cucunade is a fresh, bright lemonade of cucumber syrup with lemon wedges and peppermint leaves.',
        'Cucumber brings green, watery freshness, and lemon and peppermint lift it further. One of the most refreshing flavors.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Krastavac', en: 'Cucumber' }, illustration: 'krastavac', color: '#5fae4f', intensity: 8 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7d84a', intensity: 6 },
      { name: { bs: 'Pepermint', en: 'Peppermint' }, illustration: 'pepermint', color: '#3fc08a', intensity: 4 }
    ],
    profile: { sweetness: 5, freshness: 10, fruitiness: 4, cooling: 3, strength: 7 },
    tags: ['pice', 'osvjezavajuci', 'ljetni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#5fae4f', secondary: '#f7d84a', accent: '#3fc08a', background: '#182211', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Cucunade i Watermelon, za ljetnu limunadu.',
        'Cucunade i Lemongrass, za još više zelene svježine.'
      ],
      en: [
        'Cucunade and Watermelon, for a summer lemonade.',
        'Cucunade and Lemongrass, for even more green freshness.'
      ]
    },
    similar: ['haze-cucumberita', 'musthave-lemongrass', 'musthave-estragon']
  },
  {
    id: 'musthave-lemongrass',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Lemongrass',
    shortDescription: {
      bs: 'Slatko-kisela limunada od limunske trave sa kriškama limete.',
      en: 'Sweet and sour lemongrass lemonade with lime slices.'
    },
    description: {
      bs: [
        'Lemongrass je limunada na bazi limunske trave, sa kriškama limete. Slatko-kisela i biljno svježa.',
        'Limunska trava daje citrus koji je mekši i zeleniji od limuna. Okus podsjeća na tajlandska pića.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Lemongrass is a lemonade based on lemongrass with slices of lime. Sweet and sour, with a herbal freshness.',
        'Lemongrass gives a citrus note softer and greener than lemon. It recalls Thai drinks.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limunska trava', en: 'Lemongrass' }, illustration: 'bilje', color: '#b9c94a', intensity: 8 },
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#7cc242', intensity: 6 }
    ],
    profile: { sweetness: 5, freshness: 9, fruitiness: 5, cooling: 0, strength: 7 },
    tags: ['pice', 'citrusni', 'biljni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#b9c94a', secondary: '#7cc242', accent: '#e0e7ae', background: '#272610', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Lemongrass i Mango Sling, za tajlandsku limunadu.',
        'Lemongrass i Ice Mint, za ledeni biljni miks.'
      ],
      en: [
        'Lemongrass and Mango Sling, for a Thai lemonade.',
        'Lemongrass and Ice Mint, for an icy herbal bowl.'
      ]
    },
    similar: ['musthave-lemon-lime', 'musthave-cucunade', 'musthave-lemon-tonic']
  },
  {
    id: 'musthave-mango-sling',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Mango Sling',
    shortDescription: {
      bs: 'Osvježavajuća limunada od tajlandskog manga sa začinima i mentom.',
      en: 'Refreshing Thai mango lemonade with spices and mint.'
    },
    description: {
      bs: [
        'Mango Sling je limunada na bazi tajlandskog manga, začinjena blagim začinima i listićima mente.',
        'Mango je sočan i sladak, menta osvježava, a začin daje toplu notu u pozadini. Jedan od najpoznatijih okusa brenda.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Mango Sling is a lemonade based on Thai mango, seasoned with mild spices and mint leaves.',
        'Mango is juicy and sweet, mint refreshes and the spice adds a warm background note. One of the brand\'s best known flavors.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb020', intensity: 9 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#3fc08a', intensity: 4 },
      { name: { bs: 'Začini', en: 'Spices' }, illustration: 'cimet', color: '#a0522d', intensity: 3 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 9, cooling: 2, strength: 7 },
    tags: ['pice', 'tropski', 'vocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ffb020', secondary: '#3fc08a', accent: '#a0522d', background: '#322209', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Mango Sling i Tropic Juice, za tropski koktel.',
        'Mango Sling i Lemongrass, za tajlandsku limunadu.'
      ],
      en: [
        'Mango Sling and Tropic Juice, for a tropical cocktail.',
        'Mango Sling and Lemongrass, for a Thai lemonade.'
      ]
    },
    similar: ['musthave-jumango', 'musthave-tropic-juice', 'sebero-mango-yogurt', 'musthave-space-flavour']
  },
  {
    id: 'musthave-estragon',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Estragon',
    shortDescription: {
      bs: 'Osvježavajući "Tarhun" iz djetinjstva, sa notom svježeg estragona.',
      en: 'The refreshing "Tarhun" soda from childhood, with fresh tarragon.'
    },
    description: {
      bs: [
        'Estragon je okus poznatog gaziranog pića "Tarhun": zelena soda sa estragonom, slatka i biljna.',
        'Estragon ima blagu anisnu notu, pa je okus neobičan i vrlo svjež. Za one koji vole biljne okuse.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Estragon is the taste of the well known "Tarhun" soda: a green tarragon soda, sweet and herbal.',
        'Tarragon has a light aniseed note, so the flavor is unusual and very fresh. For lovers of herbal flavors.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Estragon', en: 'Tarragon' }, illustration: 'bilje', color: '#4caf50', intensity: 8 },
      { name: { bs: 'Gazirani sok', en: 'Soda' }, illustration: 'kola', color: '#8fd16a', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 2, cooling: 0, strength: 7 },
    tags: ['pice', 'biljni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#4caf50', secondary: '#8fd16a', accent: '#aedbb0', background: '#152211', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Estragon i Mad Pear, za krušku sa tarhunom.',
        'Estragon i Lemon-Lime, za citrusni tarhun.'
      ],
      en: [
        'Estragon and Mad Pear, for pear with tarragon.',
        'Estragon and Lemon-Lime, for a citrus tarhun.'
      ]
    },
    similar: ['musthave-cucunade', 'musthave-baikal', 'musthave-green-fizz', 'musthave-pear-lemon-tarragon']
  },
  {
    id: 'musthave-green-fizz',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Green Fizz',
    shortDescription: {
      bs: 'Slatko-kiseli koktel od soka kaktusa, apsinta i kivija.',
      en: 'A sweet and sour cocktail of cactus juice, absinthe and kiwi.'
    },
    description: {
      bs: [
        'Green Fizz je zeleni koktel: sok od kaktusa, opori apsint i sočne kriške kivija. Slatko-kiseo i neobičan.',
        'Apsint daje biljnu, anisnu oštrinu, kaktus svježinu, a kivi voćnu kiselinu.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Green Fizz is a green cocktail: cactus juice, tart absinthe and juicy kiwi slices. Sweet, sour and unusual.',
        'Absinthe brings a herbal, aniseed edge, cactus the freshness and kiwi a fruity tang.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kaktus', en: 'Cactus' }, illustration: 'kaktus', color: '#6cbf5a', intensity: 8 },
      { name: { bs: 'Apsint', en: 'Absinthe' }, illustration: 'liker', color: '#9ccc3a', intensity: 6 },
      { name: { bs: 'Kivi', en: 'Kiwi' }, illustration: 'kivi', color: '#7cbf3a', intensity: 6 }
    ],
    profile: { sweetness: 5, freshness: 8, fruitiness: 6, cooling: 0, strength: 7 },
    tags: ['pice', 'biljni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#6cbf5a', secondary: '#9ccc3a', accent: '#7cbf3a', background: '#1b2413', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Green Fizz i Lemon-Lime, za kiseliji koktel.',
        'Green Fizz i Frosty, za ledeni zeleni koktel.'
      ],
      en: [
        'Green Fizz and Lemon-Lime, for a sharper cocktail.',
        'Green Fizz and Frosty, for an icy green cocktail.'
      ]
    },
    similar: ['holster-ice-kaktuz', 'musthave-kiwi-smoothie', 'musthave-estragon', 'adalya-cactus']
  },
  {
    id: 'musthave-prosecco',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Prosecco',
    shortDescription: {
      bs: 'Lagano polusuho pjenušavo vino sa blagom kiselinom.',
      en: 'A light semi-dry sparkling wine with a slight sourness.'
    },
    description: {
      bs: [
        'Prosecco je lagano polusuho pjenušavo vino: voćno, svijetlo i sa blagom kiselinom.',
        'Okus je elegantan i nije preslatak. Odlično podiže voćne okuse u miksu.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Prosecco is a light semi-dry sparkling wine: fruity, bright and slightly sour.',
        'It is elegant and not too sweet. Great for lifting fruit flavors in a mix.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Pjenušavo vino', en: 'Sparkling wine' }, illustration: 'sampanjac', color: '#f3dc8a', intensity: 9 }
    ],
    profile: { sweetness: 5, freshness: 7, fruitiness: 5, cooling: 0, strength: 7 },
    tags: ['pice', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#f3dc8a', secondary: '#f7e8b3', accent: '#faefca', background: '#30291a', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Prosecco i Strawberry, za jagode i pjenušac.',
        'Prosecco i Elderberry, za spritz sa bazgom.'
      ],
      en: [
        'Prosecco and Strawberry, for strawberries and bubbly.',
        'Prosecco and Elderberry, for an elderberry spritz.'
      ]
    },
    similar: ['musthave-citrus-spritz', 'musthave-christmas-drink', 'musthave-ruby-grape']
  },
  {
    id: 'musthave-citrus-spritz',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Citrus Spritz',
    shortDescription: {
      bs: 'Opor, osvježavajući citrusni koktel sa prosekom i kriškom narandže.',
      en: 'A tart, refreshing citrus cocktail with prosecco and an orange slice.'
    },
    description: {
      bs: [
        'Citrus Spritz je citrusni koktel sa prosekom, ukrašen kriškom narandže. Opor, pjenušav i osvježavajući.',
        'Okus podsjeća na ljetni aperitiv na terasi: gorko-kiseli citrus i suho pjenušavo vino.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Citrus Spritz is a citrus cocktail with prosecco, garnished with an orange slice. Tart, sparkling and refreshing.',
        'It recalls a summer aperitif on a terrace: bitter-sour citrus and dry sparkling wine.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff7a00', intensity: 8 },
      { name: { bs: 'Pjenušavo vino', en: 'Sparkling wine' }, illustration: 'sampanjac', color: '#f3dc8a', intensity: 7 }
    ],
    profile: { sweetness: 5, freshness: 8, fruitiness: 6, cooling: 0, strength: 7 },
    tags: ['pice', 'citrusni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#ff7a00', secondary: '#f3dc8a', accent: '#ffc38c', background: '#321904', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Citrus Spritz i Grapefruit, za gorči aperitiv.',
        'Citrus Spritz i Sweet Peach, za Bellini.'
      ],
      en: [
        'Citrus Spritz and Grapefruit, for a more bitter aperitif.',
        'Citrus Spritz and Sweet Peach, for a Bellini.'
      ]
    },
    similar: ['musthave-prosecco', 'musthave-orange-team', 'musthave-lemon-tonic', 'musthave-christmas-drink']
  },
  {
    id: 'musthave-christmas-drink',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Christmas Drink',
    shortDescription: {
      bs: 'Profinjen, nježan miris šampanjca.',
      en: 'The refined, delicate aroma of champagne.'
    },
    description: {
      bs: [
        'Christmas Drink je okus šampanjca: nježan, profinjen i svečan, sa sitnim mjehurićima i blagom voćnošću.',
        'Praznični okus koji je lagan i nenametljiv. Lijepo se slaže sa bobicama i citrusima.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Christmas Drink is the taste of champagne: delicate, refined and festive, with fine bubbles and a light fruitiness.',
        'A holiday flavor that is light and unobtrusive. Lovely with berries and citrus.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Šampanjac', en: 'Champagne' }, illustration: 'sampanjac', color: '#f6e7a6', intensity: 9 }
    ],
    profile: { sweetness: 5, freshness: 6, fruitiness: 4, cooling: 0, strength: 7 },
    tags: ['pice', 'klasicni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'fizz',
    palette: { primary: '#f6e7a6', secondary: '#f9efc5', accent: '#fbf4d7', background: '#312b1f', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Christmas Drink i Strawberry, za šampanjac sa jagodama.',
        'Christmas Drink i Mandarin, za praznični miks.'
      ],
      en: [
        'Christmas Drink and Strawberry, for champagne and strawberries.',
        'Christmas Drink and Mandarin, for a holiday bowl.'
      ]
    },
    similar: ['musthave-prosecco', 'musthave-citrus-spritz', 'musthave-yolka']
  },
  {
    id: 'musthave-caribbean-rum',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Caribbean Rum',
    shortDescription: {
      bs: 'Plemeniti ukus ruma sa plantaža šećerne trske na karipskom suncu.',
      en: 'The noble taste of rum from sugar cane plantations under the Caribbean sun.'
    },
    description: {
      bs: [
        'Caribbean Rum je okus tamnog ruma od šećerne trske: topao, pomalo karamelast i drven.',
        'Nema alkohola, samo ukus. Dobar je kao baza za koktel mikseve sa voćem i kolom.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Caribbean Rum is the taste of dark sugar cane rum: warm, a little caramel-like and woody.',
        'No alcohol, only the taste. A good base for cocktail mixes with fruit and cola.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Tamni rum', en: 'Dark rum' }, illustration: 'liker', color: '#b5651d', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 3, fruitiness: 2, cooling: 0, strength: 8 },
    tags: ['pice', 'nocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#b5651d', secondary: '#cf9b6c', accent: '#deba99', background: '#261609', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Caribbean Rum i Cola, za rum i kolu.',
        'Caribbean Rum i Coconut Shake, za pina coladu.'
      ],
      en: [
        'Caribbean Rum and Cola, for a rum and cola.',
        'Caribbean Rum and Coconut Shake, for a pina colada.'
      ]
    },
    similar: ['musthave-cola', 'musthave-tipsy', 'musthave-mulled-wine']
  },
  {
    id: 'musthave-mulled-wine',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Mulled Wine',
    shortDescription: {
      bs: 'Toplo, začinjeno crno vino sa kriškama narandže i jabuke.',
      en: 'Warm, spiced red wine with orange and apple slices.'
    },
    description: {
      bs: [
        'Mulled Wine je kuhano vino: crno polusuho vino zagrijano sa začinima i kriškama narandže i jabuke.',
        'Topao, začinski i voćni okus za zimske večeri. Cimet i citrus se osjete od prvog dima.',
        'Tamni list: rastresito pakovanje i blaga toplota, da se čajne i začinske note ne zapeku.'
      ],
      en: [
        'Mulled Wine is hot spiced wine: semi-sweet red wine warmed with spices and slices of orange and apple.',
        'A warm, spiced and fruity flavor for winter evenings. Cinnamon and citrus come through from the first pull.',
        'Dark leaf: pack it loose and keep the heat gentle, so the tea and spice notes do not burn.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crno vino', en: 'Red wine' }, illustration: 'vino', color: '#7a1022', intensity: 8 },
      { name: { bs: 'Cimet', en: 'Cinnamon' }, illustration: 'cimet', color: '#a0522d', intensity: 6 },
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff7a00', intensity: 5 },
      { name: { bs: 'Jabuka', en: 'Apple' }, illustration: 'jabuka', color: '#d9302c', intensity: 4 }
    ],
    profile: { sweetness: 6, freshness: 2, fruitiness: 6, cooling: 0, strength: 8 },
    tags: ['pice', 'zacinski', 'nocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#7a1022', secondary: '#a0522d', accent: '#ff7a00', background: '#1d080a', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Mulled Wine i Cinnamon, za još toplije kuhano vino.',
        'Mulled Wine i Mandarin, za praznični miks.'
      ],
      en: [
        'Mulled Wine and Cinnamon, for an even warmer mulled wine.',
        'Mulled Wine and Mandarin, for a holiday bowl.'
      ]
    },
    similar: ['musthave-masala-tea', 'musthave-cinnamon', 'musthave-caribbean-rum']
  },
  {
    id: 'musthave-tipsy',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Tipsy',
    shortDescription: {
      bs: 'Aperitiv od jakog likera i soka lubenice, sa šlagom i bobičastim preljevom.',
      en: 'An aperitif of strong liqueur and watermelon juice, with whipped cream and berry topping.'
    },
    description: {
      bs: [
        'Tipsy je raskošan aperitiv: jak liker i sok od lubenice, ublaženi šlagom i nježnim preljevom od bobica.',
        'Okus je sočan, kremast i pomalo "pijan". Neobična kombinacija koja se pamti.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Tipsy is a lavish aperitif: strong liqueur and watermelon juice, softened by whipped cream and a delicate berry topping.',
        'It is juicy, creamy and a little boozy. An unusual combination that sticks with you.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8455a', intensity: 8 },
      { name: { bs: 'Liker', en: 'Liqueur' }, illustration: 'liker', color: '#c0392b', intensity: 6 },
      { name: { bs: 'Šlag', en: 'Whipped cream' }, illustration: 'sejk', color: '#fbf3e3', intensity: 5 },
      { name: { bs: 'Bobičasti preljev', en: 'Berry topping' }, illustration: 'malina', color: '#d61f5b', intensity: 3 }
    ],
    profile: { sweetness: 8, freshness: 5, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['pice', 'desertni', 'vocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#e8455a', secondary: '#c0392b', accent: '#fbf3e3', background: '#2e1113', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Tipsy i Watermelon, za više lubenice.',
        'Tipsy i Ice Mint, za ledeni koktel.'
      ],
      en: [
        'Tipsy and Watermelon, for more watermelon.',
        'Tipsy and Ice Mint, for an icy cocktail.'
      ]
    },
    similar: ['musthave-watermelon', 'musthave-caribbean-rum', 'musthave-violet']
  },
  {
    id: 'musthave-ruby-grape',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Ruby Grape',
    shortDescription: {
      bs: 'Osvježavajući koktel u kojem dominira rubin crveno grožđe.',
      en: 'A refreshing cocktail dominated by ruby red grapes.'
    },
    description: {
      bs: [
        'Ruby Grape je osvježavajući koktel sa crvenim grožđem kao glavnim okusom: sočan, slatkast i pomalo vinski.',
        'Grožđe je ovdje svjetlije i svježije nego u klasičnim okusima grožđa, više kao sok nego kao bombon.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Ruby Grape is a refreshing cocktail with red grape as the lead: juicy, sweet and a little wine-like.',
        'The grape here is brighter and fresher than in classic grape flavors, more juice than candy.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crveno grožđe', en: 'Red grape' }, illustration: 'grozdje', color: '#9b2242', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['pice', 'vocni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#9b2242', secondary: '#be6f84', accent: '#d29caa', background: '#220b0f', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Ruby Grape i Garnet Grape, za grožđe i nar.',
        'Ruby Grape i Ice Mint, za ledeno grožđe.'
      ],
      en: [
        'Ruby Grape and Garnet Grape, for grape and pomegranate.',
        'Ruby Grape and Ice Mint, for icy grape.'
      ]
    },
    similar: ['musthave-garnet-grape', 'haze-purple-krush', 'al-fakher-grape-mint', 'musthave-prosecco']
  },
  {
    id: 'musthave-cherry-juice',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Cherry Juice',
    shortDescription: {
      bs: 'Sok od višnje sa jedva primjetnom oporošću koštice.',
      en: 'Cherry juice with a faint tartness of the stone.'
    },
    description: {
      bs: [
        'Cherry Juice je okus soka od višnje, sa jedva primjetnom oporom notom koštice.',
        'Sočan, slatko-kiseo i prirodan. Bliži je pravom soku nego bombonu od višnje.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Cherry Juice is the taste of cherry juice, with a barely noticeable tart note of the stone.',
        'Juicy, sweet and sour, and natural. Closer to real juice than to cherry candy.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Višnja', en: 'Sour cherry' }, illustration: 'visnja', color: '#a3122e', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['pice', 'vocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#a3122e', secondary: '#c36577', accent: '#d694a1', background: '#23090c', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Cherry Juice i Cola, za višnja kolu.',
        'Cherry Juice i Vanilla Cream, za višnju sa kremom.'
      ],
      en: [
        'Cherry Juice and Cola, for a cherry cola.',
        'Cherry Juice and Vanilla Cream, for cherries and cream.'
      ]
    },
    similar: ['musthave-nord-star', 'musthave-cherry-cola', 'tangiers-maraschino-cherry', 'musthave-berry-mors']
  },
  {
    id: 'musthave-berry-mors',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Berry Mors',
    shortDescription: {
      bs: 'Domaći mors, sok od zrelih brusnica, trešanja i malina.',
      en: 'Homemade mors, a drink of ripe lingonberries, cherries and raspberries.'
    },
    description: {
      bs: [
        'Berry Mors je tradicionalni domaći sok od bobica (mors): brusnica, trešnja i malina.',
        'Okus je sočan, kiselkast i lagano sladak, kao osvježavajući voćni napitak iz bokala.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Berry Mors is a traditional homemade berry drink (mors): lingonberry, cherry and raspberry.',
        'It is juicy, tart and lightly sweet, like a refreshing fruit drink poured from a jug.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Brusnica', en: 'Lingonberry' }, illustration: 'bobice', color: '#c8102e', intensity: 8 },
      { name: { bs: 'Trešnja', en: 'Cherry' }, illustration: 'visnja', color: '#c0233f', intensity: 6 },
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#d61f5b', intensity: 6 }
    ],
    profile: { sweetness: 6, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['pice', 'bobicasti', 'vocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#c8102e', secondary: '#c0233f', accent: '#d61f5b', background: '#29080c', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Berry Mors i Frosty, za ledeni sok od bobica.',
        'Berry Mors i Lemon-Lime, za kiseliji sok.'
      ],
      en: [
        'Berry Mors and Frosty, for an iced berry drink.',
        'Berry Mors and Lemon-Lime, for a sharper drink.'
      ]
    },
    similar: ['musthave-cranberry', 'musthave-forest-berries', 'musthave-cherry-juice']
  },
  {
    id: 'musthave-jumango',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Jumango',
    shortDescription: {
      bs: 'Tropski sok od tajlandskog manga, cvjetnog meda i malina.',
      en: 'A tropical juice of Thai mango, blossom honey and raspberries.'
    },
    description: {
      bs: [
        'Jumango je tropski sok na bazi sočnog tajlandskog manga, sa cvjetnim medom i bobicama maline.',
        'Mango je glavni, med ga zaokruži, a malina doda kiselkast, bobičast vrh.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Jumango is a tropical juice based on juicy Thai mango, with blossom honey and raspberries.',
        'Mango leads, honey rounds it off and raspberry adds a tangy berry top note.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb020', intensity: 9 },
      { name: { bs: 'Med', en: 'Honey' }, illustration: 'med', color: '#e0a43a', intensity: 5 },
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#d61f5b', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 5, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['pice', 'tropski', 'medeni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#ffb020', secondary: '#e0a43a', accent: '#d61f5b', background: '#322209', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Jumango i Mango Sling, za duplo mango.',
        'Jumango i Vanilla Cream, za mango smoothie.'
      ],
      en: [
        'Jumango and Mango Sling, for double mango.',
        'Jumango and Vanilla Cream, for a mango smoothie.'
      ]
    },
    similar: ['musthave-mango-sling', 'musthave-tropic-juice', 'musthave-raspberry']
  },
  {
    id: 'musthave-vanilla-cream',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Vanilla Cream',
    shortDescription: {
      bs: 'Nježna, kremasta vanilin krema, dobar dodatak svakom desertu.',
      en: 'Delicate, creamy vanilla cream, a great addition to any dessert.'
    },
    description: {
      bs: [
        'Vanilla Cream je mekana vanilin krema: nježna, kremasta i slatka, bez oštrih nota.',
        'Sama je lagana, a u miksu zaobli voće i kolače. Jedan od najkorisnijih okusa za mikseve.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Vanilla Cream is a soft vanilla custard: delicate, creamy and sweet, with no sharp notes.',
        'Light on its own, and in a mix it rounds off fruit and pastry flavors. One of the most useful mixing flavors.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Vanila', en: 'Vanilla' }, illustration: 'vanila', color: '#f3e2b3', intensity: 9 },
      { name: { bs: 'Krema', en: 'Cream' }, illustration: 'sejk', color: '#fbf3e3', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 2, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['desertni', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f3e2b3', secondary: '#fbf3e3', accent: '#faf2dd', background: '#302a21', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Vanilla Cream i Raspberry, za malinu sa kremom.',
        'Vanilla Cream i Orange Team, za narandžasti krem.'
      ],
      en: [
        'Vanilla Cream and Raspberry, for raspberries and cream.',
        'Vanilla Cream and Orange Team, for an orange creamsicle.'
      ]
    },
    similar: ['musthave-ice-cream', 'musthave-cream-soda', 'tangiers-horchata', 'musthave-cheesecake']
  },
  {
    id: 'musthave-ice-cream',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Ice Cream',
    shortDescription: {
      bs: 'Nježan okus pravog sladoleda sa mekanim, kremastim krajem.',
      en: 'The delicate taste of real ice cream with a soft, creamy finish.'
    },
    description: {
      bs: [
        'Ice Cream je okus klasičnog mliječnog sladoleda (plombir): bogat, kremast i nježan.',
        'Nije hladan kao mentol, nego mliječan i mekan. Odlično ide uz voće i čokoladu.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Ice Cream is the taste of classic milk ice cream (plombir): rich, creamy and delicate.',
        'It is not cold like menthol, but milky and soft. Goes great with fruit and chocolate.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Sladoled', en: 'Ice cream' }, illustration: 'sladoled', color: '#f5e9c8', intensity: 9 },
      { name: { bs: 'Mlijeko', en: 'Milk' }, illustration: 'sejk', color: '#fbf3e3', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 3, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['desertni', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f5e9c8', secondary: '#fbf3e3', accent: '#fbf5e6', background: '#302b24', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Ice Cream i Strawberry, za jagode sa sladoledom.',
        'Ice Cream i Cola, za kolu sa sladoledom.'
      ],
      en: [
        'Ice Cream and Strawberry, for strawberries and ice cream.',
        'Ice Cream and Cola, for a cola float.'
      ]
    },
    similar: ['musthave-vanilla-cream', 'musthave-strawberry-sorbet', 'musthave-coconut-shake', 'musthave-cookie']
  },
  {
    id: 'musthave-strawberry-sorbet',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Strawberry Sorbet',
    shortDescription: {
      bs: 'Lagan, osvježavajući desert sa bogatim okusom zrele jagode.',
      en: 'A light, refreshing dessert with a rich ripe strawberry taste.'
    },
    description: {
      bs: [
        'Strawberry Sorbet (Клубничный сорбет) je sorbet od jagode: lagan, voćan i osvježavajući desert.',
        'Jagoda je zrela i bogata, a sorbet je mekši od sladoleda i bez mliječne težine.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Strawberry Sorbet (Клубничный сорбет) is a strawberry sorbet: a light, fruity, refreshing dessert.',
        'The strawberry is ripe and rich, and sorbet is lighter than ice cream, without the dairy weight.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e63946', intensity: 9 },
      { name: { bs: 'Sorbet', en: 'Sorbet' }, illustration: 'sladoled', color: '#ff8fa3', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['desertni', 'vocni', 'ljetni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#e63946', secondary: '#ff8fa3', accent: '#f4a6ac', background: '#2e0f0f', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Strawberry Sorbet i Prosecco, za sorbet u pjenušcu.',
        'Strawberry Sorbet i Lemon-Lime, za kiseliji sorbet.'
      ],
      en: [
        'Strawberry Sorbet and Prosecco, for sorbet in bubbly.',
        'Strawberry Sorbet and Lemon-Lime, for a sharper sorbet.'
      ]
    },
    similar: ['musthave-strawberry', 'musthave-ice-cream', 'musthave-strawberry-lychee']
  },
  {
    id: 'musthave-coconut-shake',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Coconut Shake',
    shortDescription: {
      bs: 'Slatki egzotični šejk od svježeg kokosa.',
      en: 'A sweet exotic shake of fresh coconut.'
    },
    description: {
      bs: [
        'Coconut Shake je kokosov šejk izmiješan u hladu palmi: sladak, kremast i egzotičan.',
        'Kokos je svjež i mliječan, ne prepečen. Odličan je uz ananas, mango i čokoladu.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Coconut Shake is a coconut shake blended in the shade of palm trees: sweet, creamy and exotic.',
        'The coconut is fresh and milky, not toasted. Excellent with pineapple, mango and chocolate.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kokos', en: 'Coconut' }, illustration: 'kokos', color: '#f7f4ec', intensity: 9 },
      { name: { bs: 'Šejk', en: 'Shake' }, illustration: 'sejk', color: '#fbf3e3', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 3, fruitiness: 4, cooling: 0, strength: 7 },
    tags: ['desertni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f7f4ec', secondary: '#fbf3e3', accent: '#fbfaf6', background: '#312d2a', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Coconut Shake i Pineapple Rings, za pina coladu.',
        'Coconut Shake i Cacao, za čokoladu sa kokosom.'
      ],
      en: [
        'Coconut Shake and Pineapple Rings, for a pina colada.',
        'Coconut Shake and Cacao, for chocolate and coconut.'
      ]
    },
    similar: ['musthave-paradise', 'musthave-ice-cream', 'musthave-tropic-juice', 'al-fakher-coconut']
  },
  {
    id: 'musthave-paradise',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Paradise',
    shortDescription: {
      bs: 'Karamelizovana banana posuta kokosovim listićima.',
      en: 'Caramelised banana sprinkled with coconut flakes.'
    },
    description: {
      bs: [
        'Paradise je banana pržena u karameli i posuta kokosovim listićima. Ekstravagantan, topao desert.',
        'Banana i karamela su glavne, a kokos daje egzotičan, kremast kraj.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Paradise is banana fried in caramel and sprinkled with coconut flakes. An extravagant, warm dessert.',
        'Banana and caramel lead, and coconut adds an exotic, creamy finish.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Banana', en: 'Banana' }, illustration: 'banana', color: '#f5d33c', intensity: 8 },
      { name: { bs: 'Karamel', en: 'Caramel' }, illustration: 'karamel', color: '#b7742f', intensity: 7 },
      { name: { bs: 'Kokos', en: 'Coconut' }, illustration: 'kokos', color: '#f7f4ec', intensity: 5 }
    ],
    profile: { sweetness: 9, freshness: 2, fruitiness: 6, cooling: 0, strength: 7 },
    tags: ['desertni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#f5d33c', secondary: '#b7742f', accent: '#f7f4ec', background: '#30280e', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Paradise i Ice Cream, za bananu split.',
        'Paradise i Cacao, za čokoladnu bananu.'
      ],
      en: [
        'Paradise and Ice Cream, for a banana split.',
        'Paradise and Cacao, for chocolate banana.'
      ]
    },
    similar: ['musthave-banana-mama', 'musthave-coconut-shake', 'musthave-candy-cow', 'al-fakher-coconut']
  },
  {
    id: 'musthave-cheesecake',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Cheesecake',
    shortDescription: {
      bs: 'Prhko tijesto sa notom oraha i baršunast fil od sira sa vanilom i limunom.',
      en: 'Shortcrust with a nutty note and a velvety curd filling with vanilla and lemon.'
    },
    description: {
      bs: [
        'Cheesecake je prhko tijesto sa blagom notom oraha i baršunast, kremast fil od svježeg sira.',
        'Vanila daje slatkoću, a limun blagu kiselinu koja kolač drži laganim.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Cheesecake is shortcrust with a light nutty note and a velvety, creamy curd filling.',
        'Vanilla brings sweetness and lemon a gentle tang that keeps the cake light.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Fil od sira', en: 'Curd filling' }, illustration: 'kolac', color: '#f6ecd0', intensity: 8 },
      { name: { bs: 'Vanila', en: 'Vanilla' }, illustration: 'vanila', color: '#f3e2b3', intensity: 5 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7d84a', intensity: 4 }
    ],
    profile: { sweetness: 8, freshness: 3, fruitiness: 2, cooling: 0, strength: 7 },
    tags: ['desertni', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f6ecd0', secondary: '#f3e2b3', accent: '#f7d84a', background: '#312c25', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Cheesecake i Raspberry, za cheesecake sa malinom.',
        'Cheesecake i Blueberry, za cheesecake sa borovnicom.'
      ],
      en: [
        'Cheesecake and Raspberry, for raspberry cheesecake.',
        'Cheesecake and Blueberry, for blueberry cheesecake.'
      ]
    },
    similar: ['musthave-lemon-pie', 'musthave-vanilla-cream', 'musthave-pistachio-cake']
  },
  {
    id: 'musthave-charlotte-pie',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Charlotte Pie',
    shortDescription: {
      bs: 'Topao kolač od dizanog tijesta sa filom od karamelizovane jabuke.',
      en: 'Warm sweet pastry filled with caramelised apple.'
    },
    description: {
      bs: [
        'Charlotte Pie je topao kolač od mekog tijesta, punjen jabukom u karameli. Podsjeća na pitu od jabuka.',
        'Jabuka je sočna, karamela slatka, a tijesto daje toplu, pečenu notu.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Charlotte Pie is a warm cake of soft pastry filled with apple in caramel. It recalls an apple pie.',
        'The apple is juicy, the caramel sweet, and the pastry adds a warm baked note.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Jabuka', en: 'Apple' }, illustration: 'jabuka', color: '#d9302c', intensity: 8 },
      { name: { bs: 'Karamel', en: 'Caramel' }, illustration: 'karamel', color: '#b7742f', intensity: 6 },
      { name: { bs: 'Tijesto', en: 'Pastry' }, illustration: 'kolac', color: '#e8b46a', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 2, fruitiness: 6, cooling: 0, strength: 7 },
    tags: ['desertni', 'slatki', 'vocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#d9302c', secondary: '#b7742f', accent: '#e8b46a', background: '#2c0e0b', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Charlotte Pie i Cinnamon, za pitu od jabuka sa cimetom.',
        'Charlotte Pie i Ice Cream, za pitu sa sladoledom.'
      ],
      en: [
        'Charlotte Pie and Cinnamon, for apple pie with cinnamon.',
        'Charlotte Pie and Ice Cream, for pie à la mode.'
      ]
    },
    similar: ['musthave-cinnamon-roll', 'musthave-apple-drops', 'al-fakher-double-apple']
  },
  {
    id: 'musthave-lemon-pie',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Lemon Pie',
    shortDescription: {
      bs: 'Topli domaći kolač sa osvježavajućom kiselinom svježeg limuna.',
      en: 'A warm homemade cake with the bright sourness of fresh lemon.'
    },
    description: {
      bs: [
        'Lemon Pie je topao domaći kolač sa limunom: mekano tijesto i svježa, kisela nota limuna.',
        'Slatko i kiselo su u dobrom balansu, pa okus nije težak kao drugi deserti.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Lemon Pie is a warm homemade lemon cake: soft pastry and a fresh, sour lemon note.',
        'Sweet and sour are well balanced, so it is not as heavy as other desserts.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7d84a', intensity: 8 },
      { name: { bs: 'Kolač', en: 'Cake' }, illustration: 'kolac', color: '#f7e08a', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 4, cooling: 0, strength: 7 },
    tags: ['desertni', 'citrusni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f7d84a', secondary: '#f7e08a', accent: '#fbedae', background: '#312810', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Lemon Pie i Vanilla Cream, za limun tart sa kremom.',
        'Lemon Pie i Blueberry, za kolač sa borovnicama.'
      ],
      en: [
        'Lemon Pie and Vanilla Cream, for lemon tart with cream.',
        'Lemon Pie and Blueberry, for a blueberry lemon cake.'
      ]
    },
    similar: ['musthave-cheesecake', 'musthave-lemon-lime']
  },
  {
    id: 'musthave-pistachio-cake',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Pistachio Cake',
    shortDescription: {
      bs: 'Nježan miris čuvenog kolača od pistacija i malina iz Riminija.',
      en: 'The delicate aroma of the famous pistachio and raspberry cake from Rimini.'
    },
    description: {
      bs: [
        'Pistachio Cake je inspirisan italijanskim kolačem od pistacija sa malinama iz Riminija.',
        'Pistacija daje kremastu, orašastu notu, a malina svjež, kiselkast kontrast.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Pistachio Cake is inspired by the Italian pistachio and raspberry cake from Rimini.',
        'Pistachio brings a creamy, nutty note and raspberry a fresh, tangy contrast.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Pistacija', en: 'Pistachio' }, illustration: 'pistacija', color: '#8fbf4a', intensity: 8 },
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#d61f5b', intensity: 6 },
      { name: { bs: 'Kolač', en: 'Cake' }, illustration: 'kolac', color: '#b8d98a', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 3, fruitiness: 4, cooling: 0, strength: 7 },
    tags: ['desertni', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#8fbf4a', secondary: '#d61f5b', accent: '#b8d98a', background: '#202410', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Pistachio Cake i Vanilla Cream, za još kremastiji kolač.',
        'Pistachio Cake i Raspberry, za više maline.'
      ],
      en: [
        'Pistachio Cake and Vanilla Cream, for an even creamier cake.',
        'Pistachio Cake and Raspberry, for more raspberry.'
      ]
    },
    similar: ['musthave-pistachio', 'musthave-cheesecake', 'musthave-raspberry']
  },
  {
    id: 'musthave-pistachio',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Pistachio',
    shortDescription: {
      bs: 'Slatkasta, blago pržena zrela pistacija.',
      en: 'Sweetish, lightly roasted ripe pistachio.'
    },
    description: {
      bs: [
        'Pistachio je zrela, lagano pržena pistacija: slatkasta, nježna i orašasta.',
        'Okus je fin i kremast, bez gorčine. Dobar je uz kafu, vanilu i čokoladu.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Pistachio is a ripe, lightly roasted pistachio: sweetish, delicate and nutty.',
        'It is fine and creamy, with no bitterness. Good with coffee, vanilla and chocolate.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Pistacija', en: 'Pistachio' }, illustration: 'pistacija', color: '#8fbf4a', intensity: 9 },
      { name: { bs: 'Pržena nota', en: 'Roasted note' }, illustration: 'orah', color: '#a8763e', intensity: 3 }
    ],
    profile: { sweetness: 6, freshness: 2, fruitiness: 1, cooling: 0, strength: 7 },
    tags: ['desertni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#8fbf4a', secondary: '#a8763e', accent: '#cde2ae', background: '#202410', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Pistachio i Vanilla Cream, za sladoled od pistacija.',
        'Pistachio i Cacao, za čokoladu sa pistacijom.'
      ],
      en: [
        'Pistachio and Vanilla Cream, for pistachio ice cream.',
        'Pistachio and Cacao, for chocolate with pistachio.'
      ]
    },
    similar: ['musthave-pistachio-cake', 'musthave-maple-pecan']
  },
  {
    id: 'musthave-maple-pecan',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Maple Pecan',
    shortDescription: {
      bs: 'Lisnato tijesto, javorov sirup i orah pekan.',
      en: 'Puff pastry, maple syrup and pecan.'
    },
    description: {
      bs: [
        'Maple Pecan je topla kombinacija lisnatog tijesta, javorovog sirupa i oraha pekana.',
        'Sirup daje gustu, karamelastu slatkoću, a pekan prženu, orašastu dubinu. Okus kao pecivo za doručak.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Maple Pecan is a warm combination of puff pastry, maple syrup and pecan.',
        'The syrup brings thick, caramel-like sweetness and pecan a roasted, nutty depth. Tastes like a breakfast pastry.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Javorov sirup', en: 'Maple syrup' }, illustration: 'med', color: '#b5651d', intensity: 8 },
      { name: { bs: 'Pekan', en: 'Pecan' }, illustration: 'orah', color: '#8a5a2e', intensity: 7 },
      { name: { bs: 'Lisnato tijesto', en: 'Puff pastry' }, illustration: 'kroasan', color: '#c98a45', intensity: 6 }
    ],
    profile: { sweetness: 9, freshness: 1, fruitiness: 1, cooling: 0, strength: 7 },
    tags: ['desertni', 'slatki', 'medeni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#b5651d', secondary: '#8a5a2e', accent: '#c98a45', background: '#261609', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Maple Pecan i Banana Mama, za palačinke sa bananom.',
        'Maple Pecan i Cinnamon Roll, za pekaru.'
      ],
      en: [
        'Maple Pecan and Banana Mama, for banana pancakes.',
        'Maple Pecan and Cinnamon Roll, for a bakery bowl.'
      ]
    },
    similar: ['musthave-cinnamon-roll', 'musthave-pistachio', 'musthave-candy-cow']
  },
  {
    id: 'musthave-cinnamon-roll',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Cinnamon Roll',
    shortDescription: {
      bs: 'Miris tek pečene kiflice sa cimetom.',
      en: 'The aroma of a freshly baked cinnamon roll.'
    },
    description: {
      bs: [
        'Cinnamon Roll je okus tek pečene kiflice sa cimetom: mekano tijesto, topao cimet i slatka glazura.',
        'Topao, mirisan i desertni okus. Odličan za hladne večeri.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Cinnamon Roll is the taste of a freshly baked cinnamon bun: soft dough, warm cinnamon and sweet icing.',
        'Warm, fragrant and dessert-like. Great for cold evenings.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Cimet', en: 'Cinnamon' }, illustration: 'rolat', color: '#8a4a20', intensity: 8 },
      { name: { bs: 'Glazura', en: 'Icing' }, illustration: 'vanila', color: '#f3e2b3', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 1, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['desertni', 'zacinski'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#8a4a20', secondary: '#f3e2b3', accent: '#caae9b', background: '#1f1209', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Cinnamon Roll i Charlotte Pie, za pitu od jabuka.',
        'Cinnamon Roll i Vanilla Cream, za još više glazure.'
      ],
      en: [
        'Cinnamon Roll and Charlotte Pie, for apple pie.',
        'Cinnamon Roll and Vanilla Cream, for extra icing.'
      ]
    },
    similar: ['musthave-cinnamon', 'musthave-maple-pecan', 'musthave-charlotte-pie']
  },
  {
    id: 'musthave-cookie',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Cookie',
    shortDescription: {
      bs: 'Hrskavi čokoladni keks sa kremastim filom.',
      en: 'Crunchy chocolate shortbread cookies with a creamy filling.'
    },
    description: {
      bs: [
        'Cookie je hrskavi čokoladni keks sa kremastim filom u sredini, kao poznati keks za umakanje u mlijeko.',
        'Čokolada je tamna i pečena, a fil mekan i sladak.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Cookie is a crunchy chocolate cookie with a creamy filling, like the famous one you dunk in milk.',
        'The chocolate is dark and baked, and the filling soft and sweet.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Čokoladni keks', en: 'Chocolate cookie' }, illustration: 'keks', color: '#4a2c1a', intensity: 8 },
      { name: { bs: 'Krem fil', en: 'Cream filling' }, illustration: 'sejk', color: '#fbf3e3', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 1, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['desertni', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#4a2c1a', secondary: '#fbf3e3', accent: '#aea098', background: '#150d08', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Cookie i Ice Cream, za sladoled sa keksom.',
        'Cookie i Choco Mint, za mint keks.'
      ],
      en: [
        'Cookie and Ice Cream, for cookies and cream.',
        'Cookie and Choco Mint, for a mint cookie.'
      ]
    },
    similar: ['musthave-cacao', 'musthave-choco-mint', 'musthave-ice-cream']
  },
  {
    id: 'musthave-cacao',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Cacao',
    shortDescription: {
      bs: 'Topla čokolada sa prozračnim marshmallowom.',
      en: 'Hot chocolate with fluffy marshmallows.'
    },
    description: {
      bs: [
        'Cacao je šolja tople čokolade sa marshmallowom na vrhu: slatka, kremasta i utješna.',
        'Čokolada je mliječna, ne gorka, a marshmallow joj daje mekan, šećerni kraj.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Cacao is a cup of hot chocolate with marshmallows on top: sweet, creamy and comforting.',
        'The chocolate is milky, not bitter, and the marshmallow gives a soft, sugary finish.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Topla čokolada', en: 'Hot chocolate' }, illustration: 'cokolada', color: '#5a3520', intensity: 9 },
      { name: { bs: 'Marshmallow', en: 'Marshmallow' }, illustration: 'marshmallow', color: '#fbe3ec', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 1, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['desertni', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#5a3520', secondary: '#fbe3ec', accent: '#b5a49b', background: '#180e09', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Cacao i Cinnamon, za začinjenu čokoladu.',
        'Cacao i Coconut Shake, za čokoladu sa kokosom.'
      ],
      en: [
        'Cacao and Cinnamon, for spiced hot chocolate.',
        'Cacao and Coconut Shake, for chocolate and coconut.'
      ]
    },
    similar: ['musthave-cookie', 'musthave-choco-mint', 'fumari-mint-chocolate-chill', 'musthave-unicorn-treats']
  },
  {
    id: 'musthave-milky-rice',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Milky Rice',
    shortDescription: {
      bs: 'Nježan, nostalgičan miris slatke riže na mlijeku.',
      en: 'The delicate, nostalgic aroma of sweet milk rice pudding.'
    },
    description: {
      bs: [
        'Milky Rice je okus slatke riže na mlijeku: nježan, mliječan i nostalgičan, kao kod nane.',
        'Lagan je i nenametljiv, sa mekom slatkoćom. Lijepo se slaže sa cimetom i voćem.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Milky Rice is the taste of sweet rice pudding: delicate, milky and nostalgic, like grandma\'s.',
        'Light and unobtrusive, with a soft sweetness. Pairs nicely with cinnamon and fruit.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Riža na mlijeku', en: 'Rice pudding' }, illustration: 'riza', color: '#3d6fb6', intensity: 8 },
      { name: { bs: 'Mlijeko', en: 'Milk' }, illustration: 'sejk', color: '#fbf3e3', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 2, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['desertni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#3d6fb6', secondary: '#fbf3e3', accent: '#a8bede', background: '#131821', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Milky Rice i Cinnamon, za rižu sa cimetom.',
        'Milky Rice i Raspberry, za rižu sa džemom.'
      ],
      en: [
        'Milky Rice and Cinnamon, for rice pudding with cinnamon.',
        'Milky Rice and Raspberry, for rice pudding with jam.'
      ]
    },
    similar: ['musthave-vanilla-cream', 'tangiers-horchata', 'musthave-milk-oolong', 'musthave-unicorn-treats']
  },
  {
    id: 'musthave-unicorn-treats',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Unicorn Treats',
    shortDescription: {
      bs: 'Slatki hrskavi kukuruzni štapići sa notama beze i marshmallowa.',
      en: 'Sweet crunchy corn puffs with notes of meringue and marshmallow.'
    },
    description: {
      bs: [
        'Unicorn Treats je okus slatkih hrskavih kukuruznih štapića, sa kremastim notama puslica (beze) i marshmallowa.',
        'Šećeran, kremast i razigran okus, kao slatkiši sa vašara.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Unicorn Treats is the taste of sweet crunchy corn puffs, with creamy notes of meringue and marshmallow.',
        'Sugary, creamy and playful, like treats from a fair.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kukuruzni štapići', en: 'Corn puffs' }, illustration: 'stapici', color: '#f1c84b', intensity: 8 },
      { name: { bs: 'Puslica', en: 'Meringue' }, illustration: 'puslica', color: '#ffd6e6', intensity: 6 },
      { name: { bs: 'Marshmallow', en: 'Marshmallow' }, illustration: 'marshmallow', color: '#fbe3ec', intensity: 5 }
    ],
    profile: { sweetness: 9, freshness: 2, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['desertni', 'bombon', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f1c84b', secondary: '#ffd6e6', accent: '#fbe3ec', background: '#302610', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Unicorn Treats i Strawberry, za jagode sa šlagom.',
        'Unicorn Treats i Vanilla Cream, za još slađi desert.'
      ],
      en: [
        'Unicorn Treats and Strawberry, for strawberries and cream.',
        'Unicorn Treats and Vanilla Cream, for an even sweeter dessert.'
      ]
    },
    similar: ['musthave-milky-rice', 'musthave-cacao']
  },
  {
    id: 'musthave-violet',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Violet',
    shortDescription: {
      bs: 'Egzotični kremasti šejk od borovnice i zlatne dinje, sa začinima.',
      en: 'An exotic creamy shake of blueberry and golden melon, with spices.'
    },
    description: {
      bs: [
        'Violet je kremasti šejk sa nježnom borovnicom i svježinom zlatne dinje, začinjen toplim mirisom začina.',
        'Neobična kombinacija: voćna, kremasta i blago začinska u isto vrijeme.',
        'Tamni list: rastresito pakovanje i strpljenje. Dobar uz kafu ili čaj.'
      ],
      en: [
        'Violet is a creamy shake with delicate blueberry and the freshness of golden melon, seasoned with warm spices.',
        'An unusual combination: fruity, creamy and lightly spiced at the same time.',
        'Dark leaf: pack it loose and be patient. Goes well with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4a5fc1', intensity: 8 },
      { name: { bs: 'Dinja', en: 'Melon' }, illustration: 'dinja', color: '#f5b04a', intensity: 6 },
      { name: { bs: 'Šejk', en: 'Shake' }, illustration: 'sejk', color: '#ede6f5', intensity: 5 },
      { name: { bs: 'Začini', en: 'Spices' }, illustration: 'kardamom', color: '#9a8a4a', intensity: 3 }
    ],
    profile: { sweetness: 7, freshness: 4, fruitiness: 7, cooling: 0, strength: 7 },
    tags: ['desertni', 'vocni', 'zacinski'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#4a5fc1', secondary: '#f5b04a', accent: '#ede6f5', background: '#151523', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Violet i Blueberry, za više borovnice.',
        'Violet i Vanilla Cream, za kremastiji šejk.'
      ],
      en: [
        'Violet and Blueberry, for more blueberry.',
        'Violet and Vanilla Cream, for a creamier shake.'
      ]
    },
    similar: ['musthave-blueberry', 'musthave-sweet-melon', 'musthave-tipsy', 'element-blueberry-yogurt']
  },
  {
    id: 'musthave-choco-mint',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Choco Mint',
    shortDescription: {
      bs: 'Tamna čokolada sa nježnim hladnim dahom krem mente.',
      en: 'Dark chocolate with the gentle chill of mint cream.'
    },
    description: {
      bs: [
        'Choco Mint je elegantna kombinacija tamne čokolade i nježne krem mente, kao poznata čokoladica sa mentom.',
        'Hlađenje je blago i kremasto, ne oštro, pa čokolada ostaje glavna.',
        'Tamni list sa hlađenjem: rastresito pakovanje i umjerena toplota, jer previše uglja ubije svježinu.'
      ],
      en: [
        'Choco Mint is an elegant pairing of dark chocolate and delicate mint cream, like the famous after-dinner mints.',
        'The cooling is light and creamy, not sharp, so the chocolate stays in front.',
        'Dark leaf with cooling: pack it loose and keep the heat moderate, because too much coal kills the freshness.'
      ]
    },
    ingredients: [
      { name: { bs: 'Tamna čokolada', en: 'Dark chocolate' }, illustration: 'cokolada', color: '#3e2316', intensity: 8 },
      { name: { bs: 'Krem menta', en: 'Mint cream' }, illustration: 'menta', color: '#7fd6a8', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 0, cooling: 4, strength: 7 },
    tags: ['desertni', 'mint'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'frost',
    palette: { primary: '#3e2316', secondary: '#7fd6a8', accent: '#a89c96', background: '#130b08', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Choco Mint i Cookie, za mint keks.',
        'Choco Mint i Cacao, za toplu čokoladu sa mentom.'
      ],
      en: [
        'Choco Mint and Cookie, for a mint cookie.',
        'Choco Mint and Cacao, for hot chocolate with mint.'
      ]
    },
    similar: ['fumari-mint-chocolate-chill', 'musthave-cacao', 'musthave-cookie', 'tangiers-cocoa']
  },
  {
    id: 'musthave-apple-drops',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Apple Drops',
    shortDescription: {
      bs: 'Sočan, prirodan okus slatkih bombona od jabuke koji se tope u ustima.',
      en: 'The juicy, natural taste of sweet apple candies that melt in your mouth.'
    },
    description: {
      bs: [
        'Apple Drops je okus bombona od svježe jabuke: sočan, sladak i prirodan, kao lizalica od zelene jabuke.',
        'Jabuka je svježa i hrskava, a bombonasta slatkoća je mekana.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Apple Drops is the taste of fresh apple candy: juicy, sweet and natural, like a green apple drop.',
        'The apple is fresh and crisp, and the candy sweetness is soft.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Jabuka', en: 'Apple' }, illustration: 'jabuka', color: '#8cc63f', intensity: 9 },
      { name: { bs: 'Bombon', en: 'Candy' }, illustration: 'bombon', color: '#c8e86a', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'bombon', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#8cc63f', secondary: '#c8e86a', accent: '#cbe5a9', background: '#20260e', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Apple Drops i Cinnamon, za jabuku sa cimetom.',
        'Apple Drops i Ice Mint, za ledenu jabuku.'
      ],
      en: [
        'Apple Drops and Cinnamon, for apple and cinnamon.',
        'Apple Drops and Ice Mint, for icy apple.'
      ]
    },
    similar: ['musthave-sour-apple', 'musthave-charlotte-pie', 'al-fakher-double-apple', 'musthave-barberry-candy']
  },
  {
    id: 'musthave-barberry-candy',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Barberry Candy',
    shortDescription: {
      bs: 'Nostalgičan, bogat okus omiljene bombone od žutike iz djetinjstva.',
      en: 'The nostalgic, rich taste of the favorite childhood barberry candy.'
    },
    description: {
      bs: [
        'Barberry Candy je okus bombone od žutike (barberry): slatke, kiselkaste i pomalo voćne.',
        'Poznat okus iz djetinjstva u istočnoj Evropi. Bombonast, ali sa živom kiselinom.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Barberry Candy is the taste of barberry hard candy: sweet, tangy and a little fruity.',
        'A well known childhood taste in Eastern Europe. Candy-like, but with a lively tang.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Žutika', en: 'Barberry' }, illustration: 'grozdic', color: '#d1213b', intensity: 8 },
      { name: { bs: 'Bombon', en: 'Candy' }, illustration: 'bombon', color: '#e8455a', intensity: 7 }
    ],
    profile: { sweetness: 8, freshness: 5, fruitiness: 6, cooling: 0, strength: 7 },
    tags: ['bombon', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#d1213b', secondary: '#e8455a', accent: '#ea9ba7', background: '#2b0b0e', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Barberry Candy i Lemon-Lime, za kiseliju bombonu.',
        'Barberry Candy i Ice Mint, za ledenu bombonu.'
      ],
      en: [
        'Barberry Candy and Lemon-Lime, for a sourer candy.',
        'Barberry Candy and Ice Mint, for an icy candy.'
      ]
    },
    similar: ['musthave-fizzy-dizzy', 'musthave-candy-cow', 'musthave-apple-drops']
  },
  {
    id: 'musthave-earl-grey',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Earl Grey',
    shortDescription: {
      bs: 'Klasičan, dubok ukus čaja sa jarkim bergamotom.',
      en: 'A classic, deep tea taste with bright bergamot.'
    },
    description: {
      bs: [
        'Earl Grey je crni čaj sa bergamotom: dubok, pomalo opor i citrusno mirisan.',
        'Bergamot daje cvjetni citrus koji ovaj čaj čini prepoznatljivim. Okus za mirne večeri.',
        'Tamni list: rastresito pakovanje i blaga toplota, da se čajne i začinske note ne zapeku.'
      ],
      en: [
        'Earl Grey is black tea with bergamot: deep, slightly astringent and citrus-scented.',
        'Bergamot gives the floral citrus note that makes this tea recognisable. A flavor for quiet evenings.',
        'Dark leaf: pack it loose and keep the heat gentle, so the tea and spice notes do not burn.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crni čaj', en: 'Black tea' }, illustration: 'caj', color: '#8a4a1c', intensity: 8 },
      { name: { bs: 'Bergamot', en: 'Bergamot' }, illustration: 'limun', color: '#c9d65a', intensity: 6 }
    ],
    profile: { sweetness: 4, freshness: 4, fruitiness: 3, cooling: 0, strength: 7 },
    tags: ['caj', 'klasicni', 'citrusni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#8a4a1c', secondary: '#c9d65a', accent: '#caae99', background: '#1f1209', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Earl Grey i Sweet Peach, za ledeni čaj od breskve.',
        'Earl Grey i Lemon-Lime, za čaj sa limunom.'
      ],
      en: [
        'Earl Grey and Sweet Peach, for a peach iced tea.',
        'Earl Grey and Lemon-Lime, for tea with lemon.'
      ]
    },
    similar: ['musthave-milk-oolong', 'musthave-red-tea', 'musthave-masala-tea', 'musthave-morocco']
  },
  {
    id: 'musthave-milk-oolong',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Milk Oolong',
    shortDescription: {
      bs: 'Nježan kineski zeleni čaj sa mliječnim mirisom.',
      en: 'Delicate Chinese green tea with a milky aroma.'
    },
    description: {
      bs: [
        'Milk Oolong je kineski oolong čaj sa prirodnim mliječnim mirisom: nježan, kremast i blago cvjetan.',
        'Lagan i smiren okus, bez kiseline. Za ljubitelje čaja i mekih okusa.',
        'Tamni list: rastresito pakovanje i blaga toplota, da se čajne i začinske note ne zapeku.'
      ],
      en: [
        'Milk Oolong is Chinese oolong tea with a natural milky aroma: delicate, creamy and lightly floral.',
        'A light, calm flavor with no sourness. For tea lovers and fans of soft flavors.',
        'Dark leaf: pack it loose and keep the heat gentle, so the tea and spice notes do not burn.'
      ]
    },
    ingredients: [
      { name: { bs: 'Oolong čaj', en: 'Oolong tea' }, illustration: 'caj', color: '#9cb04a', intensity: 8 },
      { name: { bs: 'Mlijeko', en: 'Milk' }, illustration: 'sejk', color: '#fbf3e3', intensity: 6 }
    ],
    profile: { sweetness: 5, freshness: 4, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['caj', 'klasicni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#9cb04a', secondary: '#fbf3e3', accent: '#d2dbae', background: '#222210', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Milk Oolong i Mad Pear, za čaj sa kruškom.',
        'Milk Oolong i Vanilla Cream, za mliječni čaj.'
      ],
      en: [
        'Milk Oolong and Mad Pear, for tea with pear.',
        'Milk Oolong and Vanilla Cream, for a milk tea.'
      ]
    },
    similar: ['musthave-earl-grey', 'musthave-milky-rice', 'musthave-masala-tea']
  },
  {
    id: 'musthave-masala-tea',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Masala Tea',
    shortDescription: {
      bs: 'Sladak, začinjen čaj sa finim notama orijentalnih začina.',
      en: 'A sweet spiced tea with fine notes of oriental spices.'
    },
    description: {
      bs: [
        'Masala Tea je indijski začinjeni čaj (masala chai): slatki crni čaj sa mlijekom, kardamomom, cimetom i đumbirom.',
        'Topao, mirisan i kremast okus koji grije. Odličan za zimu.',
        'Tamni list: rastresito pakovanje i blaga toplota, da se čajne i začinske note ne zapeku.'
      ],
      en: [
        'Masala Tea is Indian spiced tea (masala chai): sweet black tea with milk, cardamom, cinnamon and ginger.',
        'A warm, fragrant and creamy flavor that heats you up. Great for winter.',
        'Dark leaf: pack it loose and keep the heat gentle, so the tea and spice notes do not burn.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crni čaj', en: 'Black tea' }, illustration: 'caj', color: '#8a4a1c', intensity: 7 },
      { name: { bs: 'Kardamom', en: 'Cardamom' }, illustration: 'kardamom', color: '#9a8a4a', intensity: 6 },
      { name: { bs: 'Cimet', en: 'Cinnamon' }, illustration: 'cimet', color: '#a0522d', intensity: 5 },
      { name: { bs: 'Đumbir', en: 'Ginger' }, illustration: 'djumbir', color: '#f2d27a', intensity: 4 }
    ],
    profile: { sweetness: 7, freshness: 2, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['caj', 'zacinski'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#8a4a1c', secondary: '#9a8a4a', accent: '#a0522d', background: '#1f1209', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Masala Tea i Vanilla Cream, za chai latte.',
        'Masala Tea i Cinnamon Roll, za čaj i kiflicu.'
      ],
      en: [
        'Masala Tea and Vanilla Cream, for a chai latte.',
        'Masala Tea and Cinnamon Roll, for tea and a bun.'
      ]
    },
    similar: ['fumari-spiced-chai', 'musthave-morocco', 'musthave-earl-grey', 'musthave-mulled-wine']
  },
  {
    id: 'musthave-morocco',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Morocco',
    shortDescription: {
      bs: 'Topao miris tradicionalnog marokanskog citrusnog čaja sa začinima.',
      en: 'The warm aroma of traditional Moroccan citrus tea with spices.'
    },
    description: {
      bs: [
        'Morocco je tradicionalni marokanski čaj sa citrusima i začinima: nježan, topao i mirisan.',
        'Citrus daje svježinu, a začini toplinu. Okus podsjeća na čaj poslije večere u Marakešu.',
        'Tamni list: rastresito pakovanje i blaga toplota, da se čajne i začinske note ne zapeku.'
      ],
      en: [
        'Morocco is a traditional Moroccan tea with citrus and spices: subtle, warm and fragrant.',
        'Citrus brings freshness and spices the warmth. It recalls an after-dinner tea in Marrakesh.',
        'Dark leaf: pack it loose and keep the heat gentle, so the tea and spice notes do not burn.'
      ]
    },
    ingredients: [
      { name: { bs: 'Čaj', en: 'Tea' }, illustration: 'caj', color: '#a8632a', intensity: 7 },
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff7a00', intensity: 5 },
      { name: { bs: 'Začini', en: 'Spices' }, illustration: 'cimet', color: '#a0522d', intensity: 5 }
    ],
    profile: { sweetness: 5, freshness: 4, fruitiness: 3, cooling: 0, strength: 7 },
    tags: ['caj', 'zacinski', 'citrusni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#a8632a', secondary: '#ff7a00', accent: '#a0522d', background: '#24160b', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Morocco i Ice Mint, za marokanski čaj od mente.',
        'Morocco i Mandarin, za više citrusa.'
      ],
      en: [
        'Morocco and Ice Mint, for a Moroccan mint tea.',
        'Morocco and Mandarin, for more citrus.'
      ]
    },
    similar: ['musthave-masala-tea', 'musthave-red-tea', 'musthave-earl-grey']
  },
  {
    id: 'musthave-red-tea',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Red Tea',
    shortDescription: {
      bs: 'Opor miris crvenog voćnog čaja.',
      en: 'The tart aroma of red fruit tea.'
    },
    description: {
      bs: [
        'Red Tea je crveni voćni čaj, kao onaj od hibiskusa i crvenog voća: opor, kiselkast i voćan.',
        'Lagan je i osvježavajući, sa bobičastom kiselinom. Pije se i topao i hladan.',
        'Tamni list: rastresito pakovanje i blaga toplota, da se čajne i začinske note ne zapeku.'
      ],
      en: [
        'Red Tea is a red fruit tea, like one made with hibiscus and red fruit: tart, tangy and fruity.',
        'Light and refreshing, with a berry sourness. Works hot or iced.',
        'Dark leaf: pack it loose and keep the heat gentle, so the tea and spice notes do not burn.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crveni čaj', en: 'Red tea' }, illustration: 'caj', color: '#b0233a', intensity: 8 },
      { name: { bs: 'Crveno voće', en: 'Red fruit' }, illustration: 'malina', color: '#d61f5b', intensity: 5 }
    ],
    profile: { sweetness: 5, freshness: 5, fruitiness: 6, cooling: 0, strength: 7 },
    tags: ['caj', 'bobicasti'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#b0233a', secondary: '#d61f5b', accent: '#db9ca6', background: '#250b0d', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Red Tea i Raspberry, za čaj sa malinom.',
        'Red Tea i Frosty, za ledeni čaj.'
      ],
      en: [
        'Red Tea and Raspberry, for raspberry tea.',
        'Red Tea and Frosty, for an iced tea.'
      ]
    },
    similar: ['musthave-earl-grey', 'musthave-sea-buckthorn-tea', 'musthave-morocco']
  },
  {
    id: 'musthave-sea-buckthorn-tea',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Sea Buckthorn Tea',
    shortDescription: {
      bs: 'Zreli, sočni pasji trn sa notama grejpfruta i đumbira.',
      en: 'Ripe, juicy sea buckthorn with hints of grapefruit and ginger.'
    },
    description: {
      bs: [
        'Sea Buckthorn Tea je čaj od pasjeg trna (rakitovca): narandžastih bobica kiselkastog, tropskog ukusa.',
        'Grejpfrut dodaje citrus, a đumbir blagu ljutinu. Topao, voćan i drugačiji čaj.',
        'Tamni list: rastresito pakovanje i blaga toplota, da se čajne i začinske note ne zapeku.'
      ],
      en: [
        'Sea Buckthorn Tea is a tea of sea buckthorn: orange berries with a tangy, almost tropical taste.',
        'Grapefruit adds citrus and ginger a light heat. A warm, fruity and different tea.',
        'Dark leaf: pack it loose and keep the heat gentle, so the tea and spice notes do not burn.'
      ]
    },
    ingredients: [
      { name: { bs: 'Pasji trn', en: 'Sea buckthorn' }, illustration: 'grozdic', color: '#f59a1c', intensity: 8 },
      { name: { bs: 'Grejpfrut', en: 'Grapefruit' }, illustration: 'grejpfrut', color: '#f26b6b', intensity: 5 },
      { name: { bs: 'Đumbir', en: 'Ginger' }, illustration: 'djumbir', color: '#f2d27a', intensity: 4 }
    ],
    profile: { sweetness: 5, freshness: 6, fruitiness: 7, cooling: 0, strength: 7 },
    tags: ['caj', 'vocni', 'zacinski'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#f59a1c', secondary: '#f26b6b', accent: '#f2d27a', background: '#301f09', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Sea Buckthorn Tea i Honey Holls, za čaj sa medom.',
        'Sea Buckthorn Tea i Mandarin, za zimski citrus.'
      ],
      en: [
        'Sea Buckthorn Tea and Honey Holls, for tea with honey.',
        'Sea Buckthorn Tea and Mandarin, for winter citrus.'
      ]
    },
    similar: ['musthave-red-tea', 'musthave-masala-tea', 'musthave-grapefruit']
  },
  {
    id: 'musthave-cinnamon',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Cinnamon',
    shortDescription: {
      bs: 'Prijatan, začinsko-sladak, topao i baršunast cimet sa Šri Lanke.',
      en: 'Pleasant, spicy-sweet, warm and velvety Sri Lankan cinnamon.'
    },
    description: {
      bs: [
        'Cinnamon je cejlonski cimet sa Šri Lanke: sladak, topao i baršunast, bez oštre ljutine.',
        'Sam je za ljubitelje začina, a u miksu daje toplinu jabuci, čokoladi i kafi.',
        'Tamni list: rastresito pakovanje i blaga toplota, da se čajne i začinske note ne zapeku.'
      ],
      en: [
        'Cinnamon is Ceylon cinnamon from Sri Lanka: sweet, warm and velvety, without a harsh bite.',
        'On its own it is for spice lovers, and in a mix it adds warmth to apple, chocolate and coffee.',
        'Dark leaf: pack it loose and keep the heat gentle, so the tea and spice notes do not burn.'
      ]
    },
    ingredients: [
      { name: { bs: 'Cimet', en: 'Cinnamon' }, illustration: 'cimet', color: '#a0522d', intensity: 9 }
    ],
    profile: { sweetness: 5, freshness: 1, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['zacinski'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#a0522d', secondary: '#c18f77', accent: '#d4b1a1', background: '#23130b', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Cinnamon i Apple Drops, za jabuku sa cimetom.',
        'Cinnamon i Cacao, za začinjenu čokoladu.'
      ],
      en: [
        'Cinnamon and Apple Drops, for apple and cinnamon.',
        'Cinnamon and Cacao, for spiced hot chocolate.'
      ]
    },
    similar: ['musthave-cinnamon-roll', 'musthave-mulled-wine', 'musthave-masala-tea']
  },
  {
    id: 'musthave-baikal',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Baikal',
    shortDescription: {
      bs: 'Složena kombinacija šumskog bilja obavijena mirisom četinara.',
      en: 'A complex blend of forest herbs wrapped in the scent of conifers.'
    },
    description: {
      bs: [
        'Baikal je okus poznatog biljnog osvježavajućeg pića: šumsko bilje i četinari, plemenit i složen.',
        'Okus je biljni, blago smolast i svjež. Neobičan, za one koji traže nešto drugačije.',
        'Tamni list: rastresito pakovanje i blaga toplota, da se čajne i začinske note ne zapeku.'
      ],
      en: [
        'Baikal is the taste of a well known herbal soft drink: forest herbs and conifers, noble and complex.',
        'It is herbal, lightly resinous and fresh. Unusual, for those looking for something different.',
        'Dark leaf: pack it loose and keep the heat gentle, so the tea and spice notes do not burn.'
      ]
    },
    ingredients: [
      { name: { bs: 'Šumsko bilje', en: 'Forest herbs' }, illustration: 'bilje', color: '#5e8a3a', intensity: 8 },
      { name: { bs: 'Četinari', en: 'Conifers' }, illustration: 'jelka', color: '#2f6b3a', intensity: 6 }
    ],
    profile: { sweetness: 5, freshness: 7, fruitiness: 0, cooling: 0, strength: 7 },
    tags: ['biljni', 'pice'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'mist',
    palette: { primary: '#5e8a3a', secondary: '#2f6b3a', accent: '#b7caa6', background: '#181c0d', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Baikal i Lemon-Lime, za biljnu limunadu.',
        'Baikal i Cola, za biljnu kolu.'
      ],
      en: [
        'Baikal and Lemon-Lime, for a herbal lemonade.',
        'Baikal and Cola, for a herbal cola.'
      ]
    },
    similar: ['musthave-yolka', 'musthave-estragon']
  },
  {
    id: 'musthave-yolka',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Yolka',
    shortDescription: {
      bs: 'Miris jelke koji vodi u četinarsku šumu poslije jake kiše.',
      en: 'The scent of a fir tree that takes you to a pine forest after heavy rain.'
    },
    description: {
      bs: [
        'Yolka (Ёлка, jelka) je miris božićne jelke: svjež, smolast i zelen, kao šuma četinara poslije kiše.',
        'Nije menta, nego čist miris četina. Praznični okus koji se rijetko nalazi.',
        'Tamni list: rastresito pakovanje i blaga toplota, da se čajne i začinske note ne zapeku.'
      ],
      en: [
        'Yolka (Ёлка, fir tree) is the scent of a Christmas tree: fresh, resinous and green, like a pine forest after rain.',
        'It is not mint but the pure smell of pine needles. A festive flavor you rarely find.',
        'Dark leaf: pack it loose and keep the heat gentle, so the tea and spice notes do not burn.'
      ]
    },
    ingredients: [
      { name: { bs: 'Jelka', en: 'Fir' }, illustration: 'jelka', color: '#2f6b3a', intensity: 9 }
    ],
    profile: { sweetness: 3, freshness: 8, fruitiness: 0, cooling: 1, strength: 7 },
    tags: ['biljni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'mist',
    palette: { primary: '#2f6b3a', secondary: '#789f7f', accent: '#a1bca6', background: '#11170d', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Yolka i Mandarin, za novogodišnji miks.',
        'Yolka i Lemon Tonic, za džin i tonik.'
      ],
      en: [
        'Yolka and Mandarin, for a New Year bowl.',
        'Yolka and Lemon Tonic, for a gin and tonic.'
      ]
    },
    similar: ['musthave-baikal', 'musthave-christmas-drink']
  },
  {
    id: 'musthave-peppermint',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Peppermint',
    shortDescription: {
      bs: 'Dubok, bogat pepermint sa nevjerovatno slatkim krajem.',
      en: 'Deep, rich peppermint with an incredibly sweet aftertaste.'
    },
    description: {
      bs: [
        'Peppermint je dubok, bogat pepermint sa slatkim krajem, kao bombon od mente.',
        'Hladi, ali nije ledeni mentol. Klasičan dodatak voćnim miksevima.',
        'Tamni list sa hlađenjem: rastresito pakovanje i umjerena toplota, jer previše uglja ubije svježinu.'
      ],
      en: [
        'Peppermint is a deep, rich peppermint with a sweet finish, like a mint candy.',
        'It cools, but it is not icy menthol. A classic addition to fruit mixes.',
        'Dark leaf with cooling: pack it loose and keep the heat moderate, because too much coal kills the freshness.'
      ]
    },
    ingredients: [
      { name: { bs: 'Pepermint', en: 'Peppermint' }, illustration: 'pepermint', color: '#3fc08a', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 9, fruitiness: 0, cooling: 5, strength: 7 },
    tags: ['mint', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'frost',
    palette: { primary: '#3fc08a', secondary: '#82d6b3', accent: '#a9e3ca', background: '#13251a', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Peppermint i Watermelon, za lubenicu sa mentom.',
        'Peppermint i Cacao, za čokoladu sa mentom.'
      ],
      en: [
        'Peppermint and Watermelon, for watermelon mint.',
        'Peppermint and Cacao, for chocolate mint.'
      ]
    },
    similar: ['musthave-ice-mint', 'trifecta-peppermint-shake', 'al-fakher-mint']
  },
  {
    id: 'musthave-ice-mint',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Ice Mint',
    shortDescription: {
      bs: 'Jarka žvaka od mente sa bogatim efektom hlađenja.',
      en: 'Bright mint chewing gum with a rich cooling effect.'
    },
    description: {
      bs: [
        'Ice Mint je okus mint žvake sa jakim hlađenjem: slatko, mentolno i ledeno.',
        'Hladi jasno i dugo. Sam je za ljubitelje leda, a u miksu doda svježinu bilo kojem voću.',
        'Tamni list sa hlađenjem: rastresito pakovanje i umjerena toplota, jer previše uglja ubije svježinu.'
      ],
      en: [
        'Ice Mint is the taste of mint chewing gum with strong cooling: sweet, minty and icy.',
        'It cools clearly and for a long time. Alone it is for ice lovers, and in a mix it freshens any fruit.',
        'Dark leaf with cooling: pack it loose and keep the heat moderate, because too much coal kills the freshness.'
      ]
    },
    ingredients: [
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#3fc08a', intensity: 8 },
      { name: { bs: 'Žvaka', en: 'Chewing gum' }, illustration: 'zvaka', color: '#7fd6c8', intensity: 6 },
      { name: { bs: 'Hlađenje', en: 'Cooling' }, illustration: 'kristal', color: '#bfeeff', intensity: 7 }
    ],
    profile: { sweetness: 6, freshness: 10, fruitiness: 0, cooling: 8, strength: 7 },
    tags: ['mint', 'ledeni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'frost',
    palette: { primary: '#3fc08a', secondary: '#7fd6c8', accent: '#bfeeff', background: '#13251a', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Ice Mint i Watermelon, za ledenu lubenicu.',
        'Ice Mint i Lemon-Lime, za mohito.'
      ],
      en: [
        'Ice Mint and Watermelon, for icy watermelon.',
        'Ice Mint and Lemon-Lime, for a mojito.'
      ]
    },
    similar: ['musthave-peppermint', 'musthave-frosty', 'mazaya-gum-mint', 'musthave-honey-holls']
  },
  {
    id: 'musthave-frosty',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Frosty',
    shortDescription: {
      bs: 'Okrepljujuć i svjež, kao dah mraznog jutarnjeg zraka poslije snijega.',
      en: 'Invigorating and fresh, like a breath of frosty morning air after snowfall.'
    },
    description: {
      bs: [
        'Frosty je čisto hlađenje, bez mente i bez voća: kao udah mraznog zraka poslije dugog snijega.',
        'Koristi se kao dodatak drugim okusima, da im se doda led. Sam je samo za one koji vole čist hlad.',
        'Tamni list sa hlađenjem: rastresito pakovanje i umjerena toplota, jer previše uglja ubije svježinu.'
      ],
      en: [
        'Frosty is pure cooling, with no mint and no fruit: like a breath of frosty air after a long snowfall.',
        'It is used as an add-on to other flavors to bring the ice. On its own it is only for lovers of pure cold.',
        'Dark leaf with cooling: pack it loose and keep the heat moderate, because too much coal kills the freshness.'
      ]
    },
    ingredients: [
      { name: { bs: 'Hlađenje', en: 'Cooling' }, illustration: 'kristal', color: '#bfeeff', intensity: 10 }
    ],
    profile: { sweetness: 2, freshness: 10, fruitiness: 0, cooling: 10, strength: 6 },
    tags: ['ledeni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'frost',
    mixRole: 'cooler',
    palette: { primary: '#bfeeff', secondary: '#d5f4ff', accent: '#e2f7ff', background: '#282c2d', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Frosty i Watermelon, za ledenu lubenicu (Frosty oko 20%).',
        'Frosty i Forest Berries, za ledene bobice.'
      ],
      en: [
        'Frosty and Watermelon, for icy watermelon (Frosty around 20%).',
        'Frosty and Forest Berries, for icy berries.'
      ]
    },
    similar: ['musthave-ice-mint', 'darkside-supernova', 'trifecta-twice-the-ice']
  },
  {
    id: 'musthave-honey-holls',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Honey Holls',
    shortDescription: {
      bs: 'Svježina mraznog zimskog dana sa toplim mirisom opornog meda.',
      en: 'The freshness of a frosty winter day with the warm aroma of tart honey.'
    },
    description: {
      bs: [
        'Honey Holls je okus medene bombone za grlo: hladna svježina i topao, pomalo opor med.',
        'Hlađenje i med se lijepo dopunjuju, kao bombon od meda i mentola zimi.',
        'Tamni list sa hlađenjem: rastresito pakovanje i umjerena toplota, jer previše uglja ubije svježinu.'
      ],
      en: [
        'Honey Holls is the taste of a honey throat drop: cold freshness and warm, slightly tart honey.',
        'The cooling and honey complement each other nicely, like a honey menthol drop in winter.',
        'Dark leaf with cooling: pack it loose and keep the heat moderate, because too much coal kills the freshness.'
      ]
    },
    ingredients: [
      { name: { bs: 'Med', en: 'Honey' }, illustration: 'med', color: '#e0a43a', intensity: 8 },
      { name: { bs: 'Hlađenje', en: 'Cooling' }, illustration: 'kristal', color: '#bfeeff', intensity: 7 },
      { name: { bs: 'Bombon', en: 'Candy' }, illustration: 'bombon', color: '#f2c14e', intensity: 4 }
    ],
    profile: { sweetness: 7, freshness: 9, fruitiness: 0, cooling: 7, strength: 7 },
    tags: ['medeni', 'ledeni', 'bombon'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'frost',
    palette: { primary: '#e0a43a', secondary: '#bfeeff', accent: '#f2c14e', background: '#2d200d', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Honey Holls i Lemon-Lime, za med i limun.',
        'Honey Holls i Sea Buckthorn Tea, za čaj sa medom.'
      ],
      en: [
        'Honey Holls and Lemon-Lime, for honey and lemon.',
        'Honey Holls and Sea Buckthorn Tea, for tea with honey.'
      ]
    },
    similar: ['musthave-berry-holls', 'musthave-ice-mint', '187-glacier']
  },
  {
    id: 'musthave-berry-holls',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Berry Holls',
    shortDescription: {
      bs: 'Svježe šumske bobice sa hladnim dahom eukaliptusa.',
      en: 'Fresh wild berries with the cold breath of eucalyptus.'
    },
    description: {
      bs: [
        'Berry Holls je okus šumskih bobica sa eukaliptusom, kao bombon za grlo od bobica.',
        'Bobice su slatke i sočne, a eukaliptus daje hladnu, biljnu svježinu.',
        'Tamni list sa hlađenjem: rastresito pakovanje i umjerena toplota, jer previše uglja ubije svježinu.'
      ],
      en: [
        'Berry Holls is the taste of wild berries with eucalyptus, like a berry throat drop.',
        'The berries are sweet and juicy, and eucalyptus brings a cold, herbal freshness.',
        'Dark leaf with cooling: pack it loose and keep the heat moderate, because too much coal kills the freshness.'
      ]
    },
    ingredients: [
      { name: { bs: 'Šumske bobice', en: 'Wild berries' }, illustration: 'malina', color: '#c2185b', intensity: 8 },
      { name: { bs: 'Eukaliptus', en: 'Eucalyptus' }, illustration: 'bilje', color: '#5fa8a0', intensity: 6 },
      { name: { bs: 'Hlađenje', en: 'Cooling' }, illustration: 'kristal', color: '#bfeeff', intensity: 6 }
    ],
    profile: { sweetness: 6, freshness: 9, fruitiness: 7, cooling: 7, strength: 7 },
    tags: ['bobicasti', 'ledeni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'frost',
    palette: { primary: '#c2185b', secondary: '#5fa8a0', accent: '#bfeeff', background: '#280a13', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Berry Holls i Forest Berries, za više bobica.',
        'Berry Holls i Lemon-Lime, za kiseliju svježinu.'
      ],
      en: [
        'Berry Holls and Forest Berries, for more berries.',
        'Berry Holls and Lemon-Lime, for a sharper freshness.'
      ]
    },
    similar: ['musthave-honey-holls', 'musthave-forest-berries', 'musthave-ice-mint']
  },
  {
    id: 'musthave-quince',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Quince',
    shortDescription: {
      bs: 'Slatka, opora zrela dunja, fino začinjena notama anisa.',
      en: 'Sweet, tart ripe quince, nicely spiced with notes of anise.'
    },
    description: {
      bs: [
        'Quince je zrela dunja: slatka, mirisna i pomalo opora, sa laganom notom anisa.',
        'Dunja ima poseban, gotovo parfemski miris. Anis ga zaokruži i doda blagu začinsku notu.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Quince is ripe quince: sweet, fragrant and slightly tart, with a light note of anise.',
        'Quince has a special, almost perfumed aroma. Anise rounds it off with a gentle spice.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Dunja', en: 'Quince' }, illustration: 'kruska', color: '#e8c547', intensity: 9 },
      { name: { bs: 'Anis', en: 'Anise' }, illustration: 'anis', color: '#8a6a3a', intensity: 3 }
    ],
    profile: { sweetness: 7, freshness: 4, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'zacinski'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'honey',
    palette: { primary: '#e8c547', secondary: '#8a6a3a', accent: '#f5e5ac', background: '#2e2510', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Quince i Cinnamon, za pečenu dunju.',
        'Quince i Mad Pear, za dunju i krušku.'
      ],
      en: [
        'Quince and Cinnamon, for baked quince.',
        'Quince and Mad Pear, for quince and pear.'
      ]
    },
    similar: ['musthave-mad-pear', 'musthave-feijoa']
  },
  {
    id: 'musthave-feijoa',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Feijoa',
    shortDescription: {
      bs: 'Opor, opojan miris zrele feijoe sa južnog sunca.',
      en: 'The tart, heady aroma of ripe feijoa from the southern sun.'
    },
    description: {
      bs: [
        'Feijoa je zeleni egzotični plod koji podsjeća na mješavinu ananasa, guave i jagode, sa opornim krajem.',
        'Okus je mirisan, kiselkast i neobičan. Za one koji vole da probaju nove voćke.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Feijoa is a green exotic fruit that tastes like a mix of pineapple, guava and strawberry, with a tart finish.',
        'It is fragrant, tangy and unusual. For those who like to try new fruits.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Zrela feijoa', en: 'Ripe feijoa' }, illustration: 'plod', color: '#7fae3e', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'tropski'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#7fae3e', secondary: '#acca82', accent: '#c5dba8', background: '#1e220e', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Feijoa i Gooseberry, za zeleno kiselo voće.',
        'Feijoa i Strawberry, za slađi miks.'
      ],
      en: [
        'Feijoa and Gooseberry, for green tart fruit.',
        'Feijoa and Strawberry, for a sweeter bowl.'
      ]
    },
    similar: ['musthave-gooseberry', 'musthave-guanapapa', 'musthave-quince', 'musthave-marula']
  },
  {
    id: 'musthave-marula',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Marula',
    shortDescription: {
      bs: 'Sladak, složen ukus egzotične afričke voćke marule.',
      en: 'The sweet, complex taste of the exotic African marula fruit.'
    },
    description: {
      bs: [
        'Marula je žuta afrička voćka slatkog, složenog ukusa: između manga, šljive i citrusa.',
        'Okus je sočan i egzotičan, sa blagom kiselinom. Rijetka voćka u svijetu nargile.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Marula is a yellow African fruit with a sweet, complex taste: somewhere between mango, plum and citrus.',
        'It is juicy and exotic, with a light tang. A rare fruit in the hookah world.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Marula', en: 'Marula fruit' }, illustration: 'plod', color: '#f0c040', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'tropski'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f0c040', secondary: '#f5d683', accent: '#f8e3a9', background: '#30250e', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Marula i Vanilla Cream, za kremasti egzotični miks.',
        'Marula i Mango Sling, za tropsku limunadu.'
      ],
      en: [
        'Marula and Vanilla Cream, for a creamy exotic bowl.',
        'Marula and Mango Sling, for a tropical lemonade.'
      ]
    },
    similar: ['musthave-guanapapa', 'musthave-feijoa', 'musthave-tropic-juice']
  },
  {
    id: 'musthave-guanapapa',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Guanapapa',
    shortDescription: {
      bs: 'Egzotični miris kremaste guanabane sa nježnom papajom.',
      en: 'The exotic aroma of creamy soursop with delicate papaya.'
    },
    description: {
      bs: [
        'Guanapapa spaja guanabanu (soursop), kremastu tropsku voćku, i nježnu papaju.',
        'Okus je kremast, sladak i blago kiselkast. Tropski, ali mekan.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Guanapapa combines guanabana (soursop), a creamy tropical fruit, and delicate papaya.',
        'It is creamy, sweet and lightly tangy. Tropical, yet soft.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Guanabana', en: 'Soursop' }, illustration: 'guanabana', color: '#5a9a3a', intensity: 8 },
      { name: { bs: 'Papaja', en: 'Papaya' }, illustration: 'papaja', color: '#ff8a3d', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'tropski'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#5a9a3a', secondary: '#ff8a3d', accent: '#b5d2a6', background: '#181f0d', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Guanapapa i Coconut Shake, za tropski šejk.',
        'Guanapapa i Lemon-Lime, za kiseliji tropski miks.'
      ],
      en: [
        'Guanapapa and Coconut Shake, for a tropical shake.',
        'Guanapapa and Lemon-Lime, for a tangier tropical bowl.'
      ]
    },
    similar: ['musthave-marula', 'musthave-alova', 'musthave-pearl-pool', 'musthave-feijoa']
  },
  {
    id: 'musthave-alova',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Alova',
    shortDescription: {
      bs: 'Jarak miks kriški roze guave i sočne aloje.',
      en: 'A bright mix of pink guava slices and juicy aloe.'
    },
    description: {
      bs: [
        'Alova je miks roze guave i sočne aloje: slatko, tropsko voće i svježa, zelena aloja.',
        'Aloja daje čist, vodenast osvježavajući ukus, a guava slatkoću i miris.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Alova is a mix of pink guava and juicy aloe: sweet tropical fruit and fresh, green aloe.',
        'Aloe brings a clean, watery refreshment and guava the sweetness and aroma.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Roze guava', en: 'Pink guava' }, illustration: 'guava', color: '#f47a8a', intensity: 8 },
      { name: { bs: 'Aloja', en: 'Aloe' }, illustration: 'aloja', color: '#6aa84f', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'tropski', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#f47a8a', secondary: '#6aa84f', accent: '#fac3ca', background: '#30191a', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Alova i Ice Mint, za ledenu aloju.',
        'Alova i Strawberry, za roze tropski miks.'
      ],
      en: [
        'Alova and Ice Mint, for icy aloe.',
        'Alova and Strawberry, for a pink tropical bowl.'
      ]
    },
    similar: ['trifecta-pineapple-guava', 'musthave-guanapapa', 'musthave-pearl-pool', 'al-fakher-guava']
  },
  {
    id: 'musthave-pearl-pool',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Pearl Pool',
    shortDescription: {
      bs: 'Prozračni mus od svježeg tropskog voća sa slatko-kiselom notom moringe.',
      en: 'An airy mousse of fresh tropical fruit with a sweet and sour note of moringa.'
    },
    description: {
      bs: [
        'Pearl Pool je prozračni mus od tropskog voća, sa slatko-kiselom notom moringe.',
        'Mango i ananas daju voćnost, mus kremastu mekoću, a moringa neobičnu biljnu kiselinu.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Pearl Pool is an airy mousse of tropical fruit with a sweet and sour note of moringa.',
        'Mango and pineapple bring the fruit, the mousse a creamy softness and moringa an unusual herbal tang.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Tropsko voće', en: 'Tropical fruit' }, illustration: 'mango', color: '#ffb020', intensity: 8 },
      { name: { bs: 'Moringa', en: 'Moringa' }, illustration: 'bilje', color: '#7aa84a', intensity: 5 },
      { name: { bs: 'Mus', en: 'Mousse' }, illustration: 'sejk', color: '#fbf3e3', intensity: 5 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'tropski', 'desertni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ffb020', secondary: '#7aa84a', accent: '#fbf3e3', background: '#322209', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Pearl Pool i Coconut Shake, za tropski desert.',
        'Pearl Pool i Lemon-Lime, za kiseliji miks.'
      ],
      en: [
        'Pearl Pool and Coconut Shake, for a tropical dessert.',
        'Pearl Pool and Lemon-Lime, for a tangier bowl.'
      ]
    },
    similar: ['musthave-alova', 'musthave-tropic-juice', 'musthave-guanapapa', 'musthave-sour-tropic']
  },
  {
    id: 'musthave-nord-star',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Nord Star',
    shortDescription: {
      bs: 'Okrepljujuća slatko-kisela višnja sjevernoameričke sorte Nord Star.',
      en: 'Invigorating sweet and sour cherry of the North American Nord Star variety.'
    },
    description: {
      bs: [
        'Nord Star je višnja sjevernoameričke sorte Nord Star: sočna, slatko-kisela i živa.',
        'Kiselina je naglašena, pa je okus svjež i budi. Jedan od omiljenih okusa višnje.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Nord Star is a cherry of the North American Nord Star variety: juicy, sweet and sour, and lively.',
        'The sourness is pronounced, so it tastes fresh and wakes you up. A favorite cherry flavor.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Višnja', en: 'Sour cherry' }, illustration: 'visnja', color: '#a3122e', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 7, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'kiseli'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#a3122e', secondary: '#c36577', accent: '#d694a1', background: '#23090c', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Nord Star i Cola, za višnja kolu.',
        'Nord Star i Ice Mint, za ledenu višnju.'
      ],
      en: [
        'Nord Star and Cola, for a cherry cola.',
        'Nord Star and Ice Mint, for icy cherry.'
      ]
    },
    similar: ['musthave-cherry-juice', 'musthave-cherry-cola', 'adalya-cherry-mint']
  },
  {
    id: 'musthave-red-bomb',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Red Bomb',
    shortDescription: {
      bs: 'Raskošan, opor buket mirisnog južnog nara sa pikantnom gorčinom na kraju.',
      en: 'A lavish, tart bouquet of fragrant southern pomegranate with a piquant bitter finish.'
    },
    description: {
      bs: [
        'Red Bomb je zreo južni nar: opor, mirisan i sočan, sa blagom pikantnom gorčinom na kraju.',
        'Ta gorčina podsjeća na pravi nar i čini okus odraslim i složenim.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Red Bomb is a ripe southern pomegranate: tart, fragrant and juicy, with a light piquant bitterness at the end.',
        'That bitterness recalls real pomegranate and makes the flavor grown-up and complex.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Nar', en: 'Pomegranate' }, illustration: 'nar', color: '#b3122e', intensity: 9 }
    ],
    profile: { sweetness: 5, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'kiseli'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#b3122e', secondary: '#ce6577', accent: '#dd94a1', background: '#26090c', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Red Bomb i Lemon Tonic, za gorko-kiseli koktel.',
        'Red Bomb i Vanilla Cream, za ublaženi nar.'
      ],
      en: [
        'Red Bomb and Lemon Tonic, for a bitter-sour cocktail.',
        'Red Bomb and Vanilla Cream, for a softer pomegranate.'
      ]
    },
    similar: ['musthave-garnet-grape', 'musthave-cranberry']
  },
  {
    id: 'musthave-garnet-grape',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Garnet Grape',
    shortDescription: {
      bs: 'Slatko-kiseli miris južnog nara i sočnog grožđa.',
      en: 'The sweet and tangy aroma of southern pomegranate and juicy grapes.'
    },
    description: {
      bs: [
        'Garnet Grape spaja južni nar i sočno grožđe: slatko-kiseo i voćan okus.',
        'Grožđe daje slatkoću i sok, a nar kiselinu i oporost.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Garnet Grape brings together southern pomegranate and juicy grapes: sweet, tangy and fruity.',
        'Grape adds sweetness and juice, pomegranate the tang and tartness.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Nar', en: 'Pomegranate' }, illustration: 'nar', color: '#b3122e', intensity: 8 },
      { name: { bs: 'Grožđe', en: 'Grape' }, illustration: 'grozdje', color: '#6b2c7a', intensity: 7 }
    ],
    profile: { sweetness: 6, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#b3122e', secondary: '#6b2c7a', accent: '#dd94a1', background: '#26090c', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Garnet Grape i Ice Mint, za ledeno grožđe.',
        'Garnet Grape i Ruby Grape, za duplo grožđe.'
      ],
      en: [
        'Garnet Grape and Ice Mint, for icy grape.',
        'Garnet Grape and Ruby Grape, for double grape.'
      ]
    },
    similar: ['musthave-red-bomb', 'musthave-ruby-grape', 'al-fakher-grape-mint', 'musthave-araram']
  },
  {
    id: 'musthave-passion-plum',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Passion Plum',
    shortDescription: {
      bs: 'Višeslojan miris kiselkaste šljive i marakuje.',
      en: 'The layered aroma of tangy plum and passion fruit.'
    },
    description: {
      bs: [
        'Passion Plum spaja kiselkastu šljivu i egzotičnu marakuju. Okus je sočan, višeslojan i živ.',
        'Šljiva daje tamnu voćnost, a marakuja mirisni, kiseli vrh.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Passion Plum combines tangy plum and exotic passion fruit. Juicy, layered and lively.',
        'Plum brings a dark fruitiness and passion fruit a fragrant, sour top note.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Šljiva', en: 'Plum' }, illustration: 'sljiva', color: '#5b2a6e', intensity: 8 },
      { name: { bs: 'Marakuja', en: 'Passion fruit' }, illustration: 'marakuja', color: '#8a3f8f', intensity: 7 }
    ],
    profile: { sweetness: 6, freshness: 6, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'tropski', 'kiseli'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#5b2a6e', secondary: '#8a3f8f', accent: '#b59fbe', background: '#180d16', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Passion Plum i Vanilla Cream, za kremastu šljivu.',
        'Passion Plum i Cinnamon, za začinjenu šljivu.'
      ],
      en: [
        'Passion Plum and Vanilla Cream, for creamy plum.',
        'Passion Plum and Cinnamon, for spiced plum.'
      ]
    },
    similar: ['musthave-tropic-juice', 'musthave-araram', 'al-fakher-plum']
  },
  {
    id: 'musthave-araram',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Araram',
    shortDescription: {
      bs: 'Slatka lubenica, sočno grožđe i suha šljiva, začinjeni listićima mente.',
      en: 'Sweet watermelon, juicy grapes and fragrant prunes, seasoned with mint leaves.'
    },
    description: {
      bs: [
        'Araram spaja slatku lubenicu, sočno grožđe i mirisnu suhu šljivu, uz listiće mente.',
        'Lubenica i grožđe daju svježinu, suha šljiva dubinu, a menta lagano osvježenje.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Araram combines sweet watermelon, juicy grapes and fragrant prunes, with mint leaves.',
        'Watermelon and grape bring freshness, prunes the depth and mint a light lift.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8455a', intensity: 7 },
      { name: { bs: 'Grožđe', en: 'Grape' }, illustration: 'grozdje', color: '#6b2c7a', intensity: 7 },
      { name: { bs: 'Suha šljiva', en: 'Prune' }, illustration: 'sljiva', color: '#3a1a2e', intensity: 5 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#3fc08a', intensity: 3 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 2, strength: 7 },
    tags: ['vocni', 'ljetni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#e8455a', secondary: '#6b2c7a', accent: '#3a1a2e', background: '#2e1113', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Araram i Ice Mint, za više svježine.',
        'Araram i Watermelon, za više lubenice.'
      ],
      en: [
        'Araram and Ice Mint, for more freshness.',
        'Araram and Watermelon, for more watermelon.'
      ]
    },
    similar: ['musthave-watermelon', 'musthave-garnet-grape', 'musthave-passion-plum']
  },
  {
    id: 'musthave-space-flavour',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Space Flavour',
    shortDescription: {
      bs: 'Kosmička kombinacija manga, marakuje i ličija sa laticama ruže.',
      en: 'A cosmic combination of mango, passion fruit and lychee with rose petals.'
    },
    description: {
      bs: [
        'Space Flavour spaja mango, marakuju i liči, začinjene laticama ruže sa hladnom jutarnjom rosom.',
        'Okus je tropski, cvjetni i sočan. Ruža daje parfemsku notu koja ga izdvaja od drugih tropskih okusa.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Space Flavour brings together mango, passion fruit and lychee, seasoned with rose petals covered in cool morning dew.',
        'It is tropical, floral and juicy. The rose gives a perfumed note that sets it apart from other tropical flavors.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb020', intensity: 7 },
      { name: { bs: 'Marakuja', en: 'Passion fruit' }, illustration: 'marakuja', color: '#8a3f8f', intensity: 6 },
      { name: { bs: 'Liči', en: 'Lychee' }, illustration: 'lici', color: '#d8344a', intensity: 6 },
      { name: { bs: 'Ruža', en: 'Rose' }, illustration: 'ruza', color: '#e86a9a', intensity: 4 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 9, cooling: 1, strength: 7 },
    tags: ['vocni', 'tropski'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'supernova',
    palette: { primary: '#ffb020', secondary: '#8a3f8f', accent: '#d8344a', background: '#322209', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Space Flavour i Strawberry Lychee, za više ličija.',
        'Space Flavour i Frosty, za rosnu svježinu.'
      ],
      en: [
        'Space Flavour and Strawberry Lychee, for more lychee.',
        'Space Flavour and Frosty, for a dewy freshness.'
      ]
    },
    similar: ['musthave-strawberry-lychee', 'musthave-tropic-juice', 'musthave-mango-sling']
  },
  {
    id: 'musthave-kiwi-smoothie',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Kiwi Smoothie',
    shortDescription: {
      bs: 'Slatko-kiseli australijski kivi sa pepermintom i sokom od jabuke.',
      en: 'Sweet and sour Australian kiwi with peppermint and apple juice.'
    },
    description: {
      bs: [
        'Kiwi Smoothie je slatko-kiseli australijski kivi, ublažen sokom od jabuke i osvježen pepermintom.',
        'Kivi je glavni i jasno kiseo, jabuka ga zaokruži, a pepermint doda svježinu.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Kiwi Smoothie is sweet and sour Australian kiwi, softened with apple juice and lifted with peppermint.',
        'Kiwi leads with a clear tang, apple rounds it off and peppermint adds freshness.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kivi', en: 'Kiwi' }, illustration: 'kivi', color: '#7cbf3a', intensity: 9 },
      { name: { bs: 'Jabuka', en: 'Apple' }, illustration: 'jabuka', color: '#8cc63f', intensity: 5 },
      { name: { bs: 'Pepermint', en: 'Peppermint' }, illustration: 'pepermint', color: '#3fc08a', intensity: 4 }
    ],
    profile: { sweetness: 6, freshness: 8, fruitiness: 9, cooling: 3, strength: 7 },
    tags: ['vocni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#7cbf3a', secondary: '#8cc63f', accent: '#3fc08a', background: '#1d240d', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Kiwi Smoothie i Strawberry, za kivi i jagodu.',
        'Kiwi Smoothie i Ice Mint, za ledeni smoothie.'
      ],
      en: [
        'Kiwi Smoothie and Strawberry, for kiwi and strawberry.',
        'Kiwi Smoothie and Ice Mint, for an icy smoothie.'
      ]
    },
    similar: ['musthave-kiwi-apple-lime', 'musthave-green-fizz', 'musthave-rocketman']
  },
  {
    id: 'musthave-blueberry-lemon-mint',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Blueberry Lemon Mint',
    shortDescription: {
      bs: 'Bogata borovnica sa hladom mente i laganim citrusnim akcentom.',
      en: 'Rich blueberry with a minty chill and a light citrus accent.'
    },
    description: {
      bs: [
        'Blueberry Lemon Mint (Голубика, лимон и мята) je gotov miks brenda: bogata borovnica, hlad mente i lagan limun.',
        'Borovnica je glavna, menta osvježava, a limun daje kiselkast vrh.',
        'Tamni list sa hlađenjem: rastresito pakovanje i umjerena toplota, jer previše uglja ubije svježinu.'
      ],
      en: [
        'Blueberry Lemon Mint (Голубика, лимон и мята) is a ready-made blend from the brand: rich blueberry, a minty chill and light lemon.',
        'Blueberry leads, mint refreshes and lemon adds a tangy top note.',
        'Dark leaf with cooling: pack it loose and keep the heat moderate, because too much coal kills the freshness.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4a5fc1', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#3fc08a', intensity: 6 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7d84a', intensity: 4 }
    ],
    profile: { sweetness: 6, freshness: 9, fruitiness: 8, cooling: 5, strength: 7 },
    tags: ['bobicasti', 'mint', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    mood: 'frost',
    palette: { primary: '#4a5fc1', secondary: '#3fc08a', accent: '#f7d84a', background: '#151523', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Blueberry Lemon Mint i Vanilla Cream, za kremastiji miks.',
        'Blueberry Lemon Mint i Blueberry, za više borovnice.'
      ],
      en: [
        'Blueberry Lemon Mint and Vanilla Cream, for a creamier bowl.',
        'Blueberry Lemon Mint and Blueberry, for more blueberry.'
      ]
    },
    similar: ['musthave-blueberry', 'serbetli-ice-blueberry', 'al-fakher-blueberry']
  },
  {
    id: 'musthave-pear-lemon-tarragon',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Pear Lemon Tarragon',
    shortDescription: {
      bs: 'Slatka kruška, začinski estragon i svježina limuna u balansu.',
      en: 'Sweet pear, spicy tarragon and lemon freshness in balance.'
    },
    description: {
      bs: [
        'Pear Lemon Tarragon (Груша, лимон и тархун) je gotov miks brenda: slatka kruška, začinski estragon i svježi limun.',
        'Okus podsjeća na tarhun sa kruškom: biljan, sočan i osvježavajući.',
        'Tamni list: pakuj rastresito i ne pregrijavaj, da svjež, pitak karakter ostane čist.'
      ],
      en: [
        'Pear Lemon Tarragon (Груша, лимон и тархун) is a ready-made blend from the brand: sweet pear, spicy tarragon and fresh lemon.',
        'It tastes like a pear tarhun soda: herbal, juicy and refreshing.',
        'Dark leaf: pack it loose and do not overheat it, so the fresh, drinkable character stays clean.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kruška', en: 'Pear' }, illustration: 'kruska', color: '#d4c64a', intensity: 8 },
      { name: { bs: 'Estragon', en: 'Tarragon' }, illustration: 'bilje', color: '#4caf50', intensity: 6 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7d84a', intensity: 5 }
    ],
    profile: { sweetness: 6, freshness: 8, fruitiness: 7, cooling: 0, strength: 7 },
    tags: ['vocni', 'biljni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#d4c64a', secondary: '#4caf50', accent: '#f7d84a', background: '#2b2610', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Pear Lemon Tarragon i Estragon, za više tarhuna.',
        'Pear Lemon Tarragon i Mad Pear, za više kruške.'
      ],
      en: [
        'Pear Lemon Tarragon and Estragon, for more tarhun.',
        'Pear Lemon Tarragon and Mad Pear, for more pear.'
      ]
    },
    similar: ['musthave-estragon', 'musthave-mad-pear', 'sebero-green-pear']
  },
  {
    id: 'musthave-kiwi-apple-lime',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Kiwi Apple Lime',
    shortDescription: {
      bs: 'Sočan kivi, hrskava jabuka i opora limeta.',
      en: 'Juicy kiwi, crisp apple and tart lime.'
    },
    description: {
      bs: [
        'Kiwi Apple Lime (Киви, яблоко и лайм) je gotov miks brenda: sočan kivi, hrskava jabuka i opora limeta.',
        'Zeleno, kiselkasto i svježe voće. Odličan ljetni okus.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Kiwi Apple Lime (Киви, яблоко и лайм) is a ready-made blend from the brand: juicy kiwi, crisp apple and tart lime.',
        'Green, tangy and fresh fruit. A great summer flavor.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kivi', en: 'Kiwi' }, illustration: 'kivi', color: '#7cbf3a', intensity: 8 },
      { name: { bs: 'Jabuka', en: 'Apple' }, illustration: 'jabuka', color: '#8cc63f', intensity: 6 },
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#7cc242', intensity: 5 }
    ],
    profile: { sweetness: 5, freshness: 8, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'kiseli', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#7cbf3a', secondary: '#8cc63f', accent: '#7cc242', background: '#1d240d', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Kiwi Apple Lime i Ice Mint, za ledeni zeleni miks.',
        'Kiwi Apple Lime i Strawberry, za slađi miks.'
      ],
      en: [
        'Kiwi Apple Lime and Ice Mint, for an icy green bowl.',
        'Kiwi Apple Lime and Strawberry, for a sweeter bowl.'
      ]
    },
    similar: ['musthave-kiwi-smoothie', 'musthave-sour-apple', 'musthave-apple-drops']
  },
  {
    id: 'musthave-strawberry-lemon-watermelon',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Strawberry Lemon Watermelon',
    shortDescription: {
      bs: 'Zrela jagoda i sočna lubenica sa osvježavajućom kiselinom limuna.',
      en: 'Ripe strawberry and juicy watermelon with a refreshing lemon tang.'
    },
    description: {
      bs: [
        'Strawberry Lemon Watermelon (Клубника, лимон и арбуз) je gotov miks brenda: zrela jagoda, sočna lubenica i limun.',
        'Ljetni voćni miks: sladak, sočan i sa kiselkastim citrusnim vrhom.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Strawberry Lemon Watermelon (Клубника, лимон и арбуз) is a ready-made blend from the brand: ripe strawberry, juicy watermelon and lemon.',
        'A summer fruit blend: sweet, juicy and with a tangy citrus top.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e63946', intensity: 8 },
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8455a', intensity: 7 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7d84a', intensity: 5 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'ljetni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#e63946', secondary: '#e8455a', accent: '#f7d84a', background: '#2e0f0f', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Strawberry Lemon Watermelon i Ice Mint, za ledeni ljetni miks.',
        'Strawberry Lemon Watermelon i Prosecco, za ljetni koktel.'
      ],
      en: [
        'Strawberry Lemon Watermelon and Ice Mint, for an icy summer bowl.',
        'Strawberry Lemon Watermelon and Prosecco, for a summer cocktail.'
      ]
    },
    similar: ['musthave-strawberry', 'musthave-watermelon', 'musthave-melonade', '187-siwlez']
  },
  {
    id: 'musthave-currant-orange-grape',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Currant Orange Grape',
    shortDescription: {
      bs: 'Duboka crna ribizla, sunčana narandža i slatko zrelo grožđe.',
      en: 'Deep black currant, sunny orange and sweet ripe grapes.'
    },
    description: {
      bs: [
        'Currant Orange Grape (Смородина, апельсин и виноград) je gotov miks brenda: crna ribizla, narandža i zrelo grožđe.',
        'Slatko-kiseo miks u kojem ribizla daje dubinu, narandža sunce, a grožđe slatkoću.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Currant Orange Grape (Смородина, апельсин и виноград) is a ready-made blend from the brand: black currant, orange and ripe grapes.',
        'A sweet and sour blend where currant brings depth, orange the sunshine and grape the sweetness.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crna ribizla', en: 'Black currant' }, illustration: 'grozdic', color: '#2a1630', intensity: 8 },
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff7a00', intensity: 6 },
      { name: { bs: 'Grožđe', en: 'Grape' }, illustration: 'grozdje', color: '#6b2c7a', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'bobicasti'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#2a1630', secondary: '#ff7a00', accent: '#6b2c7a', background: '#10090c', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Currant Orange Grape i Ice Mint, za ledeni voćni miks.',
        'Currant Orange Grape i Black Currant, za više ribizle.'
      ],
      en: [
        'Currant Orange Grape and Ice Mint, for an icy fruit bowl.',
        'Currant Orange Grape and Black Currant, for more currant.'
      ]
    },
    similar: ['musthave-black-currant', 'musthave-orange-team', 'musthave-garnet-grape']
  },
  {
    id: 'musthave-sour-apple',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Sour Apple',
    shortDescription: {
      bs: 'Svjež miris kiselih, zelenih, sočnih jabuka.',
      en: 'The fresh aroma of sour, green, juicy apples.'
    },
    description: {
      bs: [
        'Sour Apple je iz kisele (Sour) linije: zelena, sočna i jasno kisela jabuka.',
        'Kiselina je glavna, pa okus budi i osvježava. Za ljubitelje kiselih bombona.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Sour Apple is from the Sour line: a green, juicy and clearly sour apple.',
        'The sourness is the star, so it wakes you up and refreshes. For fans of sour candy.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Zelena jabuka', en: 'Green apple' }, illustration: 'jabuka', color: '#8cc63f', intensity: 9 },
      { name: { bs: 'Kiselost', en: 'Sourness' }, illustration: 'limeta', color: '#b5d84a', intensity: 6 }
    ],
    profile: { sweetness: 4, freshness: 8, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['vocni', 'kiseli'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#8cc63f', secondary: '#b5d84a', accent: '#cbe5a9', background: '#20260e', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Sour Apple i Cinnamon, za kiselu jabuku sa cimetom.',
        'Sour Apple i Ice Mint, za ledenu kiselu jabuku.'
      ],
      en: [
        'Sour Apple and Cinnamon, for sour apple and cinnamon.',
        'Sour Apple and Ice Mint, for icy sour apple.'
      ]
    },
    similar: ['musthave-apple-drops', 'musthave-kiwi-apple-lime', 'musthave-sour-citrus']
  },
  {
    id: 'musthave-sour-berries',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Sour Berries',
    shortDescription: {
      bs: 'Jarak miks kiselih šumskih bobica.',
      en: 'A bright mix of sour forest berries.'
    },
    description: {
      bs: [
        'Sour Berries je iz kisele (Sour) linije: miks šumskih bobica sa naglašenom kiselinom.',
        'Bobice su sočne, a kiselina jasna, kao kisele gumene bobice.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Sour Berries is from the Sour line: a mix of forest berries with a pronounced sourness.',
        'The berries are juicy and the sourness clear, like sour gummy berries.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Šumske bobice', en: 'Forest berries' }, illustration: 'kupina', color: '#3b1a3f', intensity: 8 },
      { name: { bs: 'Brusnica', en: 'Cranberry' }, illustration: 'bobice', color: '#c8102e', intensity: 6 },
      { name: { bs: 'Kiselost', en: 'Sourness' }, illustration: 'limeta', color: '#b5d84a', intensity: 6 }
    ],
    profile: { sweetness: 5, freshness: 7, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['bobicasti', 'kiseli'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#3b1a3f', secondary: '#c8102e', accent: '#b5d84a', background: '#130a0e', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Sour Berries i Vanilla Cream, za ublažene bobice.',
        'Sour Berries i Frosty, za ledene kisele bobice.'
      ],
      en: [
        'Sour Berries and Vanilla Cream, for softer berries.',
        'Sour Berries and Frosty, for icy sour berries.'
      ]
    },
    similar: ['musthave-forest-berries', 'musthave-cranberry', 'musthave-sour-tropic']
  },
  {
    id: 'musthave-sour-citrus',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Sour Citrus',
    shortDescription: {
      bs: 'Citrusni miks od zrele narandže i kisele limete sa blagom gorčinom grejpfruta.',
      en: 'A citrus mix of ripe orange and sour lime with a faint grapefruit bitterness.'
    },
    description: {
      bs: [
        'Sour Citrus je iz kisele (Sour) linije: zrela narandža, kisela limeta i jedva primjetna gorčina grejpfruta.',
        'Okus je oštar, svjež i citrusan. Odlično budi slatke mikseve.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Sour Citrus is from the Sour line: ripe orange, sour lime and a barely noticeable grapefruit bitterness.',
        'Sharp, fresh and citrusy. Great for waking up sweet mixes.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff7a00', intensity: 7 },
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#7cc242', intensity: 7 },
      { name: { bs: 'Grejpfrut', en: 'Grapefruit' }, illustration: 'grejpfrut', color: '#f26b6b', intensity: 4 }
    ],
    profile: { sweetness: 4, freshness: 9, fruitiness: 8, cooling: 0, strength: 7 },
    tags: ['citrusni', 'kiseli', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ff7a00', secondary: '#7cc242', accent: '#f26b6b', background: '#321904', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Sour Citrus i Strawberry, za kiselu jagodu.',
        'Sour Citrus i Ice Mint, za ledeni citrus.'
      ],
      en: [
        'Sour Citrus and Strawberry, for a sour strawberry.',
        'Sour Citrus and Ice Mint, for icy citrus.'
      ]
    },
    similar: ['musthave-lemon-lime', 'musthave-orange-team', 'musthave-sour-apple']
  },
  {
    id: 'musthave-sour-tropic',
    brand: 'musthave',
    leaf: 'dark',
    name: 'Sour Tropic',
    shortDescription: {
      bs: 'Prirodan tropski koktel sa izraženom kiselinom.',
      en: 'A natural tropical cocktail with a pronounced sourness.'
    },
    description: {
      bs: [
        'Sour Tropic je iz kisele (Sour) linije: prirodan tropski koktel sa izraženom kiselinom.',
        'Tropsko voće daje slatkoću i sok, a kiselina ga drži živim i svježim.',
        'Tamni list MUSTHAVE: rastresito pakovanje, srednja toplota i par minuta zagrijavanja prije prvog dima.'
      ],
      en: [
        'Sour Tropic is from the Sour line: a natural tropical cocktail with a pronounced sourness.',
        'Tropical fruit brings sweetness and juice, and the sourness keeps it lively and fresh.',
        'MUSTHAVE dark leaf: pack it loose, keep the heat medium and give the bowl a few minutes to warm up before the first pull.'
      ]
    },
    ingredients: [
      { name: { bs: 'Tropsko voće', en: 'Tropical fruit' }, illustration: 'mango', color: '#ffb020', intensity: 8 },
      { name: { bs: 'Kiselost', en: 'Sourness' }, illustration: 'limeta', color: '#b5d84a', intensity: 6 }
    ],
    profile: { sweetness: 5, freshness: 7, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['tropski', 'kiseli', 'vocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ffb020', secondary: '#b5d84a', accent: '#ffdb9b', background: '#322209', text: '#fff4ea' },
    mixIdeas: {
      bs: [
        'Sour Tropic i Coconut Shake, za kremasti tropski miks.',
        'Sour Tropic i Tropic Juice, za više ananasa.'
      ],
      en: [
        'Sour Tropic and Coconut Shake, for a creamy tropical bowl.',
        'Sour Tropic and Tropic Juice, for more pineapple.'
      ]
    },
    similar: ['musthave-tropic-juice', 'musthave-sour-berries', 'musthave-pearl-pool']
  },
  // ---- kraj MUSTHAVE linije ----
  {
    id: 'sebero-arctic-mix-jelly-fruit',
    brand: 'sebero',
    leaf: 'dark',
    name: 'Arctic Mix Jelly Fruit',
    mood: 'frost',
    shortDescription: {
      bs: 'Voćni žele sa grejpfrutom, jagodom i narandžom, notom žvakaće gume i hladnim završetkom.',
      en: 'Fruit jelly with grapefruit, strawberry and orange, a bubble gum note and a cold finish.'
    },
    description: {
      bs: [
        'Arctic Mix Jelly Fruit liči na šarene voćne žele bombone. Grejpfrut, jagoda i narandža se miješaju u slatku, sočnu osnovu.',
        'Kroz voće se provlači nota žvakaće gume, a na izdahu stiže osvježavajuće hlađenje koje okus drži lakim.',
        'Duhan je tamni list, pa je okus jači od tipičnog svijetlog lista i namijenjen iskusnijim pušačima.'
      ],
      en: [
        'Arctic Mix Jelly Fruit tastes like a handful of colorful fruit jellies. Grapefruit, strawberry and orange blend into a sweet, juicy base.',
        'A bubble gum note runs through the fruit, and a refreshing chill arrives on the exhale to keep it light.',
        'The tobacco is dark leaf, so it hits harder than typical blonde leaf and is meant for more experienced smokers.'
      ]
    },
    ingredients: [
      { name: { bs: 'Hlađenje', en: 'Cooling' }, illustration: 'kristal', color: '#d6f3ff', intensity: 7 },
      { name: { bs: 'Grejpfrut', en: 'Grapefruit' }, illustration: 'grejpfrut', color: '#ff7a6b', intensity: 6 },
      { name: { bs: 'Žvakaća guma', en: 'Bubble gum' }, illustration: 'zvaka', color: '#ff8fc2', intensity: 6 },
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e8354a', intensity: 6 },
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 8, fruitiness: 8, cooling: 7, strength: 7 },
    tags: ['vocni', 'slatki', 'bombon', 'ledeni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ff8a3d', secondary: '#ff5d8f', accent: '#bdf0ff', background: '#2b1030', text: '#fff2ec', water: '#ff9db8', smoke: ['#ffffff', '#ffe0ec', '#dff6ff'] },
    mixIdeas: {
      bs: [
        'Arctic Mix Jelly Fruit i Pinkman, za slatko-kiseli voćni žele.',
        'Arctic Mix Jelly Fruit i Ice Bonbon, za još više bombona i leda.',
        'Arctic Mix Jelly Fruit i Love 66, za ljetni ledeni koktel.'
      ],
      en: [
        'Arctic Mix Jelly Fruit with Pinkman for a sweet and tart fruit jelly.',
        'Arctic Mix Jelly Fruit with Ice Bonbon for even more candy and ice.',
        'Arctic Mix Jelly Fruit with Love 66 for an icy summer cocktail.'
      ]
    },
    similar: ['sebero-arctic-mix-spice-fruit', 'musthave-pinkman', 'adalya-ice-bonbon', 'adalya-tynky-wynky']
  },
  {
    id: 'sebero-black-cola',
    brand: 'sebero',
    leaf: 'dark',
    name: 'Black Cola',
    mood: 'fizz',
    shortDescription: {
      bs: 'Bogata, izrazito slatka kola sa baršunastim, mekim završetkom.',
      en: 'A rich, distinctly sweet cola with a velvety, smooth finish.'
    },
    description: {
      bs: [
        'Black Cola je dio Sebero Black linije, jačih tamnih duhana. Okus je bogata kola sa izraženom slatkoćom, punija i "sirupastija" od MUSTHAVE Cole.',
        'Završetak je mekan i baršunast, bez kiselosti i bez hlađenja, pa okus ostaje topao od prvog do zadnjeg povlačenja.',
        'Jak tamni list: pakuj ga malo rastresito i ne pretjeruj sa toplotom. Treća kola za poređenje, uz Darkside i MUSTHAVE.'
      ],
      en: [
        'Black Cola belongs to the Sebero Black line of stronger dark tobaccos. It is a rich cola with pronounced sweetness, fuller and more "syrupy" than MUSTHAVE Cola.',
        'The finish is soft and velvety, with no tartness and no cooling, so it stays warm from the first pull to the last.',
        'Strong dark leaf: pack it a little loose and go easy on the heat. The third cola to compare, alongside Darkside and MUSTHAVE.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kola', en: 'Cola' }, illustration: 'kola', color: '#3e1a0e', intensity: 9 },
      { name: { bs: 'Karamel', en: 'Caramel' }, illustration: 'karamel', color: '#b7742f', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 4, fruitiness: 1, cooling: 0, strength: 8 },
    tags: ['pice', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#5a2a18', secondary: '#c28a54', accent: '#d7a46a', background: '#140b08', text: '#f6e8da', smoke: ['#fbefe2', '#d9b48c', '#a8784e'] },
    mixIdeas: {
      bs: [
        'Black Cola i Cherry Mint, za tamnu višnja-kolu.',
        'Black Cola i Peppermint Shake, za kolu sa šlagom i vanilom.',
        'Black Cola i Ambrosia, 70/30, za slatku kolu sa dinjom.'
      ],
      en: [
        'Black Cola with Cherry Mint for a dark cherry cola.',
        'Black Cola with Peppermint Shake for cola with whipped cream and vanilla.',
        'Black Cola with Ambrosia, 70/30, for a sweet cola with melon.'
      ]
    },
    similar: ['darkside-cola', 'musthave-cola', 'al-fakher-double-apple']
  },
  {
    id: 'sebero-black-amarena-cherry',
    brand: 'sebero',
    leaf: 'dark',
    name: 'Black Amarena Cherry',
    shortDescription: {
      bs: 'Tamna, kiselkasta amarena višnja: bogata, sočna i jaka.',
      en: 'Dark, tart amarena cherry: rich, juicy and strong.'
    },
    description: {
      bs: [
        'Black Amarena Cherry je iz Sebero Black linije jačih duhana. Amarena je tamna talijanska višnja, kiselkasta i bogata, sa notom višnjevog sirupa.',
        'Kiselost je jasna i drži okus svježim, a slatkoća je dovoljna da ne bude oštar.',
        'Jak tamni list: pakuj rastresito, zagrijavaj polako i ne daj ga početnicima.'
      ],
      en: [
        'Black Amarena Cherry is from the Sebero Black line of stronger tobaccos. Amarena is a dark Italian cherry, tart and rich, with a note of cherry syrup.',
        'The tartness is clear and keeps it fresh, while the sweetness is enough to keep it from turning sharp.',
        'Strong dark leaf: pack it loose, heat it slowly and keep it away from beginners.'
      ]
    },
    ingredients: [
      { name: { bs: 'Amarena višnja', en: 'Amarena cherry' }, illustration: 'visnja', color: '#6a0a1c', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 5, fruitiness: 9, cooling: 0, strength: 9 },
    tags: ['vocni', 'bobicasti'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#8c0f26', secondary: '#e05a72', accent: '#f5c6cf', background: '#120306', text: '#ffeef1' },
    mixIdeas: {
      bs: [
        'Black Amarena Cherry i Black Cola, za tamnu višnja-kolu.',
        'Black Amarena Cherry i Arctic Mix Jelly Fruit, za ledenu višnju.',
        'Black Amarena Cherry i Mango Yogurt, za višnju sa jogurtom.'
      ],
      en: [
        'Black Amarena Cherry with Black Cola for a dark cherry cola.',
        'Black Amarena Cherry with Arctic Mix Jelly Fruit for an icy cherry.',
        'Black Amarena Cherry with Mango Yogurt for cherry and yogurt.'
      ]
    },
    similar: ['tangiers-maraschino-cherry', 'adalya-cherry-mint', 'musthave-cherry-cola']
  },
  {
    id: 'sebero-green-pear',
    brand: 'sebero',
    leaf: 'dark',
    name: 'Green Pear',
    shortDescription: {
      bs: 'Sočna zelena kruška sa notom guave: svježa i blago slatka.',
      en: 'Juicy green pear with a note of guava: fresh and gently sweet.'
    },
    description: {
      bs: [
        'Green Pear je iz Sebero Classic linije. Glavna je sočna zelena kruška, svježa i hrskava, a guava joj dodaje mekanu, tropsku notu.',
        'Okus je prirodan i ne pretjerano sladak, sa blagom svježinom bez hlađenja.',
        'Tamni list, ali Classic linija je blaža od Sebero Black. Dobar za one koji vole neobične voćne okuse.'
      ],
      en: [
        'Green Pear comes from the Sebero Classic line. The star is a juicy green pear, fresh and crisp, with guava adding a soft, tropical note.',
        'It is natural and not overly sweet, with a gentle freshness and no cooling.',
        'Dark leaf, though the Classic line is milder than Sebero Black. Good for anyone who likes unusual fruit flavors.'
      ]
    },
    ingredients: [
      { name: { bs: 'Zelena kruška', en: 'Green pear' }, illustration: 'kruska', color: '#b5d65a', intensity: 8 },
      { name: { bs: 'Guava', en: 'Guava' }, illustration: 'guava', color: '#f08a9a', intensity: 5 }
    ],
    profile: { sweetness: 6, freshness: 7, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#a9cf4f', secondary: '#f2a0ae', accent: '#2f8a4a', background: '#141c08', text: '#f6ffe6' },
    mixIdeas: {
      bs: [
        'Green Pear i Arctic Mix Jelly Fruit, za ledenu krušku.',
        'Green Pear i Mango Yogurt, za voćni jogurt.',
        'Green Pear i Pinkman, za krušku sa grejpfrutom.'
      ],
      en: [
        'Green Pear with Arctic Mix Jelly Fruit for an icy pear.',
        'Green Pear with Mango Yogurt for a fruit yogurt.',
        'Green Pear with Pinkman for pear and grapefruit.'
      ]
    },
    similar: ['trifecta-pineapple-guava', 'al-fakher-double-apple', 'haze-cucumberita']
  },
  {
    id: 'sebero-mango-yogurt',
    brand: 'sebero',
    leaf: 'dark',
    name: 'Mango Yogurt',
    shortDescription: {
      bs: 'Mango sa kremastim jogurtom: kao voćni jogurt ili mango lassi.',
      en: 'Mango with creamy yogurt: like a fruit yogurt or a mango lassi.'
    },
    description: {
      bs: [
        'Mango Yogurt spaja zreo, sladak mango i kremast, blago kiselkast jogurt. Podsjeća na voćni jogurt ili indijski napitak mango lassi.',
        'Jogurt smiruje slatkoću manga i daje okusu mekan, mliječni završetak.',
        'Tamni list, pa ga pakuj rastresito. Lijep desertni izbor za kraj dana.'
      ],
      en: [
        'Mango Yogurt combines ripe, sweet mango with creamy, slightly tangy yogurt. It recalls a fruit yogurt or an Indian mango lassi.',
        'The yogurt calms the mango sweetness and gives the flavor a soft, milky finish.',
        'Dark leaf, so pack it loose. A nice dessert pick to end the day.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 8 },
      { name: { bs: 'Jogurt', en: 'Yogurt' }, illustration: 'sejk', color: '#f6f1e6', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 7, cooling: 0, strength: 7 },
    tags: ['desertni', 'tropski', 'vocni'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#ffb52e', secondary: '#fff6e6', accent: '#e07a2a', background: '#fff4e0', text: '#2b1600' },
    mixIdeas: {
      bs: [
        'Mango Yogurt i Black Amarena Cherry, za jogurt sa višnjom.',
        'Mango Yogurt i Green Pear, za voćni jogurt.',
        'Mango Yogurt i Falling Star, za još tropskiji lassi.'
      ],
      en: [
        'Mango Yogurt with Black Amarena Cherry for cherry yogurt.',
        'Mango Yogurt with Green Pear for a fruit yogurt.',
        'Mango Yogurt with Falling Star for an even more tropical lassi.'
      ]
    },
    similar: ['darkside-falling-star', 'adalya-hawaii', 'trifecta-peppermint-shake']
  },
  {
    id: 'sebero-arctic-mix-spice-fruit',
    brand: 'sebero',
    leaf: 'dark',
    name: 'Arctic Mix Spice Fruit',
    mood: 'frost',
    shortDescription: {
      bs: 'Začinjeni čaj, guava, jagoda, rabarbara i ribizla, sa hlađenjem.',
      en: 'Spiced tea, guava, strawberry, rhubarb and blackcurrant, with cooling.'
    },
    description: {
      bs: [
        'Arctic Mix Spice Fruit je iz Sebero Arctic Mix linije: gotovi miksevi sa hlađenjem. Ovdje je osnova začinjeni čaj, a preko njega guava, jagoda, rabarbara i crna ribizla.',
        'Voće je kiselkasto i bogato, čaj daje toplu, začinsku dubinu, a hlađenje sve to drži svježim.',
        'Neobičan, slojevit okus. Tamni list: pakuj rastresito i ne pretjeruj sa toplotom.'
      ],
      en: [
        'Arctic Mix Spice Fruit comes from the Sebero Arctic Mix line of ready-made mixes with cooling. The base is spiced tea, topped with guava, strawberry, rhubarb and blackcurrant.',
        'The fruit is tart and rich, the tea adds warm, spiced depth, and the cooling keeps it all fresh.',
        'An unusual, layered flavor. Dark leaf: pack it loose and go easy on the heat.'
      ]
    },
    ingredients: [
      { name: { bs: 'Začinjeni čaj', en: 'Spiced tea' }, illustration: 'caj', color: '#b5651d', intensity: 7 },
      { name: { bs: 'Guava', en: 'Guava' }, illustration: 'guava', color: '#f08a9a', intensity: 6 },
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e8354a', intensity: 6 },
      { name: { bs: 'Rabarbara', en: 'Rhubarb' }, illustration: 'rabarbara', color: '#d9455f', intensity: 5 },
      { name: { bs: 'Hlađenje', en: 'Cooling' }, illustration: 'kristal', color: '#cdefff', intensity: 7 }
    ],
    profile: { sweetness: 6, freshness: 8, fruitiness: 8, cooling: 7, strength: 7 },
    tags: ['vocni', 'zacinski', 'ledeni', 'bobicasti'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#d9455f', secondary: '#b5651d', accent: '#8fd8f0', background: '#160a10', text: '#fff0f2', water: '#c8efff' },
    mixIdeas: {
      bs: [
        'Arctic Mix Spice Fruit i Green Pear, za začinjenu krušku.',
        'Arctic Mix Spice Fruit i Black Amarena Cherry, za zimsko voće.',
        'Arctic Mix Spice Fruit i Spiced Chai, za još više začina.'
      ],
      en: [
        'Arctic Mix Spice Fruit with Green Pear for a spiced pear.',
        'Arctic Mix Spice Fruit with Black Amarena Cherry for winter fruit.',
        'Arctic Mix Spice Fruit with Spiced Chai for even more spice.'
      ]
    },
    similar: ['sebero-arctic-mix-jelly-fruit', 'fumari-spiced-chai', '187-wild-beast']
  },
  {
    id: 'haze-cucumberita',
    brand: 'haze',
    leaf: 'light',
    name: 'Cucumberita',
    shortDescription: {
      bs: 'Blag, svjež krastavac sa kiselkastom limetom, u stilu margarita koktela.',
      en: 'Mild, fresh cucumber with tart lime, in the style of a margarita.'
    },
    description: {
      bs: [
        'Cucumberita je neobičan, osvježavajući okus: blag, zelen krastavac i kiselkasta limeta, kao čaša koktela na ljetnoj terasi.',
        'Krastavac je nježan i vodenast, a limeta mu daje oštriji, živ završetak sa notom margarite.',
        'Nije sladak i nema jako hlađenje, pa je dobar kad želiš nešto lagano i drugačije od uobičajenog voća.'
      ],
      en: [
        'Cucumberita is an unusual, refreshing flavor: mild, green cucumber with tart lime, like a cocktail on a summer terrace.',
        'The cucumber is soft and watery, and the lime gives it a sharper, livelier finish with a margarita twist.',
        'It is not sweet and has no heavy chill, so it works when you want something light and different from the usual fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Krastavac', en: 'Cucumber' }, illustration: 'krastavac', color: '#6fbf4a', intensity: 8 },
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#9ad94a', intensity: 6 }
    ],
    profile: { sweetness: 3, freshness: 10, fruitiness: 5, cooling: 2, strength: 4 },
    tags: ['osvjezavajuci', 'ljetni', 'citrusni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#5fb83a', secondary: '#c8f2a8', accent: '#1f8a4c', background: '#e4f6d6', text: '#13280e', water: '#bff0a0', smoke: ['#ffffff', '#efffe4', '#dcf5c8'] },
    mixIdeas: {
      bs: [
        'Cucumberita i Mint, za ekstra svjež, zeleni miks.',
        'Cucumberita i Double Melon, za lagan ljetni koktel.',
        'Cucumberita i Tynky Wynky, za citrusnu limunadu sa krastavcem.'
      ],
      en: [
        'Cucumberita with Mint for an extra-fresh green mix.',
        'Cucumberita with Double Melon for an easy summer cocktail.',
        'Cucumberita with Tynky Wynky for a citrus lemonade with cucumber.'
      ]
    },
    similar: ['holster-ice-kaktuz', 'adalya-mint', 'adalya-tynky-wynky', 'adalya-double-melon']
  },
  {
    id: 'haze-purple-krush',
    brand: 'haze',
    leaf: 'light',
    name: 'Purple Krush',
    mood: 'fizz',
    shortDescription: {
      bs: 'Slatka, hladna soda od grožđa sa daškom bobičastog voća.',
      en: 'A sweet, cold grape soda with a hint of berries.'
    },
    description: {
      bs: [
        'Purple Krush je jedan od najprodavanijih Haze okusa. U prvom planu je slatko, tamno grožđe, onakvo kakvo znaš iz bombona i gaziranih sokova od grožđa.',
        'Uz grožđe se osjeti malo bobičastog voća i lagano hlađenje, pa okus djeluje kao čaša hladne sode.',
        'Haze pravi gust dim i dobro podnosi toplotu, a svijetli list ga čini laganim za početnike.'
      ],
      en: [
        'Purple Krush is one of the best-selling Haze flavors. Sweet, dark grape leads the way, the kind you know from candy and grape sodas.',
        'Alongside the grape comes a touch of berries and a light chill, so it feels like a glass of cold soda.',
        'Haze makes thick clouds and handles heat well, and the blonde leaf keeps it easy for beginners.'
      ]
    },
    ingredients: [
      { name: { bs: 'Grožđe', en: 'Grape' }, illustration: 'grozdje', color: '#7b3fb2', intensity: 9 },
      { name: { bs: 'Bobičasto voće', en: 'Berries' }, illustration: 'kupina', color: '#4a2a6a', intensity: 4 },
      { name: { bs: 'Hlađenje', en: 'Cooling' }, illustration: 'kristal', color: '#e6dcff', intensity: 3 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 8, cooling: 3, strength: 5 },
    tags: ['vocni', 'slatki', 'pice', 'bombon'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#8a4fd0', secondary: '#d6c2f5', accent: '#c58bff', background: '#24123a', text: '#f5edff', smoke: ['#ffffff', '#e6d8ff', '#c9b0f2'] },
    mixIdeas: {
      bs: [
        'Purple Krush i Pirate\'s Cave, 30/70, za ljubičastu limunadu.',
        'Purple Krush i Mint, 80/20, za hladnu sodu od grožđa.',
        'Purple Krush i Blue Mist, za slatki, bobičasti miks.'
      ],
      en: [
        'Purple Krush with Pirate\'s Cave, 30/70, for a purple lemonade.',
        'Purple Krush with Mint, 80/20, for an ice-cold grape soda.',
        'Purple Krush with Blue Mist for a sweet berry mix.'
      ]
    },
    similar: ['starbuzz-blue-mist', 'starbuzz-pirates-cave', 'musthave-pinkman', 'adalya-bagdadi']
  },
  {
    id: 'haze-mint-supreme',
    brand: 'haze',
    leaf: 'light',
    name: 'Mint Supreme',
    mood: 'frost',
    shortDescription: {
      bs: 'Jaka, čista menta za one kojima obična menta nije dovoljna.',
      en: 'Strong, clean mint for anyone who finds regular mint too mild.'
    },
    description: {
      bs: [
        'Mint Supreme je Haze menta pojačana do kraja. Nema voća ni slatkoće u prvom planu, samo jaka, svježa menta koja hladi i udah i izdah.',
        'Hladnoća je izražena, ali menta ostaje "zelena" i prirodna, a ne čisti mentol.',
        'Svijetli list, pa je lagan za pušenje. Odličan i u malim količinama uz voćne okuse.'
      ],
      en: [
        'Mint Supreme is Haze mint turned all the way up. No fruit and no sweetness up front, just strong, fresh mint that cools both the inhale and the exhale.',
        'The cold is pronounced, but the mint stays "green" and natural rather than pure menthol.',
        'Blonde leaf, so it is easy to smoke. Great in small amounts with fruit flavors, too.'
      ]
    },
    ingredients: [
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 10 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 7 }
    ],
    profile: { sweetness: 2, freshness: 10, fruitiness: 0, cooling: 9, strength: 5 },
    tags: ['mint', 'ledeni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#2fc48a', secondary: '#c8f7e2', accent: '#0d7a52', background: '#e8fbf2', text: '#062a1c', water: '#c8f7e2' },
    mixIdeas: {
      bs: [
        'Mint Supreme i Purple Krush, 30/70, za ledeno grožđe.',
        'Mint Supreme i Cucumberita, za mojito.',
        'Mint Supreme i Pineapple Krush, 30/70, za ledeni ananas.'
      ],
      en: [
        'Mint Supreme with Purple Krush, 30/70, for an icy grape.',
        'Mint Supreme with Cucumberita for a mojito.',
        'Mint Supreme with Pineapple Krush, 30/70, for an icy pineapple.'
      ]
    },
    similar: ['al-fakher-mint', 'adalya-mint', 'trifecta-durty-mint', 'tangiers-cane-mint']
  },
  {
    id: 'haze-bananarama',
    brand: 'haze',
    leaf: 'light',
    name: 'Bananarama',
    shortDescription: {
      bs: 'Puding od banane i hljeba: kremasto, toplo i desertno.',
      en: 'Banana bread pudding: creamy, warm and dessert-like.'
    },
    description: {
      bs: [
        'Bananarama je desert u nargili: zrela banana, mekan "hljeb" i kremasta, puding tekstura. Podsjeća na američki puding od banane i hljeba.',
        'Okus je topao i sladak, sa notom vanile i pečenog tijesta. Nema hlađenja.',
        'Svijetli list, mekan i lagan. Dobar za kraj večeri, uz kafu ili čaj.'
      ],
      en: [
        'Bananarama is dessert in a hookah: ripe banana, soft "bread" and a creamy, pudding-like texture. It recalls an American banana bread pudding.',
        'It is warm and sweet, with notes of vanilla and baked dough. No cooling.',
        'Blonde leaf, soft and light. Good to end the evening with coffee or tea.'
      ]
    },
    ingredients: [
      { name: { bs: 'Banana', en: 'Banana' }, illustration: 'banana', color: '#fbe48c', intensity: 8 },
      { name: { bs: 'Puding', en: 'Pudding' }, illustration: 'vanila', color: '#f1dca7', intensity: 6 },
      { name: { bs: 'Pecivo', en: 'Baked bread' }, illustration: 'karamel', color: '#c58a52', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 2, fruitiness: 6, cooling: 0, strength: 4 },
    tags: ['desertni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f2cf5a', secondary: '#c58a52', accent: '#7a4a1f', background: '#1d1508', text: '#fff8e4' },
    mixIdeas: {
      bs: [
        'Bananarama i Mint Supreme, 80/20, za hladni desert.',
        'Bananarama i Purple Krush, za puding sa grožđem.',
        'Bananarama i Double Bubble, za bombonsku bananu.'
      ],
      en: [
        'Bananarama with Mint Supreme, 80/20, for a cool dessert.',
        'Bananarama with Purple Krush for pudding with grape.',
        'Bananarama with Double Bubble for a candy banana.'
      ]
    },
    similar: ['darkside-bananapapa', 'trifecta-peppermint-shake', 'musthave-candy-cow', 'al-fakher-banana']
  },
  {
    id: 'haze-pineapple-krush',
    brand: 'haze',
    leaf: 'light',
    name: 'Pineapple Krush',
    mood: 'ice',
    shortDescription: {
      bs: 'Sočni ananas sa hladnim završetkom, kao ledeni ananas sok.',
      en: 'Juicy pineapple with a cool finish, like iced pineapple juice.'
    },
    description: {
      bs: [
        'Pineapple Krush je iz Haze "Krush" linije voćnih okusa sa hlađenjem. Ananas je sočan, sladak i blago kiselkast, a na kraju dolazi lagano hlađenje.',
        'Hlađenje je umjereno, pa ananas ostaje glavna stvar, a izdah je svjež.',
        'Svijetli list, lagan i ljetni. Dobar izbor za vruće dane.'
      ],
      en: [
        'Pineapple Krush belongs to the Haze "Krush" line of fruit flavors with cooling. The pineapple is juicy, sweet and slightly tart, with a gentle chill at the end.',
        'The cooling is moderate, so the pineapple stays the main event while the exhale feels fresh.',
        'Blonde leaf, light and summery. A good pick for hot days.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f8cf4a', intensity: 9 },
      { name: { bs: 'Hlađenje', en: 'Cooling' }, illustration: 'kristal', color: '#cdefff', intensity: 5 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 9, cooling: 5, strength: 4 },
    tags: ['vocni', 'tropski', 'ljetni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f8cf4a', secondary: '#bfefff', accent: '#2a9a5a', background: '#0f2026', text: '#fffbe6', water: '#cdf3ff' },
    mixIdeas: {
      bs: [
        'Pineapple Krush i Purple Krush, za tropski sok od grožđa.',
        'Pineapple Krush i Cucumberita, za ananas-mojito.',
        'Pineapple Krush i Bananarama, za piña coladu.'
      ],
      en: [
        'Pineapple Krush with Purple Krush for a tropical grape juice.',
        'Pineapple Krush with Cucumberita for a pineapple mojito.',
        'Pineapple Krush with Bananarama for a piña colada.'
      ]
    },
    similar: ['musthave-pineapple-rings', 'trifecta-pineapple-guava', 'haze-purple-krush', 'adalya-mi-amor']
  },
  {
    id: 'haze-double-bubble',
    brand: 'haze',
    leaf: 'light',
    name: 'Double Bubble',
    shortDescription: {
      bs: 'Klasična roze žvakaća guma: slatka, voćna i nostalgična.',
      en: 'Classic pink bubble gum: sweet, fruity and nostalgic.'
    },
    description: {
      bs: [
        'Double Bubble je okus stare roze žvakaće gume. Slatka je, voćna i malo cvjetna, baš kao guma iz djetinjstva.',
        'Nema mentola, pa okus ostaje mekan i bombonski od početka do kraja.',
        'Svijetli list, lagan za pušenje. Lijep samostalno ili uz voće.'
      ],
      en: [
        'Double Bubble is the flavor of old-school pink bubble gum. It is sweet, fruity and slightly floral, just like the gum you chewed as a kid.',
        'There is no menthol, so it stays soft and candy-like from start to finish.',
        'Blonde leaf, easy to smoke. Nice on its own or with fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Žvakaća guma', en: 'Bubble gum' }, illustration: 'zvaka', color: '#ff8fc0', intensity: 9 }
    ],
    profile: { sweetness: 9, freshness: 4, fruitiness: 4, cooling: 0, strength: 4 },
    tags: ['bombon', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff7ab6', secondary: '#ffd0e6', accent: '#7ad0ff', background: '#ffeef6', text: '#3a0a22' },
    mixIdeas: {
      bs: [
        'Double Bubble i Mint Supreme, 80/20, za mint žvaku.',
        'Double Bubble i Purple Krush, za žvaku od grožđa.',
        'Double Bubble i Pineapple Krush, za tropsku žvaku.'
      ],
      en: [
        'Double Bubble with Mint Supreme, 80/20, for mint gum.',
        'Double Bubble with Purple Krush for grape gum.',
        'Double Bubble with Pineapple Krush for tropical gum.'
      ]
    },
    similar: ['mazaya-gum-mint', 'fumari-white-gummi-bear', 'adalya-swiss-bonbon', 'al-fakher-gum-cinnamon']
  },
  {
    id: 'trifecta-peppermint-shake',
    brand: 'trifecta',
    leaf: 'light',
    name: 'Peppermint Shake',
    shortDescription: {
      bs: 'Kremast vanila šejk sa ledenim pepermint bombonima: desertni mint.',
      en: 'A creamy vanilla shake with icy peppermint candy: a dessert mint.'
    },
    description: {
      bs: [
        'Peppermint Shake je desert u nargili. Osnova je kremast, mliječni šejk od vanile, mekan i sladak.',
        'Preko njega dolaze pepermint bomboni, koji donose čist, leden završetak i razbijaju kremastu slatkoću.',
        'Dobar je kao okus za kraj večeri ili kad želiš mentu, ali u slađem i mekšem izdanju.'
      ],
      en: [
        'Peppermint Shake is dessert in a bowl. The base is a creamy vanilla milkshake, soft and sweet.',
        'On top come peppermint candies that bring a clean, icy finish and cut through the creaminess.',
        'It makes a nice end-of-the-night flavor, or a pick for when you want mint in a sweeter, softer form.'
      ]
    },
    ingredients: [
      { name: { bs: 'Vanila', en: 'Vanilla' }, illustration: 'vanila', color: '#f6e7b0', intensity: 7 },
      { name: { bs: 'Mliječni šejk', en: 'Milkshake' }, illustration: 'sejk', color: '#f3e3c3', intensity: 7 },
      { name: { bs: 'Pepermint bombon', en: 'Peppermint candy' }, illustration: 'pepermint-bombon', color: '#e23a3a', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 7, fruitiness: 0, cooling: 6, strength: 5 },
    tags: ['desertni', 'mint', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8455a', secondary: '#f6e7c8', accent: '#c22a3e', background: '#fbf1e2', text: '#2a1a12', water: '#f6e7c8', smoke: ['#ffffff', '#fff6ea', '#ffe6e9'] },
    mixIdeas: {
      bs: [
        'Peppermint Shake i Blue Mist, za kremast, plavi desertni miks.',
        'Peppermint Shake i Cane Mint, za desertni mint sa više snage.',
        'Peppermint Shake i Raspberry, za malinu sa šlagom.'
      ],
      en: [
        'Peppermint Shake with Blue Mist for a creamy blue dessert mix.',
        'Peppermint Shake with Cane Mint for a dessert mint with more punch.',
        'Peppermint Shake with Raspberry for raspberries and cream.'
      ]
    },
    similar: ['trifecta-twice-the-ice', 'tangiers-cane-mint', 'starbuzz-blue-mist', 'adalya-swiss-bonbon']
  },
  {
    id: 'trifecta-twice-the-ice',
    brand: 'trifecta',
    leaf: 'light',
    name: 'Twice the Ice',
    mood: 'frost',
    shortDescription: {
      bs: 'Jaka paprena metvica i leden mentol: jedan od najhladnijih okusa uopšte.',
      en: 'Strong peppermint and icy menthol: one of the coldest flavors around.'
    },
    description: {
      bs: [
        'Twice the Ice je, kako mu ime kaže, dvostruki led. Osnova je jaka paprena metvica, a preko nje ide toliko mentola da se hladnoća osjeti već na udahu.',
        'Nema slatkoće ni voća: samo čisto, oštro hlađenje. Zato ga mnogi koriste u malim količinama, da "zalede" voćni okus.',
        'Svijetli list (Trifecta Blonde), pa je lakši od Tangiers Cane Minta, ali je hladniji od skoro svake druge mente.'
      ],
      en: [
        'Twice the Ice is, as the name says, double the ice. The base is a strong peppermint, topped with so much menthol that you feel the cold on the inhale.',
        'No sweetness, no fruit: just clean, sharp cooling. That is why many people use it in small amounts to "ice up" a fruit flavor.',
        'It is blonde leaf (Trifecta Blonde), so it is lighter than Tangiers Cane Mint, yet colder than almost any other mint.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ledeni mentol', en: 'Icy menthol' }, illustration: 'kristal', color: '#e3f6ff', intensity: 10 },
      { name: { bs: 'Pepermint', en: 'Peppermint' }, illustration: 'pepermint', color: '#1fa874', intensity: 8 }
    ],
    profile: { sweetness: 1, freshness: 10, fruitiness: 0, cooling: 10, strength: 6 },
    tags: ['mint', 'ledeni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#5cc8f0', secondary: '#e4f7ff', accent: '#0f7fb0', background: '#e9f8ff', text: '#062636', water: '#c8efff', smoke: ['#ffffff', '#e8f8ff', '#cdeefc'] },
    mixIdeas: {
      bs: [
        'Malo Twice the Ice (20%) uz bilo koji voćni okus, za ledeni miks.',
        'Twice the Ice i Peppermint Shake, za hladni desertni mint.',
        'Twice the Ice i Pinkman, 20/80, za ledeni grejpfrut.'
      ],
      en: [
        'A little Twice the Ice (20%) with any fruit flavor for an icy mix.',
        'Twice the Ice with Peppermint Shake for a cold dessert mint.',
        'Twice the Ice with Pinkman, 20/80, for an icy grapefruit.'
      ]
    },
    similar: ['tangiers-cane-mint', 'trifecta-peppermint-shake', 'darkside-supernova']
  },
  {
    id: 'trifecta-pineapple-guava',
    brand: 'trifecta',
    leaf: 'light',
    name: 'Pineapple Guava',
    shortDescription: {
      bs: 'Ananas i guava: tropski, sočan i mirisan.',
      en: 'Pineapple and guava: tropical, juicy and fragrant.'
    },
    description: {
      bs: [
        'Pineapple Guava spaja sočan ananas i mirisnu, ružičastu guavu. Ananas daje svjetlinu i blagu kiselost, a guava mekan, cvjetno-tropski ton.',
        'Okus je prirodan i nije previše sladak, bez hlađenja.',
        'Ovo je Trifecta Blonde, svijetli list, pa je lagan i dobar i za manje iskusne.'
      ],
      en: [
        'Pineapple Guava pairs juicy pineapple with fragrant pink guava. Pineapple brings brightness and a slight tartness, and guava a soft, floral tropical tone.',
        'It is natural and not too sweet, with no cooling.',
        'This is Trifecta Blonde, on blonde leaf, so it is light and good for less experienced smokers too.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f8cf4a', intensity: 8 },
      { name: { bs: 'Guava', en: 'Guava' }, illustration: 'guava', color: '#f08a9a', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f6a3a8', secondary: '#f8cf4a', accent: '#3aa86a', background: '#24100f', text: '#fff2ee' },
    mixIdeas: {
      bs: [
        'Pineapple Guava i Twice the Ice, 80/20, za ledeno tropsko voće.',
        'Pineapple Guava i Blue Strawberry, za šareni voćni miks.',
        'Pineapple Guava i Peppermint Shake, za tropski šejk.'
      ],
      en: [
        'Pineapple Guava with Twice the Ice, 80/20, for icy tropical fruit.',
        'Pineapple Guava with Blue Strawberry for a colorful fruit mix.',
        'Pineapple Guava with Peppermint Shake for a tropical shake.'
      ]
    },
    similar: ['musthave-pineapple-rings', 'haze-pineapple-krush', 'sebero-green-pear', 'al-fakher-guava']
  },
  {
    id: 'trifecta-blue-strawberry',
    brand: 'trifecta',
    leaf: 'light',
    name: 'Blue Strawberry',
    shortDescription: {
      bs: 'Borovnica i jagoda: slatki, sočni bobičasti par.',
      en: 'Blueberry and strawberry: a sweet, juicy berry pair.'
    },
    description: {
      bs: [
        'Blue Strawberry je spoj borovnice i jagode. Borovnica daje tamnu, džemastu slatkoću, a jagoda svijetlu, mirisnu sočnost.',
        'Okus je voćan i lagan, sa blagom kiselošću, bez hlađenja.',
        'Trifecta Blonde, svijetli list. Dobar svakodnevni voćni okus.'
      ],
      en: [
        'Blue Strawberry blends blueberry and strawberry. The blueberry brings dark, jammy sweetness and the strawberry a bright, fragrant juiciness.',
        'It is fruity and light, with a slight tartness and no cooling.',
        'Trifecta Blonde, blonde leaf. A good everyday fruit flavor.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4b5bb5', intensity: 8 },
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e8354a', intensity: 7 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#5a6fd8', secondary: '#ff5a72', accent: '#ffd23f', background: '#14112a', text: '#f2f0ff' },
    mixIdeas: {
      bs: [
        'Blue Strawberry i Twice the Ice, 80/20, za ledene bobice.',
        'Blue Strawberry i Peppermint Shake, za bobice sa šlagom.',
        'Blue Strawberry i Ruby, za crveno-plavi miks.'
      ],
      en: [
        'Blue Strawberry with Twice the Ice, 80/20, for icy berries.',
        'Blue Strawberry with Peppermint Shake for berries and cream.',
        'Blue Strawberry with Ruby for a red and blue mix.'
      ]
    },
    similar: ['al-fakher-blueberry', 'darkside-wild-forest', 'adalya-blue-ice', '187-juicy-puzzy']
  },
  {
    id: 'trifecta-ruby',
    brand: 'trifecta',
    leaf: 'light',
    name: 'Ruby',
    shortDescription: {
      bs: 'Crvene bobice, višnja i dinja sa daškom cimeta.',
      en: 'Red berries, cherry and melon with a hint of cinnamon.'
    },
    description: {
      bs: [
        'Ruby je voćni miks crvene boje: crvene bobice i višnja vode, dinja ga omekšava, a na kraju se osjeti mali dašak cimeta.',
        'Cimet je jedva primjetan, ali daje okusu toplinu i čini ga zanimljivijim od običnog voćnog miksa.',
        'Svijetli list, lagan i sladak. Dobar za one koji vole voće, ali žele nešto drugačije.'
      ],
      en: [
        'Ruby is a red fruit blend: red berries and cherry lead, melon softens it, and a small hint of cinnamon shows up at the end.',
        'The cinnamon is barely there, but it adds warmth and makes this more interesting than a plain fruit mix.',
        'Blonde leaf, light and sweet. Good for fruit lovers who want something a little different.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crvene bobice', en: 'Red berries' }, illustration: 'malina', color: '#d62f4a', intensity: 8 },
      { name: { bs: 'Višnja', en: 'Cherry' }, illustration: 'visnja', color: '#a3122a', intensity: 7 },
      { name: { bs: 'Dinja', en: 'Melon' }, illustration: 'dinja', color: '#d9ec9f', intensity: 5 },
      { name: { bs: 'Cimet', en: 'Cinnamon' }, illustration: 'cimet', color: '#a0522d', intensity: 3 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'bobicasti', 'zacinski'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#c8143c', secondary: '#ff8a9a', accent: '#d9ec9f', background: '#1e050c', text: '#ffeef2' },
    mixIdeas: {
      bs: [
        'Ruby i Twice the Ice, 80/20, za ledene crvene bobice.',
        'Ruby i Peppermint Shake, za voćni desert.',
        'Ruby i Pineapple Guava, za tropske bobice.'
      ],
      en: [
        'Ruby with Twice the Ice, 80/20, for icy red berries.',
        'Ruby with Peppermint Shake for a fruit dessert.',
        'Ruby with Pineapple Guava for tropical berries.'
      ]
    },
    similar: ['true-passion-cinderella', 'fumari-red-gummi-bear', 'tangiers-maraschino-cherry']
  },
  {
    id: 'trifecta-durty-mint',
    brand: 'trifecta',
    leaf: 'dark',
    name: 'Durty Mint',
    mood: 'frost',
    shortDescription: {
      bs: 'Jaka paprena metvica na tamnom listu, za iskusne pušače.',
      en: 'Strong peppermint on dark leaf, for experienced smokers.'
    },
    description: {
      bs: [
        'Durty Mint je Trifecta Dark: paprena metvica na jakom tamnom listu. Menta je oštra i svježa, a list ispod nje daje pun, "duhanski" karakter.',
        'Hlađenje je izraženo, ali ne ledeno kao kod Twice the Ice. Više je klasična, snažna menta.',
        'Tamni list znači jači udarac: pakuj rastresito, zagrijavaj polako i ne žuri.'
      ],
      en: [
        'Durty Mint is Trifecta Dark: peppermint on strong dark leaf. The mint is sharp and fresh, and the leaf underneath gives it a full, "tobacco-forward" character.',
        'The cooling is pronounced but not as icy as Twice the Ice. It is more of a classic, powerful mint.',
        'Dark leaf means a bigger punch: pack it loose, heat it slowly and take your time.'
      ]
    },
    ingredients: [
      { name: { bs: 'Paprena metvica', en: 'Peppermint' }, illustration: 'pepermint', color: '#1fa874', intensity: 9 }
    ],
    profile: { sweetness: 2, freshness: 9, fruitiness: 0, cooling: 8, strength: 9 },
    tags: ['mint', 'osvjezavajuci'],
    tobaccoType: { bs: 'Tamni list (Trifecta Dark)', en: 'Dark leaf (Trifecta Dark)' },
    palette: { primary: '#1fa874', secondary: '#9fe6c4', accent: '#e8fff4', background: '#06140e', text: '#eafff4' },
    mixIdeas: {
      bs: [
        'Durty Mint i Ruby, 30/70, za jače crvene bobice sa mentom.',
        'Durty Mint i Peppermint Shake, za jaču mint kremu.',
        'Durty Mint i Pineapple Guava, 30/70, za tropsku mentu.'
      ],
      en: [
        'Durty Mint with Ruby, 30/70, for stronger red berries with mint.',
        'Durty Mint with Peppermint Shake for a stronger mint cream.',
        'Durty Mint with Pineapple Guava, 30/70, for a tropical mint.'
      ]
    },
    similar: ['tangiers-cane-mint', 'trifecta-twice-the-ice', 'haze-mint-supreme']
  },
  {
    id: 'nakhla-double-apple',
    brand: 'nakhla',
    leaf: 'dark',
    name: 'Double Apple',
    mood: 'honey',
    shortDescription: {
      bs: 'Crvena i zelena jabuka sa jakim anisom: originalna, stara dvostruka jabuka.',
      en: 'Red and green apple with strong anise: the original, old-school double apple.'
    },
    description: {
      bs: [
        'Nakhla Double Apple mnogi smatraju originalom dvostruke jabuke. Crvena i zelena jabuka daju slatko-kiselu osnovu, a anis je jak i jasan, skoro kao liker.',
        'Anis je izraženiji nego kod Al Fakhera, pa okus ima onaj stari, "kafanski" karakter koji ljudi ili vole ili ne podnose.',
        'Duhan je jak i grublji od modernih svijetlih listova. Pakuj rastresito i ne pretjeruj sa toplotom.'
      ],
      en: [
        'Many consider Nakhla Double Apple the original double apple. Red and green apple give a sweet and sour base, and the anise is strong and clear, almost like a liqueur.',
        'The anise is more pronounced than in Al Fakher, which gives it that old-school café character people either love or cannot stand.',
        'The tobacco is strong and coarser than modern blonde leaf. Pack it loose and go easy on the heat.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crvena jabuka', en: 'Red apple' }, illustration: 'jabuka', color: '#c8323c', intensity: 7 },
      { name: { bs: 'Zelena jabuka', en: 'Green apple' }, illustration: 'zelena-jabuka', color: '#8cc63f', intensity: 6 },
      { name: { bs: 'Anis', en: 'Anise' }, illustration: 'anis', color: '#6b4a2a', intensity: 9 }
    ],
    profile: { sweetness: 6, freshness: 4, fruitiness: 7, cooling: 0, strength: 9 },
    tags: ['klasicni', 'zacinski', 'vocni'],
    tobaccoType: { bs: 'Tamni list (tradicionalni moassel)', en: 'Dark leaf (traditional moassel)' },
    palette: { primary: '#c8323c', secondary: '#8cc63f', accent: '#e8c27a', background: '#1e0f0a', text: '#fff2e0', smoke: ['#fff6ea', '#e8d2b0', '#b8946a'] },
    mixIdeas: {
      bs: [
        'Nakhla Double Apple i Al Fakher Mint, 70/30, za klasičnu jabuku sa mentom.',
        'Nakhla Double Apple i Grape Mint, za stari orijentalni miks.',
        'Nakhla Double Apple i Spiced Chai, za jabuku sa začinima.'
      ],
      en: [
        'Nakhla Double Apple with Al Fakher Mint, 70/30, for a classic apple and mint.',
        'Nakhla Double Apple with Grape Mint for an old-school café mix.',
        'Nakhla Double Apple with Spiced Chai for spiced apple.'
      ]
    },
    similar: ['al-fakher-double-apple', 'revoshi-d-app-strong', 'al-fakher-mint']
  },
  {
    id: 'mazaya-gum-mint',
    brand: 'mazaya',
    leaf: 'light',
    name: 'Gum Mint',
    shortDescription: {
      bs: 'Žvakaća guma sa mentom: slatko, svježe i lagano.',
      en: 'Chewing gum with spearmint: sweet, fresh and light.'
    },
    description: {
      bs: [
        'Gum Mint je okus mint žvakaće gume. Slatka guma i nana (spearmint) daju mekan, svjež okus koji podsjeća na žvaku iz trafike.',
        'Menta je blaža od paprene metvice, pa okus nije oštar, nego ugodno osvježavajući.',
        'Svijetli list, lagan za pušenje. Dobar samostalno ili uz voće.'
      ],
      en: [
        'Gum Mint is the flavor of mint chewing gum. Sweet gum and spearmint give a soft, fresh taste that recalls a pack of gum from the corner shop.',
        'Spearmint is milder than peppermint, so it is not sharp, just pleasantly refreshing.',
        'Blonde leaf, easy to smoke. Good on its own or with fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Žvakaća guma', en: 'Chewing gum' }, illustration: 'zvaka', color: '#ff8fc0', intensity: 7 },
      { name: { bs: 'Nana', en: 'Spearmint' }, illustration: 'menta', color: '#2fae78', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 2, cooling: 5, strength: 4 },
    tags: ['bombon', 'mint', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#5fd0a0', secondary: '#ffc0dc', accent: '#ff7ab6', background: '#eafbf3', text: '#0a2a1c' },
    mixIdeas: {
      bs: [
        'Gum Mint i Lemon Mint, za limun žvaku.',
        'Gum Mint i Al Fakher Watermelon Mint, za žvaku od lubenice.',
        'Gum Mint i Al Fakher Blueberry, za žvaku od borovnice.'
      ],
      en: [
        'Gum Mint with Lemon Mint for lemon gum.',
        'Gum Mint with Al Fakher Watermelon Mint for watermelon gum.',
        'Gum Mint with Al Fakher Blueberry for blueberry gum.'
      ]
    },
    similar: ['haze-double-bubble', 'adalya-swiss-bonbon', 'al-fakher-mint', 'al-fakher-gum-cinnamon']
  },
  {
    id: 'mazaya-lemon-mint',
    brand: 'mazaya',
    leaf: 'light',
    name: 'Lemon Mint',
    shortDescription: {
      bs: 'Sladak limun i mekana menta: blaga, ugodna limunada.',
      en: 'Sweet lemon and soft mint: a mild, easygoing lemonade.'
    },
    description: {
      bs: [
        'Mazaya Lemon Mint je najmekši od tri Lemon Mint okusa na stranici. Limun je sladak i zreo, sa manje kiselosti, a menta je blaga i ugodna.',
        'Okus podsjeća na zaslađenu limunadu sa mentom, laganu i lako pitku.',
        'Svijetli list. Dobar izbor ako ti je Fumari previše oštar, a Al Fakher previše klasičan.'
      ],
      en: [
        'Mazaya Lemon Mint is the softest of the three Lemon Mint flavors on the site. The lemon is sweet and ripe with less tartness, and the mint is gentle and pleasant.',
        'It tastes like sweetened lemonade with mint, light and easy going.',
        'Blonde leaf. A good pick if Fumari feels too sharp and Al Fakher too classic.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 7 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 }
    ],
    profile: { sweetness: 6, freshness: 8, fruitiness: 6, cooling: 5, strength: 4 },
    tags: ['citrusni', 'mint', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f2d24a', secondary: '#3fae6a', accent: '#fff3a8', background: '#0f1f14', text: '#fbffe8' },
    mixIdeas: {
      bs: [
        'Lemon Mint i Gum Mint, za limun žvaku.',
        'Lemon Mint i Al Fakher Blueberry, za borovnicu-limunadu.',
        'Lemon Mint i Starbuzz Pink, za roze limunadu sa mentom.'
      ],
      en: [
        'Lemon Mint with Gum Mint for lemon gum.',
        'Lemon Mint with Al Fakher Blueberry for a blueberry lemonade.',
        'Lemon Mint with Starbuzz Pink for a pink lemonade with mint.'
      ]
    },
    similar: ['al-fakher-lemon-mint', 'fumari-lemon-mint', 'adalya-lemon-cocktail']
  },
  {
    id: 'al-waha-big-boy',
    brand: 'al-waha',
    leaf: 'light',
    name: 'Big Boy',
    mood: 'ice',
    shortDescription: {
      bs: 'Lubenica, limun i led: sočan, kiselkast i jako hladan.',
      en: 'Watermelon, lemon and ice: juicy, tangy and very cold.'
    },
    description: {
      bs: [
        'Big Boy je najpoznatiji Al Waha okus. Sočna lubenica je u prvom planu, limun joj dodaje kiselkastu iskru, a led sve to rashlađuje.',
        'Hlađenje je jako, ali voće ostaje jasno. Okus podsjeća na ledenu limunadu od lubenice.',
        'Svijetli list, lagan. Odličan za ljeto.'
      ],
      en: [
        'Big Boy is the best known Al Waha flavor. Juicy watermelon leads, lemon adds a tangy spark, and ice cools it all down.',
        'The cooling is strong, but the fruit stays clear. It tastes like an iced watermelon lemonade.',
        'Blonde leaf, light. Great for summer.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8434f', intensity: 8 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 6 },
      { name: { bs: 'Led', en: 'Ice' }, illustration: 'kristal', color: '#cdefff', intensity: 8 }
    ],
    profile: { sweetness: 7, freshness: 9, fruitiness: 8, cooling: 8, strength: 5 },
    tags: ['vocni', 'citrusni', 'ledeni', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8434f', secondary: '#f7e04b', accent: '#7fd3f0', background: '#0e1c26', text: '#fff0f2', water: '#c8efff' },
    mixIdeas: {
      bs: [
        'Big Boy i Grape Mint, za ledeni voćni miks.',
        'Big Boy i Al Fakher Blueberry, za lubenicu sa borovnicom.',
        'Big Boy i Adalya Hawaii, za tropsku lubenicu.'
      ],
      en: [
        'Big Boy with Grape Mint for an icy fruit mix.',
        'Big Boy with Al Fakher Blueberry for watermelon and blueberry.',
        'Big Boy with Adalya Hawaii for a tropical watermelon.'
      ]
    },
    similar: ['serbetli-ice-watermelon', 'al-fakher-watermelon-mint', 'adalya-love-66']
  },
  {
    id: 'al-waha-grape-mint',
    brand: 'al-waha',
    leaf: 'light',
    name: 'Grape Mint',
    shortDescription: {
      bs: 'Slatko grožđe i menta, mekši i slađi od klasične verzije.',
      en: 'Sweet grape and mint, softer and sweeter than the classic version.'
    },
    description: {
      bs: [
        'Al Waha Grape Mint je slatko, sočno grožđe sa mentom. U odnosu na Al Fakher, grožđe je malo slađe i "bombonskije", a menta blaža.',
        'Okus je lagan i ugodan, dobar za duže sesije.',
        'Svijetli list. Uporedi ga sa Al Fakher Grape Mint i Nameless Black Nana.'
      ],
      en: [
        'Al Waha Grape Mint is sweet, juicy grape with mint. Compared with Al Fakher, the grape is a little sweeter and more candy-like and the mint is softer.',
        'It is light and pleasant, good for long sessions.',
        'Blonde leaf. Compare it with Al Fakher Grape Mint and Nameless Black Nana.'
      ]
    },
    ingredients: [
      { name: { bs: 'Grožđe', en: 'Grape' }, illustration: 'grozdje', color: '#7a3a9a', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 7, fruitiness: 7, cooling: 5, strength: 5 },
    tags: ['vocni', 'mint', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#8a4ab8', secondary: '#c9a0ff', accent: '#2fae78', background: '#150c1e', text: '#f6eeff' },
    mixIdeas: {
      bs: [
        'Grape Mint i Big Boy, za ledeni voćni miks.',
        'Grape Mint i Al Fakher Lemon Mint, za limunadu od grožđa.',
        'Grape Mint i Al Fakher Double Apple, za klasični miks.'
      ],
      en: [
        'Grape Mint with Big Boy for an icy fruit mix.',
        'Grape Mint with Al Fakher Lemon Mint for a grape lemonade.',
        'Grape Mint with Al Fakher Double Apple for a classic mix.'
      ]
    },
    similar: ['al-fakher-grape-mint', 'nameless-black-nana', 'haze-purple-krush', 'adalya-grape-mint']
  },
  {
    id: 'afzal-pan-raas',
    brand: 'afzal',
    leaf: 'light',
    name: 'Pan Raas',
    shortDescription: {
      bs: 'Betel list, ruža, začini i mentol: okus indijskog paana.',
      en: 'Betel leaf, rose, spices and menthol: the taste of Indian paan.'
    },
    description: {
      bs: [
        'Pan Raas je inspirisan indijskim "paanom", zalogajem koji se pravi od betel lista, areka oraha, začina i ružine slatke paste (gulkand). Okus je biljni, cvjetni i začinski u isto vrijeme.',
        'Ruža daje slatku, parfemsku notu, betel list zelenu, malo gorkastu, a mentol svjež završetak.',
        'Neobičan okus koji se ne sviđa svakome, ali je u Indiji i među ljubiteljima nargile pravi klasik.'
      ],
      en: [
        'Pan Raas is inspired by Indian "paan", a bite made of betel leaf, areca nut, spices and sweet rose paste (gulkand). It is herbal, floral and spiced all at once.',
        'Rose brings a sweet, perfumed note, betel leaf a green, slightly bitter one, and menthol a fresh finish.',
        'An unusual flavor that is not for everyone, but in India and among hookah fans it is a true classic.'
      ]
    },
    ingredients: [
      { name: { bs: 'Betel list', en: 'Betel leaf' }, illustration: 'betel', color: '#3f9a4a', intensity: 8 },
      { name: { bs: 'Ruža', en: 'Rose' }, illustration: 'ruza', color: '#e86a8a', intensity: 7 },
      { name: { bs: 'Začini', en: 'Spices' }, illustration: 'kardamom', color: '#8fae5a', intensity: 5 },
      { name: { bs: 'Areka orah', en: 'Areca nut' }, illustration: 'karamel', color: '#8a5a3a', intensity: 4 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 5 }
    ],
    profile: { sweetness: 6, freshness: 7, fruitiness: 1, cooling: 5, strength: 5 },
    tags: ['biljni', 'zacinski', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#3f9a4a', secondary: '#e86a8a', accent: '#f2c230', background: '#0f1a0e', text: '#f4ffe9' },
    mixIdeas: {
      bs: [
        'Pan Raas i Al Fakher Mint, 70/30, za svježiji paan.',
        'Pan Raas i Fumari Spiced Chai, za indijsko veče.',
        'Pan Raas i Al Fakher Double Apple, za začinjenu jabuku.'
      ],
      en: [
        'Pan Raas with Al Fakher Mint, 70/30, for a fresher paan.',
        'Pan Raas with Fumari Spiced Chai for an Indian evening.',
        'Pan Raas with Al Fakher Double Apple for a spiced apple.'
      ]
    },
    similar: ['fumari-spiced-chai', 'adalya-swiss-bonbon', 'al-fakher-mint']
  },
  {
    id: 'serbetli-ice-watermelon',
    brand: 'serbetli',
    leaf: 'light',
    name: 'Ice Watermelon',
    mood: 'ice',
    shortDescription: {
      bs: 'Slatka lubenica sa jakim mentolom: ledena i sočna.',
      en: 'Sweet watermelon with strong menthol: icy and juicy.'
    },
    description: {
      bs: [
        'Ice Watermelon je sočna, slatka lubenica sa jakim mentolom. Lubenica je zrela i vodenasta, a mentol joj daje ledenu, osvježavajuću ivicu.',
        'Hlađenje je jače nego kod Al Fakher Watermelon Mint, pa je ovo pravi izbor za vruće dane.',
        'Svijetli list, lagan za pušenje.'
      ],
      en: [
        'Ice Watermelon is juicy, sweet watermelon with strong menthol. The watermelon is ripe and watery, and the menthol gives it an icy, refreshing edge.',
        'The cooling is stronger than in Al Fakher Watermelon Mint, which makes this the right pick for hot days.',
        'Blonde leaf, easy to smoke.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8434f', intensity: 8 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 8 }
    ],
    profile: { sweetness: 7, freshness: 9, fruitiness: 8, cooling: 8, strength: 5 },
    tags: ['vocni', 'ledeni', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff5a6a', secondary: '#bfefff', accent: '#3fbf7a', background: '#0b1a26', text: '#fff0f2', water: '#c8efff' },
    mixIdeas: {
      bs: [
        'Ice Watermelon i Ice Blueberry, za ledene bobice sa lubenicom.',
        'Ice Watermelon i Al Fakher Lemon Mint, za ledenu limunadu.',
        'Ice Watermelon i Adalya Hawaii, za ledeni tropski miks.'
      ],
      en: [
        'Ice Watermelon with Ice Blueberry for icy berries and watermelon.',
        'Ice Watermelon with Al Fakher Lemon Mint for an icy lemonade.',
        'Ice Watermelon with Adalya Hawaii for an icy tropical mix.'
      ]
    },
    similar: ['al-fakher-watermelon-mint', 'al-waha-big-boy', 'adalya-blue-melon', 'serbetli-ice-blueberry']
  },
  {
    id: 'serbetli-ice-blueberry',
    brand: 'serbetli',
    leaf: 'light',
    name: 'Ice Blueberry',
    mood: 'frost',
    shortDescription: {
      bs: 'Borovnica sa mentom i ledom: slatka, tamna i hladna.',
      en: 'Blueberry with mint and ice: sweet, dark and cold.'
    },
    description: {
      bs: [
        'Ice Blueberry je slatka, tamna borovnica sa mentom i ledom. Borovnica je džemasta i bogata, a hladnoća je čini svježom i laganom.',
        'Okus je sličan Adalya Blue Ice, ali je borovnica malo slađa, a menta "zelenija".',
        'Svijetli list. Dobar za ljubitelje ledenih bobičastih okusa.'
      ],
      en: [
        'Ice Blueberry is sweet, dark blueberry with mint and ice. The blueberry is jammy and rich, and the cold keeps it fresh and light.',
        'It is close to Adalya Blue Ice, but the blueberry is a little sweeter and the mint more "green".',
        'Blonde leaf. Good for fans of icy berry flavors.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4b5bb5', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 },
      { name: { bs: 'Led', en: 'Ice' }, illustration: 'kristal', color: '#cdefff', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 9, fruitiness: 8, cooling: 8, strength: 5 },
    tags: ['vocni', 'bobicasti', 'ledeni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#4b6bd6', secondary: '#bfe6ff', accent: '#2fae78', background: '#0b1226', text: '#eef3ff', water: '#c8e6ff' },
    mixIdeas: {
      bs: [
        'Ice Blueberry i Ice Watermelon, za ledene bobice sa lubenicom.',
        'Ice Blueberry i Al Fakher Lemon Mint, za ledenu borovnicu-limunadu.',
        'Ice Blueberry i Adalya Raspberry, za ledene šumske bobice.'
      ],
      en: [
        'Ice Blueberry with Ice Watermelon for icy berries and watermelon.',
        'Ice Blueberry with Al Fakher Lemon Mint for an icy blueberry lemonade.',
        'Ice Blueberry with Adalya Raspberry for icy forest berries.'
      ]
    },
    similar: ['adalya-blue-ice', 'al-fakher-blueberry', 'serbetli-ice-watermelon', 'al-fakher-blueberry-mint']
  },
  {
    id: 'revoshi-domingo',
    brand: 'revoshi',
    leaf: 'light',
    name: 'Domingo',
    shortDescription: {
      bs: 'Breskva, mango, limeta i jagoda: sunčan, voćni miks.',
      en: 'Peach, mango, lime and strawberry: a sunny fruit blend.'
    },
    description: {
      bs: [
        'Domingo je jedan od najpoznatijih Revoshi okusa. Breskva i mango daju sočnu, zrelu slatkoću, jagoda crvenu voćnost, a limeta svježu, kiselkastu iskru.',
        'Nema hlađenja, pa okus ostaje topao i ljetni, kao voćni koktel.',
        'Svijetli Virginia list, lagan i lako se puši.'
      ],
      en: [
        'Domingo is one of the best known Revoshi flavors. Peach and mango bring juicy, ripe sweetness, strawberry a red fruitiness, and lime a fresh, tangy spark.',
        'There is no cooling, so it stays warm and summery, like a fruit cocktail.',
        'Blonde Virginia leaf, light and easy to smoke.'
      ]
    },
    ingredients: [
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ffa66b', intensity: 8 },
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 7 },
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e8354a', intensity: 6 },
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#8cd23f', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'ljetni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff9a5a', secondary: '#ffd36b', accent: '#e8354a', background: '#26120a', text: '#fff4e8' },
    mixIdeas: {
      bs: [
        'Domingo i Eskimo Lemon, 70/30, za ledeni voćni koktel.',
        'Domingo i Lady Mystique, za još više manga i breskve.',
        'Domingo i Adalya Mint, 80/20, za osvježen koktel.'
      ],
      en: [
        'Domingo with Eskimo Lemon, 70/30, for an icy fruit cocktail.',
        'Domingo with Lady Mystique for even more mango and peach.',
        'Domingo with Adalya Mint, 80/20, for a refreshed cocktail.'
      ]
    },
    similar: ['revoshi-lady-mystique', 'adalya-berlin-nights', 'tangiers-kashmir-peach', '187-sparkling-peaz']
  },
  {
    id: 'revoshi-lady-mystique',
    brand: 'revoshi',
    leaf: 'light',
    name: 'Lady Mystique',
    mood: 'ice',
    shortDescription: {
      bs: 'Mango i breskva sa mentolom: sočno, slatko i hladno.',
      en: 'Mango and peach with menthol: juicy, sweet and cool.'
    },
    description: {
      bs: [
        'Lady Mystique spaja zreo mango i sočnu breskvu, a preko njih ide mentol. Voće je slatko i mekano, a hlađenje mu daje svjež završetak.',
        'Okus podsjeća na Adalya Lady Killer i Hawaii, ali je breskva ovdje jača.',
        'Svijetli list, lagan. Dobar izbor za ljubitelje voća sa malo leda.'
      ],
      en: [
        'Lady Mystique pairs ripe mango and juicy peach, topped with menthol. The fruit is sweet and soft, and the cooling gives it a fresh finish.',
        'It recalls Adalya Lady Killer and Hawaii, but the peach is stronger here.',
        'Blonde leaf, light. A good pick for fruit lovers who like a little ice.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 8 },
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ffa66b', intensity: 7 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 6 }
    ],
    profile: { sweetness: 8, freshness: 8, fruitiness: 9, cooling: 6, strength: 5 },
    tags: ['vocni', 'tropski', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffa64d', secondary: '#ffd0b0', accent: '#7fd3f0', background: '#2a1408', text: '#fff4e8', water: '#cdefff' },
    mixIdeas: {
      bs: [
        'Lady Mystique i Domingo, za veliki voćni miks.',
        'Lady Mystique i Eskimo Lemon, za ledeni mango-limun.',
        'Lady Mystique i Adalya Blue Melon, za ledeno tropsko voće.'
      ],
      en: [
        'Lady Mystique with Domingo for a big fruit blend.',
        'Lady Mystique with Eskimo Lemon for an icy mango lemon.',
        'Lady Mystique with Adalya Blue Melon for icy tropical fruit.'
      ]
    },
    similar: ['adalya-lady-killer', 'adalya-hawaii', 'revoshi-domingo', 'darkside-falling-star']
  },
  {
    id: 'revoshi-eskimo-lemon',
    brand: 'revoshi',
    leaf: 'light',
    name: 'Eskimo Lemon',
    mood: 'frost',
    shortDescription: {
      bs: 'Kiselkast limun na jakom ledu: oštar, čist i hladan.',
      en: 'Tangy lemon on strong ice: sharp, clean and cold.'
    },
    description: {
      bs: [
        'Eskimo Lemon je limun sa puno leda. Limun je svjež i kiselkast, sa malo slatkoće, a mentol je jak i hladi već na udahu.',
        'Okus je čist i oštar, idealan kad želiš nešto što "budi".',
        'Svijetli list. Odličan i kao ledeni dodatak voćnim okusima.'
      ],
      en: [
        'Eskimo Lemon is lemon with plenty of ice. The lemon is fresh and tangy with a bit of sweetness, and the menthol is strong, cooling right from the inhale.',
        'It is clean and sharp, ideal when you want something that wakes you up.',
        'Blonde leaf. Also great as an icy addition to fruit flavors.'
      ]
    },
    ingredients: [
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 8 },
      { name: { bs: 'Led', en: 'Ice' }, illustration: 'kristal', color: '#cdefff', intensity: 9 }
    ],
    profile: { sweetness: 5, freshness: 10, fruitiness: 6, cooling: 9, strength: 5 },
    tags: ['citrusni', 'ledeni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f2e04a', secondary: '#d8f4ff', accent: '#2a9ad8', background: '#eef9ff', text: '#1a2a06', water: '#d8f4ff', smoke: ['#ffffff', '#f2fbff', '#d8f0ff'] },
    mixIdeas: {
      bs: [
        'Eskimo Lemon i Domingo, 30/70, za ledeni voćni koktel.',
        'Eskimo Lemon i Lady Mystique, za ledeni mango-limun.',
        'Eskimo Lemon i Adalya Raspberry, za ledenu malinovu limunadu.'
      ],
      en: [
        'Eskimo Lemon with Domingo, 30/70, for an icy fruit cocktail.',
        'Eskimo Lemon with Lady Mystique for an icy mango lemon.',
        'Eskimo Lemon with Adalya Raspberry for an icy raspberry lemonade.'
      ]
    },
    similar: ['adalya-lemon-cocktail', 'fumari-lemon-mint', 'trifecta-twice-the-ice']
  },
  {
    id: 'revoshi-d-app-strong',
    brand: 'revoshi',
    leaf: 'light',
    name: 'D\'App Strong',
    mood: 'honey',
    shortDescription: {
      bs: 'Jača dvostruka jabuka: crvena i zelena jabuka sa anisom.',
      en: 'A stronger double apple: red and green apple with anise.'
    },
    description: {
      bs: [
        'D\'App Strong je Revoshi verzija dvostruke jabuke, napravljena da bude jača od uobičajene. Crvena i zelena jabuka daju slatko-kiselu osnovu, a anis je jasan i topao.',
        'Anis je između Al Fakhera i Nakhle: izraženiji od prvog, mekši od drugog.',
        'Svijetli list, ali sa više "udarca" od običnih svijetlih okusa.'
      ],
      en: [
        'D\'App Strong is the Revoshi take on double apple, made to be stronger than usual. Red and green apple give a sweet and sour base, and the anise is clear and warm.',
        'The anise sits between Al Fakher and Nakhla: more pronounced than the first, softer than the second.',
        'Blonde leaf, but with more "kick" than regular blonde flavors.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crvena jabuka', en: 'Red apple' }, illustration: 'jabuka', color: '#c8323c', intensity: 7 },
      { name: { bs: 'Zelena jabuka', en: 'Green apple' }, illustration: 'zelena-jabuka', color: '#8cc63f', intensity: 6 },
      { name: { bs: 'Anis', en: 'Anise' }, illustration: 'anis', color: '#6b4a2a', intensity: 7 }
    ],
    profile: { sweetness: 6, freshness: 4, fruitiness: 7, cooling: 0, strength: 7 },
    tags: ['klasicni', 'zacinski', 'vocni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#d03a3a', secondary: '#9ad04a', accent: '#f2c27a', background: '#200e0a', text: '#fff2e4' },
    mixIdeas: {
      bs: [
        'D\'App Strong i Al Fakher Mint, 70/30, za klasičnu jabuku sa mentom.',
        'D\'App Strong i Eskimo Lemon, 80/20, za ledenu jabuku.',
        'D\'App Strong i Fumari Spiced Chai, za pitu od jabuka.'
      ],
      en: [
        'D\'App Strong with Al Fakher Mint, 70/30, for a classic apple and mint.',
        'D\'App Strong with Eskimo Lemon, 80/20, for an icy apple.',
        'D\'App Strong with Fumari Spiced Chai for apple pie.'
      ]
    },
    similar: ['al-fakher-double-apple', 'nakhla-double-apple', 'al-fakher-mint', '187-oldschool-bang']
  },
  {
    id: '187-i-love-hamburg',
    brand: '187-strassenbande',
    leaf: 'light',
    name: 'I Love Hamburg',
    shortDescription: {
      bs: 'Marakuja, šumske bobice i lubenica: šaren, sočan voćni miks.',
      en: 'Passion fruit, wild berries and watermelon: a colorful, juicy blend.'
    },
    description: {
      bs: [
        'I Love Hamburg je jedan od najprodavanijih 187 okusa. Marakuja daje kiselkast tropski ton, šumske bobice tamnu slatkoću, a lubenica sočnost.',
        'Okus je slatko-kiseo i živ, bez hlađenja.',
        'Svijetli list, lagan. Dobar za društvo i ljetne večeri.'
      ],
      en: [
        'I Love Hamburg is one of the best selling 187 flavors. Passion fruit brings a tangy tropical tone, wild berries a dark sweetness, and watermelon juiciness.',
        'It is sweet and sour and lively, with no cooling.',
        'Blonde leaf, light. Good for groups and summer evenings.'
      ]
    },
    ingredients: [
      { name: { bs: 'Marakuja', en: 'Passion fruit' }, illustration: 'marakuja', color: '#f2a03a', intensity: 8 },
      { name: { bs: 'Šumske bobice', en: 'Wild berries' }, illustration: 'kupina', color: '#5a2a5e', intensity: 7 },
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8434f', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'tropski', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8304a', secondary: '#f2a03a', accent: '#7a3a9a', background: '#141414', text: '#f5f5f5' },
    mixIdeas: {
      bs: [
        'I Love Hamburg i Beach Vibez, za ljetni voćni miks.',
        'I Love Hamburg i Adalya Mint, 80/20, za osvježene bobice.',
        'I Love Hamburg i Wild Beast, za bobice sa čajem.'
      ],
      en: [
        'I Love Hamburg with Beach Vibez for a summer fruit mix.',
        'I Love Hamburg with Adalya Mint, 80/20, for refreshed berries.',
        'I Love Hamburg with Wild Beast for berries and tea.'
      ]
    },
    similar: ['adalya-love-66', 'true-passion-cinderella', 'starbuzz-code-69', 'al-fakher-guava']
  },
  {
    id: '187-beach-vibez',
    brand: '187-strassenbande',
    leaf: 'light',
    name: 'Beach Vibez',
    shortDescription: {
      bs: 'Narandža, malina, limeta i menta: svjež ljetni koktel.',
      en: 'Orange, raspberry, lime and mint: a fresh summer cocktail.'
    },
    description: {
      bs: [
        'Beach Vibez je ljetni koktel u glavi: slatka narandža i malina, kiselkasta limeta i malo mente na kraju.',
        'Menta je blaga, više osvježava nego hladi, a citrusi drže okus laganim.',
        'Svijetli list, lagan. Odličan za plažu, terasu i vruće večeri.'
      ],
      en: [
        'Beach Vibez is a summer cocktail in a bowl: sweet orange and raspberry, tangy lime and a little mint at the end.',
        'The mint is gentle, more refreshing than cooling, and the citrus keeps it light.',
        'Blonde leaf, light. Great for the beach, the terrace and hot evenings.'
      ]
    },
    ingredients: [
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 7 },
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#e0336b', intensity: 7 },
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#8cd23f', intensity: 6 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 4 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 9, cooling: 3, strength: 5 },
    tags: ['citrusni', 'vocni', 'ljetni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ff8a3d', secondary: '#e0336b', accent: '#8cd23f', background: '#fff2e6', text: '#2b1004' },
    mixIdeas: {
      bs: [
        'Beach Vibez i I Love Hamburg, za ljetni voćni miks.',
        'Beach Vibez i Starbuzz Pink, za malinovu limunadu.',
        'Beach Vibez i Revoshi Eskimo Lemon, 80/20, za ledeni koktel.'
      ],
      en: [
        'Beach Vibez with I Love Hamburg for a summer fruit mix.',
        'Beach Vibez with Starbuzz Pink for a raspberry lemonade.',
        'Beach Vibez with Revoshi Eskimo Lemon, 80/20, for an icy cocktail.'
      ]
    },
    similar: ['starbuzz-sex-on-the-beach', 'starbuzz-pink', 'adalya-tynky-wynky', 'al-fakher-orange']
  },
  {
    id: '187-wild-beast',
    brand: '187-strassenbande',
    leaf: 'light',
    name: 'Wild Beast',
    mood: 'night',
    shortDescription: {
      bs: 'Šumske bobice i crni čaj: tamno, voćno i malo trpko.',
      en: 'Forest berries and black tea: dark, fruity and slightly tannic.'
    },
    description: {
      bs: [
        'Wild Beast spaja tamne šumske bobice i crni čaj. Bobice su slatke i sočne, a čaj daje blago trpku, toplu dubinu, kao čaj od voća sa šećerom.',
        'Okus je tamniji i ozbiljniji od običnih voćnih miksova, odličan za večernje sesije.',
        'Svijetli list, lagan za pušenje.'
      ],
      en: [
        'Wild Beast pairs dark forest berries with black tea. The berries are sweet and juicy, and the tea adds a slightly tannic, warm depth, like a sweetened fruit tea.',
        'It is darker and more serious than a plain fruit mix, great for evening sessions.',
        'Blonde leaf, easy to smoke.'
      ]
    },
    ingredients: [
      { name: { bs: 'Šumske bobice', en: 'Forest berries' }, illustration: 'kupina', color: '#5a2a5e', intensity: 8 },
      { name: { bs: 'Crni čaj', en: 'Black tea' }, illustration: 'caj', color: '#7a3a12', intensity: 6 }
    ],
    profile: { sweetness: 6, freshness: 5, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['bobicasti', 'vocni', 'nocni', 'pice'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#7a3a9a', secondary: '#c08a5a', accent: '#e8304a', background: '#0e0812', text: '#f4eeff' },
    mixIdeas: {
      bs: [
        'Wild Beast i I Love Hamburg, za bobice sa čajem.',
        'Wild Beast i Fumari Spiced Chai, za zimski čaj sa bobicama.',
        'Wild Beast i Adalya Mint, 80/20, za ledeni čaj od bobica.'
      ],
      en: [
        'Wild Beast with I Love Hamburg for berries and tea.',
        'Wild Beast with Fumari Spiced Chai for a winter berry tea.',
        'Wild Beast with Adalya Mint, 80/20, for an iced berry tea.'
      ]
    },
    similar: ['darkside-wild-forest', 'sebero-arctic-mix-spice-fruit', 'fumari-spiced-chai', 'adalya-angel-lips']
  },
  {
    id: '187-siwlez',
    brand: '187-strassenbande',
    leaf: 'light',
    name: 'Siwlez',
    shortDescription: {
      bs: 'Jagoda sa limetom, narandžom, limunom i ribizlom.',
      en: 'Strawberry with lime, orange, lemon and currant.'
    },
    description: {
      bs: [
        'Siwlez spaja jagodu sa tri citrusa, limetom, narandžom i limunom, i ribizlom u pozadini.',
        'Jagoda daje slatkoću, citrusi svježinu i kiselinu, a ribizla tamniju, voćnu notu.',
        'Okus podsjeća na voćni punč i dobar je kad želiš nešto živo i kiselkasto.'
      ],
      en: [
        'Siwlez pairs strawberry with three citrus fruits, lime, orange and lemon, plus currant in the background.',
        'The strawberry brings sweetness, the citrus brings freshness and tang, and the currant adds a darker fruity note.',
        'It recalls a fruit punch and works well when you want something lively and tangy.'
      ]
    },
    ingredients: [
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e8354a', intensity: 7 },
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#7cc242', intensity: 6 },
      { name: { bs: 'Narandža', en: 'Orange' }, illustration: 'narandza', color: '#ff9a2e', intensity: 6 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 6 },
      { name: { bs: 'Ribizla', en: 'Currant' }, illustration: 'grozdic', color: '#2a1630', intensity: 5 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'citrusni', 'bobicasti', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8354a', secondary: '#7cc242', accent: '#ff9a2e', background: '#2a0d0f', text: '#fdf1f2' },
    mixIdeas: {
      bs: [
        'Siwlez i malo mente, 80/20, za svježiji punč.',
        'Siwlez i Pink Mellow, za ljetni citrusni mix.',
        'Siwlez i Beach Vibez, za tropski voćni kotlić.'
      ],
      en: [
        'Siwlez with a little mint, 80/20, for a fresher punch.',
        'Siwlez with Pink Mellow for a summer citrus mix.',
        'Siwlez with Beach Vibez for a tropical fruit bowl.'
      ]
    },
    similar: ['holster-miss-joosy', 'musthave-strawberry-lemon-watermelon', 'starbuzz-pirates-cave']
  },
  {
    id: '187-oldschool-bang',
    brand: '187-strassenbande',
    leaf: 'light',
    name: 'Oldschool Bang',
    shortDescription: {
      bs: 'Klasična dvostruka jabuka sa anisom.',
      en: 'Classic double apple with anise.'
    },
    description: {
      bs: [
        'Oldschool Bang je 187-ica verzija klasika: dvostruka jabuka sa anisom.',
        'Anis daje toplu, blago začinsku notu, pa je okus puniji od obične jabuke.',
        'Kao što ime kaže, ovo je za one koji vole stari, tradicionalni stil nargile.'
      ],
      en: [
        'Oldschool Bang is 187\'s take on the classic: double apple with anise.',
        'The anise adds a warm, gently spiced note, so the flavor is fuller than plain apple.',
        'As the name says, it is for people who like the old, traditional hookah style.'
      ]
    },
    ingredients: [
      { name: { bs: 'Dvostruka jabuka', en: 'Double apple' }, illustration: 'jabuka', color: '#d8323c', intensity: 8 },
      { name: { bs: 'Anis', en: 'Anise' }, illustration: 'anis', color: '#8a4a22', intensity: 6 }
    ],
    profile: { sweetness: 6, freshness: 3, fruitiness: 6, cooling: 0, strength: 5 },
    tags: ['klasicni', 'vocni', 'zacinski'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#d8323c', secondary: '#8a4a22', accent: '#ad8064', background: '#280d0d', text: '#fcf1f1' },
    mixIdeas: {
      bs: [
        'Oldschool Bang i Mint, 70/30, za klasičnu jabuku sa mentom.',
        'Oldschool Bang i Quelle, za jabuku i grožđe.',
        'Oldschool Bang sam, ako želiš čist tradicionalan okus.'
      ],
      en: [
        'Oldschool Bang with Mint, 70/30, for classic apple with mint.',
        'Oldschool Bang with Quelle for apple and grape.',
        'Oldschool Bang on its own if you want a pure traditional taste.'
      ]
    },
    similar: ['holster-twenty-five', 'al-fakher-double-apple', 'revoshi-d-app-strong']
  },
  {
    id: '187-quelle',
    brand: '187-strassenbande',
    leaf: 'light',
    name: 'Quelle',
    shortDescription: {
      bs: 'Grožđe sa mentom u 187 stilu.',
      en: 'Grape with mint, 187 style.'
    },
    description: {
      bs: [
        'Quelle je spoj grožđa i mente, jedne od najpoznatijih kombinacija u svijetu nargile.',
        'Grožđe je slatko i naprijed, a menta osvježava izdah.',
        'Siguran izbor kad želiš poznat okus na njemačkom svijetlom listu.'
      ],
      en: [
        'Quelle is a pairing of grape and mint, one of the best-known combinations in the hookah world.',
        'The grape is sweet and up front, and the mint freshens the exhale.',
        'A safe pick when you want a familiar flavor on German blonde leaf.'
      ]
    },
    ingredients: [
      { name: { bs: 'Grožđe', en: 'Grape' }, illustration: 'grozdje', color: '#6b2c7a', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 8, cooling: 5, strength: 5 },
    tags: ['vocni', 'mint', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#6b2c7a', secondary: '#2fae78', accent: '#6dc6a1', background: '#180c15', text: '#f5f0f6' },
    mixIdeas: {
      bs: [
        'Quelle i Oldschool Bang, za grožđe i jabuku.',
        'Quelle i Juicy Puzzy, za tamno voće.',
        'Quelle i malo limuna, za kiselkastije grožđe.'
      ],
      en: [
        'Quelle with Oldschool Bang for grape and apple.',
        'Quelle with Juicy Puzzy for dark fruit.',
        'Quelle with a little lemon for a tangier grape.'
      ]
    },
    similar: ['adalya-grape-mint', 'holster-grpe-mnt', 'al-waha-grape-mint']
  },
  {
    id: '187-juicy-puzzy',
    brand: '187-strassenbande',
    leaf: 'light',
    name: 'Juicy Puzzy',
    shortDescription: {
      bs: 'Borovnica i limun, zaobljeni slatkoćom meda.',
      en: 'Blueberry and lemon, rounded off with the sweetness of honey.'
    },
    description: {
      bs: [
        'Juicy Puzzy spaja borovnicu, limun i med.',
        'Borovnica je glavna, limun joj daje svježinu i blagu kiselinu, a med toplu, zaobljenu slatkoću.',
        'Okus podsjeća na limunadu od borovnice zaslađenu medom.'
      ],
      en: [
        'Juicy Puzzy combines blueberry, lemon and honey.',
        'The blueberry leads, the lemon gives it freshness and a light tang, and the honey adds a warm, rounded sweetness.',
        'It recalls a blueberry lemonade sweetened with honey.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4a5fc1', intensity: 8 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 6 },
      { name: { bs: 'Med', en: 'Honey' }, illustration: 'med', color: '#f3c96b', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 6, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['vocni', 'citrusni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#4a5fc1', secondary: '#f7e04b', accent: '#f3c96b', background: '#14131f', text: '#f2f4fb' },
    mixIdeas: {
      bs: [
        'Juicy Puzzy i malo mente, 80/20, za svježiju limunadu.',
        'Juicy Puzzy i Quelle, za tamno voće.',
        'Juicy Puzzy i Siwlez, za voćni punč.'
      ],
      en: [
        'Juicy Puzzy with a little mint, 80/20, for a fresher lemonade.',
        'Juicy Puzzy with Quelle for dark fruit.',
        'Juicy Puzzy with Siwlez for a fruit punch.'
      ]
    },
    similar: ['trifecta-blue-strawberry', 'al-fakher-blueberry', 'holster-blue-punch']
  },
  {
    id: '187-pink-mellow',
    brand: '187-strassenbande',
    leaf: 'light',
    name: 'Pink Mellow',
    shortDescription: {
      bs: 'Lubenica, grejpfrut i limeta u svježem, kiselkastom spoju.',
      en: 'Watermelon, grapefruit and lime in a fresh, tangy blend.'
    },
    description: {
      bs: [
        'Pink Mellow spaja lubenicu, grejpfrut i limetu.',
        'Lubenica daje sočnu slatkoću, a grejpfrut i limeta svježinu i blagu gorčinu citrusa.',
        'Okus je lagan i ljetni, više osvježavajući nego sladak.'
      ],
      en: [
        'Pink Mellow combines watermelon, grapefruit and lime.',
        'The watermelon brings juicy sweetness, and the grapefruit and lime bring freshness and a light citrus bitterness.',
        'The flavor is light and summery, more refreshing than sweet.'
      ]
    },
    ingredients: [
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8434f', intensity: 7 },
      { name: { bs: 'Grejpfrut', en: 'Grapefruit' }, illustration: 'grejpfrut', color: '#f26b6b', intensity: 7 },
      { name: { bs: 'Limeta', en: 'Lime' }, illustration: 'limeta', color: '#7cc242', intensity: 6 }
    ],
    profile: { sweetness: 6, freshness: 8, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['vocni', 'citrusni', 'ljetni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8434f', secondary: '#f26b6b', accent: '#7cc242', background: '#2a0f0f', text: '#fdf2f3' },
    mixIdeas: {
      bs: [
        'Pink Mellow i malo mente, 80/20, za ljetni kotlić.',
        'Pink Mellow i Siwlez, za citrusni punč.',
        'Pink Mellow i I Love Hamburg, za više lubenice.'
      ],
      en: [
        'Pink Mellow with a little mint, 80/20, for a summer bowl.',
        'Pink Mellow with Siwlez for a citrus punch.',
        'Pink Mellow with I Love Hamburg for more watermelon.'
      ]
    },
    similar: ['adalya-watermelon', 'al-fakher-watermelon', 'al-fakher-watermelon-mint']
  },
  {
    id: '187-sparkling-peaz',
    brand: '187-strassenbande',
    leaf: 'light',
    name: 'Sparkling Peaz',
    mood: 'fizz',
    shortDescription: {
      bs: 'Ledeni čaj od breskve u obliku duhana za nargilu.',
      en: 'Peach iced tea as a shisha flavor.'
    },
    description: {
      bs: [
        'Sparkling Peaz je okus ledenog čaja od breskve.',
        'Breskva je sočna i slatka, a čaj joj daje onu laganu, osvježavajuću notu koju ima ledeni čaj.',
        'Dobar je za ljeto i za one koji vole okuse pića.'
      ],
      en: [
        'Sparkling Peaz is a peach iced tea flavor.',
        'The peach is juicy and sweet, and the tea gives it the light, refreshing note iced tea has.',
        'Good for summer and for anyone who likes drink flavors.'
      ]
    },
    ingredients: [
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ffb07a', intensity: 8 },
      { name: { bs: 'Ledeni čaj', en: 'Iced tea' }, illustration: 'caj', color: '#c8843a', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 7, cooling: 0, strength: 5 },
    tags: ['vocni', 'pice', 'osvjezavajuci', 'ljetni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffb07a', secondary: '#c8843a', accent: '#d9a975', background: '#2d1f15', text: '#fff9f6' },
    mixIdeas: {
      bs: [
        'Sparkling Peaz i malo mente, 80/20, za hladniji čaj.',
        'Sparkling Peaz i limun, za čaj od breskve i limuna.',
        'Sparkling Peaz i Pink Mellow, za ljetno piće.'
      ],
      en: [
        'Sparkling Peaz with a little mint, 80/20, for a colder tea.',
        'Sparkling Peaz with lemon for a peach lemon tea.',
        'Sparkling Peaz with Pink Mellow for a summer drink.'
      ]
    },
    similar: ['revoshi-domingo', 'al-fakher-peach', 'holster-p-rex']
  },
  {
    id: '187-glacier',
    brand: '187-strassenbande',
    leaf: 'light',
    name: 'Glacier',
    mood: 'frost',
    mixRole: 'cooler',
    shortDescription: {
      bs: 'Ledeni bombon: slatko i jako hladno.',
      en: 'Ice candy: sweet and very cold.'
    },
    description: {
      bs: [
        'Glacier je okus ledenog bombona: slatka baza i jako hlađenje.',
        'Voća tu nema, pa je okus čist, a hladnoća je glavna.',
        'Najviše se koristi u miksevima, da bilo kojem voću doda led.'
      ],
      en: [
        'Glacier is an ice candy flavor: a sweet base and strong cooling.',
        'There is no fruit, so the flavor is clean and the cold is the main thing.',
        'It is used most in mixes, to add ice to any fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ledeni bombon', en: 'Ice candy' }, illustration: 'bombon', color: '#cdefff', intensity: 6 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 8 }
    ],
    profile: { sweetness: 6, freshness: 9, fruitiness: 1, cooling: 9, strength: 5 },
    tags: ['ledeni', 'bombon'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#cdefff', secondary: '#cdefff', accent: '#dcf4ff', background: '#262728', text: '#fcfeff' },
    mixIdeas: {
      bs: [
        'Glacier i Pink Mellow, 20/80, za ledenu lubenicu.',
        'Glacier i Juicy Puzzy, 20/80, za ledenu borovnicu.',
        'Glacier i Siwlez, 20/80, za ledeni punč.'
      ],
      en: [
        'Glacier with Pink Mellow, 20/80, for an icy watermelon.',
        'Glacier with Juicy Puzzy, 20/80, for an icy blueberry.',
        'Glacier with Siwlez, 20/80, for an icy punch.'
      ]
    },
    similar: ['holster-ice-bomb', 'adalya-swiss-bonbon', 'musthave-honey-holls']
  },
  {
    id: 'holster-ice-kaktuz',
    brand: 'holster',
    leaf: 'light',
    name: 'Ice Kaktuz',
    mood: 'frost',
    shortDescription: {
      bs: 'Kaktusova smokva sa ledom: neobično, sočno i hladno.',
      en: 'Prickly pear on ice: unusual, juicy and cold.'
    },
    description: {
      bs: [
        'Ice Kaktuz je kaktusova smokva (plod kaktusa) sa jakim hlađenjem. Plod je sočan i blago sladak, sa okusom negdje između lubenice, kivija i kruške.',
        'Hlađenje je jako, pa okus djeluje kao ledeni sok, svjež i lagan.',
        'Svijetli list. Dobar kad želiš nešto drugačije od uobičajenog voća.'
      ],
      en: [
        'Ice Kaktuz is prickly pear (cactus fruit) with strong cooling. The fruit is juicy and gently sweet, tasting somewhere between watermelon, kiwi and pear.',
        'The cooling is strong, so it feels like an iced juice, fresh and light.',
        'Blonde leaf. Good when you want something different from the usual fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Kaktusova smokva', en: 'Prickly pear' }, illustration: 'kaktus', color: '#e85a9a', intensity: 8 },
      { name: { bs: 'Led', en: 'Ice' }, illustration: 'kristal', color: '#cdefff', intensity: 8 }
    ],
    profile: { sweetness: 6, freshness: 10, fruitiness: 8, cooling: 8, strength: 5 },
    tags: ['vocni', 'ledeni', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e85a9a', secondary: '#7fcf6a', accent: '#bfefff', background: '#0e1a14', text: '#fff0f6', water: '#c8efff' },
    mixIdeas: {
      bs: [
        'Ice Kaktuz i Adalya Hawaii, za ledeno tropsko voće.',
        'Ice Kaktuz i Al Fakher Watermelon Mint, za ledenu lubenicu.',
        'Ice Kaktuz i Haze Cucumberita, za ledeni vrtni koktel.'
      ],
      en: [
        'Ice Kaktuz with Adalya Hawaii for icy tropical fruit.',
        'Ice Kaktuz with Al Fakher Watermelon Mint for an icy watermelon.',
        'Ice Kaktuz with Haze Cucumberita for an icy garden cocktail.'
      ]
    },
    similar: ['haze-cucumberita', 'serbetli-ice-watermelon', 'adalya-blue-melon', 'adalya-cactus']
  },
  {
    id: 'holster-ice-bomb',
    brand: 'holster',
    leaf: 'light',
    name: 'Ice Bomb',
    mood: 'frost',
    shortDescription: {
      bs: 'Menta i jak led sa slatkom notom bombona.',
      en: 'Mint and strong ice with a sweet candy note.'
    },
    description: {
      bs: [
        'Ice Bomb je menta sa jakim ledom i slatkom notom bombona u pozadini.',
        'Hladnoća je glavna, a slatkoća je tu da okus ne bude oštar kao čista menta.',
        'Odličan je sam za vruće dane, a u miksevima doda led bilo kojem voću.'
      ],
      en: [
        'Ice Bomb is mint with strong ice and a sweet candy note in the background.',
        'The cold leads, and the sweetness is there so the flavor is not as sharp as plain mint.',
        'Great on its own for hot days, and in mixes it adds ice to any fruit.'
      ]
    },
    ingredients: [
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 7 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 8 },
      { name: { bs: 'Slatki bombon', en: 'Sweet candy' }, illustration: 'bombon', color: '#e8f6ff', intensity: 4 }
    ],
    profile: { sweetness: 5, freshness: 9, fruitiness: 1, cooling: 9, strength: 5 },
    tags: ['mint', 'ledeni', 'bombon'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#2fae78', secondary: '#cdefff', accent: '#e8f6ff', background: '#101e15', text: '#f0f9f6' },
    mixIdeas: {
      bs: [
        'Ice Bomb i Ice Kaktuz, za ledeni kaktus.',
        'Ice Bomb i Miss Joosy, 30/70, za ledene bobice.',
        'Ice Bomb i Blue Punch, 30/70, za ledenu borovnicu.'
      ],
      en: [
        'Ice Bomb with Ice Kaktuz for an icy cactus.',
        'Ice Bomb with Miss Joosy, 30/70, for icy berries.',
        'Ice Bomb with Blue Punch, 30/70, for an icy blueberry.'
      ]
    },
    similar: ['haze-mint-supreme', 'adalya-swiss-bonbon', 'musthave-ice-mint']
  },
  {
    id: 'holster-grpe-mnt',
    brand: 'holster',
    leaf: 'light',
    name: 'Grpe Mnt',
    shortDescription: {
      bs: 'Slatko tamno grožđe sa osvježavajućom mentom.',
      en: 'Sweet dark grape with refreshing mint.'
    },
    description: {
      bs: [
        'Grpe Mnt je Holsterova verzija grožđa sa mentom, napisana na njihov način, bez samoglasnika.',
        'Slatko tamno grožđe je naprijed, a menta daje svjež završetak.',
        'Klasičan okus, dobar i za početnike.'
      ],
      en: [
        'Grpe Mnt is Holster\'s take on grape mint, spelled their own way, without the vowels.',
        'Sweet dark grape leads, and the mint gives a fresh finish.',
        'A classic flavor, good for beginners too.'
      ]
    },
    ingredients: [
      { name: { bs: 'Tamno grožđe', en: 'Dark grape' }, illustration: 'grozdje', color: '#4a1f5a', intensity: 8 },
      { name: { bs: 'Menta', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 8, cooling: 5, strength: 5 },
    tags: ['vocni', 'mint', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#4a1f5a', secondary: '#2fae78', accent: '#6dc6a1', background: '#140a11', text: '#f2eff3' },
    mixIdeas: {
      bs: [
        'Grpe Mnt i Blue Punch, za tamno voće.',
        'Grpe Mnt i Ice Bomb, 70/30, za ledeno grožđe.',
        'Grpe Mnt i Twenty Five, za grožđe i jabuku.'
      ],
      en: [
        'Grpe Mnt with Blue Punch for dark fruit.',
        'Grpe Mnt with Ice Bomb, 70/30, for an icy grape.',
        'Grpe Mnt with Twenty Five for grape and apple.'
      ]
    },
    similar: ['adalya-grape-mint', '187-quelle', 'al-waha-grape-mint']
  },
  {
    id: 'holster-miss-joosy',
    brand: 'holster',
    leaf: 'light',
    name: 'Miss Joosy',
    shortDescription: {
      bs: 'Jagoda i malina, sočne i slatke.',
      en: 'Strawberry and raspberry, juicy and sweet.'
    },
    description: {
      bs: [
        'Miss Joosy spaja dvije crvene bobice: jagodu i malinu.',
        'Jagoda daje slatkoću, a malina blagu kiselinu, pa okus nije previše sladak.',
        'Dobar je sam i kao voćna baza za mikseve sa mentom ili ledom.'
      ],
      en: [
        'Miss Joosy brings together two red berries: strawberry and raspberry.',
        'The strawberry brings sweetness and the raspberry a light tartness, so the flavor is not too sweet.',
        'Good on its own and as a fruity base for mixes with mint or ice.'
      ]
    },
    ingredients: [
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e8354a', intensity: 8 },
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#d61f5b', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e8354a', secondary: '#d61f5b', accent: '#e2628c', background: '#2a0d0f', text: '#fdf1f2' },
    mixIdeas: {
      bs: [
        'Miss Joosy i Ice Bomb, 70/30, za ledene bobice.',
        'Miss Joosy i P-Rex, za bobice i breskvu.',
        'Miss Joosy i Lamoretto, za crveno voće sa limunom.'
      ],
      en: [
        'Miss Joosy with Ice Bomb, 70/30, for icy berries.',
        'Miss Joosy with P-Rex for berries and peach.',
        'Miss Joosy with Lamoretto for red fruit with lemon.'
      ]
    },
    similar: ['al-fakher-strawberry', '187-siwlez', 'adalya-strawberry-splash']
  },
  {
    id: 'holster-blue-punch',
    brand: 'holster',
    leaf: 'light',
    name: 'Blue Punch',
    shortDescription: {
      bs: 'Borovnica, slatka sa blago kiselkastom notom.',
      en: 'Blueberry, sweet with a slightly tart note.'
    },
    description: {
      bs: [
        'Blue Punch je voćni okus borovnice, sladak sa blago kiselkastom notom.',
        'Nema mente ni leda, pa se borovnica osjeti čisto.',
        'Lijepo se slaže sa mentom, ledom i drugim bobicama.'
      ],
      en: [
        'Blue Punch is a fruity blueberry flavor, sweet with a slightly tart note.',
        'There is no mint or ice, so the blueberry comes through cleanly.',
        'It goes nicely with mint, ice and other berries.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4a5fc1', intensity: 9 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 8, cooling: 0, strength: 5 },
    tags: ['vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#4a5fc1', secondary: '#9ba7dd', accent: '#384791', background: '#14131f', text: '#f2f4fb' },
    mixIdeas: {
      bs: [
        'Blue Punch i Ice Bomb, 70/30, za ledenu borovnicu.',
        'Blue Punch i Miss Joosy, za mix bobica.',
        'Blue Punch i Grpe Mnt, za tamno voće sa mentom.'
      ],
      en: [
        'Blue Punch with Ice Bomb, 70/30, for an icy blueberry.',
        'Blue Punch with Miss Joosy for a berry mix.',
        'Blue Punch with Grpe Mnt for dark fruit with mint.'
      ]
    },
    similar: ['al-fakher-blueberry', '187-juicy-puzzy', 'trifecta-blue-strawberry']
  },
  {
    id: 'holster-wild-punch',
    brand: 'holster',
    leaf: 'light',
    name: 'Wild Punch',
    shortDescription: {
      bs: 'Slatko crveno šumsko voće sa hladnim mentolom.',
      en: 'Sweet red forest berries with cool menthol.'
    },
    description: {
      bs: [
        'Wild Punch spaja slatko, voćno crveno šumsko voće sa hladnim mentolom.',
        'Bobice daju sočnu slatkoću, a mentol svježinu koja se osjeti na izdahu.',
        'Dobar je za one koji vole voće sa ledom, ali ne žele samo mentu.'
      ],
      en: [
        'Wild Punch combines sweet, fruity red forest berries with cool menthol.',
        'The berries bring juicy sweetness, and the menthol a freshness you feel on the exhale.',
        'Good for people who like fruit on ice but do not want plain mint.'
      ]
    },
    ingredients: [
      { name: { bs: 'Crveno šumsko voće', en: 'Red forest berries' }, illustration: 'kupina', color: '#a3122a', intensity: 8 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 7, fruitiness: 9, cooling: 6, strength: 5 },
    tags: ['vocni', 'bobicasti', 'slatki', 'osvjezavajuci'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#a3122a', secondary: '#cdefff', accent: '#dcf4ff', background: '#20090a', text: '#f9eef0' },
    mixIdeas: {
      bs: [
        'Wild Punch i Miss Joosy, za više jagode i maline.',
        'Wild Punch i Blue Punch, za ledene bobice.',
        'Wild Punch i limun, za kiselkastiji punč.'
      ],
      en: [
        'Wild Punch with Miss Joosy for more strawberry and raspberry.',
        'Wild Punch with Blue Punch for icy berries.',
        'Wild Punch with lemon for a tangier punch.'
      ]
    },
    similar: ['true-passion-cinderella', 'adalya-lady-killer', '187-wild-beast']
  },
  {
    id: 'holster-lamoretto',
    brand: 'holster',
    leaf: 'light',
    name: 'Lamoretto',
    shortDescription: {
      bs: 'Slatka višnja i svježi limun sa orašastom notom badema.',
      en: 'Sweet cherry and fresh lemon with a nutty almond note.'
    },
    description: {
      bs: [
        'Lamoretto spaja slatku višnju, svježi limun i orašastu dubinu badema.',
        'Badem daje okusu desertni karakter, a limun ga drži svježim.',
        'Neobičan spoj, dobar kad želiš nešto između voća i deserta.'
      ],
      en: [
        'Lamoretto combines sweet cherry, fresh lemon and the nutty depth of almond.',
        'The almond gives the flavor a dessert-like character, while the lemon keeps it fresh.',
        'An unusual blend, good when you want something between fruit and dessert.'
      ]
    },
    ingredients: [
      { name: { bs: 'Višnja', en: 'Cherry' }, illustration: 'visnja', color: '#a3122a', intensity: 7 },
      { name: { bs: 'Limun', en: 'Lemon' }, illustration: 'limun', color: '#f7e04b', intensity: 6 },
      { name: { bs: 'Badem', en: 'Almond' }, illustration: 'karamel', color: '#d6b48a', intensity: 5 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 7, cooling: 0, strength: 5 },
    tags: ['vocni', 'desertni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#a3122a', secondary: '#f7e04b', accent: '#d6b48a', background: '#20090a', text: '#f9eef0' },
    mixIdeas: {
      bs: [
        'Lamoretto i Miss Joosy, za crveno voće.',
        'Lamoretto i malo mente, 80/20, za svježiji kraj.',
        'Lamoretto sam, ako želiš puni desertni okus.'
      ],
      en: [
        'Lamoretto with Miss Joosy for red fruit.',
        'Lamoretto with a little mint, 80/20, for a fresher finish.',
        'Lamoretto on its own if you want the full dessert flavor.'
      ]
    },
    similar: ['al-fakher-cherry', 'fumari-red-gummi-bear', 'tangiers-maraschino-cherry']
  },
  {
    id: 'holster-p-rex',
    brand: 'holster',
    leaf: 'light',
    name: 'P-Rex',
    shortDescription: {
      bs: 'Sočna breskva i slatka malina.',
      en: 'Juicy peach and sweet raspberry.'
    },
    description: {
      bs: [
        'P-Rex spaja sočnu breskvu i slatku malinu.',
        'Breskva je mekana i sočna, a malina joj daje živost i blagu kiselinu.',
        'Voćan, sladak okus, dobar i sam i u miksevima.'
      ],
      en: [
        'P-Rex combines juicy peach and sweet raspberry.',
        'The peach is soft and juicy, and the raspberry gives it liveliness and a light tartness.',
        'A fruity, sweet flavor, good on its own and in mixes.'
      ]
    },
    ingredients: [
      { name: { bs: 'Breskva', en: 'Peach' }, illustration: 'breskva', color: '#ffb07a', intensity: 8 },
      { name: { bs: 'Malina', en: 'Raspberry' }, illustration: 'malina', color: '#d61f5b', intensity: 7 }
    ],
    profile: { sweetness: 8, freshness: 5, fruitiness: 9, cooling: 0, strength: 5 },
    tags: ['vocni', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffb07a', secondary: '#d61f5b', accent: '#e2628c', background: '#2d1f15', text: '#fff9f6' },
    mixIdeas: {
      bs: [
        'P-Rex i Ice Bomb, 70/30, za ledenu breskvu.',
        'P-Rex i Miss Joosy, za više bobica.',
        'P-Rex i Lamoretto, za voćni desert.'
      ],
      en: [
        'P-Rex with Ice Bomb, 70/30, for an icy peach.',
        'P-Rex with Miss Joosy for more berries.',
        'P-Rex with Lamoretto for a fruity dessert.'
      ]
    },
    similar: ['al-fakher-peach', 'revoshi-domingo', 'adalya-english-lord']
  },
  {
    id: 'holster-twenty-five',
    brand: 'holster',
    leaf: 'light',
    name: 'Twenty Five',
    shortDescription: {
      bs: 'Dvostruka jabuka i anis, klasik na svijetlom listu.',
      en: 'Double apple and anise, a classic on blonde leaf.'
    },
    description: {
      bs: [
        'Twenty Five je Holsterova dvostruka jabuka sa anisom.',
        'Jabuka daje slatkoću, a anis toplu, blago začinsku notu.',
        'Za one koji vole tradicionalan okus nargile, na blagom svijetlom listu.'
      ],
      en: [
        'Twenty Five is Holster\'s double apple with anise.',
        'The apple brings sweetness, and the anise a warm, gently spiced note.',
        'For people who like a traditional hookah taste, on mild blonde leaf.'
      ]
    },
    ingredients: [
      { name: { bs: 'Dvostruka jabuka', en: 'Double apple' }, illustration: 'jabuka', color: '#d8323c', intensity: 8 },
      { name: { bs: 'Anis', en: 'Anise' }, illustration: 'anis', color: '#8a4a22', intensity: 6 }
    ],
    profile: { sweetness: 6, freshness: 3, fruitiness: 6, cooling: 0, strength: 5 },
    tags: ['klasicni', 'vocni', 'zacinski'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#d8323c', secondary: '#8a4a22', accent: '#ad8064', background: '#280d0d', text: '#fcf1f1' },
    mixIdeas: {
      bs: [
        'Twenty Five i Grpe Mnt, za jabuku i grožđe sa mentom.',
        'Twenty Five i malo mente, 80/20, za svježiju jabuku.',
        'Twenty Five sam, za čist klasičan okus.'
      ],
      en: [
        'Twenty Five with Grpe Mnt for apple and grape with mint.',
        'Twenty Five with a little mint, 80/20, for a fresher apple.',
        'Twenty Five on its own for a pure classic taste.'
      ]
    },
    similar: ['187-oldschool-bang', 'al-fakher-double-apple', 'revoshi-d-app-strong']
  },
  {
    id: 'true-passion-cinderella',
    brand: 'true-passion',
    leaf: 'light',
    name: 'Cinderella',
    shortDescription: {
      bs: 'Bobice, mango, marakuja, lubenica i dinja sa mentolom.',
      en: 'Berries, mango, passion fruit, watermelon and honeydew with menthol.'
    },
    description: {
      bs: [
        'Cinderella je bogat voćni miks: bobice, mango, marakuja, lubenica i medena dinja, a na kraju lagan mentol.',
        'Uprkos puno sastojaka, okus nije zbrkan: bobice i tropsko voće vode, dinje daju sočnost, a mentol svjež izdah.',
        'Svijetli list, lagan. Dobar za one koji vole "sve voće odjednom" sa malo leda.'
      ],
      en: [
        'Cinderella is a rich fruit blend: berries, mango, passion fruit, watermelon and honeydew, with light menthol at the end.',
        'Despite all the ingredients it is not muddled: berries and tropical fruit lead, the melons add juiciness, and the menthol a fresh exhale.',
        'Blonde leaf, light. Good for anyone who likes "all the fruit at once" with a little ice.'
      ]
    },
    ingredients: [
      { name: { bs: 'Bobice', en: 'Berries' }, illustration: 'kupina', color: '#7a2f6b', intensity: 7 },
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 6 },
      { name: { bs: 'Marakuja', en: 'Passion fruit' }, illustration: 'marakuja', color: '#f2a03a', intensity: 6 },
      { name: { bs: 'Lubenica', en: 'Watermelon' }, illustration: 'lubenica', color: '#e8434f', intensity: 5 },
      { name: { bs: 'Medena dinja', en: 'Honeydew' }, illustration: 'dinja', color: '#d9ec9f', intensity: 5 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 5 }
    ],
    profile: { sweetness: 8, freshness: 7, fruitiness: 10, cooling: 5, strength: 5 },
    tags: ['vocni', 'tropski', 'bobicasti', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#e85a9a', secondary: '#9b6cf0', accent: '#ffb52e', background: '#1a0c1e', text: '#fff0fa' },
    mixIdeas: {
      bs: [
        'Cinderella i Adalya Mint, 80/20, za ledeniji voćni miks.',
        'Cinderella i 187 I Love Hamburg, za još više bobica.',
        'Cinderella i Adalya Hawaii, za tropski koktel.'
      ],
      en: [
        'Cinderella with Adalya Mint, 80/20, for an icier fruit mix.',
        'Cinderella with 187 I Love Hamburg for even more berries.',
        'Cinderella with Adalya Hawaii for a tropical cocktail.'
      ]
    },
    similar: ['adalya-love-66', '187-i-love-hamburg', 'starbuzz-code-69', 'trifecta-ruby']
  },
  {
    id: 'nameless-black-nana',
    brand: 'nameless',
    leaf: 'light',
    name: 'Black Nana',
    mood: 'night',
    shortDescription: {
      bs: 'Tamno grožđe i nana: slatko, bogato i svježe.',
      en: 'Dark grape and mint: sweet, rich and fresh.'
    },
    description: {
      bs: [
        'Black Nana je jedan od najpoznatijih njemačkih okusa. Tamno grožđe je slatko i bogato, skoro kao sok od crnog grožđa, a nana (menta) ga hladi i osvježava.',
        'Grožđe je tamnije i dublje nego kod Al Fakher Grape Mint, a menta jasnija.',
        'Svijetli list. Odličan za večernje sesije i za poređenje sa ostalim Grape Mint okusima.'
      ],
      en: [
        'Black Nana is one of the best known German flavors. The dark grape is sweet and rich, almost like black grape juice, and the "nana" (mint) cools and refreshes it.',
        'The grape is darker and deeper than in Al Fakher Grape Mint, and the mint clearer.',
        'Blonde leaf. Great for evening sessions and for comparing with the other Grape Mint flavors.'
      ]
    },
    ingredients: [
      { name: { bs: 'Tamno grožđe', en: 'Dark grape' }, illustration: 'grozdje', color: '#4a1f5e', intensity: 8 },
      { name: { bs: 'Nana', en: 'Mint' }, illustration: 'menta', color: '#2fae78', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 8, cooling: 6, strength: 5 },
    tags: ['vocni', 'mint', 'nocni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#6a2a8a', secondary: '#2fae78', accent: '#c9a0ff', background: '#100a16', text: '#f4eeff' },
    mixIdeas: {
      bs: [
        'Black Nana i Adalya Lemon Cocktail, 70/30, za limunadu od grožđa.',
        'Black Nana i Serbetli Ice Blueberry, za tamne ledene bobice.',
        'Black Nana i Al Fakher Double Apple, za klasični miks.'
      ],
      en: [
        'Black Nana with Adalya Lemon Cocktail, 70/30, for a grape lemonade.',
        'Black Nana with Serbetli Ice Blueberry for dark icy berries.',
        'Black Nana with Al Fakher Double Apple for a classic mix.'
      ]
    },
    similar: ['al-fakher-grape-mint', 'al-waha-grape-mint', 'haze-purple-krush', 'adalya-grape-mint']
  },
  {
    id: 'element-blueberry-yogurt',
    brand: 'element',
    leaf: 'light',
    name: 'Blueberry Yogurt',
    shortDescription: {
      bs: 'Zrela borovnica i kremasti, blago kiselkasti jogurt.',
      en: 'Ripe blueberry and creamy, slightly tangy yogurt.'
    },
    description: {
      bs: [
        'Blueberry Yogurt je iz Elementove Air linije, najblaže linije ovog brenda.',
        'Zrela borovnica daje slatkoću, a jogurt kremastu, blago kiselkastu notu.',
        'Okus podsjeća na voćni jogurt i dobar je za one koji vole blage, kremaste okuse.'
      ],
      en: [
        'Blueberry Yogurt is from Element\'s Air line, the brand\'s mildest line.',
        'Ripe blueberry brings sweetness, and the yogurt a creamy, slightly tangy note.',
        'It recalls a fruit yogurt and suits people who like mild, creamy flavors.'
      ]
    },
    ingredients: [
      { name: { bs: 'Borovnica', en: 'Blueberry' }, illustration: 'borovnica', color: '#4a5fc1', intensity: 8 },
      { name: { bs: 'Jogurt', en: 'Yogurt' }, illustration: 'sejk', color: '#f6f1e6', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 7, cooling: 0, strength: 4 },
    tags: ['vocni', 'bobicasti', 'desertni'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#4a5fc1', secondary: '#f6f1e6', accent: '#f9f5ee', background: '#14131f', text: '#f2f4fb' },
    mixIdeas: {
      bs: [
        'Blueberry Yogurt i malo mente, 80/20, za svježiji jogurt.',
        'Blueberry Yogurt i Maui, za tropski jogurt.',
        'Blueberry Yogurt i jagoda, za jogurt od bobica.'
      ],
      en: [
        'Blueberry Yogurt with a little mint, 80/20, for a fresher yogurt.',
        'Blueberry Yogurt with Maui for a tropical yogurt.',
        'Blueberry Yogurt with strawberry for a berry yogurt.'
      ]
    },
    similar: ['musthave-violet', 'holster-blue-punch', '187-juicy-puzzy']
  },
  {
    id: 'element-maui',
    brand: 'element',
    leaf: 'light',
    name: 'Maui',
    shortDescription: {
      bs: 'Ananas i papaja, tropski okus iz Air linije.',
      en: 'Pineapple and papaya, a tropical flavor from the Air line.'
    },
    description: {
      bs: [
        'Maui spaja ananas i papaju, dva tropska voća.',
        'Ananas daje svježinu i blagu kiselinu, a papaja mekanu, zrelu slatkoću.',
        'Iz Air linije je, pa je blag i dobar i za one koji tek počinju.'
      ],
      en: [
        'Maui combines pineapple and papaya, two tropical fruits.',
        'The pineapple brings freshness and a light tang, and the papaya a soft, ripe sweetness.',
        'It is from the Air line, so it is mild and fine for beginners too.'
      ]
    },
    ingredients: [
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f8cf4a', intensity: 8 },
      { name: { bs: 'Papaja', en: 'Papaya' }, illustration: 'papaja', color: '#ff8a3d', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 6, fruitiness: 9, cooling: 0, strength: 4 },
    tags: ['vocni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#f8cf4a', secondary: '#ff8a3d', accent: '#ffad77', background: '#2c230f', text: '#fffcf2' },
    mixIdeas: {
      bs: [
        'Maui i malo mente, 80/20, za svjež tropski kotlić.',
        'Maui i Blueberry Yogurt, za tropski jogurt.',
        'Maui i mango, za još više tropskog voća.'
      ],
      en: [
        'Maui with a little mint, 80/20, for a fresh tropical bowl.',
        'Maui with Blueberry Yogurt for a tropical yogurt.',
        'Maui with mango for even more tropical fruit.'
      ]
    },
    similar: ['al-fakher-pineapple', 'adalya-sheik-money', 'trifecta-pineapple-guava']
  },
  {
    id: 'element-fruit-pulp',
    brand: 'element',
    leaf: 'dark',
    name: 'Fruit Pulp',
    shortDescription: {
      bs: 'Kremasta banana, svježa jabuka i ananas iz Water linije.',
      en: 'Creamy banana, crisp apple and pineapple from the Water line.'
    },
    description: {
      bs: [
        'Fruit Pulp spaja kremastu bananu, svježu jabuku i kiselkasti ananas.',
        'Okus podsjeća na gusti voćni sok sa komadićima voća.',
        'Iz Water linije je, srednje jačine, pa je jači od Air linije i više odgovara iskusnijima.'
      ],
      en: [
        'Fruit Pulp combines creamy banana, crisp apple and tangy pineapple.',
        'It recalls a thick fruit juice with bits of fruit in it.',
        'It is from the Water line, of medium strength, so it is stronger than the Air line and suits more experienced smokers.'
      ]
    },
    ingredients: [
      { name: { bs: 'Banana', en: 'Banana' }, illustration: 'banana', color: '#fbe48c', intensity: 7 },
      { name: { bs: 'Jabuka', en: 'Apple' }, illustration: 'jabuka', color: '#8cc63f', intensity: 6 },
      { name: { bs: 'Ananas', en: 'Pineapple' }, illustration: 'ananas', color: '#f8cf4a', intensity: 6 }
    ],
    profile: { sweetness: 7, freshness: 5, fruitiness: 9, cooling: 0, strength: 7 },
    tags: ['vocni', 'tropski', 'slatki'],
    tobaccoType: { bs: 'Tamni list', en: 'Dark leaf' },
    palette: { primary: '#fbe48c', secondary: '#8cc63f', accent: '#f8cf4a', background: '#2d2618', text: '#fffdf7' },
    mixIdeas: {
      bs: [
        'Fruit Pulp i malo mente, 80/20, za svježiji sok.',
        'Fruit Pulp i Maui, za tropski sok.',
        'Fruit Pulp i jagoda, za voćni smoothie.'
      ],
      en: [
        'Fruit Pulp with a little mint, 80/20, for a fresher juice.',
        'Fruit Pulp with Maui for a tropical juice.',
        'Fruit Pulp with strawberry for a fruit smoothie.'
      ]
    },
    similar: ['musthave-banana-mama', 'darkside-bananapapa', 'musthave-paradise']
  }
];
