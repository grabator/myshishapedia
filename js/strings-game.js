/*
 * MyShishapedia - Shisha Drop: tekstovi igre (bs, en, de).
 * Učitava se samo na stranici igre (i u buildu, za HTML stranice). Svi jezici
 * moraju imati iste ključeve; build javi grešku ako neki fali.
 * Naziv u meniju i naslov stranice (meta) su u js/strings.js i js/strings-de.js.
 */
(function (root) {
  'use strict';
  var MSP = (root.MSP = root.MSP || {});

  MSP.GAME_STRINGS = {
    bs: {
      page: {
        eyebrow: 'Nova igra',
        lead: 'Ubaci voće u vazu nargile. Dvije iste voćke se spoje u veću, sve do lubenice. Ne dozvoli da se vaza prepuni. Svaki dan svi igraju isti izazov, a najbolji su na rang listi.',
        crumb: 'Shisha Drop',
        noscript: 'Za igru je potreban JavaScript.'
      },
      start: {
        daily: 'Dnevni izazov',
        ready: 'Današnji izazov te čeka. Imaš jednu partiju koja ide na rang listu.',
        playing: 'Partija je u toku. Nastavi tamo gdje je stala.',
        done: 'Današnja partija je odigrana.',
        doneScore: 'Današnja partija: {score} bodova',
        nextIn: 'Novi izazov za {time}',
        best: 'Rekord',
        today: 'Danas',
        nick: 'Nadimak',
        nickNone: 'nije izabran',
        nickChange: 'Promijeni',
        nickPick: 'Izaberi nadimak',
        play: 'Igraj',
        resume: 'Nastavi',
        played: 'Odigrano',
        practice: 'Vježbaj',
        practiceSub: 'koliko hoćeš, ne broji se',
        board: 'Rang lista',
        how: 'Kako se igra',
        offline: 'Rang lista trenutno nije dostupna. Možeš igrati, a rezultat šaljemo kad se veza vrati.'
      },
      nick: {
        title: 'Izaberi nadimak',
        text: 'Pod ovim imenom se vidiš na rang listi. Nadimak je vezan za ovaj telefon i ovaj preglednik.',
        label: 'Nadimak',
        placeholder: 'npr. Edo_93',
        hint: '3 do 16 znakova: slova, brojevi, razmak i _ . -',
        save: 'Sačuvaj',
        cancel: 'Odustani',
        saving: 'Čuvam…',
        short: 'Nadimak je prekratak (najmanje 3 znaka).',
        long: 'Nadimak je predug (najviše 16 znakova).',
        chars: 'Dozvoljena su slova, brojevi, razmak i znakovi _ . -',
        blocked: 'Ovaj nadimak nije dozvoljen. Izaberi drugi.',
        taken: 'Ovaj nadimak je zauzet. Izaberi drugi.',
        removed: 'Tvoj nadimak je uklonjen. Izaberi novi.',
        network: 'Nema veze sa serverom. Pokušaj ponovo za koji trenutak.',
        rate: 'Previše pokušaja. Pokušaj ponovo za par minuta.'
      },
      hud: {
        score: 'Bodovi',
        next: 'Sljedeće',
        today: 'Danas',
        practice: 'Vježba',
        pause: 'Pauza',
        soundOn: 'Uključi zvuk',
        soundOff: 'Isključi zvuk',
        aim: 'Dodirni mjesto u vazi gdje želiš da voćka padne.',
        info: 'Posebni predmeti: šta je menta, led i Zlatna nargila'
      },
      fx: {
        combo: 'Combo ×{n}',
        golden: 'Zlatna nargila!',
        ice: 'Led!',
        mint: 'Džoker!'
      },
      pause: {
        title: 'Pauza',
        resume: 'Nastavi',
        quit: 'Izađi',
        quitSaved: 'Partija ostaje sačuvana, nastavljaš kad se vratiš.',
        quitPractice: 'Vježba se završava.'
      },
      end: {
        over: 'Vaza je puna',
        practiceOver: 'Kraj vježbe',
        biggest: 'Najveće voće: {name}',
        record: 'Novi rekord!',
        rank: '#{rank} od {total} danas',
        sending: 'Šaljem rezultat…',
        failed: 'Rezultat nije poslan. Šaljemo ga čim se veza vrati.',
        rejected: 'Ovaj rezultat nije primljen na rang listu.',
        already: 'Za danas je već predat rezultat {score}.',
        noNick: 'Izaberi nadimak da rezultat uđe na rang listu.',
        again: 'Igraj ponovo',
        practice: 'Vježbaj',
        share: 'Podijeli',
        close: 'Zatvori',
        a2hsTitle: 'Dodaj igru na početni ekran',
        a2hsText: 'Otvara se preko cijelog ekrana, a tvoj nadimak ostaje sačuvan.',
        a2hsBtn: 'Dodaj',
        a2hsLater: 'Ne sada'
      },
      board: {
        title: 'Rang lista',
        day: 'Danas',
        week: 'Ova sedmica',
        weekNote: 'Zbir dnevnih rezultata od ponedjeljka.',
        empty: 'Još niko nije igrao. Tvoj rezultat može biti prvi!',
        loading: 'Učitavam…',
        error: 'Rang lista trenutno nije dostupna.',
        you: 'ti',
        players: '{n} igrača',
        points: 'bod.'
      },
      how: {
        title: 'Kako se igra',
        steps: [
          'Dodirni bilo gdje u vazi (i dolje, gdje prst ne smeta pogledu) i voćka padne tačno iznad tog mjesta.',
          'Možeš i vući prstom lijevo-desno: isprekidana linija pokazuje gdje će pasti, a kad pustiš prst, voćka padne. Kotrlja se i gura ostalo voće.',
          'Dvije iste voćke se spoje u sljedeću u lancu. Veće voće donosi više bodova.',
          'Spajanja jedno za drugim daju combo i dodatne bodove.',
          'Ako voće stoji iznad crvene linije 3 sekunde, vaza je puna i partija je gotova.'
        ],
        chain: 'Lanac voća',
        specials: 'Posebni predmeti',
        mint: 'List mente je džoker: spoji se sa prvom voćkom koju dotakne i napravi sljedeću u lancu.',
        ice: 'Kocka leda zaledi i ukloni do tri najmanje voćke oko sebe i napravi mjesto.',
        golden: 'Dvije lubenice se spoje u Zlatnu nargilu: 500 bodova i obje nestaju.',
        daily: 'Dnevni izazov',
        dailyText: 'Svi isti dan dobiju isti redoslijed voća. Jedna partija dnevno ide na rang listu, a vježbati možeš koliko hoćeš. Novi izazov počinje u ponoć po našem vremenu.'
      },
      fruits: {
        blueberry: 'Borovnica', raspberry: 'Malina', strawberry: 'Jagoda', lime: 'Limeta', lemon: 'Limun', peach: 'Breskva',
        orange: 'Narandža', mango: 'Mango', pineapple: 'Ananas', melon: 'Dinja', watermelon: 'Lubenica',
        mint: 'Menta', ice: 'Led', golden: 'Zlatna nargila'
      },
      share: {
        title: 'Shisha Drop',
        text: 'Moj rezultat u Shisha Dropu: {score} bodova. Možeš li bolje?',
        textDaily: 'Dnevni izazov Shisha Drop: {score} bodova, #{rank}. Možeš li bolje?',
        saved: 'Slika je sačuvana.',
        copied: 'Link je kopiran.',
        points: 'bodova',
        daily: 'Dnevni izazov',
        practice: 'Vježba'
      },
      rotate: 'Okreni telefon uspravno za najbolji prikaz.',
      faq: [
        { q: 'Šta je Shisha Drop?', a: 'Besplatna igra na MyShishapediji: ubacuješ voće u vazu nargile, iste voćke se spajaju u veće, a cilj je napraviti što više bodova prije nego što se vaza prepuni.' },
        { q: 'Kako radi dnevni izazov?', a: 'Svaki dan svi igrači dobiju isti redoslijed voća. Jedna partija dnevno po telefonu ide na rang listu. Novi izazov počinje u ponoć po vremenu u Sarajevu.' },
        { q: 'Treba li mi račun ili prijava?', a: 'Ne. Upišeš nadimak i igraš. Nadimak je vezan za tvoj telefon i preglednik, bez emaila i lozinke.' },
        { q: 'Kako se računa sedmična rang lista?', a: 'Sedmična lista je zbir tvojih dnevnih rezultata od ponedjeljka do nedjelje.' }
      ]
    },

    en: {
      page: {
        eyebrow: 'New game',
        lead: 'Drop fruit into the hookah base. Two of the same fruit merge into a bigger one, all the way up to a watermelon. Do not let the base overflow. Every day everyone plays the same challenge, and the best make the leaderboard.',
        crumb: 'Shisha Drop',
        noscript: 'The game needs JavaScript.'
      },
      start: {
        daily: 'Daily challenge',
        ready: 'Today\'s challenge is waiting. You get one game that counts for the leaderboard.',
        playing: 'A game is in progress. Pick up where you left off.',
        done: 'Today\'s game is done.',
        doneScore: 'Today\'s game: {score} points',
        nextIn: 'New challenge in {time}',
        best: 'Best',
        today: 'Today',
        nick: 'Nickname',
        nickNone: 'not chosen',
        nickChange: 'Change',
        nickPick: 'Choose a nickname',
        play: 'Play',
        resume: 'Resume',
        played: 'Played',
        practice: 'Practice',
        practiceSub: 'as much as you like, does not count',
        board: 'Leaderboard',
        how: 'How to play',
        offline: 'The leaderboard is not available right now. You can play, and we send your score when the connection is back.'
      },
      nick: {
        title: 'Choose a nickname',
        text: 'This is the name you appear under on the leaderboard. It is tied to this phone and this browser.',
        label: 'Nickname',
        placeholder: 'e.g. Edo_93',
        hint: '3 to 16 characters: letters, numbers, spaces and _ . -',
        save: 'Save',
        cancel: 'Cancel',
        saving: 'Saving…',
        short: 'The nickname is too short (at least 3 characters).',
        long: 'The nickname is too long (at most 16 characters).',
        chars: 'Use letters, numbers, spaces and the characters _ . -',
        blocked: 'This nickname is not allowed. Pick another one.',
        taken: 'This nickname is taken. Pick another one.',
        removed: 'Your nickname was removed. Pick a new one.',
        network: 'Cannot reach the server. Try again in a moment.',
        rate: 'Too many attempts. Try again in a few minutes.'
      },
      hud: {
        score: 'Score',
        next: 'Next',
        today: 'Today',
        practice: 'Practice',
        pause: 'Pause',
        soundOn: 'Turn sound on',
        soundOff: 'Turn sound off',
        aim: 'Tap the spot in the base where you want the fruit to drop.',
        info: 'Special items: what mint, ice and the Golden hookah do'
      },
      fx: {
        combo: 'Combo ×{n}',
        golden: 'Golden hookah!',
        ice: 'Ice!',
        mint: 'Joker!'
      },
      pause: {
        title: 'Paused',
        resume: 'Resume',
        quit: 'Leave',
        quitSaved: 'The game is saved, you continue when you come back.',
        quitPractice: 'The practice game ends.'
      },
      end: {
        over: 'The base is full',
        practiceOver: 'Practice over',
        biggest: 'Biggest fruit: {name}',
        record: 'New record!',
        rank: '#{rank} of {total} today',
        sending: 'Sending your score…',
        failed: 'The score was not sent. We send it as soon as the connection is back.',
        rejected: 'This score was not accepted for the leaderboard.',
        already: 'A score of {score} has already been submitted for today.',
        noNick: 'Choose a nickname to get on the leaderboard.',
        again: 'Play again',
        practice: 'Practice',
        share: 'Share',
        close: 'Close',
        a2hsTitle: 'Add the game to your home screen',
        a2hsText: 'It opens full screen, and your nickname stays saved.',
        a2hsBtn: 'Add',
        a2hsLater: 'Not now'
      },
      board: {
        title: 'Leaderboard',
        day: 'Today',
        week: 'This week',
        weekNote: 'Sum of daily scores since Monday.',
        empty: 'Nobody has played yet. Be the first!',
        loading: 'Loading…',
        error: 'The leaderboard is not available right now.',
        you: 'you',
        players: '{n} players',
        points: 'pts'
      },
      how: {
        title: 'How to play',
        steps: [
          'Tap anywhere in the base (even near the bottom, where your finger does not block the view) and the fruit drops right above that spot.',
          'You can also drag left and right: the dashed line shows where it will land, and when you let go, the fruit drops. It rolls and pushes the other fruit.',
          'Two of the same fruit merge into the next one in the chain. Bigger fruit scores more.',
          'Merges in quick succession build a combo and extra points.',
          'If fruit stays above the red line for 3 seconds, the base is full and the game is over.'
        ],
        chain: 'Fruit chain',
        specials: 'Special items',
        mint: 'A mint leaf is a joker: it merges with the first fruit it touches and makes the next one in the chain.',
        ice: 'An ice cube freezes and removes up to three of the smallest fruit around it to make room.',
        golden: 'Two watermelons merge into the Golden hookah: 500 points and both disappear.',
        daily: 'Daily challenge',
        dailyText: 'Everyone gets the same order of fruit on the same day. One game a day counts for the leaderboard, and you can practice as much as you like. A new challenge starts at midnight, Sarajevo time.'
      },
      fruits: {
        blueberry: 'Blueberry', raspberry: 'Raspberry', strawberry: 'Strawberry', lime: 'Lime', lemon: 'Lemon', peach: 'Peach',
        orange: 'Orange', mango: 'Mango', pineapple: 'Pineapple', melon: 'Melon', watermelon: 'Watermelon',
        mint: 'Mint', ice: 'Ice', golden: 'Golden hookah'
      },
      share: {
        title: 'Shisha Drop',
        text: 'I scored {score} points in Shisha Drop. Can you beat it?',
        textDaily: 'Shisha Drop daily challenge: {score} points, #{rank}. Can you beat it?',
        saved: 'The image is saved.',
        copied: 'Link copied.',
        points: 'points',
        daily: 'Daily challenge',
        practice: 'Practice'
      },
      rotate: 'Turn your phone upright for the best view.',
      faq: [
        { q: 'What is Shisha Drop?', a: 'A free game on MyShishapedia: you drop fruit into a hookah base, matching fruit merge into bigger ones, and the goal is to score as many points as you can before the base overflows.' },
        { q: 'How does the daily challenge work?', a: 'Every day all players get the same order of fruit. One game a day per phone counts for the leaderboard. A new challenge starts at midnight, Sarajevo time.' },
        { q: 'Do I need an account?', a: 'No. You type a nickname and play. The nickname is tied to your phone and browser, with no email or password.' },
        { q: 'How is the weekly leaderboard calculated?', a: 'The weekly leaderboard is the sum of your daily scores from Monday to Sunday.' }
      ]
    },

    de: {
      page: {
        eyebrow: 'Neues Spiel',
        lead: 'Wirf Früchte in die Bowl der Shisha. Zwei gleiche Früchte verschmelzen zu einer größeren, bis hin zur Wassermelone. Lass die Bowl nicht überlaufen. Jeden Tag spielen alle dieselbe Challenge, die Besten stehen in der Rangliste.',
        crumb: 'Shisha Drop',
        noscript: 'Für das Spiel wird JavaScript benötigt.'
      },
      start: {
        daily: 'Tages-Challenge',
        ready: 'Die heutige Challenge wartet. Du hast ein Spiel, das für die Rangliste zählt.',
        playing: 'Ein Spiel läuft. Mach weiter, wo du aufgehört hast.',
        done: 'Das heutige Spiel ist gespielt.',
        doneScore: 'Heutiges Spiel: {score} Punkte',
        nextIn: 'Neue Challenge in {time}',
        best: 'Rekord',
        today: 'Heute',
        nick: 'Nickname',
        nickNone: 'nicht gewählt',
        nickChange: 'Ändern',
        nickPick: 'Nickname wählen',
        play: 'Spielen',
        resume: 'Weiter',
        played: 'Gespielt',
        practice: 'Üben',
        practiceSub: 'so oft du willst, zählt nicht',
        board: 'Rangliste',
        how: 'So wird gespielt',
        offline: 'Die Rangliste ist gerade nicht verfügbar. Du kannst spielen, wir senden dein Ergebnis, sobald die Verbindung wieder da ist.'
      },
      nick: {
        title: 'Nickname wählen',
        text: 'Unter diesem Namen erscheinst du in der Rangliste. Er ist an dieses Handy und diesen Browser gebunden.',
        label: 'Nickname',
        placeholder: 'z. B. Edo_93',
        hint: '3 bis 16 Zeichen: Buchstaben, Zahlen, Leerzeichen und _ . -',
        save: 'Speichern',
        cancel: 'Abbrechen',
        saving: 'Speichere…',
        short: 'Der Nickname ist zu kurz (mindestens 3 Zeichen).',
        long: 'Der Nickname ist zu lang (höchstens 16 Zeichen).',
        chars: 'Erlaubt sind Buchstaben, Zahlen, Leerzeichen und _ . -',
        blocked: 'Dieser Nickname ist nicht erlaubt. Wähle einen anderen.',
        taken: 'Dieser Nickname ist vergeben. Wähle einen anderen.',
        removed: 'Dein Nickname wurde entfernt. Wähle einen neuen.',
        network: 'Keine Verbindung zum Server. Versuch es gleich noch einmal.',
        rate: 'Zu viele Versuche. Versuch es in ein paar Minuten noch einmal.'
      },
      hud: {
        score: 'Punkte',
        next: 'Nächste',
        today: 'Heute',
        practice: 'Übung',
        pause: 'Pause',
        soundOn: 'Ton einschalten',
        soundOff: 'Ton ausschalten',
        aim: 'Tippe auf die Stelle in der Bowl, wo die Frucht fallen soll.',
        info: 'Besondere Items: was Minze, Eis und die Goldene Shisha machen'
      },
      fx: {
        combo: 'Combo ×{n}',
        golden: 'Goldene Shisha!',
        ice: 'Eis!',
        mint: 'Joker!'
      },
      pause: {
        title: 'Pause',
        resume: 'Weiter',
        quit: 'Verlassen',
        quitSaved: 'Das Spiel bleibt gespeichert, du machst weiter, wenn du zurückkommst.',
        quitPractice: 'Die Übung wird beendet.'
      },
      end: {
        over: 'Die Bowl ist voll',
        practiceOver: 'Übung beendet',
        biggest: 'Größte Frucht: {name}',
        record: 'Neuer Rekord!',
        rank: '#{rank} von {total} heute',
        sending: 'Ergebnis wird gesendet…',
        failed: 'Das Ergebnis wurde nicht gesendet. Wir senden es, sobald die Verbindung wieder da ist.',
        rejected: 'Dieses Ergebnis wurde nicht in die Rangliste aufgenommen.',
        already: 'Für heute wurde schon ein Ergebnis von {score} eingereicht.',
        noNick: 'Wähle einen Nickname, damit du in die Rangliste kommst.',
        again: 'Nochmal spielen',
        practice: 'Üben',
        share: 'Teilen',
        close: 'Schließen',
        a2hsTitle: 'Spiel zum Startbildschirm hinzufügen',
        a2hsText: 'Es öffnet sich im Vollbild, und dein Nickname bleibt gespeichert.',
        a2hsBtn: 'Hinzufügen',
        a2hsLater: 'Nicht jetzt'
      },
      board: {
        title: 'Rangliste',
        day: 'Heute',
        week: 'Diese Woche',
        weekNote: 'Summe der Tagesergebnisse seit Montag.',
        empty: 'Noch hat niemand gespielt. Dein Ergebnis kann das erste sein!',
        loading: 'Lädt…',
        error: 'Die Rangliste ist gerade nicht verfügbar.',
        you: 'du',
        players: '{n} Spieler',
        points: 'Pkt.'
      },
      how: {
        title: 'So wird gespielt',
        steps: [
          'Tippe irgendwo in die Bowl (auch unten, wo der Finger nicht die Sicht verdeckt), und die Frucht fällt genau über dieser Stelle.',
          'Du kannst auch mit dem Finger nach links und rechts ziehen: Die gestrichelte Linie zeigt, wo sie landet, und wenn du loslässt, fällt die Frucht. Sie rollt und schiebt die anderen Früchte.',
          'Zwei gleiche Früchte verschmelzen zur nächsten in der Kette. Größere Früchte bringen mehr Punkte.',
          'Schnell hintereinander verschmolzene Früchte ergeben eine Combo und Extrapunkte.',
          'Bleibt eine Frucht 3 Sekunden über der roten Linie, ist die Bowl voll und das Spiel vorbei.'
        ],
        chain: 'Fruchtkette',
        specials: 'Besondere Gegenstände',
        mint: 'Ein Minzblatt ist ein Joker: Es verschmilzt mit der ersten Frucht, die es berührt, zur nächsten in der Kette.',
        ice: 'Ein Eiswürfel friert bis zu drei der kleinsten Früchte um sich herum ein und entfernt sie, damit Platz entsteht.',
        golden: 'Zwei Wassermelonen verschmelzen zur Goldenen Shisha: 500 Punkte, und beide verschwinden.',
        daily: 'Tages-Challenge',
        dailyText: 'Alle bekommen am selben Tag dieselbe Reihenfolge der Früchte. Ein Spiel pro Tag zählt für die Rangliste, üben kannst du so oft du willst. Eine neue Challenge beginnt um Mitternacht, Zeit in Sarajevo.'
      },
      fruits: {
        blueberry: 'Heidelbeere', raspberry: 'Himbeere', strawberry: 'Erdbeere', lime: 'Limette', lemon: 'Zitrone', peach: 'Pfirsich',
        orange: 'Orange', mango: 'Mango', pineapple: 'Ananas', melon: 'Honigmelone', watermelon: 'Wassermelone',
        mint: 'Minze', ice: 'Eis', golden: 'Goldene Shisha'
      },
      share: {
        title: 'Shisha Drop',
        text: 'Ich habe {score} Punkte in Shisha Drop geschafft. Schaffst du mehr?',
        textDaily: 'Shisha Drop Tages-Challenge: {score} Punkte, #{rank}. Schaffst du mehr?',
        saved: 'Das Bild ist gespeichert.',
        copied: 'Link kopiert.',
        points: 'Punkte',
        daily: 'Tages-Challenge',
        practice: 'Übung'
      },
      rotate: 'Halte das Handy hochkant für die beste Ansicht.',
      faq: [
        { q: 'Was ist Shisha Drop?', a: 'Ein kostenloses Spiel auf MyShishapedia: Du wirfst Früchte in die Bowl einer Shisha, gleiche Früchte verschmelzen zu größeren, und das Ziel ist, so viele Punkte wie möglich zu holen, bevor die Bowl überläuft.' },
        { q: 'Wie funktioniert die Tages-Challenge?', a: 'Jeden Tag bekommen alle Spieler dieselbe Reihenfolge der Früchte. Ein Spiel pro Tag und Handy zählt für die Rangliste. Eine neue Challenge beginnt um Mitternacht, Zeit in Sarajevo.' },
        { q: 'Brauche ich ein Konto?', a: 'Nein. Du gibst einen Nickname ein und spielst. Der Nickname ist an dein Handy und deinen Browser gebunden, ohne E-Mail und Passwort.' },
        { q: 'Wie wird die Wochenrangliste berechnet?', a: 'Die Wochenrangliste ist die Summe deiner Tagesergebnisse von Montag bis Sonntag.' }
      ]
    }
  };

  /** Tekst igre za ključ (npr. 'end.rank') na trenutnom jeziku, sa {placeholderima}. */
  MSP.gt = function (path, vars) {
    var lang = MSP.GAME_STRINGS[MSP.lang] ? MSP.lang : 'en';
    var node = MSP.GAME_STRINGS[lang];
    var keys = path.split('.');
    for (var i = 0; i < keys.length && node != null; i++) node = node[keys[i]];
    if (node == null) return path;
    if (typeof node !== 'string' || !vars) return node;
    return node.replace(/\{(\w+)\}/g, function (m, k) { return Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m; });
  };
})(typeof window !== 'undefined' ? window : globalThis);
