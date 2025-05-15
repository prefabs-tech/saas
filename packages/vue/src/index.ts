import type { App, Plugin } from "vue";
import type { LocaleMessages, VueMessageType } from "@dzangolab/vue3-i18n";
import type { SaasVuePluginOptions } from "./types";
import updateRouter from "./router";

import { prependMessages } from "@dzangolab/vue3-i18n";
import { inject } from "vue";

import messages from "./locales/messages.json";

const __saasVueTranslations = Symbol.for("saas.vue.translations");
const __saasConfig = Symbol.for("saas.config");

const plugin: Plugin = {
  install: (app: App, options: SaasVuePluginOptions): void => {
    updateRouter(options.router);

    console.log("===========OPTIONS===========");
    console.log(options);
    console.log("===========OPTIONS===========");

    app.provide(__saasConfig, options.saasConfig);

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
