import { Router, Request, Response, NextFunction } from 'express';
import { APIError } from '../middleware/error/appError';
import { BaseError } from '../middleware/error/baseError';
import { Container } from 'typedi';
import StaffService from './staff.service';
import { sendResponse } from '../utils/response';
import { CreateStaffDto } from './staff.dto';
import { isUserAdmin } from '../middleware/auth';

// API Functions
const fetchStaffs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const serviceInstance = Container.get(StaffService);
    const { pagination, data } = await serviceInstance.fetch_staffs(
      page,
      pageSize,
    );

    return sendResponse(res, {
      success: true,
      message: 'fetched staffs successfully',
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

const fetchStaffDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const serviceInstance = Container.get(StaffService);
    const response = await serviceInstance.fetch_staff_by_id(
      id as string,
    );

    return sendResponse(res, {
      success: true,
      message: 'fetched staff detail successfully',
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

const createStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const serviceInstance = Container.get(StaffService);
    await serviceInstance.create_staff(req.body as CreateStaffDto);

    return sendResponse(res, {
      success: true,
      message: 'created staff successfully',
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

// Set up API routes.
const router = Router();

router.get('/', fetchStaffs);
router.get('/:id', fetchStaffDetail);
router.post('/create', isUserAdmin, createStaff);

export default router;
