//src/modules/task/taskRoutes.ts
import { Router } from 'express';
import { createTask, getOpenTasks, claimTask, completeTask, verifyTask } from './taskController';
import { requireAuth } from '../../middlewares/authMiddleware';
import { requireRole } from '../../middlewares/roleMiddleware';
import { upload } from '../../middlewares/uploadMiddleware';

const router = Router();

router.post('/', requireAuth, requireRole(['ADMIN', 'NGO']), createTask);
router.get('/open', requireAuth, requireRole(['WORKER', 'ADMIN']), getOpenTasks);
router.patch('/:id/claim', requireAuth, requireRole(['WORKER']), claimTask);

router.get('/open', requireAuth, requireRole(['WORKER', 'ADMIN']), getOpenTasks);
router.patch('/:id/complete', requireAuth, requireRole(['WORKER']), upload.single('proofImage'), completeTask);
router.patch('/:id/verify', requireAuth, requireRole(['CHAMPION', 'ADMIN']), verifyTask);

router.patch('/:id/claim', requireAuth, requireRole(['WORKER']), claimTask);

export default router;