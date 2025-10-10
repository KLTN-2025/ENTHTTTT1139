import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '@/interfaces/auth-context';
import api from '@/apis/api';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setIsLoading(true);

      // Kiểm tra cả hai loại token
      const accessToken = localStorage.getItem('accessToken');
      const token = localStorage.getItem('token');

      // Nếu không có token nào, người dùng chưa đăng nhập
      if (!accessToken && !token) {
        setIsLoggedIn(false);
        setUser(null);
        return;
      }

      // Ưu tiên sử dụng accessToken
      const activeToken = accessToken || token;

      // Đảm bảo token được lưu ở cả localStorage và cookies
      if (activeToken) {
        // Cập nhật localStorage
        if (!accessToken && token) {
          localStorage.setItem('accessToken', token);
        }
        if (accessToken && !token) {
          localStorage.setItem('token', accessToken);
        }

        // Cập nhật cookies
        Cookies.set('accessToken', activeToken, { path: '/' });
        Cookies.set('token', activeToken, { path: '/' });
      }

      try {
        const decoded: any = jwtDecode(activeToken!);
        const userId = decoded.sub;

        // Thêm timeout để tránh race condition
        const response = await api.get(`/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${activeToken}`,
          },
          timeout: 5000, // Thêm timeout 5 giây
        });

        setUser(response.data.data);
        setIsLoggedIn(true);
      } catch (decodeError) {
        console.error('[AuthContext] Error decoding token:', decodeError);
        // Token không hợp lệ, xóa và đăng xuất
        logout();
      }
    } catch (err: any) {
      console.error('[AuthContext] Error fetching user data:', err);

      if (err.response && err.response.status === 401) {
        logout();
      }

      setError(err.message || 'Có lỗi xảy ra khi lấy thông tin người dùng');
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('token');

    // Xóa cookies
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('token', { path: '/' });

    setIsLoggedIn(false);
    setUser(null);
  };

  useEffect(() => {
    fetchUser();

    // Kiểm tra token mỗi khi có thay đổi ở localStorage
    const handleStorageChange = () => {
      fetchUser();
    };

    // Lắng nghe sự kiện đăng nhập thành công
    const handleLoginSuccess = () => {
      fetchUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('user-login-success', handleLoginSuccess);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-login-success', handleLoginSuccess);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn,
        error,
        logout,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
