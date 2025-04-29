import type { RouteComponent } from "vue-router";

interface RouteOverride {
  component?: RouteComponent;
  meta?: {
    layout?: RouteComponent;
  };
  path?: string;
}

interface RouteOverrides {
  accounts?: RouteOverride;
  accountsAdd?: RouteOverride;
  accountsEdit?: RouteOverride;
  accountsView?: RouteOverride;
}

export interface RouteOptions {
  component?: RouteComponent;
  name?: string;
  path?: string;
  disabled?: boolean;
  meta?: {
    layout?: RouteComponent;
    authenticated?: boolean;
  };
}

export interface AdminRoutesProperties {
  routes?: {
    accounts?: RouteOptions;
    accountsAdd?: RouteOptions;
    accountsEdit?: RouteOptions;
    accountsView?: RouteOptions;
  };
}

export type { RouteOverride, RouteOverrides };
