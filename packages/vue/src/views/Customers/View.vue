<template>
  <Page
    v-if="account && account.id"
    :title="account.name"
    class="customer-view"
  >
    <TabbedPanel>
      <div :title="t('customers.view.info')" class="customer-info">
        <template v-if="!account.individual">
          <Data caption="Name" :value="account.name" />
          <Data
            caption="Registered number"
            :value="account.registeredNumber || '-'"
          />
          <Data caption="Tax ID" :value="account.taxId || '-'" />
        </template>

        <Data caption="Slug" :value="account.slug || '-'" />
        <Data caption="Domain" :value="account.domain || '-'" />
        <Data caption="Database" :value="account.database || '-'" />
      </div>

      <div :title="t('customers.view.users')" class="customer-users">
        <div class="users-content">
          <span>{{ t("customers.view.users") }}</span>
        </div>
      </div>
    </TabbedPanel>
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { Data, TabbedPanel } from "@dzangolab/vue3-ui";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import { useTranslations } from "../../index";
import useAccountsStore from "../../stores/accounts";

import type { Account } from "../../types/account";
import type { AppConfig } from "@dzangolab/vue3-config";

const route = useRoute();
const accountId = route.params.id as string;

const messages = useTranslations();
const { t } = useI18n({ messages });
const config = useConfig() as AppConfig;

const accountsStore = useAccountsStore();
const { getAccount } = accountsStore;

const account = ref({} as Account);

onMounted(async () => {
  await prepareComponent();
});

async function prepareComponent() {
  const response = await getAccount(accountId, config.apiBaseUrl);
  account.value = response;
}
</script>

<style lang="css">
.customer-info {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  padding: 1rem;
}

.customer-info .tabbed-panel ul[role="tablist"] {
  justify-self: unset !important;
}
</style>
