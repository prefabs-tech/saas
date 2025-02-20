import { useTranslation } from "@dzangolab/react-i18n";
import { Page } from "@dzangolab/react-ui";
import { useParams } from "react-router-dom";

import { AccountUsersTable } from "@/components/accounts";

export const AccountUsersPage = () => {
  const { t } = useTranslation("account");

  const parameters = useParams();

  if (!parameters.id) {
    return null;
  }

  return (
    <Page title={t("users.title")}>
      <AccountUsersTable accountId={parameters.id} id="users-table" />
    </Page>
  );
};
