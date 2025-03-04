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
    handlers.all,
  );

  fastify.get(
    String.raw`/account-types/:id`,
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
    String.raw`/account-types/:id`,
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
    String.raw`/account-types/:id`,
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
