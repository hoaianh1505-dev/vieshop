import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { comparePassword, hashPassword, signToken } from '../services/authService.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone = '', address = '' } = req.body;

  const [[existingUser]] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existingUser) {
    throw new ApiError(409, 'Email already exists');
  }

  const passwordHash = await hashPassword(password);
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password_hash, role, status, phone, address)
     VALUES (?, ?, ?, 'user', 'active', ?, ?)`,
    [name, email, passwordHash, phone, address],
  );

  const user = { id: result.insertId, name, email, role: 'user' };
  res.status(201).json({ message: 'Registered successfully', token: signToken(user), user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [[user]] = await pool.query(
    `SELECT id, name, email, password_hash, role, status, phone, address
     FROM users
     WHERE email = ?`,
    [email],
  );

  if (!user || !(await comparePassword(password, user.password_hash))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'User account is blocked');
  }

  const tokenUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  res.json({
    message: 'Login successful',
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
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const [[user]] = await pool.query(
    `SELECT id, name, email, role, status, phone, address, created_at, updated_at
     FROM users
     WHERE id = ?`,
    [req.user.id],
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json(user);
});
