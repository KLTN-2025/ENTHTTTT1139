'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';
import AchievementsList from '@/components/Achievements/AchievementsList';
import StreakCard from '@/components/Achievements/StreakCard';
import {
  AchievementService,
  UserAchievementsResponse,
  UserStreak,
} from '@/apis/achievementService';
import toast from 'react-hot-toast';

export default function AchievementsPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [achievementsData, setAchievementsData] = useState<UserAchievementsResponse | null>(null);
  const [streak, setStreak] = useState<UserStreak | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn || !user) {
        router.push('/login');
        return;
      }
      fetchAchievements();
    }
  }, [authLoading, isLoggedIn, user, router]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const data = await AchievementService.getMyAchievements();

      // Đảm bảo data có đầy đủ các trường cần thiết
      setAchievementsData({
        achievements: data?.achievements || [],
        streak: data?.streak || {
          streakId: '',
          userId: user?.userId || '',
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        },
        totalCoursesCompleted: data?.totalCoursesCompleted || 0,
      });

      setStreak(
        data?.streak || {
          streakId: '',
          userId: user?.userId || '',
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        }
      );
    } catch (error: any) {
      console.error('Error fetching achievements:', error);
      toast.error('Không thể tải thành tựu. Vui lòng thử lại sau.');

      // Fallback data
      const fallbackData = {
        achievements: [],
        streak: {
          streakId: '',
          userId: user?.userId || '',
          currentStreak: 0,
          longestStreak: 0,
          lastStudyDate: undefined,
          createdAt: undefined,
          updatedAt: undefined,
        },
        totalCoursesCompleted: 0,
      };

      setAchievementsData(fallbackData);
      setStreak(fallbackData.streak);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <ProfileSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="h-64 bg-gray-200 rounded-xl"></div>
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-48 bg-gray-200 rounded"></div>
                  <div className="h-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ProfileSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Thành tựu & Chuỗi học tập</h1>
            <p className="text-gray-600">
              Xem các thành tựu bạn đã đạt được và theo dõi chuỗi học tập của bạn
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Streak Card - Takes 1 column */}
            <div className="lg:col-span-1">{streak && <StreakCard streak={streak} />}</div>

            {/* Achievements List - Takes 2 columns */}
            <div className="lg:col-span-2">
              {achievementsData && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <AchievementsList
                    achievements={achievementsData.achievements || []}
                    totalCoursesCompleted={achievementsData.totalCoursesCompleted || 0}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Stats Summary */}
          {achievementsData && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Tổng quan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {achievementsData.totalCoursesCompleted || 0}
                  </div>
                  <div className="text-sm text-gray-600">Khóa học đã hoàn thành</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {(achievementsData.achievements || []).length}
                  </div>
                  <div className="text-sm text-gray-600">Thành tựu đã đạt</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {streak?.currentStreak || 0}
                  </div>
                  <div className="text-sm text-gray-600">Chuỗi học tập hiện tại</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
