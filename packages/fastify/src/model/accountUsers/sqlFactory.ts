import {
  createTableFragment,
  DefaultSqlFactory,
} from "@dzangolab/fastify-slonik";
import { TABLE_USERS } from "@dzangolab/fastify-user";
import { sql, type QueryResultRow, type QuerySqlToken } from "slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class AccountUserSqlFactory<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow,
  >
  extends DefaultSqlFactory<T, C, U>
  implements SqlFactory<T, C, U>
{
  getUsersByAccountIdSql = (accountId: string): QuerySqlToken => {
    const usersTableFragment = createTableFragment(
      this.config.user.table?.name || TABLE_USERS,
      this.schema,
    );

    return sql.type(this.validationSchema)`
      SELECT
        u.*, cu.role_id as role, cu.date_start,
        cu.date_end, cu.created_at, cu.updated_at, cu.account_id
      FROM ${this.getTableFragment()} AS cu
      INNER JOIN ${usersTableFragment} AS u ON (u.id = cu.user_id)
      WHERE cu.account_id = ${accountId}
    `;
  };
}

export default AccountUserSqlFactory;
