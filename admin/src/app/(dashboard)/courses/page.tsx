"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CourseSortBy, SortOrder } from "@/types/course";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { PlusIcon, EyeIcon } from "lucide-react";
import { BookOpenIcon } from "lucide-react";

interface Course {
  courseId: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  user: {
    userId: string;
    fullName: string;
    avatar: string;
  };
  category: {
    categoryId: string;
    name: string;
  };
}

interface ApiResponse {
  data: {
    data: Course[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<CourseSortBy>(CourseSortBy.CREATED_AT);
  const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.DESC);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const router = useRouter();

  const fetchCourses = async () => {
    try {
      const response = await api.get<ApiResponse>("/courses", {
        params: {
          page,
          limit: 10,
          search,
          sortBy,
          sortOrder,
        },
      });
      console.log("API Response:", response.data);
      setCourses(response.data.data.data || []);
      setTotalPages(response.data.data.meta.totalPages);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách khóa học",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [page, search, sortBy, sortOrder]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortByChange = (value: CourseSortBy) => {
    setSortBy(value);
    setPage(1);
  };

  const handleSortOrderChange = (value: SortOrder) => {
    setSortOrder(value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Quản lý khóa học
            </h1>
            <p className="text-muted-foreground">
              Tạo và quản lý các khóa học trên nền tảng
            </p>
          </div>
          <Button
            onClick={() => router.push("/courses/create")}
            className="gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Thêm khóa học
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Tìm kiếm khóa học..."
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={handleSortByChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CourseSortBy.CREATED_AT}>
                        Ngày tạo
                      </SelectItem>
                      <SelectItem value={CourseSortBy.TITLE}>
                        Tên khóa học
                      </SelectItem>
                      {/* <SelectItem value={CourseSortBy.PRICE}>Giá</SelectItem> */}
                    </SelectContent>
                  </Select>
                  <Select
                    value={sortOrder}
                    onValueChange={handleSortOrderChange}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Thứ tự" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SortOrder.ASC}>Tăng dần</SelectItem>
                      <SelectItem value={SortOrder.DESC}>Giảm dần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : courses && courses.length > 0 ? (
            <div className="grid gap-4">
              {courses.map((course) => (
                <Card key={course.courseId} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-48 h-48">
                      <img
                        src={course.thumbnail || "/placeholder.png"}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {course.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() =>
                            router.push(`/courses/${course.courseId}`)
                          }
                          className="gap-2"
                        >
                          <EyeIcon className="h-4 w-4" />
                          Chi tiết
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Giảng viên
                          </p>
                          <p className="font-medium">
                            {course.user?.fullName || "Chưa có"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Danh mục
                          </p>
                          <p className="font-medium">
                            {course.category?.name || "Chưa có"}
                          </p>
                        </div>
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
                            Ngày tạo
                          </p>
                          <p className="font-medium">
                            {course.createdAt
                              ? format(
                                  new Date(course.createdAt),
                                  "dd/MM/yyyy",
                                  {
                                    locale: vi,
                                  }
                                )
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center gap-2">
                  <BookOpenIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Không tìm thấy khóa học nào
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    className={
                      page === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNumber)}
                        isActive={page === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
