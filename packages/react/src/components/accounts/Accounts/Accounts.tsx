import { GridContainer } from "@dzangolab/react-ui";

import { useAccounts } from "@/hooks";
import { Customer } from "@/types";

import { Account } from "./Account";

type Properties = {
  onAccountSwitch?: (account: Customer) => void;
};

export const Accounts = ({ onAccountSwitch }: Properties) => {
  const { loading, accountLoading, accounts, activeAccount, switchAccount } =
    useAccounts();

  const handleSwitch = (account: Customer) => {
    switchAccount(account);
    onAccountSwitch && onAccountSwitch(account);
  };

  if (loading) {
    return null;
  }

  return (
    <GridContainer className="accounts">
      {accounts?.map((account) => {
        return (
          <Account
            key={account.id}
            account={account}
            active={account.id === activeAccount?.id}
            loading={accountLoading}
            onSwitch={() => handleSwitch(account)}
          />
        );
      })}
    </GridContainer>
  );
};
