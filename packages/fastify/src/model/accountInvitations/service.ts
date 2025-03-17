/* eslint-disable brace-style */
import { formatDate } from "@dzangolab/fastify-slonik";

import AccountInvitationSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";
import AccountEnabledService from "../../service";

import type { FilterInput } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class AccountInvitationService<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends AccountEnabledService<T, C, U> {
  create = async (data: C): Promise<T | undefined> => {
    const filters = {
      AND: [
        { key: "accountId", operator: "eq", value: data.accountId },
        { key: "email", operator: "eq", value: data.email },
        { key: "acceptedAt", operator: "eq", value: "null" },
        { key: "expiresAt", operator: "gt", value: formatDate(new Date()) },
        { key: "revokedAt", operator: "eq", value: "null" },
      ],
    } as FilterInput;

    const validInvitationCount = await this.count(filters);

    // only one valid invitation is allowed per email per account
    if (validInvitationCount > 0) {
      throw new Error(
        `Invitation already exists for email '${data.email}' for accountId '${data.accountId}'`,
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

  findOneByToken = async (token: string): Promise<T | null> => {
    if (!this.validateUUID(token)) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }

    const query = this.factory.getFindOneSql({
      key: "token",
      operator: "eq",
      value: token,
    });

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result;
  };

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new AccountInvitationSqlFactory<T, C, U>(this);
    }

    return this._factory as AccountInvitationSqlFactory<T, C, U>;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accountInvitations.name;
  }

  protected validateUUID = (uuid: string): boolean => {
    const regexp = /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi;

    return regexp.test(uuid);
  };
}

export default AccountInvitationService;
