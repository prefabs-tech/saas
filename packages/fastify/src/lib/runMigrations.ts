import { existsSync } from "node:fs";

import { migrate } from "@dzangolab/postgres-migrations";
import * as pg from "pg";

import changeSchema from "./changeSchema";
import initializePgPool from "./initializePgPool";

import type { Customer } from "../types";
import type { ClientConfig } from "pg";

const runMigrations = async (
  migrateConfig:
    | ClientConfig
    | {
        readonly client: pg.Client | pg.PoolClient | pg.Pool;
      },
  migrationsPath: string,
  customer: Customer,
) => {
  if (!customer.slug || !existsSync(migrationsPath)) {
    return false;
  }

  const client =
    "client" in migrateConfig
      ? (migrateConfig.client as pg.Client)
      : await initializePgPool(migrateConfig);

  await changeSchema(client, customer.slug);

  await migrate({ client }, migrationsPath);

  if (!("client" in migrateConfig)) {
    await client.end();
  }

  return true;
};

export default runMigrations;
