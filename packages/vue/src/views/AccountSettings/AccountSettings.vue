<template>
  <Page
    :loading="loading"
    :title="currentAccount?.name"
    :title-tag="
      t(
        `account.type.${currentAccount?.individual ? 'individual' : 'organization'}.label`
      )
    "
    class="account-show account-settings"
  >
    <AccountShow v-if="currentAccount && !loading" :account="currentAccount" />
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Page } from "@prefabs.tech/vue3-ui";
import { ref, onMounted, watch, computed } from "vue";

import { useTranslations } from "../../index";
import { useMyAccountsStore } from "../../stores/myAccounts";
import AccountShow from "../Accounts/_components/AccountShow.vue";

import type { Account } from "../../types/account";

const messages = useTranslations();
const { t } = useI18n({ messages });
const myAccountsStore = useMyAccountsStore();
const { fetchMyAccount } = myAccountsStore;

// Don't destructure to maintain reactivity
const activeAccount = computed(() => myAccountsStore.activeAccount);

const account = ref<Account | null>(null);
const loading = ref(true);

// Use activeAccount from store as the primary source of truth
const currentAccount = computed(() => {
  return activeAccount.value || account.value;
});

onMounted(async () => {
  await prepareComponent();
});

// Watch for changes in activeAccount and refetch data
watch(
  activeAccount,
  async (newActiveAccount, oldActiveAccount) => {
    if (newActiveAccount && newActiveAccount.id !== oldActiveAccount?.id) {
      console.log("ActiveAccount changed:", {
        old: oldActiveAccount?.id,
        new: newActiveAccount.id,
      });
      await prepareComponent();
    }
  },
  { immediate: false }
);

async function prepareComponent() {
  loading.value = true;
  try {
    // If we have an activeAccount, use it directly, otherwise fetch from API
    if (activeAccount.value) {
      console.log("Using activeAccount from store:", activeAccount.value.id);
      account.value = activeAccount.value;
    } else {
      console.log("Fetching account from API");
      account.value = await fetchMyAccount();
    }
  } finally {
    loading.value = false;
  }
}
</script>
