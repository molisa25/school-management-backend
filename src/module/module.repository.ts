import {Service} from 'typedi';
import {Module, UserModule} from '@prisma/client';
import {prismaClient} from '../config/database';
import {CreateModuleDto, RegisterModuleDto} from './module.dto';
import {IModule, IUserModule} from './module.interface';
import {IStaff} from '../staff/staff.interface';

@Service()
export default class ModuleRepository {
    constructor() {
    }

    async create_module(payload: CreateModuleDto): Promise<Module> {
        return await prismaClient.module.create({
            data: {
                ...payload,
            },
        });
    }

    async fetch_module(
        page: number,
        pageSize: number,
        userId: string
    ): Promise<{ count: number; modules: IModule[] }> {
        const skip = (page - 1) * pageSize;

        const modules = await prismaClient.module.findMany({
            select: {
                id: true,
                code: true,
                title: true,
                description: true,
                content: true,
                unit: true,
                course: {
                    select: {
                        name: true,
                    },
                },
                staffs: {
                    select: {
                        staff: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                title: true,
                                department: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            skip,
            take: pageSize,
        });

        const totalCount = (await prismaClient.module.count()) || 0;

        const allModules = await Promise.all(modules.map(async (module) => {
            let staffs: IStaff[] = [];

            module.staffs.forEach((moduleStaff) => {
                staffs.push({
                    id: moduleStaff.staff.id,
                    first_name: moduleStaff.staff.firstName,
                    last_name: moduleStaff.staff.lastName,
                    title: moduleStaff.staff.title,
                    department: moduleStaff.staff.department.name,
                });
            });

            const userModule = await prismaClient.userModule.findFirst({
                where: {
                    userId,
                    moduleCode:  module.code
                }
            });

            return {
                id: module.id,
                code: module.code,
                title: module.title,
                description: module.description,
                content: module.content,
                course: module.course.name as string,
                unit: module.unit,
                staffs,
                has_registered: !!userModule
            };
        }));

        return {
            count: totalCount,
            modules: allModules,
        };
    }

    async fetch_module_by_course_id(courseId: string): Promise<IModule[]> {
        const modules = await prismaClient.module.findMany({
            select: {
                id: true,
                code: true,
                title: true,
                description: true,
                content: true,
                unit: true,
                course: {
                    select: {
                        name: true,
                    },
                },
                staffs: {
                    select: {
                        staff: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                title: true,
                                department: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                courseId,
            },
        });

        return modules.map((module) => {
            let staffs: IStaff[] = [];

            module.staffs.forEach((moduleStaff) => {
                staffs.push({
                    id: moduleStaff.staff.id,
                    first_name: moduleStaff.staff.firstName,
                    last_name: moduleStaff.staff.lastName,
                    title: moduleStaff.staff.title,
                    department: moduleStaff.staff.department.name,
                });
            });

            return {
                id: module.id,
                code: module.code,
                title: module.title,
                description: module.description,
                content: module.content,
                course: module.course.name as string,
                unit: module.unit,
                staffs,
            };
        });
    }

    async fetch_module_by_id(moduleId: string): Promise<IModule | null> {
        const module = await prismaClient.module.findUnique({
            select: {
                id: true,
                code: true,
                title: true,
                description: true,
                content: true,
                unit: true,
                course: {
                    select: {
                        name: true,
                    },
                },
                staffs: {
                    select: {
                        staff: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                title: true,
                                department: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                id: moduleId,
            },
        });

        if (!module) {
            return null;
        }

        let staffs: IStaff[] = [];

        module.staffs.forEach((moduleStaff) => {
            staffs.push({
                id: moduleStaff.staff.id,
                first_name: moduleStaff.staff.firstName,
                last_name: moduleStaff.staff.lastName,
                title: moduleStaff.staff.title,
                department: moduleStaff.staff.department.name,
            });
        });

        return {
            id: module.id,
            code: module.code,
            title: module.title,
            description: module.description,
            content: module.content,
            course: module.course.name as string,
            unit: module.unit,
            staffs,
        };
    }

    async fetch_module_by_code(code: string): Promise<IModule | null> {
        const module = await prismaClient.module.findUnique({
            select: {
                id: true,
                code: true,
                title: true,
                description: true,
                content: true,
                unit: true,
                course: {
                    select: {
                        name: true,
                    },
                },
                staffs: {
                    select: {
                        staff: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                title: true,
                                department: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            where: {
                code,
            },
        });

        if (!module) {
            return null;
        }

        let staffs: IStaff[] = [];

        module.staffs.forEach((moduleStaff) => {
            staffs.push({
                id: moduleStaff.staff.id,
                first_name: moduleStaff.staff.firstName,
                last_name: moduleStaff.staff.lastName,
                title: moduleStaff.staff.title,
                department: moduleStaff.staff.department.name,
            });
        });

        return {
            id: module.id,
            code: module.code,
            title: module.title,
            description: module.description,
            content: module.content,
            course: module.course.name as string,
            unit: module.unit,
            staffs,
        };
    }

    async create_user_module(
        userId: string,
        payload: RegisterModuleDto,
    ): Promise<UserModule> {
        return await prismaClient.userModule.create({
            data: {
                ...payload,
                userId,
            },
        });
    }

    async fetch_user_modules(userId: string): Promise<IUserModule[]> {
        const userModules = await prismaClient.userModule.findMany({
            select: {
                id: true,
                module: {
                    select: {
                        code: true,
                        title: true,
                        description: true,
                        content: true,
                        unit: true,
                        course: {
                            select: {
                                name: true
                            }
                        }
                    },
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            where: {
                userId,
            },
        });

        return userModules.map((userModule) => {
            return {
                id: userModule.id,
                first_name: userModule.user.firstName,
                last_name: userModule.user.lastName,
                code: userModule.module.code,
                course: userModule.module.course.name,
                title: userModule.module.title,
                description: userModule.module.description,
                content: userModule.module.content,
                unit: userModule.module.unit,
            };
        });
    }

    async fetch_user_module_by_code(userId: string, moduleCode: string): Promise<IUserModule | null> {
        const userModule = await prismaClient.userModule.findFirst({
            select: {
                id: true,
                module: {
                    select: {
                        code: true,
                        title: true,
                        description: true,
                        content: true,
                        unit: true,
                        course: {
                            select: {
                                name: true
                            }
                        }
                    },
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            where: {
                userId,
                moduleCode
            },
        });

        if (!userModule) {
            return null;
        }

        return {
            id: userModule.id,
            first_name: userModule.user.firstName,
            last_name: userModule.user.lastName,
            code: userModule.module.code,
            course: userModule.module.course.name,
            title: userModule.module.title,
            description: userModule.module.description,
            content: userModule.module.content,
            unit: userModule.module.unit,
        }
    }
}
