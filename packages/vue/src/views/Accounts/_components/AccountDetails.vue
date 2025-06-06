<template>
  <div class="account-info">
    <template v-if="!account.individual">
      <Data :caption="t('accounts.form.fields.name')" :value="account.name" />

      <Data
        :caption="t('accounts.form.fields.registeredNumber')"
        :value="account.registeredNumber || '-'"
      />

      <Data
        :caption="t('accounts.form.fields.taxId')"
        :value="account.taxId || '-'"
      />
    </template>

    <template v-if="saasConfig.subdomains !== 'disabled'">
      <Data
        :caption="t('accounts.form.fields.slug')"
        :value="account.slug || '-'"
      />

      <Data
        :caption="t('accounts.form.fields.domain')"
        :value="account.domain || '-'"
      />

      <Data
        v-if="isAdminApp && saasConfig.multiDatabase && account.database"
        :caption="t('accounts.form.fields.database')"
        :value="account.database"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "@dzangolab/vue3-i18n";
import { Data } from "@dzangolab/vue3-ui";
import { computed, inject, PropType } from "vue";

import { useTranslations } from "../../../index";

import type { Account } from "../../../types/account";
import type { SaasConfig } from "../../../types/config";

defineProps({
  account: {
    default: undefined,
    type: Object as PropType<Account>,
  },
});

const messages = useTranslations();
const { t } = useI18n({ messages });

const injectedSaasConfig = inject<SaasConfig>(Symbol.for("saas.config"));

if (!injectedSaasConfig) {
  throw new Error("SAAS config not provided");
}

const saasConfig = computed(() => {
  return {
    ...injectedSaasConfig,
  };
});

const isAdminApp = computed(() => {
  const subdomain = window.location.hostname.split(".")[0];

  return subdomain === "admin";
});
</script>

<style lang="css">
.account-info {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  padding: 1rem;
}
</style>
