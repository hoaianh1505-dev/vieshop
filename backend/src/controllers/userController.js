import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { listUsers, findUserById, updateUser, deleteUser } from '../services/userService.js';

export const getUsers = asyncHandler(async (_req, res) => {
  res.json(await listUsers());
});

export const getUserById = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && Number(req.user.id) !== Number(req.params.id)) {
    throw new ApiError(403, 'Forbidden');
  }
  res.json(await findUserById(req.params.id));
});

export const updateUser_ = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && Number(req.user.id) !== Number(req.params.id)) {
    throw new ApiError(403, 'Forbidden');
  }
  await updateUser(req.params.id, req.body, req.user.role === 'admin');
  res.json({ message: 'User updated' });
});

export const deleteUser_ = asyncHandler(async (req, res) => {
  await deleteUser(req.params.id);
  res.json({ message: 'User deleted' });
});
