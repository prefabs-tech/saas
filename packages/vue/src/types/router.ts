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
    customers?: RouteOverride;
    customersAdd?: RouteOverride;
    customersEdit?: RouteOverride;
    customersView?: RouteOverride;
  };
}

export type { RouteOverride, AdminRoutesProperties };
