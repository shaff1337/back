import db from '../database';

export default {
	/**
	 * Get all user comments
	 * @param commentedUser
	 */
	findAll: async (commentedUser: string) =>
		db.comment.findMany({
			where: { commentedUser },
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
		}),
	/**
	 * Create comment
	 * @param message
	 * @param authorUser
	 * @param commentedUser
	 */
	create: async (comment: string, authorUser: string, commentedUser: string) =>
		db.comment.create({ data: { comment, authorUser, commentedUser } }),
	/**
	 * Delete comment
	 * @param id
	 */
	delete: async (id: string) => db.comment.delete({ where: { id } }),
};
