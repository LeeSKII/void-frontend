<template>
  <div class="service-bidding-view">
    <div class="service-bidding-view__header">
      <h1 class="service-bidding-view__title">服务招标</h1>
    </div>
    <div class="service-bidding-view__content">
      <n-result status="info" title="功能开发中" description="服务招标模块正在建设中，敬请期待">
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
.service-bidding-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.service-bidding-view__header {
  margin-bottom: 24px;
  text-align: center;
}

.service-bidding-view__title {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #2080f0;
}

.service-bidding-view__content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}
</style>
