import type { FilterInput, SortInput } from "@prefabs.tech/fastify-slonik";
import type {
  FragmentSqlToken,
  IdentifierSqlToken,
  QuerySqlToken,
} from "slonik";

import { createTableFragment } from "@prefabs.tech/fastify-slonik";
import { TABLE_USERS } from "@prefabs.tech/fastify-user";
import { sql } from "slonik";

import getSaasConfig from "../../config";
import AccountAwareSqlFactory from "../../sqlFactory";

class AccountInvitationSqlFactory extends AccountAwareSqlFactory {
  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accountInvitations.name;
  }

  get tableIdentifier(): IdentifierSqlToken {
    return sql.identifier(["account_invitations"]);
  }

  getListSql(
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT 
        ${this.tableIdentifier}.*,
        ROW_TO_JSON(${this.getUserTableIdentifier()}) AS invited_by
      FROM ${this.tableFragment} AS ${this.tableIdentifier}
      JOIN ${this.getUserTableFragment()} AS ${this.getUserTableIdentifier()}
        ON ${this.tableIdentifier}.invited_by_id = ${this.getUserTableIdentifier()}.id
      ${this.getWhereFragment({ filters })}
      ${this.getSortFragment(sort)}
      ${this.getLimitFragment(limit, offset)};
    `;
  }

  protected getUserTableFragment(): FragmentSqlToken {
    return createTableFragment(
      this.config.user.tables?.users?.name || TABLE_USERS,
      this.schema,
    );
  }

  protected getUserTableIdentifier(): IdentifierSqlToken {
    return sql.identifier(["users"]);
  }
}

export default AccountInvitationSqlFactory;
