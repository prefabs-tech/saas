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

### Skip account discovery for specific routes in main app

You can skip the account discovery process for specific routes in the main application in two ways:

#### Using a pattern in the SaaS configuration

Set a route pattern in your SaaS configuration file to exclude certain routes from account discovery:

```ts
saas: {
  excludeRoutePattern = ["/docs"]; // it also supports regex route patterns. For example: "/^\/auth\//"
```

Any route matching the specified pattern(s) will bypass the account discovery logic.

#### Route Options

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
    return reply.status(200).send({message: "Account not found"})
  }
  );
```


### Cross-Domain Requests (CORS) Configuration

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
