<!-- Package analysis — produced by /analyze-package. Do not edit manually. -->

# Package Analysis: `@prefabs.tech/saas-fastify`

## Overview

A Fastify plugin that provides multi-tenant SaaS primitives: account management, account types, account users, account invitations, per-account database schema migrations, account discovery middleware, and SuperTokens auth recipe overrides.

---

## Base Library Passthrough Analysis

### supertokens-node — MODIFIED

- Options type: Custom override functions wrapping `RecipeInterface` from supertokens-node
- Options passed: Transformed — we wrap `emailPasswordSignUp`, `emailPasswordSignIn`, `emailPasswordSignUpPOST`, `emailPasswordSignInPOST`, `thirdPartySignInUp`, `thirdPartySignInUpPOST`, `resetPasswordUsingToken`, `getUserById`, `generatePasswordResetTokenPOST`, `createNewSession`, `verifySession`, `sendEmailVerificationEmail`, `sendPasswordResetEmail`
- Features restricted: none
- Features added:
  - Email prefix injection (`account.id_` prefix) to isolate users per account
  - Role existence validation before sign-up
  - AccountUser record creation on sign-up (linking user to account with a role)
  - User profile creation in local DB on sign-up; rollback (deleteUser) on failure
  - Email verification token send / auto-verify on sign-up (conditional on config)
  - Duplicate-email warning email (conditional on `sendUserAlreadyExistsWarning`)
  - Soft-deleted and disabled user checks in `verifySession` and `createNewSession`
  - `ProfileValidationClaim` fetched on `createNewSession` (conditional on `profileValidation.enabled`)

### fastify-plugin — THEIRS (passthrough wrapper)

Used only to wrap plugins so Fastify skips encapsulation. No custom logic.

### @prefabs.tech/fastify-slonik (`BaseService`, `DefaultSqlFactory`) — MODIFIED

- Options type: Custom subclasses
- Options passed: Extended — `AccountAwareBaseService` and `AccountAwareSqlFactory` add account-scoped filtering (`account_id` WHERE clause injected into all queries)
- Features restricted: none
- Features added:
  - `accountId` property propagated from service to factory on every query
  - `getAccountIdFilterFragment()` injects `table.account_id = $accountId` into all WHERE clauses
  - `applyAccountIdFilter` flag to opt out per-query
  - Override of `getAllSql`, `getCountSql`, `getDeleteSql`, `getFindByIdSql`, `getFindOneSql`, `getFindSql`, `getListSql`, `getUpdateSql` to route through account-aware WHERE fragment

### @prefabs.tech/postgres-migrations — THEIRS (called directly)

Used in `runMigrations` / `runAccountMigrations` to create tables and run per-account schema migrations. No transformation of options.

### @graphql-tools/merge (`mergeTypeDefs`) — THEIRS

Used directly to merge GraphQL type definitions. No transformation.

### nanoid (`customAlphabet`) — THEIRS

Used directly to generate an 8-char schema name (`s_<nanoid>`) when a per-account database schema is needed.

### humps — THEIRS

Used directly in `AccountAwareSqlFactory` to convert camelCase field names to snake_case column identifiers.

### pg (`Pool`) — THEIRS

Used directly in `initializePgPool` for per-account migration pool connections.

---

## Summary

### Exports

| Export                                                                                                                                | Type                 | Description                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `default` (plugin)                                                                                                                    | Fastify plugin       | Main entry point; runs migrations, registers account discovery, conditionally registers route groups                                  |
| `accountRoutes`                                                                                                                       | Fastify plugin       | REST routes for account CRUD + my-account endpoints                                                                                   |
| `accountInvitationRoutes`                                                                                                             | Fastify plugin       | REST routes for invitation lifecycle (create, list, join, signup, resend, revoke, remove)                                             |
| `accountUserRoutes`                                                                                                                   | Fastify plugin       | REST routes for account user listing                                                                                                  |
| `accountMigrationPlugin`                                                                                                              | Fastify plugin       | Runs per-account DB schema migrations on startup (for multi-database mode)                                                            |
| `accountResolver`                                                                                                                     | Mercurius resolver   | GraphQL resolvers for `Query.account`, `Query.accounts`, `Mutation.createAccount`, `Mutation.deleteAccount`, `Mutation.updateAccount` |
| `accountSchema`                                                                                                                       | GraphQL DocumentNode | GraphQL type definitions for Account, Accounts, AccountCreateInput, AccountUpdateInput                                                |
| `supertokensRecipesConfig`                                                                                                            | Object               | Pre-built SuperTokens recipe override config (emailVerification, session, thirdPartyEmailPassword)                                    |
| `AccountService`                                                                                                                      | Class                | Service for account DB operations; adds hostname lookup, slug/domain uniqueness, pre-account migrations                               |
| `AccountInvitationService`                                                                                                            | Class                | Service for invitation DB operations; enforces one-active-invite-per-email-per-account                                                |
| `AccountUserService`                                                                                                                  | Class                | Service for account user DB operations; adds `getUsers()`                                                                             |
| `AccountTypeService`                                                                                                                  | Class                | Service for account type DB operations; adds `createWithI18ns`, `updateWithI18ns` with transactional i18n rows                        |
| `AccountAwareBaseService`                                                                                                             | Abstract class       | Base service that injects `accountId` into factory for scoped queries                                                                 |
| `AccountAwareSqlFactory`                                                                                                              | Class                | SQL factory that appends `account_id` filter to all queries                                                                           |
| `ACCOUNT_HEADER_NAME`                                                                                                                 | Constant             | `"x-account-id"`                                                                                                                      |
| `ACCOUNT_INVITATION_ACCEPT_LINK_PATH`                                                                                                 | Constant             | Default invitation accept URL path template                                                                                           |
| `NANOID_ALPHABET`                                                                                                                     | Constant             | `"abcdefghijklmnopqrstuvwxyz0123456789"`                                                                                              |
| `NANOID_SIZE`                                                                                                                         | Constant             | `8`                                                                                                                                   |
| `ROLE_SAAS_ACCOUNT_ADMIN`                                                                                                             | Constant             | `"SAAS_ACCOUNT_ADMIN"`                                                                                                                |
| `ROLE_SAAS_ACCOUNT_OWNER`                                                                                                             | Constant             | `"SAAS_ACCOUNT_OWNER"`                                                                                                                |
| `ROLE_SAAS_ACCOUNT_MEMBER`                                                                                                            | Constant             | `"SAAS_ACCOUNT_MEMBER"`                                                                                                               |
| All types (`SaasConfig`, `Account`, `AccountCreateInput`, `AccountUpdateInput`, `AccountInvitation`, `AccountType`, `AccountUser`, …) | Types                | TypeScript type definitions                                                                                                           |

### Fastify Module Augmentations

- `FastifyInstance.verifySession` — decorated with SuperTokens `verifySession`
- `FastifyRequest.authEmailPrefix` — per-account email prefix string
- `FastifyRequest.account` — resolved `Account` object
- `FastifyContextConfig.saas.exclude` — opt a route out of account discovery
- `MercuriusContext.config` — typed as `ApiConfig`
- `MercuriusContext.database` — typed as `Database`
- `ApiConfig.saas` — extended with `SaasConfig`

### Hooks & Lifecycle Registrations

| Hook        | Location                    | Purpose                                                                                                  |
| ----------- | --------------------------- | -------------------------------------------------------------------------------------------------------- |
| `onReady`   | `plugin.ts`                 | Creates SuperTokens SAAS roles on startup                                                                |
| `onRequest` | `accountDiscoveryPlugin.ts` | Resolves `request.account` from hostname or `x-account-id` header; sets `dbSchema` and `authEmailPrefix` |

### Conditional Branches (Feature Flags)

| Flag / Condition                                                       | Effect                                                                                       |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `config.saas.routes.accounts.disabled`                                 | Skips registering account REST routes                                                        |
| `config.saas.routes.accountInvitations.disabled`                       | Skips registering invitation REST routes                                                     |
| `config.saas.routes.accountUsers.disabled`                             | Skips registering account user REST routes                                                   |
| `config.saas.routes.accountTypes.disabled`                             | Skips registering account type REST routes                                                   |
| `saasConfig.subdomains === "disabled"`                                 | Strips `slug`/`domain` from create/update; disables hostname-based account discovery         |
| `saasConfig.multiDatabase.mode` (`disabled` / `optional` / `required`) | Controls whether per-account DB schemas are created                                          |
| `saasConfig.mainApp.skipHostnameCheck`                                 | Bypasses hostname matching; account resolved by header only                                  |
| `saasConfig.apps[]` matching hostname                                  | Skips account discovery for known app domains                                                |
| `saasConfig.excludeRoutePatterns`                                      | Skips account discovery for matching URL patterns                                            |
| `routeOptions.config.saas.exclude`                                     | Per-route opt-out from account discovery                                                     |
| `config.user.features.signUp.emailVerification`                        | Sends or auto-verifies email on sign-up                                                      |
| `input.userContext.autoVerifyEmail`                                    | Auto-verifies email instead of sending token email                                           |
| `config.user.supertokens.sendUserAlreadyExistsWarning`                 | Sends warning email on duplicate email sign-up                                               |
| `config.user.features.profileValidation.enabled`                       | Fetches `ProfileValidationClaim` during `createNewSession`                                   |
| `multiDatabase.migrations.path` exists on disk                         | Runs per-account migrations in `accountMigrationPlugin`; logs warn and skips if path missing |

### Default Values (from `getSaasConfig`)

| Option                           | Default                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------- |
| `apps`                           | `[{ name: "admin", subdomain: "admin" }]`                                     |
| `app[].domain`                   | `${app.subdomain}.${rootDomain}`                                              |
| `excludeRoutePatterns`           | `[/^\/$/, /^\/auth\//, "/me", "/invitation/token/"]` (user patterns appended) |
| `invalid.domains`                | `[]`                                                                          |
| `invalid.slugs`                  | `["admin"]`                                                                   |
| `mainApp.subdomain`              | `"app"`                                                                       |
| `mainApp.domain`                 | `${mainApp.subdomain}.${rootDomain}`                                          |
| `mainApp.skipHostnameCheck`      | `true` when `subdomains === "disabled"`                                       |
| `multiDatabase.mode`             | `"disabled"`                                                                  |
| `multiDatabase.migrations.path`  | `${slonik.migrations.path ?? "migrations"}/accounts`                          |
| `tables.accounts.name`           | `"__accounts"`                                                                |
| `tables.accountTypes.name`       | `"__account_types"`                                                           |
| `tables.accountTypesI18n.name`   | `"__account_types_i18n"`                                                      |
| `tables.accountUsers.name`       | `"__account_users"`                                                           |
| `tables.accountAddresses.name`   | `"__account_addresses"`                                                       |
| `tables.accountInvitations.name` | `"__account_invitations"`                                                     |
| Invitation `acceptLinkPath`      | `"/invitation/token/:token?accountId=:accountId"`                             |
| `NANOID_SIZE`                    | `8`                                                                           |
| Account schema `s_` prefix       | `s_<8-char-nanoid>`                                                           |
