/**
 * 招标采购工具函数统一导出
 * @module modules/bidding/utils
 */

// 格式化函数
export {
  formatDateToChinese,
  formatDateTimeToChinese,
  formatAmount,
} from './formatters';

// 验证函数
export {
  validateBidNumber,
  getStepName,
} from './validators';
