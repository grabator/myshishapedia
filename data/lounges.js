/*
 * MyShishapedia - lounge meniji.
 *
 * Svaki lounge dobije svoju stranicu (/bs/lounge/<id>/, /en/lounge/<id>/) sa ponudom nargila:
 * pretraga, filteri, "Šta pušiti večeras?", kućni miksevi i "zašto ide". Opisi, sastojci,
 * profil okusa, preporuke i objašnjenja se računaju iz data/flavors.js, pa ovdje ide samo:
 *
 *   id        dio adrese (mala slova, brojevi, crtica)
 *   demo      true = izmišljeni lounge za prikaz (oznaka "Demo", Google ga ne indeksira)
 *   name      ime lounge-a; logo je prvo slovo (ili `mark`)
 *   nameIn    bosanski padeži: { loc: 'Babylonu' (u ...), gen: 'Babylona' (ponuda ...) }
 *   tagline, hours, price   tekst { bs, en }
 *   colors    [glavna, tamnija] boja lounge-a
 *   flavors   okusi u ponudi: { id, tag } gdje je tag 'top' | 'new' | 'out' (nema danas) ili ništa
 *   top       id-jevi za "Najtraženije večeras" (redom)
 *   mixes     kućni miksevi: { id, name, parts: [[idOkusa, postotak], ...] }
 *
 * Kad lounge javi promjenu (novi okus, nema okusa, nova cijena), mijenja se samo ovaj fajl.
 */
window.LOUNGES = [
  {
    id: 'babylon',
    demo: true,
    name: 'Babylon',
    nameIn: { loc: 'Babylonu', gen: 'Babylona' },
    tagline: { bs: 'Shisha lounge', en: 'Shisha lounge' },
    hours: { bs: 'Otvoreno do 01:00', en: 'Open until 1 am' },
    price: { bs: 'Nargila 15 KM', en: 'Hookah 15 KM' },
    colors: ['#e0b25e', '#8a5a1f'],
    flavors: [
      { id: 'adalya-love-66', tag: 'top' },
      { id: 'adalya-blue-ice', tag: 'top' },
      { id: 'musthave-pinkman', tag: 'new' },
      { id: 'adalya-dubai' },
      { id: 'adalya-raspberry' },
      { id: 'adalya-lady-killer' },
      { id: 'adalya-ice-bonbon' },
      { id: 'adalya-mint' },
      { id: 'adalya-hawaii' },
      { id: 'adalya-cherry-mint' },
      { id: 'al-fakher-double-apple', tag: 'out' },
      { id: 'al-fakher-grape-mint' },
      { id: 'al-fakher-watermelon-mint' },
      { id: 'al-fakher-mint' },
      { id: 'musthave-sweet-peach' },
      { id: 'musthave-earl-grey' },
      { id: 'musthave-cacao' },
      { id: 'musthave-watermelon' },
      { id: 'musthave-strawberry-lychee', tag: 'new' },
      { id: 'musthave-mandarin' },
      { id: 'musthave-forest-berries' },
      { id: 'musthave-cola' },
      { id: 'darkside-supernova' },
      { id: 'fumari-white-gummi-bear' },
      { id: 'tangiers-kashmir-peach', tag: 'out' },
      { id: 'starbuzz-blue-mist' }
    ],
    top: ['adalya-love-66', 'adalya-blue-ice', 'musthave-pinkman'],
    mixes: [
      { id: 'babylon-sunset', name: 'Babylon Sunset', parts: [['adalya-love-66', 60], ['adalya-dubai', 40]] },
      { id: 'ice-berry', name: 'Ice Berry', parts: [['adalya-blue-ice', 50], ['adalya-raspberry', 50]] },
      { id: 'peach-tea', name: 'Peach Tea', parts: [['musthave-sweet-peach', 60], ['musthave-earl-grey', 40]] },
      { id: 'pink-frost', name: 'Pink Frost', parts: [['musthave-pinkman', 80], ['darkside-supernova', 20]] }
    ]
  }
];
