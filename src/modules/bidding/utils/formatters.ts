/**
 * 格式化工具函数
 * @module modules/bidding/utils/formatters
 */

/**
 * 格式化日期为中文格式
 * @param timestamp 时间戳
 * @returns 格式化后的日期字符串（如：2024年1月1日）
 */
export const formatDateToChinese = (timestamp: number | null): string => {
  if (!timestamp) {
    return "";
  }
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

/**
 * 格式化日期时间为中文格式（精确到小时）
 * @param timestamp 时间戳
 * @returns 格式化后的日期时间字符串（如：2024年1月1日9时）
 */
export const formatDateTimeToChinese = (timestamp: number | null): string => {
  if (!timestamp) {
    return "";
  }
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  return `${year}年${month}月${day}日${hour}时`;
};

/**
 * 格式化金额为元字符串
 * @param amount 金额（元）
 * @returns 格式化后的金额字符串
 */
export const formatAmount = (amount: number | null): string => {
  if (amount == null) {
    return "";
  }
  return `${amount.toFixed(2)}元`;
};
