import { Service } from 'typedi';
import DepartmentRepository from './department.repository';
import { paginateData } from '../utils/paginate.util';
import { IDepartment } from './department.interface';
import { CreateDepartmentDto } from './department.dto';

@Service()
export default class DepartmentService {
  constructor(private departmentRepo: DepartmentRepository) {}

  async create_department(payload: CreateDepartmentDto): Promise<void> {
    await this.departmentRepo.create_department(payload);
  }

  async fetch_departments(
    page: number,
    pageSize: number,
  ): Promise<{
    pagination: any;
    data: IDepartment[];
  }> {
    const { count, departments } = await this.departmentRepo.fetch_departments(
      page,
      pageSize,
    );

    return paginateData(page, pageSize, count, departments);
  }

  async fetch_department_by_id(departmentId: string): Promise<IDepartment | null> {
    return await this.departmentRepo.fetch_department_by_id(departmentId);
  }
}
