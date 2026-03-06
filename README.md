# Void Frontend

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.24-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Naive UI](https://img.shields.io/badge/Naive%20UI-2.43.2-18A058?style=flat-square&logo=naiveui&logoColor=white)](https://www.naiveui.com/)

项目基于 Vue3、Vite、TypeScript 以及 UI 库 Naive UI 进行开发，主要用于管理云枢自定义项目的前端部分。

## 开发约定

### 核心原则

- **文档注释优先**：功能上线后必须添加注释，使用 JSDoc 格式
- **AI 自动编码优先**：优先使用 AI 自动化编码，相关规范参考目录下的 vue3-ai-prompt.md 文件
- **可读性优先**：代码必须易于阅读，命名必须清晰易懂，注释必须完整准确
- **高内聚低耦合**：非必要严禁抽象封装，单文件为隔离整体环境
- **语义化命名**：禁止使用拼音缩写，变量名、函数名、文件名必须有意义，使用英文单词，除非极端情况下允许使用拼音缩写

### 代码组织约定

- **目录结构**：遵循项目预设的目录结构，不得随意更改
- **文件命名**：
  - 组件文件使用 PascalCase（如 `UserProfile.vue`）
  - 工具文件使用 camelCase（如 `apiHelper.ts`）
  - 类型定义文件使用 `.d.ts` 后缀（如 `types.d.ts`）
- **导入顺序**：
  1. Vue 相关导入
  2. 第三方库导入
  3. 本地组件/工具导入
  4. 类型定义导入

### 组件开发约定

- **组件结构**：按照 `<template>` -> `<script setup>` -> `<style scoped>` 顺序组织
- **Props 定义**：必须定义类型和默认值，使用 TypeScript 接口
- **事件命名**：使用 kebab-case，如 `@update-value`
- **组件大小**：单个组件文件不超过 500 行，超过则考虑拆分

### 状态管理约定

- **本地状态**：优先使用 `ref`，避免使用 `reactive`
- **全局状态**：使用 Pinia，按功能模块划分 store
- **状态命名**：使用描述性名称，避免缩写

### 样式约定

- **样式语言**：只允许使用原生 CSS
- **作用域**：组件样式必须使用 `scoped` 或 CSS Modules
- **命名规范**：使用 BEM 命名规范或 kebab-case
- **响应式设计**：移动端优先，使用媒体查询适配不同屏幕

### 图标规范

项目统一使用 Naive UI 的 `n-icon` 组件配合 `@vicons/ionicons5` 图标库，**禁止使用任何自定义 SVG 图标代码**。

#### 图标库依赖

```json
{
  "devDependencies": {
    "@vicons/ionicons5": "^0.13.0"
  }
}
```

#### 基本用法

```vue
<template>
  <!-- 导航栏图标按钮 -->
  <n-button circle>
    <template #icon>
      <n-icon>
        <HomeOutline />
      </n-icon>
    </template>
  </n-button>

  <!-- 独立图标显示 -->
  <n-icon size="24" color="#18a058">
    <CheckmarkCircle />
  </n-icon>

  <!-- 悬浮按钮图标 -->
  <n-float-button>
    <n-icon size="30">
      <Library />
    </n-icon>
  </n-float-button>
</template>

<script setup lang="ts">
import { HomeOutline, CheckmarkCircle, Library } from "@vicons/ionicons5";
</script>
```

#### 动态图标使用

```vue
<template>
  <n-icon :component="iconComponent" :size="size" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  CheckmarkCircle,
  CloseCircle,
  WarningOutline,
} from "@vicons/ionicons5";

interface Props {
  type: "success" | "error" | "warning";
  size?: number;
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
});

const iconMap = {
  success: CheckmarkCircle,
  error: CloseCircle,
  warning: WarningOutline,
};

const iconComponent = computed(() => iconMap[props.type]);
</script>
```

#### 常用图标参考

| 图标名称 | 说明 | 导入路径 |
|---------|------|----------|
| `HomeOutline` | 首页 | `@vicons/ionicons5` |
| `SettingsOutline` | 设置 | `@vicons/ionicons5` |
| `PersonOutline` | 用户 | `@vicons/ionicons5` |
| `SearchOutline` | 搜索 | `@vicons/ionicons5` |
| `AddOutline` / `Add` | 添加 | `@vicons/ionicons5` |
| `TrashOutline` | 删除 | `@vicons/ionicons5` |
| `CreateOutline` / `Edit` | 编辑 | `@vicons/ionicons5` |
| `CheckmarkCircle` | 成功 | `@vicons/ionicons5` |
| `CloseCircle` | 失败/关闭 | `@vicons/ionicons5` |
| `WarningOutline` | 警告 | `@vicons/ionicons5` |
| `InformationCircle` | 信息 | `@vicons/ionicons5` |
| `Library` | 历史/库 | `@vicons/ionicons5` |
| `ChevronBackOutline` | 返回 | `@vicons/ionicons5` |
| `ChevronForwardOutline` | 前进 | `@vicons/ionicons5` |

> 💡 **提示**：更多图标请访问 [Ionicons 官方文档](https://ionic.io/ionicons) 或 [Naive UI 图标文档](https://www.naiveui.com/zh-CN/os-theme/components/icon) 查阅。

#### 禁止事项

```vue
<!-- ❌ 禁止：内联 SVG 代码 -->
<template>
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <path d="M..."></path>
    </svg>
  </div>
</template>

<!-- ❌ 禁止：使用其他图标库 -->
<script setup>
import { SomeIcon } from "some-other-icon-library";
</script>

<!-- ✅ 正确：使用 n-icon + @vicons/ionicons5 -->
<template>
  <n-icon size="24">
    <HomeOutline />
  </n-icon>
</template>

<script setup lang="ts">
import { HomeOutline } from "@vicons/ionicons5";
</script>
```

#### TypeScript 类型支持

```typescript
import type { Component } from "vue";
import { Icon } from "@vicons/ionicons5";

// 图标组件类型
interface IconProps {
  icon: Component;
  size?: number | string;
  color?: string;
}

// 动态图标映射类型
type IconType = "success" | "error" | "warning" | "info";

const iconMap: Record<IconType, Component> = {
  success: CheckmarkCircle,
  error: CloseCircle,
  warning: WarningOutline,
  info: InformationCircle,
};
```

### 性能优化约定

- **懒加载**：路由和组件使用动态导入
- **图片优化**：使用适当格式和尺寸，考虑使用 WebP
- **代码分割**：按页面或功能模块进行代码分割

### 安全约定

- **XSS 防护**：避免直接使用 `v-html`，必须使用时确保内容已过滤
- **敏感信息**：不得在前端代码中硬编码密钥、密码等敏感信息
- **API 调用**：使用 HTTPS，验证输入数据

### Git 提交约定

- **提交格式**：遵循 Conventional Commits 规范
- **提交频率**：完成一个功能点或修复一个 bug 后立即提交
- **分支管理**：功能开发使用 feature 分支，修复使用 hotfix 分支

### 代码审查约定

- **自检**：提交前必须进行代码自检，确保符合规范
- **审查重点**：代码逻辑、性能、安全性、可维护性
- **反馈处理**：及时响应审查意见，必要时进行修改

## ✨ 特性

- 🚀 **现代化技术栈**：使用 Vue 3 Composition API、TypeScript 和 Vite 构建
- 🎨 **优雅的 UI 组件**：基于 Naive UI 提供丰富的组件库
- 📦 **自动导入**：支持 Vue API 和 Naive UI 组件的自动导入
- 🔧 **TypeScript 支持**：完整的类型检查和智能提示
- 📱 **响应式设计**：适配多种设备和屏幕尺寸
- 🛠️ **开发体验优化**：热更新、快速构建、ESLint 集成

## 📦 技术栈

| 技术                    | 版本    | 描述                                |
| ----------------------- | ------- | ----------------------------------- |
| Vue                     | ^3.5.24 | 渐进式 JavaScript 框架              |
| TypeScript              | ~5.9.3  | JavaScript 的超集，提供静态类型检查 |
| Vite                    | ^7.2.2  | 下一代前端构建工具                  |
| Naive UI                | ^2.43.2 | Vue 3 组件库                        |
| unplugin-auto-import    | ^20.2.0 | 自动导入 Vue API 和第三方库         |
| unplugin-vue-components | ^30.0.0 | 自动导入 Vue 组件                   |

## 🚀 快速开始

### 环境要求

- Node.js >= 22.0.0
- npm >= 7.0.0

### 安装依赖

```bash
# 使用 npm
npm install
```

### 启动开发服务器

```bash
# 使用 npm
npm run dev
```

开发服务器将在 `http://localhost:5173` 启动（如果端口被占用，会自动选择下一个可用端口）。

### 构建生产版本

```bash
# 使用 npm
npm run build
```

构建文件将输出到 `dist` 目录。

### 预览生产版本

```bash
# 使用 npm
npm run preview
```

## 📁 项目结构

```
void-frontend/
├── public/                 # 静态资源
│   └── vite.svg           # Vite 图标
├── src/                   # 源代码
│   ├── assets/            # 资源文件
│   │   └── vue.svg        # Vue 图标
│   ├── components/        # 公共组件
│   │   └── HelloWorld.vue # 示例组件
│   ├── composables/       # 组合式函数
│   ├── router/            # 路由配置
│   │   └── index.ts       # 路由定义文件
│   ├── utils/             # 工具函数
│   │   └── dingtalk.ts    # 钉钉相关工具
│   ├── views/             # 页面组件
│   │   ├── pages/         # PC端页面
│   │   │   ├── HomePage.vue      # PC端首页
│   │   │   ├── NotFoundPage.vue  # 404页面
│   │   │   └── sso/              # SSO单点登录相关页面
│   │   │       └── SSOPage.vue   # SSO登录页面
│   │   └── mobile-pages/  # 移动端页面
│   │       └── HomePage.vue      # 移动端首页
│   ├── App.vue            # 根组件
│   ├── main.ts            # 应用入口文件
│   └── style.css          # 全局样式
├── .env.example           # 环境变量示例文件
├── .gitignore             # Git 忽略文件
├── index.html             # HTML 模板
├── package.json           # 项目配置和依赖
├── package-lock.json      # 依赖锁定文件
├── README.md              # 项目文档
├── tsconfig.app.json      # TypeScript 应用配置
├── tsconfig.json          # TypeScript 基础配置
├── tsconfig.node.json     # TypeScript Node 配置
└── vite.config.ts         # Vite 配置文件
```

### 页面结构说明

项目采用 PC 端和移动端分离的页面结构设计：

- **PC 端页面**：存放在 [`src/views/pages/`](src/views/pages/) 目录下，适用于桌面设备浏览
- **移动端页面**：存放在 [`src/views/mobile-pages/`](src/views/mobile-pages/) 目录下，适用于移动设备浏览

### 路由配置

项目使用 Vue Router 进行路由管理，配置文件位于 [`src/router/index.ts`](src/router/index.ts:1)。

#### 路由结构

- **PC 端路由**：直接访问页面组件，如 `/home` 对应 PC 端首页
- **移动端路由**：使用嵌套路由结构，主路径为 `/mobile`，子路由如 `/mobile/home` 对应移动端首页
- **404 页面**：使用通配符路由 `/:pathMatch(.*)*` 处理未匹配的路径

#### 路由特性

- 使用 [`createWebHashHistory`](src/router/index.ts:28) 创建基于 hash 的路由模式，基础路径为 `/void-frontend`
- 配置了全局前置守卫，自动设置页面标题（通过 [`meta.title`](src/router/index.ts:22) 属性）
- 404 页面智能判断来源，提供返回首页和返回上页功能

## 📋 开发规范

### 文件夹命名规则

- 使用小写字母和连字符（kebab-case）
- 例如：`user-profile`、`order-management`

### 组件命名规则

- 使用 PascalCase（大驼峰命名法）
- 组件文件名应与组件名保持一致
- 例如：`UserProfile.vue`、`OrderManagement.vue`

### 变量命名规则

- 变量和函数：使用 camelCase（小驼峰命名法）
- 常量：使用 UPPER_SNAKE_CASE（大写下划线）
- CSS 类名：使用 kebab-case（短横线连接）

```typescript
// 变量和函数
const userName = 'john'
const getUserInfo = () => {}

// 常量
const API_BASE_URL = 'https://api.example.com'

// CSS 类名
.user-profile {
  /* 样式 */
}
```

### 代码风格规范

- 使用 2 个空格进行缩进
- 使用双引号
- 语句末尾加分号
- 对象和数组最后保留尾随逗号

```typescript
// ✅ 推荐
const userInfo = {
  name: "John",
  age: 30,
};

const getUserList = () => {
  return ["user1", "user2"];
};
```

### 注释规范

- 使用 JSDoc 格式注释函数和类
- 复杂逻辑添加行内注释
- 组件使用 Vue 官方注释格式

```typescript
/**
 * 获取用户信息
 * @param userId 用户ID
 * @returns 用户信息对象
 */
const getUserInfo = (userId: string) => {
  // 调用API获取用户信息
  return api.getUser(userId)
}

<!--
  @component 用户资料组件
  @description 显示用户的基本信息
-->
<template>
  <div class="user-profile">
    <!-- 用户头像 -->
    <n-avatar :src="user.avatar" />
  </div>
</template>
```

### Vue 组件注释规范

为了提高代码可读性和维护性，所有 Vue 组件都应遵循以下注释规范：

#### 组件顶部注释

每个 Vue 组件文件都应在顶部添加组件描述注释：

```vue
<!--
  @component 组件名称
  @description 组件功能描述
  @author 开发者名称（可选）
  @since 创建日期（可选）
  @example 使用示例（可选）
-->
<template>
  <!-- 组件模板内容 -->
</template>
```

#### 完整组件注释示例

以下是一个完整的 Vue 组件注释示例：

```vue
<!--
  @component UserCard
  @description 用户卡片组件，用于展示用户基本信息和操作按钮
  @author 开发团队
  @since 2023-11-21
  @example
  <UserCard
    :user-info="userData"
    :show-details="true"
    @update-user="handleUserUpdate"
  />
-->
<template>
  <div class="user-card">
    <!-- 用户头像区域 -->
    <div class="avatar-section">
      <n-avatar
        :src="userInfo.avatar"
        :size="avatarSize"
        fallback-src="/default-avatar.png"
      />
    </div>

    <!-- 用户信息区域 -->
    <div class="info-section">
      <h3 class="user-name">{{ userInfo.name }}</h3>
      <p class="user-email">{{ userInfo.email }}</p>
      <p class="user-department" v-if="userInfo.department">
        {{ userInfo.department }}
      </p>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-section" v-if="showActions">
      <n-space>
        <n-button
          v-if="showDetails"
          @click="handleViewDetails"
          type="primary"
          size="small"
        >
          查看详情
        </n-button>
        <n-button @click="handleEdit" type="tertiary" size="small">
          编辑
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

/**
 * 用户信息接口定义
 */
interface UserInfo {
  /** 用户唯一标识 */
  id: string;
  /** 用户姓名 */
  name: string;
  /** 用户邮箱 */
  email: string;
  /** 用户头像URL */
  avatar?: string;
  /** 用户部门 */
  department?: string;
  /** 用户角色 */
  role?: string;
}

/**
 * 组件属性接口定义
 */
interface Props {
  /** 用户信息对象 */
  userInfo: UserInfo;
  /** 是否显示详情按钮 */
  showDetails?: boolean;
  /** 是否显示操作按钮区域 */
  showActions?: boolean;
  /** 头像尺寸 */
  size?: "small" | "medium" | "large";
}

/**
 * 组件事件接口定义
 */
interface Emits {
  /** 查看详情事件 */
  (e: "view-details", user: UserInfo): void;
  /** 编辑用户事件 */
  (e: "edit-user", user: UserInfo): void;
  /** 更新用户事件 */
  (e: "update-user", user: UserInfo): void;
}

// 组件属性定义，设置默认值
const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
  showActions: true,
  size: "medium",
});

// 组件事件定义
const emit = defineEmits<Emits>();

// 内部状态
const isLoading = ref(false);

/**
 * 计算头像尺寸
 * @returns {number} 头像像素大小
 */
const avatarSize = computed(() => {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };
  return sizeMap[props.size];
});

/**
 * 处理查看详情按钮点击事件
 * 触发 view-details 事件并传递用户信息
 */
const handleViewDetails = () => {
  emit("view-details", props.userInfo);
};

/**
 * 处理编辑按钮点击事件
 * 触发 edit-user 事件并传递用户信息
 */
const handleEdit = () => {
  emit("edit-user", props.userInfo);
};

/**
 * 异步加载用户详细信息
 * @param userId 用户ID
 * @returns Promise<UserInfo> 用户详细信息
 */
const loadUserDetails = async (userId: string): Promise<UserInfo> => {
  try {
    isLoading.value = true;
    // 这里应该是实际的API调用
    const response = await fetch(`/api/users/${userId}`);
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("加载用户详情失败:", error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* 组件样式 */
.user-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.user-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.avatar-section {
  flex-shrink: 0;
  margin-right: 16px;
}

.info-section {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #666;
}

.user-department {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.action-section {
  flex-shrink: 0;
  margin-left: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-card {
    flex-direction: column;
    text-align: center;
  }

  .avatar-section {
    margin-right: 0;
    margin-bottom: 12px;
  }

  .action-section {
    margin-left: 0;
    margin-top: 12px;
  }
}
</style>
```

#### 简单组件注释示例

对于简单的组件，可以使用更简洁的注释：

```vue
<!--
  @component LoadingSpinner
  @description 加载中动画组件，显示旋转的加载指示器
-->
<template>
  <div class="loading-container">
    <div class="spinner"></div>
    <p v-if="showText" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  /** 是否显示加载文本 */
  showText?: boolean;
  /** 加载文本内容 */
  text?: string;
}

const props = withDefaults(defineProps<Props>(), {
  showText: true,
  text: "加载中...",
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
```

#### 注释要点总结

1. **组件顶部注释**：使用 HTML 注释格式，包含组件名称、描述等信息
2. **接口注释**：为 TypeScript 接口添加 JSDoc 注释，说明每个属性的用途
3. **函数注释**：为所有函数添加 JSDoc 注释，说明功能、参数和返回值
4. **复杂逻辑注释**：在复杂的业务逻辑处添加行内注释
5. **模板注释**：在模板的重要区域添加注释，说明各部分功能
6. **样式注释**：为复杂的 CSS 规则添加注释，特别是响应式设计部分

### TypeScript 类型定义规范

- 优先使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型、交叉类型等复杂类型
- 类型命名使用 PascalCase，并以 `T` 或 `I` 开头（可选）

```typescript
// 用户信息接口
interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// API 响应类型
type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

// 组件 Props 类型
interface UserCardProps {
  userInfo: UserInfo;
  showDetails?: boolean;
  onUpdate?: (user: UserInfo) => void;
}
```

### 组件开发最佳实践

- **组件结构**：保持单一职责原则，一个组件只做一件事
- **Props 验证**：使用 TypeScript 定义 Props 类型，提供默认值
- **事件处理**：使用描述性的事件名称，避免使用通用名称

```vue
<template>
  <div class="user-card">
    <n-avatar :src="userInfo.avatar" :size="avatarSize" />
    <div class="user-info">
      <h3>{{ userInfo.name }}</h3>
      <p>{{ userInfo.email }}</p>
      <n-button v-if="showDetails" @click="handleViewDetails" type="primary">
        查看详情
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  userInfo: UserInfo;
  showDetails?: boolean;
  size?: "small" | "medium" | "large";
}

interface Emits {
  (e: "view-details", user: UserInfo): void;
  (e: "update-user", user: UserInfo): void;
}

const props = withDefaults(defineProps<Props>(), {
  showDetails: false,
  size: "medium",
});

const emit = defineEmits<Emits>();

const avatarSize = computed(() => {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };
  return sizeMap[props.size];
});

const handleViewDetails = () => {
  emit("view-details", props.userInfo);
};
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-info {
  margin-left: 16px;
}

.user-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
}

.user-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}
</style>
```

### 错误处理规范

- **统一错误处理**：创建全局错误处理函数
- **用户友好提示**：使用 Naive UI 的 message 组件显示错误信息
- **错误日志**：记录错误信息到控制台，便于调试

```typescript
// utils/errorHandler.ts
import { useMessage } from "naive-ui";

const message = useMessage();

/**
 * 统一错误处理函数
 * @param error 错误对象
 * @param defaultMessage 默认错误消息
 */
export const handleError = (error: any, defaultMessage = "操作失败") => {
  console.error("Error:", error);

  // 根据错误类型显示不同的提示
  if (error.response) {
    // API 请求错误
    const status = error.response.status;
    const message = error.response.data?.message || defaultMessage;

    switch (status) {
      case 400:
        message.error(`请求参数错误: ${message}`);
        break;
      case 401:
        message.error("未授权，请重新登录");
        break;
      case 403:
        message.error("拒绝访问");
        break;
      case 404:
        message.error("请求的资源不存在");
        break;
      case 500:
        message.error("服务器内部错误");
        break;
      default:
        message.error(message);
    }
  } else if (error.request) {
    // 网络错误
    message.error("网络连接失败，请检查网络设置");
  } else {
    // 其他错误
    message.error(error.message || defaultMessage);
  }
};

// 在组件中使用
import { handleError } from "@/utils/errorHandler";

const submitForm = async () => {
  try {
    await userApi.login(formData);
    message.success("登录成功");
  } catch (error) {
    handleError(error, "登录失败，请检查用户名和密码");
  }
};
```

### 路由规范

- 使用嵌套路由结构
- 路由命名使用 kebab-case
- PC 端页面组件放在 [`src/views/pages/`](src/views/pages/) 目录下
- 移动端页面组件放在 [`src/views/mobile-pages/`](src/views/mobile-pages/) 目录下
- 移动端路由使用 `/mobile` 作为基础路径，子路由使用嵌套结构

```typescript
// PC端路由示例
const pcRoutes = [
  {
    path: "/home",
    component: () => import("@/views/pages/HomePage.vue"),
  },
];

// 移动端路由示例
const mobileRoutes = [
  {
    path: "/mobile",
    component: () => import("@/views/mobile-pages/HomePage.vue"),
    children: [
      {
        path: "home",
        component: () => import("@/views/mobile-pages/HomePage.vue"),
      },
    ],
  },
];
```

### PC 端与移动端页面开发规范

#### 页面结构规范

- **PC 端页面**：存放在 [`src/views/pages/`](src/views/pages/) 目录下

  - 适用于桌面设备（宽度 ≥ 768px）
  - 可使用更复杂的布局和交互
  - 可展示更多信息和功能

- **移动端页面**：存放在 [`src/views/mobile-pages/`](src/views/mobile-pages/) 目录下
  - 适用于移动设备（宽度 < 768px）
  - 应采用简洁的布局和交互
  - 优先考虑触摸操作和性能优化

#### 响应式设计规范

- 使用媒体查询实现响应式布局
- 推荐断点：768px（平板和手机分界点）
- 移动端优先考虑垂直布局和滑动操作

```css
/* 响应式设计示例 */
.container {
  /* 默认移动端样式 */
  padding: 16px;
}

@media (min-width: 768px) {
  .container {
    /* PC端样式 */
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

#### 路由导航规范

- PC 端和移动端页面可能需要不同的导航逻辑
- 404 页面会根据当前路径智能判断返回对应的首页
- 使用 [`router.push()`](src/router/index.ts:37) 进行程序化导航

```typescript
// 导航示例
const navigateToHome = () => {
  // 判断当前设备类型或路径
  if (isMobile || window.location.hash.includes("/mobile")) {
    router.push("/mobile/home");
  } else {
    router.push("/home");
  }
};
```

### 状态管理规范

- 项目整体暂时无全局变量控制
- 状态隔离环境为单文件级别

### 接口规范

- API 请求统一使用 axios 库
- 因为不同接口之间的共识性未达成，暂不予封装统一 API 访问接口层
- 使用 TypeScript 定义接口出入参类型

### 错误处理规范

- 使用统一的错误处理机制
- 错误信息显示使用 Naive UI 的 message 组件
- 添加错误边界处理

```typescript
// 统一错误处理
const handleError = (error: any) => {
  console.error("Error:", error);
  message.error(error.message || "操作失败");
};

// API 请求错误处理
try {
  const result = await userApi.login(credentials);
} catch (error) {
  handleError(error);
}
```

### 测试规范

代码质量由 AI 审核控制，为了精简和提高迭代速度，不做代码规范约束。

### 性能优化规范

- **组件懒加载**：使用动态导入实现组件懒加载
- **虚拟滚动**：处理大量数据时使用虚拟滚动
- **防抖与节流**：对频繁触发的事件使用防抖或节流
- **图片优化**：使用适当的图片格式和尺寸，考虑懒加载

```typescript
// 路由懒加载示例
const routes = [
  {
    path: "/user-profile",
    component: () => import("@/views/pages/UserProfile.vue")
  }
];

// 组件懒加载示例
const HeavyComponent = defineAsyncComponent(() =>
  import("@/components/HeavyComponent.vue")
);

// 防抖示例
import { debounce } from "lodash-es";

const searchUsers = debounce(async (query: string) => {
  if (!query.trim()) return;

  try {
    const results = await userApi.search(query);
    searchResults.value = results;
  } catch (error) {
    handleError(error, "搜索用户失败");
  }
}, 300);

// 图片懒加载示例
<template>
  <img
    v-lazy="imageUrl"
    :alt="imageAlt"
    class="lazy-image"
  />
</template>
```

### 安全规范

- **XSS 防护**：避免直接使用 `v-html`，必须使用时确保内容已过滤
- **敏感信息**：不得在前端代码中硬编码密钥、密码等敏感信息
- **输入验证**：对所有用户输入进行验证和清理

```typescript
// XSS 防护示例
import { DOMPurify } from "dompurify";

// 安全地渲染 HTML 内容
const sanitizedHtml = computed(() => {
  return DOMPurify.sanitize(userInput.value);
});

// 输入验证示例
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

## 🔄 自动导入

项目使用 `unplugin-auto-import` 和 `unplugin-vue-components` 实现了自动导入功能，无需手动导入 Vue API 和 Naive UI 组件。

### 自动导入配置

自动导入的配置在 [`vite.config.ts`](vite.config.ts) 中：

```typescript
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        "vue",
        {
          "naive-ui": [
            "useDialog",
            "useMessage",
            "useNotification",
            "useLoadingBar",
          ],
        },
      ],
      dts: true, // 生成类型声明文件
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: true, // 生成类型声明文件
    }),
  ],
});
```

### 自动导入的内容

- **Vue API**：ref、reactive、computed、watch、onMounted 等
- **Naive UI Hooks**：useDialog、useMessage、useNotification、useLoadingBar
- **Naive UI 组件**：n-button、n-input、n-space 等

### 使用示例

```vue
<template>
  <n-space>
    <n-button @click="showMessage">显示消息</n-button>
    <n-input v-model:value="inputValue" placeholder="请输入内容" />
  </n-space>
</template>

<script setup lang="ts">
// 无需手动导入，以下内容会自动导入
// import { ref } from 'vue'
// import { useMessage } from 'naive-ui'
// import { NButton, NInput, NSpace } from 'naive-ui'

const inputValue = ref("");
const message = useMessage();

const showMessage = () => {
  message.info("这是一条消息");
};
</script>
```

## 🚫 禁止事项

### 依赖使用禁止事项

- 不得使用任何除项目引用的第三方库，例如 jQuery、Lodash 等
- 不得使用任何除项目引用的第三方 UI 库，例如 Ant Design、Element UI 等
- **不得使用除 `@vicons/ionicons5` 之外的任何其他图标库（如 `@iconify/vue`、`vue-svg-icon` 等）**
- **不得在组件中直接编写内联 SVG 代码**
- 不得随意添加新的依赖，必须经过团队评估和批准
- 不得使用已废弃或有安全漏洞的依赖包

### 代码编写禁止事项

- 不得在组件中使用全局样式，应使用 scoped 样式或 CSS Modules
- 不得直接修改 props，应使用 emit 向父组件传递事件
- 不得使用 `any` 类型，必须明确指定类型
- 不得使用 `eval()` 或 `Function()` 构造函数等危险函数
- 不得在模板中编写复杂逻辑，应将逻辑移至计算属性或方法
- 不得使用硬编码的魔法数字或字符串，应定义为常量
- **不得使用任何自定义 SVG 图标代码，必须使用 `n-icon` 组件配合 `@vicons/ionicons5` 图标库**

### 性能相关禁止事项

- 不得在组件中创建不必要的响应式数据
- 不得在循环或高频事件中创建新对象或函数
- 不得忽略内存泄漏问题，如未清理的定时器、事件监听器等
- 不得在生产环境中保留 console.log、debugger 等调试代码

### 安全相关禁止事项

- 不得在前端代码中硬编码密钥、密码、API 密钥等敏感信息
- 不得直接使用用户输入进行 DOM 操作，必须先进行验证和转义
- 不得忽略 HTTPS 证书验证
- 不得在 URL 中传递敏感信息

### Git 相关禁止事项

- 不得将 `.env`、`.env.local` 等包含敏感信息的文件提交到版本控制
- 不得提交 node_modules、dist、.DS_Store 等无需版本控制的文件
- 不得提交包含个人信息的代码或配置
- 不得在提交信息中包含敏感信息或不当内容

## 🚀 部署指南

### 构建生产版本

```bash
npm run build
```

### 部署到静态服务器

构建完成后，将 `dist` 目录下的文件部署到静态服务器即可。

### Nginx 配置示例

```nginx
server {
  listen 80;
  server_name your-domain.com;
  root /path/to/your/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # 静态资源缓存
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 规范：

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：

```
feat: 添加用户登录功能
fix: 修复表单验证问题
docs: 更新 README 文档
```

## ❓ 常见问题

### Q: 如何添加新的 Naive UI 组件？

A: 直接在模板中使用组件，会自动导入。例如使用 `<n-card>` 组件：

```vue
<template>
  <n-card title="卡片标题"> 卡片内容 </n-card>
</template>
```

### Q: 如何添加新的页面路由？

A: 1. 在对应的 views 目录下创建页面组件（PC 端放在 `src/views/pages/`，移动端放在 `src/views/mobile-pages/`）2. 在 [`src/router/index.ts`](src/router/index.ts:1) 中添加路由规则 3. 使用 `<router-link>` 或 `router.push()` 进行导航

### Q: 如何区分 PC 端和移动端页面？

A: 项目采用目录结构区分 PC 端和移动端页面：

- PC 端页面存放在 [`src/views/pages/`](src/views/pages/) 目录下
- 移动端页面存放在 [`src/views/mobile-pages/`](src/views/mobile-pages/) 目录下
- 移动端路由使用 `/mobile` 作为基础路径

### Q: 如何实现 PC 端和移动端的响应式设计？

A: 1. 使用 CSS 媒体查询实现不同屏幕尺寸的样式适配 2. 推荐使用 768px 作为 PC 端和移动端的分界点 3. 移动端优先考虑垂直布局和触摸操作优化

```css
/* 响应式设计示例 */
.component {
  /* 移动端默认样式 */
  width: 100%;
  padding: 16px;
}

@media (min-width: 768px) {
  .component {
    /* PC端样式 */
    max-width: 1200px;
    padding: 24px;
  }
}
```

### Q: 如何在 PC 端和移动端之间共享组件？

A: 可以将共享组件放在 [`src/components/`](src/components/) 目录下，然后在 PC 端和移动端页面中分别导入使用：

```vue
<!-- PC端页面 src/views/pages/HomePage.vue -->
<template>
  <div>
    <SharedComponent />
    <!-- PC端特有内容 -->
  </div>
</template>

<!-- 移动端页面 src/views/mobile-pages/HomePage.vue -->
<template>
  <div>
    <SharedComponent />
    <!-- 移动端特有内容 -->
  </div>
</template>

<script setup>
import SharedComponent from "@/components/SharedComponent.vue";
</script>
```

### Q: 如何处理 API 请求？

A: 建议使用统一的请求封装，可以参考以下示例：

```typescript
// utils/request.ts
import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加 token 等认证信息
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    return Promise.reject(error);
  }
);

export default request;
```

### Q: 如何进行环境配置？

A: 使用 Vite 的环境变量功能：

1. 创建 `.env` 文件（所有环境）
2. 创建 `.env.development` 文件（开发环境）
3. 创建 `.env.production` 文件（生产环境）

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Void Frontend (Dev)

# .env.production
VITE_API_BASE_URL=https://api.your-domain.com
VITE_APP_TITLE=Void Frontend
```

在代码中使用：

```typescript
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

## 📄 使用范围

本项目仅用于管理云枢自定义项目的前端部分，不得用于任何其它用途。
