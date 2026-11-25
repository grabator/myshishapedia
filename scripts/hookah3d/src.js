/*
 * MyShishapedia - 3D nargila na početnoj (Three.js).
 * Izvor za js/hookah3d.js; pakuje se sa: node scripts/hookah3d/build.mjs (esbuild, three@0.160.0).
 *
 * mount(wrap, opts) postavi platno preko .hookah unutar .hookah-wrap, učita /models/nargila.glb i
 * kad je model spreman doda wrap-u klasu is-3d (CSS sakrije SVG nargilu). Vraća funkciju za gašenje.
 *   opts.water   boja vode (boja okusa)
 *   opts.reduced bez samostalnog okretanja (smanji animacije)
 * Kamera (OrbitControls): na računaru se nargila vrti mišem u svim pravcima, Ctrl + kotačić približava.
 * Na telefonu prst lijevo-desno okreće (listanje stranice i dalje radi), dva prsta približavaju;
 * dugme 360° uključi slobodan pogled (kamera gore-dolje, približavanje), dvoklik približi glavu.
 * "Drži za dim": kad .hookah dobije klasu is-pulling, ugljevi se užare i u vodi krenu mjehurići.
 * Renderuje samo dok je na ekranu i dok je kartica vidljiva.
 */
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Color, Vector3, PMREMGenerator,
  MeshStandardMaterial, MeshPhysicalMaterial, Mesh, LatheGeometry, Vector2, TubeGeometry,
  CatmullRomCurve3, BoxGeometry, TorusGeometry, Float32BufferAttribute, SphereGeometry, CircleGeometry, DirectionalLight, AmbientLight,
  PointLight, ACESFilmicToneMapping, SRGBColorSpace, DoubleSide, InstancedMesh, Object3D, Quaternion
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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
  let btn = null;
  function place() {
    canvas.style.top = (hk.offsetTop - hk.offsetHeight * 0.03) + 'px'; canvas.style.height = (hk.offsetHeight * 1.06) + 'px';
    if (!btn) return;
    // telefon: dugme 360° u redu sa "Drži za dim", desno; veći ekran: dolje lijevo uz nargilu (desno je crijevo)
    const pull = wrap.querySelector('.pull');
    if (pull && window.matchMedia('(max-width: 759px)').matches) {
      const wr = wrap.getBoundingClientRect(), pr = pull.getBoundingClientRect();
      const k = wrap.offsetHeight ? wr.height / wrap.offsetHeight : 1; // wrap je na telefonu umanjen (scale)
      btn.style.top = ((pr.top - wr.top + pr.height / 2) / k - btn.offsetHeight / 2) + 'px';
      btn.style.left = ((pr.right - wr.left) / k + 12) + 'px';
    } else { btn.style.top = (hk.offsetTop + hk.offsetHeight * 0.9 - 36) + 'px'; btn.style.left = ''; }
  }
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

  const camera = new PerspectiveCamera(26, 1, 1, 2000);
  const spin = new Group(); scene.add(spin);
  const model = new Group(); spin.add(model);
  // svjetlo žara ispod poklopca
  const ember = new PointLight(0xff8a3c, 0, 70, 1.6); ember.position.set(0, 119, 0); model.add(ember);
  model.position.y = -H / 2;

  const brass = new MeshStandardMaterial({ color: 0xd9a35a, metalness: 1, roughness: 0.24 });
  // staklo: blago, sjajno staklo (kao u prvoj verziji)
  const glass = new MeshPhysicalMaterial({ color: 0xfff1de, metalness: 0, roughness: 0.04, transparent: true, opacity: 0.13, envMapIntensity: 2, clearcoat: 1, clearcoatRoughness: 0.05, depthWrite: false, side: DoubleSide });
  const glassLite = new MeshPhysicalMaterial({ color: 0xfff1de, metalness: 0, roughness: 0.04, transparent: true, opacity: 0.16, envMapIntensity: 2, clearcoat: 1, depthWrite: false, side: DoubleSide });
  const hoseMat = new MeshStandardMaterial({ color: 0x1b1310, metalness: 0.15, roughness: 0.5 });
  const wc = new Color(opts.water || '#e8b04a');
  // voda: puna tečnost (vidi se kroz staklo), tamnija pri dnu, svjetlija i sjajna pri površini
  const water = new MeshPhysicalMaterial({ vertexColors: true, metalness: 0, roughness: 0.14, clearcoat: 0.5, envMapIntensity: 0.45, emissive: wc.clone().multiplyScalar(0.06) });
  const coalMat = new MeshStandardMaterial({ color: 0x2a1408, emissive: 0xff6a1a, emissiveIntensity: 0.8, roughness: 0.9 });

  const LEVEL = 15.2;
  const wpts = VASE.filter(([y]) => y <= LEVEL).map(([y, r]) => new Vector2(r * 0.93, y + 0.5));
  wpts.unshift(new Vector2(0, 0.5));
  wpts.push(new Vector2(10.1 * 0.93, LEVEL));
  const wgeo = new LatheGeometry(wpts, 64);
  {
    const pos = wgeo.attributes.position, cols = [];
    const lo = wc.clone().multiplyScalar(0.3), hi = wc.clone().multiplyScalar(0.95);
    for (let i = 0; i < pos.count; i++) { const k = Math.min(1, Math.max(0, pos.getY(i) / LEVEL)); const c = lo.clone().lerp(hi, Math.pow(k, 1.4)); cols.push(c.r, c.g, c.b); }
    wgeo.setAttribute('color', new Float32BufferAttribute(cols, 3));
  }
  const wmesh = new Mesh(wgeo, water);
  // površina vode: malo se nagne kad se nargila okreće, sa svijetlim rubom (meniskus)
  const surfGroup = new Group(); surfGroup.position.y = LEVEL;
  const surfMat = new MeshPhysicalMaterial({ color: wc.clone().multiplyScalar(0.9), emissive: wc.clone().multiplyScalar(0.12), metalness: 0, roughness: 0.04, clearcoat: 1, envMapIntensity: 1.4 });
  const surf = new Mesh(new CircleGeometry(10.1 * 0.93, 64), surfMat);
  surf.rotation.x = -Math.PI / 2;
  const meniscus = new Mesh(new TorusGeometry(10.1 * 0.93, 0.28, 8, 64), new MeshStandardMaterial({ color: 0xfff3dc, emissive: 0xffd9a0, emissiveIntensity: 0.25, roughness: 0.2 }));
  meniscus.rotation.x = Math.PI / 2;
  surfGroup.add(surf, meniscus);
  model.add(wmesh, surfGroup);

  // mjehurići u vodi
  const BUB = 18;
  const bubbles = new InstancedMesh(new SphereGeometry(0.45, 8, 6), new MeshPhysicalMaterial({ color: 0xfff6e6, roughness: 0.05, metalness: 0, clearcoat: 1, emissive: 0x3a2410 }), BUB);
  const bub = Array.from({ length: BUB }, (_, i) => ({ a: i * 2.4, r: 1 + (i % 5) * 1.2, y: (i * 1.7) % 15, s: 6 + (i % 4) * 2 }));
  const tmp = new Object3D();
  bubbles.visible = false;
  model.add(bubbles);

  // ugljevi na glavi
  // ugljevi stoje ISPOD zlatnog poklopca (HMD); vidi se samo žar na rubu i svjetlo ispod njega
  const coals = [];
  for (let i = 0; i < 3; i++) {
    const c = new Mesh(new BoxGeometry(2.4, 1.6, 2.4), coalMat);
    const a = i * Math.PI * 2 / 3 + 0.4;
    c.position.set(Math.cos(a) * 2.6, 117.6, Math.sin(a) * 2.6);
    c.rotation.y = a;
    coals.push(c); model.add(c);
  }
  const glowMat = new MeshStandardMaterial({ color: 0x1a0a04, emissive: 0xff7a24, emissiveIntensity: 0.6, roughness: 1 });
  const seam = new Mesh(new TorusGeometry(6.3, 0.45, 8, 48), glowMat);
  seam.rotation.x = Math.PI / 2; seam.position.y = 117.1;
  model.add(seam);

  // crijevo: kreće iz priključka kroz zlatnu spiralu (kao u modelu), pa se spusti uz desnu stranu
  const path = new CatmullRomCurve3([
    [12.4, 66.5, -10.6], [15.1, 68.1, -13.6], [20.1, 71.6, -17.9], [25.5, 73.6, -22.5], [31.1, 74, -27],
    [36.1, 72.4, -30.4], [41.9, 69.5, -33.9], [46.7, 65.6, -36], [51.8, 61.4, -37.8], [56.5, 55, -37],
    [59, 45, -31], [57.5, 35, -21], [52, 27, -11]
  ].map(([x, y, z]) => new Vector3(x, y, z)), false, 'catmullrom', 0.4);
  model.add(new Mesh(new TubeGeometry(path, 160, 1.6, 14, false), hoseMat));
  const handle = new Group();
  const hp = [[0, 0], [1.6, 0], [1.9, 3], [1.5, 6], [1.8, 18], [1.3, 26], [0.9, 30], [0, 30]].map(([r, y]) => new Vector2(r, y));
  handle.add(new Mesh(new LatheGeometry(hp, 24), hoseMat));
  [3, 18].forEach((y) => { const ring = new Mesh(new LatheGeometry([new Vector2(2.05, y - 0.8), new Vector2(2.1, y), new Vector2(2.05, y + 0.8)], 24), brass); handle.add(ring); });
  const end = path.getPoint(1), dir = path.getTangent(1).normalize();
  handle.position.copy(end);
  const handleTip = end.clone().add(dir.clone().multiplyScalar(30));
  handle.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir));
  model.add(handle);

  let glassMesh = null;
  let alive = true, visible = true, raf = 0, last = 0, ready = false;
  let heat = 0, heatTarget = 0, slow = 0, lowered = false, lastAz = 0, azVel = 0, lastTap = 0, free = false, idleTimer = 0;
  const touchy = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(opts.url || '/models/nargila.glb', (g) => {
    if (!alive) return;
    const remove = [];
    g.scene.traverse((o) => {
      if (!o.isMesh) return;
      const n = (o.name || o.parent && o.parent.name || '').replace(/_\d+$/, '');
      if (DROP.some((d) => n.indexOf(d) === 0)) { remove.push(o); return; }
      if (n.indexOf('Rectangle001') === 0) { o.material = glass; o.renderOrder = 2; glassMesh = o; }
      else o.material = BRASS.some((b) => n.indexOf(b) === 0) ? brass : brass;
    });
    remove.forEach((o) => o.parent.remove(o));
    model.add(g.scene);
    ready = true;
    resize();
    renderOnce();
    wrap.classList.add('is-3d');
    loop();
  }, undefined, () => { document.documentElement.classList.remove('hk3d'); teardown(); });

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.08;
  controls.rotateSpeed = 0.75; controls.zoomSpeed = 0.9;
  controls.enablePan = false; controls.zoomToCursor = true;
  controls.autoRotate = !opts.reduced; controls.autoRotateSpeed = 1.1;
  const HOME_T = new Vector3(0, -H * 0.02, 0), HEAD_T = new Vector3(0, H * 0.42, 0);
  let baseDist = 300, fly = null, placed = false;
  function lockPolar(on) {
    // telefon bez 360: kamera ostaje na istoj visini, prst gore-dolje lista stranicu
    if (on) { const p = controls.getPolarAngle(); controls.minPolarAngle = p; controls.maxPolarAngle = p; canvas.style.touchAction = 'pan-y'; }
    else { controls.minPolarAngle = 0.12; controls.maxPolarAngle = Math.PI * 0.62; canvas.style.touchAction = 'none'; }
  }
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const nd = (H * 0.56) / Math.tan((camera.fov * Math.PI / 180) / 2);
    if (!ready || Math.abs(nd - baseDist) > 1) {
      baseDist = nd;
      controls.minDistance = baseDist * 0.28; controls.maxDistance = baseDist * 1.3;
      if (!placed) { placed = true; controls.target.copy(HOME_T); camera.position.set(0, H * 0.06 + HOME_T.y, baseDist); controls.update(); lockPolar(touchy && !free); }
    }
    camera.updateProjectionMatrix();
  }
  // glatko preletanje kamere (dvoklik: glava izbliza / nazad na cijelu nargilu)
  function flyTo(target, dist) {
    if (!ready) return;
    const dir = camera.position.clone().sub(controls.target).normalize();
    fly = { t0: performance.now(), from: { tg: controls.target.clone(), pos: camera.position.clone() }, to: { tg: target.clone(), pos: target.clone().add(dir.multiplyScalar(dist)) } };
    loop();
  }
  function zoomK() { return Math.max(0, Math.min(1, 1 - (camera.position.distanceTo(controls.target) - baseDist * 0.35) / (baseDist * 0.65))); }
  // tačke na ekranu za dim (effects.js): vrh glave i kraj usnika, prate okretanje i približavanje
  const headW = new Vector3(0, 125.5, 0), mouthW = new Vector3(), vtmp = new Vector3();
  const pts = { bowl: null, mouth: null };
  function project(v) {
    vtmp.copy(v); model.localToWorld(vtmp); vtmp.project(camera);
    const r = canvas.getBoundingClientRect();
    return [r.left + (vtmp.x + 1) / 2 * r.width, r.top + (1 - vtmp.y) / 2 * r.height];
  }
  hk._hk3d = { point: (name) => (ready ? pts[name] : null) };
  function renderOnce() {
    coalMat.emissiveIntensity = 0.8 + heat * 2.6;
    glowMat.emissiveIntensity = 0.55 + heat * 2.4;
    ember.intensity = 6 + heat * 50;
    renderer.render(scene, camera);
    spin.updateMatrixWorld(true);
    pts.bowl = project(headW);
    mouthW.copy(handleTip); pts.mouth = project(mouthW);
    wrap.style.setProperty('--hk3d-z', (free ? 1 : zoomK()).toFixed(3));
  }
  function frame(t) {
    raf = 0;
    if (!alive || !visible) return;
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    heat += (heatTarget - heat) * Math.min(1, dt * 4);
    if (fly) {
      const k = Math.min(1, (t - fly.t0) / 700), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      controls.target.lerpVectors(fly.from.tg, fly.to.tg, e); camera.position.lerpVectors(fly.from.pos, fly.to.pos, e);
      if (k >= 1) fly = null;
    }
    controls.update();
    const az = controls.getAzimuthalAngle(); let d = az - lastAz; if (d > Math.PI) d -= 2 * Math.PI; if (d < -Math.PI) d += 2 * Math.PI; lastAz = az;
    if (dt > 0) azVel += (d / dt - azVel) * Math.min(1, dt * 5);
    // slabiji telefon: manja rezolucija ako crtanje kasni
    if (dt > 0) { slow = slow * 0.95 + (dt > 0.03 ? 0.05 : 0); if (slow > 0.6 && !lowered) { lowered = true; renderer.setPixelRatio(1); if (glassMesh) glassMesh.material = glassLite; resize(); } }
    bubbles.visible = heat > 0.05;
    if (bubbles.visible) {
      bub.forEach((b, i) => {
        b.y += dt * b.s * (0.4 + heat);
        if (b.y > LEVEL - 0.6) b.y = 0.5;
        const k = b.y / LEVEL, rr = b.r * (1 - k * 0.3);
        tmp.position.set(Math.cos(b.a + b.y * 0.3) * rr, 1 + b.y, Math.sin(b.a + b.y * 0.3) * rr);
        tmp.scale.setScalar(0.6 + k * 0.8);
        tmp.updateMatrix(); bubbles.setMatrixAt(i, tmp.matrix);
      });
      bubbles.instanceMatrix.needsUpdate = true;
    }
    const tilt = Math.max(-0.12, Math.min(0.12, azVel * 0.06));
    surfGroup.rotation.z += (tilt - surfGroup.rotation.z) * Math.min(1, dt * 3);
    surfGroup.position.y = LEVEL + Math.sin(t / 900) * 0.08 * (1 + heat * 3);
    renderOnce();
    loop();
  }
  function loop() { if (!raf && alive && visible && ready) raf = requestAnimationFrame(frame); }

  // računar: običan kotačić lista stranicu, Ctrl + kotačić (ili 360 način) približava
  canvas.addEventListener('wheel', (e) => { if (!e.ctrlKey && !free) e.stopImmediatePropagation(); }, { capture: true });
  // dvoklik / dupli dodir: glava izbliza ili nazad na cijelu nargilu
  canvas.addEventListener('pointerdown', (e) => {
    const now = performance.now();
    if (now - lastTap < 300 && e.isPrimary) { lastTap = 0; if (zoomK() > 0.45) flyTo(HOME_T, baseDist); else flyTo(HEAD_T, baseDist * 0.42); } else lastTap = now;
  });
  // dok korisnik okreće, nargila se ne vrti sama; nastavi par sekundi poslije
  controls.addEventListener('start', () => { controls.autoRotate = false; clearTimeout(idleTimer); fly = null; loop(); });
  controls.addEventListener('end', () => { clearTimeout(idleTimer); if (!opts.reduced) idleTimer = setTimeout(() => { controls.autoRotate = !free; loop(); }, 4000); });
  // dugme 360°: slobodan pogled (kamera gore-dolje, približavanje, bez listanja stranice preko nargile)
  const L = opts.labels || {};
  btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'hx3d-360';
  btn.setAttribute('aria-label', L.on || '360° view');
  btn.innerHTML = '<span aria-hidden="true">360°</span><b></b>';
  function setFree(on) {
    free = on;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.querySelector('span').textContent = on ? '\u2715' : '360\u00b0';
    btn.querySelector('b').textContent = on ? (L.off || 'Done') : (L.on || '360° view');
    btn.setAttribute('aria-label', on ? (L.off || 'Done') : (L.on || '360° view'));
    wrap.classList.toggle('is-free', on);
    if (placed) lockPolar(touchy && !on);
    controls.autoRotate = !on && !opts.reduced;
    if (!on) flyTo(HOME_T, baseDist);
    loop();
  }
  btn.addEventListener('click', () => setFree(!free));
  setFree(false);
  wrap.appendChild(btn);
  place();

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
    delete hk._hk3d;
    wrap.style.removeProperty('--hk3d-z');
    renderer.dispose();
    controls.dispose(); clearTimeout(idleTimer); btn.remove(); wrap.classList.remove('is-free');
    canvas.remove();
  }
  return teardown;
}
