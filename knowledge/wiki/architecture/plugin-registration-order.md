---
type: Architecture
title: Plugin registration order
description: The order a consuming Fastify app must register saas-fastify and its peer plugins in, and what the saas plugin does at register time, at onReady, and in the separate account-migration plugin.
tags: [fastify, boot, ordering, migrations, supertokens]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: readme-usage
    resource: repo://packages/fastify/README.md#L29-L116
    title: saas-fastify README — configuration and registration example
    last_modified: 2025-10-16
  - id: plugin
    resource: repo://packages/fastify/src/plugin.ts#L13-L50
    title: saas-fastify plugin composition root
    last_modified: 2026-05-04
  - id: create-roles
    resource: repo://packages/fastify/src/lib/createSaasRoles.ts#L9-L13
    title: createSaasRoles
    last_modified: 2024-12-10
  - id: run-migrations
    resource: repo://packages/fastify/src/migrations/runMigrations.ts#L14-L36
    title: runMigrations — core tables in one transaction
    last_modified: 2026-05-04
  - id: migrate-plugin
    resource: repo://packages/fastify/src/plugins/migratePlugin.ts#L15-L58
    title: accountMigrationPlugin
    last_modified: 2026-05-04
  - id: run-account-migrations
    resource: repo://packages/fastify/src/migrations/runAccountMigrations.ts#L19-L74
    title: runAccountMigrations
    last_modified: 2026-05-04
  - id: index-exports
    resource: repo://packages/fastify/src/index.ts#L38-L56
    title: saas-fastify public exports
    last_modified: 2026-05-04
  - id: accounts-controller
    resource: repo://packages/fastify/src/model/accounts/controller.ts#L5-L84
    title: Account routes use fastify.verifySession at registration
    last_modified: 2026-07-16
  - id: plugin-test
    resource: repo://packages/fastify/__test__/plugin.test.ts#L11-L47
    title: Plugin registration test
    last_modified: 2026-05-04
  - id: send-invitation
    resource: repo://packages/fastify/src/lib/sendInvitation.ts#L30-L58
    title: sendInvitation uses fastify.mailer
    last_modified: 2026-05-04
---

# Plugin registration order

## Responsibility

saas-fastify is not a standalone server. It is a Fastify plugin that assumes its peers are already registered on the instance, and it ships a **second**, separately registered plugin for per-account migrations. Registering either one in the wrong place fails at boot or leaves tenant schemas unmigrated.

## Sanctioned order

The README's registration sequence:[^readme-usage]

1. `@prefabs.tech/fastify-config`: `fastify.config`
2. `@prefabs.tech/fastify-slonik`: `fastify.slonik`
3. `@prefabs.tech/fastify-mailer`: `fastify.mailer`
4. `@prefabs.tech/fastify-s3`
5. `@prefabs.tech/fastify-user`: SuperTokens and `fastify.verifySession`
6. **saas plugin** (default export)
7. fastify-slonik `migrationPlugin`: the application's own migrations
8. **`accountMigrationPlugin`**: per-account schema migrations
9. `listen`

`config.user.supertokens.recipes` must be set to the exported `supertokensRecipesConfig`,[^readme-usage] or the discovered account never reaches authentication (see [SuperTokens recipe overrides](supertokens-recipe-overrides.md)).

The README snippet calls `api.register(...)` for steps 6 and 8, although the instance is named `fastify`; the variable name is a typo in the README.[^readme-usage]

## What the saas plugin does, in order

1. Adds an `onReady` hook that runs `createSaasRoles`. It creates the SuperTokens roles `SAAS_ACCOUNT_ADMIN`, `SAAS_ACCOUNT_OWNER`, and `SAAS_ACCOUNT_MEMBER` with no permissions.[^plugin][^create-roles]
2. `await runMigrations(config, slonik)`: creates the core tables `IF NOT EXISTS` in **one transaction**. Foreign keys dictate the order: account types, account-type i18n, accounts, account users, account addresses, account invitations.[^run-migrations]
3. Registers [account discovery](account-discovery.md), a global `onRequest` hook.[^plugin]
4. Registers the route plugins under `saas.routePrefix` (accounts, account invitations, account users, account types), skipping any whose `saas.routes.<name>.disabled` is true.[^plugin]

## Why the order matters

| Dependency | Where it is read | Consequence of misordering |
| --- | --- | --- |
| `fastify.config`, `fastify.slonik` | Destructured at the top of the plugin body, used immediately by `runMigrations`[^plugin] | Registration throws |
| `fastify.verifySession` | Called while each route is *defined*[^accounts-controller] | Registration throws. The plugin test has to decorate `verifySession` itself to register at all[^plugin-test] |
| SuperTokens initialised | `createSaasRoles` runs at `onReady`, not at register[^plugin] | Role creation happens once the app is ready |
| `fastify.mailer` | Invitation emails at request time[^send-invitation] | Invitations fail at runtime rather than at boot |
| Core `accounts` table | `accountMigrationPlugin` reads `accountService.all(["name", "database"])`[^migrate-plugin] | Must come after the saas plugin |

*Inference:* the core tables are created during saas registration, before step 7, so the application's own migrations can reference them. The README places `accountMigrationPlugin` after the application migrations but does not say why; see open questions.

`accountMigrationPlugin` is **not** registered by the default plugin. It is a separate export that the application must register.[^index-exports]

## Failure behaviour at boot

- A `runMigrations` failure rejects the saas plugin registration. *Inference:* the transaction rolls back and the app does not start.[^run-migrations]
- `accountMigrationPlugin` has three distinct outcomes:[^migrate-plugin][^run-account-migrations]
  - **Migrations path missing:** logs `Account migrations path '<path>' does not exists.` and skips *every* account, including the package's built-in tenant tables. See [tenant migrations skipped at boot](../troubleshooting/tenant-migrations-skipped-at-boot.md).
  - **A single account fails:** `runAccountMigrations` catches the error, prints it with `console.error`, returns `false`, and the loop continues. One broken tenant does not stop boot.
  - **Anything else throws** (listing accounts, opening the pg client): logs `🔴 SaaS: Failed to run account migrations` and rethrows, so boot fails.

## Configuration

| Key | Effect |
| --- | --- |
| `saas.routePrefix` | Prefix for all four route plugins |
| `saas.routes.{accounts,accountInvitations,accountUsers,accountTypes}.disabled` | Skip registering that route group |
| `saas.tables.*.name` | Table names used by the migrations (defaults `__accounts`, `__account_users`, …) |
| `saas.multiDatabase.migrations.path` | Directory `accountMigrationPlugin` requires to exist |

## Tests

`__test__/plugin.test.ts` mocks `runMigrations` and `@prefabs.tech/fastify-user`, decorates `verifySession`, and asserts that registration resolves.[^plugin-test] Nothing tests the ordering against real peers.

## Open questions

- Why must `accountMigrationPlugin` run after the application's `migrationPlugin`? Do tenant migrations depend on public-schema objects the application creates?

[^readme-usage]: The README "Usage" block and its `supertokensRecipesConfig` configuration snippet.
[^plugin]: `addHook("onReady", createSaasRoles)`, `await runMigrations`, `register(accountDiscoveryPlugin)`, then the conditional route registrations.
[^create-roles]: Three `UserRoles.createNewRoleOrAddPermissions(role, [])` calls.
[^run-migrations]: A single `connection.transaction` running the six `create*TableQuery` queries in sequence.
[^migrate-plugin]: `existsSync(migrationsPath)` gate, loop over accounts, `changeSchema(client, "public")`, `client.end()`, and a catch that logs and rethrows.
[^run-account-migrations]: The try/catch returns `false` on error; `finally` ends a locally created client.
[^index-exports]: `accountMigrationPlugin` is exported from `./plugins/migratePlugin` alongside the default plugin.
[^accounts-controller]: Every account route passes `preHandler: fastify.verifySession()`.
[^plugin-test]: `fastify.decorate("verifySession", …)` before `fastify.register(plugin)`.
[^send-invitation]: `const { config, log, mailer } = fastify; mailer.sendMail(...)`.
