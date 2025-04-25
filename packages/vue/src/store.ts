import { defineStore } from "pinia";
import type { Account } from "./types/account";

const useAccountStore = defineStore("account", () => {
  const setCurrentAccount = (account: Account | null) => {
    localStorage.setItem("currentAccount", JSON.stringify(account));
  };

  const getCurrentAccount = (): Account | null => {
    const data = localStorage.getItem("currentAccount");
    return data ? JSON.parse(data) : null;
  };

  const setAccounts = (accounts: Account[]) => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  };

  const getAccounts = (): Account[] => {
    const data = localStorage.getItem("accounts");
    return data ? JSON.parse(data) : [];
  };

  const clearAccounts = () => {
    localStorage.removeItem("currentAccount");
    localStorage.removeItem("accounts");
  };

  return {
    setCurrentAccount,
    getCurrentAccount,
    setAccounts,
    getAccounts,
    clearAccounts,
  };
});

export default useAccountStore;
