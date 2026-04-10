//src/modules/report/reportRoutes.ts
import { Router } from 'express';
import { createReport, getMyReports, getPendingReports, verifyReport } from './reportController';
import { requireAuth } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';
import { upload } from '../../middlewares/uploadMiddleware';

const router = Router();

router.post(
  '/', 
  requireAuth, 
  requireRole(['CITIZEN']), 
  upload.single('image'), // 'image' is the field name the frontend will use
  createReport
);

router.get('/pending', requireAuth, requireRole(['CHAMPION', 'ADMIN']), getPendingReports);
router.get('/my-reports', requireAuth, getMyReports);
router.patch('/:id/verify', requireAuth, requireRole(['CHAMPION', 'ADMIN']), verifyReport);

export default router;