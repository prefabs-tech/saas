---
type: Architecture
title: Invitation flow
description: End to end from "invite" to membership — backend creation and email link, the frontend accept page that routes to join or sign-up, and the two acceptance endpoints — including the places where React, Vue and the backend disagree.
tags: [invitations, flow, fastify, react, vue]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: create
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/create.ts#L76-L167
    title: Invitation create handler
    last_modified: 2026-05-04
  - id: send
    resource: repo://packages/fastify/src/lib/sendInvitation.ts#L10-L95
    title: sendInvitation
    last_modified: 2026-05-04
  - id: controller
    resource: repo://packages/fastify/src/model/accountInvitations/controller.ts#L40-L83
    title: Token, join and sign-up routes
    last_modified: 2026-07-16
  - id: get-by-token
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/getByToken.ts#L5-L53
    title: getByToken handler
    last_modified: 2026-05-04
  - id: service
    resource: repo://packages/fastify/src/model/accountInvitations/service.ts#L37-L64
    title: findOneByToken
    last_modified: 2026-05-04
  - id: join
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/join.ts#L12-L114
    title: join handler
    last_modified: 2026-05-04
  - id: signup
    resource: repo://packages/fastify/src/model/accountInvitations/handlers/signup.ts#L18-L151
    title: invitation sign-up handler
    last_modified: 2026-05-04
  - id: react-accept
    resource: repo://packages/react/src/views/AcceptInvitation/AcceptInvitation.tsx#L8-L44
    title: React AcceptInvitationPage
    last_modified: 2026-05-04
  - id: react-get-invitation
    resource: repo://packages/react/src/hooks/accounts/invitations/UseGetInvitationQuery.ts#L4-L14
    title: React useGetInvitationQuery
    last_modified: 2026-05-04
  - id: react-signup-mutation
    resource: repo://packages/react/src/hooks/accounts/invitations/UseSignupInvitationMutation.ts#L6-L29
    title: React useSignupInvitationMutation
    last_modified: 2026-05-04
  - id: react-join-mutation
    resource: repo://packages/react/src/hooks/accounts/invitations/UseJoinInvitationMutation.ts#L6-L24
    title: React useJoinInvitationMutation
    last_modified: 2026-05-04
  - id: react-join-page
    resource: repo://packages/react/src/views/AcceptInvitation/JoinInvitation.tsx#L51-L67
    title: React JoinInvitationPage success handling
    last_modified: 2026-05-04
  - id: react-signup-page
    resource: repo://packages/react/src/views/AcceptInvitation/SignupInvitation.tsx#L45-L56
    title: React SignupInvitationPage success handling
    last_modified: 2026-05-04
  - id: react-routes
    resource: repo://packages/react/src/routes/GetSaasAppRoutes.tsx#L47-L52
    title: React join route gated on isMainApp
    last_modified: 2026-05-04
  - id: vue-accept
    resource: repo://packages/vue/src/views/AcceptInvitation/AcceptInvitation.vue#L39-L80
    title: Vue AcceptInvitation
    last_modified: 2026-05-05
  - id: vue-api
    resource: repo://packages/vue/src/api/AccountInvitations.ts#L77-L162
    title: Vue invitation API functions
    last_modified: 2026-05-04
---

# Invitation flow

The rules about invitations (validity, uniqueness, roles) are in [account invitations](../domain/account-invitations.md). This page follows one invitation across the three packages.

## 1. Create and email (backend)

1. An authenticated user calls `POST /accounts/:accountId/invitations`. The handler validates the input and looks up whether a user with that email exists **in the account's schema**. If one does, it stores their id as `userId`.[^create]
2. It picks the link origin: the account's `domain`, else `<slug>.<rootDomain>`, else the main app domain.[^create]
3. The link is `<origin>/invitation/token/<token>?accountId=<accountId>` by default, and the email is sent without awaiting it.[^send]

## 2. Accept page (frontend, public route `/invitation/token/:token`)

1. React `AcceptInvitationPage` reads `:token` and the `accountId` query parameter, then fetches the invitation.[^react-accept] The request goes to:[^react-get-invitation]
   - `accounts/<accountId>/invitations/token/<token>` when `accountId` is present
   - otherwise `invitations/token/<token>`
2. It redirects on `invitation.userId`:[^react-accept]
   - **set** → `/join/token/:token?accountId=…`
   - **unset** → `/signup/token/:token?accountId=…`
3. Vue does the same through the router's named routes. Before redirecting an existing user to join, it stores the join path in `sessionStorage['saas.redirectAfterLogin']`, so the host app's login guard can come back to it.[^vue-accept]

Backend lookup: `GET /accounts/:accountId/invitations/token/:token` is excluded from discovery and needs no session.[^controller] It uses `request.dbSchema`, the schema of the *discovered* account, rather than loading the account from the route parameter.[^get-by-token] The token must be UUID-shaped, and the response includes `account: { id, name }`.[^service]

## 3a. Join: invitee already has a user

- The frontend page is `/join/token/:token` (authenticated). React registers it **only when `isMainApp`**.[^react-routes]
- The backend call is `POST /accounts/:accountId/invitations/join/:token`, with a session required and discovery excluded.[^controller]

The backend, in order:[^join]

1. Load the account by `:accountId` and use its `database` as the schema.
2. Find the invitation by token and require it to be valid (otherwise 422).
3. Require `invitation.userId === session user id`; otherwise 422 "User do not match with the invitation".
4. Insert the membership with the invitation's role. A duplicate is silently ignored.
5. Set `acceptedAt`, run `saas.invitation.postAccept`, and reply with a success message.

React then refetches accounts, toasts, and navigates to `/`.[^react-join-page]

## 3b. Sign-up: invitee is new

- The frontend page is `/signup/token/:token` (unauthenticated).
- The backend call is `POST /accounts/:accountId/invitations/token/:token` with `{ email, password }`. No session is needed and discovery is excluded.[^controller]

The backend, in order:[^signup]

1. Validate email format and password strength (422 on failure).
2. Load the account by `:accountId`, use its schema, and find a valid invitation by token (422 when it isn't found or isn't valid).
3. Require `invitation.email === body.email` (422).
4. Call SuperTokens `emailPasswordSignUp` with this user context:
   - `account`
   - `dbSchema`
   - `authEmailPrefix` from the request
   - `autoVerifyEmail: true`
   - `roles: [user.role || ROLE_USER]`
   - `saasAccountRole: invitation.role`

   The [sign-up override](supertokens-recipe-overrides.md#sign-up-provisioning-emailpasswordsignup) creates the user and the membership.
5. Set `acceptedAt`, run `postAccept`, and **create a session** so the new user is signed in.

React shows a success toast and does not navigate.[^react-signup-page]

## Where the implementations disagree

| Observation | Evidence | Consequence (inference) |
| --- | --- | --- |
| Both frontends fall back to `/invitations/token/:token` when `accountId` is missing, but saas-fastify registers no such route | React[^react-get-invitation][^react-signup-mutation], Vue[^vue-api], backend[^controller] | A link without `?accountId=` (for example a custom `acceptLinkPath` that drops it) hits an unregistered route |
| React's join mutation sends `withCredentials: false`; Vue's join sends `true`. The backend join route needs a session | React[^react-join-mutation], Vue[^vue-api], backend[^controller] | When the API is on another origin, React's join request carries no session cookie |
| For accounts with a slug or domain the email link opens on the **tenant host**, but React registers the join page only on the main app | [^create][^react-routes] | In React, an existing user following a slugged account's link is redirected to a join route the tenant host does not register |
| Lookup-by-token uses the discovered schema; join and sign-up use the schema of the account in the URL | [^get-by-token][^join][^signup] | On the main app (no discovered account) lookup reads `public`. That is consistent only because separate-schema accounts always have a slug, so their links point at the tenant host |

## Open questions

- Is the `/invitations/token/:token` fallback a leftover from an earlier API shape?
- Is the React join mutation's `withCredentials: false` deliberate, perhaps assuming a same-origin deployment?
- How should existing users accept invitations to slugged accounts in React apps?

[^create]: `userService.findOne({ email })` in the account schema, `invitationCreateInput.userId = invitedUser.id`, origin selection, un-awaited `sendInvitation`.
[^send]: `getInvitationLink` replaces `:token` and `:accountId` in `acceptLinkPath`.
[^controller]: The `…/token/:token` GET/POST routes without `preHandler`; `…/join/:token` with `verifySession`; all three with `saas.exclude`.
[^get-by-token]: `const { account, config, dbSchema, … } = request`; `new AccountInvitationService(config, slonik, accountId, dbSchema)`.
[^service]: `validateUUID`, then attaches `{ id, name }` of the account.
[^join]: The steps from account lookup to `postAccept`.
[^signup]: Validation, email match, `emailPasswordSignUp(email, password, {...})`, `createNewSession`.
[^react-accept]: `invitation.userId ? <Navigate to join> : <Navigate to signup>`.
[^react-get-invitation]: `` accountId ? `accounts/${accountId}/invitations/token/${token}` : `invitations/token/${token}` ``.
[^react-signup-mutation]: The same conditional URL; `withCredentials: false`.
[^react-join-mutation]: `useMutation({ withCredentials: false, ...options })`.
[^react-join-page]: `refetchAccounts(); toast.success(...); navigate("/")`.
[^react-signup-page]: `onSuccess` calls the callback and `toast.success` only.
[^react-routes]: `disabled: invitationJoin?.disabled || !isMainApp`.
[^vue-accept]: `sessionStorage.setItem(REDIRECT_AFTER_LOGIN_KEY, joinPath)`; `router.replace`.
[^vue-api]: `joinInvitation` uses `withCredentials: true`; `getInvitationByToken` and `signupInvitation` fall back to `/invitations/token/${token}`.
