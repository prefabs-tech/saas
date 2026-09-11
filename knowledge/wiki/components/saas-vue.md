---
type: Component
title: "@prefabs.tech/saas-vue"
description: Vue 3 plugin with SaaS views, Pinia stores, router helpers and account context for saas-fastify — how it is installed, what it exports, and how it differs from saas-react.
tags: [component, vue, frontend, pinia, npm-package]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: pkg
    resource: repo://packages/vue/package.json#L1-L95
    title: saas-vue package.json
    last_modified: 2026-07-29
  - id: index
    resource: repo://packages/vue/src/index.ts#L13-L73
    title: Plugin install and exports
    last_modified: 2026-05-04
  - id: plugin-type
    resource: repo://packages/vue/src/types/plugin.ts#L10-L36
    title: SaasVuePluginOptions
    last_modified: 2026-05-04
  - id: app-routes
    resource: repo://packages/vue/src/routes/GetSaasAppRoutes.ts#L13-L140
    title: getSaasAppRoutes / addSaasAppRoutes
    last_modified: 2026-07-16
  - id: stores
    resource: repo://packages/vue/src/stores/MyAccounts.ts#L36-L240
    title: myAccounts store
    last_modified: 2026-07-16
  - id: api-invitations
    resource: repo://packages/vue/src/api/AccountInvitations.ts#L15-L162
    title: Invitation API functions
    last_modified: 2026-05-04
  - id: readme
    resource: repo://packages/vue/README.md
    title: saas-vue README
    last_modified: 2025-08-01
  - id: commit-vue-init
    resource: repo://.git#ab8f713
    title: "ab8f713 (2025-04-25) feat: initiate vue sass from vue user"
    last_modified: 2025-04-25
---

# @prefabs.tech/saas-vue

## Responsibility

It is the Vue 3 counterpart of [saas-react](saas-react.md): account context, sign-up and invitation views, account settings, and route helpers against the same saas-fastify API. The package was started on 2025-04-25,[^commit-vue-init] and its README covers installation only.[^readme] This page and the code are the documentation.

## How an app wires it in

1. Install the plugin: `app.use(saasPlugin, options)`. `install` provides four values under `Symbol.for(...)` keys:[^index][^plugin-type]
   - the prepared `saasConfig`
   - translations, with `options.translations` prepended to the built-in en/fr messages
   - `{ notification }` event handlers
   - the `accountTabs` customiser, `(defaultTabs) => tabs`
2. Render `<SaasWrapper :user-id="…">` around the app. It throws if the plugin was not installed.
3. Add routes with `addSaasAppRoutes(router, type, options)` or `addSaasAdminRoutes(router, …)`, or spread the arrays from `getSaas*Routes`. Routes carry `name` and `meta.authenticated` for the host app's navigation guard.[^app-routes]

## Exports

| Group | Items |
| --- | --- |
| Plugin | `default`, `useTranslations`[^index] |
| Components | `SaasWrapper`, `SaasAccountsProvider`, `ConfigProvider`, `AccountSwitcher`, `NotFoundMessage`[^index] |
| State | `useMyAccountsStore` (Pinia), `useMyAccounts(config?)`, `useGlobalAccountError`[^index] |
| Routes | `getSaasAppRoutes`, `addSaasAppRoutes`, `getSaasAdminRoutes`, `addSaasAdminRoutes`, `DEFAULT_PATHS`, route types[^index] |
| Views | `AccountSettings`, `MyAccounts`[^index] |
| Utils | `checkIsAdminApp`[^index] |

The other stores (`accounts`, `invitation`, `users`) are not exported. They wrap the functions in `src/api/*`.[^stores][^api-invitations]

## Differences from saas-react that matter

The runtime differences (`isMainApp`, header handling, 404 handling) are covered in [frontend account context](../architecture/frontend-account-context.md#vue-same-shape-different-details). The packaging differences:

- **Route overrides** accept `path`, `component`, `meta`, and `disabled`. React supports only `element` and `disabled`.[^app-routes]
- **Toolchain:** TypeScript 4.9.5 with `vue-tsc` 1.8.27, while the fastify and react packages use TypeScript 5.9.3.[^pkg]
- **Peers:** `@prefabs.tech/vue3-*` peers are pinned to exactly `0.32.0`.[^pkg]
- **Invitation acceptance:** after an invitation lookup for an existing user, the join path is saved to `sessionStorage` under `saas.redirectAfterLogin`, so the host app's login guard can come back to it. See [invitation flow](../architecture/invitation-flow.md).

## Build

`vite build` with peers, dependencies, and `^supertokens-.*` external; then `vue-tsc --emitDeclarationOnly`. The CSS is exported at `./dist/PrefabsTechSaasVue.css`.[^pkg]

## Tests

There are no test files. `vitest --passWithNoTests` exits 0; verified locally on 2026-09-11.

## Open questions

- Is saas-vue at feature parity with saas-react, or still in progress? The root README does not list it.
- Should `isMainApp` and the header handling be aligned with React?

[^pkg]: `typescript: 4.9.5`, `vue-tsc: 1.8.27`, exact peer pins, `exports`, and the build script.
[^index]: `plugin.install` provides and the `export` list.
[^plugin-type]: `accountTabs`, `config`, `notification`, `pinia`, `router`, `saasConfig`, `translations`.
[^app-routes]: Routes with `name`/`meta.authenticated`; `getRoute` merges overrides; `addSaasAppRoutes` calls `router.addRoute`.
[^stores]: `useMyAccountsStore` with `setConfig`, `fetchMyAccounts`, `switchAccount`, `updateActiveAccount`.
[^api-invitations]: Plain async functions over `client(apiBaseUrl)`.
[^readme]: Title, description, and install commands only.
[^commit-vue-init]: The commit that added `packages/vue/package.json`.
