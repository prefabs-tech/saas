import type { RouteComponent } from "vue-router";

interface RouteOverride {
  component?: RouteComponent;
  name?: string;
  path?: string;
  meta?: {
    layout?: RouteComponent;
    authenticated?: boolean;
  };
}

interface AdminRoutesProperties {
  routes?: {
    accounts?: RouteOverride;
    accountsAdd?: RouteOverride;
    accountsEdit?: RouteOverride;
    accountsView?: RouteOverride;
  };
}

export type { RouteOverride, AdminRoutesProperties };
