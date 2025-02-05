import db from '../database';

export default {
	/**
	 * Get all FAQ
	 */
	findAll: async () =>
		db.faq.findMany({
			orderBy: {
				createdAt: 'desc',
			},
		}),
	/**
	 * Get all FAQ by group
	 * @param group
	 */
	findByGroup: async (group: string) =>
		db.faq.findMany({
			orderBy: {
				createdAt: 'desc',
			},
			where: {
				group,
			},
		}),
	/**
	 * Create FAQ
	 * @param question
	 * @param answer
	 * @param group
	 */
	create: async (question: string, answer: string, group: string) =>
		db.faq.create({ data: { question, answer, group } }),
	/**
	 * Delete FAQ
	 * @param id
	 */
	delete: async (id: string) => db.faq.delete({ where: { id } }),
	/**
	 * Delete FAQs by group
	 * @param group
	 */
	deleteAll: async (group: string) => db.faq.deleteMany({ where: { group } }),
	/**
	 * Edit FAQ
	 * @param id
	 * @param question
	 * @param answer
	 * @param group
	 */
	edit: async (id: string, question: string, answer: string, group: string) =>
		db.faq.update({ where: { id }, data: { question, answer, group } }),
	/**
	 * Edit all FAQs
	 * @param oldGroup
	 * @param newGroup
	 */
	updateAll: async (oldGroup: string, newGroup: string) =>
		db.faq.updateMany({
			where: { group: oldGroup },
			data: { group: newGroup },
		}),
};
