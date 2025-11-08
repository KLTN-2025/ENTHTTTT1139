import { Module, forwardRef } from '@nestjs/common';
import { ProgressController } from '../controllers/progress.controller';
import { ProgressService } from '../services/progress.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AchievementModule } from './achievement.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AchievementModule)],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
