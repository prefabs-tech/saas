import FastifyPlugin from "fastify-plugin";

import getSaasConfig from "../config";
import { ACCOUNT_HEADER_NAME } from "../constants";
import discoverAccount from "../lib/discoverAccount";
import getHost from "../lib/getHost";

import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  fastify.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { config, headers, log, routeOptions, slonik: database } = request;

      const hostname = getHost(
        headers.referer || headers.origin || request.hostname,
      );
      const accountId = headers[ACCOUNT_HEADER_NAME] as string;
      const saasConfig = getSaasConfig(config);

      // skip account discovery if request is for other apps
      for (const app of saasConfig.apps) {
        const appDomains: string[] = [
          ...(app.domains || []),
          ...(Array.isArray(app.subdomains)
            ? app.subdomains.map(
                (subdomain) => `${subdomain}.${saasConfig.rootDomain}`,
              )
            : []),
        ];

        if (appDomains?.includes(hostname)) {
          log.info(` Incoming request for ${app.name} app`);

          return;
        }
      }

      const regexPatterns = saasConfig.excludeRoutePatterns.map((pattern) =>
        pattern instanceof RegExp ? pattern : new RegExp(`^${pattern}`),
      );

      const isRouteExcludedFromDiscovery = regexPatterns.some(
        (regex) => regex.test(request.url) || routeOptions.config.saas?.exclude,
      );

      try {
        const account = await discoverAccount(
          config,
          database,
          hostname,
          accountId,
          isRouteExcludedFromDiscovery,
        );

        if (account) {
          // set account on request object
          request.account = account;

          // set db schema for multi-database on request object
          if (account.database) {
            request.dbSchema = account.database;
          }

          // set auth email prefix for user isolation on request object
          if (account.slug) {
            request.authEmailPrefix = `${account.id}_`;
          }
        }
      } catch (error) {
        fastify.log.error(error);

        return reply
          .status(404)
          .send({ error: { message: "Account not found" } });
      }
    },
  );
};

export default FastifyPlugin(plugin);
