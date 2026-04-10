//src/modules/auth/authRoutes.ts
import { Router } from 'express';
import { register, login } from './authController';
import { validate } from '../../middlewares/validateMiddleware';
import { registerSchema, loginSchema } from '../../validations/authValidation';
import { upload } from '../../middlewares/uploadMiddleware';

const router = Router();

router.post('/register', upload.single('govId'), validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;