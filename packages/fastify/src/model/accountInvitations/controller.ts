import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  fastify.get(
    "/accounts/:accountId/invitations",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.getByAccountId,
  );

  fastify.post(
    "/accounts/:accountId/invitations",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.create,
  );

  fastify.post(
    String.raw`/accounts/:accountId/invitations/:id(^\d+)/resend`,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.resend,
  );

  fastify.post(
    String.raw`/accounts/:accountId/invitations/:id(^\d+)/revoke`,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.revoke,
  );

  fastify.get(
    String.raw`/accounts/:accountId/invitations/token/:token`,
    {
      config: {
        saas: {
          exclude: true,
        },
      },
    },
    handlers.getByToken,
  );

  fastify.delete(
    String.raw`/accounts/:accountId/invitations/:id(^\d+)`,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.remove,
  );

  fastify.post(
    String.raw`/accounts/:accountId/invitations/token/:token`,
    {
      config: {
        saas: {
          exclude: true,
        },
      },
      preHandler: fastify.verifySession({ sessionRequired: false }),
    },
    handlers.accept,
  );
};

export default plugin;
