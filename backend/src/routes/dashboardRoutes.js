import { Router } from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import { requireAdmin, requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', requireAuth, requireAdmin, getDashboard);

export default router;
