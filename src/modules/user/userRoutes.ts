import { Router } from 'express';
import { getLeaderboard, getMyStats } from './userController';
import { requireAuth } from '../../middlewares/authMiddleware';

const router = Router();

// Add the stats route!
router.get('/me/stats', requireAuth, getMyStats);

router.get('/leaderboard', requireAuth, getLeaderboard);

export default router;