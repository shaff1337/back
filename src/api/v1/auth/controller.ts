import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import createError from 'http-errors';
import { jwt } from '../../../util';
import Invite from '../../../model/Invite';
import User from '../../../model/User';
import md5 from 'md5';
import response from '../response.json';
import Panel from '../../../model/Panel';

/**
 * Controller
 */
export default {
	/**
	 * Find panel
	 */
	findPanel: async (req: Request, res: Response) => {
		const panel = await Panel.find();
		res.json({ response: panel });
	},
	/**
	 * Create a new user.
	 */
	signUp: async (req: Request, res: Response) => {
		const panel: any = await Panel.find();
		const { username, password, email, code } = req.body;
		if (panel.invites) {
			if (!(await Invite.find(code))) throw new createError.Conflict(response.notFound.inviteCode);
		}
		const avatar = md5(email);
		const user = await User.create({ username, password, email, avatar });
		if (panel.invites) {
			await Invite.setUsed(user.username, code);
		}
		const accessToken = jwt.generateAuthToken(user);
		res.status(201).json({ response: accessToken });
	},
	/**
	 * Sign-in with username and password.
	 */
	signIn: async (req: Request, res: Response) => {
		const { username, password } = req.body;
		const user = await User.findByUsername(username);
		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new createError.NotFound(response.notFound.user);
		}
		const accessToken = jwt.generateAuthToken(user);
		res.json({ response: accessToken });
	},
};