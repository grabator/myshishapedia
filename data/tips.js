/*
 * MyShishapedia - "Savjeti za bolji okus" (oba jezika).
 *
 * Svaka sekcija:
 *   id       kratko ime; sekcija dobije sidro #savjet-<id> (isto na oba jezika)
 *   icon     slika uz naslov: 'bowl', 'heat', 'cloud', 'ice' ili 'clean'
 *   title    naslov sekcije
 *   lead     jedna-dvije rečenice uvoda
 *   tips     savjeti: [{ title, text }]; u tekstu [[id|tekst]] postaje link na pojam u rječniku
 *   numbers  opcionalno: kratke brojke za karticu "U brojkama" ([{ label, value }])
 *   more     linkovi "Više o tome": { guide: <broj koraka> }, { gear: '<id iz data/gear.js>' }
 *            ili { term: '<id iz data/glossary.js>' }
 *
 * Brojke su okvirne preporuke i navedene su u docs/UPUTSTVO.md kao "provjeriti".
 */
window.TIPS = {
  sections: [
    {
      id: 'pakovanje',
      icon: 'bowl',
      title: { bs: 'Pakovanje glave', en: 'Packing the bowl' },
      lead: {
        bs: 'Kako napuniš posudu odlučuje koliko će okus biti jasan i koliko dugo traje. Većina "zagorjelih" sesija počne baš ovdje.',
        en: 'How you fill the bowl decides how clear the flavor is and how long it lasts. Most "burnt" sessions start right here.'
      },
      tips: [
        {
          title: { bs: 'Rastresi, ne gnječi', en: 'Sprinkle, do not press' },
          text: {
            bs: 'Pusti duhan da prstima pada u posudu. Vazduh mora prolaziti između listića, inače se duhan peče umjesto da isparava i brzo [[zagorjelo|zagori]]. To je [[rastresito-punjenje|rastresito punjenje]].',
            en: 'Let the tobacco fall into the bowl through your fingers. Air has to pass between the shreds; otherwise the tobacco roasts instead of steaming and quickly turns [[zagorjelo|burnt]]. This is a [[rastresito-punjenje|fluff pack]].'
          }
        },
        {
          title: { bs: 'Ostavi malo mjesta gore', en: 'Leave a little headroom' },
          text: {
            bs: 'Napuni do 2-3 mm ispod ivice. Duhan ne smije dodirivati [[folija|foliju]] ili [[hmd|HMD]], jer se tada dio odmah prži.',
            en: 'Fill to 2-3 mm below the rim. The tobacco must not touch the [[folija|foil]] or [[hmd|HMD]], or part of it starts frying right away.'
          }
        },
        {
          title: { bs: 'List bira način punjenja', en: 'Let the leaf decide' },
          text: {
            bs: '[[svijetli-list|Svijetli list]] (npr. Adalya, Al Fakher, Fumari) voli rastresito. [[tamni-list|Tamni list]] (npr. Darkside, MustHave, Tangiers) podnosi [[gusto-punjenje|gušće punjenje]] i više toplote.',
            en: '[[svijetli-list|Blonde leaf]] (such as Adalya, Al Fakher, Fumari) likes a fluff pack. [[tamni-list|Dark leaf]] (such as Darkside, MustHave, Tangiers) can take a [[gusto-punjenje|denser pack]] and more heat.'
          }
        },
        {
          title: { bs: 'Ocijedi višak soka', en: 'Drain the extra juice' },
          text: {
            bs: 'Duhan treba biti vlažan, ali da ne curi. Previše [[melasa|melase]] začepi rupice i dim postane težak i sladunjav.',
            en: 'Tobacco should be moist but not dripping. Too much [[melasa|molasses]] clogs the holes and the smoke turns heavy and cloying.'
          }
        },
        {
          title: { bs: 'Phunnel: otvor ostaje slobodan', en: 'Phunnel: keep the spire clear' },
          text: {
            bs: 'Kod [[phunnel|phunnel posude]] puni u krug oko središnjeg stubića i nikad ne prekrivaj otvor. Tako sok ne curi u stub.',
            en: 'With a [[phunnel|phunnel bowl]], fill in a ring around the center spire and never cover the hole. That keeps juice from dripping into the stem.'
          }
        }
      ],
      numbers: [
        { label: { bs: 'Razmak do ivice', en: 'Gap below the rim' }, value: { bs: '2-3 mm', en: '2-3 mm' } },
        { label: { bs: 'Duhana u posudi', en: 'Tobacco per bowl' }, value: { bs: 'oko 12-20 g', en: 'about 12-20 g' } }
      ],
      more: [{ guide: 3 }, { guide: 4 }, { gear: 'phunnel' }, { term: 'rastresito-punjenje' }]
    },
    {
      id: 'toplota',
      icon: 'heat',
      title: { bs: 'Kontrola toplote', en: 'Heat management' },
      lead: {
        bs: 'Većina problema sa okusom je u stvari problem toplote. Premalo i nema dima, previše i sve je gorko.',
        en: 'Most flavor problems are really heat problems. Too little and there is no smoke; too much and everything tastes bitter.'
      },
      tips: [
        {
          title: { bs: 'Ugalj mora biti potpuno užaren', en: 'Coals must be fully lit' },
          text: {
            bs: '[[kokosovi-ugljevi|Kokosovi ugljevi]] trebaju 8-10 minuta na [[resoo|rešou]], dok ne budu sivi sa svih strana. Ugalj sa crnim dijelom daje oštar dim.',
            en: '[[kokosovi-ugljevi|Coconut coals]] need 8-10 minutes on the [[resoo|burner]], until they are grey on every side. A coal with a black patch gives harsh smoke.'
          }
        },
        {
          title: { bs: 'Kreni sa manje', en: 'Start low' },
          text: {
            bs: 'Za početak tri kocke uz ivicu posude. Lakše je dodati toplotu nego spasiti posudu koja je zagorjela.',
            en: 'Start with three cubes along the edge of the bowl. It is easier to add heat than to rescue a bowl that has burnt.'
          }
        },
        {
          title: { bs: 'Strpljivo zagrij', en: 'Warm it up patiently' },
          text: {
            bs: 'Sačekaj 3-5 minuta [[predgrijavanje|predgrijavanja]] prije prvog ozbiljnog povlačenja. Dim se tek tada "razvije".',
            en: 'Give it 3-5 minutes of [[predgrijavanje|heat-up]] before the first real pull. That is when the smoke opens up.'
          }
        },
        {
          title: { bs: 'Pomjeraj ugljeve', en: 'Move the coals around' },
          text: {
            bs: 'Ugljevi na ivici griju blaže, a prema sredini jače. Svakih 10-15 minuta ih okreni ili pomjeri i otresi pepeo, da toplota ostane ravnomjerna.',
            en: 'Coals on the edge heat gently; toward the center they heat harder. Every 10-15 minutes turn or shift them and knock off the ash to keep the heat even.'
          }
        },
        {
          title: { bs: 'Folija ili HMD', en: 'Foil or HMD' },
          text: {
            bs: 'Na [[folija|foliji]] više sitnih, ravnomjerno raspoređenih rupica znači ravnomjerniju toplotu. Sa [[hmd|HMD-om]] toplotu podešavaš otvorima, bez bušenja, i teže zagori.',
            en: 'On [[folija|foil]], more small, evenly spaced holes mean more even heat. With an [[hmd|HMD]] you set the heat with its vents, no poking needed, and it burns less easily.'
          }
        },
        {
          title: { bs: 'Gorko? Skini jedan ugalj', en: 'Bitter? Take one coal off' },
          text: {
            bs: 'Čim dim postane ljut ili gorak, skloni jedan ugalj na [[tacna|tacnu]] i izduvaj ustajali dim kroz [[purge-ventil|ventil]]. Izbjegavaj [[brzopaleci-ugljevi|brzopaleće ugljeve]], jer njihov hemijski miris prelazi u okus.',
            en: 'As soon as the smoke turns harsh or bitter, move one coal to the [[tacna|tray]] and clear the stale smoke through the [[purge-ventil|purge valve]]. Avoid [[brzopaleci-ugljevi|quick-light coals]]; their chemical smell gets into the flavor.'
          }
        }
      ],
      numbers: [
        { label: { bs: 'Paljenje kokosovih ugljeva', en: 'Lighting coconut coals' }, value: { bs: '8-10 min', en: '8-10 min' } },
        { label: { bs: 'Ugljeva za početak', en: 'Coals to start with' }, value: { bs: '3 kocke', en: '3 cubes' } },
        { label: { bs: 'Predgrijavanje', en: 'Heat-up' }, value: { bs: '3-5 min', en: '3-5 min' } },
        { label: { bs: 'Pomjeranje ugljeva', en: 'Moving the coals' }, value: { bs: 'svakih 10-15 min', en: 'every 10-15 min' } }
      ],
      more: [{ guide: 5 }, { guide: 6 }, { guide: 7 }, { gear: 'hmd' }, { gear: 'kokos-kocke' }]
    },
    {
      id: 'dim',
      icon: 'cloud',
      title: { bs: 'Gušći dim', en: 'Thicker clouds' },
      lead: {
        bs: 'Gust dim dolazi od dobre toplote i [[glicerin|glicerina]] u duhanu, a ne od jačeg povlačenja.',
        en: 'Thick smoke comes from good heat and the [[glicerin|glycerin]] in the tobacco, not from pulling harder.'
      },
      tips: [
        {
          title: { bs: 'Duga i mirna povlačenja', en: 'Long, steady pulls' },
          text: {
            bs: 'Povlači polako, 4-6 sekundi. Kratka i jaka povlačenja naglo pregriju duhan i daju manje, a oštrije dima.',
            en: 'Pull slowly for 4-6 seconds. Short, hard pulls overheat the tobacco and give less, harsher smoke.'
          }
        },
        {
          title: { bs: 'Promiješaj pakovanje', en: 'Stir the tub' },
          text: {
            bs: 'Glicerin i melasa se slegnu na dno pakovanja. Promiješaj prije punjenja, jer suh duhan sa vrha daje malo dima.',
            en: 'Glycerin and molasses settle at the bottom of the tub. Stir before packing, because dry tobacco from the top gives little smoke.'
          }
        },
        {
          title: { bs: 'Malo više toplote kad dim oslabi', en: 'A bit more heat when it fades' },
          text: {
            bs: 'Ako dim oslabi nakon pola sata, primakni jedan ugalj sredini ili dodaj novi. Ne čekaj da se posuda ohladi.',
            en: 'If the smoke fades after half an hour, move one coal toward the center or add a fresh one. Do not wait for the bowl to cool down.'
          }
        },
        {
          title: { bs: 'Provjeri dihtovanje', en: 'Check the seals' },
          text: {
            bs: 'Ako nargila negdje propušta vazduh, dim je rijedak. Provjeri [[gumice|gumice]] na stubu, posudi i crijevu.',
            en: 'If the hookah leaks air somewhere, the smoke gets thin. Check the [[gumice|grommets]] on the stem, bowl and hose.'
          }
        },
        {
          title: { bs: 'Pravi nivo vode', en: 'The right water level' },
          text: {
            bs: 'Donji kraj [[stub|stuba]] treba biti 2-3 cm ispod vode. Previše vode otežava povlačenje, pa dima ima manje.',
            en: 'The bottom of the [[stub|stem]] should sit 2-3 cm (about an inch) under the water. Too much water makes the draw heavy, so you get less smoke.'
          }
        }
      ],
      numbers: [
        { label: { bs: 'Jedno povlačenje', en: 'One pull' }, value: { bs: '4-6 s', en: '4-6 s' } },
        { label: { bs: 'Stub ispod vode', en: 'Stem under water' }, value: { bs: '2-3 cm', en: '2-3 cm' } }
      ],
      more: [{ guide: 8 }, { term: 'glicerin' }, { term: 'gumice' }]
    },
    {
      id: 'led',
      icon: 'ice',
      title: { bs: 'Led u vazi', en: 'Ice in the base' },
      lead: {
        bs: 'Hladniji dim je mekši na grlu i ugodniji, posebno ljeti i kod ledenih okusa.',
        en: 'Cooler smoke is smoother on the throat and more pleasant, especially in summer and with icy flavors.'
      },
      tips: [
        {
          title: { bs: 'Kocke leda u vodu', en: 'Ice cubes in the water' },
          text: {
            bs: 'Ubaci 3-6 kocki leda u [[vaza|vazu]], pa tek onda dopuni vodom do pravog nivoa. Led ne smije začepiti donji kraj stuba.',
            en: 'Drop 3-6 ice cubes into the [[vaza|base]], then top up with water to the right level. The ice must not block the bottom of the stem.'
          }
        },
        {
          title: { bs: 'Hladna voda radi skoro isto', en: 'Cold water does nearly the same' },
          text: {
            bs: 'Ako nemaš leda, voda iz frižidera ohladi dim skoro jednako dobro.',
            en: 'No ice? Water straight from the fridge cools the smoke almost as well.'
          }
        },
        {
          title: { bs: 'Pazi na staklo', en: 'Mind the glass' },
          text: {
            bs: 'Nikad ne sipaj ledenu vodu u toplu vazu i ne stavljaj vazu u zamrzivač: staklo može pući od nagle promjene temperature.',
            en: 'Never pour ice water into a warm base and never put the base in the freezer: glass can crack from a sudden temperature change.'
          }
        },
        {
          title: { bs: 'Led hladi, ne dodaje mentu', en: 'Ice cools, it does not add mint' },
          text: {
            bs: 'Led ublaži dim, ali "ledeni" osjećaj kod okusa poput Blue Ice ili Cane Mint dolazi iz samog duhana (mentol, hlađenje).',
            en: 'Ice softens the smoke, but the "icy" feel of flavors like Blue Ice or Cane Mint comes from the tobacco itself (menthol, cooling).'
          }
        }
      ],
      numbers: [
        { label: { bs: 'Kocke leda', en: 'Ice cubes' }, value: { bs: '3-6', en: '3-6' } }
      ],
      more: [{ guide: 1 }, { term: 'vaza' }]
    },
    {
      id: 'ciscenje',
      icon: 'clean',
      title: { bs: 'Čišćenje za čist okus', en: 'Cleaning for a clean taste' },
      lead: {
        bs: 'Stari okus se lijepi za vazu, stub, posudu i crijevo, pa ni najbolji novi okus nije čist.',
        en: 'Old flavor clings to the base, stem, bowl and hose, so even the best new flavor never tastes clean.'
      },
      tips: [
        {
          title: { bs: 'Nova voda za svaku sesiju', en: 'Fresh water every session' },
          text: {
            bs: 'Prosipaj vodu poslije svake [[sesija|sesije]]. Ustajala voda brzo počne mirisati i taj miris ide u dim.',
            en: 'Pour out the water after every [[sesija|session]]. Stale water soon starts to smell, and that smell ends up in the smoke.'
          }
        },
        {
          title: { bs: 'Isperi odmah poslije', en: 'Rinse right after' },
          text: {
            bs: 'Kad se ugljevi ohlade, isperi vazu, stub i posudu toplom vodom, a stub očisti četkom. Svježa melasa se skida lako, a zasušena teško.',
            en: 'Once the coals are cold, rinse the base, stem and bowl with warm water and brush out the stem. Fresh molasses comes off easily; dried molasses does not.'
          }
        },
        {
          title: { bs: 'Limun ili soda za mirise', en: 'Lemon or baking soda for smells' },
          text: {
            bs: 'Jednom sedmično dublje čišćenje: kašika sode bikarbone ili sok pola limuna u toploj vodi, pa sve dobro isperi. Izbjegavaj deterdžente sa mirisom.',
            en: 'Once a week, clean more deeply: a spoonful of baking soda or the juice of half a lemon in warm water, then rinse everything well. Avoid scented detergents.'
          }
        },
        {
          title: { bs: 'Silikonsko crijevo', en: 'Silicone hose' },
          text: {
            bs: 'Silikonsko [[crijevo|crijevo]] samo isperi vodom i ostavi da se osuši. Ono ne upija mirise, pa je najbolje ako često mijenjaš okuse.',
            en: 'Just rinse a silicone [[crijevo|hose]] with water and let it dry. It does not soak up smells, so it is the best choice if you switch flavors often.'
          }
        },
        {
          title: { bs: 'Posebna posuda za mentol', en: 'A separate bowl for menthol' },
          text: {
            bs: 'Menta i hlađenje se najduže zadržavaju u glinenoj posudi. Ako često mijenjaš okuse, drži jednu posudu samo za ledene okuse.',
            en: 'Mint and cooling linger longest in a clay bowl. If you switch flavors often, keep one bowl just for icy flavors.'
          }
        },
        {
          title: { bs: 'Osuši prije sklapanja', en: 'Dry before you assemble' },
          text: {
            bs: 'Sklopi nargilu tek kad su svi dijelovi suhi. Vlaga zatvorena u stubu brzo daje ustajao miris.',
            en: 'Only put the hookah back together once every part is dry. Moisture trapped in the stem soon smells stale.'
          }
        }
      ],
      numbers: [
        { label: { bs: 'Promjena vode', en: 'Change the water' }, value: { bs: 'poslije svake sesije', en: 'after every session' } },
        { label: { bs: 'Dublje čišćenje', en: 'Deep clean' }, value: { bs: 'jednom sedmično', en: 'once a week' } },
        { label: { bs: 'Soda bikarbona', en: 'Baking soda' }, value: { bs: '1 kašika', en: '1 spoonful' } }
      ],
      more: [{ guide: 9 }, { term: 'crijevo' }, { term: 'sesija' }]
    }
  ]
};
