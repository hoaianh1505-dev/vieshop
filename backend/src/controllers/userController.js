import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const [users] = await pool.query(
    `SELECT id, name, email, role, status, phone, address, created_at, updated_at
     FROM users
     ORDER BY created_at DESC`,
  );
  res.json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && Number(req.user.id) !== Number(req.params.id)) {
    throw new ApiError(403, 'Forbidden');
  }

  const [[user]] = await pool.query(
    `SELECT id, name, email, role, status, phone, address, created_at, updated_at
     FROM users
     WHERE id = ?`,
    [req.params.id],
  );

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && Number(req.user.id) !== Number(req.params.id)) {
    throw new ApiError(403, 'Forbidden');
  }

  const [[existing]] = await pool.query('SELECT id, role FROM users WHERE id = ?', [req.params.id]);
  if (!existing) {
    throw new ApiError(404, 'User not found');
  }

  const nextStatus = req.user.role === 'admin' ? req.body.status : undefined;

  await pool.query(
    `UPDATE users
     SET name = COALESCE(?, name),
         phone = COALESCE(?, phone),
         address = COALESCE(?, address),
         status = COALESCE(?, status)
     WHERE id = ?`,
    [req.body.name, req.body.phone, req.body.address, nextStatus, req.params.id],
  );

  res.json({ message: 'User updated' });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const [result] = await pool.query("DELETE FROM users WHERE id = ? AND role != 'admin'", [req.params.id]);
  if (!result.affectedRows) {
    throw new ApiError(404, 'User not found or cannot delete admin');
  }
  res.json({ message: 'User deleted' });
});
