<template>
  <Page
    v-if="account && account.id"
    :title="account.name"
    class="customer-view"
  >
    <LoadingIcon v-if="loading" />
    <TabbedPanel v-else>
      <div :title="t('customers.view.info')" class="customer-info">
        <template v-if="!account.individual">
          <Data
            :caption="t('customers.form.fields.name')"
            :value="account.name"
          />

          <Data
            :caption="t('customers.form.fields.registeredNumber')"
            :value="account.registeredNumber || '-'"
          />

          <Data
            :caption="t('customers.form.fields.taxId')"
            :value="account.taxId || '-'"
          />
        </template>

        <template v-if="saasConfig.subdomains !== 'disabled'">
          <Data
            :caption="t('customers.form.fields.slug')"
            :value="account.slug || '-'"
          />

          <Data
            :caption="t('customers.form.fields.domain')"
            :value="account.domain || '-'"
          />

          <Data
            v-if="isAdminApp && saasConfig.multiDatabase && account.database"
            :caption="t('customers.form.fields.database')"
            :value="account.database"
          />
        </template>
      </div>

      <div :title="t('customers.view.users')" class="customer-users">
        <div class="users-content">
          <span>{{ t("customers.view.users") }}</span>
        </div>
      </div>
      <div
        :title="t('customers.view.invitations')"
        class="customer-invitations"
      >
        <div class="invitations-content">
          <Invitations />
        </div>
      </div>
    </TabbedPanel>
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Data, TabbedPanel, LoadingIcon } from "@dzangolab/vue3-ui";
import { ref, onMounted, computed, inject } from "vue";
import { useRoute } from "vue-router";

import { useTranslations } from "../../index";
import useAccountsStore from "../../stores/accounts";
import Invitations from "../Invitations/_components/Invitations.vue";

import type { Account } from "../../types/account";
import type { SaasConfig } from "../../types/config";
import type { AppConfig } from "@dzangolab/vue3-config";

const route = useRoute();
const accountId = route.params.id as string;

const messages = useTranslations();
const { t } = useI18n({ messages });
const config = useConfig() as AppConfig;

// Get the injected SAAS config
const injectedSaasConfig = inject<SaasConfig>(Symbol.for("saas.config"));

if (!injectedSaasConfig) {
  throw new Error("SAAS config not provided");
}

// Create a computed ref that returns the config
const saasConfig = computed(() => {
  return {
    ...injectedSaasConfig,
  };
});

const accountsStore = useAccountsStore();
const { getAccount } = accountsStore;

// Determine if we're in admin app based on current subdomain
const isAdminApp = computed(() => {
  const subdomain = window.location.hostname.split(".")[0];
  return subdomain === "admin";
});

const account = ref({} as Account);
const loading = ref(true);

onMounted(async () => {
  await prepareComponent();
});

async function prepareComponent() {
  loading.value = true;

  try {
    const response = await getAccount(accountId, config.apiBaseUrl);
    account.value = response;
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="css">
.customer-info {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  padding: 1rem;
}

.customer-view .tabbed-panel ul[role="tablist"] {
  justify-self: unset !important;
}
</style>
