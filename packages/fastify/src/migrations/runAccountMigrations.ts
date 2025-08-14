import { existsSync } from "node:fs";

import { ApiConfig } from "@prefabs.tech/fastify-config";
import { createUsersTableQuery } from "@prefabs.tech/fastify-user";
import { migrate } from "@prefabs.tech/postgres-migrations";
import * as pg from "pg";

import {
  createAccountInvitationsTableQuery,
  createAccountUsersTableQuery,
  createFilesTableQuery,
} from "./queries";
import getSaasConfig from "../config";
import changeSchema from "../lib/changeSchema";
import getDatabaseConfig from "../lib/getDatabaseConfig";
import initializePgPool from "../lib/initializePgPool";

import type { Account } from "../types";

const runAccountMigrations = async (
  config: ApiConfig,
  account: Account,
  client?: pg.Client | pg.PoolClient,
) => {
  const saasConfig = getSaasConfig(config);
  const migrationsPath = saasConfig.multiDatabase.migrations.path;

  if (!account.database) {
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
    await changeSchema(client, account.database);

    // list of migrations that needs to be run from the package
    // for the accounts who uses separate database.
    const queries = [
      createFilesTableQuery(),
      createUsersTableQuery(config),
      createAccountUsersTableQuery(saasConfig),
      createAccountInvitationsTableQuery(saasConfig),
    ];

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
    console.error("Error running account migrations:", error);
    return false;
  } finally {
    // Ensure client is properly closed if it was created locally
    if (_client) {
      await _client.end();
    }
  }
};

export default runAccountMigrations;
