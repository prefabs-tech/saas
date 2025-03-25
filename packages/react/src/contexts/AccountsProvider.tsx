import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getMyAccounts } from "@/api/accounts";
import { STORAGE_KEY_DEFAULT } from "@/constants";
import { Account } from "@/types/account";
import { SaasConfig } from "@/types/config";

import ConfigProvider from "./ConfigProvider";

export interface AccountsContextType {
  accounts: Array<Account> | null;
  activeAccount: Account | null;
  loading: boolean;
  error: boolean;
  accountLoading: boolean;
  meta: {
    isAdminApp: boolean;
    isMainApp: boolean;
    mainAppSubdomain: string;
    rootDomain: string;
    subdomain: string;
  };
  switchAccount: (
    account: Account | null,
    options?: { clearState?: boolean },
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

  const {
    apiBaseUrl,
    mainAppSubdomain,
    rootDomain,
    accounts: accountsConfig,
  } = config;

  const { autoSelectAccount = true, allowMultipleSessions = true } =
    accountsConfig || {};

  const subdomain = window.location.hostname.split(".")[0];
  const { isMainApp, isAdminApp } = useMemo(() => {
    return {
      isMainApp: subdomain === mainAppSubdomain,
      isAdminApp: subdomain === "admin",
    };
  }, [subdomain]);

  const switchAccount = useCallback(
    (
      newAccount: Account | null,
      { clearState = true }: { clearState?: boolean } = {},
    ) => {
      setAccountLoading(true);

      setActiveAccount(newAccount);

      if (newAccount) {
        localStorage.setItem(STORAGE_KEY_DEFAULT, `${newAccount.id}`);

        if (allowMultipleSessions) {
          sessionStorage.setItem(STORAGE_KEY_DEFAULT, `${newAccount.id}`);
        }
      } else if (clearState) {
        if (allowMultipleSessions) {
          sessionStorage.removeItem(STORAGE_KEY_DEFAULT);
        }

        localStorage.removeItem(STORAGE_KEY_DEFAULT);
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
        let savedAccountId = localStorage.getItem(STORAGE_KEY_DEFAULT);

        if (allowMultipleSessions) {
          const sessionSavedAccountId =
            sessionStorage.getItem(STORAGE_KEY_DEFAULT);

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
    (newAccounts: Array<Account>) => {
      setLoading(true);

      setAccounts(newAccounts);

      const newActiveAccount = computeNewActiveAccount(newAccounts);

      switchAccount(newActiveAccount, { clearState: false });

      setLoading(false);
    },
    [setLoading, switchAccount, computeNewActiveAccount],
  );

  useEffect(() => {
    // ignore account discovery for admin app
    if (!isAdminApp && userId) {
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
        accountLoading,
        meta: {
          isAdminApp,
          isMainApp,
          mainAppSubdomain,
          rootDomain,
          subdomain,
        },
        switchAccount,
        updateAccounts,
      }}
    >
      {loading ? null : (
        <ConfigProvider config={config}>{children}</ConfigProvider>
      )}
    </accountsContext.Provider>
  );
};

export default AccountsProvider;
