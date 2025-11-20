import * as VueRouter from "vue-router";

/**
 * 移动端路由配置
 * 定义移动端页面的路由规则，作为 /mobile 路径的子路由
 */
const mobileRoutes: any[] = [
  {
    path: "home",
    component: () => import("@/views/mobile-pages/HomePage.vue"),
  },
];

/**
 * 应用路由配置
 * 定义所有页面的路由规则，包括桌面端和移动端页面
 */
const routes: any[] = [
  // 桌面端首页路由
  { path: "/home", component: () => import("@/views/pages/HomePage.vue") },
  
  // 移动端路由配置，包含子路由
  {
    path: "/mobile",
    component: () => import("@/views/mobile-pages/HomePage.vue"),
    children: mobileRoutes,
  },
  
  // 404 页面路由，捕获所有未匹配的路径
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/pages/NotFoundPage.vue"),
    meta: {
      title: "404 - 页面未找到"
    }
  }
];

/**
 * 创建路由实例
 * 使用 Hash 模式路由，基础路径为 "/void-frontend"
 */
const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory("/void-frontend"),
  routes,
});

/**
 * 全局前置导航守卫
 * 在每次路由跳转前执行，用于设置页面标题
 */
router.beforeEach((to, _, next) => {
  // 如果路由元信息中包含标题，则设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  next();
});

export default router;
