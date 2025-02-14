import {
  createTableFragment,
  DefaultSqlFactory,
} from "@dzangolab/fastify-slonik";
import { TABLE_USERS } from "@dzangolab/fastify-user";
import { sql, type QueryResultRow, type QuerySqlToken } from "slonik";

import type { SqlFactory } from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class CustomerUserSqlFactory<
    CustomerUser extends QueryResultRow,
    CustomerUserCreateInput extends QueryResultRow,
    CustomerUserUpdateInput extends QueryResultRow,
  >
  extends DefaultSqlFactory<
    CustomerUser,
    CustomerUserCreateInput,
    CustomerUserUpdateInput
  >
  implements
    SqlFactory<CustomerUser, CustomerUserCreateInput, CustomerUserUpdateInput>
{
  getUsersByCustomerIdSql = (customerId: string): QuerySqlToken => {
    const usersTableFragment = createTableFragment(
      this.config.user.table?.name || TABLE_USERS,
      this.schema,
    );

    return sql.type(this.validationSchema)`
      SELECT
        u.*, cu.role_id as role, cu.date_start,
        cu.date_end, cu.created_at, cu.updated_at, cu.customer_id
      FROM ${this.getTableFragment()} AS cu
      INNER JOIN ${usersTableFragment} AS u ON (u.id = cu.user_id)
      WHERE cu.customer_id = ${customerId}
    `;
  };
}

export default CustomerUserSqlFactory;
