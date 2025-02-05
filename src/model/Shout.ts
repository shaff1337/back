import db from '../database';

export default {
	/**
	 * Get all shouts
	 */
	findAll: async () =>
		db.shout.findMany({
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
		}),
	/**
	 * Create shout
	 * @param message
	 * @param authorUser
	 */
	create: async (message: string, authorUser: string) => db.shout.create({ data: { message, authorUser } }),
	/**
	 * Delete shout
	 * @param id
	 */
	delete: async (id: string) => db.shout.delete({ where: { id } }),
	/**
	 * Delete shouts
	 */
	deleteAll: async () => db.shout.deleteMany(),
};
