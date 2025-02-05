import db from '../database';

export default {
	/**
	 * Get all announcement types
	 */
	findAll: async () => db.type.findMany(),
	/**
	 * Get all announcement types
	 */
	find: async (id: string) => db.type.findFirst({ where: { id } }),
	/**
	 * Create announcement type
	 * @param text
	 * @param color
	 */
	create: async (text: string, color: string) => db.type.create({ data: { text, color } }),
	/**
	 * Delete announcement type
	 * @param id
	 */
	delete: async (id: string) => db.type.delete({ where: { id } }),
	/**
	 * Edit announcement type
	 * @param text
	 * @param color
	 */
	edit: async (id: string, text: string, color: string) => db.type.update({ where: { id }, data: { text, color } }),
};
