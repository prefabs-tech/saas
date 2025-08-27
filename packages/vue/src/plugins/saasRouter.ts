import { useSaasRoutes } from "../composables/useSaasRoutes";

import type {
  AppType,
  AuthState,
  SaasRouteConfig,
} from "../composables/useSaasRoutes";
import type { App, Plugin } from "vue";
import type { Router } from "vue-router";

export interface SaasRouterOptions {
  router: Router;
  appType: AppType;
  getAuthState: () => AuthState | AuthState[];
  enabledRoutes?: string[];
  disabledRoutes?: string[];
  routeOverrides?: Record<string, any>;
  watchAuth?: boolean; // Whether to watch auth state changes and update routes dynamically
}

export const createSaasRouter = (options: SaasRouterOptions): Plugin => {
  return {
    install(app: App) {
      const {
        router,
        appType,
        getAuthState,
        enabledRoutes,
        disabledRoutes,
        routeOverrides,
        watchAuth = true,
      } = options;

      let currentRoutesInstance: ReturnType<typeof useSaasRoutes> | null = null;

      const updateRoutes = () => {
        const authStates = Array.isArray(getAuthState())
          ? (getAuthState() as AuthState[])
          : [getAuthState() as AuthState];

        // Remove old routes if they exist
        if (currentRoutesInstance) {
          currentRoutesInstance.removeRoutesFromRouter(router);
        }

        // Create new routes configuration
        const config: SaasRouteConfig = {
          appType,
          authStates,
          enabledRoutes,
          disabledRoutes,
          routeOverrides,
        };

        currentRoutesInstance = useSaasRoutes(config);
        currentRoutesInstance.addRoutesToRouter(router);
      };

      // Initial route setup
      updateRoutes();

      // Watch for auth state changes if enabled
      if (watchAuth) {
        // This would typically watch a reactive auth state from your auth store
        // For now, we'll provide a manual refresh method
        app.config.globalProperties.$refreshSaasRoutes = updateRoutes;
      }

      // Provide the current routes instance for advanced usage
      app.provide("saasRoutes", currentRoutesInstance);
    },
  };
};

// Convenience functions for common configurations
export const createAdminSaasRouter = (
  router: Router,
  getAuthState: () => AuthState | AuthState[],
  options?: Partial<SaasRouterOptions>
) => {
  return createSaasRouter({
    router,
    appType: "admin",
    getAuthState,
    ...options,
  });
};

export const createAppSaasRouter = (
  router: Router,
  getAuthState: () => AuthState | AuthState[],
  options?: Partial<SaasRouterOptions>
) => {
  return createSaasRouter({
    router,
    appType: "user",
    getAuthState,
    ...options,
  });
};
