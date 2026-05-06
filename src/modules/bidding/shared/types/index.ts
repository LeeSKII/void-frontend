/**
 * 招标采购共享类型定义
 * @module modules/bidding/shared/types
 */

// 通用类型
export type {
  ISelectOption,
  IApiResponse,
} from './common';

// 表单类型
export type {
  BidMethod,
  ProcurementType,
  QualificationRequirementOption,
  PerformanceRequirementType,
  AgentBidType,
  JointBidType,
  IssueSeverityType,
  IBasicInfo,
  RecentProjectRequirementType,
  ProofMaterialType,
  ProofMaterialRequirementType,
  AlternativeBidProposalType,
  PerformanceBondRequirementType,
  PerformanceBondFormType,
  BankGuaranteeRequirementType,
  NoNegativeDeviationType,
  IScoringItem,
  IScoringTable,
  IComprehensiveScoring,
  IBidderInstructions,
  IBiddingFormData,
  IDraftData,
  ISubmitResponse,
  IUploadResponse,
  IHistoryProject,
  IHistoryProjectListResponse,
  HistoryProjectSortType,
} from './form';

// 导出类型
export type {
  IScoringItemData,
  IWordTemplateData,
  IExportOptions,
  IExportResult,
} from './export';
