import { Route } from "react-router-dom";

import { DEFAULT_PATHS } from "@/constants";
import { AppRoutesProperties } from "@/types/routes";
import { AccountViewPage, MyAccountsPage } from "@/views";

export const getSaasAppRoutes = (options?: AppRoutesProperties) => {
  const { myAccount, myAccounts } = options?.routes || {};

  // TODO save path overwrites in config so that other components can use it.

  const routes = [
    {
      path: myAccounts?.path || DEFAULT_PATHS.MY_ACCOUNTS,
      element: myAccounts?.element || <MyAccountsPage />,
      disabled: myAccounts?.disabled,
    },
    {
      path: myAccount?.path || DEFAULT_PATHS.MY_ACCOUNT,
      element: myAccount?.element || <AccountViewPage />,
      disabled: myAccount?.disabled,
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
