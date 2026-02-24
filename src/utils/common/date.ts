/**
 * 通用日期工具函数
 * @module utils/common/date
 */

/**
 * 获取今日开始时间戳（用于日期默认值）
 * @returns 今日0点的时间戳
 */
export const getTodayTimestamp = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
};
