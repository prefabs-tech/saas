import { createTableFragment } from "@dzangolab/fastify-slonik";
import { TABLE_USERS } from "@dzangolab/fastify-user";
import { sql } from "slonik";

import getSaasConfig from "../../config";
import AccountAwareSqlFactory from "../../sqlFactory";

import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type {
  FragmentSqlToken,
  IdentifierSqlToken,
  QuerySqlToken,
} from "slonik";

/* eslint-disable brace-style */
class AccountInvitationSqlFactory extends AccountAwareSqlFactory {
  /* eslint-enabled */
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
      FROM ${this.getTableFragment()} AS ${this.tableIdentifier}
      JOIN ${this.getUserTableFragment()} AS ${this.getUserTableIdentifier()}
        ON ${this.tableIdentifier}.invited_by_id = ${this.getUserTableIdentifier()}.id
      ${this.getFilterFragment(filters)}
      ${this.getAccountIdFilterFragment(!filters)}
      ${this.getSortFragment(sort)}
      ${this.getLimitFragment(limit, offset)};
    `;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accountInvitations.name;
  }

  get tableIdentifier(): IdentifierSqlToken {
    return sql.identifier(["account_invitations"]);
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
