import { existsSync } from "node:fs";

import FastifyPlugin from "fastify-plugin";

import getSaasConfig from "../config";
import changeSchema from "../lib/changeSchema";
import getDatabaseConfig from "../lib/getDatabaseConfig";
import initializePgPool from "../lib/initializePgPool";
import runAccountMigrations from "../migrations/runAccountMigrations";
import Service from "../model/accounts/service";

import type { Account } from "../types";
import type { FastifyInstance } from "fastify";

const plugin = async (fastify: FastifyInstance) => {
  try {
    const { config, slonik } = fastify;

    const saasConfig = getSaasConfig(config);

    const migrationsPath = saasConfig.multiDatabase.migrations.path;

    if (existsSync(migrationsPath)) {
      const databaseConfig = getDatabaseConfig(config.slonik);

      const accountService = new Service(config, slonik);

      const accounts = await accountService.all(["name", "database"]);

      const client = await initializePgPool(databaseConfig);

      for (const account of accounts) {
        if (!account || !account.database) {
          continue;
        }

        /* eslint-disable-next-line unicorn/consistent-destructuring */
        fastify.log.info(`Running migrations for account ${account.name}`);

        await runAccountMigrations(
          config,
          account as unknown as Account,
          client,
        );
      }

      await changeSchema(client, "public");

      await client.end();
    } else {
      /* eslint-disable-next-line unicorn/consistent-destructuring */
      fastify.log.warn(
        `Account migrations path '${migrationsPath}' does not exists.`,
      );
    }
  } catch (error: unknown) {
    /* eslint-disable-next-line unicorn/consistent-destructuring */
    fastify.log.error("🔴 SaaS: Failed to run account migrations");
    throw error;
  }
};

export default FastifyPlugin(plugin);
