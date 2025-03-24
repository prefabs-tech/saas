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

export type JoinAccountProperties = {
  centered?: boolean;
  onJoinAccountSuccess?: (
    response?: AcceptInvitationResponse,
    request?: UseMutationRequestObject<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => void;
};

export const JoinAccountPage = ({
  centered = true,
  onJoinAccountSuccess,
}: JoinAccountProperties) => {
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
        onJoinAccountSuccess && onJoinAccountSuccess(response, request);

        refetchAccounts();

        // TODO find a way to switch to newly joined account. cannot use switchAccount

        navigate("/");
      },
      onError: () => {
        toast.error(t("joinAccount.messages.error"));
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

    // TODO remove dummy body, currently required by api
    triggerAcceptInvitation(
      token,
      {
        email: "xxx",
        password: "xxx",
        confirmPassword: "xxx",
      },
      accountId,
    );
  };

  const handleIgnore = () => {
    navigate("/");
  };

  const renderPageContent = () => {
    if (error || !invitation) {
      return <p>{t(`joinAccount.messages.errorFetching`)}</p>;
    }

    if (
      invitation.acceptedAt ||
      invitation.revokedAt ||
      invitation.expiresAt < Date.now()
    ) {
      return <p>{t(`joinAccount.messages.invalid`)}</p>;
    }

    return (
      <>
        <p className="info">
          {t("joinAccount.info", { account: invitation.account?.name })}
        </p>
        <div className="actions">
          <Button onClick={handleSubmit} loading={acceptLoading}>
            {t(`joinAccount.actions.accept`)}
          </Button>
          <Button
            onClick={handleIgnore}
            variant="outlined"
            severity="secondary"
            disabled={acceptLoading}
          >
            {t(`joinAccount.actions.ignore`)}
          </Button>
        </div>
      </>
    );
  };

  return (
    <AuthPage
      className="join-account"
      title={t("joinAccount.title")}
      loading={invitationLoading}
      centered={centered}
    >
      {renderPageContent()}
    </AuthPage>
  );
};
