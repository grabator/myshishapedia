/*
 * MyShishapedia - Bowl Studio: 3D sto (Three.js). Pakuje se u js/studio3d.js (ES modul), a učitava ga js/studio.js
 * tek kad posjetilac otvori studio.
 *
 *   mount(host, opts) -> api
 *     opts: { modelUrl, reduced, onPick(id), onReady(), onError(kind) }
 *     api:  step(name, data)   rasporedi sto i pomjeri kameru za korak (intro, bowl, flavor, ...)
 *           insets({top,bottom,left,right})   dio ekrana koji pokrivaju natpisi i panel (u CSS px)
 *           destroy()           ugasi sve i oslobodi memoriju (WebGL kontekst, teksture, geometrije)
 *
 * Brzina: crta se samo dok se nešto pomjera (inače nijedan kadar), kvalitet (gustina piksela, sjene, broj
 * vlakana duhana, veličina tekstura) se bira po uređaju i spusti se sam ako kadrovi kasne; skriven tab ne crta.
 * Sve teksture (drvo, limenka, folija, ugalj) se crtaju u kodu, osim teksture egipatske glave iz modela.
 *
 * Model egipatske glave: "Serp hookah bowl", matvey.kyl (Sketchfab), CC BY 4.0.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/* ------------------------------------------------------------------ */
/* Pomoćne                                                             */
/* ------------------------------------------------------------------ */

function rnd(seed) { let s = (seed >>> 0) % 2147483647 || 1; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; }
function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const eo = (x) => 1 - Math.pow(1 - x, 3);
const lerp = (a, b, t) => a + (b - a) * t;

// nivo kvaliteta: 0 slab telefon, 1 telefon/tablet, 2 računar
function pickTier() {
  const mem = navigator.deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (mem <= 2 || cores <= 3) return 0;
  if (coarse) return cores <= 4 ? 0 : 1;
  return 2;
}

/* ------------------------------------------------------------------ */
/* Teksture (canvas)                                                   */
/* ------------------------------------------------------------------ */

const WISPS = ['M7 20.5c-2.2-3 2.2-4.5 0-7.5s1.5-5 1.5-5', 'M12 21.5c-2.3-3.4 2.6-4.9.4-8.3s1.5-5.6 1.5-5.6', 'M17 20c-1.9-2.6 1.9-3.8 0-6.4s1.1-4.1 1.1-4.1'];
const WISP_COLORS = ['#f2a33c', '#d6ad6e', '#9a6a2e'];

function makeCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function canvasTex(c, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function drawMark(x, cx, cy, size) {
  x.save(); x.translate(cx - size / 2, cy - size / 2); x.scale(size / 24, size / 24); x.lineCap = 'round'; x.lineWidth = 2.1;
  WISPS.forEach((d, i) => { x.strokeStyle = WISP_COLORS[i]; x.stroke(new Path2D(d)); });
  x.restore();
}
function drawWord(x, sx, cy, px, center) {
  const parts = [['my', 400, '#f4ebdf'], ['shisha', 800, '#f2a33c'], ['pedia', 400, '#f4ebdf']];
  x.save(); x.textBaseline = 'middle'; x.textAlign = 'left';
  let w = 0;
  parts.forEach((p) => { x.font = p[1] + ' ' + px + 'px Syne, sans-serif'; w += x.measureText(p[0]).width; });
  let at = center ? sx - w / 2 : sx;
  parts.forEach((p) => { x.font = p[1] + ' ' + px + 'px Syne, sans-serif'; x.fillStyle = p[2]; x.fillText(p[0], at, cy); at += x.measureText(p[0]).width; });
  x.restore();
}
function grain(x, W, H, n, a, seed) { const r = rnd(seed); for (let i = 0; i < n; i++) { x.fillStyle = 'rgba(255,255,255,' + (r() * a).toFixed(3) + ')'; x.fillRect(r() * W, r() * H, 1.5, 1.5); } }
// tekst koji ne smije biti širi od max (smanji font)
function fitFont(x, text, weight, px, family, max) {
  let size = px;
  x.font = weight + ' ' + size + 'px ' + family;
  while (size > 10 && x.measureText(text).width > max) { size -= 2; x.font = weight + ' ' + size + 'px ' + family; }
  return size;
}

function woodTexture(size) {
  const c = makeCanvas(size, size), x = c.getContext('2d'), W = size, H = size, k = size / 2048, r = rnd(5);
  x.fillStyle = '#2a1a12'; x.fillRect(0, 0, W, H);
  for (let i = 0; i < 900 * k; i++) {
    const y = r() * H, a = 0.04 + r() * 0.1;
    x.strokeStyle = r() < 0.5 ? 'rgba(12,6,3,' + a + ')' : 'rgba(110,70,40,' + a * 0.7 + ')';
    x.lineWidth = (0.6 + r() * 3) * k; x.beginPath(); x.moveTo(0, y);
    for (let xx = 0; xx <= W; xx += 64 * k) x.lineTo(xx, y + Math.sin(xx / (300 * k) + i) * 6 * k + Math.sin(xx / (77 * k) + i * 3) * 2 * k);
    x.stroke();
  }
  for (let q = 0; q < 5; q++) {
    const cx = r() * W, cy = r() * H;
    for (let j = 0; j < 26; j++) { x.strokeStyle = 'rgba(10,5,2,0.06)'; x.lineWidth = 1.5 * k; x.beginPath(); x.ellipse(cx, cy, (30 + j * 9) * k, (8 + j * 3) * k, 0, 0, 7); x.stroke(); }
  }
  for (let y = 0; y < H; y += 340 * k) { x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(0, y, W, 3 * k); x.fillStyle = 'rgba(255,220,180,.04)'; x.fillRect(0, y + 3 * k, W, 2 * k); }
  const t = canvasTex(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3);
  return t;
}

function labelTexture(f, big) {
  const W = big ? 2048 : 1024, H = W / 8, k = W / 2048;
  const c = makeCanvas(W, H), x = c.getContext('2d');
  x.fillStyle = '#16100c'; x.fillRect(0, 0, W, H); grain(x, W, H, 9000 * k, 0.05, 3);
  x.fillStyle = '#f2a33c'; x.fillRect(0, 0, W, 16 * k); x.fillRect(0, H - 16 * k, W, 16 * k);
  x.fillStyle = f.accent; x.fillRect(0, 16 * k, W, 5 * k); x.fillRect(0, H - 21 * k, W, 5 * k);
  const name = f.name.toUpperCase();
  for (let i = 0; i < 2; i++) {
    const o = i * W / 2;
    drawMark(x, o + 92 * k, H / 2, 120 * k);
    x.textBaseline = 'middle'; x.fillStyle = '#f4ebdf';
    fitFont(x, name, 800, 84 * k, 'Syne, sans-serif', 440 * k);
    x.fillText(name, o + 170 * k, H / 2 - 12 * k);
    x.font = '700 ' + 30 * k + 'px Manrope, sans-serif'; x.fillStyle = '#b4aa9e';
    x.fillText(f.brand.toUpperCase() + '  ·  50 G', o + 174 * k, H / 2 + 50 * k);
    drawWord(x, o + 660 * k, H / 2, 36 * k);
  }
  const t = canvasTex(c); t.wrapS = THREE.RepeatWrapping;
  return t;
}

function lidTexture(f, big) {
  const W = big ? 1024 : 512, k = W / 1024;
  const c = makeCanvas(W, W), x = c.getContext('2d');
  const g = x.createRadialGradient(W / 2, W * 0.4, 0, W / 2, W / 2, W / 2); g.addColorStop(0, '#2a1f18'); g.addColorStop(1, '#120c09');
  x.fillStyle = g; x.fillRect(0, 0, W, W); grain(x, W, W, 12000 * k, 0.05, 4);
  x.strokeStyle = '#f2a33c'; x.lineWidth = 16 * k; x.beginPath(); x.arc(W / 2, W / 2, W / 2 - 40 * k, 0, 7); x.stroke();
  x.strokeStyle = f.accent; x.lineWidth = 6 * k; x.beginPath(); x.arc(W / 2, W / 2, W / 2 - 66 * k, 0, 7); x.stroke();
  drawMark(x, W / 2, W / 2 - 150 * k, 230 * k);
  const name = f.name.toUpperCase();
  x.fillStyle = '#f4ebdf'; x.textAlign = 'center'; x.textBaseline = 'middle';
  fitFont(x, name, 800, 104 * k, 'Syne, sans-serif', 700 * k);
  x.fillText(name, W / 2, W / 2 + 40 * k);
  x.font = '700 ' + 40 * k + 'px Manrope, sans-serif'; x.fillStyle = '#b4aa9e'; x.fillText(f.brand.toUpperCase(), W / 2, W / 2 + 130 * k);
  drawWord(x, W / 2, W / 2 + 250 * k, 54 * k, true);
  const t = canvasTex(c); t.center.set(0.5, 0.5);
  return t;
}

function clayTexture(base, seed) {
  const c = makeCanvas(512, 512), x = c.getContext('2d'), r = rnd(seed);
  x.fillStyle = base; x.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 10000; i++) { x.fillStyle = 'rgba(' + (r() < 0.5 ? '255,240,220' : '0,0,0') + ',' + (r() * 0.07).toFixed(3) + ')'; x.fillRect(r() * 512, r() * 512, 2, 2); }
  for (let y = 0; y < 512; y += 3) { x.fillStyle = 'rgba(0,0,0,' + (0.02 + r() * 0.03).toFixed(3) + ')'; x.fillRect(0, y, 512, 1); }
  return canvasTex(c);
}

function foilTextures(size) {
  const r1 = rnd(9), r2 = rnd(3);
  const rc = makeCanvas(size, size), rx = rc.getContext('2d'), k = size / 1024;
  rx.fillStyle = '#808080'; rx.fillRect(0, 0, size, size);
  for (let i = 0; i < 500; i++) {
    const cx = r1() * size, cy = r1() * size, a = r1() * Math.PI, l = (40 + r1() * 220) * k;
    rx.strokeStyle = r1() < 0.5 ? 'rgba(255,255,255,' + r1() * 0.18 + ')' : 'rgba(0,0,0,' + r1() * 0.18 + ')';
    rx.lineWidth = (2 + r1() * 7) * k; rx.beginPath(); rx.moveTo(cx, cy); rx.lineTo(cx + Math.cos(a) * l, cy + Math.sin(a) * l); rx.stroke();
  }
  const mc = makeCanvas(size, size), mx = mc.getContext('2d');
  mx.fillStyle = '#c9c9cf'; mx.fillRect(0, 0, size, size);
  for (let i = 0; i < 120; i++) {
    const cx = r2() * size, cy = r2() * size, a = r2() * Math.PI, l = (40 + r2() * 200) * k;
    mx.strokeStyle = 'rgba(' + (r2() < 0.5 ? 235 : 150) + ',' + (r2() < 0.5 ? 235 : 150) + ',' + (r2() < 0.5 ? 240 : 155) + ',' + (0.08 + r2() * 0.1) + ')';
    mx.lineWidth = (2 + r2() * 6) * k; mx.beginPath(); mx.moveTo(cx, cy); mx.lineTo(cx + Math.cos(a) * l, cy + Math.sin(a) * l); mx.stroke();
  }
  return { map: canvasTex(mc), rough: canvasTex(rc, false) };
}

function coalTextures() {
  const r = rnd(7);
  const bc = makeCanvas(256, 256), b = bc.getContext('2d');
  b.fillStyle = '#6b6560'; b.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 3000; i++) { b.fillStyle = 'rgba(' + (r() < 0.5 ? '200,190,180' : '0,0,0') + ',' + r() * 0.18 + ')'; b.fillRect(r() * 256, r() * 256, 2, 2); }
  const ec = makeCanvas(256, 256), e = ec.getContext('2d');
  e.fillStyle = '#000'; e.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 14; i++) {
    let px = r() * 256, py = r() * 256;
    e.strokeStyle = 'rgba(255,' + (70 + r() * 60 | 0) + ',10,' + (0.6 + r() * 0.4) + ')'; e.lineWidth = 1 + r() * 2; e.beginPath(); e.moveTo(px, py);
    for (let s = 0; s < 6; s++) { px += (r() - 0.5) * 30; py += (r() - 0.5) * 30; e.lineTo(px, py); }
    e.stroke();
  }
  const g = e.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(255,80,10,0)'); g.addColorStop(0.75, 'rgba(255,80,10,0)'); g.addColorStop(1, 'rgba(255,90,15,.9)');
  e.fillStyle = g; e.fillRect(0, 0, 256, 256);
  return { map: canvasTex(bc), glow: canvasTex(ec) };
}

function radialTexture(stops) {
  const c = makeCanvas(128, 128), x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  stops.forEach((s) => g.addColorStop(s[0], s[1]));
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  return canvasTex(c);
}

/* ------------------------------------------------------------------ */
/* Duhan: savijene trakice isječenog lista                             */
/* ------------------------------------------------------------------ */

const LEAF = {
  light: [0x5e3418, 0x6b3c1c, 0x7a4622, 0x4f2c14, 0x855026, 0x623618, 0x70401f, 0x563016],
  dark: [0x2a170c, 0x33200f, 0x3d2612, 0x24140a, 0x45301a, 0x2e1b0d, 0x38220f, 0x20120a]
};

function ribbon(L, w, bend, twist) {
  const g = new THREE.PlaneGeometry(L, w, 8, 1), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), t = x / L, a = t * twist;
    p.setXYZ(i, x, y * Math.cos(a), Math.sin(t * Math.PI * 1.4) * bend + y * Math.sin(a));
  }
  g.computeVertexNormals();
  return g;
}

/* ------------------------------------------------------------------ */
/* mount                                                               */
/* ------------------------------------------------------------------ */

export function mount(host, opts) {
  opts = opts || {};
  const tier = pickTier();
  const reduced = !!opts.reduced;
  const disposables = new Set();
  const own = (o) => { disposables.add(o); return o; };

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', alpha: false });
  } catch (e) {
    if (opts.onError) opts.onError('webgl');
    return { step() {}, insets() {}, destroy() {} };
  }
  let dprCap = [1, 1.5, 2][tier];
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = tier > 0;
  renderer.shadowMap.type = tier === 2 ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.className = 'bs-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0d0907);
  scene.fog = new THREE.Fog(0x0d0907, 70, 170);
  const pm = new THREE.PMREMGenerator(renderer);
  const envTex = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  pm.dispose();
  own(envTex);
  scene.environment = envTex;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 400);

  // svjetla: toplo glavno, mekše sa druge strane, hladnije pozadi
  const key = new THREE.SpotLight(0xffd2a0, 1400, 0, 0.95, 0.7, 1.6);
  key.position.set(-16, 40, 20); key.target.position.set(0, 2, 0);
  if (tier > 0) { key.castShadow = true; key.shadow.mapSize.set(tier === 2 ? 2048 : 1024, tier === 2 ? 2048 : 1024); key.shadow.bias = -0.0004; key.shadow.radius = 5; key.shadow.camera.near = 20; key.shadow.camera.far = 90; }
  const fillLight = new THREE.SpotLight(0xffe6c8, 500, 0, 0.9, 0.8, 1.6); fillLight.position.set(20, 36, -10);
  const rim = new THREE.DirectionalLight(0xc8b8ff, 0.45); rim.position.set(18, 10, -20);
  scene.add(key, key.target, fillLight, rim, new THREE.AmbientLight(0x3a2a40, 0.5));

  // sto
  const wood = own(woodTexture(tier === 0 ? 1024 : 2048));
  const table = new THREE.Mesh(own(new THREE.PlaneGeometry(220, 220)), own(new THREE.MeshStandardMaterial({ map: wood, roughness: 0.55 })));
  table.rotation.x = -Math.PI / 2; table.receiveShadow = true;
  scene.add(table);

  // meka sjena ispod predmeta (na svim uređajima; na slabim je jedina sjena)
  const blobTex = own(radialTexture([[0, 'rgba(0,0,0,0.75)'], [0.55, 'rgba(0,0,0,0.35)'], [1, 'rgba(0,0,0,0)']]));
  const blobMat = own(new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, opacity: tier > 0 ? 0.45 : 0.85 }));
  const blobGeo = own(new THREE.PlaneGeometry(1, 1));
  function blob(group, r) {
    const m = new THREE.Mesh(blobGeo, blobMat);
    m.rotation.x = -Math.PI / 2; m.position.y = 0.03; m.scale.set(r * 2, r * 2, 1); m.renderOrder = 1;
    group.add(m);
    return m;
  }
  const glowTex = own(radialTexture([[0, 'rgba(255,140,60,0.9)'], [1, 'rgba(0,0,0,0)']]));
  function glowSprite(color, size, opacity) {
    const s = new THREE.Sprite(own(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity })));
    s.scale.set(size, size, 1);
    return s;
  }
  function shadowy(o) { o.traverse((m) => { if (m.isMesh && m.material !== blobMat) { m.castShadow = tier > 0; m.receiveShadow = tier > 0; } }); return o; }
  function lathe(pts, mat, seg) {
    return new THREE.Mesh(own(new THREE.LatheGeometry(pts.map((p) => new THREE.Vector2(p[0], p[1])), seg || 72)), mat);
  }

  /* ---------------- glave ---------------- */

  const bowls = {};
  function phunnelBowl() {
    const mat = own(new THREE.MeshPhysicalMaterial({ map: own(clayTexture('#7a3a22', 3)), roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.25, side: THREE.DoubleSide }));
    const G = new THREE.Group();
    G.add(lathe([[0.3, 0], [1.35, 0], [1.4, 1.9], [2.3, 2.5], [3.5, 4.6], [4.15, 7.6], [4.35, 8.55], [4.3, 8.7], [3.8, 8.7], [3.6, 7.9], [3.0, 6.6], [2.0, 6.1], [1.1, 6.0], [0.85, 6.15], [0.55, 7.9], [0.5, 8.05], [0.28, 8.05], [0.28, 0.5]], mat, 96));
    const hm = own(new THREE.MeshBasicMaterial({ color: 0x080402 })), hg = own(new THREE.CircleGeometry(0.16, 12));
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4, h = new THREE.Mesh(hg, hm); h.position.set(Math.cos(a) * 0.7, 7.25, Math.sin(a) * 0.7); h.lookAt(Math.cos(a) * 3, 7.5, Math.sin(a) * 3); G.add(h); }
    G.userData = { rimY: 8.7, rimR: 4.3, floorY: 6.05 };
    return G;
  }
  function siliconeBowl() {
    const G = new THREE.Group();
    G.add(lathe([[0.3, 0], [1.6, 0], [1.6, 2.2], [2.6, 2.6], [4.0, 5.6], [4.4, 8.3], [4.25, 8.7], [3.7, 8.7], [3.55, 7.6], [3.35, 6.55], [0.4, 6.25], [0.3, 6.25]],
      own(new THREE.MeshPhysicalMaterial({ color: 0x34343c, roughness: 0.55, sheen: 0.6, sheenColor: new THREE.Color(0x553333), side: THREE.DoubleSide })), 96));
    const plate = new THREE.Mesh(own(new THREE.CylinderGeometry(3.3, 3.3, 0.12, 48)), own(new THREE.MeshStandardMaterial({ color: 0xd0d0d4, metalness: 1, roughness: 0.22 })));
    plate.position.y = 6.38; G.add(plate);
    const hm = own(new THREE.MeshBasicMaterial({ color: 0x050505 })), hg = own(new THREE.CircleGeometry(0.32, 16));
    for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2, h = new THREE.Mesh(hg, hm); h.rotation.x = -Math.PI / 2; h.position.set(k ? Math.cos(a) * 1.6 : 0, 6.45, k ? Math.sin(a) * 1.6 : 0); G.add(h); }
    const band = new THREE.Mesh(own(new THREE.TorusGeometry(4.05, 0.09, 8, 72)), own(new THREE.MeshStandardMaterial({ color: 0xf2a33c, roughness: 0.5 })));
    band.rotation.x = Math.PI / 2; band.position.y = 7.2; G.add(band);
    G.userData = { rimY: 8.7, rimR: 4.2, floorY: 6.45 };
    return G;
  }
  function egyptBowl(gltf) {
    const model = gltf.scene, G = new THREE.Group();
    model.traverse((o) => { if (o.isMesh) { o.material.roughness = 0.85; own(o.geometry); own(o.material); if (o.material.map) own(o.material.map); } });
    const box = new THREE.Box3().setFromObject(model), s = box.getSize(new THREE.Vector3());
    model.scale.setScalar(8.7 / s.y);
    const b2 = new THREE.Box3().setFromObject(model), c2 = b2.getCenter(new THREE.Vector3());
    model.position.set(-c2.x, -b2.min.y, -c2.z);
    G.add(model);
    G.userData = { rimY: b2.max.y - b2.min.y, rimR: (b2.max.x - b2.min.x) / 2, floorY: 4.6 };
    return G;
  }

  /* ---------------- pribor ---------------- */

  const props = new THREE.Group();
  scene.add(props);
  function mixDish() {
    const G = new THREE.Group();
    G.add(lathe([[0, 0.05], [3.2, 0], [3.4, 0.3], [5.6, 2.2], [6.0, 2.6], [5.85, 2.65], [5.3, 2.3], [3.0, 0.6], [0, 0.55]], own(new THREE.MeshPhysicalMaterial({ color: 0xe9e2d6, roughness: 0.2, clearcoat: 1, side: THREE.DoubleSide }))));
    const r = new THREE.Mesh(own(new THREE.TorusGeometry(5.93, 0.05, 8, 72)), own(new THREE.MeshStandardMaterial({ color: 0xf2a33c, metalness: 0.6, roughness: 0.3 })));
    r.rotation.x = Math.PI / 2; r.position.y = 2.63; G.add(r);
    blob(G, 6.5);
    return G;
  }
  const foilTex = foilTextures(tier === 0 ? 512 : 1024);
  own(foilTex.map); own(foilTex.rough);
  const foilMat = own(new THREE.MeshStandardMaterial({ map: foilTex.map, bumpMap: foilTex.rough, bumpScale: 0.25, metalness: 0.8, roughness: 0.36, envMapIntensity: 1.6, side: THREE.DoubleSide }));
  function foilRoll() {
    const G = new THREE.Group();
    const roll = new THREE.Mesh(own(new THREE.CylinderGeometry(1.6, 1.6, 13, 40)), foilMat); roll.rotation.z = Math.PI / 2; roll.position.y = 1.6; G.add(roll);
    const core = new THREE.Mesh(own(new THREE.CylinderGeometry(0.75, 0.75, 13.05, 24)), own(new THREE.MeshStandardMaterial({ color: 0x8a6a48, roughness: 0.9 }))); core.rotation.z = Math.PI / 2; core.position.y = 1.6; G.add(core);
    const sheet = new THREE.Mesh(own(new THREE.PlaneGeometry(13, 5)), foilMat); sheet.rotation.x = -Math.PI / 2; sheet.position.set(0, 0.04, 2.6); G.add(sheet);
    blob(G, 6);
    return G;
  }
  const steel = own(new THREE.MeshStandardMaterial({ color: 0xcfd0d6, metalness: 1, roughness: 0.24, side: THREE.DoubleSide }));
  function hmd() {
    const G = new THREE.Group();
    const vc = makeCanvas(1024, 128), vx = vc.getContext('2d');
    vx.fillStyle = '#bdbcc2'; vx.fillRect(0, 0, 1024, 128); vx.fillStyle = '#120a06';
    for (let k = 0; k < 8; k++) { const cx = (k + 0.5) * 128; vx.beginPath(); vx.roundRect(cx - 23, 36, 46, 56, 14); vx.fill(); }
    const vt = own(canvasTex(vc)); vt.wrapS = THREE.RepeatWrapping;
    const body = new THREE.Mesh(own(new THREE.CylinderGeometry(4.5, 4.7, 1.5, 72, 1, true)), own(new THREE.MeshStandardMaterial({ map: vt, metalness: 1, roughness: 0.28, side: THREE.DoubleSide })));
    body.position.y = 0.75; G.add(body);
    const cap = new THREE.Group();
    cap.add(lathe([[4.75, 0], [4.75, 0.9], [4.4, 1.4], [2.4, 2.3], [1.0, 2.55], [0, 2.6]], steel));
    const knob = lathe([[0, 0], [0.9, 0], [1.1, 0.4], [0.9, 1.0], [0, 1.1]], own(new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.5 }))); knob.position.y = 2.55; cap.add(knob);
    const vm = own(new THREE.MeshBasicMaterial({ color: 0x0a0503 })), vg = own(new THREE.PlaneGeometry(1.2, 0.28));
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2, v = new THREE.Mesh(vg, vm); v.position.set(Math.cos(a) * 3.2, 1.96, Math.sin(a) * 3.2); v.rotation.order = 'YXZ'; v.rotation.set(-1.1, -a + Math.PI / 2, 0); cap.add(v); }
    cap.position.y = 1.5; G.add(cap);
    blob(G, 5.4);
    return G;
  }
  const coalTex = coalTextures(); own(coalTex.map); own(coalTex.glow);
  const coalMat = own(new THREE.MeshStandardMaterial({ map: coalTex.map, emissiveMap: coalTex.glow, emissive: 0xff6a1a, emissiveIntensity: 2.2, roughness: 0.97, envMapIntensity: 0.3 }));
  const coalGeo = own(new RoundedBoxGeometry(2.2, 2.2, 2.2, 2, 0.22));
  function burner() {
    const G = new THREE.Group();
    const body = new THREE.Mesh(own(new RoundedBoxGeometry(14, 2.6, 11, 3, 0.5)), own(new THREE.MeshStandardMaterial({ color: 0x151515, roughness: 0.5, metalness: 0.4 }))); body.position.y = 1.3; G.add(body);
    const plate = new THREE.Mesh(own(new THREE.CylinderGeometry(4.4, 4.4, 0.2, 48)), own(new THREE.MeshStandardMaterial({ color: 0x2a2622, metalness: 0.6, roughness: 0.6, emissive: 0xff4a10, emissiveIntensity: 0.35 }))); plate.position.y = 2.7; G.add(plate);
    [[-1.6, -1.2], [1.4, -1.4], [0, 1.5], [2.2, 1.2], [-2.4, 1.0]].forEach((p, i) => { const c = new THREE.Mesh(coalGeo, coalMat); c.position.set(p[0], 3.95, p[1]); c.rotation.y = i; G.add(c); });
    const gl = glowSprite(0xff7a30, 14, 0.5); gl.position.set(0, 5, 0); G.add(gl);
    const pl = new THREE.PointLight(0xff6a20, 60, 26, 1.8); pl.position.set(0, 7, 0); G.add(pl);
    blob(G, 9);
    return G;
  }
  function tongs() {
    const G = new THREE.Group(), st = own(new THREE.MeshStandardMaterial({ color: 0xb8b8be, metalness: 1, roughness: 0.3 }));
    const ag = own(new THREE.BoxGeometry(0.28, 0.12, 15)), tg = own(new THREE.BoxGeometry(0.2, 0.9, 1.1));
    [-1, 1].forEach((s) => {
      const arm = new THREE.Mesh(ag, st); arm.position.set(s * 0.75, 0, -7.5); arm.rotation.y = s * 0.055; G.add(arm);
      const tip = new THREE.Mesh(tg, st); tip.position.set(s * 1.15, -0.3, -14.7); G.add(tip);
    });
    const grip = new THREE.Mesh(own(new THREE.CylinderGeometry(0.42, 0.42, 4.5, 12)), own(new THREE.MeshStandardMaterial({ color: 0x1a1410, roughness: 0.6 })));
    grip.rotation.x = Math.PI / 2; grip.position.set(0, 0, -1.8); grip.scale.x = 2.6; G.add(grip);
    return G;
  }
  function toothpick() {
    return new THREE.Mesh(own(new THREE.CylinderGeometry(0.07, 0.07, 8, 6)), own(new THREE.MeshStandardMaterial({ color: 0xd8b98a, roughness: 0.8 })));
  }

  const P = {
    dish: mixDish(), roll: foilRoll(), hmd: hmd(), burner: burner(), tongs: tongs(), pick: toothpick()
  };
  P.dish.position.set(-10, 0, 1);
  P.roll.position.set(-7, 0, 10.5); P.roll.rotation.y = 0.25;
  P.hmd.position.set(8.5, 0, 10.5);
  P.burner.position.set(0, 0, -21);
  P.tongs.position.set(3.5, 0.2, 21.5); P.tongs.rotation.y = 0.08;
  P.pick.position.set(-5.5, 0.1, 15.5); P.pick.rotation.set(Math.PI / 2, 0, 1.2);
  Object.values(P).forEach((o) => props.add(shadowy(o)));

  /* ---------------- duhan i limenke ---------------- */

  const ribbons = [];
  for (let v = 0; v < 8; v++) ribbons.push(own(ribbon(0.55 + v * 0.12, 0.1 + (v % 3) * 0.04, 0.1 + (v % 4) * 0.05, (v % 2 ? 1 : -1) * (1.2 + v * 0.3))));
  const leafMats = {};
  function leafMat(leaf, v) {
    const k = leaf + v;
    if (!leafMats[k]) leafMats[k] = own(new THREE.MeshPhysicalMaterial({ color: LEAF[leaf][v], roughness: leaf === 'dark' ? 0.45 : 0.6, clearcoat: leaf === 'dark' ? 0.55 : 0.35, clearcoatRoughness: 0.45, envMapIntensity: 0.25, side: THREE.DoubleSide }));
    return leafMats[k];
  }
  const strandK = [0.4, 0.7, 1][tier];
  // gomila duhana u krugu (cx, cz, radius), od yBot do yTop, sa blagom kupolom
  function tobacco(o) {
    const r = rnd(o.seed || 1), G = new THREE.Group(), leaf = o.leaf === 'dark' ? 'dark' : 'light';
    const n = Math.max(8, Math.floor((o.count * strandK) / 8));
    const dummy = new THREE.Object3D(), col = new THREE.Color();
    for (let v = 0; v < 8; v++) {
      const im = new THREE.InstancedMesh(ribbons[v], leafMat(leaf, v), n);
      for (let i = 0; i < n; i++) {
        const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * o.radius;
        const top = o.yTop + (o.dome ? o.dome * (1 - (rr / o.radius) ** 2) : 0);
        dummy.position.set((o.cx || 0) + Math.cos(a) * rr, o.yBot + (top - o.yBot) * Math.pow(r(), 0.3), (o.cz || 0) + Math.sin(a) * rr);
        dummy.rotation.set((r() - 0.5) * 1.6, r() * Math.PI * 2, (r() - 0.5) * 1.6);
        dummy.scale.setScalar(0.8 + r() * 0.5);
        dummy.updateMatrix(); im.setMatrixAt(i, dummy.matrix);
        col.setHex(LEAF[leaf][v]); col.offsetHSL((r() - 0.5) * 0.015, 0, (r() - 0.5) * 0.05); im.setColorAt(i, col);
      }
      im.castShadow = false; im.receiveShadow = tier > 0;
      G.add(im);
    }
    return G;
  }
  function disposeTree(o) {
    o.traverse((m) => {
      if (m.isInstancedMesh) m.dispose();
      if (m.isMesh && m.userData.ownGeo) m.geometry.dispose();
      if (m.material && m.userData.ownMat) { [].concat(m.material).forEach((mt) => { if (mt.map) mt.map.dispose(); mt.dispose(); }); }
    });
  }

  const tinMetal = own(new THREE.MeshStandardMaterial({ color: 0xc9c2b8, metalness: 1, roughness: 0.3 }));
  const tinBodyGeo = own(new THREE.CylinderGeometry(4.4, 4.4, 3, 64, 1, true));
  const tinRimGeo = own(new THREE.TorusGeometry(4.4, 0.13, 10, 64));
  const tinBotGeo = own(new THREE.CircleGeometry(4.4, 48));
  const tinInGeo = own(new THREE.CylinderGeometry(4.35, 4.35, 2.9, 40, 1, true));
  const tinFloorGeo = own(new THREE.CircleGeometry(4.35, 40));
  const tinLidGeo = own(new THREE.CylinderGeometry(4.58, 4.58, 0.65, 64));
  const tinInMat = own(new THREE.MeshStandardMaterial({ color: 0x1a0f08, side: THREE.BackSide, roughness: 1 }));
  const tinFloorMat = own(new THREE.MeshStandardMaterial({ color: 0x2a1408, roughness: 1 }));
  const tinSideMat = own(new THREE.MeshStandardMaterial({ color: 0x1c140f, metalness: 0.6, roughness: 0.35 }));
  function makeTin(f) {
    const G = new THREE.Group(), big = tier > 0;
    const body = new THREE.Mesh(tinBodyGeo, new THREE.MeshStandardMaterial({ map: labelTexture(f, big), metalness: 0.35, roughness: 0.45 }));
    body.userData.ownMat = true; body.position.y = 1.5;
    const rimM = new THREE.Mesh(tinRimGeo, tinMetal); rimM.rotation.x = Math.PI / 2; rimM.position.y = 3;
    const bot = new THREE.Mesh(tinBotGeo, tinMetal); bot.rotation.x = -Math.PI / 2; bot.position.y = 0.02;
    const inner = new THREE.Mesh(tinInGeo, tinInMat); inner.position.y = 1.5;
    const floor = new THREE.Mesh(tinFloorGeo, tinFloorMat); floor.rotation.x = -Math.PI / 2; floor.position.y = 1.6;
    G.add(body, rimM, bot, inner, floor);
    const tob = tobacco({ radius: 4.1, yBot: 1.7, yTop: 2.55, count: 2600, seed: hash(f.id), dome: 0.3, leaf: f.leaf });
    G.add(tob);
    const lid = new THREE.Mesh(tinLidGeo, [tinSideMat, new THREE.MeshStandardMaterial({ map: lidTexture(f, big), metalness: 0.15, roughness: 0.55 }), tinMetal]);
    lid.userData.ownMat = false; lid.userData.capMat = lid.material[1];
    lid.position.y = 3.2;
    G.add(lid);
    blob(G, 5.2);
    shadowy(G);
    G.userData = { lid, id: f.id, f, body };
    return G;
  }
  // natpisi na limenci trebaju fontove sajta; ako još nisu stigli, nacrtaj ponovo kad stignu
  const fontsOk = !document.fonts || document.fonts.check('800 40px Syne');
  if (!fontsOk) {
    Promise.all(['800 40px Syne', '400 40px Syne', '700 30px Manrope'].map((f) => document.fonts.load(f))).then(() => {
      if (!alive) return;
      tins.forEach((t) => {
        const f = t.userData.f, big = tier > 0, bm = t.userData.body.material, cm = t.userData.lid.userData.capMat;
        bm.map.dispose(); bm.map = labelTexture(f, big); bm.needsUpdate = true;
        const rot = cm.map.rotation; cm.map.dispose(); cm.map = lidTexture(f, big); cm.map.rotation = rot; cm.needsUpdate = true;
      });
      kick();
    }).catch(() => {});
  }
  function dropTin(t) {
    if (!t) return;
    scene.remove(t);
    const cm = t.userData.lid.userData.capMat; if (cm) { cm.map.dispose(); cm.dispose(); }
    disposeTree(t);
  }

  /* ---------------- animacije i crtanje na zahtjev ---------------- */

  const tweens = [];
  function tween(dur, fn, ease, done) {
    if (reduced) dur = Math.min(dur, 1);
    const tw = { t0: performance.now(), dur, fn, ease: ease || eio, done };
    tweens.push(tw);
    kick();
    return tw;
  }
  function moveTo(o, x, y, z, ry, dur, delay) {
    const a = o.position.clone(), b = new THREE.Vector3(x, y, z), r0 = o.rotation.y, r1 = ry == null ? r0 : ry;
    const run = () => tween(dur || 900, (k) => { o.position.lerpVectors(a, b, k); o.rotation.y = lerp(r0, r1, k); });
    if (delay && !reduced) setTimeout(run, delay); else run();
  }

  // kamera: tačka, udaljenost se računa iz veličine prizora i slobodnog dijela ekrana
  const cam = { c: new THREE.Vector3(0, 1, -1), rw: 26, rh: 30, el: 1.02, az: 0.28, d: 120 };
  let goal = null;
  const ins = { top: 0, bottom: 0, left: 0, right: 0 };
  let W = 1, H = 1;
  function fitDist(f) {
    const fH = THREE.MathUtils.degToRad(camera.fov);
    const freeH = Math.max(80, H - ins.top * 0.82 - ins.bottom), freeW = Math.max(80, W - ins.left - ins.right);
    const tH = Math.tan(fH / 2) * freeH / H, tW = Math.tan(fH / 2) * freeW / H;
    return Math.max(f.rh / tH, f.rw / tW) * 1.04;
  }
  function placeCamera() {
    const d = cam.d;
    camera.position.set(cam.c.x + Math.sin(cam.az) * Math.cos(cam.el) * d, cam.c.y + Math.sin(cam.el) * d, cam.c.z + Math.cos(cam.az) * Math.cos(cam.el) * d);
    camera.lookAt(cam.c);
    // magla prati udaljenost kamere (daleki dio stola tone u mrak, bliski je uvijek jasan)
    scene.fog.near = d * 0.75; scene.fog.far = d * 1.9;
  }
  function applyOffset() {
    camera.aspect = W / H;
    const sx = (ins.left - ins.right) / 2, sy = (ins.top * 0.82 - ins.bottom) / 2;
    camera.setViewOffset(W, H, -sx, -sy, W, H);
    camera.updateProjectionMatrix();
  }
  function frame(f, dur) {
    goal = f;
    const from = { c: cam.c.clone(), el: cam.el, az: cam.az, d: cam.d };
    const toD = fitDist(f), toC = new THREE.Vector3().fromArray(f.c);
    if (!dur || reduced) { cam.c.copy(toC); cam.el = f.el; cam.az = f.az; cam.d = toD; placeCamera(); kick(); return; }
    if (cameraTween) { const i = tweens.indexOf(cameraTween); if (i !== -1) tweens.splice(i, 1); }
    cameraTween = tween(dur, (k) => {
      cam.c.lerpVectors(from.c, toC, k); cam.el = lerp(from.el, f.el, k); cam.az = lerp(from.az, f.az, k); cam.d = lerp(from.d, toD, k); placeCamera();
    }, null, () => { cameraTween = null; if (refitLater) { refitLater = false; refit(); } });
  }
  let cameraTween = null, refitLater = false;
  // panel promijenio visinu: kamera se prilagodi (ako baš leti, prilagodi se kad sleti)
  function refit() {
    if (!goal) return;
    if (cameraTween) { refitLater = true; return; }
    const d = fitDist(goal);
    if (Math.abs(d - cam.d) < 0.05) { kick(); return; }
    frame(goal, 380);
  }

  function resize() {
    const r = host.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
    renderer.setSize(W, H, false);
    applyOffset();
    if (goal) { cam.d = fitDist(goal); placeCamera(); }
    kick();
  }

  let raf = 0, last = 0, lastT = 0, slow = 0, alive = true, hidden = document.hidden;
  // stalne animacije (dim, vlakna u padu, žar): dok ih ima, crta se svaki kadar
  const live = new Set();
  function kick() { if (!raf && alive && !hidden) raf = requestAnimationFrame(loop); }
  function loop(t) {
    raf = 0;
    if (!alive) return;
    const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0.016;
    lastT = t;
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i], k = Math.min(1, (t - tw.t0) / tw.dur);
      if (k < 0) continue;
      tw.fn(tw.ease(Math.max(0, k)));
      if (k >= 1) { tweens.splice(i, 1); if (tw.done) tw.done(); }
    }
    live.forEach((f) => f(t, dt));
    renderer.render(scene, camera);
    const busy = tweens.length || live.size;
    // kadrovi kasne dok se nešto pomjera: smanji gustinu piksela
    if (last && busy) {
      slow = t - last > 34 ? slow + 1 : Math.max(0, slow - 1);
      if (slow > 24 && dprCap > 1) { dprCap = Math.max(1, dprCap - 0.5); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap)); resize(); slow = 0; }
    }
    last = busy ? t : 0;
    if (busy) raf = requestAnimationFrame(loop); else lastT = 0;
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(host);
  function onVis() { hidden = document.hidden; if (!hidden) kick(); }
  document.addEventListener('visibilitychange', onVis);
  function onLost(e) { e.preventDefault(); if (opts.onError) opts.onError('lost'); }
  canvas.addEventListener('webglcontextlost', onLost);

  /* ---------------- dodir: izbor glave na stolu ---------------- */

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  let down = null, current = 'intro';
  function onDown(e) { down = { x: e.clientX, y: e.clientY }; }
  function onUp(e) {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) { down = null; return; }
    down = null;
    if (current !== 'bowl' || !opts.onPick) return;
    const r = canvas.getBoundingClientRect();
    // view offset pomjera sliku: isti pomak za zraku
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    let best = null, bestD = Infinity;
    Object.keys(bowls).forEach((id) => { const hit = ray.intersectObject(bowls[id], true)[0]; if (hit && hit.distance < bestD) { bestD = hit.distance; best = id; } });
    if (best) opts.onPick(best);
  }
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointerup', onUp);

  /* ---------------- koraci ---------------- */

  const SPOTS = { front: [0, 0, 5], left: [-7.5, 0, -10], right: [7.8, 0, -10], back: [-11, 0, -11], center: [0, 0, 0] };
  const ORDER = ['egypt', 'phunnel', 'silicone'];
  let chosen = 'egypt';
  const ring = new THREE.Mesh(own(new THREE.RingGeometry(6.2, 6.5, 72)), own(new THREE.MeshBasicMaterial({ color: 0xf2a33c, transparent: true, opacity: 0, depthWrite: false })));
  ring.rotation.x = -Math.PI / 2; ring.position.set(0, 0.06, 5); ring.renderOrder = 2;
  const ringGlow = glowSprite(0xf2a33c, 20, 0); ringGlow.position.set(0, 0.3, 5);
  scene.add(ring, ringGlow);
  function ringTo(o) { const a = ring.material.opacity; tween(320, (k) => { ring.material.opacity = lerp(a, o * 0.85, k); ringGlow.material.opacity = lerp(a / 0.85 * 0.25, o * 0.25, k); }); }

  let tins = [];
  let tinKey = '';

  function layoutBowls(anim) {
    const others = ORDER.filter((id) => id !== chosen);
    const pos = { [chosen]: SPOTS.front, [others[0]]: SPOTS.left, [others[1]]: SPOTS.right };
    ORDER.forEach((id) => {
      const b = bowls[id]; if (!b) return;
      b.visible = true;
      const p = pos[id];
      if (anim) moveTo(b, p[0], p[1], p[2], 0, 820); else b.position.set(p[0], p[1], p[2]);
    });
  }
  function hideOtherBowls(anim) {
    ORDER.forEach((id) => {
      const b = bowls[id]; if (!b || id === chosen) return;
      if (!anim) { b.visible = false; return; }
      const x = b.position.x < 0 ? -26 : 26;
      moveTo(b, x, 0, b.position.z - 4, 0, 700);
      setTimeout(() => { if (current !== 'bowl') b.visible = false; }, 720);
    });
  }

  const FRAMES = {
    intro: { c: [0, 1, -0.5], rw: 14.5, rh: 21, el: 1.06, az: 0.28 },
    bowl: { c: [0.2, 3.2, -2.5], rw: 13.5, rh: 11.5, el: 0.72, az: 0.28 },
    flavor1: { c: [1.2, 2.2, 0.8], rw: 6.6, rh: 6.4, el: 0.9, az: 0.28 },
    flavor2: { c: [0.2, 2.2, 0.2], rw: 11, rh: 7.2, el: 0.92, az: 0.28 }
  };

  function setTins(list) {
    const k = list.map((f) => f.id).join('|');
    if (k === tinKey) return false;
    tinKey = k;
    const old = tins.slice();
    tins = list.map((f) => makeTin(f));
    // stare limenke odu sa stola
    old.forEach((t) => { moveTo(t, t.position.x + 24, 0, t.position.z + 4, 0, 520); setTimeout(() => dropTin(t), 560); });
    return true;
  }
  const TIN_SPOTS = [[[1.2, 0, 1.5]], [[-4.4, 0, 0.6], [5.2, 0, -0.8]]];
  const TIN_REST = [10, 0, 2.5];
  function closeTin(t) {
    const lid = t.userData.lid;
    lid.position.set(0, 3.2, 0); lid.rotation.set(0, 0, 0);
    t.userData.opened = false;
  }
  // limenka stoji zatvorena na stolu (uvod)
  function restTins() {
    tins.forEach((t, i) => {
      if (i > 0) { if (t.parent) moveTo(t, t.position.x + 24, 0, t.position.z, 0, 500); return; }
      if (!t.parent) { closeTin(t); t.position.set(TIN_REST[0] + 20, 0, TIN_REST[2]); scene.add(t); }
      if (t.userData.opened) closeTin(t);
      moveTo(t, TIN_REST[0], 0, TIN_REST[2], -0.4, 800);
    });
  }
  function openTins() {
    const spots = TIN_SPOTS[tins.length - 1] || TIN_SPOTS[0];
    tins.forEach((t, i) => {
      const s = spots[i], lid = t.userData.lid;
      if (!t.parent) { closeTin(t); t.position.set(s[0] + 18, 0, s[2] - 8); t.rotation.y = -0.6; scene.add(t); }
      moveTo(t, s[0], 0, s[2], -0.35, 900, i * 120);
      if (t.userData.opened) return;
      t.userData.opened = true;
      // poklopac se odvrne (okrene i podigne), pa legne iza limenke
      const lx = s[0] < 0 ? -1 : 1;
      const run = () => tween(1100, (k) => {
        const a = Math.min(1, k / 0.45), b = Math.max(0, (k - 0.45) / 0.55);
        lid.rotation.y = -a * Math.PI * 1.2 - b * 0.4;
        lid.position.set(lerp(0, -lx * 1.2 - 2.0, eio(b)), 3.2 + Math.sin(a * Math.PI / 2) * 1.6 * (1 - b) + lerp(0, -2.88, eio(b)) + Math.sin(b * Math.PI) * 1.2, lerp(0, -7.6, eio(b)));
      }, (x) => x);
      if (reduced) run(); else setTimeout(run, 650 + i * 120);
    });
  }

  // pribor po koraku: ono što ne treba se skloni u stranu (ostaje na stolu, ali ne smeta)
  const PROP_HOME = {}, PROP_AWAY = { hmd: [18, 0, 18], roll: [-18, 0, 17], dish: [-22, 0, 4], tongs: [6, 0.2, 36], pick: [-8, 0.1, 30], burner: [0, 0, -21] };
  const AWAY_IN = {
    bowl: ['hmd', 'roll', 'tongs', 'pick'], flavor: ['hmd', 'roll', 'dish', 'tongs', 'pick'], mix: ['hmd', 'roll', 'tongs', 'pick', 'dish'],
    fill: ['hmd', 'roll', 'tongs', 'pick', 'dish'], cover: ['tongs', 'pick', 'dish'], coals: ['roll', 'pick', 'dish', 'hmd'], smoke: ['roll', 'pick', 'dish', 'hmd'], result: ['roll', 'pick', 'dish', 'hmd']
  };
  Object.keys(P).forEach((k) => { PROP_HOME[k] = P[k].position.toArray(); });
  function propsFor(name, S) {
    const away = AWAY_IN[name] || [];
    const over = {};
    if (S && S.prep === 'classic') { if (name === 'mix') over.dish = [0, 0, 3]; if (name === 'fill' || name === 'cover') over.dish = [10.5, 0, -2.5]; }
    if (name === 'cover') { over.roll = [-9.5, 0, 6.5]; over.hmd = [9.8, 0, 6]; }
    if (name === 'coals' || name === 'smoke' || name === 'result') over.burner = [-1, 0, -15];
    Object.keys(P).forEach((k) => {
      if (k === 'hmd' && hmdOn) return;
      if (k === 'tongs' && tongsBusy) return;
      const t = over[k] || (away.indexOf(k) !== -1 ? PROP_AWAY[k] : PROP_HOME[k]), o = P[k];
      if (o.position.distanceTo(new THREE.Vector3().fromArray(t)) > 0.1) moveTo(o, t[0], t[1], t[2], o.rotation.y, 800);
    });
  }

  /* ---------------- boje duhana po okusu ---------------- */

  // isti list izgleda isto, pa svaki okus dobije blagi ton svoje boje (da se miks vidi), a ostaje boja duhana
  const tobMats = [];
  function tobMat(v) {
    if (!tobMats[v]) tobMats[v] = own(new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.55, clearcoat: 0.4, clearcoatRoughness: 0.45, envMapIntensity: 0.25, side: THREE.DoubleSide }));
    return tobMats[v];
  }
  function flavorCols(f) {
    const acc = new THREE.Color(f.accent || '#8a5226'), leaf = f.leaf === 'dark' ? 'dark' : 'light';
    return LEAF[leaf].map((hex) => { const c = new THREE.Color(hex).lerp(acc, 0.13); return c.multiply(c.clone()); });
  }
  function variantMeshes(n, parent) {
    const list = [];
    for (let v = 0; v < 8; v++) {
      const cap = Math.max(1, Math.ceil((n - v) / 8));
      const im = new THREE.InstancedMesh(ribbons[v], tobMat(v), cap);
      im.receiveShadow = tier > 0; im.frustumCulled = false;
      parent.add(im); list.push(im);
    }
    return list;
  }
  function dropMeshes(list, parent) { list.forEach((im) => { parent.remove(im); im.dispose(); }); }

  /* ---------------- zdjelica: klasično miješanje ---------------- */

  const dummy = new THREE.Object3D();
  let dish = null; // { key, meshes, data }
  function buildDish(S) {
    const fl = S.flavors, key = fl.map((f) => f.id).join('|') + S.ratio;
    if (dish && dish.key === key) return;
    if (dish) dropMeshes(dish.meshes, P.dish);
    const n = [520, 820, 1150][tier], r = rnd(hash(key)), ca = flavorCols(fl[0]), cb = flavorCols(fl[1] || fl[0]);
    const meshes = variantMeshes(n, P.dish), data = [];
    for (let i = 0; i < n; i++) {
      const isA = r() < S.ratio, v = i % 8;
      // početak: dvije gomilice; kraj: jedna izmiješana
      const a0 = r() * Math.PI * 2, u0 = Math.sqrt(r()) * 1.7, a1 = r() * Math.PI * 2, u1 = Math.sqrt(r()) * 3.1;
      const sx = (isA ? -1.45 : 1.55) + Math.cos(a0) * u0, sz = (isA ? 0.3 : -0.3) + Math.sin(a0) * u0;
      data.push({ v, j: (i - v) / 8, sx, sz, ex: Math.cos(a1) * u1, ez: Math.sin(a1) * u1, sy: 0.62 + r() * 0.7 * (1 - u0 / 2.2), ey: 0.62 + r() * 0.6 * (1 - u1 / 3.6), rx: (r() - 0.5) * 1.6, ry: r() * 6.28, rz: (r() - 0.5) * 1.6, s: 0.8 + r() * 0.5 });
      meshes[v].setColorAt(data[i].j, (isA ? ca : cb)[v]);
    }
    meshes.forEach((m) => { m.instanceColor.needsUpdate = true; });
    dish = { key, meshes, data, p: -1 };
    setDishMix(0);
  }
  function setDishMix(p) {
    if (!dish || Math.abs(p - dish.p) < 0.004) return;
    dish.p = p;
    const swirl = p * (1 - p) * 5;
    dish.data.forEach((d) => {
      let x = lerp(d.sx, d.ex, p), z = lerp(d.sz, d.ez, p);
      const a = swirl * (1 - Math.hypot(x, z) / 4), c = Math.cos(a), sn = Math.sin(a);
      dummy.position.set(x * c - z * sn, lerp(d.sy, d.ey, p), x * sn + z * c);
      dummy.rotation.set(d.rx, d.ry + swirl, d.rz); dummy.scale.setScalar(d.s); dummy.updateMatrix();
      dish.meshes[d.v].setMatrixAt(d.j, dummy.matrix);
    });
    dish.meshes.forEach((m) => { m.instanceMatrix.needsUpdate = true; });
    kick();
  }

  /* ---------------- duhan u glavi ---------------- */

  // unutrašnjost glave: dno, poluprečnik na dnu i kod ivice, stub (phunnel)
  const INNER = { egypt: { floor: 6.68, r0: 2.3, r1: 3.2, spire: 0 }, phunnel: { floor: 6.08, r0: 2.0, r1: 3.72, spire: 0.85 }, silicone: { floor: 6.47, r0: 3.3, r1: 3.55, spire: 0 } };
  const FILL_MAX = 1.25;
  let fill = null; // { key, meshes, data, d, vis, top }
  function bowlInner(id) { const b = bowls[id], I = INNER[id]; return { rim: b ? b.userData.rimY : 8.7, ...I }; }
  function innerR(I, y) {
    if (y <= I.rim) return lerp(I.r0, I.r1, Math.max(0, (y - I.floor) / (I.rim - I.floor)));
    return I.r1 * Math.max(0.15, 1 - (y - I.rim) / 1.6);
  }
  function buildFill(S) {
    const fl = S.flavors, key = S.bowl + fl.map((f) => f.id).join('|') + S.prep + S.ratio;
    const host = bowls[S.bowl];
    if (!host) return;
    if (fill && fill.key === key && fill.host === host) return;
    if (fill) { dropMeshes(fill.meshes, fill.host); fill.host.remove(fill.extra); }
    const I = bowlInner(S.bowl), n = [900, 1500, 2100][tier], r = rnd(hash(key) + 7);
    const ca = flavorCols(fl[0]), cb = flavorCols(fl[1] || fl[0]);
    const raw = [];
    for (let i = 0; i < n; i++) raw.push({ by: I.floor + 0.12 + r() * (I.rim - I.floor) * FILL_MAX, a: r() * Math.PI * 2, u: Math.sqrt(r()), rx: (r() - 0.5) * 1.5, ry: r() * 6.28, rz: (r() - 0.5) * 1.5, s: 1.05 + r() * 0.55, k: r() });
    raw.sort((x, y) => x.by - y.by);
    const meshes = variantMeshes(n, host), boundary = Math.round(S.ratio * n / FILL_MAX);
    raw.forEach((d, i) => {
      d.v = i % 8; d.j = (i - d.v) / 8;
      const isA = fl.length < 2 ? true : S.prep === 'layer' ? i < boundary : d.k < S.ratio;
      d.col = (isA ? ca : cb)[d.v].clone();
      d.isA = isA;
      meshes[d.v].setColorAt(d.j, d.col);
    });
    meshes.forEach((m) => { m.instanceColor.needsUpdate = true; m.count = 0; });
    // rupice čačkalicom (kroz duhan)
    const extra = new THREE.Group(), hm = own(new THREE.MeshBasicMaterial({ color: 0x0a0503 })), hg = own(new THREE.CircleGeometry(0.11, 10));
    for (let k = 0; k < 7; k++) { const a = k / 7 * 6.28 + 0.3, u = k ? 0.55 : 0.12, h = new THREE.Mesh(hg, hm); h.rotation.x = -Math.PI / 2; h.userData.p = [Math.cos(a) * u, Math.sin(a) * u]; extra.add(h); }
    extra.visible = false;
    host.add(extra);
    fill = { key, host, meshes, data: raw, I, n, d: -1, vis: -1, top: I.floor, extra, burn: 0 };
  }
  // A: količina (1 = do ivice prije sabijanja), d: sabijenost 0..1
  function setFill(A, d, holes) {
    if (!fill) return;
    const I = fill.I, squash = 1 - 0.36 * d;
    const vis = Math.min(fill.n, Math.round(fill.n * A / FILL_MAX));
    const topRaw = I.floor + A * (I.rim - I.floor);
    fill.top = I.floor + (topRaw - I.floor) * squash;
    if (Math.abs(d - fill.d) > 0.004) {
      fill.d = d;
      fill.data.forEach((p) => {
        const y = I.floor + (p.by - I.floor) * squash, R = Math.max(0.2, innerR(I, y) * 0.94 - 0.12);
        const min = I.spire ? I.spire + 0.12 : 0, u = min + p.u * (R - min);
        dummy.position.set(Math.cos(p.a) * u, y, Math.sin(p.a) * u);
        dummy.rotation.set(p.rx, p.ry, p.rz); dummy.scale.setScalar(p.s * (1 - d * 0.12)); dummy.updateMatrix();
        fill.meshes[p.v].setMatrixAt(p.j, dummy.matrix);
      });
      fill.meshes.forEach((m) => { m.instanceMatrix.needsUpdate = true; });
    }
    if (vis !== fill.vis) {
      fill.vis = vis;
      fill.meshes.forEach((m, v) => { m.count = Math.max(0, Math.ceil((vis - v) / 8)); });
    }
    fill.extra.visible = !!holes && vis > 20;
    fill.extra.children.forEach((h) => { const R = innerR(I, fill.top) * 0.8; h.position.set(h.userData.p[0] * R, fill.top + 0.04, h.userData.p[1] * R); });
    kick();
  }
  // pregorjeli gornji sloj potamni
  function setBurn(b) {
    if (!fill || Math.abs(b - fill.burn) < 0.04) return;
    fill.burn = b;
    const dark = new THREE.Color(0x0e0806), band = fill.vis * 0.82, c = new THREE.Color();
    fill.data.forEach((p, i) => {
      if (i >= fill.vis) return;
      const k = i < band ? 0 : Math.min(1, (i - band) / (fill.vis - band + 1)) * b * 0.9;
      c.copy(p.col).lerp(dark, k);
      fill.meshes[p.v].setColorAt(p.j, c);
    });
    fill.meshes.forEach((m) => { m.instanceColor.needsUpdate = true; });
    kick();
  }

  // vlakna koja padaju u glavu dok korisnik puni
  const DROP_N = [14, 22, 30][tier];
  const dropIM = new THREE.InstancedMesh(ribbons[3], tobMat(3), DROP_N);
  dropIM.frustumCulled = false; dropIM.count = 0;
  scene.add(dropIM);
  const drops = [];
  for (let i = 0; i < DROP_N; i++) drops.push({ ph: i / DROP_N, a: Math.random() * 6.28, u: Math.sqrt(Math.random()), sp: 0.7 + Math.random() * 0.5, rx: Math.random() * 6, rz: Math.random() * 6 });
  let dropping = false, dropFlavor = null;
  function dropAnim(t, dt) {
    if (!fill) return;
    const I = fill.I, hostP = fill.host.position;
    let on = 0;
    drops.forEach((d, i) => {
      d.ph += dt * d.sp * 1.6;
      if (d.ph >= 1) { if (!dropping) { d.dead = true; return; } d.ph -= 1; d.dead = false; d.a = Math.random() * 6.28; d.u = Math.sqrt(Math.random()); }
      if (d.dead) return;
      const R = innerR(I, fill.top) * 0.85, y = lerp(I.rim + 6, fill.top + 0.1, d.ph * d.ph);
      dummy.position.set(hostP.x + Math.cos(d.a) * d.u * R, y, hostP.z + Math.sin(d.a) * d.u * R);
      dummy.rotation.set(d.rx + t * 0.004, 0, d.rz + t * 0.003); dummy.scale.setScalar(1); dummy.updateMatrix();
      dropIM.setMatrixAt(on, dummy.matrix); on++;
    });
    dropIM.count = on;
    dropIM.instanceMatrix.needsUpdate = true;
    if (!dropping && !on) live.delete(dropAnim);
  }
  function setDropping(on, f) {
    if (on && f && f !== dropFlavor) {
      dropFlavor = f;
      const cols = flavorCols(f);
      for (let i = 0; i < DROP_N; i++) dropIM.setColorAt(i, cols[i % 8]);
      dropIM.instanceColor.needsUpdate = true;
    }
    dropping = on;
    if (on) { drops.forEach((d) => { if (d.dead) { d.dead = false; d.ph = Math.random(); } }); live.add(dropAnim); kick(); }
  }

  /* ---------------- folija ---------------- */

  const FS = tier === 0 ? 512 : 1024;
  const foilCv = makeCanvas(FS, FS), foilCx = foilCv.getContext('2d'), foilMapT = own(canvasTex(foilCv));
  const glowCv = makeCanvas(256, 256), glowCx = glowCv.getContext('2d'), glowT = own(canvasTex(glowCv));
  const foilTopMat = own(new THREE.MeshStandardMaterial({ map: foilMapT, bumpMap: foilTex.rough, bumpScale: 0.3, metalness: 0.75, roughness: 0.4, envMapIntensity: 1.5, emissive: 0xff5a14, emissiveMap: glowT, emissiveIntensity: 0 }));
  let foil = null, foilR = 4.8;
  function drawFoil(holes) {
    foilCx.drawImage(foilTex.map.image, 0, 0, FS, FS);
    glowCx.fillStyle = '#000'; glowCx.fillRect(0, 0, 256, 256);
    const hr = FS * 0.0062;
    (holes || []).forEach((h) => {
      const x = (0.5 + h[0] * 0.5) * FS, y = (0.5 + h[1] * 0.5) * FS;
      foilCx.fillStyle = 'rgba(255,255,255,.55)'; foilCx.beginPath(); foilCx.arc(x - hr * 0.3, y - hr * 0.3, hr * 1.5, 0, 7); foilCx.fill();
      foilCx.fillStyle = '#0d0704'; foilCx.beginPath(); foilCx.arc(x, y, hr, 0, 7); foilCx.fill();
      glowCx.fillStyle = '#ffb070'; glowCx.beginPath(); glowCx.arc((0.5 + h[0] * 0.5) * 256, (0.5 + h[1] * 0.5) * 256, 2.6, 0, 7); glowCx.fill();
    });
    foilMapT.needsUpdate = true; glowT.needsUpdate = true;
    kick();
  }
  function makeFoil(id) {
    if (foil && foil.userData.id === id) return foil;
    if (foil) { foil.parent && foil.parent.remove(foil); foil.children.forEach((m) => m.geometry.dispose()); }
    const b = bowls[id], rimY = b.userData.rimY, R = b.userData.rimR * 1.1;
    foilR = R;
    const G = new THREE.Group();
    const top = new THREE.Mesh(new THREE.CircleGeometry(R, 72), foilTopMat); top.rotation.x = -Math.PI / 2; top.position.y = 0.06; top.receiveShadow = tier > 0;
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(R, R * 0.93, 1.3, 72, 1, true), foilMat); skirt.position.y = -0.58;
    G.add(top, skirt);
    G.userData = { id, rimY, top };
    foil = G;
    return G;
  }
  function foilTo(on, S, anim) {
    if (on) {
      const G = makeFoil(S.bowl), host = bowls[S.bowl];
      drawFoil(S.foilHoles);
      if (G.parent !== host) {
        host.add(G); G.position.set(0, G.userData.rimY + (anim ? 7 : 0), 0); G.scale.set(1.15, 1, 1.15);
        if (anim) tween(700, (k) => { G.position.y = G.userData.rimY + 7 * (1 - k); const sc = 1.15 - 0.15 * k; G.scale.set(sc, 1, sc); }, eo);
        else G.scale.set(1, 1, 1);
      }
    } else if (foil && foil.parent) {
      const G = foil, y0 = G.position.y;
      if (anim) tween(450, (k) => { G.position.y = y0 + 7 * k; }, eio, () => { if (G.parent && !keepFoil) G.parent.remove(G); });
      else G.parent.remove(G);
    }
  }
  let keepFoil = false;

  /* ---------------- HMD ---------------- */

  let hmdOn = false;
  const hmdCap = P.hmd.children.find((c) => c.isGroup);
  function hmdTo(on, S, anim, capOpen) {
    const b = bowls[S.bowl], rimY = b ? b.userData.rimY : 8.7;
    if (on) {
      if (!hmdOn) {
        hmdOn = true;
        const from = P.hmd.position.clone(), to = new THREE.Vector3(0, rimY - 0.05, 0);
        if (anim) tween(900, (k) => { P.hmd.position.lerpVectors(from, to, k); P.hmd.position.y += Math.sin(k * Math.PI) * 5; }, eio);
        else P.hmd.position.copy(to);
      }
      const capY = capOpen ? 6.5 : 1.5, capZ = capOpen ? -3.2 : 0, capX = capOpen ? 2.2 : 0;
      const c0 = hmdCap.position.clone(), r0 = hmdCap.rotation.x, vr = (S.vents == null ? 0.5 : S.vents) * 1.1;
      tween(anim ? 600 : 1, (k) => { hmdCap.position.set(lerp(c0.x, capX, k), lerp(c0.y, capY, k), lerp(c0.z, capZ, k)); hmdCap.rotation.x = lerp(r0, capOpen ? -0.5 : 0, k); });
      hmdCap.rotation.y = vr;
    } else if (hmdOn) {
      hmdOn = false;
      hmdCap.position.set(0, 1.5, 0); hmdCap.rotation.set(0, 0, 0);
      const t = PROP_HOME.hmd;
      if (anim) moveTo(P.hmd, t[0], t[1], t[2], 0, 800); else P.hmd.position.fromArray(t);
    }
  }

  /* ---------------- ugljevi ---------------- */

  const coals = [];
  let tongsBusy = false;
  function coalSpot(S, c, out) {
    const b = bowls[S.bowl], rimY = b ? b.userData.rimY : 8.7;
    if (S.cover === 'hmd') return out.set(c[0] * 3.6, rimY + 0.68, c[1] * 3.6);
    return out.set(c[0] * foilR, rimY + 1.17, c[1] * foilR);
  }
  function setCoals(S, anim) {
    const list = S.coals || [], v = new THREE.Vector3();
    while (coals.length > list.length) {
      const m = coals.pop(), p0 = m.position.clone(), to = P.burner.position.clone().add(new THREE.Vector3(0, 4, 0));
      if (anim) tween(500, (k) => { m.position.lerpVectors(p0, to, k); m.position.y += Math.sin(k * Math.PI) * 4; }, eio, () => scene.remove(m)); else scene.remove(m);
    }
    list.forEach((c, i) => {
      coalSpot(S, c, v);
      let m = coals[i];
      const hmdScale = S.cover === 'hmd' ? [1.05, 0.48, 1.05] : [1, 1, 1];
      if (!m) {
        m = new THREE.Mesh(coalGeo, coalMat); m.castShadow = tier > 0; coals.push(m); scene.add(m);
        m.rotation.y = 0.4 + i * 1.3;
        m.scale.set(hmdScale[0], hmdScale[1], hmdScale[2]);
        if (anim && !reduced) {
          const from = P.burner.position.clone().add(new THREE.Vector3(0, 4, 0)), to = v.clone();
          m.position.copy(from);
          tongsBusy = true;
          tween(750, (k) => {
            m.position.lerpVectors(from, to, k); m.position.y += Math.sin(k * Math.PI) * 6;
            P.tongs.position.set(m.position.x, m.position.y + 0.35, m.position.z + 14.7); P.tongs.rotation.set(-0.12, 0, 0);
          }, eio, () => {
            setTimeout(() => { tongsBusy = false; const h = PROP_HOME.tongs; P.tongs.rotation.set(0, 0.08, 0); moveTo(P.tongs, h[0], h[1], h[2], 0.08, 600); }, 120);
          });
          return;
        }
        m.position.copy(v);
        return;
      }
      m.scale.set(hmdScale[0], hmdScale[1], hmdScale[2]);
      if (m.position.distanceTo(v) > 0.05) { const p0 = m.position.clone(), to = v.clone(); tween(anim ? 420 : 1, (k) => m.position.lerpVectors(p0, to, k)); }
    });
    kick();
  }

  /* ---------------- dim i žar ---------------- */

  const smokeT = (() => {
    const c = makeCanvas(128, 128), x = c.getContext('2d'), r = rnd(21);
    for (let i = 0; i < 12; i++) { const cx = 64 + (r() - 0.5) * 40, cy = 64 + (r() - 0.5) * 40, rr = 22 + r() * 22, g = x.createRadialGradient(cx, cy, 0, cx, cy, rr); g.addColorStop(0, 'rgba(240,236,245,.5)'); g.addColorStop(1, 'rgba(240,236,245,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); }
    return own(canvasTex(c));
  })();
  const PUFF_N = [16, 28, 40][tier];
  const puffs = [];
  const smokeG = new THREE.Group();
  scene.add(smokeG);
  for (let i = 0; i < PUFF_N; i++) {
    const sp = new THREE.Sprite(own(new THREE.SpriteMaterial({ map: smokeT, transparent: true, depthWrite: false, opacity: 0 })));
    sp.visible = false; smokeG.add(sp); puffs.push({ sp, life: 1, vx: 0, vz: 0, rot: 0 });
  }
  const fire = new THREE.PointLight(0xff6a20, 0, 18, 1.8);
  scene.add(fire);
  const sess = { heat: 0, smoke: 0, burn: 0, tint: new THREE.Color(1, 1, 1), on: false, acc: 0 };
  function smokeAnim(t, dt) {
    const b = bowls[chosen], rimY = b ? b.userData.rimY : 8.7;
    const h = Math.min(1.6, sess.heat);
    coalMat.emissiveIntensity = 1.3 + h * 0.9 + Math.sin(t * 0.004) * 0.12 + Math.sin(t * 0.011) * 0.06;
    foilTopMat.emissiveIntensity = foil && foil.parent ? h * 0.7 : 0;
    fire.intensity = 18 + h * 30; fire.position.set(0, rimY + 5, 0);
    sess.acc += dt * (sess.on ? 3 + sess.smoke * 12 : 0);
    puffs.forEach((p) => {
      if (p.life >= 1) {
        if (sess.acc < 1) { p.sp.visible = false; return; }
        sess.acc -= 1;
        p.life = 0; p.vx = (Math.random() - 0.5) * 0.9; p.vz = (Math.random() - 0.5) * 0.9; p.rot = (Math.random() - 0.5) * 0.6;
        p.sp.position.set((Math.random() - 0.5) * 2.4, rimY + 2.2, (Math.random() - 0.5) * 2.4);
        p.sp.material.color.copy(sess.tint);
        p.sp.material.rotation = Math.random() * 6.28;
        p.sp.visible = true;
      }
      p.life += dt * 0.32;
      const k = p.life;
      p.sp.position.x += p.vx * dt + Math.sin(t * 0.0015 + k * 5) * dt * 0.6;
      p.sp.position.z += p.vz * dt;
      p.sp.position.y += dt * (3.6 - k * 1.2);
      p.sp.material.rotation += p.rot * dt;
      const sc = 3.4 + k * 10;
      p.sp.scale.set(sc, sc, 1);
      p.sp.material.opacity = Math.min(1, k * 4) * (1 - k) * (0.3 + sess.smoke * 0.6) * (1 - sess.burn * 0.3);
    });
    if (!sess.on && puffs.every((p) => p.life >= 1)) { live.delete(smokeAnim); coalMat.emissiveIntensity = 2.2; foilTopMat.emissiveIntensity = 0; fire.intensity = 0; }
  }
  function session(o) {
    if (o.heat != null) sess.heat = o.heat;
    if (o.smoke != null) sess.smoke = o.smoke;
    if (o.burn != null) { sess.burn = o.burn; setBurn(o.burn); }
    if (o.on != null) sess.on = o.on;
    if (sess.on) { live.add(smokeAnim); kick(); }
  }
  function rotateCoals() {
    const from = coals.map((m) => m.position.clone()), n = coals.length || 1, step = Math.PI * 2 / n;
    tween(700, (k) => {
      coals.forEach((m, i) => {
        const p = from[i], a = Math.atan2(p.z, p.x) + step * k, r = Math.hypot(p.x, p.z);
        m.position.set(Math.cos(a) * r, p.y + Math.sin(k * Math.PI) * 1.2, Math.sin(a) * r);
      });
    });
  }

  /* ---------------- dodir i snimak ---------------- */

  function hit(cx, cy) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    if (foil && foil.parent) {
      const h = ray.intersectObject(foil.userData.top, false)[0];
      if (h) { const lp = foil.parent.worldToLocal(h.point.clone()); return { kind: 'foil', x: lp.x / foilR, z: lp.z / foilR }; }
    }
    if (hmdOn) { const h = ray.intersectObject(P.hmd, true)[0]; if (h) { const lp = P.hmd.worldToLocal(h.point.clone()); return { kind: 'hmd', x: lp.x / 3.6, z: lp.z / 3.6 }; } }
    const b = bowls[chosen];
    if (b && b.visible) {
      const h = ray.intersectObject(b, true)[0];
      if (h) { const lp = b.worldToLocal(h.point.clone()); return { kind: 'bowl', x: lp.x, z: lp.z }; }
      // dodir iznad otvora glave (duhan još nije gore)
      const I = bowlInner(chosen), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -(b.position.y + I.rim)), pt = new THREE.Vector3();
      if (ray.ray.intersectPlane(plane, pt) && Math.hypot(pt.x - b.position.x, pt.z - b.position.z) < I.r1 * 1.25) return { kind: 'bowl', x: pt.x - b.position.x, z: pt.z - b.position.z };
    }
    if (P.dish.position.distanceTo(new THREE.Vector3(0, 0, 3)) < 0.5) {
      const h = ray.intersectObject(P.dish, true)[0];
      if (h) return { kind: 'dish' };
    }
    return null;
  }
  function snapshot(size) {
    const b = bowls[chosen], rimY = b ? b.userData.rimY : 8.7;
    const sc = new THREE.PerspectiveCamera(26, W / H, 0.5, 200);
    const dist = 6.2 / Math.tan(THREE.MathUtils.degToRad(13)) / Math.min(1, W / H);
    sc.position.set(dist * 0.03, rimY + dist, dist * 0.12); sc.lookAt(0, rimY, 0);
    const vis = smokeG.visible; smokeG.visible = false;
    renderer.render(scene, sc);
    const out = makeCanvas(size, size), x = out.getContext('2d'), m = Math.min(canvas.width, canvas.height);
    x.drawImage(canvas, (canvas.width - m) / 2, (canvas.height - m) / 2, m, m, 0, 0, size, size);
    smokeG.visible = vis;
    renderer.render(scene, camera);
    try { return out.toDataURL('image/jpeg', 0.88); } catch (e) { return ''; }
  }

  /* ---------------- koraci ---------------- */

  const MORE = {
    mixDish: { c: [0, 1.6, 2.6], rw: 7.6, rh: 6.4, el: 1.02, az: 0.28 },
    fill: { c: [0.4, 6.4, 0.6], rw: 7, rh: 6.6, el: 1.16, az: 0.28 },
    cover: { c: [0.3, 7.2, 0.6], rw: 7.6, rh: 6.6, el: 1.12, az: 0.28 },
    coals: { c: [-0.2, 6.6, -3.6], rw: 8.6, rh: 10.5, el: 0.98, az: 0.28 },
    smoke: { c: [0, 12, 0], rw: 8, rh: 12.5, el: 0.84, az: 0.28 },
    result: { c: [0, 10, 0], rw: 8, rh: 10.5, el: 0.9, az: 0.28 }
  };
  function bowlToCenter(anim) {
    ORDER.forEach((id) => { if (bowls[id] && id !== chosen) bowls[id].visible = false; });
    const b = bowls[chosen];
    if (!b) return;
    b.visible = true;
    if (b.position.lengthSq() > 0.01) { if (anim) moveTo(b, 0, 0, 0, 0, 900); else b.position.set(0, 0, 0); }
  }
  function tinsTo(spots) {
    tins.forEach((t, i) => {
      const s = spots[Math.min(i, spots.length - 1)];
      if (!t.parent) { t.position.set(s[0] + 18, 0, s[2]); scene.add(t); }
      if (t.position.distanceTo(new THREE.Vector3(s[0], 0, s[2])) > 0.1) moveTo(t, s[0], 0, s[2], -0.35, 800);
    });
  }
  function stirTin(p) {
    const t = tins[0];
    if (!t) return;
    const tob = t.children.find((c) => c.isGroup && c !== t.userData.lid);
    if (tob) { tob.rotation.y = p * Math.PI * 2.2; tob.position.y = Math.sin(p * Math.PI) * 0.12; }
    kick();
  }
  function laterStep(name, S, prev) {
    chosen = S.bowl || chosen;
    if (S.flavors && S.flavors.length) setTins(S.flavors);
    const two = S.flavors && S.flavors.length > 1;
    if (name === 'mix') {
      const b = bowls[chosen];
      ORDER.forEach((id) => { if (bowls[id] && id !== chosen) bowls[id].visible = false; });
      if (b) moveTo(b, SPOTS.back[0], 0, SPOTS.back[2], 0, 800);
      if (S.prep === 'classic') { buildDish(S); setDishMix(S.mixP || 0); tinsTo([[-8.5, 0, -6.5], [8.5, 0, -6.5]]); frame(MORE.mixDish, 1000); }
      else if (two) { tinsTo(TIN_SPOTS[1]); frame(FRAMES.flavor2, 900); }
      else { tinsTo(TIN_SPOTS[0]); stirTin(S.mixP || 0); frame(FRAMES.flavor1, 900); }
    } else {
      bowlToCenter(true);
      tinsTo(S.prep === 'classic' ? [[-11, 0, -10], [11, 0, -11]] : two ? [[-10.5, 0, -1.5], [10.5, 0, -1.5]] : [[10.5, 0, -1.5]]);
      if (S.prep === 'classic') { buildDish(S); setDishMix(1); }
      buildFill(S);
      const covered = name !== 'fill', I = bowlInner(chosen), dd = S.density || 0;
      const capA = (I.rim - 0.62 - I.floor) / ((I.rim - I.floor) * (1 - 0.36 * dd));
      setFill(covered ? Math.min(S.amount || 0, capA) : S.amount || 0, dd, S.holes);
      if (name === 'fill') {
        foilTo(false, S, true); hmdTo(false, S, true); S.coals = []; setCoals(S, true);
        frame(MORE.fill, 1000);
      } else {
        const useFoil = S.cover === 'foil', useHmd = S.cover === 'hmd';
        foilTo(useFoil, S, prev === 'fill');
        if (useFoil) drawFoil(S.foilHoles);
        hmdTo(useHmd, S, true, name === 'coals');
        setCoals(name === 'cover' ? Object.assign({}, S, { coals: [] }) : S, true);
        if (name !== 'smoke') session({ on: false });
        frame(MORE[name] || MORE.cover, 1000);
      }
    }
  }

  function step(name, data) {
    data = data || {};
    const prev = current;
    current = name;
    setDropping(false);
    if (name !== 'smoke') session({ on: false });
    const later = ['mix', 'fill', 'cover', 'coals', 'smoke', 'result'].indexOf(name) !== -1;
    // duhan u glavi, folija, HMD i ugljevi postoje tek od punjenja
    const topOn = later && name !== 'mix';
    if (fill) fill.meshes.concat([fill.extra]).forEach((m) => { m.visible = topOn && (m !== fill.extra || m.visible); });
    if (!topOn) { foilTo(false, data, prev === 'cover' || prev === 'coals'); hmdTo(false, { bowl: chosen }, true); setCoals({ coals: [] }, true); }
    propsFor(name, data);
    if (later) { laterStep(name, data, prev); return; }
    if (name === 'intro') {
      chosen = data.bowl || chosen;
      if (prev === 'bowl') {
        // druge glave odu sa stola, izabrana se vrati na sredinu
        hideOtherBowls(true);
        if (bowls[chosen]) moveTo(bowls[chosen], 0, 0, 0, 0, 900);
      } else {
        ORDER.forEach((id) => { if (bowls[id]) bowls[id].visible = id === chosen; });
        if (bowls[chosen]) bowls[chosen].position.set(0, 0, 0);
      }
      ringTo(0);
      if (data.flavors && data.flavors.length) { setTins(data.flavors); restTins(); }
      if (prev === 'intro' && !data.first) { frame(FRAMES.intro, 900); return; }
      // ulaz: kamera se spusti na sto
      cam.c.set(0, 1, -1); cam.el = 1.36; cam.az = 0.6; cam.d = fitDist(FRAMES.intro) * 1.5; placeCamera();
      frame(FRAMES.intro, data.first ? 2200 : 900);
    } else if (name === 'bowl') {
      if (data.bowl) chosen = data.bowl;
      if (data.flavors && data.flavors.length) setTins(data.flavors);
      restTins();
      if (prev !== 'bowl') {
        // druge dvije glave uđu sa strana
        ORDER.forEach((id) => { const b = bowls[id]; if (b && id !== chosen && !b.visible) { b.visible = true; b.position.set(SPOTS[id === ORDER.filter((x) => x !== chosen)[0] ? 'left' : 'right'][0] * 3, 0, -10); } });
      }
      layoutBowls(true);
      ringTo(1);
      frame(FRAMES.bowl, prev === 'bowl' ? 600 : 1100);
    } else if (name === 'flavor') {
      ringTo(0);
      hideOtherBowls(prev === 'bowl');
      const b = bowls[chosen];
      if (b) moveTo(b, SPOTS.back[0], 0, SPOTS.back[2], 0, 900);
      const list = (data.flavors || []).slice(0, 2);
      if (list.length) { setTins(list); openTins(); }
      frame(list.length > 1 ? FRAMES.flavor2 : FRAMES.flavor1, 1000);
    }
  }

  /* ---------------- učitavanje ---------------- */

  scene.add(shadowy((bowls.phunnel = phunnelBowl())));
  scene.add(shadowy((bowls.silicone = siliconeBowl())));
  bowls.phunnel.visible = bowls.silicone.visible = false;
  Object.values(bowls).forEach((b) => blob(b, 5.2));
  resize();

  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
  loader.load(opts.modelUrl, (gltf) => {
    if (!alive) return;
    const g = egyptBowl(gltf);
    blob(g, 5.4);
    scene.add(shadowy((bowls.egypt = g)));
    g.visible = chosen === 'egypt';
    renderer.compile(scene, camera);
    if (opts.onReady) opts.onReady();
    kick();
  }, undefined, () => { if (opts.onError) opts.onError('model'); });

  return {
    tier,
    step,
    mixProgress(p, single) { if (single) stirTin(p); else setDishMix(p); },
    fill(A, d, holes) { setFill(A, d, holes); },
    dropping(on, f) { setDropping(on, f); },
    foilHoles(list) { drawFoil(list); },
    vents(v) { hmdCap.rotation.y = v * 1.1; kick(); },
    coals(S) { setCoals(S, true); },
    rotateCoals,
    session,
    hit,
    snapshot,
    insets(o) {
      const changed = ['top', 'bottom', 'left', 'right'].some((k) => Math.abs((o[k] || 0) - ins[k]) > 2);
      if (!changed) return;
      Object.assign(ins, { top: o.top || 0, bottom: o.bottom || 0, left: o.left || 0, right: o.right || 0 });
      applyOffset();
      refit();
    },
    destroy() {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      tweens.length = 0;
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointerup', onUp);
      tins.forEach(dropTin);
      scene.traverse((m) => { if (m.isInstancedMesh) m.dispose(); });
      disposables.forEach((d) => { try { d.dispose(); } catch (e) { /* već oslobođeno */ } });
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    }
  };
}
