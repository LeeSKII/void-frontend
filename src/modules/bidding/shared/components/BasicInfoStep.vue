<!--
  @component BasicInfoStep
  @description 招标表单步骤1：基础信息
-->
<template>
  <div class="basic-info-step">
    <h3 class="public-bidding__section-title">项目基本信息</h3>
    <div class="public-bidding__form-grid">
      <n-form-item label="招标主体" path="basicInfo.bidSubject">
        <n-select
          v-model:value="formData.basicInfo.bidSubject"
          :options="bidSubjectOptions"
          placeholder="请选择招标主体"
        />
      </n-form-item>

      <n-form-item label="项目名称" path="basicInfo.projectName">
        <n-input
          v-model:value="formData.basicInfo.projectName"
          placeholder="请输入项目名称"
          maxlength="100"
          show-count
        />
      </n-form-item>

      <n-form-item label="招标编号" path="basicInfo.bidNumber">
        <n-input
          v-model:value="formData.basicInfo.bidNumber"
          placeholder="请输入招标编号"
          maxlength="50"
        />
      </n-form-item>

      <n-form-item label="招标文件封面日期" path="basicInfo.coverDate">
        <n-date-picker
          v-model:value="formData.basicInfo.coverDate"
          type="date"
          placeholder="请选择日期"
          style="width: 100%"
        />
      </n-form-item>
    </div>

    <!-- 招标基本信息 -->
    <h3 class="public-bidding__section-title">招标基本信息</h3>
    <div class="public-bidding__form-grid">
      <n-form-item
        label="采购材料/设备名称"
        path="basicInfo.equipmentName"
        class="public-bidding__form-grid__item--full"
      >
        <n-input
          v-model:value="formData.basicInfo.equipmentName"
          placeholder="请输入采购材料/设备名称"
          maxlength="200"
          show-count
        />
      </n-form-item>
    </div>

    <!-- 项目概况与招标范围 -->
    <h4 class="public-bidding__subsection-title">项目概况与招标范围</h4>
    <div class="public-bidding__form-grid">
      <!-- 项目概况 -->
      <n-form-item
        label="项目概况"
        path="basicInfo.projectOverview"
        class="public-bidding__form-grid__item--full"
      >
        <n-input
          v-model:value="formData.basicInfo.projectOverview"
          type="textarea"
          placeholder="建设项目概况，说明工程建设项目的建设地点、规模、建设工期、标段划分等"
          :autosize="{ minRows: 3, maxRows: 6 }"
          maxlength="2000"
          show-count
        />
      </n-form-item>

      <!-- 交货期 - 日期/文本切换 -->
      <n-form-item label="交货期类型" path="basicInfo.deliveryDateType">
        <n-radio-group
          v-model:value="formData.basicInfo.deliveryDateType"
          name="deliveryDateType"
        >
          <n-radio value="date">日期</n-radio>
          <n-radio value="text">文本</n-radio>
        </n-radio-group>
      </n-form-item>

      <!-- 交货期输入区域 - 统一占整行，避免布局抖动 -->
      <n-form-item
        v-if="formData.basicInfo.deliveryDateType === 'date'"
        label="交货期"
        path="basicInfo.deliveryDate"
        class="public-bidding__form-grid__item--full"
      >
        <n-date-picker
          v-model:value="formData.basicInfo.deliveryDate"
          type="date"
          placeholder="请选择交货日期"
          style="width: 100%"
        />
      </n-form-item>

      <n-form-item
        v-else
        label="交货期"
        path="basicInfo.deliveryDateText"
        class="public-bidding__form-grid__item--full"
      >
        <n-input
          v-model:value="formData.basicInfo.deliveryDateText"
          placeholder="请输入交货期描述，如：合同签订后30日内"
          maxlength="100"
        />
      </n-form-item>

      <n-form-item label="交货地点" path="basicInfo.deliveryLocation">
        <n-input
          v-model:value="formData.basicInfo.deliveryLocation"
          placeholder="请输入交货地点"
          maxlength="200"
        />
      </n-form-item>
    </div>

    <!-- 投标人资格要求 -->
    <h4 class="public-bidding__subsection-title">投标人资格要求</h4>
    <div class="public-bidding__form-grid">
      <!-- 资质要求 -->
      <n-form-item
        label="投标人须具备独立法人资格，具有有效的营业执照，并具有与本招标项目相应的供货能力的（可一项或多项）"
        path="basicInfo.qualificationRequirementType"
        class="public-bidding__form-grid__item--full"
      >
        <div class="qualification-requirement">
          <n-checkbox-group
            v-model:value="formData.basicInfo.qualificationRequirementType"
          >
            <n-space vertical>
              <n-checkbox value="option1">制造商</n-checkbox>
              <n-checkbox value="option2">代理商</n-checkbox>
              <n-checkbox value="option3">销售商</n-checkbox>
            </n-space>
          </n-checkbox-group>
        </div>
      </n-form-item>

      <!-- 业绩要求 -->
      <n-form-item
        label="业绩要求"
        path="basicInfo.performanceRequirementType"
        class="public-bidding__form-grid__item--full"
      >
        <div class="performance-requirement">
          <n-radio-group
            v-model:value="formData.basicInfo.performanceRequirementType"
            name="performanceRequirementType"
            style="margin-bottom: 12px"
          >
            <n-radio value="has">有</n-radio>
            <n-radio value="none">无</n-radio>
          </n-radio-group>

          <div
            v-if="formData.basicInfo.performanceRequirementType === 'has'"
            class="performance-requirement__inputs"
          >
            <span class="performance-requirement__text"
              >本次招标要求投标人在近</span
            >
            <n-input-number
              v-model:value="formData.basicInfo.performanceYears"
              :min="1"
              :max="20"
              style="width: 80px; margin: 0 4px"
            />
            <span class="performance-requirement__text"
              >年，起始日期为</span
            >
            <n-date-picker
              v-model:value="formData.basicInfo.performanceStartDate"
              type="date"
              placeholder="请选择起始日期"
              format="yyyy年MM月dd日"
              style="width: 160px; margin: 0 4px"
            />
            <span class="performance-requirement__text">
              年（指从投标截止日往前推算{{
                formData.basicInfo.performanceYears
              }}年，例如投标截止日为2024年6月1日，则近5年是指2019年6月1日至2024年5月31日，以合同签订时间为准）
            </span>
            <n-input
              v-model:value="formData.basicInfo.performanceType"
              placeholder="请输入业绩信息"
              style="width: 550px; margin: 0 4px"
              maxlength="50"
            />
            <span class="performance-requirement__text">供货业绩。</span>
          </div>
        </div>
      </n-form-item>

      <!-- 本次招标是否接受代理商投标 -->
      <n-form-item
        label="本次招标是否接受代理商投标"
        path="basicInfo.acceptAgentBid"
        class="public-bidding__form-grid__item--full"
      >
        <n-radio-group
          v-model:value="formData.basicInfo.acceptAgentBid"
          name="acceptAgentBid"
        >
          <n-radio value="accept">接受</n-radio>
          <n-radio value="reject">不接受</n-radio>
        </n-radio-group>
      </n-form-item>

      <!-- 本次招标是否接受联合体投标 -->
      <n-form-item
        label="本次招标是否接受联合体投标"
        path="basicInfo.acceptJointBid"
        class="public-bidding__form-grid__item--full"
      >
        <n-radio-group
          v-model:value="formData.basicInfo.acceptJointBid"
          name="acceptJointBid"
        >
          <n-radio value="accept">接受</n-radio>
          <n-radio value="reject">不接受</n-radio>
        </n-radio-group>
      </n-form-item>

      <!-- 未在招标人或上级单位发生过 -->
      <n-form-item
        label="未在招标人或上级单位发生过"
        path="basicInfo.issueSelectionType"
        class="public-bidding__form-grid__item--full"
      >
        <n-checkbox-group
          v-model:value="formData.basicInfo.issueSelectionType"
        >
          <n-checkbox value="major">重大</n-checkbox>
          <n-checkbox value="serious">严重</n-checkbox>
        </n-checkbox-group>
        <span
          >质量、违约等问题（以招标人或上级单位供应商问题记录库为准）。</span
        >
      </n-form-item>

      <!-- 本项目招标文件每套售价 -->
      <n-form-item
        label="本项目招标文件每套售价"
        path="basicInfo.bidDocumentFee"
        class="public-bidding__form-grid__item--full"
      >
        <n-input-number
          v-model:value="formData.basicInfo.bidDocumentFee"
          :min="0"
          :precision="2"
          placeholder="请输入金额"
          style="width: 200px"
        >
          <template #suffix>元</template>
        </n-input-number>
        <span style="margin-left: 8px">（须在投标报名期间支付）</span>
      </n-form-item>

      <!-- 支付形式 -->
      <n-form-item
        label="支付形式"
        path="basicInfo.bidDocumentFeePaymentType"
        class="public-bidding__form-grid__item--full"
      >
        <n-radio-group
          v-model:value="formData.basicInfo.bidDocumentFeePaymentType"
          name="bidDocumentFeePaymentType"
        >
          <n-radio value="bank">银行现汇</n-radio>
          <n-radio value="cash">现金缴纳</n-radio>
        </n-radio-group>
      </n-form-item>
    </div>

    <!-- 联系方式 -->
    <h3 class="public-bidding__section-title">联系方式</h3>
    <div class="public-bidding__form-grid">
      <n-form-item label="联系人" path="basicInfo.contactPerson">
        <n-input
          v-model:value="formData.basicInfo.contactPerson"
          placeholder="请输入联系人姓名"
          maxlength="50"
        />
      </n-form-item>

      <n-form-item label="电话" path="basicInfo.contactPhone">
        <n-input
          v-model:value="formData.basicInfo.contactPhone"
          placeholder="请输入联系电话"
          maxlength="20"
        />
      </n-form-item>

      <n-form-item
        label="邮箱"
        path="basicInfo.contactEmail"
        class="public-bidding__form-grid__item--full"
      >
        <n-input
          v-model:value="formData.basicInfo.contactEmail"
          placeholder="请输入联系邮箱"
          maxlength="100"
        />
      </n-form-item>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IBiddingFormData, ISelectOption } from "../types";

/**
 * Props
 */
interface Props {
  /** 表单数据 */
  formData: IBiddingFormData;
}

defineProps<Props>();

/**
 * 招标主体选项（静态数据）
 */
const bidSubjectOptions: ISelectOption[] = [
  { value: "company-main", label: "中冶长天国际工程有限责任公司" },
  { value: "company-subsidiary-a", label: "子公司A" },
  { value: "company-subsidiary-b", label: "子公司B" },
  { value: "company-subsidiary-c", label: "子公司C" },
];
</script>

<style scoped>
.basic-info-step {
  padding: 16px 0;
}

/* 投标人资格要求样式 */
.qualification-requirement,
.financial-requirement,
.performance-requirement {
  width: 100%;
}

.qualification-requirement :deep(.n-checkbox),
.financial-requirement :deep(.n-radio) {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
}

.performance-requirement__inputs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  line-height: 32px;
}

.performance-requirement__text {
  color: #333;
  font-size: 14px;
}

.performance-requirement__note {
  width: 100%;
  margin: 12px 0 0 0;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #606266;
  background-color: #f5f7fa;
  border-left: 3px solid #409eff;
  border-radius: 2px;
}
</style>
