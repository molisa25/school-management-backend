import { LogLevel, createLogger } from 'bunyan';
import env from './env';

const logger = createLogger({
  name: 'school-management-system-log',
  streams: [
    {
      stream: process.stdout,
      level: (env.log.level as LogLevel) || 'info',
    },
  ],
});

logger.info('school management system logger started');

export { logger };
