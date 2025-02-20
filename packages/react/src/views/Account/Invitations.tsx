import { useTranslation } from "@dzangolab/react-i18n";
import { Page } from "@dzangolab/react-ui";
import { useParams } from "react-router-dom";

import { AccountInvitationsTable } from "@/components/accounts/Invitations";

export const AccountInvitationsPage = () => {
  const { t } = useTranslation("account");

  const parameters = useParams();

  if (!parameters.id) {
    return null;
  }

  return (
    <Page title={t("invitations.title")}>
      <AccountInvitationsTable
        accountId={parameters.id}
        id="invitations-table"
      />
    </Page>
  );
};
