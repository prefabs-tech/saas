import { useAccounts } from "@/hooks";
import { LoadingIcon, Select } from "@dzangolab/react-ui";
import { useEffect, useState } from "react";

export const AccountSwitcher = () => {
  const { accounts, activeAccount, loading, switchAccount } = useAccounts();

  const [account, setAccount] = useState(activeAccount?.id || "");

  useEffect(() => {
    if (account) {
      const newActiveAccount = accounts.find(
        (_account) => _account.id === account,
      );

      if (newActiveAccount) {
        switchAccount(newActiveAccount);
      }
    }
  }, [account]);

  if (loading) {
    return <LoadingIcon />;
  }

  return (
    <Select
      label="Switch account"
      options={accounts.map((account) => ({
        label: account.name,
        value: account.id,
      }))}
      value={account}
      name="account"
      onChange={setAccount}
      multiple={false}
    ></Select>
  );
};
