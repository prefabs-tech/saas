import React from "react";

export type RouteOverwrite = {
  disabled?: boolean;
  element?: React.ReactNode;
  path?: string;
};

export type AdminProtectedRouteOverwrites = {
  accountsAdd?: RouteOverwrite;
  accountsEdit?: RouteOverwrite;
  accountsView?: RouteOverwrite;
  // accounts?: RouteOverwrite; // TODO
};

export type AppProtectedRouteOverwrites = {
  // joinAccount?: RouteOverwrite; // TODO
  // myAccount?: RouteOverwrite; // TODO
  myAccounts?: RouteOverwrite;
};
export type AppPublicRouteOverwrites = {
  acceptInvitation?: RouteOverwrite;
  signup?: RouteOverwrite;
};

export type AdminProtectedRoutesProperties = {
  routes?: AdminProtectedRouteOverwrites;
};

export type AppProtectedRoutesProperties = {
  routes?: AppProtectedRouteOverwrites;
};
export type AppPublicRoutesProperties = {
  routes?: AppPublicRouteOverwrites;
};
