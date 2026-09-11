---
type: Convention
title: Model module layout and handler conventions
description: The observed (not tool-enforced) shape every saas-fastify model follows — controller, per-file handlers, service, SQL factory — plus the handler error shape the frontends depend on, and how to add a new model or frontend hook.
tags: [conventions, fastify, handlers, services, react, vue]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: invitations-controller
    resource: repo://packages/fastify/src/model/accountInvitations/controller.ts#L5-L84
    title: Controller with handler overrides
    last_modified: 2026-07-16
  - id: invitations-handlers
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/index.ts#L1-L21
    title: Handler map
    last_modified: 2026-05-04
  - id: invitations-service
    resource: repo://packages/fastify/src/model/accountInvitations/service.ts#L16-L96
    title: Service with table/sqlFactoryClass getters and preCreate hook
    last_modified: 2026-05-04
  - id: invitations-sql
    resource: repo://packages/fastify/src/model/accountInvitations/sqlFactory.ts#L15-L57
    title: SQL factory with fixed alias
    last_modified: 2026-05-04
  - id: config-type
    resource: repo://packages/fastify/src/types/config.ts#L29-L63
    title: handlers config typed from handler maps
    last_modified: 2026-05-04
  - id: resend
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/resend.ts#L12-L97
    title: Representative account-scoped handler
    last_modified: 2026-05-04
  - id: slonik-hooks
    resource: https://www.npmjs.com/package/@prefabs.tech/fastify-slonik/v/0.94.1
    title: "@prefabs.tech/fastify-slonik 0.94.1 BaseService (create/update call preProcess hooks named pre<Action>/post<Action>)"
  - id: react-use-mutation
    resource: repo://packages/react/src/api/common/UseMutation.ts#L37-L62
    title: React mutation treats status ERROR as failure
    last_modified: 2026-05-04
  - id: react-hook
    resource: repo://packages/react/src/hooks/accounts/invitations/UseAddInvitationMutation.ts#L1-L26
    title: Representative React endpoint hook
    last_modified: 2026-05-04
  - id: vue-api
    resource: repo://packages/vue/src/api/AccountInvitations.ts#L15-L29
    title: Representative Vue API function
    last_modified: 2026-05-04
  - id: vue-store
    resource: repo://packages/vue/src/stores/AccountInvitations.ts#L15-L27
    title: Vue store re-exporting API functions
    last_modified: 2026-05-04
---

# Model module layout and handler conventions

**Observed, not enforced.** Every existing model follows these patterns and no tool checks them. Deviating makes the handler-override seam and the frontends inconsistent.

## Backend: one directory per model

```
packages/fastify/src/model/<modelName>/
  controller.ts      # route plugin; registers routes
  handlers/
    index.ts         # default export: { name: handler, ... }
    <name>.ts        # one handler per file
  service.ts         # extends BaseService or AccountAwareBaseService
  sqlFactory.ts      # extends DefaultSqlFactory or AccountAwareSqlFactory
```

| Piece | Convention |
| --- | --- |
| Controller | Reads `fastify.config.saas.handlers.<model>` and registers each route with `handlersConfig?.<name> \|\| handlers.<name>`.[^invitations-controller] |
| Handler map | The `SaasOptions.handlers` type is written as `typeof handlers.<name>`, so every new handler must be added to the map **and** to the config type.[^invitations-handlers][^config-type] |
| Service | `get table()` returns `saasConfig.tables.<model>.name`; `get sqlFactoryClass()` returns the factory; business rules live in `preCreate`/`postCreate`/`preUpdate`, which fastify-slonik's `BaseService` calls by name.[^invitations-service][^slonik-hooks] |
| SQL factory | Fixed `tableIdentifier` alias (for example `account_invitations`) so joins and the account filter can reference it; joins use `createTableFragment(name, this.schema)` so they follow the tenant schema.[^invitations-sql] |
| Types | `src/types/<model>.ts` with `<Model>`, `<Model>CreateInput`, `<Model>UpdateInput`. |

## Backend: handler shape for account-scoped routes

The same sequence repeats in the invitation and account-user handlers:[^resend]

1. `account = request.account`. If it is set and `account.id != params.accountId`, reply **400**.
2. Otherwise load the account by `params.accountId`; if it is missing, reply **404** `"Account not found"`.
3. `dbSchema = account.database || undefined`; construct services with `(config, slonik, account.id, dbSchema)`.
4. Wrap the work in try/catch; on error, log and reply **500** `{ message: "Oops! Something went wrong", status: "ERROR", statusCode: 500 }`.
5. Delete `token` (and any other secret field) before sending.

Business errors use `{ message, status: "ERROR", statusCode }`, usually 422. Service-level validation throws plain objects `{ message, name: "ERROR_…", statusCode }`.

## The cross-package contract on errors

The React `useQuery` and `useMutation` treat **any 2xx body with `status: "ERROR"`** as a failure.[^react-use-mutation] A handler that replies 200 with `status: "ERROR"` therefore still surfaces as an error in React. At least one handler relies on this.[^resend] Keep the `status` field on error bodies.

## Frontends: one hook or function per endpoint

- **React:** `hooks/<area>/Use<Verb><Thing><Query|Mutation>.ts` wraps `useQuery` or `useMutation` with the URL and method.[^react-hook]
- **Vue:** `api/<Area>.ts` exports async functions taking `apiBaseUrl`,[^vue-api] and `stores/<Area>.ts` is a Pinia setup store that re-exports them.[^vue-store]

## Adding a new model

1. Create the backend directory as above, a `create<Model>TableQuery` in `migrations/queries.ts`, and call it from `runMigrations`, and from `runAccountMigrations` if it lives in tenant schemas. See [tenant schema isolation](../architecture/tenant-schema-isolation.md).
2. Add a `tables.<model>` default in `config.ts`, `handlers.<model>` and `routes.<model>.disabled` in `types/config.ts`, and a conditional register in `plugin.ts`.
3. Decide per route whether it needs `verifySession()` and `config.saas.exclude` (see [account discovery](../architecture/account-discovery.md)).
4. Export the service from `src/index.ts`.
5. Add matching hooks (React) and API functions and a store (Vue).

[^invitations-controller]: `const handlersConfig = fastify.config.saas?.handlers?.accountInvitation`; `handlersConfig?.create || handlers.create`.
[^invitations-handlers]: `export default { create, getByAccountId, … }`.
[^invitations-service]: The `table` and `sqlFactoryClass` getters, `preCreate`.
[^invitations-sql]: `tableIdentifier = sql.identifier(["account_invitations"])`; `getUserTableFragment` uses `this.schema`.
[^config-type]: `accountInvitation?: { create?: typeof accountInvitationHandlers.create; … }`.
[^resend]: Account resolution, 400/404 replies, `dbSchema`, try/catch 500, `delete data.token`.
[^slonik-hooks]: `create()` and `update()` call `preProcess(...)`, which looks up `pre<Action>` via `getHook`; read in the installed dist.
[^react-use-mutation]: `if ("status" in response.data && response.data.status === "ERROR") onError(...)`.
[^react-hook]: `useMutation` plus `` `accounts/${accountId}/invitations` ``.
[^vue-api]: `addInvitation(accountId, data, apiBaseUrl)`.
[^vue-store]: `defineStore("invitation", () => ({ addInvitation, … }))`.
