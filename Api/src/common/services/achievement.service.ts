import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AchievementService {
  // Các mốc thành tựu cho số khóa học hoàn thành
  private readonly COURSE_MILESTONES = [1, 2, 3, 5, 10, 25, 50, 100];

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Kiểm tra và trao thành tựu khi người dùng hoàn thành khóa học
   */
  async checkAndAwardCourseCompletionAchievement(
    userId: string,
    courseId: string,
  ): Promise<void> {
    // Đếm số khóa học đã hoàn thành của người dùng
    const completedCoursesCount = await this.getCompletedCoursesCount(userId);

    // Kiểm tra xem có mốc nào cần trao không
    const milestonesToAward = this.COURSE_MILESTONES.filter(
      (milestone) => completedCoursesCount >= milestone,
    );

    if (milestonesToAward.length === 0) {
      return;
    }

    // Trao các thành tựu chưa được trao
    for (const milestone of milestonesToAward) {
      await this.awardAchievementIfNotExists(
        userId,
        'COURSES_COMPLETED',
        milestone,
      );
    }
  }

  /**
   * Đếm số khóa học đã hoàn thành của người dùng
   */
  async getCompletedCoursesCount(userId: string): Promise<number> {
    // Lấy danh sách các khóa học mà user đã đăng ký
    const enrollments =
      await this.prismaService.tbl_course_enrollments.findMany({
        where: { userId },
        include: {
          tbl_courses: {
            include: {
              tbl_modules: {
                include: {
                  tbl_curricula: true,
                },
              },
            },
          },
        },
      });

    let completedCoursesCount = 0;

    // Kiểm tra từng khóa học xem đã hoàn thành chưa
    for (const enrollment of enrollments) {
      const course = enrollment.tbl_courses;
      if (!course) continue;

      // Lấy tất cả curriculum trong khóa học
      const allCurricula: string[] = [];
      for (const module of course.tbl_modules || []) {
        for (const curriculum of module.tbl_curricula || []) {
          allCurricula.push(curriculum.curriculumId);
        }
      }

      if (allCurricula.length === 0) continue;

      // Kiểm tra xem tất cả curriculum đã hoàn thành chưa
      const completedCurricula =
        await this.prismaService.tbl_curriculum_progress.count({
          where: {
            userId,
            curriculumId: { in: allCurricula },
            status: 'COMPLETED',
          },
        });

      // Nếu tất cả curriculum đã hoàn thành, thì khóa học đã hoàn thành
      if (completedCurricula === allCurricula.length) {
        completedCoursesCount++;
      }
    }

    return completedCoursesCount;
  }

  /**
   * Trao thành tựu nếu chưa được trao
   */
  async awardAchievementIfNotExists(
    userId: string,
    achievementType: string,
    milestone: number,
  ): Promise<void> {
    // Kiểm tra xem thành tựu đã tồn tại chưa
    const existingAchievement =
      await this.prismaService.tbl_user_achievements.findFirst({
        where: {
          userId,
          achievementType: achievementType as any,
          milestone,
        },
      });

    if (existingAchievement) {
      return; // Đã trao rồi, không cần trao lại
    }

    // Trao thành tựu mới
    await this.prismaService.tbl_user_achievements.create({
      data: {
        achievementId: uuidv4(),
        userId,
        achievementType: achievementType as any,
        milestone,
        unlockedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Cập nhật streak học tập khi người dùng học video
   */
  async updateStudyStreak(userId: string): Promise<void> {
    // Lấy hoặc tạo streak record cho user
    let streakRecord = await this.prismaService.tbl_user_streaks.findUnique({
      where: { userId },
    });

    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).getTime();

    if (!streakRecord) {
      // Tạo streak record mới
      streakRecord = await this.prismaService.tbl_user_streaks.create({
        data: {
          streakId: uuidv4(),
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastStudyDate: now,
          createdAt: now,
          updatedAt: now,
        },
      });
      return;
    }

    // Kiểm tra lastStudyDate
    if (!streakRecord.lastStudyDate) {
      // Nếu chưa có lastStudyDate, set streak = 1
      await this.prismaService.tbl_user_streaks.update({
        where: { streakId: streakRecord.streakId },
        data: {
          currentStreak: 1,
          longestStreak: Math.max(1, streakRecord.longestStreak),
          lastStudyDate: now,
          updatedAt: now,
        },
      });
      return;
    }

    const lastStudyDate = new Date(
      streakRecord.lastStudyDate.getFullYear(),
      streakRecord.lastStudyDate.getMonth(),
      streakRecord.lastStudyDate.getDate(),
    ).getTime();

    const daysDifference = (today - lastStudyDate) / (1000 * 60 * 60 * 24);

    let newCurrentStreak = streakRecord.currentStreak;

    if (daysDifference === 0) {
      // Cùng ngày, không cần cập nhật streak
      return;
    } else if (daysDifference === 1) {
      // Ngày hôm qua, tiếp tục streak
      newCurrentStreak = streakRecord.currentStreak + 1;
    } else {
      // Bỏ lỡ ngày, reset streak về 1
      newCurrentStreak = 1;
    }

    // Cập nhật streak
    await this.prismaService.tbl_user_streaks.update({
      where: { streakId: streakRecord.streakId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: Math.max(newCurrentStreak, streakRecord.longestStreak),
        lastStudyDate: now,
        updatedAt: now,
      },
    });
  }

  /**
   * Lấy tất cả achievements của người dùng
   */
  async getUserAchievements(userId: string) {
    const achievements =
      await this.prismaService.tbl_user_achievements.findMany({
        where: { userId },
        orderBy: { milestone: 'asc' },
      });

    const streak = await this.prismaService.tbl_user_streaks.findUnique({
      where: { userId },
    });

    const totalCoursesCompleted = await this.getCompletedCoursesCount(userId);

    return {
      achievements,
      streak: streak || {
        streakId: '',
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        createdAt: null,
        updatedAt: null,
      },
      totalCoursesCompleted,
    };
  }

  /**
   * Lấy streak của người dùng
   */
  async getUserStreak(userId: string) {
    const streak = await this.prismaService.tbl_user_streaks.findUnique({
      where: { userId },
    });

    if (!streak) {
      return {
        streakId: '',
        userId,
        currentStreak: 0,
        longestStreak: 0,
        lastStudyDate: null,
        createdAt: null,
        updatedAt: null,
      };
    }

    return streak;
  }
}
