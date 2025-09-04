import React from "react";

export type RouteOverwrite = {
  disabled?: boolean;
  element?: React.ReactNode;
  // path?: string; // TODO allow to overwrite path
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
