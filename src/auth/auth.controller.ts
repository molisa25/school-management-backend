import { Router, Request, Response, NextFunction } from 'express';
import { APIError } from '../middleware/error/appError';
import { BaseError } from '../middleware/error/baseError';
import { Container } from 'typedi';
import AuthService from './auth.service';
import { sendResponse } from '../utils/response';
import { LoginDto, SignupDto } from './auth.dto';
import {IUser} from "../user/user.interface";
import {assertHasUser, checkUserLoggedIn} from "../middleware/auth";

// API Functions
const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceInstance = Container.get(AuthService);
    const response = await serviceInstance.login(req.body as LoginDto);

    return sendResponse(res, {
      success: true,
      message: 'logged in successfully',
      data: response,
    });
  } catch (err) {
    const message =
      err instanceof APIError ? err.message : 'Internal server error';

    sendResponse(
      res,
      {
        success: false,
        message,
      },
      (<BaseError>err)?.statusCode || 500,
    );

    next(err);
  }
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceInstance = Container.get(AuthService);
    const response = await serviceInstance.signUp(req.body as SignupDto);

    return sendResponse(res, {
      success: true,
      message: 'signed up successfully',
      data: response,
    });
  } catch (err) {
    const message =
      err instanceof APIError ? err.message : 'Internal server error';

    sendResponse(
      res,
      {
        success: false,
        message,
      },
      (<BaseError>err)?.statusCode || 500,
    );

    next(err);
  }
};

const fetchUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    assertHasUser(req);

    return sendResponse(res, {
      success: true,
      message: 'fetched user details',
      data: req.user as IUser,
    });
  } catch (err) {
    const message =
        err instanceof APIError ? err.message : 'Internal server error';

    sendResponse(
        res,
        {
          success: false,
          message,
        },
        (<BaseError>err)?.statusCode || 500,
    );

    next(err);
  }
};

// Set up API routes.
const router = Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/fetch-user', checkUserLoggedIn, fetchUser);

export default router;
