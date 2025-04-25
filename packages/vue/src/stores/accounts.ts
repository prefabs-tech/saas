import { defineStore } from "pinia";
import {
  createAccount as doCreateAccount,
  deleteAccount as doDeleteAccount,
  getAccount as doGetAccount,
  getAccounts as doGetAccounts,
  updateAccount as doUpdateAccount,
} from "../api/accounts";
import type { Account, AccountInput } from "../types";

const useAccountsStore = defineStore("accounts", () => {
  const accounts = ref<Account[]>([]);
  const currentAccount = ref<Account | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createAccount = async (data: AccountInput, apiBaseUrl: string) => {
    loading.value = true;
    error.value = null;
    try {
      const account = await doCreateAccount(data, apiBaseUrl);
      accounts.value.push(account);
      return account;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to create account";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteAccount = async (id: string, apiBaseUrl: string) => {
    loading.value = true;
    error.value = null;
    try {
      await doDeleteAccount(id, apiBaseUrl);
      accounts.value = accounts.value.filter(account => account.id !== id);
      if (currentAccount.value?.id === id) {
        currentAccount.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to delete account";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getAccount = async (id: string, apiBaseUrl: string) => {
    loading.value = true;
    error.value = null;
    try {
      const account = await doGetAccount(id, apiBaseUrl);
      currentAccount.value = account;
      return account;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to get account";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getAccounts = async (apiBaseUrl: string) => {
    loading.value = true;
    error.value = null;
    try {
      const fetchedAccounts = await doGetAccounts(apiBaseUrl);
      accounts.value = fetchedAccounts;
      return fetchedAccounts;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to get accounts";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateAccount = async (id: string, data: AccountInput, apiBaseUrl: string) => {
    loading.value = true;
    error.value = null;
    try {
      const account = await doUpdateAccount(id, data, apiBaseUrl);
      const index = accounts.value.findIndex(a => a.id === id);
      if (index !== -1) {
        accounts.value[index] = account;
      }
      if (currentAccount.value?.id === id) {
        currentAccount.value = account;
      }
      return account;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to update account";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    accounts,
    currentAccount,
    loading,
    error,
    createAccount,
    deleteAccount,
    getAccount,
    getAccounts,
    updateAccount,
  };
});

export default useAccountsStore;
