import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  const handlersConfig = fastify.config.saas?.handlers?.accountInvitation;

  fastify.get(
    "/accounts/:accountId/invitations",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.getByAccountId || handlers.getByAccountId,
  );

  fastify.post(
    "/accounts/:accountId/invitations",
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.create || handlers.create,
  );

  fastify.post(
    String.raw`/accounts/:accountId/invitations/:id(^\d+)/resend`,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.resend || handlers.resend,
  );

  fastify.post(
    String.raw`/accounts/:accountId/invitations/:id(^\d+)/revoke`,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.revoke || handlers.revoke,
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
    handlersConfig?.getByToken || handlers.getByToken,
  );

  fastify.delete(
    String.raw`/accounts/:accountId/invitations/:id(^\d+)`,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.remove || handlers.remove,
  );

  fastify.post(
    String.raw`/accounts/:accountId/invitations/join/:token`,
    {
      config: {
        saas: {
          exclude: true,
        },
      },
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.join || handlers.join,
  );

  fastify.post(
    String.raw`/accounts/:accountId/invitations/token/:token`,
    {
      config: {
        saas: {
          exclude: true,
        },
      },
    },
    handlersConfig?.signup || handlers.signup,
  );
};

export default plugin;
