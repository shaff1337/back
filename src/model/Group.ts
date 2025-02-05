import db from '../database';

export default {
	/**
	 * Get all groups
	 */
	findAll: async () =>
		db.group.findMany({
			orderBy: {
				createdAt: 'asc',
			},
		}),
	/**
	 * Find
	 */
	find: async (id: string) =>
		db.group.findMany({
			where: { id },
		}),
	/**
	 * Create group
	 * @param name
	 */
	create: async (name: string) => db.group.create({ data: { name } }),
	/**
	 * Delete group
	 * @param id
	 */
	delete: async (id: string) => db.group.delete({ where: { id } }),
	/**
	 * Delete group by name
	 * @param name
	 */
	deleteByName: async (name: string) => db.group.delete({ where: { name } }),
};
