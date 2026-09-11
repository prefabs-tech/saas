# CI

Continuous integration setup for the project, pipeline configuration, build and test workflows, and the conventions that govern when they run. Covers signing, artifact handling, and how a failing check gets diagnosed.

# Workflows

- [Test suite workflow](test-workflow.md) - What the GitHub "Test suite" workflow runs on every push (install, build, test on Node 20/22/24), what it does not run (lint, typecheck), and how to reproduce a failure locally.
- [Release workflows (shipjs)](release-workflows.md) - How versions are prepared and published — the comment-triggered shipjs prepare workflow, the release-branch merge that triggers npm publish of all packages in lockstep, the secrets each needs, and the known defects in both.
