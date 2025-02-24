import { GridContainer } from "@dzangolab/react-ui";

import { useAccounts } from "@/hooks";
import { Account as AccountType } from "@/types";

import { Account } from "./Account";

type Properties = {
  onAccountSwitch?: (account: AccountType) => void;
};

export const MyAccounts = ({ onAccountSwitch }: Properties) => {
  const { loading, accountLoading, accounts, activeAccount, switchAccount } =
    useAccounts();

  const handleSwitch = (account: AccountType) => {
    switchAccount(account);
    onAccountSwitch && onAccountSwitch(account);
  };

  if (loading) {
    return null;
  }

  return (
    <GridContainer className="my-accounts">
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
