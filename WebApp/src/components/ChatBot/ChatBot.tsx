'use client';

import { useState, useEffect, useRef } from 'react';
import { chatbotService } from '@/apis/chatbotService';
import { ChatMessage, RecommendedCourseDto } from '@/types/chatbot';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const MAX_QUESTIONS_PER_DAY = 15;

interface DailyQuestionLimit {
  date: string;
  count: number;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content:
        'Xin chào! Tôi là trợ lý AI của bạn. Hãy cho tôi biết bạn muốn học về điều gì, tôi sẽ đề xuất các khóa học phù hợp nhất cho bạn! 😊',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionsRemaining, setQuestionsRemaining] = useState(MAX_QUESTIONS_PER_DAY);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Kiểm tra giới hạn câu hỏi mỗi ngày
  useEffect(() => {
    const checkDailyLimit = () => {
      const today = new Date().toDateString();
      const stored = localStorage.getItem('chatbot_daily_questions');

      if (stored) {
        const limit: DailyQuestionLimit = JSON.parse(stored);
        if (limit.date === today) {
          setQuestionsRemaining(MAX_QUESTIONS_PER_DAY - limit.count);
        } else {
          // Reset cho ngày mới
          localStorage.setItem(
            'chatbot_daily_questions',
            JSON.stringify({ date: today, count: 0 })
          );
          setQuestionsRemaining(MAX_QUESTIONS_PER_DAY);
        }
      } else {
        setQuestionsRemaining(MAX_QUESTIONS_PER_DAY);
      }
    };

    checkDailyLimit();
    // Kiểm tra lại mỗi phút để reset khi sang ngày mới
    const interval = setInterval(checkDailyLimit, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom khi có message mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input khi mở chat
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const incrementQuestionCount = () => {
    const today = new Date().toDateString();
    const stored = localStorage.getItem('chatbot_daily_questions');

    if (stored) {
      const limit: DailyQuestionLimit = JSON.parse(stored);
      if (limit.date === today) {
        limit.count += 1;
      } else {
        limit.date = today;
        limit.count = 1;
      }
      localStorage.setItem('chatbot_daily_questions', JSON.stringify(limit));
      setQuestionsRemaining(MAX_QUESTIONS_PER_DAY - limit.count);
    } else {
      localStorage.setItem('chatbot_daily_questions', JSON.stringify({ date: today, count: 1 }));
      setQuestionsRemaining(MAX_QUESTIONS_PER_DAY - 1);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Kiểm tra giới hạn
    if (questionsRemaining <= 0) {
      const limitMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content:
          'Bạn đã sử dụng hết 10 câu hỏi cho ngày hôm nay. Vui lòng quay lại vào ngày mai! 😊',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, limitMessage]);
      setInputValue('');
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    incrementQuestionCount();

    try {
      const response = await chatbotService.recommendCourses(userMessage.content);
      console.log('Chatbot response:', response);

      // Xử lý response structure: có thể là response.data hoặc response trực tiếp
      const responseData = (response as any)?.data || response;
      console.log('Response data:', responseData);
      console.log('Recommended courses:', responseData?.recommendedCourses);
      console.log('Courses type:', typeof responseData?.recommendedCourses);
      console.log('Is array:', Array.isArray(responseData?.recommendedCourses));
      console.log('Courses length:', responseData?.recommendedCourses?.length);

      // Kiểm tra và xử lý response
      const courses = responseData?.recommendedCourses || [];
      const hasCourses = Array.isArray(courses) && courses.length > 0;

      console.log('Has courses:', hasCourses, 'Courses count:', courses.length);

      // Xử lý message
      let botContent = responseData?.message || response?.message || '';

      // Ưu tiên: nếu có courses, luôn dùng message tích cực
      if (hasCourses) {
        botContent = `Đây là ${courses.length} khóa học phù hợp với yêu cầu của bạn:`;
      } else if (!botContent || botContent.trim() === '') {
        // Nếu không có message và không có courses
        botContent =
          'Xin lỗi, tôi không tìm thấy khóa học nào phù hợp với yêu cầu của bạn. Vui lòng thử lại với từ khóa khác hoặc mô tả chi tiết hơn về nhu cầu học tập của bạn.';
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botContent,
        timestamp: new Date(),
        courses: hasCourses ? courses : undefined,
      };

      console.log('=== Final Bot Message ===');
      console.log('Bot message ID:', botMessage.id);
      console.log('Bot message content:', botMessage.content);
      console.log('Bot message courses:', botMessage.courses);
      console.log('Courses length:', botMessage.courses?.length);
      console.log('Has courses check:', hasCourses);

      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Chatbot error:', error);

      let errorContent = 'Xin lỗi, đã có lỗi xảy ra khi tìm kiếm khóa học. Vui lòng thử lại sau.';

      // Xử lý các loại lỗi cụ thể
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorContent =
          '⏱️ Yêu cầu của bạn đang mất quá nhiều thời gian để xử lý. Vui lòng thử lại với câu hỏi ngắn gọn hơn hoặc thử lại sau vài phút.';
      } else if (error.response?.status === 401) {
        errorContent =
          '🔒 Bạn cần đăng nhập để sử dụng tính năng này. Vui lòng đăng nhập và thử lại.';
      } else if (error.response?.status === 500) {
        errorContent = '⚠️ Máy chủ đang gặp sự cố. Vui lòng thử lại sau một lát.';
      } else if (error.response?.data?.message) {
        errorContent = `⚠️ ${error.response.data.message}`;
      }

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: errorContent,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 z-50 bg-[#29cc60] hover:bg-[#24b854] text-white rounded-full p-3 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
        aria-label="Mở chatbot"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {questionsRemaining > 0 && questionsRemaining <= 3 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {questionsRemaining}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[calc(100vh-8rem)] sm:h-[600px] max-h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-[#29cc60] text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Trợ lý AI</h3>
                <p className="text-xs text-white/80">
                  {questionsRemaining > 0
                    ? `Còn ${questionsRemaining} câu hỏi hôm nay`
                    : 'Đã hết câu hỏi hôm nay'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              aria-label="Đóng chatbot"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className="space-y-3">
                {/* Message Content */}
                <div
                  className={cn('flex', message.type === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg p-3',
                      message.type === 'user'
                        ? 'bg-[#29cc60] text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>

                {/* Recommended Courses - Hiển thị riêng bên ngoài bubble */}
                {message.courses &&
                  Array.isArray(message.courses) &&
                  message.courses.length > 0 && (
                    <div className="space-y-2 mt-2">
                      <p className="text-xs text-gray-500 px-1 font-medium">
                        📚 {message.courses.length} khóa học được đề xuất:
                      </p>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {message.courses.map((course, idx) => (
                          <Link
                            key={course.courseId}
                            href={`/courses/${course.courseId}`}
                            className="block bg-white rounded-lg border border-gray-200 hover:border-[#29cc60] hover:shadow-md transition-all duration-200 overflow-hidden group"
                          >
                            <div className="p-3">
                              <div className="flex items-start gap-3">
                                {/* Badge số thứ tự */}
                                <div className="flex-shrink-0 w-6 h-6 bg-[#29cc60] text-white rounded-full flex items-center justify-center text-xs font-bold">
                                  {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm text-gray-900 line-clamp-1 group-hover:text-[#29cc60] transition-colors">
                                    {course.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {course.description}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#29cc60]/10 text-[#29cc60] rounded-full text-xs font-medium">
                                      <svg
                                        className="w-3 h-3"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                      </svg>
                                      {Math.round(course.matchScore * 100)}% phù hợp
                                    </span>
                                  </div>
                                  {course.reason && (
                                    <p className="text-xs text-gray-500 mt-1.5 italic line-clamp-1">
                                      💡 {course.reason}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  questionsRemaining > 0 ? 'Nhập câu hỏi của bạn...' : 'Bạn đã hết câu hỏi hôm nay'
                }
                disabled={isLoading || questionsRemaining <= 0}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#29cc60] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading || questionsRemaining <= 0}
                className="bg-[#29cc60] text-white px-4 py-2 rounded-lg hover:bg-[#24b854] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Gửi tin nhắn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            {questionsRemaining <= 0 && (
              <p className="text-xs text-red-500 mt-2 text-center">
                Bạn đã sử dụng hết {MAX_QUESTIONS_PER_DAY} câu hỏi hôm nay. Vui lòng quay lại vào
                ngày mai!
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
