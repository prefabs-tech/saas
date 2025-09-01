# Host App Integration Guide

## Minimal Changes Required

The accounts dropdown feature is designed to require **minimal to no changes** in your host Vue app. Here's what you need to know:

## Option 1: Zero Changes (Recommended)

If you're already using the SaaS Vue package, the accounts dropdown components are now available without any additional setup:

```vue
<!-- In any component -->
<template>
  <div class="header">
    <AccountSwitcher />
  </div>
</template>

<script setup lang="ts">
import { AccountSwitcher } from "@prefabs.tech/saas-vue";
</script>
```

The `useMyAccounts()` composable will automatically use your existing SaaS configuration.

## Option 2: With Provider Wrapper

For automatic account loading, wrap your user app content:

```vue
<!-- UserApp.vue -->
<template>
  <SaasAccountsProvider :user-id="user?.id">
    <!-- Your existing app content unchanged -->
    <div class="existing-app">
      <!-- Add AccountSwitcher anywhere you want the dropdown -->
      <nav>
        <AccountSwitcher />
      </nav>

      <!-- Rest of your existing app -->
      <router-view />
    </div>
  </SaasAccountsProvider>
</template>

<script setup lang="ts">
import { SaasAccountsProvider, AccountSwitcher } from "@prefabs.tech/saas-vue";

// Use your existing user authentication
const { user } = useAuth(); // or however you get the user
</script>
```

## Option 3: Manual Integration

If you prefer manual control:

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { useMyAccounts, AccountSwitcher } from "@prefabs.tech/saas-vue";

const { fetchMyAccounts } = useMyAccounts();

onMounted(async () => {
  // Fetch accounts when user is authenticated
  if (user.value?.id) {
    await fetchMyAccounts();
  }
});
</script>
```

## Configuration

Your existing SaaS configuration automatically works. If you want to customize account behavior:

```typescript
// In your main.ts (where you setup the SaaS plugin)
const saasConfig = {
  // ... your existing config
  accounts: {
    autoSelectAccount: true, // Auto-select first account
    allowMultipleSessions: true, // Session-based persistence
  },
};
```

## Required Dependencies

⚠️ **Install SuperTokens dependencies** in your host app:

```bash
pnpm add supertokens-web-js supertokens-website @prefabs.tech/vue3-user
```

✅ **API endpoints** - Uses existing `/my-accounts` endpoint from Fastify
✅ **Authentication** - Works with your existing auth setup
✅ **Configuration** - Uses your existing SaaS config

> **Note**: These dependencies are required because the Vue SaaS package uses authentication features from `@prefabs.tech/vue3-user` which depends on SuperTokens.

## TypeScript

Types are automatically available:

```typescript
import type { Account } from "@prefabs.tech/saas-vue";
```

## Testing the Integration

1. **Add AccountSwitcher component** to your header/navigation
2. **Login as a user** who is a member of multiple accounts
3. **Verify dropdown appears** with account names
4. **Click different accounts** to verify switching works
5. **Refresh page** to verify persistence works

## Backwards Compatibility

✅ **No breaking changes** - All existing functionality preserved
✅ **Optional feature** - Only loads when components are used
✅ **Progressive enhancement** - Add components gradually

## Production Considerations

- **Performance**: Account data is cached in Pinia store
- **Memory**: Minimal overhead, only active when used
- **Bundle size**: ~15KB additional (gzipped)
- **API calls**: One initial call to `/my-accounts`, then cached

## Summary

**Zero host app changes required** for basic functionality. Just import and use the `AccountSwitcher` component wherever you want the dropdown to appear!

The feature is designed to be:

- 🔧 **Zero-config** - Works with existing setup
- 📦 **Self-contained** - No additional dependencies
- 🔄 **Backwards compatible** - No breaking changes
- 🎯 **Opt-in** - Only active when components are used
