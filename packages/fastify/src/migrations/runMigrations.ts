import {
  createAccountAddressesTableQuery,
  createAccountInvitationsTableQuery,
  createAccountUsersTableQuery,
  createAccountsTableQuery,
  createAccountTypesTableQuery,
  createAccountTypesI18nTableQuery,
} from "./queries";
import getSaasConfig from "../config";

import type { ApiConfig } from "@prefabs.tech/fastify-config";
import type { Database } from "@prefabs.tech/fastify-slonik";

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
