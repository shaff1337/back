import jwt from 'jsonwebtoken';
import config from '../config';

interface IAuthToken {
	id: number;
	username: string;
	role: string;
	subscription: Date | null;
}

const generateToken = (payload: string | object, expiresIn: string): string =>
	jwt.sign(payload, config.jwt.secret, { expiresIn });
/**
 * JWT Util
 */
export default {
	/**
	 * Generates JWT Access Token
	 */
	generateAuthToken: (user: IAuthToken) =>
		generateToken({ id: user.id, username: user.username, role: user.role, subscription: user.subscription }, '1y'),
};
