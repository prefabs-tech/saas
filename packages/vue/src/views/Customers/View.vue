<template>
  <Page
    v-if="account && account.id"
    :title="account.name"
    class="customer-view"
  >
    <LoadingIcon v-if="loading" />

    <TabView
      id="tab-view-slot"
      :tabs="tabList"
      :visible-tabs="['info', 'users', 'invitations']"
      active-key="['info']"
    >
      <div key="info" class="customer-info">
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
      <div key="users">
        <span>{{ t("customer.view.users") }}</span>
        <Users />
      </div>
      <div key="invitations">
        <span>{{ t("customer.view.invitations") }}</span>
        <Invitations />
      </div>
    </TabView>
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Data, TabView, LoadingIcon } from "@dzangolab/vue3-ui";
import { ref, onMounted, computed, inject } from "vue";
import { useRoute } from "vue-router";

import { useTranslations } from "../../index";
import useAccountsStore from "../../stores/accounts";
import Invitations from "../Invitations/Index.vue";

import type { Account } from "../../types/account";
import type { SaasConfig } from "../../types/config";
import type { AppConfig } from "@dzangolab/vue3-config";

const route = useRoute();
const accountId = route.params.id as string;

const messages = useTranslations();
const { t } = useI18n({ messages });
const config = useConfig() as AppConfig;

const injectedSaasConfig = inject<SaasConfig>(Symbol.for("saas.config"));

const tabList = [
  { key: "info", label: t("customer.view.info") },
  { key: "users", label: t("customer.view.users") },
  { key: "invitations", label: t("customer.view.invitations") },
];

if (!injectedSaasConfig) {
  throw new Error("SAAS config not provided");
}

const saasConfig = computed(() => {
  return {
    ...injectedSaasConfig,
  };
});

const accountsStore = useAccountsStore();
const { getAccount } = accountsStore;

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
</style>
