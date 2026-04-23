<!--
  @component HistoryFloatButton
  @description 右下角悬浮按钮组，包含历史项目模板和AI填单功能
-->
<template>
  <n-float-button-group right="24" bottom="24" position="fixed">
    <!-- 历史项目按钮 -->
    <n-float-button
      tooltip="带入历史项目模板"
      type="primary"
      @click="handleHistoryClick"
    >
      <n-icon size="24">
        <Library />
      </n-icon>
    </n-float-button>

    <!-- AI填单按钮 -->
    <n-float-button
      tooltip="AI智能填单"
      type="primary"
      @click="handleAIClick"
    >
      <n-icon size="24">
        <Sparkles />
      </n-icon>
    </n-float-button>
  </n-float-button-group>
</template>

<script setup lang="ts">
import { Library, Sparkles } from "@vicons/ionicons5";
/**
 * 组件 Emits
 */
interface Emits {
  /** 打开历史项目抽屉 */
  (e: "open-history"): void;
  /** 打开AI填单 */
  (e: "open-ai"): void;
}

const emit = defineEmits<Emits>();

const handleHistoryClick = () => {
  emit("open-history");
};

const handleAIClick = () => {
  emit("open-ai");
};
</script>

<style scoped>
</style>
