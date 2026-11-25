// Pravi static/models/nargila.glb iz OBJ modela (3ds Max izvoz): Z gore u Y gore, bez UV-a, pojednostavljeno (~33k trouglova) i kvantizovano.
// Upotreba: node scripts/hookah3d/model.mjs 0.12 0.003 (u folderu sa hookah.obj; treba obj2gltf, @gltf-transform/*, meshoptimizer).
import obj2gltf from 'obj2gltf';
import fs from 'fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, quantize, dedup, prune, join, flatten } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
const glb = await obj2gltf('hookah.obj', { binary: true, inputUpAxis: 'Z', outputUpAxis: 'Y' });
fs.writeFileSync('raw.glb', glb);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read('raw.glb');
const root = doc.getRoot();
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const uv = p.getAttribute('TEXCOORD_0'); if (uv) { p.setAttribute('TEXCOORD_0', null); } }
await doc.transform(dedup(), weld({ tolerance: 0.0001 }), simplify({ simplifier: MeshoptSimplifier, ratio: +process.argv[2] || 0.3, error: +process.argv[3] || 0.0008 }), prune());
// statistika
let tris = 0;
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const n = p.getIndices() ? p.getIndices().getCount() / 3 : p.getAttribute('POSITION').getCount() / 3; tris += n; console.log(m.getName(), Math.round(n)); }
console.log('tris', Math.round(tris));
await doc.transform(quantize({ quantizePosition: 14, quantizeNormal: 10 }));
await io.write('nargila.glb', doc);
console.log('size', fs.statSync('nargila.glb').size);
