import { CONFIG_UI_DEFAULT } from "@/constants";
import { SaasConfig } from "@/types";

export const prepareUiConfig = (ui: SaasConfig["ui"] = {}) => {
  return {
    account: {
      form: {
        ...CONFIG_UI_DEFAULT.account.form,
        ...(ui?.account?.form || {}),
      },
    },
    invitation: {
      form: {
        ...CONFIG_UI_DEFAULT.invitation.form,
        ...(ui?.invitation?.form || {}),
      },
    },
    signup: {
      form: {
        ...CONFIG_UI_DEFAULT.signup.form,
        ...(ui?.signup?.form || {}),
      },
    },
  };
};

/**
 * Prepare the configuration by merging with default values.
 *
 * @param config Saas config
 * @returns Config with default values merged
 */
export const prepareConfig = (config: SaasConfig): SaasConfig => {
  const { ui, ...restConfig } = config;

  const _ui = prepareUiConfig(ui);

  return {
    ui: _ui,
    ...restConfig,
  };
};
