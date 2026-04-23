/**
 * 招标采购 Word 导出工具函数
 * @module modules/bidding/services/export
 */

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import ImageModule from "docxtemplater-image-module-free";
import type { IBiddingFormData } from "@/modules/bidding/types/form";
import type {
  IWordTemplateData,
  IExportOptions,
  IExportResult,
  IScoringItemData,
} from "@/modules/bidding/types/export";

/**
 * 加载本地二进制文件
 * @param url 文件路径（支持 file:// 协议或相对路径）
 * @param callback 回调函数
 */
function loadFile(
  url: string,
  callback: (error: Error | null, content: any) => void,
) {
  // 对中文文件名进行 URL 编码
  const encodedUrl = encodeURI(url);
  PizZipUtils.getBinaryContent(encodedUrl, callback);
}

/**
 * 默认输出文件名前缀
 */
export const DEFAULT_OUTPUT_PREFIX = "招标文件_";

/**
 * 招标主体选项映射（value → label）
 */
const BID_SUBJECT_LABELS: Record<string, string> = {
  "company-main": "中冶长天国际工程有限责任公司",
  "company-subsidiary-a": "子公司A",
  "company-subsidiary-b": "子公司B",
  "company-subsidiary-c": "子公司C",
};

/**
 * 枚举值中文映射表 - 资质要求类型
 */
const QUALIFICATION_REQUIREMENT_LABELS = {
  option1: "制造商",
  option2: "代理商",
  option3: "销售商",
} as const;

/**
 * 枚举值中文映射表 - 评标办法
 */
const EVALUATION_METHOD_LABELS = {
  comprehensive: "综合评分法",
  "lowest-price": "经评审的最低价中标法",
} as const;

/**
 * 评标方法描述映射表
 */
const EVALUATION_METHOD_DESCRIPTIONS = {
  comprehensive:
    "综合评分法。评标委员会对满足招标文件全部实质性的投标人，根据本章规定的评分标准进行打分，并按得分由高到低的顺序推荐中标候选人。",
  "lowest-price":
    "经评审的最低投标价法。评标委员会对满足招标文件实质性要求的投标文件，按照经评审的投标价由低到高的顺序推荐中标候选人。",
} as const;

/**
 * 评标汇总排序映射表
 */
const EVALUATION_SUMMARY_RANKING = {
  comprehensive:
    "综合评分法：评标结果按评审后得分由高到低顺序排列。得分相同的，按投标报价由低到高顺序排列。综合评分相等时，以投标报价低的优先；投标报价也相等的，以技术得分高的优先；若技术得分也相等，以财务评审中近一年的净资产高的优先原则。",
  "lowest-price":
    "最低评标价法：评标结果按投标报价由低到高顺序排列。投标报价相同的，评标委员会按照财务评审中近一年的净资产高的优先原则。",
} as const;

/**
 * 详细评审映射表
 */
const DETAILED_EVALUATION = {
  comprehensive:
    "综合评分法：分为投标报价评审、商务评审、技术评审（得分四舍五入保留两位小数）。",
  "lowest-price": "最低评标价法：无。",
} as const;

/**
 * 枚举值中文映射表 - 近年项目要求
 */
const RECENT_PROJECT_REQUIREMENT_LABELS = {
  "not-applicable": "不适用",
} as const;

/**
 * 枚举值中文映射表 - 备选投标方案
 */
const ALLOW_ALTERNATIVE_BID_LABELS = {
  "not-allowed": "不允许",
  allowed: "允许",
} as const;

/**
 * 投标保证金形式映射
 */
const BID_BOND_FORM_LABELS: Record<string, string> = {
  "wire-transfer": "电汇",
  "bank-guarantee": "银行保函",
  "commitment-letter":
    "投标人在招标人单位尚有未付货款且金额大于本次投标保证金的，允许投标人递交保证金承诺函，替代投标保证金",
  other: "招标人及招标代理机构可以接受的其他形式",
};

/**
 * 履约保证金形式映射
 */
const PERFORMANCE_BOND_FORM_LABELS: Record<string, string> = {
  cash: "现汇",
  "bank-guarantee": "银行保函（须为不可撤销、见索即付）",
  other: "招标人及招标代理机构可以接受的其他形式",
};

/**
 * 业绩证明材料类型映射
 */
const PROOF_MATERIAL_LABELS: Record<string, string> = {
  contract: "合同/订单",
  "bid-notice": "中标通知书/成交通知书",
  "acceptance-report": "竣工验收报告/验收证明",
  "owner-proof": "业主证明",
};

/**
 * 不允许负偏离项映射
 */
const NO_NEGATIVE_DEVIATION_LABELS: Record<string, string> = {
  "payment-terms": "付款条件",
  "delivery-date": "交货期",
  "delivery-location": "交货地点",
  "external-brand": "技术文件中约定的外购件品牌",
  "supply-scope": "供货范围",
  "bid-validity": "投标有效期",
  "quality-warranty": "质保期",
  "equipment-specs": "设备规格型号及主要参数",
  "technical-asterisk": "技术文件中带*号项",
  other: "其他",
};

/**
 * 格式化日期为中文格式
 * @param timestamp 时间戳
 * @returns 格式化后的日期字符串（如：2024年1月1日）
 */
export const formatDateToChinese = (timestamp: number | null): string => {
  if (!timestamp) {
    return "";
  }
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

/**
 * 格式化日期时间为中文格式（精确到小时）
 * @param timestamp 时间戳
 * @returns 格式化后的日期时间字符串（如：2024年1月1日9时）
 */
export const formatDateTimeToChinese = (timestamp: number | null): string => {
  if (!timestamp) {
    return "";
  }
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  return `${year}年${month}月${day}日${hour}时`;
};

/**
 * 格式化金额为元字符串
 * @param amount 金额（元）
 * @returns 格式化后的金额字符串
 */
export const formatAmount = (amount: number | null): string => {
  if (amount == null) {
    return "";
  }
  return `${amount.toFixed(2)}元`;
};

/**
 * 将表单数据转换为 Word 模板数据
 * @param formData 表单数据
 * @returns Word 模板数据
 */
export const transformFormDataToTemplateData = (
  formData: IBiddingFormData,
): IWordTemplateData => {
  const { basicInfo, bidderInstructions, comprehensiveScoring } = formData;

  // ========== 构建资质要求文本 ==========
  let qualificationRequirement = "";
  const types = basicInfo.qualificationRequirementType || [];
  const labels: string[] = [];

  for (const type of types) {
    if (type in QUALIFICATION_REQUIREMENT_LABELS) {
      labels.push(
        QUALIFICATION_REQUIREMENT_LABELS[
          type as keyof typeof QUALIFICATION_REQUIREMENT_LABELS
        ],
      );
    }
  }

  qualificationRequirement = labels.length > 0 ? labels.join("、") : "无";

  // ========== 构建业绩要求文本 ==========
  let performanceRequirement = "";
  if (basicInfo.performanceRequirementType === "has") {
    const startDateText = basicInfo.performanceStartDate
      ? formatDateToChinese(basicInfo.performanceStartDate)
      : "投标截止时间";

    performanceRequirement = `本次招标要求投标人在近${basicInfo.performanceYears}年（${startDateText}至投标截止时间）内具有${basicInfo.performanceType || ""}供货业绩`;
  } else {
    performanceRequirement = "无";
  }

  // ========== 构建交货期文本 ==========
  let deliveryDate = "";
  if (basicInfo.deliveryDateType === "date" && basicInfo.deliveryDate) {
    deliveryDate = formatDateToChinese(basicInfo.deliveryDate);
  } else {
    deliveryDate = basicInfo.deliveryDateText || "";
  }

  // ========== 构建投标保证金要求文本 ==========
  let bidBondRequirement = "";
  if (bidderInstructions.requireBidBond === true) {
    const amountText = formatAmount(bidderInstructions.bidBondAmount);
    const formItems = bidderInstructions.bidBondForms
      .map((f) => BID_BOND_FORM_LABELS[f])
      .filter(Boolean);

    const formsList = formItems
      .map((item, index) => `(${index + 1}) ${item}`)
      .join("\n");

    bidBondRequirement = `要求，投标保证金的形式及金额如下：
1、投标保证金的形式：
${formsList}
2、投标保证金的金额：${amountText}元人民币。
3、接收投标保证金的账户信息：
名称：中冶长天国际工程有限责任公司        开户行及帐号：交通银行湖南省分行营业部431612000018000173895
4、投标保证金的递交：
以电汇或现金转账形式提交的投标保证金应从投标人基本帐户转出，在开标截止日前汇至以上帐户（请注明XX项目投标保证金），并在投标文件中提交汇款凭证及基本存款账户银行出具的“开户许可证”或基本账户相关证明资料；
采用银行保函形式提交的，应提供由在中华人民共和国境内银行总行、分行或其支行出具（银行保函的格式要求详见本招标文件“第六章投标文件格式”中的要求）,保函有效期应当与投标有效期一致；在投标文件中应包含银行保函原件的扫描件，同时投标人应在投标文件递交截止时间前将银行保函原件邮寄或现场提交至招标人。
以其他形式递交投标保证金的，需在取得招标人认可后，按招标人的具体要求提供，否则其投标将被否决。`;
  } else if (bidderInstructions.requireBidBond === false) {
    bidBondRequirement = "不要求";
  }

  // ========== 构建财务状况要求文本 ==========
  const financialStatusRequirement =
    bidderInstructions.financialReportYears?.toString() || "";

  // ========== 构建近年项目要求文本 ==========
  let recentProjectRequirement = "";
  if (bidderInstructions.recentProjectRequirementType === "applicable") {
    const parts: string[] = [];
    parts.push(
      `投标人应提供近${bidderInstructions.recentProjectStartYear || ""}年至${bidderInstructions.recentProjectEndYear || ""}年的类似项目情况表，以证明供应商具有承担本项目要求的业绩。`,
    );
    if (bidderInstructions.recentProjectType) {
      parts.push(`\n类似项目是指：${bidderInstructions.recentProjectType}`);
    }
    if (bidderInstructions.proofMaterialTypes.length > 0) {
      const materials = bidderInstructions.proofMaterialTypes
        .map((t) => PROOF_MATERIAL_LABELS[t] || t)
        .join("、");
      parts.push(`\n业绩证明材料：${materials}`);
      if (bidderInstructions.otherProofMaterial) {
        parts.push(`（${bidderInstructions.otherProofMaterial}）`);
      }
      const requirementTypes = bidderInstructions.proofMaterialRequirement;
      if (requirementTypes.includes("all")) {
        parts.push("，需同时提供上述勾选的所有证明材料");
      } else if (requirementTypes.includes("any")) {
        parts.push("，提供上述勾选的任一项证明材料即可");
      }
    }
    if (bidderInstructions.recentProjectOtherRequirements) {
      parts.push(`\n${bidderInstructions.recentProjectOtherRequirements}`);
    }
    parts.push(
      "\n注：工业与信息化部等部委颁布的相关名录所列的首台（套）装备、首批次材料、首版次软件参与采购活动时，供应商提交相关证明材料，即视同满足市场占有率、使用业绩等要求。",
    );
    recentProjectRequirement = parts.join("");
  } else {
    recentProjectRequirement =
      RECENT_PROJECT_REQUIREMENT_LABELS[
        bidderInstructions.recentProjectRequirementType
      ] || "";
  }

  // ========== 构建近年发生的诉讼及仲裁情况的时间要求文本 ==========
  let litigationRequirement = "";
  if (
    bidderInstructions.litigationYears &&
    bidderInstructions.litigationStartDate
  ) {
    litigationRequirement = `近${bidderInstructions.litigationYears}年（${formatDateToChinese(bidderInstructions.litigationStartDate)}起至投标截至日止）`;
  } else if (bidderInstructions.litigationYears) {
    litigationRequirement = `近${bidderInstructions.litigationYears}年`;
  }

  // ========== 构建纸质投标文件要求文本 ==========
  let paperBidDocumentRequirement = "";
  if (bidderInstructions.requirePaperBidDocument === false) {
    paperBidDocumentRequirement = "不要求递交纸质投标文件";
  } else if (bidderInstructions.requirePaperBidDocument === true) {
    const copies = bidderInstructions.paperBidDocumentCopies ?? "";
    const electronicFile =
      bidderInstructions.requireElectronicFile === true ? "是" : "否";
    const separateBinding =
      bidderInstructions.requireSeparateBinding === true ? "是" : "否";
    paperBidDocumentRequirement = `需要递交纸质投标文件：\n投标文件副本份数：${copies}\n是否要求提交电子版文件：${electronicFile}\n是否需要分册装订：${separateBinding}`;
  }

  // ========== 构建投标文件是否退还文本 ==========
  let returnBidDocuments = "";
  if (bidderInstructions.returnBidDocuments === "no") {
    returnBidDocuments = "否";
  } else if (bidderInstructions.returnBidDocuments === "yes") {
    const dateStr = bidderInstructions.returnBidDocumentsDate
      ? formatDateToChinese(bidderInstructions.returnBidDocumentsDate)
      : "";
    returnBidDocuments = dateStr ? `是，退还时间：${dateStr}` : "是";
  }

  // ========== 构建履约保证金要求文本 ==========
  let performanceBondRequirement = "";
  if (bidderInstructions.requirePerformanceBond === "required") {
    const forms = bidderInstructions.performanceBondForms
      .map((f) => PERFORMANCE_BOND_FORM_LABELS[f])
      .filter(Boolean)
      .join("、");
    const amountPercent =
      bidderInstructions.performanceBondAmount?.toFixed(2) || "";
    performanceBondRequirement = `要求，履约保证金的形式：\n1、履约保证金的形式：${forms}\n2、履约保证金的金额：合同总额${amountPercent}%`;
  } else {
    performanceBondRequirement = "不要求";
  }

  // ========== 构建不允许负偏离项文本 ==========
  const noNegativeDeviationItems = bidderInstructions.noNegativeDeviationItems
    .map((item) => {
      if (item === "other") {
        return bidderInstructions.noNegativeDeviationOtherText || "其他";
      }
      return NO_NEGATIVE_DEVIATION_LABELS[item] || item;
    })
    .join("、");

  // ========== 构建投标人要求澄清招标文件文本 ==========
  const clarificationRequirement = `时间：投标人应于投标截止3日前\n形式：以书面方式，发送至${bidderInstructions.clarificationSendTo || ""}`;

  // ========== 增值税税金的计算方法 ==========
  const vatCalculationMethod = bidderInstructions.vatCalculationMethod || "";

  // ========== 构建最高投标限价文本 ==========
  let maxBidPrice = "";
  if (bidderInstructions.hasMaxBidPrice === true) {
    maxBidPrice = `有，最高投标限价：${formatAmount(bidderInstructions.maxBidPrice)}`;
  } else {
    maxBidPrice = "无";
  }

  // ========== 转换评分表数据 ==========
  const transformScoringItems = (
    items: Array<{
      index: number;
      itemName: string;
      score: number | null;
      scoringStandard: string;
    }>,
  ): IScoringItemData[] => {
    return items.map((item, idx) => ({
      index: idx + 1, // 从1开始的序号
      id: item.index, // 原时间戳作为 id
      itemName: item.itemName || "",
      score: item.score?.toString() || "",
      scoringStandard: item.scoringStandard || "",
    }));
  };

  // ========== 计算评分表总分 ==========
  const calculateScoreTotal = (items: IScoringItemData[]): string => {
    return items
      .reduce((sum, item) => sum + (parseFloat(item.score) || 0), 0)
      .toString();
  };

  return {
    // ============ 基础信息 ============
    // 招标主体需要将 value 转换为 label
    bidSubject:
      BID_SUBJECT_LABELS[basicInfo.bidSubject] || basicInfo.bidSubject,
    projectName: basicInfo.projectName,
    bidNumber: basicInfo.bidNumber,
    coverDate: formatDateToChinese(basicInfo.coverDate),
    equipmentName: basicInfo.equipmentName,
    projectOverview: basicInfo.projectOverview,
    deliveryDate,
    deliveryLocation: basicInfo.deliveryLocation,
    qualificationRequirement,
    performanceRequirement,
    acceptAgentBid:
      basicInfo.acceptAgentBid === "accept"
        ? `接受，应满足下列要求：
一个制造商对同一品牌同一型号的材设备，仅能委托一个代理商参加投标（仅针对设备招标）；
投标人为代理经销商的，对投标人的资质要求包含对制造商的资质要求，对投标人的业绩要求包含对投标设备材料的业绩要求。`
        : basicInfo.acceptAgentBid === "reject"
          ? "不接受"
          : "",
    acceptJointBid:
      basicInfo.acceptJointBid === "accept"
        ? `接受，应满足下列要求：
（1）联合体各方必须按招标文件提供的格式签订联合体协议书，明确联合体牵头人和各方的权利义务；
（2）联合体各方不得再以自己名义单独或加入其他联合体在同一工程中参加资格审查。`
        : basicInfo.acceptJointBid === "reject"
          ? "不接受"
          : "",
    acceptJointBidSimple:
      basicInfo.acceptJointBid === "accept"
        ? "接受"
        : basicInfo.acceptJointBid === "reject"
          ? "不接受"
          : "",
    qualityIssueNote: basicInfo.qualityIssueNote,
    issueSelectionType:
      basicInfo.issueSelectionType && basicInfo.issueSelectionType.length > 0
        ? basicInfo.issueSelectionType
            .map((t) => (t === "major" ? "重大" : t === "serious" ? "严重" : t))
            .join("、")
        : "无",
    bidDocumentFee:
      basicInfo.bidDocumentFee != null
        ? basicInfo.bidDocumentFee.toFixed(2)
        : "",
    bidDocumentFeePaymentType:
      basicInfo.bidDocumentFeePaymentType === "bank"
        ? "银行现汇"
        : basicInfo.bidDocumentFeePaymentType === "cash"
          ? "现金缴纳"
          : "",
    contactPerson: basicInfo.contactPerson,
    contactPhone: basicInfo.contactPhone,
    contactEmail: basicInfo.contactEmail,

    // ============ 投标人须知 ============
    evaluationMethod:
      EVALUATION_METHOD_LABELS[bidderInstructions.evaluationMethodType],
    capitalSourceAndRatio: bidderInstructions.capitalSourceAndRatio,
    qualityStandard: bidderInstructions.qualityStandard,
    preMeetingRequirement:
      bidderInstructions.preMeetingRequired === "no"
        ? "不召开"
        : bidderInstructions.preMeetingRequired === "yes"
          ? `召开，召开时间：${formatDateTimeToChinese(bidderInstructions.preMeetingTime)}，召开地点：${bidderInstructions.preMeetingLocation || ""}`
          : "",
    preMeetingQuestionDeadline:
      bidderInstructions.preMeetingRequired === "no"
        ? "无"
        : `时间：${formatDateTimeToChinese(bidderInstructions.questionDeadlineTime)}前提出\n形式：书面形式\n邮箱：${bidderInstructions.questionEmail || ""}`,
    evaluationMethodDescription:
      EVALUATION_METHOD_DESCRIPTIONS[bidderInstructions.evaluationMethodType],
    evaluationSummaryRanking:
      EVALUATION_SUMMARY_RANKING[bidderInstructions.evaluationMethodType],
    detailedEvaluation:
      DETAILED_EVALUATION[bidderInstructions.evaluationMethodType],
    bidBondRequirement,
    specialQualificationRequirement:
      bidderInstructions.hasSpecialQualificationReq === true
        ? `有，具体要求：${bidderInstructions.specialQualificationRequirement || ""}`
        : "无",
    financialStatusRequirement,
    recentProjectRequirement,
    litigationRequirement,
    allowAlternativeBid:
      ALLOW_ALTERNATIVE_BID_LABELS[
        bidderInstructions.allowAlternativeBidProposal
      ],
    paperBidDocumentRequirement,
    authorizeCommitteeToConfirmWinner:
      bidderInstructions.authorizeCommitteeToConfirmWinner === "yes"
        ? "是"
        : bidderInstructions.authorizeCommitteeToConfirmWinner === "no"
          ? "否"
          : "",
    performanceBondRequirement,
    negativeDeviation:
      bidderInstructions.negativeDeviationType === "not-allowed"
        ? "不允许"
        : bidderInstructions.negativeDeviationType === "allowed"
          ? `允许（偏差范围：${bidderInstructions.deviationRange || ""}；最高负偏离项数：${bidderInstructions.maxNegativeDeviationCount ?? ""}）`
          : "",
    noNegativeDeviationItems,
    clarificationRequirement,
    vatCalculationMethod,
    maxBidPrice,
    bidValidity: bidderInstructions.bidValidity?.toString() || "",
    abortBidWhenOverBudget:
      bidderInstructions.abortBidWhenOverBudget === "yes" ? "是" : "否",
    returnBidDocuments,
    useElectronicBidding:
      bidderInstructions.useElectronicBidding === "yes"
        ? `是,具体要求：在投标截止时间前，投标人须在五矿集团供应链管理平台”上传按招标文件要求加密的电子投标文件。单个投标文件应小于100M，如果单个投标文件大于100M,须分拆上传。
备注：
1、投标人未在五矿集团供应链管理平台成功上传电子投标文件或上传的投标文件有实质性缺失的，其投标将被否决；
2、不同投标人在五矿集团供应链管理平台上操作时系统抓取到的电脑MAC地址一致的、使用同一台电脑编辑投标文件或上传投标文件的（机器码一致），将视同“串标”，相关投标将被否决，且相关投标人在平台上的账号可能被冻结。
3、招标人要求同时提供纸质版投标文件的，如内容和电子版不一致时，以电子版为准。`
        : bidderInstructions.useElectronicBidding === "no"
          ? "否"
          : "",

    // ============ 综合评分法总分 ============
    commercialScoreTotal: comprehensiveScoring
      ? calculateScoreTotal(
          transformScoringItems(comprehensiveScoring.commercialScoring.items),
        )
      : "0",
    technicalScoreTotal: comprehensiveScoring
      ? calculateScoreTotal(
          transformScoringItems(comprehensiveScoring.technicalScoring.items),
        )
      : "0",
    priceScoreTotal: comprehensiveScoring
      ? calculateScoreTotal(
          transformScoringItems(comprehensiveScoring.priceScoring.items),
        )
      : "0",

    // ============ 综合评分法 ============
    commercialScoringItems: comprehensiveScoring
      ? transformScoringItems(comprehensiveScoring.commercialScoring.items)
      : [],
    technicalScoringItems: comprehensiveScoring
      ? transformScoringItems(comprehensiveScoring.technicalScoring.items)
      : [],
    priceScoringItems: comprehensiveScoring
      ? transformScoringItems(comprehensiveScoring.priceScoring.items)
      : [],
  };
};

/**
 * 导出 Word 文档
 * @param formData 表单数据
 * @param options 导出配置选项
 * @returns 导出结果
 */
export const exportWordDocument = (
  formData: IBiddingFormData,
  options: IExportOptions,
): Promise<IExportResult> => {
  const { templatePath, outputFileName } = options;
  const finalFileName =
    outputFileName ??
    `${DEFAULT_OUTPUT_PREFIX}${formData.basicInfo.bidNumber || new Date().getTime()}`;

  return new Promise((resolve) => {
    loadFile(templatePath, function (error, content) {
      if (error) {
        console.error("模板文件加载失败:", error);
        resolve({ success: false, error: error.message });
        return;
      }

      try {
        // 解压 Word 文档
        const zip = new PizZip(content);

        // 配置图片模块（预留，目前不处理图片）
        const imageModule = new ImageModule({
          centered: false,
          getImage: () => null,
          getSize: () => [100, 100],
        });

        // 创建 Docxtemplater 实例
        const doc = new Docxtemplater(zip, {
          modules: [imageModule],
          paragraphLoop: true,
          linebreaks: true,
        });

        // 转换并设置模板数据
        const templateData = transformFormDataToTemplateData(formData);
        doc.render(templateData);

        // 生成输出文件
        const out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        // 下载文件
        saveAs(out, `${finalFileName}.docx`);

        resolve({ success: true });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Word 导出失败:", err);
        resolve({ success: false, error: errorMessage });
      }
    });
  });
};

/**
 * 导出 Word 文档（带进度回调）
 * @param formData 表单数据
 * @param onProgress 进度回调
 * @param options 导出配置选项
 * @returns 导出结果
 */
export const exportWordDocumentWithProgress = (
  formData: IBiddingFormData,
  onProgress: (stage: string) => void,
  options: IExportOptions,
): Promise<IExportResult> => {
  const { templatePath, outputFileName } = options;
  const finalFileName =
    outputFileName ??
    `${DEFAULT_OUTPUT_PREFIX}${formData.basicInfo.bidNumber || new Date().getTime()}`;

  return new Promise((resolve) => {
    onProgress("正在加载模板文件...");
    loadFile(templatePath, function (error, content) {
      if (error) {
        console.error("模板文件加载失败:", error);
        resolve({ success: false, error: error.message });
        return;
      }

      try {
        onProgress("正在处理数据...");
        const templateData = transformFormDataToTemplateData(formData);

        onProgress("正在生成文档...");
        const zip = new PizZip(content);

        const imageModule = new ImageModule({
          centered: false,
          getImage: () => null,
          getSize: () => [100, 100],
        });

        const doc = new Docxtemplater(zip, {
          modules: [imageModule],
          paragraphLoop: true,
          linebreaks: true,
        });

        doc.render(templateData);

        onProgress("正在下载文件...");
        const out = doc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        });

        saveAs(out, `${finalFileName}.docx`);

        onProgress("导出完成");
        resolve({ success: true });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error("Word 导出失败:", err);
        resolve({ success: false, error: errorMessage });
      }
    });
  });
};
