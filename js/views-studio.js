/*
 * MyShishapedia - Bowl Studio: stranica (HTML koji pravi build.mjs) i tekstovi (isti fajl koristi js/studio.js u browseru).
 *
 *   /bs/bowl-studio/   uvod, šta se radi u studiju, pitanja. Dugme "Otvori Bowl Studio" otvara aplikaciju preko
 *                      cijelog ekrana (sloj #bs), koju pokreće js/studio.js, a 3D sto crta js/studio3d.js.
 *
 * Ikone su linijske (Lucide stil, ISC licenca), sve iste debljine; nigdje nema emojija.
 * Ovisi o: views.js (V).
 */
(function (root) {
  'use strict';

  var MSP = root.MSP;
  var V = MSP.V;
  var esc = V.esc;

  var SEGS = { bs: 'bowl-studio', en: 'bowl-studio', de: 'bowl-studio', ru: 'bowl-studio' };
  Object.keys(SEGS).forEach(function (l) { if (V.SEG[l]) V.SEG[l].studio = SEGS[l]; });

  /* ------------------------------------------------------------------ */
  /* Ikone                                                               */
  /* ------------------------------------------------------------------ */

  var IC = {
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    next: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    tip: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    warn: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    layers: '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    blend: '<path d="m18 14 4 4-4 4"/><path d="m18 2 4 4-4 4"/><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"/>',
    tap: '<path d="M22 14a8 8 0 0 1-8 8"/><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    timer: '<path d="M10 2h4"/><path d="m12 14 3-3"/><circle cx="12" cy="14" r="8"/>',
    video: '<path d="m16 13 5.22 3.48a.5.5 0 0 0 .78-.42V7.87a.5.5 0 0 0-.75-.43L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    redo: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    tin: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/><path d="M4 11c0 1.66 3.58 3 8 3s8-1.34 8-3"/>',
    foil: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="9" r=".6"/><circle cx="9" cy="13" r=".6"/><circle cx="15" cy="13" r=".6"/><circle cx="12" cy="16" r=".6"/>',
    smoke: '<path d="M7 20.5c-2.2-3 2.2-4.5 0-7.5s1.5-5 1.5-5"/><path d="M12 21.5c-2.3-3.4 2.6-4.9.4-8.3s1.5-5.6 1.5-5.6"/><path d="M17 20c-1.9-2.6 1.9-3.8 0-6.4s1.1-4.1 1.1-4.1"/>',
    star: '<path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/><circle cx="12" cy="12" r="4"/>',
    swap: '<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>',
    device: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    // glave: obris sa strane (isti potez kao ostale ikone)
    egypt: '<path d="M3.5 5h17"/><path d="M5 5l2.4 8.5h9.2L19 5"/><path d="M10 13.5v3.5h4v-3.5"/><path d="M8.5 21h7"/><path d="M12 17v4"/><path d="M9 8h.01M12 8h.01M15 8h.01"/>',
    phunnel: '<path d="M3.5 5h17"/><path d="M5 5l2.4 8.5h9.2L19 5"/><path d="M12 13.5V7.5"/><path d="M10 13.5v3.5h4v-3.5"/><path d="M8.5 21h7"/><path d="M12 17v4"/>',
    silicone: '<path d="M4 5h16"/><path d="M5 5c0 4.5 2 8.5 4.5 8.5h5C17 13.5 19 9.5 19 5"/><path d="M7 9h10"/><path d="M10 13.5V17h4v-3.5"/><path d="M8.5 21h7"/><path d="M12 17v4"/>'
  };
  function ic(name, cls) {
    return '<svg class="bs-ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + (IC[name] || '') + '</svg>';
  }
  V.studioIcon = ic;

  /** Znak MyShishapedije (tri pramena dima u bojama brenda). */
  function mark(cls) {
    return '<svg class="bs-mark' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path stroke="#f2a33c" d="M7 20.5c-2.2-3 2.2-4.5 0-7.5s1.5-5 1.5-5"/><path stroke="#d6ad6e" d="M12 21.5c-2.3-3.4 2.6-4.9.4-8.3s1.5-5.6 1.5-5.6"/><path stroke="#9a6a2e" d="M17 20c-1.9-2.6 1.9-3.8 0-6.4s1.1-4.1 1.1-4.1"/></svg>';
  }
  V.studioMark = mark;

  /* ------------------------------------------------------------------ */
  /* Tekstovi                                                            */
  /* ------------------------------------------------------------------ */

  var TX = {
    bs: {
      eyebrow: 'Novo na MyShishapediji', h1: 'Bowl Studio',
      lead: 'Napuni glavu nargile kao profesionalac, korak po korak, na pravom stolu u 3D. Izaberi glavu i okus iz enciklopedije, pa vidi šta svaki izbor mijenja.',
      cta: 'Otvori Bowl Studio', note: 'Radi na telefonu, tabletu i računaru. Bez registracije.',
      artAlt: 'Drveni sto sa glavom nargile, limenkom duhana, folijom, HMD-om i užarenim ugljevima',
      stepsTitle: 'Šta radiš u studiju',
      steps: [
        { t: 'Glava', d: 'Egipatska, phunnel ili silikonska. Svaka drži duhan i toplotu na svoj način.' },
        { t: 'Okus', d: 'Bilo koji okus iz enciklopedije, ili miks dva okusa.' },
        { t: 'Miješanje', d: 'Klasično, oba okusa izmiješana, ili slojevito, jedan preko drugog.' },
        { t: 'Punjenje', d: 'Rastresito ili gušće, sa visinom duhana u odnosu na ivicu.' },
        { t: 'Folija ili HMD', d: 'Buši rupice po svom rasporedu ili stavi HMD i podesi otvore.' },
        { t: 'Ugljevi', d: 'Koliko ugljeva i gdje ih staviti da duhan ne pregori.' },
        { t: 'Dim', d: 'Ubrzana sesija: vidiš kad treba pomjeriti ugljeve.' },
        { t: 'Rezultat', d: 'Kartica sa ocjenom i savjetom, spremna za dijeljenje.' }
      ],
      credit: 'Model egipatske glave: „Serp hookah bowl“, autor matvey.kyl (Sketchfab), licenca CC BY 4.0.',
      noJs: 'Bowl Studio treba JavaScript i 3D prikaz u pregledniku.',
      faq: [
        { q: 'Šta je Bowl Studio?', a: 'Interaktivni vodič za punjenje glave nargile. Na 3D stolu biraš glavu i okus, puniš glavu, stavljaš foliju ili HMD i ugljeve, a na kraju dobiješ ocjenu i savjet.' },
        { q: 'Da li moram nešto instalirati?', a: 'Ne. Bowl Studio radi u pregledniku na telefonu, tabletu i računaru, bez registracije.' },
        { q: 'Koja glava je najbolja za početnike?', a: 'Phunnel glava je najlakša za početak: sok od melase ostaje u glavi, a toplota je ujednačenija. Egipatska je klasika za svijetli list, a silikonska ne puca kad padne.' },
        { q: 'Kako se miješaju dva okusa?', a: 'Dva su načina. Klasično: oba okusa se izmiješaju prije punjenja, pa je okus isti od početka do kraja. Slojevito: jedan okus ide na dno, drugi preko njega, pa se okus mijenja tokom sesije.' }
      ],
      metaTitle: 'Bowl Studio: napuni glavu nargile u 3D, korak po korak | MyShishapedia',
      metaDesc: 'Interaktivni 3D vodič za punjenje glave nargile: izaberi glavu i okus, miješaj ili slaži slojeve, folija ili HMD, ugljevi. Ocjena i savjet na kraju.',
      app: {
        brand: 'Bowl Studio', close: 'Zatvori studio', back: 'Nazad', stepOf: 'Korak {n} od {t}',
        names: ['Glava', 'Okus', 'Miješanje', 'Punjenje', 'Folija ili HMD', 'Ugljevi', 'Dim', 'Rezultat'],
        loading: 'Postavljam sto…', err: 'Tvoj preglednik ne može prikazati 3D sto, ali sve korake možeš proći i ovako.', errLost: '3D prikaz je stao. Zatvori i ponovo otvori studio.',
        intro: {
          title: 'Tvoj sto je spreman', lead: 'Glava, duhan, folija, HMD i ugljevi. Prođi korak po korak, kao pravi majstor.',
          tags: ['3 vrste glava', 'Svi okusi iz enciklopedije', 'Folija ili HMD', 'Ocjena na kraju'], start: 'Počni'
        },
        bowl: {
          title: 'Izaberi glavu', hint: 'Dodirni glavu na stolu ili izaberi ispod', cta: 'Nastavi s ovom glavom',
          items: {
            egypt: { name: 'Egipatska', short: 'rupice na dnu', info: 'Klasika sa više rupica na dnu. Dobra za svijetli list i rastresito punjenje, ali sok od melase može kapati u nargilu.' },
            phunnel: { name: 'Phunnel', short: 'sok ostaje gore', info: 'Jedna rupa na vrhu stuba u sredini, pa sok ostaje u glavi. Toplota je ujednačenija i duže traje. Otvor na stubu mora ostati slobodan.' },
            silicone: { name: 'Silikonska', short: 'ne puca', info: 'Ne puca kad padne i lako se pere. Duhan leži na metalnoj pločici sa rupicama, a silikon slabije zadržava toplotu.' }
          }
        },
        flavor: {
          title: 'Izaberi okus', titleMix: 'Tvoj miks', change: 'Promijeni', remove: 'Ukloni okus', add: 'Dodaj drugi okus za miks',
          leaf: { light: 'Svijetli list', dark: 'Tamni list' }, mixNote: 'Kako ćeš ih spojiti, biraš u sljedećem koraku.',
          pick: 'Izaberi okus', pickSecond: 'Izaberi drugi okus', search: 'Traži okus ili brend', popular: 'Popularno', results: 'Rezultati', none: 'Nema takvog okusa. Probaj drugi naziv ili brend.',
          sameLeaf: 'Oba okusa su isti list, pa se lijepo slažu.', mixedLeaf: 'Jedan je svijetli, a drugi tamni list. Tamni treba više toplote, pa ga stavi manje.',
          cta: 'Dalje', ctaOne: 'Otvori limenku'
        },
        soon: { title: 'Sljedeći korak stiže uskoro', text: 'Miješanje i punjenje glave su u izradi. Do tada možeš promijeniti glavu ili okus.', back: 'Nazad na okus' }
      }
    },
    en: {
      eyebrow: 'New on MyShishapedia', h1: 'Bowl Studio',
      lead: 'Pack a hookah bowl like a pro, step by step, on a real 3D table. Pick a bowl and a flavor from the encyclopedia and see what every choice changes.',
      cta: 'Open Bowl Studio', note: 'Works on phones, tablets and computers. No sign-up.',
      artAlt: 'Wooden table with a hookah bowl, a tobacco tin, foil, an HMD and glowing coals',
      stepsTitle: 'What you do in the studio',
      steps: [
        { t: 'Bowl', d: 'Egyptian, phunnel or silicone. Each one holds tobacco and heat in its own way.' },
        { t: 'Flavor', d: 'Any flavor from the encyclopedia, or a mix of two.' },
        { t: 'Mixing', d: 'Classic, both flavors mixed together, or layered, one on top of the other.' },
        { t: 'Packing', d: 'Fluffy or denser, with the tobacco height against the rim.' },
        { t: 'Foil or HMD', d: 'Poke holes in your own pattern or put on an HMD and set the vents.' },
        { t: 'Coals', d: 'How many coals and where to put them so the tobacco does not burn.' },
        { t: 'Smoke', d: 'A sped-up session: you see when it is time to move the coals.' },
        { t: 'Result', d: 'A card with a score and a tip, ready to share.' }
      ],
      credit: 'Egyptian bowl model: "Serp hookah bowl" by matvey.kyl (Sketchfab), licensed CC BY 4.0.',
      noJs: 'Bowl Studio needs JavaScript and 3D support in your browser.',
      faq: [
        { q: 'What is Bowl Studio?', a: 'An interactive guide to packing a hookah bowl. On a 3D table you pick a bowl and a flavor, pack the bowl, add foil or an HMD and coals, and get a score and a tip at the end.' },
        { q: 'Do I need to install anything?', a: 'No. Bowl Studio runs in the browser on phones, tablets and computers, with no sign-up.' },
        { q: 'Which bowl is best for beginners?', a: 'A phunnel bowl is the easiest start: the molasses juice stays in the bowl and the heat is more even. The Egyptian bowl is the classic for blonde leaf, and a silicone bowl does not crack when dropped.' },
        { q: 'How do you mix two flavors?', a: 'There are two ways. Classic: both flavors are mixed before packing, so the taste is the same from start to finish. Layered: one flavor goes at the bottom and the other on top, so the taste changes during the session.' }
      ],
      metaTitle: 'Bowl Studio: pack a hookah bowl in 3D, step by step | MyShishapedia',
      metaDesc: 'An interactive 3D guide to packing a hookah bowl: pick a bowl and a flavor, mix or layer, foil or HMD, coals. A score and a tip at the end.',
      app: {
        brand: 'Bowl Studio', close: 'Close studio', back: 'Back', stepOf: 'Step {n} of {t}',
        names: ['Bowl', 'Flavor', 'Mixing', 'Packing', 'Foil or HMD', 'Coals', 'Smoke', 'Result'],
        loading: 'Setting the table…', err: 'Your browser cannot show the 3D table, but you can still go through every step.', errLost: 'The 3D view stopped. Close and reopen the studio.',
        intro: {
          title: 'Your table is ready', lead: 'Bowl, tobacco, foil, HMD and coals. Go step by step, like a real pro.',
          tags: ['3 bowl types', 'Every flavor in the encyclopedia', 'Foil or HMD', 'A score at the end'], start: 'Start'
        },
        bowl: {
          title: 'Pick a bowl', hint: 'Tap a bowl on the table or pick one below', cta: 'Continue with this bowl',
          items: {
            egypt: { name: 'Egyptian', short: 'holes at the bottom', info: 'The classic with several holes at the bottom. Good for blonde leaf and fluffy packs, but molasses juice can drip into the hookah.' },
            phunnel: { name: 'Phunnel', short: 'juice stays up', info: 'One hole on top of a center spire, so the juice stays in the bowl. The heat is more even and it lasts longer. Keep the spire hole uncovered.' },
            silicone: { name: 'Silicone', short: 'does not crack', info: 'It does not crack when dropped and is easy to wash. The tobacco sits on a metal plate with holes, and silicone holds heat less well.' }
          }
        },
        flavor: {
          title: 'Pick a flavor', titleMix: 'Your mix', change: 'Change', remove: 'Remove flavor', add: 'Add a second flavor for a mix',
          leaf: { light: 'Blonde leaf', dark: 'Dark leaf' }, mixNote: 'You choose how to combine them in the next step.',
          pick: 'Pick a flavor', pickSecond: 'Pick a second flavor', search: 'Search a flavor or brand', popular: 'Popular', results: 'Results', none: 'No such flavor. Try another name or brand.',
          sameLeaf: 'Both flavors are the same leaf, so they work well together.', mixedLeaf: 'One is blonde and the other dark leaf. Dark leaf needs more heat, so use less of it.',
          cta: 'Next', ctaOne: 'Open the tin'
        },
        soon: { title: 'The next step is coming soon', text: 'Mixing and packing are being built. Until then you can change the bowl or the flavor.', back: 'Back to flavor' }
      }
    },
    de: {
      eyebrow: 'Neu auf MyShishapedia', h1: 'Bowl Studio',
      lead: 'Bau einen Shisha-Kopf wie ein Profi, Schritt für Schritt, auf einem echten 3D-Tisch. Wähle einen Kopf und einen Tabak aus der Enzyklopädie und sieh, was jede Wahl verändert.',
      cta: 'Bowl Studio öffnen', note: 'Funktioniert auf Handy, Tablet und Computer. Ohne Anmeldung.',
      artAlt: 'Holztisch mit Shisha-Kopf, Tabakdose, Alufolie, HMD und glühenden Kohlen',
      stepsTitle: 'Was du im Studio machst',
      steps: [
        { t: 'Kopf', d: 'Ägyptisch, Phunnel oder Silikon. Jeder hält Tabak und Hitze auf seine Weise.' },
        { t: 'Tabak', d: 'Jeder Tabak aus der Enzyklopädie oder ein Mix aus zwei.' },
        { t: 'Mischen', d: 'Klassisch, beide Sorten vermischt, oder in Schichten, eine über der anderen.' },
        { t: 'Befüllen', d: 'Locker oder dichter, mit der Tabakhöhe zum Rand.' },
        { t: 'Folie oder HMD', d: 'Stich Löcher in deinem Muster oder setz ein HMD auf und stell die Öffnungen ein.' },
        { t: 'Kohlen', d: 'Wie viele Kohlen und wohin, damit der Tabak nicht verbrennt.' },
        { t: 'Rauch', d: 'Eine beschleunigte Session: du siehst, wann die Kohlen umgesetzt werden müssen.' },
        { t: 'Ergebnis', d: 'Eine Karte mit Bewertung und Tipp, bereit zum Teilen.' }
      ],
      credit: 'Modell des ägyptischen Kopfes: „Serp hookah bowl“ von matvey.kyl (Sketchfab), Lizenz CC BY 4.0.',
      noJs: 'Bowl Studio braucht JavaScript und 3D im Browser.',
      faq: [
        { q: 'Was ist Bowl Studio?', a: 'Eine interaktive Anleitung zum Befüllen eines Shisha-Kopfes. Auf einem 3D-Tisch wählst du Kopf und Tabak, befüllst den Kopf, legst Folie oder ein HMD und Kohlen auf und bekommst am Ende eine Bewertung und einen Tipp.' },
        { q: 'Muss ich etwas installieren?', a: 'Nein. Bowl Studio läuft im Browser auf Handy, Tablet und Computer, ohne Anmeldung.' },
        { q: 'Welcher Kopf ist für Anfänger am besten?', a: 'Ein Phunnel-Kopf ist der einfachste Einstieg: die Melasse bleibt im Kopf und die Hitze ist gleichmäßiger. Der ägyptische Kopf ist der Klassiker für hellen Tabak, und ein Silikonkopf zerbricht nicht, wenn er herunterfällt.' },
        { q: 'Wie mischt man zwei Sorten?', a: 'Es gibt zwei Wege. Klassisch: beide Sorten werden vor dem Befüllen vermischt, der Geschmack bleibt von Anfang bis Ende gleich. In Schichten: eine Sorte kommt nach unten, die andere darüber, und der Geschmack ändert sich während der Session.' }
      ],
      metaTitle: 'Bowl Studio: Shisha-Kopf in 3D befüllen, Schritt für Schritt | MyShishapedia',
      metaDesc: 'Interaktive 3D-Anleitung zum Kopfbau: Kopf und Tabak wählen, mischen oder schichten, Folie oder HMD, Kohlen. Am Ende Bewertung und Tipp.',
      app: {
        brand: 'Bowl Studio', close: 'Studio schließen', back: 'Zurück', stepOf: 'Schritt {n} von {t}',
        names: ['Kopf', 'Tabak', 'Mischen', 'Befüllen', 'Folie oder HMD', 'Kohlen', 'Rauch', 'Ergebnis'],
        loading: 'Der Tisch wird gedeckt…', err: 'Dein Browser kann den 3D-Tisch nicht zeigen, aber du kannst trotzdem alle Schritte machen.', errLost: 'Die 3D-Ansicht ist stehen geblieben. Schließ das Studio und öffne es neu.',
        intro: {
          title: 'Dein Tisch ist bereit', lead: 'Kopf, Tabak, Folie, HMD und Kohlen. Geh Schritt für Schritt vor, wie ein echter Profi.',
          tags: ['3 Kopfarten', 'Alle Tabake der Enzyklopädie', 'Folie oder HMD', 'Bewertung am Ende'], start: 'Los geht’s'
        },
        bowl: {
          title: 'Wähle einen Kopf', hint: 'Tippe auf einen Kopf am Tisch oder wähle unten', cta: 'Weiter mit diesem Kopf',
          items: {
            egypt: { name: 'Ägyptisch', short: 'Löcher im Boden', info: 'Der Klassiker mit mehreren Löchern im Boden. Gut für hellen Tabak und lockeres Befüllen, aber Melasse kann in die Shisha tropfen.' },
            phunnel: { name: 'Phunnel', short: 'Saft bleibt oben', info: 'Ein Loch oben auf einem Turm in der Mitte, daher bleibt der Saft im Kopf. Die Hitze ist gleichmäßiger und er hält länger. Das Turmloch muss frei bleiben.' },
            silicone: { name: 'Silikon', short: 'zerbricht nicht', info: 'Zerbricht nicht beim Herunterfallen und ist leicht zu waschen. Der Tabak liegt auf einer gelochten Metallplatte, und Silikon hält die Hitze schlechter.' }
          }
        },
        flavor: {
          title: 'Wähle einen Tabak', titleMix: 'Dein Mix', change: 'Ändern', remove: 'Tabak entfernen', add: 'Zweite Sorte für einen Mix hinzufügen',
          leaf: { light: 'Heller Tabak', dark: 'Dunkler Tabak' }, mixNote: 'Wie du sie kombinierst, wählst du im nächsten Schritt.',
          pick: 'Wähle einen Tabak', pickSecond: 'Wähle eine zweite Sorte', search: 'Tabak oder Marke suchen', popular: 'Beliebt', results: 'Ergebnisse', none: 'Keine solche Sorte. Versuch einen anderen Namen oder eine Marke.',
          sameLeaf: 'Beide Sorten sind dasselbe Blatt, sie passen gut zusammen.', mixedLeaf: 'Eine ist heller, die andere dunkler Tabak. Dunkler braucht mehr Hitze, nimm also weniger davon.',
          cta: 'Weiter', ctaOne: 'Dose öffnen'
        },
        soon: { title: 'Der nächste Schritt kommt bald', text: 'Mischen und Befüllen sind in Arbeit. Bis dahin kannst du Kopf oder Tabak ändern.', back: 'Zurück zum Tabak' }
      }
    },
    ru: {
      eyebrow: 'Новое на MyShishapedia', h1: 'Bowl Studio',
      lead: 'Забей чашу кальяна как профи, шаг за шагом, на настоящем 3D-столе. Выбери чашу и вкус из энциклопедии и посмотри, что меняет каждый выбор.',
      cta: 'Открыть Bowl Studio', note: 'Работает на телефоне, планшете и компьютере. Без регистрации.',
      artAlt: 'Деревянный стол с чашей кальяна, банкой табака, фольгой, калауд и горящими углями',
      stepsTitle: 'Что ты делаешь в студии',
      steps: [
        { t: 'Чаша', d: 'Египетская, фанел или силиконовая. Каждая держит табак и жар по-своему.' },
        { t: 'Вкус', d: 'Любой вкус из энциклопедии или микс из двух.' },
        { t: 'Смешивание', d: 'Классически, оба вкуса вместе, или слоями, один поверх другого.' },
        { t: 'Забивка', d: 'Воздушно или плотнее, с высотой табака относительно края.' },
        { t: 'Фольга или калауд', d: 'Проколи отверстия по своей схеме или поставь калауд и настрой отверстия.' },
        { t: 'Угли', d: 'Сколько углей и куда их положить, чтобы табак не пригорел.' },
        { t: 'Дым', d: 'Ускоренная сессия: видно, когда пора переставить угли.' },
        { t: 'Итог', d: 'Карточка с оценкой и советом, готовая для отправки.' }
      ],
      credit: 'Модель египетской чаши: «Serp hookah bowl», автор matvey.kyl (Sketchfab), лицензия CC BY 4.0.',
      noJs: 'Для Bowl Studio нужны JavaScript и поддержка 3D в браузере.',
      faq: [
        { q: 'Что такое Bowl Studio?', a: 'Интерактивное руководство по забивке чаши кальяна. На 3D-столе ты выбираешь чашу и вкус, забиваешь чашу, кладёшь фольгу или калауд и угли, а в конце получаешь оценку и совет.' },
        { q: 'Нужно ли что-то устанавливать?', a: 'Нет. Bowl Studio работает в браузере на телефоне, планшете и компьютере, без регистрации.' },
        { q: 'Какая чаша лучше для новичка?', a: 'Проще всего начать с фанела: сок остаётся в чаше, а жар распределяется ровнее. Египетская чаша это классика для светлого листа, а силиконовая не трескается при падении.' },
        { q: 'Как смешивать два вкуса?', a: 'Есть два способа. Классически: оба вкуса смешивают до забивки, и вкус одинаковый от начала до конца. Слоями: один вкус кладут вниз, другой сверху, и вкус меняется по ходу сессии.' }
      ],
      metaTitle: 'Bowl Studio: забей чашу кальяна в 3D, шаг за шагом | MyShishapedia',
      metaDesc: 'Интерактивное 3D-руководство по забивке чаши: выбери чашу и вкус, смешай или слоями, фольга или калауд, угли. В конце оценка и совет.',
      app: {
        brand: 'Bowl Studio', close: 'Закрыть студию', back: 'Назад', stepOf: 'Шаг {n} из {t}',
        names: ['Чаша', 'Вкус', 'Смешивание', 'Забивка', 'Фольга или калауд', 'Угли', 'Дым', 'Итог'],
        loading: 'Накрываю стол…', err: 'Твой браузер не может показать 3D-стол, но все шаги можно пройти и так.', errLost: '3D-вид остановился. Закрой и снова открой студию.',
        intro: {
          title: 'Твой стол готов', lead: 'Чаша, табак, фольга, калауд и угли. Иди шаг за шагом, как настоящий мастер.',
          tags: ['3 типа чаш', 'Все вкусы энциклопедии', 'Фольга или калауд', 'Оценка в конце'], start: 'Начать'
        },
        bowl: {
          title: 'Выбери чашу', hint: 'Нажми на чашу на столе или выбери ниже', cta: 'Дальше с этой чашей',
          items: {
            egypt: { name: 'Египетская', short: 'отверстия в дне', info: 'Классика с несколькими отверстиями в дне. Хороша для светлого листа и воздушной забивки, но сок может стекать в кальян.' },
            phunnel: { name: 'Фанел', short: 'сок остаётся', info: 'Одно отверстие на вершине столбика в центре, поэтому сок остаётся в чаше. Жар ровнее, и чаша дольше курится. Отверстие столбика должно оставаться открытым.' },
            silicone: { name: 'Силиконовая', short: 'не трескается', info: 'Не трескается при падении и легко моется. Табак лежит на металлической пластине с отверстиями, а силикон хуже держит жар.' }
          }
        },
        flavor: {
          title: 'Выбери вкус', titleMix: 'Твой микс', change: 'Изменить', remove: 'Убрать вкус', add: 'Добавить второй вкус для микса',
          leaf: { light: 'Светлый лист', dark: 'Тёмный лист' }, mixNote: 'Как их соединить, выберешь на следующем шаге.',
          pick: 'Выбери вкус', pickSecond: 'Выбери второй вкус', search: 'Найти вкус или бренд', popular: 'Популярное', results: 'Результаты', none: 'Такого вкуса нет. Попробуй другое название или бренд.',
          sameLeaf: 'Оба вкуса на одном листе, поэтому хорошо сочетаются.', mixedLeaf: 'Один светлый, другой тёмный лист. Тёмному нужно больше жара, поэтому клади его меньше.',
          cta: 'Дальше', ctaOne: 'Открыть банку'
        },
        soon: { title: 'Следующий шаг скоро', text: 'Смешивание и забивка в разработке. Пока можно сменить чашу или вкус.', back: 'Назад к вкусу' }
      }
    }
  };
  V.studioTx = function (lang) { return TX[lang || MSP.lang] || TX.en; };

  /* ------------------------------------------------------------------ */
  /* Stranica                                                            */
  /* ------------------------------------------------------------------ */

  var STEP_IC = ['egypt', 'tin', 'blend', 'tap', 'foil', 'flame', 'smoke', 'star'];

  V.pageStudio = function (desc, crumbs) {
    var d = V.studioTx();
    var art = '/studio/poster.webp';
    return (
      '<div class="bsl">' +
        '<section class="bsl-hero" aria-labelledby="bsl-h1"><div class="container">' +
          '<div class="bsl-hero__grid">' +
            '<div class="bsl-hero__text">' +
              '<p class="eyebrow"><span class="eyebrow__dot" aria-hidden="true"></span>' + esc(d.eyebrow) + '</p>' +
              '<h1 class="bsl-hero__h" id="bsl-h1">' + esc(d.h1) + '</h1>' +
              '<p class="bsl-hero__lead">' + esc(d.lead) + '</p>' +
              '<div class="bsl-hero__go">' +
                '<button type="button" class="btn btn--primary bsl-open" data-bs-open disabled>' + esc(d.cta) + ic('next') + '</button>' +
                '<p class="bsl-hero__note">' + ic('device') + '<span>' + esc(d.note) + '</span></p>' +
              '</div>' +
              '<noscript><p class="bsl-nojs">' + esc(d.noJs) + '</p></noscript>' +
            '</div>' +
            '<button type="button" class="bsl-art" data-bs-open disabled aria-label="' + esc(d.cta) + '">' +
              '<img src="' + art + '" width="1600" height="1000" alt="' + esc(d.artAlt) + '" decoding="async" fetchpriority="high">' +
              '<span class="bsl-art__play" aria-hidden="true">' + ic('next') + '</span>' +
            '</button>' +
          '</div>' +
        '</div></section>' +
        '<section class="fsec bsl-steps" aria-labelledby="bsl-steps-h"><div class="container">' +
          crumbs +
          '<h2 class="bsl-steps__h" id="bsl-steps-h">' + esc(d.stepsTitle) + '</h2>' +
          '<ol class="bsl-steps__list" role="list">' + d.steps.map(function (s, i) {
            return '<li class="bsl-step"><span class="bsl-step__ic">' + ic(STEP_IC[i]) + '</span><span class="bsl-step__n">' + (i + 1) + '</span>' +
              '<h3 class="bsl-step__t">' + esc(s.t) + '</h3><p class="bsl-step__d">' + esc(s.d) + '</p></li>';
          }).join('') + '</ol>' +
        '</div></section>' +
        V.faqSection(d.faq, 'bsl-faq') +
        '<p class="container bsl-credit">' + esc(d.credit) + '</p>' +
        studioShell(d) +
      '</div>'
    );
  };

  /** Skelet aplikacije (skriven dok ga js/studio.js ne otvori). */
  function studioShell(d) {
    var a = d.app;
    return (
      '<div class="bs" id="bs" hidden role="dialog" aria-modal="true" aria-labelledby="bs-title">' +
        '<div class="bs__stage" id="bs-stage"></div>' +
        '<div class="bs__poster" id="bs-poster" aria-hidden="true"></div>' +
        '<div class="bs__shade" aria-hidden="true"></div>' +
        '<p class="bs__loading" id="bs-loading" role="status"><span class="bs-spin" aria-hidden="true"></span><span>' + esc(a.loading) + '</span></p>' +
        '<header class="bs__top" id="bs-top">' +
          '<div class="bs__bar">' +
            '<button type="button" class="bs-ibtn bs__back" id="bs-back" aria-label="' + esc(a.back) + '">' + ic('back') + '</button>' +
            '<p class="bs__brand">' + mark() + '<span>Bowl <b>Studio</b></span></p>' +
            '<button type="button" class="bs-ibtn bs__close" id="bs-close" aria-label="' + esc(a.close) + '">' + ic('x') + '</button>' +
          '</div>' +
          '<ol class="bs__steps" id="bs-steps" role="list">' + a.names.map(function (n, i) {
            return '<li class="bs__seg" data-i="' + (i + 1) + '"><span class="sr-only">' + esc(n) + '</span></li>';
          }).join('') + '</ol>' +
          '<div class="bs__head" id="bs-head" aria-live="polite">' +
            '<p class="bs__eyebrow" id="bs-eyebrow"></p>' +
            '<h2 class="bs__title" id="bs-title" tabindex="-1"></h2>' +
            '<p class="bs__lead" id="bs-lead"></p>' +
          '</div>' +
        '</header>' +
        '<p class="bs__hint" id="bs-hint" hidden></p>' +
        '<section class="bs__panel" id="bs-panel"><div class="bs__panel-in" id="bs-panel-in"></div></section>' +
        '<div class="bs-sheet" id="bs-sheet" hidden role="dialog" aria-modal="true" aria-labelledby="bs-sheet-h">' +
          '<div class="bs-sheet__card">' +
            '<div class="bs-sheet__top"><h3 class="bs-sheet__h" id="bs-sheet-h"></h3>' +
              '<button type="button" class="bs-ibtn" id="bs-sheet-x" aria-label="' + esc(a.close) + '">' + ic('x') + '</button></div>' +
            '<label class="bs-search">' + ic('search') + '<span class="sr-only">' + esc(a.flavor.search) + '</span>' +
              '<input type="search" id="bs-q" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" placeholder="' + esc(a.flavor.search) + '"></label>' +
            '<p class="bs-sheet__label" id="bs-sheet-label"></p>' +
            '<ul class="bs-res" id="bs-res" role="listbox" aria-labelledby="bs-sheet-h"></ul>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // dok studio nije gotov: stranica postoji, ali nije u Googleu ni u sitemapu
  if (V.NOINDEX_PAGES && V.NOINDEX_PAGES.indexOf('studio') === -1) V.NOINDEX_PAGES.push('studio');

  V.studioMeta = function () {
    var d = V.studioTx();
    return { title: d.metaTitle, description: V.clipText(d.metaDesc, 155) };
  };
})(typeof window !== 'undefined' ? window : globalThis);
