import type { LocaleMessages, VueMessageType } from "@prefabs.tech/vue3-i18n";
import type { Pinia } from "pinia";
import type { Component } from "vue";
import type { Router } from "vue-router";
import type { SaasConfig } from "./config";

export type MessageType = "error" | "success";

export interface EventMessage {
  details?: Record<string, unknown>;
  message: string;
  type: MessageType;
}

export interface Tab {
  component: Component;
  key: string;
  label: string;
}

export type SaasEventHandlers = {
  notification?: (message: EventMessage) => void;
};

interface SaasVuePluginOptions {
  accountTabs?: (defaultTabs: Tab[]) => Tab[];
  notification?: (message: EventMessage) => void;
  pinia: Pinia;
  router: Router;
  saasConfig: SaasConfig;
  translations?: LocaleMessages<VueMessageType>;
}

export type { SaasVuePluginOptions };
