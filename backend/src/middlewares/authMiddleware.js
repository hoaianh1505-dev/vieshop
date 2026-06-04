import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const requireAuth = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  try {
    req.user = jwt.verify(header.slice(7), env.jwtSecret);
    next();
  } catch {
    next(new ApiError(401, 'Invalid token'));
  }
};

export const attachAuth = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return next();
  }

  try {
    req.user = jwt.verify(header.slice(7), env.jwtSecret);
  } catch {
    req.user = null;
  }

  next();
};

export const requireAdmin = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required'));
  }

  next();
};
