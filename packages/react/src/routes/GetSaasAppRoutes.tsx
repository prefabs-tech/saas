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

type GetSaasAppRoutesProperties = {
  options?: AppRoutesProperties;
  type?: "authenticated" | "public" | "unauthenticated";
};

export const GetSaasAppRoutes = ({
  options,
  type = "authenticated",
}: GetSaasAppRoutesProperties) => {
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
      disabled: accountSettings?.disabled,
      element: accountSettings?.element || <AccountSettingsPage />,
      // path: accountSettings?.path || DEFAULT_PATHS.ACCOUNT_SETTINGS,
      path: DEFAULT_PATHS.ACCOUNT_SETTINGS,
    },
    {
      disabled: invitationJoin?.disabled || !isMainApp,
      element: invitationJoin?.element || <JoinInvitationPage />,
      // path: invitationJoin?.path || DEFAULT_PATHS.INVITATION_JOIN,
      path: DEFAULT_PATHS.INVITATION_JOIN,
    },
    {
      disabled: myAccounts?.disabled,
      element: myAccounts?.element || <MyAccountsPage />,
      // path: myAccounts?.path || DEFAULT_PATHS.MY_ACCOUNTS,
      path: DEFAULT_PATHS.MY_ACCOUNTS,
    },
  ];

  if (type === "unauthenticated") {
    routes = [
      {
        disabled: invitationSignup?.disabled,
        element: invitationSignup?.element || <SignupInvitationPage />,
        // path: invitationSignup?.path || DEFAULT_PATHS.INVITATION_SIGNUP,
        path: DEFAULT_PATHS.INVITATION_SIGNUP,
      },
      {
        disabled: signup?.disabled,
        element: signup?.element || <SignupPage />,
        // path: signup?.path || DEFAULT_PATHS.SIGNUP,
        path: DEFAULT_PATHS.SIGNUP,
      },
    ];
  }

  if (type === "public") {
    routes = [
      {
        disabled: invitationAccept?.disabled,
        element: invitationAccept?.element || <AcceptInvitationPage />,
        // path: invitationAccept?.path || DEFAULT_PATHS.INVITATION_ACCEPT,
        path: DEFAULT_PATHS.INVITATION_ACCEPT,
      },
    ];
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

export const getSaasAppRoutes = (
  type: "authenticated" | "public" | "unauthenticated" = "authenticated",
  options?: AppRoutesProperties,
) => <GetSaasAppRoutes options={options} type={type} />;
