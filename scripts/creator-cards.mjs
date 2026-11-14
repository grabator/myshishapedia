/*
 * Kartice miksova kreatora (JPG ili PNG 1080x1920, za story ili kraj videa; služi i kao og:image).
 *
 *   node scripts/creator-cards.mjs            sve kartice
 *   node scripts/creator-cards.mjs <id-miksa>  samo jedna
 *
 * Čita data/creators.js, slike uzima iz static/creators/<kreator>/ i tamo upiše kartica (polje `card`).
 * Treba Playwright sa Chromiumom.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const box = {}; box.window = box;
vm.createContext(box);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'data/creators.js'), 'utf8'), box);
const only = process.argv[2];

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = await import('playwright')); }

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dataUrl = (file) => {
  const ext = path.extname(file).slice(1).toLowerCase();
  return 'data:image/' + (ext === 'jpg' ? 'jpeg' : ext) + ';base64,' + fs.readFileSync(file).toString('base64');
};
const font = (f) => dataUrl(path.join(ROOT, 'static/fonts', f)).replace('image/woff2', 'font/woff2');

function bowl(parts) {
  let a0 = -Math.PI / 2, out = '';
  for (const p of parts) {
    const a1 = a0 + (p.pct / 100) * Math.PI * 2, large = a1 - a0 > Math.PI ? 1 : 0, r = 92;
    out += `<path d="M120 120L${(120 + r * Math.cos(a0)).toFixed(1)} ${(120 + r * Math.sin(a0)).toFixed(1)}A${r} ${r} 0 ${large} 1 ${(120 + r * Math.cos(a1)).toFixed(1)} ${(120 + r * Math.sin(a1)).toFixed(1)}Z" fill="${p.color}"/>`;
    a0 = a1;
  }
  return `<svg viewBox="0 0 240 240"><circle cx="120" cy="120" r="114" fill="#2a2523"/><circle cx="120" cy="120" r="104" fill="#1b1716"/>${out}<circle cx="120" cy="120" r="17" fill="#1b1716"/><circle cx="120" cy="120" r="9" fill="#000"/></svg>`;
}

function html(m, c) {
  const dir = path.join(ROOT, 'static/creators', c.id);
  const L = (v) => (v ? v.en || '' : '');
  const tiles = m.parts.map((p) => `
    <div class="tile" style="--sw:${p.color}">
      <div class="pct">${p.pct}<small>%</small></div>
      <div class="br">${esc(p.brand)}</div>
      <div class="fl">${esc(p.flavor)}</div>
      ${p.note ? `<div class="nt">${esc(L(p.note))}</div>` : ''}
    </div>`).join('');
  const bar = m.parts.map((p) => `<i style="flex:${p.pct};background:${p.color}"></i>`).join('');
  const glow = m.parts.slice(0, 3).map((p, k) => `radial-gradient(520px 420px at ${[15, 85, 50][k]}% ${[30, 40, 95][k]}%, ${p.color}33, transparent 70%)`).join(',');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Syne;src:url(${font('syne-latin-wght-5.3.woff2')}) format('woff2');font-weight:400 800}
@font-face{font-family:Manrope;src:url(${font('manrope-latin-wght-5.3.woff2')}) format('woff2');font-weight:200 800}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1920px;overflow:hidden;color:#f4ebdf;font-family:Manrope,sans-serif;background:${glow},#120d0a;position:relative}
.wrap{position:absolute;inset:0;padding:54px 56px 56px;display:flex;flex-direction:column}
.frame{position:relative;height:680px;flex:none;border-radius:56px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.6),0 0 0 2px rgba(244,235,223,.08)}
.frame .ph{position:absolute;inset:0;background:url(${dataUrl(path.join(dir, m.photo))}) center 42%/cover}
.frame:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.45),rgba(0,0,0,0) 26%,rgba(0,0,0,0) 70%,rgba(0,0,0,.35))}
.top{position:absolute;z-index:2;top:34px;left:34px;right:34px;display:flex;justify-content:space-between;align-items:center}
.logo{height:84px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.55);border:2px solid rgba(242,163,60,.55)}
.tag{padding:13px 24px;border-radius:999px;background:rgba(18,13,10,.72);backdrop-filter:blur(8px);border:2px solid rgba(244,235,223,.22);font-weight:800;font-size:24px;letter-spacing:.16em;text-transform:uppercase}
.bowl{position:absolute;z-index:3;right:34px;top:600px;width:200px;filter:drop-shadow(0 18px 30px rgba(0,0,0,.65))}
.bowl svg{display:block;width:100%}
.head{margin:54px 230px 0 8px}
.by{display:flex;align-items:center;gap:16px;color:#f2a33c;font-weight:800;font-size:26px;letter-spacing:.18em;text-transform:uppercase}
.by:before{content:'';width:46px;height:3px;border-radius:3px;background:#f2a33c}
h1{font-family:Syne,sans-serif;font-weight:800;font-size:88px;line-height:.98;letter-spacing:-.025em;margin-top:16px}
.mixbar{display:flex;gap:6px;height:14px;margin:38px 8px 0;flex:none}
.mixbar i{display:block;border-radius:99px}
.tiles{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:30px}
.tile{position:relative;overflow:hidden;padding:22px 26px;border-radius:32px;background:linear-gradient(150deg,color-mix(in srgb,var(--sw) 22%,#1f1916),#1a1512 70%);border:2px solid color-mix(in srgb,var(--sw) 40%,transparent)}
.tile:after{content:'';position:absolute;right:-50px;top:-50px;width:150px;height:150px;border-radius:50%;background:var(--sw);opacity:.18;filter:blur(10px)}
.pct{font-family:Syne,sans-serif;font-weight:800;font-size:58px;line-height:1;letter-spacing:-.04em;color:var(--sw)}
.pct small{font-size:38px;margin-left:2px}
.br{margin-top:12px;color:#b9ad9f;font-weight:800;font-size:21px;letter-spacing:.16em;text-transform:uppercase}
.fl{margin-top:4px;font-weight:800;font-size:35px;line-height:1.15}
.nt{margin-top:6px;color:#b9ad9f;font-size:24px;font-weight:600}
.chips{display:flex;flex-wrap:wrap;gap:12px;margin-top:24px}
.chip{display:inline-flex;align-items:center;gap:12px;padding:14px 22px;border-radius:999px;background:rgba(244,235,223,.06);border:2px solid rgba(244,235,223,.14);font-size:25px;color:#c9bdaf;font-weight:600}
.chip b{color:#f4ebdf;font-weight:800}
.chip svg{width:26px;height:26px;color:#f2a33c}
.foot{margin-top:auto;flex:none;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:28px 34px;border-radius:36px;background:linear-gradient(120deg,rgba(242,163,60,.16),rgba(217,100,63,.10));border:2px solid rgba(242,163,60,.35)}
.cta small{display:block;color:#d9c9b6;font-size:22px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;margin-bottom:6px}
.site{font-family:Syne,sans-serif;font-weight:800;font-size:36px;letter-spacing:-.03em;line-height:1}
.site span{color:#f2a33c}
.ig{display:flex;flex-direction:column;align-items:center;gap:8px;padding-left:26px;border-left:2px solid rgba(242,163,60,.3);font-weight:800;font-size:21px;color:#e9dccd;text-align:center;white-space:nowrap}
.ig svg{width:40px;height:40px;color:#f2a33c}
</style></head><body>
<div class="wrap">
  <div class="frame"><div class="ph"></div>
    <div class="top">${c.logo ? `<img class="logo" src="${dataUrl(path.join(dir, c.logo))}">` : '<span></span>'}<span class="tag">Hookah mix</span></div>
  </div>
  <div class="bowl">${bowl(m.parts)}</div>
  <div class="head"><p class="by">Mix by ${esc(c.name)}</p><h1>${esc(m.name)}</h1></div>
  <div class="mixbar">${bar}</div>
  <div class="tiles">${tiles}</div>
  <div class="chips">
    ${m.bowl ? `<span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9h16l-2 8a3 3 0 0 1-3 2H9a3 3 0 0 1-3-2z"/><path d="M8 9V6M12 9V4M16 9V6"/></svg>Bowl <b>${esc(m.bowl)}</b></span>` : ''}
    ${m.packing ? `<span class="chip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 15c3 0 3-4 6-4s3 4 6 4 3-4 6-4"/><path d="M3 20c3 0 3-4 6-4s3 4 6 4 3-4 6-4"/></svg>Packing tip on the site</span>` : ''}
  </div>
  <div class="foot">
    <div class="cta"><small>Full recipe</small><div class="site">my<span>shisha</span>pedia.com</div></div>
    <div class="ig"><svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/></svg>@${esc(c.instagram)}</div>
  </div>
</div>
</body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
let n = 0;
for (const m of box.CREATOR_MIXES) {
  if (only && m.id !== only) continue;
  const c = box.CREATORS.find((x) => x.id === m.creator);
  if (!m.card || !m.photo) continue;
  await page.setContent(html(m, c), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(ROOT, 'static/creators', c.id, m.card);
  await page.screenshot(out.endsWith('.png') ? { path: out, type: 'png' } : { path: out, type: 'jpeg', quality: 88 });
  console.log('kartica:', path.relative(ROOT, out));
  n++;
}
await browser.close();
if (!n) console.log('nema kartica za izradu');
