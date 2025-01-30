/* eslint-disable brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";
import { customAlphabet } from "nanoid";

import CustomerSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";
import { NANOID_ALPHABET, NANOID_SIZE } from "../../constants";
import { validateCustomerInput } from "../../lib/validateCustomerSchema";
import runCustomerMigrations from "../../migrations/runCustomerMigrations";

import type {
  Customer as BaseCustomer,
  CustomerCreateInput as BaseCustomerCreateInput,
} from "../../types";
import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class CustomerService<
    Customer extends QueryResultRow,
    CustomerCreateInput extends QueryResultRow,
    CustomerUpdateInput extends QueryResultRow,
  >
  extends BaseService<Customer, CustomerCreateInput, CustomerUpdateInput>
  implements Service<Customer, CustomerCreateInput, CustomerUpdateInput>
{
  create = async (data: CustomerCreateInput): Promise<Customer | undefined> => {
    if (this.saasConfig.subdomains === "disabled" || data.slug === "") {
      delete data.slug;
      delete data.domain;
    }

    if (this.saasConfig.subdomains === "disabled" || data.domain === "") {
      delete data.domain;
    }

    if (
      this.saasConfig.subdomains !== "disabled" &&
      this.saasConfig.multiDatabase?.enabled &&
      data.slug &&
      data.useSeparateDatabase
    ) {
      const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_SIZE);
      // [RL 2024-01-08] Added `s_` prefix to indicate that the database is a schema
      (data as BaseCustomerCreateInput).database = `s_${nanoid()}`;
    }

    delete data.useSeparateDatabase;

    validateCustomerInput(this.config, data);

    if (data.slug) {
      await this.validateSlugOrDomain(
        data.slug as string,
        data.domain as string,
      );
    }

    const query = this.factory.getCreateSql(data);

    const result = (await this.database.connect(async (connection) => {
      return connection.query(query).then((data) => {
        return data.rows[0];
      });
    })) as Customer;

    return result ? this.postCreate(result) : undefined;
  };

  findByHostname = async (hostname: string): Promise<Customer | null> => {
    const saasConfig = getSaasConfig(this.config);

    const query = this.factory.getFindByHostnameSql(
      hostname,
      saasConfig.rootDomain as string,
    );

    const customer = await this.database.connect(async (connection) => {
      return connection.maybeOne(query);
    });

    return customer;
  };

  findByUserId = async (userId: string): Promise<Customer | null> => {
    const query = this.factory.getFindByUserIdSql(userId);

    const customer = await this.database.connect(async (connection) => {
      return connection.maybeOne(query);
    });

    return customer;
  };

  validateSlugOrDomain = async (slug: string, domain?: string) => {
    const query = this.factory.getFindBySlugOrDomainSql(slug, domain);

    const customers = await this.database.connect(async (connection) => {
      return connection.any(query);
    });

    if (customers.length > 0) {
      if (customers.some((customer) => customer.slug === slug)) {
        throw {
          name: "ERROR_SLUG_ALREADY_EXISTS",
          message: `The specified slug "${slug}" already exists`,
          statusCode: 422,
        };
      }

      throw {
        name: "ERROR_DOMAIN_ALREADY_EXISTS",
        message: `The specified domain "${domain}" already exists`,
        statusCode: 422,
      };
    }
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

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.customers.name;
  }

  protected postCreate = async (customer: Customer): Promise<Customer> => {
    if (
      this.saasConfig.subdomains === "disabled" ||
      !this.saasConfig.multiDatabase?.enabled
    ) {
      return customer;
    }

    await runCustomerMigrations(
      this.config,
      customer as unknown as BaseCustomer,
    );

    return customer;
  };
}

export default CustomerService;
