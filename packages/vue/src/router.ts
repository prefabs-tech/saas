import { Router } from "vue-router";
import { DEFAULT_PATHS } from "./constant";
import type { RouteMeta, RouteRecordRaw } from "vue-router";
import type { AdminRoutesProperties, RouteOptions } from "./types/router";

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

const getRoute = (
  defaultRoute: RouteRecordRaw,
  override?: RouteOptions
): RouteRecordRaw => {
  return {
    ...defaultRoute,
    ...override,
    meta: {
      ...defaultRoute.meta,
      ...override?.meta,
    },
  } as RouteRecordRaw;
};

const addRoutes = (router: Router, options?: AdminRoutesProperties) => {
  const routes = options?.routes;

  if (routes?.accounts && !routes.accounts.disabled) {
    router.addRoute(getRoute(_routes.accounts, routes.accounts));
  }
  if (routes?.accountsAdd && !routes.accountsAdd.disabled) {
    router.addRoute(getRoute(_routes.accountsAdd, routes.accountsAdd));
  }
  if (routes?.accountsEdit && !routes.accountsEdit.disabled) {
    router.addRoute(getRoute(_routes.accountsEdit, routes.accountsEdit));
  }
  if (routes?.accountsView && !routes.accountsView.disabled) {
    router.addRoute(getRoute(_routes.accountsView, routes.accountsView));
  }
};

const updateRouter = (router: Router, options?: AdminRoutesProperties) => {
  addRoutes(router, options);
};

export default updateRouter;
