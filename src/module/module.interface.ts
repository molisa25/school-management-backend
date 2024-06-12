import { IStaff } from '../staff/staff.interface';

export interface IModule {
  id: string;
  code: string;
  title: string;
  description: string;
  content: string;
  course: string;
  unit: number;
  staffs: IStaff[];
  has_registered?: boolean;
}

export interface IUserModule {
  id: string;
  first_name: string;
  last_name: string;
  code: string;
  course: string;
  title: string;
  description: string;
  content: string;
  unit: number;
}
