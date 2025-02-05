import db from '../database';

export default {
	/**
	 * Get all announcements
	 */
	findAll: async (page: number) =>
		db.announcement.findMany({
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
	 * Find announcement
	 * @param id
	 */
	find: async (id: string) => db.announcement.findFirst({ where: { id } }),
	/**
	 * Create announcement
	 * @param title
	 * @param type
	 * @param text
	 * @param authorUser
	 */
	create: async (title: string, text: string, typeName: string, typeColor: string, authorUser: string) =>
		db.announcement.create({ data: { title, text, typeName, typeColor, authorUser } }),
	/**
	 * Delete announcement
	 * @param id
	 */
	delete: async (id: string) => db.announcement.delete({ where: { id } }),
	/**
	 * Delete all announcements
	 * @param typeName
	 */
	deleteAll: async (typeName: string) => db.announcement.deleteMany({ where: { typeName } }),
	/**
	 * Update announcements
	 * @param oldTypeName
	 * @param newTypeName
	 * @param newTypeColor
	 */
	updateAll: async (oldTypeName: string, newTypeName: string, newTypeColor: string) =>
		db.announcement.updateMany({
			where: { typeName: oldTypeName },
			data: { typeName: newTypeName, typeColor: newTypeColor },
		}),
	/**
	 * Get lenght
	 */
	length: async () => db.announcement.count(),
};
