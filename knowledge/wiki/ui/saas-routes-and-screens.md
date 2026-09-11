---
type: UI
title: SaaS routes and screens
description: Which screens saas-react and saas-vue add to the admin app and the main/tenant app, under which route type and default path, and how a host app overrides routes, tabs, form layout and translations.
tags: [ui, routing, react, vue, i18n, screens]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: react-constants
    resource: repo://packages/react/src/constants.ts#L5-L49
    title: React DEFAULT_PATHS and CONFIG_UI_DEFAULT
    last_modified: 2026-05-04
  - id: vue-constants
    resource: repo://packages/vue/src/constant.ts#L19-L57
    title: Vue DEFAULT_PATHS, CONFIG_UI_DEFAULT, REDIRECT_AFTER_LOGIN_KEY
    last_modified: 2026-05-04
  - id: react-app-routes
    resource: repo://packages/react/src/routes/GetSaasAppRoutes.tsx#L20-L103
    title: React getSaasAppRoutes
    last_modified: 2026-05-04
  - id: react-admin-routes
    resource: repo://packages/react/src/routes/GetSaasAdminRoutes.tsx#L11-L58
    title: React getSaasAdminRoutes
    last_modified: 2026-05-04
  - id: react-route-types
    resource: repo://packages/react/src/types/routes.ts#L3-L31
    title: React route override types
    last_modified: 2026-05-04
  - id: vue-app-routes
    resource: repo://packages/vue/src/routes/GetSaasAppRoutes.ts#L13-L140
    title: Vue getSaasAppRoutes
    last_modified: 2026-07-16
  - id: vue-admin-routes
    resource: repo://packages/vue/src/routes/GetSaasAdminRoutes.ts#L11-L93
    title: Vue getSaasAdminRoutes
    last_modified: 2026-05-04
  - id: vue-route-types
    resource: repo://packages/vue/src/types/routes.ts#L3-L32
    title: Vue route override types
    last_modified: 2026-05-04
  - id: react-readme
    resource: repo://packages/react/README.md#L116-L313
    title: React README routing, tabs, form alignment, i18n
    last_modified: 2025-10-10
  - id: vue-plugin-type
    resource: repo://packages/vue/src/types/plugin.ts#L22-L36
    title: Vue accountTabs / translations / notification options
    last_modified: 2026-05-04
  - id: react-signup
    resource: repo://packages/react/src/views/Signup/index.tsx#L64-L75
    title: React SignupPage picks form by app
    last_modified: 2026-05-04
  - id: react-myaccounts
    resource: repo://packages/react/src/views/MyAccounts/index.tsx#L13-L39
    title: React MyAccountsPage redirects off main app
    last_modified: 2026-05-04
  - id: react-terms
    resource: repo://packages/react/src/components/Signup/SignupFormActions.tsx#L26-L45
    title: React SignupFormActions gates submit on terms acceptance
---

# SaaS routes and screens

## Screen map

| Screen | Default path | App | Route type | React gating |
| --- | --- | --- | --- | --- |
| Accounts list | `/accounts` | admin | authenticated | Vue only; React has no list route (TODO in types)[^react-route-types][^vue-admin-routes] |
| Add account | `/accounts/new` | admin | authenticated | — |
| Edit account | `/accounts/:id/edit` | admin | authenticated | — |
| View account (tabs: info, users, invitations) | `/accounts/:id` | admin | authenticated | — |
| Account settings (tabs) | `/account-settings` | main/tenant | authenticated | — |
| My accounts | `/accounts` | main/tenant | authenticated | the page redirects to `/` when not on the main app[^react-myaccounts] |
| Join invitation | `/join/token/:token` | main/tenant | authenticated | **route registered only when `isMainApp`**[^react-app-routes] |
| Accept invitation (redirector) | `/invitation/token/:token` | main/tenant | public | — |
| Sign-up via invitation | `/signup/token/:token` | main/tenant | unauthenticated | — |
| Sign-up | `/signup` | main/tenant | unauthenticated | account form on the main app, user form elsewhere[^react-signup] |

Paths come from `DEFAULT_PATHS`, which is identical in both packages.[^react-constants][^vue-constants] "My accounts" (app) and "Accounts list" (admin) share `/accounts` and are told apart by which app registers them.

## How routes are added

| | React | Vue |
| --- | --- | --- |
| Call | `getSaasAppRoutes(type, options)` and `getSaasAdminRoutes(type, options)` return `<Route>` elements[^react-app-routes][^react-admin-routes] | `getSaasAppRoutes(type, options)` returns `RouteRecordRaw[]`; `addSaasAppRoutes(router, …)` calls `router.addRoute`[^vue-app-routes] |
| Route types | `authenticated` (default), `public`, `unauthenticated`. Admin returns nothing for the last two.[^react-admin-routes] | same[^vue-admin-routes] |
| Auth guard | the host app decides where to render each group | each route has `meta.authenticated` for the host's guard[^vue-app-routes] |
| Override | `{ element, disabled }`; **path override not supported** (commented TODO)[^react-route-types] | `{ component, path, meta, disabled }`[^vue-route-types] |
| Constraint | `getSaasAppRoutes` calls `useAccounts()`, so it must render inside `SaasWrapper`[^react-app-routes] | route records are static |

## Customising screens

- **Account tabs.**
  - React: pass `<AccountViewPage>` or `<AccountSettingsPage>` as the route `element` with `tabs`, `activeTab`, and `visibleTabs`. `visibleTabs` also sets the tab order, and a tab object with an existing key overrides that tab.[^react-readme]
  - Vue: the plugin option `accountTabs: (defaultTabs) => tabs`.[^vue-plugin-type]
- **Form action layout.** `ui.{account,invitation,signup}.form.{actionsAlignment,actionsReverse}`. Defaults:[^react-constants][^vue-constants]

  | Form | React default | Vue default |
  | --- | --- | --- |
  | account | `right`, not reversed | `filled`, not reversed |
  | invitation, signup | `fill`, reversed | `filled`, reversed |

  The vocabularies differ: React uses `"fill"`, Vue `"filled"`.
- **Terms and conditions.** Setting `accounts.signup.termsAndConditionsUrl` links the terms from the React sign-up user fields, and the form actions watch an acceptance field. Submit stays disabled until it is checked.[^react-terms]
- **Entity.** `entity` and `multiDatabase` shape the account forms; see [accounts](../domain/accounts.md#individual-vs-organization).
- **Invitation roles.** `saasAccountRoles` fills the invitation role picker; see [roles](../domain/account-roles-and-membership.md).

## Translations and notifications

- **React:** uses `@prefabs.tech/react-i18n` namespaces `account` and `accounts` (en, fr), which **the host must register**.[^react-readme] Toasts come from `react-toastify`, a peer the host must mount (`<ToastContainer>` in the README).[^react-readme]
- **Vue:** ships en/fr messages and prepends the host's `translations`. Notifications go through the host-supplied `notification({ type, message })` handler.[^vue-plugin-type]

## Design system

Screens are built from `@prefabs.tech/react-ui` (primereact underneath) and `@prefabs.tech/vue3-ui`/`-layout`, not from local primitives. Styling beyond those is package CSS, exported from each package's `dist`. See [saas-react](../components/saas-react.md) and [saas-vue](../components/saas-vue.md).

[^react-constants]: `DEFAULT_PATHS` and `CONFIG_UI_DEFAULT`.
[^vue-constants]: `DEFAULT_PATHS`, `CONFIG_UI_DEFAULT` with `"filled"`, `REDIRECT_AFTER_LOGIN_KEY`.
[^react-app-routes]: `disabled: invitationJoin?.disabled || !isMainApp`; unauthenticated and public branches; `useAccounts()`.
[^react-admin-routes]: Three routes; `unauthenticated` and `public` produce `[]`.
[^react-route-types]: `RouteOverwrite = { disabled?, element? }` with `// path?: string; // TODO`; `// accounts?: RouteOverwrite; // TODO`.
[^vue-app-routes]: Named routes with `meta.authenticated`; `addSaasAppRoutes`.
[^vue-admin-routes]: Includes the `accounts` list route.
[^vue-route-types]: `RouteOverwrite = { component?, disabled?, meta?, path? }`.
[^react-readme]: The Routing, tab customisation, form action alignment, and i18n sections.
[^vue-plugin-type]: `accountTabs`, `notification`, `translations` in `SaasVuePluginOptions`.
[^react-signup]: `isMainApp ? <AccountSignupForm> : <UserSignupForm>`.
[^react-myaccounts]: `if (!isMainApp) return <Navigate to="/" />`.
[^react-terms]: `isChecked = termsAndConditionsUrl ? watched : true`; `disabled: !!termsAndConditionsUrl && !isChecked`.
