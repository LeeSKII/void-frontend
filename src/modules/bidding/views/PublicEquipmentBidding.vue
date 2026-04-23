<!--
  @component PublicEquipmentBidding
  @description 设备招标采购申请表单页面，采用多步骤向导形式，支持自动保存草稿
-->
<template>
  <div class="public-bidding">
    <!-- 页面头部 -->
    <div class="public-bidding__header">
      <h1 class="public-bidding__title">
        公开招标-标准材料/设备招标采购申请表
      </h1>
      <!-- <p class="public-bidding__subtitle">请填写完整信息，系统将自动保存草稿</p>
      <p v-if="lastSavedTime" class="public-bidding__saved-hint">
        上次保存时间：{{ lastSavedTime }}
      </p> -->

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
                  v-model:value="
                    formData.basicInfo.qualificationRequirementType
                  "
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
                    }}年，例如投标截止日为2024年6月1日，则近5年是指2019年6月1日至2024年5月31日，以合同签订时间为准）内具有
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
        <!-- 步骤二：投标人须知 -->
        <div v-show="currentStep === 2" class="public-bidding__step-content">
          <h3 class="public-bidding__section-title">投标人须知前附表</h3>

          <div class="public-bidding__form-grid">
            <!-- 评标办法 -->
            <n-form-item
              label="评标办法"
              path="bidderInstructions.evaluationMethodType"
            >
              <n-radio-group
                v-model:value="formData.bidderInstructions.evaluationMethodType"
                name="evaluationMethodType"
              >
                <n-radio value="comprehensive">综合评分法</n-radio>
                <n-radio value="lowest-price">经评审的最低价中标法</n-radio>
              </n-radio-group>
            </n-form-item>
            <!-- 资金来源及比例 -->
            <n-form-item
              label="资金来源及比例"
              path="bidderInstructions.capitalSourceAndRatio"
              class="public-bidding__form-grid__item--full"
            >
              <n-input
                v-model:value="
                  formData.bidderInstructions.capitalSourceAndRatio
                "
                placeholder="请输入资金来源及比例"
              />
            </n-form-item>
            <!-- 质量标准 -->
            <n-form-item
              label="质量标准"
              path="bidderInstructions.qualityStandard"
              class="public-bidding__form-grid__item--full"
            >
              <n-input
                v-model:value="formData.bidderInstructions.qualityStandard"
                type="textarea"
                placeholder="根据实际情况填写"
                :autosize="{ minRows: 2, maxRows: 4 }"
              />
            </n-form-item>
            <!-- 投标预备会 -->
            <n-form-item
              label="投标预备会"
              path="bidderInstructions.preMeetingRequired"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="formData.bidderInstructions.preMeetingRequired"
                name="preMeetingRequired"
              >
                <n-radio value="no">不召开</n-radio>
                <n-radio value="yes">召开</n-radio>
              </n-radio-group>
            </n-form-item>
            <!-- 召开时间及地点（仅当召开时显示） -->
            <n-form-item
              v-if="formData.bidderInstructions.preMeetingRequired === 'yes'"
              label="召开时间"
              path="bidderInstructions.preMeetingTime"
              class="public-bidding__form-grid__item--full"
            >
              <n-date-picker
                v-model:value="formData.bidderInstructions.preMeetingTime"
                type="datetime"
                format="yyyy年MM月dd日HH时mm分ss秒"
                placeholder="请选择召开时间"
                style="width: 100%"
              />
            </n-form-item>
            <n-form-item
              v-if="formData.bidderInstructions.preMeetingRequired === 'yes'"
              label="召开地点"
              path="bidderInstructions.preMeetingLocation"
            >
              <n-input
                v-model:value="formData.bidderInstructions.preMeetingLocation"
                placeholder="请输入召开地点"
              />
            </n-form-item>
            <!-- 投标人在投标预备会前提出问题（仅当召开时显示） -->
            <n-form-item
              v-if="formData.bidderInstructions.preMeetingRequired === 'yes'"
              label="投标人在投标预备会前提出问题"
              path="bidderInstructions.questionDeadlineTime"
              class="public-bidding__form-grid__item--full"
            >
              <div
                class="public-bidding__form-grid"
                style="display: flex; gap: 16px; width: 100%"
              >
                <n-form-item
                  label="时间"
                  path="bidderInstructions.questionDeadlineTime"
                  style="flex: 1"
                >
                  <div style="display: flex; align-items: center; gap: 8px">
                    <n-date-picker
                      v-model:value="
                        formData.bidderInstructions.questionDeadlineTime
                      "
                      type="datetime"
                      format="yyyy年MM月dd日HH时"
                      placeholder="请选择时间"
                      style="width: 180px"
                    />
                    <span>前提出</span>
                  </div>
                </n-form-item>
                <n-form-item
                  label="邮箱"
                  path="bidderInstructions.questionEmail"
                  style="flex: 1"
                >
                  <n-input
                    v-model:value="formData.bidderInstructions.questionEmail"
                    placeholder="请输入邮箱"
                    style="width: 100%"
                  />
                </n-form-item>
              </div>
            </n-form-item>
            <!-- 负偏差 -->
            <n-form-item
              label="负偏差"
              path="bidderInstructions.negativeDeviationType"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="
                  formData.bidderInstructions.negativeDeviationType
                "
                name="negativeDeviationType"
              >
                <n-radio value="not-allowed">不允许</n-radio>
                <n-radio value="allowed"
                  >允许（1.10.5规定不允许偏离的除外）</n-radio
                >
              </n-radio-group>
            </n-form-item>
            <!-- 偏差范围和最高负偏离项数（仅当允许时显示） -->
            <div
              v-if="
                formData.bidderInstructions.negativeDeviationType === 'allowed'
              "
              class="public-bidding__form-grid"
              style="display: flex; gap: 16px; width: 100%"
            >
              <n-form-item
                label="偏差范围"
                path="bidderInstructions.deviationRange"
                style="flex: 1"
              >
                <n-input
                  v-model:value="formData.bidderInstructions.deviationRange"
                  placeholder="请输入偏差范围"
                />
              </n-form-item>
              <n-form-item
                label="最高负偏离项数"
                path="bidderInstructions.maxNegativeDeviationCount"
                style="flex: 1"
              >
                <n-input-number
                  v-model:value="
                    formData.bidderInstructions.maxNegativeDeviationCount
                  "
                  :min="0"
                  placeholder="请输入数字"
                  style="width: 100%"
                />
              </n-form-item>
            </div>
            <!-- 不允许负偏离项 -->
            <n-form-item
              label="不允许负偏离项"
              path="bidderInstructions.noNegativeDeviationItems"
              class="public-bidding__form-grid__item--full"
            >
              <n-checkbox-group
                v-model:value="
                  formData.bidderInstructions.noNegativeDeviationItems
                "
              >
                <n-space vertical>
                  <n-space>
                    <n-checkbox value="payment-terms">付款条件</n-checkbox>
                    <n-checkbox value="delivery-date">交货期</n-checkbox>
                    <n-checkbox value="delivery-location">交货地点</n-checkbox>
                    <n-checkbox value="external-brand"
                      >招标文件中约定的外购件品牌</n-checkbox
                    >
                  </n-space>
                  <n-space>
                    <n-checkbox value="supply-scope">供货范围</n-checkbox>
                    <n-checkbox value="bid-validity">投标有效期</n-checkbox>
                    <n-checkbox value="quality-warranty">质保期</n-checkbox>
                    <n-checkbox value="equipment-specs"
                      >设备规格型号及主要参数</n-checkbox
                    >
                  </n-space>
                  <n-space>
                    <n-checkbox value="technical-asterisk"
                      >实质性要求和条件（见1.10.1）</n-checkbox
                    >
                  </n-space>
                  <n-space>
                    <n-checkbox value="other">其他</n-checkbox>
                  </n-space>
                </n-space>
              </n-checkbox-group>
              <div
                v-if="
                  formData.bidderInstructions.noNegativeDeviationItems.includes(
                    'other',
                  )
                "
                style="margin-top: 12px; width: 100%"
              >
                <n-input
                  v-model:value="
                    formData.bidderInstructions.noNegativeDeviationOtherText
                  "
                  type="textarea"
                  placeholder="请输入其他内容"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  style="width: 100%"
                />
              </div>
            </n-form-item>
            <!-- 投标人要求澄清招标文件 -->
            <n-form-item
              label="投标人要求澄清招标文件"
              path="bidderInstructions.clarificationSendTo"
              class="public-bidding__form-grid__item--full"
            >
              <n-space vertical style="width: 100%">
                <n-space>
                  <span style="color: var(--n-text-color); font-size: 14px">
                    时间：投标人应于投标截止3日前
                  </span>
                </n-space>
                <n-space align="center" style="margin-top: 8px">
                  <span style="color: var(--n-text-color); font-size: 14px"
                    >形式：</span
                  >
                  <span style="color: var(--n-text-color); font-size: 14px"
                    >以书面方式，发送至</span
                  >
                  <n-input
                    v-model:value="
                      formData.bidderInstructions.clarificationSendTo
                    "
                    placeholder="请输入邮箱或地址"
                    style="width: 300px"
                  />
                </n-space>
              </n-space>
            </n-form-item>
            <!-- 增值税税金的计算方法 -->
            <n-form-item
              label="增值税税金的计算方法"
              path="bidderInstructions.vatCalculationMethod"
              class="public-bidding__form-grid__item--full"
            >
              <n-input
                v-model:value="formData.bidderInstructions.vatCalculationMethod"
                type="textarea"
                placeholder="请输入增值税税金的计算方法"
                :autosize="{ minRows: 2, maxRows: 4 }"
                style="width: 100%"
              />
            </n-form-item>

            <!-- 最高投标限价 -->
            <n-form-item
              label="最高投标限价"
              path="bidderInstructions.hasMaxBidPrice"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="formData.bidderInstructions.hasMaxBidPrice"
                name="hasMaxBidPrice"
              >
                <n-radio :value="false">无</n-radio>
                <n-radio :value="true">有</n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 最高投标限价金额（有最高投标限价时显示） -->
            <n-form-item
              v-if="formData.bidderInstructions.hasMaxBidPrice === true"
              label="最高投标限价"
              path="bidderInstructions.maxBidPrice"
              class="public-bidding__form-grid__item--full"
            >
              <n-input-number
                v-model:value="formData.bidderInstructions.maxBidPrice"
                :min="0"
                :precision="2"
                placeholder="请输入最高投标限价"
                style="width: 100%"
              />
            </n-form-item>

            <!-- 投标有效期 -->
            <n-form-item
              label="投标有效期"
              path="bidderInstructions.bidValidity"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="formData.bidderInstructions.bidValidity"
                name="bidValidity"
              >
                <n-radio :value="90">90天</n-radio>
                <n-radio :value="120">120天</n-radio>
                <n-radio :value="180">180天</n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 是否要求投标保证金 -->
            <n-form-item
              label="是否要求投标保证金"
              path="bidderInstructions.requireBidBond"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="formData.bidderInstructions.requireBidBond"
                name="requireBidBond"
              >
                <n-radio :value="true">要求</n-radio>
                <n-radio :value="false">不要求</n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 保证金金额（要求时显示） -->
            <n-form-item
              v-if="formData.bidderInstructions.requireBidBond === true"
              label="保证金金额（元）"
              path="bidderInstructions.bidBondAmount"
            >
              <n-input-number
                v-model:value="formData.bidderInstructions.bidBondAmount"
                :min="0"
                :precision="2"
                placeholder="请输入保证金金额"
                style="width: 100%"
              />
            </n-form-item>

            <!-- 保证金形式（要求时显示） -->
            <n-form-item
              v-if="formData.bidderInstructions.requireBidBond === true"
              label="保证金形式"
              path="bidderInstructions.bidBondForms"
              class="public-bidding__form-grid__item--full"
            >
              <n-checkbox-group
                v-model:value="formData.bidderInstructions.bidBondForms"
              >
                <n-checkbox value="wire-transfer">电汇</n-checkbox>
                <n-checkbox value="bank-guarantee">银行保函</n-checkbox>
                <n-checkbox value="commitment-letter"
                  >投标人在招标人单位尚有未付货款且金额大于本次投标保证金的，允许投标人递交保证金承诺函，替代投标保证金</n-checkbox
                >
                <n-checkbox value="other"
                  >招标人及招标代理机构可以接受的其他形式</n-checkbox
                >
              </n-checkbox-group>
            </n-form-item>

            <!-- 是否有资格审查资料特殊要求 -->
            <n-form-item
              label="资格审查资料特殊要求"
              path="bidderInstructions.hasSpecialQualificationReq"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="
                  formData.bidderInstructions.hasSpecialQualificationReq
                "
                name="hasSpecialQualificationReq"
              >
                <n-radio :value="true">有</n-radio>
                <n-radio :value="false">无</n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 具体要求（有特殊要求时显示） -->
            <n-form-item
              v-if="
                formData.bidderInstructions.hasSpecialQualificationReq === true
              "
              label="具体要求"
              path="bidderInstructions.specialQualificationRequirement"
              class="public-bidding__form-grid__item--full"
            >
              <n-input
                v-model:value="
                  formData.bidderInstructions.specialQualificationRequirement
                "
                type="textarea"
                placeholder="请描述资格审查资料的具体要求"
                :autosize="{ minRows: 3, maxRows: 6 }"
                maxlength="1000"
                show-count
              />
            </n-form-item>

            <n-form-item
              label="财务状况要求"
              path="bidderInstructions.financialReportYears"
              class="public-bidding__form-grid__item--full"
            >
              <n-space align="center">
                <span>适用：投标人应递交近</span>
                <n-input-number
                  v-model:value="
                    formData.bidderInstructions.financialReportYears
                  "
                  :min="1"
                  :max="10"
                  :precision="0"
                  placeholder="请输入年度数"
                  size="small"
                  style="width: 100px; margin: 0 8px"
                />
                <span>年度经会计事务所或审计机构审计的财务报表</span>
              </n-space>
            </n-form-item>

            <!-- 近年完成的类似项目情况的要求 -->
            <n-form-item
              label="近年完成的类似项目情况的要求"
              path="bidderInstructions.recentProjectRequirementType"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="
                  formData.bidderInstructions.recentProjectRequirementType
                "
                name="recentProjectRequirementType"
              >
                <n-radio value="not-applicable">不适用</n-radio>
                <n-radio value="applicable">
                  <span class="inline-radio-label">适用</span>
                </n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 适用时的条件渲染区域 -->
            <div
              v-if="
                formData.bidderInstructions.recentProjectRequirementType ===
                'applicable'
              "
              class="recent-project-requirement__details"
            >
              <!-- 说明文本 -->
              <div class="recent-project-requirement__description">
                供应商应提供近年的类似项目情况表，以证明供应商具有承担本项目要求的业绩。
              </div>

              <!-- 年份范围输入 -->
              <n-form-item
                label="近年是指"
                path="bidderInstructions.recentProjectStartYear"
                class="recent-project-requirement__form-item"
              >
                <span class="inline-input-wrapper">
                  <n-input-number
                    v-model:value="
                      formData.bidderInstructions.recentProjectStartYear
                    "
                    :min="2000"
                    :max="2100"
                    :precision="0"
                    placeholder="起始年"
                    style="width: 100px"
                  />
                  <span> 至 </span>
                  <n-input-number
                    v-model:value="
                      formData.bidderInstructions.recentProjectEndYear
                    "
                    :min="2000"
                    :max="2100"
                    :precision="0"
                    placeholder="截止年"
                    style="width: 100px"
                  />
                  <span> 年</span>
                </span>
              </n-form-item>

              <!-- 类似项目类型 -->
              <n-form-item
                label="类似项目是指"
                path="bidderInstructions.recentProjectType"
                class="recent-project-requirement__form-item"
              >
                <n-input
                  v-model:value="formData.bidderInstructions.recentProjectType"
                  placeholder="请输入类似项目类型描述"
                  maxlength="200"
                />
              </n-form-item>

              <!-- 业绩证明材料（多选） -->
              <n-form-item
                label="业绩证明材料"
                path="bidderInstructions.proofMaterialTypes"
                class="recent-project-requirement__form-item"
              >
                <n-checkbox-group
                  v-model:value="formData.bidderInstructions.proofMaterialTypes"
                >
                  <n-space vertical>
                    <n-checkbox value="contract">合同/订单</n-checkbox>
                    <n-checkbox value="bid-notice"
                      >中标通知书/成交通知书</n-checkbox
                    >
                    <n-checkbox value="acceptance-report"
                      >竣工验收报告/验收证明</n-checkbox
                    >
                    <n-checkbox value="owner-proof">业主证明</n-checkbox>
                    <n-checkbox value="other">
                      <span class="inline-checkbox-label">
                        其他材料：
                        <n-input
                          v-if="
                            formData.bidderInstructions.proofMaterialTypes.includes(
                              'other',
                            )
                          "
                          v-model:value="
                            formData.bidderInstructions.otherProofMaterial
                          "
                          placeholder="请描述其他材料"
                          style="width: 300px; margin-left: 8px"
                          maxlength="200"
                        />
                      </span>
                    </n-checkbox>
                  </n-space>
                </n-checkbox-group>
              </n-form-item>

              <!-- 业绩证明材料种类要求 -->
              <n-form-item
                v-if="formData.bidderInstructions.proofMaterialTypes.length > 0"
                label="业绩证明材料种类要求"
                path="bidderInstructions.proofMaterialRequirement"
                class="recent-project-requirement__form-item"
              >
                <n-checkbox-group
                  v-model:value="
                    formData.bidderInstructions.proofMaterialRequirement
                  "
                >
                  <n-space vertical>
                    <n-checkbox value="any"
                      >提供上述勾选的任一项证明材料即可</n-checkbox
                    >
                    <n-checkbox value="all"
                      >需同时提供上述勾选的所有证明材料</n-checkbox
                    >
                  </n-space>
                </n-checkbox-group>
              </n-form-item>

              <!-- 其他要求 -->
              <n-form-item
                label="其他要求"
                path="bidderInstructions.recentProjectOtherRequirements"
                class="recent-project-requirement__form-item"
              >
                <n-input
                  v-model:value="
                    formData.bidderInstructions.recentProjectOtherRequirements
                  "
                  type="textarea"
                  placeholder="其他需要补充的要求（可选）"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  maxlength="500"
                />
              </n-form-item>

              <!-- 固定注释 -->
              <div class="recent-project-requirement__note">
                注：工业与信息化部等部委颁布的相关名录所列的首台（套）装备、首批次材料、首版次软件参与采购活动时，供应商提交相关证明材料，即视同满足市场占有率、使用业绩等要求。
              </div>
            </div>

            <!-- 近年发生的诉讼及仲裁情况的时间要求 -->
            <n-form-item
              label="近年发生的诉讼及仲裁情况的时间要求"
              path="bidderInstructions.litigationYears"
              class="public-bidding__form-grid__item--full"
            >
              <n-space align="center">
                <span>近</span>
                <n-input-number
                  v-model:value="formData.bidderInstructions.litigationYears"
                  :min="1"
                  :max="20"
                  :precision="0"
                  placeholder="请输入年数"
                  size="small"
                  style="width: 80px; margin: 0 8px"
                />
                <span>年</span>
                <n-date-picker
                  v-model:value="
                    formData.bidderInstructions.litigationStartDate
                  "
                  type="date"
                  placeholder="请选择起始日期"
                  format="yyyy年MM月dd日"
                  size="small"
                  style="width: 160px; margin-left: 8px"
                />
                <span>起至投标截至日止</span>
              </n-space>
            </n-form-item>

            <!-- 是否允许递交备选投标方案 -->
            <n-form-item
              label="是否允许递交备选投标方案"
              path="bidderInstructions.allowAlternativeBidProposal"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="
                  formData.bidderInstructions.allowAlternativeBidProposal
                "
                name="allowAlternativeBidProposal"
              >
                <n-radio value="not-allowed">不允许</n-radio>
                <n-radio value="allowed">允许</n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 纸质投标文件要求 -->
            <n-form-item
              label="纸质投标文件要求"
              path="bidderInstructions.requirePaperBidDocument"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="
                  formData.bidderInstructions.requirePaperBidDocument
                "
                name="requirePaperBidDocument"
              >
                <n-radio :value="false">不要求递交纸质投标文件</n-radio>
                <n-radio :value="true">需要递交纸质投标文件</n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 纸质投标文件详情（需要时显示） -->
            <n-form-item
              v-if="
                formData.bidderInstructions.requirePaperBidDocument === true
              "
              class="public-bidding__form-grid__item--full"
            >
              <n-space vertical style="width: 100%">
                <n-space align="center">
                  <span style="margin-right: 8px">投标文件副本份数：</span>
                  <n-input-number
                    v-model:value="
                      formData.bidderInstructions.paperBidDocumentCopies
                    "
                    :min="1"
                    :precision="0"
                    placeholder="请输入份数"
                    style="width: 120px"
                  />
                </n-space>
                <n-space align="center" style="margin-top: 12px">
                  <span style="margin-right: 8px"
                    >是否要求提交电子版文件：</span
                  >
                  <n-radio-group
                    v-model:value="
                      formData.bidderInstructions.requireElectronicFile
                    "
                    name="requireElectronicFile"
                  >
                    <n-radio :value="true">是</n-radio>
                    <n-radio :value="false">否</n-radio>
                  </n-radio-group>
                </n-space>
                <n-space align="center" style="margin-top: 12px">
                  <span style="margin-right: 8px">是否需要分册装订：</span>
                  <n-radio-group
                    v-model:value="
                      formData.bidderInstructions.requireSeparateBinding
                    "
                    name="requireSeparateBinding"
                  >
                    <n-radio :value="true">是</n-radio>
                    <n-radio :value="false">否</n-radio>
                  </n-radio-group>
                </n-space>
              </n-space>
            </n-form-item>
            <!-- 中标价高于预算金额时是否废标 -->
            <n-form-item
              label="第一中标候选人最终报价高于五矿集团供应链管理平台登记的“预算总金额”时，本次招标是否做废标处理"
              path="bidderInstructions.abortBidWhenOverBudget"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="
                  formData.bidderInstructions.abortBidWhenOverBudget
                "
                name="abortBidWhenOverBudget"
              >
                <n-radio value="yes">是</n-radio>
                <n-radio value="no">否</n-radio>
              </n-radio-group>
            </n-form-item>
            <!-- 投标文件是否退还 -->
            <n-form-item
              label="投标文件是否退还"
              path="bidderInstructions.returnBidDocuments"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="formData.bidderInstructions.returnBidDocuments"
                name="returnBidDocuments"
              >
                <n-radio value="yes">是</n-radio>
                <n-radio value="no">否</n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 退还时间（选择是时显示） -->
            <n-form-item
              v-if="formData.bidderInstructions.returnBidDocuments === 'yes'"
              label="退还时间"
              path="bidderInstructions.returnBidDocumentsDate"
              class="public-bidding__form-grid__item--full"
            >
              <n-date-picker
                v-model:value="
                  formData.bidderInstructions.returnBidDocumentsDate
                "
                type="date"
                placeholder="请选择退还时间"
                format="yyyy年MM月dd日"
                style="width: 200px"
              />
            </n-form-item>

            <!-- 是否授权评标委员会确定中标人 -->
            <n-form-item
              label="是否授权评标委员会确定中标人"
              path="bidderInstructions.authorizeCommitteeToConfirmWinner"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="
                  formData.bidderInstructions.authorizeCommitteeToConfirmWinner
                "
                name="authorizeCommitteeToConfirmWinner"
              >
                <n-radio value="yes">是</n-radio>
                <n-radio value="no">否</n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 是否要求中标人提交履约保证金 -->
            <n-form-item
              label="是否要求中标人提交履约保证金"
              path="bidderInstructions.requirePerformanceBond"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="
                  formData.bidderInstructions.requirePerformanceBond
                "
                name="requirePerformanceBond"
              >
                <n-radio value="not-required">不要求</n-radio>
                <n-radio value="required">要求</n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 是否采用电子招标投标 -->
            <n-form-item
              label="是否采用电子招标投标"
              path="bidderInstructions.useElectronicBidding"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="formData.bidderInstructions.useElectronicBidding"
                name="useElectronicBidding"
              >
                <n-radio value="yes">是</n-radio>
                <n-radio value="no">否</n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 履约保证金相关字段（要求时显示） -->
            <div
              v-if="
                formData.bidderInstructions.requirePerformanceBond ===
                'required'
              "
              class="performance-bond__details"
            >
              <!-- 履约保证金的形式 -->
              <n-form-item
                label="履约保证金的形式"
                path="bidderInstructions.performanceBondForms"
                class="public-bidding__form-grid__item--full"
              >
                <n-checkbox-group
                  v-model:value="
                    formData.bidderInstructions.performanceBondForms
                  "
                >
                  <n-space vertical>
                    <n-checkbox value="cash">现汇</n-checkbox>
                    <n-checkbox value="bank-guarantee"
                      >银行保函（须为不可撤销、见索即付）</n-checkbox
                    >
                    <n-checkbox value="other"
                      >招标人及招标代理机构可以接受的其他形式</n-checkbox
                    >
                  </n-space>
                </n-checkbox-group>
              </n-form-item>

              <!-- 履约保证金的金额 -->
              <n-form-item
                label="履约保证金的金额"
                path="bidderInstructions.performanceBondAmount"
              >
                <n-space>
                  <span>合同总额</span>
                  <n-input-number
                    v-model:value="
                      formData.bidderInstructions.performanceBondAmount
                    "
                    :min="0"
                    :precision="2"
                    placeholder="请输入百分比"
                    style="width: 120px"
                  />
                  <span>%</span>
                </n-space>
              </n-form-item>

              <!-- 出具保函的银行要求（采用银行保函时显示） -->
              <n-form-item
                v-if="
                  formData.bidderInstructions.performanceBondForms.includes(
                    'bank-guarantee',
                  )
                "
                label="出具保函的银行要求"
                path="bidderInstructions.bankGuaranteeRequirements"
                class="public-bidding__form-grid__item--full"
              >
                <n-checkbox-group
                  v-model:value="
                    formData.bidderInstructions.bankGuaranteeRequirements
                  "
                >
                  <n-space vertical>
                    <n-checkbox value="no-restriction">无限制</n-checkbox>
                    <n-checkbox value="branch-or-above"
                      >应由支行及以上国有或股份制商业银行</n-checkbox
                    >
                  </n-space>
                </n-checkbox-group>
              </n-form-item>
            </div>
          </div>

          <!-- 符合性评审表-资格评审 -->
          <h3 class="public-bidding__section-title">符合性评审表-资格评审</h3>
          <div class="public-bidding__scoring-table-wrapper">
            <table
              class="public-bidding__scoring-table public-bidding__scoring-table--conformity"
            >
              <thead>
                <tr>
                  <th>序号</th>
                  <th>评审因素</th>
                  <th>评审标准</th>
                  <th class="scoring-table__action-col">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in formData.bidderInstructions
                    .conformityReviewItems"
                  :key="item.index"
                >
                  <td>{{ index + 1 }}</td>
                  <td>
                    <n-input
                      v-model:value="item.reviewFactor"
                      placeholder="请输入评审因素"
                    />
                  </td>
                  <td>
                    <n-input
                      v-model:value="item.reviewStandard"
                      placeholder="请输入评审标准"
                    />
                  </td>
                  <td class="scoring-table__action-col">
                    <n-button
                      size="small"
                      type="error"
                      @click="removeConformityReviewRow(index)"
                    >
                      删除
                    </n-button>
                  </td>
                </tr>
                <tr
                  v-if="
                    !formData.bidderInstructions.conformityReviewItems ||
                    formData.bidderInstructions.conformityReviewItems.length ===
                      0
                  "
                >
                  <td colspan="4" class="scoring-table__empty-row">
                    暂无数据，请点击下方按钮添加
                  </td>
                </tr>
              </tbody>
            </table>
            <n-button
              @click="addConformityReviewRow"
              type="primary"
              dashed
              class="public-bidding__add-row-btn"
            >
              + 增加行
            </n-button>
          </div>
        </div>

        <!-- 步骤三：综合评分法 -->
        <div
          v-if="showStep3 && currentStep === 3"
          class="public-bidding__step-content"
        >
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
              <span
                class="scoring-summary__value scoring-summary__value--total"
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
            style="
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 12px;
            "
          >
            <h3 class="public-bidding__section-title" style="margin: 0">
              商务评分表
            </h3>
            <n-button
              size="small"
              type="info"
              @click="openCommercialImportModal"
            >
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
                      @click="removeCommercialRow(index)"
                    >
                      删除
                    </n-button>
                  </td>
                </tr>
                <tr
                  v-if="
                    !formData.comprehensiveScoring?.commercialScoring.items ||
                    formData.comprehensiveScoring.commercialScoring.items
                      .length === 0
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
                    formData.comprehensiveScoring.commercialScoring.items
                      .length > 0
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
              @click="addCommercialRow"
              type="primary"
              dashed
              class="public-bidding__add-row-btn"
            >
              + 增加行
            </n-button>
          </div>

          <!-- 技术评分表 -->
          <div
            style="
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 12px;
            "
          >
            <h3 class="public-bidding__section-title" style="margin: 0">
              技术评分表
            </h3>
            <n-button
              size="small"
              type="info"
              @click="openTechnicalImportModal"
            >
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
                      @click="removeTechnicalRow(index)"
                    >
                      删除
                    </n-button>
                  </td>
                </tr>
                <tr
                  v-if="
                    !formData.comprehensiveScoring?.technicalScoring.items ||
                    formData.comprehensiveScoring.technicalScoring.items
                      .length === 0
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
                    formData.comprehensiveScoring.technicalScoring.items
                      .length > 0
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
              @click="addTechnicalRow"
              type="primary"
              dashed
              class="public-bidding__add-row-btn"
            >
              + 增加行
            </n-button>
          </div>

          <!-- 价格评分表 -->
          <div
            style="
              display: flex;
              align-items: center;
              gap: 12px;
              margin-bottom: 12px;
            "
          >
            <h3 class="public-bidding__section-title" style="margin: 0">
              价格评分表
            </h3>
            <n-button size="small" type="info" @click="openPriceImportModal">
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
                      @click="removePriceRow(index)"
                    >
                      删除
                    </n-button>
                  </td>
                </tr>
                <tr
                  v-if="
                    !formData.comprehensiveScoring?.priceScoring.items ||
                    formData.comprehensiveScoring.priceScoring.items.length ===
                      0
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
              @click="addPriceRow"
              type="primary"
              dashed
              class="public-bidding__add-row-btn"
            >
              + 增加行
            </n-button>
          </div>
        </div>
      </n-form>
    </n-card>

    <!-- 操作按钮区（已移至右上角固定位置，此处保留作为移动端备用） -->
    <!-- <div class="public-bidding__actions">
      <n-space>
        <n-button type="success" @click="handleSubmit" :loading="submitting">
          提交
        </n-button>
        <n-button @click="handleReset" type="warning">重置表单</n-button>
      </n-space>
    </div> -->

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
          <n-button @click="commercialImportModalVisible = false"
            >取消</n-button
          >
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
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
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
  generateBiddingForm,
} from "@/modules/bidding/services";
import { getTodayTimestamp } from "@/utils/common/date";
import type {
  IBiddingFormData,
  ISelectOption,
  IHistoryProject,
} from "@/modules/bidding/types";
import {
  HistoryFloatButton,
  HistoryProjectDrawer,
  AIFillDialog,
} from "@/modules/bidding/components";

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
  () =>
    formData.value.bidderInstructions.evaluationMethodType === "comprehensive",
);

/**
 * 招标主体选项（静态数据）
 */
const bidSubjectOptions: ISelectOption[] = [
  { value: "company-main", label: "中冶长天国际工程有限责任公司" },
  { value: "company-subsidiary-a", label: "子公司A" },
  { value: "company-subsidiary-b", label: "子公司B" },
  { value: "company-subsidiary-c", label: "子公司C" },
];

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
 * 保存草稿按钮点击处理
 */
// const handleSaveDraft = () => {
//   savingDraft.value = true;
//   try {
//     saveDraft();
//     message.success("草稿已保存");
//   } finally {
//     savingDraft.value = false;
//   }
// };

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
    // TODO: 跳转到成功页面
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
 * @param index 行索引
 */
const removeCommercialRow = (index: number) => {
  dialog.warning({
    title: "确认删除",
    content: "确定要删除该评分项吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      formData.value.comprehensiveScoring?.commercialScoring.items.splice(
        index,
        1,
      );
      message.success("删除成功");
    },
  });
};

/**
 * 综合评分法 - 删除技术评分表行
 * @param index 行索引
 */
const removeTechnicalRow = (index: number) => {
  dialog.warning({
    title: "确认删除",
    content: "确定要删除该评分项吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      formData.value.comprehensiveScoring?.technicalScoring.items.splice(
        index,
        1,
      );
      message.success("删除成功");
    },
  });
};

/**
 * 综合评分法 - 删除价格评分表行
 * @param index 行索引
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
 * 符合性评审表 - 增加行
 */
const addConformityReviewRow = () => {
  if (!formData.value.bidderInstructions.conformityReviewItems) {
    formData.value.bidderInstructions.conformityReviewItems = [];
  }
  formData.value.bidderInstructions.conformityReviewItems.push({
    index: Date.now(),
    reviewFactor: "",
    reviewStandard: "",
  });
};

/**
 * 符合性评审表 - 删除行
 * @param index 行索引
 */
const removeConformityReviewRow = (index: number) => {
  dialog.warning({
    title: "确认删除",
    content: "确定要删除该评审项吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      formData.value.bidderInstructions.conformityReviewItems?.splice(index, 1);
      message.success("删除成功");
    },
  });
};

/**
 * 综合评分法 - 计算总分值
 * @param tableType 表格类型（commercial/technical/price）
 * @returns 总分值
 */
const calculateTotalScore = (
  tableType: "commercial" | "technical" | "price",
): number => {
  if (!formData.value.comprehensiveScoring) {
    return 0;
  }
  let items;
  if (tableType === "commercial") {
    items = formData.value.comprehensiveScoring.commercialScoring.items;
  } else if (tableType === "technical") {
    items = formData.value.comprehensiveScoring.technicalScoring.items;
  } else {
    items = formData.value.comprehensiveScoring.priceScoring.items;
  }
  return items.reduce((sum, item) => sum + (item.score ?? 0), 0);
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
    // 如果当前在步骤三，且评标办法不是综合评分法，自动跳回步骤二
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

    // 如果勾选了"严重"但未勾选"重大"，自动勾选"重大"
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
    // 只有选择了"有"业绩要求时才计算
    if (formData.value.basicInfo.performanceRequirementType !== "has") {
      return;
    }

    // 获取基准日期（封面日期或当前日期）
    const baseDate = coverDate ? new Date(coverDate) : new Date();

    // 往前推N年
    const startDate = new Date(baseDate);
    startDate.setFullYear(startDate.getFullYear() - (years || 0));

    // 设置为该年的1月1日
    startDate.setMonth(0);
    startDate.setDate(1);

    // 转换为时间戳赋值给起始日期
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

    // 获取基准日期（封面日期）
    const baseDate = new Date(coverDate);

    // 往前推N年
    const startDate = new Date(baseDate);
    startDate.setFullYear(startDate.getFullYear() - years);

    // 转换为时间戳赋值给起始日期
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
      // 深拷贝表单数据
      formData.value = JSON.parse(JSON.stringify(project.formData));
      // 修改项目名称为副本
      formData.value.basicInfo.projectName = `${project.formData.basicInfo.projectName} (副本)`;
      // 清空招标编号，作为新项目
      formData.value.basicInfo.bidNumber = "";
      // 重置到第一步
      currentStep.value = 1;
      // 关闭抽屉
      historyDrawerVisible.value = false;
      message.success("项目已克隆，请修改相关信息");
      // 等待 DOM 更新完成后保存草稿
      // 确保负偏差等条件字段在克隆后能正确显示
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
  // 基础信息：合并AI生成的，保留用户填写的项目名称和编号
  if (generated.basicInfo) {
    const userFilledProjectName = formData.value.basicInfo.projectName?.trim();
    const userFilledBidNumber = formData.value.basicInfo.bidNumber?.trim();

    formData.value.basicInfo = {
      ...formData.value.basicInfo, // 保留原有字段
      ...generated.basicInfo, // 合并AI生成的
      // 如果用户之前明确填写过项目名称和编号，才保留
      projectName: userFilledProjectName || generated.basicInfo.projectName,
      bidNumber: userFilledBidNumber || generated.basicInfo.bidNumber,
    };
  }

  // 投标人须知：只更新AI生成的字段，保留其他
  if (generated.bidderInstructions) {
    formData.value.bidderInstructions = {
      ...formData.value.bidderInstructions, // 保留原有字段
      ...generated.bidderInstructions, // 合并AI生成的
    };
  }

  // 综合评分法：智能合并，确保 items 正确拼接
  // 兼容AI返回的价格评分表可能在顶层或嵌套在comprehensiveScoring内
  const priceScoringData = generated.comprehensiveScoring?.priceScoring || generated.priceScoring;

  if (generated.comprehensiveScoring || generated.priceScoring) {
    // 确保 comprehensiveScoring 存在
    if (!formData.value.comprehensiveScoring) {
      formData.value.comprehensiveScoring = {
        commercialScoring: { items: [] },
        technicalScoring: { items: [] },
        priceScoring: { items: [] },
      };
    }

    const gen = generated.comprehensiveScoring || {};

    // 合并商务评分表
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

    // 合并技术评分表
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

    // 合并价格评分表（兼容两种结构）
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

  currentStep.value = 1;
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
  // 设置封面日期默认值（仅在没有值时）
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

.public-bidding__subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.public-bidding__saved-hint {
  margin: 8px 0 0 0;
  font-size: 12px;
  color: #67c23a;
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

/* 空状态占位区域 */
.public-bidding__empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 48px 24px;
  color: #909399;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.public-bidding__empty-state p {
  margin: 0;
  font-size: 14px;
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

/* 操作按钮区域 */
.public-bidding__actions {
  display: flex;
  justify-content: center;
  padding: 24px 0;
  border-top: 1px solid #e5e7eb;
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

  .public-bidding__actions {
    flex-direction: column;
  }

  .public-bidding__actions :deep(.n-space) {
    width: 100%;
    flex-direction: column !important;
  }

  .public-bidding__actions :deep(.n-button) {
    width: 100%;
  }

  .public-bidding__form-grid {
    grid-template-columns: 1fr;
  }
}

/* 表单项内联文本 */
.form-item__prefix-text,
.form-item__suffix-text {
  color: #333;
  font-size: 14px;
}

/* 财务状况要求垂直排列 */
.financial-requirement--vertical :deep(.n-radio-group) {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}

.financial-requirement--vertical :deep(.n-radio) {
  margin-right: 0 !important;
  margin-bottom: 8px !important;
}

/* 财务输入框包装容器 */
.financial-input-wrapper {
  display: inline-flex;
  align-items: center;
}

.financial-input-wrapper span {
  color: #333;
  font-size: 14px;
}

.financial-input-wrapper .n-input-number {
  margin: 0 8px;
}

/* 履约保证金详情区域样式 */
.performance-bond__details {
  width: 100%;
  padding: 16px;
  margin-top: 8px;
  background-color: #f9fafb;
  border-radius: 4px;
}

/* 近年完成的类似项目情况要求样式 */
.recent-project-requirement__details {
  width: 100%;
  padding: 16px;
  margin-top: 8px;
  background-color: #f9fafb;
  border-radius: 4px;
}

.recent-project-requirement__description {
  padding: 12px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #606266;
  background-color: #e6f7ff;
  border-left: 3px solid #1890ff;
  border-radius: 2px;
}

.recent-project-requirement__note {
  padding: 8px 12px;
  margin-top: 16px;
  font-size: 12px;
  line-height: 1.6;
  color: #606266;
  background-color: #f5f7fa;
  border-left: 3px solid #909399;
  border-radius: 2px;
}

.recent-project-requirement__form-item {
  width: 100%;
}

.inline-input-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.inline-input-wrapper span {
  color: #333;
  font-size: 14px;
}

.inline-radio-label,
.inline-checkbox-label {
  display: inline-flex;
  align-items: center;
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

/* 符合性评审表列宽（4列表格）- 评审因素和评审标准等宽 */
.public-bidding__scoring-table--conformity th:nth-child(2),
.public-bidding__scoring-table--conformity td:nth-child(2),
.public-bidding__scoring-table--conformity th:nth-child(3),
.public-bidding__scoring-table--conformity td:nth-child(3) {
  width: 50%;
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

/* 投标报名时间输入区域样式 */
.bid-registration-datetime__inputs {
  width: 100%;
  padding: 16px;
  margin-top: 8px;
  background-color: #f9fafb;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
