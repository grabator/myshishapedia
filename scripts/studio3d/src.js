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
  const fill = new THREE.SpotLight(0xffe6c8, 500, 0, 0.9, 0.8, 1.6); fill.position.set(20, 36, -10);
  const rim = new THREE.DirectionalLight(0xc8b8ff, 0.45); rim.position.set(18, 10, -20);
  scene.add(key, key.target, fill, rim, new THREE.AmbientLight(0x3a2a40, 0.5));

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
    G.add(lathe([[0.3, 0], [1.35, 0], [1.4, 1.9], [2.3, 2.5], [3.5, 4.6], [4.15, 7.6], [4.35, 8.55], [4.3, 8.7], [3.8, 8.7], [3.6, 7.8], [3.2, 6.2], [2.2, 4.7], [1.1, 4.45], [0.85, 4.6], [0.55, 7.4], [0.5, 7.55], [0.28, 7.55], [0.28, 0.5]], mat, 96));
    const hm = own(new THREE.MeshBasicMaterial({ color: 0x080402 })), hg = own(new THREE.CircleGeometry(0.16, 12));
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 + 0.4, h = new THREE.Mesh(hg, hm); h.position.set(Math.cos(a) * 0.66, 6.3, Math.sin(a) * 0.66); h.lookAt(Math.cos(a) * 3, 6.6, Math.sin(a) * 3); G.add(h); }
    G.userData = { rimY: 8.7, rimR: 4.3, floorY: 4.5 };
    return G;
  }
  function siliconeBowl() {
    const G = new THREE.Group();
    G.add(lathe([[0.3, 0], [1.6, 0], [1.6, 2.2], [2.6, 2.6], [4.0, 5.6], [4.4, 8.3], [4.25, 8.7], [3.7, 8.7], [3.55, 7.6], [3.3, 5.9], [0.4, 5.6], [0.3, 5.6]],
      own(new THREE.MeshPhysicalMaterial({ color: 0x34343c, roughness: 0.55, sheen: 0.6, sheenColor: new THREE.Color(0x553333), side: THREE.DoubleSide })), 96));
    const plate = new THREE.Mesh(own(new THREE.CylinderGeometry(3.3, 3.3, 0.12, 48)), own(new THREE.MeshStandardMaterial({ color: 0xd0d0d4, metalness: 1, roughness: 0.22 })));
    plate.position.y = 5.7; G.add(plate);
    const hm = own(new THREE.MeshBasicMaterial({ color: 0x050505 })), hg = own(new THREE.CircleGeometry(0.32, 16));
    for (let k = 0; k < 7; k++) { const a = k / 7 * Math.PI * 2, h = new THREE.Mesh(hg, hm); h.rotation.x = -Math.PI / 2; h.position.set(k ? Math.cos(a) * 1.6 : 0, 5.77, k ? Math.sin(a) * 1.6 : 0); G.add(h); }
    const band = new THREE.Mesh(own(new THREE.TorusGeometry(4.05, 0.09, 8, 72)), own(new THREE.MeshStandardMaterial({ color: 0xf2a33c, roughness: 0.5 })));
    band.rotation.x = Math.PI / 2; band.position.y = 7.2; G.add(band);
    G.userData = { rimY: 8.7, rimR: 4.2, floorY: 5.8 };
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

  let raf = 0, last = 0, slow = 0, alive = true, hidden = document.hidden;
  function kick() { if (!raf && alive && !hidden) raf = requestAnimationFrame(loop); }
  function loop(t) {
    raf = 0;
    if (!alive) return;
    for (let i = tweens.length - 1; i >= 0; i--) {
      const tw = tweens[i], k = Math.min(1, (t - tw.t0) / tw.dur);
      if (k < 0) continue;
      tw.fn(tw.ease(Math.max(0, k)));
      if (k >= 1) { tweens.splice(i, 1); if (tw.done) tw.done(); }
    }
    renderer.render(scene, camera);
    // kadrovi kasne dok se nešto pomjera: smanji gustinu piksela (jednom po koraku)
    if (last && tweens.length) {
      const dt = t - last;
      slow = dt > 34 ? slow + 1 : Math.max(0, slow - 1);
      if (slow > 20 && dprCap > 1) { dprCap = Math.max(1, dprCap - 0.5); renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap)); resize(); slow = 0; }
    }
    last = tweens.length ? t : 0;
    if (tweens.length) raf = requestAnimationFrame(loop);
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

  // pribor koji ne treba u koraku se skloni u stranu (ostaje na stolu, ali ne smeta)
  const PROP_HOME = {}, PROP_AWAY = { hmd: [18, 0, 18], roll: [-18, 0, 17], dish: [-22, 0, 4], tongs: [6, 0.2, 36], pick: [-8, 0.1, 30] };
  const AWAY_IN = { bowl: ['hmd', 'roll', 'tongs', 'pick'], flavor: ['hmd', 'roll', 'dish', 'tongs', 'pick'] };
  Object.keys(P).forEach((k) => { PROP_HOME[k] = P[k].position.toArray(); });
  function propsFor(name) {
    const away = AWAY_IN[name] || [];
    Object.keys(PROP_AWAY).forEach((k) => {
      const t = away.indexOf(k) !== -1 ? PROP_AWAY[k] : PROP_HOME[k], o = P[k];
      if (o.position.distanceTo(new THREE.Vector3().fromArray(t)) > 0.1) moveTo(o, t[0], t[1], t[2], o.rotation.y, 800);
    });
  }

  function step(name, data) {
    data = data || {};
    const prev = current;
    current = name;
    propsFor(name);
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
