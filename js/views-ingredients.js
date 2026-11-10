/*
 * MyShishapedia - stranice okusa po sastojku ("Shisha Tabak Wassermelone", "watermelon hookah flavors",
 * "okusi za nargilu sa lubenicom"). Adrese su ispod liste okusa: /bs/okusi/lubenica/,
 * /en/flavors/watermelon/, /de/geschmacksrichtungen/wassermelone/.
 *
 * Lista okusa na svakoj stranici se pravi iz data/flavors.js (sastojci okusa), pa se novi okus sam
 * pojavi na pravim stranicama. Stranica se ne pravi ako ima manje od MIN_FLAVORS okusa.
 * Tekstovi su na sva tri jezika ovdje (bs, en, de).
 *
 * Polja:
 *   id      ključ stranice
 *   slug    adresa po jeziku
 *   match   lista grupa ilustracija sastojaka: okus mora imati bar jednu iz SVAKE grupe
 *           (npr. [['limun'], ['menta', 'pepermint']] = limun i menta); ili tag: 'kiseli'
 *   h1      naslov stranice po jeziku
 *   noun    naziv sastojka u rečenici (bs, en, de)
 *   about   jedna do dvije rečenice o tome kako taj sastojak "radi" u nargili
 *   related id-jevi srodnih stranica
 * Ovisi o: views.js (V), views-extra.js (V.andList), strings.js (t).
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  var L = MSP.L;
  var esc = V.esc;
  function t(k, v) { return MSP.t(k, v); }

  var MIN_FLAVORS = 4;
  var MINT = ['menta', 'pepermint'];

  var PAGES = [
    { id: 'watermelon', match: [['lubenica']], slug: { bs: 'lubenica', en: 'watermelon', de: 'wassermelone' },
      h1: { bs: 'Okusi za nargilu sa lubenicom', en: 'Watermelon hookah flavors', de: 'Shisha Tabak Wassermelone' },
      noun: { bs: 'lubenica', en: 'watermelon', de: 'Wassermelone' },
      about: { bs: 'Lubenica je jedan od najprodavanijih okusa za nargilu: sočna, lagano slatka i osvježavajuća, posebno ljeti. Najčešće dolazi sa mentom ili ledom, a odlično se slaže sa dinjom i jagodom.',
        en: 'Watermelon is one of the best-selling hookah flavors: juicy, lightly sweet and refreshing, especially in summer. It often comes with mint or ice and pairs well with melon and strawberry.',
        de: 'Wassermelone gehört zu den meistverkauften Shisha-Sorten: saftig, leicht süß und erfrischend, vor allem im Sommer. Oft kommt sie mit Minze oder Ice und passt gut zu Melone und Erdbeere.' },
      related: ['melon', 'strawberry', 'mint'] },
    { id: 'mint', match: [MINT], slug: { bs: 'menta', en: 'mint', de: 'minze' },
      h1: { bs: 'Okusi za nargilu sa mentom', en: 'Mint hookah flavors', de: 'Shisha Tabak Minze' },
      noun: { bs: 'menta', en: 'mint', de: 'Minze' },
      about: { bs: 'Menta je najčešći sastojak u nargili: sama daje čist, hladan izdah, a uz voće ga osvježava i čini lakšim za duže sesije. Ovdje su okusi gdje je menta glavna i oni gdje je samo završni potez.',
        en: 'Mint is the most common hookah ingredient: on its own it gives a clean, cool exhale, and with fruit it freshens the blend and keeps long sessions light. Here are flavors where mint leads and ones where it is just the finish.',
        de: 'Minze ist die häufigste Zutat in der Shisha: allein sorgt sie für einen klaren, kühlen Zug, mit Früchten macht sie den Geschmack frischer und leichter. Hier sind Sorten, in denen Minze die Hauptrolle spielt, und solche, in denen sie nur den Abschluss bildet.' },
      related: ['lemon-mint', 'grape-mint', 'watermelon'] },
    { id: 'lemon', match: [['limun']], slug: { bs: 'limun', en: 'lemon', de: 'zitrone' },
      h1: { bs: 'Okusi za nargilu sa limunom', en: 'Lemon hookah flavors', de: 'Shisha Tabak Zitrone' },
      noun: { bs: 'limun', en: 'lemon', de: 'Zitrone' },
      about: { bs: 'Limun daje nargili kiselkastu svježinu i "budi" slađe voće. Najpoznatiji je u kombinaciji sa mentom, ali dobro ide i uz limetu, narandžu i bobice.',
        en: 'Lemon gives a hookah a tangy freshness and lifts sweeter fruit. It is best known with mint, but it also works well with lime, orange and berries.',
        de: 'Zitrone bringt säuerliche Frische in die Shisha und belebt süßere Früchte. Am bekanntesten ist sie mit Minze, sie passt aber auch gut zu Limette, Orange und Beeren.' },
      related: ['lemon-mint', 'lime', 'sour'] },
    { id: 'lemon-mint', match: [['limun'], MINT], slug: { bs: 'limun-menta', en: 'lemon-mint', de: 'zitrone-minze' },
      h1: { bs: 'Okusi za nargilu limun i menta', en: 'Lemon mint hookah flavors', de: 'Shisha Tabak Zitrone Minze' },
      noun: { bs: 'limun i menta', en: 'lemon and mint', de: 'Zitrone und Minze' },
      about: { bs: 'Limun i menta su klasik svakog lounge bara: kiselkast limun i hladna menta zajedno daju lagan, osvježavajući dim. Okusi se razlikuju po tome šta je jače, limun ili menta.',
        en: 'Lemon and mint is a lounge classic: tangy lemon and cool mint together make a light, refreshing smoke. The flavors differ mainly in which side is stronger, the lemon or the mint.',
        de: 'Zitrone und Minze ist ein Lounge-Klassiker: säuerliche Zitrone und kühle Minze ergeben zusammen einen leichten, erfrischenden Rauch. Die Sorten unterscheiden sich vor allem darin, was stärker ist, Zitrone oder Minze.' },
      related: ['lemon', 'mint', 'grape-mint'] },
    { id: 'grape', match: [['grozdje']], slug: { bs: 'grozdje', en: 'grape', de: 'traube' },
      h1: { bs: 'Okusi za nargilu sa grožđem', en: 'Grape hookah flavors', de: 'Shisha Tabak Traube' },
      noun: { bs: 'grožđe', en: 'grape', de: 'Traube' },
      about: { bs: 'Grožđe je sladak, pun okus koji podsjeća na sok od grožđa ili bombone. Uz mentu je jedan od najstarijih klasika za nargilu.',
        en: 'Grape is a sweet, full flavor that tastes like grape juice or candy. With mint it is one of the oldest hookah classics.',
        de: 'Traube ist ein süßer, voller Geschmack, der an Traubensaft oder Bonbons erinnert. Mit Minze ist sie einer der ältesten Shisha-Klassiker.' },
      related: ['grape-mint', 'mint', 'cherry'] },
    { id: 'grape-mint', match: [['grozdje'], MINT], slug: { bs: 'grozdje-menta', en: 'grape-mint', de: 'traube-minze' },
      h1: { bs: 'Okusi za nargilu grožđe i menta', en: 'Grape mint hookah flavors', de: 'Shisha Tabak Traube Minze' },
      noun: { bs: 'grožđe i menta', en: 'grape and mint', de: 'Traube und Minze' },
      about: { bs: 'Grožđe sa mentom je jedan od prvih velikih okusa za nargilu: slatko grožđe i hladna menta u ravnoteži. Ovdje su sve verzije, od blagih do jako mentolnih.',
        en: 'Grape mint is one of the first big hookah flavors: sweet grape and cool mint in balance. Here are all the versions, from mild to strongly minty.',
        de: 'Traube Minze ist einer der ersten großen Shisha-Geschmäcker: süße Traube und kühle Minze im Gleichgewicht. Hier sind alle Varianten, von mild bis sehr minzig.' },
      related: ['grape', 'mint', 'lemon-mint'] },
    { id: 'apple', match: [['jabuka', 'zelena-jabuka']], slug: { bs: 'jabuka', en: 'apple', de: 'apfel' },
      h1: { bs: 'Okusi za nargilu sa jabukom', en: 'Apple hookah flavors', de: 'Shisha Tabak Apfel' },
      noun: { bs: 'jabuka', en: 'apple', de: 'Apfel' },
      about: { bs: 'Jabuka je osnova najpoznatijeg okusa za nargilu, dvostruke jabuke (Double Apple) sa anisom. Tu su i svježe zelene i slatke crvene jabuke.',
        en: 'Apple is the base of the most famous hookah flavor of all, double apple with its anise note. You will also find fresh green and sweet red apple here.',
        de: 'Apfel ist die Basis der bekanntesten Shisha-Sorte überhaupt, Doppelapfel mit Anis. Dazu kommen frische grüne und süße rote Äpfel.' },
      related: ['grape', 'mint', 'cinnamon'] },
    { id: 'orange', match: [['narandza']], slug: { bs: 'narandza', en: 'orange', de: 'orange' },
      h1: { bs: 'Okusi za nargilu sa narandžom', en: 'Orange hookah flavors', de: 'Shisha Tabak Orange' },
      noun: { bs: 'narandža', en: 'orange', de: 'Orange' },
      about: { bs: 'Narandža je sočna i slatka, sa blagom gorčinom kore. Dobro ide uz mentu, čokoladu i drugo citrusno voće.',
        en: 'Orange is juicy and sweet, with a slight bitterness from the peel. It goes well with mint, chocolate and other citrus.',
        de: 'Orange ist saftig und süß, mit einer leichten Bitterkeit der Schale. Sie passt gut zu Minze, Schokolade und anderen Zitrusfrüchten.' },
      related: ['lemon', 'grapefruit', 'mango'] },
    { id: 'raspberry', match: [['malina']], slug: { bs: 'malina', en: 'raspberry', de: 'himbeere' },
      h1: { bs: 'Okusi za nargilu sa malinom', en: 'Raspberry hookah flavors', de: 'Shisha Tabak Himbeere' },
      noun: { bs: 'malina', en: 'raspberry', de: 'Himbeere' },
      about: { bs: 'Malina je slatka i kiselkasta u isto vrijeme. Najčešće je u miksevima bobica, uz mentu ili u bombon okusima.',
        en: 'Raspberry is sweet and tart at the same time. You will usually find it in berry blends, with mint or in candy flavors.',
        de: 'Himbeere ist süß und säuerlich zugleich. Meist steckt sie in Beerenmischungen, mit Minze oder in Bonbon-Sorten.' },
      related: ['blueberry', 'strawberry', 'cherry'] },
    { id: 'blueberry', match: [['borovnica']], slug: { bs: 'borovnica', en: 'blueberry', de: 'blaubeere' },
      h1: { bs: 'Okusi za nargilu sa borovnicom', en: 'Blueberry hookah flavors', de: 'Shisha Tabak Blaubeere' },
      noun: { bs: 'borovnica', en: 'blueberry', de: 'Blaubeere' },
      about: { bs: 'Borovnica je mekana, slatka bobica koja je jedan od omiljenih okusa za početnike. Dobro ide sa mentom, vanilom i drugim bobicama.',
        en: 'Blueberry is a soft, sweet berry and one of the favorite flavors for beginners. It works well with mint, vanilla and other berries.',
        de: 'Blaubeere ist eine weiche, süße Beere und eine der Lieblingssorten für Einsteiger. Sie passt gut zu Minze, Vanille und anderen Beeren.' },
      related: ['raspberry', 'strawberry', 'vanilla'] },
    { id: 'strawberry', match: [['jagoda']], slug: { bs: 'jagoda', en: 'strawberry', de: 'erdbeere' },
      h1: { bs: 'Okusi za nargilu sa jagodom', en: 'Strawberry hookah flavors', de: 'Shisha Tabak Erdbeere' },
      noun: { bs: 'jagoda', en: 'strawberry', de: 'Erdbeere' },
      about: { bs: 'Jagoda je slatka i mirisna, od svježeg voća do jagode sa šlagom. Uz lubenicu, kivi ili mentu daje lagan ljetni dim.',
        en: 'Strawberry is sweet and fragrant, from fresh fruit to strawberries and cream. With watermelon, kiwi or mint it makes a light summer smoke.',
        de: 'Erdbeere ist süß und aromatisch, von frischer Frucht bis Erdbeere mit Sahne. Mit Wassermelone, Kiwi oder Minze ergibt sie einen leichten Sommerrauch.' },
      related: ['watermelon', 'raspberry', 'peach'] },
    { id: 'peach', match: [['breskva']], slug: { bs: 'breskva', en: 'peach', de: 'pfirsich' },
      h1: { bs: 'Okusi za nargilu sa breskvom', en: 'Peach hookah flavors', de: 'Shisha Tabak Pfirsich' },
      noun: { bs: 'breskva', en: 'peach', de: 'Pfirsich' },
      about: { bs: 'Breskva je mekana, sočna i slatka, sa nježnim mirisom. Često je u ledenim čaj okusima i miksevima sa mangom.',
        en: 'Peach is soft, juicy and sweet with a gentle aroma. It often shows up in iced tea flavors and in mixes with mango.',
        de: 'Pfirsich ist weich, saftig und süß mit einem zarten Duft. Oft steckt er in Eistee-Sorten und in Mischungen mit Mango.' },
      related: ['mango', 'strawberry', 'orange'] },
    { id: 'mango', match: [['mango']], slug: { bs: 'mango', en: 'mango', de: 'mango' },
      h1: { bs: 'Okusi za nargilu sa mangom', en: 'Mango hookah flavors', de: 'Shisha Tabak Mango' },
      noun: { bs: 'mango', en: 'mango', de: 'Mango' },
      about: { bs: 'Mango je zreo, tropski i jako sladak. Sam je pun i gust, a uz marakuju, ananas ili mentu postaje svježiji.',
        en: 'Mango is ripe, tropical and very sweet. On its own it is rich and dense, and with passion fruit, pineapple or mint it turns fresher.',
        de: 'Mango ist reif, tropisch und sehr süß. Allein ist sie voll und dicht, mit Maracuja, Ananas oder Minze wird sie frischer.' },
      related: ['pineapple', 'passion-fruit', 'peach'] },
    { id: 'pineapple', match: [['ananas']], slug: { bs: 'ananas', en: 'pineapple', de: 'ananas' },
      h1: { bs: 'Okusi za nargilu sa ananasom', en: 'Pineapple hookah flavors', de: 'Shisha Tabak Ananas' },
      noun: { bs: 'ananas', en: 'pineapple', de: 'Ananas' },
      about: { bs: 'Ananas je sočan, kiselkast i tropski. Daje živost slađim okusima kao što su banana, kokos i mango.',
        en: 'Pineapple is juicy, tangy and tropical. It brings life to sweeter flavors like banana, coconut and mango.',
        de: 'Ananas ist saftig, säuerlich und tropisch. Sie belebt süßere Sorten wie Banane, Kokos und Mango.' },
      related: ['mango', 'banana', 'passion-fruit'] },
    { id: 'lime', match: [['limeta']], slug: { bs: 'limeta', en: 'lime', de: 'limette' },
      h1: { bs: 'Okusi za nargilu sa limetom', en: 'Lime hookah flavors', de: 'Shisha Tabak Limette' },
      noun: { bs: 'limeta', en: 'lime', de: 'Limette' },
      about: { bs: 'Limeta je kiselija i "zelenija" od limuna. Česta je u koktel okusima kao što je mojito, uz mentu i led.',
        en: 'Lime is sharper and greener than lemon. It is common in cocktail flavors like mojito, with mint and ice.',
        de: 'Limette ist saurer und grüner als Zitrone. Sie ist häufig in Cocktail-Sorten wie Mojito, mit Minze und Ice.' },
      related: ['lemon', 'sour', 'mint'] },
    { id: 'melon', match: [['dinja']], slug: { bs: 'dinja', en: 'melon', de: 'melone' },
      h1: { bs: 'Okusi za nargilu sa dinjom', en: 'Melon hookah flavors', de: 'Shisha Tabak Melone' },
      noun: { bs: 'dinja', en: 'melon', de: 'Melone' },
      about: { bs: 'Dinja je mekana, medena i ljetna. Tu su i žuta i zelena dinja (honeydew), sama ili uz lubenicu i mentu.',
        en: 'Melon is soft, honeyed and summery. You will find both cantaloupe and honeydew here, on their own or with watermelon and mint.',
        de: 'Melone ist weich, honigsüß und sommerlich. Hier gibt es Honig- und Zuckermelone, pur oder mit Wassermelone und Minze.' },
      related: ['watermelon', 'mint', 'mango'] },
    { id: 'cherry', match: [['visnja']], slug: { bs: 'visnja', en: 'cherry', de: 'kirsche' },
      h1: { bs: 'Okusi za nargilu sa višnjom', en: 'Cherry hookah flavors', de: 'Shisha Tabak Kirsche' },
      noun: { bs: 'višnja', en: 'cherry', de: 'Kirsche' },
      about: { bs: 'Višnja je slatko-kisela i tamna, od svježeg voća do višnje u koli ili čokoladi. Dobro ide uz mentu i vanilu.',
        en: 'Cherry is sweet and sour with a dark edge, from fresh fruit to cherry cola or chocolate. It pairs well with mint and vanilla.',
        de: 'Kirsche ist süß-sauer und dunkel, von frischer Frucht bis Kirsch-Cola oder Schokolade. Sie passt gut zu Minze und Vanille.' },
      related: ['raspberry', 'vanilla', 'grape'] },
    { id: 'passion-fruit', match: [['marakuja']], slug: { bs: 'marakuja', en: 'passion-fruit', de: 'maracuja' },
      h1: { bs: 'Okusi za nargilu sa marakujom', en: 'Passion fruit hookah flavors', de: 'Shisha Tabak Maracuja' },
      noun: { bs: 'marakuja', en: 'passion fruit', de: 'Maracuja' },
      about: { bs: 'Marakuja je intenzivna, kiselkasta i jako mirisna. Najčešće je u tropskim miksevima sa mangom i ananasom.',
        en: 'Passion fruit is intense, tangy and very fragrant. You will mostly find it in tropical blends with mango and pineapple.',
        de: 'Maracuja ist intensiv, säuerlich und sehr aromatisch. Meist steckt sie in tropischen Mischungen mit Mango und Ananas.' },
      related: ['mango', 'pineapple', 'sour'] },
    { id: 'grapefruit', match: [['grejpfrut']], slug: { bs: 'grejpfrut', en: 'grapefruit', de: 'grapefruit' },
      h1: { bs: 'Okusi za nargilu sa grejpfrutom', en: 'Grapefruit hookah flavors', de: 'Shisha Tabak Grapefruit' },
      noun: { bs: 'grejpfrut', en: 'grapefruit', de: 'Grapefruit' },
      about: { bs: 'Grejpfrut je citrus sa izraženom gorčinom i kiselinom. Za one koji ne vole previše slatke okuse, često uz mentu.',
        en: 'Grapefruit is a citrus with a clear bitter, sour edge. A good pick if you do not like overly sweet flavors, often with mint.',
        de: 'Grapefruit ist eine Zitrusfrucht mit deutlicher Bitterkeit und Säure. Gut für alle, die es nicht zu süß mögen, oft mit Minze.' },
      related: ['orange', 'lemon', 'sour'] },
    { id: 'vanilla', match: [['vanila']], slug: { bs: 'vanila', en: 'vanilla', de: 'vanille' },
      h1: { bs: 'Okusi za nargilu sa vanilom', en: 'Vanilla hookah flavors', de: 'Shisha Tabak Vanille' },
      noun: { bs: 'vanila', en: 'vanilla', de: 'Vanille' },
      about: { bs: 'Vanila daje nargili kremast, mekan i topao okus. Najčešća je u desertnim okusima i kao blaga podloga voću.',
        en: 'Vanilla gives a hookah a creamy, soft and warm taste. It is most common in dessert flavors and as a gentle base for fruit.',
        de: 'Vanille macht die Shisha cremig, weich und warm. Am häufigsten ist sie in Dessert-Sorten und als sanfte Basis für Früchte.' },
      related: ['cinnamon', 'blueberry', 'cherry'] },
    { id: 'cinnamon', match: [['cimet']], slug: { bs: 'cimet', en: 'cinnamon', de: 'zimt' },
      h1: { bs: 'Okusi za nargilu sa cimetom', en: 'Cinnamon hookah flavors', de: 'Shisha Tabak Zimt' },
      noun: { bs: 'cimet', en: 'cinnamon', de: 'Zimt' },
      about: { bs: 'Cimet je topao i začinski, odličan za zimske večeri. Dolazi u kolačima, čaju i uz jabuku.',
        en: 'Cinnamon is warm and spicy, great for winter evenings. It shows up in pastries, chai and with apple.',
        de: 'Zimt ist warm und würzig, ideal für Winterabende. Er steckt in Gebäck, Chai und zusammen mit Apfel.' },
      related: ['vanilla', 'apple', 'orange'] },
    { id: 'banana', match: [['banana']], slug: { bs: 'banana', en: 'banana', de: 'banane' },
      h1: { bs: 'Okusi za nargilu sa bananom', en: 'Banana hookah flavors', de: 'Shisha Tabak Banane' },
      noun: { bs: 'banana', en: 'banana', de: 'Banane' },
      about: { bs: 'Banana je kremasta i slatka, kao zrelo voće ili banana šejk. Uz ananas i kokos daje tropski miks.',
        en: 'Banana is creamy and sweet, like ripe fruit or a banana shake. With pineapple and coconut it makes a tropical mix.',
        de: 'Banane ist cremig und süß, wie reife Frucht oder ein Bananen-Shake. Mit Ananas und Kokos wird daraus ein tropischer Mix.' },
      related: ['pineapple', 'vanilla', 'mango'] },
    { id: 'sour', match: 'kiseli', slug: { bs: 'kiseli', en: 'sour', de: 'sauer' },
      h1: { bs: 'Kiseli okusi za nargilu', en: 'Sour hookah flavors', de: 'Saure Shisha Tabak Sorten' },
      noun: { bs: 'kiselost', en: 'sour', de: 'Säure' },
      about: { bs: 'Kiseli okusi štipaju jezik kao kisele bombone ili citrusi. Dobri su kad ti dosade slatki okusi i kao "oštrina" u miksu.',
        en: 'Sour flavors tingle like sour candy or citrus. They are great when sweet flavors get boring, and they add an edge to a mix.',
        de: 'Saure Sorten prickeln wie saure Bonbons oder Zitrusfrüchte. Gut, wenn süße Sorten langweilig werden, und für etwas Schärfe im Mix.' },
      related: ['lemon', 'lime', 'grapefruit'] }
  ];

  /* ------------------------------------------------------------------ */
  /* Podaci                                                              */
  /* ------------------------------------------------------------------ */

  function inGroup(f, group) {
    return (f.ingredients || []).some(function (i) { return group.indexOf(i.illustration) !== -1; });
  }
  function matches(p, f) {
    if (typeof p.match === 'string') return (f.tags || []).indexOf(p.match) !== -1;
    return p.match.every(function (g) { return inGroup(f, g); });
  }
  /** Koliko se sastojak osjeti u okusu (kod kombinacija slabiji od dva; kod taga kiselost/svježina). */
  function strength(p, f) {
    if (typeof p.match === 'string') return (f.profile.freshness || 0) + (f.profile.fruitiness || 0) / 10;
    return Math.min.apply(null, p.match.map(function (g) {
      var best = 0;
      (f.ingredients || []).forEach(function (i) { if (g.indexOf(i.illustration) !== -1 && i.intensity > best) best = i.intensity; });
      return best;
    }));
  }

  var cache = null;
  function build() {
    if (cache && cache.n === V.flavors().length) return cache.list;
    var list = PAGES.map(function (p) {
      var fl = V.flavors().filter(function (f) { return matches(p, f); });
      fl.sort(function (a, b) { return strength(p, b) - strength(p, a) || (a.brand + ' ' + a.name).localeCompare(b.brand + ' ' + b.name); });
      return Object.assign({}, p, { flavors: fl });
    }).filter(function (p) { return p.flavors.length >= MIN_FLAVORS; });
    cache = { n: V.flavors().length, list: list };
    return list;
  }

  V.ingredientPages = function () { return build(); };
  V.ingredientPage = function (id) { return build().filter(function (p) { return p.id === id; })[0] || null; };
  V.ingredientUrl = function (p, lang) { return V.urlFor(lang || MSP.lang, 'flavors', p.slug[lang || MSP.lang] || p.slug.en); };

  /** Stranice po sastojku za jedan okus (za linkove "Još okusa sa..." na stranici okusa). */
  V.ingredientPagesFor = function (f) {
    return build().filter(function (p) { return typeof p.match !== 'string' && p.flavors.indexOf(f) !== -1; })
      // prvo kombinacije (limun i menta), pa pojedinačni sastojci po jačini u okusu
      .sort(function (a, b) { return b.match.length - a.match.length || strength(b, f) - strength(a, f); });
  };

  /* ------------------------------------------------------------------ */
  /* Tekstovi                                                            */
  /* ------------------------------------------------------------------ */

  var TX = {
    eyebrow: { bs: 'Okusi po sastojku', en: 'Flavors by ingredient', de: 'Sorten nach Zutat' },
    stat: { bs: 'Na MyShishapediji: {N} sa ovim sastojkom, od {B}.', en: 'MyShishapedia lists {n} flavors with it, from {b} brands.', de: 'Auf MyShishapedia gibt es {n} Sorten damit, von {b} Marken.' },
    titleSuffix: { bs: '{N}', en: '{n} shisha flavors', de: '{n} Sorten im Vergleich' },
    desc: { bs: '{h1}: {N} od {B} na jednom mjestu, sa sastojcima, jačinom okusa i najboljim izborom.',
      en: 'All {n} {h1lc} from {b} brands in one list, with ingredients, how strong each one is and the top picks.',
      de: '{h1}: alle {n} Sorten von {b} Marken in einer Liste, mit Zutaten, Intensität und den besten Sorten.' },
    topTitle: { bs: 'Najizraženiji okusi', en: 'Strongest picks', de: 'Am intensivsten' },
    topText: { bs: 'Ovdje se {noun} najviše osjeti.', en: 'Where the {noun} comes through the most.', de: 'Hier schmeckt man {noun} am stärksten.' },
    topTextTag: { bs: 'Najsvježiji i najkiseliji okusi iz ove grupe.', en: 'The freshest, sharpest flavors in this group.', de: 'Die frischesten und saftigsten Sorten dieser Gruppe.' },
    allTitle: { bs: 'Svi okusi ({n})', en: 'All flavors ({n})', de: 'Alle Sorten ({n})' },
    allText: { bs: 'Poredano od najjačeg prema najblažem.', en: 'Sorted from strongest to mildest.', de: 'Sortiert von stark bis mild.' },
    brandsTitle: { bs: 'Po brendovima', en: 'By brand', de: 'Nach Marke' },
    relatedTitle: { bs: 'Slični sastojci', en: 'Related ingredients', de: 'Ähnliche Zutaten' },
    allPages: { bs: 'Svi sastojci', en: 'All ingredients', de: 'Alle Zutaten' },
    qBest: { bs: 'Koji je najbolji okus iz ove grupe?', en: 'What is the best {noun} hookah flavor?', de: 'Welcher Shisha Tabak mit {noun} ist der beste?' },
    aBest: { bs: 'Najizraženiji su {list}. Koji je najbolji zavisi od toga koliko voliš slatko i hladno; svaki okus ispod ima profil okusa i sastojke.',
      en: 'The strongest ones are {list}. Which one is best depends on how sweet and cool you like it; every flavor below has its profile and ingredients.',
      de: 'Am intensivsten sind {list}. Welcher am besten ist, hängt davon ab, wie süß und kühl du es magst; jede Sorte unten hat ihr Profil und ihre Zutaten.' },
    qBrands: { bs: 'Koji brendovi imaju ove okuse?', en: 'Which brands make {noun} hookah flavors?', de: 'Welche Marken haben Shisha Tabak mit {noun}?' },
    aBrands: { bs: 'Na MyShishapediji su to {list}.', en: 'On MyShishapedia: {list}.', de: 'Auf MyShishapedia: {list}.' },
    qCool: { bs: 'Koji su najhladniji?', en: 'Which {noun} flavors are the most icy?', de: 'Welche Sorten mit {noun} sind am kühlsten?' },
    aCool: { bs: 'Najviše hlade {list}.', en: 'The coolest ones are {list}.', de: 'Am meisten kühlen {list}.' },
    qNoMint: { bs: 'Ima li ovih okusa bez mente?', en: 'Are there {noun} flavors without mint?', de: 'Gibt es Sorten mit {noun} ohne Minze?' },
    aNoMint: { bs: 'Da, bez mente i leda: {N}, na primjer {list}.', en: 'Yes, {n} have no mint or ice, for example {list}.', de: 'Ja, {n} Sorten haben weder Minze noch Ice, zum Beispiel {list}.' },
    indexTitle: { bs: 'Okusi po sastojku', en: 'Hookah flavors by ingredient', de: 'Shisha Tabak nach Zutat' },
    indexText: { bs: 'Lubenica, limun i menta, grožđe, jabuka i drugo: svi okusi sa jednim sastojkom na jednoj stranici.',
      en: 'Watermelon, lemon mint, grape, apple and more: every flavor with one ingredient on a single page.',
      de: 'Wassermelone, Zitrone Minze, Traube, Apfel und mehr: alle Sorten mit einer Zutat auf einer Seite.' },
    azTitle: { bs: 'Lista okusa za nargilu od A do Ž', en: 'Hookah flavors list A to Z', de: 'Shisha-Geschmäcker von A bis Z' },
    azText: { bs: 'Svih {n} okusa po abecedi, sa brendom.', en: 'All {n} flavors in alphabetical order, with the brand.', de: 'Alle {n} Sorten alphabetisch, mit Marke.' },
    moreWith: { bs: 'Još okusa sa:', en: 'More flavors with:', de: 'Mehr Sorten mit:' }
  };
  function tx(key, vars) {
    var s = L(TX[key]);
    // bosanski: "3 okusa", "21 okus", "od 3 brenda", "od 9 brendova"
    if (vars && vars.n != null) vars.N = MSP.plural('home.count', vars.n);
    if (vars && vars.b != null) vars.B = MSP.plural('brands.count', vars.b);
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  }
  V.ingredientText = tx;

  function brandsOf(fl) {
    var seen = {};
    var out = [];
    fl.forEach(function (f) {
      if (!seen[f.brand]) { seen[f.brand] = { name: f.brand, n: 0, b: V.brandOf(f) }; out.push(seen[f.brand]); }
      seen[f.brand].n++;
    });
    return out.sort(function (a, b) { return b.n - a.n || a.name.localeCompare(b.name); });
  }
  function names(fl) { return fl.map(function (f) { return f.brand + ' ' + f.name; }); }

  /* ------------------------------------------------------------------ */
  /* Stranica                                                            */
  /* ------------------------------------------------------------------ */

  V.ingredientMeta = function (p) {
    var n = p.flavors.length;
    var b = brandsOf(p.flavors).length;
    return {
      title: L(p.h1) + ': ' + tx('titleSuffix', { n: n }) + ' | MyShishapedia',
      description: V.clipText(tx('desc', { n: n, b: b, h1: L(p.h1), h1lc: L(p.h1).toLowerCase() }), 155)
    };
  };

  V.ingredientFaq = function (p) {
    var fl = p.flavors;
    var noun = L(p.noun);
    var items = [];
    var one = function (s) { var o = {}; o[MSP.lang] = s; o.bs = o.bs || s; o.en = o.en || s; return o; };
    items.push({ q: one(tx('qBest', { h1: L(p.h1), noun: noun })), a: one(tx('aBest', { list: V.andList(names(fl.slice(0, 3))) })), links: fl.slice(0, 3).map(function (f) { return f.id; }) });
    var br = brandsOf(fl);
    items.push({ q: one(tx('qBrands', { noun: noun })), a: one(tx('aBrands', { list: V.andList(br.map(function (x) { return x.name + ' (' + x.n + ')'; })) })) });
    var cool = fl.filter(function (f) { return (f.profile.cooling || 0) >= 6; }).sort(function (a, c) { return c.profile.cooling - a.profile.cooling; }).slice(0, 3);
    if (cool.length >= 2) items.push({ q: one(tx('qCool', { noun: noun })), a: one(tx('aCool', { list: V.andList(names(cool)) })), links: cool.map(function (f) { return f.id; }) });
    var hasMint = typeof p.match !== 'string' && p.match.some(function (g) { return g === MINT; });
    if (!hasMint) {
      var plain = fl.filter(function (f) { return !inGroup(f, MINT.concat(['kristal'])); });
      if (plain.length >= 2 && plain.length < fl.length) items.push({ q: one(tx('qNoMint', { noun: noun })), a: one(tx('aNoMint', { n: plain.length, list: V.andList(names(plain.slice(0, 3))) })), links: plain.slice(0, 3).map(function (f) { return f.id; }) });
    }
    return items;
  };

  function chipLinks(list) {
    return list.map(function (p) {
      return '<a class="chip" href="' + V.ingredientUrl(p) + '">' + esc(L(p.h1)) + ' <span class="ingp__n">' + p.flavors.length + '</span></a>';
    }).join('');
  }

  V.pageIngredient = function (p, crumbs) {
    var fl = p.flavors;
    var n = fl.length;
    var br = brandsOf(fl);
    var noun = L(p.noun);
    var top = fl.slice(0, 3);
    var related = (p.related || []).map(V.ingredientPage).filter(Boolean);
    var others = build().filter(function (x) { return x !== p && related.indexOf(x) === -1; });
    return (
      V.pageHero({ id: 'ingp-title', eyebrow: tx('eyebrow'), title: L(p.h1), lead: L(p.about) + ' ' + tx('stat', { n: n, b: br.length }), crumbs: crumbs }) +
      '<section class="fsec fsec--flush" aria-labelledby="ingp-top"><div class="container">' +
        '<h2 class="ingp__h2" id="ingp-top">' + esc(tx('topTitle')) + '</h2>' +
        '<p class="ingp__p">' + esc(typeof p.match === 'string' ? tx('topTextTag') : tx('topText', { noun: noun })) + '</p>' +
        '<ul class="grid" role="list">' + top.map(function (f, i) { return '<li class="grid__item" style="--i:' + i + '">' + V.card(f, 'h3') + '</li>'; }).join('') + '</ul>' +
      '</div></section>' +
      (n > 3
        ? '<section class="fsec" aria-labelledby="ingp-all"><div class="container">' +
            '<h2 class="ingp__h2" id="ingp-all">' + esc(tx('allTitle', { n: n })) + '</h2>' +
            '<p class="ingp__p">' + esc(tx('allText')) + '</p>' +
            '<ul class="grid" role="list">' + fl.slice(3).map(function (f, i) { return '<li class="grid__item" style="--i:' + (i % 3) + '">' + V.card(f, 'h3') + '</li>'; }).join('') + '</ul>' +
          '</div></section>'
        : '') +
      '<section class="fsec fsec--alt" aria-labelledby="ingp-brands"><div class="container ingp__cols">' +
        '<div><h2 class="ingp__h2" id="ingp-brands">' + esc(tx('brandsTitle')) + '</h2>' +
          '<ul class="ingp__brands" role="list">' + br.map(function (x) {
            return '<li>' + (x.b ? '<a href="' + V.brandUrl(x.b) + '">' + esc(x.name) + '</a>' : esc(x.name)) + ' <span class="ingp__n">' + x.n + '</span></li>';
          }).join('') + '</ul></div>' +
        '<div><h2 class="ingp__h2">' + esc(tx('relatedTitle')) + '</h2>' +
          '<p class="ingp__chips">' + chipLinks(related) + '</p>' +
          '<h3 class="ingp__h3">' + esc(tx('allPages')) + '</h3>' +
          '<p class="ingp__chips ingp__chips--small">' + chipLinks(others) + '</p></div>' +
      '</div></section>' +
      V.faqSection(V.ingredientFaq(p), 'ingp-faq')
    );
  };

  /* ------------------------------------------------------------------ */
  /* Na stranici svih okusa: sastojci i lista od A do Ž                  */
  /* ------------------------------------------------------------------ */

  V.ingredientIndexSection = function () {
    var list = build();
    if (!list.length) return '';
    return '<section class="fsec" aria-labelledby="ingidx-h"><div class="container">' +
      '<header class="faq__head"><p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(tx('eyebrow')) + '</p>' +
        '<h2 class="faq__title" id="ingidx-h">' + esc(tx('indexTitle')) + '</h2></header>' +
      '<p class="ingp__p">' + esc(tx('indexText')) + '</p>' +
      '<p class="ingp__chips">' + chipLinks(list) + '</p>' +
    '</div></section>';
  };

  V.flavorsAZSection = function () {
    var fl = V.flavors().slice().sort(function (a, b) { return a.name.localeCompare(b.name, MSP.lang) || a.brand.localeCompare(b.brand); });
    var groups = [];
    var cur = null;
    fl.forEach(function (f) {
      var ch = f.name.charAt(0).toUpperCase();
      if (/[0-9]/.test(ch)) ch = '0-9';
      if (!cur || cur.ch !== ch) { cur = { ch: ch, list: [] }; groups.push(cur); }
      cur.list.push(f);
    });
    return '<section class="fsec fsec--alt" aria-labelledby="flaz-h"><div class="container">' +
      '<header class="faq__head"><h2 class="faq__title" id="flaz-h">' + esc(tx('azTitle')) + '</h2></header>' +
      '<p class="ingp__p">' + esc(tx('azText', { n: fl.length })) + '</p>' +
      '<div class="flaz">' + groups.map(function (g) {
        return '<div class="flaz__g"><h3 class="flaz__ch">' + esc(g.ch) + '</h3><ul class="flaz__list" role="list">' + g.list.map(function (f) {
          return '<li><a href="' + V.flavorUrl(f) + '">' + esc(f.name) + '</a> <span>' + esc(f.brand) + '</span></li>';
        }).join('') + '</ul></div>';
      }).join('') + '</div>' +
    '</div></section>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
