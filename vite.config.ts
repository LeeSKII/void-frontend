import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
// vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/void-frontend/",
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
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  // 本地后端开发环境配置
  server: {
    proxy: {
      "/open": {
        target: "http://localhost:12000",
        rewrite: (path) => {
          return path.replace(/^\/open/, "");
        },
        //这里改变的是服务器的源,服务器上的ctx.host是3000
        changeOrigin: true,
      },
      "/proxy": {
        target: "https://edb.cie-cn.com:8066",
        rewrite: (path) => {
          return path.replace(/^\/proxy/, "");
        },
        changeOrigin: true,
      },
      "/old": {
        target: "https://yus.cie-cn.com:7080",
        rewrite: (path) => {
          return path.replace(/^\/old/, "");
        },
        changeOrigin: true,
      },
      "/v1": {
        target: "https://api.dify.ai",
        rewrite: (path) => {
          return path.replace(/^\/v1/, "/v1");
        },
        changeOrigin: true,
      },
      "/napi": {
        target: "http://192.168.48.132:7777", // Flask 运行地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/napi/, ""), // 转发为 Flask 路由
      },
    },
  },
});
