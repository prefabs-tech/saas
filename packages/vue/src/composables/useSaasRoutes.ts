import { computed } from "vue";

import { DEFAULT_PATHS } from "../constant";
import AcceptInvitation from "../views/AcceptInvitation/AcceptInvitation.vue";
import JoinInvitation from "../views/AcceptInvitation/JoinInvitation.vue";
import SignupInvitation from "../views/AcceptInvitation/SignupInvitation.vue";
import AccountAdd from "../views/Accounts/Add.vue";
import AccountEdit from "../views/Accounts/Edit.vue";
import Accounts from "../views/Accounts/Index.vue";
import AccountView from "../views/Accounts/View.vue";

import type { Router, RouteRecordRaw } from "vue-router";

export type AppType = "admin" | "user";
export type AuthState = "authenticated" | "unauthenticated" | "public";

export interface SaasRouteConfig {
  appType: AppType;
  authStates: AuthState[];
  enabledRoutes?: string[];
  disabledRoutes?: string[];
  routeOverrides?: Record<string, Partial<RouteRecordRaw>>;
}

const originalRoutes = {
  // Admin routes (only available in admin apps)
  accounts: {
    meta: { authenticated: true, appType: ["admin"] },
    component: Accounts,
    name: "accounts",
    path: DEFAULT_PATHS.ACCOUNTS,
  } as RouteRecordRaw & { meta: { appType: AppType[] } },

  accountsAdd: {
    meta: { authenticated: true, appType: ["admin"] },
    component: AccountAdd,
    name: "accountsAdd",
    path: DEFAULT_PATHS.ACCOUNTS_ADD,
  } as RouteRecordRaw & { meta: { appType: AppType[] } },

  accountsEdit: {
    meta: { authenticated: true, appType: ["admin"] },
    component: AccountEdit,
    name: "accountsEdit",
    path: DEFAULT_PATHS.ACCOUNTS_EDIT,
  } as RouteRecordRaw & { meta: { appType: AppType[] } },

  accountsView: {
    meta: { authenticated: true, appType: ["admin"] },
    component: AccountView,
    name: "accountsView",
    path: DEFAULT_PATHS.ACCOUNTS_VIEW,
  } as RouteRecordRaw & { meta: { appType: AppType[] } },

  // User app routes (only available in user apps)
  accountSettings: {
    meta: { authenticated: true, appType: ["user"] },
    component: AccountView,
    name: "accountSettings",
    path: DEFAULT_PATHS.ACCOUNT_SETTINGS,
  } as RouteRecordRaw & { meta: { appType: AppType[] } },

  myAccounts: {
    meta: { authenticated: true, appType: ["user"] },
    component: Accounts,
    name: "myAccounts",
    path: DEFAULT_PATHS.MY_ACCOUNTS,
  } as RouteRecordRaw & { meta: { appType: AppType[] } },

  invitationJoin: {
    meta: { authenticated: true, appType: ["user"] },
    component: JoinInvitation,
    name: "invitationJoin",
    path: DEFAULT_PATHS.INVITATION_JOIN,
  } as RouteRecordRaw & { meta: { appType: AppType[] } },

  // Unauthenticated routes
  invitationSignup: {
    meta: { authenticated: false, appType: ["user"] },
    component: SignupInvitation,
    name: "invitationSignup",
    path: DEFAULT_PATHS.INVITATION_SIGNUP,
  } as RouteRecordRaw & { meta: { appType: AppType[] } },

  // Public routes (available to all)
  invitationAccept: {
    meta: { authenticated: false, appType: ["admin", "user"] },
    component: AcceptInvitation,
    name: "invitationAccept",
    path: DEFAULT_PATHS.INVITATION_ACCEPT,
  } as RouteRecordRaw & { meta: { appType: AppType[] } },
};

export const useSaasRoutes = (config: SaasRouteConfig) => {
  const { appType, authStates, enabledRoutes, disabledRoutes, routeOverrides } =
    config;

  const availableRoutes = computed(() => {
    return Object.entries(originalRoutes)
      .filter(([routeName, route]) => {
        // Filter by app type
        if (!route.meta.appType.includes(appType)) {
          return false;
        }

        // Filter by auth state
        const routeAuthState = route.meta.authenticated
          ? "authenticated"
          : route.meta.authenticated === false
            ? "unauthenticated"
            : "public";
        if (!authStates.includes(routeAuthState)) {
          return false;
        }

        // Filter by enabled/disabled routes
        if (enabledRoutes && !enabledRoutes.includes(routeName)) {
          return false;
        }

        if (disabledRoutes && disabledRoutes.includes(routeName)) {
          return false;
        }

        return true;
      })
      .map(([routeName, route]) => {
        // Apply overrides
        const override = routeOverrides?.[routeName];
        if (override) {
          return {
            ...route,
            ...override,
            meta: {
              ...route.meta,
              ...override.meta,
            },
          } as RouteRecordRaw;
        }
        return route as RouteRecordRaw;
      });
  });

  const addRoutesToRouter = (router: Router) => {
    availableRoutes.value.forEach((route) => {
      router.addRoute(route);
    });
  };

  const removeRoutesFromRouter = (router: Router) => {
    availableRoutes.value.forEach((route) => {
      if (route.name && router.hasRoute(route.name)) {
        router.removeRoute(route.name);
      }
    });
  };

  return {
    availableRoutes,
    addRoutesToRouter,
    removeRoutesFromRouter,
  };
};
