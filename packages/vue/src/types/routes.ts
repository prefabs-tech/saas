import type { RouteComponent } from "vue-router";

export type RouteOverwrite = {
  disabled?: boolean;
  component?: RouteComponent;
  path?: string;
  meta?: Record<string, any>;
};

export type AdminRouteOverwrites = {
  accounts?: RouteOverwrite;
  accountsAdd?: RouteOverwrite;
  accountsEdit?: RouteOverwrite;
  accountsView?: RouteOverwrite;
};

export type AppRouteOverwrites = {
  accountSettings?: RouteOverwrite;
  invitationAccept?: RouteOverwrite;
  invitationJoin?: RouteOverwrite;
  invitationSignup?: RouteOverwrite;
  myAccounts?: RouteOverwrite;
  signup?: RouteOverwrite;
};

export type AdminRoutesProperties = {
  routes?: AdminRouteOverwrites;
};

export type AppRoutesProperties = {
  routes?: AppRouteOverwrites;
};
