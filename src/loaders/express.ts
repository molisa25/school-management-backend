import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import env from '../config/env';
import authEndpoint from '../auth/auth.controller';
import departmentEndpoint from '../department/department.controller';
import courseEndpoint from '../course/course.controller';
import moduleEndpoint from '../module/module.controller';
import enrolEndpoint from '../enrol/enrol.controller';
import staffEndpoint from '../staff/staff.controller';
import { checkUserLoggedIn } from '../middleware/auth';

export default ({ app }: { app: express.Application }) => {
  const whitelist = ['http://localhost'];
  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      if (env.node_env !== 'production') {
        callback(null, true); // ONLY FOR DEVELOPMENT
      } else {
        if (!origin || whitelist.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
  };

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(morgan('dev'));

  // health check endpoint
  app.get('/status', (req, res) => {
    return res.status(200).json({
      success: true,
      message: `service is running on port ${env.port}`,
    });
  });

  // load API routes
  app.use(env.api.prefix + '/auth', authEndpoint);
  app.use(
    env.api.prefix + '/department',
    checkUserLoggedIn,
    departmentEndpoint,
  );
  app.use(env.api.prefix + '/module', checkUserLoggedIn, moduleEndpoint);
  app.use(env.api.prefix + '/course', checkUserLoggedIn, courseEndpoint);
  app.use(env.api.prefix + '/enrol', checkUserLoggedIn, enrolEndpoint);
  app.use(env.api.prefix + '/staff', checkUserLoggedIn, staffEndpoint);
};
