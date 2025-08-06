import { Router } from "vue-router";

import { DEFAULT_PATHS } from "./constant";

import AccountAdd from "./views/Accounts/Add.vue";
import AccountEdit from "./views/Accounts/Edit.vue";
import Accounts from "./views/Accounts/Index.vue";
import AccountView from "./views/Accounts/View.vue";

import type { RouteMeta, RouteRecordRaw } from "vue-router";

const _routes = {
  Accounts: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: Accounts,
    name: "accounts",
    path: DEFAULT_PATHS.ACCOUNTS,
  } as RouteRecordRaw,

  AccountsAdd: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: AccountAdd,
    name: "accountsAdd",
    path: DEFAULT_PATHS.ACCOUNTS_ADD,
  } as RouteRecordRaw,

  AccountsEdit: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: AccountEdit,
    name: "accountsEdit",
    path: DEFAULT_PATHS.ACCOUNTS_EDIT,
  } as RouteRecordRaw,

  AccountsView: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: AccountView,
    name: "accountsView",
    path: DEFAULT_PATHS.ACCOUNTS_VIEW,
  } as RouteRecordRaw,
};

const addRoutes = (router: Router) => {
  router.addRoute(_routes.Accounts);
  router.addRoute(_routes.AccountsAdd);
  router.addRoute(_routes.AccountsEdit);
  router.addRoute(_routes.AccountsView);
};

const updateRouter = (router: Router) => {
  addRoutes(router);
};

export default updateRouter;
