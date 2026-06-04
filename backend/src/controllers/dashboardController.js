import { asyncHandler } from '../utils/asyncHandler.js';
import { getDashboardMetrics } from '../services/dashboardService.js';

export const getDashboard = asyncHandler(async (_req, res) => {
  res.json(await getDashboardMetrics());
});
