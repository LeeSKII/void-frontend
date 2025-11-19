import * as VueRouter from "vue-router";

const mobileRoutes: any[] = [
  {
    path: "home",
    component: () => import("@/views/mobile-pages/HomePage.vue"),
  },
];

const routes: any[] = [
  { path: "/home", component: () => import("@/views/pages/HomePage.vue") },
  {
    path: "/mobile",
    component: () => import("@/views/mobile-pages/HomePage.vue"),
    children: mobileRoutes,
  },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory("/void-frontend"),
  routes,
});

router.beforeEach((to, _, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  next();
});

export default router;
