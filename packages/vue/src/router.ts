import { Router } from "vue-router";
import Accounts from "./views/Accounts/Index.vue";

import type { RouteMeta, RouteRecordRaw } from "vue-router";

export const routes = {
  accounts: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: Accounts,
    name: "accounts",
    path: "/accounts",
  } as RouteRecordRaw,
};

export const addRoutes = (router: Router) => {
  router.addRoute(routes.accounts);
};

export const updateRouter = (router: Router) => {
  addRoutes(router);
};

export default {
  routes,
  addRoutes,
  updateRouter,
};
