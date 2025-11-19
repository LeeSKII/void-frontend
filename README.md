# Void Frontend

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5.24-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Naive UI](https://img.shields.io/badge/Naive%20UI-2.43.2-18A058?style=flat-square&logo=naiveui&logoColor=white)](https://www.naiveui.com/)

项目基于 Vue3、Vite、TypeScript 以及 UI 库 Naive UI 进行开发，主要用于管理云枢自定义项目的前端部分。

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
│   ├── views/             # 页面组件
│   │   ├── pages/         # PC端页面
│   │   │   ├── HomePage.vue      # PC端首页
│   │   │   └── NotFoundPage.vue  # 404页面
│   │   └── mobile-pages/  # 移动端页面
│   │       └── HomePage.vue      # 移动端首页
│   ├── App.vue            # 根组件
│   ├── main.ts            # 应用入口文件
│   └── style.css          # 全局样式
├── .gitignore             # Git 忽略文件
├── index.html             # HTML 模板
├── package.json           # 项目配置和依赖
├── README.md              # 项目文档
├── tsconfig.app.json      # TypeScript 应用配置
├── tsconfig.json          # TypeScript 基础配置
├── tsconfig.node.json     # TypeScript Node 配置
└── vite.config.ts         # Vite 配置文件
```

### 页面结构说明

项目采用PC端和移动端分离的页面结构设计：

- **PC端页面**：存放在 [`src/views/pages/`](src/views/pages/) 目录下，适用于桌面设备浏览
- **移动端页面**：存放在 [`src/views/mobile-pages/`](src/views/mobile-pages/) 目录下，适用于移动设备浏览

### 路由配置

项目使用 Vue Router 进行路由管理，配置文件位于 [`src/router/index.ts`](src/router/index.ts:1)。

#### 路由结构

- **PC端路由**：直接访问页面组件，如 `/home` 对应PC端首页
- **移动端路由**：使用嵌套路由结构，主路径为 `/mobile`，子路由如 `/mobile/home` 对应移动端首页
- **404页面**：使用通配符路由 `/:pathMatch(.*)*` 处理未匹配的路径

#### 路由特性

- 使用 [`createWebHashHistory`](src/router/index.ts:28) 创建基于hash的路由模式，基础路径为 `/void-frontend`
- 配置了全局前置守卫，自动设置页面标题（通过 [`meta.title`](src/router/index.ts:22) 属性）
- 404页面智能判断来源，提供返回首页和返回上页功能

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

### 路由规范

- 使用嵌套路由结构
- 路由命名使用 kebab-case
- PC端页面组件放在 [`src/views/pages/`](src/views/pages/) 目录下
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

### PC端与移动端页面开发规范

#### 页面结构规范

- **PC端页面**：存放在 [`src/views/pages/`](src/views/pages/) 目录下
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

- PC端和移动端页面可能需要不同的导航逻辑
- 404页面会根据当前路径智能判断返回对应的首页
- 使用 [`router.push()`](src/router/index.ts:37) 进行程序化导航

```typescript
// 导航示例
const navigateToHome = () => {
  // 判断当前设备类型或路径
  if (isMobile || window.location.hash.includes('/mobile')) {
    router.push('/mobile/home');
  } else {
    router.push('/home');
  }
};
```

### 状态管理规范

- 使用 Pinia 进行状态管理
- Store 文件放在 `stores` 目录下
- 使用 TypeScript 定义状态类型

```typescript
// stores/user.ts
interface UserState {
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    userInfo: null,
    isLoggedIn: false,
  }),
  actions: {
    async login(credentials: LoginCredentials) {
      // 登录逻辑
    },
  },
});
```

### 接口规范

- API 请求使用统一的请求封装
- 接口定义放在 `api` 目录下
- 使用 TypeScript 定义接口类型

```typescript
// api/user.ts
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  userInfo: UserInfo;
}

export const userApi = {
  login: (data: LoginRequest): Promise<LoginResponse> => {
    return request.post("/auth/login", data);
  },
};
```

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

- 不得使用任何除项目引用的第三方库，例如 jQuery、Lodash 等
- 不得使用任何除项目引用的第三方 UI 库，例如 Ant Design、Element UI 等
- 不得在组件中使用全局样式，应使用 scoped 样式或 CSS Modules
- 不得直接修改 props，应使用 emit 向父组件传递事件

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

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送到分支：`git push origin feature/AmazingFeature`
5. 提交 Pull Request

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

A: 1. 在对应的views目录下创建页面组件（PC端放在 `src/views/pages/`，移动端放在 `src/views/mobile-pages/`）2. 在 [`src/router/index.ts`](src/router/index.ts:1) 中添加路由规则 3. 使用 `<router-link>` 或 `router.push()` 进行导航

### Q: 如何区分PC端和移动端页面？

A: 项目采用目录结构区分PC端和移动端页面：
- PC端页面存放在 [`src/views/pages/`](src/views/pages/) 目录下
- 移动端页面存放在 [`src/views/mobile-pages/`](src/views/mobile-pages/) 目录下
- 移动端路由使用 `/mobile` 作为基础路径

### Q: 如何实现PC端和移动端的响应式设计？

A: 1. 使用CSS媒体查询实现不同屏幕尺寸的样式适配 2. 推荐使用768px作为PC端和移动端的分界点 3. 移动端优先考虑垂直布局和触摸操作优化

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

### Q: 如何在PC端和移动端之间共享组件？

A: 可以将共享组件放在 [`src/components/`](src/components/) 目录下，然后在PC端和移动端页面中分别导入使用：

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
import SharedComponent from '@/components/SharedComponent.vue';
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
