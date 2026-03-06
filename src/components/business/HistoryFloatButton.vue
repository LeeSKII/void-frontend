<!--
  @component HistoryFloatButton
  @description 历史项目悬浮按钮组件，点击打开历史项目抽屉
-->
<template>
  <n-float-button
    :right="24"
    :bottom="24"
    :width="56"
    :height="56"
    type="primary"
    @click="handleClick"
  >
    <n-icon size="30">
      <Library />
    </n-icon>
  </n-float-button>
</template>

<script setup lang="ts">
import { Library } from "@vicons/ionicons5";
/**
 * 组件 Props
 */
interface Props {
  /** 控制抽屉显示状态 */
  modelValue: boolean;
}

/**
 * 组件 Emits
 */
interface Emits {
  /** 更新抽屉显示状态 */
  (e: "update:modelValue", value: boolean): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

/**
 * 处理点击事件
 */
const handleClick = () => {
  emit("update:modelValue", true);
};
</script>

<style scoped>
.history-icon {
  font-size: 24px;
  line-height: 1;
}
</style>
