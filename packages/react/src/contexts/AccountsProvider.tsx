import React, { createContext, useCallback, useEffect, useState } from "react";

import { getMyAccounts } from "@/api/accounts";
import { STORAGE_KEY_DEFAULT } from "@/constants";
import { Customer } from "@/types/customer";

export interface AccountsContextType {
  accounts: Array<Customer>;
  activeAccount: Customer | null;
  loading: boolean;
  error: boolean;
  switchAccount: (account: Customer | null) => void;
  updateAccounts: (accounts: Customer[]) => void;
}

interface Properties {
  config: {
    apiBaseUrl: string;
    autoSelectAccount?: boolean;
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
    customStorageKey = STORAGE_KEY_DEFAULT,
    allowMultipleSessions = true,
  } = config;

  const switchAccount = useCallback(
    (newAccount: Customer | null) => {
      setLoading(true);

      setActiveAccount(newAccount);

      if (newAccount) {
        localStorage.setItem(customStorageKey, `${newAccount.id}`);

        if (allowMultipleSessions) {
          sessionStorage.setItem(customStorageKey, `${newAccount.id}`);
        }
      } else {
        if (allowMultipleSessions) {
          sessionStorage.removeItem(customStorageKey);
        }

        localStorage.removeItem(customStorageKey);
      }

      setLoading(false);
    },
    [setLoading, setActiveAccount],
  );

  const computeNewActiveAccount = useCallback(
    (newAccounts: Customer[]) => {
      if (!newAccounts?.length) {
        return null;
      }

      const newActiveAccount: Customer | null = autoSelectAccount
        ? newAccounts[0]
        : null;

      if (!activeAccount) {
        // check if saved accountId is present in newAccounts, return it if found
        let savedAccountId = localStorage.getItem(customStorageKey);

        if (allowMultipleSessions) {
          const sessionSavedAccountId =
            sessionStorage.getItem(customStorageKey);

          savedAccountId = sessionSavedAccountId
            ? sessionSavedAccountId
            : savedAccountId;
        }

        if (!savedAccountId) {
          return newActiveAccount;
        }

        const savedAccountIndex = newAccounts.findIndex(
          (account) => account.id === savedAccountId,
        );

        return savedAccountIndex !== -1
          ? newAccounts[savedAccountIndex]
          : newActiveAccount;
      }

      const previousAccountIndex = newAccounts.findIndex(
        (account) => account.id === activeAccount.id,
      );

      return previousAccountIndex !== -1
        ? newAccounts[previousAccountIndex]
        : newActiveAccount;
    },
    [activeAccount],
  );

  const updateAccounts = useCallback(
    (newAccounts: Array<Customer>) => {
      setLoading(true);

      setAccounts(newAccounts);

      const newActiveAccount = computeNewActiveAccount(newAccounts);

      switchAccount(newActiveAccount);

      setLoading(false);
    },
    [setLoading, switchAccount, computeNewActiveAccount],
  );

  useEffect(() => {
    if (userId) {
      setLoading(true);

      getMyAccounts({ apiBaseUrl })
        .then((accounts) => {
          updateAccounts(accounts);
        })
        .catch((error) => {
          setError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [userId]);

  return (
    <accountsContext.Provider
      value={{
        accounts,
        activeAccount,
        loading,
        error,
        switchAccount,
        updateAccounts,
      }}
    >
      {loading ? null : children}
    </accountsContext.Provider>
  );
};

export default AccountsProvider;
