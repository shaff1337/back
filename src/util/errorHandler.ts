import { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import _ from 'lodash';
import logger from './logger';
import config from '../config';

interface Error {
	code?: string;
	meta?: { target?: string[] };
	status?: number;
	message?: string;
}

/**
 * Error Handler Util
 */
export default {
	/**
	 * Error 404 handler
	 */
	notFound: (req: Request, res: Response, next: NextFunction): void => {
		next({
			status: 404,
			message: 'endpoint not found.',
		});
	},
	/**
	 * Controller/service exception handler
	 */
	handler: (fn: any) => (req: Request, res: Response, next: NextFunction) => {
		Promise.resolve(fn(req, res, next)).catch((err: Error) => {
			/**
			 * Handle DB errors.
			 * https://www.prisma.io/docs/reference/api-reference/error-reference
			 */
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				logger.debug(err);
				err.message = err.code;
			}
			next(err);
		});
	},
	/**
	 * Exception handler
	 */
	global: (err: Error, req: Request, res: Response, next: NextFunction): void => {
		// Setup Error info
		const errCode: number = err.status || 500;
		let errMessage: string = err.message || 'Unexpected unknown error';
		if (errCode === 500) {
			logger.error(errMessage);
			if (config.environment === 'production') errMessage = 'Unexpected error';
		}
		// Send error with info
		res.status(errCode).json({
			error: true,
			response: errMessage,
		});
	},
};
