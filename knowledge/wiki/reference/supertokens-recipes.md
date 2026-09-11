---
type: Explainer
title: SuperTokens as used by saas
description: The SuperTokens concepts this repository assumes — recipes, the override model (functions vs APIs, originalImplementation), userContext, user roles — and which SDK versions and recipe APIs saas-fastify is pinned to.
tags: [reference, supertokens, authentication, external]
status: draft
stale_after: 2027-03-11
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: fastify-pkg
    resource: repo://packages/fastify/package.json#L66-L87
    title: supertokens-node dev and peer versions
    last_modified: 2026-07-29
  - id: vite
    resource: repo://packages/fastify/vite.config.ts#L22-L66
    title: supertokens-node subpaths kept external
    last_modified: 2026-07-20
  - id: recipes-index
    resource: repo://packages/fastify/src/supertokens/recipes/index.ts#L1-L62
    title: Recipe override config
    last_modified: 2026-05-04
  - id: create-session
    resource: repo://packages/fastify/src/supertokens/recipes/session/createNewSession.ts#L12-L69
    title: Function override example
    last_modified: 2026-07-16
  - id: signin-post
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/emailPasswordSignInPost.ts#L4-L21
    title: API override example
    last_modified: 2025-02-20
  - id: vue-pkg
    resource: repo://packages/vue/package.json#L84-L85
    title: supertokens-web-js / supertokens-website peers
    last_modified: 2026-07-29
  - id: supertokens-docs
    resource: https://supertokens.com/docs
    title: SuperTokens documentation
---

# SuperTokens as used by saas

[SuperTokens](https://supertokens.com/docs)[^supertokens-docs] is the authentication system underneath `@prefabs.tech/fastify-user`, and therefore underneath saas-fastify. This page explains the concepts the saas code relies on. What saas does with them is in [SuperTokens recipe overrides](../architecture/supertokens-recipe-overrides.md).

## Versions this repository is built against

| Package | Version | Where |
| --- | --- | --- |
| `supertokens-node` | 14.1.4 (dev), peer `>=14.1.4` | saas-fastify[^fastify-pkg] |
| `supertokens-web-js`, `supertokens-website` | peers `>=0.16.0`, `>=20.1.6` | saas-vue[^vue-pkg] |

The fastify build keeps every `supertokens-node` subpath external: `recipe/session`, `recipe/thirdpartyemailpassword`, `recipe/emailverification`, `recipe/userroles`, the Fastify framework adapter, and internal `lib/build/...` paths.[^vite] Some imports reach into `lib/build/...` internals, for example the email-delivery types.[^vite] *Inference:* those paths are not a public API and can move between SDK versions, and the open-ended peer range does not guard against that.

## Concepts

- **Recipe:** a feature module initialised in `supertokens.init`. saas relies on:
  - `session`
  - `thirdpartyemailpassword` (email/password and social login combined)
  - `emailverification`
  - `userroles`[^recipes-index]
- **Override model:** each recipe exposes two override points.
  - `functions`: data-level operations such as `emailPasswordSignUp` and `createNewSession`.
  - `apis`: HTTP handlers such as `emailPasswordSignUpPOST` and `verifySession`.

  An override receives the `originalImplementation` and returns a replacement that usually calls it.[^create-session][^signin-post] In the prefabs wrapper each override is a factory `(originalImplementation, fastify) => fn`.[^recipes-index]
- **`userContext`:** a per-call object that flows from API overrides into function overrides. It is the only supported way to pass request-derived data such as the account into function overrides.[^signin-post] The Fastify request is reachable through `userContext._default.request.request` or `input.options.req.original`.[^create-session][^signin-post]
- **User roles:** named roles attached to a SuperTokens user id with `UserRoles.addRoleToUser`; created with `createNewRoleOrAddPermissions`.
- **Email delivery override:** the `sendEmail` hook on a recipe replaces SuperTokens' email sending. saas uses it to rewrite links to the request's origin and to strip the auth-email prefix.[^recipes-index]

## Watch for

- The combined `thirdpartyemailpassword` recipe and the function names above belong to the 14.x SDK line pinned here. Check upstream migration notes before raising the dev dependency to a new major. *(External; verify against the SuperTokens changelog.)*

[^fastify-pkg]: `"supertokens-node": "14.1.4"` in devDependencies and `">=14.1.4"` in peerDependencies.
[^vite]: The `external` entry `/supertokens-node+/` and the `globals` for each subpath.
[^recipes-index]: Imports of the recipe types from `@prefabs.tech/fastify-user`; `override.apis`, `override.functions`, `sendEmail`.
[^create-session]: `(originalImplementation, fastify) => async (input) => { … originalImplementation.createNewSession(input) }`.
[^signin-post]: `input.userContext.account = input.options.req.original.account`.
[^vue-pkg]: Peer entries for the web SDKs.
[^supertokens-docs]: Upstream documentation for the concepts summarised here.
