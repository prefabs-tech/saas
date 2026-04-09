# @prefabs.tech/saas-react

SaaS building blocks for React: account state/context, route helpers, and ready-made components/pages for multi-tenant apps.

## Why This Package?

Multi-tenant SaaS apps tend to rebuild the same pieces: “active account” state, API header wiring, admin vs app routing, and invitation/signup flows. This package provides a consistent contract (contexts + hooks + routes + components) so apps can share the same tenant behavior with less glue code.

## What You Get

### axios — Modified

Wraps [`axios`](https://www.npmjs.com/package/axios) behind a constrained client factory:

- **Base URL**: set from your SaaS config (`apiBaseUrl`)
- **Headers**: sets JSON content type for POST and injects `x-account-id` from storage

### Added by This Package

- **Contexts/providers**
  - `ConfigProvider` + `useConfig()` for accessing `SaasConfig`
  - `AccountsProvider` + `useAccounts()` for accounts list + active account + switching
- **Route helpers** for `react-router-dom`
  - `getSaasAdminRoutes(...)`
  - `getSaasAppRoutes(...)`
- **API utilities & hooks**
  - `useQuery(...)` and `useMutation(...)` wrappers with default behaviors
- **UI components & pages** for common SaaS flows
  - account management (forms/tables)
  - invitations (invite/join/accept)
  - signup (account signup vs user signup)

## Usage Guidelines

- **Always render `SaasWrapper` (or at minimum `ConfigProvider`) above any hooks/components that need config.**
  - `useConfig()` throws if `ConfigProvider` is missing.
- **Render `AccountsProvider` (or use `SaasWrapper` in non-admin apps) above anything that calls `useAccounts()`.**
  - `useAccounts()` throws if `AccountsProvider` is missing.
- **Be intentional about account persistence behavior.**
  - Account switching writes/removes `x-account-id` in `localStorage` and optionally `sessionStorage` (when `allowMultipleSessions` is enabled).

## Requirements

- **React**: `react`, `react-dom`
- **Routing**: `react-router-dom`
- **UI dependencies consumed by components**:
  - `@prefabs.tech/react-ui`, `@prefabs.tech/react-form`, `@prefabs.tech/react-i18n`
  - `react-toastify`
  - `primereact`

## Quick Start

```ts
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
      <Routes>{/* your routes */}</Routes>
      <ToastContainer position="top-center" />
    </SaasWrapper>
  );
}
```

## Installation

Install with npm:

```bash
npm install @prefabs.tech/saas-react
```

Install with pnpm:

```bash
pnpm add @prefabs.tech/saas-react
```

## Testing

From the monorepo root:

```bash
pnpm test --filter @prefabs.tech/saas-react
```

From this package folder:

```bash
pnpm test
pnpm test:unit
```
