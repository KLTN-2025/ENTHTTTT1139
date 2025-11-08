import axiosInstance from '@/lib/api/axios';

export interface Achievement {
  achievementId: string;
  userId: string;
  achievementType: 'COURSES_COMPLETED';
  milestone: number;
  unlockedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserStreak {
  streakId: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAchievementsResponse {
  achievements: Achievement[];
  streak: UserStreak;
  totalCoursesCompleted: number;
}

export const AchievementService = {
  /**
   * Lấy tất cả achievements và streak của user hiện tại
   */
  async getMyAchievements(): Promise<UserAchievementsResponse> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found!');
    }

    const response = await axiosInstance.get('/achievements/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Một số môi trường bọc response 2 lớp: { data: { success, data: {...} }, statusCode }
    // Nên cần lấy sâu hơn nếu tồn tại
    const data =
      response.data?.data?.data ?? // lớp bọc kép
      response.data?.data ?? // lớp bọc đơn
      response.data; // raw

    // Đảm bảo trả về đúng format
    return {
      achievements: Array.isArray(data?.achievements) ? data.achievements : [],
      streak: data?.streak || {
        streakId: '',
        userId: '',
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      },
      totalCoursesCompleted: data?.totalCoursesCompleted || 0,
    };
  },

  /**
   * Lấy streak của user
   */
  async getMyStreak(): Promise<UserStreak> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No authentication token found!');
    }

    const response = await axiosInstance.get('/achievements/streak', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data?.data?.data ?? response.data?.data ?? response.data;
  },
};
