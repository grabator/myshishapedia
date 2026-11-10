// node --test tests/   (pravila igre: js/game-core.js)
import test from 'node:test';
import assert from 'node:assert/strict';
import core from '../js/game-core.js';

test('lanac ima 11 voćki koje rastu, ubacuje se prvih 5', () => {
  assert.equal(core.FRUITS.length, 11);
  for (let i = 1; i < core.FRUITS.length; i++) assert.ok(core.FRUITS[i].r > core.FRUITS[i - 1].r);
  assert.equal(core.DROP_LEVELS, 5);
  assert.ok(core.FRUITS[core.TOP].r * 2 < core.WORLD.w, 'lubenica mora stati u vazu');
});

test('dnevni redoslijed je isti za isti dan i drugačiji za drugi dan', () => {
  const a = core.makeQueue(core.dailySeed('2026-11-10'), 500);
  const b = core.makeQueue(core.dailySeed('2026-11-10'), 500);
  const c = core.makeQueue(core.dailySeed('2026-11-11'), 500);
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
  assert.ok(a.slice(0, 14).every((x) => x >= 0 && x < core.DROP_LEVELS), 'prvih 14 je voće');
  const specials = a.filter((x) => x === core.MINT || x === core.ICE).length;
  assert.ok(specials >= 10 && specials <= 25, 'specijalnih je rijetko: ' + specials);
  assert.ok(a.every((x) => (x >= 0 && x < core.DROP_LEVELS) || x === core.MINT || x === core.ICE));
});

test('bodovi i combo', () => {
  assert.equal(core.mergePoints(1, 1), 3);
  assert.equal(core.mergePoints(10, 1), 66);
  assert.equal(core.mergePoints('golden', 1), 500);
  assert.equal(core.mergePoints(2, 3), Math.round(6 * 1.5));
  assert.equal(core.comboMultiplier(100), 3);
});

test('dan i sedmica po vremenu u Sarajevu', () => {
  // 23:30 UTC 10.11. je već 00:30 11.11. u Sarajevu (zimsko vrijeme, UTC+1)
  assert.equal(core.dayKey(new Date('2026-11-10T23:30:00Z')), '2026-11-11');
  assert.equal(core.dayKey(new Date('2026-11-10T22:30:00Z')), '2026-11-10');
  // ljetno vrijeme (UTC+2)
  assert.equal(core.dayKey(new Date('2026-07-01T22:30:00Z')), '2026-07-02');
  assert.equal(core.weekKey('2026-11-10'), '2026-11-09'); // utorak -> ponedjeljak
  assert.equal(core.weekKey('2026-11-15'), '2026-11-09'); // nedjelja
  assert.equal(core.weekKey('2026-11-16'), '2026-11-16'); // ponedjeljak
  const ms = core.msToNextDay(new Date('2026-11-10T22:00:00Z')); // 23:00 u Sarajevu
  assert.ok(Math.abs(ms - 3600 * 1000) < 2000, String(ms));
});

test('nadimak: dužina, znakovi, filter i ključ', () => {
  assert.equal(core.validateNick('Edo_93').ok, true);
  assert.equal(core.validateNick('  Šejla  Đ ').nick, 'Šejla Đ');
  assert.equal(core.validateNick('ab').error, 'short');
  assert.equal(core.validateNick('a'.repeat(17)).error, 'long');
  assert.equal(core.validateNick('<script>').error, 'chars');
  assert.equal(core.validateNick('jeb3m_ti').error, 'blocked');
  assert.equal(core.validateNick('F.u.c.k').error, 'blocked');
  assert.equal(core.validateNick('Arschloch99').error, 'blocked');
  assert.equal(core.validateNick('Šiša majstor').ok, true, 'riječ šiša je dozvoljena');
  assert.equal(core.validateNick('MyShishapedia').error, 'blocked');
  assert.equal(core.nickKey('Edo 93'), core.nickKey('edo_93'));
});

const good = { device: 'a'.repeat(32), day: '2026-11-10', score: 420, drops: 60, merges: 40, golden: 0, maxLevel: 7, ms: 120000, iced: 0 };

test('provjera rezultata: ispravan prolazi', () => {
  assert.equal(core.validateScore(good).ok, true);
});

test('provjera rezultata: nemoguće vrijednosti se odbijaju', () => {
  const bad = (patch, err) => assert.equal(core.validateScore(Object.assign({}, good, patch)).error, err);
  bad({ device: 'x' }, 'bad-device');
  bad({ day: '10.11.2026' }, 'bad-day');
  bad({ score: -1 }, 'bad-score');
  bad({ score: 1.5 }, 'bad-score');
  bad({ ms: 1000 }, 'too-fast');
  bad({ merges: 61 }, 'bad-merges');
  bad({ maxLevel: 11 }, 'bad-maxLevel');
  bad({ maxLevel: 10, merges: 3 }, 'bad-maxLevel');
  bad({ golden: 30 }, 'bad-golden');
  bad({ score: 999999 }, 'bad-score');
  bad({ drops: 0 }, 'bad-drops');
});
