# Architecture

Cross-cutting structure — the couplings and orderings that no single file makes obvious.

# Backend request path

- [Account discovery](account-discovery.md) - How saas-fastify resolves every API request to a tenant account in a global onRequest hook — by host or by x-account-id header — and why it fails closed with a 404.
- [Plugin registration order](plugin-registration-order.md) - The order a consuming Fastify app must register saas-fastify and its peer plugins in, and what the saas plugin does at register time, at onReady, and in the separate account-migration plugin.
- [Tenant schema isolation (multi-database)](tenant-schema-isolation.md) - How an account gets its own Postgres schema — which subdomains/multiDatabase combinations trigger it, which tables live there, how requests are routed to it, and when it is migrated.
- [SuperTokens recipe overrides](supertokens-recipe-overrides.md) - How saas-fastify threads the discovered account into SuperTokens through userContext, prefixes auth identities per slugged account, provisions users and memberships on sign-up, and blocks disabled or deleted users at session time.

# End-to-end flows

- [Sign-up and account creation](signup-account-creation.md) - What happens end to end when someone signs up on the main app (a new account plus its owner) versus on a tenant host (a member of that account), including validation and the compensating account delete.
- [Invitation flow](invitation-flow.md) - End to end from "invite" to membership — backend creation and email link, the frontend accept page that routes to join or sign-up, and the two acceptance endpoints — including the places where React, Vue and the backend disagree.

# Frontend and package boundaries

- [Frontend account context](frontend-account-context.md) - How saas-react and saas-vue tell admin app, main app and tenant host apart, choose and persist the active account, and send it to the API as the x-account-id header — and where the two implementations diverge.
- [Package boundaries and duplicated contracts](package-boundaries.md) - The three workspace packages share no code — their contract is the HTTP API plus constants, paths and payload shapes duplicated by hand, which must be changed together.
