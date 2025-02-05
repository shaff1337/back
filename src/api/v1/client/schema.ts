import * as Yup from 'yup';
import { yup } from '../../../util';

/**
 * Schemas
 */
export default {
	username: Yup.object({ params: Yup.object({ username: yup.username }) }),
	uuid: Yup.object({ params: Yup.object({ id: yup.uuid }) }),
	page: Yup.object({ params: Yup.object({ page: yup.page }) }),

	shout: Yup.object({
		body: Yup.object({ message: yup.string(100) }),
	}),

	subscription: Yup.object({ body: Yup.object({ id: yup.uuid }) }),

	config: Yup.object({
		body: Yup.object({
			name: yup.string(30),
			data: yup.string(25565),
			status: yup.configStatus,
			type: yup.configType,
		}),
	}),

	// goofy ahh
	getConfigs: Yup.object({
		params: Yup.object({
			page: yup.page,
			type: yup.configType,
		}),
	}),

	editConfig: Yup.object({
		params: Yup.object({ id: yup.uuid }),
		body: Yup.object({ name: yup.string(30), data: yup.string(25565), status: yup.configStatus }),
	}),

	hwid: Yup.object({
        body: Yup.object({
            hwid: yup.string(255).required(),
        }),
    }),
	
	token: Yup.object({
        body: Yup.object({
            token: yup.string().required(),
        }),
    }),
};
