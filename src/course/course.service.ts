import {Service} from 'typedi';
import CourseRepository from './course.repository';
import {paginateData} from '../utils/paginate.util';
import {ICourse} from './course.interface';
import {CreateCourseDto} from './course.dto';
import {IUser} from "../user/user.interface";

@Service()
export default class CourseService {
    constructor(private courseRepo: CourseRepository) {
    }

    async create_course(payload: CreateCourseDto): Promise<void> {
        await this.courseRepo.create_course(payload);
    }

    async fetch_courses(
        user: IUser,
        page: number,
        pageSize: number,
    ): Promise<{
        pagination: any;
        data: ICourse[];
    }> {
        const {count, courses} = await this.courseRepo.fetch_courses(
            page,
            pageSize,
            user.id
        );

        return paginateData(page, pageSize, count, courses);
    }

    async fetch_course_by_id(courseId: string): Promise<ICourse | null> {
        return await this.courseRepo.fetch_course_by_id(courseId);
    }
}
