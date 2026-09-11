---
type: Runbook
title: Cutting a release
description: The steps to publish a new lockstep version of all saas packages to npm with shipjs — prepare a release branch, review the changelog, merge, verify the publish — and what cannot be undone.
tags: [runbook, release, shipjs, npm]
status: draft
generated:
  by: claude-code/claude-opus-5
  at: 2026-09-11T07:54:21Z
sources:
  - id: ship-config
    resource: repo://ship.config.js#L1-L17
    title: ship.config.js
    last_modified: 2025-08-01
  - id: trigger
    resource: repo://.github/workflows/shipjs-trigger.yml#L1-L34
    title: shipjs-trigger.yml
    last_modified: 2026-05-19
  - id: prepare
    resource: repo://.github/workflows/shipjs-manual-prepare.yml#L1-L29
    title: shipjs-manual-prepare.yml
    last_modified: 2026-04-17
  - id: root-pkg
    resource: repo://package.json#L1-L36
    title: Root package.json
    last_modified: 2026-05-19
  - id: env-example
    resource: repo://.env.example
    title: .env.example
    last_modified: 2024-12-09
  - id: commit-changelog-merge
    resource: repo://.git#21339b1
    title: "21339b1 Merge branch 'changelog' into releases/v0.29.1"
  - id: shipjs-docs
    resource: https://github.com/algolia/shipjs
    title: Ship.js upstream documentation
---

# Cutting a release

All three packages are released together at one version.[^ship-config] The mechanics of each workflow are in [release workflows](../ci/release-workflows.md). This page is the procedure.

**Status: inferred from configuration and history.** No written release procedure exists in the repository. Confirm this page with a maintainer before relying on it.

## Preconditions

- `main` is green on the [test workflow](../ci/test-workflow.md), and the commits since the last release follow Conventional Commits. The changelog is generated from them.
- You can push branches and open PRs on the GitHub repository.
- For a local prepare: a GitHub token in `GITHUB_TOKEN` (named in `.env.example`).[^env-example]

## Steps

1. **Prepare the release branch.**
   - Locally, on an up-to-date `main`: `pnpm exec shipjs prepare`.
   - Ship.js asks for the next version, bumps root and `packages/*`, updates `CHANGELOG.md`, pushes `releases/v<version>`, and opens a PR.[^shipjs-docs]
   - The comment-triggered `@shipjs prepare` workflow calls `npm run release`, which the root `package.json` does not define.[^prepare][^root-pkg] Do not rely on it until that is fixed.
2. **Review the PR.**
   - Check the version bump in all four `package.json` files.
   - Check the generated changelog. Edits can be pushed to the release branch; history shows a `changelog` branch merged into `releases/v0.29.1` for this purpose.[^commit-changelog-merge]
3. **Merge the PR.** The head branch must start with `releases/v` or the publish workflow will not run.[^trigger]
4. **Watch "Ship js trigger".** It installs, builds, and runs `shipjs trigger`, which publishes each package with `pnpm publish --access public`.[^trigger][^ship-config]
5. **Verify** that `@prefabs.tech/saas-fastify`, `saas-react`, and `saas-vue` show the new version on npm, and that the release tag exists.

## If the publish run fails

- Read the failing step. Setup-order and cache problems have happened before (see [release workflows](../ci/release-workflows.md#stage-2-trigger-and-publish-shipjs-triggeryml)).
- The trigger only runs on a merged `releases/v*` PR.[^trigger] History shows the fix for a failed run: land the fix on `main`, then prepare and merge a new release PR **for the same version**. v0.29.1 went through PRs #200 and #203.

## Irreversible

- *External npm behaviour:* a published version number cannot be reused, even after unpublishing. Check the version in step 2 before merging.
- Lockstep means an unchanged package is republished at the new version too.[^ship-config]

[^ship-config]: `packagesToBump` and `packagesToPublish: ["packages/*"]`; `publishCommand` returns `pnpm publish --access public`.
[^trigger]: `if: github.event.pull_request.merged == true && startsWith(github.head_ref, 'releases/v')`.
[^prepare]: `run: npm run release -- --yes --no-browse`.
[^root-pkg]: No `release` script in `scripts`.
[^env-example]: `GITHUB_TOKEN`, `NPM_TOKEN`.
[^commit-changelog-merge]: A changelog edit merged into the release branch before release PR #203.
[^shipjs-docs]: Ship.js prepare behaviour is upstream, not repository-verified.
