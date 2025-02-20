/* eslint-disable prettier/prettier, brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";

import AccountUserSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";

import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class AccountUserService<
    AccountUser extends QueryResultRow,
    AccountUserCreateInput extends QueryResultRow,
    AccountUserUpdateInput extends QueryResultRow
  >
  extends BaseService<
    AccountUser,
    AccountUserCreateInput,
    AccountUserUpdateInput
  >
  implements
    Service<AccountUser, AccountUserCreateInput, AccountUserUpdateInput>
{
  getUsersByAccountId = async (
    accountId: string,
  ): Promise<readonly AccountUser[]> => {
    const query = this.factory.getUsersByAccountIdSql(accountId);

    const result = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return result as readonly AccountUser[];
  };

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new AccountUserSqlFactory<
        AccountUser,
        AccountUserCreateInput,
        AccountUserUpdateInput
      >(this);
    }

    return this._factory as AccountUserSqlFactory<
      AccountUser,
      AccountUserCreateInput,
      AccountUserUpdateInput
    >;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accountUsers.name;
  }
}

export default AccountUserService;
