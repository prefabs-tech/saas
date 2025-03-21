import { useTranslation } from "@dzangolab/react-i18n";
import { AuthPage } from "@dzangolab/react-ui";
import { useEffect } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { UseMutationRequestObject } from "@/api";
import { UserSignupForm } from "@/components/signup";
import { DEFAULT_PATHS } from "@/constants";
import { useAcceptInvitationMutation, useGetInvitationQuery } from "@/hooks";
import { AcceptInvitationResponse, UserSignupData } from "@/types";

export type AcceptInvitationProperties = {
  centered?: boolean;
  onAcceptInvitationSuccess?: (
    response?: AcceptInvitationResponse,
    request?: UseMutationRequestObject<UserSignupData | undefined>,
  ) => void;
};

export const AcceptInvitationPage = ({
  centered = true,
  onAcceptInvitationSuccess,
}: AcceptInvitationProperties) => {
  const { t } = useTranslation("invitations");

  const { token } = useParams();
  const [searchParameters] = useSearchParams();
  const accountId = searchParameters.get("accountId");

  const {
    data: invitation,
    loading: invitationLoading,
    error,
    trigger,
  } = useGetInvitationQuery(token!, accountId, {
    lazy: true,
  });

  const { loading: acceptLoading, trigger: triggerAcceptInvitation } =
    useAcceptInvitationMutation({
      onSuccess: (response, request) =>
        onAcceptInvitationSuccess &&
        onAcceptInvitationSuccess(response, request),
      onError: () => {
        toast.error(t("invitations.messages.errorAcceptingInvitation"));
      },
    });

  useEffect(() => {
    if (token) {
      trigger();
    }
  }, []);

  const handleSubmit = (credential: UserSignupData) => {
    if (!token) {
      return;
    }

    triggerAcceptInvitation(token, credential, accountId);
  };

  const renderPageContent = () => {
    if (error || !invitation) {
      return <p>{t(`invitations.messages.errorFetchingInvitation`)}</p>;
    }

    if (
      invitation?.acceptedAt ||
      invitation?.revokedAt ||
      invitation?.expiresAt < Date.now()
    ) {
      return <p>{t(`invitations.messages.invalidInvitation`)}</p>;
    }

    return (
      <UserSignupForm
        key={invitation.id}
        email={invitation.email || ""}
        handleSubmit={handleSubmit}
        loading={acceptLoading}
      />
    );
  };

  if (invitation && invitation.userId) {
    // FIXME use join account path from config
    return <Navigate to={DEFAULT_PATHS.JOIN_ACCOUNT} replace={true} />;
  }

  return (
    <AuthPage
      className="signup"
      title={t("user:signup.title")}
      loading={invitationLoading}
      centered={centered}
    >
      {renderPageContent()}
    </AuthPage>
  );
};
