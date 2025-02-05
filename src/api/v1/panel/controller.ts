import { Request, Response } from 'express';
import createError from 'http-errors';
import User from '../../../model/User';
import response from '../response.json';
import Comment from '../../../model/Comment';
import Faq from '../../../model/Faq';
import Group from '../../../model/Group';
import Ticket from '../../../model/Ticket';
import TicketMessage from '../../../model/TicketMessage';
import EventLog from '../../../model/EventLog';

/**
 * Controller
 */
export default {
	/**
	 * Get all users
	 */
	getUsers: async (req: Request, res: Response) => {
		const users = await User.findAllByPage(parseInt(req.params.page));
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.status(200).json(users);
	},
	/**
	 * Get user pages
	 */
	getUserPages: async (req: Request, res: Response) => {
		const length = await User.length();
		res.status(200).json({ response: Math.ceil(length / 10) - 1 });
	},
	/**
	 * Get user public profile
	 */
	getProfile: async (req: Request, res: Response) => {
		const user = await User.findByUsername(req.params.username, true);
		if (!user) throw new createError.NotFound(response.notFound.user);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.json({
			response: {
				id: user.id,
				username: user.username,
				role: user.role,
				ban: user.banned,
				avatar: user.avatar,
				invitedBy: user.invited ? user.invited.authorUser : 'SYSTEM',
				createdAt: user.createdAt,
			},
		});
	},
	/**
	 * Get user profile's comments
	 */
	getComments: async (req: Request, res: Response) => {
		const comments = await Comment.findAll(req.params.username);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json(comments);
	},
	/**
	 * Get FAQ groups
	 */
	getFAQGroups: async (req: Request, res: Response) => {
		const group = await Group.findAll();
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json(group);
	},
	/**
	 * Get tickets
	 */
	getTickets: async (req: Request, res: Response) => {
		const tickets = await Ticket.findAllByUser(res.locals.user.username, parseInt(req.params.page));
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.status(200).json({ response: tickets });
	},
	/**
	 * Get ticket
	 */
	getTicket: async (req: Request, res: Response) => {
		const ticket = await Ticket.find(parseInt(req.params.id));
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.status(200).json({ response: ticket });
	},
	/**
	 * Get ticket
	 */
	createTicketMessage: async (req: Request, res: Response) => {
		await TicketMessage.create(parseInt(req.params.id), req.body.message, res.locals.user.username);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.status(200).json({ response: response.success.createTicketMessage });
	},
	/**
	 * Get ticket pages
	 */
	getTicketPages: async (req: Request, res: Response) => {
		const length = await Ticket.findLengthByUser(res.locals.user.username);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.status(200).json({ response: Math.ceil(length / 10) - 1 });
	},
	/**
	 * Get FAQs by group
	 */
	getFAQsByGroup: async (req: Request, res: Response) => {
		const FAQ = await Faq.findByGroup(req.params.group);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json(FAQ);
	},
	/**
	 * Create comment
	 */
	createComment: async (req: Request, res: Response) => {
		await Comment.create(req.body.comment, res.locals.user.username, req.body.commentedUser);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json({ response: response.success.createComment });
	},
	/**
	 * Delete comment
	 */
	deleteComment: async (req: Request, res: Response) => {
		await Comment.delete(req.params.id);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json({ response: response.success.deleteComment });
	},
};
