import {
  createTableFragment,
  DefaultSqlFactory,
} from "@dzangolab/fastify-slonik";
import { sql } from "slonik";

import getSaasConfig from "../../config";

import type { SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow, QuerySqlToken } from "slonik";

/* eslint-disable brace-style */
class AccountSqlFactory<
    Account extends QueryResultRow,
    AccountCreateInput extends QueryResultRow,
    AccountUpdateInput extends QueryResultRow,
  >
  extends DefaultSqlFactory<Account, AccountCreateInput, AccountUpdateInput>
  implements SqlFactory<Account, AccountCreateInput, AccountUpdateInput>
{
  getFindByHostnameSql = (
    hostname: string,
    rootDomain: string,
  ): QuerySqlToken => {
    const query = sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE domain = ${hostname}
      OR (
        ${sql.identifier(["slug"])}
        || '.' ||
        ${rootDomain}
      ) = ${hostname};
    `;

    return query;
  };

  getFindBySlugOrDomainSql = (slug: string, domain?: string): QuerySqlToken => {
    const domainIdentifier = sql.identifier(["domain"]);
    const slugIdentifier = sql.identifier(["slug"]);

    const domainFilterFragment = domain
      ? sql.fragment`
        OR ${domainIdentifier} = ${domain}
      `
      : sql.fragment``;

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE
      ${slugIdentifier} = ${slug}
      ${domainFilterFragment};
    `;
  };

  getFindByUserIdSql = (userId: string): QuerySqlToken => {
    const accountUsersTable = createTableFragment(
      this.saasConfig.tables.accountUsers.name,
      this.schema,
    );

    return sql.type(this.validationSchema)`
      SELECT c.*
      FROM ${this.getTableFragment()} AS c
      JOIN ${accountUsersTable} AS cu on c.id = cu.account_id
      WHERE cu.user_id = ${userId};
    `;
  };

  get saasConfig() {
    return getSaasConfig(this.config);
  }
}

export default AccountSqlFactory;
