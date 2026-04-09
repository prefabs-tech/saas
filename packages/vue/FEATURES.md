<!-- Structured feature inventory — used by automated test generation. Developer docs: see GUIDE.md -->

# @prefabs.tech/saas-vue — Features

## Plugin & Injection

1. **Vue plugin install hook**: `app.use(SaasVue, options)` prepares `options.saasConfig` and provides it via `Symbol.for("saas.config")`.

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

2. **Translations provider**: plugin provides translations at `Symbol.for("saas.vue.translations")` and exports `useTranslations()` (with default fallback).

```typescript
import { useTranslations } from "@prefabs.tech/saas-vue";

const messages = useTranslations();
```

3. **Event handlers provider**: plugin provides event handlers at `Symbol.for("saas.eventHandlers")` (supports `notification`).

```typescript
app.use(SaasVue, {
  // ...
  notification: (message) => console.log(message.type, message.message),
});
```

4. **Account tab customization provider**: plugin provides optional `accountTabs` at `Symbol.for("saas.accountTabs")` (consumed by `AccountSettings`).

```typescript
app.use(SaasVue, {
  // ...
  accountTabs: (defaultTabs) => [...defaultTabs],
});
```

## Routing

5. **Admin route records**: `getSaasAdminRoutes(type?, options?)` returns `RouteRecordRaw[]` with override merging and `disabled` filtering.

```typescript
import { getSaasAdminRoutes } from "@prefabs.tech/saas-vue";

const routes = getSaasAdminRoutes("authenticated", {
  routes: { accountsView: { disabled: true } },
});
```

6. **Admin route registration helper**: `addSaasAdminRoutes(router, type?, options?)` adds routes to a `vue-router` instance.

```typescript
import { addSaasAdminRoutes } from "@prefabs.tech/saas-vue";

addSaasAdminRoutes(router);
```

7. **App route records**: `getSaasAppRoutes(type?, options?)` returns app routes for authenticated/unauthenticated/public modes with override merging and `disabled` filtering.

```typescript
import { getSaasAppRoutes } from "@prefabs.tech/saas-vue";

const routes = getSaasAppRoutes("public");
```

8. **App route registration helper**: `addSaasAppRoutes(router, type?, options?)` adds app routes to a router.

```typescript
import { addSaasAppRoutes } from "@prefabs.tech/saas-vue";

addSaasAppRoutes(router, "authenticated");
```

9. **Default paths**: exports `DEFAULT_PATHS` for built-in route paths.

```typescript
import { DEFAULT_PATHS } from "@prefabs.tech/saas-vue";

DEFAULT_PATHS.ACCOUNT_SETTINGS;
```

## Account State (Pinia) & Composables

10. **Accounts store**: exports `useMyAccountsStore()` with state + actions to fetch/update/switch accounts.

```typescript
import { useMyAccountsStore } from "@prefabs.tech/saas-vue";

const store = useMyAccountsStore();
store.switchAccount(null);
```

11. **Config resolution helper**: exports `useMyAccounts(config?)` which resolves config from parameter → injection (`saas.config`) → existing store initialization.

```typescript
import { useMyAccounts } from "@prefabs.tech/saas-vue";

const store = useMyAccounts();
```

12. **Account persistence**: switching accounts writes `x-account-id` to `localStorage` and optionally `sessionStorage` (based on `accounts.allowMultipleSessions`).

13. **Main app vs tenant app detection**: store exposes `meta.isMainApp` based on current subdomain vs `mainAppSubdomain`.

## Components & Views

14. **Wrapper component**: `SaasWrapper` performs a domain-registration check (`doesAccountExist`) and renders loading/not-found/error UI before providing config and account context.

15. **Accounts provider component**: `SaasAccountsProvider` initializes the store from config and fetches accounts when `userId` is present; clears account state on sign-out.

16. **Config provider component**: `ConfigProvider` provides SaaS config via `Symbol.for("saas.config")`.

17. **Account switcher component**: `AccountSwitcher` switches accounts; selecting a different account triggers `window.location.reload()`.

18. **Not-found component**: exports `NotFoundMessage` for the “account not found” global error case.

19. **Views**: exports `AccountSettings` and `MyAccounts`.

## Error Handling

20. **Global account error latch**: exports `useGlobalAccountError()` which flips a global flag for \(404 + `"Account not found"`\) and exposes `clearError()`.

## Utilities & Config Defaults

21. **Admin app detection utility**: exports `checkIsAdminApp()` (subdomain equals `"admin"`).

22. **UI defaults merging**: SaaS config UI is normalized by merging against `CONFIG_UI_DEFAULT`.

## Signup Flow

23. **Signup payload shaping**: signup uses `prepareSignupData({ accountSignup })` to send user-only or account+user field payloads.

24. **Post-signup redirect (main app)**: signup view can redirect to `{slug}.{rootDomain}` when enabled and a `slug` exists.

