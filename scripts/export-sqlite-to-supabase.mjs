import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";
const dbPath = process.argv[2] || path.join(process.cwd(), "data", "platform.db");
const db = new DatabaseSync(dbPath);
const q = (v) => v === null || v === undefined ? "NULL" : typeof v === "number" ? String(v) : `'${String(v).replaceAll("'", "''")}'`;
const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name").all();
console.log('-- BTE SQLite -> Supabase Postgres export');
console.log('-- Review in Supabase SQL Editor before applying. Run with: node scripts/export-sqlite-to-supabase.mjs > supabase/migration.sql');
for (const table of tables) {
  let ddl = table.sql.replaceAll('INTEGER PRIMARY KEY AUTOINCREMENT','BIGSERIAL PRIMARY KEY').replaceAll('INTEGER PRIMARY KEY','BIGINT PRIMARY KEY').replaceAll('REAL','DOUBLE PRECISION').replaceAll("datetime('now')",'CURRENT_TIMESTAMP').replaceAll('INSERT OR IGNORE','INSERT');
  ddl = ddl.replace(/CHECK\s*\([^)]*\)/gi, '').replace(/,\s*\)/g, '\n)');
  console.log(`\n-- ${table.name}\n${ddl};`);
  const cols = db.prepare(`PRAGMA table_info("${table.name.replaceAll('"','""')}")`).all().map(c => c.name);
  const rows = db.prepare(`SELECT * FROM "${table.name.replaceAll('"','""')}"`).all();
  for (const row of rows) {
    console.log(`INSERT INTO "${table.name}" (${cols.map(c=>`"${c}"`).join(', ')}) VALUES (${cols.map(c=>q(row[c])).join(', ')}) ON CONFLICT DO NOTHING;`);
  }
}
