<template>
  <Page
    :loading="loading"
    :title="activeAccount?.name"
    :title-tag="
      t(
        `account.type.${activeAccount?.individual ? 'individual' : 'organization'}.label`
      )
    "
    class="account-show account-settings"
  >
    <AccountShow v-if="activeAccount && !loading" :account="activeAccount" />
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Page } from "@prefabs.tech/vue3-ui";
import { ref, onMounted, computed } from "vue";

import { useTranslations } from "../../index";
import { useMyAccountsStore } from "../../stores/myAccounts";
import AccountShow from "../Accounts/_components/AccountShow.vue";

const messages = useTranslations();
const { t } = useI18n({ messages });
const myAccountsStore = useMyAccountsStore();

// Get activeAccount directly from store
const activeAccount = computed(() => myAccountsStore.activeAccount);
const loading = ref(true);

onMounted(async () => {
  await prepareComponent();
});

async function prepareComponent() {
  loading.value = true;

  try {
    // If no activeAccount, fetch it
    if (!activeAccount.value) {
      await myAccountsStore.fetchMyAccount();
    }
  } finally {
    loading.value = false;
  }
}
</script>
