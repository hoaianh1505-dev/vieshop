import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve('.env') });

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

const productsToSeed = [
  {
    name: 'iPhone 17 Pro Max 256GB',
    sku: 'IPHONE-17-PRO-MAX-256',
    price: 34990000,
    stock: 25,
    thumbnail: 'iphone-17-pro-max_3.webp',
    description: 'iPhone 17 Pro Max - Đỉnh cao công nghệ Apple với thiết kế titan siêu bền, camera zoom 10x quang học và chip A19 Pro tiên tiến nhất.',
    images: []
  },
  {
    name: 'Samsung Galaxy S26 Ultra',
    sku: 'SAMSUNG-S26-ULTRA',
    price: 31990000,
    stock: 30,
    thumbnail: 'samsung-galaxy-s26-ultra-1.webp',
    description: 'Samsung Galaxy S26 Ultra - Siêu phẩm flagship Android hàng đầu, trang bị bút S-Pen quyền năng, camera 200MP Zoom Space và kính Gorilla Armor phản quang thấp.',
    images: []
  },
  {
    name: 'Máy quay DJI Osmo Pocket 3 Advanced 4K',
    sku: 'DJI-POCKET-3-ADV',
    price: 14500000,
    stock: 15,
    thumbnail: 'may-quay-chong-rung-dji-osmo-pocket-3-advanced-4k_1.webp',
    description: 'Máy quay chống rung DJI Osmo Pocket 3 - Cảm biến 1 inch mạnh mẽ, hỗ trợ quay 4K/120fps mượt mà, màn hình xoay 2 inch linh hoạt cho các vlogger chuyên nghiệp.',
    images: ['may-quay-chong-rung-dji-osmo-pocket-3-advanced-4k_2.webp']
  },
  {
    name: 'Tai nghe Huawei FreeClip 2',
    sku: 'HUAWEI-FREECLIP-2',
    price: 4990000,
    stock: 40,
    thumbnail: 'tai-nghe-khong-day-huawei-freeclip-2-spa.webp',
    description: 'Tai nghe không dây Huawei FreeClip 2 - Thiết kế C-bridge kẹp tai độc đáo, không gây đau tai khi đeo lâu, mang lại trải nghiệm nghe nhạc mở thoáng đãng và an toàn.',
    images: []
  },
  {
    name: 'Huawei MatePad 11.5 S PaperMatte (2026)',
    sku: 'HUAWEI-MATEPAD-11-5-S',
    price: 10990000,
    stock: 20,
    thumbnail: 'huawei-matepad-11-5-s-2026_1.webp',
    description: 'Máy tính bảng Huawei MatePad 11.5 S - Phiên bản PaperMatte chống chói cao cấp, mang lại cảm giác viết vẽ chân thực như trên giấy, hiệu năng Kirin mạnh mẽ.',
    images: []
  },
  {
    name: 'Oppo Find X9 Ultra 5G',
    sku: 'OPPO-FIND-X9-ULTRA',
    price: 26990000,
    stock: 18,
    thumbnail: 'dien-thoai-oppo-find-x9-ultra-cam-8.webp',
    description: 'Oppo Find X9 Ultra - Mặt lưng da cao cấp màu cam nổi bật, trang bị 2 ống kính tele tiềm vọng kép và thuật toán xử lý ảnh chuyên nghiệp hợp tác với Hasselblad.',
    images: []
  },
  {
    name: 'Apple Watch Series 9 LTE',
    sku: 'APPLE-WATCH-S9-LTE',
    price: 12490000,
    stock: 12,
    thumbnail: 'apple_lte_3_68.webp',
    description: 'Apple Watch Series 9 LTE - Khung nhôm cao cấp kết hợp tính năng kết nối độc lập qua eSIM, màn hình sáng gấp đôi và cử chỉ chạm đúp Double Tap độc đáo.',
    images: []
  },
  {
    name: 'iPhone 17 Pro 256GB Titan',
    sku: 'IPHONE-17-PRO-256',
    price: 29990000,
    stock: 20,
    thumbnail: 'iphone-17-pro-256-gb.webp',
    description: 'iPhone 17 Pro 256GB - Kích thước màn hình tối ưu, sức mạnh hiệu năng tương đương dòng Max, hệ thống camera chuyên nghiệp 3 ống kính siêu nét.',
    images: []
  },
  {
    name: 'Samsung Galaxy A57 5G',
    sku: 'SAMSUNG-GALAXY-A57',
    price: 9490000,
    stock: 50,
    thumbnail: 'dien-thoai-samsung-galaxy-a57-2.webp',
    description: 'Samsung Galaxy A57 - Điện thoại cận cao cấp với màn hình Super AMOLED 120Hz mượt mà, camera chống rung OIS và thời lượng pin sử dụng lên đến 2 ngày.',
    images: []
  },
  {
    name: 'Oppo Find N6 Foldable 5G',
    sku: 'OPPO-FIND-N6-FOLD',
    price: 38990000,
    stock: 10,
    thumbnail: 'oppo-find-n6-0.webp',
    description: 'Oppo Find N6 - Siêu phẩm màn hình gập mỏng nhẹ nhất thế giới, nếp gập tàng hình cùng cấu hình Snapdragon hàng đầu cho trải nghiệm đa nhiệm đỉnh cao.',
    images: []
  },
  {
    name: 'Nubia Neo 5 5G Gaming Phone',
    sku: 'NUBIA-NEO-5-5G',
    price: 5290000,
    stock: 35,
    thumbnail: 'dien-thoai-nubia-neo-5-5g-den.webp',
    description: 'Điện thoại Nubia Neo 5 5G (Đen) - Thiết kế phong cách cơ khí gaming hầm hố, màn hình tần số quét cao mượt mà và hiệu năng chơi game tối ưu trong phân khúc.',
    images: []
  },
  {
    name: 'Huawei MatePad PaperMatte 11.5 inch',
    sku: 'HUAWEI-MATEPAD-PAPERMATTE-11-5',
    price: 8990000,
    stock: 15,
    thumbnail: 'huawei-matepad-papermate-11-5-inch_1_2.webp',
    description: 'Máy tính bảng Huawei MatePad PaperMate 11.5 - Bảo vệ mắt tối đa với màn hình nhám giảm phản xạ ánh sáng, hỗ trợ bút cảm ứng M-Pencil thế hệ mới.',
    images: []
  },
  {
    name: 'Huawei MatePad SE 11 inch',
    sku: 'HUAWEI-MATEPAD-SE-11',
    price: 4590000,
    stock: 22,
    thumbnail: 'huawei-matepad-se-11-inch_1_1.webp',
    description: 'Huawei MatePad SE 11 - Máy tính bảng gia đình tiện lợi, màn hình Full HD rộng rãi, hệ thống loa âm thanh vòm nổi và giao diện HarmonyOS thân thiện.',
    images: []
  },
  {
    name: 'Tai nghe Huawei FreeBuds 5',
    sku: 'HUAWEI-FREEBUDS-5',
    price: 3290000,
    stock: 16,
    thumbnail: 'tai-nghe-khong-day-huawei-freebuds-5-spa.webp',
    description: 'Tai nghe True Wireless Huawei FreeBuds 5 - Thiết kế hình giọt nước công thái học đột phá, chất lượng âm thanh độ phân giải cao Hi-Res và chống ồn chủ động thông minh.',
    images: []
  },
  {
    name: 'Tai nghe True Wireless Huawei FreeBuds 7i',
    sku: 'HUAWEI-FREEBUDS-7I',
    price: 1790000,
    stock: 45,
    thumbnail: 'tai-nghe-bluetooth-true-wireless-huawei-freebuds-7i-_5_.webp',
    description: 'Huawei FreeBuds 7i - Thiết kế kén đá sang trọng, chống ồn chủ động ANC 42dB vượt trội trong tầm giá, thời lượng nghe nhạc bền bỉ lên tới 28 giờ.',
    images: []
  },
  {
    name: 'iPhone 15 Plus 128GB',
    sku: 'IPHONE-15-PLUS-128',
    price: 21990000,
    stock: 18,
    thumbnail: 'iphone-15-plus_1__1.webp',
    description: 'iPhone 15 Plus - Màn hình lớn 6.7 inch rực rỡ, thời lượng pin trâu nhất lịch sử iPhone, cụm đảo động Dynamic Island thông minh tiện lợi.',
    images: ['iphone-15-plus_1__1 (1).webp']
  }
];

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'vieshop',
  multipleStatements: true,
});

console.log('Clearing old products data...');
await connection.query(`
  SET FOREIGN_KEY_CHECKS = 0;
  TRUNCATE TABLE product_images;
  TRUNCATE TABLE cart_items;
  TRUNCATE TABLE order_items;
  TRUNCATE TABLE products;
  SET FOREIGN_KEY_CHECKS = 1;
`);

console.log('Seeding products with user-supplied images...');
const backendUrl = 'http://localhost:5000'; // local static serving address

for (const p of productsToSeed) {
  const slug = slugify(p.name);
  const thumbUrl = `${backendUrl}/uploads/${p.thumbnail}`;
  
  const [result] = await connection.query(
    `INSERT INTO products (name, slug, sku, description, price, stock, status, thumbnail_url)
     VALUES (?, ?, ?, ?, ?, ?, 'active', ?)`,
    [p.name, slug, p.sku, p.description, p.price, p.stock, thumbUrl]
  );
  
  const productId = result.insertId;
  
  // Insert primary image at sort_order = 0
  await connection.query(
    'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)',
    [productId, thumbUrl, 0]
  );
  
  // Insert additional images if any
  if (p.images && p.images.length) {
    for (let i = 0; i < p.images.length; i++) {
      const extraUrl = `${backendUrl}/uploads/${p.images[i]}`;
      await connection.query(
        'INSERT INTO product_images (product_id, image_url, sort_order) VALUES (?, ?, ?)',
        [productId, extraUrl, i + 1]
      );
    }
  }
}

console.log('Seeding finished successfully!');
await connection.end();
