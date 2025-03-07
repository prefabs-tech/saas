import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  fastify.get(
    "/account-types",
    {
      config: {
        saas: {
          exclude: true,
        },
      },
    },
    handlers.list,
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
    handlers.all,
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
    handlers.getById,
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
    handlers.create,
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
    handlers.update,
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
    handlers.remove,
  );
};

export default plugin;
