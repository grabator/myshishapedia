/*
 * MyShishapedia - podaci o okusima (oba jezika).
 *
 * Tekstualna polja su { bs: ..., en: ... }. Šema je opisana u docs/UPUTSTVO.md
 * ("Kako dodati novi okus"). Vrijednosti u `profile` i `intensity` su procjene
 * i treba ih provjeriti; sastav okusa Lady Killer, Berlin Nights i Angel Lips
 * je u docs/UPUTSTVO.md označen kao "provjeriti", kao i sastav svih okusa drugih brendova.
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
    similar: ['fumari-white-gummi-bear', 'adalya-lady-killer', 'adalya-love-66']
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
    similar: ['adalya-angel-lips', 'adalya-dubai', 'adalya-double-melon']
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
    similar: ['adalya-ice-bonbon', 'adalya-baku-nights', 'adalya-mint']
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
      bs: 'Sočni mango, dinja i jagoda, sa hladnim mentol završetkom.',
      en: 'Juicy mango, melon and strawberry with a cool menthol finish.'
    },
    description: {
      bs: [
        'Lady Killer je sočan tropski miks u kojem mango vodi glavnu riječ: zreo, gust i sladak. Dinja ga čini svježijim i lakšim, a jagoda dodaje crvenu, blago kiselkastu notu.',
        'Na kraju dolazi mentol. Nije sladak kao menta, nego čist i hladan, pa voće ostaje u prvom planu, a izdah je osvježavajući.',
        'Dobar izbor za ljubitelje voćnih okusa koji vole kad se na kraju osjeti malo leda.'
      ],
      en: [
        'Lady Killer is a juicy tropical blend led by mango: ripe, thick and sweet. Melon lightens it up and makes it fresher, while strawberry adds a red, slightly tart note.',
        'Menthol closes it out. It is not sweet like mint, just clean and cold, so the fruit stays up front and the exhale feels refreshing.',
        'A solid pick for fruit lovers who like a touch of ice at the end.'
      ]
    },
    ingredients: [
      { name: { bs: 'Mango', en: 'Mango' }, illustration: 'mango', color: '#ffb52e', intensity: 8 },
      { name: { bs: 'Dinja', en: 'Melon' }, illustration: 'dinja', color: '#d9ec9f', intensity: 6 },
      { name: { bs: 'Jagoda', en: 'Strawberry' }, illustration: 'jagoda', color: '#e8354a', intensity: 6 },
      { name: { bs: 'Mentol', en: 'Menthol' }, illustration: 'kristal', color: '#cdefff', intensity: 7 }
    ],
    profile: { sweetness: 7, freshness: 8, fruitiness: 9, cooling: 7, strength: 7 },
    tags: ['vocni', 'tropski', 'ledeni', 'slatki'],
    tobaccoType: { bs: 'Virginia (svijetli list)', en: 'Virginia (blonde leaf)' },
    palette: { primary: '#ffc34d', secondary: '#e8354a', accent: '#39b8e6', background: '#f7a531', text: '#2a1300', water: '#b9ecff' },
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
    similar: ['adalya-dubai', 'adalya-love-66', 'adalya-ice-bonbon']
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
    similar: ['adalya-love-66', 'adalya-berlin-nights', 'adalya-raspberry']
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
    similar: ['tangiers-cane-mint', 'adalya-cherry-mint', 'haze-cucumberita']
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
    similar: ['starbuzz-blue-mist', 'adalya-ice-bonbon', 'adalya-angel-lips']
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
    similar: ['musthave-pinkman', 'adalya-angel-lips', 'adalya-blue-ice']
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
    similar: ['adalya-love-66', 'adalya-angel-lips', 'adalya-lady-killer']
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
    similar: ['adalya-dubai', 'adalya-love-66', 'adalya-double-melon']
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
    similar: ['adalya-berlin-nights', 'adalya-baku-nights', 'adalya-mint']
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
    similar: ['adalya-mint', 'darkside-supernova', 'trifecta-peppermint-shake']
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
    similar: ['adalya-dubai', 'adalya-tynky-wynky', 'adalya-ice-bonbon']
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
    similar: ['adalya-raspberry', 'sebero-arctic-mix-jelly-fruit', 'adalya-angel-lips']
  },
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
    similar: ['musthave-pinkman', 'adalya-ice-bonbon', 'adalya-tynky-wynky']
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
    similar: ['adalya-mint', 'adalya-tynky-wynky', 'adalya-double-melon']
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
    similar: ['tangiers-cane-mint', 'starbuzz-blue-mist', 'adalya-swiss-bonbon']
  }
];
