import { Router, Request, Response } from 'express';
import { successResponse } from '../utils/apiResponse';
import authRoutes from '../modules/auth/authRoutes';
import reportRoutes from '../modules/report/reportRoutes';
import campaignRoutes from '../modules/campaign/campaignRoutes';
import taskRoutes from '../modules/task/taskRoutes';
import userRoutes from '../modules/user/userRoutes';
import analyticsRoutes from '../modules/analytics/analyticsRoutes';
import scrapRoutes from '../modules/scrap/scrapRoutes';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  successResponse(res, 200, 'Zero Waste Hero API is up and running!');
});

router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/reports', reportRoutes);
router.use('/api/v1/campaigns', campaignRoutes);
router.use('/api/v1/tasks', taskRoutes);
router.use('/api/v1/users', userRoutes);
router.use('/api/v1/analytics', analyticsRoutes);
router.use('/api/v1/scrap', scrapRoutes);
export default router;