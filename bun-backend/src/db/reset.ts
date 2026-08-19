import sql from 'mssql';
import { env } from '../config/env';

async function reset() {
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
  await pool.request().query(`
    DECLARE @sql NVARCHAR(MAX) = N'';
    SELECT @sql += 'DROP TABLE IF EXISTS ' + QUOTENAME(SCHEMA_NAME(schema_id)) + '.' + QUOTENAME(name) + ';\n'
    FROM sys.tables
    WHERE schema_id = SCHEMA_ID('dbo');
    EXEC sp_executesql @sql;
  `);

  console.log(`All tables in ${env.dbName} were dropped.`);
  await pool.close();
}

reset().catch((error) => {
  console.error('DB reset failed:', error);
  process.exit(1);
});
