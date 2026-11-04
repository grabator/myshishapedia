/*
 * Spisak teksta koji treba prevesti na jezik (npr. node scripts/i18n.mjs de).
 * Ispiše JSON { "engleski tekst": "" } za sve što fali u rječniku (data/<lang>.js)
 * i spisak natpisa koji fale u js/strings-<lang>.js.
 *   node scripts/i18n.mjs de            -> broj i spisak koji fali
 *   node scripts/i18n.mjs de --json     -> samo JSON za prevođenje
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { DATA_GLOBALS, missingStrings, missingContent } from '../lib/i18n-check.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const lang = process.argv[2] || 'de';
const sandbox = { console };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const files = ['site.config.js', 'js/strings.js', 'js/strings-' + lang + '.js', 'data/' + lang + '.js']
  .concat(fs.readdirSync(path.join(ROOT, 'data')).filter((f) => f.endsWith('.js') && f !== lang + '.js').map((f) => 'data/' + f));
for (const f of files) if (fs.existsSync(path.join(ROOT, f))) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sandbox, { filename: f });
void DATA_GLOBALS;

const mc = missingContent(sandbox, lang);
const ms = missingStrings(sandbox.MSP.strings, lang);
if (process.argv.includes('--json')) {
  process.stdout.write(JSON.stringify(Object.fromEntries(mc.map((x) => [x.text, ''])), null, 1));
} else {
  console.log(`${lang}: ${mc.length} tekstova iz podataka i ${ms.length} natpisa bez prijevoda`);
  ms.slice(0, 50).forEach((k) => console.log('  natpis: ' + k));
  mc.slice(0, 50).forEach((x) => console.log('  tekst (' + x.where + '): ' + x.text.slice(0, 80)));
}
