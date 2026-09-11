---
type: Security
title: Request trust boundaries
description: Which saas-fastify routes require a session, which inputs decide the tenant, what the package does and does not check (authentication, tenant resolution, authorization), how invitation tokens and identities are protected, and where secrets enter CI.
tags: [security, authentication, authorization, multi-tenancy, sessions, secrets]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: accounts-controller
    resource: repo://packages/fastify/src/model/accounts/controller.ts#L5-L84
    title: Account routes
    last_modified: 2026-07-16
  - id: invitations-controller
    resource: repo://packages/fastify/src/model/accountInvitations/controller.ts#L5-L84
    title: Invitation routes
    last_modified: 2026-07-16
  - id: types-controller
    resource: repo://packages/fastify/src/model/accountTypes/controller.ts#L5-L82
    title: Account type routes
    last_modified: 2026-05-04
  - id: discovery-plugin
    resource: repo://packages/fastify/src/plugins/accountDiscoveryPlugin.ts#L14-L68
    title: Discovery inputs
    last_modified: 2026-05-04
  - id: accounts-handlers
    resource: repo://packages/fastify/src/model/accounts/handlers/getById.ts#L6-L14
    title: Representative account handler (no scoping)
    last_modified: 2026-05-04
  - id: resend
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/resend.ts#L22-L28
    title: Account/param mismatch check
    last_modified: 2026-05-04
  - id: config-type
    resource: repo://packages/fastify/src/types/config.ts#L29-L63
    title: Handler override config
    last_modified: 2026-05-04
  - id: invitation-service
    resource: repo://packages/fastify/src/model/accountInvitations/service.ts#L37-L95
    title: Token lookup with UUID validation
    last_modified: 2026-05-04
  - id: queries
    resource: repo://packages/fastify/src/migrations/queries.ts#L121-L143
    title: Invitation token column
    last_modified: 2026-05-04
  - id: readme-cors
    resource: repo://packages/fastify/README.md#L154-L170
    title: CORS header requirement
    last_modified: 2025-10-16
  - id: gitignore
    resource: repo://.gitignore#L1-L2
    title: .env files ignored
  - id: env-example
    resource: repo://.env.example
    title: .env.example variable names
    last_modified: 2024-12-09
  - id: shipjs-trigger
    resource: repo://.github/workflows/shipjs-trigger.yml#L31-L35
    title: Release workflow secrets
    last_modified: 2026-05-19
  - id: shipjs-prepare
    resource: repo://.github/workflows/shipjs-manual-prepare.yml#L1-L28
    title: Prepare workflow trigger and secrets
    last_modified: 2026-04-17
---

# Request trust boundaries

This page records what the code **does**. Choosing controls for a deployment is up to the host application.

## Boundary 1: authentication (session)

Package routes use fastify-user's `verifySession()` as a `preHandler`, except:[^accounts-controller][^invitations-controller][^types-controller]

| Unauthenticated route | Purpose |
| --- | --- |
| `GET /account-types`, `/account-types/all`, `/account-types/:id` | Read the account-type catalogue |
| `GET /accounts/:accountId/invitations/token/:token` | Look up an invitation by token (accept page) |
| `POST /accounts/:accountId/invitations/token/:token` | Sign up through an invitation |

Session checks are extended by [SuperTokens overrides](../architecture/supertokens-recipe-overrides.md#session-guards): disabled or deleted users are refused and their sessions revoked.

## Boundary 2: tenant resolution

The tenant is derived from **request headers**:[^discovery-plugin]

- the hostname from `Referer`, `Origin`, or `Host`, in that order of preference
- the account id from `x-account-id`

Discovery establishes *which* account a request addresses. **It does not establish that the session user belongs to that account.**[^discovery-plugin]

Browser frontends on a different origin need CORS to allow `X-Account-Id`.[^readme-cors]

## Boundary 3: authorization, which is left to the host

- The account CRUD handlers (`GET/PUT/DELETE /accounts/:id`, `GET/POST /accounts`) require a session. They have **no role, membership, or account scoping of their own**.[^accounts-controller][^accounts-handlers]
- Invitation and account-user handlers check one tenant-related thing: if an account was discovered, `:accountId` must equal it, otherwise 400.[^resend] They do not check the caller's account role.
- The package's role constants and membership rows ([roles and membership](../domain/account-roles-and-membership.md)) are **data the host can authorize against**. The package does not consult them itself.
- **Seams for adding authorization:**
  - replace handlers through `saas.handlers.*`[^config-type]
  - disable a route group with `saas.routes.*.disabled` and register guarded routes
  - add a `preHandler` on the host instance

## Invitation tokens

- Tokens are database-generated UUIDs with a unique constraint.[^queries]
- A lookup rejects any string that does not look like a UUID before querying.[^invitation-service]
- Tokens are removed from every management response (create, list, resend, revoke, delete). See [account invitations](../domain/account-invitations.md#rules).
- Acceptance additionally requires, depending on the path, either a matching session user id (join) or a matching email (sign-up). See [invitation flow](../architecture/invitation-flow.md).

## Identity isolation between tenants

For accounts with a slug, SuperTokens identities are namespaced by an `<accountId>_` email prefix. The same person has separate credentials per slugged tenant. See [SuperTokens recipe overrides](../architecture/supertokens-recipe-overrides.md#per-account-identity-prefix-user-isolation). Data isolation for accounts with their own schema is covered in [tenant schema isolation](../architecture/tenant-schema-isolation.md).

## Secrets

- The packages read **no environment variables** at runtime. Database, SuperTokens, and mailer credentials reach them through the host's `ApiConfig` and are configured in the host application.
- `.env*` files are git-ignored except `.env.example`, which names `GITHUB_TOKEN` and `NPM_TOKEN` for local shipjs use.[^gitignore][^env-example]
- CI secrets are listed below by name only.[^shipjs-trigger][^shipjs-prepare] See [release workflows](../ci/release-workflows.md).

  | Secret | Used by |
  | --- | --- |
  | `GITHUB_TOKEN` | both release workflows |
  | `NPM_AUTH_TOKEN` | publish (`shipjs trigger`) |
  | `SLACK_INCOMING_HOOK` | both release workflows |

- The prepare workflow runs from an issue comment starting with `@shipjs prepare`. Its job condition compares `author_association` with lowercase `'member'` or `'owner'`.[^shipjs-prepare]

## Open questions

- Is the host application always expected to add authorization in front of the account CRUD routes? If so, should the package document that or ship a guard?
- GitHub reports `author_association` in uppercase (`MEMBER`, `OWNER`). Does the lowercase comparison in the prepare workflow ever match? *(External GitHub behaviour, not verified here.)*

[^accounts-controller]: `preHandler: fastify.verifySession()` on every account route.
[^invitations-controller]: The GET and POST token routes have no `preHandler`.
[^types-controller]: The three GET routes have no `preHandler`.
[^discovery-plugin]: `headers.referer || headers.origin || headers.host`, `headers[ACCOUNT_HEADER_NAME]`; no user lookup.
[^accounts-handlers]: `service.findById(id)`, `reply.send(data)`.
[^resend]: `if (account && account.id != requestParameters.accountId) → 400`.
[^config-type]: `handlers.account`, `.accountInvitation`, `.accountType`, `.accountUser`.
[^invitation-service]: `validateUUID(token)` before `getFindOneSql`.
[^queries]: `token UUID DEFAULT gen_random_uuid() UNIQUE`.
[^readme-cors]: `allowedHeaders` includes `'X-Account-Id'`.
[^gitignore]: `**/.env*` and `!**/.env.example`.
[^env-example]: Two keys with placeholder values.
[^shipjs-trigger]: The `env:` block of the `npx shipjs trigger` step.
[^shipjs-prepare]: The `if:` on `issue_comment` and the `env:` block.
