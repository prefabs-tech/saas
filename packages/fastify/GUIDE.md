# @prefabs.tech/saas-fastify — Developer Guide

## Installation

### For package consumers

```bash
npm install @prefabs.tech/saas-fastify
```

```bash
pnpm add @prefabs.tech/saas-fastify
```

### For monorepo development

```bash
pnpm install
pnpm --filter @prefabs.tech/saas-fastify test
pnpm --filter @prefabs.tech/saas-fastify build
```

## Setup

Register the plugin after `@prefabs.tech/fastify-config`, `@prefabs.tech/fastify-slonik`, and `@prefabs.tech/fastify-user` are in place. The plugin reads `fastify.config.saas` at registration time.

```typescript
import saasPlugin from "@prefabs.tech/saas-fastify";
import type { ApiConfig } from "@prefabs.tech/fastify-config";

// Extend your app config with SaaS options
const config: ApiConfig = {
  saas: {
    rootDomain: "example.com",
    subdomains: "optional",
  },
  // ...rest of your config
};

await fastify.register(saasPlugin);
```

All subsequent examples assume this setup and only show the relevant config delta or code.

---

## Base Libraries

### supertokens-node — Modified

Handles authentication. We wrap 13 of its recipe functions to add SaaS-specific behaviour.

-> **Their docs:** [supertokens-node](https://www.npmjs.com/package/supertokens-node)

We wrap rather than replace: every override calls `originalImplementation.*` and extends the result. What we add on top:

- Per-account email prefixing to isolate users
- Role existence validation before sign-up
- Local user and AccountUser record creation on sign-up
- Email verification flow wiring
- Soft-deleted / disabled user blocks on sign-in and session verify

### @prefabs.tech/fastify-slonik — Modified

Provides `BaseService` and `DefaultSqlFactory`. We subclass both.

-> **Their docs:** [@prefabs.tech/fastify-slonik](https://www.npmjs.com/package/@prefabs.tech/fastify-slonik)

What we add: `AccountAwareBaseService` and `AccountAwareSqlFactory` automatically append `WHERE table.account_id = $accountId` to every query, so services scoped to an account never accidentally leak rows from other accounts.

---

## Features

### Plugin Registration

Register the default export to activate all SaaS infrastructure:

```typescript
import saasPlugin from "@prefabs.tech/saas-fastify";

await fastify.register(saasPlugin);
```

On registration the plugin:

- Runs core-table migrations (accounts, account types, account users, account addresses, account invitations)
- Registers an `onReady` hook that creates the three SAAS roles in SuperTokens
- Registers the account discovery `onRequest` hook
- Conditionally registers the four route groups

---

### Account Migration Plugin

A separately exported plugin for per-account schema migrations. Register it after the main plugin when using `multiDatabase` mode:

```typescript
import saasPlugin, { accountMigrationPlugin } from "@prefabs.tech/saas-fastify";

await fastify.register(saasPlugin);
await fastify.register(accountMigrationPlugin);
```

On startup it fetches all accounts that have a `database` field, opens a `pg.Pool` connection, and runs migrations from the path configured in `config.saas.multiDatabase.migrations.path`. If the path does not exist on disk it logs a warning and skips.

---

### Pre-built SuperTokens Recipes

Export a ready-made `supertokensRecipesConfig` object and pass it straight to your user plugin config:

```typescript
import { supertokensRecipesConfig } from "@prefabs.tech/saas-fastify";

const config: ApiConfig = {
  user: {
    supertokens: {
      recipes: supertokensRecipesConfig,
    },
  },
};
```

This wires up all SaaS-aware overrides for `emailVerification`, `session`, and `thirdPartyEmailPassword` recipes.

---

### Account Discovery Middleware

On every request an `onRequest` hook runs and resolves `request.account`:

| Situation                                                                | Resolution strategy             |
| ------------------------------------------------------------------------ | ------------------------------- |
| `subdomains !== "disabled"` and hostname does not match `mainApp.domain` | Lookup by hostname              |
| Hostname matches `mainApp.domain` or `skipHostnameCheck` is true         | Lookup by `x-account-id` header |

When an account is found:

- `request.account` is set to the `Account` object
- `request.dbSchema` is set to `account.database` (if present)
- `request.authEmailPrefix` is set to `${account.id}_` (if `account.slug` is present)

If discovery fails, the middleware responds with `404 { error: { message: "Account not found" } }`.

#### Skipping discovery for specific domains

```typescript
const config: ApiConfig = {
  saas: {
    rootDomain: "example.com",
    subdomains: "optional",
    apps: [
      { name: "admin", subdomain: "admin" }, // admin.example.com → skip discovery
      { name: "marketing", domain: "www.example.com" }, // explicit domain
    ],
  },
};
```

#### Skipping discovery for URL patterns

```typescript
const config: ApiConfig = {
  saas: {
    rootDomain: "example.com",
    subdomains: "optional",
    excludeRoutePatterns: ["/public/", /^\/webhooks\//],
  },
};
```

The default excluded patterns (`/`, `/auth/*`, `/me`, `/invitation/token/`) are always included — your additions are appended.

#### Skipping discovery for a single route

```typescript
fastify.get(
  "/healthz",
  {
    config: { saas: { exclude: true } },
  },
  async () => ({ ok: true }),
);
```

---

### Subdomains Mode

Controls whether accounts have slugs/domains and whether hostname-based discovery is active.

| Value        | Effect                                                                                              |
| ------------ | --------------------------------------------------------------------------------------------------- |
| `"disabled"` | No slugs or domains stored; account resolved by header only; `skipHostnameCheck` defaults to `true` |
| `"optional"` | Slug/domain optional; hostname discovery active when slug is present                                |
| `"required"` | Slug required on account creation; hostname discovery always active                                 |

```typescript
const config: ApiConfig = {
  saas: {
    rootDomain: "example.com",
    subdomains: "required", // or "optional" | "disabled"
  },
};
```

---

### Multi-Database Support

Each account can have its own Postgres schema. Controlled by `multiDatabase.mode`:

| Mode         | Effect                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------- |
| `"disabled"` | No per-account schemas (default)                                                                  |
| `"optional"` | Schema created when `useSeparateDatabase: true` is passed on account creation (and a slug exists) |
| `"required"` | Schema always created for accounts that have a slug                                               |

```typescript
const config: ApiConfig = {
  saas: {
    rootDomain: "example.com",
    subdomains: "required",
    multiDatabase: {
      mode: "required",
      migrations: {
        path: "migrations/accounts", // default
      },
    },
  },
};
```

When a schema is created its name is `s_<8-char-nanoid>` (e.g. `s_a1b2c3d4`), stored in `account.database`.

---

### Route Groups

All four route groups are registered by default. Disable any individually:

```typescript
const config: ApiConfig = {
  saas: {
    rootDomain: "example.com",
    subdomains: "optional",
    routes: {
      accounts: { disabled: false },
      accountInvitations: { disabled: false },
      accountUsers: { disabled: false },
      accountTypes: { disabled: true }, // skip account type routes
    },
  },
};
```

---

### Custom Route Handlers

Every route handler can be replaced with a custom function matching the original signature:

```typescript
import { accountRoutes } from "@prefabs.tech/saas-fastify";
import type { AccountCreateInput } from "@prefabs.tech/saas-fastify";

const config: ApiConfig = {
  saas: {
    rootDomain: "example.com",
    subdomains: "optional",
    handlers: {
      account: {
        create: async (request, reply) => {
          // custom create logic
        },
      },
      accountInvitation: {
        signup: async (request, reply) => {
          // custom signup-via-invite logic
        },
      },
    },
  },
};
```

Available override keys: `account.*`, `accountInvitation.*`, `accountUser.*`, `accountType.*`.

---

### Account Invitations

The invitation flow covers: create → resend → join (existing user) / signup (new user) → revoke / remove.

**One-active-invite rule:** Creating an invitation for an email that already has a non-expired, non-revoked, non-accepted invitation in the same account throws an error.

Configure invitation behaviour:

```typescript
const config: ApiConfig = {
  saas: {
    rootDomain: "example.com",
    subdomains: "optional",
    invitation: {
      acceptLinkPath: "/join/:token?accountId=:accountId",
      emailOverrides: {
        subject: "You're invited to join Acme",
        templateName: "custom-invite",
      },
      postAccept: async (request, invitation, user) => {
        // called after a user accepts the invitation
      },
    },
  },
};
```

---

### Account Types with i18n

`AccountTypeService` supports creating and updating account types together with their i18n rows in a single database transaction:

```typescript
import { AccountTypeService } from "@prefabs.tech/saas-fastify";

const service = new AccountTypeService(config, database);

const accountType = await service.createWithI18ns({
  name: "enterprise",
  i18n: [
    { locale: "en", label: "Enterprise" },
    { locale: "fr", label: "Entreprise" },
  ],
});

await service.updateWithI18ns(accountType.id, {
  i18n: [{ locale: "en", label: "Enterprise Plus" }],
});
```

`updateWithI18ns` deletes all existing i18n rows then inserts the new set, all within the same transaction.

---

### Account-Aware Service Layer

Use `AccountAwareBaseService` when you need queries that are automatically scoped to a single account:

```typescript
import {
  AccountAwareBaseService,
  AccountAwareSqlFactory,
} from "@prefabs.tech/saas-fastify";

class WidgetService extends AccountAwareBaseService<
  Widget,
  WidgetCreate,
  WidgetUpdate
> {
  get sqlFactoryClass() {
    return WidgetSqlFactory;
  }
}

// All queries from this service include WHERE account_id = $accountId
const service = new WidgetService(config, database, request.account.id);
const widgets = await service.list(20, 0);
```

To opt a specific query out of the account filter, set `factory.applyAccountIdFilter = false` before querying.

---

### SuperTokens Auth Overrides

#### Email prefix isolation

When an account is discovered, `request.authEmailPrefix` is set to `${account.id}_`. The `emailPasswordSignUp` override prepends this to the stored email, so the same real email can sign up under multiple accounts without SuperTokens seeing a duplicate.

#### Role validation

Pass required roles via `userContext.roles`. If any role does not exist in SuperTokens, sign-up is rejected with a 500 before any user is created:

```typescript
await supertokens.signUp("emailpassword", {
  email: "alice@example.com",
  password: "secret",
  userContext: {
    roles: ["SAAS_ACCOUNT_OWNER"],
    authEmailPrefix: request.authEmailPrefix,
    account: request.account,
  },
});
```

#### Soft-deleted and disabled users

`verifySession` revokes the session and returns 401 if `user.deletedAt` is set or `user.disabled` is `true`. `createNewSession` applies the same check before issuing a session.

#### Email verification

Enabled when `config.user.features.signUp.emailVerification` is `true`. Pass `userContext.autoVerifyEmail = true` to skip sending an email and auto-verify instead.

#### Profile validation claim

When `config.user.features.profileValidation.enabled` is `true`, `ProfileValidationClaim` is fetched and attached to the session on creation.

---

### GraphQL API

Export `accountSchema` and `accountResolver` and register them with Mercurius:

```typescript
import { accountSchema, accountResolver } from "@prefabs.tech/saas-fastify";

await fastify.register(mercurius, {
  schema: accountSchema,
  resolvers: accountResolver,
});
```

Available operations (all require `@auth`):

- `Query.account(id)` — fetch single account
- `Query.accounts(limit, offset, filters, sort)` — paginated list
- `Mutation.createAccount(data)` — create account
- `Mutation.updateAccount(id, data)` — update account
- `Mutation.deleteAccount(id)` — delete account

---

### Custom Table Names

Override any of the six core table names:

```typescript
const config: ApiConfig = {
  saas: {
    rootDomain: "example.com",
    subdomains: "optional",
    tables: {
      accounts: { name: "tenants" },
      accountTypes: { name: "tenant_types" },
      accountTypesI18n: { name: "tenant_types_i18n" },
      accountUsers: { name: "tenant_users" },
      accountAddresses: { name: "tenant_addresses" },
      accountInvitations: { name: "tenant_invitations" },
    },
  },
};
```

---

### Constants

```typescript
import {
  ACCOUNT_HEADER_NAME, // "x-account-id"
  ACCOUNT_INVITATION_ACCEPT_LINK_PATH,
  ROLE_SAAS_ACCOUNT_ADMIN, // "SAAS_ACCOUNT_ADMIN"
  ROLE_SAAS_ACCOUNT_OWNER, // "SAAS_ACCOUNT_OWNER"
  ROLE_SAAS_ACCOUNT_MEMBER, // "SAAS_ACCOUNT_MEMBER"
  NANOID_ALPHABET,
  NANOID_SIZE,
} from "@prefabs.tech/saas-fastify";
```

---

## Use Cases

### Header-only tenancy (no subdomains)

When your app does not use subdomains, disable them so account resolution falls back to the `x-account-id` header:

```typescript
const config: ApiConfig = {
  saas: {
    rootDomain: "example.com",
    subdomains: "disabled",
    // mainApp.skipHostnameCheck defaults to true — header-only resolution
  },
};
```

The frontend sends `x-account-id: <accountId>` on every authenticated request. The middleware resolves `request.account` from the header and the rest of the request lifecycle proceeds normally.

---

### Subdomain-based tenancy with optional per-account databases

```typescript
const config: ApiConfig = {
  saas: {
    rootDomain: "acme.io",
    subdomains: "required",
    mainApp: { subdomain: "app" }, // app.acme.io
    apps: [{ name: "admin", subdomain: "admin" }], // admin.acme.io skips discovery
    multiDatabase: {
      mode: "optional",
      migrations: { path: "migrations/accounts" },
    },
  },
};

await fastify.register(saasPlugin);
await fastify.register(accountMigrationPlugin); // runs per-account migrations on startup
```

Accounts that opted in (`useSeparateDatabase: true`) get their own schema. All account-scoped services automatically use `request.dbSchema` for query routing.

---

### Invitation-based signup with custom role

Invite a user and assign them a specific role when they accept:

```typescript
const config: ApiConfig = {
  saas: {
    rootDomain: "example.com",
    subdomains: "optional",
    invitation: {
      postAccept: async (request, invitation, user) => {
        // grant extra permissions, send a welcome email, etc.
        await sendWelcomeEmail(user.email);
      },
    },
    handlers: {
      accountInvitation: {
        signup: async (request, reply) => {
          // custom sign-up flow when accepting an invitation
        },
      },
    },
  },
};
```

On the sign-up path, pass `userContext.saasAccountRole` to override the default `ROLE_SAAS_ACCOUNT_MEMBER` assigned to the new user.

---

### Extending account-aware services

Build your own domain services that automatically scope queries to the current account:

```typescript
import { AccountAwareBaseService } from "@prefabs.tech/saas-fastify";
import { DefaultSqlFactory } from "@prefabs.tech/fastify-slonik";

class ProjectService extends AccountAwareBaseService<
  Project,
  ProjectCreate,
  ProjectUpdate
> {
  get sqlFactoryClass() {
    return DefaultSqlFactory;
  }
}

// In a route handler:
const service = new ProjectService(
  request.config,
  request.slonik,
  request.account?.id,
  request.dbSchema,
);

// SELECT * FROM projects WHERE account_id = $1 LIMIT 20
const projects = await service.list(20, 0);
```
