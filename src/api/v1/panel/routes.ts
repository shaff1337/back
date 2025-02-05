import { Router } from 'express';
import { errorHandler, yup } from '../../../util';
import controller from './controller';
import schema from './schema';

const { handler } = errorHandler;
const router = Router();

/**
 * Routes
 */

// Users
router.get('/user/:page/get', yup.validate(schema.uuid), handler(controller.getUsers));
router.get('/user/pages', handler(controller.getUserPages));
router.get('/id/:username', yup.validate(schema.username), handler(controller.getProfile));

// Tickets
router.get('/ticket/:page/get', handler(controller.getTickets));
router.get('/ticket/pages', handler(controller.getTicketPages));
router.get('/ticket/id/:id', handler(controller.getTicket));
router.post('/ticket/id/:id/send', handler(controller.createTicketMessage));

// Group
router.get('/group/get', handler(controller.getFAQGroups));

// FAQ
router.get('/faq/:group/get', handler(controller.getFAQsByGroup)); //

// Comments
router.get('/comment/:username/get', yup.validate(schema.username), handler(controller.getComments));
router.post('/comment/create', handler(controller.createComment));
router.delete('/comment/:id/delete', yup.validate(schema.uuid), handler(controller.deleteComment));

export default router;
