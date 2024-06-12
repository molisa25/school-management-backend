export interface CreateModuleDto {
  code: string;
  title: string;
  description: string;
  content: string;
  courseId: string;
  unit: number;
}

export interface RegisterModuleDto {
  moduleCode: string;
}
