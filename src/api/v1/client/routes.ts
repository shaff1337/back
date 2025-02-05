import { Router } from 'express';
import { errorHandler, yup } from '../../../util';
import controller from './controller';
import schema from './schema';

const { handler } = errorHandler;
const router = Router();

/**
 * Routes
 */

// Shouts
router.get('/shout/get', handler(controller.getShouts));
router.post('/shout/create', yup.validate(schema.shout), handler(controller.createShout));

// Announcements
router.get('/announcement/:page/get', yup.validate(schema.page), handler(controller.getAnnouncements));
router.get('/announcement/pages', handler(controller.getAnnouncementsPages));
router.get('/announcement/:id', yup.validate(schema.uuid), handler(controller.getAnnouncement));

// Configs
router.get('/config/:page/:type/get', yup.validate(schema.getConfigs), handler(controller.findConfigs));
router.get('/config/personal/get', handler(controller.findMemberConfigs));
router.get('/config/pages', handler(controller.findConfigPages));
router.get('/config/:id/', yup.validate(schema.uuid), handler(controller.findConfig));
router.post('/config/create', yup.validate(schema.config), handler(controller.createConfig));
router.delete('/config/:id/delete', yup.validate(schema.uuid), handler(controller.deleteConfig));
router.put('/config/:id/edit', yup.validate(schema.editConfig), handler(controller.editConfig));

// Config subscriptions
router.get('/subscription/get', handler(controller.findSubscriptions));
router.post('/subscription/create', handler(controller.createSubscription));
router.delete('/subscription/:id/delete', yup.validate(schema.uuid), handler(controller.deleteSubscription));

router.post('/hwid/check', yup.validate(schema.hwid), handler(controller.checkHwid));
router.post('/token/validate', handler(controller.validateToken));

export default router;
