import { IsEnum, IsInt, IsOptional, IsUUID } from 'class-validator';

export enum AchievementType {
  COURSES_COMPLETED = 'COURSES_COMPLETED',
}

export class GetUserAchievementsDto {
  @IsOptional()
  @IsUUID()
  userId?: string;
}

export class AchievementResponseDto {
  achievementId: string;
  userId: string;
  achievementType: AchievementType;
  milestone: number;
  unlockedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserStreakResponseDto {
  streakId: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastStudyDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserAchievementsSummaryDto {
  achievements: AchievementResponseDto[];
  streak: UserStreakResponseDto;
  totalCoursesCompleted: number;
}
