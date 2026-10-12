import { Pool } from 'pg';

const globalForPg = globalThis as unknown as { pool?: Pool };

export const db =
  globalForPg.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pool = db;
