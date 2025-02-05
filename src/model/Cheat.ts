import db from '../database';

export default {
	/**
	 * Find Cheat
	 */
	findAll: async () => db.cheat.findMany(),
	/**
	 * Create Cheat
	 * @param game
	 * @param version
	 */
	create: async (game: string, version: string, status: 'Undetected' | 'Detected' | 'Updating' | 'Offline') =>
		db.cheat.create({ data: { game, version, status } }),
	/**
	 * Edit Cheat
	 * @param id
	 * @param game
	 * @param version
	 */
	edit: async (
		id: number,
		game: string,
		version: string,
		status: 'Undetected' | 'Detected' | 'Updating' | 'Offline'
	) => db.cheat.update({ where: { id }, data: { game, version, status } }),
	/**
	 * Delete Cheat
	 * @param id
	 */
	delete: async (id: number) => db.cheat.delete({ where: { id } }),
};
