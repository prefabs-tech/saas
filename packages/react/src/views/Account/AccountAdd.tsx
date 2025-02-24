import { useTranslation } from "@dzangolab/react-i18n";
import { Page } from "@dzangolab/react-ui";

import { AccountForm } from "./_components";

export const AccountAddPage = () => {
  const { t } = useTranslation("account");

  return (
    <Page title={t("addTitle")}>
      <AccountForm />
    </Page>
  );
};
