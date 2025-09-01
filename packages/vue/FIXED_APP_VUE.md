# Fixed App.vue Implementation

Since you're already passing `saasConfig` through the plugin in `main.ts`, you just need to use `SaasWrapper` with the `userId`. The config will be automatically injected!

## Updated App.vue:

```vue
<template>
  <SaasWrapper :user-id="userId">
    <Layout :default-layout="defaultLayout">
      <template #userMenuTrigger>
        {{ $t("app.header.menu.userMenuTrigger") }}
      </template>

      <!-- Add accounts dropdown to header actions or user menu -->
      <template #headerActions>
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
import { BasicLayout } from "@prefabs.tech/vue3-user";
import { SaasWrapper, AccountSwitcher } from "@prefabs.tech/saas-vue";
import { computed, ref } from "vue";

import type { Account } from "@prefabs.tech/saas-vue";

// import { useAuthStore } from "@/stores/auth";

const defaultLayout = computed(() => {
  return BasicLayout;
});

// Get user ID from your authentication system
const userId = ref<string | undefined>();

// TODO: Replace this with your actual user ID retrieval
// Examples:
// const authStore = useAuthStore();
// const userId = computed(() => authStore.user?.id);
// OR
// const { user } = useYourAuth();
// const userId = computed(() => user.value?.id);

// For testing, you can hardcode it:
// userId.value = "your-user-id-here";

const handleAccountSwitch = (account?: Account) => {
  console.log("Account switched to:", account?.name);
  // Optional: Add any account switching logic here
  // For example: refresh data, emit events, redirect, etc.
};
</script>

<style scoped>
.header-accounts {
  margin-right: 1rem;
}
</style>
```

## Updated main.ts saasConfig:

You need to add the missing required fields to your `saasConfig` in `main.ts`:

```typescript
app.use(saasVuePlugin, {
  config,
  saasConfig: {
    // ✅ Add these required fields:
    apiBaseUrl: "https://your-api-domain.com", // Your API URL
    mainAppSubdomain: "app", // Your main app subdomain
    rootDomain: "your-domain.com", // Your root domain

    // ✅ Your existing config:
    subdomains: "optional",
    multiDatabase: true,
    entity: "both",
    accounts: {
      autoSelectAccount: true,
      allowMultipleSessions: true,
    },
  },
  notification: (data: any) => {
    notify({
      title: data.type,
      text: data.message,
    });
  },
  router,
  translations: config.i18n.messages,
});
```

## Key Changes:

1. **No config prop needed**: `SaasWrapper` automatically gets config from plugin injection
2. **Only pass userId**: The only prop needed is the user ID
3. **Complete saasConfig**: Add the missing required fields to your plugin config

## What You Need to Update:

1. **Your main.ts**: Add `apiBaseUrl`, `mainAppSubdomain`, and `rootDomain` to your `saasConfig`
2. **Your App.vue**: Use the simplified version above (no config prop needed)
3. **User ID**: Set the actual user ID from your authentication system

## Testing:

After making these changes, the accounts dropdown should automatically appear when:

- User is logged in (userId is set)
- User has multiple accounts
- You're in a user app (not admin app)
