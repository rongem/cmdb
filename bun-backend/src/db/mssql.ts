import sql from 'mssql';
import { env } from '../config/env';

export const sqlConfig = {
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
  pool: {
    max: 10,
    min: 1,
    idleTimeoutMillis: 30000,
  },
} as const;

let pool: any = null;

export async function getPool(): Promise<any> {
  if (!pool) {
    pool = new sql.ConnectionPool(sqlConfig);
  }

  if (!pool.connected) {
    await pool.connect();
  }

  return pool;
}

export async function closePool(): Promise<void> {
  if (pool && pool.connected) {
    await pool.close();
  }
  pool = null;
}

export async function query<T = Record<string, unknown>>(text: string): Promise<T[]> {
  const currentPool = await getPool();
  const result = await currentPool.request().query(text);
  return result.recordset as T[];
}
