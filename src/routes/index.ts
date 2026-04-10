//src/routes/index.ts
import { Router, Request, Response } from 'express';
import { successResponse } from '../utils/apiResponse';
import authRoutes from '../modules/auth/authRoutes';
import reportRoutes from '../modules/report/reportRoutes';
import campaignRoutes from '../modules/campaign/campaignRoutes';
import taskRoutes from '../modules/task/taskRoutes';
import userRoutes from '../modules/user/userRoutes';
import analyticsRoutes from '../modules/analytics/analyticsRoutes';
import scrapRoutes from '../modules/scrap/scrapRoutes';
import championRoutes from '../modules/champion/championRoutes';
import authorityRoutes from '../modules/authority/authorityRoutes';
import ngoRoutes from '../modules/ngo/ngoRoutes';

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
router.use('/api/v1/champion', championRoutes);
router.use('/api/v1/authority', authorityRoutes);
router.use('/api/v1/ngo', ngoRoutes);
export default router;