import { Router } from 'express';
import * as auth from '../../controllers/auth.controller';
import { authenticate } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimiter';
import { validateBody } from '../../middleware/validate';
import {
  loginSchema,
  refreshSchema,
  registerSchema,
} from '../../validators/auth.validator';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema), auth.register);
router.post('/login', authLimiter, validateBody(loginSchema), auth.login);
router.post('/refresh', authLimiter, validateBody(refreshSchema), auth.refresh);
router.post('/logout', authenticate, auth.logout);
router.get('/me', authenticate, auth.me);

export default router;
