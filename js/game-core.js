/*
 * MyShishapedia - Shisha Drop: zajednička pravila igre.
 *
 * Isti fajl koriste igra u browseru (js/game.js, kao MSP.GameCore), server
 * (functions/api/game, preko importa) i testovi, pa obje strane računaju isto:
 * lanac voća, bodove, dnevni redoslijed voća, dan i sedmicu po vremenu u Sarajevu,
 * pravila za nadimak i provjeru da li predati rezultat ima smisla.
 * Samo čist JavaScript, bez DOM-a (radi u browseru, Node-u i Cloudflare Workers).
 */
(function (root, factory) {
  'use strict';
  var core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  else {
    var MSP = (root.MSP = root.MSP || {});
    MSP.GameCore = core;
  }
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  var VERSION = 1;
  var TZ = 'Europe/Sarajevo';

  /* ------------------------------------------------------------------ */
  /* Voće                                                                */
  /* ------------------------------------------------------------------ */

  // Svijet igre je širok 400 jedinica (vaza), sve veličine su u tim jedinicama.
  // id je ključ za tekst (naziv voćke) i za crtež (js/game-art.js).
  var FRUITS = [
    { id: 'blueberry', r: 16, color: '#3b3f9e' },
    { id: 'raspberry', r: 21, color: '#e01e5a' },
    { id: 'strawberry', r: 27, color: '#e3253b' },
    { id: 'lime', r: 33, color: '#8fd332' },
    { id: 'lemon', r: 40, color: '#ffe23a' },
    { id: 'peach', r: 48, color: '#ffab7a' },
    { id: 'orange', r: 56, color: '#ff8f1f' },
    { id: 'mango', r: 65, color: '#ffc23a' },
    { id: 'pineapple', r: 75, color: '#e8a52a' },
    { id: 'melon', r: 85, color: '#f2c96a' },
    { id: 'watermelon', r: 96, color: '#3c9a3c' }
  ];
  var TOP = FRUITS.length - 1;
  // Ubacuje se samo prvih pet; veće voće nastaje spajanjem.
  var DROP_LEVELS = 5;
  var DROP_WEIGHTS = [32, 26, 20, 13, 9];

  // Specijalni predmeti u redoslijedu (u nizu su kao brojevi iznad voća).
  var MINT = 100;
  var ICE = 101;
  var SPECIAL_R = { 100: 18, 101: 19 };

  // Bodovi kad nastane voćka nivoa k (spajanjem dvije nivoa k-1).
  var POINTS = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66];
  var GOLDEN_POINTS = 500;   // dvije lubenice -> Zlatna nargila
  var ICE_POINTS = 5;        // po voćki koju led ukloni
  var COMBO_WINDOW_MS = 1200;
  var COMBO_MAX_STEPS = 8;   // množilac ide najviše do 1 + 8 * 0.25 = 3

  var WORLD = { w: 400, h: 560, line: 64 }; // linija kraja je 64 jedinice ispod vrha vaze
  var DROP_COOLDOWN_MS = 420;
  var DANGER_MS = 3000;
  var WARN_MS = 2000;

  function comboMultiplier(combo) {
    return 1 + 0.25 * Math.min(Math.max(combo - 1, 0), COMBO_MAX_STEPS);
  }

  /** Bodovi za jedno spajanje: nivo nove voćke (ili 'golden') i trenutni combo (1 = prvo spajanje). */
  function mergePoints(newLevel, combo) {
    var base = newLevel === 'golden' ? GOLDEN_POINTS : POINTS[Math.min(newLevel, TOP)];
    return Math.round(base * comboMultiplier(combo));
  }

  /* ------------------------------------------------------------------ */
  /* Slučajni brojevi sa sjemenom                                        */
  /* ------------------------------------------------------------------ */

  /** FNV-1a 32-bit hash teksta. */
  function hashString(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  /** mulberry32: mali, brz i dovoljno dobar generator za redoslijed voća. */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function weighted(r, weights) {
    var sum = 0;
    for (var i = 0; i < weights.length; i++) sum += weights[i];
    var x = r() * sum;
    for (var k = 0; k < weights.length; k++) {
      x -= weights[k];
      if (x < 0) return k;
    }
    return weights.length - 1;
  }

  /**
   * Redoslijed predmeta za partiju: brojevi 0-4 su voće, MINT i ICE specijalni predmeti.
   * Prvih 14 je uvijek voće; poslije se specijalni pojavi otprilike svakih 22-34 bacanja.
   */
  function makeQueue(seed, length) {
    var r = rng(seed);
    var out = [];
    var nextSpecial = 14 + Math.floor(r() * 12);
    var n = length || 4000;
    for (var i = 0; i < n; i++) {
      if (i === nextSpecial) {
        out.push(r() < 0.6 ? MINT : ICE);
        nextSpecial = i + 22 + Math.floor(r() * 13);
      } else {
        out.push(weighted(r, DROP_WEIGHTS));
      }
    }
    return out;
  }

  function dailySeed(day) { return hashString('shisha-drop|v' + VERSION + '|' + day); }

  /* ------------------------------------------------------------------ */
  /* Dan i sedmica (Europe/Sarajevo)                                     */
  /* ------------------------------------------------------------------ */

  var fmtCache = null;
  function parts(date) {
    if (!fmtCache) {
      fmtCache = new Intl.DateTimeFormat('en-GB', {
        timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
      });
    }
    var o = {};
    fmtCache.formatToParts(date).forEach(function (p) { o[p.type] = p.value; });
    return o;
  }

  /** "2026-11-10": dan po vremenu u Sarajevu. */
  function dayKey(date) {
    var p = parts(date || new Date());
    return p.year + '-' + p.month + '-' + p.day;
  }

  function addDays(day, n) {
    var d = new Date(day + 'T12:00:00Z');
    d.setUTCDate(d.getUTCDate() + n);
    return d.toISOString().slice(0, 10);
  }

  /** Ponedjeljak sedmice kojoj pripada dan (sedmica ide od ponedjeljka). */
  function weekKey(day) {
    var d = new Date(day + 'T12:00:00Z');
    var dow = (d.getUTCDay() + 6) % 7;
    return addDays(day, -dow);
  }

  /** Milisekunde do ponoći po vremenu u Sarajevu. */
  function msToNextDay(date) {
    var now = date || new Date();
    var p = parts(now);
    var secs = (+p.hour) * 3600 + (+p.minute) * 60 + (+p.second);
    return Math.max(1000, (86400 - secs) * 1000 - (now.getMilliseconds ? now.getMilliseconds() : 0));
  }

  function isDay(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s + 'T00:00:00Z')); }

  /* ------------------------------------------------------------------ */
  /* Nadimak                                                             */
  /* ------------------------------------------------------------------ */

  var NICK_MIN = 3;
  var NICK_MAX = 16;
  var NICK_RE = /^[A-Za-z0-9ČčĆćŽžŠšĐđÄäÖöÜüß_.\- ]+$/;

  // Zabranjene riječi (provjera nad "ključem" nadimka: mala slova, bez dijakritika,
  // brojevi kao slova, bez razmaka i znakova). Kratko i namjerno bez riječi koje
  // su dio običnih imena; ostalo se rješava uklanjanjem nadimka u bazi.
  var BLOCKED = [
    // bs/hr/sr
    'picka', 'pizda', 'kurac', 'kurc', 'jebem', 'jebi', 'jebo', 'jebac', 'jebe', 'govno', 'drolja', 'kurva', 'kurvo', 'peder', 'pederu',
    'balija', 'cetnik', 'ustasa', 'cigan', 'smrad', 'debil', 'retard', 'mamuti', 'majkuti', 'sisaj',
    // en
    'fuck', 'fuk', 'shit', 'cunt', 'bitch', 'nigger', 'nigga', 'faggot', 'whore', 'slut', 'rape', 'nazi', 'hitler', 'asshole', 'pussy', 'dick', 'cock', 'penis', 'porn', 'sex',
    // de
    'scheisse', 'scheis', 'fotze', 'hure', 'wichser', 'arschloch', 'schwuchtel', 'ficken', 'fick', 'kanake', 'missgeburt', 'spast', 'heil',
    // rezervisano
    'admin', 'moderator', 'myshishapedia', 'shishapedia'
  ];

  function nickClean(s) {
    return String(s == null ? '' : s).replace(/\s+/g, ' ').trim();
  }

  /** Ključ za jedinstvenost i filter: "Edo_93" i "edo 93" su isti nadimak. */
  function nickKey(s) {
    return nickClean(s)
      .toLowerCase()
      .replace(/đ/g, 'dj')
      .replace(/ß/g, 'ss')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e').replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't').replace(/8/g, 'b')
      .replace(/[^a-z0-9]/g, '');
  }

  /** { ok: true, nick, key } ili { ok: false, error: 'short' | 'long' | 'chars' | 'blocked' }. */
  function validateNick(raw) {
    var nick = nickClean(raw);
    if (nick.length < NICK_MIN) return { ok: false, error: 'short' };
    if (nick.length > NICK_MAX) return { ok: false, error: 'long' };
    if (!NICK_RE.test(nick)) return { ok: false, error: 'chars' };
    var key = nickKey(nick);
    if (key.length < 2) return { ok: false, error: 'chars' };
    for (var i = 0; i < BLOCKED.length; i++) {
      if (key.indexOf(BLOCKED[i]) !== -1) return { ok: false, error: 'blocked' };
    }
    return { ok: true, nick: nick, key: key };
  }

  /* ------------------------------------------------------------------ */
  /* Provjera rezultata                                                  */
  /* ------------------------------------------------------------------ */

  var DEVICE_RE = /^[a-f0-9]{32}$/;
  var LIMITS = { drops: 6000, ms: 4 * 3600 * 1000 };

  function int(v) { return typeof v === 'number' && isFinite(v) && Math.floor(v) === v; }

  /**
   * Da li predati rezultat dnevnog izazova ima smisla (ne provjerava fiziku, samo granice):
   * broj bacanja i spajanja, trajanje (između bacanja je najmanje DROP_COOLDOWN_MS),
   * najveći mogući broj bodova za taj broj spajanja. Vraća { ok, value } ili { ok: false, error }.
   */
  function validateScore(body) {
    if (!body || typeof body !== 'object') return { ok: false, error: 'bad-body' };
    var b = body;
    if (typeof b.device !== 'string' || !DEVICE_RE.test(b.device)) return { ok: false, error: 'bad-device' };
    if (!isDay(b.day)) return { ok: false, error: 'bad-day' };
    var fields = ['score', 'drops', 'merges', 'golden', 'maxLevel', 'ms', 'iced'];
    for (var i = 0; i < fields.length; i++) {
      if (!int(b[fields[i]]) || b[fields[i]] < 0) return { ok: false, error: 'bad-' + fields[i] };
    }
    if (b.drops < 1 || b.drops > LIMITS.drops) return { ok: false, error: 'bad-drops' };
    if (b.ms > LIMITS.ms) return { ok: false, error: 'bad-ms' };
    if (b.ms < b.drops * DROP_COOLDOWN_MS * 0.9) return { ok: false, error: 'too-fast' };
    if (b.maxLevel > TOP) return { ok: false, error: 'bad-maxLevel' };
    // svako spajanje smanji broj voćki za jedan (džoker menta takođe nestane), pa ih ne može biti više od bacanja
    if (b.merges > b.drops) return { ok: false, error: 'bad-merges' };
    if (b.golden * 2 > b.merges) return { ok: false, error: 'bad-golden' };
    if (b.maxLevel > DROP_LEVELS - 1 && b.merges < b.maxLevel - (DROP_LEVELS - 1)) return { ok: false, error: 'bad-maxLevel' };
    if (b.iced > b.drops * 3) return { ok: false, error: 'bad-iced' };
    var maxMult = comboMultiplier(COMBO_MAX_STEPS + 1);
    var cap = Math.ceil((b.merges - b.golden) * POINTS[TOP] * maxMult + b.golden * GOLDEN_POINTS * maxMult + b.iced * ICE_POINTS);
    if (b.score > cap) return { ok: false, error: 'bad-score' };
    return {
      ok: true,
      value: { device: b.device, day: b.day, score: b.score, drops: b.drops, merges: b.merges, golden: b.golden, maxLevel: b.maxLevel, ms: b.ms, iced: b.iced }
    };
  }

  return {
    VERSION: VERSION,
    TZ: TZ,
    FRUITS: FRUITS,
    TOP: TOP,
    DROP_LEVELS: DROP_LEVELS,
    DROP_WEIGHTS: DROP_WEIGHTS,
    MINT: MINT,
    ICE: ICE,
    SPECIAL_R: SPECIAL_R,
    POINTS: POINTS,
    GOLDEN_POINTS: GOLDEN_POINTS,
    ICE_POINTS: ICE_POINTS,
    COMBO_WINDOW_MS: COMBO_WINDOW_MS,
    WORLD: WORLD,
    DROP_COOLDOWN_MS: DROP_COOLDOWN_MS,
    DANGER_MS: DANGER_MS,
    WARN_MS: WARN_MS,
    NICK_MIN: NICK_MIN,
    NICK_MAX: NICK_MAX,
    comboMultiplier: comboMultiplier,
    mergePoints: mergePoints,
    hashString: hashString,
    rng: rng,
    makeQueue: makeQueue,
    dailySeed: dailySeed,
    dayKey: dayKey,
    addDays: addDays,
    weekKey: weekKey,
    msToNextDay: msToNextDay,
    isDay: isDay,
    nickKey: nickKey,
    validateNick: validateNick,
    validateScore: validateScore
  };
});
