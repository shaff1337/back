import { Router } from 'express';
import { errorHandler, yup } from '../../../util';
import controller from './controller';
import schema from './schema';

const { handler } = errorHandler;
const router = Router();

router.post('/payment/webhook', handler(controller.webhookCharge));

export default router;
