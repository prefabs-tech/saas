import { defineStore } from "pinia";

import {
  createAccount,
  deleteAccount,
  getAccount,
  getAccounts,
  updateAccount,
} from "../api/accounts";

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
