import { Route } from "react-router-dom";

import { DEFAULT_PATHS } from "@/constants";
import { useAccounts } from "@/hooks";
import { AppRoutesProperties } from "@/types/routes";
import { AccountSettingsPage, JoinAccountPage, MyAccountsPage } from "@/views";

export const getSaasAppRoutes = (options?: AppRoutesProperties) => {
  const { accountSettings, joinAccount, myAccounts } = options?.routes || {};

  const {
    meta: { isMainApp },
  } = useAccounts();

  // TODO save path overwrites in config so that other components can use it.

  const routes = [
    {
      path: accountSettings?.path || DEFAULT_PATHS.ACCOUNT_SETTINGS,
      element: accountSettings?.element || <AccountSettingsPage />,
      disabled: accountSettings?.disabled,
    },{
      path: joinAccount?.path || DEFAULT_PATHS.JOIN_ACCOUNT,
      element: joinAccount?.element || <JoinAccountPage />,
      disabled: joinAccount?.disabled || !isMainApp,
    },
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
