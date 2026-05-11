/**
 * 招标采购模拟数据服务
 * @module modules/bidding/shared/services/mock
 */

import type {
  IHistoryProject,
  HistoryProjectSortType,
} from "../types";
import { loadSavedProjectsFromLocalStorage } from "./draft";


/**
 * 模拟历史项目数据（仅保留惠东项目）
 */
const mockHistoryProjects: IHistoryProject[] = [
  {
    id: "project_004",
    bidSubject: "company-main",
    projectName: "惠东县平海镇寨头矿区380万立方米/年建筑用花岗岩矿开发项目",
    bidNumber: "HDZX-2024-001",
    coverDate: new Date("2024-04-01").getTime(),
    equipmentName: "喷雾抑尘系统",
    createdAt: new Date("2024-03-28").getTime(),
    formData: {
      basicInfo: {
        bidSubject: "company-main",
        projectName: "惠东县平海镇寨头矿区380万立方米/年建筑用花岗岩矿开发项目",
        bidNumber: "HDZX-2024-001",
        coverDate: new Date("2024-04-01").getTime(),
        equipmentName: "喷雾抑尘系统",
        projectOverview: "整体1标段",
        deliveryDateType: "text",
        deliveryDate: null,
        deliveryDateText: "按项目进度要求",
        deliveryLocation:
          "惠东县平海镇寨头矿区380万立方米/年建筑用花岗岩矿开发项目生产加工区EPC项目现场",
        qualificationRequirementType: ["option1"],
        qualificationRequirementOther: "",
        performanceRequirementType: "has",
        performanceYears: 3,
        performanceStartDate:
          new Date("2024-04-01").getTime() - 3 * 365 * 24 * 60 * 60 * 1000,
        performanceType: "喷雾抑尘系统供货业绩至少1个",
        acceptAgentBid: "reject",
        acceptJointBid: "reject",
        issueSelectionType: ["major", "serious"],
        bidDocumentFee: 500,
        bidDocumentFeePaymentType: "bank",
        qualityIssueNote: "以招标人或上级单位供应商问题记录库为准",
        contactPerson: "王孟龙",
        contactPhone: "18773153405",
        contactEmail: "1379032075@qq.com",
      },
      bidderInstructions: {
        evaluationMethodType: "comprehensive",
        capitalSourceAndRatio: "企业自筹，比例100%",
        qualityStandard: "见技术附件",
        preMeetingRequired: "no",
        preMeetingTime: null,
        preMeetingLocation: "",
        questionDeadlineTime: null,
        questionEmail: "",
        requireBidBond: true,
        bidBondAmount: 50000,
        bidBondForms: ["wire-transfer", "bank-guarantee"],
        hasSpecialQualificationReq: false,
        specialQualificationRequirement: "",
        financialReportYears: 3,
        recentProjectRequirementType: "applicable",
        recentProjectStartYear: 2021,
        recentProjectEndYear: 2024,
        recentProjectType: "喷雾抑尘系统供货业绩",
        proofMaterialTypes: ["contract", "bid-notice", "acceptance-report"],
        otherProofMaterial: "",
        proofMaterialRequirement: ["any"],
        recentProjectOtherRequirements: "",
        litigationYears: 3,
        litigationStartDate:
          new Date("2024-04-01").getTime() - 3 * 365 * 24 * 60 * 60 * 1000,
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
        clarificationSendTo: "1379032075@qq.com",
        vatCalculationMethod: "增值税税金按国家税法规定计算",
        hasMaxBidPrice: false,
        maxBidPrice: null,
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
              itemName: "标书响应性",
              score: 2,
              scoringStandard:
                "根据投标人的标书对于招标要求的响应情况酌情打分，最多得2分。如需通过线下补充资料的，根据资料的缺失情况扣0.5分。",
            },
            {
              index: 2,
              itemName: "经营业绩",
              score: 10,
              scoringStandard:
                "提供2022年9月（含）以来执行的喷雾抑尘系统业绩每1份得2分，最多得10分。提供的业绩必须为投标人自身的项目业绩的合同的扫描件（或复印件，价格可隐去），否则不计分，同一项目的补充合同不计为新的业绩（原件备查验）。",
            },
            {
              index: 3,
              itemName: "付款偏离",
              score: 5,
              scoringStandard: "正偏离或无偏离得5分，负偏离得0分。",
            },
          ],
        },
        technicalScoring: {
          items: [
            {
              index: 1,
              itemName: "产品配置及技术参数",
              score: 15,
              scoringStandard:
                "以招标文件为基准，根据投标方技术方案中产品选型、产品配置、生产工艺及技术参数的先进性、合理性、可靠性、能效比等合理打分。总体技术方案最优的得15分，次优的酌情得14-8分，技术方案存在问题的视问题情况得7-0分，或者废标。",
            },
            {
              index: 2,
              itemName: "交货保证",
              score: 3,
              scoringStandard:
                "根据交货保证措施及运输方案等综合打分，措施和方案完全符合要求得2分，基本符合得1-2分，没有交货保证措施或运输方案得0分。",
            },
            {
              index: 3,
              itemName: "售后服务",
              score: 3,
              scoringStandard:
                "根据免费维保期限、维修范围综合打分，通过对比，此项表现优秀得3分，良好得1-2分，不满足招标文件要求的得0分。",
            },
            {
              index: 4,
              itemName: "备品备件",
              score: 2,
              scoringStandard:
                "根据提供的清单，易损件使用寿命综合最长的得2分，其他的视时间长短得0.1-1.9分，未提交的不得分。",
            },
          ],
        },
        priceScoring: {
          items: [
            {
              index: 1,
              itemName: "投标报价",
              score: 60,
              scoringStandard:
                "1、投标报价总分60分。2、评分价=经评审（修正后）的投标价。3、基准价：如投标单位大于5家，则去掉一个最高价一个最低价，剩余投标单位投标报价评分价计算算术平均值下浮5%作为评标基准价；如投标单位小于等于5家，则全部参与计算算术平均值下浮5%作为评标基准价。4、与基准价相同得满分60分。评分价每高于基准价的1%扣1分，最多扣20分；评分价低于基准价的1%扣0.5分，最多扣10分。（每个计算分值不满下一个百分比的一律按上一个的百分比计算）",
            },
          ],
        },
      },
    },
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
  // 优先从 localStorage 读取已保存的项目列表
  const savedProjects = loadSavedProjectsFromLocalStorage();
  let filteredProjects = savedProjects.length > 0
    ? savedProjects
    : [...mockHistoryProjects];

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
