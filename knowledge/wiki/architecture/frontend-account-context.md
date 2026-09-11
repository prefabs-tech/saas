---
type: Architecture
title: Frontend account context
description: How saas-react and saas-vue tell admin app, main app and tenant host apart, choose and persist the active account, and send it to the API as the x-account-id header — and where the two implementations diverge.
tags: [react, vue, multi-tenancy, x-account-id, state, frontend]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: react-wrapper
    resource: repo://packages/react/src/SaasWrapper.tsx#L19-L81
    title: React SaasWrapper
    last_modified: 2026-05-04
  - id: react-api
    resource: repo://packages/react/src/api/accounts/index.ts#L11-L41
    title: doesAccountExist / getMyAccounts (React)
    last_modified: 2026-05-04
  - id: react-common
    resource: repo://packages/react/src/utils/common.ts#L3-L7
    title: checkIsAdminApp (React)
    last_modified: 2025-04-30
  - id: react-constants
    resource: repo://packages/react/src/constants.ts#L1-L3
    title: ACCOUNT_HEADER_NAME, ADMIN_SUBDOMAIN_DFAULT
    last_modified: 2026-05-04
  - id: react-config
    resource: repo://packages/react/src/utils/config.ts#L33-L50
    title: prepareConfig (React)
    last_modified: 2026-05-04
  - id: react-provider
    resource: repo://packages/react/src/contexts/AccountsProvider.tsx#L45-L218
    title: AccountsProvider
    last_modified: 2026-05-04
  - id: react-client
    resource: repo://packages/react/src/api/axios/client.ts#L5-L26
    title: axios client factory (React)
    last_modified: 2025-09-03
  - id: react-myaccounts
    resource: repo://packages/react/src/views/MyAccounts/index.tsx#L25-L32
    title: MyAccountsPage switch handler
    last_modified: 2026-05-04
  - id: commit-client
    resource: repo://.git#3df023b
    title: "3df023b (2025-09-03) fix(react/multiple-sessions): clear persisted account id if not found in user accounts"
    last_modified: 2025-09-03
  - id: fastify-config
    resource: repo://packages/fastify/src/config.ts#L22-L43
    title: Backend default exclusions and mainApp default
    last_modified: 2026-05-04
  - id: fastify-plugin
    resource: repo://packages/fastify/src/plugin.ts#L13-L50
    title: saas-fastify registers no GET / route
    last_modified: 2026-05-04
  - id: vue-plugin
    resource: repo://packages/vue/src/index.ts#L23-L41
    title: Vue plugin install
    last_modified: 2026-05-04
  - id: vue-wrapper
    resource: repo://packages/vue/src/components/SaasWrapper.vue#L1-L82
    title: Vue SaasWrapper
    last_modified: 2026-07-29
  - id: vue-provider
    resource: repo://packages/vue/src/components/SaasAccountsProvider.vue#L1-L55
    title: Vue SaasAccountsProvider
    last_modified: 2026-07-29
  - id: vue-store
    resource: repo://packages/vue/src/stores/MyAccounts.ts#L46-L182
    title: Vue myAccounts Pinia store
    last_modified: 2026-07-16
  - id: vue-client
    resource: repo://packages/vue/src/api/axios/client.ts#L5-L17
    title: axios client factory (Vue)
    last_modified: 2026-05-13
  - id: vue-config-type
    resource: repo://packages/vue/src/types/config.ts#L1-L38
    title: Vue SaasConfig type
    last_modified: 2026-05-04
  - id: vue-error
    resource: repo://packages/vue/src/composables/UseGlobalAccountError.ts#L9-L34
    title: useGlobalAccountError
    last_modified: 2026-05-04
  - id: vue-switcher
    resource: repo://packages/vue/src/components/accounts/AccountSwitcher.vue#L101-L114
    title: Vue AccountSwitcher selectAccount
    last_modified: 2026-07-29
---

# Frontend account context

## Responsibility

The frontend half of [account discovery](account-discovery.md). The backend can only resolve a tenant from the host or the `x-account-id` header. The frontend packages make sure the right one is present: they detect which kind of app is running, load the user's accounts, pick an active one, and attach its id to API calls.

## Mechanism (React)

1. **Probe the API.** `SaasWrapper` mounts and calls `GET /` on `apiBaseUrl` with credentials. A 404 renders the "unregistered domain" page; any other error renders a generic error page.[^react-wrapper][^react-api]
   - On a tenant host this 404 comes from backend discovery by host. On the main app, `/` is excluded from discovery by default.[^fastify-config]
   - *Inference:* the API must answer `GET /` with a 2xx for registered hosts. saas-fastify does not register that route,[^fastify-plugin] and an unknown route is also a 404, which would show "unregistered domain".
2. **Detect the admin app.** The host is the admin app if the first hostname label is `"admin"`. The value is a hard-coded constant, not read from config.[^react-common][^react-constants] The admin app gets no `AccountsProvider`.[^react-wrapper]
3. **Normalise config.** `prepareConfig` derives `mainApp.domain` with the same default formula as the backend.[^react-config][^fastify-config]
4. **Load accounts.** `AccountsProvider` sets `isMainApp = window.location.host === mainApp.domain`; the host includes the port. When `userId` is set it calls `GET /my-accounts`. **Children are not rendered while loading.**[^react-provider]
5. **Choose the active account** in `computeNewActiveAccount`:[^react-provider]
   - **Tenant host:** the account whose `slug` equals the first hostname label. If there is none it throws `"Account not found for user"`, which is caught and sets `error = true`.
   - **Main app, nothing active yet:** the saved id if it is still in the list, preferring `sessionStorage` when `allowMultipleSessions` and falling back to `localStorage`. Otherwise the first account if `autoSelectAccount` (default `true`) or if there is exactly one account; else `null`.
   - **Main app, already active:** keep the current account if it is still in the list; otherwise use the default above.
6. **Persist.** `switchAccount` writes the id under the key `x-account-id` to `localStorage`, and also to `sessionStorage` when `allowMultipleSessions` (default `true`).[^react-provider]
7. **Send.** A new axios instance is created on every request.[^react-client] It reads `sessionStorage` and, **if that value exists, replaces it with the `localStorage` value**. The header is sent only if the result is non-empty. The FIXME comment and this logic arrived in 3df023b.[^commit-client]

### What step 7 means in practice

*Inference from the code, not verified in a browser:*

- If `sessionStorage` has no id, no header is sent, even when `localStorage` has one. Main-app calls to non-excluded routes then get the backend's 404.
- If both have an id, the `localStorage` value wins. That is the last account switched in *any* tab, which works against per-tab `allowMultipleSessions`.

See open questions.

## Vue: same shape, different details

| Aspect | React | Vue |
| --- | --- | --- |
| Config input | `config` prop on `SaasWrapper`[^react-wrapper] | `app.use(plugin, { saasConfig, … })` provides `Symbol.for("saas.config")`. `SaasWrapper` throws if it is missing.[^vue-plugin][^vue-wrapper] |
| State container | React context (`AccountsProvider`) | Pinia store `myAccounts`[^vue-store] |
| `isMainApp` | `host === mainApp.domain` | `hostname.split(".")[0] === mainAppSubdomain`[^vue-store] |
| Main app config | `mainApp.{domain,subdomain}`; `mainAppSubdomain` deprecated | only `mainAppSubdomain`; no `mainApp` key[^vue-config-type] |
| Header source | the sessionStorage/localStorage logic above; omitted when empty | `sessionStorage` only; **always sent**, as `""` when absent[^vue-client] |
| Account 404 | wrapper page | wrapper page, plus `useGlobalAccountError`, which flags a 404 `"Account not found"` from any caller and renders `NotFoundMessage`[^vue-wrapper][^vue-error] |
| After switching | `MyAccountsPage` reloads the window, marked `FIXME hack to force rtk query to refetch`[^react-myaccounts] | `AccountSwitcher` reloads the window[^vue-switcher] |
| Children while loading | hidden | shown immediately when there is no `userId`; hidden while loading otherwise[^vue-provider] |
| Sign-out | — | the watcher clears accounts, active account, and error when `userId` becomes empty[^vue-provider] |

## Invariants

- The header name, the admin subdomain, and the main-app domain formula are **duplicated** between backend and frontends. See [package boundaries](package-boundaries.md).
- A backend `saas.apps` entry with a subdomain other than `admin` is invisible to both frontends' admin-app detection.[^react-common]
- Both frontends reload the page on account switch. No in-memory data is expected to survive a switch.[^react-myaccounts][^vue-switcher]

## Open questions

- Is the React client's `if (accountId) { accountId = localStorage… }` intended? The commit title suggests a fallback to `localStorage` *when* `sessionStorage` is empty.
- Should frontend admin-app detection read the backend's `apps` configuration instead of the hard-coded `"admin"`?
- Is the Vue `isMainApp` subdomain comparison meant to converge on React's full-domain comparison, which supports `mainApp.domain` and ports?

[^react-wrapper]: `doesAccountExist` in `useEffect`; `error.status === 404` branch; `isAdminApp ? children : <AccountsProvider>`.
[^react-api]: `client(apiBaseUrl).get("/")` and `.get("/my-accounts")`, both with `withCredentials: true`.
[^react-common]: `window.location.hostname.split(".")[0] === ADMIN_SUBDOMAIN_DFAULT`.
[^react-constants]: `ACCOUNT_HEADER_NAME = "x-account-id"`, `ADMIN_SUBDOMAIN_DFAULT = "admin"`.
[^react-config]: `_mainApp.domain = mainApp.domain ?? \`${mainApp.subdomain || mainAppSubdomain || "app"}.${rootDomain}\``.
[^react-provider]: `isMainApp`, `switchAccount`, `computeNewActiveAccount`, `fetchMyAccounts`, and `{loading ? null : children}`.
[^react-client]: `let accountId = sessionStorage.getItem(...); if (accountId) { accountId = localStorage.getItem(...) }`.
[^react-myaccounts]: `window.location.reload()` with the FIXME comment.
[^commit-client]: The diff that introduced the `localStorage` read into the client.
[^fastify-config]: Default exclusions include `/^\/$/`; the `mainApp.domain` default formula.
[^fastify-plugin]: The plugin registers only the four model route groups.
[^vue-plugin]: `app.provide(__saasConfig, prepareConfig(options.saasConfig))`.
[^vue-wrapper]: `inject(Symbol.for("saas.config"))` throws when absent; `doesAccountExist` on mount; `NotFoundMessage` when `showAccountError`.
[^vue-provider]: `<slot v-if="!props.userId || !loading" />`; the `userId` watcher.
[^vue-store]: The `meta` computed and `computeNewActiveAccount`; `updateAccounts` passes `clearState: false`.
[^vue-client]: `[ACCOUNT_HEADER_NAME]: accountId || ""`.
[^vue-config-type]: `mainAppSubdomain: string`; no `mainApp` field.
[^vue-error]: Checks `response.status === 404 && data.error.message === "Account not found"`.
[^vue-switcher]: `switchAccount(account); emit("switch"); window.location.reload()`.
