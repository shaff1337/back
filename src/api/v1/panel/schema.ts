import * as Yup from 'yup';
import { yup } from '../../../util';

/**
 * Schemas
 */
export default {
	username: Yup.object({ params: Yup.object({ username: yup.username }) }),
	uuid: Yup.object({ params: Yup.object({ id: yup.uuid }) }),
	page: Yup.object({ params: Yup.object({ page: yup.page }) }),
};
