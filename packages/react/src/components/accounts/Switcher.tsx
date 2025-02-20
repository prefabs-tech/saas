import { useTranslation } from "@dzangolab/react-i18n";
import { DropdownMenu, LoadingIcon } from "@dzangolab/react-ui";

import { useAccounts } from "@/hooks";
import { Account } from "@/types/account";

type Properties = {
  emptyLabel?: string;
  noHelperText?: boolean;
  onSwitch?: (account?: Account) => void;
};

export const AccountSwitcher = ({
  emptyLabel,
  noHelperText = false,
  onSwitch,
}: Properties) => {
  const { t } = useTranslation("accounts");

  const { accounts, activeAccount, loading, switchAccount } = useAccounts();

  const label = activeAccount
    ? activeAccount.organizationName || activeAccount.name
    : emptyLabel || t("switcher.emptyLabel");

  const handleSelect = (accountId: string) => {
    if (accountId === activeAccount?.id) {
      return;
    }

    const newActiveAccount = accounts?.find(
      (_account) => _account.id === accountId,
    );

    if (newActiveAccount) {
      switchAccount(newActiveAccount);
      onSwitch && onSwitch(newActiveAccount);
    }
  };

  if (loading || !accounts) {
    return <LoadingIcon />;
  }

  return (
    <div className="account-switcher">
      {!noHelperText && <small>{t("switcher.helper")}</small>}
      <DropdownMenu
        label={label}
        menu={accounts.map((account) => ({
          label: account.organizationName || account.name,
          onClick: () => handleSelect(account.id),
        }))}
      ></DropdownMenu>
    </div>
  );
};
