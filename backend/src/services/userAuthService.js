import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { comparePassword, hashPassword, signToken } from './authService.js';

export const findUserByEmail = async (email) => {
  const [[user]] = await pool.query(
    `SELECT id, name, email, password_hash, role, status, phone, address
     FROM users WHERE email = ?`,
    [email],
  );
  return user;
};

export const createUser = async ({ name, email, password, phone = '', address = '' }) => {
  const existing = await findUserByEmail(email);
  if (existing) throw new ApiError(409, 'Email already exists');

  const passwordHash = await hashPassword(password);
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, status, phone, address)
     VALUES (?, ?, ?, 'user', 'active', ?, ?)`,
    [name, email, passwordHash, phone, address],
  );

  const user = { id: result.insertId, name, email, role: 'user' };
  return { user, token: signToken(user) };
};

export const loginUser = async ({ email, password }) => {
  const user = await findUserByEmail(email);
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
