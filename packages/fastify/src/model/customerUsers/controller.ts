import handlers from "./handlers";

import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: unknown,
  done: () => void,
) => {
  fastify.get(
    String.raw`/customers/:customerId(^[0-9a-fa-f-]{36}$)/users`,
    {
      preHandler: fastify.verifySession(),
    },
    handlers.getByCustomerId,
  );

  done();
};

export default plugin;
