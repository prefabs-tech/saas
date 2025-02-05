import { useContext } from "react";

import { accountsContext } from "@/contexts/AccountsProvider";

export const useAccounts = () => {
  const context = useContext(accountsContext);

  if (context === null) {
    throw new Error("AccountsProvider is required!");
  }

  return context;
};
