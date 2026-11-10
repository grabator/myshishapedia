/*
 * Mala zamjena za Cloudflare D1 nad ugrađenim SQLite-om u Node-u (node:sqlite).
 * Samo za lokalni server (serve.mjs) i testove: isti SQL i isti API kao D1
 * (prepare().bind().first() / all() / run(), batch()).
 */
import { DatabaseSync } from 'node:sqlite';

class Stmt {
  constructor(db, sql, params) { this.db = db; this.sql = sql; this.params = params || []; }
  bind(...params) { return new Stmt(this.db, this.sql, params); }
  _s() { return this.db.prepare(this.sql); }
  async first() { const r = this._s().get(...this.params); return r === undefined ? null : Object.assign({}, r); }
  async all() { return { results: this._s().all(...this.params).map((r) => Object.assign({}, r)), success: true }; }
  async run() { const r = this._s().run(...this.params); return { success: true, meta: { changes: Number(r.changes), last_row_id: Number(r.lastInsertRowid) } }; }
}

export class D1Sqlite {
  constructor(file) { this.db = new DatabaseSync(file || ':memory:'); }
  prepare(sql) { return new Stmt(this.db, sql); }
  async batch(stmts) {
    this.db.exec('BEGIN');
    try {
      const out = [];
      for (const s of stmts) out.push(await s.run());
      this.db.exec('COMMIT');
      return out;
    } catch (e) {
      this.db.exec('ROLLBACK');
      throw e;
    }
  }
  async exec(sql) { this.db.exec(sql); return { count: 1 }; }
}
