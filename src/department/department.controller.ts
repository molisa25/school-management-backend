import { Router, Request, Response, NextFunction } from 'express';
import { APIError } from '../middleware/error/appError';
import { BaseError } from '../middleware/error/baseError';
import { Container } from 'typedi';
import DepartmentService from './department.service';
import { sendResponse } from '../utils/response';
import { CreateDepartmentDto } from './department.dto';
import { isUserAdmin } from '../middleware/auth';

// API Functions
const fetchDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const serviceInstance = Container.get(DepartmentService);
    const { pagination, data } = await serviceInstance.fetch_departments(
      page,
      pageSize,
    );

    return sendResponse(res, {
      success: true,
      message: 'fetched department successfully',
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

const fetchDepartmentDetail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const serviceInstance = Container.get(DepartmentService);
    const response = await serviceInstance.fetch_department_by_id(
      id as string,
    );

    return sendResponse(res, {
      success: true,
      message: 'fetched department detail successfully',
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

const createDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const serviceInstance = Container.get(DepartmentService);
    await serviceInstance.create_department(req.body as CreateDepartmentDto);

    return sendResponse(res, {
      success: true,
      message: 'created department successfully',
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

router.get('/', fetchDepartments);
router.get('/:id', fetchDepartmentDetail);
router.post('/create', isUserAdmin, createDepartment);

export default router;
