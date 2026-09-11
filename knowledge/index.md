---
okf_version: "0.2"
---

# Project knowledge Base

Durable knowledge for the project, kept as an [OKF v0.2](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md) bundle. The code says what the system does; this says why, how we found out, and what to watch for.

Start here, then open only what you need. See [the authoring contract](CLAUDE.md) before writing.

# Start here

- [@prefabs.tech/saas-fastify](wiki/components/saas-fastify.md) - The Fastify plugin that owns tenant accounts, account types, memberships and invitations — its routes, exports, configuration surface and extension seams.
- [Account discovery](wiki/architecture/account-discovery.md) - How saas-fastify resolves every API request to a tenant account in a global onRequest hook — by host or by x-account-id header — and why it fails closed with a 404.
- [Tenant schema isolation (multi-database)](wiki/architecture/tenant-schema-isolation.md) - How an account gets its own Postgres schema — which subdomains/multiDatabase combinations trigger it, which tables live there, how requests are routed to it, and when it is migrated.
- [Frontend account context](wiki/architecture/frontend-account-context.md) - How saas-react and saas-vue tell admin app, main app and tenant host apart, choose and persist the active account, and send it to the API as the x-account-id header — and where the two implementations diverge.
- [Package boundaries and duplicated contracts](wiki/architecture/package-boundaries.md) - The three workspace packages share no code — their contract is the HTTP API plus constants, paths and payload shapes duplicated by hand, which must be changed together.

| If you are… | Start at |
| --- | --- |
| Building or testing the packages locally, or linking them into an app | [Development setup](wiki/local/development-setup.md) |
| Adding a backend endpoint or model | [Model module layout](wiki/conventions/model-module-layout.md), then [Account discovery](wiki/architecture/account-discovery.md) |
| Changing a table or adding a per-tenant table | [Tenant schema isolation](wiki/architecture/tenant-schema-isolation.md), [Tenant schema migrations](wiki/operations/tenant-schema-migrations.md) |
| Touching sign-up, sign-in or sessions | [SuperTokens recipe overrides](wiki/architecture/supertokens-recipe-overrides.md), [Sign-up and account creation](wiki/architecture/signup-account-creation.md) |
| Working on invitations | [Account invitations](wiki/domain/account-invitations.md), [Invitation flow](wiki/architecture/invitation-flow.md) |
| Changing a constant, path or payload shared with a frontend | [Package boundaries](wiki/architecture/package-boundaries.md) |
| Adding screens or routes in React/Vue | [SaaS routes and screens](wiki/ui/saas-routes-and-screens.md) |
| Shipping a release | [Cutting a release](wiki/operations/cutting-a-release.md), [Release workflows](wiki/ci/release-workflows.md) |
| Diagnosing a failing CI check | [Test suite workflow](wiki/ci/test-workflow.md) |
| Debugging "Account not found" | [API returns 404 "Account not found"](wiki/troubleshooting/account-not-found-404.md) |
| Reviewing auth or authorization | [Request trust boundaries](wiki/security/request-trust-boundaries.md) |

# Knowledge

- [Architecture](wiki/architecture/) - cross-cutting structure, the couplings and orderings no single file makes obvious
- [CI](wiki/ci/) - pipeline configuration, build and test workflows, and when they run
- [Components](wiki/components/) - one concept per app, library, service, or tool
- [Conventions](wiki/conventions/) - the patterns this repo expects you to follow
- [Domain](wiki/domain/) - product and business knowledge: what the code's concepts mean to the business
- [Local](wiki/local/) - getting the project running on a fresh machine, and the known snags
- [Operations](wiki/operations/) - runbooks for setup, services, migrations, and release
- [Reference](wiki/reference/) - standing explanations of concepts, terms, and external systems
- [Security](wiki/security/) - threat model and the controls that address it: secrets, auth, transport, permissions
- [Troubleshooting](wiki/troubleshooting/) - symptoms, causes, fixes
- [UI](wiki/ui/) - screens, widgets, navigation, and the design system that keeps them consistent

# Operational

These three directories sit outside the default load. They are not alike: `_sources/` holds real concepts to read on demand, `_log/` is history, and `raw/` is not to be read at all.

- [Sources](_sources/) - knowledge ingested from outside the repository, populated by `/repokb:ingest` and `/repokb:ingest-conversation`. Real concepts, cited like any other — read them when a topic calls for them, not by default: [Conversations](_sources/conversations/), [External](_sources/external/)
- [Update log](_log/) - bundle change history, one file per day (`YYYYMMDD.md`)
- [Raw](raw/) - the originals the concepts were distilled from - files, fetched pages, and conversations alike: [Images](raw/images/), [PDFs](raw/pdfs/), [Documents](raw/documents/), [ADRs](raw/adrs/), [Conversations](raw/conversations/), [Others](raw/others/)

**Agents: `raw/` is strictly for humans. Never open, read, or load in context a file under `raw/`.** Link to it for a human reader and stop there.
