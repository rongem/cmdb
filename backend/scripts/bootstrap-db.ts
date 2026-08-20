import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sql from 'mssql';
import { env } from '../src/config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrapDatabase() {
  const pool = new sql.ConnectionPool(env.DATABASE_URL);

  await pool.connect();

  const schemaPath = path.resolve(__dirname, '../../sql/mssql-2022-schema.sql');
  const script = fs.readFileSync(schemaPath, 'utf8');

  const batches = script.split(/\bGO\b\s*/gi).filter((batch) => batch.trim().length > 0);

  for (const batch of batches) {
    await pool.request().query(batch.trim());
  }

  console.log(`Database schema bootstrap completed for ${env.DATABASE_URL.match(/Database=([^;]+)/)?.[1] ?? 'cmdb_dev'}.`);
  await pool.close();
}

bootstrapDatabase().catch((error) => {
  console.error('Database bootstrap failed:', error);
  process.exit(1);
});
