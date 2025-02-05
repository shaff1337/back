import { Router } from 'express';
import authRoutes from './auth/routes';
import userRoutes from './user/routes';
import panelRoutes from './panel/routes';
import clientRoutes from './client/routes';
import adminRoutes from './admin/routes';
import paymentRoutes from './payment/routes';
import { ratelimit, auth } from '../../middleware';
import { errorHandler } from '../../util';

const router = Router();
/**
 * Routes
 */
router.use('/auth', ratelimit.auth, authRoutes);
router.use(errorHandler.handler(auth.verify));
router.use('/user', auth.hasPermission('USER'), userRoutes);
router.use('/panel', auth.hasPermission('USER'), panelRoutes);
router.use('/client', auth.hasPermission('USER'), clientRoutes);
router.use('/payment', paymentRoutes);
router.use('/admin', auth.hasPermission('ADMIN'), adminRoutes);

export default router;
