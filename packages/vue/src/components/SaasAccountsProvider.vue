<template>
  <!-- Show children only when not loading (same as React implementation) -->
  <slot v-if="!loading" />
</template>

<script setup lang="ts">
import { watch } from "vue";

import { useMyAccountsStore } from "../stores/myAccounts";

import type { SaasConfig } from "../types/config";

export interface SaasAccountsProviderProperties {
  config: SaasConfig;
  userId?: string;
}

const props = defineProps<SaasAccountsProviderProperties>();

const myAccountsStore = useMyAccountsStore();
const { loading } = myAccountsStore;

// Initialize store with config
myAccountsStore.setConfig(props.config);

// Fetch accounts when userId changes (matches React useEffect)
watch(
  () => props.userId,
  async (newUserId) => {
    if (newUserId) {
      try {
        await myAccountsStore.fetchMyAccounts();
      } catch {
        // Error is handled by the store's error state
      }
    }
  },
  { immediate: true }
);
</script>
