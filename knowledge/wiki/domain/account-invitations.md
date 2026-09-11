---
type: Domain Concept
title: Account invitations
description: What an account invitation is, its derived states (pending, accepted, revoked, expired), and the rules the backend enforces on creating, resending, revoking and accepting one.
tags: [domain, invitations, accounts, email]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: queries
    resource: repo://packages/fastify/src/migrations/queries.ts#L121-L143
    title: account_invitations DDL
    last_modified: 2026-05-04
  - id: valid
    resource: repo://packages/fastify/src/lib/isInvitationValid.ts#L3-L9
    title: isInvitationValid
    last_modified: 2026-07-16
  - id: service
    resource: repo://packages/fastify/src/model/accountInvitations/service.ts#L37-L95
    title: AccountInvitationService findOneByToken / preCreate
    last_modified: 2026-05-04
  - id: create
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/create.ts#L23-L178
    title: Invitation create handler
    last_modified: 2026-05-04
  - id: resend
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/resend.ts#L56-L87
    title: Invitation resend handler
    last_modified: 2026-05-04
  - id: revoke
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/revoke.ts#L55-L73
    title: Invitation revoke handler
    last_modified: 2026-05-04
  - id: remove
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/remove.ts#L45-L67
    title: Invitation delete handler
    last_modified: 2026-05-04
  - id: send
    resource: repo://packages/fastify/src/lib/sendInvitation.ts#L10-L95
    title: sendInvitation
    last_modified: 2026-05-04
  - id: constants
    resource: repo://packages/fastify/src/constants.ts#L2-L3
    title: Default accept link path
    last_modified: 2026-05-04
  - id: config-type
    resource: repo://packages/fastify/src/types/config.ts#L68-L84
    title: saas.invitation options
    last_modified: 2026-05-04
---

# Account invitations

An **invitation** offers an email address a role in one account. Whether the invitee already has a user record decides how it is accepted: *join* for an existing user, *sign-up* for a new one. See [invitation flow](../architecture/invitation-flow.md) for the end-to-end mechanics.

## Schema

| Field | Meaning |
| --- | --- |
| `account_id`, `email`, `role` | Who is invited, to what, and as what[^queries] |
| `invited_by_id` | The session user who created it[^create] |
| `user_id` | Set at creation when a user with that email already exists **in the account's schema**; this chooses join vs sign-up[^create] |
| `token` | UUID from `gen_random_uuid()`, unique[^queries] |
| `expires_at` | Computed by fastify-user's `computeInvitationExpiresAt(config, requested)`[^create] |
| `payload` | Optional JSON supplied at creation, stored only when non-empty[^create] |
| `accepted_at`, `revoked_at` | Lifecycle timestamps[^queries] |

The table has no `deleted_at`, so deleting an invitation removes the row.[^queries][^remove]

## States

The states are derived, not stored. An invitation is **valid** only if it is not accepted, not revoked, and `now <= expiresAt`.[^valid]

```
pending ──join / sign-up──▶ accepted
   │
   ├──revoke──▶ revoked
   └──time────▶ expired
(any state) ──delete──▶ gone
```

## Rules

| Action | Rule |
| --- | --- |
| Create | Needs a session user (401); a valid email per fastify-user rules (422); and a known account (404; `:accountId` must match the discovered account, otherwise 400).[^create] |
| Create | The email must not belong to an existing member of the account (422).[^create] |
| Create | **At most one valid invitation per (account, email).** A duplicate makes `preCreate` throw, returned as 422.[^service] |
| Create | `role` defaults to `SAAS_ACCOUNT_MEMBER`.[^create] |
| Resend | Only a valid invitation. An invalid one returns a body `{ status: "ERROR", message }` **with HTTP 200**.[^resend] |
| Revoke | Only a valid invitation; otherwise 422. Sets `revokedAt`.[^revoke] |
| Delete | Any state; 422 if not found.[^remove] |
| Accept | Only a valid invitation, looked up by token. The token must look like a UUID or the lookup returns null.[^service] |
| Responses | `token` is removed from create, list, resend, revoke, and delete responses.[^create][^resend][^revoke][^remove] Lookup by token returns the invitation plus `account: { id, name }`.[^service] |

## The invitation email

- **Sending is fire-and-forget.** `sendInvitation` is called without `await`, and mailer errors are only logged. Creation succeeds even if the mail fails.[^create][^send]
- **Link origin**, first match wins:[^create][^resend]
  1. `<protocol>://<account.domain>`
  2. `<protocol>://<account.slug>.<rootDomain>`
  3. `<protocol>://<mainApp.domain>`

  `<protocol>` is the API request's protocol.
- **Link path:** `saas.invitation.acceptLinkPath`, default `/invitation/token/:token?accountId=:accountId`, with the `:token` and `:accountId` placeholders replaced.[^send][^constants]
- **Subject:** `saas.invitation.emailOverrides.subject`, either a string or `async (fastify, invitation) => string`, default "You're invited".[^send][^config-type]
- **Template:** `saas.invitation.emailOverrides.templateName`, then `user.emailOverrides.invitation.templateName`, then `"user-invitation"`. Template data includes `invitation`, `invitationLink`, and `appName`.[^send]
- No origin means no email, and an error is logged.[^send]

## After acceptance

`saas.invitation.postAccept(request, invitation, user)` runs after a join or invitation sign-up. Errors it throws are logged and do not fail the acceptance.[^config-type]

## Open questions

- Should resend of an invalid invitation return a non-2xx status, as revoke does?
- *Inference:* `user_id` is fixed at creation. If the invitee signs up independently before accepting, the invitation still routes them to sign-up, and invitation sign-up would then fail on the existing email. Is that case handled anywhere?

[^queries]: `account_invitations` columns.
[^valid]: `!(acceptedAt || revokedAt || Date.now() > expiresAt)`.
[^service]: `findOneByToken` with `validateUUID` and the account attachment; `preCreate` counts valid invitations for the email.
[^create]: Validation steps, the existing-member check, the create input, the origin selection, the un-awaited `sendInvitation`, `delete data.token`.
[^resend]: `reply.send({ message: "Invitation is invalid or has expired", status: "ERROR" })` with no status code set.
[^revoke]: 422 when invalid; `update(id, { revokedAt })`.
[^remove]: `service.delete(id)`; 422 when nothing is returned.
[^send]: `getInvitationLink`, subject selection, template-name precedence, the `if (origin)` guard.
[^constants]: `ACCOUNT_INVITATION_ACCEPT_LINK_PATH`.
[^config-type]: `acceptLinkPath`, `emailOverrides`, `postAccept` types.
