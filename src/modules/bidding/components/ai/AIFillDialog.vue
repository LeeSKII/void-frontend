<!--
  @component AIFillDialog
  @description AI智能填单交互式对话框
-->
<template>
  <n-modal
    v-model:show="visible"
    preset="card"
    title="AI智能填单"
    style="width: 800px; max-width: 90vw"
    :segmented="{ content: true, footer: true }"
    :mask-closable="!isGenerating"
    :close-on-esc="!isGenerating"
  >
    <n-space vertical size="large">
      <!-- 输入区域 -->
      <n-card title="描述您的招标需求" size="small">
        <template #header-extra>
          <n-text depth="3" style="font-size: 12px">AI会根据您的描述生成或修改表单内容</n-text>
        </template>
        <n-input
          v-model:value="userPrompt"
          type="textarea"
          placeholder="例如：我需要招标采购办公电脑100台，交货期30天，需要ISO9001认证资质..."
          :rows="4"
          :disabled="isGenerating"
        />
        <n-space style="margin-top: 12px">
          <n-button
            type="primary"
            :loading="isGenerating"
            :disabled="!userPrompt.trim() || isGenerating"
            @click="handleGenerate"
          >
            <template #icon>
              <n-icon><Sparkles /></n-icon>
            </template>
            {{ isGenerating ? '生成中...' : '生成表单内容' }}
          </n-button>
          <n-button
            v-if="generatedContent"
            @click="handleRegenerate"
            :loading="isGenerating"
          >
            重新生成
          </n-button>
        </n-space>
      </n-card>

      <!-- AI生成结果 -->
      <n-card v-if="generatedContent" title="AI生成结果" size="small">
        <template #header-extra>
          <n-space align="center">
            <n-switch v-model:value="showRawJson" size="small">
              <template #checked>原始JSON</template>
              <template #unchecked>格式化</template>
            </n-switch>
            <n-tag type="info" size="small" v-if="generatedContent.basicInfo">基础信息</n-tag>
            <n-tag type="warning" size="small" v-if="generatedContent.bidderInstructions">投标人须知</n-tag>
            <n-tag type="success" size="small" v-if="generatedContent.comprehensiveScoring || generatedContent.priceScoring">综合评分</n-tag>
          </n-space>
        </template>
        <n-spin :show="isGenerating">
          <div v-if="showRawJson" class="raw-json">
            <n-code :code="rawJsonContent" language="json" word-wrap />
          </div>
          <div v-else class="ai-content" v-html="formattedContent"></div>
        </n-spin>
      </n-card>

      <!-- 错误信息 -->
      <n-alert v-if="errorMessage" type="error" :title="errorMessage" />
    </n-space>

    <template #footer>
      <n-space justify="end">
        <n-button @click="handleClose" :disabled="isGenerating">取消</n-button>
        <n-button
          type="primary"
          :disabled="!generatedContent || isGenerating"
          @click="handleApply"
        >
          应用到表单
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Sparkles } from '@vicons/ionicons5';
import { generateBiddingFormByPrompt } from '../../services/ai';
import type { IBiddingFormData } from '../../types/form';

interface Emits {
  (e: 'apply', data: Partial<IBiddingFormData>): void;
  (e: 'close'): void;
}

interface Props {
  /** 当前表单数据（作为上下文） */
  currentFormData?: Partial<IBiddingFormData>;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const userPrompt = ref('');
const isGenerating = ref(false);
const generatedContent = ref<Partial<IBiddingFormData> | null>(null);
const errorMessage = ref('');
const formattedContent = ref('');
const showRawJson = ref(false);

/** 原始JSON内容 */
const rawJsonContent = computed(() => {
  if (!generatedContent.value) return '';
  return JSON.stringify(generatedContent.value, null, 2);
});

/**
 * 格式化AI响应为美观的HTML显示
 */
function formatAIResponse(data: Partial<IBiddingFormData>): string {
  if (!data) return '';

  const lines: string[] = [];

  if (data.basicInfo) {
    lines.push('<div class="section"><h4>📋 基础信息</h4>');
    const b = data.basicInfo;
    if (b.projectName) lines.push(`<p><strong>项目名称：</strong>${String(b.projectName)}</p>`);
    if (b.equipmentName) lines.push(`<p><strong>采购设备：</strong>${String(b.equipmentName)}</p>`);
    if (b.projectOverview) lines.push(`<p><strong>项目概况：</strong>${String(b.projectOverview)}</p>`);
    if (b.deliveryDateText) lines.push(`<p><strong>交货期：</strong>${String(b.deliveryDateText)}</p>`);
    if (b.deliveryLocation) lines.push(`<p><strong>交货地点：</strong>${String(b.deliveryLocation)}</p>`);
    if (b.qualificationRequirementType?.length) {
      lines.push(`<p><strong>资质要求：</strong>${b.qualificationRequirementType.join('、')}</p>`);
    }
    if (b.qualificationRequirementOther) {
      lines.push(`<p><strong>其他资质：</strong>${String(b.qualificationRequirementOther)}</p>`);
    }
    if (b.performanceRequirementType) {
      const hasPerformance = b.performanceRequirementType === 'has';
      lines.push(`<p><strong>业绩要求：</strong>${hasPerformance ? '需要' : '不需要'}，${b.performanceYears || 0}年内有效</p>`);
    }
    if (b.performanceType) lines.push(`<p><strong>业绩说明：</strong>${String(b.performanceType)}</p>`);
    if (b.acceptAgentBid) {
      lines.push(`<p><strong>接受代理商：</strong>${b.acceptAgentBid === 'accept' ? '是' : '否'}</p>`);
    }
    if (b.acceptJointBid !== undefined && b.acceptJointBid !== null) {
      lines.push(`<p><strong>接受联合体：</strong>${b.acceptJointBid === 'accept' ? '是' : '否'}</p>`);
    }
    if (b.bidDocumentFee) lines.push(`<p><strong>招标文件售价：</strong>${Number(b.bidDocumentFee)}元</p>`);
    if (b.contactPerson) {
      const contactInfo = [b.contactPerson, b.contactPhone, b.contactEmail].filter(Boolean).join(' ');
      if (contactInfo) lines.push(`<p><strong>联系人：</strong>${contactInfo}</p>`);
    }
    lines.push('</div>');
  }

  if (data.bidderInstructions) {
    lines.push('<div class="section"><h4>📌 投标人须知</h4>');
    const bi = data.bidderInstructions;
    if (bi.evaluationMethodType) {
      lines.push(`<p><strong>评标办法：</strong>${bi.evaluationMethodType === 'comprehensive' ? '综合评分法' : '最低价法'}</p>`);
    }
    if (bi.capitalSourceAndRatio) lines.push(`<p><strong>资金来源：</strong>${String(bi.capitalSourceAndRatio)}</p>`);
    if (bi.qualityStandard) lines.push(`<p><strong>质量标准：</strong>${String(bi.qualityStandard)}</p>`);
    if (bi.preMeetingRequired) {
      lines.push(`<p><strong>投标预备会：</strong>${bi.preMeetingRequired === 'yes' ? '需要' : '不需要'}</p>`);
    }
    if (bi.bidBond) lines.push(`<p><strong>投标保证金：</strong>${String(bi.bidBond)}</p>`);
    if (bi.performanceBond) lines.push(`<p><strong>履约保证金：</strong>${String(bi.performanceBond)}</p>`);
    if (bi.paymentMethod) lines.push(`<p><strong>付款方式：</strong>${String(bi.paymentMethod)}</p>`);
    if (bi.acceptanceStandard) lines.push(`<p><strong>验收标准：</strong>${String(bi.acceptanceStandard)}</p>`);
    if (bi.technicalDocumentsRequired) lines.push(`<p><strong>技术文件要求：</strong>${String(bi.technicalDocumentsRequired)}</p>`);
    lines.push('</div>');
  }

  if (data.comprehensiveScoring || data.priceScoring) {
    // 兼容价格评分表在顶层或嵌套在comprehensiveScoring内
    const comprehensiveScoring = data.comprehensiveScoring || {};
    const priceScoringData = comprehensiveScoring.priceScoring || data.priceScoring || {};
    lines.push('<div class="section"><h4>📊 综合评分法</h4>');
    if (comprehensiveScoring.commercialScoring?.items?.length) {
      const total = comprehensiveScoring.commercialScoring.items.reduce((s, i) => s + (Number(i.score) || 0), 0);
      lines.push(`<p><strong>商务评分：</strong>${comprehensiveScoring.commercialScoring.items.length}项，总分${total}分</p>`);
    }
    if (comprehensiveScoring.technicalScoring?.items?.length) {
      const total = comprehensiveScoring.technicalScoring.items.reduce((s, i) => s + (Number(i.score) || 0), 0);
      lines.push(`<p><strong>技术评分：</strong>${comprehensiveScoring.technicalScoring.items.length}项，总分${total}分</p>`);
    }
    if (priceScoringData.items?.length) {
      const total = priceScoringData.items.reduce((s, i) => s + (Number(i.score) || 0), 0);
      lines.push(`<p><strong>价格评分：</strong>${priceScoringData.items.length}项，总分${total}分</p>`);
    }
    lines.push('</div>');
  }

  return lines.join('');
}

// 监听生成内容变化时更新格式化后的内容
watch(generatedContent, (newVal) => {
  formattedContent.value = formatAIResponse(newVal);
}, { immediate: true });

/**
 * 生成表单内容
 */
const handleGenerate = async () => {
  if (!userPrompt.value.trim()) return;

  isGenerating.value = true;
  errorMessage.value = '';
  generatedContent.value = null;

  const result = await generateBiddingFormByPrompt(userPrompt.value, props.currentFormData);

  isGenerating.value = false;

  if (result.success && result.data) {
    generatedContent.value = result.data;
  } else {
    errorMessage.value = result.error || '生成失败，请重试';
  }
};

/**
 * 重新生成
 */
const handleRegenerate = () => {
  generatedContent.value = null;
  handleGenerate();
};

/**
 * 应用到表单
 */
const handleApply = () => {
  if (generatedContent.value) {
    emit('apply', generatedContent.value);
    handleClose();
  }
};

/**
 * 关闭对话框
 */
const handleClose = () => {
  visible.value = false;
};

/**
 * 对话框关闭时重置状态
 */
watch(visible, (val) => {
  if (!val) {
    setTimeout(() => {
      userPrompt.value = '';
      generatedContent.value = null;
      errorMessage.value = '';
      isGenerating.value = false;
      showRawJson.value = false;
    }, 300);
  }
});
</script>

<style scoped>
.ai-content {
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-color);
}

.raw-json {
  max-height: 400px;
  overflow: auto;
  background: #f5f5f5;
  border-radius: 4px;
  padding: 12px;
}

.ai-content :deep(.section) {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.ai-content :deep(.section:last-child) {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.ai-content :deep(h4) {
  margin: 0 0 12px 0;
  color: var(--primary-color);
  font-size: 15px;
}

.ai-content :deep(p) {
  margin: 6px 0;
}

.ai-content :deep(strong) {
  color: var(--text-color-secondary);
  font-weight: 500;
}
</style>
