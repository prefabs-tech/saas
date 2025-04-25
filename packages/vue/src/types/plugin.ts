import type { AppConfig } from "@dzangolab/vue3-config";
import type { LocaleMessages, VueMessageType } from "@dzangolab/vue3-i18n";
import type { Pinia } from "pinia";
import type { Router } from "vue-router";

interface DzangolabVueUserPluginOptions {
  config: AppConfig;
  notification?: (message: object | string | unknown) => void;
  pinia: Pinia;
  router: Router;
  translations?: LocaleMessages<VueMessageType>;
}

export type { DzangolabVueUserPluginOptions };
