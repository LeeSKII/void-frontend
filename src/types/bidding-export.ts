/**
 * Word 导出功能相关类型定义
 * @module types/bidding-export
 */

/**
 * 评分项数据接口（用于 Word 导出）
 */
export interface IScoringItemData {
  /** 序号 */
  index: number;
  /** 指标分项名称 */
  itemName: string;
  /** 分值 */
  score: string;
  /** 打分标准 */
  scoringStandard: string;
}

/**
 * Word 模板数据接口
 * 用于映射表单数据到 Word 模板变量
 */
export interface IWordTemplateData {
  // ============ 基础信息 ============
  /** 招标主体 */
  bidSubject: string;
  /** 项目名称 */
  projectName: string;
  /** 招标编号 */
  bidNumber: string;
  /** 招标文件封面日期（中文格式，如：2024年1月1日） */
  coverDate: string;
  /** 采购设备名称 */
  equipmentName: string;
  /** 交货期 */
  deliveryDate: string;
  /** 交货地点 */
  deliveryLocation: string;
  /** 招标范围 */
  bidScope: string;
  /** 资质要求 */
  qualificationRequirement: string;
  /** 财务要求 */
  financialRequirement: string;
  /** 业绩要求 */
  performanceRequirement: string;
  /** 本次招标接受联合体投标（"是"/"否"） */
  acceptJointBid: string;
  /** 联合体投标具体要求 */
  jointBidRequirements: string;
  /** 本次招标是否接受代理商投标（"接受"/"不接受"） */
  acceptAgentBid: string;
  /** 质量问题说明 */
  qualityIssueNote: string;
  /** 联系人 */
  contactPerson: string;
  /** 联系电话 */
  contactPhone: string;
  /** 联系邮箱 */
  contactEmail: string;

  // ============ 投标人须知 ============
  /** 标段数量 */
  bidSectionCount: string;
  /** 评标办法（"综合评分法"/"经评审的最低价中标法"） */
  evaluationMethod: string;
  /** 投标保证金要求 */
  bidBondRequirement: string;
  /** 资格审查方式（"资格后审"/"资格预审"） */
  qualificationMethod: string;
  /** 资格审查资料特殊要求 */
  specialQualificationRequirement: string;
  /** 财务状况要求 */
  financialStatusRequirement: string;
  /** 近年完成的类似项目情况要求 */
  recentProjectRequirement: string;
  /** 是否允许递交备选投标方案（"不允许"/"允许"） */
  allowAlternativeBid: string;
  /** 评标委员会推荐中标候选人的人数 */
  recommendedCandidateCount: string;
  /** 履约保证金要求 */
  performanceBondRequirement: string;
  /** 投标文件不允许负偏离项（逗号分隔） */
  noNegativeDeviationItems: string;
  /** 最高投标限价 */
  maxBidPrice: string;
  /** 标书费 */
  bidDocumentFee: string;
  /** 中标价高于预算金额时是否废标（"是"/"否"） */
  abortBidWhenOverBudget: string;
  /** 投标人是否属于中小企业（"是"/"否"） */
  isSmallMediumEnterprise: string;

  // ============ 综合评分法（可选） ============
  /** 商务评分表项列表 */
  commercialScoringItems?: IScoringItemData[];
  /** 技术评分表项列表 */
  technicalScoringItems?: IScoringItemData[];
  /** 价格评分表项列表 */
  priceScoringItems?: IScoringItemData[];
}

/**
 * 导出配置接口
 */
export interface IExportOptions {
  /** 模板文件路径（相对于 public 目录） */
  templatePath: string;
  /** 输出文件名（不含扩展名） */
  outputFileName: string;
}

/**
 * 导出结果接口
 */
export interface IExportResult {
  /** 是否成功 */
  success: boolean;
  /** 错误信息（失败时） */
  error?: string;
}
