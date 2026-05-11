/**
 * 草稿管理服务
 * @module modules/bidding/shared/services/draft
 */

import type {
  IBiddingFormData,
  IDraftData,
  IHistoryProject,
} from '../types';

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

/**
 * 已保存项目列表存储键名
 */
const SAVED_PROJECTS_KEY = "bidding_saved_projects";

/**
 * 将当前表单保存为项目到 localStorage
 * 以招标编号为唯一键，同编号的项目会覆盖
 * @param formData 用户填写的完整表单数据
 * @returns 保存是否成功
 */
export const saveProjectToLocalStorage = (
  formData: IBiddingFormData,
): boolean => {
  try {
    const bidNumber = formData.basicInfo.bidNumber;
    if (!bidNumber) {
      console.error("保存项目失败: 招标编号不能为空");
      return false;
    }

    // 读取现有项目列表
    const existingData = localStorage.getItem(SAVED_PROJECTS_KEY);
    const projectsMap: Record<string, IHistoryProject> = existingData
      ? JSON.parse(existingData)
      : {};

    // 以招标编号为键，覆盖或新增
    projectsMap[bidNumber] = {
      id: bidNumber,
      bidSubject: formData.basicInfo.bidSubject,
      projectName: formData.basicInfo.projectName,
      bidNumber: bidNumber,
      coverDate: formData.basicInfo.coverDate,
      equipmentName: formData.basicInfo.equipmentName,
      createdAt: Date.now(),
      formData: JSON.parse(JSON.stringify(formData)),
    };

    localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(projectsMap));
    return true;
  } catch (error) {
    console.error("保存项目失败:", error);
    return false;
  }
};

/**
 * 从 localStorage 加载已保存的项目列表
 * @returns 已保存的项目列表
 */
export const loadSavedProjectsFromLocalStorage = (): IHistoryProject[] => {
  try {
    const data = localStorage.getItem(SAVED_PROJECTS_KEY);
    if (!data) return [];
    const projectsMap: Record<string, IHistoryProject> = JSON.parse(data);
    return Object.values(projectsMap);
  } catch (error) {
    console.error("加载保存的项目列表失败:", error);
    return [];
  }
};

/**
 * 清除 localStorage 中的已保存项目列表
 * @returns 清除是否成功
 */
export const clearSavedProjectsFromLocalStorage = (): boolean => {
  try {
    localStorage.removeItem(SAVED_PROJECTS_KEY);
    return true;
  } catch (error) {
    console.error("清除保存的项目列表失败:", error);
    return false;
  }
};

/**
 * 根据招标编号删除已保存的项目
 * @param bidNumber 招标编号
 * @returns 删除是否成功
 */
export const deleteSavedProjectByBidNumber = (bidNumber: string): boolean => {
  try {
    const data = localStorage.getItem(SAVED_PROJECTS_KEY);
    if (!data) return true;
    const projectsMap: Record<string, IHistoryProject> = JSON.parse(data);
    delete projectsMap[bidNumber];
    localStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify(projectsMap));
    return true;
  } catch (error) {
    console.error("删除保存的项目失败:", error);
    return false;
  }
};

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
