// node --test tests/*.test.mjs   (API igre: lib/game-api.mjs nad SQLite bazom koja se ponaša kao D1)
import test from 'node:test';
import assert from 'node:assert/strict';
import { handleGame } from '../lib/game-api.mjs';
import { D1Sqlite } from '../lib/d1-sqlite.mjs';

const NOW = new Date('2026-11-10T15:00:00Z'); // 16:00 u Sarajevu
const dev = (c) => c.repeat(32);

function env() { return { DB: new D1Sqlite(':memory:'), GAME_SALT: 'test' }; }
function req(method, path, body, ip) {
  const headers = { 'CF-Connecting-IP': ip || '1.2.3.4' };
  if (body) headers['Content-Type'] = 'application/json';
  return new Request('https://myshishapedia.com/api/game/' + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
}
async function call(e, method, action, body, opts = {}) {
  const path = action + (opts.qs ? '?' + opts.qs : '');
  const res = await handleGame(req(method, path, body, opts.ip), e, action, opts.now || NOW);
  return { status: res.status, body: await res.json() };
}
const score = (d, s, extra) => Object.assign({ device: d, day: '2026-11-10', score: s, drops: 80, merges: 50, golden: 0, maxLevel: 6, ms: 200000, iced: 0 }, extra);

test('tabele se prave same, bez migracije', async () => {
  const e = env();
  const r = await call(e, 'GET', 'board', null, { qs: 'scope=day' });
  assert.equal(r.status, 200);
  assert.deepEqual(r.body.top, []);
  const t = e.DB.db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all().map((x) => x.name);
  assert.deepEqual(t, ['game_limits', 'game_players', 'game_scores']);
});

test('bez baze: today radi, ostalo javi da nije podešeno', async () => {
  const r = await handleGame(req('GET', 'today'), {}, 'today', NOW);
  assert.equal(r.status, 200);
  const b = await r.json();
  assert.equal(b.day, '2026-11-10');
  assert.equal(b.week, '2026-11-09');
  const r2 = await handleGame(req('GET', 'board'), {}, 'board', NOW);
  assert.equal(r2.status, 503);
});

test('nadimak: upis, jedinstvenost, promjena, filter', async () => {
  const e = env();
  assert.equal((await call(e, 'POST', 'player', { device: dev('a'), nick: 'Edo_93' })).body.nick, 'Edo_93');
  assert.equal((await call(e, 'POST', 'player', { device: dev('b'), nick: 'edo 93' })).body.error, 'taken');
  assert.equal((await call(e, 'POST', 'player', { device: dev('b'), nick: 'Lejla' })).status, 200);
  // isti uređaj smije promijeniti svoj nadimak
  assert.equal((await call(e, 'POST', 'player', { device: dev('a'), nick: 'Edo' })).body.nick, 'Edo');
  assert.equal((await call(e, 'GET', 'player', null, { qs: 'device=' + dev('a') })).body.nick, 'Edo');
  assert.equal((await call(e, 'POST', 'player', { device: dev('c'), nick: 'kurac' })).body.error, 'blocked');
  assert.equal((await call(e, 'POST', 'player', { device: 'kratko', nick: 'Neko' })).body.error, 'bad-device');
  // ključ uređaja se ne čuva, samo hash
  const rows = e.DB.db.prepare('SELECT device FROM game_players').all();
  assert.ok(rows.every((r) => r.device !== dev('a') && r.device.length === 40));
});

test('rezultat: jedan dnevno po uređaju, rang i liste', async () => {
  const e = env();
  for (const [c, n] of [['a', 'Amar'], ['b', 'Belma'], ['c', 'Cane']]) await call(e, 'POST', 'player', { device: dev(c), nick: n });
  assert.equal((await call(e, 'POST', 'score', score(dev('a'), 300))).body.rank, 1);
  assert.equal((await call(e, 'POST', 'score', score(dev('b'), 500))).body.rank, 1);
  const c = await call(e, 'POST', 'score', score(dev('c'), 400));
  assert.equal(c.body.rank, 2);
  assert.equal(c.body.total, 3);
  const again = await call(e, 'POST', 'score', score(dev('a'), 900));
  assert.equal(again.status, 409);
  assert.equal(again.body.error, 'already');
  assert.equal(again.body.score, 300, 'ostaje prvi rezultat');
  const board = await call(e, 'GET', 'board', null, { qs: 'scope=day&device=' + dev('a') });
  assert.deepEqual(board.body.top.map((r) => [r.rank, r.nick, r.score, r.mine]), [[1, 'Belma', 500, false], [2, 'Cane', 400, false], [3, 'Amar', 300, true]]);
  assert.deepEqual(board.body.me, { rank: 3, score: 300 });
  // sljedeći dan iste sedmice: sedmica je zbir
  const tomorrow = new Date('2026-11-11T15:00:00Z');
  await call(e, 'POST', 'score', score(dev('a'), 450, { day: '2026-11-11' }), { now: tomorrow });
  const week = await call(e, 'GET', 'board', null, { qs: 'scope=week&device=' + dev('a'), now: tomorrow });
  assert.equal(week.body.top[0].nick, 'Amar');
  assert.equal(week.body.top[0].score, 750);
  assert.deepEqual(week.body.me, { rank: 1, score: 750 });
  const day2 = await call(e, 'GET', 'board', null, { qs: 'scope=day', now: tomorrow });
  assert.equal(day2.body.top.length, 1);
});

test('rezultat: pogrešan dan, bez nadimka, nemoguć rezultat', async () => {
  const e = env();
  await call(e, 'POST', 'player', { device: dev('a'), nick: 'Amar' });
  assert.equal((await call(e, 'POST', 'score', score(dev('a'), 100, { day: '2026-11-08' }))).body.error, 'wrong-day');
  assert.equal((await call(e, 'POST', 'score', score(dev('d'), 100))).body.error, 'no-player');
  assert.equal((await call(e, 'POST', 'score', score(dev('a'), 999999))).body.error, 'bad-score');
  assert.equal((await call(e, 'POST', 'score', score(dev('a'), 100, { ms: 500 }))).body.error, 'too-fast');
});

test('partija započeta prije ponoći smije se predati malo poslije', async () => {
  const e = env();
  await call(e, 'POST', 'player', { device: dev('a'), nick: 'Amar' });
  const justAfter = new Date('2026-11-10T23:10:00Z'); // 00:10 11.11. u Sarajevu
  assert.equal((await call(e, 'POST', 'score', score(dev('a'), 100), { now: justAfter })).status, 200);
  const later = new Date('2026-11-11T00:30:00Z'); // 01:30
  await call(e, 'POST', 'player', { device: dev('b'), nick: 'Belma' });
  assert.equal((await call(e, 'POST', 'score', score(dev('b'), 100), { now: later })).body.error, 'wrong-day');
});

test('uklonjen nadimak: nestaje sa liste, igrač bira novi', async () => {
  const e = env();
  await call(e, 'POST', 'player', { device: dev('a'), nick: 'Ruzno' });
  await call(e, 'POST', 'score', score(dev('a'), 300));
  e.DB.db.exec("UPDATE game_players SET removed = 1, nick_key = 'removed:' || device WHERE nick = 'Ruzno'");
  assert.deepEqual((await call(e, 'GET', 'board', null, { qs: 'scope=day' })).body.top, []);
  const p = await call(e, 'GET', 'player', null, { qs: 'device=' + dev('a') });
  assert.deepEqual(p.body, { nick: null, removed: true });
  assert.equal((await call(e, 'POST', 'player', { device: dev('b'), nick: 'Ruzno' })).status, 200, 'nadimak je opet slobodan');
  assert.equal((await call(e, 'POST', 'player', { device: dev('a'), nick: 'Lijepo' })).status, 200);
  assert.equal((await call(e, 'GET', 'board', null, { qs: 'scope=day' })).body.top[0].nick, 'Lijepo');
});

test('ograničenje broja upisa po IP adresi', async () => {
  const e = env();
  let last;
  for (let i = 0; i < 22; i++) last = await call(e, 'POST', 'player', { device: (i.toString(16).padStart(2, '0')).repeat(16), nick: 'Igrac' + i }, { ip: '9.9.9.9' });
  assert.equal(last.status, 429);
  assert.equal((await call(e, 'POST', 'player', { device: dev('f'), nick: 'Drugi' }, { ip: '8.8.8.8' })).status, 200);
});

test('nepoznata akcija i metod', async () => {
  const e = env();
  assert.equal((await call(e, 'GET', 'nesto')).status, 404);
  assert.equal((await call(e, 'GET', 'score')).status, 405);
  assert.equal((await handleGame(new Request('https://x/api/game/player', { method: 'POST', body: 'x' }), e, 'player', NOW)).status, 400);
});
