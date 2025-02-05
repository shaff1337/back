import 'dotenv/config';
import pkg from '../package.json';

const getEnv = (key: string): string => {
	const varS = process.env[key];
	if (!varS) {
		console.error(`[!] Env variable ${key} undefined.`);
		process.exit(1);
	} else return process.env[key] as string;
};

getEnv('DATABASE_URL');

const config = {
	environment: getEnv('NODE_ENV'),
	app: {
		name: pkg.name,
		version: pkg.version,
		description: pkg.description,
		port: Number(getEnv('PORT')),
	},
	jwt: {
		secret: getEnv('TOKEN_SECRET'),
		algorithm: 'HS256',
	},
	coinbase: {
		secret: getEnv('COINBASE_API_KEY'),
		webhook: getEnv('COINBASE_WEBHOOK_SECRET'),
		domain: getEnv('DOMAIN'),
	},
	validator: {
		minUsername: 3,
		maxUsername: 12,
		minEmail: 3,
		maxEmail: 100,
		minPassword: 4,
		maxPassword: 30,
		code: 20,
	},
};

export default config;
