/*
 * MyShishapedia - nargila barovi u BiH (HTML koji pravi build.mjs).
 *
 *   /bs/nargila-barovi/           3D karta BiH sa stubom svjetla za svaki grad, brojevi, "Najbliži lokal", gradovi
 *   /bs/nargila-barovi/<grad>/    poster grada (dim i znamenitost), tabovi gradova, lista lokala i mapa
 *
 * Lokal sa dogovorom (polje `lounge` u data/bars.js) "gori": istaknuta kartica i užareni ugalj na mapi,
 * a vodi na stranicu lounge-a (meni okusa). Ostali lokali imaju ime, kvart, "Kako do nas" i Instagram.
 * Karta BiH i poster se crtaju ovdje (SVG), a pokreće ih js/bars.js (animacije, lokacija, mapa).
 *
 * Ovisi o: views.js (V), data/bars.js, data/bih-outline.js, data/lounges.js (za lokale sa dogovorom).
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  var esc = V.esc;

  /* ------------------------------------------------------------------ */
  /* Adrese                                                              */
  /* ------------------------------------------------------------------ */

  var SEGS = { bs: 'nargila-barovi', en: 'hookah-bars', de: 'shisha-bars', ru: 'kalyannye' };
  Object.keys(SEGS).forEach(function (l) {
    if (V.SEG[l]) { V.SEG[l].bars = SEGS[l]; V.SEG[l].barCity = SEGS[l]; }
  });

  /* ------------------------------------------------------------------ */
  /* Tekstovi                                                            */
  /* ------------------------------------------------------------------ */

  function slav(n, one, few, many) {
    var m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  }

  var TX = {
    bs: {
      openUntil: 'otvoreno do',
      verified: 'Provjeren lokal', demoBadge: 'Demo lounge', call: 'Pozovi', mixesN: function (n) { return n + ' ' + slav(n, 'kućni miks', 'kućna miksa', 'kućnih miksova'); }, okusa: 'okusa', miksova: 'miksova',
      nav: 'Nargila barovi', eyebrow: 'Nargila barovi u BiH', title1: 'Gdje BiH', title2: 'pali žar',
      lead: 'Svaki stub svjetla je grad. Što je viši, to više lokala za nargilu.',
      bars: function (n) { return n + ' ' + slav(n, 'lokal', 'lokala', 'lokala'); },
      statBars: 'lokala', statCities: 'gradova', statMenu: 'sa menijem', statAreas: 'kvartova',
      near: 'Najbliži lokal', nearSub: 'Pokaži lokale oko mene', nearBusy: 'Tražim tvoju lokaciju…',
      nearFail: 'Lokacija nije dostupna. Izaberi grad ispod.', nearRes: 'Najbliži: {name}, {city} · {dist}',
      cities: 'Gradovi', otherCities: 'Ostali gradovi', otherLead: 'Gradovi sa manje lokala. Čim ih bude više, dobiće svoju stranicu.',
      directions: 'Kako do nas', website: 'Web stranica', onMap: 'Na mapi', list: 'Lista', map: 'Mapa', nearest: 'Najbliže', withMenu: 'Sa menijem',
      otherBars: 'Ostali lokali', allBars: 'Lokali', openMenu: 'Otvori meni', menuTag: 'MENI', until: 'do {t}',
      flavors: function (n) { return n + ' ' + slav(n, 'okus', 'okusa', 'okusa'); }, mixes: 'kućni miksevi',
      min: 'min', ownerQ: 'Vaš lokal je na listi?', ownerA: 'Upalite svjetlo: meni okusa, slike i prvo mjesto u gradu.',
      ownerFirst: 'U {loc} još niko nema meni okusa. Budite prvi lokal koji gori.', ownerMore: 'Saznaj više', demo: 'Pogledaj primjer',
      missing: 'Fali neki lokal ili je zatvoren?', missingCta: 'Javi nam', noPin: 'tačna lokacija se provjerava',
      legendMenu: 'Sa menijem', legendBar: 'Lokal', legendYou: 'Ti', osm: 'Lokacije: © OpenStreetMap saradnici',
      cityLead: '{n} za nargilu u {loc}, na listi i na mapi.', cityLeadNoMap: '{n} za nargilu u {loc}.', allCities: 'Svi gradovi',
      zoomIn: 'Približi', zoomOut: 'Udalji', closeCard: 'Zatvori', mapLabel: 'Mapa lokala: {city}',
      metaTitle: 'Nargila barovi u BiH: mapa lokala po gradovima | MyShishapedia',
      metaDesc: 'Nargila barovi u Sarajevu, Mostaru, Tuzli i drugim gradovima BiH: {n} lokala na karti, po gradovima i kvartovima, sa putem do lokala.',
      cityTitle: '{city}: nargila barovi i shisha lounge, {n} na mapi | MyShishapedia',
      cityDesc: 'Nargila barovi u {loc}: {n} na listi i na mapi. {areas}. Najbliži lokal, kvart i put do lokala na jedan dodir.',
      q1: 'Gdje u BiH ima najviše nargila barova?', a1: 'Najviše ih je u gradu {c1} ({n1}), pa u gradovima {c2} ({n2}) i {c3} ({n3}). Na ovoj stranici su lokali iz {cities}.',
      q2: 'Kako da nađem najbliži nargila bar?', a2: 'Dodirni "Najbliži lokal" i dozvoli lokaciju. Lokacija ostaje na tvom telefonu i nigdje se ne šalje.',
      q3: 'Gdje je u {loc} najviše nargila barova?', a3: 'Najviše ih je u dijelu {area} ({k}). Ostali su u: {others}.', a3one: 'Svi lokali sa ove liste su u dijelu {area}.',
      q4: 'Kako da dođem do lokala?', a4: 'Dodirni "Kako do nas" pored lokala i otvoriće se mapa sa putem do njega.'
    },
    en: {
      openUntil: 'open until',
      verified: 'Verified bar', demoBadge: 'Demo lounge', call: 'Call', mixesN: function (n) { return n === 1 ? '1 house mix' : n + ' house mixes'; }, okusa: 'flavors', miksova: 'mixes',
      nav: 'Hookah bars', eyebrow: 'Hookah bars in Bosnia and Herzegovina', title1: 'Where Bosnia', title2: 'lights the coals',
      lead: 'Every beam of light is a city. The taller it is, the more hookah bars it has.',
      bars: function (n) { return n === 1 ? '1 bar' : n + ' bars'; },
      statBars: 'bars', statCities: 'cities', statMenu: 'with a menu', statAreas: 'areas',
      near: 'Nearest hookah bar', nearSub: 'Show bars near me', nearBusy: 'Finding your location…',
      nearFail: 'Location is not available. Pick a city below.', nearRes: 'Nearest: {name}, {city} · {dist}',
      cities: 'Cities', otherCities: 'Other cities', otherLead: 'Cities with fewer bars. They get their own page as soon as there are more.',
      directions: 'Directions', website: 'Website', onMap: 'On the map', list: 'List', map: 'Map', nearest: 'Nearest', withMenu: 'With a menu',
      otherBars: 'Other bars', allBars: 'Bars', openMenu: 'Open the menu', menuTag: 'MENU', until: 'until {t}',
      flavors: function (n) { return n === 1 ? '1 flavor' : n + ' flavors'; }, mixes: 'house mixes',
      min: 'min', ownerQ: 'Is your bar on the list?', ownerA: 'Light it up: a flavor menu, photos and first place in the city.',
      ownerFirst: 'No bar in {loc} has a flavor menu yet. Be the first one that glows.', ownerMore: 'Learn more', demo: 'See an example',
      missing: 'Is a bar missing or closed?', missingCta: 'Tell us', noPin: 'exact location being checked',
      legendMenu: 'With a menu', legendBar: 'Bar', legendYou: 'You', osm: 'Locations: © OpenStreetMap contributors',
      cityLead: '{n} for hookah in {loc}, on a list and on a map.', cityLeadNoMap: '{n} for hookah in {loc}.', allCities: 'All cities',
      zoomIn: 'Zoom in', zoomOut: 'Zoom out', closeCard: 'Close', mapLabel: 'Map of bars: {city}',
      metaTitle: 'Hookah bars in Bosnia and Herzegovina: map by city | MyShishapedia',
      metaDesc: 'Hookah bars in Sarajevo, Mostar, Tuzla and other cities in Bosnia: {n} shisha lounges on a map, by city and area, with directions.',
      cityTitle: 'Hookah bars in {city}: {n} shisha lounges on a map | MyShishapedia',
      cityDesc: 'Hookah bars in {loc}: {n} on a list and on a map. {areas}. The nearest bar, its area and directions in one tap.',
      q1: 'Where are the most hookah bars in Bosnia and Herzegovina?', a1: 'Most of them are in {c1} ({n1}), then {c2} ({n2}) and {c3} ({n3}). This page lists bars in {cities}.',
      q2: 'How do I find the nearest hookah bar?', a2: 'Tap "Nearest hookah bar" and allow your location. It stays on your phone and is never sent anywhere.',
      q3: 'Where are most hookah bars in {loc}?', a3: 'Most of them are in {area} ({k}). The others are in: {others}.', a3one: 'All bars on this list are in {area}.',
      q4: 'How do I get to a bar?', a4: 'Tap "Directions" next to the bar and a map with the route opens.'
    },
    de: {
      openUntil: 'geöffnet bis',
      verified: 'Geprüfte Bar', demoBadge: 'Demo-Lounge', call: 'Anrufen', mixesN: function (n) { return n === 1 ? '1 Hausmix' : n + ' Hausmixe'; }, okusa: 'Sorten', miksova: 'Mixe',
      nav: 'Shisha-Bars', eyebrow: 'Shisha-Bars in Bosnien und Herzegowina', title1: 'Wo Bosnien', title2: 'die Kohle anzündet',
      lead: 'Jeder Lichtstrahl ist eine Stadt. Je höher er ist, desto mehr Shisha-Bars.',
      bars: function (n) { return n === 1 ? '1 Bar' : n + ' Bars'; },
      statBars: 'Bars', statCities: 'Städte', statMenu: 'mit Karte', statAreas: 'Viertel',
      near: 'Nächste Shisha-Bar', nearSub: 'Bars in meiner Nähe zeigen', nearBusy: 'Standort wird gesucht…',
      nearFail: 'Standort nicht verfügbar. Wähle unten eine Stadt.', nearRes: 'Am nächsten: {name}, {city} · {dist}',
      cities: 'Städte', otherCities: 'Weitere Städte', otherLead: 'Städte mit weniger Bars. Sobald es mehr sind, bekommen sie eine eigene Seite.',
      directions: 'Route', website: 'Website', onMap: 'Auf der Karte', list: 'Liste', map: 'Karte', nearest: 'In der Nähe', withMenu: 'Mit Karte',
      otherBars: 'Weitere Bars', allBars: 'Bars', openMenu: 'Karte öffnen', menuTag: 'KARTE', until: 'bis {t}',
      flavors: function (n) { return n === 1 ? '1 Sorte' : n + ' Sorten'; }, mixes: 'Hausmixe',
      min: 'Min.', ownerQ: 'Ist deine Bar auf der Liste?', ownerA: 'Bring sie zum Leuchten: Tabakkarte, Fotos und Platz eins in der Stadt.',
      ownerFirst: 'In {loc} hat noch keine Bar eine Tabakkarte. Sei die erste, die leuchtet.', ownerMore: 'Mehr erfahren', demo: 'Beispiel ansehen',
      missing: 'Fehlt eine Bar oder ist sie geschlossen?', missingCta: 'Sag es uns', noPin: 'genauer Standort wird geprüft',
      legendMenu: 'Mit Karte', legendBar: 'Bar', legendYou: 'Du', osm: 'Standorte: © OpenStreetMap-Mitwirkende',
      cityLead: '{n} für Shisha in {loc}, als Liste und auf der Karte.', cityLeadNoMap: '{n} für Shisha in {loc}.', allCities: 'Alle Städte',
      zoomIn: 'Vergrößern', zoomOut: 'Verkleinern', closeCard: 'Schließen', mapLabel: 'Karte der Bars: {city}',
      metaTitle: 'Shisha-Bars in Bosnien und Herzegowina nach Stadt | MyShishapedia',
      metaDesc: 'Shisha-Bars in Sarajevo, Mostar, Tuzla und weiteren Städten Bosniens: {n} Lounges auf der Karte, nach Stadt und Viertel, mit Route.',
      cityTitle: 'Shisha-Bars in {city}: {n} Lounges auf der Karte | MyShishapedia',
      cityDesc: 'Shisha-Bars in {loc}: {n} als Liste und auf der Karte. {areas}. Nächste Bar, Viertel und Route mit einem Tipp.',
      q1: 'Wo gibt es in Bosnien die meisten Shisha-Bars?', a1: 'Die meisten gibt es in {c1} ({n1}), dann in {c2} ({n2}) und {c3} ({n3}). Diese Seite zeigt Bars in {cities}.',
      q2: 'Wie finde ich die nächste Shisha-Bar?', a2: 'Tippe auf "Nächste Shisha-Bar" und erlaube den Standort. Er bleibt auf deinem Handy und wird nirgends hingeschickt.',
      q3: 'Wo gibt es in {loc} die meisten Shisha-Bars?', a3: 'Die meisten sind in {area} ({k}). Die anderen sind in: {others}.', a3one: 'Alle Bars dieser Liste sind in {area}.',
      q4: 'Wie komme ich zu einer Bar?', a4: 'Tippe neben der Bar auf "Route", dann öffnet sich eine Karte mit dem Weg.'
    },
    ru: {
      openUntil: 'открыто до',
      verified: 'Проверенная кальянная', demoBadge: 'Демо-лаунж', call: 'Позвонить', mixesN: function (n) { return n + ' ' + slav(n, 'фирменный микс', 'фирменных микса', 'фирменных миксов'); }, okusa: 'вкусов', miksova: 'миксов',
      nav: 'Кальянные', eyebrow: 'Кальянные в Боснии и Герцеговине', title1: 'Где Босния', title2: 'разжигает угли',
      lead: 'Каждый луч света это город. Чем он выше, тем больше в нём кальянных.',
      bars: function (n) { return n + ' ' + slav(n, 'кальянная', 'кальянные', 'кальянных'); },
      statBars: 'кальянных', statCities: 'городов', statMenu: 'с меню', statAreas: 'районов',
      near: 'Ближайшая кальянная', nearSub: 'Показать кальянные рядом', nearBusy: 'Ищем ваше местоположение…',
      nearFail: 'Местоположение недоступно. Выберите город ниже.', nearRes: 'Ближайшая: {name}, {city} · {dist}',
      cities: 'Города', otherCities: 'Другие города', otherLead: 'Города, где кальянных пока меньше. Когда их станет больше, у них будет своя страница.',
      directions: 'Маршрут', website: 'Сайт', onMap: 'На карте', list: 'Список', map: 'Карта', nearest: 'Ближайшие', withMenu: 'С меню',
      otherBars: 'Другие кальянные', allBars: 'Кальянные', openMenu: 'Открыть меню', menuTag: 'МЕНЮ', until: 'до {t}',
      flavors: function (n) { return n + ' ' + slav(n, 'вкус', 'вкуса', 'вкусов'); }, mixes: 'фирменные миксы',
      min: 'мин', ownerQ: 'Ваша кальянная в списке?', ownerA: 'Зажгите свет: меню вкусов, фото и первое место в городе.',
      ownerFirst: 'В городе {loc} ещё ни у кого нет меню вкусов. Станьте первой кальянной, которая светится.', ownerMore: 'Подробнее', demo: 'Посмотреть пример',
      missing: 'Не хватает кальянной или она закрылась?', missingCta: 'Напишите нам', noPin: 'точное место уточняется',
      legendMenu: 'С меню', legendBar: 'Кальянная', legendYou: 'Вы', osm: 'Места: © участники OpenStreetMap',
      cityLead: '{n} в городе {loc}, списком и на карте.', cityLeadNoMap: '{n} в городе {loc}.', allCities: 'Все города',
      zoomIn: 'Приблизить', zoomOut: 'Отдалить', closeCard: 'Закрыть', mapLabel: 'Карта кальянных: {city}',
      metaTitle: 'Кальянные в Боснии и Герцеговине: карта по городам | MyShishapedia',
      metaDesc: 'Кальянные в Сараево, Мостаре, Тузле и других городах Боснии: {n} мест на карте, по городам и районам, с маршрутом.',
      cityTitle: 'Кальянные в городе {city}: {n} на карте | MyShishapedia',
      cityDesc: 'Кальянные в городе {loc}: {n} списком и на карте. {areas}. Ближайшая кальянная, район и маршрут в одно касание.',
      q1: 'Где в Боснии больше всего кальянных?', a1: 'Больше всего в городе {c1} ({n1}), затем {c2} ({n2}) и {c3} ({n3}). На этой странице кальянные из городов: {cities}.',
      q2: 'Как найти ближайшую кальянную?', a2: 'Нажмите "Ближайшая кальянная" и разрешите доступ к местоположению. Оно остаётся на телефоне и никуда не отправляется.',
      q3: 'Где в городе {loc} больше всего кальянных?', a3: 'Больше всего в районе {area} ({k}). Остальные в районах: {others}.', a3one: 'Все кальянные из списка в районе {area}.',
      q4: 'Как добраться до кальянной?', a4: 'Нажмите "Маршрут" рядом с кальянной, и откроется карта с дорогой.'
    }
  };
  // bosanski padež "u Sarajevu" (u ostalim jezicima ime grada)
  var LOC_BS = { sarajevo: 'Sarajevu', mostar: 'Mostaru', tuzla: 'Tuzli', zenica: 'Zenici', 'banja-luka': 'Banjoj Luci', travnik: 'Travniku' };

  function tx(k) { var d = TX[MSP.lang] || TX.en; return d[k] != null ? d[k] : TX.en[k]; }
  function fill(s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o[k] != null ? o[k] : ''; }); }
  V.barsTx = tx;

  /* ------------------------------------------------------------------ */
  /* Podaci                                                              */
  /* ------------------------------------------------------------------ */

  var MIN_PAGE = 3;
  V.barCities = function () { return root.BAR_CITIES || []; };
  V.allBars = function () { return root.BARS || []; };
  V.barCityById = function (id) { return V.barCities().filter(function (c) { return c.id === id; })[0] || null; };
  V.barsOf = function (c) { return V.allBars().filter(function (b) { return b.city === c.id; }); };
  /** Gradovi sa svojom stranicom (bar 3 lokala), po broju lokala. */
  V.barCityPages = function () {
    return V.barCities().filter(function (c) { return V.barsOf(c).length >= MIN_PAGE; })
      .sort(function (a, b) { return V.barsOf(b).length - V.barsOf(a).length; });
  };
  V.barCityName = function (c, lang) { var l = lang || MSP.lang; return c.name[l] || c.name.bs; };
  function cityLoc(c) { return MSP.lang === 'bs' ? (LOC_BS[c.id] || c.name.bs) : V.barCityName(c); }
  V.barCityUrl = function (c, lang) { return V.urlFor(lang || MSP.lang, 'barCity', c.id); };
  function isLit(b) { return !!(b.lounge && V.loungeById && V.loungeById(b.lounge)); }
  function hasPin(b) { return typeof b.lat === 'number' && typeof b.lon === 'number'; }

  /** Link za put do lokala: tačna lokacija ako je poznata, inače pretraga po imenu i adresi. */
  V.barDirections = function (b) {
    if (hasPin(b)) return 'https://www.google.com/maps/dir/?api=1&destination=' + b.lat + ',' + b.lon;
    var c = V.barCityById(b.city);
    return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([b.name, b.address, c ? c.name.bs : '', 'Bosnia and Herzegovina'].filter(Boolean).join(', '));
  };

  /** Kvartovi po broju lokala: [[kvart, broj], ...]. */
  function areasOf(list) {
    var m = {};
    list.forEach(function (b) { m[b.area] = (m[b.area] || 0) + 1; });
    return Object.keys(m).map(function (k) { return [k, m[k]]; }).sort(function (a, b) { return b[1] - a[1] || a[0].localeCompare(b[0]); });
  }

  /* ------------------------------------------------------------------ */
  /* Ikone                                                               */
  /* ------------------------------------------------------------------ */

  var IC = {
    pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/>',
    list: '<path d="M5 6h14M5 12h14M5 18h14"/>',
    map: '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
    near: '<circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="8"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3"/>',
    route: '<path d="M3.5 10.5 20.5 3.5l-7 17-2.2-7.8z"/>',
    insta: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/>',
    web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>'
  };
  function ic(name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + IC[name] + '</svg>';
  }

  /* ------------------------------------------------------------------ */
  /* Karta BiH (3D ploča sa stubovima svjetla)                           */
  /* ------------------------------------------------------------------ */

  // projekcija: ploča nagnuta prema gledaocu (matrica), u prostoru 390 x 380
  var PM = { a: 0.37, c: 0.05, d: 0.21, e: -2, f: 128 };
  function proj(x, y) { return [PM.a * x + PM.c * y + PM.e, PM.d * y + PM.f]; }
  function geo(lon, lat) {
    var O = root.BIH_OUTLINE;
    return [(lon - O.x0) / (O.x1 - O.x0) * O.W, (O.y1 - lat) / (O.y1 - O.y0) * O.H];
  }

  /** Reljefne linije (izohipse) iz broja lokala po gradu: marching squares nad mrežom. */
  function contours(pts) {
    var O = root.BIH_OUTLINE;
    var G = 6, NX = Math.ceil(O.W / G), NY = Math.ceil(O.H / G), Vv = [];
    function fz(x, y) {
      var v = 0.5 * Math.sin(x / 41) * Math.cos(y / 53) + 0.35 * Math.sin((x + y) / 29) + 0.3 * Math.cos((x - 2 * y) / 61);
      for (var i = 0; i < pts.length; i++) { var p = pts[i], s = 26 + p.c * 4.5; v += p.c * 0.8 * Math.exp(-((x - p.x) * (x - p.x) + (y - p.y) * (y - p.y)) / (2 * s * s)); }
      return v;
    }
    for (var j = 0; j <= NY; j++) { Vv[j] = []; for (var i = 0; i <= NX; i++) Vv[j][i] = fz(i * G, j * G); }
    var levels = [-0.6, -0.2, 0.2, 0.6, 1, 1.5, 2.1, 2.8, 3.6, 4.6, 5.8, 7.2, 8.8, 10.4];
    var out = '';
    levels.forEach(function (L, li) {
      var d = '';
      for (var j = 0; j < NY; j++) for (var i = 0; i < NX; i++) {
        var a = Vv[j][i], b = Vv[j][i + 1], c = Vv[j + 1][i + 1], e = Vv[j + 1][i];
        var idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (e > L ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        var x = i * G, y = j * G;
        var T = [x + G * (L - a) / (b - a), y], R = [x + G, y + G * (L - b) / (c - b)], Bo = [x + G * (L - e) / (c - e), y + G], Le = [x, y + G * (L - a) / (e - a)];
        var seg = { 1: [[Le, Bo]], 2: [[Bo, R]], 3: [[Le, R]], 4: [[T, R]], 5: [[Le, T], [Bo, R]], 6: [[T, Bo]], 7: [[Le, T]], 8: [[Le, T]], 9: [[T, Bo]], 10: [[T, R], [Le, Bo]], 11: [[T, R]], 12: [[Le, R]], 13: [[Bo, R]], 14: [[Le, Bo]] }[idx];
        for (var k = 0; k < seg.length; k++) d += 'M' + Math.round(seg[k][0][0]) + ' ' + Math.round(seg[k][0][1]) + 'L' + Math.round(seg[k][1][0]) + ' ' + Math.round(seg[k][1][1]);
      }
      var tt = li / (levels.length - 1);
      out += '<path class="bh-lv" style="--i:' + li + '" d="' + d + '" stroke="' + (tt > 0.5 ? '#f2a33c' : '#c9935a') + '" stroke-opacity="' + (0.1 + tt * 0.45).toFixed(2) + '" stroke-width="' + (0.6 + tt * 0.7).toFixed(2) + '" vector-effect="non-scaling-stroke"/>';
    });
    return out;
  }

  function rng(seed) { var s = seed; return function () { s = (s * 16807) % 2147483647; return s / 2147483647; }; }

  function bihMap() {
    var O = root.BIH_OUTLINE;
    var mtx = 'matrix(' + PM.a + ' 0 ' + PM.c + ' ' + PM.d + ' ' + PM.e + ' ' + PM.f + ')';
    var pts = V.barCities().map(function (c) { var g = geo(c.lon, c.lat); return { c: V.barsOf(c).length, x: g[0], y: g[1], city: c }; }).filter(function (p) { return p.c > 0; });
    var slab = '';
    for (var k = 20; k >= 1; k -= 1) slab += '<use href="#bh-shape" transform="translate(0 ' + k + ') ' + mtx + '" fill="' + (k > 14 ? '#0d0806' : k > 6 ? '#26170f' : '#4d2d1a') + '"/>';
    var grid = '', i, a, b;
    for (i = -8; i <= 20; i++) { a = proj(i * 70, -500); b = proj(i * 70, 1700); grid += 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1); }
    for (i = -6; i <= 18; i++) { a = proj(-700, i * 90); b = proj(1700, i * 90); grid += 'M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1); }
    var r = rng(21);
    var beams = pts.map(function (p) { var q = proj(p.x, p.y); return { p: p, X: q[0], Y: q[1], h: 22 + p.c * 10 }; }).sort(function (x, y) { return x.Y - y.Y; });
    var order = beams.slice().sort(function (x, y) { return x.p.c - y.p.c; });
    var bm = beams.map(function (bb) {
      var c = bb.p.c, w = 4 + c * 0.6, rx = 14 + c * 2.6, sp = '';
      for (var s = 0; s < Math.min(24, c * 1.6); s++) {
        sp += '<circle class="bh-sp" style="--s:' + (r() * 4).toFixed(2) + 's;--u:' + (2.4 + r() * 2.4).toFixed(2) + 's" cx="' + (bb.X + (r() - 0.5) * w * 5).toFixed(1) + '" cy="' + (bb.Y - r() * bb.h * 0.9).toFixed(1) + '" r="' + (r() * 0.9 + 0.4).toFixed(2) + '"/>';
      }
      return '<g class="bh-beam" data-city="' + esc(bb.p.city.id) + '" style="--d:' + (order.indexOf(bb) * 0.12 + 0.5).toFixed(2) + 's">' +
        '<ellipse class="bh-pool" cx="' + bb.X.toFixed(1) + '" cy="' + bb.Y.toFixed(1) + '" rx="' + rx.toFixed(1) + '" ry="' + (rx * 0.36).toFixed(1) + '" fill="url(#bh-pool)"/>' +
        '<ellipse cx="' + bb.X.toFixed(1) + '" cy="' + bb.Y.toFixed(1) + '" rx="' + (10 + c * 1.6).toFixed(1) + '" ry="' + ((10 + c * 1.6) * 0.36).toFixed(1) + '" fill="none" stroke="#ffcf8a" stroke-opacity=".5" stroke-width=".8"/>' +
        '<g class="bh-rise">' +
          '<rect x="' + (bb.X - w * 3.2).toFixed(1) + '" y="' + (bb.Y - bb.h).toFixed(1) + '" width="' + (w * 6.4).toFixed(1) + '" height="' + bb.h + '" fill="url(#bh-soft)" opacity=".55"/>' +
          '<rect x="' + (bb.X - w / 2).toFixed(1) + '" y="' + (bb.Y - bb.h).toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + bb.h + '" fill="url(#bh-beam)"/>' +
          '<rect x="' + (bb.X - 0.9).toFixed(1) + '" y="' + (bb.Y - bb.h).toFixed(1) + '" width="1.8" height="' + bb.h + '" fill="url(#bh-core)"/>' +
        '</g>' +
        '<ellipse cx="' + bb.X.toFixed(1) + '" cy="' + bb.Y.toFixed(1) + '" rx="' + (w * 0.95).toFixed(1) + '" ry="' + (w * 0.36).toFixed(1) + '" fill="#fff6e3"/>' +
        '<g class="bh-sparks" fill="#ffd9a0">' + sp + '</g>' +
      '</g>';
    }).join('');
    var svg =
      '<svg class="bh-svg" viewBox="0 0 390 380" role="img" aria-hidden="true" focusable="false">' +
        '<defs>' +
          '<path id="bh-shape" d="' + O.d + '"/>' +
          '<linearGradient id="bh-beam" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#ffd38a"/><stop offset=".55" stop-color="#f2a33c" stop-opacity=".65"/><stop offset="1" stop-color="#d9643f" stop-opacity="0"/></linearGradient>' +
          '<linearGradient id="bh-soft" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#f2a33c" stop-opacity=".5"/><stop offset="1" stop-color="#f2a33c" stop-opacity="0"/></linearGradient>' +
          '<linearGradient id="bh-core" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#fff"/><stop offset=".7" stop-color="#fff3dc" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
          '<radialGradient id="bh-pool"><stop stop-color="#ffb24d" stop-opacity=".9"/><stop offset=".4" stop-color="#f2a33c" stop-opacity=".3"/><stop offset="1" stop-color="#f2a33c" stop-opacity="0"/></radialGradient>' +
          '<linearGradient id="bh-gf" x1="0" y1="0" x2="0" y2="1"><stop offset=".1" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
          '<mask id="bh-gm"><rect width="390" height="380" fill="url(#bh-gf)"/></mask>' +
          '<linearGradient id="bh-face" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#2e2018"/><stop offset="1" stop-color="#1a120d"/></linearGradient>' +
          '<clipPath id="bh-clip"><use href="#bh-shape"/></clipPath>' +
          '<filter id="bh-blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18"/></filter>' +
        '</defs>' +
        '<path class="bh-grid" d="' + grid + '" stroke="#f2a33c" stroke-opacity=".17" stroke-width=".7" mask="url(#bh-gm)"/>' +
        '<g class="bh-plate">' +
          '<use href="#bh-shape" transform="translate(0 46) ' + mtx + '" fill="#000" opacity=".7" filter="url(#bh-blur)"/>' +
          slab +
          '<g transform="' + mtx + '"><use href="#bh-shape" fill="url(#bh-face)"/><g clip-path="url(#bh-clip)" fill="none">' + contours(pts) + '</g>' +
          '<use href="#bh-shape" fill="none" stroke="#ffcf8a" stroke-opacity=".6" stroke-width="1.2" vector-effect="non-scaling-stroke"/></g>' +
        '</g>' +
        bm +
      '</svg>';
    // oznake gradova sa stranicom (HTML iznad SVG-a, u procentima)
    var offs = { sarajevo: [40, -44], 'banja-luka': [-10, -40], mostar: [-64, -26], tuzla: [54, -18], zenica: [-58, -30] };
    var pages = V.barCityPages();
    var pills = beams.filter(function (bb) { return pages.indexOf(bb.p.city) !== -1; }).map(function (bb, n) {
      var o = offs[bb.p.city.id] || [0, -30];
      var x = bb.X + o[0], y = bb.Y - bb.h + o[1];
      var top = bb.p.city === pages[0];
      return '<a class="bh-pill' + (top ? ' is-top' : '') + '" data-city="' + esc(bb.p.city.id) + '" href="' + V.barCityUrl(bb.p.city) + '" style="left:' + (x / 3.9).toFixed(2) + '%;top:' + (y / 3.8).toFixed(2) + '%;--d:' + (1.1 + n * 0.1).toFixed(2) + 's">' +
        '<b>' + bb.p.c + '</b><span>' + esc(V.barCityName(bb.p.city)) + '</span></a>' +
        '<svg class="bh-lead" viewBox="0 0 390 380" aria-hidden="true" focusable="false"><path d="M' + bb.X.toFixed(1) + ' ' + (bb.Y - bb.h - 2).toFixed(1) + 'L' + x.toFixed(1) + ' ' + (y + 22).toFixed(1) + '"/></svg>';
    }).join('');
    return '<div class="bh-map" id="bh-map">' + svg + pills + '</div>';
  }

  /* ------------------------------------------------------------------ */
  /* Poster grada (dim, nebo, znamenitost)                               */
  /* ------------------------------------------------------------------ */

  function ridge(base, amp, freq, ph) {
    var d = 'M0 ' + base;
    for (var x = 0; x <= 390; x += 6) {
      var y = base - amp * (Math.sin(x / freq + ph) * 0.55 + Math.sin(x / (freq * 0.37) + ph * 2) * 0.3 + Math.sin(x / (freq * 0.13) + ph) * 0.15);
      d += 'L' + x + ' ' + y.toFixed(1);
    }
    return d + 'L390 400L0 400Z';
  }

  var LANDMARK = {
    // Sebilj (Baščaršija): osmougaona česma sa krovom i kupolom
    sebilj: function () {
      var sx = 195, sb = 336;
      return '<g fill="#0c0706">' +
        '<rect x="' + (sx - 60) + '" y="' + (sb - 8) + '" width="120" height="10" rx="2"/><rect x="' + (sx - 52) + '" y="' + (sb - 16) + '" width="104" height="9"/>' +
        '<rect x="' + (sx - 40) + '" y="' + (sb - 70) + '" width="80" height="56"/>' +
        '<path d="M' + (sx - 66) + ' ' + (sb - 70) + 'L' + (sx + 66) + ' ' + (sb - 70) + 'L' + (sx + 46) + ' ' + (sb - 92) + 'L' + (sx - 46) + ' ' + (sb - 92) + 'Z"/>' +
        '<rect x="' + (sx - 30) + '" y="' + (sb - 100) + '" width="60" height="10"/>' +
        '<path d="M' + (sx - 30) + ' ' + (sb - 99) + 'A30 32 0 0 1 ' + (sx + 30) + ' ' + (sb - 99) + 'Z"/>' +
        '<rect x="' + (sx - 1.6) + '" y="' + (sb - 148) + '" width="3.2" height="22"/><circle cx="' + sx + '" cy="' + (sb - 150) + '" r="4"/></g>' +
        '<g class="cp-win" fill="#ffb24d">' + [-28, -10, 8, 26].map(function (o) {
          return '<path d="M' + (sx + o - 6) + ' ' + (sb - 20) + 'L' + (sx + o - 6) + ' ' + (sb - 52) + 'A6 7 0 0 1 ' + (sx + o + 6) + ' ' + (sb - 52) + 'L' + (sx + o + 6) + ' ' + (sb - 20) + 'Z"/>';
        }).join('') + '</g>' +
        '<path d="M' + (sx - 66) + ' ' + (sb - 70) + 'L' + (sx + 66) + ' ' + (sb - 70) + 'M' + (sx - 30) + ' ' + (sb - 99) + 'A30 32 0 0 1 ' + (sx + 30) + ' ' + (sb - 99) + '" stroke="#ffcf8a" stroke-opacity=".55" stroke-width="1.1" fill="none"/>' +
        '<ellipse cx="' + sx + '" cy="' + (sb - 34) + '" rx="70" ry="40" fill="url(#cp-eg)" opacity=".6"/>';
    },
    // Stari most (Mostar): dvije kule i luk nad Neretvom
    most: function () {
      var y0 = 284;
      return '<path d="M0 ' + (y0 + 34) + 'C70 ' + (y0 + 26) + ' 110 ' + (y0 + 44) + ' 195 ' + (y0 + 36) + 'S330 ' + (y0 + 26) + ' 390 ' + (y0 + 34) + 'L390 400L0 400Z" fill="#132428"/>' +
        '<g fill="#0c0706"><rect x="96" y="' + (y0 - 46) + '" width="30" height="84"/><rect x="264" y="' + (y0 - 46) + '" width="30" height="84"/>' +
        '<path d="M92 ' + (y0 - 46) + 'L111 ' + (y0 - 60) + 'L130 ' + (y0 - 46) + 'Z"/><path d="M260 ' + (y0 - 46) + 'L279 ' + (y0 - 60) + 'L298 ' + (y0 - 46) + 'Z"/>' +
        '<path d="M126 ' + (y0 - 6) + 'Q195 ' + (y0 - 88) + ' 264 ' + (y0 - 6) + 'L264 ' + (y0 + 6) + 'Q195 ' + (y0 - 72) + ' 126 ' + (y0 + 6) + 'Z"/>' +
        '<rect x="0" y="' + (y0 + 2) + '" width="96" height="40"/><rect x="294" y="' + (y0 + 2) + '" width="96" height="40"/></g>' +
        '<path d="M126 ' + (y0 - 6) + 'Q195 ' + (y0 - 88) + ' 264 ' + (y0 - 6) + '" stroke="#ffcf8a" stroke-opacity=".6" stroke-width="1.2" fill="none"/>' +
        '<g class="cp-win" fill="#ffb24d"><rect x="106" y="' + (y0 - 30) + '" width="8" height="12" rx="4"/><rect x="274" y="' + (y0 - 30) + '" width="8" height="12" rx="4"/></g>' +
        '<path d="M150 ' + (y0 + 48) + 'Q195 ' + (y0 + 80) + ' 240 ' + (y0 + 48) + '" stroke="#ffcf8a" stroke-opacity=".2" stroke-width="2" stroke-dasharray="4 5" fill="none"/>';
    }
  };

  function cityPoster(c) {
    var r = rng(5 + c.id.length * 7);
    var name = V.barCityName(c).toUpperCase();
    var tl = Math.min(350, 42 * name.length + 10);
    var stars = '', lights = '', i;
    for (i = 0; i < 60; i++) stars += '<circle cx="' + (r() * 390).toFixed(1) + '" cy="' + (r() * 170).toFixed(1) + '" r="' + (r() * 1 + 0.3).toFixed(2) + '" opacity="' + (r() * 0.5 + 0.15).toFixed(2) + '"/>';
    for (i = 0; i < 200; i++) {
      var x = r() * 390, y = 288 + Math.pow(r(), 1.3) * 52 + Math.sin(x / 45) * 5;
      lights += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (r() * 1.2 + 0.4).toFixed(2) + '" fill="' + (r() > 0.3 ? '#ffc879' : '#fff1d6') + '" opacity="' + (r() * 0.6 + 0.3).toFixed(2) + '"/>';
    }
    var embers = [[46, 320, 1], [110, 328, 3], [292, 324, 4], [346, 316, 5]];
    var smoke = embers.map(function (e) {
      var x = e[0], y = e[1];
      return '<path d="M' + x + ' ' + y + 'C' + (x - 22) + ' ' + (y - 80) + ',' + (x + 40) + ' ' + (y - 130) + ',' + (x + 6) + ' ' + (y - 200) + 'S' + (x - 30) + ' ' + (y - 300) + ',' + (x + 10) + ' ' + (y - 380) + '" stroke="url(#cp-smk)" stroke-width="' + (10 + e[2] * 5) + '" fill="none" stroke-linecap="round"/>';
    }).join('');
    var glow = embers.map(function (e, n) {
      return '<g class="cp-ember" style="--d:' + (n * 0.7).toFixed(1) + 's"><circle cx="' + e[0] + '" cy="' + e[1] + '" r="26" fill="url(#cp-eg)"/><circle cx="' + e[0] + '" cy="' + e[1] + '" r="' + (4 + e[2] * 0.8).toFixed(1) + '" fill="#fff1d6"/></g>';
    }).join('');
    var lm = c.landmark && LANDMARK[c.landmark] ? LANDMARK[c.landmark]() : '';
    var defs = '<defs>' +
      '<linearGradient id="cp-sk" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#0a0b12"/><stop offset=".35" stop-color="#1d1520"/><stop offset=".62" stop-color="#4f2818"/><stop offset=".8" stop-color="#9a4c20"/><stop offset="1" stop-color="#140d0a"/></linearGradient>' +
      '<radialGradient id="cp-eg"><stop stop-color="#ffb24d" stop-opacity=".85"/><stop offset="1" stop-color="#ffb24d" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="cp-smk" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#fff2df" stop-opacity=".5"/><stop offset=".6" stop-color="#e8d8c4" stop-opacity=".18"/><stop offset="1" stop-color="#e8d8c4" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="cp-txt" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff7ea"/><stop offset=".75" stop-color="#f4ebdf" stop-opacity=".8"/><stop offset="1" stop-color="#f4ebdf" stop-opacity=".1"/></linearGradient>' +
      '<filter id="cp-wisp" x="-60%" y="-20%" width="220%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".018 .045" numOctaves="3" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="46" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation="3.2"/></filter>' +
      '<filter id="cp-smt" x="-15%" y="-40%" width="130%" height="180%"><feTurbulence type="fractalNoise" baseFrequency=".02 .06" numOctaves="3" seed="9" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="11" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".5" result="b"/><feGaussianBlur in="d" stdDeviation="10" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="b"/></feMerge></filter>' +
      '<linearGradient id="cp-fd" x1="0" y1="0" x2="0" y2="1"><stop offset=".78" stop-color="#140f0c" stop-opacity="0"/><stop offset="1" stop-color="#140f0c"/></linearGradient>' +
      '</defs>';
    return '<div class="cp" aria-hidden="true">' +
      '<svg class="cp-bg" viewBox="0 0 390 360" preserveAspectRatio="xMidYMax slice" focusable="false">' + defs +
        '<rect width="390" height="400" fill="url(#cp-sk)"/><g fill="#fff">' + stars + '</g>' +
        '<path d="' + ridge(242, 70, 80, 2) + '" fill="#3a1d18"/><path d="' + ridge(270, 46, 55, 4) + '" fill="#26130f"/><path d="' + ridge(296, 22, 36, 6) + '" fill="#190d0b"/>' +
        lights + '<path d="M0 350C90 342 160 356 230 346S340 338 390 344" stroke="#7fb1c2" stroke-opacity=".35" stroke-width="2" fill="none"/>' +
        lm + '<rect width="390" height="400" fill="url(#cp-fd)"/>' +
      '</svg>' +
      '<svg class="cp-smoke" viewBox="0 0 390 360" preserveAspectRatio="xMidYMax slice" focusable="false">' +
        '<g filter="url(#cp-wisp)">' + smoke + '</g>' +
        '<text x="195" y="128" text-anchor="middle" font-family="Syne,Unbounded,sans-serif" font-weight="800" font-size="62" textLength="' + tl + '" lengthAdjust="spacingAndGlyphs" fill="url(#cp-txt)" filter="url(#cp-smt)">' + esc(name) + '</text>' +
      '</svg>' +
      '<svg class="cp-glow" viewBox="0 0 390 360" preserveAspectRatio="xMidYMax slice" focusable="false">' + glow + '</svg>' +
    '</div>';
  }

  /* ------------------------------------------------------------------ */
  /* Dijelovi                                                            */
  /* ------------------------------------------------------------------ */

  function coal(letter, cls) { return '<span class="bc-coal' + (cls ? ' ' + cls : '') + '" aria-hidden="true">' + esc(letter) + '</span>'; }

  function extLinks(b) {
    return (b.instagram ? '<a class="bl-ext" href="https://www.instagram.com/' + esc(b.instagram) + '/" rel="noopener" target="_blank" aria-label="Instagram: ' + esc(b.name) + '">' + ic('insta') + '</a>' : '') +
      (!b.instagram && b.website ? '<a class="bl-ext" href="' + esc(b.website) + '" rel="noopener" target="_blank" aria-label="' + esc(tx('website')) + ': ' + esc(b.name) + '">' + ic('web') + '</a>' : '');
  }

  /** Istaknuta kartica lokala sa dogovorom (gori). */
  function litCard(b) {
    var lg = V.loungeById(b.lounge);
    var top = (lg.top || []).slice(0, 3).map(V.flavorById).filter(Boolean);
    var chips = top.map(function (f) {
      var th = V.themeFor(f);
      return '<span class="bf-chip"><i style="background:radial-gradient(circle at 35% 35%,' + th.accent + ',' + th.bg + ' 70%)"></i>' + esc(f.name) + '</span>';
    }).join('') + (lg.flavors.length > top.length ? '<span class="bf-chip bf-chip--more">+' + (lg.flavors.length - top.length) + '</span>' : '');
    return '<article class="bf" data-bar="' + esc(b.id) + '"' + (hasPin(b) ? ' data-lat="' + b.lat + '" data-lon="' + b.lon + '"' : '') + '><div class="bf__in">' +
      '<div class="bf__head">' + coal(lg.mark || lg.name.charAt(0)) +
        '<div class="bf__t"><h3>' + esc(b.name) + '</h3><p><span class="bf-tag">' + esc(tx('menuTag')) + '</span>' + esc(b.area) + '<span class="bl-dist" data-dist></span></p></div>' +
        (b.closes ? '<span class="bf__st"><span class="bc-led"></span>' + esc(fill(tx('until'), { t: b.closes })) + '</span>' : '') +
      '</div>' +
      (chips ? '<div class="bf__chips">' + chips + '</div>' : '') +
      '<div class="bf__foot"><small>' + esc(tx('flavors')(lg.flavors.length)) + (lg.mixes && lg.mixes.length ? ' · ' + esc(tx('mixes')) : '') + '</small>' +
        '<a class="bf__go" href="' + V.urlFor(MSP.lang, 'lounge', lg.id) + '">' + esc(tx('openMenu')) + '<i aria-hidden="true">' + V.icon('arrowRight') + '</i></a></div>' +
    '</div></article>';
  }

  /** Red lokala bez dogovora. */
  function barRow(b, n) {
    return '<li class="bl" data-bar="' + esc(b.id) + '"' + (hasPin(b) ? ' data-lat="' + b.lat + '" data-lon="' + b.lon + '"' : '') + '>' +
      '<span class="bl-n" aria-hidden="true"><b>' + (n < 10 ? '0' : '') + n + '</b></span>' +
      '<div class="bl-t"><h3>' + esc(b.name) + '</h3><p>' + esc(b.area) + (b.address && b.address !== b.area ? ' · ' + esc(b.address) : '') +
        '<span class="bl-dist" data-dist></span>' + (hasPin(b) ? '' : '<span class="bl-nopin"> · ' + esc(tx('noPin')) + '</span>') + '</p></div>' +
      '<div class="bl-act">' + extLinks(b) +
        (hasPin(b) ? '<button type="button" class="bl-ext bl-onmap" data-onmap="' + esc(b.id) + '" aria-label="' + esc(tx('onMap')) + ': ' + esc(b.name) + '" hidden>' + ic('pin') + '</button>' : '') +
        '<a class="bl-go" href="' + esc(V.barDirections(b)) + '" rel="noopener" target="_blank">' + ic('route') + '<span>' + esc(tx('directions')) + '</span></a>' +
      '</div></li>';
  }

  function ownerBox(c) {
    var lit = c ? V.barsOf(c).some(isLit) : true;
    var demo = (V.lounges ? V.lounges() : []).filter(function (l) { return l.demo; })[0];
    return '<aside class="bo">' + '<span class="bc-led bc-led--off" aria-hidden="true"></span>' +
      '<p>' + (c && !lit ? esc(fill(tx('ownerFirst'), { loc: cityLoc(c) })) : '<b>' + esc(tx('ownerQ')) + '</b> ' + esc(tx('ownerA'))) + '</p>' +
      '<p class="bo__links"><a href="' + V.url('loungeInfo') + '">' + esc(tx('ownerMore')) + '</a>' +
        (demo ? '<a href="' + V.urlFor(MSP.lang, 'lounge', demo.id) + '">' + esc(tx('demo')) + '</a>' : '') + '</p>' +
    '</aside>';
  }

  function missingBox() {
    return '<p class="bm-miss">' + esc(tx('missing')) + ' <a href="' + V.url('about') + '#kontakt">' + esc(tx('missingCta')) + '</a></p>';
  }

  function andList(arr) {
    if (arr.length < 2) return arr.join('');
    return arr.slice(0, -1).join(', ') + MSP.and() + arr[arr.length - 1];
  }

  /* ------------------------------------------------------------------ */
  /* Stranica: BiH                                                       */
  /* ------------------------------------------------------------------ */

  function pageBars(crumbs) {
    var pages = V.barCityPages();
    var all = V.allBars();
    var cities = V.barCities().filter(function (c) { return V.barsOf(c).length; });
    var lit = all.filter(isLit).length;
    var areas = areasOf(all).length;
    var max = pages.length ? V.barsOf(pages[0]).length : 1;
    var rows = pages.map(function (c) {
      var n = V.barsOf(c).length;
      return '<li><a class="bc-row" data-city="' + esc(c.id) + '" href="' + V.barCityUrl(c) + '">' +
        '<span class="bc-row__bar" aria-hidden="true"><i style="height:' + Math.round(n / max * 100) + '%"></i></span>' +
        '<b>' + esc(V.barCityName(c)) + '</b><span class="bc-row__n">' + esc(tx('bars')(n)) + '</span>' + V.icon('arrowRight') + '</a></li>';
    }).join('');
    var others = cities.filter(function (c) { return pages.indexOf(c) === -1; });
    var otherHtml = others.length ? '<section class="bx-sec" aria-labelledby="bx-other"><h2 class="bx-h" id="bx-other">' + esc(tx('otherCities')) + '</h2><p class="bx-lead">' + esc(tx('otherLead')) + '</p>' +
      others.map(function (c) {
        return '<h3 class="bx-city">' + esc(V.barCityName(c)) + ' <small>' + esc(tx('bars')(V.barsOf(c).length)) + '</small></h3><ul class="bl-list" role="list">' + V.barsOf(c).map(function (b, i) { return barRow(b, i + 1); }).join('') + '</ul>';
      }).join('') + '</section>' : '';
    var sorted = cities.slice().sort(function (a, b) { return V.barsOf(b).length - V.barsOf(a).length; });
    var faq = [];
    if (sorted.length >= 3) faq.push({ q: tx('q1'), a: fill(tx('a1'), { c1: V.barCityName(sorted[0]), n1: V.barsOf(sorted[0]).length, c2: V.barCityName(sorted[1]), n2: V.barsOf(sorted[1]).length, c3: V.barCityName(sorted[2]), n3: V.barsOf(sorted[2]).length, cities: andList(sorted.map(function (c) { return V.barCityName(c); })) }) });
    faq.push({ q: tx('q2'), a: tx('a2') });
    // za "Najbliži lokal": lokali sa lokacijom (grad, adresa stranice grada)
    var near = all.filter(hasPin).map(function (b) {
      var c = V.barCityById(b.city);
      return { n: b.name, c: V.barCityName(c), a: b.area, la: b.lat, lo: b.lon, u: pages.indexOf(c) !== -1 ? V.barCityUrl(c) : '', d: V.barDirections(b) };
    });
    return (
      '<div class="bx" id="bx">' +
        '<header class="bx-hero container">' + crumbs +
          '<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(tx('eyebrow')) + '</p>' +
          '<h1 class="bx-title">' + esc(tx('title1')) + '<br><em>' + esc(tx('title2')) + '</em></h1>' +
          '<p class="bx-lead">' + esc(tx('lead')) + '</p>' +
        '</header>' +
        '<div class="bx-stage">' + bihMap() + '</div>' +
        '<div class="container bx-body">' +
          '<div class="bx-stats">' +
            '<div><b data-count="' + all.length + '">' + all.length + '</b><span>' + esc(tx('statBars')) + '</span></div>' +
            '<div><b data-count="' + cities.length + '">' + cities.length + '</b><span>' + esc(tx('statCities')) + '</span></div>' +
            (lit ? '<div class="is-hot"><b data-count="' + lit + '">' + lit + '</b><span>' + esc(tx('statMenu')) + '</span></div>' : '<div><b data-count="' + areas + '">' + areas + '</b><span>' + esc(tx('statAreas')) + '</span></div>') +
          '</div>' +
          '<button type="button" class="bx-near" id="bx-near"><span><b>' + esc(tx('near')) + '</b><small id="bx-near-sub">' + esc(tx('nearSub')) + '</small></span><i aria-hidden="true"></i></button>' +
          '<p class="bx-near-res" id="bx-near-res" role="status" aria-live="polite" hidden></p>' +
          '<section class="bx-sec" aria-labelledby="bx-cities"><h2 class="bx-h" id="bx-cities">' + esc(tx('cities')) + '</h2><ul class="bc-rows" role="list">' + rows + '</ul></section>' +
          otherHtml +
          ownerBox(null) + missingBox() +
          '<p class="bm-osm">' + esc(tx('osm')) + '</p>' +
        '</div>' +
        V.faqSection(faq, 'bx-faq') +
        '<script type="application/json" id="bx-data">' + JSON.stringify({ near: near, t: { busy: tx('nearBusy'), fail: tx('nearFail'), res: tx('nearRes'), dir: tx('directions') } }).replace(/</g, '\\u003c') + '</script>' +
      '</div>'
    );
  }

  /* ------------------------------------------------------------------ */
  /* Stranica: grad                                                      */
  /* ------------------------------------------------------------------ */

  function pageBarCity(c, crumbs) {
    var list = V.barsOf(c);
    var lit = list.filter(isLit), plain = list.filter(function (b) { return !isLit(b); });
    var pins = list.filter(hasPin);
    var pages = V.barCityPages();
    var tabs = '<nav class="ct-tabs" aria-label="' + esc(tx('cities')) + '">' +
      '<h1 class="ct-cur">' + esc(V.barCityName(c)) + '<sup>' + list.length + '</sup></h1>' +
      pages.filter(function (o) { return o !== c; }).map(function (o) { return '<a href="' + V.barCityUrl(o) + '">' + esc(V.barCityName(o)) + '<sup>' + V.barsOf(o).length + '</sup></a>'; }).join('') +
      '<a class="ct-all" href="' + V.url('bars') + '">' + esc(tx('allCities')) + '</a>' +
    '</nav>';
    var ctl = '<div class="ct-ctl" id="ct-ctl">' +
      (pins.length ? '<button type="button" class="ct-chip" id="ct-near" aria-pressed="false">' + ic('near') + esc(tx('nearest')) + '</button>' : '') +
      (lit.length ? '<button type="button" class="ct-chip" id="ct-lit" aria-pressed="false">' + esc(tx('withMenu')) + '</button>' : '') +
      (pins.length ? '<div class="ct-seg" role="group" aria-label="' + esc(tx('list')) + ' / ' + esc(tx('map')) + '"><button type="button" class="is-on" data-view="list" aria-pressed="true">' + ic('list') + esc(tx('list')) + '</button><button type="button" data-view="map" aria-pressed="false">' + ic('map') + esc(tx('map')) + '</button></div>' : '') +
    '</div>';
    var mapData = {
      city: { lat: c.lat, lon: c.lon, zoom: c.zoom || 15 },
      bars: pins.map(function (b) { return { id: b.id, n: b.name, a: b.area, la: b.lat, lo: b.lon, lit: isLit(b) ? 1 : 0, m: isLit(b) ? (V.loungeById(b.lounge).mark || b.name.charAt(0)) : '', d: V.barDirections(b), u: isLit(b) ? V.urlFor(MSP.lang, 'lounge', b.lounge) : '', ig: b.instagram || '' }; }),
      t: { dir: tx('directions'), menu: tx('openMenu'), min: tx('min'), close: tx('closeCard'), zin: tx('zoomIn'), zout: tx('zoomOut'), you: tx('legendYou'), fail: tx('nearFail'), busy: tx('nearBusy') }
    };
    var areas = areasOf(list);
    var faq = [];
    if (areas.length) {
      faq.push({ q: fill(tx('q3'), { loc: cityLoc(c) }), a: areas.length > 1 ? fill(tx('a3'), { area: areas[0][0], k: areas[0][1], others: andList(areas.slice(1).map(function (a) { return a[0]; })) }) : fill(tx('a3one'), { area: areas[0][0] }) });
    }
    faq.push({ q: tx('q4'), a: tx('a4') });
    return (
      '<div class="ct" id="ct" data-city="' + esc(c.id) + '">' +
        cityPoster(c) +
        '<div class="container ct-body">' +
          tabs + '<p class="ct-lead">' + esc(fill(tx(pins.length ? 'cityLead' : 'cityLeadNoMap'), { n: tx('bars')(list.length), loc: cityLoc(c) })) + '</p>' + ctl +
          '<div class="ct-view" id="ct-list">' +
            (lit.length ? '<div class="bf-list">' + lit.map(litCard).join('') + '</div>' : '') +
            '<h2 class="bx-h bx-h--sm"><span>' + esc(lit.length ? tx('otherBars') : tx('allBars')) + '</span><span>' + plain.length + '</span></h2>' +
            '<ul class="bl-list" id="bl-list" role="list">' + plain.map(function (b, i) { return barRow(b, i + 1); }).join('') + '</ul>' +
          '</div>' +
          (pins.length ? '<div class="ct-view ct-map" id="ct-map" hidden>' +
            '<div class="ct-map__box" id="ct-mapbox" role="region" aria-label="' + esc(fill(tx('mapLabel'), { city: V.barCityName(c) })) + '"></div>' +
            '<p class="ct-legend"><span><i class="lg-lit"></i>' + esc(tx('legendMenu')) + '</span><span><i class="lg-bar"></i>' + esc(tx('legendBar')) + '</span><span><i class="lg-you"></i>' + esc(tx('legendYou')) + '</span></p>' +
            '<div class="ct-card" id="ct-card" hidden></div>' +
          '</div>' : '') +
          ownerBox(c) + missingBox() +
          '<p class="bm-osm">' + esc(tx('osm')) + '</p>' +
        '</div>' +
        V.faqSection(faq, 'ct-faq') +
        '<script type="application/json" id="ct-data">' + JSON.stringify(mapData).replace(/</g, '\\u003c') + '</script>' +
      '</div>'
    );
  }


  /* ------------------------------------------------------------------ */
  /* Vrh stranice lounge-a (lokal sa dogovorom)                          */
  /* ------------------------------------------------------------------ */

  /** Užareni logo, oznaka, ime, adresa, traka (radno vrijeme, okusi, miksevi) i dugmad (put, poziv, Instagram). */
  V.loungeHero = function (lg) {
    var bar = V.allBars().filter(function (b) { return b.lounge === lg.id; })[0] || null;
    var addr = [bar && bar.address, bar && V.barCityById(bar.city) ? V.barCityName(V.barCityById(bar.city)) : ''].filter(Boolean).join(', ');
    var acts = [];
    if (bar) acts.push('<a class="lp-act lp-act--go" href="' + esc(V.barDirections(bar)) + '" target="_blank" rel="noopener">' + ic('route') + '<span>' + esc(tx('directions')) + '</span></a>');
    if (lg.phone) acts.push('<a class="lp-act" href="tel:' + esc(lg.phone.replace(/[^+\d]/g, '')) + '">' + esc(tx('call')) + '</a>');
    var ig = lg.instagram || (bar && bar.instagram);
    if (ig) acts.push('<a class="lp-act lp-act--ic" href="https://www.instagram.com/' + esc(ig) + '/" target="_blank" rel="noopener" aria-label="Instagram">' + ic('insta') + '</a>');
    var mixes = (lg.mixes || []).length;
    return '<header class="lp-hero">' +
      '<span class="lp-coal" aria-hidden="true"><b>' + esc(lg.mark || lg.name.charAt(0)) + '</b></span>' +
      '<p class="lp-badge"><i aria-hidden="true">' + V.icon('check') + '</i>' + esc(lg.demo ? tx('demoBadge') : tx('verified')) + '</p>' +
      '<h1 class="lp-name">' + esc(lg.name) + '</h1>' +
      '<p class="lp-sub">' + esc(MSP.L(lg.tagline)) + (addr ? ' · ' + esc(addr) : '') + '</p>' +
      '<div class="lp-stats">' +
        (lg.closes ? '<div><b><span class="bc-led" aria-hidden="true"></span>' + esc(lg.closes) + '</b><span>' + esc(tx('openUntil')) + '</span></div>' : '<div class="lp-stats__txt"><b><span class="bc-led" aria-hidden="true"></span>' + esc(MSP.L(lg.hours)) + '</b></div>') +
        '<div><b>' + lg.flavors.length + '</b><span>' + esc(tx('okusa')) + '</span></div>' +
        (mixes ? '<div><b>' + mixes + '</b><span>' + esc(tx('miksova')) + '</span></div>' : '') +
      '</div>' +
      (acts.length ? '<div class="lp-acts">' + acts.join('') + '</div>' : '') +
    '</header>';
  };

  /* ------------------------------------------------------------------ */
  /* Ulaz za views.js / build.mjs                                        */
  /* ------------------------------------------------------------------ */

  V.barsCrumbs = function (desc, home) {
    var top = { name: tx('nav'), url: V.url('bars') };
    if (desc.page === 'bars') return [home, top];
    return [home, top, { name: V.barCityName(desc.city), url: V.barCityUrl(desc.city) }];
  };

  V.pageBarsAll = function (desc, crumbs) {
    var all = V.allBars();
    if (desc.page === 'bars') {
      return { main: pageBars(crumbs), title: tx('metaTitle'), description: V.clipText(fill(tx('metaDesc'), { n: all.length })) };
    }
    var c = desc.city, list = V.barsOf(c);
    var areas = areasOf(list).slice(0, 3).map(function (a) { return a[0]; });
    var d = fill(tx('cityDesc'), { loc: cityLoc(c), n: tx('bars')(list.length), areas: andList(areas) });
    return {
      main: pageBarCity(c, crumbs),
      title: fill(tx('cityTitle'), { city: V.barCityName(c), n: tx('bars')(list.length) }),
      description: V.clipText(d)
    };
  };

  /** Lokali grada za strukturirane podatke (ItemList sa lokalima). */
  V.barsLd = function (desc) {
    var list = desc.page === 'barCity' ? V.barsOf(desc.city) : [];
    return list.map(function (b) {
      var c = V.barCityById(b.city);
      var o = { '@type': 'BarOrPub', name: b.name, address: { '@type': 'PostalAddress', streetAddress: b.address || b.area, addressLocality: c.name.bs, addressCountry: 'BA' } };
      if (hasPin(b)) o.geo = { '@type': 'GeoCoordinates', latitude: b.lat, longitude: b.lon };
      var same = [];
      if (b.instagram) same.push('https://www.instagram.com/' + b.instagram + '/');
      if (b.website) same.push(b.website);
      if (same.length) o.sameAs = same;
      return o;
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
