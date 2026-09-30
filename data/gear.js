/*
 * MyShishapedia - posude, ugljevi i toplota (oba jezika).
 *
 * Ocjene su KVALITATIVNE procjene od 1 do 5 (prikazuju se kao užareni ugljevi),
 * a ne mjerenja. Navedene su u README.md kao "provjeriti".
 */
window.GEAR = {
  categories: {
    bowls: {
      ratings: {
        flavor: { bs: 'Intenzitet okusa', en: 'Flavor intensity' },
        duration: { bs: 'Trajanje sesije', en: 'Session length' },
        beginner: { bs: 'Lakoća za početnike', en: 'Beginner friendly' }
      },
      items: [
        {
          id: 'klasicna',
          name: { bs: 'Klasična (egipatska) posuda', en: 'Classic (Egyptian) bowl' },
          short: { bs: 'Nekoliko rupica na dnu, jednostavna i jeftina.', en: 'A few holes in the floor, simple and cheap.' },
          text: {
            bs: [
              'Duhan leži direktno iznad rupica, pa toplota i dim idu pravo dolje. Sok od duhana može curiti kroz rupice u stub.',
              'Okus je jak na početku, ali sesija je obično kraća, jer duhan brže gubi sok.'
            ],
            en: [
              'The tobacco sits right over the holes, so heat and smoke go straight down. Juice can drip through the holes into the stem.',
              'Flavor is strong at first, but sessions tend to be shorter because the tobacco loses its juice faster.'
            ]
          },
          suits: { bs: 'Kratke sesije i one koji vole jednostavnost.', en: 'Short sessions and people who like to keep it simple.' },
          pros: { bs: ['Jeftina i svuda dostupna', 'Jednostavno punjenje', 'Brzo se zagrije'], en: ['Cheap and easy to find', 'Simple to pack', 'Heats up fast'] },
          cons: { bs: ['Sok curi u stub', 'Kraće traje', 'Lakše zagori'], en: ['Juice runs into the stem', 'Shorter sessions', 'Burns more easily'] },
          ratings: { flavor: 3, duration: 2, beginner: 3 },
          visual: 'classic',
          juice: { bs: 'curi kroz rupice u stub', en: 'drips through the holes into the stem' }
        },
        {
          id: 'phunnel',
          name: { bs: 'Phunnel posuda', en: 'Phunnel bowl' },
          short: { bs: 'Jedan otvor na uzdignutom središtu, sok ostaje u posudi.', en: 'One hole on a raised spire, so the juice stays in the bowl.' },
          text: {
            bs: [
              'Duhan se slaže oko uzdignutog središta sa jednim otvorom. Toplota prolazi kroz duhan, a sok ostaje u posudi umjesto da curi u stub.',
              'Okus je ujednačen i traje dugo, a greške u toploti se lakše oproste.'
            ],
            en: [
              'You pack the tobacco around a raised center with a single hole. Heat moves through the tobacco, and the juice stays in the bowl instead of running into the stem.',
              'The flavor is even and lasts a long time, and it forgives heat mistakes more easily.'
            ]
          },
          suits: { bs: 'Početnike i sve koji žele dugu, ujednačenu sesiju.', en: 'Beginners and anyone who wants a long, steady session.' },
          pros: { bs: ['Sok ostaje u posudi', 'Duga sesija', 'Oprašta greške'], en: ['Juice stays in the bowl', 'Long sessions', 'Forgiving'] },
          cons: { bs: ['Treba paziti da duhan ne prekrije otvor', 'Malo sporije se zagrije'], en: ['Keep tobacco off the center hole', 'Takes a bit longer to heat up'] },
          ratings: { flavor: 4, duration: 5, beginner: 5 },
          visual: 'phunnel',
          juice: { bs: 'ostaje u posudi oko središnjeg otvora', en: 'stays in the bowl around the center hole' }
        },
        {
          id: 'vortex',
          name: { bs: 'Vortex posuda', en: 'Vortex bowl' },
          short: { bs: 'Uzdignuto središte sa otvorima sa strane, dim ide kroz kanal.', en: 'A raised center with side holes that channel the smoke.' },
          text: {
            bs: [
              'Kao phunnel ima uzdignuto središte, ali su otvori na njegovim stranama. Sok se skuplja u dnu posude, a dim prolazi kroz središnji kanal.',
              'Daje gust dim i jak okus, ali traži pažljivije punjenje i kontrolu toplote.'
            ],
            en: [
              'Like a phunnel it has a raised center, but the holes are on its sides. Juice pools in the bottom of the bowl, and smoke passes through the center channel.',
              'It gives thick clouds and bold flavor, but needs more careful packing and heat control.'
            ]
          },
          suits: { bs: 'One koji već znaju osnove i žele gust, jak dim.', en: 'People who know the basics and want thick, bold clouds.' },
          pros: { bs: ['Gust dim', 'Jak okus', 'Sok ne ide u stub'], en: ['Thick clouds', 'Bold flavor', 'Juice stays out of the stem'] },
          cons: { bs: ['Traži više iskustva', 'Osjetljivija na previše toplote'], en: ['Takes more experience', 'Less tolerant of too much heat'] },
          ratings: { flavor: 5, duration: 4, beginner: 3 },
          visual: 'vortex',
          juice: { bs: 'se skuplja u dnu posude, oko kanala', en: 'pools in the bottom of the bowl, around the channel' }
        }
      ]
    },

    coals: {
      ratings: {
        flavor: { bs: 'Čistoća okusa', en: 'Clean taste' },
        duration: { bs: 'Trajanje toplote', en: 'Burn time' },
        easy: { bs: 'Lakoća paljenja', en: 'Easy to light' }
      },
      items: [
        {
          id: 'kokos-kocke',
          name: { bs: 'Kokosovi ugljevi, kocke', en: 'Coconut coals, cubes' },
          short: { bs: 'Prirodni ugljevi od ljuske kokosa, najčešći izbor.', en: 'Natural coals made from coconut shells, the go-to choice.' },
          text: {
            bs: [
              'Pale se na rešou dok cijeli ne budu užareni i prekriveni tankim pepelom. Dugo drže ujednačenu toplotu.',
              'Nemaju dodatke za paljenje, pa ne mijenjaju okus duhana.'
            ],
            en: [
              'You light them on a burner until they glow all over under a thin layer of ash. They hold steady heat for a long time.',
              'There are no lighting additives, so they do not change how the tobacco tastes.'
            ]
          },
          suits: { bs: 'Skoro svakoga, posebno kod kuće.', en: 'Almost everyone, especially at home.' },
          pros: { bs: ['Čist okus', 'Dugo i ujednačeno griju', 'Lako se doziraju'], en: ['Clean taste', 'Long, even heat', 'Easy to fine-tune'] },
          cons: { bs: ['Treba rešo ili grijač', 'Pale se nekoliko minuta'], en: ['Needs a burner or heater', 'Takes a few minutes to light'] },
          ratings: { flavor: 5, duration: 5, easy: 2 },
          visual: 'cube'
        },
        {
          id: 'kokos-ravni',
          name: { bs: 'Kokosovi ugljevi, ravni', en: 'Coconut coals, flats' },
          short: { bs: 'Ista prirodna vrsta uglja, u obliku tanje pločice.', en: 'The same natural coal, shaped as a thinner flat.' },
          text: {
            bs: [
              'Ravni ugljevi imaju veću dodirnu površinu, pa toplotu predaju brže i ravnomjernije preko cijele posude.',
              'Pale se nešto brže od kocki, ali i kraće traju.'
            ],
            en: [
              'Flats have more surface contact, so they pass heat faster and more evenly across the whole bowl.',
              'They light a bit quicker than cubes, but also burn out sooner.'
            ]
          },
          suits: { bs: 'One koji koriste HMD ili žele brže zagrijavanje.', en: 'HMD users and anyone who wants a faster heat-up.' },
          pros: { bs: ['Čist okus', 'Ravnomjerna toplota', 'Brže se pale od kocki'], en: ['Clean taste', 'Even heat', 'Light faster than cubes'] },
          cons: { bs: ['Kraće traju od kocki', 'I dalje treba rešo'], en: ['Burn out sooner than cubes', 'Still need a burner'] },
          ratings: { flavor: 5, duration: 3, easy: 3 },
          visual: 'flat'
        },
        {
          id: 'brzopaleci',
          name: { bs: 'Brzopaleći ugljevi', en: 'Quick-light coals' },
          short: { bs: 'Pale se upaljačem za nekoliko sekundi.', en: 'Light with a lighter in a few seconds.' },
          text: {
            bs: [
              'Sadrže dodatke za brzo paljenje, pa se upale bez rešoa, za par sekundi.',
              'Praktični su napolju, ali dodaci mogu dati dimu hemijski ukus i oštriji miris.'
            ],
            en: [
              'They contain accelerants, so they catch in seconds without a burner.',
              'Handy outdoors, but the additives can give the smoke a chemical taste and a sharper smell.'
            ]
          },
          suits: { bs: 'Rijetke situacije kad nema rešoa, na primjer napolju.', en: 'The odd occasion without a burner, like outdoors.' },
          pros: { bs: ['Pale se za nekoliko sekundi', 'Ne treba rešo'], en: ['Light in seconds', 'No burner needed'] },
          cons: { bs: ['Mogu dati hemijski ukus', 'Neujednačena toplota', 'Više dima i mirisa pri paljenju'], en: ['Can taste chemical', 'Uneven heat', 'Smoky and smelly while lighting'] },
          ratings: { flavor: 1, duration: 2, easy: 5 },
          visual: 'quick',
          warning: {
            bs: 'Brzopaleći ugljevi mogu dati hemijski ukus dimu. Za bolji i čistiji okus generalno se preporučuju kokosovi ugljevi.',
            en: 'Quick-light coals can make the smoke taste chemical. For a better, cleaner taste, coconut coals are generally recommended.'
          }
        }
      ]
    },

    heat: {
      ratings: {
        control: { bs: 'Kontrola toplote', en: 'Heat control' },
        easy: { bs: 'Jednostavnost', en: 'Ease of use' },
        clean: { bs: 'Čistoća (pepeo)', en: 'Less ash' }
      },
      items: [
        {
          id: 'folija',
          name: { bs: 'Folija', en: 'Foil' },
          short: { bs: 'Aluminijska folija sa sitnim rupicama.', en: 'Aluminum foil with small holes.' },
          text: {
            bs: [
              'Zategne se preko posude i izbuši rupicama. Jeftina je i radi sa svakom posudom.',
              'Toplota se podešava samo pomjeranjem ugljeva, a pepeo lakše pada na duhan.'
            ],
            en: [
              'You stretch it over the bowl and poke holes in it. It is cheap and works with any bowl.',
              'The only way to adjust heat is moving the coals, and ash drops onto the tobacco more easily.'
            ]
          },
          suits: { bs: 'Početak i povremeno pušenje.', en: 'Getting started and occasional sessions.' },
          pros: { bs: ['Jeftina', 'Radi sa svakom posudom'], en: ['Cheap', 'Fits any bowl'] },
          cons: { bs: ['Treba je bušiti', 'Slabija kontrola toplote', 'Pepeo pada na duhan'], en: ['Needs poking', 'Less heat control', 'Ash falls on the tobacco'] },
          ratings: { control: 2, easy: 3, clean: 2 },
          visual: 'foil'
        },
        {
          id: 'hmd',
          name: { bs: 'HMD', en: 'HMD' },
          short: { bs: 'Metalni poklopac za ugljeve, umjesto folije.', en: 'A metal cap for the coals, instead of foil.' },
          text: {
            bs: [
              'Stavlja se na posudu, a ugljevi idu na njega. Toplota se lako podešava otvorima ili pomjeranjem ugljeva.',
              'Nema bušenja, pepeo manje pada na duhan, a sesija je obično ujednačenija.'
            ],
            en: [
              'It sits on the bowl and the coals go on top. Heat is easy to adjust with the vents or by moving the coals.',
              'No poking holes, less ash on the tobacco, and sessions are usually more consistent.'
            ]
          },
          suits: { bs: 'Sve koji puše češće i žele lakšu kontrolu toplote.', en: 'Anyone who smokes regularly and wants easier heat control.' },
          pros: { bs: ['Laka kontrola toplote', 'Nema bušenja', 'Manje pepela na duhanu'], en: ['Easy heat control', 'No poking holes', 'Less ash on the tobacco'] },
          cons: { bs: ['Košta više od folije', 'Mora odgovarati veličini posude'], en: ['Costs more than foil', 'Has to fit your bowl size'] },
          ratings: { control: 5, easy: 5, clean: 4 },
          visual: 'hmd'
        }
      ]
    }
  },

  recommendation: {
    bs: [
      'Za početak uzmi phunnel posudu, kokosove ugljeve (kocke) i, ako možeš, HMD umjesto folije.',
      'Duhan puni rastresito i počni sa tri uglja uz ivicu. Tako je teško pogriješiti, a okus traje dugo.'
    ],
    en: [
      'To start, grab a phunnel bowl, coconut cube coals and, if you can, an HMD instead of foil.',
      'Fluff pack the tobacco and begin with three coals around the edge. It is hard to mess up, and the flavor lasts.'
    ]
  }
};
