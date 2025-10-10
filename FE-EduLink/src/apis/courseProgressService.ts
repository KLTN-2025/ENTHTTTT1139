import axiosInstance from '@/lib/api/axios';

export interface CurriculumProgress {
  status: 'COMPLETED' | 'IN_PROGRESS' | 'NOT_STARTED';
  completedAt: string | null;
  progressId: string | null;
}

export interface LectureDetail {
  lectureId: string;
  title: string;
  description: string;
  videoUrl: string;
  articleContent: string | null;
  duration: number;
  isFree: boolean;
}

export interface QuizDetail {
  quizId: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  isFree: boolean;
}

export interface CurriculumDetail {
  curriculumId: string;
  title: string;
  orderIndex: number;
  type: 'LECTURE' | 'QUIZ';
  description: string;
  progress: CurriculumProgress;
  lecture?: LectureDetail;
  quiz?: QuizDetail;
}

export interface ModuleProgress {
  moduleId: string;
  title: string;
  orderIndex: number;
  description: string;
  totalCurricula: number;
  completedCurricula: number;
  progressPercentage: number;
  curricula: CurriculumDetail[];
}

export interface CourseProgressResponse {
  courseId: string;
  totalCurricula: number;
  completedCurricula: number;
  overallProgressPercentage: number;
  modules: ModuleProgress[];
}

export const CourseProgressService = {
  async getCourseProgress(courseId: string): Promise<CourseProgressResponse> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      // throw new Error('Không tìm thấy token xác thực');
    }

    try {
      const response = await axiosInstance.get(`/curriculum-progress/course/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let progressData: CourseProgressResponse;

      if (response.data && response.data.data) {
        progressData = response.data.data;
      } else if (response.data && response.data.modules) {
        progressData = response.data;
      } else {
        console.error('Cấu trúc dữ liệu API không đúng:', response.data);
        throw new Error('Cấu trúc dữ liệu API không đúng');
      }

      // Kiểm tra và đảm bảo các trường quan trọng đều tồn tại
      if (!progressData.modules || !Array.isArray(progressData.modules)) {
        progressData.modules = [];
      }

      // Đảm bảo các giá trị mặc định
      progressData.totalCurricula = progressData.totalCurricula || 0;
      progressData.completedCurricula = progressData.completedCurricula || 0;
      progressData.overallProgressPercentage = progressData.overallProgressPercentage || 0;

      // Kiểm tra và đảm bảo tính toàn vẹn của mỗi module
      progressData.modules = progressData.modules.map((module) => {
        if (!module.curricula || !Array.isArray(module.curricula)) {
          module.curricula = [];
        }

        module.totalCurricula = module.totalCurricula || 0;
        module.completedCurricula = module.completedCurricula || 0;
        module.progressPercentage = module.progressPercentage || 0;

        return module;
      });

      return progressData;
    } catch (error) {
      return {
        courseId: courseId,
        totalCurricula: 0,
        completedCurricula: 0,
        overallProgressPercentage: 0,
        modules: [],
      };
    }
  },
};

export default CourseProgressService;
