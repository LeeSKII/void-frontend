<!--
  @component HistoryProjectDrawer
  @description 历史项目列表抽屉组件，支持搜索、排序和选择项目
-->
<template>
  <n-drawer
    v-model:show="innerVisible"
    placement="right"
    :width="600"
    :trap-focus="false"
    :block-scroll="false"
  >
    <n-drawer-content title="历史项目列表" closable>
      <!-- 搜索和排序区域 -->
      <template #header-extra>
        <n-space>
          <!-- 排序选择器 -->
          <n-select
            v-model:value="sortBy"
            :options="sortOptions"
            size="small"
            style="width: 120px"
            @update:value="handleSortChange"
          />
        </n-space>
      </template>

      <!-- 搜索框 -->
      <n-input
        v-model:value="searchKeyword"
        placeholder="搜索项目名称、招标编号、设备名称..."
        clearable
        @input="handleSearch"
        @clear="handleSearch"
      />

      <!-- 项目列表 -->
      <div class="history-drawer__list">
        <n-list hoverable clickable bordered>
          <n-list-item
            v-for="project in filteredProjects"
            :key="project.id"
            class="history-drawer__list-item"
            @click="handleSelectProject(project)"
          >
            <n-thing>
              <!-- 项目名称 -->
              <template #header>
                <span class="history-drawer__project-name">
                  {{ project.projectName }}
                </span>
              </template>

              <!-- 描述信息 -->
              <template #description>
                <n-space :size="[8, 4]" vertical>
                  <div class="history-drawer__info-row">
                    <span class="history-drawer__label">招标编号：</span>
                    <span class="history-drawer__value">{{ project.bidNumber }}</span>
                  </div>
                  <div class="history-drawer__info-row">
                    <span class="history-drawer__label">采购设备：</span>
                    <span class="history-drawer__value">{{ project.equipmentName }}</span>
                  </div>
                </n-space>
              </template>

              <!-- 标签 -->
              <template #action>
                <n-space :size="8">
                  <n-tag size="small" :bordered="false">
                    {{ getBidSubjectLabel(project.bidSubject) }}
                  </n-tag>
                  <n-tag size="small" type="info" :bordered="false">
                    {{ formatDate(project.coverDate) }}
                  </n-tag>
                </n-space>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>

        <!-- 空状态 -->
        <n-empty
          v-if="filteredProjects.length === 0"
          class="history-drawer__empty"
          description="暂无历史项目"
          size="large"
        >
          <template #extra>
            <n-text depth="3" v-if="searchKeyword">
              请尝试其他搜索关键词
            </n-text>
          </template>
        </n-empty>
      </div>

      <!-- 底部提示 -->
      <template #footer>
        <n-space justify="space-between">
          <n-text depth="3">
            共 {{ filteredProjects.length }} 个项目
          </n-text>
          <n-text depth="3" type="info">
            点击项目可克隆数据
          </n-text>
        </n-space>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { getMockHistoryProjects } from "@/modules/bidding/services";
import type { IHistoryProject, ISelectOption } from "@/modules/bidding/types";

/**
 * 组件 Props
 */
interface Props {
  /** 控制显示/隐藏 */
  modelValue: boolean;
}

/**
 * 组件 Emits
 */
interface Emits {
  /** 更新显示状态 */
  (e: "update:modelValue", value: boolean): void;
  /** 选择项目事件 */
  (e: "select-project", project: IHistoryProject): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

/**
 * 内部可见状态
 */
const innerVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

/**
 * 搜索关键词
 */
const searchKeyword = ref("");

/**
 * 排序方式
 */
const sortBy = ref<"date" | "name" | "bidNumber">("date");

/**
 * 排序选项
 */
const sortOptions: ISelectOption[] = [
  { value: "date", label: "按日期" },
  { value: "name", label: "按名称" },
  { value: "bidNumber", label: "按编号" },
];

/**
 * 招标主体选项（与主页面保持一致）
 */
const bidSubjectOptions: ISelectOption[] = [
  { value: "company-main", label: "中冶长天国际工程有限责任公司" },
  { value: "company-subsidiary-a", label: "子公司A" },
  { value: "company-subsidiary-b", label: "子公司B" },
  { value: "company-subsidiary-c", label: "子公司C" },
];

/**
 * 过滤后的项目列表
 */
const filteredProjects = ref<IHistoryProject[]>([]);

/**
 * 获取招标主体标签
 */
const getBidSubjectLabel = (value: string): string => {
  const option = bidSubjectOptions.find((opt) => opt.value === value);
  return option?.label || value;
};

/**
 * 格式化日期
 */
const formatDate = (timestamp: number | null): string => {
  if (!timestamp) return "-";
  const date = new Date(timestamp);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

/**
 * 加载项目列表
 */
const loadProjects = () => {
  filteredProjects.value = getMockHistoryProjects(
    searchKeyword.value,
    sortBy.value,
  );
};

/**
 * 处理搜索
 */
const handleSearch = () => {
  loadProjects();
};

/**
 * 处理排序变更
 */
const handleSortChange = () => {
  loadProjects();
};

/**
 * 处理选择项目
 */
const handleSelectProject = (project: IHistoryProject) => {
  emit("select-project", project);
  // 选择后不自动关闭，让用户决定是否关闭
};

/**
 * 监听抽屉打开状态，加载数据
 */
watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      // 重置搜索状态
      searchKeyword.value = "";
      sortBy.value = "date";
      loadProjects();
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.history-drawer__list {
  margin-top: 16px;
  min-height: 300px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.history-drawer__list-item {
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-drawer__list-item:hover {
  background-color: #f5f7fa;
}

.history-drawer__project-name {
  font-weight: 500;
  color: #333;
}

.history-drawer__info-row {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.history-drawer__label {
  color: #909399;
  flex-shrink: 0;
}

.history-drawer__value {
  color: #606266;
}

.history-drawer__empty {
  padding: 48px 0;
}

/* 列表项激活状态样式 */
:deep(.n-list-item) {
  padding: 12px 16px;
}

:deep(.n-thing-header__title) {
  font-size: 15px;
}

:deep(.n-thing-main__description) {
  margin-top: 8px;
}
</style>
