/**
 * 验证工具函数
 * @module modules/bidding/utils/validators
 */

/**
 * 验证招标编号格式（业务相关验证规则）
 * @param bidNumber 招标编号
 * @returns 是否有效
 */
export const validateBidNumber = (bidNumber: string): boolean => {
  const bidNumberRegex = /^[A-Za-z0-9]{10,20}$/;
  return bidNumberRegex.test(bidNumber);
};

/**
 * 获取步骤名称
 * @param step 步骤编号
 * @returns 步骤名称
 */
export const getStepName = (step: number): string => {
  const names = ["", "基础信息", "投标人须知", "综合评分法"];
  return names[step] || "";
};
