import { asyncHandler } from '../utils/asyncHandler.js';
import { createUser, loginUser, getProfile } from '../services/userAuthService.js';

export const register = asyncHandler(async (req, res) => {
  const result = await createUser(req.body);
  res.status(201).json({ message: 'Registered successfully', ...result });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json({ message: 'Login successful', ...result });
});

export const getProfileHandler = asyncHandler(async (req, res) => {
  res.json(await getProfile(req.user.id));
});
