import { Request, Response } from 'express';
import _ from 'lodash';
import { addDays } from 'date-fns';
import md5 from 'md5';
import response from '../response.json';
import Invite from '../../../model/Invite';
import User from '../../../model/User';
import Hwid from '../../../model/Hwid';
import Ban from '../../../model/Ban';
import Announcement from '../../../model/Announcement';
import Type from '../../../model/Type';
import Faq from '../../../model/Faq';
import Shout from '../../../model/Shout';
import Group from '../../../model/Group';
import Cheat from '../../../model/Cheat';
import Panel from '../../../model/Panel';
import { parse } from 'path';
import EventLog from '../../../model/EventLog';
/**
 * Controller
 */
export default {
	/**
	 * Get all users
	 */
	getUsers: async (req: Request, res: Response) => {
		const users = await User.findAll();
		res.status(200).json(users);
	},
	/**
	 * Get all users
	 */
	extendSubscription: async (req: Request, res: Response) => {
		const user: any = await User.find(req.params.username);
		let sub: Date;
		if (user.subscription) {
			user.subscription.setDate(user.subscription.getDate() + parseInt(req.body.time));
			sub = user.subscription;
		} else {
			sub = new Date();
			sub.setDate(sub.getDate() + parseInt(req.body.time));
		}
		await User.setSubscription(user.username, sub);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.status(201).json({ response: response.success.extendSubscription });
	},
	/**
	 * Get all invites
	 */
	getInvites: async (req: Request, res: Response) => {
		const invite = await Invite.findAll(parseInt(req.params.page));
		res.status(200).json(invite);
	},
	/**
	 * Get all invite pages
	 */
	getInvitePages: async (req: Request, res: Response) => {
		const length = await Invite.length();
		return res.json({ response: Math.ceil(length / 10) - 1 });
	},
	/**
	 * Create invite code
	 */
	createUserInvite: async (req: Request, res: Response) => {
		for (let i = 0; i < req.body.amount; i++) {
			const code = _.times(20, () => _.random(35).toString(36)).join('');
			await Invite.create(req.body.username, code);
		}
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.status(201).json({ response: response.success.createInvites });
	},
	/**
	 * Create invite code
	 */
	createGroupInvite: async (req: Request, res: Response) => {
		const users: any = await User.findByRole(req.body.role);
		await users.forEach((data: any) => {
			for (let i = 0; i < req.body.amount; i++) {
				const code = _.times(20, () => _.random(35).toString(36)).join('');
				Invite.create(data.username, code);
			}
		});
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.status(201).json({ response: response.success.createInvites });
	},
	/**
	 * Get all cheats
	 */
	getCheats: async (req: Request, res: Response) => {
		const cheats = await Cheat.findAll();
		res.json({ response: cheats });
	},
	/**
	 * Create cheat
	 */
	createCheat: async (req: Request, res: Response) => {
		await Cheat.create(req.body.game, req.body.version, req.body.status);
		res.json({ response: response.success.createCheat });
	},
	/**
	 * Delete cheat
	 */
	deleteCheat: async (req: Request, res: Response) => {
		await Cheat.delete(parseFloat(req.params.id));
		res.json({ response: response.success.deleteCheat });
	},
	/**
	 * Edit cheat
	 */
	editCheat: async (req: Request, res: Response) => {
		await Cheat.edit(parseFloat(req.params.id), req.body.game, req.body.version, req.body.status);
		res.json({ response: response.success.editCheat });
	},
	/**
	 * Create announcement
	 */
	createAnnouncement: async (req: Request, res: Response) => {
		await Announcement.create(
			req.body.title,
			req.body.text,
			req.body.typeName,
			req.body.typeColor,
			res.locals.user.username
		);
		res.status(201).json({ response: response.success.createAnnouncement });
	},
	/**
	 * Ban a user
	 */
	createBan: async (req: Request, res: Response) => {
		await Ban.create(req.params.username, res.locals.user.username, req.body.reason);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.json({ response: response.success.createBan });
	},
	/**
	 * Get announcement types
	 */
	getTypes: async (req: Request, res: Response) => {
		const type = await Type.findAll();
		res.status(201).json(type);
	},
	/**
	 * Create announcement type
	 */
	createType: async (req: Request, res: Response) => {
		await Type.create(req.body.text, req.body.color);
		res.status(201).json({ response: response.success.createType });
	},
	/**
	 * Delete announcement type
	 */
	deleteType: async (req: Request, res: Response) => {
		const type: any = await Type.find(req.params.id);
		await Announcement.deleteAll(type.text);
		await Type.delete(req.params.id);
		res.status(201).json({ response: response.success.deleteType });
	},
	/**
	 * Edit announcement type
	 */
	editType: async (req: Request, res: Response) => {
		const newType = await Type.create(req.body.newTypeName + 'temp', req.body.newTypeColor + 'temp');
		await Announcement.updateAll(
			req.body.oldTypeName,
			req.body.newTypeName + 'temp',
			req.body.newTypeColor + 'temp'
		);
		await Type.delete(req.params.id);
		await Type.create(req.body.newTypeName, req.body.newTypeColor);
		await Announcement.updateAll(req.body.newTypeName + 'temp', req.body.newTypeName, req.body.newTypeColor);
		await Type.delete(newType.id);
		res.status(201).json({ response: response.success.editType });
	},
	/**
	 * Create group
	 */
	createFAQGroup: async (req: Request, res: Response) => {
		await Group.create(req.body.name);
		res.status(201).json({ response: response.success.createGroup });
	},
	/**
	 * Create group
	 */
	deleteFAQGroup: async (req: Request, res: Response) => {
		const group: any = await Group.find(req.params.id);
		await Faq.deleteAll(group.name);
		await Group.delete(req.params.id);
		res.status(201).json({ response: response.success.deleteGroup });
	},
	/**
	 * Edit group
	 */
	editFAQGroup: async (req: Request, res: Response) => {
		await Group.create(req.body.newName);
		await Faq.updateAll(req.body.oldName, req.body.newName);
		await Group.deleteByName(req.body.oldName);
		res.status(201).json({ response: response.success.editGroup });
	},
	/**
	 * Get FAQs
	 */
	getFAQs: async (req: Request, res: Response) => {
		const FAQ = await Faq.findAll();
		return res.json(FAQ);
	},
	/**
	 * Create FAQ
	 */
	createFAQ: async (req: Request, res: Response) => {
		await Faq.create(req.body.question, req.body.answer, req.body.group);
		res.status(201).json({ response: response.success.createFAQ });
	},
	/**
	 * Delete FAQ
	 */
	deleteFAQ: async (req: Request, res: Response) => {
		await Faq.delete(req.params.id);
		res.status(201).json({ response: response.success.deleteFAQ });
	},
	/**
	 * Edit FAQ
	 */
	editFAQ: async (req: Request, res: Response) => {
		await Faq.edit(req.params.id, req.body.question, req.body.answer, req.body.group);
		res.status(201).json({ response: response.success.editFAQ });
	},
	/**
	 * Unban a user
	 */
	deleteBan: async (req: Request, res: Response) => {
		await Ban.delete(req.params.username);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.json({ response: response.success.deleteBan });
	},
	/**
	 * Delete user HWID
	 */
	deleteHwid: async (req: Request, res: Response) => {
		await Hwid.delete(req.params.username);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.json({ response: response.success.deleteHwid });
	},
	/**
	 * Delete announcement
	 */
	deleteAnnouncement: async (req: Request, res: Response) => {
		await Announcement.delete(req.params.id);
		res.json({ response: response.success.deleteAnnouncement });
	},
	/**
	 * Delete shout
	 */
	deleteShout: async (req: Request, res: Response) => {
		await Shout.delete(req.params.id);
		res.status(200).json({ response: response.success.deleteShout });
	},
	/**
	 * Delete all shouts
	 */
	deleteShouts: async (req: Request, res: Response) => {
		await Shout.deleteAll();
		res.status(200).json({ response: response.success.deleteShouts });
	},
	/**
	 * Update user password
	 */
	setPassword: async (req: Request, res: Response) => {
		await User.setPassword(req.params.username, req.body.password);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.json({ response: response.success.setPassword });
	},
	/**
	 * Update user email
	 */
	setEmail: async (req: Request, res: Response) => {
		await User.setEmail(req.params.username, req.body.email, md5(req.body.email));
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.json({ response: response.success.setEmail });
	},
	/**
	 * Update user role
	 */
	setRole: async (req: Request, res: Response) => {
		await User.setRole(req.params.username, req.body.role);
		res.json({ response: response.success.setRole });
	},
	/**
	 * Update user verified status
	 */
	setVerified: async (req: Request, res: Response) => {
		await User.setVerified({
			username: req.params.username,
			isVerified: req.body.isVerified,
		});
		res.json({ response: response.success.setVerified });
	},
	/**
	 * Find panel
	 */
	findPanel: async (req: Request, res: Response) => {
		const panel = await Panel.find();
		res.json({ response: panel });
	},
	/**
	 * Edit panel
	 */
	editPanel: async (req: Request, res: Response) => {
		await Panel.edit(req.params.id, req.body.invites);
		res.json({ response: response.success.editPanel });
	},
};
