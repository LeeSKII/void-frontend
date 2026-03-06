/**
 * 招标采购服务统一导出
 * @module modules/bidding/services
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

// 导出服务
export {
  exportWordDocument,
  exportWordDocumentWithProgress,
  DEFAULT_OUTPUT_PREFIX,
} from './export';

// 模拟数据服务
export {
  getMockHistoryProjects,
  getMockHistoryProjectById,
  getMockHistoryProjectCount,
} from './mock';
