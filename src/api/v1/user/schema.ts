import * as Yup from 'yup';
import { yup } from '../../../util';

/**
 * Schemas
 */
export default {
	password: Yup.object({
		body: Yup.object({ password: yup.password }),
	}),
	email: Yup.object({
		body: Yup.object({ email: yup.email }),
	}),

	page: Yup.object({
		params: Yup.object({ page: yup.page }),
	}),

	payment: Yup.object({
		body: Yup.object({ id: yup.string(1) }),
	}),
};
