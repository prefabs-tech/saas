import {
  createCustomerAddressesTableQuery,
  createCustomerInvitationsTableQuery,
  createCustomerUsersTableQuery,
  createCustomersTableQuery,
} from "./queries";
import getSaasConfig from "../config";

import type { ApiConfig } from "@dzangolab/fastify-config";
import type { Database } from "@dzangolab/fastify-slonik";

const runMigrations = async (config: ApiConfig, database: Database) => {
  const saasConfig = getSaasConfig(config);
  await database.connect(async (connection) => {
    await connection.transaction(async (transactionConnection) => {
      await transactionConnection.query(createCustomersTableQuery(saasConfig));
      await transactionConnection.query(
        createCustomerUsersTableQuery(saasConfig),
      );
      await transactionConnection.query(
        createCustomerAddressesTableQuery(saasConfig),
      );
      await transactionConnection.query(
        createCustomerInvitationsTableQuery(saasConfig),
      );
    });
  });
};

export default runMigrations;
