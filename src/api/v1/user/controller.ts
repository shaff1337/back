import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import createError from 'http-errors';
import Invite from '../../../model/Invite';
import User from '../../../model/User';
import response from '../response.json';
import md5 from 'md5';
import { coinbaseclient } from 'src/app';
import EventLog from '../../../model/EventLog';

type ChargeData = {
	name: string;
	description: string;
	local_price: {
		amount: number;
		currency: string;
	};
	pricing_type: 'no_price' | 'fixed_price';
	metadata: {
		user: string;
		sub: string;
	};
};

const subscriptionData = [
	{ id: '0', label: 'basic', days: 30, value: 4.99 },
	{ id: '1', label: 'essential', days: 90, value: 9.99 },
	{ id: '2', label: 'premium', days: 365, value: 14.99 },
];

/**
 * Controller
 */
export default {
	/**
	 * Create charge
	 */
	createPayment: async (req: Request, res: Response) => {
		// const chargeData = {
		// 	name: 'Madrigal',
		// 	description: 'Test',
		// 	// description: 'Madrigal subscription for ' + res.locals.user.username,
		// 	local_price: {
		// 		// amount: subscriptionData[req.body.id].value,
		// 		amount: '10.00',
		// 		currency: 'USD',
		// 	},
		// 	pricing_type: 'fixed_price',
		// 	// metadata: {
		// 	// 	user: res.locals.user.username,
		// 	// 	sub: req.body.id,
		// 	// },
		// };

		// // @ts-expect-error
		// const charge = await resources.Charge.create(chargeData, function (error, response) {
		// 	console.log("error:" + error);
		// 	console.log(response);
		//   });
		// 

		const checkout = await coinbaseclient.createCharge({
			name: "northed",
			description: 'Northed subscription for ' + res.locals.user.username,
			pricing_type: "fixed_price",
			local_price: {
				amount: subscriptionData[req.body.id].value,
				currency: "USDT", // BTC, ETH, USDT
			},
			metadata: {
				customer_name: res.locals.user.username,
				customer_id: req.body.id,
			 },
			redirect_url: "http://example.com/redirect_url",
			cancel_url: "http://example.com/cancel_url",
		});
		console.log(checkout);
		res.send(checkout);
	},
	/**
	 * Get user
	 */
	me: async (req: Request, res: Response) => {
		const user = await User.find(res.locals.user.username, true);
		// @ts-ignore
		user.avatar = md5(user.email);
		// @ts-ignore
		delete user.password;
		res.json({ response: user });
	},
	/**
	 * Get user invites
	 */
	getInvites: async (req: Request, res: Response) => {
		const invites = await Invite.findInvites(res.locals.user.username, parseInt(req.params.page));
		res.json({ response: invites });
	},
	/**
	 * Get user invite pages
	 */
	getInvitePages: async (req: Request, res: Response) => {
		const length = await Invite.lengthUser(res.locals.user.username);
		return res.json({ response: Math.ceil(length / 10) - 1 });
	},
	/**
	 * Update user password
	 */
	setPassword: async (req: Request, res: Response) => {
		const { currentPassword, password } = req.body;
		if (!(await bcrypt.compare(currentPassword, res.locals.user.password))) {
			throw new createError.Unauthorized(response.invalid.currentPassword);
		}
		await User.setPassword(res.locals.user.username, password);
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
		const { email } = req.body;
		await User.setEmail(res.locals.user.username, email, md5(email));
		await User.setVerified({
			username: res.locals.user.username,
			isVerified: false,
		});
		await EventLog.create({
			route: req.originalUrl,
			ip: req.ip,
			timestamp: new Date(),
			userId: res.locals.user.id,
		});
		res.json({ response: response.success.setEmail });
	},
};
