import { Route } from "react-router-dom";

import { DEFAULT_PATHS } from "@/constants";
import { useAccounts } from "@/hooks";
import { AppRoutesProperties } from "@/types/routes";
import {
  AcceptInvitationPage,
  AccountSettingsPage,
  JoinInvitationPage,
  MyAccountsPage,
  SignupInvitationPage,
  SignupPage,
} from "@/views";

export const getSaasAppRoutes = (
  type: "authenticated" | "unauthenticated" | "public" = "authenticated",
  options?: AppRoutesProperties,
) => {
  const {
    accountSettings,
    invitationAccept,
    invitationJoin,
    invitationSignup,
    myAccounts,
    signup,
  } = options?.routes || {};

  const {
    meta: { isMainApp },
  } = useAccounts();

  // TODO save path overwrites in config so that other components can use it. \
  // Then uncomment commented paths below

  let routes = [
    {
      // path: accountSettings?.path || DEFAULT_PATHS.ACCOUNT_SETTINGS,
      path: DEFAULT_PATHS.ACCOUNT_SETTINGS,
      element: accountSettings?.element || <AccountSettingsPage />,
      disabled: accountSettings?.disabled,
    },
    {
      // path: invitationJoin?.path || DEFAULT_PATHS.INVITATION_JOIN,
      path: DEFAULT_PATHS.INVITATION_JOIN,
      element: invitationJoin?.element || <JoinInvitationPage />,
      disabled: invitationJoin?.disabled || !isMainApp,
    },
    {
      // path: myAccounts?.path || DEFAULT_PATHS.MY_ACCOUNTS,
      path: DEFAULT_PATHS.MY_ACCOUNTS,
      element: myAccounts?.element || <MyAccountsPage />,
      disabled: myAccounts?.disabled,
    },
  ];

  if (type === "unauthenticated") {
    routes = [
      {
        // path: invitationSignup?.path || DEFAULT_PATHS.INVITATION_SIGNUP,
        path: DEFAULT_PATHS.INVITATION_SIGNUP,
        element: invitationSignup?.element || <SignupInvitationPage />,
        disabled: invitationSignup?.disabled,
      },
      {
        // path: signup?.path || DEFAULT_PATHS.SIGNUP,
        path: DEFAULT_PATHS.SIGNUP,
        element: signup?.element || <SignupPage />,
        disabled: signup?.disabled,
      },
    ];
  }

  if (type === "public") {
    routes = [
      {
        // path: invitationAccept?.path || DEFAULT_PATHS.INVITATION_ACCEPT,
        path: DEFAULT_PATHS.INVITATION_ACCEPT,
        element: invitationAccept?.element || <AcceptInvitationPage />,
        disabled: invitationAccept?.disabled,
      },
    ];
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
