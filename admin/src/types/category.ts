export enum CategoryType {
  INFORMATION_TECHNOLOGY = "INFORMATION_TECHNOLOGY",
  MARKETING = "MARKETING",
  FINANCE = "FINANCE",
  BUSSINESS = "BUSSINESS",
}

export interface Category {
  categoryId: string;
  name: string | null;
  description: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
