/* eslint-disable brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";

import AccountUserSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class AccountUserService<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow,
  >
  extends BaseService<T, C, U>
  implements Service<T, C, U>
{
  getUsersByAccountId = async (accountId: string): Promise<readonly T[]> => {
    const query = this.factory.getUsersByAccountIdSql(accountId);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as readonly T[];
  };

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new AccountUserSqlFactory<T, C, U>(this);
    }

    return this._factory as AccountUserSqlFactory<T, C, U>;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accountUsers.name;
  }
}

export default AccountUserService;
