import { Route } from "react-router-dom";

import { DEFAULT_PATHS } from "@/constants";
import { AppProtectedRoutesProperties } from "@/types/routes";
import { MyAccountsPage } from "@/views";

export const getSaasAppProtectedRoutes = (
  options?: AppProtectedRoutesProperties,
) => {
  const { myAccounts } = options?.routes || {};

  // TODO save path overwrites in config so that other components can use it.

  const protectedRoutes = [
    {
      path: myAccounts?.path || DEFAULT_PATHS.MY_ACCOUNTS,
      element: myAccounts?.element || <MyAccountsPage />,
      disabled: myAccounts?.disabled,
    },
  ];

  return (
    <>
      {protectedRoutes.map((route) =>
        !route.disabled ? (
          <Route key={route.path} path={route.path} element={route.element} />
        ) : null,
      )}
    </>
  );
};
