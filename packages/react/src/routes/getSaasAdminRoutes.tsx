import { Route } from "react-router-dom";

import { DEFAULT_PATHS } from "@/constants";
import { AdminRoutesProperties } from "@/types/routes";
import {
  AccountAddPage,
  AccountEditPage,
  AccountViewPage,
} from "@/views/Account";

export const getSaasAdminRoutes = (
  type: "authenticated" | "unauthenticated" | "public" = "authenticated",
  options?: AdminRoutesProperties,
) => {
  const { accountsAdd, accountsEdit, accountsView } = options?.routes || {};

  // TODO save path overwrites in config so that other components can use it.

  let routes = [
    {
      path: accountsAdd?.path || DEFAULT_PATHS.ACCOUNTS_ADD,
      element: accountsAdd?.element || <AccountAddPage />,
      disabled: accountsAdd?.disabled,
    },
    {
      path: accountsEdit?.path || DEFAULT_PATHS.ACCOUNTS_EDIT,
      element: accountsEdit?.element || <AccountEditPage />,
      disabled: accountsEdit?.disabled,
    },
    {
      path: accountsView?.path || DEFAULT_PATHS.ACCOUNTS_VIEW,
      element: accountsView?.element || <AccountViewPage />,
      disabled: accountsView?.disabled,
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
          <Route key={route.path} path={route.path} element={route.element} />
        ) : null,
      )}
    </>
  );
};
