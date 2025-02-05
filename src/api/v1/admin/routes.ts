import { Router } from 'express';
import { errorHandler, yup } from '../../../util';
import controller from './controller';
import schema from './schema';

const { handler } = errorHandler;
const router = Router();

/**
 * Routes
 */

// Panel actions
router.get('/panel/', handler(controller.findPanel));
router.put('/panel/:id/edit', handler(controller.editPanel)); // ADD VALIDATOR

// Shout actions
router.delete('/shout/:id/delete', yup.validate(schema.uuid), handler(controller.deleteShout));
router.delete('/shout/delete', handler(controller.deleteShouts));

// Invite actions
router.get('/invite/:page/get', handler(controller.getInvites));
router.get('/invite/pages', handler(controller.getInvitePages));
router.post('/invite/create', handler(controller.createUserInvite));
router.post('/invite/create/group', yup.validate(schema.group), handler(controller.createGroupInvite));

// Type actions
router.get('/type/get', handler(controller.getTypes));
router.post('/type/create', yup.validate(schema.type), handler(controller.createType));
router.delete('/type/:id/delete', yup.validate(schema.uuid), handler(controller.deleteType));
router.put('/type/:id/edit', yup.validate(schema.editType), handler(controller.editType));

// Announcement actions
router.delete('/announcement/:id/delete', yup.validate(schema.uuid), handler(controller.deleteAnnouncement));
router.post('/announcement/create', yup.validate(schema.announcement), handler(controller.createAnnouncement));

// Group actions
router.post('/group/create', yup.validate(schema.group), handler(controller.createFAQGroup));
router.delete('/group/:id/delete', yup.validate(schema.uuid), handler(controller.deleteFAQGroup));
router.put('/group/edit', yup.validate(schema.editGroup), handler(controller.editFAQGroup));

// FAQ actions
router.get('/faq/get', handler(controller.getFAQs));
router.post('/faq/create', yup.validate(schema.faq), handler(controller.createFAQ));
router.delete('/faq/:id/delete', yup.validate(schema.uuid), handler(controller.deleteFAQ));
router.put('/faq/:id/edit', yup.validate(schema.editFAQ), handler(controller.editFAQ));

// Cheat actions
router.get('/cheat/get', handler(controller.getCheats));
router.post('/cheat/create', yup.validate(schema.cheat), handler(controller.createCheat));
router.delete('/cheat/:id/delete', yup.validate(schema.id), handler(controller.deleteCheat));
router.put('/cheat/:id/edit', yup.validate(schema.editCheat), handler(controller.editCheat));

// User actions
router.get('/user/get', handler(controller.getUsers));

router
	.route('/user/:username/ban')
	.post(yup.validate(schema.ban), handler(controller.createBan))
	.delete(yup.validate(schema.username), handler(controller.deleteBan));

router.delete('/user/:username/hwid', yup.validate(schema.id), handler(controller.deleteHwid));
router.put('/user/:username/password', yup.validate(schema.password), handler(controller.setPassword));
router.put('/user/:username/email', yup.validate(schema.email), handler(controller.setEmail));
router.put('/user/:username/role', yup.validate(schema.role), handler(controller.setRole));
router.put('/user/:username/verified', yup.validate(schema.verified), handler(controller.setVerified));
router.put('/user/:username/subscription', yup.validate(schema.subscription), handler(controller.extendSubscription));

export default router;
