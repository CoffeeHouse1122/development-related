import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import { useAppStore } from "@/stores/appStore";
import { isSupportedLocale, setLocale } from "@/locales";
import { trackPageView } from "@/tracker";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const appStore = useAppStore();
  appStore.setQueryParams({ ...to.query });

  const lang = typeof to.query.lang === "string" ? to.query.lang : "";
  if (lang && isSupportedLocale(lang)) {
    appStore.setLocale(lang);
    setLocale(lang);
  }

  next();
});

router.afterEach((to) => {
  trackPageView(to.fullPath);
});

export default router;
