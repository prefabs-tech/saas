# Security

Threat model and the controls that address it - credential storage, authentication and token handling, transport, and permissions. Covers where secrets live, who can reach what, and the decisions behind each boundary.

# Boundaries

- [Request trust boundaries](request-trust-boundaries.md) - Which saas-fastify routes require a session, which inputs decide the tenant, what the package does and does not check (authentication, tenant resolution, authorization), how invitation tokens and identities are protected, and where secrets enter CI.
