/*
 * MyShishapedia - Mapa okusa (HTML koji pravi build.mjs; isti fajl koristi i js/fmap.js u browseru).
 *
 *   /bs/mapa-okusa/   svih 313 okusa kao užareni ugljevi na jednoj karti: lijevo slatko, desno svježe,
 *                     dolje toplo i kremasto, gore ledeno. Crta je i pokreće js/fmap.js (canvas).
 *
 * Ovdje su: adrese, tekstovi na 4 jezika, krajevi mape (pravila iz podataka okusa), HTML stranice
 * (sa sadržajem i bez JavaScripta: objašnjenje osa, krajevi sa linkovima, pitanja i odgovori),
 * pločica za početnu i link "Vidi na mapi okusa" za stranicu okusa.
 *
 * Ovisi o: views.js (V), data/flavors.js.
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  var esc = V.esc;

  /* ------------------------------------------------------------------ */
  /* Adrese                                                              */
  /* ------------------------------------------------------------------ */

  var SEGS = { bs: 'mapa-okusa', en: 'flavor-map', de: 'geschmackskarte', ru: 'karta-vkusov' };
  Object.keys(SEGS).forEach(function (l) { if (V.SEG[l]) V.SEG[l].fmap = SEGS[l]; });

  V.fmapUrl = function (f, lang) {
    return V.urlFor(lang || MSP.lang, 'fmap') + (f ? '?f=' + encodeURIComponent(f.id) : '');
  };

  /* ------------------------------------------------------------------ */
  /* Tekstovi                                                            */
  /* ------------------------------------------------------------------ */

  var TX = {
    bs: {
      eyebrow: 'Mapa okusa', h1: 'Svijet okusa', count: '{n} okusa na jednoj karti',
      lead: 'Svaki užareni ugalj je jedan okus. Lijevo je slatko, desno svježe, gore ledeno. Dodirni okus i vidi njegove najbliže rođake.',
      axSweet: 'Slatko', axFresh: 'Svježe', axIce: 'Ledeno', axWarm: 'Toplo i kremasto',
      hint: 'Dodirni ugalj', search: 'Traži okus ili brend…', noResults: 'Nema takvog okusa',
      filters: 'Filteri', brands: 'Brendovi', tags: 'Vrsta okusa', reset: 'Prikaži sve', shown: '{n} od {t} okusa',
      shelf: 'Moja polica', surprise: 'Iznenadi me', skip: 'Preskoči',
      zoomIn: 'Približi', zoomOut: 'Udalji', fit: 'Cijela mapa', save: 'Spremi sliku', saved: 'Slika je spremljena.',
      openFlavor: 'Otvori okus', neighbors: 'Najsličniji okusi', close: 'Zatvori',
      mixWith: 'Miksaj sa…', pickSecond: 'Izaberi drugi okus na mapi ili u pretrazi', cancel: 'Odustani',
      mixTitle: 'Miks na mapi', mixLike: 'Ovaj miks podsjeća na', openMixer: 'Otvori u mikseru', ratio: 'Omjer',
      shelfEmpty: 'Polica je prazna. Sačuvaj okuse koje imaš (dugme na stranici okusa) i ovdje se pojavi tvoje sazviježđe.',
      shelfTitle: 'Tvoje sazviježđe', shelfIn: 'Tvoj ukus je najviše u kraju: {r}', shelfN: '{n} okusa sa police',
      browse: 'Pregledaj okuse', strength: 'Jačina', dark: 'Tamni list', light: 'Svijetli list',
      keys: 'Strelice: susjedni okus · Enter: otvori · Esc: zatvori', canvas: 'Interaktivna mapa okusa. Strelicama biraš okus, Enter otvara stranicu okusa.',
      selected: 'Izabran okus: {name}. Najsličniji: {list}.',
      noJs: 'Mapa okusa treba JavaScript. Ispod su krajevi mape sa svim okusima.',
      regions: { ice: 'Led i menta', candy: 'Ledeni bomboni', citrus: 'Svježi citrusi', fruit: 'Klasični voćni', dessert: 'Slatki deserti', spice: 'Začini i čaj', drink: 'Pića i kokteli' },
      rdesc: {
        ice: 'Najhladniji okusi: menta, led i pepermint.', candy: 'Slatki bomboni sa jakim ledom.', citrus: 'Limun, limeta, grejp i kiselkasti okusi.',
        fruit: 'Jabuka, grožđe, jagoda i ostalo voće, bez mnogo leda.', dessert: 'Kremasti, medeni i desertni okusi.',
        spice: 'Začini, čaj i biljni okusi.', drink: 'Okusi pića, sokova i koktela.'
      },
      axesTitle: 'Kako čitati mapu',
      axes: [
        'Vodoravno: što je okus slađi, to je više lijevo. Što je svježiji (kiselkast, citrusni, mentolni), to je više desno.',
        'Okomito: gore su okusi sa najviše hlađenja (menta i led). Među okusima bez leda, voćni su malo više, a kremasti, desertni i začinski okusi su dolje.',
        'Veličina uglja pokazuje jačinu okusa, a tanak narandžasti prsten znači tamni list.',
        'Najsličniji okusi se računaju po svih pet osobina profila (slatkoća, svježina, voćnost, hlađenje i jačina), pa ponekad nisu baš najbliži na slici.'
      ],
      note: 'Profili okusa su naše uredničke procjene iz opisa proizvođača, prodavaca i iskustva, a ne laboratorijska mjerenja.',
      regionsTitle: 'Krajevi mape', more: 'i još {n}',
      faq: [
        { q: 'Šta prikazuje mapa okusa?', a: 'Svih {n} okusa iz enciklopedije na jednoj karti. Lijevo su slatki, desno svježi okusi, gore su ledeni, a dolje topli i kremasti. Slični okusi su blizu jedan drugog.' },
        { q: 'Kako da nađem okus sličan onom koji volim?', a: 'Dodirni okus na mapi ili ga upiši u pretragu. Od njega krenu dimne niti do pet najsličnijih okusa, a klikom na nit putuješ do sljedećeg okusa.' },
        { q: 'Kako radi miks na mapi?', a: 'Izaberi okus, pa "Miksaj sa…" i drugi okus. Klizačem mijenjaš omjer, tačka miksa se pomjera između njih, a mapa pokaže koji okusi su najbliži tom miksu.' },
        { q: 'Odakle su podaci?', a: 'Iz profila okusa na sajtu. To su naše uredničke procjene (slatkoća, svježina, voćnost, hlađenje i jačina od 0 do 10), a ne laboratorijska mjerenja.' }
      ],
      metaTitle: 'Mapa okusa za nargilu: {n} okusa na interaktivnoj karti | MyShishapedia',
      metaDesc: 'Interaktivna mapa {n} okusa za nargilu: slatko ili svježe, toplo ili ledeno. Nađi okuse slične svom omiljenom i složi miks na karti.',
      promoEyebrow: 'Mapa okusa', promoTitle: 'Svijet okusa', promoText: 'Svih {n} okusa kao užareni ugljevi na jednoj karti. Dodirni svoj omiljeni i vidi mu rođake.', promoCta: 'Otvori mapu',
      flavorLink: 'Vidi na mapi okusa'
    },
    en: {
      eyebrow: 'Flavor map', h1: 'The world of flavors', count: '{n} flavors on one map',
      lead: 'Every glowing coal is one flavor. Sweet is on the left, fresh on the right, icy at the top. Tap a flavor to see its closest relatives.',
      axSweet: 'Sweet', axFresh: 'Fresh', axIce: 'Icy', axWarm: 'Warm and creamy',
      hint: 'Tap a coal', search: 'Search a flavor or brand…', noResults: 'No such flavor',
      filters: 'Filters', brands: 'Brands', tags: 'Flavor type', reset: 'Show all', shown: '{n} of {t} flavors',
      shelf: 'My shelf', surprise: 'Surprise me', skip: 'Skip',
      zoomIn: 'Zoom in', zoomOut: 'Zoom out', fit: 'Whole map', save: 'Save image', saved: 'Image saved.',
      openFlavor: 'Open flavor', neighbors: 'Most similar flavors', close: 'Close',
      mixWith: 'Mix with…', pickSecond: 'Pick a second flavor on the map or in search', cancel: 'Cancel',
      mixTitle: 'Mix on the map', mixLike: 'This mix is close to', openMixer: 'Open in the mixer', ratio: 'Ratio',
      shelfEmpty: 'Your shelf is empty. Save the flavors you have (button on the flavor page) and your constellation appears here.',
      shelfTitle: 'Your constellation', shelfIn: 'Your taste lives mostly in: {r}', shelfN: '{n} flavors from your shelf',
      browse: 'Browse flavors', strength: 'Strength', dark: 'Dark leaf', light: 'Blonde leaf',
      keys: 'Arrows: nearby flavor · Enter: open · Esc: close', canvas: 'Interactive flavor map. Use the arrow keys to pick a flavor, Enter opens its page.',
      selected: 'Selected flavor: {name}. Most similar: {list}.',
      noJs: 'The flavor map needs JavaScript. Below are the regions of the map with all flavors.',
      regions: { ice: 'Ice and mint', candy: 'Icy candy', citrus: 'Fresh citrus', fruit: 'Classic fruit', dessert: 'Sweet desserts', spice: 'Spice and tea', drink: 'Drinks and cocktails' },
      rdesc: {
        ice: 'The coldest flavors: mint, ice and peppermint.', candy: 'Sweet candy with strong ice.', citrus: 'Lemon, lime, grapefruit and sour flavors.',
        fruit: 'Apple, grape, strawberry and other fruit, without much ice.', dessert: 'Creamy, honey and dessert flavors.',
        spice: 'Spice, tea and herbal flavors.', drink: 'Drink, juice and cocktail flavors.'
      },
      axesTitle: 'How to read the map',
      axes: [
        'Left to right: the sweeter a flavor, the further left it sits. The fresher it is (sour, citrus, minty), the further right.',
        'Bottom to top: the flavors with the most cooling (mint and ice) are at the top. Among flavors without ice, fruity ones sit a little higher, and creamy, dessert and spice flavors are at the bottom.',
        'The size of a coal shows flavor strength, and a thin orange ring means dark leaf.',
        'The most similar flavors are calculated from all five profile traits (sweetness, freshness, fruitiness, cooling and strength), so they are not always the closest ones on the picture.'
      ],
      note: 'Flavor profiles are our editorial estimates based on manufacturer and retailer descriptions and experience, not lab measurements.',
      regionsTitle: 'Regions of the map', more: 'and {n} more',
      faq: [
        { q: 'What does the flavor map show?', a: 'All {n} flavors from the encyclopedia on one map. Sweet flavors are on the left, fresh ones on the right, icy at the top and warm, creamy ones at the bottom. Similar flavors sit close together.' },
        { q: 'How do I find a flavor similar to one I like?', a: 'Tap the flavor on the map or type it into search. Smoke threads lead from it to its five most similar flavors, and tapping a thread takes you to the next flavor.' },
        { q: 'How does the mix on the map work?', a: 'Pick a flavor, then "Mix with…" and a second flavor. The slider changes the ratio, the mix point moves between them, and the map shows which flavors are closest to that mix.' },
        { q: 'Where does the data come from?', a: 'From the flavor profiles on the site. They are our editorial estimates (sweetness, freshness, fruitiness, cooling and strength from 0 to 10), not lab measurements.' }
      ],
      metaTitle: 'Hookah flavor map: {n} shisha flavors on an interactive map | MyShishapedia',
      metaDesc: 'An interactive map of {n} hookah flavors: sweet or fresh, warm or icy. Find flavors similar to your favorite and build a mix right on the map.',
      promoEyebrow: 'Flavor map', promoTitle: 'The world of flavors', promoText: 'All {n} flavors as glowing coals on one map. Tap your favorite and meet its relatives.', promoCta: 'Open the map',
      flavorLink: 'See it on the flavor map'
    },
    de: {
      eyebrow: 'Geschmackskarte', h1: 'Die Welt der Sorten', count: '{n} Sorten auf einer Karte',
      lead: 'Jede glühende Kohle ist eine Sorte. Links ist süß, rechts frisch, oben eisig. Tippe eine Sorte an und sieh ihre nächsten Verwandten.',
      axSweet: 'Süß', axFresh: 'Frisch', axIce: 'Eisig', axWarm: 'Warm und cremig',
      hint: 'Tippe eine Kohle an', search: 'Sorte oder Marke suchen…', noResults: 'Keine solche Sorte',
      filters: 'Filter', brands: 'Marken', tags: 'Geschmacksart', reset: 'Alle zeigen', shown: '{n} von {t} Sorten',
      shelf: 'Mein Regal', surprise: 'Überrasch mich', skip: 'Überspringen',
      zoomIn: 'Vergrößern', zoomOut: 'Verkleinern', fit: 'Ganze Karte', save: 'Bild speichern', saved: 'Bild gespeichert.',
      openFlavor: 'Sorte öffnen', neighbors: 'Ähnlichste Sorten', close: 'Schließen',
      mixWith: 'Mixen mit…', pickSecond: 'Wähle eine zweite Sorte auf der Karte oder in der Suche', cancel: 'Abbrechen',
      mixTitle: 'Mix auf der Karte', mixLike: 'Dieser Mix ist nah an', openMixer: 'Im Mixer öffnen', ratio: 'Verhältnis',
      shelfEmpty: 'Dein Regal ist leer. Speichere die Sorten, die du hast (Button auf der Sortenseite), dann erscheint hier dein Sternbild.',
      shelfTitle: 'Dein Sternbild', shelfIn: 'Dein Geschmack liegt vor allem hier: {r}', shelfN: '{n} Sorten aus deinem Regal',
      browse: 'Sorten ansehen', strength: 'Stärke', dark: 'Dunkler Tabak', light: 'Heller Tabak',
      keys: 'Pfeiltasten: Nachbarsorte · Enter: öffnen · Esc: schließen', canvas: 'Interaktive Geschmackskarte. Mit den Pfeiltasten wählst du eine Sorte, Enter öffnet ihre Seite.',
      selected: 'Gewählte Sorte: {name}. Am ähnlichsten: {list}.',
      noJs: 'Die Geschmackskarte braucht JavaScript. Unten findest du die Bereiche der Karte mit allen Sorten.',
      regions: { ice: 'Eis und Minze', candy: 'Eisige Bonbons', citrus: 'Frische Zitrusfrüchte', fruit: 'Klassisch fruchtig', dessert: 'Süße Desserts', spice: 'Gewürze und Tee', drink: 'Getränke und Cocktails' },
      rdesc: {
        ice: 'Die kältesten Sorten: Minze, Eis und Pfefferminze.', candy: 'Süße Bonbons mit viel Eis.', citrus: 'Zitrone, Limette, Grapefruit und saure Sorten.',
        fruit: 'Apfel, Traube, Erdbeere und anderes Obst, ohne viel Eis.', dessert: 'Cremige, honigsüße und Dessert-Sorten.',
        spice: 'Gewürze, Tee und Kräuter.', drink: 'Sorten nach Getränken, Säften und Cocktails.'
      },
      axesTitle: 'So liest du die Karte',
      axes: [
        'Von links nach rechts: Je süßer eine Sorte, desto weiter links liegt sie. Je frischer (sauer, zitronig, minzig), desto weiter rechts.',
        'Von unten nach oben: Oben liegen die Sorten mit der stärksten Kühlung (Minze und Eis). Bei Sorten ohne Eis liegen fruchtige etwas höher, cremige, Dessert- und Gewürzsorten unten.',
        'Die Größe der Kohle zeigt die Stärke des Geschmacks, ein dünner oranger Ring steht für dunklen Tabak.',
        'Die ähnlichsten Sorten werden aus allen fünf Profilwerten berechnet (Süße, Frische, Fruchtigkeit, Kühlung und Stärke), deshalb liegen sie nicht immer am nächsten auf dem Bild.'
      ],
      note: 'Die Geschmacksprofile sind unsere redaktionellen Einschätzungen aus Hersteller- und Händlerbeschreibungen und Erfahrung, keine Labormessungen.',
      regionsTitle: 'Bereiche der Karte', more: 'und {n} weitere',
      faq: [
        { q: 'Was zeigt die Geschmackskarte?', a: 'Alle {n} Sorten der Enzyklopädie auf einer Karte. Süße Sorten liegen links, frische rechts, eisige oben und warme, cremige unten. Ähnliche Sorten liegen nah beieinander.' },
        { q: 'Wie finde ich eine Sorte, die meiner Lieblingssorte ähnelt?', a: 'Tippe die Sorte auf der Karte an oder gib sie in die Suche ein. Rauchfäden führen zu den fünf ähnlichsten Sorten, und mit einem Tipp auf einen Faden reist du zur nächsten Sorte.' },
        { q: 'Wie funktioniert der Mix auf der Karte?', a: 'Wähle eine Sorte, dann "Mixen mit…" und eine zweite Sorte. Mit dem Regler änderst du das Verhältnis, der Mixpunkt wandert zwischen beiden, und die Karte zeigt, welche Sorten diesem Mix am nächsten sind.' },
        { q: 'Woher stammen die Daten?', a: 'Aus den Geschmacksprofilen der Seite. Das sind unsere redaktionellen Einschätzungen (Süße, Frische, Fruchtigkeit, Kühlung und Stärke von 0 bis 10), keine Labormessungen.' }
      ],
      metaTitle: 'Shisha Geschmackskarte: {n} Tabaksorten auf einer interaktiven Karte | MyShishapedia',
      metaDesc: 'Interaktive Karte mit {n} Shisha-Sorten: süß oder frisch, warm oder eisig. Finde Sorten wie deine Lieblingssorte und mixe direkt auf der Karte.',
      promoEyebrow: 'Geschmackskarte', promoTitle: 'Die Welt der Sorten', promoText: 'Alle {n} Sorten als glühende Kohlen auf einer Karte. Tippe deine Lieblingssorte an und triff ihre Verwandten.', promoCta: 'Karte öffnen',
      flavorLink: 'Auf der Geschmackskarte ansehen'
    },
    ru: {
      eyebrow: 'Карта вкусов', h1: 'Мир вкусов', count: '{n} вкусов на одной карте',
      lead: 'Каждый тлеющий уголь это один вкус. Слева сладкое, справа свежее, наверху ледяное. Нажми на вкус и увидишь его ближайших родственников.',
      axSweet: 'Сладко', axFresh: 'Свежо', axIce: 'Холодно', axWarm: 'Тепло и сливочно',
      hint: 'Нажми на уголь', search: 'Найти вкус или бренд…', noResults: 'Такого вкуса нет',
      filters: 'Фильтры', brands: 'Бренды', tags: 'Тип вкуса', reset: 'Показать все', shown: '{n} из {t} вкусов',
      shelf: 'Моя полка', surprise: 'Удиви меня', skip: 'Пропустить',
      zoomIn: 'Приблизить', zoomOut: 'Отдалить', fit: 'Вся карта', save: 'Сохранить картинку', saved: 'Картинка сохранена.',
      openFlavor: 'Открыть вкус', neighbors: 'Самые похожие вкусы', close: 'Закрыть',
      mixWith: 'Смешать с…', pickSecond: 'Выбери второй вкус на карте или в поиске', cancel: 'Отмена',
      mixTitle: 'Микс на карте', mixLike: 'Этот микс похож на', openMixer: 'Открыть в миксере', ratio: 'Пропорция',
      shelfEmpty: 'Полка пуста. Сохрани вкусы, которые у тебя есть (кнопка на странице вкуса), и здесь появится твоё созвездие.',
      shelfTitle: 'Твоё созвездие', shelfIn: 'Твой вкус чаще всего здесь: {r}', shelfN: '{n} вкусов с полки',
      browse: 'Смотреть вкусы', strength: 'Крепость', dark: 'Тёмный лист', light: 'Светлый лист',
      keys: 'Стрелки: соседний вкус · Enter: открыть · Esc: закрыть', canvas: 'Интерактивная карта вкусов. Стрелками выбираешь вкус, Enter открывает его страницу.',
      selected: 'Выбран вкус: {name}. Самые похожие: {list}.',
      noJs: 'Для карты вкусов нужен JavaScript. Ниже области карты со всеми вкусами.',
      regions: { ice: 'Лёд и мята', candy: 'Ледяные конфеты', citrus: 'Свежие цитрусы', fruit: 'Классические фруктовые', dessert: 'Сладкие десерты', spice: 'Пряности и чай', drink: 'Напитки и коктейли' },
      rdesc: {
        ice: 'Самые холодные вкусы: мята, лёд и перечная мята.', candy: 'Сладкие конфеты с сильным холодком.', citrus: 'Лимон, лайм, грейпфрут и кислые вкусы.',
        fruit: 'Яблоко, виноград, клубника и другие фрукты, без сильного холодка.', dessert: 'Сливочные, медовые и десертные вкусы.',
        spice: 'Пряности, чай и травы.', drink: 'Вкусы напитков, соков и коктейлей.'
      },
      axesTitle: 'Как читать карту',
      axes: [
        'Слева направо: чем слаще вкус, тем левее он находится. Чем он свежее (кислый, цитрусовый, мятный), тем правее.',
        'Снизу вверх: наверху вкусы с самым сильным холодком (мята и лёд). Среди вкусов без холодка фруктовые немного выше, а сливочные, десертные и пряные внизу.',
        'Размер угля показывает крепость вкуса, а тонкое оранжевое кольцо означает тёмный лист.',
        'Самые похожие вкусы считаются по всем пяти показателям профиля (сладость, свежесть, фруктовость, холодок и крепость), поэтому на картинке они не всегда ближе всех.'
      ],
      note: 'Профили вкусов это наши редакционные оценки по описаниям производителей, продавцов и опыту, а не лабораторные измерения.',
      regionsTitle: 'Области карты', more: 'и ещё {n}',
      faq: [
        { q: 'Что показывает карта вкусов?', a: 'Все {n} вкусов энциклопедии на одной карте. Сладкие вкусы слева, свежие справа, ледяные наверху, а тёплые и сливочные внизу. Похожие вкусы находятся рядом.' },
        { q: 'Как найти вкус, похожий на любимый?', a: 'Нажми на вкус на карте или введи его в поиск. От него идут дымные нити к пяти самым похожим вкусам, а нажатие на нить переносит к следующему вкусу.' },
        { q: 'Как работает микс на карте?', a: 'Выбери вкус, затем "Смешать с…" и второй вкус. Ползунок меняет пропорцию, точка микса движется между ними, а карта показывает, какие вкусы ближе всего к этому миксу.' },
        { q: 'Откуда данные?', a: 'Из профилей вкусов на сайте. Это наши редакционные оценки (сладость, свежесть, фруктовость, холодок и крепость от 0 до 10), а не лабораторные измерения.' }
      ],
      metaTitle: 'Карта вкусов для кальяна: {n} вкусов на интерактивной карте | MyShishapedia',
      metaDesc: 'Интерактивная карта {n} вкусов для кальяна: сладкое или свежее, тёплое или ледяное. Найди похожие на любимый вкус и собери микс на карте.',
      promoEyebrow: 'Карта вкусов', promoTitle: 'Мир вкусов', promoText: 'Все {n} вкусов как тлеющие угли на одной карте. Нажми на любимый и познакомься с его родственниками.', promoCta: 'Открыть карту',
      flavorLink: 'Посмотреть на карте вкусов'
    }
  };

  function tx(key, vars, lang) {
    var d = TX[lang || MSP.lang] || TX.en;
    var v = d[key];
    if (v == null) v = TX.en[key];
    if (typeof v === 'string' && vars) v = v.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return v;
  }
  V.fmapTx = function (lang) { return TX[lang || MSP.lang] || TX.en; };

  /* ------------------------------------------------------------------ */
  /* Krajevi mape (pravila iz podataka, isti u buildu i u browseru)      */
  /* ------------------------------------------------------------------ */

  function has(f, tag) { return (f.tags || []).indexOf(tag) !== -1; }
  var REGIONS = [
    { id: 'ice', color: '#9fdcff', test: function (f, p) { return p.cooling >= 7; } },
    { id: 'candy', color: '#c7a6ff', test: function (f, p) { return p.cooling >= 3 && p.cooling < 9 && (has(f, 'bombon') || (has(f, 'ledeni') && p.sweetness >= 6)); } },
    { id: 'citrus', color: '#d9ec5c', test: function (f, p) { return p.cooling < 7 && (has(f, 'citrusni') || has(f, 'kiseli')); } },
    { id: 'fruit', color: '#ff6a4a', test: function (f, p) { return p.cooling < 5 && has(f, 'vocni') && !has(f, 'citrusni') && !has(f, 'desertni'); } },
    { id: 'dessert', color: '#f0b36a', test: function (f, p) { return p.cooling < 5 && (has(f, 'desertni') || has(f, 'medeni')); } },
    { id: 'spice', color: '#c9824e', test: function (f, p) { return has(f, 'zacinski') || has(f, 'caj') || has(f, 'biljni'); } },
    { id: 'drink', color: '#ff7fae', test: function (f, p) { return p.cooling < 7 && has(f, 'pice'); } }
  ];
  V.fmapRegions = function () {
    var all = V.flavors();
    return REGIONS.map(function (r) {
      return { id: r.id, color: r.color, members: all.filter(function (f) { return r.test(f, f.profile || {}); }) };
    });
  };

  /* ------------------------------------------------------------------ */
  /* HTML                                                                */
  /* ------------------------------------------------------------------ */

  var icon = V.icon;

  function chipList(items, kind) {
    return items.map(function (it) {
      return '<button type="button" class="fm-chip" data-' + kind + '="' + esc(it.id) + '" aria-pressed="false">' + esc(it.label) +
        ' <span class="fm-chip__n">' + it.n + '</span></button>';
    }).join('');
  }

  V.pageFlavorMap = function (desc, crumbs) {
    var lang = MSP.lang;
    var all = V.flavors();
    var n = all.length;
    var d = TX[lang] || TX.en;

    // brendovi i vrste okusa za filtere (sa brojem okusa), po broju okusa
    var bc = {}, tc = {};
    all.forEach(function (f) {
      bc[f.brand] = (bc[f.brand] || 0) + 1;
      (f.tags || []).forEach(function (g) { tc[g] = (tc[g] || 0) + 1; });
    });
    var brands = Object.keys(bc).sort(function (a, b) { return bc[b] - bc[a] || a.localeCompare(b); }).map(function (b) { return { id: b, label: b, n: bc[b] }; });
    var tags = Object.keys(tc).sort(function (a, b) { return tc[b] - tc[a]; }).map(function (g) { return { id: g, label: MSP.tagLabel(g), n: tc[g] }; });

    // tekstovi za browser (samo ovaj jezik) i adrese
    var client = {
      tx: d, n: n, profile: ['sweetness', 'freshness', 'fruitiness', 'cooling', 'strength'].map(function (k) { return MSP.t('profile.' + k); }),
      regions: REGIONS.map(function (r) { return { id: r.id, color: r.color, name: d.regions[r.id] }; }),
      tagLabels: tags.reduce(function (o, g) { o[g.id] = g.label; return o; }, {}),
      shelfUrl: V.url('flavors')
    };

    var regions = V.fmapRegions();
    var regionList = regions.filter(function (r) { return r.members.length; }).map(function (r) {
      var shown = r.members.slice(0, 14);
      var rest = r.members.length - shown.length;
      return '<li class="fm-reg" style="--rc:' + r.color + '">' +
        '<h3 class="fm-reg__name"><span class="fm-reg__dot" aria-hidden="true"></span>' + esc(d.regions[r.id]) + ' <span class="fm-reg__n">' + r.members.length + '</span></h3>' +
        '<p class="fm-reg__desc">' + esc(d.rdesc[r.id]) + '</p>' +
        '<p class="fm-reg__links">' + shown.map(function (f) {
          return '<a class="chip" href="' + V.flavorUrl(f) + '">' + esc(f.brand + ' ' + f.name) + '</a>';
        }).join('') + (rest > 0 ? '<span class="fm-reg__more">' + esc(tx('more', { n: rest })) + '</span>' : '') + '</p>' +
      '</li>';
    }).join('');

    var faq = d.faq.map(function (it) {
      var q = it.q, a = it.a.replace('{n}', n);
      return { q: { bs: q, en: q, de: q, ru: q }, a: { bs: a, en: a, de: a, ru: a } };
    });

    return (
      '<div class="fm-page">' +
      '<section class="fm" id="fm" aria-labelledby="fm-title">' +
        '<div class="fm__stage" id="fm-stage">' +
          '<canvas class="fm__bg" id="fm-bg" aria-hidden="true"></canvas>' +
          '<canvas class="fm__cv" id="fm-cv" tabindex="0" role="application" aria-label="' + esc(d.canvas) + '" aria-describedby="fm-keys"></canvas>' +
        '</div>' +
        '<div class="fm__ui">' +
          '<header class="fm__head">' +
            '<p class="fm__eyebrow"><span class="fm-dot" aria-hidden="true"></span>' + esc(d.eyebrow) + '</p>' +
            '<h1 class="fm__title" id="fm-title">' + esc(d.h1) + '</h1>' +
            '<p class="fm__count" id="fm-count">' + esc(tx('count', { n: n })) + '</p>' +
          '</header>' +
          '<div class="fm__tools">' +
            '<div class="fm-search" role="search">' + icon('search') +
              '<input type="search" id="fm-q" class="fm-search__in" placeholder="' + esc(d.search) + '" autocomplete="off" aria-label="' + esc(d.search) + '" aria-controls="fm-sug" aria-expanded="false">' +
              '<ul class="fm-search__sug" id="fm-sug" role="listbox" hidden></ul>' +
            '</div>' +
            '<div class="fm__btns">' +
              '<button type="button" class="fm-btn" id="fm-filters-btn" aria-expanded="false" aria-controls="fm-filters"><span class="fm-btn__ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 6h16M7 12h10M10 18h4"/></svg></span><span>' + esc(d.filters) + '</span><span class="fm-btn__badge" id="fm-fcount" hidden></span></button>' +
              '<button type="button" class="fm-btn" id="fm-shelf" aria-pressed="false"><span class="fm-btn__ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3l2.2 5.6 6 .4-4.6 3.8 1.5 5.8L12 15.4 6.9 18.6l1.5-5.8L3.8 9l6-.4z"/></svg></span><span>' + esc(d.shelf) + '</span></button>' +
              '<button type="button" class="fm-btn" id="fm-surprise"><span class="fm-btn__ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3c1 3 3 5 6 6-3 1-5 3-6 6-1-3-3-5-6-6 3-1 5-3 6-6zM19 15c.5 1.4 1.2 2.1 2.6 2.6-1.4.5-2.1 1.2-2.6 2.6-.5-1.4-1.2-2.1-2.6-2.6 1.4-.5 2.1-1.2 2.6-2.6z"/></svg></span><span>' + esc(d.surprise) + '</span></button>' +
            '</div>' +
          '</div>' +
          '<div class="fm-filters" id="fm-filters" hidden>' +
            '<div class="fm-filters__in">' +
              '<p class="fm-filters__h">' + esc(d.tags) + '</p><div class="fm-filters__row">' + chipList(tags, 'tag') + '</div>' +
              '<p class="fm-filters__h">' + esc(d.brands) + '</p><div class="fm-filters__row fm-filters__row--brands">' + chipList(brands, 'brand') + '</div>' +
              '<div class="fm-filters__foot"><span id="fm-shown"></span><button type="button" class="fm-link" id="fm-reset">' + esc(d.reset) + '</button></div>' +
            '</div>' +
          '</div>' +
          '<p class="fm-ax fm-ax--l" aria-hidden="true"><span class="fm-dot"></span>' + esc(d.axSweet) + '</p>' +
          '<p class="fm-ax fm-ax--r" aria-hidden="true">' + esc(d.axFresh) + '<span class="fm-dot"></span></p>' +
          '<p class="fm-ax fm-ax--t" aria-hidden="true"><span class="fm-dot fm-dot--ice"></span>' + esc(d.axIce) + '</p>' +
          '<p class="fm-ax fm-ax--b" aria-hidden="true"><span class="fm-dot"></span>' + esc(d.axWarm) + '</p>' +
          '<p class="fm-hint" id="fm-hint" aria-hidden="true">' + esc(d.hint) + '</p>' +
          '<div class="fm-zoom">' +
            '<button type="button" class="fm-ibtn" id="fm-zin" aria-label="' + esc(d.zoomIn) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button>' +
            '<button type="button" class="fm-ibtn" id="fm-zout" aria-label="' + esc(d.zoomOut) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14"/></svg></button>' +
            '<button type="button" class="fm-ibtn" id="fm-fit" aria-label="' + esc(d.fit) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button>' +
            '<button type="button" class="fm-ibtn" id="fm-save" aria-label="' + esc(d.save) + '"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg></button>' +
          '</div>' +
          '<aside class="fm-card" id="fm-card" hidden aria-live="polite"></aside>' +
          '<button type="button" class="fm-skip" id="fm-skip" hidden>' + esc(d.skip) + '</button>' +
          '<p class="fm-toast" id="fm-toast" role="status"></p>' +
          '<p class="sr-only" id="fm-keys">' + esc(d.keys) + '</p>' +
          '<p class="sr-only" id="fm-live" aria-live="polite"></p>' +
        '</div>' +
        '<noscript><p class="fm-nojs">' + esc(d.noJs) + '</p></noscript>' +
        '<script type="application/json" id="fm-data">' + JSON.stringify(client).replace(/</g, '\\u003c') + '</script>' +
      '</section>' +
      '<section class="fsec fm-about" aria-labelledby="fm-axes"><div class="container">' +
        crumbs +
        '<div class="fm-about__grid">' +
          '<div class="fm-about__text">' +
            '<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(d.eyebrow) + '</p>' +
            '<h2 class="fm-about__h" id="fm-axes">' + esc(d.axesTitle) + '</h2>' +
            '<p class="fm-about__lead">' + esc(d.lead) + '</p>' +
            '<ul class="fm-about__axes" role="list">' + d.axes.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul>' +
            '<p class="fm-about__note">' + esc(d.note) + '</p>' +
          '</div>' +
        '</div>' +
        '<h2 class="fm-about__h fm-about__h--reg">' + esc(d.regionsTitle) + '</h2>' +
        '<ul class="fm-regs" role="list">' + regionList + '</ul>' +
      '</div></section>' +
      V.faqSection(faq, 'fm-faq') +
      '</div>'
    );
  };

  V.fmapMeta = function () {
    var n = V.flavors().length;
    return { title: tx('metaTitle', { n: n }), description: V.clipText(tx('metaDesc', { n: n }), 155) };
  };

  /** Pločica za početnu (isti stil kao kartica igre). */
  V.fmapPromo = function () {
    var n = V.flavors().length;
    var dots = '';
    var seeds = [[18, 30, '#ff6a4a', 9], [32, 58, '#f0b36a', 7], [52, 22, '#9fdcff', 8], [66, 44, '#d9ec5c', 6], [78, 70, '#c7a6ff', 7], [44, 76, '#ff7fae', 6], [86, 26, '#9fdcff', 5], [26, 82, '#c9824e', 6], [60, 62, '#ff6a4a', 5], [12, 60, '#f0b36a', 5]];
    seeds.forEach(function (s, i) { dots += '<i class="fmp-c" style="--x:' + s[0] + '%;--y:' + s[1] + '%;--c:' + s[2] + ';--s:' + s[3] + 'px;--i:' + i + '"></i>'; });
    return (
      '<section class="gpromo fmpromo" aria-labelledby="fmpromo-title"><div class="container">' +
        '<a class="gpromo__card fmpromo__card" href="' + V.url('fmap') + '" data-reveal>' +
          '<span class="fmpromo__art" aria-hidden="true">' + dots + '<svg class="fmpromo__lines" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M52 22Q60 32 66 44M52 22Q40 24 32 58M66 44Q74 56 78 70"/></svg></span>' +
          '<span class="gpromo__body">' +
            '<span class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(tx('promoEyebrow')) + ' <span class="nav-new">' + esc(MSP.t('nav.newBadge')) + '</span></span>' +
            '<span class="gpromo__title" id="fmpromo-title">' + esc(tx('promoTitle')) + '</span>' +
            '<span class="gpromo__text">' + esc(tx('promoText', { n: n })) + '</span>' +
            '<span class="btn btn--primary gpromo__cta">' + esc(tx('promoCta')) + icon('arrowRight') + '</span>' +
          '</span>' +
        '</a>' +
      '</div></section>'
    );
  };

  /** Link sa stranice okusa na mapu (okus je odmah izabran). */
  V.fmapLink = function (f) {
    return '<p class="fm-flink"><a class="btn btn--ghost" href="' + esc(V.fmapUrl(f)) + '"><span class="fm-flink__dots" aria-hidden="true"><i></i><i></i><i></i></span><span>' + esc(tx('flavorLink')) + '</span></a></p>';
  };
})(typeof window !== 'undefined' ? window : globalThis);
