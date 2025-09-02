import { DEFAULT_PATHS } from "../constant";
import AcceptInvitation from "../views/AcceptInvitation/AcceptInvitation.vue";
import JoinInvitation from "../views/AcceptInvitation/JoinInvitation.vue";
import SignupInvitation from "../views/AcceptInvitation/SignupInvitation.vue";
import Accounts from "../views/Accounts/Index.vue";
import AccountSettings from "../views/AccountSettings/AccountSettings.vue";

import type { AppRoutesProperties, RouteOverwrite } from "../types/routes";
import type { Router, RouteRecordRaw } from "vue-router";

const _appRoutes = {
  // Account management routes (authenticated)
  accountSettings: {
    meta: {
      authenticated: true,
    },
    component: AccountSettings,
    name: "accountSettings",
    path: DEFAULT_PATHS.ACCOUNT_SETTINGS,
  } as RouteRecordRaw,

  myAccounts: {
    meta: {
      authenticated: true,
    },
    component: Accounts,
    name: "myAccounts",
    path: DEFAULT_PATHS.MY_ACCOUNTS,
  } as RouteRecordRaw,

  // Invitation routes (authenticated)
  invitationJoin: {
    meta: {
      authenticated: true,
    },
    component: JoinInvitation,
    name: "invitationJoin",
    path: DEFAULT_PATHS.INVITATION_JOIN,
  } as RouteRecordRaw,

  // Invitation routes (unauthenticated)
  invitationSignup: {
    meta: {
      authenticated: false,
    },
    component: SignupInvitation,
    name: "invitationSignup",
    path: DEFAULT_PATHS.INVITATION_SIGNUP,
  } as RouteRecordRaw,

  // Public routes
  invitationAccept: {
    meta: {
      authenticated: false,
    },
    component: AcceptInvitation,
    name: "invitationAccept",
    path: DEFAULT_PATHS.INVITATION_ACCEPT,
  } as RouteRecordRaw,
};

const getRoute = (
  defaultRoute: RouteRecordRaw,
  override?: RouteOverwrite
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

export const getSaasAppRoutes = (
  type: "authenticated" | "unauthenticated" | "public" = "authenticated",
  options?: AppRoutesProperties
): RouteRecordRaw[] => {
  const {
    accountSettings,
    invitationAccept,
    invitationJoin,
    invitationSignup,
    myAccounts,
  } = options?.routes || {};

  let routes: (RouteRecordRaw & { disabled?: boolean })[] = [];

  if (type === "authenticated") {
    routes = [
      getRoute(_appRoutes.accountSettings, accountSettings),
      getRoute(_appRoutes.invitationJoin, invitationJoin),
      getRoute(_appRoutes.myAccounts, myAccounts),
    ];
  }

  if (type === "unauthenticated") {
    routes = [getRoute(_appRoutes.invitationSignup, invitationSignup)];
  }

  if (type === "public") {
    routes = [getRoute(_appRoutes.invitationAccept, invitationAccept)];
  }

  return routes.filter((route) => !route.disabled);
};

export const addSaasAppRoutes = (
  router: Router,
  type: "authenticated" | "unauthenticated" | "public" = "authenticated",
  options?: AppRoutesProperties
): void => {
  const routes = getSaasAppRoutes(type, options);
  routes.forEach((route) => {
    router.addRoute(route);
  });
};
