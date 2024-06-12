import 'reflect-metadata';
import env from './config/env';
import express, { NextFunction } from 'express';
import { logger } from './config/logger';
import { BaseError } from './middleware/error/baseError';
import { ErrorHandler } from './middleware/error/errorHandler';

async function startApp() {
  const app = express();

  await require('./loaders').default({ expressApp: app });

  // handling errors
  const errorHandler = new ErrorHandler(logger);

  process.on('uncaughtException', async (error: Error) => {
    await errorHandler.handleError(error);
    if (!errorHandler.isTrustedError(error)) process.exit(1);
  });

  process.on('unhandledRejection', (reason: Error) => {
    throw reason;
  });

  async function errorMiddleware(
    err: BaseError,
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (!errorHandler.isTrustedError(err)) {
      next(err);
      return;
    }
    await errorHandler.handleError(err);
  }

  // @ts-ignore
  app.use(errorMiddleware);

  app.listen(env.port, () =>
    logger.info(`school management system service is running on port ${env.port}`),
  );
}

startApp().then(() => {});
