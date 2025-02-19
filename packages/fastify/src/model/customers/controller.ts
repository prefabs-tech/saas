import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
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

  fastify.put(
    String.raw`/customers/:id(^[0-9a-fa-f-]{36}$)/users`,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.update || handlers.update,
  );

  fastify.get(
    "/my-accounts",
    {
      config: {
        saas: {
          exclude: true,
        },
      },
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.myAccounts || handlers.myAccounts,
  );

  fastify.get(
    "/my-account",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.myAccount || handlers.myAccount,
  );

  fastify.put(
    "/my-account",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.updateMyAccount || handlers.updateMyAccount,
  );
};

export default plugin;
