"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
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
import { PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { UserIcon } from "lucide-react";
import { EyeIcon } from "lucide-react";
import { StarIcon } from "lucide-react";
import { BookOpenIcon } from "lucide-react";

interface Course {
  courseId: string;
  title: string;
  description: string | null;
  overview: string | null;
  thumbnail: string | null;
  approved: "PENDING" | "APPROVED" | "REJECTED";
  isBestSeller: boolean;
  isRecommended: boolean;
}

interface UserDetail {
  userId: string;
  email: string;
  fullName: string;
  avatar: string;
  role: string;
  title: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  websiteLink: string | null;
  facebookLink: string | null;
  youtubeLink: string | null;
  linkedinLink: string | null;
  isEmailVerified: boolean;
  tbl_instructors: any[];
  tbl_course_enrollments: any[];
  tbl_course_reviews: any[];
  tbl_payment: any[];
  tbl_favorites: any[];
  password?: string;
  resetPasswordToken?: string | null;
  resetPasswordTokenExp?: string | null;
  verificationEmailToken?: string;
  verificationEmailTokenExp?: string;
  instructor?: {
    experience: string;
    bio: string;
    averageRating: number;
    courses: {
      courseId: string;
      title: string;
      description: string;
      thumbnail: string;
      approved: "PENDING" | "APPROVED" | "REJECTED";
    }[];
  };
  enrollments: {
    courseEnrollmentId: string;
    enrolledAt: string;
    course: {
      courseId: string;
      title: string;
      description: string;
      thumbnail: string;
    };
  }[];
  reviews: {
    reviewId: string;
    rating: number;
    comment: string;
    createdAt: string;
    course: {
      courseId: string;
      title: string;
      thumbnail: string;
    };
  }[];
}

interface ApiResponse {
  data: UserDetail;
  statusCode: number;
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "Chưa có";
  try {
    return format(new Date(dateString), "PPP", { locale: vi });
  } catch (error) {
    return "Ngày không hợp lệ";
  }
};

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "",
    title: "",
    description: "",
    websiteLink: "",
    facebookLink: "",
    youtubeLink: "",
    linkedinLink: "",
    isEmailVerified: false,
  });

  useEffect(() => {
    fetchUserDetail();
  }, [params.id, toast]);
  const fetchUserDetail = async () => {
    try {
      const response = await api.get<ApiResponse>(`/user/${params.id}/admin`);
      setUser(response.data.data);
      setFormData({
        email: response.data.data.email,
        password: "",
        fullName: response.data.data.fullName,
        role: response.data.data.role,
        title: response.data.data.title || "",
        description: response.data.data.description || "",
        websiteLink: response.data.data.websiteLink || "",
        facebookLink: response.data.data.facebookLink || "",
        youtubeLink: response.data.data.youtubeLink || "",
        linkedinLink: response.data.data.linkedinLink || "",
        isEmailVerified: response.data.data.isEmailVerified,
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin người dùng",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const dataToSend = {
        ...formData,
        password: formData.password || undefined,
      };

      await api.put(`/user/${params.id}/admin`, dataToSend);
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin người dùng",
      });
      setUpdateDialogOpen(false);
      fetchUserDetail();
    } catch (error: any) {
      console.error("Update error:", error.response?.data);
      toast({
        title: "Lỗi",
        description:
          error.response?.data?.message || "Không thể cập nhật thông tin",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/user/${params.id}/admin`);
      toast({
        title: "Thành công",
        description: "Đã xóa người dùng",
      });
      router.push("/users");
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description:
          error.response?.data?.message || "Không thể xóa người dùng",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!user) {
    return <div>Không tìm thấy thông tin người dùng</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Chi tiết người dùng
            </h1>
            <p className="text-muted-foreground mt-1">
              Xem và quản lý thông tin chi tiết người dùng
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
                  <DialogTitle>Cập nhật trạng thái người dùng</DialogTitle>
                  <DialogDescription>
                    Thay đổi trạng thái xác thực của người dùng
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Trạng thái</Label>
                    <Select
                      value={formData.isEmailVerified ? "true" : "false"}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          isEmailVerified: value === "true",
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Đã xác thực</SelectItem>
                        <SelectItem value="false">Chưa xác thực</SelectItem>
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
                  Xóa người dùng
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bạn có chắc chắn?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Hành động này không thể hoàn tác. Người dùng sẽ bị xóa vĩnh
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
        ) : user ? (
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cá nhân</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback>
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{user.fullName}</h3>
                      <p className="text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Vai trò</p>
                      <Badge variant="outline">
                        {user.tbl_instructors && user.tbl_instructors.length > 0
                          ? "Giảng viên"
                          : "Học viên"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Trạng thái
                      </p>
                      <Badge
                        variant={user.isEmailVerified ? "default" : "secondary"}
                      >
                        {user.isEmailVerified ? "Đã xác thực" : "Chưa xác thực"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Ngày tham gia
                      </p>
                      <p className="font-medium">
                        {format(new Date(user.createdAt), "PPP", {
                          locale: vi,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Cập nhật lần cuối
                      </p>
                      <p className="font-medium">
                        {format(new Date(user.updatedAt), "PPP", {
                          locale: vi,
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thông tin giảng viên</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {user.tbl_instructors && user.tbl_instructors.length > 0 ? (
                    <>
                      <div className="grid gap-2">
                        <p className="text-sm text-muted-foreground">
                          Kinh nghiệm
                        </p>
                        <p>{user.tbl_instructors[0].experience}</p>
                      </div>
                      <div className="grid gap-2">
                        <p className="text-sm text-muted-foreground">Tiểu sử</p>
                        <p>{user.tbl_instructors[0].bio}</p>
                      </div>
                      <div className="grid gap-2">
                        <p className="text-sm text-muted-foreground">
                          Đánh giá trung bình
                        </p>
                        <p className="font-medium">
                          {user.tbl_instructors[0].average_rating?.d?.[0]?.toFixed(
                            1
                          ) || "0"}
                          /5
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <p className="text-sm text-muted-foreground">
                          Trạng thái xác thực
                        </p>
                        <Badge
                          variant={
                            user.tbl_instructors[0].isVerified
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.tbl_instructors[0].isVerified
                            ? "Đã xác thực"
                            : "Chưa xác thực"}
                        </Badge>
                      </div>
                      <div className="grid gap-2">
                        <p className="text-sm text-muted-foreground">
                          Email PayPal
                        </p>
                        <p>{user.tbl_instructors[0].paypalEmail}</p>
                        <Badge
                          variant={
                            user.tbl_instructors[0].isPaypalVerified
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.tbl_instructors[0].isPaypalVerified
                            ? "Đã xác thực PayPal"
                            : "Chưa xác thực PayPal"}
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 py-8">
                      <UserIcon className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Người dùng này không phải là giảng viên
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="courses" className="w-full">
              <TabsList>
                <TabsTrigger value="courses">Khóa học</TabsTrigger>
                <TabsTrigger value="enrollments">Đăng ký</TabsTrigger>
                <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
              </TabsList>

              <TabsContent value="courses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Khóa học đã tạo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.tbl_instructors &&
                      user.tbl_instructors[0]?.tbl_courses &&
                      user.tbl_instructors[0].tbl_courses.length > 0 ? (
                        user.tbl_instructors[0].tbl_courses.map(
                          (course: Course) => (
                            <div
                              key={course.courseId}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-4">
                                <div className="relative h-16 w-28">
                                  <img
                                    src={course.thumbnail || "/placeholder.png"}
                                    alt={course.title}
                                    className="rounded-md object-cover w-full h-full"
                                  />
                                </div>
                                <div>
                                  <h4 className="font-medium">
                                    {course.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {course.description || course.overview}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant={
                                        course.isBestSeller
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {course.isBestSeller
                                        ? "Bán chạy nhất"
                                        : "Thông thường"}
                                    </Badge>
                                    <Badge
                                      variant={
                                        course.isRecommended
                                          ? "default"
                                          : "secondary"
                                      }
                                    >
                                      {course.isRecommended
                                        ? "Đề xuất"
                                        : "Không đề xuất"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
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
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/courses/${course.courseId}`}>
                                    <EyeIcon className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          )
                        )
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 py-8">
                          <BookOpenIcon className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Chưa có khóa học nào được tạo
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="enrollments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Khóa học đã đăng ký</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.tbl_course_enrollments &&
                      user.tbl_course_enrollments.length > 0 ? (
                        user.tbl_course_enrollments.map((enrollment) => (
                          <div
                            key={enrollment.courseEnrollmentId}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative h-16 w-28">
                                <img
                                  src={
                                    enrollment.tbl_courses.thumbnail ||
                                    "/placeholder.png"
                                  }
                                  alt={enrollment.tbl_courses.title}
                                  className="rounded-md object-cover w-full h-full"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium">
                                  {enrollment.tbl_courses.title}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {enrollment.tbl_courses.description ||
                                    enrollment.tbl_courses.overview}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    variant={
                                      enrollment.tbl_courses.isBestSeller
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {enrollment.tbl_courses.isBestSeller
                                      ? "Bán chạy nhất"
                                      : "Thông thường"}
                                  </Badge>
                                  <Badge
                                    variant={
                                      enrollment.tbl_courses.isRecommended
                                        ? "default"
                                        : "secondary"
                                    }
                                  >
                                    {enrollment.tbl_courses.isRecommended
                                      ? "Đề xuất"
                                      : "Không đề xuất"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
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
                              <Button variant="ghost" size="icon" asChild>
                                <Link
                                  href={`/courses/${enrollment.tbl_courses.courseId}`}
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 py-8">
                          <BookOpenIcon className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Chưa đăng ký khóa học nào
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Đánh giá đã viết</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {user.reviews && user.reviews.length > 0 ? (
                        user.reviews.map((review) => (
                          <div
                            key={review.reviewId}
                            className="flex gap-4 border-b pb-4 last:border-0"
                          >
                            <div className="relative h-16 w-28">
                              <img
                                src={
                                  review.course.thumbnail || "/placeholder.png"
                                }
                                alt={review.course.title}
                                className="rounded-md object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-medium">
                                    {review.course.title}
                                  </h4>
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
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-2 py-8">
                          <StarIcon className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Chưa có đánh giá nào
                          </p>
                        </div>
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
                <UserIcon className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Không tìm thấy thông tin người dùng
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
