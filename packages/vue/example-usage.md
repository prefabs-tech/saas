# Vue Accounts Dropdown - Usage Examples

## Overview

The Vue SaaS package now includes an accounts dropdown feature that matches the React implementation exactly. This allows users to switch between different accounts they are members of.

## Core Components

### 1. AccountSwitcher Component

The main dropdown component for account switching:

```vue
<template>
  <div class="header">
    <AccountSwitcher
      :empty-label="'Choose Account'"
      :no-helper-text="false"
      @switch="onAccountSwitch"
    />
  </div>
</template>

<script setup lang="ts">
import { AccountSwitcher } from "@prefabs.tech/saas-vue";
import type { Account } from "@prefabs.tech/saas-vue";

const onAccountSwitch = (account?: Account) => {
  console.log("Switched to account:", account?.name);
  // Handle account switch (e.g., refresh data, redirect, etc.)
};
</script>
```

### 2. SaasAccountsProvider Component

Wrapper component that automatically loads user accounts:

```vue
<template>
  <SaasAccountsProvider :user-id="userId">
    <!-- Your app content -->
    <div class="app-content">
      <AccountSwitcher />
      <!-- Rest of your app -->
    </div>
  </SaasAccountsProvider>
</template>

<script setup lang="ts">
import { SaasAccountsProvider, AccountSwitcher } from "@prefabs.tech/saas-vue";

const userId = "user-123"; // Get from authentication
</script>
```

## Store Integration

### Using the Composable

```vue
<script setup lang="ts">
import { useMyAccounts } from "@prefabs.tech/saas-vue";

const accountsStore = useMyAccounts();
const {
  accounts, // Array of user's accounts
  activeAccount, // Currently selected account
  loading, // Loading state
  error, // Error state
  switchAccount, // Function to switch accounts
  fetchMyAccounts, // Function to refetch accounts
} = accountsStore;

// Manually fetch accounts
const refetchAccounts = async () => {
  try {
    await fetchMyAccounts();
  } catch (error) {
    console.error("Failed to fetch accounts:", error);
  }
};

// Switch to specific account
const selectAccount = (account) => {
  switchAccount(account);
};
</script>
```

### Direct Store Usage

```vue
<script setup lang="ts">
import { useMyAccountsStore } from "@prefabs.tech/saas-vue";

const myAccountsStore = useMyAccountsStore();

// Set configuration (usually done automatically)
myAccountsStore.setConfig({
  apiBaseUrl: "https://api.example.com",
  mainAppSubdomain: "app",
  rootDomain: "example.com",
  accounts: {
    autoSelectAccount: true,
    allowMultipleSessions: true,
  },
});

// Fetch accounts
await myAccountsStore.fetchMyAccounts();
</script>
```

## Complete Integration Example

```vue
<!-- UserApp.vue -->
<template>
  <div class="user-app">
    <!-- Navigation with account switcher -->
    <nav class="navbar">
      <div class="nav-brand">My App</div>
      <div class="nav-account">
        <AccountSwitcher @switch="handleAccountSwitch" />
      </div>
    </nav>

    <!-- Main content -->
    <SaasAccountsProvider :user-id="user?.id">
      <main class="main-content">
        <h1>Welcome to {{ activeAccount?.name || "Your Account" }}</h1>

        <!-- Account-specific content -->
        <div v-if="activeAccount">
          <p>Account ID: {{ activeAccount.id }}</p>
          <p>
            Account Type:
            {{ activeAccount.individual ? "Individual" : "Organization" }}
          </p>
        </div>

        <!-- Loading state -->
        <div v-else-if="loading">Loading accounts...</div>

        <!-- No accounts state -->
        <div v-else>No accounts available.</div>
      </main>
    </SaasAccountsProvider>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  AccountSwitcher,
  SaasAccountsProvider,
  useMyAccounts,
} from "@prefabs.tech/saas-vue";
import type { Account } from "@prefabs.tech/saas-vue";

// Get user from authentication (e.g., from vue3-user package)
const user = { id: "user-123" }; // Replace with actual user

const { activeAccount, loading } = useMyAccounts();

const handleAccountSwitch = (account?: Account) => {
  console.log("Account switched:", account);

  // Optional: Reload page data for the new account
  // Or emit an event to parent components
  // Or trigger any account-specific logic
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.main-content {
  padding: 2rem;
}
</style>
```

## Configuration

The accounts dropdown respects the SaaS configuration:

```typescript
// In your main.ts or plugin setup
const saasConfig = {
  apiBaseUrl: "https://api.example.com",
  mainAppSubdomain: "app",
  rootDomain: "example.com",
  accounts: {
    autoSelectAccount: true, // Automatically select first account
    allowMultipleSessions: true, // Use sessionStorage for persistence
  },
};
```

## Features Included

✅ **Auto-loading**: Automatically fetches user accounts when userId is provided
✅ **Auto-selection**: Automatically selects first account if `autoSelectAccount: true`
✅ **Persistence**: Stores selected account in localStorage (and sessionStorage if `allowMultipleSessions: true`)
✅ **Loading states**: Shows loading spinner while fetching accounts
✅ **Error handling**: Gracefully handles API errors
✅ **Internationalization**: Supports English and French translations
✅ **TypeScript**: Full TypeScript support with proper types
✅ **Reactivity**: Fully reactive with Vue 3 Composition API
✅ **Pinia Integration**: Uses Pinia for state management

## API Endpoints Used

- `GET /my-accounts` - Fetches accounts the user is a member of
- `GET /my-account` - Fetches current account details
- `PUT /my-account` - Updates current account

## Comparison with React Implementation

| Feature                   | React | Vue | Status         |
| ------------------------- | ----- | --- | -------------- |
| AccountSwitcher Component | ✅    | ✅  | ✅ Implemented |
| Accounts Provider         | ✅    | ✅  | ✅ Implemented |
| Auto-loading accounts     | ✅    | ✅  | ✅ Implemented |
| Auto-selection            | ✅    | ✅  | ✅ Implemented |
| localStorage persistence  | ✅    | ✅  | ✅ Implemented |
| sessionStorage support    | ✅    | ✅  | ✅ Implemented |
| Loading states            | ✅    | ✅  | ✅ Implemented |
| Error handling            | ✅    | ✅  | ✅ Implemented |
| TypeScript support        | ✅    | ✅  | ✅ Implemented |
| I18n support              | ✅    | ✅  | ✅ Implemented |

The Vue implementation has **complete feature parity** with the React version!
