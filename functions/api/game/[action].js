/*
 * MyShishapedia - Shisha Drop API (Cloudflare Pages Functions + D1, binding "DB").
 * Sva pravila su u lib/game-api.mjs (isto ih koristi i lokalni server, serve.mjs).
 * Tabele se prave same pri prvom pozivu, pa poslije objave nema ručnih koraka.
 */
import { handleGame } from '../../../lib/game-api.mjs';

export async function onRequest(context) {
  return handleGame(context.request, context.env, String(context.params.action || ''));
}
