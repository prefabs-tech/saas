import FastifyPlugin from "fastify-plugin";

import discoverCustomer from "../lib/discoverCustomer";
import getHost from "../lib/getHost";

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void,
) => {
  fastify.addHook(
    "preHandler",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const url =
        request.headers.referer || request.headers.origin || request.hostname;

      const { config, slonik: database } = request;

      try {
        const customer = await discoverCustomer(config, database, getHost(url));

        if (customer) {
          request.customer = customer;

          request.dbSchema = customer.slug;
        }
      } catch (error) {
        fastify.log.error(error);

        return reply
          .status(404)
          .send({ error: { message: "Customer not found" } });
      }
    },
  );

  done();
};

export default FastifyPlugin(plugin);
