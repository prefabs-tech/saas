/* eslint-disable brace-style */
import AccountUserSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";
import AccountAwareBaseService from "../../service";

import type { QueryResultRow } from "slonik";

class AccountUserService<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends AccountAwareBaseService<T, C, U> {
  getUsers = async (): Promise<readonly T[]> => {
    const query = this.factory.getUsersSql();

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
