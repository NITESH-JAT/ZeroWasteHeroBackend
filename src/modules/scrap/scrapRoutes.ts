import { Router } from 'express';
import * as scrapController from './scrapController';
import { requireAuth } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';
import { upload } from '../../middlewares/uploadMiddleware';

const router = Router();

// CITIZEN ROUTES
router.post('/listings', requireAuth, requireRole(['CITIZEN']), upload.single('image'), scrapController.createListing);
router.get('/my-listings', requireAuth, scrapController.getMyListings);
router.get('/listings/:id/bids', requireAuth, requireRole(['CITIZEN']), scrapController.getBids);
router.patch('/bids/:bidId/accept', requireAuth, requireRole(['CITIZEN']), scrapController.acceptBid);

// SCRAPPER ROUTES
router.get('/feed', requireAuth, requireRole(['SCRAPPER']), scrapController.getMarketplaceFeed);
router.post('/listings/:id/bids', requireAuth, requireRole(['SCRAPPER']), scrapController.submitBid);
router.get('/my-bids', requireAuth, scrapController.getMyBids);

export default router;