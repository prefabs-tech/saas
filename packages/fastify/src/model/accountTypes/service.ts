import { BaseService } from "@dzangolab/fastify-slonik";

import AccountTypeSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";

import type {
  AccountTypeCreateInput,
  AccountTypeUpdateInput,
  AccountTypeI18nCreateInput,
  AccountTypeI18nUpdateInput,
  AccountType,
} from "../../types";

class AccountTypeService extends BaseService<
  AccountType,
  AccountTypeCreateInput,
  AccountTypeUpdateInput & Record<string, unknown>
> {
  async createWithI18ns(
    data: AccountTypeCreateInput,
  ): Promise<AccountType | undefined> {
    const result = await this.database.connect(async (connection) => {
      return connection.transaction(async (transactionConnection) => {
        const { i18n, ...accountTypeInput } = data;

        const accountType = await transactionConnection.maybeOne(
          this.factory.getCreateSql(accountTypeInput as AccountTypeCreateInput),
        );

        if (accountType && i18n) {
          await transactionConnection.query(
            this.factory.getCreateI18nsSql(
              accountType.id,
              i18n as AccountTypeI18nCreateInput[],
            ),
          );

          return accountType;
        }

        return;
      });
    });

    return result ? ((await this.findById(result.id)) ?? undefined) : undefined;
  }

  async updateWithI18ns(
    id: number,
    data: AccountTypeUpdateInput,
  ): Promise<AccountType | undefined> {
    const result = await this.database.connect(async (connection) => {
      return connection.transaction(async (transactionConnection) => {
        const { i18n, ...accountTypeInput } = data;

        const accountType = await transactionConnection.maybeOne(
          this.factory.getUpdateSql(
            id,
            accountTypeInput as Record<string, unknown>,
          ),
        );

        if (accountType && i18n) {
          await transactionConnection.query(
            this.factory.getDeleteI18nsSql(accountType.id),
          );

          await transactionConnection.query(
            this.factory.getCreateI18nsSql(
              accountType.id,
              i18n as AccountTypeI18nUpdateInput[],
            ),
          );

          return accountType;
        }

        return;
      });
    });

    return result ? ((await this.findById(result.id)) ?? undefined) : undefined;
  }

  get factory() {
    return super.factory as AccountTypeSqlFactory;
  }

  get sqlFactoryClass() {
    return AccountTypeSqlFactory;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }
}

export default AccountTypeService;
