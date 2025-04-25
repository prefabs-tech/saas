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
  accountForm?: RouteOverride;
}

export type { RouteOverride, RouteOverrides };
