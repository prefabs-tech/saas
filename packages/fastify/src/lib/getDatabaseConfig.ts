import type { SlonikOptions } from "@prefabs.tech/fastify-slonik";
import type { ClientConfig } from "pg";

const getDatabaseConfig = (slonikOptions: SlonikOptions): ClientConfig => {
  let clientConfig: ClientConfig = {
    database: slonikOptions.db.databaseName,
    host: slonikOptions.db.host,
    password: slonikOptions.db.password,
    port: slonikOptions.db.port,
    user: slonikOptions.db.username,
  };

  if (slonikOptions.clientConfiguration?.ssl) {
    clientConfig = {
      ...clientConfig,
      ssl: slonikOptions.clientConfiguration?.ssl,
    };
  }

  return clientConfig;
};

export default getDatabaseConfig;
