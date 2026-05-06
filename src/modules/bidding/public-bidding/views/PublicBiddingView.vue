<!--
  @component PublicBiddingView
  @description 公开招标-标准材料/设备招标采购申请表单页面
-->
<template>
  <div class="public-bidding">
    <!-- 页面头部 -->
    <div class="public-bidding__header">
      <h1 class="public-bidding__title">
        公开招标-标准材料/设备招标采购申请表
      </h1>

      <!-- 固定在右上角的操作按钮 -->
      <div class="public-bidding__fixed-actions">
        <n-space>
          <n-button type="success" @click="handleSubmit" :loading="submitting">
            提交
          </n-button>
          <n-button type="info" @click="handleExportWord" :loading="exporting">
            导出Word
          </n-button>
          <n-button @click="handleReset" type="warning">重置表单</n-button>
        </n-space>
      </div>
    </div>

    <!-- 步骤进度条 -->
    <n-card class="public-bidding__steps-card">
      <n-steps :current="currentStep">
        <n-step
          title="基础信息"
          description="填写项目基本信息"
          @click="() => handleStepClick(1)"
        />
        <n-step
          title="投标人须知"
          description="填写投标人须知内容"
          @click="() => handleStepClick(2)"
        />
        <n-step
          v-if="showStep3"
          title="综合评分法"
          description="填写综合评分法相关内容"
          @click="() => handleStepClick(3)"
        />
      </n-steps>
    </n-card>

    <!-- 表单内容区域 -->
    <n-card class="public-bidding__form-card">
      <n-form
        ref="formRef"
        :model="formData"
        label-placement="left"
        label-width="140px"
        require-mark-placement="right"
      >
        <!-- 步骤一：基础信息 -->
        <div v-show="currentStep === 1" class="public-bidding__step-content">
          <BasicInfoStep :form-data="formData" />
        </div>

        <!-- 步骤二：投标人须知 -->
        <div v-show="currentStep === 2" class="public-bidding__step-content">
          <BidderInstructionsStep :form-data="formData" />
        </div>

        <!-- 步骤三：综合评分法 -->
        <div
          v-if="showStep3 && currentStep === 3"
          class="public-bidding__step-content"
        >
          <ScoringStep
            :form-data="formData"
            @add-commercial="addCommercialRow"
            @add-technical="addTechnicalRow"
            @add-price="addPriceRow"
            @remove-commercial="removeCommercialRow"
            @remove-technical="removeTechnicalRow"
            @remove-price="removePriceRow"
            @open-commercial-import="openCommercialImportModal"
            @open-technical-import="openTechnicalImportModal"
            @open-price-import="openPriceImportModal"
          />
        </div>
      </n-form>
    </n-card>

    <!-- 草稿恢复提示 -->
    <n-modal
      v-model:show="showDraftRestoreModal"
      preset="dialog"
      title="发现草稿"
      content="系统检测到您之前保存的草稿，是否恢复？"
      :positive-text="'恢复草稿'"
      :negative-text="'丢弃草稿'"
      @positive-click="handleRestoreDraft"
      @negative-click="handleDiscardDraft"
    />

    <!-- 右下角悬浮按钮组 -->
    <HistoryFloatButton
      @open-history="historyDrawerVisible = true"
      @open-ai="handleAIFill"
    />

    <!-- AI智能填单对话框 -->
    <AIFillDialog
      v-model:visible="aiDialogVisible"
      :current-form-data="formData"
      @apply="handleAIApply"
    />

    <!-- 历史项目抽屉 -->
    <HistoryProjectDrawer
      v-model="historyDrawerVisible"
      @select-project="handleCloneProject"
    />

    <!-- 商务评分表导入模态框 -->
    <n-modal
      v-model:show="commercialImportModalVisible"
      preset="card"
      title="选择商务评分项（参考）"
      style="width: 600px; max-width: 90vw"
      :segmented="{ content: true, footer: true }"
    >
      <n-checkbox-group v-model:value="commercialImportSelected">
        <n-space vertical>
          <n-checkbox
            v-for="item in commercialScoringTemplateList"
            :key="item.id"
            :value="item.id"
            :label="`${item.itemName}（分值：${item.score}）`"
            style="margin-bottom: 8px"
          />
        </n-space>
      </n-checkbox-group>
      <template #footer>
        <n-space justify="end">
          <n-button @click="commercialImportModalVisible = false">取消</n-button>
          <n-button
            type="primary"
            :disabled="commercialImportSelected.length === 0"
            @click="confirmImportCommercial"
          >
            导入（{{ commercialImportSelected.length }}项）
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 技术评分表导入模态框 -->
    <n-modal
      v-model:show="technicalImportModalVisible"
      preset="card"
      title="选择技术评分项（参考）"
      style="width: 600px; max-width: 90vw"
      :segmented="{ content: true, footer: true }"
    >
      <n-checkbox-group v-model:value="technicalImportSelected">
        <n-space vertical>
          <n-checkbox
            v-for="item in technicalScoringTemplateList"
            :key="item.id"
            :value="item.id"
            :label="`${item.itemName}（分值：${item.score}）`"
            style="margin-bottom: 8px"
          />
        </n-space>
      </n-checkbox-group>
      <template #footer>
        <n-space justify="end">
          <n-button @click="technicalImportModalVisible = false">取消</n-button>
          <n-button
            type="primary"
            :disabled="technicalImportSelected.length === 0"
            @click="confirmImportTechnical"
          >
            导入（{{ technicalImportSelected.length }}项）
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 价格评分表导入模态框 -->
    <n-modal
      v-model:show="priceImportModalVisible"
      preset="card"
      title="选择价格评分项（参考）"
      style="width: 600px; max-width: 90vw"
      :segmented="{ content: true, footer: true }"
    >
      <n-checkbox-group v-model:value="priceImportSelected">
        <n-space vertical>
          <n-checkbox
            v-for="item in priceScoringTemplateList"
            :key="item.id"
            :value="item.id"
            :label="`${item.itemName}（分值：${item.score}）`"
            style="margin-bottom: 8px"
          />
        </n-space>
      </n-checkbox-group>
      <template #footer>
        <n-space justify="end">
          <n-button @click="priceImportModalVisible = false">取消</n-button>
          <n-button
            type="primary"
            :disabled="priceImportSelected.length === 0"
            @click="confirmImportPrice"
          >
            导入（{{ priceImportSelected.length }}项）
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useMessage, useDialog } from "naive-ui";
import {
  createEmptyFormData,
  saveDraftToLocalStorage,
  loadDraftFromLocalStorage,
  removeDraftFromLocalStorage,
  hasDraftInStorage,
  getDraftSavedTime,
  submitBiddingForm,
  AUTO_SAVE_INTERVAL,
  exportWordDocumentWithProgress,
} from "../services";
import { getTodayTimestamp } from "@/utils/common/date";
import type { IBiddingFormData, IHistoryProject } from "../types";
import {
  BasicInfoStep,
  BidderInstructionsStep,
  ScoringStep,
  HistoryFloatButton,
  HistoryProjectDrawer,
  AIFillDialog,
} from "../components";

/**
 * 消息提示
 */
const message = useMessage();
/**
 * 对话框
 */
const dialog = useDialog();

/**
 * 步骤状态
 */
const currentStep = ref(1);

/**
 * 表单引用
 */
const formRef = ref();

/**
 * 提交状态
 */
const submitting = ref(false);

/**
 * 导出状态
 */
const exporting = ref(false);

/**
 * 草稿相关
 */
const showDraftRestoreModal = ref(false);
const lastSavedTime = ref("");

/**
 * 历史项目抽屉相关
 */
const historyDrawerVisible = ref(false);

/**
 * AI填单相关
 */
const aiDialogVisible = ref(false);

/**
 * 商务评分表导入模态框相关
 */
const commercialImportModalVisible = ref(false);
const commercialImportSelected = ref<string[]>([]);

/**
 * 商务评分表预定义列表
 */
const commercialScoringTemplateList = [
  {
    id: "1",
    itemName: "企业管理体系认证情况",
    score: 10,
    scoringStandard:
      "通过ISO质量管理体系认证的得  分；通过环境管理体系认证的得  分；通过职业健康安全管理认证的得   分。",
  },
  {
    id: "2",
    itemName: "信誉",
    score: 10,
    scoringStandard:
      "具有AAA级资信等级证书的得   分；具有AA级资信等级证书的得   分；具有A级资信等级证书及以下的得   分。",
  },
  {
    id: "3",
    itemName: "对招标文件商务条款的响应程度",
    score: 10,
    scoringStandard:
      "根据投标人所提供的投标文件对招标文件商务条款的响应程度进行评审打分项，完全响应得 分，部分响应得   分，不响应得   分。",
  },
  {
    id: "4",
    itemName: "供应商评级",
    score: 10,
    scoringStandard: "提供完整的质量保证措施",
  },
  {
    id: "5",
    itemName: "供货商问题记录",
    score: 10,
    scoringStandard:
      "近五年内在中冶长天供货商问题库中有严重问题记录的供应商，每条扣   分，一般问题每条扣   分， 有重大问题记录的，评委有权力否决其投标。",
  },
  {
    id: "6",
    itemName: "投标设备的业绩",
    score: 10,
    scoringStandard:
      "有效业绩证明指在本招标文件所要求年度内，金额不低于    万元的类似设备的供货合同（提供的业绩必须为投标人自身的项目业绩的合同扫描件（价格可隐去），否则不计分，同一项目的补充合同不计为新的业绩（原件备查验）。）每提供一个有效业绩证明，得      分，最高得   分。未提供有效业绩证明材料的不得分。",
  },
];

/**
 * 技术评分表导入模态框相关
 */
const technicalImportModalVisible = ref(false);
const technicalImportSelected = ref<string[]>([]);

/**
 * 技术评分表预定义列表
 */
const technicalScoringTemplateList = [
  {
    id: "1",
    itemName: "标书响应性",
    score: 10,
    scoringStandard:
      "根据标书响应性评分，每有一处不符合项扣      分，扣完为止。",
  },
  {
    id: "2",
    itemName: "对投标设备整体评价",
    score: 10,
    scoringStandard:
      "所投标的设备完全符合招标文件的规定，技术指标无偏差或提出的技术偏差能够满足采购项目的使用要求，得   分；所投标的设备基本符合招标文件的规定，技术指标有偏差或提出的技术偏差基本能满足采购项目的使用要求，得   分；所投标的设备不符合招标文件规定，技术偏差不能满足采购项目的使用要求，不得分 。",
  },
  {
    id: "3",
    itemName: "投标设备技术性能指标响应程度",
    score: 10,
    scoringStandard:
      "所投标设备的质量标准完全响应招标文件的要求，得   分；所投标设备的质量标准基本响应招标文件的要求，得   分；所投标设备的质量标准不响应招标文件的要求，不得分 。",
  },
  {
    id: "4",
    itemName: "对投标人技术服务和质保期服务能力的评价",
    score: 10,
    scoringStandard:
      "投标人相关服务能力好、服务方案完善的，得   分；投标人相关服务能力较好、服务方案较完善的， 得   分；投标人相关服务能力一般、服务方案不完善的，得    分。",
  },
  {
    id: "5",
    itemName: "对投标人生产能力的评价",
    score: 10,
    scoringStandard:
      "投标人生产能力在所有投标人中最强的，得   分；投标人生产能力较强的， 得     分；投标人生产能力较弱的，得     分。",
  },
  {
    id: "6",
    itemName: "生产设备及检测设备的先进性",
    score: 10,
    scoringStandard:
      "投标人生产设备及检测设备在所有投标人中最先进的，得   分；投标人生产设备及检测设备较先进的，得     分；投标人生产设备及检测设备较差的，得     分。",
  },
  {
    id: "7",
    itemName: "包装、运输方案",
    score: 10,
    scoringStandard:
      "包装、运输方案合理的，得   分；包装、运输方案较合理的，得   分；包装、运输方案一般或不合理的，得   分。",
  },
  {
    id: "8",
    itemName: "供货计划及供货保障措施",
    score: 10,
    scoringStandard:
      "计划及保障措施合理的，得   分；计划及保障措施较合理的，得   分；计划及保障措施一般或不合理的，得   分。",
  },
  {
    id: "9",
    itemName: "服务承诺",
    score: 10,
    scoringStandard:
      "承诺内容完善的，得   分；承诺内容较完善的，得   分；无承诺或承诺内容一般或不完善的，得   分。",
  },
];

/**
 * 价格评分表导入模态框相关
 */
const priceImportModalVisible = ref(false);
const priceImportSelected = ref<string[]>([]);

/**
 * 价格评分表预定义列表
 */
const priceScoringTemplateList = [
  {
    id: "1",
    itemName: "投标报价评审得分",
    score: 50,
    scoringStandard: "投标报价得分=(评标基准价/投标报价)×投标报价总分值",
  },
  {
    id: "2",
    itemName: "税率不一致的情况",
    score: 10,
    scoringStandard: "各投标人的投标税率不一致时，以不含税价格进行评审。",
  },
];

/**
 * 表单数据
 */
const formData = ref<IBiddingFormData>(createEmptyFormData());

/**
 * 是否显示步骤三（综合评分法）
 * 仅当选择了综合评分法时才显示步骤三
 */
const showStep3 = computed(
  () => formData.value.bidderInstructions.evaluationMethodType === "comprehensive",
);

/**
 * 处理步骤条点击
 * 平级结构，允许自由切换步骤
 */
const handleStepClick = (step: number) => {
  if (step === currentStep.value) return;

  // 如果尝试跳转到步骤三但步骤三不可见，阻止跳转
  if (step === 3 && !showStep3.value) {
    return;
  }

  // 直接切换步骤（平级结构，无需验证）
  currentStep.value = step;
  saveDraft();
};

/**
 * 保存草稿
 */
const saveDraft = () => {
  const success = saveDraftToLocalStorage(formData.value, currentStep.value);
  if (success) {
    lastSavedTime.value = new Date().toLocaleString("zh-CN");
  }
};

/**
 * 恢复草稿
 */
const handleRestoreDraft = () => {
  const draft = loadDraftFromLocalStorage();
  if (draft) {
    formData.value = draft.formData;
    currentStep.value = draft.currentStep;
    lastSavedTime.value = new Date(draft.savedAt).toLocaleString("zh-CN");
    message.success("草稿已恢复");
  }
  showDraftRestoreModal.value = false;
};

/**
 * 丢弃草稿
 */
const handleDiscardDraft = () => {
  removeDraftFromLocalStorage();
  lastSavedTime.value = "";
  showDraftRestoreModal.value = false;
  message.info("草稿已丢弃");
};

/**
 * 重置表单
 */
const handleReset = () => {
  dialog.warning({
    title: "确认重置",
    content: "确定要重置所有表单数据吗？此操作不可恢复。",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      formData.value = createEmptyFormData();
      removeDraftFromLocalStorage();
      currentStep.value = 1;
      lastSavedTime.value = "";
      message.success("表单已重置");
    },
  });
};

/**
 * 提交表单
 */
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
  } catch {
    message.error("请完善所有必填信息");
    return;
  }

  submitting.value = true;
  try {
    await submitBiddingForm(formData.value);
    message.success("提交成功");
    removeDraftFromLocalStorage();
  } catch (error) {
    message.error("提交失败，请重试");
  } finally {
    submitting.value = false;
  }
};

/**
 * 导出 Word 文档
 */
const handleExportWord = async () => {
  // 验证必填字段
  const { basicInfo, bidderInstructions } = formData.value;
  if (!basicInfo.projectName || !basicInfo.bidNumber) {
    message.warning("请完善项目名称和招标编号后再导出");
    return;
  }

  exporting.value = true;
  try {
    // 根据评标办法选择模板
    const templateFileName =
      bidderInstructions.evaluationMethodType === "comprehensive"
        ? "物资设备类招标文件示范文本-公开招标-综合评分法.docx"
        : "物资设备类招标文件示范文本-公开招标-最低价中标.docx";

    const result = await exportWordDocumentWithProgress(
      formData.value,
      () => {
        // 进度回调（暂不展示具体进度）
      },
      {
        templatePath: `/void-frontend/v3template/${templateFileName}`,
        outputFileName: `公开设备招标文件_${basicInfo.bidNumber}`,
      },
    );

    if (result.success) {
      message.success("Word 文档导出成功");
    } else {
      message.error(`导出失败: ${result.error || "未知错误"}`);
    }
  } catch (error) {
    message.error("导出失败，请重试");
    console.error("导出异常:", error);
  } finally {
    exporting.value = false;
  }
};

/**
 * 自动保存定时器
 */
let autoSaveTimer: number | null = null;

/**
 * 综合评分法 - 打开商务评分表导入模态框
 */
const openCommercialImportModal = () => {
  commercialImportSelected.value = [];
  commercialImportModalVisible.value = true;
};

/**
 * 综合评分法 - 确认导入商务评分表
 */
const confirmImportCommercial = () => {
  if (!formData.value.comprehensiveScoring) {
    formData.value.comprehensiveScoring = {
      commercialScoring: { items: [] },
      technicalScoring: { items: [] },
      priceScoring: { items: [] },
    };
  }

  const selectedItems = commercialScoringTemplateList.filter((item) =>
    commercialImportSelected.value.includes(item.id),
  );

  selectedItems.forEach((item) => {
    formData.value.comprehensiveScoring!.commercialScoring.items.push({
      index: Date.now() + Math.random(),
      itemName: item.itemName,
      score: item.score,
      scoringStandard: item.scoringStandard,
    });
  });

  commercialImportModalVisible.value = false;
  message.success(`成功导入 ${selectedItems.length} 项`);
};

/**
 * 综合评分法 - 打开技术评分表导入模态框
 */
const openTechnicalImportModal = () => {
  technicalImportSelected.value = [];
  technicalImportModalVisible.value = true;
};

/**
 * 综合评分法 - 确认导入技术评分表
 */
const confirmImportTechnical = () => {
  if (!formData.value.comprehensiveScoring) {
    formData.value.comprehensiveScoring = {
      commercialScoring: { items: [] },
      technicalScoring: { items: [] },
      priceScoring: { items: [] },
    };
  }

  const selectedItems = technicalScoringTemplateList.filter((item) =>
    technicalImportSelected.value.includes(item.id),
  );

  selectedItems.forEach((item) => {
    formData.value.comprehensiveScoring!.technicalScoring.items.push({
      index: Date.now() + Math.random(),
      itemName: item.itemName,
      score: item.score,
      scoringStandard: item.scoringStandard,
    });
  });

  technicalImportModalVisible.value = false;
  message.success(`成功导入 ${selectedItems.length} 项`);
};

/**
 * 综合评分法 - 打开价格评分表导入模态框
 */
const openPriceImportModal = () => {
  priceImportSelected.value = [];
  priceImportModalVisible.value = true;
};

/**
 * 综合评分法 - 确认导入价格评分表
 */
const confirmImportPrice = () => {
  if (!formData.value.comprehensiveScoring) {
    formData.value.comprehensiveScoring = {
      commercialScoring: { items: [] },
      technicalScoring: { items: [] },
      priceScoring: { items: [] },
    };
  }

  const selectedItems = priceScoringTemplateList.filter((item) =>
    priceImportSelected.value.includes(item.id),
  );

  selectedItems.forEach((item) => {
    formData.value.comprehensiveScoring!.priceScoring.items.push({
      index: Date.now() + Math.random(),
      itemName: item.itemName,
      score: item.score,
      scoringStandard: item.scoringStandard,
    });
  });

  priceImportModalVisible.value = false;
  message.success(`成功导入 ${selectedItems.length} 项`);
};

/**
 * 综合评分法 - 增加商务评分表行
 */
const addCommercialRow = () => {
  if (!formData.value.comprehensiveScoring) {
    formData.value.comprehensiveScoring = {
      commercialScoring: { items: [] },
      technicalScoring: { items: [] },
      priceScoring: { items: [] },
    };
  }
  formData.value.comprehensiveScoring.commercialScoring.items.push({
    index: Date.now(),
    itemName: "",
    score: null,
    scoringStandard: "",
  });
};

/**
 * 综合评分法 - 增加技术评分表行
 */
const addTechnicalRow = () => {
  if (!formData.value.comprehensiveScoring) {
    formData.value.comprehensiveScoring = {
      commercialScoring: { items: [] },
      technicalScoring: { items: [] },
      priceScoring: { items: [] },
    };
  }
  formData.value.comprehensiveScoring.technicalScoring.items.push({
    index: Date.now(),
    itemName: "",
    score: null,
    scoringStandard: "",
  });
};

/**
 * 综合评分法 - 增加价格评分表行
 */
const addPriceRow = () => {
  if (!formData.value.comprehensiveScoring) {
    formData.value.comprehensiveScoring = {
      commercialScoring: { items: [] },
      technicalScoring: { items: [] },
      priceScoring: { items: [] },
    };
  }
  formData.value.comprehensiveScoring.priceScoring.items.push({
    index: Date.now(),
    itemName: "",
    score: null,
    scoringStandard: "",
  });
};

/**
 * 综合评分法 - 删除商务评分表行
 */
const removeCommercialRow = (index: number) => {
  dialog.warning({
    title: "确认删除",
    content: "确定要删除该评分项吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      formData.value.comprehensiveScoring?.commercialScoring.items.splice(index, 1);
      message.success("删除成功");
    },
  });
};

/**
 * 综合评分法 - 删除技术评分表行
 */
const removeTechnicalRow = (index: number) => {
  dialog.warning({
    title: "确认删除",
    content: "确定要删除该评分项吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      formData.value.comprehensiveScoring?.technicalScoring.items.splice(index, 1);
      message.success("删除成功");
    },
  });
};

/**
 * 综合评分法 - 删除价格评分表行
 */
const removePriceRow = (index: number) => {
  dialog.warning({
    title: "确认删除",
    content: "确定要删除该评分项吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      formData.value.comprehensiveScoring?.priceScoring.items.splice(index, 1);
      message.success("删除成功");
    },
  });
};

/**
 * 启动自动保存
 */
const startAutoSave = () => {
  autoSaveTimer = window.setInterval(() => {
    saveDraft();
  }, AUTO_SAVE_INTERVAL);
};

/**
 * 停止自动保存
 */
const stopAutoSave = () => {
  if (autoSaveTimer) {
    clearInterval(autoSaveTimer);
    autoSaveTimer = null;
  }
};

/**
 * 监听评标办法变化
 * 当从综合评分法切换到其他办法时，如果在步骤三则跳回步骤二
 */
watch(
  () => formData.value.bidderInstructions.evaluationMethodType,
  (newValue) => {
    if (currentStep.value === 3 && newValue !== "comprehensive") {
      currentStep.value = 2;
    }
  },
);

/**
 * 监听问题严重程度变化
 * 当勾选"严重"时，自动勾选"重大"（因为严重包含重大）
 */
watch(
  () => formData.value.basicInfo.issueSelectionType,
  (newValue) => {
    if (!newValue) return;

    const hasSerious = newValue.includes("serious");
    const hasMajor = newValue.includes("major");

    if (hasSerious && !hasMajor) {
      formData.value.basicInfo.issueSelectionType = [...newValue, "major"];
    }
  },
  { deep: true },
);

/**
 * 监听业绩年限变化
 * 当填写了近多少年后，自动根据招标文件封面日期推算起始日期
 */
watch(
  [
    () => formData.value.basicInfo.performanceYears,
    () => formData.value.basicInfo.coverDate,
  ],
  ([years, coverDate]) => {
    if (formData.value.basicInfo.performanceRequirementType !== "has") {
      return;
    }

    const baseDate = coverDate ? new Date(coverDate) : new Date();
    const startDate = new Date(baseDate);
    startDate.setFullYear(startDate.getFullYear() - (years || 0));
    startDate.setMonth(0);
    startDate.setDate(1);
    formData.value.basicInfo.performanceStartDate = startDate.getTime();
  },
);

/**
 * 监听诉讼仲裁年限变化
 * 当填写了近多少年后，自动根据招标文件封面日期推算起始日期
 */
watch(
  [
    () => formData.value.bidderInstructions.litigationYears,
    () => formData.value.basicInfo.coverDate,
  ],
  ([years, coverDate]) => {
    if (!years || !coverDate) {
      return;
    }

    const baseDate = new Date(coverDate);
    const startDate = new Date(baseDate);
    startDate.setFullYear(startDate.getFullYear() - years);
    formData.value.bidderInstructions.litigationStartDate = startDate.getTime();
  },
);

/**
 * 克隆历史项目
 */
const handleCloneProject = (project: IHistoryProject) => {
  dialog.info({
    title: "确认克隆项目",
    content: `确定要克隆项目「${project.projectName}」吗？当前表单数据将被覆盖。`,
    positiveText: "确定克隆",
    negativeText: "取消",
    onPositiveClick: async () => {
      formData.value = JSON.parse(JSON.stringify(project.formData));
      formData.value.basicInfo.projectName = `${project.formData.basicInfo.projectName} (副本)`;
      currentStep.value = 1;
      historyDrawerVisible.value = false;
      message.success("项目已克隆，请修改相关信息");
      await nextTick();
      saveDraft();
    },
  });
};

/**
 * 打开AI填单对话框
 */
const handleAIFill = () => {
  aiDialogVisible.value = true;
};

/**
 * 应用AI生成的内容到表单
 */
const handleAIApply = (generated: Partial<IBiddingFormData>) => {
  if (generated.basicInfo) {
    const userFilledProjectName = formData.value.basicInfo.projectName?.trim();
    const userFilledBidNumber = formData.value.basicInfo.bidNumber?.trim();

    formData.value.basicInfo = {
      ...formData.value.basicInfo,
      ...generated.basicInfo,
      projectName: userFilledProjectName || generated.basicInfo.projectName,
      bidNumber: userFilledBidNumber || generated.basicInfo.bidNumber,
    };
  }

  if (generated.bidderInstructions) {
    formData.value.bidderInstructions = {
      ...formData.value.bidderInstructions,
      ...generated.bidderInstructions,
    };
  }

  const priceScoringData = generated.comprehensiveScoring?.priceScoring;

  if (generated.comprehensiveScoring) {
    if (!formData.value.comprehensiveScoring) {
      formData.value.comprehensiveScoring = {
        commercialScoring: { items: [] },
        technicalScoring: { items: [] },
        priceScoring: { items: [] },
      };
    }

    const gen = generated.comprehensiveScoring || {};

    if (gen.commercialScoring?.items?.length) {
      const existingCommercial = formData.value.comprehensiveScoring.commercialScoring?.items || [];
      const newItems = gen.commercialScoring.items.map((item, idx) => ({
        index: Date.now() + idx,
        itemName: item.itemName || '',
        score: typeof item.score === 'number' ? item.score : null,
        scoringStandard: item.scoringStandard || '',
      }));
      formData.value.comprehensiveScoring.commercialScoring = { items: [...existingCommercial, ...newItems] };
    }

    if (gen.technicalScoring?.items?.length) {
      const existingTechnical = formData.value.comprehensiveScoring.technicalScoring?.items || [];
      const newItems = gen.technicalScoring.items.map((item, idx) => ({
        index: Date.now() + idx + 1000,
        itemName: item.itemName || '',
        score: typeof item.score === 'number' ? item.score : null,
        scoringStandard: item.scoringStandard || '',
      }));
      formData.value.comprehensiveScoring.technicalScoring = { items: [...existingTechnical, ...newItems] };
    }

    if (priceScoringData?.items?.length) {
      const existingPrice = formData.value.comprehensiveScoring.priceScoring?.items || [];
      const newItems = priceScoringData.items.map((item, idx) => ({
        index: Date.now() + idx + 2000,
        itemName: item.itemName || '',
        score: typeof item.score === 'number' ? item.score : null,
        scoringStandard: item.scoringStandard || '',
      }));
      formData.value.comprehensiveScoring.priceScoring = { items: [...existingPrice, ...newItems] };
    }
  }

  message.success("AI已生成表单内容，请检查并修改");
  saveDraft();
};

/**
 * 组件挂载
 */
onMounted(() => {
  if (hasDraftInStorage()) {
    showDraftRestoreModal.value = true;
    lastSavedTime.value = getDraftSavedTime();
  }
  if (!formData.value.basicInfo.coverDate) {
    formData.value.basicInfo.coverDate = getTodayTimestamp();
  }
  startAutoSave();
});

/**
 * 组件卸载
 */
onBeforeUnmount(() => {
  stopAutoSave();
});
</script>

<style scoped>
/* 容器 */
.public-bidding {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

/* 页面头部 */
.public-bidding__header {
  position: relative;
  margin-bottom: 24px;
  padding: 16px 0;
  text-align: center;
}

.public-bidding__title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
  color: #2080f0;
}

/* 步骤卡片 */
.public-bidding__steps-card {
  margin-bottom: 24px;
}

/* 步骤节点可点击样式 */
.public-bidding__steps-card :deep(.n-step) {
  cursor: pointer;
}

.public-bidding__steps-card :deep(.n-step:hover .n-step-indicator) {
  background-color: #e0f0ff;
}

/* 表单卡片 */
.public-bidding__form-card {
  min-height: 500px;
  margin-bottom: 24px;
}

/* 步骤内容区域 */
.public-bidding__step-content {
  padding: 16px 0;
}

/* 分节标题 */
.public-bidding__section-title {
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e5e7eb;
}

.public-bidding__section-title:first-child {
  margin-top: 0;
}

/* 子栏目标题（h4，归属于上级栏目） */
.public-bidding__subsection-title {
  margin: 16px 0 12px 0;
  padding-bottom: 6px;
  padding-left: 12px;
  font-size: 14px;
  font-weight: 550;
  color: #555;
  border-bottom: 1px dashed #e5e7eb;
}

/* 表单网格布局 */
.public-bidding__form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.public-bidding__form-grid__item--full {
  grid-column: 1 / -1;
}

/* 固定在右上角的操作按钮 */
.public-bidding__fixed-actions {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: 10;
}

.public-bidding__fixed-actions :deep(.n-space) {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.public-bidding__fixed-actions :deep(.n-space:hover) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .public-bidding {
    padding: 16px;
  }

  .public-bidding__title {
    font-size: 20px;
  }

  .public-bidding__form-grid {
    grid-template-columns: 1fr;
  }
}
</style>