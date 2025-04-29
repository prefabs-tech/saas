import type { RouteComponent } from "vue-router";

interface RouteOverrides {
  accounts?: RouteOverride;
  accountsAdd?: RouteOverride;
  accountsEdit?: RouteOverride;
  accountsView?: RouteOverride;
}

interface RouteOverride {
  component?: RouteComponent;
  name?: string;
  path?: string;
  disabled?: boolean;
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

export type { RouteOverride, RouteOverrides, AdminRoutesProperties };
