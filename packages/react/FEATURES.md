<!-- Structured feature inventory — used by automated test generation. Developer docs: see GUIDE.md -->

# @prefabs.tech/saas-react — Features

## Configuration & Defaults

1. **App config augmentation**: augments `@prefabs.tech/react-config`’s `AppConfig` with `saas: SaasConfig` to support typed `config.saas` usage.

2. **Default constants**: exports defaults for:
   - `ACCOUNT_HEADER_NAME = "x-account-id"`
   - `ADMIN_SUBDOMAIN_DFAULT = "admin"`
   - `SIGNUP_PATH_DEFAULT = "/auth/signup"`
   - `SAAS_ACCOUNT_ROLES_DEFAULT = ["SAAS_ACCOUNT_OWNER", "SAAS_ACCOUNT_MEMBER"]`
   - `DEFAULT_PATHS` for app/admin routes

3. **UI defaults**: merges `CONFIG_UI_DEFAULT` with `config.ui` to drive action alignment/reversal defaults for account/invitation/signup forms.

## HTTP & API Helpers (axios)

4. **Axios client factory**: exports a `client(baseURL)` that creates a preconfigured axios instance and injects `x-account-id` from storage.

5. **Account existence check**: `doesAccountExist({ apiBaseUrl })` calls `GET /` with credentials to validate domain registration.

6. **My accounts fetch**: `getMyAccounts({ apiBaseUrl })` calls `GET /my-accounts` with credentials.

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

10. **Config context**: `ConfigProvider` provides SaaS config and `useConfig()` reads it (throws when missing).

11. **Accounts context**: `AccountsProvider` provides accounts state and `useAccounts()` reads it (throws when missing).

12. **Account selection logic**: `AccountsProvider` computes the active account based on:
   - app mode (main app vs tenant app)
   - saved account id in storage (session wins when enabled)
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

18. **App routes generator**: `getSaasAppRoutes(type?, options?)` emits routes for authenticated/unauthenticated/public modes; the join invitation route is disabled when not in the main app.

## UI Components

19. **AccountSwitcher**: renders a dropdown to switch accounts using `useAccounts()`; shows loading state when accounts aren’t available.

20. **AccountsTable**: renders a configurable table of accounts; column set changes based on `config.entity`.

21. **MyAccounts**: renders a list of user accounts and triggers account switching.

22. **AccountForm**: create/edit account form with zod validation; slug validation depends on `subdomains` mode.

23. **AccountInvitationForm**: invitation form with conditional schema merging:
   - roles schema when roles are configured
   - expiry schema when expiry field is enabled
   - optional merge of caller-provided additional schema
   - toast notifications on success/error

24. **Signup forms**:
   - `AccountSignupForm` is a 2-step flow with conditional schema and optional terms & conditions validation
   - `UserSignupForm` supports optional terms & conditions validation and optional pre-filled email

## Views/Pages

25. **Built-in pages**: exports pages for common SaaS flows:
   - accounts (add/edit/view/settings)
   - invitations (accept/join/signup)
   - my accounts
   - signup

