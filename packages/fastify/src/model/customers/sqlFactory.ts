import {
  createFilterFragment,
  createTableIdentifier,
  DefaultSqlFactory,
} from "@dzangolab/fastify-slonik";
import { sql } from "slonik";

import type { FilterInput, SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow, QuerySqlToken } from "slonik";

/* eslint-disable brace-style */
class CustomerSqlFactory<
    Customer extends QueryResultRow,
    CustomerCreateInput extends QueryResultRow,
    CustomerUpdateInput extends QueryResultRow,
  >
  extends DefaultSqlFactory<Customer, CustomerCreateInput, CustomerUpdateInput>
  implements SqlFactory<Customer, CustomerCreateInput, CustomerUpdateInput>
{
  /* eslint-enabled */
  getFindBySql = (filters?: FilterInput): QuerySqlToken => {
    const tableIdentifier = createTableIdentifier(this.table, this.schema);

    return sql.type(this.validationSchema)`
      SELECT *
      FROM ${this.getTableFragment()}
      ${createFilterFragment(filters, tableIdentifier)}
    `;
  };

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
}

export default CustomerSqlFactory;
