import { Router } from "vue-router";

import { DEFAULT_PATHS } from "./constant";
import { addSaasAdminRoutes, addSaasAppRoutes } from "./routes";
import AcceptInvitation from "./views/AcceptInvitation/AcceptInvitation.vue";
import JoinInvitation from "./views/AcceptInvitation/JoinInvitation.vue";
import SignupInvitation from "./views/AcceptInvitation/SignupInvitation.vue";
import AccountAdd from "./views/Accounts/Add.vue";
import AccountEdit from "./views/Accounts/Edit.vue";
import Accounts from "./views/Accounts/Index.vue";
import AccountView from "./views/Accounts/View.vue";

import type {
  AdminRoutesProperties,
  AppRoutesProperties,
} from "./types/routes";
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

  // Invitation routes
  InvitationAccept: {
    meta: {
      authenticated: false,
    } as RouteMeta,
    component: AcceptInvitation,
    name: "invitationAccept",
    path: DEFAULT_PATHS.INVITATION_ACCEPT,
  } as RouteRecordRaw,

  InvitationJoin: {
    meta: {
      authenticated: true,
    } as RouteMeta,
    component: JoinInvitation,
    name: "invitationJoin",
    path: DEFAULT_PATHS.INVITATION_JOIN,
  } as RouteRecordRaw,

  InvitationSignup: {
    meta: {
      authenticated: false,
    } as RouteMeta,
    component: SignupInvitation,
    name: "invitationSignup",
    path: DEFAULT_PATHS.INVITATION_SIGNUP,
  } as RouteRecordRaw,
};

const addRoutes = (router: Router) => {
  router.addRoute(_routes.Accounts);
  router.addRoute(_routes.AccountsAdd);
  router.addRoute(_routes.AccountsEdit);
  router.addRoute(_routes.AccountsView);
  router.addRoute(_routes.InvitationAccept);
  router.addRoute(_routes.InvitationJoin);
  router.addRoute(_routes.InvitationSignup);
};

// New separate route functions for admin and app (recommended approach)
export const updateAdminRouter = (
  router: Router,
  type: "authenticated" | "unauthenticated" | "public" = "authenticated",
  options?: AdminRoutesProperties
) => {
  addSaasAdminRoutes(router, type, options);
};

export const updateAppRouter = (
  router: Router,
  type: "authenticated" | "unauthenticated" | "public" = "authenticated",
  options?: AppRoutesProperties
) => {
  addSaasAppRoutes(router, type, options);
};

// Legacy function for backward compatibility (deprecated)
const updateRouter = (router: Router) => {
  addRoutes(router);
};

export default updateRouter;
