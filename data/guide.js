/*
 * MyShishapedia - vodič "Kako pripremiti nargilu" (oba jezika).
 *
 * Svaki korak:
 *   id      kratko ime (koristi ga animacija scene)
 *   title   naslov koraka
 *   text    pasusi; [[id|tekst]] postaje link na pojam u rječniku
 *   tip     kratak savjet (opcionalno)
 *   compare opcionalno poređenje dvije opcije: [{ title, text }, { title, text }]
 *
 * Konkretne brojke (visina vode, vrijeme paljenja ugljeva, broj ugljeva) su
 * okvirne i navedene su u docs/UPUTSTVO.md kao "provjeriti".
 */
window.GUIDE = {
  steps: [
    {
      id: 'water',
      title: { bs: 'Sipaj vodu u vazu', en: 'Fill the base with water' },
      text: {
        bs: [
          'Sipaj hladnu vodu u [[vaza|vazu]]. Kad kasnije ubaciš [[stub|stub]], njegov donji kraj treba biti ispod površine vode, otprilike 2 do 3 cm.',
          'Premalo vode i dim se ne hladi; previše i teško se povlači, a voda može doći do crijeva.'
        ],
        en: [
          'Pour cold water into the [[vaza|base]]. Once the [[stub|stem]] is in, its lower end should sit about 2 to 3 cm (roughly an inch) below the waterline.',
          'Too little water and the smoke will not cool; too much and the draw gets heavy, and water can creep up toward the hose.'
        ]
      },
      tip: {
        bs: 'Nivo lako provjeriš: ubaci stub, povuci kroz priključak za crijevo i poslušaj. Tih, ujednačen žubor znači da je nivo dobar.',
        en: 'Easy check: put the stem in, draw through the hose port and listen. A soft, even bubbling means the level is right.'
      }
    },
    {
      id: 'assemble',
      title: { bs: 'Sastavi nargilu', en: 'Put the hookah together' },
      text: {
        bs: [
          'Stavi stub u vazu, pa na njega [[tacna|tacnu]]. Priključi [[crijevo|crijevo]] i zatvori sve spojeve.',
          'Provjeri da sve dobro dihtuje: zatvori dlanom vrh stuba i povuci kroz crijevo. Ako vazduh ne ulazi, [[gumice|gumice]] su dobro postavljene.'
        ],
        en: [
          'Set the stem into the base, then add the [[tacna|tray]]. Attach the [[crijevo|hose]] and close up every joint.',
          'Check the seals: cover the top of the stem with your palm and pull through the hose. If no air gets in, the [[gumice|grommets]] are doing their job.'
        ]
      },
      tip: {
        bs: 'Ako čuješ šištanje, spoj propušta. Pomjeri ili navlaži gumicu i probaj ponovo.',
        en: 'Hear a hiss? Something is leaking. Reseat or wet the grommet and try again.'
      }
    },
    {
      id: 'tobacco',
      title: { bs: 'Pripremi duhan', en: 'Prep the tobacco' },
      text: {
        bs: [
          'Duhan u pakovanju promiješaj kašikom ili štapićem, jer se [[melasa|melasa]] i [[glicerin|glicerin]] slegnu na dno.',
          'Izvadi koliko ti treba i, ako je jako mokar, lagano ocijedi višak soka. Veće listove i grančice možeš usitniti.'
        ],
        en: [
          'Stir the tobacco in its pack with a spoon or stick, because the [[melasa|molasses]] and [[glicerin|glycerin]] settle at the bottom.',
          'Take out what you need and, if it is very wet, let some of the extra juice drain off. Chop up any big leaves or stems.'
        ]
      },
      tip: {
        bs: 'Duhan ne treba biti suh, samo da ne curi. Previše soka može zagušiti posudu.',
        en: 'You do not want it dry, just not dripping. Too much juice can choke the bowl.'
      }
    },
    {
      id: 'pack',
      title: { bs: 'Napuni posudu', en: 'Pack the bowl' },
      text: {
        bs: [
          'Rastresi duhan prstima u posudu, bez nabijanja. Ostavi mali razmak ispod ivice, da duhan ne dodiruje foliju ili [[hmd|HMD]].',
          'Za početak je najbolje [[rastresito-punjenje|rastresito punjenje]]: vazduh lako prolazi i duhan teže zagori.'
        ],
        en: [
          'Sprinkle the tobacco into the bowl with your fingers, no pressing. Leave a small gap below the rim so it does not touch the foil or [[hmd|HMD]].',
          'A [[rastresito-punjenje|fluff pack]] is the way to start: air flows easily and the tobacco is harder to burn.'
        ]
      },
      compare: [
        {
          title: { bs: 'Rastresito', en: 'Fluff pack' },
          text: {
            bs: 'Duhan je prozračan, lako se povlači i oprašta greške u toplini. Najbolje za početnike.',
            en: 'Airy tobacco, an easy draw and forgiving with heat. Best for beginners.'
          }
        },
        {
          title: { bs: 'Gušće', en: 'Denser pack' },
          text: {
            bs: 'Duhan je složen u tanjim slojevima i lagano pritisnut. Traje duže, ali traži više toplote i pažnje.',
            en: 'Thin layers with a light press. Lasts longer, but needs more heat and attention.'
          }
        }
      ],
      tip: {
        bs: 'Sa [[phunnel|phunnel posudom]] ne prekrivaj središnji otvor duhanom.',
        en: 'With a [[phunnel|phunnel bowl]], keep the center hole clear of tobacco.'
      }
    },
    {
      id: 'foil',
      title: { bs: 'Folija ili HMD', en: 'Foil or HMD' },
      text: {
        bs: [
          'Zategni [[folija|foliju]] preko posude tako da ne dodiruje duhan, pa čačkalicom izbuši ravnomjerno raspoređene sitne rupice.',
          'Umjesto folije možeš koristiti [[hmd|HMD]]: stavi ga na posudu i nema bušenja. Toplotu podešavaš otvorima na njemu.'
        ],
        en: [
          'Stretch [[folija|foil]] tightly over the bowl so it does not touch the tobacco, then poke small, evenly spaced holes with a toothpick.',
          'Or skip the foil and use an [[hmd|HMD]]: just set it on the bowl, no poking needed. You adjust the heat with its vents.'
        ]
      },
      tip: {
        bs: 'Rupice buši od ivice prema sredini. Premalo rupica i dim je slab; prevelike rupe i duhan brže zagori.',
        en: 'Poke from the edge toward the center. Too few holes and the clouds are thin; holes too big and the tobacco burns faster.'
      }
    },
    {
      id: 'coals',
      title: { bs: 'Upali ugljeve', en: 'Light the coals' },
      text: {
        bs: [
          'Stavi [[kokosovi-ugljevi|kokosove ugljeve]] na [[resoo|rešo]]. Okreći ih povremeno dok cijeli ne budu užareni i prekriveni tankim sivim slojem pepela, obično oko 8 do 10 minuta.',
          'Ugalj koji je još taman na nekom dijelu nije spreman: dim tada može biti oštar.'
        ],
        en: [
          'Put your [[kokosovi-ugljevi|coconut coals]] on a [[resoo|coal burner]]. Flip them now and then until they are glowing all over and coated in a thin gray ash, usually about 8 to 10 minutes.',
          'If any part is still dark, the coal is not ready yet, and the smoke can come out harsh.'
        ]
      },
      tip: {
        bs: 'Pali ugljeve samo uz otvoren prozor ili napolju, i ne ostavljaj rešo bez nadzora.',
        en: 'Only light coals with a window open or outdoors, and never leave the burner unattended.'
      }
    },
    {
      id: 'heat',
      title: { bs: 'Postavi ugljeve i zagrij posudu', en: 'Place the coals and heat up' },
      text: {
        bs: [
          'Hvataljkom prenesi užarene ugljeve na foliju ili HMD. Za početak su obično dovoljna tri uglja, postavljena uz ivicu.',
          'Sačekaj nekoliko minuta ([[predgrijavanje|predgrijavanje]]) da se duhan zagrije, pa tek onda kreni sa laganim povlačenjem.'
        ],
        en: [
          'Use tongs to move the lit coals onto the foil or HMD. Three coals around the edge is usually plenty to start.',
          'Give it a few minutes ([[predgrijavanje|preheat]]) so the tobacco warms up before you start taking gentle pulls.'
        ]
      },
      tip: {
        bs: 'Prvih par povlačenja neka budu kratka i lagana, dok se dim ne "razvije".',
        en: 'Keep the first few pulls short and light until the smoke really opens up.'
      }
    },
    {
      id: 'enjoy',
      title: { bs: 'Uživaj i kontroliši toplotu', en: 'Enjoy and manage the heat' },
      text: {
        bs: [
          'Povlači polako i ravnomjerno. Probaj i sam: pritisni i drži nargilu ili dugme "Drži za dim".',
          'Ako je dim grub ili gorak ([[zagorjelo|zagorjelo]]), skloni jedan ugalj na tacnu ili ih pomjeri prema ivici. Ako je dim slab, primakni ugljeve sredini ili dodaj toplote. Ustajali dim izduvaj kroz [[purge-ventil|ventil]].'
        ],
        en: [
          'Pull slowly and steadily. Give it a go right here: press and hold the hookah or the "Hold to pull" button.',
          'If the smoke turns rough or bitter ([[zagorjelo|harsh]]), move one coal to the tray or push them toward the edge. If the clouds are thin, bring the coals toward the center or add heat. Clear stale smoke through the [[purge-ventil|purge valve]].'
        ]
      },
      tip: {
        bs: 'Kad ugalj pobijeli i smanji se, otresi pepeo sa njega, da nastavi ravnomjerno grijati.',
        en: 'When a coal turns white and shrinks, tap the ash off so it keeps heating evenly.'
      }
    },
    {
      id: 'clean',
      title: { bs: 'Očisti nargilu poslije', en: 'Clean up afterwards' },
      text: {
        bs: [
          'Kad se ugljevi potpuno ohlade, prosipaj vodu i razdvoji dijelove.',
          'Isperi vazu, stub i posudu toplom vodom, a stub očisti četkom. Silikonsko crijevo isperi vodom i ostavi da se osuši.'
        ],
        en: [
          'Once the coals are completely cold, dump the water and take the hookah apart.',
          'Rinse the base, stem and bowl with warm water and scrub the stem with a brush. Rinse a silicone hose and let it dry.'
        ]
      },
      tip: {
        bs: 'Nargila očišćena odmah poslije pušenja ne upija mirise, pa sljedeći okus ostaje čist.',
        en: 'Clean it right after smoking and it will not hold on to smells, so your next flavor tastes clean.'
      }
    }
  ],

  safety: {
    title: { bs: 'Sigurnost', en: 'Safety' },
    items: [
      {
        icon: 'air',
        title: { bs: 'Uvijek dobra ventilacija', en: 'Always ventilate' },
        text: {
          bs: 'Ugljevi dok gore ispuštaju ugljen monoksid, gas bez boje i mirisa. Pali ih i puši samo u dobro provjetrenom prostoru, nikad u zatvorenoj prostoriji bez ventilacije ili u autu.',
          en: 'Burning coals give off carbon monoxide, a gas with no color or smell. Only light them and smoke in a well-ventilated space, never in a closed room without airflow or in a car.'
        }
      },
      {
        icon: 'eye',
        title: { bs: 'Žar nikad bez nadzora', en: 'Never leave coals unattended' },
        text: {
          bs: 'Ne ostavljaj užarene ugljeve ni rešo bez nadzora. Nakon upotrebe ugasi žar potpuno, na primjer u metalnoj posudi sa vodom.',
          en: 'Do not leave lit coals or the burner unattended. When you are done, put the coals out completely, for example in a metal container with water.'
        }
      },
      {
        icon: 'child',
        title: { bs: 'Djeca i ljubimci dalje', en: 'Keep kids and pets away' },
        text: {
          bs: 'Užareni ugljevi, rešo i vruća posuda moraju biti van domašaja djece i kućnih ljubimaca.',
          en: 'Hot coals, the burner and a hot bowl must stay out of reach of children and pets.'
        }
      }
    ]
  }
};
