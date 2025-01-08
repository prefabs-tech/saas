import { existsSync } from "node:fs";

import FastifyPlugin from "fastify-plugin";

import getSaasConfig from "../config";
import changeSchema from "../lib/changeSchema";
import getDatabaseConfig from "../lib/getDatabaseConfig";
import initializePgPool from "../lib/initializePgPool";
import runMigrations from "../lib/runMigrations";
import Service from "../model/customers/service";

import type { Customer } from "../types";
import type { FastifyInstance } from "fastify";

const plugin = async (
  fastify: FastifyInstance,
  options: Record<string, never>,
  done: () => void,
) => {
  try {
    const { config, slonik } = fastify;

    const saasConfig = getSaasConfig(config);

    const migrationsPath = saasConfig.multiDatabase.migrations.path;

    if (existsSync(migrationsPath)) {
      const databaseConfig = getDatabaseConfig(config.slonik);

      const customerService = new Service(config, slonik);

      const customers = await customerService.all(["name", "database"]);

      const client = await initializePgPool(databaseConfig);

      for (const customer of customers) {
        if (!customer || !customer.database) {
          continue;
        }

        /* eslint-disable-next-line unicorn/consistent-destructuring */
        fastify.log.info(`Running migrations for customer ${customer.name}`);

        await runMigrations(
          { client },
          migrationsPath,
          customer as unknown as Customer,
        );
      }

      await changeSchema(client, "public");

      await client.end();
    } else {
      /* eslint-disable-next-line unicorn/consistent-destructuring */
      fastify.log.warn(
        `Customer migrations path '${migrationsPath}' does not exists.`,
      );
    }
  } catch (error: unknown) {
    /* eslint-disable-next-line unicorn/consistent-destructuring */
    fastify.log.error("🔴 SaaS: Failed to run customer migrations");
    throw error;
  }

  done();
};

export default FastifyPlugin(plugin);
