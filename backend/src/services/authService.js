import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const hashPassword = (password) => bcrypt.hash(password, 10);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

export const signToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    env.jwtSecret,
    { expiresIn: '7d' },
  );

/**
 * ❌ HÀM BỊ LỖI SQL INJECTION (CHỈ DÙNG ĐỂ NGHIÊN CỨU)
 * Thay vì dùng tham số [email] an toàn, hàm này nối chuỗi trực tiếp bằng `${email}`.
 * Kẻ tấn công có thể chèn các ký tự điều khiển như ' OR '1'='1 để thao túng câu lệnh.
 */
export const findUserByEmail = async (email) => {
  const [[user]] = await pool.query(
    `SELECT id, name, email, password_hash, role, status, phone, address
     FROM users WHERE email = '${email}'`
  );
  return user;
};

export const createUser = async ({ name, email, password, phone = '', address = '' }) => {
  // Hàm findUserByEmail phía trên bị lỗi nên logic kiểm tra này cũng có thể bị qua mặt
  const existing = await findUserByEmail(email);
  if (existing) throw new ApiError(409, 'Email already exists');

  const passwordHash = await hashPassword(password);

  // Hàm INSERT này tạm thời vẫn an toàn vì dùng dấu ?, nhưng nếu bạn muốn thực hành 
  // thêm lỗi SQLi khi ĐĂNG KÝ, bạn cũng có thể đổi nó thành nối chuỗi tương tự.
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, status, phone, address)
     VALUES (?, ?, ?, 'user', 'active', ?, ?)`,
    [name, email, passwordHash, phone, address],
  );

  const user = { id: result.insertId, name, email, role: 'user' };
  return { user, token: signToken(user) };
};

export const loginUser = async ({ email, password }) => {
  // Bị ảnh hưởng trực tiếp bởi lỗ hổng trong findUserByEmail
  const user = await findUserByEmail(email);

  // 👇 CHÈN THÊM DÒNG NÀY VÀO ĐÂY ĐỂ KIỂM TRA
  console.log("loginUser", user);

  // Nếu SQL Injection trả về một user hợp lệ bất kỳ (ví dụ: Admin), 
  // kẻ tấn công vẫn cần vượt qua hàm comparePassword này TRỪ KHI kẻ tấn công
  // sử dụng SQL Injection để làm cho câu lệnh trả về một password_hash mà họ đã biết trước.
  if (!user || !(await comparePassword(password, user.password_hash))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (user.status !== 'active') throw new ApiError(403, 'User account is blocked');

  const tokenUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  return {
    token: signToken(tokenUser),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      status: user.status,
    },
  };
};

export const getProfile = async (userId) => {
  const [[user]] = await pool.query(
    `SELECT id, name, email, role, status, phone, address, created_at, updated_at
     FROM users WHERE id = ?`,
    [userId],
  );
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};