import { pool } from '../config/db.js';

export const getDashboardMetrics = async () => {
  const [[productRow]] = await pool.query('SELECT COUNT(*) AS total_products FROM products');
  const [[orderRow]] = await pool.query('SELECT COUNT(*) AS total_orders FROM orders');
  const [[userRow]] = await pool.query("SELECT COUNT(*) AS total_users FROM users WHERE role = 'user'");
  const [[revenueRow]] = await pool.query(
    "SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE status = 'completed'",
  );

  return {
    total_products: productRow.total_products,
    total_orders: orderRow.total_orders,
    total_users: userRow.total_users,
    total_revenue: Number(revenueRow.total_revenue),
  };
};
