import type { LocaleMessages, VueMessageType } from "@dzangolab/vue3-i18n";
import type { Pinia } from "pinia";
import type { Router } from "vue-router";
import type { SaasConfig } from "./config";

interface SaasVuePluginOptions {
  saasConfig: SaasConfig;
  notification?: (message: object | string | unknown) => void;
  pinia: Pinia;
  router: Router;
  translations?: LocaleMessages<VueMessageType>;
}

export type { SaasVuePluginOptions };
