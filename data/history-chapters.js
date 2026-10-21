/*
 * MyShishapedia - "Evolucija nargile": poglavlja za čitanje (posebne stranice).
 *
 * Svako poglavlje je jedna stranica: /bs/evolucija-nargile/<slug>/ i /en/hookah-history/<slug>/.
 * Svaki pasus ima `src`: brojeve izvora iz liste `sources` tog poglavlja (od 1).
 * Izvor je ili { g: n } (izvor n iz data/history.js, da se ne ponavlja) ili { t, u } (novi izvor).
 * `stations` su id-jevi stanica sa putovanja, `years` su ključne godine za traku na vrhu.
 * Koristi se samo pri buildu (HTML je gotov), browser ovaj fajl ne učitava.
 */
(function (root) {
  'use strict';

  root.HISTORY_CHAPTERS = [
    /* ---------------------------------------------------------------- */
    {
      id: 'korijeni', art: 'coconut',
      slug: { bs: 'korijeni', en: 'origins' },
      span: { bs: 'oko 1320-1604', en: 'c. 1320-1604' },
      title: { bs: 'Korijeni: odakle dolazi nargila', en: 'Origins: where the hookah comes from' },
      lead: {
        bs: 'Arheologija, legenda o dvorskom ljekaru i jedna riječ za kokos. Šta se o počecima zna, a šta je samo dobra priča.',
        en: 'Archaeology, the legend of a court physician and a word for coconut. What is known about the beginnings, and what is just a good story.'
      },
      stations: ['isfahan', 'agra'],
      years: [
        { y: 'oko 1320', yEn: 'c. 1320', t: { bs: 'Lule iz pećine kod Lalibele', en: 'Pipes from the cave near Lalibela' }, src: [1] },
        { y: '1535', t: { bs: 'Umire pjesnik Ahli Širazi', en: 'Death of the poet Ahli Shirazi' }, src: [3] },
        { y: '1560-ih', yEn: '1560s', t: { bs: 'Prvi pouzdani tragovi qalyana', en: 'First reliable traces of the qalyan' }, src: [3] },
        { y: '1604', t: { bs: 'Duhan na Akbarovom dvoru', en: 'Tobacco at Akbar\'s court' }, src: [5] }
      ],
      sections: [
        {
          h: { bs: 'Lule starije od duhana', en: 'Pipes older than tobacco' },
          p: [
            { t: { bs: 'Duhan je biljka iz Amerike. U Perziju su ga, kako se navodi, donijeli Portugalci početkom 16. stoljeća. Zato je najteže pitanje cijele priče da li je lula sa vodom postojala prije duhana.', en: 'Tobacco is a plant from the Americas. It reached Persia, reportedly with the Portuguese, in the early 16th century. That makes the hardest question of the whole story whether a pipe with water existed before tobacco.' }, src: [4] },
            { t: { bs: 'U pećini kod Lalibele u Etiopiji pronađene su keramičke glave lula, datirane radiougljikom na oko 1320. godinu. Hemijska analiza iz 1975. našla je u njima tragove kanabisa.', en: 'Ceramic pipe bowls were found in a cave near Lalibela in Ethiopia and radiocarbon dated to around 1320. A chemical analysis in 1975 found traces of cannabis in them.' }, src: [1] },
            { t: { bs: 'Rad u časopisu Journal of African History navodi da su ljudi na jugu Afrike poznavali vodene lule prije nego što su od Holanđana naučili za obične lule sa koljenom.', en: 'A paper in the Journal of African History notes that people in southern Africa knew water pipes before they learned about ordinary elbow pipes from the Dutch.' }, src: [2] }
          ],
          note: { bs: 'Ovi nalazi ne govore ko je izmislio nargilu. Pokazuju samo da se pušilo i prije duhana, a pitanje vodene lule u Africi prije duhana ostaje otvoreno.', en: 'These finds do not tell us who invented the hookah. They only show that people smoked before tobacco; whether Africa had water pipes before tobacco remains an open question.' }, noteSrc: [1, 2]
        },
        {
          h: { bs: 'Legenda o ljekaru cara Akbara', en: 'The legend of Emperor Akbar\'s physician' },
          p: [
            { t: { bs: 'Najpoznatija priča kaže da je nargilu smislio Abul-Fath Gilani, perzijski ljekar na dvoru mogulskog cara Akbara, da bi se dim "pročistio" kroz vodu. Kraljevska zbirka u Londonu, koja čuva njegov portret, piše opreznije: njemu se izum pripisuje.', en: 'The best-known story says the hookah was devised by Abul-Fath Gilani, a Persian physician at the court of the Mughal emperor Akbar, so that smoke could be "purified" through water. The Royal Collection in London, which holds his portrait, puts it more carefully: the invention is credited to him.' }, src: [6, 5] },
            { t: { bs: 'Problem su datumi. Encyclopaedia Iranica navodi da je Gilani umro 1588, a duhan na Akbarov dvor stiže tek 1604, kad ga izaslanik Asad Beg donosi iz Bidžapura zajedno sa lulom ukrašenom draguljima.', en: 'The dates are the problem. Encyclopaedia Iranica gives Gilani\'s death as 1588, while tobacco only reaches Akbar\'s court in 1604, when the envoy Asad Beg brings it from Bijapur together with a jewelled pipe.' }, src: [3, 5] }
          ]
        },
        {
          h: { bs: 'Perzija i qalyan', en: 'Persia and the qalyan' },
          p: [
            { t: { bs: 'Pjesnik Ahli Širazi, koji je umro 1535, spominje qalyan. Encyclopaedia Iranica ipak upozorava da nema pouzdanog dokaza da je vodena lula postojala prije 1560-ih, pa se možda mislilo na nešto drugo.', en: 'The poet Ahli Shirazi, who died in 1535, mentions the qalyan. Encyclopaedia Iranica nevertheless warns that there is no reliable evidence of the water pipe before the 1560s, so he may have meant something else.' }, src: [3] },
            { t: { bs: 'Šah Abbas I, koji je vladao od 1588. do 1629, nije volio duhan i zabranio ga je, ali se u Perziji pušilo i dalje.', en: 'Shah Abbas I, who ruled from 1588 to 1629, disliked tobacco and banned it, but Persians kept smoking.' }, src: [4] }
          ]
        },
        {
          h: { bs: 'Riječi koje čuvaju historiju', en: 'Words that keep the history' },
          p: [
            { t: { bs: 'Nargila dolazi od perzijskog nārgīl, kokos, jer je prva posuda za vodu bila kokosova ljuska. Takve nargile od kokosa čuvaju i muzeji, na primjer Science Museum u Londonu.', en: 'Narghile comes from Persian nārgīl, coconut, because the first water vessel was a coconut shell. Museums such as the Science Museum in London still hold coconut hookahs like these.' }, src: [7, 8] },
            { t: { bs: 'Hookah je preko hindustanskog huqqa došla od arapske riječi ḥuqqa, za posudu.', en: 'Hookah came through Hindustani huqqa from the Arabic word ḥuqqa, a vessel.' }, src: [9] }
          ]
        }
      ],
      sources: [
        { t: 'Wikipedia, "Cannabis in Ethiopia" (Lalibela, van der Merwe 1975)', u: 'https://en.wikipedia.org/wiki/Cannabis_in_Ethiopia' },
        { t: 'Journal of African History, "African Smoking and Pipes" (Cambridge University Press)', u: 'https://www.cambridge.org/core/journals/journal-of-african-history/article/abs/african-smoking-and-pipes/5581171A55F263BD955A9BF0A26CB0D4' },
        { g: 2 },
        { g: 3 },
        { g: 1 },
        { t: 'Royal Collection Trust, "Portrait of Hakim Abul Fath" (RCIN 1005038.ak)', u: 'https://www.rct.uk/collection/1005038-ak/portrait-of-hakim-abul-fath' },
        { g: 5 },
        { g: 17 },
        { g: 6 }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: 'kafana', art: 'egypt',
      slug: { bs: 'kafana', en: 'coffeehouse' },
      span: { bs: '1554-danas', en: '1554-today' },
      title: { bs: 'Kafana: dom nargile', en: 'The coffeehouse: home of the hookah' },
      lead: {
        bs: 'Od Tahtakale u Istanbulu, preko Bentbaše i Khan el-Khalilija, do lounge barova u Americi. Nargila živi tamo gdje se sjedi i priča.',
        en: 'From Tahtakale in Istanbul, through Bentbaša and Khan el-Khalili, to American lounge bars. The hookah lives where people sit and talk.'
      },
      stations: ['istanbul', 'kairo-fishawy', 'bejrut', 'kalifornija', 'berlin'],
      years: [
        { y: '1554/55', t: { bs: 'Prve kafane u Istanbulu', en: 'The first coffeehouses in Istanbul' }, src: [1] },
        { y: '1633', t: { bs: 'Murad IV zatvara kafane', en: 'Murad IV closes the coffeehouses' }, src: [3, 4] },
        { y: '1797', t: { bs: 'El Fishawy u Kairu', en: 'El Fishawy in Cairo' }, src: [7, 8] },
        { y: '1999-2004', t: { bs: 'Talas nargila barova u SAD', en: 'A wave of hookah bars in the US' }, src: [11] }
      ],
      sections: [
        {
          h: { bs: 'Istanbul: kafana prije nargile', en: 'Istanbul: the coffeehouse before the hookah' },
          p: [
            { t: { bs: 'Po osmanskom historičaru Ibrahimu Pečeviji, dvojica trgovaca, Hakem iz Alepa i Šems iz Damaska, otvorili su prve kafane u Istanbulu, u četvrti Tahtakale. Izvori navode 1554. ili 1555. godinu.', en: 'According to the Ottoman historian İbrahim Peçevi, two merchants, Hakam of Aleppo and Shams of Damascus, opened the first coffeehouses in Istanbul, in the Tahtakale district. Sources give 1554 or 1555.' }, src: [1] },
            { t: { bs: 'Kafa je bila prva. Duhan u Istanbul stiže tek oko 1600, a onda se kafane brzo pune dimom.', en: 'Coffee came first. Tobacco only reaches Istanbul around 1600, and then the coffeehouses quickly fill with smoke.' }, src: [2] },
            { t: { bs: 'Godine 1633, poslije velikog požara, sultan Murad IV zatvara kafane i uvodi smrtnu kaznu za javno pušenje.', en: 'In 1633, after a great fire, Sultan Murad IV closes the coffeehouses and introduces the death penalty for smoking in public.' }, src: [3, 4] }
          ]
        },
        {
          h: { bs: 'Sarajevo: kafana na Bentbaši', en: 'Sarajevo: the coffeehouse at Bentbaša' },
          p: [
            { t: { bs: 'Turistička organizacija Sarajeva piše da je prva kafana u gradu bila Hadži Šabanova kafana na Bentbaši, otvorena sredinom 16. stoljeća. Radila je do 1942, kad je srušena.', en: 'Sarajevo\'s tourist board writes that the city\'s first coffeehouse was Hajji Šaban\'s coffeehouse at Bentbaša, opened in the middle of the 16th century. It worked until 1942, when it was demolished.' }, src: [5] }
          ],
          more: 'bosna'
        },
        {
          h: { bs: 'Kairo: Lane i El Fishawy', en: 'Cairo: Lane and El Fishawy' },
          p: [
            { t: { bs: 'Englez Edward Lane 1836. bilježi da imućniji Egipćani puše nargilu sa posudom od kokosa, a verziju sa staklenom posudom zovu šiša.', en: 'In 1836 the Englishman Edward Lane records that wealthier Egyptians smoke a narghile with a coconut vessel, and call the version with a glass vessel shisha.' }, src: [6] },
            { t: { bs: 'Kafana El Fishawy u bazaru Khan el-Khalili otvorena je 1771. ili 1797, zavisno od izvora. Vodi je ista porodica, a nobelovac Naguib Mahfouz bio je stalni gost.', en: 'El Fishawy café in the Khan el-Khalili bazaar opened in 1771 or 1797, depending on the source. The same family runs it, and the Nobel laureate Naguib Mahfouz was a regular.' }, src: [7, 8] }
          ]
        },
        {
          h: { bs: 'Bejrut i Tripoli', en: 'Beirut and Tripoli' },
          p: [
            { t: { bs: 'Istraživanje Američkog univerziteta u Bejrutu opisuje bejrutsku kafanu od 1950-ih do 1980-ih kao mjesto gdje se stvarao kulturni život grada.', en: 'Research from the American University of Beirut describes the Beirut café of the 1950s to the 1980s as a place where the city\'s cultural life was made.' }, src: [9] },
            { t: { bs: 'U Tripoliju i danas radi Café Fahim, gdje stariji ljudi puše argileh na stari način: natopljeni duhan i žar direktno na njemu.', en: 'In Tripoli, Café Fahim still serves older men who smoke argileh the old way: soaked tobacco with the coal placed right on it.' }, src: [10] }
          ]
        },
        {
          h: { bs: 'Od kafane do lounge bara', en: 'From coffeehouse to lounge bar' },
          p: [
            { t: { bs: 'U SAD je između 1999. i 2004. otvoreno 200 do 300 novih kafića sa nargilom, najčešće u univerzitetskim gradovima.', en: 'Between 1999 and 2004, 200 to 300 new hookah cafés opened in the US, mostly in university towns.' }, src: [11] },
            { t: { bs: 'U Njemačkoj zvaničnog broja nema: ZDF je 2020. pisao o više od 6.000 shisha barova, a udruženje proizvođača 2024. procjenjuje oko 5.000.', en: 'Germany has no official count: ZDF wrote of more than 6,000 shisha bars in 2020, and the manufacturers\' association estimated about 5,000 in 2024.' }, src: [12, 13] }
          ]
        }
      ],
      sources: [
        { t: 'Wikipedia, "Ottoman coffeehouse" (Peçevi)', u: 'https://en.wikipedia.org/wiki/Ottoman_coffeehouse' },
        { g: 12 }, { g: 9 }, { g: 10 }, { g: 30 }, { g: 18 }, { g: 20 }, { g: 21 }, { g: 25 }, { g: 24 }, { g: 27 }, { g: 33 }, { g: 34 }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: 'duhan', art: 'huqqa',
      slug: { bs: 'duhan', en: 'tobacco' },
      span: { bs: '16. st.-danas', en: '16th c.-today' },
      title: { bs: 'Duhan: od tumbaka do voćnih mješavina', en: 'Tobacco: from tumbak to fruit blends' },
      lead: {
        bs: 'Najveća promjena u historiji nargile nije bila u staklu ni u metalu, nego u onome što se stavlja u glavu.',
        en: 'The biggest change in hookah history was not in the glass or the metal, but in what goes into the bowl.'
      },
      stations: ['bejrut', 'kairo-muassel', 'kalifornija', 'uae', 'moskva'],
      years: [
        { y: '17. st.', yEn: '17th c.', t: { bs: 'Brazilski duhan u Perziji', en: 'Brazilian tobacco in Persia' }, src: [2] },
        { y: '1990-ih', yEn: '1990s', t: { bs: 'Mu\'assel osvaja mlade', en: 'Mu\'assel wins over the young' }, src: [5, 6] },
        { y: '2006', t: { bs: 'Al Fakher prodan za 11 miliona $', en: 'Al Fakher sold for $11 million' }, src: [9] },
        { y: '2014', t: { bs: 'Moskva: mješavine bez nikotina', en: 'Moscow: nicotine-free blends' }, src: [12] }
      ],
      sections: [
        {
          h: { bs: 'Jak list i žar odozgo', en: 'Strong leaf, coal on top' },
          p: [
            { t: { bs: 'Duhan su u Perziju, kako se navodi, donijeli Portugalci početkom 16. stoljeća.', en: 'Tobacco reportedly reached Persia with the Portuguese in the early 16th century.' }, src: [1] },
            { t: { bs: 'Francuski putnik Jean Chardin zapisao je da se u safavidskoj Perziji za qalyan posebno cijenio brazilski duhan.', en: 'The French traveller Jean Chardin noted that Brazilian tobacco was especially prized for the qalyan in Safavid Persia.' }, src: [2] },
            { t: { bs: 'Stari način zove se ajami ili tumbak: suho lišće duhana bez okusa, koje se navlaži, a žar se stavlja direktno na njega.', en: 'The old way is called ajami or tumbak: dry, unflavoured tobacco leaf that is moistened, with the coal placed directly on it.' }, src: [3] },
            { t: { bs: 'Tako se i danas puši u Café Fahimu u Tripoliju.', en: 'That is still how it is smoked at Café Fahim in Tripoli.' }, src: [4] }
          ]
        },
        {
          h: { bs: 'Mu\'assel: "medeni" duhan', en: 'Mu\'assel: "honeyed" tobacco' },
          p: [
            { t: { bs: 'Mu\'assel znači "medeni". To je duhan pomiješan sa melasom, glicerinom i aromama. Neki izvori ga vežu za Egipat ranog 20. stoljeća, ali se tačan početak ne zna.', en: 'Mu\'assel means "honeyed". It is tobacco mixed with molasses, glycerine and flavourings. Some sources link it to early 20th century Egypt, but the exact beginning is unknown.' }, src: [5] },
            { t: { bs: 'Do kraja 20. stoljeća nargilu su na Bliskom istoku pušili uglavnom stariji muškarci. Od ranih 1990-ih blagi voćni mu\'assel privlači mlade, a studija iz Sirije 2004. bilježi da je nargila postala moda.', en: 'Until the late 20th century, hookahs in the Middle East were smoked mostly by older men. From the early 1990s, mild fruit mu\'assel attracts the young, and a 2004 study from Syria records that the hookah has become fashionable.' }, src: [5, 6] },
            { t: { bs: 'Japan Tobacco je 2012. kupio egipatski Nakhla i naveo da ima skoro 100 godina tradicije.', en: 'In 2012 Japan Tobacco bought Egypt\'s Nakhla, noting almost 100 years of tradition.' }, src: [7] }
          ]
        },
        {
          h: { bs: 'Industrija okusa', en: 'The flavour industry' },
          p: [
            { t: { bs: 'Kalifornijski Starbuzz se u registrovanoj marki predstavlja kao "Starbuzz Tobacco since 2005".', en: 'California\'s Starbuzz presents itself in its registered trademark as "Starbuzz Tobacco since 2005".' }, src: [8] },
            { t: { bs: 'Jordanska Al Eqbal kupila je 2006. fabriku Al Fakher u Emiratima za 11 miliona dolara, automatizovala je i počela prodavati u više od 100 zemalja.', en: 'Jordan\'s Al Eqbal bought the Al Fakher factory in the Emirates in 2006 for $11 million, automated it and began selling in more than 100 countries.' }, src: [9] }
          ]
        },
        {
          h: { bs: 'Bez duhana: biljne mase i kamenčići', en: 'Without tobacco: herbal blends and stones' },
          p: [
            { t: { bs: 'Poslije ruske zabrane pušenja 2014. mnogi moskovski lokali prelaze na voćne mješavine bez nikotina.', en: 'After Russia\'s 2014 smoking ban, many Moscow venues switch to nicotine-free fruit blends.' }, src: [12] },
            { t: { bs: 'Studija u časopisu Tobacco Control ispitala je tri "biljne" mase bez duhana. Jedna je imala visok nivo olova, hroma, nikla i arsena, a dim je sadržavao kancerogene tvari u istoj ili većoj mjeri nego dim duhana.', en: 'A study in Tobacco Control tested three tobacco-free "herbal" products. One had high levels of lead, chromium, nickel and arsenic, and the smoke contained carcinogens equal to or above those of tobacco products.' }, src: [10] },
            { t: { bs: 'Kamenčići za nargilu (steam stones) su porozni kamenčići natopljeni glicerinom i aromom. Univerzitet u Cincinnatiju je 2015. u simuliranom dimu našao hrom, arsen i kadmij, a većina metala dolazila je od uglja.', en: 'Steam stones are porous stones soaked in glycerine and flavouring. In 2015 the University of Cincinnati found chromium, arsenic and cadmium in simulated smoke, with most of the metals coming from the charcoal.' }, src: [11] }
          ]
        }
      ],
      sources: [
        { g: 3 }, { g: 4 },
        { t: 'WHO FCTC Knowledge Hub, "Waterpipe overview"', u: 'https://extranet.who.int/fctcapps/fctcapps/fctc/kh/wts/waterpipe-overview' },
        { g: 24 }, { g: 22 }, { g: 47 }, { g: 23 }, { g: 28 }, { g: 26 },
        { t: 'Hammal i sar. / et al., "\'Herbal\' but potentially hazardous", Tobacco Control 24 (2015)', u: 'https://tobaccocontrol.bmj.com/content/24/3/290' },
        { t: 'University of Cincinnati (2015), "Researchers Examine the Dangers Bubbling Up from Hookah Steam Stones"', u: 'https://www.uc.edu/news/articles/legacy/enews/2015/05/e20258.html' },
        { g: 31 }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: 'zar', art: 'qalyan',
      slug: { bs: 'zar-i-ugalj', en: 'coal-and-heat' },
      span: { bs: 'žar, folija, struja', en: 'coal, foil, electricity' },
      title: { bs: 'Žar: od užarenog uglja do struje', en: 'Heat: from glowing coal to electricity' },
      lead: {
        bs: 'Nargila bez toplote je samo vaza. Kako se grijao duhan mijenjalo je i okus, i pribor, i zdravlje.',
        en: 'A hookah without heat is just a vase. How the tobacco was heated changed the taste, the gear and the health risks.'
      },
      stations: ['bejrut', 'kairo-muassel', 'berlin'],
      years: [
        { y: 'ajami', t: { bs: 'Žar direktno na duhanu', en: 'Coal directly on tobacco' }, src: [1] },
        { y: 'mu\'assel', t: { bs: 'Folija između žara i duhana', en: 'Foil between coal and tobacco' }, src: [3] },
        { y: '2015', t: { bs: 'Studija: brzopaljivi ugalj i CO', en: 'Study: quick-light coal and CO' }, src: [5] },
        { y: '2019', t: { bs: 'Studija: električni grijači', en: 'Study: electric heaters' }, src: [7] }
      ],
      sections: [
        {
          h: { bs: 'Žar direktno na duhanu', en: 'Coal directly on the tobacco' },
          p: [
            { t: { bs: 'Kod starog ajami načina žar leži direktno na natopljenom duhanu, bez ičega između.', en: 'In the old ajami way, the coal sits directly on the soaked tobacco, with nothing in between.' }, src: [1, 2] }
          ]
        },
        {
          h: { bs: 'Folija i mu\'assel', en: 'Foil and mu\'assel' },
          p: [
            { t: { bs: 'Vlažni mu\'assel traži blažu toplotu. Zato se glava obično pokrije izbušenom folijom, a žar stavi na nju. Jedna patentna prijava iz 2015. opisuje baš taj uobičajeni način i predlaže glavu sa rubom koji drži foliju.', en: 'Moist mu\'assel needs gentler heat. So the bowl is usually covered with perforated foil and the coal placed on top. A 2015 patent application describes exactly this common method and proposes a bowl with a rim that holds the foil.' }, src: [3, 12] }
          ]
        },
        {
          h: { bs: 'Brzopaljivi i prirodni ugalj', en: 'Quick-light and natural coal' },
          p: [
            { t: { bs: 'Brzopaljivi ugalj premazan je tvarima kao što su nitrati i sumpor, da se brže upali. Centar za trovanja Univerziteta Vanderbilt upozorava da se ne zna kako udisanje tog dima djeluje na zdravlje.', en: 'Quick-light charcoal is coated with substances such as nitrates and sulphur so that it lights faster. Vanderbilt University\'s poison centre warns that the health effects of inhaling that smoke are unknown.' }, src: [4] },
            { t: { bs: 'Studija iz 2015. pratila je po jedan komad uglja 90 minuta. Brzopaljivi je u prosjeku dao oko 3.700 ppm ugljen-monoksida, a prirodni oko 1.700 ppm. Prirodni je bio topliji: oko 292 °C prema 247 °C.', en: 'A 2015 study followed a single piece of charcoal for 90 minutes. Quick-light averaged about 3,700 ppm of carbon monoxide, natural about 1,700 ppm. The natural coal burned hotter: about 292 °C against 247 °C.' }, src: [5] }
          ]
        },
        {
          h: { bs: 'Regulator toplote', en: 'The heat management device' },
          p: [
            { t: { bs: 'Kaloudov patent US 9,237,770 opisuje ploču koja leži na glavi i prenosi toplotu žara na duhan, sa poklopcem kojim se toplota regulira. Žar više ne dodiruje ni duhan ni foliju.', en: 'Kaloud\'s patent US 9,237,770 describes a plate that rests on the bowl and conducts the coal\'s heat to the tobacco, with a lid to regulate it. The coal no longer touches the tobacco or any foil.' }, src: [6] }
          ]
        },
        {
          h: { bs: 'Struja umjesto žara', en: 'Electricity instead of coal' },
          p: [
            { t: { bs: 'Američki univerzitet u Bejrutu je 2019. uporedio ugalj sa tri električna grijača. Struja je smanjila ugljen-monoksid za oko 90% i PAH za oko 80%, ali je akrolein, tvar koja nadražuje pluća, porastao nekoliko puta.', en: 'In 2019 the American University of Beirut compared charcoal with three electric heaters. Electricity cut carbon monoxide by about 90% and PAHs by about 80%, but acrolein, a lung irritant, rose several-fold.' }, src: [7] },
            { t: { bs: 'Autori zaključuju da bi reklamiranje električnih grijača kao manje štetnih moglo zavaravati. Časopis Tobacco Control 2023. piše o usponu električnih grijača kao o novoj generaciji nargila.', en: 'The authors conclude that marketing electric heaters as less harmful may be misleading. In 2023 the journal Tobacco Control described the rise of electric heating elements as a new generation of hookahs.' }, src: [7, 8] }
          ]
        },
        {
          h: { bs: 'Ugljen-monoksid u lokalu', en: 'Carbon monoxide in the lounge' },
          p: [
            { t: { bs: 'Žar stvara ugljen-monoksid. Zbog trovanja u shisha barovima Baden-Württemberg traži od lokala dovoljnu ventilaciju i detektore CO.', en: 'Burning coal produces carbon monoxide. After poisonings in shisha bars, Baden-Württemberg requires venues to have proper ventilation and CO detectors.' }, src: [9, 10] },
            { t: { bs: 'Voda hladi dim, ali ga ne čisti: i poslije vode dim sadrži visoke nivoe otrovnih tvari.', en: 'Water cools the smoke but does not clean it: even after the water, the smoke contains high levels of toxic substances.' }, src: [11] }
          ]
        }
      ],
      sources: [
        { t: 'WHO FCTC Knowledge Hub, "Waterpipe overview"', u: 'https://extranet.who.int/fctcapps/fctcapps/fctc/kh/wts/waterpipe-overview' },
        { g: 24 },
        { t: 'US 2015/0107607 A1, "Hookah Bowl" (Justia Patents)', u: 'https://patents.justia.com/patent/20150107607' },
        { t: 'Vanderbilt University Medical Center, Tennessee Poison Center (2011), "What is a hookah?"', u: 'https://www.vumc.org/poison-control/toxicology-question-week/oct-24-2011-what-hookah' },
        { t: 'Medford i sar. / et al. (2015), Undersea & Hyperbaric Medicine 42(4): ugalj i CO / charcoal and CO', u: 'https://scholars.duke.edu/publication/1092553' },
        { g: 41 },
        { t: 'El Hourani i sar. / et al. (2019), Chemical Research in Toxicology: električno grijanje i ugalj / electric vs charcoal heating', u: 'https://doi.org/10.1021/acs.chemrestox.9b00045' },
        { t: 'Ben Taleb i sar. / et al. (2023), Tobacco Control, "Next generation waterpipe devices: the rise of electrical heating elements"', u: 'https://doi.org/10.1136/tc-2023-058188' },
        { g: 38 }, { g: 39 }, { g: 40 }, { g: 22 }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: 'dijelovi', art: 'bidri',
      slug: { bs: 'dijelovi', en: 'parts' },
      span: { bs: 'kokos, metal, staklo, čelik', en: 'coconut, metal, glass, steel' },
      title: { bs: 'Dijelovi: posuda, glava, crijevo', en: 'Parts: vessel, bowl, hose' },
      lead: {
        bs: 'Svaki dio nargile ima svoju malu historiju. Neke možemo pratiti kroz muzejske zbirke, a novije kroz patente.',
        en: 'Every part of the hookah has its own small history. Some we can follow through museum collections, the newer ones through patents.'
      },
      stations: ['sana', 'bidar', 'kairo-fishawy'],
      years: [
        { y: '1604', t: { bs: 'Lula sa draguljima za Akbara', en: 'A jewelled pipe for Akbar' }, src: [13] },
        { y: 'kraj 17. st.', yEn: 'late 17th c.', t: { bs: 'Bidri posuda iz Meta', en: 'The Met\'s bidri vessel' }, src: [4] },
        { y: '1836', t: { bs: 'Lane: staklo zvano šiša', en: 'Lane: glass called shisha' }, src: [6] },
        { y: '2016', t: { bs: 'Patent: glava koja čuva sok', en: 'Patent: a bowl that keeps the juice' }, src: [9] }
      ],
      sections: [
        {
          h: { bs: 'Posuda za vodu', en: 'The water vessel' },
          p: [
            { t: { bs: 'Prva posuda bila je kokosova ljuska, po kojoj je nargila dobila ime.', en: 'The first vessel was a coconut shell, which gave the narghile its name.' }, src: [1, 2] },
            { t: { bs: 'Amsterdamski muzej lula čuva jemensku vodenu lulu od kokosa i mesinga iz perioda 1860-1920. Kokos dakle nije nestao sa prvim nargilama.', en: 'The Amsterdam Pipe Museum holds a Yemeni water pipe of coconut and brass from 1860-1920. So the coconut did not disappear with the first hookahs.' }, src: [3] },
            { t: { bs: 'U indijskom gradu Bidaru posuda postaje umjetnički predmet od legure cinka sa umecima od mesinga. Takva posuda iz kasnog 17. stoljeća u Metropolitan muzeju visoka je samo 17,5 cm.', en: 'In the Indian city of Bidar the vessel becomes an art object of zinc alloy with brass inlay. Such a vessel from the late 17th century in the Metropolitan Museum is only 17.5 cm tall.' }, src: [4, 5] },
            { t: { bs: 'Staklena posuda daje ime šiša, od perzijskog šīša, staklo. Lane je u Egiptu opisuje 1836.', en: 'The glass vessel gives the name shisha, from Persian šīša, glass. Lane describes it in Egypt in 1836.' }, src: [6, 7] }
          ]
        },
        {
          h: { bs: 'Glava', en: 'The bowl' },
          p: [
            { t: { bs: 'Science Museum u Londonu čuva zemljanu glavu za nargilu iz 19. stoljeća, sa Arapskog poluotoka ili Bliskog istoka: u obliku lijevka, sa plitkim udubljenjem i rupicama na dnu, oslikanu plavom bojom.', en: 'The Science Museum in London holds an earthenware hookah bowl from the 19th century, from the Arabian Peninsula or the Middle East: funnel-shaped, with a shallow well and holes in the bottom, painted in blue.' }, src: [8] },
            { t: { bs: 'Sa mu\'asselom je glava dobila novi problem: sok od melase curi kroz rupe u cijev. Patentna prijava iz 2016. navodi glave Tangiers Phunnel i Sahara Smoke Vortex kao primjere glava napravljenih da sok ostane gore.', en: 'Mu\'assel gave the bowl a new problem: molasses juice runs down the holes into the stem. A 2016 patent application cites the Tangiers Phunnel and the Sahara Smoke Vortex as examples of bowls designed to keep the juice up top.' }, src: [9] },
            { t: { bs: 'Regulator toplote iz Kaloudovog patenta zamjenjuje foliju pločom koja leži na glavi.', en: 'The heat management device from Kaloud\'s patent replaces the foil with a plate that rests on the bowl.' }, src: [10] }
          ],
          more: 'zar'
        },
        {
          h: { bs: 'Crijevo i usnik', en: 'Hose and mouthpiece' },
          p: [
            { t: { bs: 'Nargila je od početka predmet za društvo, pa se crijevo i usnik dijele. U lokalima svaki gost obično dobije svoj jednokratni nastavak za usta, ali se crijevo, glava i ostali dijelovi ponovo koriste.', en: 'From the start the hookah was a thing for company, so the hose and mouthpiece are shared. In venues each guest usually gets a disposable mouth tip, but the hose, bowl and other parts are reused.' }, src: [11] },
            { t: { bs: 'Zbog toga je WHO 2020. upozorio da dijeljenje usnika i crijeva može širiti koronavirus.', en: 'That is why in 2020 the WHO warned that sharing mouthpieces and hoses could spread the coronavirus.' }, src: [14] }
          ]
        },
        {
          h: { bs: 'Elektronska nargila', en: 'The electronic hookah' },
          p: [
            { t: { bs: 'Patent US 9,095,174 "Electronic hookah" opisuje nargilu u kojoj duhan zamjenjuje elektronski uređaj koji pravi paru, a pušiti može više ljudi u isto vrijeme. Prijava je objavljena 2013.', en: 'Patent US 9,095,174, "Electronic hookah", describes a hookah in which the tobacco is replaced by an electronic device that produces vapour, with several people able to smoke at once. The application was published in 2013.' }, src: [12] }
          ]
        }
      ],
      sources: [
        { g: 5 }, { g: 17 }, { g: 15 }, { g: 7 }, { g: 8 }, { g: 18 }, { g: 42 },
        { t: 'Science Museum Group, "Hookah tobacco pipe bowl (Arabian or Middle Eastern)", A653362', u: 'https://collection.sciencemuseumgroup.org.uk/objects/co125755/hookah-tobacco-pipe-bowl-arabian-or-middle-eastern-tobacco-pipe' },
        { t: 'US 2016/0037825 A1, "Hookah bowl with single use insert" (Justia Patents)', u: 'https://patents.justia.com/patent/20160037825' },
        { g: 41 },
        { t: 'BMJ Tobacco Control blog (2020), "Waterpipe Tobacco Smoking: A Potential Conduit of COVID-19"', u: 'https://blogs.bmj.com/tc/2020/03/23/waterpipe-tobacco-smoking-a-potential-conduit-of-covid-19' },
        { t: 'Google Patents, US9095174B2 "Electronic hookah" (US 2013/0032159)', u: 'https://patents.google.com/patent/US9095174' },
        { g: 1 },
        { t: 'Arab News (2020), "Has coronavirus killed off shisha cafes forever?"', u: 'https://www.arabnews.com/node/1688876' }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: 'bosna', art: 'nargile',
      slug: { bs: 'bosna-i-hercegovina', en: 'bosnia-and-herzegovina' },
      span: { bs: '16. st.-danas', en: '16th c.-today' },
      title: { bs: 'Nargila u Bosni i Hercegovini', en: 'The hookah in Bosnia and Herzegovina' },
      lead: {
        bs: 'Kafana na Bentbaši, hercegovački duhan, sarajevske luledžije i povratak nargile na Baščaršiju.',
        en: 'A coffeehouse at Bentbaša, Herzegovinian tobacco, Sarajevo\'s pipe makers and the hookah\'s return to Baščaršija.'
      },
      stations: ['sarajevo', 'istanbul'],
      years: [
        { y: '1462', t: { bs: 'Isa-beg gradi karavan-saraj', en: 'Isa-beg builds the caravanserai' }, src: [2] },
        { y: '1676', t: { bs: 'Šverc duhana iz Hercegovine', en: 'Tobacco smuggled from Herzegovina' }, src: [3] },
        { y: '1880', t: { bs: 'Fabrika duhana u Mostaru', en: 'The Mostar tobacco factory' }, src: [3] },
        { y: '2022', t: { bs: 'Zakon o duhanu u FBiH', en: 'The FBiH tobacco law' }, src: [6] }
      ],
      sections: [
        {
          h: { bs: 'Baščaršija i prva kafana', en: 'Baščaršija and the first coffeehouse' },
          p: [
            { t: { bs: 'Baščaršija nastaje 1462, kad osmanski namjesnik Isa-beg Ishaković gradi karavan-saraj. Postaje glavna trgovačka i društvena žila grada.', en: 'Baščaršija begins in 1462, when the Ottoman governor Isa-beg Isaković builds a caravanserai. It becomes the city\'s main artery of trade and social life.' }, src: [2] },
            { t: { bs: 'Prva kafana u gradu bila je, po Turističkoj organizaciji Sarajeva, Hadži Šabanova kafana na Bentbaši, otvorena sredinom 16. stoljeća. Radila je do 1942.', en: 'According to Sarajevo\'s tourist board, the first coffeehouse in town was Hajji Šaban\'s coffeehouse at Bentbaša, opened in the middle of the 16th century. It worked until 1942.' }, src: [1] }
          ]
        },
        {
          h: { bs: 'Duhan stiže u Hercegovinu', en: 'Tobacco reaches Herzegovina' },
          p: [
            { t: { bs: 'Rad u Godišnjaku Centra za balkanološka ispitivanja ANUBiH (2024) navodi da se duhan u Hercegovini pojavljuje u 17. stoljeću. Do 1880. nema organizovane proizvodnje, nego ga pojedinci uzgajaju za sebe.', en: 'A paper in the Yearbook of the Centre for Balkan Studies of the Academy of Sciences of Bosnia and Herzegovina (2024) says tobacco appears in Herzegovina in the 17th century. Until 1880 there is no organised production, only individuals growing it for themselves.' }, src: [3] },
            { t: { bs: 'U Dubrovačkom arhivu šverc duhana iz Hercegovine prvi put se spominje 1676. Pod osmanskom vlašću nije bilo monopola, plaćao se samo porez na proizvodnju.', en: 'The Dubrovnik archive first mentions tobacco smuggled from Herzegovina in 1676. Under Ottoman rule there was no monopoly, only a tax on production.' }, src: [3] },
            { t: { bs: 'Pod Austro-Ugarskom je 1880. osnovana fabrika duhana u Mostaru i otkupne stanice po cijeloj Hercegovini. Hercegovački duhan krajem 19. stoljeća osvaja nagrade na izložbama u evropskim gradovima.', en: 'Under Austria-Hungary, the Mostar tobacco factory and buying offices across Herzegovina were set up in 1880. At the end of the 19th century Herzegovinian tobacco wins prizes at exhibitions in European cities.' }, src: [3] }
          ]
        },
        {
          h: { bs: 'Luledžije, čibuk i nargila', en: 'Pipe makers, chibouk and hookah' },
          p: [
            { t: { bs: 'Isti rad bilježi da su lule za čibuk i nargilu pravile luledžije u Sarajevu, i da se pored čibuka pušilo i na nargilu.', en: 'The same paper records that pipes for the chibouk and the hookah were made by luledžije, pipe makers, in Sarajevo, and that besides the chibouk people also smoked the hookah.' }, src: [3] },
            { t: { bs: 'Luledžina ulica na Baščaršiji nosi ime po hadži hafizu Mustafi Muhiću, zvanom Luledžija, jer je u mladosti pravio lule.', en: 'Luledžina street in Baščaršija is named after Hajji Hafiz Mustafa Muhić, nicknamed Luledžija because he made pipes when he was young.' }, src: [4] },
            { t: { bs: 'Posljednji čibukčija u Mostaru radio je do Prvog svjetskog rata.', en: 'The last chibouk maker in Mostar worked until the First World War.' }, src: [3] }
          ]
        },
        {
          h: { bs: 'Povratak na Baščaršiju', en: 'Back to Baščaršija' },
          p: [
            { t: { bs: 'Turistička organizacija Sarajeva piše da je nargila, poslije pauze od nekoliko decenija, ponovo vrlo popularna, posebno na Baščaršiji.', en: 'Sarajevo\'s tourist board writes that after a pause of several decades the hookah is very popular again, especially in Baščaršija.' }, src: [1] },
            { t: { bs: 'Jedan lokal na Baščaršiji navodi da nudi više od 100 nargila.', en: 'One venue in Baščaršija says it offers more than 100 hookahs.' }, src: [7] }
          ]
        },
        {
          h: { bs: 'Zakon iz 2022.', en: 'The 2022 law' },
          p: [
            { t: { bs: 'U Federaciji BiH zakon o kontroli i ograničenoj upotrebi duhana i drugih proizvoda za pušenje potpisan je 25. maja 2022. Zabranjuje pušenje u zatvorenim javnim prostorima, na radnom mjestu i u javnom prevozu.', en: 'In the Federation of Bosnia and Herzegovina, the law on the control and limited use of tobacco and other smoking products was signed on 25 May 2022. It bans smoking in enclosed public places, workplaces and public transport.' }, src: [6] },
            { t: { bs: 'Lokali koji služe samo piće mogu imati prostor za pušenje ako ispune uslove, kao što su ventilacija i oznake. Za nargila barove važe ista pravila kao za ostale, maloljetnici u njih ne smiju, a hrana se tamo ne služi.', en: 'Venues that serve only drinks may have a smoking area if they meet conditions such as ventilation and signage. Hookah bars follow the same rules as other bars, minors are not allowed in, and no food is served there.' }, src: [5] },
            { t: { bs: 'Republika Srpska u vrijeme donošenja zakona nije imala slična pravila.', en: 'At the time the law was passed, Republika Srpska had no similar rules.' }, src: [6] }
          ],
          more: 'zakoni'
        }
      ],
      sources: [
        { g: 30 }, { g: 29 },
        { t: 'Godišnjak Centra za balkanološka ispitivanja ANUBiH 39 (2024), "On the history of tobacco in Herzegovina until the end of the First World War", str. 189-198', u: 'https://doi.org/10.5644/Godisnjak.CBI.ANUBiH.39.12' },
        { t: 'Visit Sarajevo, "Luledžina"', u: 'https://sarajevo.travel/en/things-to-do/luledzina/698' },
        { t: 'N1 BiH, "New smoking regulations for hospitality in FBiH take effect"', u: 'https://n1info.ba/english/news/new-smoking-regulations-for-hospitality-in-fbih-take-effect/' },
        { t: 'Génération Sans Tabac, "Bosnia and Herzegovina enacts anti-smoking law"', u: 'https://www.generationsanstabac.org/en/?p=20696' },
        { t: 'Visit Sarajevo, "Mahala"', u: 'https://sarajevo.travel/en/things-to-do/mahala/560' }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: 'zakoni', art: 'glass',
      slug: { bs: 'zakoni-i-zabrane', en: 'laws-and-bans' },
      span: { bs: '1633-2022', en: '1633-2022' },
      title: { bs: 'Zakoni i zabrane', en: 'Laws and bans' },
      lead: {
        bs: 'Od sultanove smrtne kazne do zakona o ventilaciji. Četiri stoljeća vlasti pokušavaju ugasiti žar, a nargila se svaki put vrati u drugom obliku.',
        en: 'From a sultan\'s death penalty to ventilation rules. For four centuries rulers have tried to put out the coal, and the hookah keeps coming back.'
      },
      stations: ['isfahan', 'istanbul', 'teheran', 'moskva', 'berlin'],
      years: [
        { y: '1633', t: { bs: 'Murad IV: smrtna kazna', en: 'Murad IV: death penalty' }, src: [1, 2] },
        { y: '1891', t: { bs: 'Duhanski bojkot u Perziji', en: 'Tobacco boycott in Persia' }, src: [3] },
        { y: '2004', t: { bs: 'Irska: prva zabrana u svim radnim prostorima', en: 'Ireland: first ban in all workplaces' }, src: [4] },
        { y: '2016', t: { bs: 'FDA i WHO o nargili', en: 'FDA and WHO on the hookah' }, src: [11, 12] },
        { y: '2020', t: { bs: 'Korona zatvara nargila kafiće', en: 'COVID closes hookah cafés' }, src: [13, 14, 15] }
      ],
      sections: [
        {
          h: { bs: 'Prve zabrane', en: 'The first bans' },
          p: [
            { t: { bs: 'Šah Abbas I u Perziji nije volio duhan i zabranio ga je, ali se pušilo i dalje.', en: 'Shah Abbas I of Persia disliked tobacco and banned it, but people kept smoking.' }, src: [16] },
            { t: { bs: 'U Istanbulu sultan Murad IV 1633, poslije velikog požara, zatvara kafane i uvodi smrtnu kaznu za javno pušenje. Zabranu je ukinuo tek njegov nasljednik Ibrahim.', en: 'In Istanbul in 1633, after a great fire, Sultan Murad IV closes the coffeehouses and introduces the death penalty for public smoking. Only his successor Ibrahim lifted the ban.' }, src: [1, 2] },
            { t: { bs: 'U Perziji 1890. šah daje Britancu monopol na duhan. Poslije fetve Mirze Hasana Širazija u decembru 1891. ljudi prestaju pušiti, i koncesija pada u januaru 1892.', en: 'In Persia in 1890 the shah grants a Briton a tobacco monopoly. After Mirza Hasan Shirazi\'s fatwa in December 1891 people stop smoking, and the concession falls in January 1892.' }, src: [3] }
          ]
        },
        {
          h: { bs: 'Zabrana pušenja u zatvorenom', en: 'Indoor smoking bans' },
          p: [
            { t: { bs: 'Irska je 29. marta 2004. postala prva zemlja koja je zakonom zabranila pušenje u svim zatvorenim radnim prostorima, uključujući pabove.', en: 'On 29 March 2004 Ireland became the first country to ban smoking by law in all enclosed workplaces, pubs included.' }, src: [4] },
            { t: { bs: 'Turska je 19. jula 2009. zabranu proširila na barove, restorane, seoske kafane i nargila kafiće. Vlasnici su nargilu brzo iznijeli na zastakljene terase.', en: 'On 19 July 2009 Turkey extended its ban to bars, restaurants, village coffeehouses and hookah cafés. Owners quickly moved the hookah onto glassed-in terraces.' }, src: [5, 6] },
            { t: { bs: 'Libanski zakon 174 iz 2011. stupio je na snagu 3. septembra 2012. Po L\'Orient-Le Jouru strogo se provodio samo oko četiri mjeseca.', en: 'Lebanon\'s Law 174 of 2011 came into force on 3 September 2012. According to L\'Orient-Le Jour, it was strictly enforced for only about four months.' }, src: [7, 8] },
            { t: { bs: 'Rusija 2013. donosi zakon protiv pušenja na javnim mjestima, a restorani i kafići dobijaju rok do 1. juna 2014. Tada se nargila nudila u oko 40% moskovskih restorana i kafića.', en: 'In 2013 Russia passes a law against smoking in public places, giving restaurants and cafés until 1 June 2014. At the time, hookahs were offered in about 40% of Moscow\'s restaurants and cafés.' }, src: [9, 10] }
          ]
        },
        {
          h: { bs: '2016: nargila postaje posebna tema', en: '2016: the hookah becomes its own topic' },
          p: [
            { t: { bs: 'Američka FDA u maju 2016. stavlja duhan za nargilu pod svoj nadzor, od 8. augusta 2016. Pravilo obuhvata i nargile, dodatke za okus i ugalj sa okusom, a pribor kao što su hvataljke ne.', en: 'In May 2016 the US FDA brings hookah tobacco under its authority, from 8 August 2016. The rule also covers hookahs, flavour enhancers and flavoured charcoal, but not accessories such as tongs.' }, src: [11] },
            { t: { bs: 'Na konferenciji Okvirne konvencije WHO o kontroli duhana 12. novembra 2016. usvojena je posebna odluka o kontroli i prevenciji duhana za nargilu.', en: 'On 12 November 2016 the conference of the WHO Framework Convention on Tobacco Control adopted a separate decision on the control and prevention of waterpipe tobacco.' }, src: [12] }
          ]
        },
        {
          h: { bs: 'Korona, 2020.', en: 'COVID, 2020' },
          p: [
            { t: { bs: 'WHO je upozorio da dijeljenje usnika i crijeva može širiti virus. Saudijska Arabija, Emirati i Kuvajt zabranili su nargilu u kafićima.', en: 'The WHO warned that sharing mouthpieces and hoses could spread the virus. Saudi Arabia, the UAE and Kuwait banned hookahs in cafés.' }, src: [15, 13] },
            { t: { bs: 'Kairo je 16. marta 2020. zabranio nargilu u kafanama i na javnim mjestima, uz prijetnju zatvaranjem lokala.', en: 'On 16 March 2020 Cairo banned hookahs in coffeehouses and public places, under threat of closing the venues.' }, src: [14] }
          ]
        },
        {
          h: { bs: 'Njemačka i Bosna i Hercegovina', en: 'Germany and Bosnia and Herzegovina' },
          p: [
            { t: { bs: 'U Njemačkoj se od jula 2022. duhan za nargilu smio prodavati samo u pakovanjima do 25 grama, a zbog trovanja ugljen-monoksidom pokrajine traže ventilaciju i detektore CO.', en: 'From July 2022 hookah tobacco in Germany could only be sold in packs of up to 25 grams, and after carbon monoxide poisonings states require ventilation and CO detectors.' }, src: [17, 18] },
            { t: { bs: 'Federacija BiH je 2022. donijela zakon koji zabranjuje pušenje u zatvorenim javnim prostorima, uz posebne uslove za lokale sa prostorom za pušenje.', en: 'In 2022 the Federation of Bosnia and Herzegovina passed a law banning smoking in enclosed public places, with special conditions for venues with smoking areas.' }, src: [19] }
          ],
          more: 'bosna'
        }
      ],
      sources: [
        { g: 9 }, { g: 10 }, { g: 13 },
        { t: 'European Respiratory Journal (2004), uvodnik o irskoj zabrani / editorial on the Irish ban, 24(3): 337', u: 'https://publications.ersnet.org/content/erj/24/3/337' },
        { t: 'Wikipedia, "Smoking in Turkey"', u: 'https://en.wikipedia.org/wiki/Smoking_in_Turkey' },
        { t: 'Hürriyet Daily News, "Turkey\'s nargileh culture under threat"', u: 'https://www.hurriyetdailynews.com/turkeys-nargileh-culture-under-threat-41676' },
        { t: 'L\'Orient Today, "Lebanon\'s anti-smoking law: will it be amended for better enforcement?"', u: 'https://today.lorientlejour.com/article/1173262/lebanons-anti-smoking-law-will-it-be-amended-for-better-enforcement.html' },
        { t: 'WHO EMRO, "Lebanon: protecting people from tobacco smoke"', u: 'https://www.emro.who.int/tfi/news/lebanon-protecting-people-from-tobacco-smoke.html' },
        { g: 32 }, { g: 31 },
        { t: 'GrayRobinson (2016), "FDA\'s Deeming Rule Extends the Agency\'s Authority over Tobacco Products"', u: 'https://www.gray-robinson.com/article/post/1190/detail' },
        { t: 'WHO FCTC, odluka / decision FCTC/COP7(4) "Control and prevention of waterpipe tobacco products" (2016)', u: 'https://fctc.who.int/publications/m/item/fctc-cop7(4)-control-and-prevention-of-waterpipe-tobacco-products' },
        { t: 'Al Arabiya (10. 3. 2020), "Saudi Arabia bans shisha tobacco to prevent spread of coronavirus"', u: 'https://english.alarabiya.net/en/News/gulf/2020/03/10/Saudi-Arabia-bans-shisha-tobacco-to-prevent-spread-of-coronavirus-.html' },
        { t: 'Ahram Online (2020), "Cairo bans shisha in a bid to halt the spread of coronavirus"', u: 'https://english.ahram.org.eg/WorldCup/News/365404.aspx' },
        { t: 'Arab News (2020), "Has coronavirus killed off shisha cafes forever?"', u: 'https://www.arabnews.com/node/1688876' },
        { g: 3 }, { g: 36 }, { g: 39 },
        { t: 'Génération Sans Tabac, "Bosnia and Herzegovina enacts anti-smoking law"', u: 'https://www.generationsanstabac.org/en/?p=20696' }
      ]
    },

    /* ---------------------------------------------------------------- */
    {
      id: 'danas', art: 'modern',
      slug: { bs: 'nargila-danas', en: 'hookah-today' },
      span: { bs: 'danas i sutra', en: 'today and tomorrow' },
      title: { bs: 'Nargila danas', en: 'The hookah today' },
      lead: {
        bs: 'Ko danas puši nargilu, koliko vrijedi industrija i šta nauka kaže o novim napravama.',
        en: 'Who smokes the hookah today, what the industry is worth and what science says about the new devices.'
      },
      stations: ['uae', 'kalifornija', 'berlin'],
      years: [
        { y: '2010-2019', t: { bs: 'Ankete u 72 zemlje', en: 'Surveys in 72 countries' }, src: [1] },
        { y: '2020', t: { bs: 'Al Eqbal: posao od 1,4 milijarde $', en: 'Al Eqbal: a $1.4 billion deal' }, src: [4, 5] },
        { y: '2023', t: { bs: 'Nova generacija: električni grijači', en: 'A new generation: electric heaters' }, src: [7] }
      ],
      sections: [
        {
          h: { bs: 'Ko puši nargilu', en: 'Who smokes the hookah' },
          p: [
            { t: { bs: 'Studija iz 2022. obradila je ankete među tinejdžerima u 72 zemlje, iz perioda 2010-2019. U prosjeku je 6,9% njih pušilo nargilu bar jednom u prethodnih 30 dana. Najviše je bilo u evropskoj regiji WHO-a (10,9%) i na istočnom Mediteranu (10,7%).', en: 'A 2022 study analysed surveys of teenagers in 72 countries from 2010-2019. On average 6.9% had smoked a hookah at least once in the previous 30 days. Rates were highest in the WHO European region (10.9%) and the Eastern Mediterranean (10.7%).' }, src: [1] },
            { t: { bs: 'U Njemačkoj je po studiji instituta Robert Koch 28,9% tinejdžera od 12 do 17 godina probalo nargilu.', en: 'In Germany, according to a Robert Koch Institute study, 28.9% of teenagers aged 12 to 17 had tried a hookah.' }, src: [2] },
            { t: { bs: 'Na jednom velikom američkom univerzitetu 9,5% studenata pušilo je nargilu u prethodnih 30 dana (studija iz 2008).', en: 'At one large US university, 9.5% of students had smoked a hookah in the previous 30 days (a 2008 study).' }, src: [3] }
          ]
        },
        {
          h: { bs: 'Veliki biznis', en: 'Big business' },
          p: [
            { t: { bs: 'U novembru 2020. britanski fond Kingsway Capital preuzeo je Al Eqbal, vlasnika Al Fakhera, u poslu procijenjenom na više od 1,4 milijarde dolara. Fabrika je 2006. kupljena za 11 miliona.', en: 'In November 2020 the British fund Kingsway Capital took over Al Eqbal, owner of Al Fakher, in a deal valued at more than $1.4 billion. The factory had been bought for $11 million in 2006.' }, src: [4, 5, 6] }
          ],
          more: 'duhan'
        },
        {
          h: { bs: 'Nove naprave', en: 'New devices' },
          p: [
            { t: { bs: 'Časopis Tobacco Control 2023. opisuje električne grijače kao novu generaciju nargila. Studija iz Bejruta iz 2019. pokazala je da smanjuju ugljen-monoksid, ali povećavaju akrolein.', en: 'In 2023 the journal Tobacco Control described electric heaters as a new generation of hookahs. A 2019 study from Beirut showed that they cut carbon monoxide but increase acrolein.' }, src: [7, 8] },
            { t: { bs: 'Elektronska nargila, u kojoj paru pravi uređaj umjesto duhana, opisana je u patentnoj prijavi objavljenoj 2013.', en: 'The electronic hookah, in which a device makes vapour instead of burning tobacco, is described in a patent application published in 2013.' }, src: [9] }
          ],
          more: 'zar'
        },
        {
          h: { bs: 'Šta kaže nauka', en: 'What science says' },
          p: [
            { t: { bs: 'Po WHO-u, u jednoj sesiji nargile može se udahnuti onoliko dima koliko iz 100 ili više cigareta. Voda dim hladi, ali ga ne čisti.', en: 'According to the WHO, one hookah session can mean inhaling as much smoke as from 100 or more cigarettes. Water cools the smoke but does not clean it.' }, src: [10] },
            { t: { bs: 'Konferencija Okvirne konvencije WHO o kontroli duhana i 2023. ima izvještaj o pravilima za sastav i označavanje duhana za nargilu.', en: 'In 2023 the WHO Framework Convention on Tobacco Control conference again had a report on rules for the contents and disclosure of waterpipe tobacco.' }, src: [11] }
          ]
        }
      ],
      sources: [
        { t: 'Frontiers in Public Health (2022), upotreba nargile među adolescentima / waterpipe use among adolescents, 10.3389/fpubh.2022.1052519', u: 'https://www.frontiersin.org/journals/public-health/articles/10.3389/fpubh.2022.1052519/full' },
        { g: 35 }, { g: 27 }, { g: 43 }, { g: 46 }, { g: 26 },
        { t: 'Ben Taleb i sar. / et al. (2023), Tobacco Control, "Next generation waterpipe devices: the rise of electrical heating elements"', u: 'https://doi.org/10.1136/tc-2023-058188' },
        { t: 'El Hourani i sar. / et al. (2019), Chemical Research in Toxicology: električno grijanje i ugalj / electric vs charcoal heating', u: 'https://doi.org/10.1021/acs.chemrestox.9b00045' },
        { t: 'Google Patents, US9095174B2 "Electronic hookah" (US 2013/0032159)', u: 'https://patents.google.com/patent/US9095174' },
        { g: 40 },
        { t: 'WHO FCTC (2023), FCTC/COP/10/7: sastav i označavanje proizvoda, uključujući nargilu / contents and disclosure, including waterpipe', u: 'https://fctc.who.int/convention/conference-of-the-parties/sessions/tenth-session-of-the-conference-of-the-parties/main-documents' }
      ]
    }
  ];
})(typeof window !== 'undefined' ? window : globalThis);
