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
  // Thêm token vào header
  console.log('[axios] Checking for tokens in localStorage and cookies...');
  
  // Kiểm tra cả accessToken và token từ localStorage
  const accessTokenLS = localStorage.getItem('accessToken');
  const tokenLS = localStorage.getItem('token');
  
  // Kiểm tra cả accessToken và token từ cookies
  const accessTokenCookie = Cookies.get('accessToken');
  const tokenCookie = Cookies.get('token');
  
  // Ưu tiên token từ localStorage, nếu không có thì dùng cookie
  const accessToken = accessTokenLS || accessTokenCookie;
  const token = tokenLS || tokenCookie;
  
  console.log('[axios] Token check:', { 
    accessTokenLSExists: !!accessTokenLS,
    tokenLSExists: !!tokenLS,
    accessTokenCookieExists: !!accessTokenCookie,
    tokenCookieExists: !!tokenCookie,
    baseURL: config.baseURL,
    url: config.url
  });
  
  // Đồng bộ hóa token giữa localStorage và cookies
  if (accessToken && !accessTokenLS) {
    console.log('[axios] Synchronizing accessToken from cookie to localStorage');
    localStorage.setItem('accessToken', accessToken);
  }
  
  if (token && !tokenLS) {
    console.log('[axios] Synchronizing token from cookie to localStorage');
    localStorage.setItem('token', token);
  }
  
  // Ưu tiên dùng accessToken, nếu không có thì dùng token
  if (accessToken) {
    console.log('[axios] Using accessToken for Authorization header');
    config.headers.Authorization = `Bearer ${accessToken}`;
  } else if (token) {
    console.log('[axios] Using token for Authorization header');
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log('[axios] No token found in localStorage or cookies');
  }
  
  return config;
});

// Thêm interceptor để xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('[axios] Successful response from:', response.config.url);
    return response;
  },
  (error) => {
    console.error('[axios] API Error:', error);
    if (error.response) {
      // Lỗi từ server
      console.error('[axios] Response data:', error.response.data);
      console.error('[axios] Response status:', error.response.status);
      
      // Kiểm tra lỗi 401 - Unauthorized
      if (error.response.status === 401) {
        const requestUrl: string = error.config?.url || '';
        const responseData: any = error.response?.data || {};
        const serverMessage: string = String(
          responseData?.message ||
            responseData?.error ||
            responseData?.errorMessage ||
            ''
        ).toLowerCase();
        const errorCode: string = String(responseData?.errorCode || '').toUpperCase();

        // Chỉ coi là 401 do token khi có mã lỗi/chuỗi liên quan đến token
        const isAuthRelated401 =
          ['TOKEN_EXPIRED', 'TOKEN_INVALID', 'UNAUTHORIZED', 'INVALID_TOKEN'].includes(errorCode) ||
          serverMessage.includes('token') ||
          serverMessage.includes('jwt') ||
          serverMessage.includes('hết hạn') ||
          serverMessage.includes('expired');

        // Additionally, bảo vệ các route nghiệp vụ (như /payment, /courses, ...) khỏi việc tự logout
        const isBusinessEndpoint = /^\/?(payment|customer-payment|courses|cart|instructor|enrollments|voucher)/i.test(
          requestUrl
        );

        if (isAuthRelated401 && !isBusinessEndpoint) {
          console.error('[axios] Unauthorized due to auth token. Clearing tokens and requiring login.');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('token');
          Cookies.remove('accessToken', { path: '/' });
          Cookies.remove('token', { path: '/' });
        } else {
          console.warn(
            '[axios] 401 received but not treated as auth-expired. Keeping session tokens.'
          );
        }
      }
    } else if (error.request) {
      // Lỗi không có response
      console.error('[axios] No response received:', error.request);
    } else {
      // Lỗi khi setup request
      console.error('[axios] Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
