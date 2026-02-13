/**
 * 招标采购表单相关类型定义
 * @module types/bidding
 */

/**
 * 招标方式枚举
 */
export type BidMethod = "public" | "invitation" | "competitive";

/**
 * 采购类型枚举
 */
export type ProcurementType = "goods" | "services" | "construction";

/**
 * 资质要求类型
 */
export type QualificationRequirementType = "option1" | "option2" | "option3";

/**
 * 财务要求类型
 */
export type FinancialRequirementType = "has" | "none";

/**
 * 业绩要求类型
 */
export type PerformanceRequirementType = "has" | "none";

/**
 * 联合体投标类型
 */
export type JointBidType = "yes" | "no";

/**
 * 代理商投标类型
 */
export type AgentBidType = "accept" | "reject";

/**
 * 问题严重程度类型
 */
export type IssueSeverityType = "major" | "serious" | "all";
export interface IBasicInfo {
  /** 招标主体（公司或子公司） */
  bidSubject: string;
  /** 项目名称 */
  projectName: string;
  /** 招标编号 */
  bidNumber: string;
  /** 招标文件封面日期（时间戳） */
  coverDate: number | null;
  /** 采购设备名称 */
  equipmentName: string;
  /** 交货期类型 */
  deliveryDateType: "date" | "text";
  /** 交货期（日期模式，时间戳） */
  deliveryDate: number | null;
  /** 交货期（文本模式） */
  deliveryDateText: string;
  /** 交货地点 */
  deliveryLocation: string;
  /** 招标范围 */
  bidScope: string;
  /** 资质要求类型 */
  qualificationRequirementType: QualificationRequirementType;
  /** 资质要求其他内容 */
  qualificationRequirementOther: string;
  /** 财务要求类型 */
  financialRequirementType: FinancialRequirementType;
  /** 财务要求内容 */
  financialRequirementContent: string;
  /** 业绩要求类型 */
  performanceRequirementType: PerformanceRequirementType;
  /** 业绩年限 */
  performanceYears: number;
  /** 业绩类型 */
  performanceType: string;
  /** 业绩数量 */
  performanceCount: number;
  /** 本次招标接受联合体投标 */
  acceptJointBid: JointBidType;
  /** 本次招标是否接受代理商投标 */
  acceptAgentBid: AgentBidType;
  /** 未在招标人或上级单位发生过选择项 */
  issueSelectionType: IssueSeverityType;
  /** 质量问题说明 */
  qualityIssueNote: string;
  /** 联系人 */
  contactPerson: string;
  /** 联系电话 */
  contactPhone: string;
  /** 联系邮箱 */
  contactEmail: string;
}

/**
 * 财务状况要求类型
 */
export type FinancialStatusRequirement =
  | "not-applicable"
  | "applicable-one-year"
  | "applicable-recent-years";

/**
 * 近年完成的类似项目情况要求类型
 */
export type RecentProjectRequirementType = "not-applicable" | "applicable";

/**
 * 业绩证明材料类型
 */
export type ProofMaterialType =
  | "contract"
  | "bid-notice"
  | "acceptance-report"
  | "owner-proof"
  | "other";

/**
 * 业绩证明材料要求类型（多选）
 */
export type ProofMaterialRequirementType = "any" | "all";

/**
 * 备选投标方案类型
 */
export type AlternativeBidProposalType = "not-allowed" | "allowed";

/**
 * 履约保证金要求类型
 */
export type PerformanceBondRequirementType = "not-required" | "required";

/**
 * 履约保证金形式类型
 */
export type PerformanceBondFormType =
  | "bank-guarantee"
  | "cash"
  | "check"
  | "other";

/**
 * 银行保函要求类型
 */
export type BankGuaranteeRequirementType = "no-restriction" | "branch-or-above";

/**
 * 投标文件不允许负偏离项类型
 */
export type NoNegativeDeviationType =
  | "payment-terms"
  | "delivery-date"
  | "delivery-location"
  | "external-brand"
  | "supply-scope"
  | "bid-validity"
  | "quality-warranty"
  | "equipment-specs"
  | "technical-asterisk";

/**
 * 评分表项接口
 */
export interface IScoringItem {
  /** 唯一标识 */
  index: number;
  /** 指标分项名称 */
  itemName: string;
  /** 分值 */
  score: number | null;
  /** 打分标准 */
  scoringStandard: string;
}

/**
 * 评分表数据接口
 */
export interface IScoringTable {
  /** 评分项列表 */
  items: IScoringItem[];
}

/**
 * 综合评分法数据接口
 */
export interface IComprehensiveScoring {
  /** 商务评分表 */
  commercialScoring: IScoringTable;
  /** 技术评分表 */
  technicalScoring: IScoringTable;
  /** 价格评分表 */
  priceScoring: IScoringTable;
}

/**
 * 投标人须知接口
 */
export interface IBidderInstructions {
  /** 划分采购标段数量 */
  bidSectionCount: number | null;
  /** 评标办法类型 */
  evaluationMethodType: "comprehensive" | "lowest-price";
  /** 是否要求投标保证金 */
  requireBidBond: boolean | null;
  /** 保证金金额（万元） */
  bidBondAmount: number | null;
  /** 保证金形式 */
  bidBondForms: ("bank-transfer" | "commitment-letter")[];
  /** 资格审查方式 */
  qualificationMethod: "post-review" | "pre-review";
  /** 是否有资格审查资料特殊要求 */
  hasSpecialQualificationReq: boolean | null;
  /** 资格审查资料具体要求 */
  specialQualificationRequirement: string;
  /** 财务状况要求类型 */
  financialStatusRequirement: FinancialStatusRequirement;
  /** 财务报表年度数（当选择"适用-近年"时需要） */
  financialReportYears: number | null;
  /** 近年完成的类似项目情况要求类型 */
  recentProjectRequirementType: RecentProjectRequirementType;
  /** 起始年份（如：2020） */
  recentProjectStartYear: number | null;
  /** 截止年份（如：2024） */
  recentProjectEndYear: number | null;
  /** 类似项目描述 */
  recentProjectType: string;
  /** 业绩证明材料类型（多选） */
  proofMaterialTypes: ProofMaterialType[];
  /** 其他证明材料描述 */
  otherProofMaterial: string;
  /** 业绩证明材料要求类型（多选数组） */
  proofMaterialRequirement: ProofMaterialRequirementType[];
  /** 其他要求 */
  recentProjectOtherRequirements: string;
  /** 是否允许递交备选投标方案 */
  allowAlternativeBidProposal: AlternativeBidProposalType;
  /** 评标委员会推荐中标候选人的人数 */
  recommendedCandidateCount: number | null;
  /** 是否要求中标人提交履约保证金 */
  requirePerformanceBond: PerformanceBondRequirementType;
  /** 履约保证金形式（多选） */
  performanceBondForms: PerformanceBondFormType[];
  /** 履约保证金的金额（万元） */
  performanceBondAmount: number | null;
  /** 出具保函的银行要求（多选） */
  bankGuaranteeRequirements: BankGuaranteeRequirementType[];
  /** 投标文件需实质性响应招标文件，不允许负偏离项（多选） */
  noNegativeDeviationItems: NoNegativeDeviationType[];
  /** 是否有最高投标限价 */
  hasMaxBidPrice: boolean | null;
  /** 最高投标限价金额（万元） */
  maxBidPrice: number | null;
  /** 是否要求标书费 */
  requireBidDocumentFee: boolean | null;
  /** 标书费金额（元） */
  bidDocumentFeeAmount: number | null;
  /** 标书费的形式（多选） */
  bidDocumentFeeForms: ("bank-transfer" | "cash")[];
  /** 中标价高于预算金额时是否废标 */
  abortBidWhenOverBudget: "yes" | "no" | null;
  /** 投标人是否属于中小企业 */
  isSmallMediumEnterprise: "yes" | "no";
}

/**
 * 招标表单完整数据接口
 */
export interface IBiddingFormData {
  /** 基础信息 */
  basicInfo: IBasicInfo;
  /** 投标人须知 */
  bidderInstructions: IBidderInstructions;
  /** 综合评分法数据 */
  comprehensiveScoring?: IComprehensiveScoring;
}

/**
 * 下拉选项接口
 */
export interface ISelectOption {
  /** 选项值 */
  value: string | number;
  /** 选项标签 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
}

/**
 * 草稿数据接口
 */
export interface IDraftData {
  /** 表单数据 */
  formData: IBiddingFormData;
  /** 当前步骤 */
  currentStep: number;
  /** 保存时间 */
  savedAt: string;
}

/**
 * API 响应接口
 */
export interface IApiResponse<T = any> {
  /** 响应码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data?: T;
}

/**
 * 表单提交响应接口
 */
export interface ISubmitResponse extends IApiResponse {
  /** 提交成功的表单ID */
  data?: {
    /** 表单ID */
    id: string;
    /** 招标编号 */
    bidNumber: string;
  };
}

/**
 * 文件上传响应接口
 */
export interface IUploadResponse extends IApiResponse {
  /** 上传成功的文件信息 */
  data?: {
    /** 文件ID */
    id: string;
    /** 文件名 */
    name: string;
    /** 文件URL */
    url: string;
  };
}
