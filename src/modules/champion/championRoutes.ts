import { Router } from 'express';
import * as championController from './championController';
import { requireAuth } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

// Apply middleware to ensure ONLY Champions (and Admins) can access these routes
router.use(requireAuth, requireRole(['CHAMPION', 'ADMIN']));

router.get('/stats', championController.getStats);
router.get('/reports/pending', championController.getPendingReports);
router.get('/reports/approved', championController.getApprovedReports);
router.get('/reports/hotspots', championController.getHotspots);
router.get('/workers', championController.getWorkers);

router.post('/reports/:id/assign', championController.verifyAndAssign);
router.post('/award-bonus', championController.awardBonus);

export default router;