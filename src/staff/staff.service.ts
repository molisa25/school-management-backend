import { Service } from 'typedi';
import StaffRepository from './staff.repository';
import { paginateData } from '../utils/paginate.util';
import { IStaff } from './staff.interface';
import { CreateStaffDto } from './staff.dto';

@Service()
export default class StaffService {
  constructor(private staffRepo: StaffRepository) {}

  async create_staff(payload: CreateStaffDto): Promise<void> {
    await this.staffRepo.create_staff(payload);
  }

  async fetch_staffs(
    page: number,
    pageSize: number,
  ): Promise<{
    pagination: any;
    data: IStaff[];
  }> {
    const { count, staffs } = await this.staffRepo.fetch_staffs(page, pageSize);

    return paginateData(page, pageSize, count, staffs);
  }

  async fetch_staff_by_id(staffId: string): Promise<IStaff | null> {
    return await this.staffRepo.fetch_staff_by_id(staffId);
  }
}
