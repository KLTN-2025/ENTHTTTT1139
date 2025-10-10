import axiosInstance from '@/lib/api/axios';
import { Course } from '@/types/courses';

interface ApiResponse<T> {
  data: {
    success: boolean;
    data: T;
    message: string;
  };
  statusCode: number;
}

interface UpdateCourseBasicInfoRequest {
  title: string;
  description?: string;
}

/**
 * Service để tương tác với API khóa học
 */
export const CourseService = {
  async getCourseInDetail(courseId: string): Promise<Course | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Course>>(`/courses/detail/${courseId}`);

      if (response.data && response.data.statusCode === 200) {
        return response.data.data.data;
      }

      throw new Error(`Lỗi khi lấy khóa học ID ${courseId}`);
    } catch (error) {
      console.error(`Lỗi khi lấy khóa học ID ${courseId}:`, error);
      return null;
    }
  },

  async updateCourseBasicInfo(
    courseId: string,
    data: UpdateCourseBasicInfoRequest
  ): Promise<Course | null> {
    try {
      const response = await axiosInstance.post<ApiResponse<Course>>(
        `/courses/${courseId}/basic-info`,
        data
      );

      if (response.data && response.data.statusCode === 201) {
        return response.data.data.data;
      }

      throw new Error(
        response.data?.data?.message || `Lỗi khi cập nhật thông tin khóa học ID ${courseId}`
      );
    } catch (error) {
      console.error(`Lỗi khi cập nhật thông tin khóa học ID ${courseId}:`, error);
      return null;
    }
  },

  async uploadThumbnail(
    courseId: string,
    file: File
  ): Promise<{ thumbnailUrl: string; publicId: string } | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post<
        ApiResponse<{
          thumbnailUrl: string;
          publicId: string;
          width: number;
          height: number;
        }>
      >(`/upload-image/course/${courseId}/thumbnail`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.statusCode === 201) {
        return {
          thumbnailUrl: response.data.data.data.thumbnailUrl,
          publicId: response.data.data.data.publicId,
        };
      }

      throw new Error(
        response.data?.data?.message || `Lỗi khi upload ảnh thumbnail cho khóa học ID ${courseId}`
      );
    } catch (error) {
      console.error(`Lỗi khi upload ảnh thumbnail cho khóa học ID ${courseId}:`, error);
      return null;
    }
  },

  async uploadCourseImage(
    courseId: string,
    file: File,
    imageType: string = 'content'
  ): Promise<{ imageUrl: string; publicId: string } | null> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('imageType', imageType);

      const response = await axiosInstance.post<
        ApiResponse<{
          imageUrl: string;
          publicId: string;
          width: number;
          height: number;
        }>
      >(`/upload-image/course/${courseId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.statusCode === 201) {
        return {
          imageUrl: response.data.data.data.imageUrl,
          publicId: response.data.data.data.publicId,
        };
      }

      throw new Error(
        response.data?.data?.message || `Lỗi khi upload ảnh nội dung cho khóa học ID ${courseId}`
      );
    } catch (error) {
      console.error(`Lỗi khi upload ảnh nội dung cho khóa học ID ${courseId}:`, error);
      return null;
    }
  },

  async deleteCourseImage(courseId: string, publicId: string): Promise<boolean> {
    try {
      let actualPublicId = publicId;

      if (publicId.includes('/thumbnail/')) {
        const publicIdParts = publicId.split('/thumbnail/');
        if (publicIdParts.length > 1) {
          actualPublicId = publicIdParts[1];
        }
      } else if (publicId.includes('/')) {
        const publicIdParts = publicId.split('/');
        actualPublicId = publicIdParts[publicIdParts.length - 1];
      }

      const endpoint = `/upload-image/course/${courseId}/thumbnail/${actualPublicId}`;

      const response = await axiosInstance.delete<
        ApiResponse<{
          success: boolean;
          message: string;
        }>
      >(endpoint);

      if (response.data && response.data.statusCode === 200) {
        return true;
      }

      throw new Error(response.data?.data?.message || `Lỗi khi xóa ảnh khóa học ID ${courseId}`);
    } catch (error) {
      console.error(`Lỗi khi xóa ảnh khóa học ID ${courseId}:`, error);
      return false;
    }
  },
};

export default CourseService;
