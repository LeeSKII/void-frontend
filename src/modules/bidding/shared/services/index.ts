/**
 * 招标采购共享服务统一导出
 * @module modules/bidding/shared/services
 */

// API 服务
export {
  submitBiddingForm,
  uploadFile,
} from './api';

// 草稿管理服务
export {
  saveDraftToLocalStorage,
  loadDraftFromLocalStorage,
  removeDraftFromLocalStorage,
  hasDraftInStorage,
  getDraftSavedTime,
  createEmptyFormData,
  AUTO_SAVE_INTERVAL,
} from './draft';

// 模拟数据服务
export {
  getMockHistoryProjects,
  getMockHistoryProjectById,
  getMockHistoryProjectCount,
} from './mock';

// AI服务
export {
  generateBiddingForm,
  generateBiddingFormPartial,
  generateBiddingFormByPrompt,
  type AIGenerateOptions,
  type AIGenerateResult,
  type AIPartialGenerateOptions,
} from './ai';
