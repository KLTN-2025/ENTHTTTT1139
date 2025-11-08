import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  ChatbotRecommendationDto,
  ChatbotRecommendationResponseDto,
  RecommendedCourseDto,
} from '../dto/chatbot.dto';
import { COURSE_APPROVE_STATUS } from '../constants/course.constant';

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private genAI: GoogleGenerativeAI;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY không được cấu hình. Chatbot service có thể không hoạt động.',
      );
    } else {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async recommendCourses(
    dto: ChatbotRecommendationDto,
  ): Promise<ChatbotRecommendationResponseDto> {
    try {
      const courses = await this.prismaService.tbl_courses.findMany({
        where: {
          approved: COURSE_APPROVE_STATUS.APPROVED,
        },
        select: {
          courseId: true,
          title: true,
          description: true,
        },
      });

      if (courses.length === 0) {
        return {
          recommendedCourses: [],
          total: 0,
          message: 'Hiện tại không có khóa học nào trong hệ thống.',
        };
      }

      const validCourses = courses
        .filter((c) => c.courseId && c.title && c.description)
        .map((c) => ({
          courseId: c.courseId,
          title: c.title || '',
          description: c.description || '',
        }));

      if (validCourses.length === 0) {
        return {
          recommendedCourses: [],
          total: 0,
          message: 'Không tìm thấy khóa học hợp lệ để đề xuất.',
        };
      }

      const systemPrompt = this.buildSystemPrompt(validCourses, dto.prompt);

      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-preview-05-20',
      });
      const result = await model.generateContent(systemPrompt);
      const response = result.response;
      const text = response.text();

      this.logger.debug('Raw AI response:', text);
      const recommendations = this.parseAIResponse(text, validCourses);

      this.logger.log(
        `Parsed ${recommendations.length} recommended courses from parseAIResponse`,
      );
      this.logger.debug(
        `Recommendations array:`,
        JSON.stringify(recommendations, null, 2),
      );

      if (recommendations.length === 0) {
        this.logger.warn('WARNING: recommendations.length is 0 after parsing!');
        this.logger.warn(
          'No valid recommendations after validation. Attempting fallback matching...',
        );

        const userKeywords = dto.prompt
          .toLowerCase()
          .split(/\s+/)
          .filter((word) => word.length > 2);

        const fallbackCourses = validCourses
          .filter((course) => {
            const title = (course.title || '').toLowerCase();
            const description = (course.description || '').toLowerCase();
            return userKeywords.some(
              (keyword) =>
                title.includes(keyword) || description.includes(keyword),
            );
          })
          .slice(0, 5)
          .map((course, idx) => ({
            courseId: course.courseId,
            title: course.title || '',
            description: course.description || '',
            reason: `Khóa học này có thể phù hợp với từ khóa "${dto.prompt}"`,
            matchScore: 0.6 - idx * 0.1,
          }));

        if (fallbackCourses.length > 0) {
          this.logger.log(
            `Found ${fallbackCourses.length} courses using fallback matching`,
          );
          return {
            recommendedCourses: fallbackCourses,
            total: fallbackCourses.length,
            message: `Dựa trên yêu cầu của bạn, tôi đã tìm thấy ${fallbackCourses.length} khóa học có thể phù hợp.`,
          };
        }

        this.logger.warn('No courses found even with fallback matching');
        return {
          recommendedCourses: [],
          total: 0,
          message:
            'Xin lỗi, tôi không tìm thấy khóa học nào phù hợp với yêu cầu của bạn. Vui lòng thử lại với từ khóa khác hoặc mô tả chi tiết hơn về nhu cầu học tập của bạn.',
        };
      }

      this.logger.log(
        `Returning ${recommendations.length} recommendations to frontend`,
      );
      this.logger.debug(
        'Final recommendations:',
        JSON.stringify(recommendations, null, 2),
      );

      return {
        recommendedCourses: recommendations,
        total: recommendations.length,
        message: `Dựa trên yêu cầu của bạn, tôi đã tìm thấy ${recommendations.length} khóa học phù hợp.`,
      };
    } catch (error) {
      this.logger.error('Lỗi khi recommend courses:', error);
      throw new InternalServerErrorException(
        'Không thể tạo đề xuất khóa học. Vui lòng thử lại sau.',
      );
    }
  }

  private buildSystemPrompt(
    courses: Array<{ courseId: string; title: string; description: string }>,
    userPrompt: string,
  ): string {
    const coursesJson = JSON.stringify(
      courses.map((c) => ({
        courseId: c.courseId,
        title: c.title || '',
        description: c.description || '',
      })),
      null,
      2,
    );

    return `Bạn là một trợ lý AI chuyên tư vấn khóa học. Nhiệm vụ của bạn là phân tích yêu cầu của người dùng và đề xuất các khóa học phù hợp nhất từ danh sách khóa học có sẵn.

Danh sách khóa học có sẵn:
${coursesJson}

Yêu cầu của người dùng: "${userPrompt}"

QUAN TRỌNG: Bạn PHẢI trả về CHỈ JSON, không có bất kỳ text nào khác trước hoặc sau JSON.

Định dạng JSON bắt buộc:
{
  "recommendedCourses": [
    {
      "courseId": "string (PHẢI là một trong các courseId từ danh sách trên)",
      "title": "string",
      "description": "string",
      "reason": "string (giải thích tại sao phù hợp)",
      "matchScore": 0.95
    }
  ]
}

QUY TẮC:
1. courseId PHẢI khớp chính xác với một trong các courseId trong danh sách trên
2. matchScore là số từ 0.0 đến 1.0
3. Chọn tối đa 10 khóa học phù hợp nhất
4. Sắp xếp theo matchScore từ cao xuống thấp
5. KHÔNG thêm text, comment, hoặc markdown code block - CHỈ trả về JSON thuần túy

Trả về JSON ngay bây giờ (KHÔNG có markdown, KHÔNG có text thêm):`;
  }

  private parseAIResponse(
    text: string,
    availableCourses: Array<{
      courseId: string;
      title: string;
      description: string;
    }>,
  ): RecommendedCourseDto[] {
    try {
      // Loại bỏ markdown code blocks nếu có
      let cleanedText = text.trim();

      // Tìm JSON trong text (có thể có text trước/sau JSON)
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }

      if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();
      }

      // Tìm JSON object một lần nữa sau khi clean
      const finalJsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (finalJsonMatch) {
        cleanedText = finalJsonMatch[0];
      }

      this.logger.debug('Cleaned text for parsing:', cleanedText);

      const parsed = JSON.parse(cleanedText);

      if (
        !parsed.recommendedCourses ||
        !Array.isArray(parsed.recommendedCourses)
      ) {
        this.logger.warn(
          'Response không có recommendedCourses hoặc không phải array',
        );
        this.logger.debug('Parsed object:', parsed);
        return [];
      }

      // Validate và filter courses
      const recommendations: RecommendedCourseDto[] = [];
      const courseIdMap = new Map(availableCourses.map((c) => [c.courseId, c]));

      this.logger.debug(
        `Processing ${parsed.recommendedCourses.length} recommendations from AI`,
      );
      this.logger.debug(`Available courses count: ${availableCourses.length}`);
      this.logger.debug(
        `Available course IDs:`,
        availableCourses.map((c) => c.courseId).slice(0, 5),
      );

      let skippedCount = 0;
      let invalidCourseIdCount = 0;
      let invalidMatchScoreCount = 0;

      for (const rec of parsed.recommendedCourses) {
        // Log từng recommendation để debug
        this.logger.debug(`Processing recommendation:`, {
          courseId: rec.courseId,
          hasCourseId: !!rec.courseId,
          courseIdInMap: courseIdMap.has(rec.courseId),
          matchScore: rec.matchScore,
          matchScoreType: typeof rec.matchScore,
          matchScoreValid:
            typeof rec.matchScore === 'number' &&
            rec.matchScore >= 0 &&
            rec.matchScore <= 1,
        });

        if (!rec.courseId) {
          this.logger.debug('Skipping: no courseId');
          skippedCount++;
          continue;
        }

        if (!courseIdMap.has(rec.courseId)) {
          this.logger.warn(
            `CourseId ${rec.courseId} not found in available courses`,
          );
          invalidCourseIdCount++;
          // Thử tìm bằng cách so sánh không phân biệt hoa thường hoặc partial match
          const foundCourse = availableCourses.find(
            (c) => c.courseId.toLowerCase() === rec.courseId?.toLowerCase(),
          );
          if (foundCourse) {
            this.logger.log(
              `Found course by case-insensitive match: ${foundCourse.courseId}`,
            );
            rec.courseId = foundCourse.courseId; // Update với courseId đúng
          } else {
            skippedCount++;
            continue;
          }
        }

        if (
          typeof rec.matchScore !== 'number' ||
          rec.matchScore < 0 ||
          rec.matchScore > 1
        ) {
          this.logger.debug('Skipping: invalid matchScore', rec.matchScore);
          invalidMatchScoreCount++;
          // Set default matchScore nếu không hợp lệ
          rec.matchScore = 0.5;
        }

        const course = courseIdMap.get(rec.courseId);
        if (course) {
          const recommendation = {
            courseId: rec.courseId,
            title: course.title || rec.title || '',
            description: course.description || rec.description || '',
            reason: rec.reason || 'Khóa học phù hợp với yêu cầu của bạn',
            matchScore: rec.matchScore,
          };
          this.logger.debug(`Adding valid recommendation:`, recommendation);
          recommendations.push(recommendation);
        } else {
          this.logger.warn(
            `Course not found in map for courseId: ${rec.courseId}`,
          );
          skippedCount++;
        }
      }

      this.logger.log(
        `Validation summary: ${recommendations.length} valid, ${skippedCount} skipped (${invalidCourseIdCount} invalid courseId, ${invalidMatchScoreCount} invalid matchScore)`,
      );

      // Sắp xếp theo matchScore giảm dần
      recommendations.sort((a, b) => b.matchScore - a.matchScore);

      this.logger.log(
        `Successfully parsed ${recommendations.length} valid recommendations`,
      );

      // Giới hạn tối đa 10 khóa học
      return recommendations.slice(0, 10);
    } catch (error) {
      this.logger.error('Lỗi khi parse AI response:', error);
      this.logger.error('Raw response text:', text);
      // Không throw error, trả về mảng rỗng để service có thể xử lý
      return [];
    }
  }
}
