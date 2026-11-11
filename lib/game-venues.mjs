/*
 * MyShishapedia - Shisha Drop: kafići sa svojom ligom (igra se broji samo sa WiFi-ja kafića).
 *
 *   id        isti kao u data/lounges.js (adresa igre: /bs/igra/?bar=<id>)
 *   name      ime kafića na ekranu igre
 *   colors    [glavna, tamnija] boja (kao u data/lounges.js)
 *   demo      true = izmišljeni kafić za probu
 *   pinHash   sha256('msp-venue-pin|<id>|<PIN>'), PIN velikim slovima. Sam PIN se NE upisuje u repo:
 *             zna ga samo vlasnik kafića (i Graba). Novi PIN:
 *             node -e "console.log(require('crypto').createHash('sha256').update('msp-venue-pin|babylon|ABCD-EFGH-JKLM').digest('hex'))"
 *
 * Vlasnik sa WiFi-ja kafića otvori /bs/igra/?bar=<id>&admin=1, upiše PIN i klikne "Ovo je WiFi kafića".
 */
export const VENUES = {
  babylon: {
    name: 'Babylon',
    colors: ['#e0b25e', '#8a5a1f'],
    demo: true,
    pinHash: '6ee8b93ece2077fa0084adbe9ad83180015f4d59da29cddc41477971b831af64'
  }
};
