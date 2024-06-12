import {Router, Request, Response, NextFunction} from 'express';
import {APIError} from '../middleware/error/appError';
import {BaseError} from '../middleware/error/baseError';
import {Container} from 'typedi';
import {sendResponse} from '../utils/response';
import {CreateModuleDto, RegisterModuleDto} from './module.dto';
import {assertHasUser, isUserAdmin} from '../middleware/auth';
import ModuleService from './module.service';
import {IUser} from '../user/user.interface';

// API Functions
const fetchModules = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        assertHasUser(req);

        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;

        const serviceInstance = Container.get(ModuleService);
        const {pagination, data} = await serviceInstance.fetch_modules(
            req.user as IUser,
            page,
            pageSize,
        );

        return sendResponse(res, {
            success: true,
            message: 'fetched modules successfully',
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

const fetchModuleDetail = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {id} = req.params;

        const serviceInstance = Container.get(ModuleService);
        const response = await serviceInstance.fetch_module_by_id(id as string);

        return sendResponse(res, {
            success: true,
            message: 'fetched module detail successfully',
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

const fetchModuleByCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const {courseId} = req.params;

        const serviceInstance = Container.get(ModuleService);
        const response = await serviceInstance.fetch_module_by_course(
            courseId as string,
        );

        return sendResponse(res, {
            success: true,
            message: 'fetched module by course successfully',
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

const registerToModule = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        assertHasUser(req);

        const serviceInstance = Container.get(ModuleService);
        await serviceInstance.register_module(
            req.user as IUser,
            req.body as RegisterModuleDto,
        );

        return sendResponse(res, {
            success: true,
            message: 'module registration was successful',
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

const fetchUserRegisteredModules = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        assertHasUser(req);

        const serviceInstance = Container.get(ModuleService);
        const response = await serviceInstance.fetch_user_module(req.user as IUser);

        return sendResponse(res, {
            success: true,
            message: 'user registered module was fetched successfully',
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

const createModule = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const serviceInstance = Container.get(ModuleService);
        await serviceInstance.create_module(req.body as CreateModuleDto);

        return sendResponse(res, {
            success: true,
            message: 'created module successfully',
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

router.get('/', fetchModules);
router.get('/:id', fetchModuleDetail);
router.get('/:courseId/course', fetchModuleByCourse);
router.get('/user/detail', fetchUserRegisteredModules);
router.post('/register', registerToModule);
router.post('/create', isUserAdmin, createModule);

export default router;
