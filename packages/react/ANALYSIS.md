<!-- Package analysis — produced by /analyze-package. Do not edit manually. -->

## Package

- **Path**: `packages/react`
- **Name**: `@prefabs.tech/saas-react`
- **Type**: ESM package (`"type": "module"`)
- **Runtime deps**: `axios`, `zod`
- **Peer deps (consumed directly by our code)**: `react`, `react-dom`, `react-router-dom`, `react-toastify`, `primereact`, `@prefabs.tech/react-config`, `@prefabs.tech/react-form`, `@prefabs.tech/react-i18n`, `@prefabs.tech/react-ui`

## Entry points & public exports

### `src/index.ts`

- **Module augmentation (OURS)**: augments `@prefabs.tech/react-config`’s `AppConfig` with `saas: SaasConfig`.
- **Re-exports (OURS, as barrels)**:
  - `export * from "./api"`
  - `export * from "./constants"`
  - `export * from "./hooks"`
  - `export * from "./routes"`
  - `export * from "./types"`
  - `export * from "./utils"`
  - `export * from "./views"`
  - `export * from "./SaasWrapper"`
- **Named exports (OURS)**:
  - Components: `AccountSwitcher`, `AccountForm`, `AccountInfo`, `AccountInvitationForm`, `AccountInvitationModal`, `AccountInvitationsTable`, `AccountSignupForm`, `AccountUsersTable`, `AccountsTable`, `MyAccounts`, `UserSignupForm`
  - Contexts: `accountsContext`, `AccountsProvider`

## Base Library Passthrough Analysis

### `axios` — MODIFIED

- **Options type**: base library (`axios`) is used directly; we don’t expose/forward `AxiosRequestConfig` types.
- **Options passed**: **transformed**
  - We create a preconfigured instance in `src/api/axios/client.ts` with:
    - `baseURL` set from our config
    - default JSON content type for POST
    - optional `x-account-id` header read from storage
- **Features restricted**: partial (callers don’t control the instance config beyond `baseURL`; config is embedded in our wrapper).
- **Features added**:
  - Automatic `x-account-id` header injection (account session selection)
  - Shared “API base URL” behavior through `useConfig()` + `client(apiBaseUrl)` pattern

### `zod` — NO WRAPPED DEPENDENCY (used directly)

No wrapped dependency passthrough surface; `zod` is used directly inside our schemas and form validation logic.

### `@prefabs.tech/react-form`, `@prefabs.tech/react-ui`, `@prefabs.tech/react-i18n`, `react-router-dom`, `react-toastify` — NO WRAPPED DEPENDENCY (used directly)

These libraries are consumed directly inside our components/views/routes. We do not provide a thin wrapper that forwards their configuration wholesale; instead we build opinionated components and hooks on top of them.

## “Ours” vs “Theirs” classification

### API layer (`src/api/*`)

- **OURS**
  - `client(baseURL: string)` (`src/api/axios/client.ts`): creates an `axios` instance and injects headers.
  - `encodeURIParameter(arg)` (`src/api/utilities.ts`): JSON encodes parameters (or returns `undefined`).
  - `useQuery(url, parameters?, options?)` (`src/api/common/UseQuery.ts`): React hook wrapping `axios.get` with:
    - **defaults**: `lazy=false`, `skip=false`
    - **branching**: auto-trigger on mount unless `lazy`/`skip`
    - **error normalization**: treats `response.data.status === "ERROR"` as error
  - `useMutation(options?)` (`src/api/common/UseMutation.ts`): React hook wrapping `axios.request` with:
    - **defaults**: `method="POST"`, `withCredentials=true`
    - **error normalization**: treats `response.data.status === "ERROR"` as error
  - Account endpoints (`src/api/accounts/index.ts`):
    - `doesAccountExist({ apiBaseUrl })` (GET `/`, `withCredentials: true`)
    - `getMyAccounts({ apiBaseUrl })` (GET `/my-accounts`, `withCredentials: true`)
    - `signup({ apiBaseUrl, path, data, accountSignup=true })`:
      - **default**: `accountSignup = true`
      - **transformation**: uses `prepareSignupData({ data, accountSignup })`

- **THEIRS (direct calls)**
  - `axios.create(...)`, `.get(...)`, `.post(...)`, `.request(...)` are used as base library invocations inside our wrappers.

### Context/providers (`src/contexts/*`)

- **OURS**
  - `accountsContext` + `AccountsProvider` (`src/contexts/AccountsProvider.tsx`)
    - **defaults** from config: `autoSelectAccount=true`, `allowMultipleSessions=true`
    - **branches**:
      - Determines `isMainApp` based on `window.location.host === mainApp?.domain`
      - Chooses active account based on:
        - subdomain match when **not** main app
        - saved account id from storage (session wins when enabled)
        - `autoSelectAccount` and “only one account” fallback
    - **side effects**:
      - Writes/removes `x-account-id` in `localStorage` and optionally `sessionStorage`
      - Fetches accounts when `userId` is present
  - `configContext` + `ConfigProvider` (`src/contexts/ConfigProvider.tsx`)

### Hooks (`src/hooks/*`)

- **OURS**
  - `useAccounts()` (`src/hooks/UseAccounts.ts`): reads `accountsContext`; throws if missing provider.
  - `useConfig()` (`src/hooks/UseConfig.ts`): reads `configContext`; throws if missing provider.
  - Account data hooks (thin wrappers over `useQuery`/`useMutation`):
    - `useAddAccountMutation`
    - `useEditAccountMutation` (**default override**: forces `method: "PUT"` while spreading provided options)
    - `useGetAccountQuery`
    - `useGetMyAccountQuery`
    - Invitation hooks:
      - `useAddInvitationMutation`
      - `useDeleteInvitationMutation`
      - `useGetInvitationQuery`
      - `useGetInvitationsQuery`
      - `useJoinInvitationMutation`
      - `useResendInvitationMutation`
      - `useRevokeInvitationMutation`
      - `useSignupInvitationMutation`
    - User hooks:
      - `useDisableUserMutation`
      - `useEnableUserMutation`
      - `useGetUsersQuery`

- **THEIRS (direct calls)**
  - React hooks (`useContext`, `useCallback`, etc.) are used directly as building blocks.

### Utils (`src/utils/*`)

- **OURS**
  - `checkIsAdminApp()` (`src/utils/common.ts`):
    - **default**: admin subdomain constant `ADMIN_SUBDOMAIN_DFAULT = "admin"`
    - **branch**: compares subdomain to admin constant
  - `prepareUiConfig(ui?)` (`src/utils/config.ts`):
    - **defaults**: merges `CONFIG_UI_DEFAULT` into provided UI config
  - `prepareConfig(config)` (`src/utils/config.ts`):
    - **defaults**:
      - `mainApp.subdomain` defaults to `"app"`
      - `mainApp.domain` defaults to `"{subdomain}.{rootDomain}"` (supports deprecated `mainAppSubdomain`)
      - `ui` defaults come from `CONFIG_UI_DEFAULT`
    - **transformation**: returns a normalized `SaasConfig` used by providers/components
  - `prepareSignupData({ data, accountSignup=true })` (`src/utils/account.ts`):
    - **branch**: different shape for account vs user signup payload
    - **defaults**:
      - `accountSignup = true`
      - `useSeparateDatabase` becomes `false` when slug missing

### Routes (`src/routes/*`)

- **OURS**
  - `getSaasAdminRoutes(type="authenticated", options?)` (`src/routes/GetSaasAdminRoutes.tsx`)
    - **branch**: for `type === "unauthenticated"` or `"public"`, returns no routes.
    - **default paths**: uses `DEFAULT_PATHS.*` (path overwrite is TODO; `element` can be overwritten)
  - `GetSaasAppRoutes({ type="authenticated", options })` and `getSaasAppRoutes(type="authenticated", options?)`
    - **branch**:
      - `"authenticated"`: account settings, join invitation (disabled when not main app), my accounts
      - `"unauthenticated"`: invitation signup + signup
      - `"public"`: accept invitation
    - **dependency**: uses `useAccounts()` to read `isMainApp` meta

### UI components (`src/components/*`)

- **OURS**
  - `AccountSwitcher` (`src/components/accounts/Switcher.tsx`)
    - **defaults**: `noHelperText=false`
    - **branch**: returns loading icon when accounts are not loaded
  - `AccountsTable` (`src/components/accounts/Table/index.tsx`)
    - **defaults**:
      - `className="table-accounts"`
      - `visibleColumns=["name","registeredNumber","taxId","type"]`
      - `persistState=true`
      - `initialSorting=[{ id: "name", desc: false }]`
    - **branch**: column set changes based on config `entity`
  - `MyAccounts` + `Account` (`src/components/MyAccounts/*`)
  - `AccountForm` (`src/components/account/Form/AccountForm.tsx`)
    - **validation**: zod schema; slug requirements depend on `subdomains === "required"`
    - **defaultValues**: derive from existing account or config `entity`
  - `AccountInvitationForm` (`src/components/account/Invitations/InvitationForm.tsx`)
    - **defaults**:
      - `roles`: `customRoles || saasAccountRoles || SAAS_ACCOUNT_ROLES_DEFAULT`
      - default values include `expiresAt` only when `expiryDateField.display`
      - role auto-selected when exactly one role is available
    - **conditional schema**:
      - merges role schema if roles exist
      - merges expiresAt schema if expiry date displayed
      - merges additional schema if provided
    - **side effects**: shows toast notifications on success/failure
  - Signup components
    - `AccountSignupForm` (`src/components/Signup/AccountSignupForm.tsx`)
      - **defaults**:
        - `activeIndex=0` (2-step flow)
        - default form values initialized for account + user fields
      - **branching**:
        - schema switches by `activeIndex`
        - terms & conditions field required only when `termsAndConditionsUrl` present
        - submit button label changes between “Next” and “Submit”
        - password/confirmPassword must match (refine)
    - `UserSignupForm` (`src/components/Signup/UserSignupForm.tsx`)
      - **defaults**: email defaults to provided `email || ""`
      - **branching**: terms & conditions requirement depends on `termsAndConditionsUrl`
  - Other exported component surface (via barrel exports):
    - `AccountInfo`
    - `AccountInvitationModal`
    - `AccountInvitationsTable`
    - `AccountUsersTable`
    - (and supporting field/table components exported from `src/components/*` barrels)

- **THEIRS (direct calls)**
  - UI, form, i18n libraries are called directly inside components (`@prefabs.tech/react-ui`, `@prefabs.tech/react-form`, `@prefabs.tech/react-i18n`, `react-toastify`).

### Views/pages (`src/views/*`)

- **OURS**
  - `AccountAddPage`, `AccountEditPage`, `AccountSettingsPage`, `AccountViewPage`
  - `AcceptInvitationPage`, `JoinInvitationPage`, `SignupInvitationPage`
  - `MyAccountsPage`, `SignupPage`

These are mostly composition over our components plus Prefabs UI primitives (`Page`, etc.) and translations.

## Framework constructs / lifecycle / side effects

- **React context**: `accountsContext`, `configContext`
- **React hooks used for lifecycle**:
  - `useEffect` in `SaasWrapper` triggers an API call to check domain registration.
  - `useEffect` in `AccountsProvider` triggers `fetchMyAccounts` when `userId` is present.
- **Routing**: returns `<Route .../>` elements for `react-router-dom` integration.
- **Storage side effects**: `AccountsProvider.switchAccount()` writes/removes `x-account-id` to/from local and optional session storage.
- **Notifications**: invitation form uses `react-toastify` to show success/error toasts.

## Conditional branches & feature flags (observed)

- **Config normalization** (`prepareConfig`)
  - `mainApp.subdomain` fallback (`"app"`)
  - `mainApp.domain` computed from subdomain + `rootDomain` when missing
  - `ui` merged with `CONFIG_UI_DEFAULT`
- **Admin vs app mode**:
  - `checkIsAdminApp()` uses subdomain comparison to `"admin"`
  - `SaasWrapper` chooses whether to wrap children in `AccountsProvider` based on admin/app
- **Routes**:
  - Admin routes removed for unauthenticated/public mode
  - App routes vary by authenticated/unauthenticated/public
  - Invitation join route disabled when not `isMainApp`
- **Account selection**:
  - auto-select account unless disabled
  - saved account id resolution uses session first when enabled
  - subdomain-based account selection when not main app
- **Signup forms**:
  - optional terms-and-conditions validation based on presence of `termsAndConditionsUrl`
  - slug validation strictness depends on `subdomains === "required"`

## Default values (observed)

- **Constants** (`src/constants.ts`)
  - `ACCOUNT_HEADER_NAME = "x-account-id"`
  - `ADMIN_SUBDOMAIN_DFAULT = "admin"`
  - `SIGNUP_PATH_DEFAULT = "/auth/signup"`
  - `SAAS_ACCOUNT_ROLES_DEFAULT = ["SAAS_ACCOUNT_OWNER", "SAAS_ACCOUNT_MEMBER"]`
  - `DEFAULT_PATHS` for app/admin routing
  - `CONFIG_UI_DEFAULT` for form action alignment/reversal
- **Hooks**
  - `useQuery`: `lazy=false`, `skip=false`
  - `useMutation`: `method="POST"`, `withCredentials=true`
- **AccountsProvider**
  - `autoSelectAccount=true`, `allowMultipleSessions=true` (from config fallback)
- **prepareConfig**
  - `mainApp.subdomain="app"` when missing

## Completeness checklist

- [x] Classified every **public export category** as "ours" vs "theirs"
- [x] Listed framework constructs (contexts, hooks, routing)
- [x] Identified conditional branches (config normalization, routing mode, admin/app, signup schema conditions)
- [x] Documented default values we define (constants, hook defaults, provider defaults, config defaults)
- [x] Produced passthrough classification for wrapped dependency (`axios`)
