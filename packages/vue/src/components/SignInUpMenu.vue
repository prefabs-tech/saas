<template>
  <ResponsiveMenu :routes="routes" />
</template>

<script lang="ts">
export default {
  name: "SignInUpMenu",
};
</script>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { ResponsiveMenu } from "@dzangolab/vue3-ui";
import { computed } from "vue";

import { useTranslations } from "../index";

import type { AppConfig } from "@dzangolab/vue3-config";

const config = useConfig() as AppConfig;

const messages = useTranslations();

const { t } = useI18n({ messages });

const signUpRoute = {
  name: t("user.menu.signup"),
  route: "signup",
};

const loginRoute = {
  name: t("user.menu.signin"),
  route: "login",
};

const routes = computed(() => {
  if (config?.user?.routes?.signup.disabled) {
    return [loginRoute];
  }

  return [loginRoute, signUpRoute];
});
</script>
