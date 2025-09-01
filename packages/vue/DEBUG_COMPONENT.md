# Debug Component

Add this temporary debug component to your App.vue to see what's happening:

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

        <div class="header-accounts">
          <AccountSwitcher @switch="handleAccountSwitch" />
        </div>
      </template>

      <router-view />
    </Layout>
  </SaasWrapper>
  <notifications />
</template>

<script setup lang="ts">
import {
  SaasWrapper,
  AccountSwitcher,
  useMyAccountsStore,
} from "@prefabs.tech/saas-vue";
import { BasicLayout, userStore } from "@prefabs.tech/vue3-user";
import { computed, inject } from "vue";

import type { Account, SaasConfig } from "@prefabs.tech/saas-vue";

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

const handleAccountSwitch = (account?: Account) => {
  console.log("Account switched to:", account?.name);
};
</script>

<style scoped>
.header-accounts {
  margin-right: 1rem;
}
</style>
```

This will show you:

1. If the user ID is being passed correctly
2. If the config is being injected properly
3. If the accounts are loading
4. If there are any errors
5. The API base URL being used

**Also check your browser's Network tab** to see if the `/my-accounts` API call is being made and what response it's getting.
