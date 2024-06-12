import { Service } from 'typedi';
import { Staff, ModuleStaff } from '@prisma/client';
import { prismaClient } from '../config/database';
import { CreateModuleStaffDto, CreateStaffDto } from './staff.dto';
import { IStaff } from './staff.interface';

@Service()
export default class StaffRepository {
  constructor() {}

  async create_staff(payload: CreateStaffDto): Promise<Staff> {
    return await prismaClient.staff.create({
      data: {
        ...payload,
      },
    });
  }

  async create_module_staff(
    payload: CreateModuleStaffDto,
  ): Promise<ModuleStaff> {
    return await prismaClient.moduleStaff.create({
      data: {
        ...payload,
      },
    });
  }

  async fetch_staffs(
    page: number,
    pageSize: number,
  ): Promise<{ count: number; staffs: IStaff[] }> {
    const skip = (page - 1) * pageSize;

    const staffs = await prismaClient.staff.findMany({
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
      skip,
      take: pageSize,
    });

    const totalCount = (await prismaClient.staff.count()) || 0;

    const allStaffs = staffs.map((staff) => ({
      id: staff.id,
      first_name: staff.firstName,
      last_name: staff.lastName,
      title: staff.title,
      department: staff.department.name,
    }));

    return {
      count: totalCount,
      staffs: allStaffs,
    };
  }

  async fetch_staff_by_id(staffId: string): Promise<IStaff | null> {
    const staff = await prismaClient.staff.findUnique({
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
      where: {
        id: staffId,
      },
    });

    if (!staff) {
      return null;
    }

    return {
      id: staff.id,
      first_name: staff.firstName,
      last_name: staff.lastName,
      title: staff.title,
      department: staff.department.name,
    };
  }
}
