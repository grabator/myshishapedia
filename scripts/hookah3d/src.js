/*
 * MyShishapedia - 3D nargila na početnoj (Three.js).
 * Izvor za js/hookah3d.js; pakuje se sa: node scripts/hookah3d/build.mjs (esbuild, three@0.160.0).
 *
 * mount(wrap, opts) postavi platno preko .hookah unutar .hookah-wrap, učita /models/nargila.glb i
 * kad je model spreman doda wrap-u klasu is-3d (CSS sakrije SVG nargilu). Vraća funkciju za gašenje.
 *   opts.water   boja vode (boja okusa)
 *   opts.reduced bez samostalnog okretanja (smanji animacije)
 * Okretanje: prevlačenje lijevo-desno (vertikalno listanje stranice i dalje radi), sama se polako okreće.
 * "Drži za dim": kad .hookah dobije klasu is-pulling, ugljevi se užare i u vodi krenu mjehurići.
 * Renderuje samo dok je na ekranu i dok je kartica vidljiva.
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Color, Vector3, PMREMGenerator,
  MeshStandardMaterial, MeshPhysicalMaterial, Mesh, LatheGeometry, Vector2, TubeGeometry,
  CatmullRomCurve3, BoxGeometry, SphereGeometry, CircleGeometry, DirectionalLight, AmbientLight,
  PointLight, ACESFilmicToneMapping, SRGBColorSpace, DoubleSide, InstancedMesh, Object3D, Quaternion
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const BRASS = ['Line001', 'Object001', 'Cylinder009', 'Object002', 'Object003', 'Helix001'];
const DROP = ['Rectangle002', 'Object004', 'Line005']; // dugo crijevo u petlji i drška: zamijenjeni kraćim crijevom
// profil vaze (visina: poluprečnik), izmjeren iz modela
const VASE = [[0, 8.3], [1, 10.5], [2, 12.7], [3, 14], [4, 15.1], [6, 16.1], [8, 16.2], [10, 15.4], [12, 13.4], [14, 11.5], [16, 9.7]];
const H = 124.4;

export function mount(wrap, opts) {
  opts = opts || {};
  const hk = wrap.querySelector('.hookah');
  if (!hk) return () => {};
  const canvas = document.createElement('canvas');
  canvas.className = 'hx3d';
  canvas.setAttribute('aria-hidden', 'true');
  wrap.insertBefore(canvas, hk.nextSibling);
  function place() { canvas.style.top = (hk.offsetTop - hk.offsetHeight * 0.03) + 'px'; canvas.style.height = (hk.offsetHeight * 1.06) + 'px'; }
  place();

  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch (e) { canvas.remove(); return () => {}; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const pm = new PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  pm.dispose();
  scene.add(new AmbientLight(0xffe2c0, 0.25));
  const key = new DirectionalLight(0xffd2a0, 2.1); key.position.set(80, 160, 120); scene.add(key);
  const rim = new DirectionalLight(0xff8a3c, 2.6); rim.position.set(-120, 60, -100); scene.add(rim);
  const ember = new PointLight(0xff8a3c, 0, 90, 1.6); ember.position.set(0, H + 4, 0); scene.add(ember);

  const camera = new PerspectiveCamera(26, 1, 1, 2000);
  const spin = new Group(); scene.add(spin);
  const model = new Group(); spin.add(model);
  model.position.y = -H / 2;

  const brass = new MeshStandardMaterial({ color: 0xd9a35a, metalness: 1, roughness: 0.24 });
  const glass = new MeshPhysicalMaterial({ color: 0xfff1de, metalness: 0, roughness: 0.04, transparent: true, opacity: 0.13, envMapIntensity: 2, clearcoat: 1, clearcoatRoughness: 0.05, depthWrite: false, side: DoubleSide });
  const hoseMat = new MeshStandardMaterial({ color: 0x1b1310, metalness: 0.15, roughness: 0.5 });
  const wc = new Color(opts.water || '#e8b04a');
  const water = new MeshPhysicalMaterial({ color: wc, emissive: wc.clone().multiplyScalar(0.12), metalness: 0, roughness: 0.2, transparent: true, opacity: 0.9, envMapIntensity: 0.35, depthWrite: false });
  const coalMat = new MeshStandardMaterial({ color: 0x2a1408, emissive: 0xff6a1a, emissiveIntensity: 0.8, roughness: 0.9 });

  // voda: kopija dna vaze, malo uža
  const wpts = VASE.map(([y, r]) => new Vector2(r * 0.9, y + 0.6));
  wpts.unshift(new Vector2(0, 0.6));
  const wmesh = new Mesh(new LatheGeometry(wpts, 48), water);
  wmesh.renderOrder = 1;
  const surf = new Mesh(new CircleGeometry(VASE[VASE.length - 1][1] * 0.9, 48), water);
  surf.rotation.x = -Math.PI / 2; surf.position.y = 16.6;
  model.add(wmesh, surf);

  // mjehurići u vodi
  const BUB = 18;
  const bubbles = new InstancedMesh(new SphereGeometry(0.45, 8, 6), new MeshStandardMaterial({ color: 0xfff4e0, transparent: true, opacity: 0.75, roughness: 0.1, metalness: 0 }), BUB);
  const bub = Array.from({ length: BUB }, (_, i) => ({ a: i * 2.4, r: 1 + (i % 5) * 1.2, y: (i * 1.7) % 15, s: 6 + (i % 4) * 2 }));
  const tmp = new Object3D();
  bubbles.visible = false;
  model.add(bubbles);

  // ugljevi na glavi
  const coals = [];
  for (let i = 0; i < 3; i++) {
    const c = new Mesh(new BoxGeometry(3.4, 2.4, 3.4), coalMat);
    const a = i * Math.PI * 2 / 3 + 0.4;
    c.position.set(Math.cos(a) * 3.6, H + 1.2, Math.sin(a) * 3.6);
    c.rotation.y = a;
    coals.push(c); model.add(c);
  }

  // kraće crijevo: od spirale na priključku, niz desnu stranu do drške na podu
  const path = new CatmullRomCurve3([
    new Vector3(43.5, 70.7, -35), new Vector3(52, 66, -33), new Vector3(56, 54, -26),
    new Vector3(53, 42, -16), new Vector3(46, 34, -8)
  ]);
  model.add(new Mesh(new TubeGeometry(path, 80, 1.35, 12, false), hoseMat));
  const handle = new Group();
  const hp = [[0, 0], [1.6, 0], [1.9, 3], [1.5, 6], [1.8, 18], [1.3, 26], [0.9, 30], [0, 30]].map(([r, y]) => new Vector2(r, y));
  handle.add(new Mesh(new LatheGeometry(hp, 24), hoseMat));
  [3, 18].forEach((y) => { const ring = new Mesh(new LatheGeometry([new Vector2(2.05, y - 0.8), new Vector2(2.1, y), new Vector2(2.05, y + 0.8)], 24), brass); handle.add(ring); });
  const end = path.getPoint(1), dir = path.getTangent(1).normalize();
  handle.position.copy(end);
  handle.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir));
  model.add(handle);

  let alive = true, visible = true, raf = 0, last = 0, ready = false;
  let angle = 0.5, vel = 0, dragging = false, lastX = 0, heat = 0, heatTarget = 0;
  const AUTO = opts.reduced ? 0 : 0.22;

  new GLTFLoader().load(opts.url || '/models/nargila.glb', (g) => {
    if (!alive) return;
    const remove = [];
    g.scene.traverse((o) => {
      if (!o.isMesh) return;
      const n = (o.name || o.parent && o.parent.name || '').replace(/_\d+$/, '');
      if (DROP.some((d) => n.indexOf(d) === 0)) { remove.push(o); return; }
      if (n.indexOf('Rectangle001') === 0) { o.material = glass; o.renderOrder = 2; }
      else o.material = BRASS.some((b) => n.indexOf(b) === 0) ? brass : brass;
    });
    remove.forEach((o) => o.parent.remove(o));
    model.add(g.scene);
    ready = true;
    resize();
    renderOnce();
    wrap.classList.add('is-3d');
    loop();
  }, undefined, () => { teardown(); });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // visina modela (sa malo prostora) stane u platno
    const dist = (H * 0.56) / Math.tan((camera.fov * Math.PI / 180) / 2);
    camera.position.set(0, H * 0.06, dist);
    camera.lookAt(0, -H * 0.02, 0);
    camera.updateProjectionMatrix();
  }
  function renderOnce() {
    spin.rotation.y = angle;
    coalMat.emissiveIntensity = 0.8 + heat * 2.6;
    ember.intensity = heat * 60;
    renderer.render(scene, camera);
  }
  function frame(t) {
    raf = 0;
    if (!alive || !visible) return;
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    if (!dragging) { vel *= Math.pow(0.04, dt); angle += (AUTO + vel) * dt; }
    heat += (heatTarget - heat) * Math.min(1, dt * 4);
    bubbles.visible = heat > 0.05;
    if (bubbles.visible) {
      bub.forEach((b, i) => {
        b.y += dt * b.s * (0.4 + heat);
        if (b.y > 15.5) b.y = 0.5;
        const k = b.y / 16, rr = b.r * (1 - k * 0.3);
        tmp.position.set(Math.cos(b.a + b.y * 0.3) * rr, 1 + b.y, Math.sin(b.a + b.y * 0.3) * rr);
        tmp.scale.setScalar(0.6 + k * 0.8);
        tmp.updateMatrix(); bubbles.setMatrixAt(i, tmp.matrix);
      });
      bubbles.instanceMatrix.needsUpdate = true;
    }
    renderOnce();
    loop();
  }
  function loop() { if (!raf && alive && visible && ready) raf = requestAnimationFrame(frame); }

  // okretanje prevlačenjem (vodoravno); vertikalno listanje ostaje pregledniku
  function down(e) { dragging = true; lastX = e.clientX; vel = 0; try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* nije kritično */ } }
  function move(e) {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    const d = dx * 0.012; angle += d; vel = d * 40;
    if (!raf) renderOnce();
  }
  function up() { dragging = false; last = 0; loop(); }
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);

  const mo = new MutationObserver(() => { heatTarget = hk.classList.contains('is-pulling') ? 1 : 0; loop(); });
  mo.observe(hk, { attributes: true, attributeFilter: ['class'] });
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((en) => { visible = en[0].isIntersecting && !document.hidden; last = 0; loop(); }) : null;
  if (io) io.observe(canvas);
  function onVis() { visible = !document.hidden; last = 0; loop(); }
  document.addEventListener('visibilitychange', onVis);
  const ro = 'ResizeObserver' in window ? new ResizeObserver(() => { place(); resize(); if (ready) renderOnce(); }) : null;
  if (ro) { ro.observe(canvas); ro.observe(hk); }

  function teardown() {
    alive = false;
    if (raf) cancelAnimationFrame(raf);
    mo.disconnect(); if (io) io.disconnect(); if (ro) ro.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    wrap.classList.remove('is-3d');
    renderer.dispose();
    canvas.remove();
  }
  return teardown;
}
