import { Module } from '@nestjs/common';
import { AchievementService } from '../services/achievement.service';
import { AchievementController } from '../controllers/achievement.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}



