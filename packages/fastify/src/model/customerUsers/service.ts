/* eslint-disable prettier/prettier, brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";

import CustomerUserSqlFactory from "./sqlFactory";

import type { FilterInput, Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class CustomerUserService<
    CustomerUser extends QueryResultRow,
    CustomerUserCreateInput extends QueryResultRow,
    CustomerUserUpdateInput extends QueryResultRow
  >
  extends BaseService<
    CustomerUser,
    CustomerUserCreateInput,
    CustomerUserUpdateInput
  >
  implements
    Service<CustomerUser, CustomerUserCreateInput, CustomerUserUpdateInput>
  {
  static readonly TABLE = "__customer_users";


  isOwner = async (customerId: number, userId: string) => {
    try {
      const filter: FilterInput = {
        AND: [
          { key: "userId", operator: "eq", value: userId },
          { key: "customerId", operator: "eq", value: customerId as unknown as string },
          { key: "roleId", operator: "eq", value: "SAAS_ACCOUNT_OWNER" },
        ],
      };
      const query = this.factory.getCountSql(filter);

      const result = await this.database.connect((connection) => {
        return connection.any(query);
      });

      if (result[0].count === 0) {
        return false;
      }

      return true;
    } catch (error) {
      throw new Error(
        `Failed to get customer users count: ${(error as Error).message}`
      );
    }
  };

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new CustomerUserSqlFactory<
        CustomerUser,
        CustomerUserCreateInput,
        CustomerUserUpdateInput
      >(this);
    }

    return this._factory as CustomerUserSqlFactory<
      CustomerUser,
      CustomerUserCreateInput,
      CustomerUserUpdateInput
    >;
  }
}

export default CustomerUserService;
