import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from './error/baseError';
import { APIError } from './error/appError';
import jwt from 'jsonwebtoken';
import { IUser } from '../user/user.interface';
import { sendResponse } from '../utils/response';
import env from '../config/env';

type typeOfUserObject = IUser;
type RequestWithUser = Request & { user: typeOfUserObject };

export function assertHasUser(req: Request): asserts req is RequestWithUser {
  if (!('user' in req)) {
    throw new APIError(
      'User not found',
      'JWT Error',
      STATUS_CODES.UNAUTHORISED,
    );
  }
}

export const checkUserLoggedIn = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  if (!token) {
    return sendResponse(
      res,
      {
        success: false,
        message: 'Unauthorized',
      },
      STATUS_CODES.UNAUTHORISED,
    );
  }

  jwt.verify(token.split(' ')[1], env.jwt_secret as string, (err: any, user: any) => {
    if (err)
      return sendResponse(
        res,
        {
          success: false,
          message: 'Unauthorized',
        },
        STATUS_CODES.UNAUTHORISED,
      );

    req.user = user;

    next();
  });
};

export const isUserAdmin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  assertHasUser(req);

  if (req.user.role.toUpperCase() !== 'ADMIN') {
    return sendResponse(
      res,
      {
        success: false,
        message: 'You do not have permission to access this resource.',
      },
      STATUS_CODES.UNAUTHORISED,
    );
  }

  next();
};
