import {Service} from 'typedi';
import {Enrolment} from '@prisma/client';
import {prismaClient} from '../config/database';
import {CreateEnrolmentDto} from './enrol.dto';
import {IEnrolment} from './enrol.interface';
import {ICourse} from "../course/course.interface";

@Service()
export default class EnrolRepository {
    constructor() {
    }

    async create_enrolment(userId: string, payload: CreateEnrolmentDto): Promise<Enrolment> {
        return await prismaClient.enrolment.create({
            data: {
                ...payload,
                userId
            },
        });
    }

    async fetch_enrolments(
        page: number,
        pageSize: number,
    ): Promise<{ count: number; enrolments: IEnrolment[] }> {
        const skip = (page - 1) * pageSize;

        const enrolments = await prismaClient.enrolment.findMany({
            select: {
                id: true,
                createdAt: true,
                course: {
                    select: {
                        name: true,
                    },
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            skip,
            take: pageSize,
        });

        const totalCount = (await prismaClient.enrolment.count()) || 0;

        const allEnrolments = enrolments.map((enrolment) => ({
            id: enrolment.id,
            first_name: enrolment.user.firstName,
            last_name: enrolment.user.lastName,
            course: enrolment.course.name,
            date: enrolment.createdAt,
        }));

        return {
            count: totalCount,
            enrolments: allEnrolments,
        };
    }

    async fetch_enrolment_by_id(enrolmentId: string): Promise<IEnrolment | null> {
        const enrolment = await prismaClient.enrolment.findUnique({
            select: {
                id: true,
                createdAt: true,
                course: {
                    select: {
                        name: true,
                    },
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            where: {
                id: enrolmentId,
            },
        });

        if (!enrolment) {
            return null;
        }

        return {
            id: enrolment.id,
            first_name: enrolment.user.firstName,
            last_name: enrolment.user.lastName,
            course: enrolment.course.name,
            date: enrolment.createdAt,
        };
    }

    async fetch_enrolment_by_user_id(userId: string): Promise<IEnrolment[]> {
        const enrolments = await prismaClient.enrolment.findMany({
            select: {
                id: true,
                createdAt: true,
                course: {
                    select: {
                        name: true,
                    },
                },
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            where: {
                userId,
            },
        });

        return enrolments.map((enrolment) => ({
            id: enrolment.id,
            first_name: enrolment.user.firstName,
            last_name: enrolment.user.lastName,
            course: enrolment.course.name,
            date: enrolment.createdAt,
        }));
    }

    async fetch_enrolled_course_by_user_id(userId: string): Promise<ICourse[]> {
        const enrolments = await prismaClient.enrolment.findMany({
            select: {
                course: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        maxUnit: true,
                        department: {
                            select: {
                                name: true,
                            },
                        },
                    },
                }
            },
            where: {
                userId,
            },
        });

        return enrolments.map((enrolment) => ({
            id: enrolment.course.id,
            name: enrolment.course.name,
            description: enrolment.course.description,
            department: enrolment.course.department.name as string,
            max_unit: enrolment.course.maxUnit,
        }));
    }

    async fetch_enrolment_by_user_id_course_id(userId: string, courseId: string): Promise<IEnrolment | null> {
        const enrolment = await prismaClient.enrolment.findFirst({
            select: {
                id: true,
                createdAt: true,
                course: {
                    select: {
                        name: true,
                        department: {
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
                    },
                },
            },
            where: {
                userId,
                courseId
            },
        });

        if (!enrolment) {
            return null;
        }

        return {
            id: enrolment.id,
            first_name: enrolment.user.firstName,
            last_name: enrolment.user.lastName,
            course: enrolment.course.name as string,
            department: enrolment.course.department.name as string,
            date: enrolment.createdAt,
        };
    }
}
