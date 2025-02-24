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

  const handleSwitch = (account: Account) => {
    // FIXME hack to force rtk query to refetch data on app
    window.location.reload();

    if (onAccountSwitch) {
      onAccountSwitch(account);
    }
  };

  return (
    <Page title={t("title")} loading={loading}>
      <MyAccounts onAccountSwitch={handleSwitch} />
    </Page>
  );
};
