import { Prisma } from '@prisma/client';
import db from '../database';
import parseBool from '../util/parseBool';
// import createError from 'http-errors';

interface ICreate {
	username: string;
	password: string;
	email: string;
	avatar: string;
}

export default {
	/**
	 * Find user by ID
	 * @param username
	 * @param invitedBy
	 */
	find: async (username: string, invitedBy = false) =>
		db.user.findFirst({
			where: { username },
			include: { banned: true, invited: invitedBy ?? { select: { authorId: true } } },
		}),
	/**
	 * Find all users
	 */
	findAll: async () =>
		db.user.findMany({
			select: {
				id: true,
				username: true,
				avatar: true,
				role: true,
				banned: true,
				createdAt: true,
				subscription: true,
			},
			orderBy: {
				createdAt: 'asc',
			},
		}),
	/**
	 * Find all users by page
	 * @param page
	 */
	findAllByPage: async (page: number) =>
		db.user.findMany({
			select: {
				id: true,
				username: true,
				avatar: true,
				role: true,
				banned: true,
				createdAt: true,
			},
			orderBy: {
				createdAt: 'asc',
			},
			skip: page * 10,
			take: 10,
		}),
	/**
	 * Find user by username
	 * @param username
	 */
	findByUsername: async (username: string, invitedBy = false) =>
		db.user.findFirst({
			where: { username },
			include: { banned: true, invited: invitedBy ?? { select: { authorId: true } } },
		}),
	/**
	 * Find user by email
	 * @param email
	 */
	findByEmail: async (email: string) => db.user.findFirst({ where: { email } }),
	/**
	 * Find by role
	 * @param role
	 */
	findByRole: async (role: 'USER' | 'BETA' | 'ADMIN') =>
		db.user.findMany({ where: { role }, select: { username: true } }),
	/**
	 * Register a new user
	 * @param username
	 * @param password
	 * @param email
	 * @param avatar
	 */
	create: async ({ username, password, email, avatar }: ICreate) =>
		db.user.create({ data: { username, password, email, avatar } }),
	/**
	 * Set email
	 * @param username
	 * @param email
	 */
	setEmail: async (username: string, email: string, avatar: any) =>
		db.user.update({
			where: { username },
			data: { email, avatar },
		}),
	/**
	 * Set password
	 * @param username
	 * @param password
	 */
	setPassword: async (username: string, password: string) =>
		db.user.update({
			where: { username },
			data: { password },
		}),
	/**
	 * Set role
	 * @param username
	 * @param role
	 */
	setRole: async (username: string, role: 'USER' | 'BETA' | 'ADMIN') =>
		db.user.update({
			where: { username },
			data: { role },
		}),
	/**
	 * Set verified status
	 * @param username
	 * @param status
	 */
	setVerified: async ({ username, isVerified }: { username: string; isVerified: boolean }) =>
		db.user.update({
			where: { username },
			data: { isVerified: parseBool(isVerified) },
		}),
	/**
	 * Get length of users list
	 */
	length: async () => db.user.count(),
	/**
	 * Update user subscription
	 * @param username
	 * @param subscription
	 */
	setSubscription: async (username: string, sub: Date) => {
		db.user
			.update({
				where: {
					username,
				},
				data: {
					subscription: new Date(sub),
				},
			})
			.then((value) => {});
		// goofy ahh idk why it needed a fucking .then, it wasnt working otherwise
	},
};
