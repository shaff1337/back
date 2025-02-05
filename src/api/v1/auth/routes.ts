import { Router } from 'express';
import { errorHandler, yup } from '../../../util';
import controller from './controller';
import schema from './schema';

const { handler } = errorHandler;
const router = Router();

/**
 * Routes
 */

router.get('/panel/', handler(controller.findPanel));

router.post('/signIn', yup.validate(schema.signIn), handler(controller.signIn));
router.post('/signUp', yup.validate(schema.signUp), handler(controller.signUp));

export default router;
