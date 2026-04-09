# @prefabs.tech/saas-vue

SaaS plugin for Vue that provides account switching/state, SaaS route helpers, and ready-made views/components for multi-tenant apps.

## Why This Package?

Multi-tenant SaaS apps tend to re-implement the same plumbing: “active account” state, per-account API headers, invitation flows, and separate admin vs app routing. This package bundles those pieces into a single Vue plugin + composables/components so you can standardize behavior across apps.

## What You Get

### axios — Modified

Wraps [`axios`](https://www.npmjs.com/package/axios) with a constrained client factory:

- **Base URL**: taken from your SaaS config (`apiBaseUrl`)
- **Headers**: always sets JSON content type for POST and injects `x-account-id` from `sessionStorage`

### vue-router — Partial passthrough

Uses [`vue-router`](https://router.vuejs.org/) route records, but provides opinionated route helpers:

- **Default routes**: prebuilt admin/app route sets (`getSaasAdminRoutes`, `getSaasAppRoutes`)
- **Overrides**: you can override `component`, `path`, `meta`, and/or mark routes as `disabled`
- **Convenience**: `addSaasAdminRoutes(router, ...)` and `addSaasAppRoutes(router, ...)`

### Added by This Package

- **Vue plugin** that `provide`s:
  - SaaS config (`Symbol.for("saas.config")`)
  - translations (`Symbol.for("saas.vue.translations")`)
  - event handlers (`Symbol.for("saas.eventHandlers")`)
  - account tab customization (`Symbol.for("saas.accountTabs")`)
- **Account state** via Pinia:
  - `useMyAccountsStore()` store + `useMyAccounts()` composable
  - active account selection (subdomain-based vs main app) + persistence via `x-account-id`
- **UI building blocks**:
  - `SaasWrapper`, `SaasAccountsProvider`, `ConfigProvider`, `AccountSwitcher`, `NotFoundMessage`
- **Views**:
  - `AccountSettings`, `MyAccounts`
- **Signup flow**:
  - account vs user signup pages and optional redirect to `{slug}.{rootDomain}` after signup

## Usage Guidelines

- **You must install the plugin (or provide `saas.config`) before using most components/composables**.
  - `SaasWrapper` throws if `Symbol.for("saas.config")` is missing.
  - `useMyAccounts()` will throw if it cannot resolve config from a parameter, injection, or the store.
- **Account switching reloads the page by default**.
  - `AccountSwitcher` calls `window.location.reload()` after switching accounts.
- **Be aware of the “account not found” global error latch**.
  - `useGlobalAccountError()` sets a global flag only for a 404 response with message `"Account not found"`, which `SaasWrapper` uses to show the not-found UI.

## Requirements

At minimum, you’ll need:

- **Vue**: `vue` (3.x)
- **Routing**: `vue-router` (4.x)
- **State**: `pinia`
- **HTTP**: `axios`
- **Prefabs peer packages**:
  - `@prefabs.tech/vue3-config`
  - `@prefabs.tech/vue3-i18n`
  - `@prefabs.tech/vue3-layout`
  - `@prefabs.tech/vue3-ui`
  - `@prefabs.tech/vue3-user`

## Quick Start

```ts
import { createApp } from "vue";
import { createPinia } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import SaasVue from "@prefabs.tech/saas-vue";
import { addSaasAppRoutes } from "@prefabs.tech/saas-vue";

const app = createApp(App);
const pinia = createPinia();
const router = createRouter({ history: createWebHistory(), routes: [] });

app.use(pinia);
app.use(router);

app.use(SaasVue, {
  pinia,
  router,
  config: {} as any, // your @prefabs.tech/vue3-config AppConfig
  saasConfig: {
    apiBaseUrl: "https://api.example.com",
    entity: "both",
    mainAppSubdomain: "app",
    multiDatabase: false,
    rootDomain: "example.com",
    subdomains: "required",
  },
});

addSaasAppRoutes(router);
app.mount("#app");
```

## Installation

Install with npm:

```bash
npm install @prefabs.tech/saas-vue
```

Install with pnpm:

```bash
pnpm add @prefabs.tech/saas-vue
```
