---
type: Troubleshooting
title: Tenant migrations skipped at boot
description: Symptom → cause → fix when the API logs "Account migrations path ... does not exists." and tenant schemas are missing tables or new per-account migrations.
tags: [troubleshooting, migrations, multi-tenancy, boot]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: migrate-plugin
    resource: repo://packages/fastify/src/plugins/migratePlugin.ts#L21-L53
    title: accountMigrationPlugin path gate
    last_modified: 2026-05-04
  - id: run-account-migrations
    resource: repo://packages/fastify/src/migrations/runAccountMigrations.ts#L40-L67
    title: runAccountMigrations
    last_modified: 2026-05-04
  - id: config
    resource: repo://packages/fastify/src/config.ts#L5-L51
    title: migrations path default
    last_modified: 2026-05-04
---

# Tenant migrations skipped at boot

## Symptoms

- A boot log warning: `Account migrations path '<path>' does not exists.`[^migrate-plugin]
- No `Running migrations for account …` lines at all.[^migrate-plugin]
- A tenant's schema lacks a table added by a recent per-account migration.
- Or, for tenants created before the package's built-in tenant tables existed, the schema lacks the users, files, account-users, or invitations tables.

## Cause

`accountMigrationPlugin` checks the migrations path first. **If the directory does not exist, it skips every account entirely**, including the package's own built-in tenant tables, not only the application's migration files.[^migrate-plugin][^run-account-migrations]

The path is `saas.multiDatabase.migrations.path`, defaulting to `<slonik.migrations.path || "migrations">/accounts`.[^config] *Inference:* it is relative to the process's working directory, so a different start directory, or a build that does not copy `migrations/accounts`, triggers this.

At account *creation* the built-in tables are created regardless of the path.[^run-account-migrations] New tenants therefore look fine while existing tenants silently miss updates.

## Fix

1. Create the directory the warning names, even if empty, or set `saas.multiDatabase.migrations.path` to the directory that exists in the deployed artifact.
2. Restart the API and confirm one `Running migrations for account <name>` line per tenant with a schema.[^migrate-plugin]
3. Check stderr for `Error running account migrations:`. Per-tenant failures are logged and skipped, not fatal.[^run-account-migrations]

See the [tenant schema migrations runbook](../operations/tenant-schema-migrations.md).

[^migrate-plugin]: `if (existsSync(migrationsPath)) { … } else { log.warn(...) }`; the per-account `log.info`.
[^run-account-migrations]: Built-in queries always run; `migrate()` only when the path exists; catch → `console.error`.
[^config]: `multiDatabase.migrations.path` default.
