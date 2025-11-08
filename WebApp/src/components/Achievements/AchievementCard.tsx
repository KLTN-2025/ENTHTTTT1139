'use client';

import React from 'react';

interface AchievementCardProps {
  milestone: number;
  unlockedAt?: string;
  isUnlocked: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({ milestone, unlockedAt, isUnlocked }) => {
  const getIcon = (milestone: number) => {
    // Tạm thời dùng emoji làm icon, có thể thay bằng SVG sau
    if (milestone === 1) return '🎯';
    if (milestone === 2) return '🌟';
    if (milestone === 3) return '⭐';
    if (milestone === 5) return '🏆';
    if (milestone === 10) return '👑';
    if (milestone >= 25) return '💎';
    return '🎖️';
  };

  const getTitle = (milestone: number) => {
    return `Hoàn thành ${milestone} khóa học`;
  };

  const getColor = (milestone: number) => {
    if (milestone === 1) return 'from-blue-400 to-blue-600';
    if (milestone === 2) return 'from-green-400 to-green-600';
    if (milestone === 3) return 'from-yellow-400 to-yellow-600';
    if (milestone === 5) return 'from-orange-400 to-orange-600';
    if (milestone === 10) return 'from-purple-400 to-purple-600';
    if (milestone >= 25) return 'from-pink-400 to-pink-600';
    return 'from-gray-400 to-gray-600';
  };

  return (
    <div
      className={`relative p-6 rounded-lg border-2 transition-all duration-300 ${
        isUnlocked
          ? `bg-gradient-to-br ${getColor(milestone)} border-transparent shadow-lg hover:scale-105`
          : 'bg-gray-100 border-gray-300 opacity-60'
      }`}
    >
      {/* Icon */}
      <div className="flex justify-center mb-4">
        <div
          className={`text-6xl transition-transform duration-300 ${
            isUnlocked ? 'animate-pulse' : 'grayscale'
          }`}
        >
          {getIcon(milestone)}
        </div>
      </div>

      {/* Content */}
      <div className="text-center">
        <h3 className={`text-lg font-bold mb-2 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
          {getTitle(milestone)}
        </h3>

        {isUnlocked && unlockedAt ? (
          <p className="text-sm text-white/80">
            Đã mở khóa: {new Date(unlockedAt).toLocaleDateString('vi-VN')}
          </p>
        ) : (
          <p className="text-sm text-gray-400">Chưa mở khóa</p>
        )}

        {/* Badge */}
        {isUnlocked && (
          <div className="mt-3 inline-block px-3 py-1 bg-white/20 rounded-full">
            <span className="text-xs font-semibold text-white">ĐÃ ĐẠT ĐƯỢC</span>
          </div>
        )}
      </div>

      {/* Lock overlay nếu chưa unlock */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200/50 rounded-lg">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default AchievementCard;



