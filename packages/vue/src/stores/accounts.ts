import { defineStore } from "pinia";

import {
  createAccount as doCreateAccount,
  deleteAccount as doDeleteAccount,
  getAccount as doGetAccount,
  getAccounts as doGetAccounts,
  updateAccount as doUpdateAccount,
} from "../api/accounts";

import type { Account, AccountInput } from "../types/account";

const useAccountsStore = defineStore("accounts", () => {
  const createAccount = async (data: AccountInput, apiBaseUrl: string) => {
    return await doCreateAccount(data, apiBaseUrl);
  };

  const deleteAccount = async (id: string, apiBaseUrl: string) => {
    return await doDeleteAccount(id, apiBaseUrl);
  };

  const getAccount = async (id: string, apiBaseUrl: string) => {
    return await doGetAccount(id, apiBaseUrl);
  };

  const getAccounts = async (apiBaseUrl: string) => {
    return await doGetAccounts(apiBaseUrl);
  };

  const updateAccount = async (
    id: string,
    data: AccountInput,
    apiBaseUrl: string
  ) => {
    return await doUpdateAccount(id, data, apiBaseUrl);
  };

  return {
    createAccount,
    deleteAccount,
    getAccount,
    getAccounts,
    updateAccount,
  };
});

export default useAccountsStore;
