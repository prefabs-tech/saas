import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  const handlersConfig = fastify.config.saas?.handlers?.accountType;

  fastify.get(
    "/account-types",
    {
      config: {
        saas: {
          exclude: true,
        },
      },
    },
    handlersConfig?.list || handlers.list,
  );

  fastify.get(
    "/account-types/all",
    {
      config: {
        saas: {
          exclude: true,
        },
      },
    },
    handlersConfig?.all || handlers.all,
  );

  fastify.get(
    String.raw`/account-types/:id(^\d+)`,
    {
      config: {
        saas: {
          exclude: true,
        },
      },
    },
    handlersConfig?.getById || handlers.getById,
  );

  fastify.post(
    "/account-types",
    {
      config: {
        saas: {
          exclude: true,
        },
      },
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.create || handlers.create,
  );

  fastify.put(
    String.raw`/account-types/:id(^\d+)`,
    {
      config: {
        saas: {
          exclude: true,
        },
      },
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.update || handlers.update,
  );

  fastify.delete(
    String.raw`/account-types/:id(^\d+)`,
    {
      config: {
        saas: {
          exclude: true,
        },
      },
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.remove || handlers.remove,
  );
};

export default plugin;
