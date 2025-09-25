<template>
  <LoadingIcon v-if="loading" />

  <SimpleAccountError v-else-if="showAccountError" />

  <Page
    v-else-if="error && error.status === 404"
    class="error"
    :title="t('accounts.unregisteredDomain.title')"
    :subtitle="t('accounts.unregisteredDomain.message')"
    centered
  />

  <Page
    v-else-if="error"
    class="error"
    :title="t('accounts.error.title')"
    :subtitle="t('accounts.error.message')"
    centered
  />

  <ConfigProvider v-else :config="config">
    <SaasAccountsProvider
      v-if="!isAdminApp"
      :config="config"
      :user-id="props.userId"
    >
      <slot />
    </SaasAccountsProvider>
    <slot v-else />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { LoadingIcon, Page } from "@prefabs.tech/vue3-ui";
import { ref, onMounted, inject, defineProps } from "vue";

import { useTranslations } from "../index";
import ConfigProvider from "./ConfigProvider.vue";
import SaasAccountsProvider from "./SaasAccountsProvider.vue";
import SimpleAccountError from "./SimpleAccountError.vue";
import { doesAccountExist } from "../api/accounts";
import { useGlobalAccountError } from "../composables/useGlobalAccountError";
import { checkIsAdminApp } from "../utils/common";

import type { SaasConfig } from "../types/config";

export interface SaasWrapperProperties {
  userId?: string;
}

const props = defineProps<SaasWrapperProperties>();

// Get config from plugin injection
const config = inject<SaasConfig>(Symbol.for("saas.config"));

if (!config) {
  throw new Error(
    "SaasConfig not found! Make sure you've installed the SaaS Vue plugin with saasConfig."
  );
}

const messages = useTranslations();
const { t } = useI18n({ messages });

const loading = ref(true);
const error = ref<{ status?: number } | null>(null);
const { showAccountError } = useGlobalAccountError();

const isAdminApp = checkIsAdminApp();

onMounted(async () => {
  try {
    await doesAccountExist(config.apiBaseUrl);
  } catch (err) {
    error.value = err as { status?: number };
  } finally {
    loading.value = false;
  }
});
</script>
