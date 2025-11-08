import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatbotRecommendationDto {
  @ApiProperty({
    description: 'Câu hỏi hoặc yêu cầu của người dùng về khóa học',
    example: 'Tôi muốn học về lập trình web với React và Next.js',
  })
  @IsNotEmpty()
  @IsString()
  prompt: string;
}

export class RecommendedCourseDto {
  @ApiProperty({
    description: 'ID của khóa học',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  courseId: string;

  @ApiProperty({
    description: 'Tiêu đề khóa học',
    example: 'React và Next.js cho người mới bắt đầu',
  })
  title: string;

  @ApiProperty({
    description: 'Mô tả khóa học',
    example:
      'Khóa học này sẽ giúp bạn học React và Next.js từ cơ bản đến nâng cao',
  })
  description: string;

  @ApiProperty({
    description: 'Lý do khóa học được đề xuất',
    example:
      'Khóa học phù hợp với yêu cầu học lập trình web với React và Next.js',
  })
  reason: string;

  @ApiProperty({
    description: 'Điểm số khớp (0-1)',
    example: 0.95,
  })
  matchScore: number;
}

export class ChatbotRecommendationResponseDto {
  @ApiProperty({
    description: 'Danh sách khóa học được đề xuất',
    type: [RecommendedCourseDto],
  })
  recommendedCourses: RecommendedCourseDto[];

  @ApiProperty({
    description: 'Tổng số khóa học được đề xuất',
    example: 5,
  })
  total: number;

  @ApiProperty({
    description: 'Thông báo phản hồi từ AI',
    example: 'Dựa trên yêu cầu của bạn, tôi đã tìm thấy 5 khóa học phù hợp...',
  })
  message?: string;
}
