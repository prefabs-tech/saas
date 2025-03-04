import {
  createTableFragment,
  DefaultSqlFactory,
} from "@dzangolab/fastify-slonik";
import { sql, type QueryResultRow, type QuerySqlToken } from "slonik";

import getSaasConfig from "../../config";

import type { AccountTypeI18nCreateInput } from "../../types";
import type { SqlFactory } from "@dzangolab/fastify-slonik";

/* eslint-disable brace-style */
class AccountTypeSqlFactory<
    T extends QueryResultRow,
    C extends QueryResultRow,
    U extends QueryResultRow,
  >
  extends DefaultSqlFactory<T, C, U>
  implements SqlFactory<T, C, U>
{
  getAccountTypesSql = (locale = "en") => {
    const accountTypesI18nTable = createTableFragment(
      this.saasConfig.tables.accountTypesI18n.name,
      this.schema,
    );

    return sql.unsafe`
      SELECT at.id, 
      at.for_individual, 
      at.for_organization,
      i18n.name
      FROM ${this.getTableFragment()} AS at
      JOIN ${accountTypesI18nTable} AS i18n ON i18n.id = at.id
      WHERE i18n.locale = ${locale}
      ORDER BY at.id ASC;
    `;
  };

  getFindByIdSql = (id: number | string): QuerySqlToken => {
    const accountTypesI18nTable = createTableFragment(
      this.saasConfig.tables.accountTypesI18n.name,
      this.schema,
    );

    return sql.unsafe`
      SELECT 
        at.id, 
        at.for_individual, 
        at.for_organization, 
        COALESCE(
          json_agg(
            jsonb_build_object(
              'locale', i18n.locale,
              'name', i18n.name
            )
          ) FILTER (WHERE i18n.id IS NOT NULL), '[]'::json
        ) AS i18ns
      FROM ${this.getTableFragment()} AS at
      LEFT JOIN ${accountTypesI18nTable} AS i18n ON at.id = i18n.id
      WHERE at.id = ${id}
      GROUP BY at.id
      ORDER BY at.id ASC;
    `;
  };

  getCreateI18nsSql = (id: number, i18ns: AccountTypeI18nCreateInput[]) => {
    const accountTypesI18nTable = createTableFragment(
      this.saasConfig.tables.accountTypesI18n.name,
      this.schema,
    );

    return sql.unsafe`
      INSERT INTO ${accountTypesI18nTable} (id, locale, name) VALUES
      ${sql.join(
        i18ns.map(
          (i18n) => sql.fragment`(${id}, ${i18n.locale}, ${i18n.name})`,
        ),
        sql.fragment`,`,
      )}
      RETURNING *;
    `;
  };

  getDeleteI18nsSql = (id: number) => {
    const accountTypesI18nTable = createTableFragment(
      this.saasConfig.tables.accountTypesI18n.name,
      this.schema,
    );

    return sql.unsafe`
      DELETE FROM ${accountTypesI18nTable}
      WHERE id = ${id}
      RETURNING *;
    `;
  };

  get saasConfig() {
    return getSaasConfig(this.config);
  }
}

export default AccountTypeSqlFactory;
