<template>
  <div class="account-switcher">
    <small v-if="!noHelperText">{{ t("switcher.helper") }}</small>

    <LoadingIcon v-if="loading || !accounts" />

    <select
      v-else
      v-model="selectedAccountId"
      class="account-select"
      @change="handleSelectChange"
    >
      <option value="" disabled>
        {{ props.emptyLabel || t("accounts.switcher.emptyLabel") }}
      </option>
      <option v-for="account in accounts" :key="account.id" :value="account.id">
        {{ account.name }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "@prefabs.tech/vue3-i18n";
import { LoadingIcon } from "@prefabs.tech/vue3-ui";
import { defineProps, defineEmits, ref, watch } from "vue";

import { useTranslations } from "../../index";
import { useMyAccountsStore } from "../../stores/myAccounts";

import type { Account } from "../../types/account";

export interface AccountSwitcherProperties {
  emptyLabel?: string;
  noHelperText?: boolean;
}

export interface AccountSwitcherEmits {
  (event: "switch", account?: Account): void;
}

const props = withDefaults(defineProps<AccountSwitcherProperties>(), {
  emptyLabel: "",
  noHelperText: false,
});

const emit = defineEmits<AccountSwitcherEmits>();

const messages = useTranslations();
const { t } = useI18n({ messages });

const myAccountsStore = useMyAccountsStore();
const { accounts, activeAccount, loading, switchAccount } = myAccountsStore;

const selectedAccountId = ref<string>("");

// Watch for changes in activeAccount to sync with select
watch(
  () => activeAccount?.id,
  (newAccountId) => {
    selectedAccountId.value = newAccountId || "";
  },
  { immediate: true }
);

const handleSelectChange = () => {
  const accountId = selectedAccountId.value;

  if (!accountId || accountId === activeAccount?.id) {
    return;
  }

  const newActiveAccount = accounts?.find(
    (account) => account.id === accountId
  );

  if (newActiveAccount) {
    switchAccount(newActiveAccount);
    emit("switch", newActiveAccount);
  }
};
</script>

<style scoped>
.account-switcher {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.account-switcher small {
  color: var(--text-color-secondary, #6b7280);
  font-size: 0.875rem;
}

.account-select {
  padding: 0.5rem;
  border: 1px solid var(--border-color, #d1d5db);
  border-radius: 0.375rem;
  background-color: var(--background-color, #ffffff);
  color: var(--text-color, #374151);
  font-size: 0.875rem;
  cursor: pointer;
  min-width: 200px;
}

.account-select:focus {
  outline: none;
  border-color: var(--primary-color, #3b82f6);
  box-shadow: 0 0 0 2px var(--primary-color-light, rgba(59, 130, 246, 0.1));
}

.account-select:disabled {
  background-color: var(--background-disabled, #f9fafb);
  color: var(--text-disabled, #9ca3af);
  cursor: not-allowed;
}
</style>
