# @12deg/saas-fastify

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of saas.

## Requirements

* [@dzangolab/fastify-config](https://github.com/dzangolab/fastify/tree/main/packages/config)
* [@dzangolab/fastify-mailer](https://github.com/dzangolab/fastify/tree/main/packages/mailer)
* [@dzangolab/fastify-slonik](https://github.com/dzangolab/fastify/tree/main/packages/slonik)
* [@dzangolab/fastify-user](https://github.com/dzangolab/fastify/tree/main/packages/user)
* [slonik](https://github.com/spa5k/fastify-slonik)
* [supertokens-node](https://github.com/supertokens/supertokens-node)

## Installation

Install with npm:

```bash
npm install @dzangolab/fastify-config @dzangolab/fastify-mailer @dzangolab/fastify-slonik @dzangolab/fastify-user slonik supertokens-node @12deg/saas-fastify
```

Install with pnpm:

```bash
pnpm add --filter "@scope/project" @dzangolab/fastify-config @dzangolab/fastify-mailer @dzangolab/fastify-slonik @dzangolab/fastify-user slonik supertokens-node @12deg/saas-fastify
```

## Configuration

```typescript
import { SupertokensRecipesConfig } from "@12deg/saas-fastify";

const config: ApiConfig = {
  ...
  saas: {
    rootDomain: process.env.APP_ROOT_DOMAIN as string,
    mainAppSubdomain:  process.env.MAIN_APP_SUBDOMAIN as string || "app",
    subdomains: "optional" // "disabled", "optional", "required",
  },
  user: {
    ...
    supertokens: {
      recipes: SupertokensRecipesConfig,  
    }
  } 
  ...
};
```

## Usage

Register the saas plugin with your Fastify instance:

```typescript
import saasPlugin, { customerMigrationPlugin } from "@12deg/saas-fastify";
import configPlugin from "@dzangolab/fastify-config";
import mailerPlugin from "@dzangolab/fastify-mailer";
import slonikPlugin, { migrationPlugin } from "@dzangolab/fastify-slonik";
import userPlugin from "@dzangolab/fastify-user";
import Fastify from "fastify";

import config from "./config";

import type { ApiConfig } from "@dzangolab/fastify-config";
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

  // Register fastify-user plugin
  await fastify.register(userPlugin);

  // Register saas-fastify plugin
  await api.register(saasPlugin);

  // Run app database migrations
  await fastify.register(migrationPlugin, config.slonik);

  // Run customers database migrations
  await api.register(customerMigrationPlugin);

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
