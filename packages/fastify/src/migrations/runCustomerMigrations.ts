import { existsSync } from "node:fs";

import { ApiConfig } from "@dzangolab/fastify-config";
import { migrate } from "@dzangolab/postgres-migrations";
import * as pg from "pg";

import { createCustomerUsersTableQuery } from "./queries";
import getSaasConfig from "../config";
import changeSchema from "../lib/changeSchema";
import getDatabaseConfig from "../lib/getDatabaseConfig";
import initializePgPool from "../lib/initializePgPool";

import type { Customer } from "../types";

const runCustomerMigrations = async (
  config: ApiConfig,
  customer: Customer,
  client?: pg.Client | pg.PoolClient,
) => {
  const saasConfig = getSaasConfig(config);
  const migrationsPath = saasConfig.multiDatabase.migrations.path;

  if (!customer.database) {
    return false;
  }

  let _client: pg.Client | undefined;

  try {
    if (!client) {
      const databaseConfig = getDatabaseConfig(config.slonik);
      _client = await initializePgPool(databaseConfig);
      client = _client;
    }

    // Switch to the correct schema
    await changeSchema(client, customer.database);

    // list of migrations that needs to be run from the package
    // for the customers who uses separate database.
    const queries = [createCustomerUsersTableQuery(saasConfig)];

    for (const query of queries) {
      await client.query({
        text: query.sql, // Raw SQL string
        values: query.values.length > 0 ? [...query.values] : undefined, // Spread to ensure it's mutable
      });
    }

    // Check if the migrations path exists
    if (existsSync(migrationsPath)) {
      await migrate({ client }, migrationsPath);
    }

    return true;
  } catch (error) {
    console.error("Error running customer migrations:", error);
    return false;
  } finally {
    // Ensure client is properly closed if it was created locally
    if (_client) {
      await _client.end();
    }
  }
};

export default runCustomerMigrations;
