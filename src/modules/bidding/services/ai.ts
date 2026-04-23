/**
 * AI服务 - 调用OpenAI生成招标表单内容
 * @module modules/bidding/services/ai
 */

import OpenAI from 'openai';
import type { IBiddingFormData } from '../types/form';

const openai = new OpenAI({
  baseURL: import.meta.env.VITE_OPENAI_BASE_URL,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `你是一个专业的招标专员，擅长生成设备采购招标的标准表单内容。
请根据提供的信息生成一份完整的招标表单数据，返回JSON格式。

【重要】返回的JSON字段名必须与以下完全一致，使用英文驼峰命名：

basicInfo字段：
- bidSubject: 招标主体（如"母公司"或子公司名称）
- projectName: 项目名称
- bidNumber: 招标编号（留空可写"待定"）
- coverDate: 封面日期（时间戳，可用当前日期）
- equipmentName: 采购设备名称
- projectOverview: 项目概况
- deliveryDateType: "text"（交货期类型）
- deliveryDateText: 交货期描述（如"合同签订后30天内"）
- deliveryLocation: 交货地点
- qualificationRequirementType: 资质要求数组（如["option1"]）
- qualificationRequirementOther: 资质其他说明
- performanceRequirementType: "has"（业绩要求类型）
- performanceYears: 3（业绩年限数字）
- acceptAgentBid: "accept"（是否接受代理商投标）
- acceptJointBid: "reject"（是否接受联合体投标）
- issueSelectionType: []（问题严重程度数组）
- bidDocumentFee: 500（招标文件售价数字）
- bidDocumentFeePaymentType: "bank"（支付形式）
- contactPerson: 联系人姓名
- contactPhone: 联系电话
- contactEmail: 联系邮箱

bidderInstructions字段：
- evaluationMethodType: "comprehensive"（评标办法：comprehensive综合评分法，lowest-price最低价法）
- capitalSourceAndRatio: 资金来源及比例描述
- qualityStandard: 质量标准描述
- preMeetingRequired: "no"（是否需要投标预备会）
- bidBond: 投标保证金描述
- bidBondAccount: 投标保证金收款账户信息
- performanceBond: 履约保证金描述
- performanceBondRatio: 履约保证金比例
- contractSigningDeadline: 合同签订截止日期描述
- deliveryDeadline: 交货期描述
- acceptanceStandard: 验收标准描述
- paymentMethod: 付款方式描述
- technicalDocumentsRequired: 技术文件要求

请返回完整可用的JSON数据，确保信息专业合理。`;

export interface AIGenerateOptions {
  /** 现有表单数据（用于参考或保留） */
  existingData?: Partial<IBiddingFormData>;
  /** 项目类型描述 */
  projectType?: string;
}

export interface AIGenerateResult {
  /** 生成状态 */
  success: boolean;
  /** 生成的表单数据 */
  data?: Partial<IBiddingFormData>;
  /** 错误信息 */
  error?: string;
}

/** 部分生成选项 */
export interface AIPartialGenerateOptions {
  /** 要生成的字段类型 */
  types: string[];
  /** 上下文描述 */
  context?: string;
}

/** 完整的Schema定义 */
const FULL_SCHEMA = `
【完整表单Schema - 根据用户需求生成部分或全部字段】

basicInfo（基础信息）：
- bidSubject: 招标主体（公司或子公司名称）
- projectName: 项目名称
- bidNumber: 招标编号（可写"待定"）
- coverDate: 封面日期（时间戳，可用当前日期）
- equipmentName: 采购设备名称
- projectOverview: 项目概况
- deliveryDateType: "text"（交货期类型，固定为"text"）
- deliveryDateText: 交货期描述（如"合同签订后30天内"）
- deliveryLocation: 交货地点
- qualificationRequirementType: 资质要求数组（如["option1", "option2"]）
- qualificationRequirementOther: 资质其他说明
- performanceRequirementType: 业绩要求类型（"has"或"none"）
- performanceYears: 业绩年限（数字，如3）
- performanceStartDate: 业绩开始日期（时间戳）
- performanceType: 业绩要求详细描述
- acceptAgentBid: 是否接受代理商投标（"accept"或"reject"）
- acceptJointBid: 是否接受联合体投标（"accept"或"reject"）
- issueSelectionType: 问题严重程度数组（[]空数组，或["major", "serious"]）
- bidDocumentFee: 招标文件售价（数字，如500）
- bidDocumentFeePaymentType: 支付形式（"bank"或"cash"）
- qualityIssueNote: 质量问题说明
- contactPerson: 联系人姓名
- contactPhone: 联系电话
- contactEmail: 联系邮箱

bidderInstructions（投标人须知）：
- evaluationMethodType: 评标办法（"comprehensive"综合评分法，或"lowest-price"最低价法）
- capitalSourceAndRatio: 资金来源及比例描述
- qualityStandard: 质量标准描述
- preMeetingRequired: 是否需要投标预备会（"yes"或"no"）
- bidBond: 投标保证金描述
- bidBondAccount: 投标保证金收款账户信息
- performanceBond: 履约保证金描述
- performanceBondRatio: 履约保证金比例（数字，如5表示5%）
- contractSigningDeadline: 合同签订截止日期描述
- deliveryDeadline: 交货期描述
- acceptanceStandard: 验收标准描述
- paymentMethod: 付款方式描述
- technicalDocumentsRequired: 技术文件要求描述

comprehensiveScoring（综合评分法，可选）：
- commercialScoring: 商务评分表 { items: [{ index: 数字, itemName: "评分项名称", score: 数字（如10）, scoringStandard: "打分标准描述" }] }
- technicalScoring: 技术评分表 { items: [{ index: 数字, itemName: "评分项名称", score: 数字（如20）, scoringStandard: "打分标准描述" }] }
- priceScoring: 价格评分表 { items: [{ index: 数字, itemName: "评分项名称", score: 数字（如30）, scoringStandard: "打分标准描述" }] }`;

/**
 * 调用AI生成招标表单内容
 */
export async function generateBiddingForm(
  options: AIGenerateOptions = {}
): Promise<AIGenerateResult> {
  try {
    const { existingData, projectType } = options;

    const userMessage = projectType
      ? `请为以下项目类型生成招标表单：${projectType}`
      : '请生成一份标准的设备采购招标表单';

    const contextInfo = existingData
      ? `现有已填写的信息（请在生成时保留这些值）：${JSON.stringify(existingData, null, 2)}`
      : '暂无已填写的信息';

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL_NAME || 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: `${userMessage}\n\n${contextInfo}\n\n请只返回JSON数据，不要包含其他说明文字。`,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return { success: false, error: 'AI未返回有效内容' };
    }

    // 尝试解析JSON
    let parsedData: Partial<IBiddingFormData>;
    try {
      // 尝试提取JSON（处理可能的markdown代码块）
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      parsedData = JSON.parse(jsonStr);
    } catch {
      return { success: false, error: 'AI返回内容格式错误' };
    }

    return { success: true, data: parsedData };
  } catch (error) {
    console.error('AI生成失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * 部分生成招标表单（只生成选定的字段）
 */
export async function generateBiddingFormPartial(
  options: AIPartialGenerateOptions
): Promise<AIGenerateResult> {
  try {
    const { types, context } = options;

    // 根据选择的类型构建prompt
    const typeDescriptions: Record<string, string> = {
      basicInfo: `【基础信息】包含：
- projectName: 项目名称
- equipmentName: 采购设备名称
- projectOverview: 项目概况
- deliveryDateType: "text"
- deliveryDateText: 交货期描述（如"合同签订后30天内"）
- deliveryLocation: 交货地点
- qualificationRequirementType: 资质要求数组（如["option1"]）
- qualificationRequirementOther: 资质其他说明
- performanceRequirementType: 业绩要求类型（has/none）
- performanceYears: 业绩年限数字
- performanceType: 业绩要求详细描述
- acceptAgentBid: 是否接受代理商投标（accept/reject）
- acceptJointBid: 是否接受联合体投标（accept/reject）
- bidDocumentFee: 招标文件售价数字
- bidDocumentFeePaymentType: 支付形式（bank/cash）
- contactPerson: 联系人姓名
- contactPhone: 联系电话
- contactEmail: 联系邮箱`,

      bidderInstructions: `【投标人须知】包含：
- evaluationMethodType: 评标办法（comprehensive综合评分法/lowest-price最低价法）
- capitalSourceAndRatio: 资金来源及比例描述
- qualityStandard: 质量标准描述
- preMeetingRequired: 是否需要投标预备会（yes/no）
- bidBond: 投标保证金描述
- bidBondAccount: 投标保证金收款账户信息
- performanceBond: 履约保证金描述
- paymentMethod: 付款方式描述
- acceptanceStandard: 验收标准描述`,

      comprehensiveScoring: `【综合评分法】包含：
- commercialScoring: 商务评分表 { items: [{ index: 数字, itemName: "评分项名称", score: 数字, scoringStandard: "打分标准描述" }] }
- technicalScoring: 技术评分表（结构同上）
- priceScoring: 价格评分表（结构同上）`,
    };

    const selectedFields = types.map(t => typeDescriptions[t] || '').filter(Boolean).join('\n\n');

    const systemPrompt = `你是一个专业的招标专员，擅长生成设备采购招标的标准表单内容。
请根据提供的信息，只生成用户选择的字段内容，返回JSON格式。

【重要】
1. 只生成用户选择的字段，不要生成其他字段
2. 返回的JSON字段名必须与以下完全一致，使用英文驼峰命名
3. 确保返回的JSON结构正确，可以被JSON.parse解析

${selectedFields}

请生成专业合理的内容。`;

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL_NAME || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: context || '请生成标准的招标表单内容',
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return { success: false, error: 'AI未返回有效内容' };
    }

    // 尝试解析JSON
    let parsedData: Partial<IBiddingFormData>;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      parsedData = JSON.parse(jsonStr);
    } catch {
      return { success: false, error: 'AI返回内容格式错误' };
    }

    return { success: true, data: parsedData };
  } catch (error) {
    console.error('AI生成失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * 根据用户自然语言需求生成表单内容
 * AI会自动识别用户描述了哪些方面的需求，然后生成对应的字段
 * @param userPrompt 用户的需求描述
 * @param existingData 现有表单数据（作为上下文参考）
 */
export async function generateBiddingFormByPrompt(
  userPrompt: string,
  existingData?: Partial<IBiddingFormData>
): Promise<AIGenerateResult> {
  try {
    // 构建上下文信息
    const contextInfo = existingData
      ? `【当前表单已有内容 - 参考用】
${formatExistingDataForContext(existingData)}

【重要】
- AI在生成时应该参考上述表单已有内容，理解用户当前的状态和意图
- 如果用户描述的内容与已有表单内容相关，应该在已有内容基础上修改完善
- 保持与已有表单内容风格和逻辑的一致性`
      : '【表单为空，将从头生成内容】';

    const systemPrompt = `你是一个专业的招标专员，擅长生成设备采购招标的标准表单内容。
请根据用户的自然语言描述，智能识别用户需要填写哪些字段，然后生成对应的JSON数据。

【重要规则】
1. 只生成用户明确提到或隐含需要的字段，不要生成用户没有涉及的字段
2. 如果用户只提到部分需求（如只提到设备名称和交货期），则只生成basicInfo中相关的字段
3. 返回的JSON字段名必须与以下Schema完全一致，使用英文驼峰命名
4. 确保返回的JSON结构正确，可以被JSON.parse解析
5. 每个字段的值应该是合理的默认的招标内容

${FULL_SCHEMA}

请分析用户描述，自动决定需要生成哪些字段。`;

    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL_NAME || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `${contextInfo}\n\n【用户需求】\n${userPrompt}`,
        },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      return { success: false, error: 'AI未返回有效内容' };
    }

    // 尝试解析JSON
    let parsedData: Partial<IBiddingFormData>;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content;
      parsedData = JSON.parse(jsonStr);
    } catch {
      return { success: false, error: 'AI返回内容格式错误，请重试' };
    }

    return { success: true, data: parsedData };
  } catch (error) {
    console.error('AI生成失败:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

/**
 * 格式化现有表单数据为可读上下文
 */
function formatExistingDataForContext(data: Partial<IBiddingFormData>): string {
  const lines: string[] = [];

  if (data.basicInfo) {
    const { basicInfo } = data;
    lines.push('【基础信息】');
    if (basicInfo.projectName) lines.push(`- 项目名称: ${basicInfo.projectName}`);
    if (basicInfo.equipmentName) lines.push(`- 采购设备: ${basicInfo.equipmentName}`);
    if (basicInfo.bidNumber) lines.push(`- 招标编号: ${basicInfo.bidNumber}`);
    if (basicInfo.projectOverview) lines.push(`- 项目概况: ${basicInfo.projectOverview}`);
    if (basicInfo.deliveryLocation) lines.push(`- 交货地点: ${basicInfo.deliveryLocation}`);
    if (basicInfo.deliveryDateText) lines.push(`- 交货期: ${basicInfo.deliveryDateText}`);
    if (basicInfo.qualificationRequirementType?.length) {
      lines.push(`- 资质要求: ${basicInfo.qualificationRequirementType.join(', ')}`);
    }
    if (basicInfo.qualificationRequirementOther) {
      lines.push(`- 资质其他要求: ${basicInfo.qualificationRequirementOther}`);
    }
    if (basicInfo.performanceRequirementType) {
      lines.push(`- 业绩要求: ${basicInfo.performanceRequirementType === 'has' ? '有业绩要求' : '无业绩要求'}`);
    }
    if (basicInfo.performanceYears) {
      lines.push(`- 业绩年限: ${basicInfo.performanceYears}年`);
    }
    if (basicInfo.performanceType) lines.push(`- 业绩描述: ${basicInfo.performanceType}`);
    if (basicInfo.acceptAgentBid) lines.push(`- 接受代理商投标: ${basicInfo.acceptAgentBid}`);
    if (basicInfo.acceptJointBid) lines.push(`- 接受联合体投标: ${basicInfo.acceptJointBid}`);
    if (basicInfo.contactPerson) lines.push(`- 联系人: ${basicInfo.contactPerson}`);
    if (basicInfo.contactPhone) lines.push(`- 联系电话: ${basicInfo.contactPhone}`);
  }

  if (data.bidderInstructions) {
    const { bidderInstructions } = data;
    lines.push('\n【投标人须知】');
    if (bidderInstructions.evaluationMethodType) {
      lines.push(`- 评标办法: ${bidderInstructions.evaluationMethodType === 'comprehensive' ? '综合评分法' : '最低价法'}`);
    }
    if (bidderInstructions.capitalSourceAndRatio) {
      lines.push(`- 资金来源: ${bidderInstructions.capitalSourceAndRatio}`);
    }
    if (bidderInstructions.qualityStandard) lines.push(`- 质量标准: ${bidderInstructions.qualityStandard}`);
    if (bidderInstructions.preMeetingRequired) {
      lines.push(`- 投标预备会: ${bidderInstructions.preMeetingRequired === 'yes' ? '需要' : '不需要'}`);
    }
  }

  if (data.comprehensiveScoring) {
    const { comprehensiveScoring } = data;
    lines.push('\n【综合评分法】');
    if (comprehensiveScoring.commercialScoring?.items?.length) {
      lines.push(`- 商务评分项: ${comprehensiveScoring.commercialScoring.items.length}项`);
    }
    if (comprehensiveScoring.technicalScoring?.items?.length) {
      lines.push(`- 技术评分项: ${comprehensiveScoring.technicalScoring.items.length}项`);
    }
    if (comprehensiveScoring.priceScoring?.items?.length) {
      lines.push(`- 价格评分项: ${comprehensiveScoring.priceScoring.items.length}项`);
    }
  }

  return lines.length > 0 ? lines.join('\n') : '（表单为空）';
}
