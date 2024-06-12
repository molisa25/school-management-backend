export interface CreateStaffDto {
  firstName: string;
  lastName: string;
  title: string;
  departmentId: string;
}

export interface CreateModuleStaffDto {
  moduleId: string;
  staffId: string;
}
