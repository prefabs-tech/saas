import type { AppConfig } from "@dzangolab/vue3-config";
import type { LocaleMessages, VueMessageType } from "@dzangolab/vue3-i18n";

const config: AppConfig = {
  apiBaseUrl: "http://localhost",
  appTitle: "Test app",
  appVersion: "0.1.0",
  i18n: {
    fallbackLocale: "en",
    messages: {} as LocaleMessages<VueMessageType>,
    supportedLocales: ["en", "fr"],
  },
  features: {
    showVersion: true,
  },
  sentry: {
    dsn: "tbd",
  },
  slug: "app",
  websiteDomain: "test",
};

export default config;
