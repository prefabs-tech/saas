<!-- Developer guide — comprehensive usage documentation for humans. -->

# @prefabs.tech/saas-react — Developer Guide

## Installation

### For package consumers

```bash
npm install @prefabs.tech/saas-react
```

```bash
pnpm add @prefabs.tech/saas-react
```

### For monorepo development

```bash
pnpm install
pnpm --filter @prefabs.tech/saas-react test
pnpm --filter @prefabs.tech/saas-react build
```

## Setup

This is the only “full setup” example. All later snippets assume this wrapper is in place.

```typescript
import { ToastContainer } from "react-toastify";
import { SaasWrapper } from "@prefabs.tech/saas-react";

import type { SaasConfig } from "@prefabs.tech/saas-react";

const saas: SaasConfig = {
  apiBaseUrl: "https://api.example.com",
  entity: "both",
  multiDatabase: false,
  rootDomain: "example.com",
  subdomains: "required",
  mainApp: { subdomain: "app" },
};

export function App() {
  return (
    <SaasWrapper config={saas}>
      <AppRouter />
      <ToastContainer position="top-center" />
    </SaasWrapper>
  );
}
```

---

## Base Libraries

### axios — Modified

HTTP calls use a constrained axios client created via an internal `client(apiBaseUrl)`.

-> **Their docs:** [axios](https://www.npmjs.com/package/axios)

**What’s different here:**

- `baseURL` is taken from your `SaasConfig.apiBaseUrl`
- `x-account-id` is injected from storage
- POST JSON header defaults are set

**What we add on top:**

- account switching/persistence in `AccountsProvider` that controls the `x-account-id` header

---

## Features

### 1) Provide config (`ConfigProvider` / `useConfig`)

`useConfig()` reads config from context and throws if it is missing. In most apps, prefer `SaasWrapper`, which wraps your tree with `ConfigProvider`.

```typescript
import { ConfigProvider, useConfig } from "@prefabs.tech/saas-react";

function Child() {
  const config = useConfig();
  return null;
}

function Root({ saas }: { saas: any }) {
  return (
    <ConfigProvider config={saas}>
      <Child />
    </ConfigProvider>
  );
}
```

### 2) Provide accounts (`AccountsProvider` / `useAccounts`)

`AccountsProvider` stores the user’s accounts list, active account, and switching/persistence behavior for `x-account-id`.

```typescript
import { AccountsProvider, useAccounts } from "@prefabs.tech/saas-react";

function AccountName() {
  const { activeAccount } = useAccounts();
  return <span>{activeAccount?.name}</span>;
}

function Root({ saas, userId }: { saas: any; userId?: string }) {
  return (
    <AccountsProvider config={saas} userId={userId}>
      <AccountName />
    </AccountsProvider>
  );
}
```

### 3) Use `SaasWrapper` for app gating

`SaasWrapper` runs the domain registration check, renders loading/error UI when needed, normalizes config defaults, and conditionally installs `AccountsProvider` (non-admin apps only).

```typescript
import { SaasWrapper } from "@prefabs.tech/saas-react";

void SaasWrapper;
```

### 4) Generate routes (React Router)

The package exposes helpers that return `<Route />` elements for the built-in pages.

```typescript
import { getSaasAdminRoutes, getSaasAppRoutes } from "@prefabs.tech/saas-react/routes";

const adminRoutes = getSaasAdminRoutes("authenticated");
const appRoutes = getSaasAppRoutes("authenticated");
```

You can override elements and disable routes via the `options` argument.

```typescript
import { getSaasAppRoutes } from "@prefabs.tech/saas-react/routes";

const routes = getSaasAppRoutes("unauthenticated", {
  routes: {
    signup: { disabled: true },
  },
});

void routes;
```

### 5) Call the API (thin axios helpers)

```typescript
import { doesAccountExist, getMyAccounts, signup } from "@prefabs.tech/saas-react/api";

await doesAccountExist({ apiBaseUrl: "https://api.example.com" });
await getMyAccounts({ apiBaseUrl: "https://api.example.com" });
await signup({
  apiBaseUrl: "https://api.example.com",
  path: "/auth/signup",
  data: { email: "a@b.com", password: "Password1", confirmPassword: "Password1" } as any,
  accountSignup: false,
});
```

### 6) Use query/mutation hooks

`useQuery` auto-runs by default unless `lazy` or `skip` is set; `useMutation` exposes an imperative trigger.

```typescript
import { useQuery, useMutation } from "@prefabs.tech/saas-react/api";

function Example() {
  const { data, loading, error, trigger } = useQuery<{ ok: boolean }>(
    "my-account",
    {},
    { lazy: true },
  );

  const mutation = useMutation<{ ok: boolean }, { name: string }>({
    method: "POST",
  });

  return null;
}
```

### 7) Use the exported components/pages

```typescript
import {
  AccountSwitcher,
  AccountsTable,
  MyAccounts,
  AccountForm,
  AccountInvitationForm,
  AccountUsersTable,
  AccountSignupForm,
  UserSignupForm,
} from "@prefabs.tech/saas-react";

void AccountSwitcher;
void AccountsTable;
void MyAccounts;
void AccountForm;
void AccountInvitationForm;
void AccountUsersTable;
void AccountSignupForm;
void UserSignupForm;
```

---

## Use Cases

### Use case 1: Main app vs tenant app behavior

```typescript
import { useAccounts } from "@prefabs.tech/saas-react";

function TenantAware() {
  const {
    meta: { isMainApp, subdomain },
  } = useAccounts();

  if (!isMainApp) {
    void subdomain;
  }

  return null;
}
```

### Use case 2: Persist the active account across sessions

```typescript
import type { SaasConfig } from "@prefabs.tech/saas-react";

const saas: SaasConfig = {
  apiBaseUrl: "https://api.example.com",
  entity: "both",
  multiDatabase: false,
  rootDomain: "example.com",
  subdomains: "required",
  accounts: {
    allowMultipleSessions: true,
    autoSelectAccount: true,
  },
};

void saas;
```

### Use case 3: Disable built-in signup routes (SSO-only apps)

```typescript
import { getSaasAppRoutes } from "@prefabs.tech/saas-react/routes";

const routes = getSaasAppRoutes("unauthenticated", {
  routes: {
    signup: { disabled: true },
    invitationSignup: { disabled: true },
  },
});

void routes;
```

