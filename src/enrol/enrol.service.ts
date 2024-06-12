import { Service } from 'typedi';
import EnrolRepository from './enrol.repository';
import { paginateData } from '../utils/paginate.util';
import { IEnrolment } from './enrol.interface';
import { CreateEnrolmentDto } from './enrol.dto';
import { IUser } from '../user/user.interface';
import {APIError} from "../middleware/error/appError";
import {STATUS_CODES} from "../middleware/error/baseError";
import {ICourse} from "../course/course.interface";

@Service()
export default class EnrolService {
  constructor(private enrolmentRepo: EnrolRepository) {}

  async enrol_to_course(
    user: IUser,
    payload: CreateEnrolmentDto,
  ): Promise<void> {
    // check if the user has enrolled the same course before
    const userEnrolment = await this.enrolmentRepo.fetch_enrolment_by_user_id_course_id(user.id, payload.courseId);
    if (userEnrolment) {
      throw new APIError(
          'You cannot enrol to the same course more than once',
          'ENROL_TO_COURSE',
          STATUS_CODES.BAD_REQUEST,
      );
    }

    await this.enrolmentRepo.create_enrolment(user.id, payload);
  }

  async fetch_enrolments(
    page: number,
    pageSize: number,
  ): Promise<{
    pagination: any;
    data: IEnrolment[];
  }> {
    const { count, enrolments } = await this.enrolmentRepo.fetch_enrolments(
      page,
      pageSize,
    );

    return paginateData(page, pageSize, count, enrolments);
  }

  async fetch_enrolment_by_id(enrolmentId: string): Promise<IEnrolment | null> {
    return await this.enrolmentRepo.fetch_enrolment_by_id(enrolmentId);
  }

  async fetch_enrolment_by_user_id(user: IUser): Promise<ICourse[]> {
    return await this.enrolmentRepo.fetch_enrolled_course_by_user_id(user.id);
  }
}
