import * as Yup from 'yup';
import { yup } from '../../../util';

/**
 * Schemas
 */
export default {
	id: Yup.object({ params: Yup.object({ id: yup.int }) }),
	uuid: Yup.object({ params: Yup.object({ id: yup.uuid }) }),
	username: Yup.object({ params: Yup.object({ username: yup.username }) }),
	page: Yup.object({ params: Yup.object({ page: yup.page }) }),

	password: Yup.object({
		params: Yup.object({ username: yup.username }),
		body: Yup.object({ password: yup.password }),
	}),

	email: Yup.object({
		params: Yup.object({ username: yup.username }),
		body: Yup.object({ email: yup.email }),
	}),

	role: Yup.object({
		params: Yup.object({ username: yup.username }),
		body: Yup.object({ role: yup.role }),
	}),

	verified: Yup.object({
		params: Yup.object({ username: yup.username }),
		body: Yup.object({ isVerified: yup.bool }),
	}),

	ban: Yup.object({
		params: Yup.object({ username: yup.username }),
		body: Yup.object({ reason: yup.string(100) }),
	}),

	type: Yup.object({
		body: Yup.object({ name: yup.string(20), color: yup.color }),
	}),

	editType: Yup.object({
		params: Yup.object({ id: yup.uuid }),
		body: Yup.object({ oldName: yup.string(20), newName: yup.string(20), newColor: yup.color }),
	}),

	announcement: Yup.object({
		body: Yup.object({
			title: yup.string(255),
			text: yup.string(25565),
			typeName: yup.string(20),
			typeColor: yup.color,
		}),
	}),

	group: Yup.object({
		body: Yup.object({
			name: yup.string(255),
		}),
	}),

	editGroup: Yup.object({
		body: Yup.object({
			oldName: yup.string(255),
			newName: yup.string(255),
		}),
	}),

	faq: Yup.object({
		body: Yup.object({
			question: yup.string(255),
			answer: yup.string(25565),
			group: yup.string(255),
		}),
	}),

	editFAQ: Yup.object({
		params: Yup.object({ id: yup.uuid }),
		body: Yup.object({
			question: yup.string(255),
			answer: yup.string(25565),
			group: yup.string(255),
		}),
	}),

	cheat: Yup.object({
		body: Yup.object({ game: yup.string(255), version: yup.string(255), status: yup.string(10) }),
	}),

	editCheat: Yup.object({
		params: Yup.object({ id: yup.int }),
		body: Yup.object({ game: yup.string(255), version: yup.string(255), status: yup.string(10) }),
	}),

	subscription: Yup.object({
		params: Yup.object({ username: yup.username }),
		body: Yup.object({ time: yup.int }),
	}),
};
