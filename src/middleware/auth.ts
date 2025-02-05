import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import User from '../model/User';
import config from '../config';
import jsonwebtoken from 'jsonwebtoken';

/**
 * Auth
 */
export default {
	/**
	 * Authentication
	 * Verify JWT Token Middleware
	 */
	verify: async (req: Request, res: Response, next: NextFunction) => {
		// Get: Token
		const authHeader = req.headers.authorization;
		const token = authHeader && authHeader.split(' ');
		const error = 'InvalidToken';
		if (!token || token[0] !== 'Bearer') next(new createError.Unauthorized(error));
		else {
			// Verify: Token
			jsonwebtoken.verify(token[1], config.jwt.secret, async (err, decoded) => {
				if (err || !decoded || typeof decoded === 'string') next(new createError.Unauthorized(error));
				else {
					const user = await User.findByUsername(decoded.username);
					if (user && decoded.role !== user.role) next(new createError.Unauthorized(error));
					res.locals.user = user;
					next();
				}
			});
		}
	},
	/**
	 * Authorization
	 * Validate permissions
	 */
	hasPermission: (...roles: string[]) => {
		return async (req: Request, res: Response, next: NextFunction) => {
			const user = res.locals.user;
			if (user.banned) {
				res.status(403).json({
					error: true,
					response: { banned: true, reason: user.banned.reason },
				});
			} else if (user.role !== 'ADMIN' && !roles.includes(user.role)) {
				next(new createError.Unauthorized('Missing permissions.'));
			} else next();
		};
	},
};
