import path from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const buildDatabaseUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '3306';
  const user = encodeURIComponent(process.env.DB_USER || 'root');
  const password = encodeURIComponent(process.env.DB_PASSWORD || '');
  const database = process.env.DB_NAME || 'vieshop';

  return `mysql://${user}:${password}@${host}:${port}/${database}`;
};

export const env = {
  port: Number(process.env.PORT || 5000),
  databaseUrl: buildDatabaseUrl(),
  jwtSecret: process.env.JWT_SECRET || 'change-me',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};
