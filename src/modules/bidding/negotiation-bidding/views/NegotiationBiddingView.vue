<template>
  <div class="negotiation-bidding-view">
    <div class="negotiation-bidding-view__header">
      <h1 class="negotiation-bidding-view__title">谈判采购</h1>
    </div>
    <div class="negotiation-bidding-view__content">
      <n-result status="info" title="功能开发中" description="谈判采购模块正在建设中，敬请期待">
        <template #footer>
          <n-button @click="handleBack">返回首页</n-button>
        </template>
      </n-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const handleBack = () => {
  router.push("/");
};
</script>

<style scoped>
.negotiation-bidding-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.negotiation-bidding-view__header {
  margin-bottom: 24px;
  text-align: center;
}

.negotiation-bidding-view__title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #2080f0;
}

.negotiation-bidding-view__content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
</style>
