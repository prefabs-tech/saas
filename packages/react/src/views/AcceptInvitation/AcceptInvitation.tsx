import { LoadingPage } from "@prefabs.tech/react-ui";
import { useEffect } from "react";
import { Navigate, useParams, useSearchParams } from "react-router-dom";

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
  }, [token, trigger]);

  if (invitationLoading || !invitation) {
    return <LoadingPage />;
  }

  if (invitation) {
    return invitation.userId ? (
      <Navigate
        replace={true}
        to={`${DEFAULT_PATHS.INVITATION_JOIN.replace(":token", token!)}?accountId=${accountId}`}
      />
    ) : (
      <Navigate
        replace={true}
        to={`${DEFAULT_PATHS.INVITATION_SIGNUP.replace(":token", token!)}?accountId=${accountId}`}
      />
    );
  }
};
