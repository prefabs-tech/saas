/* eslint-disable brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";
import { customAlphabet } from "nanoid";

import CustomerSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";
import getDatabaseConfig from "../../lib/getDatabaseConfig";
import getInvalidDomains from "../../lib/getInvalidDomains";
import getInvalidSlugs from "../../lib/getInvalidSlugs";
import runMigrations from "../../lib/runMigrations";
import { validateCustomerInput } from "../../lib/validateCustomerSchema";

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
  static readonly TABLE = "__customers";

  create = async (data: CustomerCreateInput): Promise<Customer | undefined> => {
    // This handles the empty string issue.
    if (data.slug === "") {
      delete data.slug;
    }

    if (data.domain === "") {
      delete data.domain;
    }

    const saasConfig = getSaasConfig(this.config);

    if (
      saasConfig.subdomains !== "disabled" &&
      saasConfig.multiDatabase?.enabled &&
      data.slug &&
      data.useSeparateDatabase
    ) {
      const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);
      // [RL 2024-01-08] Added `s_` prefix to indicate that the database is a schema
      (data as BaseCustomerCreateInput).database = `s_${nanoid()}`;
    }

    validateCustomerInput(data);

    if (getInvalidSlugs(this.config).includes(data.slug as string)) {
      throw {
        name: "ERROR_RESERVED_SLUG",
        message: `The requested slug "${data.slug}" is reserved and cannot be used`,
        statusCode: 422,
      };
    }

    if (getInvalidDomains(this.config).includes(data.domain as string)) {
      throw {
        name: "ERROR_RESERVED_DOMAIN",
        message: `The requested domain "${data.domain}" is reserved and cannot be used`,
        statusCode: 422,
      };
    }

    await this.validateSlugOrDomain(data.slug as string, data.domain as string);

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

  validateSlugOrDomain = async (slug: string, domain?: string) => {
    const query = this.factory.getFindBySlugOrDomainSql(slug, domain);

    const tenants = await this.database.connect(async (connection) => {
      return connection.any(query);
    });

    if (tenants.length > 0) {
      if (tenants.some((tenant) => tenant.slug === slug)) {
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

  protected postCreate = async (customer: Customer): Promise<Customer> => {
    const saasConfig = getSaasConfig(this.config);

    if (
      saasConfig.subdomains === "disabled" ||
      !saasConfig.multiDatabase?.enabled
    ) {
      return customer;
    }

    await runMigrations(
      getDatabaseConfig(this.config.slonik),
      saasConfig.multiDatabase.migrations.path,
      customer as unknown as BaseCustomer,
    );

    return customer;
  };
}

export default CustomerService;
