import { Service } from 'typedi';
import { Department } from '@prisma/client';
import { prismaClient } from '../config/database';
import { CreateDepartmentDto } from './department.dto';
import { IDepartment } from './department.interface';

@Service()
export default class DepartmentRepository {
  constructor() {}

  async create_department(payload: CreateDepartmentDto): Promise<Department> {
    return await prismaClient.department.create({
      data: {
        ...payload,
      },
    });
  }

  async fetch_departments(
    page: number,
    pageSize: number,
  ): Promise<{ count: number; departments: IDepartment[] }> {
    const skip = (page - 1) * pageSize;

    const departments = await prismaClient.department.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
      skip,
      take: pageSize,
    });

    const totalCount = (await prismaClient.department.count()) || 0;

    const allDepartments = departments.map((department) => ({
      id: department.id,
      name: department.name,
      description: department.description,
    }));

    return {
      count: totalCount,
      departments: allDepartments,
    };
  }

  async fetch_department_by_id(departmentId: string): Promise<IDepartment | null> {
    const department = await prismaClient.department.findUnique({
      select: {
        id: true,
        name: true,
        description: true,
      },
      where: {
        id: departmentId,
      },
    });

    if (!department) {
      return null;
    }

    return {
      id: department.id,
      name: department.name,
      description: department.description,
    };
  }
}
