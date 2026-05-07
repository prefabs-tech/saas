import type { RouteComponent } from "vue-router";

export type AdminRouteOverwrites = {
  accounts?: RouteOverwrite;
  accountsAdd?: RouteOverwrite;
  accountsEdit?: RouteOverwrite;
  accountsView?: RouteOverwrite;
};

export type AdminRoutesProperties = {
  routes?: AdminRouteOverwrites;
};

export type AppRouteOverwrites = {
  accountSettings?: RouteOverwrite;
  invitationAccept?: RouteOverwrite;
  invitationJoin?: RouteOverwrite;
  invitationSignup?: RouteOverwrite;
  myAccounts?: RouteOverwrite;
  signup?: RouteOverwrite;
};

export type AppRoutesProperties = {
  routes?: AppRouteOverwrites;
};

export type RouteOverwrite = {
  component?: RouteComponent;
  disabled?: boolean;
  meta?: Record<string, unknown>;
  path?: string;
};
