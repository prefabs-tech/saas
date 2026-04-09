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
- `x-account-id` is injected from storage (and drives tenant scoping on the backend)
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

`AccountsProvider` stores:

- the user’s accounts list
- an active account
- loading/error flags
- switching/persistence behavior for `x-account-id`

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

`SaasWrapper`:

- calls `doesAccountExist` on mount (domain registration check)
- shows loading / error UI for 404 and generic errors
- normalizes config defaults via `prepareConfig`
- wraps children with `ConfigProvider`
- wraps children with `AccountsProvider` only when not in the admin app

```typescript
import { SaasWrapper } from "@prefabs.tech/saas-react";

// <SaasWrapper config={saas} userId={user?.id}>{children}</SaasWrapper>
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
```

### 5) Call the API (thin axios helpers)

The package includes a minimal API surface for account management and signup.

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

### 7) Use the exported components

For common SaaS UI, the package exports ready-made components:

- account switching: `AccountSwitcher`
- account forms: `AccountForm`
- account lists/tables: `MyAccounts`, `AccountsTable`
- invitations: `AccountInvitationForm`, `AccountInvitationsTable`, `AccountInvitationModal`
- users: `AccountUsersTable`
- signup: `AccountSignupForm`, `UserSignupForm`

```typescript
import { AccountSwitcher, MyAccounts } from "@prefabs.tech/saas-react";

void AccountSwitcher;
void MyAccounts;
```

---

## Use Cases

### Use case 1: Main app vs tenant app behavior (subdomain-based)

Account selection behaves differently when you’re on the main app domain vs a tenant subdomain.

```typescript
import { useAccounts } from "@prefabs.tech/saas-react";

function TenantAware() {
  const {
    meta: { isMainApp, subdomain },
  } = useAccounts();

  if (!isMainApp) {
    // tenant app behavior based on subdomain
    void subdomain;
  }

  return null;
}
```

### Use case 2: Persist the active account across sessions

Switching accounts persists `x-account-id` in storage; enable/disable multi-session behavior via `accounts.allowMultipleSessions`.

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

If your app uses an external auth/signup flow, you can omit SaaS signup routes.

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

