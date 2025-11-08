import {
  Controller,
  Get,
  UseGuards,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AchievementService } from '../services/achievement.service';

@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyAchievements(@Req() req) {
    try {
      if (!req.user || !req.user.userId) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.userId;
      const result = await this.achievementService.getUserAchievements(userId);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error getting achievements',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('streak')
  async getMyStreak(@Req() req) {
    try {
      if (!req.user || !req.user.userId) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }

      const userId = req.user.userId;
      const streak = await this.achievementService.getUserStreak(userId);

      return {
        success: true,
        data: streak,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Error getting streak',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
