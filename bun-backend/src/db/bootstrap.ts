import fs from 'node:fs';
import sql from 'mssql';
import { env } from '../config/env';

const schemaPath = new URL('../../../sql/mssql-2022-schema.sql', import.meta.url);

async function bootstrap() {
  const pool = new sql.ConnectionPool({
    server: env.dbHost,
    port: env.dbPort,
    database: env.dbName,
    user: env.dbUser,
    password: env.dbPassword,
    options: {
      encrypt: env.dbEncrypt,
      trustServerCertificate: env.dbTrustServerCertificate,
      enableArithAbort: true,
    },
  });

  await pool.connect();
  const sqlScript = fs.readFileSync(schemaPath, 'utf8');

  for (const batch of sqlScript.split(/GO\s*\r?\n/i)) {
    const statement = batch.trim();
    if (!statement) continue;
    await pool.request().query(statement);
  }

  console.log(`Schema created successfully in database ${env.dbName}.`);
  await pool.close();
}

bootstrap().catch((error) => {
  console.error('DB bootstrap failed:', error);
  process.exit(1);
});
