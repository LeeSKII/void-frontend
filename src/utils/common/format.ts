/**
 * 通用格式化工具函数
 * @module utils/common/format
 */

/**
 * 格式化金额显示
 * @param amount 金额
 * @returns 格式化后的金额字符串
 */
export const formatAmount = (amount: number | null | undefined): string => {
  if (amount == null) {
    return "0.00";
  }
  return amount.toFixed(2);
};

/**
 * 格式化日期时间
 * @param timestamp 时间戳
 * @returns 格式化后的日期时间字符串
 */
export const formatDateTime = (timestamp: number | null): string => {
  if (!timestamp) {
    return "";
  }
  return new Date(timestamp).toLocaleString("zh-CN");
};
