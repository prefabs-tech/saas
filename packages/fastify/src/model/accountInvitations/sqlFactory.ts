import {
  createFilterFragment,
  createSortFragment,
  createLimitFragment,
  createTableFragment,
} from "@dzangolab/fastify-slonik";
import { sql } from "slonik";

import AccountEnabledSqlFactory from "../../sqlFactory";

import type { FilterInput, SortInput } from "@dzangolab/fastify-slonik";
import type { QueryResultRow, QuerySqlToken } from "slonik";

/* eslint-disable brace-style */
class AccountInvitationSqlFactory<
  T extends QueryResultRow,
  C extends QueryResultRow,
  U extends QueryResultRow,
> extends AccountEnabledSqlFactory<T, C, U> {
  /* eslint-enabled */
  getListSql = (
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken => {
    const usersTableFragment = createTableFragment(
      this.config.user.table?.name || "users",
      this.schema,
    );

    return sql.type(this.validationSchema)`
      SELECT ${this.getTableFragment()}.*, ROW_TO_JSON("user") AS "invited_by"
      FROM ${this.getTableFragment()}
      JOIN ${usersTableFragment} AS "user" ON ${this.getTableFragment()}."invited_by_id" = "user"."id"
      ${createFilterFragment(filters, this.getTableIdentifier())}
      ${this.getAccountIdFilterFragment(!!filters)}
      ${createSortFragment(this.getTableIdentifier(), this.getSortInput(sort))}
      ${createLimitFragment(limit, offset)};
    `;
  };
}

export default AccountInvitationSqlFactory;
