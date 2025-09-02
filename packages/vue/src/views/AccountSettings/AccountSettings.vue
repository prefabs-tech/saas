<template>
  <Page
    v-if="account?.id"
    :title="account.name"
    :title-tag="
      account.individual
        ? t('account.form.fields.type.options.individual')
        : t('account.form.fields.type.options.organization')
    "
    class="account-settings"
  >
    <LoadingIcon v-if="loading" />

    <AccountDetails v-if="account && !loading" :account="account" />
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { LoadingIcon, Page } from "@prefabs.tech/vue3-ui";
import { ref, onMounted } from "vue";

import { useTranslations } from "../../index";
import { useMyAccountsStore } from "../../stores/myAccounts";
import AccountDetails from "../Accounts/_components/AccountDetails.vue";

import type { Account } from "../../types/account";

const messages = useTranslations();
const { t } = useI18n({ messages });
const myAccountsStore = useMyAccountsStore();
const { fetchMyAccount } = myAccountsStore;

const account = ref<Account>({} as Account);
const loading = ref(true);

onMounted(async () => {
  await prepareComponent();
});

async function prepareComponent() {
  loading.value = true;
  try {
    account.value = await fetchMyAccount();
  } finally {
    loading.value = false;
  }
}
</script>
