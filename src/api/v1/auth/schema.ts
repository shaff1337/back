import * as Yup from 'yup';
import { yup } from '../../../util';

/**
 * Schemas
 */
export default {
	signIn: Yup.object({
		body: Yup.object({
			username: yup.username,
			password: yup.password,
		}),
	}),
	signUp: Yup.object({
		body: Yup.object({
			username: yup.username,
			email: yup.email,
			password: yup.password,
			code: yup.inviteCode,
		}),
	}),
};
