<template>
  <LoadingIcon v-if="loading" />
  <slot v-else />
</template>

<script setup lang="ts">
import { LoadingIcon } from "@prefabs.tech/vue3-ui";
import { onMounted, watch } from "vue";

import { useMyAccounts } from "../composables/useMyAccounts";

export interface SaasAccountsProviderProperties {
  userId?: string;
}

const props = defineProps<SaasAccountsProviderProperties>();

const myAccountsStore = useMyAccounts();
const { loading, fetchMyAccounts, accounts } = myAccountsStore;

// Fetch accounts when user ID is available
onMounted(async () => {
  if (props.userId) {
    try {
      await fetchMyAccounts();
    } catch {
      // Error is handled by the store's error state
    }
  }
});

// Watch for userId changes
watch(
  () => props.userId,
  async (newUserId) => {
    if (newUserId && (!accounts || accounts.length === 0)) {
      try {
        await fetchMyAccounts();
      } catch {
        // Error is handled by the store's error state
      }
    }
  },
  { immediate: false }
);
</script>
