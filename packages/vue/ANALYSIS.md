<!-- Package analysis — produced by /analyze-package. Do not edit manually. -->

## Package

- **Path**: `packages/vue`
- **Name**: `@prefabs.tech/saas-vue`
- **Type**: ESM package (`"type": "module"`)
- **Runtime deps**: (none declared in `dependencies`, but code consumes peer/dev deps such as `vue`, `vue-router`, `pinia`, `axios`, `zod`, `vee-validate`, `@vee-validate/zod`, and Prefabs Vue packages)
- **Peer deps (consumed by our code)**: `vue`, `vue-router`, `pinia`, `axios`, `zod`, `vee-validate`, `@vee-validate/zod`, `@vueuse/core`, `@prefabs.tech/vue3-config`, `@prefabs.tech/vue3-i18n`, `@prefabs.tech/vue3-layout`, `@prefabs.tech/vue3-ui`, `@prefabs.tech/vue3-user`

## Entry points & public exports

### `src/index.ts`

- **Injection keys / symbols (OURS)**:
  - `Symbol.for("saas.config")`
  - `Symbol.for("saas.eventHandlers")`
  - `Symbol.for("saas.accountTabs")`
  - `Symbol.for("saas.vue.translations")`
- **Default translations (OURS)**:
  - `defaultMessages = { en: enMessages, fr: frMessages }`
- **Vue plugin (OURS)**: default export `plugin`
  - `install(app, options)`:
    - prepares config via `prepareConfig(options.saasConfig)`
    - provides config + translations + event handlers + account tab config
- **Composables / exports (OURS)**:
  - `useTranslations()` (injects `saas.vue.translations` with fallback to defaults)
  - routes: `export * from "./routes"`
  - types: `export * from "./types/routes"`
  - account management exports:
    - `useMyAccountsStore` (Pinia store)
    - `useMyAccounts` (composable)
    - `AccountSwitcher` component
    - `SaasAccountsProvider`
    - `SaasWrapper`
    - `ConfigProvider`
  - error handling exports:
    - `useGlobalAccountError`
    - `NotFoundMessage`
  - views:
    - `AccountSettings`
    - `MyAccounts`
    - `DEFAULT_PATHS`
  - utilities:
    - `checkIsAdminApp`

## Base Library Passthrough Analysis

### `axios` — MODIFIED

- **Options type**: base library used directly; we don’t expose `AxiosRequestConfig`.
- **Options passed**: **transformed**
  - `client(baseURL)` creates an axios instance with:
    - `baseURL`
    - POST JSON header
    - `x-account-id` header from `sessionStorage` (or empty string)
- **Features restricted**: callers use our fixed instance config (no per-call customization besides request args).
- **Features added**:
  - account header wiring via `x-account-id`

### `vue-router` — PARTIAL PASSTHROUGH

- **Options type**: `RouteRecordRaw`, `Router` from `vue-router`
- **Options passed**: **modified/merged**
  - We define default route records and merge overrides into them (including `meta` deep-merge).
- **Features restricted**: `getSaas*Routes` returns only the routes for the selected “type”; override shape is limited to `RouteOverwrite`.
- **Features added**:
  - `addSaasAdminRoutes(router, ...)` / `addSaasAppRoutes(router, ...)` convenience helpers

### `zod` / `vee-validate` / `@vee-validate/zod` — NO WRAPPED DEPENDENCY (used directly)

Used directly in validation helper files and form components; we don’t wrap these libraries as a separate abstraction layer.

### Prefabs Vue packages (`@prefabs.tech/vue3-*`) — NO WRAPPED DEPENDENCY (used directly)

Consumed directly in components/views (UI/form/i18n/config/user). The “package” surface we expose is our own components/composables/routes/plugin.

## “Ours” vs “Theirs” classification

### Plugin & injection (`src/index.ts`)

- **OURS**
  - `plugin.install`:
    - **conditional**: `options.translations ? prependMessages(defaultMessages, options.translations) : defaultMessages`
    - **provides**:
      - config (prepared)
      - translations
      - event handlers (`notification`)
      - account tabs configuration
  - `useTranslations()` injects translations with default fallback

- **THEIRS**
  - `prependMessages(...)` is a direct helper from `@prefabs.tech/vue3-i18n` (used as intended).
  - `app.provide`, `inject` are Vue framework primitives.

### Config normalization (`src/utils/config.ts`)

- **OURS**
  - `prepareUiConfig(ui = {})`: merges `CONFIG_UI_DEFAULT` with provided UI config
  - `prepareConfig(config)`: returns config with `ui` normalized via `prepareUiConfig`
    - **branching**: none beyond defaulting `ui` parameter

### Constants & defaults (`src/constant.ts`)

- **OURS**
  - `ACCOUNT_HEADER_NAME = "x-account-id"`
  - `ADMIN_SUBDOMAIN_DEFAULT = "admin"`
  - `SIGNUP_PATH_DEFAULT = "/auth/signup"`
  - `SAAS_ACCOUNT_ROLES_DEFAULT` (owner/member)
  - `DEFAULT_PATHS` routing defaults
  - `REDIRECT_AFTER_LOGIN_KEY = "saas.redirectAfterLogin"`
  - `CONFIG_UI_DEFAULT` for form action alignment/reversal (**note**: `"filled"` in Vue vs `"fill"` in React)

### Utilities (`src/utils/common.ts`, `src/utils/account.ts`)

- **OURS**
  - `checkIsAdminApp()` subdomain comparison to `"admin"`
  - `prepareSignupData({ data, accountSignup=true })`
    - **branch**: account vs user signup payload shape
    - **defaults**: `accountSignup=true`, `useSeparateDatabase=false` if no slug

### API wrappers (`src/api/*`)

- **OURS**
  - `client(baseURL)` wraps `axios.create` with default headers and account-id injection
  - Accounts API (`src/api/accounts.ts`):
    - CRUD + “my account(s)” calls
    - `signup({ accountSignup=true, ... })` uses `prepareSignupData`
  - Invitation API (`src/api/AccountInvitations.ts`):
    - **branch**: token endpoints vary based on optional `accountId` (builds URL differently)
    - `withCredentials: false` for token-based flows
  - Users API (`src/api/AccountUsers.ts`): enable/disable and list users

- **THEIRS**
  - `axios` request execution is direct base library usage inside our thin wrappers.

### Stores & composables

- **OURS**
  - `useMyAccountsStore` (`src/stores/MyAccounts.ts`):
    - **defaults**: `autoSelectAccount=true`, `allowMultipleSessions=true`
    - **branching**:
      - compute `meta.isMainApp` from subdomain vs `mainAppSubdomain`
      - non-main app requires slug match; throws if not found
      - main app selects default account based on auto-select / saved account id
      - saved account id prefers session when enabled
    - **side effects**: storage writes/removals for `x-account-id`
    - **wiring**: calls API helpers `getMyAccounts`, `getMyAccount`, `updateMyAccount`
  - `useMyAccounts(config?)` (`src/composables/UseMyAccounts.ts`):
    - **branching**:
      - config resolution order: argument → injected `saas.config` → existing store
      - throws when config missing and store not initialized
      - initializes store once config is available
  - `useGlobalAccountError` (`src/composables/UseGlobalAccountError.ts`):
    - **branch**: sets global flag only for 404 + `"Account not found"` message
    - provides `clearError()`
  - `useConfig()` (`src/composables/UseConfig.ts`):
    - injects `"config"` with default object
    - **note**: this is separate from `saas.config` symbol injection used elsewhere

### Routes (`src/routes/*`)

- **OURS**
  - `getSaasAdminRoutes(type="authenticated", options?)`
    - includes 4 default admin routes; for unauthenticated/public returns []
    - supports route override merging via `getRoute(...)`
    - filters `disabled` routes out
  - `addSaasAdminRoutes(router, ...)` adds computed routes to router
  - `getSaasAppRoutes(type="authenticated", options?)`
    - **branches**: authenticated vs unauthenticated vs public route sets
    - supports override merging + disabled filtering
  - `addSaasAppRoutes(router, ...)`

### Components / views (selected key behavior)

- **OURS**
  - `SaasWrapper.vue`:
    - **branches**:
      - shows loading, not-found (global account error), 404 page, generic error page
      - wraps slot with `ConfigProvider` always; wraps with `SaasAccountsProvider` only when not admin app
    - **lifecycle**: `onMounted` calls `doesAccountExist`, stores `error`, toggles loading
    - **requires injection**: `saas.config` must exist (throws otherwise)
  - `SaasAccountsProvider.vue`:
    - **branch**: renders slot immediately if no user; otherwise waits for accounts load
    - **lifecycle**: `watch(userId)` fetches accounts; on sign-out clears store state
    - integrates `useGlobalAccountError().checkForAccountError`
  - `ConfigProvider.vue` provides `saas.config`
  - `AccountSwitcher.vue`:
    - **defaults**: `emptyLabel=""`, `noHelperText=false`
    - **branch**: no-op when selecting current account
    - **side effect**: `window.location.reload()` after switching accounts
  - `AccountSettings.vue`:
    - **tabs**: merges default tabs with injected `saas.accountTabs` (function or array)
    - **branch**: fetches my account only when activeAccount missing; uses global account error detection
  - Signup view (`views/Signup/Index.vue`):
    - **branch**: uses account signup form in main app, otherwise user signup form
    - **defaults**: `apiPath = SIGNUP_PATH_DEFAULT`, `appRedirection=true`
    - **branch**: redirects to `{slug}.{rootDomain}` after successful signup when enabled and slug present
    - uses injected `saas.eventHandlers.notification` for error messaging

## Framework constructs / lifecycle / side effects

- **Vue plugin**: `install(app, options)` with multiple `app.provide` calls
- **Injection**:
  - config: `Symbol.for("saas.config")`
  - translations: `Symbol.for("saas.vue.translations")`
  - event handlers: `Symbol.for("saas.eventHandlers")`
  - account tabs: `Symbol.for("saas.accountTabs")`
- **Pinia store**: `defineStore("myAccounts", () => ...)`
- **Routing**: returns `RouteRecordRaw[]` and provides router add helpers
- **Side effects**:
  - local/session storage for `x-account-id`
  - `window.location.reload()` on account switcher select
  - `window.location.replace(...)` for post-signup redirection

## Conditional branches & defaults (high-signal)

- **Translations**: merge additional messages only when `options.translations` exists
- **Admin vs app**: `checkIsAdminApp()` compares subdomain to `"admin"`
- **Route sets**: depend on `type` in `getSaasAdminRoutes` / `getSaasAppRoutes`
- **Account selection**: slug-based when not main app; saved-account precedence; auto-select fallback
- **Account error global flag**: only for \(404 + "Account not found"\)
- **Signup redirect**: only when `appRedirection && isMainApp && data.slug`

## Completeness checklist

- [x] Classified every public export category as "ours" or "theirs"
- [x] Listed framework constructs added (plugin, provide/inject, Pinia store, router helpers)
- [x] Identified conditional branches (routing type, translation merge, admin/app, account selection, signup redirect, error flag)
- [x] Documented default values we define (constants, config UI defaults, store defaults, route defaults)
- [x] Produced passthrough classification for wrapped dependencies (`axios`, `vue-router`)

