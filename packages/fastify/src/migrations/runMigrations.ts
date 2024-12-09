import {
  createCustomerAddressesTableQuery,
  createCustomerUsersTableQuery,
  createCustomersTableQuery,
} from "./queries";

import type { Database } from "@dzangolab/fastify-slonik";

const runMigrations = async (database: Database) => {
  await database.connect(async (connection) => {
    await connection.transaction(async (transactionConnection) => {
      await transactionConnection.query(createCustomersTableQuery());
      await transactionConnection.query(createCustomerUsersTableQuery());
      await transactionConnection.query(createCustomerAddressesTableQuery());
    });
  });
};

export default runMigrations;
