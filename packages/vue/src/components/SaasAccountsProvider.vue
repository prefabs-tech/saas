<template>
  <!-- Show children only when not loading (same as React implementation) -->
  <!-- If no user, show children immediately. If user exists, wait for accounts to load -->
  <slot v-if="!props.userId || !loading" />
</template>

<script setup lang="ts">
import { computed, defineProps, watch } from "vue";

import type { SaasConfig } from "../types/config";

import { useGlobalAccountError } from "../composables/UseGlobalAccountError";
import { useMyAccountsStore } from "../stores/MyAccounts";

export interface SaasAccountsProviderProperties {
  config: SaasConfig;
  userId?: string;
}

const props = defineProps<SaasAccountsProviderProperties>();

const myAccountsStore = useMyAccountsStore();
const { checkForAccountError } = useGlobalAccountError();
// Use computed to maintain reactivity
const loading = computed(() => myAccountsStore.loading);

// Initialize store with config
myAccountsStore.setConfig(props.config);

// Fetch accounts when userId changes
watch(
  () => props.userId,
  async (newUserId, oldUserId) => {
    if (newUserId) {
      if (newUserId !== oldUserId) {
        try {
          await myAccountsStore.fetchMyAccounts();
        } catch (error) {
          if (checkForAccountError(error)) {
            return;
          }
          // eslint-disable-next-line no-console
          console.error("Failed to fetch accounts:", error);
        }
      }
    } else {
      // Clear accounts when user signs out
      myAccountsStore.accounts = null;
      myAccountsStore.activeAccount = null;
      myAccountsStore.error = false;
    }
  },
  { immediate: true },
);
</script>
