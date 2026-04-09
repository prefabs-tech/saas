<!-- Structured feature inventory — used by automated test generation. Developer docs: see GUIDE.md -->

# @prefabs.tech/saas-vue — Features

## Plugin & Injection

1. **Vue plugin install hook**: `app.use(SaasVue, options)` prepares `options.saasConfig` and provides it to the app via `Symbol.for("saas.config")`.

```typescript
import SaasVue from "@prefabs.tech/saas-vue";

app.use(SaasVue, {
  pinia,
  router,
  config,
  saasConfig: {
    apiBaseUrl: "https://api.example.com",
    entity: "both",
    mainAppSubdomain: "app",
    multiDatabase: false,
    rootDomain: "example.com",
    subdomains: "required",
  },
});
```

2. **Translations provider**: plugin provides translations at `Symbol.for("saas.vue.translations")` and exports `useTranslations()` to read them (with default fallback).

```typescript
import { useTranslations } from "@prefabs.tech/saas-vue";

const messages = useTranslations();
```

3. **Event handlers provider**: plugin provides event handlers at `Symbol.for("saas.eventHandlers")` (currently supports a `notification` handler).

```typescript
app.use(SaasVue, {
  // ...
  notification: (message) => console.log(message.type, message.message),
});
```

4. **Account tab customization provider**: plugin provides optional `accountTabs` customization at `Symbol.for("saas.accountTabs")`, consumed by `AccountSettings`.

```typescript
app.use(SaasVue, {
  // ...
  accountTabs: (defaultTabs) => [...defaultTabs],
});
```

## Routing

5. **Admin route records**: `getSaasAdminRoutes(type?, options?)` returns Vue Router `RouteRecordRaw[]` for admin pages with optional route overrides and disable filtering.

```typescript
import { getSaasAdminRoutes } from "@prefabs.tech/saas-vue";

const routes = getSaasAdminRoutes("authenticated", {
  routes: {
    accountsView: { disabled: true },
  },
});
```

6. **Admin route registration helper**: `addSaasAdminRoutes(router, type?, options?)` adds the admin routes to a router instance.

```typescript
import { addSaasAdminRoutes } from "@prefabs.tech/saas-vue";

addSaasAdminRoutes(router);
```

7. **App route records**: `getSaasAppRoutes(type?, options?)` returns route records for app pages (authenticated/unauthenticated/public), with override merging and disabled filtering.

```typescript
import { getSaasAppRoutes } from "@prefabs.tech/saas-vue";

const routes = getSaasAppRoutes("public");
```

8. **App route registration helper**: `addSaasAppRoutes(router, type?, options?)` adds the app routes to a router instance.

```typescript
import { addSaasAppRoutes } from "@prefabs.tech/saas-vue";

addSaasAppRoutes(router, "authenticated");
```

9. **Default paths**: exports `DEFAULT_PATHS` for the built-in route paths.

```typescript
import { DEFAULT_PATHS } from "@prefabs.tech/saas-vue";

DEFAULT_PATHS.ACCOUNT_SETTINGS;
```

## Account State (Pinia) & Composables

10. **Accounts store**: exports `useMyAccountsStore()` Pinia store with account list, active account, loading/error state, and actions to fetch/update/switch accounts.

```typescript
import { useMyAccountsStore } from "@prefabs.tech/saas-vue";

const store = useMyAccountsStore();
store.switchAccount(null);
```

11. **Config resolution helper**: exports `useMyAccounts(config?)` which resolves SaaS config from (a) parameter, (b) injection `Symbol.for("saas.config")`, or (c) existing store initialization.

```typescript
import { useMyAccounts } from "@prefabs.tech/saas-vue";

const store = useMyAccounts();
```

12. **Account persistence**: switching accounts writes `x-account-id` to `localStorage` and optionally `sessionStorage` (based on `accounts.allowMultipleSessions`).

13. **Main app vs tenant app detection**: store computes `meta.isMainApp` based on current subdomain and `mainAppSubdomain`.

## Components & Views

14. **Wrapper component**: `SaasWrapper` performs a domain-registration check (`doesAccountExist`) and renders loading / not-found / error UI before providing config and account context.

15. **Accounts provider component**: `SaasAccountsProvider` initializes the store from config and fetches accounts when `userId` is present; clears account state on sign-out.

16. **Config provider component**: `ConfigProvider` provides SaaS config via `Symbol.for("saas.config")`.

17. **Account switcher component**: `AccountSwitcher` switches active accounts; selecting a different account triggers a full page reload.

18. **Not-found component**: `NotFoundMessage` is exported for the “account not found” global error case.

19. **Views**: exports `AccountSettings` and `MyAccounts` views for common account management screens.

## Error Handling

20. **Global account error latch**: exports `useGlobalAccountError()` which flips a global reactive flag for the specific condition \(404 + `"Account not found"`\), and exposes `clearError()`.

## Utilities & Config Defaults

21. **Admin app detection utility**: exports `checkIsAdminApp()` which checks whether the current subdomain equals `"admin"`.

22. **UI defaults merging**: SaaS config UI is normalized by merging against `CONFIG_UI_DEFAULT` (account/invitation/signup form action alignment + reversal).

## Signup Flow

23. **Signup API payload shaping**: signup uses `prepareSignupData({ accountSignup })` to send either user-only or account+user field payloads.

24. **Post-signup redirect (main app)**: signup view can redirect to `{slug}.{rootDomain}` after successful account signup when `accounts.signup.appRedirection` is enabled and a `slug` exists.

