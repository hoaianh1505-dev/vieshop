import { Router } from 'express';
import {
  createProduct_,
  deleteProduct_,
  getProductById,
  getProducts,
  updateProduct_,
} from '../controllers/productController.js';
import { attachAuth, requireAdmin, requireAuth } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { productSchema } from '../utils/validators.js';

const router = Router();

router.get('/', attachAuth, getProducts);
router.get('/:id', attachAuth, getProductById);
router.post('/', requireAuth, requireAdmin, upload.array('images', 6), validate(productSchema), createProduct_);
router.put('/:id', requireAuth, requireAdmin, upload.array('images', 6), validate(productSchema), updateProduct_);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct_);

export default router;
