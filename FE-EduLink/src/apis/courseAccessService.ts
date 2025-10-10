import axiosInstance from '@/lib/api/axios';

export interface CourseAccessResponse {
  hasAccess: boolean;
  isEnrolled: boolean;
  isInstructor: boolean;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Kiểm tra môi trường thực thi
const isClient = typeof window !== 'undefined';

export const checkCourseAccess = async (
  courseId: string
): Promise<ApiResponse<CourseAccessResponse>> => {
  try {
    // Kiểm tra xem code có đang chạy ở phía client hay không
    if (!isClient) {
      return {
        success: false,
        data: {
          hasAccess: false,
          isEnrolled: false,
          isInstructor: false,
          message: 'API chỉ có thể gọi từ phía client',
        },
      };
    }

    // Debug: Kiểm tra token trước khi gọi API
    const accessToken = localStorage.getItem('accessToken');
    const token = localStorage.getItem('token');

    if (!accessToken && !token) {
      return {
        success: false,
        data: {
          hasAccess: false,
          isEnrolled: false,
          isInstructor: false,
          message: 'Bạn cần đăng nhập để kiểm tra quyền truy cập khóa học',
        },
      };
    }

    // URL API đúng theo format từ backend
    const endpoint = `/course-access/${courseId}`;

    try {
      const response = await axiosInstance.get(endpoint);

      if (response && response.data) {
        if (response.data.data) {
          return response.data.data;
        } else if (response.data.success !== undefined) {
          // Cấu trúc API không có nested data
          return response.data;
        }
      }

      // Nếu không đúng cấu trúc, trả về lỗi
      console.error('[courseAccessService] Cấu trúc dữ liệu API không đúng:', response.data);
      return {
        success: false,
        data: {
          hasAccess: false,
          isEnrolled: false,
          isInstructor: false,
          message: 'Cấu trúc dữ liệu API không đúng',
        },
      };
    } catch (error: any) {
      // Đây là lỗi khi gọi API - check xem có phải lỗi token không
      if (error.response?.status === 401) {
        console.error('[courseAccessService] Lỗi xác thực token:', error.response?.data);

        // Có thể đăng nhập lại hoặc refresh token ở đây
        return {
          success: false,
          data: {
            hasAccess: false,
            isEnrolled: false,
            isInstructor: false,
            message: 'Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.',
          },
        };
      }

      console.error('[courseAccessService] Lỗi khi gọi API:', error);
      throw error; // Ném lỗi để xử lý ở try-catch bên ngoài
    }
  } catch (error: any) {
    console.error(
      '[courseAccessService] Lỗi tổng thể khi kiểm tra quyền truy cập khóa học:',
      error
    );

    // Nếu có response từ server
    if (error.response && error.response.data) {
      console.error('[courseAccessService] Lỗi API:', error.response.data);

      return {
        success: false,
        message: error.response.data.message || 'Lỗi từ server',
        data: {
          hasAccess: false,
          isEnrolled: false,
          isInstructor: false,
          message: error.response.data.message || 'Đã xảy ra lỗi khi kiểm tra quyền truy cập',
        },
      };
    }

    // Lỗi chung không liên quan đến API response
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi kiểm tra quyền truy cập',
      data: {
        hasAccess: false,
        isEnrolled: false,
        isInstructor: false,
        message: 'Đã xảy ra lỗi khi kiểm tra quyền truy cập',
      },
    };
  }
};

/**
 * Kiểm tra một chuỗi không rỗng và không phải undefined
 * @param value Chuỗi cần kiểm tra
 * @returns Chuỗi đã kiểm tra hoặc chuỗi trống
 */
export const ensureString = (value: string | undefined): string => {
  return value || '';
};
