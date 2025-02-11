import { useTranslation } from "@dzangolab/react-i18n";
import { Page } from "@dzangolab/react-ui";
import { Navigate } from "react-router-dom";

import { Accounts } from "@/components/accounts";
import { useAccounts } from "@/hooks";
import { Customer } from "@/types";

type Properties = {
  onAccountSwitch?: (account: Customer) => void;
};

export const MyAccounts = ({ onAccountSwitch }: Properties) => {
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
      <Accounts onAccountSwitch={onAccountSwitch} />
    </Page>
  );
};
