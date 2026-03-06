/**
 * 枚举值中文映射常量
 * @module modules/bidding/constants/mappings
 */

/**
 * 招标主体选项映射（value → label）
 */
export const BID_SUBJECT_LABELS: Record<string, string> = {
  "company-main": "中冶长天国际工程有限责任公司",
  "company-subsidiary-a": "子公司A",
  "company-subsidiary-b": "子公司B",
  "company-subsidiary-c": "子公司C",
};

/**
 * 资质要求类型映射
 */
export const QUALIFICATION_REQUIREMENT_LABELS = {
  option1:
    "独立法人资格，持有有效的营业执照、基本账户开户许可证或基本存款账户信息表。",
  option3: "无",
} as const;

/**
 * 联合体投标映射
 */
export const ACCEPT_JOINT_BID_LABELS = {
  yes: "是",
  no: "否",
} as const;

/**
 * 代理商投标映射
 */
export const ACCEPT_AGENT_BID_LABELS = {
  accept: "接受",
  reject: "不接受",
} as const;

/**
 * 评标办法映射
 */
export const EVALUATION_METHOD_LABELS = {
  comprehensive: "综合评分法",
  "lowest-price": "经评审的最低价中标法",
} as const;

/**
 * 评标方法描述映射表
 */
export const EVALUATION_METHOD_DESCRIPTIONS = {
  comprehensive:
    "综合评分法。评标委员会对满足招标文件全部实质性的投标人，根据本章规定的评分标准进行打分，并按得分由高到低的顺序推荐中标候选人。",
  "lowest-price":
    "经评审的最低投标价法。评标委员会对满足招标文件实质性要求的投标文件，按照经评审的投标价由低到高的顺序推荐中标候选人。",
} as const;

/**
 * 评标汇总排序映射表
 */
export const EVALUATION_SUMMARY_RANKING = {
  comprehensive:
    "综合评分法：评标结果按评审后得分由高到低顺序排列。得分相同的，按投标报价由低到高顺序排列。综合评分相等时，以投标报价低的优先；投标报价也相等的，以技术得分高的优先；若技术得分也相等，以财务评审中近一年的净资产高的优先原则。",
  "lowest-price":
    "最低评标价法：评标结果按投标报价由低到高顺序排列。投标报价相同的，评标委员会按照财务评审中近一年的净资产高的优先原则。",
} as const;

/**
 * 详细评审映射表
 */
export const DETAILED_EVALUATION = {
  comprehensive:
    "综合评分法：分为投标报价评审、商务评审、技术评审（得分四舍五入保留两位小数）。",
  "lowest-price": "最低评标价法：无。",
} as const;

/**
 * 资格审查方式映射
 */
export const QUALIFICATION_METHOD_LABELS = {
  "post-review": "资格后审",
  "pre-review": "资格预审",
} as const;

/**
 * 财务状况要求映射
 */
export const FINANCIAL_STATUS_REQUIREMENT_LABELS = {
  "not-applicable": "不适用",
  "applicable-one-year":
    "投标人应提供经会计事务所或审计机构审计的上一年度财务报表",
} as const;

/**
 * 近年项目要求映射
 */
export const RECENT_PROJECT_REQUIREMENT_LABELS = {
  "not-applicable": "不适用",
} as const;

/**
 * 备选投标方案映射
 */
export const ALLOW_ALTERNATIVE_BID_LABELS = {
  "not-allowed": "不允许",
  allowed: "允许",
} as const;

/**
 * 中小企业映射
 */
export const IS_SMALL_MEDIUM_ENTERPRISE_LABELS = {
  yes: "是",
  no: "否",
} as const;

/**
 * 投标保证金形式映射
 */
export const BID_BOND_FORM_LABELS: Record<string, string> = {
  "bank-transfer": "银行现汇",
  "commitment-letter": "保证金承诺函",
};

/**
 * 履约保证金形式映射
 */
export const PERFORMANCE_BOND_FORM_LABELS: Record<string, string> = {
  "bank-guarantee": "银行保函",
  cash: "现金",
  check: "支票",
  other: "其他",
};

/**
 * 银行保函要求映射
 */
export const BANK_GUARANTEE_REQUIREMENT_LABELS: Record<string, string> = {
  "no-restriction": "无限制",
  "branch-or-above": "应由支行及以上国有或股份制商业银行",
};

/**
 * 业绩证明材料类型映射
 */
export const PROOF_MATERIAL_LABELS: Record<string, string> = {
  contract: "合同/订单",
  "bid-notice": "中标通知书/成交通知书",
  "acceptance-report": "竣工验收报告/验收证明",
  "owner-proof": "业主证明",
};

/**
 * 不允许负偏离项映射
 */
export const NO_NEGATIVE_DEVIATION_LABELS: Record<string, string> = {
  "payment-terms": "付款条件",
  "delivery-date": "交货期",
  "delivery-location": "交货地点",
  "external-brand": "技术文件中约定的外购件品牌",
  "supply-scope": "供货范围",
  "bid-validity": "投标有效期",
  "quality-warranty": "质保期",
  "equipment-specs": "设备规格型号及主要参数",
  "technical-asterisk": "技术文件中带*号项",
};
