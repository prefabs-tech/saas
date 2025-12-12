# @prefabs.tech/saas-fastify

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of saas.

## Requirements

* [@prefabs.tech/fastify-config](https://github.com/prefabs-tech/fastify/tree/main/packages/config)
* [@prefabs.tech/fastify-mailer](https://github.com/prefabs-tech/fastify/tree/main/packages/mailer)
* [@prefabs.tech/fastify-s3](https://github.com/prefabs-tech/fastify/tree/main/packages/s3)
* [@prefabs.tech/fastify-slonik](https://github.com/prefabs-tech/fastify/tree/main/packages/slonik)
* [@prefabs.tech/fastify-user](https://github.com/prefabs-tech/fastify/tree/main/packages/user)
* [slonik](https://github.com/spa5k/fastify-slonik)
* [supertokens-node](https://github.com/supertokens/supertokens-node)

## Installation

Install with npm:

```bash
npm install @prefabs.tech/fastify-config @prefabs.tech/fastify-mailer @prefabs.tech/fastify-s3 @prefabs.tech/fastify-slonik @prefabs.tech/fastify-user slonik supertokens-node @prefabs.tech/saas-fastify
```

Install with pnpm:

```bash
pnpm add --filter "<@scope/project>" @prefabs.tech/fastify-config @prefabs.tech/fastify-mailer @prefabs.tech/fastify-s3 @prefabs.tech/fastify-slonik @prefabs.tech/fastify-user slonik supertokens-node @prefabs.tech/saas-fastify
```

## Configuration

```typescript
import { supertokensRecipesConfig } from "@prefabs.tech/saas-fastify";

const config: ApiConfig = {
  ...
  saas: {
    rootDomain: process.env.APP_ROOT_DOMAIN as string,
    mainApp: {
      subdomain:  process.env.MAIN_APP_SUBDOMAIN as string || "app",
      domain: process.env.MAIN_APP_DOMAIN as string,
    },
    multiDatabase: {
      mode: "disabled", // "disabled", "optional", "required",
    },
    subdomains: "disabled" // "disabled", "optional", "required",
  },
  user: {
    ...
    supertokens: {
      recipes: supertokensRecipesConfig,
    }
  }
  ...
};
```

## Usage

Register the saas plugin with your Fastify instance:

```typescript
import saasPlugin, { accountMigrationPlugin } from "@prefabs.tech/saas-fastify";
import configPlugin from "@prefabs.tech/fastify-config";
import mailerPlugin from "@prefabs.tech/fastify-mailer";
import s3Plugin from "@prefabs.tech/fastify-s3";
import slonikPlugin, { migrationPlugin } from "@prefabs.tech/fastify-slonik";
import userPlugin from "@prefabs.tech/fastify-user";
import Fastify from "fastify";

import config from "./config";

import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { FastifyInstance } from "fastify";

const start = async () => {
  // Create fastify instance
  const fastify = Fastify({
    logger: config.logger,
  });

  // Register fastify-config plugin
  await fastify.register(configPlugin, { config });

  // Register database plugin
  await fastify.register(slonikPlugin, config.slonik);

  // Register mailer plugin
  await fastify.register(mailerPlugin, config.mailer);

  // Register mailer plugin
  await fastify.register(s3Plugin);

  // Register fastify-user plugin
  await fastify.register(userPlugin);

  // Register saas-fastify plugin
  await api.register(saasPlugin);

  // Run app database migrations
  await fastify.register(migrationPlugin, config.slonik);

  // Run accounts database migrations
  await api.register(accountMigrationPlugin);

  try {
    await fastify.listen({
      port: 3000,
      host: "0.0.0.0",
    });
  } catch (error) {
    fastify.log.error(error);
  }
};

start();
```

### Pre-Migration queries

When using multi-database mode, you can configure pre-migration queries that will be executed before the regular migrations for each account database. This is useful for setting up database-specific configurations, extensions, or schema modifications that need to run before migrations.

#### Configuration

Set the `preMigrationQueriesPath` in your SaaS configuration:

```typescript
const config: ApiConfig = {
  ...
  saas: {
    ...
    multiDatabase: {
      mode: "optional", // or "required"
      migrations: {
        path: "migrations/accounts",
        preMigrationQueriesPath: "migrations/pre-migration-queries.sql", // Path to your SQL file
      },
    },
  },
  ...
};
```

#### SQL file format

Create a SQL file (must have `.sql` extension) with queries separated by semicolons. Comments starting with `--` are automatically ignored:

```sql
-- Example pre-migration queries file

CREATE TYPE user_role AS ENUM ('admin', 'user', 'guest');
```

#### How it works

1. When account migrations run (via `accountMigrationPlugin`), the system checks if `preMigrationQueriesPath` is configured

**Note:** Pre-migration queries are executed for each account database individually, allowing you to set up account-specific database configurations.

### Skip account discovery for specific routes in main app

You can skip the account discovery process for specific routes in the main application in two ways:

#### Using a pattern in the SaaS configuration

Set a route pattern in your SaaS configuration file to exclude certain routes from account discovery:

```ts
saas: {
  excludeRoutePattern = ["/docs"]; // it also supports regex route patterns. For example: "/^\/auth\//"
```

Any route matching the specified pattern(s) will bypass the account discovery logic.

#### Route options

In the route definition, set the exclude flag under the saas key:

```ts
fastify.get(
  '/docs',
  {
    config: {
      saas: {
        exclude: true,
      },
    },
  },
  async (request, reply) => {
    return reply.status(200).send({ message: "Account not found" });
  },
);
```

### Cross-Domain requests (CORS) configuration

If you are running the frontend and backend on different domains or ports, make sure your backend CORS configuration allows the custom header `X-Account-Id`.

Update your CORS configuration to include it in the allowed headers list, for example:

```ts
await fastify.register(import('@fastify/cors'), {
  origin: ['http://localhost:50021'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Account-Id'  // 👈 Add this header
  ],
});
```
