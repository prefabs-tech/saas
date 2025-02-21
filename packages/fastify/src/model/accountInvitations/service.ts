import { formatDate, BaseService } from "@dzangolab/fastify-slonik";

import AccountInvitationSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";

import type { FilterInput, Service } from "@dzangolab/fastify-slonik";
import type { QueryResultRow } from "slonik";

class AccountInvitationService<
    AccountInvitation extends QueryResultRow,
    AccountInvitationCreateInput extends QueryResultRow,
    AccountInvitationUpdateInput extends QueryResultRow,
  >
  extends BaseService<
    AccountInvitation,
    AccountInvitationCreateInput,
    AccountInvitationUpdateInput
  >
  // eslint-disable-next-line prettier/prettier
  implements Service<AccountInvitation, AccountInvitationCreateInput, AccountInvitationUpdateInput> {
  deleteByIdAndAccountId = async (
    id: number | string,
    accountId: string,
  ): Promise<AccountInvitation | null> => {
    const query = this.factory.getDeleteByIdAndAccountIdSql(id, accountId);

    const result = await this.database.connect((connection) => {
      return connection.maybeOne(query);
    });

    return result;
  };

  create = async (
    data: AccountInvitationCreateInput,
  ): Promise<AccountInvitation | undefined> => {
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
    })) as AccountInvitation;

    return result ? this.postCreate(result) : undefined;
  };

  findByToken = async (token: string): Promise<AccountInvitation | null> => {
    if (!this.validateUUID(token)) {
      // eslint-disable-next-line unicorn/no-null
      return null;
    }

    const query = this.factory.getFindByTokenSql(token);

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
      this._factory = new AccountInvitationSqlFactory<
        AccountInvitation,
        AccountInvitationCreateInput,
        AccountInvitationUpdateInput
      >(this);
    }

    return this._factory as AccountInvitationSqlFactory<
      AccountInvitation,
      AccountInvitationCreateInput,
      AccountInvitationUpdateInput
    >;
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
