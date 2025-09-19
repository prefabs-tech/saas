<template>
  <Page
    :loading="loading"
    :title="activeAccount?.name"
    class="account-show account-settings"
  >
    <template #titleTag>
      <BadgeComponent
        :label="
          t(
            `account.type.${activeAccount?.individual ? 'individual' : 'organization'}.label`
          )
        "
        :severity="activeAccount?.individual ? 'primary' : 'success'"
      />
    </template>
    <AccountShow v-if="activeAccount && !loading" :account="activeAccount" />
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Page, BadgeComponent } from "@prefabs.tech/vue3-ui";
import { ref, onMounted, computed } from "vue";

import { useTranslations } from "../../index";
import { useMyAccountsStore } from "../../stores/myAccounts";
import AccountShow from "../Accounts/_components/AccountShow.vue";

const messages = useTranslations();
const { t } = useI18n({ messages });
const myAccountsStore = useMyAccountsStore();

const activeAccount = computed(() => myAccountsStore.activeAccount);
const loading = ref(true);

onMounted(async () => {
  await prepareComponent();
});

async function prepareComponent() {
  loading.value = true;

  try {
    if (!activeAccount.value) {
      await myAccountsStore.fetchMyAccount();
    }
  } finally {
    loading.value = false;
  }
}
</script>
