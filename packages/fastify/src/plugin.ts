import FastifyPlugin from "fastify-plugin";

import createSaasRoles from "./lib/createSaasRoles";
import runMigrations from "./migrations/runMigrations";
import accountInvitationRoutes from "./model/accountInvitations/controller";
import accountRoutes from "./model/accounts/controller";
import accountTypeRoutes from "./model/accountTypes/controller";
import accountUserRoutes from "./model/accountUsers/controller";
import accountDiscoveryPlugin from "./plugins/accountDiscoveryPlugin";

import type { FastifyInstance } from "fastify";

const plugin = FastifyPlugin(async (fastify: FastifyInstance) => {
  const { config, log, slonik } = fastify;

  log.info("Registering saas-fastify plugin");

  fastify.addHook("onReady", async () => {
    await createSaasRoles();
  });

  await runMigrations(config, slonik);

  // Register account discovery plugin
  await fastify.register(accountDiscoveryPlugin);

  const { routePrefix, routes } = config.saas;

  if (!routes?.accounts?.disabled) {
    await fastify.register(accountRoutes, { prefix: routePrefix });
  }

  if (!routes?.accountInvitations?.disabled) {
    await fastify.register(accountInvitationRoutes, {
      prefix: routePrefix,
    });
  }

  if (!routes?.accountUsers?.disabled) {
    await fastify.register(accountUserRoutes, {
      prefix: routePrefix,
    });
  }

  if (!routes?.accountTypes?.disabled) {
    await fastify.register(accountTypeRoutes, {
      prefix: routePrefix,
    });
  }
});

export default plugin;
