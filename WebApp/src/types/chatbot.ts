export interface ChatbotRecommendationDto {
  prompt: string;
}

export interface RecommendedCourseDto {
  courseId: string;
  title: string;
  description: string;
  reason: string;
  matchScore: number;
}

export interface ChatbotRecommendationResponseDto {
  recommendedCourses: RecommendedCourseDto[];
  total: number;
  message?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  courses?: RecommendedCourseDto[];
}



