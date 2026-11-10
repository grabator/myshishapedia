/*
 * Shisha Drop: provjera igre u emuliranom telefonu (Playwright + Chromium).
 *
 *   node build.mjs && node serve.mjs            (u drugom terminalu)
 *   node scripts/game-qa.mjs                     Pixel 5, procesor usporen 4x, bosanski
 *   node scripts/game-qa.mjs "iPhone 13" 4 en    drugi telefon, usporenje i jezik
 *
 * Prolazi kroz: nadimak (i grešku za prekratak), dnevnu partiju sa pravim dodirima, ~22 s bacanja
 * uz mjerenje sličica u sekundi, kraj partije i slanje rezultata, vježbu, osvježavanje usred
 * partije (mora se vratiti na pauzi) i rang listu. Snimci ekrana idu u qa-out/ (nije u gitu).
 * Na kraju ispiše rezultat i greške iz konzole; izlazi sa 1 ako ima grešaka.
 * Napomena: Chromium ovdje crta canvas bez grafičke kartice, pa su brojke strože nego na pravom telefonu.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch (e) {
  console.error('Treba Playwright: npm i -g playwright && npx playwright install chromium');
  process.exit(1);
}
const { chromium, devices } = pw;

const DEV = process.argv[2] || 'Pixel 5';
const RATE = Number(process.argv[3] || 4);
const LANG = process.argv[4] || 'bs';
const BASE = process.env.QA_URL || 'http://localhost:5173';
const URLS = { bs: '/bs/igra/', en: '/en/game/', de: '/de/spiel/' };
const OUT = path.resolve('qa-out');
fs.mkdirSync(OUT, { recursive: true });
const tag = (DEV + '-' + LANG).replace(/\W+/g, '-').toLowerCase();

const b = await chromium.launch();
const ctx = await b.newContext({ ...devices[DEV] });
await ctx.addInitScript(() => { try { localStorage.setItem('msp-age-ok', '1'); } catch (e) { /* ignore */ } });
const p = await ctx.newPage();
const errors = [];
p.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
p.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
const cdp = await ctx.newCDPSession(p);
const shot = (n) => p.screenshot({ path: path.join(OUT, `${tag}-${n}.png`) });

await p.goto(BASE + URLS[LANG], { waitUntil: 'networkidle' });
await p.waitForSelector('#sd[data-ready="1"]');
await shot('1-start');

await p.click('#sd-nick-btn');
await p.fill('#sdm-input', 'ab');
await p.click('#sdm-save');
const nickError = await p.textContent('#sdm-err');
await p.fill('#sdm-input', 'QA' + Math.floor(Math.random() * 1e6));
await p.click('#sdm-save');
await p.waitForSelector('#sdm', { state: 'hidden' });

await cdp.send('Emulation.setCPUThrottlingRate', { rate: RATE });
await p.click('#sd-play');
await p.waitForSelector('#sdx:not([hidden])');
await p.waitForTimeout(400);
await shot('2-play');
const box = await p.locator('#sdx-fg').boundingBox();
for (let i = 0; i < 4; i++) {
  await p.touchscreen.tap(box.x + box.width * (0.25 + 0.17 * i), box.y + box.height * 0.3);
  await p.waitForTimeout(500);
}

await p.evaluate(() => {
  window.__ft = [];
  MSP.ShishaDrop.js(true);
  let last = performance.now();
  const f = (t) => { window.__ft.push(t - last); last = t; if (!window.__stop) requestAnimationFrame(f); };
  requestAnimationFrame(f);
  let n = 0;
  window.__dropper = setInterval(() => {
    const s = MSP.ShishaDrop.state();
    if (s && s.state === 'play') MSP.ShishaDrop.drop(40 + ((n++ * 73) % 320));
  }, 460);
});
await p.waitForTimeout(22000);
const perf = await p.evaluate(() => {
  window.__stop = true;
  clearInterval(window.__dropper);
  const ft = window.__ft.slice(10);
  const s = ft.slice().sort((a, c) => a - c);
  const avg = ft.reduce((a, c) => a + c, 0) / ft.length;
  const q = (k) => +s[Math.floor(s.length * k)].toFixed(1);
  return { fps: +(1000 / avg).toFixed(1), p50: q(0.5), p95: q(0.95), p99: q(0.99), max: +s[s.length - 1].toFixed(1), over33ms: ft.filter((x) => x > 33.4).length, frames: ft.length, gameJsPerFrame: MSP.ShishaDrop.js(), game: MSP.ShishaDrop.state() };
});
await shot('3-mid');
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });

await p.evaluate(() => { const s = MSP.ShishaDrop.state(); if (s && s.state === 'play') MSP.ShishaDrop.end(); });
await p.waitForSelector('#sdx-end:not([hidden])', { timeout: 8000 });
await p.waitForTimeout(1500);
await shot('4-end');
const rankLine = await p.textContent('#sdx-rankline');

await p.click('#sdx-again');
for (let i = 0; i < 6; i++) { await p.evaluate((x) => MSP.ShishaDrop.drop(x), 60 + i * 50); await p.waitForTimeout(470); }
await p.waitForTimeout(2300);
await p.reload({ waitUntil: 'networkidle' });
await p.waitForTimeout(800);
const resumed = await p.evaluate(() => MSP.ShishaDrop.state());
const pausedAfterReload = await p.isVisible('#sdx-pausepanel');
await shot('5-resume');
await p.click('#sdx-quit');
await p.waitForSelector('#sdx', { state: 'hidden' });
const dailyLocked = await p.isDisabled('#sd-play');
await p.evaluate(() => document.getElementById('sd-board').scrollIntoView());
await p.waitForTimeout(400);
await shot('6-board');
await b.close();

const ok = !errors.length && pausedAfterReload && resumed && resumed.mode === 'practice' && dailyLocked && !!nickError;
console.log(JSON.stringify({ device: DEV, cpuSlowdown: RATE, lang: LANG, perf, nickError, rankLine, resumed, pausedAfterReload, dailyLocked, errors, ok }, null, 1));
process.exit(ok ? 0 : 1);
