import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  // Bỏ qua lỗi SSL nếu dùng self-signed certificate (chỉ dùng cho development)
  httpsAgent:
    process.env.NODE_ENV === 'development'
      ? new (require('https').Agent)({ rejectUnauthorized: false })
      : undefined,
});

// Interceptors
axiosInstance.interceptors.request.use((config) => {
  // Kiểm tra cả accessToken và token từ localStorage
  const accessTokenLS = localStorage.getItem('accessToken');
  const tokenLS = localStorage.getItem('token');

  // Kiểm tra cả accessToken và token từ cookies
  const accessTokenCookie = Cookies.get('accessToken');
  const tokenCookie = Cookies.get('token');

  // Ưu tiên token từ localStorage, nếu không có thì dùng cookie
  const accessToken = accessTokenLS || accessTokenCookie;
  const token = tokenLS || tokenCookie;

  // Đồng bộ hóa token giữa localStorage và cookies
  if (accessToken && !accessTokenLS) {
    localStorage.setItem('accessToken', accessToken);
  }

  if (token && !tokenLS) {
    localStorage.setItem('token', token);
  }

  // Ưu tiên dùng accessToken, nếu không có thì dùng token
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
  }

  return config;
});

// Thêm interceptor để xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Kiểm tra lỗi 401 - Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        Cookies.remove('accessToken', { path: '/' });
        Cookies.remove('token', { path: '/' });
      }
    } else if (error.request) {
      console.error('[axios] No response received:', error.request);
    } else {
      console.error('[axios] Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
