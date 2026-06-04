import { asyncHandler } from '../utils/asyncHandler.js';
import { listOrders, findOrderById, createOrder, updateOrderStatus } from '../services/orderService.js';

export const getOrders = asyncHandler(async (req, res) => {
  res.json(await listOrders(req.user));
});

export const getOrderById = asyncHandler(async (req, res) => {
  res.json(await findOrderById(req.params.id, req.user));
});

export const createOrder_ = asyncHandler(async (req, res) => {
  const id = await createOrder(req.body, req.user.id);
  res.status(201).json({ message: 'Order placed successfully', id });
});

export const updateOrder = asyncHandler(async (req, res) => {
  await updateOrderStatus(req.params.id, req.body);
  res.json({ message: 'Order updated' });
});
