import { Router } from 'express';
import authRoutes from './auth.routes';
import { authenticate, authorize } from '../../middleware/auth';

const router = Router();

router.use('/auth', authRoutes);

// Placeholder to verify RBAC end-to-end; replace with real admin routes.
router.get('/admin/ping', authenticate, authorize('admin'), (_req, res) => {
  res.json({ success: true, message: 'pong (admin)' });
});

export default router;
