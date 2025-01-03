import FastifyPlugin from "fastify-plugin";

import getSaasConfig from "../config";
import { CUSTOMER_HEADER_NAME } from "../constants";
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
      const { config, headers, log, routeConfig, slonik: database } = request;

      const hostname = getHost(
        headers.referer || headers.origin || request.hostname,
      );
      const customerId = headers[CUSTOMER_HEADER_NAME] as string;
      const saasConfig = getSaasConfig(config);

      // skip customer discovery if request is for other apps
      for (const app of saasConfig.apps) {
        if (`${app.subdomain}.${saasConfig.rootDomain}` === hostname) {
          log.info(` Incoming request for ${app.name} app`);

          return;
        }
      }

      const regexPatterns = saasConfig.excludeRoutePatterns.map((pattern) =>
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

          if (customer.slug) {
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
