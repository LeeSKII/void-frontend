/**
 * 通用验证工具函数
 * @module utils/common/validate
 */

/**
 * 验证手机号格式
 * @param phone 手机号
 * @returns 是否有效
 */
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$|^0\d{2,3}-?\d{7,8}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否有效
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
