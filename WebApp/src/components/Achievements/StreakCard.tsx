'use client';

import React from 'react';
import { UserStreak } from '@/apis/achievementService';

interface StreakCardProps {
  streak: UserStreak;
}

const StreakCard: React.FC<StreakCardProps> = ({ streak }) => {
  const { currentStreak, longestStreak, lastStudyDate } = streak;

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Bắt đầu chuỗi học tập của bạn!';
    if (streak < 3) return 'Tuyệt vời! Hãy tiếp tục!';
    if (streak < 7) return 'Đang tiến bộ tốt!';
    if (streak < 14) return 'Chuỗi ấn tượng!';
    if (streak < 30) return 'Bạn đang làm rất tốt!';
    return 'Bạn là người học tập xuất sắc! 🔥';
  };

  return (
    <div className="bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 rounded-xl p-8 shadow-xl">
      <div className="text-center">
        {/* Fire Icon */}
        <div className="flex justify-center mb-4">
          <div className="text-6xl animate-pulse">🔥</div>
        </div>

        {/* Current Streak */}
        <div className="mb-6">
          <p className="text-white/80 text-sm mb-2">Chuỗi hiện tại</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-5xl font-bold text-white">{currentStreak}</span>
            <span className="text-2xl text-white/80">ngày</span>
          </div>
        </div>

        {/* Longest Streak */}
        {longestStreak > 0 && (
          <div className="mb-6 pb-6 border-b border-white/20">
            <p className="text-white/80 text-sm mb-2">Kỷ lục tốt nhất</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-bold text-white">{longestStreak}</span>
              <span className="text-lg text-white/80">ngày</span>
            </div>
          </div>
        )}

        {/* Message */}
        <p className="text-white/90 text-sm italic">{getStreakMessage(currentStreak)}</p>

        {/* Last Study Date */}
        {lastStudyDate && (
          <p className="text-white/70 text-xs mt-4">
            Lần học cuối: {new Date(lastStudyDate).toLocaleDateString('vi-VN')}
          </p>
        )}
      </div>

      {/* Progress indicator */}
      <div className="mt-6">
        <div className="flex justify-center gap-1">
          {Array.from({ length: Math.min(currentStreak, 30) }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${i < currentStreak ? 'bg-white' : 'bg-white/30'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreakCard;



