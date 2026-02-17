import {
  createTableFragment,
  FilterInput,
  SortInput,
} from "@prefabs.tech/fastify-slonik";
import { TABLE_USERS } from "@prefabs.tech/fastify-user";
import humps from "humps";
import {
  FragmentSqlToken,
  IdentifierSqlToken,
  sql,
  type QuerySqlToken,
} from "slonik";

import getSaasConfig from "../../config";
import AccountAwareSqlFactory from "../../sqlFactory";

import type { AccountUserCreateInput } from "../../types";
class AccountUserSqlFactory extends AccountAwareSqlFactory {
  getCreateSql(data: AccountUserCreateInput): QuerySqlToken {
    const identifiers = [];
    const values = [];

    for (const column in data) {
      const value = data[column as keyof AccountUserCreateInput];

      if (!value) {
        continue;
      }

      identifiers.push(sql.identifier([humps.decamelize(column)]));
      values.push(value);
    }

    return sql.type(this.validationSchema)`
      INSERT INTO ${this.tableFragment}
        (${sql.join(identifiers, sql.fragment`, `)})
      VALUES (${sql.join(values, sql.fragment`, `)})
      ON CONFLICT (account_id, user_id)
      DO NOTHING
      RETURNING *;
    `;
  }

  getUsersSql(): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT
        ${this.getUserTableIdentifier()}.*,
        ${this.tableIdentifier}.role_id as role,
        ${this.tableIdentifier}.disabled,
        ${this.tableIdentifier}.date_start,
        ${this.tableIdentifier}.date_end,
        ${this.tableIdentifier}.created_at,
        ${this.tableIdentifier}.updated_at,
        ${this.tableIdentifier}.account_id
      FROM ${this.tableFragment} AS ${this.tableIdentifier}
      INNER JOIN ${this.getUserTableFragment()} AS ${this.getUserTableIdentifier()}
        ON (${this.getUserTableIdentifier()}.id = ${this.tableIdentifier}.user_id)
      ${this.getWhereFragment()};
    `;
  }

  getListSql(
    limit: number,
    offset?: number,
    filters?: FilterInput,
    sort?: SortInput[],
  ): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT
        ${this.getUserTableIdentifier()}.*,
        ${this.tableIdentifier}.role_id as role,
        ${this.tableIdentifier}.disabled,
        ${this.tableIdentifier}.date_start,
        ${this.tableIdentifier}.date_end,
        ${this.tableIdentifier}.created_at,
        ${this.tableIdentifier}.updated_at,
        ${this.tableIdentifier}.account_id
      FROM ${this.tableFragment} AS ${this.tableIdentifier}
      INNER JOIN ${this.getUserTableFragment()} AS ${this.getUserTableIdentifier()}
        ON (${this.getUserTableIdentifier()}.id = ${this.tableIdentifier}.user_id)
        ${this.getWhereFragment({ filters })}
        ${this.getSortFragment(sort)}
        ${this.getLimitFragment(limit, offset)};
    `;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accountUsers.name;
  }

  get tableIdentifier(): IdentifierSqlToken {
    return sql.identifier(["account_users"]);
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

export default AccountUserSqlFactory;
