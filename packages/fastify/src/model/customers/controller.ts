import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void
) => {
  const handlersConfig = fastify.config.saas?.handlers?.customer;

  fastify.get(
    "/customers",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.list || handlers.list
  );

  fastify.get(
    "/customers/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.getById || handlers.getById
  );

  fastify.delete(
    "/customers/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.delete || handlers.delete
  );

  fastify.post(
    "/customers",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.create || handlers.create
  );

  fastify.put(
    "/customers/:id(^\\d+)",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.update || handlers.update
  );

  done();
};

export default plugin;
