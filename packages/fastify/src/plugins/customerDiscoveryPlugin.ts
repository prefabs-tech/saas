import FastifyPlugin from "fastify-plugin";

import { CUSTOMER_HEADER_NAME } from "../constants";
import discoverCustomer from "../lib/discoverCustomer";
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
      const { config, headers, routeConfig, slonik: database } = request;

      const hostname = getHost(
        headers.referer || headers.origin || request.hostname,
      );
      const customerId = headers[CUSTOMER_HEADER_NAME] as string;

      const subdomainsConfig = getSubdomainsConfig(config);

      const excludeRoutePatterns = config.saas?.excludeRoutePatterns ?? [
        /^\/auth\//,
      ];

      const regexPatterns = excludeRoutePatterns.map((pattern) =>
        pattern instanceof RegExp ? pattern : new RegExp(`^${pattern}`),
      );

      const isRouteExcludedFromDiscovery = regexPatterns.some(
        (regex) => regex.test(request.url) || routeConfig.saas?.exclude,
      );

      try {
        const customer = await discoverCustomer(
          config,
          database,
          hostname,
          customerId,
          isRouteExcludedFromDiscovery,
        );

        if (customer) {
          request.customer = customer;

          if (subdomainsConfig.multiDatabase && customer.slug) {
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
