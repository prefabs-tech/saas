import type { RouteComponent } from "vue-router";

interface RouteOverride {
  component?: RouteComponent;
  meta?: {
    authenticated?: boolean;
    layout?: RouteComponent;
  };
  name?: string;
  path?: string;
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
