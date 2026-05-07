import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { Account, AccountInput } from "../types/account";

import { getMyAccount, getMyAccounts, updateMyAccount } from "../api/accounts";
import { ACCOUNT_HEADER_NAME } from "../constant";

export interface AccountsConfig {
  allowMultipleSessions?: boolean;
  autoSelectAccount?: boolean;
}

export interface MyAccountsMeta {
  isMainApp: boolean;
  mainAppSubdomain: string;
  rootDomain: string;
  subdomain: string;
}

export interface MyAccountsState {
  accountLoading: boolean;
  accounts: Account[] | null;
  activeAccount: Account | null;
  error: boolean;
  loading: boolean;
}

export interface SaasConfig {
  accounts?: AccountsConfig;
  apiBaseUrl: string;
  mainAppSubdomain: string;
  rootDomain: string;
}

export const useMyAccountsStore = defineStore("myAccounts", () => {
  // State
  const accounts = ref<Account[] | null>(null);
  const activeAccount = ref<Account | null>(null);
  const loading = ref(false);
  const error = ref(false);
  const accountLoading = ref(false);
  const config = ref<null | SaasConfig>(null);

  // Getters
  const meta = computed((): MyAccountsMeta => {
    if (!config.value) {
      return {
        isMainApp: false,
        mainAppSubdomain: "",
        rootDomain: "",
        subdomain: "",
      };
    }

    const subdomain = window.location.hostname.split(".")[0];
    const isMainApp = subdomain === config.value.mainAppSubdomain;

    return {
      isMainApp,
      mainAppSubdomain: config.value.mainAppSubdomain,
      rootDomain: config.value.rootDomain,
      subdomain,
    };
  });

  const accountStorageKey = ACCOUNT_HEADER_NAME;

  // Actions
  const setConfig = (newConfig: SaasConfig) => {
    config.value = newConfig;
  };

  const switchAccount = (
    newAccount: Account | null,
    options: { clearState?: boolean } = {},
  ) => {
    const { clearState = true } = options;
    accountLoading.value = true;

    activeAccount.value = newAccount;

    const { allowMultipleSessions = true } = config.value?.accounts || {};

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

    accountLoading.value = false;
  };

  const computeNewActiveAccount = (accountsList: Account[]): Account | null => {
    if (!config.value || !accountsList?.length) return null;

    const { allowMultipleSessions = true, autoSelectAccount = true } =
      config.value.accounts || {};

    const subdomain = window.location.hostname.split(".")[0];
    const isMainApp = subdomain === config.value.mainAppSubdomain;

    // For non-main apps, find account by subdomain (like React implementation)
    if (!isMainApp) {
      const accountBySubdomain = accountsList.find(
        (account) => account.slug === subdomain,
      );
      if (!accountBySubdomain) {
        throw new Error("Account not found for user");
      }
      return accountBySubdomain;
    }

    // For main app, use auto-selection logic
    const defaultAccount: Account | null =
      autoSelectAccount || accountsList.length === 1 ? accountsList[0] : null;

    if (!activeAccount.value) {
      // Check for saved account ID
      let savedAccountId = localStorage.getItem(accountStorageKey);

      if (allowMultipleSessions) {
        const sessionSavedAccountId = sessionStorage.getItem(accountStorageKey);
        savedAccountId = sessionSavedAccountId || savedAccountId;
      }

      if (!savedAccountId) {
        return defaultAccount;
      }

      const savedAccount = accountsList.find(
        (account) => account.id === savedAccountId,
      );

      return savedAccount || defaultAccount;
    }

    // If there's already an active account, try to preserve it
    const previousAccount = accountsList.find(
      (account) => account.id === activeAccount.value?.id,
    );

    return previousAccount || defaultAccount;
  };

  const updateAccounts = (newAccounts: Account[]) => {
    loading.value = true;

    accounts.value = newAccounts;

    const newActiveAccount = computeNewActiveAccount(newAccounts);

    switchAccount(newActiveAccount, { clearState: false });

    loading.value = false;
  };

  const fetchMyAccounts = async (): Promise<void> => {
    if (!config.value) {
      throw new Error("Config is required");
    }

    loading.value = true;
    error.value = false;

    try {
      const accountsList = await getMyAccounts(config.value.apiBaseUrl);
      updateAccounts(accountsList);
    } catch (error_) {
      error.value = true;
      throw error_;
    } finally {
      loading.value = false;
    }
  };

  const fetchMyAccount = async (): Promise<Account> => {
    if (!config.value) {
      throw new Error("Config is required");
    }

    const account = await getMyAccount(config.value.apiBaseUrl);
    return account;
  };

  const updateActiveAccount = async (data: AccountInput): Promise<Account> => {
    if (!config.value) {
      throw new Error("Config is required");
    }

    const updatedAccount = await updateMyAccount(data, config.value.apiBaseUrl);

    // Update the active account if it was updated
    if (activeAccount.value?.id === updatedAccount.id) {
      activeAccount.value = updatedAccount;
    }

    // Update in accounts list
    if (accounts.value) {
      const index = accounts.value.findIndex(
        (accumulator) => accumulator.id === updatedAccount.id,
      );
      if (index !== -1) {
        accounts.value[index] = updatedAccount;
      }
    }

    return updatedAccount;
  };

  const refetchAccounts = () => {
    return fetchMyAccounts();
  };

  return {
    accountLoading,
    // State
    accounts,
    activeAccount,
    error,
    fetchMyAccount,
    fetchMyAccounts,

    loading,
    meta,
    refetchAccounts,
    // Actions
    setConfig,
    switchAccount,
    updateAccounts,
    updateActiveAccount,
  };
});

export default useMyAccountsStore;
