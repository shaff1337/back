import server from './app';
import config from './config';
import { logger } from './util';

server.listen(config.app.port, () => logger.info(`Started in ${config.environment} [${config.app.port}]`));
server.on('error', (error) => logger.error(error));
