import FastifyPlugin from "fastify-plugin";
import merge from "lodash.merge";

import createSaasRoles from "./lib/createSaasRoles";
import runMigrations from "./migrations/runMigrations";
import customerDiscoveryPlugin from "./plugins/customerDiscoveryPlugin";
import recipes from "./supertokens/recipes";

import type { FastifyInstance, FastifyRequest } from "fastify";

const plugin = FastifyPlugin(
  async (
    fastify: FastifyInstance,
    options: Record<never, never>,
    done: () => void,
  ) => {
    const { config, log, slonik } = fastify;

    log.info("Registering saas-fastify plugin");

    fastify.addHook("onReady", async () => {
      await createSaasRoles();
    });

    await runMigrations(slonik);

    // Register customer discovery plugin
    await fastify.register(customerDiscoveryPlugin);

    const supertokensConfig = { recipes };

    // merge supertokens config
    config.user.supertokens = merge(supertokensConfig, config.user.supertokens);

    fastify.addHook("preHandler", async (request: FastifyRequest) => {
      // FIXME - authEmailPrefix should be set based on subdomains, multi database and sso config
      const { customer } = request;
      request.authEmailPrefix = "";

      if (customer && customer.slug && customer.database) {
        request.authEmailPrefix = `${customer.id}_`;
      }
    });

    done();
  },
);

export default plugin;
