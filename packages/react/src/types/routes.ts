import React from "react";

export type RouteOverwrite = {
  disabled?: boolean;
  element?: React.ReactNode;
  path?: string;
};

export type AdminRouteOverwrites = {
  accountsAdd?: RouteOverwrite;
  accountsEdit?: RouteOverwrite;
  accountsView?: RouteOverwrite;
  // accounts?: RouteOverwrite; // TODO
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

export interface AdminRoutesConfig {
  accountsAdd: Pick<RouteOverwrite, "disabled" | "path">;
  accountsEdit: Pick<RouteOverwrite, "disabled" | "path">;
  accountsView: Pick<RouteOverwrite, "disabled" | "path">;
}

export interface AppRoutesConfig {
  accountSettings: Pick<RouteOverwrite, "disabled" | "path">;
  invitationAccept: Pick<RouteOverwrite, "disabled" | "path">;
  invitationJoin: Pick<RouteOverwrite, "disabled" | "path">;
  invitationSignup: Pick<RouteOverwrite, "disabled" | "path">;
  myAccounts: Pick<RouteOverwrite, "disabled" | "path">;
  signup: Pick<RouteOverwrite, "disabled" | "path">;
}

export type RoutesConfig = AdminRoutesConfig | AppRoutesConfig;
