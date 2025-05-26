/* eslint-disable brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";
import { customAlphabet } from "nanoid";

import AccountSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";
import { NANOID_ALPHABET, NANOID_SIZE } from "../../constants";
import { validateAccountInput } from "../../lib/validateAccountSchema";
import runAccountMigrations from "../../migrations/runAccountMigrations";

import type {
  Account,
  AccountCreateInput,
  AccountUpdateInput,
} from "../../types";

class AccountService extends BaseService<
  Account,
  AccountCreateInput,
  AccountUpdateInput
> {
  async create(data: AccountCreateInput): Promise<Account | undefined> {
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
      (data as AccountCreateInput).database = `s_${nanoid()}`;
    }

    delete data.useSeparateDatabase;

    validateAccountInput(this.config, data);

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
    })) as Account;

    return result ? this.postCreate(result) : undefined;
  }

  async findByHostname(hostname: string): Promise<Account | null> {
    const saasConfig = getSaasConfig(this.config);

    const query = this.factory.getFindByHostnameSql(
      hostname,
      saasConfig.rootDomain as string,
    );

    const account = await this.database.connect(async (connection) => {
      return connection.maybeOne(query);
    });

    return account;
  }

  async findByUserId(userId: string): Promise<Account | null> {
    const query = this.factory.getFindByUserIdSql(userId);

    const account = await this.database.connect(async (connection) => {
      return connection.maybeOne(query);
    });

    return account;
  }

  async validateSlugOrDomain(slug: string, domain?: string) {
    const query = this.factory.getFindBySlugOrDomainSql(slug, domain);

    const accounts = await this.database.connect(async (connection) => {
      return connection.any(query);
    });

    if (accounts.length > 0) {
      if (accounts.some((account) => account.slug === slug)) {
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
  }

  get factory() {
    return super.factory as AccountSqlFactory;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get sqlFactoryClass() {
    return AccountSqlFactory;
  }

  get table() {
    return this.saasConfig.tables.accounts.name;
  }

  protected async postCreate(account: Account): Promise<Account> {
    if (
      this.saasConfig.subdomains === "disabled" ||
      !this.saasConfig.multiDatabase?.enabled
    ) {
      return account;
    }

    await runAccountMigrations(this.config, account as unknown as Account);

    return account;
  }
}

export default AccountService;
