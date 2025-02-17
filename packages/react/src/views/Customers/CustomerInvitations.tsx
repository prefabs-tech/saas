import { useTranslation } from "@dzangolab/react-i18n";
import { Page } from "@dzangolab/react-ui";
import { useParams } from "react-router-dom";

import { CustomerInvitationsTable } from "@/components/customers/Invitations";

export const CustomerInvitations = () => {
  const { t } = useTranslation("user");

  const parameters = useParams();

  if (!parameters.id) {
    return null;
  }

  return (
    <Page title={t("invitations.table.title")}>
      <CustomerInvitationsTable
        customerId={parameters.id}
        id="invitations-table"
      />
    </Page>
  );
};
