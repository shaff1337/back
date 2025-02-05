import db from '../database';

export default {
	/**
	 * Find all Config
	 * @param page
	 * @param type
	 */
	findAll: async (page: number, type: 'CONFIG' | 'SCRIPT') =>
		db.config.findMany({
			where: {
				status: 'PUBLIC',
				type,
			},
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
	 * Find Config
	 * @param id
	 */
	find: async (id: string) => db.config.findFirst({ where: { id } }),
	/**
	 * Find Config
	 * @param id
	 */
	findMember: async (authorUser: string) =>
		db.config.findMany({
			where: { authorUser },
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
	 * Create Config
	 * @param name
	 * @param data
	 * @param status
	 * @param type
	 * @param authorUser
	 */
	create: async (
		name: string,
		data: string,
		type: 'CONFIG' | 'SCRIPT',
		status: 'PUBLIC' | 'PRIVATE',
		authorUser: string
	) => db.config.create({ data: { name, data, type, status, authorUser } }),
	/**
	 * Edit config
	 * @param id
	 * @param name
	 * @param data
	 * @param status
	 * @param authorUser
	 */
	edit: async (id: string, name: string, data: string, status: 'PUBLIC' | 'PRIVATE') =>
		db.config.update({ where: { id }, data: { name, data, status } }),
	/**
	 * Delete Config
	 * @param id
	 */
	delete: async (id: string) => db.config.delete({ where: { id } }),
	/**
	 * Config length
	 */
	length: async () => db.config.count(),
};
