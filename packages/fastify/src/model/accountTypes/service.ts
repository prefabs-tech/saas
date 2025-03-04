/* eslint-disable brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";

import AccountTypeSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";

import type {
  AccountTypeCreateInput,
  AccountTypeUpdateInput,
  AccountTypeI18nCreateInput,
  AccountTypeI18nUpdateInput,
} from "../../types";
import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class AccountTypeService<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow,
  >
  extends BaseService<T, C, U>
  implements Service<T, C, U>
{
  createWithI18ns = async (
    data: AccountTypeCreateInput,
  ): Promise<T | undefined> => {
    const result = await this.database.connect(async (connection) => {
      return connection.transaction(async (transactionConnection) => {
        const { i18n, ...accountTypeInput } = data;

        const accountType = await transactionConnection.maybeOne(
          this.factory.getCreateSql(accountTypeInput as unknown as C),
        );

        if (accountType && i18n) {
          await transactionConnection.query(
            this.factory.getCreateI18nsSql(
              accountType.id,
              i18n as unknown as Record<string, AccountTypeI18nCreateInput>,
            ),
          );

          return accountType;
        }

        return;
      });
    });

    return result ? ((await this.findById(result.id)) ?? undefined) : undefined;
  };

  getAccountTypes = async () => {
    const query = this.factory.getAccountTypesSql();

    const data = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return data;
  };

  updateWithI18ns = async (
    id: number,
    data: AccountTypeUpdateInput,
  ): Promise<T | undefined> => {
    const result = await this.database.connect(async (connection) => {
      return connection.transaction(async (transactionConnection) => {
        const { i18n, ...accountTypeInput } = data;

        const accountType = await transactionConnection.maybeOne(
          this.factory.getUpdateSql(id, accountTypeInput as unknown as U),
        );

        if (accountType && i18n) {
          await transactionConnection.query(
            this.factory.getDeleteI18nsSql(accountType.id),
          );

          await transactionConnection.query(
            this.factory.getCreateI18nsSql(
              accountType.id,
              i18n as unknown as Record<string, AccountTypeI18nUpdateInput>,
            ),
          );

          return accountType;
        }

        return;
      });
    });

    return result ? ((await this.findById(result.id)) ?? undefined) : undefined;
  };

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new AccountTypeSqlFactory<T, C, U>(this);
    }

    return this._factory as AccountTypeSqlFactory<T, C, U>;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accountTypes.name;
  }
}

export default AccountTypeService;
