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
  // joinAccount?: RouteOverwrite; // TODO
  accountSettings?: RouteOverwrite;
  myAccounts?: RouteOverwrite;
};
export type AppPublicRouteOverwrites = {
  acceptInvitation?: RouteOverwrite;
  signup?: RouteOverwrite;
};

export type AdminRoutesProperties = {
  routes?: AdminRouteOverwrites;
};

export type AppRoutesProperties = {
  routes?: AppRouteOverwrites;
};
export type AppPublicRoutesProperties = {
  routes?: AppPublicRouteOverwrites;
};
