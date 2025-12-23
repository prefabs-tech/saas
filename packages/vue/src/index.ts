import { prependMessages } from "@prefabs.tech/vue3-i18n";
import { inject } from "vue";

import enMessages from "./locales/en/index";
import frMessages from "./locales/fr/index";
import { prepareConfig } from "./utils/config";

import type { SaasVuePluginOptions } from "./types";
import type { LocaleMessages, VueMessageType } from "@prefabs.tech/vue3-i18n";
import type { App, Plugin } from "vue";

const __saasConfig = Symbol.for("saas.config");
const __saasEventHandlers = Symbol.for("saas.eventHandlers");
const __saasAccountTabs = Symbol.for("saas.accountTabs");
const __saasVueTranslations = Symbol.for("saas.vue.translations");

const defaultMessages = {
  en: enMessages,
  fr: frMessages,
};

const plugin: Plugin = {
  install: (app: App, options: SaasVuePluginOptions): void => {
    const preparedConfig = prepareConfig(options.saasConfig);

    app.provide(__saasConfig, preparedConfig);

    const translations = options?.translations
      ? prependMessages(defaultMessages, options.translations)
      : defaultMessages;

    app.provide(__saasVueTranslations, translations);

    app.provide(__saasEventHandlers, {
      notification: options.notification,
    });

    app.provide(__saasAccountTabs, options.accountTabs);
  },
};

const useTranslations = (): LocaleMessages<VueMessageType> => {
  return inject<LocaleMessages<VueMessageType>>(
    __saasVueTranslations,
    defaultMessages
  );
};

export default plugin;
export { useTranslations };
export * from "./routes";
export * from "./types/routes";

// Account management
export { default as useMyAccountsStore } from "./stores/myAccounts";
export { useMyAccounts } from "./composables/useMyAccounts";
export { default as AccountSwitcher } from "./components/accounts/AccountSwitcher.vue";
export { default as SaasAccountsProvider } from "./components/SaasAccountsProvider.vue";
export { default as SaasWrapper } from "./components/SaasWrapper.vue";
export { default as ConfigProvider } from "./components/ConfigProvider.vue";

// Error handling
export { useGlobalAccountError } from "./composables/useGlobalAccountError";
export { default as NotFoundMessage } from "./components/NotFoundMessage.vue";

// Views
export { default as AccountSettings } from "./views/Accounts/AccountSettings.vue";
export { default as MyAccounts } from "./views/Accounts/MyAccounts.vue";
export { DEFAULT_PATHS } from "./constant";

// Utilities
export { checkIsAdminApp } from "./utils/common";
