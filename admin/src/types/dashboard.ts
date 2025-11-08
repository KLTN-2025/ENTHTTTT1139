export interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalCategories: number;
  newUsersToday: number;
  newCoursesToday: number;
  newCategoriesToday: number;
}

export interface RecentUser {
  id: string;
  email: string;
  fullName: string;
  createdAt: string;
  avatar?: string;
}
