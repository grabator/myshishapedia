/*
 * MyShishapedia - ocjena jedne stavke.
 *
 *   GET /api/ratings/flavor/<id>   ili   /api/ratings/recipe/<id>
 *   -> { kind, id, avg, count }
 */
import { validItem, summary, json } from '../../../../lib/ratings-core.mjs';
import { loadIds, notConfigured } from '../../../../lib/ratings-pages.mjs';

export async function onRequestGet(context) {
  const { env, params } = context;
  if (!env.DB) return notConfigured();
  let ids;
  try { ids = await loadIds(context); } catch (e) { return json({ error: 'not-ready' }, 503); }
  const kind = String(params.kind || '');
  const id = String(params.id || '');
  if (!validItem(kind, id, ids)) return json({ error: 'unknown-id' }, 404);
  try {
    const row = await env.DB.prepare('SELECT count, sum FROM rating_totals WHERE kind = ?1 AND item_id = ?2').bind(kind, id).first();
    const [avg, count] = summary(Number(row ? row.sum : 0), Number(row ? row.count : 0));
    return json({ kind, id, avg, count }, 200, { 'Cache-Control': 'public, max-age=15' });
  } catch (e) {
    return json({ error: 'db-error' }, 503);
  }
}
