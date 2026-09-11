---
type: Architecture
title: SuperTokens recipe overrides
description: How saas-fastify threads the discovered account into SuperTokens through userContext, prefixes auth identities per slugged account, provisions users and memberships on sign-up, and blocks disabled or deleted users at session time.
tags: [fastify, supertokens, authentication, user-isolation, sessions]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: recipes-index
    resource: repo://packages/fastify/src/supertokens/recipes/index.ts#L22-L62
    title: supertokensRecipesConfig
    last_modified: 2026-05-04
  - id: readme-config
    resource: repo://packages/fastify/README.md#L29-L55
    title: README — wiring supertokensRecipesConfig into config.user
    last_modified: 2025-10-16
  - id: discovery-plugin
    resource: repo://packages/fastify/src/plugins/accountDiscoveryPlugin.ts#L48-L61
    title: Discovery sets account, dbSchema, authEmailPrefix
    last_modified: 2026-05-04
  - id: signin-post
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/emailPasswordSignInPost.ts#L9-L20
    title: emailPasswordSignInPOST override
    last_modified: 2025-02-20
  - id: signin
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/emailPasswordSignIn.ts#L16-L65
    title: emailPasswordSignIn override
    last_modified: 2026-05-04
  - id: signup
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/emailPasswordSignUp.ts#L25-L171
    title: emailPasswordSignUp override
    last_modified: 2026-05-04
  - id: signup-post
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/emailPasswordSignUpPost.ts#L21-L118
    title: emailPasswordSignUpPOST override
    last_modified: 2026-07-16
  - id: thirdparty
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/thirdPartySignInUp.ts#L24-L130
    title: thirdPartySignInUp override
    last_modified: 2026-07-16
  - id: thirdparty-post
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/thirdPartySignInUpPost.ts#L12-L54
    title: thirdPartySignInUpPOST override
    last_modified: 2026-05-04
  - id: gen-reset
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/generatePasswordResetTokenPost.ts#L11-L29
    title: generatePasswordResetTokenPOST override
    last_modified: 2026-05-04
  - id: send-reset
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/sendPasswordResetEmail.ts#L21-L66
    title: sendPasswordResetEmail override
    last_modified: 2026-05-04
  - id: email-util
    resource: repo://packages/fastify/src/supertokens/utils/email.ts#L1-L16
    title: Email.addPrefix / removePrefix
    last_modified: 2025-01-06
  - id: create-session
    resource: repo://packages/fastify/src/supertokens/recipes/session/createNewSession.ts#L12-L69
    title: createNewSession override
    last_modified: 2026-07-16
  - id: verify-session
    resource: repo://packages/fastify/src/supertokens/recipes/session/verifySession.ts#L4-L42
    title: verifySession override
    last_modified: 2026-05-04
---

# SuperTokens recipe overrides

## Responsibility

SuperTokens knows nothing about accounts. saas-fastify ships `supertokensRecipesConfig`, a set of overrides that make authentication tenant-aware. The host app must pass it as `config.user.supertokens.recipes`,[^readme-config] or none of the behaviour below happens.

## What is overridden

| Recipe | API overrides | Function overrides | Email delivery |
| --- | --- | --- | --- |
| session | `verifySession` | `createNewSession` | — |
| thirdPartyEmailPassword | `emailPasswordSignInPOST`, `emailPasswordSignUpPOST`, `generatePasswordResetTokenPOST`, `thirdPartySignInUpPOST` | `emailPasswordSignIn`, `emailPasswordSignUp`, `getUserById`, `resetPasswordUsingToken`, `thirdPartySignInUp` | `sendPasswordResetEmail` |
| emailVerification | — | — | `sendEmailVerificationEmail` |

[^recipes-index]

Each override is a factory `(originalImplementation, fastify) => implementation`. It wraps the original and calls it.

## Mechanism: request context → `userContext`

SuperTokens' *function* layer never sees the Fastify request. The overrides bridge the gap in two layers:

1. **API layer (`*POST`)** copies `account`, `dbSchema`, and `authEmailPrefix` from `input.options.req.original`, the Fastify request that [account discovery](account-discovery.md) decorated, into `input.userContext`.[^signin-post][^thirdparty-post][^signup-post]
2. **Function layer** reads them back: `userContext.dbSchema` picks the schema for fastify-user's `getUserService`, `userContext.account` drives membership creation, and `userContext.authEmailPrefix` drives identity prefixing.[^signin][^signup][^thirdparty]

*Inference:* the main app excludes `/auth/` from discovery by default, so auth requests there carry no account. On a tenant host, discovery by host runs before SuperTokens' routes and the context is populated.

## Per-account identity prefix (user isolation)

- **Set:** `authEmailPrefix = "<account.id>_"` when the discovered account has a slug.[^discovery-plugin] Main-app sign-up also sets it for a newly created slugged account.[^signup-post]
- **Applied inbound:**
  - Sign-in and sign-up prepend the prefix to the email before calling SuperTokens.[^signin][^signup]
  - The password-reset token request rewrites the `email` form field.[^gen-reset]
- **Stripped outbound:** password-reset emails, verification emails, and `getUserById` remove it.[^send-reset][^email-util]
- **Stored:** the application `users` row keeps the *original* email; only the SuperTokens identity is prefixed.[^signup]

*Inference from the mechanism:* one email address can exist as separate SuperTokens users in different slugged accounts. Accounts without a slug share a single unprefixed identity space.

**Third-party quirk.** `thirdPartySignInUp` computes `input.thirdPartyUserId = authEmailPrefix + input.thirdPartyUserId` with no guard.[^thirdparty] When no prefix is set, JavaScript string concatenation produces a literal `"undefined"` prefix. *Inference:* existing third-party identities already depend on that value, so "fixing" it would orphan their logins.

## Sign-up provisioning (`emailPasswordSignUp`)

In order:[^signup]

1. Check that every role in `userContext.roles` exists; otherwise throw `SIGN_UP_FAILED` (500).
2. Prefix the email and call the original.
3. On `OK`, create the application user row in `userContext.dbSchema` with the unprefixed email. If that fails, **delete the SuperTokens user** as a compensating step, then throw `SIGN_UP_FAILED`.
4. If `userContext.account` is set, insert an account-user row with role `userContext.saasAccountRole`, or `SAAS_ACCOUNT_MEMBER` by default.
5. Add each SuperTokens role; failures are logged, not thrown.
6. If `user.features.signUp.emailVerification` is on, either auto-verify (`userContext.autoVerifyEmail`) or create a token and send the email. The link is built by hand, with the comment *"[DU 2023-SEP-4] We need to provide all the arguments."*
7. On `EMAIL_ALREADY_EXISTS_ERROR` with `sendUserAlreadyExistsWarning` on, email the original address a duplicate-registration warning.

What sets `saasAccountRole` and creates accounts is covered in [sign-up and account creation](signup-account-creation.md).

## Sign-in and third-party

- `emailPasswordSignIn` loads the application user from `dbSchema`. If the row is missing it returns `WRONG_CREDENTIALS_ERROR`; otherwise it updates `lastLoginAt`, logging failures.[^signin]
- `thirdPartySignInUp` for a new user: role check (deleting the SuperTokens user on failure), add roles, create the application user (deleting on failure), and insert an account-user row with `SAAS_ACCOUNT_MEMBER` when an account is present. For an existing user it updates `lastLoginAt`.[^thirdparty] If sign-up is disabled and no identity exists yet, it throws `SIGN_UP_DISABLED` (404).[^thirdparty]

## Session guards

- `createNewSession` loads the user from `account.database` (from `userContext` or the request). A `deletedAt` or `disabled` user gets `401 SIGN_IN_FAILED`. The user is attached to the request, and `ProfileValidationClaim` is fetched when `user.features.profileValidation.enabled` is on.[^create-session]
- `verifySession` checks the request's user after the original verification. If that user is deleted or disabled it **revokes the session** and throws `401 SESSION_VERIFICATION_FAILED`.[^verify-session]

## Open questions

- Is the `"undefined"` prefix on third-party user ids known and accepted, or a latent bug?
- `createNewSession` reads `account?.database` but receives no `dbSchema` from the API layer. Are the two always equal?

See also: [SuperTokens reference](../reference/supertokens-recipes.md), [account roles and membership](../domain/account-roles-and-membership.md).

[^recipes-index]: The `emailVerificationConfig`, `sessionConfig`, and `thirdPartyEmailPasswordConfig` objects.
[^readme-config]: `user: { supertokens: { recipes: supertokensRecipesConfig } }`.
[^discovery-plugin]: `if (account.slug) request.authEmailPrefix = \`${account.id}_\``.
[^signin-post]: Copies `account`, `dbSchema`, and `authEmailPrefix` from `input.options.req.original` into `userContext`.
[^signin]: `Email.addPrefix(input.email, userContext.authEmailPrefix)`, then `getUserService(config, slonik, userContext.dbSchema)`.
[^signup]: Role check, prefix, user creation with `deleteUser` compensation, account-user creation, roles, email verification, and the duplicate-email warning.
[^signup-post]: Context copy, account creation on the main app, prefix/dbSchema for the new account, `saasAccountRole = SAAS_ACCOUNT_OWNER`.
[^thirdparty]: `input.thirdPartyUserId = authEmailPrefix + input.thirdPartyUserId`; the new-user and existing-user branches.
[^thirdparty-post]: Sets `userContext.roles`, `account`, `dbSchema`, `authEmailPrefix`; merges the application user into the response.
[^gen-reset]: `updateFields(input.formFields, userContext.authEmailPrefix)`.
[^send-reset]: `to: Email.removePrefix(input.user.email, userContext.authEmailPrefix)`.
[^email-util]: `addPrefix` prepends when a prefix is set; `removePrefix` strips it only when the string starts with the prefix.
[^create-session]: The `deletedAt`/`disabled` checks throw `SIGN_IN_FAILED`; the profile-validation claim is fetched when enabled.
[^verify-session]: `originalResponse.revokeSession()`, then throws `SESSION_VERIFICATION_FAILED`.
