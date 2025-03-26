import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  const handlersConfig = fastify.config.saas?.handlers?.accountUser;

  fastify.get(
    String.raw`/accounts/:accountId(^[0-9a-fa-f-]{36}$)/users`,
    {
      preHandler: fastify.verifySession(),
    },
    handlersConfig?.getByAccountId || handlers.getByAccountId,
  );
};

export default plugin;
