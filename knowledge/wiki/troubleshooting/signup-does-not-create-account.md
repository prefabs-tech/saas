---
type: Troubleshooting
title: Main-app sign-up does not create an account
description: Symptom → cause → fix when signing up on the main app creates a user but no account (or the form shows user fields only), which comes from exact host matching against mainApp.domain on both backend and frontend.
tags: [troubleshooting, signup, main-app, local, hostname]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: signup-post
    resource: repo://packages/fastify/src/supertokens/recipes/third-party-email-password/emailPasswordSignUpPost.ts#L47-L117
    title: emailPasswordSignUpPOST main-app branch
    last_modified: 2026-07-16
  - id: gethost
    resource: repo://packages/fastify/src/lib/getHost.ts#L1-L17
    title: getHost
    last_modified: 2025-10-10
  - id: config
    resource: repo://packages/fastify/src/config.ts#L35-L43
    title: mainApp defaults
    last_modified: 2026-05-04
  - id: react-provider
    resource: repo://packages/react/src/contexts/AccountsProvider.tsx#L60-L65
    title: React isMainApp
    last_modified: 2026-05-04
  - id: react-signup
    resource: repo://packages/react/src/views/Signup/index.tsx#L64-L75
    title: React SignupPage form choice
    last_modified: 2026-05-04
  - id: vue-store
    resource: repo://packages/vue/src/stores/MyAccounts.ts#L46-L65
    title: Vue isMainApp
    last_modified: 2026-07-16
---

# Main-app sign-up does not create an account

## Symptoms

- On the main app, the sign-up page shows only email and password, with no account name, slug, or individual/organization fields.
- Or the account form is shown, but after sign-up the user has **no accounts** (`/my-accounts` is empty).
- Or sign-up fails with `ERROR_MISSING_ACCOUNT_FORM_FIELDS` (422).

## Cause

Main-app detection is an **exact string comparison of hosts**, done independently on each side:

| Side | Compares | With |
| --- | --- | --- |
| Backend | `getHost(Referer \|\| Origin \|\| request.hostname)`: host **with port** | `saas.mainApp.domain`, default `<mainApp.subdomain \| "app">.<rootDomain>`[^signup-post][^gethost][^config] |
| React | `window.location.host`: host **with port** | `config.saas.mainApp.domain`, same default[^react-provider] |
| Vue | first label of `window.location.hostname` | `mainAppSubdomain`[^vue-store] |

The failure modes:

| Frontend thinks | Backend thinks | Result |
| --- | --- | --- |
| not main app | — | user sign-up form, so no account fields are sent[^react-signup] |
| main app | not main app | `accountFormFields` are ignored; a plain user with no account is created[^signup-post] |
| not main app | main app | backend demands `accountFormFields` → `ERROR_MISSING_ACCOUNT_FORM_FIELDS`[^signup-post] |

A related case: `user.features.signUp.enabled === false` rejects every sign-up with `SIGN_UP_DISABLED`, returned as 404.[^signup-post]

## Fix

1. Take the exact host the browser is on, e.g. `localhost:3000` or `app.example.test:8080`.
2. Set the backend's `saas.mainApp.domain` to it.[^config]
3. Set the React app's `saas.mainApp.domain` to the same value.[^react-provider] In a Vue app, make the first host label equal `mainAppSubdomain`.[^vue-store]
4. Make sure the sign-up request carries a `Referer` or `Origin` header that the backend can parse. Plain `localhost` without a scheme is returned as-is by `getHost`.[^gethost]

`mainApp.skipHostnameCheck` does **not** help here. The sign-up override does not consult it.[^signup-post]

[^signup-post]: `SIGN_UP_DISABLED`, `hostname === mainAppDomain`, `ERROR_MISSING_ACCOUNT_FORM_FIELDS`.
[^gethost]: `new URL(url).host`, falling back to the raw string.
[^config]: `mainApp.domain` default expression.
[^react-provider]: `host === mainApp?.domain`.
[^react-signup]: `isMainApp ? <AccountSignupForm> : <UserSignupForm>`.
[^vue-store]: `subdomain === config.value.mainAppSubdomain`.
