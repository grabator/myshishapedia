// Pravi static/models/nargila.glb iz OBJ modela (3ds Max izvoz): Z gore u Y gore, bez UV-a, bez dugog crijeva i drške,
// pojednostavljeno (~52k trouglova, ivice dijelova zaključane da nema pukotina), kvantizovano i meshopt kompresija.
// Upotreba: node scripts/hookah3d/model.mjs 0.2 0.0015 (u folderu sa hookah.obj; treba obj2gltf, @gltf-transform/*, meshoptimizer).
import obj2gltf from 'obj2gltf';
import fs from 'fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { weld, simplify, quantize, dedup, prune, meshopt, reorder } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const DROP = ['Rectangle002', 'Object004', 'Line005'];
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const glb = await obj2gltf('hookah.obj', { binary: true, inputUpAxis: 'Z', outputUpAxis: 'Y' });
fs.writeFileSync('raw.glb', glb);
const doc = await io.read('raw.glb');
const root = doc.getRoot();
for (const n of root.listNodes()) { const m = n.getMesh(); const nm = (m && m.getName()) || n.getName() || ''; if (DROP.some((d) => nm.indexOf(d) === 0 || (n.getName()||'').indexOf(d) === 0)) { n.dispose(); } }
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) p.setAttribute('TEXCOORD_0', null);
await doc.transform(prune(), dedup(), weld({ tolerance: 0.0001 }), simplify({ simplifier: MeshoptSimplifier, ratio: +process.argv[2] || 0.2, error: +process.argv[3] || 0.0015, lockBorder: true }), prune());
let tris = 0; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const n = p.getIndices().getCount() / 3; tris += n; console.log(m.getName(), Math.round(n)); }
console.log('tris', tris);
await doc.transform(reorder({ encoder: MeshoptEncoder }), quantize({ quantizePosition: 14, quantizeNormal: 10 }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write('nargila.glb', doc);
console.log('size', fs.statSync('nargila.glb').size);
