import { config } from 'dotenv';
import { BaseError } from '../middleware/error/baseError';

const env = config();
if (env.error) {
  throw new BaseError(
    'Could not find .env file',
    env.error.message,
    '.env error',
  );
}

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  api: {
    prefix: '/api/v1',
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  log: {
    level: process.env.LOG_LEVEL,
  },
  jwt_secret: process.env.JWT_SECRET,
};
