import {
  createTableFragment,
  DefaultSqlFactory,
} from "@dzangolab/fastify-slonik";
import { sql } from "slonik";

import getSaasConfig from "../../config";

import type { IdentifierSqlToken, QuerySqlToken } from "slonik";
class AccountSqlFactory extends DefaultSqlFactory {
  getFindByHostnameSql(hostname: string, rootDomain: string): QuerySqlToken {
    const filterFragment = sql.fragment`domain = ${hostname}
      OR (
        ${sql.identifier(["slug"])}
        || '.' ||
        ${rootDomain}
      ) = ${hostname}`;

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.tableFragment}
      ${this.getWhereFragment({ filterFragment: filterFragment })}
    `;
  }

  getFindBySlugOrDomainSql(slug: string, domain?: string): QuerySqlToken {
    const domainIdentifier = sql.identifier(["domain"]);
    const slugIdentifier = sql.identifier(["slug"]);

    const domainFilterFragment = domain
      ? sql.fragment`
        OR ${domainIdentifier} = ${domain}
      `
      : sql.fragment``;

    const filterFragment = sql.fragment`${slugIdentifier} = ${slug} ${domainFilterFragment}`;

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.tableFragment}
      ${this.getWhereFragment({ filterFragment })};
    `;
  }

  getFindByUserIdSql(userId: string): QuerySqlToken {
    const accountUsersTable = createTableFragment(
      this.saasConfig.tables.accountUsers.name,
      this.schema,
    );

    return sql.type(this.validationSchema)`
      SELECT ${this.tableIdentifier}.*
      FROM ${this.tableFragment} AS ${this.tableIdentifier}
      JOIN ${accountUsersTable} AS ${this.getAccountUserTableIdentifier} 
        on ${this.tableIdentifier}.id = ${this.getAccountUserTableIdentifier}.account_id
      ${this.getWhereFragment({
        filterFragment: sql.fragment`${this.getAccountUserTableIdentifier}.user_id = ${userId}`,
      })};
    `;
  }

  get getAccountUserTableIdentifier(): IdentifierSqlToken {
    return sql.identifier(["account_users"]);
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accounts.name;
  }
}

export default AccountSqlFactory;
