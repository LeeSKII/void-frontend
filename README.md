# Void Frontend

项目基于 Vue3、Vite、Typescript 以及 UI 库 Naive UI 进行开发，主要用于管理云枢自定义项目的前端部分。

## 开发规范

- 文件夹命名规则
- 组件命名规则
- 变量命名规则
- 代码风格规范
- 注释规范
- 路由规范
- 状态管理规范
- 接口规范
- 错误处理规范
- 单元测试规范
- 文档规范
- 部署规范
- 版本管理规范
- 代码审查规范
- 代码提交规范
- 代码合并规范
- 代码部署规范
- 代码发布规范
- 代码回滚规范

## 禁止事项

- 不得使用任何除项目引用的第三方库，例如 jQuery、Lodash 等。
- 不得使用任何除项目引用的第三方 UI 库，例如 Ant Design、Element UI 等。

## 自动导入

- 使用`unplugin-auto-import`（`npm i -D unplugin-auto-import`）和 `unplugin-vue-components`(`npm i unplugin-vue-components -D`) 实现了自动导入
- 自动导入的配置在`vite.config.ts`中，具体配置如下：

```typescript
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
// vite.config.ts
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
    }),
    Components({
      resolvers: [NaiveUiResolver()],
    }),
  ],
});
```
