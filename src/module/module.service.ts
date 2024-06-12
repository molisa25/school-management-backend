import {Service} from 'typedi';
import ModuleRepository from './module.repository';
import {paginateData} from '../utils/paginate.util';
import {IModule, IUserModule} from './module.interface';
import {CreateModuleDto, RegisterModuleDto} from './module.dto';
import {IUser} from '../user/user.interface';
import EnrolRepository from '../enrol/enrol.repository';
import {APIError} from '../middleware/error/appError';
import {STATUS_CODES} from '../middleware/error/baseError';

@Service()
export default class ModuleService {
    constructor(
        private moduleRepo: ModuleRepository,
        private enrolmentRepo: EnrolRepository,
    ) {
    }

    async create_module(payload: CreateModuleDto): Promise<void> {
        await this.moduleRepo.create_module(payload);
    }

    async fetch_modules(
        user: IUser,
        page: number,
        pageSize: number,
    ): Promise<{
        pagination: any;
        data: IModule[];
    }> {
        const {count, modules} = await this.moduleRepo.fetch_module(
            page,
            pageSize,
            user.id
        );

        return paginateData(page, pageSize, count, modules);
    }

    async fetch_module_by_id(moduleId: string): Promise<IModule | null> {
        return await this.moduleRepo.fetch_module_by_id(moduleId);
    }

    async fetch_module_by_course(courseId: string): Promise<IModule[]> {
        return await this.moduleRepo.fetch_module_by_course_id(courseId);
    }

    async register_module(
        user: IUser,
        payload: RegisterModuleDto,
    ): Promise<void> {
        // check if the user is enrolled to a course
        const enrolments = await this.enrolmentRepo.fetch_enrolment_by_user_id(
            user.id,
        );

        if (enrolments.length === 0) {
            throw new APIError(
                'You must be enrolled in a course before registering your modules.',
                'REGISTER_MODULE',
                STATUS_CODES.BAD_REQUEST,
            );
        }

        // validate the module id
        const module = await this.moduleRepo.fetch_module_by_code(
            payload.moduleCode,
        );

        if (!module) {
            throw new APIError(
                'Module not found',
                'REGISTER_MODULE',
                STATUS_CODES.BAD_REQUEST,
            );
        }

        // check if the module belongs to the course the student enrolled for
        if (enrolments.filter((enrolment) => enrolment.course === module.course).length === 0) {
            throw new APIError(
                'You can only register to a module under the course you enrolled for.',
                'REGISTER_MODULE',
                STATUS_CODES.BAD_REQUEST,
            );
        }

        // check if module as been added by user already
        const myModules = await this.moduleRepo.fetch_user_module_by_code(user.id, payload.moduleCode);
        if (myModules) {
            throw new APIError(
                'You have already registered for this module',
                'REGISTER_MODULE',
                STATUS_CODES.BAD_REQUEST,
            );
        }

        // register for the module
        await this.moduleRepo.create_user_module(user.id, payload);
    }

    async fetch_user_module(user: IUser): Promise<IUserModule[]> {
        return await this.moduleRepo.fetch_user_modules(user.id);
    }
}
