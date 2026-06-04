import fs from 'node:fs/promises';
import path from 'node:path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve('backend/.env') });

const databaseUrl = new URL(
  process.env.DATABASE_URL ||
    `mysql://${encodeURIComponent(process.env.DB_USER || 'root')}:${encodeURIComponent(process.env.DB_PASSWORD || '')}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '3306'}/${process.env.DB_NAME || 'vieshop'}`,
);

const connection = await mysql.createConnection({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port || 3306),
  user: decodeURIComponent(databaseUrl.username),
  password: decodeURIComponent(databaseUrl.password),
  database: databaseUrl.pathname.replace(/^\//, ''),
  multipleStatements: true,
});

const sql = await fs.readFile(path.resolve('backend/database/seeders/seed.sql'), 'utf8');
await connection.query(sql);
await connection.end();

console.log('Seed completed.');
