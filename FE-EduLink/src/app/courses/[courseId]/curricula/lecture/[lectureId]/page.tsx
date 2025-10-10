'use client';
import { useParams, useRouter } from 'next/navigation';
import LectureHeader from '@/components/modules/lessons/LectureHeader';
import LectureContent from '@/components/modules/lessons/LectureContent';
import { useEffect, useState } from 'react';
import { Course } from '@/types/courses';
import CourseService from '@/apis/courseService';
import { ProgressService } from '@/apis/progressService';
import { decodeJWT } from '@/utils/jwt';
import { checkCourseAccess } from '@/apis/courseAccessService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lecture } from '@/types/lecture';

export default function LecturePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressCreated, setProgressCreated] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [accessLoading, setAccessLoading] = useState(true);

  const params = useParams();
  const router = useRouter();

  const courseId = Array.isArray(params?.courseId) ? params?.courseId[0] : params?.courseId || '';
  const lectureId = Array.isArray(params?.lectureId)
    ? params?.lectureId[0]
    : params?.lectureId || '';
  useEffect(() => {
    if (!course || !lectureId) {
      return;
    }

    const foundLecture =
      course.modules?.flatMap(
        (module) =>
          module.curricula?.flatMap(
            (curriculum) =>
              curriculum.lectures?.filter((lecture) => lecture.lectureId === lectureId) || []
          ) || []
      )?.[0] || null;

    setCurrentLecture(foundLecture);
  }, [course, lectureId]);

  // Tải thông tin khóa học
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) {
          return;
        }

        const response = await CourseService.getCourseInDetail(courseId);
        if (response) {
          setCourse(response);
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Kiểm tra quyền truy cập vào bài giảng
  useEffect(() => {
    const checkAccess = async () => {
      setAccessLoading(true);
      try {
        if (!courseId) {
          return;
        }

        const accessResponse = await checkCourseAccess(courseId);

        if (accessResponse && accessResponse.data) {
          const { hasAccess: canAccess, isEnrolled, isInstructor } = accessResponse.data;
          // Kiểm tra xem bài giảng có miễn phí không
          const isFree = currentLecture?.isFree === true;

          // Trong trường hợp là instructor hoặc đã đăng ký
          if (isInstructor || isEnrolled) {
            setHasAccess(true);
          }
          // Hoặc bài giảng miễn phí
          else if (isFree) {
            setHasAccess(true);
          }
          // Hoặc có quyền khác
          else if (canAccess) {
            setHasAccess(true);
          } else {
            setHasAccess(false);
          }
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('[LECTURE PAGE] Error checking access:', error);
        setHasAccess(false);
      } finally {
        setAccessLoading(false);
      }
    };

    // Chỉ kiểm tra khi đã có thông tin bài giảng
    if (course && currentLecture) {
      checkAccess();
    }
  }, [course, courseId, currentLecture]);

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    const createProgress = async () => {
      try {
        if (progressCreated || !currentLecture || !currentLecture.curriculumId) {
          return;
        }

        // Kiểm tra thời gian xem
        if (!startTime) return;
        const currentTime = new Date();
        const timeDiff = currentTime.getTime() - startTime.getTime();
        const minutesDiff = Math.floor(timeDiff / 1000 / 60);

        if (minutesDiff < 3) {
          return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No token found');
        }
        const decodedToken = decodeJWT(token);
        if (!decodedToken || !decodedToken.sub) {
          throw new Error('Invalid token');
        }
        const userId = decodedToken.sub;

        const curriculumProgress = await ProgressService.createCurriculumProgress({
          curriculumId: currentLecture.curriculumId,
          status: 'COMPLETED',
          userId: userId,
        });
        setProgressCreated(true);
      } catch (error) {
        console.error('Error creating progress:', error);
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: any; status: number } };
          console.error('Error response data:', axiosError.response.data);
          console.error('Error response status:', axiosError.response.status);
        }
        setError(error instanceof Error ? error.message : 'Failed to create progress');
      }
    };

    // Kiểm tra mỗi phút
    const interval = setInterval(createProgress, 60000);
    createProgress(); // Kiểm tra ngay lần đầu

    return () => clearInterval(interval);
  }, [currentLecture, progressCreated, startTime]);

  if (loading || accessLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-700">Đang tải nội dung bài giảng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Alert className="max-w-xl border-red-300 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (hasAccess === false) {
    // Chuyển hướng đến trang khóa học với thông báo
    router.push(`/courses/${courseId}?accessDenied=true`);
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Alert className="max-w-xl border-red-300 bg-red-50">
          <AlertDescription className="text-red-700">
            Bạn không có quyền truy cập vào bài giảng này. Vui lòng đăng ký khóa học để tiếp tục.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Nếu không tìm thấy bài giảng
  if (!currentLecture) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Alert className="max-w-xl border-red-300 bg-red-50">
          <AlertDescription className="text-red-700">
            Không tìm thấy bài giảng. Vui lòng kiểm tra lại đường dẫn hoặc liên hệ admin.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LectureHeader
        courseTitle={course?.title || ''}
        lectureTitle={currentLecture?.title || ''}
        progress={0}
      />

      <div className="px-[95px]">
        <LectureContent lecture={currentLecture || undefined} course={course ?? undefined} />
      </div>
    </div>
  );
}
