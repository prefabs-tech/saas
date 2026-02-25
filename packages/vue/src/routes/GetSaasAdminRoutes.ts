import { DEFAULT_PATHS } from "../constant";
import AccountAdd from "../views/Accounts/Add.vue";
import AccountEdit from "../views/Accounts/Edit.vue";
import Accounts from "../views/Accounts/Index.vue";
import AccountView from "../views/Accounts/View.vue";

import type { AdminRoutesProperties, RouteOverwrite } from "../types/routes";
import type { Router, RouteRecordRaw } from "vue-router";

const _adminRoutes = {
  accounts: {
    meta: {
      authenticated: true,
    },
    component: Accounts,
    name: "accounts",
    path: DEFAULT_PATHS.ACCOUNTS,
  } as RouteRecordRaw,

  accountsAdd: {
    meta: {
      authenticated: true,
    },
    component: AccountAdd,
    name: "accountsAdd",
    path: DEFAULT_PATHS.ACCOUNTS_ADD,
  } as RouteRecordRaw,

  accountsEdit: {
    meta: {
      authenticated: true,
    },
    component: AccountEdit,
    name: "accountsEdit",
    path: DEFAULT_PATHS.ACCOUNTS_EDIT,
  } as RouteRecordRaw,

  accountsView: {
    meta: {
      authenticated: true,
    },
    component: AccountView,
    name: "accountsView",
    path: DEFAULT_PATHS.ACCOUNTS_VIEW,
  } as RouteRecordRaw,
};

const getRoute = (
  defaultRoute: RouteRecordRaw,
  override?: RouteOverwrite,
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

export const getSaasAdminRoutes = (
  type: "authenticated" | "unauthenticated" | "public" = "authenticated",
  options?: AdminRoutesProperties,
): RouteRecordRaw[] => {
  const { accounts, accountsAdd, accountsEdit, accountsView } =
    options?.routes || {};

  let routes: (RouteRecordRaw & { disabled?: boolean })[] = [
    getRoute(_adminRoutes.accounts, accounts),
    getRoute(_adminRoutes.accountsAdd, accountsAdd),
    getRoute(_adminRoutes.accountsEdit, accountsEdit),
    getRoute(_adminRoutes.accountsView, accountsView),
  ];

  if (type === "unauthenticated") {
    routes = [];
  }

  if (type === "public") {
    routes = [];
  }

  return routes.filter((route) => !route.disabled);
};

export const addSaasAdminRoutes = (
  router: Router,
  type: "authenticated" | "unauthenticated" | "public" = "authenticated",
  options?: AdminRoutesProperties,
): void => {
  const routes = getSaasAdminRoutes(type, options);
  for (const route of routes) {
    router.addRoute(route);
  }
};
