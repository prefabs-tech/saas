# Simple Test Component

Replace the AccountSwitcher in your debug App.vue with this simple test to see what's happening:

```vue
<template>
  <SaasWrapper :user-id="user?.id">
    <Layout :default-layout="defaultLayout">
      <template #userMenuTrigger>
        {{ $t("app.header.menu.userMenuTrigger") }}
      </template>

      <template #addon>
        <!-- Debug info -->
        <div
          style="background: yellow; padding: 8px; margin: 8px; font-size: 12px;"
        >
          <strong>DEBUG:</strong><br />
          User ID: {{ user?.id }}<br />
          Loading: {{ debugInfo.loading }}<br />
          Accounts Count: {{ debugInfo.accountsCount }}<br />
          Accounts Type: {{ debugInfo.accountsType }}<br />
          Accounts Is Array: {{ debugInfo.accountsIsArray }}<br />
          Error: {{ debugInfo.error }}<br />
          Active Account: {{ debugInfo.activeAccount?.name }}<br />
          Config Present: {{ debugInfo.configPresent }}<br />
          API Base URL: {{ debugInfo.apiBaseUrl }}<br />
          <details>
            <summary>Raw Accounts Data:</summary>
            <pre>{{ JSON.stringify(debugInfo.accounts, null, 2) }}</pre>
          </details>
        </div>

        <!-- Simple test instead of AccountSwitcher -->
        <div
          class="header-accounts"
          style="border: 2px solid red; padding: 10px;"
        >
          <strong>SIMPLE TEST:</strong><br />

          <div>Raw store.accounts: {{ myAccountsStore.accounts }}</div>
          <div>store.loading: {{ myAccountsStore.loading }}</div>
          <div>!accounts check: {{ !myAccountsStore.accounts }}</div>
          <div>
            loading || !accounts:
            {{ myAccountsStore.loading || !myAccountsStore.accounts }}
          </div>

          <hr />

          <!-- Manual dropdown to test -->
          <select
            v-if="
              myAccountsStore.accounts && myAccountsStore.accounts.length > 0
            "
          >
            <option disabled selected>
              Select Account ({{ myAccountsStore.accounts.length }} available)
            </option>
            <option
              v-for="account in myAccountsStore.accounts"
              :key="account.id"
              :value="account.id"
            >
              {{ account.name }}
            </option>
          </select>
          <div v-else>
            No accounts available or accounts is: {{ myAccountsStore.accounts }}
          </div>
        </div>
      </template>

      <router-view />
    </Layout>
  </SaasWrapper>
  <notifications />
</template>

<script setup lang="ts">
import { SaasWrapper, useMyAccountsStore } from "@prefabs.tech/saas-vue";
import { BasicLayout, userStore } from "@prefabs.tech/vue3-user";
import { computed, inject } from "vue";

import type { SaasConfig } from "@prefabs.tech/saas-vue";

const defaultLayout = computed(() => {
  return BasicLayout;
});

const { getUser } = userStore();
const user = getUser();

// Debug info
const myAccountsStore = useMyAccountsStore();
const config = inject<SaasConfig>(Symbol.for("saas.config"));

const debugInfo = computed(() => ({
  loading: myAccountsStore.loading,
  accountsCount: myAccountsStore.accounts?.length || 0,
  accounts: myAccountsStore.accounts,
  error: myAccountsStore.error,
  activeAccount: myAccountsStore.activeAccount,
  configPresent: !!config,
  apiBaseUrl: config?.apiBaseUrl || "NOT SET",
  accountsIsArray: Array.isArray(myAccountsStore.accounts),
  accountsType: typeof myAccountsStore.accounts,
}));

console.log("Debug Info:", debugInfo.value);
console.log("User:", user);
console.log("Config:", config);
console.log("Raw Store:", myAccountsStore);
</script>

<style scoped>
.header-accounts {
  margin-right: 1rem;
}
</style>
```

This will show you:

1. The exact value of `myAccountsStore.accounts`
2. Whether the condition `loading || !accounts` is true or false
3. A manual dropdown to test if the accounts data is usable
4. The raw store object

Run this and tell me what you see in the red bordered section!
