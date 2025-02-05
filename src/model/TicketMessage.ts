import db from '../database';

export default {
	/**
	 * Create ticket message
	 * @param ticketId
	 * @param message
	 * @param authorUser
	 */
	create: async (ticketId: number, message: string, authorUser: string) =>
		db.ticketMessage.create({ data: { ticketId, message, authorUser } }),
};
