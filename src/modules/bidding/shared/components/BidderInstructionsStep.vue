<!--
  @component BidderInstructionsStep
  @description 招标表单步骤2：投标人须知
-->
<template>
  <div class="bidder-instructions-step">
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
          v-model:value="formData.bidderInstructions.capitalSourceAndRatio"
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
                v-model:value="formData.bidderInstructions.questionDeadlineTime"
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
          v-model:value="formData.bidderInstructions.negativeDeviationType"
          name="negativeDeviationType"
          disabled
        >
          <n-radio value="not-allowed">不允许</n-radio>
          <n-radio value="allowed"
            >允许（1.10.5规定不允许偏离的除外）</n-radio
          >
        </n-radio-group>
      </n-form-item>
      <!-- 偏差范围和最高负偏离项数（仅当允许时显示） -->
      <div
        v-if="formData.bidderInstructions.negativeDeviationType === 'allowed'"
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
            disabled
          />
        </n-form-item>
        <n-form-item
          label="最高负偏离项数"
          path="bidderInstructions.maxNegativeDeviationCount"
          style="flex: 1"
        >
          <n-input-number
            v-model:value="formData.bidderInstructions.maxNegativeDeviationCount"
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
          v-model:value="formData.bidderInstructions.noNegativeDeviationItems"
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
          v-if="formData.bidderInstructions.noNegativeDeviationItems.includes('other')"
          style="margin-top: 12px; width: 100%"
        >
          <n-input
            v-model:value="formData.bidderInstructions.noNegativeDeviationOtherText"
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
              v-model:value="formData.bidderInstructions.clarificationSendTo"
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
          v-model:value="formData.bidderInstructions.hasSpecialQualificationReq"
          name="hasSpecialQualificationReq"
        >
          <n-radio :value="true">有</n-radio>
          <n-radio :value="false">无</n-radio>
        </n-radio-group>
      </n-form-item>

      <!-- 具体要求（有特殊要求时显示） -->
      <n-form-item
        v-if="formData.bidderInstructions.hasSpecialQualificationReq === true"
        label="具体要求"
        path="bidderInstructions.specialQualificationRequirement"
        class="public-bidding__form-grid__item--full"
      >
        <n-input
          v-model:value="formData.bidderInstructions.specialQualificationRequirement"
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
            v-model:value="formData.bidderInstructions.financialReportYears"
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
          v-model:value="formData.bidderInstructions.recentProjectRequirementType"
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
        v-if="formData.bidderInstructions.recentProjectRequirementType === 'applicable'"
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
              v-model:value="formData.bidderInstructions.recentProjectStartYear"
              :min="2000"
              :max="2100"
              :precision="0"
              placeholder="起始年"
              style="width: 100px"
            />
            <span> 至 </span>
            <n-input-number
              v-model:value="formData.bidderInstructions.recentProjectEndYear"
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
                    v-if="formData.bidderInstructions.proofMaterialTypes.includes('other')"
                    v-model:value="formData.bidderInstructions.otherProofMaterial"
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
            v-model:value="formData.bidderInstructions.proofMaterialRequirement"
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
            v-model:value="formData.bidderInstructions.recentProjectOtherRequirements"
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
            v-model:value="formData.bidderInstructions.litigationStartDate"
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
          v-model:value="formData.bidderInstructions.allowAlternativeBidProposal"
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
          v-model:value="formData.bidderInstructions.requirePaperBidDocument"
          name="requirePaperBidDocument"
        >
          <n-radio :value="false">不要求递交纸质投标文件</n-radio>
          <n-radio :value="true">需要递交纸质投标文件</n-radio>
        </n-radio-group>
      </n-form-item>

      <!-- 纸质投标文件详情（需要时显示） -->
      <n-form-item
        v-if="formData.bidderInstructions.requirePaperBidDocument === true"
        class="public-bidding__form-grid__item--full"
      >
        <n-space vertical style="width: 100%">
          <n-space align="center">
            <span style="margin-right: 8px">投标文件副本份数：</span>
            <n-input-number
              v-model:value="formData.bidderInstructions.paperBidDocumentCopies"
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
              v-model:value="formData.bidderInstructions.requireElectronicFile"
              name="requireElectronicFile"
            >
              <n-radio :value="true">是</n-radio>
              <n-radio :value="false">否</n-radio>
            </n-radio-group>
          </n-space>
          <n-space align="center" style="margin-top: 12px">
            <span style="margin-right: 8px">是否需要分册装订：</span>
            <n-radio-group
              v-model:value="formData.bidderInstructions.requireSeparateBinding"
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
        label="第一中标候选人最终报价高于五矿集团供应链管理平台登记的『预算总金额』时，本次招标是否做废标处理"
        path="bidderInstructions.abortBidWhenOverBudget"
        class="public-bidding__form-grid__item--full"
      >
        <n-radio-group
          v-model:value="formData.bidderInstructions.abortBidWhenOverBudget"
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
          v-model:value="formData.bidderInstructions.returnBidDocumentsDate"
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
          v-model:value="formData.bidderInstructions.authorizeCommitteeToConfirmWinner"
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
          v-model:value="formData.bidderInstructions.requirePerformanceBond"
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
        v-if="formData.bidderInstructions.requirePerformanceBond === 'required'"
        class="performance-bond__details"
      >
        <!-- 履约保证金的形式 -->
        <n-form-item
          label="履约保证金的形式"
          path="bidderInstructions.performanceBondForms"
          class="public-bidding__form-grid__item--full"
        >
          <n-checkbox-group
            v-model:value="formData.bidderInstructions.performanceBondForms"
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
              v-model:value="formData.bidderInstructions.performanceBondAmount"
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
          v-if="formData.bidderInstructions.performanceBondForms.includes('bank-guarantee')"
          label="出具保函的银行要求"
          path="bidderInstructions.bankGuaranteeRequirements"
          class="public-bidding__form-grid__item--full"
        >
          <n-checkbox-group
            v-model:value="formData.bidderInstructions.bankGuaranteeRequirements"
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
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import type { IBiddingFormData, NoNegativeDeviationType } from "../types";

/**
 * Props
 */
interface Props {
  /** 表单数据 */
  formData: IBiddingFormData;
}

const props = defineProps<Props>();

/**
 * 不允许负偏离项标签映射
 */
const NO_NEGATIVE_DEVIATION_LABELS: Record<NoNegativeDeviationType, string> = {
  "payment-terms": "付款条件",
  "delivery-date": "交货期",
  "delivery-location": "交货地点",
  "external-brand": "招标文件中约定的外购件品牌",
  "supply-scope": "供货范围",
  "bid-validity": "投标有效期",
  "quality-warranty": "质保期",
  "equipment-specs": "设备规格型号及主要参数",
  "technical-asterisk": "实质性要求和条件（见1.10.1）",
  "other": "其他"
};

/**
 * 不包含 "other" 的所有负偏离项
 */
const ALL_DEVIATION_ITEMS: NoNegativeDeviationType[] = [
  "payment-terms",
  "delivery-date",
  "delivery-location",
  "external-brand",
  "supply-scope",
  "bid-validity",
  "quality-warranty",
  "equipment-specs",
  "technical-asterisk"
];

/**
 * 监听负偏差类型变化：当切换为"不允许"时，自动勾选所有非"其他"选项
 */
watch(
  () => props.formData.bidderInstructions.negativeDeviationType,
  (newVal) => {
    if (newVal === "not-allowed") {
      props.formData.bidderInstructions.noNegativeDeviationItems = [
        ...ALL_DEVIATION_ITEMS
      ];
    }
  }
);

/**
 * 监听不允许负偏离项变化：当取消勾选非"其他"选项时，
 * 自动切换为"允许"模式，并更新偏差范围和最高负偏离项数
 */
watch(
  () => props.formData.bidderInstructions.noNegativeDeviationItems,
  (newItems) => {
    const bi = props.formData.bidderInstructions;
    const uncheckedItems = ALL_DEVIATION_ITEMS.filter(
      (item) => !newItems.includes(item)
    );
    if (uncheckedItems.length > 0) {
      // 有未勾选项：切换为允许模式，更新偏差范围
      bi.negativeDeviationType = "allowed";
      bi.deviationRange = uncheckedItems
        .map((item) => NO_NEGATIVE_DEVIATION_LABELS[item])
        .join("，");
      bi.maxNegativeDeviationCount = uncheckedItems.length;
    } else {
      // 所有非"其他"项都已勾选：切换为不允许模式，清空偏差范围
      bi.negativeDeviationType = "not-allowed";
      bi.deviationRange = "";
      bi.maxNegativeDeviationCount = 0;
    }
  }
);

/**
 * 监听偏差范围变化：确保最高负偏离项数不超过偏差范围选项数
 */
watch(
  () => props.formData.bidderInstructions.deviationRange,
  (newRange) => {
    const bi = props.formData.bidderInstructions;
    if (newRange && bi.maxNegativeDeviationCount !== null) {
      const rangeCount = newRange.split("，").filter(Boolean).length;
      if (bi.maxNegativeDeviationCount > rangeCount) {
        bi.maxNegativeDeviationCount = rangeCount;
      }
    }
  }
);
</script>

<style scoped>
.bidder-instructions-step {
  padding: 16px 0;
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
</style>
