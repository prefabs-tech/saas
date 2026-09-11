# Conventions

Patterns this repository expects you to follow. When a convention is enforced by tooling, that is noted.

# Enforced

- [Enforced tooling and hooks](enforced-tooling.md) - The rules that tooling actually enforces on contributions — conventional commits, the pre-commit lint/typecheck/test gate, shared ESLint/Stylelint/tsconfig presets — and which of them CI does not re-check.

# Observed

- [Model module layout and handler conventions](model-module-layout.md) - The observed (not tool-enforced) shape every saas-fastify model follows — controller, per-file handlers, service, SQL factory — plus the handler error shape the frontends depend on, and how to add a new model or frontend hook.
