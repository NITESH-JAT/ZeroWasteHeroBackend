import { Router } from 'express';
import { createReport, getPendingReports, verifyReport } from './reportController';
import { requireAuth } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';
import { upload } from '../../middlewares/uploadMiddleware'; // <-- Import Multer

const router = Router();

// Add upload.single('image') to intercept the file before it hits the controller
router.post(
  '/', 
  requireAuth, 
  requireRole(['CITIZEN']), 
  upload.single('image'), // 'image' is the field name the frontend will use
  createReport
);

router.get('/pending', requireAuth, requireRole(['CHAMPION', 'ADMIN']), getPendingReports);
router.patch('/:id/verify', requireAuth, requireRole(['CHAMPION', 'ADMIN']), verifyReport);

export default router;