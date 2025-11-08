import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { ChatbotService } from 'src/common/services/chatbot.service';
import {
  ChatbotRecommendationDto,
  ChatbotRecommendationResponseDto,
} from '../dto/chatbot.dto';

@ApiTags('Chatbot')
@ApiBearerAuth()
@Controller('chatbot')
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('recommend')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    type: ChatbotRecommendationDto,
  })
  @ApiResponse({
    status: 200,
    type: ChatbotRecommendationResponseDto,
  })
  @ApiResponse({
    status: 400,
  })
  @ApiResponse({
    status: 500,
  })
  async recommendCourses(
    @Body() dto: ChatbotRecommendationDto,
  ): Promise<ChatbotRecommendationResponseDto> {
    return this.chatbotService.recommendCourses(dto);
  }
}
