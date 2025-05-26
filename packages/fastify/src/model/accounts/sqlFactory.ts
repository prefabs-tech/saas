import {
  createTableFragment,
  DefaultSqlFactory,
} from "@dzangolab/fastify-slonik";
import { sql } from "slonik";

import getSaasConfig from "../../config";

import type { QuerySqlToken } from "slonik";
class AccountSqlFactory extends DefaultSqlFactory {
  getFindByHostnameSql(hostname: string, rootDomain: string): QuerySqlToken {
    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE domain = ${hostname}
      OR (
        ${sql.identifier(["slug"])}
        || '.' ||
        ${rootDomain}
      ) = ${hostname}
      ${this.getSoftDeleteFilterFragment(false)};
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

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      WHERE
      ${slugIdentifier} = ${slug}
      ${domainFilterFragment}
      ${this.getSoftDeleteFilterFragment(false)};
    `;
  }

  getFindByUserIdSql(userId: string): QuerySqlToken {
    const accountUsersTable = createTableFragment(
      this.saasConfig.tables.accountUsers.name,
      this.schema,
    );

    return sql.type(this.validationSchema)`
      SELECT c.*
      FROM ${this.getTableFragment()} AS a
      JOIN ${accountUsersTable} AS au on a.id = au.account_id
      WHERE au.user_id = ${userId}
      ${this.getSoftDeleteFilterFragment(false)};
    `;
  }

  get saasConfig() {
    return getSaasConfig(this.config);
  }

  get table() {
    return this.saasConfig.tables.accounts.name;
  }
}

export default AccountSqlFactory;
