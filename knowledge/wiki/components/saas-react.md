---
type: Component
title: "@prefabs.tech/saas-react"
description: React library of SaaS screens, route helpers, data hooks and account context that talks to saas-fastify — its exports, how an app wires it in, and its build and test setup.
tags: [component, react, frontend, npm-package]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: pkg
    resource: repo://packages/react/package.json#L1-L80
    title: saas-react package.json
    last_modified: 2026-07-29
  - id: index
    resource: repo://packages/react/src/index.ts#L1-L59
    title: saas-react exports
    last_modified: 2026-05-04
  - id: readme
    resource: repo://packages/react/README.md#L19-L313
    title: saas-react README
    last_modified: 2025-10-10
  - id: wrapper
    resource: repo://packages/react/src/SaasWrapper.tsx#L19-L81
    title: SaasWrapper
    last_modified: 2026-05-04
  - id: use-mutation
    resource: repo://packages/react/src/api/common/UseMutation.ts#L23-L65
    title: useMutation
    last_modified: 2026-05-04
  - id: use-query
    resource: repo://packages/react/src/api/common/UseQuery.ts#L16-L64
    title: useQuery
    last_modified: 2026-05-04
  - id: app-routes
    resource: repo://packages/react/src/routes/GetSaasAppRoutes.tsx#L20-L103
    title: getSaasAppRoutes
    last_modified: 2026-05-04
  - id: vitest
    resource: repo://packages/react/vitest.config.ts#L7-L22
    title: vitest config
    last_modified: 2024-12-09
  - id: vite
    resource: repo://packages/react/vite.config.ts#L12-L49
    title: Library build config
    last_modified: 2026-05-04
---

# @prefabs.tech/saas-react

## Responsibility

It provides the React side of the SaaS feature set:

- deciding admin, main, or tenant app, and the active account ([frontend account context](../architecture/frontend-account-context.md))
- sign-up, account, invitation, and user-management screens
- route helpers for `react-router-dom`
- one data hook per saas-fastify endpoint

It owns no server state beyond what the API returns. The design system, forms, i18n, and app config come from `@prefabs.tech/react-*` peers.[^pkg]

## How an app wires it in

1. Wrap the app: `<SaasWrapper userId={user?.id} config={config.saas}>…</SaasWrapper>`.[^readme][^wrapper] It probes `GET /`, then provides `ConfigProvider`, plus `AccountsProvider` outside the admin app.[^wrapper]
2. Add routes: `getSaasAppRoutes(type, options)` in the main app, `getSaasAdminRoutes(type, options)` in the admin app.[^readme] `getSaasAppRoutes` renders a component that calls `useAccounts()`, so it must be rendered inside `SaasWrapper`/`AccountsProvider`.[^app-routes] See [SaaS routes and screens](../ui/saas-routes-and-screens.md).
3. Register the `account` and `accounts` i18n namespaces (en, fr) and import the CSS from `@prefabs.tech/saas-react/dist/PrefabsTechSaasReact.css`.[^readme][^pkg]

The README's example imports the route helpers from `@prefabs.tech/saas-react/routes`. The `exports` map only declares `.` and the CSS path; the helpers are exported from the package root.[^readme][^pkg][^index]

## Exports

| Group | Items |
| --- | --- |
| Wrapper and contexts | `SaasWrapper`, `AccountsProvider`, `accountsContext`[^index] |
| Hooks | `useAccounts`, `useConfig`; account, invitation, and user query/mutation hooks[^index] |
| Low-level API | `client(baseURL)`, `useQuery`, `useMutation`, `doesAccountExist`, `getMyAccounts`, `signup`[^index] |
| Components | `AccountSwitcher`, `AccountForm`, `AccountInfo`, `AccountInvitationForm`/`Modal`/`sTable`, `AccountSignupForm`, `UserSignupForm`, `AccountUsersTable`, `AccountsTable`, `MyAccounts`[^index] |
| Pages | `AcceptInvitationPage`, `JoinInvitationPage`, `SignupInvitationPage`, `AccountAddPage`, `AccountEditPage`, `AccountSettingsPage`, `AccountViewPage`, `MyAccountsPage`, `SignupPage`[^readme] |
| Routes, constants, types, utils | `getSaasAppRoutes`, `getSaasAdminRoutes`, `DEFAULT_PATHS`, `SaasConfig`, … [^index] |

## Data-fetching pattern

- `useQuery(url, params, { lazy, skip, onSuccess, onError })` fires on mount unless `lazy` or `skip` is set. Params are JSON-encoded.[^use-query]
- `useMutation({ method, withCredentials, onSuccess, onError })` returns `trigger(url, data)`.[^use-mutation]
- Both treat a **2xx response whose body has `status: "ERROR"`** as an error.[^use-query][^use-mutation] That matches saas-fastify handlers that reply with that shape; see [model module layout](../conventions/model-module-layout.md).
- Every call builds a fresh axios instance through `client(apiBaseUrl)`, which attaches `x-account-id`.[^use-mutation]

## Build

`vite build` in library mode, with peers external, followed by `tsc --emitDeclarationOnly`. Types land in `dist/src`.[^pkg][^vite]

## Tests

- There are no test files. `vitest --pass-with-no-tests` exits 0; verified locally on 2026-09-11.
- `pnpm test` runs `pnpm build` first, so CI builds this package twice (see [test workflow](../ci/test-workflow.md)).[^pkg]
- `vitest.config.ts` declares `setupFiles: "./setup-test.ts"`, and `tsconfig.json` includes it, but the file is not in the repository.[^vitest] *Inference:* adding the first test file will surface a missing-setup-file error.

[^pkg]: `exports` (root and CSS), scripts, and `peerDependencies`.
[^index]: The `export` statements.
[^readme]: Basic setup, the routing example, and the i18n section.
[^wrapper]: `<ConfigProvider>` with or without `<AccountsProvider>` depending on `checkIsAdminApp()`.
[^use-mutation]: The `response.data.status === "ERROR"` branch, `client(apiBaseUrl).request(...)`.
[^use-query]: The `lazy`/`skip` effect, the `status === "ERROR"` branch.
[^app-routes]: `GetSaasAppRoutes` calls `useAccounts()`; `getSaasAppRoutes` returns `<GetSaasAppRoutes …/>`.
[^vitest]: `setupFiles: "./setup-test.ts"`.
[^vite]: `external: [...Object.keys(peerDependencies)]`, `fileName: PrefabsTechSaasReact.<format>.js`.
