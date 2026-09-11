---
type: Convention
title: Enforced tooling and hooks
description: The rules that tooling actually enforces on contributions — conventional commits, the pre-commit lint/typecheck/test gate, shared ESLint/Stylelint/tsconfig presets — and which of them CI does not re-check.
tags: [conventions, commitlint, husky, eslint, stylelint, typescript]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: root-pkg
    resource: repo://package.json#L12-L36
    title: Root scripts, packageManager, engines
    last_modified: 2026-05-19
  - id: commitlint
    resource: repo://.commitlintrc.json
    title: commitlint config
    last_modified: 2024-12-09
  - id: husky-commit
    resource: repo://.husky/commit-msg
    title: commit-msg hook
    last_modified: 2024-12-09
  - id: husky-pre
    resource: repo://.husky/pre-commit
    title: pre-commit hook
    last_modified: 2024-12-09
  - id: fastify-eslint
    resource: repo://packages/fastify/eslint.config.mjs#L1-L30
    title: fastify ESLint flat config
    last_modified: 2026-07-16
  - id: react-eslint
    resource: repo://packages/react/eslint.config.js#L1-L12
    title: react ESLint flat config
    last_modified: 2026-05-04
  - id: vue-eslint
    resource: repo://packages/vue/eslint.config.js#L1-L10
    title: vue ESLint flat config
    last_modified: 2026-05-04
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
  - id: test-workflow
    resource: repo://.github/workflows/test.yml#L1-L26
    title: Test suite workflow
    last_modified: 2026-04-17
  - id: npmrc
    resource: repo://.npmrc
    title: .npmrc
    last_modified: 2024-12-09
  - id: renovate
    resource: repo://renovate.json
    title: Renovate config
    last_modified: 2024-12-09
  - id: commit-typecheck
    resource: repo://.git#b68207f
    title: "b68207f (2026-05-13) chore(tsconfig): update typecheck command and add tsconfig.vitest.json (#197)"
    last_modified: 2026-05-13
---

# Enforced tooling and hooks

Everything on this page is **enforced** by a tool. Patterns that are only observed are in [model module layout](model-module-layout.md).

## Commits

- **Conventional Commits.** The husky `commit-msg` hook runs `pnpm commitlint --edit $1` with `@commitlint/config-conventional`.[^husky-commit][^commitlint]
- These messages matter downstream: shipjs builds `CHANGELOG.md` from them, so `feat`/`fix`/`!` choose the release notes (see [release workflows](../ci/release-workflows.md)).
- Hooks install through the root `prepare: husky` script whenever dependencies are installed.[^root-pkg]

## The pre-commit gate

`.husky/pre-commit` runs `pnpm lint`, `pnpm typecheck`, and `pnpm test` across all packages through turbo.[^husky-pre][^root-pkg] Because `saas-react`'s `test` script starts with `pnpm build`, every commit also builds the React package.[^react-pkg]

**CI re-runs only build and test.** The GitHub test workflow never runs `lint` or `typecheck`.[^test-workflow] Lint and type errors are caught locally and nowhere else, so `git commit --no-verify` bypasses them entirely.

## Lint

| Package | Preset | Local overrides |
| --- | --- | --- |
| fastify | `@prefabs.tech/eslint-config/fastify.js` | `unicorn/filename-case` allows camel, kebab, pascal, and snake case; `__test__` is ignored[^fastify-eslint] |
| react | `@prefabs.tech/eslint-config/react-app.js` | `@eslint-react/naming-convention-context-name` and `@typescript-eslint/no-empty-object-type` turned off[^react-eslint] |
| vue | `@prefabs.tech/eslint-config/vue.js` | `unicorn/no-empty-file` turned off[^vue-eslint] |

- Stylelint (`@prefabs.tech/stylelint-config`) runs on `src/**/*.{css,vue}` in react and vue only.[^react-pkg][^vue-pkg]
- `sort-package` runs `sort-package-json` on every manifest.[^root-pkg]

## Types

- Each package's `tsconfig.json` extends `@prefabs.tech/tsconfig` (`fastify.json`, `react`, or `vue`).
- `typecheck` runs `tsc --noEmit -p tsconfig.vitest.json --composite false` (`vue-tsc` for vue), so test globals are typed too. This was introduced in b68207f.[^fastify-pkg][^react-pkg][^vue-pkg][^commit-typecheck]

## Toolchain and dependencies

- `packageManager: pnpm@9.12.2`; `engines: node >= 20, pnpm >= 9`.[^root-pkg]
- `.npmrc` sets `auto-install-peers = false`,[^npmrc] and CI installs with `--frozen-lockfile --strict-peer-dependencies`.[^test-workflow] *Inference:* a peer range mismatch fails CI install even when local installs appear fine.
- Renovate runs with `config:base`.[^renovate]

[^root-pkg]: `scripts` (`prepare`, `lint`, `typecheck`, `test`, `sort-package`), `packageManager`, `engines`.
[^commitlint]: `extends: ["@commitlint/config-conventional"]`.
[^husky-commit]: `pnpm commitlint --edit $1`.
[^husky-pre]: `pnpm lint`, `pnpm typecheck`, `pnpm test`.
[^fastify-eslint]: The `unicorn/filename-case` rule with `cases` and `ignore: [/__test__/]`.
[^react-eslint]: The two rules set to `"off"`.
[^vue-eslint]: `"unicorn/no-empty-file": "off"`.
[^fastify-pkg]: The `typecheck` script.
[^react-pkg]: `test: "pnpm build && vitest …"`, the `stylelint` and `typecheck` scripts.
[^vue-pkg]: The `stylelint` script and the `vue-tsc` `typecheck` script.
[^test-workflow]: Steps: checkout, setup-node, pnpm install, `pnpm build`, `pnpm test`.
[^npmrc]: `auto-install-peers = false`.
[^renovate]: `extends: ["config:base"]`.
[^commit-typecheck]: Adds `tsconfig.vitest.json` and changes the typecheck commands.
