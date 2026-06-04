import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';
import { attachAuth, requireAdmin, requireAuth } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { productSchema } from '../utils/validators.js';

const router = Router();

router.get('/', attachAuth, getProducts);
router.get('/:id', attachAuth, getProductById);
router.post('/', requireAuth, requireAdmin, upload.array('images', 6), validate(productSchema), createProduct);
router.put('/:id', requireAuth, requireAdmin, upload.array('images', 6), validate(productSchema), updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
