import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void,
) => {
  const handlersConfig = fastify.config.saas?.handlers?.customer;

  fastify.get(
    "/customers",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.list || handlers.list,
  );

  fastify.get(
    String.raw`/customers/:id(^[0-9a-fa-f-]{36}$)`,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.getById || handlers.getById,
  );

  fastify.delete(
    String.raw`/customers/:id(^[0-9a-fa-f-]{36}$)`,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.delete || handlers.delete,
  );

  fastify.post(
    "/customers",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.create || handlers.create,
  );

  fastify.put(
    String.raw`/customers/:id(^[0-9a-fa-f-]{36}$)`,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.update || handlers.update,
  );

  fastify.get(
    "/my-accounts",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.myAccounts,
  );

  done();
};

export default plugin;
