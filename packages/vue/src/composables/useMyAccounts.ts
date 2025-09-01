import { inject } from "vue";
import { useMyAccountsStore } from "../stores/myAccounts";
import type { SaasConfig } from "../types/config";

export const useMyAccounts = () => {
  const saasConfig = inject<SaasConfig>(Symbol.for("saas.config"));
  const myAccountsStore = useMyAccountsStore();

  if (!saasConfig) {
    throw new Error(
      "SaasConfig is required! Make sure you've installed the Saas plugin."
    );
  }

  // Initialize the store with config if not already done
  if (!myAccountsStore.meta.mainAppSubdomain) {
    myAccountsStore.setConfig(saasConfig);
  }

  return myAccountsStore;
};
