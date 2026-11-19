/*
 * MyShishapedia - nargila barovi u BiH (stranice /bs/nargila-barovi/ i /bs/nargila-barovi/<grad>/).
 *
 * Gradovi (BAR_CITIES):
 *   id        dio adrese (mala slova, crtica)
 *   name      ime grada { bs, en, de, ru } (bs se koristi kad nema prevoda)
 *   lat, lon  centar mape grada; zoom: početni zoom mape
 *   landmark  crtež na vrhu stranice grada: 'sebilj' | 'most' | null (null = jednostavna verzija)
 *   Grad dobija svoju stranicu kad ima bar 3 lokala; ostali su na stranici BiH pod "Ostali gradovi".
 *
 * Lokali (BARS):
 *   id        jedinstven (mala slova, brojevi, crtica)
 *   name      ime lokala kako ga lokal piše
 *   city      id grada; area: kvart ili naselje; address: ulica i broj (ako je poznat)
 *   lat, lon  tačna lokacija (iz OpenStreetMapa); bez njih lokal je samo na listi, ne i na mapi
 *   instagram korisničko ime bez @ (samo ako je provjereno); website: zvanična stranica
 *   lounge    id iz data/lounges.js: lokal sa dogovorom (meni okusa, istaknut, "gori" na mapi)
 *   closes    do kad radi, npr. '01:00' (samo za lokale sa dogovorom, oni ga javljaju)
 *   src       odakle je podatak: 'osm' (OpenStreetMap) ili 'web' (stranica lokala ili turistički vodič)
 *
 * Cijene i radno vrijeme besplatnih lokala se ne upisuju (mijenjaju se i nisu provjereni).
 */
window.BAR_CITIES = [
  { id: 'sarajevo', name: { bs: 'Sarajevo', ru: 'Сараево' }, lat: 43.8575, lon: 18.4135, zoom: 14, landmark: 'sebilj' },
  { id: 'mostar', name: { bs: 'Mostar', ru: 'Мостар' }, lat: 43.3378, lon: 17.8118, zoom: 16, landmark: 'most' },
  { id: 'tuzla', name: { bs: 'Tuzla', ru: 'Тузла' }, lat: 44.5389, lon: 18.6748, zoom: 16, landmark: null },
  { id: 'zenica', name: { bs: 'Zenica', ru: 'Зеница' }, lat: 44.2017, lon: 17.9077, zoom: 15, landmark: null },
  { id: 'banja-luka', name: { bs: 'Banja Luka', ru: 'Баня-Лука' }, lat: 44.7722, lon: 17.1910, zoom: 13, landmark: null },
  { id: 'travnik', name: { bs: 'Travnik', ru: 'Травник' }, lat: 44.2263, lon: 17.6595, zoom: 15, landmark: null }
];

window.BARS = [
  // Sarajevo
  { id: 'babos', name: 'Babos', city: 'sarajevo', area: 'Baščaršija', address: 'Mula Mustafe Bašeskije 21', lat: 43.85987, lon: 18.42505, website: 'https://babos.ba', src: 'osm' },
  { id: 'damask', name: 'Damask', city: 'sarajevo', area: 'Baščaršija', address: 'Trgovke 29', lat: 43.85923, lon: 18.43042, website: 'https://www.damask.ba', src: 'osm' },
  { id: 'cassina-hookah', name: 'Cassina Hookah', city: 'sarajevo', area: 'Baščaršija', address: 'Bravadžiluk', lat: 43.85885, lon: 18.43139, src: 'osm' },
  { id: 'mahala', name: 'Mahala', city: 'sarajevo', area: 'Baščaršija', address: 'Bravadžiluk', lat: 43.8588, lon: 18.43158, src: 'osm' },
  { id: 'basement-lounge', name: 'Basement Lounge', city: 'sarajevo', area: 'Baščaršija', address: 'Bravadžiluk mali 2', lat: 43.85889, lon: 18.43138, src: 'osm' },
  { id: 'libris', name: 'Libris', city: 'sarajevo', area: 'Baščaršija', address: 'Velika avlija 4', lat: 43.86, lon: 18.42788, src: 'web' },
  { id: 'grace', name: 'Hookah Lounge Grace', city: 'sarajevo', area: 'Baščaršija', address: 'Mudželiti veliki 5', lat: 43.85898, lon: 18.42867, src: 'osm' },
  { id: 'old-town', name: 'Old Town', city: 'sarajevo', area: 'Bistrik', address: 'Hamdije Kreševljakovića', lat: 43.85638, lon: 18.4263, src: 'osm' },
  { id: 'shisha-bar-deluxe', name: 'Shisha Bar Deluxe', city: 'sarajevo', area: 'Ferhadija', address: 'Ferhadija', lat: 43.85835, lon: 18.42319, instagram: 'shishabardeluxe', src: 'osm' },
  { id: 'velour-lounge', name: 'Velour Lounge', city: 'sarajevo', area: 'Marijin Dvor', address: 'Kranjčevićeva', lat: 43.85786, lon: 18.40498, src: 'osm' },
  { id: 'ciko', name: 'Hookah Bar Čiko', city: 'sarajevo', area: 'Ciglane', address: 'Husrefa Redžića 20', lat: 43.86841, lon: 18.40775, src: 'osm' },
  { id: 'deja-vu', name: 'Hookah Bar Deja Vu', city: 'sarajevo', area: 'Džemala Bijedića', address: 'Džemala Bijedića 42', lat: 43.85091, lon: 18.37302, instagram: 'caffebardejavu', src: 'osm' },
  { id: 'ali-pasha', name: 'Hookah Bar Ali Pasha', city: 'sarajevo', area: 'Alipašino Polje', address: 'Trg solidarnosti', lat: 43.84553, lon: 18.35154, src: 'osm' },
  { id: 'bella-storia', name: 'Hookah Lounge Bella Storia', city: 'sarajevo', area: 'Alipašino Polje', address: 'Bajrama Zenunija 1', lat: 43.84605, lon: 18.35303, src: 'osm' },
  { id: 'the-crown', name: 'Hookah Bar The Crown', city: 'sarajevo', area: 'Ilidža', address: 'Šetalište dr. Miodraga Lazića', lat: 43.82503, lon: 18.35711, src: 'osm' },

  // Mostar
  { id: 'oscar', name: 'Oscar', city: 'mostar', area: 'Stari grad', address: 'Oneščukova 33', lat: 43.33685, lon: 17.81267, src: 'web' },
  { id: 'nide-veze', name: 'Niđe veze', city: 'mostar', area: 'Stari grad', address: 'Husnije Repca 3', lat: 43.33821, lon: 17.81035, src: 'web' },
  { id: 'midnight', name: 'Midnight Caffe Lounge', city: 'mostar', area: 'Maršala Tita', address: 'Maršala Tita 35', src: 'web' },
  { id: 'nil', name: 'Nargila bar Nil', city: 'mostar', area: 'Zalik', address: 'Zalik', src: 'web' },

  // Tuzla
  { id: 'abu-dhabi', name: 'Nargila bar Abu Dhabi', city: 'tuzla', area: 'Stari grad', address: 'Gradska 13', lat: 44.5395, lon: 18.67374, src: 'web' },
  { id: 'carsija-tuzla', name: 'Čaršija Nargila Bar', city: 'tuzla', area: 'Solni trg', address: 'Solni trg', lat: 44.53829, lon: 18.67581, src: 'web' },
  { id: 'mist', name: 'Nargila bar Mist', city: 'tuzla', area: 'Stari grad', address: 'Pozorišna', src: 'web' },
  { id: 'mistik', name: 'Caffe & Nargila bar Mistik', city: 'tuzla', area: 'Bosne Srebrene', address: 'Bosne Srebrene bb', src: 'web' },

  // Zenica
  { id: 'tokyo', name: 'Tokyo Nargila Bar', city: 'zenica', area: 'Centar', address: 'Sarajevska 11', src: 'web' },
  { id: 'hm-lounge', name: 'H&M Lounge', city: 'zenica', area: 'Lukovo Polje', address: 'Goraždanska 20', src: 'web' },
  { id: 'adalya-zenica', name: 'Nargila bar Adalya', city: 'zenica', area: 'Centar', address: 'Štrosmajerova 11', src: 'web' },
  { id: '1001-noc', name: 'Nargila bar 1001 noć', city: 'zenica', area: 'Centar', address: 'Armije Republike BiH 4', src: 'web' },

  // Banja Luka
  { id: 'nargila-bar-banja-luka', name: 'Nargila Bar Banja Luka', city: 'banja-luka', area: 'Petrićevac', address: 'Majevička 15', lat: 44.79076, lon: 17.18937, src: 'web' },
  { id: 'ko-te-shisha', name: 'Ko te shisha', city: 'banja-luka', area: 'Čaire', address: 'Patre bb', lat: 44.76686, lon: 17.18671, src: 'osm' },

  // Travnik
  { id: 'plan-b', name: 'Shisha club Plan B', city: 'travnik', area: 'Bojna', address: 'Kulina bana', lat: 44.22646, lon: 17.65446, src: 'osm' }
];
