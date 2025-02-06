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
      preHandler: [fastify.verifySession()],
    },
    handlers.list,
  );

  fastify.post(
    "/customers/:customerId/invitations",
    {
      preHandler: [fastify.verifySession()],
    },
    handlers.create,
  );

  done();
};

export default plugin;
