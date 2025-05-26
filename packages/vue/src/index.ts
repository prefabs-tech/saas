import type { App, Plugin } from "vue";
import type { LocaleMessages, VueMessageType } from "@dzangolab/vue3-i18n";
import type { SaasVuePluginOptions } from "./types";
import updateRouter from "./router";

import { prependMessages } from "@dzangolab/vue3-i18n";
import { inject } from "vue";

import enMessages from "./locales/en/index";
import frMessages from "./locales/fr/index";

const __saasVueTranslations = Symbol.for("saas.vue.translations");
const __saasConfig = Symbol.for("saas.config");
const __saasEventHandlers = Symbol.for("saas.eventHandlers");

const defaultMessages = {
  en: enMessages,
  fr: frMessages,
};

const plugin: Plugin = {
  install: (app: App, options: SaasVuePluginOptions): void => {
    updateRouter(options.router);

    app.provide(__saasConfig, options.saasConfig);

    const translations = options?.translations
      ? prependMessages(defaultMessages, options.translations)
      : defaultMessages;

    app.provide(__saasVueTranslations, translations);

    app.provide(__saasEventHandlers, {
      notification: options.notification,
    });
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
export * from "./router";
export { default as router } from "./router";
