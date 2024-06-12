import {Router, Request, Response, NextFunction} from 'express';
import {APIError} from '../middleware/error/appError';
import {BaseError} from '../middleware/error/baseError';
import {Container} from 'typedi';
import CourseService from './course.service';
import {sendResponse} from '../utils/response';
import {CreateCourseDto} from './course.dto';
import {assertHasUser, isUserAdmin} from '../middleware/auth';
import {IUser} from "../user/user.interface";

// API Functions
const fetchCourses = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        assertHasUser(req);

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const serviceInstance = Container.get(CourseService);
        const {pagination, data} = await serviceInstance.fetch_courses(
            req.user as IUser,
            page,
            pageSize,
        );

        return sendResponse(res, {
            success: true,
            message: 'fetched courses successfully',
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

const fetchCourseDetail = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {id} = req.params;

        const serviceInstance = Container.get(CourseService);
        const response = await serviceInstance.fetch_course_by_id(
            id as string,
        );

        return sendResponse(res, {
            success: true,
            message: 'fetched course detail successfully',
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

const createCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const serviceInstance = Container.get(CourseService);
        await serviceInstance.create_course(req.body as CreateCourseDto);

        return sendResponse(res, {
            success: true,
            message: 'created course successfully',
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

router.get('/', fetchCourses);
router.get('/:id', fetchCourseDetail);
router.post('/create', isUserAdmin, createCourse);

export default router;
