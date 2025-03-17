/* eslint-disable brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";
import { customAlphabet } from "nanoid";

import AccountSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";
import { NANOID_ALPHABET, NANOID_SIZE } from "../../constants";
import { validateAccountInput } from "../../lib/validateAccountSchema";
import runAccountMigrations from "../../migrations/runAccountMigrations";

import type { Account, AccountCreateInput } from "../../types";
import type { QueryResultRow } from "slonik";

class AccountService<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends BaseService<T, C, U> {
  create = async (data: C): Promise<T | undefined> => {
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
    })) as T;

    return result ? this.postCreate(result) : undefined;
  };

  findByHostname = async (hostname: string): Promise<T | null> => {
    const saasConfig = getSaasConfig(this.config);

    const query = this.factory.getFindByHostnameSql(
      hostname,
      saasConfig.rootDomain as string,
    );

    const account = await this.database.connect(async (connection) => {
      return connection.maybeOne(query);
    });

    return account;
  };

  findByUserId = async (userId: string): Promise<T | null> => {
    const query = this.factory.getFindByUserIdSql(userId);

    const account = await this.database.connect(async (connection) => {
      return connection.maybeOne(query);
    });

    return account;
  };

  validateSlugOrDomain = async (slug: string, domain?: string) => {
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
  };

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new AccountSqlFactory<T, C, U>(this);
    }

    return this._factory as AccountSqlFactory<T, C, U>;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accounts.name;
  }

  protected postCreate = async (account: T): Promise<T> => {
    if (
      this.saasConfig.subdomains === "disabled" ||
      !this.saasConfig.multiDatabase?.enabled
    ) {
      return account;
    }

    await runAccountMigrations(this.config, account as unknown as Account);

    return account;
  };
}

export default AccountService;
