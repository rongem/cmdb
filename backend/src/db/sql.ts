import sql from 'mssql';
import { env } from '../config/env.js';

let pool: sql.ConnectionPool | null = null;

export async function getSqlPool(): Promise<sql.ConnectionPool | null> {
  if (pool) {
    return pool;
  }

  try {
    pool = new sql.ConnectionPool(env.DATABASE_URL);
    await pool.connect();
    return pool;
  } catch (error) {
    console.warn('SQL connection unavailable. Falling back to in-memory data.', error instanceof Error ? error.message : error);
    pool = null;
    return null;
  }
}

export async function closeSqlPool(): Promise<void> {
  if (pool) {
    await pool.close();
    pool = null;
  }
}
