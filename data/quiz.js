/*
 * MyShishapedia - kviz "Koji okus je za tebe?" (oba jezika).
 *
 * Kviz NE zna ništa o pojedinačnim okusima. Svaki odgovor opisuje samo:
 *   target  željene vrijednosti profila (sweetness, freshness, fruitiness, cooling, strength; 0-10)
 *   tags    tagovi koji se "nagrađuju" i koliko (npr. { ledeni: 2 })
 *   reason  dio rečenice za objašnjenje rezultata ("Voliš ... i ...")
 *   onlyLeaf  (neobavezno) preporučuju se SAMO okusi sa ovom vrstom lista ('light'),
 *             npr. početnik nikad ne dobije tamni list
 *   leafBonus (neobavezno) blaga prednost za vrstu lista, npr. { dark: 1 }
 * Rezultat se računa poređenjem sa `profile` i `tags` svih okusa iz data/flavors.js,
 * pa novi okusi automatski ulaze u kviz (vidi docs/UPUTSTVO.md, "Kako radi kviz").
 */
window.QUIZ = [
  {
    id: 'iskustvo',
    question: { bs: 'Koliko dugo pušiš nargilu?', en: 'How long have you been smoking hookah?' },
    weight: 0.8,
    answers: [
      { id: 'pocetnik', label: { bs: 'Tek počinjem', en: 'Just starting out' }, icon: 'sprout', reason: { bs: 'blaže okuse za početak', en: 'milder flavors to start with' }, target: { strength: 4 }, onlyLeaf: 'light' },
      { id: 'povremeno', label: { bs: 'Povremeno', en: 'Now and then' }, icon: 'cup', reason: { bs: '', en: '' }, target: { strength: 6 } },
      { id: 'iskusan', label: { bs: 'Već godinama', en: 'For years' }, icon: 'crown', reason: { bs: 'jače okuse', en: 'stronger flavors' }, target: { strength: 8 }, leafBonus: { dark: 1 } }
    ]
  },
  {
    id: 'menta',
    question: { bs: 'Koliko voliš mentu?', en: 'How much do you like mint?' },
    weight: 1.6,
    answers: [
      { id: 'nikako', label: { bs: 'Nikako', en: 'Not at all' }, icon: 'no-mint', reason: { bs: 'okuse bez mente', en: 'flavors without mint' }, target: { cooling: 0 } },
      { id: 'malo', label: { bs: 'Malo', en: 'A little' }, icon: 'leaf', reason: { bs: 'tek malo mente', en: 'just a hint of mint' }, target: { cooling: 3 } },
      { id: 'puno', label: { bs: 'Puno', en: 'A lot' }, icon: 'leaves', reason: { bs: 'mentu', en: 'mint' }, target: { cooling: 7 }, tags: { mint: 1 } },
      { id: 'ledeno', label: { bs: 'Što ledenije to bolje', en: 'The icier the better' }, icon: 'snow', reason: { bs: 'ledeno', en: 'it icy' }, target: { cooling: 10, freshness: 10 }, tags: { ledeni: 2 } }
    ]
  },
  {
    id: 'slatko',
    question: { bs: 'Slatko ili svježe?', en: 'Sweet or fresh?' },
    weight: 1.2,
    answers: [
      { id: 'slatko', label: { bs: 'Slatko', en: 'Sweet' }, icon: 'drop', reason: { bs: 'slatko', en: 'it sweet' }, target: { sweetness: 9 }, tags: { slatki: 1 } },
      { id: 'svjeze', label: { bs: 'Svježe', en: 'Fresh' }, icon: 'wave', reason: { bs: 'svježe', en: 'it fresh' }, target: { freshness: 9 } },
      { id: 'oboje', label: { bs: 'Pola-pola', en: 'Half and half' }, icon: 'balance', reason: { bs: 'balans slatkog i svježeg', en: 'a balance of sweet and fresh' }, target: { sweetness: 7, freshness: 7 } }
    ]
  },
  {
    id: 'vrsta',
    question: { bs: 'Voće ili bomboni?', en: 'Fruit or candy?' },
    weight: 1.2,
    answers: [
      { id: 'voce', label: { bs: 'Voće', en: 'Fruit' }, icon: 'fruit', reason: { bs: 'voće', en: 'fruit' }, target: { fruitiness: 9 }, tags: { vocni: 1.5 } },
      { id: 'bomboni', label: { bs: 'Bomboni', en: 'Candy' }, icon: 'candy', reason: { bs: 'bombone', en: 'candy' }, target: { fruitiness: 3, sweetness: 8 }, tags: { bombon: 3 } },
      { id: 'svejedno', label: { bs: 'Svejedno', en: 'Either' }, icon: 'both', reason: { bs: '', en: '' }, target: {} }
    ]
  },
  {
    id: 'jacina',
    question: { bs: 'Koliko jak okus voliš?', en: 'How strong do you like the flavor?' },
    weight: 1,
    answers: [
      { id: 'lagan', label: { bs: 'Lagan', en: 'Light' }, icon: 'flame-1', reason: { bs: 'lagane okuse', en: 'light flavors' }, target: { strength: 4 } },
      { id: 'srednji', label: { bs: 'Srednji', en: 'Medium' }, icon: 'flame-2', reason: { bs: 'srednje jake okuse', en: 'medium-strength flavors' }, target: { strength: 6 } },
      { id: 'jak', label: { bs: 'Jak', en: 'Strong' }, icon: 'flame-3', reason: { bs: 'jake okuse', en: 'bold flavors' }, target: { strength: 8 } }
    ]
  },
  {
    id: 'atmosfera',
    question: { bs: 'Kakva je atmosfera?', en: 'What is the vibe?' },
    weight: 0.8,
    answers: [
      { id: 'ljeto', label: { bs: 'Ljetni dan', en: 'Summer day' }, icon: 'sun', reason: { bs: 'ljetne okuse', en: 'summery flavors' }, target: { freshness: 8 }, tags: { ljetni: 1.5, tropski: 1 } },
      { id: 'noc', label: { bs: 'Noćni izlazak', en: 'Night out' }, icon: 'moon', reason: { bs: 'noćnu atmosferu', en: 'a night-out vibe' }, target: { strength: 7 }, tags: { nocni: 2 } },
      { id: 'opustanje', label: { bs: 'Opuštanje', en: 'Chilling out' }, icon: 'sofa', reason: { bs: 'opušten, sladak ugođaj', en: 'a laid-back, sweet mood' }, target: { sweetness: 7 }, tags: { slatki: 1, medeni: 1 } }
    ]
  }
];
