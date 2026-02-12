/**
 * 招标采购表单相关工具函数
 * @module utils/bidding
 */

import type {
  IBiddingFormData,
  IDraftData,
  ISubmitResponse,
  IUploadResponse,
} from "@/types/bidding";

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
    deliveryDateType: "date",
    deliveryDate: null,
    deliveryDateText: "",
    deliveryLocation: "",
    bidScope: "",
    qualificationRequirementType: "option1",
    qualificationRequirementOther: "",
    financialRequirementType: "has",
    financialRequirementContent: "",
    performanceRequirementType: "has",
    performanceYears: 5,
    performanceType: "",
    performanceCount: 1,
    acceptJointBid: "no",
    acceptAgentBid: "accept",
    issueSelectionType: "all",
    qualityIssueNote: "以招标人或上级单位供应商问题记录库为准",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
  },
  bidderInstructions: {
    bidSectionCount: null,
    evaluationMethodType: "comprehensive",
    requireBidBond: null,
    bidBondAmount: null,
    bidBondForms: [],
    qualificationMethod: "post-review",
    hasSpecialQualificationReq: null,
    specialQualificationRequirement: "",
    financialStatusRequirement: "not-applicable",
    financialReportYears: null,
    recentProjectRequirementType: "not-applicable",
    recentProjectStartYear: null,
    recentProjectEndYear: null,
    recentProjectType: "",
    proofMaterialTypes: [],
    otherProofMaterial: "",
    proofMaterialRequirement: [],
    recentProjectOtherRequirements: "",
    allowAlternativeBidProposal: "not-allowed",
    recommendedCandidateCount: null,
    requirePerformanceBond: "not-required",
    performanceBondForms: [],
    performanceBondAmount: null,
    bankGuaranteeRequirements: [],
    noNegativeDeviationItems: [],
    hasMaxBidPrice: null,
    maxBidPrice: null,
    requireBidDocumentFee: null,
    bidDocumentFeeAmount: null,
    bidDocumentFeeForms: [],
    abortBidWhenOverBudget: null,
    isSmallMediumEnterprise: "yes",
  },
  commercialTerms: {
    paymentMethod: "one-time",
    paymentRatio: "",
    paymentTerms: "",
    invoiceType: "vat-special",
    taxRate: null,
    performanceBond: null,
    penaltyRate: null,
    disputeResolution: "negotiation",
    contractDeadline: null,
    allowSubcontract: null,
    subcontractLimit: "",
    commercialAttachments: [],
  },
  otherRequirements: {
    evaluationMethod: "comprehensive",
    scoringWeights: "",
    expertCount: null,
    publicityMedia: [],
    publicityPeriod: null,
    objectionHandling: "",
    specialInstructions: "",
    bidAnnouncement: "",
    relatedAttachments: [],
  },
});

/**
 * 提交招标表单到后端
 * @param formData 表单数据
 * @returns 提交结果
 */
export const submitBiddingForm = async (
  formData: IBiddingFormData,
): Promise<ISubmitResponse> => {
  try {
    // TODO: 替换为实际的 API 地址
    const apiUrl = "/napi/bidding/submit";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ISubmitResponse = await response.json();
    return result;
  } catch (error) {
    console.error("提交表单失败:", error);
    throw error;
  }
};

/**
 * 上传文件到服务器
 * @param file 文件对象
 * @returns 上传结果，包含文件URL
 */
export const uploadFile = async (file: File): Promise<IUploadResponse> => {
  try {
    // TODO: 替换为实际的 API 地址
    const apiUrl = "/napi/bidding/upload";

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: IUploadResponse = await response.json();
    return result;
  } catch (error) {
    console.error("上传文件失败:", error);
    throw error;
  }
};

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

/**
 * 验证招标编号格式
 * @param bidNumber 招标编号
 * @returns 是否有效
 */
export const validateBidNumber = (bidNumber: string): boolean => {
  const bidNumberRegex = /^[A-Za-z0-9]{10,20}$/;
  return bidNumberRegex.test(bidNumber);
};

/**
 * 格式化金额显示
 * @param amount 金额（万元）
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

/**
 * 获取步骤名称
 * @param step 步骤编号
 * @returns 步骤名称
 */
export const getStepName = (step: number): string => {
  const names = ["", "基础信息", "投标人须知", "商务条款", "其他要求"];
  return names[step] || "";
};

/**
 * 获取今日开始时间戳（用于日期默认值）
 * @returns 今日0点的时间戳
 */
export const getTodayTimestamp = (): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
};
