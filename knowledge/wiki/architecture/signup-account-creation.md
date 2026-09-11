---
type: Architecture
title: Sign-up and account creation
description: What happens end to end when someone signs up on the main app (a new account plus its owner) versus on a tenant host (a member of that account), including validation and the compensating account delete.
tags: [signup, accounts, fastify, react, vue, supertokens]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: react-signup
    resource: repo://packages/react/src/views/Signup/index.tsx#L22-L76
    title: React SignupPage
    last_modified: 2026-05-04
  - id: react-prepare
    resource: repo://packages/react/src/utils/account.ts#L8-L76
    title: prepareSignupData (React)
    last_modified: 2026-05-04
  - id: vue-prepare
    resource: repo://packages/vue/src/utils/account.ts#L8-L76
    title: prepareSignupData (Vue)
    last_modified: 2026-05-04
  - id: react-constants
    resource: repo://packages/react/src/constants.ts#L26-L26
    title: SIGNUP_PATH_DEFAULT
    last_modified: 2026-05-04
  - id: react-provider
    resource: repo://packages/react/src/contexts/AccountsProvider.tsx#L60-L65
    title: isMainApp (React)
    last_modified: 2026-05-04
  - id: signup-post
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/emailPasswordSignUpPost.ts#L21-L118
    title: emailPasswordSignUpPOST override
    last_modified: 2026-07-16
  - id: signup
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/emailPasswordSignUp.ts#L25-L111
    title: emailPasswordSignUp override
    last_modified: 2026-05-04
  - id: account-service
    resource: repo://packages/fastify/src/model/accounts/service.ts#L63-L131
    title: AccountService validateSlugOrDomain / postCreate / preCreate
    last_modified: 2026-05-04
  - id: validate
    resource: repo://packages/fastify/src/lib/validateAccountSchema.ts#L10-L44
    title: validateAccountInput
    last_modified: 2026-05-04
  - id: accounts-create-handler
    resource: repo://packages/fastify/src/model/accounts/handlers/create.ts#L7-L14
    title: POST /accounts handler
    last_modified: 2026-05-04
  - id: config
    resource: repo://packages/fastify/src/config.ts#L35-L43
    title: mainApp.domain default
    last_modified: 2026-05-04
---

# Sign-up and account creation

## Responsibility

There are three ways an account comes into existence, and two ways a user joins one at sign-up. The deciding factor is the **host the browser is on**, not an explicit flag.

| Entry | Account created? | New user's role in it |
| --- | --- | --- |
| Sign-up on the main app | yes, from `accountFormFields` | `SAAS_ACCOUNT_OWNER` |
| Sign-up on a tenant host | no, uses the discovered account | `SAAS_ACCOUNT_MEMBER` |
| `POST /accounts` (admin UI) | yes | none; no membership is created[^accounts-create-handler] |
| Invitation sign-up | no | the invitation's role (see [invitation flow](invitation-flow.md)) |

## Frontend half

1. React `SignupPage` renders `AccountSignupForm` when `isMainApp`, which in React means `window.location.host === mainApp.domain`, and `UserSignupForm` otherwise.[^react-signup][^react-provider]
2. `prepareSignupData` builds the SuperTokens payload:[^react-prepare][^vue-prepare]
   - `formFields`: `email`, `password`.
   - `accountFormFields` (account sign-up only): `name`, `individual`, `registeredNumber` and `taxId` (forced to `null` for individuals), `slug`, and `useSeparateDatabase` (forced to `false` without a slug).
3. POST to `accounts.signup.apiPath`, default `/auth/signup`.[^react-signup][^react-constants]
4. On success, if `accounts.signup.appRedirection` is on (the default) and a slug was given, the page does `window.location.replace("<protocol>//<slug>.<rootDomain>")`, marked `FIXME Quick solution`.[^react-signup]

The Vue payload builder is a line-for-line copy of React's.[^vue-prepare]

## Backend half: `emailPasswordSignUpPOST`

In order:[^signup-post]

1. Copy `account`, `dbSchema`, and `authEmailPrefix` from the request into `userContext`.
2. If `user.features.signUp.enabled === false`, throw `SIGN_UP_DISABLED` (404).
3. Set `roles = [user.role || ROLE_USER]` and `saasAccountRole = SAAS_ACCOUNT_MEMBER`.
4. Compute `hostname = getHost(referer || origin || request.hostname)` and compare it **exactly** with `mainApp.domain`. Unlike discovery, this ignores `skipHostnameCheck` and never consults the `Host` header.
5. **Main-app branch:**
   1. Require `accountFormFields`; otherwise throw `ERROR_MISSING_ACCOUNT_FORM_FIELDS` (422).
   2. Build `AccountCreateInput` with `Object.fromEntries`. The in-code `// TODO: validate accountCreateInput` is partly covered by `AccountService.preCreate`, which validates (below).
   3. `accountService.create(...)`.
   4. Point `userContext` at the new account: its `dbSchema` if it has one, and prefix `<id>_` if it has a slug.
   5. Set `saasAccountRole = SAAS_ACCOUNT_OWNER` and call the original sign-up.
   6. **If the response status is not `OK`, delete the account.**
6. **Otherwise:** call the original sign-up with the discovered account (if any). [`emailPasswordSignUp`](supertokens-recipe-overrides.md#sign-up-provisioning-emailpasswordsignup) then inserts the membership row.[^signup]

## Account validation (`AccountService.preCreate`)

1. If `subdomains` is `"disabled"` or no slug is given, drop `slug` and `domain`; if there is no domain, drop `domain`.[^account-service]
2. `validateAccountInput`:[^validate]
   1. Zod `accountCreateInputSchema`. The first failing field becomes `ERROR_INVALID_<FIELD>` (422).
   2. Reserved slugs → `ERROR_INVALID_SLUG`; reserved domains → `ERROR_INVALID_DOMAIN`. See [accounts](../domain/accounts.md) for which slugs are reserved.
3. With a slug, a slug or domain collision → `ERROR_SLUG_ALREADY_EXISTS` or `ERROR_DOMAIN_ALREADY_EXISTS` (422).[^account-service]
4. Maybe assign a tenant schema ([tenant schema isolation](tenant-schema-isolation.md)); `postCreate` then migrates it.[^account-service]

## Invariants and failure behaviour

- **Main-app detection depends on the browser's origin.** If `Referer`/`Origin` does not exactly equal `mainApp.domain` (including any port), the account branch is silently skipped and a plain user is created. See [signup does not create an account](../troubleshooting/signup-does-not-create-account.md).[^signup-post][^config]
- **Compensation is partial.** *Inference from control flow:* the account is deleted only when the original sign-up *returns* a non-`OK` status. If it *throws*, the delete line is never reached: `emailPasswordSignUp` throws `SIGN_UP_FAILED` on a missing role or a failed user insert.[^signup-post][^signup] Separately, deleting the account row does not drop a tenant schema already created by `postCreate`.
- `EMAIL_ALREADY_EXISTS_ERROR` is a non-`OK` status, so a main-app sign-up with an existing email creates and then deletes the account.[^signup-post]

## Open questions

- Should account creation and user sign-up be atomic? Is an orphaned account row on a thrown sign-up error acceptable?
- Is the omission of the `Host` header in main-app detection (compared with discovery) intentional?

[^react-signup]: `isMainApp ? <AccountSignupForm> : <UserSignupForm>`; `signup({ apiBaseUrl, data, path: apiPath })`; the slug redirect.
[^react-prepare]: `accountFormFields` and `formFields` construction.
[^vue-prepare]: Identical implementation in the Vue package.
[^react-constants]: `SIGNUP_PATH_DEFAULT = "/auth/signup"`.
[^react-provider]: `isMainApp = host === mainApp?.domain`.
[^signup-post]: The whole override, including `if (response.status !== "OK") await accountService.delete(account.id)`.
[^signup]: Throws `SIGN_UP_FAILED` for a missing role or a failed user insert; creates the account-user row from `userContext.account`.
[^account-service]: `preCreate` stripping, `validateSlugOrDomain` errors, and separate-schema assignment.
[^validate]: Zod `safeParse` → `ERROR_INVALID_<field>`; reserved slug and domain checks.
[^accounts-create-handler]: `service.create(request.body)` with no membership step.
[^config]: `mainApp.domain` defaults to `<subdomain>.<rootDomain>`.
