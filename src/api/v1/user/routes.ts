import { Router } from 'express';
import { errorHandler, yup } from '../../../util';
import controller from './controller';
import schema from './schema';

const { handler } = errorHandler;
const router = Router();

/**
 * Routes
 */
router.get('/me', handler(controller.me));
router.get('/invite/:page/get/', yup.validate(schema.page), handler(controller.getInvites));
router.get('/invite/pages', handler(controller.getInvitePages));
router.put('/password', yup.validate(schema.password), handler(controller.setPassword));
router.put('/email', yup.validate(schema.email), handler(controller.setEmail));
router.post('/payment/create', yup.validate(schema.payment), handler(controller.createPayment));

export default router;
