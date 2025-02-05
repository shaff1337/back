import db from '../database';

export default {
	/**
	 * Find invite by code
	 * @param code
	 */
	find: async (code: string) => db.invite.findFirst({ where: { code, invitedUser: null } }),
	/**
	 * Find invite by code
	 */
	findAll: async (page: number) =>
		db.invite.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				author: {
					select: {
						username: true,
						avatar: true,
					},
				},
			},
			skip: page * 10,
			take: 10,
		}),
	/**
	 * Find user invite
	 * @param authorUser
	 * @param page
	 */
	findInvites: async (authorUser: string, page: number) =>
		db.invite.findMany({
			include: {
				author: {
					select: {
						username: true,
						avatar: true,
					},
				},
			},
			where: {
				authorUser,
			},
			orderBy: {
				createdAt: 'desc',
			},
			skip: page * 10,
			take: 10,
		}),
	/**
	 * Find invite by code
	 * @param code
	 * @param invitedUser
	 */
	setUsed: async (invitedUser: string, code: string) => db.invite.update({ data: { invitedUser }, where: { code } }),
	/**
	 * Create invite code
	 * @param code
	 * @param authorUser
	 */
	create: async (authorUser: string, code: string) => db.invite.createMany({ data: { authorUser, code } }),
	/*
	 * Get invite pages ADMIN
	 */
	length: async () => db.invite.count(),
	/*
	 * Get invite pages USER
	 */
	lengthUser: async (authorUser: string) => db.invite.count({ where: { authorUser } }),
};
