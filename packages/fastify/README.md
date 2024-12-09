# @12deg/saas-fastify

A [Fastify](https://github.com/fastify/fastify) plugin that provides an easy integration of saas.

## Installation

Install with npm:

```bash
npm install @12deg/saas-fastify
```

Install with pnpm:

```bash
pnpm add --filter "@scope/project" @12deg/saas-fastify
```

## Usage
Register the plugin with your fastify instance in `src/index.ts`:

```typescript
import plugin from "@12deg/saas-fastify";
import Fastify from "fastify";

const start = async () => {
  const fastify = await Fastify();

  // Register saas-fastify plugin
  await fastify.register(plugin);

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
