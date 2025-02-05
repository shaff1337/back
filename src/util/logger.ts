import winston from 'winston';
import config from '../config';

/**
 * Setup error levels
 */
const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4,
};
/**
 * Setup base error level
 */
const level = (): string => (config.environment === 'development' ? 'debug' : 'http');
/**
 * Setup logger nature
 */
const transports = [
	new winston.transports.Console(),
	new winston.transports.File({
		filename: 'logs/error.log',
		level: 'error',
	}),
	new winston.transports.File({ filename: 'logs/all.log' }),
];
/**
 * Winston Logger Util
 */
const logger = winston.createLogger({
	level: level(),
	levels,
	transports,
	exitOnError: false,
});

// Export: logger
export default logger;
