import { inject } from "vue";
import { useMyAccountsStore } from "../stores/myAccounts";
import type { SaasConfig } from "../types/config";

export const useMyAccounts = (config?: SaasConfig) => {
  const myAccountsStore = useMyAccountsStore();

  // Try to get config from parameter, injection, or existing store
  let saasConfig = config;

  if (!saasConfig) {
    saasConfig = inject<SaasConfig | undefined>(
      Symbol.for("saas.config"),
      undefined
    );
  }

  if (!saasConfig && !myAccountsStore.meta.mainAppSubdomain) {
    throw new Error(
      "SaasConfig is required! Make sure you've installed the Saas plugin or passed config directly."
    );
  }

  // Initialize the store with config if not already done
  if (saasConfig && !myAccountsStore.meta.mainAppSubdomain) {
    myAccountsStore.setConfig(saasConfig);
  }

  return myAccountsStore;
};
