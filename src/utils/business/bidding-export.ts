/**
 * 招标采购 Word 导出工具函数
 * @module utils/business/bidding-export
 */

import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import PizZipUtils from "pizzip/utils/index.js";
import { saveAs } from "file-saver";
import ImageModule from "docxtemplater-image-module-free";
import type { IBiddingFormData } from "@/types/bidding";
import type {
  IWordTemplateData,
  IExportOptions,
  IExportResult,
  IScoringItemData,
} from "@/types/bidding-export";

/**
 * 加载本地二进制文件
 * @param url 文件路径（支持 file:// 协议或相对路径）
 * @param callback 回调函数
 */
function loadFile(url: string, callback: (error: Error | null, content: any) => void) {
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
  option1: "独立法人资格，持有有效的营业执照、基本账户开户许可证或基本存款账户信息表。",
  option3: "无",
} as const;

/**
 * 枚举值中文映射表 - 联合体投标
 */
const ACCEPT_JOINT_BID_LABELS = {
  yes: "是",
  no: "否",
} as const;

/**
 * 枚举值中文映射表 - 代理商投标
 */
const ACCEPT_AGENT_BID_LABELS = {
  accept: "接受",
  reject: "不接受",
} as const;

/**
 * 枚举值中文映射表 - 评标办法
 */
const EVALUATION_METHOD_LABELS = {
  comprehensive: "综合评分法",
  "lowest-price": "经评审的最低价中标法",
} as const;

/**
 * 枚举值中文映射表 - 资格审查方式
 */
const QUALIFICATION_METHOD_LABELS = {
  "post-review": "资格后审",
  "pre-review": "资格预审",
} as const;

/**
 * 枚举值中文映射表 - 财务状况要求
 */
const FINANCIAL_STATUS_REQUIREMENT_LABELS = {
  "not-applicable": "不适用",
  "applicable-one-year": "投标人应提供经会计事务所或审计机构审计的上一年度财务报表",
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
 * 枚举值中文映射表 - 中小企业
 */
const IS_SMALL_MEDIUM_ENTERPRISE_LABELS = {
  yes: "是",
  no: "否",
} as const;

/**
 * 投标保证金形式映射
 */
const BID_BOND_FORM_LABELS: Record<string, string> = {
  "bank-transfer": "银行现汇",
  "commitment-letter": "保证金承诺函",
};

/**
 * 履约保证金形式映射
 */
const PERFORMANCE_BOND_FORM_LABELS: Record<string, string> = {
  "bank-guarantee": "银行保函",
  cash: "现金",
  check: "支票",
  other: "其他",
};

/**
 * 银行保函要求映射
 */
const BANK_GUARANTEE_REQUIREMENT_LABELS: Record<string, string> = {
  "no-restriction": "无限制",
  "branch-or-above": "应由支行及以上国有或股份制商业银行",
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
};

/**
 * 格式化日期为中文格式
 * @param timestamp 时间戳
 * @returns 格式化后的日期字符串（如：2024年1月1日）
 */
export const formatDateToChinese = (
  timestamp: number | null,
): string => {
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
 * 格式化金额为万元字符串
 * @param amount 金额（万元）
 * @returns 格式化后的金额字符串
 */
export const formatAmount = (amount: number | null): string => {
  if (amount == null) {
    return "";
  }
  return `${amount.toFixed(2)}万元`;
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
  if (basicInfo.qualificationRequirementType === "option2") {
    qualificationRequirement =
      basicInfo.qualificationRequirementOther || "无";
  } else {
    qualificationRequirement =
      QUALIFICATION_REQUIREMENT_LABELS[
        basicInfo.qualificationRequirementType
      ] || "";
  }

  // ========== 构建财务要求文本 ==========
  let financialRequirement = "";
  if (basicInfo.financialRequirementType === "has") {
    financialRequirement = basicInfo.financialRequirementContent || "有";
  } else {
    financialRequirement = "无";
  }

  // ========== 构建业绩要求文本 ==========
  let performanceRequirement = "";
  if (basicInfo.performanceRequirementType === "has") {
    performanceRequirement = `投标人提供近${basicInfo.performanceYears}年（指从投标截止日往前推算${basicInfo.performanceYears}年，例如投标截止日为2024年6月1日，则近5年是指2019年6月1日至2024年5月31日，以合同签订时间为准）类似${basicInfo.performanceType || ""}业绩至少${basicInfo.performanceCount}个。\n注：工业与信息化部等部委颁布的相关名录所列的首台（套）装备、首批次材料、首版次软件参与采购活动时，供应商提交相关证明材料，即视同满足市场占有率、使用业绩等要求。`;
  } else {
    performanceRequirement = "无";
  }

  // ========== 构建联合体投标要求文本 ==========
  let jointBidRequirements = "";
  if (basicInfo.acceptJointBid === "yes") {
    const parts: string[] = [];
    parts.push(
      `联合体所有成员数量不得超过${basicInfo.jointBidMaxMembers || 2}家`,
    );
    if (basicInfo.jointBidQualificationRequirement) {
      parts.push(basicInfo.jointBidQualificationRequirement);
    }
    jointBidRequirements = parts.join("；");
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
    const forms =
      bidderInstructions.bidBondForms
        .map((f) => BID_BOND_FORM_LABELS[f])
        .filter(Boolean)
        .join("、") || "银行现汇";
    bidBondRequirement = `要求，金额为${amountText}，形式：${forms}`;
  } else if (bidderInstructions.requireBidBond === false) {
    bidBondRequirement = "不要求";
  }

  // ========== 构建财务状况要求文本 ==========
  let financialStatusRequirement = "";
  if (
    bidderInstructions.financialStatusRequirement ===
    "applicable-recent-years"
  ) {
    financialStatusRequirement = `适用：投标人应递交近${bidderInstructions.financialReportYears || 1}年度经会计事务所或审计机构审计的财务报表`;
  } else {
    financialStatusRequirement =
      FINANCIAL_STATUS_REQUIREMENT_LABELS[
        bidderInstructions.financialStatusRequirement
      ] || "";
  }

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

  // ========== 构建履约保证金要求文本 ==========
  let performanceBondRequirement = "";
  if (bidderInstructions.requirePerformanceBond === "required") {
    const forms =
      bidderInstructions.performanceBondForms
        .map((f) => PERFORMANCE_BOND_FORM_LABELS[f])
        .filter(Boolean)
        .join("、") || "银行保函";
    const amountText = formatAmount(bidderInstructions.performanceBondAmount);
    performanceBondRequirement = `要求，形式：${forms}，金额：${amountText}`;

    // 银行保函要求
    if (bidderInstructions.performanceBondForms.includes("bank-guarantee")) {
      const bankReqs = bidderInstructions.bankGuaranteeRequirements
        .map((r) => BANK_GUARANTEE_REQUIREMENT_LABELS[r])
        .filter(Boolean)
        .join("；");
      if (bankReqs) {
        performanceBondRequirement += `，出具保函的银行要求：${bankReqs}`;
      }
    }
  } else {
    performanceBondRequirement = "不要求";
  }

  // ========== 构建不允许负偏离项文本 ==========
  const noNegativeDeviationItems = bidderInstructions.noNegativeDeviationItems
    .map((item) => NO_NEGATIVE_DEVIATION_LABELS[item] || item)
    .join("、");

  // ========== 构建最高投标限价文本 ==========
  let maxBidPrice = "";
  if (bidderInstructions.hasMaxBidPrice === true) {
    maxBidPrice = formatAmount(bidderInstructions.maxBidPrice);
  } else {
    maxBidPrice = "无";
  }

  // ========== 构建标书费文本 ==========
  let bidDocumentFee = "";
  if (bidderInstructions.requireBidDocumentFee === true) {
    const amount = bidderInstructions.bidDocumentFeeAmount;
    bidDocumentFee = `要求，人民币${amount?.toFixed(2) || 0}元整`;
    const forms =
      bidderInstructions.bidDocumentFeeForms
        .map((f) => (f === "bank-transfer" ? "银行现汇" : "现金缴纳"))
        .join("、") || "银行现汇";
    bidDocumentFee += `，形式：${forms}`;
  } else {
    bidDocumentFee = "不要求";
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
    return items.map((item) => ({
      index: item.index,
      itemName: item.itemName || "",
      score: item.score?.toString() || "",
      scoringStandard: item.scoringStandard || "",
    }));
  };

  return {
    // ============ 基础信息 ============
    // 招标主体需要将 value 转换为 label
    bidSubject: BID_SUBJECT_LABELS[basicInfo.bidSubject] || basicInfo.bidSubject,
    projectName: basicInfo.projectName,
    bidNumber: basicInfo.bidNumber,
    coverDate: formatDateToChinese(basicInfo.coverDate),
    equipmentName: basicInfo.equipmentName,
    deliveryDate,
    deliveryLocation: basicInfo.deliveryLocation,
    bidScope: basicInfo.bidScope,
    qualificationRequirement,
    financialRequirement,
    performanceRequirement,
    acceptJointBid: ACCEPT_JOINT_BID_LABELS[basicInfo.acceptJointBid],
    jointBidRequirements,
    acceptAgentBid: ACCEPT_AGENT_BID_LABELS[basicInfo.acceptAgentBid],
    qualityIssueNote: basicInfo.qualityIssueNote,
    contactPerson: basicInfo.contactPerson,
    contactPhone: basicInfo.contactPhone,
    contactEmail: basicInfo.contactEmail,

    // ============ 投标人须知 ============
    bidSectionCount:
      (bidderInstructions.bidSectionCount ?? 1).toString() + "个",
    evaluationMethod:
      EVALUATION_METHOD_LABELS[bidderInstructions.evaluationMethodType],
    bidBondRequirement,
    qualificationMethod:
      QUALIFICATION_METHOD_LABELS[bidderInstructions.qualificationMethod],
    specialQualificationRequirement:
      bidderInstructions.hasSpecialQualificationReq === true
        ? bidderInstructions.specialQualificationRequirement || "有"
        : "无",
    financialStatusRequirement,
    recentProjectRequirement,
    allowAlternativeBid:
      ALLOW_ALTERNATIVE_BID_LABELS[
        bidderInstructions.allowAlternativeBidProposal
      ],
    recommendedCandidateCount:
      (bidderInstructions.recommendedCandidateCount ?? 1).toString() + "人",
    performanceBondRequirement,
    noNegativeDeviationItems,
    maxBidPrice,
    bidDocumentFee,
    abortBidWhenOverBudget:
      bidderInstructions.abortBidWhenOverBudget === "yes" ? "是" : "否",
    isSmallMediumEnterprise:
      IS_SMALL_MEDIUM_ENTERPRISE_LABELS[
        bidderInstructions.isSmallMediumEnterprise
      ],

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
        const errorMessage =
          err instanceof Error ? err.message : String(err);
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
        const errorMessage =
          err instanceof Error ? err.message : String(err);
        console.error("Word 导出失败:", err);
        resolve({ success: false, error: errorMessage });
      }
    });
  });
};
