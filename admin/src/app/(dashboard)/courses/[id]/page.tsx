"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import VideoPlayer from "@/components/components/VideoPlayer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  PencilIcon,
  TrashIcon,
  PlayIcon,
  HelpCircleIcon,
  BookOpenIcon,
  StarIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CourseDetail {
  courseId: string;
  title: string;
  description: string;
  overview: string;
  thumbnail: string;
  price: number;
  durationTime: number;
  approved: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  instructorId: string;
  instructor: {
    instructorId: string;
    userId: string;
    bio: string;
    profilePicture: string;
    experience: string;
    averageRating: number;
    isVerified: boolean;
    user: {
      userId: string;
      fullName: string;
      avatar: string;
    };
  };
  learningObjectives: {
    objectiveId: string;
    description: string;
  }[];
  requirements: {
    requirementId: string;
    description: string;
  }[];
  targetAudience: {
    audienceId: string;
    description: string;
  }[];
  modules: {
    moduleId: string;
    title: string;
    description: string;
    curricula: {
      curriculumId: string;
      title: string;
      type: string;
      description: string;
      lectures: {
        lectureId: string;
        title: string;
        description: string;
        videoUrl: string;
        duration: number;
        isFree: boolean;
      }[];
      quizzes: {
        quizId: string;
        title: string;
        description: string;
        passingScore: number;
        timeLimit: number;
        isFree: boolean;
        questions: {
          questionId: string;
          questionText: string;
          questionType: string;
          points: number;
          answers: {
            answerId: string;
            answerText: string;
            isCorrect: boolean;
          }[];
        }[];
      }[];
    }[];
  }[];
  reviews: {
    reviewId: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      userId: string;
      fullName: string;
      avatar: string;
    };
  }[];
  bestVoucher: {
    voucherId: string;
    code: string;
    discount: number;
    startDate: string;
    endDate: string;
  } | null;
  discountedPrice: number | null;
  enrollments: {
    userId: string;
    courseEnrollmentId: string;
    enrolledAt: string;
    courseId: string;
    user: {
      userId: string;
      fullName: string;
      avatar: string;
    };
  }[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    data: CourseDetail;
  };
  statusCode: number;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    approved: "PENDING" as "PENDING" | "APPROVED" | "REJECTED",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCourseDetail();
  }, [params.id]);

  const fetchCourseDetail = async () => {
    try {
      const response = await api.get<ApiResponse>(
        `/courses/detail/${params.id}`
      );
      setCourse(response.data.data.data);
      setFormData({
        approved: response.data.data.data.approved as
          | "PENDING"
          | "APPROVED"
          | "REJECTED",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin khóa học",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      console.log(formData);
      const response = await api.put(`/courses/${params.id}/status`, formData);
      console.log(response);
      toast({
        title: "Thành công",
        description: "Đã cập nhật trạng thái khóa học",
      });
      setUpdateDialogOpen(false);
      fetchCourseDetail();
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description:
          error.response?.data?.message || "Không thể cập nhật trạng thái",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/courses/${params.id}`);
      toast({
        title: "Thành công",
        description: "Đã xóa khóa học",
      });
      router.push("/courses");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.response?.data?.message || "Không thể xóa khóa học",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!course) {
    return <div>Không tìm thấy thông tin khóa học</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Chi tiết khóa học
            </h1>
            <p className="text-muted-foreground mt-1">
              Xem và quản lý thông tin chi tiết khóa học
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <PencilIcon className="h-4 w-4" />
                  Cập nhật trạng thái
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cập nhật trạng thái khóa học</DialogTitle>
                  <DialogDescription>
                    Thay đổi trạng thái phê duyệt của khóa học
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      value={formData.approved}
                      onValueChange={(
                        value: "PENDING" | "APPROVED" | "REJECTED"
                      ) => setFormData({ ...formData, approved: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Đang chờ</SelectItem>
                        <SelectItem value="APPROVED">Đã phê duyệt</SelectItem>
                        <SelectItem value="REJECTED">Từ chối</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleUpdate}>Cập nhật</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <TrashIcon className="h-4 w-4" />
                  Xóa khóa học
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này không thể hoàn tác. Khóa học sẽ bị xóa vĩnh
                    viễn.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Xóa
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : course ? (
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="relative aspect-video">
                    <img
                      src={course.thumbnail || "/placeholder.png"}
                      alt={course.title}
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <h3 className="text-xl font-semibold">{course.title}</h3>
                    <p className="text-muted-foreground">
                      {course.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Giá</p>
                      <p className="font-medium">
                        {course.price
                          ? course.price.toLocaleString("vi-VN") + "đ"
                          : "Miễn phí"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Thời lượng
                      </p>
                      <p className="font-medium">{course.durationTime} phút</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Đánh giá</p>
                      <p className="font-medium">
                        {course.rating.toFixed(1)}/5
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Trạng thái
                      </p>
                      <Badge
                        variant={
                          course.approved === "APPROVED"
                            ? "default"
                            : course.approved === "REJECTED"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {course.approved === "APPROVED"
                          ? "Đã phê duyệt"
                          : course.approved === "REJECTED"
                          ? "Từ chối"
                          : "Đang chờ"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin giảng viên</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={course.instructor.user.avatar}
                        alt={course.instructor.user.fullName}
                      />
                      <AvatarFallback>
                        {course.instructor.user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {course.instructor.user.fullName}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {course.instructor.profilePicture || "Giảng viên"}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm text-muted-foreground">Kinh nghiệm</p>
                    <p>{course.instructor.experience}</p>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm text-muted-foreground">Tiểu sử</p>
                    <p>{course.instructor.bio}</p>
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm text-muted-foreground">
                      Đánh giá trung bình
                    </p>
                    <p className="font-medium">
                      {course.instructor.averageRating.toFixed(1)}/5
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger value="curriculum">Nội dung</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                <TabsTrigger value="enrollments">Học viên</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="statistics">Thống kê</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tổng quan khóa học</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-6">
                    <div className="grid gap-2">
                      <h3 className="font-semibold">Mục tiêu học tập</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {course.learningObjectives.map((objective) => (
                          <li key={objective.objectiveId}>
                            {objective.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid gap-2">
                      <h3 className="font-semibold">Yêu cầu</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {course.requirements.map((requirement) => (
                          <li key={requirement.requirementId}>
                            {requirement.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid gap-2">
                      <h3 className="font-semibold">Đối tượng</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {course.targetAudience.map((audience) => (
                          <li key={audience.audienceId}>
                            {audience.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Nội dung khóa học</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {course.modules.map((module) => (
                        <div key={module.moduleId} className="space-y-4">
                          <h3 className="text-lg font-semibold">
                            {module.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {module.description}
                          </p>
                          <div className="space-y-4">
                            {module.curricula.map((curriculum) => (
                              <div
                                key={curriculum.curriculumId}
                                className="border rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium">
                                    {curriculum.title}
                                  </h4>
                                  <Badge variant="outline">
                                    {curriculum.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                  {curriculum.description}
                                </p>
                                {curriculum.lectures.length > 0 && (
                                  <div className="space-y-2">
                                    {curriculum.lectures.map((lecture) => (
                                      <div
                                        key={lecture.lectureId}
                                        className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                                      >
                                        <div className="flex items-center gap-2">
                                          <PlayIcon className="h-4 w-4" />
                                          <span>{lecture.title}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <span className="text-sm text-muted-foreground">
                                            {lecture.duration} phút
                                          </span>
                                          {lecture.isFree && (
                                            <Badge variant="secondary">
                                              Miễn phí
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {curriculum.quizzes.length > 0 && (
                                  <div className="space-y-2">
                                    {curriculum.quizzes.map((quiz) => (
                                      <div
                                        key={quiz.quizId}
                                        className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                                      >
                                        <div className="flex items-center gap-2">
                                          <HelpCircleIcon className="h-4 w-4" />
                                          <span>{quiz.title}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <span className="text-sm text-muted-foreground">
                                            {quiz.timeLimit} phút
                                          </span>
                                          {quiz.isFree && (
                                            <Badge variant="secondary">
                                              Miễn phí
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Đánh giá khóa học</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {course.reviews.map((review) => (
                        <div
                          key={review.reviewId}
                          className="flex gap-4 border-b pb-4 last:border-0"
                        >
                          <Avatar>
                            <AvatarImage
                              src={review.user.avatar}
                              alt={review.user.fullName}
                            />
                            <AvatarFallback>
                              {review.user.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">
                                  {review.user.fullName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(review.createdAt), "PPP", {
                                    locale: vi,
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">
                                  {review.rating.toFixed(1)}
                                </span>
                              </div>
                            </div>
                            <p className="text-muted-foreground">
                              {review.comment}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="enrollments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Danh sách học viên</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.enrollments.map((enrollment) => (
                        <div
                          key={enrollment.courseEnrollmentId}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage
                                src={enrollment.user.avatar}
                                alt={enrollment.user.fullName}
                              />
                              <AvatarFallback>
                                {enrollment.user.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {enrollment.user.fullName}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Đăng ký vào{" "}
                                {format(
                                  new Date(enrollment.enrolledAt),
                                  "PPP",
                                  {
                                    locale: vi,
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="video" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Video khóa học</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {course.modules.map((module) => (
                        <div key={module.moduleId} className="space-y-4">
                          <h3 className="text-lg font-semibold">
                            {module.title}
                          </h3>
                          <div className="space-y-4">
                            {module.curricula.map((curriculum) => (
                              <div key={curriculum.curriculumId}>
                                {curriculum.lectures.map((lecture) => (
                                  <div
                                    key={lecture.lectureId}
                                    className="border rounded-lg p-4 mb-4"
                                  >
                                    <h4 className="font-medium mb-2">
                                      {lecture.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-4">
                                      {lecture.description}
                                    </p>
                                    <VideoPlayer
                                      videoUrl={`http://localhost:9090/videos/${course.courseId}/${lecture.lectureId}.mp4`}
                                      lectureId={lecture.lectureId}
                                    />
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="statistics" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Thống kê doanh thu</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Tổng doanh thu
                            </p>
                            <p className="text-2xl font-bold">
                              {course.price * course.enrollments.length}đ
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6 text-primary"
                            >
                              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Số học viên
                            </p>
                            <p className="text-2xl font-bold">
                              {course.enrollments.length}
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6 text-primary"
                            >
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Thống kê đánh giá</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Đánh giá trung bình
                            </p>
                            <p className="text-2xl font-bold">
                              {course.rating.toFixed(1)}/5
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6 text-primary"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Số đánh giá
                            </p>
                            <p className="text-2xl font-bold">
                              {course.reviews.length}
                            </p>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6 text-primary"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Danh sách học viên đã mua</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.enrollments.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            Chưa có học viên nào mua khóa học
                          </p>
                        </div>
                      ) : (
                        course.enrollments.map((enrollment) => (
                          <div
                            key={enrollment.courseEnrollmentId}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <Avatar>
                                <AvatarImage
                                  src={enrollment.user.avatar}
                                  alt={enrollment.user.fullName}
                                />
                                <AvatarFallback>
                                  {enrollment.user.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">
                                  {enrollment.user.fullName}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Đăng ký vào{" "}
                                  {format(
                                    new Date(enrollment.enrolledAt),
                                    "PPP",
                                    {
                                      locale: vi,
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {course.price.toLocaleString("vi-VN")}đ
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {format(
                                  new Date(enrollment.enrolledAt),
                                  "HH:mm",
                                  {
                                    locale: vi,
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center gap-2">
                <BookOpenIcon className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Không tìm thấy thông tin khóa học
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
