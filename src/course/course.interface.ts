export interface ICourse {
  id: string;
  name: string;
  description: string;
  department: string;
  max_unit: number;
  has_enrol?: boolean;
}
