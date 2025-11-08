"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersIcon, BookOpenIcon, FolderIcon } from "lucide-react";
import { DashboardChart } from "@/components/dashboard-chart";
import axios from "@/lib/axios";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface User {
  userId: string;
  email: string;
  fullName: string;
  avatar: string;
  role: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

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

interface Category {
  categoryId: string;
  name: string;
  description: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersResponse, coursesResponse, categoriesResponse] =
          await Promise.all([
            axios.get("/user", { params: { page: 1, limit: 100 } }),
            axios.get("/courses", { params: { page: 1, limit: 100 } }),
            axios.get("/categories", { params: { page: 1, limit: 100 } }),
          ]);

        setUsers(usersResponse.data.data.users || []);
        setCourses(coursesResponse.data.data.data || []);
        setCategories(categoriesResponse.data.data.data.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Tổng quan về thống kê và hiệu suất của nền tảng.
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số người dùng
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              Người dùng mới nhất: {users[0]?.fullName || "Chưa có"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số khóa học
            </CardTitle>
            <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">
              Khóa học mới nhất: {courses[0]?.title || "Chưa có"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng số danh mục
            </CardTitle>
            <FolderIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Danh mục mới nhất: {categories[0]?.name || "Chưa có"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Người dùng gần đây</CardTitle>
            <CardDescription>Danh sách 5 người dùng mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.slice(0, 5).map((user) => (
                <div
                  key={user.userId}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <UsersIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(user.createdAt), "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
            <CardDescription>Biểu đồ thống kê theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
