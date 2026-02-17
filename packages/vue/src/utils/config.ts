import { CONFIG_UI_DEFAULT } from "../constant";

import type { SaasConfig } from "../types/config";

export const prepareUiConfig = (ui: SaasConfig["ui"] = {}) => {
  return {
    account: {
      form: {
        ...CONFIG_UI_DEFAULT.account.form,
        ...ui?.account?.form,
      },
    },
    invitation: {
      form: {
        ...CONFIG_UI_DEFAULT.invitation.form,
        ...ui?.invitation?.form,
      },
    },
    signup: {
      form: {
        ...CONFIG_UI_DEFAULT.signup.form,
        ...ui?.signup?.form,
      },
    },
  };
};

export const prepareConfig = (config: SaasConfig): SaasConfig => {
  const { ui, ...rest } = config;

  return {
    ...rest,
    ui: prepareUiConfig(ui),
  };
};
