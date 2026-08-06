import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import FastifyPlugin from "fastify-plugin";

import getSaasConfig from "../config";
import { ACCOUNT_HEADER_NAME } from "../constants";
import AccountNotFoundError from "../lib/accountNotFoundError";
import discoverAccount from "../lib/discoverAccount";
import getHost from "../lib/getHost";

const plugin = async (fastify: FastifyInstance) => {
  fastify.addHook(
    "onRequest",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { config, headers, log, routeOptions, slonik: database } = request;

      const hostname = getHost(
        headers.referer || headers.origin || headers.host || request.hostname,
      );
      const accountId = headers[ACCOUNT_HEADER_NAME] as string;
      const saasConfig = getSaasConfig(config);

      // skip account discovery if request is for other apps
      for (const app of saasConfig.apps) {
        if (app.domain === hostname) {
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
        // Expected not-found (e.g. unknown subdomain): return 404 without error logging.
        if (error instanceof AccountNotFoundError) {
          log.debug({ hostname }, "Account discovery: no account found");

          return reply
            .status(404)
            .send({ error: { message: "Account not found" } });
        }

        // Rethrow unexpected system failures to let the central error handler report them as 500s.
        throw error;
      }
    },
  );
};

export default FastifyPlugin(plugin);
