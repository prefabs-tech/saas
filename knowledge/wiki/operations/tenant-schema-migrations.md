---
type: Runbook
title: Tenant schema migrations
description: For operators of an app built on saas-fastify — where per-account migrations live, how to roll one out to every tenant schema, how to confirm it ran, and what to do when one tenant fails.
tags: [runbook, migrations, multi-tenancy, postgres, fastify]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: config
    resource: repo://packages/fastify/src/config.ts#L5-L51
    title: multiDatabase.migrations.path default
    last_modified: 2026-05-04
  - id: migrate-plugin
    resource: repo://packages/fastify/src/plugins/migratePlugin.ts#L15-L58
    title: accountMigrationPlugin
    last_modified: 2026-05-04
  - id: run-account-migrations
    resource: repo://packages/fastify/src/migrations/runAccountMigrations.ts#L19-L74
    title: runAccountMigrations
    last_modified: 2026-05-04
  - id: account-service
    resource: repo://packages/fastify/src/model/accounts/service.ts#L87-L97
    title: AccountService.postCreate
    last_modified: 2026-05-04
  - id: pkg
    resource: repo://packages/fastify/package.json#L33-L41
    title: "@prefabs.tech/postgres-migrations dependency"
    last_modified: 2026-07-29
  - id: readme-usage
    resource: repo://packages/fastify/README.md#L94-L103
    title: README — migration plugin order
    last_modified: 2025-10-16
---

# Tenant schema migrations

Applies only to accounts that have their own schema (see [tenant schema isolation](../architecture/tenant-schema-isolation.md)). Public-schema application migrations use fastify-slonik's `migrationPlugin` as usual.

## Where migrations live

- Default: `<config.slonik.migrations.path || "migrations">/accounts`. Override it with `saas.multiDatabase.migrations.path`.[^config]
- *Inference:* the path is checked with `existsSync` and so resolves against the API process's working directory.[^migrate-plugin]
- Files are applied by `@prefabs.tech/postgres-migrations` (`migrate({ client }, path)`) inside the tenant schema, after the package's built-in tenant tables.[^run-account-migrations][^pkg] Follow that library's file naming and its forward-only model.

## Rolling out a new tenant migration

1. Add the migration file to the accounts migrations directory. Write it schema-agnostically: `search_path` is already set to the tenant schema, so do not hard-code `public` for tenant tables.[^run-account-migrations]
2. Make sure the API registers `accountMigrationPlugin` after the saas plugin and the app's `migrationPlugin`.[^readme-usage]
3. Deploy and restart the API. On boot the plugin runs migrations for **every account with a `database`**, sequentially, over one connection.[^migrate-plugin]
4. **Verify in the boot logs:**
   - one `Running migrations for account <name>` line per tenant[^migrate-plugin]
   - **no** `Error running account migrations:` output (printed with `console.error`, so look in stderr as well as the structured logger)[^run-account-migrations]
   - **no** `Account migrations path '<path>' does not exists.`, which means nothing ran; see [tenant migrations skipped at boot](../troubleshooting/tenant-migrations-skipped-at-boot.md)[^migrate-plugin]
5. New accounts created after the deploy are migrated during creation.[^account-service]

## When one tenant fails

- Boot **continues** past a failing tenant; the error is caught and logged per account.[^run-account-migrations] The API can run with that tenant on an older schema.
- Fix the cause (data, a non-idempotent statement) and restart. The next boot retries that tenant, and the already-applied tenants are skipped by the migration library's bookkeeping. *(External library behaviour.)*
- If listing accounts or opening the connection fails, the plugin logs `🔴 SaaS: Failed to run account migrations` and **boot fails**.[^migrate-plugin]

## Cautions

- Tenant migrations run **at boot, before the server listens**.[^readme-usage] Boot time grows with the number of tenants.
- Each account's schema is migrated during its **creation request** (`postCreate`), inside the sign-up or `POST /accounts` call.[^account-service]
- No rollback mechanism is provided by the package.

[^config]: `migrationsPath = config.slonik?.migrations?.path || "migrations"`; `multiDatabase.migrations.path` defaults to `` `${migrationsPath}/accounts` ``.
[^migrate-plugin]: `existsSync` gate and warning, per-account log line, loop, catch-and-rethrow.
[^run-account-migrations]: `changeSchema` → built-in queries → `migrate({ client }, migrationsPath)`; `console.error("Error running account migrations:", error)`; `return false`.
[^account-service]: `postCreate` calls `runAccountMigrations` unless subdomains or multiDatabase are disabled.
[^pkg]: `"@prefabs.tech/postgres-migrations": "5.4.3"`.
[^readme-usage]: `migrationPlugin`, then `accountMigrationPlugin`, then `listen`.
