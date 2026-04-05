import { Router } from 'express';
import { getSystemAnalytics } from './analyticsController';
import { requireAuth } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

// Only ADMIN users can see the global system analytics
router.get('/dashboard', requireAuth, requireRole(['ADMIN']), getSystemAnalytics);

export default router;