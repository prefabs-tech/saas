import React, { createContext, useEffect, useState } from "react";

import { getMyAccounts } from "@/api/accounts";
import { STORAGE_KEY_DEFAULT } from "@/constants";
import { Customer } from "@/types/customer";

export interface AccountsContextType {
  accounts: Array<Customer>;
  activeAccount: Customer | null;
  loading: boolean;
  error: boolean;
  switchAccount: (account: Customer | null) => void;
}

interface Properties {
  config: {
    apiBaseUrl: string;
    autoSelectAccount?: boolean;
    disablePersistence?: boolean;
    allowMultipleSessions?: boolean; // disablePersistence must be false
    customStorageKey?: string;
  };
  userId?: string;
  children: React.ReactNode;
}

export const accountsContext = createContext<AccountsContextType | null>(null);

const AccountsProvider = ({ config, userId, children }: Properties) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [accounts, setAccounts] = useState<Array<Customer>>([]);
  const [activeAccount, setActiveAccount] = useState<Customer | null>(null);

  const {
    apiBaseUrl,
    autoSelectAccount,
    disablePersistence,
    customStorageKey = STORAGE_KEY_DEFAULT,
    allowMultipleSessions = true,
  } = config;

  const updateAccounts = (newAccounts: Array<Customer>) => {
    setAccounts(newAccounts);

    if (!newAccounts?.length) {
      return setActiveAccount(null);
    }

    // most likely run when app loads for the first time or page refresh
    if (!disablePersistence && !activeAccount) {
      const savedAccountId = allowMultipleSessions
        ? sessionStorage.getItem(customStorageKey)
        : localStorage.getItem(customStorageKey);

      if (savedAccountId) {
        const newActiveAccount = newAccounts.find(
          (nAccount) => nAccount.id === savedAccountId,
        );

        if (newActiveAccount) {
          return setActiveAccount(newActiveAccount);
        }
      }
    }

    if (autoSelectAccount) {
      if (newAccounts.length === 1) {
        return setActiveAccount(newAccounts[0]);
      }

      const newActiveAccount = newAccounts.find(
        (nAccount) => nAccount.id === activeAccount?.id,
      );
      setActiveAccount(newActiveAccount || null);
    }
  };

  useEffect(() => {
    if (userId) {
      setLoading(true);

      getMyAccounts({ apiBaseUrl })
        .then((accounts) => {
          updateAccounts(accounts as any); // eslint-disable-line @typescript-eslint/no-explicit-any
        })
        .catch((error) => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      updateAccounts([]);
    }
  }, [userId]);

  useEffect(() => {
    if (disablePersistence) {
      return;
    }

    if (activeAccount) {
      localStorage.setItem(customStorageKey, `${activeAccount.id}`);

      if (allowMultipleSessions) {
        sessionStorage.setItem(customStorageKey, `${activeAccount.id}`);
      }
    } else {
      localStorage.removeItem(customStorageKey);

      if (allowMultipleSessions) {
        sessionStorage.removeItem(customStorageKey);
      }
    }
  }, [activeAccount]);

  return (
    <accountsContext.Provider
      value={{
        accounts,
        activeAccount,
        loading,
        error,
        switchAccount: setActiveAccount,
      }}
    >
      {loading ? null : children}
    </accountsContext.Provider>
  );
};

export default AccountsProvider;
