---
type: CI
title: Test suite workflow
description: What the GitHub "Test suite" workflow runs on every push (install, build, test on Node 20/22/24), what it does not run (lint, typecheck), and how to reproduce a failure locally.
tags: [ci, github-actions, tests, pnpm, turbo]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: workflow
    resource: repo://.github/workflows/test.yml#L1-L28
    title: .github/workflows/test.yml
    last_modified: 2026-04-17
  - id: root-pkg
    resource: repo://package.json#L12-L22
    title: Root scripts
    last_modified: 2026-05-19
  - id: turbo
    resource: repo://turbo.json#L3-L42
    title: turbo tasks
    last_modified: 2026-05-05
  - id: fastify-pkg
    resource: repo://packages/fastify/package.json#L25-L32
    title: fastify scripts
    last_modified: 2026-07-29
  - id: react-pkg
    resource: repo://packages/react/package.json#L19-L32
    title: react scripts
    last_modified: 2026-07-29
  - id: vue-pkg
    resource: repo://packages/vue/package.json#L19-L32
    title: vue scripts
    last_modified: 2026-07-29
  - id: husky-pre
    resource: repo://.husky/pre-commit
    title: pre-commit hook
    last_modified: 2024-12-09
---

# Test suite workflow

## Trigger and matrix

- `on: push`: every push to every branch in the repository. There is no `pull_request` trigger.[^workflow] *Inference:* pull requests from forks get no test run.
- One job, `ubuntu-latest`, for Node `20`, `22`, and `24`.[^workflow]

## Steps

1. Checkout.
2. `actions/setup-node` with the matrix version. No dependency cache is configured.
3. `pnpm/action-setup` with `run_install`: recursive install with `--frozen-lockfile --strict-peer-dependencies`.
4. `pnpm build`: turbo `build` across packages, outputs `dist/**`.
5. `pnpm test`: turbo `test --parallel`.

[^workflow][^root-pkg][^turbo]

What `pnpm test` runs per package:

| Package | Command | Actually tests |
| --- | --- | --- |
| fastify | `vitest run --coverage` | 5 files, 85 tests (unit only, no database)[^fastify-pkg] |
| react | `pnpm build && vitest --environment jsdom run --coverage --pass-with-no-tests` | nothing; rebuilds the package a second time[^react-pkg] |
| vue | `vitest --environment jsdom run --coverage --passWithNoTests` | nothing[^vue-pkg] |

## What gates a merge vs. what is advisory

- This workflow is the only CI check on code. Nothing in the repository configures branch protection, so whether it is *required* is decided in GitHub settings, not here.
- **Lint and typecheck do not run in CI.** They run only in the local pre-commit hook, which `--no-verify` bypasses.[^husky-pre][^workflow] See [enforced tooling](../conventions/enforced-tooling.md).
- Coverage is generated but never uploaded or thresholded.[^workflow][^fastify-pkg]

## Diagnosing a failure

| Failing step | Likely cause | Reproduce |
| --- | --- | --- |
| Install | `pnpm-lock.yaml` out of sync with a `package.json`, or a peer range not satisfied (strict peers) | `pnpm install --frozen-lockfile --strict-peer-dependencies` |
| Build | Vite or `tsc --emitDeclarationOnly` error in one package | `pnpm --filter @prefabs.tech/saas-<pkg> build` |
| Test | A fastify unit test | `cd packages/fastify && pnpm vitest run` |
| Only one Node version fails | An engine-specific dependency | Rerun locally with that Node major |

The root README's troubleshooting note, "Make sure that `package.json` and `pnpm-lock.yml` are synchronized", addresses the install case.

[^workflow]: `on: push`, the matrix, and the five steps.
[^root-pkg]: `"build": "turbo run build"`, `"test": "turbo run test --parallel"`.
[^turbo]: `build` depends on `^build` with outputs `dist/**`; `test` has no outputs.
[^fastify-pkg]: `"test": "vitest run --coverage"`.
[^react-pkg]: `"test": "pnpm build && vitest … --coverage --pass-with-no-tests"`.
[^vue-pkg]: `"test": "vitest … --coverage --passWithNoTests"`.
[^husky-pre]: Lint and typecheck run only here.
