import { useTranslation } from "@prefabs.tech/react-i18n";
import { AuthPage, Button } from "@prefabs.tech/react-ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { UseMutationRequestObject } from "@/api";
import {
  useAccounts,
  useGetInvitationQuery,
  useJoinInvitationMutation,
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

  const [now, setNow] = useState<number | null>(null);

  const {
    data: invitation,
    loading: invitationLoading,
    error,
    trigger,
  } = useGetInvitationQuery(token!, accountId, {
    lazy: true,
  });

  useEffect(() => {
    queueMicrotask(() => setNow(Date.now()));
  }, []);

  const { loading: acceptLoading, trigger: triggerAcceptInvitation } =
    useJoinInvitationMutation({
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
  }, [token, trigger]);

  const handleSubmit = () => {
    if (!token) {
      return;
    }

    triggerAcceptInvitation(token, accountId);
  };

  const handleIgnore = () => {
    navigate("/");
  };

  const renderPageContent = () => {
    if (error) {
      return <p>{t(`joinInvitation.messages.errorFetching`)}</p>;
    }

    if (
      invitation?.acceptedAt ||
      invitation?.revokedAt ||
      (now !== null && invitation?.expiresAt && invitation.expiresAt < now)
    ) {
      return <p>{t(`joinInvitation.messages.invalid`)}</p>;
    }

    return (
      <>
        <p className="info">
          {t("joinInvitation.info", {
            account: invitation?.account?.name || "",
          })}
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
      loading={invitationLoading || !invitation}
      centered={centered}
    >
      {renderPageContent()}
    </AuthPage>
  );
};
