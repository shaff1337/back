import db from '../database';

export default {
	find: async (hwid: string) => db.hwid.findFirst({ where: { hwid } }),
	findById: async (authorUser: string) => db.hwid.findFirst({ where: { authorUser } }),
	/**
	 * Create HWID
	 * @param authorUser
	 * @param hwid
	 */
	create: async (authorUser: string, hwid: string) => db.hwid.create({ data: { authorUser, hwid } }),
	/**
	 * Delete HWID
	 * @param authorUser
	 */
	delete: async (authorUser: string) => db.hwid.delete({ where: { authorUser } }),
};
