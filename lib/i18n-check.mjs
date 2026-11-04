/*
 * Provjera prijevoda za jezike koji nisu upisani u same podatke (npr. njemački).
 *
 * Sadržaj (data/*.js) je zapisan kao { bs, en }; prijevod na treći jezik je u rječniku
 * MSP.dict[lang] (npr. data/de.js), po engleskom tekstu. Natpisi su u MSP.strings[lang]
 * (npr. js/strings-de.js) i moraju imati sve ključeve kao engleski.
 *
 * Koristi ga build.mjs (greška ako nešto fali) i scripts/i18n.mjs (spisak teksta za prevođenje).
 */

export const DATA_GLOBALS = ['FLAVORS', 'BRANDS', 'GLOSSARY', 'GUIDE', 'GEAR', 'QUIZ', 'ABOUT', 'COLLECTIONS', 'MIXES', 'LEGAL', 'TIPS',
  'HISTORY', 'HISTORY_MAP', 'HISTORY_CHAPTERS', 'LOUNGES', 'ARTICLES'];

// Polja koja se ne prevode (adrese stavki koriste engleski slug).
const SKIP_KEYS = new Set(['slug']);

/** Svi engleski tekstovi iz podataka koji trebaju prijevod: Map(tekst -> mjesto gdje se prvi put javlja). */
export function contentTexts(sandbox) {
  const out = new Map();
  const add = (s, where) => { if (typeof s === 'string' && s.trim() && !out.has(s)) out.set(s, where); };
  const walk = (v, where) => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, where + '[' + i + ']')); return; }
    if ('en' in v && 'bs' in v && !('de' in v)) {
      if (typeof v.en === 'string') add(v.en, where);
      else if (Array.isArray(v.en)) v.en.forEach((x) => add(x, where));
      else walk(v.en, where + '.en');
      return;
    }
    for (const k of Object.keys(v)) {
      if (SKIP_KEYS.has(k)) continue;
      // engleske varijante koje nisu u { bs, en } (godine i imena u Evoluciji nargile)
      if ((k === 'yEn' || (k === 'en' && 'name' in v)) && typeof v[k] === 'string') { add(v[k], where + '.' + k); continue; }
      walk(v[k], where + '.' + k);
    }
  };
  for (const g of DATA_GLOBALS) if (sandbox[g]) walk(sandbox[g], g);
  return out;
}

/** Ključevi natpisa koji postoje na engleskom, a fale na jeziku `lang`. */
export function missingStrings(strings, lang) {
  const miss = [];
  const walk = (en, other, p) => {
    if (typeof en === 'string') { if (typeof other !== 'string') miss.push(p); return; }
    if (en && typeof en === 'object') for (const k of Object.keys(en)) walk(en[k], other && other[k], p ? p + '.' + k : k);
  };
  walk(strings.en, strings[lang], '');
  return miss;
}

/** Tekstovi iz podataka bez prijevoda u rječniku jezika `lang`. */
export function missingContent(sandbox, lang) {
  const D = (sandbox.MSP.dict && sandbox.MSP.dict[lang]) || {};
  const miss = [];
  for (const [s, where] of contentTexts(sandbox)) if (D[s] == null) miss.push({ text: s, where });
  return miss;
}
