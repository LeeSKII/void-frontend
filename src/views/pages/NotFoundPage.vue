<template>
  <div class="not-found-container">
    <n-result
      status="404"
      title="404"
      description="抱歉，您访问的页面不存在"
    >
      <template #footer>
        <n-space>
          <n-button @click="goHome" type="primary">
            返回首页
          </n-button>
          <n-button @click="goBack" v-if="canGoBack">
            返回上页
          </n-button>
        </n-space>
      </template>
    </n-result>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 检查是否有历史记录可以返回
const canGoBack = computed(() => {
  return window.history.length > 1
})

// 返回首页
const goHome = () => {
  // 如果当前路径包含/mobile，则返回移动端首页
  if (window.location.hash.includes('/mobile')) {
    router.push('/mobile/home')
  } else {
    router.push('/home')
  }
}

// 返回上一页
const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-container {
    padding: 16px;
  }
}
</style>