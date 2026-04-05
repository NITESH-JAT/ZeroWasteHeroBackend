import { Router } from 'express';
import { getLeaderboard } from './userController';
import { requireAuth } from '../../middlewares/authMiddleware';

const router = Router();

router.get('/leaderboard', requireAuth, getLeaderboard);

export default router;