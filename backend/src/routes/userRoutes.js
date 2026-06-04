import { Router } from 'express';
import { deleteUser, getUserById, getUsers, updateUser } from '../controllers/userController.js';
import { requireAdmin, requireAuth } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { userUpdateSchema } from '../utils/validators.js';

const router = Router();

router.use(requireAuth);
router.get('/', requireAdmin, getUsers);
router.get('/:id', getUserById);
router.put('/:id', validate(userUpdateSchema), updateUser);
router.delete('/:id', requireAdmin, deleteUser);

export default router;
