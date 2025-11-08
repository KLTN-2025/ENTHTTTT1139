"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginRequest, LoginResponse } from "@/types/auth";
import axios from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [responseData, setResponseData] = useState<LoginResponse | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    setResponseData(null);

    try {
      console.log("Request data:", formData);
      const response = await axios.post<LoginResponse>("/auth/login", formData);
      console.log("Response data:", response.data);

      const { data } = response.data;
      setResponseData(response.data);

      // Lưu token và thông tin user vào localStorage
      localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Đăng nhập thành công",
        description: "Bạn có thể chuyển đến trang dashboard",
      });
    } catch (error: any) {
      console.error("Login error:", error.response?.data);
      setResponseData(error.response?.data);

      toast({
        title: "Đăng nhập thất bại",
        description: error.response?.data?.message || "Có lỗi xảy ra",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>Đăng nhập vào hệ thống quản trị</CardDescription>
        </CardHeader>
        <div>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            {/* {responseData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Response Data:</h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(responseData, null, 2)}
                </pre>
              </div>
            )} */}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="button"
              className="w-full"
              disabled={loading}
              onClick={handleLogin}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            {responseData?.data?.accessToken && (
              <Button
                type="button"
                className="w-full"
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Chuyển đến Dashboard
              </Button>
            )}
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
