import { LoadingPage } from "@dzangolab/react-ui";
import { useEffect } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";

import { DEFAULT_PATHS } from "@/constants";
import { useGetInvitationQuery } from "@/hooks";

export const AcceptInvitationPage = () => {
  const { token } = useParams();
  const [searchParameters] = useSearchParams();
  const accountId = searchParameters.get("accountId");

  const {
    data: invitation,
    loading: invitationLoading,
    trigger,
  } = useGetInvitationQuery(token!, accountId, {
    lazy: true,
  });

  useEffect(() => {
    if (token) {
      trigger();
    }
  }, []);

  if (invitationLoading || !invitation) {
    return <LoadingPage />;
  }

  if (invitation) {
    return invitation.userId ? (
      <Navigate
        to={`${DEFAULT_PATHS.INVITATION_JOIN.replace(":token", token!)}?accountId=${accountId}`}
        replace={true}
      />
    ) : (
      <Navigate
        to={`${DEFAULT_PATHS.INVITATION_SIGNUP.replace(":token", token!)}?accountId=${accountId}`}
        replace={true}
      />
    );
  }
};
