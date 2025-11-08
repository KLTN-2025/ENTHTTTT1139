import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './cache/redis.module';
import { CartService } from './services/cart.service';
import { CourseEnrollmentService } from './services/course-enrollment.service';
import { CourseEnrollmentRepository } from './repositories/course-enrollment.repository';
import { CourseEnrollmentController } from './controllers/course-enrollment.controller';
import { CourseAccessService } from './services/course-access.service';
import { CourseAccessController } from './controllers/course-access.controller';
import { RoleCheckService } from './services/role-check.service';
import { VoucherModule } from './modules/voucher.module';
import { LectureProgressGuard } from './guards/lecture-progress.guard';
import { ProgressService } from './services/progress.service';
import { ProgressController } from './controllers/progress.controller';
import { LectureVideoController } from './controllers/lecture-video.controller';
import { AchievementModule } from './modules/achievement.module';
import { VideoService } from './services/video.service';
import { CurriculumProgressController } from './controllers/curriculum-progress.controller';
import { QuizAttemptModule } from './modules/quiz-attempts.module';
import { ChatbotController } from './controllers/chatbot.controller';
import { ChatbotService } from './services/chatbot.service';
// ... import các service và repository khác

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    RedisModule,
    VoucherModule,
    QuizAttemptModule,
    AchievementModule,
    // ... các module khác
  ],
  controllers: [
    CourseEnrollmentController,
    CourseAccessController,
    ProgressController,
    LectureVideoController,
    CurriculumProgressController,
    ChatbotController,
    // ... các controller khác
  ],
  providers: [
    CartService,
    CourseEnrollmentService,
    CourseEnrollmentRepository,
    CourseAccessService,
    RoleCheckService,
    ProgressService,
    LectureProgressGuard,
    VideoService,
    ChatbotService,
    // ... các service và repository khác
  ],
  exports: [
    PrismaModule,
    RedisModule,
    CartService,
    CourseEnrollmentService,
    CourseEnrollmentRepository,
    CourseAccessService,
    RoleCheckService,
    ProgressService,
    LectureProgressGuard,
    VideoService,
    ChatbotService,
    // ... các service và repository khác
  ],
})
export class CommonModule {}
