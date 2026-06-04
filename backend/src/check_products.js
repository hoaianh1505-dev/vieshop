import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve('.env') });

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vieshop',
  multipleStatements: true,
});

console.log('Cleaning up database products, orders, and cart items...');
await connection.query(`
  SET FOREIGN_KEY_CHECKS = 0;
  TRUNCATE TABLE product_images;
  TRUNCATE TABLE cart_items;
  TRUNCATE TABLE order_items;
  TRUNCATE TABLE orders;
  TRUNCATE TABLE products;
  SET FOREIGN_KEY_CHECKS = 1;
`);

const [rows] = await connection.query('SELECT id, name, sku FROM products');
console.log('Cleanup complete. Current products in database:', rows);
await connection.end();
