import { Router } from 'express';
import { deleteUser_, getUserById, getUsers, updateUser_ } from '../controllers/userController.js';
import { requireAdmin, requireAuth } from '../middlewares/authMiddleware.js';

const router = Router();
// bât middle ware nếu dự án chạy thât
router.use(requireAuth);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser_);
router.delete('/:id', requireAdmin, deleteUser_);

export default router;
