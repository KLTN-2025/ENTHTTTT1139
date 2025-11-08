import axiosInstance from '@/lib/api/axios';
import { ChatbotRecommendationDto, ChatbotRecommendationResponseDto } from '@/types/chatbot';
import axios from 'axios';

const CHATBOT_ENDPOINT = '/chatbot';

// Tạo axios instance riêng cho chatbot với timeout dài hơn (90 giây)
const chatbotAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 90000, // 90 giây - đủ thời gian cho Gemini API xử lý
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Thêm interceptor để thêm token
chatbotAxios.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Thêm interceptor để xử lý lỗi
chatbotAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log lỗi để debug
    if (error.code === 'ECONNABORTED') {
      console.error('[Chatbot] Request timeout - có thể do Gemini API mất quá nhiều thời gian');
    }
    return Promise.reject(error);
  }
);

export const chatbotService = {
  recommendCourses: async (prompt: string): Promise<ChatbotRecommendationResponseDto> => {
    const response = await chatbotAxios.post<ChatbotRecommendationResponseDto>(
      `${CHATBOT_ENDPOINT}/recommend`,
      { prompt } as ChatbotRecommendationDto
    );
    return response.data;
  },
};
