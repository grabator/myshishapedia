// Pakuje scripts/studio3d/src.js u js/studio3d.js (ES modul, učitava se tek kad se otvori Bowl Studio).
// Treba esbuild i three@0.160.0 (npm i --no-save esbuild three@0.160.0), pa: node scripts/studio3d/build.mjs
// Model glave: scripts/studio3d/model.mjs pravi static/models/bowl-egypt.glb.
import { build } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
await build({
  entryPoints: [path.join(here, 'src.js')],
  outfile: path.join(here, '../../js/studio3d.js'),
  bundle: true, format: 'esm', minify: true, target: 'es2019', legalComments: 'eof',
  banner: { js: '/* MyShishapedia Bowl Studio 3D. Sadrži three.js (MIT licenca, (c) three.js authors). Izvor: scripts/studio3d/src.js */' }
});
console.log('js/studio3d.js gotov');
