import { asyncHandler } from '../utils/asyncHandler.js';
import { listProducts, findProductById, createProduct, updateProduct, deleteProduct } from '../services/productService.js';

export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 8), 1), 24);
  const search = (req.query.search || '').trim();
  const includeDrafts = req.query.includeDrafts === 'true' && req.user?.role === 'admin';

  res.json(await listProducts({ page, limit, search, includeDrafts }));
});

export const getProductById = asyncHandler(async (req, res) => {
  res.json(await findProductById(req.params.id, req.user?.role === 'admin'));
});

export const createProduct_ = asyncHandler(async (req, res) => {
  const id = await createProduct(req.body, req);
  res.status(201).json({ message: 'Product created', id });
});

export const updateProduct_ = asyncHandler(async (req, res) => {
  await updateProduct(req.params.id, req.body, req);
  res.json({ message: 'Product updated' });
});

export const deleteProduct_ = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);
  res.json({ message: 'Product deleted' });
});
