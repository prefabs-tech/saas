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
    customers?: RouteOverride;
    customersAdd?: RouteOverride;
    customersEdit?: RouteOverride;
    customersView?: RouteOverride;
  };
}

export type { RouteOverride, AdminRoutesProperties };
