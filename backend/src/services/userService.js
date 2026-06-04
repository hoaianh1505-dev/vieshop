import { pool } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';

export const listUsers = async () => {
  const [users] = await pool.query(
    `SELECT id, name, email, role, status, phone, address, created_at, updated_at
     FROM users ORDER BY created_at DESC`,
  );
  return users;
};

export const findUserById = async (id) => {
  const [[user]] = await pool.query(
    `SELECT id, name, email, role, status, phone, address, created_at, updated_at
     FROM users WHERE id = ?`,
    [id],
  );
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};

export const updateUser = async (id, { name, phone, address, status }, isAdmin) => {
  const [[existing]] = await pool.query('SELECT id, role FROM users WHERE id = ?', [id]);
  if (!existing) throw new ApiError(404, 'User not found');

  const nextStatus = isAdmin ? status : undefined;
  await pool.query(
    `UPDATE users
     SET name = COALESCE(?, name),
         phone = COALESCE(?, phone),
         address = COALESCE(?, address),
         status = COALESCE(?, status)
     WHERE id = ?`,
    [name, phone, address, nextStatus, id],
  );
};

export const deleteUser = async (id) => {
  const [result] = await pool.query("DELETE FROM users WHERE id = ? AND role != 'admin'", [id]);
  if (!result.affectedRows) throw new ApiError(404, 'User not found or cannot delete admin');
};
