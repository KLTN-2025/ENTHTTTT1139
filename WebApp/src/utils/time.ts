export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${remainingMinutes > 0 ? `${remainingMinutes}ph` : ''}`;
};

/**
 * Định dạng thời lượng sang định dạng phút:giây
 * - Tự động nhận diện nếu input là milliseconds và quy đổi về giây.
 * @param secondsOrMs Thời lượng tính bằng giây (hoặc mili-giây)
 * @returns Chuỗi định dạng "phút:giây"
 */
export const formatDurationToMinutesSeconds = (secondsOrMs?: number | null): string => {
  if (secondsOrMs === undefined || secondsOrMs === null) return '0:00';

  // Chuẩn hoá: nếu giá trị rất lớn (ngưỡng > 100000), coi là milliseconds
  const seconds =
    secondsOrMs > 100000
      ? Math.floor(secondsOrMs / 1000)
      : Math.floor(secondsOrMs);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
