<template>
  <Page :title="t('accounts.edit')">
    <CustomerForm :account="account" />
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import CustomerForm from "./Customerform.vue";
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
