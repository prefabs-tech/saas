import { Route } from "react-router-dom";

import { DEFAULT_PATHS } from "@/constants";
import { AdminRoutesProperties } from "@/types/routes";
import {
  AccountAddPage,
  AccountEditPage,
  AccountViewPage,
} from "@/views/Account";

export const getSaasAdminRoutes = (
  type: "authenticated" | "public" | "unauthenticated" = "authenticated",
  options?: AdminRoutesProperties,
) => {
  const { accountsAdd, accountsEdit, accountsView } = options?.routes || {};

  // TODO save path overwrites in config so that other components can use it.
  // Then uncomment commented paths below

  let routes = [
    {
      disabled: accountsAdd?.disabled,
      element: accountsAdd?.element || <AccountAddPage />,
      // path: accountsAdd?.path || DEFAULT_PATHS.ACCOUNTS_ADD,
      path: DEFAULT_PATHS.ACCOUNTS_ADD,
    },
    {
      disabled: accountsEdit?.disabled,
      element: accountsEdit?.element || <AccountEditPage />,
      // path: accountsEdit?.path || DEFAULT_PATHS.ACCOUNTS_EDIT,
      path: DEFAULT_PATHS.ACCOUNTS_EDIT,
    },
    {
      disabled: accountsView?.disabled,
      element: accountsView?.element || <AccountViewPage />,
      // path: accountsView?.path || DEFAULT_PATHS.ACCOUNTS_VIEW,
      path: DEFAULT_PATHS.ACCOUNTS_VIEW,
    },
  ];

  if (type === "unauthenticated") {
    routes = [];
  }

  if (type === "public") {
    routes = [];
  }

  return (
    <>
      {routes.map((route) =>
        !route.disabled ? (
          <Route element={route.element} key={route.path} path={route.path} />
        ) : null,
      )}
    </>
  );
};
