<template>
  <Page :loading="loading" :title="t('accounts.title')" class="my-accounts">
    <div v-if="accounts && accounts.length > 0" class="accounts-grid">
      <AccountCard
        v-for="account in accounts"
        :key="account.id"
        :account="account"
        :active="account.id === activeAccount?.id"
        :loading="accountLoading"
        @switch="handleSwitch"
      />
    </div>

    <div v-else-if="!loading" class="empty-state">
      <p>{{ t("accounts.empty") }}</p>
    </div>
  </Page>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { Page } from "@prefabs.tech/vue3-ui";
import { computed } from "vue";

import { useTranslations } from "../../index";
import AccountCard from "./_components/AccountCard.vue";
import { useMyAccountsStore } from "../../stores/myAccounts";

import type { Account } from "../../types/account";

const messages = useTranslations();
const { t } = useI18n({ messages });
const myAccountsStore = useMyAccountsStore();

// Get reactive data from store
const accounts = computed(() => myAccountsStore.accounts);
const activeAccount = computed(() => myAccountsStore.activeAccount);
const loading = computed(() => myAccountsStore.loading);
const accountLoading = computed(() => myAccountsStore.accountLoading);
const { switchAccount } = myAccountsStore;

const handleSwitch = (account: Account) => {
  switchAccount(account);
};
</script>

<style scoped>
.accounts-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-top: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-color-secondary);
}

.empty-state p {
  font-size: 1.125rem;
  margin: 0;
  opacity: 0.8;
}

@media (min-width: 768px) {
  .accounts-grid {
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }

  .empty-state {
    padding: 4rem 2rem;
  }
}

@media (min-width: 992px) {
  .accounts-grid {
    grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
    gap: 2rem;
  }

  .empty-state {
    padding: 5rem 3rem;
  }

  .empty-state p {
    font-size: 1.25rem;
  }
}

@media (min-width: 1200px) {
  .accounts-grid {
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 2.5rem;
  }
}
</style>
