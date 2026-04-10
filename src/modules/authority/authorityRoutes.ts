import { Router } from 'express';
import * as authController from './authorityController';
import { requireAuth } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

// Lock these routes down to Authority and Admin
router.use(requireAuth, requireRole(['AUTHORITY', 'ADMIN']));

router.get('/stats', authController.getDashboardStats);
router.get('/ngos', authController.getNgos);
router.get('/penalties', authController.getPenaltiesList);
router.post('/penalties', authController.createPenalty);

export default router;