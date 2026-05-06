<!--
  @component ScoringStep
  @description 招标表单步骤3：综合评分法
-->
<template>
  <div class="scoring-step">
    <!-- 综合评分总分统计 -->
    <div class="public-bidding__scoring-summary">
      <div class="scoring-summary__card">
        <span class="scoring-summary__label">商务评分总分：</span>
        <span class="scoring-summary__value">{{
          calculateTotalScore("commercial")
        }}</span>
      </div>
      <div class="scoring-summary__card">
        <span class="scoring-summary__label">技术评分总分：</span>
        <span class="scoring-summary__value">{{
          calculateTotalScore("technical")
        }}</span>
      </div>
      <div class="scoring-summary__card">
        <span class="scoring-summary__label">价格评分总分：</span>
        <span class="scoring-summary__value">{{
          calculateTotalScore("price")
        }}</span>
      </div>
      <div class="scoring-summary__card scoring-summary__card--total">
        <span class="scoring-summary__label">综合评分总分：</span>
        <span class="scoring-summary__value scoring-summary__value--total"
          >{{
            calculateTotalScore("commercial") +
            calculateTotalScore("technical") +
            calculateTotalScore("price")
          }}</span
        >
      </div>
    </div>

    <!-- 商务评分表 -->
    <div
      style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px"
    >
      <h3 class="public-bidding__section-title" style="margin: 0">
        商务评分表
      </h3>
      <n-button size="small" type="info" @click="emit('open-commercial-import')">
        导入评分项
      </n-button>
    </div>
    <div class="public-bidding__scoring-table-wrapper">
      <table class="public-bidding__scoring-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>指标分项名</th>
            <th>分值</th>
            <th>打分标准</th>
            <th class="scoring-table__action-col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in formData.comprehensiveScoring
              ?.commercialScoring.items"
            :key="item.index"
          >
            <td>{{ index + 1 }}</td>
            <td>
              <n-input
                v-model:value="item.itemName"
                placeholder="请输入指标分项名"
              />
            </td>
            <td>
              <n-input-number
                v-model:value="item.score"
                :min="0"
                :step="0.1"
                placeholder="请输入分值"
                style="width: 100%"
              />
            </td>
            <td>
              <n-input
                v-model:value="item.scoringStandard"
                placeholder="请输入打分标准"
              />
            </td>
            <td class="scoring-table__action-col">
              <n-button
                size="small"
                type="error"
                @click="emit('remove-commercial', index)"
              >
                删除
              </n-button>
            </td>
          </tr>
          <tr
            v-if="
              !formData.comprehensiveScoring?.commercialScoring.items ||
              formData.comprehensiveScoring.commercialScoring.items.length === 0
            "
          >
            <td colspan="5" class="scoring-table__empty-row">
              暂无数据，请点击下方按钮添加
            </td>
          </tr>
          <!-- 分值合计行 -->
          <tr
            v-if="
              formData.comprehensiveScoring?.commercialScoring.items &&
              formData.comprehensiveScoring.commercialScoring.items.length > 0
            "
            class="scoring-table__total-row"
          >
            <td colspan="5" class="scoring-table__total-cell">
              分值：{{ calculateTotalScore("commercial") }}
            </td>
          </tr>
        </tbody>
      </table>
      <n-button
        @click="emit('add-commercial')"
        type="primary"
        dashed
        class="public-bidding__add-row-btn"
      >
        + 增加行
      </n-button>
    </div>

    <!-- 技术评分表 -->
    <div
      style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px"
    >
      <h3 class="public-bidding__section-title" style="margin: 0">
        技术评分表
      </h3>
      <n-button size="small" type="info" @click="emit('open-technical-import')">
        导入评分项
      </n-button>
    </div>
    <div class="public-bidding__scoring-table-wrapper">
      <table class="public-bidding__scoring-table">
        <thead>
          <tr>
            <th>序号</th>
            <th>指标分项名</th>
            <th>分值</th>
            <th>打分标准</th>
            <th class="scoring-table__action-col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in formData.comprehensiveScoring
              ?.technicalScoring.items"
            :key="item.index"
          >
            <td>{{ index + 1 }}</td>
            <td>
              <n-input
                v-model:value="item.itemName"
                placeholder="请输入指标分项名"
              />
            </td>
            <td>
              <n-input-number
                v-model:value="item.score"
                :min="0"
                :step="0.1"
                placeholder="请输入分值"
                style="width: 100%"
              />
            </td>
            <td>
              <n-input
                v-model:value="item.scoringStandard"
                placeholder="请输入打分标准"
              />
            </td>
            <td class="scoring-table__action-col">
              <n-button
                size="small"
                type="error"
                @click="emit('remove-technical', index)"
              >
                删除
              </n-button>
            </td>
          </tr>
          <tr
            v-if="
              !formData.comprehensiveScoring?.technicalScoring.items ||
              formData.comprehensiveScoring.technicalScoring.items.length === 0
            "
          >
            <td colspan="5" class="scoring-table__empty-row">
              暂无数据，请点击下方按钮添加
            </td>
          </tr>
          <!-- 分值合计行 -->
          <tr
            v-if="
              formData.comprehensiveScoring?.technicalScoring.items &&
              formData.comprehensiveScoring.technicalScoring.items.length > 0
            "
            class="scoring-table__total-row"
          >
            <td colspan="5" class="scoring-table__total-cell">
              分值：{{ calculateTotalScore("technical") }}
            </td>
          </tr>
        </tbody>
      </table>
      <n-button
        @click="emit('add-technical')"
        type="primary"
        dashed
        class="public-bidding__add-row-btn"
      >
        + 增加行
      </n-button>
    </div>

    <!-- 价格评分表 -->
    <div
      style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px"
    >
      <h3 class="public-bidding__section-title" style="margin: 0">
        价格评分表
      </h3>
      <n-button size="small" type="info" @click="emit('open-price-import')">
        导入评分项
      </n-button>
    </div>
    <div class="public-bidding__scoring-table-wrapper">
      <table
        class="public-bidding__scoring-table public-bidding__scoring-table--price"
      >
        <thead>
          <tr>
            <th>序号</th>
            <th>分值</th>
            <th>打分标准</th>
            <th class="scoring-table__action-col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in formData.comprehensiveScoring
              ?.priceScoring.items"
            :key="item.index"
          >
            <td>{{ index + 1 }}</td>
            <td>
              <n-input-number
                v-model:value="item.score"
                :min="0"
                :step="0.1"
                placeholder="请输入分值"
                style="width: 100%"
              />
            </td>
            <td>
              <n-input
                v-model:value="item.scoringStandard"
                placeholder="请输入打分标准"
              />
            </td>
            <td class="scoring-table__action-col">
              <n-button
                size="small"
                type="error"
                @click="emit('remove-price', index)"
              >
                删除
              </n-button>
            </td>
          </tr>
          <tr
            v-if="
              !formData.comprehensiveScoring?.priceScoring.items ||
              formData.comprehensiveScoring.priceScoring.items.length === 0
            "
          >
            <td colspan="4" class="scoring-table__empty-row">
              暂无数据，请点击下方按钮添加
            </td>
          </tr>
          <!-- 分值合计行 -->
          <tr
            v-if="
              formData.comprehensiveScoring?.priceScoring.items &&
              formData.comprehensiveScoring.priceScoring.items.length > 0
            "
            class="scoring-table__total-row"
          >
            <td colspan="4" class="scoring-table__total-cell">
              分值：{{ calculateTotalScore("price") }}
            </td>
          </tr>
        </tbody>
      </table>
      <n-button
        @click="emit('add-price')"
        type="primary"
        dashed
        class="public-bidding__add-row-btn"
      >
        + 增加行
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBiddingFormData } from "../types";

/**
 * Props
 */
interface Props {
  /** 表单数据 */
  formData: IBiddingFormData;
}

const props = defineProps<Props>();

/**
 * Emits
 */
interface Emits {
  /** 添加商务评分行 */
  (e: "add-commercial"): void;
  /** 添加技术评分行 */
  (e: "add-technical"): void;
  /** 添加价格评分行 */
  (e: "add-price"): void;
  /** 删除商务评分行 */
  (e: "remove-commercial", index: number): void;
  /** 删除技术评分行 */
  (e: "remove-technical", index: number): void;
  /** 删除价格评分行 */
  (e: "remove-price", index: number): void;
  /** 打开商务评分导入弹窗 */
  (e: "open-commercial-import"): void;
  /** 打开技术评分导入弹窗 */
  (e: "open-technical-import"): void;
  /** 打开价格评分导入弹窗 */
  (e: "open-price-import"): void;
}

const emit = defineEmits<Emits>();

/**
 * 计算总分值
 * @param tableType 表格类型（commercial/technical/price）
 * @returns 总分值
 */
const calculateTotalScore = (
  tableType: "commercial" | "technical" | "price",
): number => {
  if (!props.formData.comprehensiveScoring) {
    return 0;
  }
  let items;
  if (tableType === "commercial") {
    items = props.formData.comprehensiveScoring.commercialScoring.items;
  } else if (tableType === "technical") {
    items = props.formData.comprehensiveScoring.technicalScoring.items;
  } else {
    items = props.formData.comprehensiveScoring.priceScoring.items;
  }
  return items.reduce((sum, item) => sum + (item.score ?? 0), 0);
};
</script>

<style scoped>
.scoring-step {
  padding: 16px 0;
}

/* 评分表容器 */
.public-bidding__scoring-table-wrapper {
  margin-bottom: 32px;
}

/* 评分表样式 */
.public-bidding__scoring-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 12px;
}

.public-bidding__scoring-table th,
.public-bidding__scoring-table td {
  border: 1px solid #e5e5e5;
  padding: 8px 12px;
  text-align: left;
}

.public-bidding__scoring-table th {
  background-color: #fafafa;
  font-weight: 600;
}

/* 评分表总分行 */
.scoring-table__total-row {
  background-color: #f5f5f5;
}

.scoring-table__total-cell {
  text-align: center;
  font-weight: 600;
  color: #18a058;
  font-size: 14px;
  padding: 12px;
}

.scoring-table__empty-row {
  text-align: center;
  color: #999;
  padding: 24px;
}

/* 评分表列宽 */
.public-bidding__scoring-table th:nth-child(1),
.public-bidding__scoring-table td:nth-child(1) {
  width: 60px;
}

.public-bidding__scoring-table th:nth-child(2),
.public-bidding__scoring-table td:nth-child(2) {
  width: auto;
  min-width: 150px;
}

.public-bidding__scoring-table th:nth-child(3),
.public-bidding__scoring-table td:nth-child(3) {
  width: 120px;
}

.public-bidding__scoring-table th:nth-child(4),
.public-bidding__scoring-table td:nth-child(4) {
  width: auto;
}

.scoring-table__action-col {
  width: 80px;
  text-align: center;
}

/* 价格评分表列宽（4列表格） */
.public-bidding__scoring-table--price th:nth-child(1),
.public-bidding__scoring-table--price td:nth-child(1) {
  width: 60px;
}

.public-bidding__scoring-table--price th:nth-child(2),
.public-bidding__scoring-table--price td:nth-child(2) {
  width: 120px;
}

.public-bidding__scoring-table--price th:nth-child(3),
.public-bidding__scoring-table--price td:nth-child(3) {
  width: auto;
}

/* 增加行按钮 */
.public-bidding__add-row-btn {
  width: 100%;
}

/* 综合评分总分统计 */
.public-bidding__scoring-summary {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.scoring-summary__card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  flex: 1;
  min-width: 200px;
}

.scoring-summary__card--total {
  background-color: #ecfdf5;
  border-color: #18a058;
  flex: 100%;
}

.scoring-summary__label {
  font-size: 14px;
  color: #606266;
}

.scoring-summary__value {
  font-size: 18px;
  font-weight: 600;
  color: #18a058;
}

.scoring-summary__value--total {
  font-size: 20px;
  color: #18a058;
}
</style>