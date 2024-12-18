import FastifyPlugin from "fastify-plugin";

import {
  discoverCustomerByHostname,
  discoverCustomerByHttpHeader,
} from "../lib/discoverCustomer";
import getHost from "../lib/getHost";
import getSubdomainsConfig from "../lib/getSubdomainsConfig";

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void,
) => {
  fastify.addHook(
    "preHandler",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { config, headers, slonik: database } = request;

      const url = headers.referer || headers.origin || request.hostname;
      const subdomainsConfig = getSubdomainsConfig(config);
      let customer;

      try {
        if (subdomainsConfig.enabled) {
          customer = await discoverCustomerByHostname(
            config,
            database,
            getHost(url),
          );
        }

        if (!subdomainsConfig.required) {
          customer = await discoverCustomerByHttpHeader(
            config,
            database,
            headers,
          );
        }

        if (customer) {
          request.customer = customer;

          if (subdomainsConfig.multiDatabase) {
            request.dbSchema = customer.slug;
          }
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
