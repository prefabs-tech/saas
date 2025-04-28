import type { App, Plugin } from "vue";
import type { LocaleMessages, VueMessageType } from "@dzangolab/vue3-i18n";
import type { SaasVuePluginOptions } from "./types";

import { prependMessages } from "@dzangolab/vue3-i18n";
import { inject } from "vue";

import messages from "./locales/messages.json";

const __saasVueTranslations = Symbol.for("saas.vue.translations");

const plugin: Plugin = {
  install: (app: App, options: SaasVuePluginOptions): void => {
    const translations = options?.translations
      ? prependMessages(messages, options.translations)
      : messages;

    app.provide(__saasVueTranslations, translations);
  },
};

const useTranslations = (): LocaleMessages<VueMessageType> => {
  return inject<LocaleMessages<VueMessageType>>(
    __saasVueTranslations,
    messages
  );
};

export default plugin;
export { useTranslations };
export * from "./components";
export * from "./router";
export { default as router } from "./router";
