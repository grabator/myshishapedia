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
  const parts = m.parts.map((p) => `
    <li style="--sw:${p.color}">
      <b>${p.pct}%</b>
      <span class="t"><span class="br">${esc(p.brand)}</span><span class="fl">${esc(p.flavor)}</span><i style="width:${p.pct}%"></i></span>
    </li>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Syne;src:url(${font('syne-latin-wght-5.3.woff2')}) format('woff2');font-weight:400 800}
@font-face{font-family:Manrope;src:url(${font('manrope-latin-wght-5.3.woff2')}) format('woff2');font-weight:200 800}
*{box-sizing:border-box;margin:0;padding:0}
body{width:1080px;height:1920px;overflow:hidden;background:#140f0c;color:#f4ebdf;font-family:Manrope,sans-serif}
.photo{position:absolute;inset:0 0 auto 0;height:900px;background:url(${dataUrl(path.join(dir, m.photo))}) center 40%/cover}
.photo:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,15,12,.55) 0,rgba(20,15,12,0) 22%,rgba(20,15,12,0) 55%,#140f0c 100%)}
.top{position:absolute;top:70px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:center}
.logo{height:92px;border-radius:999px;box-shadow:0 10px 30px rgba(0,0,0,.5)}
.tag{padding:14px 26px;border-radius:999px;background:rgba(20,15,12,.7);border:2px solid rgba(244,235,223,.25);font-weight:800;font-size:28px;letter-spacing:.14em;text-transform:uppercase}
.main{position:absolute;left:70px;right:70px;top:740px}
.by{color:#f2a33c;font-weight:800;font-size:30px;letter-spacing:.16em;text-transform:uppercase}
h1{font-family:Syne,sans-serif;font-weight:800;font-size:92px;line-height:1;margin:14px 230px 40px 0;letter-spacing:-.02em}
ul{list-style:none;display:grid;gap:16px}
li{display:grid;grid-template-columns:160px 1fr;column-gap:22px;align-items:center;padding:18px 28px;border-radius:28px;background:#1f1a17;border-left:12px solid var(--sw)}
li b{font-family:Syne,sans-serif;font-weight:800;font-size:50px;letter-spacing:-.03em;color:var(--sw)}
.t{display:grid}
.br{color:#b4aa9e;font-weight:800;font-size:24px;letter-spacing:.14em;text-transform:uppercase}
.fl{font-weight:800;font-size:38px;line-height:1.2}
li i{display:block;height:8px;border-radius:9px;background:var(--sw);margin-top:12px}
.bowl{position:absolute;right:70px;top:770px;width:200px;filter:drop-shadow(0 16px 26px rgba(0,0,0,.6))}
.bowl svg{width:100%;display:block}
.meta{margin-top:28px;font-size:30px;color:#b4aa9e}
.meta b{color:#f4ebdf}
.foot{position:absolute;left:70px;right:70px;bottom:70px;display:flex;justify-content:space-between;align-items:center;border-top:2px solid rgba(244,235,223,.18);padding-top:34px}
.site{font-family:Syne,sans-serif;font-weight:800;font-size:34px;letter-spacing:-.02em}
.site span{color:#f2a33c}
.ig{font-weight:800;font-size:28px;color:#b4aa9e}
</style></head><body>
<div class="photo"></div>
<div class="top">${c.logo ? `<img class="logo" src="${dataUrl(path.join(dir, c.logo))}">` : '<span></span>'}<span class="tag">Hookah mix</span></div>
<div class="bowl">${bowl(m.parts)}</div>
<div class="main">
  <p class="by">Mix by ${esc(c.name)}</p>
  <h1>${esc(m.name)}</h1>
  <ul>${parts}</ul>
  ${m.bowl ? `<p class="meta">Bowl: <b>${esc(m.bowl)}</b></p>` : ''}
</div>
<div class="foot"><span class="site">my<span>shisha</span>pedia.com</span><span class="ig">@${esc(c.instagram)}</span></div>
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
