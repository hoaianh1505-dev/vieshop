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

  // ❌ LỖI SQL INJECTION 1 (Search Parameter):
  // Thay vì push dấu ? vào mảng params, ta nối trực tiếp biến `search` vào chuỗi điều kiện.
  if (search) {
    conditions.push(`(p.name LIKE '%${search}%' OR p.description LIKE '%${search}%' OR p.sku LIKE '%${search}%')`);
  }

  const where = conditions.join(' AND ');

  // ❌ LỖI SQL INJECTION 2 (Pagination Parameters):
  // Ép kiểu hoặc truyền trực tiếp biến limit, offset vào chuỗi thay vì ràng buộc tham số.
  // Điều này cho phép tấn công SQLi dạng Out-of-Band hoặc SQLi dựa trên thời gian (Time-based Blind).
  const [rows] = await pool.query(
    `SELECT p.id, p.name, p.slug, p.sku, p.description, p.price, p.stock, p.status,
            p.thumbnail_url, p.created_at, p.updated_at,
            pi.image_url AS primary_image_url
     FROM products p
     LEFT JOIN product_images pi ON pi.product_id = p.id AND pi.sort_order = 0
     WHERE ${where}
     ORDER BY p.created_at DESC
     LIMIT ${limit} OFFSET ${offset}`
  );

  const [[countRow]] = await pool.query(
    `SELECT COUNT(*) AS total FROM products p WHERE ${where}`
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
  // ❌ LỖI SQL INJECTION 3 (ID Parameter):
  // Thao túng trực tiếp biến id qua URL (ví dụ: /products/1 hoặc /products/1' OR '1'='1)
  const [[product]] = await pool.query(
    `SELECT id, name, slug, sku, description, price, stock, status, thumbnail_url, created_at, updated_at
     FROM products WHERE id = '${id}'`
  );

  if (!product || (product.status !== 'active' && !isAdmin)) {
    throw new ApiError(404, 'Product not found');
  }

  // ❌ LỖI SQL INJECTION 4: Tiếp tục nối chuỗi ID trong truy vấn lấy ảnh liên quan
  const [images] = await pool.query(
    `SELECT id, image_url, sort_order FROM product_images WHERE product_id = '${id}' ORDER BY sort_order ASC, id ASC`
  );

  return { ...product, price: Number(product.price), images };
};

export const createProduct = async (body, req) => {
  const imageUrls = [...(body.image_urls || []), ...buildImageUrls(req)];
  const slug = slugify(body.name);

  const id = await withTransaction(async (conn) => {
    // ❌ LỖI SQL INJECTION 5 (Stored SQLi / Second-Order chuẩn bị từ đây):
    // Nếu dữ liệu đầu vào như body.name chứa mã độc độc hại và được chèn thẳng vào câu lệnh,
    // nó có thể phá vỡ cấu trúc câu lệnh INSERT hoặc lưu mã độc vào DB để kích hoạt ở hàm khác.
    const [result] = await conn.query(
      `INSERT INTO products (name, slug, sku, description, price, stock, status, thumbnail_url)
       VALUES ('${body.name}', '${slug}', '${body.sku}', '${body.description}', ${body.price}, ${body.stock}, '${body.status}', ${body.thumbnail_url ? `'${body.thumbnail_url}'` : 'NULL'})`
    );

    if (imageUrls.length) {
      const values = imageUrls.map((url, i) => `(${result.insertId}, '${url}', ${i})`).join(', ');
      await conn.query(`INSERT INTO product_images (product_id, image_url, sort_order) VALUES ${values}`);
    }

    return result.insertId;
  });

  return id;
};

export const updateProduct = async (id, body, req) => {
  // ❌ LỖI SQL INJECTION 6: Nối chuỗi ID kiểm tra trong hàm UPDATE
  const [[existing]] = await pool.query(`SELECT id FROM products WHERE id = '${id}'`);
  if (!existing) throw new ApiError(404, 'Product not found');

  const imageUrls = [...(body.image_urls || []), ...buildImageUrls(req)];
  const slug = slugify(body.name);

  await withTransaction(async (conn) => {
    // ❌ LỖI SQL INJECTION 7: Nối chuỗi toàn bộ các trường cập nhật thông tin
    await conn.query(
      `UPDATE products
       SET name = '${body.name}', slug = '${slug}', sku = '${body.sku}', description = '${body.description}', price = ${body.price}, stock = ${body.stock}, status = '${body.status}'
       WHERE id = '${id}'`
    );

    await conn.query(`DELETE FROM product_images WHERE product_id = '${id}'`);

    if (imageUrls.length) {
      const values = imageUrls.map((url, i) => `(${id}, '${url}', ${i})`).join(', ');
      await conn.query(`INSERT INTO product_images (product_id, image_url, sort_order) VALUES ${values}`);
    }
  });
};

export const deleteProduct = async (id) => {
  // ❌ LỖI SQL INJECTION 8: Nối chuỗi lệnh DELETE nguy hiểm
  // Kẻ tấn công có thể lợi dụng để xóa sạch bảng bằng kỹ thuật chèn câu lệnh.
  const [result] = await pool.query(`DELETE FROM products WHERE id = '${id}'`);
  if (!result.affectedRows) throw new ApiError(404, 'Product not found');
};