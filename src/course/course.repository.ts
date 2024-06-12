import { Service } from 'typedi';
import { Course } from '@prisma/client';
import { prismaClient } from '../config/database';
import { CreateCourseDto } from './course.dto';
import { ICourse } from './course.interface';

@Service()
export default class CourseRepository {
  constructor() {}

  async create_course(payload: CreateCourseDto): Promise<Course> {
    return await prismaClient.course.create({
      data: {
        ...payload,
      },
    });
  }

  async fetch_courses(
    page: number,
    pageSize: number,
    userId: string
  ): Promise<{ count: number; courses: ICourse[] }> {
    const skip = (page - 1) * pageSize;

    const courses = await prismaClient.course.findMany({
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
      skip,
      take: pageSize,
    });

    const totalCount = (await prismaClient.course.count()) || 0;

    const allCourses = await Promise.all(courses.map(async (course) => {
      const userEnrolment = await prismaClient.enrolment.findFirst({
        where: {
          userId,
          courseId: course.id
        }
      });

      return {
        id: course.id,
        name: course.name,
        description: course.description,
        department: course.department.name as string,
        max_unit: course.maxUnit,
        has_enrol: !!userEnrolment
      }
    }));

    return {
      count: totalCount,
      courses: allCourses,
    };
  }

  async fetch_course_by_id(courseId: string): Promise<ICourse | null> {
    const course = await prismaClient.course.findUnique({
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
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return null;
    }

    return {
      id: course.id,
      name: course.name,
      description: course.description,
      department: course.department.name as string,
      max_unit: course.maxUnit,
    };
  }
}
