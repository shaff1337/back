import { NextFunction, Request, Response } from 'express';
// import { Webhook } from 'coinbase-commerce-node';
import { verifyWebhook } from "node-coinbase-commerce";

import config from '../../../config';
import User from '../../../model/User';

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
	 * Webhook
	 */
	webhookCharge: async (req: Request, res: Response) => {
		const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
		const signature = req.headers['x-cc-webhook-signature'];
		console.log("created");
		try {
			
			const event: any = verifyWebhook(body, signature, config.coinbase.webhook);

			if (event.type === 'charge:created') {
				console.log('charge created');
				// all good, charge confirmed
				const user: any = User.findByUsername(event.metadata.user);
				let sub: Date;
				if (user.subscription) {
					user.subscription.setDate(user.subscription.getDate() + subscriptionData[event.metadata.sub].days);
					sub = user.subscription;
				} else {
					sub = new Date();
					sub.setDate(sub.getDate() + subscriptionData[event.metadata.sub].days);
				}
				await User.setSubscription(user.username, user.subscription);
			}

			res.send(`success ${event.id}`);
		} catch (error) {
			// functions.logger.error(error);
			res.status(400).send('failure!');
			console.log(error);
		}
	},
};
