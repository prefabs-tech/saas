/* eslint-disable prettier/prettier, brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";

import CustomerUserSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";

import type { Service } from "@dzangolab/fastify-slonik";
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

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.customerUsers.name;
  }
}

export default CustomerUserService;
