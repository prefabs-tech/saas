<!-- Developer guide — comprehensive usage documentation for humans. -->

# @prefabs.tech/saas-vue — Developer Guide

## Installation

### For package consumers

```bash
npm install @prefabs.tech/saas-vue
```

```bash
pnpm add @prefabs.tech/saas-vue
```

### For monorepo development

```bash
pnpm install
pnpm --filter @prefabs.tech/saas-vue typecheck
pnpm --filter @prefabs.tech/saas-vue build
```

## Setup

This is the only “full setup” example. All later snippets assume the plugin is installed and you have a router + pinia.

```typescript
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import SaasVue, { addSaasAppRoutes, addSaasAdminRoutes } from "@prefabs.tech/saas-vue";

const app = createApp(App);
const pinia = createPinia();
const router = createRouter({ history: createWebHistory(), routes: [] });

app.use(pinia);
app.use(router);

app.use(SaasVue, {
  pinia,
  router,
  config: {} as any, // AppConfig from @prefabs.tech/vue3-config
  saasConfig: {
    apiBaseUrl: "https://api.example.com",
    entity: "both",
    mainAppSubdomain: "app",
    multiDatabase: false,
    rootDomain: "example.com",
    subdomains: "required",
  },
});

addSaasAppRoutes(router, "authenticated");
addSaasAdminRoutes(router, "authenticated");

app.mount("#app");
```

---

## Base Libraries

### axios — Modified

HTTP calls are made via an internal `client(baseURL)` that creates an axios instance with opinionated defaults.

-> **Their docs:** [axios](https://www.npmjs.com/package/axios)

**What’s different here:**

- **`baseURL`** comes from your SaaS config (`apiBaseUrl`)
- **`x-account-id`** is injected from `sessionStorage` (or `""`)
- **POST JSON header** is set by default

**What we add on top:**

- account switching/persistence that drives the `x-account-id` header

### vue-router — Partial passthrough

Routes are expressed as normal `RouteRecordRaw`s, but the package provides prebuilt route sets and helpers.

-> **Their docs:** [vue-router](https://router.vuejs.org/)

**What we change/add:**

- prebuilt SaaS route sets (admin/app; authenticated/unauthenticated/public)
- override merging (including `meta` merge)
- `disabled` filtering
- helpers to add routes to a router

---

## Features

### 1) Install the SaaS plugin

The default export is a Vue plugin. Installing it prepares your SaaS config (merging UI defaults) and `provide`s it and other values via `Symbol.for(...)` keys.

```typescript
import SaasVue from "@prefabs.tech/saas-vue";

app.use(SaasVue, {
  pinia,
  router,
  config: {} as any,
  saasConfig: {
    apiBaseUrl: "https://api.example.com",
    entity: "both",
    mainAppSubdomain: "app",
    multiDatabase: false,
    rootDomain: "example.com",
    subdomains: "required",
  },
});
```

### 2) Add routes (admin + app)

You can either **get** route records or **add** them directly to a router instance.

```typescript
import { addSaasAdminRoutes, addSaasAppRoutes } from "@prefabs.tech/saas-vue";

addSaasAdminRoutes(router, "authenticated");
addSaasAppRoutes(router, "authenticated");
```

To customize routes, pass overrides under `options.routes` and/or set `disabled: true`.

```typescript
import { getSaasAppRoutes } from "@prefabs.tech/saas-vue";

const appRoutes = getSaasAppRoutes("unauthenticated", {
  routes: {
    signup: { disabled: true },
    invitationSignup: { meta: { marketingCampaign: "spring" } },
  },
});
```

### 3) Use account state (Pinia store)

Account state lives in a Pinia store exported as `useMyAccountsStore()`.

```typescript
import { useMyAccountsStore } from "@prefabs.tech/saas-vue";

const store = useMyAccountsStore();
store.switchAccount(null);
```

### 4) Resolve config + initialize the store (`useMyAccounts`)

`useMyAccounts(config?)` resolves config from parameter → injection → store initialization.

```typescript
import { useMyAccounts } from "@prefabs.tech/saas-vue";

const store = useMyAccounts();
```

### 5) Handle the “account not found” case globally

`useGlobalAccountError()` flips a global reactive flag only for the specific error condition \(404 + `"Account not found"`\).

```typescript
import { useGlobalAccountError } from "@prefabs.tech/saas-vue";

const { showAccountError, clearError } = useGlobalAccountError();

if (showAccountError.value) {
  clearError();
}
```

### 6) Use the wrapper/provider components

```typescript
import { SaasWrapper } from "@prefabs.tech/saas-vue";

void SaasWrapper;
```

### 7) Customize tabs in `AccountSettings`

`AccountSettings` merges default tabs with `accountTabs` provided during plugin install (function or array).

```typescript
app.use(SaasVue, {
  // ...
  accountTabs: (defaultTabs) => [
    ...defaultTabs,
    {
      key: "billing",
      label: "Billing",
      component: {} as any,
    },
  ],
});
```

### 8) Customize translations

If you pass `translations` to the plugin, they are prepended to the built-in `en`/`fr` messages.

```typescript
app.use(SaasVue, {
  // ...
  translations: {
    en: { accounts: { error: { title: "Custom error title" } } } as any,
  },
});
```

### 9) Admin/app detection utility

`checkIsAdminApp()` returns true when the current subdomain is `"admin"`.

```typescript
import { checkIsAdminApp } from "@prefabs.tech/saas-vue";

const isAdmin = checkIsAdminApp();
void isAdmin;
```

---

## Use Cases

### Use case 1: “Main app” vs tenant app behavior

```typescript
import { useMyAccounts } from "@prefabs.tech/saas-vue";

const store = useMyAccounts();

if (store.meta.isMainApp) {
  // main app behavior
} else {
  // tenant app behavior
}
```

### Use case 2: Disable built-in signup routes for SSO-only apps

```typescript
import { addSaasAppRoutes } from "@prefabs.tech/saas-vue";

addSaasAppRoutes(router, "unauthenticated", {
  routes: {
    signup: { disabled: true },
    invitationSignup: { disabled: true },
  },
});
```

### Use case 3: Show toast notifications on signup failure

```typescript
app.use(SaasVue, {
  // ...
  notification: ({ type, message }) => {
    console.log(`[${type}] ${message}`);
  },
});
```

