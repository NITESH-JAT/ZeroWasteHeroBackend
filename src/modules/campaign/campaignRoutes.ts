import { Router } from 'express';
import { createCampaign, getCampaigns } from './campaignController';
import { requireAuth } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

// Only NGOs and Admins can create campaigns
router.post('/', requireAuth, requireRole(['NGO', 'ADMIN']), createCampaign);

// Any logged-in user can view active campaigns
router.get('/', requireAuth, getCampaigns);

export default router;