import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import { sql } from "slonik";

import getSaasConfig from "../../config";

import type { SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow, QuerySqlToken } from "slonik";

/* eslint-disable brace-style */
class AccountSqlFactory<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow,
  >
  extends DefaultSqlFactory<T, C, U>
  implements SqlFactory<T, C, U>
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

  get saasConfig() {
    return getSaasConfig(this.config);
  }
}

export default AccountSqlFactory;
