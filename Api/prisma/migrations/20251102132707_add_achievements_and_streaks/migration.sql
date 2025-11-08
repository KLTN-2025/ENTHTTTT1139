-- CreateEnum
CREATE TYPE "achievement_type_enum" AS ENUM ('COURSES_COMPLETED');

-- CreateTable
CREATE TABLE "tbl_user_achievements" (
    "achievementId" UUID NOT NULL,
    "userId" UUID,
    "achievementType" "achievement_type_enum" NOT NULL,
    "milestone" INTEGER NOT NULL,
    "unlockedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(6),
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "tbl_user_achievements_pkey" PRIMARY KEY ("achievementId")
);

-- CreateTable
CREATE TABLE "tbl_user_streaks" (
    "streakId" UUID NOT NULL,
    "userId" UUID,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "lastStudyDate" TIMESTAMP(6),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "tbl_user_streaks_pkey" PRIMARY KEY ("streakId")
);

-- CreateIndex
CREATE INDEX "tbl_user_achievements_userId_idx" ON "tbl_user_achievements"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_achievements_userId_achievementType_milestone_key" ON "tbl_user_achievements"("userId", "achievementType", "milestone");

-- CreateIndex
CREATE INDEX "tbl_user_streaks_userId_idx" ON "tbl_user_streaks"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "tbl_user_streaks_userId_key" ON "tbl_user_streaks"("userId");

-- AddForeignKey
ALTER TABLE "tbl_user_achievements" ADD CONSTRAINT "tbl_user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tbl_user_streaks" ADD CONSTRAINT "tbl_user_streaks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "tbl_users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION;
