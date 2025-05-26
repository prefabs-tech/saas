import { formatDate } from "@dzangolab/fastify-slonik";

import AccountInvitationSqlFactory from "./sqlFactory";
import getSaasConfig from "../../config";
import AccountAwareBaseService from "../../service";
import AccountService from "../accounts/service";

import type {
  AccountInvitation,
  AccountInvitationCreateInput,
  AccountInvitationUpdateInput,
} from "../../types";
import type { FilterInput } from "@dzangolab/fastify-slonik";

class AccountInvitationService extends AccountAwareBaseService<
  AccountInvitation,
  AccountInvitationCreateInput,
  AccountInvitationUpdateInput
> {
  async create(
    data: AccountInvitationCreateInput,
  ): Promise<AccountInvitation | undefined> {
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
  }

  async findOneByToken(token: string): Promise<AccountInvitation | null> {
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

    if (result) {
      const accountService = new AccountService(this.config, this.database);

      const account = await accountService.findById(result.accountId);

      if (account) {
        result.account = { id: account.id, name: account.name };
      }
    }

    return result;
  }

  get factory() {
    return super.factory as AccountInvitationSqlFactory;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get sqlFactoryClass() {
    return AccountInvitationSqlFactory;
  }

  get table() {
    return this.saasConfig.tables.accountInvitations.name;
  }

  protected validateUUID(uuid: string): boolean {
    const regexp = /^[\da-f]{8}(?:\b-[\da-f]{4}){3}\b-[\da-f]{12}$/gi;

    return regexp.test(uuid);
  }
}

export default AccountInvitationService;
