---
type: Architecture
title: Tenant schema isolation (multi-database)
description: How an account gets its own Postgres schema — which subdomains/multiDatabase combinations trigger it, which tables live there, how requests are routed to it, and when it is migrated.
tags: [fastify, multi-tenancy, postgres, schema, migrations, multi-database]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: should-use
    resource: repo://packages/fastify/src/lib/shouldUseSeparateDatabase.ts#L7-L47
    title: shouldUseSeparateDatabase decision function
    last_modified: 2026-07-16
  - id: should-use-test
    resource: repo://packages/fastify/src/lib/__test__/shouldUseSeparateDatabase.test.ts#L9-L166
    title: shouldUseSeparateDatabase test matrix
    last_modified: 2026-05-04
  - id: account-service
    resource: repo://packages/fastify/src/model/accounts/service.ts#L87-L142
    title: AccountService postCreate / preCreate / preUpdate
    last_modified: 2026-05-04
  - id: change-schema
    resource: repo://packages/fastify/src/lib/changeSchema.ts#L3-L11
    title: changeSchema
    last_modified: 2025-01-22
  - id: run-migrations
    resource: repo://packages/fastify/src/migrations/runMigrations.ts#L14-L36
    title: runMigrations (public schema)
    last_modified: 2026-05-04
  - id: run-account-migrations
    resource: repo://packages/fastify/src/migrations/runAccountMigrations.ts#L19-L74
    title: runAccountMigrations (tenant schema)
    last_modified: 2026-05-04
  - id: migrate-plugin
    resource: repo://packages/fastify/src/plugins/migratePlugin.ts#L15-L58
    title: accountMigrationPlugin (boot-time loop)
    last_modified: 2026-05-04
  - id: config
    resource: repo://packages/fastify/src/config.ts#L3-L51
    title: getSaasConfig — multiDatabase defaults
    last_modified: 2026-05-04
  - id: queries
    resource: repo://packages/fastify/src/migrations/queries.ts#L44-L71
    title: accounts table DDL
    last_modified: 2026-05-04
  - id: account-schema
    resource: repo://packages/fastify/src/schemas/account.ts#L18-L42
    title: accountCreateInputSchema
    last_modified: 2026-05-04
  - id: discovery-plugin
    resource: repo://packages/fastify/src/plugins/accountDiscoveryPlugin.ts#L48-L61
    title: Discovery sets request.dbSchema
    last_modified: 2026-05-04
  - id: invitation-create
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/create.ts#L46-L113
    title: Invitation create handler derives dbSchema from the account
    last_modified: 2026-05-04
  - id: my-accounts
    resource: repo://packages/fastify/src/model/accounts/handlers/myAccounts.ts#L9-L43
    title: myAccounts handler
    last_modified: 2026-05-04
  - id: base-service
    resource: repo://packages/fastify/src/service.ts#L10-L46
    title: AccountAwareBaseService constructor (accountId, schema)
    last_modified: 2026-05-04
  - id: commit-multidb
    resource: repo://.git#2b16542
    title: "2b16542 (2025-09-23) fix(fastify)!: fix multi database config and logic for creating new account (#157)"
    last_modified: 2025-09-23
  - id: commit-varchar
    resource: repo://.git#a496ce3
    title: "a496ce3 (2026-03-11) fix(fastify/migrations): increase accounts table database column to VARCHAR(24) (#178)"
    last_modified: 2026-03-11
---

# Tenant schema isolation (multi-database)

## What "multi-database" means here

Despite the config name, a "separate database" is a **Postgres schema in the same database**. Only the account's `database` column records the schema name. `AccountService.preCreate` generates it as `s_` followed by an 8-character nanoid over `[a-z0-9]`. A dated in-code comment explains the prefix: *"[RL 2024-01-08] Added `s_` prefix to indicate that the database is a schema"*.[^account-service] Switching into a schema means `CREATE SCHEMA IF NOT EXISTS "<name>"; SET search_path TO "<name>"`.[^change-schema]

## When an account gets its own schema

`shouldUseSeparateDatabase(config, input)` decides at account creation:[^should-use][^should-use-test]

| `subdomains` | `multiDatabase.mode` | slug given | `useSeparateDatabase` input | Own schema |
| --- | --- | --- | --- | --- |
| `disabled` | any | any | any | no |
| `optional` | `disabled` | any | any | no |
| `optional` | `optional` | yes | `true` | **yes** |
| `optional` | `optional` | yes | `false` | no |
| `optional` | `required` | yes | any | **yes** |
| `optional` | `required` | no | any | no |
| `required` | `disabled` | any | any | no |
| `required` | `optional` | yes | `true` | **yes** |
| `required` | `optional` | yes | `false` | no |
| `required` | `required` | any | any | **yes** (a slug is mandatory when `subdomains` is `required`[^account-schema]) |

`multiDatabase.mode` defaults to `"disabled"`.[^config] In 2b16542 the mode replaced a boolean `multiDatabase.enabled`, a breaking change (`!`), and the decision logic moved into this function.[^commit-multidb]

## What lives where

| Schema | Tables | Created by |
| --- | --- | --- |
| `public` | accounts, account types, account-type i18n, account addresses, account users, account invitations | `runMigrations` when the saas plugin registers[^run-migrations] |
| tenant `s_xxxxxxxx` | files (fastify-s3), users (fastify-user), account users, account invitations, then the application's migrations from `multiDatabase.migrations.path` | `runAccountMigrations`[^run-account-migrations] |

The migrations path defaults to `<slonik.migrations.path || "migrations">/accounts`.[^config] The `accounts` row itself always stays in `public`. A separate-schema tenant's **users, memberships, and invitations** live in its own schema.

## How a request reaches the tenant schema

1. [Account discovery](account-discovery.md) sets `request.dbSchema = account.database` when the account has one.[^discovery-plugin]
2. Handlers that load the account from a route parameter compute `dbSchema = account.database || undefined` themselves. They pass it to `AccountUserService`, `AccountInvitationService`, and fastify-user's `getUserService`.[^invitation-create]
3. `AccountAwareBaseService` takes `(config, database, accountId?, schema?)`, so the schema is chosen per service instance.[^base-service] `AccountService` is always constructed without a schema, and therefore always reads `public`.[^invitation-create]

*Inference:* `GET /my-accounts` queries account users in `request.dbSchema`. On the main app there is no discovered account, so it only sees `public` memberships. A user whose membership lives in a tenant schema would not have that account listed.[^my-accounts] See open questions.

## When a tenant schema is migrated

| Moment | Path | Behaviour |
| --- | --- | --- |
| Account created | `AccountService.postCreate` → `runAccountMigrations`[^account-service] | Skipped when `subdomains` is `"disabled"` or mode is `"disabled"`, and returns early if the account has no `database`. Opens its **own** `pg.Client` from the slonik db config. Built-in tables are always created; application migrations only if the path exists.[^run-account-migrations] |
| Boot | `accountMigrationPlugin`[^migrate-plugin] | Only if the migrations path exists; otherwise it warns and does nothing. Uses one shared client for all accounts, then resets `search_path` to `public` and closes. |

## Invariants and failure behaviour

- `accounts.database` is `UNIQUE`.[^queries] The column became `VARCHAR(24)` in a496ce3; `CREATE TABLE IF NOT EXISTS` does not alter existing tables.[^commit-varchar][^queries] The Zod schema still caps `database` at 10 characters, the length of a generated name.[^account-schema]
- **Migration errors are swallowed.** `runAccountMigrations` logs and returns `false`, and `postCreate` ignores the return value. The account row persists even if its schema was only partially migrated.[^run-account-migrations][^account-service] Boot re-runs every tenant's migrations, which is the natural retry path. *Inference:* this relies on fastify-user's and fastify-s3's table queries and the migration tool being idempotent.
- `preUpdate` only strips `slug` and `domain` when subdomains are disabled. Nothing in the update path regenerates or migrates a schema.[^account-service]
- Deleting an account deletes the row. Nothing in the package drops the tenant schema.[^account-service]

## Operational pages

- Adding or running per-account migrations: [tenant schema migrations runbook](../operations/tenant-schema-migrations.md)
- Boot logs a missing-path warning: [tenant migrations skipped at boot](../troubleshooting/tenant-migrations-skipped-at-boot.md)

## Tests

The `shouldUseSeparateDatabase` matrix is the only test of this system.[^should-use-test] Schema creation and migration are untested; the package has `pg-mem` and a `createDatabase` test helper, but no test uses them.

## Open questions

- Should accounts whose memberships live in a tenant schema appear in `/my-accounts` from the main app?
- Why are `account_users` and `account_invitations` created in `public` as well as in each tenant schema?
- Is dropping a tenant schema on account deletion intentionally left to the application?

[^should-use]: A switch on `subdomains`, then conditions on `multiDatabase.mode`, `data.slug`, and `data.useSeparateDatabase`.
[^should-use-test]: 19 parametrised cases over subdomains × mode × useSeparateDatabase.
[^account-service]: `postCreate` gate, the `preCreate` nanoid generation with the RL comment, and `preUpdate` stripping slug/domain.
[^change-schema]: A single query with `CREATE SCHEMA IF NOT EXISTS` and `SET search_path TO`.
[^run-migrations]: The six core `CREATE TABLE IF NOT EXISTS` queries, run through slonik in a transaction.
[^run-account-migrations]: Queries `createFilesTableQuery`, `createUsersTableQuery`, account users, and invitations; then `migrate({ client }, migrationsPath)` if the path exists; catch returns `false`.
[^migrate-plugin]: `existsSync` gate, loop over `accountService.all(["name", "database"])`, then `changeSchema(client, "public")`.
[^config]: `migrationsPath` fallback and the `multiDatabase` block.
[^queries]: `database VARCHAR(24)`, `UNIQUE (slug)`, `UNIQUE (database)`.
[^account-schema]: `database: z.string().max(10)`; `slug` is non-optional when `subdomains === "required"`.
[^discovery-plugin]: `if (account.database) request.dbSchema = account.database`.
[^invitation-create]: `accountService = new AccountService(config, slonik)`; `dbSchema = account.database || undefined`; services constructed with `dbSchema`.
[^my-accounts]: `new AccountUserService(config, slonik, undefined, dbSchema)`, then `accountService.find({ key: "id", operator: "in", … })`.
[^base-service]: `constructor(config, database, accountId?, schema?)` passes `schema` to `BaseService`.
[^commit-multidb]: The diff replaces `multiDatabase.enabled` with `mode` and moves the decision into `shouldUseSeparateDatabase`.
[^commit-varchar]: Changes the `database` column width in `queries.ts`.
