import { useTranslation } from "@prefabs.tech/react-i18n";
import { AuthPage } from "@prefabs.tech/react-ui";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { UseMutationRequestObject } from "@/api";
import { UserSignupForm } from "@/components/Signup";
import { useGetInvitationQuery, useSignupInvitationMutation } from "@/hooks";
import { AcceptInvitationResponse, UserSignupData } from "@/types";

export type SignupInvitationProperties = {
  centered?: boolean;
  onAcceptInvitationSuccess?: (
    response?: AcceptInvitationResponse,
    request?: UseMutationRequestObject<undefined | UserSignupData>,
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

  const [now, setNow] = useState<null | number>(null);

  const {
    data: invitation,
    error,
    loading: invitationLoading,
    trigger,
  } = useGetInvitationQuery(token!, accountId, {
    lazy: true,
  });

  useEffect(() => {
    queueMicrotask(() => setNow(Date.now()));
  }, []);

  const { loading: acceptLoading, trigger: triggerAcceptInvitation } =
    useSignupInvitationMutation({
      onError: () => {
        toast.error(t("signupInvitation.messages.error"));
      },
      onSuccess: (response, request) => {
        onAcceptInvitationSuccess &&
          onAcceptInvitationSuccess(response, request);

        toast.success(t("signupInvitation.messages.success"));
      },
    });

  useEffect(() => {
    if (token) {
      trigger();
    }
  }, [token, trigger]);

  const handleSubmit = (credential: UserSignupData) => {
    if (!token) {
      return;
    }

    triggerAcceptInvitation(token, credential, accountId);
  };

  const renderPageContent = () => {
    if (error) {
      return <p>{t(`signupInvitation.messages.errorFetching`)}</p>;
    }

    if (
      invitation?.acceptedAt ||
      invitation?.revokedAt ||
      (now !== null && invitation?.expiresAt && invitation.expiresAt < now)
    ) {
      return <p>{t(`signupInvitation.messages.invalid`)}</p>;
    }

    return (
      <UserSignupForm
        email={invitation?.email || ""}
        handleSubmit={handleSubmit}
        loading={acceptLoading}
      />
    );
  };

  return (
    <AuthPage
      centered={centered}
      className="signup"
      loading={invitationLoading || !invitation}
      title={t("user:signup.title")}
    >
      {renderPageContent()}
    </AuthPage>
  );
};
