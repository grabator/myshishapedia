/*
 * MyShishapedia - svi tekstovi interfejsa, na bosanskom (bs) i engleskom (en).
 *
 * Isti fajl koristi i build (build.mjs, u Node-u) i browser.
 * Jezik se bira preko MSP.lang (build ga postavlja po stranici; u browseru
 * se čita iz <html lang>). Placeholderi u {vitičastim} zagradama se popunjavaju u MSP.t().
 * Sadržaj (okusi, vodič, rječnik, oprema, kviz, O nama) je u data/*.js.
 */
(function (root) {
  'use strict';

  var MSP = (root.MSP = root.MSP || {});

  var STRINGS = {
    bs: {
      langName: 'Bosanski',
      meta: {
        siteName: 'MyShishapedia',
        homeTitle: 'MyShishapedia - enciklopedija okusa za nargilu',
        homeDescription: 'Otkrij od čega je napravljen okus koji upravo pušiš. Sastojci, profil okusa, mikser, kviz i vodič za nargilu na jednom mjestu.',
        collectionsTitle: 'Kolekcije okusa za nargilu: ledeni, noćni, tropski | MyShishapedia',
        collectionsDescription: 'Okusi za nargilu grupisani po atmosferi: ledeni, noćni, tropski i okusi za početnike. Pronađi svoj stil.',
        collectionTitle: '{name} za nargilu - kolekcija okusa | MyShishapedia',
        compareTitle: 'Poređenje okusa za nargilu - uporedi dva okusa | MyShishapedia',
        compareDescription: 'Izaberi dva okusa za nargilu i uporedi profil, sastojke i razlike na jednom ekranu.',
        comparePairTitle: '{a} vs {b} - razlike i poređenje okusa | MyShishapedia',
        comparePairLead: '{a} ili {b}?',
        comparePickTitle: '{a} vs {b} | MyShishapedia',
        mixesTitle: 'Recepti miksova za nargilu - kombinacije okusa | MyShishapedia',
        mixesDescription: 'Recepti miksova za nargilu sa omjerima, savjetima za punjenje posude i kombinovanim profilom okusa.',
        mixRecipeTitle: '{name} - recept miksa za nargilu ({parts}) | MyShishapedia',
        privacyTitle: 'Politika privatnosti | MyShishapedia',
        privacyDescription: 'Kako MyShishapedia postupa sa podacima: statistika bez kolačića, anonimne ocjene, podaci u tvom browseru i forme bez obaveznog emaila.',
        termsTitle: 'Uslovi korištenja | MyShishapedia',
        termsDescription: 'Pravila korištenja stranice MyShishapedia: samo za punoljetne, informativni sadržaj, bez prodaje i reklame duhana.',
        suggestTitle: 'Predloži okus za nargilu | MyShishapedia',
        suggestDescription: 'Fali ti okus u enciklopediji? Predloži ga: brend, naziv i sastojci, a mi ćemo ga provjeriti i dodati.',
        reportTitle: 'Prijavi grešku | MyShishapedia',
        reportDescription: 'Primijetio/la si grešku u sastavu, opisu ili profilu okusa? Javi nam i biće ispravljena.',
        flavorsTitle: 'Svi okusi za nargilu - pretraga i filteri | MyShishapedia',
        brandsTitle: 'Brendovi duhana za nargilu: Adalya, Al Fakher, Tangiers i drugi | MyShishapedia',
        brandsDescription: 'Svi brendovi u enciklopediji: zemlja porijekla, vrsta lista i okusi. Od turske Adalye do ruskog Darksidea.',
        brandTitle: '{name} okusi za nargilu ({country}) | MyShishapedia',
        topTitle: 'Najbolje ocijenjeni okusi i miksovi za nargilu | MyShishapedia',
        topDescription: 'Rang liste okusa i recepata miksova za nargilu po ocjenama posjetilaca, po brendu i kolekciji. Ocijeni i ti svoje omiljene.',
        shelfTitle: 'Moja polica | MyShishapedia',
        shelfDescription: 'Tvoja lična polica omiljenih okusa za nargilu, poredanih po kolekcijama. Čuva se samo u tvom browseru.',
        tipsTitle: 'Savjeti za bolji okus nargile: punjenje, toplota, dim | MyShishapedia',
        tipsDescription: 'Kako napuniti posudu, kontrolisati toplotu, dobiti gušći dim, koristiti led u vazi i očistiti nargilu za čist okus.',
        flavorsDescription: 'Svi okusi na jednom mjestu: pretraži po nazivu, brendu ili sastojku, filtriraj po tagu i kolekciji i sortiraj po mentoli ili slatkoći.',
        searchTitle: 'Pretraga | MyShishapedia',
        searchDescription: 'Pretraži okuse, kolekcije, recepte, pojmove i vodič na MyShishapediji.',
        ogImageAlt: 'MyShishapedia: nargila iz koje se diže dim, sa voćem oko nje',
        flavorTitle: '{brand} {name} - {ingredients} | MyShishapedia',
        mixerTitle: 'Mikser okusa - spoji dva okusa za nargilu | MyShishapedia',
        mixTitle: 'Miks {a} × {b} | MyShishapedia',
        mixerDescription: 'Spoji dva okusa za nargilu, podesi omjer i pogledaj kombinovanu paletu, sastojke i profil miksa.',
        quizTitle: 'Kviz: koji okus za nargilu je za tebe? | MyShishapedia',
        quizDescription: 'Odgovori na šest kratkih pitanja i pronađi okus za nargilu koji najviše odgovara tvom ukusu.',
        guideTitle: 'Kako pripremiti nargilu - vodič za početnike | MyShishapedia',
        guideDescription: 'Korak po korak: voda, sastavljanje, duhan, punjenje posude, folija ili HMD, ugljevi, pušenje i čišćenje nargile.',
        glossaryTitle: 'Rječnik pojmova o nargili | MyShishapedia',
        glossaryDescription: 'HMD, phunnel, vortex, melasa, purge ventil i drugi pojmovi o nargili, objašnjeni jednostavno i jasno.',
        glossaryTermTitle: '{term} - šta je to? Rječnik nargile | MyShishapedia',
        gearTitle: 'Posude i ugljevi za nargilu - razlike i savjeti | MyShishapedia',
        gearDescription: 'Klasična, phunnel ili vortex posuda, kokosovi ili brzopaleći ugljevi, folija ili HMD: šta je razlika i šta odabrati.',
        aboutTitle: 'O nama - MyShishapedia',
        aboutDescription: 'Ko stoji iza MyShishapedije i zašto je nastala enciklopedija okusa za nargilu. Kontakt i napomena o brendovima.',
        notFoundTitle: 'Stranica nije pronađena | MyShishapedia',
        notFoundDescription: 'Ova stranica ne postoji. Pretraži okuse ili se vrati na početnu.'
      },

      a11y: {
        skipToContent: 'Preskoči na sadržaj',
        homeLink: 'MyShishapedia, početna stranica',
        mainNav: 'Glavna navigacija',
        openMenu: 'Otvori meni',
        closeMenu: 'Zatvori meni',
        menu: 'Meni',
        breadcrumbs: 'Putanja',
        ingredientIllustration: 'Ilustracija: {name}',
        openFlavor: 'Otvori okus {brand} {name}',
        outOf: '{value} od {max}',
        langSwitch: 'Jezik stranice',
        langOther: 'English version'
      },

      hookah: {
        label: 'Nargila. Pritisni i drži da povučeš dim.',
        pull: 'Drži za dim',
        strength: 'Jačina povlačenja',
        hint: 'Pritisni i drži nargilu ili dugme, pa pusti.'
      },

      nav: {
        home: 'Početna',
        flavors: 'Okusi',
        mixer: 'Mikser',
        quiz: 'Kviz',
        guide: 'Vodič',
        glossary: 'Rječnik',
        gear: 'Oprema',
        about: 'O nama',
        collections: 'Kolekcije',
        compare: 'Poređenje',
        mixes: 'Recepti',
        groupFlavors: 'Okusi',
        groupHookah: 'Nargila',
        groupOther: 'Još',
        privacy: 'Privatnost',
        terms: 'Uslovi korištenja',
        suggest: 'Predloži okus',
        search: 'Pretraga',
        legalNav: 'Pravne informacije',
        menuFooter: 'Enciklopedija okusa za nargilu',
        allFlavors: 'Svi okusi',
        brands: 'Brendovi',
        top: 'Najbolje ocijenjeno',
        shelf: 'Moja polica',
        tips: 'Savjeti',
        backToAll: 'Nazad na sve okuse',
        tagline: 'Enciklopedija okusa'
      },

      collections: {
        eyebrow: 'Kolekcije',
        title: 'Kolekcije okusa',
        lead: 'Okusi grupisani po atmosferi. Svaka kolekcija se puni sama, prema profilu i tagovima okusa.',
        count: { one: '{n} okus', few: '{n} okusa', other: '{n} okusa' },
        open: 'Otvori kolekciju',
        flavorsTitle: 'Okusi u kolekciji',
        allCollections: 'Sve kolekcije',
        otherTitle: 'Ostale kolekcije',
        badgesLabel: 'Kolekcije ovog okusa',
        whyTitle: 'Zašto baš ovi okusi?',
        guideCta: 'Otvori vodič',
        homeTitle: 'Izaberi raspoloženje',
        homeLead: 'Kolekcije okusa po atmosferi, od ledenih do noćnih.',
        metaIn: 'Okusi: {list}.',
        empty: 'U ovoj kolekciji još nema okusa.'
      },

      compare: {
        eyebrow: 'Poređenje',
        title: 'Uporedi dva okusa',
        lead: 'Izaberi bilo koja dva okusa i vidi razlike u profilu i sastojcima na prvi pogled.',
        pickA: 'Lijevi okus',
        pickB: 'Desni okus',
        change: 'Promijeni',
        pickerTitle: 'Izaberi okus',
        pickerSearch: 'Pretraži okuse',
        pickerClose: 'Zatvori izbor',
        swap: 'Zamijeni strane',
        tryMixer: 'Probaj ih zajedno u mikseru',
        share: 'Kopiraj link',
        copied: 'Link je kopiran.',
        copyFailed: 'Kopiranje nije uspjelo; kopiraj adresu iz trake browsera.',
        openFlavor: 'Otvori {name}',
        verdictTitle: 'Ukratko',
        profileTitle: 'Profil jedan naspram drugog',
        ingredientsTitle: 'Sastojci',
        shared: 'Zajedničko',
        onlyIn: 'Samo {name}',
        noneShared: 'Nemaju zajedničkih sastojaka.',
        noneOnly: 'Ništa posebno.',
        popularTitle: 'Popularna poređenja',
        compareWith: 'Uporedi sa drugim okusom',
        flavorSectionTitle: 'Uporedi',
        flavorSectionIntro: 'Kako stoji naspram sličnih okusa.',
        vs: 'vs',
        adj: { sweetness: 'slađi', freshness: 'svježiji', fruitiness: 'voćniji', cooling: 'ledeniji', strength: 'jačeg okusa' },
        and: ' i ',
        both: '{a} je {x}, a {b} je {y}.',
        one: '{a} je {x} od okusa {b}.',
        close: 'Po profilu su {a} i {b} vrlo slični, pa je razlika uglavnom u sastojcima.',
        same: 'Po profilu su {a} i {b} gotovo isti.',
        sharedNote: 'Zajedničko im je: {list}.',
        onlyNote: 'Samo u okusu {name}: {list}.'
      },

      fotd: {
        eyebrow: 'Okus dana',
        sectionLabel: 'Okus dana',
        open: 'Otvori okus',
        next: 'Sljedeći okus za {h} h {m} min',
        nextMin: 'Sljedeći okus za {m} min',
        tryMix: 'Probaj ga u miksu',
        mixLink: '{name}: {parts}'
      },

      mixes: {
        eyebrow: 'Recepti',
        title: 'Recepti miksova',
        lead: 'Kombinacije okusa sa omjerom, savjetima za punjenje posude i spojenim profilom.',
        filtersTag: 'Filtriraj po tagu',
        filtersStrength: 'Filtriraj po jačini',
        all: 'Svi',
        strength: { light: 'Lagan', medium: 'Srednji', strong: 'Jak' },
        strengthLabel: 'Jačina',
        count: { one: '{n} recept', few: '{n} recepta', other: '{n} recepata' },
        empty: 'Nema recepata za ove filtere.',
        reset: 'Poništi filtere',
        open: 'Otvori recept',
        ratioTitle: 'Omjer',
        tipsTitle: 'Savjeti za posudu',
        layout: { mixed: 'Izmiješano u posudi', sectors: 'U sektorima posude' },
        layoutLabel: 'Punjenje',
        openMixer: 'Otvori u mikseru',
        aboutTitle: 'Kako djeluje',
        ingredientsTitle: 'Spojeni sastojci',
        profileTitle: 'Kombinovani profil',
        flavorsTitle: 'Okusi u miksu',
        bowlLabel: 'Posuda odozgo, podijeljena po omjeru: {parts}',
        featuredTitle: 'Recepti miksova',
        featuredLead: 'Tri kombinacije za početak.',
        allMixes: 'Svi recepti',
        withFlavorTitle: 'Recepti sa ovim okusom',
        withFlavorIntro: 'Miksovi u kojima je ovaj okus.',
        otherTitle: 'Još recepata',
        note: 'Recepti su prijedlozi. Ukus je lična stvar, pa slobodno prilagodi omjer.'
      },

      legal: {
        eyebrow: 'Pravne informacije',
        privacyTitle: 'Politika privatnosti',
        termsTitle: 'Uslovi korištenja',
        updated: 'Zadnja izmjena: {date}',
        notLegal: 'Ovo je jednostavan, iskren opis. Ako nešto nije jasno, piši nam.'
      },

      forms: {
        required: 'obavezno',
        optional: 'nije obavezno',
        send: 'Pošalji',
        sending: 'Šaljem...',
        honeypot: 'Ne popunjavaj ovo polje',
        privacyNote: 'Email nije obavezan i koristi se samo za odgovor. Više u',
        privacyLink: 'politici privatnosti',
        errRequired: 'Ovo polje je obavezno.',
        errEmail: 'Upiši ispravan email ili ostavi polje prazno.',
        errUrl: 'Upiši ispravan link (npr. https://...) ili ostavi polje prazno.',
        errSummary: 'Provjeri označena polja.',
        errSend: 'Slanje nije uspjelo. Provjeri internet vezu i pokušaj ponovo.',
        successTitle: 'Hvala, poruka je poslana!',
        successText: 'Pročitaćemo je čim stignemo. Ako si ostavio/la email, javićemo se.',
        mailtoTitle: 'Otvaramo tvoj email program',
        mailtoText: 'Poruka je već sastavljena. Samo je pošalji iz email programa.',
        again: 'Pošalji još jednu',
        noJs: 'Za slanje forme potreban je JavaScript. Možeš nam pisati i direktno:',
        brand: 'Brend',
        brandHint: 'npr. Adalya',
        name: 'Naziv okusa',
        nameHint: 'npr. Love 66',
        ingredients: 'Sastojci (ako znaš)',
        ingredientsHint: 'npr. lubenica, dinja, menta',
        comment: 'Komentar',
        commentHint: 'Zašto ti se sviđa, gdje si ga probao/la...',
        email: 'Tvoj email',
        emailHint: 'za odgovor',
        suggestEyebrow: 'Predloži okus',
        suggestTitle: 'Fali ti neki okus?',
        suggestLead: 'Predloži ga. Provjerićemo sastav i dodati ga u enciklopediju.',
        suggestSubject: 'Prijedlog okusa: {brand} {name}',
        reportEyebrow: 'Prijavi grešku',
        reportTitle: 'Nešto nije tačno?',
        reportLead: 'Pomozi da enciklopedija bude tačnija. Svaka prijava se provjerava.',
        reportSubject: 'Greška: {flavor}',
        flavor: 'Okus',
        flavorPick: 'Izaberi okus',
        what: 'Šta nije tačno?',
        whatComposition: 'Sastav',
        whatDescription: 'Opis',
        whatProfile: 'Profil okusa',
        whatOther: 'Drugo',
        correct: 'Tačna informacija',
        correctHint: 'Šta bi trebalo pisati?',
        source: 'Link na izvor',
        sourceHint: 'https://...',
        reportButton: 'Prijavi grešku'
      },

      search: {
        open: 'Pretraži stranicu',
        shortcut: 'Ctrl K',
        label: 'Pretraži okuse, recepte, pojmove...',
        placeholder: 'Okus, sastojak, recept, pojam...',
        close: 'Zatvori pretragu',
        empty: 'Nema rezultata za „{q}“.',
        emptyHint: 'Probaj drugi naziv ili sastojak. Ako okus fali, predloži ga.',
        suggestCta: 'Predloži „{q}“',
        start: 'Upiši bar dva slova.',
        loading: 'Učitavam...',
        results: { one: '{n} rezultat', few: '{n} rezultata', other: '{n} rezultata' },
        keys: '↑↓ za kretanje, Enter za otvaranje, Esc za zatvaranje',
        groups: {
          flavor: 'Okusi',
          brand: 'Brendovi',
          collection: 'Kolekcije',
          recipe: 'Recepti',
          term: 'Rječnik',
          guide: 'Vodič',
          tips: 'Savjeti',
          gear: 'Oprema',
          compare: 'Poređenja',
          page: 'Stranice'
        },
        pageTitle: 'Pretraga',
        pageLead: 'Pretraži cijelu MyShishapediju.',
        noJs: 'Pretraga radi uz uključen JavaScript. Bez njega, pogledaj:'
      },

      flavorsPage: {
        eyebrow: 'Okusi',
        title: 'Svi okusi',
        lead: 'Pretraži, filtriraj i sortiraj sve okuse u enciklopediji.',
        searchLabel: 'Pretraži okuse',
        tagsLabel: 'Filtriraj po tagu',
        collectionsLabel: 'Filtriraj po kolekciji',
        brandsLabel: 'Filtriraj po brendu',
        brandAll: 'Svi brendovi',
        leafLabel: 'Filtriraj po vrsti lista',
        leafAll: 'Svaki list',
        sortLabel: 'Sortiraj',
        sort: { az: 'A-Ž', rating: 'Najbolje ocijenjeno', cooling: 'Najviše mente', sweetness: 'Najslađe', fruitiness: 'Najvoćnije' },
        emptyTitle: 'Nema takvog okusa (još)',
        emptyText: 'Nismo našli okus za ovu pretragu i filtere. Možda ga još nemamo?',
        suggestCta: 'Predloži ovaj okus',
        reset: 'Poništi filtere',
        suggestLine: 'Fali ti neki okus?'
      },

      ratings: {
        eyebrow: 'Ocjene',
        topTitle: 'Najbolje ocijenjeno',
        topLead: 'Okusi i miksovi koje posjetioci najviše vole. Na listu ulazi sve što je ocijenjeno najmanje {n} puta.',
        topFlavors: 'Okusi',
        topMixes: 'Miksovi',
        topEmpty: 'Još nema dovoljno ocjena za ovu listu. Okus ili miks ulazi na listu kad je ocijenjen najmanje {n} puta.',
        topNote: 'Veći prosjek ide gore, a kod istog prosjeka prednost ima ono sa više ocjena. Ocjene su mišljenja posjetilaca, a ne preporuka.',
        colAll: 'Sve kolekcije',
        loading: 'Učitavam ocjene…',
        ready: 'Rang liste su učitane.',
        unavailable: 'Ocjene trenutno nisu dostupne. Pokušaj malo kasnije.',
        noJs: 'Rang liste se prikazuju kad je uključen JavaScript.',
        rateFlavor: 'Ocijeni ovaj okus',
        rateRecipe: 'Ocijeni ovaj miks',
        starLabel: 'Ocjena {n} od 5',
        count: { one: '{n} ocjena', few: '{n} ocjene', other: '{n} ocjena' },
        none: 'Još nema ocjena. Tvoja može biti prva.',
        avgSr: 'Prosječna ocjena {avg} od 5, {count}',
        hint: 'Klikni zvjezdicu i daj svoju ocjenu.',
        yours: 'Tvoja ocjena: {n} od 5. Možeš je promijeniti.',
        sending: 'Šaljem ocjenu…',
        thanks: 'Hvala! Tvoja ocjena ({n} od 5) je sačuvana.',
        changed: 'Ocjena je promijenjena na {n} od 5.',
        same: 'To je već tvoja ocjena.',
        errLimit: 'Previše ocjena za kratko vrijeme. Pokušaj ponovo za par minuta.',
        errCheck: 'Provjera protiv robota nije uspjela. Pokušaj ponovo.',
        errSend: 'Ocjena nije poslana. Provjeri internet i pokušaj ponovo.'
      },

      shelf: {
        add: 'Dodaj na policu',
        remove: 'Ukloni sa police',
        addAria: 'Dodaj {name} na policu',
        removeAria: 'Ukloni {name} sa police',
        added: '{name} je na tvojoj polici.',
        removed: '{name} više nije na polici.',
        openShelf: 'Otvori policu',
        eyebrow: 'Lična kolekcija',
        title: 'Moja polica',
        lead: 'Okusi koje si sačuvao/la, poredani po kolekcijama. Polica postoji samo u tvom browseru: bez prijave i bez slanja podataka.',
        count: { one: 'Na polici: {n} okus', few: 'Na polici: {n} okusa', other: 'Na polici: {n} okusa' },
        jars: { one: '{n} tegla', few: '{n} tegle', other: '{n} tegli' },
        cabinetOpen: 'Otvori ormarić',
        cabinetClose: 'Zatvori ormarić',
        cabinetHint: 'Klikni da otvoriš',
        inside: 'Police sa teglama okusa',
        other: 'Ostalo',
        jarAria: '{name}, pogledaj',
        drawerAria: '{title}, {count}',
        close: 'Zatvori',
        openFlavor: 'Otvori okus',
        ings: 'Sastojci',
        emptyTitle: 'Polica je još prazna',
        emptyText: 'Na kartici ili stranici okusa klikni dugme sa teglom i okus će te čekati ovdje, u ormariću. Sve ostaje samo u tvom browseru.',
        emptyCta: 'Pogledaj sve okuse',
        emptyQuiz: 'Pronađi okus kvizom',
        noJs: 'Polica radi kad je uključen JavaScript.'
      },

      recent: {
        title: 'Nedavno gledano',
        clear: 'Obriši listu',
        clearAria: 'Obriši listu nedavno gledanih okusa',
        cleared: 'Lista nedavno gledanih okusa je obrisana.'
      },

      tips: {
        eyebrow: 'Savjeti',
        title: 'Savjeti za bolji okus',
        lead: 'Kratki, praktični savjeti za punjenje posude, toplotu, gušći dim, led u vazi i čišćenje. Mala promjena često napravi veliku razliku u okusu.',
        navLabel: 'Sadržaj savjeta',
        of: '{n} / {total}',
        numbersTitle: 'U brojkama',
        moreTitle: 'Više o tome',
        moreGuide: 'Vodič, korak {n}: {title}',
        moreGear: 'Oprema: {name}',
        moreTerm: 'Rječnik: {term}',
        ctaTitle: 'Prvi put pripremaš nargilu?',
        ctaText: 'Vodič te vodi korak po korak, rječnik objašnjava sve pojmove, a na stranici opreme su razlike između posuda i ugljeva.',
        ctaGuide: 'Otvori vodič',
        ctaGlossary: 'Rječnik pojmova',
        ctaGear: 'Posude i ugljevi',
        note: 'Brojke su okvirne preporuke: svaka nargila, posuda i duhan se ponašaju malo drugačije, pa probaj i prilagodi.'
      },

      reco: {
        title: 'Preporučeno za tebe',
        lead: 'Na osnovu tvoje police, ocjena i okusa koje si gledao/la.',
        because: 'Zato što ti se sviđa {name}',
        similar: 'Slično okusu {name}'
      },

      share: {
        button: 'Podijeli',
        title: 'Podijeli karticu',
        story: 'Story (9:16)',
        square: 'Kvadrat (1:1)',
        formatLabel: 'Format kartice',
        preview: 'Pregled kartice za dijeljenje: {name}',
        shareFile: 'Podijeli sliku',
        download: 'Preuzmi sliku',
        copyLink: 'Kopiraj link',
        copied: 'Link je kopiran.',
        close: 'Zatvori',
        making: 'Pravim karticu...',
        failed: 'Kartica se nije mogla napraviti. Probaj ponovo.',
        myFlavor: 'Moj okus je',
        match: '{n}% poklapanja',
        mix: 'Miks',
        ratio: 'Omjer'
      },

      ageGate: {
        eyebrow: 'Samo za punoljetne',
        question: 'Da li imaš 18 ili više godina?',
        text: 'Stranica sadrži informacije o duhanu za nargilu i namijenjena je isključivo punoljetnim osobama.',
        yes: 'Da, imam 18+',
        no: 'Ne',
        deniedTitle: 'Razumijemo.',
        deniedText: 'Ova stranica je namijenjena isključivo punoljetnim osobama. Vrati se kad napuniš 18 godina.',
        back: 'Vrati se na pitanje'
      },

      home: {
        eyebrow: 'Enciklopedija okusa za nargilu',
        titleA: 'Okus,',
        titleEm: 'rastavljen',
        titleB: 'na sastojke.',
        lead: 'Otkrij od čega je napravljen okus koji upravo pušiš.',
        searchLabel: 'Pretraži okuse',
        searchPlaceholder: 'Upiši okus, brend ili sastojak',
        searchClear: 'Obriši pretragu',
        searchHint: 'Pritisni {key} za pretragu',
        catalogTitle: 'Svi okusi',
        filtersLabel: 'Filtriraj po tagu',
        filterAll: 'Svi',
        count: { one: '{n} okus', few: '{n} okusa', other: '{n} okusa' },
        emptyTitle: 'Nema okusa za ovu pretragu',
        emptyText: 'Probaj drugi naziv, brend ili sastojak, na primjer „menta“ ili „ananas“.',
        emptyReset: 'Poništi pretragu',
        comingSoonTitle: 'Enciklopedija raste',
        comingSoonText: 'Novi okusi stižu uskoro.'
      },

      leaf: {
        light: 'Svijetli list',
        dark: 'Tamni list',
        both: 'Svijetli i tamni list',
        lightNote: 'Blaži, manje nikotina i lakši za početnike.',
        darkNote: 'Jači, više nikotina. Za iskusnije pušače, nije za početnike.',
        more: 'Šta to znači?'
      },

      brands: {
        eyebrow: 'Brendovi',
        title: 'Brendovi',
        lead: 'Svi brendovi u enciklopediji: odakle dolaze, na kakvom listu rade i koje njihove okuse imamo.',
        count: { one: '{n} brend', few: '{n} brenda', other: '{n} brendova' },
        flavorsCount: { one: '{n} okus', few: '{n} okusa', other: '{n} okusa' },
        filterLabel: 'Filtriraj po vrsti lista',
        all: 'Svi',
        empty: 'Nema brendova sa ovom vrstom lista.',
        country: 'Zemlja',
        leafLabel: 'Tipičan list',
        flavorsTitle: 'Okusi',
        aboutTitle: 'O brendu',
        disclaimer: 'MyShishapedia nije povezana sa brendom {name}, niti je od njega sponzorisana. Ime brenda koristimo samo da bismo opisali okuse.',
        otherTitle: 'Ostali brendovi',
        allBrands: 'Svi brendovi',
        metaIn: 'Okusi: {list}.'
      },

      flavor: {
        scrollCue: 'Skrolaj',
        ingredientsTitle: 'Od čega je napravljen',
        ingredientsIntro: 'Sastojci i koliko se svaki od njih osjeti u okusu.',
        ingredientsCount: { one: '{n} sastojak', few: '{n} sastojka', other: '{n} sastojaka' },
        intensity: 'Intenzitet',
        coalsNote: { one: '{n} užaren ugalj od 5', few: '{n} užarena uglja od 5', other: '{n} užarenih ugljeva od 5' },
        profileTitle: 'Profil okusa',
        profileIntro: 'Procjena na skali od 0 do 10.',
        aboutTitle: 'O okusu',
        factsTitle: 'Ukratko',
        factBrand: 'Brend',
        factFlavor: 'Okus',
        factTobacco: 'Tip duhana',
        factIngredients: 'Sastojci',
        factTags: 'Tagovi',
        mixesTitle: 'Ideje za mikseve',
        mixesIntro: 'Kombinacije koje vrijedi probati.',
        similarTitle: 'Slični okusi',
        pagerLabel: 'Navigacija između okusa',
        prev: 'Prethodni okus',
        next: 'Sljedeći okus',
        listJoin: ', ',
        listLast: ' i '
      },

      profile: {
        sweetness: 'Slatkoća',
        freshness: 'Svježina',
        fruitiness: 'Voćnost',
        cooling: 'Menta / hlađenje',
        strength: 'Jačina okusa'
      },

      tags: {
        vocni: 'Voćni',
        tropski: 'Tropski',
        mint: 'Mint',
        slatki: 'Slatki',
        ljetni: 'Ljetni',
        osvjezavajuci: 'Osvježavajući',
        nocni: 'Noćni',
        ledeni: 'Ledeni',
        biljni: 'Biljni',
        bombon: 'Bombon',
        bobicasti: 'Bobičasti',
        medeni: 'Medeni',
        citrusni: 'Citrusni',
        klasicni: 'Klasični',
        zacinski: 'Začinski',
        desertni: 'Desertni',
        pice: 'Piće'
      },

      notFound: {
        eyebrow: 'Greška 404',
        title: 'Ova stranica je nestala u dimu',
        text: 'Stranica ne postoji ili je link pogrešno upisan. Pretraži okuse ili se vrati na početnu.',
        searchLabel: 'Pretraži okuse',
        cta: 'Nazad na početnu'
      },

      footer: {
        tagline: 'Enciklopedija okusa za nargilu.',
        warningLabel: 'Upozorenje',
        warning: 'Duhan za nargilu sadrži nikotin, koji izaziva ovisnost.',
        disclaimer:
          'MyShishapedia nije povezana sa brendovima čiji se okusi opisuju, niti je od njih sponzorisana. Nazivi brendova i okusa pripadaju njihovim vlasnicima i koriste se isključivo u opisne svrhe.',
        adults: 'Stranica je namijenjena isključivo punoljetnim osobama.',
        copyright: '© {year} MyShishapedia',
        madeBy: 'Napravio',
        navLabel: 'Linkovi u podnožju'
      },

      explore: {
        eyebrow: 'Više od okusa',
        title: 'Istraži svijet nargile',
        mixerTitle: 'Mikser okusa',
        mixerText: 'Spoji dva okusa, podesi omjer i pogledaj kako bi izgledao tvoj miks.',
        quizTitle: 'Koji okus je za tebe?',
        quizText: 'Šest kratkih pitanja i dobićeš okus koji najviše odgovara tvom ukusu.',
        guideTitle: 'Vodič za početnike',
        guideText: 'Kako pripremiti nargilu, korak po korak, od vode do prvog dima.',
        cta: 'Otvori'
      },

      guide: {
        eyebrow: 'Vodič za početnike',
        title: 'Kako pripremiti nargilu',
        lead: 'Devet jednostavnih koraka, od vode u vazi do prvog oblaka dima.',
        stepOf: 'Korak {n} od {total}',
        stepsLabel: 'Koraci vodiča',
        goToStep: 'Korak {n}: {title}',
        prev: 'Nazad',
        next: 'Dalje',
        finish: 'Kreni ispočetka',
        progress: 'Napredak kroz vodič',
        swipeHint: 'Prevuci lijevo ili desno za sljedeći korak',
        keysHint: 'Strelice lijevo i desno mijenjaju korak',
        tipLabel: 'Savjet',
        sceneLabel: 'Animacija koraka: {title}',
        safetyEyebrow: 'Sigurnost na prvom mjestu',
        stepParam: 'korak'
      },

      glossary: {
        eyebrow: 'Rječnik',
        title: 'Pojmovi o nargili',
        lead: 'Sve riječi koje ćeš čuti u nargila baru, objašnjene jednostavno.',
        searchLabel: 'Pretraži pojmove',
        searchPlaceholder: 'Upiši pojam, npr. HMD ili melasa',
        lettersLabel: 'Skoči na slovo',
        count: { one: '{n} pojam', few: '{n} pojma', other: '{n} pojmova' },
        empty: 'Nema pojma za tu pretragu.',
        seeGuide: 'Pogledaj u vodiču',
        seeGear: 'Pogledaj u opremi',
        openTerm: 'Otvori stranicu pojma',
        related: 'Vezano',
        also: 'Poznato i kao',
        allTerms: 'Svi pojmovi',
        otherTerms: 'Još pojmova'
      },

      gear: {
        eyebrow: 'Oprema',
        title: 'Posude i ugljevi',
        lead: 'Šta je razlika između posuda i ugljeva i kako utiču na okus. Bez komplikovanja.',
        bowlsTitle: 'Posude',
        bowlsIntro: 'Posuda drži duhan. Njen oblik određuje kako se toplota širi i kuda ide sok od duhana.',
        coalsTitle: 'Ugljevi',
        coalsIntro: 'Ugalj daje toplotu. Vrsta uglja utiče na okus i na to koliko je lako održati ujednačenu toplotu.',
        heatTitle: 'Toplota: folija ili HMD',
        heatIntro: 'Između ugljeva i duhana stoji folija ili HMD. Oba rade, razlika je u kontroli i jednostavnosti.',
        suits: 'Odgovara',
        pros: 'Prednosti',
        cons: 'Mane',
        compareTitle: 'Uporedi',
        compareIntro: 'Izaberi dvije stvari i pogledaj ih jednu pored druge.',
        compareBowls: 'Posude',
        compareCoals: 'Ugljevi',
        compareHeat: 'Folija i HMD',
        compareLeft: 'Prva',
        compareRight: 'Druga',
        recommendTitle: 'Preporuka za početnike',
        cutawayLabel: 'Presjek: {name}. Toplota ide odozgo kroz duhan, a sok od duhana {juice}.',
        legendHeat: 'toplota',
        legendJuice: 'sok od duhana',
        ratingNote: 'Ocjene su okvirne procjene (1 do 5 ugljeva), ne mjerenja.',
        warning: 'Pažnja'
      },

      mixer: {
        eyebrow: 'Mikser okusa',
        title: 'Spoji dva okusa',
        lead: 'Izaberi dva okusa i pomjeri klizač. Paleta, sastojci i profil se mijenjaju uživo.',
        pickA: 'Prvi okus',
        pickB: 'Drugi okus',
        change: 'Promijeni',
        pickerTitle: 'Izaberi okus',
        pickerSearch: 'Pretraži okuse',
        pickerClose: 'Zatvori izbor',
        ratio: 'Omjer',
        ratioText: '{a} posto {nameA}, {b} posto {nameB}',
        surprise: 'Iznenadi me',
        share: 'Kopiraj link na miks',
        copied: 'Link je kopiran',
        copyFailed: 'Kopiraj adresu iz trake browsera',
        ingredientsTitle: 'Sastojci miksa',
        shared: 'u oba okusa',
        profileTitle: 'Profil miksa',
        ideasTitle: 'Preporučene kombinacije',
        ideasFrom: 'Iz opisa okusa {name}',
        tryIdea: 'Probaj ovu kombinaciju',
        disclaimer: 'Ovo je vizuelna procjena. Pravi okus miksa zavisi i od načina punjenja posude i toplote.',
        stageLabel: 'Animacija: dim okusa {a} i {b} spaja se u jedan oblak',
        descStart: '{name} je miks u kojem su u prvom planu {main}.',
        descSharedOne: 'Sastojak koji dijele oba okusa je {item}, pa se posebno ističe.',
        descShared: 'Sastojci koje dijele oba okusa su {items}, pa se posebno ističu.',
        descCool: 'Hlađenje je izraženo.',
        descSweet: 'Miks je prilično sladak.',
        descFresh: 'Završetak je svjež i lagan.',
        descBalance: 'Omjer je uravnotežen, pa se oba okusa osjete podjednako.',
        descCooler: '{name} je skoro čisto hlađenje, pa ga drži na malom udjelu, oko 10 do 20 posto.',
        descLean: 'Više se osjeti {name}.',
        and: 'i'
      },

      quiz: {
        eyebrow: 'Kviz',
        title: 'Koji okus je za tebe?',
        lead: 'Šest kratkih pitanja. Nema pogrešnih odgovora.',
        start: 'Počni kviz',
        questionOf: 'Pitanje {n} od {total}',
        back: 'Prethodno pitanje',
        next: 'Dalje',
        seeResult: 'Pokaži rezultat',
        resultEyebrow: 'Tvoj okus',
        match: '{n}% poklapanja',
        why: 'Zašto',
        alternatives: 'Probaj i ove',
        openFlavor: 'Otvori okus',
        tryMixer: 'Probaj u mikseru',
        restart: 'Ponovi kviz',
        reasonJoin: ' i ',
        reasonPrefix: 'Voliš ',
        noJs: 'Za kviz je potrebno uključiti JavaScript. U međuvremenu pogledaj sve okuse.'
      },

      about: {
        eyebrow: 'O nama',
        title: 'Iza dima',
        contactTitle: 'Kontakt',
        contactText: 'Imaš prijedlog za novi okus, ispravku ili samo želiš reći zdravo?',
        contactCta: 'Piši mi',
        contactPlain: 'Email: {email}'
      },

      root: {
        title: 'MyShishapedia - enciklopedija okusa za nargilu',
        choose: 'Izaberi jezik',
        bs: 'Bosanski',
        en: 'English'
      },

      noscript: 'Neki dijelovi (animacije, mikser, kviz) rade tek kad je uključen JavaScript.'
    },

    en: {
      langName: 'English',
      meta: {
        siteName: 'MyShishapedia',
        homeTitle: 'MyShishapedia - the hookah flavor encyclopedia',
        homeDescription: 'Find out what the flavor in your bowl is actually made of. Ingredients, flavor profiles, a mixer, a quiz and a beginner hookah guide.',
        collectionsTitle: 'Hookah flavor collections: icy, night, tropical | MyShishapedia',
        collectionsDescription: 'Hookah flavors grouped by vibe: icy, night-time, tropical and beginner-friendly picks. Find your style.',
        collectionTitle: '{name} for hookah - flavor collection | MyShishapedia',
        compareTitle: 'Compare hookah flavors side by side | MyShishapedia',
        compareDescription: 'Pick any two hookah flavors and compare their profiles, ingredients and differences on one screen.',
        comparePairTitle: '{a} vs {b} - differences compared | MyShishapedia',
        comparePairLead: '{a} or {b}?',
        comparePickTitle: '{a} vs {b} | MyShishapedia',
        mixesTitle: 'Hookah mix recipes - flavor combinations | MyShishapedia',
        mixesDescription: 'Hookah mix recipes with ratios, bowl-packing tips and a combined flavor profile for each blend.',
        mixRecipeTitle: '{name} - hookah mix recipe ({parts}) | MyShishapedia',
        privacyTitle: 'Privacy policy | MyShishapedia',
        privacyDescription: 'How MyShishapedia handles data: cookie-free statistics, anonymous ratings, data kept in your browser and forms with optional email.',
        termsTitle: 'Terms of use | MyShishapedia',
        termsDescription: 'The rules for using MyShishapedia: adults only, informational content, no tobacco sales or advertising.',
        suggestTitle: 'Suggest a hookah flavor | MyShishapedia',
        suggestDescription: 'Missing a flavor in the encyclopedia? Suggest it with the brand, name and ingredients, and we will check it out and add it.',
        reportTitle: 'Report an issue | MyShishapedia',
        reportDescription: 'Spotted a mistake in a flavor composition, description or profile? Let us know and it will be fixed.',
        flavorsTitle: 'All hookah flavors - search and filters | MyShishapedia',
        brandsTitle: 'Hookah tobacco brands: Adalya, Al Fakher, Tangiers and more | MyShishapedia',
        brandsDescription: 'Every brand in the encyclopedia: country of origin, leaf type and flavors. From Turkish Adalya to Russian Darkside.',
        brandTitle: '{name} hookah flavors ({country}) | MyShishapedia',
        topTitle: 'Top-rated hookah flavors and mixes | MyShishapedia',
        topDescription: 'Hookah flavors and mix recipes ranked by visitor ratings, by brand and by collection. Rate your own favorites too.',
        shelfTitle: 'My shelf | MyShishapedia',
        shelfDescription: 'Your personal shelf of favorite hookah flavors, sorted by collection. It is stored only in your browser.',
        tipsTitle: 'Tips for better hookah flavor: packing, heat, clouds | MyShishapedia',
        tipsDescription: 'How to pack the bowl, manage heat, get thicker clouds, use ice in the base and clean your hookah for a clean taste.',
        flavorsDescription: 'Every flavor in one place: search by name, brand or ingredient, filter by tag and collection, and sort by mint or sweetness.',
        searchTitle: 'Search | MyShishapedia',
        searchDescription: 'Search flavors, collections, mixes, glossary terms and the guide on MyShishapedia.',
        ogImageAlt: 'MyShishapedia: a hookah with rising smoke, surrounded by fruit',
        flavorTitle: '{brand} {name} - {ingredients} | MyShishapedia',
        mixerTitle: 'Flavor mixer - blend two hookah flavors | MyShishapedia',
        mixTitle: 'Mix {a} × {b} | MyShishapedia',
        mixerDescription: 'Blend two hookah flavors, set the ratio and see the combined colors, ingredients and flavor profile of your mix.',
        quizTitle: 'Quiz: which hookah flavor is right for you? | MyShishapedia',
        quizDescription: 'Answer six quick questions and find the hookah flavor that fits your taste best.',
        guideTitle: 'How to set up a hookah - beginner guide | MyShishapedia',
        guideDescription: 'Step by step: water, assembly, prepping the tobacco, packing the bowl, foil or HMD, coals, smoking and cleaning.',
        glossaryTitle: 'Hookah glossary - terms explained | MyShishapedia',
        glossaryDescription: 'HMD, phunnel, vortex, molasses, purge valve and more hookah terms, explained simply and clearly.',
        glossaryTermTitle: 'What is {term}? Hookah glossary | MyShishapedia',
        gearTitle: 'Hookah bowls and coals - differences and tips | MyShishapedia',
        gearDescription: 'Classic, phunnel or vortex bowl, natural coconut or quick-light coals, foil or HMD: what the differences are and what to pick.',
        aboutTitle: 'About - MyShishapedia',
        aboutDescription: 'Who is behind MyShishapedia and why this hookah flavor encyclopedia exists. Contact details and a note about brands.',
        notFoundTitle: 'Page not found | MyShishapedia',
        notFoundDescription: 'This page does not exist. Search the flavors or head back to the homepage.'
      },

      a11y: {
        skipToContent: 'Skip to content',
        homeLink: 'MyShishapedia, homepage',
        mainNav: 'Main navigation',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        menu: 'Menu',
        breadcrumbs: 'Breadcrumb',
        ingredientIllustration: 'Illustration: {name}',
        openFlavor: 'Open flavor {brand} {name}',
        outOf: '{value} out of {max}',
        langSwitch: 'Site language',
        langOther: 'Bosanska verzija'
      },

      hookah: {
        label: 'Hookah. Press and hold to take a pull.',
        pull: 'Hold to pull',
        strength: 'Pull strength',
        hint: 'Press and hold the hookah or the button, then let go.'
      },

      nav: {
        home: 'Home',
        flavors: 'Flavors',
        mixer: 'Mixer',
        quiz: 'Quiz',
        guide: 'Guide',
        glossary: 'Glossary',
        gear: 'Gear',
        about: 'About',
        collections: 'Collections',
        compare: 'Compare',
        mixes: 'Mixes',
        groupFlavors: 'Flavors',
        groupHookah: 'Hookah',
        groupOther: 'More',
        privacy: 'Privacy',
        terms: 'Terms of use',
        suggest: 'Suggest a flavor',
        search: 'Search',
        legalNav: 'Legal',
        menuFooter: 'The hookah flavor encyclopedia',
        allFlavors: 'All flavors',
        brands: 'Brands',
        top: 'Top rated',
        shelf: 'My shelf',
        tips: 'Tips',
        backToAll: 'Back to all flavors',
        tagline: 'Flavor encyclopedia'
      },

      collections: {
        eyebrow: 'Collections',
        title: 'Flavor collections',
        lead: 'Flavors grouped by vibe. Every collection fills itself based on each flavor\'s profile and tags.',
        count: { one: '{n} flavor', other: '{n} flavors' },
        open: 'Open collection',
        flavorsTitle: 'Flavors in this collection',
        allCollections: 'All collections',
        otherTitle: 'More collections',
        badgesLabel: 'Collections with this flavor',
        whyTitle: 'Why these flavors?',
        guideCta: 'Open the guide',
        homeTitle: 'Pick a mood',
        homeLead: 'Flavor collections by vibe, from icy to after-dark.',
        metaIn: 'Flavors: {list}.',
        empty: 'No flavors in this collection yet.'
      },

      compare: {
        eyebrow: 'Compare',
        title: 'Compare two flavors',
        lead: 'Pick any two flavors and see how their profiles and ingredients differ at a glance.',
        pickA: 'Left flavor',
        pickB: 'Right flavor',
        change: 'Change',
        pickerTitle: 'Pick a flavor',
        pickerSearch: 'Search flavors',
        pickerClose: 'Close picker',
        swap: 'Swap sides',
        tryMixer: 'Try them together in the mixer',
        share: 'Copy link',
        copied: 'Link copied.',
        copyFailed: 'Could not copy; grab the address from the browser bar.',
        openFlavor: 'Open {name}',
        verdictTitle: 'In short',
        profileTitle: 'Profiles head to head',
        ingredientsTitle: 'Ingredients',
        shared: 'Shared',
        onlyIn: 'Only {name}',
        noneShared: 'No shared ingredients.',
        noneOnly: 'Nothing unique.',
        popularTitle: 'Popular comparisons',
        compareWith: 'Compare with another flavor',
        flavorSectionTitle: 'Compare',
        flavorSectionIntro: 'How it stacks up against similar flavors.',
        vs: 'vs',
        adj: { sweetness: 'sweeter', freshness: 'fresher', fruitiness: 'fruitier', cooling: 'icier', strength: 'bolder' },
        and: ' and ',
        both: '{a} is {x}, while {b} is {y}.',
        one: '{a} is {x} than {b}.',
        close: '{a} and {b} have very similar profiles, so the difference is mostly in the ingredients.',
        same: '{a} and {b} have almost identical profiles.',
        sharedNote: 'Both have {list}.',
        onlyNote: 'Only in {name}: {list}.'
      },

      fotd: {
        eyebrow: 'Flavor of the day',
        sectionLabel: 'Flavor of the day',
        open: 'Open flavor',
        next: 'Next flavor in {h}h {m}m',
        nextMin: 'Next flavor in {m}m',
        tryMix: 'Try it in a mix',
        mixLink: '{name}: {parts}'
      },

      mixes: {
        eyebrow: 'Mixes',
        title: 'Mix recipes',
        lead: 'Flavor combos with a ratio, bowl-packing tips and a combined profile.',
        filtersTag: 'Filter by tag',
        filtersStrength: 'Filter by strength',
        all: 'All',
        strength: { light: 'Light', medium: 'Medium', strong: 'Strong' },
        strengthLabel: 'Strength',
        count: { one: '{n} mix', other: '{n} mixes' },
        empty: 'No mixes match these filters.',
        reset: 'Reset filters',
        open: 'Open mix',
        ratioTitle: 'Ratio',
        tipsTitle: 'Bowl tips',
        layout: { mixed: 'Mixed together', sectors: 'Packed in sectors' },
        layoutLabel: 'Packing',
        openMixer: 'Open in the mixer',
        aboutTitle: 'What it tastes like',
        ingredientsTitle: 'Combined ingredients',
        profileTitle: 'Combined profile',
        flavorsTitle: 'Flavors in this mix',
        bowlLabel: 'Bowl seen from above, split by ratio: {parts}',
        featuredTitle: 'Mix recipes',
        featuredLead: 'Three combos to get you started.',
        allMixes: 'All mixes',
        withFlavorTitle: 'Mixes with this flavor',
        withFlavorIntro: 'Blends that use this flavor.',
        otherTitle: 'More mixes',
        note: 'These mixes are suggestions. Taste is personal, so feel free to tweak the ratio.'
      },

      legal: {
        eyebrow: 'Legal',
        privacyTitle: 'Privacy policy',
        termsTitle: 'Terms of use',
        updated: 'Last updated: {date}',
        notLegal: 'This is a plain, honest summary. If anything is unclear, write to us.'
      },

      forms: {
        required: 'required',
        optional: 'optional',
        send: 'Send',
        sending: 'Sending...',
        honeypot: 'Leave this field empty',
        privacyNote: 'Email is optional and only used to reply. More in our',
        privacyLink: 'privacy policy',
        errRequired: 'This field is required.',
        errEmail: 'Enter a valid email or leave it empty.',
        errUrl: 'Enter a valid link (e.g. https://...) or leave it empty.',
        errSummary: 'Please check the highlighted fields.',
        errSend: 'Sending failed. Check your connection and try again.',
        successTitle: 'Thanks, your message is on its way!',
        successText: 'We will read it as soon as we can. If you left an email, we will get back to you.',
        mailtoTitle: 'Opening your email app',
        mailtoText: 'The message is already written. Just send it from your email app.',
        again: 'Send another one',
        noJs: 'Sending the form needs JavaScript. You can also write to us directly:',
        brand: 'Brand',
        brandHint: 'e.g. Adalya',
        name: 'Flavor name',
        nameHint: 'e.g. Love 66',
        ingredients: 'Ingredients (if you know them)',
        ingredientsHint: 'e.g. watermelon, melon, mint',
        comment: 'Comment',
        commentHint: 'Why you like it, where you tried it...',
        email: 'Your email',
        emailHint: 'so we can reply',
        suggestEyebrow: 'Suggest a flavor',
        suggestTitle: 'Missing a flavor?',
        suggestLead: 'Suggest it. We will check the ingredients and add it to the encyclopedia.',
        suggestSubject: 'Flavor suggestion: {brand} {name}',
        reportEyebrow: 'Report an issue',
        reportTitle: 'Something not right?',
        reportLead: 'Help keep the encyclopedia accurate. Every report gets checked.',
        reportSubject: 'Issue: {flavor}',
        flavor: 'Flavor',
        flavorPick: 'Pick a flavor',
        what: 'What is wrong?',
        whatComposition: 'Ingredients',
        whatDescription: 'Description',
        whatProfile: 'Flavor profile',
        whatOther: 'Something else',
        correct: 'Correct information',
        correctHint: 'What should it say?',
        source: 'Source link',
        sourceHint: 'https://...',
        reportButton: 'Report an issue'
      },

      search: {
        open: 'Search the site',
        shortcut: 'Ctrl K',
        label: 'Search flavors, mixes, terms...',
        placeholder: 'Flavor, ingredient, mix, term...',
        close: 'Close search',
        empty: 'No results for "{q}".',
        emptyHint: 'Try another name or ingredient. If a flavor is missing, suggest it.',
        suggestCta: 'Suggest "{q}"',
        start: 'Type at least two letters.',
        loading: 'Loading...',
        results: { one: '{n} result', other: '{n} results' },
        keys: '↑↓ to move, Enter to open, Esc to close',
        groups: {
          flavor: 'Flavors',
          brand: 'Brands',
          collection: 'Collections',
          recipe: 'Mixes',
          term: 'Glossary',
          guide: 'Guide',
          tips: 'Tips',
          gear: 'Gear',
          compare: 'Comparisons',
          page: 'Pages'
        },
        pageTitle: 'Search',
        pageLead: 'Search all of MyShishapedia.',
        noJs: 'Search needs JavaScript. Without it, try:'
      },

      flavorsPage: {
        eyebrow: 'Flavors',
        title: 'All flavors',
        lead: 'Search, filter and sort every flavor in the encyclopedia.',
        searchLabel: 'Search flavors',
        tagsLabel: 'Filter by tag',
        collectionsLabel: 'Filter by collection',
        brandsLabel: 'Filter by brand',
        brandAll: 'All brands',
        leafLabel: 'Filter by leaf type',
        leafAll: 'Any leaf',
        sortLabel: 'Sort by',
        sort: { az: 'A-Z', rating: 'Top rated', cooling: 'Most mint', sweetness: 'Sweetest', fruitiness: 'Fruitiest' },
        emptyTitle: 'No such flavor (yet)',
        emptyText: 'We could not find a flavor for this search and these filters. Maybe we do not have it yet?',
        suggestCta: 'Suggest this flavor',
        reset: 'Reset filters',
        suggestLine: 'Missing a flavor?'
      },

      ratings: {
        eyebrow: 'Ratings',
        topTitle: 'Top rated',
        topLead: 'The flavors and mixes visitors love most. Anything rated at least {n} times makes the list.',
        topFlavors: 'Flavors',
        topMixes: 'Mixes',
        topEmpty: 'Not enough ratings for this list yet. A flavor or mix makes the list once it has been rated at least {n} times.',
        topNote: 'A higher average ranks higher, and with the same average the one with more ratings comes first. Ratings are visitor opinions, not recommendations.',
        colAll: 'All collections',
        loading: 'Loading ratings…',
        ready: 'Rankings loaded.',
        unavailable: 'Ratings are not available right now. Please try again a bit later.',
        noJs: 'The rankings appear when JavaScript is turned on.',
        rateFlavor: 'Rate this flavor',
        rateRecipe: 'Rate this mix',
        starLabel: 'Rating {n} of 5',
        count: { one: '{n} rating', other: '{n} ratings' },
        none: 'No ratings yet. Yours could be the first.',
        avgSr: 'Average rating {avg} of 5, {count}',
        hint: 'Click a star to give your rating.',
        yours: 'Your rating: {n} of 5. You can change it.',
        sending: 'Sending your rating…',
        thanks: 'Thanks! Your rating ({n} of 5) has been saved.',
        changed: 'Your rating has been changed to {n} of 5.',
        same: 'That is already your rating.',
        errLimit: 'Too many ratings in a short time. Please try again in a few minutes.',
        errCheck: 'The bot check failed. Please try again.',
        errSend: 'Your rating was not sent. Check your connection and try again.'
      },

      shelf: {
        add: 'Add to shelf',
        remove: 'Remove from shelf',
        addAria: 'Add {name} to your shelf',
        removeAria: 'Remove {name} from your shelf',
        added: '{name} is on your shelf.',
        removed: '{name} is no longer on your shelf.',
        openShelf: 'Open shelf',
        eyebrow: 'Personal collection',
        title: 'My shelf',
        lead: 'The flavors you saved, sorted by collection. Your shelf lives only in your browser: no sign-in and nothing is sent anywhere.',
        count: { one: '{n} flavor on your shelf', other: '{n} flavors on your shelf' },
        jars: { one: '{n} jar', other: '{n} jars' },
        cabinetOpen: 'Open the cabinet',
        cabinetClose: 'Close the cabinet',
        cabinetHint: 'Click to open',
        inside: 'Shelves with flavor jars',
        other: 'Other',
        jarAria: '{name}, take a look',
        drawerAria: '{title}, {count}',
        close: 'Close',
        openFlavor: 'Open flavor',
        ings: 'Ingredients',
        emptyTitle: 'Your shelf is still empty',
        emptyText: 'Click the jar button on a flavor card or flavor page and it will be waiting for you here, in the cabinet. Everything stays in your browser.',
        emptyCta: 'Browse all flavors',
        emptyQuiz: 'Find a flavor with the quiz',
        noJs: 'The shelf works when JavaScript is turned on.'
      },

      recent: {
        title: 'Recently viewed',
        clear: 'Clear list',
        clearAria: 'Clear the list of recently viewed flavors',
        cleared: 'Your recently viewed list has been cleared.'
      },

      tips: {
        eyebrow: 'Tips',
        title: 'Tips for better flavor',
        lead: 'Short, practical tips on packing the bowl, heat, thicker clouds, ice in the base and cleaning. A small change often makes a big difference in taste.',
        navLabel: 'Tips contents',
        of: '{n} / {total}',
        numbersTitle: 'In numbers',
        moreTitle: 'More on this',
        moreGuide: 'Guide, step {n}: {title}',
        moreGear: 'Gear: {name}',
        moreTerm: 'Glossary: {term}',
        ctaTitle: 'Setting up a hookah for the first time?',
        ctaText: 'The guide walks you through it step by step, the glossary explains every term, and the gear page covers the differences between bowls and coals.',
        ctaGuide: 'Open the guide',
        ctaGlossary: 'Glossary',
        ctaGear: 'Bowls and coals',
        note: 'The numbers are rough guidelines: every hookah, bowl and tobacco behaves a little differently, so try and adjust.'
      },

      reco: {
        title: 'Recommended for you',
        lead: 'Based on your shelf, your ratings and the flavors you looked at.',
        because: 'Because you like {name}',
        similar: 'Similar to {name}'
      },

      share: {
        button: 'Share',
        title: 'Share card',
        story: 'Story (9:16)',
        square: 'Square (1:1)',
        formatLabel: 'Card format',
        preview: 'Share card preview: {name}',
        shareFile: 'Share image',
        download: 'Download image',
        copyLink: 'Copy link',
        copied: 'Link copied.',
        close: 'Close',
        making: 'Making your card...',
        failed: 'The card could not be created. Please try again.',
        myFlavor: 'My flavor is',
        match: '{n}% match',
        mix: 'Mix',
        ratio: 'Ratio'
      },

      ageGate: {
        eyebrow: 'Adults only',
        question: 'Are you 18 or older?',
        text: 'This site contains information about hookah tobacco and is intended for adults only.',
        yes: 'Yes, I am 18+',
        no: 'No',
        deniedTitle: 'Got it.',
        deniedText: 'This site is for adults only. Come back once you are 18.',
        back: 'Back to the question'
      },

      home: {
        eyebrow: 'The hookah flavor encyclopedia',
        titleA: 'Flavor,',
        titleEm: 'broken down',
        titleB: 'to its parts.',
        lead: 'Find out what the flavor in your bowl is actually made of.',
        searchLabel: 'Search flavors',
        searchPlaceholder: 'Type a flavor, brand or ingredient',
        searchClear: 'Clear search',
        searchHint: 'Press {key} to search',
        catalogTitle: 'All flavors',
        filtersLabel: 'Filter by tag',
        filterAll: 'All',
        count: { one: '{n} flavor', other: '{n} flavors' },
        emptyTitle: 'No flavors match this search',
        emptyText: 'Try another name, brand or ingredient, like “mint” or “pineapple”.',
        emptyReset: 'Clear search',
        comingSoonTitle: 'The encyclopedia is growing',
        comingSoonText: 'New flavors are on the way.'
      },

      leaf: {
        light: 'Blonde leaf',
        dark: 'Dark leaf',
        both: 'Blonde and dark leaf',
        lightNote: 'Milder, with less nicotine and easier for beginners.',
        darkNote: 'Stronger, with more nicotine. Made for experienced smokers, not for beginners.',
        more: 'What does that mean?'
      },

      brands: {
        eyebrow: 'Brands',
        title: 'Brands',
        lead: 'Every brand in the encyclopedia: where it comes from, what leaf it uses and which of its flavors we cover.',
        count: { one: '{n} brand', other: '{n} brands' },
        flavorsCount: { one: '{n} flavor', other: '{n} flavors' },
        filterLabel: 'Filter by leaf type',
        all: 'All',
        empty: 'No brands with this leaf type.',
        country: 'Country',
        leafLabel: 'Typical leaf',
        flavorsTitle: 'Flavors',
        aboutTitle: 'About the brand',
        disclaimer: 'MyShishapedia is not affiliated with or sponsored by {name}. We only use the brand name to describe its flavors.',
        otherTitle: 'Other brands',
        allBrands: 'All brands',
        metaIn: 'Flavors: {list}.'
      },

      flavor: {
        scrollCue: 'Scroll',
        ingredientsTitle: 'What it’s made of',
        ingredientsIntro: 'The ingredients and how strongly each one comes through.',
        ingredientsCount: { one: '{n} ingredient', other: '{n} ingredients' },
        intensity: 'Intensity',
        coalsNote: { one: '{n} of 5 coals lit', other: '{n} of 5 coals lit' },
        profileTitle: 'Flavor profile',
        profileIntro: 'Rated on a scale from 0 to 10.',
        aboutTitle: 'About this flavor',
        factsTitle: 'At a glance',
        factBrand: 'Brand',
        factFlavor: 'Flavor',
        factTobacco: 'Tobacco',
        factIngredients: 'Ingredients',
        factTags: 'Tags',
        mixesTitle: 'Mix ideas',
        mixesIntro: 'Combos worth trying.',
        similarTitle: 'Similar flavors',
        pagerLabel: 'Flavor navigation',
        prev: 'Previous flavor',
        next: 'Next flavor',
        listJoin: ', ',
        listLast: ' & '
      },

      profile: {
        sweetness: 'Sweetness',
        freshness: 'Freshness',
        fruitiness: 'Fruitiness',
        cooling: 'Mint / cooling',
        strength: 'Flavor strength'
      },

      tags: {
        vocni: 'Fruity',
        tropski: 'Tropical',
        mint: 'Mint',
        slatki: 'Sweet',
        ljetni: 'Summer',
        osvjezavajuci: 'Refreshing',
        nocni: 'Night',
        ledeni: 'Icy',
        biljni: 'Herbal',
        bombon: 'Candy',
        bobicasti: 'Berry',
        medeni: 'Honey',
        citrusni: 'Citrus',
        klasicni: 'Classic',
        zacinski: 'Spiced',
        desertni: 'Dessert',
        pice: 'Drinks'
      },

      notFound: {
        eyebrow: 'Error 404',
        title: 'This page went up in smoke',
        text: 'The page does not exist or the link has a typo. Search the flavors or head back home.',
        searchLabel: 'Search flavors',
        cta: 'Back to homepage'
      },

      footer: {
        tagline: 'The hookah flavor encyclopedia.',
        warningLabel: 'Warning',
        warning: 'Hookah tobacco contains nicotine, which is addictive.',
        disclaimer:
          'MyShishapedia is not affiliated with, endorsed or sponsored by any of the brands whose flavors are described. Brand and flavor names belong to their owners and are used for descriptive purposes only.',
        adults: 'This site is intended for adults only.',
        copyright: '© {year} MyShishapedia',
        madeBy: 'Made by',
        navLabel: 'Footer links'
      },

      explore: {
        eyebrow: 'Beyond flavors',
        title: 'Explore the world of hookah',
        mixerTitle: 'Flavor mixer',
        mixerText: 'Blend two flavors, set the ratio and see what your mix would look like.',
        quizTitle: 'Which flavor is for you?',
        quizText: 'Six quick questions and you get the flavor that fits your taste best.',
        guideTitle: 'Beginner guide',
        guideText: 'How to set up a hookah, step by step, from water to the first cloud.',
        cta: 'Open'
      },

      guide: {
        eyebrow: 'Beginner guide',
        title: 'How to set up a hookah',
        lead: 'Nine simple steps, from water in the base to your first cloud.',
        stepOf: 'Step {n} of {total}',
        stepsLabel: 'Guide steps',
        goToStep: 'Step {n}: {title}',
        prev: 'Back',
        next: 'Next',
        finish: 'Start over',
        progress: 'Guide progress',
        swipeHint: 'Swipe left or right for the next step',
        keysHint: 'Use the left and right arrow keys to change steps',
        tipLabel: 'Tip',
        sceneLabel: 'Step animation: {title}',
        safetyEyebrow: 'Safety first',
        stepParam: 'step'
      },

      glossary: {
        eyebrow: 'Glossary',
        title: 'Hookah terms',
        lead: 'Every word you will hear at a hookah lounge, explained simply.',
        searchLabel: 'Search terms',
        searchPlaceholder: 'Type a term, e.g. HMD or molasses',
        lettersLabel: 'Jump to letter',
        count: { one: '{n} term', other: '{n} terms' },
        empty: 'No term matches that search.',
        seeGuide: 'See it in the guide',
        seeGear: 'See it in gear',
        openTerm: 'Open term page',
        related: 'Related',
        also: 'Also known as',
        allTerms: 'All terms',
        otherTerms: 'More terms'
      },

      gear: {
        eyebrow: 'Gear',
        title: 'Bowls and coals',
        lead: 'How bowls and coals differ and how they change the flavor. No overcomplicating.',
        bowlsTitle: 'Bowls',
        bowlsIntro: 'The bowl holds the tobacco. Its shape decides how heat spreads and where the juice goes.',
        coalsTitle: 'Coals',
        coalsIntro: 'Coals provide the heat. The type of coal affects the taste and how easy it is to keep the heat steady.',
        heatTitle: 'Heat: foil or HMD',
        heatIntro: 'Between the coals and the tobacco sits either foil or an HMD. Both work; the difference is control and convenience.',
        suits: 'Best for',
        pros: 'Pros',
        cons: 'Cons',
        compareTitle: 'Compare',
        compareIntro: 'Pick two items and see them side by side.',
        compareBowls: 'Bowls',
        compareCoals: 'Coals',
        compareHeat: 'Foil & HMD',
        compareLeft: 'First',
        compareRight: 'Second',
        recommendTitle: 'Our pick for beginners',
        cutawayLabel: 'Cutaway: {name}. Heat travels down through the tobacco, and the juice {juice}.',
        legendHeat: 'heat',
        legendJuice: 'tobacco juice',
        ratingNote: 'Ratings are rough estimates (1 to 5 coals), not measurements.',
        warning: 'Heads up'
      },

      mixer: {
        eyebrow: 'Flavor mixer',
        title: 'Blend two flavors',
        lead: 'Pick two flavors and move the slider. Colors, ingredients and profile update live.',
        pickA: 'First flavor',
        pickB: 'Second flavor',
        change: 'Change',
        pickerTitle: 'Pick a flavor',
        pickerSearch: 'Search flavors',
        pickerClose: 'Close picker',
        ratio: 'Ratio',
        ratioText: '{a} percent {nameA}, {b} percent {nameB}',
        surprise: 'Surprise me',
        share: 'Copy link to this mix',
        copied: 'Link copied',
        copyFailed: 'Copy the address from your browser bar',
        ingredientsTitle: 'Mix ingredients',
        shared: 'in both',
        profileTitle: 'Mix profile',
        ideasTitle: 'Suggested combos',
        ideasFrom: 'From the {name} page',
        tryIdea: 'Try this combo',
        disclaimer: 'This is a visual estimate. How a mix really tastes also depends on how you pack the bowl and manage heat.',
        stageLabel: 'Animation: smoke from {a} and {b} merging into one cloud',
        descStart: '{name} is a mix led by {main}.',
        descSharedOne: 'Both flavors share {item}, so it really stands out.',
        descShared: 'Both flavors share {items}, so they really stand out.',
        descCool: 'The cooling is strong.',
        descSweet: 'It leans quite sweet.',
        descFresh: 'The finish is fresh and light.',
        descBalance: 'The ratio is even, so both flavors come through equally.',
        descCooler: '{name} is almost pure chill, so keep it to a small share, around 10 to 20 percent.',
        descLean: '{name} comes through more.',
        and: 'and'
      },

      quiz: {
        eyebrow: 'Quiz',
        title: 'Which flavor is for you?',
        lead: 'Six quick questions. There are no wrong answers.',
        start: 'Start the quiz',
        questionOf: 'Question {n} of {total}',
        back: 'Previous question',
        next: 'Next',
        seeResult: 'Show my result',
        resultEyebrow: 'Your flavor',
        match: '{n}% match',
        why: 'Why',
        alternatives: 'You might also like',
        openFlavor: 'Open flavor',
        tryMixer: 'Try it in the mixer',
        restart: 'Retake the quiz',
        reasonJoin: ' and ',
        reasonPrefix: 'You like ',
        noJs: 'The quiz needs JavaScript. In the meantime, browse all flavors.'
      },

      about: {
        eyebrow: 'About',
        title: 'Behind the smoke',
        contactTitle: 'Contact',
        contactText: 'Got an idea for a new flavor, a correction, or just want to say hi?',
        contactCta: 'Contact me',
        contactPlain: 'Email: {email}'
      },

      root: {
        title: 'MyShishapedia - the hookah flavor encyclopedia',
        choose: 'Choose your language',
        bs: 'Bosanski',
        en: 'English'
      },

      noscript: 'Some parts (animations, the mixer, the quiz) only work with JavaScript turned on.'
    }
  };

  MSP.strings = STRINGS;
  MSP.LANGS = ['bs', 'en'];
  if (!MSP.lang) MSP.lang = 'bs';

  function lookup(path, lang) {
    var parts = String(path).split('.');
    var node = STRINGS[lang || MSP.lang] || STRINGS.bs;
    for (var i = 0; i < parts.length; i++) {
      if (node == null) break;
      node = node[parts[i]];
    }
    return node;
  }

  function fill(str, vars) {
    if (!vars) return str;
    return String(str).replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m;
    });
  }

  /** Vraća tekst za ključ (npr. 'home.lead') na trenutnom jeziku, sa popunjenim {placeholderima}. */
  MSP.t = function (path, vars) {
    var s = lookup(path);
    if (typeof s !== 'string') {
      if (root.console) root.console.warn('[strings] Nedostaje tekst za ključ: ' + path + ' (' + MSP.lang + ')');
      return path;
    }
    return fill(s, vars);
  };

  /**
   * Množina. Bosanski: one (1, 21...), few (2-4, 22-24...), other.
   * Engleski: one (1), other.
   */
  MSP.plural = function (path, n, vars) {
    var forms = lookup(path) || {};
    var form = 'other';
    if (MSP.lang === 'en') {
      form = n === 1 ? 'one' : 'other';
    } else {
      var m10 = n % 10;
      var m100 = n % 100;
      if (m10 === 1 && m100 !== 11) form = 'one';
      else if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) form = 'few';
    }
    var str = forms[form] || forms.other || '';
    var v = { n: n };
    if (vars) for (var k in vars) v[k] = vars[k];
    return fill(str, v);
  };

  /** Naziv taga iz ključa; ako prevod ne postoji, vraća sam ključ. */
  MSP.tagLabel = function (key) {
    var s = lookup('tags.' + key);
    return typeof s === 'string' ? s : key;
  };

  /**
   * Lokalizuje vrijednost iz data fajlova: { bs: ..., en: ... } -> vrijednost na trenutnom
   * jeziku (ako prevoda nema, koristi bosanski). Obične vrijednosti vraća nepromijenjene.
   */
  MSP.L = function (v, lang) {
    if (v && typeof v === 'object' && !Array.isArray(v) && ('bs' in v || 'en' in v)) {
      var l = lang || MSP.lang;
      return v[l] != null ? v[l] : v.bs;
    }
    return v;
  };
})(typeof window !== 'undefined' ? window : globalThis);
