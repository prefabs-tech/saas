import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void,
) => {
  fastify.get(
    "/customers/:customerId/invitations",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.list,
  );

  fastify.post(
    "/customers/:customerId/invitations",
    {
      preHandler: fastify.verifySession(),
    },
    handlers.create,
  );

  fastify.post(
    String.raw`/customers/:customerId/invitations/:id(^\d+)/resend`,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.resend,
  );

  fastify.post(
    String.raw`/customers/:customerId/invitations/:id(^\d+)/revoke`,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.revoke,
  );

  fastify.get(
    String.raw`/customers/:customerId/invitations/token/:token`,
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
    String.raw`/customers/:customerId/invitations/:id(^\d+)`,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.remove,
  );

  fastify.post(
    String.raw`/customers/:customerId/invitations/token/:token`,
    {
      config: {
        saas: {
          exclude: true,
        },
      },
    },
    handlers.accept,
  );

  done();
};

export default plugin;
