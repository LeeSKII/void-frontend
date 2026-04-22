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
 * 生成模拟的完整表单数据
 * @param baseData 基础数据
 * @returns 完整的表单数据
 */
const createMockFormData = (baseData: {
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
    projectOverview: "",
    deliveryDateType: "date",
    deliveryDate: baseData.coverDate + 30 * 24 * 60 * 60 * 1000, // 30天后
    deliveryDateText: "",
    deliveryLocation: "北京市海淀区",
    qualificationRequirementType: ["option1"],
    qualificationRequirementOther: "",
    performanceRequirementType: "has",
    performanceYears: 5,
    performanceStartDate: null,
    performanceType: "设备采购",
    acceptAgentBid: "accept",
    acceptJointBid: undefined,
    issueSelectionType: ["major", "serious"],
    bidDocumentFee: 1000,
    bidDocumentFeePaymentType: null,
    qualityIssueNote: "以招标人或上级单位供应商问题记录库为准",
    contactPerson: "张经理",
    contactPhone: "010-12345678",
    contactEmail: "zhang@example.com",
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
    requireBidBond: true,
    bidBondAmount: 50000,
    bidBondForms: ["wire-transfer", "bank-guarantee"],
    hasSpecialQualificationReq: false,
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
    noNegativeDeviationItems: [
      "payment-terms",
      "delivery-date",
      "delivery-location",
      "supply-scope",
      "bid-validity",
      "quality-warranty",
    ],
    noNegativeDeviationOtherText: "",
    clarificationSendTo: "",
    vatCalculationMethod: "",
    hasMaxBidPrice: true,
    maxBidPrice: 1000000,
    bidValidity: null,
    abortBidWhenOverBudget: "yes",
    returnBidDocuments: null,
    returnBidDocumentsDate: null,
    conformityReviewItems: [
      {
        index: 1,
        reviewFactor: "营业执照",
        reviewStandard: "提供有效的营业执照副本",
      },
      {
        index: 2,
        reviewFactor: "资质证书",
        reviewStandard: "提供相关资质证书",
      },
    ],
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
 * 模拟历史项目数据
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
    formData: createMockFormData({
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
    formData: createMockFormData({
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
    formData: createMockFormData({
      projectName: "智能化生产线升级项目",
      bidNumber: "ZYCT-2024-003",
      bidSubject: "company-main",
      coverDate: new Date("2024-03-10").getTime(),
      equipmentName: "自动化生产线设备",
    }),
  },
  {
    id: "project_004",
    bidSubject: "company-subsidiary-b",
    projectName: "能源管理系统建设项目",
    bidNumber: "ZYCT-2024-004",
    coverDate: new Date("2024-04-05").getTime(),
    equipmentName: "能源监控设备",
    createdAt: new Date("2024-03-28").getTime(),
    formData: createMockFormData({
      projectName: "能源管理系统建设项目",
      bidNumber: "ZYCT-2024-004",
      bidSubject: "company-subsidiary-b",
      coverDate: new Date("2024-04-05").getTime(),
      equipmentName: "能源监控设备",
    }),
  },
  {
    id: "project_005",
    bidSubject: "company-subsidiary-c",
    projectName: "物料输送系统改造项目",
    bidNumber: "ZYCT-2024-005",
    coverDate: new Date("2024-05-12").getTime(),
    equipmentName: "带式输送机系统",
    createdAt: new Date("2024-05-08").getTime(),
    formData: createMockFormData({
      projectName: "物料输送系统改造项目",
      bidNumber: "ZYCT-2024-005",
      bidSubject: "company-subsidiary-c",
      coverDate: new Date("2024-05-12").getTime(),
      equipmentName: "带式输送机系统",
    }),
  },
  {
    id: "project_006",
    bidSubject: "company-main",
    projectName: "热处理车间设备更新项目",
    bidNumber: "ZYCT-2024-006",
    coverDate: new Date("2024-06-18").getTime(),
    equipmentName: "热处理炉设备",
    createdAt: new Date("2024-06-12").getTime(),
    formData: createMockFormData({
      projectName: "热处理车间设备更新项目",
      bidNumber: "ZYCT-2024-006",
      bidSubject: "company-main",
      coverDate: new Date("2024-06-18").getTime(),
      equipmentName: "热处理炉设备",
    }),
  },
  {
    id: "project_007",
    bidSubject: "company-subsidiary-a",
    projectName: "仓储物流自动化改造项目",
    bidNumber: "ZYCT-2024-007",
    coverDate: new Date("2024-07-22").getTime(),
    equipmentName: "智能仓储系统",
    createdAt: new Date("2024-07-18").getTime(),
    formData: createMockFormData({
      projectName: "仓储物流自动化改造项目",
      bidNumber: "ZYCT-2024-007",
      bidSubject: "company-subsidiary-a",
      coverDate: new Date("2024-07-22").getTime(),
      equipmentName: "智能仓储系统",
    }),
  },
  {
    id: "project_008",
    bidSubject: "company-main",
    projectName: "质量检测中心设备采购",
    bidNumber: "ZYCT-2024-008",
    coverDate: new Date("2024-08-30").getTime(),
    equipmentName: "无损检测设备",
    createdAt: new Date("2024-08-25").getTime(),
    formData: createMockFormData({
      projectName: "质量检测中心设备采购",
      bidNumber: "ZYCT-2024-008",
      bidSubject: "company-main",
      coverDate: new Date("2024-08-30").getTime(),
      equipmentName: "无损检测设备",
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
