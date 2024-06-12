export interface IEnrolment {
  id: string;
  first_name: string;
  last_name: string;
  course: string;
  department?: string | null;
  date: Date;
}
