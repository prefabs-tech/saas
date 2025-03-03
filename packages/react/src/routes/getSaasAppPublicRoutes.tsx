import { Route } from "react-router-dom";

import { DEFAULT_PATHS } from "@/constants";
import { AppPublicRoutesProperties } from "@/types/routes";
import { AcceptInvitationPage, SignupPage } from "@/views";

export const getSaasAppPublicRoutes = (options?: AppPublicRoutesProperties) => {
  const { acceptInvitation, signup } = options?.routes || {};

  // TODO save path overwrites in config so that other components can use it.

  const routes = [
    {
      path: acceptInvitation?.path || DEFAULT_PATHS.ACCEPT_INVITATION,
      element: acceptInvitation?.element || <AcceptInvitationPage />,
      disabled: acceptInvitation?.disabled,
    },
    {
      path: signup?.path || DEFAULT_PATHS.ACCEPT_INVITATION,
      element: signup?.element || <SignupPage />,
      disabled: signup?.disabled,
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
