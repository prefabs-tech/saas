---
type: Troubleshooting
title: "API returns 404 \"Account not found\""
description: Symptom → cause → fix for 404 {"error":{"message":"Account not found"}} from a saas-fastify API, and for the frontends' "unregistered domain" / not-found screens that it produces.
tags: [troubleshooting, account-discovery, 404, x-account-id, cors]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: discovery-plugin
    resource: repo://packages/fastify/src/plugins/accountDiscoveryPlugin.ts#L14-L68
    title: accountDiscoveryPlugin
    last_modified: 2026-05-04
  - id: discover-account
    resource: repo://packages/fastify/src/lib/discoverAccount.ts#L20-L70
    title: discoverAccount
    last_modified: 2026-05-04
  - id: config
    resource: repo://packages/fastify/src/config.ts#L7-L43
    title: apps, exclusions, mainApp defaults
    last_modified: 2026-05-04
  - id: react-client
    resource: repo://packages/react/src/api/axios/client.ts#L5-L26
    title: React axios client
    last_modified: 2025-09-03
  - id: react-wrapper
    resource: repo://packages/react/src/SaasWrapper.tsx#L29-L56
    title: React SaasWrapper 404 page
    last_modified: 2026-05-04
  - id: vue-error
    resource: repo://packages/vue/src/composables/UseGlobalAccountError.ts#L9-L34
    title: Vue useGlobalAccountError
    last_modified: 2026-05-04
  - id: readme-cors
    resource: repo://packages/fastify/README.md#L118-L170
    title: README — excluding routes, CORS header
    last_modified: 2025-10-16
---

# API returns 404 "Account not found"

## Symptom

- An API call returns HTTP 404 with body `{"error":{"message":"Account not found"}}`.[^discovery-plugin]
- In React, the whole app shows the "unregistered domain" page, because `SaasWrapper`'s `GET /` probe got a 404.[^react-wrapper]
- In Vue, `NotFoundMessage` appears once any call hits this error.[^vue-error]

The response comes from the [account discovery](../architecture/account-discovery.md) `onRequest` hook, **before** routing or authentication.[^discovery-plugin] The route's handler never ran.

## Find which branch you are in

Work out the hostname the API saw: the `Referer`, else `Origin`, else `Host` of the request, **including port**.[^discovery-plugin] Then compare:

| Hostname equals… | Discovery used |
| --- | --- |
| an `apps[].domain` (default `admin.<rootDomain>`) | none, so it **cannot** be this error |
| `mainApp.domain`, or `subdomains: "disabled"` | the `x-account-id` header |
| anything else | the host (slug or custom domain) |

[^config][^discover-account]

## Causes and fixes

| # | Cause | Check | Fix |
| --- | --- | --- | --- |
| 1 | Main app, no `x-account-id` on a route that is not excluded | Request headers | Select an account first. In React, the client sends the header only when `sessionStorage` has an id, and then sends the `localStorage` value.[^react-client] For routes that are account-independent, exclude them.[^readme-cors] |
| 2 | Main app, header holds the id of an account **with a slug** | `accounts.slug` for that id | Header discovery only matches accounts where `slug IS NULL`.[^discover-account] Use the tenant's own host. |
| 3 | The frontend host is not *exactly* `mainApp.domain` (usually a port, e.g. `localhost:5173` vs `app.example.test`), so it is treated as a tenant host | Compare the `Referer`/`Origin` host with `mainApp.domain` | Set `saas.mainApp.domain` to the exact host including port, or use `subdomains: "disabled"` locally, which turns on `skipHostnameCheck`.[^config] |
| 4 | Tenant host not registered | No account with `domain = host` or `slug || '.' || rootDomain = host` | Create the account, or fix `rootDomain`. Exclusions do **not** apply on tenant hosts.[^discover-account] |
| 5 | Admin app host not in `apps` | `apps` config vs the admin host | Add the admin host to `saas.apps` so discovery is skipped.[^config] |
| 6 | Browser dropped `X-Account-Id` (cross-origin) | Preflight response `Access-Control-Allow-Headers` | Allow `X-Account-Id` in `@fastify/cors`.[^readme-cors] |
| 7 | *(React "unregistered domain" on the main app)* The API has no `GET /` route | `curl <api>/` | *Inference:* the probe needs any 2xx on `GET /`; saas-fastify does not provide one.[^react-wrapper] |

[^discovery-plugin]: The hostname expression, the header read, and the 404 reply shape.
[^discover-account]: The header branch filters `slug IS NULL`; the host branch otherwise; throws when not found.
[^config]: `apps` default, default exclusions, `mainApp.domain` and `skipHostnameCheck`.
[^react-client]: The sessionStorage/localStorage read before setting the header.
[^react-wrapper]: `if (error.status === 404)` → the unregistered-domain page.
[^vue-error]: The 404 plus `"Account not found"` check.
[^readme-cors]: `config.saas.exclude`, `excludeRoutePatterns`, and `allowedHeaders: ['X-Account-Id']`.
