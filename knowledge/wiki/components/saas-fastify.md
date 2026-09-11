---
type: Component
title: "@prefabs.tech/saas-fastify"
description: The Fastify plugin that owns tenant accounts, account types, memberships and invitations — its routes, exports, configuration surface and extension seams.
tags: [component, fastify, backend, multi-tenancy, npm-package]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: pkg
    resource: repo://packages/fastify/package.json#L1-L93
    title: saas-fastify package.json
    last_modified: 2026-07-29
  - id: index
    resource: repo://packages/fastify/src/index.ts#L8-L56
    title: Module augmentation and public exports
    last_modified: 2026-05-04
  - id: plugin
    resource: repo://packages/fastify/src/plugin.ts#L13-L50
    title: Plugin composition root
    last_modified: 2026-05-04
  - id: config-type
    resource: repo://packages/fastify/src/types/config.ts#L26-L137
    title: SaasOptions configuration type
    last_modified: 2026-05-04
  - id: accounts-controller
    resource: repo://packages/fastify/src/model/accounts/controller.ts#L5-L84
    title: Account routes
    last_modified: 2026-07-16
  - id: invitations-controller
    resource: repo://packages/fastify/src/model/accountInvitations/controller.ts#L5-L84
    title: Invitation routes
    last_modified: 2026-07-16
  - id: users-controller
    resource: repo://packages/fastify/src/model/accountUsers/controller.ts#L5-L15
    title: Account user routes
    last_modified: 2026-07-16
  - id: types-controller
    resource: repo://packages/fastify/src/model/accountTypes/controller.ts#L5-L82
    title: Account type routes
    last_modified: 2026-05-04
  - id: users-handlers
    resource: repo://packages/fastify/src/model/accountUsers/handlers/index.ts#L1-L7
    title: Account user handler map
    last_modified: 2026-05-04
  - id: aware-sql
    resource: repo://packages/fastify/src/sqlFactory.ts#L11-L159
    title: AccountAwareSqlFactory
    last_modified: 2026-05-04
  - id: aware-service
    resource: repo://packages/fastify/src/service.ts#L10-L46
    title: AccountAwareBaseService
    last_modified: 2026-05-04
  - id: graphql
    resource: repo://packages/fastify/src/model/accounts/schema.ts#L5-L51
    title: Account GraphQL schema
    last_modified: 2026-05-04
  - id: vite
    resource: repo://packages/fastify/vite.config.ts#L11-L70
    title: Library build config
    last_modified: 2026-07-20
---

# @prefabs.tech/saas-fastify

## Responsibility

It owns the **tenant model** for a Fastify API: accounts, account types, account memberships (account users), and invitations. It also owns the request-time machinery that makes an API multi-tenant: [account discovery](../architecture/account-discovery.md), [tenant schemas](../architecture/tenant-schema-isolation.md), and [SuperTokens overrides](../architecture/supertokens-recipe-overrides.md).

It deliberately does **not** own users, authentication setup, the database connection, mail, or file storage. Those come from `@prefabs.tech/fastify-user`, `-slonik`, `-mailer`, `-s3`, and `-config`, all peer dependencies.[^pkg] It also leaves authorization to the host app (see [request trust boundaries](../security/request-trust-boundaries.md)).

## Entrypoints

| Export | What it is |
| --- | --- |
| `default` | The plugin: core migrations, discovery hook, route groups[^plugin] |
| `accountMigrationPlugin` | Separate plugin that migrates every tenant schema at boot[^index] |
| `supertokensRecipesConfig` | Recipe overrides for `config.user.supertokens.recipes`[^index] |
| `AccountService`, `AccountInvitationService`, `AccountUserService`, `AccountTypeService` | Data services[^index] |
| `AccountAwareBaseService`, `AccountAwareSqlFactory` | Base classes for the host app's own tenant-scoped tables[^index] |
| `accountRoutes`, `accountInvitationRoutes`, `accountUserRoutes` | Route plugins, for manual registration[^index] |
| `accountSchema`, `accountResolver` | GraphQL type definitions and resolvers, **not** registered by the plugin[^index][^graphql] |
| constants and types | Header name, role names, `SaasConfig`, and entity types[^index] |

Importing the package augments three types:[^index]

- Fastify's `FastifyContextConfig` gains `saas.exclude`.
- `FastifyRequest` gains `account` and `authEmailPrefix`.
- `@prefabs.tech/fastify-config`'s `ApiConfig` gains `saas: SaasConfig`.

## HTTP surface

All paths are under `saas.routePrefix`. "Session" means `preHandler: fastify.verifySession()`; "Excluded" means `config.saas.exclude`.

| Method & path | Session | Excluded |
| --- | --- | --- |
| `GET /accounts`, `POST /accounts` | ✓ | |
| `GET/PUT/DELETE /accounts/:id` (uuid) | ✓ | |
| `PUT /accounts/:id/users`, which uses the **same** `update` handler as `PUT /accounts/:id` | ✓ | |
| `GET /my-accounts` | ✓ | ✓ |
| `GET /my-account`, `PUT /my-account` | ✓ | |
| `GET/POST /accounts/:accountId/invitations` | ✓ | |
| `POST /accounts/:accountId/invitations/:id/resend` and `/revoke`; `DELETE …/:id` | ✓ | |
| `GET /accounts/:accountId/invitations/token/:token` | | ✓ |
| `POST /accounts/:accountId/invitations/token/:token` (sign-up) | | ✓ |
| `POST /accounts/:accountId/invitations/join/:token` | ✓ | ✓ |
| `GET /accounts/:accountId/users` | ✓ | |
| `GET /account-types`, `/account-types/all`, `/account-types/:id` | | ✓ |
| `POST /account-types`, `PUT/DELETE /account-types/:id` | ✓ | ✓ |

[^accounts-controller][^invitations-controller][^users-controller][^types-controller]

The handler maps also contain `accountInvitation.list` and `accountUser.list`, which support pagination, filters, and sort, but **no route uses them**.[^users-handlers][^config-type] They are reachable only through a custom route.

## Extension seams

| Seam | How |
| --- | --- |
| Replace any handler | `saas.handlers.{account,accountInvitation,accountType,accountUser}.<name>`. Each controller uses `handlersConfig?.x \|\| handlers.x`.[^config-type][^accounts-controller] This is the place to add authorization. |
| Drop a route group | `saas.routes.<group>.disabled: true`[^plugin] |
| Rename tables | `saas.tables.<name>.name`; defaults are `__accounts`, `__account_users`, …[^config-type] |
| After an invitation is accepted | `saas.invitation.postAccept(request, invitation, user)`[^config-type] |
| Invitation email | `saas.invitation.emailOverrides.{subject,templateName}`, `saas.invitation.acceptLinkPath`[^config-type] |
| Tenant-scoped application table | Extend `AccountAwareBaseService` with `accountId`. `AccountAwareSqlFactory` appends `<alias>.account_id = <accountId>` to every WHERE clause it builds, so the table needs an `account_id` column.[^aware-service][^aware-sql] |
| GraphQL | Merge `accountSchema` and `accountResolver` into the host's mercurius schema. The schema types ids as `Int` while account ids are UUID strings.[^graphql] |

## Build and publish

- `vite build` emits CJS and ES bundles; peers, dependencies, `node:fs`, and every `supertokens-node` subpath are external. `tsc --emitDeclarationOnly` output is moved from `dist/src` to `dist/types`.[^pkg][^vite]
- Only `dist` is published.[^pkg] Versioning and publishing: [release workflows](../ci/release-workflows.md).

## Tests

`vitest run --coverage` runs 5 files and 85 tests: plugin registration, `getHost`, `shouldUseSeparateDatabase`, and the slug and domain Zod schemas. All passed locally on 2026-09-11 without coverage. No test touches a database, although `pg-mem` and a helper are present.

## Related

- Domain: [accounts](../domain/accounts.md), [roles and membership](../domain/account-roles-and-membership.md), [invitations](../domain/account-invitations.md)
- Flows: [plugin registration order](../architecture/plugin-registration-order.md), [sign-up and account creation](../architecture/signup-account-creation.md), [invitation flow](../architecture/invitation-flow.md)
- Consumers: [saas-react](saas-react.md), [saas-vue](saas-vue.md)

[^pkg]: `exports`, `files: ["dist"]`, the `build`/`test`/`typecheck` scripts, and `peerDependencies`.
[^index]: `declare module` blocks and the `export` list.
[^plugin]: Conditional `fastify.register(...)` calls gated by `routes?.<group>?.disabled`.
[^config-type]: The `handlers`, `invitation`, `routes`, and `tables` blocks of `SaasOptions`.
[^accounts-controller]: Nine account routes, with `/my-accounts` excluded.
[^invitations-controller]: Eight invitation routes and their `preHandler`/`config` options.
[^users-controller]: One route, `GET /accounts/:accountId(uuid)/users`.
[^types-controller]: Six routes, all excluded; the mutating ones require a session.
[^users-handlers]: `{ getByAccountId, list }`.
[^aware-sql]: `getAccountIdFilterFragment` via `getAdditionalFilterFragments`.
[^aware-service]: The constructor stores `accountId`; the `factory` getter sets `factory.accountId`.
[^graphql]: `account(id: Int!)`, `deleteAccount(id: Int!)`; `@auth` directives.
[^vite]: `formats: ["cjs", "es"]`; the `external` list includes `/supertokens-node+/`.
