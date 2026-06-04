import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { slugify } from '../utils/slugify.js';
import { withTransaction } from '../config/db.js';

// ─── Helpers ────────────────────────────────────────────────────────────────

const buildImageUrls = (req) =>
  (req.files || []).map(
    (file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
  );

// ─── Queries ─────────────────────────────────────────────────────────────────

export const listProducts = async ({ page, limit, search, includeDrafts }) => {
  const offset = (page - 1) * limit;
  const conditions = includeDrafts ? ['1 = 1'] : ["p.status = 'active'"];
  const params = [];

  if (search) {
    conditions.push('(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const where = conditions.join(' AND ');

  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.slug, p.sku, p.description, p.price, p.stock, p.status,
            p.thumbnail_url, p.created_at, p.updated_at,
            pi.image_url AS primary_image_url
     FROM products p
     LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
     WHERE ${where}
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const [[countRow]] = await pool.query(
    `SELECT COUNT(*) AS total FROM products p WHERE ${where}`,
    params,
  );

  return {
    items: rows.map((r) => ({ ...r, price: Number(r.price), primary_image_url: r.primary_image_url || r.thumbnail_url })),
    pagination: {
      page, limit,
      total: countRow.total,
      totalPages: Math.max(Math.ceil(countRow.total / limit), 1),
    },
  };
};

export const findProductById = async (id, isAdmin = false) => {
  const [[product]] = await pool.query(
    `SELECT id, name, slug, sku, description, price, stock, status, thumbnail_url, created_at, updated_at
     FROM products WHERE id = ?`,
    [id],
  );

  if (!product || (product.status !== 'active' && !isAdmin)) {
    throw new ApiError(404, 'Product not found');
  }

  const [images] = await pool.query(
    'SELECT id, image_url, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [id],
  );

  return { ...product, price: Number(product.price), images };
};

export const createProduct = async (body, req) => {
  const imageUrls = [...(body.image_urls || []), ...buildImageUrls(req)];
  const slug = slugify(body.name);

  const id = await withTransaction(async (conn) => {
    const [result] = await conn.query(
      `INSERT INTO products (name, slug, sku, description, price, stock, status, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [body.name, slug, body.sku, body.description, body.price, body.stock, body.status, body.thumbnail_url || imageUrls[0] || null],
    );

    if (imageUrls.length) {
      const values = imageUrls.map((url, i) => [result.insertId, url, i]);
      await conn.query('INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?', [values]);
    }

    return result.insertId;
  });

  return id;
};

export const updateProduct = async (id, body, req) => {
  const [[existing]] = await pool.query('SELECT id FROM products WHERE id = ?', [id]);
  if (!existing) throw new ApiError(404, 'Product not found');

  const imageUrls = [...(body.image_urls || []), ...buildImageUrls(req)];
  const slug = slugify(body.name);

  await withTransaction(async (conn) => {
    await conn.query(
      `UPDATE products
       SET name = ?, slug = ?, sku = ?, description = ?, price = ?, stock = ?, status = ?, thumbnail_url = ?
       WHERE id = ?`,
      [body.name, slug, body.sku, body.description, body.price, body.stock, body.status, body.thumbnail_url || imageUrls[0] || null, id],
    );

    await conn.query('DELETE FROM product_images WHERE product_id = ?', [id]);

    if (imageUrls.length) {
      const values = imageUrls.map((url, i) => [id, url, i]);
      await conn.query('INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?', [values]);
    }
  });
};

export const deleteProduct = async (id) => {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
  if (!result.affectedRows) throw new ApiError(404, 'Product not found');
};
