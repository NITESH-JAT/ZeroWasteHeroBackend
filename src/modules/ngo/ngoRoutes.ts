import { Router } from 'express';
import * as ngoController from './ngoController';
import { requireAuth } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

// Lock these routes down to strictly NGOs
router.use(requireAuth, requireRole(['NGO']));

router.get('/stats', ngoController.getDashboardStats);
router.get('/campaigns', ngoController.getCampaigns);

export default router;