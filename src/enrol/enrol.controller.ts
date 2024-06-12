import { Router, Request, Response, NextFunction } from 'express';
import { APIError } from '../middleware/error/appError';
import { BaseError } from '../middleware/error/baseError';
import { Container } from 'typedi';
import EnrolService from './enrol.service';
import { sendResponse } from '../utils/response';
import { CreateEnrolmentDto } from './enrol.dto';
import { assertHasUser, isUserAdmin } from '../middleware/auth';
import { IUser } from '../user/user.interface';

// API Functions
const enrolToCourse = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    assertHasUser(req);

    const serviceInstance = Container.get(EnrolService);
    await serviceInstance.enrol_to_course(
      req.user as IUser,
      req.body as CreateEnrolmentDto,
    );

    return sendResponse(res, {
      success: true,
      message: 'course enrolment was successful',
      data: {},
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

const fetchUserEnrolment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    assertHasUser(req);

    const serviceInstance = Container.get(EnrolService);
    const response = await serviceInstance.fetch_enrolment_by_user_id(
      req.user as IUser,
    );

    return sendResponse(res, {
      success: true,
      message: 'fetched user course enrolments successfully',
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

const fetchEnrolmentDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const serviceInstance = Container.get(EnrolService);
    const response = await serviceInstance.fetch_enrolment_by_id(id as string);

    return sendResponse(res, {
      success: true,
      message: 'fetched enrolment detail successfully',
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

const fetchEnrolments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const serviceInstance = Container.get(EnrolService);
    const { pagination, data } = await serviceInstance.fetch_enrolments(
      page,
      pageSize,
    );

    return sendResponse(res, {
      success: true,
      message: 'fetched enrolments successfully',
      pagination,
      data,
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

router.post('/create', enrolToCourse);
router.get('/user/detail', fetchUserEnrolment);
router.get('/:id', isUserAdmin, fetchEnrolmentDetail);
router.get('/', isUserAdmin, fetchEnrolments);

export default router;
