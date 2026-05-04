import type { ClientConfig } from "pg";

import * as pg from "pg";

const initializePgPool = async (databaseConfig: ClientConfig) => {
  const client = new pg.Client(databaseConfig);

  await client.connect();

  return client;
};

export default initializePgPool;
