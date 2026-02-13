<!--
  @component PublicBidding
  @description 招标采购申请表单页面，采用多步骤向导形式，支持自动保存草稿
-->
<template>
  <div class="public-bidding">
    <!-- 页面头部 -->
    <div class="public-bidding__header">
      <h1 class="public-bidding__title">招标采购申请表</h1>
      <p class="public-bidding__subtitle">请填写完整信息，系统将自动保存草稿</p>
      <p v-if="lastSavedTime" class="public-bidding__saved-hint">
        上次保存时间：{{ lastSavedTime }}
      </p>
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
                :is-date-disabled="disablePreviousDate"
              />
            </n-form-item>
          </div>

          <!-- 招标基本信息 -->
          <h3 class="public-bidding__section-title">招标基本信息</h3>
          <div class="public-bidding__form-grid">
            <n-form-item
              label="采购设备名称"
              path="basicInfo.equipmentName"
              class="public-bidding__form-grid__item--full"
            >
              <n-input
                v-model:value="formData.basicInfo.equipmentName"
                placeholder="请输入采购设备名称"
                maxlength="200"
                show-count
              />
            </n-form-item>
          </div>

          <!-- 项目概况与招标范围 -->
          <h4 class="public-bidding__subsection-title">项目概况与招标范围</h4>
          <div class="public-bidding__form-grid">
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
                :is-date-disabled="disablePreviousDate"
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

            <n-form-item
              label="招标范围"
              path="basicInfo.bidScope"
              class="public-bidding__form-grid__item--full"
            >
              <n-input
                v-model:value="formData.basicInfo.bidScope"
                type="textarea"
                placeholder="请详细描述招标范围"
                :autosize="{ minRows: 3, maxRows: 6 }"
                maxlength="2000"
                show-count
              />
            </n-form-item>
          </div>

          <!-- 投标人资格要求 -->
          <h4 class="public-bidding__subsection-title">投标人资格要求</h4>
          <div class="public-bidding__form-grid">
            <!-- 资质要求 -->
            <n-form-item
              label="资质要求"
              path="basicInfo.qualificationRequirementType"
              class="public-bidding__form-grid__item--full"
            >
              <div class="qualification-requirement">
                <n-radio-group
                  v-model:value="
                    formData.basicInfo.qualificationRequirementType
                  "
                  name="qualificationRequirementType"
                >
                  <n-radio value="option1">
                    独立法人资格，持有有效的营业执照、基本账户开户许可证或基本存款账户信息表。
                  </n-radio>
                  <n-radio value="option2">
                    其他
                    <n-input
                      v-if="
                        formData.basicInfo.qualificationRequirementType ===
                        'option2'
                      "
                      v-model:value="
                        formData.basicInfo.qualificationRequirementOther
                      "
                      placeholder="请输入资质要求"
                      style="width: 400px; margin-left: 8px"
                      maxlength="500"
                    />
                  </n-radio>
                  <n-radio value="option3">无</n-radio>
                </n-radio-group>
              </div>
            </n-form-item>

            <!-- 财务要求 -->
            <n-form-item
              label="财务要求"
              path="basicInfo.financialRequirementType"
              class="public-bidding__form-grid__item--full"
            >
              <div class="financial-requirement">
                <n-radio-group
                  v-model:value="formData.basicInfo.financialRequirementType"
                  name="financialRequirementType"
                >
                  <n-radio value="has">
                    有
                    <n-input
                      v-if="
                        formData.basicInfo.financialRequirementType === 'has'
                      "
                      v-model:value="
                        formData.basicInfo.financialRequirementContent
                      "
                      placeholder="请输入财务要求"
                      style="width: 400px; margin-left: 8px"
                      maxlength="500"
                    />
                  </n-radio>
                  <n-radio value="none">无</n-radio>
                </n-radio-group>
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
                    >投标人提供近</span
                  >
                  <n-input-number
                    v-model:value="formData.basicInfo.performanceYears"
                    :min="1"
                    :max="20"
                    style="width: 80px; margin: 0 4px"
                  />
                  <span class="performance-requirement__text">
                    年（指从投标截止日往前推算{{
                      formData.basicInfo.performanceYears
                    }}年，例如投标截止日为2024年6月1日，则近5年是指2019年6月1日至2024年5月31日，以合同签订时间为准）类似
                  </span>
                  <n-input
                    v-model:value="formData.basicInfo.performanceType"
                    placeholder="请输入业绩类型"
                    style="width: 150px; margin: 0 4px"
                    maxlength="50"
                  />
                  <span class="performance-requirement__text">业绩至少</span>
                  <n-input-number
                    v-model:value="formData.basicInfo.performanceCount"
                    :min="1"
                    :max="100"
                    style="width: 80px; margin: 0 4px"
                  />
                  <span class="performance-requirement__text">个。</span>
                  <p class="performance-requirement__note">
                    注：工业与信息化部等部委颁布的相关名录所列的首台（套）装备、首批次材料、首版次软件参与采购活动时，供应商提交相关证明材料，即视同满足市场占有率、使用业绩等要求。
                  </p>
                </div>
              </div>
            </n-form-item>

            <!-- 本次招标接受联合体投标 -->
            <n-form-item
              label="本次招标接受联合体投标"
              path="basicInfo.acceptJointBid"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="formData.basicInfo.acceptJointBid"
                name="acceptJointBid"
              >
                <n-radio value="yes">是</n-radio>
                <n-radio value="no">否</n-radio>
              </n-radio-group>
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
            <!-- 划分采购标段情况 -->
            <n-form-item
              label="标段数量"
              path="bidderInstructions.bidSectionCount"
            >
              <n-input-number
                v-model:value="formData.bidderInstructions.bidSectionCount"
                :min="1"
                :precision="0"
                placeholder="请输入标段数量"
                style="width: 100%"
              >
                <template #suffix>
                  <span>个</span>
                </template>
              </n-input-number>
            </n-form-item>

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
              label="保证金金额（万元）"
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
                <n-checkbox value="bank-transfer">银行现汇</n-checkbox>
                <n-checkbox value="commitment-letter">保证金承诺函</n-checkbox>
              </n-checkbox-group>
            </n-form-item>

            <!-- 资格审查方式 -->
            <n-form-item
              label="资格审查方式"
              path="bidderInstructions.qualificationMethod"
              class="public-bidding__form-grid__item--full"
            >
              <n-radio-group
                v-model:value="formData.bidderInstructions.qualificationMethod"
                name="qualificationMethod"
              >
                <n-radio value="post-review">资格后审</n-radio>
                <n-radio value="pre-review">资格预审</n-radio>
              </n-radio-group>
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
              path="bidderInstructions.financialStatusRequirement"
              class="public-bidding__form-grid__item--full financial-requirement--vertical"
            >
              <n-radio-group
                v-model:value="
                  formData.bidderInstructions.financialStatusRequirement
                "
                name="financialStatusRequirement"
              >
                <n-radio value="not-applicable">不适用</n-radio>
                <n-radio value="applicable-one-year">
                  适用：投标人应提供经会计事务所或审计机构审计的上一年度财务报表
                </n-radio>
                <n-radio value="applicable-recent-years">
                  <span class="financial-input-wrapper">
                    适用：投标人应递交近
                    <n-input-number
                      v-model:value="
                        formData.bidderInstructions.financialReportYears
                      "
                      :min="1"
                      :max="10"
                      :precision="0"
                      placeholder="请输入年度数"
                      :disabled="
                        formData.bidderInstructions
                          .financialStatusRequirement !==
                        'applicable-recent-years'
                      "
                      size="small"
                      style="width: 100px; margin: 0 8px"
                    />
                    年度经会计事务所或审计机构审计的财务报表
                  </span>
                </n-radio>
              </n-radio-group>
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

            <!-- 评标委员会推荐中标候选人的人数 -->
            <n-form-item
              label="评标委员会推荐中标候选人的人数"
              path="bidderInstructions.recommendedCandidateCount"
            >
              <n-input-number
                v-model:value="
                  formData.bidderInstructions.recommendedCandidateCount
                "
                :min="1"
                :max="3"
                :precision="0"
                placeholder="请输入人数"
                style="width: 100%"
              >
                <template #suffix>
                  <span>人</span>
                </template>
              </n-input-number>
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
                  <n-space>
                    <n-checkbox value="bank-guarantee">银行保函</n-checkbox>
                    <n-checkbox value="cash">现金</n-checkbox>
                    <n-checkbox value="check">支票</n-checkbox>
                    <n-checkbox value="other">其他</n-checkbox>
                  </n-space>
                </n-checkbox-group>
              </n-form-item>

              <!-- 履约保证金的金额 -->
              <n-form-item
                label="履约保证金的金额"
                path="bidderInstructions.performanceBondAmount"
              >
                <n-input-number
                  v-model:value="
                    formData.bidderInstructions.performanceBondAmount
                  "
                  :min="0"
                  :precision="2"
                  placeholder="请输入金额"
                  style="width: 100%"
                />
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

            <!-- 投标文件需实质性响应招标文件，不允许负偏离项 -->
            <n-form-item
              label="投标文件需实质性响应招标文件，不允许负偏离项"
              path="bidderInstructions.noNegativeDeviationItems"
              class="public-bidding__form-grid__item--full"
            >
              <n-checkbox-group
                v-model:value="
                  formData.bidderInstructions.noNegativeDeviationItems
                "
              >
                <n-space>
                  <n-checkbox value="payment-terms">付款条件</n-checkbox>
                  <n-checkbox value="delivery-date">交货期</n-checkbox>
                  <n-checkbox value="delivery-location">交货地点</n-checkbox>
                  <n-checkbox value="external-brand"
                    >技术文件中约定的外购件品牌</n-checkbox
                  >
                  <n-checkbox value="supply-scope">供货范围</n-checkbox>
                  <n-checkbox value="bid-validity">投标有效期</n-checkbox>
                  <n-checkbox value="quality-warranty">质保期</n-checkbox>
                  <n-checkbox value="equipment-specs"
                    >设备规格型号及主要参数</n-checkbox
                  >
                  <n-checkbox value="technical-asterisk"
                    >技术文件中带*号项</n-checkbox
                  >
                </n-space>
              </n-checkbox-group>
            </n-form-item>

            <!-- 最高投标限价 -->
            <n-form-item
              label="最高投标限价"
              path="bidderInstructions.hasMaxBidPrice"
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
            >
              <n-input-number
                v-model:value="formData.bidderInstructions.maxBidPrice"
                :min="0"
                :precision="2"
                placeholder="请输入最高投标限价"
                style="width: 100%"
              />
            </n-form-item>

            <!-- 标书费 -->
            <n-form-item
              label="标书费"
              path="bidderInstructions.requireBidDocumentFee"
            >
              <n-radio-group
                v-model:value="formData.bidderInstructions.requireBidDocumentFee"
                name="requireBidDocumentFee"
              >
                <n-radio :value="false">不要求</n-radio>
                <n-radio :value="true">要求</n-radio>
              </n-radio-group>
            </n-form-item>

            <!-- 标书费金额（要求时显示） -->
            <n-form-item
              v-if="formData.bidderInstructions.requireBidDocumentFee === true"
              label="标书费的金额"
              path="bidderInstructions.bidDocumentFeeAmount"
              class="public-bidding__form-grid__item--full"
            >
              <span class="form-item__prefix-text">人民币</span>
              <n-input-number
                v-model:value="formData.bidderInstructions.bidDocumentFeeAmount"
                :min="0"
                :precision="2"
                placeholder="请输入金额"
                style="width: 200px; margin: 0 8px"
              />
              <span class="form-item__suffix-text">元整</span>
            </n-form-item>

            <!-- 标书费的形式（要求时显示） -->
            <n-form-item
              v-if="formData.bidderInstructions.requireBidDocumentFee === true"
              label="标书费的形式"
              path="bidderInstructions.bidDocumentFeeForms"
              class="public-bidding__form-grid__item--full"
            >
              <n-checkbox-group
                v-model:value="formData.bidderInstructions.bidDocumentFeeForms"
              >
                <n-space>
                  <n-checkbox value="bank-transfer">银行现汇</n-checkbox>
                  <n-checkbox value="cash">现金缴纳</n-checkbox>
                </n-space>
              </n-checkbox-group>
            </n-form-item>

            <!-- 中标价高于预算金额时是否废标 -->
            <n-form-item
              label="中标价，第一中标候选人最终报价高于中国五矿集团有限公司供应链管理平台登记的「预算总金额」时，本次招标是否做废标处理"
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

            <!-- 投标人是否属于中小企业 -->
            <n-form-item
              label="投标人是否属于中小企业"
              path="bidderInstructions.isSmallMediumEnterprise"
            >
              <n-radio-group
                v-model:value="formData.bidderInstructions.isSmallMediumEnterprise"
                name="isSmallMediumEnterprise"
              >
                <n-radio value="yes">是</n-radio>
                <n-radio value="no">否</n-radio>
              </n-radio-group>
            </n-form-item>
          </div>
        </div>

        <!-- 步骤三：综合评分法 -->
        <div v-show="currentStep === 3" class="public-bidding__step-content">
          <div class="public-bidding__empty-state">
            <p>综合评分法相关内容待补充...</p>
          </div>
        </div>

      </n-form>
    </n-card>

    <!-- 操作按钮区 -->
    <div class="public-bidding__actions">
      <n-space>
        <n-button type="success" @click="handleSubmit" :loading="submitting">
          提交申请
        </n-button>
        <n-button @click="handleSaveDraft" :disabled="savingDraft">
          {{ savingDraft ? "保存中..." : "保存草稿" }}
        </n-button>
        <n-button @click="handleReset" type="warning">重置表单</n-button>
      </n-space>
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
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
  getTodayTimestamp,
} from "@/utils/bidding";
import type { IBiddingFormData, ISelectOption } from "@/types/bidding";

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
const savingDraft = ref(false);

/**
 * 草稿相关
 */
const showDraftRestoreModal = ref(false);
const lastSavedTime = ref("");

/**
 * 表单数据
 */
const formData = ref<IBiddingFormData>(createEmptyFormData());

/**
 * 招标主体选项（静态数据）
 */
const bidSubjectOptions: ISelectOption[] = [
  { value: "company-main", label: "总公司" },
  { value: "company-subsidiary-a", label: "子公司A" },
  { value: "company-subsidiary-b", label: "子公司B" },
  { value: "company-subsidiary-c", label: "子公司C" },
];

/**
 * 禁用之前的日期
 */
const disablePreviousDate = (timestamp: number) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return timestamp < today.getTime();
};

/**
 * 处理步骤条点击
 */
const handleStepClick = async (step: number) => {
  if (step === currentStep.value) return;

  // 向前跳转直接切换
  if (step < currentStep.value) {
    currentStep.value = step;
    saveDraft();
    return;
  }

  // 向后跳转需要校验当前及中间步骤
  try {
    await formRef.value?.validate();
    currentStep.value = step;
    saveDraft();
  } catch {
    message.error("请完善当前步骤的必填信息");
  }
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
const handleSaveDraft = () => {
  savingDraft.value = true;
  try {
    saveDraft();
    message.success("草稿已保存");
  } finally {
    savingDraft.value = false;
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
    // TODO: 跳转到成功页面
  } catch (error) {
    message.error("提交失败，请重试");
  } finally {
    submitting.value = false;
  }
};

/**
 * 自动保存定时器
 */
let autoSaveTimer: number | null = null;

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
  margin-bottom: 24px;
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

.qualification-requirement :deep(.n-radio),
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
</style>
