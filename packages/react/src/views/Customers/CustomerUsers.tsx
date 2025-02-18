import { useTranslation } from "@dzangolab/react-i18n";
import { Page } from "@dzangolab/react-ui";
import { useParams } from "react-router-dom";

import { CustomerUsersTable } from "@/components/customers";

export const CustomerUsers = () => {
  const { t } = useTranslation("customer");

  const parameters = useParams();

  if (!parameters.id) {
    return null;
  }

  return (
    <Page title={t("users.title")}>
      <CustomerUsersTable customerId={parameters.id} id="users-table" />
    </Page>
  );
};
