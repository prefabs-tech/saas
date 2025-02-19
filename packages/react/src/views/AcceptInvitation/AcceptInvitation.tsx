import { useTranslation } from "@dzangolab/react-i18n";
import { AuthPage } from "@dzangolab/react-ui";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { UserSignupForm } from "@/components/accounts";
import { useAcceptInvitationMutation, useGetInvitationQuery } from "@/hooks";
import { UseMutationRequestObject } from "@/hooks/UseMutation";
import { AcceptInvitationResponse, UserSignupData } from "@/types";

export type AcceptInvitationProperties = {
  centered?: boolean;
  onAcceptInvitationSuccess?: (
    response?: AcceptInvitationResponse,
    request?: UseMutationRequestObject<UserSignupData>,
  ) => void;
};

export const AcceptInvitation = ({
  centered = true,
  onAcceptInvitationSuccess,
}: AcceptInvitationProperties) => {
  const { t } = useTranslation("invitations");

  const { token } = useParams();
  const [searchParameters] = useSearchParams();
  const customerId = searchParameters.get("customerId");

  const {
    data: invitation,
    loading: invitationLoading,
    error,
    trigger,
  } = useGetInvitationQuery(token!, customerId, {
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

    triggerAcceptInvitation(token, credential, customerId);
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
