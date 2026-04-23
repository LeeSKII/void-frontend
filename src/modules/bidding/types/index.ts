/**
 * 招标采购类型统一导出
 * @module modules/bidding/types
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
  JointBidType,
  AgentBidType,
  IssueSeverityType,
  IBasicInfo,
} from './form';

export type {
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
