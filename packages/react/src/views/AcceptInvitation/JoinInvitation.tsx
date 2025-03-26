import { useTranslation } from "@dzangolab/react-i18n";
import { AuthPage, Button } from "@dzangolab/react-ui";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { UseMutationRequestObject } from "@/api";
import {
  useAcceptInvitationMutation,
  useAccounts,
  useGetInvitationQuery,
} from "@/hooks";
import { AcceptInvitationResponse } from "@/types";

export type JoinInvitationProperties = {
  centered?: boolean;
  onAcceptInvitationSuccess?: (
    response?: AcceptInvitationResponse,
    request?: UseMutationRequestObject<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => void;
};

export const JoinInvitationPage = ({
  centered = true,
  onAcceptInvitationSuccess,
}: JoinInvitationProperties) => {
  const { refetchAccounts } = useAccounts();

  const { t } = useTranslation("accounts");
  const navigate = useNavigate();

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

        refetchAccounts();

        // TODO find a way to switch to newly joined account. cannot use switchAccount

        toast.success(t("joinInvitation.messages.success"));
        navigate("/");
      },
      onError: () => {
        toast.error(t("joinInvitation.messages.error"));
      },
    });

  useEffect(() => {
    if (token) {
      trigger();
    }
  }, []);

  const handleSubmit = () => {
    if (!token) {
      return;
    }

    triggerAcceptInvitation(token, undefined, accountId);
  };

  const handleIgnore = () => {
    navigate("/");
  };

  const renderPageContent = () => {
    if (error || !invitation) {
      return <p>{t(`joinInvitation.messages.errorFetching`)}</p>;
    }

    if (
      invitation.acceptedAt ||
      invitation.revokedAt ||
      invitation.expiresAt < Date.now()
    ) {
      return <p>{t(`joinInvitation.messages.invalid`)}</p>;
    }

    return (
      <>
        <p className="info">
          {t("joinInvitation.info", { account: invitation.account?.name })}
        </p>
        <div className="actions">
          <Button onClick={handleSubmit} loading={acceptLoading}>
            {t(`joinInvitation.actions.accept`)}
          </Button>
          <Button
            onClick={handleIgnore}
            variant="outlined"
            severity="secondary"
            disabled={acceptLoading}
          >
            {t(`joinInvitation.actions.ignore`)}
          </Button>
        </div>
      </>
    );
  };

  return (
    <AuthPage
      className="join-invitation"
      title={t("joinInvitation.title")}
      loading={invitationLoading}
      centered={centered}
    >
      {renderPageContent()}
    </AuthPage>
  );
};
