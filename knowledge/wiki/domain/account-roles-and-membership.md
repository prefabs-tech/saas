---
type: Domain Concept
title: Account roles and membership
description: How a user belongs to an account (the account_users row and its account-scoped role), which role each entry path assigns, and how that differs from the user's global SuperTokens roles.
tags: [domain, roles, membership, account-users, supertokens]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: constants
    resource: repo://packages/fastify/src/constants.ts#L6-L8
    title: SAAS role constants
    last_modified: 2026-05-04
  - id: create-roles
    resource: repo://packages/fastify/src/lib/createSaasRoles.ts#L9-L13
    title: createSaasRoles
    last_modified: 2024-12-10
  - id: queries
    resource: repo://packages/fastify/src/migrations/queries.ts#L100-L119
    title: account_users DDL
    last_modified: 2026-05-04
  - id: users-sql
    resource: repo://packages/fastify/src/model/accountUsers/sqlFactory.ts#L32-L96
    title: AccountUserSqlFactory
    last_modified: 2026-05-04
  - id: signup-post
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/emailPasswordSignUpPost.ts#L55-L105
    title: Role selection at sign-up
    last_modified: 2026-07-16
  - id: signup
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/emailPasswordSignUp.ts#L80-L111
    title: Membership and SuperTokens roles at sign-up
    last_modified: 2026-05-04
  - id: thirdparty
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/thirdPartySignInUp.ts#L67-L114
    title: Membership at third-party sign-up
    last_modified: 2026-07-16
  - id: invitation-create
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/create.ts#L84-L129
    title: Invitation role default and existing-member check
    last_modified: 2026-05-04
  - id: join
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/join.ts#L72-L83
    title: Join creates membership with invitation role
    last_modified: 2026-05-04
  - id: invitation-signup
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/signup.ts#L102-L109
    title: Invitation sign-up passes invitation role
    last_modified: 2026-05-04
  - id: my-accounts
    resource: repo://packages/fastify/src/model/accounts/handlers/myAccounts.ts#L20-L42
    title: myAccounts via memberships
    last_modified: 2026-05-04
  - id: react-constants
    resource: repo://packages/react/src/constants.ts#L28-L33
    title: Frontend default role list
    last_modified: 2026-05-04
  - id: react-invitation-form
    resource: repo://packages/react/src/components/account/Invitations/InvitationForm.tsx#L43-L45
    title: Invitation role picker source
    last_modified: 2026-05-12
  - id: react-disable
    resource: repo://packages/react/src/hooks/accounts/users/UseDisableUserMutation.ts#L16-L21
    title: Disable user calls /users/:id/disable
    last_modified: 2026-05-04
---

# Account roles and membership

## Two different kinds of role

| | Global user roles | Account role |
| --- | --- | --- |
| Where it lives | SuperTokens UserRoles | `account_users.role_id`, one row per (account, user)[^queries] |
| Typical value | `config.user.role` or `ROLE_USER`[^signup-post] | `SAAS_ACCOUNT_OWNER` or `SAAS_ACCOUNT_MEMBER`[^constants] |
| Assigned by | sign-up overrides[^signup] | sign-up, invitations[^signup][^join] |

The three `SAAS_ACCOUNT_*` names are *also* created as SuperTokens roles at `onReady`, with no permissions.[^create-roles] Nothing in this repository assigns them as global SuperTokens roles; the account role is stored only in `account_users`.[^signup][^join] `SAAS_ACCOUNT_ADMIN` is created but never assigned by any code path here, and the frontends' default role list omits it.[^create-roles][^react-constants]

## Membership: the `account_users` row

- Columns: `account_id`, `user_id`, `role_id`, `disabled`, `date_start`, `date_end`, timestamps; `UNIQUE (account_id, user_id)`.[^queries]
- The insert uses `ON CONFLICT (account_id, user_id) DO NOTHING` and omits falsy values. **Joining twice is a no-op; it cannot change an existing member's role.**[^users-sql]
- The user list for an account joins the users table in the same schema and returns the membership role as `role`.[^users-sql]
- Package code writes neither `disabled` nor `date_start`/`date_end`. The list query returns the dates.[^users-sql]
- `/my-accounts` is derived from membership rows for the session user.[^my-accounts]

## Which role each path assigns

| Path | Account role |
| --- | --- |
| Main-app sign-up (creates the account) | `SAAS_ACCOUNT_OWNER`[^signup-post] |
| Email sign-up on a tenant host | `SAAS_ACCOUNT_MEMBER` (default `saasAccountRole`)[^signup-post][^signup] |
| Third-party sign-up with a discovered account | always `SAAS_ACCOUNT_MEMBER`[^thirdparty] |
| Invitation (join or sign-up) | the invitation's `role`, which defaults to `SAAS_ACCOUNT_MEMBER` when the invitation was created[^invitation-create][^join][^invitation-signup] |
| `POST /accounts` (admin) | none: no membership is created |

The invitation role picker offers `saasAccountRoles` from the frontend config, defaulting to `[SAAS_ACCOUNT_OWNER, SAAS_ACCOUNT_MEMBER]`.[^react-invitation-form][^react-constants] The backend accepts any string.[^invitation-create]

## Rules around membership

- A person who is already a member of an account cannot be invited to it; the create handler returns 422.[^invitation-create]
- **Disabling a user is not account-scoped.** The frontends call fastify-user's `PUT /users/:id/disable` and `/enable`,[^react-disable] which act on the user record rather than on `account_users.disabled`. [SuperTokens session guards](../architecture/supertokens-recipe-overrides.md#session-guards) then block that user.
- **Roles are not enforced by the package's handlers.** See [request trust boundaries](../security/request-trust-boundaries.md).

## Open questions

- What is `SAAS_ACCOUNT_ADMIN` for, and who should hold it?
- Are `account_users.disabled`, `date_start`, and `date_end` intended for per-account suspension or time-boxed membership?
- Should a third-party sign-up on a tenant host ever produce a role other than member?

[^constants]: `ROLE_SAAS_ACCOUNT_ADMIN`, `_OWNER`, `_MEMBER`.
[^create-roles]: `UserRoles.createNewRoleOrAddPermissions(role, [])` for all three.
[^queries]: `account_users` columns and the unique constraint.
[^users-sql]: `getCreateSql` with `ON CONFLICT … DO NOTHING`; `getListSql` and `getUsersSql` select `role_id as role`.
[^signup-post]: `roles = [config.user.role || ROLE_USER]`, `saasAccountRole = MEMBER`, and `OWNER` in the main-app branch.
[^signup]: `accountUserService.create({ roleId: saasAccountRole || MEMBER })`; `UserRoles.addRoleToUser` for the global roles.
[^thirdparty]: `roleId: ROLE_SAAS_ACCOUNT_MEMBER`.
[^invitation-create]: The existing-member count check → 422; `role: role || ROLE_SAAS_ACCOUNT_MEMBER`.
[^join]: `accountUserService.create({ roleId: accountInvitation.role })`.
[^invitation-signup]: `saasAccountRole: accountInvitation.role`.
[^my-accounts]: `account_users` where `user_id` = the session user, then accounts where `id IN (…)`.
[^react-constants]: `SAAS_ACCOUNT_ROLES_DEFAULT = [OWNER, MEMBER]`.
[^react-invitation-form]: `saasAccountRoles = SAAS_ACCOUNT_ROLES_DEFAULT`.
[^react-disable]: `` url = `users/${userId}/disable` ``.
