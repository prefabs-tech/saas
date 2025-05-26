import { defineStore } from "pinia";

import {
  createAccount,
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
} from "../api/accounts";

import type { Account, AccountInput } from "../types/account";

const useAccountsStore = defineStore("accounts", () => {
  return {
    createAccount,
    deleteAccount,
    getAccount,
    getAccounts,
    updateAccount,
  };
});

export default useAccountsStore;
