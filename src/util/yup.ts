import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';
import config from '../config';
import { logger } from './';
import Panel from '../model/Panel';

const limits = config.validator;

/**
 * Validator Util
 */
export default {
	/**
	 * Yup validation middleware
	 */
	validate: (schema: any) => async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.validate({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			return next();
		} catch (err: any) {
			logger.debug(err.message);
			return res.status(400).json({
				error: true,
				response: 'Validation error',
			});
		}
	},

	int: Yup.number().required().integer(),
	number: Yup.number().required(),
	bool: Yup.boolean().required().oneOf([true, false]),
	string: (max: number) => Yup.string().max(max),

	uuid: Yup.string().uuid(),

	username: Yup.string()
		.required()
		.min(limits.minUsername)
		.max(limits.maxUsername)
		.matches(/^[a-zA-Z0-9]+$/),

	email: Yup.string().required().email().min(limits.minEmail).max(limits.maxEmail),

	password: Yup.string().required().min(limits.minPassword).max(limits.maxPassword),

	inviteCode: Yup.string().length(limits.code).notRequired(),

	role: Yup.string().required().oneOf(['USER', 'BETA', 'ADMIN']),

	configStatus: Yup.string().required().oneOf(['PUBLIC', 'PRIVATE']),

	configType: Yup.string().required().oneOf(['CONFIG', 'SCRIPT']),

	page: Yup.number().notRequired().integer(),

	color: Yup.string().max(9),
};
