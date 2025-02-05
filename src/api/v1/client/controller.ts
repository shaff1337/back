import { Request, Response } from 'express';
import response from '../response.json';
import Announcement from '../../../model/Announcement';
import Shout from '../../../model/Shout';
import Config from '../../../model/Config';
import Subscribe from '../../../model/Subscribe';
import EventLog from '../../../model/EventLog';
import Hwid from '../../../model/Hwid';
/**
 * Controller
 */
export default {
	/**
	 * Get all shouts
	 */
	getShouts: async (req: Request, res: Response) => {
		const shouts = await Shout.findAll();
		return res.json(shouts);
	},
	/**
	 * Get all shouts
	 */
	createShout: async (req: Request, res: Response) => {
		await Shout.create(req.body.message, res.locals.user.username);
		return res.json({ response: response.success.createShout });
	},
	/**
	 * Get all announcements
	 */
	getAnnouncements: async (req: Request, res: Response) => {
		const announcements = await Announcement.findAll(parseInt(req.params.page));
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json(announcements);
	},
	/**
	 * Get all announcements pages count
	 */
	getAnnouncementsPages: async (req: Request, res: Response) => {
		const length = await Announcement.length();
		return res.json({ response: Math.ceil(length / 10) - 1 });
	},
	/**
	 * Get announcement
	 */
	getAnnouncement: async (req: Request, res: Response) => {
		const announcement = await Announcement.find(req.params.id);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json(announcement);
	},
	/**
	 * Get configs
	 */
	findConfigs: async (req: Request, res: Response) => {
		const type: any = req.params.type as string;
		const configs = await Config.findAll(parseInt(req.params.page), type);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json({ response: configs });
	},
	/**
	 * Get all announcements pages count
	 */
	findConfigPages: async (req: Request, res: Response) => {
		const length = await Config.length();
		return res.json({ response: Math.ceil(length / 10) - 1 });
	},
	/**
	 * Get config
	 */
	findConfig: async (req: Request, res: Response) => {
		const config = await Config.find(req.params.id);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json({ response: config });
	},
	/**
	 * Get configs
	 */
	findMemberConfigs: async (req: Request, res: Response) => {
		const configs = await Subscribe.findAll(res.locals.user.username);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json({ response: configs });
	},
	/**
	 * Create config
	 */
	createConfig: async (req: Request, res: Response) => {
		const config = await Config.create(
			req.body.name,
			req.body.data,
			req.body.status,
			req.body.type,
			res.locals.user.username
		);
		await Subscribe.create(config.id, res.locals.user.username);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json({ response: response.success.createConfig });
	},
	/**
	 * Delete config
	 */
	deleteConfig: async (req: Request, res: Response) => {
		const config: any = await Config.find(req.params.id);
		if (config.authorUser === res.locals.user.username) {
			await Subscribe.deleteAll(req.params.id);
			await Config.delete(req.params.id);
			await EventLog.create({
				route: req.originalUrl,
				ip: req.ip,
				timestamp: new Date(),
				userId: res.locals.user.id,
			});
			return res.json({ response: response.success.deleteConfig });
		}
		return res.json({ response: response.notFound.id });
	},
	/**
	 * Edit config
	 */
	editConfig: async (req: Request, res: Response) => {
		const config: any = await Config.find(req.params.id);
		if (config.authorUser === res.locals.user.username) {
			await Config.edit(req.params.id, req.body.name, req.body.data, req.body.status);
			await EventLog.create({
				route: req.originalUrl,
				ip: req.ip,
				timestamp: new Date(),
				userId: res.locals.user.id,
			});
			return res.json({ response: response.success.editConfig });
		}
		return res.json({ response: response.notFound.id });
	},
	/**
	 * Find
	 */
	findSubscriptions: async (req: Request, res: Response) => {
		const configs = await Subscribe.findAll(res.locals.user.username);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json({ response: configs });
	},
	/**
	 * Subscribe to config
	 */
	createSubscription: async (req: Request, res: Response) => {
		if (await Subscribe.findIfSubscribed(res.locals.user.username, req.body.id)) {
			return res.json({ response: response.conflict.alreadySubscribed });
		}
		await Subscribe.create(req.body.id, res.locals.user.username);
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		return res.json({ response: response.success.createSubscription });
	},
	/**
	 * Unsubscribe to config
	 */
	deleteSubscription: async (req: Request, res: Response) => {
		const sub: any = await Subscribe.find(req.params.id);
		const config: any = await Config.find(sub.config.id);
		if (config.authorUser === sub.user) {
			return res.json({ response: response.conflict.creatorOfConfig });
		}
		if (sub.user === res.locals.user.username) {
			await Subscribe.delete(req.params.id);
			await EventLog.create({
				route: req.originalUrl,
				ip: req.ip,
				timestamp: new Date(),
				userId: res.locals.user.id,
			});
			return res.json({ response: response.success.deleteSubscription });
		}
		return res.json({ response: response.notFound.id });
	},
	checkHwid: async (req: Request, res: Response) => {
        const { hwid } = req.body;
        const user = res.locals.user.username;
        const existingHwid = await Hwid.findById(user);

        if (existingHwid) {
            if (existingHwid.hwid !== hwid) {
                return res.status(400).json({ error: true, response: 'HWID mismatch' });
            }
        } else {
            await Hwid.create(user, hwid);
        }

        return res.status(200).json({ response: 'HWID verified' });
    },
	
	validateToken: async (req: Request, res: Response) => {
        const { token } = req.body;
        try {
            const decoded = jwt.verify(token, config.jwt.secret);
            return res.status(200).json({ valid: true, expired: false, response: decoded });
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(400).json({ valid: false, expired: true, response: 'Token expired' });
            }
            return res.status(400).json({ valid: false, expired: false, response: 'Invalid token' });
        }
    },
	
};
