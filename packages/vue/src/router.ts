import { Router } from "vue-router";
import { DEFAULT_PATHS } from "./constant";
import type { RouteMeta, RouteRecordRaw } from "vue-router";

// Import components
import Accounts from "./views/Accounts/Index.vue";
import AccountAdd from "./views/Accounts/Customerform.vue";
import AccountEdit from "./views/Accounts/Customerform.vue";
import AccountView from "./views/Accounts/View.vue";

const _routes = {
  accounts: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: Accounts,
    name: "accounts",
    path: DEFAULT_PATHS.ACCOUNTS,
  } as RouteRecordRaw,

  accountsAdd: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: AccountAdd,
    name: "accountsAdd",
    path: DEFAULT_PATHS.ACCOUNTS_ADD,
  } as RouteRecordRaw,

  accountsEdit: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: AccountEdit,
    name: "accountsEdit",
    path: DEFAULT_PATHS.ACCOUNTS_EDIT,
  } as RouteRecordRaw,

  accountsView: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: AccountView,
    name: "accountsView",
    path: DEFAULT_PATHS.ACCOUNTS_VIEW,
  } as RouteRecordRaw,
};

const addRoutes = (router: Router) => {
  router.addRoute(_routes.accounts);
  router.addRoute(_routes.accountsAdd);
  router.addRoute(_routes.accountsEdit);
  router.addRoute(_routes.accountsView);
};

const updateRouter = (router: Router) => {
  addRoutes(router);
};

export default updateRouter;
