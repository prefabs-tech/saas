/* eslint-disable prettier/prettier, brace-style */
import { BaseService } from "@dzangolab/fastify-slonik";

import AccountTypeSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";

import type { 
  AccountTypeCreateInput as BaseAccountTypeCreateInput,
  AccountTypeUpdateInput as BaseAccountTypeUpdateInput,
  AccountTypeI18nCreateInput 
} from "../../types";
import type { Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class AccountTypeService<
    AccountType extends QueryResultRow,
    AccountTypeCreateInput extends QueryResultRow,
    AccountTypeUpdateInput extends QueryResultRow
  >
  extends BaseService<
    AccountType,
    AccountTypeCreateInput,
    AccountTypeUpdateInput
  >
  implements
    Service<AccountType, AccountTypeCreateInput, AccountTypeUpdateInput>
{
  createWithI18ns = async (data: BaseAccountTypeCreateInput): Promise<AccountType | undefined> => {
    const result = await this.database.connect(async (connection) => {
      return connection.transaction(async (transactionConnection) => {
        const { i18ns, ...accountTypeInput } = data;

        const accountType = await transactionConnection.maybeOne(
          this.factory.getCreateSql(accountTypeInput as unknown as AccountTypeCreateInput)
        );
        
        if (accountType && i18ns) {
          await transactionConnection.query(
            this.factory.getCreateI18nsSql(accountType.id, i18ns as unknown as AccountTypeI18nCreateInput[])
          );
          
          return accountType;
        }
        
        return;
      });
    });
  
    return result ? await this.findById(result.id) ?? undefined : undefined;
  };

  updateWithI18ns = async (id: number, data: BaseAccountTypeUpdateInput): Promise<AccountType | undefined> => {
    const result = await this.database.connect(async (connection) => {
      return connection.transaction(async (transactionConnection) => {
        const { i18ns, ...accountTypeInput } = data;

        const accountType = await transactionConnection.maybeOne(
          this.factory.getUpdateSql(id, accountTypeInput as unknown as AccountTypeUpdateInput)
        );
        
        if (accountType && i18ns) {
          await transactionConnection.query(
            this.factory.getDeleteI18nsSql(accountType.id)
          );
          
          await transactionConnection.query(
            this.factory.getCreateI18nsSql(accountType.id, i18ns as unknown as AccountTypeI18nCreateInput[])
          );
          
          return accountType;
        }
        
        return;
      });
    });
  
    return result ? await this.findById(result.id) ?? undefined : undefined;
  };

  getAccountTypes = async (locale = "en") => {
    const query = this.factory.getAccountTypesSql(locale);

    const data = await this.database.connect((connection) => {
      return connection.any(query);
    });

    return data;
  };

  get factory() {
    if (!this.table) {
      throw new Error(`Service table is not defined`);
    }

    if (!this._factory) {
      this._factory = new AccountTypeSqlFactory<
        AccountType,
        AccountTypeCreateInput,
        AccountTypeUpdateInput
      >(this);
    }

    return this._factory as AccountTypeSqlFactory<
      AccountType,
      AccountTypeCreateInput,
      AccountTypeUpdateInput
    >;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accountTypes.name;
  }
}

export default AccountTypeService;
