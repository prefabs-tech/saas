---
type: Architecture
title: Account discovery
description: How saas-fastify resolves every API request to a tenant account in a global onRequest hook — by host or by x-account-id header — and why it fails closed with a 404.
tags: [fastify, multi-tenancy, account-discovery, request-lifecycle, onRequest]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: plugin
    resource: repo://packages/fastify/src/plugin.ts#L13-L50
    title: saas-fastify plugin composition root
    last_modified: 2026-05-04
  - id: discovery-plugin
    resource: repo://packages/fastify/src/plugins/accountDiscoveryPlugin.ts#L10-L73
    title: accountDiscoveryPlugin onRequest hook
    last_modified: 2026-05-04
  - id: discover-account
    resource: repo://packages/fastify/src/lib/discoverAccount.ts#L20-L70
    title: discoverAccount strategy selection
    last_modified: 2026-05-04
  - id: config
    resource: repo://packages/fastify/src/config.ts#L7-L43
    title: getSaasConfig defaults (apps, exclusions, mainApp)
    last_modified: 2026-05-04
  - id: account-sql
    resource: repo://packages/fastify/src/model/accounts/sqlFactory.ts#L23-L36
    title: AccountSqlFactory.getFindByHostnameSql
    last_modified: 2026-05-04
  - id: slonik-filters
    resource: https://www.npmjs.com/package/@prefabs.tech/fastify-slonik/v/0.94.1
    title: "@prefabs.tech/fastify-slonik 0.94.1 filter builder (dist lines 63-67: eq 'null'/'NULL' renders IS NULL, not:true renders IS NOT NULL)"
  - id: gethost-test
    resource: repo://packages/fastify/src/lib/__test__/getHost.test.ts#L5-L24
    title: getHost unit test
    last_modified: 2026-07-16
  - id: accounts-controller
    resource: repo://packages/fastify/src/model/accounts/controller.ts#L5-L84
    title: Account routes and their saas.exclude flags
    last_modified: 2026-07-16
  - id: invitations-controller
    resource: repo://packages/fastify/src/model/accountInvitations/controller.ts#L40-L83
    title: Invitation token routes excluded from discovery
    last_modified: 2026-07-16
  - id: readme
    resource: repo://packages/fastify/README.md#L118-L170
    title: saas-fastify README — skipping discovery and CORS
    last_modified: 2025-10-16
  - id: commit-onrequest
    resource: repo://.git#7ea314b
    title: "7ea314b (2025-02-20) fix: execute customer discovery in onRequst hook"
    last_modified: 2025-02-20
  - id: commit-exclude-root
    resource: repo://.git#f4457b0
    title: "f4457b0 (2025-08-18) fix: exclude / route by default from account discovery for main app"
    last_modified: 2025-08-18
---

# Account discovery

## Responsibility

For every incoming request, saas-fastify decides which **account** (tenant) the request belongs to and stamps it on the request object, where handlers, services, and the [SuperTokens overrides](supertokens-recipe-overrides.md) read it. Discovery answers *which tenant is this request for*; it does **not** check that the signed-in user is a member of that tenant (see [request trust boundaries](../security/request-trust-boundaries.md)).

## Entry point

- The default plugin export registers `accountDiscoveryPlugin` after creating the core tables and before any of its route plugins.[^plugin]
- The work happens in an `onRequest` hook, which runs before `preHandler` — where the package's routes run `verifySession()`.[^discovery-plugin][^accounts-controller] It was moved from `preHandler` to `onRequest` in 7ea314b; the commit message does not say why.[^commit-onrequest]
- The plugin is wrapped in `fastify-plugin`, so the hook is not encapsulated to saas routes. *Inference from fastify-plugin semantics:* it runs for every route on the instance, including the host application's own routes.[^discovery-plugin]

## Mechanism, in order

1. **Resolve the hostname.** `getHost(referer || origin || host || request.hostname)`. A parseable URL yields its host *including port*; anything else is returned unchanged.[^discovery-plugin][^gethost-test] The page's `Referer` therefore wins over the API's own `Host`.
2. **Skip other apps.** If the hostname equals the `domain` of any entry in `saas.apps`, the hook returns immediately and `request.account` stays unset. The default is one app, `admin`, at `admin.<rootDomain>`.[^discovery-plugin][^config]
3. **Compute exclusion.** The patterns are `/^\/$/`, `/^\/auth\//`, `"/me"`, and `"/invitation/token/"`, plus `saas.excludeRoutePatterns`.[^config] Strings become `^<string>` regexes, so they are **prefix** matches (`"/me"` also matches `/media`). A route is excluded if its URL matches, or if its route config has `saas.exclude: true`.[^discovery-plugin] `/` became a default exclusion in f4457b0.[^commit-exclude-root]
4. **Choose a strategy** in `discoverAccount`:[^discover-account]

   | Condition | Result |
   | --- | --- |
   | (`mainApp.skipHostnameCheck` **or** hostname = `mainApp.domain`) **and** route excluded | no account, no error |
   | (`mainApp.skipHostnameCheck` **or** hostname = `mainApp.domain`) **and** not excluded | by header: `id = x-account-id AND slug IS NULL` |
   | otherwise (a tenant host) | by host: `domain = host OR slug || '.' || rootDomain = host`[^account-sql] |

5. **Fail closed.** If no account is found, `discoverAccount` throws and the hook replies `404 {"error":{"message":"Account not found"}}`.[^discovery-plugin]
6. **Decorate the request** when an account is found:[^discovery-plugin]
   - `request.account`: the account row.
   - `request.dbSchema = account.database`, only when the account has its own schema (see [tenant schema isolation](tenant-schema-isolation.md)).
   - `request.authEmailPrefix = "<account.id>_"`, only when the account has a `slug`. It drives per-tenant user isolation in [SuperTokens](supertokens-recipe-overrides.md).

## Invariants and consequences

- **On the main app, a non-excluded request without `x-account-id` gets a 404.** This is why the frontends send the header (see [frontend account context](frontend-account-context.md)). It is also why account-independent routes carry `config.saas.exclude`: `/my-accounts`, every `/account-types` route, and the invitation token, join, and signup routes.[^accounts-controller][^invitations-controller]
- **Header discovery only finds accounts without a slug.** The filter `{ key: "slug", not: false, operator: "eq", value: "NULL" }` renders as `slug IS NULL`.[^discover-account][^slonik-filters] An account with a slug is reachable only through its own host.
- **Exclusion only applies on the main app.** On a tenant host, discovery by host runs even for excluded routes. An unregistered host gets a 404 on *every* route.[^discover-account]
- **`skipHostnameCheck` is true by default only when `subdomains` is `"disabled"`.** With other `subdomains` values it is always false, whatever `mainApp.skipHostnameCheck` says. With subdomains disabled, every host that isn't in `apps` uses header discovery.[^config]
- **`mainApp.domain` defaults to `<mainApp.subdomain | mainAppSubdomain | "app">.<rootDomain>`.**[^config] The comparison is an exact string match that includes the port, which bites in local development (see [signup does not create an account](../troubleshooting/signup-does-not-create-account.md)).
- **The resolved saas config is recomputed on every request.** `getSaasConfig(config)` is called inside the hook.[^discovery-plugin]

## Configuration that changes this flow

| Key | Effect |
| --- | --- |
| `saas.rootDomain` | Suffix for slug hosts and default app domains |
| `saas.subdomains` | `"disabled"` turns on `skipHostnameCheck` (header discovery everywhere) |
| `saas.mainApp.domain` / `.subdomain` / `.skipHostnameCheck` | Which host counts as the main app |
| `saas.apps[]` | Hosts that bypass discovery entirely |
| `saas.excludeRoutePatterns[]` | Extra prefix or regex exclusions (main app only) |
| route `config.saas.exclude` | Per-route exclusion (main app only) |

## Extension seams

- To exclude a route from discovery, set `config: { saas: { exclude: true } }` on the route or add a pattern to `excludeRoutePatterns`.[^readme]
- A browser frontend on another origin needs CORS to allow the `X-Account-Id` request header.[^readme]

## Tests

`getHost.test.ts` pins host parsing, including ports and non-URL input.[^gethost-test] No test covers `discoverAccount` or the hook itself.

## Open questions

- Why is `"/invitation/token/"` a default exclusion? No package API route starts with it: the token routes live under `/accounts/:accountId/invitations/token/`, and `/invitation/token/:token` is the *frontend* accept page.
- Why is `Referer` preferred over `Host` when resolving the hostname?
- Why was discovery moved from `preHandler` to `onRequest` in 7ea314b?

[^plugin]: `plugin.ts` awaits `runMigrations`, registers `accountDiscoveryPlugin`, then registers the route plugins.
[^discovery-plugin]: The hook computes the hostname, checks `apps`, builds exclusion regexes, calls `discoverAccount`, sets `account`/`dbSchema`/`authEmailPrefix`, and replies 404 on error; the module is exported as `FastifyPlugin(plugin)`.
[^discover-account]: `getAccountById` filters by id and `slug` = NULL; `discoverAccount` branches on `skipHostnameCheck || hostname === mainApp.domain` and throws "Account not found".
[^config]: Default `apps`, `excludeRoutePatterns`, and the `mainApp` block, including the `skipHostnameCheck` expression.
[^account-sql]: WHERE `domain = hostname OR (slug || '.' || rootDomain) = hostname`.
[^slonik-filters]: Verified by reading the installed dist of fastify-slonik 0.94.1 in `packages/fastify/node_modules`.
[^gethost-test]: Cases such as `https://example.test:8080/path → example.test:8080` and `example → example`.
[^accounts-controller]: Routes use `preHandler: fastify.verifySession()`; `/my-accounts` sets `saas.exclude`.
[^invitations-controller]: The GET/POST `.../invitations/token/:token` and POST `.../invitations/join/:token` routes set `saas.exclude`.
[^readme]: README sections "Skip account discovery for specific routes in main app" and "Cross-Domain Requests (CORS) Configuration".
[^commit-onrequest]: A one-line diff changing `"preHandler"` to `"onRequest"` in what was then `customerDiscoveryPlugin.ts`.
[^commit-exclude-root]: Adds `/^\/$/` to the default exclusions.
