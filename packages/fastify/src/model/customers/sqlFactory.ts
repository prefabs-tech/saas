import { DefaultSqlFactory } from "@dzangolab/fastify-slonik";
import { sql } from "slonik";
import { z } from "zod";

import type { SqlFactory } from "@dzangolab/fastify-slonik";
import type { QueryResultRow, QuerySqlToken } from "slonik";

/* eslint-disable brace-style */
class CustomerSqlFactory<
    Customer extends QueryResultRow,
    CustomerCreateInput extends QueryResultRow,
    CustomerUpdateInput extends QueryResultRow
  >
  extends DefaultSqlFactory<Customer, CustomerCreateInput, CustomerUpdateInput>
  implements SqlFactory<Customer, CustomerCreateInput, CustomerUpdateInput>
{
  /* eslint-enabled */

  getFindByHostnameSql = (
    hostname: string,
    rootDomain: string
  ): QuerySqlToken => {
    const query = sql.type(z.any())`
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
}

export default CustomerSqlFactory;
