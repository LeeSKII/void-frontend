/**
 * 招标采购模拟数据服务
 * @module modules/bidding/services/mock
 */

import type {
  IBiddingFormData,
  IHistoryProject,
  HistoryProjectSortType,
} from "@/modules/bidding/types";

/**
 * 生成模拟的完整表单数据（综合评分法版本）
 * @param baseData 基础数据
 * @returns 完整的表单数据
 */
const createMockFormDataComprehensive = (baseData: {
  projectName: string;
  bidNumber: string;
  bidSubject: string;
  coverDate: number;
  equipmentName: string;
}): IBiddingFormData => ({
  basicInfo: {
    bidSubject: baseData.bidSubject,
    projectName: baseData.projectName,
    bidNumber: baseData.bidNumber,
    coverDate: baseData.coverDate,
    equipmentName: baseData.equipmentName,
    projectOverview:
      "本项目为钢铁厂烧结设备采购项目，位于北京市海淀区，项目规模为年产200万吨烧结矿，建设工期约12个月。",
    deliveryDateType: "date",
    deliveryDate: baseData.coverDate + 60 * 24 * 60 * 60 * 1000,
    deliveryDateText: "",
    deliveryLocation: "北京市海淀区",
    qualificationRequirementType: ["option1"],
    qualificationRequirementOther: "",
    performanceRequirementType: "has",
    performanceYears: 5,
    performanceStartDate: baseData.coverDate - 5 * 365 * 24 * 60 * 60 * 1000,
    performanceType: "烧结机设备供货业绩",
    acceptAgentBid: "accept",
    acceptJointBid: "reject",
    issueSelectionType: ["major", "serious"],
    bidDocumentFee: 1000,
    bidDocumentFeePaymentType: "bank",
    qualityIssueNote: "以招标人或上级单位供应商问题记录库为准",
    contactPerson: "张经理",
    contactPhone: "010-12345678",
    contactEmail: "zhang@example.com",
  },
  bidderInstructions: {
    evaluationMethodType: "comprehensive",
    capitalSourceAndRatio: "企业自筹，比例100%",
    qualityStandard: "符合国家及行业相关标准",
    preMeetingRequired: "yes",
    preMeetingTime: baseData.coverDate - 7 * 24 * 60 * 60 * 1000,
    preMeetingLocation: "北京市海淀区中冶长天大厦10层会议室",
    questionDeadlineTime: baseData.coverDate - 3 * 24 * 60 * 60 * 1000,
    questionEmail: "bidding@example.com",
    requireBidBond: true,
    bidBondAmount: 50000,
    bidBondForms: ["wire-transfer", "bank-guarantee"],
    hasSpecialQualificationReq: false,
    specialQualificationRequirement: "",
    financialReportYears: 3,
    recentProjectRequirementType: "applicable",
    recentProjectStartYear: 2019,
    recentProjectEndYear: 2024,
    recentProjectType: "烧结机或类似冶金设备供货业绩",
    proofMaterialTypes: ["contract", "bid-notice", "acceptance-report"],
    otherProofMaterial: "",
    proofMaterialRequirement: ["any"],
    recentProjectOtherRequirements: "供应商应具有完善的售后服务体系",
    litigationYears: 5,
    litigationStartDate: baseData.coverDate - 5 * 365 * 24 * 60 * 60 * 1000,
    allowAlternativeBidProposal: "not-allowed",
    requirePaperBidDocument: true,
    paperBidDocumentCopies: 5,
    requireElectronicFile: true,
    requireSeparateBinding: true,
    authorizeCommitteeToConfirmWinner: "yes",
    requirePerformanceBond: "required",
    useElectronicBidding: "yes",
    performanceBondForms: ["cash", "bank-guarantee"],
    performanceBondAmount: 10,
    bankGuaranteeRequirements: ["branch-or-above"],
    negativeDeviationType: "not-allowed",
    deviationRange: "",
    maxNegativeDeviationCount: null,
    noNegativeDeviationItems: [
      "payment-terms",
      "delivery-date",
      "delivery-location",
      "supply-scope",
      "bid-validity",
      "quality-warranty",
      "equipment-specs",
    ],
    noNegativeDeviationOtherText: "",
    clarificationSendTo: "bidding@example.com",
    vatCalculationMethod: "增值税税金按国家税法规定计算",
    hasMaxBidPrice: true,
    maxBidPrice: 10000000,
    bidValidity: 90,
    abortBidWhenOverBudget: "yes",
    returnBidDocuments: "no",
    returnBidDocumentsDate: null,
  },
  comprehensiveScoring: {
    commercialScoring: {
      items: [
        {
          index: 1,
          itemName: "投标报价",
          score: 30,
          scoringStandard: "以最低有效报价为基准分，每高出1%扣1分",
        },
        {
          index: 2,
          itemName: "付款方式",
          score: 10,
          scoringStandard: "符合招标文件要求的得满分，否则不得分",
        },
        {
          index: 3,
          itemName: "企业资质",
          score: 10,
          scoringStandard: "具有相关资质认证的得满分",
        },
      ],
    },
    technicalScoring: {
      items: [
        {
          index: 1,
          itemName: "技术方案",
          score: 40,
          scoringStandard: "方案完整、可行，得满分",
        },
        {
          index: 2,
          itemName: "设备性能",
          score: 30,
          scoringStandard: "满足技术要求得满分",
        },
        {
          index: 3,
          itemName: "售后服务",
          score: 10,
          scoringStandard: "售后服务方案完善的得满分",
        },
      ],
    },
    priceScoring: {
      items: [
        {
          index: 1,
          itemName: "价格评分",
          score: 100,
          scoringStandard: "满足招标文件要求的最低报价得满分",
        },
      ],
    },
  },
});

/**
 * 生成模拟的完整表单数据（最低价中标法版本）
 * @param baseData 基础数据
 * @returns 完整的表单数据
 */
const createMockFormDataLowestPrice = (baseData: {
  projectName: string;
  bidNumber: string;
  bidSubject: string;
  coverDate: number;
  equipmentName: string;
}): IBiddingFormData => ({
  basicInfo: {
    bidSubject: baseData.bidSubject,
    projectName: baseData.projectName,
    bidNumber: baseData.bidNumber,
    coverDate: baseData.coverDate,
    equipmentName: baseData.equipmentName,
    projectOverview:
      "本项目为环保升级改造工程设备采购，位于河北省唐山市，项目规模为日处理废气100万立方米。",
    deliveryDateType: "text",
    deliveryDate: null,
    deliveryDateText: "合同签订后45日内",
    deliveryLocation: "河北省唐山市",
    qualificationRequirementType: ["option1", "option2"],
    qualificationRequirementOther: "",
    performanceRequirementType: "has",
    performanceYears: 3,
    performanceStartDate: baseData.coverDate - 3 * 365 * 24 * 60 * 60 * 1000,
    performanceType: "环保设备供货业绩",
    acceptAgentBid: "reject",
    acceptJointBid: "reject",
    issueSelectionType: ["serious"],
    bidDocumentFee: 500,
    bidDocumentFeePaymentType: "cash",
    qualityIssueNote: "以招标人或上级单位供应商问题记录库为准",
    contactPerson: "李经理",
    contactPhone: "010-87654321",
    contactEmail: "li@example.com",
  },
  bidderInstructions: {
    evaluationMethodType: "lowest-price",
    capitalSourceAndRatio: "企业自筹，比例100%",
    qualityStandard: "符合国家环保标准",
    preMeetingRequired: "no",
    preMeetingTime: null,
    preMeetingLocation: "",
    questionDeadlineTime: null,
    questionEmail: "",
    requireBidBond: true,
    bidBondAmount: 30000,
    bidBondForms: ["wire-transfer"],
    hasSpecialQualificationReq: true,
    specialQualificationRequirement: "供应商需具有ISO14001环境管理体系认证",
    financialReportYears: 2,
    recentProjectRequirementType: "applicable",
    recentProjectStartYear: 2021,
    recentProjectEndYear: 2024,
    recentProjectType: "除尘设备系统供货业绩",
    proofMaterialTypes: ["contract", "acceptance-report", "owner-proof"],
    otherProofMaterial: "",
    proofMaterialRequirement: ["all"],
    recentProjectOtherRequirements: "",
    litigationYears: 3,
    litigationStartDate: baseData.coverDate - 3 * 365 * 24 * 60 * 60 * 1000,
    allowAlternativeBidProposal: "allowed",
    requirePaperBidDocument: false,
    paperBidDocumentCopies: null,
    requireElectronicFile: null,
    requireSeparateBinding: null,
    authorizeCommitteeToConfirmWinner: "no",
    requirePerformanceBond: "required",
    useElectronicBidding: "yes",
    performanceBondForms: ["bank-guarantee"],
    performanceBondAmount: 5,
    bankGuaranteeRequirements: ["no-restriction"],
    negativeDeviationType: "allowed",
    deviationRange: "5%",
    maxNegativeDeviationCount: 3,
    noNegativeDeviationItems: [
      "payment-terms",
      "delivery-date",
      "technical-asterisk",
    ],
    noNegativeDeviationOtherText: "",
    clarificationSendTo: "bidding2@example.com",
    vatCalculationMethod: "增值税税金按国家税法规定计算",
    hasMaxBidPrice: false,
    maxBidPrice: null,
    bidValidity: 120,
    abortBidWhenOverBudget: "no",
    returnBidDocuments: "yes",
    returnBidDocumentsDate: baseData.coverDate + 30 * 24 * 60 * 60 * 1000,
  },
  comprehensiveScoring: undefined,
});

/**
 * 生成模拟的完整表单数据（无保证金版本）
 * @param baseData 基础数据
 * @returns 完整的表单数据
 */
const createMockFormDataNoBond = (baseData: {
  projectName: string;
  bidNumber: string;
  bidSubject: string;
  coverDate: number;
  equipmentName: string;
}): IBiddingFormData => ({
  basicInfo: {
    bidSubject: baseData.bidSubject,
    projectName: baseData.projectName,
    bidNumber: baseData.bidNumber,
    coverDate: baseData.coverDate,
    equipmentName: baseData.equipmentName,
    projectOverview:
      "本项目为智能化生产线升级项目，位于上海市浦东新区，引进先进自动化控制系统。",
    deliveryDateType: "date",
    deliveryDate: baseData.coverDate + 90 * 24 * 60 * 60 * 1000,
    deliveryDateText: "",
    deliveryLocation: "上海市浦东新区",
    qualificationRequirementType: ["option1"],
    qualificationRequirementOther: "",
    performanceRequirementType: "none",
    performanceYears: 0,
    performanceStartDate: null,
    performanceType: "",
    acceptAgentBid: "accept",
    acceptJointBid: "accept",
    issueSelectionType: ["major", "serious"],
    bidDocumentFee: 2000,
    bidDocumentFeePaymentType: "bank",
    qualityIssueNote: "以招标人或上级单位供应商问题记录库为准",
    contactPerson: "王经理",
    contactPhone: "021-12345678",
    contactEmail: "wang@example.com",
  },
  bidderInstructions: {
    evaluationMethodType: "comprehensive",
    capitalSourceAndRatio: "银行贷款+企业自筹",
    qualityStandard: "符合IEC及国家标准",
    preMeetingRequired: "yes",
    preMeetingTime: baseData.coverDate - 5 * 24 * 60 * 60 * 1000,
    preMeetingLocation: "上海市浦东新区张江高科大厦",
    questionDeadlineTime: baseData.coverDate - 3 * 24 * 60 * 60 * 1000,
    questionEmail: "bidding3@example.com",
    requireBidBond: false,
    bidBondAmount: null,
    bidBondForms: [],
    hasSpecialQualificationReq: false,
    specialQualificationRequirement: "",
    financialReportYears: 3,
    recentProjectRequirementType: "not-applicable",
    recentProjectStartYear: null,
    recentProjectEndYear: null,
    recentProjectType: "",
    proofMaterialTypes: [],
    otherProofMaterial: "",
    proofMaterialRequirement: [],
    recentProjectOtherRequirements: "",
    litigationYears: 3,
    litigationStartDate: baseData.coverDate - 3 * 365 * 24 * 60 * 60 * 1000,
    allowAlternativeBidProposal: "not-allowed",
    requirePaperBidDocument: true,
    paperBidDocumentCopies: 8,
    requireElectronicFile: true,
    requireSeparateBinding: false,
    authorizeCommitteeToConfirmWinner: "yes",
    requirePerformanceBond: "not-required",
    useElectronicBidding: "no",
    performanceBondForms: [],
    performanceBondAmount: null,
    bankGuaranteeRequirements: [],
    negativeDeviationType: "not-allowed",
    deviationRange: "",
    maxNegativeDeviationCount: null,
    noNegativeDeviationItems: [
      "payment-terms",
      "bid-validity",
      "quality-warranty",
      "technical-asterisk",
    ],
    noNegativeDeviationOtherText: "",
    clarificationSendTo: "bidding3@example.com",
    vatCalculationMethod: "含税价，税率按国家规定",
    hasMaxBidPrice: true,
    maxBidPrice: 8000000,
    bidValidity: 180,
    abortBidWhenOverBudget: "yes",
    returnBidDocuments: "yes",
    returnBidDocumentsDate: baseData.coverDate + 60 * 24 * 60 * 60 * 1000,
  },
  comprehensiveScoring: {
    commercialScoring: {
      items: [
        {
          index: 1,
          itemName: "投标报价",
          score: 40,
          scoringStandard: "最低报价得最高分",
        },
        {
          index: 2,
          itemName: "商务条款",
          score: 10,
          scoringStandard: "响应程度评分",
        },
      ],
    },
    technicalScoring: {
      items: [
        {
          index: 1,
          itemName: "技术方案",
          score: 30,
          scoringStandard: "方案完整性",
        },
        {
          index: 2,
          itemName: "设备配置",
          score: 20,
          scoringStandard: "配置合理性",
        },
      ],
    },
    priceScoring: {
      items: [
        {
          index: 1,
          itemName: "价格评分",
          score: 100,
          scoringStandard: "最低价满分",
        },
      ],
    },
  },
});

/**
 * 模拟历史项目数据（保留3个不同类型的项目）
 */
const mockHistoryProjects: IHistoryProject[] = [
  {
    id: "project_001",
    bidSubject: "company-main",
    projectName: "钢铁厂烧结设备采购项目",
    bidNumber: "ZYCT-2024-001",
    coverDate: new Date("2024-01-15").getTime(),
    equipmentName: "烧结机设备",
    createdAt: new Date("2024-01-10").getTime(),
    formData: createMockFormDataComprehensive({
      projectName: "钢铁厂烧结设备采购项目",
      bidNumber: "ZYCT-2024-001",
      bidSubject: "company-main",
      coverDate: new Date("2024-01-15").getTime(),
      equipmentName: "烧结机设备",
    }),
  },
  {
    id: "project_002",
    bidSubject: "company-subsidiary-a",
    projectName: "环保升级改造工程设备采购",
    bidNumber: "ZYCT-2024-002",
    coverDate: new Date("2024-02-20").getTime(),
    equipmentName: "除尘设备系统",
    createdAt: new Date("2024-02-15").getTime(),
    formData: createMockFormDataLowestPrice({
      projectName: "环保升级改造工程设备采购",
      bidNumber: "ZYCT-2024-002",
      bidSubject: "company-subsidiary-a",
      coverDate: new Date("2024-02-20").getTime(),
      equipmentName: "除尘设备系统",
    }),
  },
  {
    id: "project_003",
    bidSubject: "company-main",
    projectName: "智能化生产线升级项目",
    bidNumber: "ZYCT-2024-003",
    coverDate: new Date("2024-03-10").getTime(),
    equipmentName: "自动化生产线设备",
    createdAt: new Date("2024-03-05").getTime(),
    formData: createMockFormDataNoBond({
      projectName: "智能化生产线升级项目",
      bidNumber: "ZYCT-2024-003",
      bidSubject: "company-main",
      coverDate: new Date("2024-03-10").getTime(),
      equipmentName: "自动化生产线设备",
    }),
  },
];

/**
 * 获取模拟历史项目列表
 * @param searchKeyword 搜索关键词（可选）
 * @param sortBy 排序方式（可选）
 * @returns 历史项目列表
 */
export const getMockHistoryProjects = (
  searchKeyword?: string,
  sortBy?: HistoryProjectSortType,
): IHistoryProject[] => {
  let filteredProjects = [...mockHistoryProjects];

  // 搜索过滤
  if (searchKeyword && searchKeyword.trim()) {
    const keyword = searchKeyword.trim().toLowerCase();
    filteredProjects = filteredProjects.filter(
      (project) =>
        project.projectName.toLowerCase().includes(keyword) ||
        project.bidNumber.toLowerCase().includes(keyword) ||
        project.equipmentName.toLowerCase().includes(keyword),
    );
  }

  // 排序
  if (sortBy) {
    filteredProjects.sort((a, b) => {
      switch (sortBy) {
        case "date":
          // 按封面日期降序
          return (b.coverDate || 0) - (a.coverDate || 0);
        case "name":
          // 按项目名称升序
          return a.projectName.localeCompare(b.projectName, "zh-CN");
        case "bidNumber":
          // 按招标编号升序
          return a.bidNumber.localeCompare(b.bidNumber);
        default:
          return 0;
      }
    });
  }

  return filteredProjects;
};

/**
 * 根据ID获取历史项目详情
 * @param id 项目ID
 * @returns 项目详情，如果不存在则返回 null
 */
export const getMockHistoryProjectById = (
  id: string,
): IHistoryProject | null => {
  return mockHistoryProjects.find((project) => project.id === id) || null;
};

/**
 * 获取历史项目总数
 * @returns 项目总数
 */
export const getMockHistoryProjectCount = (): number => {
  return mockHistoryProjects.length;
};
