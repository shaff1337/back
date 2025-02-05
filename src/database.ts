import { Prisma, PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import User from './model/User';
import Hwid from './model/Hwid';
import createError from 'http-errors';
import response from './api/v1/response.json';

/**
 * Initialize Prisma's Client
 */
const prisma: PrismaClient = new PrismaClient({ errorFormat: 'minimal' });
/**
 * Prisma Middleware
 */
prisma.$use(async (params: Prisma.MiddlewareParams, next) => {
	if (params.model === 'User') {
		// User created || User updated
		if (params.action === 'create' || params.action === 'update') {
			// Bind: User
			const user = params.args.data;
			// Check: Username is NOT taken
			if (user.username) {
				if (await User.findByUsername(user.username)) {
					throw new createError.Conflict(response.conflict.usernameTaken);
				}
			}
			// Check: Email is NOT taken
			if (user.email) {
				if (await User.findByEmail(user.email)) {
					throw new createError.Conflict(response.conflict.emailTaken);
				}
			}
			// Hash Password
			if (user.password) user.password = bcrypt.hashSync(user.password, 12);
		}
	}

	if (params.model === 'Hwid') {
		if (params.action === 'create' || params.action === 'update') {
			// Bind: User
			const hwid = params.args.data;
			// Check: Username is NOT taken
			if (hwid.hwid) {
				if (await Hwid.find(hwid.hwid)) {
					throw new createError.Conflict(response.conflict.hwidTaken);
				}
			}
			if (hwid.userId) {
				if (await Hwid.findById(hwid.userId)) {
					throw new createError.Conflict(response.conflict.idTaken);
				}
			}
		}
	}

	// Should be at last, always.
	return await next(params);
});

export default prisma;
