import { Router } from "vue-router";
import Accounts from "./views/Accounts/Index.vue";

import type { RouteMeta, RouteRecordRaw } from "vue-router";

const _routes = {
  accounts: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: Accounts,
    name: "accounts",
    path: "/accounts",
  } as RouteRecordRaw,
};

const addRoutes = (router: Router) => {
  router.addRoute(_routes.accounts);
};

const addAuthenticationGuard = (router: Router) => {
  router.beforeEach(async (to) => {
    const meta = to.meta as RouteMeta;

    if (meta.authenticated) {
      router.push({ name: "login" });
    }
  });
};

const updateRouter = (router: Router) => {
  addRoutes(router);
  addAuthenticationGuard(router);
};

export default updateRouter;
