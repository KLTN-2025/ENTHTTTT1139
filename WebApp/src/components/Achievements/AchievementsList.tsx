'use client';

import React from 'react';
import AchievementCard from './AchievementCard';
import { Achievement } from '@/apis/achievementService';

interface AchievementsListProps {
  achievements: Achievement[];
  totalCoursesCompleted: number;
}

const MILESTONES = [1, 2, 3, 5, 10, 25, 50, 100];

const AchievementsList: React.FC<AchievementsListProps> = ({
  achievements = [],
  totalCoursesCompleted = 0,
}) => {
  // Tạo map để dễ tra cứu achievements đã unlock
  const unlockedMilestones = new Set((achievements || []).map((a) => a.milestone));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Thành tựu của bạn</h2>
        <p className="text-gray-600">
          Bạn đã hoàn thành{' '}
          <span className="font-bold text-orange-600">{totalCoursesCompleted}</span> khóa học
        </p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5 max-w-md mx-auto">
          <div
            className="bg-gradient-to-r from-orange-400 to-orange-600 h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((totalCoursesCompleted / 100) * 100, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {MILESTONES.map((milestone) => {
          const achievement = (achievements || []).find((a) => a.milestone === milestone);
          const isUnlocked = unlockedMilestones.has(milestone);

          return (
            <AchievementCard
              key={milestone}
              milestone={milestone}
              unlockedAt={achievement?.unlockedAt}
              isUnlocked={isUnlocked}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {(!achievements || achievements.length === 0) && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có thành tựu nào</h3>
          <p className="text-gray-500">
            Hãy hoàn thành khóa học đầu tiên để bắt đầu thu thập thành tựu!
          </p>
        </div>
      )}
    </div>
  );
};

export default AchievementsList;
