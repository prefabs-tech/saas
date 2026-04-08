# @prefabs.tech/saas-fastify

A Fastify plugin that adds multi-tenant SaaS primitives to your API: account management, per-account database isolation, invitation workflows, account-scoped authentication, and SuperTokens recipe overrides — all wired together and ready to register.

## Why This Package?

Building a SaaS backend means solving the same cross-cutting problems on every project: resolving which account owns a request, isolating users and data per account, managing invitations and roles, and hooking into your auth layer in the right places. This package encodes those patterns as a single Fastify plugin so you register it once and get the full account lifecycle out of the box.

## What You Get

### supertokens-node — Modified

Wraps the [supertokens-node](https://supertokens.com/docs/nodejs) `thirdPartyEmailPassword`, `emailVerification`, and `session` recipes. Our overrides add:

- **Per-account email isolation** — a `account.id_` prefix is injected into all auth emails so the same address can sign up under different accounts
- **Role validation on sign-up** — rejects sign-ups with unknown roles before touching the DB
- **AccountUser creation** — links the new SuperTokens user to the account with a role; rolls back (`deleteUser`) if local DB write fails
- **Soft-deleted / disabled user checks** — `verifySession` and `createNewSession` reject blocked users early
- **Conditional email verification** — sends or auto-verifies on sign-up based on `config.user.features.signUp.emailVerification`
- **Duplicate-email warning** — sends a warning email when the same address signs up again (controlled by `sendUserAlreadyExistsWarning`)
- **`ProfileValidationClaim`** — fetched during `createNewSession` when `profileValidation.enabled` is true

Use the exported `supertokensRecipesConfig` object to pass these overrides to `@prefabs.tech/fastify-user`.

### @prefabs.tech/fastify-slonik — Modified

Extends [`BaseService` and `DefaultSqlFactory`](https://github.com/prefabs-tech/fastify/tree/main/packages/slonik) with account-scoped variants:

- **`AccountAwareBaseService`** — abstract base class; propagates `accountId` to the factory on every query
- **`AccountAwareSqlFactory`** — injects `table.account_id = $accountId` into all WHERE clauses automatically; opt out per-query with `applyAccountIdFilter: false`

Extend `AccountAwareBaseService` for any service that should be scoped to the current account.

### Added by This Package

- **Account CRUD** — create, read, update, delete with slug/domain uniqueness enforcement and hostname validation
- **Per-account database schema isolation** — three modes: `disabled`, `optional`, `required`; schemas are created automatically on account creation
- **Account discovery middleware** — resolves `request.account` from subdomain hostname or `x-account-id` header on every request; sets `dbSchema` and `authEmailPrefix`
- **Full invitation lifecycle** — create, list, join, signup via token, resend, revoke, delete
- **Account user management** — list users belonging to an account
- **Account types with i18n** — create and update with transactional i18n rows
- **GraphQL support** — `accountResolver` (Query + Mutation) and `accountSchema` type definitions ready for Mercurius
- **Role constants** — `ROLE_SAAS_ACCOUNT_OWNER`, `ROLE_SAAS_ACCOUNT_ADMIN`, `ROLE_SAAS_ACCOUNT_MEMBER`; roles are created in SuperTokens on startup
- **Per-account DB migrations** — `accountMigrationPlugin` runs schema migrations for each account on startup

→ [Full feature list](FEATURES.md) | [Developer guide](GUIDE.md)

## Usage Guidelines

### Excluding routes from account discovery

By default, every request goes through account discovery. Two ways to opt out:

**Via config** (pattern-based):

```typescript
saas: {
  excludeRoutePatterns: ["/docs", /^\/auth\//],
}
```

**Per route** (route-level flag):

```typescript
fastify.get(
  "/docs",
  {
    config: { saas: { exclude: true } },
  },
  handler,
);
```

### CORS — allow `X-Account-Id`

If your frontend runs on a different origin, the `X-Account-Id` header must be in your CORS `allowedHeaders`:

```typescript
await fastify.register(import("@fastify/cors"), {
  origin: ["http://localhost:3000"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Account-Id"],
});
```

Without this, cross-origin requests cannot pass the account header and discovery will fall back to hostname only.

## Requirements

The following plugins must be registered before this one:

- [@prefabs.tech/fastify-config](https://github.com/prefabs-tech/fastify/tree/main/packages/config)
- [@prefabs.tech/fastify-mailer](https://github.com/prefabs-tech/fastify/tree/main/packages/mailer)
- [@prefabs.tech/fastify-s3](https://github.com/prefabs-tech/fastify/tree/main/packages/s3)
- [@prefabs.tech/fastify-slonik](https://github.com/prefabs-tech/fastify/tree/main/packages/slonik)
- [@prefabs.tech/fastify-user](https://github.com/prefabs-tech/fastify/tree/main/packages/user)
- [slonik](https://github.com/spa5k/fastify-slonik)
- [supertokens-node](https://github.com/supertokens/supertokens-node)

## Quick Start

**1. Configure** — add `saas` to your `ApiConfig` and wire in the SuperTokens recipe overrides:

```typescript
import { supertokensRecipesConfig } from "@prefabs.tech/saas-fastify";

const config: ApiConfig = {
  saas: {
    rootDomain: process.env.APP_ROOT_DOMAIN as string,
    mainApp: {
      subdomain: process.env.MAIN_APP_SUBDOMAIN ?? "app",
      domain: process.env.MAIN_APP_DOMAIN as string,
    },
    multiDatabase: { mode: "disabled" }, // "disabled" | "optional" | "required"
    subdomains: "disabled", // "disabled" | "optional" | "required"
  },
  user: {
    supertokens: { recipes: supertokensRecipesConfig },
  },
};
```

**2. Register** — order matters; `saasPlugin` must come after `userPlugin`:

```typescript
import saasPlugin, { accountMigrationPlugin } from "@prefabs.tech/saas-fastify";

await fastify.register(configPlugin, { config });
await fastify.register(slonikPlugin, config.slonik);
await fastify.register(mailerPlugin, config.mailer);
await fastify.register(s3Plugin);
await fastify.register(userPlugin);
await fastify.register(saasPlugin);
await fastify.register(migrationPlugin, config.slonik); // app migrations
await fastify.register(accountMigrationPlugin); // per-account migrations
```

## Installation

Install with npm:

```bash
npm install @prefabs.tech/fastify-config @prefabs.tech/fastify-mailer @prefabs.tech/fastify-s3 @prefabs.tech/fastify-slonik @prefabs.tech/fastify-user slonik supertokens-node @prefabs.tech/saas-fastify
```

Install with pnpm:

```bash
pnpm add --filter "<@scope/project>" @prefabs.tech/fastify-config @prefabs.tech/fastify-mailer @prefabs.tech/fastify-s3 @prefabs.tech/fastify-slonik @prefabs.tech/fastify-user slonik supertokens-node @prefabs.tech/saas-fastify
```
