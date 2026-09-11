---
type: CI
title: Release workflows (shipjs)
description: How versions are prepared and published — the comment-triggered shipjs prepare workflow, the release-branch merge that triggers npm publish of all packages in lockstep, the secrets each needs, and the known defects in both.
tags: [ci, release, shipjs, npm, github-actions, versioning]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: prepare
    resource: repo://.github/workflows/shipjs-manual-prepare.yml#L1-L61
    title: shipjs-manual-prepare.yml
    last_modified: 2026-04-17
  - id: trigger
    resource: repo://.github/workflows/shipjs-trigger.yml#L1-L34
    title: shipjs-trigger.yml
    last_modified: 2026-05-19
  - id: ship-config
    resource: repo://ship.config.js#L1-L17
    title: ship.config.js
    last_modified: 2025-08-01
  - id: root-pkg
    resource: repo://package.json#L1-L36
    title: Root package.json (no release script)
    last_modified: 2026-05-19
  - id: makefile
    resource: repo://makefile#L24-L30
    title: make publish / make release
    last_modified: 2026-05-05
  - id: env-example
    resource: repo://.env.example
    title: .env.example
    last_modified: 2024-12-09
  - id: commit-ci-order
    resource: repo://.git#01e992e
    title: "01e992e (2026-05-19) fix(ci): correct pnpm setup order in shipjs-trigger workflow"
    last_modified: 2026-05-19
  - id: commit-release-200
    resource: repo://.git#da3065b
    title: "da3065b (2026-05-19) chore: release v0.29.1 (#200)"
    last_modified: 2026-05-19
  - id: commit-release-203
    resource: repo://.git#c608de7
    title: "c608de7 (2026-05-20) chore: release v0.29.1 (#203)"
    last_modified: 2026-05-20
  - id: commit-changelog-merge
    resource: repo://.git#21339b1
    title: "21339b1 Merge branch 'changelog' into releases/v0.29.1"
  - id: shipjs-docs
    resource: https://github.com/algolia/shipjs
    title: Ship.js upstream documentation
---

# Release workflows (shipjs)

Releases use [Ship.js](https://github.com/algolia/shipjs)[^shipjs-docs] in monorepo mode. **All packages share one version**: the root `package.json` version is bumped into every `packages/*`, and every package is published.[^ship-config] The procedure a person follows is in [cutting a release](../operations/cutting-a-release.md).

## Stage 1: prepare (`shipjs-manual-prepare.yml`)

| | |
| --- | --- |
| Trigger | `issue_comment` created, body starting with `@shipjs prepare`, author association `member` or `owner`[^prepare] |
| Runs | checkout `main` (full history) → setup Node 24 → set bot git identity → `npm run release -- --yes --no-browse`[^prepare] |
| Secrets | `GITHUB_TOKEN`, `SLACK_INCOMING_HOOK`[^prepare] |
| After | comments `` `shipjs prepare` done `` or `` `shipjs prepare` fail `` on the issue[^prepare] |

**Known defects, from reading the file:**

- The root `package.json` has **no `release` script**, and `git log -S'"release"' -- package.json` finds none ever having existed.[^root-pkg] `npm run release` fails with a missing-script error, so this workflow cannot succeed as written.
- It installs neither pnpm nor dependencies before invoking the release.[^prepare]
- The author-association comparison uses lowercase values (see [request trust boundaries](../security/request-trust-boundaries.md#open-questions)).

*Inference from the history:* releases are prepared locally or by hand. Ship.js `prepare` creates a `releases/v<version>` branch with version bumps and a changelog, then opens a PR.[^shipjs-docs] History shows a `changelog` branch merged into `releases/v0.29.1` before the release PR merged.[^commit-changelog-merge]

## Stage 2: trigger and publish (`shipjs-trigger.yml`)

| | |
| --- | --- |
| Trigger | `pull_request` **closed** with `merged == true` and head branch starting `releases/v`[^trigger] |
| Runs | checkout `main` → `pnpm/action-setup` → setup Node 24 with pnpm cache → `pnpm install --frozen-lockfile --strict-peer-dependencies` → bot git identity → `npx shipjs trigger`[^trigger] |
| Shipjs config | install `pnpm -r install`; build `pnpm build`; publish each package with `pnpm publish --access public`[^ship-config] |
| Secrets | `GITHUB_TOKEN`, `NPM_AUTH_TOKEN`, `SLACK_INCOMING_HOOK`[^trigger] |

**Ordering constraint:** `pnpm/action-setup` must come *before* `actions/setup-node` when `cache: "pnpm"` is set. 01e992e's message says so explicitly: *"Run pnpm/action-setup before setup-node so the pnpm cache works, and install dependencies in an explicit step instead of run_install."*[^commit-ci-order]

The dates around that fix:

1. Release PR #200 for v0.29.1 merged on 2026-05-19.[^commit-release-200]
2. The ordering fix (#201) landed the same day.[^commit-ci-order]
3. A second v0.29.1 release PR (#203) merged on 2026-05-20.[^commit-release-203]

*Inference:* the first trigger run failed on the setup order and the release was re-cut.

## Secrets and variables, by name

| Name | Where | Purpose |
| --- | --- | --- |
| `GITHUB_TOKEN` | both workflows; `.env.example` | shipjs git and GitHub operations[^prepare][^trigger][^env-example] |
| `NPM_AUTH_TOKEN` | trigger workflow | npm publish[^trigger] |
| `NPM_TOKEN` | `.env.example` only | named differently from the workflow's `NPM_AUTH_TOKEN`; *inference:* for local shipjs runs[^env-example] |
| `SLACK_INCOMING_HOOK` | both workflows | shipjs Slack notifications[^prepare][^trigger] |

## Local equivalents

`make release` runs `shipjs prepare`; `make publish` runs `shipjs trigger`.[^makefile] See [development setup](../local/development-setup.md#snags) for the `PATH` caveat.

## Open questions

- Is the comment-triggered prepare workflow still meant to be used? If so it needs a root `"release": "shipjs prepare"` script and a pnpm install step.
- Should `.env.example` say `NPM_AUTH_TOKEN` to match the publish workflow?

[^prepare]: The job `if:`, the steps, `npm run release -- --yes --no-browse`, and the comment jobs.
[^trigger]: The `if:` on the merged `releases/v*` head ref, step order, `npx shipjs trigger`, `env:`.
[^ship-config]: `monorepo.mainVersionFile`, `packagesToBump`, `packagesToPublish`, and the install/build/publish commands.
[^root-pkg]: The `scripts` block has no `release` entry.
[^makefile]: `publish: shipjs trigger`, `release: shipjs prepare`.
[^env-example]: `GITHUB_TOKEN` and `NPM_TOKEN` placeholders.
[^commit-ci-order]: Commit body quoted verbatim.
[^commit-release-200]: First v0.29.1 release commit.
[^commit-release-203]: Second v0.29.1 release commit.
[^commit-changelog-merge]: Merge of a changelog branch into the release branch, followed by "docs: update changelog".
[^shipjs-docs]: Ship.js's prepare → release PR → trigger model is upstream behaviour, not verified in this repository.
