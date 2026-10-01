/*
 * MyShishapedia - 3D nargila u heru početne stranice (EKSPERIMENT).
 *
 * Uključuje se sa HERO_MODE: '3d' u site.config.js. Kad je 'svg', ovaj fajl i Three.js se
 * uopšte ne učitavaju. SVG nargila ostaje u HTML-u kao rezerva: 3D se učita tek nakon što se
 * stranica prikaže, pa se glatko pretopi preko SVG-a. Bez WebGL-a, uz prefers-reduced-motion,
 * na slabom uređaju ili ako FPS ostane nizak, ostaje (ili se vraća) SVG nargila.
 *
 * Model je napravljen iz koda (LatheGeometry, TubeGeometry), bez vanjskih 3D modela.
 * Three.js je lokalno u vendor/three/ (fiksna verzija r170, MIT licenca).
 */
import * as THREE from '/vendor/three/three-r170.module.min.js';

var TAU = Math.PI * 2;

/* ------------------------------------------------------------------ */
/* Pomoćne                                                             */
/* ------------------------------------------------------------------ */

function lathe(points, segments) {
  return new THREE.LatheGeometry(points.map(function (p) { return new THREE.Vector2(p[0], p[1]); }), segments || 64);
}

/** Glatki obris: kroz zadane tačke provuče spline i uzme n tačaka (bez uglova na vazi). */
function smoothLathe(points, n, segments) {
  var curve = new THREE.SplineCurve(points.map(function (p) { return new THREE.Vector2(p[0], p[1]); }));
  return new THREE.LatheGeometry(curve.getPoints(n), segments || 64);
}

/** Meka tekstura dima (radijalni gradijent), napravljena na canvasu. */
function smokeTexture() {
  var c = document.createElement('canvas');
  c.width = c.height = 128;
  var g = c.getContext('2d');
  var grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,0.55)');
  grd.addColorStop(0.35, 'rgba(255,255,255,0.28)');
  grd.addColorStop(0.7, 'rgba(255,255,255,0.08)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  // blaga nepravilnost, da pramenovi ne izgledaju kao savršeni krugovi
  for (var i = 0; i < 40; i++) {
    var x = 30 + Math.random() * 68, y = 30 + Math.random() * 68, r = 6 + Math.random() * 16;
    var gg = g.createRadialGradient(x, y, 0, x, y, r);
    gg.addColorStop(0, 'rgba(255,255,255,0.06)');
    gg.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gg;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  var tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Jednostavna "environment" mapa iz koda: topla lounge svjetla, za refleksije metala i stakla. */
function makeEnvironment(renderer) {
  var env = new THREE.Scene();
  var sky = new THREE.Mesh(
    new THREE.SphereGeometry(10, 32, 16),
    new THREE.MeshBasicMaterial({ side: THREE.BackSide, vertexColors: true })
  );
  var col = [];
  var pos = sky.geometry.attributes.position;
  var top = new THREE.Color('#3a2a20'), bottom = new THREE.Color('#0c0907');
  for (var i = 0; i < pos.count; i++) {
    var k = (pos.getY(i) / 10 + 1) / 2;
    var c = bottom.clone().lerp(top, k);
    col.push(c.r, c.g, c.b);
  }
  sky.geometry.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  env.add(sky);
  function panel(color, intensity, w, h, x, y, z) {
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide }));
    m.position.set(x, y, z);
    m.lookAt(0, 0, 0);
    env.add(m);
  }
  panel('#ffb070', 4, 6, 3, -5, 4, 3);     // topli "prozor" gore lijevo
  panel('#ff7a2a', 2.5, 3, 5, 6, 1, -2);   // žar sa strane
  panel('#9fb8ff', 0.9, 5, 2, 0, 5, -6);   // hladno pozadinsko svjetlo
  var pmrem = new THREE.PMREMGenerator(renderer);
  var rt = pmrem.fromScene(env, 0.04);
  pmrem.dispose();
  env.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
  return rt;
}

/* ------------------------------------------------------------------ */
/* Model nargile                                                       */
/* ------------------------------------------------------------------ */

function buildHookah(q, waterColor, envMap) {
  var g = new THREE.Group();
  var disposables = [];
  function add(mesh) { g.add(mesh); disposables.push(mesh); return mesh; }

  var metal = new THREE.MeshStandardMaterial({ color: '#c8bfb3', metalness: 1, roughness: 0.26, envMap: envMap, envMapIntensity: 1.1 });
  var darkMetal = new THREE.MeshStandardMaterial({ color: '#3a3431', metalness: 0.9, roughness: 0.35, envMap: envMap });
  var clay = new THREE.MeshStandardMaterial({ color: '#9a4f2c', roughness: 0.78, metalness: 0 });
  // Staklo: providno sa refleksijama (canvas je providan, pa se kroz vazu vidi sama stranica).
  // Transmisija ovdje ne pomaže jer ne vidi HTML iza canvasa, a skuplja je.
  // na mobitelu jednostavniji (brži) materijali: Standard umjesto Physical
  var Phys = q.glass ? THREE.MeshPhysicalMaterial : THREE.MeshStandardMaterial;
  var glass = q.glass
    ? new THREE.MeshPhysicalMaterial({
      color: '#f2f7fa', metalness: 0, roughness: 0.03, transparent: true, opacity: 0.14,
      envMap: envMap, envMapIntensity: 2.2, clearcoat: 1, clearcoatRoughness: 0.03,
      specularIntensity: 1, side: THREE.DoubleSide, depthWrite: false
    })
    : new THREE.MeshStandardMaterial({ color: '#f2f7fa', metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.2, envMap: envMap, envMapIntensity: 1.8, depthWrite: false });
  var water = new Phys({ color: waterColor, roughness: 0.12, metalness: 0, transparent: true, opacity: 0.5, envMap: envMap, envMapIntensity: 0.8, emissive: new THREE.Color(waterColor), emissiveIntensity: 0.28, depthWrite: false });
  var hose = new THREE.MeshStandardMaterial({ color: '#2a1f19', roughness: 0.55, metalness: 0.1, envMap: envMap, envMapIntensity: 0.4 });
  var coalMat = new THREE.MeshStandardMaterial({ color: '#2b2522', roughness: 0.9, emissive: new THREE.Color('#ff5a1a'), emissiveIntensity: 1 });

  // vaza (staklo), obris zarotiran oko ose
  var vaseProfile = [[0.001, 0], [0.3, 0.005], [0.56, 0.07], [0.72, 0.24], [0.79, 0.46], [0.73, 0.69], [0.54, 0.88], [0.3, 1.02], [0.18, 1.12], [0.16, 1.24], [0.2, 1.29]];
  var vase = add(new THREE.Mesh(smoothLathe(vaseProfile, 60, q.segments), glass));
  vase.renderOrder = 3;

  // voda: tijelo + površina koja titra
  var wLevel = 0.52;
  var waterProfile = [[0.001, 0.02], [0.28, 0.025], [0.53, 0.09], [0.68, 0.25], [0.745, 0.45], [0.745, wLevel]];
  var waterBody = add(new THREE.Mesh(smoothLathe(waterProfile, 40, q.segments), water));
  waterBody.renderOrder = 1;
  var surfGeo = new THREE.CircleGeometry(0.74, q.segments, 0, TAU);
  surfGeo.rotateX(-Math.PI / 2);
  surfGeo.translate(0, wLevel, 0);
  var surface = add(new THREE.Mesh(surfGeo, water));
  surface.renderOrder = 2;
  var surfBase = Float32Array.from(surfGeo.attributes.position.array);

  // stub: kragna, ukrasi (kugle), cijev koja ulazi u vodu
  var stemProfile = [
    [0.001, 0.08], [0.05, 0.08], [0.05, 1.18], [0.2, 1.2], [0.21, 1.3], [0.08, 1.34], [0.07, 1.5],
    [0.13, 1.56], [0.14, 1.64], [0.08, 1.72], [0.06, 1.95], [0.11, 2.0], [0.12, 2.1], [0.07, 2.16], [0.06, 2.42], [0.001, 2.42]
  ];
  add(new THREE.Mesh(lathe(stemProfile, q.segments), metal));

  // tacna
  var trayProfile = [[0.001, 2.42], [0.58, 2.42], [0.62, 2.46], [0.6, 2.475], [0.52, 2.455], [0.08, 2.45], [0.001, 2.47]];
  add(new THREE.Mesh(lathe(trayProfile, q.segments), metal));

  // posuda (glina)
  var bowlProfile = [[0.06, 2.46], [0.1, 2.5], [0.14, 2.62], [0.24, 2.76], [0.33, 2.86], [0.34, 2.9], [0.3, 2.9], [0.001, 2.88]];
  add(new THREE.Mesh(smoothLathe(bowlProfile, 30, q.segments), clay));
  // HMD / poklopac
  add(new THREE.Mesh(lathe([[0.001, 2.93], [0.3, 2.93], [0.31, 2.9], [0.26, 2.89]], q.segments), darkMetal));

  // ugljevi
  var coals = [];
  [[-0.12, 0.02, 0.2], [0.1, -0.06, -0.3], [0.02, 0.12, 0.6]].forEach(function (p, i) {
    var m = add(new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.07, 0.13), coalMat.clone()));
    m.position.set(p[0], 2.975, p[1]);
    m.rotation.y = p[2];
    coals.push(m);
  });

  // crijevo: glatka kriva od priključka na stubu do usnika
  var curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.1, 1.42, 0), new THREE.Vector3(0.5, 1.5, 0.08), new THREE.Vector3(0.95, 1.2, 0.2),
    new THREE.Vector3(1.12, 0.6, 0.22), new THREE.Vector3(1.0, 0.18, 0.15), new THREE.Vector3(0.78, 0.12, 0.28), new THREE.Vector3(0.66, 0.3, 0.42)
  ]);
  add(new THREE.Mesh(new THREE.TubeGeometry(curve, q.tubeSegments, 0.034, 12, false), hose));
  // priključak i usnik (metal)
  var port = add(new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.16, 16), metal));
  port.position.set(0.1, 1.42, 0);
  port.rotation.z = Math.PI / 2;
  var tipPos = curve.getPoint(1);
  var tipDir = curve.getTangent(1);
  var mouth = add(new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.036, 0.22, 16), metal));
  mouth.position.copy(tipPos).addScaledVector(tipDir, 0.1);
  mouth.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tipDir);
  // ventil za ispuhivanje
  var valve = add(new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), darkMetal));
  valve.position.set(-0.12, 1.26, 0.05);

  // mjehurići u vodi (instancirani)
  var bubbleCount = q.bubbles;
  var bubbleGeo = new THREE.SphereGeometry(1, 10, 8);
  var bubbleMat = new Phys({ color: '#ffffff', transparent: true, opacity: 0.55, roughness: 0.05, envMap: envMap, envMapIntensity: 1.5, depthWrite: false });
  var bubbles = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
  bubbles.renderOrder = 2;
  g.add(bubbles);
  disposables.push(bubbles);
  var bubbleState = [];
  for (var b = 0; b < bubbleCount; b++) bubbleState.push({ y: Math.random() * wLevel, x: 0, z: 0, s: 0.012 + Math.random() * 0.02, v: 0.15 + Math.random() * 0.2, ph: Math.random() * TAU });

  return {
    group: g,
    coals: coals,
    bowlTop: new THREE.Vector3(0, 3.0, 0),
    mouth: mouth.position.clone(),
    surface: surface,
    surfBase: surfBase,
    wLevel: wLevel,
    bubbles: bubbles,
    bubbleState: bubbleState,
    glassMat: glass,
    dispose: function () {
      disposables.forEach(function (m) {
        if (m.geometry) m.geometry.dispose();
        if (m.material) m.material.dispose();
      });
      [metal, darkMetal, clay, glass, water, hose, coalMat, bubbleMat].forEach(function (x) { x.dispose(); });
    }
  };
}

/* ------------------------------------------------------------------ */
/* Dim (meki sprite-ovi)                                               */
/* ------------------------------------------------------------------ */

function Smoke(scene, max, colors) {
  this.tex = smokeTexture();
  this.pool = [];
  this.colors = colors.map(function (c) { return new THREE.Color(c); });
  this.warm = new THREE.Color('#ffb070');
  for (var i = 0; i < max; i++) {
    var mat = new THREE.SpriteMaterial({ map: this.tex, transparent: true, depthWrite: false, opacity: 0 });
    var s = new THREE.Sprite(mat);
    s.visible = false;
    scene.add(s);
    this.pool.push({ s: s, life: 0, age: 0, v: new THREE.Vector3(), r0: 0.1, r1: 0.5, a: 0.3, seed: Math.random() * 100, base: this.colors[0] });
  }
}
Smoke.prototype.spawn = function (pos, o) {
  var p = null;
  for (var i = 0; i < this.pool.length; i++) if (this.pool[i].life <= 0 && !this.pool[i].dead) { p = this.pool[i]; break; }
  if (!p) return;
  p.life = o.life;
  p.age = 0;
  p.s.position.copy(pos);
  p.v.set(o.vx || 0, o.vy || 0.35, o.vz || 0);
  p.r0 = o.r0 || 0.12;
  p.r1 = o.r1 || 0.7;
  p.a = o.a || 0.28;
  p.seed = Math.random() * 100;
  p.base = this.colors[(Math.random() * this.colors.length) | 0];
  p.s.visible = true;
};
Smoke.prototype.update = function (dt, t) {
  var n = 0;
  for (var i = 0; i < this.pool.length; i++) {
    var p = this.pool[i];
    if (p.life <= 0) continue;
    n++;
    p.age += dt;
    var k = p.age / p.life;
    if (k >= 1) { p.life = 0; p.s.visible = false; p.s.material.opacity = 0; continue; }
    // kovitlanje: glatki pseudo-šum iz sinusa
    var sx = Math.sin(t * 0.9 + p.seed) * 0.22 + Math.sin(t * 2.1 + p.seed * 1.7) * 0.08;
    var sz = Math.cos(t * 0.7 + p.seed * 1.3) * 0.18;
    p.s.position.x += (p.v.x + sx * k) * dt;
    p.s.position.y += p.v.y * dt;
    p.s.position.z += (p.v.z + sz * k) * dt;
    p.v.multiplyScalar(1 - dt * 0.35);
    p.v.y = Math.max(p.v.y, 0.12);
    var sc = p.r0 + (p.r1 - p.r0) * Math.sqrt(k);
    p.s.scale.set(sc, sc, 1);
    p.s.material.rotation += dt * 0.15 * (p.seed > 50 ? 1 : -1);
    p.s.material.opacity = p.a * Math.sin(Math.PI * Math.min(1, k * 1.15)) * (1 - k * 0.3);
    // obasjano žarom pri dnu, prema vrhu hladnije
    p.s.material.color.copy(this.warm).lerp(p.base, Math.min(1, k * 1.6));
  }
  return n;
};
Smoke.prototype.dispose = function () {
  this.pool.forEach(function (p) { p.s.material.dispose(); if (p.s.parent) p.s.parent.remove(p.s); });
  this.tex.dispose();
};

/* ------------------------------------------------------------------ */
/* Pokretanje                                                          */
/* ------------------------------------------------------------------ */

/**
 * mount(stageEl, opts) -> Promise<controller> ili odbijen Promise (tada ostaje SVG).
 * opts: { label, waterColor, smoke: [boje], button, meter, onFail(reason) }
 */
export function mount(stageEl, opts) {
  opts = opts || {};
  var mobile = window.matchMedia('(max-width: 767px)').matches || window.matchMedia('(pointer: coarse)').matches;
  var q = {
    glass: !mobile,
    segments: mobile ? 40 : 72,
    tubeSegments: mobile ? 80 : 160,
    bubbles: mobile ? 10 : 22,
    smoke: mobile ? 36 : 70,
    dpr: Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)
  };

  var canvas = document.createElement('canvas');
  canvas.className = 'hero3d';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', opts.label || '3D');
  canvas.tabIndex = -1;

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return Promise.reject(new Error('webgl'));
  }
  renderer.setPixelRatio(q.dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  // pauza između težih koraka, da nijedan zadatak ne blokira stranicu dugo
  function breathe() { return new Promise(function (res) { setTimeout(res, 0); }); }
  var envRT, model, pivot, smoke, ember;

  return breathe().then(function () {
    envRT = makeEnvironment(renderer);
    return breathe();
  }).then(function () {
    model = buildHookah(q, opts.waterColor || '#3fc08a', envRT.texture);
    return breathe();
  }).then(function () {
    return finish();
  });

  function finish() {
  pivot = new THREE.Group();
  model.group.position.y = -1.5;
  pivot.add(model.group);
  scene.add(pivot);

  // svjetla: toplo od žara (treperi), blago pozadinsko, kontra svjetlo
  scene.add(new THREE.HemisphereLight('#ffe2c4', '#1a120d', 0.55));
  var key = new THREE.DirectionalLight('#ffd7b0', 1.1);
  key.position.set(-3, 4, 4);
  scene.add(key);
  var rim = new THREE.DirectionalLight('#9fb8ff', 0.7);
  rim.position.set(3, 2, -4);
  scene.add(rim);
  ember = new THREE.PointLight('#ff7a2a', 3.2, 4.5, 1.6);
  ember.position.set(0, 1.62, 0);
  pivot.add(ember);

  smoke = new Smoke(scene, q.smoke, opts.smoke && opts.smoke.length ? opts.smoke : ['#f4ebdf', '#ebcda4', '#d9c3a8']);

  stageEl.appendChild(canvas);

  /* ---------- veličina ---------- */
  var width = 1, height = 1;
  function resize() {
    var r = stageEl.getBoundingClientRect();
    width = Math.max(1, r.width);
    height = Math.max(1, r.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();
  var ro = new ResizeObserver(resize);
  ro.observe(stageEl);

  /* ---------- interakcija: okretanje sa inercijom ---------- */
  var rotY = -0.5, velY = 0.0, tilt = 0.08, velT = 0;
  var dragging = false, lastX = 0, lastY = 0, lastT = 0, pressTimer = 0, moved = false, idleFor = 0;
  var pointerId = null;

  function onDown(e) {
    if (e.button !== undefined && e.button !== 0) return;
    pointerId = e.pointerId;
    dragging = true;
    moved = false;
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = performance.now();
    velY = 0;
    // držanje bez pomjeranja = "Povuci dim"
    clearTimeout(pressTimer);
    pressTimer = setTimeout(function () { if (dragging && !moved) startPull(); }, 280);
  }
  function onMove(e) {
    if (!dragging || e.pointerId !== pointerId) return;
    var dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (!moved && Math.abs(dx) + Math.abs(dy) > 6) {
      moved = true;
      clearTimeout(pressTimer);
      if (pulling) releasePull();
      // horizontalno = okretanje; vertikalno pusti browseru da skrola (touch-action: pan-y)
      if (Math.abs(dx) > Math.abs(dy)) { try { canvas.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
    }
    if (!moved) return;
    var now = performance.now();
    var dt = Math.max(1, now - lastT) / 1000;
    rotY += dx * 0.008;
    tilt = Math.max(-0.12, Math.min(0.32, tilt + dy * 0.002));
    velY = (dx * 0.008) / dt;
    lastX = e.clientX;
    lastY = e.clientY;
    lastT = now;
    idleFor = 0;
  }
  function onUp(e) {
    if (e.pointerId !== pointerId) return;
    dragging = false;
    clearTimeout(pressTimer);
    if (pulling) releasePull();
    try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  }
  canvas.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  canvas.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* ---------- parallax miša (desktop) ---------- */
  var mx = 0, my = 0, pmx = 0, pmy = 0;
  function onHover(e) {
    var r = stageEl.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }
  if (!mobile) window.addEventListener('pointermove', onHover, { passive: true });

  /* ---------- "Povuci dim" (dugme, tastatura, držanje nargile) ---------- */
  var pulling = false, pullStart = 0, heat = 0.35, strength = 0;
  var button = opts.button, meter = opts.meter;
  function startPull() {
    if (pulling) return;
    pulling = true;
    pullStart = performance.now();
    if (button) button.setAttribute('aria-pressed', 'true');
    stageEl.classList.add('is-pulling');
  }
  function releasePull() {
    if (!pulling) return;
    pulling = false;
    var held = (performance.now() - pullStart) / 1000;
    if (button) button.setAttribute('aria-pressed', 'false');
    stageEl.classList.remove('is-pulling');
    if (meter) meter.style.transform = 'scaleX(0)';
    if (held < 0.15) return;
    // veliki oblak iz usnika, jači što se duže držalo
    var power = Math.min(1, held / 2.5);
    var origin = model.mouth.clone().applyMatrix4(model.group.matrixWorld);
    var n = Math.round(10 + power * 22);
    for (var i = 0; i < n; i++) {
      var a = Math.random() * TAU;
      smoke.spawn(origin, {
        vx: Math.cos(a) * (0.3 + Math.random() * 0.9 * (0.5 + power)), vy: 0.2 + Math.random() * 0.5, vz: Math.sin(a) * 0.6,
        life: 2.4 + Math.random() * 1.8, r0: 0.18, r1: 0.9 + power * 1.1, a: 0.32
      });
    }
  }
  function onBtnDown(e) { if (e.button !== undefined && e.button !== 0) return; e.preventDefault(); startPull(); }
  function onBtnKey(e) { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); startPull(); } }
  function onBtnKeyUp(e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); releasePull(); } }
  function block(e) { e.preventDefault(); }
  if (button) {
    button.addEventListener('pointerdown', onBtnDown);
    button.addEventListener('pointerup', releasePull);
    button.addEventListener('pointerleave', releasePull);
    button.addEventListener('keydown', onBtnKey);
    button.addEventListener('keyup', onBtnKeyUp);
    button.addEventListener('blur', releasePull);
    button.addEventListener('click', block);
  }

  /* ---------- skrol: kamera se spušta od posude prema vazi ---------- */
  var scrollK = 0;
  var hero = stageEl.closest('.hero') || stageEl;
  function onScroll() {
    var r = hero.getBoundingClientRect();
    scrollK = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height)));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- pauza kad hero nije na ekranu ili tab nije vidljiv ---------- */
  var visible = true;
  var io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) kick(); }, { threshold: 0 });
  io.observe(stageEl);
  function onVis() { if (!document.hidden) kick(); }
  document.addEventListener('visibilitychange', onVis);

  /* ---------- petlja ---------- */
  var raf = 0, last = performance.now(), t0 = last, bubbleAcc = 0, smokeAcc = 0;
  var fpsFrames = 0, fpsTime = 0, lowSamples = 0, degraded = false, failed = false, running = false;
  var tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpS = new THREE.Vector3(), tmpP = new THREE.Vector3();
  var worldBowl = new THREE.Vector3();

  function degrade() {
    degraded = true;
    renderer.setPixelRatio(1);
    resize();
    // jednostavnije staklo i manje dima
    if (model.glassMat.transmission) {
      model.glassMat.transmission = 0;
      model.glassMat.opacity = 0.22;
      model.glassMat.depthWrite = false;
      model.glassMat.needsUpdate = true;
    }
    smoke.pool.slice(Math.round(smoke.pool.length / 2)).forEach(function (p) { p.life = 0; p.s.visible = false; p.dead = true; });
  }

  function frame(now) {
    raf = 0;
    if (!visible || document.hidden || failed) { running = false; return; }
    var dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    var t = (now - t0) / 1000;

    // FPS nadzor (prvih ~10 s): ispod 45 -> niži kvalitet; i dalje nisko -> nazad na SVG
    if (t < 12) {
      fpsFrames++;
      fpsTime += dt;
      if (fpsTime >= 2) {
        var fps = fpsFrames / fpsTime;
        fpsFrames = 0;
        fpsTime = 0;
        if (fps < 45) {
          lowSamples++;
          if (!degraded) degrade();
          else if (lowSamples >= 3) { failed = true; if (opts.onFail) opts.onFail('fps'); return; }
        }
      }
    }

    // rotacija: inercija, pa polagano samostalno okretanje
    if (!dragging) {
      rotY += velY * dt;
      velY *= Math.pow(0.08, dt);
      idleFor += dt;
      if (Math.abs(velY) < 0.05 && idleFor > 1.2) rotY += dt * 0.18;
    }
    pivot.rotation.y = rotY;
    pivot.rotation.x = tilt * 0.5;

    // kamera: parallax + skrol (od posude prema vazi, nargila blago izlazi iz kadra)
    pmx += (mx - pmx) * Math.min(1, dt * 3);
    pmy += (my - pmy) * Math.min(1, dt * 3);
    var camY = 0.75 - scrollK * 1.1;
    camera.position.set(pmx * 0.35, camY - pmy * 0.18, 8.2 - scrollK * 0.8);
    camera.lookAt(0, 0.12 - scrollK * 0.9, 0);
    pivot.position.y = scrollK * 0.9;

    // žar: pulsira, jača dok se povlači
    if (pulling) {
      strength = Math.min(1, (performance.now() - pullStart) / 2500);
      heat += (1 - heat) * Math.min(1, dt * 2.5);
      if (meter) meter.style.transform = 'scaleX(' + strength.toFixed(3) + ')';
    } else {
      heat += (0.35 - heat) * Math.min(1, dt * 1.2);
    }
    var flicker = 0.85 + Math.sin(t * 7.3) * 0.06 + Math.sin(t * 13.1) * 0.04 + Math.random() * 0.05;
    model.coals.forEach(function (c, i) { c.material.emissiveIntensity = (0.5 + heat * 1.8) * (flicker + Math.sin(t * 3 + i) * 0.05); });
    ember.intensity = (1.6 + heat * 4.5) * flicker;

    // voda: titranje površine
    var pos = model.surface.geometry.attributes.position;
    var base = model.surfBase;
    var amp = 0.006 + heat * 0.01 + (pulling ? 0.012 : 0);
    for (var i = 0; i < pos.count; i++) {
      var x = base[i * 3], z = base[i * 3 + 2];
      pos.array[i * 3 + 1] = base[i * 3 + 1] + Math.sin(x * 9 + t * 2.4) * amp + Math.cos(z * 8 - t * 2) * amp;
    }
    pos.needsUpdate = true;

    // mjehurići: brži i gušći dok se povlači
    var speedMul = pulling ? 3.2 : 1;
    model.bubbleState.forEach(function (b, k) {
      b.y += b.v * speedMul * dt;
      if (b.y > model.wLevel - 0.01) {
        b.y = 0.05;
        var a = Math.random() * TAU, r = Math.random() * 0.05;
        b.x = Math.cos(a) * r;
        b.z = Math.sin(a) * r;
      }
      tmpP.set(b.x + Math.sin(t * 3 + b.ph) * 0.02, b.y, b.z);
      tmpS.setScalar(pulling || k % 2 === 0 ? b.s : 0.0001);
      tmpM.compose(tmpP, tmpQ, tmpS);
      model.bubbles.setMatrixAt(k, tmpM);
    });
    model.bubbles.instanceMatrix.needsUpdate = true;

    // dim iz posude
    model.group.updateMatrixWorld();
    worldBowl.copy(model.bowlTop).applyMatrix4(model.group.matrixWorld);
    smokeAcc += dt * (pulling ? 14 : 3.2);
    while (smokeAcc >= 1) {
      smokeAcc -= 1;
      smoke.spawn(worldBowl, { vx: (Math.random() - 0.5) * 0.12, vy: 0.35 + Math.random() * 0.25, vz: (Math.random() - 0.5) * 0.12, life: 3 + Math.random() * 2, r0: 0.12, r1: 0.9 + Math.random() * 0.5, a: pulling ? 0.3 : 0.2 });
    }
    smoke.update(dt, t);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
    running = true;
  }

  function kick() {
    if (!raf && !failed) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }

  var controller = {
    canvas: canvas,
    dispose: function () {
      failed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('pointermove', onHover);
      window.removeEventListener('scroll', onScroll);
      if (button) {
        button.removeEventListener('pointerdown', onBtnDown);
        button.removeEventListener('pointerup', releasePull);
        button.removeEventListener('pointerleave', releasePull);
        button.removeEventListener('keydown', onBtnKey);
        button.removeEventListener('keyup', onBtnKeyUp);
        button.removeEventListener('blur', releasePull);
        button.removeEventListener('click', block);
      }
      smoke.dispose();
      model.dispose();
      envRT.dispose();
      renderer.dispose();
      if (renderer.forceContextLoss) renderer.forceContextLoss();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
  };

  // shaderi se kompajliraju asinhrono (bez dugog blokiranja), pa prvi frejm i pretapanje
  var ready = renderer.compileAsync ? renderer.compileAsync(scene, camera) : Promise.resolve();
  return ready.then(function () {
    renderer.render(scene, camera);
    kick();
    return controller;
  });
  }
}
