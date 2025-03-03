import { Route } from "react-router-dom";

import { DEFAULT_PATHS } from "@/constants";
import { AppRoutesProperties } from "@/types/routes";
import { MyAccountsPage } from "@/views";

export const getSaasAppRoutes = (options?: AppRoutesProperties) => {
  const { myAccounts } = options?.routes || {};

  // TODO save path overwrites in config so that other components can use it.

  const routes = [
    {
      path: myAccounts?.path || DEFAULT_PATHS.MY_ACCOUNTS,
      element: myAccounts?.element || <MyAccountsPage />,
      disabled: myAccounts?.disabled,
    },
  ];

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
