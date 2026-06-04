import { pool, withTransaction } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { slugify } from '../utils/slugify.js';

const buildImageUrls = (req) =>
  (req.files || []).map((file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 8), 1), 24);
  const offset = (page - 1) * limit;
  const search = (req.query.search || '').trim();
  const includeDrafts = req.query.includeDrafts === 'true' && req.user?.role === 'admin';

  const conditions = includeDrafts ? ['1 = 1'] : ["p.status = 'active'"];
  const params = [];

  if (search) {
    conditions.push('(p.name LIKE ? OR p.description LIKE ? OR p.sku LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  const whereClause = conditions.join(' AND ');
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.slug, p.sku, p.description, p.price, p.stock, p.status, p.thumbnail_url,
            p.created_at, p.updated_at, pi.image_url AS primary_image_url
     FROM products p
     LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
     WHERE ${whereClause}
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const [[countRow]] = await pool.query(
    `SELECT COUNT(*) AS total
     FROM products p
     WHERE ${whereClause}`,
    params,
  );

  res.json({
    items: rows.map((row) => ({
      ...row,
      price: Number(row.price),
      primary_image_url: row.primary_image_url || row.thumbnail_url,
    })),
    pagination: {
      page,
      limit,
      total: countRow.total,
      totalPages: Math.max(Math.ceil(countRow.total / limit), 1),
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const [[product]] = await pool.query(
    `SELECT id, name, slug, sku, description, price, stock, status, thumbnail_url, created_at, updated_at
     FROM products
     WHERE id = ?`,
    [req.params.id],
  );

  if (!product || (product.status !== 'active' && req.user?.role !== 'admin')) {
    throw new ApiError(404, 'Product not found');
  }

  const [images] = await pool.query(
    'SELECT id, image_url, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC, id ASC',
    [req.params.id],
  );

  res.json({
    ...product,
    price: Number(product.price),
    images,
  });
});

export const createProduct = asyncHandler(async (req, res) => {
  const imageUrls = [...req.body.image_urls, ...buildImageUrls(req)];
  const slug = slugify(req.body.name);

  const product = await withTransaction(async (connection) => {
    const [result] = await connection.query(
      `INSERT INTO products (name, slug, sku, description, price, stock, status, thumbnail_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.body.name,
        slug,
        req.body.sku,
        req.body.description,
        req.body.price,
        req.body.stock,
        req.body.status,
        req.body.thumbnail_url || imageUrls[0] || null,
      ],
    );

    if (imageUrls.length) {
      const values = imageUrls.map((imageUrl, index) => [result.insertId, imageUrl, index]);
      await connection.query(
        'INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?',
        [values],
      );
    }

    return result.insertId;
  });

  res.status(201).json({ message: 'Product created', id: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const [[existing]] = await pool.query('SELECT id FROM products WHERE id = ?', [req.params.id]);
  if (!existing) {
    throw new ApiError(404, 'Product not found');
  }

  const imageUrls = [...req.body.image_urls, ...buildImageUrls(req)];
  const slug = slugify(req.body.name);

  await withTransaction(async (connection) => {
    await connection.query(
      `UPDATE products
       SET name = ?, slug = ?, sku = ?, description = ?, price = ?, stock = ?, status = ?, thumbnail_url = ?
       WHERE id = ?`,
      [
        req.body.name,
        slug,
        req.body.sku,
        req.body.description,
        req.body.price,
        req.body.stock,
        req.body.status,
        req.body.thumbnail_url || imageUrls[0] || null,
        req.params.id,
      ],
    );

    await connection.query('DELETE FROM product_images WHERE product_id = ?', [req.params.id]);

    if (imageUrls.length) {
      const values = imageUrls.map((imageUrl, index) => [req.params.id, imageUrl, index]);
      await connection.query(
        'INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?',
        [values],
      );
    }
  });

  res.json({ message: 'Product updated' });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
  if (!result.affectedRows) {
    throw new ApiError(404, 'Product not found');
  }
  res.json({ message: 'Product deleted' });
});
