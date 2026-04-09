<!-- Structured feature inventory — used by automated test generation. Developer docs: see GUIDE.md -->

# @prefabs.tech/saas-react — Features

## Configuration & Defaults

1. **App config augmentation**: augments `@prefabs.tech/react-config`’s `AppConfig` with `saas: SaasConfig`.

2. **Default constants**: exports defaults for:
   - `ACCOUNT_HEADER_NAME = "x-account-id"`
   - `ADMIN_SUBDOMAIN_DFAULT = "admin"`
   - `SIGNUP_PATH_DEFAULT = "/auth/signup"`
   - `SAAS_ACCOUNT_ROLES_DEFAULT = ["SAAS_ACCOUNT_OWNER", "SAAS_ACCOUNT_MEMBER"]`
   - `DEFAULT_PATHS` for app/admin routes

3. **UI defaults merging**: `prepareConfig` merges `CONFIG_UI_DEFAULT` into `config.ui` (account/invitation/signup form action alignment + reversal).

## HTTP & API Helpers (axios)

4. **Axios client factory**: `client(baseURL)` creates a preconfigured axios instance and injects `x-account-id` from storage.

5. **Domain registration check**: `doesAccountExist({ apiBaseUrl })` calls `GET /` with credentials.

6. **Fetch user accounts**: `getMyAccounts({ apiBaseUrl })` calls `GET /my-accounts` with credentials.

7. **Signup API**: `signup({ apiBaseUrl, path, data, accountSignup=true })` shapes payload via `prepareSignupData` and posts to `path`.

8. **Query hook**: `useQuery(url, parameters?, options?)` wraps `axios.get` and provides:
   - defaults: `lazy=false`, `skip=false`
   - an imperative `trigger()`
   - error normalization when `response.data.status === "ERROR"`

9. **Mutation hook**: `useMutation(options?)` wraps `axios.request` and provides:
   - defaults: `method="POST"`, `withCredentials=true`
   - an imperative `trigger(url, data?)`
   - error normalization when `response.data.status === "ERROR"`

## Contexts & Hooks

10. **Config context**: `ConfigProvider` provides SaaS config and `useConfig()` reads it (throws if missing).

11. **Accounts context**: `AccountsProvider` provides accounts state and `useAccounts()` reads it (throws if missing).

12. **Account selection rules**: active account is computed from:
   - main app vs tenant app mode
   - saved account id in storage (session preferred when enabled)
   - `autoSelectAccount` and “single account” fallback

13. **Account persistence**: switching accounts writes/removes `x-account-id` in `localStorage` and optionally `sessionStorage` (when `allowMultipleSessions` is enabled).

14. **Accounts fetching lifecycle**: when `userId` is present, `AccountsProvider` fetches accounts and updates provider state.

## Wrapper & App Mode

15. **Admin app detection**: `checkIsAdminApp()` checks whether the current subdomain equals `"admin"`.

16. **SaasWrapper gating**: `SaasWrapper`:
   - calls `doesAccountExist` on mount and shows loading / error UI
   - normalizes config via `prepareConfig`
   - wraps children with `ConfigProvider`
   - wraps children with `AccountsProvider` only for non-admin apps

## Routing

17. **Admin routes generator**: `getSaasAdminRoutes(type?, options?)` emits `<Route />` elements for admin pages and supports element overrides + disabled flags.

18. **App routes generator**: `getSaasAppRoutes(type?, options?)` emits routes for authenticated/unauthenticated/public modes; join invitation route disables when not in the main app.

## UI Components

19. **AccountSwitcher**: switches accounts using `useAccounts()`; shows loading state when accounts aren’t available.

20. **AccountsTable**: renders a table of accounts; column set changes based on `config.entity`.

21. **MyAccounts**: renders a list of accounts and triggers account switching.

22. **AccountForm**: account create/edit form with zod validation; slug validation depends on `subdomains`.

23. **AccountInvitationForm**: invitation form with conditional schema merging (roles, expiry field, and optional caller-provided schema) and toast notifications.

24. **Signup forms**:
   - `AccountSignupForm` is a 2-step flow with conditional schema and optional terms & conditions validation
   - `UserSignupForm` supports optional terms & conditions validation and optional pre-filled email

## Views/Pages

25. **Built-in pages**: exports pages for common SaaS flows (accounts add/edit/view/settings, invitations accept/join/signup, my accounts, signup).

