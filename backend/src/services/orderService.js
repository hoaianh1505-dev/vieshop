import { pool, withTransaction } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

const hydrateItems = async (orderId, conn = pool) => {
  const [items] = await conn.query(
    `SELECT id, product_id, product_name, product_price, quantity, line_total, primary_image_url
     FROM order_items WHERE order_id = ? ORDER BY id ASC`,
    [orderId],
  );
  return items.map((item) => ({
    ...item,
    product_price: Number(item.product_price),
    line_total: Number(item.line_total),
  }));
};

const formatOrder = (row) => ({
  ...row,
  subtotal: Number(row.subtotal),
  shipping_fee: Number(row.shipping_fee),
  total_amount: Number(row.total_amount),
});

export const listOrders = async (user) => {
  const isAdmin = user.role === 'admin';
  const [rows] = await pool.query(
    `SELECT id, user_id, order_code, status, payment_status, subtotal, shipping_fee, total_amount,
            customer_name, customer_email, customer_phone, shipping_address, note, created_at, updated_at
     FROM orders
     ${isAdmin ? '' : 'WHERE user_id = ?'}
     ORDER BY created_at DESC`,
    isAdmin ? [] : [user.id],
  );
  return rows.map(formatOrder);
};

export const findOrderById = async (id, user) => {
  const isAdmin = user.role === 'admin';
  const [rows] = await pool.query(
    `SELECT id, user_id, order_code, status, payment_status, subtotal, shipping_fee, total_amount,
            customer_name, customer_email, customer_phone, shipping_address, note, created_at, updated_at
     FROM orders WHERE id = ? ${isAdmin ? '' : 'AND user_id = ?'}`,
    isAdmin ? [id] : [id, user.id],
  );
  const order = rows[0];
  if (!order) throw new ApiError(404, 'Order not found');
  return { ...formatOrder(order), items: await hydrateItems(order.id) };
};

export const createOrder = async (body, userId) => {
  return withTransaction(async (conn) => {
    const productIds = body.items.map((i) => i.product_id);
    const [products] = await conn.query(
      `SELECT id, name, price, stock, thumbnail_url FROM products
       WHERE id IN (${productIds.map(() => '?').join(',')}) AND status = 'active'`,
      productIds,
    );

    if (products.length !== productIds.length) {
      throw new ApiError(400, 'Some products are unavailable');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;
    const itemRows = [];

    for (const item of body.items) {
      const product = productMap.get(item.product_id);
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }
      const lineTotal = Number(product.price) * item.quantity;
      subtotal += lineTotal;
      itemRows.push([item.product_id, product.name, Number(product.price), item.quantity, lineTotal, product.thumbnail_url]);
    }

    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const totalAmount = subtotal + shippingFee;
    const orderCode = `OD${Date.now()}`;

    const [orderResult] = await conn.query(
      `INSERT INTO orders (user_id, order_code, status, payment_status, subtotal, shipping_fee, total_amount,
        customer_name, customer_email, customer_phone, shipping_address, note)
       VALUES (?, ?, 'pending', 'unpaid', ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, orderCode, subtotal, shippingFee, totalAmount,
       body.customer_name, body.customer_email, body.customer_phone, body.shipping_address, body.note || ''],
    );

    const orderItems = itemRows.map((row) => [orderResult.insertId, ...row]);
    await conn.query(
      'INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, line_total, primary_image_url) VALUES ?',
      [orderItems],
    );

    for (const item of body.items) {
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    return orderResult.insertId;
  });
};

export const updateOrderStatus = async (id, { status, payment_status }) => {
  const [result] = await pool.query(
    'UPDATE orders SET status = ?, payment_status = COALESCE(?, payment_status) WHERE id = ?',
    [status, payment_status || null, id],
  );
  if (!result.affectedRows) throw new ApiError(404, 'Order not found');
};
