import {
  createFilterFragment,
  createSortFragment,
  createLimitFragment,
  createTableFragment,
} from "@dzangolab/fastify-slonik";
import { TABLE_USERS } from "@dzangolab/fastify-user";
import { sql } from "slonik";

import AccountAwareSqlFactory from "../../sqlFactory";

import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type {
  FragmentSqlToken,
  IdentifierSqlToken,
  QueryResultRow,
  QuerySqlToken,
} from "slonik";

/* eslint-disable brace-style */
class AccountInvitationSqlFactory<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends AccountAwareSqlFactory<T, C, U> {
  /* eslint-enabled */
  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT 
        ${this.getTableIdentifier()}.*,
        ROW_TO_JSON(${this.getUserTableIdentifier()}) AS invited_by
      FROM ${this.getTableFragment()} AS ${this.getTableIdentifier()}
      JOIN ${this.getUserTableFragment()} AS ${this.getUserTableIdentifier()}
        ON ${this.getTableIdentifier()}.invited_by_id = ${this.getUserTableIdentifier()}.id
      ${createFilterFragment(filters, this.getTableIdentifier())}
      ${this.getAccountIdFilterFragment(!filters)}
      ${createSortFragment(this.getTableIdentifier(), this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };

  getTableIdentifier = (): IdentifierSqlToken => {
    return sql.identifier(["customer_invitations"]);
  };

  getUserTableFragment = (): FragmentSqlToken => {
    return createTableFragment(
      this.config.user.tables?.users?.name || TABLE_USERS,
      this.schema,
    );
  };

  getUserTableIdentifier = (): IdentifierSqlToken => {
    return sql.identifier(["users"]);
  };
}

export default AccountInvitationSqlFactory;
