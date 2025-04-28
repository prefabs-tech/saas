import type { AppConfig } from "@dzangolab/vue3-config";
import type { LocaleMessages, VueMessageType } from "@dzangolab/vue3-i18n";
import type { Pinia } from "pinia";

interface SaasVuePluginOptions {
  config: AppConfig;
  notification?: (message: object | string | unknown) => void;
  pinia: Pinia;
  translations?: LocaleMessages<VueMessageType>;
}

export type { SaasVuePluginOptions };
