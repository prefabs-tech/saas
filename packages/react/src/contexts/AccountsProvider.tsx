import React, { createContext, useEffect, useState } from "react";

import { fetchAccounts } from "@/api/accounts";
import { STORAGE_KEY_DEFAULT } from "@/constants";
import { Customer } from "@/types/customer";

export interface AccountsContextType {
  accounts: Array<Customer>;
  activeAccount: Customer | null;
  loading: boolean;
  error: boolean;
  setAccounts: (accounts: Array<Customer>) => void;
  switchAccount: (account: Customer | null) => void;
}

interface Properties {
  config: {
    apiBaseUrl: string;
    autoSelectAccount?: boolean;
    saveToStorage?: {
      enabled?: boolean;
      storage?: "local" | "session";
      storageKey?: string;
    };
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

  const { apiBaseUrl, autoSelectAccount } = config;

  const updateAccounts = (newAccounts: Array<Customer>) => {
    setAccounts(newAccounts);

    if (newAccounts?.length) {
      if (newAccounts.length === 1 || autoSelectAccount) {
        setActiveAccount(newAccounts[0]);
      }
    } else {
      setActiveAccount(null);
    }
  };

  useEffect(() => {
    if (userId) {
      setLoading(true);

      fetchAccounts(userId, { apiBaseUrl })
        .then(({ accounts }) => {
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
    const {
      enabled = true,
      storage = "session",
      storageKey = STORAGE_KEY_DEFAULT,
    } = config.saveToStorage || {};

    if (enabled) {
      if (activeAccount) {
        storage === "local"
          ? localStorage.setItem(storageKey, `${activeAccount.id}`)
          : sessionStorage.setItem(storageKey, `${activeAccount.id}`);
      } else {
        storage === "local"
          ? localStorage.removeItem(storageKey)
          : sessionStorage.removeItem(storageKey);
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
        setAccounts: updateAccounts,
      }}
    >
      {loading ? null : children}
    </accountsContext.Provider>
  );
};

export default AccountsProvider;
