import { Router } from 'express';
import { createOrder, getOrderById, getOrders, updateOrder } from '../controllers/orderController.js';
import { requireAdmin, requireAuth } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { orderSchema, orderStatusSchema } from '../utils/validators.js';

const router = Router();

router.use(requireAuth);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.post('/', validate(orderSchema), createOrder);
router.put('/:id', requireAdmin, validate(orderStatusSchema), updateOrder);

export default router;
