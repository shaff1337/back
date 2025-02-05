import db from '../database';

export default {
	/**
	 * Create Ban
	 * @param bannedUser
	 * @param authorUser
	 * @param reason
	 */
	create: async (bannedUser: string, authorUser: string, reason?: string) =>
		db.ban.create({ data: { bannedUser, authorUser, reason } }),
	/**
	 * Delete Ban
	 * @param bannedUser
	 */
	delete: async (bannedUser: string) => db.ban.delete({ where: { bannedUser } }),
};
