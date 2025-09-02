<template>
  <Page
    :loading="loading"
    :title="account?.name"
    :title-tag="
      t(
        `account.type.${account?.individual ? 'individual' : 'organization'}.label`
      )
    "
    class="account-show account-settings"
  >
    <AccountShow v-if="account && !loading" :account="account" />
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Page } from "@prefabs.tech/vue3-ui";
import { ref, onMounted } from "vue";

import { useTranslations } from "../../index";
import { useMyAccountsStore } from "../../stores/myAccounts";
import AccountShow from "../Accounts/_components/AccountShow.vue";

import type { Account } from "../../types/account";

const messages = useTranslations();
const { t } = useI18n({ messages });
const myAccountsStore = useMyAccountsStore();
const { fetchMyAccount } = myAccountsStore;

const account = ref<Account | null>(null);
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
