import db from '../database';
import parseBool from '../util/parseBool';

export default {
	/**
	 * Find panel settings
	 */
	find: async () => db.panel.findFirst(),
	/**
	 * Edit panel settings
	 * @param id
	 * @body invites
	 */
	edit: async (id: string, invites: boolean) => db.panel.update({ where: { id }, data: { invites } }),
};
