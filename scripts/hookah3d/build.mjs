// Pakuje scripts/hookah3d/src.js u js/hookah3d.js (ES modul, učitava se tek na početnoj).
// Treba esbuild i three@0.160.0 (npm i --no-save esbuild three@0.160.0), pa: node scripts/hookah3d/build.mjs
// Model: scripts/hookah3d/model.mjs pravi static/models/nargila.glb iz OBJ fajla.
import { build } from 'esbuild';
import path from 'path';
import { fileURLToPath } from 'url';
const here = path.dirname(fileURLToPath(import.meta.url));
await build({
  entryPoints: [path.join(here, 'src.js')],
  outfile: path.join(here, '../../js/hookah3d.js'),
  bundle: true, format: 'esm', minify: true, target: 'es2019', legalComments: 'eof',
  banner: { js: '/* MyShishapedia 3D nargila. Sadrži three.js (MIT licenca, (c) three.js authors). Izvor: scripts/hookah3d/src.js */' }
});
console.log('js/hookah3d.js gotov');
