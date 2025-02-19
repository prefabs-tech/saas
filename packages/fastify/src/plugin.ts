import FastifyPlugin from "fastify-plugin";

import createSaasRoles from "./lib/createSaasRoles";
import runMigrations from "./migrations/runMigrations";
import customerInvitationRoutes from "./model/customerInvitations/controller";
import customerRoutes from "./model/customers/controller";
import customerUserRoutes from "./model/customerUsers/controller";
import customerDiscoveryPlugin from "./plugins/customerDiscoveryPlugin";

import type { FastifyInstance } from "fastify";

const plugin = FastifyPlugin(async (fastify: FastifyInstance) => {
  const { config, log, slonik } = fastify;

  log.info("Registering saas-fastify plugin");

  fastify.addHook("onReady", async () => {
    await createSaasRoles();
  });

  await runMigrations(config, slonik);

  // Register customer discovery plugin
  await fastify.register(customerDiscoveryPlugin);

  const { routePrefix, routes } = config.saas;

  if (!routes?.customers?.disabled) {
    await fastify.register(customerRoutes, { prefix: routePrefix });
  }

  if (!routes?.customerInvitations?.disabled) {
    await fastify.register(customerInvitationRoutes, {
      prefix: routePrefix,
    });
  }

  if (!routes?.customerUsers?.disabled) {
    await fastify.register(customerUserRoutes, {
      prefix: routePrefix,
    });
  }
});

export default plugin;
