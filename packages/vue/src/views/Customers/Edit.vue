<template>
  <Page :title="t('customers.edit')">
    <CustomerForm :account="account" @submit="onSubmit" @cancel="onCancel" />
  </Page>
</template>

<script setup lang="ts">
import { useConfig } from "@dzangolab/vue3-config";
import { useI18n } from "@dzangolab/vue3-i18n";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import CustomerForm from "./_components/Customerform.vue";
import { useTranslations } from "../../index";
import useAccountsStore from "../../stores/accounts";

import type { Account } from "../../types/account";
import type { AppConfig } from "@dzangolab/vue3-config";

const route = useRoute();
const accountId = route.params.id as string;

const messages = useTranslations();
const { t } = useI18n({ messages });
const config = useConfig() as AppConfig;
const router = useRouter();

const accountsStore = useAccountsStore();
const { getAccount } = accountsStore;

const account = ref({} as Account);

onMounted(async () => {
  await prepareComponent();
});

const onCancel = () => {
  router.push({ name: "customers" });
};

const onSubmit = () => {
  router.push({ name: "customers" });
};

async function prepareComponent() {
  const response = await getAccount(accountId, config.apiBaseUrl);
  account.value = response;
}
</script>
