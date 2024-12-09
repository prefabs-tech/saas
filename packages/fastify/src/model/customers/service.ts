/* eslint-disable prettier/prettier, brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";

import CustomerSqlFactory from "./sqlFactory";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class CustomerService<
    Customer extends QueryResultRow,
    CustomerCreateInput extends QueryResultRow,
    CustomerUpdateInput extends QueryResultRow
  >
  extends BaseService<
    Customer,
    CustomerCreateInput,
    CustomerUpdateInput
  >
  implements
    Service<Customer, CustomerCreateInput, CustomerUpdateInput>
  {
  static readonly TABLE = "__customers";

  findByHostname = async (hostname: string): Promise<Customer | null> => {
    const query = this.factory.getFindByHostnameSql(
      hostname,
      this.config.saas?.subdomains?.rootDomain as string,
    );

    const customer = await this.database.connect(async (connection) => {
      return connection.maybeOne(query);
    });

    return customer;
  };

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new CustomerSqlFactory<
        Customer,
        CustomerCreateInput,
        CustomerUpdateInput
      >(this);
    }

    return this._factory as CustomerSqlFactory<
      Customer,
      CustomerCreateInput,
      CustomerUpdateInput
    >;
  }
}

export default CustomerService;
