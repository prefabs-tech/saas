<template>
  <!-- Show children only when not loading (same as React implementation) -->
  <!-- If no user, show children immediately. If user exists, wait for accounts to load -->
  <slot v-if="!props.userId || !loading" />
</template>

<script setup lang="ts">
import { watch, computed, defineProps } from "vue";

import { useMyAccountsStore } from "../stores/myAccounts";

import type { SaasConfig } from "../types/config";

export interface SaasAccountsProviderProperties {
  config: SaasConfig;
  userId?: string;
}

const props = defineProps<SaasAccountsProviderProperties>();

const myAccountsStore = useMyAccountsStore();
// Use computed to maintain reactivity
const loading = computed(() => myAccountsStore.loading);

// Initialize store with config
myAccountsStore.setConfig(props.config);

// Fetch accounts when userId changes (matches React useEffect)
watch(
  () => props.userId,
  async (newUserId, oldUserId) => {
    if (newUserId) {
      // Only fetch if user actually changed
      if (newUserId !== oldUserId) {
        try {
          await myAccountsStore.fetchMyAccounts();
        } catch {
          // Error is handled by the store's error state
        }
      }
    } else {
      // Clear accounts when user signs out
      myAccountsStore.accounts = null;
      myAccountsStore.activeAccount = null;
      myAccountsStore.error = false;
    }
  },
  { immediate: true }
);
</script>
