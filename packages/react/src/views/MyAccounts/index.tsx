import { useTranslation } from "@dzangolab/react-i18n";
import { Page } from "@dzangolab/react-ui";
import { Navigate } from "react-router-dom";

import { MyAccounts } from "@/components/my-accounts";
import { useAccounts } from "@/hooks";
import { Account } from "@/types";

type Properties = {
  onAccountSwitch?: (account: Account) => void;
};

export const MyAccountsPage = ({ onAccountSwitch }: Properties) => {
  const { t } = useTranslation("accounts");

  const {
    loading,
    meta: { isMainApp },
  } = useAccounts();

  if (!isMainApp) {
    return <Navigate to={"/"} />;
  }

  return (
    <Page title={t("title")} loading={loading}>
      <MyAccounts onAccountSwitch={onAccountSwitch} />
    </Page>
  );
};
