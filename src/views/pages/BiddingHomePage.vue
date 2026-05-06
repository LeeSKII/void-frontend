<template>
  <div class="home-page">
    <div class="home-page__header">
      <h1 class="home-page__title">招标采购管理系统</h1>
      <p class="home-page__subtitle">请选择招标形式开始办理</p>
    </div>

    <div class="home-page__cards">
      <div
        v-for="item in biddingTypes"
        :key="item.path"
        class="home-page__card"
        @click="handleNavigate(item.path)"
      >
        <div class="home-page__card-icon">
          <n-icon :size="48">
            <component :is="item.icon" />
          </n-icon>
        </div>
        <div class="home-page__card-content">
          <h3 class="home-page__card-title">{{ item.title }}</h3>
          <p class="home-page__card-desc">{{ item.description }}</p>
        </div>
        <div class="home-page__card-arrow">
          <n-icon :size="24">
            <ChevronForward />
          </n-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { NIcon } from "naive-ui";
import {
  DocumentText,
  Business,
  Construct,
  HandLeft,
  GitCompare,
  ChevronForward,
} from "@vicons/ionicons5";

interface BiddingType {
  title: string;
  description: string;
  path: string;
  icon: object;
}

const router = useRouter();

const biddingTypes: BiddingType[] = [
  {
    title: "公开招标",
    description: "公开征集投标人的招标方式，适用于大规模采购",
    path: "/bidding/public-bid",
    icon: DocumentText,
  },
  {
    title: "邀请招标",
    description: "邀请特定供应商投标的招标方式",
    path: "/bidding/invitation-bid",
    icon: Business,
  },
  {
    title: "服务招标",
    description: "针对服务类项目的招标采购",
    path: "/bidding/service-bid",
    icon: Construct,
  },
  {
    title: "施工招标",
    description: "针对工程施工项目的招标采购",
    path: "/bidding/construction-bid",
    icon: Construct,
  },
  {
    title: "谈判采购",
    description: "与供应商进行谈判的采购方式",
    path: "/bidding/negotiation-bid",
    icon: HandLeft,
  },
  {
    title: "询比采购",
    description: "通过询价比较选择供应商的采购方式",
    path: "/bidding/inquiry-bid",
    icon: GitCompare,
  },
];

const handleNavigate = (path: string) => {
  router.push(path);
};
</script>

<style scoped>
.home-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 24px;
}

.home-page__header {
  text-align: center;
  margin-bottom: 48px;
}

.home-page__title {
  margin: 0 0 12px 0;
  font-size: 32px;
  font-weight: 600;
  color: #2080f0;
}

.home-page__subtitle {
  margin: 0;
  font-size: 16px;
  color: #666;
}

.home-page__cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.home-page__card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.home-page__card:hover {
  border-color: #2080f0;
  box-shadow: 0 4px 16px rgba(32, 128, 240, 0.15);
  transform: translateY(-2px);
}

.home-page__card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  background: #f0f7ff;
  border-radius: 12px;
  color: #2080f0;
  flex-shrink: 0;
}

.home-page__card-content {
  flex: 1;
  padding: 0 16px;
}

.home-page__card-title {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.home-page__card-desc {
  margin: 0;
  font-size: 14px;
  color: #888;
  line-height: 1.5;
}

.home-page__card-arrow {
  color: #ccc;
  transition: color 0.3s ease;
}

.home-page__card:hover .home-page__card-arrow {
  color: #2080f0;
}

@media (max-width: 768px) {
  .home-page {
    padding: 24px 16px;
  }

  .home-page__title {
    font-size: 24px;
  }

  .home-page__cards {
    grid-template-columns: 1fr;
  }

  .home-page__card {
    padding: 20px;
  }

  .home-page__card-icon {
    width: 56px;
    height: 56px;
  }
}
</style>
