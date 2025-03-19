import {
  createFilterFragment,
  createLimitFragment,
  createSortFragment,
  createTableFragment,
  FilterInput,
  SortInput,
} from "@dzangolab/fastify-slonik";
import { TABLE_USERS } from "@dzangolab/fastify-user";
import {
  FragmentSqlToken,
  IdentifierSqlToken,
  sql,
  type QueryResultRow,
  type QuerySqlToken,
} from "slonik";

import AccountAwareSqlFactory from "../../sqlFactory";

/* eslint-disable brace-style */
class AccountUserSqlFactory<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends AccountAwareSqlFactory<T, C, U> {
  getUsersSql = (): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT
        ${this.getUserTableIdentifier()}.*,
        ${this.getTableIdentifier()}.role_id as role,
        ${this.getTableIdentifier()}.date_start,
        ${this.getTableIdentifier()}.date_end,
        ${this.getTableIdentifier()}.created_at,
        ${this.getTableIdentifier()}.updated_at,
        ${this.getTableIdentifier()}.account_id
      FROM ${this.getTableFragment()} AS ${this.getTableIdentifier()}
      INNER JOIN ${this.getUserTableFragment()} AS ${this.getUserTableIdentifier()}
        ON (${this.getUserTableIdentifier()}.id = ${this.getTableIdentifier()}.user_id)
      ${this.getAccountIdFilterFragment(true)};
    `;
  };

  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken => {
    return sql.type(this.validationSchema)`
      SELECT
        ${this.getUserTableIdentifier()}.*,
        ${this.getTableIdentifier()}.role_id as role,
        ${this.getTableIdentifier()}.date_start,
        ${this.getTableIdentifier()}.date_end,
        ${this.getTableIdentifier()}.created_at,
        ${this.getTableIdentifier()}.updated_at,
        ${this.getTableIdentifier()}.account_id
      FROM ${this.getTableFragment()} AS ${this.getTableIdentifier()}
      INNER JOIN ${this.getUserTableFragment()} AS ${this.getUserTableIdentifier()}
        ON (${this.getUserTableIdentifier()}.id = ${this.getTableIdentifier()}.user_id)
      ${createFilterFragment(filters, this.getTableIdentifier())}
      ${this.getAccountIdFilterFragment(!filters)}
      ${createSortFragment(this.getTableIdentifier(), this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };

  getTableIdentifier = (): IdentifierSqlToken => {
    return sql.identifier(["customer_users"]);
  };

  getUserTableFragment = (): FragmentSqlToken => {
    return createTableFragment(
      this.config.user.table?.name || TABLE_USERS,
      this.schema,
    );
  };

  getUserTableIdentifier = (): IdentifierSqlToken => {
    return sql.identifier(["users"]);
  };
}

export default AccountUserSqlFactory;
