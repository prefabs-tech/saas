---
type: Architecture
title: Package boundaries and duplicated contracts
description: The three workspace packages share no code — their contract is the HTTP API plus constants, paths and payload shapes duplicated by hand, which must be changed together.
tags: [monorepo, contracts, fastify, react, vue, coupling]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: workspace
    resource: repo://pnpm-workspace.yaml
    title: pnpm workspace definition
    last_modified: 2024-12-09
  - id: turbo
    resource: repo://turbo.json#L3-L7
    title: turbo build task
    last_modified: 2026-05-05
  - id: ship-config
    resource: repo://ship.config.js#L1-L17
    title: shipjs monorepo config
    last_modified: 2025-08-01
  - id: fastify-pkg
    resource: repo://packages/fastify/package.json#L33-L88
    title: saas-fastify dependencies and peers
    last_modified: 2026-07-29
  - id: react-pkg
    resource: repo://packages/react/package.json#L33-L75
    title: saas-react dependencies and peers
    last_modified: 2026-07-29
  - id: vue-pkg
    resource: repo://packages/vue/package.json#L33-L90
    title: saas-vue dependencies and peers
    last_modified: 2026-07-29
  - id: fastify-constants
    resource: repo://packages/fastify/src/constants.ts#L1-L8
    title: saas-fastify constants
    last_modified: 2026-05-04
  - id: fastify-config
    resource: repo://packages/fastify/src/config.ts#L7-L43
    title: saas-fastify config defaults
    last_modified: 2026-05-04
  - id: react-constants
    resource: repo://packages/react/src/constants.ts#L1-L49
    title: saas-react constants
    last_modified: 2026-05-04
  - id: vue-constants
    resource: repo://packages/vue/src/constant.ts#L6-L54
    title: saas-vue constants
    last_modified: 2026-05-04
  - id: react-config
    resource: repo://packages/react/src/utils/config.ts#L33-L50
    title: React prepareConfig
    last_modified: 2026-05-04
  - id: react-prepare
    resource: repo://packages/react/src/utils/account.ts#L8-L76
    title: React prepareSignupData
    last_modified: 2026-05-04
  - id: vue-prepare
    resource: repo://packages/vue/src/utils/account.ts#L8-L76
    title: Vue prepareSignupData
    last_modified: 2026-05-04
  - id: signup-post
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/emailPasswordSignUpPost.ts#L69-L86
    title: Backend reads accountFormFields
    last_modified: 2026-07-16
  - id: fastify-types
    resource: repo://packages/fastify/src/types/config.ts#L94-L116
    title: Backend SaasConfig multiDatabase / subdomains
    last_modified: 2026-05-04
  - id: react-types
    resource: repo://packages/react/src/types/config.ts#L1-L45
    title: React SaasConfig type
    last_modified: 2026-05-04
  - id: vue-types
    resource: repo://packages/vue/src/types/config.ts#L1-L38
    title: Vue SaasConfig type
    last_modified: 2026-05-04
  - id: root-readme
    resource: repo://README.md#L1-L7
    title: Root README package list
    last_modified: 2025-08-01
  - id: commit-vue-init
    resource: repo://.git#ab8f713
    title: "ab8f713 (2025-04-25) feat: initiate vue sass from vue user"
    last_modified: 2025-04-25
---

# Package boundaries and duplicated contracts

## The shape

`packages/*` holds three independently built libraries.[^workspace] None depends on another workspace package; each consumes only external `@prefabs.tech/*` libraries.[^fastify-pkg][^react-pkg][^vue-pkg]

| Package | Runs in | Depends on (peers) |
| --- | --- | --- |
| `@prefabs.tech/saas-fastify` | Node API | fastify-config, -error-handler, -graphql, -mailer, -s3, -slonik, -user ≥ 0.94.1; fastify, mercurius, slonik, supertokens-node, zod[^fastify-pkg] |
| `@prefabs.tech/saas-react` | Browser | react-config, -form, -i18n, -ui ≥ 0.72.1; primereact, react-router-dom, react-toastify[^react-pkg] |
| `@prefabs.tech/saas-vue` | Browser | vue3-config, -i18n, -layout, -ui, -user **pinned to exactly** 0.32.0; pinia, vee-validate, supertokens-web-js/-website[^vue-pkg] |

Two consequences:

- turbo's `build.dependsOn: ["^build"]` has no internal edges to follow, so the packages build in any order.[^turbo] *(Inference.)*
- Versions are **lockstep**: shipjs bumps every `packages/*` to the root version and publishes all of them.[^ship-config]

## The real contract is duplicated, not shared

Backend and frontends agree on these by copy. A change to one side must be mirrored by hand.

| Contract | saas-fastify | saas-react | saas-vue |
| --- | --- | --- | --- |
| Account header `x-account-id` | `ACCOUNT_HEADER_NAME`[^fastify-constants] | `ACCOUNT_HEADER_NAME`[^react-constants] | `ACCOUNT_HEADER_NAME`[^vue-constants] |
| Role names | `SAAS_ACCOUNT_ADMIN`/`OWNER`/`MEMBER`[^fastify-constants] | `OWNER`, `MEMBER` only[^react-constants] | `OWNER`, `MEMBER` only[^vue-constants] |
| Admin app subdomain `admin` | default `apps` entry[^fastify-config] | `ADMIN_SUBDOMAIN_DFAULT`[^react-constants] | `ADMIN_SUBDOMAIN_DEFAULT`[^vue-constants] |
| Main app domain default `<subdomain \| "app">.<rootDomain>` | `getSaasConfig`[^fastify-config] | `prepareConfig`[^react-config] | not used; compares subdomain only |
| Invitation accept path `/invitation/token/:token` | `ACCOUNT_INVITATION_ACCEPT_LINK_PATH` (+ `?accountId=`)[^fastify-constants] | `DEFAULT_PATHS.INVITATION_ACCEPT`[^react-constants] | `DEFAULT_PATHS.INVITATION_ACCEPT`[^vue-constants] |
| Sign-up payload `accountFormFields` | read by `emailPasswordSignUpPOST`[^signup-post] | `prepareSignupData`[^react-prepare] | identical copy[^vue-prepare] |

The frontend `DEFAULT_PATHS` and `SIGNUP_PATH_DEFAULT` are also duplicated between React and Vue.[^react-constants][^vue-constants]

## Config shapes share names, not types

| Key | Backend | React | Vue |
| --- | --- | --- | --- |
| `multiDatabase` | `{ mode: "disabled" \| "optional" \| "required", migrations? }`[^fastify-types] | `boolean`[^react-types] | `boolean`[^vue-types] |
| `subdomains` | `"disabled" \| "optional" \| "required"`[^fastify-types] | same[^react-types] | same[^vue-types] |
| main app | `mainApp.{domain,subdomain,skipHostnameCheck}`; `mainAppSubdomain` deprecated | `mainApp.{domain,subdomain}`; `mainAppSubdomain` deprecated[^react-types] | `mainAppSubdomain` only[^vue-types] |
| UI `actionsAlignment` | — | `"fill"` default[^react-constants] | `"filled"` default[^vue-constants] |

On the frontends `multiDatabase` only toggles UI (whether to offer "use separate database"). The backend's `mode` decides whether that choice is honoured.

## Documentation coverage

The root README lists only the fastify and react packages.[^root-readme] The Vue package was started on 2025-04-25 ("initiate vue sass from vue user"), and its README covers installation only.[^commit-vue-init][^vue-pkg]

## When changing a contract

1. Grep all three `packages/*/src` for the constant or path.
2. Change backend and frontends in the same PR. Lockstep versioning ships them together.[^ship-config]
3. Existing deployments pair a backend and a frontend of the *same* version only if the consuming app pins them together. Nothing in this repo enforces that pairing.

## Open questions

- Should the shared constants move into a common package, or is duplication a deliberate choice to keep the packages dependency-free?
- Why are the Vue peers pinned exactly while the React and fastify peers use `>=` ranges?

[^workspace]: `packages: - "packages/*"`.
[^turbo]: `"build": { "dependsOn": ["^build"], "outputs": ["dist/**"] }`.
[^ship-config]: `monorepo.mainVersionFile: "package.json"`, `packagesToBump` and `packagesToPublish: ["packages/*"]`.
[^fastify-pkg]: `dependencies` and `peerDependencies` blocks.
[^react-pkg]: `dependencies` (axios, zod) and `peerDependencies`.
[^vue-pkg]: `peerDependencies` with exact `0.32.0` for the vue3-* libraries.
[^fastify-constants]: `ACCOUNT_HEADER_NAME`, `ACCOUNT_INVITATION_ACCEPT_LINK_PATH`, and the three `ROLE_SAAS_*` constants.
[^fastify-config]: The default `apps` entry (`name: "admin", subdomain: "admin"`) and the `mainApp.domain` formula.
[^react-constants]: `ACCOUNT_HEADER_NAME`, `ADMIN_SUBDOMAIN_DFAULT`, `CONFIG_UI_DEFAULT`, `SAAS_ACCOUNT_*`, `DEFAULT_PATHS`, `SIGNUP_PATH_DEFAULT`.
[^vue-constants]: The same set, with `ADMIN_SUBDOMAIN_DEFAULT` and `"filled"` alignment.
[^react-config]: The `mainApp.domain` default formula.
[^react-prepare]: Builds `accountFormFields` and `formFields`.
[^vue-prepare]: The same builder.
[^signup-post]: `const { accountFormFields } = body`, then `Object.fromEntries`.
[^fastify-types]: `multiDatabase.mode` and `subdomains` unions.
[^react-types]: `multiDatabase: boolean`, `mainApp?`, deprecated `mainAppSubdomain`.
[^vue-types]: `multiDatabase: boolean`, `mainAppSubdomain: string`.
[^root-readme]: The "Packages" list has two entries.
[^commit-vue-init]: The commit that added `packages/vue/package.json`.
