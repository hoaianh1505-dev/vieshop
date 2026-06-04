import { pool, withTransaction } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const hydrateOrderItems = async (orderId, connection = pool) => {
  const [items] = await connection.query(
    `SELECT id, product_id, product_name, product_price, quantity, line_total, primary_image_url
     FROM order_items
     WHERE order_id = ?
     ORDER BY id ASC`,
    [orderId],
  );

  return items.map((item) => ({
    ...item,
    product_price: Number(item.product_price),
    line_total: Number(item.line_total),
  }));
};

export const getOrders = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const [rows] = await pool.query(
    `SELECT id, user_id, order_code, status, payment_status, subtotal, shipping_fee, total_amount,
            customer_name, customer_email, customer_phone, shipping_address, note, created_at, updated_at
     FROM orders
     ${isAdmin ? '' : 'WHERE user_id = ?'}
     ORDER BY created_at DESC`,
    isAdmin ? [] : [req.user.id],
  );

  res.json(
    rows.map((row) => ({
      ...row,
      subtotal: Number(row.subtotal),
      shipping_fee: Number(row.shipping_fee),
      total_amount: Number(row.total_amount),
    })),
  );
});

export const getOrderById = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === 'admin';
  const [rows] = await pool.query(
    `SELECT id, user_id, order_code, status, payment_status, subtotal, shipping_fee, total_amount,
            customer_name, customer_email, customer_phone, shipping_address, note, created_at, updated_at
     FROM orders
     WHERE id = ? ${isAdmin ? '' : 'AND user_id = ?'}`,
    isAdmin ? [req.params.id] : [req.params.id, req.user.id],
  );

  const order = rows[0];
  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  res.json({
    ...order,
    subtotal: Number(order.subtotal),
    shipping_fee: Number(order.shipping_fee),
    total_amount: Number(order.total_amount),
    items: await hydrateOrderItems(order.id),
  });
});

export const createOrder = asyncHandler(async (req, res) => {
  const orderId = await withTransaction(async (connection) => {
    const productIds = req.body.items.map((item) => item.product_id);
    const [products] = await connection.query(
      `SELECT id, name, price, stock, thumbnail_url
       FROM products
       WHERE id IN (${productIds.map(() => '?').join(',')}) AND status = 'active'`,
      productIds,
    );

    if (products.length !== productIds.length) {
      throw new ApiError(400, 'Some products are unavailable');
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    let subtotal = 0;
    const itemRows = [];

    for (const item of req.body.items) {
      const product = productMap.get(item.product_id);

      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }

      const lineTotal = Number(product.price) * item.quantity;
      subtotal += lineTotal;
      itemRows.push([
        item.product_id,
        product.name,
        Number(product.price),
        item.quantity,
        lineTotal,
        product.thumbnail_url,
      ]);
    }

    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const totalAmount = subtotal + shippingFee;
    const orderCode = `OD${Date.now()}`;

    const [orderResult] = await connection.query(
      `INSERT INTO orders (
        user_id, order_code, status, payment_status, subtotal, shipping_fee, total_amount,
        customer_name, customer_email, customer_phone, shipping_address, note
      ) VALUES (?, ?, 'pending', 'unpaid', ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        orderCode,
        subtotal,
        shippingFee,
        totalAmount,
        req.body.customer_name,
        req.body.customer_email,
        req.body.customer_phone,
        req.body.shipping_address,
        req.body.note || '',
      ],
    );

    const orderItems = itemRows.map((item) => [orderResult.insertId, ...item]);
    await connection.query(
      `INSERT INTO order_items (
        order_id, product_id, product_name, product_price, quantity, line_total, primary_image_url
      ) VALUES ?`,
      [orderItems],
    );

    for (const item of req.body.items) {
      await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product_id]);
    }

    return orderResult.insertId;
  });

  res.status(201).json({ message: 'Order placed successfully', id: orderId });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const [result] = await pool.query(
    'UPDATE orders SET status = ?, payment_status = COALESCE(?, payment_status) WHERE id = ?',
    [req.body.status, req.body.payment_status || null, req.params.id],
  );

  if (!result.affectedRows) {
    throw new ApiError(404, 'Order not found');
  }

  res.json({ message: 'Order updated' });
});
