// Pravi static/models/bowl-egypt.glb iz modela "Serp hookah bowl" (matvey.kyl, Sketchfab, CC-BY-4.0):
// bez pomoćnog dijela (Extrude_7), pojednostavljeno, tekstura 1024 px, kvantizovano i meshopt kompresija.
// Upotreba: node scripts/studio3d/model.mjs ulaz.glb izlaz.glb (treba @gltf-transform/*, meshoptimizer, sharp).
import fs from 'fs';
import sharp from 'sharp';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, simplify, quantize, dedup, prune, meshopt, reorder, textureCompress } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const [src, out] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(src);
const root = doc.getRoot();
for (const n of root.listNodes()) {
  const m = n.getMesh();
  if (m && m.listPrimitives().some((p) => p.getMaterial() && p.getMaterial().getName() === 'Extrude_7__0')) n.setMesh(null);
}
await doc.transform(prune(), dedup(), weld({ tolerance: 0.0001 }), simplify({ simplifier: MeshoptSimplifier, ratio: 0.35, error: 0.0008, lockBorder: true }), prune(),
  textureCompress({ encoder: sharp, targetFormat: 'jpeg', resize: [1024, 1024], quality: 82 }));
let tris = 0; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) tris += p.getIndices().getCount() / 3;
console.log('tris', Math.round(tris));
await doc.transform(reorder({ encoder: MeshoptEncoder }), quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(out, doc);
console.log('size', fs.statSync(out).size);
