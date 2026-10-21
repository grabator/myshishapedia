/*
 * MyShishapedia - "Evolucija nargile": stanice, nazivi, dijelovi, mitovi i izvori (oba jezika).
 *
 * Pravilo: svaka tvrdnja ima izvor (broj u `src` je id iz `sources`). Gdje se izvori razlikuju,
 * tekst to kaže; legenda se zove legendom. Ništa se ne dopisuje bez izvora.
 *
 * Stanica:
 *   id        sidro (#<id>), isto na oba jezika
 *   year      godina za kameru, brojač i stil mape (stara karta < 1850, štampana < 1985, moderna poslije)
 *   when      kako se godina ispisuje (može biti raspon ili "oko")
 *   lon, lat  tačka na globusu
 *   zoom      koliko se kamera spusti (1 = cijela Zemlja)
 *   place     država/carstvo i grad; old: historijsko ime grada (piše se na staroj karti)
 *   name      lokalni naziv nargile na toj stanici
 *   art       ilustracija nargile: qalyan, huqqa, bidri, nargile, coconut, glass, egypt, modern
 *   sky       silueta grada: niz oblika (vidi js/history.js, SKY)
 *   title, facts [{ t, src }], fun { t, src }
 */
window.HISTORY = {
  stations: [
    {
      id: 'isfahan', year: 1560, lon: 51.67, lat: 32.65, zoom: 5.2,
      when: { bs: 'oko 1560-1629.', en: 'c. 1560-1629' },
      place: { bs: 'Perzija (Safavidi) · Isfahan', en: 'Persia (Safavids) · Isfahan' }, city: { bs: 'Isfahan', en: 'Isfahan' }, old: 'Ispahan',
      name: 'qalyan', art: 'qalyan',
      sky: ['arcade:.04:.96:.16', 'minaret:.12:.62', 'dome:.22:.15:.50', 'minaret:.32:.62', 'dome:.66:.11:.34', 'minaret:.86:.48'],
      title: { bs: 'Prvi pouzdani tragovi', en: 'The first reliable traces' },
      facts: [
        { t: { bs: 'Duhan su u Perziju, kako se navodi, donijeli Portugalci početkom 16. stoljeća.', en: 'Tobacco was reportedly brought to Persia by the Portuguese in the early 16th century.' }, src: [3] },
        { t: { bs: 'Pjesnik Ahli Širazi (umro 1535) spominje qalyan, ali Encyclopaedia Iranica upozorava da nema dokaza da je vodena lula postojala prije 1560-ih. Možda se tada pušilo nešto drugo.', en: 'The poet Ahli Shirazi (d. 1535) mentions the qalyan, but Encyclopaedia Iranica notes there is no evidence of the water pipe before the 1560s. Something else may have been smoked.' }, src: [2] },
        { t: { bs: 'Šah Abbas I (vladao 1588-1629) nije volio duhan i zabranio ga je, ali ljudi su ga i dalje koristili.', en: 'Shah Abbas I (r. 1588-1629) disliked tobacco and banned it, yet people kept using it.' }, src: [3] }
      ],
      fun: { t: { bs: 'Francuski putnik Jean Chardin i drugi savremenici zapisali su da se u Perziji pušilo na sve strane, uprkos zabrani.', en: 'The French traveller Jean Chardin and other contemporaries recorded that smoking was everywhere in Persia, despite the ban.' }, src: [4] }
    },
    {
      id: 'agra', year: 1604, lon: 77.66, lat: 27.09, zoom: 5.2,
      when: { bs: '1604.', en: '1604' },
      place: { bs: 'Indija (Mughali) · Agra i Fatehpur Sikri', en: 'India (Mughals) · Agra and Fatehpur Sikri' }, city: { bs: 'Agra', en: 'Agra' }, old: 'Agra',
      name: 'huqqa', art: 'huqqa',
      sky: ['wall:.02:.98:.14', 'chhatri:.22:.34', 'gate:.42:.20:.62', 'chhatri:.62:.34', 'dome:.80:.10:.30'],
      title: { bs: 'Duhan stiže na dvor cara Akbara', en: 'Tobacco reaches Emperor Akbar\'s court' },
      facts: [
        { t: { bs: 'Asad Beg, Akbarov izaslanik u Bidžapuru, vratio se 1604. sa duhanom i lulom ukrašenom draguljima i ponudio ih caru.', en: 'Asad Beg, Akbar\'s envoy to Bijapur, returned in 1604 with tobacco and a jewelled pipe and offered them to the emperor.' }, src: [1] },
        { t: { bs: 'Predaja kaže da je dvorski ljekar Abul-Fath Gilani smislio da se dim "pročisti" kroz vodu. To je priča, a ne dokument.', en: 'Tradition says the court physician Abul-Fath Gilani came up with "purifying" the smoke through water. It is a story, not a document.' }, src: [1, 2] },
        { t: { bs: 'Riječ hookah dolazi preko hindustanskog huqqa od arapske riječi ḥuqqa, za posudu vodene lule.', en: 'The word hookah comes via Hindustani huqqa from the Arabic ḥuqqa, the vessel of a water pipe.' }, src: [6] }
      ],
      fun: { t: { bs: 'Iranica navodi da je Gilani umro 1588, a duhan na dvor stiže tek 1604. Zato se legenda teško slaže sa datumima.', en: 'Iranica gives Gilani\'s death as 1588, while tobacco only reaches the court in 1604. That is why the legend hardly fits the dates.' }, src: [2, 1] }
    },
    {
      id: 'istanbul', year: 1633, lon: 28.98, lat: 41.01, zoom: 5.6,
      when: { bs: '1633.', en: '1633' },
      place: { bs: 'Osmansko carstvo · Istanbul', en: 'Ottoman Empire · Istanbul' }, city: { bs: 'Istanbul', en: 'Istanbul' }, old: 'Constantinopolis',
      name: 'nargile', art: 'nargile',
      sky: ['minaret:.12:.66', 'halfdome:.22:.10:.24', 'dome:.32:.16:.42', 'halfdome:.42:.10:.24', 'minaret:.52:.72', 'minaret:.58:.66', 'dome:.74:.12:.32', 'minaret:.88:.58'],
      title: { bs: 'Požar, kafane i smrtna kazna', en: 'A fire, coffeehouses and the death penalty' },
      facts: [
        { t: { bs: 'Prema historičaru Refiku Ahmetu Sevengilu, duhan stiže u Istanbul oko 1600.', en: 'According to historian Refik Ahmet Sevengil, tobacco reached Istanbul around 1600.' }, src: [12] },
        { t: { bs: 'Godine 1633. veliki požar u četvrti Cibali, koji je izazvao čovjek zaspao sa lulom na brodu, uništio je više od 20.000 kuća.', en: 'In 1633 a great fire in the Cibali quarter, started by a man who fell asleep with his pipe on a boat, destroyed more than 20,000 homes.' }, src: [9] },
        { t: { bs: 'Sultan Murad IV zatvara kafane i uvodi smrtnu kaznu za javno pušenje duhana.', en: 'Sultan Murad IV closes the coffeehouses and introduces the death penalty for smoking tobacco in public.' }, src: [9, 10] }
      ],
      fun: { t: { bs: 'Procjene broja pogubljenih se razlikuju od nekoliko desetina hiljada do brojki koje niko ne može provjeriti. Zabranu je ukinuo tek njegov nasljednik Ibrahim.', en: 'Estimates of how many were executed range from tens of thousands to figures nobody can verify. Only his successor Ibrahim lifted the ban.' }, src: [10, 11] }
    },
    {
      id: 'bidar', year: 1685, lon: 77.52, lat: 17.91, zoom: 5.2,
      when: { bs: 'kasno 17. st.', en: 'late 17th c.' },
      place: { bs: 'Indija (Dekan) · Bidar', en: 'India (Deccan) · Bidar' }, city: { bs: 'Bidar', en: 'Bidar' }, old: 'Bidar',
      name: 'huqqa', art: 'bidri',
      sky: ['wall:.0:1:.16', 'minaret:.30:.74', 'arcade:.40:.76:.24', 'dome:.60:.10:.36', 'tower:.88:.06:.32'],
      title: { bs: 'Bidri: nargila kao umjetnost', en: 'Bidri: the hookah as art' },
      facts: [
        { t: { bs: 'U gradu Bidaru su se pravile posude za huqqu od legure cinka, gravirane i ukrašene umetnutim mesingom. Po gradu se ta tehnika zove bidri.', en: 'In the city of Bidar, huqqa bases were made of zinc alloy, engraved and inlaid with brass. The technique is named bidri after the city.' }, src: [7] },
        { t: { bs: 'Metropolitan muzej u New Yorku čuva takvu posudu sa perunikama iz kasnog 17. stoljeća (inv. br. 1984.221).', en: 'The Metropolitan Museum in New York holds such a base with irises from the late 17th century (acc. no. 1984.221).' }, src: [7] },
        { t: { bs: 'Rane posude iz Bidara su gotovo uvijek okrugle kao kugla, a poznato je tek nekoliko jajolikih.', en: 'Early Bidar bases are almost always spherical; only one or two ovoid examples are known.' }, src: [8] }
      ],
      fun: { t: { bs: 'Posuda iz Meta je visoka samo 17,5 cm. Nargila je tada bila komad nakita za kuću.', en: 'The Met base is only 17.5 cm tall. The hookah was then a piece of jewellery for the home.' }, src: [7] }
    },
    {
      id: 'kairo-fishawy', year: 1797, lon: 31.26, lat: 30.05, zoom: 5.8,
      when: { bs: '1771. ili 1797.', en: '1771 or 1797' },
      place: { bs: 'Egipat · Kairo, Khan el-Khalili', en: 'Egypt · Cairo, Khan el-Khalili' }, city: { bs: 'Kairo', en: 'Cairo' }, old: 'Al-Qahira',
      name: 'shisha', art: 'glass',
      sky: ['minaret:.08:.62', 'dome:.20:.10:.34', 'minaret:.32:.76', 'arcade:.38:.62:.18', 'dome:.52:.12:.40', 'minaret:.66:.56', 'dome:.80:.09:.28', 'minaret:.92:.48'],
      title: { bs: 'Kafana koja radi preko dva stoljeća', en: 'A café open for over two centuries' },
      facts: [
        { t: { bs: 'Kafana El Fishawy u bazaru Khan el-Khalili otvorena je 1771. ili 1797, zavisno od izvora, i vodi je ista porodica kroz generacije.', en: 'El Fishawy café in the Khan el-Khalili bazaar opened in 1771 or 1797, depending on the source, and has been run by the same family for generations.' }, src: [20, 21, 19] },
        { t: { bs: 'Nobelovac Naguib Mahfouz bio je stalni gost i tamo je pisao dijelove svoje čuvene trilogije.', en: 'Nobel laureate Naguib Mahfouz was a regular and wrote parts of his famous trilogy there.' }, src: [20, 21] },
        { t: { bs: 'Edward Lane 1836. bilježi da imućniji Egipćani puše lulu "nargila", jer joj je posuda za vodu kokos, a verziju sa staklenom posudom zovu "šiša".', en: 'In 1836 Edward Lane records that wealthier Egyptians smoke the "nargila", because its water vessel is a coconut, while the glass version is called "shisha".' }, src: [18] }
      ],
      fun: { t: { bs: 'Riječ shisha dolazi od perzijskog šīša, staklo. U arapski je došla preko osmanskog turskog şişe, boca.', en: 'The word shisha comes from Persian šīša, glass. It reached Arabic through Ottoman Turkish şişe, bottle.' }, src: [42] }
    },
    {
      id: 'sana', year: 1880, lon: 44.21, lat: 15.35, zoom: 5.6,
      when: { bs: '1860-1920.', en: '1860-1920' },
      place: { bs: 'Jemen · Sana\'a', en: 'Yemen · Sana\'a' }, city: { bs: 'Sana\'a', en: 'Sana\'a' }, old: 'Sanaa',
      name: '', art: 'coconut',
      sky: ['house:.08:.08:.40', 'house:.18:.07:.56', 'house:.27:.08:.46', 'minaret:.38:.70', 'house:.48:.09:.60', 'house:.58:.07:.42', 'house:.68:.08:.52', 'house:.80:.07:.38'],
      title: { bs: 'Kokos i mesing', en: 'Coconut and brass' },
      facts: [
        { t: { bs: 'Amsterdamski muzej lula čuva vodenu lulu od kokosa i mesinga iz perioda 1860-1920. Stručnjaci je opisuju kao jemensku.', en: 'The Amsterdam Pipe Museum holds a coconut-and-brass water pipe from 1860-1920, which experts describe as Yemenite.' }, src: [15] },
        { t: { bs: 'Britanski muzej ima u zbirci i jemenske vodene lule iz 1970-ih.', en: 'The British Museum also holds Yemeni water pipes from the 1970s.' }, src: [16] },
        { t: { bs: 'Riječ nargila dolazi od perzijskog nārgīl, kokos, jer je prva posuda za vodu bila od kokosove ljuske.', en: 'The word narghile comes from Persian nārgīl, coconut, because the first water vessel was a coconut shell.' }, src: [5] }
      ],
      fun: { t: { bs: 'Kokos kao posuda nije nestao sa prvim nargilama: muzeji imaju primjerke iz Jemena i Egipta s kraja 19. stoljeća.', en: 'The coconut vessel did not vanish with the first hookahs: museums hold examples from Yemen and Egypt from the late 19th century.' }, src: [15, 17] }
    },
    {
      id: 'teheran', year: 1891, lon: 51.39, lat: 35.69, zoom: 5.4,
      when: { bs: '1890-1892.', en: '1890-1892' },
      place: { bs: 'Perzija (Kadžari) · Teheran', en: 'Persia (Qajars) · Tehran' }, city: { bs: 'Teheran', en: 'Tehran' }, old: 'Teheran',
      name: 'qalyan', art: 'qalyan',
      sky: ['mountain:.0:1:.46', 'tower:.22:.06:.42', 'arcade:.30:.66:.20', 'tower:.70:.06:.42', 'dome:.84:.10:.28'],
      title: { bs: 'Bojkot koji je pobijedio šaha', en: 'The boycott that beat the shah' },
      facts: [
        { t: { bs: 'U martu 1890. šah Naser al-Din daje Britancu G. F. Talbotu monopol na proizvodnju, prodaju i izvoz duhana na 50 godina.', en: 'In March 1890 Shah Naser al-Din grants the Briton G. F. Talbot a monopoly on tobacco production, sale and export for 50 years.' }, src: [13] },
        { t: { bs: 'Od duhana je tada živjelo više od 200.000 ljudi u Perziji.', en: 'More than 200,000 people in Persia then made a living from tobacco.' }, src: [13] },
        { t: { bs: 'U decembru 1891. Mirza Hasan Širazi izdaje fetvu protiv upotrebe duhana i bojkot se širi zemljom. Koncesija je ukinuta u januaru 1892.', en: 'In December 1891 Mirza Hasan Shirazi issues a fatwa against using tobacco and the boycott spreads across the country. The concession is cancelled in January 1892.' }, src: [13, 14] }
      ],
      fun: { t: { bs: 'Bojkot su poštovale čak i šahove žene u palati.', en: 'Even the shah\'s own wives in the palace kept the boycott.' }, src: [13] }
    },
    {
      id: 'bejrut', year: 1965, lon: 35.50, lat: 33.89, zoom: 5.8,
      when: { bs: '1950-e do 1980-ih', en: '1950s to 1980s' },
      place: { bs: 'Liban · Bejrut i Tripoli', en: 'Lebanon · Beirut and Tripoli' }, city: { bs: 'Bejrut', en: 'Beirut' }, old: 'Beyrouth',
      name: 'argileh', art: 'glass',
      sky: ['block:.04:.14:.26', 'tower:.20:.05:.46', 'block:.26:.32:.34', 'clock:.46:.56', 'block:.56:.64:.28', 'palm:.72:.36', 'block:.80:.88:.38'],
      title: { bs: 'Argileh i kafanski razgovori', en: 'Argileh and café talk' },
      facts: [
        { t: { bs: 'Istraživanje Američkog univerziteta u Bejrutu opisuje bejrutsku kafanu od 1950-ih do 1980-ih kao mjesto gdje se stvarao kulturni život grada.', en: 'Research at the American University of Beirut describes the Beirut café of the 1950s to 1980s as a place where the city\'s cultural life was made.' }, src: [25] },
        { t: { bs: 'U Tripoliju i danas radi Café Fahim, jedna od najstarijih kafana u zemlji, gdje stariji ljudi satima puše argileh.', en: 'In Tripoli, Café Fahim, one of the oldest surviving cafés in the country, still has older men smoking argileh for hours.' }, src: [24] }
      ],
      fun: { t: { bs: 'Tamo se puši stari "ajami" način: natopljeni duhan, a žar direktno na njemu, bez folije i bez dodatnih okusa.', en: 'They smoke the old "ajami" way there: soaked tobacco with the coals placed directly on top, no foil and no flavours.' }, src: [24] }
    },
    {
      id: 'kairo-muassel', year: 1992, lon: 31.24, lat: 30.04, zoom: 5.8,
      when: { bs: 'rane 1990-e', en: 'early 1990s' },
      place: { bs: 'Egipat · Kairo', en: 'Egypt · Cairo' }, city: { bs: 'Kairo', en: 'Cairo' }, old: 'Kairo',
      name: 'shisha', art: 'egypt',
      sky: ['minaret:.06:.52', 'block:.12:.24:.22', 'needle:.38:.86', 'dome:.54:.10:.30', 'minaret:.64:.56', 'block:.70:.78:.24', 'pyramid:.90:.16:.24'],
      title: { bs: 'Mu\'assel: duhan sa okusom', en: 'Mu\'assel: flavoured tobacco' },
      facts: [
        { t: { bs: 'Mu\'assel znači "medeni". To je duhan pomiješan sa melasom, glicerinom i aromama voća.', en: 'Mu\'assel means "honeyed". It is tobacco mixed with molasses, glycerine and fruit flavours.' }, src: [22] },
        { t: { bs: 'Do kraja 20. stoljeća nargilu na Bliskom istoku pušili su uglavnom stariji muškarci u kafanama. Od ranih 1990-ih blagi mu\'assel privlači mlade.', en: 'By the late 20th century the hookah in the Middle East was mostly smoked by older men in cafés. From the early 1990s mild mu\'assel draws in the young.' }, src: [22] },
        { t: { bs: 'Neki izvori porijeklo mu\'assela vežu za Egipat ranog 20. stoljeća, ali se tačan početak ne zna.', en: 'Some sources trace mu\'assel to early 20th century Egypt, but the exact start is unknown.' }, src: [22] }
      ],
      fun: { t: { bs: 'Japan Tobacco je 2012. kupio egipatski Nakhla i naveo da ima skoro 100 godina tradicije. Fabrike su mu u Kairu i Shebin El Komu.', en: 'In 2012 Japan Tobacco bought Egypt\'s Nakhla, citing almost 100 years of heritage. Its factories are in Cairo and Shebin El Kom.' }, src: [23] }
    },
    {
      id: 'uae', year: 1999, lon: 55.40, lat: 25.30, zoom: 5.4,
      when: { bs: '1999.', en: '1999' },
      place: { bs: 'Ujedinjeni Arapski Emirati', en: 'United Arab Emirates' }, city: { bs: 'Emirati', en: 'Emirates' }, old: 'UAE',
      name: 'shisha', art: 'egypt',
      sky: ['block:.04:.12:.20', 'sail:.24:.84', 'tower:.40:.05:.46', 'tower:.48:.04:.58', 'palm:.60:.34', 'tower:.74:.05:.40', 'block:.86:.94:.24'],
      title: { bs: 'Voćna shisha osvaja svijet', en: 'Fruit shisha goes global' },
      facts: [
        { t: { bs: 'Al Fakher prema vlastitom profilu proizvodi shishu od 1999. u Emiratima.', en: 'According to its own profile, Al Fakher has made shisha in the Emirates since 1999.' }, src: [43] },
        { t: { bs: 'Jordanska Al Eqbal Investment Company kupila je fabriku Al Fakher 2006. za 11 miliona dolara.', en: 'Jordan\'s Al Eqbal Investment Company bought the Al Fakher factory in 2006 for 11 million dollars.' }, src: [26] },
        { t: { bs: 'Poslije kupovine fabrika je automatizovana, a brend se prodaje u više od 100 zemalja.', en: 'After the purchase the factory was automated, and the brand sells in more than 100 countries.' }, src: [26] }
      ],
      fun: { t: { bs: 'Od 1999. do prodaje u više od 100 zemalja prošlo je manje od dvije decenije.', en: 'From 1999 to sales in more than 100 countries took less than two decades.' }, src: [26, 43] }
    },
    {
      id: 'kalifornija', year: 2005, lon: -118.24, lat: 34.05, zoom: 5.0,
      when: { bs: '1999-2005.', en: '1999-2005' },
      place: { bs: 'SAD · Južna Kalifornija', en: 'USA · Southern California' }, city: { bs: 'Los Angeles', en: 'Los Angeles' }, old: 'Los Angeles',
      name: 'hookah', art: 'modern',
      sky: ['hill:.70:.60:.24', 'palm:.06:.40', 'block:.12:.18:.30', 'tower:.24:.05:.58', 'tower:.31:.06:.72', 'tower:.38:.04:.50', 'block:.44:.52:.32', 'palm:.62:.46', 'palm:.90:.34'],
      title: { bs: 'Hookah lounge kraj univerziteta', en: 'The hookah lounge next to campus' },
      facts: [
        { t: { bs: 'U SAD je između 1999. i 2004. otvoreno 200 do 300 novih kafića sa nargilom, najčešće u univerzitetskim gradovima.', en: 'Between 1999 and 2004, 200 to 300 new waterpipe cafés opened in the USA, mostly in college towns.' }, src: [27] },
        { t: { bs: 'Na jednom velikom univerzitetu 9,5% studenata pušilo je nargilu u prethodnih 30 dana (studija iz 2008).', en: 'At one large university, 9.5% of students had smoked a hookah in the past 30 days (2008 study).' }, src: [27] },
        { t: { bs: 'Kalifornijski Starbuzz se u svojoj registrovanoj marki predstavlja kao "Starbuzz Tobacco since 2005".', en: 'California\'s Starbuzz presents itself in a registered trademark as "Starbuzz Tobacco since 2005".' }, src: [28] }
      ],
      fun: { t: { bs: 'U SAD nargila za samo nekoliko godina postaje dio studentskog izlaska.', en: 'In just a few years the hookah in the USA becomes part of a student night out.' }, src: [27] }
    },
    {
      id: 'sarajevo', year: 2010, lon: 18.43, lat: 43.86, zoom: 6.4,
      when: { bs: '21. st.', en: '21st c.' },
      place: { bs: 'Bosna i Hercegovina · Sarajevo', en: 'Bosnia and Herzegovina · Sarajevo' }, city: { bs: 'Sarajevo', en: 'Sarajevo' }, old: 'Saraybosna',
      name: 'nargila', art: 'nargile',
      sky: ['mountain:.0:1:.44', 'minaret:.16:.64', 'dome:.25:.10:.30', 'roof:.40:.10:.22', 'sebilj:.54:.30', 'roof:.66:.10:.20', 'minaret:.80:.54', 'roof:.90:.08:.18'],
      title: { bs: 'Povratak na Baščaršiju', en: 'Back to Baščaršija' },
      facts: [
        { t: { bs: 'Baščaršija nastaje 1462, kad osmanski namjesnik Isa-beg Ishaković gradi karavan-saraj. Bila je glavna trgovačka i društvena žila grada.', en: 'Baščaršija dates to 1462, when the Ottoman governor Isa-beg Ishaković built a caravanserai. It was the city\'s main artery for trade and social life.' }, src: [29] },
        { t: { bs: 'Turistička organizacija Sarajeva piše da je nargila opet vrlo popularna, poslije pauze od nekoliko decenija, posebno na Baščaršiji.', en: 'Sarajevo\'s tourist board writes that the nargila is very popular again after a pause of a few decades, especially in Baščaršija.' }, src: [30] }
      ],
      fun: { t: { bs: 'Nargila se u Sarajevo vratila tamo gdje je nekad bilo srce osmanskog grada: na Baščaršiju.', en: 'The nargila came back to Sarajevo where the heart of the Ottoman town used to beat: Baščaršija.' }, src: [29, 30] }
    },
    {
      id: 'moskva', year: 2014, lon: 37.62, lat: 55.75, zoom: 5.0,
      when: { bs: '2014.', en: '2014' },
      place: { bs: 'Rusija · Moskva', en: 'Russia · Moscow' }, city: { bs: 'Moskva', en: 'Moscow' }, old: 'Moskva',
      name: 'kalyan', art: 'modern',
      sky: ['wall:.0:.44:.12', 'onion:.12:.30', 'onion:.20:.42', 'onion:.28:.32', 'tower:.40:.04:.44', 'tower:.60:.05:.66', 'tower:.68:.04:.84', 'tower:.75:.05:.60', 'tower:.86:.04:.50'],
      title: { bs: 'Zabrana i voćne mješavine', en: 'A ban and fruit mixes' },
      facts: [
        { t: { bs: 'Rusija 2013. donosi zakon protiv pušenja na javnim mjestima. Restorani, kafići i hoteli dobijaju rok do 1. juna 2014.', en: 'In 2013 Russia passes a law against smoking in public places. Restaurants, cafés and hotels get until 1 June 2014.' }, src: [32] },
        { t: { bs: 'Prema procjeni firme RestConsult, nargila se tada nudila u oko 40% moskovskih restorana i kafića.', en: 'According to an estimate by RestConsult, hookahs were then offered in about 40% of Moscow eateries.' }, src: [31] }
      ],
      fun: { t: { bs: 'Poslije zabrane mnogi moskovski lokali prelaze na voćne mješavine bez nikotina, koje zakon ne obuhvata.', en: 'After the ban many Moscow venues switch to nicotine-free fruit mixes, which the law does not cover.' }, src: [31] }
    },
    {
      id: 'berlin', year: 2022, lon: 13.40, lat: 52.52, zoom: 5.4,
      when: { bs: '2020-2026.', en: '2020-2026' },
      place: { bs: 'Njemačka · Berlin', en: 'Germany · Berlin' }, city: { bs: 'Berlin', en: 'Berlin' }, old: 'Berlin',
      name: 'Shisha', art: 'modern',
      sky: ['block:.02:.14:.26', 'tv:.24:.92', 'block:.32:.42:.30', 'gate:.62:.18:.34', 'block:.76:.86:.28', 'tower:.92:.05:.42'],
      title: { bs: 'Zemlja shisha barova', en: 'The land of shisha bars' },
      facts: [
        { t: { bs: 'Zvaničnog broja nema: ZDF je 2020. pisao o više od 6.000 shisha barova, a udruženje proizvođača 2024. procjenjuje oko 5.000.', en: 'There is no official count: ZDF reported more than 6,000 shisha bars in 2020, and the manufacturers\' association estimated about 5,000 in 2024.' }, src: [33, 34] },
        { t: { bs: 'Tagesspiegel procjenjuje da u Njemačkoj nargilu puši oko 1,5 miliona ljudi.', en: 'Tagesspiegel estimates that about 1.5 million people in Germany smoke a hookah.' }, src: [35] },
        { t: { bs: 'Zbog trovanja ugljen-monoksidom Baden-Württemberg traži od shisha lokala dovoljnu ventilaciju i detektore CO.', en: 'Because of carbon monoxide poisonings, Baden-Württemberg requires shisha venues to have proper ventilation and CO detectors.' }, src: [39, 38] }
      ],
      fun: { t: { bs: 'Od jula 2022. duhan za nargilu u Njemačkoj smio se prodavati samo u pakovanjima do 25 grama. Pravilo je ukinuto 2024.', en: 'From July 2022, hookah tobacco in Germany could only be sold in packs of up to 25 grams. The rule was lifted in 2024.' }, src: [36, 37] }
    }
  ],

  // Muzej nargila: prave nargile (izrezane fotografije vlasnika) u static/history/<id>.webp i <id>-s.webp (visina 420).
  // w, h: veličina velike slike; wide: eksponat preko cijele širine; d: opis onoga što se vidi na slici.
  museum: [
    { id: 'mesing', w: 410, h: 720, name: { bs: 'Mesing sa gravurom', en: 'Engraved brass' }, k: { bs: 'stari oblik', en: 'old form' },
      d: { bs: 'Visoko mesingano tijelo sa gravurom romba, tri kugle na stubu i dva upletena crijeva savijena u petlje.', en: 'A tall brass body engraved with diamonds, three spheres on the stem and two braided hoses curled into loops.' } },
    { id: 'trska', w: 422, h: 720, name: { bs: 'Metalna vaza i trska', en: 'Metal vase and reed' }, k: { bs: 'stari oblik', en: 'old form' },
      d: { bs: 'Široka metalna vaza, drveni stub i duga cijev od trske povezana tamnim trakama.', en: 'A wide metal vase, a wooden stem and a long reed pipe bound with dark bands.' } },
    { id: 'zelena', w: 251, h: 720, name: { bs: 'Zelena, na četiri noge', en: 'Green, on four legs' }, k: { bs: 'stari oblik', en: 'old form' },
      d: { bs: 'Zelena posuda sa visokim stubom, a sve nosi postolje sa četiri zakrivljene noge.', en: 'A green vessel with a tall stem, all carried by a stand with four curved legs.' } },
    { id: 'ukrasna', w: 521, h: 720, name: { bs: 'Crveno, tirkiz i zlato', en: 'Red, turquoise and gold' }, k: { bs: 'ukrasna', en: 'ornate' },
      d: { bs: 'Crvena vaza sa tirkiznim i zlatnim ornamentima, plavi stub sa zlatnim prstenovima i upleteno metalno crijevo.', en: 'A red vase with turquoise and gold ornaments, a blue stem with gold rings and a braided metal hose.' } },
    { id: 'kristal', w: 232, h: 720, name: { bs: 'Kobalt staklo i zlato', en: 'Cobalt glass and gold' }, k: { bs: 'ukrasna', en: 'ornate' },
      d: { bs: 'Kobaltno plava vaza sa zlatnim ukrasima, zlatni stub i tacna.', en: 'A cobalt blue vase with gold decoration, a gold stem and tray.' } },
    { id: 'crvena', w: 575, h: 720, name: { bs: 'Čelik i crveno drvo', en: 'Steel and red wood' }, k: { bs: 'moderna', en: 'modern' },
      d: { bs: 'Čelični stub sa crvenim drvenim dijelovima, brušena kristalna vaza i crno crijevo sa drškom.', en: 'A steel stem with red wooden parts, a cut crystal vase and a black hose with a handle.' } },
    { id: 'plava', w: 816, h: 720, name: { bs: 'Plavi stub i kristal', en: 'Blue stem and crystal' }, k: { bs: 'moderna', en: 'modern' },
      d: { bs: 'Plavi stub, kristalna vaza, velika tacna i dugo crno crijevo sa metalnom drškom.', en: 'A blue stem, a crystal vase, a large tray and a long black hose with a metal handle.' } },
    { id: 'crna', w: 745, h: 720, name: { bs: 'Četiri priključka', en: 'Four hose ports' }, k: { bs: 'moderna', en: 'modern' },
      d: { bs: 'Crni stub sa četiri priključka za crijeva, čelična tacna i brušena kristalna vaza.', en: 'A black stem with four hose ports, a steel tray and a cut crystal vase.' } },
    { id: 'dijelovi', w: 1035, h: 593, wide: true, name: { bs: 'Nargila na dijelove', en: 'A hookah in parts' }, k: { bs: 'anatomija', en: 'anatomy' },
      d: { bs: 'Ukrasna nargila rastavljena na dijelove: glava, tacna, stub sa vazom, dva crijeva, usnik i spojnice.', en: 'The ornate hookah taken apart: bowl, tray, stem with vase, two hoses, mouthpiece and fittings.' } }
  ],

  // "Kako se zove gdje": lon/lat za tačku na maloj mapi
  names: [
    { w: 'huqqa · hookah', lon: 78, lat: 24, where: { bs: 'Indija, engleski', en: 'India, English' }, t: { bs: 'Od arapskog ḥuqqa, posuda vodene lule. U engleskom od 18. stoljeća.', en: 'From Arabic ḥuqqa, the vessel of a water pipe. In English since the 18th century.' }, src: [6] },
    { w: 'qalyan', lon: 52, lat: 32, where: { bs: 'Iran', en: 'Iran' }, t: { bs: 'Perzijski naziv, poznat od safavidskog doba.', en: 'The Persian name, known since Safavid times.' }, src: [3] },
    { w: 'nargila · nargile', lon: 29, lat: 41, where: { bs: 'Turska, Balkan', en: 'Turkey, the Balkans' }, t: { bs: 'Od perzijskog nārgīl, kokos, srodno sanskritskom nārikela.', en: 'From Persian nārgīl, coconut, akin to Sanskrit nārikela.' }, src: [5] },
    { w: 'shisha', lon: 31, lat: 30, where: { bs: 'Egipat, Zaljev, Evropa', en: 'Egypt, the Gulf, Europe' }, t: { bs: 'Od perzijskog šīša, staklo, preko turskog şişe, boca.', en: 'From Persian šīša, glass, via Turkish şişe, bottle.' }, src: [42] },
    { w: 'argileh', lon: 35.5, lat: 34, where: { bs: 'Liban, Sirija', en: 'Lebanon, Syria' }, t: { bs: 'Ime koje se koristi u Levantu, u kafanama poput Café Fahima u Tripoliju.', en: 'The name used in the Levant, in cafés such as Café Fahim in Tripoli.' }, src: [24] },
    { w: 'goza', lon: 32, lat: 27, where: { bs: 'Egipat', en: 'Egypt' }, t: { bs: 'Egipatska lula sa posudom od kokosa; Science Museum čuva jednu iz 1895-1900.', en: 'The Egyptian pipe with a coconut vessel; the Science Museum holds one from 1895-1900.' }, src: [17] },
    { w: 'kalyan', lon: 37.6, lat: 55.7, where: { bs: 'Rusija', en: 'Russia' }, t: { bs: 'Rusko кальян, preuzeto od perzijskog qalyan.', en: 'Russian кальян, borrowed from Persian qalyan.' }, src: [44] }
  ],

  // "Bez uljepšavanja": zdravlje, mirno i sa izvorima
  health: [
    { t: { bs: 'Po WHO-u (2005), u jednoj sesiji nargile može se udahnuti onoliko dima koliko iz 100 ili više cigareta.', en: 'According to the WHO (2005), one hookah session can mean inhaling as much smoke as from 100 or more cigarettes.' }, src: [40] },
    { t: { bs: 'Voda hladi dim, ali ga ne čisti: i poslije vode dim sadrži visoke nivoe otrovnih tvari.', en: 'Water cools the smoke but does not clean it: even after the water, the smoke contains high levels of toxic substances.' }, src: [40] },
    { t: { bs: 'Žar stvara ugljen-monoksid. Zbog trovanja u shisha barovima neke njemačke pokrajine traže ventilaciju i detektore CO.', en: 'Burning coal produces carbon monoxide. After poisonings in shisha bars, some German states require ventilation and CO detectors.' }, src: [38, 39] }
  ],

  // "Evolucija dijelova": svaki dio kroz tri koraka
  parts: [
    {
      id: 'vaza', title: { bs: 'Posuda za vodu', en: 'The water vessel' },
      steps: [
        { k: 'coconut', label: { bs: 'Kokos', en: 'Coconut' }, t: { bs: 'Prva posuda za vodu bila je kokosova ljuska, po kojoj je nargila i dobila ime.', en: 'The first water vessel was a coconut shell, which gave the narghile its name.' }, src: [5, 17] },
        { k: 'bidri', label: { bs: 'Metal (bidri)', en: 'Metal (bidri)' }, t: { bs: 'U Indiji 17. stoljeća posuda postaje umjetnički predmet od legure cinka sa umecima od mesinga.', en: 'In 17th century India the vessel becomes an art object of zinc alloy inlaid with brass.' }, src: [7, 8] },
        { k: 'glass', label: { bs: 'Staklo', en: 'Glass' }, t: { bs: 'Staklena posuda daje ime "shisha" (staklo). Lane je 1836. opisuje u Egiptu.', en: 'The glass vessel gives the name "shisha" (glass). Lane describes it in Egypt in 1836.' }, src: [18, 42] }
      ]
    },
    {
      id: 'zar', title: { bs: 'Žar i toplota', en: 'Coal and heat' },
      steps: [
        { k: 'ajami', label: { bs: 'Žar na duhanu', en: 'Coal on tobacco' }, t: { bs: 'Stari "ajami" način: žar se stavlja direktno na natopljeni duhan.', en: 'The old "ajami" way: coals sit directly on soaked tobacco.' }, src: [24] },
        { k: 'muassel', label: { bs: 'Mu\'assel', en: 'Mu\'assel' }, t: { bs: 'Vlažni duhan sa melasom i glicerinom traži blažu toplotu i mijenja način pripreme.', en: 'Moist tobacco with molasses and glycerine needs gentler heat and changes how it is prepared.' }, src: [22] },
        { k: 'hmd', label: { bs: 'Regulator toplote', en: 'Heat management device' }, t: { bs: 'Kaloudov patent US 9,237,770 opisuje ploču koja leži na glavi i prenosi toplotu žara na duhan, sa poklopcem za regulaciju.', en: 'Kaloud\'s patent US 9,237,770 describes a plate that rests on the bowl and conducts the coal\'s heat to the tobacco, with a lid for regulation.' }, src: [41] }
      ]
    },
    {
      id: 'duhan', title: { bs: 'Duhan', en: 'Tobacco' },
      steps: [
        { k: 'leaf', label: { bs: 'List', en: 'Leaf' }, t: { bs: 'U safavidskoj Perziji se, po Chardinu, posebno cijenio brazilski duhan za qalyan.', en: 'In Safavid Persia, according to Chardin, Brazilian tobacco was especially prized for the qalyan.' }, src: [4] },
        { k: 'tombak', label: { bs: 'Natopljeni list', en: 'Soaked leaf' }, t: { bs: 'Jak list koji se natapa i puši bez dodataka, kako se i danas radi u Café Fahimu.', en: 'Strong leaf soaked and smoked plain, as it still is at Café Fahim.' }, src: [24] },
        { k: 'muassel', label: { bs: 'Duhan sa okusom', en: 'Flavoured tobacco' }, t: { bs: 'Od ranih 1990-ih mu\'assel sa voćem postaje najčešća vrsta duhana za nargilu na svijetu.', en: 'From the early 1990s fruit mu\'assel becomes the most common hookah tobacco in the world.' }, src: [22] }
      ]
    }
  ],

  // "Mit ili istina": verdict 'myth' | 'true' | 'unsure'
  myths: [
    { q: { bs: 'Voda u nargili izbaci sve štetne tvari.', en: 'The water in a hookah removes all harmful substances.' }, v: 'myth', a: { bs: 'I nakon prolaska kroz vodu dim sadrži visoke nivoe otrovnih tvari.', en: 'Even after passing through water, the smoke contains high levels of toxic substances.' }, src: [40] },
    { q: { bs: 'Nargila je dobila ime po kokosu.', en: 'The narghile is named after the coconut.' }, v: 'true', a: { bs: 'Perzijsko nārgīl znači kokos, a prva posuda za vodu bila je kokosova ljuska.', en: 'Persian nārgīl means coconut, and the first water vessel was a coconut shell.' }, src: [5] },
    { q: { bs: 'Nargilu je izmislio ljekar Abul-Fath Gilani.', en: 'The hookah was invented by the physician Abul-Fath Gilani.' }, v: 'unsure', a: { bs: 'To je predaja. Iranica navodi da je umro 1588, prije nego što je duhan 1604. stigao na Akbarov dvor.', en: 'That is tradition. Iranica gives his death as 1588, before tobacco reached Akbar\'s court in 1604.' }, src: [2, 1] },
    { q: { bs: 'Zbog pušenja se nekad gubila glava.', en: 'People once lost their heads for smoking.' }, v: 'true', a: { bs: 'Murad IV je 1633. uveo smrtnu kaznu za javno pušenje. Brojke pogubljenih su nepouzdane.', en: 'In 1633 Murad IV introduced the death penalty for public smoking. The numbers executed are unreliable.' }, src: [9, 10] },
    { q: { bs: 'Duhan sa okusom voća se puši stoljećima.', en: 'Fruit-flavoured tobacco has been smoked for centuries.' }, v: 'myth', a: { bs: 'Mu\'assel postaje popularan tek od ranih 1990-ih.', en: 'Mu\'assel only became popular in the early 1990s.' }, src: [22] },
    { q: { bs: 'Jedna sesija nargile je kao jedna cigareta.', en: 'One hookah session equals one cigarette.' }, v: 'myth', a: { bs: 'Po WHO-u, u jednoj sesiji može se udahnuti onoliko dima koliko iz 100 ili više cigareta.', en: 'According to the WHO, one session can mean inhaling as much smoke as from 100 or more cigarettes.' }, src: [40] },
    { q: { bs: 'Shisha je arapska riječ.', en: 'Shisha is an Arabic word.' }, v: 'unsure', a: { bs: 'Djelimično: u arapskom jeste, ali dolazi od perzijskog šīša (staklo), preko turskog.', en: 'Partly: it is used in Arabic, but it comes from Persian šīša (glass), via Turkish.' }, src: [42] },
    { q: { bs: 'U shisha baru nema opasnosti od ugljen-monoksida.', en: 'There is no carbon monoxide risk in a shisha bar.' }, v: 'myth', a: { bs: 'Düsseldorfska klinika je u jednoj godini liječila skoro 40 pušača nargile zbog trovanja CO.', en: 'A Düsseldorf clinic treated almost 40 hookah smokers for CO poisoning in a single year.' }, src: [38] }
  ],

  // Dijelovi rastavljene nargile (hero), odozgo prema dolje
  hookahParts: [
    { id: 'glava', name: { bs: 'Glava (lula)', en: 'Bowl' }, t: { bs: 'U nju ide duhan, a iznad njega žar ili regulator toplote.', en: 'Holds the tobacco, with coals or a heat device on top.' } },
    { id: 'gumica', name: { bs: 'Gumice', en: 'Grommets' }, t: { bs: 'Zaptivaju spojeve da vazduh ide samo kroz duhan.', en: 'Seal the joints so air only flows through the tobacco.' } },
    { id: 'tacna', name: { bs: 'Tacna', en: 'Tray' }, t: { bs: 'Hvata pepeo i drži rezervni žar.', en: 'Catches ash and holds spare coals.' } },
    { id: 'stub', name: { bs: 'Stub', en: 'Stem' }, t: { bs: 'Vodi dim od glave do vode i nosi priključak za crijevo.', en: 'Carries smoke from the bowl to the water and holds the hose port.' } },
    { id: 'crijevo', name: { bs: 'Crijevo', en: 'Hose' }, t: { bs: 'Kroz njega se dim povlači iz vaze.', en: 'Draws the smoke out of the vase.' } },
    { id: 'usnik', name: { bs: 'Usnik', en: 'Mouthpiece' }, t: { bs: 'Kraj crijeva koji ide u usta.', en: 'The end of the hose that goes to the lips.' } },
    { id: 'difuzor', name: { bs: 'Difuzor', en: 'Diffuser' }, t: { bs: 'Razbija mjehuriće u vodi da nargila radi tiše.', en: 'Breaks up bubbles in the water so the hookah runs quieter.' } },
    { id: 'vaza', name: { bs: 'Vaza', en: 'Vase' }, t: { bs: 'Voda u njoj hladi dim. Hladi ga, ali ga ne čisti.', en: 'The water cools the smoke. It cools it, but does not clean it.' } }
  ],

  sources: [
    null,
    { t: 'Salar Jung Museum, "Romance of the Huqqa" (Google Arts & Culture)', u: 'https://artsandculture.google.com/story/romance-of-the-huqqa-salar-jung-museum/yAXR1EQO2dww5Q' },
    { t: 'Encyclopaedia Iranica, "Tobacco"', u: 'https://www.iranicaonline.org/articles/tobacco' },
    { t: 'Encyclopaedia Iranica, "Ḡalyān"', u: 'https://www.iranicaonline.org/articles/galyan-' },
    { t: 'Encyclopaedia Iranica, "Čopoq"', u: 'https://www.iranicaonline.org/articles/copoq-cepoq-turk' },
    { t: 'Merriam-Webster, "narghile"', u: 'https://www.merriam-webster.com/dictionary/narghile' },
    { t: 'Merriam-Webster, "hookah"', u: 'https://www.merriam-webster.com/dictionary/hookah' },
    { t: 'The Met, "Base for a Water Pipe (Huqqa) with Irises", 1984.221', u: 'https://www.metmuseum.org/art/collection/search/453243' },
    { t: 'The Met, Heilbrunn Timeline: 1984.221', u: 'https://www.metmuseum.org/toah/works-of-art/1984.221' },
    { t: 'Daily Sabah, "Mighty sovereigns of Ottoman throne: Sultan Murad IV"', u: 'https://www.dailysabah.com/arts/portrait/mighty-sovereigns-of-ottoman-throne-sultan-murad-iv' },
    { t: 'Atlas Obscura, "In Istanbul, Drinking Coffee in Public Was Once Punishable by Death"', u: 'https://www.atlasobscura.com/articles/was-coffee-ever-illegal' },
    { t: 'Mental Floss, "7 Historical Bans on Smoking"', u: 'https://www.mentalfloss.com/article/64127/7-historical-bans-smoking' },
    { t: 'Hürriyet Daily News, "Hitting a high the Ottoman way with tobacco"', u: 'https://www.hurriyetdailynews.com/hitting-a-high-the-ottoman-way-with-tobacco-71924' },
    { t: 'Wikipedia, "Tobacco Protest"', u: 'https://en.wikipedia.org/wiki/Tobacco_Protest' },
    { t: 'Global Nonviolent Action Database, "Iranian resistance to Tobacco Concession, 1891-1892"', u: 'https://nvdatabase.swarthmore.edu/node/4020' },
    { t: 'Amsterdam Pipe Museum, APM 22.287', u: 'https://pipemuseum.nl/en/collection/apm-22-287' },
    { t: 'British Museum, zbirka: vodene lule / collection: water-pipes', u: 'https://www.britishmuseum.org/collection/term/x9980' },
    { t: 'Science Museum Group, "Nargileh or gozeh pipe"', u: 'https://collection.sciencemuseumgroup.org.uk/objects/co103256/nargileh-or-gozeh-pipe' },
    { t: 'Edward W. Lane, "Manners and Customs of the Modern Egyptians" (1836)', u: 'https://sourcelibrary.org/book/69907936b621b177c1af59d3/page-number/162' },
    { t: 'AramcoWorld (1996), "Fishawy\'s Café: Two Centuries of Tea"', u: 'https://archive.aramcoworld.com/issue/199605/fishawy.s.caf.-two.centuries.of.tea.htm' },
    { t: 'Cairo Governorate, "Cairo\'s Famous Coffeehouses"', u: 'https://www.cairo.gov.eg/en/culture/cairo-history/modern-landmarks/cairo-s-famous-coffeehouses/' },
    { t: 'History Hit, "5 Historic Cafés to Visit in Cairo"', u: 'https://www.historyhit.com/guides/historic-cafes-in-cairo/' },
    { t: 'Wikipedia, "Muʽassel"', u: 'https://en.wikipedia.org/wiki/Mu%CA%BDassel' },
    { t: 'Moodie Davitt Report (2012), "Japan Tobacco to acquire leading Egyptian shisha manufacturer Nakhla"', u: 'https://moodiedavittreport.com/japan-tobacco-to-acquire-leading-egyptian-shisha-manufacturer-nakhla' },
    { t: 'The National, "Coffee houses of the Middle East"', u: 'https://thenational.shorthandstories.com/cafes-coffee-middle-east-traditional-arab-world' },
    { t: 'AUB ScholarWorks, "The Beirut Coffeehouse and Café"', u: 'https://scholarworks.aub.edu.lb/handle/10938/23893' },
    { t: 'Oxford Business Group (2014), "Al Eqbal Investment Company: Tobacco and cigarettes"', u: 'https://oxfordbusinessgroup.com/reports/jordan/2014-report/economy/al-eqbal-investment-company-tobacco-and-cigarettes' },
    { t: 'Primack i sar. / et al. (2008), Annals of Behavioral Medicine (PMC3004534)', u: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3004534' },
    { t: 'USPTO via Justia, "STARBUZZ TOBACCO SINCE 2005"', u: 'https://trademark.justia.com/860/00/starbuzz-tobacco-since-86000028.html' },
    { t: 'Visit Sarajevo, "Explore Baščaršija"', u: 'https://sarajevo.travel/en/text/explore-bascarsija-sarajevos-historic-core/203' },
    { t: 'Visit Sarajevo, "Days and nights"', u: 'https://sarajevo.travel/en/text/days-and-nights/324' },
    { t: 'Bloomberg (2014), "Russia\'s Tobacco Ban Takes the Buzz Out of Hookah Bars"', u: 'https://www.bloomberg.com/news/articles/2014-07-03/russias-tobacco-ban-takes-the-buzz-out-of-hookah-bars' },
    { t: 'Deutsches Ärzteblatt (2013), "Putin unterzeichnet Anti-Tabak-Gesetz"', u: 'https://www.aerzteblatt.de/themen/nichtraucherschutz/putin-unterzeichnet-anti-tabak-gesetz-9406c8cc-77ad-4cf5-85c8-49f0bb6ba828' },
    { t: 'ZDF (2020), "Shisha: Das gefährliche Geschäft mit dem kalten Rauch"', u: 'https://www.zdf.de/shisha--das-gefaehrliche-geschaeft-mit-dem-kalten-rauch-100.html' },
    { t: 'Berliner Zeitung / dpa (2024), "Shisha-Branche befürchtet Pleitewelle"', u: 'https://www.berliner-zeitung.de/article/shisha-branche-befurchtet-pleitewelle-2185715' },
    { t: 'Der Tagesspiegel (2026), Wirtschaft', u: 'https://www.tagesspiegel.de/wirtschaft/archiv/2026/06/28' },
    { t: 'KriPoZ (2022), "25-Gramm-Regelung im Vertrieb von Wasserpfeifentabak"', u: 'https://kripoz.de/2022/05/30/diametrale-effekte-bei-der-bekaempfung-von-steuerkriminalitaet-am-beispiel-der-25-gramm-regelung-im-vertrieb-von-wasserpfeifentabak/' },
    { t: 'Nordkurier / dpa (2024), "Erstmals seit 2019 wieder mehr Zigaretten versteuert"', u: 'https://www.nordkurier.de/wirtschaft/erstmals-seit-2019-wieder-mehr-zigaretten-versteuert-3274749' },
    { t: 'PTA heute (2018), "Lebensgefährliche Kohlenmonoxid-Vergiftungen durch Shisha-Rauchen"', u: 'https://www.ptaheute.de/aktuelles/2018/01/03/lebensgefaehrliche-kohlenmonoxid-vergiftungen-durch-shisha-rauchen' },
    { t: 'Baden-Württemberg, "Konsequenzen aus Kohlenmonoxid-Vergiftungen in Shisha-Bars"', u: 'https://www.baden-wuerttemberg.de/de/service/presse/pressemitteilung/pid/konsequenzen-aus-kohlenmonoxid-vergiftungen-in-shisha-bars' },
    { t: 'WHO (2005), "Advisory note: waterpipe tobacco smoking"', u: 'https://www.who.int/publications/i/item/advisory-note-waterpipe-tobacco-smoking-health-effects-research-needs-and-recommended-actions-by-regulators' },
    { t: 'Google Patents, US9237770B2 "Hookah heat management accessory"', u: 'https://patents.google.com/patent/US9237770' },
    { t: 'Wiktionary, "shisha"', u: 'https://en.wiktionary.org/wiki/shisha' },
    { t: 'Naukrigulf, profil kompanije / company profile: Al Fakher', u: 'https://www.naukrigulf.com/al-fakher-overview-cid-156197' },
    { t: 'Wiktionary, "кальян"', u: 'https://en.wiktionary.org/wiki/%D0%BA%D0%B0%D0%BB%D1%8C%D1%8F%D0%BD' },
    { t: 'Natural Earth (mapa / map data, javno vlasništvo / public domain), preko / via world-atlas', u: 'https://www.naturalearthdata.com/' }
  ]
};
