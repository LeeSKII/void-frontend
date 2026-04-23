/**
 * Word 导出功能相关类型定义
 * @module types/bidding-export
 */

/**
 * 评分项数据接口（用于 Word 导出）
 */
export interface IScoringItemData {
  /** 序号（从1开始的整数） */
  index: number;
  /** 唯一标识（时间戳） */
  id: number;
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
  /** 项目概况 */
  projectOverview: string;
  /** 交货期 */
  deliveryDate: string;
  /** 交货地点 */
  deliveryLocation: string;
  /** 资质要求 */
  qualificationRequirement: string;
  /** 业绩要求 */
  performanceRequirement: string;
  /** 本次招标是否接受代理商投标（"接受"/"不接受"） */
  acceptAgentBid: string;
  /** 本次招标是否接受联合体投标（"是"/"否"） */
  acceptJointBid: string;
  /** 本次招标是否接受联合体投标（"接受"/"不接受"）- 简单版本 */
  acceptJointBidSimple: string;
  /** 质量问题说明 */
  qualityIssueNote: string;
  /** 未在招标人或上级单位发生过质量问题（重大/严重） */
  issueSelectionType: string;
  /** 本项目招标文件每套售价（元） */
  bidDocumentFee: string;
  /** 支付形式 */
  bidDocumentFeePaymentType: string;
  /** 联系人 */
  contactPerson: string;
  /** 联系电话 */
  contactPhone: string;
  /** 联系邮箱 */
  contactEmail: string;

  // ============ 投标人须知 ============
  /** 评标办法（"综合评分法"/"经评审的最低价中标法"） */
  evaluationMethod: string;
  /** 资金来源及比例 */
  capitalSourceAndRatio: string;
  /** 质量标准 */
  qualityStandard: string;
  /** 投标预备会 */
  preMeetingRequirement: string;
  /** 投标人在投标预备会前提出问题 */
  preMeetingQuestionDeadline: string;
  /** 评标方法描述（根据评标办法生成的完整描述） */
  evaluationMethodDescription: string;
  /** 投标保证金要求 */
  bidBondRequirement: string;
  /** 资格审查资料特殊要求 */
  specialQualificationRequirement: string;
  /** 财务状况要求 */
  financialStatusRequirement: string;
  /** 近年完成的类似项目情况要求 */
  recentProjectRequirement: string;
  /** 近年发生的诉讼及仲裁情况的时间要求 */
  litigationRequirement: string;
  /** 是否允许递交备选投标方案（"不允许"/"允许"） */
  allowAlternativeBid: string;
  /** 纸质投标文件要求 */
  paperBidDocumentRequirement: string;
  /** 是否授权评标委员会确定中标人 */
  authorizeCommitteeToConfirmWinner: string;
  /** 履约保证金要求 */
  performanceBondRequirement: string;
  /** 负偏差 */
  negativeDeviation: string;
  /** 投标文件不允许负偏离项（逗号分隔） */
  noNegativeDeviationItems: string;
  /** 投标人要求澄清招标文件 */
  clarificationRequirement: string;
  /** 增值税税金的计算方法 */
  vatCalculationMethod: string;
  /** 最高投标限价 */
  maxBidPrice: string;
  /** 投标有效期（天） */
  bidValidity: string;
  /** 评标汇总排序（根据评标办法生成的排序规则描述） */
  evaluationSummaryRanking: string;
  /** 详细评审（根据评标办法生成的评审内容描述） */
  detailedEvaluation: string;
  /** 中标价高于预算金额时是否废标（"是"/"否"） */
  abortBidWhenOverBudget: string;
  /** 投标文件是否退还 */
  returnBidDocuments: string;
  /** 是否采用电子招标投标 */
  useElectronicBidding: string;

  // ============ 综合评分法总分 ============
  /** 商务评分值（所有商务评分项的分数总和） */
  commercialScoreTotal: string;
  /** 技术评分值（所有技术评分项的分数总和） */
  technicalScoreTotal: string;
  /** 价格评分值（所有价格评分项的分数总和） */
  priceScoreTotal: string;

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
