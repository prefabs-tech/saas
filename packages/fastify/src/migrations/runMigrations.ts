import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { Database } from "@prefabs.tech/fastify-slonik";

import getSaasConfig from "../config";
import {
  createAccountAddressesTableQuery,
  createAccountInvitationsTableQuery,
  createAccountsTableQuery,
  createAccountTypesI18nTableQuery,
  createAccountTypesTableQuery,
  createAccountUsersTableQuery,
} from "./queries";

const runMigrations = async (config: ApiConfig, database: Database) => {
  const saasConfig = getSaasConfig(config);
  await database.connect(async (connection) => {
    await connection.transaction(async (transactionConnection) => {
      await transactionConnection.query(
        createAccountTypesTableQuery(saasConfig),
      );
      await transactionConnection.query(
        createAccountTypesI18nTableQuery(saasConfig),
      );
      await transactionConnection.query(createAccountsTableQuery(saasConfig));
      await transactionConnection.query(
        createAccountUsersTableQuery(saasConfig),
      );
      await transactionConnection.query(
        createAccountAddressesTableQuery(saasConfig),
      );
      await transactionConnection.query(
        createAccountInvitationsTableQuery(saasConfig),
      );
    });
  });
};

export default runMigrations;
