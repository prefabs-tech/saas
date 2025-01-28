import { LoadingIcon, Select } from "@dzangolab/react-ui";

import { useAccounts } from "@/hooks";
import { Customer } from "@/types/customer";

type Properties = {
  label?: string;
  onSwitch?: (account?: Customer) => void;
};

export const AccountSwitcher = ({
  label = "Switch account",
  onSwitch,
}: Properties) => {
  const { accounts, activeAccount, loading, switchAccount } = useAccounts();

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
    <Select
      label={label}
      options={accounts.map((account) => ({
        label: `${account.name} (${account.id})`,
        value: account.id,
      }))}
      value={activeAccount?.id || ""}
      name="account"
      onChange={handleSelect}
      multiple={false}
    ></Select>
  );
};
