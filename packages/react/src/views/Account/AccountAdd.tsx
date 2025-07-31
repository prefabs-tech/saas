import { useTranslation } from "@prefabs.tech/react-i18n";
import { Page } from "@prefabs.tech/react-ui";

import { AccountForm } from "./_components";

export const AccountAddPage = () => {
  const { t } = useTranslation("account");

  return (
    <Page title={t("addTitle")}>
      <AccountForm />
    </Page>
  );
};
