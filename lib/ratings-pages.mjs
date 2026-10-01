/*
 * MyShishapedia - ocjene: pomoćne funkcije samo za Cloudflare Pages Functions.
 * (Lokalni lažni API u serve.mjs ih ne koristi.)
 */
import { IDS_PATH, json } from './ratings-core.mjs';

let idsCache = null;
let idsAt = 0;

/** Dozvoljeni id-jevi (dist/ratings-ids.json, čita se preko env.ASSETS i čuva par minuta u memoriji). */
export async function loadIds(context) {
  const now = Date.now();
  if (idsCache && now - idsAt < 5 * 60 * 1000) return idsCache;
  const res = await context.env.ASSETS.fetch(new URL(IDS_PATH, context.request.url));
  if (!res.ok) throw new Error('ratings-ids.json: ' + res.status);
  idsCache = await res.json();
  idsAt = now;
  return idsCache;
}

/** Baza nije povezana (binding DB) -> 503, a stranica tada ocjene jednostavno ne prikazuje. */
export function notConfigured() {
  return json({ error: 'not-configured' }, 503);
}

/** Ključ za keš svih ocjena na Cloudflare rubu (isti za sve posjetioce). */
export function allCacheKey(request) {
  const u = new URL(request.url);
  return new Request(u.origin + '/api/ratings', { method: 'GET' });
}
