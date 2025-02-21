import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  fastify.get(
    String.raw`/accounts/:accountId(^[0-9a-fa-f-]{36}$)/users`,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.getByAccountId,
  );
};

export default plugin;
