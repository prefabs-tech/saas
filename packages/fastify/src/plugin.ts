import FastifyPlugin from "fastify-plugin";
import merge from "lodash.merge";

import createSaasRoles from "./lib/createSaasRoles";
import runMigrations from "./migrations/runMigrations";
import customerDiscoveryPlugin from "./plugins/customerDiscoveryPlugin";
import recipes from "./supertokens/recipes";

import type { FastifyInstance } from "fastify";

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

    if (config.saas?.subdomains?.enabled) {
      const supertokensConfig = { recipes };

      // merge supertokens config
      config.user.supertokens = merge(
        supertokensConfig,
        config.user.supertokens,
      );

      // Register customer discovery plugin
      await fastify.register(customerDiscoveryPlugin);
    }

    done();
  },
);

export default plugin;
