import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getMyAccounts } from "@/api/accounts";
import { ACCOUNT_HEADER_NAME } from "@/constants";
import { Account } from "@/types/account";
import { SaasConfig } from "@/types/config";

type SwitchAccountOptions = {
  clearState?: boolean;
};

export interface AccountsContextType {
  accounts: Array<Account> | null;
  activeAccount: Account | null;
  loading: boolean;
  error: boolean;
  accountLoading: boolean;
  meta: {
    isMainApp: boolean;
    rootDomain: string;
    subdomain: string;
  };
  refetchAccounts: () => void;
  switchAccount: (
    account: Account | null,
    options?: SwitchAccountOptions,
  ) => void;
  updateAccounts: (accounts: Account[]) => void;
}

interface Properties {
  config: SaasConfig;
  userId?: string;
  children: React.ReactNode;
}

export const accountsContext = createContext<AccountsContextType | null>(null);

const AccountsProvider = ({ config, userId, children }: Properties) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [accountLoading, setAccountLoading] = useState(false);

  const [accounts, setAccounts] = useState<Array<Account> | null>(null);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  const { apiBaseUrl, mainApp, rootDomain, accounts: accountsConfig } = config;

  const accountStorageKey = ACCOUNT_HEADER_NAME;

  const { autoSelectAccount = true, allowMultipleSessions = true } =
    accountsConfig || {};

  const subdomain = window.location.hostname.split(".")[0];
  const host = window.location.host;

  const isMainApp = useMemo(() => {
    return host === mainApp?.domain;
  }, [host]);

  const switchAccount = useCallback(
    (newAccount: Account | null, options?: SwitchAccountOptions) => {
      setAccountLoading(true);

      setActiveAccount(newAccount);

      const { clearState = true } = options || {};

      if (newAccount) {
        localStorage.setItem(accountStorageKey, `${newAccount.id}`);

        if (allowMultipleSessions) {
          sessionStorage.setItem(accountStorageKey, `${newAccount.id}`);
        }
      } else if (clearState) {
        if (allowMultipleSessions) {
          sessionStorage.removeItem(accountStorageKey);
        }

        localStorage.removeItem(accountStorageKey);
      }

      setAccountLoading(false);
    },
    [setLoading, setActiveAccount],
  );

  const computeNewActiveAccount = useCallback(
    (newAccounts: Account[]) => {
      if (!newAccounts?.length) {
        return null;
      }

      if (!isMainApp) {
        const accountIndex = newAccounts.findIndex(
          (account) => account.slug === subdomain,
        );

        if (accountIndex === -1) {
          throw new Error("Account not found for user");
        }

        return newAccounts[accountIndex];
      }

      const newActiveAccount: Account | null =
        autoSelectAccount || newAccounts.length === 1 ? newAccounts[0] : null;

      if (!activeAccount) {
        // check if saved accountId is present in newAccounts, return it if found
        let savedAccountId = localStorage.getItem(accountStorageKey);

        if (allowMultipleSessions) {
          const sessionSavedAccountId =
            sessionStorage.getItem(accountStorageKey);

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
    [activeAccount, subdomain],
  );

  const updateAccounts = useCallback(
    (newAccounts: Array<Account>, options?: SwitchAccountOptions) => {
      const { clearState = false } = options || {};

      setLoading(true);

      setAccounts(newAccounts);

      const newActiveAccount = computeNewActiveAccount(newAccounts);

      switchAccount(newActiveAccount, { clearState });

      setLoading(false);
    },
    [setLoading, switchAccount, computeNewActiveAccount],
  );

  const fetchMyAccounts = useCallback(() => {
    setLoading(true);

    getMyAccounts({ apiBaseUrl })
      .then((accounts) => {
        updateAccounts(accounts, { clearState: true });
      })
      .catch((error) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchMyAccounts();
    }
  }, [userId]);

  return (
    <accountsContext.Provider
      value={{
        accounts,
        activeAccount,
        loading,
        error,
        accountLoading,
        meta: {
          isMainApp,
          rootDomain,
          subdomain,
        },
        refetchAccounts: fetchMyAccounts,
        switchAccount,
        updateAccounts,
      }}
    >
      {loading ? null : children}
    </accountsContext.Provider>
  );
};

export default AccountsProvider;
