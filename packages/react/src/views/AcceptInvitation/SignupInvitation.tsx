import { useTranslation } from "@dzangolab/react-i18n";
import { AuthPage } from "@dzangolab/react-ui";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { UseMutationRequestObject } from "@/api";
import { UserSignupForm } from "@/components/signup";
import { useAcceptInvitationMutation, useGetInvitationQuery } from "@/hooks";
import { AcceptInvitationResponse, UserSignupData } from "@/types";

export type SignupInvitationProperties = {
  centered?: boolean;
  onAcceptInvitationSuccess?: (
    response?: AcceptInvitationResponse,
    request?: UseMutationRequestObject<UserSignupData | undefined>,
  ) => void;
};

export const SignupInvitationPage = ({
  centered = true,
  onAcceptInvitationSuccess,
}: SignupInvitationProperties) => {
  const { t } = useTranslation("accounts");

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
      onSuccess: (response, request) => {
        onAcceptInvitationSuccess &&
          onAcceptInvitationSuccess(response, request);

        toast.success(t("signupInvitation.messages.success"));
      },
      onError: () => {
        toast.error(t("signupInvitation.messages.error"));
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
      return <p>{t(`signupInvitation.messages.errorFetching`)}</p>;
    }

    if (
      invitation?.acceptedAt ||
      invitation?.revokedAt ||
      invitation?.expiresAt < Date.now()
    ) {
      return <p>{t(`signupInvitation.messages.invalid`)}</p>;
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
