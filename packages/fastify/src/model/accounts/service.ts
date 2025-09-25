import { BaseService } from "@prefabs.tech/fastify-slonik";
import { customAlphabet } from "nanoid";

import AccountSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";
import { NANOID_ALPHABET, NANOID_SIZE } from "../../constants";
import shouldUseSeparateDatabase from "../../lib/shouldUseSeparateDatabase";
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
    const { subdomains, multiDatabase } = this.saasConfig;

    if (subdomains === "disabled" || multiDatabase.mode === "disabled") {
      return account;
    }

    await runAccountMigrations(this.config, account as unknown as Account);

    return account;
  }

  protected async preCreate(
    data: AccountCreateInput,
  ): Promise<AccountCreateInput> {
    const { subdomains } = this.saasConfig;

    if (subdomains === "disabled" || !data.slug) {
      delete data.slug;
      delete data.domain;
    } else if (!data.domain) {
      delete data.domain;
    }

    validateAccountInput(this.config, data);

    if (data.slug) {
      await this.validateSlugOrDomain(
        data.slug as string,
        data.domain as string,
      );
    }

    const useSeparateDatabase = shouldUseSeparateDatabase(this.config, data);

    if (useSeparateDatabase) {
      const nanoid = customAlphabet(NANOID_ALPHABET, NANOID_SIZE);
      // [RL 2024-01-08] Added `s_` prefix to indicate that the database is a schema
      (data as AccountCreateInput).database = `s_${nanoid()}`;
    }

    delete data.useSeparateDatabase;

    return data;
  }

  protected async preUpdate(
    data: AccountUpdateInput,
  ): Promise<AccountUpdateInput> {
    if (this.saasConfig.subdomains === "disabled") {
      delete data.slug;
      delete data.domain;
    }

    return data;
  }
}

export default AccountService;
