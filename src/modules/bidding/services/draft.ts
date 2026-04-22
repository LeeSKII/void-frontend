/**
 * 草稿管理服务
 * @module modules/bidding/services/draft
 */

import type {
  IBiddingFormData,
  IDraftData,
} from '@/modules/bidding/types';

/**
 * 本地存储键名
 */
const STORAGE_KEY = "bidding_form_draft";

/**
 * 自动保存间隔（毫秒）
 */
export const AUTO_SAVE_INTERVAL = 5000;

/**
 * 保存草稿到本地存储
 * @param formData 表单数据
 * @param currentStep 当前步骤
 * @returns 保存是否成功
 */
export const saveDraftToLocalStorage = (
  formData: IBiddingFormData,
  currentStep: number,
): boolean => {
  try {
    const draftData: IDraftData = {
      formData: JSON.parse(JSON.stringify(formData)),
      currentStep,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
    return true;
  } catch (error) {
    console.error("保存草稿失败:", error);
    return false;
  }
};

/**
 * 从本地存储加载草稿
 * @returns 草稿数据，如果不存在则返回 null
 */
export const loadDraftFromLocalStorage = (): IDraftData | null => {
  try {
    const draftString = localStorage.getItem(STORAGE_KEY);
    if (!draftString) {
      return null;
    }
    return JSON.parse(draftString);
  } catch (error) {
    console.error("加载草稿失败:", error);
    return null;
  }
};

/**
 * 删除本地存储的草稿
 * @returns 删除是否成功
 */
export const removeDraftFromLocalStorage = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("删除草稿失败:", error);
    return false;
  }
};

/**
 * 检查是否存在草稿
 * @returns 是否存在草稿
 */
export const hasDraftInStorage = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};

/**
 * 获取草稿保存时间
 * @returns 格式化的保存时间字符串
 */
export const getDraftSavedTime = (): string => {
  const draft = loadDraftFromLocalStorage();
  if (!draft) {
    return "";
  }
  return new Date(draft.savedAt).toLocaleString("zh-CN");
};

/**
 * 创建空白的表单数据
 * @returns 空白的表单数据对象
 */
export const createEmptyFormData = (): IBiddingFormData => ({
  basicInfo: {
    bidSubject: "",
    projectName: "",
    bidNumber: "",
    coverDate: null,
    equipmentName: "",
    projectOverview: "",
    deliveryDateType: "date",
    deliveryDate: null,
    deliveryDateText: "",
    deliveryLocation: "",
    qualificationRequirementType: ["option1"],
    qualificationRequirementOther: "",
    performanceRequirementType: "has",
    performanceYears: 5,
    performanceStartDate: null,
    performanceType: "",
    acceptAgentBid: "accept",
    acceptJointBid: undefined,
    issueSelectionType: [],
    bidDocumentFee: 1000,
    bidDocumentFeePaymentType: null,
    qualityIssueNote: "以招标人或上级单位供应商问题记录库为准",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
  },
  bidderInstructions: {
    evaluationMethodType: "comprehensive",
    capitalSourceAndRatio: "企业自筹，比例100%",
    qualityStandard: "",
    preMeetingRequired: undefined,
    preMeetingTime: null,
    preMeetingLocation: "",
    questionDeadlineTime: null,
    questionEmail: "",
    requireBidBond: null,
    bidBondAmount: null,
    bidBondForms: [],
    hasSpecialQualificationReq: null,
    specialQualificationRequirement: "",
    financialReportYears: null,
    recentProjectRequirementType: "not-applicable",
    recentProjectStartYear: null,
    recentProjectEndYear: null,
    recentProjectType: "",
    proofMaterialTypes: [],
    otherProofMaterial: "",
    proofMaterialRequirement: [],
    recentProjectOtherRequirements: "",
    litigationYears: null,
    litigationStartDate: null,
    allowAlternativeBidProposal: "not-allowed",
    requirePaperBidDocument: null,
    paperBidDocumentCopies: null,
    requireElectronicFile: null,
    requireSeparateBinding: null,
    authorizeCommitteeToConfirmWinner: null,
    requirePerformanceBond: "not-required",
    useElectronicBidding: null,
    performanceBondForms: [],
    performanceBondAmount: null,
    bankGuaranteeRequirements: [],
    negativeDeviationType: undefined,
    deviationRange: "",
    maxNegativeDeviationCount: null,
    noNegativeDeviationItems: [],
    noNegativeDeviationOtherText: "",
    clarificationSendTo: "",
    vatCalculationMethod: "",
    hasMaxBidPrice: null,
    maxBidPrice: null,
    bidValidity: null,
    abortBidWhenOverBudget: null,
    returnBidDocuments: null,
    returnBidDocumentsDate: null,
    conformityReviewItems: [],
  },
  comprehensiveScoring: {
    commercialScoring: {
      items: [],
    },
    technicalScoring: {
      items: [],
    },
    priceScoring: {
      items: [],
    },
  },
});
