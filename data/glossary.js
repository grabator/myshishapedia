/*
 * MyShishapedia - rječnik pojmova (oba jezika).
 *
 * Svaki pojam:
 *   id       interni ključ (ne mijenjati; koristi se u vodiču kao [[id|tekst]])
 *   slug     dio adrese po jeziku: /bs/rjecnik/<slug.bs>/ i /en/glossary/<slug.en>/
 *   term     naziv pojma
 *   aka      druga imena (opcionalno, koristi i pretraga)
 *   short    jedna rečenica
 *   text     duže objašnjenje (niz pasusa)
 *   icon     ključ ikone iz MSP.glossaryIcon (js/illustrations.js)
 *   guide    broj koraka u vodiču (opcionalno)
 *   gear     'bowls' | 'coals' | 'heat' ako je pojam na stranici Oprema (opcionalno)
 *   related  id-jevi povezanih pojmova (opcionalno)
 */
window.GLOSSARY = [
  {
    id: 'hmd', slug: { bs: 'hmd', en: 'hmd' },
    term: { bs: 'HMD', en: 'HMD' },
    aka: { bs: ['heat management device', 'uređaj za kontrolu toplote'], en: ['heat management device'] },
    short: {
      bs: 'Metalni poklopac koji stoji na posudi umjesto folije i na koji se stavljaju ugljevi.',
      en: 'A metal cap that sits on the bowl instead of foil and holds the coals.'
    },
    text: {
      bs: [
        'HMD je skraćenica od engleskog "heat management device". To je metalni poklopac koji se stavlja na posudu, a ugljevi idu na njega ili u njega.',
        'Prednost je što se toplota lako podešava: otvaranjem ili zatvaranjem otvora, ili pomjeranjem ugljeva. Nema bušenja folije, a pepeo manje pada na duhan.'
      ],
      en: [
        'HMD stands for heat management device. It is a metal cap that goes on top of the bowl, and the coals sit on it or inside it.',
        'The big win is easy heat control: open or close the vents, or move the coals around. No poking holes in foil, and less ash lands on the tobacco.'
      ]
    },
    icon: 'hmd', guide: 5, gear: 'heat', related: ['folija', 'kokosovi-ugljevi']
  },
  {
    id: 'folija', slug: { bs: 'folija', en: 'foil' },
    term: { bs: 'Folija', en: 'Foil' },
    aka: { bs: ['aluminijska folija'], en: ['aluminum foil', 'tin foil'] },
    short: {
      bs: 'Tanka aluminijska folija preko posude, izbušena sitnim rupicama, na kojoj stoje ugljevi.',
      en: 'Thin aluminum foil stretched over the bowl, poked with small holes, with the coals on top.'
    },
    text: {
      bs: [
        'Folija se zategne preko posude i izbuši rupicama kroz koje prolazi vazduh. Ugljevi stoje na njoj i griju duhan odozgo.',
        'Jeftina je i svuda dostupna, ali traži malo vještine: previše ili premalo rupica mijenja kako se duhan grije.'
      ],
      en: [
        'Foil is pulled tight over the bowl and poked with holes so air can pass through. The coals sit on it and heat the tobacco from above.',
        'It is cheap and available everywhere, but it takes a little practice: too many or too few holes changes how the tobacco heats up.'
      ]
    },
    icon: 'foil', guide: 5, gear: 'heat', related: ['hmd']
  },
  {
    id: 'phunnel', slug: { bs: 'phunnel', en: 'phunnel-bowl' },
    term: { bs: 'Phunnel posuda', en: 'Phunnel bowl' },
    aka: { bs: ['phunnel', 'funnel'], en: ['phunnel', 'funnel bowl'] },
    short: {
      bs: 'Posuda sa jednom rupom na uzdignutom središtu, tako da sok od duhana ne curi u stub.',
      en: 'A bowl with a single hole on a raised center spire, so the juice does not drip into the stem.'
    },
    text: {
      bs: [
        'Phunnel posuda umjesto više rupica na dnu ima jedan otvor na uzdignutom "tornjiću" u sredini. Duhan se slaže oko njega.',
        'Pošto sok ostaje u posudi, okus traje duže i manje je šanse da duhan brzo izgori. Zato je vrlo popularna.'
      ],
      en: [
        'Instead of several holes in the floor, a phunnel bowl has one opening on a raised spire in the middle. The tobacco is packed around it.',
        'Because the juice stays in the bowl, the flavor lasts longer and the tobacco is less likely to burn quickly. That is why it is so popular.'
      ]
    },
    icon: 'phunnel', guide: 4, gear: 'bowls', related: ['klasicna-posuda', 'vortex', 'melasa']
  },
  {
    id: 'klasicna-posuda', slug: { bs: 'klasicna-posuda', en: 'classic-bowl' },
    term: { bs: 'Klasična posuda', en: 'Classic bowl' },
    aka: { bs: ['egipatska posuda', 'turska posuda'], en: ['Egyptian bowl', 'traditional bowl'] },
    short: {
      bs: 'Tradicionalna posuda sa nekoliko rupica na dnu.',
      en: 'The traditional bowl with a few small holes in the bottom.'
    },
    text: {
      bs: [
        'Klasična (egipatska ili turska) posuda ima nekoliko malih rupica na dnu. Jednostavna je i jeftina.',
        'Sok od duhana može curiti kroz rupice u stub, pa okus obično kraće traje nego u phunnel posudi.'
      ],
      en: [
        'The classic (Egyptian) bowl has a few small holes in its floor. It is simple and cheap.',
        'Juice can drip through the holes into the stem, so the flavor usually fades faster than in a phunnel bowl.'
      ]
    },
    icon: 'classic', guide: 4, gear: 'bowls', related: ['phunnel', 'vortex']
  },
  {
    id: 'vortex', slug: { bs: 'vortex', en: 'vortex-bowl' },
    term: { bs: 'Vortex posuda', en: 'Vortex bowl' },
    short: {
      bs: 'Posuda sa uzdignutim središtem i rupama sa strane tog središta.',
      en: 'A bowl with a raised center and holes on the sides of that center.'
    },
    text: {
      bs: [
        'Vortex posuda ima uzdignuto središte kao phunnel, ali su otvori na njegovim stranama, pa dim ide kroz neku vrstu kanala.',
        'Sok se skuplja u dnu posude umjesto da ide u stub. Mnogi kažu da daje gust dim, ali traži pažljivije punjenje.'
      ],
      en: [
        'A vortex bowl has a raised center like a phunnel, but the openings are on its sides, so smoke travels through a kind of channel.',
        'Juice collects in the bottom of the bowl instead of running into the stem. Many people say it gives thick clouds, but it needs more careful packing.'
      ]
    },
    icon: 'vortex', guide: 4, gear: 'bowls', related: ['phunnel', 'klasicna-posuda']
  },
  {
    id: 'kokosovi-ugljevi', slug: { bs: 'kokosovi-ugljevi', en: 'coconut-coals' },
    term: { bs: 'Kokosovi ugljevi', en: 'Coconut coals' },
    aka: { bs: ['prirodni ugljevi', 'kocke'], en: ['natural coals', 'cubes'] },
    short: {
      bs: 'Prirodni ugljevi od ljuske kokosa, koji se pale na rešou i dugo drže toplotu.',
      en: 'Natural coals made from coconut shells, lit on a burner, that hold heat for a long time.'
    },
    text: {
      bs: [
        'Kokosovi ugljevi se prave od ljuske kokosovog oraha. Najčešće su u obliku kocke ili ravne pločice.',
        'Pale se duže (na rešou ili posebnom grijaču), ali nemaju dodatke za brzo paljenje, pa ne mijenjaju okus. Generalno se preporučuju.'
      ],
      en: [
        'Coconut coals are made from coconut shells. They usually come as cubes or flats.',
        'They take longer to light (on a burner or coal heater), but have no lighting additives, so they do not affect the taste. They are generally the recommended choice.'
      ]
    },
    icon: 'coal-cube', guide: 6, gear: 'coals', related: ['brzopaleci-ugljevi', 'resoo']
  },
  {
    id: 'brzopaleci-ugljevi', slug: { bs: 'brzopaleci-ugljevi', en: 'quick-light-coals' },
    term: { bs: 'Brzopaleći ugljevi', en: 'Quick-light coals' },
    aka: { bs: ['samozapaljivi ugljevi', 'quick light'], en: ['self-lighting coals', 'instant coals'] },
    short: {
      bs: 'Ugljevi koji se pale upaljačem za nekoliko sekundi, zbog dodataka za paljenje.',
      en: 'Coals that light with a lighter in seconds, thanks to added accelerants.'
    },
    text: {
      bs: [
        'Brzopaleći ugljevi sadrže dodatke koji omogućavaju da se upale za nekoliko sekundi, bez rešoa.',
        'Praktični su napolju, ali ti dodaci mogu dati hemijski ukus dimu. Za bolji okus obično se biraju kokosovi ugljevi.'
      ],
      en: [
        'Quick-light coals contain additives that let them catch in a few seconds, no burner needed.',
        'They are handy outdoors, but those additives can give the smoke a chemical taste. For better flavor, most people go with coconut coals.'
      ]
    },
    icon: 'coal-quick', guide: 6, gear: 'coals', related: ['kokosovi-ugljevi']
  },
  {
    id: 'stub', slug: { bs: 'stub', en: 'stem' },
    term: { bs: 'Stub', en: 'Stem' },
    aka: { bs: ['tijelo nargile'], en: ['shaft', 'body'] },
    short: {
      bs: 'Metalna cijev koja spaja posudu na vrhu sa vodom u vazi.',
      en: 'The metal pipe that connects the bowl on top to the water in the base.'
    },
    text: {
      bs: [
        'Stub je glavni dio nargile. Na vrhu drži posudu i tacnu, a donji kraj (donja cijev) ulazi u vodu u vazi.',
        'Na njemu je i priključak za crijevo, a često i ventil za izduvavanje.'
      ],
      en: [
        'The stem is the main body of the hookah. It holds the bowl and tray on top, and its lower end (the downstem) sits in the water in the base.',
        'It also has the hose port and, very often, a purge valve.'
      ]
    },
    icon: 'stem', guide: 2, related: ['vaza', 'tacna', 'purge-ventil']
  },
  {
    id: 'vaza', slug: { bs: 'vaza', en: 'base' },
    term: { bs: 'Vaza', en: 'Base' },
    aka: { bs: ['baza', 'staklo'], en: ['vase', 'glass'] },
    short: {
      bs: 'Stakleni donji dio nargile u koji se sipa voda.',
      en: 'The glass bottom part of the hookah that holds the water.'
    },
    text: {
      bs: [
        'Vaza je stakleni sud u koji ide voda. Dim prolazi kroz vodu, hladi se i pravi karakteristične mjehuriće.',
        'Voda treba pokriti kraj donje cijevi stuba za 2 do 3 centimetra.'
      ],
      en: [
        'The base is the glass vessel that holds the water. Smoke passes through it, cools down and makes those signature bubbles.',
        'The water should cover the end of the downstem by about 2 to 3 centimeters (roughly an inch).'
      ]
    },
    icon: 'vase', guide: 1, related: ['stub', 'difuzor']
  },
  {
    id: 'tacna', slug: { bs: 'tacna', en: 'tray' },
    term: { bs: 'Tacna', en: 'Tray' },
    aka: { bs: ['tanjir'], en: ['ash tray', 'plate'] },
    short: {
      bs: 'Tanjir ispod posude u koji pada pepeo i gdje se odlažu ugljevi.',
      en: 'The plate under the bowl that catches ash and gives the coals somewhere to rest.'
    },
    text: {
      bs: [
        'Tacna stoji na stubu odmah ispod posude. Hvata pepeo i komadiće uglja da ne padnu na sto ili pod.',
        'Na nju se mogu privremeno skloniti ugljevi kad je posuda pretopla.'
      ],
      en: [
        'The tray sits on the stem right below the bowl. It catches ash and bits of coal so they do not end up on the table or floor.',
        'You can also park a coal on it for a while when the bowl gets too hot.'
      ]
    },
    icon: 'tray', guide: 2, related: ['stub']
  },
  {
    id: 'crijevo', slug: { bs: 'crijevo', en: 'hose' },
    term: { bs: 'Crijevo', en: 'Hose' },
    aka: { bs: ['šlauf'], en: [] },
    short: {
      bs: 'Savitljiva cijev kroz koju se povlači dim.',
      en: 'The flexible tube you pull the smoke through.'
    },
    text: {
      bs: [
        'Crijevo se spaja na priključak stuba, a na drugom kraju ima usnik. Kroz njega se povlači dim.',
        'Silikonska crijeva se lako peru i ne upijaju mirise, pa se okusi ne miješaju.'
      ],
      en: [
        'The hose plugs into the port on the stem and has a mouthpiece at the other end. You pull the smoke through it.',
        'Silicone hoses are easy to wash and do not hold on to smells, so flavors do not carry over.'
      ]
    },
    icon: 'hose', guide: 2, related: ['usnik', 'gumice']
  },
  {
    id: 'usnik', slug: { bs: 'usnik', en: 'mouthpiece' },
    term: { bs: 'Usnik', en: 'Mouthpiece' },
    aka: { bs: ['munštik'], en: ['tip'] },
    short: {
      bs: 'Kraj crijeva koji se stavlja na usta.',
      en: 'The end of the hose that goes to your mouth.'
    },
    text: {
      bs: [
        'Usnik je dio na kraju crijeva kroz koji se povlači dim. Obično je od metala, drveta ili plastike.',
        'U društvu je higijenski da svako ima svoj jednokratni ili lični usnik.'
      ],
      en: [
        'The mouthpiece is the piece at the end of the hose you draw from. It is usually metal, wood or plastic.',
        'When sharing, it is more hygienic for everyone to have their own disposable or personal tip.'
      ]
    },
    icon: 'mouthpiece', guide: 8, related: ['crijevo']
  },
  {
    id: 'difuzor', slug: { bs: 'difuzor', en: 'diffuser' },
    term: { bs: 'Difuzor', en: 'Diffuser' },
    short: {
      bs: 'Nastavak na donjoj cijevi koji dijeli dim na sitnije mjehuriće i utišava nargilu.',
      en: 'An attachment on the downstem that breaks the smoke into smaller bubbles and quiets the hookah.'
    },
    text: {
      bs: [
        'Difuzor se stavlja na donji kraj stuba u vodi. Dijeli dim na mnogo sitnih mjehurića.',
        'Nargila je tako tiša, a dim malo mekši. Nije obavezan dio.'
      ],
      en: [
        'A diffuser fits onto the end of the downstem in the water. It splits the smoke into lots of tiny bubbles.',
        'That makes the hookah quieter and the smoke a little smoother. It is optional.'
      ]
    },
    icon: 'diffuser', guide: 1, related: ['vaza', 'stub']
  },
  {
    id: 'purge-ventil', slug: { bs: 'purge-ventil', en: 'purge-valve' },
    term: { bs: 'Ventil za izduvavanje', en: 'Purge valve' },
    aka: { bs: ['purge ventil', 'purge valve'], en: ['purge'] },
    short: {
      bs: 'Mali ventil na stubu kroz koji se izduvava ustajali dim.',
      en: 'A small valve on the stem for blowing out stale smoke.'
    },
    text: {
      bs: [
        'Ako se dim predugo zadrži u vazi, postane ustajao i grub. Kroz ventil za izduvavanje ga možeš lagano izduvati kroz crijevo.',
        'Duva se nježno, da voda ne poprska posudu.'
      ],
      en: [
        'If smoke sits in the base too long, it goes stale and harsh. The purge valve lets you gently blow it out through the hose.',
        'Blow softly so the water does not splash up into the stem.'
      ]
    },
    icon: 'valve', guide: 8, related: ['stub', 'crijevo']
  },
  {
    id: 'gumice', slug: { bs: 'gumice', en: 'grommets' },
    term: { bs: 'Gumice', en: 'Grommets' },
    aka: { bs: ['grommet', 'dihtunzi'], en: ['seals', 'gaskets'] },
    short: {
      bs: 'Gumeni prstenovi koji dihtuju spojeve između dijelova nargile.',
      en: 'Rubber rings that seal the joints between hookah parts.'
    },
    text: {
      bs: [
        'Gumice se stavljaju između posude i stuba, stuba i vaze, i na priključak crijeva.',
        'Ako spoj propušta vazduh, dim je slab. Zato se pri sastavljanju provjerava da sve dobro dihtuje.'
      ],
      en: [
        'Grommets go between the bowl and stem, the stem and base, and on the hose port.',
        'If a joint leaks air, the draw gets weak. That is why you check the seals when putting the hookah together.'
      ]
    },
    icon: 'grommet', guide: 2, related: ['stub', 'crijevo']
  },
  {
    id: 'rastresito-punjenje', slug: { bs: 'rastresito-punjenje', en: 'fluff-pack' },
    term: { bs: 'Rastresito punjenje', en: 'Fluff pack' },
    aka: { bs: ['fluffy pack', 'lagano punjenje'], en: ['fluffy pack', 'loose pack'] },
    short: {
      bs: 'Duhan se samo lagano ubaci u posudu, bez nabijanja, da vazduh može prolaziti.',
      en: 'Tobacco is sprinkled loosely into the bowl, not pressed, so air can flow through.'
    },
    text: {
      bs: [
        'Kod rastresitog punjenja duhan se prstima rastrese u posudu tako da ostane prozračan, i ne ide do samog vrha.',
        'Vazduh i toplota lako prolaze, pa je pušenje lako i duhan manje zagori. Ovo je najbolji izbor za početak.'
      ],
      en: [
        'For a fluff pack, you sprinkle the tobacco into the bowl with your fingers so it stays airy, and stop just below the rim.',
        'Air and heat pass through easily, so the draw is effortless and the tobacco is less likely to burn. It is the best way to start.'
      ]
    },
    icon: 'loose', guide: 4, related: ['gusto-punjenje', 'zagorjelo']
  },
  {
    id: 'gusto-punjenje', slug: { bs: 'gusto-punjenje', en: 'dense-pack' },
    term: { bs: 'Gusto punjenje', en: 'Dense pack' },
    aka: { bs: ['dense pack'], en: ['semi-dense pack'] },
    short: {
      bs: 'Duhan se slaže gušće, ali i dalje bez jakog nabijanja.',
      en: 'Tobacco is layered more tightly, but still not jammed in.'
    },
    text: {
      bs: [
        'Kod gušćeg punjenja duhan se slaže u tanjim slojevima i lagano pritisne. Stane ga više i sesija može trajati duže.',
        'Traži više toplote i pažnje: ako je pregusto, teško se povlači; ako je toplota prejaka, brzo zagori.'
      ],
      en: [
        'With a denser pack, tobacco goes in thin layers with a light press. You fit more in, and the session can last longer.',
        'It needs more heat and attention: pack it too tight and the draw gets hard; run it too hot and it burns fast.'
      ]
    },
    icon: 'dense', guide: 4, related: ['rastresito-punjenje']
  },
  {
    id: 'zagorjelo', slug: { bs: 'zagorjelo', en: 'harsh' },
    term: { bs: 'Zagorjelo', en: 'Harsh / burnt' },
    aka: { bs: ['gorjelo', 'izgorjelo'], en: ['burnt', 'harsh hit'] },
    short: {
      bs: 'Oštar, gorak ukus kad je duhan pregrijan.',
      en: 'The sharp, bitter taste you get when the tobacco overheats.'
    },
    text: {
      bs: [
        'Kad je toplota prejaka, duhan se pregrije i dim postane grub, gorak i neprijatan. Kaže se da je "zagorjelo".',
        'Pomaže da se jedan ugalj skloni na tacnu ili da se ugljevi pomjere prema ivici posude.'
      ],
      en: [
        'When there is too much heat, the tobacco scorches and the smoke turns rough, bitter and unpleasant. That is a harsh bowl.',
        'Take one coal off and park it on the tray, or move the coals out toward the edge of the bowl.'
      ]
    },
    icon: 'burnt', guide: 8, related: ['hmd', 'folija']
  },
  {
    id: 'melasa', slug: { bs: 'melasa', en: 'molasses' },
    term: { bs: 'Melasa', en: 'Molasses' },
    short: {
      bs: 'Gusti slatki sirup koji drži duhan vlažnim i nosi aromu.',
      en: 'The thick, sweet syrup that keeps shisha tobacco moist and carries the flavor.'
    },
    text: {
      bs: [
        'Melasa je gust, slatki sirup koji se miješa sa duhanom. Zbog nje je duhan za nargilu ljepljiv i vlažan.',
        'Ona nosi aromu i sprečava da duhan odmah izgori.'
      ],
      en: [
        'Molasses is a thick, sweet syrup mixed into the tobacco. It is why shisha is sticky and moist.',
        'It carries the flavor and keeps the tobacco from burning straight away.'
      ]
    },
    icon: 'molasses', guide: 3, related: ['glicerin']
  },
  {
    id: 'glicerin', slug: { bs: 'glicerin', en: 'glycerin' },
    term: { bs: 'Glicerin', en: 'Glycerin' },
    aka: { bs: [], en: ['glycerine', 'VG'] },
    short: {
      bs: 'Tečnost u duhanu koja daje gust, bijel dim.',
      en: 'The liquid in shisha tobacco that makes thick, white clouds.'
    },
    text: {
      bs: [
        'Glicerin se dodaje duhanu za nargilu. Kad se zagrije, stvara gust, bijel dim.',
        'Višak soka iz pakovanja se ponekad lagano ocijedi, da duhan ne bude previše mokar.'
      ],
      en: [
        'Glycerin is added to shisha tobacco. When it heats up, it creates thick, white clouds.',
        'People sometimes drain a bit of the extra juice from the pack so the tobacco is not too wet.'
      ]
    },
    icon: 'glycerin', guide: 3, related: ['melasa']
  },
  {
    id: 'jacina-duhana', slug: { bs: 'jacina-duhana', en: 'tobacco-strength' },
    term: { bs: 'Jačina duhana', en: 'Tobacco strength' },
    short: {
      bs: 'Koliko je duhan jak, što najviše zavisi od vrste i obrade lista.',
      en: 'How strong the tobacco is, which mostly depends on the leaf type and how it is processed.'
    },
    text: {
      bs: [
        'Duhani se razlikuju po jačini. Svjetliji, više obrađeni listovi su obično blaži, a tamniji jači.',
        'Početnicima se obično preporučuju blaži duhani.'
      ],
      en: [
        'Tobaccos vary in strength. Lighter, more processed leaf is usually milder, while darker leaf hits harder.',
        'Beginners are usually better off starting with milder tobacco.'
      ]
    },
    icon: 'strength', related: ['svijetli-list', 'tamni-list']
  },
  {
    id: 'svijetli-list', slug: { bs: 'svijetli-list', en: 'blonde-leaf' },
    term: { bs: 'Svijetli list', en: 'Blonde leaf' },
    aka: { bs: ['blonde leaf', 'virginia'], en: ['Virginia', 'light leaf'] },
    short: {
      bs: 'Svjetliji, više obrađen duhanski list, blažeg ukusa.',
      en: 'Lighter, more processed tobacco leaf with a milder taste.'
    },
    text: {
      bs: [
        'Svijetli list (engleski "blonde leaf") je duhan koji je više obrađen i ispran, pa je svjetlije boje.',
        'Blaži je i dobro nosi voćne arome, zato ga koristi većina popularnih voćnih okusa.'
      ],
      en: [
        'Blonde leaf is tobacco that has been processed and washed more, which gives it its lighter color.',
        'It is milder and carries fruit flavors really well, which is why most popular fruity blends use it.'
      ]
    },
    icon: 'leaf-light', related: ['tamni-list', 'jacina-duhana']
  },
  {
    id: 'tamni-list', slug: { bs: 'tamni-list', en: 'dark-leaf' },
    term: { bs: 'Tamni list', en: 'Dark leaf' },
    aka: { bs: ['dark leaf'], en: ['dark blend'] },
    short: {
      bs: 'Tamniji, manje obrađen duhanski list, jačeg ukusa.',
      en: 'Darker, less processed tobacco leaf with a stronger taste.'
    },
    text: {
      bs: [
        'Tamni list je manje obrađen duhan, tamnije boje i izraženijeg, jačeg ukusa.',
        'Obično traži više toplote i iskustva, pa nije idealan za sam početak.'
      ],
      en: [
        'Dark leaf is less processed tobacco with a darker color and a bolder, stronger taste.',
        'It usually needs more heat and experience, so it is not ideal for your very first bowls.'
      ]
    },
    icon: 'leaf-dark', related: ['svijetli-list', 'jacina-duhana']
  },
  {
    id: 'predgrijavanje', slug: { bs: 'predgrijavanje', en: 'preheating' },
    term: { bs: 'Predgrijavanje', en: 'Preheating' },
    aka: { bs: ['zagrijavanje posude'], en: ['heat-up'] },
    short: {
      bs: 'Nekoliko minuta čekanja nakon što se stave ugljevi, prije prvog povlačenja.',
      en: 'The few minutes you wait after placing the coals, before the first real pull.'
    },
    text: {
      bs: [
        'Kad se ugljevi stave na posudu, duhanu treba par minuta da se zagrije. To je predgrijavanje.',
        'Ako se odmah jako povlači, prvi dimovi mogu biti slabi ili grubi.'
      ],
      en: [
        'Once the coals are on, the tobacco needs a couple of minutes to heat up. That is the preheat.',
        'Pull hard right away and the first clouds can be thin or harsh.'
      ]
    },
    icon: 'preheat', guide: 7, related: ['kokosovi-ugljevi']
  },
  {
    id: 'resoo', slug: { bs: 'reso', en: 'coal-burner' },
    term: { bs: 'Rešo za ugljeve', en: 'Coal burner' },
    aka: { bs: ['grijač za ugljeve', 'rešo'], en: ['coal heater', 'coal starter'] },
    short: {
      bs: 'Mali električni ili plinski grijač na kojem se pale kokosovi ugljevi.',
      en: 'A small electric or gas heater used to light coconut coals.'
    },
    text: {
      bs: [
        'Kokosovi ugljevi se pale na rešou dok cijeli ne pobijele od tankog sloja pepela.',
        'Rešo se koristi uz dobru ventilaciju i nikad se ne ostavlja bez nadzora.'
      ],
      en: [
        'Coconut coals are lit on a burner until they are covered in a thin layer of white-gray ash.',
        'Use it with good ventilation and never leave it unattended.'
      ]
    },
    icon: 'burner', guide: 6, related: ['kokosovi-ugljevi']
  },
  {
    id: 'sesija', slug: { bs: 'sesija', en: 'session' },
    term: { bs: 'Sesija', en: 'Session' },
    short: {
      bs: 'Jedno pušenje nargile, od prvog do zadnjeg dima.',
      en: 'One hookah smoke, from the first cloud to the last.'
    },
    text: {
      bs: [
        'Sesija je jedno pušenje, od paljenja do trenutka kad duhan izgubi okus.',
        'Koliko traje zavisi od posude, punjenja, količine duhana i toplote.'
      ],
      en: [
        'A session is one smoke, from lighting up until the tobacco runs out of flavor.',
        'How long it lasts depends on the bowl, the pack, how much tobacco you use and the heat.'
      ]
    },
    icon: 'session', related: ['phunnel', 'gusto-punjenje']
  }
];
