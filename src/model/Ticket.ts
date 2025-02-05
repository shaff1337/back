import db from '../database';

export default {
	/**
	 * Get all tickets
	 */
	findAll: async () => db.ticket.findMany(),
	/**
	 * Get all tickets for certain user
	 * @param authorUser
	 * @param page
	 */
	findAllByUser: async (authorUser: string, page: number) =>
		db.ticket.findMany({
			where: { authorUser },
			orderBy: {
				createdAt: 'desc',
			},
			skip: page * 10,
			take: 10,
		}),
	/**
	 * Get ticket for id
	 */
	find: async (id: number) => db.ticket.findFirst({ where: { id } }),
	/**
	 * Create ticket
	 * @param topic
	 * @param authorUser
	 */
	create: async (topic: string, authorUser: string) => db.ticket.create({ data: { topic, authorUser } }),
	/**
	 * Set ticket closed
	 * @param id
	 * @param status
	 */
	setStatus: async (id: number, status: 'Open' | 'Closed') => db.ticket.update({ where: { id }, data: { status } }),
	/**
	 * Announcement length for admin
	 */
	findLength: async () => db.ticket.count(),
	/**
	 * Announcement length for user
	 * @param authorUser
	 */
	findLengthByUser: async (authorUser: string) => db.ticket.count({ where: { authorUser } }),
};
