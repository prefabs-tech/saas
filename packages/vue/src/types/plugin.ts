import type { LocaleMessages, VueMessageType } from "@dzangolab/vue3-i18n";
import type { Pinia } from "pinia";
import type { Router } from "vue-router";
import type { SaasConfig } from "./config";

export type MessageType = "success" | "error";

export interface EventMessage {
  type: MessageType;
  message: string;
  details?: Record<string, unknown>;
}

export type SaasEventHandlers = {
  notification?: (message: EventMessage) => void;
};

interface SaasVuePluginOptions {
  notification?: (message: EventMessage) => void;
  pinia: Pinia;
  router: Router;
  saasConfig: SaasConfig;
  translations?: LocaleMessages<VueMessageType>;
}

export type { SaasVuePluginOptions };
