---
type: Setup
title: Development setup
description: Getting the saas monorepo building and tested on a fresh machine, testing unreleased changes inside a consuming app with pnpm link, and the local snags — make targets that call scripts which do not exist, hooks that build React on every commit, and host/port matching.
tags: [setup, local, pnpm, turbo, husky, pnpm-link]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: root-pkg
    resource: repo://package.json#L12-L36
    title: Root scripts, packageManager, engines
    last_modified: 2026-05-19
  - id: readme
    resource: repo://README.md#L8-L51
    title: Root README — install, build, link, troubleshooting
    last_modified: 2025-08-01
  - id: makefile
    resource: repo://makefile#L1-L62
    title: makefile
    last_modified: 2026-05-05
  - id: turbo
    resource: repo://turbo.json#L3-L49
    title: turbo tasks
    last_modified: 2026-05-05
  - id: npmrc
    resource: repo://.npmrc
    title: .npmrc
    last_modified: 2024-12-09
  - id: husky-pre
    resource: repo://.husky/pre-commit
    title: pre-commit hook
    last_modified: 2024-12-09
  - id: react-pkg
    resource: repo://packages/react/package.json#L19-L32
    title: react scripts
    last_modified: 2026-07-29
  - id: vue-pkg
    resource: repo://packages/vue/package.json#L19-L32
    title: vue scripts
    last_modified: 2026-07-29
  - id: fastify-pkg
    resource: repo://packages/fastify/package.json#L25-L32
    title: fastify scripts
    last_modified: 2026-07-29
  - id: test-workflow
    resource: repo://.github/workflows/test.yml#L9-L28
    title: CI Node matrix
    last_modified: 2026-04-17
---

# Development setup

## What "running it" means here

This repository contains **three libraries, not an app**. There is no server, database, or docker-compose to start. "Running" means building and testing the packages. To see them working, link them into a consuming Fastify, React, or Vue application, which brings its own Postgres, SuperTokens core, and mailer.

## Toolchain

| Tool | Version | Source |
| --- | --- | --- |
| Node.js | ≥ 20. CI tests 20, 22, and 24; releases use 24 | [^root-pkg][^test-workflow] |
| pnpm | 9.12.2 (`packageManager`), ≥ 9 | [^root-pkg] |
| make | optional wrapper | [^makefile] |

## First run

```bash
pnpm install        # or: make install  (runs pnpm -r install)
pnpm build          # turbo: build every package
pnpm test           # turbo: test every package in parallel
pnpm lint
pnpm typecheck
```

[^readme][^makefile][^root-pkg]

- `pnpm install` also runs `prepare: husky`, which installs the git hooks.[^root-pkg]
- `.npmrc` sets `auto-install-peers = false`, so peers are not installed implicitly.[^npmrc] The packages keep their peers as devDependencies, which is why local builds still work.[^fastify-pkg]

## Testing unreleased changes in an app

From the consuming app's directory:[^readme]

```bash
pnpm link ./<path_to_saas_repo>/packages/<fastify|react|vue>
# …and to undo:
pnpm unlink ./<path_to_saas_repo>/packages/<fastify|react|vue>
```

- Rebuild the package after changes. Each package's entry points are in `dist`.[^fastify-pkg]
- The README warns that every library that *defines or uses* a React context must be linked together, or the context breaks. It also warns that the app may need a restart after linking or unlinking.[^readme]
- For the backend host checks to pass locally, see [signup does not create an account](../troubleshooting/signup-does-not-create-account.md) and [account not found 404](../troubleshooting/account-not-found-404.md). Host comparisons include the port.

## Snags

| Snag | Why |
| --- | --- |
| `make test.ci`, `make test.integration`, `make test.unit` fail | They call `pnpm test:ci`, `pnpm test:integration`, `pnpm test:unit`, which the root `package.json` does not define. turbo declares the tasks, but nothing invokes them from the root.[^makefile][^root-pkg][^turbo] |
| `make release` / `make publish` may say `shipjs: command not found` | The targets call `shipjs` directly instead of through `pnpm`. *Inference:* make does not put `node_modules/.bin` on `PATH`; use `pnpm exec shipjs …` instead.[^makefile] |
| Every commit is slow | The pre-commit hook runs lint, typecheck, and test for all packages, and React's `test` script runs `pnpm build` first.[^husky-pre][^react-pkg] |
| React/Vue `pnpm test` "passes" | Neither package has test files; both run with pass-with-no-tests. Only saas-fastify has tests.[^react-pkg][^vue-pkg] |
| Vue typecheck behaves differently | saas-vue uses TypeScript 4.9.5 with `vue-tsc` 1.8.27; the other packages use TypeScript 5.9.3.[^vue-pkg] |

[^root-pkg]: `scripts`, `packageManager: "pnpm@9.12.2"`, `engines`.
[^readme]: "Installation & Usage", "Developing locally & testing", and "Troubleshooting".
[^makefile]: The `install`, `publish`, `release`, `test.ci`, `test.integration`, and `test.unit` targets.
[^turbo]: The `test:ci`, `test:integration`, and `test:unit` tasks.
[^npmrc]: `auto-install-peers = false`.
[^husky-pre]: `pnpm lint`, `pnpm typecheck`, `pnpm test`.
[^react-pkg]: `"test": "pnpm build && vitest … --pass-with-no-tests"`.
[^vue-pkg]: `--passWithNoTests`; `typecheck` via `vue-tsc`.
[^fastify-pkg]: `build` and `test` scripts; `main`/`module` point into `dist`.
[^test-workflow]: `matrix.node-version: [20, 22, 24]`.
