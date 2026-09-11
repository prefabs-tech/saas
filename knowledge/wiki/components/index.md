# Components

One concept per app, library, service, or tool in the project.

# Packages

- [@prefabs.tech/saas-fastify](saas-fastify.md) - The Fastify plugin that owns tenant accounts, account types, memberships and invitations — its routes, exports, configuration surface and extension seams.
- [@prefabs.tech/saas-react](saas-react.md) - React library of SaaS screens, route helpers, data hooks and account context that talks to saas-fastify — its exports, how an app wires it in, and its build and test setup.
- [@prefabs.tech/saas-vue](saas-vue.md) - Vue 3 plugin with SaaS views, Pinia stores, router helpers and account context for saas-fastify — how it is installed, what it exports, and how it differs from saas-react.
