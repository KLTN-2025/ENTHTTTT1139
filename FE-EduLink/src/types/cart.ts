import { Course } from './courses';

export interface Cart {
  data: {
    courses: Course[];
    totalItems: number;
  };
  statusCode: number;
}
