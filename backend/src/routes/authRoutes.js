import { Router } from 'express';
import { getProfileHandler, login, register } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', requireAuth, getProfileHandler);

export default router;
