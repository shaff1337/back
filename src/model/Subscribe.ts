import db from '../database';

export default {
	/**
	 * Find Subscribe
	 * @param id
	 */
	find: async (id: string) => db.subscribe.findFirst({ where: { id }, include: { config: true } }),
	/**
	 * Find Subscribe
	 * @param id
	 */
	findIfSubscribed: async (user: string, configId: string) => db.subscribe.findFirst({ where: { user, configId } }),
	/**
	 * Find all Subscribe
	 * @param authorUser
	 */
	findAll: async (authorUser: string) =>
		db.subscribe.findMany({
			where: { user: authorUser },
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				config: {
					select: {
						name: true,
						status: true,
						type: true,
						author: { select: { username: true, avatar: true } },
						updatedAt: true,
					},
				},
			},
		}),
	/**
	 * Create Subscribe
	 * @param id
	 * @param user
	 */
	create: async (configId: string, user: string) => db.subscribe.create({ data: { configId, user } }),
	/**
	 * Delete Subscribe
	 * @param id
	 */
	delete: async (id: string) => db.subscribe.delete({ where: { id } }),
	/**
	 * Delete all subscribptions
	 * @param id
	 */
	deleteAll: async (configId: string) => db.subscribe.deleteMany({ where: { configId } }),
};
